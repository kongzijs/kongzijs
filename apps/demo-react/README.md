# FLF Lesson Builder Demo

这是一个用于测试和演示 FLF Lesson Builder 的 React 应用。

## 功能

- 使用 `@kongzijs/lesson-builder` 组件创建和编辑课程
- 支持 React Flow 可视化编辑
- 集成 FLF 验证
- 示例数据加载

## 开发

```bash
# 安装依赖（在根目录）
pnpm install

# 启动开发服务器
cd apps/demo-react
pnpm dev
```

应用将在 `http://localhost:5173` 启动（Vite 默认端口）。

## 技术栈

- React 18
- Vite
- TypeScript
- @kongzijs/lesson-builder
- @kongzijs/flf-core
- @xyflow/react (React Flow)

## 项目结构

```
apps/demo-react/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 依赖配置
├── vite.config.ts       # Vite 配置
└── tsconfig.json        # TypeScript 配置
```
