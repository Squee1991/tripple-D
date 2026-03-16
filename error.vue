<script setup>
import {computed} from 'vue'

const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({redirect: '/'})
}

const is500 = computed(() => props.error?.statusCode >= 500)

const config = computed(() => {
  if (is500.value) {
    return {
      code: '500',
      title: 'УПС...',
      subtitle: 'Сервер решил немного отдохнуть. Мы уже его будим.',
      bg: '#4b6584',
      charColor: '#d1d8e0',
      btnColor: '#778ca3',
      animationClass: 'float-mode'
    }
  }
  return {
    code: '404',
    title: 'ОЙ-ЙОЙ!',
    subtitle: 'Похоже, эта страница потерялась в мультивселенной...',
    bg: '#6c5ce7',
    charColor: '#ffeaa7',
    btnColor: '#0984e3',
    animationClass: 'bounce-mode'
  }
})
</script>

<template>
  <div class="cartoon-space" :style="{ background: config.bg }">
    <div class="deco-blob one"></div>
    <div class="deco-blob two"></div>
    <div class="deco-star an-1">★</div>
    <div class="deco-star an-2">★</div>
    <div class="content-box">
      <div class="code-wrapper" :class="config.animationClass">
        <span class="char char-1" :style="{ color: config.charColor }">{{ config.code[0] }}</span>
        <span class="char char-2" :style="{ color: config.charColor }">{{ config.code[1] }}</span>
        <span class="char char-3" :style="{ color: config.charColor }">{{ config.code[2] }}</span>
      </div>
      <div class="text-group">
        <h1 class="title" :style="{ color: is500 ? '#d1d8e0' : '#fab1a0' }">{{ config.title }}</h1>
        <p class="subtitle">{{ config.subtitle }}</p>
      </div>
      <button class="bounce-btn" :style="{ background: config.btnColor }" @click="handleError">
        <span class="btn-face">Домой!</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

.cartoon-space {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Nunito", sans-serif;
  overflow: hidden;
  position: relative;
  transition: background 0.8s ease;
}

.deco-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(5px);
  opacity: 0.3;
}

.one {
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  top: -100px;
  right: -100px;
}

.two {
  width: 300px;
  height: 300px;
  background: rgba(0, 0, 0, 0.05);
  bottom: -50px;
  left: -50px;
}

.deco-star {
  position: absolute;
  font-size: 3rem;
  color: #ffeaa7;
  opacity: 0.5;
}

.an-1 {
  top: 20%;
  left: 15%;
  animation: starPulse 3s infinite ease-in-out;
}

.an-2 {
  bottom: 25%;
  right: 18%;
  animation: starPulse 3.5s infinite ease-in-out;
}

.content-box {
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.code-wrapper {
  display: flex;
  gap: 10px;
}

.char {
  font-size: clamp(8rem, 25vw, 18rem);
  font-weight: 900;
  line-height: 0.8;
  -webkit-text-stroke: 6px #2d3436;
  text-shadow: 8px 10px 0px #2d3436;
  display: inline-block;
}

/* --- ПЛАВНАЯ АНИМАЦИЯ ДЛЯ 500 (Floating) --- */
.float-mode .char {
  animation: floatSlow 3s infinite ease-in-out alternate;
}

.float-mode .char-2 {
  animation-delay: 0.3s;
}

.float-mode .char-3 {
  animation-delay: 0.6s;
}

/* --- АНИМАЦИЯ ДЛЯ 404 (Bouncing) --- */
.bounce-mode .char-1 {
  animation: bounceUp 0.6s infinite alternate;
}

.bounce-mode .char-2 {
  animation: bounceUp 0.6s infinite alternate 0.15s;
}

.bounce-mode .char-3 {
  animation: bounceUp 0.6s infinite alternate 0.3s;
}

.title {
  font-size: 3.5rem;
  margin: 0;
  -webkit-text-stroke: 3px #2d3436;
  text-shadow: 4px 5px 0px #2d3436;
}

.subtitle {
  font-size: 1.4rem;
  font-family: system-ui, sans-serif;
  font-weight: 600;
  color: #dfe6e9;
  margin-top: 10px;
}

.bounce-btn {
  border: 4px solid #2d3436;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 8px 0 #2d3436;
  transition: all 0.1s ease;
}

.btn-face {
  display: block;
  padding: 15px 40px;
  font-weight: 900;
  font-size: 1.8rem;
  color: white;
}

.bounce-btn:active {
  box-shadow: 0 0px 0 #2d3436;
  transform: translateY(8px);
}

@keyframes bounceUp {
  0% {
    transform: translateY(0) rotate(-3deg);
  }
  100% {
    transform: translateY(-25px) rotate(3deg);
  }
}

@keyframes floatSlow {
  from {
    transform: translateY(0) rotate(-1deg);
  }
  to {
    transform: translateY(15px) rotate(1deg);
  }
}

@keyframes starPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}
</style>