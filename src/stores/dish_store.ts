import { defineStore } from 'pinia'
import api from '@/config/axios.ts'
import type { Dish } from '@/types/dish.ts'

export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: [] as Dish[],
    allergens: [] as string[],
    categories: [] as string[],
  }),
  actions: {
    async loadDishes() {
      const res = await api.get('/dishes/') // A backend végpont, amely visszaadja az egyes kategóriákba tartozó ételeket
      this.dishes = res.data as Dish[]
      return res.data
    },
  },
})
