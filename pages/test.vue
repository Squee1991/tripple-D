<template>
    <div class="speaking-practice">
        <h1>🗣️ Произнеси вслух</h1>

        <div class="sentence">
            <p>{{ currentSentence }}</p>
        </div>

        <button @click="startListening" :disabled="isListening">
            🎤 Говорить
        </button>

        <div v-if="isListening" class="listening-indicator">
            🎧 Слушаю...
        </div>

        <p v-if="spokenText">
            Вы сказали: <strong>"{{ spokenText }}"</strong>
        </p>

        <p v-if="result !== null" :class="result ? 'correct' : 'wrong'">
            {{ result ? '✅ Отлично!' : '❌ Не совпадает' }}
        </p>

        <button @click="nextSentence">Следующее</button>

        <p class="score">Очки: {{ points }}</p>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'

    const sentences = [
        'Ich habe einen Hund.',
        'Das Wetter ist heute schön.',
        'Wie heißt du?',
        'Ich trinke gerne Kaffee.',
        'Wir gehen ins Kino.'
    ]

    const currentIndex = ref(0)
    const currentSentence = ref(sentences[currentIndex.value])
    const spokenText = ref('')
    const result = ref(null)
    const isListening = ref(false)
    const points = ref(0)

    let recognition

    function normalize(text) {
        return text
            .toLowerCase()
            .replace(/[.,!?]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
    }

    onMounted(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition()
            recognition.lang = 'de-DE'
            recognition.interimResults = false
            recognition.maxAlternatives = 1

            recognition.onstart = () => {
                isListening.value = true
            }

            recognition.onend = () => {
                isListening.value = false
            }

            recognition.onresult = (event) => {
                spokenText.value = event.results[0][0].transcript.trim()
                const expected = normalize(currentSentence.value)
                const spoken = normalize(spokenText.value)

                const similarity = getSimilarity(expected, spoken)

                if (similarity === 1) {
                    result.value = true
                    points.value++
                } else if (similarity >= 0.5) {
                    result.value = false
                } else {
                    result.value = null
                    spokenText.value = ''
                    alert('🙈 Пожалуйста, повторите фразу чётко')
                }
            }

            recognition.onerror = () => {
                isListening.value = false
                result.value = false
                spokenText.value = '(ошибка распознавания)'
            }
        } else {
            alert('Распознавание речи не поддерживается в этом браузере.')
        }
    })

    function startListening() {
        result.value = null
        spokenText.value = ''
        if (recognition) recognition.start()
    }

    function nextSentence() {
        currentIndex.value = (currentIndex.value + 1) % sentences.length
        currentSentence.value = sentences[currentIndex.value]
        result.value = null
        spokenText.value = ''
    }
</script>

<style scoped>
    .speaking-practice {
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
        background: #e8f5e9;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 0 12px rgba(0,0,0,0.1);
    }

    .sentence {
        font-size: 1.5rem;
        margin: 1rem 0;
        padding: 1rem;
        background: #ffffff;
        border-left: 5px solid #66bb6a;
        border-radius: 8px;
    }

    button {
        margin: 0.5rem;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border: none;
        border-radius: 8px;
        background: #43a047;
        color: white;
        cursor: pointer;
    }

    button:disabled {
        background: #aaa;
        cursor: not-allowed;
    }

    .correct {
        color: green;
        font-weight: bold;
        margin-top: 1rem;
    }

    .wrong {
        color: red;
        font-weight: bold;
        margin-top: 1rem;
    }

    .listening-indicator {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #fff176;
        border-radius: 12px;
        animation: pulse 1s infinite;
        font-weight: bold;
    }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 241, 118, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 241, 118, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 241, 118, 0); }
    }

    .score {
        margin-top: 1.5rem;
        font-size: 1.2rem;
    }
</style>
