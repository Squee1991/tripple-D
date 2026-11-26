// Грамматика к заданиям земли wind-valley (Долина ветров: город)
const ex = (de, tr) => ({ de, tr })

const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })

const datPoint = {
	t: {
		ru: ['dem и der после предлога', 'После neben, vor, hinter, zwischen, gegenüber отвечаем на вопрос Wo? (где?): der и das становятся dem, die становится der.'],
		uk: ['dem і der після прийменника', 'Після neben, vor, hinter, zwischen, gegenüber відповідаємо на питання Wo? (де?): der і das стають dem, die стає der.'],
		en: ['dem and der after a preposition', 'After neben, vor, hinter, zwischen, gegenüber (answering Wo?, where?): der and das become dem, die becomes der.'],
		pl: ['dem i der po przyimku', 'Po neben, vor, hinter, zwischen, gegenüber odpowiadamy na pytanie Wo? (gdzie?): der i das zmieniają się w dem, die w der.'],
		es: ['dem y der tras la preposición', 'Después de neben, vor, hinter, zwischen, gegenüber (respondiendo a Wo?, ¿dónde?): der y das pasan a dem, die pasa a der.'],
		fr: ['dem et der après la préposition', 'Après neben, vor, hinter, zwischen, gegenüber (réponse à Wo ?, où ?) : der et das deviennent dem, die devient der.'],
		tr: ['Edattan sonra dem ve der', 'neben, vor, hinter, zwischen, gegenüber’den sonra (Wo?, nerede? sorusu): der ve das dem olur, die der olur.'],
		ro: ['dem și der după prepoziție', 'După neben, vor, hinter, zwischen, gegenüber (răspuns la Wo?, unde?): der și das devin dem, die devine der.'],
		uz: ["Ko'makchidan keyin dem va der", "neben, vor, hinter, zwischen, gegenüber dan keyin (Wo?, qayerda? savoli): der va das dem ga, die der ga aylanadi."],
		hi: ['संबंधसूचक के बाद dem और der', 'neben, vor, hinter, zwischen, gegenüber के बाद (Wo?, कहाँ? का जवाब): der और das बनते हैं dem, die बनता है der।'],
		ar: ['dem وder بعد حرف الجر', 'بعد neben وvor وhinter وzwischen وgegenüber (جواباً عن Wo؟، أين؟): تصبح der وdas ‏dem، وتصبح die ‏der.']
	},
	examples: [
		ex('Die Bank ist neben dem Park.', t11('Банк рядом с парком.', 'Банк поруч із парком.', 'The bank is next to the park.', 'Bank jest obok parku.', 'El banco está al lado del parque.', 'La banque est à côté du parc.', 'Banka parkın yanında.', 'Banca e lângă parc.', 'Bank park yonida.', 'बैंक पार्क के बगल में है।', 'البنك بجانب الحديقة.')),
		ex('Die Apotheke ist zwischen der Bank und der Bäckerei.', t11('Аптека между банком и пекарней.', 'Аптека між банком і пекарнею.', 'The pharmacy is between the bank and the bakery.', 'Apteka jest między bankiem a piekarnią.', 'La farmacia está entre el banco y la panadería.', 'La pharmacie est entre la banque et la boulangerie.', 'Eczane banka ile fırının arasında.', 'Farmacia e între bancă și brutărie.', 'Dorixona bank va novvoyxona orasida.', 'दवाखाना बैंक और बेकरी के बीच है।', 'الصيدلية بين البنك والمخبز.'))
	]
}

