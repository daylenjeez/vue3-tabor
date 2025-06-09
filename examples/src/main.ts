import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import Tabor from 'vue3-tabor'

import '../../dist/assets/index.css'

const app = createApp(App)
app.use(router)
app.use(Tabor, {
  router,
  maxCache: 10,
})
app.mount('#app')
