# Kongzijs - 基于 FLF 的课程构建器

> **FLF (Fluence Lesson Format)** 是一个标准化的 JSON 协议，用于定义富媒体课程。本项目是一个基于 FLF 格式的可视化课程构建器系统。

一个完全基于 **FLF (Fluence Lesson Format)** 构建的现代化可视化课程构建器系统。FLF 是一个标准化的 JSON 协议，用于创建富媒体教育内容。本 monorepo 提供了完整的工具集，用于使用 FLF 格式和基于流程的节点编辑来构建、编辑和管理交互式课程。

📍 **[查看开发路线图](./docs/ROADMAP.md)** - 了解项目进度和未来规划

## 🎯 什么是基于 FLF 的课程构建器？

**基于 FLF 的课程构建器** 是一个专门用于创建、编辑和管理 **FLF 格式课程**的可视化工具。FLF 是课程数据的唯一标准格式，所有课程内容都基于 FLF 协议定义。

### 核心原则

- **FLF 优先**: 所有课程数据都遵循 FLF 格式规范
- **可视化编辑**: 通过可视化流程编辑器创建 FLF 课程
- **协议化资产**: 使用协议化路径引用资产（`https://`, `local://`, `asset://`, `blob://`）
- **基于节点的流程**: 使用 Learn、Test、Resource 节点构建课程流程
- **类型安全**: 完整的 TypeScript 类型定义确保 FLF 数据正确性

## 🚀 核心功能

### FLF 格式支持

- ✅ **FLF JSON 规范** (RFC 0017) - 完整的 FLF 格式实现
- ✅ **FLF 验证** - 自动验证 FLF 清单是否符合规范
- ✅ **FLF 转换器** - FLF 与 React Flow 双向转换
- ✅ **协议解析** - 支持多种资产引用协议

### 可视化课程构建器

- 🎨 **流程画布** - 基于 React Flow 的可视化编辑器
- 📝 **节点编辑** - Learn、Test、Resource 节点属性编辑
- 📚 **资产库** - 多媒体资产管理和引用
- 💾 **FLF 导入/导出** - 直接导入导出 FLF 格式文件

### 课程播放器

- ▶️ **FLF 播放** - 基于 FLF 清单的课程播放引擎
- 🔄 **节点进度** - 状态机驱动的节点解锁逻辑
- 📊 **进度追踪** - 学习进度追踪

## 📋 目录

