<script setup>
import {useRouter} from 'vue-router'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])
const router = useRouter()

const close = () => {
  emit('update:show', false)
}

const goToPay = () => {
  close()
  router.push('/pay')
}
</script>

<template>
  <teleport to="body">
    <transition name="overlay">
      <div v-if="show" class="premium-wrapper" @click.self="close">
        <div class="premium-sheet">
          <div class="premium-sheet__drag-pill" @click="close"></div>

          <div class="premium-sheet__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="#FF9F7F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h2 class="premium-sheet__title">Skillup PLUS</h2>
          <p class="premium-sheet__text">Откройте доступ ко всем темам и другим эксклюзивным материалам!</p>

          <button class="premium-sheet__btn" @click="goToPay">
            Приобрести Skillup PLUS
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.premium-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  /* Вот он, наш overlay: */
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px); /* Добавляет легкий премиальный блюр заднего фона */
}

.premium-sheet {
  width: 100%;
  max-width: 800px;
  background-color: var(--bg, #ffffff);
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  padding: 16px 24px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 3px solid var(--tabsSlideBorderColor, #e5e7eb);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  will-change: transform;
}

.premium-sheet__drag-pill {
  width: 48px;
  height: 6px;
  background-color: #d1d5db;
  border-radius: 10px;
  margin-bottom: 20px;
  cursor: pointer;
}

.premium-sheet__icon {
  background: var(--menuItemsBg, #f3f4f6);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 3px solid var(--tabsSlideBorderColor, #e5e7eb);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor, #e5e7eb);
}

.premium-sheet__title {
  font-size: 26px;
  font-weight: 900;
  color: #FF9F7F;
  text-transform: uppercase;
  margin: 0 0 12px 0;
  text-align: center;
}

.premium-sheet__text {
  font-size: 16px;
  font-weight: 800;
  color: var(--titleColor, #374151);
  text-align: center;
  margin: 0 0 24px 0;
  line-height: 1.4;
}

.premium-sheet__btn {
  width: 100%;
  background-color: #FFEB7F;
  color: #d97706;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 16px;
  border-radius: 20px;
  border: 3px solid #d97706;
  box-shadow: 0 5px 0 #d97706;
  cursor: pointer;
  transition: all 0.1s;
  font-family: 'Nunito', sans-serif;
}

.premium-sheet__btn:active {
  transform: translateY(5px);
  box-shadow: 0 0px 0 #d97706;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: background-color 0.35s ease, backdrop-filter 0.35s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  background-color: transparent;
  backdrop-filter: blur(0px);
}

.overlay-enter-active .premium-sheet,
.overlay-leave-active .premium-sheet {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.overlay-enter-from .premium-sheet,
.overlay-leave-to .premium-sheet {
  transform: translateY(100%);
}
</style>