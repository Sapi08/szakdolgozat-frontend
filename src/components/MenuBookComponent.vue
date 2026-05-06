<script lang="ts">
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Képek importálása
import page1 from '../assets/menubook/page1.jpg';
import page2 from '../assets/menubook/page2.jpg';
import page3 from '../assets/menubook/page3.jpg';
import page4 from '../assets/menubook/page4.jpg';
import page5 from '../assets/menubook/page5.jpg';
import page6 from '../assets/menubook/page6.jpg';
import page7 from '../assets/menubook/page7.jpg';
import page8 from '../assets/menubook/page8.jpg';
import page9 from '../assets/menubook/page9.jpg';
import page10 from '../assets/menubook/page10.jpg';
import page11 from '../assets/menubook/page11.jpg';
import page12 from '../assets/menubook/page12.jpg';

export default defineComponent({
  name: 'MenuBookComponent',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      modules: [Navigation, Pagination, EffectCoverflow],
      pages: [
        page1, page2, page3, page4, page5, page6,
        page7, page8, page9, page10, page11, page12
      ],
      currentPage: 1,
      isMobile: window.innerWidth <= 768,
      swiperInstance: null as SwiperType | null,
      componentKey: 0
    };
  },
  watch: {
    '$route'() {
      // Minden route változáskor újratöltjük a komponenst
      this.componentKey++;
      this.currentPage = 1;
    }
  },
  created() {
    // Oldal betöltéskor/frissítéskor mindig reseteljük
    this.componentKey = Date.now();
    this.currentPage = 1;
  },
  computed: {
    swiperOptions() {
      return {
        modules: this.modules,
        effect: (this.isMobile ? 'slide' : 'coverflow') as 'slide' | 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: this.isMobile ? 1 : ('auto' as 'auto'),
        spaceBetween: this.isMobile ? 0 : 30,
        loop: false,
        initialSlide: 0,
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        },
        navigation: {
          enabled: !this.isMobile
        },
        pagination: {
          clickable: true,
          dynamicBullets: true,
        },
        speed: 400,
        touchRatio: this.isMobile ? 1 : 1.5,
        threshold: 5,
        simulateTouch: true,
        allowTouchMove: true
      };
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
    onSwiper(swiper: SwiperType) {
      this.swiperInstance = swiper;
      // Azonnal az első oldalra állítjuk - 0ms késleltetéssel, de biztosan
      setTimeout(() => {
        swiper.slideTo(0, 0);
        this.currentPage = 1;
      }, 0);
    },
    onSlideChange(swiper: SwiperType) {
      this.currentPage = swiper.activeIndex + 1;
    }
  }
});
</script>

<template>
  <div class="menu-book-section">
    <div class="instruction-text">
      <p><strong>Lapozza át étlapunkat! Húzza a lapokat ujjával vagy a kurzorral.</strong></p>
      <p class="page-counter">{{ currentPage }} / {{ pages.length }}</p>
    </div>

    <div class="book-container">
      <Swiper
        :key="componentKey"
        v-bind="swiperOptions"
        class="menu-swiper"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <SwiperSlide v-for="(page, index) in pages" :key="index" class="menu-page">
          <div class="page-wrapper">
            <img
              :src="page"
              :alt="`Menü oldal ${index + 1}`"
              loading="lazy"
              class="page-image"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style scoped>
.menu-book-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
  background: linear-gradient(to bottom, #f9f9f9, #ffffff);
}

.instruction-text {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background-color: rgba(255, 216, 152, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 90%;
}

.instruction-text p {
  margin: 0.25rem 0;
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
}

.page-counter {
  font-size: 1rem !important;
  color: #202020 !important;
  margin-top: 0.5rem !important;
  font-weight: 600;
}

.book-container {
  width: 100%;
  max-width: 1200px;
  height: 700px;
  position: relative;
}

.menu-swiper {
  width: 100%;
  height: 100%;
  padding: 20px 50px;
}

.menu-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto !important;
  max-width: 600px;
}

.page-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  overflow: hidden;
}

.page-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

/* Swiper navigáció stílusok */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #ffa500;
  background: transparent;
  width: 50px;
  height: 50px;
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  transform: scale(1.1);
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 20px;
  font-weight: bold;
}

:deep(.swiper-pagination-bullet) {
  background: #ffa500;
  opacity: 0.5;
  width: 10px;
  height: 10px;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 12px;
  height: 12px;
}

/* Tablet nézet (1024px alatt) */
@media (max-width: 1024px) {
  .book-container {
    height: 600px;
  }

  .menu-swiper {
    padding: 20px 40px;
  }

  .menu-page {
    max-width: 500px;
  }

  .instruction-text p {
    font-size: 1rem;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 45px;
    height: 45px;
  }
}

/* Tablet portrait és nagyobb mobilok (768px alatt) */
@media (max-width: 768px) {
  .menu-book-section {
    padding: 1rem 0.5rem;
  }

  .instruction-text {
    margin-bottom: 1.5rem;
    padding: 0.8rem 1rem;
    width: 95%;
  }

  .instruction-text p {
    font-size: 0.95rem;
  }

  .book-container {
    height: 550px;
  }

  .menu-swiper {
    padding: 15px 10px;
  }

  .menu-page {
    width: 100% !important;
    max-width: 100%;
  }


  /* Nyilak elrejtése mobilon */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

/* Mobilok (630px alatt) */
@media (max-width: 630px) {
  .menu-book-section {
    padding: 1rem 0.25rem;
  }

  .instruction-text {
    margin-bottom: 1rem;
    padding: 0.7rem 0.8rem;
    width: 96%;
  }

  .instruction-text p {
    font-size: 0.9rem;
  }

  .page-counter {
    font-size: 0.85rem !important;
  }

  .book-container {
    height: 500px;
  }

  .menu-swiper {
    padding: 10px 5px;
  }

  .menu-page {
    width: 100% !important;
    max-width: 100%;
  }

  /* Nyilak elrejtése */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }

  :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
  }

  :deep(.swiper-pagination-bullet-active) {
    width: 10px;
    height: 10px;
  }
}

/* Kis mobilok (480px alatt) */
@media (max-width: 480px) {
  .menu-book-section {
    padding: 0.75rem 0.25rem;
  }

  .instruction-text {
    margin-bottom: 0.75rem;
    padding: 0.6rem;
  }

  .instruction-text p {
    font-size: 0.85rem;
  }

  .book-container {
    height: 450px;
  }

  .menu-swiper {
    padding: 10px 5px;
  }

  /* Nyilak elrejtése */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

/* Nagy képernyők optimalizálás */
@media (min-width: 1400px) {
  .book-container {
    max-width: 1400px;
    height: 800px;
  }

  .menu-page {
    max-width: 700px;
  }
}
</style>
