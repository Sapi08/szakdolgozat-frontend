import { defineStore } from 'pinia'
import api from '@/config/axios.ts'
import type { DiscountType } from '@/types/discount-type.ts'
import type { Coupon } from '@/types/coupon.ts'
import { AxiosError } from 'axios'

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    couponTypes: [] as DiscountType[],
    coupons: [] as Coupon[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    getCouponTypes: (state) => state.couponTypes,
    getCoupons: (state) => state.coupons,
    getLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getCouponTypesByCategory: (state) => (category: string) => {
      return state.couponTypes.filter((ct) => ct.discount_category === category)
    },
    getScratchedCoupons: (state) => state.coupons.filter((c) => c.is_scratched),
    getUnscratchedCoupons: (state) => state.coupons.filter((c) => !c.is_scratched),
    getUsedCoupons: (state) => state.coupons.filter((c) => c.is_used),
    getUnusedCoupons: (state) => state.coupons.filter((c) => !c.is_used),
  },
  actions: {

    async getDiscountTypeById(id: number) {
      try {
        const response = await api.get(`/discount_type/${id}/`)
        return response.data as DiscountType
      } catch (err) {
        console.error('Kupontípus lekérdezési hiba:', err)
        throw err
      }
    },

    // Coupon actions

    //TODO coupon_store.ts - loadMyCoupons() action hozzáadása a loadCoupons() után

    async loadUserCoupons() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/user_coupons/')

        const transformedCoupons = response.data.map((coupon: unknown) => {
          const couponObj = coupon as Record<string, unknown>
          if (typeof couponObj.discount_type === 'object' && couponObj.discount_type !== null) {
            return {
              ...couponObj,
              discount_type_details: couponObj.discount_type,
              discount_type: (couponObj.discount_type as { id: number }).id,
            }
          }
          return couponObj
        })

        this.coupons = transformedCoupons as Coupon[]
        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
          this.error = 'Nem sikerült betölteni a kuponokat'
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async scratchCoupon(code: string) {
      try {
        await api.patch(`/coupons/set_scratched/${code}/`, {
          is_scratched: true,
        })
        const coupon = this.coupons.find((c) => c.code === code)
        if (coupon) coupon.is_scratched = true
        return { success: true }
      } catch (err) {
        console.error('Kaparás mentési hiba:', err)
        return { success: false }
      }
    },

    async validateCoupon(code: string, cartTotal: number) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/coupons/validate/', {
          code: code,
          cart_total: cartTotal
        })
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Hiba történt a kupon érvényesítésekor.'
        this.error = errorMsg
        return { success: false, message: errorMsg }
      } finally {
        this.isLoading = false
      }
    },
  },
})
