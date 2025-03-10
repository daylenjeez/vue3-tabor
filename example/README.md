# Vue3-Tabor 示例应用

这是 Vue3-Tabor 插件的示例应用，用于展示和测试插件功能。

## 安装依赖

```bash
npm install
# 或
yarn
```

## 开发模式启动

```bash
npm run dev
# 或
yarn dev
```

这将启动开发服务器，通常在 http://localhost:3000 可以访问。

## 功能演示

- **基本标签页**: 通过路由导航自动创建标签页
- **Iframe标签页**: 在"Iframe测试"页面，您可以输入URL创建嵌入外部网站的标签页
- **标签页持久化**: 动态添加的iframe标签页将在刷新后保留

## 目录结构

- `src/` - 示例应用源代码
  - `main.js` - 应用入口，配置路由和插件
  - `App.vue` - 主组件
  - `pages/` - 示例页面组件
- `public/` - 静态资源
- `index.html` - HTML模板
- `vite.config.js` - Vite配置文件

## 从根项目启动

如果您在 vue3-tabor 项目的根目录，可以使用以下命令启动示例：

```bash
# 需要先安装example中的依赖
cd example && npm install
# 然后回到根目录
cd ..
# 从根目录启动示例
npm run example
``` 
