// Грамматика к заданиям земли wild-lands (Дикие земли: природа)
const ex = (de, tr) => ({ de, tr })
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })
const L = ['ru', 'uk', 'en', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
const pt = (titles, texts, examples) => ({ t: Object.fromEntries(L.map((k, i) => [k, [typeof titles === 'string' ? titles : titles[i], texts[i]]])), examples })
const noRules = ['Новых правил нет', 'Нових правил немає', 'No new rules', 'Bez nowych reguł', 'Sin reglas nuevas', 'Pas de nouvelle règle', 'Yeni kural yok', 'Fără reguli noi', "Yangi qoida yo'q", 'कोई नया नियम नहीं', 'لا قواعد جديدة']

const istPoint = (examples) => pt(noRules, [
	'Признак после ist не меняется. Два признака соединяем через und.',
	'Ознака після ist не змінюється. Дві ознаки поєднуємо через und.',
	'An adjective after ist doesn’t change. Join two adjectives with und.',
	'Cecha po ist się nie zmienia. Dwie cechy łączymy przez und.',
	'El adjetivo tras ist no cambia. Dos adjetivos se unen con und.',
	'L’adjectif après ist ne change pas. On relie deux adjectifs avec und.',
	'ist’ten sonra sıfat değişmez. İki sıfat und ile bağlanır.',
	'Adjectivul după ist nu se schimbă. Două adjective le legăm cu und.',
	"ist dan keyin sifat o'zgarmaydi. Ikki sifat und bilan bog'lanadi.",
	'ist के बाद विशेषण नहीं बदलता। दो विशेषणों को und से जोड़ते हैं।',
	'الصفة بعد ist لا تتغير. ونربط صفتين بـ und.'
], examples)

const wherePoint = pt('im, am, auf der', [
	'Где находится: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Де знаходиться: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Where something is: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Gdzie coś jest: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Dónde está algo: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Où se trouve quelque chose : im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Bir şey nerede: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	'Unde se află ceva: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).',
	"Narsa qayerda: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der).",
	'कोई चीज़ कहाँ है: im Wald (in + dem), am Meer (an + dem), auf der Wiese (auf + der)।',
	'أين يوجد الشيء: im Wald (in + dem)، am Meer (an + dem)، auf der Wiese (auf + der).'
], [
	ex('Der Wolf ist im Wald.', t11('Волк в лесу.', 'Вовк у лісі.', 'The wolf is in the forest.', 'Wilk jest w lesie.', 'El lobo está en el bosque.', 'Le loup est dans la forêt.', 'Kurt ormanda.', 'Lupul e în pădure.', "Bo'ri o'rmonda.", 'भेड़िया जंगल में है।', 'الذئب في الغابة.')),
	ex('Die Blume wächst auf der Wiese.', t11('Цветок растёт на лугу.', 'Квітка росте на лузі.', 'The flower grows in the meadow.', 'Kwiat rośnie na łące.', 'La flor crece en el prado.', 'La fleur pousse dans le pré.', 'Çiçek çayırda büyüyor.', 'Floarea crește pe pajiște.', "Gul o'tloqda o'sadi.", 'फूल घास के मैदान में उगता है।', 'الزهرة تنمو في المرج.'))
])

