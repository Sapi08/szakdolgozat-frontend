<script lang="ts">
import { defineComponent } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'

export default defineComponent({
  name: "ProfileView",
  components: { ProfileComponent }
})
</script>

<template>
  <ProfileComponent/>
</template>

<style scoped>

</style>
