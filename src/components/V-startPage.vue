<template>
  <div class="welcome-container">
    <div class="ui-layout welcome-bg">
      <img class="start__bg" src="~/assets/images/startBg.png" alt="startBg">
      <div class="text-content">
        <div class="game-title">
          <img src="../../assets/images/logoReview.webp" alt="logo">
        </div>

        <div class="hero-wrap">
          <!-- Общий контейнер: ёжик и облако двигаются строго вместе -->
          <div class="hero-cloud-wrapper floating-animation">

            <!-- Ёжик сзади -->
            <div class="hero-clay">
              <ClientOnly>
                <DotLottieVue
                    style="width: 335px; height: 335px;"
                    :data="JSON.stringify(Greetings)"
                    :autoplay="true"
                    :loop="true"
                />
              </ClientOnly>
            </div>
            <div class="cloud-platform">
              <span class="middle-bump"></span>
              <div class="cloud-text-wrap">
                <span class="cloud-main-text">DEUTSCH MIT SPAß LERNEN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cta-block">
      <button @click="router.push('/language')" class="btn-emerald-3d"> {{ t('selectedpage.startBtn')}}</button>
    </div>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import Greetings from '~/assets/animation/Greetings.json'

const { t } = useI18n()
const router = useRouter()
</script>

<style scoped>
.welcome-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.start__bg {
  position: fixed;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  left: 0;
  top: 0;
  right: 0;
}

.ui-layout {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  padding: 10px;
  position: relative;
  z-index: 1;
}

.welcome-bg {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--bg);
}

.text-content {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-title {
  position: relative;
  z-index: 9;
  font-size: 26px;
  font-weight: 900;
  color: var(--titleColor);
  line-height: 1.1;
  margin-bottom: 15px;
  text-align: center;
  padding: 20px;
}

.hero-wrap {
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.hero-cloud-wrapper {
  position: relative;
  width: 290px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.floating-animation {
  animation: floatTogether 4s ease-in-out infinite;
}

@keyframes floatTogether {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hero-clay {
  width: 140px;
  height: 140px;
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.cloud-platform {
  position: absolute;
  bottom: 0;
  width: 290px;
  height: 70px;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12), inset 0 -4px 10px rgba(0, 0, 0, 0.04), inset 0 2px 5px rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.cloud-platform::before {
  content: '';
  position: absolute;
  top: -32px;
  left: 20px;
  width: 85px;
  height: 65px;
  background: #ffffff;
  border-radius: 50%;
}

.cloud-platform::after {
  content: '';
  position: absolute;
  top: -16px;
  right: 20px;
  width: 75px;
  height: 65px;
  background: #ffffff;
  border-radius: 50%;
}

.cloud-platform span.middle-bump {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 80px;
  background: #ffffff;
  border-radius: 50%;
  z-index: 2;
}

.cloud-text-wrap {
  position: absolute;
  z-index: 4;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  bottom: 16px;
  text-align: center;
  padding: 0 10px;
}

.cloud-main-text {
  font-size: 16px;
  color: white;
  text-transform: uppercase;
  font-family: "Sniglet", system-ui;
  font-weight: 800;
  font-style: normal;
  letter-spacing: 4px;
  text-shadow:
      1.5px 1.5px 0px #06B6D4,
      -1.5px 1.5px 0px #06B6D4,
      1.5px -1.5px 0px #06B6D4,
      -1.5px -1.5px 0px #06B6D4,
      0px 1.5px 0px #06B6D4,
      0px -1.5px 0px #06B6D4,
      1.5px 0px 0px #06B6D4,
      -1.5px 0px 0px #06B6D4;
}

.cta-block {
  max-width: 560px;
  width: 100%;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 25px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 15px);
  z-index: 10;
}

.btn-emerald-3d:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 #065f46;
}

.btn-emerald-3d {
  width: 100%;
  padding: 12px;
  color: white;
  font-size: 18px;
  font-weight: 900;
  border: none;
  border-radius: 58px;
  cursor: pointer;
  background: #15bec3;
  box-shadow: 0 8px 0 #0ca0a5;
  transition: all 0.1s active;
  -webkit-tap-highlight-color: transparent;
}
</style>