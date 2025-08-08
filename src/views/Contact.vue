<script lang="ts">
import {defineComponent} from 'vue'
import PageHeader from "@/components/PageHeader.vue";
import ContactComponent from "@/components/ContactComponent.vue";

export default defineComponent({
  name: "ContactView",
  components: {ContactComponent, PageHeader}
})
</script>

<template>
  <PageHeader/>
  <ContactComponent/>
</template>

<style scoped>

</style>
