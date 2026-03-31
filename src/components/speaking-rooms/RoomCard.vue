<template>
  <div class="room-card" @click="$emit('join', room.id)">
    <div class="room-card__header">
      <span class="room-card__level" :class="`level--${room.cefrLevel}`">{{ room.cefrLevel }}</span>
      <span class="room-card__status" :class="`status--${room.status}`">
        {{ room.status === 'waiting' ? t('speakingRooms.waiting') : t('speakingRooms.active') }}
      </span>
    </div>
    <h3 class="room-card__topic">{{ t(`speakingRooms.topics.${room.topic}`, room.topic) }}</h3>
    <div class="room-card__footer">
      <div class="room-card__members">
        <div class="room-card__avatars">
          <img
            v-for="p in participantList"
            :key="p.uid"
            class="room-card__avatar"
            :src="`/images/avatars/${p.avatar || '1.png'}`"
            :title="p.name"
            alt=""
          />
        </div>
        <span class="room-card__names">{{ displayName }}</span>
      </div>
      <span class="room-card__count">{{ room.participantCount || 1 }}/{{ room.maxParticipants }}</span>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  room: { type: Object, required: true }
})

defineEmits(['join'])

const participantList = computed(() => {
  const p = props.room.participants
  if (p && typeof p === 'object') {
    const entries = Object.entries(p)
    if (entries.length > 0) {
      return entries.map(([uid, data]) => ({
        uid,
        name: data?.name || props.room.hostName || '',
        avatar: data?.avatar || '1.png',
        role: data?.role || 'participant'
      }))
    }
  }
  return [{
    uid: props.room.hostId || 'host',
    name: props.room.hostName || '',
    avatar: props.room.hostAvatar || '1.png',
    role: 'host'
  }]
})

const displayName = computed(() => {
  const names = participantList.value.map(p => p.name).filter(Boolean)
  if (names.length > 0) return names.join(', ')
  return props.room.hostName || ''
})
</script>

<style scoped>
.room-card {
  font-family: "Nunito", sans-serif;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 1.2rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.room-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.room-card__level {
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  color: #fff;
}

.level--A1 { background: #4caf50; }
.level--A2 { background: #8bc34a; }
.level--B1 { background: #ff9800; }
.level--B2 { background: #f44336; }
.level--C1 { background: #9c27b0; }

.room-card__status {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.status--waiting {
  background: #fff3cd;
  color: #856404;
}

.status--active {
  background: #d4edda;
  color: #155724;
}

.room-card__topic {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e1e1e;
  margin-bottom: 1rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.room-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-card__members {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  min-width: 0;
}

.room-card__avatars {
  display: flex;
  flex-shrink: 0;
}

.room-card__avatars .room-card__avatar:not(:first-child) {
  margin-left: -8px;
}

.room-card__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #1e1e1e;
  position: relative;
  z-index: 1;
  background: #fff;
}

.room-card__avatars .room-card__avatar:first-child {
  z-index: 5;
}

.room-card__avatars .room-card__avatar:nth-child(2) {
  z-index: 4;
}

.room-card__avatars .room-card__avatar:nth-child(3) {
  z-index: 3;
}

.room-card__avatars .room-card__avatar:nth-child(4) {
  z-index: 2;
}

.room-card__names {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.room-card__count {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e1e1e;
  background: #f0f0f0;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
}

@media (min-width: 1024px) {
  .room-card:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}
</style>
