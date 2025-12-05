<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCouponStore } from '@/stores/coupon_store.ts'

export default defineComponent({
  name: "CouponTypeCreaterComponent",
  data() {
    return {
      name: "",
      description: "",
      imageFile: null as File | null,
      discountCategory: "",
      value: "",
      errors: {
        name: "",
        discountCategory: "",
        value: ""
      },
      backendError: "",
      successMessage: "",
      discountCategories: [
        { value: "percent", label: "Százalékos kedvezmény" },
        { value: "fixed", label: "Fix összegű kedvezmény" },
        { value: "free_item", label: "Egy termék ingyen" },
        { value: "shipping", label: "Ingyenes szállítás" }
      ]
    }
  },
  computed: {
    ...mapStores(useCouponStore),
    isLoading() {
      return this.couponStore.isLoading
    }
  },
  methods: {
    clearErrors() {
      this.errors = {
        name: "",
        discountCategory: "",
        value: ""
      }
      this.backendError = ""
      this.successMessage = ""
    },
    validateForm(): boolean {
      this.clearErrors()
      let isValid = true

      if (this.name.trim().length === 0) {
        this.errors.name = "Kérjük, adja meg a kupon nevét!"
        isValid = false
      }

      if (this.discountCategory.length === 0) {
        this.errors.discountCategory = "Kérjük, válasszon kedvezmény kategóriát!"
        isValid = false
      }

      if (this.value.length === 0) {
        this.errors.value = "Kérjük, adja meg az értéket!"
        isValid = false
      } else {
        const numValue = parseFloat(this.value)
        if (isNaN(numValue) || numValue <= 0) {
          this.errors.value = "Kérjük, adjon meg egy érvényes pozitív számot!"
          isValid = false
        }
        if (this.discountCategory === "percent" && numValue > 100) {
          this.errors.value = "A százalékos kedvezmény nem lehet több mint 100%!"
          isValid = false
        }
      }

      return isValid
    },
    handleImageUpload(event: Event) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        this.imageFile = target.files[0]
      }
    },
    resetForm() {
      this.name = ""
      this.description = ""
      this.imageFile = null
      this.discountCategory = ""
      this.value = ""
      this.clearErrors()

      // Reset file input
      const fileInput = this.$refs.imageInput as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    },
    async createCouponType() {
      if (!this.validateForm()) {
        return
      }

      this.clearErrors()

      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('description', this.description)
      formData.append('discount_category', this.discountCategory)
      formData.append('value', this.value)

      if (this.imageFile) {
        formData.append('image', this.imageFile)
      }

      const result = await this.couponStore.createCouponType(formData)

      if (result.success) {
        this.successMessage = "Kupontípus sikeresen létrehozva!"
        console.log("Kupontípus létrehozva:", result.data)

        // Űrlap resetelése 2 másodperc után
        setTimeout(() => {
          this.resetForm()
        }, 2000)
      } else {
        this.backendError = result.message || "Hiba történt a kupontípus létrehozásakor"
      }
    }
  }
})
</script>

<template>
  <div class="coupon-creator-container">
    <div class="card">
      <div class="card-header">
        <h2>Új Kupontípus Létrehozása</h2>
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

        <form @submit.prevent="createCouponType" class="coupon-form">
          <!-- Name -->
          <div class="form-group">
            <label for="name">Kupon neve <span class="required">*</span></label>
            <input
              type="text"
              id="name"
              v-model="name"
              :class="{ 'error-input': errors.name }"
              placeholder="Pl. 20% kedvezmény pizzákra"
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Leírás</label>
            <textarea
              id="description"
              v-model="description"
              rows="4"
              placeholder="Részletes leírás a kuponról..."
            ></textarea>
          </div>

          <!-- Discount Category -->
          <div class="form-group">
            <label for="discountCategory">Kedvezmény típusa <span class="required">*</span></label>
            <select
              id="discountCategory"
              v-model="discountCategory"
              :class="{ 'error-input': errors.discountCategory }"
            >
              <option value="" disabled>Válasszon egy típust...</option>
              <option
                v-for="category in discountCategories"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
            <span v-if="errors.discountCategory" class="error-message">{{ errors.discountCategory }}</span>
          </div>

          <!-- Value -->
          <div class="form-group">
            <label for="value">
              Érték <span class="required">*</span>
              <span v-if="discountCategory === 'percent'" class="hint">(%)</span>
              <span v-else-if="discountCategory === 'fixed'" class="hint">(Ft)</span>
            </label>
            <input
              type="number"
              id="value"
              v-model="value"
              step="0.01"
              :class="{ 'error-input': errors.value }"
              placeholder="Pl. 20 vagy 1000"
            />
            <span v-if="errors.value" class="error-message">{{ errors.value }}</span>
          </div>

          <!-- Image Upload -->
          <div class="form-group">
            <label for="image">Kép feltöltése</label>
            <input
              type="file"
              id="image"
              ref="imageInput"
              @change="handleImageUpload"
              accept="image/*"
              class="file-input"
            />
            <div v-if="imageFile" class="file-preview">
              Kiválasztott fájl: {{ imageFile.name }}
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Létrehozás...</span>
              <span v-else>Kupontípus létrehozása</span>
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

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
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
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #FEA116;
  box-shadow: 0 0 0 3px rgba(254, 161, 22, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
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

.file-input {
  padding: 0.5rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-input:hover {
  border-color: #FEA116;
  background-color: #fff8f0;
}

.file-preview {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  color: #495057;
  font-size: 0.9rem;
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
}
</style>
