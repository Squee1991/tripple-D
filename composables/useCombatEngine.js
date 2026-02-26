import { ref, computed, nextTick } from 'vue'

export function useCombatEngine(currentQuestions) {

	const score = ref(0)
	const isGameOver = ref(false)
	const currentSpeed = ref(8)
	const gameKey = ref(0)
	const currentQuestion = ref(null)
	const isMissileFlying = ref(false)
	const isWrongState = ref(false)
	const showSuccessExplosion = ref(false)
	const showGroundExplosion = ref(false)
	const missilePos = ref({ top: 0, left: 0, angle: 0 })
	const vfxPos = ref({ top: '0px', left: '0px' })
	const attackStyle = ref({})

	const mobRef = ref(null)
	const skyRef = ref(null)

	const mobStyles = computed(() => {
		if (isWrongState.value) return attackStyle.value;
		return { animationDuration: currentSpeed.value + 's' };
	})

	const missileStyles = computed(() => ({
		top: missilePos.value.top + 'px',
		left: missilePos.value.left + 'px',
		transform: `translate(-50%, -50%) rotate(${missilePos.value.angle + 90}deg)`,
		opacity: isMissileFlying.value ? 1 : 0
	}))

	const startGame = () => {
		if (currentQuestions.value && currentQuestions.value.length > 0) {
			score.value = 0
			isGameOver.value = false
			showGroundExplosion.value = false
			isWrongState.value = false
			currentSpeed.value = 8
			attackStyle.value = {}
			spawnWord()
		}
	}

	const spawnWord = () => {
		if (!currentQuestions.value || currentQuestions.value.length === 0) return
		isWrongState.value = false
		showSuccessExplosion.value = false
		isMissileFlying.value = false
		attackStyle.value = {}

		const randomIndex = Math.floor(Math.random() * currentQuestions.value.length)
		currentQuestion.value = currentQuestions.value[randomIndex]
		gameKey.value++
	}

	const shoot = async (answer) => {
		if (isGameOver.value || isMissileFlying.value || showGroundExplosion.value) return
		if (!mobRef.value || !skyRef.value) return

		const mobRect = mobRef.value.getBoundingClientRect()
		const skyRect = skyRef.value.getBoundingClientRect()
		if (!mobRect || !skyRect) return

		const startX = skyRect.width / 2
		const startY = skyRect.height - 130
		const targetX = mobRect.left - skyRect.left + (mobRect.width / 2)
		const targetY = mobRect.top - skyRect.top + (mobRect.height / 2)

		const angle = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI

		missilePos.value = { top: startY, left: startX, angle: angle }
		isMissileFlying.value = true

		await nextTick()

		setTimeout(() => {
			missilePos.value = { top: targetY, left: targetX, angle: angle }
			setTimeout(() => { checkHit(answer, targetX, targetY) }, 160)
		}, 20)
	}

	const checkHit = (answer, x, y) => {
		isMissileFlying.value = false
		vfxPos.value = { top: y + 'px', left: x + 'px' }

		if (currentQuestion.value && answer === currentQuestion.value.correct) {
			score.value += 10
			showSuccessExplosion.value = true
			if (currentSpeed.value > 3) currentSpeed.value -= 0.2
			setTimeout(() => { spawnWord() }, 400)
		} else {
			isWrongState.value = true
			if (mobRef.value) {
				const currentTop = mobRef.value.offsetTop
				attackStyle.value = { top: currentTop + 'px', animation: 'none' }
				setTimeout(() => {
					attackStyle.value = {
						top: 'calc(100% - 210px)',
						transition: 'top 1.2s linear',
						animation: 'none'
					}
				}, 50)
			}
		}
	}

	const triggerBomb = () => {
		if (showSuccessExplosion.value) return
		showGroundExplosion.value = true
		setTimeout(() => { isGameOver.value = true }, 900)
	}

	const handleTransitionEnd = () => {
		if (isWrongState.value) triggerBomb()
	}

	return {
		score, isGameOver, currentQuestion, gameKey,
		isWrongState, showSuccessExplosion, showGroundExplosion, isMissileFlying,
		mobRef, skyRef, mobStyles, missileStyles, vfxPos,
		startGame, shoot, handleTransitionEnd, triggerBomb
	}
}