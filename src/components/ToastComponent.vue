<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: "ToastComponent",
  props: {
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "success", // 'success' | 'error'
    },
    duration: {
      type: Number,
      default: 3000,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const visible = ref(false);

    // Watch-oljuk a "show" propot
    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          visible.value = true;
          setTimeout(() => {
            visible.value = false;
          }, props.duration);
        }
      }
    );

    return {
      visible,
      props,
    };
  },
});
</script>

<template>
  <transition name="toast-fade">
    <div
      v-if="visible"
      :class="['toast-message', props.type === 'success' ? 'toast-success' : 'toast-error']"
    >
      {{ props.message }}
    </div>
  </transition>
</template>

<style scoped>
.toast-message {
  position: fixed;
  bottom: 50%;
  right: 20px;
  z-index: 9999;
  padding: 12px 18px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background-color: #28a745;
}

.toast-error {
  background-color: #dc3545;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
