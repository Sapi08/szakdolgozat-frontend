import { defineStore } from 'pinia'
import api from '@/config/axios.ts'
import type { Dish } from '@/types/dish.ts'

export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: [] as Dish[],
    allergens: [] as string[],
  }),
  actions: {
    async loadDishes() {
      const res = await api.get('/dishes/') // A backend végpont, amely visszaadja az egyes kategóriákba tartozó ételeket
      this.dishes = res.data as Dish[]
      return res.data
    },
    async toggleDishAvailability(dishId: number) {
      const res = await api.post(`/admin/dishes/${dishId}/toggle-availability/`)
      const index = this.dishes.findIndex(d => d.id === dishId)
      if (index !== -1 && res.data.available !== undefined) {
        this.dishes[index].available = res.data.available
      }
      return res.data
    },
    async updateDish(dishId: number, data: Partial<Dish>) {
      const res = await api.put(`/dishes/${dishId}/edit`, data)
      const index = this.dishes.findIndex(d => d.id === dishId)
      if (index !== -1) {
        this.dishes[index] = { ...this.dishes[index], ...res.data }
      }
      return res.data
    },
    async deleteDish(dishId: number) {
      await api.delete(`/dishes/${dishId}/delete`)
      this.dishes = this.dishes.filter(d => d.id !== dishId)
    },
    async loadAllergens() {
      try {
        const res = await api.get('/admin/allergens/')
        if (res.data && Array.isArray(res.data)) {
          this.allergens = res.data.map((a: any) => typeof a === 'string' ? a : a.name)
        }
      } catch (err) {
        console.error('Failed to load allergens:', err)
      }
    },
  },
})
