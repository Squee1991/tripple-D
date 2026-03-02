<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <transition name="pop">
        <div v-if="visible" class="modal-container">
          <button class="modal-close" @click="closeModal">×</button>
          <div class="modal-content">
            <h3 class="modal-title">{{ title }}</h3>
            <img class="modal__icon" :src="img" alt="">
            <p class="modal-text"> {{ text }}</p>
            <p class="modal-text"> {{ description }}</p>
            <button class="modal__btn" v-if="button" @click="$emit('button')">
              {{ button.label }}
            </button>
          </div>

        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  img: {
    type: String
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
.modal__icon {
  width: 150px;
}

.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

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

.modal__btn {
  margin-top: .5rem;
  padding: .75rem;
  font-weight: 800;
  border-radius: 14px;
  font-size: 19px;
  border: 3px solid #1e1e1e;
  background: #f1c40f;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  width: 90%;
}

.modal-container {
  font-family: "Nunito", sans-serif;
  position: relative;
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  border: 4px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  max-width: 420px;
  width: 90%;
  text-align: center;
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
  font-size: 1.6rem;
  color: #1e1e1e;
  font-weight: bold;
  margin-bottom: 1rem;
}

.modal__icon {
  width: 130px;
  margin-bottom: 10px;
}

.modal-text {
  font-family: "Nunito", sans-serif;
  font-size: 1.1rem;
  color: #555;
  line-height: 1.3;
  margin-bottom: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-enter-active, .pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.pop-enter-from, .pop-leave-to {
  transform: scale(0.9);
}

@media (min-width: 1024px) {
  .modal-close:hover {
    transform: scale(1.1) rotate(90deg);
  }
  .modal__btn:hover {
    transform: translate(2px , 2px);
    box-shadow: 2px 2px 0 black;
  }
}

</style>