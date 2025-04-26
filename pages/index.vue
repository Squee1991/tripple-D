<template>
    <div class="container">
        <Mainpage/>
    </div>
</template>

<script setup>
import Mainpage from '../src/components/mainPage.vue'
import { useCurrentUser } from 'vuefire'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = useCurrentUser()
const router = useRouter()

onMounted(() => {
    // Проверяем статус аутентификации
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