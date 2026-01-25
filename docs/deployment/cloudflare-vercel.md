# Cloudflare + Vercel 域名配置指南

本指南将帮助您将 `fluence.it.com` 域名通过 Cloudflare 配置到 Vercel，并启用 Cloudflare 的 SSL/TLS 支持。

## ⚡ 快速参考：配置位置

| 配置项 | 配置位置 | 说明 |
|--------|---------|------|
| **DNS 服务器（Nameservers）** | **域名注册商** | 在域名注册商处配置，指向 Cloudflare 的 nameservers |
| **DNS 记录（A、CNAME）** | **Cloudflare** | 所有 DNS 记录都在 Cloudflare 中配置 |
| **SSL/TLS** | **Cloudflare** | SSL 加密模式、HTTPS 重定向等都在 Cloudflare 中配置 |
| **域名添加** | **Vercel** | 在 Vercel 中添加域名，获取 DNS 配置信息 |
| **代码部署** | **Vercel** | 项目代码部署在 Vercel |

### 配置顺序

1. ✅ **域名注册商** → 配置 DNS 服务器指向 Cloudflare
2. ✅ **Cloudflare** → 添加域名，获取 nameservers
3. ✅ **Vercel** → 部署项目，添加域名
4. ✅ **Cloudflare** → 配置 DNS 记录（A 或 CNAME）指向 Vercel
5. ✅ **Cloudflare** → 配置 SSL/TLS

## 🔍 为什么需要两个平台？

### 工作流程说明

```
用户访问 fluence.it.com
    ↓
1. DNS 查询（Cloudflare 处理）
   - 用户在浏览器输入 fluence.it.com
   - DNS 查询到 Cloudflare 的 DNS 服务器
   - Cloudflare 返回 DNS 记录（指向 Vercel 的服务器）
    ↓
2. 请求路由到 Vercel
   - 浏览器连接到 Vercel 的服务器（通过 DNS 记录）
   - Vercel 提供网站内容（您的 Next.js 应用）
    ↓
3. SSL 加密（Cloudflare 处理）
   - Cloudflare 在用户 ↔ Cloudflare 之间加密（免费 SSL）
   - Vercel 在 Cloudflare ↔ Vercel 之间加密（Vercel 自动生成证书）
```

### 为什么需要 Vercel？

**Vercel 的作用**：
1. **托管您的网站代码** - 您的 Next.js 应用运行在 Vercel 的服务器上
2. **提供服务器地址** - Vercel 告诉您 DNS 记录应该指向哪个 IP 或域名
3. **生成 SSL 证书** - Vercel 自动为 Cloudflare ↔ Vercel 之间的连接生成证书

**Cloudflare 的作用**：
1. **管理 DNS 服务器** - 处理所有 DNS 查询
2. **提供用户端 SSL** - 为用户 ↔ Cloudflare 之间的连接提供免费 SSL
3. **CDN 加速** - 如果开启代理，提供全球 CDN 加速

### 简单类比

- **Cloudflare** = 邮局（DNS）和门卫（SSL）
- **Vercel** = 您的房子（网站服务器）

DNS 服务器在 Cloudflare，但 DNS 记录必须指向 Vercel 的服务器，这样用户才能访问到您的网站。

## 前提条件

1. 拥有 `fluence.it.com` 域名的管理权限
2. 域名已在 Cloudflare 上管理（DNS 服务器指向 Cloudflare）
3. Vercel 账户（如果没有，请访问 https://vercel.com 注册）

## ⚠️ 重要：域名提供商的 DNS 服务器配置

### 在域名注册商处配置 Cloudflare DNS 服务器

**这是第一步，必须在其他配置之前完成！**

如果您还没有将域名的 DNS 服务器指向 Cloudflare，请按以下步骤操作：

#### 步骤 1: 在 Cloudflare 添加域名

1. 登录 Cloudflare：https://dash.cloudflare.com
2. 点击 **"Add a Site"** 或 **"Add Site"**
3. 输入 `fluence.it.com`
4. 选择免费计划（Free plan）
5. Cloudflare 会自动扫描现有 DNS 记录

#### 步骤 2: 获取 Cloudflare 的 DNS 服务器地址

Cloudflare 会显示两个 nameservers（DNS 服务器地址），类似：

