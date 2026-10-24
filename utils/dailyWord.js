// Слово дня в «Угадай слово»: одно слово для всех на дату, одна попытка в день.
import {getDateKey, getDateKeyAfterDays} from './wordReview.js'

// Монет за отгаданное слово дня (обычное слово — 1)
export const DAILY_WORD_COINS = 3

export const getTodayKey = () => getDateKey()
export const getYesterdayKey = () => getDateKeyAfterDays(-1)

// Номер дня с 1970 года — одинаковый на всех устройствах
function getDayNumber(dateKey) {
	const [year, month, day] = dateKey.split('-').map(Number)
	return Math.floor(Date.UTC(year, month - 1, day) / 86400000)
}

// Шаг по списку слов — простое число: соседние дни попадают в разные темы,
// а слова не повторяются, пока не пройдёт весь список
const DAY_STEP = 7919

// Слово дня: из слов, которые можно набрать на клавиатуре игры (без пробелов и редких букв)
export function pickDailyWord(words, alphabet, dateKey = getTodayKey()) {
	const seenWords = new Set()
	const playableWords = words.filter(word => {
		const upperWord = String(word.de || '').toUpperCase()
		if (!upperWord || seenWords.has(upperWord)) return false
		seenWords.add(upperWord)
		return [...upperWord].every(char => alphabet.includes(char))
	})
	if (!playableWords.length) return null
	return playableWords[(getDayNumber(dateKey) * DAY_STEP) % playableWords.length]
}

// Квадратики для «Поделиться»: каждая нажатая буква — есть в слове или нет. Само слово не раскрываем
export function getLetterMarks(usedLetters, answer) {
	return usedLetters.map(letter => answer.includes(letter) ? '🟩' : '🟥').join('')
}

// Сколько осталось до нового слова (до полуночи по местному времени)
export function getTimeUntilNextWord(now = Date.now()) {
	const midnight = new Date(now)
	midnight.setHours(24, 0, 0, 0)
	const minutesLeft = Math.max(0, Math.ceil((midnight.getTime() - now) / 60000))
	return {hours: Math.floor(minutesLeft / 60), minutes: minutesLeft % 60}
}

export function buildDailyShareText({title, result, streak, maxAttempts}) {
	const [year, month, day] = result.date.split('-')
	const lines = [
		`SkillUp German · ${title} ${day}.${month}.${year}`,
		result.isWin
			? `✅ ❤️ ${result.attemptsLeft}/${maxAttempts} · ⏱ ${result.timeSpent}s`
			: `❌ ❤️ 0/${maxAttempts}`,
		result.marks
	]
	if (streak > 1) lines.push(`🔥 ${streak}`)
	lines.push('skillupgerman.com')
	return lines.filter(Boolean).join('\n')
}
