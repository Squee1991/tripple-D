<template>
  <div class="video-tile" :class="{ 'video-tile--speaking': isSpeaking }">
    <audio
        v-if="!isLocal && audioTrack"
        ref="audioEl"
        autoplay
    />
    <div class="video-tile__avatar-wrapper">
      <img
          class="video-tile__avatar"
          :src="`/images/avatars/${avatar || '1.png'}`"
          alt=""
      />
    </div>
    <div class="video-tile__name-bar">
      <span class="video-tile__name">{{ userName }}</span>
      <span v-if="isHost" class="video-tile__host-badge">Host</span>
      <span v-if="!hasAudio" class="video-tile__muted">&#128263;</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  participant: { type: Object, required: true },
  isLocal: { type: Boolean, default: false },
  isHost: { type: Boolean, default: false },
  avatar: { type: String, default: '1.png' },
  userName: { type: String, default: '' }
})

const audioEl = ref(null)

const audioTrack = computed(() => {
  const tracks = props.participant?.tracks
  if (!tracks) return null
  const aud = tracks.audio
  return aud?.state === 'playable' ? aud.persistentTrack : null
})

const hasAudio = computed(() => {
  const tracks = props.participant?.tracks
  return tracks?.audio?.state === 'playable'
})

const isSpeaking = computed(() => {
  return false
})

function attachAudio() {
  if (audioEl.value && audioTrack.value && !props.isLocal) {
    const stream = new MediaStream([audioTrack.value])
    audioEl.value.srcObject = stream
  }
}

watch(audioTrack, attachAudio)
onMounted(() => {
  attachAudio()
})
</script>

<style scoped>
.video-tile {
  position: relative;
  background: #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16/9;
  border: 3px solid #333;
  transition: border-color 0.2s;
}

.video-tile--speaking {
  border-color: #4caf50;
}

.video-tile__avatar-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
}

.video-tile__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #555;
}

.video-tile__name-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.video-tile__name {
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: "Nunito", sans-serif;
}

.video-tile__host-badge {
  background: #f1c40f;
  color: #1e1e1e;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  font-family: "Nunito", sans-serif;
}

.video-tile__muted {
  font-size: 0.85rem;
  margin-left: auto;
}
</style>
