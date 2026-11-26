// Грамматика к заданиям земли lake-ruins (Руины у озера: погода)
const ex = (de, tr) => ({ de, tr })
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })

const esPoint = {
	t: {
		ru: ['Погода всегда с es', 'О погоде говорим через es: Es ist kalt. Es regnet. По-русски «холодно» без подлежащего, по-немецки es обязательно.'],
		uk: ['Погода завжди з es', 'Про погоду кажемо через es: Es ist kalt. Es regnet. Українською «холодно» без підмета, німецькою es обов’язкове.'],
		en: ['Weather always uses es', 'Talk about the weather with es, like English "it": Es ist kalt. Es regnet.'],
		pl: ['Pogoda zawsze z es', 'O pogodzie mówimy z es: Es ist kalt. Es regnet. Po polsku „zimno” bez podmiotu, po niemiecku es jest konieczne.'],
		es: ['El tiempo siempre con es', 'Del tiempo se habla con es: Es ist kalt. Es regnet. En español "hace frío" no tiene sujeto, en alemán es es obligatorio.'],
		fr: ['La météo toujours avec es', 'Pour la météo, on utilise es, comme « il » en français : Es ist kalt. Es regnet.'],
		tr: ['Hava durumu hep es ile', 'Hava hakkında es ile konuşulur: Es ist kalt. Es regnet. Türkçede özne yok, Almancada es şart.'],
		ro: ['Vremea mereu cu es', 'Despre vreme vorbim cu es: Es ist kalt. Es regnet. În română „e frig” fără subiect, în germană es e obligatoriu.'],
		uz: ['Ob-havo doim es bilan', "Ob-havo haqida es bilan gapiramiz: Es ist kalt. Es regnet. O'zbekchada ega yo'q, nemischada es shart."],
		hi: ['मौसम हमेशा es के साथ', 'मौसम के बारे में es से बात करते हैं: Es ist kalt. Es regnet। जर्मन में es ज़रूरी है।'],
		ar: ['الطقس دائماً مع es', 'نتحدث عن الطقس باستعمال es: Es ist kalt. Es regnet. وes ضرورية في الألمانية.']
	},
	examples: [
		ex('Heute ist es sonnig.', t11('Сегодня солнечно.', 'Сьогодні сонячно.', 'It’s sunny today.', 'Dziś jest słonecznie.', 'Hoy hace sol.', 'Aujourd’hui, il fait beau.', 'Bugün hava güneşli.', 'Azi e însorit.', 'Bugun quyoshli.', 'आज धूप है।', 'الجو مشمس اليوم.')),
		ex('Es schneit.', t11('Идёт снег.', 'Іде сніг.', 'It’s snowing.', 'Pada śnieg.', 'Está nevando.', 'Il neige.', 'Kar yağıyor.', 'Ninge.', 'Qor yog‘yapti.', 'बर्फ़ गिर रही है।', 'إنها تثلج.'))
	]
}

