// Грамматика к заданиям земли market-square (Рыночная площадь: Akkusativ и покупки)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'market-square-one': {
		title: {
			ru: 'Akkusativ: den и einen', uk: 'Akkusativ: den і einen', en: 'Accusative: den and einen',
			pl: 'Akkusativ: den i einen', es: 'Acusativo: den y einen', fr: 'Accusatif : den et einen',
			tr: 'Akkusativ: den ve einen', ro: 'Acuzativul: den și einen', uz: 'Akkusativ: den va einen',
			hi: 'Akkusativ: den और einen', ar: 'حالة المفعول: den وeinen'
		},
		points: [
			{
				t: {
					ru: ['Что? Кого?', 'После kaufen, brauchen, suchen, haben предмет отвечает на вопрос Was? (что?) или Wen? (кого?). Это падеж Akkusativ.'],
					uk: ['Що? Кого?', 'Після kaufen, brauchen, suchen, haben предмет відповідає на питання Was? (що?) або Wen? (кого?). Це відмінок Akkusativ.'],
					en: ['What? Whom?', 'After kaufen, brauchen, suchen, haben the object answers Was? (what?) or Wen? (whom?). This is the accusative case.'],
					pl: ['Co? Kogo?', 'Po kaufen, brauchen, suchen, haben przedmiot odpowiada na pytanie Was? (co?) albo Wen? (kogo?). To przypadek Akkusativ.'],
					es: ['¿Qué? ¿A quién?', 'Después de kaufen, brauchen, suchen, haben el objeto responde a Was? (¿qué?) o Wen? (¿a quién?). Es el acusativo.'],
					fr: ['Quoi ? Qui ?', 'Après kaufen, brauchen, suchen, haben, le complément répond à Was ? (quoi ?) ou Wen ? (qui ?). C’est l’accusatif.'],
					tr: ['Neyi? Kimi?', 'kaufen, brauchen, suchen, haben’den sonra nesne Was? (neyi?) ya da Wen? (kimi?) sorusuna cevap verir. Bu Akkusativ halidir.'],
					ro: ['Ce? Pe cine?', 'După kaufen, brauchen, suchen, haben obiectul răspunde la Was? (ce?) sau Wen? (pe cine?). Acesta e acuzativul.'],
					uz: ['Nimani? Kimni?', "kaufen, brauchen, suchen, haben dan keyin narsa Was? (nimani?) yoki Wen? (kimni?) savoliga javob beradi. Bu Akkusativ kelishigi."],
					hi: ['क्या? किसे?', 'kaufen, brauchen, suchen, haben के बाद कर्म Was? (क्या?) या Wen? (किसे?) का जवाब देता है। यह Akkusativ कारक है।'],
					ar: ['ماذا؟ من؟', 'بعد kaufen وbrauchen وsuchen وhaben يجيب المفعول عن Was? (ماذا؟) أو Wen? (من؟). هذه حالة Akkusativ.']
				},
				examples: []
			},
			{
				t: {
					ru: ['Меняется только мужской род', 'der становится den, ein становится einen.'],
					uk: ['Змінюється лише чоловічий рід', 'der стає den, ein стає einen.'],
					en: ['Only masculine changes', 'der becomes den, ein becomes einen.'],
					pl: ['Zmienia się tylko rodzaj męski', 'der zmienia się w den, ein w einen.'],
					es: ['Solo cambia el masculino', 'der pasa a den, ein pasa a einen.'],
					fr: ['Seul le masculin change', 'der devient den, ein devient einen.'],
					tr: ['Sadece eril değişir', 'der den olur, ein einen olur.'],
					ro: ['Se schimbă doar masculinul', 'der devine den, ein devine einen.'],
					uz: ["Faqat erkak rodi o'zgaradi", "der den ga, ein einen ga aylanadi."],
					hi: ['सिर्फ़ पुल्लिंग बदलता है', 'der बनता है den, ein बनता है einen।'],
					ar: ['يتغير المذكر فقط', 'der تصبح den، وein تصبح einen.']
				},
				examples: [
					ex('Ich kaufe den Stuhl.', { ru: 'Я покупаю (этот) стул.', uk: 'Я купую (цей) стілець.', en: 'I’m buying the chair.', pl: 'Kupuję (to) krzesło.', es: 'Compro la silla.', fr: 'J’achète la chaise.', tr: 'Sandalyeyi alıyorum.', ro: 'Cumpăr scaunul.', uz: 'Men (shu) stulni sotib olaman.', hi: 'मैं वह कुर्सी खरीद रहा हूँ।', ar: 'أشتري الكرسي.' }),
					ex('Ich brauche einen Stuhl.', { ru: 'Мне нужен стул.', uk: 'Мені потрібен стілець.', en: 'I need a chair.', pl: 'Potrzebuję krzesła.', es: 'Necesito una silla.', fr: 'J’ai besoin d’une chaise.', tr: 'Bir sandalyeye ihtiyacım var.', ro: 'Am nevoie de un scaun.', uz: 'Menga stul kerak.', hi: 'मुझे एक कुर्सी चाहिए।', ar: 'أحتاج كرسياً.' })
				]
			}
		]
	},

	'market-square-two': {
		title: {
			ru: 'die, das и множественное: без изменений', uk: 'die, das і множина: без змін', en: 'die, das and plural: no change',
			pl: 'die, das i liczba mnoga: bez zmian', es: 'die, das y plural: sin cambios', fr: 'die, das et pluriel : pas de changement',
			tr: 'die, das ve çoğul: değişmez', ro: 'die, das și pluralul: fără schimbări', uz: "die, das va ko'plik: o'zgarmaydi",
			hi: 'die, das और बहुवचन: कोई बदलाव नहीं', ar: 'die وdas والجمع: بدون تغيير'
		},
		points: [
			{
				t: {
					ru: ['Остаётся как было', 'В Akkusativ женский род, средний род и множественное число не меняются.'],
					uk: ['Лишається як було', 'В Akkusativ жіночий рід, середній рід і множина не змінюються.'],
					en: ['Stays the same', 'In the accusative, feminine, neuter and plural don’t change.'],
					pl: ['Zostaje bez zmian', 'W Akkusativ rodzaj żeński, nijaki i liczba mnoga się nie zmieniają.'],
					es: ['Queda igual', 'En acusativo, el femenino, el neutro y el plural no cambian.'],
					fr: ['Ça ne change pas', 'À l’accusatif, le féminin, le neutre et le pluriel ne changent pas.'],
					tr: ['Aynı kalır', 'Akkusativ’de dişil, nötr ve çoğul değişmez.'],
					ro: ['Rămâne la fel', 'La acuzativ femininul, neutrul și pluralul nu se schimbă.'],
					uz: ["O'zgarmaydi", "Akkusativda ayol rodi, o'rta rod va ko'plik o'zgarmaydi."],
					hi: ['वैसा ही रहता है', 'Akkusativ में स्त्रीलिंग, नपुंसकलिंग और बहुवचन नहीं बदलते।'],
					ar: ['يبقى كما هو', 'في حالة Akkusativ لا يتغير المؤنث والمحايد والجمع.']
				},
				examples: [
					ex('Ich kaufe eine Banane.', { ru: 'Я покупаю банан.', uk: 'Я купую банан.', en: 'I’m buying a banana.', pl: 'Kupuję banana.', es: 'Compro un plátano.', fr: 'J’achète une banane.', tr: 'Bir muz alıyorum.', ro: 'Cumpăr o banană.', uz: 'Men banan sotib olaman.', hi: 'मैं एक केला खरीद रहा हूँ।', ar: 'أشتري موزة.' }),
					ex('Wir kaufen das Brot.', { ru: 'Мы берём хлеб.', uk: 'Ми беремо хліб.', en: 'We’re buying the bread.', pl: 'Kupujemy chleb.', es: 'Compramos el pan.', fr: 'Nous achetons le pain.', tr: 'Ekmeği alıyoruz.', ro: 'Cumpărăm pâinea.', uz: 'Biz nonni sotib olamiz.', hi: 'हम रोटी खरीद रहे हैं।', ar: 'نشتري الخبز.' })
				]
			},
			{
				t: {
					ru: ['Много штук без артикля', 'Когда говорим о нескольких вещах вообще, артикль не нужен.'],
					uk: ['Багато штук без артикля', 'Коли кажемо про кілька речей загалом, артикль не потрібен.'],
					en: ['Several things: no article', 'When talking about several things in general, no article is needed.'],
					pl: ['Wiele sztuk bez rodzajnika', 'Gdy mówimy ogólnie o kilku rzeczach, rodzajnik nie jest potrzebny.'],
					es: ['Varias cosas sin artículo', 'Cuando hablamos de varias cosas en general, no hace falta artículo.'],
					fr: ['Plusieurs choses sans article', 'Quand on parle de plusieurs choses en général, pas besoin d’article.'],
					tr: ['Birden çok şey artikelsiz', 'Genel olarak birkaç şeyden bahsederken artikel gerekmez.'],
					ro: ['Mai multe lucruri fără articol', 'Când vorbim în general despre mai multe lucruri, nu e nevoie de articol.'],
					uz: ["Bir nechta narsa artiklsiz", "Umuman bir nechta narsa haqida gapirganda artikl kerak emas."],
					hi: ['कई चीज़ें बिना आर्टिकल', 'जब आम तौर पर कई चीज़ों की बात हो, आर्टिकल नहीं चाहिए।'],
					ar: ['عدة أشياء بدون أداة', 'عندما نتحدث عن عدة أشياء بشكل عام لا نحتاج أداة.']
				},
				examples: [
					ex('Ich kaufe Äpfel und Eier.', { ru: 'Я покупаю яблоки и яйца.', uk: 'Я купую яблука і яйця.', en: 'I’m buying apples and eggs.', pl: 'Kupuję jabłka i jajka.', es: 'Compro manzanas y huevos.', fr: 'J’achète des pommes et des œufs.', tr: 'Elma ve yumurta alıyorum.', ro: 'Cumpăr mere și ouă.', uz: 'Men olma va tuxum sotib olaman.', hi: 'मैं सेब और अंडे खरीद रहा हूँ।', ar: 'أشتري تفاحاً وبيضاً.' })
				]
			}
		]
	},

	'market-square-three': {
		title: {
			ru: 'keinen и Wen? (кого?)', uk: 'keinen і Wen? (кого?)', en: 'keinen and Wen? (whom?)',
			pl: 'keinen i Wen? (kogo?)', es: 'keinen y Wen? (¿a quién?)', fr: 'keinen et Wen ? (qui ?)',
			tr: 'keinen ve Wen? (kimi?)', ro: 'keinen și Wen? (pe cine?)', uz: 'keinen va Wen? (kimni?)',
			hi: 'keinen और Wen? (किसे?)', ar: 'keinen وWen؟ (من؟)'
		},
		points: [
			{
				t: {
					ru: ['kein как ein', 'kein меняется так же, как ein: мужской род получает keinen.'],
					uk: ['kein як ein', 'kein змінюється так само, як ein: чоловічий рід отримує keinen.'],
					en: ['kein works like ein', 'kein changes just like ein: masculine becomes keinen.'],
					pl: ['kein jak ein', 'kein zmienia się tak samo jak ein: rodzaj męski dostaje keinen.'],
					es: ['kein como ein', 'kein cambia igual que ein: el masculino pasa a keinen.'],
					fr: ['kein comme ein', 'kein change comme ein : le masculin devient keinen.'],
					tr: ['kein, ein gibi', 'kein de ein gibi değişir: eril keinen olur.'],
					ro: ['kein ca ein', 'kein se schimbă la fel ca ein: masculinul devine keinen.'],
					uz: ['kein ein kabi', "kein ham ein kabi o'zgaradi: erkak rodi keinen bo'ladi."],
					hi: ['kein, ein की तरह', 'kein भी ein की तरह बदलता है: पुल्लिंग keinen बनता है।'],
					ar: ['kein مثل ein', 'تتغير kein مثل ein تماماً: المذكر يصبح keinen.']
				},
				examples: [
					ex('Ich habe keinen Stift.', { ru: 'У меня нет ручки.', uk: 'У мене немає ручки.', en: 'I don’t have a pen.', pl: 'Nie mam długopisu.', es: 'No tengo bolígrafo.', fr: 'Je n’ai pas de stylo.', tr: 'Kalemim yok.', ro: 'Nu am pix.', uz: "Mening ruchkam yo'q.", hi: 'मेरे पास पेन नहीं है।', ar: 'ليس عندي قلم.' })
				]
			},
			{
				t: {
					ru: ['Wen? для людей', 'Про вещь спрашиваем Was?, про человека Wen? (кого?). Мужской род так же меняется: den Opa.'],
					uk: ['Wen? для людей', 'Про річ питаємо Was?, про людину Wen? (кого?). Чоловічий рід так само змінюється: den Opa.'],
					en: ['Wen? for people', 'Ask Was? about a thing and Wen? (whom?) about a person. Masculine changes the same way: den Opa.'],
					pl: ['Wen? dla ludzi', 'O rzecz pytamy Was?, o człowieka Wen? (kogo?). Rodzaj męski zmienia się tak samo: den Opa.'],
					es: ['Wen? para personas', 'Por una cosa se pregunta Was?, por una persona Wen? (¿a quién?). El masculino cambia igual: den Opa.'],
					fr: ['Wen ? pour les personnes', 'Pour un objet on demande Was ?, pour une personne Wen ? (qui ?). Le masculin change pareil : den Opa.'],
					tr: ['İnsanlar için Wen?', 'Eşya için Was?, insan için Wen? (kimi?) sorulur. Eril yine değişir: den Opa.'],
					ro: ['Wen? pentru oameni', 'Despre un lucru întrebi Was?, despre un om Wen? (pe cine?). Masculinul se schimbă la fel: den Opa.'],
					uz: ['Odamlar uchun Wen?', "Narsa haqida Was?, odam haqida Wen? (kimni?) deb so'raladi. Erkak rodi xuddi shunday o'zgaradi: den Opa."],
					hi: ['लोगों के लिए Wen?', 'चीज़ के बारे में Was?, इंसान के बारे में Wen? (किसे?) पूछते हैं। पुल्लिंग वैसे ही बदलता है: den Opa।'],
					ar: ['Wen؟ للأشخاص', 'عن الشيء نسأل Was؟، وعن الشخص Wen؟ (من؟). والمذكر يتغير بالطريقة نفسها: den Opa.']
				},
				examples: [
					ex('Wen besuchst du? Ich besuche den Opa.', { ru: 'Кого ты навещаешь? Я навещаю дедушку.', uk: 'Кого ти відвідуєш? Я відвідую дідуся.', en: 'Who are you visiting? I’m visiting grandpa.', pl: 'Kogo odwiedzasz? Odwiedzam dziadka.', es: '¿A quién visitas? Visito al abuelo.', fr: 'Qui vas-tu voir ? Je vais voir papi.', tr: 'Kimi ziyaret ediyorsun? Dedemi ziyaret ediyorum.', ro: 'Pe cine vizitezi? Îl vizitez pe bunicul.', uz: "Kimni ko'rgani borasan? Bobomni ko'rgani boraman.", hi: 'तुम किससे मिलने जा रहे हो? मैं दादाजी से मिलने जा रहा हूँ।', ar: 'من تزور؟ أزور جدي.' })
				]
			}
		]
	},

	'market-square-four': {
		title: {
			ru: 'Количество: ein Kilo Äpfel', uk: 'Кількість: ein Kilo Äpfel', en: 'Quantities: ein Kilo Äpfel',
			pl: 'Ilość: ein Kilo Äpfel', es: 'Cantidades: ein Kilo Äpfel', fr: 'Les quantités : ein Kilo Äpfel',
			tr: 'Miktar: ein Kilo Äpfel', ro: 'Cantitatea: ein Kilo Äpfel', uz: 'Miqdor: ein Kilo Äpfel',
			hi: 'मात्रा: ein Kilo Äpfel', ar: 'الكمية: ein Kilo Äpfel'
		},
		points: [
			{
				t: {
					ru: ['После количества без артикля', 'После ein Kilo, 500 Gramm и т.п. слово идёт без артикля и без «из».'],
					uk: ['Після кількості без артикля', 'Після ein Kilo, 500 Gramm тощо слово йде без артикля.'],
					en: ['No article after a quantity', 'After ein Kilo, 500 Gramm and so on, the noun has no article and no "of".'],
					pl: ['Po ilości bez rodzajnika', 'Po ein Kilo, 500 Gramm itp. słowo idzie bez rodzajnika.'],
					es: ['Sin artículo tras la cantidad', 'Después de ein Kilo, 500 Gramm, etc., la palabra va sin artículo y sin "de".'],
					fr: ['Pas d’article après une quantité', 'Après ein Kilo, 500 Gramm, etc., le nom n’a ni article ni « de ».'],
					tr: ['Miktardan sonra artikel yok', 'ein Kilo, 500 Gramm gibi miktarlardan sonra isim artikelsiz gelir.'],
					ro: ['Fără articol după cantitate', 'După ein Kilo, 500 Gramm etc. cuvântul vine fără articol și fără „de”.'],
					uz: ['Miqdordan keyin artiklsiz', "ein Kilo, 500 Gramm kabi miqdordan keyin so'z artiklsiz keladi."],
					hi: ['मात्रा के बाद आर्टिकल नहीं', 'ein Kilo, 500 Gramm आदि के बाद संज्ञा बिना आर्टिकल के आती है।'],
					ar: ['لا أداة بعد الكمية', 'بعد ein Kilo و500 Gramm ونحوها يأتي الاسم بدون أداة.']
				},
				examples: [
					ex('Ein Kilo Äpfel, bitte.', { ru: 'Килограмм яблок, пожалуйста.', uk: 'Кілограм яблук, будь ласка.', en: 'A kilo of apples, please.', pl: 'Kilogram jabłek, proszę.', es: 'Un kilo de manzanas, por favor.', fr: 'Un kilo de pommes, s’il vous plaît.', tr: 'Bir kilo elma, lütfen.', ro: 'Un kilogram de mere, vă rog.', uz: 'Bir kilo olma, iltimos.', hi: 'एक किलो सेब, कृपया।', ar: 'كيلو تفاح من فضلك.' }),
					ex('500 Gramm Käse', { ru: '500 грамм сыра', uk: '500 грамів сиру', en: '500 grams of cheese', pl: '500 gramów sera', es: '500 gramos de queso', fr: '500 grammes de fromage', tr: '500 gram peynir', ro: '500 de grame de brânză', uz: '500 gramm pishloq', hi: '500 ग्राम पनीर', ar: '500 غرام جبن' })
				]
			},
			{
				t: {
					ru: ['Цена и выбор', 'Спросить цену: Was kostet...? Сказать, что берёшь: Ich nehme...'],
					uk: ['Ціна і вибір', 'Запитати ціну: Was kostet...? Сказати, що береш: Ich nehme...'],
					en: ['Price and choice', 'Ask the price: Was kostet...? Say what you take: Ich nehme...'],
					pl: ['Cena i wybór', 'Zapytać o cenę: Was kostet...? Powiedzieć, co bierzesz: Ich nehme...'],
					es: ['Precio y elección', 'Preguntar el precio: Was kostet...? Decir qué te llevas: Ich nehme...'],
					fr: ['Prix et choix', 'Demander le prix : Was kostet... ? Dire ce qu’on prend : Ich nehme...'],
					tr: ['Fiyat ve seçim', 'Fiyat sormak: Was kostet...? Ne aldığını söylemek: Ich nehme...'],
					ro: ['Preț și alegere', 'Întrebi prețul: Was kostet...? Spui ce iei: Ich nehme...'],
					uz: ['Narx va tanlov', "Narx so'rash: Was kostet...? Nima olayotganingni aytish: Ich nehme..."],
					hi: ['कीमत और चुनाव', 'कीमत पूछना: Was kostet...? क्या ले रहे हो बताना: Ich nehme...'],
					ar: ['السعر والاختيار', 'لتسأل عن السعر: Was kostet...؟ ولتقول ماذا تأخذ: Ich nehme...']
				},
				examples: [
					ex('Was kostet ein Kilo Kartoffeln?', { ru: 'Сколько стоит килограмм картошки?', uk: 'Скільки коштує кілограм картоплі?', en: 'How much is a kilo of potatoes?', pl: 'Ile kosztuje kilogram ziemniaków?', es: '¿Cuánto cuesta un kilo de patatas?', fr: 'Combien coûte un kilo de pommes de terre ?', tr: 'Bir kilo patates ne kadar?', ro: 'Cât costă un kilogram de cartofi?', uz: 'Bir kilo kartoshka qancha turadi?', hi: 'एक किलो आलू कितने का है?', ar: 'كم سعر كيلو البطاطا؟' }),
					ex('Ich nehme ein Kilo Tomaten.', { ru: 'Я беру килограмм помидоров.', uk: 'Я беру кілограм помідорів.', en: 'I’ll take a kilo of tomatoes.', pl: 'Biorę kilogram pomidorów.', es: 'Me llevo un kilo de tomates.', fr: 'Je prends un kilo de tomates.', tr: 'Bir kilo domates alıyorum.', ro: 'Iau un kilogram de roșii.', uz: 'Men bir kilo pomidor olaman.', hi: 'मैं एक किलो टमाटर लूँगा।', ar: 'آخذ كيلو طماطم.' })
				]
			}
		]
	},

	'market-square-five': {
		title: {
			ru: 'Список покупок', uk: 'Список покупок', en: 'The shopping list',
			pl: 'Lista zakupów', es: 'La lista de la compra', fr: 'La liste de courses',
			tr: 'Alışveriş listesi', ro: 'Lista de cumpărături', uz: "Xaridlar ro'yxati",
			hi: 'खरीदारी की सूची', ar: 'قائمة المشتريات'
		},
		points: [
			{
				t: {
					ru: ['Мера тоже в Akkusativ', 'Слово меры тоже меняется, если оно мужского рода: der Liter → einen Liter Milch. die Flasche и das Paket не меняются.'],
					uk: ['Міра теж в Akkusativ', 'Слово міри теж змінюється, якщо воно чоловічого роду: der Liter → einen Liter Milch. die Flasche і das Paket не змінюються.'],
					en: ['The measure word changes too', 'A masculine measure word changes too: der Liter → einen Liter Milch. die Flasche and das Paket stay the same.'],
					pl: ['Miara też w Akkusativ', 'Słowo miary też się zmienia, jeśli jest rodzaju męskiego: der Liter → einen Liter Milch. die Flasche i das Paket się nie zmieniają.'],
					es: ['La medida también cambia', 'La palabra de medida masculina también cambia: der Liter → einen Liter Milch. die Flasche y das Paket no cambian.'],
					fr: ['Le mot de mesure change aussi', 'Un mot de mesure masculin change aussi : der Liter → einen Liter Milch. die Flasche et das Paket ne changent pas.'],
					tr: ['Ölçü kelimesi de değişir', 'Eril ölçü kelimesi de değişir: der Liter → einen Liter Milch. die Flasche ve das Paket değişmez.'],
					ro: ['Și măsura se schimbă', 'Cuvântul de măsură masculin se schimbă și el: der Liter → einen Liter Milch. die Flasche și das Paket nu se schimbă.'],
					uz: ["O'lchov so'zi ham o'zgaradi", "Erkak rodidagi o'lchov so'zi ham o'zgaradi: der Liter → einen Liter Milch. die Flasche va das Paket o'zgarmaydi."],
					hi: ['माप का शब्द भी बदलता है', 'पुल्लिंग माप शब्द भी बदलता है: der Liter → einen Liter Milch। die Flasche और das Paket नहीं बदलते।'],
					ar: ['كلمة المقدار تتغير أيضاً', 'كلمة المقدار المذكرة تتغير أيضاً: der Liter → einen Liter Milch. أما die Flasche وdas Paket فلا يتغيران.']
				},
				examples: [
					ex('Wir brauchen einen Liter Milch.', { ru: 'Нам нужен литр молока.', uk: 'Нам потрібен літр молока.', en: 'We need a litre of milk.', pl: 'Potrzebujemy litra mleka.', es: 'Necesitamos un litro de leche.', fr: 'Nous avons besoin d’un litre de lait.', tr: 'Bir litre süte ihtiyacımız var.', ro: 'Avem nevoie de un litru de lapte.', uz: 'Bizga bir litr sut kerak.', hi: 'हमें एक लीटर दूध चाहिए।', ar: 'نحتاج لتر حليب.' }),
					ex('Eine Flasche Wasser, bitte.', { ru: 'Бутылку воды, пожалуйста.', uk: 'Пляшку води, будь ласка.', en: 'A bottle of water, please.', pl: 'Butelkę wody, proszę.', es: 'Una botella de agua, por favor.', fr: 'Une bouteille d’eau, s’il vous plaît.', tr: 'Bir şişe su, lütfen.', ro: 'O sticlă de apă, vă rog.', uz: 'Bir shisha suv, iltimos.', hi: 'एक बोतल पानी, कृपया।', ar: 'زجاجة ماء من فضلك.' })
				]
			}
		]
	},

	'market-square-six': {
		title: {
			ru: 'На кассе', uk: 'На касі', en: 'At the checkout',
			pl: 'Przy kasie', es: 'En la caja', fr: 'À la caisse',
			tr: 'Kasada', ro: 'La casă', uz: 'Kassada',
			hi: 'काउंटर पर', ar: 'عند الصندوق'
		},
		points: [
			{
				t: {
					ru: ['Фразы на кассе', 'Das macht... значит «с вас...». Платим: Ich bezahle bar (наличными) или mit Karte (картой).'],
					uk: ['Фрази на касі', 'Das macht... означає «з вас...». Платимо: Ich bezahle bar (готівкою) або mit Karte (карткою).'],
					en: ['Checkout phrases', 'Das macht... means "that comes to...". Pay: Ich bezahle bar (cash) or mit Karte (by card).'],
					pl: ['Zwroty przy kasie', 'Das macht... znaczy „razem...”. Płacimy: Ich bezahle bar (gotówką) albo mit Karte (kartą).'],
					es: ['Frases en la caja', 'Das macht... significa "son...". Pagamos: Ich bezahle bar (en efectivo) o mit Karte (con tarjeta).'],
					fr: ['Phrases à la caisse', 'Das macht... veut dire « ça fait... ». On paie : Ich bezahle bar (en liquide) ou mit Karte (par carte).'],
					tr: ['Kasa ifadeleri', 'Das macht... "tutarı..." demektir. Ödeme: Ich bezahle bar (nakit) ya da mit Karte (kartla).'],
					ro: ['Fraze la casă', 'Das macht... înseamnă „face...”. Plătim: Ich bezahle bar (cash) sau mit Karte (cu cardul).'],
					uz: ['Kassadagi iboralar', "Das macht... \"jami ...\" degani. To'lash: Ich bezahle bar (naqd) yoki mit Karte (karta bilan)."],
					hi: ['काउंटर पर वाक्य', 'Das macht... का मतलब "कुल ... हुए"। भुगतान: Ich bezahle bar (नकद) या mit Karte (कार्ड से)।'],
					ar: ['عبارات عند الصندوق', 'Das macht... تعني "المجموع...". وللدفع: Ich bezahle bar (نقداً) أو mit Karte (بالبطاقة).']
				},
				examples: [
					ex('Das macht zwölf Euro.', { ru: 'С вас двенадцать евро.', uk: 'З вас дванадцять євро.', en: 'That’s twelve euros.', pl: 'Razem dwanaście euro.', es: 'Son doce euros.', fr: 'Ça fait douze euros.', tr: 'On iki euro tutuyor.', ro: 'Face doisprezece euro.', uz: "Jami o'n ikki yevro.", hi: 'कुल बारह यूरो हुए।', ar: 'المجموع اثنا عشر يورو.' }),
					ex('Ich bezahle mit Karte.', { ru: 'Я плачу картой.', uk: 'Я плачу карткою.', en: 'I’ll pay by card.', pl: 'Płacę kartą.', es: 'Pago con tarjeta.', fr: 'Je paie par carte.', tr: 'Kartla ödüyorum.', ro: 'Plătesc cu cardul.', uz: "Karta bilan to'layman.", hi: 'मैं कार्ड से भुगतान करूँगा।', ar: 'أدفع بالبطاقة.' })
				]
			},
			{
				t: {
					ru: ['Цена с центами', 'Сначала евро, потом центы, слово «цент» не говорят.'],
					uk: ['Ціна з центами', 'Спочатку євро, потім центи, слово «цент» не кажуть.'],
					en: ['Prices with cents', 'Euros first, then cents, without saying "cent".'],
					pl: ['Cena z centami', 'Najpierw euro, potem centy, słowa „cent” się nie mówi.'],
					es: ['Precio con céntimos', 'Primero los euros, luego los céntimos, sin decir "céntimo".'],
					fr: ['Prix avec centimes', 'D’abord les euros, puis les centimes, sans dire « centime ».'],
					tr: ['Kuruşlu fiyat', 'Önce euro, sonra sent; "sent" kelimesi söylenmez.'],
					ro: ['Preț cu cenți', 'Întâi euro, apoi cenții, fără să spui „cent”.'],
					uz: ['Sentli narx', "Avval yevro, keyin sent, \"sent\" so'zi aytilmaydi."],
					hi: ['सेंट के साथ कीमत', 'पहले यूरो, फिर सेंट, "सेंट" शब्द नहीं बोलते।'],
					ar: ['السعر مع السنتات', 'اليورو أولاً ثم السنتات، دون قول كلمة "سنت".']
				},
				examples: [
					ex('3,50 € = drei Euro fünfzig', { ru: 'три евро пятьдесят', uk: 'три євро п’ятдесят', en: 'three euros fifty', pl: 'trzy euro pięćdziesiąt', es: 'tres euros cincuenta', fr: 'trois euros cinquante', tr: 'üç euro elli', ro: 'trei euro cincizeci', uz: 'uch yevro ellik', hi: 'तीन यूरो पचास', ar: 'ثلاثة يورو وخمسون' })
				]
			}
		]
	},

	'market-square-seven': {
		title: {
			ru: 'Практика: в пекарне', uk: 'Практика: у пекарні', en: 'Practice: at the bakery',
			pl: 'Praktyka: w piekarni', es: 'Práctica: en la panadería', fr: 'Pratique : à la boulangerie',
			tr: 'Pratik: fırında', ro: 'Practică: la brutărie', uz: 'Mashq: novvoyxonada',
			hi: 'अभ्यास: बेकरी में', ar: 'تدريب: في المخبز'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Мужской род после глагола получает einen: der Kuchen → Ich nehme einen Kuchen.'],
					uk: ['Нових правил немає', 'Чоловічий рід після дієслова отримує einen: der Kuchen → Ich nehme einen Kuchen.'],
					en: ['No new rules', 'A masculine noun after the verb takes einen: der Kuchen → Ich nehme einen Kuchen.'],
					pl: ['Bez nowych reguł', 'Rodzaj męski po czasowniku dostaje einen: der Kuchen → Ich nehme einen Kuchen.'],
					es: ['Sin reglas nuevas', 'El masculino después del verbo lleva einen: der Kuchen → Ich nehme einen Kuchen.'],
					fr: ['Pas de nouvelle règle', 'Un nom masculin après le verbe prend einen : der Kuchen → Ich nehme einen Kuchen.'],
					tr: ['Yeni kural yok', 'Fiilden sonra eril isim einen alır: der Kuchen → Ich nehme einen Kuchen.'],
					ro: ['Fără reguli noi', 'Masculinul după verb primește einen: der Kuchen → Ich nehme einen Kuchen.'],
					uz: ["Yangi qoida yo'q", "Fe'ldan keyin erkak rodi einen oladi: der Kuchen → Ich nehme einen Kuchen."],
					hi: ['कोई नया नियम नहीं', 'क्रिया के बाद पुल्लिंग einen लेता है: der Kuchen → Ich nehme einen Kuchen।'],
					ar: ['لا قواعد جديدة', 'الاسم المذكر بعد الفعل يأخذ einen: der Kuchen → Ich nehme einen Kuchen.']
				},
				examples: [
					ex('Ich möchte zwei Brötchen, bitte.', { ru: 'Две булочки, пожалуйста.', uk: 'Дві булочки, будь ласка.', en: 'Two rolls, please.', pl: 'Poproszę dwie bułki.', es: 'Dos panecillos, por favor.', fr: 'Deux petits pains, s’il vous plaît.', tr: 'İki küçük ekmek, lütfen.', ro: 'Două chifle, vă rog.', uz: 'Ikkita bulochka, iltimos.', hi: 'दो बन, कृपया।', ar: 'خبزتان صغيرتان من فضلك.' }),
					ex('Ich nehme einen Kuchen.', { ru: 'Я беру пирог.', uk: 'Я беру пиріг.', en: 'I’ll take a cake.', pl: 'Biorę ciasto.', es: 'Me llevo un pastel.', fr: 'Je prends un gâteau.', tr: 'Bir kek alıyorum.', ro: 'Iau o prăjitură.', uz: 'Men pirog olaman.', hi: 'मैं एक केक लूँगा।', ar: 'آخذ كعكة.' })
				]
			}
		]
	},

	'market-square-eight': {
		title: {
			ru: 'Практика: покупки к празднику', uk: 'Практика: покупки до свята', en: 'Practice: party shopping',
			pl: 'Praktyka: zakupy na przyjęcie', es: 'Práctica: compras para la fiesta', fr: 'Pratique : courses pour la fête',
			tr: 'Pratik: parti alışverişi', ro: 'Practică: cumpărături pentru petrecere', uz: 'Mashq: bayram xaridlari',
			hi: 'अभ्यास: पार्टी की खरीदारी', ar: 'تدريب: مشتريات الحفلة'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Повторяем: der → den, ein → einen, kein → keinen. Остальное без изменений.'],
					uk: ['Нових правил немає', 'Повторюємо: der → den, ein → einen, kein → keinen. Решта без змін.'],
					en: ['No new rules', 'Review: der → den, ein → einen, kein → keinen. Everything else stays the same.'],
					pl: ['Bez nowych reguł', 'Powtarzamy: der → den, ein → einen, kein → keinen. Reszta bez zmian.'],
					es: ['Sin reglas nuevas', 'Repaso: der → den, ein → einen, kein → keinen. Lo demás no cambia.'],
					fr: ['Pas de nouvelle règle', 'Révision : der → den, ein → einen, kein → keinen. Le reste ne change pas.'],
					tr: ['Yeni kural yok', 'Tekrar: der → den, ein → einen, kein → keinen. Gerisi değişmez.'],
					ro: ['Fără reguli noi', 'Recapitulăm: der → den, ein → einen, kein → keinen. Restul rămâne la fel.'],
					uz: ["Yangi qoida yo'q", "Takrorlaymiz: der → den, ein → einen, kein → keinen. Qolgani o'zgarmaydi."],
					hi: ['कोई नया नियम नहीं', 'दोहराव: der → den, ein → einen, kein → keinen। बाकी नहीं बदलता।'],
					ar: ['لا قواعد جديدة', 'مراجعة: der → den، ein → einen، kein → keinen. والباقي لا يتغير.']
				},
				examples: [
					ex('Wir haben keinen Saft.', { ru: 'У нас нет сока.', uk: 'У нас немає соку.', en: 'We have no juice.', pl: 'Nie mamy soku.', es: 'No tenemos zumo.', fr: 'Nous n’avons pas de jus.', tr: 'Meyve suyumuz yok.', ro: 'Nu avem suc.', uz: "Bizda sharbat yo'q.", hi: 'हमारे पास जूस नहीं है।', ar: 'ليس عندنا عصير.' }),
					ex('Wir kaufen ein Geschenk.', { ru: 'Мы покупаем подарок.', uk: 'Ми купуємо подарунок.', en: 'We’re buying a present.', pl: 'Kupujemy prezent.', es: 'Compramos un regalo.', fr: 'Nous achetons un cadeau.', tr: 'Bir hediye alıyoruz.', ro: 'Cumpărăm un cadou.', uz: "Biz sovg'a sotib olamiz.", hi: 'हम एक तोहफ़ा खरीद रहे हैं।', ar: 'نشتري هدية.' })
				]
			}
		]
	},

	'market-square-nine': {
		title: {
			ru: 'Повторение: Akkusativ', uk: 'Повторення: Akkusativ', en: 'Review: the accusative',
			pl: 'Powtórka: Akkusativ', es: 'Repaso: el acusativo', fr: 'Révision : l’accusatif',
			tr: 'Tekrar: Akkusativ', ro: 'Recapitulare: acuzativul', uz: 'Takrorlash: Akkusativ',
			hi: 'दोहराव: Akkusativ', ar: 'مراجعة: حالة المفعول'
		},
		points: [
			{
				t: {
					ru: ['Мужской род меняется', 'После kaufen, brauchen, nehmen и других: der → den, ein → einen, kein → keinen.'],
					uk: ['Чоловічий рід змінюється', 'Після kaufen, brauchen, nehmen та інших: der → den, ein → einen, kein → keinen.'],
					en: ['Masculine changes', 'After kaufen, brauchen, nehmen and others: der → den, ein → einen, kein → keinen.'],
					pl: ['Rodzaj męski się zmienia', 'Po kaufen, brauchen, nehmen i innych: der → den, ein → einen, kein → keinen.'],
					es: ['El masculino cambia', 'Después de kaufen, brauchen, nehmen y otros: der → den, ein → einen, kein → keinen.'],
					fr: ['Le masculin change', 'Après kaufen, brauchen, nehmen et d’autres : der → den, ein → einen, kein → keinen.'],
					tr: ['Eril değişir', 'kaufen, brauchen, nehmen ve diğerlerinden sonra: der → den, ein → einen, kein → keinen.'],
					ro: ['Masculinul se schimbă', 'După kaufen, brauchen, nehmen și altele: der → den, ein → einen, kein → keinen.'],
					uz: ["Erkak rodi o'zgaradi", "kaufen, brauchen, nehmen va boshqalardan keyin: der → den, ein → einen, kein → keinen."],
					hi: ['पुल्लिंग बदलता है', 'kaufen, brauchen, nehmen आदि के बाद: der → den, ein → einen, kein → keinen।'],
					ar: ['المذكر يتغير', 'بعد kaufen وbrauchen وnehmen وغيرها: der → den، ein → einen، kein → keinen.']
				},
				examples: [
					ex('Ich brauche einen Joghurt.', { ru: 'Мне нужен йогурт.', uk: 'Мені потрібен йогурт.', en: 'I need a yogurt.', pl: 'Potrzebuję jogurtu.', es: 'Necesito un yogur.', fr: 'J’ai besoin d’un yaourt.', tr: 'Bir yoğurda ihtiyacım var.', ro: 'Am nevoie de un iaurt.', uz: 'Menga yogurt kerak.', hi: 'मुझे एक दही चाहिए।', ar: 'أحتاج زبادي.' })
				]
			},
			{
				t: {
					ru: ['Остальное не меняется', 'die, das и множественное остаются как были.'],
					uk: ['Решта не змінюється', 'die, das і множина лишаються як були.'],
					en: ['The rest stays the same', 'die, das and plural stay as they are.'],
					pl: ['Reszta się nie zmienia', 'die, das i liczba mnoga zostają bez zmian.'],
					es: ['Lo demás no cambia', 'die, das y el plural quedan igual.'],
					fr: ['Le reste ne change pas', 'die, das et le pluriel restent tels quels.'],
					tr: ['Gerisi değişmez', 'die, das ve çoğul aynı kalır.'],
					ro: ['Restul nu se schimbă', 'die, das și pluralul rămân la fel.'],
					uz: ["Qolgani o'zgarmaydi", "die, das va ko'plik o'zgarmaydi."],
					hi: ['बाकी नहीं बदलता', 'die, das और बहुवचन वैसे ही रहते हैं।'],
					ar: ['الباقي لا يتغير', 'die وdas والجمع تبقى كما هي.']
				},
				examples: [
					ex('Kaufst du eine Orange?', { ru: 'Ты покупаешь апельсин?', uk: 'Ти купуєш апельсин?', en: 'Are you buying an orange?', pl: 'Kupujesz pomarańczę?', es: '¿Compras una naranja?', fr: 'Tu achètes une orange ?', tr: 'Bir portakal mı alıyorsun?', ro: 'Cumperi o portocală?', uz: 'Apelsin sotib olasanmi?', hi: 'क्या तुम एक संतरा खरीद रहे हो?', ar: 'هل تشتري برتقالة؟' })
				]
			},
			{
				t: {
					ru: ['Количество без артикля', 'После ein Kilo, eine Flasche, ein Liter слово без артикля.'],
					uk: ['Кількість без артикля', 'Після ein Kilo, eine Flasche, ein Liter слово без артикля.'],
					en: ['Quantity: no article', 'After ein Kilo, eine Flasche, ein Liter the noun has no article.'],
					pl: ['Ilość bez rodzajnika', 'Po ein Kilo, eine Flasche, ein Liter słowo bez rodzajnika.'],
					es: ['Cantidad sin artículo', 'Después de ein Kilo, eine Flasche, ein Liter la palabra va sin artículo.'],
					fr: ['Quantité sans article', 'Après ein Kilo, eine Flasche, ein Liter, le nom est sans article.'],
					tr: ['Miktar artikelsiz', 'ein Kilo, eine Flasche, ein Liter’den sonra isim artikelsiz.'],
					ro: ['Cantitate fără articol', 'După ein Kilo, eine Flasche, ein Liter cuvântul e fără articol.'],
					uz: ['Miqdor artiklsiz', "ein Kilo, eine Flasche, ein Liter dan keyin so'z artiklsiz."],
					hi: ['मात्रा बिना आर्टिकल', 'ein Kilo, eine Flasche, ein Liter के बाद संज्ञा बिना आर्टिकल।'],
					ar: ['الكمية بدون أداة', 'بعد ein Kilo وeine Flasche وein Liter يأتي الاسم بدون أداة.']
				},
				examples: [
					ex('ein Kilo Orangen', { ru: 'килограмм апельсинов', uk: 'кілограм апельсинів', en: 'a kilo of oranges', pl: 'kilogram pomarańczy', es: 'un kilo de naranjas', fr: 'un kilo d’oranges', tr: 'bir kilo portakal', ro: 'un kilogram de portocale', uz: 'bir kilo apelsin', hi: 'एक किलो संतरे', ar: 'كيلو برتقال' })
				]
			}
		]
	},

	'market-square-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['den, einen, keinen', 'Мужской род после глагола меняется, остальные нет.'],
					uk: ['den, einen, keinen', 'Чоловічий рід після дієслова змінюється, решта ні.'],
					en: ['den, einen, keinen', 'Masculine changes after the verb, the others don’t.'],
					pl: ['den, einen, keinen', 'Rodzaj męski po czasowniku się zmienia, reszta nie.'],
					es: ['den, einen, keinen', 'El masculino cambia después del verbo, los demás no.'],
					fr: ['den, einen, keinen', 'Le masculin change après le verbe, les autres non.'],
					tr: ['den, einen, keinen', 'Fiilden sonra eril değişir, diğerleri değişmez.'],
					ro: ['den, einen, keinen', 'Masculinul se schimbă după verb, celelalte nu.'],
					uz: ['den, einen, keinen', "Fe'ldan keyin erkak rodi o'zgaradi, qolganlari yo'q."],
					hi: ['den, einen, keinen', 'क्रिया के बाद पुल्लिंग बदलता है, बाकी नहीं।'],
					ar: ['den وeinen وkeinen', 'المذكر يتغير بعد الفعل، والبقية لا.']
				},
				examples: [
					ex('Wir suchen den Markt.', { ru: 'Мы ищем рынок.', uk: 'Ми шукаємо ринок.', en: 'We’re looking for the market.', pl: 'Szukamy targu.', es: 'Buscamos el mercado.', fr: 'Nous cherchons le marché.', tr: 'Pazarı arıyoruz.', ro: 'Căutăm piața.', uz: 'Biz bozorni qidiryapmiz.', hi: 'हम बाज़ार ढूँढ रहे हैं।', ar: 'نبحث عن السوق.' }),
					ex('Wir haben keine Wurst.', { ru: 'У нас нет колбасы.', uk: 'У нас немає ковбаси.', en: 'We have no sausage.', pl: 'Nie mamy kiełbasy.', es: 'No tenemos embutido.', fr: 'Nous n’avons pas de saucisse.', tr: 'Sucuğumuz yok.', ro: 'Nu avem cârnați.', uz: "Bizda kolbasa yo'q.", hi: 'हमारे पास सॉसेज नहीं है।', ar: 'ليس عندنا نقانق.' })
				]
			},
			{
				t: {
					ru: ['Wen? или Was?', 'Wen? про людей, Was? про вещи.'],
					uk: ['Wen? чи Was?', 'Wen? про людей, Was? про речі.'],
					en: ['Wen? or Was?', 'Wen? for people, Was? for things.'],
					pl: ['Wen? czy Was?', 'Wen? o ludzi, Was? o rzeczy.'],
					es: ['¿Wen? o Was?', 'Wen? para personas, Was? para cosas.'],
					fr: ['Wen ? ou Was ?', 'Wen ? pour les personnes, Was ? pour les objets.'],
					tr: ['Wen? mi, Was? mı', 'Wen? insanlar için, Was? eşyalar için.'],
					ro: ['Wen? sau Was?', 'Wen? pentru oameni, Was? pentru lucruri.'],
					uz: ['Wen? yoki Was?', 'Wen? odamlar uchun, Was? narsalar uchun.'],
					hi: ['Wen? या Was?', 'Wen? लोगों के लिए, Was? चीज़ों के लिए।'],
					ar: ['Wen؟ أم Was؟', 'Wen؟ للأشخاص، وWas؟ للأشياء.']
				},
				examples: [
					ex('Wen besuchst du heute? Einen Freund.', { ru: 'Кого ты навещаешь сегодня? Друга.', uk: 'Кого ти відвідуєш сьогодні? Друга.', en: 'Who are you visiting today? A friend.', pl: 'Kogo dziś odwiedzasz? Przyjaciela.', es: '¿A quién visitas hoy? A un amigo.', fr: 'Qui vas-tu voir aujourd’hui ? Un ami.', tr: 'Bugün kimi ziyaret ediyorsun? Bir arkadaşı.', ro: 'Pe cine vizitezi azi? Un prieten.', uz: "Bugun kimni ko'rgani borasan? Bir do'stimni.", hi: 'आज तुम किससे मिलने जा रहे हो? एक दोस्त से।', ar: 'من تزور اليوم؟ صديقاً.' })
				]
			},
			{
				t: {
					ru: ['Количество и цена', 'После количества без артикля. На кассе: Das macht...'],
					uk: ['Кількість і ціна', 'Після кількості без артикля. На касі: Das macht...'],
					en: ['Quantity and price', 'No article after a quantity. At the checkout: Das macht...'],
					pl: ['Ilość i cena', 'Po ilości bez rodzajnika. Przy kasie: Das macht...'],
					es: ['Cantidad y precio', 'Sin artículo tras la cantidad. En la caja: Das macht...'],
					fr: ['Quantité et prix', 'Pas d’article après une quantité. À la caisse : Das macht...'],
					tr: ['Miktar ve fiyat', 'Miktardan sonra artikel yok. Kasada: Das macht...'],
					ro: ['Cantitate și preț', 'După cantitate fără articol. La casă: Das macht...'],
					uz: ['Miqdor va narx', "Miqdordan keyin artiklsiz. Kassada: Das macht..."],
					hi: ['मात्रा और कीमत', 'मात्रा के बाद आर्टिकल नहीं। काउंटर पर: Das macht...'],
					ar: ['الكمية والسعر', 'لا أداة بعد الكمية. وعند الصندوق: Das macht...']
				},
				examples: [
					ex('Ein Kilo Reis, bitte. Was macht das?', { ru: 'Килограмм риса, пожалуйста. Сколько с меня?', uk: 'Кілограм рису, будь ласка. Скільки з мене?', en: 'A kilo of rice, please. How much is that?', pl: 'Kilogram ryżu, proszę. Ile płacę?', es: 'Un kilo de arroz, por favor. ¿Cuánto es?', fr: 'Un kilo de riz, s’il vous plaît. Ça fait combien ?', tr: 'Bir kilo pirinç, lütfen. Ne kadar tuttu?', ro: 'Un kilogram de orez, vă rog. Cât face?', uz: 'Bir kilo guruch, iltimos. Qancha bo‘ldi?', hi: 'एक किलो चावल, कृपया। कितने हुए?', ar: 'كيلو أرز من فضلك. كم المجموع؟' })
				]
			}
		]
	}
}

module.exports = quests
