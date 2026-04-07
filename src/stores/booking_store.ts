import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { CreateBookingRequest } from '@/types/booking'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createBooking(booking: CreateBookingRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/create_bookings/', booking)
        return { success: true, data: response.data }
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Nem sikerült elküldeni a foglalást'
        console.error('Create booking error:', err)
        return { success: false, message: this.error, details: err.response?.data?.details }
      } finally {
        this.loading = false
      }
    },
  },
})
