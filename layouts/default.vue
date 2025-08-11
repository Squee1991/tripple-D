<template>
  <ColorScheme>

  </ColorScheme>
  <div class="layout">
    <slot></slot>
    <vScroll/>
    <VSideBar/>
  </div>
</template>

<script setup>
import vScroll from '../src/components/v-scroll.vue'
import VSideBar from '../src/components/VToolsSideBar.vue'
import Coffe from '../src/components/forTea.vue'

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'

}
</script>

<style scoped>

</style>