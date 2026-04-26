<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useOrderStore } from '@/stores/order_store'
import type { OrderModel } from '@/types/order'

export default defineComponent({
  name: 'UserOrdersViewerComponent',
  data() {
    return {
      backendError: '',
      selectedOrder: null as OrderModel | null,
      showOrderDetails: false,
    }
  },
  computed: {
    ...mapStores(useOrderStore),
    isLoading() {
      return this.orderStore.loading
    },
    orders() {
      return this.orderStore.orders
    },
    activeOrders() {
      return this.orders.filter(
        (order) =>
          order.status === 'pending' ||
          order.status === 'accepted' ||
          order.status === 'preparing' ||
          order.status === 'ready' ||
          order.status === 'in_delivery',
      )
    },
    completedOrders() {
      return this.orders.filter(
        (order) => order.status === 'delivered' || order.status === 'completed',
      )
    },
    canceledOrders() {
      return this.orders.filter((order) => order.status === 'canceled')
    },
  },
  async mounted() {
    await this.loadOrders()
  },
  methods: {
    async loadOrders() {
      this.backendError = ''
      try {
        await this.orderStore.fetchUserOrders()
      } catch (error) {
        this.backendError = 'Hiba történt a rendelések betöltésekor'
      }
    },
    formatDate(dateString?: string): string {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    formatPrice(price: number): string {
      return new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0,
      }).format(price)
    },
    getStatusLabel(status: string): string {
      const labels: Record<string, string> = {
        pending: 'Várakozik',
        accepted: 'Elfogadva',
        preparing: 'Készítés alatt',
        ready: 'Kész',
        in_delivery: 'Kiszállítás alatt',
        delivered: 'Kiszállítva',
        completed: 'Teljesítve',
        canceled: 'Törölve',
      }
      return labels[status] || status
    },
    getStatusClass(status: string): string {
      const classes: Record<string, string> = {
        pending: 'status-pending',
        accepted: 'status-accepted',
        preparing: 'status-preparing',
        ready: 'status-ready',
        in_delivery: 'status-delivery',
        delivered: 'status-delivered',
        completed: 'status-completed',
        canceled: 'status-canceled',
      }
      return classes[status] || ''
    },
    getPaymentStatusLabel(status: string): string {
      const labels: Record<string, string> = {
        pending: 'Várakozik',
        paid_with_card: 'Kártyával fizetve',
        cash_on_delivery: 'Utánvét',
        failed: 'Sikertelen',
      }
      return labels[status] || status
    },
    getPaymentStatusClass(status: string): string {
      const classes: Record<string, string> = {
        pending: 'payment-pending',
        paid_with_card: 'payment-paid',
        cash_on_delivery: 'payment-cod',
        failed: 'payment-failed',
      }
      return classes[status] || ''
    },
    viewOrderDetails(order: OrderModel) {
      this.selectedOrder = order
      this.showOrderDetails = true
    },
    closeOrderDetails() {
      this.showOrderDetails = false
      this.selectedOrder = null
    },
  },
})
</script>

