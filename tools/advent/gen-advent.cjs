const fs = require('fs')
process.chdir(require('path').join(__dirname, '..', '..'))
// Запуск: git checkout public/events/event-winter.json && node tools/advent/gen-advent.cjs
// [day, article, noun, image, sentence(with ___), sentenceOptions(correct first), cultureQ, cultureOptions(correct first)]
const D = [
 [1,'der','Adventskalender','calendar.svg','Jeden Tag öffne ich ein ___ im Adventskalender.',['Türchen','Auto','Brot'],'Wie viele Türchen hat ein Adventskalender?',['24','20','31','12']],
 [2,'die','Kerze','candle.svg','Die ___ brennt auf dem Tisch.',['Kerze','Tasse','Gabel'],'Was macht eine Kerze?',['Sie leuchtet.','Sie singt.','Sie schläft.','Sie fliegt.']],
 [3,'der','Adventskranz','christmas-wreath.svg','Auf dem Adventskranz sind vier ___.',['Kerzen','Äpfel','Hunde'],'Wie viele Kerzen hat ein Adventskranz?',['4','2','3','6']],
 [4,'die','Schneeflocke','snowflake.svg','Eine Schneeflocke ___ auf meine Nase.',['fällt','isst','liest'],'Welche Farbe hat Schnee?',['weiß','grün','rot','blau']],
 [5,'der','Strumpf','christmas-stocking.svg','Der ___ hängt am Kamin.',['Strumpf','Tisch','Stuhl'],'Was stellen Kinder am 5. Dezember vor die Tür?',['einen Stiefel','einen Baum','eine Kerze','einen Ball']],
 [6,'der','Nikolaus','Santa.svg','Der Nikolaus bringt Nüsse und ___.',['Schokolade','Steine','Schuhe'],'Wann ist Nikolaustag?',['am 6. Dezember','am 24. Dezember','am 1. Januar','am 31. Oktober']],
 [7,'das','Plätzchen','cookies.svg','Wir ___ Plätzchen mit Oma.',['backen','trinken','waschen'],'Wo backt man Plätzchen?',['im Ofen','im Kühlschrank','im Bett','im Auto']],
 [8,'der','Schneemann','snowman.svg','Der Schneemann hat eine ___ aus einer Karotte.',['Nase','Hand','Tasche'],'Woraus baut man einen Schneemann?',['aus Schnee','aus Holz','aus Papier','aus Sand']],
 [9,'der','Schlitten','sled.svg','Die Kinder ___ Schlitten.',['fahren','essen','schreiben'],'Was macht man mit einem Schlitten?',['Man fährt den Berg hinunter.','Man kocht Suppe.','Man liest ein Buch.','Man schwimmt im Meer.']],
 [10,'der','Handschuh','mittens.svg','Ohne ___ sind meine Hände kalt.',['Handschuhe','Socken','Brillen'],'Wo trägt man Handschuhe?',['an den Händen','an den Füßen','auf dem Kopf','am Hals']],
 [11,'der','Schal','scarf.svg','Ich trage einen warmen ___.',['Schal','Löffel','Teller'],'Wo trägt man einen Schal?',['am Hals','an den Füßen','an den Händen','im Haar']],
 [12,'das','Rentier','reindeer.svg','Das Rentier ___ den Schlitten.',['zieht','trinkt','kauft'],'Wer zieht den Schlitten vom Weihnachtsmann?',['die Rentiere','die Katzen','die Fische','die Hühner']],
 [13,'die','Glocke','christmas-bell.svg','Die ___ läuten am Heiligabend.',['Glocken','Kerzen','Sterne'],'Was macht eine Glocke?',['Sie läutet.','Sie kocht.','Sie schwimmt.','Sie malt.']],
 [14,'der','Stern','star.svg','Oben auf dem Baum leuchtet ein ___.',['Stern','Hund','Schuh'],'Wo ist der Stern?',['oben auf dem Baum','unter dem Tisch','im Kühlschrank','im Keller']],
 [15,'der','Schlittschuh','ice-skates.svg','Im Winter laufen wir ___.',['Schlittschuh','Tennis','Fahrrad'],'Wo läuft man Schlittschuh?',['auf dem Eis','im Wasser','auf dem Dach','im Sand']],
 [16,'die','Kugel','christmas-ball.svg','Die rote ___ hängt am Baum.',['Kugel','Katze','Suppe'],'Woran hängt die Kugel?',['am Weihnachtsbaum','an der Tür','am Auto','am Fenster']],
 [17,'die','Schleife','ribbon.svg','Auf dem Geschenk ist eine ___.',['Schleife','Suppe','Wolke'],'Wo ist die Schleife?',['auf dem Geschenk','im Schnee','im Ofen','im Wasser']],
 [18,'der','Kamin','chimney.svg','Im ___ brennt ein Feuer.',['Kamin','Kühlschrank','Bett'],'Was brennt im Kamin?',['das Feuer','das Eis','der Schnee','das Wasser']],
 [19,'der','Kuchen','cake.svg','Zum Kaffee gibt es ___.',['Kuchen','Schnee','Seife'],'Welchen Kuchen isst man im Advent oft in Deutschland?',['Stollen','Sushi','Pizza','Tacos']],
 [20,'die','Mütze','santa-hat.svg','Der Weihnachtsmann trägt eine rote ___.',['Mütze','Banane','Lampe'],'Welche Farbe hat die Mütze vom Weihnachtsmann?',['rot','grün','schwarz','lila']],
 [21,'der','Weihnachtsschmuck','christmas-decoration.svg','Wir hängen den Weihnachtsschmuck an den ___.',['Baum','Hund','Kuchen'],'Wann schmücken viele Familien den Baum?',['kurz vor Weihnachten','im Sommer','an Ostern','im März']],
 [22,'die','Süßigkeiten','candy.svg','Die Kinder lieben ___.',['Süßigkeiten','Hausaufgaben','Zahnärzte'],'Was ist süß?',['die Schokolade','die Zitrone','das Salz','der Pfeffer']],
 [23,'der','Weihnachtsbaum','christmas-tree.svg','Wir ___ den Weihnachtsbaum.',['schmücken','trinken','schlafen'],'Was ist ein anderes Wort für Weihnachtsbaum?',['der Tannenbaum','der Apfelbaum','der Kamin','der Stern']],
 [24,'das','Geschenk','gift.svg','Am Heiligabend packen wir die ___ aus.',['Geschenke','Fenster','Wolken'],'Wann bekommen Kinder in Deutschland ihre Geschenke?',['am Heiligabend','am 1. Dezember','an Ostern','im Sommer']],
]
// детерминированный сдвиг, чтобы правильный ответ не стоял всегда первым
const rot = (arr, k) => { const n = k % arr.length; return [...arr.slice(n), ...arr.slice(0, n)] }
const place = (opts, seed) => { const correct = opts[0]; const o = rot(opts, seed); return { options: o, correctOptionIndex: o.indexOf(correct) } }
const label = (a, n) => a + ' ' + n

