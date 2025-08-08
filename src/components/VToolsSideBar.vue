<template>
  <div class="tool-sidebar">
    <button class="tool-icon" @click="toggleTranslator">
      <img class="translate__icon" src="../../assets/images/TranslateIcon.svg" alt="Translate" />
    </button>

    <transition name="fade">
      <Translator @close="showTranslator = false" v-if="showTranslator" class="translator-float" />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Translator from './V-trasnlator.vue'

const showTranslator = ref(false)

function toggleTranslator() {
  showTranslator.value = !showTranslator.value
}

</script>

<style scoped>
.tool-sidebar {
  position: fixed;
  bottom: 200px;
  right: 10px;
  width: 60px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.tool-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.translate__icon {
  width: 60px;
}

.translator-float {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