const quests = {
	'env': {
		title: t11('Природа вокруг', 'Природа навколо', 'Nature around us', 'Przyroda wokół', 'La naturaleza', 'La nature autour', 'Etraftaki doğa', 'Natura din jur', 'Atrofdagi tabiat', 'आसपास की प्रकृति', 'الطبيعة من حولنا'),
		points: [istPoint([ex('Die Natur ist schön.', t11('Природа красивая.', 'Природа гарна.', 'Nature is beautiful.', 'Przyroda jest piękna.', 'La naturaleza es bonita.', 'La nature est belle.', 'Doğa güzel.', 'Natura e frumoasă.', 'Tabiat chiroyli.', 'प्रकृति सुंदर है।', 'الطبيعة جميلة.'))])]
	},
	'animals': {
		title: t11('Животные: im Wald', 'Тварини: im Wald', 'Animals: im Wald', 'Zwierzęta: im Wald', 'Animales: im Wald', 'Les animaux : im Wald', 'Hayvanlar: im Wald', 'Animalele: im Wald', "Hayvonlar: im Wald", 'जानवर: im Wald', 'الحيوانات: im Wald'),
		points: [wherePoint]
	},
	'nature': {
		title: t11('Высоты', 'Висоти', 'Heights', 'Wysokości', 'Las alturas', 'Les hauteurs', 'Yükseklikler', 'Înălțimile', 'Balandliklar', 'ऊँचाइयाँ', 'المرتفعات'),
		points: [istPoint([ex('Der Berg ist groß.', t11('Гора большая.', 'Гора велика.', 'The mountain is big.', 'Góra jest duża.', 'La montaña es grande.', 'La montagne est grande.', 'Dağ büyük.', 'Muntele e mare.', 'Tog‘ katta.', 'पहाड़ बड़ा है।', 'الجبل كبير.'))])]
	},
	'fauna': {
		title: t11('Горное озеро: der See', 'Гірське озеро: der See', 'Mountain lake: der See', 'Górskie jezioro: der See', 'Lago de montaña: der See', 'Lac de montagne : der See', 'Dağ gölü: der See', 'Lacul de munte: der See', "Tog' ko'li: der See", 'पहाड़ी झील: der See', 'بحيرة الجبل: der See'),
		points: [pt(['der See или die See', 'der See чи die See', 'der See or die See', 'der See czy die See', 'der See o die See', 'der See ou die See', 'der See mi, die See mi', 'der See sau die See', 'der See yoki die See', 'der See या die See', 'der See أم die See'], [
			'der See значит озеро, die See значит море. Для моря чаще говорят das Meer.',
			'der See означає озеро, die See означає море. Для моря частіше кажуть das Meer.',
			'der See means a lake, die See means the sea. For the sea people usually say das Meer.',
			'der See to jezioro, die See to morze. O morzu mówi się zwykle das Meer.',
			'der See es un lago, die See es el mar. Para el mar se suele decir das Meer.',
			'der See veut dire un lac, die See veut dire la mer. Pour la mer, on dit plutôt das Meer.',
			'der See göl, die See deniz demektir. Deniz için genelde das Meer denir.',
			'der See înseamnă lac, die See înseamnă mare. Pentru mare se spune de obicei das Meer.',
			"der See ko'l, die See dengiz degani. Dengiz uchun odatda das Meer deyiladi.",
			'der See मतलब झील, die See मतलब समुद्र। समुद्र के लिए आमतौर पर das Meer कहते हैं।',
			'der See تعني البحيرة، وdie See تعني البحر. وللبحر نقول غالباً das Meer.'
		], [ex('Der See ist sehr groß.', t11('Озеро очень большое.', 'Озеро дуже велике.', 'The lake is very big.', 'Jezioro jest bardzo duże.', 'El lago es muy grande.', 'Le lac est très grand.', 'Göl çok büyük.', 'Lacul e foarte mare.', "Ko'l juda katta.", 'झील बहुत बड़ी है।', 'البحيرة كبيرة جداً.'))])]
	},
	'weather': {
		title: t11('Стихии', 'Стихії', 'The elements', 'Żywioły', 'Los elementos', 'Les éléments', 'Doğa olayları', 'Stihiile', 'Tabiat hodisalari', 'प्रकृति की शक्तियाँ', 'عناصر الطبيعة'),
		points: [istPoint([ex('Der Wind ist kalt.', t11('Ветер холодный.', 'Вітер холодний.', 'The wind is cold.', 'Wiatr jest zimny.', 'El viento es frío.', 'Le vent est froid.', 'Rüzgâr soğuk.', 'Vântul e rece.', 'Shamol sovuq.', 'हवा ठंडी है।', 'الريح باردة.'))])]
	},
	'winter': {
		title: t11('Зима: im Winter', 'Зима: im Winter', 'Winter: im Winter', 'Zima: im Winter', 'Invierno: im Winter', 'L’hiver : im Winter', 'Kış: im Winter', 'Iarna: im Winter', 'Qish: im Winter', 'सर्दी: im Winter', 'الشتاء: im Winter'),
		points: [pt('im Winter', [
			'Время года с im: im Winter (зимой), im Sommer (летом).',
			'Пора року з im: im Winter (узимку), im Sommer (улітку).',
			'Seasons take im: im Winter (in winter), im Sommer (in summer).',
			'Pory roku z im: im Winter (zimą), im Sommer (latem).',
			'Las estaciones con im: im Winter (en invierno), im Sommer (en verano).',
			'Les saisons avec im : im Winter (en hiver), im Sommer (en été).',
			'Mevsimler im ile: im Winter (kışın), im Sommer (yazın).',
			'Anotimpurile cu im: im Winter (iarna), im Sommer (vara).',
			"Fasllar im bilan: im Winter (qishda), im Sommer (yozda).",
			'मौसम im के साथ: im Winter (सर्दियों में), im Sommer (गर्मियों में)।',
			'الفصول مع im: im Winter (في الشتاء)، im Sommer (في الصيف).'
		], [ex('Im Winter ist es kalt.', t11("Зимой холодно.", "Взимку холодно.", "It’s cold in winter.", "Zimą jest zimno.", "En invierno hace frío.", "En hiver, il fait froid.", "Kışın hava soğuk.", "Iarna e frig.", "Qishda sovuq.", "सर्दियों में ठंड होती है।", "في الشتاء يكون الجو بارداً."))])]
	},
	'night-sky': {
		title: t11('Ночное небо', 'Нічне небо', 'The night sky', 'Nocne niebo', 'El cielo nocturno', 'Le ciel de nuit', 'Gece göğü', 'Cerul nopții', 'Tungi osmon', 'रात का आसमान', 'سماء الليل'),
		points: [istPoint([ex('Die Nacht ist dunkel und kalt.', t11('Ночь тёмная и холодная.', 'Ніч темна й холодна.', 'The night is dark and cold.', 'Noc jest ciemna i zimna.', 'La noche es oscura y fría.', 'La nuit est sombre et froide.', 'Gece karanlık ve soğuk.', 'Noaptea e întunecată și rece.', "Tun qorong'i va sovuq.", 'रात अँधेरी और ठंडी है।', 'الليل مظلم وبارد.'))])]
	},
	'nature-walk': {
		title: t11('Лиса и природа', 'Лисиця і природа', 'The fox and nature', 'Lis i przyroda', 'El zorro y la naturaleza', 'Le renard et la nature', 'Tilki ve doğa', 'Vulpea și natura', 'Tulki va tabiat', 'लोमड़ी और प्रकृति', 'الثعلب والطبيعة'),
		points: [wherePoint]
	},
	'mountains': {
		title: t11('Горы', 'Гори', 'Mountains', 'Góry', 'Las montañas', 'Les montagnes', 'Dağlar', 'Munții', "Tog'lar", 'पहाड़', 'الجبال'),
		points: [istPoint([ex('Der Berg ist hoch.', t11('Гора высокая.', 'Гора висока.', 'The mountain is high.', 'Góra jest wysoka.', 'La montaña es alta.', 'La montagne est haute.', 'Dağ yüksek.', 'Muntele e înalt.', "Tog' baland.", 'पहाड़ ऊँचा है।', 'الجبل عالٍ.'))])]
	},
	'fog': {
		title: t11('Туман и трава', 'Туман і трава', 'Fog and grass', 'Mgła i trawa', 'Niebla y hierba', 'Brouillard et herbe', 'Sis ve çimen', 'Ceață și iarbă', "Tuman va o't", 'कोहरा और घास', 'الضباب والعشب'),
		points: [istPoint([ex('Der Nebel ist dicht.', t11('Туман густой.', 'Туман густий.', 'The fog is thick.', 'Mgła jest gęsta.', 'La niebla es espesa.', 'Le brouillard est épais.', 'Sis yoğun.', 'Ceața e deasă.', 'Tuman quyuq.', 'कोहरा घना है।', 'الضباب كثيف.'))])]
	},
	'morning': {
		title: t11('Утро', 'Ранок', 'Morning', 'Poranek', 'La mañana', 'Le matin', 'Sabah', 'Dimineața', 'Tong', 'सुबह', 'الصباح'),
		points: [pt(['Время первым, глагол вторым', 'Час першим, дієслово другим', 'Time first, verb second', 'Czas pierwszy, czasownik drugi', 'Tiempo primero, verbo segundo', 'Le temps d’abord, le verbe ensuite', 'Önce zaman, sonra fiil', 'Timpul primul, verbul al doilea', "Avval vaqt, keyin fe'l", 'पहले समय, फिर क्रिया', 'الزمن أولاً والفعل ثانياً'], [
			'Если am Morgen стоит в начале, глагол идёт сразу за ним.',
			'Якщо am Morgen стоїть на початку, дієслово йде одразу за ним.',
			'If am Morgen comes first, the verb follows straight after.',
			'Jeśli am Morgen jest na początku, czasownik idzie zaraz po nim.',
			'Si am Morgen va al principio, el verbo va justo después.',
			'Si am Morgen est en premier, le verbe suit tout de suite.',
			'am Morgen başta olursa fiil hemen ardından gelir.',
			'Dacă am Morgen e la început, verbul vine imediat după.',
			"am Morgen boshida tursa, fe'l darhol undan keyin keladi.",
			'अगर am Morgen पहले आए, तो क्रिया तुरंत उसके बाद।',
			'إذا جاءت am Morgen أولاً يأتي الفعل بعدها مباشرة.'
		], [ex('Am Morgen liegt Nebel im Wald.', t11('Утром в лесу туман.', 'Уранці в лісі туман.', 'In the morning there’s fog in the forest.', 'Rano w lesie jest mgła.', 'Por la mañana hay niebla en el bosque.', 'Le matin, il y a du brouillard dans la forêt.', 'Sabah ormanda sis var.', 'Dimineața e ceață în pădure.', "Ertalab o'rmonda tuman bor.", 'सुबह जंगल में कोहरा है।', 'في الصباح يوجد ضباب في الغابة.'))])]
	},
	'sea': {
		title: t11('Берег: am Meer', 'Берег: am Meer', 'The coast: am Meer', 'Wybrzeże: am Meer', 'La costa: am Meer', 'La côte : am Meer', 'Kıyı: am Meer', 'Coasta: am Meer', "Qirg'oq: am Meer", 'तट: am Meer', 'الساحل: am Meer'),
		points: [wherePoint, pt(noRules, [
			'Про погоду у моря тоже через es: Am Meer ist es windig.',
			'Про погоду біля моря теж через es: Am Meer ist es windig.',
			'Weather at the sea also uses es: Am Meer ist es windig.',
			'O pogodzie nad morzem też przez es: Am Meer ist es windig.',
			'El tiempo en el mar también con es: Am Meer ist es windig.',
			'La météo au bord de la mer aussi avec es : Am Meer ist es windig.',
			'Denizdeki hava da es ile: Am Meer ist es windig.',
			'Vremea la mare tot cu es: Am Meer ist es windig.',
			"Dengizdagi ob-havo ham es bilan: Am Meer ist es windig.",
			'समुद्र पर मौसम भी es से: Am Meer ist es windig।',
			'الطقس عند البحر أيضاً مع es: Am Meer ist es windig.'
		], [ex('Am Meer ist es windig.', t11('У моря ветрено.', 'Біля моря вітряно.', 'It’s windy by the sea.', 'Nad morzem wieje.', 'En el mar hace viento.', 'Au bord de la mer, il y a du vent.', 'Deniz kenarında rüzgâr var.', 'La mare e vânt.', "Dengiz bo'yida shamol.", 'समुद्र पर हवा चल रही है।', 'الجو عاصف عند البحر.'))])]
	},
	'storm': {
		title: t11('Гроза', 'Гроза', 'Thunderstorm', 'Burza', 'Tormenta', 'L’orage', 'Fırtına', 'Furtuna', 'Momaqaldiroq', 'आँधी-तूफ़ान', 'العاصفة الرعدية'),
		points: [istPoint([ex('Der Himmel ist schwarz.', t11('Небо чёрное.', 'Небо чорне.', 'The sky is black.', 'Niebo jest czarne.', 'El cielo está negro.', 'Le ciel est noir.', 'Gökyüzü kara.', 'Cerul e negru.', 'Osmon qora.', 'आसमान काला है।', 'السماء سوداء.'))])]
	},
	'meadow': {
		title: t11('Поляна: auf der Wiese', 'Галявина: auf der Wiese', 'The meadow: auf der Wiese', 'Polana: auf der Wiese', 'El prado: auf der Wiese', 'La prairie : auf der Wiese', 'Çayır: auf der Wiese', 'Pajiștea: auf der Wiese', "O'tloq: auf der Wiese", 'घास का मैदान: auf der Wiese', 'المرج: auf der Wiese'),
		points: [wherePoint]
	},
	'nature-final': {
		title: t11('Живая природа: повторение', 'Жива природа: повторення', 'Living nature: review', 'Żywa przyroda: powtórka', 'Naturaleza viva: repaso', 'Nature vivante : révision', 'Canlı doğa: tekrar', 'Natura vie: recapitulare', 'Jonli tabiat: takrorlash', 'जीवित प्रकृति: दोहराव', 'الطبيعة الحية: مراجعة'),
		points: [wherePoint, istPoint([ex('Die Wiese ist grün.', t11('Луг зелёный.', 'Луг зелений.', 'The meadow is green.', 'Łąka jest zielona.', 'El prado es verde.', 'La prairie est verte.', 'Çayır yeşil.', 'Pajiștea e verde.', "O'tloq yashil.", 'मैदान हरा है।', 'المرج أخضر.'))])]
	}
}

module.exports = quests
