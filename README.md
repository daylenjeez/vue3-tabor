<div align="center">
    <div align="center"><img src="/assets/vue-tabor-logo.svg" width=240 /></div>
    <h2 align="center">vue3-tabor</h2>
    <div align="center">🚀 基于 Vue 3 的强大标签页路由解决方案，支持标签页导航与 keepAlive 缓存功能</div>
    <div align="center">兼容多种组件库样式，提供丰富的自定义选项</div>
    <div align="center"><strong>中文</strong> | <a href="README.en.md">English</a></div>
</div>

## ✨ 特点

- **🔥 简单易上手**：零学习成本，引入即用，继承 [vue-router-tab](https://bhuh12.github.io/vue-router-tab/zh/) 优秀设计理念
- **🎨 高度定制化**：提供丰富API和配置，满足从基础到复杂的各类需求
- **📦 轻量高效**：基于Vue 3和Vue Router 4优化设计，性能出色，体积小巧
- **💪 类型支持**：使用TypeScript开发，提供完整类型定义，开发体验卓越

## 🛠️ 功能特性

- ### 基础功能
  - ✅ **路由响应**：自动响应路由变化，打开、切换页签
  - ✅ **标签管理**：
    - ✅ 打开/替换页签
    - ✅ 关闭页签
    - ✅ 关闭其他页签
    - ✅ 刷新页签
    - ✅ 右键菜单操作
  - ✅ **缓存控制**：支持页签内容缓存，提升用户体验
  - ⏳ **全局配置**：支持全局及个性化配置（开发中）
  - ⏳ **生命周期钩子**：提供丰富的生命周期事件（开发中）
  
- ### 高级特性
  - ✅ **iframe支持**：内置iframe路由支持，轻松集成外部页面
  - ⏳ **动画效果**：页签切换动画（开发中）
  - ⏳ **国际化**：多语言支持（开发中）
  - ⏳ **埋点统计**：页签访问数据统计（开发中）

## 📦 安装

```bash
npm install vue3-tabor
```

## 🚀 快速开始

### 1. 在入口文件中引入并注册插件

```js
import { createApp } from "vue";
import RouterTab from "vue3-tabor";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(RouterTab, { 
  router,  // 传入router实例
  maxCache: 10  // 可选：最大缓存数量
});

app.mount("#app");
```

### 2. 在布局组件中使用标签页组件

```html
<!-- App.vue 或 Layout.vue -->
<template>
  <div class="app-container">
    <header><!-- 你的应用头部 --></header>
    <main>
      <vue-tabor />
    </main>
  </div>
</template>
```

## 🔧 技术栈

- **💻 Vue 3**：基于最新的Vue 3.x版本开发
- **🔄 Vue Router 4**：与Vue Router深度集成
- **💪 TypeScript**：类型安全的代码开发体验
- **👬 Vitest**：可靠的单元测试保障

## 📚 更多资源

- [问题反馈](https://github.com/daylenjeez/vue3-tabor/issues)
