// Генерирует utils/guideCatalog.js — места, куда ёжик-гид может отправить. Запуск из корня: node tools/gen-guide-catalog.cjs
// Земли берутся из utils/regions.js (подпись — название земли, подсказка — первый пункт landIntro), разделы перечислены ниже.
const fs = require('fs')

// группа земли — раздел regions.js (beginner / elementary / intermediate), а не level: level бывает временно обнулён для тестов
const src = fs.readFileSync('utils/regions.js', 'utf8')
const groups = ['beginner', 'elementary', 'intermediate']
const lands = groups.flatMap((group, i) => {
  const start = src.indexOf(group + ':')
  const end = i + 1 < groups.length ? src.indexOf(groups[i + 1] + ':') : src.length
  return [...src.slice(start, end).matchAll(/id: "([^"]+)"[\s\S]*?name: "([^"]+)"/g)]
    .map(m => ({ id: 'land-' + m[1], route: '/location/' + m[1], labelKey: m[2], hintKey: `landIntro.${m[1]}.p1`, group }))
})

// [id, маршрут, ключ подписи]
const sections = [
  ['articles', '/articles', 'sub.words'],
  ['adjective-basics', '/adjective-basics', 'underSub.adjectivesBasic'],
  ['idioms', '/idioms', 'sub.idioms'],
  ['thematic-learning', '/thematic-learning', 'sub.themen'],
  ['speak-practice', '/speak-practice', 'sub.speak'],
  ['image-description', '/image-description', 'sub.describePicture'],
  ['audio-tasks', '/audio-tasks', 'sub.audio'],
  ['text-tasks', '/text-tasks', 'sub.textTask'],
  ['article-basic', '/article-basic', 'underSub.prev'],
  ['article-theory', '/article-theory', 'underSub.rules'],
  ['verbs-theory', '/verbs-theory', 'underSub.verbsTheory'],
  ['verb-forms', '/verb-forms', 'underSub.forms'],
  ['tenses', '/tenses', 'underSub.verbFirst'],
  ['modal-verbs', '/modal-verbs', 'underSub.verbSecond'],
  ['verb-types', '/verb-types', 'underSub.verbTypes'],
  ['prepositions-theory', '/prepositions-theory', 'sub.prepositions'],
  ['prepositions', '/prepositions', 'underSub.prepositions'],
  ['adjectives-theory', '/adjectives-theory', 'underSub.adjectiveTheory'],
  ['adjective-declension', '/adjective-declension', 'underSub.declination'],
  ['adjective-comparison', '/adjective-comparison', 'underSub.comparison'],
  ['german-universe', '/german-universe', 'sub.fight'],
  ['sentence-duel', '/sentence-duel', 'sub.wordDuel'],
  ['guess-word', '/guess-word', 'sub.guess'],
  ['article-marathon', '/article-marathon', 'sub.marathon'],
  ['recipes', '/recipes', 'sub.quests'],
  ['exams', '/exams', 'nav.tests']
].map(([id, route, labelKey]) => ({ id, route, labelKey }))

const catalog = [...sections, ...lands]
const body = '// Места, куда ёжик-гид может отправить. Сгенерировано: node tools/gen-guide-catalog.cjs\n'
  + '// labelKey — подпись кнопки, hintKey — подсказка под ней, group — раздел земли в utils/regions.js.\n'
  + 'export const guideCatalog = ' + JSON.stringify(catalog, null, 2).replace(/"(\w+)":/g, '$1:') + '\n'
fs.writeFileSync('utils/guideCatalog.js', body)

const en = JSON.parse(fs.readFileSync('i18n/locales/en-US.json', 'utf8'))
const get = k => k.split('.').reduce((o, p) => o && o[p], en)
const missing = catalog.flatMap(c => [c.labelKey, c.hintKey]).filter(k => k && typeof get(k) !== 'string')
console.log('entries', catalog.length, '| missing keys', missing)
