<div align="center">
    <div align="center"><img src="/assets/vue-tabor-logo.svg" width=240 /></div>
    <h2 align="center">vue3-tabor</h2>
    <div align="center">🚀 基于 Vue 3 的强大标签页路由解决方案，支持标签页导航与 keepAlive 缓存功能</div>
    <div align="center">兼容多种组件库样式，提供丰富的自定义选项</div>
    <div align="center"><strong>中文</strong> | <a href="README.en.md">English</a></div>
    <br/>
    <div align="center">
        <a href="https://www.npmjs.com/package/vue3-tabor"><img src="https://img.shields.io/npm/v/vue3-tabor.svg" alt="Version"></a>
        <a href="https://www.npmjs.com/package/vue3-tabor"><img src="https://img.shields.io/npm/l/vue3-tabor.svg" alt="License"></a>
        <a href="https://github.com/daylenjeez/vue3-tabor"><img src="https://img.shields.io/github/stars/daylenjeez/vue3-tabor.svg" alt="GitHub Stars"></a>
        <img src="https://img.shields.io/bundlephobia/minzip/vue3-tabor" alt="Size">
        <img src="https://img.shields.io/badge/vue-v3.x-brightgreen.svg" alt="Vue Version">
        <img src="https://img.shields.io/badge/vue--router-v4.x-brightgreen.svg" alt="Vue Router Version">
        <img src="https://img.shields.io/badge/TypeScript-supported-blue.svg" alt="TypeScript">
    </div>
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
// 必须引入样式文件
import "vue3-tabor/dist/assets/index.css";
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

## 📖 API 文档

### 全局配置

在安装插件时，可以传入以下配置选项：

```js
app.use(RouterTab, {
  router: router,       // 必需：Vue Router 实例
  maxCache: 10,         // 可选：最大缓存数量，默认为10
});
```

### 组件属性 (Props)

`<vue-tabor>` 组件支持以下属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| maxAlive | Number | 10 | 最大缓存数量 |
| hideClose | Boolean | false | 是否隐藏关闭按钮 |
| beforeClose | Function | - | 关闭标签前的钩子函数，返回Promise<boolean> |
| tabClass | String | - | 标签的自定义CSS类名 |
| pageClass | String | - | 页面的自定义CSS类名 |
| dropdownClass | String | - | 下拉菜单的自定义CSS类名 |
| tabType | String | 'line' | 标签类型，可选值：'line'、'card' |
| style | Object | - | 自定义样式变量 |
| tabPrefix | Component | - | 标签前缀组件 |

### 样式变量

可以通过style属性自定义以下CSS变量：

```html
<vue-tabor :style="{
  '--tab-background-color': '#f5f5f5',
  '--tab-color': '#333',
  '--tab-border-color': '#ddd',
  '--tab-border-radius': '4px'
}" />
```

### 实例方法

可以通过注入的 `tabStore` 访问以下方法：

```js
// 在组件中使用
import { inject } from 'vue';

export default {
  setup() {
    const tabStore = inject('tabStore');
    
    // 使用tabStore方法
    return { tabStore };
  }
}
```

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| open | (to: RouteLocationRaw, options?: OpenProps) | Promise\<void\> | 打开新标签 |
| close | (item?: TabGetter, toOptions?: ToOptions) | Promise\<void\> | 关闭标签 |
| closeOthers | (tabId?: TabId) | void | 关闭其他标签 |
| refresh | (tabId?: TabId) | void | 刷新标签 |
| find | (tabId: TabId) | Tab \| undefined | 查找标签 |
| has | (tabId?: TabId) | boolean | 检查标签是否存在 |
| setActive | (tab: Tab) | void | 设置活动标签 |
| remove | (item: { id?: TabId; fullPath?: string }) | void | 移除标签 |

### Tab相关类型

```typescript
// 标签配置
interface TabConfig {
  key?: "path" | "fullPath" | ((route) => string);
  name?: string;
  keepAlive?: boolean;
  icon?: string;
  iframeAttributes?: IframeAttributes;
}

// 标签信息
interface Tab {
  id: string;
  name: string | symbol;
  icon?: string;
  keepAlive?: boolean;
  fullPath: string;
  allowClose?: boolean;
  iframeAttributes?: IframeAttributes;
  routeName?: string;
}

// 打开标签的选项
interface OpenProps {
  replace?: boolean;  // 是否替换当前标签
  refresh?: boolean;  // 是否刷新
  tabConfig?: TabConfig;  // 标签配置
}
```

### iframe 支持

vue3-tabor 支持在标签中打开外部页面：

```js
// 打开iframe标签
tabStore.open({
  path: '/iframe',
  query: { 
    src: 'https://example.com', 
    title: '外部页面' 
  }
}, {
  tabConfig: {
    iframeAttributes: {
      src: 'https://example.com',
      width: '100%',
      height: '100%'
    }
  }
});
```

## 🔧 技术栈

- **💻 Vue 3**：基于最新的Vue 3.x版本开发
- **🔄 Vue Router 4**：与Vue Router深度集成
- **💪 TypeScript**：类型安全的代码开发体验
- **👬 Vitest**：可靠的单元测试保障

## 📚 更多资源

- [问题反馈](https://github.com/daylenjeez/vue3-tabor/issues)
