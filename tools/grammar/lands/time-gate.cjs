// Грамматика к заданиям земли time-gate (Futur I, Perfekt и падежи вперемешку)
const { t11 } = require('../lib.cjs')
const pick = (land, questId, index) => {
	const quest = require(`./${land}.cjs`)[questId]
	if (!quest || !quest.points[index]) throw new Error(`time-gate: нет пункта ${land}/${questId}/${index}`)
	return quest.points[index]
}

const futur = pick('future-land', 'future-one', 0)
const perfekt = pick('past-land', 'past-one', 0)
const perfektSein = pick('past-land', 'past-two', 0)
const perfektSep = pick('past-land', 'past-three', 0)
const wechsel = pick('action-valley', 'action-four', 0)
const mitDat = pick('direction-prepositions', 'direction-prep-6', 0)
const neben = pick('order-valley', 'order-one', 0)

const T = (...v) => t11(...v)
const q = (title, points) => ({ title, points })

const quests = {
	'time-one': q(T('Знакомство и общение', 'Знайомство і спілкування', 'Meeting and talking', 'Poznawanie się i rozmowa', 'Conocerse y hablar', 'Rencontres et échanges', 'Tanışma ve sohbet', 'Cunoaștere și comunicare', 'Tanishuv va muloqot', 'मिलना और बातचीत', 'التعارف والتواصل'), [futur, perfekt]),
	'time-two': q(T('Futur, Perfekt, падежи', 'Futur, Perfekt, відмінки', 'Futur, Perfekt, cases', 'Futur, Perfekt, przypadki', 'Futur, Perfekt, casos', 'Futur, Perfekt, cas', 'Futur, Perfekt, hâller', 'Futur, Perfekt, cazuri', 'Futur, Perfekt, kelishiklar', 'Futur, Perfekt, कारक', 'Futur وPerfekt والحالات'), [futur, perfektSein]),
	'time-three': q(T('День в городе', 'День у місті', 'A day in town', 'Dzień w mieście', 'Un día en la ciudad', 'Une journée en ville', 'Şehirde bir gün', 'O zi în oraș', 'Shahardagi bir kun', 'शहर में एक दिन', 'يوم في المدينة'), [wechsel, perfekt]),
	'time-four': q(T('Работа и карьера', 'Робота й кар’єра', 'Work and career', 'Praca i kariera', 'Trabajo y carrera', 'Travail et carrière', 'İş ve kariyer', 'Muncă și carieră', 'Ish va martaba', 'काम और करियर', 'العمل والمهنة'), [perfektSein, neben]),
	'time-five': q(T('Время отпуска', 'Час відпустки', 'Holiday time', 'Czas urlopu', 'Tiempo de vacaciones', 'Le temps des vacances', 'Tatil zamanı', 'Timpul concediului', "Ta'til vaqti", 'छुट्टी का समय', 'وقت الإجازة'), [futur, perfektSein]),
	'time-six': q(T('Ужин в ресторане', 'Вечеря в ресторані', 'Dinner at a restaurant', 'Kolacja w restauracji', 'Cena en el restaurante', 'Dîner au restaurant', 'Restoranda akşam yemeği', 'Cina la restaurant', 'Restoranda kechki ovqat', 'रेस्टोरेंट में रात का खाना', 'العشاء في المطعم'), [futur, perfekt]),
	'time-seven': q(T('Хобби и досуг', 'Хобі й дозвілля', 'Hobbies and leisure', 'Hobby i czas wolny', 'Aficiones y ocio', 'Loisirs', 'Hobi ve boş zaman', 'Hobby și timp liber', "Xobbi va bo'sh vaqt", 'शौक और फ़ुर्सत', 'الهوايات ووقت الفراغ'), [perfektSein, neben]),
	'time-eight': q(T('Покупки и мода', 'Покупки й мода', 'Shopping and fashion', 'Zakupy i moda', 'Compras y moda', 'Courses et mode', 'Alışveriş ve moda', 'Cumpărături și modă', 'Xarid va moda', 'खरीदारी और फ़ैशन', 'التسوق والموضة'), [futur, wechsel]),
	'time-nine': q(T('Здоровье и спорт', 'Здоров’я і спорт', 'Health and sport', 'Zdrowie i sport', 'Salud y deporte', 'Santé et sport', 'Sağlık ve spor', 'Sănătate și sport', "Sog'liq va sport", 'स्वास्थ्य और खेल', 'الصحة والرياضة'), [wechsel, perfektSein]),
	'time-ten': q(T('Дом и быт', 'Дім і побут', 'Home and household', 'Dom i codzienność', 'Casa y hogar', 'Maison et quotidien', 'Ev ve gündelik hayat', 'Casă și gospodărie', "Uy va ro'zg'or", 'घर और रोज़मर्रा', 'البيت والحياة اليومية'), [perfektSep, futur]),
	'time-eleven': q(T('Учёба и языки', 'Навчання й мови', 'Study and languages', 'Nauka i języki', 'Estudios e idiomas', 'Études et langues', 'Eğitim ve diller', 'Studii și limbi', "O'qish va tillar", 'पढ़ाई और भाषाएँ', 'الدراسة واللغات'), [futur, perfektSein]),
	'time-twelve': q(T('Природа и погода', 'Природа й погода', 'Nature and weather', 'Przyroda i pogoda', 'Naturaleza y tiempo', 'Nature et météo', 'Doğa ve hava', 'Natură și vreme', 'Tabiat va ob-havo', 'प्रकृति और मौसम', 'الطبيعة والطقس'), [futur, perfektSein]),
	'time-thirteen': q(T('Транспорт и поездки', 'Транспорт і поїздки', 'Transport and trips', 'Transport i podróże', 'Transporte y viajes', 'Transports et trajets', 'Ulaşım ve yolculuk', 'Transport și călătorii', 'Transport va safarlar', 'परिवहन और यात्राएँ', 'النقل والرحلات'), [mitDat, perfektSein]),
	'time-fourteen': q(T('Мир технологий', 'Світ технологій', 'The world of technology', 'Świat technologii', 'El mundo de la tecnología', 'Le monde de la technologie', 'Teknoloji dünyası', 'Lumea tehnologiei', 'Texnologiyalar dunyosi', 'तकनीक की दुनिया', 'عالم التكنولوجيا'), [futur, perfekt]),
	'time-fifteen': q(T('Культура и искусство', 'Культура й мистецтво', 'Culture and art', 'Kultura i sztuka', 'Cultura y arte', 'Culture et art', 'Kültür ve sanat', 'Cultură și artă', "Madaniyat va san'at", 'संस्कृति और कला', 'الثقافة والفن'), [wechsel, perfektSein, futur])
}

module.exports = quests
