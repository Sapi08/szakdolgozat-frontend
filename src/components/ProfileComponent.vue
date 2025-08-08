<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { mapStores } from 'pinia'
import { useUserStore } from '@/stores/user_store.ts'

export default defineComponent({
  name: "ProfileComponent",
  computed: {
    ...mapStores(useUserStore)
  },
  setup(_, { expose }) {
    const userStore = useUserStore()


    onMounted(async () => {
      await userStore.userDetail()
    })

    expose({})
  }
})
</script>

<template>
  <div class="profile-container" v-if="userStore.user">
    <h2>Profil adatok</h2>
    <ul>
      <li><strong>Email:</strong> {{ userStore.user.email }}</li>
      <li><strong>Vezetéknév:</strong> {{ userStore.user.last_name }}</li>
      <li><strong>Keresztnév:</strong> {{ userStore.user.first_name }}</li>
      <li><strong>Telefonszám:</strong> {{ userStore.user.phone || 'Nincs megadva' }}</li>
      <li><strong>Születési dátum:</strong> {{ userStore.user.birth_date || 'Nincs megadva' }}</li>
      <li><strong>Pontok:</strong> {{ userStore.user.points ?? 0 }}</li>
    </ul>
  </div>

  <div v-else>
    <p>Betöltés...</p>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 20px auto;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.profile-container h2 {
  margin-bottom: 15px;
  color: #333;
}

.profile-container ul {
  list-style: none;
  padding: 0;
}

.profile-container li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.profile-container li strong {
  color: #fbaf32;
}
</style>
