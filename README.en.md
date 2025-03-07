<div align="center">
    <div align="center"><img src="/assets/vue-tabor-logo.svg" width=240 /></div>
    <h2 align="center">vue3-tabor</h2>
    <div align="center">🚀 A powerful Vue 3 tab routing solution that supports tab navigation with keepAlive capability</div>
    <div align="center">Compatible with multiple component libraries and providing rich customization options</div>
    <div align="center"><strong>English</strong> | <a href="README.md">中文</a></div>
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

## ✨ Features

- **🔥 Easy to Use**: Zero learning curve, just import and use, inheriting the excellent design principles of [vue-router-tab](https://bhuh12.github.io/vue-router-tab)
- **🎨 Highly Customizable**: Rich APIs and configurations to meet requirements from basic to complex
- **📦 Lightweight & Efficient**: Optimized for Vue 3 and Vue Router 4, delivering excellent performance with a small footprint
- **💪 TypeScript Support**: Developed with TypeScript, providing complete type definitions for superior development experience

## 🛠️ Core Functionality

- ### Basic Features
  - ✅ **Route Response**: Automatically responds to route changes, opening and switching tabs
  - ✅ **Tab Management**:
    - ✅ Open/Replace tabs
    - ✅ Close tabs
    - ✅ Close other tabs
    - ✅ Refresh tabs
    - ✅ Right-click menu operations
  - ✅ **Cache Control**: Supports tab content caching for improved user experience
  - ⏳ **Global Configuration**: Supports global and custom configurations (in development)
  - ⏳ **Lifecycle Hooks**: Provides rich lifecycle events (in development)
  
- ### Advanced Features
  - ✅ **iframe Support**: Built-in iframe routing support for easy integration of external pages
  - ⏳ **Animation Effects**: Tab switching animations (in development)
  - ⏳ **Internationalization**: Multi-language support (in development)
  - ⏳ **Analytics**: Tab access statistics (in development)

## 📦 Installation

```bash
npm install vue3-tabor
```

## 🚀 Quick Start

### 1. Import and register the plugin in your entry file

```js
import { createApp } from "vue";
import RouterTab from "vue3-tabor";
// Import CSS file (required)
import "vue3-tabor/dist/assets/index.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(RouterTab, { 
  router,  // Pass the router instance
  maxCache: 10  // Optional: maximum cache size
});

app.mount("#app");
```

### 2. Use the tab component in your layout

```html
<!-- App.vue or Layout.vue -->
<template>
  <div class="app-container">
    <header><!-- Your app header --></header>
    <main>
      <vue-tabor />
    </main>
  </div>
</template>
```

## 🔧 Tech Stack

- **💻 Vue 3**: Developed with the latest Vue 3.x version
- **🔄 Vue Router 4**: Deep integration with Vue Router
- **💪 TypeScript**: Type-safe code development experience
- **👬 Vitest**: Reliable unit testing support

## 📚 Additional Resources

- [Issue Reporting](https://github.com/daylenjeez/vue3-tabor/issues)
