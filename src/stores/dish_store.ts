import {defineStore} from "pinia";
import api from "@/config/axios.ts"
import type Dish from '@/models/dish.ts'

export const useDishStore = defineStore("dish", {
  state: () => ({
    dishses: [] as Dish[],
  }),
  actions: {
    async loadDishes() {
      const x = await api.get("/dishes");
      this.dishses = x.data as Dish[];
      return x.data;
    }
  }
})
