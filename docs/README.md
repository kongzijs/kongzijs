# Kongzijs 开发者文档

欢迎来到 Kongzijs 基于 FLF 的课程构建器开发者文档。本文档提供了项目的全面指南、RFC、API 参考和设计决策。

## 🎯 项目定位

本项目是一个 **基于 FLF 的课程构建器系统**，使用 FLF (Fluence Lesson Format) - 一个用于富媒体课程的标准 JSON 协议，实现教育内容的可视化创建和管理。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（所有包）
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test
```

## 📚 文档结构

### [RFC 文档](./rfc/)

描述 FLF 架构和实现的请求评论文档：

#### FLF 核心 RFC

- **[RFC 0017: FLF JSON 规范](./rfc/0017-flf-specification.md)** - FLF 格式规范和 JSON 模式
- **[RFC 0020: FLF 转换器引擎](./rfc/0020-flf-transformer.md)** - FLF ↔ React Flow 双向转换
- **[RFC 0019: 打包管理](./rfc/0019-bundle-management.md)** - 物理包导出 (.flz) 和资产重定位

#### 课程构建器 RFC

- **[RFC 0018: 流程画布 (React Flow)](./rfc/0018-flf-ui-experience.md)** - 可视化流程编辑器设计
- **[RFC 0022: 资产库](./rfc/0022-asset-library.md)** - 资产管理和拖拽界面
- **[RFC 0023: 节点属性编辑器](./rfc/0023-node-property-editors.md)** - 节点属性编辑 UI

#### 课程播放器 RFC

- **[RFC 0021: 课程播放器引擎](./rfc/0021-lesson-player.md)** - 学生端课程播放系统

### [指南](./guides/)

常见开发任务的逐步指南：

- **[快速开始](./guides/getting-started.md)** - 项目设置和概览
- **[组件开发](./guides/component-development.md)** - 构建新组件
- **[国际化](./guides/internationalization.md)** - 多语言支持

### [Supabase](./supabase/)

Supabase 设置、CLI、迁移和工作流的完整指南：

- **[Supabase 开发指南](./supabase/)** - 设置、CLI、迁移、故障排除和安全
- **[MCP 设置](./supabase/mcp-setup.md)** - 模型上下文协议集成

### [部署](./deployment/)

部署和基础设施指南：

- **[Vercel Monorepo 设置](./deployment/vercel-monorepo-setup.md)** - 将 monorepo 部署到 Vercel
- **[Cloudflare + Vercel 设置](./deployment/cloudflare-vercel.md)** - 域名和 CDN 配置

### [测试](./testing/)

测试指南和最佳实践：

- **[测试指南](./testing/)** - 测试设置和最佳实践
- **[E2E 指南](./testing/guides/e2e-guide.md)** - 使用 Playwright 进行端到端测试
- **[Playwright 设置](./testing/guides/playwright-setup.md)** - Playwright 配置

### [API 参考](./api/)

包、钩子、工具和组件的 API 文档：

- **[API 索引](./api/index.md)** - 完整的 API 参考

## 🎓 FLF 格式概览

**FLF (Fluence Lesson Format)** 是本项目的核心数据协议。关键概念：

### 核心原则

1. **自包含**: 单个 JSON 文件包含所有课程配置
2. **协议化资产**: 通过 `https://`, `local://`, `asset://`, `blob://` 协议统一寻址
3. **流程化结构**: 基于节点的课程流程（Learn、Test、Resource 节点）
4. **数据库友好**: 设计用于分解到关系型表

### FLF 结构

```json
{
  "flf_version": "1.0",
  "lesson_id": "L-101",
  "settings": { "total_credits": 50 },
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
      "data": { "markdown": "# Content", "media": ["video_1"] }
    }
  ],
  "flow_edges": []
}
```

### 节点类型

- **Learn Node**: 包含 Markdown 和媒体的内容展示
- **Test Node**: 带有通过分数和重定向的 Quiz 验证
- **Resource Node**: 额外的学习资源

### 资产协议

- `https://` - 远程 URL
- `local://` - 包内相对路径
- `asset://` - 数据库 UUID
- `blob://` - 前端临时上传（编辑状态）

**了解更多**: 查看 [RFC 0017: FLF 规范](./rfc/0017-flf-specification.md) 获取完整详情。

## 📦 包文档

### `@kongzijs/flf-core`

FLF 核心实现包：

- **类型**: 完整的 TypeScript 定义
- **验证**: FLF 清单验证
- **协议解析**: 资产源解析和构建
- **转换器**: FLF ↔ React Flow 转换
- **示例**: 示例数据生成器

查看 [flf-core README](../packages/flf-core/README.md) 获取详细的 API 文档。

### `@kongzijs/lesson-builder`

可视化课程构建器组件：

- **LessonBuilder**: 主构建器组件
- **CustomNodes**: Learn、Test、Start、End 节点组件
- **NodePropertyPanel**: 属性编辑界面

### `@kongzijs/ui`

基于 Radix UI 和 Tailwind CSS 构建的共享 UI 组件库。

## 🛠 项目概览

Kongzijs 是一个基于 monorepo 的 FLF 课程构建器系统，使用以下技术构建：

- **TypeScript** - 完整类型安全
- **React 18** - UI 框架
- **Nx** - Monorepo 管理
- **pnpm** - 包管理器（workspace 支持）
- **Vite** - 快速构建工具
- **React Flow** - 可视化流程编辑器
- **Radix UI** - 可访问的组件
- **Tailwind CSS** - 样式

## 🚀 核心功能

- 🎨 **可视化课程构建器** - 拖拽式流程编辑器
- 📝 **FLF 格式支持** - 标准化的 JSON 课程格式
- 🎯 **类型安全** - 完整的 TypeScript 覆盖
- 🔄 **双向转换** - FLF ↔ React Flow 转换
- 📦 **资产管理** - 基于协议的资产引用
- 🧪 **验证** - FLF 清单验证
- 📚 **全面文档** - RFC 和指南

## 📋 开发路线图

查看 [ROADMAP.md](./ROADMAP.md) 获取完整的开发路线图，包括：

- FLF 课程系统
  - 协议基础
  - 逻辑桥梁（转换器）
  - 课程构建器（编辑器）
  - 播放引擎

## 🤝 贡献

贡献项目时：

1. 遵循编码标准（ESLint、Prettier）
2. 所有新文件使用 TypeScript
3. 为新功能编写文档
4. 为重要的设计决策创建 RFC
5. 遵循函数式编程原则
6. 尽可能使用纯函数
7. 定义常量而不是直接使用字符串
8. 根据需要更新本文档

### 代码风格指南

- 所有新文件使用 TypeScript
- 在适用的情况下遵循函数式编程原则
- 尽可能使用纯函数
- 保持组件模块化和专注
- 为复杂逻辑添加注释
- 使用有意义的变量和函数名
- 定义常量而不是直接使用字符串

## 📖 资源

- [项目 README](../README.md) - 主要项目文档
- [RFC 文档](./rfc/) - 完整的 RFC 索引
- [开发路线图](./ROADMAP.md) - 项目路线图和进度
- [flf-core 包](../packages/flf-core/README.md) - FLF 核心 API 文档

---

**注意**: 所有文档都围绕项目的核心目标：构建一个全面的基于 FLF 的课程构建器系统。
