<template>
  <div class="home-page">
    <h2>首页</h2>
    <p>这是首页内容，演示Vue3-Tabor的基本用法。</p>
    <div class="features">
      <h3>功能特点：</h3>
      <ul>
        <li>多标签页管理</li>
        <li>支持路由导航</li>
        <li>支持iframe集成</li>
        <li>标签页持久化</li>
      </ul>
    </div>
    <button @click="openIframe">打开Iframe测试页</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const openIframe = () => {
  router.push('/iframe');
};
</script>

<style scoped>
.home-page {
  padding: 1rem;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

.features {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
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
</style> 
