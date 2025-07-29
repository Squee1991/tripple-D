<template>
    <button :title="t('hoverTitle.sound')" @click="speak(text)" :disabled="isSpeaking" class="speak-btn">
        <img :src="icon" alt="Произнести" class="speak-btn__icon"/>
    </button>
</template>

<script setup>
    import {ref , defineProps} from 'vue'
    import {getSpeechAudio} from '../../utils/googleTTS.js'
    import DefaultSoundIcon from '../../assets/images/sound.svg'
    const { t } = useI18n()
    const isSpeaking = ref(false)

    const props = defineProps({
        text: {
            type: String, required: true
        },
        icon: {
            type: String, default: DefaultSoundIcon
        }
    })

    function speak(htmlText) {
        if (isSpeaking.value) return

        const plainText = htmlText
            .replace(/<[^>]*>/g, ' ')
            .replace(/→/g, ', ')
            .trim()

        isSpeaking.value = true
        getSpeechAudio(plainText)
        setTimeout(() => {
            isSpeaking.value = false
        }, 2000)
    }
</script>

<style scoped>
    .speak-btn {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .speak-btn__icon {
        width: 22px;
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
