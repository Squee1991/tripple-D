// Грамматика к заданиям земли family-tree (Семейное древо: притяжательные слова)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'family-tree-one': {
		title: {
			ru: 'mein и dein: мой и твой', uk: 'mein і dein: мій і твій', en: 'mein and dein: my and your',
			pl: 'mein i dein: mój i twój', es: 'mein y dein: mi y tu', fr: 'mein et dein : mon et ton',
			tr: 'mein ve dein: benim ve senin', ro: 'mein și dein: al meu și al tău', uz: 'mein va dein: mening va sening',
			hi: 'mein और dein: मेरा और तुम्हारा', ar: 'mein وdein: لي ولك'
		},
		points: [
			{
				t: {
					ru: ['Окончание как у ein', 'mein и dein меняются как ein: для der и das без окончания, для die и множественного с -e.'],
					uk: ['Закінчення як у ein', 'mein і dein змінюються як ein: для der і das без закінчення, для die і множини з -e.'],
					en: ['Endings like ein', 'mein and dein change like ein: no ending for der and das, -e for die and plural.'],
					pl: ['Końcówki jak przy ein', 'mein i dein odmieniają się jak ein: dla der i das bez końcówki, dla die i liczby mnogiej z -e.'],
					es: ['Terminaciones como ein', 'mein y dein cambian como ein: sin terminación para der y das, con -e para die y el plural.'],
					fr: ['Terminaisons comme ein', 'mein et dein changent comme ein : pas de terminaison pour der et das, -e pour die et le pluriel.'],
					tr: ['ein gibi ekler', 'mein ve dein, ein gibi değişir: der ve das için eksiz, die ve çoğul için -e.'],
					ro: ['Terminații ca la ein', 'mein și dein se schimbă ca ein: fără terminație pentru der și das, cu -e pentru die și plural.'],
					uz: ["ein kabi qo'shimchalar", "mein va dein ein kabi o'zgaradi: der va das uchun qo'shimchasiz, die va ko'plik uchun -e."],
					hi: ['ein जैसे अंत', 'mein और dein, ein की तरह बदलते हैं: der और das के लिए कोई अंत नहीं, die और बहुवचन के लिए -e।'],
					ar: ['نهايات مثل ein', 'تتغير mein وdein مثل ein: بدون نهاية مع der وdas، ومع -e مع die والجمع.']
				},
				examples: [
					ex('mein Vater, meine Mutter, meine Eltern', { ru: 'мой папа, моя мама, мои родители', uk: 'мій тато, моя мама, мої батьки', en: 'my father, my mother, my parents', pl: 'mój tata, moja mama, moi rodzice', es: 'mi padre, mi madre, mis padres', fr: 'mon père, ma mère, mes parents', tr: 'babam, annem, ailem', ro: 'tatăl meu, mama mea, părinții mei', uz: 'otam, onam, ota-onam', hi: 'मेरे पिता, मेरी माँ, मेरे माता-पिता', ar: 'أبي، أمي، والداي' }),
					ex('Ist das dein Schlüssel?', { ru: 'Это твой ключ?', uk: 'Це твій ключ?', en: 'Is this your key?', pl: 'Czy to twój klucz?', es: '¿Es tu llave?', fr: 'C’est ta clé ?', tr: 'Bu senin anahtarın mı?', ro: 'E cheia ta?', uz: 'Bu sening kalitingmi?', hi: 'क्या यह तुम्हारी चाबी है?', ar: 'هل هذا مفتاحك؟' })
				]
			}
		]
	},

	'family-tree-two': {
		title: {
			ru: 'sein и ihr: его и её', uk: 'sein і ihr: його і її', en: 'sein and ihr: his and her',
			pl: 'sein i ihr: jego i jej', es: 'sein e ihr: su (de él) y su (de ella)', fr: 'sein et ihr : son (à lui) et son (à elle)',
			tr: 'sein ve ihr: onun (erkek) ve onun (kadın)', ro: 'sein și ihr: al lui și al ei', uz: 'sein va ihr: uning (erkak) va uning (ayol)',
			hi: 'sein और ihr: उसका और उसकी', ar: 'sein وihr: له ولها'
		},
		points: [
			{
				t: {
					ru: ['Слово по хозяину', 'Если хозяин он, говорим sein. Если хозяйка она, говорим ihr.'],
					uk: ['Слово за власником', 'Якщо власник він, кажемо sein. Якщо власниця вона, кажемо ihr.'],
					en: ['The word depends on the owner', 'If the owner is he, say sein. If the owner is she, say ihr.'],
					pl: ['Słowo według właściciela', 'Jeśli właścicielem jest on, mówimy sein. Jeśli ona, mówimy ihr.'],
					es: ['La palabra según el dueño', 'Si el dueño es él, se dice sein. Si es ella, se dice ihr.'],
					fr: ['Le mot dépend du propriétaire', 'Si le propriétaire est un homme, on dit sein. Si c’est une femme, on dit ihr.'],
					tr: ['Kelime sahibine göre', 'Sahibi erkekse sein, kadınsa ihr denir.'],
					ro: ['Cuvântul după proprietar', 'Dacă proprietarul e el, spui sein. Dacă e ea, spui ihr.'],
					uz: ["So'z egasiga qarab", "Egasi erkak bo'lsa sein, ayol bo'lsa ihr deyiladi."],
					hi: ['शब्द मालिक के अनुसार', 'मालिक पुरुष हो तो sein, महिला हो तो ihr।'],
					ar: ['الكلمة حسب المالك', 'إذا كان المالك رجلاً نقول sein، وإذا كانت امرأة نقول ihr.']
				},
				examples: [
					ex('Tom und sein Hund', { ru: 'Том и его собака', uk: 'Том і його собака', en: 'Tom and his dog', pl: 'Tom i jego pies', es: 'Tom y su perro', fr: 'Tom et son chien', tr: 'Tom ve köpeği', ro: 'Tom și câinele lui', uz: 'Tom va uning iti', hi: 'टॉम और उसका कुत्ता', ar: 'توم وكلبه' }),
					ex('Anna und ihre Katze', { ru: 'Анна и её кошка', uk: 'Анна і її кішка', en: 'Anna and her cat', pl: 'Anna i jej kot', es: 'Anna y su gata', fr: 'Anna et son chat', tr: 'Anna ve kedisi', ro: 'Anna și pisica ei', uz: 'Anna va uning mushugi', hi: 'अन्ना और उसकी बिल्ली', ar: 'آنا وقطتها' })
				]
			},
			{
				t: {
					ru: ['Окончание по вещи', 'Окончание зависит от вещи, а не от хозяина: sein Vater, seine Mutter.'],
					uk: ['Закінчення за річчю', 'Закінчення залежить від речі, а не від власника: sein Vater, seine Mutter.'],
					en: ['The ending depends on the thing', 'The ending depends on the thing, not the owner: sein Vater, seine Mutter.'],
					pl: ['Końcówka według rzeczy', 'Końcówka zależy od rzeczy, a nie od właściciela: sein Vater, seine Mutter.'],
					es: ['La terminación según la cosa', 'La terminación depende de la cosa, no del dueño: sein Vater, seine Mutter.'],
					fr: ['La terminaison dépend de l’objet', 'La terminaison dépend de l’objet, pas du propriétaire : sein Vater, seine Mutter.'],
					tr: ['Ek eşyaya göre', 'Ek sahibine değil eşyaya göre değişir: sein Vater, seine Mutter.'],
					ro: ['Terminația după obiect', 'Terminația depinde de obiect, nu de proprietar: sein Vater, seine Mutter.'],
					uz: ["Qo'shimcha narsaga qarab", "Qo'shimcha egasiga emas, narsaga bog'liq: sein Vater, seine Mutter."],
					hi: ['अंत चीज़ के अनुसार', 'अंत मालिक से नहीं, चीज़ से तय होता है: sein Vater, seine Mutter।'],
					ar: ['النهاية حسب الشيء', 'النهاية تعتمد على الشيء لا على المالك: sein Vater، seine Mutter.']
				},
				examples: [
					ex('Ihre Tochter wohnt in Wien.', { ru: 'Её дочь живёт в Вене.', uk: 'Її донька живе у Відні.', en: 'Her daughter lives in Vienna.', pl: 'Jej córka mieszka w Wiedniu.', es: 'Su hija vive en Viena.', fr: 'Sa fille habite à Vienne.', tr: 'Kızı Viyana’da oturuyor.', ro: 'Fiica ei locuiește la Viena.', uz: 'Uning qizi Venada yashaydi.', hi: 'उसकी बेटी वियना में रहती है।', ar: 'ابنتها تسكن في فيينا.' })
				]
			}
		]
	},

	'family-tree-three': {
		title: {
			ru: 'unser, euer, Ihr', uk: 'unser, euer, Ihr', en: 'unser, euer, Ihr',
			pl: 'unser, euer, Ihr', es: 'unser, euer, Ihr', fr: 'unser, euer, Ihr',
			tr: 'unser, euer, Ihr', ro: 'unser, euer, Ihr', uz: 'unser, euer, Ihr',
			hi: 'unser, euer, Ihr', ar: 'unser وeuer وIhr'
		},
		points: [
			{
				t: {
					ru: ['Наш, ваш, их', 'unser (наш), euer (ваш, когда вас много), ihr (их), Ihr с большой буквы (Ваш, вежливо).'],
					uk: ['Наш, ваш, їхній', 'unser (наш), euer (ваш, коли вас багато), ihr (їхній), Ihr з великої літери (Ваш, ввічливо).'],
					en: ['Our, your, their', 'unser (our), euer (your, several people), ihr (their), capital Ihr (your, polite).'],
					pl: ['Nasz, wasz, ich', 'unser (nasz), euer (wasz), ihr (ich), Ihr wielką literą (Pana/Pani, grzecznie).'],
					es: ['Nuestro, vuestro, su', 'unser (nuestro), euer (vuestro), ihr (su, de ellos), Ihr con mayúscula (su, de usted).'],
					fr: ['Notre, votre, leur', 'unser (notre), euer (votre, à plusieurs amis), ihr (leur), Ihr avec majuscule (votre, poli).'],
					tr: ['Bizim, sizin, onların', 'unser (bizim), euer (sizin, birkaç kişi), ihr (onların), büyük harfle Ihr (sizin, kibar).'],
					ro: ['Nostru, vostru, lor', 'unser (nostru), euer (vostru), ihr (lor), Ihr cu majusculă (dumneavoastră).'],
					uz: ['Bizning, sizlarning, ularning', "unser (bizning), euer (sizlarning), ihr (ularning), bosh harfli Ihr (Sizning, hurmat bilan)."],
					hi: ['हमारा, तुम सबका, उनका', 'unser (हमारा), euer (तुम सबका), ihr (उनका), बड़े अक्षर वाला Ihr (आपका, विनम्र)।'],
					ar: ['لنا، لكم، لهم', 'unser (لنا)، euer (لكم، لعدة أشخاص)، ihr (لهم)، وIhr بحرف كبير (لحضرتك، بأدب).']
				},
				examples: [
					ex('Unser Haus ist klein.', { ru: 'Наш дом маленький.', uk: 'Наш дім маленький.', en: 'Our house is small.', pl: 'Nasz dom jest mały.', es: 'Nuestra casa es pequeña.', fr: 'Notre maison est petite.', tr: 'Evimiz küçük.', ro: 'Casa noastră este mică.', uz: 'Bizning uyimiz kichkina.', hi: 'हमारा घर छोटा है।', ar: 'بيتنا صغير.' }),
					ex('Ist das Ihr Auto, Herr Klein?', { ru: 'Это Ваша машина, господин Кляйн?', uk: 'Це Ваша машина, пане Кляйн?', en: 'Is this your car, Mr Klein?', pl: 'Czy to pana samochód, panie Klein?', es: '¿Es este su coche, señor Klein?', fr: 'C’est votre voiture, Monsieur Klein ?', tr: 'Bu sizin arabanız mı, Bay Klein?', ro: 'Este mașina dumneavoastră, domnule Klein?', uz: 'Bu sizning mashinangizmi, janob Klein?', hi: 'क्या यह आपकी गाड़ी है, श्रीमान क्लाइन?', ar: 'هل هذه سيارتك يا سيد كلاين؟' })
				]
			},
			{
				t: {
					ru: ['euer теряет e', 'Перед окончанием -e у euer выпадает e: euer Hund, но eure Katze.'],
					uk: ['euer втрачає e', 'Перед закінченням -e у euer випадає e: euer Hund, але eure Katze.'],
					en: ['euer drops an e', 'Before the ending -e, euer drops its e: euer Hund, but eure Katze.'],
					pl: ['euer traci e', 'Przed końcówką -e w euer wypada e: euer Hund, ale eure Katze.'],
					es: ['euer pierde una e', 'Delante de la terminación -e, euer pierde la e: euer Hund, pero eure Katze.'],
					fr: ['euer perd un e', 'Devant la terminaison -e, euer perd son e : euer Hund, mais eure Katze.'],
					tr: ['euer bir e kaybeder', '-e ekinden önce euer’deki e düşer: euer Hund, ama eure Katze.'],
					ro: ['euer pierde un e', 'Înainte de terminația -e, euer pierde e-ul: euer Hund, dar eure Katze.'],
					uz: ['euer e ni yo‘qotadi', "-e qo'shimchasidan oldin euer dagi e tushib qoladi: euer Hund, lekin eure Katze."],
					hi: ['euer का e हट जाता है', '-e अंत से पहले euer का e हट जाता है: euer Hund, लेकिन eure Katze।'],
					ar: ['euer تفقد حرف e', 'قبل النهاية -e يسقط حرف e من euer: euer Hund، لكن eure Katze.']
				},
				examples: [
					ex('Eure Katze ist sehr nett.', { ru: 'Ваша кошка очень милая.', uk: 'Ваша кішка дуже мила.', en: 'Your cat is very nice.', pl: 'Wasz kot jest bardzo miły.', es: 'Vuestra gata es muy simpática.', fr: 'Votre chat est très gentil.', tr: 'Kediniz çok tatlı.', ro: 'Pisica voastră e foarte drăguță.', uz: 'Sizlarning mushugingiz juda yoqimli.', hi: 'तुम सबकी बिल्ली बहुत प्यारी है।', ar: 'قطتكم لطيفة جداً.' })
				]
			}
		]
	},

	'family-tree-four': {
		title: {
			ru: 'meinen, seinen: в Akkusativ', uk: 'meinen, seinen: в Akkusativ', en: 'meinen, seinen: in the accusative',
			pl: 'meinen, seinen: w Akkusativ', es: 'meinen, seinen: en acusativo', fr: 'meinen, seinen : à l’accusatif',
			tr: 'meinen, seinen: Akkusativ’de', ro: 'meinen, seinen: la acuzativ', uz: 'meinen, seinen: Akkusativda',
			hi: 'meinen, seinen: Akkusativ में', ar: 'meinen وseinen: في حالة المفعول'
		},
		points: [
			{
				t: {
					ru: ['Мужской род получает -en', 'После suchen, besuchen, sehen, haben мужской род получает -en, как einen. Остальные не меняются.'],
					uk: ['Чоловічий рід отримує -en', 'Після suchen, besuchen, sehen, haben чоловічий рід отримує -en, як einen. Решта не змінюється.'],
					en: ['Masculine takes -en', 'After suchen, besuchen, sehen, haben a masculine noun takes -en, like einen. The others don’t change.'],
					pl: ['Rodzaj męski dostaje -en', 'Po suchen, besuchen, sehen, haben rodzaj męski dostaje -en, jak einen. Reszta się nie zmienia.'],
					es: ['El masculino lleva -en', 'Después de suchen, besuchen, sehen, haben el masculino lleva -en, como einen. Los demás no cambian.'],
					fr: ['Le masculin prend -en', 'Après suchen, besuchen, sehen, haben, le masculin prend -en, comme einen. Les autres ne changent pas.'],
					tr: ['Eril -en alır', 'suchen, besuchen, sehen, haben’den sonra eril isim einen gibi -en alır. Diğerleri değişmez.'],
					ro: ['Masculinul primește -en', 'După suchen, besuchen, sehen, haben masculinul primește -en, ca einen. Celelalte nu se schimbă.'],
					uz: ['Erkak rodi -en oladi', "suchen, besuchen, sehen, haben dan keyin erkak rodi einen kabi -en oladi. Qolganlari o'zgarmaydi."],
					hi: ['पुल्लिंग -en लेता है', 'suchen, besuchen, sehen, haben के बाद पुल्लिंग einen की तरह -en लेता है। बाकी नहीं बदलते।'],
					ar: ['المذكر يأخذ -en', 'بعد suchen وbesuchen وsehen وhaben يأخذ المذكر -en مثل einen. والبقية لا تتغير.']
				},
				examples: [
					ex('Ich suche meinen Schlüssel.', { ru: 'Я ищу свой ключ.', uk: 'Я шукаю свій ключ.', en: 'I’m looking for my key.', pl: 'Szukam mojego klucza.', es: 'Busco mi llave.', fr: 'Je cherche ma clé.', tr: 'Anahtarımı arıyorum.', ro: 'Îmi caut cheia.', uz: 'Men kalitimni qidiryapman.', hi: 'मैं अपनी चाबी ढूँढ रहा हूँ।', ar: 'أبحث عن مفتاحي.' }),
					ex('Sie besucht ihre Tante.', { ru: 'Она навещает свою тётю.', uk: 'Вона відвідує свою тітку.', en: 'She visits her aunt.', pl: 'Ona odwiedza swoją ciocię.', es: 'Ella visita a su tía.', fr: 'Elle rend visite à sa tante.', tr: 'O teyzesini ziyaret ediyor.', ro: 'Ea își vizitează mătușa.', uz: "U xolasini ko'rgani boradi.", hi: 'वह अपनी चाची से मिलने जाती है।', ar: 'هي تزور خالتها.' })
				]
			}
		]
	},

	'family-tree-five': {
		title: {
			ru: 'Большая семья', uk: 'Велика родина', en: 'The extended family',
			pl: 'Duża rodzina', es: 'La familia grande', fr: 'La grande famille',
			tr: 'Geniş aile', ro: 'Familia mare', uz: 'Katta oila',
			hi: 'बड़ा परिवार', ar: 'العائلة الكبيرة'
		},
		points: [
			{
				t: {
					ru: ['Слова только во множественном', 'die Großeltern (бабушка и дедушка) и die Geschwister (братья и сёстры) обычно во множественном, глагол с ними sind или haben.'],
					uk: ['Слова лише в множині', 'die Großeltern (бабуся й дідусь) і die Geschwister (брати й сестри) зазвичай у множині, дієслово з ними sind або haben.'],
					en: ['Plural-only words', 'die Großeltern (grandparents) and die Geschwister (siblings) are normally plural, so the verb is sind or haben.'],
					pl: ['Słowa tylko w liczbie mnogiej', 'die Großeltern (dziadkowie) i die Geschwister (rodzeństwo) są zwykle w liczbie mnogiej, czasownik z nimi sind albo haben.'],
					es: ['Palabras en plural', 'die Großeltern (abuelos) y die Geschwister (hermanos) suelen ir en plural, con sind o haben.'],
					fr: ['Mots au pluriel', 'die Großeltern (grands-parents) et die Geschwister (frères et sœurs) sont en général au pluriel, avec sind ou haben.'],
					tr: ['Sadece çoğul kelimeler', 'die Großeltern (büyükanne ve büyükbaba) ve die Geschwister (kardeşler) genelde çoğuldur, fiil sind ya da haben olur.'],
					ro: ['Cuvinte doar la plural', 'die Großeltern (bunicii) și die Geschwister (frații) sunt de obicei la plural, cu sind sau haben.'],
					uz: ["Faqat ko'plikdagi so'zlar", "die Großeltern (buvi va bobo) va die Geschwister (aka-uka, opa-singillar) odatda ko'plikda, fe'l sind yoki haben."],
					hi: ['सिर्फ़ बहुवचन वाले शब्द', 'die Großeltern (दादा-दादी) और die Geschwister (भाई-बहन) आमतौर पर बहुवचन में होते हैं, क्रिया sind या haben।'],
					ar: ['كلمات بصيغة الجمع فقط', 'die Großeltern (الأجداد) وdie Geschwister (الإخوة) تأتيان عادة بصيغة الجمع، والفعل معهما sind أو haben.']
				},
				examples: [
					ex('Hast du Geschwister?', { ru: 'У тебя есть братья и сёстры?', uk: 'У тебе є брати й сестри?', en: 'Do you have siblings?', pl: 'Masz rodzeństwo?', es: '¿Tienes hermanos?', fr: 'Tu as des frères et sœurs ?', tr: 'Kardeşin var mı?', ro: 'Ai frați?', uz: "Aka-uka, opa-singillaring bormi?", hi: 'क्या तुम्हारे भाई-बहन हैं?', ar: 'هل عندك إخوة؟' })
				]
			},
			{
				t: {
					ru: ['Семейное положение', 'Ich bin verheiratet (женат, замужем) или ledig (не женат, не замужем). Одно слово для мужчин и женщин.'],
					uk: ['Сімейний стан', 'Ich bin verheiratet (одружений, заміжня) або ledig (неодружений, незаміжня). Одне слово для чоловіків і жінок.'],
					en: ['Marital status', 'Ich bin verheiratet (married) or ledig (single). Same word for men and women.'],
					pl: ['Stan cywilny', 'Ich bin verheiratet (żonaty, zamężna) albo ledig (kawaler, panna). To samo słowo dla mężczyzn i kobiet.'],
					es: ['Estado civil', 'Ich bin verheiratet (casado) o ledig (soltero). La misma palabra para hombres y mujeres.'],
					fr: ['Situation familiale', 'Ich bin verheiratet (marié) ou ledig (célibataire). Le même mot pour les hommes et les femmes.'],
					tr: ['Medeni durum', 'Ich bin verheiratet (evli) ya da ledig (bekâr). Kadın ve erkek için aynı kelime.'],
					ro: ['Starea civilă', 'Ich bin verheiratet (căsătorit) sau ledig (necăsătorit). Același cuvânt pentru bărbați și femei.'],
					uz: ['Oilaviy holat', "Ich bin verheiratet (uylangan, turmushga chiqqan) yoki ledig (bo'ydoq). Erkak va ayol uchun bir xil so'z."],
					hi: ['वैवाहिक स्थिति', 'Ich bin verheiratet (शादीशुदा) या ledig (अविवाहित)। पुरुष और महिला के लिए एक ही शब्द।'],
					ar: ['الحالة الاجتماعية', 'Ich bin verheiratet (متزوج) أو ledig (أعزب). الكلمة نفسها للرجال والنساء.']
				},
				examples: [
					ex('Ich bin verheiratet.', { ru: 'Я женат. / Я замужем.', uk: 'Я одружений. / Я заміжня.', en: 'I’m married.', pl: 'Jestem żonaty. / Jestem mężatką.', es: 'Estoy casado.', fr: 'Je suis marié.', tr: 'Evliyim.', ro: 'Sunt căsătorit.', uz: 'Men uylanganman.', hi: 'मैं शादीशुदा हूँ।', ar: 'أنا متزوج.' })
				]
			}
		]
	},

	'family-tree-six': {
		title: {
			ru: 'Чьё это? Все притяжательные', uk: 'Чиє це? Усі присвійні', en: 'Whose is it? All possessives',
			pl: 'Czyje to? Wszystkie zaimki dzierżawcze', es: '¿De quién es? Todos los posesivos', fr: 'À qui est-ce ? Tous les possessifs',
			tr: 'Kimin? Tüm iyelik sözcükleri', ro: 'Al cui e? Toate posesivele', uz: "Bu kimniki? Barcha egalik so'zlari",
			hi: 'यह किसका है? सभी संबंधवाचक', ar: 'لمن هذا؟ كل ضمائر الملكية'
		},
		points: [
			{
				t: {
					ru: ['Два шага', 'Сначала выбираем слово по хозяину, потом окончание по вещи.'],
					uk: ['Два кроки', 'Спочатку обираємо слово за власником, потім закінчення за річчю.'],
					en: ['Two steps', 'First choose the word by the owner, then the ending by the thing.'],
					pl: ['Dwa kroki', 'Najpierw wybieramy słowo według właściciela, potem końcówkę według rzeczy.'],
					es: ['Dos pasos', 'Primero la palabra según el dueño, luego la terminación según la cosa.'],
					fr: ['Deux étapes', 'D’abord le mot selon le propriétaire, puis la terminaison selon l’objet.'],
					tr: ['İki adım', 'Önce sahibine göre kelime, sonra eşyaya göre ek seçilir.'],
					ro: ['Doi pași', 'Întâi alegi cuvântul după proprietar, apoi terminația după obiect.'],
					uz: ['Ikki qadam', "Avval egasiga qarab so'z, keyin narsaga qarab qo'shimcha tanlanadi."],
					hi: ['दो कदम', 'पहले मालिक के अनुसार शब्द चुनो, फिर चीज़ के अनुसार अंत।'],
					ar: ['خطوتان', 'أولاً نختار الكلمة حسب المالك، ثم النهاية حسب الشيء.']
				},
				examples: [
					ex('ich → mein, du → dein, er → sein, sie → ihr', { ru: 'я, ты, он, она', uk: 'я, ти, він, вона', en: 'I, you, he, she', pl: 'ja, ty, on, ona', es: 'yo, tú, él, ella', fr: 'je, tu, il, elle', tr: 'ben, sen, o (erkek), o (kadın)', ro: 'eu, tu, el, ea', uz: 'men, sen, u (erkak), u (ayol)', hi: 'मैं, तुम, वह (पु), वह (स्त्री)', ar: 'أنا، أنت، هو، هي' }),
					ex('wir → unser, ihr → euer, sie → ihr, Sie → Ihr', { ru: 'мы, вы, они, Вы', uk: 'ми, ви, вони, Ви', en: 'we, you (all), they, you (polite)', pl: 'my, wy, oni, Pan/Pani', es: 'nosotros, vosotros, ellos, usted', fr: 'nous, vous (amis), ils, vous (poli)', tr: 'biz, siz, onlar, siz (kibar)', ro: 'noi, voi, ei, dumneavoastră', uz: 'biz, sizlar, ular, Siz', hi: 'हम, तुम सब, वे, आप', ar: 'نحن، أنتم، هم، حضرتك' }),
					ex('Ist das deine Jacke? Nein, ihre.', { ru: 'Это твоя куртка? Нет, её.', uk: 'Це твоя куртка? Ні, її.', en: 'Is this your jacket? No, hers.', pl: 'To twoja kurtka? Nie, jej.', es: '¿Es tu chaqueta? No, la suya.', fr: 'C’est ta veste ? Non, la sienne.', tr: 'Bu senin ceketin mi? Hayır, onun.', ro: 'E geaca ta? Nu, a ei.', uz: 'Bu sening kurtkangmi? Yo‘q, uniki.', hi: 'क्या यह तुम्हारी जैकेट है? नहीं, उसकी।', ar: 'هل هذه سترتك؟ لا، سترتها.' })
				]
			}
		]
	},

	'family-tree-seven': {
		title: {
			ru: 'Практика: семейное фото', uk: 'Практика: сімейне фото', en: 'Practice: a family photo',
			pl: 'Praktyka: zdjęcie rodzinne', es: 'Práctica: una foto familiar', fr: 'Pratique : une photo de famille',
			tr: 'Pratik: aile fotoğrafı', ro: 'Practică: o fotografie de familie', uz: 'Mashq: oilaviy surat',
			hi: 'अभ्यास: पारिवारिक फ़ोटो', ar: 'تدريب: صورة عائلية'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Где на фото: links (слева), rechts (справа), in der Mitte (в центре). Если место стоит первым, глагол идёт сразу за ним.'],
					uk: ['Нових правил немає', 'Де на фото: links (ліворуч), rechts (праворуч), in der Mitte (у центрі). Якщо місце стоїть першим, дієслово йде одразу за ним.'],
					en: ['No new rules', 'Where in the photo: links (left), rechts (right), in der Mitte (in the middle). If the place comes first, the verb follows right after.'],
					pl: ['Bez nowych reguł', 'Gdzie na zdjęciu: links (po lewej), rechts (po prawej), in der Mitte (w środku). Jeśli miejsce jest pierwsze, czasownik idzie zaraz po nim.'],
					es: ['Sin reglas nuevas', 'Dónde en la foto: links (a la izquierda), rechts (a la derecha), in der Mitte (en el centro). Si el lugar va primero, el verbo va justo después.'],
					fr: ['Pas de nouvelle règle', 'Où sur la photo : links (à gauche), rechts (à droite), in der Mitte (au milieu). Si le lieu est en premier, le verbe suit tout de suite.'],
					tr: ['Yeni kural yok', 'Fotoğrafta nerede: links (solda), rechts (sağda), in der Mitte (ortada). Yer başta olursa fiil hemen ardından gelir.'],
					ro: ['Fără reguli noi', 'Unde în poză: links (în stânga), rechts (în dreapta), in der Mitte (la mijloc). Dacă locul e primul, verbul vine imediat după.'],
					uz: ["Yangi qoida yo'q", "Suratda qayerda: links (chapda), rechts (o'ngda), in der Mitte (o'rtada). Joy birinchi tursa, fe'l darhol undan keyin keladi."],
					hi: ['कोई नया नियम नहीं', 'फ़ोटो में कहाँ: links (बाएँ), rechts (दाएँ), in der Mitte (बीच में)। अगर जगह पहले आए तो क्रिया तुरंत उसके बाद।'],
					ar: ['لا قواعد جديدة', 'أين في الصورة: links (يساراً)، rechts (يميناً)، in der Mitte (في الوسط). وإذا جاء المكان أولاً يأتي الفعل بعده مباشرة.']
				},
				examples: [
					ex('Links ist mein Onkel. Seine Frau heißt Eva.', { ru: 'Слева мой дядя. Его жену зовут Ева.', uk: 'Ліворуч мій дядько. Його дружину звати Єва.', en: 'On the left is my uncle. His wife is called Eva.', pl: 'Po lewej mój wujek. Jego żona ma na imię Eva.', es: 'A la izquierda está mi tío. Su mujer se llama Eva.', fr: 'À gauche, c’est mon oncle. Sa femme s’appelle Eva.', tr: 'Solda amcam var. Karısının adı Eva.', ro: 'În stânga e unchiul meu. Soția lui se numește Eva.', uz: 'Chapda amakim. Uning xotinining ismi Eva.', hi: 'बाईं ओर मेरे चाचा हैं। उनकी पत्नी का नाम एवा है।', ar: 'على اليسار عمي. اسم زوجته إيفا.' })
				]
			}
		]
	},

	'family-tree-eight': {
		title: {
			ru: 'Практика: гости у нас дома', uk: 'Практика: гості в нас удома', en: 'Practice: guests at home',
			pl: 'Praktyka: goście w domu', es: 'Práctica: invitados en casa', fr: 'Pratique : des invités à la maison',
			tr: 'Pratik: evde misafirler', ro: 'Practică: oaspeți acasă', uz: 'Mashq: uyda mehmonlar',
			hi: 'अभ्यास: घर पर मेहमान', ar: 'تدريب: ضيوف في البيت'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Со взрослыми гостями говорим вежливо: Ihr, Ihre с большой буквы.'],
					uk: ['Нових правил немає', 'З дорослими гостями говоримо ввічливо: Ihr, Ihre з великої літери.'],
					en: ['No new rules', 'With adult guests be polite: Ihr, Ihre with a capital letter.'],
					pl: ['Bez nowych reguł', 'Z dorosłymi gośćmi mówimy grzecznie: Ihr, Ihre wielką literą.'],
					es: ['Sin reglas nuevas', 'Con invitados adultos hablamos con cortesía: Ihr, Ihre con mayúscula.'],
					fr: ['Pas de nouvelle règle', 'Avec des invités adultes, on est poli : Ihr, Ihre avec une majuscule.'],
					tr: ['Yeni kural yok', 'Yetişkin misafirlerle kibar konuşulur: büyük harfle Ihr, Ihre.'],
					ro: ['Fără reguli noi', 'Cu oaspeții adulți vorbim politicos: Ihr, Ihre cu majusculă.'],
					uz: ["Yangi qoida yo'q", "Katta mehmonlar bilan hurmat bilan gaplashamiz: bosh harfli Ihr, Ihre."],
					hi: ['कोई नया नियम नहीं', 'बड़े मेहमानों से विनम्रता से: बड़े अक्षर वाला Ihr, Ihre।'],
					ar: ['لا قواعد جديدة', 'مع الضيوف البالغين نتكلم بأدب: Ihr وIhre بحرف كبير.']
				},
				examples: [
					ex('Ist das Ihre Jacke, Frau Lang?', { ru: 'Это Ваша куртка, госпожа Ланг?', uk: 'Це Ваша куртка, пані Ланг?', en: 'Is this your jacket, Ms Lang?', pl: 'Czy to pani kurtka, pani Lang?', es: '¿Es esta su chaqueta, señora Lang?', fr: 'C’est votre veste, Madame Lang ?', tr: 'Bu sizin ceketiniz mi, Bayan Lang?', ro: 'E geaca dumneavoastră, doamnă Lang?', uz: 'Bu sizning kurtkangizmi, Lang xonim?', hi: 'क्या यह आपकी जैकेट है, श्रीमती लांग?', ar: 'هل هذه سترتك يا سيدة لانغ؟' }),
					ex('Unsere Kinder heißen Ben und Mia.', { ru: 'Наших детей зовут Бен и Мия.', uk: 'Наших дітей звати Бен і Мія.', en: 'Our children are called Ben and Mia.', pl: 'Nasze dzieci mają na imię Ben i Mia.', es: 'Nuestros hijos se llaman Ben y Mia.', fr: 'Nos enfants s’appellent Ben et Mia.', tr: 'Çocuklarımızın adı Ben ve Mia.', ro: 'Copiii noștri se numesc Ben și Mia.', uz: 'Bolalarimizning ismi Ben va Miya.', hi: 'हमारे बच्चों के नाम बेन और मिया हैं।', ar: 'اسما طفلينا بن وميا.' })
				]
			}
		]
	},

	'family-tree-nine': {
		title: {
			ru: 'Повторение: притяжательные', uk: 'Повторення: присвійні', en: 'Review: possessives',
			pl: 'Powtórka: zaimki dzierżawcze', es: 'Repaso: posesivos', fr: 'Révision : les possessifs',
			tr: 'Tekrar: iyelik sözcükleri', ro: 'Recapitulare: posesivele', uz: "Takrorlash: egalik so'zlari",
			hi: 'दोहराव: संबंधवाचक', ar: 'مراجعة: ضمائر الملكية'
		},
		points: [
			{
				t: {
					ru: ['Слово по хозяину', 'его: sein, её: ihr, наш: unser.'],
					uk: ['Слово за власником', 'його: sein, її: ihr, наш: unser.'],
					en: ['Word by the owner', 'his: sein, her: ihr, our: unser.'],
					pl: ['Słowo według właściciela', 'jego: sein, jej: ihr, nasz: unser.'],
					es: ['Palabra según el dueño', 'de él: sein, de ella: ihr, nuestro: unser.'],
					fr: ['Le mot selon le propriétaire', 'à lui : sein, à elle : ihr, notre : unser.'],
					tr: ['Sahibine göre kelime', 'onun (erkek): sein, onun (kadın): ihr, bizim: unser.'],
					ro: ['Cuvântul după proprietar', 'al lui: sein, al ei: ihr, al nostru: unser.'],
					uz: ["Egasiga qarab so'z", "uning (erkak): sein, uning (ayol): ihr, bizning: unser."],
					hi: ['मालिक के अनुसार शब्द', 'उसका (पु): sein, उसकी (स्त्री): ihr, हमारा: unser।'],
					ar: ['الكلمة حسب المالك', 'له: sein، لها: ihr، لنا: unser.']
				},
				examples: [
					ex('Ihr Mann ist Koch.', { ru: 'Её муж повар.', uk: 'Її чоловік кухар.', en: 'Her husband is a cook.', pl: 'Jej mąż jest kucharzem.', es: 'Su marido es cocinero.', fr: 'Son mari est cuisinier.', tr: 'Kocası aşçı.', ro: 'Soțul ei este bucătar.', uz: 'Uning eri oshpaz.', hi: 'उसका पति रसोइया है।', ar: 'زوجها طباخ.' })
				]
			},
			{
				t: {
					ru: ['Окончание по вещи', 'Для der и das без окончания, для die и множественного -e.'],
					uk: ['Закінчення за річчю', 'Для der і das без закінчення, для die і множини -e.'],
					en: ['Ending by the thing', 'No ending for der and das, -e for die and plural.'],
					pl: ['Końcówka według rzeczy', 'Dla der i das bez końcówki, dla die i liczby mnogiej -e.'],
					es: ['Terminación según la cosa', 'Sin terminación para der y das, -e para die y plural.'],
					fr: ['Terminaison selon l’objet', 'Pas de terminaison pour der et das, -e pour die et le pluriel.'],
					tr: ['Eşyaya göre ek', 'der ve das için eksiz, die ve çoğul için -e.'],
					ro: ['Terminația după obiect', 'Pentru der și das fără terminație, pentru die și plural -e.'],
					uz: ["Narsaga qarab qo'shimcha", "der va das uchun qo'shimchasiz, die va ko'plik uchun -e."],
					hi: ['चीज़ के अनुसार अंत', 'der और das के लिए कोई अंत नहीं, die और बहुवचन के लिए -e।'],
					ar: ['النهاية حسب الشيء', 'بدون نهاية مع der وdas، و-e مع die والجمع.']
				},
				examples: [
					ex('Seine Frau ist Lehrerin.', { ru: 'Его жена учительница.', uk: 'Його дружина вчителька.', en: 'His wife is a teacher.', pl: 'Jego żona jest nauczycielką.', es: 'Su mujer es profesora.', fr: 'Sa femme est professeure.', tr: 'Karısı öğretmen.', ro: 'Soția lui este profesoară.', uz: "Uning xotini o'qituvchi.", hi: 'उसकी पत्नी शिक्षिका है।', ar: 'زوجته معلمة.' })
				]
			},
			{
				t: {
					ru: ['В Akkusativ мужской род -en', 'После besuchen, suchen и других: meinen, seinen, unseren.'],
					uk: ['В Akkusativ чоловічий рід -en', 'Після besuchen, suchen та інших: meinen, seinen, unseren.'],
					en: ['Accusative masculine -en', 'After besuchen, suchen and others: meinen, seinen, unseren.'],
					pl: ['W Akkusativ rodzaj męski -en', 'Po besuchen, suchen i innych: meinen, seinen, unseren.'],
					es: ['Masculino en acusativo -en', 'Después de besuchen, suchen y otros: meinen, seinen, unseren.'],
					fr: ['Masculin à l’accusatif -en', 'Après besuchen, suchen et d’autres : meinen, seinen, unseren.'],
					tr: ['Akkusativ’de eril -en', 'besuchen, suchen ve diğerlerinden sonra: meinen, seinen, unseren.'],
					ro: ['Masculin la acuzativ -en', 'După besuchen, suchen și altele: meinen, seinen, unseren.'],
					uz: ['Akkusativda erkak rodi -en', "besuchen, suchen va boshqalardan keyin: meinen, seinen, unseren."],
					hi: ['Akkusativ में पुल्लिंग -en', 'besuchen, suchen आदि के बाद: meinen, seinen, unseren।'],
					ar: ['المذكر في حالة المفعول -en', 'بعد besuchen وsuchen وغيرهما: meinen، seinen، unseren.']
				},
				examples: [
					ex('Ich besuche meinen Onkel.', { ru: 'Я навещаю своего дядю.', uk: 'Я відвідую свого дядька.', en: 'I’m visiting my uncle.', pl: 'Odwiedzam mojego wujka.', es: 'Visito a mi tío.', fr: 'Je rends visite à mon oncle.', tr: 'Amcamı ziyaret ediyorum.', ro: 'Îl vizitez pe unchiul meu.', uz: "Amakimni ko'rgani boraman.", hi: 'मैं अपने चाचा से मिलने जा रहा हूँ।', ar: 'أزور عمي.' })
				]
			}
		]
	},

	'family-tree-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Хозяин и вещь', 'Слово выбираем по хозяину, окончание по вещи.'],
					uk: ['Власник і річ', 'Слово обираємо за власником, закінчення за річчю.'],
					en: ['Owner and thing', 'Choose the word by the owner and the ending by the thing.'],
					pl: ['Właściciel i rzecz', 'Słowo wybieramy według właściciela, końcówkę według rzeczy.'],
					es: ['Dueño y cosa', 'La palabra según el dueño, la terminación según la cosa.'],
					fr: ['Propriétaire et objet', 'Le mot selon le propriétaire, la terminaison selon l’objet.'],
					tr: ['Sahip ve eşya', 'Kelime sahibine, ek eşyaya göre seçilir.'],
					ro: ['Proprietar și obiect', 'Cuvântul după proprietar, terminația după obiect.'],
					uz: ['Ega va narsa', "So'z egasiga, qo'shimcha narsaga qarab tanlanadi."],
					hi: ['मालिक और चीज़', 'शब्द मालिक से, अंत चीज़ से चुनो।'],
					ar: ['المالك والشيء', 'نختار الكلمة حسب المالك، والنهاية حسب الشيء.']
				},
				examples: [
					ex('Seine Nichte ist sehr jung.', { ru: 'Его племянница очень молодая.', uk: 'Його племінниця дуже молода.', en: 'His niece is very young.', pl: 'Jego siostrzenica jest bardzo młoda.', es: 'Su sobrina es muy joven.', fr: 'Sa nièce est très jeune.', tr: 'Yeğeni çok genç.', ro: 'Nepoata lui este foarte tânără.', uz: 'Uning jiyani juda yosh.', hi: 'उसकी भतीजी बहुत छोटी है।', ar: 'ابنة أخيه صغيرة جداً.' })
				]
			},
			{
				t: {
					ru: ['Akkusativ: -en у мужского рода', 'После глагола мужской род получает -en.'],
					uk: ['Akkusativ: -en у чоловічого роду', 'Після дієслова чоловічий рід отримує -en.'],
					en: ['Accusative: -en for masculine', 'After the verb a masculine noun takes -en.'],
					pl: ['Akkusativ: -en w rodzaju męskim', 'Po czasowniku rodzaj męski dostaje -en.'],
					es: ['Acusativo: -en en masculino', 'Después del verbo el masculino lleva -en.'],
					fr: ['Accusatif : -en au masculin', 'Après le verbe, le masculin prend -en.'],
					tr: ['Akkusativ: erilde -en', 'Fiilden sonra eril -en alır.'],
					ro: ['Acuzativ: -en la masculin', 'După verb masculinul primește -en.'],
					uz: ['Akkusativ: erkak rodida -en', "Fe'ldan keyin erkak rodi -en oladi."],
					hi: ['Akkusativ: पुल्लिंग में -en', 'क्रिया के बाद पुल्लिंग -en लेता है।'],
					ar: ['حالة المفعول: -en للمذكر', 'بعد الفعل يأخذ المذكر -en.']
				},
				examples: [
					ex('Wir besuchen unseren Onkel.', { ru: 'Мы навещаем нашего дядю.', uk: 'Ми відвідуємо нашого дядька.', en: 'We’re visiting our uncle.', pl: 'Odwiedzamy naszego wujka.', es: 'Visitamos a nuestro tío.', fr: 'Nous rendons visite à notre oncle.', tr: 'Amcamızı ziyaret ediyoruz.', ro: 'Îl vizităm pe unchiul nostru.', uz: "Amakimizni ko'rgani boramiz.", hi: 'हम अपने चाचा से मिलने जा रहे हैं।', ar: 'نزور عمنا.' })
				]
			}
		]
	}
}

module.exports = quests
