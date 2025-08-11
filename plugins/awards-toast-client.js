import { toast } from 'vue3-toastify'
import { useAchievementStore } from '../store/achievementStore.js'
import { useUiSettingsStore } from '../store/uiSettingsStore.js'

let inited = false
let lastShownKey = null

export default defineNuxtPlugin(() => {
	if (inited) return
	inited = true

	const ach = useAchievementStore()
	const ui  = useUiSettingsStore()

	ach.$subscribe((_mutation, state) => {
		const award = state.lastUnlockedAward
		if (!award) return
		if (!ui.achievementsNotifyEnabled) return

		const key = award.id ?? award.title
		if (key && key === lastShownKey) return
		lastShownKey = key
		toast.success(`🎉 Вы получили награду «${award.title}»!`)
	})
})
