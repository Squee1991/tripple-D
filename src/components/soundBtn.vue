<template>
  <button
      @click="handleSpeak"
      :disabled="isSpeaking"
      class="speak-btn"
      type="button"
  >
    <img :src="icon" alt="pronounce" class="speak-btn__icon"/>
  </button>
</template>

<script setup>
import { ref, defineProps, onBeforeUnmount } from 'vue'
import { getSpeechAudio, stopSpeech } from '../utils/googleTTS.js'
import DefaultSoundIcon from '../../assets/images/SoundIcon.svg'

const isSpeaking = ref(false)

const props = defineProps({
  content: { type: [String, Array], required: true },
  lang: { type: String, default: 'de-DE' },
  icon: { type: String, default: DefaultSoundIcon }
})

const cleanText = (htmlText) => {
  if (!htmlText) return ''
  return htmlText
      .replace(/<[^>]*>/g, ' ')
      .replace(/→/g, ', ')
      .trim()
}

async function handleSpeak() {
  if (isSpeaking.value) return
  isSpeaking.value = true

  try {
    if (Array.isArray(props.content)) {
      for (const line of props.content) {
        await getSpeechAudio(cleanText(line.text), props.lang, line.gender || 'FEMALE')
      }
    } else {
      await getSpeechAudio(cleanText(props.content), props.lang)
    }
  } catch (err) {
    console.error("Playback error:", err)
  } finally {
    isSpeaking.value = false
  }
}

onBeforeUnmount(() => {
  stopSpeech()
})

</script>

<style scoped>
.speak-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.speak-btn__icon {
  width: 40px;
  height: 40px;
  transition: transform 0.2s;
}

.speak-btn:hover:not(:disabled) .speak-btn__icon {
  transform: scale(1.1);
}

.speak-btn:disabled .speak-btn__icon {
  filter: grayscale(1);
  opacity: 0.6;
  cursor: not-allowed;
}
</style>