```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

**或者可能是**：

```
[随机名称].ns.cloudflare.com
[随机名称].ns.cloudflare.com
```

**重要**：每个域名都有唯一的 nameservers，请使用 Cloudflare 显示给您的具体地址。

#### 步骤 3: 在域名注册商处配置 DNS 服务器

登录您的域名注册商（例如：GoDaddy、Namecheap、Google Domains、Cloudflare Registrar 等），找到域名管理页面：

**常见域名注册商的配置位置**：

| 注册商 | 配置位置 |
|--------|---------|
| **GoDaddy** | My Products → Domains → [您的域名] → DNS → Nameservers → Change |
| **Namecheap** | Domain List → Manage → Advanced DNS → Nameservers |
| **Google Domains** | DNS → Name servers → Use custom name servers |
| **Cloudflare Registrar** | 如果域名在 Cloudflare 注册，已自动配置 |
| **其他注册商** | 通常在 "DNS Settings"、"Name Servers" 或 "DNS Management" 中 |

**配置步骤**：

1. 找到 **"Name Servers"** 或 **"DNS Servers"** 设置
2. 选择 **"Custom Nameservers"** 或 **"Use Custom Nameservers"**
3. 删除旧的 nameservers（如果有）
4. 添加 Cloudflare 提供的两个 nameservers：
   ```
   alice.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```
5. 保存更改

#### 步骤 4: 等待 DNS 传播

- DNS 服务器更改通常需要 **24-48 小时** 才能完全生效
- 您可以使用以下工具检查是否已生效：
  - https://www.whatsmydns.net/
  - https://dnschecker.org/
  - 在终端运行：`dig NS fluence.it.com`

#### 验证 DNS 服务器配置

在终端运行以下命令检查：

```bash
# 检查 nameservers
dig NS fluence.it.com

# 应该显示 Cloudflare 的 nameservers
# 例如：alice.ns.cloudflare.com, bob.ns.cloudflare.com
```

**✅ 配置成功标志**：
- `dig NS fluence.it.com` 显示 Cloudflare 的 nameservers
- 在 Cloudflare 控制台中，域名状态显示为 **"Active"**

**⚠️ 如果 DNS 服务器未指向 Cloudflare**：
- 您将无法在 Cloudflare 中管理 DNS 记录
- 后续的 DNS 配置步骤将无法工作

---

**完成此步骤后，继续下面的 Vercel 部署和 DNS 记录配置。**

## 步骤 1: 在 Vercel 上部署项目

### 1.1 连接 GitHub 仓库到 Vercel

1. 登录 Vercel 控制台
2. 点击 **"Add New..."** → **"Project"**
3. 导入您的 GitHub 仓库
4. 配置项目设置：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（项目根目录）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（Next.js 默认）

### 1.2 配置环境变量

在 Vercel 项目设置中添加环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 1.3 首次部署

点击 **"Deploy"**，等待构建完成。

## 步骤 2: 在 Vercel 中添加自定义域名

### 2.1 为什么需要在 Vercel 中添加域名？

**重要理解**：虽然 DNS 服务器在 Cloudflare，但您需要在 Vercel 中"注册"这个域名，因为：

1. **Vercel 需要知道为哪个域名提供服务**
   - 当用户访问 `fluence.it.com` 时，Vercel 需要知道这是您的项目
   - 如果没有在 Vercel 中添加域名，Vercel 不会响应这个域名的请求

2. **Vercel 会提供 DNS 配置信息**
   - Vercel 会告诉您：DNS 记录应该指向哪个 IP 或域名
   - 这些信息是您在 Cloudflare 中配置 DNS 记录时需要的

3. **Vercel 会自动生成 SSL 证书**
   - 用于 Cloudflare ↔ Vercel 之间的加密连接
   - 这是"Full (strict)" SSL 模式所必需的

### 2.2 在 Vercel 中添加域名

1. 在 Vercel 项目页面，进入 **Settings** → **Domains**
2. 点击 **"Add"** 或 **"Add Domain"**
3. 输入 `fluence.it.com`
4. 点击 **"Add"**

### 2.3 获取 DNS 配置信息

Vercel 会显示需要配置的 DNS 记录信息（**这些信息需要在 Cloudflare 中配置**）：

- **类型**: `A` 或 `CNAME`
- **名称**: `fluence.it.com` 或 `@`
- **值**: Vercel 提供的 IP 地址或 CNAME 目标

**示例显示**（Vercel 会显示类似信息）：
```
类型: CNAME
名称: fluence.it.com
值: cname.vercel-dns.com
```

或者：

```
类型: A
名称: fluence.it.com
值: 76.76.21.21 (Vercel 提供的 IP)
```

**下一步**：复制这些信息，然后在 **Cloudflare** 中添加相应的 DNS 记录（见步骤 3）。

## 步骤 3: 在 Cloudflare 中配置 DNS

### 3.1 重要说明：DNS 配置位置

**DNS 记录只在 Cloudflare 中配置**，因为：
- Cloudflare 是您的 DNS 服务提供商（域名 `fluence.it.com` 由 Cloudflare 管理）
- Vercel 只提供需要配置的值（IP 地址或 CNAME 目标），不管理 DNS 记录
- 您不需要在 Vercel 中配置 DNS 服务器

**工作流程**：
1. Vercel 告诉您需要配置什么 DNS 记录（A 或 CNAME）
2. 您在 **Cloudflare** 中添加这些 DNS 记录
3. DNS 查询会指向 Vercel 的服务器

### 3.2 登录 Cloudflare

1. 访问 https://dash.cloudflare.com
2. 选择管理 `fluence.it.com` 的账户
3. 进入 **DNS** → **Records**

### 3.3 添加 DNS 记录

点击 **"Add record"**，根据 Vercel 提供的配置选择以下选项之一：

#### 选项 A: 使用 CNAME（推荐，如果 Vercel 提供）

```
类型: CNAME
名称: fluence.it.com (或 @ 表示根域名)
目标: cname.vercel-dns.com (Vercel 提供的值)
代理状态: DNS only (灰色云朵) ⚠️ 重要：必须关闭代理
TTL: Auto
```

**⚠️ 重要**：如果使用 CNAME，必须将代理状态设置为 **DNS only**（灰色云朵），因为 Cloudflare 的代理（橙色云朵）不支持 CNAME 记录指向根域名。

#### 选项 B: 使用 A 记录（如果 Vercel 提供 IP 地址）

```
类型: A
名称: fluence.it.com (或 @ 表示根域名)
IPv4 地址: [Vercel 提供的 IP 地址，例如 76.76.21.21]
代理状态: Proxied (橙色云朵) ✅ 可以开启代理
TTL: Auto
```

**✅ 优势**：使用 A 记录可以开启 Cloudflare 代理，获得 CDN 加速和安全保护。

### 3.4 等待 DNS 传播

DNS 更改通常需要几分钟到几小时才能生效。您可以使用以下命令检查：

```bash
# 检查 DNS 记录
dig fluence.it.com

