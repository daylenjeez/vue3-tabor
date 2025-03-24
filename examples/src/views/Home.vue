<script setup lang="ts">
import { onMounted } from 'vue';
import { useTabor, type Tab } from 'vue3-tabor'
import { useRoute, useRouter, type RouteLocationNormalized, type RouteLocationNormalizedLoaded } from 'vue-router'
const tabor = useTabor()
const route = useRoute()
const router = useRouter()
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

const goToIframe = () => {
  tabor.open({
    path: '/iframe',
  });
}

const init = () => {
  const initialTabs = [
    {
      fullPath: '/path',
      name: 'path',
    },
    {
      id: '/full-path?name=tom',
      fullPath: '/full-path?name=tom',
    },
    {
      fullPath: '/iframe',
      name: 'iframe',
    },
    {
      fullPath: '/full-path?name=jerry',
    }
  ] as RouteLocationNormalized[]

  initialTabs.forEach(tab => {
    tabor.addTab(tabor.createTab(tab))
  })
}

onMounted(() => {
  init()
})


</script>

<template>
  <div class="home">
    this is home
    <br>

    <button @click="goToPath">go to path</button>

    <button @click="goToFullPath('tom')">go to full path with param is tom</button>
    <button @click="goToFullPath('jerry')">go to full path with param is jerry</button>
    <button @click="goToIframe">go to iframe</button>
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