const quests = {
	'lake-ruins-one': {
		title: t11('Погода: es ist kalt', 'Погода: es ist kalt', 'Weather: es ist kalt', 'Pogoda: es ist kalt', 'El tiempo: es ist kalt', 'La météo : es ist kalt', 'Hava: es ist kalt', 'Vremea: es ist kalt', 'Ob-havo: es ist kalt', 'मौसम: es ist kalt', 'الطقس: es ist kalt'),
		points: [
			esPoint,
			{
				t: {
					ru: ['Порядок слов', 'Если heute стоит первым, глагол идёт сразу за ним, а es после: Heute ist es kalt.'],
					uk: ['Порядок слів', 'Якщо heute стоїть першим, дієслово йде одразу за ним, а es після: Heute ist es kalt.'],
					en: ['Word order', 'If heute comes first, the verb follows straight away and es comes after: Heute ist es kalt.'],
					pl: ['Szyk wyrazów', 'Jeśli heute jest pierwsze, czasownik idzie zaraz po nim, a es potem: Heute ist es kalt.'],
					es: ['Orden de palabras', 'Si heute va primero, el verbo va justo después y es detrás: Heute ist es kalt.'],
					fr: ['Ordre des mots', 'Si heute est en premier, le verbe suit tout de suite et es vient après : Heute ist es kalt.'],
					tr: ['Kelime sırası', 'heute başta olursa fiil hemen ardından, es ondan sonra gelir: Heute ist es kalt.'],
					ro: ['Ordinea cuvintelor', 'Dacă heute e primul, verbul vine imediat, iar es după: Heute ist es kalt.'],
					uz: ["So'z tartibi", "heute birinchi tursa, fe'l darhol keyin, es esa undan keyin: Heute ist es kalt."],
					hi: ['शब्द क्रम', 'अगर heute पहले आए, तो क्रिया तुरंत बाद और es उसके बाद: Heute ist es kalt।'],
					ar: ['ترتيب الكلمات', 'إذا جاءت heute أولاً يأتي الفعل بعدها مباشرة ثم es: Heute ist es kalt.']
				},
				examples: [
					ex('Heute ist es windig und kalt.', t11('Сегодня ветрено и холодно.', 'Сьогодні вітряно й холодно.', 'Today it’s windy and cold.', 'Dziś jest wietrznie i zimno.', 'Hoy hace viento y frío.', 'Aujourd’hui, il y a du vent et il fait froid.', 'Bugün rüzgârlı ve soğuk.', 'Azi e vânt și frig.', 'Bugun shamol va sovuq.', 'आज हवा है और ठंड है।', 'اليوم الجو عاصف وبارد.'))
				]
			}
		]
	},

	'lake-ruins-two': {
		title: t11('Времена года и градусы', 'Пори року та градуси', 'Seasons and degrees', 'Pory roku i stopnie', 'Estaciones y grados', 'Saisons et degrés', 'Mevsimler ve dereceler', 'Anotimpuri și grade', 'Fasllar va darajalar', 'मौसम और डिग्री', 'الفصول ودرجات الحرارة'),
		points: [
			{
				t: {
					ru: ['es sind ... Grad', 'Про температуру говорим во множественном: Heute sind es zehn Grad.'],
					uk: ['es sind ... Grad', 'Про температуру кажемо в множині: Heute sind es zehn Grad.'],
					en: ['es sind ... Grad', 'For temperature use the plural verb: Heute sind es zehn Grad.'],
					pl: ['es sind ... Grad', 'O temperaturze mówimy w liczbie mnogiej: Heute sind es zehn Grad.'],
					es: ['es sind ... Grad', 'Para la temperatura se usa el plural: Heute sind es zehn Grad.'],
					fr: ['es sind ... Grad', 'Pour la température, le verbe est au pluriel : Heute sind es zehn Grad.'],
					tr: ['es sind ... Grad', 'Sıcaklık için çoğul fiil kullanılır: Heute sind es zehn Grad.'],
					ro: ['es sind ... Grad', 'Pentru temperatură verbul e la plural: Heute sind es zehn Grad.'],
					uz: ['es sind ... Grad', "Harorat haqida ko'plikda gapiramiz: Heute sind es zehn Grad."],
					hi: ['es sind ... Grad', 'तापमान के लिए बहुवचन क्रिया: Heute sind es zehn Grad।'],
					ar: ['es sind ... Grad', 'للحرارة نستعمل فعل الجمع: Heute sind es zehn Grad.']
				},
				examples: [
					ex('Heute sind es zehn Grad.', t11('Сегодня десять градусов.', 'Сьогодні десять градусів.', 'It’s ten degrees today.', 'Dziś jest dziesięć stopni.', 'Hoy hace diez grados.', 'Aujourd’hui, il fait dix degrés.', 'Bugün hava on derece.', 'Azi sunt zece grade.', "Bugun o'n daraja.", 'आज दस डिग्री है।', 'الحرارة اليوم عشر درجات.')),
					ex('Im Winter ist es kalt.', t11('Зимой холодно.', 'Взимку холодно.', 'In winter it’s cold.', 'Zimą jest zimno.', 'En invierno hace frío.', 'En hiver, il fait froid.', 'Kışın hava soğuk.', 'Iarna e frig.', 'Qishda sovuq.', 'सर्दियों में ठंड होती है।', 'في الشتاء يكون الجو بارداً.'))
				]
			}
		]
	},

	'lake-ruins-three': {
		title: t11('Прогноз: morgen wird es...', 'Прогноз: morgen wird es...', 'Forecast: morgen wird es...', 'Prognoza: morgen wird es...', 'Pronóstico: morgen wird es...', 'Prévisions : morgen wird es...', 'Tahmin: morgen wird es...', 'Prognoza: morgen wird es...', 'Prognoz: morgen wird es...', 'पूर्वानुमान: morgen wird es...', 'التوقعات: morgen wird es...'),
		points: [
			{
				t: {
					ru: ['wird: станет, будет', 'Про погоду завтра удобно сказать wird: Morgen wird es trocken. Это готовая фраза.'],
					uk: ['wird: стане, буде', 'Про погоду завтра зручно сказати wird: Morgen wird es trocken. Це готова фраза.'],
					en: ['wird: will be', 'For tomorrow’s weather say wird: Morgen wird es trocken. Learn it as a phrase.'],
					pl: ['wird: będzie', 'O pogodzie na jutro wygodnie powiedzieć wird: Morgen wird es trocken. To gotowe wyrażenie.'],
					es: ['wird: será, se pondrá', 'Para el tiempo de mañana se dice wird: Morgen wird es trocken. Apréndelo como frase.'],
					fr: ['wird : il va faire', 'Pour la météo de demain, on dit wird : Morgen wird es trocken. À apprendre comme une expression.'],
					tr: ['wird: olacak', 'Yarının havası için wird denir: Morgen wird es trocken. Kalıp olarak öğren.'],
					ro: ['wird: va fi', 'Pentru vremea de mâine spunem wird: Morgen wird es trocken. Învaț-o ca expresie.'],
					uz: ["wird: bo'ladi", "Ertangi ob-havo uchun wird deyiladi: Morgen wird es trocken. Tayyor ibora sifatida o'rgan."],
					hi: ['wird: होगा', 'कल के मौसम के लिए wird कहते हैं: Morgen wird es trocken। इसे वाक्यांश की तरह सीखो।'],
					ar: ['wird: سيصبح', 'لطقس الغد نقول wird: Morgen wird es trocken. احفظها كعبارة جاهزة.']
				},
				examples: [
					ex('Morgen wird es trocken.', t11('Завтра будет сухо.', 'Завтра буде сухо.', 'Tomorrow it will be dry.', 'Jutro będzie sucho.', 'Mañana estará seco.', 'Demain, il fera sec.', 'Yarın hava kuru olacak.', 'Mâine va fi uscat.', 'Ertaga quruq bo‘ladi.', 'कल सूखा रहेगा।', 'غداً سيكون الجو جافاً.')),
					ex('Es gibt Nebel am Morgen.', t11('Утром туман.', 'Уранці туман.', 'There’s fog in the morning.', 'Rano jest mgła.', 'Hay niebla por la mañana.', 'Il y a du brouillard le matin.', 'Sabah sis var.', 'Dimineața e ceață.', 'Ertalab tuman bor.', 'सुबह कोहरा है।', 'يوجد ضباب في الصباح.'))
				]
			}
		]
	},

	'lake-ruins-four': {
		title: t11('Непогода: что взять', 'Негода: що взяти', 'Bad weather: what to take', 'Niepogoda: co zabrać', 'Mal tiempo: qué llevar', 'Mauvais temps : quoi prendre', 'Kötü hava: ne almalı', 'Vreme rea: ce iei', "Yomon ob-havo: nima olish kerak", 'खराब मौसम: क्या लें', 'الطقس السيئ: ماذا نأخذ'),
		points: [
			{
				t: {
					ru: ['brauchen + Akkusativ', 'Что нужно взять: Ich brauche + Akkusativ. Мужской род получает einen.'],
					uk: ['brauchen + Akkusativ', 'Що треба взяти: Ich brauche + Akkusativ. Чоловічий рід отримує einen.'],
					en: ['brauchen + accusative', 'What you need: Ich brauche + accusative. Masculine takes einen.'],
					pl: ['brauchen + Akkusativ', 'Co trzeba zabrać: Ich brauche + Akkusativ. Rodzaj męski dostaje einen.'],
					es: ['brauchen + acusativo', 'Lo que necesitas: Ich brauche + acusativo. El masculino lleva einen.'],
					fr: ['brauchen + accusatif', 'Ce dont on a besoin : Ich brauche + accusatif. Le masculin prend einen.'],
					tr: ['brauchen + Akkusativ', 'Neye ihtiyacın var: Ich brauche + Akkusativ. Eril einen alır.'],
					ro: ['brauchen + acuzativ', 'Ce îți trebuie: Ich brauche + acuzativ. Masculinul primește einen.'],
					uz: ['brauchen + Akkusativ', "Nima kerak: Ich brauche + Akkusativ. Erkak rodi einen oladi."],
					hi: ['brauchen + Akkusativ', 'क्या चाहिए: Ich brauche + Akkusativ। पुल्लिंग einen लेता है।'],
					ar: ['brauchen + المفعول', 'ما تحتاجه: Ich brauche + المفعول. والمذكر يأخذ einen.']
				},
				examples: [
					ex('Ich brauche einen Regenschirm.', t11('Мне нужен зонт.', 'Мені потрібна парасолька.', 'I need an umbrella.', 'Potrzebuję parasola.', 'Necesito un paraguas.', 'J’ai besoin d’un parapluie.', 'Bir şemsiyeye ihtiyacım var.', 'Am nevoie de o umbrelă.', 'Menga soyabon kerak.', 'मुझे छाता चाहिए।', 'أحتاج مظلة.'))
				]
			}
		]
	},

	'lake-ruins-five': {
		title: t11('Туман и град: слова на -ig', 'Туман і град: слова на -ig', 'Fog and hail: words ending in -ig', 'Mgła i grad: słowa na -ig', 'Niebla y granizo: palabras en -ig', 'Brouillard et grêle : mots en -ig', 'Sis ve dolu: -ig ile biten kelimeler', 'Ceață și grindină: cuvinte în -ig', "Tuman va do'l: -ig bilan tugaydigan so'zlar", 'कोहरा और ओले: -ig वाले शब्द', 'الضباب والبَرَد: كلمات تنتهي بـ -ig'),
		points: [
			{
				t: {
					ru: ['Из слова в признак', 'Из существительного делаем прилагательное с -ig: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					uk: ['Зі слова в ознаку', 'З іменника робимо прикметник з -ig: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					en: ['From noun to adjective', 'Add -ig to make an adjective: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					pl: ['Ze słowa w cechę', 'Z rzeczownika robimy przymiotnik z -ig: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					es: ['De sustantivo a adjetivo', 'Con -ig se forma un adjetivo: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					fr: ['Du nom à l’adjectif', 'Avec -ig on forme un adjectif : der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					tr: ['İsimden sıfata', '-ig ekiyle sıfat yapılır: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					ro: ['Din substantiv în adjectiv', 'Cu -ig facem adjectiv: der Nebel → neblig, die Sonne → sonnig, der Wind → windig.'],
					uz: ['Otdan sifatga', "-ig bilan sifat yasaladi: der Nebel → neblig, die Sonne → sonnig, der Wind → windig."],
					hi: ['संज्ञा से विशेषण', '-ig जोड़कर विशेषण बनाते हैं: der Nebel → neblig, die Sonne → sonnig, der Wind → windig।'],
					ar: ['من الاسم إلى الصفة', 'بإضافة -ig نصنع صفة: der Nebel → neblig، die Sonne → sonnig، der Wind → windig.']
				},
				examples: [
					ex('Heute Abend ist es neblig.', t11('Сегодня вечером туманно.', 'Сьогодні ввечері туманно.', 'This evening it’s foggy.', 'Dziś wieczorem jest mglisto.', 'Esta noche hay niebla.', 'Ce soir, il y a du brouillard.', 'Bu akşam hava sisli.', 'Diseară e ceață.', 'Bugun kechqurun tumanli.', 'आज शाम कोहरा है।', 'هذا المساء الجو ضبابي.'))
				]
			}
		]
	},

	'lake-ruins-six': {
		title: t11('Жара и солнце', 'Спека і сонце', 'Heat and sun', 'Upał i słońce', 'Calor y sol', 'Chaleur et soleil', 'Sıcak ve güneş', 'Caniculă și soare', 'Issiq va quyosh', 'गर्मी और धूप', 'الحر والشمس'),
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Слово из двух частей берёт род последней: die Sonne + die Brille → die Sonnenbrille.'],
					uk: ['Нових правил немає', 'Слово з двох частин бере рід останньої: die Sonne + die Brille → die Sonnenbrille.'],
					en: ['No new rules', 'A two-part word takes the gender of the last part: die Sonne + die Brille → die Sonnenbrille.'],
					pl: ['Bez nowych reguł', 'Słowo z dwóch części ma rodzaj ostatniej: die Sonne + die Brille → die Sonnenbrille.'],
					es: ['Sin reglas nuevas', 'Una palabra de dos partes toma el género de la última: die Sonne + die Brille → die Sonnenbrille.'],
					fr: ['Pas de nouvelle règle', 'Un mot composé prend le genre de la dernière partie : die Sonne + die Brille → die Sonnenbrille.'],
					tr: ['Yeni kural yok', 'İki parçalı kelime son parçanın cinsiyetini alır: die Sonne + die Brille → die Sonnenbrille.'],
					ro: ['Fără reguli noi', 'Un cuvânt din două părți ia genul ultimei: die Sonne + die Brille → die Sonnenbrille.'],
					uz: ["Yangi qoida yo'q", "Ikki qismli so'z oxirgi qismning rodini oladi: die Sonne + die Brille → die Sonnenbrille."],
					hi: ['कोई नया नियम नहीं', 'दो हिस्सों वाला शब्द आखिरी हिस्से का लिंग लेता है: die Sonne + die Brille → die Sonnenbrille।'],
					ar: ['لا قواعد جديدة', 'الكلمة المركبة تأخذ جنس جزئها الأخير: die Sonne + die Brille → die Sonnenbrille.']
				},
				examples: [
					ex('Ich nehme die Sonnenbrille.', t11('Я беру солнечные очки.', 'Я беру сонцезахисні окуляри.', 'I’ll take my sunglasses.', 'Biorę okulary przeciwsłoneczne.', 'Me llevo las gafas de sol.', 'Je prends mes lunettes de soleil.', 'Güneş gözlüğünü alıyorum.', 'Iau ochelarii de soare.', "Quyosh ko'zoynagini olaman.", 'मैं धूप का चश्मा लेता हूँ।', 'آخذ النظارة الشمسية.'))
				]
			}
		]
	},

	'lake-ruins-seven': {
		title: t11('Погода меняется', 'Погода змінюється', 'The weather changes', 'Pogoda się zmienia', 'El tiempo cambia', 'Le temps change', 'Hava değişiyor', 'Vremea se schimbă', "Ob-havo o'zgaradi", 'मौसम बदलता है', 'الطقس يتغير'),
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Температуру ниже нуля говорят с minus: minus fünf Grad.'],
					uk: ['Нових правил немає', 'Температуру нижче нуля кажуть з minus: minus fünf Grad.'],
					en: ['No new rules', 'Below zero say minus: minus fünf Grad.'],
					pl: ['Bez nowych reguł', 'Temperaturę poniżej zera mówimy z minus: minus fünf Grad.'],
					es: ['Sin reglas nuevas', 'Bajo cero se dice minus: minus fünf Grad.'],
					fr: ['Pas de nouvelle règle', 'En dessous de zéro, on dit minus : minus fünf Grad.'],
					tr: ['Yeni kural yok', 'Sıfırın altı minus ile söylenir: minus fünf Grad.'],
					ro: ['Fără reguli noi', 'Sub zero spui minus: minus fünf Grad.'],
					uz: ["Yangi qoida yo'q", "Noldan past harorat minus bilan aytiladi: minus fünf Grad."],
					hi: ['कोई नया नियम नहीं', 'शून्य से नीचे minus कहते हैं: minus fünf Grad।'],
					ar: ['لا قواعد جديدة', 'تحت الصفر نقول minus: minus fünf Grad.']
				},
				examples: [
					ex('In der Nacht sind es minus fünf Grad.', t11('Ночью минус пять градусов.', 'Уночі мінус п’ять градусів.', 'At night it’s minus five degrees.', 'W nocy jest minus pięć stopni.', 'Por la noche hace cinco grados bajo cero.', 'La nuit, il fait moins cinq.', 'Gece eksi beş derece.', 'Noaptea sunt minus cinci grade.', 'Tunda minus besh daraja.', 'रात में माइनस पाँच डिग्री है।', 'في الليل الحرارة خمس درجات تحت الصفر.'))
				]
			}
		]
	},

	'lake-ruins-eight': {
		title: t11('Повторение: погода и одежда', 'Повторення: погода й одяг', 'Review: weather and clothes', 'Powtórka: pogoda i ubranie', 'Repaso: tiempo y ropa', 'Révision : météo et vêtements', 'Tekrar: hava ve kıyafet', 'Recapitulare: vreme și haine', 'Takrorlash: ob-havo va kiyim', 'दोहराव: मौसम और कपड़े', 'مراجعة: الطقس والملابس'),
		points: [esPoint]
	},

	'lake-ruins-nine': {
		title: t11('Планируем день по прогнозу', 'Плануємо день за прогнозом', 'Planning the day by the forecast', 'Planujemy dzień według prognozy', 'Planear el día según el pronóstico', 'Planifier la journée selon la météo', 'Günü tahmine göre planlamak', 'Planificăm ziua după prognoză', "Kunni prognozga qarab rejalashtiramiz", 'पूर्वानुमान से दिन की योजना', 'نخطط اليوم حسب التوقعات'),
		points: [
			{
				t: {
					ru: ['Части дня', 'Повторяем: am Morgen, am Mittag, am Abend. Вопрос о погоде: Wie ist das Wetter?'],
					uk: ['Частини дня', 'Повторюємо: am Morgen, am Mittag, am Abend. Питання про погоду: Wie ist das Wetter?'],
					en: ['Parts of the day', 'Review: am Morgen, am Mittag, am Abend. Asking about the weather: Wie ist das Wetter?'],
					pl: ['Pory dnia', 'Powtarzamy: am Morgen, am Mittag, am Abend. Pytanie o pogodę: Wie ist das Wetter?'],
					es: ['Partes del día', 'Repaso: am Morgen, am Mittag, am Abend. Preguntar por el tiempo: Wie ist das Wetter?'],
					fr: ['Les moments de la journée', 'Révision : am Morgen, am Mittag, am Abend. Demander la météo : Wie ist das Wetter ?'],
					tr: ['Günün bölümleri', 'Tekrar: am Morgen, am Mittag, am Abend. Havayı sormak: Wie ist das Wetter?'],
					ro: ['Părțile zilei', 'Recapitulăm: am Morgen, am Mittag, am Abend. Întrebarea despre vreme: Wie ist das Wetter?'],
					uz: ['Kun qismlari', "Takrorlaymiz: am Morgen, am Mittag, am Abend. Ob-havo haqida savol: Wie ist das Wetter?"],
					hi: ['दिन के हिस्से', 'दोहराव: am Morgen, am Mittag, am Abend। मौसम पूछना: Wie ist das Wetter?'],
					ar: ['أجزاء اليوم', 'مراجعة: am Morgen، am Mittag، am Abend. والسؤال عن الطقس: Wie ist das Wetter؟']
				},
				examples: [
					ex('Wie ist das Wetter heute in Berlin?', t11('Какая сегодня погода в Берлине?', 'Яка сьогодні погода в Берліні?', 'What’s the weather like in Berlin today?', 'Jaka jest dziś pogoda w Berlinie?', '¿Qué tiempo hace hoy en Berlín?', 'Quel temps fait-il aujourd’hui à Berlin ?', 'Bugün Berlin’de hava nasıl?', 'Cum e vremea azi la Berlin?', 'Bugun Berlinda ob-havo qanday?', 'आज बर्लिन में मौसम कैसा है?', 'كيف الطقس اليوم في برلين؟'))
				]
			}
		]
	},

	'lake-ruins-ten': {
		title: t11('План на выходные', 'План на вихідні', 'Weekend plans', 'Plan na weekend', 'Plan para el fin de semana', 'Projets pour le week-end', 'Hafta sonu planı', 'Planul de weekend', 'Dam olish kunlari rejasi', 'सप्ताहांत की योजना', 'خطة عطلة نهاية الأسبوع'),
		points: [
			{
				t: {
					ru: ['keinen для мужского рода', 'Если вещь не нужна: Ich brauche keinen Regenschirm (der → keinen).'],
					uk: ['keinen для чоловічого роду', 'Якщо річ не потрібна: Ich brauche keinen Regenschirm (der → keinen).'],
					en: ['keinen for masculine', 'If you don’t need something: Ich brauche keinen Regenschirm (der → keinen).'],
					pl: ['keinen dla rodzaju męskiego', 'Jeśli rzecz nie jest potrzebna: Ich brauche keinen Regenschirm (der → keinen).'],
					es: ['keinen para el masculino', 'Si no necesitas algo: Ich brauche keinen Regenschirm (der → keinen).'],
					fr: ['keinen pour le masculin', 'Si on n’a pas besoin de quelque chose : Ich brauche keinen Regenschirm (der → keinen).'],
					tr: ['Eril için keinen', 'Bir şeye ihtiyacın yoksa: Ich brauche keinen Regenschirm (der → keinen).'],
					ro: ['keinen pentru masculin', 'Dacă nu-ți trebuie ceva: Ich brauche keinen Regenschirm (der → keinen).'],
					uz: ['Erkak rodi uchun keinen', "Narsa kerak bo'lmasa: Ich brauche keinen Regenschirm (der → keinen)."],
					hi: ['पुल्लिंग के लिए keinen', 'अगर कोई चीज़ नहीं चाहिए: Ich brauche keinen Regenschirm (der → keinen)।'],
					ar: ['keinen للمذكر', 'إذا لم تحتج شيئاً: Ich brauche keinen Regenschirm (der → keinen).']
				},
				examples: [
					ex('Morgen ist es warm. Ich brauche keinen Regenschirm.', t11('Завтра тепло. Зонт мне не нужен.', 'Завтра тепло. Парасолька мені не потрібна.', 'Tomorrow it’s warm. I don’t need an umbrella.', 'Jutro będzie ciepło. Nie potrzebuję parasola.', 'Mañana hace calor. No necesito paraguas.', 'Demain, il fait chaud. Je n’ai pas besoin de parapluie.', 'Yarın hava sıcak. Şemsiyeye ihtiyacım yok.', 'Mâine e cald. Nu am nevoie de umbrelă.', 'Ertaga issiq. Menga soyabon kerak emas.', 'कल गर्मी है। मुझे छाता नहीं चाहिए।', 'غداً الجو دافئ. لا أحتاج مظلة.'))
				]
			}
		]
	}
}

module.exports = quests
