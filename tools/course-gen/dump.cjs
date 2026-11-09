const fs = require('fs')
const ru = JSON.parse(fs.readFileSync('i18n/locales/ru-RU.json', 'utf8'))
const get = k => typeof k === 'string' && k.split('.').reduce((a, p) => a && a[p], ru)
for (const land of process.argv.slice(2)) {
  console.log('\n######## ' + land)
  for (const q of JSON.parse(fs.readFileSync(`public/quests/quests-${land}.json`, 'utf8'))) {
    console.log(`## ${q.questId} ${get(q.title) || q.title}`)
    for (const t of q.tasks) {
      if (t.reviewOf) continue
      const r = String(get(t.question) || '').replace(/^(Выберите|Соберите|Впишите|Вставьте|Переведите|Составьте)[^:]*:\s*/, '')
      let de
      if (t.type === 'input') { const a = t.correctAnswer || t.answer; de = r.includes('___') ? r.replace('___', '⟨' + a + '⟩') : a }
      else if (t.type === 'reorder') de = (t.correctOrder || []).join(' ')
      else if (t.type === 'readAndAnswer') de = `[${t.text}] → ${t.answer}`
      else if (t.options) de = t.answer + '   ✗ ' + t.options.filter(o => o !== t.answer).join(' / ')
      else de = t.answer || t.text || t.correctAnswer || ''
      console.log(`${t.id}. ${r.slice(0, 95)} ‖ ${de}`)
    }
  }
}
