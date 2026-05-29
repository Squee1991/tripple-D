<template>
  <Transition name="fade">
    <div v-if="isOffline || isSuccessShowing" class="offline-overlay">
      <div class="content-wrapper">
        <div class="content">
          <h2 class="network__title">{{ isSuccessComputedTitle }}</h2>
          <div class="network__icon-wrapper" :class="{ 'success-bounce': isSuccessShowing }">
            <img class="network__icon" src="/images/NetworkError.svg" alt="Статус сети">
          </div>
          <div class="network__status-block" :class="{ 'status-success': isSuccessShowing }">
            <span class="pulse-dot"></span>
            <p class="network__text">{{ isSuccessComputedText }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed} from 'vue'
const { t } = useI18n();
const isOffline = useNetworkState();

const isSuccessShowing = ref(false);

const isSuccessComputedTitle = computed(() => {
  return isSuccessShowing.value ? t('netWork.successTitle') : t('netWork.notSuccessTitle')
})

const isSuccessComputedText = computed(() => {
  return isSuccessShowing.value ? t('netWork.successText') : t('netWork.notSuccessText')
})

watch(isOffline, (newOfflineState) => {
  if (!newOfflineState) {
    isSuccessShowing.value = true;
    setTimeout(() => {
      isSuccessShowing.value = false;
    }, 1200);
  } else {
    isSuccessShowing.value = false;
  }
});
</script>

<style scoped>

.offline-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 768px;
  background: var(--bg);
  border-radius: 32px 32px 0 0;
  padding: 20px 24px 62px 24px;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s ease-in-out;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.network__title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--titleColor);
  margin-bottom: 5px;
  transition: color 0.3s ease;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.05);
}

.network__icon-wrapper {
  padding: 24px 0;
  animation: float 3s ease-in-out infinite;
}

.network__icon {
  width: 180px;
  height: auto;
  display: block;
  filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.5));
}

.network__status-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 10px 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.network__text {
  font-size: 15px;
  font-weight: 600;
  color: var(--titleColor);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background-color: #f39c12;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 12px #f39c12, 0 0 4px #f39c12;
  transition: all 0.3s ease;
}

.pulse-dot::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f39c12;
  border-radius: 50%;
  animation: pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-success {
  background: rgba(0, 220, 130, 0.06);
  border-color: rgba(0, 220, 130, 0.3);
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.15), inset 0 1px 1px rgba(0, 220, 130, 0.2);
}

.status-success .network__text {
  color: #04b76e;
  opacity: 1;
  text-shadow: 0 0 10px rgba(0, 220, 130, 0.3);
}

.status-success .pulse-dot {
  background-color: #00dc82;
  box-shadow: 0 0 12px #00dc82, 0 0 4px #00dc82;
}

.status-success .pulse-dot::after {
  animation: none;
  opacity: 0;
}

.success-bounce {
  animation: bounce 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  100% {
    transform: scale(3.2);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) scale(1, 1);
  }
  30% {
    transform: translateY(-20px) scale(0.95, 1.05);
  }
  50% {
    transform: translateY(5px) scale(1.02, 0.98);
  }
  70% {
    transform: translateY(-4px) scale(0.99, 1.01);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .content-wrapper {
  transform: translateY(100%);
}

.fade-leave-to .content-wrapper {
  transform: translateY(100%);
}
</style>