<template>
  <div class="order-viewer-container">
    <div class="card">
      <div class="card-header">
        <h2>Rendeléseim</h2>
      </div>

      <div class="card-body">
        <!-- Backend hiba -->
        <div v-if="backendError" class="alert alert-error">
          {{ backendError }}
        </div>

        <!-- Töltés -->
        <div v-if="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Rendelések betöltése...</p>
        </div>

        <template v-else>
          <!-- Aktív rendelések -->
          <div v-if="activeOrders.length > 0" class="section">
            <h3 class="section-title">
              <i class="fas fa-clock"></i>
              Folyamatban lévő rendelések
              <span class="badge-count">{{ activeOrders.length }}</span>
            </h3>

            <div class="table-container">
              <table class="order-table">
                <thead>
                <tr>
                  <th>Rendelésszám</th>
                  <th>Dátum</th>
                  <th>Összeg</th>
                  <th>Státusz</th>
                  <th>Fizetés</th>
                  <th>Részletek</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="order in activeOrders" :key="order.id">
                  <td>
                    <span class="order-number">{{ order.order_number }}</span>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td>
                    <span class="price-badge">{{ formatPrice(order.total_price) }}</span>
                  </td>
                  <td>
                      <span class="status-badge" :class="getStatusClass(order.status)">
                        {{ getStatusLabel(order.status) }}
                      </span>
                  </td>
                  <td>
                      <span
                        class="payment-badge"
                        :class="getPaymentStatusClass(order.payment_status)"
                      >
                        {{ getPaymentStatusLabel(order.payment_status) }}
                      </span>
                  </td>
                  <td>
                    <button class="btn-details" @click="viewOrderDetails(order)">
                      <i class="fas fa-eye"></i>
                      Megtekint
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Teljesített rendelések -->
          <div v-if="completedOrders.length > 0" class="section">
            <h3 class="section-title">
              <i class="fas fa-check-circle"></i>
              Teljesített rendelések
              <span class="badge-count">{{ completedOrders.length }}</span>
            </h3>

            <div class="table-container">
              <table class="order-table">
                <thead>
                <tr>
                  <th>Rendelésszám</th>
                  <th>Dátum</th>
                  <th>Összeg</th>
                  <th>Státusz</th>
                  <th>Fizetés</th>
                  <th>Részletek</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="order in completedOrders" :key="order.id">
                  <td>
                    <span class="order-number">{{ order.order_number }}</span>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td>
                    <span class="price-badge">{{ formatPrice(order.total_price) }}</span>
                  </td>
                  <td>
                      <span class="status-badge" :class="getStatusClass(order.status)">
                        {{ getStatusLabel(order.status) }}
                      </span>
                  </td>
                  <td>
                      <span
                        class="payment-badge"
                        :class="getPaymentStatusClass(order.payment_status)"
                      >
                        {{ getPaymentStatusLabel(order.payment_status) }}
                      </span>
                  </td>
                  <td>
                    <button class="btn-details" @click="viewOrderDetails(order)">
                      <i class="fas fa-eye"></i>
                      Megtekint
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Törölt rendelések -->
          <div v-if="canceledOrders.length > 0" class="section">
            <h3 class="section-title">
              <i class="fas fa-times-circle"></i>
              Törölt rendelések
              <span class="badge-count">{{ canceledOrders.length }}</span>
            </h3>

            <div class="table-container">
              <table class="order-table">
                <thead>
                <tr>
                  <th>Rendelésszám</th>
                  <th>Dátum</th>
                  <th>Összeg</th>
                  <th>Státusz</th>
                  <th>Részletek</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="order in canceledOrders" :key="order.id" class="canceled-row">
                  <td>
                    <span class="order-number">{{ order.order_number }}</span>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td>
                    <span class="price-badge">{{ formatPrice(order.total_price) }}</span>
                  </td>
                  <td>
                      <span class="status-badge" :class="getStatusClass(order.status)">
                        {{ getStatusLabel(order.status) }}
                      </span>
                  </td>
                  <td>
                    <button class="btn-details" @click="viewOrderDetails(order)">
                      <i class="fas fa-eye"></i>
                      Megtekint
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Nincs rendelés -->
          <div
            v-if="
              activeOrders.length === 0 &&
              completedOrders.length === 0 &&
              canceledOrders.length === 0
            "
            class="empty-state"
          >
            <i class="fas fa-shopping-bag empty-icon"></i>
            <p>Még nincs rendelésed.</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Rendelés részletek modal -->
    <transition name="modal-fade">
      <div v-if="showOrderDetails && selectedOrder" class="modal-overlay" @click="closeOrderDetails">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Rendelés részletei</h3>
            <button class="close-btn" @click="closeOrderDetails">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-section">
              <h4>Rendelés információk</h4>
              <div class="detail-row">
                <span class="detail-label">Rendelésszám:</span>
                <span class="detail-value">{{ selectedOrder.order_number }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Rendelés dátuma:</span>
                <span class="detail-value">{{ formatDate(selectedOrder.created_at) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Státusz:</span>
                <span class="status-badge" :class="getStatusClass(selectedOrder.status)">
                  {{ getStatusLabel(selectedOrder.status) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fizetési mód:</span>
                <span class="detail-value">{{ selectedOrder.payment_method }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fizetési státusz:</span>
                <span
                  class="payment-badge"
                  :class="getPaymentStatusClass(selectedOrder.payment_status)"
                >
                  {{ getPaymentStatusLabel(selectedOrder.payment_status) }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Szállítási információk</h4>
              <div class="detail-row">
                <span class="detail-label">Név:</span>
                <span class="detail-value">{{ selectedOrder.delivery_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Telefon:</span>
                <span class="detail-value">{{ selectedOrder.delivery_phone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Típus:</span>
                <span class="detail-value">{{ selectedOrder.delivery_type }}</span>
              </div>
              <div v-if="selectedOrder.delivery_address" class="detail-row">
                <span class="detail-label">Cím:</span>
                <span class="detail-value">
                  {{ selectedOrder.delivery_address }}, {{ selectedOrder.delivery_city }},
                  {{ selectedOrder.delivery_zip }}
                </span>
              </div>
              <div v-if="selectedOrder.comment" class="detail-row">
                <span class="detail-label">Megjegyzés:</span>
                <span class="detail-value">{{ selectedOrder.comment }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Rendelés tételek</h4>
              <div v-if="selectedOrder.items && selectedOrder.items.length > 0" class="items-list">
                <div
                  v-for="(item, index) in selectedOrder.items"
                  :key="index"
                  class="order-item"
                >
                  <div class="item-info">
                    <span class="item-name">{{ item.product_name }}</span>
                    <span class="item-quantity">{{ item.quantity }} db</span>
                  </div>
                  <span class="item-price">{{ formatPrice(item.total_price) }}</span>
                </div>
              </div>
              <p v-else class="no-items">Nincsenek tételek</p>
            </div>

            <div class="detail-section price-summary">
              <div class="detail-row">
                <span class="detail-label">Eredeti ár:</span>
                <span class="detail-value">{{ formatPrice(selectedOrder.original_price) }}</span>
              </div>
              <div v-if="selectedOrder.discount_amount > 0" class="detail-row">
                <span class="detail-label">Kedvezmény:</span>
                <span class="detail-value discount">
                  -{{ formatPrice(selectedOrder.discount_amount) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Szállítási díj:</span>
                <span class="detail-value">{{ formatPrice(selectedOrder.delivery_fee) }}</span>
              </div>
              <div class="detail-row total-row">
                <span class="detail-label">Végösszeg:</span>
                <span class="detail-value total-price">
                  {{ formatPrice(selectedOrder.total_price) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.order-viewer-container {
  margin: 2rem auto;
  padding: 1rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  text-align: center;
}

.card-header h2 {
  color: #fff;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.card-body {
  padding: 2rem;
}

.alert-error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.section-title i {
  color: #667eea;
}

.badge-count {
  background: #667eea;
  color: white;
  border-radius: 12px;
  padding: 0.1rem 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
}

.empty-icon {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table thead {
  background-color: #f8f9fa;
}

.order-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
}

.order-table tbody tr {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #e0e0e0;
}

.order-table tbody tr:hover {
  background-color: #f8f9fa;
}

.order-table tbody tr.canceled-row {
  opacity: 0.7;
  background-color: #fff3cd;
}

.order-table td {
  padding: 1rem;
  vertical-align: middle;
}

.order-number {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.price-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #28a745;
  color: #fff;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-pending {
  background-color: #ffc107;
  color: #000;
}

.status-accepted {
  background-color: #17a2b8;
  color: #fff;
}

.status-preparing {
  background-color: #fd7e14;
  color: #fff;
}

.status-ready {
  background-color: #20c997;
  color: #fff;
}

.status-delivery {
  background-color: #007bff;
  color: #fff;
}

.status-delivered,
.status-completed {
  background-color: #28a745;
  color: #fff;
}

.status-canceled {
  background-color: #dc3545;
  color: #fff;
}

.payment-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.payment-pending {
  background-color: #ffc107;
  color: #000;
}

.payment-paid {
  background-color: #28a745;
  color: #fff;
}

.payment-cod {
  background-color: #17a2b8;
  color: #fff;
}

.payment-failed {
  background-color: #dc3545;
  color: #fff;
}

.btn-details {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
  text-align: right;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: #333;
}

.item-quantity {
  font-size: 0.85rem;
  color: #666;
}

.item-price {
  font-weight: 700;
  color: #28a745;
}

.no-items {
  text-align: center;
  color: #999;
  padding: 1rem;
}

.price-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.discount {
  color: #dc3545;
  font-weight: 600;
}

.total-row {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 2px solid #667eea;
}

.total-row .detail-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.total-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #28a745;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .order-viewer-container {
    padding: 0.5rem;
  }

  .card-body {
    padding: 1rem;
  }

  .order-table {
    font-size: 0.85rem;
  }

  .order-table th,
  .order-table td {
    padding: 0.75rem 0.5rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .detail-value {
    text-align: left;
  }
}
</style>
