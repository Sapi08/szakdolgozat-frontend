<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useOrderStore } from '@/stores/order_store'
import { OrderModel } from '@/models/order'

export default defineComponent({
  name: "OrdersView",
  data() {
    return {
      selectedOrder: null as OrderModel | null,
      showOrderDetails: false,
      autoRefresh: true,
      refreshInterval: null as number | null,
      lastOrderCount: 0,
      filterStatus: 'all' as string,
    }
  },
  computed: {
    ...mapStores(useOrderStore),
    filteredOrders(): OrderModel[] {
      if (this.filterStatus === 'all') {
        return this.orderStore.orders
      }
      return this.orderStore.orders.filter(order => order.status === this.filterStatus)
    },
    statusCounts() {
      return {
        pending: this.orderStore.pendingOrders.length,
        accepted: this.orderStore.acceptedOrders.length,
        preparing: this.orderStore.preparingOrders.length,
        ready: this.orderStore.readyOrders.length,
        in_delivery: this.orderStore.inDeliveryOrders.length,
        delivered: this.orderStore.deliveredOrders.length,
        completed: this.orderStore.completedOrders.length,
        canceled: this.orderStore.canceledOrders.length,
      }
    }
  },
  async mounted() {
    await this.loadOrders()
    this.lastOrderCount = this.orderStore.orders.length

    // Auto-refresh beállítása (30 másodpercenként)
    if (this.autoRefresh) {
      this.startAutoRefresh()
    }
  },
  beforeUnmount() {
    this.stopAutoRefresh()
  },
  methods: {
    async loadOrders() {
      await this.orderStore.fetchOrders()
      this.checkForNewOrders()
    },
    checkForNewOrders() {
      const currentCount = this.orderStore.orders.length
      if (currentCount > this.lastOrderCount) {
        // Új rendelés érkezett
        this.orderStore.playNotificationSound()
        this.showNotification('Új rendelés érkezett!', 'success')
      }
      this.lastOrderCount = currentCount
    },
    startAutoRefresh() {
      this.refreshInterval = window.setInterval(() => {
        if (this.autoRefresh) {
          this.loadOrders()
        }
      }, 30000) // 30 másodperc
    },
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }
    },
    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh
      if (this.autoRefresh) {
        this.startAutoRefresh()
      } else {
        this.stopAutoRefresh()
      }
    },
    viewOrderDetails(order: OrderModel) {
      this.selectedOrder = order
      this.showOrderDetails = true
    },
    closeOrderDetails() {
      this.showOrderDetails = false
      this.selectedOrder = null
    },
    async acceptOrder(orderId: number) {
      const result = await this.orderStore.acceptOrder(orderId)
      if (result.success) {
        this.showNotification('Rendelés elfogadva!', 'success')
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.selectedOrder = result.order!
        }
      } else {
        this.showNotification(result.message || 'Hiba történt', 'error')
      }
    },
    async updateStatus(orderId: number, newStatus: OrderModel['status']) {
      const result = await this.orderStore.updateOrderStatus(orderId, newStatus)
      if (result.success) {
        this.showNotification('Státusz sikeresen frissítve!', 'success')
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.selectedOrder = result.order!
        }
      } else {
        this.showNotification(result.message || 'Hiba történt', 'error')
      }
    },
    async deleteOrder(orderId: number) {
      if (!confirm('Biztosan törölni szeretné ezt a rendelést?')) {
        return
      }

      const result = await this.orderStore.deleteOrder(orderId)
      if (result.success) {
        this.showNotification('Rendelés törölve!', 'success')
        this.closeOrderDetails()
      } else {
        this.showNotification(result.message || 'Hiba történt', 'error')
      }
    },
    showNotification(message: string, _type: 'success' | 'error') {
      // Egyszerű notification - később ezt is lehet fejleszteni
      alert(message)
    },
    formatDate(dateString: string) {
      const date = new Date(dateString)
      return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatPrice(price: number) {
      return price.toFixed(0) + ' Ft'
    },
    getStatusIcon(status: OrderModel['status']) {
      const icons: Record<OrderModel['status'], string> = {
        pending: 'clock',
        accepted: 'check-circle',
        preparing: 'utensils',
        ready: 'box',
        in_delivery: 'shipping-fast',
        delivered: 'truck',
        completed: 'check-double',
        canceled: 'times-circle'
      }
      return icons[status]
    }
  }
})
</script>

