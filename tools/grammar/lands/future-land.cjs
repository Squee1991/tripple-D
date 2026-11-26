// Грамматика к заданиям земли future-land (Futur I)
const { ex, t11, pt } = require('../lib.cjs')

const formTexts = [
	'werden на втором месте, инфинитив в конце: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden на другому місці, інфінітив у кінці: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden in second place, infinitive at the end: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden na drugim miejscu, bezokolicznik na końcu: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden en segundo lugar, infinitivo al final: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden en deuxième position, infinitif à la fin : ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden ikinci sırada, mastar sonda: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	'werden pe locul doi, infinitivul la final: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
	"werden ikkinchi o'rinda, infinitiv oxirida: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.",
	'werden दूसरे स्थान पर, इन्फ़िनिटिव अंत में: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden।',
	'werden في المكان الثاني والمصدر في الآخر: ich werde، du wirst، er wird، wir werden، ihr werdet، sie werden.'
]
const formTitle = ['Futur I: werden + инфинитив', 'Futur I: werden + інфінітив', 'Futur I: werden + infinitive', 'Futur I: werden + bezokolicznik', 'Futur I: werden + infinitivo', 'Futur I : werden + infinitif', 'Futur I: werden + mastar', 'Futur I: werden + infinitiv', 'Futur I: werden + infinitiv', 'Futur I: werden + इन्फ़िनिटिव', 'Futur I: werden + المصدر']
const formPoint = (example) => pt(formTitle, formTexts, [example])

const usePoint = pt(['Когда нужен Futur', 'Коли потрібен Futur', 'When to use Futur', 'Kiedy Futur', 'Cuándo usar el Futur', 'Quand utiliser le Futur', 'Futur ne zaman kullanılır', 'Când folosim Futur', 'Futur qachon kerak', 'Futur कब', 'متى نستعمل Futur'], [
	'Futur нужен для обещаний, прогнозов и планов. Если ясно, что речь о будущем (morgen, nächste Woche), немцы часто говорят просто в настоящем.',
	'Futur потрібен для обіцянок, прогнозів і планів. Якщо ясно, що йдеться про майбутнє (morgen, nächste Woche), німці часто кажуть просто в теперішньому.',
	'Futur is used for promises, predictions and plans. When it’s clear it’s about the future (morgen, nächste Woche), Germans often just use the present.',
	'Futur służy do obietnic, prognoz i planów. Gdy jasne, że chodzi o przyszłość (morgen, nächste Woche), Niemcy często mówią po prostu w teraźniejszym.',
	'El Futur sirve para promesas, pronósticos y planes. Si está claro que es futuro (morgen, nächste Woche), los alemanes suelen usar el presente.',
	'Le Futur sert pour les promesses, les prévisions et les projets. Quand c’est clair que c’est le futur (morgen, nächste Woche), on utilise souvent le présent.',
	'Futur söz, tahmin ve planlar için kullanılır. Gelecek olduğu belliyse (morgen, nächste Woche) Almanlar çoğu zaman şimdiki zamanı kullanır.',
	'Futur se folosește pentru promisiuni, prognoze și planuri. Dacă e clar că e viitor (morgen, nächste Woche), nemții spun des la prezent.',
	"Futur va'dalar, bashoratlar va rejalar uchun kerak. Kelajak ekani aniq bo'lsa (morgen, nächste Woche), nemislar ko'pincha hozirgi zamonni ishlatadi.",
	'Futur वादों, पूर्वानुमानों और योजनाओं के लिए है। अगर साफ़ हो कि भविष्य की बात है (morgen, nächste Woche), तो जर्मन लोग अक्सर वर्तमान में ही बोलते हैं।',
	'نستعمل Futur للوعود والتوقعات والخطط. وإذا كان المستقبل واضحاً (morgen، nächste Woche) يكتفي الألمان غالباً بالمضارع.'
])

