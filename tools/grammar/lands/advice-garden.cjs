// Грамматика к заданиям земли advice-garden (sollte, würde gern, wäre/hätte gern)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const solltePoint = pt(['sollte: тебе следует', 'sollte: тобі варто', 'sollte: you should', 'sollte: powinieneś', 'sollte: deberías', 'sollte : tu devrais', 'sollte: -meli', 'sollte: ar trebui', 'sollte: ... kerak', 'sollte: तुम्हें चाहिए', 'sollte: ينبغي'], [
	'Совет: sollte + инфинитив в конце. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Порада: sollte + інфінітив у кінці. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Advice: sollte + infinitive at the end. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Rada: sollte + bezokolicznik na końcu. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Consejo: sollte + infinitivo al final. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Conseil : sollte + infinitif à la fin. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Tavsiye: sollte + mastar sonda. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	'Sfat: sollte + infinitiv la final. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
	"Maslahat: sollte + infinitiv oxirida. ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.",
	'सलाह: sollte + इन्फ़िनिटिव अंत में। ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten।',
	'النصيحة: sollte + المصدر في الآخر. ich sollte، du solltest، er sollte، wir sollten، ihr solltet، sie sollten.'
], [
	ex('Du solltest mehr schlafen.', t11('Тебе стоит больше спать.', 'Тобі варто більше спати.', 'You should sleep more.', 'Powinieneś więcej spać.', 'Deberías dormir más.', 'Tu devrais dormir plus.', 'Daha çok uyumalısın.', 'Ar trebui să dormi mai mult.', "Ko'proq uxlashing kerak.", 'तुम्हें ज़्यादा सोना चाहिए।', 'ينبغي أن تنام أكثر.')),
	ex('Sie sollten nicht so viel arbeiten.', t11('Вам не стоит так много работать.', 'Вам не варто так багато працювати.', 'You shouldn’t work so much.', 'Nie powinien pan tyle pracować.', 'No debería trabajar tanto.', 'Vous ne devriez pas travailler autant.', 'Bu kadar çok çalışmamalısınız.', 'N-ar trebui să lucrați atât de mult.', "Siz bunchalik ko'p ishlamasligingiz kerak.", 'आपको इतना ज़्यादा काम नहीं करना चाहिए।', 'لا ينبغي أن تعمل كثيراً هكذا.'))
])

const wuerdePoint = pt(['würde gern: я бы с удовольствием', 'würde gern: я б із задоволенням', 'würde gern: I’d like to', 'würde gern: chętnie bym', 'würde gern: me gustaría', 'würde gern : j’aimerais', 'würde gern: isterdim', 'würde gern: aș vrea', 'würde gern: ... istardim', 'würde gern: मैं ... चाहूँगा', 'würde gern: أودّ'], [
	'Желание: würde + gern + инфинитив в конце. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'Бажання: würde + gern + інфінітив у кінці. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'A wish: würde + gern + infinitive at the end. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'Życzenie: würde + gern + bezokolicznik na końcu. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'Deseo: würde + gern + infinitivo al final. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'Souhait : würde + gern + infinitif à la fin. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'İstek: würde + gern + mastar sonda. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	'Dorință: würde + gern + infinitiv la final. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.',
	"Istak: würde + gern + infinitiv oxirida. ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden.",
	'इच्छा: würde + gern + इन्फ़िनिटिव अंत में। ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden।',
	'الرغبة: würde + gern + المصدر في الآخر. ich würde، du würdest، er würde، wir würden، ihr würdet، sie würden.'
], [ex('Ich würde gern ans Meer fahren.', t11('Я бы с удовольствием поехал на море.', 'Я б залюбки поїхав на море.', 'I’d like to go to the seaside.', 'Chętnie pojechałbym nad morze.', 'Me gustaría ir al mar.', 'J’aimerais aller à la mer.', 'Denize gitmek isterdim.', 'Aș vrea să merg la mare.', 'Dengizga borishni istardim.', 'मैं समुद्र किनारे जाना चाहूँगा।', 'أودّ الذهاب إلى البحر.'))])

