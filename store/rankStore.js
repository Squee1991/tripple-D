import {defineStore} from 'pinia'
import {ref} from 'vue'

import LevelOneSilver from 'assets/images/rank-icons/level-1/silber.png'
import LevelOneGold from 'assets/images/rank-icons/level-1/gold.png'
import LevelOneBronze from 'assets/images/rank-icons/level-1/bronze.png'

import levelTwoSilver from 'assets/images/rank-icons/level-2/Level2Silver.png'
import levelTwoBronze from 'assets/images/rank-icons/level-2/Level2Bronze.png'
import levelTwoGold from 'assets/images/rank-icons/level-2/Level2Gold.png'

import LevelThreeSilver from 'assets/images/rank-icons/level-3/SilverPank.png'
import LevelThreeBronze from 'assets/images/rank-icons/level-3/SilverPank.png'
import LevelThreeGold from 'assets/images/rank-icons/level-3/SilverPank.png'

import LevelFourSilver from 'assets/images/rank-icons/level-4/Level4Silver.png'
import LevelFourBronze from 'assets/images/rank-icons/level-4/Level4Bronze.png'
import LevelFourGold from 'assets/images/rank-icons/level-4/Level4Gold.png'

import LevelFiveSilver from 'assets/images/rank-icons/level-5/Level5Silver.png'
import LevelFiveBronze from 'assets/images/rank-icons/level-5/Level5Bronze.png'
import LevelFiveGold from 'assets/images/rank-icons/level-5/Level5Gold.png'

import LevelSixSilver from 'assets/images/rank-icons/level-6/Level6Silver.png'
import LevelSixBronze from 'assets/images/rank-icons/level-6/Level6Bronze.png'
import LevelSixGold from 'assets/images/rank-icons/level-6/Level6Gold.png'

import LevelSevenSilver from 'assets/images/rank-icons/level-7/Level7Silver.png'
import LevelSevenBronze from 'assets/images/rank-icons/level-7/Level7Bronze.png'
import LevelSevenGold from 'assets/images/rank-icons/level-7/Level7Gold.png'

import { userAuthStore} from "/store/authStore.js";
export const useRankUserStore = defineStore('rankUserStore', () => {
   const authStore = userAuthStore()
	const ranksData = [
		{
			title: 'СТУДЕНТ',
			icons: [
				{icon: LevelOneSilver,},
				{icon: LevelOneBronze,},
				{icon: LevelOneGold}
			],
			levels: [{hats: 1}, {hats: 7}, {hats: 14, bonus: 'Скидка 5%'}
			]
		},
		{
			title: 'ИССЛЕДОВАТЕЛЬ',
			icons: [
				{icon: levelTwoSilver,},
				{icon: levelTwoBronze,},
				{icon: levelTwoGold}
			]
			, levels:
				[{hats: 25}, {hats: 40}, {hats: 55, bonus: 'Скидка 10%'}]
		},
		{title: 'МАГИСТР',
			icons: [
				{icon: LevelThreeSilver,},
				{icon: LevelThreeBronze,},
				{icon: LevelThreeGold}
			],
			levels: [{hats: 70}, {hats: 85}, {hats: 100, bonus: 'Скидка 10%'}]},
		{title: 'ДОКТОР',
			icons: [
				{icon: LevelFourSilver,},
				{icon: LevelFourBronze,},
				{icon: LevelFourGold}
			],
			levels: [{hats: 120}, {hats: 135}, {hats: 150, bonus: 'Скидка 15%'}]},
		{title: 'ПРОФЕССОР',
			icons: [
				{icon: LevelFiveSilver,},
				{icon: LevelFiveBronze,},
				{icon: LevelFiveGold}
			],
			levels: [{hats: 170}, {hats: 190}, {hats: 210, bonus: 'Скидка 20%'}]},
		{title: 'ДЕКАН',
			icons: [
				{icon: LevelSixSilver,},
				{icon: LevelSixBronze,},
				{icon: LevelSixGold}
			],
			levels: [{hats: 230}, {hats: 250}, {hats: 270, bonus: 'Месяц премиум'}]},
		{title: 'РЕКТОР',
			icons: [
				{icon: LevelSevenSilver,},
				{icon: LevelSevenBronze,},
				{icon: LevelSevenGold}
			],
			levels: [{hats: 300}, {hats: 330}, {hats: 365, bonus: ''}]}
	]
	const totalHats = ref(0)
	const isOverlayVisible = ref(false)
	const isStarReady = ref(false)
	const currentReward = ref({icon: '', title: '', levelIndex: 0})
	const checkRewardUI = () => {
		const currentHats = authStore.totalHats
		ranksData.forEach((rankGroup) => {
			rankGroup.levels.forEach((level, levelIndex) => {
				if (currentHats === level.hats) {
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
		checkRewardUI
	}
})