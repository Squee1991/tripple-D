// Умное повторение карточек: упрощённая модель памяти по идеям FSRS (алгоритм, который стоит в Anki).
// У карточки две величины:
//   stability  — прочность памяти в днях: через столько дней шанс вспомнить падает до 90%
//   difficulty — сложность слова для этого человека, от 1 (легко) до 10 (трудно)
// Кнопок «трудно / легко» нет: оценку ставим сами по ответу (ошибка, опечатка, скорость).
import {getDateKey, MAX_WORD_LEVEL, REVIEW_INTERVAL_DAYS} from '~/utils/wordReview.js'

export const GRADE = {AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4}

// параметры FSRS v4 по умолчанию (подобраны на миллионах повторений Anki)
const W = {
	successBase: 1.49, // как сильно растёт прочность после верного ответа
	stabilityDecay: 0.14, // чем прочнее память, тем меньше она растёт
	recallGain: 0.94, // вспомнил, когда почти забыл: прочность растёт сильнее
	hardFactor: 0.29,
	easyFactor: 1.8, // в FSRS 2.61, но у нас «легко» ставим сами за быстрый ответ, поэтому мягче
	lapseBase: 2.18, // прочность после ошибки
	lapseDifficulty: 0.05,
	lapseStability: 0.34,
	lapseRecall: 1.26
}
const MIN_INTERVAL = 1
const MAX_INTERVAL = 365
const DEFAULT_DIFFICULTY = 5

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function daysBetween(fromKey, toKey) {
	if (!fromKey || !toKey) return 0
	const [y1, m1, d1] = fromKey.split('-').map(Number)
	const [y2, m2, d2] = toKey.split('-').map(Number)
	return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

// шанс вспомнить через elapsed дней при прочности stability (кривая забывания FSRS)
export function recallChance(stability, elapsed) {
	return Math.pow(1 + Math.max(0, elapsed) / (9 * Math.max(0.1, stability)), -1)
}

// уровень 0..6 для шкалы и выбора задания: по прочности памяти
const LEVEL_BY_STABILITY = [2, 5, 12, 25, 50]
export function levelFromStability(stability) {
	const index = LEVEL_BY_STABILITY.findIndex(limit => stability < limit)
	return index === -1 ? MAX_WORD_LEVEL : index + 1
}

// старые карточки без модели: прочность берём из прежнего интервала уровня
function stateOf(card) {
	const level = Number(card?.level || 1)
	return {
		stability: Number(card?.stability) || REVIEW_INTERVAL_DAYS[clamp(level, 1, MAX_WORD_LEVEL)] || 1,
		difficulty: Number(card?.difficulty) || DEFAULT_DIFFICULTY,
		reps: Number(card?.reps) || 0,
		lapses: Number(card?.lapses) || 0,
		// когда повторяли последний раз; у старых карточек считаем от прошлого интервала
		lastReviewDate: card?.lastReviewDate
			|| (card?.nextReviewDate ? shiftDateKey(card.nextReviewDate, -(REVIEW_INTERVAL_DAYS[clamp(level, 1, MAX_WORD_LEVEL)] || 1)) : getDateKey())
	}
}

function shiftDateKey(key, days) {
	const [y, m, d] = key.split('-').map(Number)
	const date = new Date(y, m - 1, d + days)
	return getDateKey(date)
}

// интервал = прочность (цель: вспоминать с шансом 90%), немного разброса,
// чтобы слова, выученные в один день, не приходили всегда одной кучей
function intervalFor(stability) {
	const days = clamp(Math.round(stability), MIN_INTERVAL, MAX_INTERVAL)
	if (days < 3) return days
	const fuzz = Math.round(days * 0.05 * (Math.random() * 2 - 1))
	return clamp(days + fuzz, MIN_INTERVAL, MAX_INTERVAL)
}

function schedule(state, today) {
	const interval = intervalFor(state.stability)
	return {
		stability: Math.round(state.stability * 100) / 100,
		difficulty: Math.round(state.difficulty * 100) / 100,
		reps: state.reps,
		lapses: state.lapses,
		level: levelFromStability(state.stability),
		lastReviewDate: today,
		nextReviewDate: shiftDateKey(today, interval)
	}
}

// карточку выучили в «Учить»: первый повтор завтра; с ошибками в уроке слово считаем сложнее
export function afterLesson(hadMistakes, today = getDateKey()) {
	return schedule({
		stability: 1,
		difficulty: hadMistakes ? 6.5 : 4.5,
		reps: 0,
		lapses: 0
	}, today)
}

// ответ при повторении с оценкой grade (GRADE.*) → новое состояние и дата следующего повтора
export function afterReview(card, grade, today = getDateKey()) {
	const state = stateOf(card)
	const elapsed = daysBetween(state.lastReviewDate, today)
	const recall = recallChance(state.stability, elapsed)

	// сложность: ошибки и «трудно» поднимают, «легко» опускает; понемногу тянется к середине
	const shifted = state.difficulty - 0.8 * (grade - GRADE.GOOD)
	const difficulty = clamp(0.9 * shifted + 0.1 * DEFAULT_DIFFICULTY, 1, 10)

	let stability
	if (grade === GRADE.AGAIN) {
		stability = W.lapseBase * Math.pow(difficulty, -W.lapseDifficulty)
			* (Math.pow(state.stability + 1, W.lapseStability) - 1) * Math.exp(W.lapseRecall * (1 - recall))
		stability = clamp(stability, 0.5, state.stability)
	} else {
		const bonus = grade === GRADE.HARD ? W.hardFactor : grade === GRADE.EASY ? W.easyFactor : 1
		const growth = Math.exp(W.successBase) * (11 - difficulty) * Math.pow(state.stability, -W.stabilityDecay)
			* (Math.exp(W.recallGain * (1 - recall)) - 1) * bonus
		stability = state.stability * (1 + growth)
	}

	return schedule({
		stability,
		difficulty,
		reps: state.reps + 1,
		lapses: state.lapses + (grade === GRADE.AGAIN ? 1 : 0)
	}, today)
}

// оценка ответа без кнопок: ошибка, опечатка, скорость.
// Выбор из вариантов проще, чем написать слово, поэтому пороги разные
export function gradeAnswer({correct, almost = false, type, ms = 0, answerLength = 0}) {
	if (!correct) return GRADE.AGAIN
	if (almost) return GRADE.HARD
	// выбрать из вариантов (узнать) проще, чем вспомнить и написать: «легко» даём только за письмо и на слух
	const isChoice = type === 'meaning' || type === 'article'
	const slow = isChoice ? 9000 : 14000 + 500 * answerLength
	const fast = 4000 + 250 * answerLength
	if (ms >= slow) return GRADE.HARD
	if (!isChoice && ms > 0 && ms <= fast) return GRADE.EASY
	return GRADE.GOOD
}
