<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {useDishStore} from "@/stores/dish_store";

export default defineComponent({
  name: "DishesTable",
  data() {
    return {
      loading: false,
      dishes: []
    }
  },
  methods: {
    prettyAllergies(arr: string[]) {
      return arr.map(el => el.trim()).join(", ");
    }
  },
  computed: {
    ...mapStores(useDishStore),
  },
  async created() {
    this.loading = true;
    try {
      this.dishes = await this.dishStore.loadDishes();
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
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Description</th>
          <th class="border px-4 py-2">Price</th>
          <th class="border px-4 py-2">Category</th>
          <th class="border px-4 py-2">Allergens</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="dish in dishes" :key="dish.id">
          <td class="border px-4 py-2">{{ dish.id }}</td>
          <td class="border px-4 py-2">{{ dish.name }}</td>
          <td class="border px-4 py-2">{{ dish.description }}</td>
          <td class="border px-4 py-2">{{ dish.price }}</td>
          <td class="border px-4 py-2">{{ dish.category }}</td>
          <td class="border px-4 py-2">{{ prettyAllergies(dish.allergies) }}</td>
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
