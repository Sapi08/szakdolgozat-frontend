<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user_store.ts'
import { useCartStore } from '@/stores/cart_store.ts'

export default defineComponent({
  name: 'App',

  mounted() {
    const userStore = useUserStore()
    userStore.initAuth() // Itt induláskor visszatöltjük a bejelentkezést

    const cartStore = useCartStore()
    cartStore.loadFromSession() // Itt induláskor visszatöltjük a kosarat a sessionből
  },
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
