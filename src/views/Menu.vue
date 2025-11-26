<script lang="ts">
import {defineComponent} from 'vue'
import FoodComponent from "@/components/FoodComponent.vue";
import PageHeader from "@/components/PageHeader.vue";
import Hamburgers from "@/components/Hamburgers.vue";
import MenuBookComponent from "@/components/MenuBookComponent.vue";
import FoodCardComponent from '@/components/FoodCardComponent.vue'

export default defineComponent({
  name: "MenuView",
  components: { FoodCard: FoodCardComponent, MenuBookComponent, Hamburgers, PageHeader}
})
</script>

<template>
  <PageHeader/>
  <FoodCard/>
  <MenuBookComponent/>
  <Hamburgers/>
</template>

<style scoped>

</style>
