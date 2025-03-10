#!/bin/bash

# 清理旧的node_modules
echo "清理旧的依赖..."
rm -rf node_modules
rm -f package-lock.json

# 重新安装依赖
echo "安装依赖..."
npm install

# 启动开发服务器，将输出重定向到文件
echo "启动开发服务器并记录日志..."
npm run dev 2>&1 | tee debug-log.txt 
