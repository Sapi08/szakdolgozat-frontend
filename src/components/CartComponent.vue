<script lang="ts">
  import { defineComponent } from 'vue'
  import { mapStores, mapState } from 'pinia'
  import { useCartStore } from '@/stores/cart_store'
  import { useOrderStore } from '@/stores/order_store'
  import { useUserStore } from '@/stores/user_store'

  export default defineComponent({
    name: 'ShoppingCart',
    data() {
      return {
        showOrderModal: false,
        showOrderForm: false,
        deliveryType: 'delivery' as 'delivery' | 'pickup',
        deliveryName: '',
        deliveryPhone: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryZip: '',
        paymentMethod: 'cash_on_delivery' as 'cash_on_delivery' | 'card',
        orderNotes: '',
        couponCode: '',
        isSubmitting: false,
        errors: {
          name: '',
          phone: '',
          address: '',
          city: '',
          zip: '',
        }
      }
    },
    computed: {
      ...mapStores(useCartStore, useOrderStore, useUserStore),
      ...mapState(useCartStore, ['cartItems', 'totalItems']),
      totalPrice(): number {
        return this.cartStore.cartItems.reduce((sum, item) => {
          const price = Number(item.dish.price || 0)
          return sum + (price * item.quantity)
        }, 0)
      }
    },
    mounted(){
      console.log('Cart items:', this.cartStore.cartItems);
    },
    methods: {
      removeItem(id: number) {
        this.cartStore.removeFromCart(id);
      },
      incrementQuantity(id: number) {
        this.cartStore.incrementQuantity(id);
      },
      decrementQuantity(id: number) {
        this.cartStore.decrementQuantity(id);
      },
      openOrderModal() {
        if (this.cartStore.cartItems.length === 0) {
          alert('A kosár üres!')
          return
        }
        this.showOrderModal = true;
      },
      closeOrderModal() {
        this.showOrderModal = false;
        this.showOrderForm = false;
        this.resetForm();
      },
      openOrderForm() {
        if (!this.userStore.isAuthenticated) {
          alert('Kérjük jelentkezzen be a rendelés leadásához!');
          this.$router.push('/login');
          return;
        }
        this.showOrderForm = true;
      },
      resetForm() {
        this.deliveryType = 'delivery';
        this.deliveryName = '';
        this.deliveryPhone = '';
        this.deliveryAddress = '';
        this.deliveryCity = '';
        this.deliveryZip = '';
        this.paymentMethod = 'cash_on_delivery';
        this.orderNotes = '';
        this.couponCode = '';
        this.errors = { name: '', phone: '', address: '', city: '', zip: '' };
      },
      validateForm(): boolean {
        let isValid = true;
        this.errors = { name: '', phone: '', address: '', city: '', zip: '' };

        if (!this.deliveryName.trim()) {
          this.errors.name = 'A név megadása kötelező';
          isValid = false;
        }

        if (!this.deliveryPhone.trim()) {
          this.errors.phone = 'A telefonszám megadása kötelező';
          isValid = false;
        } else if (!/^[\d\s+\-()]+$/.test(this.deliveryPhone)) {
          this.errors.phone = 'Érvénytelen telefonszám formátum';
          isValid = false;
        }

        if (this.deliveryType === 'delivery') {
          if (!this.deliveryAddress.trim()) {
            this.errors.address = 'A szállítási cím megadása kötelező';
            isValid = false;
          } else if (this.deliveryAddress.trim().length < 5) {
            this.errors.address = 'Kérjük adjon meg egy részletes címet';
            isValid = false;
          }

          if (!this.deliveryCity.trim()) {
            this.errors.city = 'A város megadása kötelező';
            isValid = false;
          }

          if (!this.deliveryZip.trim()) {
            this.errors.zip = 'Az irányítószám megadása kötelező';
            isValid = false;
          } else if (!/^\d{4}$/.test(this.deliveryZip.trim())) {
            this.errors.zip = 'Érvénytelen irányítószám (4 számjegy szükséges)';
            isValid = false;
          }
        }

        return isValid;
      },
      async submitOrder() {
        if (!this.validateForm()) {
          return;
        }

        this.isSubmitting = true;

        try {
          // Rendelési adatok összeállítása backend formátumban
          const orderData: any = {
            delivery_type: this.deliveryType,
            delivery_name: this.deliveryName.trim(),
            delivery_phone: this.deliveryPhone.trim(),
            payment_method: this.paymentMethod,
            items: this.cartStore.cartItems.map(item => {
              const orderItem: any = {
                dish: item.dishId,
                quantity: item.quantity,
              };

              // Csak akkor adjuk hozzá a dish_variant-ot, ha létezik
              if (item.variantId) {
                orderItem.dish_variant = item.variantId;
              }

              return orderItem;
            }),
          };

          // Csak akkor küldjük a cím mezőket, ha delivery típusú
          if (this.deliveryType === 'delivery') {
            orderData.delivery_address = this.deliveryAddress.trim();
            orderData.delivery_city = this.deliveryCity.trim();
            orderData.delivery_zip = this.deliveryZip.trim();
          } else {
            // Ha pickup, akkor üres stringeket küldünk
            orderData.delivery_address = '';
            orderData.delivery_city = '';
            orderData.delivery_zip = '';
          }

          // Opcionális mezők - backend üres stringeket vár, nem undefined-ot
          orderData.comment = this.orderNotes.trim() || '';
          orderData.coupon_code = this.couponCode.trim() || '';

          console.log('📦 Submitting order with data:', orderData);

          const result = await this.orderStore.createOrder(orderData);

          console.log('🔍 Order result:', result);

          if (result.success) {
            // Kosár ürítése
            this.cartStore.clearCart();

            // Modal bezárása
            this.closeOrderModal();

            // Sikeres üzenet
            alert('Rendelés sikeresen leadva! Köszönjük!');

            // Átirányítás
            this.$router.push('/');
          } else {
            console.error('❌ Order failed with message:', result.message);
            alert('Hiba: ' + (result.message || 'Hiba történt a rendelés leadása során'));
          }
        } catch (err) {
          console.error('❌ Order submission error:', err);
          alert('Váratlan hiba történt. Kérjük próbálja újra!');
        } finally {
          this.isSubmitting = false;
        }
      }
    },
  });
