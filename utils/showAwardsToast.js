//
// import { toast } from 'vue3-toastify'
// import { useAchievementStore } from '~/store/achievementStore'
// import { useUiSettingsStore } from '~/store/uiSettingsStore'
//
// let inited = false
// let unsubscribe = null
// let lastShownKey = null
//
// export function initAwardToastListener() {
// 	if (!process.client || inited) return
// 	inited = true
//
// 	const ach = useAchievementStore()
// 	const ui  = useUiSettingsStore()
//
// 	unsubscribe = ach.$subscribe((_mutation, state) => {
// 		const award = state.lastUnlockedAward
// 		if (!award) return
// 		if (!ui.achievementsNotifyEnabled) return
// 		const key = award.id ?? award.title
// 		if (key && key === lastShownKey) return
// 		lastShownKey = key
// 		toast.success(`🎉 Вы получили награду «${award.title}»!`)
// 	})
// }
//
// export function stopAwardToastListener() {
// 	if (unsubscribe) {
// 		unsubscribe()
// 		unsubscribe = null
// 		inited = false
// 		lastShownKey = null
// 	}
// }
