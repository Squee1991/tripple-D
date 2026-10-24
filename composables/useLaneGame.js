import { ref, computed } from 'vue'

// Игра «три полосы со стрельбой»: метеорит со словом падает в одной из трёх полос.
// Игрок кнопками ◀ ▶ ставит корабль под метеорит и стреляет, нажимая кнопку с ответом.
//   Корабль под метеоритом и ответ правильный — метеорит взрывается, очки.
//   Корабль под метеоритом и ответ неправильный — ошибка: минус одно деление энергии.
//   Корабль не под метеоритом — лазер пролетает мимо, без штрафа.
//   Метеорит долетел до корабля — тоже ошибка.
//
// Способности корабля:
//   щит — следующая ошибка (или удар босса) не тратит энергию;
//   замедление — несколько следующих метеоритов падают медленнее.
// В начале полёта по одному заряду, ещё заряд — за каждую серию правильных ответов подряд.
//
// Босс: после каждых нескольких правильных ответов сверху появляется огромный метеорит со здоровьем.
// Он медленно опускается, каждый правильный ответ — попадание по нему, ошибка — босс резко опускается.
// Победа над боссом — бонусные очки и заряд способности. Если босс долетел до корабля — минус энергия.

const LANE_COUNT = 3
const START_FALL_TIME_MS = 7000
const MIN_FALL_TIME_MS = 2600
const SPEED_UP_AFTER_CORRECT = 0.96
const SHOT_FLIGHT_MS = 160
const PAUSE_AFTER_CORRECT_MS = 700
const PAUSE_AFTER_MISTAKE_MS = 1500
const MISTAKE_RETURNS_AFTER_ROUNDS = 4
const LONGEST_FRAME_MS = 100

const SLOWDOWN_FALL_TIME_FACTOR = 1.8
const SLOWDOWN_ROUNDS = 3
const STARTING_ABILITY_CHARGES = 1
const COMBO_FOR_NEW_CHARGE = 8

const CORRECT_ANSWERS_BEFORE_BOSS = 10
const BOSS_HEALTH = 3
const BOSS_FULL_DESCENT_MS = 30000
const BOSS_DROP_AFTER_MISTAKE = 0.25
const BOSS_REWARD_POINTS = 10
const BOSS_INTRO_MS = 1600
const BOSS_DEFEAT_PAUSE_MS = 1300

function shuffle(list) {
	const result = [...list]
	for (let index = result.length - 1; index > 0; index--) {
		const randomIndex = Math.floor(Math.random() * (index + 1))
		;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
	}
	return result
}

