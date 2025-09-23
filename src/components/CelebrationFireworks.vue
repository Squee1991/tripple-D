<template>
  <div class="fireWorks">
    <div class="fireWorks__container" ref="container"></div>
    <div class="congrats" role="status" aria-live="polite">
      <div class="congrats__inner">
        <transition name="fade-up" appear>
          <div class="congrats__title" style="transition-delay: .2s">Поздравляем!</div>
        </transition>
        <transition name="fade-up" appear>
          <div class="stats" style="transition-delay: .4s">

            <div class="stats__card">
              <div class="stats__label">Очки опыта</div>
              <div class="stats__value">{{ shownExp }}</div>
            </div>
            <div class="stats__card">
              <div class="stats__label">Артиклюсы</div>
              <div class="stats__value">{{ shownPoints }}</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade-up" appear>
      <div class="btn__back-wrapper" style="transition-delay:.8s">
        <button @click="backTo" class="btn" type="button" >Далее</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import Lottie from 'lottie-web'
import FireWorks from '../../assets/animation/SuccessAnimation.json'


const props = defineProps({
  startExp: {type: Number, required: true},
  targetExp: {type: Number, required: true},
  startPoints: {type: Number, required: true},
  targetPoints: {type: Number, required: true},
})

const router = useRouter()
const backTo = () => router.back()

const container = ref(null)
const shownExp = ref(props.startExp)
const shownPoints = ref(props.startPoints)

function animateInt(from, to, setter, duration = 900) {
  if (to <= from) {
    setter(to);
    return
  }
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

onMounted(() => {
  if (container.value) {
    const anim = Lottie.loadAnimation({
      container: container.value, loop: true, autoplay: true,
      animationData: FireWorks, renderer: 'svg'
    })
    anim.setSpeed(0.7)
  }
  shownExp.value = props.startExp
  shownPoints.value = props.startPoints
  setTimeout(() => {
    animateInt(props.startExp, props.targetExp, v => shownExp.value = v, 900)
    animateInt(props.startPoints, props.targetPoints, v => shownPoints.value = v, 900)
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
  width: 320px;
  max-width: 90vw;
  pointer-events: none;
}

.congrats__inner {
  flex-grow: 1;
  padding-top: 50px;
}

.congrats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 10px;
  min-height: 90vh;
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

.stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 36px;
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
  color: #f1dcb9;
  margin-bottom: 6px;
  padding: 8px 5px;
  text-align: center;
  background: rgba(0, 0, 0, 0.54);
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
  color:white;
  width: 100%;
  max-width: 340px;
}
</style>
