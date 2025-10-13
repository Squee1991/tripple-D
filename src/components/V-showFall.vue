<script setup>
import {ref} from 'vue'
import Snow from '../assets/images/mery-christmas/Snow.svg'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

const snowflakes = ref(
    Array.from({length: 50}).map((_, i) => {
      const size = Math.round(rand(12, 28))
      const left = Math.round(rand(0, 100))
      const fall = rand(14, 28)
      const delay = -rand(0, fall)
      const drift = Math.round(rand(6, 18))
      const sway = rand(8, 16)
      const spin = Math.random() < 0.45 ? rand(6, 14) : 0
      const opac = rand(0.55, 0.95)
      const far = i % 3 === 0
      return {
        id: i + 1,
        size, left,
        fall: far ? fall * 1.3 : fall,
        delay,
        drift: far ? Math.round(drift * 1.2) : drift,
        sway,
        spin,
        opacity: far ? opac * 0.75 : opac,
        depth: far ? 'back' : 'front'
      }
    })
)
</script>

<template>
  <div class="svg-snow" aria-hidden="true">
    <ClientOnly>
      <div
          v-for="f in snowflakes"
          :key="f.id"
          class="flake-wrap"
          :class="'depth-' + f.depth"
          :style="{
        '--left': f.left + '%',
        '--fall': f.fall + 's',
        '--delay': f.delay + 's'
      }"
      >
        <img
            :src="Snow"
            class="flake"
            :class="{ 'spin': f.spin > 0 }"
            :style="{
          '--size': f.size + 'px',
          '--drift': f.drift + 'px',
          '--sway': f.sway + 's',
          '--spin': f.spin + 's',
          '--swayDelay': (f.delay * 0.7) + 's',
          opacity: f.opacity
        }"
            alt=""
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.svg-snow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.flake-wrap {
  position: fixed;
  top: -12vh;
  left: var(--left);
  will-change: transform;
  animation: fall var(--fall) linear infinite;
  animation-delay: var(--delay);
  transform: translate3d(0, -12vh, 0);
}

.flake {
  width: var(--size);
  height: var(--size);
  opacity: .95;
  will-change: transform;
  animation: sway var(--sway) linear infinite;
  animation-delay: var(--swayDelay);
}

.flake.spin {
  animation: sway var(--sway) linear infinite,
  spin var(--spin) linear infinite;
  animation-delay: var(--swayDelay), 0s;
}

.depth-back {
  opacity: .7
}

.depth-front {
  opacity: 1
}

@keyframes fall {
  from {
    transform: translate3d(0, -12vh, 0);
  }
  to {
    transform: translate3d(0, 110vh, 0);
  }
}

@keyframes sway {
  0% {
    transform: translateX(0)
  }
  25% {
    transform: translateX(var(--drift))
  }
  50% {
    transform: translateX(calc(var(--drift) * -1))
  }
  75% {
    transform: translateX(var(--drift))
  }
  100% {
    transform: translateX(0)
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
}
</style>
