// Приводит A2 в порядок после перестановки земель. Запуск из корня проекта: node tools/course-gen/a2-order.cjs
// Полный порядок сборки: vocab-old, gen, extra, a2-order, vocab-old. Перезапуск безопасен: задания заменяются по месту, строки локалей пишутся заново.
// Что делает: заменяет задания из a2-order-data.cjs (повторы ведут только на более ранние земли, в ранних землях нет поздних тем),
// дополняет подсказки, ставит метку повтора, обновляет описания контрольных квестов.
const fs = require('fs')
const LANGS = ['ru', 'en', 'uk', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
const FILES = { ru: 'ru-RU', en: 'en-US', uk: 'uk-UA', pl: 'pl-PL', es: 'es-ES', fr: 'fr-FR', tr: 'tr-TR', ro: 'ro-RO', uz: 'uz-UZ', hi: 'hi-IN', ar: 'ar-SA' }
const data = require('./a2-order-data.cjs')
const NS = 'a2Course'

// шаблоны формулировок берём из генератора, чтобы тексты были одинаковыми
const gen = fs.readFileSync(__dirname + '/gen.cjs', 'utf8')
const T = eval('(' + gen.slice(gen.indexOf('const T = {') + 10, gen.indexOf('const ORDINALS')).trim() + ')')

const TIPS = {
	futur: ['Futur I = werden + глагол в начальной форме в конце: Ich werde morgen arbeiten. Формы: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. Часто вместо Futur говорят настоящим временем: Morgen arbeite ich. Futur нужен для обещаний, планов и предположений.', 'Futur I = werden + the base verb at the end: Ich werde morgen arbeiten. Forms: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. People often use the present instead: Morgen arbeite ich. Futur is used for promises, plans and guesses.', 'Futur I = werden + дієслово в початковій формі в кінці: Ich werde morgen arbeiten. Форми: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. Часто замість Futur кажуть теперішнім часом: Morgen arbeite ich. Futur потрібен для обіцянок, планів і припущень.', 'Futur I = werden + bezokolicznik na końcu: Ich werde morgen arbeiten. Formy: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. Często zamiast Futur używa się czasu teraźniejszego: Morgen arbeite ich. Futur służy do obietnic, planów i przypuszczeń.', 'Futur I = werden + infinitivo al final: Ich werde morgen arbeiten. Formas: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. A menudo se usa el presente: Morgen arbeite ich. El Futur sirve para promesas, planes y suposiciones.', 'Futur I = werden + infinitif à la fin : Ich werde morgen arbeiten. Formes : ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. On utilise souvent le présent à la place : Morgen arbeite ich. Le Futur sert aux promesses, aux projets et aux suppositions.', 'Futur I = werden + sonda fiilin mastarı: Ich werde morgen arbeiten. Biçimleri: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. Çoğu zaman yerine şimdiki zaman kullanılır: Morgen arbeite ich. Futur söz, plan ve tahminler içindir.', 'Futur I = werden + infinitivul la final: Ich werde morgen arbeiten. Forme: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. Adesea se folosește prezentul: Morgen arbeite ich. Futurul e pentru promisiuni, planuri și presupuneri.', 'Futur I = werden + oxirida fe’lning asosiy shakli: Ich werde morgen arbeiten. Shakllari: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden. Ko‘pincha hozirgi zamon ishlatiladi: Morgen arbeite ich. Futur va’da, reja va taxminlar uchun kerak.', 'Futur I = werden + अंत में क्रिया का मूल रूप: Ich werde morgen arbeiten. रूप: ich werde, du wirst, er/sie wird, wir werden, ihr werdet, sie/Sie werden। अक्सर इसकी जगह वर्तमान काल बोलते हैं: Morgen arbeite ich. Futur वादों, योजनाओं और अनुमानों के लिए है।', 'Futur I = werden + الفعل في صيغته الأصلية في النهاية: Ich werde morgen arbeiten. الصيغ: ich werde و du wirst و er/sie wird و wir werden و ihr werdet و sie/Sie werden. وكثيرًا ما يُستخدم المضارع بدلًا منه: Morgen arbeite ich. ويُستخدم Futur للوعود والخطط والتوقعات.'],
	perfekt: ['Perfekt = haben или sein на втором месте + причастие в конце: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein берут глаголы движения и смены состояния: gehen, fahren, kommen, aufstehen. Причастие: ge...t у обычных глаголов (gemacht), ge...en у сильных (gesehen). Глаголы на be-, ver-, er- и -ieren без ge-: bezahlt, studiert.', 'Perfekt = haben or sein in second place + the participle at the end: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein goes with verbs of movement and change of state: gehen, fahren, kommen, aufstehen. Participle: ge...t for regular verbs (gemacht), ge...en for strong verbs (gesehen). Verbs in be-, ver-, er- and -ieren have no ge-: bezahlt, studiert.', 'Perfekt = haben або sein на другому місці + дієприкметник у кінці: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein беруть дієслова руху й зміни стану: gehen, fahren, kommen, aufstehen. Дієприкметник: ge...t у звичайних дієслів (gemacht), ge...en у сильних (gesehen). Дієслова на be-, ver-, er- та -ieren без ge-: bezahlt, studiert.', 'Perfekt = haben lub sein na drugim miejscu + imiesłów na końcu: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein łączy się z czasownikami ruchu i zmiany stanu: gehen, fahren, kommen, aufstehen. Imiesłów: ge...t przy regularnych (gemacht), ge...en przy mocnych (gesehen). Czasowniki na be-, ver-, er- i -ieren są bez ge-: bezahlt, studiert.', 'Perfekt = haben o sein en segunda posición + participio al final: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein va con verbos de movimiento y cambio de estado: gehen, fahren, kommen, aufstehen. Participio: ge...t en los regulares (gemacht), ge...en en los fuertes (gesehen). Los verbos en be-, ver-, er- e -ieren no llevan ge-: bezahlt, studiert.', 'Perfekt = haben ou sein en deuxième position + participe à la fin : Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein va avec les verbes de mouvement et de changement d’état : gehen, fahren, kommen, aufstehen. Participe : ge...t pour les verbes réguliers (gemacht), ge...en pour les verbes forts (gesehen). Les verbes en be-, ver-, er- et -ieren n’ont pas de ge- : bezahlt, studiert.', 'Perfekt = ikinci sırada haben veya sein + sonda ortaç: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein, hareket ve durum değişikliği fiilleriyle kullanılır: gehen, fahren, kommen, aufstehen. Ortaç: düzenli fiillerde ge...t (gemacht), kuvvetli fiillerde ge...en (gesehen). be-, ver-, er- ve -ieren fiillerinde ge- yoktur: bezahlt, studiert.', 'Perfekt = haben sau sein pe locul doi + participiul la final: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein merge cu verbele de mișcare și schimbare de stare: gehen, fahren, kommen, aufstehen. Participiul: ge...t la verbele regulate (gemacht), ge...en la cele tari (gesehen). Verbele în be-, ver-, er- și -ieren nu au ge-: bezahlt, studiert.', 'Perfekt = ikkinchi o‘rinda haben yoki sein + oxirida sifatdosh: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein harakat va holat o‘zgarishi fe’llari bilan keladi: gehen, fahren, kommen, aufstehen. Sifatdosh: oddiy fe’llarda ge...t (gemacht), kuchli fe’llarda ge...en (gesehen). be-, ver-, er- va -ieren fe’llarida ge- bo‘lmaydi: bezahlt, studiert.', 'Perfekt = दूसरे स्थान पर haben या sein + अंत में कृदंत: Ich habe Brot gekauft. Wir sind nach Berlin gefahren. sein गति और अवस्था बदलने वाली क्रियाओं के साथ आता है: gehen, fahren, kommen, aufstehen। कृदंत: सामान्य क्रियाओं में ge...t (gemacht), सशक्त क्रियाओं में ge...en (gesehen)। be-, ver-, er- और -ieren वाली क्रियाओं में ge- नहीं होता: bezahlt, studiert.', 'Perfekt = haben أو sein في المكان الثاني + اسم المفعول في النهاية: Ich habe Brot gekauft. و Wir sind nach Berlin gefahren. يأتي sein مع أفعال الحركة وتغير الحالة: gehen و fahren و kommen و aufstehen. اسم المفعول: ge...t في الأفعال العادية (gemacht) و ge...en في القوية (gesehen). والأفعال التي تبدأ بـ be- و ver- و er- أو تنتهي بـ -ieren بلا ge-: bezahlt و studiert.']
}
const DESC = {
	'pastSimpleEight.questDescription': ['Проверяем прошедшее время: war, hatte и модальные глаголы konnte, musste, wollte, durfte, sollte.', 'A test on the past: war, hatte and the modal verbs konnte, musste, wollte, durfte, sollte.', 'Перевіряємо минулий час: war, hatte й модальні дієслова konnte, musste, wollte, durfte, sollte.', 'Sprawdzamy czas przeszły: war, hatte i czasowniki modalne konnte, musste, wollte, durfte, sollte.', 'Comprobamos el pasado: war, hatte y los verbos modales konnte, musste, wollte, durfte, sollte.', 'On vérifie le passé : war, hatte et les verbes modaux konnte, musste, wollte, durfte, sollte.', 'Geçmiş zamanı sınıyoruz: war, hatte ve modal fiiller konnte, musste, wollte, durfte, sollte.', 'Verificăm trecutul: war, hatte și verbele modale konnte, musste, wollte, durfte, sollte.', 'O‘tgan zamonni tekshiramiz: war, hatte va modal fe’llar konnte, musste, wollte, durfte, sollte.', 'भूतकाल की जाँच: war, hatte और मोडल क्रियाएँ konnte, musste, wollte, durfte, sollte.', 'نختبر الماضي: war و hatte والأفعال المساعدة konnte و musste و wollte و durfte و sollte.'],
	'placePrepositionsEight.questDescription': ['Проверяем все предлоги места: in, auf, an, unter, über, vor, hinter, neben, zwischen, и повторяем Dativ: dem, der, dem.', 'A test on all place prepositions: in, auf, an, unter, über, vor, hinter, neben, zwischen, and a review of the Dativ: dem, der, dem.', 'Перевіряємо всі прийменники місця: in, auf, an, unter, über, vor, hinter, neben, zwischen, і повторюємо Dativ: dem, der, dem.', 'Sprawdzamy wszystkie przyimki miejsca: in, auf, an, unter, über, vor, hinter, neben, zwischen, i powtarzamy celownik: dem, der, dem.', 'Comprobamos todas las preposiciones de lugar: in, auf, an, unter, über, vor, hinter, neben, zwischen, y repasamos el dativo: dem, der, dem.', 'On vérifie toutes les prépositions de lieu : in, auf, an, unter, über, vor, hinter, neben, zwischen, et on révise le datif : dem, der, dem.', 'Tüm yer edatlarını sınıyoruz: in, auf, an, unter, über, vor, hinter, neben, zwischen, ve Dativ’i tekrar ediyoruz: dem, der, dem.', 'Verificăm toate prepozițiile de loc: in, auf, an, unter, über, vor, hinter, neben, zwischen, și recapitulăm dativul: dem, der, dem.', 'Barcha joy predloglarini tekshiramiz: in, auf, an, unter, über, vor, hinter, neben, zwischen, va Dativni takrorlaymiz: dem, der, dem.', 'स्थान के सभी पूर्वसर्गों की जाँच: in, auf, an, unter, über, vor, hinter, neben, zwischen, और Dativ का दोहराव: dem, der, dem.', 'نختبر كل حروف المكان: in و auf و an و unter و über و vor و hinter و neben و zwischen، ونراجع Dativ: dem و der و dem.']
}

const REGIONS = fs.readFileSync('utils/regions.js', 'utf8')
const mapOrder = [...REGIONS.matchAll(/id: "([^"]+)"/g)].map(m => m[1])
const loadLand = l => JSON.parse(fs.readFileSync(`public/quests/quests-${l}.json`, 'utf8'))
const quests = {}
const owner = {}
for (const f of fs.readdirSync('public/quests')) {
	const land = f.replace(/^quests-|\.json$/g, '')
	for (const q of JSON.parse(fs.readFileSync('public/quests/' + f, 'utf8'))) { quests[q.questId] = q; owner[q.questId] = land; (q.aliases || []).forEach(a => { owner[a] = land; quests[a] = q }) }
}

const shuffle = (arr, seed) => { const a = [...arr]; let s = seed; for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const fill = (tpl, n, de) => tpl.replace('{n}', n).replace('{de}', de || '')
const strings = Object.fromEntries(LANGS.map(l => [l, {}]))
const touched = {}
const put = (key, f) => LANGS.forEach((l, i) => { strings[l][key] = f(l, i) })

data.forEach((row, idx) => {
	const [land, qn, id, kind, n] = row
	const lands = touched[land] ||= loadLand(land)
	const q = lands[qn - 1]
	const t = q.tasks.find(x => x.id === id)
	if (!t) throw new Error(`${land} ${qn}#${id}: нет задания`)
	if (n.length !== 11) throw new Error(`${land} ${qn}#${id}: переводов ${n.length}`)
	n.forEach(s => { if (/[—–]/.test(s)) throw new Error('тире: ' + s) })
	const key = 't' + (idx + 1)
	const question = `${NS}.${key}`
	const seed = idx * 7 + 11
	let task
	if (kind === 'ro') {
		const [, , , , , sentence, dis] = row
		const order = sentence.split(' ')
		put(key, (l, i) => fill(T[l].ro, n[i]))
		task = { id, type: 'reorder', question, words: shuffle([...order, ...dis], seed), correctOrder: order }
	} else if (kind === 'gv' || kind === 'gw') {
		const [, , , , , de, answer] = row
		if (!de.includes('___')) throw new Error('нет пропуска: ' + de)
		put(key, (l, i) => fill(T[l][kind], n[i], de))
		task = { id, type: 'input', question, correctAnswer: answer }
	} else if (kind === 'ok' || kind === 'tr') {
		const [, , , , , options, answer] = row
		if (!options.includes(answer)) throw new Error('нет ответа: ' + answer)
		put(key, (l, i) => fill(T[l][kind], n[i]))
		task = { id, type: 'select', question, options: shuffle(options, seed), answer }
	} else if (kind === 'rd') {
		const [, , , , , text, options, answer] = row
		put(key, (l, i) => n[i])
		task = { id, type: 'readAndAnswer', question, text, options: shuffle(options, seed), answer }
	} else throw new Error('тип ' + kind)
	const src = row[row.length - 1]
	if (src) {
		if (!quests[src]) throw new Error('нет квеста ' + src)
		if (mapOrder.indexOf(owner[src]) > mapOrder.indexOf(land)) throw new Error(`${land}: повтор ведёт вперёд, ${src}`)
		task.reviewOf = src
		task.reviewLand = owner[src]
		task.tip = quests[src].description
	} else task.tip = q.description
	q.tasks[q.tasks.indexOf(t)] = task
})

// слова в словарях квестов (добавляются, если их там ещё нет)
for (const [land, qn, word, ...tr] of data.vocab) {
	if (tr.length !== 11) throw new Error(`${land} ${word}: переводов ${tr.length}`)
	const list = touched[land] ||= loadLand(land)
	const q = list[qn - 1]
	if (q.vocabulary.some(v => v.word === word)) continue
	q.vocabulary.push({ word, ...Object.fromEntries(LANGS.map((l, i) => [`translation-${l}`, tr[i]])) })
}

// подсказки и метки повторов во всех ручных землях A2
const HAND = ['past-simple', 'past-land', 'place-prepositions', 'direction-prepositions', 'action-prepositions', 'action-valley', 'requests-land', 'order-valley', 'edge-images', 'secret-lands', 'definite-indefinite', 'future-land', 'time-gate']
put('tipFutur', (l, i) => TIPS.futur[i])
put('tipPerfekt', (l, i) => TIPS.perfekt[i])
for (const land of HAND) {
	const list = touched[land] ||= loadLand(land)
	for (const q of list) for (const t of q.tasks) {
		if (t.reviewOf && !t.reviewLand && owner[t.reviewOf]) t.reviewLand = owner[t.reviewOf]
		if (t.tip) continue
		if (land === 'future-land') t.tip = `${NS}.tipFutur`
		else if (land === 'past-land') t.tip = `${NS}.tipPerfekt`
		else t.tip = (t.reviewOf && quests[t.reviewOf]?.description) || q.description
	}
}
for (const [land, list] of Object.entries(touched)) fs.writeFileSync(`public/quests/quests-${land}.json`, JSON.stringify(list, null, 2) + '\n')

// проверка: повторы не ведут на более поздние земли
let bad = 0
for (const [land, list] of Object.entries(touched)) for (const q of list) for (const t of q.tasks) {
	const src = t.reviewLand || owner[t.reviewOf]
	if (src && mapOrder.indexOf(src) > mapOrder.indexOf(land)) { bad++; console.error(`${land} ${q.questId}#${t.id} ведёт вперёд на ${src}`) }
}

// строки локалей: блок a2Course пишется заново, описания заменяются по значению
for (const l of LANGS) {
	const file = `i18n/locales/${FILES[l]}.json`
	let raw = fs.readFileSync(file, 'utf8')
	const eol = raw.includes('\r\n') ? '\r\n' : '\n'
	const marker = `${eol}  "${NS}": {${eol}`
	const start = raw.indexOf(marker)
	if (start !== -1) {
		const close = `${eol}  }`
		let stop = raw.indexOf(close, start + 1) + close.length
		if (raw[stop] === ',') stop++
		raw = raw.slice(0, start) + raw.slice(stop)
	}
	const body = JSON.stringify({ [NS]: strings[l] }, null, 2).split('\n').slice(1, -1).join(eol)
	raw = raw.replace(/^\{\r?\n/, `{${eol}${body},${eol}`)
	const parsed = JSON.parse(raw)
	for (const [key, vals] of Object.entries(DESC)) {
		const [a, b] = key.split('.')
		const old = parsed[a]?.[b]
		if (old === undefined) throw new Error(`${l}: нет ${key}`)
		const next = vals[LANGS.indexOf(l)]
		if (old !== next) raw = raw.replace(`"${b}": ${JSON.stringify(old)}`, `"${b}": ${JSON.stringify(next)}`)
	}
	JSON.parse(raw)
	fs.writeFileSync(file, raw)
}
console.log(`заменено заданий ${data.length}, земель изменено ${Object.keys(touched).length}, повторов вперёд ${bad}`)
if (bad) process.exitCode = 1
