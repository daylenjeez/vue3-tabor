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

- **🔥 Easy to Use**: Zero learning curve, just import and use
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
import Tabor from "vue3-tabor";
// Import CSS file (required)
import "vue3-tabor/dist/assets/index.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(Tabor, { 
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

## 📖 API Documentation

### Global Configuration

When installing the plugin, you can pass the following configuration options:

```js
app.use(RouterTab, {
  router: router,       // Required: Vue Router instance
  maxCache: 10,         // Optional: Maximum cache size, default is 10
});
```

### Component Props

The `<vue-tabor>` component supports the following properties:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| maxAlive | Number | 10 | Maximum number of cached tabs |
| hideClose | Boolean | false | Whether to hide the close button |
| beforeClose | Function | - | Hook function called before closing a tab, returns Promise\<boolean> |
| tabClass | String | - | Custom CSS class for tabs |
| pageClass | String | - | Custom CSS class for pages |
| dropdownClass | String | - | Custom CSS class for dropdown menu |
| tabType | String | 'line' | Tab type, options: 'line', 'card' |
| style | Object | - | Custom style variables |
| tabPrefix | Component | - | Tab prefix component |
| language | String | 'zh' | UI language, options: 'zh', 'en' |

### Style Variables

vue3-tabor provides CSS variables that can be customized through the style prop or global CSS. Below are the available style variables:

#### Basic Configuration

```html
<vue-tabor :style="{
  /* Basic colors and sizes */
  '--primary-color': '#5a67d8',             /* Primary theme color for active states and highlights */
  '--font-size-base': '14px',               /* Base font size */
}" />
```

#### Tab Appearance

```html
<vue-tabor :style="{
  /* Tab size and spacing */
  '--tab-height': '40px',                   /* Tab height */
  '--tab-min-width': '83px',                /* Tab minimum width */
  '--tab-padding': '0 12px',                /* Tab padding */
  '--tabs-gap': '6px',                      /* Gap between tabs */
  '--tab-label-min-width': '30px',          /* Minimum width for tab label text */
  '--tab-label-max-width': '100px',         /* Maximum width for tab label text, text will truncate beyond this */
  
  /* Tab colors and borders */
  '--tab-background-color': 'rgba(248, 249, 250, 0.5)', /* Tab background color */
  '--tab-active-background-color': '#fff',  /* Active tab background color */
  '--tab-active-color': 'var(--primary-color)', /* Active tab text color */
  '--tab-text-color': '#64748b',            /* Normal tab text color */
  '--tab-border-color': '#e2e8f0',          /* Tab border color */
  '--tab-border-radius': '4px',             /* Tab border radius */
  
  /* Tab shadows */
  '--tab-box-shadow': '0 1px 2px rgba(0, 0, 0, 0.03)',  /* Tab shadow */
  '--tab-active-box-shadow': '0 1px 3px rgba(0, 0, 0, 0.05)', /* Active tab shadow */
}" />
```

#### Content Area

```html
<vue-tabor :style="{
  /* Content area styles */
  '--page-padding': '10px',                 /* Page content area padding */
}" />
```

#### Preset Theme Examples

**Default Theme (Light)**
```html
<vue-tabor :style="{
  '--primary-color': '#5a67d8',
  '--tab-background-color': 'rgba(248, 249, 250, 0.5)',
  '--tab-active-background-color': '#fff',
  '--tab-text-color': '#64748b',
  '--tab-border-color': '#e2e8f0'
}" />
```

**Dark Theme**
```html
<vue-tabor :style="{
  '--primary-color': '#818cf8',
  '--tab-background-color': 'rgba(30, 41, 59, 0.5)',
  '--tab-active-background-color': '#1e293b',
  '--tab-active-color': '#818cf8',
  '--tab-text-color': '#cbd5e1',
  '--tab-border-color': '#334155'
}" />
```

**Bright Blue Theme**
```html
<vue-tabor :style="{
  '--primary-color': '#0ea5e9',
  '--tab-border-radius': '8px 8px 0 0',
  '--tab-background-color': 'rgba(224, 242, 254, 0.5)',
  '--tab-active-background-color': '#fff'
}" />
```

#### Customizing Styles with Global CSS

In addition to using the component's style prop, you can customize styles through global CSS variables:

```css
/* In your global CSS file */
:root {
  --primary-color: #5a67d8;
  --tab-height: 40px;
  --tab-background-color: rgba(248, 249, 250, 0.5);
  /* Other variables... */
}
```

#### Advanced Style Customization

For deeper customization needs, you can use the following methods:

1. **Add custom styles using provided class names**:
   ```css
   /* Custom tab styles */
   .rt-tabs .tab {
     /* Custom styles */
   }
   
   /* Custom active tab styles */
   .rt-tabs .tab.active {
     /* Custom styles */
   }
   ```

2. **Customize tab content using slots**:
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

3. **Add prefix content using the tabPrefix prop**:
   ```html
   <vue-tabor :tabPrefix="YourPrefixComponent" />
   ```

### Instance Methods

You can access the following methods through the injected `tabStore`:

```js
// In your component
import { inject } from 'vue';

export default {
  setup() {
    const tabStore = inject('tabStore');
    
    // Use tabStore methods
    return { tabStore };
  }
}
```

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| open | (to: RouteLocationRaw, options?: OpenProps) | Promise\<void\> | Open a new tab |
| close | (item?: TabGetter, toOptions?: ToOptions) | Promise\<void\> | Close a tab |
| closeOthers | (tabId?: TabId) | void | Close other tabs |
| refresh | (tabId?: TabId) | void | Refresh a tab |
| find | (tabId: TabId) | Tab \| undefined | Find a tab by ID |
| has | (tabId?: TabId) | boolean | Check if a tab exists |
| setActive | (tab: Tab) | void | Set the active tab |
| remove | (item: { id?: TabId; fullPath?: string }) | void | Remove a tab |

### Tab-Related Types

```typescript
// Tab configuration
interface TabConfig {
  key?: "path" | "fullPath" | ((route) => string);
  name?: string;
  keepAlive?: boolean;
  icon?: string;
  iframeAttributes?: IframeAttributes;
}

// Tab information
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

// Options for opening a tab
interface OpenProps {
  replace?: boolean;  // Whether to replace the current tab
  refresh?: boolean;  // Whether to refresh
  tabConfig?: TabConfig;  // Tab configuration
}
```

### iframe Support

vue3-tabor supports opening external pages in tabs:

```js
// Open an iframe tab
tabStore.open({
  path: '/iframe',
  query: { 
    src: 'https://example.com', 
    title: 'External Page' 
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

### Internationalization

vue3-tabor supports both Chinese and English languages, which can be configured as follows:

```html
<!-- Set to English -->
<vue-tabor language="en" />

<!-- Set to Chinese -->
<vue-tabor language="zh" />

<!-- Hide language switch button -->
<vue-tabor :showLanguageSwitch="false" />
```

You can also dynamically change the language using the API:

```js
import { setLanguage } from 'vue3-tabor/utils/i18n';

// Switch to English
setLanguage('en');

// Switch to Chinese
setLanguage('zh');
```

## 🔧 Tech Stack

- **💻 Vue 3**: Developed with the latest Vue 3.x version
- **🔄 Vue Router 4**: Deep integration with Vue Router
- **💪 TypeScript**: Type-safe code development experience
- **👬 Vitest**: Reliable unit testing support

## 📚 Additional Resources

- [Issue Reporting](https://github.com/daylenjeez/vue3-tabor/issues)

