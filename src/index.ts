import { Context, Schema, h } from 'koishi';
// npm publish --workspace koishi-plugin-avalon-lizard --access public --registry https://registry.npmjs.org
import { usageText, Game, roleDistribution, missionSizes, rules, rolesInfo, roleImages } from './usage';

export const inject = ['database'];
export const name = 'avalon-lizard';
export const usage = usageText;

export interface Config { }
export const Config = Schema.object({});

const MIN_PLAYERS = 5;
const MAX_PLAYERS = 11;
const MAX_ROUNDS = 5;
const WINNING_SCORE = 3;

export function apply(ctx: Context) {
    let game: Game = {
        players: [],
        missionResults: [],
        round: 0,
        started: false,
        selectedPlayers: [],
        currentLeaderIndex: 0,
        maxRounds: MAX_ROUNDS,
        currentVotes: {},
    };

    let fixedChannelId = '';

    const avalonCommand = ctx.command('阿瓦隆', '用机器人玩一局紧张刺激的阿瓦隆吧~').alias('avalon');

    const sendMessage = async (session, message) => await session.send(message);
    const sendPrivateMessage = async (session, userId, message) => await session.bot.sendPrivateMessage(userId, message);
    const sendChannelMessage = async (session, message) => await session.bot.sendMessage(fixedChannelId, message);

    const isGameStarted = (session) => {
        if (!game.started) {
            sendMessage(session, '游戏尚未开始，请先用"阿瓦隆 开始"开始游戏。');
            return false;
        }
        return true;
    };

    const isPlayerLeader = (session) => {
        const currentLeader = game.players[game.currentLeaderIndex];
        if (session.userId !== currentLeader.id) {
            sendMessage(session, `只有当前发车人 ${currentLeader.name} 可以发起发车指令。`);
            return false;
        }
        return true;
    };

    const isPlayerParticipant = (session) => {
        const isParticipant = game.selectedPlayers.some(player => player.id === session.userId);
        if (!isParticipant) {
            sendMessage(session, '只有参与任务的玩家可以投票。');
            return false;
        }
        return true;
    };

    avalonCommand
        .subcommand('.规则', '查看游戏规则')
        .action(async ({ session }) => await sendMessage(session, rules));

    avalonCommand
        .subcommand('.角色 <role:string>', '查看角色信息')
        .action(async ({ session }, role) => {
            const roleInfo = rolesInfo[role];
            if (roleInfo) {
                let responseMessage = `角色：${role}\n阵营：${roleInfo.type}\n任务：${roleInfo.task}\n投票：${roleInfo.vote}`;
                if (roleInfo.visibleRoles) responseMessage += `\n可见角色：${roleInfo.visibleRoles}`;
                if (roleInfo.special) responseMessage += `\n特殊能力：${roleInfo.special}`;
                await sendMessage(session, responseMessage);
            } else {
                await sendMessage(session, '所有角色如下，根据参与游戏人数不同，出现角色亦不同：\n梅林、派西维尔、忠臣、莫甘娜、刺客、爪牙、莫德雷德、奥伯伦、好兰斯洛特、坏兰斯洛特');
            }
        });

    avalonCommand
        .subcommand('.开始', '开始新的一局阿瓦隆')
        .action(async ({ session }) => {
            if (game.started) {
                await sendMessage(session, '游戏已经开始，请先结束当前游戏。');
                return;
            }
            fixedChannelId = session.channelId;
            game = {
                players: [],
                missionResults: [],
                round: 0,
                started: true,
                selectedPlayers: [],
                currentLeaderIndex: 0,
                maxRounds: MAX_ROUNDS,
                currentVotes: {},
            };
            await sendMessage(session, '阿瓦隆游戏开始，建议更换一个简单的昵称。输入"阿瓦隆 加入"加入游戏。');
        });

    avalonCommand
        .subcommand('.加入', '加入当前的阿瓦隆对局')
        .action(async ({ session }) => {
            if (!isGameStarted(session)) return;
            const playerExists = game.players.some(p => p.id === session.userId);
            if (playerExists) {
                await sendMessage(session, '你已经加入了游戏。');
                return;
            }
            game.players.push({ id: session.userId, name: session.username });
            await sendMessage(session, `${session.username} 已加入游戏！目前玩家数: ${game.players.length}`);
        });

    avalonCommand
        .subcommand('.分配', '分配阿瓦隆角色')
        .action(async ({ session }) => {
            if (!isGameStarted(session)) return;
            const numPlayers = game.players.length;
            if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
                await sendMessage(session, `玩家人数不满足要求，至少需要${MIN_PLAYERS}名玩家，最多支持${MAX_PLAYERS}名玩家。`);
                return;
            }
            const { good, evil } = roleDistribution[numPlayers];
            const shuffledPlayers = [...game.players].sort(() => Math.random() - 0.5);
            const numGood = good.length;
            shuffledPlayers.forEach((player, index) => {
                player.role = index < numGood ? good[index] : evil[index - numGood];
                player.team = index < numGood ? 'good' : 'evil';
            });
            for (const player of shuffledPlayers) {
                let message = `你的角色是：${player.role}，你是${player.team === 'good' ? '正义阵营' : '邪恶阵营'}。`;
                switch (player.role) {
                    case '梅林':
                        const merlinVisibleEvil = shuffledPlayers.filter(p => p.team === 'evil' && p.role !== '莫德雷德').sort(() => Math.random() - 0.5);
                        message += `\n\n你的任务是隐藏自己的身份，避免被刺客发现，取得最终胜利。\n\n你只能投任务成功。\n\n除了莫德雷德，其他邪恶阵营有：${merlinVisibleEvil.map(p => p.name).join(', ')}`;
                        break;
                    case '派西维尔':
                        const merlinAndMorgana = shuffledPlayers.filter(p => ['梅林', '莫甘娜'].includes(p.role)).sort(() => Math.random() - 0.5);
                        message += `\n\n你的任务是保护梅林，取得最终胜利。\n\n你只能投任务成功。\n\n你可以看到的两个玩家是：${merlinAndMorgana.map(p => p.name).join(', ')}，但你不知道谁是梅林，谁是莫甘娜。`;
                        break;
                    case '忠臣':
                        message += `\n\n你的任务是保护梅林，取得最终胜利。\n\n你只能投任务成功。`;
                        break;
                    case '莫甘娜':
                    case '刺客':
                    case '爪牙':
                    case '莫德雷德':
                        const evilVisibleOthers = shuffledPlayers.filter(p => p.team === 'evil' && p.role !== '奥伯伦').sort(() => Math.random() - 0.5);
                        message += `\n\n你的任务是破坏任务，取得最终胜利。\n\n你可以投任务成功，也可以投任务失败。\n\n其他邪恶阵营有：${evilVisibleOthers.map(p => p.name).join(', ')}`;
                        break;
                    case '奥伯伦':
                        message += `\n\n你的任务是破坏任务，取得最终胜利。\n\n你可以投任务成功，也可以投任务失败。\n\n你是独立的邪恶阵营，无法看到其他邪恶阵营。`;
                        break;
                    case '好兰斯洛特':
                        const evilLancelot = shuffledPlayers.find(p => p.role === '坏兰斯洛特');
                        if (evilLancelot) message += `\n\n你可以看到坏兰斯洛特是：${evilLancelot.name}`;
                        message += `\n\n你的任务是破坏任务，取得最终胜利。\n\n你可以投任务成功，也可以投任务失败。`;
                        break;
                    case '坏兰斯洛特':
                        const goodLancelot = shuffledPlayers.find(p => p.role === '好兰斯洛特');
                        if (goodLancelot) message += `\n\n你可以看到好兰斯洛特是：${goodLancelot.name}`;
                        message += `\n\n你的任务是破坏任务，取得最终胜利。\n\n你可以投任务成功，也可以投任务失败。`;
                        break;
                }
                const imageUrl = roleImages[player.role];
                await sendPrivateMessage(session, player.id, `${h.image(imageUrl)}\n${message}`);
            }
            game.round = 1;
            game.currentLeaderIndex = Math.floor(Math.random() * game.players.length);
            const missionSize = missionSizes[numPlayers][game.round - 1];
            await sendMessage(session, `角色已分配！游戏即将开始。第 ${game.round} 轮任务需要 ${missionSize} 名成员参与。\n当前发车人是：${game.players[game.currentLeaderIndex].name}，请在当前群聊使用指令“阿瓦隆 发车 玩家1,玩家2”进行选择`);
        });

    avalonCommand
        .subcommand('.发车 <players:string>', '选择任务成员')
        .action(async ({ session }, players) => {
            if (!isGameStarted(session) || !isPlayerLeader(session)) return;
            if (game.round > 0 && game.currentVotes && !Object.values(game.currentVotes).every(vote => vote !== undefined)) {
                await sendMessage(session, '上一轮的投票尚未完成，无法进行新一轮的上车。');
                return;
            }
            if (!players) {
                await sendMessage(session, '请使用指令“阿瓦隆 发车 玩家1,玩家2”选择参与任务的玩家！');
                return;
            }
            const normalizedPlayers = players.replace(/，/g, ',');
            const selectedNames = normalizedPlayers.split(',').map(name => name.trim()).filter(name => name);
            const numPlayers = game.players.length;
            const missionSize = missionSizes[numPlayers][game.round - 1];
            const selectedIds = selectedNames.map(name => game.players.find(p => p.name.toLowerCase() === name.toLowerCase())?.id).filter(id => id !== null);
            if (selectedIds.length !== missionSize) {
                await sendMessage(session, `选择的玩家数量错误。当前任务需要选择 ${missionSize} 名玩家。`);
                return;
            }
            game.selectedPlayers = game.players.filter(p => selectedIds.includes(p.id));
            game.players.forEach(player => {
                player.voted = false;
                player.vote = undefined;
            });
            game.missionResults.push(false);
            await sendMessage(session, `任务成员选择完毕: ${selectedNames.join(', ')}。请投票决定任务成功与否。`);
            game.selectedPlayers.forEach(player => {
                sendMessage(session, `${player.name} 请投票，输入 "阿瓦隆 投票 成功" 或 "阿瓦隆 投票 失败"`);
            });
        });

    avalonCommand
        .subcommand('.投票 <vote:string>', '投票决定任务成功与否')
        .action(async ({ session }, vote) => {
            if (!isGameStarted(session) || !isPlayerParticipant(session)) return;
            const validVotes = ['成功', '失败'];
            if (!validVotes.includes(vote)) {
                await sendMessage(session, '投票无效，请输入 "阿瓦隆 投票 成功" 或 "阿瓦隆 投票 失败"');
                return;
            }
            const currentVote = vote === '成功' ? 'success' : 'fail';
            const participant = game.selectedPlayers.find(player => player.id === session.userId);
            if (!participant.voted) {
                participant.voted = true;
                participant.vote = currentVote;
                await sendMessage(session, `${session.username} 已投票。`);
                await sendChannelMessage(session, `${session.username} 已投票。`);
            } else {
                await sendMessage(session, '您已经投过票了。');
                return;
            }
            const allVoted = game.selectedPlayers.every(player => player.voted);
            if (!allVoted) return;
            const passVotes = game.selectedPlayers.filter(player => player.vote === 'success').length;
            const failVotes = game.selectedPlayers.filter(player => player.vote === 'fail').length;
            const missionSize = missionSizes[game.players.length][game.round];
            let missionSuccess;
            if (game.round === 4 && [7, 8, 9, 10, 11].includes(game.players.length)) {
                missionSuccess = failVotes < 2;
            } else {
                missionSuccess = failVotes === 0;
            }
            game.missionResults[game.round - 1] = missionSuccess;
            const resultsMessage = `投票结果：成功票: ${passVotes}，失败票: ${failVotes}`;
            await sendChannelMessage(session, resultsMessage);
            await sendChannelMessage(session, missionSuccess ? '任务成功！' : '任务失败！');
            game.round++;
            const goodWins = game.missionResults.filter(result => result).length >= WINNING_SCORE;
            const evilWins = game.missionResults.filter(result => !result).length >= WINNING_SCORE;
            if (goodWins) {
                await sendChannelMessage(session, '正义阵营即将胜利！');
                const assassin = game.players.find(player => player.role === '刺客');
                if (assassin) {
                    const assassinTime = `刺客 ${assassin.name}，请您选择您认为的梅林进行刺杀。输入"阿瓦隆 刺杀 玩家名"`;
                    await sendChannelMessage(session, assassinTime);
                }
            } else if (evilWins) {
                await sendChannelMessage(session, '邪恶阵营胜利！游戏已结束。');
                fixedChannelId = '';
                game.started = false;
            } else if (game.round < MAX_ROUNDS) {
                game.currentLeaderIndex = (game.currentLeaderIndex + 1) % game.players.length;
                const leaderMessage = `轮到下一位发车人：${game.players[game.currentLeaderIndex].name}。\n当前为第 ${game.round} 轮任务，需要 ${missionSize} 名成员参与。`;
                await sendChannelMessage(session, leaderMessage);
            }
        });

    avalonCommand
        .subcommand('.查验 <playerName:string>', '持有湖中仙女的车长查验玩家身份')
        .action(async ({ session }, playerName) => {
            if (!isGameStarted(session)) return;
            if (game.players.length < 8 || game.players.length > 11) {
                await sendMessage(session, '当前游戏人数不引入湖中仙女，不能查验。');
                return;
            }
            if (game.round < 2 || game.round > 4) {
                await sendMessage(session, '当前任务轮数不引入湖中仙女，不能查验。');
                return;
            }
            const currentLeader = game.players[game.currentLeaderIndex];
            if (currentLeader.id !== session.userId) {
                await sendMessage(session, '只有当前的车长可以使用此指令。');
                return;
            }
            if (currentLeader.voted) {
                await sendMessage(session, '当前任务已使用查验功能。');
                return;
            }
            const targetPlayer = game.players.find(p => p.name === playerName);
            if (!targetPlayer) {
                await sendMessage(session, `没有找到名为 ${playerName} 的玩家。`);
                return;
            }
            const identityMessage = `${targetPlayer.name}是${targetPlayer.team === 'good' ? '正义阵营' : '邪恶阵营'}`;
            const channelMessage = `车长查验了${targetPlayer.name}的身份，他可以选择公开或不公开。'}`;
            await sendMessage(session, identityMessage);
            await sendChannelMessage(session, channelMessage);
            currentLeader.voted = true;
        });

    avalonCommand
        .subcommand('.刺杀 <playerName:string>', '刺杀指定玩家')
        .action(async ({ session }, playerName) => {
            if (!isGameStarted(session)) return;
            const assassin = game.players.find(p => p.role === '刺客' && p.id === session.userId);
            if (!assassin) {
                await sendMessage(session, '你不是刺客，无法进行刺杀。');
                return;
            }
            const targetPlayer = game.players.find(p => p.name === playerName);
            if (!targetPlayer) {
                await sendMessage(session, '未找到该玩家，请检查姓名拼写。');
                return;
            }
            if (targetPlayer.role === '梅林') {
                await sendMessage(session, `刺杀成功！${targetPlayer.name} 是梅林，邪恶阵营胜利！`);
            } else {
                await sendMessage(session, `刺杀失败！${targetPlayer.name} 不是梅林，正义阵营胜利！`);
            }
            game.started = false;
            await sendMessage(session, '游戏已结束。');
            fixedChannelId = '';
        });

    avalonCommand
        .subcommand('.结束', '结束当前游戏')
        .action(async ({ session }) => {
            if (!game.started) {
                await sendMessage(session, '当前没有游戏进行中。');
                return;
            }
            game.started = false;
            await sendMessage(session, '游戏已结束。');
            fixedChannelId = '';
        });
}