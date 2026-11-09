// Список квестов каждой земли для карты (кольцо прогресса вокруг земли).
// Запускать после любой пересборки квестов: node tools/course-gen/land-quests.cjs
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../..')
const dir = path.join(root, 'public/quests')
const out = {}
const seen = new Map()

for (const file of fs.readdirSync(dir).sort()) {
	const m = file.match(/^quests-(.+)\.json$/)
	if (!m) continue
	const land = m[1]
	const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
	const list = Array.isArray(data) ? data : (data.quests || [data])
	out[land] = list.map(q => {
		const ids = [String(q.questId), ...(q.aliases || []).map(String)]
		for (const id of ids) {
			if (seen.has(id)) throw new Error(`questId ${id} есть и в ${seen.get(id)}, и в ${land}`)
			seen.set(id, land)
		}
		return ids
	})
}

const body = '// Сгенерировано tools/course-gen/land-quests.cjs, руками не менять.\n'
	+ '// земля -> квесты; у квеста первый id основной, дальше старые id (aliases)\n'
	+ 'export const LAND_QUESTS = ' + JSON.stringify(out, null, '\t') + '\n'
fs.writeFileSync(path.join(root, 'utils/landQuests.js'), body)
console.log(`utils/landQuests.js: ${Object.keys(out).length} lands, ${seen.size} ids`)
