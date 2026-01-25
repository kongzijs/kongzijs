# Sprint 1 测试计划

**版本**: 1.0  
**日期**: 2025-01-24  
**状态**: 🟡 待执行

---

## 📋 测试覆盖现状

### ✅ 已有测试

1. **单元测试** (1 个)
   - `src/components/__tests__/ThemeToggle.test.tsx`
     - ✅ 组件渲染测试
     - ✅ Aria-label 测试

2. **E2E 测试** (2 个)
   - `e2e/role-based-access.spec.ts` (RFC 0010 相关)
   - `e2e/role-management.spec.ts` (RFC 0010 相关)

### ❌ 测试缺口

Sprint 1 实施的 4 个 RFC **完全没有测试覆盖**：
- RFC 0002: 移动端导航
- RFC 0003: 暗黑模式
- RFC 0006: 用户资料增强
- RFC 0008: 登录保护路由（有 E2E，但未验证）

---

## 🎯 测试目标

### 目标 1: 单元测试覆盖 (优先级: 🔥 高)
- 为关键 hooks 和 store 方法添加单元测试
- 目标覆盖率: ≥60%

### 目标 2: 集成测试覆盖 (优先级: 🔥 高)
- 验证用户资料数据加载流程
- 验证暗黑模式切换

### 目标 3: E2E 测试覆盖 (优先级: ⚡ 中)
- 移动端导航测试
- 暗黑模式端到端测试
- 用户资料页面完整流程

### 目标 4: 浏览器手动验证 (优先级: 🔥 高)
- 所有主要功能的手动冒烟测试
- 响应式设计验证
- RTL 支持验证

---

## 📝 详细测试计划

## 1️⃣ RFC 0006: User Profile Enhancement

### 1.1 单元测试 (新增)

#### `src/store/__tests__/useAuthStore.test.ts`

```typescript
describe('useAuthStore - User Profile Enhancement', () => {
  describe('trackActivity', () => {
    it('should call update_user_activity RPC', async () => {
      // 测试活动跟踪
    });

    it('should handle errors gracefully', async () => {
      // 测试错误处理
    });
  });

  describe('fetchAchievements', () => {
    it('should fetch all achievements', async () => {
      // 测试成就获取
    });

    it('should return empty array on error', async () => {
      // 测试错误场景
    });
  });

  describe('fetchUserAchievements', () => {
    it('should fetch user unlocked achievements', async () => {
      // 测试用户成就
    });

    it('should join with achievements table', async () => {
      // 测试表连接
    });
  });

  describe('fetchWeeklyActivity', () => {
    it('should return 7 days of activity', async () => {
      // 测试 7 天数据
    });

    it('should fill missing days with default values', async () => {
      // 测试数据填充
    });

    it('should format dates correctly', async () => {
      // 测试日期格式
    });
  });
});
```

**预计工作量**: 2-3 小时

### 1.2 集成测试 (新增)

#### `src/components/__tests__/ProfilePage.integration.test.tsx`

```typescript
describe('ProfilePage - Integration', () => {
  it('should load user profile data on mount', async () => {
    // 测试数据加载
  });

  it('should display loading state', () => {
    // 测试加载状态
  });

  it('should display achievements with unlock status', async () => {
    // 测试成就显示
  });

  it('should display weekly activity chart', async () => {
    // 测试活动图表
  });

  it('should handle empty achievements', async () => {
    // 测试空成就
  });
});
```

**预计工作量**: 3-4 小时

### 1.3 E2E 测试 (新增)

#### `e2e/user-profile.spec.ts`

```typescript
test.describe('User Profile Enhancement', () => {
  test('should display user statistics', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/profile');
    
    // 验证统计卡片
    await expect(authenticatedPage.locator('[data-testid="current-streak"]')).toBeVisible();
    await expect(authenticatedPage.locator('[data-testid="total-lessons"]')).toBeVisible();
    await expect(authenticatedPage.locator('[data-testid="total-minutes"]')).toBeVisible();
  });

  test('should display weekly activity chart', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/profile');
    
    // 验证 7 天活动
    const activityBars = authenticatedPage.locator('[data-testid^="activity-day-"]');
    await expect(activityBars).toHaveCount(7);
  });

  test('should display achievements', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/en/profile');
    
    // 验证成就列表
    await expect(authenticatedPage.locator('[data-testid="achievements-section"]')).toBeVisible();
  });

  test('should track activity when lesson completed', async ({ authenticatedPage }) => {
    // 完成一课
    await authenticatedPage.goto('/en/learning/level-1/lesson-1');
    await authenticatedPage.click('[data-testid="complete-lesson"]');
    
    // 返回资料页面
    await authenticatedPage.goto('/en/profile');
    
    // 验证统计更新
    // ... 断言逻辑
  });
});
```

**预计工作量**: 4-5 小时

---

## 2️⃣ RFC 0003: Dark Mode Support

### 2.1 单元测试 (扩展)

#### `src/hooks/__tests__/useTheme.test.ts` (新增)

