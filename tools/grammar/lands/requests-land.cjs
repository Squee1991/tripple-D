// Грамматика к заданиям земли requests-land (Imperativ и вежливые просьбы)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const duPoint = pt(['Просьба на du', 'Прохання на du', 'Request with du', 'Prośba na du', 'Petición con du', 'Demande avec du', 'du ile rica', 'Rugăminte cu du', 'du bilan iltimos', 'du के साथ अनुरोध', 'الطلب بصيغة du'], [
	'Берём форму du без -st и без du: du kommst → Komm! Если гласная меняется e → i, она остаётся: nimm, gib, hilf, lies, iss, sprich. Особая форма: Sei!',
	'Беремо форму du без -st і без du: du kommst → Komm! Якщо голосна змінюється e → i, вона лишається: nimm, gib, hilf, lies, iss, sprich. Особлива форма: Sei!',
	'Take the du form without -st and without du: du kommst → Komm! If the vowel changes e → i, it stays: nimm, gib, hilf, lies, iss, sprich. Special form: Sei!',
	'Bierzemy formę du bez -st i bez du: du kommst → Komm! Jeśli samogłoska zmienia się e → i, zostaje: nimm, gib, hilf, lies, iss, sprich. Forma szczególna: Sei!',
	'Se toma la forma de du sin -st y sin du: du kommst → Komm! Si la vocal cambia e → i, se mantiene: nimm, gib, hilf, lies, iss, sprich. Forma especial: Sei!',
	'On prend la forme de du sans -st et sans du : du kommst → Komm ! Si la voyelle change e → i, elle reste : nimm, gib, hilf, lies, iss, sprich. Forme spéciale : Sei !',
	'du biçimini -st ve du olmadan al: du kommst → Komm! Ünlü e → i değişiyorsa kalır: nimm, gib, hilf, lies, iss, sprich. Özel biçim: Sei!',
	'Iei forma de la du fără -st și fără du: du kommst → Komm! Dacă vocala se schimbă e → i, rămâne: nimm, gib, hilf, lies, iss, sprich. Formă specială: Sei!',
	"du shaklini -st va du siz olamiz: du kommst → Komm! Unli e → i o'zgarsa, saqlanadi: nimm, gib, hilf, lies, iss, sprich. Alohida shakl: Sei!",
	'du वाला रूप बिना -st और बिना du: du kommst → Komm! अगर स्वर e → i बदलता है, तो वैसा ही रहता है: nimm, gib, hilf, lies, iss, sprich। खास रूप: Sei!',
	'نأخذ صيغة du بدون -st وبدون du: du kommst → Komm! وإذا تغير الحرف e → i يبقى: nimm، gib، hilf، lies، iss، sprich. والصيغة الخاصة: Sei!'
], [
	ex('Sprich langsamer!', t11('Говори медленнее!', 'Говори повільніше!', 'Speak more slowly!', 'Mów wolniej!', '¡Habla más despacio!', 'Parle plus lentement !', 'Daha yavaş konuş!', 'Vorbește mai rar!', 'Sekinroq gapir!', 'धीरे बोलो!', 'تكلم ببطء أكثر!')),
	ex('Lies den Text!', t11('Прочитай текст!', 'Прочитай текст!', 'Read the text!', 'Przeczytaj tekst!', '¡Lee el texto!', 'Lis le texte !', 'Metni oku!', 'Citește textul!', "Matnni o'qi!", 'पाठ पढ़ो!', 'اقرأ النص!'))
])

