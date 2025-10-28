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
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="nav-footer">
      <p class="user-profile">TURAL LIST</p>
      <ul class="footer-menu">
        <li>TYPOGRAPHY</li>
        <li>ICONS</li>
        <li>MAP</li>
        <li>NOTIFICATIONS</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SideNavbar',
  data() {
    return {
      navItems: [
        { name: 'Előnézet', path: '/admin', icon: 'fas fa-chart-line' },
        { name: 'Rendelések', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
        { name: 'Felhasználók', path: '/admin/users', icon: 'fas fa-users' },
        { name: 'Ételek', path: '/admin/dishes', icon: 'fas fa-utensils'},
        { name: 'Üzenetek', path: '/admin/contacts', icon: 'fas fa-utensils'},
        { name: 'Kuponok', path: '/admin/coupons', icon: 'fas fa-receipt' },
        { name: 'Rendezvények', path: '/admin/events', icon: 'fas fa-calendar' },
      ]
    }
  }
}
</script>

<style scoped>
.side-navbar {
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.logo-container {
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-container h1 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
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
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #34495e;
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
  border-top: 1px solid rgba(255,255,255,0.1);
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
  color: #bdc3c7;
}

.footer-menu li {
  padding: 5px;
}
</style>
