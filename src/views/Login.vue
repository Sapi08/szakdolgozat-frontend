<script lang="ts">

import { defineComponent } from 'vue';
import LoginFormComponent from "@/components/LoginFormComponent.vue";

export default defineComponent({
  name: "LoginView",
  components: { LoginFormComponent }
})
</script>

<template>
  <LoginFormComponent/>
</template>

<style scoped>

</style>
