import { defineStore } from "pinia"
import api from "@/config/axios.ts"
import type CouponType from "@/models/coupon_type.ts"
import { AxiosError } from "axios"

export const useCouponStore = defineStore("coupon", {
  state: () => ({
    couponTypes: [] as CouponType[],
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async loadCouponTypes() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get("/api/coupon_types/")
        this.couponTypes = response.data as CouponType[]
        return response.data
      } catch (err) {
        console.error("Kupontípusok betöltési hiba:", err)
        if (err instanceof AxiosError) {
          this.error = "Nem sikerült betölteni a kupontípusokat"
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createCouponType(formData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post("/api/create_coupon_type/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Hozzáadjuk az új kupontípust a listához
        this.couponTypes.push(response.data)

        return { success: true, data: response.data }
      } catch (err) {
        console.error("Kupontípus létrehozási hiba:", err)

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status

            if (status === 400) {
              this.error = "Hibás adatok! Kérjük, ellenőrizze a mezőket!"
            } else if (status === 422) {
              this.error = "Validációs hiba! Kérjük, ellenőrizze a mezőket!"
            } else if (status === 401 || status === 403) {
              this.error = "Nincs jogosultsága a művelet végrehajtásához!"
            } else {
              this.error = "Váratlan hiba történt. Kérjük, próbálja újra később!"
            }
          } else if (err.request) {
            this.error = "Nem sikerült kapcsolódni a szerverhez!"
          } else {
            this.error = "Hiba történt a kérés feldolgozása során!"
          }
        } else {
          this.error = "Ismeretlen hiba történt!"
        }

        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async updateCouponType(id: number, formData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.put(`/api/coupon_type/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Frissítjük a listában
        const index = this.couponTypes.findIndex(ct => ct.id === id)
        if (index !== -1) {
          this.couponTypes[index] = response.data
        }

        return { success: true, data: response.data }
      } catch (err) {
        console.error("Kupontípus frissítési hiba:", err)
        this.error = "Nem sikerült frissíteni a kupontípust"
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteCouponType(id: number) {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`/api/coupon_type/${id}/`)

        // Töröljük a listából
        this.couponTypes = this.couponTypes.filter(ct => ct.id !== id)

        return { success: true }
      } catch (err) {
        console.error("Kupontípus törlési hiba:", err)
        this.error = "Nem sikerült törölni a kupontípust"
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async getCouponTypeById(id: number) {
      try {
        const response = await api.get(`/api/coupon_type/${id}/`)
        return response.data as CouponType
      } catch (err) {
        console.error("Kupontípus lekérdezési hiba:", err)
        throw err
      }
    }
  },
  getters: {
    getCouponTypes: (state) => state.couponTypes,
    getLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getCouponTypesByCategory: (state) => (category: string) => {
      return state.couponTypes.filter(ct => ct.discount_category === category)
    }
  }
})

