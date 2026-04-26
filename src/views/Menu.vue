<script lang="ts">
import { defineComponent } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MenuBookComponent from '@/components/MenuBookComponent.vue'
import FoodCardComponent from '@/components/FoodCardComponent.vue'

export default defineComponent({
  name: 'MenuView',
  components: { FoodCard: FoodCardComponent, MenuBookComponent, PageHeader },
})
</script>

<template>
  <PageHeader />
  <FoodCard />
  <MenuBookComponent />
</template>

<style scoped></style>
