import { createRouter, createWebHistory } from 'vue-router'
import Registration from "@/views/Registration.vue"
import About from "@/views/About.vue"
import Home from "@/views/Home.vue"
import Services from "@/views/Services.vue"
import Menu from "@/views/Menu.vue"
import Contact from "@/views/Contact.vue"
import EventBooking from "@/views/EventBooking.vue"
import Login from "@/views/Login.vue"
import Cart from "@/views/Cart.vue"
import UserLayout from "@/layouts/UserLayout.vue"
import AdminLayout from "@/layouts/AdminLayout.vue";
import Dashboard from "@/views/admin/Dashboard.vue";
import Dishes from "@/views/admin/Dishes.vue";
import Users from "@/views/admin/Users.vue";
import Gallery from "@/views/Gallery.vue";
import Profile from '@/views/Profile.vue'
import Orders from '@/views/admin/Orders.vue'
import Coupons from '@/views/admin/Coupons.vue'
import Events from '@/views/admin/Events.vue'
import Contacts from '@/views/admin/Contacts.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: UserLayout,
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'registration', name: 'registration', component: Registration },
        { path: 'about', name: 'about', component: About },
        { path: 'services', name: 'services', component: Services },
        { path: 'menu', name: 'menu', component: Menu },
        { path: 'contact', name: 'contact', component: Contact },
        { path: 'event_booking', name: 'event_booking', component: EventBooking },
        { path: 'login', name: 'login', component: Login },
        { path: 'cart', name: 'cart', component: Cart },
        { path: 'gallery', name: 'gallery', component: Gallery },
        { path: 'profile', name: 'profile', component: Profile },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'dashboard', component: Dashboard },
        { path: 'orders', name: 'orders', component: Orders },
        { path: 'users', name: 'users', component: Users },
        { path: 'dishes', name: 'dishes', component: Dishes },
        { path: 'contacts', name: 'contacts', component: Contacts },
        { path: 'coupons', name: 'coupons', component: Coupons },
        { path: 'events', name: 'events', component: Events },

      ],
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