const ihrPoint = pt(['Просьба к нескольким друзьям', 'Прохання до кількох друзів', 'Request to several friends', 'Prośba do kilku przyjaciół', 'Petición a varios amigos', 'Demande à plusieurs amis', 'Birkaç arkadaşa rica', 'Rugăminte către mai mulți prieteni', "Bir nechta do'stga iltimos", 'कई दोस्तों से अनुरोध', 'الطلب من عدة أصدقاء'], [
	'Форма ihr без ihr: ihr kommt → Kommt! ihr esst → Esst! Особая форма: Seid!',
	'Форма ihr без ihr: ihr kommt → Kommt! ihr esst → Esst! Особлива форма: Seid!',
	'The ihr form without ihr: ihr kommt → Kommt! ihr esst → Esst! Special form: Seid!',
	'Forma ihr bez ihr: ihr kommt → Kommt! ihr esst → Esst! Forma szczególna: Seid!',
	'La forma de ihr sin ihr: ihr kommt → Kommt! ihr esst → Esst! Forma especial: Seid!',
	'La forme de ihr sans ihr : ihr kommt → Kommt ! ihr esst → Esst ! Forme spéciale : Seid !',
	'ihr biçimi ihr olmadan: ihr kommt → Kommt! ihr esst → Esst! Özel biçim: Seid!',
	'Forma de la ihr fără ihr: ihr kommt → Kommt! ihr esst → Esst! Formă specială: Seid!',
	"ihr shakli ihr siz: ihr kommt → Kommt! ihr esst → Esst! Alohida shakl: Seid!",
	'ihr वाला रूप बिना ihr: ihr kommt → Kommt! ihr esst → Esst! खास रूप: Seid!',
	'صيغة ihr بدون ihr: ihr kommt → Kommt! ihr esst → Esst! والصيغة الخاصة: Seid!'
], [ex('Nehmt Regenschirme mit!', t11('Возьмите зонты!', 'Візьміть парасольки!', 'Take umbrellas with you!', 'Weźcie parasole!', '¡Llevad paraguas!', 'Prenez des parapluies !', 'Şemsiye alın!', 'Luați umbrele!', 'Soyabon olib olinglar!', 'छाते ले लो!', 'خذوا مظلات!'))])

const siePoint = pt(['Вежливая просьба на Sie', 'Ввічливе прохання на Sie', 'Polite request with Sie', 'Grzeczna prośba na Sie', 'Petición de usted', 'Demande polie avec Sie', 'Sie ile kibar rica', 'Rugăminte politicoasă cu Sie', 'Sie bilan muloyim iltimos', 'Sie के साथ विनम्र अनुरोध', 'الطلب المهذب بصيغة Sie'], [
	'Глагол первым, потом Sie: Kommen Sie! Warten Sie! Особая форма: Seien Sie!',
	'Дієслово першим, потім Sie: Kommen Sie! Warten Sie! Особлива форма: Seien Sie!',
	'Verb first, then Sie: Kommen Sie! Warten Sie! Special form: Seien Sie!',
	'Czasownik pierwszy, potem Sie: Kommen Sie! Warten Sie! Forma szczególna: Seien Sie!',
	'Primero el verbo, luego Sie: Kommen Sie! Warten Sie! Forma especial: Seien Sie!',
	'Le verbe d’abord, puis Sie : Kommen Sie ! Warten Sie ! Forme spéciale : Seien Sie !',
	'Önce fiil, sonra Sie: Kommen Sie! Warten Sie! Özel biçim: Seien Sie!',
	'Întâi verbul, apoi Sie: Kommen Sie! Warten Sie! Formă specială: Seien Sie!',
	"Avval fe'l, keyin Sie: Kommen Sie! Warten Sie! Alohida shakl: Seien Sie!",
	'पहले क्रिया, फिर Sie: Kommen Sie! Warten Sie! खास रूप: Seien Sie!',
	'الفعل أولاً ثم Sie: Kommen Sie! Warten Sie! والصيغة الخاصة: Seien Sie!'
], [ex('Kommen Sie bitte herein!', t11('Проходите, пожалуйста!', 'Заходьте, будь ласка!', 'Please come in!', 'Proszę wejść!', '¡Pase, por favor!', 'Entrez, je vous prie !', 'Buyurun, girin!', 'Intrați, vă rog!', 'Marhamat, kiring!', 'कृपया अंदर आइए!', 'تفضل بالدخول!'))])

