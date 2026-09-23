import { ref, computed } from 'vue'
import DraculaNotAllCorrect from "~/assets/images/event-rewards/halloween-event/halloween-assets/Dracula.svg"
import PumpkinAllCorrect from "~/assets/images/event-rewards/halloween-event/halloween-assets/HedgehogCorrect.svg"
import PumpkinLeaveSession from "~/assets/images/event-rewards/halloween-event/halloween-assets/PumpkinWong.svg"
import DefaultLeaveLesson from "~/assets/images/LeaveLesson.svg"

export function useEventSessionLogic() {
    const currentMonth = new Date().getMonth()

    const currentSeason = computed(() => {
        if (currentMonth >= 8 && currentMonth <= 10) return 'halloween'
        if (currentMonth === 11 || currentMonth === 0) return 'winter'
        if (currentMonth === 1) return 'february'
        if (currentMonth === 3) return 'april'
        return 'default'
    })

    const getResultIcon = (isFullyCompleted) => {
        if (currentSeason.value === 'halloween') {
            return isFullyCompleted ? PumpkinAllCorrect : DraculaNotAllCorrect
        }
        return DefaultLeaveLesson
    }

    const getLeaveIcon = () => {
        if (currentSeason.value === 'halloween') return PumpkinLeaveSession
        return DefaultLeaveLesson
    }

    const animStep = ref(0)
    const displayXp = ref(0)
    const displayCoins = ref(0)
    const confettiParticles = ref([])

    function animateValue(targetRef, endVal, duration) {
        let startTime = null
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            targetRef.value = Math.floor(progress * endVal)
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }

    function runSuccessAnimation(isQuestFullyCompleted, isReplayMode, rewardRep, rewardCoins) {
        animStep.value = 0
        displayXp.value = 0
        displayCoins.value = 0
        confettiParticles.value = []

        if (isQuestFullyCompleted) {
            confettiParticles.value = Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.3,
                duration: 1.5 + Math.random(),
                width: 8 + Math.random() * 6,
                height: 12 + Math.random() * 8,
                color: ['#ffb100', '#c982ff', '#3b82f6', '#10b981', '#ef4444'][Math.floor(Math.random() * 5)]
            }))
        }

        setTimeout(() => { animStep.value = 1 }, 100)

        if (isQuestFullyCompleted && !isReplayMode) {
            setTimeout(() => {
                animStep.value = 2
                animateValue(displayXp, rewardRep || 0, 800)
            }, 800)
            setTimeout(() => {
                animStep.value = 3
                animateValue(displayCoins, rewardCoins || 0, 800)
            }, 1600)
            setTimeout(() => { animStep.value = 4 }, 2400)
        } else {
            setTimeout(() => { animStep.value = 2 }, 800)
        }
    }

    return {
        getResultIcon,
        getLeaveIcon,
        animStep,
        displayXp,
        displayCoins,
        confettiParticles,
        runSuccessAnimation
    }
}