import { createRouter, createWebHistory } from 'vue-router'
import type { TabConfig } from 'vue3-tabor'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'initial',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/path',
      name: 'key_is_path',
      component: () => import('../views/Path.vue'),
      meta:{
        tabConfig:{
          key: 'path'
        } satisfies TabConfig
      }
    },
    {
      path: '/full-path',
      name: 'full_path',
      component: () => import('../views/fullPath.vue'),
      meta:{
        tabConfig:{
          key: 'fullPath',
        } satisfies TabConfig
      }
    }
  ]
})

export default router 
