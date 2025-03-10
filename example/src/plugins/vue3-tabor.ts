// 这个文件作为local fallback，如果从源码引入失败，可以使用这个文件

import { App, Plugin } from 'vue';
import { Router } from 'vue-router';

// 简化版的插件定义
const TaborPlugin: Plugin = {
  install(app: App, options: { router: Router }) {
    if (!options || !options.router) {
      console.error('Vue3-Tabor: Router is required');
      return;
    }

    app.component('vue-tabor', {
      template: `
        <div class="vue-tabor-container">
          <div class="vue-tabor-tabs">
            <div class="tab">示例标签</div>
          </div>
          <div class="vue-tabor-content">
            <router-view></router-view>
          </div>
        </div>
      `,
      setup() {
        // 基本实现
        return {};
      }
    });
  }
};

export default TaborPlugin; 
