<script lang="ts">
import { defineComponent } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import PageHeader from '@/components/PageHeader.vue'

export default defineComponent({
  name: "ProfileView",
  components: { PageHeader, ProfileComponent }
})
</script>

<template>
  <PageHeader/>
  <ProfileComponent/>
</template>

<style scoped>

</style>
