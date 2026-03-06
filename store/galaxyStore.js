import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGalaxyStore = defineStore('galaxy', () => {
	const score = ref(0)
	const galaxies = ref([])
	const activeGalaxyId = ref(null)

	const fetchGalaxies = async () => {
		if (galaxies.value.length > 0) return
		try {
			const res = await fetch('/galaxy-data/galaxies.json')
			const data = await res.json()
			galaxies.value = data.galaxies
		} catch (error) {
			console.error('Ошибка загрузки базы данных:', error)
		}
	}

	const setMission = (galaxyId) => { activeGalaxyId.value = galaxyId }
	const currentGalaxy = computed(() => galaxies.value.find(g => g.id === activeGalaxyId.value))
	const currentQuestions = computed(() => currentGalaxy.value?.questions || [])
	const speedMultiplier = computed(() => {
		let extra = 0
		if (score.value >= 10) extra += 0.2
		if (score.value >= 20) extra += 0.4
		if (score.value >= 30) extra += 0.7
		if (score.value >= 40) extra += 1
		return extra
	})

	const fallDuration = computed(() => {
		const baseDuration = 8
		return baseDuration / (1 + speedMultiplier.value)
	})

	const balance = ref(Number(localStorage.getItem('balance')) || 3500)
	const selectedTankId = ref(Number(localStorage.getItem('selectedTank')) || 1)
	const ownedTanks = ref(JSON.parse(localStorage.getItem('ownedTanks') || '[1]'))

	const tankList = ref([
		{id: 1, name: 'FALKE-01', img: '/images/ships/spaceship.svg', price: 0, power: 30, speed: 95},
		{id: 2, name: 'NOVA-02', img: '/images/ships/spaceship-2.svg', price: 600, power: 55, speed: 75},
		{id: 3, name: 'STERN-03', img: '/images/ships/spaceship-3.svg', price: 1500, power: 80, speed: 50},
		{id: 4, name: 'KOMET-04', img: '/images/ships/spaceship-4.svg', price: 3000, power: 90, speed: 35},
		{id: 5, name: 'VOID-X', img: '/images/ships/spaceship-5.svg', price: 6000, power: 100, speed: 15},
	])

	const activeShip = computed(() => {
		return tankList.value.find(t => t.id === selectedTankId.value) || tankList.value[0]
	})

	const selectShip = (id) => {
		selectedTankId.value = id
		localStorage.setItem('selectedTank', id)
	}

	const buyShip = (ship) => {
		if (balance.value >= ship.price && !ownedTanks.value.includes(ship.id)) {
			balance.value -= ship.price
			ownedTanks.value.push(ship.id)
			savePlayerData()
			return true
		}
		return false
	}

	const savePlayerData = () => {
		localStorage.setItem('balance', balance.value)
		localStorage.setItem('ownedTanks', JSON.stringify(ownedTanks.value))
	}

	return {
		score, galaxies, fetchGalaxies, setMission, currentGalaxy, currentQuestions,
		speedMultiplier, fallDuration,
		balance, selectedTankId, ownedTanks, tankList, activeShip, selectShip, buyShip
	}
})