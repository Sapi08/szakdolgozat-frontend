import { defineStore } from 'pinia'
import api from '@/config/axios'
import { AxiosError } from 'axios'

interface PeriodStatistics {
  count: number
  total_revenue: number
  pending?: number
  avg_order_value?: number
  completed?: number
}

interface StatusBreakdown {
  [key: string]: number
}

interface Statistics {
  users: number
  orders: number
  dailyOrders: number
  today: PeriodStatistics
  week: PeriodStatistics
  month: PeriodStatistics
  pending_count: number
  status_breakdown: StatusBreakdown
}

export const useStatisticsStore = defineStore('statistics', {
  state: () => {
    return {
      statistics: null as Statistics | null,
      loading: false,
      error: null as string | null
    }
  },
  getters: {
    usersCount: (state) => state.statistics?.users ?? 0,
    ordersCount: (state) => state.statistics?.orders ?? 0,
    dailyOrdersCount: (state) => state.statistics?.dailyOrders ?? 0,
    todayStats: (state) => state.statistics?.today ?? { count: 0, total_revenue: 0, pending: 0 },
    weekStats: (state) => state.statistics?.week ?? { count: 0, total_revenue: 0, avg_order_value: 0 },
    monthStats: (state) => state.statistics?.month ?? { count: 0, total_revenue: 0, completed: 0 },
    pendingCount: (state) => state.statistics?.pending_count ?? 0,
    statusBreakdown: (state) => state.statistics?.status_breakdown ?? {}
  },
  actions: {
    async fetchStatistics() {
      this.loading = true
      this.error = null

      try {
        const res = await api.get('api/statistics/')
        this.statistics = res.data.statistics as Statistics
        return { success: true }
      } catch (err) {
        console.error('Statisztika lekérési hiba:', err)

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status

            if (status === 403) {
              this.error = 'Nincs jogosultsága a statisztikák megtekintéséhez!'
            } else if (status >= 500) {
              this.error = 'Szerverhiba történt. Kérjük, próbálja újra később!'
            } else {
              this.error = 'Hiba történt a statisztikák betöltése során!'
            }
          } else if (err.request) {
            this.error = 'Nem sikerült kapcsolódni a szerverhez!'
          }
        } else {
          this.error = 'Váratlan hiba történt!'
        }

        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