<template>
  <div class="orders-view">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-shopping-bag me-3"></i>
        Rendelések Kezelése
      </h1>
      <div class="header-actions">
        <button
          @click="loadOrders"
          class="btn btn-outline-primary"
          :disabled="orderStore.loading"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': orderStore.loading }"></i>
          Frissítés
        </button>
        <button
          @click="toggleAutoRefresh"
          class="btn"
          :class="autoRefresh ? 'btn-success' : 'btn-outline-secondary'"
        >
          <i class="fas" :class="autoRefresh ? 'fa-pause' : 'fa-play'"></i>
          {{ autoRefresh ? 'Auto-frissítés BE' : 'Auto-frissítés KI' }}
        </button>
      </div>
    </div>

    <!-- Státusz filter -->
    <div class="status-filter-bar">
      <button
        @click="filterStatus = 'all'"
        class="status-filter-btn"
        :class="{ active: filterStatus === 'all' }"
      >
        <span class="filter-label">Összes</span>
        <span class="filter-count">{{ orderStore.orders.length }}</span>
      </button>
      <button
        @click="filterStatus = 'pending'"
        class="status-filter-btn status-pending"
        :class="{ active: filterStatus === 'pending' }"
      >
        <i class="fas fa-clock me-2"></i>
        <span class="filter-label">Függőben</span>
        <span class="filter-count">{{ statusCounts.pending }}</span>
      </button>
      <button
        @click="filterStatus = 'accepted'"
        class="status-filter-btn status-accepted"
        :class="{ active: filterStatus === 'accepted' }"
      >
        <i class="fas fa-check-circle me-2"></i>
        <span class="filter-label">Elfogadva</span>
        <span class="filter-count">{{ statusCounts.accepted }}</span>
      </button>
      <button
        @click="filterStatus = 'preparing'"
        class="status-filter-btn status-preparing"
        :class="{ active: filterStatus === 'preparing' }"
      >
        <i class="fas fa-utensils me-2"></i>
        <span class="filter-label">Készítés alatt</span>
        <span class="filter-count">{{ statusCounts.preparing }}</span>
      </button>
      <button
        @click="filterStatus = 'ready'"
        class="status-filter-btn status-ready"
        :class="{ active: filterStatus === 'ready' }"
      >
        <i class="fas fa-box me-2"></i>
        <span class="filter-label">Kész</span>
        <span class="filter-count">{{ statusCounts.ready }}</span>
      </button>
      <button
        @click="filterStatus = 'in_delivery'"
        class="status-filter-btn status-in-delivery"
        :class="{ active: filterStatus === 'in_delivery' }"
      >
        <i class="fas fa-shipping-fast me-2"></i>
        <span class="filter-label">Szállítás alatt</span>
        <span class="filter-count">{{ statusCounts.in_delivery }}</span>
      </button>
      <button
        @click="filterStatus = 'delivered'"
        class="status-filter-btn status-delivered"
        :class="{ active: filterStatus === 'delivered' }"
      >
        <i class="fas fa-truck me-2"></i>
        <span class="filter-label">Kiszállítva</span>
        <span class="filter-count">{{ statusCounts.delivered }}</span>
      </button>
      <button
        @click="filterStatus = 'completed'"
        class="status-filter-btn status-completed"
        :class="{ active: filterStatus === 'completed' }"
      >
        <i class="fas fa-check-double me-2"></i>
        <span class="filter-label">Lezárva</span>
        <span class="filter-count">{{ statusCounts.completed }}</span>
      </button>
    </div>

    <!-- Rendelések lista -->
    <div v-if="orderStore.loading && orderStore.orders.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
      <p class="mt-3">Rendelések betöltése...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <i class="fas fa-inbox fa-3x mb-3"></i>
      <h3>Nincs megjeleníthető rendelés</h3>
      <p>{{ filterStatus === 'all' ? 'Még nem érkezett rendelés.' : 'Nincs ilyen státuszú rendelés.' }}</p>
    </div>

    <div v-else class="orders-grid">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        @click="viewOrderDetails(order)"
      >
        <div class="order-card-header">
          <div class="order-id">
            <i class="fas fa-hashtag"></i>
            {{ order.id }}
          </div>
          <div class="order-status-badge" :style="{ backgroundColor: order.getStatusColor() }">
            <i class="fas" :class="`fa-${getStatusIcon(order.status)}`"></i>
            {{ order.getStatusLabel() }}
          </div>
        </div>

        <div class="order-card-body">
          <div class="order-info-row">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="order-info-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ order.delivery_address.substring(0, 50) }}...</span>
          </div>
          <div class="order-info-row">
            <i class="fas fa-phone"></i>
            <span>{{ order.delivery_phone }}</span>
          </div>
          <div class="order-info-row">
            <i class="fas fa-utensils"></i>
            <span>{{ order.items.length }} tétel</span>
          </div>
        </div>

        <div class="order-card-footer">
          <div class="order-total">
            <span class="total-label">Összeg:</span>
            <span class="total-amount">{{ formatPrice(order.total_price) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rendelés részletek modal -->
    <div v-if="showOrderDetails && selectedOrder" class="modal-overlay" @click="closeOrderDetails">
      <div class="modal-content order-details-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-receipt me-2"></i>
            Rendelés #{{ selectedOrder.id }}
          </h3>
          <button @click="closeOrderDetails" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Státusz -->
          <div class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Státusz
            </h5>
            <div class="status-badge-large" :style="{ backgroundColor: selectedOrder.getStatusColor() }">
              <i class="fas" :class="`fa-${getStatusIcon(selectedOrder.status)}`"></i>
              {{ selectedOrder.getStatusLabel() }}
            </div>
            <div class="status-actions mt-3">
              <button
                v-if="selectedOrder.status === 'pending'"
                @click="acceptOrder(selectedOrder.id)"
                class="btn btn-sm btn-success"
              >
                <i class="fas fa-check"></i> Elfogadás
              </button>
              <button
                v-if="selectedOrder.status === 'accepted'"
                @click="updateStatus(selectedOrder.id, 'preparing')"
                class="btn btn-sm btn-warning"
              >
                <i class="fas fa-utensils"></i> Készítés megkezdése
              </button>
              <button
                v-if="selectedOrder.status === 'preparing'"
                @click="updateStatus(selectedOrder.id, 'ready')"
                class="btn btn-sm btn-info"
              >
                <i class="fas fa-box"></i> Kész
              </button>
              <button
                v-if="selectedOrder.status === 'ready'"
                @click="updateStatus(selectedOrder.id, 'in_delivery')"
                class="btn btn-sm btn-primary"
              >
                <i class="fas fa-shipping-fast"></i> Szállítás megkezdése
              </button>
              <button
                v-if="selectedOrder.status === 'in_delivery'"
                @click="updateStatus(selectedOrder.id, 'delivered')"
                class="btn btn-sm btn-secondary"
              >
                <i class="fas fa-truck"></i> Kiszállítva
              </button>
              <button
                v-if="selectedOrder.status === 'delivered'"
                @click="updateStatus(selectedOrder.id, 'completed')"
                class="btn btn-sm btn-dark"
              >
                <i class="fas fa-check-double"></i> Lezárás
              </button>
              <button
                v-if="selectedOrder.status !== 'canceled' && selectedOrder.status !== 'completed'"
                @click="deleteOrder(selectedOrder.id)"
                class="btn btn-sm btn-danger"
              >
                <i class="fas fa-times"></i> Törlés
              </button>
            </div>
          </div>

          <!-- Rendelés adatai -->
          <div class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Rendelés információk
            </h5>
            <p><strong>Rendelésszám:</strong> {{ selectedOrder.order_number }}</p>
            <p><strong>Típus:</strong> {{ selectedOrder.delivery_type === 'delivery' ? 'Házhoz szállítás' : 'Személyes átvétel' }}</p>
            <p><strong>Fizetés:</strong> {{ selectedOrder.payment_method }}</p>
            <p><strong>Fizetés státusz:</strong> {{ selectedOrder.payment_status }}</p>
          </div>

          <!-- Időpontok -->
          <div class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-clock me-2"></i>
              Időpontok
            </h5>
            <p><strong>Leadva:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
            <p v-if="selectedOrder.accepted_at"><strong>Elfogadva:</strong> {{ formatDate(selectedOrder.accepted_at) }}</p>
            <p v-if="selectedOrder.completed_at"><strong>Lezárva:</strong> {{ formatDate(selectedOrder.completed_at) }}</p>
          </div>

          <!-- Szállítási cím -->
          <div class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-map-marker-alt me-2"></i>
              {{ selectedOrder.delivery_type === 'delivery' ? 'Szállítási cím' : 'Kapcsolattartó' }}
            </h5>
            <p><strong>Név:</strong> {{ selectedOrder.delivery_name }}</p>
            <p><strong>Telefon:</strong> {{ selectedOrder.delivery_phone }}</p>
            <p v-if="selectedOrder.delivery_type === 'delivery'" class="address-text">
              {{ selectedOrder.delivery_address }}, {{ selectedOrder.delivery_city }} {{ selectedOrder.delivery_zip }}
            </p>
          </div>

          <!-- Megjegyzés -->
          <div v-if="selectedOrder.comment" class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-comment me-2"></i>
              Megjegyzés
            </h5>
            <p>{{ selectedOrder.comment }}</p>
          </div>

          <!-- Admin megjegyzés -->
          <div v-if="selectedOrder.admin_note" class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-sticky-note me-2"></i>
              Admin megjegyzés
            </h5>
            <p>{{ selectedOrder.admin_note }}</p>
          </div>

          <!-- Kupon -->
          <div v-if="selectedOrder.coupon" class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-tag me-2"></i>
              Kupon
            </h5>
            <p class="coupon-code">{{ selectedOrder.coupon.code || 'Kupon alkalmazva' }}</p>
          </div>

          <!-- Tételek -->
          <div class="detail-section">
            <h5 class="section-title">
              <i class="fas fa-utensils me-2"></i>
              Rendelt tételek
            </h5>
            <div class="order-items-list">
              <div v-for="(item, index) in selectedOrder.items" :key="index" class="order-item-row">
                <div class="item-info">
                  <span class="item-name">{{ item.dish_name || `Étel #${item.dish}` }}</span>
                  <span class="item-variant" v-if="item.variant_detail">{{ item.variant_detail }}</span>
                  <span class="item-variant" v-if="item.special_request" style="color: #e86a61;">
                    <i class="fas fa-star me-1"></i>{{ item.special_request }}
                  </span>
                </div>
                <div class="item-quantity">{{ item.quantity }} db</div>
                <div class="item-price" v-if="item.unit_price">{{ formatPrice(item.unit_price * item.quantity) }}</div>
                <div class="item-price" v-else-if="item.total_price">{{ formatPrice(item.total_price) }}</div>
              </div>
            </div>
          </div>

          <!-- Összesen -->
          <div class="detail-section">
            <div class="price-breakdown">
              <div class="price-row">
                <span>Eredeti ár:</span>
                <span>{{ formatPrice(selectedOrder.original_price) }}</span>
              </div>
              <div class="price-row" v-if="selectedOrder.discount_amount > 0">
                <span>Kedvezmény:</span>
                <span class="text-success">-{{ formatPrice(selectedOrder.discount_amount) }}</span>
              </div>
              <div class="price-row" v-if="selectedOrder.delivery_fee > 0">
                <span>Szállítási díj:</span>
                <span>{{ formatPrice(selectedOrder.delivery_fee) }}</span>
              </div>
            </div>
            <div class="order-total-large">
              <span class="total-label">Végösszeg:</span>
              <span class="total-amount">{{ formatPrice(selectedOrder.total_price) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="deleteOrder(selectedOrder.id)" class="btn btn-danger">
            <i class="fas fa-trash me-2"></i>
            Rendelés törlése
          </button>
          <button @click="closeOrderDetails" class="btn btn-secondary">
            <i class="fas fa-times me-2"></i>
            Bezárás
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #f0f0f0;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions .btn {
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Status Filter Bar */
.status-filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding: 10px 0;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  white-space: nowrap;
}

.status-filter-btn:hover {
  border-color: #fbaf32;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-filter-btn.active {
  background: #fbaf32;
  border-color: #fbaf32;
  color: white;
}

.filter-label {
  font-size: 14px;
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  height: 25px;
  padding: 0 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}

.status-filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Status Colors */
.status-pending { border-left: 4px solid #ffc107; }
.status-accepted { border-left: 4px solid #17a2b8; }
.status-preparing { border-left: 4px solid #fd7e14; }
.status-ready { border-left: 4px solid #28a745; }
.status-in-delivery { border-left: 4px solid #9c27b0; }
.status-delivered { border-left: 4px solid #607d8b; }
.status-completed { border-left: 4px solid #4caf50; }

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.order-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #fbaf32;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #e0e0e0;
}

.order-id {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.order-status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-card-body {
  padding: 20px;
}

.order-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.order-info-row i {
  width: 20px;
  color: #fbaf32;
}

.order-card-footer {
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 2px solid #e0e0e0;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

.total-amount {
  font-size: 22px;
  font-weight: 800;
  color: #e86a61;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  color: #ddd;
}

.empty-state h3 {
  margin: 20px 0 10px;
  color: #666;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.order-details-modal {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-content {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #fbaf32 0%, #ff9a3c 100%);
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 25px;
  overflow-y: auto;
  flex: 1;
}

.detail-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.status-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 25px;
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.status-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-actions .btn {
  flex: 1;
  min-width: 150px;
}

.address-text {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #fbaf32;
}

.coupon-code {
  display: inline-block;
  background: #fff3cd;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  color: #856404;
  border: 2px dashed #ffc107;
}

.price-breakdown {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 16px;
  color: #666;
}

.price-row:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #fbaf32;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #333;
}

.item-variant {
  font-size: 13px;
  color: #666;
}

.item-quantity {
  font-weight: 600;
  color: #666;
  margin: 0 20px;
}

.item-price {
  font-weight: 700;
  color: #e86a61;
  font-size: 16px;
}

.order-total-large {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
  border-radius: 10px;
}

.order-total-large .total-label {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.order-total-large .total-amount {
  font-size: 32px;
  font-weight: 800;
  color: #e86a61;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 25px;
  border-top: 2px solid #f0f0f0;
  background: #fafafa;
}

.modal-footer .btn {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }

  .status-filter-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
