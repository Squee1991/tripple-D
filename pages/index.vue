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

onMounted(() => {
  hydrated.value = true
})
</script>

<template>
  <VEventAvailableModal @close="false" v-if="authStore.initialized"/>
  <VShowFall v-if="eventStore.isSnowEnabled" :image="Snow"/>
<!--  <VShowFall :image="HeartFall"/>-->
  <div v-if="!hydrated || !authStore.initialized" class="loading"></div>
  <div v-else class="container">
    <div v-if="authStore.uid" class="stat">
      <Header/>
      <VUid/>
      <Footer/>
    </div>
    <div v-else>
      <LogIn v-if="showLogin" @close="showLogin = false"/>
      <VStartPage v-else @openLogin="showLogin = true"/>
    </div>
  </div>

</template>

<style scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 10px;
}

.stat {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  height: 100%;
  flex-direction: column;
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
