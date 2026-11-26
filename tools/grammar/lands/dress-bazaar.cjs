// Грамматика к заданиям земли dress-bazaar (Базар нарядов: одежда)
const ex = (de, tr) => ({ de, tr })

const tragenPoint = {
	t: {
		ru: ['tragen: a → ä', 'tragen (носить) меняет гласную у du и er: du trägst, er trägt. После него Akkusativ.'],
		uk: ['tragen: a → ä', 'tragen (носити) змінює голосну у du та er: du trägst, er trägt. Після нього Akkusativ.'],
		en: ['tragen: a → ä', 'tragen (to wear) changes its vowel with du and er: du trägst, er trägt. It takes the accusative.'],
		pl: ['tragen: a → ä', 'tragen (nosić) zmienia samogłoskę przy du i er: du trägst, er trägt. Po nim Akkusativ.'],
		es: ['tragen: a → ä', 'tragen (llevar puesto) cambia la vocal con du y er: du trägst, er trägt. Va con acusativo.'],
		fr: ['tragen : a → ä', 'tragen (porter) change de voyelle avec du et er : du trägst, er trägt. Suivi de l’accusatif.'],
		tr: ['tragen: a → ä', 'tragen (giymek, taşımak) du ve er ile ünlü değiştirir: du trägst, er trägt. Ardından Akkusativ gelir.'],
		ro: ['tragen: a → ä', 'tragen (a purta) își schimbă vocala la du și er: du trägst, er trägt. E urmat de acuzativ.'],
		uz: ['tragen: a → ä', "tragen (kiymoq) du va er da unlini o'zgartiradi: du trägst, er trägt. Undan keyin Akkusativ."],
		hi: ['tragen: a → ä', 'tragen (पहनना) du और er के साथ स्वर बदलता है: du trägst, er trägt। इसके बाद Akkusativ।'],
		ar: ['tragen: a → ä', 'يتغير حرف tragen (يرتدي) مع du وer: du trägst، er trägt. ويأتي بعده المفعول.']
	},
	examples: [
		ex('Er trägt ein Hemd.', { ru: 'Он носит рубашку.', uk: 'Він носить сорочку.', en: 'He’s wearing a shirt.', pl: 'On nosi koszulę.', es: 'Él lleva una camisa.', fr: 'Il porte une chemise.', tr: 'O bir gömlek giyiyor.', ro: 'El poartă o cămașă.', uz: "U ko'ylak kiygan.", hi: 'उसने कमीज़ पहनी है।', ar: 'هو يرتدي قميصاً.' }),
		ex('Ich trage einen Rock.', { ru: 'Я ношу юбку.', uk: 'Я ношу спідницю.', en: 'I’m wearing a skirt.', pl: 'Noszę spódnicę.', es: 'Llevo una falda.', fr: 'Je porte une jupe.', tr: 'Etek giyiyorum.', ro: 'Port o fustă.', uz: 'Men yubka kiyganman.', hi: 'मैंने स्कर्ट पहनी है।', ar: 'أرتدي تنورة.' })
	]
}

