import { createRouter, createWebHistory } from 'vue-router'
import Registration from '@/views/Registration.vue'
import About from '@/views/About.vue'
import Home from '@/views/Home.vue'
import Services from '@/views/Services.vue'
import Menu from '@/views/Menu.vue'
import Contact from '@/views/Contact.vue'
import EventBooking from '@/views/EventBooking.vue'
import Login from '@/views/Login.vue'
import Cart from '@/views/Cart.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import Dishes from '@/views/admin/Dishes.vue'
import Users from '@/views/admin/Users.vue'
import Gallery from '@/views/Gallery.vue'
import Profile from '@/views/Profile.vue'
import Orders from '@/views/admin/Orders.vue'
import Coupons from '@/views/admin/Coupons.vue'
import Events from '@/views/admin/Events.vue'
import Contacts from '@/views/admin/Contacts.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'
import NewPassword from '@/views/NewPassword.vue'
import PaymentSuccess from '@/views/PaymentSuccess.vue'
import PaymentCancelled from '@/views/PaymentCancelled.vue'

import {useUserStore} from '@/stores/user_store.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: UserLayout,
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'registration', name: 'registration', component: Registration },
        { path: 'login', name: 'login', component: Login },
        { path: 'forget_pass', name: 'forget_pass', component: ForgetPassword },
        { path: 'new_pass', name: 'new_pass', component: NewPassword },
        { path: 'about', name: 'about', component: About },
        { path: 'services', name: 'services', component: Services },
        { path: 'menu', name: 'menu', component: Menu },
        { path: 'contact', name: 'contact', component: Contact },
        { path: 'event_booking', name: 'event_booking', component: EventBooking },
        { path: 'cart', name: 'cart', component: Cart },
        { path: 'gallery', name: 'gallery', component: Gallery },
        { path: 'profile', name: 'profile', component: Profile },
        { path: 'payment_success', name: 'payment_success', component: PaymentSuccess },
        { path: 'payment_cancelled', name: 'payment_cancelled', component: PaymentCancelled },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: '', name: 'dashboard', component: Dashboard },
        { path: 'orders', name: 'orders', component: Orders },
        { path: 'users', name: 'users', component: Users },
        { path: 'dishes', name: 'dishes', component: Dishes },
        { path: 'contacts', name: 'contacts', component: Contacts },
        { path: 'coupons', name: 'coupons', component: Coupons },
        { path: 'events', name: 'events', component: Events },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {

  const userStore = useUserStore()

  const requiresAdmin = to.matched.some((record) => (record.meta as any)?.requiresAdmin)

  if (requiresAdmin) {
    // Ha nincs admin jog, redirect home
    if (!userStore.isAdmin) {
      return next({ name: 'home' })
    }
  }

  return next()
})

export default router
