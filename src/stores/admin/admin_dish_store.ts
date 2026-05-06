import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { Dish } from '@/types/dish'

export const useAdminDishStore = defineStore('admin_dish', {
  state: () => ({
	dishes: [] as Dish[],
	allergens: [] as string[],
	categories: [] as string[],
  }),
  actions: {
	async adminToggleDishAvailability(dishId: number) {
	  const res = await api.post(`/admin/dishes/${dishId}/toggle-availability/`)
	  const index = this.dishes.findIndex((d) => d.id === dishId)
	  if (index !== -1 && res.data.available !== undefined) {
		this.dishes[index].available = res.data.available
	  }
	  return res.data
	},

	async adminCreateDish(data: Partial<Dish>) {
	  const res = await api.post('/admin/dishes/create', data)
	  this.dishes.push(res.data)
	  return res.data
	},

	async adminUpdateDish(dishId: number, data: Partial<Dish>) {
	  const res = await api.put(`/admin/dishes/${dishId}/edit`, data)
	  const index = this.dishes.findIndex((d) => d.id === dishId)
	  if (index !== -1) {
		this.dishes[index] = { ...this.dishes[index], ...res.data }
	  }
	  return res.data
	},

	async adminDeleteDish(dishId: number) {
	  await api.delete(`/admin/dishes/${dishId}/delete`)
	  this.dishes = this.dishes.filter((d) => d.id !== dishId)
	},

	async adminLoadAllergens() {
	  try {
		const res = await api.get('/admin/allergens/')
		if (res.data && Array.isArray(res.data)) {
		  this.allergens = res.data.map((a: any) => (typeof a === 'string' ? a : a.name))
		}
	  } catch (err) {
		console.error('Failed to load allergens:', err)
	  }
	},

	async adminLoadCategories() {
	  try {
		const res = await api.get('/admin/categories/')
		if (res.data && Array.isArray(res.data)) {
		  this.categories = res.data.map((a: any) => (typeof a === 'string' ? a : a.name))
		}
	  } catch (err) {
		console.error('Failed to load categories:', err)
	  }
	},
  },
})


