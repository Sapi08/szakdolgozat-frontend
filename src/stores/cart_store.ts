import { defineStore } from 'pinia'
import Dish from '@/models/dish'

interface CartItem {
  dish: Dish
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0),
    cartItems: (state) => state.items,
  },
  actions: {
    addToCart(dish: Dish) {
      console.log(dish)
      const existingItem = this.items.find(item => item.dish.id === dish.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ dish, quantity: 1 } as CartItem)
      }

      console.log(`Added to cart: ${dish.id}`)
      console.log(this.items)
    },
    removeFromCart(dishId: number) {
      this.items = this.items.filter(item => item.dish.id !== dishId)
    },
    clearCart() {
      this.items = []
    },
  },
})