const gefallenPoint = {
	t: {
		ru: ['gefällt mir: учим целиком', 'Вещь здесь главная, поэтому глагол смотрит на неё: одна вещь gefällt, много вещей gefallen.'],
		uk: ['gefällt mir: вчимо цілком', 'Річ тут головна, тому дієслово дивиться на неї: одна річ gefällt, багато речей gefallen.'],
		en: ['gefällt mir: learn it as a whole', 'Here the thing is the subject, so the verb agrees with it: one thing gefällt, several things gefallen.'],
		pl: ['gefällt mir: uczymy się w całości', 'Tu rzecz jest podmiotem, więc czasownik zgadza się z nią: jedna rzecz gefällt, wiele rzeczy gefallen.'],
		es: ['gefällt mir: se aprende entero', 'Aquí la cosa es el sujeto, como en "me gusta": una cosa gefällt, varias cosas gefallen.'],
		fr: ['gefällt mir : à apprendre en bloc', 'Ici l’objet est le sujet, donc le verbe s’accorde avec lui : une chose gefällt, plusieurs choses gefallen.'],
		tr: ['gefällt mir: kalıp olarak', 'Burada eşya öznedir, fiil ona uyar: tek şey gefällt, birden çok şey gefallen.'],
		ro: ['gefällt mir: se învață întreg', 'Aici lucrul e subiectul, ca în „îmi place”: un lucru gefällt, mai multe gefallen.'],
		uz: ["gefällt mir: butunligicha o'rganamiz", "Bu yerda narsa ega, fe'l unga moslashadi: bitta narsa gefällt, ko'p narsa gefallen."],
		hi: ['gefällt mir: पूरा वाक्यांश', 'यहाँ चीज़ ही कर्ता है, इसलिए क्रिया उसी से मेल खाती है: एक चीज़ gefällt, कई चीज़ें gefallen।'],
		ar: ['gefällt mir: نحفظها كاملة', 'هنا الشيء هو الفاعل، فيتوافق الفعل معه: شيء واحد gefällt، وعدة أشياء gefallen.']
	},
	examples: [
		ex('Das Kleid gefällt mir.', { ru: 'Мне нравится платье.', uk: 'Мені подобається сукня.', en: 'I like the dress.', pl: 'Podoba mi się sukienka.', es: 'Me gusta el vestido.', fr: 'La robe me plaît.', tr: 'Elbiseyi beğendim.', ro: 'Îmi place rochia.', uz: "Ko'ylak menga yoqadi.", hi: 'मुझे यह ड्रेस पसंद है।', ar: 'يعجبني الفستان.' }),
		ex('Die Schuhe gefallen mir.', { ru: 'Мне нравятся туфли.', uk: 'Мені подобаються туфлі.', en: 'I like the shoes.', pl: 'Podobają mi się buty.', es: 'Me gustan los zapatos.', fr: 'Les chaussures me plaisent.', tr: 'Ayakkabıları beğendim.', ro: 'Îmi plac pantofii.', uz: 'Tuflilar menga yoqadi.', hi: 'मुझे ये जूते पसंद हैं।', ar: 'يعجبني الحذاء.' })
	]
}

const pronounPoint = {
	t: {
		ru: ['ihn, sie, es', 'Чтобы не повторять вещь после глагола: der Rock → ihn, die Hose → sie, das Hemd → es, во множественном sie.'],
		uk: ['ihn, sie, es', 'Щоб не повторювати річ після дієслова: der Rock → ihn, die Hose → sie, das Hemd → es, у множині sie.'],
		en: ['ihn, sie, es', 'To avoid repeating the thing after the verb: der Rock → ihn, die Hose → sie, das Hemd → es, plural sie.'],
		pl: ['ihn, sie, es', 'Żeby nie powtarzać rzeczy po czasowniku: der Rock → ihn, die Hose → sie, das Hemd → es, w liczbie mnogiej sie.'],
		es: ['ihn, sie, es', 'Para no repetir la cosa tras el verbo: der Rock → ihn, die Hose → sie, das Hemd → es, en plural sie.'],
		fr: ['ihn, sie, es', 'Pour ne pas répéter l’objet après le verbe : der Rock → ihn, die Hose → sie, das Hemd → es, au pluriel sie.'],
		tr: ['ihn, sie, es', 'Fiilden sonra eşyayı tekrarlamamak için: der Rock → ihn, die Hose → sie, das Hemd → es, çoğulda sie.'],
		ro: ['ihn, sie, es', 'Ca să nu repeți lucrul după verb: der Rock → ihn, die Hose → sie, das Hemd → es, la plural sie.'],
		uz: ['ihn, sie, es', "Fe'ldan keyin narsani takrorlamaslik uchun: der Rock → ihn, die Hose → sie, das Hemd → es, ko'plikda sie."],
		hi: ['ihn, sie, es', 'क्रिया के बाद चीज़ दोहराने के बजाय: der Rock → ihn, die Hose → sie, das Hemd → es, बहुवचन में sie।'],
		ar: ['ihn وsie وes', 'لكي لا نكرر الشيء بعد الفعل: der Rock → ihn، die Hose → sie، das Hemd → es، وفي الجمع sie.']
	},
	examples: [
		ex('Der Pullover ist schön. Ich nehme ihn.', { ru: 'Свитер красивый. Я беру его.', uk: 'Светр гарний. Я беру його.', en: 'The jumper is nice. I’ll take it.', pl: 'Sweter jest ładny. Biorę go.', es: 'El jersey es bonito. Me lo llevo.', fr: 'Le pull est beau. Je le prends.', tr: 'Kazak güzel. Onu alıyorum.', ro: 'Puloverul e frumos. Îl iau.', uz: 'Sviter chiroyli. Uni olaman.', hi: 'स्वेटर सुंदर है। मैं इसे लेता हूँ।', ar: 'الكنزة جميلة. سآخذها.' }),
		ex('Die Jacke ist teuer. Ich kaufe sie nicht.', { ru: 'Куртка дорогая. Я её не покупаю.', uk: 'Куртка дорога. Я її не купую.', en: 'The jacket is expensive. I won’t buy it.', pl: 'Kurtka jest droga. Nie kupuję jej.', es: 'La chaqueta es cara. No la compro.', fr: 'La veste est chère. Je ne l’achète pas.', tr: 'Ceket pahalı. Onu almıyorum.', ro: 'Geaca e scumpă. Nu o cumpăr.', uz: 'Kurtka qimmat. Uni sotib olmayman.', hi: 'जैकेट महँगी है। मैं इसे नहीं खरीदूँगा।', ar: 'السترة غالية. لن أشتريها.' })
	]
}

