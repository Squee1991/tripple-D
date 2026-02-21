<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <transition name="pop">
        <div v-if="visible" class="modal-container">
          <button class="modal-close" @click="$emit('close')">×</button>
          <h3 class="modal-title">{{ t('speakingRooms.createRoom') }}</h3>

          <div class="form-group">
            <label class="form-label">{{ t('speakingRooms.topic') }}</label>
            <select v-model="topic" class="form-select">
              <option v-for="key in SPEAKING_TOPICS" :key="key" :value="key">
                {{ t(`speakingRooms.topics.${key}`) }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('speakingRooms.cefrLevel') }}</label>
            <div class="level-buttons">
              <button
                  v-for="level in levels"
                  :key="level"
                  class="level-btn"
                  :class="[`level--${level}`, { 'level-btn--active': cefrLevel === level }]"
                  @click="cefrLevel = level"
              >
                {{ level }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('speakingRooms.maxParticipants') }}</label>
            <select v-model.number="maxParticipants" class="form-select">
              <option v-for="n in participantOptions" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <button
              class="create-btn"
              :disabled="!topic || isCreating"
              @click="handleCreate"
          >
            {{ isCreating ? t('speakingRooms.creating') : t('speakingRooms.create') }}
          </button>

          <p v-if="error" class="form-error">{{ error }}</p>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSpeakingRoomStore } from '~/store/speakingRoomStore.js'
import { SPEAKING_TOPICS } from '~/utils/speakingTopics.js'

const { t } = useI18n()
const router = useRouter()
const store = useSpeakingRoomStore()

defineProps({
  visible: { type: Boolean, required: true }
})

const emit = defineEmits(['close'])

const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
const participantOptions = [2, 3, 4]

const topic = ref('general')
const cefrLevel = ref('A2')
const maxParticipants = ref(4)
const isCreating = ref(false)
const error = ref('')

async function handleCreate() {
  if (!topic.value || isCreating.value) return
  isCreating.value = true
  error.value = ''

  try {
    const res = await store.createRoom({
      topic: topic.value,
      cefrLevel: cefrLevel.value,
      visibility: 'public',
      maxParticipants: maxParticipants.value
    })
    emit('close')
    router.push(`/speaking-room/${res.roomId}`)
  } catch (err) {
    error.value = err?.data?.statusMessage || err?.message || 'Failed to create room'
  } finally {
    isCreating.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  font-family: "Nunito", sans-serif;
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 24px;
  border: 4px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  max-width: 460px;
  width: 90%;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e1e1e;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: transform 0.2s ease;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e1e1e;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-label {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  color: #1e1e1e;
}

.form-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  box-sizing: border-box;
}

.form-select {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  background: white;
  box-sizing: border-box;
}

.level-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.level-btn {
  padding: 0.4rem 1rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  background: #f0f0f0;
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

.level-btn--active.level--A1 { background: #4caf50; color: #fff; }
.level-btn--active.level--A2 { background: #8bc34a; color: #fff; }
.level-btn--active.level--B1 { background: #ff9800; color: #fff; }
.level-btn--active.level--B2 { background: #f44336; color: #fff; }
.level-btn--active.level--C1 { background: #9c27b0; color: #fff; }

.create-btn {
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
  margin-top: 0.5rem;
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-error {
  color: #d32f2f;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.8rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active, .pop-leave-active { transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.pop-enter-from, .pop-leave-to { transform: scale(0.9); }

@media (min-width: 1024px) {
  .modal-close:hover { transform: scale(1.1) rotate(90deg); }
  .create-btn:not(:disabled):hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}
</style>
