<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCouponStore } from '@/stores/coupon_store.ts'
import type DiscountType from '@/models/discount_type.ts'

export default defineComponent({
  name: "CouponTypeViewerComponent",
  data() {
    return {
      showDeleteModal: false,
      couponToDelete: null as number | null,
      couponNameToDelete: "",
      backendError: "",
      successMessage: "",
      discountCategories: {
        percent: "Százalékos kedvezmény",
        fixed: "Fix összegű kedvezmény",
        free_item: "Egy termék ingyen",
        shipping: "Ingyenes szállítás"
      }
    }
  },
  computed: {
    ...mapStores(useCouponStore),
    isLoading() {
      return this.couponStore.isLoading
    },
    couponTypes() {
      return this.couponStore.couponTypes
    }
  },
  async mounted() {
    await this.loadCoupons()
  },
  methods: {
    async loadCoupons() {
      this.backendError = ""
      try {
        await this.couponStore.loadDiscountTypes()
      } catch (error) {
        this.backendError = "Hiba történt a kupontípusok betöltésekor"
      }
    },
    openDeleteModal(id: number, name: string) {
      this.couponToDelete = id
      this.couponNameToDelete = name
      this.showDeleteModal = true
      this.backendError = ""
      this.successMessage = ""
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.couponToDelete = null
      this.couponNameToDelete = ""
    },
    async confirmDelete() {
      if (this.couponToDelete === null) return

      const result = await this.couponStore.deleteDiscountType(this.couponToDelete)

      if (result.success) {
        this.successMessage = "Kupontípus sikeresen törölve!"
        this.closeDeleteModal()

        // Success message eltűntetése 3 másodperc után
        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      } else {
        this.backendError = result.message || "Hiba történt a kupontípus törlésekor"
      }
    },
    getCategoryLabel(category: string): string {
      return this.discountCategories[category as keyof typeof this.discountCategories] || category
    },
    getValueDisplay(coupon: DiscountType): string {
      if (coupon.discount_category === 'percent') {
        return `${coupon.value}%`
      } else if (coupon.discount_category === 'fixed') {
        return `${coupon.value} Ft`
      } else if (coupon.discount_category === 'free_item') {
        return 'Ingyen termék'
      } else if (coupon.discount_category === 'shipping') {
        return 'Ingyen szállítás'
      }
      return coupon.value.toString()
    }
  }
})
</script>

<template>
  <div class="coupon-viewer-container">
    <div class="card">
      <div class="card-header">
        <h2>Kedvezménytípusok</h2>
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
          <p>Kupontípusok betöltése...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="couponTypes.length === 0" class="empty-state">
          <p>Még nincsenek létrehozott kedvezménytípusok.</p>
        </div>

        <!-- Coupon Types Table -->
        <div v-else class="table-container">
          <table class="coupon-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kép</th>
                <th>Név</th>
                <th>Leírás</th>
                <th>Típus</th>
                <th>Érték</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="coupon in couponTypes" :key="coupon.id">
                <td>{{ coupon.id }}</td>
                <td>
                  <div class="image-cell">
                    <img
                      v-if="coupon.image"
                      :src="coupon.image"
                      :alt="coupon.name"
                      class="coupon-image"
                    />
                    <span v-else class="no-image">Nincs kép</span>
                  </div>
                </td>
                <td class="coupon-name">{{ coupon.name }}</td>
                <td class="coupon-description">
                  {{ coupon.description || '-' }}
                </td>
                <td>
                  <span class="badge">{{ getCategoryLabel(coupon.discount_category) }}</span>
                </td>
                <td class="coupon-value">{{ getValueDisplay(coupon) }}</td>
                <td>
                  <button
                    @click="openDeleteModal(coupon.id!, coupon.name)"
                    class="btn-delete"
                    title="Törlés"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
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
          <p>Biztosan törölni szeretné a következő kedvezménytípust?</p>
          <p class="coupon-name-highlight">{{ couponNameToDelete }}</p>
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
  max-width: 1300px;
  margin: 2rem auto;
  padding: 1rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 820px;
  display: flex;
  overflow: auto;
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

.coupon-table td {
  padding: 1rem;
  vertical-align: middle;
}

.image-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.no-image {
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #999;
  font-size: 0.75rem;
}

.coupon-name {
  font-weight: 600;
  color: #333;
}

.coupon-description {
  max-width: 300px;
  color: #666;
  font-size: 0.9rem;
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

.coupon-value {
  font-weight: 600;
  color: #FEA116;
  font-size: 1.1rem;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.btn-delete svg {
  display: block;
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

.coupon-name-highlight {
  font-weight: 600;
  color: #333;
  font-size: 1.2rem;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 6px;
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
    font-size: 0.9rem;
  }

  .coupon-table th,
  .coupon-table td {
    padding: 0.75rem 0.5rem;
  }

  .coupon-image,
  .no-image {
    width: 50px;
    height: 50px;
    line-height: 50px;
  }

  .coupon-description {
    max-width: 200px;
    font-size: 0.85rem;
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
