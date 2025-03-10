// 测试路径解析的脚本
const { resolve } = require('path');
const fs = require('fs');

const basePath = resolve(__dirname, '../src');

// 检查常见的导入路径
const pathsToCheck = [
  '@tabor/helper/utils',
  '@tabor/helper/utils/constants',
  '@tabor/types',
  '@tabor/utils'
];

console.log('== 路径解析测试 ==');
console.log('基础路径:', basePath);
console.log('');

pathsToCheck.forEach(path => {
  const normalizedPath = path.replace('@tabor/', '');
  const fullPath = resolve(basePath, normalizedPath);

  // 检查路径是目录还是文件
  let exists = false;
  let fileOrDir = '';

  // 尝试作为文件查找
  if (fs.existsSync(fullPath)) {
    exists = true;
    fileOrDir = '目录';
  }
  // 尝试作为 .ts 文件查找
  else if (fs.existsSync(`${fullPath}.ts`)) {
    exists = true;
    fileOrDir = 'TS文件';
  }
  // 尝试作为 index.ts 文件查找
  else if (fs.existsSync(`${fullPath}/index.ts`)) {
    exists = true;
    fileOrDir = '带有 index.ts 的目录';
  }

  console.log(`检查: ${path}`);
  console.log(`映射到: ${fullPath}`);
  console.log(`结果: ${exists ? '✅ 存在' : '❌ 不存在'} ${exists ? `(${fileOrDir})` : ''}`);

  if (!exists) {
    // 尝试查找近似路径
    const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    if (fs.existsSync(parentDir)) {
      console.log('父目录内容:');
      fs.readdirSync(parentDir).forEach(file => {
        console.log(`  - ${file}`);
      });
    }
  }

  console.log('---');
}); 
