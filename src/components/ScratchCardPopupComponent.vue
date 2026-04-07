<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { useCouponStore } from '@/stores/coupon_store'
import { useUserStore } from '@/stores/user_store'
import ScratchCardComponent from '@/components/ScratchCardComponent.vue'
import type { Coupon } from '@/types/coupon'

export default defineComponent({
  name: 'ScratchCardPopupComponent',
  components: {
    ScratchCardComponent,
  },
  setup() {
    const couponStore = useCouponStore()
    const userStore = useUserStore()

    const pendingCoupons = ref<Coupon[]>([])
    const currentCoupon = ref<Coupon | null>(null)

    const loadUnscratchedCoupons = async () => {
      if (!userStore.isAuthenticated) {
        return
      }
      try {
        await couponStore.loadUserCoupons()
        pendingCoupons.value = [...couponStore.getUnscratchedCoupons]
        showNext()
      } catch {
        // Ha nincs bejelentkezve a user, csendesen ignoráljuk
      }
    }

    const showNext = () => {
      currentCoupon.value = pendingCoupons.value[0] ?? null
    }

    const onScratched = async (code: string) => {
      await couponStore.scratchCoupon(code)
    }

    const onClosed = () => {
      pendingCoupons.value = pendingCoupons.value.slice(1)
      if (pendingCoupons.value.length > 0) {
        setTimeout(showNext, 800)
      } else {
        currentCoupon.value = null
      }
    }

    onMounted(() => {
      loadUnscratchedCoupons()
    })

    return {
      currentCoupon,
      onScratched,
      onClosed,
    }
  },
})
</script>

<template>
  <transition name="popup-fade">
    <ScratchCardComponent
      v-if="currentCoupon && currentCoupon.code"
      :coupon-id="currentCoupon.code"
      :coupon-image="(currentCoupon.discount_type_details as any)?.image ?? ''"
      @scratched="onScratched"
      @closed="onClosed"
    />
  </transition>
</template>

<style scoped>
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}
</style>
