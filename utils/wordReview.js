// Интервальное повторение слов.
// У каждого слова есть уровень: 0 — новое, 1..MAX_WORD_LEVEL — выучено и повторяется.
// Чем выше уровень, тем реже слово возвращается и тем сложнее задание при повторе.

// Через сколько дней повторить слово, которое только что перешло на этот уровень
export const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30, 60]
export const MAX_WORD_LEVEL = REVIEW_INTERVAL_DAYS.length - 1

// Урок идёт группами по столько слов; повторение — не больше REVIEW_WORD_COUNT слов за раз
export const LESSON_WORD_COUNT = 5
export const REVIEW_WORD_COUNT = 15

// Шаги урока по порядку: знакомство → выбрать перевод → собрать из букв → написать с артиклем.
// Слово выучено, когда пройдены все шаги; на слух и мн. число — уже при повторении
export const LESSON_STEPS = ['wordTranslate', 'meaning', 'letters', 'wordArticle']

// Дата в виде '2026-10-15' по местному времени
export function getDateKey(date = new Date()) {
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${date.getFullYear()}-${month}-${day}`
}

export function getDateKeyAfterDays(days) {
	const date = new Date()
	date.setDate(date.getDate() + days)
	return getDateKey(date)
}

// Слово уже выучено (прошло урок) и участвует в повторении
export function isWordInReview(word) {
	return Number(word?.level || 0) >= 1
}

// Пора ли повторять слово сегодня
export function isWordDue(word, todayKey = getDateKey()) {
	return isWordInReview(word) && !!word.nextReviewDate && word.nextReviewDate <= todayKey
}

// Слово дошло до последнего уровня — «освоено»
export function isWordMastered(word) {
	return Number(word?.level || 0) >= MAX_WORD_LEVEL
}

// Какое задание дать при повторении — зависит от уровня слова
export function getReviewTaskForWord(word) {
	const level = Number(word?.level || 1)
	const hasPlural = !!String(word?.plural || '').trim()
	if (level <= 1) return 'meaning'
	if (level === 2) return 'wordArticle'
	if (level === 3) return 'audio'
	if (level === 4 && hasPlural) return 'plural'
	return Math.random() < 0.5 ? 'wordArticle' : 'audio'
}

// Новый уровень и дата следующего повтора после ответа при повторении:
// верно — уровень выше и пауза длиннее, ошибка — на WRONG_ANSWER_LEVEL_DROP уровня ниже (но не ниже 1),
// чтобы одна ошибка в давно знакомом слове не отбрасывала его в самое начало
const WRONG_ANSWER_LEVEL_DROP = 2
export function getLevelAfterReviewAnswer(word, isCorrect) {
	const currentLevel = Number(word?.level || 1)
	const newLevel = isCorrect
		? Math.min(currentLevel + 1, MAX_WORD_LEVEL)
		: Math.max(1, currentLevel - WRONG_ANSWER_LEVEL_DROP)
	return {
		level: newLevel,
		nextReviewDate: getDateKeyAfterDays(REVIEW_INTERVAL_DAYS[newLevel])
	}
}

// Сколько слов будет ждать повторения в каждый из следующих дней (сегодня, завтра, ...)
export function getReviewForecast(words, daysAhead = 7) {
	const dateKeys = Array.from({length: daysAhead + 1}, (_, dayIndex) => getDateKeyAfterDays(dayIndex))
	return dateKeys.map(dateKey => words.filter(word => isWordDue(word, dateKey)).length)
}

export function shuffleList(list) {
	const result = [...list]
	for (let index = result.length - 1; index > 0; index--) {
		const randomIndex = Math.floor(Math.random() * (index + 1))
		;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
	}
	return result
}

// ===== Проверка ответа =====

// Ответ без лишних пробелов и регистра; ae/oe/ue/ss засчитываются как ä/ö/ü/ß (нет немецкой клавиатуры)
export function normalizeAnswer(text) {
	return String(text || '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
}

// Сколько букв нужно поменять, вставить или удалить, чтобы из одной строки получить другую
function getEditDistance(first, second) {
	let previousRow = Array.from({length: second.length + 1}, (_, index) => index)
	for (let firstIndex = 1; firstIndex <= first.length; firstIndex++) {
		const currentRow = [firstIndex]
		for (let secondIndex = 1; secondIndex <= second.length; secondIndex++) {
			const replaceCost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1
			currentRow.push(Math.min(
				previousRow[secondIndex] + 1,
				currentRow[secondIndex - 1] + 1,
				previousRow[secondIndex - 1] + replaceCost
			))
		}
		previousRow = currentRow
	}
	return previousRow[second.length]
}

// Опечатка в одну букву в самом слове (артикль при этом должен быть верным) — «почти верно»
const MIN_LENGTH_FOR_TYPO = 4
export function isAlmostCorrectAnswer(userAnswer, correctAnswer) {
	const user = normalizeAnswer(userAnswer)
	const correct = normalizeAnswer(correctAnswer)
	if (correct.length < MIN_LENGTH_FOR_TYPO) return false
	const userArticle = user.includes(' ') ? user.split(' ')[0] : ''
	const correctArticle = correct.includes(' ') ? correct.split(' ')[0] : ''
	if (userArticle !== correctArticle) return false
	return getEditDistance(user, correct) === 1
}

// ===== Подсказки по роду =====

// Окончания, по которым род почти всегда угадывается. Длинные окончания идут раньше коротких
const GENDER_RULES = [
	{suffix: 'schaft', article: 'die'},
	{suffix: 'ismus', article: 'der'},
	{suffix: 'heit', article: 'die'},
	{suffix: 'keit', article: 'die'},
	{suffix: 'chen', article: 'das'},
	{suffix: 'lein', article: 'das'},
	{suffix: 'ling', article: 'der'},
	{suffix: 'ment', article: 'das'},
	{suffix: 'ung', article: 'die'},
	{suffix: 'ion', article: 'die'},
	{suffix: 'tät', article: 'die'},
	{suffix: 'enz', article: 'die'},
	{suffix: 'anz', article: 'die'},
	{suffix: 'ist', article: 'der'},
	{suffix: 'ei', article: 'die'},
	{suffix: 'ik', article: 'die'},
	{suffix: 'ur', article: 'die'},
	{suffix: 'um', article: 'das'},
	{suffix: 'or', article: 'der'}
]

// Правило рода для слова. Показываем его, только если слово ему подчиняется — исключения не путают
export function getGenderRule(word) {
	const germanWord = String(word?.de || '').toLowerCase()
	const rule = GENDER_RULES.find(genderRule => germanWord.endsWith(genderRule.suffix))
	if (!rule || rule.article !== word.article) return null
	return {suffix: '-' + rule.suffix, article: rule.article}
}
