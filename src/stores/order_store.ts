import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { Order, OrderCreateRequest } from '@/types/order'
import { OrderModel } from '@/types/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as OrderModel[],
    currentOrder: null as OrderModel | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    pendingOrders: (state) => state.orders.filter((order) => order.status === 'pending'),
    acceptedOrders: (state) => state.orders.filter((order) => order.status === 'accepted'),
    preparingOrders: (state) => state.orders.filter((order) => order.status === 'preparing'),
    readyOrders: (state) => state.orders.filter((order) => order.status === 'ready'),
    inDeliveryOrders: (state) => state.orders.filter((order) => order.status === 'in_delivery'),
    deliveredOrders: (state) => state.orders.filter((order) => order.status === 'delivered'),
    completedOrders: (state) => state.orders.filter((order) => order.status === 'completed'),
    canceledOrders: (state) => state.orders.filter((order) => order.status === 'canceled'),
  },

  actions: {
    // Új rendelés létrehozása
    async createOrder(orderData: OrderCreateRequest) {
      this.loading = true
      this.error = null
      try {
        console.log('📤 Sending order data:', orderData)
        const response = await api.post('/orders/create/', orderData)
        console.log('✅ Order response:', response.data)
        const newOrder = new OrderModel(response.data)
        this.orders.unshift(newOrder)
        this.currentOrder = newOrder
        return { success: true, order: newOrder }
      } catch (err) {
        const error = err as { response?: { data?: any; status?: number } }
        console.error('❌ Create order error - Full error:', err)
        console.error('❌ Error response:', error.response)
        console.error('❌ Error response data:', error.response?.data)
        console.error('❌ Error response status:', error.response?.status)

        // Próbáljuk meg kinyerni a részletes hibaüzenetet
        let errorMessage = 'Hiba történt a rendelés leadása során'

        if (error.response?.data) {
          // Ha van error vagy message mező
          if (error.response.data.error) {
            errorMessage = error.response.data.error
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data
          } else {
            // Ha objektum formában jönnek a hibák (pl. field validációk)
            errorMessage = JSON.stringify(error.response.data)
          }
        }

        this.error = errorMessage
        return { success: false, message: errorMessage }
      } finally {
        this.loading = false
      }
    },

    // Felhasználó saját rendelései
    async fetchUserOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/orders/my-orders/')
        const results = Array.isArray(response.data)
          ? response.data
          : response.data?.orders || response.data?.results || response.data?.data || []

        this.orders = results.map((order: Order) => new OrderModel(order))
        return { success: true }
      } catch (err) {
        this.error = (err as Error).message || 'Hiba történt a rendelések lekérése során'
        console.error('Fetch my orders error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
  },
})
