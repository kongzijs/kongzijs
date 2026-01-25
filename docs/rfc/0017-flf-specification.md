# RFC 0017: Fluence Lesson Format (FLF) 详细规范与 JSON 数据协议

**状态**: ✅ 已实施  
**作者**: AI Assistant  
**创建日期**: 2026-01-25  
**最后更新**: 2026-01-25

## 1. 摘要与目标

Fluence Lesson Format (FLF) 是一种标准化的 JSON 数据协议，用于定义富媒体课程。它作为应用层（App Layer）的核心交换格式，旨在实现：

- **自包含性**：一键导出包含所有引用的资产包。
- **协议化资产引用**：支持远程 URL、本地相对路径和数据库 ID 的统一寻址。
- **关系型存储友好**：其结构便于应用层 Transformer 拆解并存储到原子化的数据库表中。

---

## 2. FLF 数据结构规范 (JSON Schema)

### 2.1 顶级包装器 (The Envelope)

```json
{
    "flf_version": "1.0",
    "lesson_id": "L-101",
    "settings": {
        "total_credits": 50,
        "difficulty": "intermediate"
    },
    "assets_manifest": [],
    "flow_nodes": [],
    "flow_edges": []
}
```

### 2.2 资产清单 (Asset Manifest)

用于声明课程中涉及的所有外部资源。所有路径统一存储在 `src` 字段。

| 字段   | 类型   | 说明                                                                                                                                                                         |
| :----- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`   | String | 脚本内唯一的资产标识符 (如 `media_1`)                                                                                                                                        |
| `type` | Enum   | `video`, `audio`, `image`, `pdf`, `quiz_dsl`                                                                                                                                 |
| `src`  | String | **协议化寻址**：通过前缀区分。例如：<br> - `https://example.com/a.mp4` (远程)<br> - `local://nested_quizzes/final.quiz` (包内相对路径)<br> - `asset://UUID` (数据库全局资源) |
| `hash` | String | 用于校验资源完整性（可选）                                                                                                                                                   |

### 2.3 学习流节点规范 (Flow Node Types)

FLF 脚本中的节点分为两大核心角色，分别承载“输入”与“校验”。

#### A. Learn Node (学习/内容节点)

专门用于呈现知识内容。

- **数据结构**:
  `{ "type": "learn", "data": { "markdown": "...", "media": ["video_asset_id"] }, "rules": { "min_view_time": 60 } }`
- **特性**: 支持 Markdown 渲染，支持嵌套多个视频/音频资产，支持观看进度追踪。

#### B. Test Node (测试/校验节点)

专门用于逻辑判定与学分核算。

- **数据结构**:
  `{ "type": "test", "asset_id": "final.quiz", "rules": { "passing_score": 0.8, "on_fail": "redirect_to_learn_node" } }`
- **特性**: 引用外部 `.quiz` 脚本。它是 Flow 中的逻辑闸门，根据得分决定后续路径。

---

## 3. 引用逻辑与生命周期 (Reference Lifecycle)

1.  **编辑态 (Runtime)**：
    前端编辑器（RFC 0018）维护这份 JSON。当用户上传新文件时，`src` 被设为前端生成的 `blob://`，直到保存。
2.  **持久化态 (Persisted)**：
    Transformer 介入。
    - 将 `local://` 资源移动到长期存储。
    - 将 `quiz_dsl` 类型的资源读取并拆解到 `lesson_questions` 等关系表中（实现原子化存储）。
3.  **分发态 (Delivery)**：
    当学生请求课程时，App 层根据 `asset_id` 自动将 `src` 指向可访问的 CDN 或签名的 URL。

---

## 4. 统计与追踪点 (Tracking Points)

针对每个 Block，FLF 指令集中包含可选的追踪属性：

- `track_id`: 指定一个业务 ID，用于在统计报表中区分特定步骤。
- `is_milestone`: 是否为关键里程碑点，用于阶段性学分结算。

---

## 5. 与物理包的关系 (Note on Bundling)

**注意**：本 RFC 仅定义 FLF 的 **数据格式规范**（即 `lesson.flf` 的 JSON 结构）。关于如何将此文件与其引用的物理资产（.mp4, .quiz 等）打包、压缩以及进行导出/导入的物理逻辑，将在 **未来的 Bundle Management RFC** 中单独定义。

---

#### 签核确认 (Approval)

- [x] 确认单一 JSON 入口满足业务所有配置需求。
- [x] 确认 `src` 协议化路径解决了冗余定位问题。
- [x] 确认 Quiz DSL 以独立资产形式被引用，符合解耦原则。
