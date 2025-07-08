<template>
    <div class="container">
        <Header/>
        <Baner/>
        <Description/>
        <About/>
        <FeedBack/>
        <Footer/>
    </div>

</template>

<script setup>
import Description from '../src/components/DescriptionBlock.vue'
import Coffe from '../src/components/forTea.vue'
import Baner from '../src/components/baner.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import Header from '../src/components/header.vue'
import About from '../src/components/about'
import {useCurrentUser} from 'vuefire'
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import VScroll from "../src/components/v-scroll.vue";
const user = useCurrentUser()
const router = useRouter()


onMounted(() => {
    if (!user.value) {
        router.push('/')
    }
})
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
}

.container {
    max-width: 100%;
    margin: 0 auto;
}

</style>