const prefixPoint = pt(['Приставка в конце, bitte и mal', 'Префікс у кінці, bitte і mal', 'Prefix at the end, bitte and mal', 'Przedrostek na końcu, bitte i mal', 'Prefijo al final, bitte y mal', 'Préfixe à la fin, bitte et mal', 'Ön ek sonda, bitte ve mal', 'Prefixul la final, bitte și mal', "Old qo'shimcha oxirida, bitte va mal", 'उपसर्ग अंत में, bitte और mal', 'السابقة في الآخر، bitte وmal'], [
	'В просьбе приставка уходит в конец: Mach die Tür auf! Слова bitte и mal делают просьбу мягче.',
	'У проханні префікс іде в кінець: Mach die Tür auf! Слова bitte і mal роблять прохання м’якшим.',
	'In a request the prefix goes to the end: Mach die Tür auf! bitte and mal make it softer.',
	'W prośbie przedrostek idzie na koniec: Mach die Tür auf! Słowa bitte i mal łagodzą prośbę.',
	'En la petición el prefijo va al final: Mach die Tür auf! bitte y mal la suavizan.',
	'Dans une demande, le préfixe va à la fin : Mach die Tür auf ! bitte et mal adoucissent la demande.',
	'Ricada ön ek sona gider: Mach die Tür auf! bitte ve mal ricayı yumuşatır.',
	'În rugăminte prefixul merge la final: Mach die Tür auf! bitte și mal o fac mai blândă.',
	"Iltimosda old qo'shimcha oxiriga o'tadi: Mach die Tür auf! bitte va mal iltimosni yumshatadi.",
	'अनुरोध में उपसर्ग अंत में जाता है: Mach die Tür auf! bitte और mal अनुरोध को नरम बनाते हैं।',
	'في الطلب تذهب السابقة إلى الآخر: Mach die Tür auf! وتجعل bitte وmal الطلب ألطف.'
], [ex('Mach bitte das Licht an!', t11('Включи, пожалуйста, свет!', 'Увімкни, будь ласка, світло!', 'Please turn on the light!', 'Włącz proszę światło!', '¡Enciende la luz, por favor!', 'Allume la lumière, s’il te plaît !', 'Lütfen ışığı aç!', 'Aprinde lumina, te rog!', 'Iltimos, chiroqni yoq!', 'कृपया बत्ती जला दो!', 'أشعل الضوء من فضلك!'))])

