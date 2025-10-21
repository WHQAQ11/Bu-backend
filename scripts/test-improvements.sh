#!/bin/bash

# 占卜系统改进测试脚本
# 用于验证系统改进后的功能正常性

echo "🧪 开始测试占卜系统改进..."

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查代码错误"
    exit 1
fi

# 运行单元测试
echo "🔬 运行单元测试..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ 单元测试失败"
    exit 1
fi

# 启动测试服务器（后台运行）
echo "🚀 启动测试服务器..."
npm run dev &
SERVER_PID=$!

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 10

# 检查服务器是否启动成功
if ! curl -s http://localhost:3002/health > /dev/null; then
    echo "❌ 服务器启动失败"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ 服务器启动成功"

# 运行API测试
echo "🌐 运行API测试..."
npm run test:api

API_TEST_RESULT=$?

# 运行卦象多样性测试
echo "🎲 运行卦象多样性测试..."
npm run test:hexagram-diversity

DIVERSITY_TEST_RESULT=$?

# 清理：停止服务器
echo "🧹 清理测试环境..."
kill $SERVER_PID 2>/dev/null

# 等待服务器完全停止
sleep 2

# 检查测试结果
if [ $API_TEST_RESULT -eq 0 ] && [ $DIVERSITY_TEST_RESULT -eq 0 ]; then
    echo ""
    echo "🎉 所有测试通过！"
    echo "✅ 系统改进验证成功"
    echo ""
    echo "📊 测试结果摘要："
    echo "  - 单元测试：通过"
    echo "  - API接口测试：通过"
    echo "  - 卦象多样性测试：通过"
    echo ""
    echo "🚀 系统已准备好部署到生产环境"
    exit 0
else
    echo ""
    echo "❌ 部分测试失败"
    echo "📊 测试结果摘要："
    if [ $API_TEST_RESULT -ne 0 ]; then
        echo "  - API接口测试：失败"
    fi
    if [ $DIVERSITY_TEST_RESULT -ne 0 ]; then
        echo "  - 卦象多样性测试：失败"
    fi
    echo ""
    echo "🔧 请检查错误并修复后重新测试"
    exit 1
fi