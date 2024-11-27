# koishi-plugin-avalon-lizard

[![npm](https://img.shields.io/npm/v/koishi-plugin-avalon-lizard?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-avalon-lizard)

## 用你的机器人玩一局阿瓦隆吧~
---
<details>
<summary>阿瓦隆游戏规则</summary>

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
### 湖中仙女：
  - 游戏人数为8到11人时，引入湖中仙女规则。

  - 在第二、三、四轮任务发车前，车长持有湖中仙女，可以查验任意一人身份。

### 游戏过程中请遵守游戏规则，确保公平公正。祝你游戏愉快！
</details>

## 已经完成的：
- 整体框架，满足5到11人游玩

- 身份系统，分为两大阵营

- 刺杀系统，完善坏人胜利条件

- 湖中仙女系统，完善车长职能

## todo：
- 添加房间系统，防止串号

- 添加图片，完善视觉效果
---
<details>
<summary>如果要反馈建议或报告问题</summary>

可以[点这里](https://github.com/lizard0126/avalon-lizard/issues)创建议题~
</details>
<details>
<summary>如果喜欢我的插件</summary>

可以[请我喝可乐](https://ifdian.net/a/lizard0126)，没准就有动力更新新功能了~
</details>