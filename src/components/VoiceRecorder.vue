<template>
  <div class="voice-wrapper">
    <button
        v-if="!isRecording && !isProcessing && !isRecorded"
        class="record-btn"
        @click="startRecording"
    >
      <img class="record__icon-recorder" :src="Recorder" alt="Recorder">
    </button>

    <div v-if="isRecording" class="recording-status">
      <button class="stop-btn" @click="stopRecording">
        ⏹
      </button>
      <div class="voice-indicator">
        <span class="record-dot"/>
        <span class="record-time">{{ formattedTime }}</span>
      </div>
    </div>

    <div v-if="isProcessing" class="transcript-preview">{{ t('examSession.recognizing') }}</div>

    <div v-if="transcript" class="transcript-preview">
      {{ transcript }}
    </div>

    <p v-if="errorText" class="voice-error">{{ errorText }}</p>

    <div v-if="!isRecording && !isProcessing && isRecorded" class="voice-actions">
      <button class="record-again-btn" @click="resetRecording">
        {{ t('examSession.recordAgain') }}
      </button>
      <button
          v-if="transcript"
          class="send-btn"
          :disabled="sending"
          @click="submitAnswer"
      >
        {{ sending ? t('examSession.check') : t('examSession.send') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onUnmounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {getFunctions, httpsCallable} from 'firebase/functions'
import Recorder from '../../assets/images/microphone.svg'

// Запись через MediaRecorder: работает в браузере и во WebView приложений Android/iOS (Capacitor),
// а распознавание делает облачная функция transcribeSpeech
const emit = defineEmits(['start', 'stop', 'submit'])
const props = defineProps({
  lang: {type: String, default: 'de-DE'}
})

const {t} = useI18n()
const MAX_SECONDS = 120
const MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg;codecs=opus']

const isRecording = ref(false)
const isProcessing = ref(false)
const isRecorded = ref(false)
const sending = ref(false)
const transcript = ref('')
const errorText = ref('')
const seconds = ref(0)

let mediaRecorder = null
let stream = null
let chunks = []
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(seconds.value / 60)
  return `${minutes}:${String(seconds.value % 60).padStart(2, '0')}`
})

const pickMimeType = () => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return ''
  return MIME_TYPES.find(type => MediaRecorder.isTypeSupported(type)) || ''
}

const releaseMicrophone = () => {
  clearInterval(timer)
  timer = null
  stream?.getTracks().forEach(track => track.stop())
  stream = null
}

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(String(reader.result).split('base64,')[1] || '')
  reader.onerror = reject
  reader.readAsDataURL(blob)
})

const transcribe = async (blob, mimeType) => {
  isProcessing.value = true
  try {
    const audioBase64 = await blobToBase64(blob)
    const transcribeSpeech = httpsCallable(getFunctions(undefined, 'us-central1'), 'transcribeSpeech')
    const result = await transcribeSpeech({audioBase64, mimeType, lang: props.lang})
    if (result.data?.error) throw new Error(result.data.error)
    transcript.value = result.data?.text || ''
    if (!transcript.value) errorText.value = t('examSession.notRecognized')
  } catch (error) {
    console.error('Transcription error:', error)
    errorText.value = t('examSession.notRecognized')
  } finally {
    isProcessing.value = false
    isRecorded.value = true
  }
}

const startRecording = async () => {
  errorText.value = ''
  transcript.value = ''
  isRecorded.value = false

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    errorText.value = t('examSession.micUnsupported')
    return
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({audio: true})
  } catch (error) {
    console.error('Microphone error:', error)
    errorText.value = t('examSession.micDenied')
    return
  }

  const mimeType = pickMimeType()
  mediaRecorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream)
  chunks = []

  mediaRecorder.ondataavailable = (event) => {
    if (event.data?.size) chunks.push(event.data)
  }
  mediaRecorder.onstop = () => {
    const recordedType = mediaRecorder.mimeType || mimeType || 'audio/webm'
    releaseMicrophone()
    isRecording.value = false
    emit('stop')
    transcribe(new Blob(chunks, {type: recordedType}), recordedType)
  }

  mediaRecorder.start()
  seconds.value = 0
  isRecording.value = true
  emit('start')
  timer = setInterval(() => {
    seconds.value++
    if (seconds.value >= MAX_SECONDS) stopRecording()
  }, 1000)
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
}

const resetRecording = () => {
  transcript.value = ''
  errorText.value = ''
  isRecorded.value = false
}

const submitAnswer = () => {
  const text = transcript.value.trim()
  if (sending.value || !text) return
  sending.value = true
  emit('submit', text)
  sending.value = false
}

onUnmounted(() => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.onstop = null
    mediaRecorder.stop()
  }
  releaseMicrophone()
})
</script>

<style scoped>
.voice-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.record__icon-recorder {
  width: 35px;
}

.transcript-preview {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  min-height: 40px;
  font-style: italic;
  color: #2c3e50;
  border: 1px solid #e9ecef;
}

.record-btn,
.stop-btn,
.send-btn {
  padding: 5px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease, transform 0.1s ease;
  font-weight: 800;
}
.record-btn {
  background-color: #3498db;
  color: #fff;
  border-radius: 30%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.record-btn:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}
.stop-btn {
  background-color: #e67e22;
  color: #fff;
  width: 48px;
  height: 48px;
}
.stop-btn:hover {
  background-color: #d35400;
  transform: translateY(-1px);
}
.send-btn {
  background-color: #2ecc71;
  color: #fff;
  padding: 10px 15px;
}
.send-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
.send-btn:hover:enabled {
  background-color: #27ae60;
  transform: translateY(-1px);
}
.recording-status {
  display: flex;
  align-items: center;
  gap: 12px;
}
.voice-indicator {
  display: flex;
  align-items: center;
}
.record-dot {
  width: 10px;
  height: 10px;
  background-color: #e74c3c;
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.record-time {
  font-weight: 800;
  color: var(--titleColor);
}

.voice-error {
  color: #e74c3c;
  font-weight: 700;
  margin: 0;
}

.voice-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.record-again-btn {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  background-color: #bdc3c7;
  color: #2c3e50;
}
</style>