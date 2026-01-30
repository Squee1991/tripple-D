<template>
  <div class="voice-wrapper">
    <button
        v-if="!isRecording && !isRecorded && !isBusy"
        class="record-btn"
        :disabled="isRecording || isBusy"
        @click="startRecording"
    >
      <img class="record__icon-recorder" :src="Recorder" alt="Recorder">
<!--      🎙️ Aufnahme starten-->
    </button>
    <div v-if="isRecording" class="recording-status">
      <button class="stop-btn" :disabled="isBusy" @click="stopRecording">
        ⏹️
      </button>
      <div class="voice-indicator">
        <span class="record-dot"/>
      </div>
    </div>
    <div v-if="isBusy && !isRecording" class="processing-text">Отправка…</div>
    <button
        v-if="!isRecording && isRecorded && !isBusy"
        class="send-btn"
        :disabled="sending"
        @click="submitAnswer"
    >
      {{ sending ? 'Senden...' : 'Antwort senden' }}
    </button>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import  Recorder from '../../assets/images/microphone.svg'
const emit = defineEmits(['start', 'stop', 'audio', 'result', 'submit'])
const props = defineProps({
  languageCode: {type: String, default: 'de-DE'},
  sttEndpoint: {type: String, default: '/api/whisper'},
})

const isBusy = ref(false)
const isRecording = ref(false)
const isRecorded = ref(false)
const sending = ref(false)
const transcript = ref('')

let mediaRecorder = null
let chunks = []
let startedAt = 0

const startRecording = async () => {
  if (isRecording.value || isBusy.value) return
  isBusy.value = true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    chunks = []
    transcript.value = ''
    isRecorded.value = false
    let mimeType = 'audio/webm'
    if (typeof MediaRecorder.isTypeSupported === 'function') {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (!MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = ''
      }
    }

    mediaRecorder = new MediaRecorder(stream, mimeType ? {mimeType} : undefined)
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data)
    }
    mediaRecorder.onstop = async () => {
      try {
        const blob = new Blob(chunks, {type: mimeType || 'audio/webm'})
        const durationSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000))
        emit('audio', {blob, durationSec})
        const base64 = await toBase64(blob)
        const audioContent = stripDataUrlPrefix(base64)
        const res = await fetch(props.sttEndpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ audioContent, lang: 'de' }),
        })
        let text = ''
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          text = data?.text ? String(data.text) : (data?.transcription || '')
        } else {
          console.warn('STT request failed:', res.status, await res.text().catch(() => ''))
        }

        transcript.value = text
        isRecorded.value = true
        emit('result', transcript.value)
      } catch (err) {
        console.error('onstop handler error:', err)
        isRecorded.value = true
      } finally {
        isBusy.value = false
      }
    }

    mediaRecorder.start()
    startedAt = Date.now()
    isRecording.value = true
    emit('start')
  } catch (e) {
    console.error('getUserMedia error:', e)
  } finally {
    if (isRecording.value) isBusy.value = false
  }
}

const stopRecording = () => {
  if (isBusy.value) return
  try {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      isBusy.value = true
      mediaRecorder.stop()
      mediaRecorder.stream?.getTracks?.().forEach(t => t.stop())
      isRecording.value = false
      emit('stop')
    }
  } catch (e) {
    console.error('stopRecording error:', e)
    isRecording.value = false
    isBusy.value = false
  }
}

const submitAnswer = () => {
  if (sending.value) return
  sending.value = true
  try {
    const text = (transcript.value || '').trim()
    emit('submit', text.length > 0 ? text : 'Du hast nichts gesagt.')
    reset()
  } finally {
    sending.value = false
  }
}

const reset = () => {
  transcript.value = ''
  isRecorded.value = false
  isRecording.value = false
  chunks = []
  startedAt = 0
}

const toBase64 = (blob) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.readAsDataURL(blob)
})

const stripDataUrlPrefix = (dataUrl) => {
  if (typeof dataUrl !== 'string') return ''
  const idx = dataUrl.indexOf(',')
  return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl
}
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
  color: #c0392b;
  font-weight: bold;
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
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.processing-text {
  font-weight: 800;
  padding: 0.2rem 0;
}
</style>
