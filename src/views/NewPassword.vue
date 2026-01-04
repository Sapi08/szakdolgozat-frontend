<script lang="ts">
import { defineComponent } from 'vue'
import CreateNewPasswordComponent from '@/components/CreateNewPasswordComponent.vue'

export default defineComponent({
  name: 'NewPasswordView',
  components: { CreateNewPasswordComponent },
})
</script>

<template>
  <CreateNewPasswordComponent/>
</template>

<style scoped></style>
