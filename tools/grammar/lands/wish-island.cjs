// Грамматика к заданиям земли wish-island (Konjunktiv II: если бы сейчас)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const haettePoint = pt(['Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...', 'Wenn ich ... hätte, würde ich ...'], [
	'Нереальное условие: в части с wenn hätte или wäre в конце, во второй части würde + инфинитив в конце. Это мечта, а не реальность.',
	'Нереальна умова: у частині з wenn hätte або wäre в кінці, у другій частині würde + інфінітив у кінці. Це мрія, а не реальність.',
	'Unreal condition: in the wenn part hätte or wäre at the end, in the other part würde + infinitive at the end. It’s a dream, not reality.',
	'Warunek nierzeczywisty: w części z wenn hätte albo wäre na końcu, w drugiej würde + bezokolicznik na końcu. To marzenie, nie rzeczywistość.',
	'Condición irreal: en la parte con wenn, hätte o wäre al final; en la otra, würde + infinitivo al final. Es un sueño, no la realidad.',
	'Condition irréelle : dans la partie avec wenn, hätte ou wäre à la fin ; dans l’autre, würde + infinitif à la fin. C’est un rêve, pas la réalité.',
	'Gerçek dışı koşul: wenn kısmında hätte ya da wäre sonda, diğer kısımda würde + mastar sonda. Gerçek değil, hayal.',
	'Condiție ireală: în partea cu wenn, hätte sau wäre la final; în cealaltă, würde + infinitiv la final. E un vis, nu realitate.',
	"Noreal shart: wenn qismida hätte yoki wäre oxirida, ikkinchi qismda würde + infinitiv oxirida. Bu orzu, haqiqat emas.",
	'अवास्तविक शर्त: wenn वाले हिस्से में hätte या wäre अंत में, दूसरे हिस्से में würde + इन्फ़िनिटिव अंत में। यह सपना है, सच नहीं।',
	'الشرط غير الواقعي: في جزء wenn تأتي hätte أو wäre في الآخر، وفي الجزء الآخر würde + المصدر في الآخر. إنه حلم لا واقع.'
], [
	ex('Wenn ich Zeit hätte, würde ich reisen.', t11('Если бы у меня было время, я бы путешествовал.', 'Якби в мене був час, я б подорожував.', 'If I had time, I would travel.', 'Gdybym miał czas, podróżowałbym.', 'Si tuviera tiempo, viajaría.', 'Si j’avais le temps, je voyagerais.', 'Vaktim olsaydı seyahat ederdim.', 'Dacă aș avea timp, aș călători.', "Vaqtim bo'lganida sayohat qilardim.", 'अगर मेरे पास समय होता, तो मैं घूमता।', 'لو كان عندي وقت لسافرت.')),
	ex('Wenn ich reich wäre, würde ich ein Haus kaufen.', t11('Если бы я был богат, я бы купил дом.', 'Якби я був багатий, я б купив будинок.', 'If I were rich, I would buy a house.', 'Gdybym był bogaty, kupiłbym dom.', 'Si fuera rico, compraría una casa.', 'Si j’étais riche, j’achèterais une maison.', 'Zengin olsaydım bir ev alırdım.', 'Dacă aș fi bogat, aș cumpăra o casă.', "Boy bo'lganimda uy sotib olardim.", 'अगर मैं अमीर होता, तो एक घर खरीदता।', 'لو كنت غنياً لاشتريت بيتاً.'))
])

