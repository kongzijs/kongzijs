# RFC 0023: Lesson Builder - 节点详情编辑器 (Node Property Editors)

**状态**: 🟡 草稿  
**作者**: AI Assistant  
**创建日期**: 2026-01-25  
**最后更新**: 2026-01-25

## 1. 摘要

本 RFC 定义了 Lesson Builder 中的**侧边属性面板 (Property Panels)**，负责对画布节点进行精细的内容编辑和逻辑配置。

## 2. Learn Node 编辑器逻辑

针对内容学习节点的定制 UI：

- **Markdown 编辑区**：支持富文本、公式、简单表格。
- **媒体挂载 (Media Attachment)**：
  - 支持填入 Remote URL (https://...)。
  - 绑定后的资产 ID 会自动更新到该 Node 的 FLF 声明中。
- **完成规则 (Completion Rules)**：设置该节点被标记为 `Done` 的触发条件（如：滚动到底部、观看满 N 秒）。

## 3. Test Node 配置器逻辑

针对测验节点的逻辑定义：

- **资产校验**：显示当前绑定的 `.quiz` 文件状态。
- **及格线 (Passing Threshold)**：设置学生通过该节点所需的正确率（百分比）。
- **重试逻辑**：允许设置最大尝试次数及其失败后的流程回退点。

## 4. UI 协同

- 所有的编辑均为 **实时自动保存 (Auto-save)** 到当前内存中的 FLF 镜像。
- 点击画布节点时，该面板应自动滑出并聚焦对应数据。

---

#### 签核确认 (Approval)

- [ ] 确认节点编辑器的职责是“配置 Node 的内部数据与规则”。
- [ ] 确认 Learn 节点基于 Markdown 驱动。
