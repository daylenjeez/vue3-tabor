import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./src/tests/setup.ts'],
    deps: {
      inline: ['vue', 'vue-router']
    },
    coverage: {
      provider: 'istanbul' // or 'v8'
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tabor': resolve(__dirname, './src'),
    },
  },
}); 
