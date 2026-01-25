# OAuth 生产环境配置指南

## 问题描述

在生产环境中，OAuth 回调 URL 仍然使用 `http://localhost:3000` 而不是生产域名。

## 解决方案

### 1. 代码修复 ✅

已修复 `src/store/useAuthStore.ts` 中的 `signInWithGoogle` 方法：
- 现在会从当前 URL 路径中提取 locale
- 构建正确的回调 URL：`${origin}/${locale}/auth/callback`
- 支持所有语言环境

### 2. 环境变量配置

确保在生产环境中设置以下环境变量：

```bash
# 生产环境域名（例如：https://yourdomain.com）
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Supabase 配置（应该已经设置）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**重要**：`NEXT_PUBLIC_SITE_URL` 必须设置为生产环境的完整 URL（包括协议 `https://`）。

### 3. Supabase Dashboard 配置

在 Supabase Dashboard 中配置 OAuth 重定向 URL：

1. **登录 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 选择你的项目

2. **导航到 Authentication > URL Configuration**
   - 路径：`Authentication` → `URL Configuration`

3. **配置 Site URL**
   - **Site URL**: 设置为你的生产域名
     ```
     https://yourdomain.com
     ```

4. **配置 Redirect URLs**
   - **Redirect URLs**: 只需要添加一个通用的回调 URL（不依赖 locale）
     ```
     https://yourdomain.com/api/auth/callback
     ```

   **注意**：OAuth 回调现在是通用的，不需要为每个语言配置单独的 URL。Locale 信息通过查询参数传递。

5. **配置 Google OAuth Provider**
   - 路径：`Authentication` → `Providers` → `Google`
   - 确保 **Enabled** 已开启
   - **Client ID** 和 **Client Secret** 已正确配置
   - **Authorized redirect URIs** 在 Google Cloud Console 中也需要配置（见下方）

### 4. Google Cloud Console 配置

在 Google Cloud Console 中配置 OAuth 重定向 URI：

1. **访问 Google Cloud Console**
   - https://console.cloud.google.com/
   - 选择你的项目

2. **导航到 APIs & Services > Credentials**
   - 路径：`APIs & Services` → `Credentials`

3. **编辑 OAuth 2.0 Client ID**
   - 找到你的 OAuth 2.0 Client ID
   - 点击编辑

4. **添加 Authorized redirect URIs**
   添加所有语言的回调 URL：
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

   **注意**：Supabase 使用自己的回调端点，所以只需要添加 Supabase 的回调 URL，而不是你的应用 URL。

### 5. 验证配置

#### 检查代码中的回调 URL 构建

在浏览器控制台中运行（在登录页面）：
```javascript
// 检查当前路径
console.log(window.location.pathname);

// 检查构建的回调 URL（在 signInWithGoogle 调用时）
// 应该输出类似：https://yourdomain.com/en/auth/callback
```

#### 检查 Supabase 配置

1. 在 Supabase Dashboard 中检查：
   - Site URL 是否正确
   - Redirect URLs 是否包含所有语言的回调 URL

2. 测试 OAuth 登录：
   - 访问生产环境的登录页面
   - 点击 "Sign in with Google"
   - 检查浏览器地址栏中的重定向 URL
   - 应该看到：`https://yourdomain.com/api/auth/callback?code=...&locale=...&next=...`

### 6. 常见问题排查

#### 问题 1: 仍然重定向到 localhost

**原因**：
- 环境变量 `NEXT_PUBLIC_SITE_URL` 未设置或设置错误
- Supabase Dashboard 中的 Site URL 配置错误

**解决**：
1. 检查生产环境的环境变量
2. 在 Supabase Dashboard 中更新 Site URL
3. 重新部署应用

#### 问题 2: 回调 URL 缺少 locale

**原因**：
- 代码未正确提取 locale

**解决**：
- 已修复：代码现在会从路径中提取 locale
- 确保 URL 路径包含 locale（例如：`/en/sign-in`）

#### 问题 3: OAuth 回调失败

**原因**：
- Redirect URL 未在 Supabase Dashboard 中配置
- Redirect URL 格式不正确

**解决**：
1. 在 Supabase Dashboard 中添加通用的回调 URL：`https://yourdomain.com/api/auth/callback`
2. 确保 URL 格式正确（不需要 locale 前缀）

### 7. 开发环境配置

对于本地开发，确保：

1. **环境变量** (`.env.local`):
   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Supabase Dashboard**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: 
     ```
     http://localhost:3000/api/auth/callback
     ```

### 8. 部署检查清单

- [ ] 设置生产环境变量 `NEXT_PUBLIC_SITE_URL`
- [ ] 在 Supabase Dashboard 中更新 Site URL
- [ ] 在 Supabase Dashboard 中添加通用的 Redirect URL：`https://yourdomain.com/api/auth/callback`
- [ ] 在 Google Cloud Console 中配置 OAuth 回调 URL
- [ ] 测试 OAuth 登录流程
- [ ] 验证回调 URL 包含正确的 locale
- [ ] 验证回调后正确重定向到目标页面

## 相关文件

- `src/store/useAuthStore.ts` - OAuth 登录逻辑
- `app/api/auth/callback/route.ts` - OAuth 回调处理器（通用，不依赖 locale）
- `.env.local` - 本地环境变量
- Supabase Dashboard - 生产环境配置

## 架构说明

OAuth 回调路由使用 `/api/auth/callback` 而不是 `/[locale]/auth/callback`，因为：

1. **通用性**：OAuth 回调是语言无关的，不需要为每个语言创建单独的路由
2. **简化配置**：只需要在 Supabase Dashboard 中配置一个回调 URL
3. **灵活性**：Locale 信息通过查询参数传递，可以在回调后重定向到正确的语言页面
4. **维护性**：减少代码重复，更容易维护

