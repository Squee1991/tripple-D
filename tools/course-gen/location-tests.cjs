// Итоговые тесты уровней: собирает public/location-tests/<уровень>.json из заданий квестов.
// Запуск из корня проекта: node tools/course-gen/location-tests.cjs (после всей сборки курса).
// Тема = группа земель. Страница берёт из запаса каждой темы случайные задания, поэтому повторный тест другой.
// Повторы (reviewOf) не берём: задание должно проверять тему своей земли.
const fs = require('fs')
const POOL = 15
const LIMITS = { readAndAnswer: 3, speechToText: 3 }

const LEVELS = {
	A1: {
		perTopic: 6,
		topics: {
			firstSteps: ['east-plain', 'meet-meadow', 'question-gorge'],
			verbs: ['change-river', 'routine-mill', 'power-pass'],
			family: ['stone-reach', 'family-tree', 'clock-tower'],
			shopping: ['market-square', 'hearty-inn', 'dress-bazaar'],
			travel: ['wind-valley', 'lake-ruins', 'north-cliffs', 'storm-coast'],
			life: ['master-lands', 'wild-lands', 'healer-hut']
		}
	},
	A2: {
		perTopic: 6,
		topics: {
			past: ['past-simple', 'past-land'],
			prepositions: ['place-prepositions', 'direction-prepositions', 'action-prepositions'],
			requests: ['action-valley', 'requests-land', 'order-valley'],
			dates: ['calendar-valley', 'time-road', 'time-gate'],
			compare: ['comparison-hills', 'advice-garden', 'choice-crossing', 'nobody-village'],
			adjectives: ['future-land', 'edge-images', 'secret-lands', 'definite-indefinite']
		}
	},
	B1: {
		perTopic: 6,
		topics: {
			stories: ['story-valley', 'memory-lake'],
			clauses: ['reason-bridge', 'purpose-path', 'consequence-fork'],
			passive: ['neighbor-street', 'craft-valley', 'task-tower'],
			konjunktiv: ['wish-island', 'regret-river'],
			endings: ['owner-castle', 'hero-square', 'taste-market'],
			links: ['question-bridge', 'link-harbor', 'nuance-bridge'],
			opinion: ['decision-workshop', 'word-forge', 'opinion-tower']
		}
	}
}

function shuffle(arr, seed) {
	const a = [...arr]
	let s = seed
	for (let i = a.length - 1; i > 0; i--) {
		s = (s * 9301 + 49297) % 233280
		const j = Math.floor((s / 233280) * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

// в старых землях есть задания, где вопрос записан прямо текстом, без инструкции: они в тест не идут
const isKey = s => /^[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+$/.test(String(s || ''))
const landNames = Object.fromEntries([...fs.readFileSync('utils/regions.js', 'utf8').matchAll(/id: "([^"]+)"[^]*?name: "([^"]+)"/g)].map(m => [m[1], m[2]]))

const clean = (t, land) => {
	const { id, tip, reviewOf, reviewLand, ...rest } = t
	return { land, landName: landNames[land], ...rest }
}

function poolOf(lands, seed) {
	const byLand = lands.map((land, li) => {
		const quests = JSON.parse(fs.readFileSync(`public/quests/quests-${land}.json`, 'utf8'))
		const tasks = quests.flatMap(q => q.tasks.filter(t => !t.reviewOf && isKey(t.question)).map(t => clean(t, land)))
		return shuffle(tasks, seed + li * 17)
	})
	const pool = []; const seen = new Set(); const count = {}
	for (let i = 0; pool.length < POOL && byLand.some(l => l[i]); i++) {
		for (const list of byLand) {
			const t = list[i]
			if (!t || pool.length >= POOL) continue
			if (seen.has(t.question) || (count[t.type] || 0) >= (LIMITS[t.type] || POOL)) continue
			seen.add(t.question)
			count[t.type] = (count[t.type] || 0) + 1
			pool.push(t)
		}
	}
	return pool
}

fs.mkdirSync('public/location-tests', { recursive: true })
for (const [level, cfg] of Object.entries(LEVELS)) {
	const topics = Object.entries(cfg.topics).map(([id, lands], i) => {
		const pool = poolOf(lands, 1000 + i * 101)
		if (pool.length < cfg.perTopic) throw new Error(`${level} ${id}: мало заданий ${pool.length}`)
		return { id, pool }
	})
	fs.writeFileSync(`public/location-tests/${level}.json`, JSON.stringify({ level, perTopic: cfg.perTopic, topics }) + '\n')
	const types = {}; topics.forEach(t => t.pool.forEach(x => { types[x.type] = (types[x.type] || 0) + 1 }))
	console.log(level, 'тем', topics.length, 'заданий в тесте', topics.length * cfg.perTopic, 'в запасе', topics.reduce((s, t) => s + t.pool.length, 0), JSON.stringify(types))
}
