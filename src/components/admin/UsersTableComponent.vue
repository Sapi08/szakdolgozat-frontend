<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useAdminUserStore } from '@/stores/admin/admin_user_store'
import moment from 'moment'
import EditableTableComponent, { type TableColumn } from '@/components/admin/EditableTableComponent.vue'

export default defineComponent({
  name: 'UsersTable',
  components: { EditableTableComponent },
  data() {
    return {
      loading: false,
      users: [] as any[],
      columns: [
        { key: 'id', label: 'ID', editable: false },
        { key: 'last_name', label: 'Vezetéknév', editable: true },
        { key: 'first_name', label: 'Keresztnév', editable: true },
        { key: 'email', label: 'Email cím', editable: true },
        { key: 'last_login', label: 'Utolsó bejelentkezés', editable: false, format: (date: string) => moment(String(date)).format('YYYY.MM.DD hh:mm') },
        { key: 'phone', label: 'Telefon', editable: true },
      ] as TableColumn[],
    }
  },
  computed: {
    ...mapStores(useAdminUserStore),
  },
  methods: {
    async handleSave(updatedUser: any) {
      try {
        await this.adminUserStore.adminUpdateUser(updatedUser.id, updatedUser)
        const index = this.users.findIndex(u => u.id === updatedUser.id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        alert('Felhasználó sikeresen mentve')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a mentés során!')
      }
    },
    async handleDelete(id: number) {
      try {
        await this.adminUserStore.adminDeleteUser(id)
        this.users = this.users.filter(u => u.id !== id)
        alert('Felhasználó sikeresen törölve')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a törlés során!')
      }
    }
  },
  async created() {
    this.loading = true
    try {
      this.users = await this.adminUserStore.adminLoadUsers()
    } finally {
      this.loading = false
    }
  },
})
</script>

<template>
  <div class="table-container">
    <EditableTableComponent
      :loading="loading"
      :items="users"
      :columns="columns"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.table-container {
  margin-left: 300px;
}
</style>
