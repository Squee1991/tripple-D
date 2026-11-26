// Грамматика к заданиям земли north-cliffs (Северные скалы: отель и поездка)
const ex = (de, tr) => ({ de, tr })
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })
const p = (title, text) => ({ title, text })
// point(тексты по языкам [заголовок, текст], примеры)
const point = (texts, examples) => ({ t: Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, [v.title, v.text]])), examples })

const mitPoint = point({
	ru: p('mit dem Bus, mit der U-Bahn', 'На чём едем: mit + dem для der и das, mit + der для die.'),
	uk: p('mit dem Bus, mit der U-Bahn', 'Чим їдемо: mit + dem для der і das, mit + der для die.'),
	en: p('mit dem Bus, mit der U-Bahn', 'How you travel: mit + dem for der and das, mit + der for die.'),
	pl: p('mit dem Bus, mit der U-Bahn', 'Czym jedziemy: mit + dem dla der i das, mit + der dla die.'),
	es: p('mit dem Bus, mit der U-Bahn', 'En qué vamos: mit + dem para der y das, mit + der para die.'),
	fr: p('mit dem Bus, mit der U-Bahn', 'Le moyen de transport : mit + dem pour der et das, mit + der pour die.'),
	tr: p('mit dem Bus, mit der U-Bahn', 'Neyle gidiyoruz: der ve das için mit + dem, die için mit + der.'),
	ro: p('mit dem Bus, mit der U-Bahn', 'Cu ce mergem: mit + dem pentru der și das, mit + der pentru die.'),
	uz: p('mit dem Bus, mit der U-Bahn', "Nima bilan boramiz: der va das uchun mit + dem, die uchun mit + der."),
	hi: p('mit dem Bus, mit der U-Bahn', 'किससे जाते हैं: der और das के लिए mit + dem, die के लिए mit + der।'),
	ar: p('mit dem Bus، mit der U-Bahn', 'بماذا نسافر: mit + dem مع der وdas، وmit + der مع die.')
}, [
	ex('Ich fahre mit der U-Bahn.', t11('Я еду на метро.', 'Я їду метро.', 'I go by underground.', 'Jadę metrem.', 'Voy en metro.', 'Je prends le métro.', 'Metroyla gidiyorum.', 'Merg cu metroul.', 'Men metroda boraman.', 'मैं मेट्रो से जाता हूँ।', 'أذهب بالمترو.'))
])

