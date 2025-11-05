#!/bin/bash

# Vercel CLI 快速设置脚本

echo "🚀 Vercel CLI 设置向导"
echo "===================="
echo ""

# 检查是否已安装 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI 未安装"
    echo ""
    echo "请选择安装方式:"
    echo "1) 全局安装 (推荐)"
    echo "2) 使用 npx (不安装)"
    read -p "选择 [1/2]: " choice

    if [ "$choice" == "1" ]; then
        echo "正在全局安装 Vercel CLI..."
        npm install -g vercel
    else
        echo "将使用 npx vercel (无需安装)"
        alias vercel='npx vercel'
    fi
else
    echo "✅ Vercel CLI 已安装"
fi

echo ""
echo "📝 步骤 1: 登录 Vercel"
echo "运行以下命令登录:"
echo "  vercel login"
echo ""

echo "📝 步骤 2: 连接项目"
echo "运行以下命令连接到 Vercel 项目:"
echo "  vercel link"
echo ""

echo "📝 步骤 3: 测试构建"
echo "每次修改代码后,推送前运行:"
echo "  vercel build"
echo "  或"
echo "  bun run build:test"
echo ""

echo "✨ 快速命令参考:"
echo "  bun run build:test    - 本地快速构建测试"
echo "  vercel build          - 使用 Vercel 构建器测试"
echo "  vercel dev            - 本地运行生产环境"
echo "  vercel                - 部署到预览环境"
echo "  vercel --prod         - 部署到生产环境"
echo ""

echo "📚 详细文档请查看: VERCEL_DEPLOY_GUIDE.md"
