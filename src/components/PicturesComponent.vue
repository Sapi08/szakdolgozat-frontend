<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "PicturesComponent",
  methods: {
    isActive(path: string): boolean {
      return this.$route.path === path;
    }
  }
})
</script>

<template>
  <div class="contain">
    <div class="d-flex">
      <img src="../assets/pictures/foods/food1.jpg" alt="Norway" class="picture">
      <img src="../assets/pictures/foods/food2.jpg" alt="Norway" class="picture">
      <img src="../assets/pictures/foods/food3.jpg" alt="Norway" class="picture">
    </div>
    <div class="d-flex">
      <img src="../assets/pictures/foods/food4.jpg" alt="Norway" class="picture">
      <img src="../assets/pictures/foods/food5.jpg" alt="Norway" class="picture">
      <img src="../assets/pictures/foods/food6.jpg" alt="Norway" class="picture">
    </div>
    <div class="d-flex">
      <img src="../assets/pictures/foods/food7.jpg" alt="Norway" class="picture">
      <img src="../assets/pictures/foods/food8.jpg" alt="Norway" class="picture">
      <img src="../assets/pictures/foods/food9.jpg" alt="Norway" class="picture">
    </div>
  </div>
</template>

<style scoped>
/* Container holding the image and the text */
.contain {
  width: 50%;
  margin-left: 10%;
  margin-right: 10%;
}

.picture {
  width:50%;
  height: auto;
  border-radius: 20px;
  margin: 10px;
}

.picture:hover {
  transform: scale(1.025);
}
</style>
