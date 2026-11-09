import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { regions } from '~/utils/regions.js'

export const PART_SIZE = 10

const regionOrder = Object.values(regions).flat().map(region => region.id)

// фразы с «…» и «/» — шаблоны, а слова из 1–2 букв («du», «es») диктовать бессмысленно
function isDictable(text) {
	if (!text || /[…\/]|\.\.\./.test(text)) return false
	return text.includes(' ') || text.replace(/[^\p{L}]/gu, '').length > 2
}

function sameKey(text) {
	return text.toLowerCase().replace(/[^\p{L}\s]/gu, '').replace(/\s+/g, ' ').trim()
}

// новые фразы квеста: словарь и предложения из заданий «собери предложение»
function questPhrases(quest) {
	const phrases = []
	const seen = new Set()
	const add = (phrase) => {
		const key = sameKey(phrase.word)
		if (!isDictable(phrase.word) || seen.has(key)) return
		seen.add(key)
		phrases.push(phrase)
	}
	;(quest.vocabulary || []).forEach(item => add({ ...item }))
	;(quest.tasks || [])
		.filter(task => task.type === 'reorder' && task.correctOrder?.length > 1)
		.forEach(task => add({ word: task.correctOrder.join(' '), translationKey: task.question }))
	// сначала фразы, потом отдельные слова
	return phrases.sort((a, b) => Number(b.word.includes(' ')) - Number(a.word.includes(' ')))
}

/**
 * Каждая часть — ровно PART_SIZE фраз: новые фразы своего квеста,
 * а недостающее — повторение пройденного (сначала ближайшие квесты, затем более ранние).
 * Выбор не случайный, чтобы прогресс по фразам не сбивался между заходами.
 */
function buildParts(quests, earlierPhrases) {
	const learned = [...earlierPhrases]
	return quests.map((quest, questIndex) => {
		const own = questPhrases(quest)
		const items = own.slice(0, PART_SIZE)
		const used = new Set(items.map(item => sameKey(item.word)))

		// самой первой части курса повторять нечего — добираем из следующего квеста
		if (!learned.length && items.length < PART_SIZE && quests[questIndex + 1]) {
			for (const phrase of questPhrases(quests[questIndex + 1])) {
				if (items.length >= PART_SIZE) break
				if (used.has(sameKey(phrase.word))) continue
				used.add(sameKey(phrase.word))
				items.push(phrase)
			}
		}

		// повторение по кругу: по одной фразе из каждого предыдущего квеста, от ближнего к дальнему
		const pools = [...learned].reverse().map(list => [...list])
		while (items.length < PART_SIZE && pools.some(pool => pool.length)) {
			for (const pool of pools) {
				if (items.length >= PART_SIZE) break
				while (pool.length) {
					const phrase = pool.shift()
					const key = sameKey(phrase.word)
					if (used.has(key)) continue
					used.add(key)
					items.push({ ...phrase, review: true })
					break
				}
			}
		}

		learned.push(own)
		return {
			id: quest.questId,
			title: quest.title,
			items: items.map((item, index) => ({ ...item, id: `${quest.questId}-${index}` }))
		}
	})
}

export const useDictationStore = defineStore('dictation', () => {
	const regionParts = ref({})
	const currentRegionId = ref(null)
	const currentQuestId = ref(null)
	const loading = ref(false)
	const userProgress = ref({})
	const db = getFirestore()

	async function loadQuests(regionId) {
		try {
			return await $fetch(`/quests/quests-${regionId}.json`)
		} catch (error) {
			console.error(error)
			return []
		}
	}

	// диктант строится из квестов региона: один квест — одна часть.
	// Повторение для первых квестов региона берётся из предыдущего региона
	async function fetchRegion(regionId) {
		if (regionParts.value[regionId]) return regionParts.value[regionId]
		loading.value = true
		try {
			const previousId = regionOrder[regionOrder.indexOf(regionId) - 1]
			const [quests, previousQuests] = await Promise.all([
				loadQuests(regionId),
				previousId ? loadQuests(previousId) : []
			])
			const earlierPhrases = previousQuests.map(questPhrases)
			regionParts.value[regionId] = buildParts(quests, earlierPhrases).filter(part => part.items.length)
		} finally {
			loading.value = false
		}
		return regionParts.value[regionId]
	}

	function setCurrent(regionId, questId) {
		currentRegionId.value = regionId
		currentQuestId.value = questId
	}

	async function loadUserProgress() {
		const auth = getAuth()
		if (!auth.currentUser) return
		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'dictation', 'progress')
			const snap = await getDoc(docRef)
			if (snap.exists()) {
				userProgress.value = snap.data()
			}
		} catch (error) {
			console.error(error)
		}
	}

	async function saveProgress(regionId, newResults) {
		if (!userProgress.value[regionId]) {
			userProgress.value[regionId] = {}
		}

		let updated = false
		for (const [itemId, status] of Object.entries(newResults)) {
			if (userProgress.value[regionId][itemId] !== 'success') {
				userProgress.value[regionId][itemId] = status
				updated = true
			}
		}

		if (!updated) return

		const auth = getAuth()
		if (!auth.currentUser) return

		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'dictation', 'progress')
			const pureData = JSON.parse(JSON.stringify(userProgress.value))
			await setDoc(docRef, pureData, { merge: true })
		} catch (error) {
			console.error(error)
		}
	}

	// сундук в конце земли открывается один раз
	function isChestClaimed(regionId) {
		return Boolean(userProgress.value.landChests?.[regionId])
	}

	async function claimChest(regionId) {
		if (isChestClaimed(regionId)) return false
		userProgress.value.landChests = { ...(userProgress.value.landChests || {}), [regionId]: true }

		const auth = getAuth()
		if (!auth.currentUser) return true
		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'dictation', 'progress')
			await setDoc(docRef, { landChests: { [regionId]: true } }, { merge: true })
		} catch (error) {
			console.error(error)
		}
		return true
	}

	return {
		regionParts,
		currentRegionId,
		currentQuestId,
		loading,
		userProgress,
		fetchRegion,
		setCurrent,
		loadUserProgress,
		saveProgress,
		isChestClaimed,
		claimChest
	}
})
