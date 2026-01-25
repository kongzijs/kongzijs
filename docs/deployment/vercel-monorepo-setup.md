# Vercel Monorepo 配置指南

本文档说明如何在 Vercel 上配置 monorepo 部署。

## 当前 Monorepo 结构

```
Fluencewebsitedesign/
├── apps/
│   └── web/              # Next.js 应用（需要部署）
│       ├── app/
│       ├── src/
│       ├── package.json
│       └── vercel.json
├── packages/             # 共享包
│   ├── flf-core/
│   ├── lesson-builder/
│   └── ui/
├── pnpm-workspace.yaml   # pnpm workspace 配置
├── nx.json              # Nx 配置
└── package.json         # 根 package.json
```

## Vercel Dashboard 配置步骤

### 1. 设置 Root Directory

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **General**
4. 找到 **Root Directory** 部分
5. 点击 **Edit**，选择 `apps/web`
6. **重要**：启用 **"Include source files outside of the Root Directory in the Build Step"**
   - 这允许构建过程访问 monorepo 根目录的共享包

### 2. 验证构建设置

在 **Settings** → **General** → **Build & Development Settings** 中，确认：

- **Framework Preset**: Next.js（应该自动检测）
- **Build Command**: `cd ../.. && pnpm --filter @kongzijs/web build`
- **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`
- **Output Directory**: `.next`（Next.js 默认）

### 3. 环境变量

确保所有必要的环境变量都在 Vercel Dashboard 中配置：
- **Settings** → **Environment Variables**

## vercel.json 配置说明

当前 `apps/web/vercel.json` 配置：

```json
{
  "buildCommand": "cd ../.. && pnpm --filter @kongzijs/web build",
  "devCommand": "pnpm dev",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 配置解释

- **installCommand**: 从 `apps/web` 目录切换到根目录，然后执行 `pnpm install`
  - `--frozen-lockfile` 确保使用锁定的依赖版本
- **buildCommand**: 从根目录执行，使用 `pnpm --filter` 只构建 `@kongzijs/web` 包
- **framework**: 明确指定为 Next.js，帮助 Vercel 自动优化

## 工作原理

1. **安装阶段**：
   - Vercel 在 `apps/web` 目录下执行 `installCommand`
   - 命令切换到根目录 (`cd ../..`) 并运行 `pnpm install`
   - pnpm 会安装所有 workspace 依赖，包括共享包

2. **构建阶段**：
   - Vercel 在 `apps/web` 目录下执行 `buildCommand`
   - 命令切换到根目录并运行 `pnpm --filter @kongzijs/web build`
   - 这会构建 `@kongzijs/web` 应用及其依赖的共享包

3. **部署**：
   - Vercel 部署 `.next` 输出目录

## 故障排除

### 问题：构建失败，找不到共享包

**解决方案**：
- 确保在 Dashboard 中启用了 "Include source files outside of the Root Directory"
- 检查 `apps/web/package.json` 中的 workspace 依赖是否正确：
  ```json
  {
    "dependencies": {
      "@kongzijs/flf-core": "workspace:*"
    }
  }
  ```

### 问题：pnpm 版本不匹配

**解决方案**：
- 检查 `pnpm-lock.yaml` 中的 `lockfileVersion`
- Vercel 会根据 `lockfileVersion` 自动选择 pnpm 版本
- 如果需要特定版本，可以在根目录添加 `.npmrc`：
  ```
  engine-strict=true
  ```

### 问题：构建命令找不到 pnpm

**解决方案**：
- 确保 `pnpm-lock.yaml` 存在于根目录
- Vercel 会自动检测 pnpm 并安装

## 验证部署

部署后，检查：

1. **构建日志**：确认所有依赖都正确安装
2. **运行时错误**：检查是否有共享包导入错误
3. **功能测试**：验证应用功能正常

## 参考资源

- [Vercel Monorepos 文档](https://vercel.com/docs/monorepos)
- [Vercel Package Managers 文档](https://vercel.com/docs/package-managers)
- [pnpm Workspace 文档](https://pnpm.io/workspaces)
