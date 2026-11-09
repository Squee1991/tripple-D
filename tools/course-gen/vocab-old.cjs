// Словари квестов в землях, сделанных вручную (A1 и первые земли A2): node tools/course-gen/vocab-old.cjs
// Правило курса то же, что в gen.cjs: в словаре квеста минимум 5 слов, и каждое слово есть в заданиях этого квеста.
// Слово считается в задании, если ученик его видит (в том числе среди вариантов ответа).
// Слово, которого нет в заданиях, переезжает в следующий квест этой же земли, где оно есть, иначе убирается.
// Потом словарь добирается до 5 слов из правильных ответов квеста (переводы из словарей курса, words.json и verbs.json).
// Меняется только поле vocabulary, задания и прогресс игроков не трогаются. Запускать можно повторно.
const fs = require('fs')
const { lexTok, coreOf, wordIn, fillVocab, vocabWarnings } = require('./lexicon.cjs')

// east-plain переделана и собирается генератором (lands/a1/east-plain.cjs)
const LANDS = ['stone-reach', 'wind-valley', 'lake-ruins', 'north-cliffs', 'storm-coast', 'master-lands', 'wild-lands', 'future-land', 'past-land', 'action-valley', 'order-valley', 'time-gate', 'edge-images', 'secret-lands', 'definite-indefinite', 'place-prepositions', 'direction-prepositions', 'action-prepositions', 'past-simple', 'requests-land']

const ru = JSON.parse(fs.readFileSync('i18n/locales/ru-RU.json', 'utf8'))
const get = k => (typeof k === 'string' ? k.split('.').reduce((a, p) => a && a[p], ru) : undefined)
// строка задания: ключ локали или сам текст
const isKey = s => typeof s === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+$/.test(s) && get(s) !== undefined
// немецкие слова из русской формулировки («Что значит: das Bild», предложение с пропуском)
const latinOf = s => (String(s || '').match(/[A-Za-zÄÖÜäöüß'’-]+/g) || []).join(' ')

// немецкий текст квеста: только правильные ответы, тексты и немецкие вставки в вопросах (неверные варианты не считаются)
function textOf(q) {
	return q.tasks.map(t => {
		const ans = t.answer ?? t.correctAnswer
		// вопрос без ключа локали показывается как есть (часто это немецкая фраза)
		const parts = [t.text, (t.correctOrder || []).join(' '), isKey(t.question) ? latinOf(get(t.question)) : latinOf(t.question)]
		if (ans && !isKey(ans)) parts.push(ans)
		if (t.type === 'input') parts.push(latinOf(get(t.question)).replace('___', ''))
		return parts.join(' ')
	}).join(' ')
}
// всё, что ученик видит в заданиях: ещё и варианты ответа, слова для сборки, ответы-ключи в переводе
function visibleOf(q) {
	return textOf(q) + ' ' + q.tasks.map(t => [...(t.options || []), ...(t.words || [])].map(o => (isKey(o) ? latinOf(get(o)) : o)).join(' ')).join(' ')
}

// «der Lehrer / die Lehrerin», «achtundvierzig (48)»: достаточно, чтобы в заданиях был один из вариантов
const variantsOf = word => String(word).split('/').map(x => coreOf(x.replace(/\([^)]*\)/g, ' ')).filter(w => !/\d/.test(w))).filter(c => c.length)
const visible = (word, tokens) => { const vs = variantsOf(word); return !vs.length || vs.some(c => c.every(w => wordIn(w, tokens))) }

let moved = 0, removed = 0, added = 0
for (const land of LANDS) {
	const file = `public/quests/quests-${land}.json`
	const raw = fs.readFileSync(file, 'utf8')
	const quests = JSON.parse(raw)
	const texts = quests.map(q => lexTok(textOf(q)))
	const seen = quests.map(q => lexTok(visibleOf(q)))
	quests.forEach((q, i) => {
		const where = `${land} ${q.questId}`
		const keep = []
		for (const v of q.vocabulary || []) {
			if (visible(v.word, seen[i])) { keep.push(v); continue }
			const j = seen.findIndex((tk, k) => k > i && visible(v.word, tk))
			if (j >= 0) {
				quests[j].vocabulary ||= []
				if (!quests[j].vocabulary.some(x => x.word === v.word)) quests[j].vocabulary.push(v)
				moved++
				console.log(`  ${where}: «${v.word}» → ${quests[j].questId}`)
			} else {
				removed++
				console.log(`  ${where}: «${v.word}» убрано (нет в заданиях земли)`)
			}
		}
		const before = keep.length
		fillVocab(keep, texts[i].join(' '), where)
		added += keep.length - before
		q.vocabulary = keep
	})
	let out = JSON.stringify(quests, null, 2) + '\n'
	if (raw.includes('\r\n')) out = out.replace(/\n/g, '\r\n')
	fs.writeFileSync(file, out)
}
console.log(`словари старых земель: перенесено ${moved}, убрано ${removed}, добавлено ${added}`)
if (vocabWarnings.length) console.log(`меньше 5 слов: ${vocabWarnings.length}\n  ${vocabWarnings.join('\n  ')}`)
