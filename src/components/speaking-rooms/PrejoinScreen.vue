<template>
  <div class="prejoin">
    <div class="prejoin__card">
      <h2 class="prejoin__title">{{ t('speakingRooms.prejoinTitle') }}</h2>
      <p class="prejoin__topic" v-if="room">{{ t(`speakingRooms.topics.${room.topic}`, room.topic) }}</p>

      <div class="prejoin__preview">
        <div class="prejoin__avatar">
          <span class="prejoin__avatar-icon">&#127908;</span>
          <span class="prejoin__avatar-label">{{ t('speakingRooms.audioOnly') }}</span>
        </div>
      </div>

      <div class="prejoin__devices">
        <div class="prejoin__device-row">
          <label class="prejoin__label">{{ t('speakingRooms.microphone') }}</label>
          <select v-model="selectedMic" class="prejoin__select">
            <option v-for="d in microphones" :key="d.deviceId" :value="d.deviceId">
              {{ d.label || 'Microphone' }}
            </option>
          </select>
        </div>
      </div>

      <div class="prejoin__toggles">
        <button class="prejoin__toggle" :class="{ 'toggle--off': !audioEnabled }" @click="audioEnabled = !audioEnabled">
          {{ audioEnabled ? t('speakingRooms.micOn') : t('speakingRooms.micOff') }}
        </button>
      </div>

      <button class="prejoin__join-btn" :disabled="isJoining" @click="handleJoin">
        {{ isJoining ? t('speakingRooms.joining') : t('speakingRooms.joinCall') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { t } = useI18n()

const props = defineProps({
  room: { type: Object, default: null },
  isJoining: { type: Boolean, default: false }
})

const emit = defineEmits(['join'])

const localStream = ref(null)
const microphones = ref([])
const selectedMic = ref('')
const audioEnabled = ref(true)

async function loadDevices() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    localStream.value = stream
    const devices = await navigator.mediaDevices.enumerateDevices()
    microphones.value = devices.filter(d => d.kind === 'audioinput')
    if (microphones.value.length) selectedMic.value = microphones.value[0].deviceId
  } catch (err) {
    console.error('Failed to get devices:', err)
  }
}

function stopStream() {
  if (localStream.value) {
    localStream.value.getTracks().forEach(t => t.stop())
    localStream.value = null
  }
}

function handleJoin() {
  stopStream()
  emit('join', {
    audioEnabled: audioEnabled.value,
    micDeviceId: selectedMic.value
  })
}

onMounted(() => {
  loadDevices()
})

onBeforeUnmount(() => {
  stopStream()
})
</script>

<style scoped>
.prejoin {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
}

.prejoin__card {
  font-family: "Nunito", sans-serif;
  background: #fff;
  border: 4px solid #1e1e1e;
  border-radius: 24px;
  box-shadow: 6px 6px 0 #1e1e1e;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}

.prejoin__title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e1e1e;
  text-align: center;
  margin-bottom: 0.5rem;
}

.prejoin__topic {
  text-align: center;
  color: #555;
  font-weight: 600;
  margin-bottom: 1.2rem;
}

.prejoin__preview {
  width: 100%;
  aspect-ratio: 16/9;
  background: #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prejoin__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.prejoin__avatar-icon {
  font-size: 3rem;
}

.prejoin__avatar-label {
  color: #888;
  font-weight: 600;
  font-size: 0.95rem;
}

.prejoin__devices {
  margin-bottom: 1rem;
}

.prejoin__device-row {
  margin-bottom: 0.8rem;
}

.prejoin__label {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #1e1e1e;
}

.prejoin__select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  background: white;
  box-sizing: border-box;
}

.prejoin__toggles {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.prejoin__toggle {
  flex: 1;
  padding: 0.5rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  background: #d4edda;
  color: #155724;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

.toggle--off {
  background: #f8d7da;
  color: #721c24;
}

.prejoin__join-btn {
  width: 100%;
  padding: 0.85rem;
  font-weight: 800;
  font-size: 1.1rem;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  background: #f1c40f;
  color: #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

.prejoin__join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 1024px) {
  .prejoin__join-btn:not(:disabled):hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}
</style>
