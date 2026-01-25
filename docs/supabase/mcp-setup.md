# Supabase MCP 服务器配置指南

本指南说明如何为 Cursor IDE 配置 Supabase MCP（Model Context Protocol）服务器，使 AI 助手能够直接与 Supabase 项目交互。

## 什么是 Supabase MCP？

Supabase MCP 服务器允许 AI 助手（如 Cursor 中的 Claude）直接访问您的 Supabase 项目，包括：
- 查看和管理数据库表结构
- 执行查询
- 查看日志
- 管理项目资源

## 前置要求

1. 已安装 Node.js（项目已配置 Volta，会自动使用正确的版本）
2. 拥有 Supabase 账户和项目
3. 已生成 Supabase Personal Access Token (PAT)

## 步骤 1: 生成 Supabase Personal Access Token

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 点击右上角的账户图标
3. 选择 **Account Settings** → **Access Tokens**
4. 点击 **Generate New Token**
5. 为令牌命名（例如：`Cursor MCP`）
6. 复制生成的令牌（⚠️ **重要：令牌只显示一次，请妥善保存**）

## 步骤 2: 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```env
# Supabase MCP Personal Access Token
# 从 Supabase Dashboard > Account Settings > Access Tokens 获取
SUPABASE_MCP_ACCESS_TOKEN=your_personal_access_token_here
```

**安全提示：**
- ⚠️ 不要将 `.env.local` 文件提交到 Git（已在 `.gitignore` 中排除）
- ⚠️ 不要在代码中硬编码访问令牌
- ⚠️ 定期轮换访问令牌以提高安全性

## 步骤 3: 配置 Cursor MCP

配置文件位置：`.cursor/mcp.json`

配置文件内容：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${SUPABASE_MCP_ACCESS_TOKEN}"
      ]
    }
  }
}
```

### Windows 用户

如果您使用的是 Windows，可能需要修改配置：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${SUPABASE_MCP_ACCESS_TOKEN}"
      ]
    }
  }
}
```

## 步骤 4: 重启 Cursor

配置完成后，需要重启 Cursor IDE 以使 MCP 服务器生效。

1. 完全关闭 Cursor
2. 重新打开 Cursor
3. 打开项目

## 步骤 5: 验证配置

配置成功后，您应该能够：

1. 在 Cursor 中询问 AI 助手关于 Supabase 的问题
2. AI 助手可以访问您的 Supabase 项目信息
3. 使用 MCP 工具查询数据库、查看表结构等

### 测试示例

尝试询问 AI 助手：
- "列出我的 Supabase 项目中的所有表"
- "显示 users 表的结构"
- "查询最近的数据库日志"

## 故障排除

### 问题 1: MCP 服务器无法启动

**症状：** Cursor 中看不到 Supabase MCP 功能

**解决方案：**
1. 检查 `.env.local` 文件是否存在且包含 `SUPABASE_MCP_ACCESS_TOKEN`
2. 验证访问令牌是否正确（在 Supabase Dashboard 中重新生成）
3. 检查 `.cursor/mcp.json` 文件格式是否正确（JSON 格式）
4. 重启 Cursor IDE

### 问题 2: 环境变量未加载

**症状：** MCP 服务器报错找不到访问令牌

**解决方案：**
1. 确保 `.env.local` 文件在项目根目录
2. 检查环境变量名称是否正确：`SUPABASE_MCP_ACCESS_TOKEN`
3. 在 Cursor 中重新加载窗口（Cmd/Ctrl + Shift + P → "Reload Window"）

### 问题 3: 权限错误

**症状：** MCP 服务器可以连接但无法访问资源

**解决方案：**
1. 检查 Personal Access Token 是否有效
2. 确认令牌有足够的权限访问项目
3. 在 Supabase Dashboard 中重新生成令牌

### 问题 4: Windows 上的命令执行错误

**症状：** Windows 上 MCP 服务器无法启动

**解决方案：**
1. 使用上面提到的 Windows 特定配置（添加 `cmd /c` 前缀）
2. 确保已安装 Node.js 和 npm
3. 检查 `npx` 命令是否可用（在终端中运行 `npx --version`）

## 安全最佳实践

1. **保护访问令牌**
   - 永远不要将令牌提交到 Git
   - 使用环境变量存储令牌
   - 定期轮换令牌（建议每 90 天）

2. **限制令牌权限**
   - 只授予必要的权限
   - 使用项目特定的令牌而非账户级别的令牌

3. **监控使用情况**
   - 定期检查 Supabase Dashboard 中的访问日志
   - 如果发现异常活动，立即撤销令牌

4. **团队协作**
   - 每个团队成员应使用自己的 Personal Access Token
   - 不要共享令牌
   - 在 `.env.local.example` 中提供模板（不包含真实令牌）

## 相关资源

- [Supabase MCP 服务器文档](https://supabase.com/docs/guides/getting-started/byo-mcp)
- [Supabase MCP 博客文章](https://supabase.com/blog/mcp-server)
- [Model Context Protocol 规范](https://modelcontextprotocol.io/)
- [Cursor MCP 配置文档](https://docs.cursor.com/mcp)

## 更新日志

- **2025-01-XX**: 初始配置文档创建
