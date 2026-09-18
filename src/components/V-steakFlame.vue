<template>
  <div class="character-arena">
    <div class="epicenter">
      <div class="singularity-point" :class="{ 'charging': isCharging }"></div>
      <div class="nova-shockwave wave-1" :class="{ 'trigger-wave-1': isBursting }"></div>
      <div class="nova-shockwave wave-2" :class="{ 'trigger-wave-2': isBursting }"></div>
      <div class="nova-shockwave wave-3" :class="{ 'trigger-wave-3': isBursting }"></div>
      <div v-for="c in comicSparks" :key="c.id" class="comic-spark" :style="c.style">
        {{ c.shape }}
      </div>
    </div>

    <div
        class="flame-shell"
        :class="{
        'squash-hit': isStriking && !isLevelUpActive,
        'smooth-collapse': isCharging,
        'smooth-burst': isBursting
      }"
    >
      <svg class="toon-flame-svg" viewBox="0 0 160 210" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            class="flame-layer outer"
            d="M80 8 C92 34 112 44 126 70 C144 104 140 148 116 178 C98 202 62 202 44 178 C20 148 16 104 34 70 C48 44 68 34 80 8 Z"
            :fill="stage.outerColor"
            stroke="#12131a"
            stroke-width="7"
            stroke-linejoin="round"
        />
        <path
            class="flame-layer mid"
            d="M80 44 C88 64 102 72 112 92 C124 116 120 148 104 168 C92 184 68 184 56 168 C40 148 36 116 48 92 C58 72 72 64 80 44 Z"
            :fill="stage.midColor"
            stroke="#12131a"
            stroke-width="5"
            stroke-linejoin="round"
        />
        <path
            class="flame-layer core"
            d="M80 84 C84 98 94 104 100 118 C108 134 104 154 94 166 C86 176 74 176 66 166 C56 154 52 134 60 118 C66 104 76 98 80 84 Z"
            :fill="stage.coreColor"
        />
        <path
            class="comic-highlight"
            d="M48 80 C40 102 42 134 50 156 C44 140 44 110 52 86 Z"
            fill="#ffffff"
            opacity="0.9"
        />
        <path
            class="comic-shadow"
            d="M124 110 C128 136 120 162 108 178 C118 164 122 138 120 114 Z"
            fill="#12131a"
            opacity="0.2"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'

const props = defineProps({
  streak: {type: Number, required: true}
})

const emit = defineEmits(['update:stage'])

const isStriking = ref(false)
const isCharging = ref(false)
const isBursting = ref(false)
const isLevelUpActive = ref(false)
const comicSparks = ref([])

// Стадии
const stage = computed(() => {
  const count = props.streak
  if (count < 3) return {
    level: 1,
    tierName: 'EMBER SPARK',
    bgGrad: 'linear-gradient(145deg, #ff7700, #b33800)',
    outerColor: '#ff5e00',
    midColor: '#ffaa00',
    coreColor: '#fff275',
    accent: '#ff7700',
    speed: '1.4s',
    sparkCount: 6
  }
  if (count < 7) return {
    level: 2,
    tierName: 'CRIMSON SURGE',
    bgGrad: 'linear-gradient(145deg, #ff1744, #9e0020)',
    outerColor: '#ff1744',
    midColor: '#ff5252',
    coreColor: '#ffffff',
    accent: '#ff1744',
    speed: '1.3s',
    sparkCount: 8
  }
  if (count < 14) return {
    level: 3,
    tierName: 'SOLAR BLAZE',
    bgGrad: 'linear-gradient(145deg, #ffd600, #a37c00)',
    outerColor: '#ffb300',
    midColor: '#ffe082',
    coreColor: '#ffffff',
    accent: '#ffd600',
    speed: '1.2s',
    sparkCount: 10
  }
  if (count < 22) return {
    level: 4,
    tierName: 'TOXIC FLASH',
    bgGrad: 'linear-gradient(145deg, #00e676, #007a33)',
    outerColor: '#00e676',
    midColor: '#b9f6ca',
    coreColor: '#ffffff',
    accent: '#00e676',
    speed: '1.1s',
    sparkCount: 12
  }
  if (count < 32) return {
    level: 5,
    tierName: 'CYAN JET',
    bgGrad: 'linear-gradient(145deg, #00e5ff, #007a8f)',
    outerColor: '#00e5ff',
    midColor: '#84ffff',
    coreColor: '#ffffff',
    accent: '#00e5ff',
    speed: '1.0s',
    sparkCount: 14
  }
  if (count < 45) return {
    level: 6,
    tierName: 'NEON INDIGO',
    bgGrad: 'linear-gradient(145deg, #536dfe, #1c27b3)',
    outerColor: '#3d5afe',
    midColor: '#8c9eff',
    coreColor: '#ffffff',
    accent: '#536dfe',
    speed: '0.9s',
    sparkCount: 16
  }
  if (count < 60) return {
    level: 7,
    tierName: 'PLASMA PURPLE',
    bgGrad: 'linear-gradient(145deg, #e040fb, #7b0099)',
    outerColor: '#d500f9',
    midColor: '#f50057',
    coreColor: '#ffffff',
    accent: '#e040fb',
    speed: '0.8s',
    sparkCount: 18
  }
  if (count < 80) return {
    level: 8,
    tierName: 'RADIOACTIVE PINK',
    bgGrad: 'linear-gradient(145deg, #ff1744, #8f004a)',
    outerColor: '#ff007f',
    midColor: '#ff80ab',
    coreColor: '#ffffff',
    accent: '#ff1744',
    speed: '0.7s',
    sparkCount: 22
  }
  if (count < 100) return {
    level: 9,
    tierName: 'GOLD OVERLOAD',
    bgGrad: 'linear-gradient(145deg, #ffffff, #b38b00)',
    outerColor: '#ffd700',
    midColor: '#ffffff',
    coreColor: '#fff9c4',
    accent: '#ffffff',
    speed: '0.6s',
    sparkCount: 26
  }
  return {
    level: 10,
    tierName: 'SUPERNOVA X',
    bgGrad: 'linear-gradient(145deg, #ff0055, #000000)',
    outerColor: '#ff0055',
    midColor: '#00f7ff',
    coreColor: '#ffff00',
    accent: '#ffffff',
    speed: '0.5s',
    sparkCount: 40
  }
})