# 或使用 nslookup
nslookup fluence.it.com
```

## 步骤 4: 配置 Cloudflare SSL/TLS（重要）

### 4.1 为什么使用 Cloudflare SSL

Cloudflare 提供免费的 SSL/TLS 证书，并且可以：
- ✅ 自动为您的域名提供 HTTPS 支持
- ✅ 保护用户和服务器之间的连接
- ✅ 提供 CDN 加速和安全防护
- ✅ 支持自动 HTTPS 重定向

### 4.2 Cloudflare SSL/TLS 设置步骤

1. **登录 Cloudflare 控制台**
   - 访问 https://dash.cloudflare.com
   - 选择 `fluence.it.com` 域名

2. **进入 SSL/TLS 设置**
   - 点击左侧菜单 **SSL/TLS**
   - 选择 **Overview** 标签

3. **选择加密模式**
   
   **推荐配置：Full (strict)**
   ```
   SSL/TLS encryption mode: Full (strict)
   ```
   
   **各模式说明**：
   - **Off**: 不加密（不推荐）
   - **Flexible**: 仅加密 Cloudflare ↔ 用户，不加密 Cloudflare ↔ Vercel（不推荐用于生产）
   - **Full**: 加密两端，但允许自签名证书
   - **Full (strict)**: 加密两端，要求有效证书（✅ 推荐，Vercel 自动提供有效证书）

4. **启用自动 HTTPS 重定向**
   - 进入 **SSL/TLS** → **Edge Certificates**
   - 开启 **"Always Use HTTPS"**（自动将 HTTP 重定向到 HTTPS）
   - 开启 **"Automatic HTTPS Rewrites"**（自动将页面中的 HTTP 链接重写为 HTTPS）

5. **设置最低 TLS 版本**
   - 在 **Edge Certificates** 页面
   - **Minimum TLS Version**: 选择 **1.2** 或更高（推荐 **1.3**）

### 4.3 Vercel SSL 证书（自动配置）

Vercel 会自动为您的域名生成 SSL 证书：
- ✅ 在 Vercel 的 **Domains** 页面，您应该看到：
  - SSL 证书状态：**Valid**
  - 域名状态：**Valid Configuration**

**注意**：Vercel 的 SSL 证书用于 Cloudflare ↔ Vercel 之间的连接。Cloudflare 的 SSL 证书用于用户 ↔ Cloudflare 之间的连接。

## 步骤 5: 验证配置

### 5.1 检查 DNS 配置

在 Vercel 的 **Domains** 页面，检查域名状态：

- ✅ **Valid Configuration**: DNS 配置正确
- ⚠️ **Pending**: 等待 DNS 传播
- ❌ **Invalid Configuration**: DNS 配置有误

### 5.2 测试访问

等待 DNS 传播完成后（通常 5-30 分钟），访问：

```
https://fluence.it.com
```

应该能看到您的网站正常加载。

### 5.3 验证 SSL 证书

在浏览器中：
1. 点击地址栏的锁图标
2. 查看证书信息
3. 应该显示 Cloudflare 的 SSL 证书

## 常见问题

### Q1: DNS 记录不生效

**解决方案**：
1. 确认 Cloudflare 代理状态设置正确（CNAME 必须关闭代理）
2. 检查是否有其他 DNS 记录冲突
3. 清除 DNS 缓存：`sudo dscacheutil -flushcache` (macOS) 或重启浏览器
4. 确认域名注册商的 nameservers 已正确指向 Cloudflare

### Q2: SSL 证书错误

**解决方案**：
1. 在 Cloudflare 中，确保 SSL/TLS 模式设置为 **Full** 或 **Full (strict)**
2. 在 Vercel 中，等待 SSL 证书自动生成（可能需要几分钟）
3. 检查域名是否正确指向 Vercel
4. 确认 Vercel 的域名状态显示为 **Valid Configuration**

### Q3: 网站无法访问

**检查清单**：
- [ ] 域名注册商的 nameservers 已指向 Cloudflare
- [ ] DNS 记录已正确配置在 Cloudflare 中
- [ ] DNS 传播已完成（使用 `dig` 或 `nslookup` 检查）
- [ ] Vercel 部署成功
- [ ] 环境变量已正确配置
- [ ] Cloudflare 代理设置正确

### Q4: 子域名配置

如果您想使用 `www.fluence.it.com`：

1. 在 Vercel 中添加 `www.fluence.it.com`
2. 在 Cloudflare 中添加 CNAME 记录：
   ```
   类型: CNAME
   名称: www
   目标: cname.vercel-dns.com
   代理状态: DNS only
   ```

## 推荐配置

### Cloudflare 设置（DNS + SSL）

**DNS 配置**（在 Cloudflare 中）：
- **DNS 记录类型**: A 记录（推荐）或 CNAME
- **代理状态**: Proxied（橙色云朵，如果使用 A 记录）
- **TTL**: Auto

**SSL/TLS 配置**（在 Cloudflare 中）：
- **SSL/TLS encryption mode**: **Full (strict)** ✅
- **Always Use HTTPS**: **On** ✅
- **Automatic HTTPS Rewrites**: **On** ✅
- **Minimum TLS Version**: **1.2** 或 **1.3** ✅
- **Opportunistic Encryption**: On（可选）
- **TLS 1.3**: On（推荐）

**重要**：所有 DNS 和 SSL 配置都在 **Cloudflare** 中完成，Vercel 只提供托管服务。

### Vercel 设置

- **Framework**: Next.js
- **Node.js Version**: 18.x 或更高
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## 性能优化

### Cloudflare 缓存

1. 进入 **Caching** → **Configuration**
2. 设置缓存级别：**Standard**
3. 对于静态资源，可以设置更长的缓存时间

### Vercel Edge Network

Vercel 自动使用全球 CDN，无需额外配置。

## 监控和维护

### Vercel Analytics

在 Vercel 项目中启用 Analytics 以监控：
- 页面访问量
- 性能指标
- 错误日志

### Cloudflare Analytics

在 Cloudflare 中查看：
- 流量统计
- 安全威胁
- 性能指标

## 下一步

配置完成后，您可以：

1. 设置环境变量（生产环境）
2. 配置自定义域名重定向
3. 设置预览部署
4. 配置 Webhooks 用于自动部署

## 参考链接

- [Vercel 域名文档](https://vercel.com/docs/concepts/projects/domains)
- [Cloudflare DNS 文档](https://developers.cloudflare.com/dns/)
- [Cloudflare SSL/TLS 文档](https://developers.cloudflare.com/ssl/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

