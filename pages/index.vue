<script setup>
import {userAuthStore} from "~/store/authStore.js";
import Header from '../src/components/header.vue'
import Banner from '../src/components/baner.vue'
import Description from '../src/components/DescriptionBlock.vue'
import About from '../src/components/about.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import Vmap from "~/src/components/Vmap.vue";

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
    <div v-else>
      <Vmap/>
    </div>
    <div v-if="!authStore.uid">
      <Footer/>
    </div>


  </div>
</template>

<style scoped>
.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 10px;
}
</style>
