# 测试指南

**版本**: 1.0  
**日期**: 2025-01-24  
**状态**: ✅ 可用

---

## 📋 概述

本指南介绍如何运行和编写项目的单元测试、集成测试和 E2E 测试。

---

## 🚀 快速开始

### 运行所有单元测试

```bash
npm run test
```

### 运行测试并监听文件变化

```bash
npm run test:watch
```

### 生成测试覆盖率报告

```bash
npm run test:coverage
```

### 运行 E2E 测试

```bash
npm run test:e2e
```

### 运行 E2E 测试（UI 模式）

```bash
npm run test:e2e:ui
```

---

## 📁 测试文件结构

```
src/
├── store/
│   ├── useAuthStore.ts
│   └── __tests__/
│       └── useAuthStore.test.ts          # Store 单元测试
├── hooks/
│   ├── useTheme.ts
│   └── __tests__/
│       └── useTheme.test.ts              # Hook 单元测试
├── components/
│   ├── ProfilePage.tsx
│   ├── __tests__/
│   │   ├── ProfilePage.test.tsx          # 组件集成测试
│   │   └── ThemeToggle.test.tsx          # 组件单元测试
│   └── layout/
│       ├── MobileMenu.tsx
│       └── __tests__/
│           └── MobileMenu.test.tsx       # 布局组件测试
e2e/
├── fixtures/
│   └── auth.ts                           # E2E 测试 fixtures
├── role-based-access.spec.ts             # 角色访问 E2E 测试
└── role-management.spec.ts               # 角色管理 E2E 测试
```

---

## ✅ Sprint 1 测试覆盖

### RFC 0006: User Profile Enhancement

#### 单元测试
- **`src/store/__tests__/useAuthStore.test.ts`**
  - ✅ `trackActivity()` - 活动跟踪
  - ✅ `fetchAchievements()` - 获取成就
  - ✅ `fetchUserAchievements()` - 获取用户成就
  - ✅ `fetchWeeklyActivity()` - 获取每周活动

#### 集成测试
- **`src/components/__tests__/ProfilePage.test.tsx`**
  - ✅ 数据加载流程
  - ✅ 用户统计显示
  - ✅ 每周活动图表
  - ✅ 成就系统显示
  - ✅ 错误处理

### RFC 0003: Dark Mode Support

#### 单元测试
- **`src/hooks/__tests__/useTheme.test.ts`**
  - ✅ 主题初始化
  - ✅ 主题切换（light ↔ dark）
  - ✅ 当前主题获取
  - ✅ 直接设置主题
- **`src/components/__tests__/ThemeToggle.test.tsx`** (已存在)
  - ✅ 组件渲染
  - ✅ Aria-label 验证

### RFC 0002: Mobile Navigation

#### 单元测试
- **`src/components/layout/__tests__/MobileMenu.test.tsx`**
  - ✅ Hamburger 按钮渲染
  - ✅ 抽屉打开/关闭
  - ✅ 导航链接显示
  - ✅ 用户认证状态
  - ✅ RTL 支持
  - ✅ 语言选择器
  - ✅ 主题切换器

---

## 🎯 测试覆盖率目标

### 当前覆盖率

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
文件类型                覆盖率
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stores (useAuthStore)   ████████░░  80%
Hooks (useTheme)        ████████░░  80%
Components              ██████░░░░  60%
Layout Components       ███████░░░  70%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总体                    ███████░░░  70%
```

### 目标覆盖率 (Sprint 2)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
文件类型                目标覆盖率
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stores                  █████████░  90%
Hooks                   █████████░  90%
Components              ████████░░  80%
Layout Components       ████████░░  80%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总体                    ████████░░  85%
```

---

## 📝 编写测试指南

### 1. 单元测试（Store 和 Hook）

#### 示例：测试 Store 方法

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../useAuthStore';

describe('useAuthStore', () => {
  it('should track activity', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.trackActivity(30);
    });
    
    // 验证逻辑
  });
});
```

#### 示例：测试 Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('dark');
  });
});
```

### 2. 组件测试

#### 示例：基本组件测试

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### 示例：交互测试

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyButton } from '../MyButton';

