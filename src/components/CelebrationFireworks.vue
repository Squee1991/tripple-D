<template>
  <div class="fireWorks">
    <div class="fireWorks__container" ref="container"></div>
    <div class="congrats" role="status" aria-live="polite">
      <div class="congrats__inner">
        <transition name="fade-up" appear>
          <div class="congrats__title" style="transition-delay:.2s">Поздравляем!</div>
        </transition>
        <transition name="fade-up" appear>
          <p class="congrats__phrase" style="transition-delay:.3s">{{ randomPhrase }}</p>
        </transition>
        <transition name="fade-up" appear>
          <div class="stats">
            <div class="stats__card">
              <div class="stats__label stats__label--exp">Очки опыта</div>
              <div class="stats__value">{{ shownExp }}</div>
            </div>
            <div class="stats__card">
              <div class="stats__label stats__label--points">Артиклюсы</div>
              <div class="stats__value">{{ shownPoints }}</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade-up" appear>
      <div class="btn__back-wrapper" style="transition-delay:.8s">
        <button @click="backTo" class="btn" type="button">Далее</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Lottie from 'lottie-web'
import FireWorks from '../../assets/animation/SuccessAnimation.json'
import { useSfx } from '../composables/useSfx.js'

const { t } = useI18n()
const props = defineProps({
  startExp: { type: Number, required: true },
  targetExp: { type: Number, required: true },
  startPoints: { type: Number, required: true },
  targetPoints: { type: Number, required: true },
})
const phrases = [
  t('randomPhrases.first'),
  t('randomPhrases.second'),
  t('randomPhrases.third'),
  t('randomPhrases.fourth'),
  t('randomPhrases.fifth'),
  t('randomPhrases.sixth'),
  t('randomPhrases.seventh'),
  t('randomPhrases.eighth'),
  t('randomPhrases.ninth'),
  t('randomPhrases.tenth'),
  t('randomPhrases.eleventh'),
  t('randomPhrases.twelfth'),
  t('randomPhrases.thirteenth'),
  t('randomPhrases.fourteenth'),
  t('randomPhrases.fifteenth'),
  t('randomPhrases.sixteenth'),
]
const randomPhrase = ref('')
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const router = useRouter()
const backTo = () => router.back()

const container = ref(null)
const shownExp = ref(props.startExp)
const shownPoints = ref(props.startPoints)

function animateInt(from, to, setter, duration = 900) {
  if (to <= from) { setter(to); return }
  const t0 = performance.now()
  const delta = to - from
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration)
    setter(Math.floor(from + delta * p))
    if (p < 1) requestAnimationFrame(step)
    else setter(to)
  }
  requestAnimationFrame(step)
}

const sfx = useSfx()

onMounted(() => {
  sfx.load('winSound', '/sounds/winSound.mp3', 0.9)
  if (container.value) {
    const anim = Lottie.loadAnimation({
      container: container.value,
      loop: false,
      autoplay: true,
      animationData: FireWorks,
      renderer: 'svg'
    })
    anim.setSpeed(0.7)
  }

  randomPhrase.value = pickRandom(phrases)
  shownExp.value = props.startExp
  shownPoints.value = props.startPoints

  const playNow = () => sfx.play('winSound').catch(() => {
    const unlock = () => { sfx.play('winSound'); window.removeEventListener('pointerdown', unlock) }
    window.addEventListener('pointerdown', unlock, { once: true })
  })
  setTimeout(playNow, 200)
  setTimeout(playNow, 200)
  setTimeout(() => {
    animateInt(props.startExp, props.targetExp, v => (shownExp.value = v), 900)
    animateInt(props.startPoints, props.targetPoints, v => (shownPoints.value = v), 900)
  }, 2000)
})
</script>


<style scoped>

.fireWorks {
  position: relative;
  min-height: 100svh;
  width: 100%;
  overflow: hidden;
  padding-top: 40px;
}

.btn__back-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 25px;
  background: var(--bg);
  border-top: 4px solid var(--border);
}

.fireWorks__container {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  max-width: 90vw;
  pointer-events: none;
}

.congrats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 10px;
  min-height: 90vh;
}

.congrats__inner {
  flex-grow: 1;
  padding-top: 50px;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.fade-up-enter-active {
  transition: opacity .36s ease-out, transform .36s ease-out;
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.congrats__title {
  font-size: 64px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  background: linear-gradient(90deg, #ffd36e, #ff9f6e, #ffd36e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.congrats__phrase {
  text-align: center;
  max-width: 720px;
  padding: 6px 10px;
  font-size: 18px;
  line-height: 1.4;
  color: #6a5b3a;
  font-style: italic;
  opacity: .95;
  margin-top: 40px;
}

.stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.stats__card {
  width: 120px;
  height: 90px;
  background: #7a7a7a;
  opacity: .95;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, .2);
  overflow: hidden;
}

.stats__label {
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 6px;
  padding: 8px 5px;
  text-align: center;
}

.stats__label--exp {
  background: #F1C40F;
}

.stats__label--points {
  background: #27AE60;
}

.stats__value {
  font-size: 24px;
  font-weight: 800;
  color: #fff6dc;
  text-align: center;
  margin-top: 10px;
}

.btn {
  margin-top: auto;
  border-radius: 12px;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  cursor: pointer;
  font-weight: 800;
  padding: 10px 14px;
  background: #4d524a;
  color: white;
  width: 100%;
  max-width: 340px;
}

@media (max-width: 767px) {
  .congrats__title {
    font-size: 50px;
  }
}
</style>
