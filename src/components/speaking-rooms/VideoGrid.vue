<template>
  <div class="video-grid" :class="gridClass">
    <VideoTile
        v-for="p in sortedParticipants"
        :key="p.session_id"
        :participant="p"
        :is-local="p.local"
        :is-host="isParticipantHost(p)"
        :avatar="getAvatar(p)"
        :user-name="getName(p)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VideoTile from './VideoTile.vue'

const props = defineProps({
  dailyParticipants: { type: Object, default: () => ({}) },
  roomParticipants: { type: Object, default: () => ({}) },
  hostId: { type: String, default: '' }
})

const participantList = computed(() => {
  return Object.values(props.dailyParticipants || {})
})

const sortedParticipants = computed(() => {
  const list = [...participantList.value]
  list.sort((a, b) => {
    if (a.local) return -1
    if (b.local) return 1
    return 0
  })
  return list
})

const gridClass = computed(() => {
  const count = sortedParticipants.value.length
  if (count <= 1) return 'grid--1'
  if (count === 2) return 'grid--2'
  if (count <= 4) return 'grid--4'
  return 'grid--6'
})

function isParticipantHost(p) {
  return p.user_name === props.hostId || p.owner
}

function getAvatar(p) {
  const uid = findUidByName(p.user_name)
  if (uid && props.roomParticipants[uid]) {
    return props.roomParticipants[uid].avatar
  }
  return '1.png'
}

function getName(p) {
  const uid = findUidByName(p.user_name)
  if (uid && props.roomParticipants[uid]) {
    return props.roomParticipants[uid].name
  }
  return p.user_name || 'User'
}

function findUidByName(userName) {
  for (const [uid, data] of Object.entries(props.roomParticipants || {})) {
    if (data.name === userName || uid === userName) return uid
  }
  return null
}
</script>

<style scoped>
.video-grid {
  display: grid;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  padding: 0.75rem;
}

.grid--1 {
  grid-template-columns: 1fr;
}

.grid--2 {
  grid-template-columns: 1fr 1fr;
}

.grid--4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.grid--6 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

@media (max-width: 768px) {
  .grid--2 {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .grid--6 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }
}
</style>
