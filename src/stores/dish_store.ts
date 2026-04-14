import { defineStore } from 'pinia'
import api from '@/config/axios.ts'
import type { Dish } from '@/types/dish.ts'

export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: [] as Dish[],
  }),
  actions: {
    async loadDishes() {
      const res = await api.get('/dishes/') // A backend végpont, amely visszaadja az egyes kategóriákba tartozó ételeket
      this.dishes = res.data as Dish[]
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
    }
  },
})
