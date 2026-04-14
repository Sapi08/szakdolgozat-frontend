import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { Booking } from '@/types/booking'

export const useAdminBookingStore = defineStore('admin_booking', {
  state: () => ({
    bookings: [] as Booking[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    pendingBookings: (state) => state.bookings.filter((b) => !b.confirmed),
    unseenCount: (state) => state.bookings.filter((b) => !b.seen_by_admin).length,
    confirmedBookings: (state) => state.bookings.filter((b) => b.confirmed),
    unhandledCount: (state) => state.bookings.filter((b) => b.confirmed === null).length,
  },

  actions: {
    async fetchBookings(filters?: { confirmed?: boolean; seen?: boolean }) {
      this.loading = true
      this.error = null
      try {
        const params: Record<string, string> = {}
        if (filters?.confirmed !== undefined) {
          params.confirmed = filters.confirmed.toString()
        }
        if (filters?.seen !== undefined) {
          params.seen = filters.seen.toString()
        }

        const response = await api.get('/api/bookings/', { params })
        this.bookings = response.data
        return { success: true }
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Nem sikerült betölteni a foglalásokat'
        console.error('Fetch bookings error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async changeBookingStatus(id: number, confirmed: boolean) {
      this.loading = true
      this.error = null
      try {
        await api.patch(`/api/bookings/${id}/change-status/`, { confirmed })
        const booking = this.bookings.find((b) => b.id === id)
        if (booking) {
          booking.confirmed = confirmed
        }
        return { success: true }
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Nem sikerült frissíteni a foglalást'
        console.error('Confirm booking error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async markAsSeen(id: number) {
      try {
        await api.patch(`/api/bookings/${id}/mark-seen/`)
        const booking = this.bookings.find((b) => b.id === id)
        if (booking) booking.seen_by_admin = true
        return { success: true }
      } catch (err) {
        console.error('Mark as seen error:', err)
        return { success: false }
      }
    },
  },
})

