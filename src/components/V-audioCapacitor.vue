<template>
  <span class="audio-auto-trigger" style="display: none;"></span>
</template>

<script setup>
import {watch} from 'vue';
import {TextToSpeech} from '@capacitor-community/text-to-speech';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  trigger:
      {type: [Number, Boolean],
        default: false
      }
});

const play = async () => {
  if (!props.text) return;

  try {
    if (window.Capacitor && window.Capacitor.isNative) {
      await TextToSpeech.speak({
        text: props.text,
        lang: 'de-DE',
        rate: 1.0,
        volume: 1.0,
      });
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(props.text);
        utterance.lang = 'de-DE';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  } catch (e) {
    console.error("AudioAuto error:", e);
  }
};

watch(() => props.trigger, () => {
  play();
});

onMounted(() => {
  play();
});
</script>