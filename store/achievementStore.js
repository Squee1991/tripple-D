import { defineStore } from 'pinia'
import { ref } from 'vue'
import { overAchievment } from '../src/achieveGroup/overAllAchieve/overallAchievements.js'

export const useAchievementStore = defineStore('achievementStore', () => {
    const groups = ref(overAchievment.map(group => ({
        ...group,
        achievements: group.achievements.map(a => ({ ...a }))
    })))

    const popupQueue = ref([])
    const showPopup = ref(false)
    const popupAchievement = ref(null)

    const previousProgressMap = new Map()

    const findById = (id) => {
        for (const group of groups.value) {
            const ach = group.achievements.find(a => a.id === id)
            if (ach) return ach
        }
        return null
    }

    const updateProgress = (id, newProgress) => {
        const ach = findById(id)
        if (!ach) return

        const prev = previousProgressMap.get(id) ?? 0
        ach.currentProgress = Math.min(newProgress, ach.targetProgress)

        if (ach.currentProgress >= ach.targetProgress && prev < ach.targetProgress) {
            popupQueue.value.push(ach)
            showNextPopup()
        }

        previousProgressMap.set(id, ach.currentProgress)
    }

    const showNextPopup = () => {
        if (!showPopup.value && popupQueue.value.length > 0) {
            popupAchievement.value = popupQueue.value.shift()
            showPopup.value = true
        }
    }

    const closePopup = () => {
        showPopup.value = false
        showNextPopup()
    }

    return {
        groups,
        showPopup,
        popupAchievement,
        closePopup,
        updateProgress,
        findById
    }
})
