<script setup lang="ts">
import { useTaborStore } from 'vue3-tabor'
const tabor = useTaborStore()

async function handleNavigation() {
  await tabor.open({
    path: '/path',
    query: { name: 'tom' }
  });

  await tabor.open({
    path: '/full-path',
    query: { name: 'tom' }
  });

  // 现在可以安全关闭
  await tabor.close();
}
handleNavigation();


</script>

<template>
  <div class="home">
    this is home
    <br>

    <button @click="goToPath">go to path</button>

    <button @click="goToFullPath('tom')">go to full path with param is tom</button>
    <button @click="goToFullPath('jerry')">go to full path with param is jerry</button>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #42b883;
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
}
</style>
