<script lang="ts">

import {defineComponent} from "vue";
import PageHeader from "@/components/PageHeader.vue";
import CartComponent from "@/components/CartComponent.vue";

export default defineComponent({
  name: "CartView",
  components: {CartComponent, PageHeader}
})
</script>

<template>
  <PageHeader/>
  <CartComponent/>
</template>

<style scoped>

</style>
