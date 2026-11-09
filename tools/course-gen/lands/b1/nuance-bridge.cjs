// B1, раздел wisdom, после link-harbor. Мост оттенков: темы B1, которых не хватало в курсе.
// zwar… aber, sowohl… als auch, indem, bis (союз), Passiv Perfekt, Partizip как прилагательное, brauchen nicht zu, irgend- и sollen
// порядок переводов: ru en uk pl es fr tr ro uz hi ar
// Опора: Passiv (craft-valley), zu + Infinitiv (task-tower), окончания прилагательных (taste-market), парные связки (link-harbor)
// null не используем: 9, 12, 13 заданий учебных квестов написаны и уходят в повторы следующих квестов
const first = require('./nuance/q1-4.cjs')
const second = require('./nuance/q5-8.cjs')

module.exports = {
	id: 'nuance-bridge',
	ns: 'nuanceBridge',
	learnCount: 8,
	dropTasks: [9, 12, 13],
	descKey: 'descriptionNuanceBridge',
	name: ['Мост оттенков', 'Bridge of Nuances', 'Міст відтінків', 'Most niuansów', 'Puente de los matices', 'Pont des nuances', 'Nüanslar Köprüsü', 'Podul nuanțelor', 'Nozikliklar ko‘prigi', 'बारीकियों का पुल', 'جسر التفاصيل'],
	desc: [
		'Здесь ты учишь то, что делает речь точнее: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt и причастия вместо прилагательных.',
		'Here you learn what makes your German more precise: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt and participles as adjectives.',
		'Тут ти вчиш те, що робить мовлення точнішим: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt і дієприкметники замість прикметників.',
		'Tutaj uczysz się tego, co czyni mowę dokładniejszą: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt i imiesłowy jako przymiotniki.',
		'Aquí aprendes lo que hace tu alemán más preciso: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt y participios como adjetivos.',
		'Ici, tu apprends ce qui rend ton allemand plus précis : zwar… aber, sowohl… als auch, indem, bis, le Passiv Perfekt et les participes employés comme adjectifs.',
		'Burada Almancanı daha kesin yapan şeyleri öğreniyorsun: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt ve sıfat olarak ortaçlar.',
		'Aici înveți ce face vorbirea mai precisă: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt și participiile folosite ca adjective.',
		'Bu yerda nutqni aniqroq qiladigan narsalarni o‘rganasan: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt va sifat sifatida sifatdoshlar.',
		'यहाँ तुम वह सीखते हो जो तुम्हारी जर्मन को ज़्यादा सटीक बनाता है: zwar… aber, sowohl… als auch, indem, bis, Passiv Perfekt और विशेषण की तरह Partizip।',
		'هنا تتعلم ما يجعل لغتك أدق: zwar… aber و sowohl… als auch و indem و bis و Passiv Perfekt والأسماء المشتقة كصفات.'
	],
	intro: {
		p1: ['Оттенки смысла: zwar… aber, sowohl… als auch, indem, bis', 'Shades of meaning: zwar… aber, sowohl… als auch, indem, bis', 'Відтінки змісту: zwar… aber, sowohl… als auch, indem, bis', 'Odcienie znaczenia: zwar… aber, sowohl… als auch, indem, bis', 'Matices de sentido: zwar… aber, sowohl… als auch, indem, bis', 'Nuances de sens : zwar… aber, sowohl… als auch, indem, bis', 'Anlam incelikleri: zwar… aber, sowohl… als auch, indem, bis', 'Nuanțe de sens: zwar… aber, sowohl… als auch, indem, bis', 'Ma’no nozikliklari: zwar… aber, sowohl… als auch, indem, bis', 'अर्थ की बारीकियाँ: zwar… aber, sowohl… als auch, indem, bis', 'تفاصيل المعنى: zwar… aber و sowohl… als auch و indem و bis'],
		p2: ['Passiv Perfekt и причастия: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt and participles: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt і дієприкметники: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt i imiesłowy: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt y participios: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt et participes : ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt ve ortaçlar: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt și participii: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt va sifatdoshlar: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt और Partizip: ist gebaut worden, die geöffnete Tür', 'Passiv Perfekt والمشتقات: ist gebaut worden, die geöffnete Tür'],
		p3: ['Не нужно, где-то, говорят: brauchen nicht zu, irgendwo, Er soll reich sein', 'No need, somewhere, they say: brauchen nicht zu, irgendwo, Er soll reich sein', 'Не треба, десь, кажуть: brauchen nicht zu, irgendwo, Er soll reich sein', 'Nie trzeba, gdzieś, podobno: brauchen nicht zu, irgendwo, Er soll reich sein', 'No hace falta, en algún sitio, dicen: brauchen nicht zu, irgendwo, Er soll reich sein', 'Pas besoin, quelque part, on dit : brauchen nicht zu, irgendwo, Er soll reich sein', 'Gerek yok, bir yerde, söylentiye göre: brauchen nicht zu, irgendwo, Er soll reich sein', 'Nu trebuie, undeva, se spune: brauchen nicht zu, irgendwo, Er soll reich sein', 'Kerak emas, qayerdadir, aytishlaricha: brauchen nicht zu, irgendwo, Er soll reich sein', 'ज़रूरत नहीं, कहीं, कहते हैं: brauchen nicht zu, irgendwo, Er soll reich sein', 'لا داعي، في مكان ما، يقال: brauchen nicht zu و irgendwo و Er soll reich sein']
	},
	quests: [
		...first,
		...second,
		// 9. Повторение
		{
			title: ['Повторение: оттенки', 'Review: nuances', 'Повторення: відтінки', 'Powtórka: niuanse', 'Repaso: matices', 'Révision : nuances', 'Tekrar: nüanslar', 'Recapitulare: nuanțe', 'Takrorlash: nozikliklar', 'दोहराव: बारीकियाँ', 'مراجعة: التفاصيل'],
			desc: [
				'Повторяем всю землю: zwar… aber, sowohl… als auch, indem, bis, ist … worden, причастия перед существительным, brauchen nicht zu, irgend- и sollen. Смотри, где стоит глагол: после indem и bis он идёт в конец.',
				'We review the whole land: zwar… aber, sowohl… als auch, indem, bis, ist … worden, participles before nouns, brauchen nicht zu, irgend- and sollen. Watch the verb: after indem and bis it goes to the end.',
				'Повторюємо всю землю: zwar… aber, sowohl… als auch, indem, bis, ist … worden, дієприкметники перед іменником, brauchen nicht zu, irgend- і sollen. Стеж за дієсловом: після indem і bis воно йде в кінець.',
				'Powtarzamy całą krainę: zwar… aber, sowohl… als auch, indem, bis, ist … worden, imiesłowy przed rzeczownikiem, brauchen nicht zu, irgend- i sollen. Uważaj na czasownik: po indem i bis idzie na koniec.',
				'Repasamos toda la tierra: zwar… aber, sowohl… als auch, indem, bis, ist … worden, participios delante del sustantivo, brauchen nicht zu, irgend- y sollen. Fíjate en el verbo: después de indem y bis va al final.',
				'Nous révisons toute la terre : zwar… aber, sowohl… als auch, indem, bis, ist … worden, les participes devant le nom, brauchen nicht zu, irgend- et sollen. Attention au verbe : après indem et bis, il va à la fin.',
				'Bütün diyarı tekrar ediyoruz: zwar… aber, sowohl… als auch, indem, bis, ist … worden, isimden önce ortaçlar, brauchen nicht zu, irgend- ve sollen. Fiile dikkat et: indem ve bis sonrasında sona gider.',
				'Recapitulăm tot ținutul: zwar… aber, sowohl… als auch, indem, bis, ist … worden, participiile înaintea substantivului, brauchen nicht zu, irgend- și sollen. Atenție la verb: după indem și bis merge la sfârșit.',
				'Butun yurtni takrorlaymiz: zwar… aber, sowohl… als auch, indem, bis, ist … worden, ot oldidagi sifatdoshlar, brauchen nicht zu, irgend- va sollen. Fe’lga e’tibor ber: indem va bis dan keyin u oxirga o‘tadi.',
				'हम पूरी भूमि दोहराते हैं: zwar… aber, sowohl… als auch, indem, bis, ist … worden, संज्ञा से पहले Partizip, brauchen nicht zu, irgend- और sollen। क्रिया पर ध्यान दो: indem और bis के बाद वह अंत में जाती है।',
				'نراجع الأرض كلها: zwar… aber و sowohl… als auch و indem و bis و ist … worden والمشتقات قبل الاسم و brauchen nicht zu و irgend- و sollen. انتبه إلى الفعل: بعد indem و bis يأتي في النهاية.'
			],
			vocab: [],
			tasks: [
				['gw', ['Книга хоть и толстая, но увлекательная', 'The book is thick, but exciting', 'Книжка хоч і товста, але захоплива', 'Książka jest wprawdzie gruba, ale ciekawa', 'El libro es grueso, pero emocionante', 'Le livre est certes épais, mais passionnant', 'Kitap gerçi kalın ama heyecanlı', 'Cartea e groasă, dar captivantă', 'Kitob qalin bo‘lsa ham, qiziqarli', 'किताब मोटी ज़रूर है, लेकिन रोमांचक है', 'الكتاب سميك لكنه مشوق'],
					'Das Buch ist zwar dick, ___ spannend.', 'aber'],
				['gw', ['Я ем и мясо, и рыбу', 'I eat both meat and fish', 'Я їм і м’ясо, і рибу', 'Jem zarówno mięso, jak i ryby', 'Como tanto carne como pescado', 'Je mange aussi bien de la viande que du poisson', 'Hem et hem balık yerim', 'Mănânc atât carne, cât și pește', 'Men ham go‘sht, ham baliq yeyman', 'मैं मांस और मछली दोनों खाता हूँ', 'آكل اللحم والسمك'],
					'Ich esse ___ Fleisch als auch Fisch.', 'sowohl'],
				['gw', ['Он учится тем, что смотрит много фильмов', 'He learns by watching a lot of films', 'Він вчиться тим, що дивиться багато фільмів', 'Uczy się przez to, że ogląda dużo filmów', 'Aprende viendo muchas películas', 'Il apprend en regardant beaucoup de films', 'Çok film izleyerek öğreniyor', 'Învață prin faptul că se uită la multe filme', 'U ko‘p film ko‘rib o‘rganadi', 'वह बहुत फ़िल्में देखकर सीखता है', 'يتعلم عن طريق مشاهدة أفلام كثيرة'],
					'Er lernt, ___ er viele Filme sieht.', 'indem'],
				['gw', ['Жди здесь, пока я не вернусь', 'Wait here until I come back', 'Чекай тут, доки я не повернуся', 'Czekaj tutaj, aż wrócę', 'Espera aquí hasta que vuelva', 'Attends ici jusqu’à ce que je revienne', 'Ben dönene kadar burada bekle', 'Așteaptă aici până când mă întorc', 'Men qaytgunimcha shu yerda kut', 'मेरे लौटने तक यहीं रुको', 'انتظر هنا حتى أعود'],
					'Warte hier, ___ ich zurückkomme.', 'bis'],
				['gw', ['Проблему решили', 'The problem has been solved', 'Проблему вирішили', 'Problem został rozwiązany', 'El problema ha sido resuelto', 'Le problème a été résolu', 'Sorun çözüldü', 'Problema a fost rezolvată', 'Muammo hal qilindi', 'समस्या हल कर दी गई है', 'تم حل المشكلة'],
					'Das Problem ist gelöst ___.', 'worden'],
				['ga', ['Она носит подержанную куртку', 'She wears a second-hand jacket', 'Вона носить вживану куртку', 'Nosi używaną kurtkę', 'Lleva una chaqueta usada', 'Elle porte une veste d’occasion', 'İkinci el bir ceket giyiyor', 'Poartă o jachetă second-hand', 'U ishlatilgan kurtka kiyadi', 'वह पुरानी जैकेट पहनती है', 'ترتدي سترة مستعملة'],
					'Sie trägt eine ___ Jacke.', 'gebrauchte'],
				['gv', ['Тебе не нужно отвечать', 'You don’t need to answer', 'Тобі не треба відповідати', 'Nie musisz odpowiadać', 'No hace falta que respondas', 'Tu n’as pas besoin de répondre', 'Cevap vermene gerek yok', 'Nu trebuie să răspunzi', 'Javob berishing shart emas', 'तुम्हें जवाब देने की ज़रूरत नहीं है', 'لا داعي لأن تجيب'],
					'Du ___ nicht zu antworten.', 'brauchst'],
				['gw', ['Мой ключ где-то в доме', 'My key is somewhere in the house', 'Мій ключ десь у будинку', 'Mój klucz jest gdzieś w domu', 'Mi llave está en algún sitio de la casa', 'Ma clé est quelque part dans la maison', 'Anahtarım evde bir yerde', 'Cheia mea e undeva în casă', 'Kalitim uyning qayeridadir', 'मेरी चाबी घर में कहीं है', 'مفتاحي في مكان ما في البيت'],
					'Mein Schlüssel ist ___ im Haus.', 'irgendwo'],
				['gw', ['Говорят, новый учитель очень милый', 'They say the new teacher is very nice', 'Кажуть, новий учитель дуже милий', 'Podobno nowy nauczyciel jest bardzo miły', 'Dicen que el nuevo profesor es muy amable', 'On dit que le nouveau professeur est très gentil', 'Yeni öğretmenin çok iyi olduğu söyleniyor', 'Se spune că noul profesor e foarte drăguț', 'Aytishlaricha, yangi o‘qituvchi juda yoqimli', 'कहते हैं नए शिक्षक बहुत अच्छे हैं', 'يقال إن المعلم الجديد لطيف جدًا'],
					'Der neue Lehrer ___ sehr nett sein.', 'soll'],
				['ro', ['Комната хоть и маленькая, но красивая', 'The room is small, but beautiful', 'Кімната хоч і маленька, але гарна', 'Pokój jest wprawdzie mały, ale ładny', 'La habitación es pequeña, pero bonita', 'La chambre est certes petite, mais belle', 'Oda gerçi küçük ama güzel', 'Camera e mică, dar frumoasă', 'Xona kichik bo‘lsa ham, chiroyli', 'कमरा छोटा ज़रूर है, लेकिन सुंदर है', 'الغرفة صغيرة لكنها جميلة'],
					'Das Zimmer ist zwar klein aber schön', ['sondern']],
				['ro', ['Он готовит и суп, и мясо', 'He cooks both soup and meat', 'Він готує і суп, і м’ясо', 'Gotuje zarówno zupę, jak i mięso', 'Cocina tanto sopa como carne', 'Il cuisine aussi bien de la soupe que de la viande', 'Hem çorba hem et pişiriyor', 'Gătește atât supă, cât și carne', 'U ham sho‘rva, ham go‘sht pishiradi', 'वह सूप और मांस दोनों बनाता है', 'يطبخ الحساء واللحم'],
					'Er kocht sowohl Suppe als auch Fleisch', ['oder']],
				['ro', ['Окно починили', 'The window has been repaired', 'Вікно полагодили', 'Okno zostało naprawione', 'La ventana ha sido reparada', 'La fenêtre a été réparée', 'Pencere tamir edildi', 'Fereastra a fost reparată', 'Deraza tuzatildi', 'खिड़की ठीक कर दी गई है', 'تم إصلاح النافذة'],
					'Das Fenster ist repariert worden', ['geworden']],
				['ok', ['Можно экономить деньги тем, что ешь дома.', 'You can save money by eating at home.', 'Можна заощаджувати гроші тим, що їси вдома.', 'Można oszczędzać pieniądze przez to, że je się w domu.', 'Se puede ahorrar dinero comiendo en casa.', 'On peut économiser de l’argent en mangeant à la maison.', 'Evde yiyerek para biriktirilebilir.', 'Poți economisi bani prin faptul că mănânci acasă.', 'Uyda ovqatlanib, pul tejash mumkin.', 'घर पर खाकर पैसे बचाए जा सकते हैं।', 'يمكن توفير المال عن طريق الأكل في البيت.'],
					['Man kann Geld sparen, indem man zu Hause isst.', 'Man kann Geld sparen, indem man isst zu Hause.', 'Man kann Geld sparen, indem isst man zu Hause.'], 'Man kann Geld sparen, indem man zu Hause isst.'],
				['ok', ['Вам не нужно ждать.', 'You don’t need to wait.', 'Вам не треба чекати.', 'Nie musicie czekać.', 'No hace falta que esperéis.', 'Vous n’avez pas besoin d’attendre.', 'Beklemenize gerek yok.', 'Nu trebuie să așteptați.', 'Kutishingiz shart emas.', 'तुम लोगों को इंतज़ार करने की ज़रूरत नहीं है।', 'لا داعي لأن تنتظروا.'],
					['Ihr braucht nicht zu warten.', 'Ihr braucht nicht warten zu.', 'Ihr braucht zu nicht warten.'], 'Ihr braucht nicht zu warten.'],
				['rd', ['Почему Тим не покупает новый телефон?', 'Why doesn’t Tim buy a new phone?', 'Чому Тім не купує новий телефон?', 'Dlaczego Tim nie kupuje nowego telefonu?', '¿Por qué Tim no compra un móvil nuevo?', 'Pourquoi Tim n’achète-t-il pas de nouveau téléphone ?', 'Tim neden yeni telefon almıyor?', 'De ce nu cumpără Tim un telefon nou?', 'Tim nega yangi telefon sotib olmayapti?', 'टिम नया फ़ोन क्यों नहीं खरीदता?', 'لماذا لا يشتري تيم هاتفًا جديدًا؟'],
					'Tim braucht ein Handy. Ein neues Handy ist zwar schön, aber teuer. Deshalb kauft er ein gebrauchtes Handy. Das ist auch gut.', ['Es ist zu teuer.', 'Es ist zu klein.', 'Es ist kaputt.'], 'Es ist zu teuer.']
			]
		},
		// 10. Контрольный
		{
			title: ['Контрольный квест: оттенки', 'Final quest: nuances', 'Контрольний квест: відтінки', 'Zadanie kontrolne: niuanse', 'Misión final: matices', 'Quête finale : nuances', 'Kontrol görevi: nüanslar', 'Misiune de control: nuanțe', 'Nazorat topshirig‘i: nozikliklar', 'अंतिम खोज: बारीकियाँ', 'المهمة النهائية: التفاصيل'],
			desc: [
				'Контрольный квест: все темы земли вперемешку и немного из прошлых земель. Вспомни: zwar… aber, sowohl… als auch, indem и bis с глаголом в конце, ist … worden, причастия, brauchen nicht zu, irgend- и sollen.',
				'Final quest: all the topics of the land mixed together and a little from earlier lands. Remember: zwar… aber, sowohl… als auch, indem and bis with the verb at the end, ist … worden, participles, brauchen nicht zu, irgend- and sollen.',
				'Контрольний квест: усі теми землі впереміш і трохи з минулих земель. Згадай: zwar… aber, sowohl… als auch, indem і bis з дієсловом у кінці, ist … worden, дієприкметники, brauchen nicht zu, irgend- і sollen.',
				'Zadanie kontrolne: wszystkie tematy krainy razem i trochę z poprzednich krain. Przypomnij sobie: zwar… aber, sowohl… als auch, indem i bis z czasownikiem na końcu, ist … worden, imiesłowy, brauchen nicht zu, irgend- i sollen.',
				'Misión final: todos los temas de la tierra mezclados y un poco de tierras anteriores. Recuerda: zwar… aber, sowohl… als auch, indem y bis con el verbo al final, ist … worden, participios, brauchen nicht zu, irgend- y sollen.',
				'Quête finale : tous les thèmes de la terre mélangés et un peu des terres précédentes. Rappelle-toi : zwar… aber, sowohl… als auch, indem et bis avec le verbe à la fin, ist … worden, les participes, brauchen nicht zu, irgend- et sollen.',
				'Kontrol görevi: diyarın tüm konuları karışık ve önceki diyarlardan biraz. Hatırla: zwar… aber, sowohl… als auch, fiili sonda olan indem ve bis, ist … worden, ortaçlar, brauchen nicht zu, irgend- ve sollen.',
				'Misiune de control: toate temele ținutului amestecate și puțin din ținuturile anterioare. Amintește-ți: zwar… aber, sowohl… als auch, indem și bis cu verbul la sfârșit, ist … worden, participiile, brauchen nicht zu, irgend- și sollen.',
				'Nazorat topshirig‘i: yurtning barcha mavzulari aralash va oldingi yurtlardan ozroq. Esla: zwar… aber, sowohl… als auch, fe’li oxirda turadigan indem va bis, ist … worden, sifatdoshlar, brauchen nicht zu, irgend- va sollen.',
				'अंतिम खोज: भूमि के सभी विषय मिले हुए और पिछली भूमियों से थोड़ा। याद करो: zwar… aber, sowohl… als auch, अंत में क्रिया वाले indem और bis, ist … worden, Partizip, brauchen nicht zu, irgend- और sollen।',
				'المهمة النهائية: كل مواضيع الأرض مختلطة وقليل من الأراضي السابقة. تذكر: zwar… aber و sowohl… als auch و indem و bis مع الفعل في النهاية و ist … worden والمشتقات و brauchen nicht zu و irgend- و sollen.'
			],
			vocab: [],
			tasks: [
				['tr', ['Город хоть и маленький, но очень красивый.', 'The town is small, but very beautiful.', 'Місто хоч і маленьке, але дуже гарне.', 'Miasto jest wprawdzie małe, ale bardzo ładne.', 'La ciudad es pequeña, pero muy bonita.', 'La ville est certes petite, mais très belle.', 'Şehir gerçi küçük ama çok güzel.', 'Orașul e mic, dar foarte frumos.', 'Shahar kichik bo‘lsa ham, juda chiroyli.', 'शहर छोटा ज़रूर है, लेकिन बहुत सुंदर है।', 'المدينة صغيرة لكنها جميلة جدًا.'],
					['Die Stadt ist zwar klein, aber sehr schön.', 'Die Stadt ist zwar klein, oder sehr schön.', 'Die Stadt zwar ist klein, aber sehr schön.'], 'Die Stadt ist zwar klein, aber sehr schön.'],
				['gw', ['И Анна, и Том учат немецкий', 'Both Anna and Tom are learning German', 'І Анна, і Том вчать німецьку', 'Zarówno Anna, jak i Tom uczą się niemieckiego', 'Tanto Anna como Tom aprenden alemán', 'Anna et Tom apprennent tous les deux l’allemand', 'Hem Anna hem Tom Almanca öğreniyor', 'Atât Anna, cât și Tom învață germana', 'Anna ham, Tom ham nemis tilini o‘rganyapti', 'अन्ना और टॉम दोनों जर्मन सीख रहे हैं', 'تتعلم آنا وتوم الألمانية'],
					'Sowohl Anna ___ auch Tom lernen Deutsch.', 'als'],
				['gv', ['Я помогаю тебе тем, что убираю кухню', 'I help you by tidying the kitchen', 'Я допомагаю тобі тим, що прибираю кухню', 'Pomagam ci przez to, że sprzątam kuchnię', 'Te ayudo ordenando la cocina', 'Je t’aide en rangeant la cuisine', 'Mutfağı toplayarak sana yardım ediyorum', 'Te ajut prin faptul că fac ordine în bucătărie', 'Oshxonani yig‘ishtirib, senga yordam beraman', 'मैं रसोई साफ़ करके तुम्हारी मदद करता हूँ', 'أساعدك عن طريق ترتيب المطبخ'],
					'Ich helfe dir, indem ich die Küche ___.', 'aufräume'],
				['gv', ['Оставайся в постели, пока не выздоровеешь', 'Stay in bed until you are well', 'Залишайся в ліжку, доки не одужаєш', 'Zostań w łóżku, aż wyzdrowiejesz', 'Quédate en la cama hasta que estés bien', 'Reste au lit jusqu’à ce que tu sois guéri', 'İyileşene kadar yatakta kal', 'Rămâi în pat până când te faci bine', 'Tuzalguningcha to‘shakda yot', 'ठीक होने तक बिस्तर पर रहो', 'ابق في السرير حتى تتعافى'],
					'Bleib im Bett, bis du gesund ___.', 'bist'],
				['gw', ['Пирог испекли', 'The cake has been baked', 'Пиріг спекли', 'Ciasto zostało upieczone', 'El pastel ha sido horneado', 'Le gâteau a été cuit', 'Pasta pişirildi', 'Prăjitura a fost coaptă', 'Pirog pishirildi', 'केक बना दिया गया है', 'تم خبز الكعكة'],
					'Der Kuchen ist gebacken ___.', 'worden'],
				['ga', ['Поющая девочка моя дочь', 'The singing girl is my daughter', 'Дівчинка, що співає, моя донька', 'Śpiewająca dziewczynka to moja córka', 'La niña que canta es mi hija', 'La fille qui chante est ma fille', 'Şarkı söyleyen kız benim kızım', 'Fata care cântă este fiica mea', 'Kuylayotgan qiz mening qizim', 'गाती हुई लड़की मेरी बेटी है', 'الفتاة التي تغني هي ابنتي'],
					'Das ___ Mädchen ist meine Tochter.', 'singende'],
				['gw', ['Ему сегодня не нужно работать', 'He doesn’t need to work today', 'Йому сьогодні не треба працювати', 'Dzisiaj nie musi pracować', 'Hoy no necesita trabajar', 'Il n’a pas besoin de travailler aujourd’hui', 'Bugün çalışmasına gerek yok', 'Azi nu trebuie să lucreze', 'Bugun unga ishlash shart emas', 'उसे आज काम करने की ज़रूरत नहीं है', 'لا داعي لأن يعمل اليوم'],
					'Er braucht heute nicht ___ arbeiten.', 'zu'],
				['gw', ['Кто-то вчера мне звонил', 'Someone called me yesterday', 'Хтось учора мені дзвонив', 'Ktoś wczoraj do mnie dzwonił', 'Alguien me llamó ayer', 'Quelqu’un m’a appelé hier', 'Birisi dün beni aradı', 'Cineva m-a sunat ieri', 'Kimdir kecha menga qo‘ng‘iroq qildi', 'कल किसी ने मुझे फ़ोन किया', 'اتصل بي شخص ما أمس'],
					'___ hat mich gestern angerufen.', 'Irgendjemand'],
				['gw', ['Говорят, в Берлине очень много музеев', 'They say there are very many museums in Berlin', 'Кажуть, у Берліні дуже багато музеїв', 'Podobno w Berlinie jest bardzo dużo muzeów', 'Dicen que en Berlín hay muchísimos museos', 'On dit qu’il y a beaucoup de musées à Berlin', 'Berlin’de çok fazla müze olduğu söyleniyor', 'Se spune că în Berlin sunt foarte multe muzee', 'Aytishlaricha, Berlinda muzeylar juda ko‘p', 'कहते हैं बर्लिन में बहुत सारे संग्रहालय हैं', 'يقال إن في برلين متاحف كثيرة جدًا'],
					'In Berlin ___ es sehr viele Museen geben.', 'soll'],
				['ro', ['У меня хоть и мало времени, но я тебе помогу', 'I have little time, but I will help you', 'У мене хоч і мало часу, але я тобі допоможу', 'Mam wprawdzie mało czasu, ale ci pomogę', 'Tengo poco tiempo, pero te ayudo', 'J’ai certes peu de temps, mais je t’aide', 'Gerçi az zamanım var ama sana yardım ederim', 'Am puțin timp, dar te ajut', 'Vaqtim kam bo‘lsa ham, senga yordam beraman', 'मेरे पास समय कम ज़रूर है, लेकिन मैं तुम्हारी मदद करूँगा', 'وقتي قليل لكنني سأساعدك'],
					'Ich habe zwar wenig Zeit aber ich helfe dir', ['oder']],
				['ro', ['Письмо написали вчера', 'The letter was written yesterday', 'Листа написали вчора', 'List został napisany wczoraj', 'La carta fue escrita ayer', 'La lettre a été écrite hier', 'Mektup dün yazıldı', 'Scrisoarea a fost scrisă ieri', 'Xat kecha yozildi', 'पत्र कल लिखा गया था', 'كُتبت الرسالة أمس'],
					'Der Brief ist gestern geschrieben worden', ['geworden']],
				['ro', ['Она учится тем, что много читает', 'She learns by reading a lot', 'Вона вчиться тим, що багато читає', 'Uczy się przez to, że dużo czyta', 'Aprende leyendo mucho', 'Elle apprend en lisant beaucoup', 'Çok okuyarak öğreniyor', 'Învață prin faptul că citește mult', 'U ko‘p o‘qib o‘rganadi', 'वह बहुत पढ़कर सीखती है', 'تتعلم عن طريق القراءة كثيرًا'],
					'Sie lernt indem sie viel liest', ['um']],
				['gv', ['Если бы у меня было время, я бы пришёл', 'If I had time, I would come', 'Якби я мав час, я б прийшов', 'Gdybym miał czas, przyszedłbym', 'Si tuviera tiempo, vendría', 'Si j’avais le temps, je viendrais', 'Zamanım olsaydı gelirdim', 'Dacă aș avea timp, aș veni', 'Vaqtim bo‘lganida kelardim', 'अगर मेरे पास समय होता, तो मैं आता', 'لو كان لدي وقت لأتيت'],
					'Wenn ich Zeit ___, würde ich kommen.', 'hätte'],
				['gw', ['Несмотря на дождь, мы идём гулять', 'Despite the rain, we are going for a walk', 'Попри дощ, ми йдемо гуляти', 'Mimo deszczu idziemy na spacer', 'A pesar de la lluvia, vamos a pasear', 'Malgré la pluie, nous allons nous promener', 'Yağmura rağmen yürüyüşe çıkıyoruz', 'În ciuda ploii, mergem la plimbare', 'Yomg‘irga qaramay, sayrga chiqyapmiz', 'बारिश के बावजूद हम घूमने जा रहे हैं', 'رغم المطر سنخرج للتنزه'],
					'Trotz ___ Regens gehen wir spazieren.', 'des'],
				['rd', ['Что нужно сделать Мие?', 'What does Mia have to do?', 'Що треба зробити Мії?', 'Co musi zrobić Mia?', '¿Qué tiene que hacer Mia?', 'Que doit faire Mia ?', 'Mia’nın ne yapması gerekiyor?', 'Ce trebuie să facă Mia?', 'Mia nima qilishi kerak?', 'मिया को क्या करना है?', 'ماذا يجب أن تفعل ميا؟'],
					'Mia hat eine neue Wohnung. Die Küche ist zwar klein, aber sie ist schon repariert worden. Mia braucht also nichts zu machen. Sie wartet nur, bis ihre Möbel kommen.', ['Nur auf die Möbel warten.', 'Die Küche reparieren.', 'Eine neue Wohnung suchen.'], 'Nur auf die Möbel warten.']
			]
		}
	]
}
