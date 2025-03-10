<template>
  <div class="iframe-page">
    <h2>Iframe测试</h2>
    <p>在这个页面，您可以测试Vue3-Tabor的iframe功能，它允许您在标签页中嵌入外部网站。</p>
    
    <div class="iframe-controls">
      <input v-model="iframeUrl" placeholder="输入URL（例如：https://www.example.com）" />
      <button @click="openIframeTab">打开iframe标签页</button>
    </div>
    
    <div class="iframe-examples">
      <h3>常用示例：</h3>
      <button @click="openPresetIframe('https://www.bing.com')">Bing</button>
      <button @click="openPresetIframe('https://www.github.com')">GitHub</button>
      <button @click="openPresetIframe('https://www.vuejs.org')">Vue.js</button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';

const iframeUrl = ref('');
const tabStore = inject('tabStore');

const openIframeTab = () => {
  if (!iframeUrl.value) return;
  
  // 确保URL包含协议
  let url = iframeUrl.value;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // 使用tabStore的open方法打开iframe
  tabStore.open(url, {
    tabConfig: {
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

const openPresetIframe = (url) => {
  iframeUrl.value = url;
  openIframeTab();
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
