<template>
  <div class="participants-panel">
    <h3 class="participants-panel__title">
      {{ t('speakingRooms.participants') }} ({{ participantList.length }})
    </h3>
    <ul class="participants-panel__list">
      <li
          v-for="p in participantList"
          :key="p.uid"
          class="participants-panel__item"
      >
        <img
            class="participants-panel__avatar"
            :src="`/images/avatars/${p.avatar || '1.png'}`"
            alt=""
        />
        <span class="participants-panel__name">{{ p.name }}</span>
        <span v-if="p.role === 'host'" class="participants-panel__badge">Host</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  participants: { type: Object, default: () => ({}) }
})

const participantList = computed(() => {
  return Object.entries(props.participants).map(([uid, data]) => ({
    uid,
    ...data
  }))
})
</script>

<style scoped>
.participants-panel {
  font-family: "Nunito", sans-serif;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 1rem;
}

.participants-panel__title {
  font-size: 1rem;
  font-weight: 800;
  color: #1e1e1e;
  margin-bottom: 0.8rem;
}

.participants-panel__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.participants-panel__item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.participants-panel__item:last-child {
  border-bottom: none;
}

.participants-panel__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #1e1e1e;
}

.participants-panel__name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e1e1e;
}

.participants-panel__badge {
  margin-left: auto;
  background: #f1c40f;
  color: #1e1e1e;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
}
</style>
