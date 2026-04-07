<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart_store'
import api from '@/config/axios'

export default defineComponent({
  name: 'PaymentSuccess',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const cartStore = useCartStore()

    const loading = ref(true)
    const error = ref('')
    const orderCreated = ref(false)
    const orderId = ref<number | null>(null)

    onMounted(async () => {
      const sessionId = route.query.session_id as string

      if (!sessionId) {
        error.value = 'Hiányzó session ID'
        loading.value = false
        return
      }

      try {
        // Backend végpont meghívása, amely ellenőrzi a fizetést és létrehozza a rendelést
        const response = await api.post('/api/verify_payment/', { session_id: sessionId })

        if (response.data.success) {
          orderCreated.value = true
          orderId.value = response.data.order_id

          // Kosár ürítése
          cartStore.clearCart()

          // 3 másodperc után átirányítás
          setTimeout(() => {
            router.push('/profile')
          }, 3000)
        } else {
          error.value = 'A fizetés ellenőrzése sikertelen'
        }
      } catch (err) {
        console.error('Payment verification error:', err)
        error.value = 'Hiba történt a fizetés ellenőrzése során'
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      error,
      orderCreated,
      orderId,
      router,
    }
  },
})
</script>

<template>
  <div class="container my-5">
    <div class="card shadow-lg rounded-4 border-0 text-center p-5">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <div
          class="spinner-border text-primary mb-3"
          role="status"
          style="width: 4rem; height: 4rem"
        >
          <span class="visually-hidden">Betöltés...</span>
        </div>
        <h3 class="mb-2">Fizetés ellenőrzése...</h3>
        <p class="text-muted">Kérjük várjon, amíg feldolgozzuk a fizetését.</p>
      </div>

      <!-- Success state -->
      <div v-else-if="orderCreated && !error" class="success-state">
        <div class="success-icon mb-4">
          <i class="fas fa-check-circle text-success" style="font-size: 5rem"></i>
        </div>
        <h2 class="text-success mb-3">Sikeres fizetés!</h2>
        <p class="lead mb-4">Köszönjük a megrendelését! A fizetés sikeresen megtörtént.</p>
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Rendelés azonosító: <strong>#{{ orderId }}</strong>
        </div>
        <p class="text-muted mt-3">
          <i class="fas fa-envelope me-2"></i>
          Hamarosan e-mailben küldünk egy visszaigazolást a rendeléséről.
        </p>
        <p class="text-muted mt-2">
          <i class="fas fa-clock me-2"></i>
          3 másodperc múlva átirányítjuk a profil oldalára...
        </p>
        <button @click="router.push('/profile')" class="btn btn-primary btn-lg mt-3">
          <i class="fas fa-user me-2"></i>
          Profil megtekintése most
        </button>
      </div>

      <!-- Error state -->
      <div v-else class="error-state">
        <div class="error-icon mb-4">
          <i class="fas fa-exclamation-circle text-danger" style="font-size: 5rem"></i>
        </div>
        <h2 class="text-danger mb-3">Hiba történt</h2>
        <p class="lead mb-4">{{ error }}</p>
        <div class="alert alert-warning">
          <i class="fas fa-info-circle me-2"></i>
          Ha a fizetés megtörtént, kérjük vegye fel velünk a kapcsolatot az ügyfélszolgálaton.
        </div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button @click="router.push('/')" class="btn btn-outline-primary">
            <i class="fas fa-home me-2"></i>
            Vissza a főoldalra
          </button>
          <button @click="router.push('/contact')" class="btn btn-primary">
            <i class="fas fa-envelope me-2"></i>
            Kapcsolat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state,
.success-state,
.error-state {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.success-icon {
  animation: scaleIn 0.5s ease-out;
}

.error-icon {
  animation: shake 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.btn {
  padding: 12px 30px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.alert {
  border-radius: 10px;
}
</style>
