import {defineStore} from 'pinia'
import {ref} from 'vue'
import RankIcon from '../assets/images/rank-icons/trophy (4).svg'

import Silver from 'assets/images/rank-icons/level-1/silber.png'
import Gold from 'assets/images/rank-icons/level-1/gold.png'
import Bronze from 'assets/images/rank-icons/level-1/bronze.png'

import levelTwoSilver from 'assets/images/rank-icons/level-2/levelTwoSilver.png'
import levelTwoBronze from 'assets/images/rank-icons/level-2/levelTwoBronze.png'
import levelTwoGold from 'assets/images/rank-icons/level-2/levelTwogold.png'

import LevelThreeSilver from 'assets/images/rank-icons/level-3/SilverPank.png'
import LevelThreeBronze from 'assets/images/rank-icons/level-3/SilverPank.png'
import LevelThreeGold from 'assets/images/rank-icons/level-3/SilverPank.png'


import LevelFiveSilver from 'assets/images/rank-icons/level-5/Level4Silver.png'
import LevelFiveBronze from 'assets/images/rank-icons/level-5/Level4Bronze.png'
import LevelFiveGold from 'assets/images/rank-icons/level-5/Level4Gold.png'

import LevelSixSilver from 'assets/images/rank-icons/level-6/Level6Silver.png'
import LevelSixBronze from 'assets/images/rank-icons/level-6/Level6Bronze.png'
import LevelSixGold from 'assets/images/rank-icons/level-6/Level6Gold.png'

import LevelSevenSilver from 'assets/images/rank-icons/level-6/Level6Silver.png'
import LevelSevenBronze from 'assets/images/rank-icons/level-6/Level6Bronze.png'
import LevelSevenGold from 'assets/images/rank-icons/level-6/Level6Gold.png'

import { userAuthStore} from "/store/authStore.js";

export const useRankUserStore = defineStore('rankUserStore', () => {
   const authStore = userAuthStore()
	const ranksData = [
		{
			title: 'СТУДЕНТ',
			icons: [
				{icon: Silver,},
				{icon: Bronze,},
				{icon: Gold}
			],
			levels: [
				{hats: 1},
				{hats: 7},
				{
					hats: 14, bonus: 'Скидка 5%'
				}
			]
		},
		{
			title: 'ИССЛЕДОВАТЕЛЬ',
			icons: [
				{icon: levelTwoSilver,},
				{icon: levelTwoBronze,},
				{icon: levelTwoGold}
			]
			, levels: [{hats: 30}, {hats: 45}, {hats: 60, bonus: 'Скидка 10%'}]
		},
		{title: 'МАГИСТР',
			icons: [
				{icon: LevelThreeSilver,},
				{icon: LevelThreeBronze,},
				{icon: LevelThreeGold}
			],
			levels: [{hats: 90}, {hats: 110}, {hats: 130, bonus: 'Скидка 10%'}]},
		{title: 'ДОКТОР',
			icons: [
				{icon: LevelThreeSilver,},
				{icon: LevelThreeBronze,},
				{icon: LevelThreeGold}
			],
			levels: [{hats: 160}, {hats: 185}, {hats: 210, bonus: 'Скидка 15%'}]},
		{title: 'ПРОФЕССОР',
			icons: [
				{icon: LevelFiveSilver,},
				{icon: LevelFiveBronze,},
				{icon: LevelFiveGold}
			],
			levels: [{hats: 240}, {hats: 270}, {hats: 300, bonus: 'Скидка 20%'}]},
		{title: 'ДЕКАН',
			icons: [
				{icon: LevelSixSilver,},
				{icon: LevelSixBronze,},
				{icon: LevelSixGold}
			],
			levels: [{hats: 315}, {hats: 330}, {hats: 345, bonus: 'Скидка 25%'}]},
		{title: 'РЕКТОР',
			icons: [
				{icon: LevelSevenSilver,},
				{icon: LevelSevenBronze,},
				{icon: LevelSevenGold}
			],
			levels: [{hats: 355}, {hats: 360}, {hats: 365, bonus: 'Месяц премиум'}]}
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