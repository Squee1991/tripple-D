<template>
  <div v-if="modelValue" class="tips__overlay" @click.self="close">
    <div class="tips__content">
      <button class="tips__close" @click="close">×</button>
      <h2 v-if="title" class="tips__main-title">{{ title }}</h2>
      <div class="tips__container">
        <ul class="tips__list">
          <li v-for="(item, index) in tips" :key="index" class="tips__item">
            <div class="tips__text" v-html="item.text || item.label"></div>
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
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tips__content {
  position: relative;
  background: white;
  padding: 2.5rem 2rem 2rem;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e; /* Сделали тень как в дизайне */
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
}

.tips__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f97028;
  color: #fff;
  border: 2px solid #1e1e1e;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 10;
  padding-bottom: 4px;
}

/* Стили для заголовка */
.tips__main-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #333;
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-family: "Nunito", sans-serif;
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips__item {
  margin-bottom: 1rem;
}

/* Красивые стили для текста подсказки (как в вашем ручном примере) */
.tips__text {
  font-size: 1.1rem;
  font-weight: 400;
  font-family: "Nunito", sans-serif;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #60a5fa; /* Синяя полоска слева */
  line-height: 1.5;
}

@media (max-width: 767px) {
  .tips__content {
    padding: 1.5rem 1rem;
    box-shadow: 4px 4px 0 #1e1e1e;
  }
  .tips__text {
    font-size: 1rem;
  }
  .tips__main-title {
    font-size: 1.2rem;
  }
}
</style>