const quests = {
	'city-1': {
		title: t11('Город: учим слова с артиклем', 'Місто: вчимо слова з артиклем', 'The city: learn words with the article', 'Miasto: słowa z rodzajnikiem', 'La ciudad: palabras con artículo', 'La ville : les mots avec l’article', 'Şehir: kelimeleri artikeliyle öğren', 'Orașul: cuvinte cu articol', "Shahar: so'zlarni artikl bilan o'rganamiz", 'शहर: शब्द आर्टिकल के साथ', 'المدينة: الكلمات مع الأداة'),
		points: [
			{
				t: {
					ru: ['Род не угадать', 'Род у мест не совпадает с русским: der Platz (площадь), die Brücke (мост). Учи слово сразу с артиклем.'],
					uk: ['Рід не вгадати', 'Рід місць не збігається з українським: der Platz (площа), die Brücke (міст). Вчи слово одразу з артиклем.'],
					en: ['You can’t guess the gender', 'Place words have their own gender: der Platz (square), die Brücke (bridge). Learn each word with its article.'],
					pl: ['Rodzaju nie zgadniesz', 'Rodzaj miejsc nie zgadza się z polskim: der Platz (plac), die Brücke (most). Ucz się słowa od razu z rodzajnikiem.'],
					es: ['El género no se adivina', 'Los lugares tienen su género: der Platz (la plaza), die Brücke (el puente). Aprende cada palabra con su artículo.'],
					fr: ['Le genre ne se devine pas', 'Les lieux ont leur genre : der Platz (la place), die Brücke (le pont). Apprends chaque mot avec son article.'],
					tr: ['Cinsiyet tahmin edilmez', 'Yer adlarının kendi cinsiyeti var: der Platz (meydan), die Brücke (köprü). Kelimeyi artikeliyle öğren.'],
					ro: ['Genul nu se ghicește', 'Locurile au genul lor: der Platz (piața), die Brücke (podul). Învață cuvântul direct cu articolul.'],
					uz: ['Rodni taxmin qilib bo‘lmaydi', "Joy nomlarining o'z rodi bor: der Platz (maydon), die Brücke (ko'prik). So'zni artikli bilan o'rgan."],
					hi: ['लिंग का अंदाज़ा नहीं लगता', 'जगहों का अपना लिंग होता है: der Platz (चौक), die Brücke (पुल)। हर शब्द आर्टिकल के साथ सीखो।'],
					ar: ['لا يمكن تخمين الجنس', 'لأسماء الأماكن جنسها الخاص: der Platz (الساحة)، die Brücke (الجسر). احفظ كل كلمة مع أداتها.']
				},
				examples: [
					ex('die Straße, der Park, der Platz', t11('улица, парк, площадь', 'вулиця, парк, площа', 'the street, the park, the square', 'ulica, park, plac', 'la calle, el parque, la plaza', 'la rue, le parc, la place', 'cadde, park, meydan', 'strada, parcul, piața', "ko'cha, park, maydon", 'सड़क, पार्क, चौक', 'الشارع، الحديقة، الساحة'))
				]
			}
		]
	},

	'city-2': {
		title: t11('Транспорт', 'Транспорт', 'Transport', 'Transport', 'El transporte', 'Les transports', 'Ulaşım', 'Transportul', 'Transport', 'परिवहन', 'المواصلات'),
		points: [
			{
				t: {
					ru: ['Билет в Akkusativ', 'Новых правил нет. das Ticket не меняется: Ich kaufe ein Ticket.'],
					uk: ['Квиток в Akkusativ', 'Нових правил немає. das Ticket не змінюється: Ich kaufe ein Ticket.'],
					en: ['The ticket in the accusative', 'No new rules. das Ticket doesn’t change: Ich kaufe ein Ticket.'],
					pl: ['Bilet w Akkusativ', 'Bez nowych reguł. das Ticket się nie zmienia: Ich kaufe ein Ticket.'],
					es: ['El billete en acusativo', 'Sin reglas nuevas. das Ticket no cambia: Ich kaufe ein Ticket.'],
					fr: ['Le billet à l’accusatif', 'Pas de nouvelle règle. das Ticket ne change pas : Ich kaufe ein Ticket.'],
					tr: ['Akkusativ’de bilet', 'Yeni kural yok. das Ticket değişmez: Ich kaufe ein Ticket.'],
					ro: ['Biletul la acuzativ', 'Fără reguli noi. das Ticket nu se schimbă: Ich kaufe ein Ticket.'],
					uz: ['Chipta Akkusativda', "Yangi qoida yo'q. das Ticket o'zgarmaydi: Ich kaufe ein Ticket."],
					hi: ['Akkusativ में टिकट', 'कोई नया नियम नहीं। das Ticket नहीं बदलता: Ich kaufe ein Ticket।'],
					ar: ['التذكرة في حالة المفعول', 'لا قواعد جديدة. das Ticket لا تتغير: Ich kaufe ein Ticket.']
				},
				examples: [
					ex('Ich kaufe ein Ticket.', t11("Я покупаю билет.", "Я купую квиток.", "I’m buying a ticket.", "Kupuję bilet.", "Compro un billete.", "J’achète un billet.", "Bilet alıyorum.", "Cumpăr un bilet.", "Chipta sotib olaman.", "मैं टिकट खरीद रहा हूँ।", "أشتري تذكرة."))
				]
			}
		]
	},

	'city-3': {
		title: t11('Магазины: слова на -ei и -e', 'Магазини: слова на -ei та -e', 'Shops: words ending in -ei and -e', 'Sklepy: słowa na -ei i -e', 'Tiendas: palabras en -ei y -e', 'Les magasins : mots en -ei et -e', 'Dükkânlar: -ei ve -e ile biten kelimeler', 'Magazine: cuvinte în -ei și -e', "Do'konlar: -ei va -e bilan tugaydigan so'zlar", 'दुकानें: -ei और -e वाले शब्द', 'المتاجر: الكلمات المنتهية بـ -ei و-e'),
		points: [
			{
				t: {
					ru: ['Подсказка для рода', 'Слова на -ei всегда die: die Bäckerei. Слова на -e чаще всего тоже die: die Apotheke.'],
					uk: ['Підказка для роду', 'Слова на -ei завжди die: die Bäckerei. Слова на -e найчастіше теж die: die Apotheke.'],
					en: ['A gender tip', 'Words ending in -ei are always die: die Bäckerei. Words ending in -e are usually die too: die Apotheke.'],
					pl: ['Podpowiedź do rodzaju', 'Słowa na -ei są zawsze die: die Bäckerei. Słowa na -e najczęściej też die: die Apotheke.'],
					es: ['Truco para el género', 'Las palabras en -ei siempre son die: die Bäckerei. Las palabras en -e suelen ser die: die Apotheke.'],
					fr: ['Astuce pour le genre', 'Les mots en -ei sont toujours die : die Bäckerei. Les mots en -e sont le plus souvent die : die Apotheke.'],
					tr: ['Cinsiyet ipucu', '-ei ile biten kelimeler her zaman die: die Bäckerei. -e ile bitenler de çoğunlukla die: die Apotheke.'],
					ro: ['Truc pentru gen', 'Cuvintele în -ei sunt mereu die: die Bäckerei. Cele în -e sunt de obicei tot die: die Apotheke.'],
					uz: ['Rod uchun maslahat', "-ei bilan tugagan so'zlar doim die: die Bäckerei. -e bilan tugaganlar ham ko'pincha die: die Apotheke."],
					hi: ['लिंग का संकेत', '-ei वाले शब्द हमेशा die: die Bäckerei। -e वाले शब्द भी ज़्यादातर die: die Apotheke।'],
					ar: ['تلميح للجنس', 'الكلمات المنتهية بـ -ei دائماً die: die Bäckerei. والمنتهية بـ -e غالباً die أيضاً: die Apotheke.']
				},
				examples: [
					ex('die Bäckerei, die Apotheke, die Bank, der Supermarkt', t11('пекарня, аптека, банк, супермаркет', 'пекарня, аптека, банк, супермаркет', 'bakery, pharmacy, bank, supermarket', 'piekarnia, apteka, bank, supermarket', 'panadería, farmacia, banco, supermercado', 'boulangerie, pharmacie, banque, supermarché', 'fırın, eczane, banka, süpermarket', 'brutărie, farmacie, bancă, supermarket', 'novvoyxona, dorixona, bank, supermarket', 'बेकरी, दवाखाना, बैंक, सुपरमार्केट', 'المخبز، الصيدلية، البنك، السوبرماركت'))
				]
			}
		]
	},

	'city-4': {
		title: t11('На улице: слова на -ung', 'На вулиці: слова на -ung', 'In the street: words ending in -ung', 'Na ulicy: słowa na -ung', 'En la calle: palabras en -ung', 'Dans la rue : mots en -ung', 'Sokakta: -ung ile biten kelimeler', 'Pe stradă: cuvinte în -ung', "Ko'chada: -ung bilan tugaydigan so'zlar", 'सड़क पर: -ung वाले शब्द', 'في الشارع: الكلمات المنتهية بـ -ung'),
		points: [
			{
				t: {
					ru: ['-ung всегда die', 'Слова на -ung всегда женского рода: die Kreuzung, die Wohnung, die Zeitung.'],
					uk: ['-ung завжди die', 'Слова на -ung завжди жіночого роду: die Kreuzung, die Wohnung, die Zeitung.'],
					en: ['-ung is always die', 'Words ending in -ung are always feminine: die Kreuzung, die Wohnung, die Zeitung.'],
					pl: ['-ung zawsze die', 'Słowa na -ung są zawsze rodzaju żeńskiego: die Kreuzung, die Wohnung, die Zeitung.'],
					es: ['-ung siempre die', 'Las palabras en -ung siempre son femeninas: die Kreuzung, die Wohnung, die Zeitung.'],
					fr: ['-ung toujours die', 'Les mots en -ung sont toujours féminins : die Kreuzung, die Wohnung, die Zeitung.'],
					tr: ['-ung her zaman die', '-ung ile biten kelimeler her zaman dişildir: die Kreuzung, die Wohnung, die Zeitung.'],
					ro: ['-ung mereu die', 'Cuvintele în -ung sunt mereu feminine: die Kreuzung, die Wohnung, die Zeitung.'],
					uz: ['-ung doim die', "-ung bilan tugagan so'zlar doim ayol rodida: die Kreuzung, die Wohnung, die Zeitung."],
					hi: ['-ung हमेशा die', '-ung वाले शब्द हमेशा स्त्रीलिंग: die Kreuzung, die Wohnung, die Zeitung।'],
					ar: ['-ung دائماً die', 'الكلمات المنتهية بـ -ung مؤنثة دائماً: die Kreuzung، die Wohnung، die Zeitung.']
				},
				examples: [
					ex('die Haltestelle, die Kreuzung, die Ampel', t11('остановка, перекрёсток, светофор', 'зупинка, перехрестя, світлофор', 'the stop, the crossroads, the traffic light', 'przystanek, skrzyżowanie, sygnalizacja', 'la parada, el cruce, el semáforo', 'l’arrêt, le carrefour, le feu', 'durak, kavşak, trafik lambası', 'stația, intersecția, semaforul', "bekat, chorraha, svetofor", 'स्टॉप, चौराहा, ट्रैफ़िक लाइट', 'الموقف، التقاطع، إشارة المرور'))
				]
			}
		]
	},

	'city-5': {
		title: t11('Кафе и отдых: международные слова', 'Кафе й відпочинок: міжнародні слова', 'Cafés and leisure: international words', 'Kawiarnia i odpoczynek: słowa międzynarodowe', 'Café y ocio: palabras internacionales', 'Café et loisirs : mots internationaux', 'Kafe ve eğlence: uluslararası kelimeler', 'Cafenea și timp liber: cuvinte internaționale', "Kafe va dam olish: xalqaro so'zlar", 'कैफ़े और आराम: अंतरराष्ट्रीय शब्द', 'المقهى والترفيه: كلمات عالمية'),
		points: [
			{
				t: {
					ru: ['Часто das', 'Международные слова часто среднего рода: das Restaurant, das Café, das Hotel, das Museum.'],
					uk: ['Часто das', 'Міжнародні слова часто середнього роду: das Restaurant, das Café, das Hotel, das Museum.'],
					en: ['Often das', 'International words are often neuter: das Restaurant, das Café, das Hotel, das Museum.'],
					pl: ['Często das', 'Słowa międzynarodowe są często rodzaju nijakiego: das Restaurant, das Café, das Hotel, das Museum.'],
					es: ['A menudo das', 'Las palabras internacionales suelen ser neutras: das Restaurant, das Café, das Hotel, das Museum.'],
					fr: ['Souvent das', 'Les mots internationaux sont souvent neutres : das Restaurant, das Café, das Hotel, das Museum.'],
					tr: ['Çoğu zaman das', 'Uluslararası kelimeler çoğunlukla nötrdür: das Restaurant, das Café, das Hotel, das Museum.'],
					ro: ['Des das', 'Cuvintele internaționale sunt des neutre: das Restaurant, das Café, das Hotel, das Museum.'],
					uz: ["Ko'pincha das", "Xalqaro so'zlar ko'pincha o'rta rodda: das Restaurant, das Café, das Hotel, das Museum."],
					hi: ['अक्सर das', 'अंतरराष्ट्रीय शब्द अक्सर नपुंसकलिंग होते हैं: das Restaurant, das Café, das Hotel, das Museum।'],
					ar: ['غالباً das', 'الكلمات العالمية غالباً محايدة: das Restaurant، das Café، das Hotel، das Museum.']
				},
				examples: [
					ex('Hier ist das Café und dort ist das Museum.', t11('Здесь кафе, а там музей.', 'Тут кафе, а там музей.', 'Here is the café and there is the museum.', 'Tu jest kawiarnia, a tam muzeum.', 'Aquí está el café y allí el museo.', 'Ici, c’est le café et là-bas, le musée.', 'Burada kafe, orada müze var.', 'Aici e cafeneaua, iar acolo muzeul.', 'Bu yerda kafe, u yerda muzey.', 'यहाँ कैफ़े है और वहाँ संग्रहालय।', 'هنا المقهى وهناك المتحف.'))
				]
			}
		]
	},

	'city-6': {
		title: t11('Соединяем места: und и sind', 'Поєднуємо місця: und і sind', 'Joining places: und and sind', 'Łączymy miejsca: und i sind', 'Unimos lugares: und y sind', 'Relier les lieux : und et sind', 'Yerleri birleştirmek: und ve sind', 'Legăm locurile: und și sind', 'Joylarni bog‘laymiz: und va sind', 'जगहों को जोड़ना: und और sind', 'ربط الأماكن: und وsind'),
		points: [
			{
				t: {
					ru: ['Два места: sind', 'Если мест два и больше, глагол sind, а не ist.'],
					uk: ['Два місця: sind', 'Якщо місць два й більше, дієслово sind, а не ist.'],
					en: ['Two places: sind', 'With two or more places, the verb is sind, not ist.'],
					pl: ['Dwa miejsca: sind', 'Gdy miejsc jest dwa lub więcej, czasownik to sind, a nie ist.'],
					es: ['Dos lugares: sind', 'Con dos o más lugares, el verbo es sind, no ist.'],
					fr: ['Deux lieux : sind', 'Avec deux lieux ou plus, le verbe est sind, pas ist.'],
					tr: ['İki yer: sind', 'İki ya da daha fazla yer varsa fiil ist değil sind olur.'],
					ro: ['Două locuri: sind', 'Cu două sau mai multe locuri, verbul e sind, nu ist.'],
					uz: ['Ikki joy: sind', "Ikki va undan ko'p joy bo'lsa, fe'l ist emas, sind."],
					hi: ['दो जगहें: sind', 'दो या ज़्यादा जगहें हों तो क्रिया ist नहीं, sind होती है।'],
					ar: ['مكانان: sind', 'إذا كان هناك مكانان أو أكثر يكون الفعل sind وليس ist.']
				},
				examples: [
					ex('Der Bahnhof und die U-Bahn sind hier.', t11('Вокзал и метро здесь.', 'Вокзал і метро тут.', 'The station and the underground are here.', 'Dworzec i metro są tutaj.', 'La estación y el metro están aquí.', 'La gare et le métro sont ici.', 'İstasyon ve metro burada.', 'Gara și metroul sunt aici.', 'Vokzal va metro shu yerda.', 'स्टेशन और मेट्रो यहाँ हैं।', 'المحطة والمترو هنا.'))
				]
			}
		]
	},

	'city-7': {
		title: t11('Направления: links, rechts, geradeaus', 'Напрямки: links, rechts, geradeaus', 'Directions: links, rechts, geradeaus', 'Kierunki: links, rechts, geradeaus', 'Direcciones: links, rechts, geradeaus', 'Directions : links, rechts, geradeaus', 'Yönler: links, rechts, geradeaus', 'Direcții: links, rechts, geradeaus', "Yo'nalishlar: links, rechts, geradeaus", 'दिशाएँ: links, rechts, geradeaus', 'الاتجاهات: links وrechts وgeradeaus'),
		points: [
			{
				t: {
					ru: ['Слова не меняются', 'links (слева), rechts (справа), geradeaus (прямо), gegenüber (напротив) стоят после ist и не меняются.'],
					uk: ['Слова не змінюються', 'links (ліворуч), rechts (праворуч), geradeaus (прямо), gegenüber (навпроти) стоять після ist і не змінюються.'],
					en: ['These words don’t change', 'links (left), rechts (right), geradeaus (straight on), gegenüber (opposite) come after ist and don’t change.'],
					pl: ['Te słowa się nie zmieniają', 'links (po lewej), rechts (po prawej), geradeaus (prosto), gegenüber (naprzeciwko) stoją po ist i się nie zmieniają.'],
					es: ['No cambian', 'links (a la izquierda), rechts (a la derecha), geradeaus (recto), gegenüber (enfrente) van tras ist y no cambian.'],
					fr: ['Ces mots ne changent pas', 'links (à gauche), rechts (à droite), geradeaus (tout droit), gegenüber (en face) viennent après ist et ne changent pas.'],
					tr: ['Değişmezler', 'links (solda), rechts (sağda), geradeaus (düz), gegenüber (karşıda) ist’ten sonra gelir ve değişmez.'],
					ro: ['Nu se schimbă', 'links (în stânga), rechts (în dreapta), geradeaus (înainte), gegenüber (vizavi) vin după ist și nu se schimbă.'],
					uz: ["O'zgarmaydi", "links (chapda), rechts (o'ngda), geradeaus (to'g'riga), gegenüber (qarshisida) ist dan keyin keladi va o'zgarmaydi."],
					hi: ['ये शब्द नहीं बदलते', 'links (बाएँ), rechts (दाएँ), geradeaus (सीधे), gegenüber (सामने) ist के बाद आते हैं और नहीं बदलते।'],
					ar: ['لا تتغير', 'links (يساراً)، rechts (يميناً)، geradeaus (إلى الأمام)، gegenüber (مقابل) تأتي بعد ist ولا تتغير.']
				},
				examples: [
					ex('Die Bank ist links.', t11('Банк слева.', 'Банк ліворуч.', 'The bank is on the left.', 'Bank jest po lewej.', 'El banco está a la izquierda.', 'La banque est à gauche.', 'Banka solda.', 'Banca e în stânga.', 'Bank chapda.', 'बैंक बाईं ओर है।', 'البنك على اليسار.')),
					ex('Das Hotel ist gegenüber dem Museum.', t11('Отель напротив музея.', 'Готель навпроти музею.', 'The hotel is opposite the museum.', 'Hotel jest naprzeciwko muzeum.', 'El hotel está enfrente del museo.', 'L’hôtel est en face du musée.', 'Otel müzenin karşısında.', 'Hotelul e vizavi de muzeu.', 'Mehmonxona muzey qarshisida.', 'होटल संग्रहालय के सामने है।', 'الفندق مقابل المتحف.'))
				]
			}
		]
	},

	'city-8': {
		title: t11('Где находится: neben, vor, hinter, zwischen', 'Де знаходиться: neben, vor, hinter, zwischen', 'Where is it: neben, vor, hinter, zwischen', 'Gdzie jest: neben, vor, hinter, zwischen', 'Dónde está: neben, vor, hinter, zwischen', 'Où est-ce : neben, vor, hinter, zwischen', 'Nerede: neben, vor, hinter, zwischen', 'Unde se află: neben, vor, hinter, zwischen', 'Qayerda: neben, vor, hinter, zwischen', 'कहाँ है: neben, vor, hinter, zwischen', 'أين يقع: neben وvor وhinter وzwischen'),
		points: [
			{
				t: {
					ru: ['Что значат предлоги', 'neben (рядом с), vor (перед), hinter (за), zwischen (между).'],
					uk: ['Що означають прийменники', 'neben (поруч із), vor (перед), hinter (за), zwischen (між).'],
					en: ['What the prepositions mean', 'neben (next to), vor (in front of), hinter (behind), zwischen (between).'],
					pl: ['Co znaczą przyimki', 'neben (obok), vor (przed), hinter (za), zwischen (między).'],
					es: ['Qué significan', 'neben (al lado de), vor (delante de), hinter (detrás de), zwischen (entre).'],
					fr: ['Ce que veulent dire les prépositions', 'neben (à côté de), vor (devant), hinter (derrière), zwischen (entre).'],
					tr: ['Edatların anlamı', 'neben (yanında), vor (önünde), hinter (arkasında), zwischen (arasında).'],
					ro: ['Ce înseamnă prepozițiile', 'neben (lângă), vor (în fața), hinter (în spatele), zwischen (între).'],
					uz: ["Ko'makchilar ma'nosi", "neben (yonida), vor (oldida), hinter (orqasida), zwischen (orasida)."],
					hi: ['संबंधसूचकों का अर्थ', 'neben (बगल में), vor (सामने), hinter (पीछे), zwischen (बीच में)।'],
					ar: ['معاني الحروف', 'neben (بجانب)، vor (أمام)، hinter (خلف)، zwischen (بين).']
				},
				examples: [
					ex('Das Café ist vor dem Museum.', t11('Кафе перед музеем.', 'Кафе перед музеєм.', 'The café is in front of the museum.', 'Kawiarnia jest przed muzeum.', 'El café está delante del museo.', 'Le café est devant le musée.', 'Kafe müzenin önünde.', 'Cafeneaua e în fața muzeului.', 'Kafe muzey oldida.', 'कैफ़े संग्रहालय के सामने है।', 'المقهى أمام المتحف.')),
					ex('Die U-Bahn ist hinter dem Bahnhof.', t11('Метро за вокзалом.', 'Метро за вокзалом.', 'The underground is behind the station.', 'Metro jest za dworcem.', 'El metro está detrás de la estación.', 'Le métro est derrière la gare.', 'Metro istasyonun arkasında.', 'Metroul e în spatele gării.', 'Metro vokzal orqasida.', 'मेट्रो स्टेशन के पीछे है।', 'المترو خلف المحطة.'))
				]
			},
			datPoint
		]
	},

	'city-9': {
		title: t11('Службы в городе', 'Служби в місті', 'City services', 'Usługi w mieście', 'Servicios de la ciudad', 'Les services de la ville', 'Şehirdeki hizmetler', 'Servicii în oraș', 'Shahar xizmatlari', 'शहर की सेवाएँ', 'خدمات المدينة'),
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Krankenhaus = krank (больной) + Haus (дом). Род от последней части: das Haus, значит das Krankenhaus.'],
					uk: ['Нових правил немає', 'Krankenhaus = krank (хворий) + Haus (будинок). Рід від останньої частини: das Haus, отже das Krankenhaus.'],
					en: ['No new rules', 'Krankenhaus = krank (ill) + Haus (house). The gender comes from the last part: das Haus, so das Krankenhaus.'],
					pl: ['Bez nowych reguł', 'Krankenhaus = krank (chory) + Haus (dom). Rodzaj od ostatniej części: das Haus, więc das Krankenhaus.'],
					es: ['Sin reglas nuevas', 'Krankenhaus = krank (enfermo) + Haus (casa). El género viene de la última parte: das Haus, entonces das Krankenhaus.'],
					fr: ['Pas de nouvelle règle', 'Krankenhaus = krank (malade) + Haus (maison). Le genre vient de la dernière partie : das Haus, donc das Krankenhaus.'],
					tr: ['Yeni kural yok', 'Krankenhaus = krank (hasta) + Haus (ev). Cinsiyet son parçadan gelir: das Haus, yani das Krankenhaus.'],
					ro: ['Fără reguli noi', 'Krankenhaus = krank (bolnav) + Haus (casă). Genul vine de la ultima parte: das Haus, deci das Krankenhaus.'],
					uz: ["Yangi qoida yo'q", "Krankenhaus = krank (kasal) + Haus (uy). Rod oxirgi qismdan: das Haus, demak das Krankenhaus."],
					hi: ['कोई नया नियम नहीं', 'Krankenhaus = krank (बीमार) + Haus (घर)। लिंग आखिरी हिस्से से: das Haus, इसलिए das Krankenhaus।'],
					ar: ['لا قواعد جديدة', 'Krankenhaus = krank (مريض) + Haus (بيت). الجنس من الجزء الأخير: das Haus، إذن das Krankenhaus.']
				},
				examples: [
					ex('die Post, die Polizei, das Krankenhaus, die Schule', t11('почта, полиция, больница, школа', 'пошта, поліція, лікарня, школа', 'post office, police, hospital, school', 'poczta, policja, szpital, szkoła', 'correos, policía, hospital, escuela', 'la poste, la police, l’hôpital, l’école', 'postane, polis, hastane, okul', 'poșta, poliția, spitalul, școala', 'pochta, politsiya, kasalxona, maktab', 'डाकघर, पुलिस, अस्पताल, स्कूल', 'البريد، الشرطة، المستشفى، المدرسة'))
				]
			}
		]
	},

	'city-10': {
		title: t11('Маршрут по городу', 'Маршрут містом', 'A route through the city', 'Trasa po mieście', 'Una ruta por la ciudad', 'Un itinéraire en ville', 'Şehirde bir rota', 'Un traseu prin oraș', "Shahar bo'ylab yo'nalish", 'शहर में रास्ता', 'مسار في المدينة'),
		points: [datPoint]
	},

	'city-11': {
		title: t11('Спросить дорогу', 'Запитати дорогу', 'Asking the way', 'Zapytać o drogę', 'Preguntar el camino', 'Demander son chemin', 'Yol sormak', 'Să întrebi de drum', "Yo'l so'rash", 'रास्ता पूछना', 'السؤال عن الطريق'),
		points: [
			{
				t: {
					ru: ['Вежливое начало', 'Начинаем с Entschuldigung!, потом Wo ist...? Глагол сразу после wo.'],
					uk: ['Ввічливий початок', 'Починаємо з Entschuldigung!, потім Wo ist...? Дієслово одразу після wo.'],
					en: ['A polite start', 'Start with Entschuldigung!, then Wo ist...? The verb comes right after wo.'],
					pl: ['Grzeczny początek', 'Zaczynamy od Entschuldigung!, potem Wo ist...? Czasownik zaraz po wo.'],
					es: ['Un comienzo educado', 'Empezamos con Entschuldigung!, luego Wo ist...? El verbo va justo después de wo.'],
					fr: ['Un début poli', 'On commence par Entschuldigung !, puis Wo ist... ? Le verbe vient juste après wo.'],
					tr: ['Kibar başlangıç', 'Entschuldigung! ile başlarız, sonra Wo ist...? Fiil wo’dan hemen sonra.'],
					ro: ['Un început politicos', 'Începem cu Entschuldigung!, apoi Wo ist...? Verbul vine imediat după wo.'],
					uz: ['Muloyim boshlanish', "Entschuldigung! bilan boshlaymiz, keyin Wo ist...? Fe'l wo dan keyin darhol."],
					hi: ['विनम्र शुरुआत', 'Entschuldigung! से शुरू करो, फिर Wo ist...? क्रिया wo के ठीक बाद।'],
					ar: ['بداية مهذبة', 'نبدأ بـ Entschuldigung! ثم Wo ist...؟ والفعل مباشرة بعد wo.']
				},
				examples: [
					ex('Entschuldigung, wo ist der Park?', t11('Извините, где парк?', 'Перепрошую, де парк?', 'Excuse me, where is the park?', 'Przepraszam, gdzie jest park?', 'Perdone, ¿dónde está el parque?', 'Excusez-moi, où est le parc ?', 'Affedersiniz, park nerede?', 'Scuzați-mă, unde e parcul?', 'Kechirasiz, park qayerda?', 'माफ़ कीजिए, पार्क कहाँ है?', 'عذراً، أين الحديقة؟')),
					ex('Das Hotel ist neben der Bank.', t11('Отель рядом с банком.', 'Готель поруч із банком.', 'The hotel is next to the bank.', 'Hotel jest obok banku.', 'El hotel está al lado del banco.', 'L’hôtel est à côté de la banque.', 'Otel bankanın yanında.', 'Hotelul e lângă bancă.', 'Mehmonxona bank yonida.', 'होटल बैंक के बगल में है।', 'الفندق بجانب البنك.'))
				]
			}
		]
	},

	'city-12': {
		title: t11('Вход и выход', 'Вхід і вихід', 'Entrance and exit', 'Wejście i wyjście', 'Entrada y salida', 'Entrée et sortie', 'Giriş ve çıkış', 'Intrare și ieșire', 'Kirish va chiqish', 'प्रवेश और निकास', 'المدخل والمخرج'),
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'der Eingang (вход) и der Ausgang (выход): ein = в, aus = из.'],
					uk: ['Нових правил немає', 'der Eingang (вхід) і der Ausgang (вихід): ein = у, aus = з.'],
					en: ['No new rules', 'der Eingang (entrance) and der Ausgang (exit): ein = in, aus = out.'],
					pl: ['Bez nowych reguł', 'der Eingang (wejście) i der Ausgang (wyjście): ein = do, aus = z.'],
					es: ['Sin reglas nuevas', 'der Eingang (entrada) y der Ausgang (salida): ein = dentro, aus = fuera.'],
					fr: ['Pas de nouvelle règle', 'der Eingang (entrée) et der Ausgang (sortie) : ein = dedans, aus = dehors.'],
					tr: ['Yeni kural yok', 'der Eingang (giriş) ve der Ausgang (çıkış): ein = içeri, aus = dışarı.'],
					ro: ['Fără reguli noi', 'der Eingang (intrarea) și der Ausgang (ieșirea): ein = în, aus = din.'],
					uz: ["Yangi qoida yo'q", "der Eingang (kirish) va der Ausgang (chiqish): ein = ichkariga, aus = tashqariga."],
					hi: ['कोई नया नियम नहीं', 'der Eingang (प्रवेश) और der Ausgang (निकास): ein = अंदर, aus = बाहर।'],
					ar: ['لا قواعد جديدة', 'der Eingang (المدخل) وder Ausgang (المخرج): ein = إلى الداخل، aus = إلى الخارج.']
				},
				examples: [
					ex('Wo ist der Ausgang?', t11('Где выход?', 'Де вихід?', 'Where is the exit?', 'Gdzie jest wyjście?', '¿Dónde está la salida?', 'Où est la sortie ?', 'Çıkış nerede?', 'Unde e ieșirea?', 'Chiqish qayerda?', 'निकास कहाँ है?', 'أين المخرج؟'))
				]
			}
		]
	},

	'city-13': {
		title: t11('Достопримечательности', 'Пам’ятки', 'Sights', 'Zabytki', 'Lugares de interés', 'Les monuments', 'Görülecek yerler', 'Obiective turistice', 'Diqqatga sazovor joylar', 'दर्शनीय स्थल', 'المعالم'),
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Rathaus = Rat (совет) + Haus. Снова род от последней части: das Rathaus.'],
					uk: ['Нових правил немає', 'Rathaus = Rat (рада) + Haus. Знову рід від останньої частини: das Rathaus.'],
					en: ['No new rules', 'Rathaus = Rat (council) + Haus. Again the gender comes from the last part: das Rathaus.'],
					pl: ['Bez nowych reguł', 'Rathaus = Rat (rada) + Haus. Znów rodzaj od ostatniej części: das Rathaus.'],
					es: ['Sin reglas nuevas', 'Rathaus = Rat (consejo) + Haus. De nuevo el género viene de la última parte: das Rathaus.'],
					fr: ['Pas de nouvelle règle', 'Rathaus = Rat (conseil) + Haus. Encore une fois, le genre vient de la dernière partie : das Rathaus.'],
					tr: ['Yeni kural yok', 'Rathaus = Rat (meclis) + Haus. Yine cinsiyet son parçadan: das Rathaus.'],
					ro: ['Fără reguli noi', 'Rathaus = Rat (consiliu) + Haus. Din nou genul vine de la ultima parte: das Rathaus.'],
					uz: ["Yangi qoida yo'q", "Rathaus = Rat (kengash) + Haus. Yana rod oxirgi qismdan: das Rathaus."],
					hi: ['कोई नया नियम नहीं', 'Rathaus = Rat (परिषद) + Haus। फिर से लिंग आखिरी हिस्से से: das Rathaus।'],
					ar: ['لا قواعد جديدة', 'Rathaus = Rat (مجلس) + Haus. ومرة أخرى الجنس من الجزء الأخير: das Rathaus.']
				},
				examples: [
					ex('die Kirche, das Rathaus, der Markt, der Turm', t11('церковь, ратуша, рынок, башня', 'церква, ратуша, ринок, вежа', 'church, town hall, market, tower', 'kościół, ratusz, rynek, wieża', 'iglesia, ayuntamiento, mercado, torre', 'église, mairie, marché, tour', 'kilise, belediye binası, pazar, kule', 'biserica, primăria, piața, turnul', "cherkov, ratusha, bozor, minora", 'चर्च, टाउन हॉल, बाज़ार, मीनार', 'الكنيسة، دار البلدية، السوق، البرج'))
				]
			}
		]
	}
}

module.exports = quests