// Тип задания по дням: классика, аудирование, сборка слов, лишнее слово, повторение (воскресенья), финал
const KIND = {}
;[1, 5, 10, 15, 19].forEach(d => { KIND[d] = 'classic' })
;[2, 6, 11, 16, 20].forEach(d => { KIND[d] = 'listen' })
;[3, 8, 12, 17, 22].forEach(d => { KIND[d] = 'build' })
;[4, 9, 13, 18, 23].forEach(d => { KIND[d] = 'odd' })
;[7, 14, 21].forEach(d => { KIND[d] = 'review' })
KIND[24] = 'finale'

// Мини-истории для аудирования: [текст, [вопрос, варианты (верный первым)]...]
const LISTEN = {
  2: ['Es ist dunkel. Mia zündet eine Kerze an. Die Kerze ist rot und riecht nach Zimt.', [
    ['Welche Farbe hat die Kerze?', ['rot', 'blau', 'grün', 'weiß']],
    ['Wonach riecht die Kerze?', ['nach Zimt', 'nach Fisch', 'nach Kaffee', 'nach Regen']]]],
  6: ['Am Abend stellt Paul seinen Stiefel vor die Tür. Am Morgen ist der Stiefel voll. Paul findet Nüsse, eine Mandarine und Schokolade.', [
    ['Wohin stellt Paul den Stiefel?', ['vor die Tür', 'ins Bett', 'in den Schrank', 'auf das Dach']],
    ['Was ist nicht im Stiefel?', ['ein Handy', 'Nüsse', 'eine Mandarine', 'Schokolade']]]],
  11: ['Draußen ist es sehr kalt. Oma strickt einen langen Schal für Tom. Der Schal ist grün und sehr warm.', [
    ['Wer strickt den Schal?', ['Oma', 'Tom', 'Papa', 'der Nachbar']],
    ['Wie ist der Schal?', ['lang und warm', 'kurz und kalt', 'klein und nass', 'alt und kaputt']]]],
  16: ['Lisa und ihr Bruder schmücken den Baum. Lisa hängt eine rote Kugel auf. Ihr Bruder setzt einen goldenen Stern oben auf den Baum.', [
    ['Was hängt Lisa auf?', ['eine rote Kugel', 'einen Stern', 'eine Kerze', 'eine Glocke']],
    ['Was ist oben auf dem Baum?', ['ein goldener Stern', 'eine Katze', 'ein Hut', 'ein Apfel']]]],
  20: ['Ben geht in den Schnee. Er trägt eine blaue Mütze und dicke Handschuhe. Er baut einen großen Schneemann.', [
    ['Welche Farbe hat die Mütze?', ['blau', 'rot', 'gelb', 'schwarz']],
    ['Was baut Ben?', ['einen Schneemann', 'ein Haus', 'ein Auto', 'einen Turm']]]],
  24: ['Heute ist Heiligabend. Die Familie singt Lieder unter dem Weihnachtsbaum. Dann packen alle ihre Geschenke aus. Anna bekommt ein Buch und freut sich sehr.', [
    ['Wo singt die Familie?', ['unter dem Weihnachtsbaum', 'im Auto', 'in der Schule', 'im Garten']],
    ['Was bekommt Anna?', ['ein Buch', 'ein Fahrrad', 'einen Hund', 'eine Puppe']],
    ['Wie fühlt sich Anna?', ['Sie freut sich.', 'Sie ist traurig.', 'Sie ist müde.', 'Sie ist böse.']]]],
}

