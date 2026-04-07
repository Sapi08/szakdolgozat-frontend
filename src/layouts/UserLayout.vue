<script lang="ts">
import { defineComponent } from 'vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ScratchCardPopupComponent from '@/components/ScratchCardPopupComponent.vue'

export default defineComponent({
  name: 'UserLayout',
  components: {
    ScratchCardPopupComponent: ScratchCardPopupComponent,
    FooterComponent,
    NavBarComponent,
  },
})
</script>

<template>
  <ScratchCardPopupComponent />
  <NavBarComponent />
  <RouterView />
  <FooterComponent />
</template>

<style scoped></style>
