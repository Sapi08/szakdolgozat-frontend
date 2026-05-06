import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import api from '@/config/axios'

export const useAdminUserStore = defineStore('adminUser', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async adminLoadUsers() {
      try {
        this.loading = true
        const res = await api.get('/admin/users/')
        this.users = res.data as User[]
        return res.data
      } finally {
        this.loading = false
      }
    },

    async adminUpdateUser(userId: number, data: Partial<User>) {
      const res = await api.put(`/admin/users/${userId}/edit`, data)
      const index = this.users.findIndex((u) => u.id === userId)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...res.data }
      }
      return res.data
    },

    async adminDeleteUser(userId: number) {
      await api.delete(`/admin/users/${userId}/delete`)
      this.users = this.users.filter((u) => u.id !== userId)
    },
  },
})

