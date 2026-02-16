import {defineStore} from 'pinia'
import {ref} from 'vue'
import RankIcon from '../assets/images/rank-icons/trophy (4).svg'
import Silver from '../assets/images/rank-icons/silber.png'
import Gold from '../assets/images/rank-icons/gold.png'
import Bronze from '../assets/images/rank-icons/bronze.png'

import levelTwoSilver from '../assets/images/rank-icons/levelTwoSilver.png'
import levelTwoBronze from '../assets/images/rank-icons/levelTwoBronze.png'
import levelTwoGold from '../assets/images/rank-icons/levelTwogold.png'
import { userAuthStore } from "~/store/authStore.js";


export const useRankUserStore = defineStore('rankUserStore', () => {
    const authStore = userAuthStore()
    const ranksData = [
        {
            title: 'Студент',
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
        {
            title: 'МАГИСТР', icons: [
                {icon: RankIcon,},
                {icon: RankIcon,},
                {icon: RankIcon,}
            ],
            levels: [{hats: 90}, {hats: 110}, {hats: 130, bonus: 'Скидка 10%'}]
        },
        {
            title: 'ДОКТОР', icons: [
                {icon: RankIcon,},
                {icon: RankIcon,},
                {icon: RankIcon,}
            ], levels: [{hats: 160}, {hats: 185}, {hats: 210, bonus: 'Скидка 15%'}]
        },
        {
            title: 'ПРОФЕССОР', icons: [
                {icon: RankIcon,},
                {icon: RankIcon,},
                {icon: RankIcon,}
            ], levels: [{hats: 240}, {hats: 270}, {hats: 300, bonus: 'Скидка 20%'}]
        },
        {
            title: 'ДЕКАН', icons: [
                {icon: RankIcon,},
                {icon: RankIcon,},
                {icon: RankIcon,}
            ], levels: [{hats: 315}, {hats: 330}, {hats: 345, bonus: 'Скидка 25%'}]
        },
        {
            title: 'РЕКТОР', icons: [
                {icon: RankIcon,},
                {icon: RankIcon,},
                {icon: RankIcon,}

            ], levels: [{hats: 355}, {hats: 360}, {hats: 365, bonus: 'Месяц премиум'}]
        }
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
        checkRewardUI
    }
})