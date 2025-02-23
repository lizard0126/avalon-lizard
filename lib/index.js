var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  inject: () => inject,
  name: () => name,
  usage: () => usage
});
module.exports = __toCommonJS(src_exports);
var import_koishi = require("koishi");

// src/usage.ts
var import_url = require("url");
var import_path = require("path");
var usageText = `
# 🎮 阿瓦隆游戏插件
## 通过机器人实现多人阿瓦隆游戏，支持角色分配、任务投票、刺杀等完整游戏流程

## 请确保在群聊中使用，并遵守游戏规则，享受紧张刺激的阿瓦隆对局！
---

<details>
<summary><strong><span style="font-size: 1.3em; color: #2a2a2a;">游戏目标</span></strong></summary>

### 好人阵营
- **目标**：成功完成 3 次任务。

### 坏人阵营
- **目标**：使 3 次任务失败，或成功刺杀梅林。
</details>

<details>
<summary><strong><span style="font-size: 1.3em; color: #2a2a2a;">游戏流程</span></strong></summary>

1. **查看角色信息**：
   - 查看特定角色的信息，例如梅林、刺客等。
   - 示例：
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 角色 梅林 // 查看梅林的角色信息</pre>

2. **开始新游戏**：
   - 使用“阿瓦隆 开始”指令开始一局新的游戏(群聊)。
   - 示例：
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 开始 // 开始一局新的阿瓦隆游戏</pre>

3. **加入游戏**：
   - 游戏开始后，玩家需要通过指令“阿瓦隆 加入”加入游戏(群聊)。
   - 示例：
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 加入 // 加入当前游戏</pre>

4. **角色分配**：
   - 在满足玩家人数（5到11人）后，使用“阿瓦隆 分配”指令进行角色分配(群聊)。
   - 示例：
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 分配 // 分配角色给所有玩家</pre>

5. **任务阶段**：
   - 由系统选择发车人，根据提示选择参与本轮任务的玩家(群聊)。
   - 参与任务的玩家对任务成功与否进行投票(私聊)。
   - 示例：
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 发车 玩家1,玩家2 // 选择任务成员</pre>
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 投票 成功 // 投票任务成功</pre>
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 投票 失败 // 投票任务失败</pre>

6. **游戏结束**：
   - 随时可以主动停止游戏(群聊)。
   - 示例：
     <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 结束 // 结束当前游戏</pre>
</details>

<details>
<summary><strong><span style="font-size: 1.3em; color: #2a2a2a;">刺杀机制</span></strong></summary>

- **刺杀规则**：
  - 刺客可以在任何时候刺杀梅林(群聊)，需要自行判断身份。
  - 若刺杀成功，坏人阵营胜利；若刺杀失败，好人阵营胜利。
  - 刺杀一旦执行，游戏立即结束。
- **示例**：
  <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 刺杀 玩家名 // 刺客刺杀指定玩家</pre>
</details>

<details>
<summary><strong><span style="font-size: 1.3em; color: #2a2a2a;">湖中仙女</span></strong></summary>

- **规则**：
  - 游戏人数为 8 到 11 人时，引入湖中仙女规则。
  - 在第二、三、四轮任务发车前，车长持有湖中仙女，可以查验任意一人身份。
- **示例**：
  <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">阿瓦隆 查验 玩家名 // 车长查验指定玩家身份</pre>
</details>
---

<details>
<summary><strong><span style="font-size: 1.3em; color: #2a2a2a;">如果要反馈建议或报告问题</span></strong></summary>

<strong>可以[点这里](https://github.com/lizard0126/koishi-plugin-avalon-lizard/issues)创建议题~</strong>
</details>

<details>
<summary><strong><span style="font-size: 1.3em; color: #2a2a2a;">如果喜欢我的插件</span></strong></summary>

<strong>可以[请我喝可乐](https://ifdian.net/a/lizard0126)，没准就有动力更新新功能了~</strong>
</details>
`;
var roleDistribution = {
  5: { good: ["梅林", "派西维尔", "忠臣"], evil: ["莫甘娜", "刺客"] },
  6: { good: ["梅林", "派西维尔", "忠臣", "忠臣"], evil: ["莫甘娜", "刺客"] },
  7: { good: ["梅林", "派西维尔", "忠臣", "忠臣"], evil: ["莫甘娜", "刺客", "爪牙"] },
  8: { good: ["梅林", "派西维尔", "忠臣", "忠臣", "忠臣"], evil: ["莫甘娜", "刺客", "爪牙"] },
  9: { good: ["梅林", "派西维尔", "忠臣", "忠臣", "忠臣"], evil: ["莫甘娜", "刺客", "奥伯伦", "莫德雷德"] },
  10: { good: ["梅林", "派西维尔", "忠臣", "忠臣", "忠臣", "忠臣"], evil: ["莫甘娜", "刺客", "奥伯伦", "莫德雷德"] },
  11: { good: ["梅林", "派西维尔", "忠臣", "忠臣", "忠臣", "好兰斯洛特"], evil: ["莫甘娜", "刺客", "奥伯伦", "莫德雷德", "坏兰斯洛特"] }
};
var missionSizes = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
  11: [3, 4, 5, 6, 6]
};
var rules = `
阿瓦隆游戏规则

1. 游戏目标：
 - 正义阵营：成功完成 3 次任务。
 - 邪恶阵营：使 3 次任务失败，或成功刺杀梅林。

2. 游戏流程：
 - 游戏开始后，玩家需要通过指令“阿瓦隆 加入”加入游戏(群聊)。
 - 在满足玩家人数（5到11人）后，使用“阿瓦隆 分配”指令进行角色分配(群聊)。
 - 根据不同角色，玩家可以看到的信息不同。
 - 由系统选择发车人，根据提示使用“阿瓦隆 发车”指令选择参与本轮任务的玩家(群聊)。
 - 参与任务的玩家使用“阿瓦隆 投票”指令对任务成功与否进行投票(私聊)。
 - 最多5轮任务后，游戏结束。

3. 刺杀机制：
 - 刺客可以在任何时候刺杀梅林，需要自行判断身份。
 - 若刺杀成功，邪恶阵营胜利；若刺杀失败，正义阵营胜利。
 - 刺杀一旦执行，游戏立即结束。

 4. 湖中仙女：
 - 游戏人数为8到11人时，引入湖中仙女规则。
 - 在第二、三、四轮任务发车前，车长持有湖中仙女，发车前可以使用“阿瓦隆 查验”指令查验任意一人身份。

游戏过程中请遵守游戏规则，确保公平公正。祝你游戏愉快！
`;
var rolesInfo = {
  梅林: {
    type: "正义",
    task: "隐藏身份，取得最终胜利。",
    vote: "只能投票任务成功。",
    visibleRoles: "除了莫德雷德以外的邪恶阵营。"
  },
  派西维尔: {
    type: "正义",
    task: "保护梅林，取得最终胜利。",
    vote: "只能投票任务成功。",
    visibleRoles: "梅林和莫甘娜，但不确定谁是梅林，谁是莫甘娜。"
  },
  忠臣: {
    type: "正义",
    task: "保护梅林，取得最终胜利。",
    vote: "只能投票任务成功。"
  },
  莫甘娜: {
    type: "邪恶",
    task: "破坏任务，取得最终胜利。",
    vote: "可以投票任务成功，也可以投票任务失败。",
    visibleRoles: "除了奥伯伦的其他邪恶阵营。"
  },
  刺客: {
    type: "邪恶",
    task: "破坏任务或刺杀梅林，取得最终胜利。",
    vote: "可以投票任务成功，也可以投票任务失败。",
    visibleRoles: "除了奥伯伦的其他邪恶阵营。",
    special: "可以通过刺杀梅林带领邪恶阵营胜利。"
  },
  爪牙: {
    type: "邪恶",
    task: "破坏任务，取得最终胜利。",
    vote: "可以投票任务成功，也可以投票任务失败。",
    visibleRoles: "除了奥伯伦的其他邪恶阵营。"
  },
  莫德雷德: {
    type: "邪恶",
    task: "破坏任务，取得最终胜利。",
    vote: "可以投票任务成功，也可以投票任务失败。",
    visibleRoles: "除了奥伯伦的其他邪恶阵营。"
  },
  奥伯伦: {
    type: "邪恶",
    task: "破坏任务，取得最终胜利。",
    vote: "可以投票任务成功，也可以投票任务失败。",
    special: "无法看到任何人的身份。"
  },
  好兰斯洛特: {
    type: "正义",
    task: "保护梅林，取得最终胜利。",
    vote: "只能投票任务成功。",
    visibleRoles: "坏兰斯洛特。"
  },
  坏兰斯洛特: {
    type: "邪恶",
    task: "破坏任务，取得最终胜利。",
    vote: "可以投票任务成功，也可以投票任务失败。",
    visibleRoles: "好兰斯洛特。"
  }
};
var roleImages = {
  "梅林": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/ml.jpg")).href,
  "派西维尔": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/pxwe.jpg")).href,
  "忠臣": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/zc.jpg")).href,
  "莫甘娜": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/mgn.jpg")).href,
  "刺客": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/blslt.jpg")).href,
  "爪牙": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/zy.jpg")).href,
  "莫德雷德": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/mdld.jpg")).href,
  "奥伯伦": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/abl.jpg")).href,
  "好兰斯洛特": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/glslt.jpg")).href,
  "坏兰斯洛特": (0, import_url.pathToFileURL)((0, import_path.resolve)(__dirname, "../assets/blslt.jpg")).href
};

