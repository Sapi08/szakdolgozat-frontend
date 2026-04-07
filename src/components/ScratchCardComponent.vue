<script lang="ts">
import { ref, computed, watch, nextTick, onMounted, defineComponent } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export default defineComponent({
  name: 'ScratchCardComponent',
  props: {
    couponId: {
      type: String,
      required: true,
    },
    couponImage: {
      type: String,
      required: true,
    },
  },
  emits: ['scratched', 'closed'],
  setup(props, { emit }) {
    const canvas = ref<HTMLCanvasElement | null>(null)
    const ctx = ref<CanvasRenderingContext2D | null>(null)
    const isScratching = ref(false)
    const revealed = ref(false)
    const scratchProgress = ref(0)
    const particles = ref<Particle[]>([])
    const showHint = ref(true)

    const THRESHOLD = 65
    const WIDTH = 500
    const HEIGHT = 320

    const progressPercentage = computed(() => Math.round(scratchProgress.value))
    const progressColor = computed(() => {
      if (scratchProgress.value < 30) return '#e74c3c'
      if (scratchProgress.value < 60) return '#f39c12'
      return '#27ae60'
    })

    const initializeCanvas = () => {
      nextTick(() => {
        if (!canvas.value) return
        canvas.value.width = WIDTH
        canvas.value.height = HEIGHT
        ctx.value = canvas.value.getContext('2d')

        if (ctx.value) {
          ctx.value.fillStyle = '#8c8c8c'
          ctx.value.fillRect(0, 0, WIDTH, HEIGHT)

          for (let i = 0; i < 100; i++) {
            ctx.value.fillStyle = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, 0.3)`
            ctx.value.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 2, 2)
          }

          ctx.value.lineWidth = 35
          ctx.value.lineJoin = 'round'
          ctx.value.lineCap = 'round'
        }
      })
    }

    const startScratching = (event: MouseEvent | TouchEvent) => {
      isScratching.value = true
      showHint.value = false
      scratch(event)
    }

    const stopScratching = () => {
      isScratching.value = false
    }

    const scratch = (event: MouseEvent | TouchEvent) => {
      if (!isScratching.value || !ctx.value || !canvas.value) return

      const rect = canvas.value.getBoundingClientRect()
      const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
      const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
      const x = clientX - rect.left
      const y = clientY - rect.top
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height

      ctx.value.globalCompositeOperation = 'destination-out'
      ctx.value.beginPath()
      ctx.value.arc(x * scaleX, y * scaleY, 30, 0, Math.PI * 2)
      ctx.value.fill()

      for (let i = 0; i < 3; i++) {
        particles.value.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
        })
      }

      checkScratchCompletion()
    }

    const checkScratchCompletion = () => {
      if (!ctx.value || !canvas.value) return

      const pixels = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height).data
      let transparentPixels = 0

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparentPixels++
      }

      const percentage = (transparentPixels / (pixels.length / 4)) * 100
      scratchProgress.value = Math.min(percentage, 100)

      if (percentage > THRESHOLD && !revealed.value) {
        revealPrize()
      }
    }

    const revealPrize = () => {
      if (revealed.value) return
      revealed.value = true

      // Értesítjük a szülőt – ő hívja majd a store-t
      emit('scratched', props.couponId)

      if (ctx.value && canvas.value) {
        let alpha = 1
        const fadeOut = setInterval(() => {
          if (!ctx.value || !canvas.value) return
          ctx.value.globalCompositeOperation = 'source-over'
          ctx.value.fillStyle = `rgba(140, 140, 140, ${alpha})`
          ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
          alpha -= 0.1
          if (alpha <= 0) {
            clearInterval(fadeOut)
            ctx.value?.clearRect(0, 0, canvas.value.width, canvas.value.height)
          }
        }, 30)
      }
    }

    const revealAll = () => {
      if (ctx.value && canvas.value) {
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      }
      scratchProgress.value = 100
      revealPrize()
    }

    const closePopup = () => {
      emit('closed')
    }

    const animateParticles = () => {
      particles.value = particles.value.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        return p.life > 0
      })
      requestAnimationFrame(animateParticles)
    }

    // Új kupon érkezésekor reseteljük és újrarajzoljuk a canvast
    watch(
      () => props.couponId,
      () => {
        revealed.value = false
        scratchProgress.value = 0
        showHint.value = true
        initializeCanvas()
      },
      { immediate: true },
    )

    onMounted(() => {
      animateParticles()
    })

    return {
      canvas,
      startScratching,
      scratch,
      stopScratching,
      revealed,
      scratchProgress,
      progressPercentage,
      progressColor,
      particles,
      showHint,
      revealAll,
      closePopup,
    }
  },
})
</script>

<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-content">
      <button class="close-popup-btn" @click="closePopup">
        <i class="fas fa-times"></i>
      </button>

      <div class="scratch-card-wrapper">
        <!-- Fejléc -->
        <div class="title-section">
          <h2 class="scratch-title">
            <i class="fas fa-ticket-alt"></i>
            Kaparós Sorsjegy
          </h2>
          <p class="scratch-subtitle">Kaparj meg és nyerj fantasztikus ajándékokat!</p>
        </div>

        <!-- Fő konténer -->
        <div class="scratch-card-container">
          <!-- Kupon képe a canvas alatt -->
          <div
            class="prize-background"
            :style="{
              backgroundImage: `url(${couponImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          ></div>

          <!-- Canvas réteg -->
          <canvas
            ref="canvas"
            class="scratch-canvas"
            @mousedown="startScratching"
            @mousemove="scratch"
            @mouseup="stopScratching"
            @mouseleave="stopScratching"
            @touchstart.prevent="startScratching"
            @touchmove.prevent="scratch"
            @touchend="stopScratching"
          ></canvas>

          <!-- Részecskék -->
          <div class="particles-container">
            <div
              v-for="(particle, index) in particles"
              :key="index"
              class="particle"
              :style="{ left: particle.x + 'px', top: particle.y + 'px', opacity: particle.life }"
            ></div>
          </div>

          <!-- Hint animáció -->
          <transition name="fade">
            <div v-if="showHint && !revealed" class="hint-overlay">
              <div class="hint-hand">
                <i class="fas fa-hand-pointer"></i>
              </div>
              <p class="hint-text">Kaparj meg a sorsjegyet!</p>
            </div>
          </transition>

          <!-- Feltárt overlay -->
          <transition name="prize-reveal">
            <div v-if="revealed" class="revealed-overlay">
              <div class="revealed-content">
                <button class="action-btn close-btn" @click="closePopup">
                  <i class="fas fa-check"></i>
                  Bezárás
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Progress bar -->
        <div class="progress-section" v-if="!revealed">
          <div class="progress-label">
            <span>Kaparási folyamat</span>
            <span class="progress-percent" :style="{ color: progressColor }">
              {{ progressPercentage }}%
            </span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%', backgroundColor: progressColor }"
            ></div>
          </div>
        </div>

        <!-- Gombok -->
        <div class="action-buttons" v-if="!revealed">
          <button class="action-btn reveal-btn" @click="revealAll">
            <i class="fas fa-eye"></i>
            Azonnali feltárás
          </button>
        </div>

        <!-- Statisztikák -->
        <div class="stats-section">
          <div class="stat-item">
            <i class="fas fa-star"></i>
            <span>Egyszeri lehetőség</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-gift"></i>
            <span>Kaparj meg és nyerj!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.popup-content {
  position: relative;
  background: white;
  border-radius: 30px;
  max-width: 650px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: popupSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes popupSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-popup-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-popup-btn:hover {
  background: #e74c3c;
  transform: rotate(90deg);
}

.scratch-card-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Nunito', sans-serif;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.scratch-title {
  font-size: 36px;
  font-weight: 800;
  color: #fbaf32;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.scratch-title i {
  margin-right: 10px;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(15deg);
  }
}

.scratch-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.scratch-card-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 320px;
  margin: 0 auto 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.prize-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scratch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  z-index: 10;
  touch-action: none;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fbaf32;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.hint-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  pointer-events: none;
}

.hint-hand {
  font-size: 60px;
  animation: pointDown 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes pointDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(15px);
  }
}

.hint-text {
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.revealed-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 30px;
  z-index: 30;
  pointer-events: none;
}

.revealed-content {
  text-align: center;
  pointer-events: auto;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.progress-percent {
  font-weight: 800;
  font-size: 16px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.action-btn {
  padding: 14px 30px;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 700;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.action-btn:active {
  transform: translateY(0);
}

.reveal-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.reveal-btn:hover {
  background: linear-gradient(135deg, #2980b9, #21618c);
}

.close-btn {
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
}

.close-btn:hover {
  background: linear-gradient(135deg, #229954, #1e8449);
}

.stats-section {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.stat-item i {
  font-size: 18px;
  color: #fbaf32;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.prize-reveal-enter-active {
  animation: revealSlide 0.5s ease-out;
}

.prize-reveal-leave-active {
  animation: revealSlide 0.5s ease-in reverse;
}

@keyframes revealSlide {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .scratch-card-wrapper {
    padding: 20px;
  }

  .scratch-title {
    font-size: 28px;
  }

  .scratch-card-container {
    height: 280px;
  }

  .action-btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .stats-section {
    flex-direction: column;
    align-items: center;
  }
}
</style>
