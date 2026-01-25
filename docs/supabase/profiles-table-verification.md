# Profiles 表设置验证清单

## ✅ 已完成的设置

### 1. 表结构 (Phase 0 & Phase 1)

**基础字段**:
- ✅ `id` (UUID, PRIMARY KEY, REFERENCES auth.users)
- ✅ `email` (TEXT, NOT NULL)
- ✅ `full_name` (TEXT, NOT NULL)
- ✅ `birthday` (TEXT, nullable)
- ✅ `level` (INTEGER, DEFAULT 1)
- ✅ `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- ✅ `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**扩展字段** (Phase 1):
- ✅ `avatar_url` (TEXT, nullable)
- ✅ `current_streak` (INTEGER, DEFAULT 0)
- ✅ `longest_streak` (INTEGER, DEFAULT 0)
- ✅ `total_lessons` (INTEGER, DEFAULT 0)
- ✅ `total_minutes` (INTEGER, DEFAULT 0)
- ✅ `weekly_goal_minutes` (INTEGER, DEFAULT 150)
- ✅ `weekly_progress_minutes` (INTEGER, DEFAULT 0)
- ✅ `last_activity_date` (DATE, nullable)
- ✅ `preferences` (JSONB, DEFAULT '{}')

### 2. 安全性设置

**Row Level Security (RLS)**:
- ✅ RLS 已启用: `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`

**RLS 策略**:
- ✅ `Users can view own profile` - SELECT 策略 (auth.uid() = id)
- ✅ `Users can update own profile` - UPDATE 策略 (auth.uid() = id)
- ✅ `Users can insert own profile` - INSERT 策略 (auth.uid() = id)

### 3. 自动更新机制

**触发器**:
- ✅ `set_updated_at` 触发器 - 自动更新 `updated_at` 字段
- ✅ 使用 `handle_updated_at()` 函数

**函数**:
- ✅ `handle_updated_at()` - 自动更新时间戳

### 4. 性能优化

**索引**:
- ✅ `profiles_email_idx` - 在 `email` 字段上创建索引，加速查询

### 5. 外键约束

**引用完整性**:
- ✅ `id` 字段引用 `auth.users(id)` 并设置 `ON DELETE CASCADE`
- ✅ 当用户被删除时，profile 记录自动删除

### 6. TypeScript 类型定义

**已更新** (`src/store/useAuthStore.ts`):
- ✅ `UserProfile` 接口已更新，包含所有数据库字段
- ✅ 类型定义与数据库 schema 完全匹配

## 📋 验证步骤

### 1. 检查迁移是否已应用

```bash
# 检查迁移状态
npm run db:migration:list

# 或者直接推送到数据库
npm run db:push
```

### 2. 验证表结构

在 Supabase Dashboard 或使用 SQL:

```sql
-- 检查表是否存在
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
);

-- 检查所有列
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 检查 RLS 策略
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 检查触发器
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'profiles';

-- 检查索引
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'profiles';
```

### 3. 测试 RLS 策略

```sql
-- 作为已认证用户测试
-- 应该只能看到自己的 profile
SELECT * FROM public.profiles;

-- 应该只能更新自己的 profile
UPDATE public.profiles 
SET full_name = 'Test Name' 
WHERE id = auth.uid();

-- 应该只能插入自己的 profile
INSERT INTO public.profiles (id, email, full_name)
VALUES (auth.uid(), 'test@example.com', 'Test User');
```

### 4. 测试触发器

```sql
-- 更新 profile，检查 updated_at 是否自动更新
UPDATE public.profiles 
SET full_name = 'Updated Name'
WHERE id = auth.uid();

-- 检查 updated_at 是否已更新
SELECT full_name, updated_at 
FROM public.profiles 
WHERE id = auth.uid();
```

## 🔍 常见问题排查

### 问题 1: 迁移未应用

**症状**: 表不存在或缺少字段

**解决**:
```bash
npm run db:push
```

### 问题 2: RLS 策略未创建

**症状**: 无法访问 profile 数据

**解决**: 检查迁移文件中的 `DO $$` 块是否正确执行。可以手动创建策略：

```sql
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
```

### 问题 3: 触发器未工作

**症状**: `updated_at` 字段未自动更新

**解决**: 检查触发器是否存在：

```sql
-- 重新创建触发器
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### 问题 4: TypeScript 类型不匹配

**症状**: 编译错误或类型检查失败

**解决**: 确保 `UserProfile` 接口包含所有数据库字段（已完成 ✅）

## 📝 相关文件

- **迁移文件**: `supabase/migrations/20251204014553_user_profile_enhancement.sql`
- **TypeScript 类型**: `src/store/useAuthStore.ts` (UserProfile 接口)
- **RFC 文档**: `docs/rfc/0006-user-profile-enhancement.md`

## ✅ 总结

Profiles 表已正确设置，包括：
- ✅ 完整的表结构（基础字段 + 扩展字段）
- ✅ RLS 安全策略
- ✅ 自动更新触发器
- ✅ 性能优化索引
- ✅ TypeScript 类型定义

所有设置都遵循 Supabase 最佳实践和安全规范。

