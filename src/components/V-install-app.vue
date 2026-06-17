<script setup>
import { ref, onMounted } from 'vue'
import AppIcon from '~/assets/images/logoReview.webp'
import { userAuthStore } from "../../store/authStore.js";

const isVisible = ref(true)
const authStore = userAuthStore()

const closeModal = () => {
  isVisible.value = false
  localStorage.setItem('app_promo_seen', 'true')
}

const openStore = (platform) => {
  if (platform === 'ios') {
    window.open('https://apps.apple.com/app/твой-id', '_blank')
  } else {
    window.open('https://play.google.com/store/apps/details?id=твой.id', '_blank')
  }
  closeModal()
}

onMounted(() => {
  if (!localStorage.getItem('app_promo_seen')) {
    setTimeout(() => {
      isVisible.value = true
    }, 5200)
  }
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isVisible && authStore.uid" class="modal-overlay" @click.self="closeModal">
          <div class="promo-modal">
            <button class="close-btn" @click="closeModal">✕</button>

            <div class="promo-content">
              <div class="icon-glow-wrapper">
                <img class="app-icon" :src="AppIcon" alt="App Icon">
                <div class="glow-effect"></div>
              </div>
              <p class="promo-subtitle">
                С приложением Skillupgerman учить немецкий гораздо удобнее.
              </p>
              <div class="store-buttons">
                <button class="store-btn apple-btn" @click="openStore('ios')">
                  <svg viewBox="0 0 384 512" class="store-icon"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  <div class="btn-text">
                    <span class="btn-large-text">App Store</span>
                  </div>
                </button>

                <button class="store-btn google-btn" @click="openStore('android')">
                  <svg viewBox="0 0 512 512" class="store-icon"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                  <div class="btn-text">
                    <span class="btn-large-text">Google Play</span>
                  </div>
                </button>
              </div>

              <button class="continue-browser" @click="closeModal">
                Продолжить в браузере
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.59);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 20px;
}

.promo-modal {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  width: 100%;
  max-width: 420px;
  padding: 32px 24px;
  position: relative;
  color: #fff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.icon-glow-wrapper {
  position: relative;
  margin: 0 auto;
}

.app-icon {
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 10px;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: #3b82f6;
  border-radius: 20px;
  filter: blur(24px);
  opacity: 0.6;
  z-index: 1;
}

.promo-title {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(to right, #fff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.promo-subtitle {
  font-size: 15px;
  line-height: 1.5;
  color: white;
  font-weight: 600;
  margin: 0 0 28px 0;
}

.store-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.store-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 10px 20px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  width: 100%;
  height: 54px;
}

.store-btn:hover {
  background: #111;
  transform: translateY(-2px);
}

.store-btn:active {
  transform: translateY(0);
}

.store-icon {
  width: 24px;
  height: 24px;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.btn-small-text {
  font-size: 10px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.btn-large-text {
  font-size: 18px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.continue-browser {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.2s;
}

.continue-browser:hover {
  color: #cbd5e1;
}

@media (min-width: 480px) {
  .store-buttons {
    flex-direction: row;
  }
  .store-btn {
    flex: 1;
    padding: 10px 12px;
  }
}
</style>