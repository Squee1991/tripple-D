<template>
  <button @click="path" class="exit-sign">
    <img class="close__icon" :src="CloseIcon" alt="">
    <span class="exit__text">{{ t('trainerPage.exit') }} </span>
  </button>
</template>

<script setup>
import CloseIcon from '../../assets/images/CloseIcon.svg'
import { defineEmits } from "vue";

const emit = defineEmits(['close'])
const { t } = useI18n();
const path = () => {
  emit('close')
}

</script>

<style scoped>

.exit-sign {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  position: absolute;
  top: 10px;
  left:12px;
  z-index: 20;
  background-color: #2E7D32;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Nunito', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 8px 20px;
  border: 4px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 15px rgba(46, 204, 113, 0.6), 0 0 25px rgba(46, 204, 113, 0.5);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.close__icon {
  width: 18px;
  margin-right: 10px;
}

@media  (max-width: 767px) {
  .exit-sign {
    box-shadow: none;
    border: none;
    background: none;

  }
  .exit__text {
    display: none;
  }
}

</style>