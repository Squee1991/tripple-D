import {defineStore} from 'pinia'
import {ref} from 'vue'

import { userAuthStore} from "/store/authStore.js";
import { userlangStore } from "/store/learningStore.js";
export const useRankUserStore = defineStore('rankUserStore', () => {
   const authStore = userAuthStore()
	const langStore = userlangStore()
	const ranksData = [
		{
			title: 'Новичок',
			icons: [
				{ icon: '/images/rank-icons/level-1/silber.png' },
				{ icon: '/images/rank-icons/level-1/bronze.png' },
				{ icon: '/images/rank-icons/level-1/gold.png' }
			],
			levels: [
				{ hats: 6, bonus: 5 },
				{ hats: 21, bonus: 5 },
				{ hats: 42, bonus: 5 }
			]
		},
		{
			title: 'Шустрик',
			icons: [
				{ icon: '/images/rank-icons/level-2/Level2Silver.png' },
				{ icon: '/images/rank-icons/level-2/Level2Bronze.png' },
				{ icon: '/images/rank-icons/level-2/Level2Gold.png' }
			],
			levels: [
				{ hats: 60, bonus: 5 },
				{ hats: 70, bonus: 10 },
				{ hats: 90, bonus: 'Скидка 5%' }
			]
		},
		{
			title: 'Скаут',
			icons: [
				{ icon: '/images/rank-icons/level-3/SilverPank.png' },
				{ icon: '/images/rank-icons/level-3/SilverPank.png' },
				{ icon: '/images/rank-icons/level-3/SilverPank.png' }
			],
			levels: [
				{ hats: 110, bonus: 10 },
				{ hats: 130, bonus: 10 },
				{ hats: 150, bonus: 10 }
			]
		},
		{
			title: 'Панк-ёж',
			icons: [
				{ icon: '/images/rank-icons/level-4/Level4Silver.png' },
				{ icon: '/images/rank-icons/level-4/Level4Bronze.png' },
				{ icon: '/images/rank-icons/level-4/Level4Gold.png' }
			],
			levels: [
				{ hats: 170, bonus: 10 },
				{ hats: 190, bonus: 15 },
				{ hats: 210, bonus: 'Скидка 10%' }
			]
		},
		{
			title: 'Капитан',
			icons: [
				{ icon: '/images/rank-icons/level-5/Level5Silver.png' },
				{ icon: '/images/rank-icons/level-5/Level5Bronze.png' },
				{ icon: '/images/rank-icons/level-5/Level5Gold.png' }
			],
			levels: [
				{ hats: 230, bonus: 15 },
				{ hats: 270, bonus: 15 },
				{ hats: 300, bonus: 15 }
			]
		},
		{
			title: 'Страж',
			icons: [
				{ icon: '/images/rank-icons/level-6/Level6Silver.png' },
				{ icon: '/images/rank-icons/level-6/Level6Bronze.png' },
				{ icon: '/images/rank-icons/level-6/Level6Gold.png' }
			],
			levels: [
				{ hats: 330, bonus: 20 },
				{ hats: 360, bonus: 20 },
				{ hats: 400, bonus: 'Скидка 15%' }
			]
		},
		{
			title: 'Легенда',
			icons: [
				{ icon: '/images/rank-icons/level-7/Level7Silver.png' },
				{ icon: '/images/rank-icons/level-7/Level7Bronze.png' },
				{ icon: '/images/rank-icons/level-7/Level7Gold.png' }
			],
			levels: [
				{ hats: 420, bonus: 20 },
				{ hats: 450, bonus: 20 },
				{ hats: 500, bonus: '' }
			]
		}
	]
	const totalHats = ref(0)
	const isOverlayVisible = ref(false)
	const isStarReady = ref(false)
	const currentReward = ref({icon: '', title: '', levelIndex: 0})

	const getRankTitleByHats = (hatsNeeded) => {
		for (const group of ranksData) {
			for (const level of group.levels) {
				if (level.hats === hatsNeeded) {
					return group.title
				}
			}
		}
		return 'РАНГ'
	}

	const checkRewardUI = async () => {
		const currentHats = authStore.totalHats
		ranksData.forEach((rankGroup) => {
			rankGroup.levels.forEach((level, levelIndex) => {
				if (currentHats === level.hats) {
					if (typeof level.bonus === 'number') {

						langStore.points += level.bonus
						if (typeof langStore.saveToFirebase === 'function') {
							langStore.saveToFirebase()
						}
					}
					const rewardIcon = rankGroup.icons ? rankGroup.icons[levelIndex].icon : rankGroup.icon
					currentReward.value = {
						icon: rewardIcon,
						title: rankGroup.title,
						levelIndex: levelIndex
					}
					isStarReady.value = false
					isOverlayVisible.value = true
					setTimeout(() => { isStarReady.value = true }, 800)
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
		checkRewardUI,
		getRankTitleByHats
	}
})