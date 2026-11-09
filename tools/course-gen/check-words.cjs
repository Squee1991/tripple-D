// Ищет немецкие слова, которых не было ни в словарях, ни в заданиях раньше: node tools/course-gen/check-words.cjs
const fs = require('fs')
const mapOrder = [...fs.readFileSync('utils/regions.js', 'utf8').matchAll(/id: "([^"]+)"/g)].map(m => m[1])
const mine = require('./lands/index.cjs').map(p => require('./lands/' + p).id) // генерируемые земли по порядку
const tok = s => String(s || '').replace(/[.,!?:;„“"()…]/g, ' ').split(/\s+/).filter(Boolean).filter(w => !/\d/.test(w)).map(w => w.toLowerCase())
const taskText = t => [t.answer, t.correctAnswer, t.text, ...(t.options || []), ...(t.words || [])].join(' ')
const known = new Set()
const addVocab = q => q.vocabulary?.forEach(v => tok(v.word).forEach(w => known.add(w)))
// ответ в input подставляется в пропуск: проверяем и German-предложение с пропуском из ru-перевода задания
const ru = JSON.parse(fs.readFileSync('i18n/locales/ru-RU.json', 'utf8'))
const get = k => k.split('.').reduce((a, p) => a && a[p], ru)
for (const land of mapOrder) {
  const q = JSON.parse(fs.readFileSync(`public/quests/quests-${land}.json`, 'utf8'))
  if (!mine.includes(land)) { q.forEach(qq => { addVocab(qq); qq.tasks.forEach(t => tok(taskText(t)).forEach(w => known.add(w))) }); continue }
  const unknown = {}
  q.forEach((qq, qi) => {
    addVocab(qq) // слова квеста учатся до него
    qq.tasks.forEach(t => {
      const gap = (get(t.question) || '').split(/»: |”: |»:|: /).slice(1).join(' ') // немецкая часть с пропуском
      const words = tok(taskText(t) + ' ' + (t.type === 'input' ? gap.replace('___', '') : ''))
      words.forEach(w => { if (!known.has(w)) (unknown[w] ||= new Set()).add(qi + 1) })
    })
    qq.tasks.forEach(t => tok(taskText(t)).forEach(w => known.add(w)))
  })
  console.log(`\n== ${land}: ${Object.keys(unknown).length} новых слов вне словаря`)
  console.log(Object.entries(unknown).map(([w, s]) => `${w}(${[...s].join(',')})`).join('  '))
}
