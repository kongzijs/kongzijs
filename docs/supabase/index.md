# Supabase Development Guide

Complete guide for setting up and managing Supabase in this project.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Environment Variables](#environment-variables)
3. [Database Password Explained](#database-password-explained)
4. [CLI Setup & Commands](#cli-setup--commands)
5. [Database Migrations](#database-migrations)
6. [Workflows & Best Practices](#workflows--best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Keeping CLI Updated](#keeping-cli-updated)
9. [Client vs Server Operations](#client-vs-server-operations) ⭐ **重要：安全架构解析**

---

## Client vs Server Operations ⭐ **重要：安全架构解析**

### 为什么 Supabase 推荐客户端操作？

#### 核心理念：数据库级别的安全（RLS）

Supabase 的设计哲学是：**安全应该在数据库层面强制执行，而不是依赖应用层**。

```
传统架构：
客户端 → 后端 API → 数据库
         ↑ 安全在这里（容易被绕过）

Supabase 架构：
客户端 → Supabase API → PostgreSQL (RLS)
         ↑ 安全在这里（数据库级别，无法绕过）
```

#### 关键优势

1. **性能优势**
   - 减少网络往返（不需要通过自己的后端）
   - 直接连接数据库，延迟更低
   - 支持实时订阅（Realtime）

2. **开发效率**
   - 减少后端代码
   - 更快的开发迭代
   - 自动生成的类型定义

3. **可扩展性**
   - 减少服务器负载
   - 数据库直接处理请求
   - 更好的并发处理

### 安全是如何保证的？

#### 1. Row Level Security (RLS) - 数据库级别的安全

**RLS 是在 PostgreSQL 数据库层面强制执行的**，这意味着：

- ✅ **无法绕过**：即使有人修改客户端代码，也无法绕过 RLS
- ✅ **自动应用**：每条查询都会自动应用 RLS 策略
- ✅ **零信任模型**：数据库不信任任何客户端，只信任 `auth.uid()`

**示例：RLS 如何工作**

```sql
-- 用户只能看到自己的数据
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
```

**即使攻击者：**
- 修改客户端代码
- 使用 Postman/curl 直接调用 API
- 尝试注入 SQL

**结果：** 他们仍然只能看到自己的数据，因为 RLS 在数据库层面强制执行。

#### 2. API 密钥系统

Supabase 使用两种密钥：

**`anon` 密钥（公共密钥）**
- ✅ **可以暴露在客户端**
- ✅ **受 RLS 保护**
- ✅ **只能执行 RLS 允许的操作**

```typescript
// 客户端代码 - 安全
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // 可以公开
);
```

**`service_role` 密钥（服务端密钥）**
- ❌ **绝对不能在客户端使用**
- ⚠️ **绕过所有 RLS**
- ✅ **只能在服务器端使用**

```typescript
// 服务器端代码 - 需要特殊权限时
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 只在服务器端
);
```

#### 3. 认证系统

Supabase 的认证系统：

- **JWT Token**：每个请求都包含用户身份
- **`auth.uid()`**：数据库函数，返回当前认证用户的 ID
- **自动验证**：Supabase 自动验证每个请求的 token

```sql
-- 在数据库函数中
v_user_id := auth.uid(); -- 从 JWT token 中获取，无法伪造
```

### 何时使用客户端操作？

#### ✅ 适合客户端操作的情况

1. **用户数据 CRUD**
   - 用户只能操作自己的数据（RLS 保护）
   - 例如：更新个人资料、查看自己的活动记录

2. **实时功能**
   - 实时聊天、通知
   - 需要 WebSocket 连接

3. **简单查询**
   - 公共数据（如产品列表）
   - 用户自己的数据

**示例：安全的客户端操作**

```typescript
// ✅ 安全：RLS 确保用户只能更新自己的资料
const { error } = await supabase
  .from('profiles')
  .update({ full_name: 'New Name' })
  .eq('id', user.id); // RLS 会验证 auth.uid() = id

// ✅ 安全：函数使用 auth.uid()，不信任客户端输入
const { error } = await supabase.rpc('update_user_activity', {
  p_lessons_completed: 5,
  p_minutes_practiced: 30
  // 注意：没有传递 user_id，函数内部使用 auth.uid()
});
```

### 何时使用服务端操作？

#### ⚠️ 需要服务端操作的情况

1. **敏感操作**
   - 支付处理
   - 发送邮件
   - 管理操作

2. **需要绕过 RLS 的操作**
   - 管理员操作
   - 跨用户数据聚合
   - 系统级操作

3. **需要 `service_role` 的操作**
   - 批量操作
   - 数据迁移
   - 管理任务

**示例：服务端操作**

```typescript
// 服务器端 API Route (Next.js)
// app/api/admin/users/route.ts

import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // 使用 service_role 密钥（只在服务器端）
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ 只在服务器端
  );

  // 可以查询所有用户（绕过 RLS）
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  return Response.json(data);
}
```

### 常见误解

#### ❌ 误解 1："客户端操作不安全"

**事实：** 客户端操作在 RLS 保护下是安全的。

- RLS 在数据库层面强制执行
- 即使攻击者修改客户端代码，也无法绕过 RLS
- `anon` 密钥本身是安全的，因为它受 RLS 限制

#### ❌ 误解 2："需要隐藏 API 密钥"

**事实：** `anon` 密钥设计为可以公开。

- `anon` 密钥是公共的，可以暴露在客户端
- 安全来自 RLS，不是密钥的保密性
- 真正需要保护的是 `service_role` 密钥

#### ❌ 误解 3："所有操作都应该在服务端"

**事实：** 大多数操作可以在客户端安全执行。

- 用户数据操作（CRUD）可以在客户端
- 只有敏感操作需要服务端
- 过度使用服务端会降低性能和开发效率

### 安全检查清单

#### ✅ 客户端操作安全检查

- [ ] 所有表都启用了 RLS
- [ ] RLS 策略正确配置（用户只能访问自己的数据）
- [ ] 使用 `anon` 密钥（不是 `service_role`）
- [ ] 数据库函数使用 `auth.uid()`（不信任客户端输入）
- [ ] 输入验证（防止负值、溢出等）

#### ✅ 服务端操作安全检查

- [ ] 使用 `service_role` 密钥（只在服务器端）
- [ ] 验证管理员/特殊权限
- [ ] 不在客户端代码中暴露 `service_role` 密钥
- [ ] 限制服务端 API 的访问（认证、授权）

### 我们的项目架构

**当前实现（RFC 0006）**

```typescript
// ✅ 客户端操作 - 安全
// src/store/useAuthStore.ts

trackActivity: async (params) => {
  const { user } = get();
  if (!user) return { error: new Error("Not authenticated") };

  // 函数使用 auth.uid()，不传递 user_id
  const { error } = await supabase.rpc('update_user_activity', {
    p_lessons_completed: params.lessonsCompleted || 0,
    p_minutes_practiced: params.minutesPracticed || 0,
    // 注意：没有 user_id 参数
  });

  return { error };
}
```

**为什么安全？**

1. ✅ RLS 策略保护 `user_activity` 表
2. ✅ `update_user_activity()` 函数使用 `auth.uid()` 直接获取用户 ID
3. ✅ 输入验证防止恶意输入
4. ✅ 使用 `anon` 密钥（受 RLS 保护）

### 总结

**Supabase 推荐客户端操作的原因**

1. **性能**：减少网络往返，降低延迟
2. **开发效率**：减少后端代码，更快迭代
3. **安全性**：RLS 在数据库层面强制执行，无法绕过
4. **可扩展性**：数据库直接处理请求，减少服务器负载

**关键要点**

- ✅ **RLS 是安全的核心**：所有安全都依赖 RLS 策略
- ✅ **`anon` 密钥可以公开**：安全来自 RLS，不是密钥保密
- ✅ **`service_role` 密钥必须保密**：只在服务器端使用
- ✅ **大多数操作可以在客户端**：只有敏感操作需要服务端

**最佳实践**

1. **默认使用客户端操作**（受 RLS 保护）
2. **只在必要时使用服务端操作**（敏感操作、管理员功能）
3. **始终启用并测试 RLS 策略**
4. **使用数据库函数处理复杂逻辑**（使用 `auth.uid()`）

**参考资源：**
- [Supabase RLS 文档](https://supabase.com/docs/guides/database/row-level-security)
- [Supabase 安全最佳实践](https://supabase.com/docs/guides/database/secure-data)
- [Supabase 客户端 vs 服务端](https://supabase.com/docs/guides/api)

**关键要点：**
- RLS 无法绕过（即使修改客户端代码）
- 数据库函数使用 `auth.uid()` 获取用户身份（无法伪造）
- 我们的实现遵循最佳实践（RFC 0006）

---

## Initial Setup

### Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

### Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password (⚠️ **Save this password!** You'll need it for CLI operations)
   - Region: Select the closest region to your users
4. Click "Create new project"

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 3: Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings as needed

---

## Environment Variables

### Required Variables

Create a `.env.local` file in the root of the project:

```env
# Required: Application credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Database password for CLI commands
# Only needed for: db:link, db:pull operations
# See "Database Password Explained" section below
# SUPABASE_DB_PASSWORD=your-database-password
```

**Important:** Never commit your `.env.local` file to git. It's already in `.gitignore`.

### Two Types of Credentials

Supabase uses **two different authentication systems**:

#### 1. API Keys (for Application Code)
- **`NEXT_PUBLIC_SUPABASE_URL`** - Your project URL
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** - Public API key (safe to expose in frontend)
- **Purpose**: Used by your Next.js application to interact with Supabase
- **Access Level**: Limited by Row Level Security (RLS) policies
- **Where to find**: Dashboard → Settings → API

#### 2. Database Password (for CLI Operations)
- **`SUPABASE_DB_PASSWORD`** - Database password
- **Purpose**: Used by Supabase CLI to directly connect to PostgreSQL
- **Access Level**: Full database access (can read schema, execute migrations)
- **Where to find**: Dashboard → Settings → Database → Database Password
- **When set**: Created when you first created your Supabase project

---

## Database Password Explained

### Why is Password Needed?

The Supabase CLI needs direct PostgreSQL access for operations like:
- `db pull` - Compares local migrations with remote database schema
- `db link` - Links local CLI to remote Supabase project
- `db push` - Applies migrations to remote database

### How to Provide the Password

#### Option 1: Interactive Prompt (Recommended for Security)
**Default behavior** - CLI will prompt you when needed:

```bash
npm run db:link
# Password: [type your password, won't show characters]
```

**Pros**: Most secure, password never stored  
**Cons**: Must type password each time

#### Option 2: Environment Variable (For Automation)
Set in `.env.local`:

```env
SUPABASE_DB_PASSWORD=your-database-password-here
```

**Pros**: No manual input, works in CI/CD  
**Cons**: Less secure if `.env.local` is exposed

#### Option 3: Command Line Flag (Not Recommended)
```bash
supabase db pull --password "your-password"
```

**⚠️ Avoid**: Visible in command history and process list

### When You'll Be Prompted

| Command | Always Needs Password? | Can Use Env Var? |
|---------|----------------------|------------------|
| `db:link` | ✅ Yes (first time) | ✅ Yes |
| `db:pull` | ✅ Yes | ✅ Yes |
| `db:push` | ⚠️ Usually (if not linked) | ✅ Yes |
| `db:migration:list` | ❌ No | ❌ No |
| `db:migration:new` | ❌ No | ❌ No |
| `db:diff` | ⚠️ Sometimes | ✅ Yes |

### Finding Your Password

If you forgot your database password:

1. Go to Supabase Dashboard → Settings → Database
2. Look for "Database Password" section
3. If forgotten: Click "Reset Database Password" (⚠️ This will disconnect all existing connections)

---

## CLI Setup & Commands

### Quick Start

The project is already initialized with Supabase CLI. To run migrations:

```bash
# 1. Link to your remote Supabase project (one-time setup)
npm run db:link

# 2. Push migrations to remote database
npm run db:push
```

### Available Commands

#### Essential Commands

```bash
# Link to remote Supabase project
npm run db:link

# Push migrations to remote database
npm run db:push

# Pull schema changes from remote database (creates new migration)
npm run db:pull [migration_name]

# Create a new migration
npm run db:migration:new migration_name

# List all migrations
npm run db:migration:list

# Show schema differences (local migrations vs remote)
npm run db:diff
```

#### Advanced Commands

```bash
# Reset local database (requires Docker)
npm run db:reset

# Start local Supabase (requires Docker)
supabase start

# Stop local Supabase
supabase stop

# Check project status
supabase status
```

### Project Structure

```
.
├── supabase/
│   ├── config.toml          # Supabase configuration
│   ├── migrations/          # Database migrations (version controlled)
│   │   └── YYYYMMDDHHMMSS_migration_name.sql
│   └── .temp/               # CLI state (gitignored)
│       └── project-ref      # Linked project reference
└── scripts/
    ├── supabase-link.js     # Helper: Link project from env
    └── supabase-pull.js     # Helper: Pull schema changes
```

**Key Points**:
- `supabase/migrations/` - All migrations go here (committed to git)
- `supabase/.temp/` - CLI state (gitignored, auto-generated)
- Migration files are timestamped and ordered

### First Time Setup

1. **Link to your Supabase project**:
   ```bash
   npm run db:link
   ```
   This will prompt you for your database password (found in Supabase Dashboard → Settings → Database)

2. **Push existing migrations**:
   ```bash
   npm run db:push
   ```
   This will apply all migrations in `supabase/migrations/` to your remote database.

---

## Database Migrations

### Why Migrations?

The Supabase JavaScript client (`@supabase/supabase-js`) **cannot execute raw SQL** for security reasons. It only provides:
- CRUD operations (SELECT, INSERT, UPDATE, DELETE)
- Authentication methods
- Storage operations
- Realtime subscriptions

To execute DDL (Data Definition Language) like `CREATE TABLE`, you need:
1. **Supabase Dashboard SQL Editor** (easiest)
2. **Supabase CLI** (best for version control) ⭐ **Recommended**
3. **Supabase Management API** (advanced, requires service_role key)

### Core Principles

1. **Migrations are the source of truth** - All schema changes go through migration files
2. **Version control everything** - All migrations are committed to git
3. **Remote-first workflow** - We manage the remote database, not local Docker (unless needed)
4. **One-way flow** - Local migrations → Remote database (via `db push`)

### Creating New Migrations

#### Method 1: Manual Migration (Recommended for planned changes)

1. **Create a new migration file**:
   ```bash
   npm run db:migration:new add_user_preferences
   ```
   This creates a timestamped file in `supabase/migrations/`

2. **Write your SQL** in the generated file

3. **Push to remote**:
   ```bash
   npm run db:push
   ```

#### Method 2: Pull from Remote (For schema changes made in Dashboard)

If you made changes directly in Supabase Dashboard (Table Editor, SQL Editor), you can pull those changes:

```bash
# Pull with default migration name
npm run db:pull

# Or specify a custom migration name
npm run db:pull add_user_preferences_column
```

This will:
- Compare your local schema with the remote database
- Create a new migration file with the differences
- **Prompt you for database password**
- You can review and commit the migration file

**⚠️ Warning**: Prefer planned migrations. Only use this for quick fixes or when you forgot to create a migration.

### Migration Best Practices

#### 1. Migration Naming

✅ **Good**:
```
20251203120000_add_user_preferences.sql
20251203120100_add_email_index.sql
20251203120200_fix_profile_constraint.sql
```

❌ **Bad**:
```
migration.sql
update.sql
fix.sql
```

#### 2. Migration Content

✅ **Good**:
```sql
-- Add user preferences table
-- This table stores user-specific settings and preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);
```

❌ **Bad**:
```sql
CREATE TABLE prefs (...);
-- No comments, no RLS, no policies
```

#### 3. Workflow Discipline

✅ **Do**:
- Always create migration before schema changes
- Review SQL before pushing
- Test migrations on dev/staging first
- Commit migrations to git immediately

❌ **Don't**:
- Make changes directly in production Dashboard
- Skip migration files
- Push untested migrations
- Forget to commit migration files

---

## Workflows & Best Practices

### Standard Workflow (Recommended)

**For new features or planned changes:**

1. Create migration: `npm run db:migration:new feature_name`
2. Write SQL in the generated file (`supabase/migrations/`)
3. Review SQL carefully
4. Push to remote: `npm run db:push`
5. Verify in Supabase Dashboard
6. Commit migration file to git

**Key Principle**: Migration files are the source of truth. All schema changes go through migrations.

### Reverse Workflow (Use Sparingly)

**For quick Dashboard changes:**

1. Make change in Dashboard (SQL Editor or Table Editor)
2. Pull schema changes: `npm run db:pull migration_name`
3. Review the generated migration file
4. Commit the migration file to git
5. (Optional) Push to ensure sync: `npm run db:push`

### Team Collaboration Workflow

1. **Before starting work**:
   ```bash
   git pull
   npm run db:push  # Apply any new migrations
   ```

2. **Create your feature**:
   ```bash
   npm run db:migration:new feature_name
   # Write SQL, test, push
   ```

3. **Commit and push**:
   ```bash
   git add supabase/migrations/
   git commit -m "feat: add feature_name"
   git push
   ```

4. **Team members**:
   ```bash
   git pull
   npm run db:push  # Apply your migration
   ```

**Key Principle**: Everyone uses the same migration files. Migrations are applied in order.

### Command Details

#### `db:link` - Link to Remote Project

**What it does**:
- Reads `NEXT_PUBLIC_SUPABASE_URL` from `.env.local`
- Extracts project reference from URL
- Links local CLI to remote Supabase project
- Stores link info in `supabase/.temp/`

**When to use**: First time setup, after cloning project, if link is broken

#### `db:migration:new` - Create Migration

**What it does**:
- Creates timestamped SQL file in `supabase/migrations/`
- Format: `YYYYMMDDHHMMSS_migration_name.sql`
- File is empty, ready for your SQL

**Best Practices**:
- Use descriptive names: `add_user_preferences`, `fix_email_index`
- One migration per logical change
- Keep migrations small and focused

#### `db:push` - Apply Migrations

**What it does**:
- Reads all migration files in `supabase/migrations/`
- Compares with remote database
- Applies only new/unapplied migrations
- Updates remote database schema

**Safety**:
- Only applies new migrations (idempotent)
- Won't re-apply already executed migrations
- Can be run multiple times safely

#### `db:pull` - Pull Schema Changes

**What it does**:
- Compares local schema (from migrations) with remote database
- Generates a new migration file with differences
- Captures changes made in Dashboard

**Docker Requirement**:
- ⚠️ **`db:pull` requires Docker** because it uses a "shadow database" to compare schemas
- The shadow database is a temporary local PostgreSQL instance (via Docker) that:
  1. Applies all your local migrations
  2. Compares the resulting schema with the remote database
  3. Generates a diff migration file
- **Why Docker?**: Supabase CLI needs a clean PostgreSQL instance to apply migrations and generate accurate diffs
- **Alternative**: If you don't have Docker, you can manually create migrations or use Supabase Dashboard SQL Editor

**Limitations**:
- Requires database password
- Requires Docker (for shadow database)
- May not capture all changes perfectly
- Should be reviewed carefully

#### `db:migration:list` - Check Status

**What it does**:
- Shows all migrations and their status
- Indicates which are applied locally vs remotely
- Helps identify sync issues

### The Golden Rule

> All database schema changes must go through migration files in `supabase/migrations/`. Never make production changes directly in Dashboard without pulling them back.

**Quick Reference**:
- New feature? → `db:migration:new` → Write SQL → `db:push`
- Dashboard change? → `db:pull` → Review → Commit
- Team update? → `git pull` → `db:push`

---

## Troubleshooting

### "Missing Supabase environment variables" error

- Make sure you've created a `.env.local` file in the root directory
- Verify the variable names are correct: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### "Could not find the table 'public.profiles'" error

- **This is the most common issue!** The `profiles` table must be created in your Supabase database
- Run migrations: `npm run db:push`
- Or use SQL Editor in Supabase Dashboard
- Verify the table exists by checking **Table Editor** → **profiles**

### "Project not linked"

Run `npm run db:link` to link your project.

### "db:pull hangs or appears frozen"

The `db:pull` command may appear to hang because it's waiting for your database password input:

1. **Check if it's waiting for password**: The command should prompt "Password:" - type your password (it won't show characters) and press Enter
2. **Find your password**: Supabase Dashboard → Settings → Database → Database Password
3. **Alternative**: You can set `SUPABASE_DB_PASSWORD` in `.env.local` (not recommended for security, but useful for automation)
4. **If truly stuck**: Press `Ctrl+C` to cancel, then check your network connection and try again

### "Connection timeout" or "failed to connect to postgres"

**Error**: `failed to connect to postgres: failed to connect to host=aws-1-us-west-1.pooler.supabase.com ... timeout: context deadline exceeded`

**Possible Causes**:

1. **Connection Pool Exhausted** ⚠️ **MOST COMMON**:
   - **Error**: `MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size`
   - **Cause**: Connection pool has reached maximum connections
   - **Solutions**:
     - **Wait 1-2 minutes** for connections to timeout and release
     - **Close other connections**: Check if you have other CLI tools or apps connected
     - **Use direct connection**: Instead of pooler, use direct database connection
     - **Check Supabase Dashboard**: Go to Database → Connection Pooling → Check active connections

2. **Network/Firewall Issues**:
   - Your network may be blocking connections to Supabase
   - Corporate firewall or VPN may be interfering
   - **Solution**: Try from a different network or disable VPN temporarily

3. **Supabase Pooler Issues**:
   - The connection pooler may be temporarily unavailable
   - **Solution**: Wait a few minutes and try again

4. **IP Restrictions**:
   - Your Supabase project may have IP restrictions enabled
   - **Solution**: 
     - Go to Supabase Dashboard → Settings → Database → Network Restrictions
     - Add your current IP address or temporarily allow all IPs

5. **Docker/Shadow Database Issues** (for `db:pull`):
   - Docker may not be running
   - Shadow database may be stuck
   - **Solution**: 
     - Ensure Docker is running: `docker ps`
     - Try restarting Docker
     - Use `db:push` instead (doesn't require Docker)

6. **Connection String Issues**:
   - The linked project may have incorrect connection info
   - **Solution**: 
     - Re-link the project: `npm run db:link`
     - Verify connection in Supabase Dashboard

**Quick Fixes** (in order of priority):

```bash
# 1. Wait for connections to release (1-2 minutes)
# Then try again:
npm run db:migration:list

# 2. Check active connections in Supabase Dashboard
# Database → Connection Pooling → Active Connections

# 3. Re-link the project (refreshes connection info)
npm run db:link

# 4. Use db:push instead (if you don't need to pull)
npm run db:push

# 5. Try with debug mode to see detailed errors
supabase migration list --debug
```

**Alternative**: If `db:pull` keeps failing, manually create migrations instead of pulling from remote.

### "Migration conflicts"

If migrations are out of sync:
1. Check migration status: `npm run db:migration:list`
2. If remote has unapplied migrations, pull them: `npm run db:pull`
3. Resolve conflicts manually if needed
4. Push resolved migrations: `npm run db:push`

### "Permission denied"

- Make sure you're logged in: `supabase login`
- Verify your project access in Supabase Dashboard
- Check you're using the correct database password (not API key)

### "Docker not running" (for db:pull and db:diff)

**Why Docker is needed**:
- `db:pull` and `db:diff` commands require Docker because they use a "shadow database"
- Shadow database is a temporary local PostgreSQL instance that:
  - Applies your local migrations
  - Compares with remote database schema
  - Generates accurate diffs
- **Config**: See `shadow_port = 54320` in `supabase/config.toml`

**Solutions**:
1. **Install Docker**: Required for `db:pull` and `db:diff`
2. **Use `db:push` instead**: For pushing migrations, Docker is NOT required
3. **Manual migrations**: Create migrations manually instead of using `db:pull`
4. **Remote-only workflow**: If you only use `db:push`, you don't need Docker

**Note**: For local development (`supabase start`), Docker is always required. But for remote-only workflow with `db:push`, Docker is optional.

### "Password authentication failed"

- **Check**: You're using the database password, not the API key
- **Solution**: Get the correct password from Dashboard → Settings → Database

### "Environment variable not working"

- **Check**: Variable name is exactly `SUPABASE_DB_PASSWORD`
- **Check**: File is `.env.local` (not `.env`)
- **Check**: File is in project root
- **Solution**: Restart terminal/IDE after adding variable

### Authentication not working

- Check that Email provider is enabled in Supabase dashboard
- Verify your credentials are correct
- Check the browser console for error messages
- Ensure your Supabase project is active (not paused)

### Row Level Security (RLS) errors

- Make sure RLS policies are created
- Verify that the user is authenticated when trying to access their profile
- Check that the policy conditions match your use case

---

## Keeping CLI Updated

Supabase CLI is actively developed with regular updates. To update to the latest version:

### If installed via Homebrew (macOS/Linux):
```bash
brew upgrade supabase/tap/supabase
```

### If installed via npm:
```bash
npm install -g @supabase/cli
```

### Verify version:
```bash
supabase --version
```

**Note**: The CLI will show a notification when a new version is available. It's recommended to update regularly for new features and bug fixes.

---

## Security Considerations

1. **Never commit passwords**: `.env.local` is gitignored
2. **Use RLS**: Always enable Row Level Security
3. **Review migrations**: Check SQL before pushing
4. **Limit access**: Only authorized team members push migrations
5. **Backup before major changes**: Especially in production
6. **Use different passwords** for different environments (dev/staging/prod)
7. **Rotate password** if you suspect it's been compromised

---

## Additional Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli) - Official CLI documentation
- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations) - Migration guide
- [Supabase Dashboard](https://app.supabase.com) - Web interface

---

## Quick Reference

### Initial Setup
```bash
# 1. Create project in Supabase Dashboard
# 2. Get credentials from Settings → API
# 3. Add to .env.local
# 4. Link project
npm run db:link

# 5. Push migrations
npm run db:push
```

### Daily Workflow
```bash
# Create new migration
npm run db:migration:new feature_name

# Edit SQL in supabase/migrations/

# Push to remote
npm run db:push

# Commit to git
git add supabase/migrations/
git commit -m "feat: add feature_name"
```

### Team Workflow
```bash
# Pull latest code
git pull

# Apply new migrations
npm run db:push

# Create your migration
npm run db:migration:new feature_name
# ... work ...
npm run db:push
git add supabase/migrations/
git commit -m "feat: add feature_name"
git push
```

