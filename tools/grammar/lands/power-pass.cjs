// Грамматика к заданиям земли power-pass (Перевал возможностей: модальные глаголы)
const ex = (de, tr) => ({ de, tr })

const verbEnd = {
	ru: ['Второй глагол в конце', 'Модальный глагол стоит на втором месте, а главный глагол уходит в конец и не меняется.'],
	uk: ['Друге дієслово в кінці', 'Модальне дієслово стоїть на другому місці, а головне йде в кінець і не змінюється.'],
	en: ['The second verb goes to the end', 'The modal verb is in second place, and the main verb goes to the end unchanged.'],
	pl: ['Drugi czasownik na końcu', 'Czasownik modalny stoi na drugim miejscu, a główny idzie na koniec i się nie zmienia.'],
	es: ['El segundo verbo al final', 'El verbo modal va en segundo lugar y el principal va al final sin cambiar.'],
	fr: ['Le deuxième verbe à la fin', 'Le verbe de modalité est en deuxième position, le verbe principal va à la fin sans changer.'],
	tr: ['İkinci fiil sonda', 'Modal fiil ikinci sıradadır, asıl fiil değişmeden sona gider.'],
	ro: ['Al doilea verb la final', 'Verbul modal stă pe locul doi, iar verbul principal merge la final neschimbat.'],
	uz: ["Ikkinchi fe'l oxirida", "Modal fe'l ikkinchi o'rinda, asosiy fe'l esa o'zgarmasdan oxiriga o'tadi."],
	hi: ['दूसरी क्रिया अंत में', 'मोडल क्रिया दूसरे स्थान पर, और मुख्य क्रिया बिना बदले अंत में जाती है।'],
	ar: ['الفعل الثاني في الآخر', 'الفعل المساعد في المكان الثاني، والفعل الأساسي يذهب إلى الآخر بدون تغيير.']
}

