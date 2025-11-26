import {defineStore} from "pinia";
import api from "@/config/axios.ts"
import type DishVariant from '@/models/dish_variant.ts'

export const useDishVariantStore = defineStore("dishVariant", {
  state: () => ({
    variants: [] as DishVariant[],
  }),
  actions: {
    async loadVariants() {
      const x = await api.get("/dish-variants");
      this.variants = x.data as DishVariant[];
      return x.data;
    },
    async loadVariantsByDishId(dishId: number) {
      const x = await api.get(`/dish-variants/dish/${dishId}`);
      return x.data as DishVariant[];
    }
  },
  getters: {
    getVariantsByDishId: (state) => (dishId: number) => {
      return state.variants.filter(v => v.dish_id === dishId);
    }
  }
})
