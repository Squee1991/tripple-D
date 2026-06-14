<script setup>
import { ref, onMounted, watch } from 'vue'
import { userAuthStore } from "~/store/authStore.js"
import Header from '../src/components/header.vue'
import Banner from '../src/components/banner.vue'
import Description from '../src/components/DescriptionBlock.vue'
import About from '../src/components/about.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import VUid from '../src/components/V-uid.vue'
import VEventAvailableModal from "../src/components/V-eventAvailableModal.vue";
import VShowFall from "../src/components/V-showFall.vue";
import Snow from "../assets/images/mery-christmas/Snow.svg";
import HeartFall from "assets/images/mery-christmas/heartFall.svg";
import { useEventSessionStore } from '../store/eventsStore.js'
import VStartPage from "~/src/components/V-startPage.vue";


const showLogin = ref(false)
const eventStore = useEventSessionStore()
const authStore = userAuthStore()
const hydrated = ref(false)
const isLocallyLogged = ref(false)

definePageMeta({
  layout: 'footerlayout'
})

onMounted(() => {
  hydrated.value = true
})

</script>

<template>
  <VEventAvailableModal @close="false" v-if="authStore.initialized"/>
  <VShowFall v-if="eventStore.isSnowEnabled" :image="Snow"/>
  <div class="container">
    <template v-if="authStore.uid">
      <div class="stat">
        <Header/>
        <VUid/>
        <Footer/>
      </div>
    </template>
    <template v-else-if="authStore.initialized && !authStore.uid">
      <Header/>
      <Banner/>
      <Description/>
      <About/>
      <FeedBack/>
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 1240px;
  width: 100%;
  /* Жестко фиксируем высоту по размеру окна браузера */
  height: 100dvh;
  margin: 0 auto;
  padding: 0 10px;
  overflow: hidden; /* Обрубает всё, что пытается вылезти за пределы экрана */
}

.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%; /* Берет 100% от родительских 100dvh */
  overflow: hidden; /* Никакого скролла внутри */
}

.stat::after{
  content: "";
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  background: var(--overlayAfter);
}

@media (max-width: 767px) {
  .stat {
    /* flex-direction: column; - уже задано выше, можно не дублировать, но оставил как у тебя */
    flex-direction: column;
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 0;
  }
}
</style>