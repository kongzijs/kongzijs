# Owner 页面手动测试指南

**RFC**: 0010  
**创建日期**: 2025-12-06

---

## 📋 测试前准备

### 1. 确保你有 Owner 角色

**方式一：检查当前用户角色**

在 Supabase Dashboard → SQL Editor 中执行：

```sql
-- 检查你的用户 ID 和角色
SELECT 
  u.email,
  ur.role,
  ur.assigned_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'albert.lee.cn@gmail.com';
```

**预期结果**：应该看到 `owner` 角色

**方式二：如果没有 owner 角色，创建它**

```sql
-- 使用你的 user_id（从上面的查询获取）
SELECT update_user_role(
  'bad9da61-0aac-436b-8cd0-ed31664fe5c2'::UUID,  -- 替换为你的 user_id
  'owner',
  '手动测试：创建 owner 角色'
);
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 准备测试数据

确保数据库中有至少 2-3 个测试用户（用于测试角色管理功能）。

---

## 🧪 测试步骤

### 步骤 1: 登录并访问 Owner 页面

1. **打开浏览器**
   - 访问 `http://localhost:3000/en/sign-in`

2. **登录**
   - 使用你的 owner 账户登录（`albert.lee.cn@gmail.com`）
   - ✅ 应该成功登录并重定向到 `/en/dashboard`

3. **访问 Owner 页面**
   - 在浏览器地址栏输入：`http://localhost:3000/en/owner`
   - 或点击导航菜单中的 "Owner" 链接（如果有）
   - ✅ 应该成功访问，显示 "超级用户管理" 页面

4. **验证页面标题**
   - ✅ 页面应该显示 "超级用户管理"
   - ✅ 应该显示描述："管理所有用户和角色，可以添加和修改任何角色"

---

### 步骤 2: 验证用户列表显示

1. **检查用户列表加载**
   - ✅ 页面应该显示一个表格
   - ✅ 表格应该包含以下列：
     - 邮箱
     - 姓名
     - 当前角色
     - 添加角色
     - 操作

2. **检查用户数据**
   - ✅ 应该显示所有用户（包括你自己）
   - ✅ 每个用户应该显示其所有角色（Badge 形式）
   - ✅ 如果用户有多个角色，应该显示多个 Badge

3. **检查加载状态**
   - 如果数据正在加载，应该显示 "加载中..."
   - ✅ 加载完成后，应该显示用户列表

---

### 步骤 3: 测试添加角色功能

#### 测试 3.1: 添加 Tutor 角色

1. **选择一个用户**（不是你自己，避免测试自己的角色）
   - 在表格中找到第一个用户

2. **检查用户当前角色**
   - 查看 "当前角色" 列
   - 记录用户已有的角色

3. **选择新角色**
   - 在 "添加角色" 列的下拉菜单中选择 "Tutor"
   - ✅ 下拉菜单应该显示：Student, Tutor, Admin, Owner

4. **添加角色**
   - 点击 "添加角色" 按钮
   - ✅ 按钮应该显示 "添加中..."（短暂显示）
   - ✅ 应该显示成功消息："角色更新成功"

5. **验证角色已添加**
   - ✅ 用户列表中该用户的 "当前角色" 应该显示新的 "Tutor" Badge
   - ✅ 如果用户已经有 "Tutor" 角色，按钮应该被禁用

#### 测试 3.2: 添加 Admin 角色（只有 Owner 可以）

1. **选择另一个用户**

2. **选择 Admin 角色**
   - 在下拉菜单中选择 "Admin"
   - 点击 "添加角色" 按钮

3. **验证成功**
   - ✅ 应该显示成功消息
   - ✅ 用户应该显示 "Admin" Badge
   - ✅ 这验证了只有 Owner 可以添加 Admin 角色

#### 测试 3.3: 尝试添加已存在的角色

1. **选择一个已有 "Student" 角色的用户**

2. **尝试再次添加 Student 角色**
   - 在下拉菜单中选择 "Student"
   - ✅ "添加角色" 按钮应该被禁用（灰色）
   - ✅ 这防止了重复添加相同角色

---

### 步骤 4: 测试权限验证

#### 测试 4.1: 使用 Admin 账户测试（应该失败）

1. **登出当前账户**
   - 点击登出按钮
   - ✅ 应该重定向到 `/en/sign-in`

2. **使用 Admin 账户登录**
   - 登录一个只有 `admin` 角色的账户

3. **尝试访问 Owner 页面**
   - 直接访问 `http://localhost:3000/en/owner`
   - ❌ 应该被重定向到 `/en/admin` 或 `/en/dashboard`
   - ❌ 或者显示错误消息："只有超级用户可以访问此页面"

4. **验证 Admin 无法修改角色**
   - 访问 `/en/admin/users`
   - ✅ 应该能看到用户列表
   - ❌ 不应该看到 "添加角色" 按钮（只读模式）

#### 测试 4.2: 使用 Student 账户测试（应该失败）

1. **登出并登录 Student 账户**

2. **尝试访问 Owner 页面**
   - 直接访问 `http://localhost:3000/en/owner`
   - ❌ 应该被重定向到 `/en/dashboard`

---

### 步骤 5: 测试错误处理

#### 测试 5.1: 网络错误处理

1. **断开网络连接**（或使用浏览器 DevTools 模拟离线）

2. **尝试添加角色**
   - 选择一个用户，尝试添加角色
   - ❌ 应该显示错误消息（例如："加载用户列表失败" 或 "角色更新失败"）

3. **恢复网络连接**

4. **重试操作**
   - ✅ 应该成功

#### 测试 5.2: 无效操作处理