const quests = {
	'power-pass-one': {
		title: {
			ru: 'können: я умею', uk: 'können: я вмію', en: 'können: I can',
			pl: 'können: umiem', es: 'können: sé, puedo', fr: 'können : je sais, je peux',
			tr: 'können: yapabilirim', ro: 'können: pot, știu', uz: 'können: men qila olaman',
			hi: 'können: मैं कर सकता हूँ', ar: 'können: أستطيع'
		},
		points: [
			{
				t: {
					ru: ['Формы können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. У ich и er окончания нет.'],
					uk: ['Форми können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. У ich та er закінчення немає.'],
					en: ['Forms of können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich and er have no ending.'],
					pl: ['Formy können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich i er nie mają końcówki.'],
					es: ['Formas de können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich y er no tienen terminación.'],
					fr: ['Formes de können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich et er n’ont pas de terminaison.'],
					tr: ['können biçimleri', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich ve er ek almaz.'],
					ro: ['Formele lui können', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich și er nu au terminație.'],
					uz: ['können shakllari', "ich kann, du kannst, er kann, wir können, ihr könnt, sie können. ich va er da qo'shimcha yo'q."],
					hi: ['können के रूप', 'ich kann, du kannst, er kann, wir können, ihr könnt, sie können। ich और er में कोई अंत नहीं।'],
					ar: ['صيغ können', 'ich kann، du kannst، er kann، wir können، ihr könnt، sie können. ولا نهاية مع ich وer.']
				},
				examples: []
			},
			{
				t: verbEnd,
				examples: [
					ex('Ich kann gut schwimmen.', { ru: 'Я хорошо плаваю.', uk: 'Я добре плаваю.', en: 'I can swim well.', pl: 'Umiem dobrze pływać.', es: 'Sé nadar bien.', fr: 'Je sais bien nager.', tr: 'İyi yüzebilirim.', ro: 'Știu să înot bine.', uz: 'Men yaxshi suza olaman.', hi: 'मैं अच्छा तैर सकता हूँ।', ar: 'أستطيع السباحة جيداً.' }),
					ex('Anna kann Gitarre spielen.', { ru: 'Анна умеет играть на гитаре.', uk: 'Анна вміє грати на гітарі.', en: 'Anna can play the guitar.', pl: 'Anna umie grać na gitarze.', es: 'Anna sabe tocar la guitarra.', fr: 'Anna sait jouer de la guitare.', tr: 'Anna gitar çalabilir.', ro: 'Anna știe să cânte la chitară.', uz: 'Anna gitara chala oladi.', hi: 'अन्ना गिटार बजा सकती है।', ar: 'آنا تستطيع العزف على الغيتار.' })
				]
			}
		]
	},

	'power-pass-two': {
		title: {
			ru: 'können в вопросах и просьбах', uk: 'können у питаннях і проханнях', en: 'können in questions and requests',
			pl: 'können w pytaniach i prośbach', es: 'können en preguntas y peticiones', fr: 'können dans les questions et les demandes',
			tr: 'können soru ve ricalarda', ro: 'können în întrebări și rugăminți', uz: "können savol va iltimoslarda",
			hi: 'सवालों और अनुरोधों में können', ar: 'können في الأسئلة والطلبات'
		},
		points: [
			{
				t: {
					ru: ['Вежливая просьба', 'В вопросе können идёт первым. Так же звучит вежливая просьба.'],
					uk: ['Ввічливе прохання', 'У питанні können іде першим. Так само звучить ввічливе прохання.'],
					en: ['A polite request', 'In a question können comes first. That’s also how a polite request sounds.'],
					pl: ['Grzeczna prośba', 'W pytaniu können idzie pierwsze. Tak samo brzmi grzeczna prośba.'],
					es: ['Una petición educada', 'En la pregunta können va primero. Así se hace también una petición educada.'],
					fr: ['Une demande polie', 'Dans une question, können vient en premier. C’est aussi une demande polie.'],
					tr: ['Kibar rica', 'Soruda können başa gelir. Kibar rica da böyle yapılır.'],
					ro: ['O rugăminte politicoasă', 'În întrebare können vine primul. Așa sună și o rugăminte politicoasă.'],
					uz: ['Muloyim iltimos', "Savolda können birinchi keladi. Muloyim iltimos ham shunday aytiladi."],
					hi: ['विनम्र अनुरोध', 'सवाल में können पहले आता है। विनम्र अनुरोध भी ऐसे ही होता है।'],
					ar: ['الطلب المهذب', 'في السؤال يأتي können أولاً. وهكذا أيضاً يكون الطلب المهذب.']
				},
				examples: [
					ex('Kannst du bitte langsam sprechen?', { ru: 'Можешь говорить медленнее, пожалуйста?', uk: 'Можеш говорити повільніше, будь ласка?', en: 'Can you speak slowly, please?', pl: 'Możesz mówić wolniej, proszę?', es: '¿Puedes hablar despacio, por favor?', fr: 'Tu peux parler lentement, s’il te plaît ?', tr: 'Lütfen yavaş konuşur musun?', ro: 'Poți vorbi mai rar, te rog?', uz: 'Iltimos, sekinroq gapira olasanmi?', hi: 'क्या तुम धीरे बोल सकते हो, कृपया?', ar: 'هل يمكنك التكلم ببطء من فضلك؟' }),
					ex('Können Sie das wiederholen?', { ru: 'Вы можете это повторить?', uk: 'Ви можете це повторити?', en: 'Can you repeat that?', pl: 'Czy może pan to powtórzyć?', es: '¿Puede repetirlo?', fr: 'Vous pouvez répéter ?', tr: 'Tekrar edebilir misiniz?', ro: 'Puteți repeta?', uz: 'Buni qaytara olasizmi?', hi: 'क्या आप यह दोहरा सकते हैं?', ar: 'هل يمكنك أن تعيد ذلك؟' })
				]
			},
			{
				t: {
					ru: ['nicht перед главным глаголом', 'nicht стоит перед глаголом в конце.'],
					uk: ['nicht перед головним дієсловом', 'nicht стоїть перед дієсловом у кінці.'],
					en: ['nicht before the main verb', 'nicht goes before the verb at the end.'],
					pl: ['nicht przed głównym czasownikiem', 'nicht stoi przed czasownikiem na końcu.'],
					es: ['nicht antes del verbo principal', 'nicht va delante del verbo del final.'],
					fr: ['nicht avant le verbe principal', 'nicht se place devant le verbe à la fin.'],
					tr: ['nicht asıl fiilden önce', 'nicht sondaki fiilden önce gelir.'],
					ro: ['nicht înaintea verbului principal', 'nicht stă înaintea verbului de la final.'],
					uz: ["nicht asosiy fe'ldan oldin", "nicht oxirdagi fe'ldan oldin turadi."],
					hi: ['nicht मुख्य क्रिया से पहले', 'nicht अंत वाली क्रिया से पहले आता है।'],
					ar: ['nicht قبل الفعل الأساسي', 'تأتي nicht قبل الفعل الذي في الآخر.']
				},
				examples: [
					ex('Ich kann heute nicht kommen.', { ru: 'Сегодня я не могу прийти.', uk: 'Сьогодні я не можу прийти.', en: 'I can’t come today.', pl: 'Dziś nie mogę przyjść.', es: 'Hoy no puedo venir.', fr: 'Je ne peux pas venir aujourd’hui.', tr: 'Bugün gelemem.', ro: 'Azi nu pot veni.', uz: 'Bugun kela olmayman.', hi: 'आज मैं नहीं आ सकता।', ar: 'لا أستطيع المجيء اليوم.' })
				]
			}
		]
	},

	'power-pass-three': {
		title: {
			ru: 'müssen: я должен', uk: 'müssen: я мушу', en: 'müssen: I must',
			pl: 'müssen: muszę', es: 'müssen: tengo que', fr: 'müssen : je dois',
			tr: 'müssen: zorundayım', ro: 'müssen: trebuie', uz: 'müssen: men majburman',
			hi: 'müssen: मुझे करना होगा', ar: 'müssen: يجب عليّ'
		},
		points: [
			{
				t: {
					ru: ['Формы müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Порядок слов как у können.'],
					uk: ['Форми müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Порядок слів як у können.'],
					en: ['Forms of müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Word order as with können.'],
					pl: ['Formy müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Szyk jak przy können.'],
					es: ['Formas de müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. El orden es como con können.'],
					fr: ['Formes de müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Même ordre que können.'],
					tr: ['müssen biçimleri', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Sıra können gibi.'],
					ro: ['Formele lui müssen', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. Ordinea ca la können.'],
					uz: ['müssen shakllari', "ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen. So'z tartibi können dagi kabi."],
					hi: ['müssen के रूप', 'ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen। शब्द क्रम können जैसा।'],
					ar: ['صيغ müssen', 'ich muss، du musst، er muss، wir müssen، ihr müsst، sie müssen. والترتيب مثل können.']
				},
				examples: [
					ex('Heute muss ich arbeiten.', { ru: 'Сегодня я должен работать.', uk: 'Сьогодні я мушу працювати.', en: 'Today I have to work.', pl: 'Dziś muszę pracować.', es: 'Hoy tengo que trabajar.', fr: 'Aujourd’hui, je dois travailler.', tr: 'Bugün çalışmak zorundayım.', ro: 'Azi trebuie să lucrez.', uz: 'Bugun ishlashim kerak.', hi: 'आज मुझे काम करना है।', ar: 'اليوم يجب أن أعمل.' })
				]
			},
			{
				t: {
					ru: ['muss nicht: не надо', 'muss nicht значит «не надо», а не «нельзя».'],
					uk: ['muss nicht: не треба', 'muss nicht означає «не треба», а не «не можна».'],
					en: ['muss nicht: don’t have to', 'muss nicht means "don’t have to", not "must not".'],
					pl: ['muss nicht: nie trzeba', 'muss nicht znaczy „nie musisz”, a nie „nie wolno”.'],
					es: ['muss nicht: no hace falta', 'muss nicht significa "no hace falta", no "está prohibido".'],
					fr: ['muss nicht : pas besoin', 'muss nicht veut dire « pas besoin de », pas « interdit ».'],
					tr: ['muss nicht: gerek yok', 'muss nicht "gerek yok" demektir, "yasak" değil.'],
					ro: ['muss nicht: nu e nevoie', 'muss nicht înseamnă „nu e nevoie”, nu „nu ai voie”.'],
					uz: ['muss nicht: shart emas', "muss nicht \"shart emas\" degani, \"mumkin emas\" emas."],
					hi: ['muss nicht: ज़रूरत नहीं', 'muss nicht का मतलब "ज़रूरत नहीं", "मना है" नहीं।'],
					ar: ['muss nicht: لا داعي', 'muss nicht تعني "لا داعي"، وليس "ممنوع".']
				},
				examples: [
					ex('Du musst nicht kommen.', { ru: 'Можешь не приходить.', uk: 'Можеш не приходити.', en: 'You don’t have to come.', pl: 'Nie musisz przychodzić.', es: 'No hace falta que vengas.', fr: 'Tu n’es pas obligé de venir.', tr: 'Gelmek zorunda değilsin.', ro: 'Nu e nevoie să vii.', uz: 'Kelishing shart emas.', hi: 'तुम्हें आने की ज़रूरत नहीं।', ar: 'لا داعي لأن تأتي.' })
				]
			}
		]
	},

	'power-pass-four': {
		title: {
			ru: 'wollen: я хочу', uk: 'wollen: я хочу', en: 'wollen: I want',
			pl: 'wollen: chcę', es: 'wollen: quiero', fr: 'wollen : je veux',
			tr: 'wollen: istiyorum', ro: 'wollen: vreau', uz: 'wollen: men xohlayman',
			hi: 'wollen: मैं चाहता हूँ', ar: 'wollen: أريد'
		},
		points: [
			{
				t: {
					ru: ['Формы wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					uk: ['Форми wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					en: ['Forms of wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					pl: ['Formy wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					es: ['Formas de wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					fr: ['Formes de wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					tr: ['wollen biçimleri', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					ro: ['Formele lui wollen', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					uz: ['wollen shakllari', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen.'],
					hi: ['wollen के रूप', 'ich will, du willst, er will, wir wollen, ihr wollt, sie wollen।'],
					ar: ['صيغ wollen', 'ich will، du willst، er will، wir wollen، ihr wollt، sie wollen.']
				},
				examples: [
					ex('Ich will Deutsch lernen.', { ru: 'Я хочу учить немецкий.', uk: 'Я хочу вчити німецьку.', en: 'I want to learn German.', pl: 'Chcę uczyć się niemieckiego.', es: 'Quiero aprender alemán.', fr: 'Je veux apprendre l’allemand.', tr: 'Almanca öğrenmek istiyorum.', ro: 'Vreau să învăț germana.', uz: "Men nemis tilini o'rganmoqchiman.", hi: 'मैं जर्मन सीखना चाहता हूँ।', ar: 'أريد أن أتعلم الألمانية.' })
				]
			},
			{
				t: {
					ru: ['will или möchte', 'Ich will звучит прямо и твёрдо. В кафе и магазине вежливее Ich möchte.'],
					uk: ['will чи möchte', 'Ich will звучить прямо й твердо. У кафе та магазині ввічливіше Ich möchte.'],
					en: ['will or möchte', 'Ich will sounds direct and firm. In a café or shop Ich möchte is more polite.'],
					pl: ['will czy möchte', 'Ich will brzmi bezpośrednio i twardo. W kawiarni i sklepie grzeczniej Ich möchte.'],
					es: ['will o möchte', 'Ich will suena directo y firme. En el café o la tienda es más educado Ich möchte.'],
					fr: ['will ou möchte', 'Ich will est direct et ferme. Au café ou au magasin, Ich möchte est plus poli.'],
					tr: ['will mi, möchte mi', 'Ich will doğrudan ve sert duyulur. Kafede ve mağazada Ich möchte daha kibardır.'],
					ro: ['will sau möchte', 'Ich will sună direct și ferm. La cafenea sau în magazin e mai politicos Ich möchte.'],
					uz: ['will yoki möchte', "Ich will to'g'ridan-to'g'ri va qat'iy eshitiladi. Kafe va do'konda Ich möchte muloyimroq."],
					hi: ['will या möchte', 'Ich will सीधा और सख़्त लगता है। कैफ़े और दुकान में Ich möchte ज़्यादा विनम्र है।'],
					ar: ['will أم möchte', 'Ich will تبدو مباشرة وحازمة. وفي المقهى والمتجر Ich möchte أكثر أدباً.']
				},
				examples: [
					ex('Wollen wir eine Pause machen?', { ru: 'Давай сделаем перерыв?', uk: 'Давай зробимо перерву?', en: 'Shall we take a break?', pl: 'Zrobimy przerwę?', es: '¿Hacemos una pausa?', fr: 'On fait une pause ?', tr: 'Mola verelim mi?', ro: 'Facem o pauză?', uz: 'Tanaffus qilamizmi?', hi: 'क्या हम ब्रेक लें?', ar: 'هل نأخذ استراحة؟' })
				]
			}
		]
	},

	'power-pass-five': {
		title: {
			ru: 'dürfen: можно и нельзя', uk: 'dürfen: можна і не можна', en: 'dürfen: allowed and not allowed',
			pl: 'dürfen: wolno i nie wolno', es: 'dürfen: se puede y no se puede', fr: 'dürfen : permis et interdit',
			tr: 'dürfen: izinli ve yasak', ro: 'dürfen: voie și interzis', uz: 'dürfen: mumkin va mumkin emas',
			hi: 'dürfen: अनुमति है और मना है', ar: 'dürfen: مسموح وممنوع'
		},
		points: [
			{
				t: {
					ru: ['Спросить разрешение', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? значит «можно мне...?»'],
					uk: ['Запитати дозвіл', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? означає «можна мені...?»'],
					en: ['Asking permission', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? means "May I...?"'],
					pl: ['Zapytać o pozwolenie', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? znaczy „czy mogę...?”'],
					es: ['Pedir permiso', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? significa "¿puedo...?"'],
					fr: ['Demander la permission', 'ich darf, du darfst, er darf, wir dürfen. Darf ich... ? veut dire « je peux... ? »'],
					tr: ['İzin istemek', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? "... yapabilir miyim?" demektir.'],
					ro: ['Să ceri voie', 'ich darf, du darfst, er darf, wir dürfen. Darf ich...? înseamnă „pot să...?”'],
					uz: ["Ruxsat so'rash", "ich darf, du darfst, er darf, wir dürfen. Darf ich...? \"mumkinmi...?\" degani."],
					hi: ['अनुमति माँगना', 'ich darf, du darfst, er darf, wir dürfen। Darf ich...? मतलब "क्या मैं ... सकता हूँ?"'],
					ar: ['طلب الإذن', 'ich darf، du darfst، er darf، wir dürfen. وDarf ich...؟ تعني "هل يمكنني...؟"']
				},
				examples: [
					ex('Darf ich hier parken?', { ru: 'Можно мне здесь припарковаться?', uk: 'Можна мені тут припаркуватися?', en: 'May I park here?', pl: 'Czy mogę tu zaparkować?', es: '¿Puedo aparcar aquí?', fr: 'Je peux me garer ici ?', tr: 'Buraya park edebilir miyim?', ro: 'Pot să parchez aici?', uz: "Shu yerga mashina qo'ysam bo'ladimi?", hi: 'क्या मैं यहाँ पार्क कर सकता हूँ?', ar: 'هل يمكنني الوقوف هنا؟' })
				]
			},
			{
				t: {
					ru: ['darf nicht: нельзя', 'С отрицанием это запрет. Сравни: muss nicht (не надо) и darf nicht (нельзя).'],
					uk: ['darf nicht: не можна', 'Із запереченням це заборона. Порівняй: muss nicht (не треба) і darf nicht (не можна).'],
					en: ['darf nicht: not allowed', 'With a negation it’s a ban. Compare: muss nicht (don’t have to) and darf nicht (must not).'],
					pl: ['darf nicht: nie wolno', 'Z przeczeniem to zakaz. Porównaj: muss nicht (nie trzeba) i darf nicht (nie wolno).'],
					es: ['darf nicht: prohibido', 'Con negación es una prohibición. Compara: muss nicht (no hace falta) y darf nicht (no se puede).'],
					fr: ['darf nicht : interdit', 'Avec la négation, c’est une interdiction. Compare : muss nicht (pas besoin) et darf nicht (interdit).'],
					tr: ['darf nicht: yasak', 'Olumsuzla yasak olur. Karşılaştır: muss nicht (gerek yok) ve darf nicht (yasak).'],
					ro: ['darf nicht: interzis', 'Cu negație e o interdicție. Compară: muss nicht (nu e nevoie) și darf nicht (nu ai voie).'],
					uz: ['darf nicht: mumkin emas', "Inkor bilan bu taqiq. Solishtir: muss nicht (shart emas) va darf nicht (mumkin emas)."],
					hi: ['darf nicht: मना है', 'नकार के साथ यह मनाही है। तुलना करो: muss nicht (ज़रूरत नहीं) और darf nicht (मना है)।'],
					ar: ['darf nicht: ممنوع', 'مع النفي يصبح منعاً. قارن: muss nicht (لا داعي) وdarf nicht (ممنوع).']
				},
				examples: [
					ex('Du darfst hier nicht rauchen.', { ru: 'Здесь тебе нельзя курить.', uk: 'Тут тобі не можна курити.', en: 'You’re not allowed to smoke here.', pl: 'Tu nie wolno ci palić.', es: 'Aquí no puedes fumar.', fr: 'Tu n’as pas le droit de fumer ici.', tr: 'Burada sigara içemezsin.', ro: 'Aici nu ai voie să fumezi.', uz: 'Bu yerda chekishing mumkin emas.', hi: 'तुम यहाँ धूम्रपान नहीं कर सकते।', ar: 'ممنوع أن تدخن هنا.' }),
					ex('Kinder dürfen keinen Alkohol trinken.', { ru: 'Детям нельзя пить алкоголь.', uk: 'Дітям не можна пити алкоголь.', en: 'Children aren’t allowed to drink alcohol.', pl: 'Dzieciom nie wolno pić alkoholu.', es: 'Los niños no pueden beber alcohol.', fr: 'Les enfants n’ont pas le droit de boire d’alcool.', tr: 'Çocuklar alkol içemez.', ro: 'Copiii nu au voie să bea alcool.', uz: 'Bolalarga spirtli ichimlik ichish mumkin emas.', hi: 'बच्चे शराब नहीं पी सकते।', ar: 'ممنوع على الأطفال شرب الكحول.' })
				]
			}
		]
	},

	'power-pass-six': {
		title: {
			ru: 'muss aufstehen: приставка не отделяется', uk: 'muss aufstehen: префікс не відокремлюється', en: 'muss aufstehen: the prefix stays on',
			pl: 'muss aufstehen: przedrostek się nie odrywa', es: 'muss aufstehen: el prefijo no se separa', fr: 'muss aufstehen : le préfixe reste attaché',
			tr: 'muss aufstehen: ön ek ayrılmaz', ro: 'muss aufstehen: prefixul nu se desparte', uz: "muss aufstehen: old qo'shimcha ajralmaydi",
			hi: 'muss aufstehen: उपसर्ग अलग नहीं होता', ar: 'muss aufstehen: السابقة لا تنفصل'
		},
		points: [
			{
				t: {
					ru: ['Глагол в конце целиком', 'С модальным глаголом отделяемый глагол стоит в конце целиком: Ich stehe früh auf, но Ich muss früh aufstehen.'],
					uk: ['Дієслово в кінці цілим', 'З модальним дієсловом відокремлюване дієслово стоїть у кінці цілим: Ich stehe früh auf, але Ich muss früh aufstehen.'],
					en: ['The whole verb at the end', 'With a modal verb the separable verb stays whole at the end: Ich stehe früh auf, but Ich muss früh aufstehen.'],
					pl: ['Cały czasownik na końcu', 'Z czasownikiem modalnym czasownik rozdzielny stoi na końcu w całości: Ich stehe früh auf, ale Ich muss früh aufstehen.'],
					es: ['El verbo entero al final', 'Con un modal, el verbo separable va entero al final: Ich stehe früh auf, pero Ich muss früh aufstehen.'],
					fr: ['Le verbe entier à la fin', 'Avec un verbe de modalité, le verbe séparable reste entier à la fin : Ich stehe früh auf, mais Ich muss früh aufstehen.'],
					tr: ['Fiil bütün olarak sonda', 'Modal fiille ayrılabilen fiil sonda bütün kalır: Ich stehe früh auf, ama Ich muss früh aufstehen.'],
					ro: ['Verbul întreg la final', 'Cu un verb modal, verbul separabil stă întreg la final: Ich stehe früh auf, dar Ich muss früh aufstehen.'],
					uz: ["Fe'l oxirida butun holda", "Modal fe'l bilan ajraladigan fe'l oxirida butun turadi: Ich stehe früh auf, lekin Ich muss früh aufstehen."],
					hi: ['पूरी क्रिया अंत में', 'मोडल क्रिया के साथ अलग होने वाली क्रिया अंत में पूरी रहती है: Ich stehe früh auf, लेकिन Ich muss früh aufstehen।'],
					ar: ['الفعل كاملاً في الآخر', 'مع الفعل المساعد يبقى الفعل ذو السابقة كاملاً في الآخر: Ich stehe früh auf، لكن Ich muss früh aufstehen.']
				},
				examples: [
					ex('Wir müssen heute einkaufen.', { ru: 'Нам сегодня надо сходить за покупками.', uk: 'Нам сьогодні треба сходити по покупки.', en: 'We have to go shopping today.', pl: 'Musimy dziś zrobić zakupy.', es: 'Hoy tenemos que hacer la compra.', fr: 'Nous devons faire les courses aujourd’hui.', tr: 'Bugün alışveriş yapmalıyız.', ro: 'Azi trebuie să facem cumpărături.', uz: 'Bugun xarid qilishimiz kerak.', hi: 'आज हमें खरीदारी करनी है।', ar: 'يجب أن نتسوق اليوم.' }),
					ex('Ich kann nicht mitkommen.', { ru: 'Я не могу пойти с вами.', uk: 'Я не можу піти з вами.', en: 'I can’t come along.', pl: 'Nie mogę iść z wami.', es: 'No puedo ir con vosotros.', fr: 'Je ne peux pas venir avec vous.', tr: 'Sizinle gelemem.', ro: 'Nu pot veni cu voi.', uz: 'Siz bilan bora olmayman.', hi: 'मैं साथ नहीं आ सकता।', ar: 'لا أستطيع المجيء معكم.' })
				]
			}
		]
	},

	'power-pass-seven': {
		title: {
			ru: 'Практика: какой глагол выбрать', uk: 'Практика: яке дієслово обрати', en: 'Practice: which verb to choose',
			pl: 'Praktyka: który czasownik wybrać', es: 'Práctica: qué verbo elegir', fr: 'Pratique : quel verbe choisir',
			tr: 'Pratik: hangi fiili seçmeli', ro: 'Practică: ce verb alegi', uz: "Mashq: qaysi fe'lni tanlash",
			hi: 'अभ्यास: कौन-सी क्रिया चुनें', ar: 'تدريب: أي فعل نختار'
		},
		points: [
			{
				t: {
					ru: ['По смыслу', 'kann: умею, могу. muss: надо. will: хочу. darf: разрешено.'],
					uk: ['За змістом', 'kann: вмію, можу. muss: треба. will: хочу. darf: дозволено.'],
					en: ['By meaning', 'kann: can, able to. muss: have to. will: want. darf: allowed.'],
					pl: ['Według znaczenia', 'kann: umiem, mogę. muss: muszę. will: chcę. darf: wolno mi.'],
					es: ['Según el sentido', 'kann: sé, puedo. muss: tengo que. will: quiero. darf: tengo permiso.'],
					fr: ['Selon le sens', 'kann : je sais, je peux. muss : je dois. will : je veux. darf : j’ai le droit.'],
					tr: ['Anlama göre', 'kann: yapabilirim. muss: zorundayım. will: istiyorum. darf: iznim var.'],
					ro: ['După sens', 'kann: pot, știu. muss: trebuie. will: vreau. darf: am voie.'],
					uz: ["Ma'nosiga qarab", "kann: qila olaman. muss: kerak. will: xohlayman. darf: ruxsat bor."],
					hi: ['अर्थ के अनुसार', 'kann: कर सकता हूँ। muss: करना होगा। will: चाहता हूँ। darf: अनुमति है।'],
					ar: ['حسب المعنى', 'kann: أستطيع. muss: يجب. will: أريد. darf: مسموح.']
				},
				examples: [
					ex('Ich bin krank. Ich muss zu Hause bleiben.', { ru: 'Я болен. Мне надо остаться дома.', uk: 'Я хворий. Мені треба залишитися вдома.', en: 'I’m ill. I have to stay at home.', pl: 'Jestem chory. Muszę zostać w domu.', es: 'Estoy enfermo. Tengo que quedarme en casa.', fr: 'Je suis malade. Je dois rester à la maison.', tr: 'Hastayım. Evde kalmalıyım.', ro: 'Sunt bolnav. Trebuie să stau acasă.', uz: 'Men kasalman. Uyda qolishim kerak.', hi: 'मैं बीमार हूँ। मुझे घर पर रहना है।', ar: 'أنا مريض. يجب أن أبقى في البيت.' })
				]
			}
		]
	},

	'power-pass-eight': {
		title: {
			ru: 'Практика: договариваемся', uk: 'Практика: домовляємося', en: 'Practice: making arrangements',
			pl: 'Praktyka: umawiamy się', es: 'Práctica: quedar', fr: 'Pratique : s’organiser',
			tr: 'Pratik: anlaşmak', ro: 'Practică: ne înțelegem', uz: 'Mashq: kelishamiz',
			hi: 'अभ्यास: तय करना', ar: 'تدريب: نتفق'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Предложить: Wollen wir...? Отказать: Ich kann leider nicht. Ich muss arbeiten.'],
					uk: ['Нових правил немає', 'Запропонувати: Wollen wir...? Відмовити: Ich kann leider nicht. Ich muss arbeiten.'],
					en: ['No new rules', 'Suggest: Wollen wir...? Decline: Ich kann leider nicht. Ich muss arbeiten.'],
					pl: ['Bez nowych reguł', 'Zaproponować: Wollen wir...? Odmówić: Ich kann leider nicht. Ich muss arbeiten.'],
					es: ['Sin reglas nuevas', 'Proponer: Wollen wir...? Rechazar: Ich kann leider nicht. Ich muss arbeiten.'],
					fr: ['Pas de nouvelle règle', 'Proposer : Wollen wir... ? Refuser : Ich kann leider nicht. Ich muss arbeiten.'],
					tr: ['Yeni kural yok', 'Öneri: Wollen wir...? Reddetme: Ich kann leider nicht. Ich muss arbeiten.'],
					ro: ['Fără reguli noi', 'Propui: Wollen wir...? Refuzi: Ich kann leider nicht. Ich muss arbeiten.'],
					uz: ["Yangi qoida yo'q", "Taklif: Wollen wir...? Rad etish: Ich kann leider nicht. Ich muss arbeiten."],
					hi: ['कोई नया नियम नहीं', 'सुझाव: Wollen wir...? मना करना: Ich kann leider nicht. Ich muss arbeiten.'],
					ar: ['لا قواعد جديدة', 'للاقتراح: Wollen wir...؟ وللرفض: Ich kann leider nicht. Ich muss arbeiten.']
				},
				examples: [
					ex('Wollen wir einen Film sehen?', { ru: 'Посмотрим фильм?', uk: 'Подивимося фільм?', en: 'Shall we watch a film?', pl: 'Obejrzymy film?', es: '¿Vemos una película?', fr: 'On regarde un film ?', tr: 'Film izleyelim mi?', ro: 'Ne uităm la un film?', uz: "Film ko'ramizmi?", hi: 'क्या हम फ़िल्म देखें?', ar: 'هل نشاهد فيلماً؟' }),
					ex('Darf ich meine Schwester mitbringen?', { ru: 'Можно мне привести сестру?', uk: 'Можна мені привести сестру?', en: 'May I bring my sister?', pl: 'Mogę przyprowadzić siostrę?', es: '¿Puedo traer a mi hermana?', fr: 'Je peux amener ma sœur ?', tr: 'Kız kardeşimi getirebilir miyim?', ro: 'Pot să-mi aduc sora?', uz: "Singlimni olib kelsam bo'ladimi?", hi: 'क्या मैं अपनी बहन को ला सकता हूँ?', ar: 'هل يمكنني إحضار أختي؟' })
				]
			}
		]
	},

	'power-pass-nine': {
		title: {
			ru: 'Повторение: модальные глаголы', uk: 'Повторення: модальні дієслова', en: 'Review: modal verbs',
			pl: 'Powtórka: czasowniki modalne', es: 'Repaso: verbos modales', fr: 'Révision : les verbes de modalité',
			tr: 'Tekrar: modal fiiller', ro: 'Recapitulare: verbele modale', uz: "Takrorlash: modal fe'llar",
			hi: 'दोहराव: मोडल क्रियाएँ', ar: 'مراجعة: الأفعال المساعدة'
		},
		points: [
			{
				t: {
					ru: ['ich и er без окончания', 'ich kann, er muss, sie will, es darf.'],
					uk: ['ich та er без закінчення', 'ich kann, er muss, sie will, es darf.'],
					en: ['ich and er with no ending', 'ich kann, er muss, sie will, es darf.'],
					pl: ['ich i er bez końcówki', 'ich kann, er muss, sie will, es darf.'],
					es: ['ich y er sin terminación', 'ich kann, er muss, sie will, es darf.'],
					fr: ['ich et er sans terminaison', 'ich kann, er muss, sie will, es darf.'],
					tr: ['ich ve er eksiz', 'ich kann, er muss, sie will, es darf.'],
					ro: ['ich și er fără terminație', 'ich kann, er muss, sie will, es darf.'],
					uz: ["ich va er qo'shimchasiz", 'ich kann, er muss, sie will, es darf.'],
					hi: ['ich और er बिना अंत के', 'ich kann, er muss, sie will, es darf।'],
					ar: ['ich وer بدون نهاية', 'ich kann، er muss، sie will، es darf.']
				},
				examples: [
					ex('Lisa muss heute zu Hause bleiben.', { ru: 'Лиза сегодня должна остаться дома.', uk: 'Ліза сьогодні мусить залишитися вдома.', en: 'Lisa has to stay at home today.', pl: 'Lisa musi dziś zostać w domu.', es: 'Lisa tiene que quedarse hoy en casa.', fr: 'Lisa doit rester à la maison aujourd’hui.', tr: 'Lisa bugün evde kalmalı.', ro: 'Lisa trebuie să stea azi acasă.', uz: 'Liza bugun uyda qolishi kerak.', hi: 'लिसा को आज घर पर रहना है।', ar: 'يجب أن تبقى ليزا في البيت اليوم.' })
				]
			},
			{
				t: verbEnd,
				examples: [
					ex('Ich will früh aufstehen.', { ru: 'Я хочу рано вставать.', uk: 'Я хочу рано вставати.', en: 'I want to get up early.', pl: 'Chcę wcześnie wstawać.', es: 'Quiero levantarme temprano.', fr: 'Je veux me lever tôt.', tr: 'Erken kalkmak istiyorum.', ro: 'Vreau să mă trezesc devreme.', uz: 'Men erta turmoqchiman.', hi: 'मैं जल्दी उठना चाहता हूँ।', ar: 'أريد أن أستيقظ مبكراً.' })
				]
			},
			{
				t: {
					ru: ['muss nicht и darf nicht', 'muss nicht значит «не надо», darf nicht значит «нельзя».'],
					uk: ['muss nicht і darf nicht', 'muss nicht означає «не треба», darf nicht означає «не можна».'],
					en: ['muss nicht and darf nicht', 'muss nicht means "don’t have to", darf nicht means "must not".'],
					pl: ['muss nicht i darf nicht', 'muss nicht znaczy „nie trzeba”, darf nicht „nie wolno”.'],
					es: ['muss nicht y darf nicht', 'muss nicht es "no hace falta", darf nicht es "está prohibido".'],
					fr: ['muss nicht et darf nicht', 'muss nicht veut dire « pas besoin », darf nicht veut dire « interdit ».'],
					tr: ['muss nicht ve darf nicht', 'muss nicht "gerek yok", darf nicht "yasak" demektir.'],
					ro: ['muss nicht și darf nicht', 'muss nicht înseamnă „nu e nevoie”, darf nicht „nu ai voie”.'],
					uz: ['muss nicht va darf nicht', "muss nicht \"shart emas\", darf nicht \"mumkin emas\" degani."],
					hi: ['muss nicht और darf nicht', 'muss nicht मतलब "ज़रूरत नहीं", darf nicht मतलब "मना है"।'],
					ar: ['muss nicht وdarf nicht', 'muss nicht تعني "لا داعي"، وdarf nicht تعني "ممنوع".']
				},
				examples: []
			}
		]
	},

	'power-pass-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Форма для ihr', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: гласная такая же, как у wir.'],
					uk: ['Форма для ihr', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: голосна така сама, як у wir.'],
					en: ['The ihr form', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: same vowel as wir.'],
					pl: ['Forma dla ihr', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: samogłoska jak przy wir.'],
					es: ['La forma de ihr', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: la misma vocal que con wir.'],
					fr: ['La forme de ihr', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft : même voyelle qu’avec wir.'],
					tr: ['ihr biçimi', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: ünlü wir’deki gibi.'],
					ro: ['Forma pentru ihr', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: aceeași vocală ca la wir.'],
					uz: ['ihr shakli', "ihr könnt, ihr müsst, ihr wollt, ihr dürft: unli wir dagi kabi."],
					hi: ['ihr का रूप', 'ihr könnt, ihr müsst, ihr wollt, ihr dürft: स्वर wir जैसा।'],
					ar: ['صيغة ihr', 'ihr könnt، ihr müsst، ihr wollt، ihr dürft: الحرف نفسه كما مع wir.']
				},
				examples: [
					ex('Könnt ihr Deutsch sprechen?', { ru: 'Вы умеете говорить по-немецки?', uk: 'Ви вмієте говорити німецькою?', en: 'Can you (all) speak German?', pl: 'Umiecie mówić po niemiecku?', es: '¿Sabéis hablar alemán?', fr: 'Vous savez parler allemand ?', tr: 'Almanca konuşabiliyor musunuz?', ro: 'Știți să vorbiți germana?', uz: 'Sizlar nemischa gapira olasizlarmi?', hi: 'क्या तुम सब जर्मन बोल सकते हो?', ar: 'هل تستطيعون التكلم بالألمانية؟' })
				]
			},
			{
				t: verbEnd,
				examples: [
					ex('Sie kann nicht mitkommen.', { ru: 'Она не может пойти с нами.', uk: 'Вона не може піти з нами.', en: 'She can’t come along.', pl: 'Ona nie może iść z nami.', es: 'Ella no puede venir.', fr: 'Elle ne peut pas venir avec nous.', tr: 'O bizimle gelemez.', ro: 'Ea nu poate veni cu noi.', uz: 'U biz bilan bora olmaydi.', hi: 'वह साथ नहीं आ सकती।', ar: 'هي لا تستطيع المجيء معنا.' })
				]
			}
		]
	}
}

module.exports = quests
