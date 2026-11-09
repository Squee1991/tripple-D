// Исправления ошибок в старых землях A1 (ручные JSON). Запуск из корня проекта: node tools/course-gen/a1-old-fix.cjs
// Перезапуск безопасен: каждая правка проверяет старое значение или уже применённое новое.
const fs = require('fs')
const LANGS = { ru: 'ru-RU', en: 'en-US', uk: 'uk-UA', pl: 'pl-PL', es: 'es-ES', fr: 'fr-FR', tr: 'tr-TR', ro: 'ro-RO', uz: 'uz-UZ', hi: 'hi-IN', ar: 'ar-SA' }
const raws = Object.fromEntries(Object.entries(LANGS).map(([k, f]) => [k, fs.readFileSync(`i18n/locales/${f}.json`, 'utf8')]))
const parsed = Object.fromEntries(Object.entries(raws).map(([k, r]) => [k, JSON.parse(r)]))
const get = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o)
const isKey = s => typeof s === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+$/.test(s)
const file = {}
const land = l => (file[l] ||= JSON.parse(fs.readFileSync(`public/quests/quests-${l}.json`, 'utf8')))
const task = (l, q, id) => land(l)[q - 1].tasks.find(t => t.id === id)
const shuffle = (arr, seed) => { const a = [...arr]; let s = seed; for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
let n = 0
// сборка предложения: лишние плашки сохраняются
function order(l, q, id, sentence) {
	const t = task(l, q, id)
	const next = sentence.split(' ')
	if (t.correctOrder.join(' ') === sentence) return
	const dis = [...t.words]; for (const w of t.correctOrder) { const i = dis.indexOf(w); if (i >= 0) dis.splice(i, 1) }
	t.correctOrder = next
	t.words = shuffle([...next, ...dis], q * 100 + id)
	n++
}
function speech(l, q, id, s) { const t = task(l, q, id); if (t.answer === s) return; t.answer = s; t.text = s; n++ }
// значение локали по ключу, во всех языках или в одном
function setKey(key, values) {
	for (const [lang, val] of Object.entries(values)) {
		const cur = get(parsed[lang], key)
		if (cur === val) continue
		if (typeof cur !== 'string') throw new Error(`${lang}: нет ${key}`)
		const prop = key.split('.').pop()
		const from = `"${prop}": ${JSON.stringify(cur)}`
		if (!raws[lang].includes(from)) throw new Error(`${lang}: не найдено ${from}`)
		// ключ может повторяться в разных объектах: меняем в границах своего объекта
		const obj = key.split('.')[0]
		const eol = raws[lang].includes('\r\n') ? '\r\n' : '\n'
		const a = raws[lang].indexOf(`${eol}  "${obj}": {`); const b = raws[lang].indexOf(`${eol}  }`, a + 1)
		raws[lang] = raws[lang].slice(0, a) + raws[lang].slice(a, b).replace(from, `"${prop}": ${JSON.stringify(val)}`) + raws[lang].slice(b)
		n++
	}
}
// вариант ответа: литерал или ключ локали с немецким текстом
function option(l, q, id, oldV, newV) {
	const t = task(l, q, id)
	const keys = (t.options || []).filter(isKey)
	let done = false
	for (const k of keys) for (const lang of Object.keys(LANGS)) if (get(parsed[lang], k) === oldV) { setKey(k, { [lang]: newV }); done = true }
	if (t.options) t.options = t.options.map(o => (o === oldV ? ((done = true), newV) : o))
	if (t.answer === oldV) { t.answer = newV; done = true }
	if (!done && !(t.options || []).includes(newV)) console.log(`вариант не найден: ${l} ${q}#${id} ${oldV}`)
	n++
}

order('lake-ruins', 1, 5, 'Heute ist es sonnig')
order('future-land', 4, 9, 'Werdet ihr Saft oder Cola trinken')
order('north-cliffs', 9, 14, 'Wo ist Bahnsteig 3')
order('north-cliffs', 12, 6, 'Wo ist Bahnsteig 2')
order('north-cliffs', 10, 5, 'Wo ist Gate A12')
{ const a = task('north-cliffs', 7, 14), b = task('north-cliffs', 6, 14); if (a && b) { a.options = [...b.options]; a.answer = b.answer; n++ } }
order('storm-coast', 6, 3, 'Die Party ist am 3. April')
order('storm-coast', 7, 7, 'Ich bringe Getränke und Nüsse mit')
setKey('questsStormCoastsFirstQuests.questFourteen', { ru: 'Собери прощание до встречи' })

for (const [q, id, s] of [[1, 4, 'Ich arbeite heute'], [1, 6, 'Ich arbeite heute bis 18 Uhr'], [1, 11, 'Ich habe keine Zeit'], [1, 13, 'Ich kann heute nicht arbeiten'], [2, 4, 'Ich arbeite zu Hause'], [2, 7, 'Ich arbeite im Büro'], [2, 11, 'Ich gehe ins Büro'], [2, 13, 'Heute arbeite ich zu Hause'], [2, 15, 'Morgen arbeite ich im Büro'], [3, 4, 'Meine Kollegin ist gerade beschäftigt'], [3, 7, 'Wir arbeiten zusammen'], [3, 11, 'Meine Kollegin hilft mir heute'], [4, 4, 'Ich beginne meine Arbeit um 8 Uhr'], [4, 6, 'Ich mache eine Pause'], [4, 13, 'Ich mache heute um sechzehn Uhr Feierabend'], [5, 4, 'Können Sie mir das zeigen'], [5, 7, 'Ich kann Ihnen helfen'], [5, 14, 'Können Sie das erklären'], [7, 7, 'Wann kommt der LKW'], [7, 11, 'Ich komme zehn Minuten zu spät'], [13, 4, 'Ich bekomme Geld'], [13, 7, 'Ich habe einen Vertrag'], [13, 13, 'Ich zahle Steuern in Deutschland'], [14, 4, 'Ich muss zum Arzt gehen'], [14, 5, 'Ich melde mich heute krank'], [14, 8, 'Hier ist meine Krankschreibung'], [14, 10, 'Wie lange sind Sie krankgeschrieben'], [14, 13, 'Ich bin drei Tage krankgeschrieben']]) order('master-lands', q, id, s)
speech('master-lands', 5, 6, 'Ich helfe dir')
speech('master-lands', 7, 15, 'Ich bin pünktlich')
speech('master-lands', 9, 15, 'Ich habe heute frei')
speech('master-lands', 12, 8, 'Welche Menge? Die Menge ist zwei')
speech('master-lands', 1, 15, 'Ich suche Arbeit bei einer Firma')
order('master-lands', 11, 4, 'Hilf mir das zu tragen')
option('master-lands', 11, 1, 'Schnell', 'schnell'); option('master-lands', 11, 1, 'Langsam', 'langsam'); option('master-lands', 11, 1, 'Später', 'später')

order('wild-lands', 4, 14, 'Das Wasser im See ist klar')
order('wild-lands', 5, 11, 'Im Wald regnet es aber in den Bergen scheint die Sonne')
order('wild-lands', 6, 10, 'Im Winter ist der Wald weiß')
order('wild-lands', 11, 5, 'Der Vogel sitzt auf dem Stein')
order('wild-lands', 15, 4, 'Der Fluss fließt ins Meer')
option('wild-lands', 5, 12, 'nicht Warm', 'nicht warm'); option('wild-lands', 5, 12, 'sehr Warm', 'sehr warm')
for (const [q, id, list] of [[9, 8, ['Tief', 'Teuer', 'Trocken']], [10, 9, ['Still', 'Stark']], [13, 10, ['Schwarz', 'Weiß', 'Schön']], [14, 7, ['Fliegen', 'Fallen', 'Fließen']], [14, 10, ['Bunt', 'Blau', 'Braun']]]) for (const w of list) option('wild-lands', q, id, w, w.toLowerCase())
option('wild-lands', 9, 5, 'Es geht hoch und tief', 'Es gibt Berge und Täler')
option('wild-lands', 10, 7, 'Sie ist dort gesund', 'Sie ist sauber')

const ask = (l, q, id) => task(l, q, id).question
setKey(ask('wild-lands', 13, 6), { ru: 'Что случилось с деревом?', en: 'What happens to the tree?', uk: 'Що сталося з деревом?', pl: 'Co stało się z drzewem?', es: '¿Qué le pasa al árbol?', fr: 'Qu’arrive-t-il à l’arbre ?', tr: 'Ağaca ne oluyor?', ro: 'Ce se întâmplă cu copacul?', uz: 'Daraxtga nima bo‘ldi?', hi: 'पेड़ को क्या हुआ?', ar: 'ماذا حدث للشجرة؟' })
setKey(ask('wild-lands', 15, 12), { ru: 'Где спит медведь?', en: 'Where is the bear sleeping?', uk: 'Де спить ведмідь?', pl: 'Gdzie śpi niedźwiedź?', es: '¿Dónde duerme el oso?', fr: 'Où dort l’ours ?', tr: 'Ayı nerede uyuyor?', ro: 'Unde doarme ursul?', uz: 'Ayiq qayerda uxlaydi?', hi: 'भालू कहाँ सो रहा है?', ar: 'أين ينام الدب؟' })
setKey(ask('wild-lands', 4, 2), { ru: 'Прослушайте и напишите услышанное' })
{ const k = ask('wild-lands', 10, 9); setKey(k, { ru: get(parsed.ru, k).replace('скахать', 'сказать') }) }
{ const k = ask('master-lands', 2, 7); setKey(k, { ru: get(parsed.ru, k).replace('в бюро', 'в офисе') }) }
{ const k = ask('master-lands', 13, 10); setKey(k, { ru: get(parsed.ru, k).replace('(подписывать:', '(подписывать):') }) }
setKey('pastValleyQuestSeven.questTwelveTip', { uk: get(parsed.uk, 'pastValleyQuestSeven.questTwelveTip').replace('spreчен', 'gesprochen') })

for (const [l, data] of Object.entries(file)) fs.writeFileSync(`public/quests/quests-${l}.json`, JSON.stringify(data, null, 2) + '\n')
for (const [k, f] of Object.entries(LANGS)) { JSON.parse(raws[k]); fs.writeFileSync(`i18n/locales/${f}.json`, raws[k]) }
console.log('правок', n)