const koennteOrderPoint = pt(['könnte и порядок частей', 'könnte і порядок частин', 'könnte and the order of parts', 'könnte i kolejność części', 'könnte y el orden de las partes', 'könnte et l’ordre des parties', 'könnte ve kısımların sırası', 'könnte și ordinea părților', "könnte va qismlar tartibi", 'könnte और हिस्सों का क्रम', 'könnte وترتيب الأجزاء'], [
	'könnte значит «мог бы». Главную часть можно поставить первой: Ich würde reisen, wenn ich Zeit hätte.',
	'könnte означає «міг би». Головну частину можна поставити першою: Ich würde reisen, wenn ich Zeit hätte.',
	'könnte means "could". The main part can come first: Ich würde reisen, wenn ich Zeit hätte.',
	'könnte znaczy „mógłbym”. Część główną można postawić na początku: Ich würde reisen, wenn ich Zeit hätte.',
	'könnte significa "podría". La parte principal puede ir primero: Ich würde reisen, wenn ich Zeit hätte.',
	'könnte veut dire « pourrait ». La principale peut venir en premier : Ich würde reisen, wenn ich Zeit hätte.',
	'könnte "-ebilirdi" demektir. Ana kısım başa da gelebilir: Ich würde reisen, wenn ich Zeit hätte.',
	'könnte înseamnă „aș putea”. Partea principală poate veni prima: Ich würde reisen, wenn ich Zeit hätte.',
	"könnte \"qila olardi\" degani. Bosh qismni boshida qo'yish mumkin: Ich würde reisen, wenn ich Zeit hätte.",
	'könnte मतलब "सकता था"। मुख्य हिस्सा पहले भी आ सकता है: Ich würde reisen, wenn ich Zeit hätte।',
	'könnte تعني "كان يمكن". ويمكن تقديم الجزء الرئيسي: Ich würde reisen, wenn ich Zeit hätte.'
], [ex('Wenn ich ein Auto hätte, könnte ich zu Oma fahren.', t11('Если бы у меня была машина, я мог бы поехать к бабушке.', 'Якби в мене була машина, я міг би поїхати до бабусі.', 'If I had a car, I could drive to grandma’s.', 'Gdybym miał samochód, mógłbym pojechać do babci.', 'Si tuviera coche, podría ir a casa de la abuela.', 'Si j’avais une voiture, je pourrais aller chez mamie.', 'Arabam olsaydı büyükanneme gidebilirdim.', 'Dacă aș avea mașină, aș putea merge la bunica.', "Mashinam bo'lganida buvimnikiga bora olardim.", 'अगर मेरे पास गाड़ी होती, तो मैं दादी के पास जा सकता।', 'لو كانت عندي سيارة لاستطعت زيارة جدتي.'))])

const wuenschtePoint = pt(['Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...', 'Ich wünschte, ...'], [
	'Ich wünschte значит «жаль, что нет; хотел бы я». После запятой обычный порядок слов и hätte, wäre, könnte.',
	'Ich wünschte означає «шкода, що немає; хотів би я». Після коми звичайний порядок слів і hätte, wäre, könnte.',
	'Ich wünschte means "I wish". After the comma, normal word order with hätte, wäre, könnte.',
	'Ich wünschte znaczy „szkoda, że nie; chciałbym”. Po przecinku zwykły szyk i hätte, wäre, könnte.',
	'Ich wünschte significa "ojalá". Tras la coma, orden normal con hätte, wäre, könnte.',
	'Ich wünschte veut dire « j’aimerais tant que ». Après la virgule, ordre normal avec hätte, wäre, könnte.',
	'Ich wünschte "keşke" demektir. Virgülden sonra normal sıra ve hätte, wäre, könnte.',
	'Ich wünschte înseamnă „aș vrea, păcat că nu”. După virgulă, ordine normală și hätte, wäre, könnte.',
	"Ich wünschte \"qaniydi\" degani. Verguldan keyin oddiy tartib va hätte, wäre, könnte.",
	'Ich wünschte मतलब "काश"। कॉमा के बाद सामान्य क्रम और hätte, wäre, könnte।',
	'Ich wünschte تعني "ليت". وبعد الفاصلة ترتيب عادي مع hätte وwäre وkönnte.'
], [ex('Ich wünschte, ich hätte mehr Zeit.', t11('Жаль, что у меня мало времени.', 'Шкода, що в мене мало часу.', 'I wish I had more time.', 'Szkoda, że nie mam więcej czasu.', 'Ojalá tuviera más tiempo.', 'J’aimerais avoir plus de temps.', 'Keşke daha çok vaktim olsa.', 'Aș vrea să am mai mult timp.', "Qaniydi ko'proq vaqtim bo'lsa.", 'काश मेरे पास और समय होता।', 'ليت عندي وقتاً أكثر.'))])

