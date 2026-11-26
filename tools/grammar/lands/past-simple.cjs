// Грамматика к заданиям земли past-simple (Präteritum: war, hatte, модальные)
const { ex, t11, pt, noRules, finalTitle } = require('../lib.cjs')

const warPoint = pt('sein → war', [
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. У ich и er одинаково, без окончания.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. У ich та er однаково, без закінчення.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. ich and er are the same, with no ending.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. ich i er tak samo, bez końcówki.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. ich y er son iguales, sin terminación.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. ich et er sont identiques, sans terminaison.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. ich ve er aynı, eksiz.',
	'ich war, du warst, er war, wir waren, ihr wart, sie waren. ich și er la fel, fără terminație.',
	"ich war, du warst, er war, wir waren, ihr wart, sie waren. ich va er bir xil, qo'shimchasiz.",
	'ich war, du warst, er war, wir waren, ihr wart, sie waren। ich और er एक जैसे, बिना अंत के।',
	'ich war، du warst، er war، wir waren، ihr wart، sie waren. ich وer متشابهتان وبدون نهاية.'
], [
	ex('Gestern waren wir im Kino.', t11('Вчера мы были в кино.', 'Учора ми були в кіно.', 'Yesterday we were at the cinema.', 'Wczoraj byliśmy w kinie.', 'Ayer estuvimos en el cine.', 'Hier, nous étions au cinéma.', 'Dün sinemadaydık.', 'Ieri am fost la cinema.', 'Kecha biz kinoda edik.', 'कल हम सिनेमा में थे।', 'أمس كنا في السينما.')),
	ex('Wo wart ihr?', t11('Где вы были?', 'Де ви були?', 'Where were you (all)?', 'Gdzie byliście?', '¿Dónde estabais?', 'Où étiez-vous ?', 'Neredeydiniz?', 'Unde ați fost?', 'Qayerda edinglar?', 'तुम सब कहाँ थे?', 'أين كنتم؟'))
])

const hattePoint = pt('haben → hatte', [
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.',
	'ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten।',
	'ich hatte، du hattest، er hatte، wir hatten، ihr hattet، sie hatten.'
], [
	ex('Gestern hatte ich keine Zeit.', t11('Вчера у меня не было времени.', 'Учора в мене не було часу.', 'Yesterday I had no time.', 'Wczoraj nie miałem czasu.', 'Ayer no tenía tiempo.', 'Hier, je n’avais pas le temps.', 'Dün vaktim yoktu.', 'Ieri nu am avut timp.', "Kecha vaqtim yo'q edi.", 'कल मेरे पास समय नहीं था।', 'أمس لم يكن عندي وقت.'))
])

const modalPastPoint = pt(['Модальные в прошлом без умлаута', 'Модальні в минулому без умлаута', 'Past modals have no umlaut', 'Modalne w przeszłości bez umlautu', 'Modales en pasado sin diéresis', 'Modaux au passé sans umlaut', 'Geçmiş modal fiillerde umlaut yok', 'Modale la trecut fără umlaut', "O'tgan zamon modallari umlautsiz", 'भूतकाल मोडल बिना उमलाउट', 'الأفعال المساعدة في الماضي بدون أوملاوت'], [
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. Умлаут пропадает.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. Умлаут зникає.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. The umlaut disappears.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. Umlaut znika.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. La diéresis desaparece.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. L’umlaut disparaît.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. Umlaut düşer.',
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. Umlautul dispare.',
	"können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte. Umlaut tushib qoladi.",
	'können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte। उमलाउट हट जाता है।',
	'können → konnte، müssen → musste، dürfen → durfte، wollen → wollte، sollen → sollte. يختفي الأوملاوت.'
], [
	ex('Gestern konnte ich nicht kommen.', t11('Вчера я не смог прийти.', 'Учора я не зміг прийти.', 'Yesterday I couldn’t come.', 'Wczoraj nie mogłem przyjść.', 'Ayer no pude venir.', 'Hier, je n’ai pas pu venir.', 'Dün gelemedim.', 'Ieri nu am putut veni.', 'Kecha kela olmadim.', 'कल मैं नहीं आ सका।', 'أمس لم أستطع المجيء.'))
])