const quests = {
	'dress-bazaar-one': {
		title: { ru: 'tragen: что на мне', uk: 'tragen: що на мені', en: 'tragen: what I’m wearing', pl: 'tragen: co mam na sobie', es: 'tragen: qué llevo puesto', fr: 'tragen : ce que je porte', tr: 'tragen: üzerimde ne var', ro: 'tragen: ce port', uz: 'tragen: ustimda nima bor', hi: 'tragen: मैंने क्या पहना है', ar: 'tragen: ماذا أرتدي' },
		points: [tragenPoint]
	},

	'dress-bazaar-two': {
		title: { ru: 'Какого цвета?', uk: 'Якого кольору?', en: 'What colour?', pl: 'Jakiego koloru?', es: '¿De qué color?', fr: 'De quelle couleur ?', tr: 'Ne renk?', ro: 'Ce culoare?', uz: 'Qanday rangda?', hi: 'किस रंग का?', ar: 'ما اللون؟' },
		points: [
			{
				t: {
					ru: ['После ist без окончания', 'Цвет после ist не меняется, во множественном глагол sind.'],
					uk: ['Після ist без закінчення', 'Колір після ist не змінюється, у множині дієслово sind.'],
					en: ['No ending after ist', 'The colour after ist doesn’t change. In the plural the verb is sind.'],
					pl: ['Po ist bez końcówki', 'Kolor po ist się nie zmienia, w liczbie mnogiej czasownik sind.'],
					es: ['Sin terminación tras ist', 'El color después de ist no cambia. En plural el verbo es sind.'],
					fr: ['Pas de terminaison après ist', 'La couleur après ist ne change pas. Au pluriel, le verbe est sind.'],
					tr: ['ist’ten sonra eksiz', 'ist’ten sonra renk değişmez. Çoğulda fiil sind olur.'],
					ro: ['După ist fără terminație', 'Culoarea după ist nu se schimbă. La plural verbul e sind.'],
					uz: ["ist dan keyin qo'shimchasiz", "ist dan keyin rang o'zgarmaydi. Ko'plikda fe'l sind."],
					hi: ['ist के बाद कोई अंत नहीं', 'ist के बाद रंग नहीं बदलता। बहुवचन में क्रिया sind।'],
					ar: ['بدون نهاية بعد ist', 'لا يتغير اللون بعد ist. وفي الجمع يكون الفعل sind.']
				},
				examples: [
					ex('Welche Farbe hat der Rock? Er ist rot.', { ru: 'Какого цвета юбка? Красная.', uk: 'Якого кольору спідниця? Червона.', en: 'What colour is the skirt? It’s red.', pl: 'Jakiego koloru jest spódnica? Czerwona.', es: '¿De qué color es la falda? Es roja.', fr: 'De quelle couleur est la jupe ? Elle est rouge.', tr: 'Etek ne renk? Kırmızı.', ro: 'Ce culoare are fusta? E roșie.', uz: 'Yubka qanday rangda? Qizil.', hi: 'स्कर्ट किस रंग की है? लाल।', ar: 'ما لون التنورة؟ إنها حمراء.' }),
					ex('Die Schuhe sind schwarz.', { ru: 'Туфли чёрные.', uk: 'Туфлі чорні.', en: 'The shoes are black.', pl: 'Buty są czarne.', es: 'Los zapatos son negros.', fr: 'Les chaussures sont noires.', tr: 'Ayakkabılar siyah.', ro: 'Pantofii sunt negri.', uz: 'Tuflilar qora.', hi: 'जूते काले हैं।', ar: 'الحذاء أسود.' })
				]
			}
		]
	},

	'dress-bazaar-three': {
		title: { ru: 'Мне нравится: gefällt mir', uk: 'Мені подобається: gefällt mir', en: 'I like it: gefällt mir', pl: 'Podoba mi się: gefällt mir', es: 'Me gusta: gefällt mir', fr: 'Ça me plaît : gefällt mir', tr: 'Beğeniyorum: gefällt mir', ro: 'Îmi place: gefällt mir', uz: 'Menga yoqadi: gefällt mir', hi: 'मुझे पसंद है: gefällt mir', ar: 'يعجبني: gefällt mir' },
		points: [
			gefallenPoint,
			{
				t: {
					ru: ['Отрицание и вопрос', 'nicht ставим в конец. Спросить мнение: Wie gefällt dir...?'],
					uk: ['Заперечення і питання', 'nicht ставимо в кінець. Запитати думку: Wie gefällt dir...?'],
					en: ['Negation and questions', 'Put nicht at the end. To ask an opinion: Wie gefällt dir...?'],
					pl: ['Przeczenie i pytanie', 'nicht stawiamy na końcu. Zapytać o zdanie: Wie gefällt dir...?'],
					es: ['Negación y pregunta', 'nicht va al final. Para pedir opinión: Wie gefällt dir...?'],
					fr: ['Négation et question', 'nicht se met à la fin. Pour demander un avis : Wie gefällt dir... ?'],
					tr: ['Olumsuz ve soru', 'nicht sona konur. Fikir sormak: Wie gefällt dir...?'],
					ro: ['Negația și întrebarea', 'nicht se pune la final. Ca să ceri o părere: Wie gefällt dir...?'],
					uz: ['Inkor va savol', "nicht oxiriga qo'yiladi. Fikr so'rash: Wie gefällt dir...?"],
					hi: ['नकार और सवाल', 'nicht अंत में आता है। राय पूछना: Wie gefällt dir...?'],
					ar: ['النفي والسؤال', 'نضع nicht في الآخر. ولنسأل عن الرأي: Wie gefällt dir...؟']
				},
				examples: [
					ex('Der Hut gefällt mir nicht.', { ru: 'Эта шляпа мне не нравится.', uk: 'Цей капелюх мені не подобається.', en: 'I don’t like the hat.', pl: 'Kapelusz mi się nie podoba.', es: 'El sombrero no me gusta.', fr: 'Le chapeau ne me plaît pas.', tr: 'Şapkayı beğenmedim.', ro: 'Pălăria nu-mi place.', uz: 'Shlyapa menga yoqmaydi.', hi: 'मुझे यह टोपी पसंद नहीं।', ar: 'لا تعجبني القبعة.' }),
					ex('Wie gefällt dir der Rock?', { ru: 'Как тебе юбка?', uk: 'Як тобі спідниця?', en: 'How do you like the skirt?', pl: 'Jak ci się podoba spódnica?', es: '¿Qué te parece la falda?', fr: 'Comment tu trouves la jupe ?', tr: 'Eteği nasıl buldun?', ro: 'Cum ți se pare fusta?', uz: 'Yubka senga qanday?', hi: 'तुम्हें स्कर्ट कैसी लगी?', ar: 'كيف تجد التنورة؟' })
				]
			}
		]
	},

	'dress-bazaar-four': {
		title: { ru: 'Размер и примерка', uk: 'Розмір і приміряння', en: 'Size and trying on', pl: 'Rozmiar i przymierzanie', es: 'Talla y probador', fr: 'Taille et essayage', tr: 'Beden ve deneme', ro: 'Mărimea și probarea', uz: "O'lcham va kiyib ko'rish", hi: 'साइज़ और पहनकर देखना', ar: 'المقاس والقياس' },
		points: [
			{
				t: {
					ru: ['anprobieren отделяемый', 'Ich probiere den Rock an. С модальным глаголом целиком в конце: Kann ich den Rock anprobieren?'],
					uk: ['anprobieren відокремлюване', 'Ich probiere den Rock an. З модальним дієсловом цілим у кінці: Kann ich den Rock anprobieren?'],
					en: ['anprobieren is separable', 'Ich probiere den Rock an. With a modal verb it stays whole at the end: Kann ich den Rock anprobieren?'],
					pl: ['anprobieren jest rozdzielny', 'Ich probiere den Rock an. Z czasownikiem modalnym w całości na końcu: Kann ich den Rock anprobieren?'],
					es: ['anprobieren es separable', 'Ich probiere den Rock an. Con un modal va entero al final: Kann ich den Rock anprobieren?'],
					fr: ['anprobieren est séparable', 'Ich probiere den Rock an. Avec un verbe de modalité, il reste entier à la fin : Kann ich den Rock anprobieren ?'],
					tr: ['anprobieren ayrılabilen', 'Ich probiere den Rock an. Modal fiille sonda bütün kalır: Kann ich den Rock anprobieren?'],
					ro: ['anprobieren e separabil', 'Ich probiere den Rock an. Cu un verb modal stă întreg la final: Kann ich den Rock anprobieren?'],
					uz: ['anprobieren ajraladigan', "Ich probiere den Rock an. Modal fe'l bilan oxirida butun turadi: Kann ich den Rock anprobieren?"],
					hi: ['anprobieren अलग होने वाला', 'Ich probiere den Rock an। मोडल क्रिया के साथ अंत में पूरा: Kann ich den Rock anprobieren?'],
					ar: ['anprobieren فعل منفصل', 'Ich probiere den Rock an. ومع الفعل المساعد يبقى كاملاً في الآخر: Kann ich den Rock anprobieren؟']
				},
				examples: [
					ex('Welche Größe haben Sie? Größe 38.', { ru: 'Какой у вас размер? 38-й.', uk: 'Який у вас розмір? 38-й.', en: 'What size are you? Size 38.', pl: 'Jaki ma pani rozmiar? 38.', es: '¿Qué talla tiene? La 38.', fr: 'Quelle taille faites-vous ? Du 38.', tr: 'Bedeniniz kaç? 38.', ro: 'Ce mărime aveți? 38.', uz: "O'lchamingiz qanday? 38.", hi: 'आपका साइज़ क्या है? 38।', ar: 'ما مقاسك؟ 38.' }),
					ex('Kann ich den Rock anprobieren?', { ru: 'Можно примерить юбку?', uk: 'Можна приміряти спідницю?', en: 'Can I try on the skirt?', pl: 'Mogę przymierzyć spódnicę?', es: '¿Puedo probarme la falda?', fr: 'Je peux essayer la jupe ?', tr: 'Eteği deneyebilir miyim?', ro: 'Pot să probez fusta?', uz: "Yubkani kiyib ko'rsam bo'ladimi?", hi: 'क्या मैं स्कर्ट पहनकर देख सकती हूँ?', ar: 'هل يمكنني قياس التنورة؟' })
				]
			}
		]
	},

	'dress-bazaar-five': {
		title: { ru: 'passen: подходит по размеру', uk: 'passen: підходить за розміром', en: 'passen: it fits', pl: 'passen: pasuje', es: 'passen: queda bien', fr: 'passen : ça va', tr: 'passen: oluyor', ro: 'passen: se potrivește', uz: "passen: to'g'ri keladi", hi: 'passen: फ़िट होता है', ar: 'passen: المقاس مناسب' },
		points: [
			{
				t: {
					ru: ['Глагол смотрит на вещь', 'Одна вещь passt, много вещей passen.'],
					uk: ['Дієслово дивиться на річ', 'Одна річ passt, багато речей passen.'],
					en: ['The verb agrees with the thing', 'One thing passt, several things passen.'],
					pl: ['Czasownik zgadza się z rzeczą', 'Jedna rzecz passt, wiele rzeczy passen.'],
					es: ['El verbo concuerda con la cosa', 'Una cosa passt, varias cosas passen.'],
					fr: ['Le verbe s’accorde avec l’objet', 'Une chose passt, plusieurs choses passen.'],
					tr: ['Fiil eşyaya uyar', 'Tek şey passt, birden çok şey passen.'],
					ro: ['Verbul se acordă cu lucrul', 'Un lucru passt, mai multe passen.'],
					uz: ["Fe'l narsaga moslashadi", "Bitta narsa passt, ko'p narsa passen."],
					hi: ['क्रिया चीज़ के अनुसार', 'एक चीज़ passt, कई चीज़ें passen।'],
					ar: ['الفعل يتبع الشيء', 'شيء واحد passt، وعدة أشياء passen.']
				},
				examples: [
					ex('Die Hose passt gut.', { ru: 'Брюки хорошо сидят.', uk: 'Штани добре сидять.', en: 'The trousers fit well.', pl: 'Spodnie dobrze leżą.', es: 'Los pantalones quedan bien.', fr: 'Le pantalon va bien.', tr: 'Pantolon iyi oldu.', ro: 'Pantalonii se potrivesc bine.', uz: "Shim yaxshi to'g'ri keladi.", hi: 'पैंट अच्छी फ़िट है।', ar: 'البنطال مناسب تماماً.' }),
					ex('Die Schuhe passen nicht.', { ru: 'Туфли не подходят.', uk: 'Туфлі не підходять.', en: 'The shoes don’t fit.', pl: 'Buty nie pasują.', es: 'Los zapatos no me quedan.', fr: 'Les chaussures ne vont pas.', tr: 'Ayakkabılar olmuyor.', ro: 'Pantofii nu se potrivesc.', uz: "Tuflilar to'g'ri kelmaydi.", hi: 'जूते फ़िट नहीं हैं।', ar: 'الحذاء غير مناسب.' })
				]
			},
			{
				t: {
					ru: ['zu: слишком', 'Почему не подходит: zu groß, zu kurz, zu eng.'],
					uk: ['zu: занадто', 'Чому не підходить: zu groß, zu kurz, zu eng.'],
					en: ['zu: too', 'Why it doesn’t fit: zu groß, zu kurz, zu eng.'],
					pl: ['zu: za', 'Dlaczego nie pasuje: zu groß, zu kurz, zu eng.'],
					es: ['zu: demasiado', 'Por qué no queda: zu groß, zu kurz, zu eng.'],
					fr: ['zu : trop', 'Pourquoi ça ne va pas : zu groß, zu kurz, zu eng.'],
					tr: ['zu: fazla', 'Neden olmuyor: zu groß, zu kurz, zu eng.'],
					ro: ['zu: prea', 'De ce nu se potrivește: zu groß, zu kurz, zu eng.'],
					uz: ['zu: haddan tashqari', "Nega to'g'ri kelmaydi: zu groß, zu kurz, zu eng."],
					hi: ['zu: ज़्यादा', 'क्यों फ़िट नहीं: zu groß, zu kurz, zu eng।'],
					ar: ['zu: أكثر من اللازم', 'لماذا لا يناسب: zu groß، zu kurz، zu eng.']
				},
				examples: [
					ex('Der Rock ist zu kurz.', { ru: 'Юбка слишком короткая.', uk: 'Спідниця занадто коротка.', en: 'The skirt is too short.', pl: 'Spódnica jest za krótka.', es: 'La falda es demasiado corta.', fr: 'La jupe est trop courte.', tr: 'Etek çok kısa.', ro: 'Fusta e prea scurtă.', uz: 'Yubka juda kalta.', hi: 'स्कर्ट बहुत छोटी है।', ar: 'التنورة قصيرة جداً.' })
				]
			}
		]
	},

	'dress-bazaar-six': {
		title: { ru: 'Я беру его: ihn, sie, es', uk: 'Я беру його: ihn, sie, es', en: 'I’ll take it: ihn, sie, es', pl: 'Biorę go: ihn, sie, es', es: 'Me lo llevo: ihn, sie, es', fr: 'Je le prends : ihn, sie, es', tr: 'Onu alıyorum: ihn, sie, es', ro: 'Îl iau: ihn, sie, es', uz: 'Uni olaman: ihn, sie, es', hi: 'मैं इसे लेता हूँ: ihn, sie, es', ar: 'سآخذه: ihn وsie وes' },
		points: [pronounPoint]
	},

	'dress-bazaar-seven': {
		title: { ru: 'anziehen и ausziehen', uk: 'anziehen і ausziehen', en: 'anziehen and ausziehen', pl: 'anziehen i ausziehen', es: 'anziehen y ausziehen', fr: 'anziehen et ausziehen', tr: 'anziehen ve ausziehen', ro: 'anziehen și ausziehen', uz: 'anziehen va ausziehen', hi: 'anziehen और ausziehen', ar: 'anziehen وausziehen' },
		points: [
			{
				t: {
					ru: ['Надеть и снять', 'anziehen (надевать) и ausziehen (снимать) отделяемые: приставка в конце.'],
					uk: ['Вдягнути і зняти', 'anziehen (вдягати) і ausziehen (знімати) відокремлювані: префікс у кінці.'],
					en: ['Put on and take off', 'anziehen (put on) and ausziehen (take off) are separable: the prefix goes to the end.'],
					pl: ['Założyć i zdjąć', 'anziehen (zakładać) i ausziehen (zdejmować) są rozdzielne: przedrostek na końcu.'],
					es: ['Ponerse y quitarse', 'anziehen (ponerse) y ausziehen (quitarse) son separables: el prefijo va al final.'],
					fr: ['Mettre et enlever', 'anziehen (mettre) et ausziehen (enlever) sont séparables : le préfixe va à la fin.'],
					tr: ['Giymek ve çıkarmak', 'anziehen (giymek) ve ausziehen (çıkarmak) ayrılabilen fiillerdir: ön ek sonda.'],
					ro: ['A se îmbrăca și a se dezbrăca', 'anziehen (a îmbrăca) și ausziehen (a scoate) sunt separabile: prefixul la final.'],
					uz: ['Kiymoq va yechmoq', "anziehen (kiymoq) va ausziehen (yechmoq) ajraladigan: old qo'shimcha oxirida."],
					hi: ['पहनना और उतारना', 'anziehen (पहनना) और ausziehen (उतारना) अलग होने वाली क्रियाएँ हैं: उपसर्ग अंत में।'],
					ar: ['يلبس ويخلع', 'anziehen (يلبس) وausziehen (يخلع) فعلان منفصلان: السابقة في الآخر.']
				},
				examples: [
					ex('Ich ziehe die Jacke an.', { ru: 'Я надеваю куртку.', uk: 'Я вдягаю куртку.', en: 'I’m putting on my jacket.', pl: 'Zakładam kurtkę.', es: 'Me pongo la chaqueta.', fr: 'Je mets ma veste.', tr: 'Ceketi giyiyorum.', ro: 'Îmi pun geaca.', uz: 'Men kurtkani kiyyapman.', hi: 'मैं जैकेट पहन रहा हूँ।', ar: 'ألبس السترة.' }),
					ex('Er zieht die Schuhe aus.', { ru: 'Он снимает обувь.', uk: 'Він знімає взуття.', en: 'He takes off his shoes.', pl: 'On zdejmuje buty.', es: 'Él se quita los zapatos.', fr: 'Il enlève ses chaussures.', tr: 'O ayakkabılarını çıkarıyor.', ro: 'El își scoate pantofii.', uz: 'U tuflisini yechyapti.', hi: 'वह जूते उतार रहा है।', ar: 'هو يخلع حذاءه.' })
				]
			},
			{
				t: {
					ru: ['tragen или anziehen', 'tragen значит «быть одетым во что-то», anziehen значит «надеть сейчас».'],
					uk: ['tragen чи anziehen', 'tragen означає «бути вдягненим у щось», anziehen означає «вдягнути зараз».'],
					en: ['tragen or anziehen', 'tragen means "to be wearing", anziehen means "to put on now".'],
					pl: ['tragen czy anziehen', 'tragen znaczy „mieć na sobie”, anziehen „założyć teraz”.'],
					es: ['tragen o anziehen', 'tragen significa "llevar puesto", anziehen "ponerse ahora".'],
					fr: ['tragen ou anziehen', 'tragen veut dire « porter », anziehen « mettre maintenant ».'],
					tr: ['tragen mi, anziehen mi', 'tragen "üzerinde olmak", anziehen "şimdi giymek" demektir.'],
					ro: ['tragen sau anziehen', 'tragen înseamnă „a purta”, anziehen „a îmbrăca acum”.'],
					uz: ['tragen yoki anziehen', "tragen \"kiyib yurmoq\", anziehen \"hozir kiymoq\" degani."],
					hi: ['tragen या anziehen', 'tragen मतलब "पहने हुए होना", anziehen मतलब "अभी पहनना"।'],
					ar: ['tragen أم anziehen', 'tragen تعني "يرتدي (حالة)"، وanziehen تعني "يلبس الآن".']
				},
				examples: [
					ex('Es ist kalt. Ich ziehe einen Pullover an.', { ru: 'Холодно. Я надеваю свитер.', uk: 'Холодно. Я вдягаю светр.', en: 'It’s cold. I’m putting on a jumper.', pl: 'Jest zimno. Zakładam sweter.', es: 'Hace frío. Me pongo un jersey.', fr: 'Il fait froid. Je mets un pull.', tr: 'Hava soğuk. Kazak giyiyorum.', ro: 'E frig. Îmi pun un pulover.', uz: 'Sovuq. Sviter kiyaman.', hi: 'ठंड है। मैं स्वेटर पहनता हूँ।', ar: 'الجو بارد. سألبس كنزة.' })
				]
			}
		]
	},

	'dress-bazaar-eight': {
		title: { ru: 'Практика: идём за одеждой', uk: 'Практика: ідемо по одяг', en: 'Practice: clothes shopping', pl: 'Praktyka: idziemy po ubrania', es: 'Práctica: de compras', fr: 'Pratique : acheter des vêtements', tr: 'Pratik: kıyafet alışverişi', ro: 'Practică: la cumpărături de haine', uz: 'Mashq: kiyim xaridi', hi: 'अभ्यास: कपड़ों की खरीदारी', ar: 'تدريب: شراء الملابس' },
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Повторяем: ihn вместо der-слова, passen, zu teuer.'],
					uk: ['Нових правил немає', 'Повторюємо: ihn замість der-слова, passen, zu teuer.'],
					en: ['No new rules', 'Review: ihn instead of a der word, passen, zu teuer.'],
					pl: ['Bez nowych reguł', 'Powtarzamy: ihn zamiast słowa z der, passen, zu teuer.'],
					es: ['Sin reglas nuevas', 'Repaso: ihn en lugar de una palabra con der, passen, zu teuer.'],
					fr: ['Pas de nouvelle règle', 'Révision : ihn au lieu d’un mot en der, passen, zu teuer.'],
					tr: ['Yeni kural yok', 'Tekrar: der’li kelime yerine ihn, passen, zu teuer.'],
					ro: ['Fără reguli noi', 'Recapitulăm: ihn în loc de cuvânt cu der, passen, zu teuer.'],
					uz: ["Yangi qoida yo'q", "Takrorlaymiz: der li so'z o'rniga ihn, passen, zu teuer."],
					hi: ['कोई नया नियम नहीं', 'दोहराव: der वाले शब्द की जगह ihn, passen, zu teuer।'],
					ar: ['لا قواعد جديدة', 'مراجعة: ihn بدل الكلمة مع der، وpassen، وzu teuer.']
				},
				examples: [
					ex('Kann ich ihn anprobieren?', { ru: 'Можно его примерить?', uk: 'Можна його приміряти?', en: 'Can I try it on?', pl: 'Mogę go przymierzyć?', es: '¿Puedo probármelo?', fr: 'Je peux l’essayer ?', tr: 'Onu deneyebilir miyim?', ro: 'Pot să-l probez?', uz: "Uni kiyib ko'rsam bo'ladimi?", hi: 'क्या मैं इसे पहनकर देख सकता हूँ?', ar: 'هل يمكنني قياسه؟' }),
					ex('Sie passt gut, aber sie ist zu teuer.', { ru: 'Она хорошо сидит, но слишком дорогая.', uk: 'Вона добре сидить, але занадто дорога.', en: 'It fits well, but it’s too expensive.', pl: 'Dobrze leży, ale jest za droga.', es: 'Me queda bien, pero es demasiado cara.', fr: 'Elle va bien, mais elle est trop chère.', tr: 'İyi oldu ama çok pahalı.', ro: 'Se potrivește bine, dar e prea scumpă.', uz: "U yaxshi to'g'ri keladi, lekin juda qimmat.", hi: 'यह अच्छी फ़िट है, लेकिन बहुत महँगी है।', ar: 'إنها مناسبة لكنها غالية جداً.' })
				]
			}
		]
	},

	'dress-bazaar-nine': {
		title: { ru: 'Повторение: моя одежда', uk: 'Повторення: мій одяг', en: 'Review: my clothes', pl: 'Powtórka: moje ubrania', es: 'Repaso: mi ropa', fr: 'Révision : mes vêtements', tr: 'Tekrar: kıyafetlerim', ro: 'Recapitulare: hainele mele', uz: 'Takrorlash: kiyimlarim', hi: 'दोहराव: मेरे कपड़े', ar: 'مراجعة: ملابسي' },
		points: [tragenPoint, gefallenPoint, pronounPoint]
	},

	'dress-bazaar-ten': {
		title: { ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review', pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser', tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak', hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع' },
		points: [
			{
				t: {
					ru: ['ihr tragt', 'У ihr гласная не меняется: ihr tragt.'],
					uk: ['ihr tragt', 'У ihr голосна не змінюється: ihr tragt.'],
					en: ['ihr tragt', 'With ihr the vowel doesn’t change: ihr tragt.'],
					pl: ['ihr tragt', 'Przy ihr samogłoska się nie zmienia: ihr tragt.'],
					es: ['ihr tragt', 'Con ihr la vocal no cambia: ihr tragt.'],
					fr: ['ihr tragt', 'Avec ihr, la voyelle ne change pas : ihr tragt.'],
					tr: ['ihr tragt', 'ihr ile ünlü değişmez: ihr tragt.'],
					ro: ['ihr tragt', 'La ihr vocala nu se schimbă: ihr tragt.'],
					uz: ['ihr tragt', "ihr da unli o'zgarmaydi: ihr tragt."],
					hi: ['ihr tragt', 'ihr के साथ स्वर नहीं बदलता: ihr tragt।'],
					ar: ['ihr tragt', 'مع ihr لا يتغير الحرف: ihr tragt.']
				},
				examples: [
					ex('Tragt ihr Jeans?', { ru: 'Вы носите джинсы?', uk: 'Ви носите джинси?', en: 'Do you (all) wear jeans?', pl: 'Nosicie dżinsy?', es: '¿Lleváis vaqueros?', fr: 'Vous portez des jeans ?', tr: 'Kot pantolon giyiyor musunuz?', ro: 'Purtați blugi?', uz: 'Sizlar jinsi kiyasizlarmi?', hi: 'क्या तुम सब जींस पहनते हो?', ar: 'هل ترتدون الجينز؟' })
				]
			},
			gefallenPoint,
			pronounPoint
		]
	}
}

module.exports = quests