const questionPoint = pt(['Просьба вопросом', 'Прохання питанням', 'A request as a question', 'Prośba pytaniem', 'Petición con pregunta', 'Demande sous forme de question', 'Soru şeklinde rica', 'Rugăminte sub formă de întrebare', "Savol shaklida iltimos", 'सवाल के रूप में अनुरोध', 'الطلب بصيغة سؤال'], [
	'Kannst du ...? Können Sie ...? Ещё вежливее: Könntest du ...? Könnten Sie ...? (не мог бы ты, не могли бы вы). Второй глагол в конце.',
	'Kannst du ...? Können Sie ...? Ще ввічливіше: Könntest du ...? Könnten Sie ...? (чи не міг би ти, чи не могли б ви). Друге дієслово в кінці.',
	'Kannst du ...? Können Sie ...? Even more polite: Könntest du ...? Könnten Sie ...? (could you). The second verb goes to the end.',
	'Kannst du ...? Können Sie ...? Jeszcze grzeczniej: Könntest du ...? Könnten Sie ...? (czy mógłbyś, czy mógłby pan). Drugi czasownik na końcu.',
	'Kannst du ...? Können Sie ...? Más educado: Könntest du ...? Könnten Sie ...? (¿podrías, podría usted?). El segundo verbo va al final.',
	'Kannst du ... ? Können Sie ... ? Encore plus poli : Könntest du ... ? Könnten Sie ... ? (pourrais-tu, pourriez-vous). Le deuxième verbe va à la fin.',
	'Kannst du ...? Können Sie ...? Daha kibar: Könntest du ...? Könnten Sie ...? (... yapabilir misin/misiniz acaba). İkinci fiil sonda.',
	'Kannst du ...? Können Sie ...? Și mai politicos: Könntest du ...? Könnten Sie ...? (ai putea, ați putea). Al doilea verb la final.',
	"Kannst du ...? Können Sie ...? Yanada muloyim: Könntest du ...? Könnten Sie ...? (... qila olmaysizmi). Ikkinchi fe'l oxirida.",
	'Kannst du ...? Können Sie ...? और विनम्र: Könntest du ...? Könnten Sie ...? (क्या तुम/आप ... सकेंगे)। दूसरी क्रिया अंत में।',
	'Kannst du ...؟ Können Sie ...؟ وأكثر أدباً: Könntest du ...؟ Könnten Sie ...؟ (هل يمكنك من فضلك). والفعل الثاني في الآخر.'
], [
	ex('Können Sie das wiederholen?', t11('Вы можете это повторить?', 'Ви можете це повторити?', 'Can you repeat that?', 'Może pan to powtórzyć?', '¿Puede repetirlo?', 'Vous pouvez répéter ?', 'Tekrar edebilir misiniz?', 'Puteți repeta?', 'Buni qaytara olasizmi?', 'क्या आप यह दोहरा सकते हैं?', 'هل يمكنك أن تعيد ذلك؟')),
	ex('Könnten Sie das Fenster öffnen?', t11('Не могли бы вы открыть окно?', 'Чи не могли б ви відчинити вікно?', 'Could you open the window?', 'Czy mógłby pan otworzyć okno?', '¿Podría abrir la ventana?', 'Pourriez-vous ouvrir la fenêtre ?', 'Pencereyi açabilir misiniz acaba?', 'Ați putea deschide fereastra?', 'Derazani ocha olmaysizmi?', 'क्या आप खिड़की खोल सकेंगे?', 'هل يمكنك فتح النافذة من فضلك؟'))
])

const orderPoint = pt(['Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern', 'Ich hätte gern'], [
	'Вежливый заказ: Ich möchte ... или Ich hätte gern ... Это готовые фразы, после них Akkusativ.',
	'Ввічливе замовлення: Ich möchte ... або Ich hätte gern ... Це готові фрази, після них Akkusativ.',
	'Polite ordering: Ich möchte ... or Ich hätte gern ... These are set phrases followed by the accusative.',
	'Grzeczne zamówienie: Ich möchte ... albo Ich hätte gern ... To gotowe zwroty, po nich Akkusativ.',
	'Pedido educado: Ich möchte ... o Ich hätte gern ... Son frases hechas, seguidas de acusativo.',
	'Commande polie : Ich möchte ... ou Ich hätte gern ... Ce sont des expressions toutes faites, suivies de l’accusatif.',
	'Kibar sipariş: Ich möchte ... ya da Ich hätte gern ... Kalıp ifadeler, ardından Akkusativ.',
	'Comandă politicoasă: Ich möchte ... sau Ich hätte gern ... Sunt expresii fixe, urmate de acuzativ.',
	"Muloyim buyurtma: Ich möchte ... yoki Ich hätte gern ... Bu tayyor iboralar, ulardan keyin Akkusativ.",
	'विनम्र ऑर्डर: Ich möchte ... या Ich hätte gern ... ये तैयार वाक्यांश हैं, इनके बाद Akkusativ।',
	'طلب مهذب: Ich möchte ... أو Ich hätte gern ... وهما عبارتان جاهزتان يليهما المفعول.'
], [ex('Ich hätte gern einen Tee.', t11('Мне, пожалуйста, чай.', 'Мені, будь ласка, чай.', 'I’d like a tea, please.', 'Poproszę herbatę.', 'Me gustaría un té.', 'Je voudrais un thé.', 'Bir çay alabilir miyim?', 'Aș dori un ceai.', 'Menga choy, iltimos.', 'मुझे एक चाय चाहिए।', 'أودّ شاياً.'))])