// Передаем данные наверх родителю при загрузке и смене
onMounted(() => emit('update:stage', stage.value))
watch(() => stage.value, (newVal) => emit('update:stage', newVal), {deep: true})

const checkLevelThreshold = (val) => [3, 7, 14, 22, 32, 45, 60, 80, 100].includes(val)

// Следим за ростом стрика
watch(() => props.streak, (newVal, oldVal) => {
  if (newVal > oldVal) {
    igniteStreak(newVal)
  }
})

const igniteStreak = (newVal) => {
  if (isLevelUpActive.value) return
  if (checkLevelThreshold(newVal)) {
    executeCinematicSupernova()
  } else {
    executeStandardStrike()
  }
}

const executeStandardStrike = () => {
  isStriking.value = true
  setTimeout(() => {
    isStriking.value = false
  }, 320)
  spawnComicSparks(false)
}

const executeCinematicSupernova = () => {
  isLevelUpActive.value = true
  isCharging.value = true

  setTimeout(() => {
    isCharging.value = false
    isBursting.value = true
    spawnComicSparks(true)

    setTimeout(() => {
      isBursting.value = false
      isLevelUpActive.value = false
    }, 1400)
  }, 1600)
}

const spawnComicSparks = (isMega) => {
  const shapes = ['▲', '✦', '◆', '⚡', '●']
  const count = isMega ? stage.value.sparkCount * 2 : stage.value.sparkCount

  for (let i = 0; i < count; i++) {
    const id = Date.now() + Math.random()
    const angle = Math.random() * 360
    const distance = 80 + Math.random() * (isMega ? 150 : 80)
    const rad = angle * (Math.PI / 180)
    const tx = Math.cos(rad) * distance
    const ty = Math.sin(rad) * distance
    const rot = (Math.random() - 0.5) * 720
    const dur = 0.6 + Math.random() * (isMega ? 0.7 : 0.3)
    const size = (isMega ? 24 : 12) + Math.random() * 14
    const shape = shapes[Math.floor(Math.random() * shapes.length)]

    comicSparks.value.push({
      id, shape,
      style: {
        fontSize: `${size}px`,
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        '--rot': `${rot}deg`,
        animationDuration: `${dur}s`,
        color: stage.value.accent
      }
    })

    setTimeout(() => {
      comicSparks.value = comicSparks.value.filter(s => s.id !== id)
    }, dur * 1000)
  }
}
</script>

<style scoped>
.character-arena {
  position: relative;
  width: 100px; /* Уменьшили для шапки */
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.65); /* Масштабируем, чтобы влезло */
  transform-origin: center right;
}

.epicenter {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 15;
}

