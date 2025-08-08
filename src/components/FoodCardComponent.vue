<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useDishStore } from '@/stores/dish_store.ts'
import { useCartStore } from '@/stores/cart_store.ts'
import type Dish from '@/models/dish.ts'

export default defineComponent({
  name: "DishesCards",
  data() {
    return {
      loading: false,
      dishes: []
    }
  },
  methods: {
    prettyAllergies(arr: string[]) {
      return arr.map(el => el.trim()).join(", ");
    },
    addToCart(dish: Dish) {
      this.cartStore.addToCart(dish);
    }
  },
  computed: {
    ...mapStores(useDishStore, useCartStore),
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
<div class="blog">
  <template v-if="loading">
    Loading....
  </template>
  <template v-else>
    <div class="blog-content" v-for="dish in dishes" :key="dish.id">
      <h2 class="blog-title">{{dish.name}}</h2>
      <div class="blog-meta">
        <p>{{ prettyAllergies(dish.allergies) }}</p>
        <p><i class="far fa-user"></i>Admin</p>
        <p><i class="far fa-list-alt"></i>{{dish.category}}</p>
        <p><i class="far fa-calendar-alt"></i>01-Jan-2045</p>
        <p><i class="far fa-comments"></i>10</p>
      </div>
      <div class="blog-text">
        <p v-if="dish.description">
          {{dish.description}}
        </p>
        <p v-else>
          Finom
        </p>
        <a class="btn custom-btn" @click="addToCart(dish)">+🛒</a>
      </div>
    </div>
  </template>
</div>
</template>

<style scoped>
.blog {
  position: relative;
  width: 100%;
  padding: 45px 0 0 0;
}

.blog .blog-item {
  position: relative;
}

.blog .blog-img {
  position: relative;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}

.blog .blog-img img {
  width: 100%;
}

.blog .blog-content {
  position: relative;
  width: calc(100% - 60px);
  top: -60px;
  left: 30px;
  padding: 25px 30px 30px 30px;
  background: #ffffff;
  box-shadow: 0 0 30px rgba(0, 0, 0, .08);
  border-radius: 15px;
  z-index: 2;
}

.blog .blog-content h2.blog-title {
  font-size: 22px;
  font-weight: 700;
}

.blog .blog-meta {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.blog .blog-meta p {
  margin: 0 10px 0 0;
  font-size: 14px;
  color: #999999;
}

.blog .blog-meta i {
  color: #e8786f;
  margin-right: 5px;
}

.blog .blog-meta p:last-child {
  margin: 0;
}

.blog .blog-text {
  position: relative;
}

.blog .blog-text p {
  margin-bottom: 10px;
}

.blog .blog-item a.btn {
  margin-top: 10px;
  padding: 5px 15px;
}

.blog .pagination .page-link {
  color: #fbaf32;
  border-radius: 5px;
  border-color: #fbaf32;
  margin: 0 2px;
}

.blog .pagination .page-link:hover,
.blog .pagination .page-item.active .page-link {
  color: #ffffff;
  background: #fbaf32;
}

.blog .pagination .disabled .page-link {
  color: #999999;
}

@media(max-width: 575.98px){
  .blog .blog-meta p {
    flex: 50%;
    font-size: 13px;
    margin: 0 0 5px 0;
  }
}
</style>