const sepPoint = pt(['Приставка не отрывается', 'Префікс не відривається', 'The prefix stays on', 'Przedrostek się nie odrywa', 'El prefijo no se separa', 'Le préfixe reste attaché', 'Ön ek ayrılmaz', 'Prefixul nu se desparte', "Old qo'shimcha ajralmaydi", 'उपसर्ग अलग नहीं होता', 'السابقة لا تنفصل'], [
	'Отделяемый глагол в конце стоит целиком: Wir werden alle Freunde einladen.',
	'Відокремлюване дієслово в кінці стоїть цілим: Wir werden alle Freunde einladen.',
	'A separable verb stays whole at the end: Wir werden alle Freunde einladen.',
	'Czasownik rozdzielny stoi na końcu w całości: Wir werden alle Freunde einladen.',
	'El verbo separable va entero al final: Wir werden alle Freunde einladen.',
	'Le verbe séparable reste entier à la fin : Wir werden alle Freunde einladen.',
	'Ayrılabilen fiil sonda bütün kalır: Wir werden alle Freunde einladen.',
	'Verbul separabil stă întreg la final: Wir werden alle Freunde einladen.',
	"Ajraladigan fe'l oxirida butun turadi: Wir werden alle Freunde einladen.",
	'अलग होने वाली क्रिया अंत में पूरी रहती है: Wir werden alle Freunde einladen।',
	'الفعل ذو السابقة يبقى كاملاً في الآخر: Wir werden alle Freunde einladen.'
], [ex('Die Gäste werden Geschenke mitbringen.', t11('Гости принесут подарки.', 'Гості принесуть подарунки.', 'The guests will bring presents.', 'Goście przyniosą prezenty.', 'Los invitados traerán regalos.', 'Les invités apporteront des cadeaux.', 'Misafirler hediye getirecek.', 'Oaspeții vor aduce cadouri.', "Mehmonlar sovg'alar olib kelishadi.", 'मेहमान तोहफ़े लाएँगे।', 'سيحضر الضيوف هدايا.'))])

const T = (...v) => t11(...v)
const q = (title, points) => ({ title, points })

