<script setup>
// If you are using PurgeCSS, make sure to whitelist the carousel CSS classes
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  transition: 2000,
  snapAlign: 'center',
  autoplay: 3000,
  pauseAutoplayOnHover: true,
}

const slides = [
  {
    image: new URL('@/assets/pictures/carousel-1.webp', import.meta.url).href,
    text: `
      <div class="carousel-text">
        <h1 class="title">A legjobb <span>minőségű</span> összetevők</h1>
        <p>
          Minőség, amit érezni fogsz az ízekben! 🥗🍎<br>
          Csak a legjobb alapanyagokkal dolgozunk, mert hiszünk abban, hogy az igazi élvezet a részletekben rejlik.
          Friss, válogatott összetevők, gondosan megmunkálva – ez a titka annak, hogy minden falat tökéletes legyen.
          Nálunk a minőség nem kompromisszum!
        </p>
        <div class="carousel-btn">
          <a class="btn custom-btn" href="">Étlap</a>
          <a class="btn custom-btn" href="">Foglalás</a>
        </div>
      </div>
    `
  },
  {
    image: new URL('@/assets/pictures/carousel-2.webp', import.meta.url).href,
    text:`
      <div class="carousel-text">
        <h1 class="title">Hazánk <span>legjobb </span> szakácsai</h1>
        <p>
          Magyarország legjobb szakácsai, akik a világ ízeit hozzák el hozzád! 🌍🍴
          A hazai gasztronómia mesterei, akik nemcsak a magyar konyhát, hanem a nemzetközi ízeket is mesterien varázsolják a tányérodra. Friss, innovatív fogások, egyedi fúziók és prémium alapanyagok – mindez egy helyen, a legjobb szakácsok kezei között!
        </p>
        <div class="carousel-btn">
          <a class="btn custom-btn" href="">Étlap</a>
          <a class="btn custom-btn" href="">Foglalás</a>
        </div>
      </div>
    `
  },
  {
    image: new URL('@/assets/pictures/carousel-3.webp', import.meta.url).href,
    text: `
        <div>
          <h1 class="title">A leggyorsabb <span>kiszállítás</span></h1>
          <p>
            Villámgyors kiszállítás, hogy neked csak az élmény maradjon! 🚚⚡
            Rendelj egyszerűen, és élvezd a hihetetlenül gyors kézbesítést! Legyen szó ebédről, vacsoráról vagy egy last-minute ajándékról, mi rekordidő alatt házhoz visszük. Velünk az idő mindig neked dolgozik!
          </p>
          <div class="carousel-btn">
            <a class="btn custom-btn" href="">Étlap</a>
            <a class="btn custom-btn" href="">Foglalás</a>
          </div>
        </div>
    `
  }
];
</script>
<template>
  <div class="slider">
    <Carousel v-bind="carouselConfig">
      <Slide v-for="(slide, index) in slides" :key="index">
        <div class="carousel__item">
          <img :src="slide.image" alt="Carousel Image" />
          <div class="carousel-text" v-html="slide.text"></div>
        </div>
      </Slide>
      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.carousel__item {
  position: relative;
  width: 100%;
  height: 700px;
}

.carousel__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-text {
  position: absolute;
  bottom: 200px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>

