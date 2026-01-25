# RFC 0020: FLF Transformer 转换引擎规范

**状态**: 🟡 草案  
**作者**: AI Assistant  
**创建日期**: 2026-01-25  
**最后更新**: 2026-01-25

## 1. 摘要

本 RFC 定义了 **FLF Transformer** 的逻辑方案。Transformer 是连接 Fluence Lesson Builder (UI)、FLF 脚本 (Manifest) 与数据库关系表 (DB) 的核心桥梁。它负责在不同的各层之间执行数据的**解构 (Decomposition)** 与 **重构 (Hydration)**。

## 2. 角色与边界

Transformer 运行在 **Server Actions (App Layer)** 中，保持存储层与表示层的完全解耦。

### 2.1 编排流方向 (FLF -> DB)

当导师发布课程时，Transformer 执行以下任务：

- **节点解析**：遍历 FLF 节点的 `sequence`。
- **原子落库**：将每个节点的状态存入 `lesson_nodes`，将关联的 Quiz DSL 递归拆解为 `lesson_questions` 和 `lesson_options`。
- **关系织入**：根据图结构（React Flow Edges）在数据库中通过字段映射或单独的关系表建立节点的先后逻辑。

### 2.2 重构流方向 (DB -> FLF)

当编辑器或播放器加载课程时，Transformer 执行：

- **批量拉取**：从 `lesson_nodes`、`lesson_questions` 等多表拉取所有关联行。
- **水合还原**：将原子行数据按照 `order_index` 和逻辑引用重组成一个完整的 FLF JSON 对象（包含 React Flow 所需的视图坐标）。

---

## 3. 核心转换逻辑说明

### 3.1 资产指针转换 (URI Translation)

Transformer 负责处理 RFC 0017 中定义的协议转换：

- **存入时**：将正在编辑的临时上传资源转换为 `asset://UUID` 或生产环境的 `remote://URL`。
- **读取时**：根据当前权限，为 `asset://` 资源生成签名 URL 或 CDN 地址。

### 3.2 节点逻辑映射

- **Learn Node**：映射为含有 `markdown` 段落、`video` 资源引用的 `lesson_node` 记录。
- **Test Node**：触发对关联 `.quiz` 资产的深度扫描，确保题目集与课程版本同步。

---

## 4. 数据完整性与幂等性

- **事务控制**：所有的转换落库操作必须在单个数据库事务中完成，确保版本快照的原子性。
- **幂等处理**：多次执行同一个版本的落库不应产生冗余或冲突的记录。

---

#### 签核确认 (Approval)

- [ ] 确认 Transformer 仅存在于应用层。
- [ ] 确认其负责 Quiz DSL 的深度解构逻辑。
- [ ] 确认其负责 URL/URI 的协议动态转换。
