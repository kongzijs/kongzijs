# RFC 0018: Lesson Builder - 流程画布 (Flow Canvas) 规范

**状态**: ✅ 已实施  
**作者**: AI Assistant  
**创建日期**: 2026-01-25  
**最后更新**: 2026-01-25

## 1. 摘要

本 RFC 专属于 **Lesson Builder 的流程画布 (Flow Canvas)** 部分。其核心任务是定义基于 **React Flow** 的可视化图编排环境。

## 2. 画布核心职责 (Canvas Responsibilities)

- **图构建 (Graph Construction)**：提供拖拽、缩放的主画布，支持节点（Nodes）的添加和定位。
- **逻辑连线 (Edges)**：定义学习流的先后顺序。
- **序列化 (Serialization)**：将画布上的节点空间关系与连线逻辑映射为 RFC 0017 定义的 FLF 数组结构。

## 3. 连线逻辑 (Engagement Logic)

- **单向串联 (Sequential)**：默认的 A -> B 关系，表示完成 A 后解锁 B。
- **逻辑分支 (Branching)**：
  - 成功路径 (Success Edge)：Test 成功后的去向。
  - 失败路径 (Fail Edge)：Test 失败后的回退或补偿路径。

## 4. 状态同步

- 画布不存储资产内容，仅存储 Node 的 ID、Position 和指向的资产引用标识。
- 所有的细节编辑由 [RFC 0023] 定义的属性面板处理。

---

#### 签核确认 (Approval)

- [x] 确认 RFC 0018 仅负责图结构与连线逻辑。
- [x] 确认使用 React Flow 作为底层引擎。
