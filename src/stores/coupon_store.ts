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
  actions: {
    // Discount Type actions -----------------------------------------------------------------------
    async loadDiscountTypes() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/admin/discount_types/')
        this.couponTypes = response.data as DiscountType[]
        return response.data
      } catch (err) {
        console.error('Kupontípusok betöltési hiba:', err)
        if (err instanceof AxiosError) {
          this.error = 'Nem sikerült betölteni a kupontípusokat'
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createDiscountType(formData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/admin/discount_type/create/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // Hozzáadjuk az új kupontípust a listához
        this.couponTypes.push(response.data)

        return { success: true, data: response.data }
      } catch (err) {
        console.error('Kupontípus létrehozási hiba:', err)

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status

            if (status === 400) {
              this.error = 'Hibás adatok! Kérjük, ellenőrizze a mezőket!'
            } else if (status === 422) {
              this.error = 'Validációs hiba! Kérjük, ellenőrizze a mezőket!'
            } else if (status === 401 || status === 403) {
              this.error = 'Nincs jogosultsága a művelet végrehajtásához!'
            } else {
              this.error = 'Váratlan hiba történt. Kérjük, próbálja újra később!'
            }
          } else if (err.request) {
            this.error = 'Nem sikerült kapcsolódni a szerverhez!'
          } else {
            this.error = 'Hiba történt a kérés feldolgozása során!'
          }
        } else {
          this.error = 'Ismeretlen hiba történt!'
        }

        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteDiscountType(id: number) {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`/admin/discount_type/${id}/delete/`)

        // Töröljük a listából
        this.couponTypes = this.couponTypes.filter((ct) => ct.id !== id)

        return { success: true }
      } catch (err) {
        console.error('Kupontípus törlési hiba:', err)
        this.error = 'Nem sikerült törölni a kupontípust'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

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
    async loadCoupons() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/admin/coupons/')

        // ÁTALAKÍTÁS: Ha a backend discount_type objektumot küld, alakítsuk át
        const transformedCoupons = response.data.map((coupon: unknown) => {
          const couponObj = coupon as Record<string, unknown>
          // Ha discount_type objektum, akkor alakítsuk át
          if (typeof couponObj.discount_type === 'object' && couponObj.discount_type !== null) {
            return {
              ...couponObj,
              discount_type_details: couponObj.discount_type, // Az objektumot átmásoljuk
              discount_type: (couponObj.discount_type as { id: number }).id, // Az ID-t kiemeljük
            }
          }
          // Ha már helyesen van formázva
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

    async createCoupon(couponData: {
      user: number
      discount_type: number
      start_date: string
      expiration_date: string
    }) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/admin/coupons/create/', couponData)
        this.coupons.push(response.data)
        return { success: true, data: response.data }
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status

            if (status === 400) {
              this.error = 'Hibás adatok! Kérjük, ellenőrizze a mezőket!'
            } else if (status === 422) {
              this.error = 'Validációs hiba! Kérjük, ellenőrizze a mezőket!'
            } else if (status === 401 || status === 403) {
              this.error = 'Nincs jogosultsága a művelet végrehajtásához!'
            } else {
              this.error = 'Váratlan hiba történt. Kérjük, próbálja újra később!'
            }
          } else if (err.request) {
            this.error = 'Nem sikerült kapcsolódni a szerverhez!'
          } else {
            this.error = 'Hiba történt a kérés feldolgozása során!'
          }
        } else {
          this.error = 'Ismeretlen hiba történt!'
        }

        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteCoupon(id: number) {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`/api/coupons/${id}/delete/`)
        this.coupons = this.coupons.filter((c) => c.id !== id)
        return { success: true }
      } catch (err) {
        this.error = 'Nem sikerült törölni a kupont'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

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
})
