<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useDishStore } from '@/stores/dish_store'
import type { Dish } from '@/types/dish'
import EditableTableComponent, { type TableColumn } from '@/components/admin/EditableTableComponent.vue'

export default defineComponent({
  name: 'DishesTable',
  components: { EditableTableComponent },
  data() {
    return {
      loading: false,
      dishes: [] as Dish[],
      columns: [
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Name', editable: true },
        { key: 'description', label: 'Description', editable: true },
        { key: 'price', label: 'Price', editable: true, type: 'number' },
        { key: 'category', label: 'Category', editable: true },
        { key: 'allergies', label: 'Allergens', editable: true, type: 'array', format: (val: string[]) => val?.join(', ') || '' },
      ] as TableColumn[],
    }
  },
  methods: {
    async handleSave(updatedDish: Dish) {
      try {
        await this.dishStore.updateDish(updatedDish.id, updatedDish)
        const index = this.dishes.findIndex(d => d.id === updatedDish.id)
        if (index !== -1) {
          this.dishes[index] = updatedDish
        }
        alert('Étel sikeresen mentve')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a mentés során!')
      }
    },
    async handleDelete(id: number) {
      try {
        await this.dishStore.deleteDish(id)
        this.dishes = this.dishes.filter(d => d.id !== id)
        alert('Étel sikeresen törölve')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a törlés során!')
      }
    }
  },
  computed: {
    ...mapStores(useDishStore),
  },
  async created() {
    this.loading = true
    try {
      this.dishes = await this.dishStore.loadDishes()
    } finally {
      this.loading = false
    }
  },
})
</script>

<template>
  <div class="table-container">
    <EditableTableComponent
      :loading="loading"
      :items="dishes"
      :columns="columns"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.table-container {
  margin-left: 300px;
}
</style>
