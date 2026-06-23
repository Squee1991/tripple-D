import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { userAuthStore } from './authStore'

export const useGalaxyStore = defineStore('galaxy', () => {
	const db = getFirestore()
	const authStore = userAuthStore()
	const captainName = ref('Anonymous')
	const balance = ref(0)
	const highScores = ref({})
	const selectedTankId = ref(1)
	const ownedTanks = ref([1])
	const shipBatteries = ref({ 1: { lives: 3, lastRegen: Date.now() } })
	const score = ref(0)
	const activeGalaxyId = ref(null)
	const galaxies = ref([])

	const speedMultiplier = computed(() => {
		let extra = 0
		if (score.value >= 10) extra += 0.1
		if (score.value >= 50) extra += 0.2
		if (score.value >= 100) extra += 0.4
		if (score.value >= 150) extra += 0.6
		if (score.value >= 200) extra += 1
		return extra
	})

	const fallDuration = computed(() => {
		const baseDuration = 8
		return baseDuration / (1 + speedMultiplier.value)
	})

	const getSafeUid = () => {
		const user = getAuth().currentUser
		if (user) return user.uid
		if (authStore.uid) return authStore.uid
		return null
	}

	const checkBatteryRegen = () => {
		if (authStore.isPremium) return
		const now = Date.now()
		const REGEN_MS = 60 * 60 * 1000
		let needsSync = false

		ownedTanks.value.forEach(tankId => {
			if (!shipBatteries.value[tankId]) {
				shipBatteries.value[tankId] = { lives: 3, lastRegen: now }
				needsSync = true
			}

			const battery = shipBatteries.value[tankId]
			if (battery.lives < 3) {
				const timePassed = now - battery.lastRegen
				if (timePassed >= REGEN_MS) {
					const gained = Math.floor(timePassed / REGEN_MS)
					battery.lives = Math.min(3, battery.lives + gained)

					if (battery.lives === 3) {
						battery.lastRegen = now
					} else {
						battery.lastRegen += gained * REGEN_MS
					}
					needsSync = true
				}
			} else {
				battery.lastRegen = now
			}
		})

		if (needsSync) {
			sync({ shipBatteries: shipBatteries.value })
		}
	}

	const initUser = async () => {
		const uid = getSafeUid()
		if (!uid) return

		const userDoc = doc(db, 'users', uid, 'game_data', 'galaxy_stats')
		try {
			const snap = await getDoc(userDoc)
			if (snap.exists()) {
				const data = snap.data()
				captainName.value = data.captainName || authStore.name || 'ПИЛОТ-01'
				balance.value = data.balance || 0
				highScores.value = data.highScores || {}
				selectedTankId.value = data.selectedTankId || 1
				ownedTanks.value = data.ownedTanks || [1]

				if (data.shipBatteries) {
					shipBatteries.value = data.shipBatteries
				} else if (data.batteryLives !== undefined) {
					shipBatteries.value = {}
					ownedTanks.value.forEach(id => {
						shipBatteries.value[id] = {
							lives: data.batteryLives,
							lastRegen: data.lastBatteryRegen || Date.now()
						}
					})
				}

				checkBatteryRegen()
			} else {
				captainName.value = authStore.name || 'Pilot'
				balance.value = 0
				highScores.value = {}
				selectedTankId.value = 1
				ownedTanks.value = [1]
				shipBatteries.value = { 1: { lives: 3, lastRegen: Date.now() } }

				checkBatteryRegen()

				await sync({
					captainName: captainName.value,
					balance: balance.value,
					highScores: highScores.value,
					totalScore: 0,
					selectedTankId: selectedTankId.value,
					ownedTanks: ownedTanks.value,
					shipBatteries: shipBatteries.value
				})
			}
		} catch (e) {
			console.error(e)
		}
	}

	const sync = async (payload) => {
		const uid = getSafeUid()
		if (!uid) return
		try {
			const userDoc = doc(db, 'users', uid, 'game_data', 'galaxy_stats')
			await setDoc(userDoc, payload, { merge: true })
		} catch (e) {}
	}

	const consumeBattery = async () => {
		if (authStore.isPremium) return true
		checkBatteryRegen()
		const tankId = selectedTankId.value
		const battery = shipBatteries.value[tankId]

		if (battery && battery.lives > 0) {
			if (battery.lives === 3) {
				battery.lastRegen = Date.now()
			}
			battery.lives--
			await sync({ shipBatteries: shipBatteries.value })
			return true
		}
		return false
	}

	const currentBattery = computed(() => {
		if (authStore.isPremium) return 3
		checkBatteryRegen()
		return shipBatteries.value[selectedTankId.value]?.lives ?? 0
	})

	const currentBatteryRegen = computed(() => {
		return shipBatteries.value[selectedTankId.value]?.lastRegen || Date.now()
	})

	const setMission = (galaxyId) => {
		activeGalaxyId.value = galaxyId
		score.value = 0
	}

	const updateHighScore = async (galaxyId, finalScore) => {
		const uid = getSafeUid()
		if (!uid) return false
		if (finalScore <= 0) return false

		const currentBest = highScores.value[galaxyId] || 0
		if (finalScore > currentBest) {
			highScores.value[galaxyId] = finalScore
			const totalScore = Object.values(highScores.value).reduce((a, b) => a + b, 0)

			await sync({
				captainName: authStore.name || 'ПИЛОТ-01',
				balance: balance.value,
				highScores: highScores.value,
				totalScore: totalScore,
				selectedTankId: selectedTankId.value,
				ownedTanks: ownedTanks.value
			})
			return true
		}
		return false
	}

	const addArtiks = async (amount) => {
		if (amount <= 0) return
		balance.value += amount
		await sync({ balance: balance.value })
	}

	const setCaptainName = async (newName) => {
		captainName.value = newName
		await sync({ captainName: newName })
	}

	const buyShip = async (ship) => {
		if (balance.value >= ship.price && !ownedTanks.value.includes(ship.id)) {
			balance.value -= ship.price
			ownedTanks.value.push(ship.id)
			shipBatteries.value[ship.id] = { lives: 3, lastRegen: Date.now() }
			await sync({
				balance: balance.value,
				ownedTanks: ownedTanks.value,
				shipBatteries: shipBatteries.value
			})
			return true
		}
		return false
	}

	const selectShip = async (id) => {
		selectedTankId.value = id
		await sync({ selectedTankId: id })
	}

	const fetchGalaxies = async () => {
		if (galaxies.value.length > 0) return
		try {
			const res = await fetch('/galaxy-data/galaxies.json')
			const data = await res.json()
			galaxies.value = data.galaxies
		} catch (error) {}
	}

	const tankList = ref([
		{id: 1, name: 'FALKE-01', img: '/images/ships/spaceship.svg', price: 0, power: 30, speed: 95},
		{id: 2, name: 'NOVA-02', img: '/images/ships/spaceship-2.svg', price: 300, power: 55, speed: 75},
		{id: 3, name: 'STERN-03', img: '/images/ships/spaceship-3.svg', price: 300, power: 80, speed: 50},
		{id: 4, name: 'KOMET-04', img: '/images/ships/spaceship-4.svg', price: 300, power: 90, speed: 35},
		{id: 5, name: 'VOID-X', img: '/images/ships/spaceship-5.svg', price: 300, power: 100, speed: 15},
		{id: 6, name: 'VOID-Z', img: '/images/ships/spaceship-6.svg', price: 300, power: 100, speed: 15},
		{id: 7, name: 'VOID-A', img: '/images/ships/spaceship-7.svg', price: 300, power: 100, speed: 15},
		{id: 8, name: 'VOID-B', img: '/images/ships/spaceship-8.svg', price: 300, power: 100, speed: 15},
	])

	const activeShip = computed(() => {
		return tankList.value.find(t => t.id === selectedTankId.value) || tankList.value[0]
	})

	const currentGalaxy = computed(() => {
		return galaxies.value.find(g => g.id === activeGalaxyId.value)
	})

	return {
		captainName, balance, highScores, selectedTankId, ownedTanks,
		score, galaxies, activeGalaxyId, tankList, shipBatteries,
		speedMultiplier, fallDuration, activeShip, currentGalaxy, currentBattery, currentBatteryRegen,
		initUser, setCaptainName, updateHighScore, buyShip, selectShip, fetchGalaxies, setMission, sync, addArtiks, consumeBattery, checkBatteryRegen
	}
})