const orderPoint = pt(['Второй глагол в конце', 'Друге дієслово в кінці', 'The second verb goes to the end', 'Drugi czasownik na końcu', 'El segundo verbo al final', 'Le deuxième verbe à la fin', 'İkinci fiil sonda', 'Al doilea verb la final', "Ikkinchi fe'l oxirida", 'दूसरी क्रिया अंत में', 'الفعل الثاني في الآخر'], [
	'Как и в настоящем: модальный глагол на втором месте, второй глагол в конце.',
	'Як і в теперішньому: модальне дієслово на другому місці, друге дієслово в кінці.',
	'Just like in the present: the modal is in second place, the other verb at the end.',
	'Jak w czasie teraźniejszym: czasownik modalny na drugim miejscu, drugi czasownik na końcu.',
	'Igual que en presente: el modal en segundo lugar, el otro verbo al final.',
	'Comme au présent : le verbe de modalité en deuxième position, l’autre verbe à la fin.',
	'Şimdiki zamandaki gibi: modal fiil ikinci sırada, diğer fiil sonda.',
	'Ca la prezent: verbul modal pe locul doi, celălalt verb la final.',
	"Hozirgi zamondagidek: modal fe'l ikkinchi o'rinda, boshqa fe'l oxirida.",
	'वर्तमान की तरह: मोडल क्रिया दूसरे स्थान पर, दूसरी क्रिया अंत में।',
	'كما في المضارع: الفعل المساعد في المكان الثاني والفعل الآخر في الآخر.'
], [
	ex('Ich musste gestern arbeiten.', t11('Вчера мне пришлось работать.', 'Учора мені довелося працювати.', 'I had to work yesterday.', 'Wczoraj musiałem pracować.', 'Ayer tuve que trabajar.', 'Hier, j’ai dû travailler.', 'Dün çalışmak zorundaydım.', 'Ieri a trebuit să lucrez.', 'Kecha ishlashim kerak edi.', 'कल मुझे काम करना पड़ा।', 'أمس اضطررت للعمل.'))
])

