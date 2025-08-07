<template>
    <div class="layout">
        <slot></slot>
        <vScroll/>
    </div>
</template>

<script setup>
import vScroll from '../src/components/v-scroll.vue'
import Coffe from '../src/components/forTea.vue'


import {onMounted} from 'vue'
import {useAchievementStore} from '../store/achievementStore.js'

const achievementStore = useAchievementStore()

onMounted(() => {
    achievementStore.initializeProgressTracking()
})
console.log('Init achievements store:', achievementStore, achievementStore.initializeProgressTracking)
</script>

<style scoped>

</style>