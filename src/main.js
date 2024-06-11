import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'


// importiamo il file router.js
import { router } from './router' 

// importiamo bootstrap
import * as bootstrap from 'bootstrap'

createApp(App).use(router).mount('#app')
