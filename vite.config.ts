import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      outDir: 'dist'
    }),
  ],
  resolve: {
    alias: [
      { find: '@routerTab', replacement: resolve(__dirname, './src') }
    ]
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3RouterTab',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        },
        assetFileNames: (assetInfo) => {
          const originalFileName = assetInfo.originalFileNames?.[0] || '';
          if (originalFileName.endsWith('.css')) {
            return 'css/style.css';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    minify: 'terser',
    sourcemap: true,
    outDir: 'dist'
  }
}); 
