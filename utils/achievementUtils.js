import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import {overAchievment} from '../src/achieveGroup/overAllAchieve/overallAchievements.js'

export const useAchievementStore = defineStore('achievementStore', () => {
    const showPopup = ref(false)
    const popupAchievement = ref(null)
    const popupQueue = ref([])
    const previousProgressMap = new Map()

    const closePopup = () => {
        showPopup.value = false
        showNext()
    }

    const showNext = () => {
        if (popupQueue.value.length > 0) {
            popupAchievement.value = popupQueue.value.shift()
            showPopup.value = true
        }
    }

    for (const group of overAchievment) {
        for (const ach of group.achievements) {
            previousProgressMap.set(ach.id, ach.currentProgress)
        }
    }
    
    watchEffect(() => {
        for (const group of overAchievment) {
            for (const ach of group.achievements) {
                const prev = previousProgressMap.get(ach.id) ?? 0
                const curr = ach.currentProgress
                if (curr >= ach.targetProgress && prev < ach.targetProgress) {
                    const alreadyQueued = popupQueue.value.find(a => a.id === ach.id)
                    const isCurrentlyShown = popupAchievement.value?.id === ach.id
                    if (!alreadyQueued && !isCurrentlyShown) {
                        popupQueue.value.push(ach)
                    }

                    if (!showPopup.value) {
                        showNext()
                    }
                }

                previousProgressMap.set(ach.id, curr)
            }
        }
    })

    return {
        showPopup,
        popupAchievement,
        closePopup
    }
})
