import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user_store.ts'
import { useCartStore } from '@/stores/cart_store.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()
userStore.initAuth() // Itt induláskor visszatöltjük a bejelentkezést

const cartStore = useCartStore()
cartStore.loadFromSession() // Itt induláskor visszatöltjük a kosarat a sessionből

app.mount('#app')
