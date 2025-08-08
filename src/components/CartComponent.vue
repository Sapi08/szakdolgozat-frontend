<script lang="ts">
  import { defineComponent } from 'vue'
  import { mapStores, mapState } from 'pinia'
  import { useCartStore } from '@/stores/cart_store'

  export default defineComponent({
    name: 'ShoppingCart',
    computed: {
      ...mapStores(useCartStore),
      ...mapState(useCartStore, ['cartItems', 'totalPrice']),
    },
    methods: {
      removeItem(id: number) {
        this.cartStore.removeFromCart(id);
      },
    },
  });
</script>

<template>
  <div class="container my-5">
    <div class="card shadow-lg rounded-4 border-0">
      {{cartStore.items}}
      <div class="card-header text-white fw-bold fs-4 rounded-top-4">
        🛒 Kosár
      </div>
      <div class="card-body">
        <div v-if="cartStore.cartItems.length === 0" class="text-center text-muted">
          A kosarad üres.
        </div>
        <ul v-else class="list-group list-group-flush">
          <li v-for="item in cartStore.cartItems" :key="item.dish.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1">{{ item.dish.name }}</h6>
              <small class="text-muted">{{ item.quantity }} × {{ item.dish.price.toFixed(0) }} Ft</small>
            </div>
            <div>
              <span class="fw-bold">{{ (item.quantity * item.dish.price).toFixed(0) }} Ft</span>
              <button @click="removeItem(item.dish.id)" class="btn btn-sm btn-outline-danger ms-2">✕</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center bg-light rounded-bottom-4">
        <span class="fw-bold">Összesen: {{ cartStore.totalPrice.toFixed(0) }} Ft</span>
        <button class="btn btn-success">Megrendelés</button>
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
}
.btn-success:hover {
  background-color: #e86a61;
  border-color: #e86a61;
}
</style>
