<script lang="ts">
import ScratchCardComponent from './ScratchCardComponent.vue';

export default {
  name: 'RandomPopupComponent',
  components: { ScratchCardComponent },
  data() {
    return {
      scratchCardKey: 0
    };
  },
  methods: {
    triggerManualPopup() {
      // Újra rendereljük a komponenst új key-vel, hogy újrainduljon a popup logika
      this.scratchCardKey++;
    }
  }
};
</script>

<template>
  <div>
    <!-- Fejlesztői gomb manuális teszteléshez (később eltávolítható) -->
    <button
      @click="triggerManualPopup"
      class="dev-trigger-btn"
      title="Kaparós sorsjegy megjelenítése (fejlesztői funkció)"
    >
      <i class="fas fa-ticket-alt"></i>
    </button>

    <!-- A ScratchCardComponent most automatikusan kezeli a popup megjelenést -->
    <ScratchCardComponent :key="scratchCardKey" />
  </div>
</template>

<style scoped>
/* Fejlesztői trigger gomb - Production módban elrejtve */
.dev-trigger-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbaf32, #e86a61);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(251, 175, 50, 0.5);
  transition: all 0.3s ease;
  z-index: 9998;
  display: none; /* Elrejtve - csak fejlesztéshez használd: display: flex; */
  align-items: center;
  justify-content: center;
}

.dev-trigger-btn:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 6px 20px rgba(251, 175, 50, 0.7);
}

.dev-trigger-btn:active {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .dev-trigger-btn {
    width: 50px;
    height: 50px;
    font-size: 20px;
    bottom: 15px;
    right: 15px;
  }
}
</style>
