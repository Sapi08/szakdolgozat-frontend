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
      showAllergensModal: false,
      currentEditForm: null as any,
      columns: [
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Name', editable: true },
        { key: 'description', label: 'Description', editable: true },
        { key: 'price', label: 'Price', editable: true, type: 'number' },
        { key: 'category', label: 'Category', editable: true },
        { key: 'allergies', label: 'Allergens', editable: true, type: 'array', format: (val: string[]) => val?.join(', ') || '' },
        { key: 'available', label: 'Elérhető', editable: false },
      ] as TableColumn[],
    }
  },
  computed: {
    ...mapStores(useDishStore),
    uniqueCategories(): string[] {
      const categories = new Set(this.dishes.map(d => d.category).filter(Boolean))
      return Array.from(categories) as string[]
    },
    availableAllergens(): string[] {
      if (this.dishStore.allergens && this.dishStore.allergens.length > 0) {
        return this.dishStore.allergens
      }

      // Fallback: get all unique allergens currently used in dishes
      const uniqueAllergens = new Set<string>()
      this.dishes.forEach(d => {
        if (Array.isArray(d.allergies)) {
          d.allergies.forEach(a => uniqueAllergens.add(a))
        }
      })
      return Array.from(uniqueAllergens)
    }
  },
  methods: {
    openAllergensModal(editForm: any) {
      this.currentEditForm = editForm
      if (!Array.isArray(this.currentEditForm.allergies)) {
        this.currentEditForm.allergies = []
      }
      this.showAllergensModal = true
    },
    closeAllergensModal() {
      this.showAllergensModal = false
      this.currentEditForm = null
    },
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
    },
    async toggleAvailability(dish: Dish) {
      try {
        // Az eredeti értéket azonnal átállítjuk (optimista frissítés)
        const oldVal = dish.available
        dish.available = !dish.available

        await this.dishStore.toggleDishAvailability(dish.id)
      } catch (err) {
        console.error(err)
        alert('Hiba történt az elérhetőség módosításakor!')
        // Visszaállítjuk hiba esetén
        dish.available = !dish.available
      }
    }
  },
  async created() {
    this.loading = true
    try {
      await Promise.all([
        this.dishStore.loadDishes().then(data => this.dishes = data),
        this.dishStore.loadAllergens()
      ])
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
    >
      <template #edit-category="{ editForm }">
        <select v-model="editForm.category" class="border p-1 w-full">
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </template>
      <template #edit-allergies="{ editForm }">
        <button @click.prevent="openAllergensModal(editForm)" class="bg-gray-200 border p-1 w-full text-left rounded cursor-pointer hover:bg-gray-300">
          {{ editForm.allergies?.length ? editForm.allergies.join(', ') : 'Allergének kiválasztása...' }}
        </button>
      </template>
      <template #cell-available="{ item }">
        <button
          @click.stop="toggleAvailability(item)"
          class="rounded px-2 py-1 text-white border-0 cursor-pointer"
          :style="{ backgroundColor: item.available !== false ? '#4ade80' : '#ef4444' }"
        >
          {{ item.available !== false ? 'Igen' : 'Nem' }}
        </button>
      </template>
    </EditableTableComponent>

    <!-- TODO: Allergén stringként mentotjon a db-be dish tablebe -->
    <!-- TODO: Kategory stringként mentotjon a db-be dish tablebe -->
    <!-- Allergének Modal -->
    <div v-if="showAllergensModal" class="modal-overlay" @click="closeAllergensModal">
      <div class="modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeAllergensModal">&times;</button>
        <h3>Allergének szerkesztése</h3>
        <div class="allergens-list">
          <label v-for="allergen in availableAllergens" :key="allergen" class="allergen-item">
            <input type="checkbox" :value="allergen" v-model="currentEditForm.allergies" />
            <span>{{ allergen }}</span>
          </label>
        </div>
        <div class="modal-actions">
          <button @click="closeAllergensModal" class="bg-blue-500 text-white px-4 py-2 rounded">Kész</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  margin-left: 300px;
}

/* Modal styles based on previous AdminEventBooking component */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-modal-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-modal-btn:hover {
  color: #000;
}

.allergens-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.allergen-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
