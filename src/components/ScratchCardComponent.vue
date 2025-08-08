<script lang="ts">
import { ref, onMounted } from "vue";
import ticketImage from "@/assets/pictures/scratchtickets/ticket1.png";

export default {
  setup() {
    const canvas = ref(null);
    const ctx = ref(null);
    const isScratching = ref(false);
    const revealed = ref(false);
    const threshold = 50; // 50% kaparás után feltárás
    const width = 400;
    const height = 250;
    const backGround = `url(${ticketImage}) no-repeat center`;

    const startScratching = (event) => {
      isScratching.value = true;
      scratch(event);
    };

    const stopScratching = () => {
      isScratching.value = false;
      checkScratchCompletion();
    };

    const scratch = (event) => {
      if (!isScratching.value || !ctx.value) return;

      const rect = canvas.value.getBoundingClientRect();
      const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
      const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

      ctx.value.globalCompositeOperation = "destination-out";
      ctx.value.beginPath();
      ctx.value.arc(x, y, 20, 0, Math.PI * 2);
      ctx.value.fill();
    };

    const checkScratchCompletion = () => {
      const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const percentage = (transparentPixels / (pixels.length / 4)) * 100;
      if (percentage > threshold) {
        ctx.value.fillStyle = "blue";
        ctx.value.fillRect(0, 0, width, height);
        revealed.value = true;
      }
    };

    onMounted(() => {
      const canvasEl = canvas.value;
      canvasEl.width = width;
      canvasEl.height = height;
      ctx.value = canvasEl.getContext("2d");

      // Alap kaparóréteg
      ctx.value.fillStyle = "#8c8c8c";
      ctx.value.fillRect(0, 0, width, height);
      canvasEl.style.background = backGround;
      canvasEl.style.backgroundSize = "100% 100%";
      ctx.value.lineWidth = 35;
      ctx.value.lineJoin = "round";
    });

    return { canvas, startScratching, scratch, stopScratching, revealed };
  },
};
</script>

<template>
  <div class="scratch-card-container">
    <canvas ref="canvas" @mousedown="startScratching" @mousemove="scratch" @mouseup="stopScratching"
            @touchstart="startScratching" @touchmove="scratch" @touchend="stopScratching"></canvas>
    <div class="message" v-if="revealed">
      🎉 Gratulálunk! 🎉
    </div>
  </div>
</template>

<style>
.scratch-card-container {
  position: relative;
  width: 500px;
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: #202020;
  border: 2px solid #fbaf32;
}

.message {
  font-size: 1.5em;
  font-weight: bold;
  color: #2ecc71;
  text-align: center;
  z-index: max(1);
  background-color: #000000;
  border-radius: 8px;
}
</style>
