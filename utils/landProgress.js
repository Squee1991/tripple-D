import { OLD_QUEST_LANDS } from '~/utils/questLandMap.js'

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
