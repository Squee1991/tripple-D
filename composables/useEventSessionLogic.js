import { ref, computed } from 'vue'
import DraculaNotAllCorrect from "~/assets/images/event-rewards/halloween-event/halloween-assets/Dracula.svg"
import PumpkinAllCorrect from "~/assets/images/event-rewards/halloween-event/halloween-assets/HedgehogCorrect.svg"
import PumpkinLeaveSession from "~/assets/images/event-rewards/halloween-event/halloween-assets/PumpkinWong.svg"
import DefaultLeaveLesson from "~/assets/images/LeaveLesson.svg"

import PumpkinLeave from '~/assets/animation/hedgehog_pumpkin_oh.json'
import HalloweenSuccessAnim from '~/assets/animation/hedgehog_wolf_howl.json'
import HalloweenFailAnim from '~/assets/animation/hedgehog_devil.json'
// Обычные ежи из квестов на карте (locations): успех, ошибки, выход из задания
import DefaultSuccessAnim from '~/assets/animation/hedgehog_thumbs_up.json'
import DefaultFailAnim from '~/assets/animation/hedgehog_shrug_2.json'
import DefaultLeaveAnim from '~/assets/animation/hedgehog_leave_session.json'

// Хэллоуинские ежи только у хэллоуинского ивента, остальные ивенты получают обычных.
// Раньше выбор шёл по месяцу, и в ноябре зимний ивент показывал тыкву
export function useEventSessionLogic(eventId) {
    const currentSeason = computed(() => {
        const id = typeof eventId === 'function' ? eventId() : eventId?.value ?? eventId
        return id === 'halloween' ? 'halloween' : 'default'
    })

    const getResultIcon = (isFullyCompleted) => {
        if (currentSeason.value === 'halloween') {
            return isFullyCompleted ? PumpkinAllCorrect : DraculaNotAllCorrect
        }
        return DefaultLeaveLesson
    }

    const getResultAnimation = (isFullyCompleted) => {
        if (currentSeason.value === 'halloween') {
            return isFullyCompleted ? HalloweenSuccessAnim : HalloweenFailAnim
        }
        return isFullyCompleted ? DefaultSuccessAnim : DefaultFailAnim
    }

    const getLeaveAnimation = () => {
        if (currentSeason.value === 'halloween') return PumpkinLeave
        return DefaultLeaveAnim
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
        getResultAnimation,
        getLeaveAnimation,
        animStep,
        displayXp,
        displayCoins,
        confettiParticles,
        runSuccessAnimation
    }
}