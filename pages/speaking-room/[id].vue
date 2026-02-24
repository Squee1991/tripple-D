<template>
  <div class="room-page">
    <!-- Error / Closed state -->
    <div v-if="roomClosed" class="room-page__closed">
      <div class="room-page__closed-card">
        <h2>{{ t('speakingRooms.roomClosed') }}</h2>
        <p>{{ t('speakingRooms.roomClosedText') }}</p>
        <button class="room-page__back-btn" @click="goToLobby">
          {{ t('speakingRooms.backToRooms') }}
        </button>
      </div>
    </div>

    <!-- Pre-join screen -->
    <PrejoinScreen
        v-else-if="!hasJoined"
        :room="store.currentRoom"
        :is-joining="isJoining"
        @join="handleJoin"
    />

    <!-- Active room -->
    <div v-else class="room-page__active">
      <!-- Top bar: topic + CEFR + participants -->
      <div class="room-page__header">
        <div class="room-page__topic-row">
          <span class="room-page__topic">
            {{ topicLabel }}
          </span>
          <span v-if="store.currentRoom?.cefrLevel" class="room-page__cefr">
            {{ store.currentRoom.cefrLevel }}
          </span>
        </div>
        <div class="room-page__participants">
          <div class="room-page__avatars">
            <img
                v-for="p in participantList"
                :key="p.uid"
                class="room-page__avatar"
                :src="`/images/avatars/${p.avatar || '1.png'}`"
                :title="p.name"
                alt=""
            />
          </div>
          <span class="room-page__participant-count">
            {{ participantList.length }} {{ t('speakingRooms.participants').toLowerCase() }}
          </span>
        </div>
      </div>

      <!-- Center: current question -->
      <div class="room-page__question">
        <p class="room-page__question-text">
          {{ store.currentQuestion?.text || t('speakingRooms.noQuestions') }}
        </p>
        <span v-if="store.questions.length" class="room-page__question-counter">
          ({{ store.currentQuestionIndex + 1 }}/{{ store.questions.length }})
        </span>
        <button
            v-if="store.isHost && store.questions.length === 0"
            class="room-page__reload-btn"
            @click="handleReloadQuestions"
        >
          {{ t('speakingRooms.loadQuestions') }}
        </button>
      </div>

      <!-- Bottom controls -->
      <div class="room-page__controls">
        <DeviceControls
            :audio-enabled="store.localAudioEnabled"
            :is-host="store.isHost"
            :has-next-question="hasNextQuestion"
            :is-advancing-question="store.isAdvancingQuestion"
            @toggle-audio="store.toggleAudio()"
            @next-question="store.nextQuestion()"
            @close-room="handleClose"
            @leave="handleLeave"
        />
      </div>

      <!-- Hidden audio for remote participants -->
      <div class="room-page__audio-hidden">
        <template v-for="(p, id) in remoteParticipants" :key="id">
          <audio :ref="el => setAudioRef(id, el)" autoplay />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpeakingRoomStore } from '~/store/speakingRoomStore.js'
import { userAuthStore } from '~/store/authStore.js'
import PrejoinScreen from '~/src/components/speaking-rooms/PrejoinScreen.vue'
import DeviceControls from '~/src/components/speaking-rooms/DeviceControls.vue'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useSpeakingRoomStore()
const authStore = userAuthStore()

const hasJoined = ref(false)
const isJoining = ref(false)
const audioRefs = {}

const roomClosed = computed(() => {
  return store.currentRoom?.status === 'closed' || (store.callState === 'left' && hasJoined.value)
})

const topicLabel = computed(() => {
  const topic = store.currentRoom?.topic
  if (!topic) return ''
  const key = `speakingRooms.topics.${topic}`
  const translated = t(key)
  return translated !== key ? translated : topic
})

const participantList = computed(() => {
  const parts = store.currentRoom?.participants || {}
  return Object.entries(parts).map(([uid, data]) => ({ uid, ...data }))
})

const hasNextQuestion = computed(() => {
  return store.currentQuestionIndex + 1 < store.questions.length
})

