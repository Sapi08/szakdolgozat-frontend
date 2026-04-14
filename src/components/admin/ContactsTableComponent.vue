<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useAdminContactStore } from '@/stores/admin/admin_contact_store'
import type { ContactMessage } from '@/types/contact'
import EditableTableComponent, { type TableColumn } from '@/components/admin/EditableTableComponent.vue'

export default defineComponent({
  name: 'ContactsTable',
  components: {
    EditableTableComponent,
  },
  data() {
    return {
      loading: false,
      contacts: [] as ContactMessage[],
      columns: [
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Név', editable: false },
        { key: 'email', label: 'Email', editable: false },
        { key: 'subject', label: 'Tárgy', editable: false, cellStyle: 'min-width: 650px; max-width: 250px; white-space: normal; word-wrap: break-word;' },
        { key: 'message', label: 'Üzenet', editable: false, cellStyle: 'min-width: 200px; max-width: 400px; white-space: normal; word-wrap: break-word;' },
      ] as TableColumn[],
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
  methods: {
    handleSave(item: any) {
      console.log('Mentés:', item)
      // Todo: ha a store-ban is benne lesz a funkció
    },
    handleDelete(id: number) {
      console.log('Törlés:', id)
      // Todo: ha a store-ban is benne lesz a funkció
    },
    handleRowClick(item: any) {
      if (item.id && !item.seen_by_admin) {
        this.admin_contactStore.markAsSeen(item.id)
      }
    },
    checkIfUnseen(item: any) {
      return !item.seen_by_admin
    }
  },
})
</script>

<template>
  <div class="table-wrapper">
    <EditableTableComponent
      :items="contacts"
      :columns="columns"
      :loading="loading"
      :unseenFn="checkIfUnseen"
      @save="handleSave"
      @delete="handleDelete"
      @row-click="handleRowClick"
    />
  </div>
</template>

<style scoped>
.table-wrapper {
  margin-left: 300px;
}
</style>
