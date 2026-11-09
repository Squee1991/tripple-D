// Генератор земель курса. Запуск из корня проекта: node tools/course-gen/gen.cjs
// Пишет public/quests/quests-<id>.json и ключи в i18n/locales/*.json (квесты, locationNames, regions.desc, landIntro).
// Свои старые ключи генератор сначала удаляет, поэтому перезапуск безопасен, а остальное содержимое локалей не меняется.
// Правила курса: учебный квест = 10 новых заданий + 3 повторения (квесты 1·3·7 назад) + 2 на прошлые земли;
// «Закрепление» после учебных квестов из consolidateAfter; у каждого задания есть 💡 (правило квеста).
const NUM_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const fs = require('fs')
const path = require('path')

// Запуск из корня проекта: node tools/course-gen/gen.cjs
// Собирает все земли из lands/index.cjs по порядку (цепочка интервальных повторений идёт через них).
const root = process.cwd()
const landFiles = require('./lands/index.cjs').map(f => path.join(__dirname, 'lands', f))

// порядок языков во всех массивах переводов: ru en uk pl es fr tr ro uz hi ar
const LANGS = ['ru', 'en', 'uk', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
const FILES = { ru: 'ru-RU', en: 'en-US', uk: 'uk-UA', pl: 'pl-PL', es: 'es-ES', fr: 'fr-FR', tr: 'tr-TR', ro: 'ro-RO', uz: 'uz-UZ', hi: 'hi-IN', ar: 'ar-SA' }

const T = {
	ru: { tr: 'Выберите перевод: «{n}»', ok: 'Выберите правильный вариант: «{n}»', ro: 'Соберите предложение: «{n}»', gv: 'Вставьте глагол в нужной форме. «{n}»: {de}', ga: 'Вставьте прилагательное в нужной форме. «{n}»: {de}', gw: 'Вставьте пропущенное слово. «{n}»: {de}', goal: 'Ответьте правильно на 15 заданий' },
	en: { tr: 'Choose the translation: “{n}”', ok: 'Choose the correct option: “{n}”', ro: 'Build the sentence: “{n}”', gv: 'Fill in the verb in the correct form. “{n}”: {de}', ga: 'Fill in the adjective in the correct form. “{n}”: {de}', gw: 'Fill in the missing word. “{n}”: {de}', goal: 'Answer 15 tasks correctly' },
	uk: { tr: 'Виберіть переклад: «{n}»', ok: 'Виберіть правильний варіант: «{n}»', ro: 'Складіть речення: «{n}»', gv: 'Вставте дієслово в потрібній формі. «{n}»: {de}', ga: 'Вставте прикметник у потрібній формі. «{n}»: {de}', gw: 'Вставте пропущене слово. «{n}»: {de}', goal: 'Дайте правильну відповідь на 15 завдань' },
	pl: { tr: 'Wybierz tłumaczenie: „{n}”', ok: 'Wybierz poprawną odpowiedź: „{n}”', ro: 'Ułóż zdanie: „{n}”', gv: 'Wpisz czasownik w odpowiedniej formie. „{n}”: {de}', ga: 'Wpisz przymiotnik w odpowiedniej formie. „{n}”: {de}', gw: 'Wpisz brakujące słowo. „{n}”: {de}', goal: 'Odpowiedz poprawnie na 15 zadań' },
	es: { tr: 'Elige la traducción: «{n}»', ok: 'Elige la opción correcta: «{n}»', ro: 'Forma la frase: «{n}»', gv: 'Escribe el verbo en la forma correcta. «{n}»: {de}', ga: 'Escribe el adjetivo en la forma correcta. «{n}»: {de}', gw: 'Escribe la palabra que falta. «{n}»: {de}', goal: 'Responde correctamente a 15 tareas' },
	fr: { tr: 'Choisis la traduction : « {n} »', ok: 'Choisis la bonne réponse : « {n} »', ro: 'Construis la phrase : « {n} »', gv: 'Écris le verbe à la bonne forme. « {n} » : {de}', ga: 'Écris l’adjectif à la bonne forme. « {n} » : {de}', gw: 'Écris le mot qui manque. « {n} » : {de}', goal: 'Réponds correctement à 15 exercices' },
	tr: { tr: 'Doğru çeviriyi seç: “{n}”', ok: 'Doğru seçeneği seç: “{n}”', ro: 'Cümleyi kur: “{n}”', gv: 'Fiili doğru biçimde yaz. “{n}”: {de}', ga: 'Sıfatı doğru biçimde yaz. “{n}”: {de}', gw: 'Eksik kelimeyi yaz. “{n}”: {de}', goal: '15 görevi doğru cevapla' },
	ro: { tr: 'Alege traducerea: „{n}”', ok: 'Alege varianta corectă: „{n}”', ro: 'Formează propoziția: „{n}”', gv: 'Scrie verbul la forma corectă. „{n}”: {de}', ga: 'Scrie adjectivul la forma corectă. „{n}”: {de}', gw: 'Scrie cuvântul care lipsește. „{n}”: {de}', goal: 'Răspunde corect la 15 sarcini' },
	uz: { tr: 'To‘g‘ri tarjimani tanlang: “{n}”', ok: 'To‘g‘ri variantni tanlang: “{n}”', ro: 'Gapni tuzing: “{n}”', gv: 'Fe’lni to‘g‘ri shaklda yozing. “{n}”: {de}', ga: 'Sifatni to‘g‘ri shaklda yozing. “{n}”: {de}', gw: 'Tushib qolgan so‘zni yozing. “{n}”: {de}', goal: '15 ta topshiriqqa to‘g‘ri javob bering' },
	hi: { tr: 'सही अनुवाद चुनिए: “{n}”', ok: 'सही विकल्प चुनिए: “{n}”', ro: 'वाक्य बनाइए: “{n}”', gv: 'क्रिया का सही रूप लिखिए। “{n}”: {de}', ga: 'विशेषण का सही रूप लिखिए। “{n}”: {de}', gw: 'छूटा हुआ शब्द लिखिए। “{n}”: {de}', goal: '15 कार्यों के सही उत्तर दीजिए' },
	ar: { tr: 'اختر الترجمة: «{n}»', ok: 'اختر الإجابة الصحيحة: «{n}»', ro: 'كوّن الجملة: «{n}»', gv: 'اكتب الفعل بالصيغة الصحيحة. «{n}»: {de}', ga: 'اكتب الصفة بالصيغة الصحيحة. «{n}»: {de}', gw: 'اكتب الكلمة الناقصة. «{n}»: {de}', goal: 'أجب إجابة صحيحة عن 15 مهمة' }
}

const ORDINALS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

// детерминированное перемешивание, чтобы правильный ответ не стоял всегда первым
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

function byLang(arr, what) {
	if (!Array.isArray(arr) || arr.length !== LANGS.length) throw new Error(`${what}: нужно ${LANGS.length} переводов, есть ${arr && arr.length}`)
	arr.forEach((s, i) => { if (/[—–]/.test(s)) throw new Error(`${what} (${LANGS[i]}): длинное тире запрещено в текстах приложения`) })
	return Object.fromEntries(LANGS.map((l, i) => [l, arr[i]]))
}

const fill = (tpl, n, de) => tpl.replace('{n}', n).replace('{de}', de || '')

const { MIN_VOCAB, lexTok, coreOf, wordIn, fillVocab, vocabWarnings } = require('./lexicon.cjs')
// немецкий текст задания с правильным ответом (неправильные варианты не считаются)
const deOfKey = new Map() // ключ задания -> немецкий текст с правильным ответом
function germanOf(task) {
	const [kind] = task
	if (kind === 'tr' || kind === 'ok') return task[3]
	if (kind === 'ro') return task[2]
	if (kind === 'rd') return `${task[2]} ${task[4]}`
	return task[2].replace('___', task[3])
}

function buildLand(land) {
	const quests = []
	const strings = Object.fromEntries(LANGS.map(l => [l, {}]))

	land.quests.forEach((q, qi) => {
		const ns = land.ns + ORDINALS[qi]
		const where = `${land.id} квест ${qi + 1}`
		if (q.tasks.length !== 15) throw new Error(`${where}: заданий ${q.tasks.length}, нужно 15`)
		const title = byLang(q.title, where + ' title')
		const desc = byLang(q.desc, where + ' desc')
		LANGS.forEach(l => { strings[l][ns] = { questTitle: title[l], questDescription: desc[l], questGoal: T[l].goal } })

		const tasks = q.tasks.map((task, ti) => {
			const id = ti + 1
			// null на месте заданий из dropTasks: их всё равно выкидывают при сборке
			if (task === null) return { id, type: 'dropped' }
			const [kind] = task
			const key = `${ns}.questTask${id}`
			const seed = (qi + 1) * 100 + id
			const tw = `${where} задание ${id}`
			const put = (texts) => LANGS.forEach(l => { strings[l][ns]['questTask' + id] = texts[l] })
			if (kind === 'tr' || kind === 'ok') {
				const [, n, options, answer] = task
				if (!options.includes(answer)) throw new Error(`${tw}: ответа нет в вариантах`)
				const nn = byLang(n, tw)
				put(Object.fromEntries(LANGS.map(l => [l, fill(T[l][kind], nn[l])])))
				return { id, type: 'select', question: key, options: shuffle(options, seed), answer }
			}
			if (kind === 'ro') {
				const [, n, sentence, distractors = []] = task
				const order = sentence.split(' ')
				const nn = byLang(n, tw)
				put(Object.fromEntries(LANGS.map(l => [l, fill(T[l].ro, nn[l])])))
				return { id, type: 'reorder', question: key, words: shuffle([...order, ...distractors], seed), correctOrder: order }
			}
			if (kind === 'gv' || kind === 'ga' || kind === 'gw') {
				const [, n, de, answer] = task
				if (!de.includes('___')) throw new Error(`${tw}: нет пропуска ___`)
				if (answer.includes(' ')) throw new Error(`${tw}: ответ должен быть одним словом`)
				const nn = byLang(n, tw)
				put(Object.fromEntries(LANGS.map(l => [l, fill(T[l][kind], nn[l], de)])))
				return { id, type: 'input', question: key, correctAnswer: answer }
			}
			if (kind === 'rd') {
				const [, qn, text, options, answer] = task
				if (!options.includes(answer)) throw new Error(`${tw}: ответа нет в вариантах`)
				put(byLang(qn, tw))
				return { id, type: 'readAndAnswer', question: key, text, options: shuffle(options, seed), answer }
			}
			throw new Error(`${tw}: неизвестный тип ${kind}`)
		})

		const vocabulary = q.vocab.map(([word, ...tr]) => {
			const t = byLang(tr, `${where} слово ${word}`)
			return { word, ...Object.fromEntries(LANGS.map(l => [`translation-${l}`, t[l]])) }
		})
		q.tasks.forEach((t, ti) => { if (t) deOfKey.set(`${ns}.questTask${ti + 1}`, germanOf(t)) })

		// сырой квест: собираем финальную структуру в assemble()
		quests.push({ ns, qi, tasks, vocabulary })
	})

	return {
		quests,
		strings,
		name: byLang(land.name, land.id + ' name'),
		desc: byLang(land.desc, land.id + ' desc'),
		intro: Object.fromEntries(['p1', 'p2', 'p3'].map(p => [p, byLang(land.intro[p], `${land.id} intro ${p}`)]))
	}
}

// --- текстовая вставка в JSON с отступом 2 пробела ---
// тело объекта без внешних скобок, с отступом indent
function bodyLines(obj, indent, eol) {
	return JSON.stringify(obj, null, 2).split('\n').slice(1, -1).map(line => ' '.repeat(indent - 2) + line).join(eol)
}

function insertTop(raw, obj, eol) {
	return raw.replace(/^\{\r?\n/, `{${eol}${bodyLines(obj, 2, eol)},${eol}`)
}

// удалить ранее сгенерированный объект верхнего уровня (вместе с запятой после него)
function removeTop(raw, key, eol) {
	const marker = `${eol}  "${key}": {${eol}`
	const start = raw.indexOf(marker)
	if (start === -1) return raw
	const endMarker = `${eol}  }`
	const end = raw.indexOf(endMarker, start + 1)
	let stop = end + endMarker.length
	if (raw[stop] === ',') stop++
	return raw.slice(0, start) + raw.slice(stop)
}

// удалить ранее сгенерированный ключ внутри объекта верхнего уровня (строку или вложенный объект)
function removeNested(raw, objKey, key, eol) {
	const objMarker = `${eol}  "${objKey}": {${eol}`
	const objStart = raw.indexOf(objMarker)
	if (objStart === -1) return raw
	const objEnd = raw.indexOf(`${eol}  }`, objStart + 1)
	const lineMarker = `${eol}    "${key}": `
	const start = raw.indexOf(lineMarker, objStart)
	if (start === -1 || start > objEnd) return raw
	const after = start + lineMarker.length
	let stop
	if (raw[after] === '{') {
		const close = `${eol}    }`
		stop = raw.indexOf(close, after) + close.length
	} else {
		stop = raw.indexOf(eol, after)
	}
	if (raw[stop] === ',') stop++
	return raw.slice(0, start) + raw.slice(stop)
}

function insertInto(raw, key, obj, eol) {
	const marker = `${eol}  "${key}": {${eol}`
	const at = raw.indexOf(marker)
	if (at === -1) throw new Error(`не найден объект ${key}`)
	const pos = at + marker.length
	return raw.slice(0, pos) + bodyLines(obj, 4, eol) + ',' + eol + raw.slice(pos)
}

const lands = landFiles.map(f => require(path.resolve(f))).map(land => ({ land, built: buildLand(land) }))

// --- сборка по правилам курса ---
// Учебный квест: 10 новых заданий + 3 повторения + 2 авторских на прошлые земли (14–15).
// Повторение без дословных копий: задания с позиций dropTasks (запасные) в своём квесте не показываются,
// а приходят позже как повтор. Правило уже знакомое, предложение новое.
// Порядок повторов от свежего к старому: прошлый квест, четыре квеста назад, затем по очереди всё более старое.
// Квестов «Закрепление» больше нет: они состояли только из копий.
// У каждого задания есть 💡 (правило квеста, откуда задание), у повтора ещё reviewLand для метки «Повторение · земля».

const clone = (t) => JSON.parse(JSON.stringify(t))
// questId квеста: новые земли получают <land>-one, <land>-two…; переделанная старая земля (уже на master) задаёт свои
// прежние id в land.questIds ({ id, aliases }), чтобы у игроков сохранился прогресс пройденных квестов
const questIdOf = (land, i) => land.questIds?.[i]?.id || `${land.id}-${NUM_WORDS[i]}`
const aliasesOf = (land, i) => land.questIds?.[i]?.aliases
const withTip = (t, tip) => (t.tip ? t : { ...t, tip })
const taskKey = (t) => `${t.question}|${t.correctAnswer || t.answer || (t.correctOrder || []).join(' ')}`

// history: по одной записи на учебный квест. reserves: запасные (ещё не показанные), shown: показанные (только на крайний случай)
const history = []
{
	const prev = JSON.parse(fs.readFileSync(path.join(root, 'public/quests/quests-requests-land.json'), 'utf8'))
	prev.slice(0, 7).forEach((q, i) => history.push({
		land: 'requests-land', questId: q.questId, reserves: [],
		shown: q.tasks.filter(t => !t.reviewOf).slice(0, 10).map(t => withTip({ ...clone(t), options: t.options ? shuffle(t.options, 700 + i * 31 + t.id) : undefined }, q.description))
	}))
}
const used = new Set()
const prefer = (list) => [...list.filter(t => t.type === 'input' || t.type === 'reorder'), ...list.filter(t => t.type !== 'input' && t.type !== 'reorder')]
const takeReserve = (e) => {
	const t = prefer(e.reserves).find(x => !used.has(taskKey(x)))
	if (!t) return null
	used.add(taskKey(t))
	return { ...clone(t), reviewOf: e.questId, reviewLand: e.land }
}
const copyWarnings = []

// У каждого квеста 3 запасных задания с ролями: A уходит в следующий квест, B через 4 квеста (прошлая земля),
// C в очередь «давних» (самый старый неиспользованный, не ближе 7 квестов). Так повторы не съедает текущая земля.
const takeRole = (e, role) => {
	const t = e && e.roles && e.roles[role]
	if (!t || used.has(taskKey(t))) return null
	used.add(taskKey(t))
	return { ...clone(t), reviewOf: e.questId, reviewLand: e.land }
}

function reviewsFor(landId) {
	const n = history.length
	const out = []
	// очередь C: самое старое неиспользованное C не новее maxIdx. Чужие A и B никогда не берём, иначе роли рушатся
	const queueC = (maxIdx) => { for (let i = 0; i <= maxIdx; i++) { const r = takeRole(history[i], 'C'); if (r) return r } return null }
	const s1 = takeRole(history[n - 1], 'A') || queueC(n - 2)
	const s2 = takeRole(history[n - 4], 'B') || queueC(n - 2)
	const s3 = queueC(n - 7)
	for (const r of [s1, s2, s3]) if (r) out.push(r)
	// запасных не хватило (самое начало цепочки): берём показанное задание и записываем предупреждение
	for (let i = n - 2; out.length < 3 && i >= 0; i--) {
		const t = history[i].shown.find(x => !used.has(taskKey(x)))
		if (t) { used.add(taskKey(t)); out.push({ ...clone(t), reviewOf: history[i].questId, reviewLand: history[i].land }); copyWarnings.push(`${landId}: копия из ${history[i].questId}`) }
	}
	return out
}

function assemble(land, built) {
	const learn = land.learnCount || 0
	const drop = new Set(land.dropTasks || [])
	const out = []
	built.quests.forEach((raw, qi) => {
		const tip = `${raw.ns}.questDescription`
		let tasks
		if (qi < learn) {
			const fresh = raw.tasks.slice(0, 13).filter(t => !drop.has(t.id)).map(t => withTip(t, tip))
			const reserves = raw.tasks.slice(0, 13).filter(t => drop.has(t.id))
			if (reserves.some(t => t.type === 'dropped')) throw new Error(`${land.id} квест ${qi + 1}: запасные задания (${[...drop].join(', ')}) не написаны, стоит null`)
			const old = raw.tasks.slice(13).map(t => withTip(t, tip))
			const reviews = reviewsFor(land.id)
			tasks = [...fresh, ...reviews, ...old]
			// questId учебного квеста известен заранее: учебные квесты идут первыми
			const res = prefer(reserves.map(t => withTip(t, tip)))
			history.push({ land: land.id, questId: questIdOf(land, qi), reserves: res, roles: { A: res[0], B: res[1], C: res[2] }, shown: fresh })
		} else {
			tasks = raw.tasks.map(t => withTip(t, tip))
		}
		out.push({ ns: raw.ns, tasks, vocabulary: raw.vocabulary })
	})

	return out.map((q, i) => {
		if (q.tasks.length !== 15) throw new Error(`${land.id} квест ${i + 1}: после сборки заданий ${q.tasks.length}, нужно 15`)
		if (q.tasks.some(t => t.type === 'dropped')) throw new Error(`${land.id} квест ${i + 1}: null стоит не на месте dropTasks`)
		return {
			questId: questIdOf(land, i),
			...(aliasesOf(land, i) ? { aliases: aliasesOf(land, i) } : {}),
			title: `${q.ns}.questTitle`,
			progress: '0/15',
			description: `${q.ns}.questDescription`,
			conditions: { goal: `${q.ns}.questGoal`, minCorrect: 15, requiredTasks: 15 },
			rewards: { points: 10, xp: 10 },
			vocabulary: q.vocabulary,
			tasks: q.tasks.map((t, ti) => ({ ...t, id: ti + 1 }))
		}
	})
}

for (const { land, built } of lands) {
	built.quests = assemble(land, built)
	fs.writeFileSync(path.join(root, `public/quests/quests-${land.id}.json`), JSON.stringify(built.quests, null, 2) + '\n')
	console.log(`quests ${land.id}: ${built.quests.length} квестов, ${built.quests.length * 15} заданий`)
}
// --- словари квестов (после сборки, по порядку курса): слово должно встречаться в заданиях своего квеста ---
// Не встречается: переезжает в первый следующий квест, где оно есть (часто это повторение запасного задания), иначе убирается.
// Затем словарь добирается до MIN_VOCAB словами из заданий.
{
	const all = lands.flatMap(({ land, built }) => built.quests.map((q, i) => ({ where: `${land.id} квест ${i + 1}`, q })))
	const tokensOf = q => lexTok(q.tasks.map(t => deOfKey.get(t.question) || [t.answer, t.correctAnswer, t.text, (t.correctOrder || []).join(' ')].join(' ')).join(' '))
	const texts = all.map(({ q }) => tokensOf(q))
	const moves = []
	all.forEach(({ where, q }, i) => {
		const keep = []
		for (const v of q.vocabulary) {
			const core = coreOf(v.word)
			if (core.every(w => wordIn(w, texts[i]))) { keep.push(v); continue }
			const j = texts.findIndex((tk, k) => k > i && core.every(w => wordIn(w, tk)))
			if (j >= 0) {
				if (!all[j].q.vocabulary.some(x => x.word === v.word)) all[j].q.vocabulary.push(v)
				moves.push(`${where}: «${v.word}» → ${all[j].where}`)
			} else moves.push(`${where}: «${v.word}» убрано (нет в заданиях курса)`)
		}
		q.vocabulary = keep
		fillVocab(q.vocabulary, texts[i].join(' '), where)
	})
	console.log(`словарь: перенесено/убрано ${moves.length}${moves.length ? '\n  ' + moves.join('\n  ') : ''}`)
	for (const { land, built } of lands) fs.writeFileSync(path.join(root, `public/quests/quests-${land.id}.json`), JSON.stringify(built.quests, null, 2) + '\n')
}
if (vocabWarnings.length) console.log(`словарь квестов: ${vocabWarnings.length} замечаний\n  ${vocabWarnings.join('\n  ')}`)
else console.log('словарь квестов: у всех минимум 5 слов, все слова есть в заданиях')
if (copyWarnings.length) console.log(`повторы-копии (не хватило запасных заданий): ${copyWarnings.length}\n  ${copyWarnings.join('\n  ')}`)
else console.log('повторы-копии: 0')

for (const l of LANGS) {
	const file = path.join(root, `i18n/locales/${FILES[l]}.json`)
	let raw = fs.readFileSync(file, 'utf8')
	const eol = raw.includes('\r\n') ? '\r\n' : '\n'
	const p4 = JSON.parse(raw).landIntro['past-simple'].p4
	// сначала убираем всё, что генератор писал раньше, затем вставляем заново в том же порядке
	for (const { land, built } of [...lands].reverse()) {
		for (const ns of Object.keys(built.strings[l]).reverse()) raw = removeTop(raw, ns, eol)
		// «Закрепления» больше не генерируются: убираем их старые ключи
		for (const k of [1, 2]) raw = removeTop(raw, `${land.ns}Consolidation${k}`, eol)
		raw = removeNested(raw, 'locationNames', land.id, eol)
		raw = removeNested(raw, 'regions', land.descKey, eol)
		raw = removeNested(raw, 'landIntro', land.id, eol)
	}
	for (const { land, built } of lands) {
		raw = insertTop(raw, built.strings[l], eol)
		raw = insertInto(raw, 'locationNames', { [land.id]: built.name[l] }, eol)
		raw = insertInto(raw, 'regions', { [land.descKey]: built.desc[l] }, eol)
		raw = insertInto(raw, 'landIntro', { [land.id]: { p1: built.intro.p1[l], p2: built.intro.p2[l], p3: built.intro.p3[l], p4 } }, eol)
	}
	JSON.parse(raw) // проверка, что JSON валиден
	fs.writeFileSync(file, raw)
}
console.log('locales ok')

// прогресс хранится по questId без названия земли, поэтому id должны быть уникальны во всём курсе
const seenIds = new Map()
for (const f of fs.readdirSync(path.join(root, 'public/quests'))) {
	for (const q of JSON.parse(fs.readFileSync(path.join(root, 'public/quests', f), 'utf8'))) {
		if (seenIds.has(q.questId)) {
			console.error(`!!! Дубль questId "${q.questId}": ${f} и ${seenIds.get(q.questId)} (прогресс у них будет общий)`)
			process.exitCode = 1
		}
		seenIds.set(q.questId, f)
	}
}

// земля без записи в utils/regions.js не появится на карте
const regionsSrc = fs.readFileSync(path.join(root, 'utils/regions.js'), 'utf8')
const missingRegions = lands.map(({ land }) => land.id).filter(id => !regionsSrc.includes(`id: "${id}"`))
if (missingRegions.length) {
	console.error(`\n!!! Нет в utils/regions.js (на карте их не будет): ${missingRegions.join(', ')}\n`)
	process.exitCode = 1
} else {
	console.log('regions ok: все земли есть на карте')
}
