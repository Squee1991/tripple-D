<template>
  <div v-if="modelValue" class="tips__overlay" @click.self="close">
    <div class="tips__content">
      <button class="tips__close" @click="close">×</button>
      <h2 v-if="title" class="tips__main-title">{{ title }}</h2>
      <div class="tips__container">
        <ul class="tips__list">
          <li v-for="(item, index) in tips" :key="index" class="tips__item">
            <div
                :class="['tips__text', item.isTitle ? 'tips__text--header' : 'tips__text--body']"
                v-html="item.text || item.label"
            ></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  tips: { type: Array, required: true },
  title: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
</script>

<style scoped>
.tips__overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.tips__content {
  position: relative;
  background: #ffffff;
  padding: 20px 15px 15px 15px;
  border-radius: 28px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  border: 2px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.tips__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: #fff;
  border: 3px solid #ffffff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  z-index: 10;
  padding-bottom: 2px;
}

.tips__main-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #374151;
  margin: 0 0 16px 0;
  padding-right: 40px;
  font-family: "Nunito", sans-serif;
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips__item {
  margin-bottom: 12px;
}

.tips__text {
  font-family: "Nunito", sans-serif;
}

.tips__text--header {
  font-size: 1.2rem;
  font-weight: 800;
  color: #374151;
  margin: 10px 0 5px 5px;
}

.tips__text--body {
  font-size: 1rem;
  padding: 10px;
  background: #f0fdf4;
  color: #166534;
  border-radius: 16px;
  line-height: 1.4;
  border: 2px solid #bbf7d0;
  font-weight: 500;
}

@media (max-width: 767px) {
  .tips__overlay {
    padding: 15px;
  }
  .tips__content {
    padding: 20px 15px 15px 15px;
  }
  .tips__text--body {
    font-size: 0.95rem;
  }
  .tips__main-title {
    font-size: 1.3rem;
  }
}
</style>