<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCouponStore } from '@/stores/coupon_store.ts'

export default defineComponent({
  name: "CouponCreaterComponent",
  data() {
    return {
      userId: "",
      discountType: "",
      expirationDate: "",
      errors: {
        userId: "",
        discountType: "",
        expirationDate: ""
      },
      backendError: "",
      successMessage: "",
      generatedCode: ""
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
    await this.loadDiscountTypes()
  },
  methods: {
    async loadDiscountTypes() {
      try {
        await this.couponStore.loadDiscountTypes()
      } catch (error) {
        this.backendError = "Hiba történt a kedvezménytípusok betöltésekor"
      }
    },
    clearErrors() {
      this.errors = {
        userId: "",
        discountType: "",
        expirationDate: ""
      }
      this.backendError = ""
      this.successMessage = ""
      this.generatedCode = ""
    },
    validateForm(): boolean {
      this.clearErrors()
      let isValid = true

      // Konvertáljuk string-gé, ha szám
      const userIdStr = String(this.userId || "").trim()

      if (userIdStr.length === 0) {
        this.errors.userId = "Kérjük, adja meg a felhasználó ID-t!"
        isValid = false
      } else {
        const numValue = parseInt(userIdStr)
        if (isNaN(numValue) || numValue <= 0) {
          this.errors.userId = "Kérjük, adjon meg egy érvényes pozitív számot!"
          isValid = false
        }
      }

      if (this.discountType.length === 0) {
        this.errors.discountType = "Kérjük, válasszon kedvezménytípust!"
        isValid = false
      }

      if (this.expirationDate.length === 0) {
        this.errors.expirationDate = "Kérjük, adja meg a lejárati dátumot!"
        isValid = false
      } else {
        const expDate = new Date(this.expirationDate)
        const now = new Date()
        if (expDate <= now) {
          this.errors.expirationDate = "A lejárati dátum a jövőben kell legyen!"
          isValid = false
        }
      }

      return isValid
    },
    resetForm() {
      this.userId = ""
      this.discountType = ""
      this.expirationDate = ""
      this.clearErrors()
    },
    async createCoupon() {
      if (!this.validateForm()) {
        return
      }

      this.clearErrors()

      const couponData = {
        user: parseInt(String(this.userId)),
        discount_type: parseInt(String(this.discountType)),
        expiration_date: new Date(this.expirationDate).toISOString()
        // tobbi mezo
      }

      const result = await this.couponStore.createCoupon(couponData)

      if (result.success) {
        this.generatedCode = result.data?.code || ""
        this.successMessage = `Kupon sikeresen létrehozva! Kód: ${this.generatedCode}`
        console.log("Kupon létrehozva:", result.data)

        setTimeout(() => {
          this.resetForm()
        }, 5000)
      } else {
        this.backendError = result.message || "Hiba történt a kupon létrehozásakor"
      }
    }
  }
})
</script>

<template>
  <div class="coupon-creator-container">
    <div class="card">
      <div class="card-header">
        <h2>Új Kupon Létrehozása</h2>
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

        <form @submit.prevent="createCoupon" class="coupon-form">
          <!-- User ID -->
          <div class="form-group">
            <label for="userId">Felhasználó ID <span class="required">*</span></label>
            <input
              type="number"
              id="userId"
              v-model="userId"
              :class="{ 'error-input': errors.userId }"
              placeholder="Pl. 1"
              min="1"
            />
            <span v-if="errors.userId" class="error-message">{{ errors.userId }}</span>
            <span class="hint-text">A kupon ehhez a felhasználóhoz lesz rendelve</span>
          </div>

          <!-- Discount Type -->
          <div class="form-group">
            <label for="discountType">Kedvezménytípus <span class="required">*</span></label>
            <select
              id="discountType"
              v-model="discountType"
              :class="{ 'error-input': errors.discountType }"
            >
              <option value="" disabled>Válasszon egy kedvezménytípust...</option>
              <option
                v-for="type in couponTypes"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }} ({{ type.discount_category === 'percent' ? type.value + '%' : type.value + ' Ft' }})
              </option>
            </select>
            <span v-if="errors.discountType" class="error-message">{{ errors.discountType }}</span>
          </div>

          <!-- Expiration Date -->
          <div class="form-group">
            <label for="expirationDate">
              Lejárati dátum
              <span class="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="expirationDate"
              v-model="expirationDate"
              :class="{ 'error-input': errors.expirationDate }"
            />
            <span v-if="errors.expirationDate" class="error-message">{{ errors.expirationDate }}</span>
          </div>

          <!-- Generated Code Display -->
          <div v-if="generatedCode" class="generated-code-box">
            <div class="code-label">Generált kuponkód:</div>
            <div class="code-display">{{ generatedCode }}</div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Létrehozás...</span>
              <span v-else>Kupon létrehozása</span>
            </button>
            <button type="button" class="btn-secondary" @click="resetForm" :disabled="isLoading">
              Mezők törlése
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coupon-creator-container {
  max-width: 800px;
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

.coupon-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
}

.hint {
  font-weight: normal;
  color: #6c757d;
  font-size: 0.9rem;
}

.hint-text {
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="datetime-local"],
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group input[type="datetime-local"]:focus,
.form-group select:focus {
  outline: none;
  border-color: #FEA116;
  box-shadow: 0 0 0 3px rgba(254, 161, 22, 0.1);
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 12px;
  padding-right: 2.5rem;
}

.error-input {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  font-weight: 500;
}

.generated-code-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  animation: slideDown 0.5s ease-out;
}

.code-label {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.code-display {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #FEA116 0%, #FF6B35 100%);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 161, 22, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .coupon-creator-container {
    padding: 0.5rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .code-display {
    font-size: 1.4rem;
    letter-spacing: 2px;
  }
}
</style>

