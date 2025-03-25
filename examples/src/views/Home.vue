<script setup lang="ts">
import { onActivated, onMounted } from 'vue';
import { useTabor } from 'vue3-tabor'
import { useRouter, type RouteLocationNormalized } from 'vue-router'
const tabor = useTabor()
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
  router.getRoutes().forEach(route => {
    const normalizedRoute = router.resolve(route)
    if (normalizedRoute.name === "full_path") {
      normalizedRoute.query.name = "tom";
      normalizedRoute.fullPath = "/full-path?name=tom";
    }

    const tab = tabor.createTab(normalizedRoute as RouteLocationNormalized)
    if (!tabor.has(tab?.id)) {
      tabor.addTab(tab)
    }
  })
}

onActivated(() => {
  console.log('onMounted')
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
