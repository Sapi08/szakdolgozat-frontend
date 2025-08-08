import {defineStore} from "pinia";
import api from "@/config/axios.ts"

export const useDishStore = defineStore("dish", {
  state: () => ({
    dishses: [] as any[],
  }),
  actions: {
    async loadDishes() {
      const x = await api.get("/dishes");
      this.dishses = x.data as any[];
      return x.data;
    }
  }
})
