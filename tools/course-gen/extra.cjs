// Дополнительные квесты для земель, которые собраны вручную (не через gen.cjs):
// place-prepositions, direction-prepositions, action-prepositions, past-simple, requests-land.
// Запуск из корня проекта: node tools/course-gen/extra.cjs
// Каждый файл в tools/course-gen/extra/ описывает 2 квеста в формате земель генератора (по 15 заданий, без запасных)
// и куда их вставить: { file, ns, ids, before, quests }. Новые questId не совпадают со старыми, поэтому прогресс сохраняется.
// Перезапуск безопасен: свои квесты и ключи локалей скрипт сначала удаляет.
const fs = require('fs')
const path = require('path')
const root = process.cwd()

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
const ORD = ['One', 'Two']

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
	arr.forEach((s, i) => { if (/[—–]/.test(s)) throw new Error(`${what} (${LANGS[i]}): длинное тире запрещено`) })
	return Object.fromEntries(LANGS.map((l, i) => [l, arr[i]]))
}
const fill = (tpl, n, de) => tpl.replace('{n}', n).replace('{de}', de || '')

function build(def) {
	const strings = Object.fromEntries(LANGS.map(l => [l, {}]))
	const quests = def.quests.map((q, qi) => {
		const ns = def.ns + ORD[qi]
		const where = `${def.file} доп. квест ${qi + 1}`
		if (q.tasks.length !== 15) throw new Error(`${where}: заданий ${q.tasks.length}, нужно 15`)
		if (q.vocab.length < 5) throw new Error(`${where}: в словаре меньше 5 слов`)
		const title = byLang(q.title, where + ' title')
		const desc = byLang(q.desc, where + ' desc')
		LANGS.forEach(l => { strings[l][ns] = { questTitle: title[l], questDescription: desc[l], questGoal: T[l].goal } })
		const tip = `${ns}.questDescription`
		const tasks = q.tasks.map((task, ti) => {
			const id = ti + 1
			const [kind] = task
			const key = `${ns}.questTask${id}`
			const seed = (qi + 21) * 100 + id
			const tw = `${where} задание ${id}`
			const put = texts => LANGS.forEach(l => { strings[l][ns]['questTask' + id] = texts[l] })
			if (kind === 'tr' || kind === 'ok') {
				const [, n, options, answer] = task
				if (!options.includes(answer)) throw new Error(`${tw}: ответа нет в вариантах`)
				const nn = byLang(n, tw)
				put(Object.fromEntries(LANGS.map(l => [l, fill(T[l][kind], nn[l])])))
				return { id, type: 'select', question: key, options: shuffle(options, seed), answer, tip }
			}
			if (kind === 'ro') {
				const [, n, sentence, distractors = []] = task
				const order = sentence.split(' ')
				const nn = byLang(n, tw)
				put(Object.fromEntries(LANGS.map(l => [l, fill(T[l].ro, nn[l])])))
				return { id, type: 'reorder', question: key, words: shuffle([...order, ...distractors], seed), correctOrder: order, tip }
			}
			if (kind === 'gv' || kind === 'ga' || kind === 'gw') {
				const [, n, de, answer] = task
				if (!de.includes('___')) throw new Error(`${tw}: нет пропуска ___`)
				if (answer.includes(' ')) throw new Error(`${tw}: ответ должен быть одним словом`)
				const nn = byLang(n, tw)
				put(Object.fromEntries(LANGS.map(l => [l, fill(T[l][kind], nn[l], de)])))
				return { id, type: 'input', question: key, correctAnswer: answer, tip }
			}
			if (kind === 'rd') {
				const [, qn, text, options, answer] = task
				if (!options.includes(answer)) throw new Error(`${tw}: ответа нет в вариантах`)
				put(byLang(qn, tw))
				return { id, type: 'readAndAnswer', question: key, text, options: shuffle(options, seed), answer, tip }
			}
			throw new Error(`${tw}: неизвестный тип ${kind}`)
		})
		const vocabulary = q.vocab.map(([word, ...tr]) => {
			const t = byLang(tr, `${where} слово ${word}`)
			return { word, ...Object.fromEntries(LANGS.map(l => [`translation-${l}`, t[l]])) }
		})
		return {
			questId: def.ids[qi],
			title: `${ns}.questTitle`,
			progress: '0/15',
			description: `${ns}.questDescription`,
			conditions: { goal: `${ns}.questGoal`, minCorrect: 15, requiredTasks: 15 },
			rewards: { points: 10, xp: 10 },
			vocabulary,
			tasks
		}
	})
	return { quests, strings }
}

function bodyLines(obj, indent, eol) {
	return JSON.stringify(obj, null, 2).split('\n').slice(1, -1).map(line => ' '.repeat(indent - 2) + line).join(eol)
}
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

const defs = fs.readdirSync(path.join(__dirname, 'extra')).filter(f => f.endsWith('.cjs')).map(f => require(path.join(__dirname, 'extra', f)))
const built = defs.map(def => ({ def, ...build(def) }))

for (const { def, quests } of built) {
	const file = path.join(root, `public/quests/quests-${def.file}.json`)
	let list = JSON.parse(fs.readFileSync(file, 'utf8')).filter(q => !def.ids.includes(q.questId))
	const at = list.findIndex(q => q.questId === def.before)
	if (at < 0) throw new Error(`${def.file}: нет квеста ${def.before}`)
	list.splice(at, 0, ...quests)
	const ids = new Set()
	for (const q of list) { if (ids.has(q.questId)) throw new Error(`${def.file}: дубль questId ${q.questId}`); ids.add(q.questId) }
	fs.writeFileSync(file, JSON.stringify(list, null, 2) + '\n')
	console.log(`quests ${def.file}: ${list.length} квестов`)
}

for (const l of LANGS) {
	const file = path.join(root, `i18n/locales/${FILES[l]}.json`)
	let raw = fs.readFileSync(file, 'utf8')
	const eol = raw.includes('\r\n') ? '\r\n' : '\n'
	for (const { strings } of built) for (const ns of Object.keys(strings[l])) raw = removeTop(raw, ns, eol)
	const all = Object.assign({}, ...built.map(b => b.strings[l]))
	raw = raw.replace(/^\{\r?\n/, `{${eol}${bodyLines(all, 2, eol)},${eol}`)
	JSON.parse(raw)
	fs.writeFileSync(file, raw)
}
console.log('locales ok')