```typescript
describe('useTheme hook', () => {
  it('should initialize with light theme', () => {
    // 测试默认主题
  });

  it('should toggle between light and dark', () => {
    // 测试切换功能
  });

  it('should persist theme to localStorage', () => {
    // 测试持久化
  });

  it('should return mounted status', () => {
    // 测试 mounted 状态
  });
});
```

**预计工作量**: 1-2 小时

### 2.2 集成测试 (新增)

#### `src/components/__tests__/DarkMode.integration.test.tsx`

```typescript
describe('Dark Mode Integration', () => {
  it('should apply dark class to html element', () => {
    // 测试 DOM 变化
  });

  it('should update semantic colors on theme change', () => {
    // 测试 CSS 变量
  });

  it('should work across all pages', async () => {
    // 测试全局应用
  });
});
```

**预计工作量**: 2-3 小时

### 2.3 E2E 测试 (新增)

#### `e2e/dark-mode.spec.ts`

```typescript
test.describe('Dark Mode', () => {
  test('should toggle theme', async ({ page }) => {
    await page.goto('/en');
    
    // 点击主题切换按钮
    await page.click('[aria-label*="theme"]');
    
    // 验证 dark class
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should persist theme across page navigation', async ({ page }) => {
    await page.goto('/en');
    await page.click('[aria-label*="theme"]');
    
    // 导航到其他页面
    await page.goto('/en/dashboard');
    
    // 验证主题保持
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should apply correct semantic colors in dark mode', async ({ page }) => {
    await page.goto('/en');
    await page.click('[aria-label*="theme"]');
    
    // 验证 CSS 变量
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background');
    });
    
    expect(bgColor).toContain('0'); // dark mode background hsl
  });
});
```

**预计工作量**: 3-4 小时

---

## 3️⃣ RFC 0002: Mobile Navigation

### 3.1 单元测试 (新增)

#### `src/components/layout/__tests__/MobileMenu.test.tsx`

```typescript
describe('MobileMenu', () => {
  it('should render hamburger button', () => {
    // 测试按钮渲染
  });

  it('should open drawer on button click', () => {
    // 测试抽屉打开
  });

  it('should close drawer on close button click', () => {
    // 测试抽屉关闭
  });

  it('should close drawer on navigation', () => {
    // 测试导航后关闭
  });

  it('should render in RTL mode correctly', () => {
    // 测试 RTL 支持
  });
});
```

**预计工作量**: 2-3 小时

### 3.2 E2E 测试 (新增)

#### `e2e/mobile-navigation.spec.ts`

```typescript
test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should display hamburger button on mobile', async ({ page }) => {
    await page.goto('/en');
    
    // 验证 hamburger 按钮可见
    await expect(page.locator('[aria-label="Open menu"]')).toBeVisible();
  });

  test('should open mobile menu', async ({ page }) => {
    await page.goto('/en');
    
    // 点击 hamburger
    await page.click('[aria-label="Open menu"]');
    
    // 验证抽屉打开
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should display all navigation links', async ({ page }) => {
    await page.goto('/en');
    await page.click('[aria-label="Open menu"]');
    
    // 验证所有链接
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Learning')).toBeVisible();
  });

  test('should display language selector', async ({ page }) => {
    await page.goto('/en');
    await page.click('[aria-label="Open menu"]');
    
    // 验证语言选择器
    await expect(page.locator('[aria-label="Change language"]')).toBeVisible();
  });

  test('should display theme toggle', async ({ page }) => {
    await page.goto('/en');
    await page.click('[aria-label="Open menu"]');
    
    // 验证主题切换
    await expect(page.locator('text=Theme')).toBeVisible();
  });

  test('should close menu on navigation', async ({ page }) => {
    await page.goto('/en');
    await page.click('[aria-label="Open menu"]');
    
    // 点击导航链接
    await page.click('text=About');
    
    // 验证抽屉关闭
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should support RTL mode', async ({ page }) => {
    await page.goto('/ar'); // 阿拉伯语
    
    // 验证抽屉从右侧滑入
    // ... RTL 测试逻辑
  });
});
```

**预计工作量**: 4-5 小时

---

## 4️⃣ 手动浏览器测试清单

### 4.1 桌面端测试 (Chrome, Safari, Firefox)

#### 基础功能
- [ ] 页面加载正常
- [ ] 导航链接工作
- [ ] 暗黑模式切换
- [ ] 语言切换
- [ ] 登录/登出

#### 用户资料 (RFC 0006)
- [ ] 访问 `/profile`
- [ ] 验证统计数据显示（Current Streak, Total Lessons, Total Minutes）
- [ ] 验证每周活动图表（7 天数据）
- [ ] 验证成就列表显示
- [ ] 验证未解锁成就为灰色
- [ ] 验证加载状态

#### 暗黑模式 (RFC 0003)
- [ ] 点击主题切换按钮
- [ ] 验证所有页面颜色正确变化
- [ ] 验证语义化颜色应用（background, foreground, primary, secondary, accent）
- [ ] 刷新页面主题保持
- [ ] 跨页面导航主题保持

### 4.2 移动端测试 (Chrome Mobile, Safari iOS)

