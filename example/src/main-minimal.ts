import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// 最小化路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/Home.vue')
    }
  ]
});

// 先尝试不使用插件
const app = createApp(App);
app.use(router);

// 先注释掉这行，看是否能正常启动
// 成功后再逐步添加
// import TaborPlugin from 'vue3-tabor';
// app.use(TaborPlugin, { router });

app.mount('#app'); 
