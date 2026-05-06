<script lang="ts">
import { defineComponent } from 'vue'
import AdminNavBarComponent from '@/components/admin/AdminNavBarComponent.vue'
import { useAdminBookingStore } from '@/stores/admin/admin_booking_store'
import { useAdminContactStore } from '@/stores/admin/admin_contact_store'
import { useAdminOrderStore } from '@/stores/admin/admin_order_store'

export default defineComponent({
  name: 'AdminLayout',
  components: {
    AdminNavBarComponent,
  },
  data() {
    return {
      intervalId: null as number | null,
      bookingStore: useAdminBookingStore(),
      contactStore: useAdminContactStore(),
      orderStore: useAdminOrderStore(),
    }
  },
  mounted() {
    // 1. Azonnali lekérés az adminba való belépéskor
    this.refreshData()

    // 2. 10 másodpercenként ismétlődő lekérés beállítása
    this.intervalId = window.setInterval(() => {
      this.refreshData()
    }, 10000)
  },
  unmounted() {
    // 3. Nagyon fontos: törölni kell az időzítőt, ha a user kilép az adminból
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    async refreshData() {
      // Ide jöhet minden store lekérdezés, amit frissen akarsz tartani
      await Promise.all([
        this.bookingStore.adminFetchBookings(),
        this.contactStore.adminLoadContacts(),
        this.orderStore.adminFetchOrders(),
        this.orderStore.fetchPendingOrdersCount(),
      ])

      this.checkNotifications()
    },
    checkNotifications() {
      // Összeszámoljuk van-e bármilyen feldolgozatlan / új dolog
      const currentUnseenBookings = this.bookingStore.unseenCount
      const currentUnseenContacts = this.contactStore.unseenCount
      const currentPendingOrders = this.orderStore.pendingOrders.length

      const hasUnseen =
        currentUnseenBookings > 0 ||
        currentUnseenContacts > 0 ||
        currentPendingOrders > 0

      if (hasUnseen) {
        this.playNotificationSound()
      }
    },
    playNotificationSound() {
      try {
        const audio = new Audio('/src/assets/sounds/mixkit-software-interface-start-2574.wav')
        const playPromise = audio.play()

        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Ha a felhasználó még nem interaktált a DOM-mal, a böngésző blokkolhatja
            console.log('Hang lejátszása blokkolva a böngésző által:', err)
          })
        }
      } catch (err) {
        console.error('Error creating audio:', err)
      }
    }
  },
})
</script>

<template>
  <AdminNavBarComponent />
  <RouterView />
</template>

<style scoped></style>
