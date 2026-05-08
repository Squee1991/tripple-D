<template>
  <transition name="fade-slide" mode="out-in" appear>
    <slot/>
  </transition>
</template>

<style scoped>

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease-out;
  will-change: transform, opacity;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translate3d(0, 13px, 0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translate3d(0, -13px, 0);
}

</style>

<script setup>

</script>