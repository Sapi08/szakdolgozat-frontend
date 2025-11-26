<script lang="ts">
import { defineComponent } from 'vue'
import type Dish from '@/models/dish.ts'
import type DishVariant from '@/models/dish_variant.ts'

export default defineComponent({
  name: "DishVariantSelector",
  props: {
    dish: {
      type: Object as () => Dish,
      required: true
    },
    variants: {
      type: Array as () => DishVariant[],
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'select'],
  data() {
    return {
      selectedVariant: null as DishVariant | null
    }
  },
  methods: {
    selectVariant(variant: DishVariant) {
      this.selectedVariant = variant;
    },
    confirmSelection() {
      if (this.selectedVariant) {
        this.$emit('select', this.selectedVariant);
        this.close();
      }
    },
    close() {
      this.selectedVariant = null;
      this.$emit('close');
    }
  }
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">{{ dish.name }}</h3>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-subtitle">Válassza ki a kívánt kiszerelést:</p>

          <div class="variants-grid">
            <div
              v-for="variant in variants"
              :key="variant.id"
              :class="['variant-card', { 'selected': selectedVariant?.id === variant.id }]"
              @click="selectVariant(variant)"
            >
              <div class="variant-detail">{{ variant.detail }}</div>
              <div class="variant-price">{{ Number(variant.price).toFixed(0) }} Ft</div>
              <div v-if="selectedVariant?.id === variant.id" class="check-icon">
                <i class="fas fa-check-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">
            Mégse
          </button>
          <button
            class="btn custom-btn"
            @click="confirmSelection"
            :disabled="!selectedVariant"
          >
            <i class="fas fa-shopping-cart"></i>
            Kosárba
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: #ffffff;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #fbaf32;
  margin: 0;
  font-family: 'Nunito', sans-serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #e86a61;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

.modal-subtitle {
  font-size: 16px;
  color: #757575;
  margin-bottom: 20px;
  text-align: center;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.variant-card {
  position: relative;
  padding: 20px;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: #ffffff;
}

.variant-card:hover {
  border-color: #fbaf32;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(251, 175, 50, 0.3);
}

.variant-card.selected {
  border-color: #e86a61;
  background: #fff3f0;
  box-shadow: 0 5px 20px rgba(232, 106, 97, 0.3);
}

.variant-detail {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-family: 'Nunito', sans-serif;
}

.variant-price {
  font-size: 24px;
  font-weight: 700;
  color: #e86a61;
  font-family: 'Nunito', sans-serif;
}

.check-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #e86a61;
  font-size: 24px;
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.modal-footer {
  padding: 20px 30px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn {
  padding: 12px 30px;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 767.98px) {
  .modal-container {
    max-width: 100%;
    border-radius: 15px;
  }

  .modal-title {
    font-size: 24px;
  }

  .variants-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 575.98px) {
  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }
}
</style>

