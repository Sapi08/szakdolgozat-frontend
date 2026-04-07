<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user_store.ts'
import { useCartStore } from '@/stores/cart_store.ts'

export default defineComponent({
  name: 'App',

  async mounted() {
    const userStore = useUserStore()
    userStore.initAuth()

    const cartStore = useCartStore()
    await cartStore.loadFromSession() // Várunk az ételek betöltésére
  },
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
