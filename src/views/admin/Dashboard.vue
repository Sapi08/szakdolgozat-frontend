<script lang="ts">
import {defineComponent} from 'vue'
import CardComponent from "@/components/admin/CardComponent.vue";

export default defineComponent({
  name: "DashboardView",
  components: {CardComponent}
})
</script>

<template>
  <CardComponent/>
</template>

<style scoped>

</style>
