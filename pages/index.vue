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
import VAppBanner from "~/src/components/V-appBanner.vue";


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
  isLocallyLogged.value = localStorage.getItem('app_user_logged') === 'true'
})

watch(() => authStore.uid, (newUid) => {
  if (newUid) {
    localStorage.setItem('app_user_logged', 'true')
    isLocallyLogged.value = true
  } else if (authStore.initialized && !newUid) {
    localStorage.removeItem('app_user_logged')
    isLocallyLogged.value = false
  }
})
</script>

<template>
  <VEventAvailableModal @close="false" v-if="authStore.initialized"/>
  <VShowFall v-if="eventStore.isSnowEnabled" :image="Snow"/>
  <div class="container">
    <ClientOnly>
      <template v-if="authStore.uid">
        <div class="stat">
          <Header/>
          <VUid/>
          <Footer/>
        </div>
      </template>
    </ClientOnly>
    <template v-if="authStore.initialized && !authStore.uid">
      <Header/>
      <Banner/>
      <Description/>
      <About/>
<!--      <VAppBanner/>-->
      <FeedBack/>
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 1240px;
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 0 10px;

}

.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
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