<template>
  <div v-if="modelValue" class="tips__overlay" @click.self="close">
    <div class="tips__content">
      <button class="tips__close" @click="close">×</button>
      <div class="tips__container">
        <div v-for="group in tips" :key="group.id" class="tips__group">
          <h3 v-if="group.title" class="tips__category-header">{{ group.title }}</h3>
          <ul class="tips__list">
            <li v-for="(item, index) in group.tips" :key="index" class="tips__item">
              <div class="tips__text" v-html="item.label || item.text"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  tips: { type: Array, required: true }
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
  box-shadow: 4px 4px 0 #1e1e1e;
  width: 95%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
}

.tips__close {
  position: absolute;
  top: 15px;
  right: 15px;
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

.tips__category-header {
  font-size: 1.2rem;
  font-weight: 900;
  color: #444;
  margin: 1rem 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-left: 4px solid #f97028;
  padding-left: 10px;
  font-family: "Nunito", sans-serif;
}

.tips__group:first-child .tips__category-header {
  margin-top: 0;
}

.tips__text {
  font-size: 1rem;
  font-weight: 400;
  font-family: "Nunito", sans-serif;
}

@media (max-width: 767px) {
  .tips__content {
    padding: 1.2rem 1.2rem;
    box-shadow: 2px 2px 0 #1e1e1e;
  }
  .tips__text {
    font-size: .8rem;
  }
  .tips__category-header{
    font-size: 1rem;
    font-weight: 900;
  }
}
</style>