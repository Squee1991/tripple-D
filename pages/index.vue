<script setup>
    import Header from '../src/components/header.vue'
    import Banner from '../src/components/baner.vue'
    import AchPopup from '../src/components/achievementPopup.vue'
    import Description from '../src/components/DescriptionBlock.vue'
    import About from '../src/components/about.vue'
    import FeedBack from '../src/components/feedBack.vue'
    import Footer from '../src/components/footer.vue'
    import { onMounted, ref, watchEffect } from 'vue'
    import { useRouter } from 'vue-router'
    import { useCurrentUser } from 'vuefire'
    import { userAuthStore } from '../store/authStore.js'
    import { useAchievementStore } from '../store/achievementStore.js'
    import { overAchievment } from '../src/achieveGroup/overAllAchieve/overallAchievements.js'

    const user = useCurrentUser()
    const router = useRouter()
    const authStore = userAuthStore()
    const achStore = useAchievementStore()

    const showPopup = ref(false)
    const popupAchievement = ref(null)
    const popupQueue = ref([])
    const previousProgressMap = new Map()

    const close = () => {
        achStore.showPopup = false
        showNextAchievement()
    }

    const showNextAchievement = () => {
        if (popupQueue.value.length > 0) {
            achStore.popupAchievement = popupQueue.value.shift()
            achStore.showPopup = true
        }
    }

    onMounted(() => {
        if (!user.value) {
            router.push('/')
        }

        for (const group of overAchievment) {
            for (const ach of group.achievements) {
                previousProgressMap.set(ach.id, ach.currentProgress)
            }
        }
    })

    watchEffect(() => {
        for (const group of overAchievment) {
            for (const ach of group.achievements) {
                const previous = previousProgressMap.get(ach.id) ?? 0
                const current = ach.currentProgress

                if (current >= ach.targetProgress && previous < ach.targetProgress) {
                    const alreadyInQueue = popupQueue.value.find(a => a.id === ach.id)
                    const isAlreadyShown = achStore.popupAchievement?.id === ach.id

                    if (!alreadyInQueue && !isAlreadyShown) {
                        popupQueue.value.push(ach)
                    }

                    if (!achStore.showPopup) {
                        showNextAchievement()
                    }
                }

                previousProgressMap.set(ach.id, current)
            }
        }
    })
</script>

<template>
    <div class="container">
        <Header />
        <Banner />
<!--        <AchPopup-->
<!--                v-if="achStore.showPopup"-->
<!--                :achievement="achStore.popupAchievement"-->
<!--                @close="achStore.closePopup"-->
<!--        />-->
        <Description/>
        <About/>
        <FeedBack/>
        <Footer/>
    </div>
</template>
