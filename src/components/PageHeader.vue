<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Az útvonalnevekhez tartozó címek
const pageTitle = computed(() => {
  const titles = {
    about: "Rólunk",
    services: "Szolgáltatások",
    menu: "Étlap",
    contact: "Kapcsolat",
    event_booking: "Rendezvény",
    cart: "Kosár",
    gallery: "Galéria",
    profile: "Profil",
  };
  return titles[route.name] || "Page Not Found";
});
</script>

<template>
  <div class="page-header">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>{{ pageTitle }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  position: relative;
  margin-bottom: 45px;
  padding: 150px 0 90px 0;
  text-align: center;
  background: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url('@/assets/pictures/page-header.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.page-header h2 {
  position: relative;
  color: #fbaf32;
  font-size: 60px;
  font-weight: 700;
}
.page-header a {
  position: relative;
  padding: 0 12px;
  font-size: 20px;
  text-transform: uppercase;
  color: #ffffff;
}
.page-header a:hover {
  color: #ffffff;
}
.page-header a::after {
  position: absolute;
  content: "/";
  width: 8px;
  height: 8px;
  top: -1px;
  right: -7px;
  text-align: center;
  color: #fbaf32;
}
.page-header a:last-child::after {
  display: none;
}


@media (max-width: 767.98px) {
  .page-header h2 {
    font-size: 35px;
  }

  .page-header a {
    font-size: 18px;
  }
}
</style>
