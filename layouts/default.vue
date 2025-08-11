<template>
    <ColorScheme>

    </ColorScheme>
    <div class="layout">
        <slot></slot>
        <vScroll/>
        <VSideBar/>
    </div>
</template>

<script setup>
import vScroll from '../src/components/v-scroll.vue'
import VSideBar from '../src/components/VToolsSideBar.vue'
import Coffe from '../src/components/forTea.vue'
import {watch} from 'vue'
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {useAchievementStore} from '../store/achievementStore.js'

const colorMode = useColorMode()
const achievementStore = useAchievementStore()


function toggleColorMode() {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'

}

watch(() => achievementStore.lastUnlockedAward, (val) => {
    if (!val || !process.client) return
    console.log('[toast] lastUnlockedAward changed:', val)
    toast.success(`🎉 Вы получили награду «${val.title}»!`, {
        autoClose: 4000,
        position: toast.POSITION.TOP_CENTER,
    })
})
</script>

<style scoped>

</style>