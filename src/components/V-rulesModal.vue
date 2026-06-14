<template>
  <transition name="modal-slide">
    <div v-if="show" class="modal modal--tip">
      <div class="modal__overlay" @click="$emit('close')"></div>
      <div class="modal__window modal__window--bottom">
        <div class="modal__title">💡</div>
        <div class="modal__text quest__tip-text">
          <template v-if="showResult">
            {{ t(currentTip) }}
          </template>
          <template v-else>
            {{ t('rulesModal.text')}}
          </template>
        </div>
        <div class="modal__actions">
          <button class="btn btn--primary" @click="$emit('close')">
            {{ t('modalLocations.btnAccept') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>

const {t} = useI18n()

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  showResult: {
    type: Boolean,
    default: false
  },
  currentTip: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])

</script>

<style scoped>

.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  backdrop-filter: blur(2px);
}

.modal__window {
  position: relative;
  width: min(440px, 92%);
  background: var(--menuItemsBg);
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 18px;
  padding: 20px 10px;
  text-align: center;
  z-index: 1;
}

.modal__title {
  font-weight: 900;
  font-size: 28px;
  margin-bottom: 8px;
}

.quest__tip-text {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  padding: 15px 5px;
  color: var(--title);
}

.modal__actions {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.btn {

  padding: 12px 26px;
  border-radius: 36px;
  font-weight: 900;
  font-size: 22px;
  cursor: pointer;
}

.btn--primary {
  background: #3b82f6;
  box-shadow: 0 5px 0 #1d4ed8;
  border: none;
  color: #fff;
  width: 100%;
}

.modal-slide-enter-active, .modal-slide-leave-active {
  transition: opacity 0.3s ease;
}

.modal-slide-enter-from, .modal-slide-leave-to {
  opacity: 0;
}

.modal-slide-enter-active .modal__window--bottom {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-slide-leave-active .modal__window--bottom {
  animation: slideDown 0.3s ease-in forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@media (max-width: 767px) {
  .modal--tip {
    align-items: flex-end;
    padding: 0;
  }

  .modal__window--bottom {
    border-radius: 35px;
  }

  .modal--tip .modal__title {
    display: flex;
    justify-content: center;
    font-size: 42px;
  }

  .modal--tip .quest__tip-text {
    font-size: 17px;
    line-height: 1.6;
    text-align: center;
  }
}
</style>