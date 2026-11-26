// Грамматика к заданиям земли hearty-inn (Сытный трактир: еда, mögen, gern, schmecken)
const ex = (de, tr) => ({ de, tr })

const finalTitle = {
	ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
	pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
	tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
	hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
}

const magPoint = {
	t: {
		ru: ['mögen: люблю вещь', 'ich mag, du magst, er mag, wir mögen. После mögen вещь в Akkusativ, отрицание через kein.'],
		uk: ['mögen: люблю річ', 'ich mag, du magst, er mag, wir mögen. Після mögen річ в Akkusativ, заперечення через kein.'],
		en: ['mögen: I like a thing', 'ich mag, du magst, er mag, wir mögen. After mögen the thing is in the accusative, negation with kein.'],
		pl: ['mögen: lubię rzecz', 'ich mag, du magst, er mag, wir mögen. Po mögen rzecz w Akkusativ, przeczenie przez kein.'],
		es: ['mögen: me gusta algo', 'ich mag, du magst, er mag, wir mögen. Después de mögen va el acusativo, la negación con kein.'],
		fr: ['mögen : aimer une chose', 'ich mag, du magst, er mag, wir mögen. Après mögen, accusatif, et négation avec kein.'],
		tr: ['mögen: bir şeyi sevmek', 'ich mag, du magst, er mag, wir mögen. mögen’den sonra Akkusativ, olumsuz kein ile.'],
		ro: ['mögen: îmi place ceva', 'ich mag, du magst, er mag, wir mögen. După mögen, acuzativ, negația cu kein.'],
		uz: ["mögen: narsani yoqtirish", "ich mag, du magst, er mag, wir mögen. mögen dan keyin Akkusativ, inkor kein bilan."],
		hi: ['mögen: कोई चीज़ पसंद होना', 'ich mag, du magst, er mag, wir mögen। mögen के बाद Akkusativ, नकार kein से।'],
		ar: ['mögen: أحب شيئاً', 'ich mag، du magst، er mag، wir mögen. بعد mögen يأتي المفعول، والنفي بـ kein.']
	},
	examples: [
		ex('Ich mag Käse.', { ru: 'Я люблю сыр.', uk: 'Я люблю сир.', en: 'I like cheese.', pl: 'Lubię ser.', es: 'Me gusta el queso.', fr: 'J’aime le fromage.', tr: 'Peyniri severim.', ro: 'Îmi place brânza.', uz: "Men pishloqni yaxshi ko'raman.", hi: 'मुझे पनीर पसंद है।', ar: 'أحب الجبن.' }),
		ex('Ich mag keinen Fisch.', { ru: 'Я не люблю рыбу.', uk: 'Я не люблю рибу.', en: 'I don’t like fish.', pl: 'Nie lubię ryby.', es: 'No me gusta el pescado.', fr: 'Je n’aime pas le poisson.', tr: 'Balık sevmem.', ro: 'Nu-mi place peștele.', uz: 'Men baliqni yoqtirmayman.', hi: 'मुझे मछली पसंद नहीं।', ar: 'لا أحب السمك.' })
	]
}

