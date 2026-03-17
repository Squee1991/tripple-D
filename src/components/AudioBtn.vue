<template>
  <button
      @click.stop="playAudio"
      :class="['custom-audio-btn', { 'is-playing': isPlaying }]"
      :disabled="isPlaying"
  >
    <img class="audio__btn" :src="DefaultSoundIcon" alt="DefaultSoundIcon">

  </button>
</template>

<script setup>
import { ref, onUnmounted, computed } from 'vue'
import DefaultSoundIcon from '../../assets/images/SoundIcon.svg'
import DefaultStopIcon from '../../assets/images/pause.svg'

const props = defineProps({
  level: {
    type: String,
    required: true
  },
  topicId: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  }
})

const isPlaying = ref(false)
let currentAudio = null

const computedIcon = computed(() => isPlaying.value ? DefaultStopIcon : DefaultSoundIcon )

const playAudio = () => {
  if (isPlaying.value) return
  const audioUrl = `/audio/${props.level}/${props.topicId}/${props.fileName}.mp3`
  console.log('Попытка воспроизвести:', audioUrl)
  currentAudio = new Audio(audioUrl)
  isPlaying.value = true

  currentAudio.play().catch(e => {
    console.error('Ошибка: Файл не найден по пути:', audioUrl)
    isPlaying.value = false
  })

  currentAudio.onended = () => {
    isPlaying.value = false
  }
}

onUnmounted(() => {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
})
</script>

<style scoped>
.custom-audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.custom-audio-btn.is-playing {
  opacity: 0.7;
}

.audio__btn {
  width: 44px;
  height: 44px;
}
</style>