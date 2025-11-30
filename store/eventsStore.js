import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {getFirestore, doc, getDoc, setDoc, increment} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

export const useEventSessionStore = defineStore('eventSession', () => {
	const db = getFirestore()
	const auth = getAuth()

	const eventId = ref('')
	const questId = ref('')
	const stepIndex = ref(0)
	const score = ref(0)
	const finished = ref(false)
	const isLoading = ref(false)
	const isSnowEnabled = ref(false)
	const shopItems = ref({})

	const events = ref([
		{id: 'winter', start: '12-24 00:00', end: '01-02 23:59'},
		{id: 'valentine', start: '02-14 00:00', end: '02-16 23:59'},
		{id: 'april', start: '04-01 00:00', end: '04-01 23:59'},
		{id: 'pumpkin', start: '10-28 00:00', end: '10-31 23:59'},
	])

	const uidOrThrow = () => {
		const uid = auth.currentUser?.uid
		if (!uid) throw new Error('EventStore: User not auth')
		return uid
	}

	const getWinterDocRef = () => {
		try {
			const uid = uidOrThrow()
			return doc(db, 'users', uid, 'eventSessions', 'winter')
		} catch (e) {
			return null
		}
	}

	const getEventProgressDocRef = () => {
		try {
			const uid = uidOrThrow()
			if (!eventId.value) return null
			return doc(db, 'users', uid, 'eventSessions', eventId.value)
		} catch (error) {
			console.error(error.message)
			return null
		}
	}

	const isSnowPurchased = computed(() => {
		const items = shopItems.value || {}
		return !!(items['snowFall'] || items['snowfall'])
	})

	const loadGlobalWinterSettings = async () => {
		const ref = getWinterDocRef()
		if (!ref) return

		try {
			const snap = await getDoc(ref)
			if (snap.exists()) {
				const data = snap.data()
				shopItems.value = data.shopItems || {}

				const hasBought = shopItems.value['snowFall'] || shopItems.value['snowfall']

				if (hasBought) {
					isSnowEnabled.value = (data.isSnowEnabled === true)
				} else {
					isSnowEnabled.value = false
				}
			} else {
				isSnowEnabled.value = false
			}
		} catch (e) {
		}
	}

	const setSnowFallEnabled = async (value) => {
		if (value === true && !isSnowPurchased.value) return

		isSnowEnabled.value = value

		const ref = getWinterDocRef()
		if (!ref) return
		try {
			await setDoc(ref, {isSnowEnabled: value}, {merge: true})
		} catch (error) {
		}
	}

	const loadEventProgress = async (id) => {
		eventId.value = String(id || '')
		const eventDocRef = getEventProgressDocRef()
		if (!eventDocRef) return null
		try {
			const docSnap = await getDoc(eventDocRef)
			if (docSnap.exists()) {
				const data = docSnap.data()
				shopItems.value = data.shopItems || {}

				if (id === 'winter') {
					const hasBought = shopItems.value['snowFall'] || shopItems.value['snowfall']
					if (hasBought) {
						isSnowEnabled.value = (data.isSnowEnabled === true)
					} else {
						isSnowEnabled.value = false
					}
				}
				return data
			}
			return null
		} catch (error) {
			return null
		}
	}

	const saveMainProgress = async (dataToSave) => {
		const eventDocRef = getEventProgressDocRef()
		if (!eventDocRef) return

		if (dataToSave.shopItems) {
			shopItems.value = {...shopItems.value, ...dataToSave.shopItems}
		}

		try {
			await setDoc(eventDocRef, dataToSave, {merge: true})
		} catch (error) {
		}
	}

	const start = async (id, qid) => {
		isLoading.value = true
		eventId.value = String(id || '')
		questId.value = String(qid || '')
		try {
			uidOrThrow()
		} catch (error) {
			isLoading.value = false;
			return
		}
		const eventDocRef = getEventProgressDocRef()
		if (eventDocRef) {
			try {
				const docSnap = await getDoc(eventDocRef)
				let isAlreadyFinished = false
				if (docSnap.exists()) {
					const questProgress = docSnap.data().quests?.[questId.value]
					if (questProgress && questProgress.finished) isAlreadyFinished = true
				}
				if (isAlreadyFinished) {
					stepIndex.value = 0;
					score.value = 0;
					finished.value = true
				} else {
					stepIndex.value = 0;
					score.value = 0;
					finished.value = false
				}
				await setDoc(eventDocRef, {lastActiveQuestId: questId.value}, {merge: true})
			} catch (error) {
			}
		}
		isLoading.value = false
	}

	const restoreIfPossible = async (id) => {
		isLoading.value = true;
		eventId.value = String(id || '');
		try {
			uidOrThrow()
		} catch (error) {
			isLoading.value = false;
			return false
		}
		const eventDocRef = getEventProgressDocRef();
		if (!eventDocRef) {
			isLoading.value = false;
			return false
		}
		try {
			const docSnap = await getDoc(eventDocRef);
			if (!docSnap.exists()) {
				isLoading.value = false;
				return false
			}
			const eventData = docSnap.data();
			const lastQuestId = eventData.lastActiveQuestId
			if (!lastQuestId) {
				isLoading.value = false;
				return false
			}
			questId.value = lastQuestId;
			const questProgress = eventData.quests?.[lastQuestId]
			if (questProgress && !questProgress.finished) {
				stepIndex.value = questProgress.stepIndex || 0;
				score.value = questProgress.score || 0;
				finished.value = false
			} else if (questProgress && questProgress.finished) {
				stepIndex.value = 0;
				score.value = 0;
				finished.value = true
			} else {
				stepIndex.value = 0;
				score.value = 0;
				finished.value = false
			}
			isLoading.value = false;
			return true
		} catch (error) {
			isLoading.value = false;
			return false
		}
	}

	const saveCurrentQuestProgress = async () => {
		if (finished.value) return
		const eventDocRef = getEventProgressDocRef()
		if (!eventDocRef || !questId.value) return
		try {
			await setDoc(eventDocRef, {
				quests: {[questId.value]: {stepIndex: stepIndex.value, score: score.value, finished: false}}
			}, {merge: true})
		} catch (error) {
		}
	}

	const next = (totalSteps) => {
		if (stepIndex.value + 1 < totalSteps) {
			stepIndex.value++;
			saveCurrentQuestProgress()
		}
	}
	const prev = () => {
		if (stepIndex.value > 0) stepIndex.value--
	}
	const addScore = (number = 1) => {
		score.value += number
	}
	const finishQuest = () => {
		if (finished.value) return;
		finished.value = true
	}

	const awardQuestCompletion = async (questId, rewardData) => {
		const eventDocRef = getEventProgressDocRef()
		if (!eventDocRef) return
		try {
			await setDoc(eventDocRef, {
				coins: increment(rewardData.coins || 0),
				reputationPoints: increment(rewardData.rep || 0),
				quests: {[questId]: {finished: true, score: score.value, stepIndex: stepIndex.value}}
			}, {merge: true})
		} catch (error) {
		}
	}

	const resetAllForEvent = () => {
		eventId.value = '';
		questId.value = '';
		stepIndex.value = 0;
		score.value = 0;
		finished.value = false
	}

	const resetEventProgress = async (id) => {
		eventId.value = String(id || '');
		const eventDocRef = getEventProgressDocRef();
		if (!eventDocRef) return
		try {
			await setDoc(eventDocRef, {
				quests: {},
				lastActiveQuestId: null,
				coins: 0,
				reputationPoints: 0,
				shopItems: {}
			}, {merge: false})
		} catch (error) {
		}
	}

	return {
		eventId, questId, stepIndex, score, finished, isLoading,
		isSnowEnabled, shopItems, events,
		isSnowPurchased, loadGlobalWinterSettings, setSnowFallEnabled,
		start, restoreIfPossible, next, prev, addScore, finishQuest,
		resetAllForEvent, loadEventProgress, saveMainProgress,
		resetEventProgress, awardQuestCompletion
	}
})