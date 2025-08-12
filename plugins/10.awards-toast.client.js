import { toast } from 'vue3-toastify'
import { useAchievementStore } from '~/store/achievementStore'
import { useUiSettingsStore } from '~/store/uiSettingsStore'

let inited = false
let lastShownKey = null

export default defineNuxtPlugin((nuxtApp) => {
	if (inited) return
	inited = true

	const ach = useAchievementStore()
	const ui  = useUiSettingsStore()

	let appMounted = false
	let queuedAward = null

	const show = (award) => {
		const key = award?.key ?? award?.id ?? award?.title
		if (!key || key === lastShownKey) return
		lastShownKey = key
		setTimeout(() => {
			toast.success(`🎉 Вы получили награду «${award.title || 'Награда'}»!`)
			// ach.lastUnlockedAward = null
		}, 1000)
	}

	ach.$subscribe((_m, state) => {
		const award = state.lastUnlockedAward
		if (!award || !ui.achievementsNotifyEnabled) return
		if (!appMounted) { queuedAward = award; return }
		setTimeout(() => show(award), 0)
	})

	nuxtApp.hook('app:mounted', () => {
		appMounted = true
		if (queuedAward) { setTimeout(() => show(queuedAward), 50); queuedAward = null }
	})
})
