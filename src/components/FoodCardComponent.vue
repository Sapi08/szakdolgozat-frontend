<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useDishStore } from '@/stores/dish_store.ts'
import { useCartStore } from '@/stores/cart_store.ts'
import { useDishVariantStore } from '@/stores/dish_variant_store.ts'
import Dish from '@/models/dish.ts'
import type DishVariant from '@/models/dish_variant.ts'
import DishVariantSelectorComponent from './DishVariantSelectorComponent.vue'

export default defineComponent({
  name: "DishesCards",
  components: {
    DishVariantSelector: DishVariantSelectorComponent
  },
  data() {
    return {
      loading: false,
      dishes: [] as Dish[],
      showVariantModal: false,
      selectedDish: null as Dish | null,
      dishVariants: [] as DishVariant[]
    }
  },
  methods: {
    prettyAllergies(arr: string[]) {
      return arr.map(el => el.trim()).join(", ");
    },
    hasVariants(dish: Dish): boolean {
      return dish.price === null || dish.price === 0;
    },
    async handleAddToCart(dish: Dish) {
      if (this.hasVariants(dish)) {
        // Load variants and show modal
        try {
          this.dishVariants = await this.dishVariantStore.loadVariantsByDishId(dish.id);

          if (this.dishVariants.length > 0) {
            this.selectedDish = dish;
            this.showVariantModal = true;
          } else {
            // No variants found, add as is
            this.cartStore.addToCart(dish);
          }
        } catch (error) {
          console.error('Error loading variants:', error);
          this.cartStore.addToCart(dish);
        }
      } else {
        // Direct add to cart
        this.cartStore.addToCart(dish);
      }
    },
    handleVariantSelect(variant: DishVariant) {
      try {
        if (this.selectedDish) {
          // Create a new Dish instance with variant data
          const dishWithVariant = new Dish(
            this.selectedDish.id * 10000 + variant.id, // Unique ID for variant
            `${this.selectedDish.name} (${variant.detail})`,
            this.selectedDish.description,
            Number(variant.price), // Convert to number
            this.selectedDish.category,
            this.selectedDish.allergies || [],
            this.selectedDish.image
          );
          this.cartStore.addToCart(dishWithVariant);
        }
      } catch (error) {
        console.error('Error in handleVariantSelect:', error);
      } finally {
        this.closeVariantModal();
      }
    },
    closeVariantModal() {
      this.showVariantModal = false;
      // Use setTimeout to ensure DOM updates complete before clearing state
      setTimeout(() => {
        this.selectedDish = null;
        this.dishVariants = [];
      }, 300); // Match modal transition duration
    },
    scrollToCategory(category: string) {
      const element = document.getElementById(`category-${category}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  },
  computed: {
    ...mapStores(useDishStore, useCartStore, useDishVariantStore),
    dishesByCategory(): Record<string, Dish[]> {
      const grouped: Record<string, Dish[]> = {};
      this.dishes.forEach((dish: Dish) => {
        if (!grouped[dish.category]) {
          grouped[dish.category] = [];
        }
        grouped[dish.category].push(dish);
      });
      return grouped;
    },
    categories(): string[] {
      const cats = this.dishesByCategory as Record<string, Dish[]>;
      return Object.keys(cats).sort();
    }
  },
  async created() {
    this.loading = true;
    try {
      const loadedDishes = await this.dishStore.loadDishes();
      this.dishes = loadedDishes as Dish[];
      await this.dishVariantStore.loadVariants();
    } finally {
      this.loading = false;
    }
  }
})
</script>

<template>
<div class="food-menu-container">
  <!-- Kategória navigáció -->
  <div class="category-navigation" v-if="!loading && categories.length > 0">
    <div class="category-nav-wrapper">
      <button
        v-for="category in categories"
        :key="category"
        @click="scrollToCategory(category)"
        class="category-nav-btn"
      >
        {{ category }}
      </button>
    </div>
  </div>

  <!-- Loading állapot -->
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Ételek betöltése...</p>
  </div>

  <!-- Ételek kategóriák szerint -->
  <template v-else>
    <div
      v-for="category in categories"
      :key="category"
      :id="`category-${category}`"
      class="category-section"
    >
      <div class="category-header">
        <h2 class="category-title">{{ category }}</h2>
        <div class="category-divider"></div>
      </div>

      <div class="dishes-grid">
        <div
          v-for="dish in dishesByCategory[category]"
          :key="dish.id"
          class="dish-card"
        >
          <!-- Kép szekció (opcionális) -->
          <div v-if="dish.image" class="dish-image-wrapper">
            <img
              :src="dish.image"
              :alt="dish.name"
              class="dish-image"
              loading="lazy"
            />
          </div>

          <div class="dish-card-content">
            <div class="dish-card-header">
              <h3 class="dish-name">{{ dish.name }}</h3>
              <span v-if="!hasVariants(dish)" class="dish-price">{{ dish.price }} Ft</span>
              <span v-else class="dish-price-variants">
                <i class="fas fa-list-ul"></i> Több kiszerelés
              </span>
            </div>

            <div class="dish-content">
              <div v-if="dish.allergies && dish.allergies.length > 0" class="dish-allergies">
                <i class="fas fa-exclamation-triangle"></i>
                <span>{{ prettyAllergies(dish.allergies) }}</span>
              </div>
              <p v-if="dish.description" class="dish-description">
                {{ dish.description }}
              </p>
            </div>

            <div class="dish-footer">
              <button class="btn custom-btn add-to-cart-btn" @click="handleAddToCart(dish)">
                <i class="fas fa-shopping-cart"></i>
                {{ hasVariants(dish) ? 'Kiszerelés választása' : 'Kosárba' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Variant Selector Modal -->
    <DishVariantSelector
      v-if="selectedDish && showVariantModal"
      :show="showVariantModal"
      :dish="selectedDish"
      :variants="dishVariants"
      @close="closeVariantModal"
      @select="handleVariantSelect"
    />
  </template>
</div>
</template>

<style scoped>
.food-menu-container {
  position: relative;
  width: 100%;
  padding: 20px 0;
}

/* Kategória navigáció */
.category-navigation {
  position: sticky;
  top: 80px;
  background: #ffffff;
  padding: 20px 0;
  margin-bottom: 30px;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.category-nav-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 0 20px;
}

.category-nav-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #fbaf32 0%, #f59b23 100%);
  color: #ffffff;
  border: none;
  border-radius: 25px;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(251, 175, 50, 0.3);
  text-transform: uppercase;
}

.category-nav-btn:hover {
  background: linear-gradient(135deg, #e86a61 0%, #d55951 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(232, 106, 97, 0.4);
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #fbaf32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Kategória szekciók */
.category-section {
  margin-bottom: 60px;
  scroll-margin-top: 180px;
}

.category-section h2{
  text-transform: uppercase;
}

.category-header {
  text-align: center;
  margin-bottom: 40px;
}

.category-title {
  font-size: 42px;
  font-weight: 700;
  color: #fbaf32;
  margin-bottom: 15px;
  font-family: 'Nunito', sans-serif;
}

.category-divider {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #e86a61, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

/* Ételek Grid */
.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

/* Étel kártya */
.dish-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  overflow: hidden;
}

.dish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(232, 106, 97, 0.15);
  border-color: #fbaf32;
}

/* Kép szekció */
.dish-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.dish-card:hover .dish-image {
  transform: scale(1.05);
}

/* Kártya tartalom (ha van kép) */
.dish-card-content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dish-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.dish-name {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
  font-family: 'Nunito', sans-serif;
}

.dish-price {
  font-size: 24px;
  font-weight: 700;
  color: #e86a61;
  white-space: nowrap;
  font-family: 'Nunito', sans-serif;
}

.dish-price-variants {
  font-size: 16px;
  font-weight: 600;
  color: #fbaf32;
  white-space: nowrap;
  font-family: 'Nunito', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dish-price-variants i {
  font-size: 14px;
}

.dish-content {
  flex: 1;
  margin-bottom: 20px;
}

.dish-description {
  color: #757575;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.dish-allergies {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #fff3e0;
  border-left: 4px solid #fbaf32;
  border-radius: 5px;
  font-size: 14px;
  color: #666;
}

.dish-allergies i {
  color: #fbaf32;
  font-size: 16px;
}

.dish-footer {
  display: flex;
  justify-content: flex-end;
}

.add-to-cart-btn {
  padding: 12px 30px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 25px;
}

.add-to-cart-btn i {
  font-size: 16px;
}

/* Reszponzív dizájn */
@media (max-width: 991.98px) {
  .dishes-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }

  .category-title {
    font-size: 36px;
  }

  .category-navigation {
    top: 70px;
  }
}

@media (max-width: 767.98px) {
  .dishes-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 15px;
  }

  .category-title {
    font-size: 32px;
  }

  .category-nav-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .dish-name {
    font-size: 20px;
  }

  .dish-price {
    font-size: 20px;
  }

  .category-navigation {
    top: 60px;
  }
}

@media (max-width: 575.98px) {
  .food-menu-container {
    padding: 10px 0;
  }

  .category-section {
    margin-bottom: 40px;
  }

  .category-title {
    font-size: 28px;
  }

  .category-nav-wrapper {
    gap: 8px;
    padding: 0 10px;
  }

  .category-nav-btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .dish-image-wrapper {
    height: 180px;
  }

  .dish-card-content {
    padding: 20px;
  }

  .dish-card-header {
    flex-direction: column;
    gap: 8px;
  }

  .dish-price,
  .dish-price-variants {
    align-self: flex-start;
  }

  .add-to-cart-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