const waereHaettePoint = pt(['wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern, hätte gern', 'wäre gern وhätte gern'], [
	'Мечта: ich wäre gern ... (хотел бы быть), ich hätte gern ... (хотел бы иметь). du wärst, du hättest, wir wären, wir hätten.',
	'Мрія: ich wäre gern ... (хотів би бути), ich hätte gern ... (хотів би мати). du wärst, du hättest, wir wären, wir hätten.',
	'A dream: ich wäre gern ... (I’d like to be), ich hätte gern ... (I’d like to have). du wärst, du hättest, wir wären, wir hätten.',
	'Marzenie: ich wäre gern ... (chciałbym być), ich hätte gern ... (chciałbym mieć). du wärst, du hättest, wir wären, wir hätten.',
	'Un sueño: ich wäre gern ... (me gustaría ser), ich hätte gern ... (me gustaría tener). du wärst, du hättest, wir wären, wir hätten.',
	'Un rêve : ich wäre gern ... (j’aimerais être), ich hätte gern ... (j’aimerais avoir). du wärst, du hättest, wir wären, wir hätten.',
	'Hayal: ich wäre gern ... (olmak isterdim), ich hätte gern ... (sahip olmak isterdim). du wärst, du hättest, wir wären, wir hätten.',
	'Un vis: ich wäre gern ... (aș vrea să fiu), ich hätte gern ... (aș vrea să am). du wärst, du hättest, wir wären, wir hätten.',
	"Orzu: ich wäre gern ... (bo'lishni istardim), ich hätte gern ... (ega bo'lishni istardim). du wärst, du hättest, wir wären, wir hätten.",
	'सपना: ich wäre gern ... (मैं ... होना चाहूँगा), ich hätte gern ... (मेरे पास ... हो)। du wärst, du hättest, wir wären, wir hätten।',
	'الحلم: ich wäre gern ... (أودّ أن أكون)، ich hätte gern ... (أودّ أن أملك). du wärst، du hättest، wir wären، wir hätten.'
], [
	ex('Ich wäre gern reich.', t11('Я хотел бы быть богатым.', 'Я хотів би бути багатим.', 'I’d like to be rich.', 'Chciałbym być bogaty.', 'Me gustaría ser rico.', 'J’aimerais être riche.', 'Zengin olmak isterdim.', 'Aș vrea să fiu bogat.', "Boy bo'lishni istardim.", 'काश मैं अमीर होता।', 'أودّ أن أكون غنياً.')),
	ex('Wir hätten gern einen Hund.', t11('Мы хотели бы собаку.', 'Ми хотіли б собаку.', 'We’d like to have a dog.', 'Chcielibyśmy mieć psa.', 'Nos gustaría tener un perro.', 'Nous aimerions avoir un chien.', 'Bir köpeğimiz olsun isterdik.', 'Ne-ar plăcea să avem un câine.', "It bo'lishini istardik.", 'हम एक कुत्ता रखना चाहेंगे।', 'نودّ أن يكون عندنا كلب.'))
])

