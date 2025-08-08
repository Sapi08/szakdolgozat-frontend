<script lang="ts">
import { defineComponent } from 'vue'
import AdminNavBarComponent from "@/components/admin/AdminNavBarComponent.vue";


export default defineComponent({
  name: 'AdminLayout',
  components: {
    AdminNavBarComponent
  },
})
</script>

<template>
  <AdminNavBarComponent/>
  <RouterView/>
</template>

<style scoped>

</style>
