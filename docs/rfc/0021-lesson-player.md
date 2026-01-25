# RFC 0021: Lesson Player 播放引擎规范

**状态**: 🟡 草案  
**作者**: AI Assistant  
**创建日期**: 2026-01-25  
**最后更新**: 2026-01-25

## 1. 摘要

本 RFC 定义了 **Lesson Player (课程播放引擎)** 的前端执行逻辑。Player 是学生学习界面的核心，负责从 FLF 清单中还原“学习任务流”，并驱动学生一步步“闯关”。它必须准确处理节点解锁、多种媒体渲染、Quiz 脚本执行以及实时的进度反馈。

## 2. 播放引擎核心组件

### 2.1 任务控制台 (Mission Controller)

Player 维护一个**全局状态机**：

- **状态追踪**：同步并显示每一个 `Learn/Test Node` 的进度（Locked, Current, Completed）。
- **解锁策略**：根据 `lesson.flf` 中的节点规则（Entry Rules），决定何时允许学生点击进入下一阶段。

### 2.2 动态节点渲染器 (Dynamic Node Renderer)

根据节点的 `type` 动态加载渲染组件：

- **LearnNode 渲染**：解析 Markdown，加载视频播放器。监控播放进度（例如：进度 > 90% 后自动发送 `Complete` 事件给控制台）。
- **TestNode 渲染**：初始化 **Quiz Runner**，注入对应的 `.quiz` 资产内容。测验完成后，将分数返回给 Player 决定后续路径。

---

## 3. 交互与进度同步流程

### 3.1 学习会话初始化 (Session Initialization)

1. 学生点击“开始课程”。
2. Player 调用 API 创建 `user_lesson_sessions`（锁定版本）。
3. 后端返回初始化的节点进度表。

### 3.2 节点过关逻辑 (Passing Flow)

1. **执行**：学生在此节点内操作（阅读看视频或做题）。
2. **校验**：Player 后端调用判定逻辑（根据 RFC 0017 中的 Rules）。
3. **入步**：判定成功后，Player 向后端发送 `UpdateNodeProgress` 请求。
4. **推进**：收到确认后，Player 在界面上解锁下一个节点。

---

## 4. 特殊交互逻辑

- **持久化预览**：支持学生中断学习并退出。下次进入时，Player 应根据 `user_node_progress` 自动将焦点置于当前未完成的第一个节点。
- **学分结算 (Credits Delivery)**：当最后一个里程碑节点（Milestone）完成且判定成功时，Player 触发结课 API，发放学分。

---

#### 签核确认 (Approval)

- [ ] 确认 Player 采用“任务状态机”驱动的闯关模式。
- [ ] 确认其负责与 Quiz Runner 的数据交互。
- [ ] 确认其应具备处理节点解锁逻辑的能力。
