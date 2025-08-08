<script lang="ts">
import { defineComponent } from 'vue';
import FlipBook from 'flipbook-vue'; // Importáljuk a flipbook-vue könyvtárat

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
    FlipBook // Regisztráljuk a FlipBook komponenst
  },
  data() {
    return {
      pages: [
        page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11, page12
      ],
    };
  }
});
</script>

<template>
  <div class="book-container">
    <!-- FlipBook komponens -->
    <FlipBook
      v-once
      class="flipbook"
      :pages="pages"
      :start-page="0"
      :show-cover="true"
      :center-book="true"
      :use-portrait="false"
      dragToFlip
    />
  </div>
</template>

<style scoped>
.book-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #f3f3f3;
}

.flipbook {
  width: 90vw;  /* 90%-os szélesség a képernyőhöz képest */
  height: 90vh; /* 90%-os magasság a képernyőhöz képest */
}

/* Reszponzív beállítások mobilokra */
@media (max-width: 768px) {
  .flipbook {
    width: 100vw;  /* Mobilon 100%-os szélesség */
    height: 80vh;  /* Mobilon a magasságot csökkentjük */
  }
}

@media (max-width: 480px) {
  .flipbook {
    width: 100vw;  /* Még kisebb képernyőkön is 100%-os szélesség */
    height: 70vh;  /* A magasságot még csökkenthetjük */
  }
}
</style>