const realPoint = pt(['Реально или мечта', 'Реально чи мрія', 'Real or a dream', 'Realnie czy marzenie', 'Real o sueño', 'Réel ou rêve', 'Gerçek mi, hayal mi', 'Real sau vis', 'Haqiqat yoki orzu', 'वास्तविक या सपना', 'واقع أم حلم'], [
	'habe, ist, kann значит «возможно, может случиться». hätte, wäre, könnte, würde значит «мечта, на самом деле нет».',
	'habe, ist, kann означає «можливо, може статися». hätte, wäre, könnte, würde означає «мрія, насправді ні».',
	'habe, ist, kann: possible, it may happen. hätte, wäre, könnte, würde: a dream, not actually true.',
	'habe, ist, kann: możliwe, może się zdarzyć. hätte, wäre, könnte, würde: marzenie, naprawdę nie.',
	'habe, ist, kann: posible, puede pasar. hätte, wäre, könnte, würde: un sueño, en realidad no.',
	'habe, ist, kann : possible, ça peut arriver. hätte, wäre, könnte, würde : un rêve, ce n’est pas le cas.',
	'habe, ist, kann: mümkün, olabilir. hätte, wäre, könnte, würde: hayal, gerçekte değil.',
	'habe, ist, kann: posibil, se poate întâmpla. hätte, wäre, könnte, würde: un vis, de fapt nu.',
	"habe, ist, kann: mumkin, bo'lishi mumkin. hätte, wäre, könnte, würde: orzu, aslida yo'q.",
	'habe, ist, kann: संभव, हो सकता है। hätte, wäre, könnte, würde: सपना, असल में नहीं।',
	'habe وist وkann: ممكن وقد يحدث. وhätte وwäre وkönnte وwürde: حلم، وليس واقعاً.'
], [ex('Wenn es morgen regnet, nehme ich den Bus.', t11('Если завтра будет дождь, я поеду на автобусе.', 'Якщо завтра буде дощ, я поїду автобусом.', 'If it rains tomorrow, I’ll take the bus.', 'Jeśli jutro będzie padać, pojadę autobusem.', 'Si mañana llueve, cojo el autobús.', 'S’il pleut demain, je prendrai le bus.', 'Yarın yağmur yağarsa otobüse binerim.', 'Dacă mâine plouă, iau autobuzul.', "Ertaga yomg'ir yog'sa, avtobusga minaman.", 'अगर कल बारिश हुई, तो मैं बस लूँगा।', 'إذا أمطرت غداً سآخذ الحافلة.'))])

const advicePoint = pt(['Совет через Konjunktiv II', 'Порада через Konjunktiv II', 'Advice with Konjunktiv II', 'Rada przez Konjunktiv II', 'Consejo con Konjunktiv II', 'Conseil avec le Konjunktiv II', 'Konjunktiv II ile tavsiye', 'Sfat cu Konjunktiv II', 'Konjunktiv II bilan maslahat', 'Konjunktiv II से सलाह', 'النصيحة بـ Konjunktiv II'], [
	"Совет: An deiner Stelle würde ich ... или Wenn ich du wäre, würde ich ... (на твоём месте я бы). Мягче: Du könntest ... (ты мог бы).",
	"Порада: An deiner Stelle würde ich ... або Wenn ich du wäre, würde ich ... (на твоєму місці я б). М’якше: Du könntest ... (ти міг би).",
	"Advice: An deiner Stelle würde ich ... or Wenn ich du wäre, würde ich ... (if I were you, I’d). Softer: Du könntest ... (you could).",
	"Rada: An deiner Stelle würde ich ... albo Wenn ich du wäre, würde ich ... (na twoim miejscu bym). Łagodniej: Du könntest ... (mógłbyś).",
	"Consejo: An deiner Stelle würde ich ... o Wenn ich du wäre, würde ich ... (yo en tu lugar). Más suave: Du könntest ... (podrías).",
	"Conseil : An deiner Stelle würde ich ... ou Wenn ich du wäre, würde ich ... (à ta place, je). Plus doux : Du könntest ... (tu pourrais).",
	"Tavsiye: An deiner Stelle würde ich ... ya da Wenn ich du wäre, würde ich ... (senin yerinde olsam). Daha yumuşak: Du könntest ... (-ebilirsin).",
	"Sfat: An deiner Stelle würde ich ... sau Wenn ich du wäre, würde ich ... (în locul tău aș). Mai blând: Du könntest ... (ai putea).",
	"Maslahat: An deiner Stelle würde ich ... yoki Wenn ich du wäre, würde ich ... (sening o'rningda men). Yumshoqroq: Du könntest ... (qila olarding).",
	"सलाह: An deiner Stelle würde ich ... या Wenn ich du wäre, würde ich ... (तुम्हारी जगह मैं)। नरमी से: Du könntest ... (तुम कर सकते हो)।",
	"النصيحة: An deiner Stelle würde ich ... أو Wenn ich du wäre, würde ich ... (لو كنت مكانك). وبلطف أكثر: Du könntest ... (يمكنك)."
], [ex('An deiner Stelle würde ich mich mehr ausruhen.', t11('На твоём месте я бы больше отдыхал.', 'На твоєму місці я б більше відпочивав.', 'If I were you, I’d rest more.', 'Na twoim miejscu więcej bym odpoczywał.', 'Yo en tu lugar descansaría más.', 'À ta place, je me reposerais plus.', 'Senin yerinde olsam daha çok dinlenirdim.', 'În locul tău m-aș odihni mai mult.', "Sening o'rningda ko'proq dam olardim.", 'तुम्हारी जगह मैं ज़्यादा आराम करता।', 'لو كنت مكانك لارتحت أكثر.'))])