// Сложные слова из двух половинок (без пересекающихся вариантов)
const BUILD = {
  3: [['Advents', 'kranz'], ['Lebkuchen', 'herz'], ['Schnee', 'flocke'], ['Hand', 'schuh']],
  8: [['Schnee', 'mann'], ['Tannen', 'baum'], ['Kerzen', 'licht'], ['Geschenk', 'papier']],
  12: [['Ren', 'tier'], ['Weihnachts', 'mann'], ['Winter', 'mantel'], ['Puder', 'zucker']],
  17: [['Geschenk', 'band'], ['Zimt', 'stern'], ['Nuss', 'knacker'], ['Winter', 'schlaf']],
  22: [['Schoko', 'lade'], ['Zucker', 'stange'], ['Gummi', 'bär'], ['Pfeffer', 'nuss']],
}

// Лишнее слово: [вопрос, варианты (лишнее первым)]
const ODD = {
  4: ['Was passt nicht zum Winter?', ['die Sonnencreme', 'die Schneeflocke', 'der Schneemann', 'der Schlitten']],
  9: ['Was trägt man im Winter nicht?', ['den Bikini', 'den Schal', 'die Mütze', 'die Handschuhe']],
  13: ['Was macht keine Musik?', ['das Kissen', 'die Glocke', 'die Trommel', 'die Flöte']],
  18: ['Was ist nicht warm?', ['der Schneemann', 'das Feuer', 'die Kerze', 'der Kamin']],
  23: ['Was hängt man nicht an den Baum?', ['den Fußball', 'die Kugel', 'den Stern', 'die Lichterkette']],
}

// Повторение: слова этих дней сопоставить с переводом
const REVIEW = { 7: [3, 4, 5, 6, 7], 14: [10, 11, 12, 13, 14], 21: [17, 18, 19, 20, 21], 24: [2, 8, 12, 16, 23] }