#### 响应式布局
- [ ] 页面在移动端正确显示
- [ ] Hamburger 按钮显示
- [ ] 桌面导航隐藏

#### 移动端导航 (RFC 0002)
- [ ] 点击 Hamburger 按钮
- [ ] 抽屉从左侧滑入
- [ ] 显示所有导航链接
- [ ] 语言选择器（图标+Popover）
- [ ] 主题切换器
- [ ] 用户信息区域
- [ ] 点击导航链接后抽屉关闭
- [ ] 点击关闭按钮抽屉关闭
- [ ] 点击遮罩抽屉关闭

#### RTL 支持
- [ ] 切换到阿拉伯语 (ar)
- [ ] 抽屉从右侧滑入
- [ ] 布局镜像正确
- [ ] 图标方向正确

### 4.3 跨浏览器测试

#### Chrome (最新版本)
- [ ] 所有功能正常

#### Safari (最新版本)
- [ ] 所有功能正常
- [ ] iOS Safari 移动端测试

#### Firefox (最新版本)
- [ ] 所有功能正常

#### Edge (最新版本)
- [ ] 所有功能正常

### 4.4 性能测试

- [ ] 首次内容绘制 (FCP) < 1.8s
- [ ] 最大内容绘制 (LCP) < 2.5s
- [ ] 首次输入延迟 (FID) < 100ms
- [ ] 累积布局偏移 (CLS) < 0.1
- [ ] Lighthouse 性能分数 > 90

### 4.5 可访问性测试

- [ ] 键盘导航
  - [ ] Tab 键可以遍历所有交互元素
  - [ ] Enter/Space 可以激活按钮
  - [ ] Escape 可以关闭抽屉
- [ ] 屏幕阅读器
  - [ ] 所有图标有 aria-label
  - [ ] 语义化 HTML 标签
  - [ ] 焦点管理正确

---

## 📊 测试执行计划

### Phase 1: 单元测试 (优先级: 🔥 高)
**预计时间**: 1-2 天

1. ✅ `useAuthStore` 测试 (2-3h)
2. ✅ `useTheme` 测试 (1-2h)
3. ✅ `MobileMenu` 测试 (2-3h)
4. ✅ `ProfilePage` 集成测试 (3-4h)

**总计**: 8-12 小时

### Phase 2: E2E 测试 (优先级: ⚡ 中)
**预计时间**: 2-3 天

1. ✅ `user-profile.spec.ts` (4-5h)
2. ✅ `dark-mode.spec.ts` (3-4h)
3. ✅ `mobile-navigation.spec.ts` (4-5h)

**总计**: 11-14 小时

### Phase 3: 手动测试 (优先级: 🔥 高)
**预计时间**: 1 天

1. ✅ 桌面端测试 (2-3h)
2. ✅ 移动端测试 (2-3h)
3. ✅ 跨浏览器测试 (2-3h)
4. ✅ 性能测试 (1h)
5. ✅ 可访问性测试 (1h)

**总计**: 8-10 小时

---

## 🎯 测试成功标准

### 单元测试
- ✅ 所有新增功能有测试覆盖
- ✅ 测试覆盖率 ≥ 60%
- ✅ 所有测试通过
- ✅ 无 flaky 测试

### E2E 测试
- ✅ 关键用户流程覆盖
- ✅ 所有测试通过
- ✅ 在 CI 中稳定运行

### 手动测试
- ✅ 所有浏览器功能正常
- ✅ 移动端体验良好
- ✅ 无明显 bug
- ✅ 性能指标达标

---

## 📋 测试工具

### 当前工具
- ✅ Jest (单元测试)
- ✅ React Testing Library (组件测试)
- ✅ Playwright (E2E 测试)

### 需要添加的工具
- 📝 @testing-library/user-event (用户交互模拟)
- 📝 @testing-library/jest-dom (更好的断言)
- 📝 Mock Service Worker (API mocking)

---

## 🐛 已知问题

### 1. ProfilePage 测试需要 Supabase Mock
- **问题**: 需要 mock Supabase RPC 调用
- **解决方案**: 使用 MSW 或 jest.mock

### 2. ThemeProvider 需要 localStorage Mock
- **问题**: next-themes 依赖 localStorage
- **解决方案**: 在测试环境中 mock localStorage

### 3. 移动端 Drawer 需要 CSS Transforms 支持
- **问题**: JSDOM 不支持某些 CSS 特性
- **解决方案**: 在 E2E 测试中验证，跳过单元测试中的动画

---

## 📈 下一步行动

### 立即执行 (今天)
1. 🔥 执行手动浏览器测试清单（4.1-4.5）
2. 🔥 记录所有发现的问题

### 短期计划 (本周)
1. ⚡ 编写 useAuthStore 单元测试
2. ⚡ 编写 ProfilePage 集成测试
3. ⚡ 编写移动端导航 E2E 测试

### 中期计划 (下周)
1. 📝 完成所有单元测试
2. 📝 完成所有 E2E 测试
3. 📝 设置 CI 自动测试

---

**报告人**: AI Assistant  
**审核**: Pending User Review  
**下一步**: 执行手动浏览器测试清单
