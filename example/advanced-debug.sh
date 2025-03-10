#!/bin/bash

# 创建日志目录
mkdir -p logs

# 显示Node和NPM版本
echo "=== 环境信息 ===" > logs/debug-env.log
echo "Node版本：" >> logs/debug-env.log
node -v >> logs/debug-env.log
echo "NPM版本：" >> logs/debug-env.log
npm -v >> logs/debug-env.log
echo "操作系统：" >> logs/debug-env.log
uname -a >> logs/debug-env.log

# 清理旧的node_modules
echo "清理旧的依赖..."
rm -rf node_modules
rm -f package-lock.json

# 重新安装依赖
echo "安装依赖..."
npm install --verbose 2>&1 | tee logs/install.log

# 列出依赖树
echo "生成依赖树..."
npm ls --depth=1 > logs/dependencies.log 2>&1

# 检查丢失的依赖
echo "检查丢失的依赖..."
npm ls --missing > logs/missing-deps.log 2>&1

# 使用--debug模式启动Vite
echo "使用调试模式启动Vite..."
NODE_OPTIONS="--trace-warnings" npm run dev -- --debug 2>&1 | tee logs/vite-debug.log

echo "调试日志已保存到logs目录" 
