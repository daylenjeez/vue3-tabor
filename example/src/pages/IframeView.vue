<template>
  <div class="iframe-view">
    <iframe 
      :src="iframeUrl" 
      frameborder="0" 
      allow="fullscreen" 
      class="full-iframe">
    </iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 接受props
const props = defineProps({
  url: {
    type: String,
    default: ''
  }
});

// 计算出最终的URL
const iframeUrl = computed(() => {
  if (props.url) {
    return props.url;
  }
  return '';
});
</script>

<style scoped>
.iframe-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.full-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style> 
