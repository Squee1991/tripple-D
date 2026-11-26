// Грамматика к заданиям земли secret-lands (прилагательное после ein, eine)
const { ex, t11, pt } = require('../lib.cjs')

const einTitle = ['После ein прилагательное показывает род', 'Після ein прикметник показує рід', 'After ein the adjective shows the gender', 'Po ein przymiotnik pokazuje rodzaj', 'Tras ein el adjetivo muestra el género', 'Après ein, l’adjectif montre le genre', 'ein’den sonra sıfat cinsiyeti gösterir', 'După ein adjectivul arată genul', "ein dan keyin sifat rodni ko'rsatadi", 'ein के बाद विशेषण लिंग बताता है', 'بعد ein تُظهر الصفة الجنس']
const einTexts = [
	'Подлежащее: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Так как у ein нет окончания, его «берёт» прилагательное.',
	'Підмет: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Оскільки в ein немає закінчення, його «бере» прикметник.',
	'Subject: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Since ein has no ending, the adjective takes it.',
	'Podmiot: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Ponieważ ein nie ma końcówki, „bierze” ją przymiotnik.',
	'Sujeto: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Como ein no tiene terminación, la lleva el adjetivo.',
	'Sujet : ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Comme ein n’a pas de terminaison, c’est l’adjectif qui la prend.',
	'Özne: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). ein ek almadığı için eki sıfat alır.',
	'Subiect: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). Pentru că ein nu are terminație, o preia adjectivul.',
	"Ega: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es). ein da qo'shimcha yo'qligi uchun uni sifat oladi.",
	'कर्ता: ein alter Mann (der, -er), eine junge Frau (die, -e), ein kleines Kind (das, -es)। ein का कोई अंत नहीं, इसलिए अंत विशेषण लेता है।',
	'الفاعل: ein alter Mann (der, -er)، eine junge Frau (die, -e)، ein kleines Kind (das, -es). ولأن ein بلا نهاية تأخذها الصفة.'
]
const akkTitle = ['Akkusativ: einen neuen', 'Akkusativ: einen neuen', 'Accusative: einen neuen', 'Akkusativ: einen neuen', 'Acusativo: einen neuen', 'Accusatif : einen neuen', 'Akkusativ: einen neuen', 'Acuzativ: einen neuen', 'Akkusativ: einen neuen', 'Akkusativ: einen neuen', 'المفعول: einen neuen']
const akkTexts = [
	'В Akkusativ меняется только мужской род: einen neuen Schrank. Женский и средний как в подлежащем: eine leckere Pizza, ein schönes Kleid.',
	'В Akkusativ змінюється лише чоловічий рід: einen neuen Schrank. Жіночий і середній як у підметі: eine leckere Pizza, ein schönes Kleid.',
	'In the accusative only masculine changes: einen neuen Schrank. Feminine and neuter stay as for the subject: eine leckere Pizza, ein schönes Kleid.',
	'W Akkusativ zmienia się tylko rodzaj męski: einen neuen Schrank. Żeński i nijaki jak w podmiocie: eine leckere Pizza, ein schönes Kleid.',
	'En acusativo solo cambia el masculino: einen neuen Schrank. Femenino y neutro como en el sujeto: eine leckere Pizza, ein schönes Kleid.',
	'À l’accusatif, seul le masculin change : einen neuen Schrank. Féminin et neutre comme pour le sujet : eine leckere Pizza, ein schönes Kleid.',
	'Akkusativ’de sadece eril değişir: einen neuen Schrank. Dişil ve nötr öznedeki gibi: eine leckere Pizza, ein schönes Kleid.',
	'La acuzativ se schimbă doar masculinul: einen neuen Schrank. Femininul și neutrul ca la subiect: eine leckere Pizza, ein schönes Kleid.',
	"Akkusativda faqat erkak rodi o'zgaradi: einen neuen Schrank. Ayol va o'rta rod egadagi kabi: eine leckere Pizza, ein schönes Kleid.",
	'Akkusativ में सिर्फ़ पुल्लिंग बदलता है: einen neuen Schrank। स्त्रीलिंग और नपुंसकलिंग कर्ता जैसे: eine leckere Pizza, ein schönes Kleid।',
	'في المفعول يتغير المذكر فقط: einen neuen Schrank. والمؤنث والمحايد كما في الفاعل: eine leckere Pizza، ein schönes Kleid.'
]
const datTitle = ['Dativ: всегда -en', 'Dativ: завжди -en', 'Dative: always -en', 'Dativ: zawsze -en', 'Dativo: siempre -en', 'Datif : toujours -en', 'Dativ: her zaman -en', 'Dativ: mereu -en', 'Dativ: doim -en', 'Dativ: हमेशा -en', 'الجر: دائماً -en']
const datTexts = [
	'После einem и einer прилагательное всегда с -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'Після einem і einer прикметник завжди з -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'After einem and einer the adjective always ends in -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'Po einem i einer przymiotnik zawsze z -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'Tras einem y einer el adjetivo siempre lleva -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'Après einem et einer, l’adjectif prend toujours -en : in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'einem ve einer’den sonra sıfat her zaman -en alır: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	'După einem și einer adjectivul are mereu -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.',
	"einem va einer dan keyin sifat doim -en oladi: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund.",
	'einem और einer के बाद विशेषण हमेशा -en: in einem großen Haus, in einer kleinen Wohnung, mit einem guten Freund।',
	'بعد einem وeiner تأخذ الصفة دائماً -en: in einem großen Haus، in einer kleinen Wohnung، mit einem guten Freund.'
]

