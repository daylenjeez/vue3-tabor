import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import tabor from 'vue3-tabor'

const app = createApp(App)
app.use(router)
app.use(tabor, {
  router,
  maxCache: 10
})
app.mount('#app')
