<script lang="ts">
import {defineComponent} from 'vue'
import { useUserStore } from '@/stores/user_store'

export default defineComponent({
  name: "MenuComponent",
  computed: {
    isLoggedIn(): boolean {
      const store = useUserStore()
      return !!store.user
    }
  },
  methods: {
    isActive(path: string): boolean {
      return this.$route.path === path;
    },
    logout() {
      const store = useUserStore()
      store.logout()
      this.$router.push("/")
    }
  }
})
</script>

<template>
  <div class="navbar navbar-expand-lg bg-light navbar-light">
    <div class="container-fluid">
      <img src="../assets/icons/pizzahaz_logo_teto.png" alt="" width="70" height="70">
      <router-link to="/" class="navbar-brand">Pizzaház<br><span>Hódmezővásásrhely</span></router-link>
      <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
        <div class="navbar-nav ps-5">
          <router-link to="/" class="nav-item nav-link" :class="isActive('/')?'active':''">Főoldal</router-link>
          <router-link to="/about" class="nav-item nav-link" :class="isActive('/about')?'active':''">Rólunk</router-link>
          <router-link to="/gallery" class="nav-item nav-link" :class="isActive('/gallery')?'active':''">Galéria</router-link>
          <router-link to="/services" class="nav-item nav-link" :class="isActive('/services')?'active':''">Szolgáltatások</router-link>
          <router-link to="/menu" class="nav-item nav-link" :class="isActive('/menu')?'active':''">Étlap</router-link>
          <router-link to="/event_booking" class="nav-item nav-link" :class="isActive('/event_booking')?'active':''">Rendezvény</router-link>
          <router-link to="/contact" class="nav-item nav-link" :class="isActive('/contact')?'active':''">Kapcsolat</router-link>
        </div>
      </div>
      <div v-if="!isLoggedIn">
        <router-link to="/login" class="loginbutton">Belépés</router-link>
        <router-link to="/registration" class="registerbutton">Regisztráció</router-link>
      </div>
      <div>
        <router-link to="/cart"><i class="fa fa-shopping-cart cartbutton" aria-hidden="true"></i></router-link>
      </div>
      <div v-if="isLoggedIn" class="user-actions">
        <router-link to="/profile"><i class="fa fa-user-circle cartbutton" aria-hidden="true"></i></router-link>
        <button class="logoutbutton" @click="logout">Kijelentkezés</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  transition: .5s;
  z-index: 999;
}
.nav-sticky {
  position: fixed !important;
  top: 0 !important;
  width: 100% !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .3) !important;
}
.navbar .navbar-brand {
  padding-top: 20px;
  padding-left: 20px;
  margin: 0;
  color: #fbaf32;
  font-size: 45px;
  line-height: 20px;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  transition: .5s;
}
.navbar .navbar-brand span {
  color: #e76c63;
  font-size: 20px;
}
.navbar .navbar-brand:hover {
  color: #fbaf32;
}
.navbar .navbar-brand:hover span {
  color: #fbaf32;
}
.navbar .navbar-brand img {
  max-width: 100%;
  max-height: 40px;
}
@media (min-width: 992px) {
  .navbar {
    position: absolute;
    width: 100%;
    padding: 30px 60px;
    background: transparent !important;
    z-index: 9;
  }

  .navbar.nav-sticky {
    padding: 10px 60px;
    background: #ffffff !important;
  }

  .navbar .navbar-brand {
    color: #fbaf32;
  }

  .navbar.nav-sticky .navbar-brand {
    color: #fbaf32;
  }

  .navbar-light .navbar-nav .nav-link,
  .navbar-light .navbar-nav .nav-link:focus {
    padding: 10px 10px 8px 10px;
    font-family: 'Nunito', sans-serif;
    color: #e86a61;
    font-size: 18px;
    font-weight: 600;
  }

  .navbar-light.nav-sticky .navbar-nav .nav-link,
  .navbar-light.nav-sticky .navbar-nav .nav-link:focus {
    color: #e86a61;
  }

  .navbar-light .navbar-nav .nav-link:hover,
  .navbar-light .navbar-nav .nav-link.active {
    color: #fbaf32;
  }

  .navbar-light.nav-sticky .navbar-nav .nav-link:hover,
  .navbar-light.nav-sticky .navbar-nav .nav-link.active {
    color: #fbaf32;
  }
}

@media (max-width: 991.98px) {
  .navbar {
    padding: 15px;
    background: #ffffff !important;
  }

  .navbar .navbar-brand {
    color: #fbaf32;
  }

  .navbar .navbar-nav {
    margin-top: 15px;
  }

  .navbar a.nav-link {
    padding: 5px;
  }

  .navbar .dropdown-menu {
    box-shadow: none;
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.registerbutton {
  background-color: #e86a61;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  margin-left: 18px;
  border: none;
  cursor: pointer;
  width: 15%;
  opacity: 0.9;
  border-radius: 10px;
}

.registerbutton:hover {
  opacity: 1;
}
.loginbutton {
  background-color: #fbaf32;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  margin-left: 18px;
  border: none;
  cursor: pointer;
  width: 15%;
  opacity: 0.9;
  border-radius: 10px;
}

.loginbutton:hover {
  opacity: 1;
}

.cartbutton {
  background-color: #fbaf32;
  color: white;
  padding: 16px;
  margin: 8px 0;
  margin-left: 18px;
  border: none;
  cursor: pointer;
  opacity: 0.9;
  border-radius: 10px;
  transition: opacity 1s ease;
}

.cartbutton:hover {
  opacity: 1;
}

.logoutbutton {
  background-color: #e86a61;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  margin-left: 18px;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
  border-radius: 10px;
}
.logoutbutton:hover {
  opacity: 1;
}
</style>
