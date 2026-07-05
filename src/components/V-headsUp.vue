<template>
  <div class="toast-message"> {{ text }}</div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
  }
})

</script>

<style scoped>

.toast-message {
  position: absolute;
  top: calc(env(safe-area-inset-top));
  left: 0;
  width: 100%;
  background: #d97706;
  border-radius: 0 0 16px 16px;
  color: #ffffff;
  padding: 15px 10px 20px 10px;
  font-weight: 800;
  font-size: 18px;
  z-index: 100;

  text-align: center;
}

.toast-message:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 60px;
  left: 0;
  bottom: 100%;
  background: #d97706;
  z-index: 1;
}

</style>