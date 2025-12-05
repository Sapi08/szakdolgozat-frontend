<script lang="ts">
import { defineComponent } from 'vue'
import CouponTypeCreaterComponent from '@/components/admin/CouponTypeCreaterComponent.vue'

export default defineComponent({
  name: "CouponsView",
  components: {
    CouponTypeCreaterComponent
  }
})
</script>

<template>
  <div class="coupons-page">
    <h1 class="page-title">Kuponok Kezelése</h1>
    <CouponTypeCreaterComponent />
  </div>
</template>

<style scoped>
.coupons-page {
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .coupons-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }
}
</style>