const einPoint = (e) => pt(einTitle, einTexts, [e])
const akkPoint = (e) => pt(akkTitle, akkTexts, [e])
const datPoint = (e) => pt(datTitle, datTexts, [e])
const T = (...v) => t11(...v)
const titleEin = t11('ein + прилагательное', 'ein + прикметник', 'ein + adjective', 'ein + przymiotnik', 'ein + adjetivo', 'ein + adjectif', 'ein + sıfat', 'ein + adjectiv', 'ein + sifat', 'ein + विशेषण', 'ein + صفة')

const quests = {
	'secret-one': { title: T('ein + прилагательное: старт', 'ein + прикметник: старт', 'ein + adjective: start', 'ein + przymiotnik: start', 'ein + adjetivo: inicio', 'ein + adjectif : début', 'ein + sıfat: başlangıç', 'ein + adjectiv: start', 'ein + sifat: boshlanish', 'ein + विशेषण: शुरुआत', 'ein + صفة: البداية'), points: [einPoint(ex('Ein alter Mann hat im Park gewartet.', T('Пожилой мужчина ждал в парке.', 'Літній чоловік чекав у парку.', 'An old man waited in the park.', 'Starszy pan czekał w parku.', 'Un hombre mayor esperó en el parque.', 'Un vieil homme a attendu dans le parc.', 'Yaşlı bir adam parkta bekledi.', 'Un bătrân a așteptat în parc.', 'Bir qariya parkda kutdi.', 'एक बूढ़े आदमी ने पार्क में इंतज़ार किया।', 'انتظر رجل عجوز في الحديقة.')))] },
	'secret-two': { title: titleEin, points: [akkPoint(ex('Er wird einen neuen Schrank kaufen.', T('Он купит новый шкаф.', 'Він купить нову шафу.', 'He’ll buy a new wardrobe.', 'Kupi nową szafę.', 'Comprará un armario nuevo.', 'Il va acheter une nouvelle armoire.', 'Yeni bir dolap alacak.', 'Va cumpăra un dulap nou.', 'U yangi shkaf sotib oladi.', 'वह एक नई अलमारी खरीदेगा।', 'سيشتري خزانة جديدة.')))] },
	'secret-three': { title: titleEin, points: [akkPoint(ex('Er wird einen langen Brief schreiben.', T('Он напишет длинное письмо.', 'Він напише довгий лист.', 'He’ll write a long letter.', 'Napisze długi list.', 'Escribirá una carta larga.', 'Il va écrire une longue lettre.', 'Uzun bir mektup yazacak.', 'Va scrie o scrisoare lungă.', 'U uzun xat yozadi.', 'वह एक लंबी चिट्ठी लिखेगा।', 'سيكتب رسالة طويلة.')))] },
	'secret-four': { title: T('Одежда и еда', 'Одяг і їжа', 'Clothes and food', 'Ubrania i jedzenie', 'Ropa y comida', 'Vêtements et nourriture', 'Kıyafet ve yemek', 'Haine și mâncare', 'Kiyim va taom', 'कपड़े और खाना', 'الملابس والطعام'), points: [akkPoint(ex('Wir haben ein schönes Kleid gekauft.', T('Мы купили красивое платье.', 'Ми купили гарну сукню.', 'We bought a beautiful dress.', 'Kupiliśmy piękną sukienkę.', 'Compramos un vestido bonito.', 'Nous avons acheté une belle robe.', 'Güzel bir elbise aldık.', 'Am cumpărat o rochie frumoasă.', "Biz chiroyli ko'ylak sotib oldik.", 'हमने एक सुंदर ड्रेस खरीदी।', 'اشترينا فستاناً جميلاً.')))] },
	'secret-five': { title: T('Бытовые дела', 'Побутові справи', 'Everyday life', 'Sprawy codzienne', 'La vida diaria', 'La vie quotidienne', 'Gündelik işler', 'Treburi zilnice', 'Kundalik ishlar', 'रोज़मर्रा के काम', 'الشؤون اليومية'), points: [akkPoint(ex('Ich werde einen kalten Saft trinken.', T('Я выпью холодный сок.', 'Я вип’ю холодний сік.', 'I’ll drink a cold juice.', 'Wypiję zimny sok.', 'Me tomaré un zumo frío.', 'Je vais boire un jus froid.', 'Soğuk bir meyve suyu içeceğim.', 'Voi bea un suc rece.', 'Sovuq sharbat ichaman.', 'मैं ठंडा जूस पिऊँगा।', 'سأشرب عصيراً بارداً.')))] },
	'secret-six': { title: titleEin, points: [akkPoint(ex('Sie hat einen bequemen Stuhl gefunden.', T('Она нашла удобный стул.', 'Вона знайшла зручний стілець.', 'She found a comfortable chair.', 'Znalazła wygodne krzesło.', 'Encontró una silla cómoda.', 'Elle a trouvé une chaise confortable.', 'Rahat bir sandalye buldu.', 'A găsit un scaun comod.', 'U qulay stul topdi.', 'उसे एक आरामदायक कुर्सी मिली।', 'وجدت كرسياً مريحاً.')))] },
	'secret-seven': { title: titleEin, points: [einPoint(ex('Im Zimmer steht ein alter Schrank.', T('В комнате стоит старый шкаф.', 'У кімнаті стоїть стара шафа.', 'There’s an old wardrobe in the room.', 'W pokoju stoi stara szafa.', 'En la habitación hay un armario viejo.', 'Dans la chambre, il y a une vieille armoire.', 'Odada eski bir dolap var.', 'În cameră e un dulap vechi.', 'Xonada eski shkaf turibdi.', 'कमरे में एक पुरानी अलमारी है।', 'في الغرفة خزانة قديمة.')))] },
	'secret-eight': { title: T('Dativ: einer kleinen', 'Dativ: einer kleinen', 'Dative: einer kleinen', 'Dativ: einer kleinen', 'Dativo: einer kleinen', 'Datif : einer kleinen', 'Dativ: einer kleinen', 'Dativ: einer kleinen', 'Dativ: einer kleinen', 'Dativ: einer kleinen', 'الجر: einer kleinen'), points: [datPoint(ex('Sie wohnen in einer kleinen Wohnung.', T('Они живут в маленькой квартире.', 'Вони живуть у маленькій квартирі.', 'They live in a small flat.', 'Mieszkają w małym mieszkaniu.', 'Viven en un piso pequeño.', 'Ils habitent dans un petit appartement.', 'Küçük bir dairede oturuyorlar.', 'Locuiesc într-un apartament mic.', 'Ular kichik kvartirada yashaydi.', 'वे एक छोटे फ़्लैट में रहते हैं।', 'يسكنون في شقة صغيرة.')))] },
	'secret-nine': { title: T('Dativ: einem großen', 'Dativ: einem großen', 'Dative: einem großen', 'Dativ: einem großen', 'Dativo: einem großen', 'Datif : einem großen', 'Dativ: einem großen', 'Dativ: einem großen', 'Dativ: einem großen', 'Dativ: einem großen', 'الجر: einem großen'), points: [datPoint(ex('Sie wohnt in einem großen Haus.', T('Она живёт в большом доме.', 'Вона живе у великому будинку.', 'She lives in a big house.', 'Ona mieszka w dużym domu.', 'Vive en una casa grande.', 'Elle habite dans une grande maison.', 'Büyük bir evde oturuyor.', 'Locuiește într-o casă mare.', 'U katta uyda yashaydi.', 'वह एक बड़े घर में रहती है।', 'تسكن في بيت كبير.')))] },
	'secret-ten': { title: titleEin, points: [akkPoint(ex('Er hat einen alten Schlüssel gefunden.', T('Он нашёл старый ключ.', 'Він знайшов старий ключ.', 'He found an old key.', 'Znalazł stary klucz.', 'Encontró una llave vieja.', 'Il a trouvé une vieille clé.', 'Eski bir anahtar buldu.', 'A găsit o cheie veche.', 'U eski kalit topdi.', 'उसे एक पुरानी चाबी मिली।', 'وجد مفتاحاً قديماً.')))] },
	'secret-eleven': { title: titleEin, points: [einPoint(ex('Sie hat ein neues Kleid.', T('У неё новое платье.', 'У неї нова сукня.', 'She has a new dress.', 'Ma nową sukienkę.', 'Tiene un vestido nuevo.', 'Elle a une nouvelle robe.', 'Yeni bir elbisesi var.', 'Are o rochie nouă.', "Uning yangi ko'ylagi bor.", 'उसके पास एक नई ड्रेस है।', 'عندها فستان جديد.')))] },
	'secret-twelve': { title: titleEin, points: [datPoint(ex('Ich habe auf einem bequemen Stuhl gesessen.', T('Я сидел на удобном стуле.', 'Я сидів на зручному стільці.', 'I sat on a comfortable chair.', 'Siedziałem na wygodnym krześle.', 'Me senté en una silla cómoda.', 'J’étais assis sur une chaise confortable.', 'Rahat bir sandalyede oturdum.', 'Am stat pe un scaun comod.', "Men qulay stulda o'tirdim.", 'मैं एक आरामदायक कुर्सी पर बैठा।', 'جلست على كرسي مريح.')))] },
	'secret-thirteen': { title: titleEin, points: [einPoint(ex('Ein kleines Mädchen hat dort gesungen.', T('Там пела маленькая девочка.', 'Там співала маленька дівчинка.', 'A little girl sang there.', 'Mała dziewczynka tam śpiewała.', 'Una niña pequeña cantó allí.', 'Une petite fille a chanté là-bas.', 'Küçük bir kız orada şarkı söyledi.', 'O fetiță a cântat acolo.', 'U yerda kichkina qiz kuyladi.', 'वहाँ एक छोटी बच्ची ने गाना गाया।', 'غنّت فتاة صغيرة هناك.')))] },
	'secret-fourteen': { title: titleEin, points: [datPoint(ex('Ich spreche mit einem guten Freund.', T('Я разговариваю с хорошим другом.', 'Я розмовляю з добрим другом.', 'I’m talking to a good friend.', 'Rozmawiam z dobrym przyjacielem.', 'Hablo con un buen amigo.', 'Je parle avec un bon ami.', 'İyi bir arkadaşla konuşuyorum.', 'Vorbesc cu un prieten bun.', "Men yaxshi do'st bilan gaplashyapman.", 'मैं एक अच्छे दोस्त से बात कर रहा हूँ।', 'أتحدث مع صديق طيب.')))] },
	'secret-fifteen': { title: T('Повторение: ein + прилагательное', 'Повторення: ein + прикметник', 'Review: ein + adjective', 'Powtórka: ein + przymiotnik', 'Repaso: ein + adjetivo', 'Révision : ein + adjectif', 'Tekrar: ein + sıfat', 'Recapitulare: ein + adjectiv', 'Takrorlash: ein + sifat', 'दोहराव: ein + विशेषण', 'مراجعة: ein + صفة'), points: [
		einPoint(ex('Eine junge Frau hat mir geholfen.', T('Мне помогла молодая женщина.', 'Мені допомогла молода жінка.', 'A young woman helped me.', 'Pomogła mi młoda kobieta.', 'Me ayudó una mujer joven.', 'Une jeune femme m’a aidé.', 'Genç bir kadın bana yardım etti.', 'M-a ajutat o tânără.', 'Menga yosh ayol yordam berdi.', 'एक युवा महिला ने मेरी मदद की।', 'ساعدتني امرأة شابة.'))),
		akkPoint(ex('Ich habe einen alten Geldbeutel gefunden.', T('Я нашёл старый кошелёк.', 'Я знайшов старий гаманець.', 'I found an old wallet.', 'Znalazłem stary portfel.', 'Encontré una cartera vieja.', 'J’ai trouvé un vieux porte-monnaie.', 'Eski bir cüzdan buldum.', 'Am găsit un portofel vechi.', 'Men eski hamyon topdim.', 'मुझे एक पुराना बटुआ मिला।', 'وجدت محفظة قديمة.'))),
		datPoint(ex('Wir wohnen in einer großen Stadt.', T('Мы живём в большом городе.', 'Ми живемо у великому місті.', 'We live in a big city.', 'Mieszkamy w dużym mieście.', 'Vivimos en una ciudad grande.', 'Nous habitons dans une grande ville.', 'Büyük bir şehirde yaşıyoruz.', 'Locuim într-un oraș mare.', 'Biz katta shaharda yashaymiz.', 'हम एक बड़े शहर में रहते हैं।', 'نسكن في مدينة كبيرة.')))
	] }
}

module.exports = quests
