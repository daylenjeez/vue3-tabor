<template>
  <button class="language-switch" @click="toggleLanguage">
    {{ currentLanguage === 'zh' ? 'EN' : '中' }}
  </button>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Language, setLanguage } from '../../utils/i18n';

export default defineComponent({
  name: 'LanguageSwitch',
  setup() {
    const initialLanguage = inject<Language>('language') || 'zh';
    const currentLanguage = ref<Language>(initialLanguage);

    const toggleLanguage = () => {
      const newLanguage: Language = currentLanguage.value === 'zh' ? 'en' : 'zh';
      currentLanguage.value = newLanguage;
      setLanguage(newLanguage);
      
      // Force a refresh of the component tree
      window.location.reload();
    };

    return {
      currentLanguage,
      toggleLanguage
    };
  }
});
</script>

<style scoped>
.language-switch {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 999;
  background-color: var(--primary-color, #5a67d8);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.language-switch:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}
</style> 
