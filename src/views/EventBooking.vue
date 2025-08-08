<script lang="ts">
import {defineComponent} from 'vue'
import PageHeader from "@/components/PageHeader.vue";
import EventBookingComponent from "@/components/EventBookingComponent.vue";

export default defineComponent({
  name: "EventBookingView",
  components: {EventBookingComponent, PageHeader}
})
</script>

<template>
  <PageHeader/>
  <EventBookingComponent/>
</template>

<style scoped>

</style>
