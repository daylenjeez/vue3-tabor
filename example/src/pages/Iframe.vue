<template>
  <div class="iframe-page">
    <h2>Iframe测试</h2>
    <p>在这个页面，您可以测试Vue3-Tabor的iframe功能，它允许您在标签页中嵌入外部网站。</p>
    
    <div class="iframe-controls">
      <input v-model="iframeUrl" placeholder="输入URL（例如：https://www.example.com）" />
      <button @click="openIframeTab">在新标签页中打开</button>
    </div>
    
    <div class="iframe-examples">
      <h3>快速访问：</h3>
      <button @click="openPresetIframe({url: 'https://www.bing.com', path: 'Bing'})">打开Bing</button>
      <button @click="openPresetIframe({url: 'https://www.github.com', path: 'GitHub'})">打开GitHub</button>
      <button @click="openPresetIframe({url: 'https://www.vuejs.org', path: 'Vue.js'})">打开Vue.js</button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import IframeView from './IframeView.vue';

const iframeUrl = ref('');
const tabStore = inject('tabStore');
const router = useRouter();

const openIframeTab = () => {
  if (!iframeUrl.value) return;
  
  // 确保URL包含协议
  let url = iframeUrl.value;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // 为URL创建一个安全的ID
  const urlId = encodeURIComponent(url);
  
  // 创建动态路由路径
  const routePath = `/iframe/${urlId}`;
  
  // 生成唯一的tabKey
  const tabKey = `iframe-${urlId}`;
  
  // 动态添加路由
  const routeName = `iframe-${urlId}`;
  router.addRoute({
    path: routePath,
    name: routeName,
    component: IframeView,
    props: { url }
  });
  
  // 使用tabStore的open方法打开iframe
  tabStore.open(routePath, {
    tabKey: tabKey,
    tabConfig: {
      title: new URL(url).hostname,
      iframeAttributes: {
        src: url,
        allow: 'fullscreen',
      },
      keepAlive: true,
    }
  });
  
  // 清空输入框
  iframeUrl.value = '';
};

const openPresetIframe = ({url, path}) => {
  // 确保URL包含协议
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // 为URL创建一个安全的ID
  const urlId = encodeURIComponent(url);
  
  // 创建动态路由路径
  const routePath = `/iframe/${path}`;


  const tabConfig = {
    key: 'path',
    title: path,
    iframeAttributes: {
      src: url,
      allow: 'fullscreen',
    },
  }
  
  // 动态添加路由
  const routeName = `iframe-${path}`;
  router.addRoute({
    path: routePath,
    name: routeName,
    component: IframeView,
    meta:{
      tabConfig
    }
  });
  
  // 使用tabStore的open方法打开iframe
  tabStore.open(routePath, {
    tabConfig
  });
};
</script>

<style scoped>
.iframe-page {
  padding: 1rem;
}

h2, h3 {
  color: #333;
}

.iframe-controls {
  margin: 1.5rem 0;
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0069d9;
}

.iframe-examples {
  margin-top: 1.5rem;
}

.iframe-examples button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #6c757d;
}

.iframe-examples button:hover {
  background-color: #5a6268;
}
</style> 