const T = (...v) => t11(...v)
const quests = {
	'wish-island-one': { title: T('Если бы у меня было...', 'Якби в мене було...', 'If I had...', 'Gdybym miał...', 'Si tuviera...', 'Si j’avais...', 'Olsaydı...', 'Dacă aș avea...', "Bo'lganida...", 'अगर मेरे पास होता...', 'لو كان عندي...'), points: [haettePoint] },
	'wish-island-two': { title: T('Если бы я был...', 'Якби я був...', 'If I were...', 'Gdybym był...', 'Si fuera...', 'Si j’étais...', 'Olsaydım...', 'Dacă aș fi...', "Bo'lganimda...", 'अगर मैं होता...', 'لو كنت...'), points: [haettePoint] },
	'wish-island-three': { title: T('Я бы..., если бы...', 'Я б..., якби...', 'I would... if...', 'Zrobiłbym..., gdyby...', 'Yo..., si...', 'Je ..., si...', '...rdım, eğer...', 'Aș..., dacă...', "...ardim, agar...", 'मैं ... अगर...', 'لكنتُ ... لو...'), points: [koennteOrderPoint] },
	'wish-island-four': { title: T('Я мог бы: könnte', 'Я міг би: könnte', 'I could: könnte', 'Mógłbym: könnte', 'Podría: könnte', 'Je pourrais : könnte', 'Yapabilirdim: könnte', 'Aș putea: könnte', 'Qila olardim: könnte', 'मैं सकता था: könnte', 'كان يمكنني: könnte'), points: [koennteOrderPoint] },
	'wish-island-five': { title: T('Жаль, что: Ich wünschte', 'Шкода, що: Ich wünschte', 'I wish: Ich wünschte', 'Szkoda, że: Ich wünschte', 'Ojalá: Ich wünschte', 'J’aimerais : Ich wünschte', 'Keşke: Ich wünschte', 'Păcat că: Ich wünschte', 'Qaniydi: Ich wünschte', 'काश: Ich wünschte', 'ليت: Ich wünschte'), points: [wuenschtePoint] },
	'wish-island-six': { title: T('Реально или мечта?', 'Реально чи мрія?', 'Real or a dream?', 'Realnie czy marzenie?', '¿Real o sueño?', 'Réel ou rêve ?', 'Gerçek mi, hayal mi?', 'Real sau vis?', 'Haqiqatmi yoki orzu?', 'वास्तविक या सपना?', 'واقع أم حلم؟'), points: [realPoint] },
	'wish-island-seven': { title: T('Практика: мечты о путешествии', 'Практика: мрії про подорож', 'Practice: travel dreams', 'Praktyka: marzenia o podróży', 'Práctica: sueños de viaje', 'Pratique : rêves de voyage', 'Pratik: seyahat hayalleri', 'Practică: vise de călătorie', 'Mashq: sayohat orzulari', 'अभ्यास: यात्रा के सपने', 'تدريب: أحلام السفر'), points: [haettePoint, wuenschtePoint] },
	'wish-island-eight': { title: T('Практика: совет другу', 'Практика: порада другові', 'Practice: advice to a friend', 'Praktyka: rada dla przyjaciela', 'Práctica: consejo a un amigo', 'Pratique : conseil à un ami', 'Pratik: arkadaşa tavsiye', 'Practică: sfat unui prieten', "Mashq: do'stga maslahat", 'अभ्यास: दोस्त को सलाह', 'تدريب: نصيحة لصديق'), points: [advicePoint, realPoint] },
	'wish-island-nine': { title: T('Повторение: если бы', 'Повторення: якби', 'Review: if', 'Powtórka: gdyby', 'Repaso: si', 'Révision : si', 'Tekrar: -saydı', 'Recapitulare: dacă', 'Takrorlash: agar', 'दोहराव: अगर', 'مراجعة: لو'), points: [haettePoint, koennteOrderPoint, wuenschtePoint] },
	'wish-island-ten': { title: finalTitle, points: [haettePoint, realPoint] }
}

module.exports = quests
