// Сборка грамматики к заданиям: tools/grammar/lands/<земля>.cjs → public/grammar/<земля>.json
// Запуск: node tools/grammar/build.cjs            (все земли)
//         node tools/grammar/build.cjs meet-meadow (одна земля)
// Каждый текст нужен на всех 11 языках, тире в текстах запрещены: иначе сборка падает
const fs = require('fs')
const path = require('path')

const LANGS = ['ru', 'uk', 'en', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
const landsDir = path.join(__dirname, 'lands')
const outDir = path.join(__dirname, '..', '..', 'public', 'grammar')

function buildLand(landId) {
	const quests = require(path.join(landsDir, `${landId}.cjs`))
	const questFile = path.join(__dirname, '..', '..', 'public', 'quests', `quests-${landId}.json`)
	const questData = JSON.parse(fs.readFileSync(questFile, 'utf8'))
	const questIds = new Set((Array.isArray(questData) ? questData : questData.quests).map(q => String(q.questId)))
	const out = {}
	const problems = []
	for (const [questId, q] of Object.entries(quests)) {
		if (!questIds.has(questId)) problems.push(`${questId}: нет такого задания в quests-${landId}.json`)
		out[questId] = {}
		for (const lang of LANGS) {
			if (!q.title[lang]) problems.push(`${questId} title ${lang}`)
			out[questId][lang] = {
				title: q.title[lang],
				points: q.points.map((p, i) => {
					const pair = p.t[lang]
					if (!pair) problems.push(`${questId} point ${i} ${lang}`)
					return {
						title: pair?.[0],
						text: pair?.[1],
						examples: p.examples.map(e => {
							const tr = typeof e.tr === 'string' ? e.tr : e.tr[lang]
							if (!tr) problems.push(`${questId} point ${i} example "${e.de}" ${lang}`)
							return { de: e.de, tr }
						})
					}
				})
			}
		}
	}
	const text = JSON.stringify(out, null, 2)
	if (/[—–]/.test(text)) problems.push('в текстах есть тире')
	if (problems.length) throw new Error(`${landId}:\n` + problems.join('\n'))
	fs.mkdirSync(outDir, { recursive: true })
	fs.writeFileSync(path.join(outDir, `${landId}.json`), text + '\n')
	console.log(`${landId}: ${Object.keys(out).length} заданий`)
}

const only = process.argv[2]
const lands = only ? [only] : fs.readdirSync(landsDir).filter(f => f.endsWith('.cjs')).map(f => f.replace(/\.cjs$/, ''))
lands.forEach(buildLand)
