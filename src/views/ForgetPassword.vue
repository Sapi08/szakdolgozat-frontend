<script lang="ts">

import { defineComponent } from 'vue';
import ForgetPasswordFormComponent from '@/components/ForgetPasswordFormComponent.vue'

export default defineComponent({
  name: "ForgetPasswordView",
  components: { ForgetPasswordFormComponent }
})
</script>

<template>
  <ForgetPasswordFormComponent/>
</template>

<style scoped>

</style>
