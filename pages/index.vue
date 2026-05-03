<script setup>
import {ref, onMounted, watch} from 'vue'
import {userAuthStore} from "~/store/authStore.js"
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
import {useEventSessionStore} from '../store/eventsStore.js'
import VStartPage from "~/src/components/V-startPage.vue";
import LogIn from "~/src/components/logIn.vue";
const showLogin = ref(false)
const eventStore = useEventSessionStore()
const authStore = userAuthStore()
const hydrated = ref(false)
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
    <template v-if="!authStore.initialized">
      <div class="loading">
      </div>
    </template>
    <template v-else>
      <div v-if="authStore.uid" class="stat">
        <Header/>
        <VUid/>
      </div>
      <div v-else>
        <VStartPage/>
      </div>
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 10px;
}

.stat {
  display: flex;
  justify-content: center;
  height: 100%;
  flex-direction: column;
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

.loading {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 10px;
}

@media (max-width: 767px) {
  .container {
    padding: 0;
  }
}
</style>
