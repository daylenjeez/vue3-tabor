import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import TaborPlugin from 'vue3-tabor'; // 使用我们在vite.config.js中配置的别名
import App from './App.vue';

// 创建路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/Home.vue'),
      meta: { tabConfig: { name: '首页' } }
    },
    {
      path: '/iframe',
      component: () => import('./pages/Iframe.vue'),
      meta: { tabConfig: { name: 'Iframe测试' } }
    },
    {
      path: '/about',
      component: () => import('./pages/About.vue'),
      meta: { tabConfig: { name: '关于' } }
    }
  ]
});

const app = createApp(App);

// 注册插件
app.use(router);
app.use(TaborPlugin, { router });

app.mount('#app'); 
