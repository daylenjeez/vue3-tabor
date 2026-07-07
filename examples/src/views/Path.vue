<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  console.log('Path page mounted:', Date.now())
})

onBeforeUnmount(() => {
  console.log('Path page beforeUnmount:', Date.now())
})
</script>

<template>
  <div class="path">
    this is path
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
</style>
