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
import { ref } from 'vue'
import { VoiceRecorder } from 'capacitor-voice-recorder'
import { Capacitor } from '@capacitor/core'
import { Directory, Filesystem } from '@capacitor/filesystem'
import Recorder from '../../assets/images/microphone.svg'

const emit = defineEmits(['start', 'stop', 'audio', 'result', 'submit'])
const props = defineProps({
  languageCode: { type: String, default: 'de-DE' },
  sttEndpoint: { type: String, default: '/api/whisper' },
})

const isBusy = ref(false)
const isRecording = ref(false)
const isRecorded = ref(false)
const sending = ref(false)
const transcript = ref('')

let startedAt = 0

const startRecording = async () => {
  if (isRecording.value || isBusy.value) return
  isBusy.value = true
  try {
    const hasPermission = await VoiceRecorder.hasAudioRecordingPermission()
    if (!hasPermission.value) {
      const request = await VoiceRecorder.requestAudioRecordingPermission()
      if (!request.value) throw new Error('No permission')
    }

    transcript.value = ''
    isRecorded.value = false

    await VoiceRecorder.startRecording({ directory: Directory.Data })
    startedAt = Date.now()
    isRecording.value = true
    emit('start')
  } catch (e) {
    console.error('startRecording error:', e)
  } finally {
    if (isRecording.value) isBusy.value = false
  }
}

const stopRecording = async () => {
  if (isBusy.value) return
  isBusy.value = true
  try {
    const result = await VoiceRecorder.stopRecording()
    isRecording.value = false
    emit('stop')

    let finalBlob = null
    let base64Data = null
    const durationSec = result.value?.msDuration
        ? Math.round(result.value.msDuration / 1000)
        : Math.max(0, Math.round((Date.now() - startedAt) / 1000))

    if (result.value?.path) {
      const { uri } = await Filesystem.getUri({ directory: Directory.Data, path: result.value.path })
      const fileUrl = Capacitor.convertFileSrc(uri)
      const response = await fetch(fileUrl)
      finalBlob = await response.blob()
      const fullBase64 = await toBase64(finalBlob)
      base64Data = stripDataUrlPrefix(fullBase64)
    } else if (result.value?.recordDataBase64) {
      base64Data = result.value.recordDataBase64
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      finalBlob = new Blob([new Uint8Array(byteNumbers)], { type: 'audio/aac' })
    }

    if (finalBlob) {
      emit('audio', { blob: finalBlob, durationSec })
    }

    if (base64Data) {
      const res = await fetch(props.sttEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioContent: base64Data, lang: 'de' }),
      })
      let text = ''
      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        text = data?.text ? String(data.text) : (data?.transcription || '')
      } else {
        console.warn('STT request failed:', res.status)
      }

      transcript.value = text
      isRecorded.value = true
      emit('result', transcript.value)
    }
  } catch (e) {
    console.error('stopRecording error:', e)
    isRecorded.value = true
  } finally {
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