// handlers — что делать снаружи:
//   onCorrectAnswer(), onMistake({ shieldUsed }), onAbilityEarned(ability),
//   onBossAppeared(), onBossHit(), onBossDefeated(), onBossCrashed({ shieldUsed })
export function useLaneGame(questions, handlers = {}) {
	const score = ref(0)
	const energy = ref(0)
	const combo = ref(0)
	const bestCombo = ref(0)
	const correctCount = ref(0)
	const mistakes = ref([])

	const shieldCharges = ref(0)
	const slowdownCharges = ref(0)
	const isShieldActive = ref(false)
	const slowdownRoundsLeft = ref(0)
	const isSlowdownActive = computed(() => slowdownRoundsLeft.value > 0)

	// Босс: null — босса нет; иначе { health, maxHealth, progress } (progress 0 — наверху, 1 — у корабля)
	const boss = ref(null)
	// intro — надпись «БОСС!», defeated — босс взорван, crashed — босс врезался в корабль
	const bossEvent = ref(null)
	const bossesDefeated = ref(0)
	let correctSinceLastBoss = 0

	const shipLane = ref(1)
	const currentRound = ref(null)
	const fallProgress = ref(0)
	// Лазер в полёте: { lane, isHit } или null
	const shot = ref(null)
	// idle — не начата, falling — метеорит летит, result — показываем итог раунда, over — игра окончена
	const phase = ref('idle')
	// Итог раунда: { isCorrect, chosenAnswer, pointsForRound, shieldUsed }
	const lastResult = ref(null)
	// Пауза: метеорит, босс и переход к следующему раунду замирают
	const isPaused = ref(false)

	const isGameOver = computed(() => phase.value === 'over')
	const isShipUnderMeteor = computed(() => !!currentRound.value && shipLane.value === currentRound.value.meteorLane)
	const comboMultiplier = computed(() => {
		if (combo.value >= 10) return 3
		if (combo.value >= 5) return 2
		return 1
	})

	let fallTimeMs = START_FALL_TIME_MS
	let questionQueue = []
	let animationFrameId = 0
	let lastFrameTime = 0
	let nextRoundTimer = 0
	let shotTimer = 0

	function refillQueue() {
		questionQueue = shuffle(questions.value || [])
	}

	function takeNextQuestion() {
		if (!questionQueue.length) refillQueue()
		return questionQueue.shift() || null
	}

	// Слово с ошибкой вернётся через несколько раундов, чтобы его повторить
	function returnQuestionLater(question) {
		const position = Math.min(MISTAKE_RETURNS_AFTER_ROUNDS, questionQueue.length)
		questionQueue.splice(position, 0, question)
	}

	function currentFallTimeMs() {
		return isSlowdownActive.value ? fallTimeMs * SLOWDOWN_FALL_TIME_FACTOR : fallTimeMs
	}

	// Если на паузе — следующий раунд запустится после «Продолжить»
	let actionAfterPause = null

	function scheduleNextRound(delayMs) {
		nextRoundTimer = setTimeout(() => {
			if (isPaused.value) {
				actionAfterPause = () => scheduleNextRound(0)
				return
			}
			if (energy.value <= 0) {
				phase.value = 'over'
				return
			}
			// Босс долетел до корабля — сначала он врезается, потом следующий раунд
			if (boss.value && boss.value.progress >= 1) {
				crashBoss()
				scheduleNextRound(PAUSE_AFTER_MISTAKE_MS)
				return
			}
			bossEvent.value = null
			startRound()
		}, delayMs)
	}

	function startRound() {
		const question = takeNextQuestion()
		if (!question) return
		currentRound.value = {
			question,
			word: question.word,
			correctAnswer: question.correct,
			answerButtons: shuffle(question.options),
			meteorLane: Math.floor(Math.random() * LANE_COUNT)
		}
		lastResult.value = null
		shot.value = null
		fallProgress.value = 0
		phase.value = 'falling'
		lastFrameTime = 0
		animationFrameId = requestAnimationFrame(onAnimationFrame)
	}

	function onAnimationFrame(frameTime) {
		if (phase.value !== 'falling' || isPaused.value) return
		// После сворачивания приложения кадр может прийти через секунды — не даём метеориту «прыгнуть»
		const frameDuration = lastFrameTime ? Math.min(frameTime - lastFrameTime, LONGEST_FRAME_MS) : 0
		lastFrameTime = frameTime
		fallProgress.value = Math.min(1, fallProgress.value + frameDuration / currentFallTimeMs())
		if (boss.value) {
			boss.value.progress = Math.min(1, boss.value.progress + frameDuration / BOSS_FULL_DESCENT_MS)
		}
		if (fallProgress.value >= 1) {
			// Метеорит долетел до корабля — его не сбили
			registerMistake(null)
			return
		}
		animationFrameId = requestAnimationFrame(onAnimationFrame)
	}

	// --- Стрельба ---
	function shoot(answer) {
		if (phase.value !== 'falling' || shot.value || isPaused.value) return
		const isHit = isShipUnderMeteor.value
		shot.value = { lane: shipLane.value, isHit }
		shotTimer = setTimeout(() => {
			shot.value = null
			if (!isHit || phase.value !== 'falling') return
			if (answer === currentRound.value.correctAnswer) registerCorrectAnswer(answer)
			else registerMistake(answer)
		}, SHOT_FLIGHT_MS)
	}

	function giveAbilityCharge() {
		const ability = shieldCharges.value <= slowdownCharges.value ? 'shield' : 'slowdown'
		if (ability === 'shield') shieldCharges.value += 1
		else slowdownCharges.value += 1
		handlers.onAbilityEarned?.(ability)
	}

	// Щит принимает удар на себя; без щита — минус одно деление энергии. Возвращает, сработал ли щит
	function takeHit() {
		if (isShieldActive.value) {
			isShieldActive.value = false
			return true
		}
		energy.value -= 1
		return false
	}

	// --- Босс ---
	function summonBoss() {
		correctSinceLastBoss = 0
		boss.value = { health: BOSS_HEALTH, maxHealth: BOSS_HEALTH, progress: 0 }
		bossEvent.value = 'intro'
		handlers.onBossAppeared?.()
	}

	// Правильный ответ при боссе — попадание по нему. Возвращает true, если босс побеждён
	function hitBoss() {
		boss.value.health -= 1
		if (boss.value.health > 0) {
			handlers.onBossHit?.()
			return false
		}
		boss.value = null
		bossEvent.value = 'defeated'
		bossesDefeated.value += 1
		score.value += BOSS_REWARD_POINTS
		giveAbilityCharge()
		handlers.onBossDefeated?.()
		return true
	}

	// Босс долетел до корабля: удар по кораблю, босс исчезает
	function crashBoss() {
		const shieldUsed = takeHit()
		boss.value = null
		bossEvent.value = 'crashed'
		correctSinceLastBoss = 0
		handlers.onBossCrashed?.({ shieldUsed })
	}

	function endRound() {
		phase.value = 'result'
		cancelAnimationFrame(animationFrameId)
		if (slowdownRoundsLeft.value > 0) slowdownRoundsLeft.value -= 1
	}

	function registerCorrectAnswer(answer) {
		endRound()
		combo.value += 1
		bestCombo.value = Math.max(bestCombo.value, combo.value)
		correctCount.value += 1
		const pointsForRound = comboMultiplier.value
		score.value += pointsForRound
		fallTimeMs = Math.max(MIN_FALL_TIME_MS, fallTimeMs * SPEED_UP_AFTER_CORRECT)
		lastResult.value = { isCorrect: true, chosenAnswer: answer, pointsForRound, shieldUsed: false }
		if (combo.value % COMBO_FOR_NEW_CHARGE === 0) giveAbilityCharge()
		handlers.onCorrectAnswer?.()

		if (boss.value) {
			const bossDefeated = hitBoss()
			scheduleNextRound(bossDefeated ? BOSS_DEFEAT_PAUSE_MS : PAUSE_AFTER_CORRECT_MS)
			return
		}
		correctSinceLastBoss += 1
		if (correctSinceLastBoss >= CORRECT_ANSWERS_BEFORE_BOSS) {
			summonBoss()
			scheduleNextRound(BOSS_INTRO_MS)
			return
		}
		scheduleNextRound(PAUSE_AFTER_CORRECT_MS)
	}

	// chosenAnswer — неправильный ответ, которым выстрелили; null — метеорит долетел, никто не сбил
	function registerMistake(chosenAnswer) {
		endRound()
		const round = currentRound.value
		const shieldUsed = takeHit()
		combo.value = 0
		mistakes.value.push({ word: round.word, correctAnswer: round.correctAnswer, chosenAnswer })
		returnQuestionLater(round.question)
		lastResult.value = { isCorrect: false, chosenAnswer, pointsForRound: 0, shieldUsed }
		handlers.onMistake?.({ shieldUsed })
		if (boss.value) {
			boss.value.progress = Math.min(1, boss.value.progress + BOSS_DROP_AFTER_MISTAKE)
		}
		scheduleNextRound(PAUSE_AFTER_MISTAKE_MS)
	}

	function moveShip(direction) {
		if (phase.value !== 'falling' || isPaused.value) return
		shipLane.value = Math.min(LANE_COUNT - 1, Math.max(0, shipLane.value + direction))
	}

	function activateShield() {
		if (phase.value === 'over' || isShieldActive.value || shieldCharges.value <= 0) return
		shieldCharges.value -= 1
		isShieldActive.value = true
	}

	function activateSlowdown() {
		if (phase.value === 'over' || isSlowdownActive.value || slowdownCharges.value <= 0) return
		slowdownCharges.value -= 1
		slowdownRoundsLeft.value = SLOWDOWN_ROUNDS
	}

	function pauseGame() {
		if (phase.value === 'over' || phase.value === 'idle' || isPaused.value) return
		isPaused.value = true
		cancelAnimationFrame(animationFrameId)
	}

	function resumeGame() {
		if (!isPaused.value) return
		isPaused.value = false
		if (actionAfterPause) {
			const action = actionAfterPause
			actionAfterPause = null
			action()
			return
		}
		if (phase.value === 'falling') {
			lastFrameTime = 0
			animationFrameId = requestAnimationFrame(onAnimationFrame)
		}
	}

	// Досрочное завершение полёта: игра заканчивается как обычно, очки сохраняются
	function finishGame() {
		stopGame()
		isPaused.value = false
		actionAfterPause = null
		shot.value = null
		phase.value = 'over'
	}

	function stopGame() {
		cancelAnimationFrame(animationFrameId)
		clearTimeout(nextRoundTimer)
		clearTimeout(shotTimer)
	}

	// startingEnergy — сколько делений энергии у корабля на этот полёт
	function startGame(startingEnergy) {
		stopGame()
		if (!questions.value?.length || startingEnergy <= 0) return
		score.value = 0
		energy.value = startingEnergy
		combo.value = 0
		bestCombo.value = 0
		correctCount.value = 0
		mistakes.value = []
		shieldCharges.value = STARTING_ABILITY_CHARGES
		slowdownCharges.value = STARTING_ABILITY_CHARGES
		isShieldActive.value = false
		slowdownRoundsLeft.value = 0
		boss.value = null
		bossEvent.value = null
		bossesDefeated.value = 0
		correctSinceLastBoss = 0
		isPaused.value = false
		actionAfterPause = null
		shipLane.value = 1
		fallTimeMs = START_FALL_TIME_MS
		refillQueue()
		startRound()
	}

	return {
		LANE_COUNT,
		score, energy, combo, bestCombo, comboMultiplier, correctCount, mistakes,
		shieldCharges, slowdownCharges, isShieldActive, isSlowdownActive, slowdownRoundsLeft,
		boss, bossEvent, bossesDefeated,
		shipLane, currentRound, fallProgress, shot, phase, lastResult, isGameOver, isShipUnderMeteor,
		isPaused,
		startGame, stopGame, pauseGame, resumeGame, finishGame, moveShip, shoot, activateShield, activateSlowdown
	}
}