const gernPoint = {
	t: {
		ru: ['gern: люблю делать', 'gern стоит сразу после глагола. Ich mag Pizza: люблю пиццу. Ich esse gern Pizza: люблю есть пиццу.'],
		uk: ['gern: люблю робити', 'gern стоїть одразу після дієслова. Ich mag Pizza: люблю піцу. Ich esse gern Pizza: люблю їсти піцу.'],
		en: ['gern: I like doing', 'gern comes right after the verb. Ich mag Pizza: I like pizza. Ich esse gern Pizza: I like eating pizza.'],
		pl: ['gern: lubię robić', 'gern stoi zaraz po czasowniku. Ich mag Pizza: lubię pizzę. Ich esse gern Pizza: lubię jeść pizzę.'],
		es: ['gern: me gusta hacer', 'gern va justo después del verbo. Ich mag Pizza: me gusta la pizza. Ich esse gern Pizza: me gusta comer pizza.'],
		fr: ['gern : aimer faire', 'gern vient juste après le verbe. Ich mag Pizza : j’aime la pizza. Ich esse gern Pizza : j’aime manger de la pizza.'],
		tr: ['gern: yapmayı sevmek', 'gern fiilden hemen sonra gelir. Ich mag Pizza: pizzayı severim. Ich esse gern Pizza: pizza yemeyi severim.'],
		ro: ['gern: îmi place să fac', 'gern vine imediat după verb. Ich mag Pizza: îmi place pizza. Ich esse gern Pizza: îmi place să mănânc pizza.'],
		uz: ["gern: qilishni yoqtirish", "gern fe'ldan keyin darhol turadi. Ich mag Pizza: pitsani yoqtiraman. Ich esse gern Pizza: pitsa yeyishni yoqtiraman."],
		hi: ['gern: करना पसंद है', 'gern क्रिया के ठीक बाद आता है। Ich mag Pizza: मुझे पिज़्ज़ा पसंद है। Ich esse gern Pizza: मुझे पिज़्ज़ा खाना पसंद है।'],
		ar: ['gern: أحب أن أفعل', 'تأتي gern مباشرة بعد الفعل. Ich mag Pizza: أحب البيتزا. Ich esse gern Pizza: أحب أكل البيتزا.']
	},
	examples: [
		ex('Er trinkt gern Tee.', { ru: 'Он любит пить чай.', uk: 'Він любить пити чай.', en: 'He likes drinking tea.', pl: 'On lubi pić herbatę.', es: 'A él le gusta tomar té.', fr: 'Il aime boire du thé.', tr: 'O çay içmeyi sever.', ro: 'Lui îi place să bea ceai.', uz: "U choy ichishni yaxshi ko'radi.", hi: 'उसे चाय पीना पसंद है।', ar: 'هو يحب شرب الشاي.' }),
		ex('Ich koche nicht gern.', { ru: 'Я не люблю готовить.', uk: 'Я не люблю готувати.', en: 'I don’t like cooking.', pl: 'Nie lubię gotować.', es: 'No me gusta cocinar.', fr: 'Je n’aime pas cuisiner.', tr: 'Yemek yapmayı sevmem.', ro: 'Nu-mi place să gătesc.', uz: 'Ovqat pishirishni yoqtirmayman.', hi: 'मुझे खाना बनाना पसंद नहीं।', ar: 'لا أحب الطبخ.' })
	]
}

const measurePoint = {
	t: {
		ru: ['Мера без предлога', 'Мера и еда стоят рядом, без «из» и без артикля у еды: eine Tasse Kaffee.'],
		uk: ['Міра без прийменника', 'Міра і їжа стоять поруч, без прийменника і без артикля в їжі: eine Tasse Kaffee.'],
		en: ['Measure with no "of"', 'The measure and the food stand side by side, with no "of" and no article: eine Tasse Kaffee.'],
		pl: ['Miara bez przyimka', 'Miara i jedzenie stoją obok siebie, bez przyimka i bez rodzajnika: eine Tasse Kaffee.'],
		es: ['Medida sin "de"', 'La medida y la comida van juntas, sin "de" y sin artículo: eine Tasse Kaffee.'],
		fr: ['Mesure sans « de »', 'La mesure et l’aliment sont côte à côte, sans « de » ni article : eine Tasse Kaffee.'],
		tr: ['Edatsız ölçü', 'Ölçü ve yiyecek yan yana gelir, edat ve artikel olmadan: eine Tasse Kaffee.'],
		ro: ['Măsura fără „de”', 'Măsura și mâncarea stau una lângă alta, fără „de” și fără articol: eine Tasse Kaffee.'],
		uz: ["Ko'makchisiz o'lchov", "O'lchov va taom yonma-yon, ko'makchi va artiklsiz turadi: eine Tasse Kaffee."],
		hi: ['बिना संबंधसूचक के माप', 'माप और खाना साथ-साथ, बिना "का" और बिना आर्टिकल के: eine Tasse Kaffee।'],
		ar: ['المقدار بدون حرف جر', 'يأتي المقدار والطعام متجاورين بدون حرف جر وبدون أداة: eine Tasse Kaffee.']
	},
	examples: [
		ex('ein Glas Wasser, ein Stück Kuchen', { ru: 'стакан воды, кусок пирога', uk: 'склянка води, шматок пирога', en: 'a glass of water, a piece of cake', pl: 'szklanka wody, kawałek ciasta', es: 'un vaso de agua, un trozo de pastel', fr: 'un verre d’eau, un morceau de gâteau', tr: 'bir bardak su, bir dilim kek', ro: 'un pahar cu apă, o bucată de prăjitură', uz: "bir stakan suv, bir bo'lak pirog", hi: 'एक गिलास पानी, केक का एक टुकड़ा', ar: 'كأس ماء، قطعة كعك' })
	]
}

