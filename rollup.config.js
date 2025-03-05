import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块中获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'Vue3RouterTab',
      exports: 'named',
      globals: {
        vue: 'Vue',
        'vue-router': 'VueRouter'
      },
      sourcemap: true
    }
  ],
  external: ['vue', 'vue-router'],
  plugins: [
    alias({
      entries: [
        { find: '@routerTab', replacement: path.resolve(__dirname, 'src') }
      ]
    }),
    resolve(),
    commonjs(),
    vue({
      css: false // CSS 将由 postcss 插件处理
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue']
    }),
    postcss({
      extract: 'css/style.css',
      minimize: true
    }),
    terser() // 压缩代码
  ]
});
