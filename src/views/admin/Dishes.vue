<script lang="ts">
import {defineComponent} from 'vue'
import DishesTableComponent from "@/components/admin/DishesTableComponent.vue";

export default defineComponent({
  name: "Dishes",
  components: {DishesTableComponent}
})
</script>

<template>
  <DishesTableComponent/>
</template>

<style scoped>

</style>
