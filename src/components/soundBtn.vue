<template>
  <button
      :title="t('hoverTitle.sound')"
      @click="speak(text)"
      :disabled="isSpeaking"
      class="speak-btn"
  >
    <img :src="icon" alt="pronounce" class="speak-btn__icon"/>
  </button>
</template>

<script setup>
import { ref, defineProps, onBeforeUnmount } from 'vue'
import { getSpeechAudio, stopSpeech } from '../../utils/googleTTS.js'
import DefaultSoundIcon from '../../assets/images/SoundIcon.svg'

const { t } = useI18n()
const isSpeaking = ref(false)

const props = defineProps({
  text: { type: String, required: true },
  lang: { type: String, default: 'de-DE' },
  icon: { type: String, default: DefaultSoundIcon }
})

async function speak(htmlText) {
  if (!htmlText) return
  if (isSpeaking.value) return
  const plainText = htmlText
      .replace(/<[^>]*>/g, ' ')
      .replace(/→/g, ', ')
      .trim()

  isSpeaking.value = true
  await getSpeechAudio(plainText, props.lang)
  isSpeaking.value = false
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
}

.speak-btn__icon {
  width: 42px;
  height: 42px;
  transition: transform 0.2s;
}

.speak-btn:hover .speak-btn__icon {
  transform: scale(1.1);
}

.speak-btn:disabled .speak-btn__icon {
  filter: grayscale(1);
  cursor: not-allowed;
}
</style>
