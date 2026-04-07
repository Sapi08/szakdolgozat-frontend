import { defineStore } from 'pinia'
import type { Dish } from '@/types/dish'
import api from '@/config/axios'
import type { DishVariant } from '@/types/dish-variant'

interface CartItem {
  cartKey: string // Egyedi azonosító: `dishId` vagy `dishId-variantId`
  dishId: number
  variantId?: number
  quantity: number
  // A variáns adatait ide mentjük, hogy a refresh után is meglegyenek
  variantDetails?: {
    name: string
    price: number
  }
}

interface CartItemWithDetails extends CartItem {
  dish: Dish
}

const CART_SESSION_KEY = 'shopping_cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    dishesCache: new Map<number, Dish>(), // Cache betöltött ételeket
    // Új cache a variánsoknak, bár lehet nem is kell, ha a session-be mentünk
    variantsCache: new Map<number, DishVariant[]>(),
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    cartItems: (state) => {
      return state.items.map((item) => {
        const baseDish = state.dishesCache.get(item.dishId)

        // Létrehozunk egy másolatot, hogy ne írjuk felül a cache-t
        const finalDish: Dish = JSON.parse(JSON.stringify(baseDish || {}))

        if (item.variantId && item.variantDetails) {
          finalDish.name = `${baseDish?.name} (${item.variantDetails.name})`
          finalDish.price = item.variantDetails.price
          finalDish.has_variants = false // Ez már egy konkrét, kiválasztott variáns
        }

        return {
          ...item,
          dish: finalDish.id
            ? finalDish
            : {
                id: item.dishId,
                name: 'Betöltés...',
                description: '',
                price: 0,
                category: '',
                allergies: [],
                has_variants: false,
              },
        } as CartItemWithDetails
      })
    },
    cartItemsForCheckout: (state) => {
      return state.items.map((item) => ({
        dish_id: item.dishId,
        quantity: item.quantity,
      }))
    },
  },
  actions: {
    // Session betöltése
    async loadFromSession() {
      const sessionData = sessionStorage.getItem(CART_SESSION_KEY)
      if (sessionData) {
        this.items = JSON.parse(sessionData) as CartItem[]
        console.log('🛒 Cart loaded from session:', this.items)
        // A háttérben, nem blokkoló módon frissítjük a hiányzó alap étel adatokat
        this.loadDishesFromApi()
      }
    },

    // Ételek adatainak betöltése az API-ból (csak a hiányzóké)
    async loadDishesFromApi() {
      // Csak azokat az ID-kat gyűjtjük össze, amik még nincsenek a cache-ben
      const missingDishIds = [
        ...new Set(this.items.map((item) => item.dishId).filter((id) => !this.dishesCache.has(id))),
      ]

      if (missingDishIds.length === 0) {
        console.log('✅ All dish details are already in cache.')
        return
      }

      try {
        console.log('⏳ Loading missing dish details from API for IDs:', missingDishIds)
        const response = await api.get('dishes/') // Feltételezzük, hogy ez az összes ételt visszaadja
        const allDishes = response.data as Dish[]

        allDishes.forEach((dish) => {
          // Betöltjük a cache-be azokat, amikre szükségünk van
          if (missingDishIds.includes(dish.id)) {
            this.cacheDish(dish)
          }
        })
        console.log('✅ Missing dish details loaded and cached.')
      } catch (error) {
        console.error('❌ Error loading missing dish details:', error)
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

    addToCart(dish: Dish, variant?: DishVariant) {
      const priceNum = Number(variant ? variant.price : dish.price)
      if (isNaN(priceNum) || priceNum === 0) {
        console.warn('Érvénytelen árral nem lehet kosárba tenni:', dish, variant)
        return
      }

      // Az alap étel adatait mindig cache-eljük, ha még nincsenek
      if (!this.dishesCache.has(dish.id)) {
        this.cacheDish(dish)
      }

      const cartKey = variant ? `${dish.id}-${variant.id}` : `${dish.id}`
      const existingItem = this.items.find((item) => item.cartKey === cartKey)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          cartKey: cartKey,
          dishId: dish.id,
          quantity: 1,
          variantId: variant?.id,
          variantDetails: variant
            ? { name: variant.detail, price: Number(variant.price) }
            : undefined,
        })
      }

      this.saveToSession()
      console.log('🛍️ Item added/updated in cart, session saved.')
    },

    incrementQuantity(cartKey: string) {
      const item = this.items.find((item) => item.cartKey === cartKey)
      if (item) {
        item.quantity++
        this.saveToSession()
      }
    },

    decrementQuantity(cartKey: string) {
      const item = this.items.find((item) => item.cartKey === cartKey)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
          this.saveToSession()
        } else {
          this.removeFromCart(cartKey) // Ha 1-ről csökkentjük, töröljük
        }
      }
    },

    removeFromCart(cartKey: string) {
      this.items = this.items.filter((item) => item.cartKey !== cartKey)
      this.saveToSession()
    },

    clearCart() {
      this.items = []
      this.dishesCache.clear()
      sessionStorage.removeItem(CART_SESSION_KEY)
    },
  },
})
