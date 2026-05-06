<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

const slides = [
  {
    text: `
      <div class="carousel-text">
        <h1 class="display-3">A legjobb <span class="text-primary">minőségű</span> összetevők</h1>
        <p class="fs-5">
          Minőség, amit érezni fogsz az ízekben!<br>
          Csak a legjobb alapanyagokkal dolgozunk, mert hiszünk abban, hogy az igazi élvezet a részletekben rejlik.
          Friss, válogatott összetevők, gondosan megmunkálva – ez a titka annak, hogy minden falat tökéletes legyen.
          Nálunk a minőség nem kompromisszum!
        </p>
        <div class="carousel-btn">
          <a class="btn custom-btn" href="/menu">Étlap</a>
          <a class="btn custom-btn" href="/event_booking">Foglalás</a>
        </div>
      </div>
    `
  },
  {
    text:`
      <div class="carousel-text">
        <h1 class="display-3">Hazánk <span class="text-primary">legjobb</span> szakácsai</h1>
        <p class="fs-5">
          Magyarország legjobb szakácsai, akik a világ ízeit hozzák el önhöz!
          A hazai gasztronómia mesterei, akik nemcsak a magyar konyhát, hanem a nemzetközi ízeket is mesterien varázsolják a tányérjára. Friss, innovatív fogások, egyedi fúziók és prémium alapanyagok – mindez egy helyen, a legjobb szakácsok kezei között!
        </p>
        <div class="carousel-btn">
          <a class="btn custom-btn" href="/menu">Étlap</a>
          <a class="btn custom-btn" href="/event_booking">Foglalás</a>
        </div>
      </div>
    `
  },
  {
    text: `
        <div class="carousel-text">
          <h1 class="display-3">A leggyorsabb <span class="text-primary">kiszállítás</span></h1>
          <p class="fs-5">
            Villámgyors kiszállítás, hogy önnek csak az élmény maradjon!
            Rendeljen egyszerűen, és élvezze a hihetetlenül gyors kézbesítést! Legyen szó ebédről, vacsoráról vagy egy last-minute ajándékról, mi rekordidő alatt házhoz visszük. Velünk az idő mindig önnek dolgozik!
          </p>
          <div class="carousel-btn">
            <a class="btn custom-btn" href="/menu">Étlap</a>
            <a class="btn custom-btn" href="/event_booking">Foglalás</a>
          </div>
        </div>
    `
  }
];
</script>

<template>
  <div class="slider">
    <div class="carousel-background">
      <img src="@/assets/pictures/hero.jpg" alt="Background" />
      <div class="overlay"></div>
    </div>

    <div class="carousel-container">
      <Swiper
        :modules="[Autoplay, Pagination]"
        :loop="true"
        :autoplay="{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }"
        :pagination="{ clickable: true, el: '.custom-pagination' }"
        class="h-100 w-100"
      >
        <SwiperSlide v-for="(slide, index) in slides" :key="index" class="d-flex align-items-center justify-content-center">
          <div v-html="slide.text" class="w-100"></div>
        </SwiperSlide>
      </Swiper>
      <div class="custom-pagination"></div>
    </div>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  max-height: 800px;
  overflow: hidden;
}

.carousel-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.carousel-container {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.swiper) {
  width: 100%;
}

:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

:deep(.carousel-text) {
  text-align: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.carousel-text h1) {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.carousel-text .text-primary) {
  color: #e86a61 !important;
}

:deep(.carousel-text p) {
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

:deep(.carousel-btn) {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

:deep(.carousel-btn .custom-btn) {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  color: #ffffff;
  background-color: #e86a61;
  border: 2px solid #e86a61;
  border-radius: 5px;
  transition: all 0.3s ease;
}

:deep(.carousel-btn .custom-btn:hover) {
  background-color: #fbaf32;
  color: #ffffff;
}

.custom-pagination {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: #ffffff;
  opacity: 0.7;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: #e86a61;
  opacity: 1;
  transform: scale(1.2);
}

/* Tablet Responsive */
@media (max-width: 992px) {
  .slider {
    min-height: 500px;
    margin-top: 56px;
  }

  :deep(.carousel-text h1) {
    font-size: 2.5rem;
  }

  :deep(.carousel-text p) {
    font-size: 1.1rem;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .slider {
    min-height: 400px;
  }

  :deep(.carousel-text) {
    padding: 1rem;
  }

  :deep(.carousel-text h1) {
    font-size: 2rem;
  }

  :deep(.carousel-text p) {
    font-size: 1rem;
    line-height: 1.5;
  }

  :deep(.carousel-btn) {
    flex-direction: column;
    align-items: center;
  }

  :deep(.carousel-btn .custom-btn) {
    width: 200px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  :deep(.carousel-text h1) {
    font-size: 1.75rem;
  }

  :deep(.carousel-text p) {
    font-size: 0.9rem;
  }
}
</style>
