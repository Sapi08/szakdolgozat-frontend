import { defineStore } from 'pinia'
import Dish from '@/models/dish'
import api from '@/config/axios'

interface CartItem {
  dishId: number
  variantId?: number | null
  quantity: number
}

interface CartItemWithDetails extends CartItem {
  dish: Dish
}

const CART_SESSION_KEY = 'shopping_cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    dishesCache: new Map<number, Dish>(), // Cache betöltött ételeket
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    cartItems: (state) => {
      // Visszaadja a cart itemeket a betöltött dish adatokkal
      return state.items.map(item => {
        const dish = state.dishesCache.get(item.dishId)
        return {
          ...item,
          dish: dish || new Dish(item.dishId, 'Loading...', '', 0, '', [])
        } as CartItemWithDetails
      })
    },
    // Csak a dishId és quantity-t küldjük a backendnek
    cartItemsForCheckout: (state) => {
      return state.items.map(item => ({
        dishId: item.dishId,
        variantId: item.variantId,
        quantity: item.quantity
      }))
    },
  },
  actions: {
    // Session betöltése
    loadFromSession() {
      try {
        const sessionData = sessionStorage.getItem(CART_SESSION_KEY)
        if (sessionData) {
          this.items = JSON.parse(sessionData) as CartItem[]
          console.log('Cart loaded from session:', this.items)

          // Betöltjük az ételek adatait az API-ból
          if (this.items.length > 0) {
            this.loadDishesFromApi()
          }
        }
      } catch (error) {
        console.error('Error loading cart from session:', error)
        this.items = []
      }
    },

    // Ételek adatainak betöltése az API-ból
    async loadDishesFromApi() {
      try {
        // Összegyűjtjük az egyedi dish ID-kat
        const dishIds = [...new Set(this.items.map(item => item.dishId))]

        console.log('Loading dishes from API:', dishIds)

        // Betöltjük az összes ételt (optimalizálható lenne dish ID szerinti lekérdezéssel)
        const response = await api.get('/dishes')
        const allDishes = response.data as Dish[]

        // Cache-eljük a kosárban lévő ételeket
        allDishes.forEach(dish => {
          if (dishIds.includes(dish.id)) {
            const dishObj = new Dish(
              dish.id,
              dish.name,
              dish.description,
              dish.price,
              dish.category,
              dish.allergies || [],
              dish.image
            )
            this.cacheDish(dishObj)
          }
        })

        console.log('Dishes loaded and cached:', this.dishesCache.size)
      } catch (error) {
        console.error('Error loading dishes from API:', error)
      }
    },

    // Session mentése
    saveToSession() {
      try {
        sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(this.items))
      } catch (error) {
        console.error('Error saving cart to session:', error)
      }
    },

    // Dish cache-elése
    cacheDish(dish: Dish) {
      this.dishesCache.set(dish.id, dish)
    },

    addToCart(dish: Dish) {
      // Ellenőrizzük, hogy van-e érvényes ár
      const priceNum = Number(dish.price)
      if (!dish.price || priceNum === 0 || isNaN(priceNum)) {
        console.warn('Cannot add dish without valid price:', dish)
        return
      }

      // Cache-eljük az ételt
      this.cacheDish(dish)

      // Ellenőrizzük, hogy van-e már ilyen tétel a kosárban
      const existingItem = this.items.find(item => item.dishId === dish.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        // Csak az ID-t és mennyiséget tároljuk
        this.items.push({
          dishId: dish.id,
          variantId: null,
          quantity: 1
        })
      }

      this.saveToSession()
      console.log('Added to cart, session saved')
    },

    updateQuantity(dishId: number, quantity: number) {
      const item = this.items.find(item => item.dishId === dishId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(dishId)
        } else {
          item.quantity = quantity
          this.saveToSession()
        }
      }
    },

    incrementQuantity(dishId: number) {
      const item = this.items.find(item => item.dishId === dishId)
      if (item) {
        item.quantity++
        this.saveToSession()
      }
    },

    decrementQuantity(dishId: number) {
      const item = this.items.find(item => item.dishId === dishId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
          this.saveToSession()
        } else {
          this.removeFromCart(dishId)
        }
      }
    },

    removeFromCart(dishId: number) {
      this.items = this.items.filter(item => item.dishId !== dishId)
      this.saveToSession()
    },

    clearCart() {
      this.items = []
      this.dishesCache.clear()
      sessionStorage.removeItem(CART_SESSION_KEY)
    },
  },
})
