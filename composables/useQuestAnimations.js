import { ref, watch } from 'vue'

export function useQuestAnimations(questStore, previouslyCleared) {
    const animStep = ref(0)
    const displayCoins = ref(0)
    const displayXp = ref(0)
    const confettiParticles = ref([])
    const miniConfettiParticles = ref([])

    const confettiColors = ['#ffb100', '#c982ff', '#4caf50', '#00c2ff', '#ff5252', '#ffffff']

    function spawnConfetti() {
        const particles = []
        for (let i = 0; i < 60; i++) {
            particles.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 1.5,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                duration: 2.5 + Math.random() * 2,
                width: 6 + Math.random() * 8,
                height: 12 + Math.random() * 12
            })
        }
        confettiParticles.value = particles
    }

    function spawnMiniConfetti() {
        const particles = []
        for (let i = 0; i < 30; i++) {
            particles.push({
                id: Date.now() + i,
                left: 20 + Math.random() * 60,
                delay: Math.random() * 0.4,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                duration: 1.5 + Math.random() * 1,
                width: 5 + Math.random() * 5,
                height: 10 + Math.random() * 10
            })
        }
        miniConfettiParticles.value = particles
        setTimeout(() => {
            miniConfettiParticles.value = []
        }, 3000)
    }

    function animateNumber(refVar, target, duration, callback) {
        if (target <= 0) {
            refVar.value = 0
            if (callback) callback()
            return
        }
        let startTime = null
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            refVar.value = Math.floor(easeOut * target)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                refVar.value = target
                if (callback) callback()
            }
        }
        requestAnimationFrame(animate)
    }

    function resetAnimations() {
        animStep.value = 0
        displayCoins.value = 0
        displayXp.value = 0
        confettiParticles.value = []
        miniConfettiParticles.value = []
    }

    watch(() => questStore.finished, (isFinished) => {
        if (!isFinished) return

        animStep.value = 0
        displayCoins.value = 0
        displayXp.value = 0

        if (!questStore.hasMistakes) {
            spawnConfetti()
            const targetXp = questStore.quest?.rewards?.xp || 10
            const targetCoins = questStore.quest?.rewards?.points || 10

            setTimeout(() => {
                animStep.value = 1
                const isCleared = typeof previouslyCleared?.value === 'boolean'
                    ? previouslyCleared.value
                    : Boolean(previouslyCleared)

                if (isCleared) {
                    setTimeout(() => {
                        animStep.value = 4
                    }, 400)
                } else {
                    setTimeout(() => {
                        animStep.value = 2
                        animateNumber(displayXp, targetXp, 1000, () => {
                            animStep.value = 3
                            animateNumber(displayCoins, targetCoins, 1000, () => {
                                setTimeout(() => {
                                    animStep.value = 4
                                }, 300)
                            })
                        })
                    }, 600)
                }
            }, 100)
        } else {
            setTimeout(() => {
                animStep.value = 1
                setTimeout(() => {
                    animStep.value = 2
                }, 1300)
            }, 1000)
        }
    })

    return {
        animStep,
        displayCoins,
        displayXp,
        confettiParticles,
        miniConfettiParticles,
        spawnMiniConfetti,
        resetAnimations
    }
}