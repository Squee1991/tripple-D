<script setup>
import {useRouter} from 'vue-router'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const { t } = useI18n()
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
            <img src="../../assets/images/PlusLogo.png" alt="">
          </div>
          <p class="premium-sheet__text">{{ t('premiumBannerText.text')}}</p>
          <button class="premium-sheet__btn" @click="goToPay">{{ t('cabinet.buyPremium') }}</button>
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
  background-color: var(--tabBg);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 20px 30px 20px;
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
  margin-bottom: 40px;
  cursor: pointer;
}

.premium-sheet__icon {
  width: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.premium-sheet__title {
  font-size: 24px;
  font-weight: 900;
  color: #FF9F7F;
  margin: 0 0 8px 0;
}

.premium-sheet__text {
  font-size: 16px;
  font-weight: 700;
  color: var(--title);
  text-align: center;
  margin: 0 0 26px 0;
  line-height: 1.3;
}

.premium-sheet__btn {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  font-size: 17px;
  font-weight: 800;
  padding: 14px;
  border-radius: 50px;
  border: none;
  border-bottom: 5px solid #1d4ed8;
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