const proposalPoint = pt(['Предложить', 'Запропонувати', 'Making suggestions', 'Zaproponować', 'Proponer', 'Proposer', 'Öneri yapmak', 'A propune', 'Taklif qilish', 'सुझाव देना', 'تقديم اقتراح'], [
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? Это вежливые способы предложить что-то.',
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? Це ввічливі способи щось запропонувати.',
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? These are polite ways to suggest something.',
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? To grzeczne sposoby, by coś zaproponować.',
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? Son formas educadas de proponer algo.',
	'Würdest du ... ? Hast du Lust auf ... ? Wie wäre es mit ... ? Wollen wir ... ? Ce sont des façons polies de proposer quelque chose.',
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? Bir şey önermenin kibar yollarıdır.',
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? Sunt moduri politicoase de a propune ceva.',
	"Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? Bu biror narsani taklif qilishning muloyim usullari.",
	'Würdest du ...? Hast du Lust auf ...? Wie wäre es mit ...? Wollen wir ...? ये कुछ सुझाने के विनम्र तरीके हैं।',
	'Würdest du ...؟ Hast du Lust auf ...؟ Wie wäre es mit ...؟ Wollen wir ...؟ طرق مهذبة لاقتراح شيء.'
], [ex('Würdest du mir helfen?', t11('Ты бы мне помог?', 'Ти б мені допоміг?', 'Would you help me?', 'Pomógłbyś mi?', '¿Me ayudarías?', 'Tu m’aiderais ?', 'Bana yardım eder misin?', 'M-ai ajuta?', 'Menga yordam berarmiding?', 'क्या तुम मेरी मदद करोगे?', 'هل تساعدني؟'))])

const stellePoint = pt(['На твоём месте', 'На твоєму місці', 'If I were you', 'Na twoim miejscu', 'Yo en tu lugar', 'À ta place', 'Senin yerinde olsam', 'În locul tău', "Sening o'rningda bo'lsam", 'तुम्हारी जगह होता तो', 'لو كنت مكانك'], [
	'An deiner Stelle würde ich ... (на твоём месте я бы ...). Глагол würde сразу после An deiner Stelle.',
	'An deiner Stelle würde ich ... (на твоєму місці я б ...). Дієслово würde одразу після An deiner Stelle.',
	'An deiner Stelle würde ich ... (if I were you, I’d ...). würde comes right after An deiner Stelle.',
	'An deiner Stelle würde ich ... (na twoim miejscu bym ...). würde zaraz po An deiner Stelle.',
	'An deiner Stelle würde ich ... (yo en tu lugar ...). würde va justo después de An deiner Stelle.',
	'An deiner Stelle würde ich ... (à ta place, je ...). würde vient juste après An deiner Stelle.',
	'An deiner Stelle würde ich ... (senin yerinde olsam ...). würde, An deiner Stelle’den hemen sonra.',
	'An deiner Stelle würde ich ... (în locul tău aș ...). würde vine imediat după An deiner Stelle.',
	"An deiner Stelle würde ich ... (sening o'rningda men ...). würde An deiner Stelle dan keyin darhol.",
	'An deiner Stelle würde ich ... (तुम्हारी जगह मैं ...)। würde, An deiner Stelle के ठीक बाद।',
	'An deiner Stelle würde ich ... (لو كنت مكانك لـ...). وwürde تأتي مباشرة بعد An deiner Stelle.'
], [ex('An deiner Stelle würde ich mit dem Nachbarn sprechen.', t11('На твоём месте я бы поговорил с соседом.', 'На твоєму місці я б поговорив із сусідом.', 'If I were you, I’d talk to the neighbour.', 'Na twoim miejscu porozmawiałbym z sąsiadem.', 'Yo en tu lugar hablaría con el vecino.', 'À ta place, je parlerais au voisin.', 'Senin yerinde olsam komşuyla konuşurdum.', 'În locul tău aș vorbi cu vecinul.', "Sening o'rningda qo'shni bilan gaplashardim.", 'तुम्हारी जगह मैं पड़ोसी से बात करता।', 'لو كنت مكانك لتحدثت مع الجار.'))])

