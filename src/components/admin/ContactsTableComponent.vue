<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useAdminContactStore } from '@/stores/admin/admin_contact_store'
import type { ContactMessage } from '@/types/contact'

export default defineComponent({
  name: 'ContactsTable',
  data() {
    return {
      loading: false,
      contacts: [] as ContactMessage[],
    }
  },
  computed: {
    ...mapStores(useAdminContactStore),
  },
  async created() {
    this.loading = true
    try {
      const result = await this.admin_contactStore.loadContacts()
      if (result.success) {
        this.contacts = result.data || []
      }
    } finally {
      this.loading = false
    }
  },
})
</script>

<template>
  <div>
    <template v-if="loading"> Loading.... </template>
    <template v-else>
      <table class="min-w-full border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">ID</th>
            <th class="border px-4 py-2">Name</th>
            <th class="border px-4 py-2">Email</th>
            <th class="border px-4 py-2">Subject</th>
            <th class="border px-4 py-2">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact.id">
            <td class="border px-4 py-2">{{ contact.id }}</td>
            <td class="border px-4 py-2">{{ contact.name }}</td>
            <td class="border px-4 py-2">{{ contact.email }}</td>
            <td class="border px-4 py-2">{{ contact.subject }}</td>
            <td class="border px-4 py-2">{{ contact.message }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  margin-left: 300px;
}
</style>