const quests = {
	'requests-1': { title: t11('Просьба на «ты»', 'Прохання на «ти»', 'Requests with du', 'Prośba na „ty”', 'Peticiones con du', 'Demandes avec du', 'du ile rica', 'Rugăminți cu du', 'du bilan iltimos', 'du के साथ अनुरोध', 'الطلب بصيغة du'), points: [duPoint] },
	'requests-2': { title: t11('Просьба к друзьям', 'Прохання до друзів', 'Requests to friends', 'Prośba do przyjaciół', 'Peticiones a amigos', 'Demandes à des amis', 'Arkadaşlara rica', 'Rugăminți către prieteni', "Do'stlarga iltimos", 'दोस्तों से अनुरोध', 'الطلب من الأصدقاء'), points: [ihrPoint] },
	'requests-3': { title: t11('Вежливая просьба', 'Ввічливе прохання', 'Polite requests', 'Grzeczna prośba', 'Peticiones educadas', 'Demandes polies', 'Kibar rica', 'Rugăminți politicoase', 'Muloyim iltimos', 'विनम्र अनुरोध', 'الطلب المهذب'), points: [siePoint] },
	'requests-4': { title: t11('Просьбы с приставками', 'Прохання з префіксами', 'Requests with prefixes', 'Prośby z przedrostkami', 'Peticiones con prefijos', 'Demandes avec préfixes', 'Ön ekli ricalar', 'Rugăminți cu prefixe', "Old qo'shimchali iltimoslar", 'उपसर्ग वाले अनुरोध', 'طلبات مع السوابق'), points: [prefixPoint] },
	'requests-5': { title: t11('Можешь? Можете?', 'Можеш? Можете?', 'Can you?', 'Możesz? Może pan?', '¿Puedes? ¿Puede?', 'Tu peux ? Vous pouvez ?', 'Yapabilir misin?', 'Poți? Puteți?', 'Qila olasanmi?', 'क्या तुम कर सकते हो?', 'هل يمكنك؟'), points: [questionPoint] },
	'requests-6': { title: t11('Не могли бы вы...?', 'Чи не могли б ви...?', 'Could you...?', 'Czy mógłby pan...?', '¿Podría...?', 'Pourriez-vous... ?', '... yapabilir misiniz acaba?', 'Ați putea...?', "... qila olmaysizmi?", 'क्या आप ... सकेंगे?', 'هل يمكنك من فضلك...؟'), points: [questionPoint] },
	'requests-7': { title: t11('В кафе и магазине', 'У кафе й магазині', 'At the café and shop', 'W kawiarni i sklepie', 'En el café y la tienda', 'Au café et au magasin', 'Kafede ve mağazada', 'La cafenea și în magazin', "Kafe va do'konda", 'कैफ़े और दुकान में', 'في المقهى والمتجر'), points: [orderPoint] },
	'requests-9': { title: t11('Практика: на уроке', 'Практика: на уроці', 'Practice: in class', 'Praktyka: na lekcji', 'Práctica: en clase', 'Pratique : en cours', 'Pratik: derste', 'Practică: la oră', 'Mashq: darsda', 'अभ्यास: कक्षा में', 'تدريب: في الدرس'), points: [duPoint, ihrPoint, siePoint] },
	'requests-10': { title: t11('Практика: в гостинице', 'Практика: у готелі', 'Practice: at the hotel', 'Praktyka: w hotelu', 'Práctica: en el hotel', 'Pratique : à l’hôtel', 'Pratik: otelde', 'Practică: la hotel', 'Mashq: mehmonxonada', 'अभ्यास: होटल में', 'تدريب: في الفندق'), points: [questionPoint, orderPoint] },
	'requests-8': { title: finalTitle, points: [duPoint, siePoint, questionPoint] }
}

module.exports = quests
