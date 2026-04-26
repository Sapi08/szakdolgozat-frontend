import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { CreateBookingRequest } from '@/types/booking'

type ReservedDayDto = { date: string }

export const useBookingStore = defineStore('booking', {
  state: () => ({
    loading: false,
    error: null as string | null,
    reservedDates: [] as string[],
  }),

  actions: {
    async fetchReservedDates() {
      try {
        const response = await api.get('/bookings/reserved-days')
        const raw = response.data as string[] | ReservedDayDto[]
        this.reservedDates = raw
          .map((item) => (typeof item === 'string' ? item : item.date))
          .filter((date): date is string => typeof date === 'string' && date.length > 0)
        return { success: true, data: this.reservedDates }
      } catch (err: unknown) {
        console.error('Failed to fetch reserved dates:', err)
        return { success: false, message: 'Nem sikerült betölteni a foglalt napokat' }
      }
    },

    async createBooking(booking: CreateBookingRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/create_bookings/', booking)
        return { success: true, data: response.data }
      } catch (err: unknown) {
        const serverMessage =
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error ===
            'string'
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : null
        this.error = serverMessage || 'Nem sikerült elküldeni a foglalást'
        console.error('Create booking error:', err)
        const details =
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          (err as { response?: { data?: { details?: unknown } } }).response?.data
            ? (err as { response?: { data?: { details?: unknown } } }).response?.data?.details
            : undefined
        return { success: false, message: this.error, details }
      } finally {
        this.loading = false
      }
    },
  },
})
