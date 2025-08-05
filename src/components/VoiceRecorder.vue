<template>
  <div class="voice-wrapper">
    <button
        v-if="!isRecording && !isRecorded"
        class="record-btn"
        @click="startRecording"
    >
      🎙️ Aufnahme starten
    </button>
    <div v-if="isRecording" class="recording-status">
      <button class="stop-btn" @click="stopRecording">⏹️ Aufnahme stoppen</button>
      <div class="voice-indicator">
        <span class="record-dot" /> Aufnahme läuft...
      </div>
    </div>
    <button
        v-if="!isRecording && isRecorded"
        class="send-btn"
        :disabled="false"
        @click="submitAnswer"
    >
      Antwort senden
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'result'])

const isRecording = ref(false)
const isRecorded = ref(false)
const transcript = ref('')

let mediaRecorder = null
let chunks = []

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder = new MediaRecorder(stream)
  chunks = []
  isRecording.value = true
  isRecorded.value = false
  transcript.value = ''

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' })
    const base64 = await toBase64(blob)

    const res = await fetch('/api/google-stt/recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioContent: base64,
        languageCode: 'de-DE'
      })
    })

    const data = await res.json()
    transcript.value = data.transcription || ''
    isRecorded.value = true
    emit('result', transcript.value)
  }

  mediaRecorder.start()
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

const submitAnswer = () => {
  const text = transcript.value.trim()
  emit('submit', text.length > 0 ? text : 'Du hast nichts gesagt.')
  reset()
}


const reset = () => {
  transcript.value = ''
  isRecorded.value = false
}

const toBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}
</script>

<style scoped>
.voice-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 1rem;
}

.record-btn,
.stop-btn,
.send-btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.record-btn {
  background-color: #3498db;
  color: white;
}
.record-btn:hover {
  background-color: #2980b9;
}

.stop-btn {
  background-color: #e67e22;
  color: white;
}
.stop-btn:hover {
  background-color: #d35400;
}

.send-btn {
  background-color: #2ecc71;
  color: white;
}
.send-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
.send-btn:hover:enabled {
  background-color: #27ae60;
}

.voice-indicator {
  display: flex;
  align-items: center;
  color: #c0392b;
  font-weight: bold;
  margin-top: 0.5rem;
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
</style>
