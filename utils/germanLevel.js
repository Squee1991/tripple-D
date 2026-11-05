import { regions } from '~/utils/regions.js'

export const GERMAN_LEVEL_ORDER = ['A1', 'A2', 'B1']

export const LEVEL_CATEGORIES = {
	A1: ['beginner', 'pathfinder'],
	A2: ['elementary', 'intermediate'],
	B1: ['experience', 'wisdom']
}

// уровень (A1/A2/B1), к которому относится раздел карты земель
export function levelOfCategory(category) {
	return GERMAN_LEVEL_ORDER.find(level => LEVEL_CATEGORIES[level]?.includes(category)) || null
}

const levelIndex = (level) => Math.max(GERMAN_LEVEL_ORDER.indexOf(level), 0)

export function isLevelVisible(contentLevel, userLevel) {
	const idx = GERMAN_LEVEL_ORDER.indexOf(contentLevel)
	if (idx === -1) return true
	return idx >= levelIndex(userLevel)
}

export function visibleLevels(levels, userLevel, getLevel = (l) => l) {
	return levels.filter(item => isLevelVisible(getLevel(item), userLevel))
}

export function visibleRegionCategories(userLevel) {
	const hidden = GERMAN_LEVEL_ORDER.slice(0, levelIndex(userLevel)).flatMap(l => LEVEL_CATEGORIES[l] || [])
	return Object.keys(regions).filter(key => !hidden.includes(key))
}

const categoryOfRegion = Object.fromEntries(
	Object.entries(regions).flatMap(([key, list]) => list.map(r => [r.id, key]))
)

export function isRegionVisible(regionId, userLevel) {
	const category = categoryOfRegion[regionId]
	return !category || visibleRegionCategories(userLevel).includes(category)
}

export function landLevelOffset(userLevel) {
	const first = regions[visibleRegionCategories(userLevel)[0]]?.[0]
	return first?.level || 0
}

export const UNLOCK_ALL_LANDS = false

export function requiredLandLevel(region, userLevel) {
	if (!region || UNLOCK_ALL_LANDS) return 0
	return Math.max((region.level || 0) - landLevelOffset(userLevel), 0)
}
