<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCouponStore } from '@/stores/coupon_store.ts'
import ScratchCardComponent from '@/components/ScratchCardComponent.vue'
import type { Coupon } from '@/types/coupon.ts'

export default defineComponent({
  name: 'UserCouponViewerComponent',
  components: {
    ScratchCardComponent,
  },
  data() {
    return {
      backendError: '',
      scratchingCoupon: null as Coupon | null,
      discountCategories: {
        percent: 'Százalékos',
        fixed: 'Fix összeg',
        shipping: 'Ingyen szállítás',
      },
    }
  },
  computed: {
    ...mapStores(useCouponStore),
    isLoading() {
      return this.couponStore.isLoading
    },
    coupons() {
      return this.couponStore.coupons
    },
    unscratchedCoupons() {
      return this.couponStore.getUnscratchedCoupons
    },
    scratchedCoupons() {
      return this.couponStore.getScratchedCoupons
    },
  },
  async mounted() {
    await this.adminLoadCoupons()
  },
  methods: {
    async adminLoadCoupons() {
      this.backendError = ''
      try {
        await this.couponStore.loadUserCoupons()
      } catch (error) {
        this.backendError = 'Hiba történt a kuponok betöltésekor'
      }
    },
    openScratchCard(coupon: Coupon) {
      this.scratchingCoupon = coupon
    },
    async onScratched(id: number) {
      const coupon = this.coupons.find((c) => c.id === id)
      if (coupon) {
        await this.couponStore.scratchCoupon(coupon.code)
      }
    },
    onScratchClosed() {
      this.scratchingCoupon = null
    },
    getValueDisplay(coupon: Coupon): string {
      const category = coupon.discount_type_details?.discount_category
      const value = coupon.discount_type_details?.value
      if (!value) return '-'
      if (category === 'percent') return `${value}%`
      if (category === 'fixed') return `${value} Ft`
      if (category === 'shipping') return 'Ingyen szállítás'
      return value.toString()
    },
    formatDate(dateString?: string): string {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
    isExpired(coupon: Coupon): boolean {
      return new Date(coupon.expiration_date) < new Date()
    },
  },
})
</script>

<template>
  <div class="coupon-viewer-container">
    <div class="card">
      <div class="card-header">
        <h2>Kuponjaim</h2>
      </div>

      <div class="card-body">
        <!-- Backend hiba -->
        <div v-if="backendError" class="alert alert-error">
          {{ backendError }}
        </div>

        <!-- Töltés -->
        <div v-if="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Kuponok betöltése...</p>
        </div>

        <template v-else>
          <!-- Lekaparatlan kuponok -->
          <div class="section">
            <h3 class="section-title">
              <i class="fas fa-ticket-alt"></i>
              Lekaparatlan kuponok
              <span class="badge-count">{{ unscratchedCoupons.length }}</span>
            </h3>

            <div v-if="unscratchedCoupons.length === 0" class="empty-state">
              <p>Nincs lekaparatlan kuponed.</p>
            </div>

            <div v-else class="table-container">
              <table class="coupon-table">
                <thead>
                  <tr>
                    <th>Kupon típusa</th>
                    <th>Kód</th>
                    <th>Lejárat</th>
                    <th>Lekaparás</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="coupon in unscratchedCoupons"
                    :key="coupon.id"
                    :class="{ 'expired-row': isExpired(coupon) }"
                  >
                    <td>
                      <div class="type-cell">
                        <img
                          v-if="coupon.discount_type_details?.image"
                          :src="coupon.discount_type_details.image"
                          :alt="coupon.discount_type_details.name"
                          class="type-image"
                        />
                        <div v-else class="type-image-placeholder">
                          <i class="fas fa-gift"></i>
                        </div>
                        <span class="type-name">{{
                          coupon.discount_type_details?.name || 'Ismeretlen kupon'
                        }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="code-badge">{{ coupon.code }}</span>
                    </td>
                    <td :class="{ 'expired-date': isExpired(coupon) }">
                      {{ formatDate(coupon.expiration_date) }}
                      <span v-if="isExpired(coupon)" class="expired-label">LEJÁRT</span>
                    </td>
                    <td>
                      <button
                        class="btn-scratch"
                        @click="openScratchCard(coupon)"
                        :disabled="isExpired(coupon)"
                      >
                        <i class="fas fa-hand-pointer"></i>
                        Lekaparás
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Lekapart kuponok -->
          <div class="section">
            <h3 class="section-title">
              <i class="fas fa-tags"></i>
              Lekapart kuponok
              <span class="badge-count">{{ scratchedCoupons.length }}</span>
            </h3>

            <div v-if="scratchedCoupons.length === 0" class="empty-state">
              <p>Még nem kaparthál le egyet sem.</p>
            </div>

            <div v-else class="table-container">
              <table class="coupon-table">
                <thead>
                  <tr>
                    <th>Kupon típusa</th>
                    <th>Kedvezmény</th>
                    <th>Kód</th>
                    <th>Lejárat</th>
                    <th>Státusz</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="coupon in scratchedCoupons"
                    :key="coupon.id"
                    :class="{ 'expired-row': isExpired(coupon), 'used-row': coupon.is_used }"
                  >
                    <td>
                      <div class="type-cell">
                        <img
                          v-if="coupon.discount_type_details?.image"
                          :src="coupon.discount_type_details.image"
                          :alt="coupon.discount_type_details.name"
                          class="type-image"
                        />
                        <div v-else class="type-image-placeholder">
                          <i class="fas fa-gift"></i>
                        </div>
                        <span class="type-name">{{
                          coupon.discount_type_details?.name || 'Ismeretlen kupon'
                        }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge">{{ getValueDisplay(coupon) }}</span>
                    </td>
                    <td>
                      <span class="code-badge">{{ coupon.code }}</span>
                    </td>
                    <td :class="{ 'expired-date': isExpired(coupon) }">
                      {{ formatDate(coupon.expiration_date) }}
                      <span v-if="isExpired(coupon)" class="expired-label">LEJÁRT</span>
                    </td>
                    <td>
                      <span v-if="coupon.is_used" class="status-badge status-used">
                        <i class="fas fa-check"></i> Felhasználva
                      </span>
                      <span v-else-if="isExpired(coupon)" class="status-badge status-expired">
                        <i class="fas fa-times"></i> Lejárt
                      </span>
                      <span v-else class="status-badge status-available">
                        <i class="fas fa-star"></i> Felhasználható
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ScratchCard popup -->
    <transition name="popup-fade">
      <ScratchCardComponent
        v-if="scratchingCoupon && scratchingCoupon.id"
        :coupon-id="scratchingCoupon.id!"
        :coupon-image="(scratchingCoupon.discount_type_details as any)?.image ?? ''"
        @scratched="onScratched"
        @closed="onScratchClosed"
      />
    </transition>
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
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #fea116 0%, #ff6b35 100%);
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
  border-top: 4px solid #fea116;
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
  border-bottom: 2px solid #fea116;
  padding-bottom: 0.5rem;
}

.section-title i {
  color: #fea116;
}

.badge-count {
  background: #fea116;
  color: white;
  border-radius: 12px;
  padding: 0.1rem 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 1rem;
}

.table-container {
  overflow-x: auto;
}

.coupon-table {
  width: 100%;
  border-collapse: collapse;
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

.coupon-table tbody tr.used-row {
  opacity: 0.7;
}

.coupon-table td {
  padding: 1rem;
  vertical-align: middle;
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

.type-image-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fea116, #ff6b35);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.type-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
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

.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #fea116;
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
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-available {
  background-color: #28a745;
  color: #fff;
}

.status-used {
  background-color: #6c757d;
  color: #fff;
}

.status-expired {
  background-color: #dc3545;
  color: #fff;
}

.btn-scratch {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fea116, #ff6b35);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-scratch:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 161, 22, 0.4);
}

.btn-scratch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
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
}
</style>
