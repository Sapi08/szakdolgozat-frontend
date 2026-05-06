import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { DiscountType } from '@/types/discount-type'
import type { Coupon } from '@/types/coupon'
import { AxiosError } from 'axios'

export const useAdminCouponStore = defineStore('adminCoupon', {
  state: () => ({
	couponTypes: [] as DiscountType[],
	coupons: [] as Coupon[],
	isLoading: false,
	error: null as string | null,
  }),
  actions: {
	async adminLoadDiscountTypes() {
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

	async adminCreateDiscountType(formData: FormData) {
	  this.isLoading = true
	  this.error = null
	  try {
		const response = await api.post('/admin/discount_type/create/', formData, {
		  headers: {
			'Content-Type': 'multipart/form-data',
		  },
		})

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

	async adminDeleteDiscountType(id: number) {
	  this.isLoading = true
	  this.error = null
	  try {
		await api.delete(`/admin/discount_type/${id}/delete/`)
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

	async adminLoadCoupons() {
	  this.isLoading = true
	  this.error = null
	  try {
		const response = await api.get('/admin/coupons/')

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

	async adminCreateCoupon(couponData: { user: number; discount_type: number; start_date: string; expiration_date: string }) {
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

	async adminDeleteCoupon(id: number) {
	  this.isLoading = true
	  this.error = null
	  try {
		await api.delete(`/admin/coupons/${id}/delete/`)
		this.coupons = this.coupons.filter((c) => c.id !== id)
		return { success: true }
	  } catch (err) {
		this.error = 'Nem sikerült törölni a kupont'
		return { success: false, message: this.error }
	  } finally {
		this.isLoading = false
	  }
	},
  },
})