1. **尝试添加已存在的角色**
   - 选择一个已有 "Student" 角色的用户
   - 选择 "Student" 并尝试添加
   - ✅ 按钮应该被禁用，无法点击

---

### 步骤 6: 验证审计日志

1. **在 Owner 页面添加一个角色**
   - 选择一个用户，添加 "Tutor" 角色
   - ✅ 应该显示成功消息

2. **检查数据库审计日志**
   - 在 Supabase Dashboard → SQL Editor 中执行：
     ```sql
     SELECT 
       u.email as user_email,
       rc.old_role,
       rc.new_role,
       rc.reason,
       rc.created_at,
       changed_by_user.email as changed_by_email
     FROM public.role_changes rc
     JOIN auth.users u ON rc.user_id = u.id
     JOIN auth.users changed_by_user ON rc.changed_by = changed_by_user.id
     ORDER BY rc.created_at DESC
     LIMIT 10;
     ```

3. **验证审计记录**
   - ✅ 应该看到刚才的角色变更记录
   - ✅ `new_role` 应该是 "tutor"
   - ✅ `changed_by_email` 应该是你的邮箱
   - ✅ `reason` 应该包含 "Owner 手动修改角色"

---

## ✅ 测试检查清单

### 基本功能

- [ ] 可以成功访问 `/en/owner` 页面
- [ ] 页面显示正确的标题和描述
- [ ] 用户列表正确加载和显示
- [ ] 每个用户显示其所有角色（Badge）

### 角色管理功能

- [ ] 可以添加 "Tutor" 角色
- [ ] 可以添加 "Admin" 角色（只有 Owner 可以）
- [ ] 可以添加 "Student" 角色
- [ ] 不能添加已存在的角色（按钮被禁用）
- [ ] 添加角色后，用户列表自动刷新
- [ ] 显示成功/错误消息

### 权限验证

- [ ] Owner 可以访问页面
- [ ] Admin 无法访问页面（被重定向）
- [ ] Student 无法访问页面（被重定向）
- [ ] 未登录用户无法访问页面（重定向到登录页）

### 错误处理

- [ ] 网络错误时显示错误消息
- [ ] 无效操作时按钮被禁用
- [ ] 错误消息清晰易懂

### 审计日志

- [ ] 角色变更记录在 `role_changes` 表
- [ ] 审计记录包含正确的信息（user_id, old_role, new_role, changed_by, reason）

---

## 🐛 常见问题排查

### 问题 1: 无法访问 Owner 页面

**症状**：访问 `/en/owner` 被重定向到 `/en/dashboard`

**解决方案**：
1. 检查你的用户是否有 `owner` 角色：
   ```sql
   SELECT * FROM public.user_roles 
   WHERE user_id = '<your-user-id>' AND role = 'owner';
   ```
2. 如果没有，使用上面的 SQL 创建 owner 角色
3. 刷新页面或重新登录

### 问题 2: 用户列表为空

**症状**：页面显示表格但没有用户数据

**解决方案**：
1. 检查浏览器控制台是否有错误
2. 检查网络请求是否成功（DevTools → Network）
3. 验证 `getAllUsers()` API 是否正常工作
4. 检查数据库中是否有用户：
   ```sql
   SELECT COUNT(*) FROM auth.users;
   ```

### 问题 3: 添加角色失败

**症状**：点击 "添加角色" 按钮后显示错误

**解决方案**：
1. 检查浏览器控制台错误信息
2. 检查网络请求（DevTools → Network）
3. 验证目标用户是否存在
4. 检查是否尝试添加已存在的角色
5. 验证你的账户是否有 owner 角色

### 问题 4: 按钮一直显示 "添加中..."

**症状**：点击按钮后，按钮状态不变

**解决方案**：
1. 检查网络请求是否完成
2. 检查浏览器控制台是否有 JavaScript 错误
3. 刷新页面重试

---

## 📊 测试数据准备

### 创建测试用户（可选）

如果需要更多测试用户，可以在 Supabase Dashboard → Authentication → Users 中创建：

1. **创建 Student 用户**
   - Email: `test-student@example.com`
   - Password: `test-password-123`

2. **创建 Admin 用户**
   - Email: `test-admin@example.com`
   - Password: `test-password-123`
   - 然后使用 Owner 账户添加 `admin` 角色

3. **创建 Tutor 用户**
   - Email: `test-tutor@example.com`
   - Password: `test-password-123`
   - 然后使用 Owner 账户添加 `tutor` 角色

---

## 🎯 测试重点

### 关键功能验证

1. **角色添加功能**
   - ✅ Owner 可以添加所有角色（tutor, admin, student）
   - ✅ 不能添加已存在的角色
   - ✅ 添加后立即更新 UI

2. **权限验证**
   - ✅ 只有 Owner 可以访问此页面
   - ✅ 其他角色被正确重定向

3. **数据一致性**
   - ✅ UI 显示的角色与数据库一致
   - ✅ 审计日志正确记录

4. **用户体验**
   - ✅ 加载状态清晰
   - ✅ 成功/错误消息明确
   - ✅ 操作反馈及时

---

## 📝 测试记录模板

```
测试日期: ___________
测试人员: ___________
环境: [ ] 本地开发 [ ] 生产环境

测试结果:
- [ ] 基本功能测试通过
- [ ] 角色管理功能测试通过
- [ ] 权限验证测试通过
- [ ] 错误处理测试通过
- [ ] 审计日志测试通过

发现问题:
1. _________________________________
2. _________________________________

备注:
_________________________________
```

---

**测试指南版本**: 1.0  
**最后更新**: 2025-12-06

