# koishi-plugin-avalon-lizard

[![npm](https://img.shields.io/npm/v/koishi-plugin-avalon-lizard?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-avalon-lizard)

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