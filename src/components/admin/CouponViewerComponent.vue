<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCouponStore } from '@/stores/coupon_store.ts'
import type Coupon from '@/models/coupon.ts'

export default defineComponent({
  name: "CouponViewerComponent",
  data() {
    return {
      showDeleteModal: false,
      couponToDelete: null as number | null,
      couponCodeToDelete: "",
      backendError: "",
      successMessage: "",
      discountCategories: {
        percent: "Százalékos",
        fixed: "Fix összeg",
        free_item: "Ingyen termék",
        shipping: "Ingyen szállítás"
      }
    }
  },
  computed: {
    ...mapStores(useCouponStore),
    isLoading() {
      return this.couponStore.isLoading
    },
    coupons() {
      return this.couponStore.coupons
    }
  },
  async mounted() {
    await this.loadCoupons()
  },
  methods: {
    async loadCoupons() {
      this.backendError = ""
      try {
        await this.couponStore.loadCoupons()

        // Másolás a local state-be hogy Vue reaktívan kezelje
        this.localCoupons = JSON.parse(JSON.stringify(this.couponStore.coupons))

        // Force update
        this.$forceUpdate()
      } catch (error) {
        this.backendError = "Hiba történt a kuponok betöltésekor"
      }
    },
    openDeleteModal(id: number, code: string) {
      this.couponToDelete = id
      this.couponCodeToDelete = code
      this.showDeleteModal = true
      this.backendError = ""
      this.successMessage = ""
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.couponToDelete = null
      this.couponCodeToDelete = ""
    },
    async confirmDelete() {
      if (this.couponToDelete === null) return

      const result = await this.couponStore.deleteCoupon(this.couponToDelete)

      if (result.success) {
        this.successMessage = "Kupon sikeresen törölve!"
        this.closeDeleteModal()

        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      } else {
        this.backendError = result.message || "Hiba történt a kupon törlésekor"
      }
    },
    getCategoryLabel(category?: string): string {
      if (!category) return '-'
      return this.discountCategories[category as keyof typeof this.discountCategories] || category
    },
    getValueDisplay(coupon: Coupon): string {
      const category = coupon.discount_type_details?.discount_category
      const value = coupon.discount_type_details?.value

      if (!value) return '-'

      if (category === 'percent') {
        return `${value}%`
      } else if (category === 'fixed') {
        return `${value} Ft`
      } else if (category === 'free_item') {
        return 'Ingyen termék'
      } else if (category === 'shipping') {
        return 'Ingyen szállítás'
      }
      return value.toString()
    },
    formatDate(dateString?: string): string {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    isExpired(coupon: Coupon): boolean {
      return new Date(coupon.expiration_date) < new Date()
    },
    getUsedStatusClass(status: string): string {
      return status === 'used' ? 'status-used' : 'status-not-used'
    },
    getUsedStatusLabel(status: string): string {
      return status === 'used' ? 'Felhasznált' : 'Nem használt'
    },
    getScratchedStatusClass(status: string): string {
      return status === 'scratched' ? 'status-scratched' : 'status-not-scratched'
    },
    getScratchedStatusLabel(status: string): string {
      return status === 'scratched' ? 'Lekapart' : 'Nem lekapart'
    }
  }
})
</script>

<template>
  <div class="coupon-viewer-container">
    <div class="card">
      <div class="card-header">
        <h2>Kuponok</h2>
      </div>

      <div class="card-body">
        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <!-- Backend Error Message -->
        <div v-if="backendError" class="alert alert-error">
          {{ backendError }}
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Kuponok betöltése...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="coupons.length === 0" class="empty-state">
          <p>Még nincsenek létrehozott kuponok.</p>
        </div>

        <!-- Coupons Table -->
        <div v-else class="table-container">
          <table class="coupon-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kód</th>
                <th>Felhasználó</th>
                <th>Kedvezménytípus</th>
                <th>Kedvezmény</th>
                <th>Lejárat</th>
                <th>Használat</th>
                <th>Kaparás</th>
                <th>Felhasználva</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="coupon in coupons" :key="coupon.id" :class="{ 'expired-row': isExpired(coupon) }">
                <td>{{ coupon.id }}</td>
                <td class="coupon-code">
                  <span class="code-badge">{{ coupon.code }}</span>
                </td>
                <td>
                  <div class="user-info">
                    <span class="user-id">ID: {{ coupon.user }}</span>
                    <span v-if="coupon.user_name" class="user-name">{{ coupon.user_name }}</span>
                  </div>
                </td>
                <td>
                  <div class="type-cell">
                    <img
                      v-if="coupon.discount_type_details && coupon.discount_type_details.image"
                      :src="coupon.discount_type_details.image"
                      :alt="coupon.discount_type_details.name || 'Kupon kép'"
                      class="type-image"
                    />
                    <span class="type-name">
                      {{ coupon.discount_type_details && coupon.discount_type_details.name ? coupon.discount_type_details.name : '-' }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="badge">{{ getValueDisplay(coupon) }}</span>
                </td>
                <td :class="{ 'expired-date': isExpired(coupon) }">
                  {{ formatDate(coupon.expiration_date) }}
                  <span v-if="isExpired(coupon)" class="expired-label">LEJÁRT</span>
                </td>
                <td>
                  <span :class="['status-badge', getUsedStatusClass(coupon.status_used)]">
                    {{ getUsedStatusLabel(coupon.status_used) }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', getScratchedStatusClass(coupon.status_scratched)]">
                    {{ getScratchedStatusLabel(coupon.status_scratched) }}
                  </span>
                </td>
                <td>
                  {{ formatDate(coupon.used_date) }}
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      @click="openDeleteModal(coupon.id!, coupon.code)"
                      class="btn-delete"
                      title="Törlés"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Törlés megerősítése</h3>
          <button class="modal-close" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="modal-body">
          <p>Biztosan törölni szeretné a következő kupon?</p>
          <p class="coupon-code-highlight">{{ couponCodeToDelete }}</p>
          <p class="warning-text">Ez a művelet nem visszavonható!</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDeleteModal">
            Mégse
          </button>
          <button class="btn-confirm-delete" @click="confirmDelete" :disabled="isLoading">
            <span v-if="isLoading">Törlés...</span>
            <span v-else>Törlés</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coupon-viewer-container {
  margin: 2rem auto;
  padding: 1rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #FEA116 0%, #FF6B35 100%);
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
  overflow: auto;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FEA116;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
}

.coupon-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.coupon-table thead {
  background-color: #f8f9fa;
}

.coupon-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
}

.coupon-table tbody tr {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #e0e0e0;
}

.coupon-table tbody tr:hover {
  background-color: #f8f9fa;
}

.coupon-table tbody tr.expired-row {
  background-color: #fff3cd;
}

.coupon-table tbody tr.expired-row:hover {
  background-color: #ffe8a1;
}

.coupon-table td {
  padding: 1rem;
  vertical-align: middle;
}

.coupon-code {
  font-weight: 600;
}

.code-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-id {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.user-name {
  font-size: 0.85rem;
  color: #6c757d;
}

.type-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.type-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
}

.type-name {
  font-size: 0.9rem;
  color: #333;
}

.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #FEA116;
  color: #fff;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.expired-date {
  color: #dc3545;
  font-weight: 600;
}

.expired-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #dc3545;
  margin-top: 0.25rem;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-used {
  background-color: #6c757d;
  color: #fff;
}

.status-not-used {
  background-color: #28a745;
  color: #fff;
}

.status-scratched {
  background-color: #17a2b8;
  color: #fff;
}

.status-not-scratched {
  background-color: #ffc107;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #dc3545;
  color: #fff;
}

.btn-delete svg {
  display: block;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.modal-body p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.coupon-code-highlight {
  font-weight: 700;
  color: #333;
  font-size: 1.3rem;
  margin: 1rem 0;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #6c757d;
  color: #fff;
}

.btn-cancel:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-confirm-delete {
  background-color: #dc3545;
  color: #fff;
}

.btn-confirm-delete:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.btn-confirm-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .coupon-viewer-container {
    padding: 0.5rem;
  }

  .card-body {
    padding: 1rem;
  }

  .coupon-table {
    font-size: 0.85rem;
  }

  .coupon-table th,
  .coupon-table td {
    padding: 0.75rem 0.5rem;
  }

  .type-image {
    width: 35px;
    height: 35px;
  }

  .modal-content {
    width: 95%;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm-delete {
    width: 100%;
  }
}
</style>

