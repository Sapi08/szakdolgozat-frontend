<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useDishStore } from '@/stores/dish_store'
import { useAdminDishStore } from '@/stores/admin/admin_dish_store'
import { useAdminDishVariantStore } from '@/stores/admin/admin_dish_variant_store'
import type { Dish } from '@/types/dish'
import type { DishVariant } from '@/types/dish-variant'
import EditableTableComponent, { type TableColumn } from '@/components/admin/EditableTableComponent.vue'

export default defineComponent({
  name: 'DishesTable',
  components: { EditableTableComponent },
  data() {
    return {
      adminDishStore: useAdminDishStore(),
      adminDishVariantStore: useAdminDishVariantStore(),
      loading: false,
      dishes: [] as Dish[],
      showAllergensModal: false,
      showCreateDishModal: false,
      showCreateDishVariantModal: false,
      showViewVariantsModal: false,
      currentDishForVariants: null as Dish | null,
      currentDishVariants: [] as DishVariant[],
      variantLoading: false,
      currentEditForm: null as any,
      newDish: {
        name: '',
        description: '',
        price: 0,
        category_id: '',
        allergies: [] as string[],
        available: true
      },
      newDishVariant: {
        dish_id: null as number | null,
        detail: '',
        price: 0
      },
      columns: [
        { key: 'id', label: 'Azonosító', editable: false },
        { key: 'name', label: 'Név', editable: true },
        { key: 'description', label: 'Leírás', editable: true },
        { key: 'price', label: 'Ár', editable: true, type: 'number' },
        { key: 'category_id', label: 'Kategória', editable: true },
        { key: 'allergies', label: 'Allergének', editable: true, type: 'array', format: (val: string[]) => val?.join(', ') || '' },
        { key: 'available', label: 'Elérhető', editable: false },
      ] as TableColumn[],
    }
  },
  computed: {
    ...mapStores(useDishStore),
    availableCategories(): string[] {
      return this.adminDishStore.categories
    },
    availableAllergens(): string[] {
      return this.adminDishStore.allergens
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
    openCreateDishModal() {
      this.newDish = {
        name: '',
        description: '',
        price: 0,
        category_id: this.availableCategories[0] || '',
        allergies: [],
        available: true
      }
      this.showCreateDishModal = true
    },
    closeCreateModal() {
      this.showCreateDishModal = false
    },
    openCreateDishVariantModal() {
      this.newDishVariant = {
        dish_id: this.dishes.length > 0 ? this.dishes[0].id : null,
        detail: '',
        price: 0
      }
      this.showCreateDishVariantModal = true
    },
    closeCreateVariantModal() {
      this.showCreateDishVariantModal = false
    },
    async openViewVariantsModal(dish: Dish) {
      this.currentDishForVariants = dish
      this.showViewVariantsModal = true
      this.variantLoading = true
      try {
        const variants = await this.adminDishVariantStore.adminLoadVariantsForDish(dish.id)
        this.currentDishVariants = variants
      } catch (err) {
        console.error(err)
        alert('Hiba történt a variánsok betöltésekor!')
      } finally {
        this.variantLoading = false
      }
    },
    closeViewVariantsModal() {
      this.showViewVariantsModal = false
      this.currentDishForVariants = null
      this.currentDishVariants = []
    },
    async deleteVariant(variantId: number) {
      if (!confirm('Biztosan törölni szeretné ezt a variánst?')) return
      try {
        await this.adminDishVariantStore.adminDeleteDishVariant(variantId)
        this.currentDishVariants = this.currentDishVariants.filter(v => v.id !== variantId)
      } catch (err) {
        console.error(err)
        alert('Hiba történt a törlés során!')
      }
    },
    async handleCreateDishVariant() {
      if (!this.newDishVariant.dish_id) {
        alert('Kérjük válasszon egy ételt!')
        return
      }
      try {
        await this.adminDishVariantStore.adminCreateDishVariant(this.newDishVariant)
        this.closeCreateVariantModal()
        alert('Étel adag méret (variáns) sikeresen létrehozva')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a létrehozás során!')
      }
    },
    async handleCreateDish() {
      try {
        await this.adminDishStore.adminCreateDish(this.newDish)
        this.dishes = [...this.dishStore.dishes]
        this.closeCreateModal()
        alert('Étel sikeresen létrehozva')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a létrehozás során!')
      }
    },
    async handleSave(updatedDish: Dish) {
      try {
        await this.adminDishStore.adminUpdateDish(updatedDish.id, updatedDish)
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
        await this.adminDishStore.adminDeleteDish(id)
        this.dishes = this.dishes.filter(d => d.id !== id)
        alert('Étel sikeresen törölve')
      } catch (err) {
        console.error(err)
        alert('Hiba történt a törlés során!')
      }
    },
    async toggleAvailability(dish: Dish) {
      try {
        dish.available = !dish.available
        await this.adminDishStore.adminToggleDishAvailability(dish.id)
      } catch (err) {
        console.error(err)
        alert('Hiba történt az elérhetőség módosításakor!')
        dish.available = !dish.available
      }
    }
  },
  async created() {
    this.loading = true
    try {
      await Promise.all([
        this.dishStore.loadDishes().then((data: any) => (this.dishes = data)),
        this.adminDishStore.adminLoadAllergens(),
        this.adminDishStore.adminLoadCategories()
      ])
    } finally {
      this.loading = false
    }
  },
})
</script>

<template>
  <div class="table-container">
    <div class="header-actions">
      <button @click="openCreateDishVariantModal" class="add-btn">Új étel adag méret hozzáadása</button>
      <button @click="openCreateDishModal" class="add-btn">Új étel hozzáadása</button>
    </div>

    <EditableTableComponent
      :loading="loading"
      :items="dishes"
      :columns="columns"
      @save="handleSave"
      @delete="handleDelete"
    >
      <template #cell-category_id="{ item }">
        {{ item.category_id || item.category || '-' }}
      </template>
      <template #edit-category_id="{ editForm }">
        <select v-model="editForm.category_id" class="border p-1 w-full text-black bg-white">
          <option v-for="cat in availableCategories" :key="cat" :value="cat">
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
      <template #extra-actions="{ item }">
        <button @click.stop="openViewVariantsModal(item)" class="bg-purple-500 text-black px-2 py-1 rounded ml-2">
          Variánsok
        </button>
      </template>
    </EditableTableComponent>

    <!-- Új étel Modal -->
    <div v-if="showCreateDishModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeCreateModal">&times;</button>
        <h3>Új étel hozzáadása</h3>
        <div class="form-group">
          <label>Név</label>
          <input type="text" v-model="newDish.name" class="form-input" />
        </div>
        <div class="form-group">
          <label>Leírás</label>
          <textarea v-model="newDish.description" class="form-input"></textarea>
        </div>
        <div class="form-group">
          <label>Ár</label>
          <input type="number" v-model="newDish.price" class="form-input" />
        </div>
        <div class="form-group">
          <label>Kategória</label>
          <select v-model="newDish.category_id" class="form-input">
            <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Allergének</label>
          <div class="allergens-grid">
            <label v-for="allergen in availableAllergens" :key="allergen" class="allergen-item">
              <input type="checkbox" :value="allergen" v-model="newDish.allergies" />
              <span>{{ allergen }}</span>
            </label>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeCreateModal" class="btn-cancel">Mégse</button>
          <button @click="handleCreateDish" class="btn-save">Mentés</button>
        </div>
      </div>
    </div>

    <!-- Allergének Modal (szerkesztéshez) -->
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

    <!-- Új étel adag méret (variáns) Modal -->
    <div v-if="showCreateDishVariantModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeCreateVariantModal">&times;</button>
        <h3>Új étel adag méret hozzáadása</h3>
        <div class="form-group">
          <label>Étel kiválasztása</label>
          <select v-model="newDishVariant.dish_id" class="form-input">
            <option v-for="dish in dishes" :key="dish.id" :value="dish.id">"{{ dish.id }}" {{ dish.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Adag méret / Részlet (pl. 32 cm, Nagy adag)</label>
          <input type="text" v-model="newDishVariant.detail" class="form-input" />
        </div>
        <div class="form-group">
          <label>Ár</label>
          <input type="number" v-model="newDishVariant.price" class="form-input" />
        </div>
        <div class="modal-actions">
          <button @click="closeCreateVariantModal" class="btn-cancel">Mégse</button>
          <button @click="handleCreateDishVariant" class="btn-save">Mentés</button>
        </div>
      </div>
    </div>

    <!-- Variánsok listázása és törlése Modal -->
    <div v-if="showViewVariantsModal" class="modal-overlay" @click="closeViewVariantsModal">
      <div class="modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeViewVariantsModal">&times;</button>
        <h3>"{{ currentDishForVariants?.name }}" variánsai</h3>

        <div v-if="variantLoading" class="p-4 text-center">Betöltés...</div>
        <div v-else-if="currentDishVariants.length === 0" class="p-4 text-center">Nincsenek variánsok ehhez az ételhez.</div>
        <div v-else class="variants-list mt-4">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="p-2 text-left border">Detail</th>
                <th class="p-2 text-left border">Ár</th>
                <th class="p-2 text-center border">Művelet</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="variant in currentDishVariants" :key="variant.id">
                <td class="p-2 border">{{ variant.detail }}</td>
                <td class="p-2 border">{{ variant.price }} Ft</td>
                <td class="p-2 border text-center">
                  <button @click="deleteVariant(variant.id)" class="bg-red-500 text-white px-2 py-1 rounded">
                    Törlés
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-actions mt-4">
          <button @click="closeViewVariantsModal" class="btn-cancel">Bezárás</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  margin-left: 300px;
  padding: 20px;
}

.header-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.add-btn {
  background-color: #4ade80;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.allergens-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
}

.btn-save {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background-color: #9ca3af;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

/* Modal styles */
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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
  margin-top: 20px;
}

.variants-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>
