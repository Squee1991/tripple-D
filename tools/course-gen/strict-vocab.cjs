// Строгая проверка словарей: node tools/course-gen/strict-vocab.cjs [--write]
// Значимое слово из заданий должно быть в «Изучить слова» этого или более раннего квеста по порядку карты.
// Без --write только отчёт. С --write добавляет такие слова в словарь квеста, где они впервые встретились,
// если перевод есть в курсе или в strict-vocab-data.cjs. Запускать последним шагом сборки: задания не меняются.
const fs = require('fs')
const { lexTok, coreOf, LEX, wordIn } = require('./lexicon.cjs')
const WRITE = process.argv.includes('--write')
const LANGS = ['ru', 'en', 'uk', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
const ru = JSON.parse(fs.readFileSync('i18n/locales/ru-RU.json', 'utf8'))
const get = k => (typeof k === 'string' ? k.split('.').reduce((a, p) => (a == null ? a : a[p]), ru) : undefined)
const isKey = s => typeof s === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+$/.test(s)
const src = fs.readFileSync('utils/regions.js', 'utf8')
const order = [...src.matchAll(/id: "([^"]+)"/g)].map(m => m[1])
const levelOf = {}
{ let c = null; for (const line of src.split('\n')) { const m = line.match(/^\s*(beginner|pathfinder|elementary|intermediate|experience|wisdom)\s*:\s*\[/); if (m) c = m[1]; const i = line.match(/^\s*id:\s*"([^"]+)"/); if (i) levelOf[i[1]] = c } }

// служебные слова: в словари не идут (правило quest-vocab-scope)
const STOP = new Set(`der die das den dem des ein eine einen einem einer eines kein keine keinen keinem keiner keines
ich du er sie es wir ihr mich dich ihn uns euch mir dir ihm ihnen sich man
mein meine meinen meinem meiner meines dein deine deinen deinem deiner deines sein seine seinen seinem seiner seines ihre ihren ihrem ihrer ihres unser unsere unseren unserem unserer unseres euer eure euren eurem eurer eures
in im ins an am ans auf aufs aus bei beim mit nach seit von vom vor zu zum zur für ohne gegen um durch bis ab über unter hinter neben zwischen wegen trotz während gegenüber
und oder aber denn weil dass wenn als ob obwohl damit sondern nicht auch so sehr nur noch schon wie wo wer was wen wem wann woher wohin warum wieso
ja nein doch bitte danke gern gerne hier da dort dann
bin bist ist sind seid war warst waren wart gewesen sei habe hast hat haben habt hatte hattest hatten hattet gehabt werde wirst wird werden werdet wurde wurden worden geworden würde würdest würden würdet wäre wärst wären hätte hättest hätten
kann kannst können könnt konnte konntest konnten konntet könnte könntest könnten muss musst müssen müsst musste musstest mussten musstet will willst wollen wollt wollte wolltest wollten wolltet darf darfst dürfen dürft durfte durftest durften durftet soll sollst sollen sollt sollte solltest sollten solltet mag magst mögen mögt möchte möchtest möchten möchtet
dieser diese dieses diesen diesem welcher welche welches welchen welchem jeder jede jedes jeden jedem alle alles allem allen aller
etwas nichts viel viele vielen wenig mehr ganz einmal mal also dabei dafür darauf daran davon dazu darum deshalb trotzdem außerdem dann danach
null eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf hundert tausend uhr euro cent grad kilo meter
oh hallo tschüss
vorbei heraus herein los weg raus hierher dorthin woanders per plus minus absolut
wonach darüber worüber worauf wovor womit wovon woran woraus wofür davor daneben dahin
namens genitiv dativ akkusativ nominativ perfekt-form`.split(/\s+/))
const NUM = /^(ein|zwei|zwan|drei|dreißig|vier|fünf|sechs|sech|sieben|sieb|acht|neun|zehn|elf|zwölf|und|zig|ßig|hundert|tausend|dritt|siebt|erst)+(e|en|er|es|em|ste|sten|ster|stes|te|ten|ter|tes)?$/
const NAMES = new Set(`anna ben carlos ali ahmed ivan julia lisa lena leo lea max mia nina olga paul peter sara sophie sofia tim tom tobias jan jonas karl kira lukas maria marco mimi nick eva emma emil ken kim helga hoffmann schmidt schulz müller weber becker nowak rossi demir huber fischer bello clara klara lara finn lars leon mark paula lopez kaya thomas elena ana roth
jana tina ott mila petra marta karin wagner tobias potsdam zugspitze marienplatz kanada island siemens skillupgerman berlin hamburg köln bonn bremen dresden leipzig münchen wien zürich rom paris prag london amerika frankreich italien spanien polen türkei ukraine ägypten japan griechenland brasilien russland österreich deutschland schweiz rhein a1 a2 b1`.split(/\s+/))

const clean = w => w.replace(/^[-'’]+|[-'’]+$/g, '')
const tokensOf = s => String(s || '').replace(/[.,!?:;„“"()…«»\/]/g, ' ').split(/\s+/).map(clean).filter(w => /^[A-Za-zÄÖÜäöüß-]{3,}$/.test(w))
const latinOf = s => (String(s || '').match(/[A-Za-zÄÖÜäöüß'’-]+/g) || []).join(' ')
const textOf = t => {
	const a = t.answer ?? t.correctAnswer
	const parts = [t.text, (t.correctOrder || []).join(' ')]
	if (a && !isKey(a)) parts.push(a)
	if (isKey(t.question)) parts.push(latinOf(String(get(t.question) || '').replace('___', ' '))); else parts.push(t.question)
	return parts.join(' ')
}
// основы слова: окончания, множественное, причастие
// неправильные формы глаголов: основа прошедшего и причастия -> инфинитив
const STRONG = { traf: 'treffen', getroffen: 'treffen', kam: 'kommen', kamen: 'kommen', gekommen: 'kommen', stieg: 'steigen', stiegen: 'steigen', gestiegen: 'steigen', fuhr: 'fahren', fuhren: 'fahren', gefahren: 'fahren', ging: 'gehen', gingen: 'gehen', gegangen: 'gehen', schwamm: 'schwimmen', geschwommen: 'schwimmen', rief: 'rufen', riefen: 'rufen', gerufen: 'rufen', schlief: 'schlafen', schliefen: 'schlafen', geschlafen: 'schlafen', stand: 'stehen', standen: 'stehen', standest: 'stehen', gestanden: 'stehen', gesprochen: 'sprechen', sprach: 'sprechen', sprachen: 'sprechen', gesehen: 'sehen', sah: 'sehen', sahen: 'sehen', sieht: 'sehen', siehst: 'sehen', gelesen: 'lesen', las: 'lesen', lasen: 'lesen', geschrieben: 'schreiben', schrieb: 'schreiben', schrieben: 'schreiben', gegessen: 'essen', aß: 'essen', aßen: 'essen', getrunken: 'trinken', trank: 'trinken', tranken: 'trinken', geblieben: 'bleiben', blieb: 'bleiben', blieben: 'bleiben', genommen: 'nehmen', nahm: 'nehmen', nahmen: 'nehmen', gegeben: 'geben', gab: 'geben', gaben: 'geben', gefunden: 'finden', fand: 'finden', fanden: 'finden', vergaß: 'vergessen', vergiss: 'vergessen', verloren: 'verlieren', verlor: 'verlieren', gewonnen: 'gewinnen', gewann: 'gewinnen', begann: 'beginnen', begonnen: 'beginnen', gebracht: 'bringen', brachte: 'bringen', brachten: 'bringen', gedacht: 'denken', dachte: 'denken', dachten: 'denken', geholfen: 'helfen', half: 'helfen', halfen: 'helfen', hilf: 'helfen', hilft: 'helfen', hilfst: 'helfen', gib: 'geben', gibst: 'geben', gibt: 'geben', nimm: 'nehmen', nimmt: 'nehmen', nimmst: 'nehmen', lies: 'lesen', liest: 'lesen', iss: 'essen', isst: 'essen', sprich: 'sprechen', spricht: 'sprechen', sprichst: 'sprechen', triff: 'treffen', trifft: 'treffen', triffst: 'treffen', fährt: 'fahren', fährst: 'fahren', läuft: 'laufen', läufst: 'laufen', lief: 'laufen', liefen: 'laufen', gelaufen: 'laufen', schläft: 'schlafen', schläfst: 'schlafen', trägt: 'tragen', trägst: 'tragen', trug: 'tragen', trugen: 'tragen', getragen: 'tragen', fällt: 'fallen', fiel: 'fallen', gefällt: 'gefallen', hielt: 'halten', hielten: 'halten', gehalten: 'halten', lag: 'liegen', gelegen: 'liegen', saß: 'sitzen', gesessen: 'sitzen', wusste: 'wissen', wussten: 'wissen', gewusst: 'wissen', weißt: 'wissen', kannte: 'kennen', gekannt: 'kennen', flog: 'fliegen', flogen: 'fliegen', geflogen: 'fliegen', bat: 'bitten', gebeten: 'bitten', zog: 'ziehen', zogen: 'ziehen', gezogen: 'ziehen', sang: 'singen', gesungen: 'singen', schloss: 'schließen', geschlossen: 'schließen', fing: 'fangen', fingen: 'fangen', gefangen: 'fangen', ließ: 'lassen', ließen: 'lassen', gelassen: 'lassen', lud: 'laden', geladen: 'laden', lädt: 'laden', lädst: 'laden', wuchs: 'wachsen', gewachsen: 'wachsen', wächst: 'wachsen', stritt: 'streiten', stritten: 'streiten', gestritten: 'streiten' }
const ALIAS = { weh: 'wehtun', wehtat: 'wehtun', teuren: 'teuer', hohes: 'hoch', hohe: 'hoch', hohen: 'hoch', fern: 'fernsehen', 'wi-fi': 'wlan', trafen: 'treffen', caf: 'café', mamas: 'mama', teure: 'teuer', zweifle: 'zweifeln', melde: 'krankmelden', holte: 'holen', ausgestiegen: 'aussteigen', bestiegen: 'besteigen', heruntergeladen: 'herunterladen', abgehoben: 'abheben', ruhten: 'ruhen', holten: 'holen', angemeldet: 'anmelden', erfunden: 'erfinden', rausgebracht: 'rausbringen', lobten: 'loben', übst: 'üben' }
const PREF = ['zurück', 'vorbei', 'zusammen', 'weiter', 'kennen', 'heraus', 'herein', 'ein', 'aus', 'auf', 'ab', 'an', 'mit', 'nach', 'vor', 'los', 'weg', 'fern', 'um', 'zu', 'be', 'ver', 'er', 'ge']
const stems = w => {
	const out = new Set([w])
	if (STRONG[w]) out.add(STRONG[w])
	if (ALIAS[w]) out.add(ALIAS[w])
	for (const p of PREF) if (w.startsWith(p) && w.length > p.length + 2) { const r = w.slice(p.length); if (STRONG[r]) out.add(p + STRONG[r]); const z = r.startsWith('zu') ? r.slice(2) : null; if (z) { out.add(p + z); if (STRONG[z]) out.add(p + STRONG[z]) } const ge = r.startsWith('ge') ? r.slice(2) : null; if (ge) { out.add(p + ge); out.add(p + ge.replace(/t$/, 'en')); if (STRONG['ge' + ge]) out.add(p + STRONG['ge' + ge]) } }
	// прошедшее слабых глаголов и сравнение
	for (const e of ['test', 'ten', 'tet', 'te']) if (w.length > e.length + 3 && w.endsWith(e)) { out.add(w.slice(0, -e.length)); out.add(w.slice(0, -e.length) + 'en') }
	for (const e of ['esten', 'estes', 'ester', 'este', 'sten', 'stes', 'ster', 'ste', 'eren', 'eres', 'erer', 'ere', 'er']) if (w.length > e.length + 2 && w.endsWith(e)) out.add(w.slice(0, -e.length))
	if (w.endsWith('in') && w.length > 5) out.add(w.slice(0, -2))
	if (w.endsWith('s') && NAMES.has(w.slice(0, -1))) out.add(w.slice(0, -1))
	if (/^(nah|näh)er$/.test(w)) out.add('nah'); if (/^(hoch|höher|höchst)/.test(w)) out.add('hoch'); if (w === 'teurer' || /^teuerst/.test(w)) out.add('teuer')
	for (const e of ['en', 'em', 'er', 'es', 'e', 'n', 's', 'st', 't', 'nen']) if (w.length > e.length + 2 && w.endsWith(e)) out.add(w.slice(0, -e.length))
	if (/^ge.{3,}/.test(w)) { const r = w.slice(2); for (const x of [r, r.replace(/t$/, ''), r.replace(/en$/, ''), r.replace(/t$/, 'en')]) out.add(x) }
	const m = w.match(/^(.+)ge(.{3,})$/); if (m) out.add(m[1] + m[2]).add(m[1] + m[2].replace(/t$/, 'en'))
	return out
}
const uml = s => s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/äu/g, 'au')

const taught = new Set(), taughtU = new Set()
const teach = word => {
	for (const part of String(word).split(/[\/,]/)) for (const t of coreOf(part.replace(/\([^)]*\)/g, ' '))) {
		const w = clean(t).replace(/[!?.]/g, '')
		if (!w) continue
		for (const s of stems(w)) { taught.add(s); taughtU.add(uml(s)) }
		const e = LEX.get(w); if (e) for (const c of coreOf(e.word)) { taught.add(c); taughtU.add(uml(c)) }
	}
}
const isTaught = t => {
	if (taught.has(t)) return true
	if (extra[t] && coreOf(extra[t][0]).every(c => taught.has(c))) return true
	if (/^(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)(morgen|abend|mittag|nachmittag|vormittag|s)$/.test(t) || NAMES.has(t.replace(/s$/, ''))) return true
	const e = LEX.get(t)
	if (e) {
		const c = coreOf(e.word).join('')
		if (taught.has(c)) return true
		// aufstehen выучен, в задании «steht ... auf»
		for (const x of taught) if (x.length > c.length + 1 && x.endsWith(c)) return true
	}
	for (const s of stems(t)) { if (taught.has(s) || taughtU.has(uml(s)) || taught.has(s + 'en') || taught.has(s + 'n') || PREF.some(p => taught.has(p + s + 'en') || taught.has(p + s))) return true; const es = LEX.get(s); if (es && taught.has(coreOf(es.word).join(''))) return true }
	return false
}
const extra = fs.existsSync(__dirname + '/strict-vocab-data.cjs') ? require('./strict-vocab-data.cjs') : {}
const dictOf = (t, orig) => {
	if (extra[t]) return { word: extra[t][0], tr: Object.fromEntries(LANGS.map((l, i) => [l, extra[t][i + 1]])) }
	const candidates = [t, ...stems(t)]
	for (const c of candidates) { if (extra[c]) return dictOf(c); const e = LEX.get(c); if (e && LANGS.every(l => e.tr[l])) return e }
	return null
}

const report = {}, noTr = {}, added = {}
const PROTECT = new Set(Object.values(extra).map(e => e[0]))
let totalAdded = 0, pruned = 0
for (const l of order) {
	const f = `public/quests/quests-${l}.json`
	const q = JSON.parse(fs.readFileSync(f, 'utf8'))
	let touched = false
	q.forEach((x, qi) => {
		;(x.vocabulary || []).forEach(v => teach(v.word))
		const seen = new Map()
		for (const t of x.tasks) for (const w of tokensOf(textOf(t))) {
			const low = w.toLowerCase()
			if (STOP.has(low) || NAMES.has(low) || NUM.test(low) || /^[a-z]\d/i.test(low)) continue
			if (!seen.has(low)) seen.set(low, w)
		}
		for (const [low, w] of seen) {
			if (isTaught(low)) continue
			const e = dictOf(low)
			if (e) {
				if (WRITE && !coreOf(e.word).every(c => (x.vocabulary || []).some(v => coreOf(v.word).includes(c)))) {
					x.vocabulary.push({ word: e.word, ...Object.fromEntries(LANGS.map(g => [`translation-${g}`, e.tr[g]])) })
					touched = true; totalAdded++
				}
				teach(e.word); teach(w)
				;(added[l] ||= []).push(`${qi + 1}:${e.word}`)
			} else {
				(noTr[levelOf[l]] ||= {})[low] = `${l} ${qi + 1}`
				teach(w) // одно упоминание на слово
			}
			;(report[l] ||= []).push(low)
		}
	})
	if (WRITE) for (const x of q) {
		const tk = lexTok(x.tasks.map(textOf).join(' '))
		const seenAll = lexTok(x.tasks.map(t => [(t.words || []).join(' '), ...(t.options || []).map(o => (isKey(o) ? latinOf(get(o)) : o))].join(' ')).join(' '))
		const vars = w => String(w).split('/').map(p => coreOf(p.replace(/\([^)]*\)/g, ' ')).filter(c => !/\d/.test(c))).filter(c => c.length)
		const inTk = (w, t) => vars(w).some(c => c.every(p => wordIn(p, t)))
		for (let i = x.vocabulary.length - 1; i >= 0 && x.vocabulary.length > 5; i--) {
			const w = x.vocabulary[i].word
			if (!PROTECT.has(w) && !inTk(w, tk) && inTk(w, seenAll)) { x.vocabulary.splice(i, 1); touched = true; pruned++ }
		}
	}
	if (touched) fs.writeFileSync(f, JSON.stringify(q, null, 2) + '\n')
}
let sum = 0
for (const l of order) if (report[l]) { sum += report[l].length; console.log(`${l}: ${report[l].length}: ${report[l].slice(0, 40).join(' ')}`) }
console.log(`\nвсего невыученных слов: ${sum}, можно добавить автоматически: ${Object.values(added).flat().length}, нужно перевести: ${Object.values(noTr).reduce((a, o) => a + Object.keys(o).length, 0)}`)
for (const [lv, o] of Object.entries(noTr)) console.log(`\n[нет перевода] ${lv} (${Object.keys(o).length}): ${Object.entries(o).map(([w, p]) => `${w}@${p}`).join(' ').slice(0, 3500)}`)
if (WRITE) console.log('добавлено в словари', totalAdded, 'убрано слов только из неверных вариантов', pruned)
fs.writeFileSync(process.env.UNTR || 'untranslated.json', JSON.stringify(noTr))