// src/index.ts
var inject = ["database"];
var name = "avalon-lizard";
var usage = usageText;
var Config = import_koishi.Schema.object({});
var MIN_PLAYERS = 5;
var MAX_PLAYERS = 11;
var MAX_ROUNDS = 5;
var WINNING_SCORE = 3;
function apply(ctx) {
  let game = {
    players: [],
    missionResults: [],
    round: 0,
    started: false,
    selectedPlayers: [],
    currentLeaderIndex: 0,
    maxRounds: MAX_ROUNDS,
    currentVotes: {}
  };
  let fixedChannelId = "";
  const avalonCommand = ctx.command("阿瓦隆", "用机器人玩一局紧张刺激的阿瓦隆吧~").alias("avalon");
  const sendMessage = /* @__PURE__ */ __name(async (session, message) => await session.send(message), "sendMessage");
  const sendPrivateMessage = /* @__PURE__ */ __name(async (session, userId, message) => await session.bot.sendPrivateMessage(userId, message), "sendPrivateMessage");
  const sendChannelMessage = /* @__PURE__ */ __name(async (session, message) => await session.bot.sendMessage(fixedChannelId, message), "sendChannelMessage");
  const isGameStarted = /* @__PURE__ */ __name((session) => {
    if (!game.started) {
      sendMessage(session, '游戏尚未开始，请先用"阿瓦隆 开始"开始游戏。');
      return false;
    }
    return true;
  }, "isGameStarted");
  const isPlayerLeader = /* @__PURE__ */ __name((session) => {
    const currentLeader = game.players[game.currentLeaderIndex];
    if (session.userId !== currentLeader.id) {
      sendMessage(session, `只有当前发车人 ${currentLeader.name} 可以发起发车指令。`);
      return false;
    }
    return true;
  }, "isPlayerLeader");
  const isPlayerParticipant = /* @__PURE__ */ __name((session) => {
    const isParticipant = game.selectedPlayers.some((player) => player.id === session.userId);
    if (!isParticipant) {
      sendMessage(session, "只有参与任务的玩家可以投票。");
      return false;
    }
    return true;
  }, "isPlayerParticipant");
  avalonCommand.subcommand(".规则", "查看游戏规则").action(async ({ session }) => await sendMessage(session, rules));
  avalonCommand.subcommand(".角色 <role:string>", "查看角色信息").action(async ({ session }, role) => {
    const roleInfo = rolesInfo[role];
    if (roleInfo) {
      let responseMessage = `角色：${role}
阵营：${roleInfo.type}
任务：${roleInfo.task}
投票：${roleInfo.vote}`;
      if (roleInfo.visibleRoles) responseMessage += `
可见角色：${roleInfo.visibleRoles}`;
      if (roleInfo.special) responseMessage += `
特殊能力：${roleInfo.special}`;
      await sendMessage(session, responseMessage);
    } else {
      await sendMessage(session, "所有角色如下，根据参与游戏人数不同，出现角色亦不同：\n梅林、派西维尔、忠臣、莫甘娜、刺客、爪牙、莫德雷德、奥伯伦、好兰斯洛特、坏兰斯洛特");
    }
  });
  avalonCommand.subcommand(".开始", "开始新的一局阿瓦隆").action(async ({ session }) => {
    if (game.started) {
      await sendMessage(session, "游戏已经开始，请先结束当前游戏。");
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
      currentVotes: {}
    };
    await sendMessage(session, '阿瓦隆游戏开始，建议更换一个简单的昵称。输入"阿瓦隆 加入"加入游戏。');
  });
  avalonCommand.subcommand(".加入", "加入当前的阿瓦隆对局").action(async ({ session }) => {
    if (!isGameStarted(session)) return;
    const playerExists = game.players.some((p) => p.id === session.userId);
    if (playerExists) {
      await sendMessage(session, "你已经加入了游戏。");
      return;
    }
    game.players.push({ id: session.userId, name: session.username });
    await sendMessage(session, `${session.username} 已加入游戏！目前玩家数: ${game.players.length}`);
  });
  avalonCommand.subcommand(".分配", "分配阿瓦隆角色").action(async ({ session }) => {
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
      player.team = index < numGood ? "good" : "evil";
    });
    for (const player of shuffledPlayers) {
      let message = `你的角色是：${player.role}，你是${player.team === "good" ? "正义阵营" : "邪恶阵营"}。`;
      switch (player.role) {
        case "梅林":
          const merlinVisibleEvil = shuffledPlayers.filter((p) => p.team === "evil" && p.role !== "莫德雷德").sort(() => Math.random() - 0.5);
          message += `

你的任务是隐藏自己的身份，避免被刺客发现，取得最终胜利。

你只能投任务成功。

除了莫德雷德，其他邪恶阵营有：${merlinVisibleEvil.map((p) => p.name).join(", ")}`;
          break;
        case "派西维尔":
          const merlinAndMorgana = shuffledPlayers.filter((p) => ["梅林", "莫甘娜"].includes(p.role)).sort(() => Math.random() - 0.5);
          message += `

你的任务是保护梅林，取得最终胜利。

你只能投任务成功。

你可以看到的两个玩家是：${merlinAndMorgana.map((p) => p.name).join(", ")}，但你不知道谁是梅林，谁是莫甘娜。`;
          break;
        case "忠臣":
          message += `

你的任务是保护梅林，取得最终胜利。

你只能投任务成功。`;
          break;
        case "莫甘娜":
        case "刺客":
        case "爪牙":
        case "莫德雷德":
          const evilVisibleOthers = shuffledPlayers.filter((p) => p.team === "evil" && p.role !== "奥伯伦").sort(() => Math.random() - 0.5);
          message += `

你的任务是破坏任务，取得最终胜利。

你可以投任务成功，也可以投任务失败。

其他邪恶阵营有：${evilVisibleOthers.map((p) => p.name).join(", ")}`;
          break;
        case "奥伯伦":
          message += `

你的任务是破坏任务，取得最终胜利。

你可以投任务成功，也可以投任务失败。

你是独立的邪恶阵营，无法看到其他邪恶阵营。`;
          break;
        case "好兰斯洛特":
          const evilLancelot = shuffledPlayers.find((p) => p.role === "坏兰斯洛特");
          if (evilLancelot) message += `

你可以看到坏兰斯洛特是：${evilLancelot.name}`;
          message += `

你的任务是破坏任务，取得最终胜利。

你可以投任务成功，也可以投任务失败。`;
          break;
        case "坏兰斯洛特":
          const goodLancelot = shuffledPlayers.find((p) => p.role === "好兰斯洛特");
          if (goodLancelot) message += `

你可以看到好兰斯洛特是：${goodLancelot.name}`;
          message += `

你的任务是破坏任务，取得最终胜利。

你可以投任务成功，也可以投任务失败。`;
          break;
      }
      const imageUrl = roleImages[player.role];
      await sendPrivateMessage(session, player.id, `${import_koishi.h.image(imageUrl)}
${message}`);
    }
    game.round = 1;
    game.currentLeaderIndex = Math.floor(Math.random() * game.players.length);
    const missionSize = missionSizes[numPlayers][game.round - 1];
    await sendMessage(session, `角色已分配！游戏即将开始。第 ${game.round} 轮任务需要 ${missionSize} 名成员参与。
当前发车人是：${game.players[game.currentLeaderIndex].name}，请在当前群聊使用指令“阿瓦隆 发车 玩家1,玩家2”进行选择`);
  });
  avalonCommand.subcommand(".发车 <players:string>", "选择任务成员").action(async ({ session }, players) => {
    if (!isGameStarted(session) || !isPlayerLeader(session)) return;
    if (game.round > 0 && game.currentVotes && !Object.values(game.currentVotes).every((vote) => vote !== void 0)) {
      await sendMessage(session, "上一轮的投票尚未完成，无法进行新一轮的上车。");
      return;
    }
    if (!players) {
      await sendMessage(session, "请使用指令“阿瓦隆 发车 玩家1,玩家2”选择参与任务的玩家！");
      return;
    }
    const normalizedPlayers = players.replace(/，/g, ",");
    const selectedNames = normalizedPlayers.split(",").map((name2) => name2.trim()).filter((name2) => name2);
    const numPlayers = game.players.length;
    const missionSize = missionSizes[numPlayers][game.round - 1];
    const selectedIds = selectedNames.map((name2) => game.players.find((p) => p.name.toLowerCase() === name2.toLowerCase())?.id).filter((id) => id !== null);
    if (selectedIds.length !== missionSize) {
      await sendMessage(session, `选择的玩家数量错误。当前任务需要选择 ${missionSize} 名玩家。`);
      return;
    }
    game.selectedPlayers = game.players.filter((p) => selectedIds.includes(p.id));
    game.players.forEach((player) => {
      player.voted = false;
      player.vote = void 0;
    });
    game.missionResults.push(false);
    await sendMessage(session, `任务成员选择完毕: ${selectedNames.join(", ")}。请投票决定任务成功与否。`);
    game.selectedPlayers.forEach((player) => {
      sendMessage(session, `${player.name} 请投票，输入 "阿瓦隆 投票 成功" 或 "阿瓦隆 投票 失败"`);
    });
  });
  avalonCommand.subcommand(".投票 <vote:string>", "投票决定任务成功与否").action(async ({ session }, vote) => {
    if (!isGameStarted(session) || !isPlayerParticipant(session)) return;
    const validVotes = ["成功", "失败"];
    if (!validVotes.includes(vote)) {
      await sendMessage(session, '投票无效，请输入 "阿瓦隆 投票 成功" 或 "阿瓦隆 投票 失败"');
      return;
    }
    const currentVote = vote === "成功" ? "success" : "fail";
    const participant = game.selectedPlayers.find((player) => player.id === session.userId);
    if (!participant.voted) {
      participant.voted = true;
      participant.vote = currentVote;
      await sendMessage(session, `${session.username} 已投票。`);
      await sendChannelMessage(session, `${session.username} 已投票。`);
    } else {
      await sendMessage(session, "您已经投过票了。");
      return;
    }
    const allVoted = game.selectedPlayers.every((player) => player.voted);
    if (!allVoted) return;
    const passVotes = game.selectedPlayers.filter((player) => player.vote === "success").length;
    const failVotes = game.selectedPlayers.filter((player) => player.vote === "fail").length;
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
    await sendChannelMessage(session, missionSuccess ? "任务成功！" : "任务失败！");
    game.round++;
    const goodWins = game.missionResults.filter((result) => result).length >= WINNING_SCORE;
    const evilWins = game.missionResults.filter((result) => !result).length >= WINNING_SCORE;
    if (goodWins) {
      await sendChannelMessage(session, "正义阵营即将胜利！");
      const assassin = game.players.find((player) => player.role === "刺客");
      if (assassin) {
        const assassinTime = `刺客 ${assassin.name}，请您选择您认为的梅林进行刺杀。输入"阿瓦隆 刺杀 玩家名"`;
        await sendChannelMessage(session, assassinTime);
      }
    } else if (evilWins) {
      await sendChannelMessage(session, "邪恶阵营胜利！游戏已结束。");
      fixedChannelId = "";
      game.started = false;
    } else if (game.round < MAX_ROUNDS) {
      game.currentLeaderIndex = (game.currentLeaderIndex + 1) % game.players.length;
      const leaderMessage = `轮到下一位发车人：${game.players[game.currentLeaderIndex].name}。
当前为第 ${game.round} 轮任务，需要 ${missionSize} 名成员参与。`;
      await sendChannelMessage(session, leaderMessage);
    }
  });
  avalonCommand.subcommand(".查验 <playerName:string>", "持有湖中仙女的车长查验玩家身份").action(async ({ session }, playerName) => {
    if (!isGameStarted(session)) return;
    if (game.players.length < 8 || game.players.length > 11) {
      await sendMessage(session, "当前游戏人数不引入湖中仙女，不能查验。");
      return;
    }
    if (game.round < 2 || game.round > 4) {
      await sendMessage(session, "当前任务轮数不引入湖中仙女，不能查验。");
      return;
    }
    const currentLeader = game.players[game.currentLeaderIndex];
    if (currentLeader.id !== session.userId) {
      await sendMessage(session, "只有当前的车长可以使用此指令。");
      return;
    }
    if (currentLeader.voted) {
      await sendMessage(session, "当前任务已使用查验功能。");
      return;
    }
    const targetPlayer = game.players.find((p) => p.name === playerName);
    if (!targetPlayer) {
      await sendMessage(session, `没有找到名为 ${playerName} 的玩家。`);
      return;
    }
    const identityMessage = `${targetPlayer.name}是${targetPlayer.team === "good" ? "正义阵营" : "邪恶阵营"}`;
    const channelMessage = `车长查验了${targetPlayer.name}的身份，他可以选择公开或不公开。'}`;
    await sendMessage(session, identityMessage);
    await sendChannelMessage(session, channelMessage);
    currentLeader.voted = true;
  });
  avalonCommand.subcommand(".刺杀 <playerName:string>", "刺杀指定玩家").action(async ({ session }, playerName) => {
    if (!isGameStarted(session)) return;
    const assassin = game.players.find((p) => p.role === "刺客" && p.id === session.userId);
    if (!assassin) {
      await sendMessage(session, "你不是刺客，无法进行刺杀。");
      return;
    }
    const targetPlayer = game.players.find((p) => p.name === playerName);
    if (!targetPlayer) {
      await sendMessage(session, "未找到该玩家，请检查姓名拼写。");
      return;
    }
    if (targetPlayer.role === "梅林") {
      await sendMessage(session, `刺杀成功！${targetPlayer.name} 是梅林，邪恶阵营胜利！`);
    } else {
      await sendMessage(session, `刺杀失败！${targetPlayer.name} 不是梅林，正义阵营胜利！`);
    }
    game.started = false;
    await sendMessage(session, "游戏已结束。");
    fixedChannelId = "";
  });
  avalonCommand.subcommand(".结束", "结束当前游戏").action(async ({ session }) => {
    if (!game.started) {
      await sendMessage(session, "当前没有游戏进行中。");
      return;
    }
    game.started = false;
    await sendMessage(session, "游戏已结束。");
    fixedChannelId = "";
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  inject,
  name,
  usage
});
