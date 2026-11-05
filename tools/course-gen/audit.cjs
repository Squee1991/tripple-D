// Аудит контента земель: node tools/course-gen/audit.cjs [id земли ...]
const fs = require('fs')
const LANDS = process.argv.length > 2 ? process.argv.slice(2) : ['future-land','past-land','action-valley','order-valley','time-gate','edge-images','secret-lands','definite-indefinite','place-prepositions','direction-prepositions','action-prepositions','past-simple','requests-land', ...require('./lands/index.cjs').map(p => require('./lands/' + p).id)]
const L = Object.fromEntries(fs.readdirSync('i18n/locales').filter(f => f.endsWith('.json')).map(f => [f.slice(0, 2), JSON.parse(fs.readFileSync('i18n/locales/' + f, 'utf8'))]))
const get = (o, k) => typeof k === 'string' && k.split('.').reduce((a, p) => a && a[p], o)
const out = {}
const add = (cat, msg) => (out[cat] ||= new Set()).add(msg)
const cyr = /[а-яё]/i, ukOnly = /[іїєґ]/i, ruOnly = /[ыэъё]/i, arab = /[\u0600-\u06FF]/, deva = /[\u0900-\u097F]/
const stripDe = s => s.replace(/[A-Za-zÄÖÜäöüß]+/g, w => w) // немецкие вставки латиницей допустимы
const seenKeys = new Set()
for (const land of LANDS) {
  const quests = JSON.parse(fs.readFileSync(`public/quests/quests-${land}.json`, 'utf8'))
  quests.forEach((q, qi) => {
    const where = `${land} ${q.questId}`
    const keys = [['title', q.title], ['desc', q.description], ...q.tasks.flatMap(t => [['t' + t.id, t.question], t.tip ? ['tip' + t.id, t.tip] : null].filter(Boolean))]
    for (const [label, k] of keys) {
      if (seenKeys.has(k)) continue
      seenKeys.add(k)
      const v = Object.fromEntries(Object.entries(L).map(([l, o]) => [l, String(get(o, k) || '')]))
      // язык текста
      if (cyr.test(v.en)) add('кириллица в EN', `${where} ${label}: ${v.en.slice(0, 90)}`)
      for (const l of ['pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']) if (cyr.test(v[l])) add('кириллица в ' + l, `${where} ${label}: ${v[l].slice(0, 90)}`)
      if (ukOnly.test(v.ru)) add('украинские буквы в RU', `${where} ${label}: ${v.ru.slice(0, 90)}`)
      if (ruOnly.test(v.uk)) add('русские буквы в UK', `${where} ${label}: ${v.uk.slice(0, 90)}`)
      if (v.ar && !arab.test(v.ar)) add('AR без арабского', `${where} ${label}: ${v.ar.slice(0, 90)}`)
      if (v.hi && !deva.test(v.hi)) add('HI без деванагари', `${where} ${label}: ${v.hi.slice(0, 90)}`)
      if (v.ru && !cyr.test(v.ru)) add('RU без кириллицы', `${where} ${label}: ${v.ru.slice(0, 90)}`)
      for (const l of ['es', 'fr', 'pl', 'tr', 'ro', 'uz']) if (v[l] && v[l] === v.en && v.en.split(' ').length > 3) add('не переведено (= EN) ' + l, `${where} ${label}: ${v.en.slice(0, 80)}`)
      // немецкая часть с пропуском одинакова во всех языках
      const gaps = Object.fromEntries(Object.entries(v).map(([l, s]) => { const m = s.match(/([A-ZÄÖÜa-zäöüß][^«»“”„:]*___[^«»“”„]*)$/); return [l, m ? m[1].trim().replace(/[.!?]$/, '') : null] }))
      const vals = Object.values(gaps).filter(Boolean)
      if (vals.length && new Set(vals).size > 1) add('немецкий пропуск отличается между языками', `${where} ${label}: ` + [...new Set(vals)].join('  ||  ').slice(0, 220))
      if (vals.length && vals.length < 11) add('пропуск ___ есть не во всех языках', `${where} ${label}: нет в ${Object.entries(gaps).filter(([, g]) => !g).map(([l]) => l).join(',')}`)
    }
    for (const t of q.tasks) {
      const de = [t.answer, t.correctAnswer, t.text, ...(t.options || []), (t.correctOrder || []).join(' ')].filter(Boolean)
      if (t.options && new Set(t.options).size !== t.options.length) add('дубли вариантов', `${where} t${t.id}`)
      if (t.options && t.options.filter(o => o.trim().toLowerCase() === String(t.answer).trim().toLowerCase()).length > 1) add('ответ дважды в вариантах', `${where} t${t.id}`)
      for (const s of de) {
        if (/\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+[a-zäöü]+[.!?]?$/.test(s) && !/\b(das|es|der|die)\s+(ist|sind|war|hat|gibt)$/.test(s)) add('немецкий: возможно существительное с маленькой буквы', `${where} t${t.id}: ${s}`)
        if (/, das (ich|du|er|wir|ihr)\b/.test(s)) add('немецкий: das вместо dass?', `${where} t${t.id}: ${s}`)
        if (/\s{2,}|\s[.,!?]/.test(s)) add('лишние пробелы', `${where} t${t.id}: «${s}»`)
        if (/\b(\w+) \1\b/i.test(s) && !/\b(die die|der der|das das)\b/i.test(s)) add('повтор слова', `${where} t${t.id}: ${s}`)
      }
      if (t.type === 'reorder' && t.correctOrder && !/^[A-ZÄÖÜ]/.test(t.correctOrder[0])) add('reorder: первое слово с маленькой', `${where} t${t.id}: ${t.correctOrder.join(' ')}`)
      if (t.type === 'input') {
        const g = String(get(L.ru, t.question) || '')
        if (!g.includes('___') && !/напиш|прослуш|запиш|переведи|ответь/i.test(g)) add('input без пропуска (что вписывать?)', `${where} t${t.id}: ${g.slice(0, 90)} → ${t.correctAnswer}`)
      }
    }
  })
}
for (const [cat, set] of Object.entries(out)) {
  console.log(`\n### ${cat}: ${set.size}`)
  ;[...set].slice(0, 12).forEach(m => console.log('  ' + m))
  if (set.size > 12) console.log(`  … ещё ${set.size - 12}`)
}
