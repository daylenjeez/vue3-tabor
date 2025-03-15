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

- **🔥 简单易上手**：零学习成本，引入即用
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
import Tabor from "vue3-tabor";
// 必须引入样式文件
import "vue3-tabor/dist/assets/index.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(Tabor, { 
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
| language | String | 'zh' | 界面语言，可选值：'zh'、'en' |

### 国际化支持

vue3-tabor 支持中文和英文两种语言，可以通过以下方式进行配置：

```html
<!-- 设置为英文 -->
<vue-tabor language="en" />

<!-- 设置为中文 -->
<vue-tabor language="zh" />
```

你还可以通过 API 动态切换语言：

```js
import { setLanguage } from 'vue3-tabor/utils/i18n';

// 切换为英文
setLanguage('en');

// 切换为中文
setLanguage('zh');
```

### 样式变量

vue3-tabor 提供了以下 CSS 变量，可以通过 style 属性或全局 CSS 自定义主题样式：

#### 基础配置

```html
<vue-tabor :style="{
  /* 基础颜色与尺寸 */
  --primary-color: #5a67d8,                 /* 主题色，用于激活状态和高亮效果 */
  --font-size-base: 14px,                   /* 基础字体大小 */
}" />
```

#### 标签外观

```html
<vue-tabor :style="{
  /* 标签尺寸与间距 */
  --tab-height: 40px,                       /* 标签高度 */
  --tab-min-width: 83px,                    /* 标签最小宽度 */
  --tab-padding: 0 12px,                    /* 标签内边距 */
  --tabs-gap: 6px,                          /* 标签之间的间距 */
  --tab-label-min-width: 30px,              /* 标签文本最小宽度 */
  --tab-label-max-width: 100px,             /* 标签文本最大宽度，超出将显示省略号 */
  
  /* 标签颜色与边框 */
  --tab-background-color: rgba(248, 249, 250, 0.5), /* 标签背景色 */
  --tab-active-background-color: #fff,      /* 激活标签的背景色 */
  --tab-active-color: var(--primary-color), /* 激活标签的文本颜色 */
  --tab-text-color: #64748b,                /* 普通标签的文本颜色 */
  --tab-border-color: #e2e8f0,              /* 标签边框颜色 */
  --tab-border-radius: 4px,                 /* 标签边框圆角 */
  
  /* 标签阴影 */
  --tab-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03),  /* 标签阴影 */
  --tab-active-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), /* 激活标签阴影 */
}" />
```

#### 内容区域

```html
<vue-tabor :style="{
  /* 内容区域样式 */
  --page-padding: 10px,                     /* 页面内容区域内边距 */
}" />
```

#### 预设主题示例

**默认主题 (浅色)**
```html
<vue-tabor :style="{
  --primary-color: #5a67d8,
  --tab-background-color: rgba(248, 249, 250, 0.5),
  --tab-active-background-color: #fff,
  --tab-text-color: #64748b,
  --tab-border-color: #e2e8f0
}" />
```

**暗色主题**
```html
<vue-tabor :style="{
  --primary-color: #818cf8,
  --tab-background-color: rgba(30, 41, 59, 0.5),
  --tab-active-background-color: #1e293b,
  --tab-active-color: #818cf8,
  --tab-text-color: #cbd5e1,
  --tab-border-color: #334155
}" />
```

**亮蓝主题**
```html
<vue-tabor :style="{
  --primary-color: #0ea5e9,
  --tab-border-radius: 8px 8px 0 0,
  --tab-background-color: rgba(224, 242, 254, 0.5),
  --tab-active-background-color: #fff
}" />
```

#### 通过全局 CSS 自定义样式

除了使用组件的 style 属性外，您还可以通过全局 CSS 变量设置来自定义样式：

```css
/* 在您的全局样式文件中 */
:root {
  --primary-color: #5a67d8;
  --tab-height: 40px;
  --tab-background-color: rgba(248, 249, 250, 0.5);
  /* 其他变量... */
}
```

#### 高级样式定制

对于需要更深层次自定义的场景，您可以使用以下方法：

1. **使用提供的类名添加自定义样式**：
   ```css
   /* 自定义标签样式 */
   .rt-tabs .tab {
     /* 自定义样式 */
   }
   
   /* 自定义激活标签样式 */
   .rt-tabs .tab.active {
     /* 自定义样式 */
   }
   ```

2. **通过插槽自定义标签内容**：
   ```html
   <vue-tabor>
     <template #tab="{ tab }">
       <div class="custom-tab">
         <img v-if="tab.icon" :src="tab.icon" class="tab-icon" />
         <span>{{ tab.name }}</span>
       </div>
     </template>
   </vue-tabor>
   ```

3. **使用 tabPrefix 属性添加前缀内容**：
   ```html
   <vue-tabor :tabPrefix="YourPrefixComponent" />
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
