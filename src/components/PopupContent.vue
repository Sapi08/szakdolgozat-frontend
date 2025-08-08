<script lang="ts">
import ScratchCardComponent from "@/components/ScratchCardComponent.vue";

export default {
  name: 'PopupContent',
  components: {ScratchCardComponent}
}
</script>

<template>
  <div class="popup-content">
    <h3>Kaparja le a sorsjegyet!</h3>
    <ScratchCardComponent/>
    <p>Épp most jöttem létre: {{ new Date().toLocaleTimeString() }}</p>
    <button @click="$emit('close')">Bezárás</button>
  </div>
</template>


<style scoped>
.popup-content {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
