import { OLD_QUEST_LANDS } from '~/utils/questLandMap.js'
import { regions } from '~/utils/regions.js'
import { requiredLandLevel } from '~/utils/germanLevel.js'
import { LAND_QUESTS } from '~/utils/landQuests.js'

// Сколько квестов земли пройдено (success), для кольца вокруг земли на карте.
// Квест засчитан и по старому id (alias), пока прогресс не перенесён на новый.
export function landCompletion(questProgress, landId) {
	const quests = LAND_QUESTS[landId] || []
	const done = quests.filter(ids => ids.some(id => questProgress?.[id]?.success)).length
	return { done, total: quests.length }
}

const LAND_ORDER = Object.values(regions).flat()

// Земля перед этой по карте (по всему курсу), у первой земли её нет
export function previousRegion(regionId) {
	const i = LAND_ORDER.findIndex(r => r.id === regionId)
	return i > 0 ? LAND_ORDER[i - 1] : null
}

// Предыдущая земля пройдена целиком: тогда эта земля открыта, даже если уровня пока не хватает
export function isPrevLandDone(questProgress, regionId) {
	const prev = previousRegion(regionId)
	if (!prev) return false
	const { done, total } = landCompletion(questProgress, prev.id)
	return total > 0 && done >= total
}

// Земли, в которых у игрока уже есть прогресс. Такая земля всегда открыта, даже если
// после перестройки карты она требует больший уровень: человек учил, значит доступ остаётся.
// В старых записях нет поля region, для них земля определяется по id квеста.
export function landsWithProgress(questProgress) {
	const lands = new Set()
	for (const [questId, entry] of Object.entries(questProgress || {})) {
		if (!entry) continue
		const land = entry.region || OLD_QUEST_LANDS[questId]
		if (land) lands.add(land)
	}
	return lands
}

// Уровень аккаунта ровно по прогрессу игрока: открывает самую дальнюю землю, где он уже играл,
// а если эту землю он прошёл целиком, то и следующую (до перестройки она у него уже была открыта).
// После вставки новых земель старые игроки стоят дальше, чем позволяет их уровень: с этим уровнем
// новые земли перед его землёй открыты, но не пройдены, их он проходит сам; дальше всё как обычно.
export function levelForProgress(questProgress, germanLevel) {
	const lands = landsWithProgress(questProgress)
	const list = LAND_ORDER
	let furthest = -1
	list.forEach((region, i) => {
		if (lands.has(region.id)) furthest = i
	})
	if (furthest === -1) return 0
	const { done, total } = landCompletion(questProgress, list[furthest].id)
	const next = list[furthest + 1]
	const target = total > 0 && done >= total && next ? next : list[furthest]
	return requiredLandLevel(target, germanLevel)
}
