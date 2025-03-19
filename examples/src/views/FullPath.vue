<script setup lang="ts">
</script>

<template>
  <div class="full-path">
    this is full path:{{ $route.query.name }}
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
