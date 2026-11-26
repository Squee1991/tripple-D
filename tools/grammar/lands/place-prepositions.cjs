// Грамматика к заданиям земли place-prepositions (предлоги места + Dativ)
const { ex, t11, pt, noRules, finalTitle } = require('../lib.cjs')

const dativPoint = pt(['Wo? + Dativ', 'Wo? + Dativ', 'Wo? + dative', 'Wo? + Dativ', 'Wo? + dativo', 'Wo ? + datif', 'Wo? + Dativ', 'Wo? + dativ', 'Wo? + Dativ', 'Wo? + Dativ', 'Wo؟ + حالة الجر'], [
	'На вопрос Wo? (где?) после предлога места артикль меняется: der → dem, das → dem, die → der.',
	'На питання Wo? (де?) після прийменника місця артикль змінюється: der → dem, das → dem, die → der.',
	'Answering Wo? (where?), the article after a place preposition changes: der → dem, das → dem, die → der.',
	'Na pytanie Wo? (gdzie?) po przyimku miejsca rodzajnik się zmienia: der → dem, das → dem, die → der.',
	'Respondiendo a Wo? (¿dónde?), tras la preposición de lugar el artículo cambia: der → dem, das → dem, die → der.',
	'En réponse à Wo ? (où ?), après une préposition de lieu l’article change : der → dem, das → dem, die → der.',
	'Wo? (nerede?) sorusunda yer edatından sonra artikel değişir: der → dem, das → dem, die → der.',
	'La întrebarea Wo? (unde?), după prepoziția de loc articolul se schimbă: der → dem, das → dem, die → der.',
	"Wo? (qayerda?) savolida joy ko'makchisidan keyin artikl o'zgaradi: der → dem, das → dem, die → der.",
	'Wo? (कहाँ?) के जवाब में जगह वाले संबंधसूचक के बाद आर्टिकल बदलता है: der → dem, das → dem, die → der।',
	'جواباً عن Wo؟ (أين؟) تتغير الأداة بعد حرف المكان: der → dem، das → dem، die → der.'
], [
	ex('Das Buch liegt auf dem Tisch.', t11('Книга лежит на столе.', 'Книжка лежить на столі.', 'The book is on the table.', 'Książka leży na stole.', 'El libro está sobre la mesa.', 'Le livre est sur la table.', 'Kitap masanın üstünde.', 'Cartea e pe masă.', 'Kitob stol ustida.', 'किताब मेज़ पर है।', 'الكتاب على الطاولة.')),
	ex('Das Bild hängt an der Wand.', t11('Картина висит на стене.', 'Картина висить на стіні.', 'The picture hangs on the wall.', 'Obraz wisi na ścianie.', 'El cuadro cuelga de la pared.', 'Le tableau est accroché au mur.', 'Resim duvarda asılı.', 'Tabloul atârnă pe perete.', 'Rasm devorda osilgan.', 'तस्वीर दीवार पर टँगी है।', 'اللوحة معلقة على الحائط.'))
])

const inAufAnPoint = pt(['in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in, auf, an', 'in وauf وan'], [
	'in значит внутри, auf сверху на поверхности, an сбоку или на вертикальной стене.',
	'in означає всередині, auf зверху на поверхні, an збоку або на вертикальній стіні.',
	'in means inside, auf means on top of a surface, an means at the side or on a vertical wall.',
	'in znaczy w środku, auf na powierzchni, an z boku albo na pionowej ścianie.',
	'in es dentro, auf es encima de una superficie, an es al lado o en una pared vertical.',
	'in veut dire dedans, auf sur une surface, an à côté ou sur un mur vertical.',
	'in içinde, auf bir yüzeyin üstünde, an yanında ya da dikey bir duvarda demektir.',
	'in înseamnă înăuntru, auf deasupra pe o suprafață, an alături sau pe un perete vertical.',
	"in ichida, auf sirt ustida, an yonida yoki tik devorda degani.",
	'in मतलब अंदर, auf मतलब किसी सतह के ऊपर, an मतलब बगल में या खड़ी दीवार पर।',
	'in تعني داخل، وauf فوق سطح، وan بجانب أو على حائط عمودي.'
])

