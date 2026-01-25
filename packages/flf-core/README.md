# @kongzijs/flf-core

Fluence Lesson Format (FLF) 核心库 - 实现 RFC 0017 规范

## 概述

本包提供了 FLF (Fluence Lesson Format) 的完整实现，包括：

- **类型定义**：完整的 TypeScript 类型系统
- **协议化路径解析**：支持 `https://`, `local://`, `asset://`, `blob://` 协议
- **验证器**：验证 FLF 清单是否符合规范
- **示例生成器**：用于测试和开发的示例数据
- **Transformer**：与 React Flow 的转换工具

## 安装

```bash
pnpm add @kongzijs/flf-core
```

## 快速开始

### 基本使用

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
if (result.valid) {
  console.log("FLF 有效！");
} else {
  console.error("验证错误：", result.errors);
}

// 解析协议化路径
const parsed = parseAssetSrc("asset://550e8400-e29b-41d4-a716-446655440000");
console.log(parsed.protocol); // "asset"
console.log(parsed.uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

### FLF 数据结构

FLF 清单的基本结构：

```typescript
interface FLFManifest {
  flf_version: "1.0";
  lesson_id: string;
  settings: FLFSettings;
  fingerprint?: string;
  assets_manifest: AssetManifestEntry[];
  flow_nodes: FLFFlowNode[];
  flow_edges: FLFFlowEdge[];
}
```

### 协议化路径

FLF 支持多种资产引用协议：

- **`https://`** - 远程 URL
- **`local://`** - 包内相对路径
- **`asset://`** - 数据库 UUID
- **`blob://`** - 前端临时上传（编辑态）

```typescript
import { parseAssetSrc, buildAssetSrc } from "@kongzijs/flf-core";

// 解析路径
const parsed = parseAssetSrc("asset://550e8400-e29b-41d4-a716-446655440000");
// { protocol: "asset", uuid: "550e8400-...", path: "550e8400-..." }

// 构建路径
const src = buildAssetSrc("asset", "550e8400-e29b-41d4-a716-446655440000");
// "asset://550e8400-e29b-41d4-a716-446655440000"
```

### 验证 FLF

```typescript
import { validateFLFManifest } from "@kongzijs/flf-core";

const result = validateFLFManifest(manifest);

if (!result.valid) {
  result.errors.forEach((error) => {
    console.error(`${error.field}: ${error.message}`);
  });
}
```

### 节点类型

FLF 支持三种节点类型：

1. **Learn Node** - 学习/内容节点
   - 包含 Markdown 内容
   - 可关联多个媒体资源
   - 支持观看进度追踪

2. **Test Node** - 测试/校验节点
   - 引用 Quiz DSL 资产
   - 支持通过分数设置
   - 支持失败重定向

3. **Resource Node** - 资源节点
   - 提供额外学习资源

### 示例数据

```typescript
import {
  createExampleFLF,
  createMinimalFLF,
  createComplexFLF,
  createEditorStateFLF,
} from "@kongzijs/flf-core";

// 简单示例
const simple = createExampleFLF();

// 最小化示例
const minimal = createMinimalFLF("L-001");

// 复杂示例（多个节点和边）
const complex = createComplexFLF();

// 编辑态示例（包含 blob:// 协议）
const editor = createEditorStateFLF();
```

## API 参考

### 类型

- `FLFManifest` - 完整的 FLF 清单
- `FLFFlowNode` - 流程节点
- `FLFFlowEdge` - 流程边
- `AssetManifestEntry` - 资产清单条目
- `FLFSettings` - 课程设置
- `FlowNodeRules` - 节点规则

### 函数

#### 协议化路径

- `parseAssetSrc(src: string): ParsedAssetSrc` - 解析协议化路径
- `buildAssetSrc(protocol: AssetProtocol, path: string): string` - 构建协议化路径
- `isProtocol(src: string, protocol: AssetProtocol): boolean` - 检查协议类型
- `extractUuidFromAssetSrc(src: string): string | null` - 提取 UUID

#### 验证

- `validateFLFManifest(manifest: any): ValidationResult` - 验证 FLF 清单

#### 示例生成

- `createExampleFLF(): FLFManifest` - 创建简单示例
- `createMinimalFLF(lessonId: string): FLFManifest` - 创建最小化示例
- `createComplexFLF(): FLFManifest` - 创建复杂示例
- `createEditorStateFLF(): FLFManifest` - 创建编辑态示例

#### Transformer

- `FLFTransformer.toReactFlow(manifest: FLFManifest)` - 转换为 React Flow 格式
- `FLFTransformer.fromReactFlow(...)` - 从 React Flow 转换

## 测试

```bash
# 运行测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率
pnpm test:coverage
```

## 相关 RFC

- [RFC 0017: FLF JSON Specification](../../docs/rfc/0017-flf-specification.md)
- [RFC 0020: FLF Transformer Engine](../../docs/rfc/0020-flf-transformer.md)
- [RFC 0018: Flow Canvas (React Flow)](../../docs/rfc/0018-flf-ui-experience.md)

## 许可证

Private - Internal Use Only
