<script lang="ts">

import PageHeader from "@/components/PageHeader.vue";
import {defineComponent} from "vue";
import PicturesComponent from "@/components/PicturesComponent.vue";

export default defineComponent({
  name: "GalleryView",
  components: {PicturesComponent, PageHeader}
})
</script>

<template>
  <PageHeader/>
  <PicturesComponent/>
</template>

<style scoped>

</style>
