import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import TaborPlugin from './plugins/vue3-tabor';

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/Home.vue'),
      meta: { tabConfig: { name: '首页' } }
    },
    {
      path: '/about',
      component: () => import('./pages/About.vue'),
      meta: { tabConfig: { name: '关于' } }
    }
  ]
});

const app = createApp(App);

// 使用本地插件
app.use(router);
app.use(TaborPlugin, { router });

app.mount('#app'); 
