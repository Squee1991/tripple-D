// Грамматика к заданиям земли master-lands (Земли мастеров: работа)
const ex = (de, tr) => ({ de, tr })
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })
const p = (title, text) => ({ title, text })
const point = (texts, examples) => ({ t: Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, [v.title, v.text]])), examples })
const L = ['ru', 'uk', 'en', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
// одинаковый заголовок пункта на всех языках
const same = (title, texts) => Object.fromEntries(L.map((k, i) => [k, p(title, texts[i])]))
// разный заголовок пункта на каждом языке
const titled = (titles, texts) => Object.fromEntries(L.map((k, i) => [k, p(titles[k], texts[i])]))

const quests = {
	'job-one': {
		title: t11('Работа: базовые слова', 'Робота: базові слова', 'Work: basic words', 'Praca: podstawowe słowa', 'Trabajo: palabras básicas', 'Le travail : mots de base', 'İş: temel kelimeler', 'Munca: cuvinte de bază', "Ish: asosiy so'zlar", 'काम: बुनियादी शब्द', 'العمل: كلمات أساسية'),
		points: [point(same('arbeiten', [
			'Основа на -t, поэтому du arbeitest, er arbeitet. Профессия: Ich arbeite als Koch.',
			'Основа на -t, тому du arbeitest, er arbeitet. Професія: Ich arbeite als Koch.',
			'The stem ends in -t, so du arbeitest, er arbeitet. Your job: Ich arbeite als Koch.',
			'Temat na -t, więc du arbeitest, er arbeitet. Zawód: Ich arbeite als Koch.',
			'La raíz acaba en -t, por eso du arbeitest, er arbeitet. Profesión: Ich arbeite als Koch.',
			'Le radical finit par -t, donc du arbeitest, er arbeitet. Le métier : Ich arbeite als Koch.',
			'Kök -t ile bitiyor, bu yüzden du arbeitest, er arbeitet. Meslek: Ich arbeite als Koch.',
			'Rădăcina se termină în -t, deci du arbeitest, er arbeitet. Meseria: Ich arbeite als Koch.',
			"O'zak -t bilan tugaydi, shuning uchun du arbeitest, er arbeitet. Kasb: Ich arbeite als Koch.",
			'मूल -t पर खत्म होता है, इसलिए du arbeitest, er arbeitet। पेशा: Ich arbeite als Koch।',
			'الجذر ينتهي بـ -t، لذلك du arbeitest، er arbeitet. والمهنة: Ich arbeite als Koch.'
		]), [ex('Ich arbeite heute.', t11('Сегодня я работаю.', 'Сьогодні я працюю.', 'I’m working today.', 'Dziś pracuję.', 'Hoy trabajo.', 'Aujourd’hui, je travaille.', 'Bugün çalışıyorum.', 'Azi lucrez.', 'Bugun ishlayman.', 'आज मैं काम कर रहा हूँ।', 'أعمل اليوم.'))])]
	},

	'job-two': {
		title: t11('Место работы: im Büro', 'Місце роботи: im Büro', 'Workplace: im Büro', 'Miejsce pracy: im Büro', 'Lugar de trabajo: im Büro', 'Lieu de travail : im Büro', 'İş yeri: im Büro', 'Locul de muncă: im Büro', 'Ish joyi: im Büro', 'काम की जगह: im Büro', 'مكان العمل: im Büro'),
		points: [point(same('im = in dem', [
			'Где: im Büro (in + dem). Дома говорят готовой фразой: zu Hause.',
			'Де: im Büro (in + dem). Удома кажуть готовою фразою: zu Hause.',
			'Where: im Büro (in + dem). At home is a set phrase: zu Hause.',
			'Gdzie: im Büro (in + dem). W domu to gotowy zwrot: zu Hause.',
			'Dónde: im Büro (in + dem). En casa es una frase hecha: zu Hause.',
			'Où : im Büro (in + dem). À la maison se dit zu Hause.',
			'Nerede: im Büro (in + dem). Evde kalıp ifadedir: zu Hause.',
			'Unde: im Büro (in + dem). Acasă e o expresie fixă: zu Hause.',
			"Qayerda: im Büro (in + dem). Uyda tayyor ibora: zu Hause.",
			'कहाँ: im Büro (in + dem)। घर पर एक तय वाक्यांश है: zu Hause।',
			'أين: im Büro (in + dem). وفي البيت عبارة جاهزة: zu Hause.'
		]), [ex('Ich arbeite im Büro.', t11('Я работаю в офисе.', 'Я працюю в офісі.', 'I work in an office.', 'Pracuję w biurze.', 'Trabajo en la oficina.', 'Je travaille au bureau.', 'Ofiste çalışıyorum.', 'Lucrez la birou.', 'Men ofisda ishlayman.', 'मैं दफ़्तर में काम करता हूँ।', 'أعمل في المكتب.'))])]
	},

	'job-three': {
		title: t11('Коллеги', 'Колеги', 'Colleagues', 'Koledzy', 'Compañeros', 'Les collègues', 'İş arkadaşları', 'Colegii', 'Hamkasblar', 'सहकर्मी', 'الزملاء'),
		points: [point(same('der Kollege, die Kollegin', [
			'Женская форма с -in: der Kollege → die Kollegin.',
			'Жіноча форма з -in: der Kollege → die Kollegin.',
			'Female form with -in: der Kollege → die Kollegin.',
			'Forma żeńska z -in: der Kollege → die Kollegin.',
			'Forma femenina con -in: der Kollege → die Kollegin.',
			'Forme féminine en -in : der Kollege → die Kollegin.',
			'Kadın hâli -in ile: der Kollege → die Kollegin.',
			'Forma feminină cu -in: der Kollege → die Kollegin.',
			"Ayol shakli -in bilan: der Kollege → die Kollegin.",
			'स्त्रीलिंग -in से: der Kollege → die Kollegin।',
			'صيغة المؤنث بـ -in: der Kollege → die Kollegin.'
		]), [ex('Das ist mein Kollege.', t11('Это мой коллега.', 'Це мій колега.', 'This is my colleague.', 'To mój kolega z pracy.', 'Este es mi compañero.', 'C’est mon collègue.', 'Bu iş arkadaşım.', 'Acesta e colegul meu.', 'Bu mening hamkasbim.', 'यह मेरा सहकर्मी है।', 'هذا زميلي.'))])]
	},

	'job-four': {
		title: t11('Рабочее время', 'Робочий час', 'Working hours', 'Godziny pracy', 'Horario de trabajo', 'Les horaires', 'Çalışma saatleri', 'Programul de lucru', 'Ish vaqti', 'काम के घंटे', 'ساعات العمل'),
		points: [point(titled(t11('um + время, keine Zeit', 'um + час, keine Zeit', 'um + time, keine Zeit', 'um + godzina, keine Zeit', 'um + hora, keine Zeit', 'um + heure, keine Zeit', 'um + saat, keine Zeit', 'um + oră, keine Zeit', 'um + vaqt, keine Zeit', 'um + समय, keine Zeit', 'um + الوقت، keine Zeit'), [
			'Время начала: um 8 Uhr. Нет времени: Ich habe keine Zeit (die Zeit → keine).',
			'Час початку: um 8 Uhr. Немає часу: Ich habe keine Zeit (die Zeit → keine).',
			'Start time: um 8 Uhr. No time: Ich habe keine Zeit (die Zeit → keine).',
			'Godzina rozpoczęcia: um 8 Uhr. Brak czasu: Ich habe keine Zeit (die Zeit → keine).',
			'Hora de inicio: um 8 Uhr. Sin tiempo: Ich habe keine Zeit (die Zeit → keine).',
			'Heure de début : um 8 Uhr. Pas le temps : Ich habe keine Zeit (die Zeit → keine).',
			'Başlama saati: um 8 Uhr. Vakit yok: Ich habe keine Zeit (die Zeit → keine).',
			'Ora de început: um 8 Uhr. Nu am timp: Ich habe keine Zeit (die Zeit → keine).',
			"Boshlanish vaqti: um 8 Uhr. Vaqt yo'q: Ich habe keine Zeit (die Zeit → keine).",
			'शुरू होने का समय: um 8 Uhr। समय नहीं: Ich habe keine Zeit (die Zeit → keine)।',
			'وقت البدء: um 8 Uhr. ولا وقت: Ich habe keine Zeit (die Zeit → keine).'
		]), [ex('Ich beginne meine Arbeit um 8 Uhr.', t11('Я начинаю работу в восемь.', 'Я починаю роботу о восьмій.', 'I start work at eight.', 'Zaczynam pracę o ósmej.', 'Empiezo a trabajar a las ocho.', 'Je commence le travail à huit heures.', 'İşe saat sekizde başlıyorum.', 'Încep lucrul la opt.', 'Ishni soat sakkizda boshlayman.', 'मैं आठ बजे काम शुरू करता हूँ।', 'أبدأ عملي في الثامنة.'))])]
	},

	'job-five': {
		title: t11('Задачи на работе', 'Завдання на роботі', 'Tasks at work', 'Zadania w pracy', 'Tareas en el trabajo', 'Les tâches', 'İşteki görevler', 'Sarcini la muncă', 'Ishdagi vazifalar', 'काम के कार्य', 'مهام العمل'),
		points: [point(same('Können Sie mir...?', [
			'Вежливая просьба к начальнику: Können Sie mir das zeigen? mir значит «мне».',
			'Ввічливе прохання до керівника: Können Sie mir das zeigen? mir означає «мені».',
			'A polite request to your boss: Können Sie mir das zeigen? mir means "me, to me".',
			'Grzeczna prośba do szefa: Können Sie mir das zeigen? mir znaczy „mi”.',
			'Petición educada al jefe: Können Sie mir das zeigen? mir significa "me".',
			'Demande polie au chef : Können Sie mir das zeigen ? mir veut dire « me, à moi ».',
			'Şefe kibar rica: Können Sie mir das zeigen? mir "bana" demektir.',
			'Rugăminte politicoasă către șef: Können Sie mir das zeigen? mir înseamnă „mie”.',
			"Rahbarga muloyim iltimos: Können Sie mir das zeigen? mir \"menga\" degani.",
			'बॉस से विनम्र अनुरोध: Können Sie mir das zeigen? mir मतलब "मुझे"।',
			'طلب مهذب من المدير: Können Sie mir das zeigen؟ وmir تعني "لي".'
		]), [ex('Können Sie mir das zeigen?', t11('Вы можете мне это показать?', 'Ви можете мені це показати?', 'Can you show me that?', 'Może mi pan to pokazać?', '¿Me lo puede enseñar?', 'Vous pouvez me montrer ?', 'Bunu bana gösterebilir misiniz?', 'Îmi puteți arăta?', "Buni menga ko'rsata olasizmi?", 'क्या आप मुझे यह दिखा सकते हैं?', 'هل يمكنك أن تريني ذلك؟'))])]
	},

	'job-six': {
		title: t11('Инструменты и склад', 'Інструменти і склад', 'Tools and warehouse', 'Narzędzia i magazyn', 'Herramientas y almacén', 'Outils et entrepôt', 'Aletler ve depo', 'Unelte și depozit', 'Asboblar va ombor', 'औज़ार और गोदाम', 'الأدوات والمستودع'),
		points: [point(same('brauchen + Akkusativ', [
			'Новых правил нет. das Werkzeug не меняется: Ich brauche das Werkzeug.',
			'Нових правил немає. das Werkzeug не змінюється: Ich brauche das Werkzeug.',
			'No new rules. das Werkzeug doesn’t change: Ich brauche das Werkzeug.',
			'Bez nowych reguł. das Werkzeug się nie zmienia: Ich brauche das Werkzeug.',
			'Sin reglas nuevas. das Werkzeug no cambia: Ich brauche das Werkzeug.',
			'Pas de nouvelle règle. das Werkzeug ne change pas : Ich brauche das Werkzeug.',
			'Yeni kural yok. das Werkzeug değişmez: Ich brauche das Werkzeug.',
			'Fără reguli noi. das Werkzeug nu se schimbă: Ich brauche das Werkzeug.',
			"Yangi qoida yo'q. das Werkzeug o'zgarmaydi: Ich brauche das Werkzeug.",
			'कोई नया नियम नहीं। das Werkzeug नहीं बदलता: Ich brauche das Werkzeug।',
			'لا قواعد جديدة. das Werkzeug لا تتغير: Ich brauche das Werkzeug.'
		]), [ex('Ich brauche das Werkzeug.', t11('Мне нужен инструмент.', 'Мені потрібен інструмент.', 'I need the tool.', 'Potrzebuję narzędzia.', 'Necesito la herramienta.', 'J’ai besoin de l’outil.', 'Alete ihtiyacım var.', 'Am nevoie de unealtă.', 'Menga asbob kerak.', 'मुझे औज़ार चाहिए।', 'أحتاج الأداة.'))])]
	},

	'job-seven': {
		title: t11('Пунктуальность', 'Пунктуальність', 'Punctuality', 'Punktualność', 'Puntualidad', 'La ponctualité', 'Dakiklik', 'Punctualitatea', 'Vaqtga rioya', 'समय की पाबंदी', 'الالتزام بالمواعيد'),
		points: [point(same('einen Termin', [
			'der Termin после haben становится einen Termin.',
			'der Termin після haben стає einen Termin.',
			'der Termin after haben becomes einen Termin.',
			'der Termin po haben zmienia się w einen Termin.',
			'der Termin después de haben pasa a einen Termin.',
			'der Termin après haben devient einen Termin.',
			'haben’den sonra der Termin einen Termin olur.',
			'der Termin după haben devine einen Termin.',
			"haben dan keyin der Termin einen Termin bo'ladi.",
			'haben के बाद der Termin बनता है einen Termin।',
			'بعد haben تصبح der Termin ‏einen Termin.'
		]), [ex('Ich habe heute einen Termin.', t11('У меня сегодня встреча.', 'У мене сьогодні зустріч.', 'I have an appointment today.', 'Mam dziś spotkanie.', 'Hoy tengo una cita.', 'J’ai un rendez-vous aujourd’hui.', 'Bugün bir randevum var.', 'Azi am o programare.', 'Bugun uchrashuvim bor.', 'आज मेरी एक मीटिंग है।', 'عندي موعد اليوم.'))])]
	},

	'job-eight': {
		title: t11('Погрузка: Wo soll ich...?', 'Навантаження: Wo soll ich...?', 'Loading: Wo soll ich...?', 'Załadunek: Wo soll ich...?', 'Carga: Wo soll ich...?', 'Chargement : Wo soll ich... ?', 'Yükleme: Wo soll ich...?', 'Încărcare: Wo soll ich...?', 'Yuklash: Wo soll ich...?', 'लोडिंग: Wo soll ich...?', 'التحميل: Wo soll ich...؟'),
		points: [point(same('soll ich...?', [
			'Wo soll ich...? значит «куда мне...?», спрашиваем, что от нас хотят. Второй глагол в конце.',
			'Wo soll ich...? означає «куди мені...?», питаємо, чого від нас хочуть. Друге дієслово в кінці.',
			'Wo soll ich...? means "Where should I...?", asking what you’re supposed to do. The second verb goes to the end.',
			'Wo soll ich...? znaczy „gdzie mam...?”, pytamy, czego od nas chcą. Drugi czasownik na końcu.',
			'Wo soll ich...? significa "¿dónde debo...?", preguntando qué se espera de ti. El segundo verbo va al final.',
			'Wo soll ich... ? veut dire « où dois-je... ? », on demande ce qu’on attend de nous. Le deuxième verbe va à la fin.',
			'Wo soll ich...? "Nereye ... yapayım?" demektir, bizden ne istendiğini sorar. İkinci fiil sonda.',
			'Wo soll ich...? înseamnă „unde să...?”, întrebi ce se așteaptă de la tine. Al doilea verb la final.',
			"Wo soll ich...? \"qayerga ... qilay?\" degani, bizdan nima kutilayotganini so'raydi. Ikkinchi fe'l oxirida.",
			'Wo soll ich...? मतलब "मैं कहाँ ... करूँ?", पूछते हैं कि हमसे क्या चाहिए। दूसरी क्रिया अंत में।',
			'Wo soll ich...؟ تعني "أين يجب أن...؟"، نسأل عما يُطلب منا. والفعل الثاني في الآخر.'
		]), [
			ex('Wo soll ich abladen?', t11('Где мне разгружать?', 'Де мені розвантажувати?', 'Where should I unload?', 'Gdzie mam rozładować?', '¿Dónde descargo?', 'Où dois-je décharger ?', 'Nereye boşaltayım?', 'Unde să descarc?', 'Qayerga tushiray?', 'मैं कहाँ उतारूँ?', 'أين يجب أن أفرّغ؟')),
			ex('Vorsicht, das ist zu schwer!', t11('Осторожно, это слишком тяжело!', 'Обережно, це занадто важко!', 'Careful, that’s too heavy!', 'Uwaga, to za ciężkie!', '¡Cuidado, es demasiado pesado!', 'Attention, c’est trop lourd !', 'Dikkat, bu çok ağır!', 'Atenție, e prea greu!', "Ehtiyot bo'ling, bu juda og'ir!", 'सावधान, यह बहुत भारी है!', 'انتبه، هذا ثقيل جداً!'))
		])]
	},

	'job-nine': {
		title: t11('Зарплата и отдых', 'Зарплата й відпочинок', 'Pay and time off', 'Wypłata i odpoczynek', 'Sueldo y descanso', 'Salaire et repos', 'Maaş ve dinlenme', 'Salariul și odihna', 'Maosh va dam olish', 'वेतन और छुट्टी', 'الراتب والراحة'),
		points: [point(same('der Feierabend', [
			'Новых правил нет. der Feierabend значит конец рабочего дня.',
			'Нових правил немає. der Feierabend означає кінець робочого дня.',
			'No new rules. der Feierabend means the end of the working day.',
			'Bez nowych reguł. der Feierabend to koniec dnia pracy.',
			'Sin reglas nuevas. der Feierabend es el final de la jornada.',
			'Pas de nouvelle règle. der Feierabend, c’est la fin de la journée de travail.',
			'Yeni kural yok. der Feierabend iş gününün bitişi demektir.',
			'Fără reguli noi. der Feierabend înseamnă sfârșitul zilei de lucru.',
			"Yangi qoida yo'q. der Feierabend ish kunining oxiri degani.",
			'कोई नया नियम नहीं। der Feierabend मतलब काम के दिन का अंत।',
			'لا قواعد جديدة. der Feierabend تعني نهاية يوم العمل.'
		]), [ex('Endlich Feierabend!', t11("Наконец-то конец рабочего дня!", "Нарешті кінець робочого дня!", "Finally, the end of the working day!", "Nareszcie fajrant!", "¡Por fin termina la jornada!", "Enfin la fin de la journée de travail !", "Sonunda mesai bitti!", "În sfârșit, gata programul!", "Nihoyat ish kuni tugadi!", "आख़िरकार काम का दिन खत्म!", "أخيراً انتهى يوم العمل!"))])]
	},

	'job-ten': {
		title: t11('Инструменты на объекте', 'Інструменти на об’єкті', 'Tools on site', 'Narzędzia na budowie', 'Herramientas en la obra', 'Outils sur le chantier', 'Şantiyede aletler', 'Unelte pe șantier', "Obyektdagi asboblar", 'साइट पर औज़ार', 'الأدوات في الموقع'),
		points: [point(same('einen Hammer', [
			'der Hammer после brauchen становится einen Hammer.',
			'der Hammer після brauchen стає einen Hammer.',
			'der Hammer after brauchen becomes einen Hammer.',
			'der Hammer po brauchen zmienia się w einen Hammer.',
			'der Hammer después de brauchen pasa a einen Hammer.',
			'der Hammer après brauchen devient einen Hammer.',
			'brauchen’dan sonra der Hammer einen Hammer olur.',
			'der Hammer după brauchen devine einen Hammer.',
			"brauchen dan keyin der Hammer einen Hammer bo'ladi.",
			'brauchen के बाद der Hammer बनता है einen Hammer।',
			'بعد brauchen تصبح der Hammer ‏einen Hammer.'
		]), [ex('Ich brauche einen Hammer.', t11('Мне нужен молоток.', 'Мені потрібен молоток.', 'I need a hammer.', 'Potrzebuję młotka.', 'Necesito un martillo.', 'J’ai besoin d’un marteau.', 'Bir çekice ihtiyacım var.', 'Am nevoie de un ciocan.', 'Menga bolg‘a kerak.', 'मुझे एक हथौड़ा चाहिए।', 'أحتاج مطرقة.'))])]
	},

	'job-eleven': {
		title: t11('Просьбы: Mach! Hilf mir!', 'Прохання: Mach! Hilf mir!', 'Requests: Mach! Hilf mir!', 'Prośby: Mach! Hilf mir!', 'Peticiones: Mach! Hilf mir!', 'Demandes : Mach ! Hilf mir !', 'Rica: Mach! Hilf mir!', 'Rugăminți: Mach! Hilf mir!', 'Iltimoslar: Mach! Hilf mir!', 'अनुरोध: Mach! Hilf mir!', 'الطلبات: Mach! Hilf mir!'),
		points: [point(titled(t11('Повелительная форма для du', 'Наказовий спосіб для du', 'Imperative for du', 'Tryb rozkazujący dla du', 'Imperativo para du', 'Impératif pour du', 'du için emir kipi', 'Imperativ pentru du', 'du uchun buyruq mayli', 'du के लिए आज्ञार्थ', 'صيغة الأمر لـ du'), [
			'Просьба к коллеге на du: берём глагол без -st и без du. du machst → Mach! du hilfst → Hilf mir!',
			'Прохання до колеги на du: беремо дієслово без -st і без du. du machst → Mach! du hilfst → Hilf mir!',
			'An order to a colleague (du): take the du form without -st and without du. du machst → Mach! du hilfst → Hilf mir!',
			'Prośba do kolegi na du: bierzemy czasownik bez -st i bez du. du machst → Mach! du hilfst → Hilf mir!',
			'Orden a un compañero (du): verbo sin -st y sin du. du machst → Mach! du hilfst → Hilf mir!',
			'Ordre à un collègue (du) : le verbe sans -st et sans du. du machst → Mach ! du hilfst → Hilf mir !',
			'du ile iş arkadaşına rica: fiili -st ve du olmadan al. du machst → Mach! du hilfst → Hilf mir!',
			'Rugăminte către un coleg (du): verbul fără -st și fără du. du machst → Mach! du hilfst → Hilf mir!',
			"Hamkasbga du bilan iltimos: fe'lni -st va du siz olamiz. du machst → Mach! du hilfst → Hilf mir!",
			'सहकर्मी से du में अनुरोध: क्रिया बिना -st और बिना du। du machst → Mach! du hilfst → Hilf mir!',
			'طلب من زميل بصيغة du: نأخذ الفعل بدون -st وبدون du. du machst → Mach! du hilfst → Hilf mir!'
		].map(s => s)), [
			ex('Mach das schneller!', t11('Делай это быстрее!', 'Роби це швидше!', 'Do it faster!', 'Zrób to szybciej!', '¡Hazlo más rápido!', 'Fais-le plus vite !', 'Bunu daha hızlı yap!', 'Fă asta mai repede!', 'Buni tezroq qil!', 'इसे जल्दी करो!', 'افعل ذلك أسرع!')),
			ex('Hilf mir bitte!', t11("Помоги мне, пожалуйста!", "Допоможи мені, будь ласка!", "Help me, please!", "Pomóż mi, proszę!", "¡Ayúdame, por favor!", "Aide-moi, s’il te plaît !", "Bana yardım et, lütfen!", "Ajută-mă, te rog!", "Iltimos, menga yordam ber!", "कृपया मेरी मदद करो!", "ساعدني من فضلك!"))
		])]
	},

	'job-twelve': {
		title: t11('Размеры и счёт: zehn Stück', 'Розміри й рахунок: zehn Stück', 'Sizes and counting: zehn Stück', 'Rozmiary i liczenie: zehn Stück', 'Medidas y cuentas: zehn Stück', 'Tailles et comptes : zehn Stück', 'Ölçü ve sayma: zehn Stück', 'Mărimi și numărare: zehn Stück', "O'lcham va sanoq: zehn Stück", 'माप और गिनती: zehn Stück', 'المقاسات والعد: zehn Stück'),
		points: [point(titled(t11('Stück и Meter после числа', 'Stück і Meter після числа', 'Stück and Meter after a number', 'Stück i Meter po liczbie', 'Stück y Meter tras un número', 'Stück et Meter après un nombre', 'Sayıdan sonra Stück ve Meter', 'Stück și Meter după un număr', 'Sondan keyin Stück va Meter', 'संख्या के बाद Stück और Meter', 'Stück وMeter بعد العدد'), [
			'После числа Stück и Meter не меняются: zehn Stück, drei Meter.',
			'Після числа Stück і Meter не змінюються: zehn Stück, drei Meter.',
			'After a number, Stück and Meter don’t change: zehn Stück, drei Meter.',
			'Po liczbie Stück i Meter się nie zmieniają: zehn Stück, drei Meter.',
			'Después de un número, Stück y Meter no cambian: zehn Stück, drei Meter.',
			'Après un nombre, Stück et Meter ne changent pas : zehn Stück, drei Meter.',
			'Sayıdan sonra Stück ve Meter değişmez: zehn Stück, drei Meter.',
			'După un număr, Stück și Meter nu se schimbă: zehn Stück, drei Meter.',
			"Sondan keyin Stück va Meter o'zgarmaydi: zehn Stück, drei Meter.",
			'संख्या के बाद Stück और Meter नहीं बदलते: zehn Stück, drei Meter।',
			'بعد العدد لا تتغير Stück وMeter: zehn Stück، drei Meter.'
		]), [ex('Ich brauche zehn Stück.', t11('Мне нужно десять штук.', 'Мені потрібно десять штук.', 'I need ten pieces.', 'Potrzebuję dziesięciu sztuk.', 'Necesito diez piezas.', 'J’ai besoin de dix pièces.', 'On tane lazım.', 'Am nevoie de zece bucăți.', "Menga o'nta dona kerak.", 'मुझे दस पीस चाहिए।', 'أحتاج عشر قطع.'))])]
	},

	'job-thirteen': {
		title: t11('Зарплата и договор', 'Зарплата і договір', 'Salary and contract', 'Pensja i umowa', 'Sueldo y contrato', 'Salaire et contrat', 'Maaş ve sözleşme', 'Salariu și contract', 'Maosh va shartnoma', 'वेतन और अनुबंध', 'الراتب والعقد'),
		points: [point(same('bekommen', [
			'bekommen значит «получать», а не «становиться», хотя звучит похоже на английское become.',
			'bekommen означає «отримувати», а не «ставати», хоч звучить схоже на англійське become.',
			'bekommen means "to get, receive", not "to become".',
			'bekommen znaczy „otrzymywać”, a nie „stawać się”, choć brzmi jak angielskie become.',
			'bekommen significa "recibir", no "convertirse", aunque suene como el inglés become.',
			'bekommen veut dire « recevoir », pas « devenir », même si ça ressemble à l’anglais become.',
			'bekommen "almak" demektir, İngilizce become’a benzese de "olmak" değildir.',
			'bekommen înseamnă „a primi”, nu „a deveni”, deși seamănă cu englezescul become.',
			"bekommen \"olmoq, qabul qilmoq\" degani, inglizcha become ga o'xshasa ham \"bo'lmoq\" emas.",
			'bekommen का मतलब "पाना" है, "बनना" नहीं, भले ही यह अंग्रेज़ी become जैसा लगे।',
			'bekommen تعني "يحصل على"، وليس "يصبح"، رغم شبهها بالإنجليزية become.'
		]), [ex('Ich bekomme Gehalt.', t11('Я получаю зарплату.', 'Я отримую зарплату.', 'I get a salary.', 'Dostaję pensję.', 'Recibo un sueldo.', 'Je reçois un salaire.', 'Maaş alıyorum.', 'Primesc salariu.', 'Men maosh olaman.', 'मुझे वेतन मिलता है।', 'أحصل على راتب.'))])]
	},

	'job-fourteen': {
		title: t11('Больничный', 'Лікарняний', 'Sick leave', 'Zwolnienie lekarskie', 'Baja por enfermedad', 'L’arrêt maladie', 'Hastalık izni', 'Concediul medical', 'Kasallik varaqasi', 'बीमारी की छुट्टी', 'الإجازة المرضية'),
		points: [point(same('sich krankmelden', [
			'Сообщить на работу, что болеешь: Ich melde mich krank. Слово krank уходит в конец, как приставка.',
			'Повідомити на роботу, що хворієш: Ich melde mich krank. Слово krank іде в кінець, як префікс.',
			'To call in sick: Ich melde mich krank.',
			'Zgłosić w pracy chorobę: Ich melde mich krank.',
			'Avisar de que estás enfermo: Ich melde mich krank.',
			'Se déclarer malade : Ich melde mich krank.',
			'İşe hasta olduğunu bildirmek: Ich melde mich krank.',
			'Să anunți că ești bolnav: Ich melde mich krank.',
			"Ishga kasal ekaningni bildirish: Ich melde mich krank.",
			'काम पर बीमार होने की सूचना देना: Ich melde mich krank।',
			'للإبلاغ عن المرض في العمل: Ich melde mich krank.'
		]), [ex('Ich melde mich heute krank.', t11("Сегодня я сообщаю на работу, что заболел.", "Сьогодні я повідомляю на роботу, що захворів.", "I’m calling in sick today.", "Dziś zgłaszam, że jestem chory.", "Hoy aviso de que estoy enfermo.", "Aujourd’hui, je me déclare malade.", "Bugün hastalık bildiriyorum.", "Azi anunț că sunt bolnav.", "Bugun ishga kasal ekanimni bildiraman.", "आज मैं बीमारी की छुट्टी की सूचना दे रहा हूँ।", "اليوم أبلغ العمل بأنني مريض."))])]
	}
}

module.exports = quests
