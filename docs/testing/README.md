# 测试文档中心

**项目**: Fluence Website Design  
**最后更新**: 2025-01-24  
**状态**: ✅ 已组织

---

## 🚀 快速开始

### 运行测试

```bash
# 单元测试
npm run test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e
```

---

## 📚 文档导航

### 📖 指南文档 (按学习顺序)

| # | 文档 | 描述 | 适用人群 |
|---|------|------|----------|
| 1 | **[测试指南](./guides/testing-guide.md)** | 如何编写和运行测试的完整指南 | 所有开发者 |
| 2 | **[E2E 测试指南](./guides/e2e-guide.md)** | Playwright E2E 测试编写指南 | 前端开发者 |
| 3 | **[Playwright 设置](./guides/playwright-setup.md)** | Playwright 环境配置 | 新团队成员 |

**顺序说明**: 1. 基础测试 → 2. E2E 概念 → 3. 工具设置

### 📋 测试计划 (按时间顺序)

| # | 文档 | 描述 | 适用人群 |
|---|------|------|----------|
| 1 | **[Sprint 1 测试计划](./plans/plan-sprint1.md)** | Sprint 1 完整测试计划 | QA、开发者 |
| 2 | **[手动验证清单](./plans/manual-verification-checklist.md)** | 浏览器手动验证清单 | QA、测试人员 |

**顺序说明**: 1. 测试计划 → 2. 执行清单

### 📊 测试报告 (按时间倒序 - 最新在前)

| # | 文档 | 描述 | 最后更新 |
|---|------|------|----------|
| 1 | **[测试完成报告](./reports/report-completion.md)** | Sprint 1 测试完成情况 | 2025-01-24 |
| 2 | **[单元测试总结](./reports/report-unit-summary.md)** | 单元测试实施总结 | 2025-01-24 |
| 3 | **[冒烟测试报告](./reports/report-smoke.md)** | 浏览器验证报告 | 2025-01-24 |

**顺序说明**: 1. 最新完成报告 → 2. 单元测试 → 3. 冒烟测试

### 🔧 专项测试

| # | 文档 | 描述 |
|---|------|------|
| 1 | **[Owner 页面测试](./special/manual-owner-page.md)** | Owner 页面手动测试清单 |

---

## 📊 测试概览

### 当前状态 (2025-01-24)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
测试类型              状态      通过率
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
单元测试              ✅        100% (16/16)
E2E 测试             ✅        2 个场景
手动测试              📋        待执行
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 代码覆盖率

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
文件                  覆盖率    状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
useTheme.ts           100%      ✅
ThemeToggle.tsx       83.3%     ✅
ProfilePage.tsx       69.4%     ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
平均覆盖率            84%       ✅
```

---

## 🎯 测试策略

### 1. 单元测试 (Jest + React Testing Library)
- **范围**: Hooks, Stores, 组件
- **目标覆盖率**: 70-85%
- **位置**: `src/**/__tests__/*.test.ts(x)`

### 2. E2E 测试 (Playwright)
- **范围**: 用户流程，关键场景
- **浏览器**: Chrome, Firefox, Safari
- **位置**: `e2e/*.spec.ts`

### 3. 手动测试
- **范围**: 响应式设计，跨浏览器，可访问性
- **频率**: 每个 Sprint 结束时
- **清单**: [手动验证清单](./plans/manual-verification-checklist.md)

---

## 🔍 按需求查找

| 我想... | 查看文档 |
|---------|----------|
| 学习如何编写测试 | [测试指南](./guides/testing-guide.md) |
| 运行单元测试 | [测试指南 - 运行测试](./guides/testing-guide.md#运行测试) |
| 查看测试覆盖率 | [单元测试总结](./reports/report-unit-summary.md) |
| 手动测试应用 | [手动验证清单](./plans/manual-verification-checklist.md) |
| 编写 E2E 测试 | [E2E 测试指南](./guides/e2e-guide.md) |
| 设置 Playwright | [Playwright 设置](./guides/playwright-setup.md) |
| 查看 Sprint 1 测试结果 | [测试完成报告](./reports/report-completion.md) |

---

## 📈 测试指标

| 指标 | 当前值 | 目标值 | 状态 |
|------|--------|--------|------|
| 单元测试用例 | 16 | 50+ | 🟡 |
| 单元测试通过率 | 100% | 100% | 🟢 |
| E2E 测试 | 2 | 5 | 🟡 |
| 代码覆盖率 | 84% | 70% | 🟢 |
| 手动测试 | 0% | 100% | 🔴 |

---

## 🐛 报告问题

### 测试失败
1. 查看测试输出
2. 运行 `npm run test -- --verbose` 获取详细信息
3. 参考 [测试指南](./guides/testing-guide.md) 的调试部分

### 发现 Bug
1. 在项目 Issues 中创建问题
2. 记录重现步骤
3. 包含截图（如需要）

---

## 🔄 持续改进

### 短期 (本周)
- [x] 修复失败的单元测试
- [x] 达到 70% 覆盖率
- [ ] 完成手动浏览器测试

### 中期 (下周)
- [ ] 添加 E2E 测试
- [ ] 设置 CI 自动化
- [ ] 性能测试

### 长期 (Sprint 2+)
- [ ] 可访问性测试
- [ ] 视觉回归测试
- [ ] 负载测试

---

---

## 📝 文件命名与排序规范

### 命名规则
- **全部小写**：避免大小写混淆
- **连字符分隔**：使用 `-` 而非下划线或空格
- **类型前缀**：根据文档类型使用前缀

### 文件结构（按字母顺序）

```
docs/testing/
├── README.md                              # 主入口
│
├── guides/                                # 指南文档（按学习顺序）
│   ├── e2e-guide.md                      # 1. E2E 概念
│   ├── playwright-setup.md                # 2. 工具设置
│   └── testing-guide.md                  # 3. 基础测试
│
├── plans/                                 # 测试计划（按时间顺序）
│   ├── manual-verification-checklist.md  # 1. 执行清单
│   └── plan-sprint1.md                    # 2. Sprint 计划
│
├── reports/                               # 测试报告（按时间倒序）
│   ├── report-completion.md               # 1. 最新完成报告
│   ├── report-smoke.md                    # 2. 冒烟测试
│   └── report-unit-summary.md             # 3. 单元测试总结
│
└── special/                               # 专项测试
    └── manual-owner-page.md               # Owner 页面测试
```

### 排序逻辑

| 目录 | 排序方式 | 说明 |
|------|----------|------|
| `guides/` | 字母顺序 | 便于查找，但 README 中按学习顺序展示 |
| `plans/` | 字母顺序 | 便于查找，但 README 中按时间顺序展示 |
| `reports/` | 字母顺序 | 便于查找，但 README 中按时间倒序展示 |
| `special/` | 字母顺序 | 按需添加 |

### 添加新文档
- 指南 → `guides/guide-*.md` (按字母顺序)
- 计划 → `plans/plan-*.md` (按字母顺序)
- 报告 → `reports/report-*.md` (按字母顺序，日期在文件名中)
- 手动测试 → `plans/manual-*.md` 或 `special/manual-*.md`

---

**维护者**: Development Team  
**版本**: 2.1 (统一命名规范)  
**最后审核**: 2025-01-24
