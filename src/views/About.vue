<script lang="ts">
import {defineComponent} from 'vue'
import AboutComponent from "@/components/AboutComponent.vue";
import PageHeader from "@/components/PageHeader.vue";

export default defineComponent({
  name: "AboutView",
  components: {PageHeader, AboutComponent}
})
</script>

<template>
  <PageHeader/>
  <AboutComponent/>
</template>

<style scoped>

</style>
