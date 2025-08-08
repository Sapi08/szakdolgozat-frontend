<script lang="ts">
import {defineComponent} from 'vue'
import PageHeader from "@/components/PageHeader.vue";
import BlogComponent from "@/components/BlogComponent.vue";
import ServicesComponent from "@/components/ServicesComponent.vue";

export default defineComponent({
  name: "ServicesView",
  components: {ServicesComponent, BlogComponent, PageHeader}
})
</script>

<template>
  <PageHeader/>
  <BlogComponent/>
  <ServicesComponent/>
</template>

<style scoped>

</style>
