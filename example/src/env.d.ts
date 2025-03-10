/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-tabor' {
  import type { Plugin } from 'vue'
  const TaborPlugin: Plugin
  export default TaborPlugin
  export * from 'vue3-tabor'
} 
