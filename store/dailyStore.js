import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dailyQuests } from '@/utils/dailyQuests.js'
export const dailyStore = defineStore('dailyStore', () => {
	const QUESTS_PER_DAY = 3
	const DAY_MS = 24 * 60 * 60 * 1000
	const isClient = typeof window !== 'undefined'

	function wrapSlice(arr, start, count) {
		const len = arr.length
		if (!len) return []
		const end = (start + count)
		return end <= len
			? arr.slice(start, end)
			: [...arr.slice(start), ...arr.slice(0, end - len)]
	}
	const nowMs = ref(Date.now())

	let timerId = null

	function start() {
		if (!isClient) return
		if (timerId) return
		timerId = setInterval(() => {
			nowMs.value = Date.now()
		}, 1000)
	}

	function stop() {
		if (!isClient) return
		if (timerId) clearInterval(timerId)
		timerId = null
	}

	const dayIndex = computed(() => {
		const d = new Date(nowMs.value)
		const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate())
		return Math.floor(midnight.getTime() / DAY_MS)
	})

	const offset = computed(() => {
		const len = dailyQuests.length || 1
		return (dayIndex.value * QUESTS_PER_DAY) % len
	})

	const todayQuests = computed(() => wrapSlice(dailyQuests, offset.value, QUESTS_PER_DAY))

	const msLeft = computed(() => {
		const d = new Date(nowMs.value)
		const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime()
		return Math.max(0, nextMidnight - nowMs.value)
	})

	return { start, stop, todayQuests, msLeft }
})
