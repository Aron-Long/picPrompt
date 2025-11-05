# Vercel 部署指南

## 问题根源
部署到 Vercel 时反复失败的主要原因是:**本地环境和 Vercel 云端构建环境不一致**。

## 解决方案:使用 Vercel CLI

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
# 或者使用 npx (不需要全局安装)
npx vercel --version
```

### 2. 登录 Vercel

```bash
vercel login
```

按提示完成登录(邮箱或 GitHub)

### 3. 连接项目

在项目根目录运行:

```bash
vercel link
```

选择你的 Vercel 项目,这会下载项目配置和环境变量到本地 `.vercel` 目录

### 4. 本地构建测试(⭐ 最重要)

**每次修改代码后,推送前先运行:**

```bash
# 方式1: 使用 Vercel CLI 模拟云端构建
vercel build

# 方式2: 使用我们添加的测试脚本
npx bun run build:test
```

如果 `vercel build` 在本地成功,Vercel 云端 99% 会成功!

### 5. 本地预览生产环境

```bash
vercel dev
```

这会启动一个模拟 Vercel 生产环境的本地服务器

### 6. 推荐的完整工作流程

```bash
# 1. 修改代码
# ... 编辑文件 ...

# 2. 本地开发测试
npx bun run dev:web

# 3. 本地构建测试 (模拟 Vercel)
vercel build
# 或
npx bun run build:test

# 4. 如果构建成功,提交推送
git add .
git commit -m "your message"
git push

# 5. Vercel 会自动部署
```

## 常用命令

```bash
# 拉取最新的 Vercel 项目配置
vercel pull

# 查看本地环境变量
vercel env pull

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署日志
vercel logs
```

## 环境变量管理

Vercel CLI 会将云端的环境变量下载到 `.vercel/.env.production.local`

你可以编辑这个文件或通过 Vercel Dashboard 管理

## 优势

✅ **本地验证**: 在推送前就知道是否会失败
✅ **快速迭代**: 不需要等待云端构建
✅ **环境一致**: 使用和 Vercel 相同的构建器
✅ **节省时间**: 避免反复 push 和等待
