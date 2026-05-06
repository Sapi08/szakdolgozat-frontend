import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { ContactMessage } from '@/types/contact'
import { AxiosError } from 'axios'

export const useAdminContactStore = defineStore('admin_contact', {
  state: () => ({
    contacts: [] as ContactMessage[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    unseenCount: (state) => {
      return state.contacts.filter(msg => !msg.seen_by_admin).length
    }
  },

  actions: {
    async adminLoadContacts() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/admin/contacts')
        this.contacts = response.data as ContactMessage[]
        return { success: true, data: this.contacts }
      } catch (err) {
        if (err instanceof AxiosError) {
          this.error = err.response?.data?.error || 'Nem sikerült betölteni az üzeneteket'
        } else {
          this.error = 'Nem sikerült betölteni az üzeneteket'
        }
        console.error('Load contacts error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async adminMarkAsSeen(id: number) {
      try {
        await api.patch(`/admin/contacts/${id}/mark-seen/`)
        const contact = this.contacts.find((c) => c.id === id)
        if (contact) contact.seen_by_admin = true
        return { success: true }
      } catch (err) {
        console.error('Mark as seen error:', err)
        return { success: false }
      }
    },
  },
})