const quests = {
	'advice-garden-one': { title: t11('Тебе следует: sollte', 'Тобі варто: sollte', 'You should: sollte', 'Powinieneś: sollte', 'Deberías: sollte', 'Tu devrais : sollte', 'Yapmalısın: sollte', 'Ar trebui: sollte', 'Kerak: sollte', 'तुम्हें चाहिए: sollte', 'ينبغي: sollte'), points: [solltePoint] },
	'advice-garden-two': { title: t11('Советы для здоровья', 'Поради для здоров’я', 'Health advice', 'Rady dla zdrowia', 'Consejos de salud', 'Conseils santé', 'Sağlık tavsiyeleri', 'Sfaturi pentru sănătate', "Sog'liq uchun maslahatlar", 'स्वास्थ्य की सलाह', 'نصائح صحية'), points: [solltePoint] },
	'advice-garden-three': { title: t11('Я бы с удовольствием: würde gern', 'Я б залюбки: würde gern', 'I’d love to: würde gern', 'Chętnie bym: würde gern', 'Me encantaría: würde gern', 'J’aimerais bien : würde gern', 'Çok isterdim: würde gern', 'Mi-ar plăcea: würde gern', 'Jon deb ... edim: würde gern', 'मुझे अच्छा लगेगा: würde gern', 'أودّ: würde gern'), points: [wuerdePoint] },
	'advice-garden-four': { title: t11('Мечты: wäre gern, hätte gern', 'Мрії: wäre gern, hätte gern', 'Dreams: wäre gern, hätte gern', 'Marzenia: wäre gern, hätte gern', 'Sueños: wäre gern, hätte gern', 'Rêves : wäre gern, hätte gern', 'Hayaller: wäre gern, hätte gern', 'Vise: wäre gern, hätte gern', 'Orzular: wäre gern, hätte gern', 'सपने: wäre gern, hätte gern', 'الأحلام: wäre gern وhätte gern'), points: [waereHaettePoint] },
	'advice-garden-five': { title: t11('Есть идея!', 'Є ідея!', 'I have an idea!', 'Mam pomysł!', '¡Tengo una idea!', 'J’ai une idée !', 'Bir fikrim var!', 'Am o idee!', "G'oyam bor!", 'एक आइडिया है!', 'عندي فكرة!'), points: [proposalPoint] },
	'advice-garden-six': { title: t11('На твоём месте...', 'На твоєму місці...', 'If I were you...', 'Na twoim miejscu...', 'Yo en tu lugar...', 'À ta place...', 'Senin yerinde olsam...', 'În locul tău...', "Sening o'rningda...", 'तुम्हारी जगह...', 'لو كنت مكانك...'), points: [stellePoint, solltePoint] },
	'advice-garden-seven': { title: t11('Практика: у врача', 'Практика: у лікаря', 'Practice: at the doctor’s', 'Praktyka: u lekarza', 'Práctica: en el médico', 'Pratique : chez le médecin', 'Pratik: doktorda', 'Practică: la medic', 'Mashq: shifokorda', 'अभ्यास: डॉक्टर के पास', 'تدريب: عند الطبيب'), points: [solltePoint] },
	'advice-garden-eight': { title: t11('Практика: отпуск мечты', 'Практика: відпустка мрії', 'Practice: a dream holiday', 'Praktyka: wymarzony urlop', 'Práctica: las vacaciones soñadas', 'Pratique : les vacances de rêve', 'Pratik: hayalimdeki tatil', 'Practică: vacanța de vis', "Mashq: orzudagi ta'til", 'अभ्यास: सपनों की छुट्टी', 'تدريب: عطلة الأحلام'), points: [wuerdePoint, waereHaettePoint] },
	'advice-garden-nine': { title: t11('Повторение: советы и желания', 'Повторення: поради й бажання', 'Review: advice and wishes', 'Powtórka: rady i życzenia', 'Repaso: consejos y deseos', 'Révision : conseils et souhaits', 'Tekrar: tavsiyeler ve istekler', 'Recapitulare: sfaturi și dorințe', 'Takrorlash: maslahatlar va istaklar', 'दोहराव: सलाह और इच्छाएँ', 'مراجعة: النصائح والرغبات'), points: [solltePoint, wuerdePoint, waereHaettePoint] },
	'advice-garden-ten': { title: finalTitle, points: [solltePoint, wuerdePoint, proposalPoint] }
}

module.exports = quests
