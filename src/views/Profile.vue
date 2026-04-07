<script lang="ts">
import { defineComponent } from 'vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import PageHeader from '@/components/PageHeader.vue'
import UserCouponViewerComponent from '@/components/UserCouponViewerComponent.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    UserCouponViewerComponent,
    PageHeader,
    ProfileComponent,
  },
})
</script>

<template>
  <PageHeader />

  <div class="coupons-page">
    <div class="container-fluid">
      <h1 class="page-title">Kuponok Kezelése</h1>
      <div class="row g-3">
        <div class="col-lg-5 col-12">
          <ProfileComponent />
        </div>
        <div class="col-lg-6 col-12">
          <UserCouponViewerComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coupons-page {
  padding: 2rem 3rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container-fluid {
  max-width: 80%;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

.row {
  gap: 1.5rem;
}

.col-lg-6 {
  padding: 0 0.75rem;
}

@media (max-width: 768px) {
  .coupons-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .container-fluid {
    max-width: 100%;
  }
}
</style>