const quests = {
	'past-simple-1': {
		title: t11('war: я был', 'war: я був', 'war: I was', 'war: byłem', 'war: estaba, era', 'war : j’étais', 'war: idim', 'war: am fost', 'war: edim', 'war: मैं था', 'war: كنتُ'),
		points: [warPoint]
	},
	'past-simple-2': {
		title: t11('hatte: у меня было', 'hatte: у мене було', 'hatte: I had', 'hatte: miałem', 'hatte: tenía', 'hatte : j’avais', 'hatte: vardı', 'hatte: am avut', 'hatte: menda bor edi', 'hatte: मेरे पास था', 'hatte: كان عندي'),
		points: [hattePoint]
	},
	'past-simple-3': {
		title: t11('war или hatte?', 'war чи hatte?', 'war or hatte?', 'war czy hatte?', '¿war o hatte?', 'war ou hatte ?', 'war mı, hatte mi?', 'war sau hatte?', 'war yoki hatte?', 'war या hatte?', 'war أم hatte؟'),
		points: [pt(['Как выбрать', 'Як обрати', 'How to choose', 'Jak wybrać', 'Cómo elegir', 'Comment choisir', 'Nasıl seçilir', 'Cum alegi', 'Qanday tanlash', 'कैसे चुनें', 'كيف تختار'], [
			'Как в настоящем: müde sein → war müde, Stress haben → hatte Stress. Слова времени: gestern, letzte Woche, letztes Jahr.',
			'Як у теперішньому: müde sein → war müde, Stress haben → hatte Stress. Слова часу: gestern, letzte Woche, letztes Jahr.',
			'Same as in the present: müde sein → war müde, Stress haben → hatte Stress. Time words: gestern, letzte Woche, letztes Jahr.',
			'Jak w teraźniejszym: müde sein → war müde, Stress haben → hatte Stress. Słowa czasu: gestern, letzte Woche, letztes Jahr.',
			'Como en presente: müde sein → war müde, Stress haben → hatte Stress. Palabras de tiempo: gestern, letzte Woche, letztes Jahr.',
			'Comme au présent : müde sein → war müde, Stress haben → hatte Stress. Mots de temps : gestern, letzte Woche, letztes Jahr.',
			'Şimdiki zamandaki gibi: müde sein → war müde, Stress haben → hatte Stress. Zaman kelimeleri: gestern, letzte Woche, letztes Jahr.',
			'Ca la prezent: müde sein → war müde, Stress haben → hatte Stress. Cuvinte de timp: gestern, letzte Woche, letztes Jahr.',
			"Hozirgi zamondagidek: müde sein → war müde, Stress haben → hatte Stress. Vaqt so'zlari: gestern, letzte Woche, letztes Jahr.",
			'वर्तमान की तरह: müde sein → war müde, Stress haben → hatte Stress। समय के शब्द: gestern, letzte Woche, letztes Jahr।',
			'كما في المضارع: müde sein → war müde، Stress haben → hatte Stress. وكلمات الزمن: gestern، letzte Woche، letztes Jahr.'
		], [
			ex('Gestern war ich müde.', t11('Вчера я был уставшим.', 'Учора я був втомлений.', 'Yesterday I was tired.', 'Wczoraj byłem zmęczony.', 'Ayer estaba cansado.', 'Hier, j’étais fatigué.', 'Dün yorgundum.', 'Ieri am fost obosit.', 'Kecha charchagan edim.', 'कल मैं थका हुआ था।', 'أمس كنت متعباً.')),
			ex('Gestern hatte ich Stress.', t11('Вчера у меня был стресс.', 'Учора в мене був стрес.', 'Yesterday I was stressed.', 'Wczoraj miałem stres.', 'Ayer tuve estrés.', 'Hier, j’étais stressé.', 'Dün stresliydim.', 'Ieri am avut stres.', 'Kecha stressda edim.', 'कल मुझे तनाव था।', 'أمس كنت متوتراً.'))
		])]
	},
	'past-simple-4': {
		title: t11('konnte и musste', 'konnte і musste', 'konnte and musste', 'konnte i musste', 'konnte y musste', 'konnte et musste', 'konnte ve musste', 'konnte și musste', 'konnte va musste', 'konnte और musste', 'konnte وmusste'),
		points: [modalPastPoint, orderPoint]
	},
	'past-simple-5': {
		title: t11('wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte, durfte, sollte', 'wollte وdurfte وsollte'),
		points: [modalPastPoint, pt('sollte', [
			'sollte значит «нужно было», когда кто-то другой попросил.',
			'sollte означає «треба було», коли хтось інший попросив.',
			'sollte means "was supposed to", when someone else asked you to.',
			'sollte znaczy „miałem”, gdy ktoś inny o to poprosił.',
			'sollte significa "tenía que", cuando otra persona lo pidió.',
			'sollte veut dire « je devais », quand quelqu’un d’autre l’a demandé.',
			'sollte, başkası istediğinde "yapmam gerekiyordu" demektir.',
			'sollte înseamnă „trebuia”, când altcineva a cerut.',
			"sollte boshqa birov so'raganda \"qilishim kerak edi\" degani.",
			'sollte मतलब "करना था", जब किसी और ने कहा हो।',
			'sollte تعني "كان عليّ"، عندما يطلب ذلك شخص آخر.'
		], [ex('Ich sollte Brot mitbringen.', t11('Мне нужно было принести хлеб.', 'Мені треба було принести хліб.', 'I was supposed to bring bread.', 'Miałem przynieść chleb.', 'Tenía que traer pan.', 'Je devais apporter du pain.', 'Ekmek getirmem gerekiyordu.', 'Trebuia să aduc pâine.', 'Non olib kelishim kerak edi.', 'मुझे रोटी लानी थी।', 'كان عليّ إحضار الخبز.'))])]
	},
	'past-simple-6': {
		title: t11('Модальные в прошлом: порядок слов', 'Модальні в минулому: порядок слів', 'Past modals: word order', 'Modalne w przeszłości: szyk', 'Modales en pasado: orden', 'Modaux au passé : ordre des mots', 'Geçmiş modal: kelime sırası', 'Modale la trecut: ordinea', "O'tgan modallar: so'z tartibi", 'भूतकाल मोडल: शब्द क्रम', 'الأفعال المساعدة في الماضي: الترتيب'),
		points: [orderPoint, pt(['В вопросе модальный первым', 'У питанні модальне першим', 'In a question the modal comes first', 'W pytaniu modalny pierwszy', 'En la pregunta el modal va primero', 'Dans une question, le modal en premier', 'Soruda modal başta', 'În întrebare modalul primul', "Savolda modal birinchi", 'सवाल में मोडल पहले', 'في السؤال يأتي المساعد أولاً'], [
			'Wolltest du ins Kino gehen? Второй глагол всё равно в конце.',
			'Wolltest du ins Kino gehen? Друге дієслово однаково в кінці.',
			'Wolltest du ins Kino gehen? The second verb is still at the end.',
			'Wolltest du ins Kino gehen? Drugi czasownik i tak na końcu.',
			'Wolltest du ins Kino gehen? El segundo verbo sigue al final.',
			'Wolltest du ins Kino gehen ? Le deuxième verbe reste à la fin.',
			'Wolltest du ins Kino gehen? İkinci fiil yine sonda.',
			'Wolltest du ins Kino gehen? Al doilea verb tot la final.',
			"Wolltest du ins Kino gehen? Ikkinchi fe'l baribir oxirida.",
			'Wolltest du ins Kino gehen? दूसरी क्रिया फिर भी अंत में।',
			'Wolltest du ins Kino gehen؟ والفعل الثاني يبقى في الآخر.'
		], [ex('Wolltest du ins Kino gehen?', t11('Ты хотел пойти в кино?', 'Ти хотів піти в кіно?', 'Did you want to go to the cinema?', 'Chciałeś iść do kina?', '¿Querías ir al cine?', 'Tu voulais aller au cinéma ?', 'Sinemaya gitmek mi istiyordun?', 'Voiai să mergi la cinema?', 'Kinoga bormoqchi edingmi?', 'क्या तुम सिनेमा जाना चाहते थे?', 'هل أردت الذهاب إلى السينما؟'))])]
	},
	'past-simple-9': {
		title: t11('Практика: вчерашний вечер', 'Практика: учорашній вечір', 'Practice: last night', 'Praktyka: wczorajszy wieczór', 'Práctica: anoche', 'Pratique : hier soir', 'Pratik: dün akşam', 'Practică: aseară', 'Mashq: kechagi oqshom', 'अभ्यास: कल शाम', 'تدريب: مساء أمس'),
		points: [warPoint, hattePoint]
	},
	'past-simple-10': {
		title: t11('Практика: когда я был маленьким', 'Практика: коли я був маленьким', 'Practice: when I was little', 'Praktyka: kiedy byłem mały', 'Práctica: cuando era pequeño', 'Pratique : quand j’étais petit', 'Pratik: küçükken', 'Practică: când eram mic', "Mashq: kichkinaligimda", 'अभ्यास: जब मैं छोटा था', 'تدريب: عندما كنت صغيراً'),
		points: [pt(noRules, [
			'Als Kind значит «в детстве». После него сразу глагол: Als Kind wollte ich...',
			'Als Kind означає «у дитинстві». Після нього одразу дієслово: Als Kind wollte ich...',
			'Als Kind means "as a child". The verb follows straight after: Als Kind wollte ich...',
			'Als Kind znaczy „w dzieciństwie”. Zaraz po nim czasownik: Als Kind wollte ich...',
			'Als Kind significa "de niño". Justo después va el verbo: Als Kind wollte ich...',
			'Als Kind veut dire « enfant, quand j’étais petit ». Le verbe suit tout de suite : Als Kind wollte ich...',
			'Als Kind "çocukken" demektir. Hemen ardından fiil gelir: Als Kind wollte ich...',
			'Als Kind înseamnă „în copilărie”. Imediat după vine verbul: Als Kind wollte ich...',
			"Als Kind \"bolaligimda\" degani. Undan keyin darhol fe'l: Als Kind wollte ich...",
			'Als Kind मतलब "बचपन में"। इसके ठीक बाद क्रिया: Als Kind wollte ich...',
			'Als Kind تعني "في طفولتي". ويأتي الفعل بعدها مباشرة: Als Kind wollte ich...'
		], [ex('Als Kind wollte ich Pilot werden.', t11('В детстве я хотел стать пилотом.', 'У дитинстві я хотів стати пілотом.', 'As a child I wanted to be a pilot.', 'W dzieciństwie chciałem zostać pilotem.', 'De niño quería ser piloto.', 'Enfant, je voulais devenir pilote.', 'Çocukken pilot olmak istiyordum.', 'În copilărie voiam să devin pilot.', "Bolaligimda uchuvchi bo'lmoqchi edim.", 'बचपन में मैं पायलट बनना चाहता था।', 'في طفولتي أردت أن أصبح طياراً.'))]), modalPastPoint]
	},
	'past-simple-7': {
		title: t11('Повторение: прошлое', 'Повторення: минуле', 'Review: the past', 'Powtórka: przeszłość', 'Repaso: el pasado', 'Révision : le passé', 'Tekrar: geçmiş', 'Recapitulare: trecutul', "Takrorlash: o'tgan zamon", 'दोहराव: भूतकाल', 'مراجعة: الماضي'),
		points: [warPoint, hattePoint, modalPastPoint]
	},
	'past-simple-8': {
		title: finalTitle,
		points: [warPoint, modalPastPoint, orderPoint]
	}
}

module.exports = quests
