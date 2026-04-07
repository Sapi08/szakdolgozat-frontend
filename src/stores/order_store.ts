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
    // Rendelések lekérése (admin)
    async fetchOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/admin/orders/')
        this.orders = response.data.map((order: Order) => new OrderModel(order))
        return { success: true }
      } catch (err) {
        this.error = (err as Error).message || 'Hiba történt a rendelések lekérése során'
        console.error('Fetch orders error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Egy rendelés lekérése ID alapján
    async fetchOrderById(orderId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/api/orders/${orderId}/`)
        this.currentOrder = new OrderModel(response.data)
        return { success: true, order: this.currentOrder }
      } catch (err) {
        this.error = (err as Error).message || 'Hiba történt a rendelés lekérése során'
        console.error('Fetch order error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Új rendelés létrehozása
    async createOrder(orderData: OrderCreateRequest) {
      this.loading = true
      this.error = null
      try {
        console.log('📤 Sending order data:', orderData)
        const response = await api.post('/api/orders/create/', orderData)
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

    // Rendelés státuszának frissítése (admin)
    async updateOrderStatus(orderId: number, status: Order['status'], adminNote?: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(`/api/admin/orders/${orderId}/status/`, {
          status,
          admin_note: adminNote,
        })
        const updatedOrder = new OrderModel(response.data)

        // Frissítjük a listában
        const index = this.orders.findIndex((o) => o.id === orderId)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }

        // Frissítjük a current order-t is ha az van
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = updatedOrder
        }

        return { success: true, order: updatedOrder }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        this.error = error.response?.data?.message || 'Hiba történt a státusz frissítése során'
        console.error('Update order status error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Rendelés lemondása (admin)
    async deleteOrder(orderId: number, reason?: string) {
      this.loading = true
      this.error = null
      try {
        await api.post(`/api/admin/orders/${orderId}/cancel/`, {
          reason: reason || 'Admin által törölve',
        })
        this.orders = this.orders.filter((o) => o.id !== orderId)
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = null
        }
        return { success: true }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        this.error = error.response?.data?.message || 'Hiba történt a rendelés törlése során'
        console.error('Delete order error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Rendelés elfogadása (admin)
    async acceptOrder(orderId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(`/api/admin/orders/${orderId}/accept/`)
        const updatedOrder = new OrderModel(response.data)

        const index = this.orders.findIndex((o) => o.id === orderId)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }

        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = updatedOrder
        }

        return { success: true, order: updatedOrder }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        this.error = error.response?.data?.message || 'Hiba történt a rendelés elfogadása során'
        console.error('Accept order error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Rendelés megtekintettnek jelölése (admin)
    async markOrderViewed(orderId: number) {
      try {
        await api.post(`/api/admin/orders/${orderId}/view/`)
        return { success: true }
      } catch (err) {
        console.error('Mark order viewed error:', err)
        return { success: false }
      }
    },

    // Függőben lévő rendelések száma (admin)
    async getPendingOrdersCount() {
      try {
        const response = await api.get('/api/admin/orders/pending-count/')
        return {
          success: true,
          count: response.data.pending_count,
          hasNew: response.data.has_new_orders,
        }
      } catch (err) {
        console.error('Get pending count error:', err)
        return { success: false, count: 0, hasNew: false }
      }
    },

    // Felhasználó saját rendelései
    async fetchMyOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/orders/my-orders/')
        this.orders = response.data.map((order: Order) => new OrderModel(order))
        return { success: true }
      } catch (err) {
        this.error = (err as Error).message || 'Hiba történt a rendelések lekérése során'
        console.error('Fetch my orders error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Értesítési hang lejátszása
    playNotificationSound() {
      try {
        const audio = new Audio('/src/assets/sounds/mixkit-software-interface-start-2574.wav')
        audio.play().catch((err) => console.error('Error playing sound:', err))
      } catch (err) {
        console.error('Error creating audio:', err)
      }
    },
  },
})
