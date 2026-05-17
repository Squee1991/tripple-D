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
    <transition name="premium-fade">
      <div v-if="show" class="premium-wrapper" @click.self="close">
        <div class="premium-sheet">
          <div class="premium-sheet__drag-pill" @click="close"></div>
          <div class="premium-sheet__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                 stroke="#FF9F7F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h2 class="premium-sheet__title">Skillup PLUS</h2>
          <p class="premium-sheet__text">Откройте доступ ко всем темам. Получайте максимум от обучения!</p>
          <button class="premium-sheet__btn" @click="goToPay">Skillup PLUS</button>
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
  background-color: rgba(0, 0, 0, 0.5);
  touch-action: none;
}

.premium-sheet {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 12px 20px 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.premium-sheet__drag-pill {
  width: 40px;
  height: 5px;
  background-color: #e5e7eb;
  border-radius: 10px;
  margin-bottom: 20px;
  cursor: pointer;
}

.premium-sheet__icon {
  background: #f9fafb;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border: 2px solid #f3f4f6;
}

.premium-sheet__title {
  font-size: 24px;
  font-weight: 900;
  color: #FF9F7F;
  margin: 0 0 8px 0;
}

.premium-sheet__text {
  font-size: 15px;
  font-weight: 700;
  color: #4b5563;
  text-align: center;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.premium-sheet__btn {
  width: 100%;
  background-color: #FFEB7F;
  color: #92400e;
  font-size: 17px;
  font-weight: 800;
  padding: 14px;
  border-radius: 18px;
  border: none;
  border-bottom: 4px solid #f59e0b;
  cursor: pointer;
  font-family: inherit;
}

.premium-sheet__btn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.premium-fade-enter-active,
.premium-fade-leave-active {
  transition: opacity 0.2s ease;
}

.premium-fade-enter-from,
.premium-fade-leave-to {
  opacity: 0;
}

.premium-fade-enter-active .premium-sheet,
.premium-fade-leave-active .premium-sheet {
  transition: transform 0.2s, transform 0.2s ease-out;
}

.premium-fade-enter-from .premium-sheet,
.premium-fade-leave-to .premium-sheet {
  transform: translateY(100%);
}
</style>