const remoteParticipants = computed(() => {
  const all = store.dailyParticipants
  const result = {}
  for (const [id, p] of Object.entries(all)) {
    if (!p.local) result[id] = p
  }
  return result
})

function setAudioRef(id, el) {
  if (el) {
    audioRefs[id] = el
  } else {
    delete audioRefs[id]
  }
}

function attachAudioForParticipant(id, participant) {
  const el = audioRefs[id]
  if (!el || !participant) return
  const aud = participant.tracks?.audio
  if (aud?.state === 'playable' && aud.persistentTrack) {
    const stream = new MediaStream([aud.persistentTrack])
    el.srcObject = stream
  }
}

watch(remoteParticipants, async (participants) => {
  await nextTick()
  for (const [id, p] of Object.entries(participants)) {
    attachAudioForParticipant(id, p)
  }
}, { deep: true })

function goToLobby() {
  router.push('/speaking-rooms')
}

async function handleJoin(settings) {
  isJoining.value = true
  try {
    await store.joinRoom(route.params.id)
    hasJoined.value = true

    if (!settings.audioEnabled) {
      await store.toggleAudio()
    }
  } catch (err) {
    console.error('Failed to join room:', err)
  } finally {
    isJoining.value = false
  }
}

async function handleLeave() {
  await store.leaveRoom()
  goToLobby()
}

async function handleClose() {
  await store.closeRoom()
  goToLobby()
}

async function handleReloadQuestions() {
  await store.reloadQuestions()
}

watch(() => store.currentRoom?.status, (status) => {
  if (status === 'closed' && hasJoined.value) {
    store.leaveRoom()
  }
})

onMounted(() => {
  if (!authStore.uid) {
    router.push('/')
    return
  }
  store.listenToRoom(route.params.id)
})

onBeforeUnmount(() => {
  if (hasJoined.value) {
    store.leaveRoom()
  }
})
</script>

<style scoped>
.room-page {
  font-family: "Nunito", sans-serif;
  min-height: 100vh;
  background: #f5f5f5;
}

/* Closed state */
.room-page__closed {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
}

.room-page__closed-card {
  background: #fff;
  border: 4px solid #1e1e1e;
  border-radius: 24px;
  box-shadow: 6px 6px 0 #1e1e1e;
  padding: 2.5rem;
  text-align: center;
  max-width: 420px;
}

.room-page__closed-card h2 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
}

.room-page__closed-card p {
  color: #555;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.room-page__back-btn {
  padding: 0.7rem 1.5rem;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  background: #f1c40f;
  color: #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

/* Active room layout */
.room-page__active {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Top bar */
.room-page__header {
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 3px solid #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.room-page__topic-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.room-page__topic {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e1e1e;
}

.room-page__cefr {
  background: #f1c40f;
  color: #1e1e1e;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  border: 2px solid #1e1e1e;
}

.room-page__participants {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.room-page__avatars {
  display: flex;
}

.room-page__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #1e1e1e;
  margin-left: -8px;
}

.room-page__avatar:first-child {
  margin-left: 0;
}

.room-page__participant-count {
  font-size: 0.85rem;
  font-weight: 700;
  color: #666;
}

/* Center question */
.room-page__question {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
}

.room-page__question-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e1e1e;
  line-height: 1.5;
  max-width: 640px;
}

.room-page__question-counter {
  margin-top: 0.8rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #888;
}

.room-page__reload-btn {
  margin-top: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  background: #2ecc71;
  color: #fff;
  box-shadow: 3px 3px 0 #1e1e1e;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

/* Bottom controls */
.room-page__controls {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #1a1a2e;
  flex-shrink: 0;
}

/* Hidden audio elements */
.room-page__audio-hidden {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

@media (max-width: 600px) {
  .room-page__header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.8rem 1rem;
    gap: 0.5rem;
  }

  .room-page__question-text {
    font-size: 1.2rem;
  }

  .room-page__controls {
    padding: 0.6rem;
  }
}

@media (min-width: 1024px) {
  .room-page__back-btn:hover,
  .room-page__reload-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}
</style>
