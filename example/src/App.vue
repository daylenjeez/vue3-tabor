<template>
  <div class="app-container">
    <header class="header">
      <h1>Vue3-Tabor 演示</h1>
      <nav>
        <router-link to="/">首页</router-link> | 
        <router-link to="/iframe">Iframe测试</router-link> | 
        <router-link to="/about">关于</router-link>
      </nav>
    </header>
    
    <main class="main-content">
      <!-- Vue3-Tabor 组件将在这里渲染 -->
      <vue-tabor />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

nav {
  margin-bottom: 1rem;
}

nav a {
  color: #007bff;
  text-decoration: none;
  margin-right: 0.5rem;
}

nav a.router-link-active {
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 1rem;
}
</style> 
