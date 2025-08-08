<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user_store.ts";
import moment from "moment";

export default defineComponent({
  name: "UsersTable",
  data() {
    return {
      loading: false,
      users: []
    }
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    formatDate(date:string){
      return moment(String(date)).format('YYYY.MM.DD hh:mm')
    }
  },
  async created() {
    this.loading = true;
    try {
      this.users = await this.userStore.loadUsers();
    } finally {
      this.loading = false;
    }
  }
})
</script>

<template>
  <div>
    <template v-if="loading">
      Loading....
    </template>
    <template v-else>
      <table class="min-w-full border border-gray-300">
        <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Vezetéknév</th>
          <th class="border px-4 py-2">Keresztnév</th>
          <th class="border px-4 py-2">Email cím</th>
          <th class="border px-4 py-2">Utolsó bejelentkezés</th>
          <th class="border px-4 py-2">Telefon</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="border px-4 py-2">{{ user.id }}</td>
          <td class="border px-4 py-2">{{ user.last_name }}</td>
          <td class="border px-4 py-2">{{ user.first_name }}</td>
          <td class="border px-4 py-2">{{ user.email }}</td>
          <td class="border px-4 py-2">{{ formatDate(user.last_login ) }}</td>
          <td class="border px-4 py-2">{{ user.phone }}</td>
        </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  margin-left: 300px;
}
</style>
