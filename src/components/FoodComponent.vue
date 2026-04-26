<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FoodComponent',
})
</script>

<template>
  <div class="food">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-4">
          <div class="food-item">
            <i class="flaticon-burger"></i>
            <h2>Hamburgerek</h2>
            <p>
              Harapj bele az élvezetbe! Kézműves, friss hozzávalókból készítjük el minden egyes
              falatot: puha friss zsemle, ínycsiklandozó, szaftos hús, és gazdag feltétek, amik garantáltan elvarázsolják.
            </p>
            <a href="/menu">Étlap</a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="food-item">
            <i class="flaticon-cooking"></i>
            <h2>Desszertek</h2>
            <p>
              Zárja le az étkezést egy igazán finom, házi desszerttel! Frissen készített, gesztenyepüré, lágy és
              habos édességeink minden falata a gondos munka és szeretet ízét hordozza.
              Tökéletes választás, ha valami igazán édesre vágyik.
            </p>
            <a href="/menu">Étlap</a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="food-item">
            <i class="flaticon-cocktail"></i>
            <h2>Italok</h2>
            <p>
              Kortyoljon bele a frissességbe! Legyen az hűsítő gyümölcslé, egy tökéletesen elkészített
              kávé. Minden korty tele van ízekkel és energiával, hogy feldobja a napját.
              Válassza a minőséget, válassza az élményt!”
            </p>
            <a href="/menu">Étlap</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.food {
  position: relative;
  width: 100%;
  padding: 90px 0 60px 0;
  margin: 45px 0;
  background: rgba(0, 0, 0, 0.04);
}

.food .food-item {
  position: relative;
  width: 100%;
  margin-bottom: 30px;
  padding: 50px 30px 30px;
  text-align: center;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}

.food .food-item:hover {
  box-shadow: none;
}

.food .food-item i {
  position: relative;
  display: inline-block;
  color: #fbaf32;
  font-size: 60px;
  line-height: 60px;
  margin-bottom: 20px;
  transition: 0.3s;
}

.food .food-item:hover i {
  color: #e86a61;
}

.food .food-item i::after {
  position: absolute;
  content: '';
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  top: -20px;
  left: -15px;
  border: 3px dotted #fbaf32;
  border-right: transparent;
  border-bottom: transparent;
  border-radius: 100px;
  transition: 0.3s;
}

.food .food-item:hover i::after {
  border: 3px dotted #e86a61;
  border-right: transparent;
  border-bottom: transparent;
}

.food .food-item h2 {
  font-size: 30px;
  font-weight: 700;
}

.food .food-item a {
  position: relative;
  font-size: 16px;
}

.food .food-item a::after {
  position: absolute;
  content: '';
  width: 50px;
  height: 1px;
  bottom: 0;
  left: calc(50% - 25px);
  background: #fbaf32;
  transition: 0.3s;
}

.food .food-item a:hover::after {
  width: 100%;
  left: 0;
  background: #e86a61;
}
</style>
