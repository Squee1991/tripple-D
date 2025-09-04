<template>
  <div v-if="open" class="overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="actions">
        <button v-for="(btn, i) in buttons" :key="i" class="button" @click="$emit('action', btn)">
          <img v-if="btn.icon" :src="btn.icon" :alt="btn.alt || ''">
          <div class="text">{{ btn.text }}</div>
        </button>
      </div>
      <button class="close" @click="$emit('close')">×</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {type: Boolean, required: true},
  buttons: {type: Array, required: true}
})
defineEmits(['close', 'action'])
</script>

<style scoped>


.modal-card {
  width: 270px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #000;
  padding: 25px 16px;
  display: grid;
  gap: 12px;

}

.actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  border: 2px solid black;
  cursor: pointer;
  font-size: 15px;
  box-shadow: 3px 3px 0 black;
}

@media (min-width: 1024px) {
  .button:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }
}

.button img {
  width: 26px;
  height: 26px;
  margin-right: 10px;
}

.text {
  color: #fff;
}

.close {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 3px solid #000;
  background: #f3f4f6;
  font-weight: 900;
  font-size: 20px;
  cursor: pointer;
}
</style>
