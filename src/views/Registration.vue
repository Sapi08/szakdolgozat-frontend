<script lang="ts">
import { defineComponent } from 'vue'
import RegistrationFormComponent from '@/components/RegistrationFormComponent.vue'

export default defineComponent({
  name: 'RegistrationView',
  components: { RegistrationFormComponent },
})
</script>

<template>
  <RegistrationFormComponent/>
</template>

<style scoped></style>
