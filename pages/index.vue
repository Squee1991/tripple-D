<script setup>
import {ref, onMounted} from 'vue'
import {userAuthStore} from "~/store/authStore.js";
import Header from '../src/components/header.vue'
import Banner from '../src/components/baner.vue'
import Description from '../src/components/DescriptionBlock.vue'
import About from '../src/components/about.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import VUid from '../src/components/V-uid.vue'

const authStore = userAuthStore()
const hydrated = ref(false)

onMounted(() => {
  hydrated.value = true
})

</script>

<template>
  <div v-if="!hydrated || !authStore.initialized" class="loading"></div>
  <div v-else class="container">
    <Header/>
    <div v-if="authStore.uid" class="stat">
      <VUid/>
    </div>
    <div v-else>
      <Banner/>
      <Description/>
      <About/>
      <FeedBack/>
      <Footer/>
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
  margin-top: 10px;
  height: 100%;
  overflow-y: auto;
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
</style>
