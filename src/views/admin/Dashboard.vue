<script lang="ts">
import {defineComponent} from 'vue'
import AdminNavBarComponent from "@/components/admin/AdminNavBarComponent.vue";
import CardComponent from "@/components/admin/CardComponent.vue";

export default defineComponent({
  name: "DashboardView",
  components: {CardComponent, AdminNavBarComponent}
})
</script>

<template>
  <CardComponent/>
</template>

<style scoped>

</style>
