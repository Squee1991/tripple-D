// Грамматика к заданиям земли clock-tower (Часовая башня: дни, время, am/um/im)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'clock-tower-one': {
		title: {
			ru: 'Дни недели', uk: 'Дні тижня', en: 'Days of the week',
			pl: 'Dni tygodnia', es: 'Los días de la semana', fr: 'Les jours de la semaine',
			tr: 'Haftanın günleri', ro: 'Zilele săptămânii', uz: 'Hafta kunlari',
			hi: 'सप्ताह के दिन', ar: 'أيام الأسبوع'
		},
		points: [
			{
				t: {
					ru: ['Все мужского рода', 'Дни недели все с der и с большой буквы. Почти все кончаются на -tag.'],
					uk: ['Усі чоловічого роду', 'Дні тижня всі з der і з великої літери. Майже всі закінчуються на -tag.'],
					en: ['All masculine', 'All days take der and start with a capital letter. Almost all end in -tag.'],
					pl: ['Wszystkie rodzaju męskiego', 'Wszystkie dni mają der i są pisane wielką literą. Prawie wszystkie kończą się na -tag.'],
					es: ['Todos masculinos', 'Todos los días llevan der y van con mayúscula. Casi todos terminan en -tag.'],
					fr: ['Tous masculins', 'Tous les jours prennent der et une majuscule. Presque tous finissent par -tag.'],
					tr: ['Hepsi eril', 'Bütün günler der alır ve büyük harfle yazılır. Neredeyse hepsi -tag ile biter.'],
					ro: ['Toate masculine', 'Toate zilele au der și se scriu cu majusculă. Aproape toate se termină în -tag.'],
					uz: ['Hammasi erkak rodida', "Barcha kunlar der bilan va bosh harf bilan yoziladi. Deyarli hammasi -tag bilan tugaydi."],
					hi: ['सभी पुल्लिंग', 'सभी दिन der के साथ और बड़े अक्षर से। लगभग सभी -tag पर खत्म होते हैं।'],
					ar: ['كلها مذكرة', 'كل الأيام تأخذ der وتُكتب بحرف كبير. ومعظمها ينتهي بـ -tag.']
				},
				examples: [
					ex('Montag, Dienstag, Mittwoch, Donnerstag', { ru: 'понедельник, вторник, среда, четверг', uk: 'понеділок, вівторок, середа, четвер', en: 'Monday, Tuesday, Wednesday, Thursday', pl: 'poniedziałek, wtorek, środa, czwartek', es: 'lunes, martes, miércoles, jueves', fr: 'lundi, mardi, mercredi, jeudi', tr: 'pazartesi, salı, çarşamba, perşembe', ro: 'luni, marți, miercuri, joi', uz: 'dushanba, seshanba, chorshanba, payshanba', hi: 'सोमवार, मंगलवार, बुधवार, गुरुवार', ar: 'الاثنين، الثلاثاء، الأربعاء، الخميس' }),
					ex('Freitag, Samstag, Sonntag', { ru: 'пятница, суббота, воскресенье', uk: 'пʼятниця, субота, неділя', en: 'Friday, Saturday, Sunday', pl: 'piątek, sobota, niedziela', es: 'viernes, sábado, domingo', fr: 'vendredi, samedi, dimanche', tr: 'cuma, cumartesi, pazar', ro: 'vineri, sâmbătă, duminică', uz: 'juma, shanba, yakshanba', hi: 'शुक्रवार, शनिवार, रविवार', ar: 'الجمعة، السبت، الأحد' }),
					ex('Heute ist Freitag.', { ru: 'Сегодня пятница.', uk: 'Сьогодні пʼятниця.', en: 'Today is Friday.', pl: 'Dziś jest piątek.', es: 'Hoy es viernes.', fr: 'Aujourd’hui, c’est vendredi.', tr: 'Bugün cuma.', ro: 'Azi e vineri.', uz: 'Bugun juma.', hi: 'आज शुक्रवार है।', ar: 'اليوم الجمعة.' })
				]
			}
		]
	},

	'clock-tower-two': {
		title: {
			ru: 'Когда? am Montag', uk: 'Коли? am Montag', en: 'When? am Montag',
			pl: 'Kiedy? am Montag', es: '¿Cuándo? am Montag', fr: 'Quand ? am Montag',
			tr: 'Ne zaman? am Montag', ro: 'Când? am Montag', uz: 'Qachon? am Montag',
			hi: 'कब? am Montag', ar: 'متى؟ am Montag'
		},
		points: [
			{
				t: {
					ru: ['am + день', 'Чтобы сказать «в какой день», ставим am: am Montag, am Wochenende. Вопрос: Wann? (когда?)'],
					uk: ['am + день', 'Щоб сказати «у який день», ставимо am: am Montag, am Wochenende. Питання: Wann? (коли?)'],
					en: ['am + day', 'To say "on" a day, use am: am Montag, am Wochenende. The question is Wann? (when?)'],
					pl: ['am + dzień', 'Żeby powiedzieć „w który dzień”, mówimy am: am Montag, am Wochenende. Pytanie: Wann? (kiedy?)'],
					es: ['am + día', 'Para decir "el lunes", se usa am: am Montag, am Wochenende. La pregunta es Wann? (¿cuándo?)'],
					fr: ['am + jour', 'Pour dire « lundi », on met am : am Montag, am Wochenende. La question : Wann ? (quand ?)'],
					tr: ['am + gün', '"Pazartesi günü" demek için am: am Montag, am Wochenende. Soru: Wann? (ne zaman?)'],
					ro: ['am + zi', 'Ca să spui „luni”, pui am: am Montag, am Wochenende. Întrebarea: Wann? (când?)'],
					uz: ['am + kun', "\"Dushanba kuni\" deyish uchun am: am Montag, am Wochenende. Savol: Wann? (qachon?)"],
					hi: ['am + दिन', '"सोमवार को" कहने के लिए am: am Montag, am Wochenende। सवाल: Wann? (कब?)'],
					ar: ['am + يوم', 'لنقول "يوم الاثنين" نستعمل am: am Montag، am Wochenende. والسؤال: Wann؟ (متى؟)']
				},
				examples: [
					ex('Wann hast du Zeit? Am Samstag.', { ru: 'Когда у тебя есть время? В субботу.', uk: 'Коли в тебе є час? У суботу.', en: 'When do you have time? On Saturday.', pl: 'Kiedy masz czas? W sobotę.', es: '¿Cuándo tienes tiempo? El sábado.', fr: 'Quand as-tu le temps ? Samedi.', tr: 'Ne zaman vaktin var? Cumartesi.', ro: 'Când ai timp? Sâmbătă.', uz: 'Qachon vaqting bor? Shanba kuni.', hi: 'तुम्हारे पास कब समय है? शनिवार को।', ar: 'متى عندك وقت؟ يوم السبت.' })
				]
			},
			{
				t: {
					ru: ['Время первым, глагол вторым', 'Если время стоит в начале, глагол идёт сразу за ним, а потом ich.'],
					uk: ['Час першим, дієслово другим', 'Якщо час стоїть на початку, дієслово йде одразу за ним, а потім ich.'],
					en: ['Time first, verb second', 'If the time comes first, the verb comes right after it, then ich.'],
					pl: ['Czas pierwszy, czasownik drugi', 'Jeśli czas jest na początku, czasownik idzie zaraz po nim, a potem ich.'],
					es: ['Tiempo primero, verbo segundo', 'Si el tiempo va al principio, el verbo va justo después y luego ich.'],
					fr: ['Le temps d’abord, le verbe ensuite', 'Si le temps est en premier, le verbe vient juste après, puis ich.'],
					tr: ['Önce zaman, sonra fiil', 'Zaman başta olursa fiil hemen ardından, sonra ich gelir.'],
					ro: ['Timpul primul, verbul al doilea', 'Dacă timpul e la început, verbul vine imediat după el, apoi ich.'],
					uz: ["Avval vaqt, keyin fe'l", "Vaqt boshida tursa, fe'l darhol undan keyin, so'ng ich keladi."],
					hi: ['पहले समय, फिर क्रिया', 'अगर समय शुरुआत में हो, तो क्रिया तुरंत उसके बाद, फिर ich।'],
					ar: ['الزمن أولاً والفعل ثانياً', 'إذا جاء الزمن في البداية يأتي الفعل بعده مباشرة ثم ich.']
				},
				examples: [
					ex('Am Montag arbeite ich.', { ru: 'В понедельник я работаю.', uk: 'У понеділок я працюю.', en: 'On Monday I work.', pl: 'W poniedziałek pracuję.', es: 'El lunes trabajo.', fr: 'Lundi, je travaille.', tr: 'Pazartesi çalışıyorum.', ro: 'Luni lucrez.', uz: 'Dushanba kuni ishlayman.', hi: 'सोमवार को मैं काम करता हूँ।', ar: 'يوم الاثنين أعمل.' })
				]
			}
		]
	},

	'clock-tower-three': {
		title: {
			ru: 'Утро, день, вечер', uk: 'Ранок, день, вечір', en: 'Morning, afternoon, evening',
			pl: 'Rano, popołudnie, wieczór', es: 'Mañana, tarde, noche', fr: 'Matin, après-midi, soir',
			tr: 'Sabah, öğleden sonra, akşam', ro: 'Dimineața, după-amiaza, seara', uz: 'Ertalab, tushdan keyin, kechqurun',
			hi: 'सुबह, दोपहर, शाम', ar: 'الصباح والظهيرة والمساء'
		},
		points: [
			{
				t: {
					ru: ['am, но in der Nacht', 'Части суток с am: am Morgen, am Nachmittag, am Abend. Только ночь иначе: in der Nacht.'],
					uk: ['am, але in der Nacht', 'Частини доби з am: am Morgen, am Nachmittag, am Abend. Лише ніч інакше: in der Nacht.'],
					en: ['am, but in der Nacht', 'Parts of the day take am: am Morgen, am Nachmittag, am Abend. Only night is different: in der Nacht.'],
					pl: ['am, ale in der Nacht', 'Pory dnia z am: am Morgen, am Nachmittag, am Abend. Tylko noc inaczej: in der Nacht.'],
					es: ['am, pero in der Nacht', 'Las partes del día van con am: am Morgen, am Nachmittag, am Abend. Solo la noche es distinta: in der Nacht.'],
					fr: ['am, mais in der Nacht', 'Les moments de la journée prennent am : am Morgen, am Nachmittag, am Abend. Seule la nuit change : in der Nacht.'],
					tr: ['am, ama in der Nacht', 'Günün bölümleri am alır: am Morgen, am Nachmittag, am Abend. Sadece gece farklı: in der Nacht.'],
					ro: ['am, dar in der Nacht', 'Părțile zilei cu am: am Morgen, am Nachmittag, am Abend. Doar noaptea altfel: in der Nacht.'],
					uz: ['am, lekin in der Nacht', "Kun qismlari am bilan: am Morgen, am Nachmittag, am Abend. Faqat tun boshqacha: in der Nacht."],
					hi: ['am, लेकिन in der Nacht', 'दिन के हिस्से am के साथ: am Morgen, am Nachmittag, am Abend। सिर्फ़ रात अलग: in der Nacht।'],
					ar: ['am لكن in der Nacht', 'أجزاء اليوم مع am: am Morgen، am Nachmittag، am Abend. والليل فقط مختلف: in der Nacht.']
				},
				examples: [
					ex('Am Nachmittag habe ich Zeit.', { ru: 'После обеда у меня есть время.', uk: 'Після обіду в мене є час.', en: 'In the afternoon I have time.', pl: 'Po południu mam czas.', es: 'Por la tarde tengo tiempo.', fr: 'L’après-midi, j’ai le temps.', tr: 'Öğleden sonra vaktim var.', ro: 'După-amiaza am timp.', uz: 'Tushdan keyin vaqtim bor.', hi: 'दोपहर में मेरे पास समय है।', ar: 'بعد الظهر عندي وقت.' }),
					ex('In der Nacht schläft das Kind.', { ru: 'Ночью ребёнок спит.', uk: 'Уночі дитина спить.', en: 'At night the child sleeps.', pl: 'W nocy dziecko śpi.', es: 'Por la noche el niño duerme.', fr: 'La nuit, l’enfant dort.', tr: 'Gece çocuk uyur.', ro: 'Noaptea copilul doarme.', uz: 'Tunda bola uxlaydi.', hi: 'रात में बच्चा सोता है।', ar: 'في الليل ينام الطفل.' })
				]
			},
			{
				t: {
					ru: ['morgens: каждое утро', 'Если что-то бывает регулярно, говорим morgens, abends, nachts с маленькой буквы.'],
					uk: ['morgens: щоранку', 'Якщо щось буває регулярно, кажемо morgens, abends, nachts з малої літери.'],
					en: ['morgens: every morning', 'For something regular, say morgens, abends, nachts in lowercase.'],
					pl: ['morgens: co rano', 'Gdy coś dzieje się regularnie, mówimy morgens, abends, nachts małą literą.'],
					es: ['morgens: cada mañana', 'Para algo habitual se dice morgens, abends, nachts en minúscula.'],
					fr: ['morgens : tous les matins', 'Pour quelque chose de régulier, on dit morgens, abends, nachts en minuscule.'],
					tr: ['morgens: her sabah', 'Düzenli olan şeyler için küçük harfle morgens, abends, nachts denir.'],
					ro: ['morgens: în fiecare dimineață', 'Pentru ceva regulat spunem morgens, abends, nachts cu literă mică.'],
					uz: ['morgens: har kuni ertalab', "Muntazam bo'ladigan narsa uchun kichik harf bilan morgens, abends, nachts deyiladi."],
					hi: ['morgens: हर सुबह', 'नियमित काम के लिए छोटे अक्षर से morgens, abends, nachts कहते हैं।'],
					ar: ['morgens: كل صباح', 'للأمر المتكرر نقول morgens وabends وnachts بحرف صغير.']
				},
				examples: [
					ex('Morgens trinke ich Kaffee.', { ru: 'По утрам я пью кофе.', uk: 'Зранку я п’ю каву.', en: 'In the mornings I drink coffee.', pl: 'Rano piję kawę.', es: 'Por las mañanas tomo café.', fr: 'Le matin, je bois du café.', tr: 'Sabahları kahve içerim.', ro: 'Dimineața beau cafea.', uz: 'Ertalablari qahva ichaman.', hi: 'सुबह मैं कॉफ़ी पीता हूँ।', ar: 'في الصباح أشرب القهوة.' })
				]
			}
		]
	},

	'clock-tower-four': {
		title: {
			ru: 'Который час?', uk: 'Котра година?', en: 'What time is it?',
			pl: 'Która godzina?', es: '¿Qué hora es?', fr: 'Quelle heure est-il ?',
			tr: 'Saat kaç?', ro: 'Cât e ceasul?', uz: 'Soat necha?',
			hi: 'कितने बजे हैं?', ar: 'كم الساعة؟'
		},
		points: [
			{
				t: {
					ru: ['Es ist ... Uhr', 'Спросить: Wie spät ist es? Ответ: Es ist acht Uhr. Uhr после числа не меняется.'],
					uk: ['Es ist ... Uhr', 'Запитати: Wie spät ist es? Відповідь: Es ist acht Uhr. Uhr після числа не змінюється.'],
					en: ['Es ist ... Uhr', 'Ask: Wie spät ist es? Answer: Es ist acht Uhr. Uhr doesn’t change after the number.'],
					pl: ['Es ist ... Uhr', 'Zapytać: Wie spät ist es? Odpowiedź: Es ist acht Uhr. Uhr po liczbie się nie zmienia.'],
					es: ['Es ist ... Uhr', 'Preguntar: Wie spät ist es? Respuesta: Es ist acht Uhr. Uhr no cambia después del número.'],
					fr: ['Es ist ... Uhr', 'Demander : Wie spät ist es ? Réponse : Es ist acht Uhr. Uhr ne change pas après le nombre.'],
					tr: ['Es ist ... Uhr', 'Sormak: Wie spät ist es? Cevap: Es ist acht Uhr. Sayıdan sonra Uhr değişmez.'],
					ro: ['Es ist ... Uhr', 'Întrebi: Wie spät ist es? Răspuns: Es ist acht Uhr. Uhr nu se schimbă după număr.'],
					uz: ['Es ist ... Uhr', "So'rash: Wie spät ist es? Javob: Es ist acht Uhr. Sondan keyin Uhr o'zgarmaydi."],
					hi: ['Es ist ... Uhr', 'पूछना: Wie spät ist es? जवाब: Es ist acht Uhr। संख्या के बाद Uhr नहीं बदलता।'],
					ar: ['Es ist ... Uhr', 'السؤال: Wie spät ist es؟ والجواب: Es ist acht Uhr. ولا تتغير Uhr بعد العدد.']
				},
				examples: [
					ex('Wie spät ist es? Es ist acht Uhr.', { ru: 'Который час? Восемь часов.', uk: 'Котра година? Восьма.', en: 'What time is it? It’s eight o’clock.', pl: 'Która godzina? Ósma.', es: '¿Qué hora es? Son las ocho.', fr: 'Quelle heure est-il ? Il est huit heures.', tr: 'Saat kaç? Saat sekiz.', ro: 'Cât e ceasul? E ora opt.', uz: 'Soat necha? Soat sakkiz.', hi: 'कितने बजे हैं? आठ बजे हैं।', ar: 'كم الساعة؟ الساعة الثامنة.' }),
					ex('Es ist ein Uhr.', { ru: 'Сейчас час.', uk: 'Перша година.', en: 'It’s one o’clock.', pl: 'Jest pierwsza.', es: 'Es la una.', fr: 'Il est une heure.', tr: 'Saat bir.', ro: 'E ora unu.', uz: 'Soat bir.', hi: 'एक बजा है।', ar: 'الساعة الواحدة.' })
				]
			}
		]
	},

	'clock-tower-five': {
		title: {
			ru: 'Во сколько? um acht Uhr', uk: 'О котрій? um acht Uhr', en: 'At what time? um acht Uhr',
			pl: 'O której? um acht Uhr', es: '¿A qué hora? um acht Uhr', fr: 'À quelle heure ? um acht Uhr',
			tr: 'Saat kaçta? um acht Uhr', ro: 'La ce oră? um acht Uhr', uz: 'Soat nechada? um acht Uhr',
			hi: 'कितने बजे? um acht Uhr', ar: 'في أي ساعة؟ um acht Uhr'
		},
		points: [
			{
				t: {
					ru: ['um + время', 'Вопрос: Um wie viel Uhr? Ответ с um: um acht Uhr (в восемь).'],
					uk: ['um + час', 'Питання: Um wie viel Uhr? Відповідь з um: um acht Uhr (о восьмій).'],
					en: ['um + time', 'Question: Um wie viel Uhr? Answer with um: um acht Uhr (at eight).'],
					pl: ['um + godzina', 'Pytanie: Um wie viel Uhr? Odpowiedź z um: um acht Uhr (o ósmej).'],
					es: ['um + hora', 'Pregunta: Um wie viel Uhr? Respuesta con um: um acht Uhr (a las ocho).'],
					fr: ['um + heure', 'Question : Um wie viel Uhr ? Réponse avec um : um acht Uhr (à huit heures).'],
					tr: ['um + saat', 'Soru: Um wie viel Uhr? Cevap um ile: um acht Uhr (saat sekizde).'],
					ro: ['um + oră', 'Întrebare: Um wie viel Uhr? Răspuns cu um: um acht Uhr (la opt).'],
					uz: ['um + vaqt', "Savol: Um wie viel Uhr? Javob um bilan: um acht Uhr (soat sakkizda)."],
					hi: ['um + समय', 'सवाल: Um wie viel Uhr? जवाब um के साथ: um acht Uhr (आठ बजे)।'],
					ar: ['um + الساعة', 'السؤال: Um wie viel Uhr؟ والجواب مع um: um acht Uhr (في الثامنة).']
				},
				examples: [
					ex('Der Kurs beginnt um neun Uhr.', { ru: 'Курс начинается в девять.', uk: 'Курс починається о дев’ятій.', en: 'The course starts at nine.', pl: 'Kurs zaczyna się o dziewiątej.', es: 'El curso empieza a las nueve.', fr: 'Le cours commence à neuf heures.', tr: 'Kurs saat dokuzda başlıyor.', ro: 'Cursul începe la nouă.', uz: "Kurs soat to'qqizda boshlanadi.", hi: 'कोर्स नौ बजे शुरू होता है।', ar: 'تبدأ الدورة في التاسعة.' })
				]
			},
			{
				t: {
					ru: ['Es ist или um?', 'Es ist acht Uhr значит «сейчас восемь». Um acht Uhr значит «в восемь». День и время вместе: am Montag um zehn Uhr.'],
					uk: ['Es ist чи um?', 'Es ist acht Uhr означає «зараз восьма». Um acht Uhr означає «о восьмій». День і час разом: am Montag um zehn Uhr.'],
					en: ['Es ist or um?', 'Es ist acht Uhr means "it’s eight now". Um acht Uhr means "at eight". Day and time together: am Montag um zehn Uhr.'],
					pl: ['Es ist czy um?', 'Es ist acht Uhr znaczy „jest ósma”. Um acht Uhr znaczy „o ósmej”. Dzień i godzina razem: am Montag um zehn Uhr.'],
					es: ['¿Es ist o um?', 'Es ist acht Uhr significa "son las ocho". Um acht Uhr significa "a las ocho". Día y hora juntos: am Montag um zehn Uhr.'],
					fr: ['Es ist ou um ?', 'Es ist acht Uhr veut dire « il est huit heures ». Um acht Uhr veut dire « à huit heures ». Jour et heure ensemble : am Montag um zehn Uhr.'],
					tr: ['Es ist mi, um mu?', 'Es ist acht Uhr "saat sekiz" demektir. Um acht Uhr "saat sekizde" demektir. Gün ve saat birlikte: am Montag um zehn Uhr.'],
					ro: ['Es ist sau um?', 'Es ist acht Uhr înseamnă „e ora opt”. Um acht Uhr înseamnă „la opt”. Zi și oră împreună: am Montag um zehn Uhr.'],
					uz: ['Es ist yoki um?', "Es ist acht Uhr \"hozir soat sakkiz\" degani. Um acht Uhr \"soat sakkizda\" degani. Kun va vaqt birga: am Montag um zehn Uhr."],
					hi: ['Es ist या um?', 'Es ist acht Uhr मतलब "अभी आठ बजे हैं"। Um acht Uhr मतलब "आठ बजे (किसी काम का समय)"। दिन और समय साथ: am Montag um zehn Uhr।'],
					ar: ['Es ist أم um؟', 'Es ist acht Uhr تعني "الساعة الآن الثامنة". وUm acht Uhr تعني "في الثامنة". واليوم مع الساعة: am Montag um zehn Uhr.']
				},
				examples: [
					ex('Ich habe am Montag um zehn Uhr einen Termin.', { ru: 'У меня приём в понедельник в десять.', uk: 'У мене прийом у понеділок о десятій.', en: 'I have an appointment on Monday at ten.', pl: 'Mam wizytę w poniedziałek o dziesiątej.', es: 'Tengo una cita el lunes a las diez.', fr: 'J’ai un rendez-vous lundi à dix heures.', tr: 'Pazartesi saat onda randevum var.', ro: 'Am o programare luni la zece.', uz: "Dushanba kuni soat o'nda uchrashuvim bor.", hi: 'सोमवार को दस बजे मेरी अपॉइंटमेंट है।', ar: 'عندي موعد يوم الاثنين في العاشرة.' })
				]
			}
		]
	},

	'clock-tower-six': {
		title: {
			ru: 'Месяцы и времена года: im', uk: 'Місяці та пори року: im', en: 'Months and seasons: im',
			pl: 'Miesiące i pory roku: im', es: 'Meses y estaciones: im', fr: 'Mois et saisons : im',
			tr: 'Aylar ve mevsimler: im', ro: 'Lunile și anotimpurile: im', uz: 'Oylar va fasllar: im',
			hi: 'महीने और मौसम: im', ar: 'الشهور والفصول: im'
		},
		points: [
			{
				t: {
					ru: ['im + месяц или время года', 'Для месяцев и времён года говорим im: im Mai, im Sommer, im Winter.'],
					uk: ['im + місяць чи пора року', 'Для місяців і пір року кажемо im: im Mai, im Sommer, im Winter.'],
					en: ['im + month or season', 'For months and seasons use im: im Mai, im Sommer, im Winter.'],
					pl: ['im + miesiąc albo pora roku', 'Przy miesiącach i porach roku mówimy im: im Mai, im Sommer, im Winter.'],
					es: ['im + mes o estación', 'Con meses y estaciones se usa im: im Mai, im Sommer, im Winter.'],
					fr: ['im + mois ou saison', 'Pour les mois et les saisons, on dit im : im Mai, im Sommer, im Winter.'],
					tr: ['im + ay ya da mevsim', 'Aylar ve mevsimler için im: im Mai, im Sommer, im Winter.'],
					ro: ['im + lună sau anotimp', 'Pentru luni și anotimpuri spunem im: im Mai, im Sommer, im Winter.'],
					uz: ['im + oy yoki fasl', "Oylar va fasllar uchun im: im Mai, im Sommer, im Winter."],
					hi: ['im + महीना या मौसम', 'महीनों और मौसमों के लिए im: im Mai, im Sommer, im Winter।'],
					ar: ['im + شهر أو فصل', 'مع الشهور والفصول نقول im: im Mai، im Sommer، im Winter.']
				},
				examples: [
					ex('Mein Geburtstag ist im Juli.', { ru: 'Мой день рождения в июле.', uk: 'Мій день народження в липні.', en: 'My birthday is in July.', pl: 'Moje urodziny są w lipcu.', es: 'Mi cumpleaños es en julio.', fr: 'Mon anniversaire est en juillet.', tr: 'Doğum günüm temmuzda.', ro: 'Ziua mea e în iulie.', uz: "Mening tug'ilgan kunim iyulda.", hi: 'मेरा जन्मदिन जुलाई में है।', ar: 'عيد ميلادي في يوليو.' }),
					ex('Im Winter ist es kalt.', { ru: 'Зимой холодно.', uk: 'Взимку холодно.', en: 'In winter it’s cold.', pl: 'Zimą jest zimno.', es: 'En invierno hace frío.', fr: 'En hiver, il fait froid.', tr: 'Kışın hava soğuk.', ro: 'Iarna e frig.', uz: 'Qishda sovuq.', hi: 'सर्दियों में ठंड होती है।', ar: 'في الشتاء يكون الجو بارداً.' })
				]
			},
			{
				t: {
					ru: ['Короткая шпаргалка', 'am + день, um + время, im + месяц.'],
					uk: ['Коротка шпаргалка', 'am + день, um + час, im + місяць.'],
					en: ['Quick cheat sheet', 'am + day, um + time, im + month.'],
					pl: ['Krótka ściąga', 'am + dzień, um + godzina, im + miesiąc.'],
					es: ['Chuleta rápida', 'am + día, um + hora, im + mes.'],
					fr: ['Petit aide-mémoire', 'am + jour, um + heure, im + mois.'],
					tr: ['Kısa not', 'am + gün, um + saat, im + ay.'],
					ro: ['Fițuică scurtă', 'am + zi, um + oră, im + lună.'],
					uz: ['Qisqa eslatma', 'am + kun, um + vaqt, im + oy.'],
					hi: ['छोटा नोट', 'am + दिन, um + समय, im + महीना।'],
					ar: ['ملخص سريع', 'am + يوم، um + ساعة، im + شهر.']
				},
				examples: [
					ex('am Freitag, um neun Uhr, im Juni', { ru: 'в пятницу, в девять, в июне', uk: 'у пʼятницю, о девʼятій, у червні', en: 'on Friday, at nine, in June', pl: 'w piątek, o dziewiątej, w czerwcu', es: 'el viernes, a las nueve, en junio', fr: 'vendredi, à neuf heures, en juin', tr: 'cuma günü, saat dokuzda, haziranda', ro: 'vineri, la nouă, în iunie', uz: "juma kuni, soat to'qqizda, iyunda", hi: 'शुक्रवार को, नौ बजे, जून में', ar: 'يوم الجمعة، في التاسعة، في يونيو' })
				]
			}
		]
	},

	'clock-tower-seven': {
		title: {
			ru: 'Практика: моя неделя', uk: 'Практика: мій тиждень', en: 'Practice: my week',
			pl: 'Praktyka: mój tydzień', es: 'Práctica: mi semana', fr: 'Pratique : ma semaine',
			tr: 'Pratik: haftam', ro: 'Practică: săptămâna mea', uz: 'Mashq: mening haftam',
			hi: 'अभ्यास: मेरा सप्ताह', ar: 'تدريب: أسبوعي'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Каждую неделю: mittwochs (по средам), как morgens. Время в начале, глагол вторым.'],
					uk: ['Нових правил немає', 'Щотижня: mittwochs (щосереди), як morgens. Час на початку, дієслово другим.'],
					en: ['No new rules', 'Every week: mittwochs (on Wednesdays), like morgens. Time first, verb second.'],
					pl: ['Bez nowych reguł', 'Co tydzień: mittwochs (w środy), jak morgens. Czas na początku, czasownik drugi.'],
					es: ['Sin reglas nuevas', 'Cada semana: mittwochs (los miércoles), como morgens. Tiempo primero, verbo segundo.'],
					fr: ['Pas de nouvelle règle', 'Chaque semaine : mittwochs (le mercredi), comme morgens. Le temps d’abord, le verbe en deuxième.'],
					tr: ['Yeni kural yok', 'Her hafta: mittwochs (çarşambaları), morgens gibi. Önce zaman, fiil ikinci.'],
					ro: ['Fără reguli noi', 'În fiecare săptămână: mittwochs (miercurea), ca morgens. Timpul primul, verbul al doilea.'],
					uz: ["Yangi qoida yo'q", "Har hafta: mittwochs (chorshanba kunlari), morgens kabi. Vaqt boshida, fe'l ikkinchi."],
					hi: ['कोई नया नियम नहीं', 'हर हफ़्ते: mittwochs (बुधवार को), morgens की तरह। पहले समय, फिर क्रिया।'],
					ar: ['لا قواعد جديدة', 'كل أسبوع: mittwochs (أيام الأربعاء)، مثل morgens. الزمن أولاً والفعل ثانياً.']
				},
				examples: [
					ex('Mittwochs schwimme ich.', { ru: 'По средам я плаваю.', uk: 'Щосереди я плаваю.', en: 'On Wednesdays I swim.', pl: 'W środy pływam.', es: 'Los miércoles nado.', fr: 'Le mercredi, je nage.', tr: 'Çarşambaları yüzerim.', ro: 'Miercurea înot.', uz: 'Chorshanba kunlari suzaman.', hi: 'बुधवार को मैं तैरता हूँ।', ar: 'أيام الأربعاء أسبح.' })
				]
			}
		]
	},

	'clock-tower-eight': {
		title: {
			ru: 'Практика: договариваемся о встрече', uk: 'Практика: домовляємося про зустріч', en: 'Practice: making plans',
			pl: 'Praktyka: umawiamy się', es: 'Práctica: quedar', fr: 'Pratique : fixer un rendez-vous',
			tr: 'Pratik: buluşma ayarlamak', ro: 'Practică: ne programăm o întâlnire', uz: 'Mashq: uchrashuvni kelishish',
			hi: 'अभ्यास: मिलने का समय तय करना', ar: 'تدريب: ترتيب موعد'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Согласиться: Ja, gern! или Das geht! Отказаться: Nein, leider nicht.'],
					uk: ['Нових правил немає', 'Погодитися: Ja, gern! або Das geht! Відмовитися: Nein, leider nicht.'],
					en: ['No new rules', 'Agree: Ja, gern! or Das geht! Decline: Nein, leider nicht.'],
					pl: ['Bez nowych reguł', 'Zgodzić się: Ja, gern! albo Das geht! Odmówić: Nein, leider nicht.'],
					es: ['Sin reglas nuevas', 'Aceptar: Ja, gern! o Das geht! Rechazar: Nein, leider nicht.'],
					fr: ['Pas de nouvelle règle', 'Accepter : Ja, gern ! ou Das geht ! Refuser : Nein, leider nicht.'],
					tr: ['Yeni kural yok', 'Kabul: Ja, gern! ya da Das geht! Reddetme: Nein, leider nicht.'],
					ro: ['Fără reguli noi', 'Accepți: Ja, gern! sau Das geht! Refuzi: Nein, leider nicht.'],
					uz: ["Yangi qoida yo'q", "Rozi bo'lish: Ja, gern! yoki Das geht! Rad etish: Nein, leider nicht."],
					hi: ['कोई नया नियम नहीं', 'हाँ कहना: Ja, gern! या Das geht! मना करना: Nein, leider nicht।'],
					ar: ['لا قواعد جديدة', 'للموافقة: Ja, gern! أو Das geht! وللرفض: Nein, leider nicht.']
				},
				examples: [
					ex('Hast du am Freitag Zeit?', { ru: 'У тебя есть время в пятницу?', uk: 'У тебе є час у пʼятницю?', en: 'Are you free on Friday?', pl: 'Masz czas w piątek?', es: '¿Tienes tiempo el viernes?', fr: 'Tu as le temps vendredi ?', tr: 'Cuma vaktin var mı?', ro: 'Ai timp vineri?', uz: 'Juma kuni vaqting bormi?', hi: 'क्या तुम्हारे पास शुक्रवार को समय है?', ar: 'هل عندك وقت يوم الجمعة؟' }),
					ex('Und am Samstag? Ja, das geht!', { ru: 'А в субботу? Да, подходит!', uk: 'А в суботу? Так, підходить!', en: 'And on Saturday? Yes, that works!', pl: 'A w sobotę? Tak, pasuje!', es: '¿Y el sábado? ¡Sí, me va bien!', fr: 'Et samedi ? Oui, ça marche !', tr: 'Peki cumartesi? Evet, olur!', ro: 'Și sâmbătă? Da, merge!', uz: "Shanba-chi? Ha, bo'ladi!", hi: 'और शनिवार? हाँ, चलेगा!', ar: 'ويوم السبت؟ نعم، مناسب!' })
				]
			}
		]
	},

	'clock-tower-nine': {
		title: {
			ru: 'Повторение: am, um, im', uk: 'Повторення: am, um, im', en: 'Review: am, um, im',
			pl: 'Powtórka: am, um, im', es: 'Repaso: am, um, im', fr: 'Révision : am, um, im',
			tr: 'Tekrar: am, um, im', ro: 'Recapitulare: am, um, im', uz: 'Takrorlash: am, um, im',
			hi: 'दोहराव: am, um, im', ar: 'مراجعة: am وum وim'
		},
		points: [
			{
				t: {
					ru: ['am', 'День и часть суток: am Montag, am Abend. Но in der Nacht.'],
					uk: ['am', 'День і частина доби: am Montag, am Abend. Але in der Nacht.'],
					en: ['am', 'Day and part of the day: am Montag, am Abend. But in der Nacht.'],
					pl: ['am', 'Dzień i pora dnia: am Montag, am Abend. Ale in der Nacht.'],
					es: ['am', 'Día y parte del día: am Montag, am Abend. Pero in der Nacht.'],
					fr: ['am', 'Jour et moment de la journée : am Montag, am Abend. Mais in der Nacht.'],
					tr: ['am', 'Gün ve günün bölümü: am Montag, am Abend. Ama in der Nacht.'],
					ro: ['am', 'Ziua și partea zilei: am Montag, am Abend. Dar in der Nacht.'],
					uz: ['am', 'Kun va kun qismi: am Montag, am Abend. Lekin in der Nacht.'],
					hi: ['am', 'दिन और दिन का हिस्सा: am Montag, am Abend। लेकिन in der Nacht।'],
					ar: ['am', 'اليوم وجزء اليوم: am Montag، am Abend. لكن in der Nacht.']
				},
				examples: [
					ex('Am Abend sehe ich fern.', { ru: 'Вечером я смотрю телевизор.', uk: 'Увечері я дивлюся телевізор.', en: 'In the evening I watch TV.', pl: 'Wieczorem oglądam telewizję.', es: 'Por la noche veo la tele.', fr: 'Le soir, je regarde la télé.', tr: 'Akşam televizyon izlerim.', ro: 'Seara mă uit la televizor.', uz: "Kechqurun televizor ko'raman.", hi: 'शाम को मैं टीवी देखता हूँ।', ar: 'في المساء أشاهد التلفاز.' })
				]
			},
			{
				t: {
					ru: ['um', 'Точное время: um acht Uhr.'],
					uk: ['um', 'Точний час: um acht Uhr.'],
					en: ['um', 'Exact time: um acht Uhr.'],
					pl: ['um', 'Dokładna godzina: um acht Uhr.'],
					es: ['um', 'Hora exacta: um acht Uhr.'],
					fr: ['um', 'Heure précise : um acht Uhr.'],
					tr: ['um', 'Kesin saat: um acht Uhr.'],
					ro: ['um', 'Ora exactă: um acht Uhr.'],
					uz: ['um', 'Aniq vaqt: um acht Uhr.'],
					hi: ['um', 'सटीक समय: um acht Uhr।'],
					ar: ['um', 'الساعة المحددة: um acht Uhr.']
				},
				examples: [
					ex('Um wie viel Uhr frühstückst du?', { ru: 'Во сколько ты завтракаешь?', uk: 'О котрій ти снідаєш?', en: 'What time do you have breakfast?', pl: 'O której jesz śniadanie?', es: '¿A qué hora desayunas?', fr: 'À quelle heure prends-tu le petit déjeuner ?', tr: 'Saat kaçta kahvaltı yaparsın?', ro: 'La ce oră iei micul dejun?', uz: 'Soat nechada nonushta qilasan?', hi: 'तुम कितने बजे नाश्ता करते हो?', ar: 'في أي ساعة تفطر؟' })
				]
			},
			{
				t: {
					ru: ['im', 'Месяц и время года: im August, im Winter.'],
					uk: ['im', 'Місяць і пора року: im August, im Winter.'],
					en: ['im', 'Month and season: im August, im Winter.'],
					pl: ['im', 'Miesiąc i pora roku: im August, im Winter.'],
					es: ['im', 'Mes y estación: im August, im Winter.'],
					fr: ['im', 'Mois et saison : im August, im Winter.'],
					tr: ['im', 'Ay ve mevsim: im August, im Winter.'],
					ro: ['im', 'Luna și anotimpul: im August, im Winter.'],
					uz: ['im', 'Oy va fasl: im August, im Winter.'],
					hi: ['im', 'महीना और मौसम: im August, im Winter।'],
					ar: ['im', 'الشهر والفصل: im August، im Winter.']
				},
				examples: [
					ex('Im August haben wir Urlaub.', { ru: 'В августе у нас отпуск.', uk: 'У серпні в нас відпустка.', en: 'In August we have holidays.', pl: 'W sierpniu mamy urlop.', es: 'En agosto tenemos vacaciones.', fr: 'En août, nous sommes en vacances.', tr: 'Ağustosta tatildeyiz.', ro: 'În august avem concediu.', uz: "Avgustda ta'tilimiz bor.", hi: 'अगस्त में हमारी छुट्टी होती है।', ar: 'في أغسطس عندنا إجازة.' })
				]
			}
		]
	},

	'clock-tower-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['am, um или im', 'am + день, um + время, im + месяц.'],
					uk: ['am, um чи im', 'am + день, um + час, im + місяць.'],
					en: ['am, um or im', 'am + day, um + time, im + month.'],
					pl: ['am, um czy im', 'am + dzień, um + godzina, im + miesiąc.'],
					es: ['am, um o im', 'am + día, um + hora, im + mes.'],
					fr: ['am, um ou im', 'am + jour, um + heure, im + mois.'],
					tr: ['am, um ya da im', 'am + gün, um + saat, im + ay.'],
					ro: ['am, um sau im', 'am + zi, um + oră, im + lună.'],
					uz: ['am, um yoki im', 'am + kun, um + vaqt, im + oy.'],
					hi: ['am, um या im', 'am + दिन, um + समय, im + महीना।'],
					ar: ['am أم um أم im', 'am + يوم، um + ساعة، im + شهر.']
				},
				examples: [
					ex('Im Juni haben wir wieder Urlaub.', { ru: 'В июне у нас снова отпуск.', uk: 'У червні в нас знову відпустка.', en: 'In June we have holidays again.', pl: 'W czerwcu znów mamy urlop.', es: 'En junio volvemos a tener vacaciones.', fr: 'En juin, nous sommes de nouveau en vacances.', tr: 'Haziranda yine tatildeyiz.', ro: 'În iunie avem din nou concediu.', uz: "Iyunda yana ta'tilimiz bor.", hi: 'जून में फिर से हमारी छुट्टी है।', ar: 'في يونيو عندنا إجازة مرة أخرى.' })
				]
			},
			{
				t: {
					ru: ['Который час', 'Es ist zwei Uhr значит «сейчас два часа».'],
					uk: ['Котра година', 'Es ist zwei Uhr означає «зараз друга година».'],
					en: ['The time', 'Es ist zwei Uhr means "it’s two o’clock".'],
					pl: ['Która godzina', 'Es ist zwei Uhr znaczy „jest druga”.'],
					es: ['La hora', 'Es ist zwei Uhr significa "son las dos".'],
					fr: ['L’heure', 'Es ist zwei Uhr veut dire « il est deux heures ».'],
					tr: ['Saat', 'Es ist zwei Uhr "saat iki" demektir.'],
					ro: ['Ora', 'Es ist zwei Uhr înseamnă „e ora două”.'],
					uz: ['Soat', 'Es ist zwei Uhr "soat ikki" degani.'],
					hi: ['समय', 'Es ist zwei Uhr मतलब "दो बजे हैं"।'],
					ar: ['الساعة', 'Es ist zwei Uhr تعني "الساعة الثانية".']
				},
				examples: []
			},
			{
				t: {
					ru: ['Глагол на втором месте', 'Время в начале, сразу за ним глагол.'],
					uk: ['Дієслово на другому місці', 'Час на початку, одразу за ним дієслово.'],
					en: ['Verb in second place', 'Time at the start, then the verb straight after.'],
					pl: ['Czasownik na drugim miejscu', 'Czas na początku, zaraz po nim czasownik.'],
					es: ['El verbo en segundo lugar', 'El tiempo al principio y justo después el verbo.'],
					fr: ['Le verbe en deuxième position', 'Le temps au début, puis le verbe juste après.'],
					tr: ['Fiil ikinci sırada', 'Zaman başta, hemen ardından fiil.'],
					ro: ['Verbul pe locul doi', 'Timpul la început, imediat după el verbul.'],
					uz: ["Fe'l ikkinchi o'rinda", "Vaqt boshida, darhol undan keyin fe'l."],
					hi: ['क्रिया दूसरे स्थान पर', 'शुरुआत में समय, तुरंत बाद क्रिया।'],
					ar: ['الفعل في المكان الثاني', 'الزمن في البداية ثم الفعل مباشرة.']
				},
				examples: [
					ex('Am Mittag esse ich Suppe.', { ru: 'В полдень я ем суп.', uk: 'Опівдні я їм суп.', en: 'At noon I eat soup.', pl: 'W południe jem zupę.', es: 'Al mediodía como sopa.', fr: 'À midi, je mange de la soupe.', tr: 'Öğlen çorba yerim.', ro: 'La prânz mănânc supă.', uz: "Tushda sho'rva yeyman.", hi: 'दोपहर में मैं सूप खाता हूँ।', ar: 'في الظهر آكل الحساء.' })
				]
			}
		]
	}
}

module.exports = quests
