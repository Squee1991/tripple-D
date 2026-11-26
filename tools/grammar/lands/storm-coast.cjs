// Грамматика к заданиям земли storm-coast (Штормовой берег: праздники)
const ex = (de, tr) => ({ de, tr })
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })
const p = (title, text) => ({ title, text })
const point = (texts, examples) => ({ t: Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, [v.title, v.text]])), examples })

const mitbringenPoint = point({
	ru: p('mitbringen: приставка в конце', 'mitbringen (приносить с собой) отделяемый: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	uk: p('mitbringen: префікс у кінці', 'mitbringen (приносити з собою) відокремлюване: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	en: p('mitbringen: prefix at the end', 'mitbringen (to bring along) is separable: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	pl: p('mitbringen: przedrostek na końcu', 'mitbringen (przynieść ze sobą) jest rozdzielny: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	es: p('mitbringen: prefijo al final', 'mitbringen (traer) es separable: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	fr: p('mitbringen : préfixe à la fin', 'mitbringen (apporter) est séparable : Ich bringe Getränke mit. Bringst du die Musik mit ?'),
	tr: p('mitbringen: ön ek sonda', 'mitbringen (yanında getirmek) ayrılabilen fiildir: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	ro: p('mitbringen: prefixul la final', 'mitbringen (a aduce) e separabil: Ich bringe Getränke mit. Bringst du die Musik mit?'),
	uz: p("mitbringen: old qo'shimcha oxirida", "mitbringen (o'zi bilan olib kelmoq) ajraladigan: Ich bringe Getränke mit. Bringst du die Musik mit?"),
	hi: p('mitbringen: उपसर्ग अंत में', 'mitbringen (साथ लाना) अलग होने वाली क्रिया: Ich bringe Getränke mit। Bringst du die Musik mit?'),
	ar: p('mitbringen: السابقة في الآخر', 'mitbringen (يُحضر معه) فعل منفصل: Ich bringe Getränke mit. Bringst du die Musik mit؟')
}, [
	ex('Ich bringe Salate und Getränke mit.', t11('Я принесу салаты и напитки.', 'Я принесу салати й напої.', 'I’ll bring salads and drinks.', 'Przyniosę sałatki i napoje.', 'Traigo ensaladas y bebidas.', 'J’apporte des salades et des boissons.', 'Salata ve içecek getiriyorum.', 'Aduc salate și băuturi.', 'Salat va ichimlik olib kelaman.', 'मैं सलाद और पेय लाऊँगा।', 'سأحضر سلطات ومشروبات.'))
])

const datePoint = point({
	ru: p('Даты: am dritten April', 'Число в дате говорят порядковым: am 1. Januar = am ersten Januar, am 3. April = am dritten April. Точка после цифры значит порядковое число.'),
	uk: p('Дати: am dritten April', 'Число в даті кажуть порядковим: am 1. Januar = am ersten Januar, am 3. April = am dritten April. Крапка після цифри означає порядкове число.'),
	en: p('Dates: am dritten April', 'Dates use ordinal numbers: am 1. Januar = am ersten Januar, am 3. April = am dritten April. The dot after the number marks it as ordinal.'),
	pl: p('Daty: am dritten April', 'W dacie mówimy liczebnik porządkowy: am 1. Januar = am ersten Januar, am 3. April = am dritten April. Kropka po cyfrze oznacza liczebnik porządkowy.'),
	es: p('Fechas: am dritten April', 'En las fechas se usa el ordinal: am 1. Januar = am ersten Januar, am 3. April = am dritten April. El punto tras el número indica ordinal.'),
	fr: p('Dates : am dritten April', 'Pour la date, on utilise l’ordinal : am 1. Januar = am ersten Januar, am 3. April = am dritten April. Le point après le chiffre indique l’ordinal.'),
	tr: p('Tarihler: am dritten April', 'Tarihte sıra sayısı kullanılır: am 1. Januar = am ersten Januar, am 3. April = am dritten April. Rakamdan sonraki nokta sıra sayısını gösterir.'),
	ro: p('Date: am dritten April', 'În dată se folosește numeralul ordinal: am 1. Januar = am ersten Januar, am 3. April = am dritten April. Punctul după cifră arată ordinalul.'),
	uz: p('Sanalar: am dritten April', "Sanada tartib son ishlatiladi: am 1. Januar = am ersten Januar, am 3. April = am dritten April. Raqamdan keyingi nuqta tartib sonni bildiradi."),
	hi: p('तारीखें: am dritten April', 'तारीख में क्रमसूचक संख्या: am 1. Januar = am ersten Januar, am 3. April = am dritten April। अंक के बाद बिंदु का मतलब क्रमसूचक।'),
	ar: p('التواريخ: am dritten April', 'في التاريخ نستعمل العدد الترتيبي: am 1. Januar = am ersten Januar، am 3. April = am dritten April. والنقطة بعد الرقم تعني عدداً ترتيبياً.')
}, [
	ex('Die Party ist am 3. April.', t11('Вечеринка третьего апреля.', 'Вечірка третього квітня.', 'The party is on the 3rd of April.', 'Impreza jest trzeciego kwietnia.', 'La fiesta es el 3 de abril.', 'La fête est le 3 avril.', 'Parti 3 Nisan’da.', 'Petrecerea e pe 3 aprilie.', 'Bazm 3-aprelda.', 'पार्टी 3 अप्रैल को है।', 'الحفلة في الثالث من أبريل.'))
])

const replyPoint = point({
	ru: p('Да или нет на приглашение', 'Согласиться: Ich komme gern! Отказаться вежливо: Ich kann leider nicht.'),
	uk: p('Так чи ні на запрошення', 'Погодитися: Ich komme gern! Відмовитися ввічливо: Ich kann leider nicht.'),
	en: p('Yes or no to an invitation', 'Accept: Ich komme gern! Decline politely: Ich kann leider nicht.'),
	pl: p('Tak czy nie na zaproszenie', 'Przyjąć: Ich komme gern! Grzecznie odmówić: Ich kann leider nicht.'),
	es: p('Sí o no a una invitación', 'Aceptar: Ich komme gern! Rechazar con educación: Ich kann leider nicht.'),
	fr: p('Oui ou non à une invitation', 'Accepter : Ich komme gern ! Refuser poliment : Ich kann leider nicht.'),
	tr: p('Davete evet ya da hayır', 'Kabul: Ich komme gern! Kibarca reddetmek: Ich kann leider nicht.'),
	ro: p('Da sau nu la o invitație', 'Accepți: Ich komme gern! Refuzi politicos: Ich kann leider nicht.'),
	uz: p("Taklifga ha yoki yo'q", "Rozi bo'lish: Ich komme gern! Muloyim rad etish: Ich kann leider nicht."),
	hi: p('निमंत्रण पर हाँ या ना', 'हाँ: Ich komme gern! विनम्रता से ना: Ich kann leider nicht।'),
	ar: p('نعم أو لا على الدعوة', 'للقبول: Ich komme gern! وللرفض بأدب: Ich kann leider nicht.')
}, [
	ex('Ich komme gern!', t11('С удовольствием приду!', 'Із задоволенням прийду!', 'I’d love to come!', 'Chętnie przyjdę!', '¡Voy con gusto!', 'Je viens avec plaisir !', 'Memnuniyetle gelirim!', 'Vin cu plăcere!', 'Jon deb kelaman!', 'मैं ज़रूर आऊँगा!', 'سآتي بكل سرور!')),
	ex('Ich kann leider nicht.', t11('К сожалению, не могу.', 'На жаль, не можу.', 'Unfortunately I can’t.', 'Niestety nie mogę.', 'Lo siento, no puedo.', 'Malheureusement, je ne peux pas.', 'Maalesef gelemem.', 'Din păcate nu pot.', 'Afsuski, kela olmayman.', 'माफ़ करना, मैं नहीं आ सकता।', 'للأسف لا أستطيع.'))
])

const quests = {
	'feier-1': {
		title: t11('Приглашение: когда и во сколько', 'Запрошення: коли й о котрій', 'Invitation: when and what time', 'Zaproszenie: kiedy i o której', 'Invitación: cuándo y a qué hora', 'Invitation : quand et à quelle heure', 'Davet: ne zaman ve saat kaçta', 'Invitația: când și la ce oră', 'Taklif: qachon va soat nechada', 'निमंत्रण: कब और कितने बजे', 'الدعوة: متى وفي أي ساعة'),
		points: [point({
			ru: p('am + день, um + время', 'Повторяем: am Samstag (в субботу), um 18 Uhr (в шесть вечера).'),
			uk: p('am + день, um + час', 'Повторюємо: am Samstag (у суботу), um 18 Uhr (о шостій вечора).'),
			en: p('am + day, um + time', 'Review: am Samstag (on Saturday), um 18 Uhr (at 6 p.m.).'),
			pl: p('am + dzień, um + godzina', 'Powtarzamy: am Samstag (w sobotę), um 18 Uhr (o osiemnastej).'),
			es: p('am + día, um + hora', 'Repaso: am Samstag (el sábado), um 18 Uhr (a las seis de la tarde).'),
			fr: p('am + jour, um + heure', 'Révision : am Samstag (samedi), um 18 Uhr (à 18 heures).'),
			tr: p('am + gün, um + saat', 'Tekrar: am Samstag (cumartesi), um 18 Uhr (saat 18’de).'),
			ro: p('am + zi, um + oră', 'Recapitulăm: am Samstag (sâmbătă), um 18 Uhr (la ora 18).'),
			uz: p('am + kun, um + vaqt', "Takrorlaymiz: am Samstag (shanba kuni), um 18 Uhr (soat 18 da)."),
			hi: p('am + दिन, um + समय', 'दोहराव: am Samstag (शनिवार को), um 18 Uhr (शाम छह बजे)।'),
			ar: p('am + يوم، um + ساعة', 'مراجعة: am Samstag (يوم السبت)، um 18 Uhr (في السادسة مساءً).')
		}, [
			ex('Die Party beginnt um 18 Uhr.', t11('Вечеринка начинается в шесть вечера.', 'Вечірка починається о шостій вечора.', 'The party starts at 6 p.m.', 'Impreza zaczyna się o osiemnastej.', 'La fiesta empieza a las seis de la tarde.', 'La fête commence à 18 heures.', 'Parti saat 18’de başlıyor.', 'Petrecerea începe la ora 18.', 'Bazm soat 18 da boshlanadi.', 'पार्टी शाम छह बजे शुरू होती है।', 'تبدأ الحفلة في السادسة مساءً.'))
		])]
	},

	'feier-2': {
		title: t11('Поздравления и подарки', 'Привітання і подарунки', 'Congratulations and presents', 'Życzenia i prezenty', 'Felicitaciones y regalos', 'Vœux et cadeaux', 'Tebrikler ve hediyeler', 'Felicitări și cadouri', "Tabriklar va sovg'alar", 'बधाई और तोहफ़े', 'التهاني والهدايا'),
		points: [point({
			ru: p('Готовые фразы', 'Herzlichen Glückwunsch! и Alles Gute! учим целиком. К чему поздравляем: zum Geburtstag.'),
			uk: p('Готові фрази', 'Herzlichen Glückwunsch! і Alles Gute! вчимо цілком. З чим вітаємо: zum Geburtstag.'),
			en: p('Set phrases', 'Learn Herzlichen Glückwunsch! and Alles Gute! as whole phrases. For what: zum Geburtstag.'),
			pl: p('Gotowe zwroty', 'Herzlichen Glückwunsch! i Alles Gute! uczymy się w całości. Z jakiej okazji: zum Geburtstag.'),
			es: p('Frases hechas', 'Herzlichen Glückwunsch! y Alles Gute! se aprenden enteras. Por qué: zum Geburtstag.'),
			fr: p('Expressions toutes faites', 'Herzlichen Glückwunsch ! et Alles Gute ! s’apprennent en bloc. Pour quoi : zum Geburtstag.'),
			tr: p('Kalıp ifadeler', 'Herzlichen Glückwunsch! ve Alles Gute! kalıp olarak öğrenilir. Ne için: zum Geburtstag.'),
			ro: p('Expresii fixe', 'Herzlichen Glückwunsch! și Alles Gute! se învață întregi. Pentru ce: zum Geburtstag.'),
			uz: p('Tayyor iboralar', "Herzlichen Glückwunsch! va Alles Gute! butunligicha o'rganiladi. Nima munosabati bilan: zum Geburtstag."),
			hi: p('तैयार वाक्यांश', 'Herzlichen Glückwunsch! और Alles Gute! पूरे वाक्यांश की तरह सीखो। किस बात पर: zum Geburtstag।'),
			ar: p('عبارات جاهزة', 'نحفظ Herzlichen Glückwunsch! وAlles Gute! كاملتين. وبمناسبة ماذا: zum Geburtstag.')
		}, [
			ex('Alles Gute zum Geburtstag!', t11('С днём рождения!', 'З днем народження!', 'Happy birthday!', 'Wszystkiego najlepszego z okazji urodzin!', '¡Feliz cumpleaños!', 'Joyeux anniversaire !', 'Doğum günün kutlu olsun!', 'La mulți ani!', "Tug'ilgan kuning muborak!", 'जन्मदिन मुबारक!', 'عيد ميلاد سعيد!'))
		])]
	},

	'feier-3': {
		title: t11('Организация праздника', 'Організація свята', 'Planning the party', 'Organizacja przyjęcia', 'Organizar la fiesta', 'Organiser la fête', 'Partiyi düzenlemek', 'Organizarea petrecerii', 'Bayramni tashkil qilish', 'पार्टी की तैयारी', 'تنظيم الحفلة'),
		points: [mitbringenPoint, point({
			ru: p('vorbereiten тоже отделяемый', 'vorbereiten (готовить заранее): Ich bereite den Kuchen vor.'),
			uk: p('vorbereiten теж відокремлюване', 'vorbereiten (готувати заздалегідь): Ich bereite den Kuchen vor.'),
			en: p('vorbereiten is separable too', 'vorbereiten (to prepare): Ich bereite den Kuchen vor.'),
			pl: p('vorbereiten też rozdzielny', 'vorbereiten (przygotować): Ich bereite den Kuchen vor.'),
			es: p('vorbereiten también es separable', 'vorbereiten (preparar): Ich bereite den Kuchen vor.'),
			fr: p('vorbereiten est aussi séparable', 'vorbereiten (préparer) : Ich bereite den Kuchen vor.'),
			tr: p('vorbereiten de ayrılabilen', 'vorbereiten (hazırlamak): Ich bereite den Kuchen vor.'),
			ro: p('vorbereiten e tot separabil', 'vorbereiten (a pregăti): Ich bereite den Kuchen vor.'),
			uz: p('vorbereiten ham ajraladigan', "vorbereiten (tayyorlamoq): Ich bereite den Kuchen vor."),
			hi: p('vorbereiten भी अलग होने वाला', 'vorbereiten (तैयार करना): Ich bereite den Kuchen vor।'),
			ar: p('vorbereiten منفصل أيضاً', 'vorbereiten (يُحضّر): Ich bereite den Kuchen vor.')
		}, [
			ex('Ich bereite den Kuchen vor.', t11('Я готовлю торт.', 'Я готую торт.', 'I’m preparing the cake.', 'Przygotowuję ciasto.', 'Preparo la tarta.', 'Je prépare le gâteau.', 'Pastayı hazırlıyorum.', 'Pregătesc tortul.', 'Men tortni tayyorlayman.', 'मैं केक तैयार कर रहा हूँ।', 'أحضّر الكعكة.'))
		])]
	},

	'feier-4': {
		title: t11('Праздники в течение года', 'Свята протягом року', 'Holidays through the year', 'Święta w ciągu roku', 'Fiestas durante el año', 'Les fêtes de l’année', 'Yıl boyunca bayramlar', 'Sărbătorile anului', "Yil davomidagi bayramlar", 'साल भर के त्योहार', 'الأعياد خلال السنة'),
		points: [datePoint, point({
			ru: p('Поздравления к праздникам', 'Frohe Weihnachten! (с Рождеством), Frohe Ostern! (с Пасхой), Frohes neues Jahr! (с Новым годом).'),
			uk: p('Привітання зі святами', 'Frohe Weihnachten! (з Різдвом), Frohe Ostern! (з Великоднем), Frohes neues Jahr! (з Новим роком).'),
			en: p('Holiday greetings', 'Frohe Weihnachten! (Merry Christmas), Frohe Ostern! (Happy Easter), Frohes neues Jahr! (Happy New Year).'),
			pl: p('Życzenia świąteczne', 'Frohe Weihnachten! (Wesołych Świąt), Frohe Ostern! (Wesołej Wielkanocy), Frohes neues Jahr! (Szczęśliwego Nowego Roku).'),
			es: p('Felicitaciones de fiestas', 'Frohe Weihnachten! (Feliz Navidad), Frohe Ostern! (Felices Pascuas), Frohes neues Jahr! (Feliz Año Nuevo).'),
			fr: p('Vœux de fêtes', 'Frohe Weihnachten ! (Joyeux Noël), Frohe Ostern ! (Joyeuses Pâques), Frohes neues Jahr ! (Bonne année).'),
			tr: p('Bayram tebrikleri', 'Frohe Weihnachten! (Mutlu Noeller), Frohe Ostern! (Mutlu Paskalyalar), Frohes neues Jahr! (Mutlu yıllar).'),
			ro: p('Urări de sărbători', 'Frohe Weihnachten! (Crăciun fericit), Frohe Ostern! (Paște fericit), Frohes neues Jahr! (La mulți ani, an nou fericit).'),
			uz: p('Bayram tabriklari', "Frohe Weihnachten! (Rojdestvo muborak), Frohe Ostern! (Pasxa muborak), Frohes neues Jahr! (Yangi yil muborak)."),
			hi: p('त्योहार की बधाई', 'Frohe Weihnachten! (क्रिसमस मुबारक), Frohe Ostern! (ईस्टर मुबारक), Frohes neues Jahr! (नया साल मुबारक)।'),
			ar: p('تهاني الأعياد', 'Frohe Weihnachten! (عيد ميلاد مجيد)، Frohe Ostern! (فصح سعيد)، Frohes neues Jahr! (سنة جديدة سعيدة).')
		}, [])]
	},

	'feier-5': {
		title: t11('Мини-диалоги', 'Міні-діалоги', 'Mini-dialogues', 'Minidialogi', 'Minidiálogos', 'Mini-dialogues', 'Kısa diyaloglar', 'Minidialoguri', 'Qisqa suhbatlar', 'छोटे संवाद', 'حوارات قصيرة'),
		points: [replyPoint]
	},

	'feier-6': {
		title: t11('Дата, время и ответ', 'Дата, час і відповідь', 'Date, time and reply', 'Data, godzina i odpowiedź', 'Fecha, hora y respuesta', 'Date, heure et réponse', 'Tarih, saat ve cevap', 'Data, ora și răspunsul', 'Sana, vaqt va javob', 'तारीख, समय और जवाब', 'التاريخ والوقت والرد'),
		points: [datePoint, replyPoint]
	},

	'feier-7': {
		title: t11('Еда и напитки: mit и ohne', 'Їжа і напої: mit і ohne', 'Food and drinks: mit and ohne', 'Jedzenie i napoje: mit i ohne', 'Comida y bebida: mit y ohne', 'Nourriture et boissons : mit et ohne', 'Yiyecek ve içecek: mit ve ohne', 'Mâncare și băuturi: mit și ohne', 'Taom va ichimlik: mit va ohne', 'खाना और पेय: mit और ohne', 'الطعام والمشروبات: mit وohne'),
		points: [point({
			ru: p('mit и ohne', 'mit значит «с», ohne значит «без». Часто без артикля: mit Zucker, ohne Alkohol.'),
			uk: p('mit і ohne', 'mit означає «з», ohne означає «без». Часто без артикля: mit Zucker, ohne Alkohol.'),
			en: p('mit and ohne', 'mit means "with", ohne means "without". Often with no article: mit Zucker, ohne Alkohol.'),
			pl: p('mit i ohne', 'mit znaczy „z”, ohne znaczy „bez”. Często bez rodzajnika: mit Zucker, ohne Alkohol.'),
			es: p('mit y ohne', 'mit significa "con", ohne significa "sin". A menudo sin artículo: mit Zucker, ohne Alkohol.'),
			fr: p('mit et ohne', 'mit veut dire « avec », ohne veut dire « sans ». Souvent sans article : mit Zucker, ohne Alkohol.'),
			tr: p('mit ve ohne', 'mit "ile", ohne "-sız" demektir. Çoğu zaman artikelsiz: mit Zucker, ohne Alkohol.'),
			ro: p('mit și ohne', 'mit înseamnă „cu”, ohne înseamnă „fără”. Des fără articol: mit Zucker, ohne Alkohol.'),
			uz: p('mit va ohne', "mit \"bilan\", ohne \"-siz\" degani. Ko'pincha artiklsiz: mit Zucker, ohne Alkohol."),
			hi: p('mit और ohne', 'mit मतलब "के साथ", ohne मतलब "के बिना"। अक्सर बिना आर्टिकल: mit Zucker, ohne Alkohol।'),
			ar: p('mit وohne', 'mit تعني "مع"، وohne تعني "بدون". وغالباً بدون أداة: mit Zucker، ohne Alkohol.')
		}, [
			ex('Ohne Alkohol, bitte.', t11('Без алкоголя, пожалуйста.', 'Без алкоголю, будь ласка.', 'Without alcohol, please.', 'Bez alkoholu, proszę.', 'Sin alcohol, por favor.', 'Sans alcool, s’il vous plaît.', 'Alkolsüz, lütfen.', 'Fără alcool, vă rog.', 'Spirtsiz, iltimos.', 'बिना शराब के, कृपया।', 'بدون كحول من فضلك.'))
		]), mitbringenPoint]
	},

	'feier-8': {
		title: t11('Программа праздника', 'Програма свята', 'The party programme', 'Program przyjęcia', 'El programa de la fiesta', 'Le programme de la fête', 'Parti programı', 'Programul petrecerii', 'Bayram dasturi', 'पार्टी का कार्यक्रम', 'برنامج الحفلة'),
		points: [point({
			ru: p('Lass uns...!', 'Lass uns ... значит «давай ...»: Lass uns ein Foto machen! Тише или громче: leiser, lauter.'),
			uk: p('Lass uns...!', 'Lass uns ... означає «давай ...»: Lass uns ein Foto machen! Тихіше чи голосніше: leiser, lauter.'),
			en: p('Lass uns...!', 'Lass uns ... means "let’s ...": Lass uns ein Foto machen! Quieter or louder: leiser, lauter.'),
			pl: p('Lass uns...!', 'Lass uns ... znaczy „zróbmy ...”: Lass uns ein Foto machen! Ciszej lub głośniej: leiser, lauter.'),
			es: p('Lass uns...!', 'Lass uns ... significa "vamos a ...": Lass uns ein Foto machen! Más bajo o más alto: leiser, lauter.'),
			fr: p('Lass uns... !', 'Lass uns ... veut dire « faisons ... » : Lass uns ein Foto machen ! Moins fort ou plus fort : leiser, lauter.'),
			tr: p('Lass uns...!', 'Lass uns ... "hadi ..." demektir: Lass uns ein Foto machen! Daha kısık ya da yüksek: leiser, lauter.'),
			ro: p('Lass uns...!', 'Lass uns ... înseamnă „hai să ...”: Lass uns ein Foto machen! Mai încet sau mai tare: leiser, lauter.'),
			uz: p('Lass uns...!', "Lass uns ... \"keling ...\" degani: Lass uns ein Foto machen! Pastroq yoki balandroq: leiser, lauter."),
			hi: p('Lass uns...!', 'Lass uns ... मतलब "चलो ...": Lass uns ein Foto machen! धीमा या तेज़: leiser, lauter।'),
			ar: p('Lass uns...!', 'Lass uns ... تعني "هيا ...": Lass uns ein Foto machen! وأخفض أو أعلى: leiser، lauter.')
		}, [
			ex('Lass uns ein Foto machen!', t11('Давай сфотографируемся!', 'Давай сфотографуємося!', 'Let’s take a photo!', 'Zróbmy zdjęcie!', '¡Hagamos una foto!', 'Prenons une photo !', 'Hadi fotoğraf çekelim!', 'Hai să facem o poză!', 'Keling, suratga tushamiz!', 'चलो फ़ोटो लेते हैं!', 'هيا نلتقط صورة!')),
			ex('Kannst du die Musik leiser machen?', t11('Можешь сделать музыку тише?', 'Можеш зробити музику тихіше?', 'Can you turn the music down?', 'Możesz ściszyć muzykę?', '¿Puedes bajar la música?', 'Tu peux baisser la musique ?', 'Müziğin sesini kısabilir misin?', 'Poți da muzica mai încet?', 'Musiqani pastroq qila olasanmi?', 'क्या तुम संगीत धीमा कर सकते हो?', 'هل يمكنك خفض صوت الموسيقى؟'))
		])]
	},

	'feier-9': {
		title: t11('Семейные события: zum и zur', 'Сімейні події: zum і zur', 'Family events: zum and zur', 'Uroczystości rodzinne: zum i zur', 'Celebraciones familiares: zum y zur', 'Fêtes de famille : zum et zur', 'Aile kutlamaları: zum ve zur', 'Evenimente de familie: zum și zur', 'Oilaviy tadbirlar: zum va zur', 'पारिवारिक समारोह: zum और zur', 'المناسبات العائلية: zum وzur'),
		points: [point({
			ru: p('zum или zur', 'В поздравлениях: zum для der и das (zum Geburtstag, zum Jubiläum), zur для die (zur Hochzeit).'),
			uk: p('zum чи zur', 'У привітаннях: zum для der і das (zum Geburtstag, zum Jubiläum), zur для die (zur Hochzeit).'),
			en: p('zum or zur', 'In greetings: zum for der and das (zum Geburtstag, zum Jubiläum), zur for die (zur Hochzeit).'),
			pl: p('zum czy zur', 'W życzeniach: zum dla der i das (zum Geburtstag, zum Jubiläum), zur dla die (zur Hochzeit).'),
			es: p('zum o zur', 'En las felicitaciones: zum para der y das (zum Geburtstag, zum Jubiläum), zur para die (zur Hochzeit).'),
			fr: p('zum ou zur', 'Dans les vœux : zum pour der et das (zum Geburtstag, zum Jubiläum), zur pour die (zur Hochzeit).'),
			tr: p('zum mu, zur mu', 'Tebriklerde: der ve das için zum (zum Geburtstag, zum Jubiläum), die için zur (zur Hochzeit).'),
			ro: p('zum sau zur', 'În felicitări: zum pentru der și das (zum Geburtstag, zum Jubiläum), zur pentru die (zur Hochzeit).'),
			uz: p('zum yoki zur', "Tabriklarda: der va das uchun zum (zum Geburtstag, zum Jubiläum), die uchun zur (zur Hochzeit)."),
			hi: p('zum या zur', 'बधाई में: der और das के लिए zum (zum Geburtstag, zum Jubiläum), die के लिए zur (zur Hochzeit)।'),
			ar: p('zum أم zur', 'في التهاني: zum مع der وdas (zum Geburtstag، zum Jubiläum)، وzur مع die (zur Hochzeit).')
		}, [
			ex('Herzlichen Glückwunsch zur Hochzeit!', t11('Поздравляю со свадьбой!', 'Вітаю з весіллям!', 'Congratulations on your wedding!', 'Gratulacje z okazji ślubu!', '¡Enhorabuena por la boda!', 'Félicitations pour votre mariage !', 'Düğününüz kutlu olsun!', 'Felicitări pentru nuntă!', 'To‘yingiz muborak!', 'शादी की बहुत बधाई!', 'مبارك الزفاف!'))
		])]
	},

	'feier-10': {
		title: t11('Итоговая практика', 'Підсумкова практика', 'Final practice', 'Praktyka końcowa', 'Práctica final', 'Pratique finale', 'Son pratik', 'Practică finală', 'Yakuniy mashq', 'अंतिम अभ्यास', 'التدريب النهائي'),
		points: [replyPoint, mitbringenPoint]
	}
}

module.exports = quests