.singularity-point {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 20px #ffffff;
  opacity: 0;
  pointer-events: none;
  transform: scale(0);
}

.singularity-point.charging {
  animation: singularityIgnite 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.nova-shockwave {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 10px solid currentColor;
  opacity: 0;
  pointer-events: none;
  z-index: 2;
}

.trigger-wave-1 {
  animation: novaWave 1.1s cubic-bezier(0.1, 0.85, 0.2, 1) forwards;
}

.trigger-wave-2 {
  animation: novaWave 1.1s cubic-bezier(0.1, 0.85, 0.2, 1) 0.15s forwards;
}

.trigger-wave-3 {
  animation: novaWave 1.1s cubic-bezier(0.1, 0.85, 0.2, 1) 0.3s forwards;
}

.flame-shell {
  width: 160px;
  height: 210px;
  animation: comicBounce var(--anim-speed) infinite ease-in-out;
  transform-origin: 50% 50%;
  filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.3));
}

.toon-flame-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.flame-layer {
  transition: fill 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.flame-layer.outer {
  animation: shapeMorph var(--anim-speed) infinite alternate ease-in-out;
  transform-origin: 50% 90%;
}

.flame-layer.mid {
  animation: shapeMorph calc(var(--anim-speed) * 0.8) infinite alternate-reverse ease-in-out;
  transform-origin: 50% 85%;
}

.flame-layer.core {
  animation: coreMorph calc(var(--anim-speed) * 0.6) infinite alternate ease-in-out;
  transform-origin: 50% 80%;
}

.squash-hit {
  animation: comicSquash 0.32s cubic-bezier(0.18, 0.89, 0.32, 1.4) forwards;
}

.smooth-collapse {
  animation: pureSmoothCollapse 1.6s cubic-bezier(0.4, 0, 0.15, 1) forwards !important;
}

.smooth-burst {
  animation: pureSmoothBurst 1.4s cubic-bezier(0.15, 0.85, 0.2, 1.15) forwards !important;
}

.comic-spark {
  position: absolute;
  -webkit-text-stroke: 1.5px #12131a;
  text-shadow: 0 2px 0 #12131a;
  pointer-events: none;
  animation: burstParticle forwards cubic-bezier(0.12, 0.8, 0.32, 1);
  z-index: 20;
}

@keyframes novaWave {
  0% {
    transform: scale(0.2);
    opacity: 1;
    border-width: 24px;
  }
  100% {
    transform: scale(8);
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes singularityIgnite {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1);
    opacity: 0.8;
  }
  90% {
    transform: scale(2.2);
    opacity: 1;
  }
  100% {
    transform: scale(3.5);
    opacity: 0;
  }
}

@keyframes pureSmoothCollapse {
  0% {
    transform: scale(1, 1);
    filter: drop-shadow(0 12px 0 rgba(0, 0, 0, 0.5)) brightness(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.01, 0.01);
    filter: drop-shadow(0 0 15px #ffffff) brightness(2.5);
    opacity: 0.1;
  }
}

@keyframes pureSmoothBurst {
  0% {
    transform: scale(0.01, 0.01);
    filter: brightness(3.5) contrast(2) drop-shadow(0 0 60px #ffffff);
    opacity: 1;
  }
  30% {
    transform: scale(1.6, 1.5);
    filter: brightness(2);
  }
  65% {
    transform: scale(0.92, 1.08);
    filter: brightness(1.15);
  }
  85% {
    transform: scale(1.04, 0.96);
    filter: brightness(1.05);
  }
  100% {
    transform: scale(1, 1);
    filter: brightness(1);
  }
}

@keyframes comicBounce {
  0%, 100% {
    transform: scale(1, 1) translateY(0);
  }
  35% {
    transform: scale(1.05, 0.95) translateY(4px);
  }
  70% {
    transform: scale(0.96, 1.04) translateY(-6px);
  }
}

@keyframes comicSquash {
  0% {
    transform: scale(1, 1);
  }
  35% {
    transform: scale(1.25, 0.75) translateY(10px);
  }
  75% {
    transform: scale(0.9, 1.15) translateY(-10px);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}

@keyframes shapeMorph {
  0% {
    transform: scaleX(0.96) skewX(-2deg);
  }
  50% {
    transform: scaleX(1.04) skewX(2deg);
  }
  100% {
    transform: scaleX(0.97) skewX(-1deg);
  }
}

@keyframes coreMorph {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes burstParticle {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(0.2);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1.1);
    opacity: 0;
  }
}
</style>