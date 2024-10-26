import { Context, Schema } from 'koishi';
// npm publish --workspace koishi-plugin-avalon-lizard --access public --registry https://registry.npmjs.org
export const inject = ['database'];
export const name = 'avalon-lizard';

export const usage = `

## 阿瓦隆游戏规则
<details>
### 游戏目标：

  - 好人阵营：成功完成 3 次任务。
         
  - 坏人阵营：使 3 次任务失败，或成功刺杀梅林。
### 游戏流程：

  - 游戏开始后，玩家需要通过指令“阿瓦隆 加入”加入游戏。

  - 在满足玩家人数（5到11人）后，使用“阿瓦隆 分配”指令进行角色分配。

  - 根据不同角色，玩家可以看到的信息不同。

  - 由系统选择发车人，根据提示选择参与本轮任务的玩家。

  - 参与任务的玩家对任务成功与否进行投票。

  - 最多5轮任务后，游戏结束。
### 刺杀机制：

  - 刺客可以在任何时候刺杀梅林，需要自行判断身份。

  - 若刺杀成功，坏人阵营胜利；若刺杀失败，好人阵营胜利。

  - 刺杀一旦执行，游戏立即结束。
---
### 注意：游戏过程中请遵守游戏规则，确保公平公正。祝你游戏愉快！
</details>

## todo：
- 添加房间系统，防止串号

- 完善规则，添加湖中仙女

- 添加图片，完善视觉效果

`;

export interface Config {}

export const Config = Schema.object({});

interface Player {
  id: string;
  name: string;
  role?: string;
  team?: string;
  voted?: boolean;
  vote?: 'success' | 'fail';
}

interface Game {
  players: Player[];
  missionResults: boolean[];
  round: number;
  started: boolean;
  selectedPlayers: Player[];
  currentLeaderIndex: number;
  maxRounds: number;
  currentVotes: { [key: string]: 'success' | 'fail' | undefined };
}

const roleDistribution = {
  5: { good: ['梅林', '派西维尔', '忠臣'], evil: ['莫甘娜', '刺客'] },
  6: { good: ['梅林', '派西维尔', '忠臣', '忠臣'], evil: ['莫甘娜', '刺客'] },
  7: { good: ['梅林', '派西维尔', '忠臣', '忠臣'], evil: ['莫甘娜', '刺客', '爪牙'] },
  8: { good: ['梅林', '派西维尔', '忠臣', '忠臣', '忠臣'], evil: ['莫甘娜', '刺客', '爪牙'] },
  9: { good: ['梅林', '派西维尔', '忠臣', '忠臣', '忠臣'], evil: ['莫甘娜', '刺客', '奥伯伦', '莫德雷德'] },
  10: { good: ['梅林', '派西维尔', '忠臣', '忠臣', '忠臣', '忠臣'], evil: ['莫甘娜', '刺客', '奥伯伦', '莫德雷德'] },
  11: { good: ['梅林', '派西维尔', '忠臣', '忠臣', '忠臣', '好兰斯洛特'], evil: ['莫甘娜', '刺客', '奥伯伦', '莫德雷德', '坏兰斯洛特'] }
};

const missionSizes = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
  11: [3, 4, 5, 6, 6]
};

