// Словарь квестов: лексикон курса, поиск слова в заданиях и добор словаря до MIN_VOCAB слов.
// Общий для gen.cjs (сгенерированные земли) и vocab-old.cjs (земли, сделанные вручную).
const fs = require('fs')
const path = require('path')
const LANGS = ['ru', 'en', 'uk', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']

// --- словарь квеста: минимум MIN_VOCAB слов, и все слова встречаются в заданиях этого квеста ---
// (жалобы учеников: учат слова, которых нет в занятии). Если автор дал меньше, генератор добавляет слова
// из самих заданий: новые для ученика в первую очередь, переводы берёт из словарей квестов, words.json и verbs.json.
const MIN_VOCAB = 5
const lexTok = s => String(s || '').toLowerCase().replace(/[.,!?:;„“"()…«»]/g, ' ').split(/\s+/).filter(Boolean)
const coreOf = word => lexTok(word).filter(w => !['der', 'die', 'das', 'ein', 'eine', 'einen', 'sich', 'auf', 'an', 'mit', 'von', 'für', 'über', 'um'].includes(w))
const NOT_VOCAB = new Set(['sein', 'haben', 'werden', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'mögen', 'möchten', 'machen', 'gehen', 'kommen', 'geben', 'sagen', 'gewesen', 'geworden', 'gehabt', 'war', 'hatte', 'wurde'])
// отделяемые приставки, которые в формах глагола стоят отдельным словом в конце
const PARTICLES = new Set(['zurück', 'vorbei', 'fern', 'weg', 'los', 'ein', 'aus', 'auf', 'ab', 'an', 'mit', 'nach', 'vor', 'zu', 'her', 'hin', 'um', 'herein', 'heraus', 'kennen', 'statt', 'fest', 'teil', 'zusammen', 'weiter', 'spazieren'])
// возвратные местоимения в конце формы («fühle mich»): тоже не связываем с глаголом
const PRONOUNS = new Set(['mich', 'dich', 'sich', 'uns', 'euch', 'mir', 'dir'])
const LEX = new Map() // словоформа -> { word, tr: { ru: .., en: .. } }
const lexAdd = (form, entry) => { const f = form.toLowerCase(); if (f && !LEX.has(f)) LEX.set(f, entry) }
const vocabEntry = (word, tr) => ({ word, tr })
{
	// 1) авторские словари земель и готовых квестов (лучшие переводы)
	const langsOf = v => Object.fromEntries(LANGS.map(l => [l, v[`translation-${l}`]]))
	const fromLands = require('./lands/index.cjs').flatMap(f => require(path.join(__dirname, 'lands', f)).quests.flatMap(q => q.vocab))
		.map(([word, ...tr]) => vocabEntry(word, Object.fromEntries(LANGS.map((l, i) => [l, tr[i]]))))
	const fromJson = fs.readdirSync(path.join(process.cwd(), 'public/quests')).flatMap(f => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/quests', f), 'utf8')))
		.flatMap(q => q.vocabulary || []).filter(v => LANGS.every(l => v[`translation-${l}`])).map(v => vocabEntry(v.word, langsOf(v)))
	// фразы-шаблоны («um … zu», «Das ist...») не привязываем к служебному слову, иначе они попадают в словарь любого квеста с «zu» или «ist»
	const TEMPLATE = /…|\.\.\./
	const FUNCTION_WORDS = new Set(['ist', 'sind', 'bin', 'bist', 'seid', 'hat', 'habe', 'zu', 'und', 'oder', 'aber', 'nicht', 'es'])
	for (const e of [...fromLands, ...fromJson]) { const c = coreOf(e.word); if (c.length === 1 && !TEMPLATE.test(e.word) && !FUNCTION_WORDS.has(c[0])) lexAdd(c[0], e) }
	// 2) существительные из public/words.json
	const low1 = s => (s ? s[0].toLocaleLowerCase() + s.slice(1) : s)
	for (const w of Object.values(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/words.json'), 'utf8'))).flat()) {
		if (!w.de || !w.article || LANGS.some(l => !w[l])) continue
		const e = vocabEntry(`${w.article} ${w.de}`, Object.fromEntries(LANGS.map(l => [l, low1(w[l])])))
		lexAdd(w.de, e)
		// множественное число ведёт к той же записи, что и единственное (Freunde → «друг», а не другое значение из words.json)
		if (w.plural) lexAdd(w.plural, LEX.get(w.de.toLowerCase()))
	}
	// 3) глаголы из public/verbs.json со всеми формами
	const verbs = Object.values(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/verbs.json'), 'utf8'))).flat()
	for (const v of verbs) {
		if (!v || !v.infinitive || LANGS.some(l => !v.translations?.[l])) continue
		const e = vocabEntry(v.infinitive, Object.fromEntries(LANGS.map(l => [l, v.translations[l].replace(/\s*\([^)]*\)/g, '').trim()])))
		lexAdd(v.infinitive, e)
		// у отделяемых глаголов последнее слово формы это приставка («schlafe ein»), у возвратных местоимение:
		// их не связываем с глаголом, иначе любое «ein» или «mich» в задании приводило бы в словарь «einschlafen» или «fühlen»
		for (const c of ['conjugation_pres', 'conjugation_past', 'conjugation_perf']) for (const f of Object.values(v[c] || {})) {
			const toks = lexTok(f)
			const last = toks.pop()
			if (toks.length && (PARTICLES.has(last) || PRONOUNS.has(last))) continue
			lexAdd(last, e)
		}
	}
}
// когда слово впервые попало в словарь курса (порядок земель): новые слова важнее давно известных
const taughtAt = new Map()
{
	const order = ['east-plain', 'stone-reach', 'wind-valley', 'lake-ruins', 'north-cliffs', 'storm-coast', 'master-lands', 'wild-lands', 'future-land', 'past-land', 'action-valley', 'order-valley', 'time-gate', 'edge-images', 'secret-lands', 'definite-indefinite', 'place-prepositions', 'direction-prepositions', 'action-prepositions', 'past-simple', 'requests-land']
	order.forEach((land, i) => JSON.parse(fs.readFileSync(path.join(process.cwd(), `public/quests/quests-${land}.json`), 'utf8'))
		.forEach(q => (q.vocabulary || []).forEach(v => { if (!taughtAt.has(v.word)) taughtAt.set(v.word, i) })))
}
let vocabStep = 100
const vocabWarnings = []
const deUml = s => s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
const ABLAUT = { fall: 'fiel', schlaf: 'schlief', lauf: 'lief', nehm: 'nahm|nimm|genommen', komm: 'kam', steh: 'stand', spring: 'sprang|gesprungen', seh: 'sah|sieh', find: 'fand|gefunden', geb: 'gab|gib', treff: 'traf|triff|getroffen', fahr: 'fuhr', les: 'las|lies', schreib: 'schrieb', bleib: 'blieb', ess: 'ass|isst|gegessen', trink: 'trank|getrunken', sprech: 'sprach|sprich|gesprochen', helf: 'half|hilf|geholfen', ruf: 'rief', denk: 'dachte|gedacht', bring: 'brachte|gebracht', wiss: 'weiss|wusste', verlier: 'verlor', vergess: 'vergass|vergiss', beginn: 'begann|begonnen', gewinn: 'gewann|gewonnen', schwimm: 'schwamm|geschwommen', lieg: 'lag|gelegen', sitz: 'saß|gesessen', schlaf: 'schlief', verlass: 'verließ' }
const SEP = ['zurück', 'vorbei', 'kennen', 'fern', 'weg', 'los', 'ein', 'aus', 'auf', 'ab', 'an', 'mit', 'nach', 'vor', 'zu', 'her', 'hin', 'um']
// есть ли слово словаря в заданиях: словоформы (verbs.json), окончания, умлауты, отделяемые приставки
function wordIn(word, tokens) {
	const T = tokens.map(deUml)
	const w = deUml(word)
	const pre = x => x.slice(0, Math.max(4, x.length - 2))
	// hoch → höher, teuer → teurer, dunkel → dunkler
	const alts = [w, w.replace(/ch$/, 'h'), w.replace(/euer$/, 'eur'), w.replace(/el$/, 'l')]
	if (T.some(t => alts.some(a => t === a || t.startsWith(a === w ? pre(w) : a)))) return true
	const e = LEX.get(word)
	// у одного слова бывает несколько записей (словари квестов, verbs.json): сравниваем по самому слову
	const same = x => x && coreOf(x.word).join(' ') === coreOf(e.word).join(' ')
	if (e && tokens.some(t => same(LEX.get(t)))) return true
	if (!/n$/.test(w)) return false
	const p = SEP.map(deUml).find(x => w.startsWith(x) && w.length - x.length >= 4) || ''
	const rest = w.slice(p.length)
	const base = rest.replace(/e?n$/, '')
	const restE = LEX.get(word.slice(word.length - rest.length))
	const abl = ABLAUT[base] ? ABLAUT[base].split('|') : []
	const restIn = (t, orig) => t.includes(base.slice(0, Math.max(3, base.length - 1))) || abl.some(a => t.startsWith(a)) || (restE && LEX.get(orig)?.word === restE.word)
	if (!p) return T.some((t, i) => restIn(t, tokens[i]))
	return T.some((t, i) => t.startsWith(p) && restIn(t.slice(p.length).replace(/^(ge|zu)/, ''), tokens[i].slice(p.length).replace(/^(ge|zu)/, ''))) ||
		(T.includes(p) && T.some((t, i) => restIn(t, tokens[i])))
}
function fillVocab(vocabulary, text, where) {
	vocabStep++
	const tokens = lexTok(text)
	if (vocabulary.length < MIN_VOCAB) {
		const taken = new Set(vocabulary.flatMap(v => coreOf(v.word)))
		const cands = []
		for (const t of new Set(tokens)) {
			// прилагательное с окончанием (große, kleiner, neues) ведёт к основной форме (groß, klein, neu)
			const stem = t.replace(/(em|en|er|es|e)$/, '')
			const adj = stem !== t && LEX.get(stem)
			// только прилагательные: одно слово с маленькой буквы и не глагол (Bote → bot → bieten не подходит)
			const e = LEX.get(t) || (adj && /^[a-zäöüß]+$/.test(adj.word) && !/n$/.test(adj.word) && adj.word === stem ? adj : undefined)
			if (!e || cands.includes(e) || coreOf(e.word).some(c => taken.has(c)) || NOT_VOCAB.has(e.word)) continue
			cands.push(e)
		}
		// сначала то, чего ещё не было в словарях курса, потом самое недавно выученное
		const age = e => (taughtAt.has(e.word) ? taughtAt.get(e.word) : 1e9)
		cands.sort((a, b) => age(b) - age(a))
		for (const e of cands) {
			if (vocabulary.length >= MIN_VOCAB) break
			vocabulary.push({ word: e.word, ...Object.fromEntries(LANGS.map(l => [`translation-${l}`, e.tr[l]])) })
		}
		if (vocabulary.length < MIN_VOCAB) vocabWarnings.push(`${where}: в словаре только ${vocabulary.length} слов, в заданиях больше нечего взять`)
	}
	for (const v of vocabulary) if (!taughtAt.has(v.word)) taughtAt.set(v.word, vocabStep)
}

module.exports = { MIN_VOCAB, lexTok, coreOf, wordIn, fillVocab, vocabWarnings, LEX, taughtAt }
