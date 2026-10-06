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
import { ref, onUnmounted } from 'vue'
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
const BUCKET = 'tripple-d-dev.firebasestorage.app'

const playAudio = () => {
  if (isPlaying.value) return

  const localPath = `audio/${props.level}/${props.topicId}/${props.fileName}.mp3`
  const encodedPath = encodeURIComponent(localPath)
  const audioUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedPath}?alt=media`
  console.log('Попытка воспроизвести из облака:', audioUrl)
  currentAudio = new Audio(audioUrl)
  isPlaying.value = true
  currentAudio.play().catch(e => {
    console.error('Ошибка воспроизведения:', e)
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
  width: 35px;
  height: 35px;
}
</style>