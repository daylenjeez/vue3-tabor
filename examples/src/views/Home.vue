<script setup lang="ts">
import { useTabor } from 'vue3-tabor'
const tabor = useTabor()


const goToPath = () => {
  tabor.open({
    path: '/path',
  });
}

const goToFullPath = (name: string) => {
  tabor.open({
    path: '/full-path',
    query: { name }
  });
}
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
