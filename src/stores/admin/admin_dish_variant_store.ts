import { defineStore } from 'pinia'
import api from '@/config/axios'
import type { DishVariant } from '@/types/dish-variant'

export const useAdminDishVariantStore = defineStore('admin_dish_variant_store', {
  state: () => ({
    variants: [] as DishVariant[],
  }),
  actions: {
    async adminLoadVariantsForDish(dishId: number) {
      const res = await api.get(`/admin/dishes/${dishId}/variants`)
      return res.data as DishVariant[]
    },

    async adminCreateDishVariant(data: Partial<DishVariant>) {
      const res = await api.post('/admin/dish_variants/create', data)
      this.variants.push(res.data)
      return res.data
    },

    async adminDeleteDishVariant(variantId: number) {
      await api.delete(`/admin/dish_variants/${variantId}/delete`)
      this.variants = this.variants.filter((v) => v.id !== variantId)
    },
  },
})
