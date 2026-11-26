// Грамматика к заданиям земли stone-reach (Граммельдорф: вещи в доме)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'village-1': {
		title: {
			ru: 'Артикли: der, die, das и ein, eine', uk: 'Артиклі: der, die, das та ein, eine', en: 'Articles: der, die, das and ein, eine',
			pl: 'Rodzajniki: der, die, das i ein, eine', es: 'Artículos: der, die, das y ein, eine', fr: 'Articles : der, die, das et ein, eine',
			tr: 'Artikeller: der, die, das ve ein, eine', ro: 'Articolele: der, die, das și ein, eine', uz: 'Artikllar: der, die, das va ein, eine',
			hi: 'आर्टिकल: der, die, das और ein, eine', ar: 'أدوات التعريف: der وdie وdas وein وeine'
		},
		points: [
			{
				t: {
					ru: ['Три рода', 'У каждого слова свой род: der (мужской), die (женский), das (средний). Род не всегда совпадает с русским, учи слово сразу с артиклем.'],
					uk: ['Три роди', 'Кожне слово має свій рід: der (чоловічий), die (жіночий), das (середній). Рід не завжди збігається з українським, вчи слово одразу з артиклем.'],
					en: ['Three genders', 'Every noun has a gender: der (masculine), die (feminine), das (neuter). Learn each word together with its article.'],
					pl: ['Trzy rodzaje', 'Każde słowo ma rodzaj: der (męski), die (żeński), das (nijaki). Rodzaj nie zawsze zgadza się z polskim, ucz się słowa od razu z rodzajnikiem.'],
					es: ['Tres géneros', 'Cada palabra tiene género: der (masculino), die (femenino), das (neutro). No siempre coincide con el español, aprende cada palabra con su artículo.'],
					fr: ['Trois genres', 'Chaque nom a un genre : der (masculin), die (féminin), das (neutre). Il ne correspond pas toujours au français, apprends chaque mot avec son article.'],
					tr: ['Üç cinsiyet', 'Her ismin bir cinsiyeti var: der (eril), die (dişil), das (nötr). Kelimeyi hep artikeliyle birlikte öğren.'],
					ro: ['Trei genuri', 'Fiecare cuvânt are un gen: der (masculin), die (feminin), das (neutru). Nu coincide mereu cu româna, învață cuvântul direct cu articolul.'],
					uz: ['Uch rod', "Har bir otning rodi bor: der (erkak), die (ayol), das (o'rta). So'zni doim artikli bilan birga o'rgan."],
					hi: ['तीन लिंग', 'हर संज्ञा का लिंग होता है: der (पुल्लिंग), die (स्त्रीलिंग), das (नपुंसकलिंग)। हर शब्द को उसके आर्टिकल के साथ सीखो।'],
					ar: ['ثلاثة أجناس', 'لكل اسم جنس: der (مذكر)، die (مؤنث)، das (محايد). احفظ كل كلمة مع أداتها.']
				},
				examples: [
					ex('der Tisch, die Lampe, das Buch', { ru: 'стол, лампа, книга', uk: 'стіл, лампа, книжка', en: 'the table, the lamp, the book', pl: 'stół, lampa, książka', es: 'la mesa, la lámpara, el libro', fr: 'la table, la lampe, le livre', tr: 'masa, lamba, kitap', ro: 'masa, lampa, cartea', uz: 'stol, chiroq, kitob', hi: 'मेज़, लैंप, किताब', ar: 'الطاولة، المصباح، الكتاب' })
				]
			},
			{
				t: {
					ru: ['ein и eine', 'ein, eine значат «один, какой-то». Для der и das говорим ein, для die говорим eine.'],
					uk: ['ein та eine', 'ein, eine означають «один, якийсь». Для der і das кажемо ein, для die кажемо eine.'],
					en: ['ein and eine', 'ein, eine mean "a, an". Use ein for der and das words, eine for die words.'],
					pl: ['ein i eine', 'ein, eine znaczą „jakiś, jeden”. Dla der i das mówimy ein, dla die mówimy eine.'],
					es: ['ein y eine', 'ein, eine significan "un, una". Para der y das se dice ein, para die se dice eine.'],
					fr: ['ein et eine', 'ein, eine veulent dire « un, une ». Pour der et das on dit ein, pour die on dit eine.'],
					tr: ['ein ve eine', 'ein, eine "bir" demektir. der ve das için ein, die için eine denir.'],
					ro: ['ein și eine', 'ein, eine înseamnă „un, o”. Pentru der și das spunem ein, pentru die spunem eine.'],
					uz: ['ein va eine', "ein, eine \"bitta, qandaydir\" degani. der va das uchun ein, die uchun eine."],
					hi: ['ein और eine', 'ein, eine का मतलब "एक, कोई"। der और das के लिए ein, die के लिए eine।'],
					ar: ['ein وeine', 'ein وeine تعنيان "واحد، أحد". مع der وdas نقول ein، ومع die نقول eine.']
				},
				examples: [
					ex('Das ist ein Tisch.', { ru: 'Это стол.', uk: 'Це стіл.', en: 'This is a table.', pl: 'To jest stół.', es: 'Esto es una mesa.', fr: 'C’est une table.', tr: 'Bu bir masa.', ro: 'Aceasta este o masă.', uz: 'Bu stol.', hi: 'यह एक मेज़ है।', ar: 'هذه طاولة.' }),
					ex('Das ist eine Lampe.', { ru: 'Это лампа.', uk: 'Це лампа.', en: 'This is a lamp.', pl: 'To jest lampa.', es: 'Esto es una lámpara.', fr: 'C’est une lampe.', tr: 'Bu bir lamba.', ro: 'Aceasta este o lampă.', uz: 'Bu chiroq.', hi: 'यह एक लैंप है।', ar: 'هذا مصباح.' })
				]
			},
			{
				t: {
					ru: ['Прилагательное после ist', 'Если прилагательное стоит после ist, оно не меняется: klein, groß, neu, alt.'],
					uk: ['Прикметник після ist', 'Якщо прикметник стоїть після ist, він не змінюється: klein, groß, neu, alt.'],
					en: ['Adjective after ist', 'After ist the adjective does not change: klein, groß, neu, alt.'],
					pl: ['Przymiotnik po ist', 'Po ist przymiotnik się nie zmienia: klein, groß, neu, alt.'],
					es: ['Adjetivo después de ist', 'Después de ist el adjetivo no cambia: klein, groß, neu, alt.'],
					fr: ['Adjectif après ist', 'Après ist, l’adjectif ne change pas : klein, groß, neu, alt.'],
					tr: ['ist’ten sonra sıfat', 'ist’ten sonra sıfat değişmez: klein, groß, neu, alt.'],
					ro: ['Adjectivul după ist', 'După ist adjectivul nu se schimbă: klein, groß, neu, alt.'],
					uz: ['ist dan keyin sifat', "ist dan keyin sifat o'zgarmaydi: klein, groß, neu, alt."],
					hi: ['ist के बाद विशेषण', 'ist के बाद विशेषण नहीं बदलता: klein, groß, neu, alt।'],
					ar: ['الصفة بعد ist', 'بعد ist لا تتغير الصفة: klein، groß، neu، alt.']
				},
				examples: [
					ex('Das Buch ist alt.', { ru: 'Книга старая.', uk: 'Книжка стара.', en: 'The book is old.', pl: 'Książka jest stara.', es: 'El libro es viejo.', fr: 'Le livre est vieux.', tr: 'Kitap eski.', ro: 'Cartea este veche.', uz: 'Kitob eski.', hi: 'किताब पुरानी है।', ar: 'الكتاب قديم.' }),
					ex('Der Stuhl ist klein.', { ru: 'Стул маленький.', uk: 'Стілець маленький.', en: 'The chair is small.', pl: 'Krzesło jest małe.', es: 'La silla es pequeña.', fr: 'La chaise est petite.', tr: 'Sandalye küçük.', ro: 'Scaunul este mic.', uz: 'Stul kichkina.', hi: 'कुर्सी छोटी है।', ar: 'الكرسي صغير.' })
				]
			}
		]
	},

	'village-2': {
		title: {
			ru: 'ein или der: новое и знакомое', uk: 'ein чи der: нове і знайоме', en: 'ein or der: new and known',
			pl: 'ein czy der: nowe i znane', es: 'ein o der: nuevo y conocido', fr: 'ein ou der : nouveau et connu',
			tr: 'ein mi, der mi: yeni ve bilinen', ro: 'ein sau der: nou și cunoscut', uz: "ein yoki der: yangi va tanish",
			hi: 'ein या der: नया और जाना-पहचाना', ar: 'ein أم der: الجديد والمعروف'
		},
		points: [
			{
				t: {
					ru: ['Когда ein, когда der', 'ein, eine говорим, когда предмет называем впервые. der, die, das, когда понятно, о каком именно речь.'],
					uk: ['Коли ein, коли der', 'ein, eine кажемо, коли предмет називаємо вперше. der, die, das, коли зрозуміло, про який саме йдеться.'],
					en: ['When ein, when der', 'Use ein, eine when you mention something for the first time. Use der, die, das when it is clear which one.'],
					pl: ['Kiedy ein, kiedy der', 'ein, eine mówimy, gdy nazywamy coś pierwszy raz. der, die, das, gdy wiadomo, o które chodzi.'],
					es: ['Cuándo ein, cuándo der', 'ein, eine cuando nombramos algo por primera vez. der, die, das cuando está claro de cuál se trata.'],
					fr: ['Quand ein, quand der', 'ein, eine quand on nomme une chose pour la première fois. der, die, das quand on sait de laquelle on parle.'],
					tr: ['Ne zaman ein, ne zaman der', 'Bir şeyi ilk kez söylerken ein, eine. Hangisinden bahsedildiği belliyse der, die, das.'],
					ro: ['Când ein, când der', 'ein, eine când numim ceva prima dată. der, die, das când e clar despre care e vorba.'],
					uz: ['Qachon ein, qachon der', "Narsani birinchi marta aytganda ein, eine. Qaysi biri ekani aniq bo'lsa der, die, das."],
					hi: ['कब ein, कब der', 'किसी चीज़ का पहली बार ज़िक्र करते समय ein, eine। जब साफ़ हो कि कौन-सी, तब der, die, das।'],
					ar: ['متى ein ومتى der', 'نقول ein أو eine عندما نذكر الشيء أول مرة. ونقول der أو die أو das عندما يكون معروفاً أيّه.']
				},
				examples: [
					ex('Das ist eine Küche. Die Küche ist groß.', { ru: 'Это кухня. Кухня большая.', uk: 'Це кухня. Кухня велика.', en: 'This is a kitchen. The kitchen is big.', pl: 'To jest kuchnia. Kuchnia jest duża.', es: 'Esto es una cocina. La cocina es grande.', fr: 'C’est une cuisine. La cuisine est grande.', tr: 'Bu bir mutfak. Mutfak büyük.', ro: 'Aceasta este o bucătărie. Bucătăria este mare.', uz: 'Bu oshxona. Oshxona katta.', hi: 'यह एक रसोई है। रसोई बड़ी है।', ar: 'هذا مطبخ. المطبخ كبير.' })
				]
			},
			{
				t: {
					ru: ['Комнаты из двух слов', 'Schlafzimmer = schlafen (спать) + Zimmer (комната). Род у такого слова берётся от последней части: das Zimmer, значит das Schlafzimmer.'],
					uk: ['Кімнати з двох слів', 'Schlafzimmer = schlafen (спати) + Zimmer (кімната). Рід такого слова береться від останньої частини: das Zimmer, отже das Schlafzimmer.'],
					en: ['Rooms made of two words', 'Schlafzimmer = schlafen (to sleep) + Zimmer (room). The gender comes from the last part: das Zimmer, so das Schlafzimmer.'],
					pl: ['Pokoje z dwóch słów', 'Schlafzimmer = schlafen (spać) + Zimmer (pokój). Rodzaj bierze się od ostatniej części: das Zimmer, więc das Schlafzimmer.'],
					es: ['Habitaciones de dos palabras', 'Schlafzimmer = schlafen (dormir) + Zimmer (habitación). El género viene de la última parte: das Zimmer, entonces das Schlafzimmer.'],
					fr: ['Des pièces en deux mots', 'Schlafzimmer = schlafen (dormir) + Zimmer (pièce). Le genre vient de la dernière partie : das Zimmer, donc das Schlafzimmer.'],
					tr: ['İki kelimeli odalar', 'Schlafzimmer = schlafen (uyumak) + Zimmer (oda). Cinsiyet son kelimeden gelir: das Zimmer, yani das Schlafzimmer.'],
					ro: ['Camere din două cuvinte', 'Schlafzimmer = schlafen (a dormi) + Zimmer (cameră). Genul vine de la ultima parte: das Zimmer, deci das Schlafzimmer.'],
					uz: ["Ikki so'zdan iborat xonalar", "Schlafzimmer = schlafen (uxlamoq) + Zimmer (xona). Rod oxirgi qismdan olinadi: das Zimmer, demak das Schlafzimmer."],
					hi: ['दो शब्दों से बने कमरे', 'Schlafzimmer = schlafen (सोना) + Zimmer (कमरा)। लिंग आखिरी हिस्से से आता है: das Zimmer, इसलिए das Schlafzimmer।'],
					ar: ['غرف من كلمتين', 'Schlafzimmer = schlafen (ينام) + Zimmer (غرفة). الجنس يؤخذ من الجزء الأخير: das Zimmer، إذن das Schlafzimmer.']
				},
				examples: [
					ex('das Schlafzimmer, das Badezimmer', { ru: 'спальня, ванная', uk: 'спальня, ванна кімната', en: 'bedroom, bathroom', pl: 'sypialnia, łazienka', es: 'dormitorio, baño', fr: 'chambre, salle de bain', tr: 'yatak odası, banyo', ro: 'dormitor, baie', uz: 'yotoqxona, hammom', hi: 'शयनकक्ष, बाथरूम', ar: 'غرفة النوم، الحمّام' })
				]
			}
		]
	},

	'village-3': {
		title: {
			ru: 'Цвета: когда нужно окончание', uk: 'Кольори: коли потрібне закінчення', en: 'Colours: when to add an ending',
			pl: 'Kolory: kiedy potrzebna końcówka', es: 'Colores: cuándo hace falta terminación', fr: 'Les couleurs : quand ajouter une terminaison',
			tr: 'Renkler: ne zaman ek gerekir', ro: 'Culorile: când e nevoie de terminație', uz: "Ranglar: qachon qo'shimcha kerak",
			hi: 'रंग: अंत कब जुड़ता है', ar: 'الألوان: متى نضيف نهاية'
		},
		points: [
			{
				t: {
					ru: ['После ist: без окончания', 'Если цвет стоит после ist, он не меняется.'],
					uk: ['Після ist: без закінчення', 'Якщо колір стоїть після ist, він не змінюється.'],
					en: ['After ist: no ending', 'When the colour comes after ist, it doesn’t change.'],
					pl: ['Po ist: bez końcówki', 'Gdy kolor stoi po ist, nie zmienia się.'],
					es: ['Después de ist: sin terminación', 'Si el color va después de ist, no cambia.'],
					fr: ['Après ist : pas de terminaison', 'Quand la couleur vient après ist, elle ne change pas.'],
					tr: ['ist’ten sonra: eksiz', 'Renk ist’ten sonra gelirse değişmez.'],
					ro: ['După ist: fără terminație', 'Când culoarea vine după ist, nu se schimbă.'],
					uz: ["ist dan keyin: qo'shimchasiz", "Rang ist dan keyin kelsa, o'zgarmaydi."],
					hi: ['ist के बाद: कोई अंत नहीं', 'रंग ist के बाद आए तो नहीं बदलता।'],
					ar: ['بعد ist: بدون نهاية', 'إذا جاء اللون بعد ist فلا يتغير.']
				},
				examples: [
					ex('Die Lampe ist rot.', { ru: 'Лампа красная.', uk: 'Лампа червона.', en: 'The lamp is red.', pl: 'Lampa jest czerwona.', es: 'La lámpara es roja.', fr: 'La lampe est rouge.', tr: 'Lamba kırmızı.', ro: 'Lampa este roșie.', uz: 'Chiroq qizil.', hi: 'लैंप लाल है।', ar: 'المصباح أحمر.' }),
					ex('Der Tisch ist schwarz.', { ru: 'Стол чёрный.', uk: 'Стіл чорний.', en: 'The table is black.', pl: 'Stół jest czarny.', es: 'La mesa es negra.', fr: 'La table est noire.', tr: 'Masa siyah.', ro: 'Masa este neagră.', uz: 'Stol qora.', hi: 'मेज़ काली है।', ar: 'الطاولة سوداء.' })
				]
			},
			{
				t: {
					ru: ['Перед словом: с окончанием', 'Если цвет стоит перед словом, добавляем окончание. После ein: der-слово получает -er, die-слово -e, das-слово -es.'],
					uk: ['Перед словом: із закінченням', 'Якщо колір стоїть перед словом, додаємо закінчення. Після ein: der-слово отримує -er, die-слово -e, das-слово -es.'],
					en: ['Before the noun: with an ending', 'When the colour comes before the noun, add an ending. After ein: der words take -er, die words -e, das words -es.'],
					pl: ['Przed słowem: z końcówką', 'Gdy kolor stoi przed słowem, dodajemy końcówkę. Po ein: słowo z der dostaje -er, z die -e, z das -es.'],
					es: ['Delante de la palabra: con terminación', 'Si el color va delante del sustantivo, se añade terminación. Después de ein: der lleva -er, die lleva -e, das lleva -es.'],
					fr: ['Devant le nom : avec terminaison', 'Quand la couleur est devant le nom, on ajoute une terminaison. Après ein : mot en der -er, en die -e, en das -es.'],
					tr: ['İsimden önce: ekli', 'Renk isimden önce gelirse ek alır. ein’den sonra: der’li kelime -er, die’li -e, das’lı -es.'],
					ro: ['Înaintea cuvântului: cu terminație', 'Când culoarea stă înaintea cuvântului, adăugăm terminație. După ein: cuvânt cu der -er, cu die -e, cu das -es.'],
					uz: ["So'zdan oldin: qo'shimcha bilan", "Rang so'zdan oldin kelsa, qo'shimcha qo'shiladi. ein dan keyin: der li so'z -er, die li -e, das li -es."],
					hi: ['शब्द से पहले: अंत के साथ', 'रंग संज्ञा से पहले आए तो अंत जुड़ता है। ein के बाद: der वाला -er, die वाला -e, das वाला -es।'],
					ar: ['قبل الاسم: مع نهاية', 'إذا جاء اللون قبل الاسم نضيف نهاية. بعد ein: مع der تكون -er، ومع die تكون -e، ومع das تكون -es.']
				},
				examples: [
					ex('ein schwarzer Tisch', { ru: 'чёрный стол (der)', uk: 'чорний стіл (der)', en: 'a black table (der)', pl: 'czarny stół (der)', es: 'una mesa negra (der)', fr: 'une table noire (der)', tr: 'siyah bir masa (der)', ro: 'o masă neagră (der)', uz: 'qora stol (der)', hi: 'एक काली मेज़ (der)', ar: 'طاولة سوداء (der)' }),
					ex('eine blaue Tasse', { ru: 'синяя чашка (die)', uk: 'синя чашка (die)', en: 'a blue cup (die)', pl: 'niebieska filiżanka (die)', es: 'una taza azul (die)', fr: 'une tasse bleue (die)', tr: 'mavi bir fincan (die)', ro: 'o ceașcă albastră (die)', uz: "ko'k piyola (die)", hi: 'एक नीला कप (die)', ar: 'فنجان أزرق (die)' }),
					ex('ein weißes Fenster', { ru: 'белое окно (das)', uk: 'біле вікно (das)', en: 'a white window (das)', pl: 'białe okno (das)', es: 'una ventana blanca (das)', fr: 'une fenêtre blanche (das)', tr: 'beyaz bir pencere (das)', ro: 'o fereastră albă (das)', uz: 'oq deraza (das)', hi: 'एक सफ़ेद खिड़की (das)', ar: 'نافذة بيضاء (das)' })
				]
			},
			{
				t: {
					ru: ['После der, die, das', 'После определённого артикля окончание проще: почти всегда -e.'],
					uk: ['Після der, die, das', 'Після означеного артикля закінчення простіше: майже завжди -e.'],
					en: ['After der, die, das', 'After der, die, das the ending is simpler: almost always -e.'],
					pl: ['Po der, die, das', 'Po rodzajniku określonym końcówka jest prostsza: prawie zawsze -e.'],
					es: ['Después de der, die, das', 'Después del artículo determinado la terminación es más fácil: casi siempre -e.'],
					fr: ['Après der, die, das', 'Après l’article défini, la terminaison est plus simple : presque toujours -e.'],
					tr: ['der, die, das’tan sonra', 'Belirli artikelden sonra ek daha kolaydır: neredeyse her zaman -e.'],
					ro: ['După der, die, das', 'După articolul hotărât terminația e mai simplă: aproape mereu -e.'],
					uz: ['der, die, das dan keyin', "Aniq artikldan keyin qo'shimcha osonroq: deyarli doim -e."],
					hi: ['der, die, das के बाद', 'निश्चित आर्टिकल के बाद अंत आसान है: लगभग हमेशा -e।'],
					ar: ['بعد der وdie وdas', 'بعد أداة التعريف تكون النهاية أسهل: غالباً -e.']
				},
				examples: [
					ex('das rote Buch', { ru: 'красная книга', uk: 'червона книжка', en: 'the red book', pl: 'czerwona książka', es: 'el libro rojo', fr: 'le livre rouge', tr: 'kırmızı kitap', ro: 'cartea roșie', uz: 'qizil kitob', hi: 'लाल किताब', ar: 'الكتاب الأحمر' })
				]
			}
		]
	},

	'village-4': {
		title: {
			ru: 'Множественное число и kein', uk: 'Множина і kein', en: 'Plural and kein',
			pl: 'Liczba mnoga i kein', es: 'Plural y kein', fr: 'Le pluriel et kein',
			tr: 'Çoğul ve kein', ro: 'Pluralul și kein', uz: "Ko'plik va kein",
			hi: 'बहुवचन और kein', ar: 'الجمع وkein'
		},
		points: [
			{
				t: {
					ru: ['Во множественном всегда die', 'Во множественном числе артикль у всех слов один: die. Окончание у слова разное, его учим вместе со словом.'],
					uk: ['У множині завжди die', 'У множині артикль у всіх слів однаковий: die. Закінчення слова різне, його вчимо разом зі словом.'],
					en: ['Plural is always die', 'In the plural every noun takes die. The plural ending varies, so learn it with the word.'],
					pl: ['W liczbie mnogiej zawsze die', 'W liczbie mnogiej rodzajnik jest jeden dla wszystkich: die. Końcówka słowa bywa różna, uczymy się jej ze słowem.'],
					es: ['En plural siempre die', 'En plural todas las palabras llevan die. La terminación del plural varía, apréndela con la palabra.'],
					fr: ['Au pluriel, toujours die', 'Au pluriel, tous les noms prennent die. La terminaison varie, apprends-la avec le mot.'],
					tr: ['Çoğulda hep die', 'Çoğulda bütün isimlerin artikeli die’dir. Çoğul eki değişir, kelimeyle birlikte öğren.'],
					ro: ['La plural mereu die', 'La plural toate cuvintele au die. Terminația diferă, o învățăm odată cu cuvântul.'],
					uz: ["Ko'plikda doim die", "Ko'plikda barcha so'zlarning artikli die. Ko'plik qo'shimchasi har xil, uni so'z bilan birga o'rgan."],
					hi: ['बहुवचन में हमेशा die', 'बहुवचन में हर संज्ञा के साथ die आता है। बहुवचन का अंत अलग-अलग होता है, इसे शब्द के साथ सीखो।'],
					ar: ['في الجمع دائماً die', 'في الجمع تأخذ كل الأسماء die. أما نهاية الجمع فتختلف، فاحفظها مع الكلمة.']
				},
				examples: [
					ex('das Buch → die Bücher', { ru: 'книга → книги', uk: 'книжка → книжки', en: 'book → books', pl: 'książka → książki', es: 'libro → libros', fr: 'livre → livres', tr: 'kitap → kitaplar', ro: 'carte → cărți', uz: 'kitob → kitoblar', hi: 'किताब → किताबें', ar: 'كتاب → كتب' }),
					ex('der Stuhl → die Stühle', { ru: 'стул → стулья', uk: 'стілець → стільці', en: 'chair → chairs', pl: 'krzesło → krzesła', es: 'silla → sillas', fr: 'chaise → chaises', tr: 'sandalye → sandalyeler', ro: 'scaun → scaune', uz: 'stul → stullar', hi: 'कुर्सी → कुर्सियाँ', ar: 'كرسي → كراسي' }),
					ex('die Tasse → die Tassen', { ru: 'чашка → чашки', uk: 'чашка → чашки', en: 'cup → cups', pl: 'filiżanka → filiżanki', es: 'taza → tazas', fr: 'tasse → tasses', tr: 'fincan → fincanlar', ro: 'ceașcă → cești', uz: 'piyola → piyolalar', hi: 'कप → कप', ar: 'فنجان → فناجين' })
				]
			},
			{
				t: {
					ru: ['Число перед словом', 'После числа слово стоит во множественном числе, без артикля.'],
					uk: ['Число перед словом', 'Після числа слово стоїть у множині, без артикля.'],
					en: ['A number before the noun', 'After a number the noun is plural, with no article.'],
					pl: ['Liczba przed słowem', 'Po liczbie słowo jest w liczbie mnogiej, bez rodzajnika.'],
					es: ['Número delante de la palabra', 'Después de un número la palabra va en plural, sin artículo.'],
					fr: ['Un nombre devant le nom', 'Après un nombre, le nom est au pluriel, sans article.'],
					tr: ['Sayıdan sonra isim', 'Sayıdan sonra isim çoğul olur ve artikel almaz.'],
					ro: ['Numărul înaintea cuvântului', 'După un număr cuvântul e la plural, fără articol.'],
					uz: ["So'zdan oldin son", "Sondan keyin so'z ko'plikda, artiklsiz turadi."],
					hi: ['संज्ञा से पहले संख्या', 'संख्या के बाद संज्ञा बहुवचन में आती है, बिना आर्टिकल के।'],
					ar: ['العدد قبل الاسم', 'بعد العدد يكون الاسم بصيغة الجمع وبدون أداة.']
				},
				examples: [
					ex('drei Stühle', { ru: 'три стула', uk: 'три стільці', en: 'three chairs', pl: 'trzy krzesła', es: 'tres sillas', fr: 'trois chaises', tr: 'üç sandalye', ro: 'trei scaune', uz: 'uchta stul', hi: 'तीन कुर्सियाँ', ar: 'ثلاثة كراسي' })
				]
			},
			{
				t: {
					ru: ['kein: ни одного', 'kein значит «нет никакого». Он меняется как ein: kein Tisch, keine Lampe, во множественном keine Bücher.'],
					uk: ['kein: жодного', 'kein означає «немає жодного». Він змінюється як ein: kein Tisch, keine Lampe, у множині keine Bücher.'],
					en: ['kein: not any', 'kein means "no, not a". It changes like ein: kein Tisch, keine Lampe, plural keine Bücher.'],
					pl: ['kein: żaden', 'kein znaczy „żaden, nie ma”. Odmienia się jak ein: kein Tisch, keine Lampe, w liczbie mnogiej keine Bücher.'],
					es: ['kein: ningún', 'kein significa "ningún, no hay". Cambia como ein: kein Tisch, keine Lampe, en plural keine Bücher.'],
					fr: ['kein : aucun', 'kein veut dire « pas de, aucun ». Il change comme ein : kein Tisch, keine Lampe, au pluriel keine Bücher.'],
					tr: ['kein: hiç', 'kein "hiç ... yok" demektir. ein gibi değişir: kein Tisch, keine Lampe, çoğulda keine Bücher.'],
					ro: ['kein: niciun', 'kein înseamnă „niciun, nu există”. Se schimbă ca ein: kein Tisch, keine Lampe, la plural keine Bücher.'],
					uz: ["kein: hech qanday", "kein \"hech qanday ... yo'q\" degani. U ein kabi o'zgaradi: kein Tisch, keine Lampe, ko'plikda keine Bücher."],
					hi: ['kein: कोई नहीं', 'kein का मतलब "कोई नहीं"। यह ein की तरह बदलता है: kein Tisch, keine Lampe, बहुवचन में keine Bücher।'],
					ar: ['kein: لا يوجد أي', 'kein تعني "لا يوجد أي". وتتغير مثل ein: kein Tisch، keine Lampe، وفي الجمع keine Bücher.']
				},
				examples: [
					ex('Hier sind keine Bücher.', { ru: 'Здесь нет книг.', uk: 'Тут немає книжок.', en: 'There are no books here.', pl: 'Tu nie ma książek.', es: 'Aquí no hay libros.', fr: 'Il n’y a pas de livres ici.', tr: 'Burada hiç kitap yok.', ro: 'Aici nu sunt cărți.', uz: "Bu yerda kitoblar yo'q.", hi: 'यहाँ कोई किताब नहीं है।', ar: 'لا توجد كتب هنا.' })
				]
			}
		]
	},

	'village-5': {
		title: {
			ru: 'ein + прилагательное: -er, -e, -es', uk: 'ein + прикметник: -er, -e, -es', en: 'ein + adjective: -er, -e, -es',
			pl: 'ein + przymiotnik: -er, -e, -es', es: 'ein + adjetivo: -er, -e, -es', fr: 'ein + adjectif : -er, -e, -es',
			tr: 'ein + sıfat: -er, -e, -es', ro: 'ein + adjectiv: -er, -e, -es', uz: 'ein + sifat: -er, -e, -es',
			hi: 'ein + विशेषण: -er, -e, -es', ar: 'ein + صفة: -er و-e و-es'
		},
		points: [
			{
				t: {
					ru: ['Окончание показывает род', 'После ein прилагательное «подсказывает» род: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					uk: ['Закінчення показує рід', 'Після ein прикметник «підказує» рід: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					en: ['The ending shows the gender', 'After ein the adjective shows the gender: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					pl: ['Końcówka pokazuje rodzaj', 'Po ein przymiotnik „podpowiada” rodzaj: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					es: ['La terminación muestra el género', 'Después de ein el adjetivo muestra el género: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					fr: ['La terminaison montre le genre', 'Après ein, l’adjectif montre le genre : der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					tr: ['Ek cinsiyeti gösterir', 'ein’den sonra sıfat cinsiyeti gösterir: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					ro: ['Terminația arată genul', 'După ein adjectivul arată genul: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas.'],
					uz: ["Qo'shimcha rodni ko'rsatadi", "ein dan keyin sifat rodni ko'rsatadi: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas."],
					hi: ['अंत लिंग बताता है', 'ein के बाद विशेषण लिंग बताता है: der Löffel → ein großer Löffel, die Gabel → eine neue Gabel, das Glas → ein kleines Glas।'],
					ar: ['النهاية تُظهر الجنس', 'بعد ein تُظهر الصفة جنس الاسم: der Löffel → ein großer Löffel، die Gabel → eine neue Gabel، das Glas → ein kleines Glas.']
				},
				examples: [
					ex('ein großer Löffel', { ru: 'большая ложка (der)', uk: 'велика ложка (der)', en: 'a big spoon (der)', pl: 'duża łyżka (der)', es: 'una cuchara grande (der)', fr: 'une grande cuillère (der)', tr: 'büyük bir kaşık (der)', ro: 'o lingură mare (der)', uz: 'katta qoshiq (der)', hi: 'एक बड़ा चम्मच (der)', ar: 'ملعقة كبيرة (der)' }),
					ex('eine neue Gabel', { ru: 'новая вилка (die)', uk: 'нова виделка (die)', en: 'a new fork (die)', pl: 'nowy widelec (die)', es: 'un tenedor nuevo (die)', fr: 'une nouvelle fourchette (die)', tr: 'yeni bir çatal (die)', ro: 'o furculiță nouă (die)', uz: 'yangi vilka (die)', hi: 'एक नया काँटा (die)', ar: 'شوكة جديدة (die)' }),
					ex('ein kleines Glas', { ru: 'маленький стакан (das)', uk: 'маленька склянка (das)', en: 'a small glass (das)', pl: 'mała szklanka (das)', es: 'un vaso pequeño (das)', fr: 'un petit verre (das)', tr: 'küçük bir bardak (das)', ro: 'un pahar mic (das)', uz: 'kichkina stakan (das)', hi: 'एक छोटा गिलास (das)', ar: 'كأس صغير (das)' })
				]
			},
			{
				t: {
					ru: ['Подсказка', 'Окончание похоже на конец артикля: der → -er, die → -e, das → -es.'],
					uk: ['Підказка', 'Закінчення схоже на кінець артикля: der → -er, die → -e, das → -es.'],
					en: ['A tip', 'The ending looks like the end of the article: der → -er, die → -e, das → -es.'],
					pl: ['Podpowiedź', 'Końcówka przypomina koniec rodzajnika: der → -er, die → -e, das → -es.'],
					es: ['Un truco', 'La terminación se parece al final del artículo: der → -er, die → -e, das → -es.'],
					fr: ['Une astuce', 'La terminaison ressemble à la fin de l’article : der → -er, die → -e, das → -es.'],
					tr: ['İpucu', 'Ek, artikelin sonuna benzer: der → -er, die → -e, das → -es.'],
					ro: ['Un truc', 'Terminația seamănă cu finalul articolului: der → -er, die → -e, das → -es.'],
					uz: ['Maslahat', "Qo'shimcha artiklning oxiriga o'xshaydi: der → -er, die → -e, das → -es."],
					hi: ['एक संकेत', 'अंत आर्टिकल के आखिरी हिस्से जैसा होता है: der → -er, die → -e, das → -es।'],
					ar: ['تلميح', 'النهاية تشبه آخر الأداة: der → -er، die → -e، das → -es.']
				},
				examples: []
			}
		]
	},

	'village-6': {
		title: {
			ru: 'Описываем комнату', uk: 'Описуємо кімнату', en: 'Describing a room',
			pl: 'Opisujemy pokój', es: 'Describimos una habitación', fr: 'Décrire une pièce',
			tr: 'Odayı anlatıyoruz', ro: 'Descriem camera', uz: 'Xonani tasvirlaymiz',
			hi: 'कमरे का वर्णन', ar: 'نصف الغرفة'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Повторяем окончания после ein: der-слово -er, das-слово -es. Das ist... значит «это».'],
					uk: ['Нових правил немає', 'Повторюємо закінчення після ein: der-слово -er, das-слово -es. Das ist... означає «це».'],
					en: ['No new rules', 'Review the endings after ein: der words -er, das words -es. Das ist... means "this is".'],
					pl: ['Bez nowych reguł', 'Powtarzamy końcówki po ein: słowo z der -er, z das -es. Das ist... znaczy „to jest”.'],
					es: ['Sin reglas nuevas', 'Repasamos las terminaciones después de ein: der -er, das -es. Das ist... significa "esto es".'],
					fr: ['Pas de nouvelle règle', 'On révise les terminaisons après ein : mot en der -er, en das -es. Das ist... veut dire « c’est ».'],
					tr: ['Yeni kural yok', 'ein’den sonraki ekleri tekrar ediyoruz: der’li -er, das’lı -es. Das ist... "bu" demektir.'],
					ro: ['Fără reguli noi', 'Recapitulăm terminațiile după ein: cuvânt cu der -er, cu das -es. Das ist... înseamnă „acesta este”.'],
					uz: ["Yangi qoida yo'q", "ein dan keyingi qo'shimchalarni takrorlaymiz: der li -er, das li -es. Das ist... \"bu\" degani."],
					hi: ['कोई नया नियम नहीं', 'ein के बाद के अंत दोहराते हैं: der वाला -er, das वाला -es। Das ist... का मतलब "यह है"।'],
					ar: ['لا قواعد جديدة', 'نراجع النهايات بعد ein: مع der تكون -er، ومع das تكون -es. وDas ist... تعني "هذا".']
				},
				examples: [
					ex('ein großer Teppich', { ru: 'большой ковёр', uk: 'великий килим', en: 'a big carpet', pl: 'duży dywan', es: 'una alfombra grande', fr: 'un grand tapis', tr: 'büyük bir halı', ro: 'un covor mare', uz: 'katta gilam', hi: 'एक बड़ा कालीन', ar: 'سجادة كبيرة' }),
					ex('Das ist ein neues Sofa.', { ru: 'Это новый диван.', uk: 'Це новий диван.', en: 'This is a new sofa.', pl: 'To jest nowa kanapa.', es: 'Esto es un sofá nuevo.', fr: 'C’est un nouveau canapé.', tr: 'Bu yeni bir kanepe.', ro: 'Aceasta este o canapea nouă.', uz: 'Bu yangi divan.', hi: 'यह एक नया सोफ़ा है।', ar: 'هذه أريكة جديدة.' })
				]
			}
		]
	},

	'village-7': {
		title: {
			ru: 'Множественное с умлаутом', uk: 'Множина з умлаутом', en: 'Plural with an umlaut',
			pl: 'Liczba mnoga z umlautem', es: 'Plural con diéresis', fr: 'Pluriel avec umlaut',
			tr: 'Umlautlu çoğul', ro: 'Plural cu umlaut', uz: "Umlautli ko'plik",
			hi: 'उमलाउट वाला बहुवचन', ar: 'الجمع مع الأوملاوت'
		},
		points: [
			{
				t: {
					ru: ['Буква меняется', 'Во множественном a, o, u часто превращаются в ä, ö, ü: das Handtuch → die Handtücher.'],
					uk: ['Літера змінюється', 'У множині a, o, u часто стають ä, ö, ü: das Handtuch → die Handtücher.'],
					en: ['The vowel changes', 'In the plural a, o, u often become ä, ö, ü: das Handtuch → die Handtücher.'],
					pl: ['Litera się zmienia', 'W liczbie mnogiej a, o, u często zmieniają się w ä, ö, ü: das Handtuch → die Handtücher.'],
					es: ['La vocal cambia', 'En plural a, o, u a menudo pasan a ä, ö, ü: das Handtuch → die Handtücher.'],
					fr: ['La voyelle change', 'Au pluriel, a, o, u deviennent souvent ä, ö, ü : das Handtuch → die Handtücher.'],
					tr: ['Harf değişir', 'Çoğulda a, o, u çoğu zaman ä, ö, ü olur: das Handtuch → die Handtücher.'],
					ro: ['Litera se schimbă', 'La plural a, o, u devin des ä, ö, ü: das Handtuch → die Handtücher.'],
					uz: ["Harf o'zgaradi", "Ko'plikda a, o, u ko'pincha ä, ö, ü ga aylanadi: das Handtuch → die Handtücher."],
					hi: ['स्वर बदलता है', 'बहुवचन में a, o, u अक्सर ä, ö, ü बन जाते हैं: das Handtuch → die Handtücher।'],
					ar: ['يتغير الحرف', 'في الجمع تتحول a وo وu غالباً إلى ä وö وü: das Handtuch → die Handtücher.']
				},
				examples: [
					ex('zwei Handtücher', { ru: 'два полотенца', uk: 'два рушники', en: 'two towels', pl: 'dwa ręczniki', es: 'dos toallas', fr: 'deux serviettes', tr: 'iki havlu', ro: 'două prosoape', uz: 'ikkita sochiq', hi: 'दो तौलिए', ar: 'منشفتان' })
				]
			},
			{
				t: {
					ru: ['Каким бывает предмет', 'Качество говорим через ist, без окончания.'],
					uk: ['Яким буває предмет', 'Якість кажемо через ist, без закінчення.'],
					en: ['What a thing is like', 'Say the quality with ist, no ending.'],
					pl: ['Jaki jest przedmiot', 'Cechę podajemy przez ist, bez końcówki.'],
					es: ['Cómo es la cosa', 'La cualidad se dice con ist, sin terminación.'],
					fr: ['Comment est l’objet', 'On dit la qualité avec ist, sans terminaison.'],
					tr: ['Eşya nasıl', 'Özellik ist ile, eksiz söylenir.'],
					ro: ['Cum este obiectul', 'Calitatea o spunem cu ist, fără terminație.'],
					uz: ['Narsa qanday', "Sifat ist bilan, qo'shimchasiz aytiladi."],
					hi: ['चीज़ कैसी है', 'गुण ist के साथ, बिना अंत के बताते हैं।'],
					ar: ['كيف هو الشيء', 'نقول الصفة مع ist وبدون نهاية.']
				},
				examples: [
					ex('Das Handtuch ist sauber.', { ru: 'Полотенце чистое.', uk: 'Рушник чистий.', en: 'The towel is clean.', pl: 'Ręcznik jest czysty.', es: 'La toalla está limpia.', fr: 'La serviette est propre.', tr: 'Havlu temiz.', ro: 'Prosopul este curat.', uz: 'Sochiq toza.', hi: 'तौलिया साफ़ है।', ar: 'المنشفة نظيفة.' })
				]
			}
		]
	},

	'village-8': {
		title: {
			ru: 'В спальне: описания', uk: 'У спальні: описи', en: 'In the bedroom: descriptions',
			pl: 'W sypialni: opisy', es: 'En el dormitorio: descripciones', fr: 'Dans la chambre : descriptions',
			tr: 'Yatak odasında: tarifler', ro: 'În dormitor: descrieri', uz: 'Yotoqxonada: tasvirlar',
			hi: 'शयनकक्ष में: वर्णन', ar: 'في غرفة النوم: الوصف'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Повторяем: после ein окончание -er, -e или -es. Некоторые слова почти всегда во множественном: die Vorhänge.'],
					uk: ['Нових правил немає', 'Повторюємо: після ein закінчення -er, -e або -es. Деякі слова майже завжди в множині: die Vorhänge.'],
					en: ['No new rules', 'Review: after ein the ending is -er, -e or -es. Some words are almost always plural: die Vorhänge.'],
					pl: ['Bez nowych reguł', 'Powtarzamy: po ein końcówka -er, -e albo -es. Niektóre słowa są prawie zawsze w liczbie mnogiej: die Vorhänge.'],
					es: ['Sin reglas nuevas', 'Repaso: después de ein la terminación es -er, -e o -es. Algunas palabras casi siempre van en plural: die Vorhänge.'],
					fr: ['Pas de nouvelle règle', 'Révision : après ein, la terminaison est -er, -e ou -es. Certains mots sont presque toujours au pluriel : die Vorhänge.'],
					tr: ['Yeni kural yok', 'Tekrar: ein’den sonra ek -er, -e ya da -es. Bazı kelimeler neredeyse hep çoğuldur: die Vorhänge.'],
					ro: ['Fără reguli noi', 'Recapitulăm: după ein terminația este -er, -e sau -es. Unele cuvinte sunt aproape mereu la plural: die Vorhänge.'],
					uz: ["Yangi qoida yo'q", "Takrorlaymiz: ein dan keyin -er, -e yoki -es. Ba'zi so'zlar deyarli doim ko'plikda: die Vorhänge."],
					hi: ['कोई नया नियम नहीं', 'दोहराव: ein के बाद अंत -er, -e या -es। कुछ शब्द लगभग हमेशा बहुवचन में होते हैं: die Vorhänge।'],
					ar: ['لا قواعد جديدة', 'مراجعة: بعد ein تكون النهاية -er أو -e أو -es. وبعض الكلمات تأتي غالباً بصيغة الجمع: die Vorhänge.']
				},
				examples: [
					ex('ein weiches Kissen', { ru: 'мягкая подушка (das)', uk: "м'яка подушка (das)", en: 'a soft pillow (das)', pl: 'miękka poduszka (das)', es: 'una almohada blanda (das)', fr: 'un oreiller moelleux (das)', tr: 'yumuşak bir yastık (das)', ro: 'o pernă moale (das)', uz: 'yumshoq yostiq (das)', hi: 'एक मुलायम तकिया (das)', ar: 'وسادة ناعمة (das)' }),
					ex('Die Vorhänge sind blau.', { ru: 'Шторы синие.', uk: 'Штори сині.', en: 'The curtains are blue.', pl: 'Zasłony są niebieskie.', es: 'Las cortinas son azules.', fr: 'Les rideaux sont bleus.', tr: 'Perdeler mavi.', ro: 'Perdelele sunt albastre.', uz: "Pardalar ko'k.", hi: 'परदे नीले हैं।', ar: 'الستائر زرقاء.' })
				]
			}
		]
	},

	'village-9': {
		title: {
			ru: 'В прихожей: вещи', uk: 'У передпокої: речі', en: 'In the hallway: things',
			pl: 'W przedpokoju: rzeczy', es: 'En la entrada: cosas', fr: 'Dans l’entrée : les affaires',
			tr: 'Antrede: eşyalar', ro: 'În hol: lucruri', uz: "Dahlizda: buyumlar",
			hi: 'गलियारे में: चीज़ें', ar: 'في المدخل: الأغراض'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Обувь по-немецки обычно во множественном: die Schuhe, а глагол тогда sind.'],
					uk: ['Нових правил немає', 'Взуття німецькою зазвичай у множині: die Schuhe, а дієслово тоді sind.'],
					en: ['No new rules', 'Shoes are usually plural: die Schuhe, and then the verb is sind.'],
					pl: ['Bez nowych reguł', 'Buty po niemiecku zwykle są w liczbie mnogiej: die Schuhe, a czasownik wtedy sind.'],
					es: ['Sin reglas nuevas', 'Los zapatos suelen ir en plural: die Schuhe, y entonces el verbo es sind.'],
					fr: ['Pas de nouvelle règle', 'Les chaussures sont en général au pluriel : die Schuhe, et le verbe est alors sind.'],
					tr: ['Yeni kural yok', 'Ayakkabı genelde çoğuldur: die Schuhe, o zaman fiil sind olur.'],
					ro: ['Fără reguli noi', 'Pantofii sunt de obicei la plural: die Schuhe, iar verbul atunci este sind.'],
					uz: ["Yangi qoida yo'q", "Poyabzal odatda ko'plikda: die Schuhe, unda fe'l sind bo'ladi."],
					hi: ['कोई नया नियम नहीं', 'जूते आमतौर पर बहुवचन में होते हैं: die Schuhe, तब क्रिया sind होती है।'],
					ar: ['لا قواعد جديدة', 'الأحذية تأتي عادة بصيغة الجمع: die Schuhe، وعندها يكون الفعل sind.']
				},
				examples: [
					ex('Die Schuhe sind neu.', { ru: 'Обувь новая.', uk: 'Взуття нове.', en: 'The shoes are new.', pl: 'Buty są nowe.', es: 'Los zapatos son nuevos.', fr: 'Les chaussures sont neuves.', tr: 'Ayakkabılar yeni.', ro: 'Pantofii sunt noi.', uz: 'Poyabzal yangi.', hi: 'जूते नए हैं।', ar: 'الحذاء جديد.' }),
					ex('Das ist eine Tasche.', { ru: 'Это сумка.', uk: 'Це сумка.', en: 'This is a bag.', pl: 'To jest torba.', es: 'Esto es un bolso.', fr: 'C’est un sac.', tr: 'Bu bir çanta.', ro: 'Aceasta este o geantă.', uz: 'Bu sumka.', hi: 'यह एक थैला है।', ar: 'هذه حقيبة.' })
				]
			}
		]
	},

	'village-10': {
		title: {
			ru: 'В саду: цвет и количество', uk: 'У саду: колір і кількість', en: 'In the garden: colour and number',
			pl: 'W ogrodzie: kolor i liczba', es: 'En el jardín: color y cantidad', fr: 'Au jardin : couleur et nombre',
			tr: 'Bahçede: renk ve sayı', ro: 'În grădină: culoare și număr', uz: "Bog'da: rang va son",
			hi: 'बगीचे में: रंग और संख्या', ar: 'في الحديقة: اللون والعدد'
		},
		points: [
			{
				t: {
					ru: ['Множественное по-разному', 'Окончание множественного числа у каждого слова своё: der Baum → die Bäume, die Blume → die Blumen.'],
					uk: ['Множина по-різному', 'Закінчення множини в кожного слова своє: der Baum → die Bäume, die Blume → die Blumen.'],
					en: ['Different plurals', 'Each word has its own plural: der Baum → die Bäume, die Blume → die Blumen.'],
					pl: ['Różne liczby mnogie', 'Każde słowo ma swoją liczbę mnogą: der Baum → die Bäume, die Blume → die Blumen.'],
					es: ['Plurales distintos', 'Cada palabra tiene su plural: der Baum → die Bäume, die Blume → die Blumen.'],
					fr: ['Des pluriels différents', 'Chaque mot a son pluriel : der Baum → die Bäume, die Blume → die Blumen.'],
					tr: ['Farklı çoğullar', 'Her kelimenin kendi çoğulu var: der Baum → die Bäume, die Blume → die Blumen.'],
					ro: ['Pluraluri diferite', 'Fiecare cuvânt are pluralul lui: der Baum → die Bäume, die Blume → die Blumen.'],
					uz: ["Har xil ko'plik", "Har bir so'zning o'z ko'pligi bor: der Baum → die Bäume, die Blume → die Blumen."],
					hi: ['अलग-अलग बहुवचन', 'हर शब्द का अपना बहुवचन होता है: der Baum → die Bäume, die Blume → die Blumen।'],
					ar: ['جموع مختلفة', 'لكل كلمة جمعها: der Baum → die Bäume، die Blume → die Blumen.']
				},
				examples: [
					ex('zwei Bäume', { ru: 'два дерева', uk: 'два дерева', en: 'two trees', pl: 'dwa drzewa', es: 'dos árboles', fr: 'deux arbres', tr: 'iki ağaç', ro: 'doi copaci', uz: 'ikkita daraxt', hi: 'दो पेड़', ar: 'شجرتان' })
				]
			},
			{
				t: {
					ru: ['Цвет перед словом', 'Как раньше: после ein окончание зависит от рода.'],
					uk: ['Колір перед словом', 'Як і раніше: після ein закінчення залежить від роду.'],
					en: ['Colour before the noun', 'As before: after ein the ending depends on the gender.'],
					pl: ['Kolor przed słowem', 'Jak wcześniej: po ein końcówka zależy od rodzaju.'],
					es: ['Color delante de la palabra', 'Como antes: después de ein la terminación depende del género.'],
					fr: ['La couleur devant le nom', 'Comme avant : après ein, la terminaison dépend du genre.'],
					tr: ['İsimden önce renk', 'Önceki gibi: ein’den sonra ek cinsiyete bağlıdır.'],
					ro: ['Culoarea înaintea cuvântului', 'Ca înainte: după ein terminația depinde de gen.'],
					uz: ["So'zdan oldin rang", "Avvalgidek: ein dan keyin qo'shimcha rodga bog'liq."],
					hi: ['संज्ञा से पहले रंग', 'पहले की तरह: ein के बाद अंत लिंग पर निर्भर करता है।'],
					ar: ['اللون قبل الاسم', 'كما سبق: بعد ein تعتمد النهاية على الجنس.']
				},
				examples: [
					ex('eine rote Blume', { ru: 'красный цветок (die)', uk: 'червона квітка (die)', en: 'a red flower (die)', pl: 'czerwony kwiat (die)', es: 'una flor roja (die)', fr: 'une fleur rouge (die)', tr: 'kırmızı bir çiçek (die)', ro: 'o floare roșie (die)', uz: 'qizil gul (die)', hi: 'एक लाल फूल (die)', ar: 'زهرة حمراء (die)' }),
					ex('ein großer Baum', { ru: 'большое дерево (der)', uk: 'велике дерево (der)', en: 'a big tree (der)', pl: 'duże drzewo (der)', es: 'un árbol grande (der)', fr: 'un grand arbre (der)', tr: 'büyük bir ağaç (der)', ro: 'un copac mare (der)', uz: 'katta daraxt (der)', hi: 'एक बड़ा पेड़ (der)', ar: 'شجرة كبيرة (der)' })
				]
			}
		]
	}
}

module.exports = quests
