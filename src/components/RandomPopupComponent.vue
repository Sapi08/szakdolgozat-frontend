<script lang="ts">
import PopupContent from './PopupContent.vue';

export default {
  components: { PopupContent },
  data() {
    return {
      showPopup: false,
      timer: null
    };
  },
  mounted() {
    this.startRandomTimer();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    startRandomTimer() {
      const randomTime = Math.floor(Math.random() * 100000) + 550000;
      this.timer = setTimeout(() => {
        this.showPopup = true;
        this.startRandomTimer();
      }, randomTime);
    },
    closePopup() {
      this.showPopup = false;
    },
    triggerManualPopup() {
      this.showPopup = true;
    }
  }
};
</script>

<template>
  <div>
    <button @click="triggerManualPopup">Kézi popup</button>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-container">
        <PopupContent @close="closePopup" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background: transparent;
}
</style>
