<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="handleCancel">
      <div class="modal-content">
        <div v-if="icon" class="modal-icon">
          <img :src="icon" class="modal-icon-item" alt=""/>
        </div>
        <p class="modal-text" :class="textClass">{{ t('exitSessionModal.text') }}</p>
        <slot></slot>
        <div class="modal-actions">
          <button class="modal-btn modal-btn-cancel" @click="handleCancel">
            {{ t('exitSessionModal.continueLesson') }}
          </button>
          <button class="modal-btn modal-btn-confirm" @click="handleConfirm">
            {{ t('exitSessionModal.cancelLesson') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {useRouter} from 'vue-router'
import LeaveLesson from '../../assets/images/LeaveLesson.svg'

const {t} = useI18n()
const props = defineProps({
  show: {type: Boolean, required: true},
  textClass: {type: String, default: ''},
  icon: {type: String, default: LeaveLesson},
  returnRoute: {type: String, default: null}
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])
const router = useRouter()

const handleConfirm = () => {
  emit('confirm')
  if (props.returnRoute) {
    router.push(props.returnRoute)
  }
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
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
  z-index: 1000;
  padding: 0;
}

.modal-content {
  background: var(--bgModal);
  padding: 40px 24px 30px 24px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 700px;
  text-align: center;
  border: none;
  box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 3px solid whitesmoke;
}

.modal-icon-item {
  width: 140px;
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

.modal-text {
  padding: 24px 10px 15px 10px;
  font-weight: 800;
  font-size: 16px;
  color: var(--title);
  margin-bottom: 10px;
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

.modal-btn-cancel {
  background: #2b6be2;
  color: white;
  box-shadow: 0 5px 0 #2959b0;
}

.modal-btn-confirm {
  background: none;
  color: #645e5e;
  font-weight: 600;
  box-shadow: none;
}
</style>