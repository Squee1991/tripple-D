<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <transition name="pop">
        <div v-if="visible" class="modal-card">
          <button class="close-btn" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-content">
            <h3 class="modal-title" v-if="title">{{ title }}</h3>

            <img v-if="img" class="modal-icon" :src="img" :alt="alt">

            <p class="modal-text" v-if="text">{{ text }}</p>
            <p class="modal-text" v-if="description">{{ description }}</p>

            <button class="btn-game btn-yellow" v-if="button" @click="$emit('button')">
              {{ button.label || button }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'

const emit = defineEmits(['close', 'button'])

const closeModal = () => {
  emit('close')
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  img: {
    type: String,
  },
  alt: {
    type: String,
  },
  title: {
    type: String,
  },
  text: {
    type: String
  },
  description: {
    type: [Array, Object, String]
  },
  button: {
    type: [Array, Object, String]
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-card {
  position: relative;
  background: var(--tabBg);
  border-radius: 28px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  text-align: center;
  font-family: "Nunito", sans-serif;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--settingsSectionBg);
  border: 3px solid var(--tabsSlideBorderColor);
  color: var(--titleColor);
  width: 36px;
  height: 36px;
  border-radius: 12px;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  z-index: 10;
}

.close-btn:active {
  transform: scale(0.9);
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}

.modal-title {
  font-size: 22px;
  font-weight: 900;
  color: var(--titleColor);
  margin: 0 0 16px 0;
  letter-spacing: 0.5px;
}

.modal-icon {
  width: 130px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.modal-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--titleColor);
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.btn-game {
  width: 100%;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.1s ease;
  margin-top: 12px;
}

.btn-yellow {
  background: #facc15;
  border: 3px solid #ca8a04;
  box-shadow: 0 6px 0 #a16207;
  color: #451a03;
}

.btn-yellow:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #a16207;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-leave-active {
  transition: transform 0.2s ease-in;
}

.pop-enter-from, .pop-leave-to {
  transform: scale(0.8);
}
</style>