export function apply(ctx: Context, config: Config) {
  let game: Game = {
    players: [],
    missionResults: [],
    round: 0,
    started: false,
    selectedPlayers: [],
    currentLeaderIndex: 0,
    maxRounds: 5,
    currentVotes: {},
  };

  const avalonCommand = ctx.command('阿瓦隆', '用机器人玩一局紧张刺激的阿瓦隆吧~');

  avalonCommand
    .subcommand('.规则', '查看游戏规则')
    .action(async ({ session }) => {
      const rules = `
阿瓦隆游戏规则

1. 游戏目标：
 - 好人阵营：成功完成 3 次任务。
 - 坏人阵营：使 3 次任务失败，或成功刺杀梅林。

2. 游戏流程：
 - 游戏开始后，玩家需要通过指令“阿瓦隆 加入”加入游戏。
 - 在满足玩家人数（5到11人）后，使用“阿瓦隆 分配”指令进行角色分配。
 - 根据不同角色，玩家可以看到的信息不同。
 - 由系统选择发车人，根据提示使用“阿瓦隆 发车”指令选择参与本轮任务的玩家。
 - 参与任务的玩家使用“阿瓦隆 投票”指令对任务成功与否进行投票。
 - 最多5轮任务后，游戏结束。

 3. 刺杀机制：
 - 刺客可以在任何时候刺杀梅林，需要自行判断身份。
 - 若刺杀成功，坏人阵营胜利；若刺杀失败，好人阵营胜利。
 - 刺杀一旦执行，游戏立即结束。

注意：游戏过程中请遵守游戏规则，确保公平公正。祝你游戏愉快！`;

      await session.send(rules);
    });

  avalonCommand
    .subcommand('.角色 <role:string>', '查看角色信息')
    .action(async ({ session }, role) => {
      const rolesInfo = {
        梅林: {
          type: '好人',
          task: '隐藏身份，避免被刺客发现，取得最终胜利。',
          vote: '只能投任务成功。',
          visibleRoles: '除了莫德雷德，其他坏人。',
        },
        派西维尔: {
          type: '好人',
          task: '保护梅林，取得最终胜利。',
          vote: '只能投任务成功。',
          visibleRoles: '梅林和莫甘娜，但不确定谁是梅林，谁是莫甘娜。',
        },
        忠臣: {
          type: '好人',
          task: '保护梅林，取得最终胜利。',
          vote: '只能投任务成功。',
        },
        莫甘娜: {
          type: '坏人',
          task: '破坏任务，取得最终胜利。',
          vote: '可以投任务成功，也可以投任务失败。',
          visibleRoles: '除了奥伯伦的其他坏人。',
        },
        刺客: {
          type: '坏人',
          task: '破坏任务或刺杀梅林，取得最终胜利。',
          vote: '可以投任务成功，也可以投任务失败。',
          visibleRoles: '除了奥伯伦的其他坏人。',
          special: '可以通过刺杀梅林带领坏人阵营胜利。',
        },
        爪牙: {
          type: '坏人',
          task: '破坏任务，取得最终胜利。',
          vote: '可以投任务成功，也可以投任务失败。',
          visibleRoles: '除了奥伯伦的其他坏人。',
        },
        莫德雷德: {
          type: '坏人',
          task: '破坏任务，取得最终胜利。',
          vote: '可以投任务成功，也可以投任务失败。',
          visibleRoles: '除了奥伯伦的其他坏人。',
        },
        奥伯伦: {
          type: '坏人',
          task: '破坏任务，取得最终胜利。',
          vote: '可以投任务成功，也可以投任务失败。',
          special: '是独立的坏人，无法看到其他坏人。',
        },
        好兰斯洛特: {
          type: '好人',
          task: '保护梅林，取得最终胜利。',
          vote: '只能投任务成功。',
          visibleRoles: '坏兰斯洛特。',
        },
        坏兰斯洛特: {
          type: '坏人',
          task: '破坏任务，取得最终胜利。',
          vote: '可以投任务成功，也可以投任务失败。',
          visibleRoles: '好兰斯洛特。',
        },
      };

      const roleInfo = rolesInfo[role];
      if (roleInfo) {
        let responseMessage = `角色：${role}\n阵营：${roleInfo.type}\n任务：${roleInfo.task}\n投票：${roleInfo.vote}`;
        if (roleInfo.visibleRoles) {
          responseMessage += `\n可见角色：${roleInfo.visibleRoles}`;
        }
        if (roleInfo.special) {
          responseMessage += `\n特殊能力：${roleInfo.special}`;
        }
        await session.send(responseMessage);
      } else {
        await session.send('所有角色如下：梅林、派西维尔、忠臣、莫甘娜、刺客、爪牙、莫德雷德、奥伯伦、好兰斯洛特、坏兰斯洛特');
      }
    });

  avalonCommand
    .subcommand('.开始', '开始新的一局阿瓦隆')
    .action(async ({ session }) => {
      if (game.started) return session.send('游戏已经开始，请先结束当前游戏。');
      game = {
        players: [],
        missionResults: [],
        round: 0,
        started: true,
        selectedPlayers: [],
        currentLeaderIndex: 0,
        maxRounds: 5,
        currentVotes: {},
      };
      await session.send('阿瓦隆游戏开始！请输入"阿瓦隆 加入"加入游戏。');
      return;
    });

  avalonCommand
    .subcommand('.加入', '加入当前的阿瓦隆对局')
    .action(async ({ session }) => {
      if (!game.started) return session.send('游戏尚未开始，请先用"阿瓦隆 开始"开始游戏。');
      const playerExists = game.players.some(p => p.id === session.userId);
      if (playerExists) return session.send('你已经加入了游戏。');
      game.players.push({ id: session.userId, name: session.username });
      await session.send(`${session.username} 已加入游戏！目前玩家数: ${game.players.length}`);
      return;
    });

  avalonCommand
    .subcommand('.分配', '分配阿瓦隆角色')
    .action(async ({ session }) => {
      const numPlayers = game.players.length;
      if (numPlayers < 5 || numPlayers > 11) {
        await session.send('玩家人数不满足要求，至少需要5名玩家，最多支持11名玩家。');
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
        let message = `你的角色是：${player.role}，你是${player.team === 'good' ? '好人阵营' : '坏人阵营'}`;
  
        switch (player.role) {
          case '梅林':
            const merlinVisibleEvil = shuffledPlayers
              .filter(p => p.team === 'evil' && p.role !== '莫德雷德')
              .sort(() => Math.random() - 0.5);
            message += `。\n\n你的任务是隐藏自己的身份，避免被刺客发现，取得最终胜利。`;
            message += `\n\n你只能投任务成功。`;
            message += `\n\n除了莫德雷德，其他坏人有：${merlinVisibleEvil.map(p => p.name).join(', ')}`;
            break;
  
          case '派西维尔':
            const merlinAndMorgana = shuffledPlayers
              .filter(p => ['梅林', '莫甘娜'].includes(p.role))
              .sort(() => Math.random() - 0.5);
            message += `。\n\n你的任务是保护梅林，取得最终胜利。`;
            message += `\n\n你只能投任务成功。`;
            message += `\n\n你可以看到的两个玩家是：${merlinAndMorgana.map(p => p.name).join(', ')}，但你不知道谁是梅林，谁是莫甘娜。`;
            break;
  
          case '忠臣':
            message += `。\n\n你的任务是保护梅林，取得最终胜利。`;
            message += `\n\n你只能投任务成功。`;
            break;

          case '莫甘娜':
          case '刺客':
          case '爪牙':
          case '莫德雷德':
            const evilVisibleOthers = shuffledPlayers
              .filter(p => p.team === 'evil' && p.role !== '奥伯伦')
              .sort(() => Math.random() - 0.5);
            message += `。\n\n你的任务是破坏任务，取得最终胜利。`;
            message += `\n\n你可以投任务成功，也可以投任务失败。`;
            message += `\n\n除了奥伯伦，其他坏人有：${evilVisibleOthers.map(p => p.name).join(', ')}`;
            break;
  
          case '奥伯伦':
            message += `。\n\n你的任务是破坏任务，取得最终胜利。`;
            message += `\n\n你可以投任务成功，也可以投任务失败。`;
            message += '\n\n你是独立的坏人，无法看到其他坏人。';
            break;
  
          case '好兰斯洛特':
            const evilLancelot = shuffledPlayers.find(p => p.role === '坏兰斯洛特');
            if (evilLancelot) {
              message += `。\n\n你可以看到坏兰斯洛特是：${evilLancelot.name}`;
            }
            message += `\n\n你的任务是破坏任务，取得最终胜利。`;
            message += `\n\n你可以投任务成功，也可以投任务失败。`;
            break;
  
          case '坏兰斯洛特':
            const goodLancelot = shuffledPlayers.find(p => p.role === '好兰斯洛特');
            if (goodLancelot) {
              message += `。\n\n你可以看到好兰斯洛特是：${goodLancelot.name}`;
            }
            message += `\n\n你的任务是破坏任务，取得最终胜利。`;
            message += `\n\n你可以投任务成功，也可以投任务失败。`;
            break;
  
          default:
            break;
        }
  
        await session.bot.sendPrivateMessage(player.id, message);
      }
  
      game.round = 1;
    game.currentLeaderIndex = Math.floor(Math.random() * game.players.length);
    const missionSize = missionSizes[numPlayers][game.round - 1];
    await session.send(`角色已分配！游戏即将开始。第 ${game.round} 轮任务需要 ${missionSize} 名成员参与。当前发车人是：${game.players[game.currentLeaderIndex].name}`);
    return;
  });

  avalonCommand
    .subcommand('.发车 <players:string>', '选择任务成员，格式：阿瓦隆 发车 玩家1,玩家2,...（用英文逗号隔开）')
    .action(async ({ session }, players) => {
      if (!game.started) return session.send('游戏尚未开始，请先开始游戏。');

      const currentLeader = game.players[game.currentLeaderIndex];
      if (session.userId !== currentLeader.id) {
        await session.send(`只有当前发车人 ${currentLeader.name} 可以发起发车指令。`);
        return;
      }

      if (game.round > 0 && game.currentVotes) {
        const allVoted = Object.values(game.currentVotes).every(vote => vote !== undefined);
        if (!allVoted) {
          return session.send(`上一轮的投票尚未完成，无法进行新一轮的上车。`);
        }
      }
      
      if (!players) {
        await session.send('请选择参与任务的玩家，例如：阿瓦隆 上车 玩家1,玩家2（用英文逗号隔开）');
        return;
      }

      const numPlayers = game.players.length;
      const missionSize = missionSizes[numPlayers][game.round - 1];
      session.send(`第 ${game.round} 轮任务，当前需要 ${missionSize} 名玩家参与。`);
    
      const selectedNames = players.split(',').map(name => name.trim()).filter(name => name);
      const selectedIds = selectedNames.map(name => {
        const player = game.players.find(p => p.name.toLowerCase() === name.toLowerCase());
        return player ? player.id : null;
      }).filter(id => id !== null);

      if (selectedIds.length !== missionSize) {
        await session.send(`选择的玩家数量错误。当前任务需要选择 ${missionSize} 名玩家。`);
        return;
      }

      game.selectedPlayers = game.players.filter(p => selectedIds.includes(p.id));
      game.round++;
      game.missionResults.push(false);

      const message = `任务成员选择完毕: ${selectedNames.join(', ')}。请投票决定任务成功与否。`;
      session.send(message);

      game.players.forEach(player => {
        player.voted = false;
        player.vote = undefined;
      });

      game.selectedPlayers.forEach(player => {
        session.send(`${player.name} 请投票，输入 "阿瓦隆 投票 成功" 或 "阿瓦隆 投票 失败"`);
      });
    });

  avalonCommand
    .subcommand('.投票 <vote:string>', '投票决定任务成功与否')
    .action(async ({ session }, vote) => {
      if (!game.started) return session.send('游戏尚未开始，请先开始游戏。');
  
      const isParticipant = game.selectedPlayers.some(player => player.id === session.userId);
      if (!isParticipant) return session.send('只有参与任务的玩家可以投票。');
  
      const validVotes = ['成功', '失败'];
      if (!validVotes.includes(vote)) return session.send('投票无效，请输入 "阿瓦隆 投票 成功" 或 "阿瓦隆 投票 失败"');
  
      const currentVote = vote === '成功' ? 'success' : 'fail';
  
      const participant = game.selectedPlayers.find(player => player.id === session.userId);
      if (!participant.voted) {
        participant.voted = true;
        participant.vote = currentVote;
        await session.send(`${session.username} 已投票。`);
      } else {
        return session.send('您已经投过票了。');
      }
  
      const allVoted = game.selectedPlayers.every(player => player.voted);
      if (!allVoted) return;
  
      const passVotes = game.selectedPlayers.filter(player => player.vote === 'success').length;
      const failVotes = game.selectedPlayers.filter(player => player.vote === 'fail').length;
      const missionSize = missionSizes[game.players.length][game.round - 1];
  
      let missionSuccess = failVotes < missionSize;
      game.missionResults[game.round - 1] = missionSuccess;
  
      const resultsMessage = `投票结果：成功票: ${passVotes}，失败票: ${failVotes}`;
      await session.send(resultsMessage);
      await session.send(missionSuccess ? '任务成功！' : '任务失败！');
  
      const goodWins = game.missionResults.filter(result => result).length >= 3;
      const evilWins = game.missionResults.filter(result => !result).length >= 3;
  
      if (goodWins) {
        await session.send('好人阵营胜利！游戏结束。');
        game.started = false;

        if (game.round >= 5) {
            const assassin = game.players.find(player => player.role === '刺客');
            if (assassin) {
                await session.send(`刺客 ${assassin.name}，您是否执行刺杀指令？（请回复 "是" 或 "否"）`);
            }
        }
    } else if (evilWins) {
        await session.send('坏人阵营胜利！游戏结束。');
        game.started = false;
    } else if (game.round < 5) {
        game.currentLeaderIndex = (game.currentLeaderIndex + 1) % game.players.length;
        await session.send(`轮到下一位发车人：${game.players[game.currentLeaderIndex].name}`);
    } else {
        game.currentLeaderIndex = (game.currentLeaderIndex + 1) % game.players.length;
        await session.send(`轮到下一位发车人：${game.players[game.currentLeaderIndex].name}`);
    }
});
  
avalonCommand
  .subcommand('.刺杀 <playerName:string>', '刺杀指定玩家')
  .action(async ({ session }, playerName) => {
    if (!game.started) return session.send('游戏尚未开始，请先开始游戏。');

    const assassin = game.players.find(p => p.role === '刺客' && p.id === session.userId);
    if (!assassin) return session.send('你不是刺客，无法进行刺杀。');

    const targetPlayer = game.players.find(p => p.name === playerName);
    if (!targetPlayer) return session.send('未找到该玩家，请检查姓名拼写。');

    if (targetPlayer.role === '梅林') {
      session.send(`刺杀成功！${targetPlayer.name} 是梅林，坏人阵营胜利！`);
    } else {
      session.send(`刺杀失败！${targetPlayer.name} 不是梅林，好人阵营胜利！`);
    }

    game.started = false;
    await session.send('本局阿瓦隆游戏结束。');
    return;
});


  avalonCommand
    .subcommand('.结束', '结束当前游戏')
    .action(async ({ session }) => {
      if (!game.started) return session.send('当前没有游戏进行中。');
      game.started = false;
      await session.send('游戏已结束。');
      return;
    });
}