import { defineStore } from 'pinia'
import api from '@/config/axios'
import { AxiosError } from 'axios'

export const useAdminStatisticsStore = defineStore('admin_statistics', {
  state: () => ({
	statistics: null as any | null,
	loading: false,
	error: null as string | null,
  }),
  getters: {
	usersCount: (state) => state.statistics?.users ?? 0,
	ordersCount: (state) => state.statistics?.orders ?? 0,
	dailyOrdersCount: (state) => state.statistics?.dailyOrders ?? 0,
	todayStats: (state) => state.statistics?.today ?? { count: 0, total_revenue: 0, pending: 0 },
	weekStats: (state) => state.statistics?.week ?? { count: 0, total_revenue: 0, avg_order_value: 0 },
	monthStats: (state) => state.statistics?.month ?? { count: 0, total_revenue: 0, completed: 0 },
	pendingCount: (state) => state.statistics?.pending_count ?? 0,
	statusBreakdown: (state) => state.statistics?.status_breakdown ?? {},
  },
  actions: {
	async adminFetchStatistics() {
	  this.loading = true
	  this.error = null
	  try {
		const res = await api.get('admin/statistics/')
		this.statistics = res.data.statistics
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
	},
  },
})


