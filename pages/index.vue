<template>
    <div class="container">
        <Header/>
        <Description/>
        <FeedBack/>
        <Footer/>
        <VScroll/>
    </div>
</template>

<script setup>

import Description from '../src/components/DescriptionBlock.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import Header from '../src/components/header.vue'
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
    overflow-x: hidden;
}
</style>