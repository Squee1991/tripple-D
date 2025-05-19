<template>
    <div class="container">
        <Mainpage/>
        <Description/>
        <FeedBack/>
        <Footer/>
    </div>
</template>

<script setup>
import Mainpage from '../src/components/mainPage.vue'
import Description from '../src/components/DescriptionBlock.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import { useCurrentUser } from 'vuefire'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

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