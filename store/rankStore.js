import { defineStore } from 'pinia'
import { ref } from 'vue'
import RankIcon from '../assets/images/rank-icons/trophy (4).svg'
export const useRankUserStore = defineStore('rankUserStore', () => {
	const ranksData = [
		{ title: 'СТУДЕНТ', icon: RankIcon, levels: [{ hats: 1 }, { hats: 7 }, { hats: 14, bonus: 'Скидка 5%' }] },
		{ title: 'ИССЛЕДОВАТЕЛЬ', icon: RankIcon, levels: [{ hats: 30 }, { hats: 45 }, { hats: 60, bonus: 'Скидка 10%' }] },
		{ title: 'МАГИСТР', icon: RankIcon, levels: [{ hats: 90 }, { hats: 110 }, { hats: 130, bonus: 'Скидка 10%' }] },
		{ title: 'ДОКТОР', icon: RankIcon, levels: [{ hats: 160 }, { hats: 185 }, { hats: 210, bonus: 'Скидка 15%' }] },
		{ title: 'ПРОФЕССОР', icon: RankIcon, levels: [{ hats: 240 }, { hats: 270 }, { hats: 300, bonus: 'Скидка 20%' }] },
		{ title: 'ДЕКАН', icon: RankIcon, levels: [{ hats: 315 }, { hats: 330 }, { hats: 345, bonus: 'Скидка 25%' }] },
		{ title: 'РЕКТОР', icon: RankIcon, levels: [{ hats: 355 }, { hats: 360 }, { hats: 365, bonus: 'Месяц премиум' }] }
	]

	const totalHats = ref(0)
	const isOverlayVisible = ref(false)
	const isStarReady = ref(false)
	const currentReward = ref({ icon: '', title: '', levelIndex: 0 })

	const addHat = () => {
		totalHats.value++
		console.log(totalHats.value)
		ranksData.forEach(rank => {
			rank.levels.forEach((lvl, index) => {
				if (totalHats.value === lvl.hats) {
					currentReward.value = {
						icon: rank.icon,
						title: rank.title,
						levelIndex: index
					}
					isStarReady.value = false
					isOverlayVisible.value = true
					setTimeout(() => {
						isStarReady.value = true
					}, 800)
				}
			})
		})
	}

	return {
		ranksData,
		totalHats,
		isOverlayVisible,
		isStarReady,
		currentReward,
		addHat
	}
})