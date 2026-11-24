import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {doc, setDoc, getDoc, getFirestore, updateDoc, runTransaction} from 'firebase/firestore'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {dailyStore} from './dailyStore.js'
import {
	REVIEW_INTERVAL_DAYS,
	LESSON_STEPS,
	getDateKey,
	getDateKeyAfterDays,
	isWordDue,
	isWordInReview,
	getLevelAfterReviewAnswer
} from '../utils/wordReview.js'

export const userlangStore = defineStore('learning', () => {
	const db = getFirestore()
	const daily = dailyStore()
	const words = ref([])
	const learnedWords = ref([])
	const wrongAnswers = ref([])
	const selectedTopics = ref([])
	const selectedWords = ref([])
	const points = ref(0)
	const learningLang = ref('de')
	const gotPremiumBonus = ref(false)
	const totalEarnedPoints = ref(0)
	const articlesSpentForAchievement = ref(0)
	const currentIndex = ref(0)
	const currentModeIndex = ref(0)
	const exp = ref(0)
	const isLeveling = ref(0)
	const isLoaded = ref(false)
	// Чей прогресс сейчас в памяти. Сохраняем только в документ этого же пользователя
	const loadedUid = ref(null)
	const bestStreakAnyMode = ref(0)
	const bestStreakEasyArticle = ref(0)

	const keyTopic = v => v ?? null
	const findByKey = (arr, de, topic) => arr.find(w => w.de === de && keyTopic(w.topic) === keyTopic(topic))

	const topicStats = computed(() => {
		const stats = {}
		const topics = [...new Set(words.value.map(w => w.topic).filter(Boolean))]
		for (const topic of topics) {
			const total = words.value.filter(w => w.topic === topic).length
			const learned = learnedWords.value.filter(w => w.topic === topic).length
			stats[topic] = {totalWords: total, learnedWords: learned}
		}
		return stats
	})

	const markProgress = async (word, modeKey, value = true) => {
		const topic = keyTopic(word.topic)
		const found = findByKey(words.value, word.de, topic)
		if (found && found.progress && found.progress[modeKey] === true) {
			return;
		}

		const selected = findByKey(selectedWords.value, word.de, topic)
		if (selected) {
			if (!selected.progress) selected.progress = {}
			selected.progress[modeKey] = value
		}

		if (found) {
			if (!found.progress) found.progress = {}
			found.progress[modeKey] = value
		}

		if (value === true) {
			if (modeKey !== 'wordTranslate') {
				points.value++
				totalEarnedPoints.value++
				exp.value++
				handleLeveling()
				try {
					daily.addPoints(1)
					daily.addExp(1)
				} catch {}
			}
			try {
				if (modeKey === 'wordArticle') daily.addWordArticle(1)
				if (modeKey === 'plural')      daily.addPlural(1)
				if (modeKey === 'audio')       daily.addAudioArticle(1)
			} catch {}
		}

		const required = ['article','letters','wordArticle','audio','plural']
		const p = (found?.progress) || {}
		const allPassed = required.every(m => p[m] === true)
		if (allPassed) {
			const already = !!findByKey(learnedWords.value, word.de, topic)
			if (!already) {
				learnedWords.value.push({ ...found, progress: { ...p } })
				try { daily.addLearned(1) } catch {}
			}
		}
		// await saveToFirebase()
	}

	const recordAnswerResult = (isCorrect, {modeKey = null, difficulty = null} = {}) => {
		let currentAny = Number(sessionStorage.getItem('streakAnyMode') || '0')
		currentAny = isCorrect ? currentAny + 1 : 0
		sessionStorage.setItem('streakAnyMode', String(currentAny))
		if (currentAny > bestStreakAnyMode.value) {
			bestStreakAnyMode.value = currentAny
			// saveToFirebase()
		}
		if (isCorrect && modeKey === 'wordArticle' && difficulty === 'easy') {
			let currentEasy = Number(sessionStorage.getItem('streakEasyArticle') || '0')
			currentEasy = currentEasy + 1
			sessionStorage.setItem('streakEasyArticle', String(currentEasy))
			if (currentEasy > bestStreakEasyArticle.value) {
				bestStreakEasyArticle.value = currentEasy
				// saveToFirebase()
			}
		}
		if (!isCorrect && modeKey === 'wordArticle' && difficulty === 'easy') {
			sessionStorage.setItem('streakEasyArticle', '0')
		}
	}


	const addWordsToGlobal = async (wordsList) => {
		let added = false
		wordsList.forEach(newWord => {
			if (!findByKey(words.value, newWord.de, newWord.topic)) {
				words.value.push({
					...newWord,
					progress: {
						wordTranslate: null,
						article: null,
						letters: null,
						wordArticle: null,
						audio: null,
						plural: null
					}
				})
				added = true
			}
		})
		// if (added) await saveToFirebase()
	}

	const setSelectedWords = async (wordsList) => {
		selectedWords.value = wordsList.map(word => ({
			...word,
			progress: {
				wordTranslate: null,
				article: null,
				letters: null,
				wordArticle: null,
				audio: null,
				plural: null
			}
		}))
		currentIndex.value = 0
		currentModeIndex.value = 0
		// await saveToFirebase()
	}

	const handleLeveling = () => {
		const LEVEL_UP_XP = 100
		while (exp.value >= LEVEL_UP_XP) {
			isLeveling.value++
			exp.value -= LEVEL_UP_XP
		}
	}

	const setSelectedTopics = async (topics) => {
		const uniqueTopics = Array.from(new Set([...selectedTopics.value, ...topics]))
		selectedTopics.value = uniqueTopics
		currentIndex.value = 0
		currentModeIndex.value = 0
		// await saveToFirebase()
	}

	const markAsLearned = async (word) => {
		const required = ['wordTranslate', 'article','letters','wordArticle','audio','plural']
		const p = word.progress || {}
		if (!required.every(m => p[m] === true)) return

		const topic = keyTopic(word.topic)
		const already = !!findByKey(learnedWords.value, word.de, topic)
		if (!already) {
			learnedWords.value.push({ ...word })
			try { daily.addLearned(1) } catch {}
			// ОТКЛЮЧЕНО:
			// await saveToFirebase()
		}
	}

	// ===== Интервальное повторение =====

	// Слово с уровнем 0 или без записи — новое; с уровнем 1+ — выучено и повторяется
	const getWordEntry = (word) => findByKey(words.value, word.de, keyTopic(word.topic))

	const addToLearnedWords = (word, {countForDailyTask}) => {
		if (findByKey(learnedWords.value, word.de, keyTopic(word.topic))) return
		learnedWords.value.push({de: word.de, article: word.article, plural: word.plural || '', topic: keyTopic(word.topic)})
		if (countForDailyTask) {
			try { daily.addLearned(1) } catch {}
		}
	}

	// Слова, выученные по старой системе (пройдены все режимы), получают уровень 2.
	// Чтобы не вывалить сразу сотни слов, их первые повторения раскладываются на 2 недели.
	const OLD_LEARNED_SPREAD_DAYS = 14
	const migrateToWordLevels = () => {
		let isChanged = false
		let oldLearnedCount = 0
		for (const word of words.value) {
			// Уровень 0 тоже проверяем: слово могли доучить в старой версии приложения уже после миграции.
			// Новые уроки не отмечают article и audio, так что ложного срабатывания не будет
			if (isWordInReview(word)) continue
			if (isPassedInOldSystem(word)) {
				word.level = 2
				word.nextReviewDate = getDateKeyAfterDays(oldLearnedCount % OLD_LEARNED_SPREAD_DAYS)
				oldLearnedCount++
				addToLearnedWords(word, {countForDailyTask: false})
				isChanged = true
			} else if (word.level === undefined) {
				word.level = 0
				word.nextReviewDate = null
				isChanged = true
			}
		}
		return isChanged
	}

	// По старой системе слово было выучено, когда пройдены все способы (мн. число — только если оно у слова есть)
	const isPassedInOldSystem = (word) => {
		const progress = word.progress || {}
		const hasPlural = !!String(word.plural || '').trim()
		return ['article', 'letters', 'wordArticle', 'audio'].every(mode => progress[mode] === true)
			&& (!hasPlural || progress.plural === true)
	}

	// Слово выучено, когда пройдены все шаги урока
	const isLessonPassed = (word) => LESSON_STEPS.every(step => word.progress?.[step] === true)

	// Шаг урока пройден для слова. Возвращает true, если пройден впервые (за это дают очки).
	// Когда пройдены все шаги — слово выучено: уровень 1, первое повторение завтра
	const passWordMode = (lessonWord, mode) => {
		let word = getWordEntry(lessonWord)
		if (!word) {
			word = {
				de: lessonWord.de,
				article: lessonWord.article,
				plural: lessonWord.plural || '',
				topic: keyTopic(lessonWord.topic),
				level: 0,
				nextReviewDate: null,
				progress: {}
			}
			words.value.push(word)
		}
		if (!word.progress) word.progress = {}
		const isNewlyPassed = word.progress[mode] !== true
		word.progress[mode] = true
		if (!isWordInReview(word) && isLessonPassed(word)) {
			word.level = 1
			word.nextReviewDate = getDateKeyAfterDays(REVIEW_INTERVAL_DAYS[1])
			addToLearnedWords(word, {countForDailyTask: true})
		}
		return isNewlyPassed
	}

	// Задание при повторении выполнено — отмечаем его в прогрессе слова (по прогрессу считаются достижения)
	const markTaskPassed = (reviewWord, taskType) => {
		const word = getWordEntry(reviewWord)
		if (!word) return
		if (!word.progress) word.progress = {}
		word.progress[taskType] = true
	}

	// Ответ при повторении двигает слово по уровням
	const applyReviewAnswer = (reviewWord, isCorrect) => {
		const word = getWordEntry(reviewWord)
		if (!word) return
		Object.assign(word, getLevelAfterReviewAnswer(word, isCorrect))
	}

	// Слова, которые пора повторить сегодня (можно только из одной темы)
	const getDueWords = (topic = null) => {
		const todayKey = getDateKey()
		return words.value.filter(word => isWordDue(word, todayKey) && (!topic || word.topic === topic))
	}

	// Награда за правильный ответ: очки, опыт и счётчики ежедневных заданий
	const rewardCorrectAnswer = (taskType) => {
		points.value++
		totalEarnedPoints.value++
		exp.value++
		handleLeveling()
		try {
			daily.addPoints(1)
			daily.addExp(1)
			if (taskType === 'wordArticle') daily.addWordArticle(1)
			if (taskType === 'plural') daily.addPlural(1)
			if (taskType === 'audio') daily.addAudioArticle(1)
		} catch {}
	}

	const addWrongAnswers = async (word) => {
		if (!word || !word.de) return;
		const isAlreadyInWrong = wrongAnswers.value.find(w => w.de === word.de);
		if (!isAlreadyInWrong) {
			wrongAnswers.value.push({...word});
			// await saveToFirebase();
		}
	};

	const clearProgress = async () => {
		words.value.forEach(word => {
			word.progress = {
				article: false, letters: null, wordArticle: null, audio: null, plural: null
			}
		})
		selectedWords.value.forEach(word => {
			word.progress = {
				article: null, letters: null, wordArticle: null, audio: null, plural: null
			}
		})
		learnedWords.value = []
		points.value = 0
		currentIndex.value = 0
		currentModeIndex.value = 0
		await saveToFirebase({replaceWords: true})
	}
	// ===== Защита прогресса слов от затирания =====
	// Слова хранятся в документе одним массивом, и сохранение записывает его целиком.
	// Поэтому перед записью слова из базы, которых нет в памяти (выучены на другом устройстве
	// или в другой вкладке), добавляются, а не удаляются.

	const getWordKey = word => `${keyTopic(word.topic)}|${word.de}`

	// Объединить два списка слов. При совпадении берём слово из main, но если в extra оно уже
	// выучено, а в main нет — берём из extra. Пройденные шаги складываются
	const mergeWordLists = (mainList, extraList) => {
		const result = mainList.map(word => ({...word}))
		const indexByKey = new Map(result.map((word, index) => [getWordKey(word), index]))
		for (const extraWord of extraList || []) {
			if (!extraWord?.de) continue
			const index = indexByKey.get(getWordKey(extraWord))
			if (index === undefined) {
				indexByKey.set(getWordKey(extraWord), result.length)
				result.push({...extraWord})
				continue
			}
			const mainWord = result[index]
			const chosen = isWordInReview(extraWord) && !isWordInReview(mainWord) ? {...extraWord} : mainWord
			const progress = {...(chosen.progress || {})}
			for (const source of [mainWord.progress, extraWord.progress]) {
				for (const [mode, value] of Object.entries(source || {})) {
					if (value === true) progress[mode] = true
				}
			}
			result[index] = {...chosen, progress}
		}
		return result
	}

	const mergeLearnedWords = (mainList, extraList) => {
		const keys = new Set(mainList.map(getWordKey))
		return [...mainList, ...(extraList || []).filter(word => word?.de && !keys.has(getWordKey(word)))]
	}

	const loadFromFirebase = async () => {
		const auth = getAuth()
		const user = auth.currentUser
		if (!user) return
		const db = getFirestore()
		const userDoc = doc(db, 'users', user.uid)
		let docSnap
		try {
			docSnap = await getDoc(userDoc)
		} catch (error) {
			// Нет сети и т.п.: прогресс не загружен, значит и сохранять его нельзя — иначе затрём базу пустым
			console.error('learningStore: load failed', error)
			return
		}
		// Повторная загрузка того же пользователя не должна терять то, что ещё не успели сохранить
		const isSameUser = loadedUid.value === user.uid
		const localWords = isSameUser ? words.value : []
		const localLearnedWords = isSameUser ? learnedWords.value : []
		if (docSnap.exists()) {
			const data = docSnap.data()
			if (!data.expRecovered && data.questProgress) {
				let totalRecoveredExp = 0;
				for (const key in data.questProgress) {
					if (data.questProgress[key].completed === true) {
						totalRecoveredExp += 10;
					}
				}
				if (totalRecoveredExp > 0) {
					data.exp = (data.exp || 0) + totalRecoveredExp;
					await updateDoc(userDoc, { exp: data.exp, expRecovered: true });
				}
			}
			words.value = mergeWordLists(data.words || [], localWords)
			learnedWords.value = mergeLearnedWords(data.learnedWords || [], localLearnedWords)
			wrongAnswers.value = data.wrongAnswers || []
			selectedTopics.value = data.selectedTopics || []
			selectedWords.value = data.selectedWords || []
			totalEarnedPoints.value = data.totalEarnedPoints || 0
			articlesSpentForAchievement.value = data.articlesSpentForAchievement || 0
			points.value = data.points || 0
			exp.value = data.exp || 0
			isLeveling.value = data.isLeveling ?? 0
			currentIndex.value = data.currentIndex || 0
			currentModeIndex.value = data.currentModeIndex || 0
			gotPremiumBonus.value = data.gotPremiumBonus || false
			learningLang.value = data.learningLang || 'de'
			bestStreakAnyMode.value = data.bestStreakAnyMode || 0
			bestStreakEasyArticle.value = data.bestStreakEasyArticle || 0
		} else if (!isSameUser) {
			// Документа ещё нет: начинаем с чистого листа, а не с прогресса прошлого аккаунта на этом устройстве
			words.value = []
			learnedWords.value = []
		}

		loadedUid.value = user.uid
		isLoaded.value = true
		const prevExp = exp.value
		const prevLvl = isLeveling.value
		handleLeveling()
		const isMigrated = migrateToWordLevels()
		if (isMigrated || exp.value !== prevExp || isLeveling.value !== prevLvl) {
			await saveToFirebase()
		}
	}

	const addPoints = async (amount = 1) => {
		const count = Number(amount) || 1
		points.value = Number(points.value || 0) + count
		totalEarnedPoints.value = Number(totalEarnedPoints.value || 0) + count

		try {
			daily.addPoints(count)
		} catch (e) {}

		await saveToFirebase()
	}

	const getUserDocRef = () => {
		const user = getAuth().currentUser
		if (!user) return null
		return doc(db, 'users', user.uid)
	}

	// replaceWords: true — записать слова как есть, без объединения с базой (только для намеренного сброса)
	const saveToFirebase = async ({replaceWords = false} = {}) => {
		const userDoc = getUserDocRef()
		if (!userDoc) return
		// Прогресс этого пользователя ещё не загружен: в памяти пусто или чужие данные. Не пишем
		if (!isLoaded.value || loadedUid.value !== getAuth().currentUser?.uid) {
			console.warn('learningStore: save skipped, progress is not loaded')
			return
		}
		if (!replaceWords) {
			try {
				await saveWithServerWords(userDoc)
				return
			} catch (error) {
				// Транзакция не работает без сети. Прогресс загружен, так что пишем его как есть:
				// setDoc без сети встаёт в очередь и уйдёт, когда сеть появится
				console.warn('learningStore: merge save failed, saving local state', error)
			}
		}
		await setDoc(userDoc, getSavePayload(), {merge: true})
	}

	// Записать прогресс, добавив к словам в памяти слова из базы, которых в памяти нет
	const saveWithServerWords = async (userDoc) => {
		const {mergedWords, mergedLearnedWords} = await runTransaction(db, async transaction => {
			const snap = await transaction.get(userDoc)
			const data = snap.exists() ? snap.data() : {}
			const merged = {
				mergedWords: mergeWordLists(words.value, data.words),
				mergedLearnedWords: mergeLearnedWords(learnedWords.value, data.learnedWords)
			}
			transaction.set(userDoc, {...getSavePayload(), words: merged.mergedWords, learnedWords: merged.mergedLearnedWords}, {merge: true})
			return merged
		})
		// Подтягиваем в память слова, пришедшие из базы (только если их стало больше)
		if (mergedWords.length > words.value.length) words.value = mergedWords
		if (mergedLearnedWords.length > learnedWords.value.length) learnedWords.value = mergedLearnedWords
	}

	const getSavePayload = () => {
		return {
			words: words.value,
			learnedWords: learnedWords.value,
			wrongAnswers: wrongAnswers.value,
			selectedTopics: selectedTopics.value,
			selectedWords: selectedWords.value,
			points: points.value,
			totalEarnedPoints: totalEarnedPoints.value,
			articlesSpentForAchievement: articlesSpentForAchievement.value,
			exp: exp.value,
			isLeveling: isLeveling.value,
			currentIndex: currentIndex.value,
			currentModeIndex: currentModeIndex.value,
			gotPremiumBonus: gotPremiumBonus.value,
			learningLang: learningLang.value,
			bestStreakAnyMode: bestStreakAnyMode.value,
			bestStreakEasyArticle: bestStreakEasyArticle.value
		}
	}

	const syncSelectedWordsProgress = () => {
		selectedWords.value = selectedWords.value.map(sw => {
			const full = findByKey(words.value, sw.de, keyTopic(sw.topic))
			if (full?.progress) sw.progress = full.progress
			return sw
		})
	}

	const clearAll = async () => {
		words.value = []
		learnedWords.value = []
		wrongAnswers.value = []
		selectedTopics.value = []
		selectedWords.value = []
		points.value = 0
		exp.value = 0
		totalEarnedPoints.value = 0
		articlesSpentForAchievement.value = 0
		isLeveling.value = 0
		currentIndex.value = 0
		currentModeIndex.value = 0
		bestStreakAnyMode.value = 0
		bestStreakEasyArticle.value = 0
		learningLang.value = 'de'
		await saveToFirebase({replaceWords: true})
	}

	return {
		words,
		learnedWords,
		wrongAnswers,
		selectedTopics,
		selectedWords,
		points,
		exp,
		totalEarnedPoints,
		isLeveling,
		currentIndex,
		currentModeIndex,
		topicStats,
		articlesSpentForAchievement,
		isLoaded,
		learningLang,
		handleLeveling,
		markProgress,
		markAsLearned,
		setSelectedTopics,
		setSelectedWords,
		addWrongAnswers,
		clearProgress,
		syncSelectedWordsProgress,
		loadFromFirebase,
		saveToFirebase,
		clearAll,
		addWordsToGlobal,
		bestStreakAnyMode,
		bestStreakEasyArticle,
		recordAnswerResult,
		addPoints,
		passWordMode,
		applyReviewAnswer,
		markTaskPassed,
		getDueWords,
		getWordEntry,
		rewardCorrectAnswer
	}
})