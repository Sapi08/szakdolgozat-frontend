<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PaymentCancelled',
  setup() {
    const router = useRouter()

    return {
      router
    }
  }
})
</script>

<template>
  <div class="container my-5">
    <div class="card shadow-lg rounded-4 border-0 text-center p-5">
      <div class="cancelled-state">
        <div class="cancelled-icon mb-4">
          <i class="fas fa-times-circle text-warning" style="font-size: 5rem;"></i>
        </div>
        <h2 class="text-warning mb-3">Fizetés megszakítva</h2>
        <p class="lead mb-4">
          A fizetési folyamat megszakításra került. A rendelés nem jött létre.
        </p>
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          A kosár tartalma megőrződött. Folytathatja a vásárlást, vagy újra megpróbálhatja a fizetést.
        </div>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <button @click="router.push('/menu')" class="btn btn-outline-primary">
            <i class="fas fa-utensils me-2"></i>
            Vissza a menühöz
          </button>
          <button @click="router.push('/cart')" class="btn btn-primary">
            <i class="fas fa-shopping-cart me-2"></i>
            Kosár megtekintése
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

.cancelled-state {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.cancelled-icon {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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
