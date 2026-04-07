<script lang="ts">
import { defineComponent } from 'vue'

import FoodComponent from '@/components/FoodComponent.vue'
import ServicesComponent from '@/components/ServicesComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import SliderComponent from '@/components/SliderComponent.vue'

export default defineComponent({
  name: 'HomeView',
  components: { SliderComponent, TeamComponent, ServicesComponent, FoodComponent },
})
</script>

<template>
  <SliderComponent />
  <FoodComponent />
  <ServicesComponent />
  <TeamComponent />
</template>

<style scoped></style>
