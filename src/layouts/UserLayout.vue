<script lang="ts">
import { defineComponent } from 'vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import RandomPopupComponent from "@/components/RandomPopupComponent.vue";

export default defineComponent({
  name: 'UserLayout',
  components: {
    RandomPopupComponent,
    FooterComponent,
    NavBarComponent,
  },
})
</script>

<template>
  <RandomPopupComponent/>
  <NavBarComponent />
  <RouterView/>
  <FooterComponent />
</template>

<style scoped>

</style>