// Награда за окошко. Экономика: 21 обычное задание x 10 + 24 x 5 = 330, магазин 300 (запас 10%)
const ADVENT_COINS = 5

const byDay = Object.fromEntries(D.map(d => [d[0], d]))
const IMG = '/assets/images/event-rewards/winter-event/winter-words/'

const matching = (id, instruction, pairs, seed) => {
  const left = pairs.map(([l], i) => ({ id: 'l' + (i + 1), text: l }))
  const right = rot(pairs.map(([, r], i) => ({ id: 'r' + (i + 1), text: r })), 1 + (seed % (pairs.length - 1)))
  return { type: 'matching', id, instruction, pairsLeft: left, pairsRight: right, correctPairs: pairs.map((_, i) => ['l' + (i + 1), 'r' + (i + 1)]) }
}

const quests = D.map(([day, art, noun, img, sent, sOpts, cq, cOpts], i) => {
  const others = [1, 7, 13].map(off => D[(i + off) % D.length]).map(d => label(d[1], d[2]))
  const id = s => 'adv' + day + '-' + s
  const pic = { type: 'multiple-choice', id: id('pic'), question: 'Was ist das?', image: IMG + img, ...place([label(art, noun), ...others], day) }
  const article = { type: 'multiple-choice', id: id('art'), question: 'Der, die oder das? ... ' + noun, ...place([art, ...['der', 'die', 'das'].filter(a => a !== art)], day + 1) }
  const sentence = { type: 'choose-word', id: id('sent'), sentence: sent, ...place(sOpts, day + 2) }
  const culture = { type: 'multiple-choice', id: id('culture'), question: cq, ...place(cOpts, day + 3) }
  const listen = () => {
    const [text, qs] = LISTEN[day]
    return { type: 'reading', id: id('listen'), text, questions: qs.map(([q, opts], qi) => ({ question: q, ...place(opts, day + qi + 1) })) }
  }
  const build = () => matching(id('build'), 'adventCalendar.tasks.build', BUILD[day].map(([a, b]) => [a + '-', '-' + b]), day)
  const odd = () => ({ type: 'multiple-choice', id: id('odd'), question: ODD[day][0], ...place(ODD[day][1], day + 2) })
  const review = () => matching(id('review'), 'adventCalendar.tasks.review',
    REVIEW[day].map(d => [label(byDay[d][1], byDay[d][2]), 'adventCalendar.days.d' + d + '.word']), day)

  const kind = KIND[day]
  const steps = {
    classic: () => [pic, article, sentence, culture],
    listen: () => [pic, article, listen(), sentence],
    build: () => [pic, build(), article, sentence],
    odd: () => [pic, odd(), sentence, culture],
    review: () => [pic, review(), sentence, culture],
    finale: () => [pic, listen(), review(), culture],
  }[kind]()
  return {
    id: 'advent-' + day,
    title: 'Adventskalender ' + day,
    kind,
    rewardCoins: ADVENT_COINS,
    rewardRep: 0,
    steps,
  }
})
const p = 'public/events/event-winter.json'
const raw = fs.readFileSync(p, 'utf8')
if (raw.includes('"advent-1"')) throw new Error('advent quests already present')
const body = quests.map(q => JSON.stringify(q, null, 2).split('\n').map(l => '    ' + l).join('\n')).join(',\n')
const idx = raw.lastIndexOf(']')
const before = raw.slice(0, idx).replace(/\s*$/, '')
fs.writeFileSync(p, before + ',\n' + body + '\n  ' + raw.slice(idx))
const j = JSON.parse(fs.readFileSync(p, 'utf8'))
const days = D.map(([day, art, noun, img, sent, sOpts]) => ({ day, article: art, word: noun, image: img, example: sent.replace('___', sOpts[0]), kind: KIND[day], rewardCoins: ADVENT_COINS }))
fs.mkdirSync('src/components/events-group/winter', { recursive: true })
fs.writeFileSync('src/components/events-group/winter/adventDays.json', JSON.stringify(days, null, 2) + '\n')
console.log('quests', j.quests.length)
