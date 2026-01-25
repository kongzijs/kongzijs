# Kongzijs FLF-Based Lesson Builder Development Roadmap

本文档追踪 Kongzijs FLF-based lesson builder 项目的开发路线图，基于 RFC 文档规划实施顺序。

**最后更新**: 2026-01-25

---

## 📊 整体进度

- ✅ **已完成**: 1 个 RFC (RFC 0017)
- 📋 **计划中**: 6 个 RFC

**总体完成度**: ~14% (1/7) 🚀

---

## 🚀 FLF Lesson Builder 核心系统

**目标**: 建立完整的 **FLF (Fluence Lesson Format)** 课程构建器系统。

### 阶段 1: 协议基础 (The Foundation)

1. **✅ [RFC 0017: FLF JSON Specification](./rfc/0017-flf-specification.md)**
   - **状态**: ✅ 已完成
   - **优先级**: 🔥🔥🔥 绝顶 (一切的基石)
   - **内容**: 定义单入口 JSON 协议、`src` 协议化路径。

### 阶段 2: 逻辑桥梁 (The Bridge)

2. **📋 [RFC 0020: FLF Transformer Engine](./rfc/0020-flf-transformer.md)**
   - **状态**: 📋 计划中
   - **内容**: 实现 FLF 脚本与 React Flow 数据结构的双向映射与转换逻辑。

### 阶段 3: Lesson Builder (The Editor)

3. **📋 [RFC 0022: Asset Library](./rfc/0022-asset-library.md)**
   - **状态**: 📋 计划中
   - **内容**: 左侧资产库，处理 `.quiz`、视频片段的检索与拖拽引用。

4. **📋 [RFC 0023: Node Property Editors](./rfc/0023-node-property-editors.md)**
   - **状态**: 📋 计划中
   - **内容**: 右侧面板，处理 Learn 节点的 Markdown 编辑与 Test 节点的规则设定。

5. **📋 [RFC 0018: Flow Canvas (React Flow)](./rfc/0018-flf-ui-experience.md)**
   - **状态**: 📋 计划中
   - **内容**: 中心画布，处理节点连线、路径逻辑编排。

### 阶段 4: 播放引擎与打包 (The Runtime)

6. **📋 [RFC 0021: Lesson Player Engine](./rfc/0021-lesson-player.md)**
   - **状态**: 📋 计划中
   - **内容**: 学生端的闯关式播放逻辑、状态机驱动的节点解锁。

7. **📋 [RFC 0019: Bundle Management](./rfc/0019-bundle-management.md)**
   - **状态**: 📋 计划中
   - **内容**: 物理包导出 (.flz)、资产路径重定位。

---

## 📋 推荐开发顺序 (原子化清单)

```text
1. [0017] ✅ 锁定 FLF 数据协议 (JSON 合约) - 已完成
2. [0020] 开发 Transformer 核心函数 (FLF ↔ React Flow)
3. [0022] 实现 Builder 资产库界面 (检索 Quiz/Media)
4. [0023] 实现 Builder 节点编辑器 (Markdown/Settings)
5. [0018] 实现 Builder 流程画布 (React Flow 连线)
6. [0021] 实现 Player 播放逻辑 (闯关解锁)
7. [0019] 实施物理包打包功能 (.flz)
```

---

## 📝 RFC 状态说明

- ✅ **已完成**: 已实现并投入使用
- 📋 **计划中**: 已规划，等待实施

---

**维护者**: Development Team  
**最后审核**: 2026-01-25