const quests = {
	'place-prep-1': {
		title: t11('in, auf, an: где?', 'in, auf, an: де?', 'in, auf, an: where?', 'in, auf, an: gdzie?', 'in, auf, an: ¿dónde?', 'in, auf, an : où ?', 'in, auf, an: nerede?', 'in, auf, an: unde?', 'in, auf, an: qayerda?', 'in, auf, an: कहाँ?', 'in وauf وan: أين؟'),
		points: [inAufAnPoint, dativPoint]
	},
	'place-prep-2': {
		title: t11('unter и über', 'unter і über', 'unter and über', 'unter i über', 'unter y über', 'unter et über', 'unter ve über', 'unter și über', 'unter va über', 'unter और über', 'unter وüber'),
		points: [pt('unter, über', [
			'unter значит под, über значит над, без касания. После них тоже dem, der, dem.',
			'unter означає під, über означає над, без дотику. Після них теж dem, der, dem.',
			'unter means under, über means above, without touching. They also take dem, der, dem.',
			'unter znaczy pod, über znaczy nad, bez dotykania. Po nich też dem, der, dem.',
			'unter es debajo, über es encima sin tocar. También van con dem, der, dem.',
			'unter veut dire sous, über au-dessus, sans toucher. Eux aussi prennent dem, der, dem.',
			'unter altında, über dokunmadan üstünde demektir. Bunlardan sonra da dem, der, dem.',
			'unter înseamnă sub, über deasupra, fără atingere. Și după ele dem, der, dem.',
			"unter ostida, über tegmasdan ustida degani. Ulardan keyin ham dem, der, dem.",
			'unter मतलब नीचे, über मतलब ऊपर, बिना छुए। इनके बाद भी dem, der, dem।',
			'unter تعني تحت، وüber فوق دون تلامس. وبعدهما أيضاً dem وder وdem.'
		], [ex('Der Hund schläft unter dem Tisch.', t11('Собака спит под столом.', 'Собака спить під столом.', 'The dog sleeps under the table.', 'Pies śpi pod stołem.', 'El perro duerme debajo de la mesa.', 'Le chien dort sous la table.', 'Köpek masanın altında uyuyor.', 'Câinele doarme sub masă.', 'It stol ostida uxlayapti.', 'कुत्ता मेज़ के नीचे सो रहा है।', 'الكلب ينام تحت الطاولة.')), ex('Die Lampe hängt über dem Sofa.', t11('Лампа висит над диваном.', 'Лампа висить над диваном.', 'The lamp hangs above the sofa.', 'Lampa wisi nad kanapą.', 'La lámpara cuelga sobre el sofá.', 'La lampe est au-dessus du canapé.', 'Lamba kanepenin üstünde asılı.', 'Lampa atârnă deasupra canapelei.', 'Chiroq divan ustida osilgan.', 'लैंप सोफ़े के ऊपर टँगा है।', 'المصباح معلق فوق الأريكة.'))])]
	},
	'place-prep-3': {
		title: t11('vor и hinter', 'vor і hinter', 'vor and hinter', 'vor i hinter', 'vor y hinter', 'vor et hinter', 'vor ve hinter', 'vor și hinter', 'vor va hinter', 'vor और hinter', 'vor وhinter'),
		points: [pt('vor, hinter', [
			'vor значит перед, hinter значит за, позади.',
			'vor означає перед, hinter означає за, позаду.',
			'vor means in front of, hinter means behind.',
			'vor znaczy przed, hinter znaczy za.',
			'vor es delante de, hinter es detrás de.',
			'vor veut dire devant, hinter derrière.',
			'vor önünde, hinter arkasında demektir.',
			'vor înseamnă în fața, hinter în spatele.',
			'vor oldida, hinter orqasida degani.',
			'vor मतलब सामने, hinter मतलब पीछे।',
			'vor تعني أمام، وhinter خلف.'
		], [ex('Das Auto steht vor dem Haus.', t11('Машина стоит перед домом.', 'Машина стоїть перед будинком.', 'The car is in front of the house.', 'Samochód stoi przed domem.', 'El coche está delante de la casa.', 'La voiture est devant la maison.', 'Araba evin önünde.', 'Mașina e în fața casei.', 'Mashina uy oldida turibdi.', 'गाड़ी घर के सामने खड़ी है।', 'السيارة أمام البيت.')), ex('hinter der Tür', t11('за дверью', 'за дверима', 'behind the door', 'za drzwiami', 'detrás de la puerta', 'derrière la porte', 'kapının arkasında', 'în spatele ușii', 'eshik orqasida', 'दरवाज़े के पीछे', 'خلف الباب'))])]
	},
	'place-prep-4': {
		title: t11('neben и zwischen', 'neben і zwischen', 'neben and zwischen', 'neben i zwischen', 'neben y zwischen', 'neben et zwischen', 'neben ve zwischen', 'neben și zwischen', 'neben va zwischen', 'neben और zwischen', 'neben وzwischen'),
		points: [pt('neben, zwischen', [
			'neben значит рядом с, zwischen значит между. После zwischen обычно два предмета через und.',
			'neben означає поруч із, zwischen означає між. Після zwischen зазвичай два предмети через und.',
			'neben means next to, zwischen means between. After zwischen there are usually two things joined with und.',
			'neben znaczy obok, zwischen znaczy między. Po zwischen zwykle dwie rzeczy przez und.',
			'neben es al lado de, zwischen es entre. Tras zwischen suele haber dos cosas con und.',
			'neben veut dire à côté de, zwischen entre. Après zwischen, il y a souvent deux choses reliées par und.',
			'neben yanında, zwischen arasında demektir. zwischen’den sonra genelde und ile iki şey gelir.',
			'neben înseamnă lângă, zwischen între. După zwischen de obicei două lucruri legate cu und.',
			"neben yonida, zwischen orasida degani. zwischen dan keyin odatda und bilan ikki narsa keladi.",
			'neben मतलब बगल में, zwischen मतलब बीच में। zwischen के बाद आमतौर पर und से जुड़ी दो चीज़ें।',
			'neben تعني بجانب، وzwischen بين. وبعد zwischen يأتي عادة شيئان مع und.'
		], [ex('zwischen dem Fenster und der Tür', t11('между окном и дверью', 'між вікном і дверима', 'between the window and the door', 'między oknem a drzwiami', 'entre la ventana y la puerta', 'entre la fenêtre et la porte', 'pencere ile kapının arasında', 'între fereastră și ușă', "deraza va eshik orasida", 'खिड़की और दरवाज़े के बीच', 'بين النافذة والباب'))])]
	},
	'place-prep-5': {
		title: t11('im и am: в городе', 'im і am: у місті', 'im and am: in town', 'im i am: w mieście', 'im y am: en la ciudad', 'im et am : en ville', 'im ve am: şehirde', 'im și am: în oraș', 'im va am: shaharda', 'im और am: शहर में', 'im وam: في المدينة'),
		points: [pt('in + dem = im, an + dem = am', [
			'Предлог и dem часто сливаются: im Park, am Bahnhof. С die не сливаются: in der Stadt, an der Haltestelle.',
			'Прийменник і dem часто зливаються: im Park, am Bahnhof. З die не зливаються: in der Stadt, an der Haltestelle.',
			'The preposition and dem often merge: im Park, am Bahnhof. With die they don’t: in der Stadt, an der Haltestelle.',
			'Przyimek i dem często się łączą: im Park, am Bahnhof. Z die się nie łączą: in der Stadt, an der Haltestelle.',
			'La preposición y dem se suelen unir: im Park, am Bahnhof. Con die no: in der Stadt, an der Haltestelle.',
			'La préposition et dem fusionnent souvent : im Park, am Bahnhof. Avec die, non : in der Stadt, an der Haltestelle.',
			'Edat ve dem çoğu zaman birleşir: im Park, am Bahnhof. die ile birleşmez: in der Stadt, an der Haltestelle.',
			'Prepoziția și dem se contopesc des: im Park, am Bahnhof. Cu die nu: in der Stadt, an der Haltestelle.',
			"Ko'makchi va dem ko'pincha qo'shiladi: im Park, am Bahnhof. die bilan qo'shilmaydi: in der Stadt, an der Haltestelle.",
			'संबंधसूचक और dem अक्सर मिल जाते हैं: im Park, am Bahnhof। die के साथ नहीं: in der Stadt, an der Haltestelle।',
			'غالباً يندمج الحرف مع dem: im Park، am Bahnhof. ولا يندمج مع die: in der Stadt، an der Haltestelle.'
		], [ex('Wir spazieren im Park.', t11('Мы гуляем в парке.', 'Ми гуляємо в парку.', 'We walk in the park.', 'Spacerujemy w parku.', 'Paseamos por el parque.', 'Nous nous promenons dans le parc.', 'Parkta yürüyoruz.', 'Ne plimbăm prin parc.', "Biz parkda sayr qilamiz.", 'हम पार्क में टहलते हैं।', 'نتنزه في الحديقة.'))])]
	},
	'place-prep-6': {
		title: t11('Wo? и mein, dein', 'Wo? і mein, dein', 'Wo? and mein, dein', 'Wo? i mein, dein', 'Wo? y mein, dein', 'Wo ? et mein, dein', 'Wo? ve mein, dein', 'Wo? și mein, dein', 'Wo? va mein, dein', 'Wo? और mein, dein', 'Wo؟ وmein وdein'),
		points: [pt(['meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem, meiner', 'meinem وmeiner'], [
			'mein и dein получают то же окончание, что и артикль: dem → meinem, der → meiner.',
			'mein і dein отримують те саме закінчення, що й артикль: dem → meinem, der → meiner.',
			'mein and dein take the same ending as the article: dem → meinem, der → meiner.',
			'mein i dein dostają tę samą końcówkę co rodzajnik: dem → meinem, der → meiner.',
			'mein y dein toman la misma terminación que el artículo: dem → meinem, der → meiner.',
			'mein et dein prennent la même terminaison que l’article : dem → meinem, der → meiner.',
			'mein ve dein artikelle aynı eki alır: dem → meinem, der → meiner.',
			'mein și dein primesc aceeași terminație ca articolul: dem → meinem, der → meiner.',
			"mein va dein artikl bilan bir xil qo'shimcha oladi: dem → meinem, der → meiner.",
			'mein और dein को आर्टिकल जैसा ही अंत मिलता है: dem → meinem, der → meiner।',
			'تأخذ mein وdein نهاية الأداة نفسها: dem → meinem، der → meiner.'
		], [ex('in meinem Zimmer, in meiner Tasche', t11('в моей комнате, в моей сумке', 'у моїй кімнаті, у моїй сумці', 'in my room, in my bag', 'w moim pokoju, w mojej torbie', 'en mi habitación, en mi bolso', 'dans ma chambre, dans mon sac', 'odamda, çantamda', 'în camera mea, în geanta mea', 'xonamda, sumkamda', 'मेरे कमरे में, मेरे थैले में', 'في غرفتي، في حقيبتي'))])]
	},
	'place-prep-9': {
		title: t11('Практика: моя комната', 'Практика: моя кімната', 'Practice: my room', 'Praktyka: mój pokój', 'Práctica: mi habitación', 'Pratique : ma chambre', 'Pratik: odam', 'Practică: camera mea', 'Mashq: mening xonam', 'अभ्यास: मेरा कमरा', 'تدريب: غرفتي'),
		points: [dativPoint]
	},
	'place-prep-10': {
		title: t11('Практика: где это в городе?', 'Практика: де це в місті?', 'Practice: where is it in town?', 'Praktyka: gdzie to jest w mieście?', 'Práctica: ¿dónde está en la ciudad?', 'Pratique : où est-ce en ville ?', 'Pratik: şehirde nerede?', 'Practică: unde e în oraș?', 'Mashq: shaharda qayerda?', 'अभ्यास: शहर में कहाँ है?', 'تدريب: أين يقع في المدينة؟'),
		points: [pt(noRules, [
			'Повторяем: im, am, а с die без слияния: in der Stadt, an der Ecke, neben der Schule.',
			'Повторюємо: im, am, а з die без злиття: in der Stadt, an der Ecke, neben der Schule.',
			'Review: im, am, and with die no merging: in der Stadt, an der Ecke, neben der Schule.',
			'Powtarzamy: im, am, a z die bez łączenia: in der Stadt, an der Ecke, neben der Schule.',
			'Repaso: im, am, y con die sin unir: in der Stadt, an der Ecke, neben der Schule.',
			'Révision : im, am, et avec die sans fusion : in der Stadt, an der Ecke, neben der Schule.',
			'Tekrar: im, am; die ile birleşme yok: in der Stadt, an der Ecke, neben der Schule.',
			'Recapitulăm: im, am, iar cu die fără contopire: in der Stadt, an der Ecke, neben der Schule.',
			"Takrorlaymiz: im, am, die bilan qo'shilmaydi: in der Stadt, an der Ecke, neben der Schule.",
			'दोहराव: im, am, और die के साथ बिना मिले: in der Stadt, an der Ecke, neben der Schule।',
			'مراجعة: im وam، ومع die بدون اندماج: in der Stadt، an der Ecke، neben der Schule.'
		], [ex('Das Café ist an der Ecke.', t11('Кафе на углу.', 'Кафе на розі.', 'The café is on the corner.', 'Kawiarnia jest na rogu.', 'El café está en la esquina.', 'Le café est au coin.', 'Kafe köşede.', 'Cafeneaua e la colț.', 'Kafe muyulishda.', 'कैफ़े कोने पर है।', 'المقهى عند الزاوية.'))])]
	},
	'place-prep-7': {
		title: t11('Повторение: дом и город', 'Повторення: дім і місто', 'Review: home and town', 'Powtórka: dom i miasto', 'Repaso: casa y ciudad', 'Révision : maison et ville', 'Tekrar: ev ve şehir', 'Recapitulare: casă și oraș', 'Takrorlash: uy va shahar', 'दोहराव: घर और शहर', 'مراجعة: البيت والمدينة'),
		points: [inAufAnPoint, dativPoint]
	},
	'place-prep-8': {
		title: finalTitle,
		points: [dativPoint, pt(['Все предлоги места', 'Усі прийменники місця', 'All place prepositions', 'Wszystkie przyimki miejsca', 'Todas las preposiciones de lugar', 'Toutes les prépositions de lieu', 'Tüm yer edatları', 'Toate prepozițiile de loc', "Barcha joy ko'makchilari", 'सभी जगह वाले संबंधसूचक', 'كل حروف المكان'], [
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: на вопрос Wo? все с dem, der, dem.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: на питання Wo? усі з dem, der, dem.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: answering Wo? all take dem, der, dem.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: na pytanie Wo? wszystkie z dem, der, dem.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: con Wo? todas van con dem, der, dem.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen : avec Wo ?, toutes prennent dem, der, dem.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: Wo? sorusunda hepsi dem, der, dem alır.',
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: la Wo? toate cu dem, der, dem.',
			"in, auf, an, unter, über, vor, hinter, neben, zwischen: Wo? savolida hammasi dem, der, dem bilan.",
			'in, auf, an, unter, über, vor, hinter, neben, zwischen: Wo? में सभी dem, der, dem के साथ।',
			'in، auf، an، unter، über، vor، hinter، neben، zwischen: مع Wo؟ كلها تأخذ dem وder وdem.'
		], [ex('Wir frühstücken auf dem Balkon.', t11('Мы завтракаем на балконе.', 'Ми снідаємо на балконі.', 'We have breakfast on the balcony.', 'Jemy śniadanie na balkonie.', 'Desayunamos en el balcón.', 'Nous prenons le petit déjeuner sur le balcon.', 'Balkonda kahvaltı yapıyoruz.', 'Luăm micul dejun pe balcon.', 'Balkonda nonushta qilamiz.', 'हम बालकनी में नाश्ता करते हैं।', 'نفطر على الشرفة.'))])]
	}
}

module.exports = quests
