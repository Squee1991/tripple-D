<template>
  <div v-if="modelValue" class="tips__overlay" @click.self="close">
    <div class="tips__content">
      <button class="tips__close" @click="close">×</button>
      <h2 class="tipps__title">{{ title }}</h2>
      <ul class="tips__list">
        <li v-for="(tip, index) in tips" :key="index" class="tips__item">
          <div class="tips__text" v-html="tip.text"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  tips: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Tipps'
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style>
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
  padding: 2rem;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e;
  width: 90%;
  max-width: 500px;
}

.tips__close {
  position: absolute;
  top: 10px;
  right: 10px;
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
  padding-bottom: 4px;
}

.tipps__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips__item {
  margin-bottom: 1rem;
}

.tips__text {
  font-size: 1.1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #60a5fa;
}

@media (max-width: 767px) {
  .tips__content {
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}
</style>