const quests = {
	'hearty-inn-one': {
		title: { ru: 'mögen: я люблю', uk: 'mögen: я люблю', en: 'mögen: I like', pl: 'mögen: lubię', es: 'mögen: me gusta', fr: 'mögen : j’aime', tr: 'mögen: severim', ro: 'mögen: îmi place', uz: "mögen: yaxshi ko'raman", hi: 'mögen: मुझे पसंद है', ar: 'mögen: أحب' },
		points: [magPoint]
	},

	'hearty-inn-two': {
		title: { ru: 'gern: с удовольствием', uk: 'gern: із задоволенням', en: 'gern: gladly', pl: 'gern: chętnie', es: 'gern: con gusto', fr: 'gern : volontiers', tr: 'gern: severek', ro: 'gern: cu plăcere', uz: 'gern: jon deb', hi: 'gern: खुशी से', ar: 'gern: بكل سرور' },
		points: [gernPoint]
	},

	'hearty-inn-three': {
		title: { ru: 'schmecken: какой вкус', uk: 'schmecken: який смак', en: 'schmecken: how it tastes', pl: 'schmecken: jaki smak', es: 'schmecken: qué sabor', fr: 'schmecken : quel goût', tr: 'schmecken: tadı nasıl', ro: 'schmecken: ce gust are', uz: "schmecken: ta'mi qanday", hi: 'schmecken: स्वाद कैसा है', ar: 'schmecken: ما الطعم' },
		points: [
			{
				t: {
					ru: ['Глагол смотрит на еду', 'schmecken согласуем с едой: одна вещь schmeckt, много вещей schmecken.'],
					uk: ['Дієслово дивиться на їжу', 'schmecken узгоджуємо з їжею: одна річ schmeckt, багато речей schmecken.'],
					en: ['The verb agrees with the food', 'schmecken agrees with the food: one thing schmeckt, several things schmecken.'],
					pl: ['Czasownik zgadza się z jedzeniem', 'schmecken zgadzamy z jedzeniem: jedna rzecz schmeckt, wiele rzeczy schmecken.'],
					es: ['El verbo concuerda con la comida', 'schmecken concuerda con la comida: una cosa schmeckt, varias cosas schmecken.'],
					fr: ['Le verbe s’accorde avec l’aliment', 'schmecken s’accorde avec l’aliment : une chose schmeckt, plusieurs choses schmecken.'],
					tr: ['Fiil yiyeceğe uyar', 'schmecken yiyeceğe uyar: tek şey schmeckt, birden çok şey schmecken.'],
					ro: ['Verbul se acordă cu mâncarea', 'schmecken se acordă cu mâncarea: un lucru schmeckt, mai multe schmecken.'],
					uz: ["Fe'l taomga moslashadi", "schmecken taomga moslashadi: bitta narsa schmeckt, ko'p narsa schmecken."],
					hi: ['क्रिया खाने के अनुसार', 'schmecken खाने के अनुसार बदलता है: एक चीज़ schmeckt, कई चीज़ें schmecken।'],
					ar: ['الفعل يتبع الطعام', 'يتوافق schmecken مع الطعام: شيء واحد schmeckt، وعدة أشياء schmecken.']
				},
				examples: [
					ex('Die Suppe schmeckt gut.', { ru: 'Суп вкусный.', uk: 'Суп смачний.', en: 'The soup tastes good.', pl: 'Zupa jest smaczna.', es: 'La sopa está buena.', fr: 'La soupe est bonne.', tr: 'Çorba lezzetli.', ro: 'Supa e bună.', uz: "Sho'rva mazali.", hi: 'सूप स्वादिष्ट है।', ar: 'الحساء لذيذ.' }),
					ex('Die Äpfel schmecken süß.', { ru: 'Яблоки сладкие на вкус.', uk: 'Яблука солодкі на смак.', en: 'The apples taste sweet.', pl: 'Jabłka są słodkie.', es: 'Las manzanas saben dulces.', fr: 'Les pommes ont un goût sucré.', tr: 'Elmaların tadı tatlı.', ro: 'Merele au gust dulce.', uz: 'Olmalar shirin.', hi: 'सेब मीठे हैं।', ar: 'طعم التفاح حلو.' })
				]
			},
			{
				t: {
					ru: ['zu: слишком', 'zu перед прилагательным значит «слишком».'],
					uk: ['zu: занадто', 'zu перед прикметником означає «занадто».'],
					en: ['zu: too', 'zu before an adjective means "too".'],
					pl: ['zu: za bardzo', 'zu przed przymiotnikiem znaczy „za”.'],
					es: ['zu: demasiado', 'zu delante de un adjetivo significa "demasiado".'],
					fr: ['zu : trop', 'zu devant un adjectif veut dire « trop ».'],
					tr: ['zu: fazla', 'Sıfattan önce zu "fazla, çok" demektir.'],
					ro: ['zu: prea', 'zu înaintea unui adjectiv înseamnă „prea”.'],
					uz: ['zu: juda, haddan tashqari', "Sifatdan oldin zu \"haddan tashqari\" degani."],
					hi: ['zu: बहुत ज़्यादा', 'विशेषण से पहले zu का मतलब "ज़्यादा ही"।'],
					ar: ['zu: أكثر من اللازم', 'zu قبل الصفة تعني "أكثر من اللازم".']
				},
				examples: [
					ex('Die Suppe ist zu salzig.', { ru: 'Суп слишком солёный.', uk: 'Суп занадто солоний.', en: 'The soup is too salty.', pl: 'Zupa jest za słona.', es: 'La sopa está demasiado salada.', fr: 'La soupe est trop salée.', tr: 'Çorba çok tuzlu.', ro: 'Supa e prea sărată.', uz: "Sho'rva juda sho'r.", hi: 'सूप बहुत नमकीन है।', ar: 'الحساء مالح جداً.' })
				]
			}
		]
	},

	'hearty-inn-four': {
		title: { ru: 'Завтрак, обед, ужин', uk: 'Сніданок, обід, вечеря', en: 'Breakfast, lunch, dinner', pl: 'Śniadanie, obiad, kolacja', es: 'Desayuno, comida, cena', fr: 'Petit déjeuner, déjeuner, dîner', tr: 'Kahvaltı, öğle yemeği, akşam yemeği', ro: 'Mic dejun, prânz, cină', uz: 'Nonushta, tushlik, kechki ovqat', hi: 'नाश्ता, दोपहर का खाना, रात का खाना', ar: 'الفطور والغداء والعشاء' },
		points: [
			{
				t: {
					ru: ['es gibt: есть, подают', 'es gibt значит «есть, подают». После него Akkusativ: Es gibt einen Salat.'],
					uk: ['es gibt: є, подають', 'es gibt означає «є, подають». Після нього Akkusativ: Es gibt einen Salat.'],
					en: ['es gibt: there is', 'es gibt means "there is, there’s ... on the menu". It takes the accusative: Es gibt einen Salat.'],
					pl: ['es gibt: jest, podają', 'es gibt znaczy „jest, podają”. Po nim Akkusativ: Es gibt einen Salat.'],
					es: ['es gibt: hay', 'es gibt significa "hay". Va con acusativo: Es gibt einen Salat.'],
					fr: ['es gibt : il y a', 'es gibt veut dire « il y a ». Il est suivi de l’accusatif : Es gibt einen Salat.'],
					tr: ['es gibt: var', 'es gibt "var" demektir. Ardından Akkusativ gelir: Es gibt einen Salat.'],
					ro: ['es gibt: există, se servește', 'es gibt înseamnă „există, se servește”. E urmat de acuzativ: Es gibt einen Salat.'],
					uz: ['es gibt: bor', "es gibt \"bor\" degani. Undan keyin Akkusativ: Es gibt einen Salat."],
					hi: ['es gibt: है, मिलता है', 'es gibt का मतलब "है, परोसा जाता है"। इसके बाद Akkusativ: Es gibt einen Salat।'],
					ar: ['es gibt: يوجد', 'es gibt تعني "يوجد، يُقدَّم". ويأتي بعدها المفعول: Es gibt einen Salat.']
				},
				examples: [
					ex('Was gibt es heute?', { ru: 'Что сегодня на обед (ужин)?', uk: 'Що сьогодні на обід (вечерю)?', en: 'What’s for dinner today?', pl: 'Co dziś jest do jedzenia?', es: '¿Qué hay hoy de comer?', fr: 'Qu’est-ce qu’on mange aujourd’hui ?', tr: 'Bugün yemekte ne var?', ro: 'Ce avem azi de mâncare?', uz: 'Bugun ovqatga nima bor?', hi: 'आज खाने में क्या है?', ar: 'ماذا يوجد للأكل اليوم؟' }),
					ex('Heute gibt es einen Salat.', { ru: "Сегодня подают салат.", uk: "Сьогодні подають салат.", en: "Today there’s a salad.", pl: "Dziś jest sałatka.", es: "Hoy hay ensalada.", fr: "Aujourd’hui, il y a une salade.", tr: "Bugün salata var.", ro: "Azi e salată.", uz: "Bugun salat bor.", hi: "आज सलाद है।", ar: "اليوم يوجد سلطة." })
				]
			}
		]
	},

	'hearty-inn-five': {
		title: { ru: 'eine Tasse Kaffee: мера и еда', uk: 'eine Tasse Kaffee: міра і їжа', en: 'eine Tasse Kaffee: measure and food', pl: 'eine Tasse Kaffee: miara i jedzenie', es: 'eine Tasse Kaffee: medida y comida', fr: 'eine Tasse Kaffee : mesure et aliment', tr: 'eine Tasse Kaffee: ölçü ve yiyecek', ro: 'eine Tasse Kaffee: măsură și mâncare', uz: "eine Tasse Kaffee: o'lchov va taom", hi: 'eine Tasse Kaffee: माप और खाना', ar: 'eine Tasse Kaffee: المقدار والطعام' },
		points: [
			measurePoint,
			{
				t: {
					ru: ['Akkusativ меняет только меру', 'Если мера мужского рода, она получает einen: der Teller → einen Teller Suppe.'],
					uk: ['Akkusativ змінює лише міру', 'Якщо міра чоловічого роду, вона отримує einen: der Teller → einen Teller Suppe.'],
					en: ['The accusative changes only the measure', 'A masculine measure takes einen: der Teller → einen Teller Suppe.'],
					pl: ['Akkusativ zmienia tylko miarę', 'Jeśli miara jest rodzaju męskiego, dostaje einen: der Teller → einen Teller Suppe.'],
					es: ['El acusativo cambia solo la medida', 'Si la medida es masculina, lleva einen: der Teller → einen Teller Suppe.'],
					fr: ['L’accusatif change seulement la mesure', 'Une mesure masculine prend einen : der Teller → einen Teller Suppe.'],
					tr: ['Akkusativ sadece ölçüyü değiştirir', 'Eril ölçü einen alır: der Teller → einen Teller Suppe.'],
					ro: ['Acuzativul schimbă doar măsura', 'O măsură masculină primește einen: der Teller → einen Teller Suppe.'],
					uz: ["Akkusativ faqat o'lchovni o'zgartiradi", "Erkak rodidagi o'lchov einen oladi: der Teller → einen Teller Suppe."],
					hi: ['Akkusativ सिर्फ़ माप बदलता है', 'पुल्लिंग माप einen लेता है: der Teller → einen Teller Suppe।'],
					ar: ['حالة المفعول تغير المقدار فقط', 'المقدار المذكر يأخذ einen: der Teller → einen Teller Suppe.']
				},
				examples: [
					ex('Ich möchte einen Teller Suppe.', { ru: 'Я хотел бы тарелку супа.', uk: 'Я б хотів тарілку супу.', en: 'I’d like a bowl of soup.', pl: 'Poproszę talerz zupy.', es: 'Quisiera un plato de sopa.', fr: 'Je voudrais une assiette de soupe.', tr: 'Bir tabak çorba istiyorum.', ro: 'Aș dori o farfurie de supă.', uz: "Menga bir likopcha sho'rva, iltimos.", hi: 'मुझे एक प्लेट सूप चाहिए।', ar: 'أودّ صحن حساء.' })
				]
			}
		]
	},

	'hearty-inn-six': {
		title: { ru: 'В ресторане: заказ', uk: 'У ресторані: замовлення', en: 'At the restaurant: ordering', pl: 'W restauracji: zamówienie', es: 'En el restaurante: pedir', fr: 'Au restaurant : commander', tr: 'Restoranda: sipariş', ro: 'La restaurant: comanda', uz: 'Restoranda: buyurtma', hi: 'रेस्टोरेंट में: ऑर्डर', ar: 'في المطعم: الطلب' },
		points: [
			{
				t: {
					ru: ['Вежливо на Sie', 'С официантом говорим на Sie. Заказываем: Ich nehme... или Ich möchte...'],
					uk: ['Ввічливо на Sie', 'З офіціантом говоримо на Sie. Замовляємо: Ich nehme... або Ich möchte...'],
					en: ['Politely with Sie', 'Talk to the waiter with Sie. To order: Ich nehme... or Ich möchte...'],
					pl: ['Grzecznie na Sie', 'Z kelnerem mówimy na Sie. Zamawiamy: Ich nehme... albo Ich möchte...'],
					es: ['De usted, con Sie', 'Al camarero se le habla de Sie. Para pedir: Ich nehme... o Ich möchte...'],
					fr: ['Poliment avec Sie', 'On vouvoie le serveur avec Sie. Pour commander : Ich nehme... ou Ich möchte...'],
					tr: ['Kibarca Sie ile', 'Garsonla Sie ile konuşulur. Sipariş: Ich nehme... ya da Ich möchte...'],
					ro: ['Politicos cu Sie', 'Cu ospătarul vorbim cu Sie. Comandăm: Ich nehme... sau Ich möchte...'],
					uz: ['Hurmat bilan Sie', "Ofitsiant bilan Sie bilan gaplashamiz. Buyurtma: Ich nehme... yoki Ich möchte..."],
					hi: ['विनम्रता से Sie', 'वेटर से Sie में बात करते हैं। ऑर्डर: Ich nehme... या Ich möchte...'],
					ar: ['بأدب مع Sie', 'نخاطب النادل بـ Sie. وللطلب: Ich nehme... أو Ich möchte...']
				},
				examples: [
					ex('Haben Sie einen Tisch frei?', { ru: 'У вас есть свободный столик?', uk: 'У вас є вільний столик?', en: 'Do you have a free table?', pl: 'Czy jest wolny stolik?', es: '¿Tienen una mesa libre?', fr: 'Vous avez une table libre ?', tr: 'Boş masanız var mı?', ro: 'Aveți o masă liberă?', uz: "Bo'sh stolingiz bormi?", hi: 'क्या आपके पास कोई खाली मेज़ है?', ar: 'هل عندكم طاولة فارغة؟' }),
					ex('Ich nehme den Fisch.', { ru: 'Я беру рыбу.', uk: 'Я беру рибу.', en: 'I’ll have the fish.', pl: 'Wezmę rybę.', es: 'Tomo el pescado.', fr: 'Je prends le poisson.', tr: 'Balığı alıyorum.', ro: 'Iau peștele.', uz: 'Men baliqni olaman.', hi: 'मैं मछली लूँगा।', ar: 'آخذ السمك.' })
				]
			}
		]
	},

	'hearty-inn-seven': {
		title: { ru: 'Счёт, пожалуйста!', uk: 'Рахунок, будь ласка!', en: 'The bill, please!', pl: 'Rachunek, proszę!', es: '¡La cuenta, por favor!', fr: 'L’addition, s’il vous plaît !', tr: 'Hesap, lütfen!', ro: 'Nota, vă rog!', uz: 'Hisob, iltimos!', hi: 'बिल, कृपया!', ar: 'الحساب من فضلك!' },
		points: [
			{
				t: {
					ru: ['Фразы при оплате', 'Zusammen oder getrennt? значит «вместе или раздельно?». Stimmt so значит «сдачи не надо».'],
					uk: ['Фрази під час оплати', 'Zusammen oder getrennt? означає «разом чи окремо?». Stimmt so означає «решти не треба».'],
					en: ['Paying phrases', 'Zusammen oder getrennt? means "together or separately?". Stimmt so means "keep the change".'],
					pl: ['Zwroty przy płaceniu', 'Zusammen oder getrennt? znaczy „razem czy osobno?”. Stimmt so znaczy „reszty nie trzeba”.'],
					es: ['Frases para pagar', 'Zusammen oder getrennt? significa "¿juntos o por separado?". Stimmt so significa "quédese con el cambio".'],
					fr: ['Phrases pour payer', 'Zusammen oder getrennt ? veut dire « ensemble ou séparément ? ». Stimmt so veut dire « gardez la monnaie ».'],
					tr: ['Ödeme ifadeleri', 'Zusammen oder getrennt? "Birlikte mi, ayrı mı?" demektir. Stimmt so "üstü kalsın" demektir.'],
					ro: ['Fraze la plată', 'Zusammen oder getrennt? înseamnă „împreună sau separat?”. Stimmt so înseamnă „păstrați restul”.'],
					uz: ["To'lov iboralari", "Zusammen oder getrennt? \"birgami yoki alohida?\" degani. Stimmt so \"qaytim kerak emas\" degani."],
					hi: ['भुगतान के वाक्य', 'Zusammen oder getrennt? मतलब "साथ में या अलग-अलग?"। Stimmt so मतलब "बाकी रख लीजिए"।'],
					ar: ['عبارات الدفع', 'Zusammen oder getrennt? تعني "معاً أم كل واحد وحده؟". وStimmt so تعني "احتفظ بالباقي".']
				},
				examples: [
					ex('Entschuldigung, die Rechnung, bitte!', { ru: 'Извините, счёт, пожалуйста!', uk: 'Перепрошую, рахунок, будь ласка!', en: 'Excuse me, the bill, please!', pl: 'Przepraszam, rachunek proszę!', es: '¡Perdone, la cuenta, por favor!', fr: 'Excusez-moi, l’addition, s’il vous plaît !', tr: 'Affedersiniz, hesap lütfen!', ro: 'Scuzați-mă, nota, vă rog!', uz: 'Kechirasiz, hisobni bering!', hi: 'माफ़ कीजिए, बिल, कृपया!', ar: 'عذراً، الحساب من فضلك!' }),
					ex('Ich zahle bar.', { ru: 'Я плачу наличными.', uk: 'Я плачу готівкою.', en: 'I’ll pay cash.', pl: 'Płacę gotówką.', es: 'Pago en efectivo.', fr: 'Je paie en liquide.', tr: 'Nakit ödüyorum.', ro: 'Plătesc cash.', uz: "Naqd to'layman.", hi: 'मैं नकद दूँगा।', ar: 'أدفع نقداً.' })
				]
			}
		]
	},

	'hearty-inn-eight': {
		title: { ru: 'Практика: ужин с друзьями', uk: 'Практика: вечеря з друзями', en: 'Practice: dinner with friends', pl: 'Praktyka: kolacja z przyjaciółmi', es: 'Práctica: cena con amigos', fr: 'Pratique : dîner entre amis', tr: 'Pratik: arkadaşlarla akşam yemeği', ro: 'Practică: cină cu prietenii', uz: "Mashq: do'stlar bilan kechki ovqat", hi: 'अभ्यास: दोस्तों के साथ रात का खाना', ar: 'تدريب: عشاء مع الأصدقاء' },
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'noch значит «ещё»: noch ein Stück, noch eine Tasse.'],
					uk: ['Нових правил немає', 'noch означає «ще»: noch ein Stück, noch eine Tasse.'],
					en: ['No new rules', 'noch means "another, more": noch ein Stück, noch eine Tasse.'],
					pl: ['Bez nowych reguł', 'noch znaczy „jeszcze”: noch ein Stück, noch eine Tasse.'],
					es: ['Sin reglas nuevas', 'noch significa "otro, más": noch ein Stück, noch eine Tasse.'],
					fr: ['Pas de nouvelle règle', 'noch veut dire « encore » : noch ein Stück, noch eine Tasse.'],
					tr: ['Yeni kural yok', 'noch "bir ... daha" demektir: noch ein Stück, noch eine Tasse.'],
					ro: ['Fără reguli noi', 'noch înseamnă „încă”: noch ein Stück, noch eine Tasse.'],
					uz: ["Yangi qoida yo'q", "noch \"yana\" degani: noch ein Stück, noch eine Tasse."],
					hi: ['कोई नया नियम नहीं', 'noch का मतलब "और एक": noch ein Stück, noch eine Tasse।'],
					ar: ['لا قواعد جديدة', 'noch تعني "مزيداً، واحداً آخر": noch ein Stück، noch eine Tasse.']
				},
				examples: [
					ex('Möchtest du noch ein Stück Kuchen?', { ru: 'Хочешь ещё кусок пирога?', uk: 'Хочеш ще шматок пирога?', en: 'Would you like another piece of cake?', pl: 'Chcesz jeszcze kawałek ciasta?', es: '¿Quieres otro trozo de pastel?', fr: 'Tu veux encore un morceau de gâteau ?', tr: 'Bir dilim kek daha ister misin?', ro: 'Mai vrei o bucată de prăjitură?', uz: "Yana bir bo'lak pirog xohlaysanmi?", hi: 'क्या तुम केक का एक और टुकड़ा लोगे?', ar: 'هل تريد قطعة كعك أخرى؟' })
				]
			}
		]
	},

	'hearty-inn-nine': {
		title: { ru: 'Повторение: еда и напитки', uk: 'Повторення: їжа і напої', en: 'Review: food and drinks', pl: 'Powtórka: jedzenie i napoje', es: 'Repaso: comida y bebida', fr: 'Révision : nourriture et boissons', tr: 'Tekrar: yiyecek ve içecek', ro: 'Recapitulare: mâncare și băuturi', uz: 'Takrorlash: taom va ichimliklar', hi: 'दोहराव: खाना और पेय', ar: 'مراجعة: الطعام والمشروبات' },
		points: [magPoint, gernPoint, measurePoint]
	},

	'hearty-inn-ten': {
		title: finalTitle,
		points: [
			{
				t: {
					ru: ['mögen или gern', 'mögen с вещью: Ich mag Kaffee. gern с действием: Ich trinke gern Kaffee.'],
					uk: ['mögen чи gern', 'mögen з річчю: Ich mag Kaffee. gern із дією: Ich trinke gern Kaffee.'],
					en: ['mögen or gern', 'mögen with a thing: Ich mag Kaffee. gern with an action: Ich trinke gern Kaffee.'],
					pl: ['mögen czy gern', 'mögen z rzeczą: Ich mag Kaffee. gern z czynnością: Ich trinke gern Kaffee.'],
					es: ['mögen o gern', 'mögen con una cosa: Ich mag Kaffee. gern con una acción: Ich trinke gern Kaffee.'],
					fr: ['mögen ou gern', 'mögen avec une chose : Ich mag Kaffee. gern avec une action : Ich trinke gern Kaffee.'],
					tr: ['mögen mi, gern mi', 'mögen bir şeyle: Ich mag Kaffee. gern bir eylemle: Ich trinke gern Kaffee.'],
					ro: ['mögen sau gern', 'mögen cu un lucru: Ich mag Kaffee. gern cu o acțiune: Ich trinke gern Kaffee.'],
					uz: ['mögen yoki gern', "mögen narsa bilan: Ich mag Kaffee. gern harakat bilan: Ich trinke gern Kaffee."],
					hi: ['mögen या gern', 'mögen चीज़ के साथ: Ich mag Kaffee। gern काम के साथ: Ich trinke gern Kaffee।'],
					ar: ['mögen أم gern', 'mögen مع الشيء: Ich mag Kaffee. وgern مع الفعل: Ich trinke gern Kaffee.']
				},
				examples: [
					ex('Magst du Kaffee mit Milch?', { ru: 'Ты любишь кофе с молоком?', uk: 'Ти любиш каву з молоком?', en: 'Do you like coffee with milk?', pl: 'Lubisz kawę z mlekiem?', es: '¿Te gusta el café con leche?', fr: 'Tu aimes le café au lait ?', tr: 'Sütlü kahve sever misin?', ro: 'Îți place cafeaua cu lapte?', uz: "Sutli qahvani yaxshi ko'rasanmi?", hi: 'क्या तुम्हें दूध वाली कॉफ़ी पसंद है?', ar: 'هل تحب القهوة بالحليب؟' })
				]
			},
			{
				t: {
					ru: ['schmecken', 'Одна вещь schmeckt, много вещей schmecken.'],
					uk: ['schmecken', 'Одна річ schmeckt, багато речей schmecken.'],
					en: ['schmecken', 'One thing schmeckt, several things schmecken.'],
					pl: ['schmecken', 'Jedna rzecz schmeckt, wiele rzeczy schmecken.'],
					es: ['schmecken', 'Una cosa schmeckt, varias cosas schmecken.'],
					fr: ['schmecken', 'Une chose schmeckt, plusieurs choses schmecken.'],
					tr: ['schmecken', 'Tek şey schmeckt, birden çok şey schmecken.'],
					ro: ['schmecken', 'Un lucru schmeckt, mai multe schmecken.'],
					uz: ['schmecken', "Bitta narsa schmeckt, ko'p narsa schmecken."],
					hi: ['schmecken', 'एक चीज़ schmeckt, कई चीज़ें schmecken।'],
					ar: ['schmecken', 'شيء واحد schmeckt، وعدة أشياء schmecken.']
				},
				examples: [
					ex('Der Saft schmeckt süß.', { ru: 'Сок сладкий на вкус.', uk: 'Сік солодкий на смак.', en: 'The juice tastes sweet.', pl: 'Sok jest słodki.', es: 'El zumo sabe dulce.', fr: 'Le jus a un goût sucré.', tr: 'Meyve suyunun tadı tatlı.', ro: 'Sucul are gust dulce.', uz: 'Sharbat shirin.', hi: 'जूस मीठा है।', ar: 'طعم العصير حلو.' })
				]
			},
			measurePoint
		]
	}
}

module.exports = quests
