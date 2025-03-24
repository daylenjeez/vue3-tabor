import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import type { TabConfig } from '../../../dist'

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
      meta: {
        tabConfig: {
          key: 'path'
        } satisfies TabConfig
      }
    },
    {
      path: '/full-path',
      name: 'full_path',
      component: () => import('../views/FullPath.vue'),
      meta: {
        tabConfig: {
          key: 'fullPath',
          name: (route: RouteLocationNormalized) => route.query.name as string
        } satisfies TabConfig
      }
    },
    {
      path: '/iframe',
      name: 'iframe',
      component: () => import('../views/Iframe.vue'),
      meta: {
        tabConfig: {
          key: "fullPath",
          name: 'iframe',
          iframeAttributes: {
            src: 'https://www.baidu.com'
          }
        } satisfies TabConfig
      }
    }
  ]
})

export default router 
