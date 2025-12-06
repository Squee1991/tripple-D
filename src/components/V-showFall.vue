<script setup>
import { computed } from 'vue'

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 50
  }
})

function rand(min, max) {
  return Math.random() * (max - min) + min
}

const snowflakes = computed(() => {
  const items = Array.from({ length: props.count }).map((_, i) => {
    const sectionWidth = 100 / props.count
    const left = (i * sectionWidth) + rand(0, sectionWidth * 0.5)
    const size = Math.round(rand(18, 40))
    const fallDuration = rand(15, 25)
    const isEven = i % 2 === 0
    let delay
    if (isEven) {
      delay = -rand(0, fallDuration / 2)
    } else {
      delay = -rand(fallDuration / 2, fallDuration)
    }

    const drift = Math.round(rand(6, 18))
    const sway = rand(8, 16)
    const swayDelay = -rand(0, sway)

    const spin = Math.random() < 0.45 ? rand(6, 14) : 0
    const opac = rand(0.55, 0.95)
    const far = i % 3 === 0

    return {
      id: i + 1,
      size,
      left: left.toFixed(2),
      fall: far ? fallDuration * 1.3 : fallDuration,
      delay: delay.toFixed(2),
      drift: far ? Math.round(drift * 1.2) : drift,
      sway,
      swayDelay: swayDelay.toFixed(2),
      spin,
      opacity: far ? opac * 0.75 : opac,
      depth: far ? 'back' : 'front'
    }
  })

  return items.sort(() => Math.random() - 0.5)
})
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
              :src="props.image"
              class="flake"
              :class="{ 'spin': f.spin > 0 }"
              :style="{
                '--size': f.size + 'px',
                '--drift': f.drift + 'px',
                '--sway': f.sway + 's',
                '--spin': f.spin + 's',
                '--swayDelay': f.swayDelay + 's',
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
  overflow: hidden;
}

.flake-wrap {
  position: absolute;
  top: -15vh;
  left: var(--left);
  will-change: transform;
  animation: fall var(--fall) linear infinite;
  animation-delay: var(--delay);
}

.flake {
  display: block;
  width: var(--size);
  height: var(--size);
  /* Важно: contain, чтобы картинка не деформировалась */
  object-fit: contain;
  will-change: transform;
  /* alternate делает качание плавнее (туда-сюда) */
  animation: sway var(--sway) ease-in-out infinite alternate;
  animation-delay: var(--swayDelay);
}

.flake.spin {
  animation: sway var(--sway) ease-in-out infinite alternate,
  spin var(--spin) linear infinite;
  animation-delay: var(--swayDelay), 0s;
}

.depth-back {
  z-index: 1;
}

.depth-front {
  z-index: 2;
}

@keyframes fall {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, 115vh, 0); }
}

@keyframes sway {
  from { transform: translateX(calc(var(--drift) * -1)); }
  to { transform: translateX(var(--drift)); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>