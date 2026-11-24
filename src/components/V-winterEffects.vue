<script setup>
import VShowFall from '~/src/components/V-showFall.vue'
import Snow from '~/assets/images/mery-christmas/Snow.svg'
import { useEventSessionStore } from '~/store/eventsStore.js'

// Зимнее оформление главной на время зимнего ивента.
// Лёгкий снег под контентом: 12 снежинок, только CSS-анимация, чтобы не грузить телефон.
// Если куплен снегопад из магазина ивента, свой снег не рисуем: его уже рисует главная
const eventStore = useEventSessionStore()

</script>

<template>
  <div class="frost" aria-hidden="true">
    <VShowFall v-if="!eventStore.isSnowEnabled" :image="Snow" :count="12"/>
  </div>
</template>

<style scoped>
.frost {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

</style>