const quests = {
	'future-one': q(T('Futur I: путешествие', 'Futur I: подорож', 'Futur I: a trip', 'Futur I: podróż', 'Futur I: un viaje', 'Futur I : un voyage', 'Futur I: seyahat', 'Futur I: o călătorie', 'Futur I: sayohat', 'Futur I: यात्रा', 'Futur I: رحلة'), [formPoint(ex('Ich werde einen Koffer packen.', T('Я соберу чемодан.', 'Я зберу валізу.', 'I’ll pack a suitcase.', 'Spakuję walizkę.', 'Haré la maleta.', 'Je vais faire ma valise.', 'Bavul hazırlayacağım.', 'Îmi voi face bagajul.', "Chamadon yig'aman.", 'मैं सूटकेस पैक करूँगा।', 'سأحزم حقيبة.')))]),
	'future-two': q(T('Цели и обещания', 'Цілі й обіцянки', 'Goals and promises', 'Cele i obietnice', 'Metas y promesas', 'Objectifs et promesses', 'Hedefler ve sözler', 'Obiective și promisiuni', "Maqsadlar va va'dalar", 'लक्ष्य और वादे', 'الأهداف والوعود'), [usePoint, formPoint(ex('Er wird dich morgen anrufen.', T('Он позвонит тебе завтра.', 'Він зателефонує тобі завтра.', 'He’ll call you tomorrow.', 'Zadzwoni do ciebie jutro.', 'Te llamará mañana.', 'Il t’appellera demain.', 'Seni yarın arayacak.', 'Te va suna mâine.', "U ertaga senga qo'ng'iroq qiladi.", 'वह कल तुम्हें फ़ोन करेगा।', 'سيتصل بك غداً.')))]),
	'future-three': q(T('Общие планы: wir, ihr, sie', 'Спільні плани: wir, ihr, sie', 'Joint plans: wir, ihr, sie', 'Wspólne plany: wir, ihr, sie', 'Planes comunes: wir, ihr, sie', 'Projets communs : wir, ihr, sie', 'Ortak planlar: wir, ihr, sie', 'Planuri comune: wir, ihr, sie', 'Umumiy rejalar: wir, ihr, sie', 'साझा योजनाएँ: wir, ihr, sie', 'خطط مشتركة: wir وihr وsie'), [formPoint(ex('Wann werdet ihr nach Berlin fahren?', T('Когда вы поедете в Берлин?', 'Коли ви поїдете до Берліна?', 'When will you go to Berlin?', 'Kiedy pojedziecie do Berlina?', '¿Cuándo iréis a Berlín?', 'Quand irez-vous à Berlin ?', 'Berlin’e ne zaman gideceksiniz?', 'Când veți merge la Berlin?', 'Berlinga qachon borasizlar?', 'तुम सब बर्लिन कब जाओगे?', 'متى ستسافرون إلى برلين؟')))]),
	'future-four': q(T('Устраиваем вечеринку', 'Влаштовуємо вечірку', 'Throwing a party', 'Urządzamy imprezę', 'Organizamos una fiesta', 'On organise une fête', 'Parti veriyoruz', 'Organizăm o petrecere', 'Bazm uyushtiramiz', 'पार्टी करते हैं', 'ننظم حفلة'), [sepPoint]),
	'future-five': q(T('Спорт и победы', 'Спорт і перемоги', 'Sport and victories', 'Sport i zwycięstwa', 'Deporte y victorias', 'Sport et victoires', 'Spor ve zaferler', 'Sport și victorii', "Sport va g'alabalar", 'खेल और जीत', 'الرياضة والانتصارات'), [formPoint(ex('Die Mannschaft wird gut spielen.', T('Команда сыграет хорошо.', 'Команда зіграє добре.', 'The team will play well.', 'Drużyna zagra dobrze.', 'El equipo jugará bien.', 'L’équipe jouera bien.', 'Takım iyi oynayacak.', 'Echipa va juca bine.', "Jamoa yaxshi o'ynaydi.", 'टीम अच्छा खेलेगी।', 'سيلعب الفريق جيداً.')))]),
	'future-six': q(T('Планы на выходные', 'Плани на вихідні', 'Weekend plans', 'Plany na weekend', 'Planes para el fin de semana', 'Projets pour le week-end', 'Hafta sonu planları', 'Planuri de weekend', 'Dam olish rejalari', 'सप्ताहांत की योजनाएँ', 'خطط عطلة نهاية الأسبوع'), [formPoint(ex('Ich werde am Samstag lange schlafen.', T('В субботу я буду долго спать.', 'У суботу я довго спатиму.', 'On Saturday I’ll sleep in.', 'W sobotę będę długo spać.', 'El sábado dormiré mucho.', 'Samedi, je ferai la grasse matinée.', 'Cumartesi uzun uzun uyuyacağım.', 'Sâmbătă voi dormi mult.', 'Shanba kuni uzoq uxlayman.', 'शनिवार को मैं देर तक सोऊँगा।', 'سأنام طويلاً يوم السبت.')))]),
	'future-seven': q(T('Переезд', 'Переїзд', 'Moving house', 'Przeprowadzka', 'La mudanza', 'Le déménagement', 'Taşınma', 'Mutarea', "Ko'chish", 'घर बदलना', 'الانتقال'), [sepPoint, formPoint(ex('Ich werde nächste Woche umziehen.', T('На следующей неделе я перееду.', 'Наступного тижня я переїду.', 'I’ll move next week.', 'W przyszłym tygodniu się przeprowadzę.', 'La semana que viene me mudaré.', 'Je vais déménager la semaine prochaine.', 'Gelecek hafta taşınacağım.', 'Săptămâna viitoare mă voi muta.', "Kelasi hafta ko'chaman.", 'मैं अगले हफ़्ते घर बदलूँगा।', 'سأنتقل الأسبوع القادم.')))]),
	'future-eight': q(T('Прогноз погоды', 'Прогноз погоди', 'Weather forecast', 'Prognoza pogody', 'El pronóstico del tiempo', 'La météo', 'Hava tahmini', 'Prognoza meteo', 'Ob-havo prognozi', 'मौसम का पूर्वानुमान', 'توقعات الطقس'), [usePoint, formPoint(ex('Es wird morgen regnen.', T('Завтра будет дождь.', 'Завтра буде дощ.', 'It will rain tomorrow.', 'Jutro będzie padać.', 'Mañana lloverá.', 'Il pleuvra demain.', 'Yarın yağmur yağacak.', 'Mâine va ploua.', "Ertaga yomg'ir yog'adi.", 'कल बारिश होगी।', 'ستمطر غداً.')))]),
	'future-nine': q(T('Здоровье', 'Здоров’я', 'Health', 'Zdrowie', 'La salud', 'La santé', 'Sağlık', 'Sănătatea', "Sog'liq", 'स्वास्थ्य', 'الصحة'), [formPoint(ex('Der Arzt wird mich untersuchen.', T('Врач меня осмотрит.', 'Лікар мене огляне.', 'The doctor will examine me.', 'Lekarz mnie zbada.', 'El médico me examinará.', 'Le médecin va m’examiner.', 'Doktor beni muayene edecek.', 'Medicul mă va consulta.', "Shifokor meni ko'rikdan o'tkazadi.", 'डॉक्टर मेरी जाँच करेंगे।', 'سيفحصني الطبيب.')))]),
	'future-ten': q(T('Шопинг', 'Шопінг', 'Shopping', 'Zakupy', 'De compras', 'Le shopping', 'Alışveriş', 'Cumpărături', 'Xarid', 'खरीदारी', 'التسوق'), [formPoint(ex('Ich werde ein neues Kleid kaufen.', T('Я куплю новое платье.', 'Я куплю нову сукню.', 'I’ll buy a new dress.', 'Kupię nową sukienkę.', 'Me compraré un vestido nuevo.', 'Je vais acheter une nouvelle robe.', 'Yeni bir elbise alacağım.', 'Îmi voi cumpăra o rochie nouă.', "Yangi ko'ylak sotib olaman.", 'मैं एक नई ड्रेस खरीदूँगी।', 'سأشتري فستاناً جديداً.')))]),
	'future-eleven': q(T('В ресторане', 'У ресторані', 'At the restaurant', 'W restauracji', 'En el restaurante', 'Au restaurant', 'Restoranda', 'La restaurant', 'Restoranda', 'रेस्टोरेंट में', 'في المطعم'), [formPoint(ex('Wir werden einen Tisch reservieren.', T('Мы забронируем столик.', 'Ми забронюємо столик.', 'We’ll book a table.', 'Zarezerwujemy stolik.', 'Reservaremos una mesa.', 'Nous allons réserver une table.', 'Bir masa ayırtacağız.', 'Vom rezerva o masă.', 'Biz stol bron qilamiz.', 'हम एक मेज़ बुक करेंगे।', 'سنحجز طاولة.')))]),
	'future-twelve': q(T('Кино', 'Кіно', 'The cinema', 'Kino', 'El cine', 'Le cinéma', 'Sinema', 'Cinema', 'Kino', 'सिनेमा', 'السينما'), [formPoint(ex('Der Film wird spannend sein.', T('Фильм будет захватывающим.', 'Фільм буде захопливим.', 'The film will be exciting.', 'Film będzie ciekawy.', 'La película será emocionante.', 'Le film sera passionnant.', 'Film heyecanlı olacak.', 'Filmul va fi captivant.', "Film qiziqarli bo'ladi.", 'फ़िल्म रोमांचक होगी।', 'سيكون الفيلم مشوقاً.')))]),
	'future-thirteen': q(T('Животные', 'Тварини', 'Animals', 'Zwierzęta', 'Animales', 'Les animaux', 'Hayvanlar', 'Animalele', 'Hayvonlar', 'जानवर', 'الحيوانات'), [formPoint(ex('Wir werden in den Zoo gehen.', T('Мы пойдём в зоопарк.', 'Ми підемо в зоопарк.', 'We’ll go to the zoo.', 'Pójdziemy do zoo.', 'Iremos al zoo.', 'Nous irons au zoo.', 'Hayvanat bahçesine gideceğiz.', 'Vom merge la grădina zoologică.', "Biz hayvonot bog'iga boramiz.", 'हम चिड़ियाघर जाएँगे।', 'سنذهب إلى حديقة الحيوانات.')))]),
	'future-fourteen': q(T('Экология', 'Екологія', 'Ecology', 'Ekologia', 'Ecología', 'L’écologie', 'Ekoloji', 'Ecologia', 'Ekologiya', 'पर्यावरण', 'البيئة'), [pt(['sich в Futur', 'sich у Futur', 'sich in Futur', 'sich w Futur', 'sich en Futur', 'sich au Futur', 'Futur’da sich', 'sich la Futur', 'Futur da sich', 'Futur में sich', 'sich في Futur'], [
		'Возвратное sich стоит сразу после werden, а инфинитив в конце: Das Klima wird sich ändern.',
		'Зворотне sich стоїть одразу після werden, а інфінітив у кінці: Das Klima wird sich ändern.',
		'Reflexive sich comes right after werden, the infinitive at the end: Das Klima wird sich ändern.',
		'Zwrotne sich stoi zaraz po werden, a bezokolicznik na końcu: Das Klima wird sich ändern.',
		'El reflexivo sich va justo después de werden y el infinitivo al final: Das Klima wird sich ändern.',
		'Le pronom sich vient juste après werden, l’infinitif à la fin : Das Klima wird sich ändern.',
		'Dönüşlü sich werden’dan hemen sonra, mastar sonda: Das Klima wird sich ändern.',
		'Reflexivul sich vine imediat după werden, infinitivul la final: Das Klima wird sich ändern.',
		"O'zlik sich werden dan keyin darhol, infinitiv oxirida: Das Klima wird sich ändern.",
		'निजवाचक sich, werden के ठीक बाद, इन्फ़िनिटिव अंत में: Das Klima wird sich ändern।',
		'الضمير الانعكاسي sich يأتي بعد werden مباشرة والمصدر في الآخر: Das Klima wird sich ändern.'
	], [ex('Das Klima wird sich schnell ändern.', T('Климат быстро изменится.', 'Клімат швидко зміниться.', 'The climate will change quickly.', 'Klimat szybko się zmieni.', 'El clima cambiará rápido.', 'Le climat va changer vite.', 'İklim hızla değişecek.', 'Clima se va schimba repede.', "Iqlim tez o'zgaradi.", 'जलवायु तेज़ी से बदलेगी।', 'سيتغير المناخ بسرعة.'))])]),
	'future-fifteen': q(T('Праздники', 'Свята', 'Holidays', 'Święta', 'Las fiestas', 'Les fêtes', 'Bayramlar', 'Sărbătorile', 'Bayramlar', 'त्योहार', 'الأعياد'), [usePoint, formPoint(ex('Ich werde einen Kuchen backen.', T('Я испеку торт.', 'Я спечу торт.', 'I’ll bake a cake.', 'Upiekę ciasto.', 'Haré un pastel.', 'Je vais faire un gâteau.', 'Bir kek pişireceğim.', 'Voi coace o prăjitură.', 'Men pirog pishiraman.', 'मैं केक बनाऊँगा।', 'سأخبز كعكة.')))])
}

module.exports = quests