const quests = {
	'reise-hotel-1': {
		title: t11('Бронь и заезд', 'Бронювання і заселення', 'Booking and check-in', 'Rezerwacja i zameldowanie', 'Reserva y llegada', 'Réservation et arrivée', 'Rezervasyon ve giriş', 'Rezervare și check-in', "Bron va joylashish", 'बुकिंग और चेक-इन', 'الحجز وتسجيل الدخول'),
		points: [point({
			ru: p('möchte + глагол в конце', 'Ich möchte значит «я бы хотел». Второй глагол уходит в конец: Ich möchte ein Zimmer reservieren.'),
			uk: p('möchte + дієслово в кінці', 'Ich möchte означає «я б хотів». Друге дієслово йде в кінець: Ich möchte ein Zimmer reservieren.'),
			en: p('möchte + verb at the end', 'Ich möchte means "I would like". The second verb goes to the end: Ich möchte ein Zimmer reservieren.'),
			pl: p('möchte + czasownik na końcu', 'Ich möchte znaczy „chciałbym”. Drugi czasownik idzie na koniec: Ich möchte ein Zimmer reservieren.'),
			es: p('möchte + verbo al final', 'Ich möchte significa "me gustaría". El segundo verbo va al final: Ich möchte ein Zimmer reservieren.'),
			fr: p('möchte + verbe à la fin', 'Ich möchte veut dire « je voudrais ». Le deuxième verbe va à la fin : Ich möchte ein Zimmer reservieren.'),
			tr: p('möchte + fiil sonda', 'Ich möchte "isterim" demektir. İkinci fiil sona gider: Ich möchte ein Zimmer reservieren.'),
			ro: p('möchte + verb la final', 'Ich möchte înseamnă „aș dori”. Al doilea verb merge la final: Ich möchte ein Zimmer reservieren.'),
			uz: p("möchte + fe'l oxirida", "Ich möchte \"men ... istardim\" degani. Ikkinchi fe'l oxiriga o'tadi: Ich möchte ein Zimmer reservieren."),
			hi: p('möchte + क्रिया अंत में', 'Ich möchte का मतलब "मैं ... चाहूँगा"। दूसरी क्रिया अंत में जाती है: Ich möchte ein Zimmer reservieren।'),
			ar: p('möchte + الفعل في الآخر', 'Ich möchte تعني "أودّ". ويذهب الفعل الثاني إلى الآخر: Ich möchte ein Zimmer reservieren.')
		}, [
			ex('Ich möchte ein Zimmer reservieren.', t11('Я хотел бы забронировать номер.', 'Я хотів би забронювати номер.', 'I’d like to book a room.', 'Chciałbym zarezerwować pokój.', 'Quisiera reservar una habitación.', 'Je voudrais réserver une chambre.', 'Bir oda ayırtmak istiyorum.', 'Aș dori să rezerv o cameră.', 'Xona bron qilmoqchiman.', 'मैं एक कमरा बुक करना चाहूँगा।', 'أودّ حجز غرفة.')),
			ex('Ist ein Zimmer frei?', t11('Есть свободный номер?', 'Є вільний номер?', 'Is a room available?', 'Czy jest wolny pokój?', '¿Hay una habitación libre?', 'Il y a une chambre libre ?', 'Boş oda var mı?', 'Aveți o cameră liberă?', "Bo'sh xona bormi?", 'क्या कोई कमरा खाली है?', 'هل توجد غرفة فارغة؟'))
		])]
	},

	'reise-hotel-2': {
		title: t11('Вопросы на ресепшене', 'Питання на рецепції', 'Questions at reception', 'Pytania w recepcji', 'Preguntas en recepción', 'Questions à la réception', 'Resepsiyonda sorular', 'Întrebări la recepție', 'Qabulxonada savollar', 'रिसेप्शन पर सवाल', 'أسئلة في الاستقبال'),
		points: [point({
			ru: p('Gibt es...? и von ... bis', 'Gibt es...? значит «есть ли...?». Время работы: von sieben bis zehn Uhr (с семи до десяти).'),
			uk: p('Gibt es...? і von ... bis', 'Gibt es...? означає «чи є...?». Час роботи: von sieben bis zehn Uhr (з сьомої до десятої).'),
			en: p('Gibt es...? and von ... bis', 'Gibt es...? means "Is there...?". Opening hours: von sieben bis zehn Uhr (from seven to ten).'),
			pl: p('Gibt es...? i von ... bis', 'Gibt es...? znaczy „czy jest...?”. Godziny: von sieben bis zehn Uhr (od siódmej do dziesiątej).'),
			es: p('Gibt es...? y von ... bis', 'Gibt es...? significa "¿hay...?". Horario: von sieben bis zehn Uhr (de siete a diez).'),
			fr: p('Gibt es... ? et von ... bis', 'Gibt es... ? veut dire « est-ce qu’il y a... ? ». Horaires : von sieben bis zehn Uhr (de sept à dix heures).'),
			tr: p('Gibt es...? ve von ... bis', 'Gibt es...? "... var mı?" demektir. Saatler: von sieben bis zehn Uhr (yediden ona kadar).'),
			ro: p('Gibt es...? și von ... bis', 'Gibt es...? înseamnă „există...?”. Programul: von sieben bis zehn Uhr (de la șapte la zece).'),
			uz: p('Gibt es...? va von ... bis', "Gibt es...? \"... bormi?\" degani. Ish vaqti: von sieben bis zehn Uhr (yettidan o'ngacha)."),
			hi: p('Gibt es...? और von ... bis', 'Gibt es...? मतलब "क्या ... है?"। समय: von sieben bis zehn Uhr (सात से दस बजे तक)।'),
			ar: p('Gibt es...؟ وvon ... bis', 'Gibt es...؟ تعني "هل يوجد...؟". والمواعيد: von sieben bis zehn Uhr (من السابعة حتى العاشرة).')
		}, [
			ex('Gibt es WLAN?', t11('Здесь есть Wi-Fi?', 'Тут є Wi-Fi?', 'Is there Wi-Fi?', 'Czy jest Wi-Fi?', '¿Hay wifi?', 'Il y a le wifi ?', 'Wi-Fi var mı?', 'Există Wi-Fi?', 'Wi-Fi bormi?', 'क्या वाई-फ़ाई है?', 'هل يوجد واي فاي؟')),
			ex('Frühstück ist von sieben bis zehn Uhr.', t11('Завтрак с семи до десяти.', 'Сніданок із сьомої до десятої.', 'Breakfast is from seven to ten.', 'Śniadanie jest od siódmej do dziesiątej.', 'El desayuno es de siete a diez.', 'Le petit déjeuner est de sept à dix heures.', 'Kahvaltı yediden ona kadar.', 'Micul dejun e de la șapte la zece.', "Nonushta yettidan o'ngacha.", 'नाश्ता सात से दस बजे तक है।', 'الفطور من السابعة حتى العاشرة.'))
		])]
	},

	'reise-hotel-3': {
		title: t11('Проблемы в номере', 'Проблеми в номері', 'Problems in the room', 'Problemy w pokoju', 'Problemas en la habitación', 'Problèmes dans la chambre', 'Odada sorunlar', 'Probleme în cameră', 'Xonadagi muammolar', 'कमरे में समस्याएँ', 'مشاكل في الغرفة'),
		points: [point({
			ru: p('funktioniert nicht', 'Что-то сломалось: ... funktioniert nicht. Вежливая просьба: Können Sie bitte helfen?'),
			uk: p('funktioniert nicht', 'Щось зламалося: ... funktioniert nicht. Ввічливе прохання: Können Sie bitte helfen?'),
			en: p('funktioniert nicht', 'Something is broken: ... funktioniert nicht. A polite request: Können Sie bitte helfen?'),
			pl: p('funktioniert nicht', 'Coś się zepsuło: ... funktioniert nicht. Grzeczna prośba: Können Sie bitte helfen?'),
			es: p('funktioniert nicht', 'Algo no funciona: ... funktioniert nicht. Petición educada: Können Sie bitte helfen?'),
			fr: p('funktioniert nicht', 'Quelque chose ne marche pas : ... funktioniert nicht. Demande polie : Können Sie bitte helfen ?'),
			tr: p('funktioniert nicht', 'Bir şey bozuk: ... funktioniert nicht. Kibar rica: Können Sie bitte helfen?'),
			ro: p('funktioniert nicht', 'Ceva nu merge: ... funktioniert nicht. Rugăminte politicoasă: Können Sie bitte helfen?'),
			uz: p('funktioniert nicht', "Nimadir buzildi: ... funktioniert nicht. Muloyim iltimos: Können Sie bitte helfen?"),
			hi: p('funktioniert nicht', 'कुछ काम नहीं कर रहा: ... funktioniert nicht। विनम्र अनुरोध: Können Sie bitte helfen?'),
			ar: p('funktioniert nicht', 'شيء لا يعمل: ... funktioniert nicht. وطلب مهذب: Können Sie bitte helfen؟')
		}, [
			ex('Die Heizung funktioniert nicht.', t11('Отопление не работает.', 'Опалення не працює.', 'The heating doesn’t work.', 'Ogrzewanie nie działa.', 'La calefacción no funciona.', 'Le chauffage ne marche pas.', 'Kalorifer çalışmıyor.', 'Încălzirea nu merge.', 'Isitish ishlamayapti.', 'हीटिंग काम नहीं कर रही।', 'التدفئة لا تعمل.'))
		])]
	},

	'reise-hotel-4': {
		title: t11('Сервисы и расписание', 'Сервіси і розклад', 'Services and schedules', 'Usługi i godziny', 'Servicios y horarios', 'Services et horaires', 'Hizmetler ve saatler', 'Servicii și program', 'Xizmatlar va jadval', 'सेवाएँ और समय', 'الخدمات والمواعيد'),
		points: [point({
			ru: p('Новых правил нет', 'Где: Wo ist...? Когда: Wann ist...? Ответ про место: rechts, links, geradeaus.'),
			uk: p('Нових правил немає', 'Де: Wo ist...? Коли: Wann ist...? Відповідь про місце: rechts, links, geradeaus.'),
			en: p('No new rules', 'Where: Wo ist...? When: Wann ist...? Place answers: rechts, links, geradeaus.'),
			pl: p('Bez nowych reguł', 'Gdzie: Wo ist...? Kiedy: Wann ist...? Odpowiedź o miejscu: rechts, links, geradeaus.'),
			es: p('Sin reglas nuevas', 'Dónde: Wo ist...? Cuándo: Wann ist...? Respuestas de lugar: rechts, links, geradeaus.'),
			fr: p('Pas de nouvelle règle', 'Où : Wo ist... ? Quand : Wann ist... ? Pour le lieu : rechts, links, geradeaus.'),
			tr: p('Yeni kural yok', 'Nerede: Wo ist...? Ne zaman: Wann ist...? Yer cevabı: rechts, links, geradeaus.'),
			ro: p('Fără reguli noi', 'Unde: Wo ist...? Când: Wann ist...? Răspuns despre loc: rechts, links, geradeaus.'),
			uz: p("Yangi qoida yo'q", "Qayerda: Wo ist...? Qachon: Wann ist...? Joy javobi: rechts, links, geradeaus."),
			hi: p('कोई नया नियम नहीं', 'कहाँ: Wo ist...? कब: Wann ist...? जगह का जवाब: rechts, links, geradeaus।'),
			ar: p('لا قواعد جديدة', 'أين: Wo ist...؟ متى: Wann ist...؟ وجواب المكان: rechts، links، geradeaus.')
		}, [
			ex('Wo ist der Aufzug? Der Aufzug ist rechts.', t11('Где лифт? Лифт справа.', 'Де ліфт? Ліфт праворуч.', 'Where is the lift? The lift is on the right.', 'Gdzie jest winda? Winda jest po prawej.', '¿Dónde está el ascensor? El ascensor está a la derecha.', 'Où est l’ascenseur ? L’ascenseur est à droite.', 'Asansör nerede? Asansör sağda.', 'Unde e liftul? Liftul e în dreapta.', "Lift qayerda? Lift o'ngda.", 'लिफ़्ट कहाँ है? लिफ़्ट दाईं ओर है।', 'أين المصعد؟ المصعد على اليمين.'))
		])]
	},

	'reise-hotel-5': {
		title: t11('Выезд и аэропорт', 'Виїзд і аеропорт', 'Check-out and airport', 'Wymeldowanie i lotnisko', 'Salida y aeropuerto', 'Départ et aéroport', 'Çıkış ve havalimanı', 'Check-out și aeroport', 'Chiqish va aeroport', 'चेक-आउट और हवाई अड्डा', 'المغادرة والمطار'),
		points: [point({
			ru: p('Kann ich...?', 'Спросить, можно ли: Kann ich ...? Отделяемый глагол в конце целиком: Kann ich später auschecken?'),
			uk: p('Kann ich...?', 'Запитати, чи можна: Kann ich ...? Відокремлюване дієслово в кінці цілим: Kann ich später auschecken?'),
			en: p('Kann ich...?', 'To ask if you can: Kann ich ...? A separable verb stays whole at the end: Kann ich später auschecken?'),
			pl: p('Kann ich...?', 'Zapytać, czy można: Kann ich ...? Czasownik rozdzielny w całości na końcu: Kann ich später auschecken?'),
			es: p('Kann ich...?', 'Para preguntar si puedes: Kann ich ...? El verbo separable va entero al final: Kann ich später auschecken?'),
			fr: p('Kann ich... ?', 'Pour demander si on peut : Kann ich ... ? Le verbe séparable reste entier à la fin : Kann ich später auschecken ?'),
			tr: p('Kann ich...?', 'Yapabilir miyim diye sormak: Kann ich ...? Ayrılabilen fiil sonda bütün kalır: Kann ich später auschecken?'),
			ro: p('Kann ich...?', 'Ca să întrebi dacă poți: Kann ich ...? Verbul separabil stă întreg la final: Kann ich später auschecken?'),
			uz: p('Kann ich...?', "Mumkinmi deb so'rash: Kann ich ...? Ajraladigan fe'l oxirida butun turadi: Kann ich später auschecken?"),
			hi: p('Kann ich...?', 'पूछना कि क्या कर सकते हैं: Kann ich ...? अलग होने वाली क्रिया अंत में पूरी: Kann ich später auschecken?'),
			ar: p('Kann ich...؟', 'لتسأل هل يمكنك: Kann ich ...؟ والفعل ذو السابقة يبقى كاملاً في الآخر: Kann ich später auschecken؟')
		}, [
			ex('Kann ich mein Gepäck hier lassen?', t11('Можно оставить здесь багаж?', 'Можна залишити тут багаж?', 'Can I leave my luggage here?', 'Mogę zostawić tu bagaż?', '¿Puedo dejar aquí mi equipaje?', 'Je peux laisser mes bagages ici ?', 'Bagajımı burada bırakabilir miyim?', 'Pot să-mi las bagajul aici?', "Yukimni shu yerda qoldirsam bo'ladimi?", 'क्या मैं अपना सामान यहाँ छोड़ सकता हूँ?', 'هل يمكنني ترك أمتعتي هنا؟')),
			ex('Ich möchte mit Karte bezahlen.', t11('Я хотел бы заплатить картой.', 'Я хотів би заплатити карткою.', 'I’d like to pay by card.', 'Chciałbym zapłacić kartą.', 'Quisiera pagar con tarjeta.', 'Je voudrais payer par carte.', 'Kartla ödemek istiyorum.', 'Aș dori să plătesc cu cardul.', "Karta bilan to'lamoqchiman.", 'मैं कार्ड से भुगतान करना चाहूँगा।', 'أودّ الدفع بالبطاقة.'))
		])]
	},

	'reise-hotel-6': {
		title: t11('Мини-диалоги в отеле', 'Міні-діалоги в готелі', 'Hotel mini-dialogues', 'Minidialogi w hotelu', 'Minidiálogos en el hotel', 'Mini-dialogues à l’hôtel', 'Otelde kısa diyaloglar', 'Minidialoguri la hotel', 'Mehmonxonada qisqa suhbatlar', 'होटल में छोटे संवाद', 'حوارات قصيرة في الفندق'),
		points: [point({
			ru: p('Новых правил нет', 'Прилагательное после ein: das Zimmer → ein ruhiges Zimmer (-es для das).'),
			uk: p('Нових правил немає', 'Прикметник після ein: das Zimmer → ein ruhiges Zimmer (-es для das).'),
			en: p('No new rules', 'Adjective after ein: das Zimmer → ein ruhiges Zimmer (-es for das).'),
			pl: p('Bez nowych reguł', 'Przymiotnik po ein: das Zimmer → ein ruhiges Zimmer (-es dla das).'),
			es: p('Sin reglas nuevas', 'Adjetivo después de ein: das Zimmer → ein ruhiges Zimmer (-es para das).'),
			fr: p('Pas de nouvelle règle', 'Adjectif après ein : das Zimmer → ein ruhiges Zimmer (-es pour das).'),
			tr: p('Yeni kural yok', 'ein’den sonra sıfat: das Zimmer → ein ruhiges Zimmer (das için -es).'),
			ro: p('Fără reguli noi', 'Adjectiv după ein: das Zimmer → ein ruhiges Zimmer (-es pentru das).'),
			uz: p("Yangi qoida yo'q", "ein dan keyin sifat: das Zimmer → ein ruhiges Zimmer (das uchun -es)."),
			hi: p('कोई नया नियम नहीं', 'ein के बाद विशेषण: das Zimmer → ein ruhiges Zimmer (das के लिए -es)।'),
			ar: p('لا قواعد جديدة', 'الصفة بعد ein: das Zimmer → ein ruhiges Zimmer (-es مع das).')
		}, [
			ex('Ich brauche ein ruhiges Zimmer.', t11('Мне нужен тихий номер.', 'Мені потрібен тихий номер.', 'I need a quiet room.', 'Potrzebuję cichego pokoju.', 'Necesito una habitación tranquila.', 'J’ai besoin d’une chambre calme.', 'Sessiz bir odaya ihtiyacım var.', 'Am nevoie de o cameră liniștită.', 'Menga tinch xona kerak.', 'मुझे एक शांत कमरा चाहिए।', 'أحتاج غرفة هادئة.'))
		])]
	},

	'reise-hotel-7': {
		title: t11('Быстрые диалоги', 'Швидкі діалоги', 'Quick dialogues', 'Szybkie dialogi', 'Diálogos rápidos', 'Dialogues rapides', 'Hızlı diyaloglar', 'Dialoguri rapide', 'Tezkor suhbatlar', 'तेज़ संवाद', 'حوارات سريعة'),
		points: [point({
			ru: p('Новых правил нет', 'Повторяем brauchen + Akkusativ: Ich brauche die Schlüsselkarte.'),
			uk: p('Нових правил немає', 'Повторюємо brauchen + Akkusativ: Ich brauche die Schlüsselkarte.'),
			en: p('No new rules', 'Review brauchen + accusative: Ich brauche die Schlüsselkarte.'),
			pl: p('Bez nowych reguł', 'Powtarzamy brauchen + Akkusativ: Ich brauche die Schlüsselkarte.'),
			es: p('Sin reglas nuevas', 'Repaso de brauchen + acusativo: Ich brauche die Schlüsselkarte.'),
			fr: p('Pas de nouvelle règle', 'Révision de brauchen + accusatif : Ich brauche die Schlüsselkarte.'),
			tr: p('Yeni kural yok', 'brauchen + Akkusativ tekrarı: Ich brauche die Schlüsselkarte.'),
			ro: p('Fără reguli noi', 'Recapitulăm brauchen + acuzativ: Ich brauche die Schlüsselkarte.'),
			uz: p("Yangi qoida yo'q", "brauchen + Akkusativ takrori: Ich brauche die Schlüsselkarte."),
			hi: p('कोई नया नियम नहीं', 'brauchen + Akkusativ दोहराव: Ich brauche die Schlüsselkarte।'),
			ar: p('لا قواعد جديدة', 'مراجعة brauchen + المفعول: Ich brauche die Schlüsselkarte.')
		}, [
			ex('Ich brauche die Schlüsselkarte.', t11('Мне нужна ключ-карта.', 'Мені потрібна ключ-картка.', 'I need the key card.', 'Potrzebuję karty do pokoju.', 'Necesito la tarjeta llave.', 'J’ai besoin de la carte-clé.', 'Anahtar kartına ihtiyacım var.', 'Am nevoie de cardul de acces.', 'Menga kalit-karta kerak.', 'मुझे की-कार्ड चाहिए।', 'أحتاج بطاقة المفتاح.'))
		])]
	},

	'reise-verkehr-8': {
		title: t11('Транспорт по городу: wohin и mit', 'Транспорт містом: wohin і mit', 'City transport: wohin and mit', 'Transport miejski: wohin i mit', 'Transporte urbano: wohin y mit', 'Transports en ville : wohin et mit', 'Şehir içi ulaşım: wohin ve mit', 'Transport în oraș: wohin și mit', 'Shahar transporti: wohin va mit', 'शहर का परिवहन: wohin और mit', 'المواصلات في المدينة: wohin وmit'),
		points: [
			point({
				ru: p('wo и wohin', 'wo значит «где», wohin значит «куда».'),
				uk: p('wo і wohin', 'wo означає «де», wohin означає «куди».'),
				en: p('wo and wohin', 'wo means "where (at)", wohin means "where to".'),
				pl: p('wo i wohin', 'wo znaczy „gdzie”, wohin znaczy „dokąd”.'),
				es: p('wo y wohin', 'wo significa "dónde", wohin significa "adónde".'),
				fr: p('wo et wohin', 'wo veut dire « où (on est) », wohin veut dire « où (on va) ».'),
				tr: p('wo ve wohin', 'wo "nerede", wohin "nereye" demektir.'),
				ro: p('wo și wohin', 'wo înseamnă „unde”, wohin înseamnă „încotro”.'),
				uz: p('wo va wohin', 'wo "qayerda", wohin "qayerga" degani.'),
				hi: p('wo और wohin', 'wo मतलब "कहाँ", wohin मतलब "किधर, कहाँ को"।'),
				ar: p('wo وwohin', 'wo تعني "أين"، وwohin تعني "إلى أين".')
			}, [
				ex('Wohin fährt dieser Bus?', t11('Куда едет этот автобус?', 'Куди їде цей автобус?', 'Where does this bus go?', 'Dokąd jedzie ten autobus?', '¿Adónde va este autobús?', 'Où va ce bus ?', 'Bu otobüs nereye gidiyor?', 'Unde merge autobuzul acesta?', 'Bu avtobus qayerga boradi?', 'यह बस कहाँ जाती है?', 'إلى أين تذهب هذه الحافلة؟'))
			]),
			mitPoint
		]
	},

	'reise-bahn-9': {
		title: t11('Вокзал и платформы', 'Вокзал і платформи', 'Station and platforms', 'Dworzec i perony', 'Estación y andenes', 'Gare et quais', 'İstasyon ve peronlar', 'Gara și peroanele', 'Vokzal va platformalar', 'स्टेशन और प्लेटफ़ॉर्म', 'المحطة والأرصفة'),
		points: [point({
			ru: p('abfahren: приставка в конце', 'Der Zug fährt von Gleis 4 ab. Вопрос: Von welchem Gleis fährt der Zug ab?'),
			uk: p('abfahren: префікс у кінці', 'Der Zug fährt von Gleis 4 ab. Питання: Von welchem Gleis fährt der Zug ab?'),
			en: p('abfahren: prefix at the end', 'Der Zug fährt von Gleis 4 ab. Question: Von welchem Gleis fährt der Zug ab?'),
			pl: p('abfahren: przedrostek na końcu', 'Der Zug fährt von Gleis 4 ab. Pytanie: Von welchem Gleis fährt der Zug ab?'),
			es: p('abfahren: prefijo al final', 'Der Zug fährt von Gleis 4 ab. Pregunta: Von welchem Gleis fährt der Zug ab?'),
			fr: p('abfahren : préfixe à la fin', 'Der Zug fährt von Gleis 4 ab. Question : Von welchem Gleis fährt der Zug ab ?'),
			tr: p('abfahren: ön ek sonda', 'Der Zug fährt von Gleis 4 ab. Soru: Von welchem Gleis fährt der Zug ab?'),
			ro: p('abfahren: prefixul la final', 'Der Zug fährt von Gleis 4 ab. Întrebare: Von welchem Gleis fährt der Zug ab?'),
			uz: p("abfahren: old qo'shimcha oxirida", "Der Zug fährt von Gleis 4 ab. Savol: Von welchem Gleis fährt der Zug ab?"),
			hi: p('abfahren: उपसर्ग अंत में', 'Der Zug fährt von Gleis 4 ab। सवाल: Von welchem Gleis fährt der Zug ab?'),
			ar: p('abfahren: السابقة في الآخر', 'Der Zug fährt von Gleis 4 ab. والسؤال: Von welchem Gleis fährt der Zug ab؟')
		}, [
			ex('Der Zug fährt von Gleis 4 ab.', t11('Поезд отправляется с четвёртого пути.', 'Потяг вирушає з четвертої колії.', 'The train leaves from platform 4.', 'Pociąg odjeżdża z toru 4.', 'El tren sale de la vía 4.', 'Le train part de la voie 4.', 'Tren 4. perondan kalkıyor.', 'Trenul pleacă de la linia 4.', "Poyezd 4-yo'ldan jo'naydi.", 'ट्रेन प्लेटफ़ॉर्म 4 से चलती है।', 'ينطلق القطار من الرصيف 4.')),
			ex('Der Zug hat Verspätung.', t11('Поезд опаздывает.', 'Потяг запізнюється.', 'The train is delayed.', 'Pociąg ma opóźnienie.', 'El tren tiene retraso.', 'Le train a du retard.', 'Tren rötarlı.', 'Trenul are întârziere.', 'Poyezd kechikmoqda.', 'ट्रेन लेट है।', 'القطار متأخر.'))
		])]
	},

	'reise-flughafen-10': {
		title: t11('Аэропорт', 'Аеропорт', 'The airport', 'Lotnisko', 'El aeropuerto', 'L’aéroport', 'Havalimanı', 'Aeroportul', 'Aeroport', 'हवाई अड्डा', 'المطار'),
		points: [point({
			ru: p('Новых правил нет', 'Повторяем Wo ist...? и haben + Akkusativ: Ich habe eine Bordkarte.'),
			uk: p('Нових правил немає', 'Повторюємо Wo ist...? і haben + Akkusativ: Ich habe eine Bordkarte.'),
			en: p('No new rules', 'Review Wo ist...? and haben + accusative: Ich habe eine Bordkarte.'),
			pl: p('Bez nowych reguł', 'Powtarzamy Wo ist...? i haben + Akkusativ: Ich habe eine Bordkarte.'),
			es: p('Sin reglas nuevas', 'Repaso: Wo ist...? y haben + acusativo: Ich habe eine Bordkarte.'),
			fr: p('Pas de nouvelle règle', 'Révision : Wo ist... ? et haben + accusatif : Ich habe eine Bordkarte.'),
			tr: p('Yeni kural yok', 'Tekrar: Wo ist...? ve haben + Akkusativ: Ich habe eine Bordkarte.'),
			ro: p('Fără reguli noi', 'Recapitulăm Wo ist...? și haben + acuzativ: Ich habe eine Bordkarte.'),
			uz: p("Yangi qoida yo'q", "Takrorlaymiz: Wo ist...? va haben + Akkusativ: Ich habe eine Bordkarte."),
			hi: p('कोई नया नियम नहीं', 'दोहराव: Wo ist...? और haben + Akkusativ: Ich habe eine Bordkarte।'),
			ar: p('لا قواعد جديدة', 'مراجعة: Wo ist...؟ وhaben + المفعول: Ich habe eine Bordkarte.')
		}, [
			ex('Wo ist die Gepäckausgabe?', t11('Где выдача багажа?', 'Де видача багажу?', 'Where is baggage reclaim?', 'Gdzie jest odbiór bagażu?', '¿Dónde está la recogida de equipaje?', 'Où est le retrait des bagages ?', 'Bagaj teslim yeri nerede?', 'Unde e banda de bagaje?', 'Yuk berish joyi qayerda?', 'सामान कहाँ मिलता है?', 'أين استلام الأمتعة؟'))
		])]
	},

	'reise-mix-11': {
		title: t11('Итоговая практика', 'Підсумкова практика', 'Final practice', 'Praktyka końcowa', 'Práctica final', 'Pratique finale', 'Son pratik', 'Practică finală', 'Yakuniy mashq', 'अंतिम अभ्यास', 'التدريب النهائي'),
		points: [mitPoint]
	},

	'reise-mix-12': {
		title: t11('Ещё практика', 'Ще практика', 'More practice', 'Więcej praktyki', 'Más práctica', 'Encore de la pratique', 'Biraz daha pratik', 'Mai multă practică', "Yana mashq", 'और अभ्यास', 'مزيد من التدريب'),
		points: [point({
			ru: p('Новых правил нет', 'für + срок: Ein Doppelzimmer für zwei Nächte. Оплата: bar или mit Karte.'),
			uk: p('Нових правил немає', 'für + строк: Ein Doppelzimmer für zwei Nächte. Оплата: bar або mit Karte.'),
			en: p('No new rules', 'für + length of stay: Ein Doppelzimmer für zwei Nächte. Payment: bar or mit Karte.'),
			pl: p('Bez nowych reguł', 'für + czas pobytu: Ein Doppelzimmer für zwei Nächte. Płatność: bar albo mit Karte.'),
			es: p('Sin reglas nuevas', 'für + duración: Ein Doppelzimmer für zwei Nächte. Pago: bar o mit Karte.'),
			fr: p('Pas de nouvelle règle', 'für + durée : Ein Doppelzimmer für zwei Nächte. Paiement : bar ou mit Karte.'),
			tr: p('Yeni kural yok', 'für + süre: Ein Doppelzimmer für zwei Nächte. Ödeme: bar ya da mit Karte.'),
			ro: p('Fără reguli noi', 'für + durată: Ein Doppelzimmer für zwei Nächte. Plata: bar sau mit Karte.'),
			uz: p("Yangi qoida yo'q", "für + muddat: Ein Doppelzimmer für zwei Nächte. To'lov: bar yoki mit Karte."),
			hi: p('कोई नया नियम नहीं', 'für + अवधि: Ein Doppelzimmer für zwei Nächte। भुगतान: bar या mit Karte।'),
			ar: p('لا قواعد جديدة', 'für + المدة: Ein Doppelzimmer für zwei Nächte. والدفع: bar أو mit Karte.')
		}, [
			ex('Ein Doppelzimmer für zwei Nächte, bitte.', t11('Двухместный номер на две ночи, пожалуйста.', 'Двомісний номер на дві ночі, будь ласка.', 'A double room for two nights, please.', 'Pokój dwuosobowy na dwie noce, proszę.', 'Una habitación doble para dos noches, por favor.', 'Une chambre double pour deux nuits, s’il vous plaît.', 'İki gece için çift kişilik oda, lütfen.', 'O cameră dublă pentru două nopți, vă rog.', 'Ikki kechaga ikki kishilik xona, iltimos.', 'दो रातों के लिए डबल कमरा, कृपया।', 'غرفة مزدوجة لليلتين من فضلك.'))
		])]
	}
}

module.exports = quests
