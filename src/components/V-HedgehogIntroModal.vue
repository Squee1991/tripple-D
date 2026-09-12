<template>
  <transition name="intro-fullscreen">
    <div v-if="isVisible" class="hh-fullscreen-intro">
      <button class="hh-close-btn" aria-label="Закрыть" @click="closeModal">✕</button>
      <div class="hh-scroll-container">
        <div class="hh-hero-section">
          <div class="hh-badge">Новый помощник</div>
          <div class="hh-avatar-stage">
            <div class="hh-character-glow"></div>
            <img :src="Assistant" alt="Hedgehog Tutor" class="hh-character-img" />
            <div class="hh-character-pedestal"></div>
          </div>
          <h2 class="hh-intro-title">Твой персональный ассистент</h2>
          <p class="hh-intro-subtitle">
            Поможет освоить немецкий прямо во время практики.
          </p>
        </div>
        <div class="hh-features-wrapper">
          <div class="hh-feature-card">
            <div class="hh-feature-icon">🖼️</div>
            <div class="hh-feature-info">
              <h4>Помощь с картинками</h4>
              <p>Разберет сцену, подскажет нужные слова и как лучше начать предложение.</p>
            </div>
          </div>
          <div class="hh-feature-card">
            <div class="hh-feature-icon">💡</div>
            <div class="hh-feature-info">
              <h4>Грамматика</h4>
              <p>Пояснит падежи, артикли и окончания прямо в процессе урока.</p>
            </div>
          </div>
          <div class="hh-feature-card">
            <div class="hh-feature-icon">🎯</div>
            <div class="hh-feature-info">
              <h4>Разбор твоих ответов</h4>
              <p>Исправит ошибки, похвалит за удачные обороты и покажет эталонную формулировку.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="hh-footer-action">
        <button class="hh-btn-3d" @click="closeModal">Понятно</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Assistant from '~/assets/images/Assistent.png'

const isVisible = ref(false)
const STORAGE_KEY = 'hh_assistant_intro_seen'

onMounted(() => {
  // Раскомментируй для продакшена:
  // const isSeen = localStorage.getItem(STORAGE_KEY)
  // if (!isSeen) {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
  // }
})

const closeModal = () => {
  isVisible.value = false
  // localStorage.setItem(STORAGE_KEY, 'true')
}
</script>

<style scoped>

.hh-fullscreen-intro {
  position: fixed;
  inset: 0;
  background-color: #0f121d;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
}

.hh-close-btn {
  position: absolute;
  top: max(16px, env(safe-area-inset-top, 16px));
  left:  18px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: transform 0.15s, background-color 0.15s;
}

.hh-close-btn:active {
  transform: scale(0.9);
}

.hh-scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 24px;
}

.hh-hero-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: max(32px, env(safe-area-inset-top, 32px)) 20px 16px;
  background: linear-gradient(
      180deg,
      #0099e6 0%,
      #006eb3 45%,
      rgba(15, 18, 29, 0.8) 85%,
      #0f121d 100%
  );
  text-align: center;
}

.hh-badge {
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 18px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.hh-avatar-stage {
  position: relative;
  width: 170px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.hh-character-glow {
  position: absolute;
  top: 10px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(0, 168, 219, 0) 70%);
  border-radius: 50%;
  z-index: 1;
}

.hh-character-img {
  width: 100%;
  height: 175px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.3));
}


.hh-character-pedestal {
  width: 130px;
  height: 24px;
  background: radial-gradient(
      ellipse at center,
      rgba(15, 23, 42, 0.85) 0%,
      rgba(0, 80, 150, 0.5) 45%,
      rgba(0, 168, 219, 0) 75%
  );
  border-radius: 50%;
  margin-top: -24px;
  box-shadow: 0 4px 16px rgba(0, 194, 255, 0.35);
  position: relative;
  z-index: 1;
}

.hh-intro-title {
  color: #ffffff;
  font-size: 21px;
  font-weight: 800;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.hh-intro-subtitle {
  color: #9db2d4;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  max-width: 320px;
}

.hh-features-wrapper {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 20px 0;
}

.hh-feature-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border-radius: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.hh-feature-icon {
  width: 44px;
  height: 44px;
  background: #121422;
  border: 1px solid #282e46;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.hh-feature-info h4 {
  margin: 0 0 3px 0;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.hh-feature-info p {
  margin: 0;
  font-size: 12px;
  color: #8c97b2;
  line-height: 1.35;
}

.hh-footer-action {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 20px max(20px, env(safe-area-inset-bottom, 20px));
  background: linear-gradient(180deg, rgba(15, 18, 29, 0) 0%, #0f121d 40%);
}

.hh-btn-3d {
  width: 100%;
  max-width: 420px;
  padding: 16px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 5px 0 #1d4ed8;
  transition: transform 0.1s, box-shadow 0.1s;
}

.hh-btn-3d:active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #1d4ed8;
}

.intro-fullscreen-enter-active,
.intro-fullscreen-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.intro-fullscreen-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.intro-fullscreen-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>