<template>
  <div class="layout">
    <main id="main-content" role="main" tabindex="-1">
      <slot />
    </main>
    <vScroll />
  </div>
</template>

<script setup>
import vScroll from '../src/components/v-scroll.vue'
// import VSideBar from '../src/components/VToolsSideBar.vue'
// import Coffee from '../src/components/forTea.vue'
</script>

<style scoped>
</style>