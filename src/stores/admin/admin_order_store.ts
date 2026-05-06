import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { Order } from '@/types/order'
import { OrderModel } from '@/types/order'

export const useAdminOrderStore = defineStore('adminOrder', {
  state: () => ({
    orders: [] as OrderModel[],
    currentOrder: null as OrderModel | null,
    loading: false,
    error: null as string | null,
    pendingCount: 0,
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
    getPendingOrdersCount: (state) => state.pendingCount,
  },

  actions: {
    adminRefreshPendingCount() {
      this.pendingCount = this.pendingOrders.length
    },

    adminSyncUpdatedOrder(orderId: number, updatedOrder: OrderModel) {
      const index = this.orders.findIndex((o) => o.id === orderId)
      if (index !== -1) {
        this.orders[index] = updatedOrder
      }

      if (this.currentOrder && this.currentOrder.id === orderId) {
        this.currentOrder = updatedOrder
      }
    },

    async adminFetchOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/admin/orders/')
        const results = Array.isArray(response.data)
          ? response.data
          : response.data?.orders || response.data?.results || response.data?.data || []

        this.orders = results.map((order: Order) => new OrderModel(order))
        this.adminRefreshPendingCount()
        return { success: true }
      } catch (err) {
        this.error = (err as Error).message || 'Hiba tortent a rendelesek lekerese soran'
        console.error('Fetch admin orders error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async adminFetchOrderById(orderId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/orders/${orderId}/`)
        this.currentOrder = new OrderModel(response.data)
        return { success: true, order: this.currentOrder }
      } catch (err) {
        this.error = (err as Error).message || 'Hiba tortent a rendeles lekerese soran'
        console.error('Fetch admin order error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async adminUpdateOrderStatus(orderId: number, status: Order['status'], adminNote?: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(`/admin/orders/${orderId}/status/`, {
          status,
          admin_note: adminNote,
        })

        const updatedOrder = new OrderModel(response.data.order || response.data)
        this.adminSyncUpdatedOrder(orderId, updatedOrder)
        this.adminRefreshPendingCount()
        return { success: true, order: updatedOrder }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        this.error = error.response?.data?.message || 'Hiba tortent a statusz frissitese soran'
        console.error('Update admin order status error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(orderId: number, reason?: string) {
      this.loading = true
      this.error = null
      try {
        await api.post(`/admin/orders/${orderId}/cancel/`, {
          reason: reason || 'Admin altal torolve',
        })

        this.orders = this.orders.filter((o) => o.id !== orderId)
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = null
        }

        this.adminRefreshPendingCount()
        return { success: true }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        this.error = error.response?.data?.message || 'Hiba tortent a rendeles torlese soran'
        console.error('Delete admin order error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async acceptOrder(orderId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(`/admin/orders/${orderId}/accept/`)
        const updatedOrder = new OrderModel(response.data.order || response.data)
        this.adminSyncUpdatedOrder(orderId, updatedOrder)
        this.adminRefreshPendingCount()
        return { success: true, order: updatedOrder }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        this.error = error.response?.data?.message || 'Hiba tortent a rendeles elfogadasa soran'
        console.error('Accept admin order error:', err)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async markOrderViewed(orderId: number) {
      try {
        await api.post(`/admin/orders/${orderId}/view/`)
        return { success: true }
      } catch (err) {
        console.error('Mark admin order viewed error:', err)
        return { success: false }
      }
    },

    async fetchPendingOrdersCount() {
      try {
        const response = await api.get('/admin/orders/pending-count/')
        this.pendingCount = response.data.pending_count || 0

        return {
          success: true,
          count: this.pendingCount,
          hasNew: response.data.has_new_orders,
        }
      } catch (err) {
        console.error('Get pending count error:', err)
        return { success: false, count: 0, hasNew: false }
      }
    },
  },
})

