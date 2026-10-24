<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="handleLater">
      <div class="modal-content">
        <div class="reminder__icon">🔔</div>
        <p class="reminder__title">{{ t('reminders.title') }}</p>
        <p class="reminder__text">{{ t('reminders.text') }}</p>
        <div class="reminder__times">
          <button
              v-for="option in timeOptions"
              :key="option.time"
              class="reminder__time"
              :class="{ 'reminder__time--active': selectedTime === option.time }"
              @click="selectedTime = option.time"
          >
            <span class="reminder__time-label">{{ option.label }}</span>
            <span class="reminder__time-value">{{ option.time }}</span>
          </button>
          <label
              class="reminder__time reminder__time--custom"
              :class="{ 'reminder__time--active': selectedTime === customTime }"
          >
            <span class="reminder__time-label">{{ t('reminders.custom') }}</span>
            <input
                v-model="customTime"
                type="time"
                class="reminder__time-input"
                @focus="selectedTime = customTime"
            />
          </label>
        </div>
        <div class="modal-actions">
          <button class="modal-btn modal-btn-confirm" @click="handleEnable">
            {{ t('reminders.enable') }}
          </button>
          <button class="modal-btn modal-btn-later" @click="handleLater">
            {{ t('reminders.later') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { REMINDER_TIMES } from '~/utils/reminders.js'

const { t } = useI18n()

defineProps({
  show: { type: Boolean, required: true }
})

const emit = defineEmits(['update:show', 'enable', 'later'])

const labelKeys = ['morning', 'afternoon', 'evening', 'night']
const timeOptions = computed(() =>
    REMINDER_TIMES.map((time, i) => ({ time, label: t(`reminders.${labelKeys[i]}`) }))
)
const selectedTime = ref('19:00')
const customTime = ref('20:00')

watch(customTime, (time) => {
  selectedTime.value = time
})

const handleEnable = () => {
  emit('enable', selectedTime.value || '19:00')
  emit('update:show', false)
}

const handleLater = () => {
  emit('later')
  emit('update:show', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 39, 46, 0.8);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999999;
}

.modal-content {
  background: var(--bgModal);
  padding: 32px 24px 30px 24px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 768px;
  text-align: center;
  box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 3px solid whitesmoke;
}

.reminder__icon {
  font-size: 64px;
  line-height: 1;
}

.reminder__title {
  padding: 16px 10px 6px;
  font-weight: 900;
  font-size: 20px;
  color: var(--title);
}

.reminder__text {
  font-weight: 600;
  font-size: 15px;
  color: var(--title);
  opacity: 0.8;
  margin-bottom: 20px;
}

.reminder__times {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 22px;
}

.reminder__time {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 8px;
  border-radius: 16px;
  border: 2px solid rgba(128, 128, 128, 0.35);
  background: none;
  color: var(--title);
  font-family: "Nunito", sans-serif;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.reminder__time--active {
  border-color: #2b6be2;
  background: rgba(43, 107, 226, 0.15);
}

.reminder__time--custom {
  grid-column: 1 / -1;
}

.reminder__time-input {
  border: none;
  background: none;
  color: var(--title);
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 15px;
  text-align: center;
  color-scheme: light dark;
}

.reminder__time-label {
  font-weight: 800;
  font-size: 15px;
}

.reminder__time-value {
  font-weight: 600;
  font-size: 13px;
  opacity: 0.75;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.2s ease-out;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(100%);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.modal-btn {
  width: 100%;
  padding: 14px;
  border-radius: 36px;
  border: none;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  text-transform: uppercase;
}

.modal-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent !important;
}

.modal-btn-confirm {
  background: #2b6be2;
  color: white;
  box-shadow: 0 5px 0 #2959b0;
}

.modal-btn-later {
  background: none;
  color: #645e5e;
  font-weight: 600;
  box-shadow: none;
}
</style>