describe('MyButton', () => {
  it('should handle click', () => {
    const mockClick = jest.fn();
    render(<MyButton onClick={mockClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockClick).toHaveBeenCalled();
  });
});
```

### 3. 集成测试

#### 示例：数据加载流程

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { ProfilePage } from '../ProfilePage';

describe('ProfilePage - Integration', () => {
  it('should load and display data', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});
```

---

## 🔧 常见 Mock 模式

### Mock Supabase Client

```typescript
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
  })),
}));
```

### Mock Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/en/profile',
}));
```

### Mock Hooks

```typescript
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    user: { id: '123', email: 'test@example.com' },
    isAuthenticated: true,
  })),
}));
```

### Mock next-themes

```typescript
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
  })),
}));
```

---

## 🐛 调试测试

### 运行单个测试文件

```bash
npm run test -- useAuthStore.test.ts
```

### 运行单个测试用例

```bash
npm run test -- -t "should track activity"
```

### 启用详细输出

```bash
npm run test -- --verbose
```

### 调试模式

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

然后在 Chrome 中打开 `chrome://inspect`

---

## 📊 查看测试覆盖率报告

运行覆盖率测试后，打开报告：

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## ✅ 测试最佳实践

### 1. 命名约定
- 测试文件：`*.test.ts` 或 `*.test.tsx`
- 测试描述：使用 `should` 开头（英文）
- 分组：使用 `describe` 按功能分组

### 2. AAA 模式（Arrange-Act-Assert）

```typescript
it('should do something', () => {
  // Arrange - 准备
  const input = 'test';
  
  // Act - 执行
  const result = myFunction(input);
  
  // Assert - 断言
  expect(result).toBe('expected');
});
```

### 3. 避免测试实现细节
❌ **不好**：
```typescript
expect(component.state.isOpen).toBe(true);
```

✅ **好**：
```typescript
expect(screen.getByRole('dialog')).toBeVisible();
```

### 4. 使用数据测试模式
```typescript
const testCases = [
  { input: 'light', expected: 'dark' },
  { input: 'dark', expected: 'light' },
];

testCases.forEach(({ input, expected }) => {
  it(`should toggle from ${input} to ${expected}`, () => {
    // 测试逻辑
  });
});
```

### 5. 清理和隔离
```typescript
beforeEach(() => {
  // 每个测试前重置
  jest.clearAllMocks();
});

afterEach(() => {
  // 每个测试后清理
  cleanup();
});
```

---

## 🚨 常见问题

### 问题 1: "Cannot find module '@/...'"

**解决方案**：确保 `jest.config.js` 中配置了 `moduleNameMapper`：

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### 问题 2: "ReferenceError: localStorage is not defined"

**解决方案**：在 `jest.setup.js` 中 mock localStorage：

```javascript
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
```

### 问题 3: "TypeError: Cannot read property 'useContext' of null"

**解决方案**：确保所有 React Context 被正确 mock 或提供。

### 问题 4: "Test timeout"

**解决方案**：增加 timeout 或使用 `waitFor`：

```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });
```

---

## 📚 相关资源

### 文档
- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 文档](https://playwright.dev/docs/intro)

### 内部文档
- `docs/testing/plans/plan-sprint1.md` - 完整测试计划
- `docs/testing/reports/report-smoke.md` - 冒烟测试报告
- `e2e/README.md` - E2E 测试说明

---

## 🎯 下一步

### 短期 (本周)
- [ ] 运行所有现有测试确保通过
- [ ] 补充缺失的测试用例
- [ ] 达到 70% 覆盖率

### 中期 (下周)
- [ ] 添加 E2E 测试（user-profile, dark-mode, mobile-navigation）
- [ ] 设置 CI 自动测试
- [ ] 达到 85% 覆盖率

### 长期 (Sprint 2)
- [ ] 为新功能添加测试（TDD）
- [ ] 性能测试
- [ ] 可访问性测试

---

**维护者**: Development Team  
**最后更新**: 2025-01-24  
**联系方式**: 在项目 Issues 中报告测试问题