- [核心包](#-核心包)
- [FLF 格式](#-flf-格式)
- [快速开始](#-快速开始)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [文档](#-文档)
- [贡献指南](#-贡献指南)

## 📦 核心包

### `@kongzijs/flf-core`

**FLF 格式核心实现包** - 提供 FLF 规范的完整实现：

- **类型定义**: 完整的 FLF TypeScript 类型定义
- **协议解析**: 支持 `https://`, `local://`, `asset://`, `blob://` 协议解析
- **验证**: FLF 清单验证，确保符合规范
- **转换器**: FLF ↔ React Flow 双向转换
- **示例**: FLF 示例数据生成器

```typescript
import {
    FLFManifest,
    validateFLFManifest,
    FLFTransformer,
    createExampleFLF,
} from "@kongzijs/flf-core";

// 创建 FLF 清单
const manifest: FLFManifest = createExampleFLF();

// 验证 FLF
const result = validateFLFManifest(manifest);
if (result.valid) {
    console.log("FLF 有效！");
}

// 转换为 React Flow 格式
const reactFlowData = FLFTransformer.toReactFlow(manifest);
```

### `@kongzijs/lesson-builder`

**可视化课程构建器组件** - 基于 React Flow 的 FLF 课程编辑器：

- **流程画布**: 拖拽式节点编辑器
- **自定义节点**: Learn、Test、Start、End 节点类型
- **属性面板**: 节点属性编辑（Markdown 内容、Quiz 引用、规则设置）
- **资产库**: 多媒体资产管理
- **FLF 集成**: 直接导入/导出 FLF 清单

```typescript
import { LessonBuilder } from "@kongzijs/lesson-builder";

<LessonBuilder
  lessonId={123}
  initialManifest={flfManifest}
  onSave={async (lessonId, manifest: FLFManifest) => {
    // 保存 FLF 清单
    return { success: true, versionId: "v1.0" };
  }}
/>
```

## 🎓 FLF 格式

**FLF (Fluence Lesson Format)** 是本项目的核心数据格式。所有课程内容都基于 FLF 格式定义。

### FLF 核心特性

- **自包含**: 单个 JSON 文件包含所有课程配置
- **协议化资产**: 统一的资产引用协议（`https://`, `local://`, `asset://`, `blob://`）
- **流程化结构**: 基于节点的课程流程（Learn、Test、Resource 节点）
- **数据库友好**: 设计用于轻松分解到关系型数据库表

### FLF 结构示例

```json
{
    "flf_version": "1.0",
    "lesson_id": "L-101",
    "settings": {
        "total_credits": 50,
        "difficulty": "intermediate"
    },
    "assets_manifest": [
        {
            "id": "video_1",
            "type": "video",
            "src": "asset://550e8400-e29b-41d4-a716-446655440000"
        }
    ],
    "flow_nodes": [
        {
            "id": "node_1",
            "type": "learn",
            "data": {
                "markdown": "# Lesson Content",
                "media": ["video_1"]
            }
        }
    ],
    "flow_edges": []
}
```

### 节点类型

- **Learn Node**: 学习内容节点，包含 Markdown 和媒体资源
- **Test Node**: 测试节点，引用 Quiz DSL 资产，支持通过分数和失败重定向
- **Resource Node**: 资源节点，提供额外学习资源

### 资产协议

- `https://` - 远程 URL
- `local://` - 包内相对路径
- `asset://` - 数据库 UUID
- `blob://` - 前端临时上传（编辑状态）

**了解更多**: 查看 [RFC 0017: FLF 规范](./docs/rfc/0017-flf-specification.md) 获取完整规范。

## 🚀 快速开始

### 前置要求

- **Node.js**: 版本 >= 23.11.0
- **pnpm**: 版本 >= 10.9.0

### 安装

```bash
# 克隆仓库
git clone <repository-url>
cd kongzijs

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 使用 FLF Core

```typescript
import {
    FLFManifest,
    validateFLFManifest,
    parseAssetSrc,
    createExampleFLF,
} from "@kongzijs/flf-core";

// 创建示例 FLF
const manifest = createExampleFLF();

// 验证 FLF
const result = validateFLFManifest(manifest);

// 解析协议化路径
const parsed = parseAssetSrc("asset://550e8400-e29b-41d4-a716-446655440000");
```

### 使用课程构建器

```typescript
import { LessonBuilder } from "@kongzijs/lesson-builder";
import { FLFManifest } from "@kongzijs/flf-core";

function App() {
  const handleSave = async (lessonId: number, manifest: FLFManifest) => {
    // 保存 FLF 清单到后端
    const response = await fetch(`/api/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(manifest),
    });
    return { success: true };
  };

  return (
    <LessonBuilder
      lessonId={123}
      initialManifest={initialFLF}
      onSave={handleSave}
    />
  );
}
```

## 🛠 技术栈

### 核心

- **TypeScript**: 完整类型安全
- **React 18**: UI 框架
- **Nx**: Monorepo 管理
- **pnpm**: 包管理器（workspace 支持）
- **Vite**: 快速构建工具

### FLF 课程构建器

- **React Flow (@xyflow/react)**: 流程可视化编辑器
- **FLF Core**: FLF 格式实现
- **Sonner**: Toast 通知

### UI 组件

- **Radix UI**: 可访问的组件原语
- **Tailwind CSS**: 工具优先的样式
- **Lucide React**: 图标库

## 📁 项目结构

```
kongzijs/
├── packages/
│   ├── flf-core/              # FLF 格式核心实现
│   │   ├── src/
│   │   │   ├── types.ts       # FLF 类型定义
│   │   │   ├── validator.ts   # FLF 验证
│   │   │   ├── asset-protocol.ts  # 协议解析
│   │   │   ├── transformer.ts  # FLF ↔ React Flow
│   │   │   └── examples.ts   # 示例数据
│   │   └── package.json
│   │
│   ├── lesson-builder/        # 可视化课程构建器
│   │   ├── src/
│   │   │   ├── LessonBuilder.tsx      # 主构建器组件
│   │   │   ├── CustomNodes.tsx         # 流程节点组件
│   │   │   └── NodePropertyPanel.tsx   # 属性编辑器
│   │   └── package.json
│   │
│   └── ui/                    # 共享 UI 组件
│       └── src/components/
│
├── apps/
│   └── demo-react/           # 演示应用
│
├── docs/
│   ├── rfc/                   # RFC 文档
│   │   ├── 0017-flf-specification.md
│   │   ├── 0018-flf-ui-experience.md
│   │   ├── 0020-flf-transformer.md
│   │   └── ...
│   └── ROADMAP.md            # 开发路线图
│
├── nx.json                    # Nx 配置
├── pnpm-workspace.yaml       # pnpm workspace 配置
└── package.json              # 根 package.json
```

## 📜 可用脚本

| 脚本         | 描述               |
| ------------ | ------------------ |
| `pnpm dev`   | 启动所有包开发模式 |
| `pnpm build` | 构建所有包         |
| `pnpm lint`  | 检查所有包代码     |
| `pnpm test`  | 运行所有包测试     |

## 📚 文档

### FLF 核心 RFC

- **[RFC 0017: FLF JSON 规范](./docs/rfc/0017-flf-specification.md)** - FLF JSON 格式规范
- **[RFC 0020: FLF 转换器引擎](./docs/rfc/0020-flf-transformer.md)** - FLF ↔ React Flow 转换

### 课程构建器 RFC

- **[RFC 0018: 流程画布 (React Flow)](./docs/rfc/0018-flf-ui-experience.md)** - 可视化流程编辑器设计
- **[RFC 0022: 资产库](./docs/rfc/0022-asset-library.md)** - 资产管理系统
- **[RFC 0023: 节点属性编辑器](./docs/rfc/0023-node-property-editors.md)** - 节点属性编辑 UI

### 课程播放器 RFC

- **[RFC 0021: 课程播放器引擎](./docs/rfc/0021-lesson-player.md)** - 学生端课程播放系统

### 打包管理

- **[RFC 0019: 打包管理](./docs/rfc/0019-bundle-management.md)** - 物理包导出 (.flz)

### 指南

- **[快速开始](./docs/guides/getting-started.md)** - 项目设置和概览
- **[组件开发](./docs/guides/component-development.md)** - 构建新组件
- **[开发路线图](./docs/ROADMAP.md)** - 项目路线图和进度

## 🤝 贡献指南

1. **创建功能分支**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **进行更改**
    - 遵循现有代码风格
    - 提交前运行 `pnpm lint`
    - 编写清晰的提交信息
    - 为新功能添加测试

3. **测试更改**
    - 确保所有包构建成功
    - 运行测试: `pnpm test`
    - 在演示应用中测试

4. **提交更改**

    ```bash
    git commit -m "Add: your feature description"
    ```

5. **推送并创建 Pull Request**

### 代码风格指南

- 所有新文件使用 TypeScript
- 尽可能使用函数式编程原则
- 优先使用纯函数
- 保持组件模块化和专注
- 为复杂逻辑添加注释
- 使用有意义的变量和函数名
- 定义常量而不是直接使用字符串

## 📄 许可证

本项目为私有项目，仅供内部使用。

## 🙏 致谢

- **FLF 格式**: 灵活、自包含的课程定义格式
- **React Flow**: 可视化流程编辑能力
- **Radix UI**: 可访问的组件原语
- **Nx**: Monorepo 管理和工具

---

**注意**: 本项目专注于构建完整的 **基于 FLF 的课程构建器** 系统。所有文档和开发工作都围绕这一核心目标展开。FLF 格式是本项目的唯一数据标准，所有课程内容都基于 FLF 协议定义。
