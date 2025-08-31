<script setup>
import {userAuthStore} from "~/store/authStore.js";
import Header from '../src/components/header.vue'
import Banner from '../src/components/baner.vue'
import Description from '../src/components/DescriptionBlock.vue'
import About from '../src/components/about.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import VUid from '../src/components/V-uid.vue'


const authStore = userAuthStore()
</script>

<template>
  <div class="container">
    <Header/>
    <div v-if="!authStore.uid">
      <Banner/>
      <Description/>
      <About/>
      <FeedBack/>
    </div>
    <div class="stat" v-else>
      <!--      <VMap/>-->
      <VUid/>
    </div>
    <Footer/>
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
  margin-top: 25px;
}

@media (max-width: 767px) {
  .stat {
    flex-direction: column;
    justify-content: center;
  }
}
</style>
