<script lang="ts">
import {defineComponent} from 'vue'
import ContactsTableComponent from '@/components/admin/ContactsTableComponent.vue';

export default defineComponent({
  name: "ContactsView",
  components: {ContactsTableComponent}
})
</script>

<template>
  <ContactsTableComponent/>
</template>

<style scoped>

</style>
