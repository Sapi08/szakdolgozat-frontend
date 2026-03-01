<script lang="ts">
import { defineComponent } from 'vue'
import AdminEventBookingComponent from '@/components/admin/AdminEventBookingComponent.vue'

export default defineComponent({
  name: "EventsView",
  components: { AdminEventBookingComponent }
})
</script>

<template>
  <AdminEventBookingComponent/>
</template>

<style scoped>

</style>
