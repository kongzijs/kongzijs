# Playwright E2E 测试设置指南

**RFC**: 0010  
**创建日期**: 2025-12-06

---

## 📋 概述

本指南说明如何设置和使用 Playwright 进行端到端（E2E）测试。

## ✅ 为什么选择 Playwright？

### 优势

1. **多浏览器支持** - Chromium, Firefox, WebKit
2. **自动等待** - 自动等待元素出现，减少 flaky 测试
3. **强大的调试工具** - Playwright Inspector, Trace Viewer
4. **TypeScript 支持** - 完整的类型定义
5. **Next.js 集成** - 官方支持 Next.js
6. **并行执行** - 支持并行运行测试
7. **网络拦截** - 可以模拟 API 响应

### 与其他工具对比

| 特性         | Playwright | Cypress | Selenium |
| ------------ | ---------- | ------- | -------- |
| 多浏览器     | ✅          | ❌       | ✅        |
| 自动等待     | ✅          | ✅       | ❌        |
| 调试工具     | ✅          | ✅       | ⚠️        |
| Next.js 支持 | ✅          | ✅       | ⚠️        |
| 性能         | ⚡ 快       | ⚡ 快    | 🐌 慢     |

**推荐**: Playwright 是当前最佳选择

---

## 🚀 快速开始

### 1. 安装

```bash
# 安装 Playwright
npm install -D @playwright/test playwright

# 安装浏览器（Chromium）
npx playwright install --with-deps chromium
```

### 2. 配置环境变量

创建或更新 `.env.local`：

```bash
# E2E 测试用户凭据
E2E_STUDENT_EMAIL=test-student@example.com
E2E_STUDENT_PASSWORD=test-password-123
E2E_ADMIN_EMAIL=test-admin@example.com
E2E_ADMIN_PASSWORD=test-password-123
E2E_OWNER_EMAIL=albert.lee.cn@gmail.com
E2E_OWNER_PASSWORD=your-actual-password

# 测试基础 URL（可选，默认 http://localhost:3000）
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

### 3. 运行测试

```bash
# 运行所有测试
npm run test:e2e

# UI 模式（推荐用于开发）
npm run test:e2e:ui

# 调试模式
npm run test:e2e:debug
```

---

## 📁 项目结构

```
e2e/
├── fixtures/
│   └── auth.ts                    # 认证辅助函数
├── role-based-access.spec.ts     # 路由权限测试
├── role-management.spec.ts       # 角色管理测试
└── README.md                      # E2E 测试文档

playwright.config.ts               # Playwright 配置
```

---

## 🧪 测试 Fixtures

### 使用预定义的 Fixtures

```typescript
import { test } from "./fixtures/auth";

test("student can access dashboard", async ({ studentPage }) => {
  // studentPage 已经登录为 student 用户
  await studentPage.goto("/en/dashboard");
  await expect(studentPage).toHaveURL(/\/en\/dashboard/);
});
```

### 可用的 Fixtures

- `studentPage` - 已登录的 student 用户
- `adminPage` - 已登录的 admin 用户  
- `ownerPage` - 已登录的 owner 用户
- `authenticatedPage` - 已登录的默认用户

---

## 📝 编写测试

### 基本测试

```typescript
import { test, expect } from "./fixtures/auth";

test("should login and redirect to dashboard", async ({ page }) => {
  await page.goto("/en/sign-in");
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password");
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/en\/dashboard/);
});
```

### 测试角色权限

```typescript
test.describe("Student Role", () => {
  test("can access student pages", async ({ studentPage }) => {
    await studentPage.goto("/en/dashboard");
    await expect(studentPage).toHaveURL(/\/en\/dashboard/);
  });

  test("cannot access admin pages", async ({ studentPage }) => {
    await studentPage.goto("/en/admin");
    // 应该被重定向
    await expect(studentPage).not.toHaveURL(/\/en\/admin/);
  });
});
```

### 测试交互

```typescript
test("should add role to user", async ({ ownerPage }) => {
  await ownerPage.goto("/en/owner");
  
  // 等待表格加载
  await ownerPage.waitForSelector("table tbody tr");
  
  // 选择角色
  const roleSelect = ownerPage.locator('select').first();
  await roleSelect.selectOption("tutor");
  
  // 点击添加按钮
  await ownerPage.click('button:has-text("添加角色")');
  
  // 验证成功消息
  await expect(
    ownerPage.locator('text="角色更新成功"')
  ).toBeVisible();
});
```

---

## 🔧 配置说明

### playwright.config.ts

主要配置项：

- **testDir**: 测试文件目录（`./e2e`）
- **baseURL**: 测试基础 URL（默认 `http://localhost:3000`）
- **webServer**: 自动启动开发服务器
- **projects**: 浏览器配置（Chromium, Firefox, WebKit）
- **reporter**: 测试报告格式

### 环境变量

- `PLAYWRIGHT_TEST_BASE_URL` - 测试基础 URL
- `E2E_*_EMAIL` - 测试用户邮箱
- `E2E_*_PASSWORD` - 测试用户密码

---

## 🐛 调试

### 使用 Playwright Inspector

```bash
npm run test:e2e:debug
```

这会打开 Playwright Inspector，可以：
- 逐步执行测试
- 查看页面状态
- 检查元素
- 修改选择器

### 查看测试报告

```bash
npm run test:e2e:report
```

### 截图和视频

测试失败时自动保存：
- **截图**: `test-results/` 目录
- **视频**: `test-results/` 目录（仅在重试时）

### Trace Viewer

```bash
npx playwright show-trace trace.zip
```

---

## 🚀 CI/CD 集成

### GitHub Actions 示例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      
      - run: npm run test:e2e
        env:
          E2E_STUDENT_EMAIL: ${{ secrets.E2E_STUDENT_EMAIL }}
          E2E_STUDENT_PASSWORD: ${{ secrets.E2E_STUDENT_PASSWORD }}
          # ... 其他环境变量
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📊 测试覆盖率

### 当前测试覆盖

- ✅ 路由权限测试（Student, Admin, Owner）
- ✅ 角色管理功能测试
- ✅ 未认证用户访问测试
- ✅ 错误处理测试

### 待添加测试

- [ ] 多角色用户测试
- [ ] 审计日志验证测试
- [ ] RLS 策略测试（通过 API）
- [ ] 性能测试
- [ ] 移动端测试

---

## 🎯 最佳实践

1. **使用语义选择器**
   ```typescript
   // ✅ 好
   await page.getByRole("button", { name: "登录" }).click();
   
   // ❌ 避免
   await page.click(".btn-login");
   ```

2. **等待元素出现**
   ```typescript
   // ✅ 好
   await page.waitForSelector("table");
   
   // ❌ 避免
   await page.locator("table").click(); // 可能元素还未加载
   ```

3. **独立测试**
   - 每个测试应该独立运行
   - 不依赖其他测试的状态
   - 使用 fixtures 管理状态

4. **清理数据**
   - 测试后清理创建的数据
   - 使用测试专用的用户账户

---

## 📚 参考资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright 最佳实践](https://playwright.dev/docs/best-practices)
- [Next.js 测试指南](https://nextjs.org/docs/app/building-your-application/testing)
- [E2E 测试指南](./e2e-guide.md) (同目录)

---

**设置指南版本**: 1.0  
**最后更新**: 2025-12-06

