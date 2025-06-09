import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBreakPointsStore = defineStore('breakpoints', () => {
	const values = {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1280,
		xl: 1920
	}

	const breakPoints = ref({
		xs: false,
		sm: false,
		md: false,
		lg: false,
		xl: false,
		current: 'xs'
	})

	const breakpointFlags = {}
	Object.keys(values).forEach(key => {
		breakpointFlags[key] = computed(() => breakPoints.value[key])
	})

	const calcBreakPoints = (width) => {
		breakPoints.value.xs = width < values.sm
		breakPoints.value.sm = width >= values.sm && width < values.md
		breakPoints.value.md = width >= values.md && width < values.lg
		breakPoints.value.lg = width >= values.lg && width < values.xl
		breakPoints.value.xl = width >= values.xl

		if (width < values.sm) {
			breakPoints.value.current = 'xs'
		} else if (width < values.md) {
			breakPoints.value.current = 'sm'
		} else if (width < values.lg) {
			breakPoints.value.current = 'md'
		} else if (width < values.xl) {
			breakPoints.value.current = 'lg'
		} else {
			breakPoints.value.current = 'xl'
		}
	}

	const resize = () => {
		if (typeof window !== 'undefined') {
			calcBreakPoints(window.innerWidth)
		}
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('resize', resize)
		calcBreakPoints(window.innerWidth)
	}

	return {
		breakPoints,
		...breakpointFlags, // тут все xs, sm, md, lg, xl
		resize,
		calcBreakPoints
	}
})