<template>
  <button class="playbtn" :disabled="disabled" @click="toggle" :title="isPlaying ? pauseLabel : label">
    <span class="playbtn__icon">{{ isPlaying ? '⏸' : '▶' }}</span>
    <span class="playbtn__label">{{ isPlaying ? pauseLabel : label }}</span>
  </button>
</template>

<script setup>
import {ref, onUnmounted, watch} from 'vue'

const props = defineProps({
  src: {type: String, required: true},
  label: {type: String, default: 'Воспроизвести'},
  pauseLabel: {type: String, default: 'Пауза'},
  preload: {type: String, default: 'none'},
  volume: {type: Number, default: 1},
})

const isPlaying = ref(false)
const disabled = ref(false)
const audio = new Audio()

audio.preload = props.preload
audio.src = props.src
audio.volume = props.volume

audio.onended = () => { isPlaying.value = false }
audio.onplay  = () => { isPlaying.value = true }
audio.onpause = () => { isPlaying.value = false }
audio.addEventListener('error', () => {
  isPlaying.value = false;
  disabled.value = true
})

watch(() => props.src, (v) => {
  audio.src = v;
  isPlaying.value = false
})

function toggle() {
  if (disabled.value) return
  if (audio.paused) audio.play().catch(() => {
    disabled.value = true
  })
  else audio.pause()
}

onUnmounted(() => {
  audio.pause()
  audio.src = ''
})
</script>

<style scoped>
.playbtn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  border: 2px solid #000;
  border-radius: 12px;
  background: #ffd54f;
  padding: .5rem 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0 #000;
  transition: transform .08s ease;
}

.playbtn:disabled {
  opacity: .6;
  cursor: not-allowed
}

.playbtn__icon {
  font-size: 1rem;
  line-height: 1
}

.playbtn__label {
  font-size: 1rem
}
</style>
