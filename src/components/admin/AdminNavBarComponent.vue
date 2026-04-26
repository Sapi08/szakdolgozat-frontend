<script lang="ts">
import { useAdminBookingStore } from '@/stores/admin/admin_booking_store'
import { useAdminContactStore } from '@/stores/admin/admin_contact_store'
import { useAdminOrderStore } from '@/stores/admin/admin_order_store.ts'

export default {
  name: 'SideNavbar',
  data() {
    return {
      bookingStore: useAdminBookingStore(),
      contactStore: useAdminContactStore(),
      orderStore: useAdminOrderStore(),
      navItems: [
        { name: 'Statisztikák', path: '/admin', icon: 'fas fa-chart-line' },
        { name: 'Rendelések', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
        { name: 'Felhasználók', path: '/admin/users', icon: 'fas fa-users' },
        { name: 'Ételek', path: '/admin/dishes', icon: 'fas fa-utensils' },
        { name: 'Üzenetek', path: '/admin/contacts', icon: 'fas fa-utensils' },
        { name: 'Kuponok', path: '/admin/coupons', icon: 'fas fa-receipt' },
        { name: 'Rendezvények', path: '/admin/events', icon: 'fas fa-calendar' },
      ],
    }
  },
  mounted() {
    this.bookingStore.fetchBookings()
    this.contactStore.loadContacts()
    this.orderStore.fetchPendingOrdersCount()
  }
}
</script>

<template>
  <div class="side-navbar">
    <div class="logo-container">
      <h1>PizzaHáz Admin</h1>
    </div>

    <nav class="main-nav">
      <ul class="nav-list">
        <li class="nav-item" v-for="item in navItems" :key="item.name">
          <router-link :to="item.path" class="nav-link">
            <span class="nav-icon" v-if="item.icon">
              <i :class="item.icon"></i>
            </span>
            <span class="nav-text">{{ item.name }}</span>
            <span
              v-if="item.name === 'Rendelések' && orderStore.getPendingOrdersCount > 0"
              class="badge badge-unhandled"
            >
              <i class="fas fa-exclamation-circle" style="margin-right: 4px; font-size: 0.7rem;"></i>{{ orderStore.getPendingOrdersCount }}
            </span>
            <span
              v-if="item.name === 'Rendezvények' && bookingStore.unhandledCount > 0"
              class="badge badge-unhandled"
            >
              <i class="fas fa-exclamation-circle" style="margin-right: 4px; font-size: 0.7rem;"></i>{{ bookingStore.unhandledCount }}
            </span>
            <span
              v-if="item.name === 'Rendezvények' && bookingStore.unseenCount > 0"
              class="badge badge-unseen"
              style="margin-left: 4px;"
            >
              <i class="fas fa-bell" style="margin-right: 4px; font-size: 0.7rem;"></i>{{ bookingStore.unseenCount }}
            </span>
            <span
              v-if="item.name === 'Üzenetek' && contactStore.unseenCount > 0"
              class="badge badge-unseen"
            >
              <i class="fas fa-envelope" style="margin-right: 4px; font-size: 0.7rem;"></i>{{ contactStore.unseenCount }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="nav-footer">
      <p class="user-profile">INFO</p>
      <ul class="footer-menu">
        <li><a href="/" style="color: black">---- PUBLIKUS OLDAL ----</a></li>
      </ul>
      <br>
      <p>Segítég: +36301231234</p>
    </div>
  </div>
</template>

<style scoped>
.side-navbar {
  width: 250px;
  height: 100vh;
  background-color: #e8786f;
  color: #000000;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.logo-container {
  padding: 20px;
  border-bottom: 1px solid rgb(32, 32, 32);
}

.logo-container h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #000000;
}

.main-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #000000;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #fc9403;
  color: #ffffff;
}

.nav-link.router-link-exact-active {
  color: white;
}

.nav-icon {
  margin-right: 15px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 0.9rem;
}

.nav-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.8rem;
  color: #000000;
}

.footer-menu li {
  padding: 5px;
}

.badge {
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  /* A margin-left: auto tolja ki a jobb szélre a flex konténeren belül */
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 22px;
}

.badge-unhandled {
  background-color: #0085dd;
}

.badge-unseen {
  background-color: #dc3545;
}
</style>