</script>

<template>
  <div class="container my-5">
    <div class="card shadow-lg rounded-4 border-0">
      <div class="card-header text-white fw-bold fs-4 rounded-top-4">
        Kosár <span v-if="totalItems > 0" class="badge bg-light text-dark ms-2">{{ totalItems }}</span>
      </div>
      <div class="card-body">
        <div v-if="cartStore.cartItems.length === 0" class="text-center text-muted py-5">
          <i class="fas fa-shopping-cart fa-3x mb-3 opacity-25"></i>
          <p class="fs-5">A kosarad üres.</p>
        </div>
        <div v-else class="cart-items">
          <div v-for="item in cartStore.cartItems" :key="item.dishId" class="cart-item">
            <div class="item-info">
              <h6 class="item-name mb-1">{{ item.dish.name }}</h6>
              <small class="item-price text-muted">{{ Number(item.dish.price || 0).toFixed(0) }} Ft / db</small>
            </div>

            <div class="item-actions">
              <div class="quantity-controls">
                <button
                  @click="decrementQuantity(item.dishId)"
                  class="btn btn-sm btn-outline-secondary quantity-btn"
                  :disabled="item.quantity <= 1"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">{{ item.quantity }}</span>
                <button
                  @click="incrementQuantity(item.dishId)"
                  class="btn btn-sm btn-outline-secondary quantity-btn"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <div class="item-total">
                <span class="fw-bold fs-6">{{ (item.quantity * Number(item.dish.price || 0)).toFixed(0) }} Ft</span>
              </div>

              <button
                @click="removeItem(item.dishId)"
                class="btn btn-sm btn-outline-danger remove-btn"
                title="Eltávolítás"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="cartStore.cartItems.length > 0" class="card-footer bg-light rounded-bottom-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-bold fs-5">Összesen:</span>
          <span class="fw-bold fs-4 text-success">{{ totalPrice.toFixed(0) }} Ft</span>
        </div>
        <button @click="openOrderModal" class="btn btn-success w-100 py-2">
          <i class="fas fa-check-circle me-2"></i>
          Megrendelés leadása
        </button>
      </div>
    </div>

    <!-- Megrendelés Modal -->
    <div v-if="showOrderModal" class="modal-overlay" @click="closeOrderModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-receipt me-2"></i>
            {{ showOrderForm ? 'Szállítási Adatok' : 'Rendelés Összesítő' }}
          </h3>
          <button @click="closeOrderModal" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Rendelés összesítő -->
          <div v-if="!showOrderForm">
            <h5 class="mb-3">Kosár tartalma:</h5>
            <div class="order-summary">
              <div v-for="item in cartStore.cartItems" :key="item.dishId" class="order-item">
                <div class="order-item-details">
                  <span class="order-item-name">{{ item.dish.name }}</span>
                  <span class="order-item-qty">{{ item.quantity }} db</span>
                </div>
                <div class="order-item-price">
                  {{ (item.quantity * Number(item.dish.price || 0)).toFixed(0) }} Ft
                </div>
              </div>
            </div>

            <div class="order-total">
              <div class="total-row">
                <span class="total-label">Végösszeg:</span>
                <span class="total-amount">{{ totalPrice.toFixed(0) }} Ft</span>
              </div>
            </div>
          </div>

          <!-- Rendelési űrlap -->
          <div v-else>
            <form @submit.prevent="submitOrder">
              <!-- Szállítás típusa -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-truck me-2"></i>
                  Átvétel módja *
                </label>
                <div class="btn-group w-100" role="group">
                  <input type="radio" class="btn-check" id="deliveryTypeDelivery" v-model="deliveryType" value="delivery">
                  <label class="btn btn-outline-primary" for="deliveryTypeDelivery">
                    <i class="fas fa-truck me-2"></i>Házhoz szállítás
                  </label>
                  <input type="radio" class="btn-check" id="deliveryTypePickup" v-model="deliveryType" value="pickup">
                  <label class="btn btn-outline-primary" for="deliveryTypePickup">
                    <i class="fas fa-store me-2"></i>Személyes átvétel
                  </label>
                </div>
              </div>

              <!-- Név -->
              <div class="mb-3">
                <label for="deliveryName" class="form-label">
                  <i class="fas fa-user me-2"></i>
                  Név *
                </label>
                <input
                  id="deliveryName"
                  v-model="deliveryName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Teljes név"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <!-- Telefonszám -->
              <div class="mb-3">
                <label for="deliveryPhone" class="form-label">
                  <i class="fas fa-phone me-2"></i>
                  Telefonszám *
                </label>
                <input
                  id="deliveryPhone"
                  v-model="deliveryPhone"
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': errors.phone }"
                  placeholder="+36 30 123 4567"
                  required
                />
                <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
              </div>

              <!-- Szállítási cím mezők (csak delivery esetén) -->
              <div v-if="deliveryType === 'delivery'">
                <div class="mb-3">
                  <label for="deliveryAddress" class="form-label">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    Utca, házszám *
                  </label>
                  <input
                    id="deliveryAddress"
                    v-model="deliveryAddress"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.address }"
                    placeholder="Pl: Fő utca 12. 2/3."
                    required
                  />
                  <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
                </div>

                <div class="row">
                  <div class="col-md-7 mb-3">
                    <label for="deliveryCity" class="form-label">
                      <i class="fas fa-city me-2"></i>
                      Város *
                    </label>
                    <input
                      id="deliveryCity"
                      v-model="deliveryCity"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.city }"
                      placeholder="Budapest"
                      required
                    />
                    <div v-if="errors.city" class="invalid-feedback">{{ errors.city }}</div>
                  </div>

                  <div class="col-md-5 mb-3">
                    <label for="deliveryZip" class="form-label">
                      <i class="fas fa-mail-bulk me-2"></i>
                      Irányítószám *
                    </label>
                    <input
                      id="deliveryZip"
                      v-model="deliveryZip"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.zip }"
                      placeholder="1011"
                      maxlength="4"
                      required
                    />
                    <div v-if="errors.zip" class="invalid-feedback">{{ errors.zip }}</div>
                  </div>
                </div>
              </div>

              <!-- Fizetési mód -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="fas fa-credit-card me-2"></i>
                  Fizetési mód *
                </label>
                <select v-model="paymentMethod" class="form-select">
                  <option value="cash_on_delivery">Készpénz házhoz szállításkor</option>
                  <option value="card">Kártya</option>
                </select>
              </div>

              <!-- Megjegyzés -->
              <div class="mb-3">
                <label for="orderNotes" class="form-label">
                  <i class="fas fa-comment me-2"></i>
                  Megjegyzés (opcionális)
                </label>
                <textarea
                  id="orderNotes"
                  v-model="orderNotes"
                  class="form-control"
                  rows="2"
                  placeholder="Különleges kérések, csengetési információk stb."
                ></textarea>
              </div>

              <!-- Kuponkód -->
              <div class="mb-3">
                <label for="couponCode" class="form-label">
                  <i class="fas fa-tag me-2"></i>
                  Kuponkód (opcionális)
                </label>
                <input
                  id="couponCode"
                  v-model="couponCode"
                  type="text"
                  class="form-control"
                  placeholder="Írja be a kuponkódját"
                />
              </div>

              <!-- Végösszeg -->
              <div class="order-total mt-4 mb-3">
                <div class="total-row">
                  <span class="total-label">Fizetendő összeg:</span>
                  <span class="total-amount">{{ totalPrice.toFixed(0) }} Ft</span>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <small>A végösszeget a backend számítja ki a kupon és szállítási díj figyelembevételével.</small>
              </div>
            </form>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeOrderModal" class="btn btn-outline-secondary">
            <i class="fas fa-times me-2"></i>
            Mégse
          </button>
          <button
            v-if="!showOrderForm"
            @click="openOrderForm"
            class="btn btn-primary"
          >
            <i class="fas fa-arrow-right me-2"></i>
            Tovább
          </button>
          <button
            v-else
            @click="submitOrder"
            class="btn btn-success"
            :disabled="isSubmitting"
          >
            <i class="fas fa-check-circle me-2"></i>
            {{ isSubmitting ? 'Küldés...' : 'Rendelés leadása' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  background-color: #fbaf32;
}

.btn-success {
  background-color: #e86a61;
  border-color: #e86a61;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #d55951;
  border-color: #d55951;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 106, 97, 0.3);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.cart-item:hover {
  border-color: #fbaf32;
  box-shadow: 0 2px 8px rgba(251, 175, 50, 0.15);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 4px;
}

.item-price {
  font-size: 14px;
  color: #757575;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 5px;
  border-radius: 25px;
  border: 1px solid #dee2e6;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #dee2e6;
  background: white;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #fbaf32;
  border-color: #fbaf32;
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.item-total {
  min-width: 100px;
  text-align: right;
  color: #e86a61;
}

.remove-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
  transform: scale(1.05);
}

.card-footer {
  border-top: 2px solid #e0e0e0;
  padding: 20px;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .item-actions {
    width: 100%;
    justify-content: space-between;
  }

  .item-total {
    min-width: auto;
  }
}

/* Modal Styles */
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #fbaf32 0%, #ff9a3c 100%);
  color: white;
  border-radius: 15px 15px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
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

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #fbaf32;
  transition: all 0.2s ease;
}

.order-item:hover {
  background: #fff3e0;
  box-shadow: 0 2px 8px rgba(251, 175, 50, 0.2);
}

.order-item-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.order-item-name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.order-item-qty {
  font-size: 14px;
  color: #666;
}

.order-item-price {
  font-weight: 700;
  color: #e86a61;
  font-size: 18px;
}

.order-total {
  border-top: 2px solid #e0e0e0;
  padding-top: 15px;
  margin-top: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
  border-radius: 10px;
}

.total-label {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.total-amount {
  font-size: 28px;
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
  border-radius: 0 0 15px 15px;
}

.modal-footer .btn {
  flex: 1;
  padding: 12px 20px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
}

.btn-outline-secondary {
  background: white;
  color: #666;
  border: 2px solid #dee2e6;
}

.btn-outline-secondary:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #5469d4 0%, #4353c7 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4353c7 0%, #3643b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(83, 105, 212, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form Styles */
.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 15px;
}

.form-control {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #fbaf32;
  box-shadow: 0 0 0 0.2rem rgba(251, 175, 50, 0.25);
  outline: none;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 13px;
  margin-top: 5px;
}

.alert-info {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  padding: 12px 15px;
  color: #1976d2;
  font-size: 14px;
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header {
    padding: 15px 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
