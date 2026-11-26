// Грамматика к заданиям земли east-plain
const ex = (de, tr) => ({ de, tr })

const quests = {
	one: {
		title: {
			ru: 'Приветствия: Guten или Gute?', uk: 'Привітання: Guten чи Gute?', en: 'Greetings: Guten or Gute?',
			pl: 'Powitania: Guten czy Gute?', es: 'Saludos: ¿Guten o Gute?', fr: 'Salutations : Guten ou Gute ?',
			tr: 'Selamlaşma: Guten mi, Gute mi?', ro: 'Salutul: Guten sau Gute?', uz: 'Salomlashish: Guten yoki Gute?',
			hi: 'अभिवादन: Guten या Gute?', ar: 'التحية: Guten أم Gute؟'
		},
		points: [
			{
				t: {
					ru: ['Здороваемся по времени суток', 'Утром говорят Guten Morgen, днём Guten Tag, вечером Guten Abend. Gute Nacht говорят только перед сном: это пожелание, а не приветствие.'],
					uk: ['Вітаємося за часом доби', 'Зранку кажуть Guten Morgen, удень Guten Tag, увечері Guten Abend. Gute Nacht кажуть лише перед сном: це побажання, а не привітання.'],
					en: ['Greet by the time of day', 'In the morning say Guten Morgen, during the day Guten Tag, in the evening Guten Abend. Gute Nacht is only said before bed: it is a wish, not a greeting.'],
					pl: ['Witamy się według pory dnia', 'Rano mówimy Guten Morgen, w dzień Guten Tag, wieczorem Guten Abend. Gute Nacht mówimy tylko przed snem: to życzenie, a nie powitanie.'],
					es: ['Saludamos según la hora del día', 'Por la mañana se dice Guten Morgen, durante el día Guten Tag, por la tarde y noche Guten Abend. Gute Nacht solo se dice antes de dormir: es un deseo, no un saludo.'],
					fr: ['On salue selon le moment de la journée', 'Le matin on dit Guten Morgen, la journée Guten Tag, le soir Guten Abend. Gute Nacht se dit seulement avant de dormir : c’est un souhait, pas une salutation.'],
					tr: ['Günün saatine göre selamlaşırız', 'Sabah Guten Morgen, gündüz Guten Tag, akşam Guten Abend denir. Gute Nacht sadece yatmadan önce söylenir: selam değil, bir dilektir.'],
					ro: ['Salutăm după momentul zilei', 'Dimineața spunem Guten Morgen, ziua Guten Tag, seara Guten Abend. Gute Nacht se spune doar înainte de culcare: este o urare, nu un salut.'],
					uz: ['Kun vaqtiga qarab salomlashamiz', "Ertalab Guten Morgen, kunduzi Guten Tag, kechqurun Guten Abend deyiladi. Gute Nacht faqat uxlashdan oldin aytiladi: bu salom emas, tilak."],
					hi: ['दिन के समय के अनुसार अभिवादन', 'सुबह Guten Morgen, दिन में Guten Tag, शाम को Guten Abend कहते हैं। Gute Nacht सिर्फ़ सोने से पहले कहते हैं: यह अभिवादन नहीं, शुभकामना है।'],
					ar: ['نحيّي حسب وقت اليوم', 'في الصباح نقول Guten Morgen، وفي النهار Guten Tag، وفي المساء Guten Abend. أما Gute Nacht فتُقال قبل النوم فقط: إنها أمنية وليست تحية.']
				},
				examples: [
					ex('Guten Morgen!', { ru: 'Доброе утро!', uk: 'Доброго ранку!', en: 'Good morning!', pl: 'Dzień dobry! (rano)', es: '¡Buenos días!', fr: 'Bonjour ! (le matin)', tr: 'Günaydın!', ro: 'Bună dimineața!', uz: 'Xayrli tong!', hi: 'सुप्रभात!', ar: 'صباح الخير!' }),
					ex('Guten Tag!', { ru: 'Добрый день!', uk: 'Добрий день!', en: 'Good day!', pl: 'Dzień dobry!', es: '¡Buenos días! (de día)', fr: 'Bonjour !', tr: 'İyi günler!', ro: 'Bună ziua!', uz: 'Xayrli kun!', hi: 'नमस्ते! (दिन में)', ar: 'نهارك سعيد!' }),
					ex('Guten Abend!', { ru: 'Добрый вечер!', uk: 'Добрий вечір!', en: 'Good evening!', pl: 'Dobry wieczór!', es: '¡Buenas tardes!', fr: 'Bonsoir !', tr: 'İyi akşamlar!', ro: 'Bună seara!', uz: 'Xayrli kech!', hi: 'शुभ संध्या!', ar: 'مساء الخير!' }),
					ex('Gute Nacht!', { ru: 'Спокойной ночи!', uk: 'На добраніч!', en: 'Good night!', pl: 'Dobranoc!', es: '¡Buenas noches!', fr: 'Bonne nuit !', tr: 'İyi geceler!', ro: 'Noapte bună!', uz: 'Xayrli tun!', hi: 'शुभ रात्रि!', ar: 'تصبح على خير!' })
				]
			},
			{
				t: {
					ru: ['Guten или Gute', 'Слово «добрый» меняет окончание по роду. der Morgen, der Tag и der Abend мужского рода, поэтому Guten. die Nacht женского рода, поэтому Gute, без -n.'],
					uk: ['Guten чи Gute', 'Слово «добрий» змінює закінчення за родом. der Morgen, der Tag і der Abend чоловічого роду, тому Guten. die Nacht жіночого роду, тому Gute, без -n.'],
					en: ['Guten or Gute', 'The word for "good" changes its ending with the gender of the noun. der Morgen, der Tag and der Abend are masculine, so Guten. die Nacht is feminine, so Gute, without -n.'],
					pl: ['Guten czy Gute', 'Słowo „dobry” zmienia końcówkę zależnie od rodzaju. der Morgen, der Tag i der Abend są rodzaju męskiego, więc Guten. die Nacht jest rodzaju żeńskiego, więc Gute, bez -n.'],
					es: ['Guten o Gute', 'La palabra "bueno" cambia su terminación según el género. der Morgen, der Tag y der Abend son masculinos, por eso Guten. die Nacht es femenino, por eso Gute, sin -n.'],
					fr: ['Guten ou Gute', 'Le mot « bon » change de terminaison selon le genre. der Morgen, der Tag et der Abend sont masculins, donc Guten. die Nacht est féminin, donc Gute, sans -n.'],
					tr: ['Guten mi, Gute mi', '"İyi" kelimesinin sonu ismin cinsiyetine göre değişir. der Morgen, der Tag ve der Abend eril, bu yüzden Guten. die Nacht dişil, bu yüzden -n olmadan Gute.'],
					ro: ['Guten sau Gute', 'Cuvântul „bun” își schimbă terminația după gen. der Morgen, der Tag și der Abend sunt masculine, deci Guten. die Nacht este feminin, deci Gute, fără -n.'],
					uz: ['Guten yoki Gute', "\"Yaxshi\" so'zining oxiri otning rodiga qarab o'zgaradi. der Morgen, der Tag va der Abend erkak rodida, shuning uchun Guten. die Nacht ayol rodida, shuning uchun -n siz Gute."],
					hi: ['Guten या Gute', '"अच्छा" शब्द का अंत संज्ञा के लिंग के अनुसार बदलता है। der Morgen, der Tag और der Abend पुल्लिंग हैं, इसलिए Guten। die Nacht स्त्रीलिंग है, इसलिए -n के बिना Gute।'],
					ar: ['Guten أم Gute', 'تتغير نهاية كلمة "جيد" حسب جنس الاسم. der Morgen وder Tag وder Abend مذكرة، لذلك Guten. أما die Nacht فمؤنثة، لذلك Gute بدون -n.']
				},
				examples: [
					ex('der Tag → Guten Tag!', { ru: 'мужской род: Guten', uk: 'чоловічий рід: Guten', en: 'masculine: Guten', pl: 'rodzaj męski: Guten', es: 'masculino: Guten', fr: 'masculin : Guten', tr: 'eril: Guten', ro: 'masculin: Guten', uz: 'erkak rodi: Guten', hi: 'पुल्लिंग: Guten', ar: 'مذكر: Guten' }),
					ex('die Nacht → Gute Nacht!', { ru: 'женский род: Gute', uk: 'жіночий рід: Gute', en: 'feminine: Gute', pl: 'rodzaj żeński: Gute', es: 'femenino: Gute', fr: 'féminin : Gute', tr: 'dişil: Gute', ro: 'feminin: Gute', uz: 'ayol rodi: Gute', hi: 'स्त्रीलिंग: Gute', ar: 'مؤنث: Gute' })
				]
			},
			{
				t: {
					ru: ['С друзьями и официально', 'Hallo и Tschüss говорят друзьям и знакомым. Guten Tag и Auf Wiedersehen подходят всегда: в магазине, у врача, с незнакомыми людьми.'],
					uk: ['З друзями та офіційно', 'Hallo і Tschüss кажуть друзям і знайомим. Guten Tag і Auf Wiedersehen доречні завжди: у магазині, у лікаря, з незнайомими людьми.'],
					en: ['Friends or formal', 'Say Hallo and Tschüss to friends and people you know. Guten Tag and Auf Wiedersehen always work: in a shop, at the doctor’s, with strangers.'],
					pl: ['Z przyjaciółmi i oficjalnie', 'Hallo i Tschüss mówimy do przyjaciół i znajomych. Guten Tag i Auf Wiedersehen pasują zawsze: w sklepie, u lekarza, z nieznajomymi.'],
					es: ['Con amigos o formal', 'Hallo y Tschüss se dicen a amigos y conocidos. Guten Tag y Auf Wiedersehen sirven siempre: en una tienda, en el médico, con desconocidos.'],
					fr: ['Entre amis ou poliment', 'Hallo et Tschüss se disent aux amis et aux proches. Guten Tag et Auf Wiedersehen conviennent toujours : au magasin, chez le médecin, avec des inconnus.'],
					tr: ['Arkadaşla ve resmî', 'Hallo ve Tschüss arkadaşlara ve tanıdıklara söylenir. Guten Tag ve Auf Wiedersehen her zaman uygundur: mağazada, doktorda, yabancılarla.'],
					ro: ['Cu prietenii și oficial', 'Hallo și Tschüss se spun prietenilor și cunoscuților. Guten Tag și Auf Wiedersehen merg mereu: în magazin, la doctor, cu necunoscuți.'],
					uz: ["Do'stlar bilan va rasmiy", "Hallo va Tschüss do'stlar va tanishlarga aytiladi. Guten Tag va Auf Wiedersehen har doim mos: do'konda, shifokorda, notanish odamlar bilan."],
					hi: ['दोस्तों के साथ और औपचारिक', 'Hallo और Tschüss दोस्तों और जान-पहचान वालों से कहते हैं। Guten Tag और Auf Wiedersehen हमेशा ठीक हैं: दुकान में, डॉक्टर के पास, अनजान लोगों से।'],
					ar: ['مع الأصدقاء وبشكل رسمي', 'نقول Hallo وTschüss للأصدقاء والمعارف. أما Guten Tag وAuf Wiedersehen فمناسبتان دائماً: في المتجر، عند الطبيب، مع الغرباء.']
				},
				examples: [
					ex('Hallo, Anna! Tschüss!', { ru: 'Привет, Анна! Пока!', uk: 'Привіт, Анно! Бувай!', en: 'Hi, Anna! Bye!', pl: 'Cześć, Anno! Pa!', es: '¡Hola, Anna! ¡Chao!', fr: 'Salut, Anna ! Salut !', tr: 'Merhaba Anna! Hoşça kal!', ro: 'Salut, Anna! Pa!', uz: 'Salom, Anna! Xayr!', hi: 'हाय, अन्ना! बाय!', ar: 'مرحباً يا آنا! إلى اللقاء!' }),
					ex('Guten Tag! Auf Wiedersehen!', { ru: 'Добрый день! До свидания!', uk: 'Добрий день! До побачення!', en: 'Good day! Goodbye!', pl: 'Dzień dobry! Do widzenia!', es: '¡Buenos días! ¡Adiós!', fr: 'Bonjour ! Au revoir !', tr: 'İyi günler! Güle güle!', ro: 'Bună ziua! La revedere!', uz: "Xayrli kun! Ko'rishguncha!", hi: 'नमस्ते! फिर मिलेंगे!', ar: 'نهارك سعيد! مع السلامة!' })
				]
			},
			{
				t: {
					ru: ['Существительные с большой буквы', 'В немецком все существительные пишутся с заглавной буквы, даже в середине фразы: der Morgen, der Tag, die Nacht.'],
					uk: ['Іменники з великої літери', 'У німецькій усі іменники пишуться з великої літери, навіть посеред речення: der Morgen, der Tag, die Nacht.'],
					en: ['Nouns start with a capital letter', 'In German every noun is written with a capital letter, even in the middle of a sentence: der Morgen, der Tag, die Nacht.'],
					pl: ['Rzeczowniki wielką literą', 'W niemieckim wszystkie rzeczowniki piszemy wielką literą, nawet w środku zdania: der Morgen, der Tag, die Nacht.'],
					es: ['Sustantivos con mayúscula', 'En alemán todos los sustantivos se escriben con mayúscula, incluso en medio de la frase: der Morgen, der Tag, die Nacht.'],
					fr: ['Les noms prennent une majuscule', 'En allemand, tous les noms s’écrivent avec une majuscule, même au milieu d’une phrase : der Morgen, der Tag, die Nacht.'],
					tr: ['İsimler büyük harfle', 'Almancada tüm isimler cümlenin ortasında bile büyük harfle yazılır: der Morgen, der Tag, die Nacht.'],
					ro: ['Substantivele cu majusculă', 'În germană toate substantivele se scriu cu majusculă, chiar și în mijlocul propoziției: der Morgen, der Tag, die Nacht.'],
					uz: ['Otlar bosh harf bilan', "Nemis tilida barcha otlar gap o'rtasida ham bosh harf bilan yoziladi: der Morgen, der Tag, die Nacht."],
					hi: ['संज्ञा बड़े अक्षर से', 'जर्मन में हर संज्ञा बड़े अक्षर से लिखी जाती है, वाक्य के बीच में भी: der Morgen, der Tag, die Nacht।'],
					ar: ['الأسماء بحرف كبير', 'في الألمانية تُكتب كل الأسماء بحرف كبير، حتى في وسط الجملة: der Morgen، der Tag، die Nacht.']
				},
				examples: []
			}
		]
	},

	two: {
		title: {
			ru: 'Как дела? Вопрос и ответ', uk: 'Як справи? Питання і відповідь', en: 'How are you? Question and answer',
			pl: 'Jak się masz? Pytanie i odpowiedź', es: '¿Qué tal? Pregunta y respuesta', fr: 'Ça va ? Question et réponse',
			tr: 'Nasılsın? Soru ve cevap', ro: 'Ce faci? Întrebare și răspuns', uz: 'Qalaysiz? Savol va javob',
			hi: 'कैसे हो? सवाल और जवाब', ar: 'كيف حالك؟ السؤال والجواب'
		},
		points: [
			{
				t: {
					ru: ['Другу и вежливо', 'Друга спрашивают Wie geht’s? А взрослого незнакомца, учителя или врача вежливо: Wie geht es Ihnen?'],
					uk: ['Другові та ввічливо', 'Друга питають Wie geht’s? А дорослого незнайомця, вчителя чи лікаря ввічливо: Wie geht es Ihnen?'],
					en: ['To a friend and politely', 'Ask a friend Wie geht’s? Ask an adult stranger, a teacher or a doctor politely: Wie geht es Ihnen?'],
					pl: ['Do przyjaciela i grzecznie', 'Przyjaciela pytamy Wie geht’s? Dorosłego nieznajomego, nauczyciela czy lekarza grzecznie: Wie geht es Ihnen?'],
					es: ['A un amigo y con cortesía', 'A un amigo se le pregunta Wie geht’s? A un adulto desconocido, a un profesor o a un médico, con cortesía: Wie geht es Ihnen?'],
					fr: ['À un ami et poliment', 'À un ami on demande Wie geht’s ? À un adulte inconnu, un professeur ou un médecin, poliment : Wie geht es Ihnen ?'],
					tr: ['Arkadaşa ve kibarca', 'Arkadaşa Wie geht’s? diye sorulur. Tanımadığın bir yetişkine, öğretmene ya da doktora kibarca: Wie geht es Ihnen?'],
					ro: ['Unui prieten și politicos', 'Un prieten îl întrebi Wie geht’s? Un adult necunoscut, un profesor sau un medic, politicos: Wie geht es Ihnen?'],
					uz: ["Do'stga va hurmat bilan", "Do'stdan Wie geht’s? deb so'raladi. Notanish kattadan, o'qituvchi yoki shifokordan hurmat bilan: Wie geht es Ihnen?"],
					hi: ['दोस्त से और विनम्रता से', 'दोस्त से पूछते हैं Wie geht’s? अनजान बड़े व्यक्ति, शिक्षक या डॉक्टर से विनम्रता से: Wie geht es Ihnen?'],
					ar: ['للصديق وبأدب', 'نسأل الصديق Wie geht’s? أما الشخص البالغ الغريب أو المعلم أو الطبيب فنسأله بأدب: Wie geht es Ihnen?']
				},
				examples: [
					ex('Wie geht’s?', { ru: 'Как дела?', uk: 'Як справи?', en: 'How are you?', pl: 'Jak się masz?', es: '¿Qué tal?', fr: 'Ça va ?', tr: 'Nasılsın?', ro: 'Ce faci?', uz: 'Qalaysan?', hi: 'कैसे हो?', ar: 'كيف حالك؟' }),
					ex('Wie geht es Ihnen?', { ru: 'Как Ваши дела?', uk: 'Як Ваші справи?', en: 'How are you? (polite)', pl: 'Jak się Pan/Pani miewa?', es: '¿Cómo está usted?', fr: 'Comment allez-vous ?', tr: 'Nasılsınız?', ro: 'Ce mai faceți?', uz: 'Qalaysiz?', hi: 'आप कैसे हैं?', ar: 'كيف حالك؟ (بأدب)' })
				]
			},
			{
				t: {
					ru: ['Как ответить', 'От лучшего к худшему: Sehr gut! Gut. Es geht. Schlecht. К ответу часто добавляют danke.'],
					uk: ['Як відповісти', 'Від кращого до гіршого: Sehr gut! Gut. Es geht. Schlecht. До відповіді часто додають danke.'],
					en: ['How to answer', 'From best to worst: Sehr gut! Gut. Es geht. Schlecht. People often add danke.'],
					pl: ['Jak odpowiedzieć', 'Od najlepszego do najgorszego: Sehr gut! Gut. Es geht. Schlecht. Często dodaje się danke.'],
					es: ['Cómo responder', 'De mejor a peor: Sehr gut! Gut. Es geht. Schlecht. A menudo se añade danke.'],
					fr: ['Comment répondre', 'Du mieux au pire : Sehr gut! Gut. Es geht. Schlecht. On ajoute souvent danke.'],
					tr: ['Nasıl cevap verilir', 'En iyiden en kötüye: Sehr gut! Gut. Es geht. Schlecht. Cevaba çoğu zaman danke eklenir.'],
					ro: ['Cum răspunzi', 'De la cel mai bine la cel mai rău: Sehr gut! Gut. Es geht. Schlecht. Des se adaugă danke.'],
					uz: ['Qanday javob berish', "Eng yaxshidan eng yomonga: Sehr gut! Gut. Es geht. Schlecht. Javobga ko'pincha danke qo'shiladi."],
					hi: ['कैसे जवाब दें', 'सबसे अच्छे से सबसे बुरे तक: Sehr gut! Gut. Es geht. Schlecht. जवाब के साथ अक्सर danke कहते हैं।'],
					ar: ['كيف تجيب', 'من الأفضل إلى الأسوأ: Sehr gut! Gut. Es geht. Schlecht. وغالباً نضيف danke.']
				},
				examples: [
					ex('Sehr gut, danke!', { ru: 'Очень хорошо, спасибо!', uk: 'Дуже добре, дякую!', en: 'Very good, thanks!', pl: 'Bardzo dobrze, dziękuję!', es: '¡Muy bien, gracias!', fr: 'Très bien, merci !', tr: 'Çok iyiyim, teşekkürler!', ro: 'Foarte bine, mulțumesc!', uz: 'Juda yaxshi, rahmat!', hi: 'बहुत अच्छा, धन्यवाद!', ar: 'بخير جداً، شكراً!' }),
					ex('Es geht.', { ru: 'Так себе.', uk: 'Так собі.', en: 'So-so.', pl: 'Tak sobie.', es: 'Más o menos.', fr: 'Comme ci, comme ça.', tr: 'İdare eder.', ro: 'Așa și așa.', uz: "Yomon emas, o'rtacha.", hi: 'ठीक-ठाक।', ar: 'لا بأس.' }),
					ex('Schlecht.', { ru: 'Плохо.', uk: 'Погано.', en: 'Bad.', pl: 'Źle.', es: 'Mal.', fr: 'Mal.', tr: 'Kötü.', ro: 'Rău.', uz: 'Yomon.', hi: 'बुरा।', ar: 'سيئ.' })
				]
			},
			{
				t: {
					ru: ['Спросить в ответ', 'Другу говорят Und dir? Вежливо: Und Ihnen?'],
					uk: ['Запитати у відповідь', 'Другові кажуть Und dir? Ввічливо: Und Ihnen?'],
					en: ['Ask back', 'To a friend: Und dir? Politely: Und Ihnen?'],
					pl: ['Zapytać w odpowiedzi', 'Do przyjaciela: Und dir? Grzecznie: Und Ihnen?'],
					es: ['Preguntar de vuelta', 'A un amigo: Und dir? Con cortesía: Und Ihnen?'],
					fr: ['Retourner la question', 'À un ami : Und dir? Poliment : Und Ihnen?'],
					tr: ['Karşılık sormak', 'Arkadaşa: Und dir? Kibarca: Und Ihnen?'],
					ro: ['Întrebi înapoi', 'Unui prieten: Und dir? Politicos: Und Ihnen?'],
					uz: ["Javoban so'rash", "Do'stga: Und dir? Hurmat bilan: Und Ihnen?"],
					hi: ['वापस पूछना', 'दोस्त से: Und dir? विनम्रता से: Und Ihnen?'],
					ar: ['أن تسأل بدورك', 'للصديق: Und dir? وبأدب: Und Ihnen?']
				},
				examples: [
					ex('Gut, danke. Und dir?', { ru: 'Хорошо, спасибо. А у тебя?', uk: 'Добре, дякую. А в тебе?', en: 'Good, thanks. And you?', pl: 'Dobrze, dziękuję. A ty?', es: 'Bien, gracias. ¿Y tú?', fr: 'Bien, merci. Et toi ?', tr: 'İyiyim, teşekkürler. Ya sen?', ro: 'Bine, mulțumesc. Și tu?', uz: 'Yaxshi, rahmat. Senchi?', hi: 'अच्छा, धन्यवाद। और तुम?', ar: 'بخير، شكراً. وأنت؟' }),
					ex('Gut, danke. Und Ihnen?', { ru: 'Хорошо, спасибо. А у Вас?', uk: 'Добре, дякую. А у Вас?', en: 'Good, thanks. And you? (polite)', pl: 'Dobrze, dziękuję. A Pan/Pani?', es: 'Bien, gracias. ¿Y usted?', fr: 'Bien, merci. Et vous ?', tr: 'İyiyim, teşekkürler. Ya siz?', ro: 'Bine, mulțumesc. Și dumneavoastră?', uz: 'Yaxshi, rahmat. Sizchi?', hi: 'अच्छा, धन्यवाद। और आप?', ar: 'بخير، شكراً. وحضرتك؟' })
				]
			}
		]
	},

	three: {
		title: {
			ru: 'Знакомство: du и Sie', uk: 'Знайомство: du і Sie', en: 'Introductions: du and Sie',
			pl: 'Poznajemy się: du i Sie', es: 'Presentarse: du y Sie', fr: 'Se présenter : du et Sie',
			tr: 'Tanışma: du ve Sie', ro: 'Cunoștința: du și Sie', uz: 'Tanishuv: du va Sie',
			hi: 'परिचय: du और Sie', ar: 'التعارف: du وSie'
		},
		points: [
			{
				t: {
					ru: ['du и Sie', 'du говорят другу, ребёнку, ровеснику. Sie говорят взрослому незнакомцу, и пишут всегда с большой буквы. От этого меняется глагол: du heißt, Sie heißen.'],
					uk: ['du і Sie', 'du кажуть другові, дитині, ровесникові. Sie кажуть дорослому незнайомцю і завжди пишуть з великої літери. Від цього змінюється дієслово: du heißt, Sie heißen.'],
					en: ['du and Sie', 'Use du with a friend, a child or someone your age. Use Sie with an adult stranger, always with a capital S. The verb changes too: du heißt, Sie heißen.'],
					pl: ['du i Sie', 'du mówimy do przyjaciela, dziecka, rówieśnika. Sie do dorosłego nieznajomego, zawsze wielką literą. Zmienia się też czasownik: du heißt, Sie heißen.'],
					es: ['du y Sie', 'du se usa con un amigo, un niño o alguien de tu edad. Sie con un adulto desconocido, siempre con mayúscula. También cambia el verbo: du heißt, Sie heißen.'],
					fr: ['du et Sie', 'du s’emploie avec un ami, un enfant, quelqu’un de ton âge. Sie avec un adulte inconnu, toujours avec une majuscule. Le verbe change aussi : du heißt, Sie heißen.'],
					tr: ['du ve Sie', 'du arkadaşa, çocuğa, yaşıta söylenir. Sie tanımadığın bir yetişkine söylenir ve her zaman büyük harfle yazılır. Fiil de değişir: du heißt, Sie heißen.'],
					ro: ['du și Sie', 'du se spune unui prieten, unui copil, cuiva de vârsta ta. Sie unui adult necunoscut, mereu cu majusculă. Se schimbă și verbul: du heißt, Sie heißen.'],
					uz: ['du va Sie', "du do'stga, bolaga, tengdoshga aytiladi. Sie notanish kattaga aytiladi va doim bosh harf bilan yoziladi. Fe'l ham o'zgaradi: du heißt, Sie heißen."],
					hi: ['du और Sie', 'du दोस्त, बच्चे या हमउम्र से कहते हैं। Sie अनजान बड़े व्यक्ति से कहते हैं और हमेशा बड़े S से लिखते हैं। क्रिया भी बदलती है: du heißt, Sie heißen।'],
					ar: ['du وSie', 'نقول du للصديق أو الطفل أو من هو في عمرك. ونقول Sie للشخص البالغ الغريب، وتُكتب دائماً بحرف كبير. ويتغير الفعل أيضاً: du heißt، Sie heißen.']
				},
				examples: [
					ex('Wie heißt du?', { ru: 'Как тебя зовут?', uk: 'Як тебе звати?', en: 'What’s your name?', pl: 'Jak masz na imię?', es: '¿Cómo te llamas?', fr: 'Comment tu t’appelles ?', tr: 'Adın ne?', ro: 'Cum te cheamă?', uz: 'Isming nima?', hi: 'तुम्हारा नाम क्या है?', ar: 'ما اسمك؟' }),
					ex('Wie heißen Sie?', { ru: 'Как Вас зовут?', uk: 'Як Вас звати?', en: 'What’s your name? (polite)', pl: 'Jak się Pan/Pani nazywa?', es: '¿Cómo se llama usted?', fr: 'Comment vous appelez-vous ?', tr: 'Adınız ne?', ro: 'Cum vă numiți?', uz: 'Ismingiz nima?', hi: 'आपका नाम क्या है?', ar: 'ما اسم حضرتك؟' })
				]
			},
			{
				t: {
					ru: ['Три способа назвать себя', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. Глагол меняет окончание: ich heiße, du heißt, Sie heißen.'],
					uk: ['Три способи назвати себе', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. Дієслово змінює закінчення: ich heiße, du heißt, Sie heißen.'],
					en: ['Three ways to say your name', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. The verb ending changes: ich heiße, du heißt, Sie heißen.'],
					pl: ['Trzy sposoby, by się przedstawić', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. Czasownik zmienia końcówkę: ich heiße, du heißt, Sie heißen.'],
					es: ['Tres formas de decir tu nombre', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. El verbo cambia la terminación: ich heiße, du heißt, Sie heißen.'],
					fr: ['Trois façons de dire son nom', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. La terminaison du verbe change : ich heiße, du heißt, Sie heißen.'],
					tr: ['Adını söylemenin üç yolu', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. Fiilin sonu değişir: ich heiße, du heißt, Sie heißen.'],
					ro: ['Trei feluri de a-ți spune numele', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. Terminația verbului se schimbă: ich heiße, du heißt, Sie heißen.'],
					uz: ["O'zingni tanishtirishning uch yo'li", "Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. Fe'l qo'shimchasi o'zgaradi: ich heiße, du heißt, Sie heißen."],
					hi: ['अपना नाम बताने के तीन तरीके', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. क्रिया का अंत बदलता है: ich heiße, du heißt, Sie heißen।'],
					ar: ['ثلاث طرق لتقول اسمك', 'Ich heiße Anna. Ich bin Anna. Mein Name ist Anna. تتغير نهاية الفعل: ich heiße، du heißt، Sie heißen.']
				},
				examples: [
					ex('Ich heiße Anna.', { ru: 'Меня зовут Анна.', uk: 'Мене звати Анна.', en: 'My name is Anna.', pl: 'Mam na imię Anna.', es: 'Me llamo Anna.', fr: 'Je m’appelle Anna.', tr: 'Benim adım Anna.', ro: 'Mă numesc Anna.', uz: 'Mening ismim Anna.', hi: 'मेरा नाम अन्ना है।', ar: 'اسمي آنا.' }),
					ex('Mein Name ist Paul Weber.', { ru: 'Моё имя Пауль Вебер.', uk: 'Моє ім’я Пауль Вебер.', en: 'My name is Paul Weber.', pl: 'Nazywam się Paul Weber.', es: 'Mi nombre es Paul Weber.', fr: 'Mon nom est Paul Weber.', tr: 'Adım Paul Weber.', ro: 'Numele meu este Paul Weber.', uz: 'Mening ismim Paul Weber.', hi: 'मेरा नाम पॉल वेबर है।', ar: 'اسمي باول فيبر.' })
				]
			},
			{
				t: {
					ru: ['Herr и Frau', 'Herr (господин) и Frau (госпожа) ставят перед фамилией, а не перед именем. При знакомстве говорят Freut mich!'],
					uk: ['Herr і Frau', 'Herr (пан) і Frau (пані) ставлять перед прізвищем, а не перед ім’ям. При знайомстві кажуть Freut mich!'],
					en: ['Herr and Frau', 'Herr (Mr) and Frau (Mrs, Ms) go before the surname, not the first name. When you meet someone, say Freut mich!'],
					pl: ['Herr i Frau', 'Herr (pan) i Frau (pani) stawiamy przed nazwiskiem, a nie przed imieniem. Przy poznaniu mówimy Freut mich!'],
					es: ['Herr y Frau', 'Herr (señor) y Frau (señora) van delante del apellido, no del nombre. Al conocer a alguien se dice Freut mich!'],
					fr: ['Herr et Frau', 'Herr (Monsieur) et Frau (Madame) se placent devant le nom de famille, pas devant le prénom. Quand on fait connaissance, on dit Freut mich!'],
					tr: ['Herr ve Frau', 'Herr (Bay) ve Frau (Bayan) soyadından önce gelir, addan önce değil. Tanışırken Freut mich! denir.'],
					ro: ['Herr și Frau', 'Herr (domnul) și Frau (doamna) se pun înaintea numelui de familie, nu a prenumelui. Când faci cunoștință, spui Freut mich!'],
					uz: ['Herr va Frau', "Herr (janob) va Frau (xonim) ismdan emas, familiyadan oldin qo'yiladi. Tanishganda Freut mich! deyiladi."],
					hi: ['Herr और Frau', 'Herr (श्रीमान) और Frau (श्रीमती) उपनाम से पहले लगते हैं, पहले नाम से पहले नहीं। मिलने पर कहते हैं Freut mich!'],
					ar: ['Herr وFrau', 'نضع Herr (السيد) وFrau (السيدة) قبل اسم العائلة، لا قبل الاسم الأول. وعند التعارف نقول Freut mich!']
				},
				examples: [
					ex('Guten Tag, Herr Weber!', { ru: 'Добрый день, господин Вебер!', uk: 'Добрий день, пане Вебер!', en: 'Good day, Mr Weber!', pl: 'Dzień dobry, panie Weber!', es: '¡Buenos días, señor Weber!', fr: 'Bonjour, Monsieur Weber !', tr: 'İyi günler, Bay Weber!', ro: 'Bună ziua, domnule Weber!', uz: 'Xayrli kun, janob Weber!', hi: 'नमस्ते, श्रीमान वेबर!', ar: 'نهارك سعيد يا سيد فيبر!' }),
					ex('Freut mich, Frau Klein!', { ru: 'Очень приятно, госпожа Кляйн!', uk: 'Дуже приємно, пані Кляйн!', en: 'Nice to meet you, Ms Klein!', pl: 'Miło mi, pani Klein!', es: '¡Encantado, señora Klein!', fr: 'Enchanté, Madame Klein !', tr: 'Memnun oldum, Bayan Klein!', ro: 'Încântat, doamnă Klein!', uz: 'Tanishganimdan xursandman, Klein xonim!', hi: 'आपसे मिलकर खुशी हुई, श्रीमती क्लाइन!', ar: 'تشرفت بمعرفتك يا سيدة كلاين!' })
				]
			}
		]
	},

	four: {
		title: {
			ru: 'Откуда ты: aus и in', uk: 'Звідки ти: aus і in', en: 'Where are you from: aus and in',
			pl: 'Skąd jesteś: aus i in', es: '¿De dónde eres?: aus e in', fr: 'D’où viens-tu : aus et in',
			tr: 'Nerelisin: aus ve in', ro: 'De unde ești: aus și in', uz: 'Qayerdansan: aus va in',
			hi: 'तुम कहाँ से हो: aus और in', ar: 'من أين أنت: aus وin'
		},
		points: [
			{
				t: {
					ru: ['aus и in', 'aus отвечает на вопрос «откуда?»: Ich komme aus Polen. in отвечает на вопрос «где?»: Ich wohne in Berlin.'],
					uk: ['aus і in', 'aus відповідає на питання «звідки?»: Ich komme aus Polen. in відповідає на питання «де?»: Ich wohne in Berlin.'],
					en: ['aus and in', 'aus answers "where from?": Ich komme aus Polen. in answers "where?": Ich wohne in Berlin.'],
					pl: ['aus i in', 'aus odpowiada na pytanie „skąd?”: Ich komme aus Polen. in odpowiada na pytanie „gdzie?”: Ich wohne in Berlin.'],
					es: ['aus e in', 'aus responde a "¿de dónde?": Ich komme aus Polen. in responde a "¿dónde?": Ich wohne in Berlin.'],
					fr: ['aus et in', 'aus répond à « d’où ? » : Ich komme aus Polen. in répond à « où ? » : Ich wohne in Berlin.'],
					tr: ['aus ve in', 'aus "nereden?" sorusunu cevaplar: Ich komme aus Polen. in "nerede?" sorusunu cevaplar: Ich wohne in Berlin.'],
					ro: ['aus și in', 'aus răspunde la „de unde?”: Ich komme aus Polen. in răspunde la „unde?”: Ich wohne in Berlin.'],
					uz: ['aus va in', "aus \"qayerdan?\" savoliga javob: Ich komme aus Polen. in \"qayerda?\" savoliga javob: Ich wohne in Berlin."],
					hi: ['aus और in', 'aus "कहाँ से?" का जवाब है: Ich komme aus Polen. in "कहाँ?" का जवाब है: Ich wohne in Berlin.'],
					ar: ['aus وin', 'aus تجيب عن "من أين؟": Ich komme aus Polen. وin تجيب عن "أين؟": Ich wohne in Berlin.']
				},
				examples: [
					ex('Ich komme aus Polen.', { ru: 'Я из Польши.', uk: 'Я з Польщі.', en: 'I’m from Poland.', pl: 'Jestem z Polski.', es: 'Soy de Polonia.', fr: 'Je viens de Pologne.', tr: 'Polonyalıyım.', ro: 'Sunt din Polonia.', uz: 'Men Polshadanman.', hi: 'मैं पोलैंड से हूँ।', ar: 'أنا من بولندا.' }),
					ex('Ich wohne in Berlin.', { ru: 'Я живу в Берлине.', uk: 'Я живу в Берліні.', en: 'I live in Berlin.', pl: 'Mieszkam w Berlinie.', es: 'Vivo en Berlín.', fr: 'J’habite à Berlin.', tr: 'Berlin’de yaşıyorum.', ro: 'Locuiesc în Berlin.', uz: 'Men Berlinda yashayman.', hi: 'मैं बर्लिन में रहता हूँ।', ar: 'أسكن في برلين.' })
				]
			},
			{
				t: {
					ru: ['Страны с артиклем', 'Большинство стран без артикля. Но некоторые с артиклем die: die Schweiz, die Türkei, die Ukraine. Тогда говорят aus der и in der.'],
					uk: ['Країни з артиклем', 'Більшість країн без артикля. Але деякі з артиклем die: die Schweiz, die Türkei, die Ukraine. Тоді кажуть aus der та in der.'],
					en: ['Countries with an article', 'Most countries have no article. Some do: die Schweiz, die Türkei, die Ukraine. Then you say aus der and in der.'],
					pl: ['Kraje z rodzajnikiem', 'Większość krajów jest bez rodzajnika. Niektóre go mają: die Schweiz, die Türkei, die Ukraine. Wtedy mówimy aus der i in der.'],
					es: ['Países con artículo', 'La mayoría de los países no llevan artículo. Algunos sí: die Schweiz, die Türkei, die Ukraine. Entonces se dice aus der e in der.'],
					fr: ['Pays avec article', 'La plupart des pays n’ont pas d’article. Certains en ont un : die Schweiz, die Türkei, die Ukraine. On dit alors aus der et in der.'],
					tr: ['Artikelli ülkeler', 'Çoğu ülke artikelsizdir. Bazılarında artikel var: die Schweiz, die Türkei, die Ukraine. O zaman aus der ve in der denir.'],
					ro: ['Țări cu articol', 'Majoritatea țărilor nu au articol. Unele au: die Schweiz, die Türkei, die Ukraine. Atunci spui aus der și in der.'],
					uz: ['Artiklli davlatlar', "Ko'p davlatlar artiklsiz. Ba'zilari artikl bilan: die Schweiz, die Türkei, die Ukraine. Unda aus der va in der deyiladi."],
					hi: ['आर्टिकल वाले देश', 'ज़्यादातर देशों के साथ आर्टिकल नहीं होता। कुछ के साथ होता है: die Schweiz, die Türkei, die Ukraine। तब aus der और in der कहते हैं।'],
					ar: ['دول مع أداة تعريف', 'معظم الدول بدون أداة تعريف. وبعضها معها: die Schweiz، die Türkei، die Ukraine. عندها نقول aus der وin der.']
				},
				examples: [
					ex('Ich komme aus der Ukraine.', { ru: 'Я из Украины.', uk: 'Я з України.', en: 'I’m from Ukraine.', pl: 'Jestem z Ukrainy.', es: 'Soy de Ucrania.', fr: 'Je viens d’Ukraine.', tr: 'Ukraynalıyım.', ro: 'Sunt din Ucraina.', uz: 'Men Ukrainadanman.', hi: 'मैं यूक्रेन से हूँ।', ar: 'أنا من أوكرانيا.' }),
					ex('Ich wohne in der Schweiz.', { ru: 'Я живу в Швейцарии.', uk: 'Я живу у Швейцарії.', en: 'I live in Switzerland.', pl: 'Mieszkam w Szwajcarii.', es: 'Vivo en Suiza.', fr: 'J’habite en Suisse.', tr: 'İsviçre’de yaşıyorum.', ro: 'Locuiesc în Elveția.', uz: 'Men Shveytsariyada yashayman.', hi: 'मैं स्विट्ज़रलैंड में रहता हूँ।', ar: 'أسكن في سويسرا.' })
				]
			},
			{
				t: {
					ru: ['Глагол сразу после вопроса', 'В вопросе с Woher или Wo глагол стоит сразу после вопросительного слова.'],
					uk: ['Дієслово одразу після питання', 'У питанні з Woher чи Wo дієслово стоїть одразу після питального слова.'],
					en: ['The verb comes right after', 'In a question with Woher or Wo, the verb comes right after the question word.'],
					pl: ['Czasownik od razu po pytaniu', 'W pytaniu z Woher lub Wo czasownik stoi zaraz po słowie pytającym.'],
					es: ['El verbo va justo después', 'En una pregunta con Woher o Wo, el verbo va justo después de la palabra interrogativa.'],
					fr: ['Le verbe vient juste après', 'Dans une question avec Woher ou Wo, le verbe vient juste après le mot interrogatif.'],
					tr: ['Fiil soru kelimesinden hemen sonra', 'Woher veya Wo ile sorulan soruda fiil soru kelimesinden hemen sonra gelir.'],
					ro: ['Verbul vine imediat după', 'Într-o întrebare cu Woher sau Wo, verbul vine imediat după cuvântul interogativ.'],
					uz: ["Fe'l savol so'zidan keyin", "Woher yoki Wo bilan savolda fe'l savol so'zidan keyin darhol keladi."],
					hi: ['क्रिया तुरंत बाद आती है', 'Woher या Wo वाले सवाल में क्रिया प्रश्नवाचक शब्द के ठीक बाद आती है।'],
					ar: ['الفعل يأتي مباشرة بعده', 'في السؤال بـ Woher أو Wo يأتي الفعل مباشرة بعد أداة الاستفهام.']
				},
				examples: [
					ex('Woher kommen Sie?', { ru: 'Откуда Вы?', uk: 'Звідки Ви?', en: 'Where are you from? (polite)', pl: 'Skąd Pan/Pani pochodzi?', es: '¿De dónde es usted?', fr: 'D’où venez-vous ?', tr: 'Nerelisiniz?', ro: 'De unde sunteți?', uz: 'Qayerdansiz?', hi: 'आप कहाँ से हैं?', ar: 'من أين حضرتك؟' }),
					ex('Wo wohnst du?', { ru: 'Где ты живёшь?', uk: 'Де ти живеш?', en: 'Where do you live?', pl: 'Gdzie mieszkasz?', es: '¿Dónde vives?', fr: 'Où habites-tu ?', tr: 'Nerede yaşıyorsun?', ro: 'Unde locuiești?', uz: 'Qayerda yashaysan?', hi: 'तुम कहाँ रहते हो?', ar: 'أين تسكن؟' })
				]
			}
		]
	},

	five: {
		title: {
			ru: 'Числа от 0 до 12', uk: 'Числа від 0 до 12', en: 'Numbers from 0 to 12',
			pl: 'Liczby od 0 do 12', es: 'Números del 0 al 12', fr: 'Les nombres de 0 à 12',
			tr: '0’dan 12’ye sayılar', ro: 'Numerele de la 0 la 12', uz: "0 dan 12 gacha sonlar",
			hi: '0 से 12 तक संख्याएँ', ar: 'الأعداد من 0 إلى 12'
		},
		points: [
			{
				t: {
					ru: ['Просто запомни', 'Правила здесь нет, эти числа нужно выучить.'],
					uk: ['Просто запам’ятай', 'Правила тут немає, ці числа треба вивчити.'],
					en: ['Just remember them', 'There is no rule here, you simply learn these numbers.'],
					pl: ['Po prostu zapamiętaj', 'Tu nie ma reguły, te liczby trzeba się nauczyć.'],
					es: ['Solo memorízalos', 'Aquí no hay regla, estos números hay que aprenderlos.'],
					fr: ['Retiens-les', 'Il n’y a pas de règle ici, il faut apprendre ces nombres.'],
					tr: ['Sadece ezberle', 'Burada kural yok, bu sayıları ezberlemek gerekir.'],
					ro: ['Doar memorează', 'Aici nu există regulă, aceste numere trebuie învățate.'],
					uz: ['Shunchaki yodla', "Bu yerda qoida yo'q, bu sonlarni yodlash kerak."],
					hi: ['बस याद कर लो', 'यहाँ कोई नियम नहीं है, ये संख्याएँ याद करनी होती हैं।'],
					ar: ['احفظها فقط', 'لا توجد قاعدة هنا، يجب حفظ هذه الأعداد.']
				},
				examples: [
					ex('null, eins, zwei, drei', '0, 1, 2, 3'),
					ex('vier, fünf, sechs', '4, 5, 6'),
					ex('sieben, acht, neun', '7, 8, 9'),
					ex('zehn, elf, zwölf', '10, 11, 12')
				]
			},
			{
				t: {
					ru: ['Номер телефона', 'Номер читают по одной цифре.'],
					uk: ['Номер телефону', 'Номер читають по одній цифрі.'],
					en: ['Phone numbers', 'A phone number is read one digit at a time.'],
					pl: ['Numer telefonu', 'Numer czyta się cyfra po cyfrze.'],
					es: ['Número de teléfono', 'El número se lee cifra por cifra.'],
					fr: ['Numéro de téléphone', 'Le numéro se lit chiffre par chiffre.'],
					tr: ['Telefon numarası', 'Numara rakam rakam okunur.'],
					ro: ['Numărul de telefon', 'Numărul se citește cifră cu cifră.'],
					uz: ['Telefon raqami', "Raqam bittadan raqam qilib o'qiladi."],
					hi: ['फ़ोन नंबर', 'नंबर एक-एक अंक करके पढ़ा जाता है।'],
					ar: ['رقم الهاتف', 'يُقرأ الرقم رقماً رقماً.']
				},
				examples: [
					ex('Wie ist deine Telefonnummer?', { ru: 'Какой у тебя номер телефона?', uk: 'Який у тебе номер телефону?', en: 'What’s your phone number?', pl: 'Jaki masz numer telefonu?', es: '¿Cuál es tu número de teléfono?', fr: 'Quel est ton numéro de téléphone ?', tr: 'Telefon numaran ne?', ro: 'Care e numărul tău de telefon?', uz: 'Telefon raqaming qanday?', hi: 'तुम्हारा फ़ोन नंबर क्या है?', ar: 'ما رقم هاتفك؟' }),
					ex('null, eins, sieben, vier', '0174')
				]
			}
		]
	},

	six: {
		title: {
			ru: 'Числа до 100 и цены', uk: 'Числа до 100 і ціни', en: 'Numbers up to 100 and prices',
			pl: 'Liczby do 100 i ceny', es: 'Números hasta 100 y precios', fr: 'Les nombres jusqu’à 100 et les prix',
			tr: '100’e kadar sayılar ve fiyatlar', ro: 'Numerele până la 100 și prețurile', uz: '100 gacha sonlar va narxlar',
			hi: '100 तक संख्याएँ और कीमतें', ar: 'الأعداد حتى 100 والأسعار'
		},
		points: [
			{
				t: {
					ru: ['Числа от 13 до 19', 'Число плюс zehn: dreizehn, vierzehn. Особые: sechzehn (без s) и siebzehn (без en).'],
					uk: ['Числа від 13 до 19', 'Число плюс zehn: dreizehn, vierzehn. Особливі: sechzehn (без s) і siebzehn (без en).'],
					en: ['Numbers from 13 to 19', 'A number plus zehn: dreizehn, vierzehn. Special ones: sechzehn (no s) and siebzehn (no en).'],
					pl: ['Liczby od 13 do 19', 'Liczba plus zehn: dreizehn, vierzehn. Wyjątki: sechzehn (bez s) i siebzehn (bez en).'],
					es: ['Números del 13 al 19', 'Número más zehn: dreizehn, vierzehn. Especiales: sechzehn (sin s) y siebzehn (sin en).'],
					fr: ['Les nombres de 13 à 19', 'Un nombre plus zehn : dreizehn, vierzehn. Particuliers : sechzehn (sans s) et siebzehn (sans en).'],
					tr: ['13’ten 19’a sayılar', 'Sayı artı zehn: dreizehn, vierzehn. İstisnalar: sechzehn (s yok) ve siebzehn (en yok).'],
					ro: ['Numerele de la 13 la 19', 'Numărul plus zehn: dreizehn, vierzehn. Speciale: sechzehn (fără s) și siebzehn (fără en).'],
					uz: ['13 dan 19 gacha sonlar', "Son va zehn: dreizehn, vierzehn. Alohida: sechzehn (s siz) va siebzehn (en siz)."],
					hi: ['13 से 19 तक संख्याएँ', 'संख्या + zehn: dreizehn, vierzehn। खास: sechzehn (बिना s) और siebzehn (बिना en)।'],
					ar: ['الأعداد من 13 إلى 19', 'العدد مع zehn: dreizehn، vierzehn. وحالات خاصة: sechzehn (بدون s) وsiebzehn (بدون en).']
				},
				examples: [
					ex('dreizehn, vierzehn', '13, 14'),
					ex('sechzehn, siebzehn', '16, 17')
				]
			},
			{
				t: {
					ru: ['Десятки', 'Почти все десятки на -zig: zwanzig, vierzig, fünfzig. Исключение: dreißig.'],
					uk: ['Десятки', 'Майже всі десятки на -zig: zwanzig, vierzig, fünfzig. Виняток: dreißig.'],
					en: ['Tens', 'Almost all tens end in -zig: zwanzig, vierzig, fünfzig. Exception: dreißig.'],
					pl: ['Dziesiątki', 'Prawie wszystkie dziesiątki kończą się na -zig: zwanzig, vierzig, fünfzig. Wyjątek: dreißig.'],
					es: ['Decenas', 'Casi todas las decenas terminan en -zig: zwanzig, vierzig, fünfzig. Excepción: dreißig.'],
					fr: ['Les dizaines', 'Presque toutes les dizaines finissent en -zig : zwanzig, vierzig, fünfzig. Exception : dreißig.'],
					tr: ['Onluklar', 'Neredeyse tüm onluklar -zig ile biter: zwanzig, vierzig, fünfzig. İstisna: dreißig.'],
					ro: ['Zecile', 'Aproape toate zecile se termină în -zig: zwanzig, vierzig, fünfzig. Excepție: dreißig.'],
					uz: ["O'nliklar", "Deyarli barcha o'nliklar -zig bilan tugaydi: zwanzig, vierzig, fünfzig. Istisno: dreißig."],
					hi: ['दहाइयाँ', 'लगभग सभी दहाइयाँ -zig पर खत्म होती हैं: zwanzig, vierzig, fünfzig। अपवाद: dreißig।'],
					ar: ['العشرات', 'تنتهي معظم العشرات بـ -zig: zwanzig، vierzig، fünfzig. والاستثناء: dreißig.']
				},
				examples: [
					ex('zwanzig, dreißig, vierzig', '20, 30, 40')
				]
			},
			{
				t: {
					ru: ['Сначала единицы', 'От 21 до 99 сначала говорят единицы, потом und и десятки, всё одним словом: «один и двадцать».'],
					uk: ['Спочатку одиниці', 'Від 21 до 99 спочатку кажуть одиниці, потім und і десятки, усе одним словом: «один і двадцять».'],
					en: ['Units come first', 'From 21 to 99 you say the units first, then und and the tens, all in one word: "one and twenty".'],
					pl: ['Najpierw jedności', 'Od 21 do 99 najpierw mówimy jedności, potem und i dziesiątki, wszystko jednym słowem: „jeden i dwadzieścia”.'],
					es: ['Primero las unidades', 'Del 21 al 99 se dicen primero las unidades, luego und y las decenas, todo en una palabra: "uno y veinte".'],
					fr: ['D’abord les unités', 'De 21 à 99 on dit d’abord les unités, puis und et les dizaines, en un seul mot : « un et vingt ».'],
					tr: ['Önce birler', '21’den 99’a önce birler, sonra und ve onlar söylenir, hepsi tek kelime: "bir ve yirmi".'],
					ro: ['Întâi unitățile', 'De la 21 la 99 spui întâi unitățile, apoi und și zecile, totul într-un cuvânt: „unu și douăzeci”.'],
					uz: ['Avval birliklar', "21 dan 99 gacha avval birlik, keyin und va o'nlik aytiladi, hammasi bitta so'z: \"bir va yigirma\"."],
					hi: ['पहले इकाई', '21 से 99 तक पहले इकाई, फिर und और दहाई बोलते हैं, सब एक शब्द में: "एक और बीस"।'],
					ar: ['الآحاد أولاً', 'من 21 إلى 99 نقول الآحاد أولاً، ثم und والعشرات، وكلها كلمة واحدة: "واحد وعشرون".']
				},
				examples: [
					ex('einundzwanzig', '21'),
					ex('fünfundvierzig', '45')
				]
			},
			{
				t: {
					ru: ['Сколько стоит?', 'Спросить цену: Was kostet das? Ответ: Das kostet ... Euro.'],
					uk: ['Скільки коштує?', 'Запитати ціну: Was kostet das? Відповідь: Das kostet ... Euro.'],
					en: ['How much is it?', 'Ask the price: Was kostet das? Answer: Das kostet ... Euro.'],
					pl: ['Ile to kosztuje?', 'Zapytać o cenę: Was kostet das? Odpowiedź: Das kostet ... Euro.'],
					es: ['¿Cuánto cuesta?', 'Preguntar el precio: Was kostet das? Respuesta: Das kostet ... Euro.'],
					fr: ['Combien ça coûte ?', 'Demander le prix : Was kostet das? Réponse : Das kostet ... Euro.'],
					tr: ['Ne kadar?', 'Fiyat sormak: Was kostet das? Cevap: Das kostet ... Euro.'],
					ro: ['Cât costă?', 'Întrebi prețul: Was kostet das? Răspuns: Das kostet ... Euro.'],
					uz: ['Qancha turadi?', "Narx so'rash: Was kostet das? Javob: Das kostet ... Euro."],
					hi: ['कितने का है?', 'कीमत पूछना: Was kostet das? जवाब: Das kostet ... Euro.'],
					ar: ['كم السعر؟', 'لتسأل عن السعر: Was kostet das? والجواب: Das kostet ... Euro.']
				},
				examples: [
					ex('Was kostet das?', { ru: 'Сколько это стоит?', uk: 'Скільки це коштує?', en: 'How much is it?', pl: 'Ile to kosztuje?', es: '¿Cuánto cuesta?', fr: 'Combien ça coûte ?', tr: 'Bu ne kadar?', ro: 'Cât costă?', uz: 'Bu qancha turadi?', hi: 'यह कितने का है?', ar: 'كم سعر هذا؟' }),
					ex('Das kostet zwanzig Euro.', { ru: 'Это стоит двадцать евро.', uk: 'Це коштує двадцять євро.', en: 'It costs twenty euros.', pl: 'To kosztuje dwadzieścia euro.', es: 'Cuesta veinte euros.', fr: 'Ça coûte vingt euros.', tr: 'Yirmi euro.', ro: 'Costă douăzeci de euro.', uz: 'Bu yigirma yevro turadi.', hi: 'यह बीस यूरो का है।', ar: 'سعره عشرون يورو.' })
				]
			}
		]
	},

	seven: {
		title: {
			ru: 'В кафе: ich möchte', uk: 'У кафе: ich möchte', en: 'At the café: ich möchte',
			pl: 'W kawiarni: ich möchte', es: 'En el café: ich möchte', fr: 'Au café : ich möchte',
			tr: 'Kafede: ich möchte', ro: 'La cafenea: ich möchte', uz: 'Kafeda: ich möchte',
			hi: 'कैफ़े में: ich möchte', ar: 'في المقهى: ich möchte'
		},
		points: [
			{
				t: {
					ru: ['Вежливо заказать', 'Ich möchte значит «я бы хотел(а)». Это вежливее, чем «я хочу». Можно и коротко: Ein Wasser, bitte.'],
					uk: ['Ввічливо замовити', 'Ich möchte означає «я б хотів (хотіла)». Це ввічливіше, ніж «я хочу». Можна й коротко: Ein Wasser, bitte.'],
					en: ['Order politely', 'Ich möchte means "I would like". It is more polite than "I want". You can also say it short: Ein Wasser, bitte.'],
					pl: ['Grzecznie zamówić', 'Ich möchte znaczy „chciałbym/chciałabym”. To grzeczniejsze niż „chcę”. Można też krótko: Ein Wasser, bitte.'],
					es: ['Pedir con cortesía', 'Ich möchte significa "me gustaría". Es más cortés que "quiero". También se puede decir corto: Ein Wasser, bitte.'],
					fr: ['Commander poliment', 'Ich möchte veut dire « je voudrais ». C’est plus poli que « je veux ». On peut aussi dire court : Ein Wasser, bitte.'],
					tr: ['Kibarca sipariş', 'Ich möchte "isterdim" demektir. "İstiyorum"dan daha kibardır. Kısaca da olur: Ein Wasser, bitte.'],
					ro: ['Comanzi politicos', 'Ich möchte înseamnă „aș dori”. E mai politicos decât „vreau”. Se poate și scurt: Ein Wasser, bitte.'],
					uz: ['Hurmat bilan buyurtma', "Ich möchte \"men ... istardim\" degani. Bu \"men xohlayman\"dan muloyimroq. Qisqa ham bo'ladi: Ein Wasser, bitte."],
					hi: ['विनम्रता से ऑर्डर करना', 'Ich möchte का मतलब है "मैं ... चाहूँगा"। यह "मुझे चाहिए" से ज़्यादा विनम्र है। छोटा भी कह सकते हैं: Ein Wasser, bitte.'],
					ar: ['اطلب بأدب', 'Ich möchte تعني "أودّ". وهي أكثر أدباً من "أريد". ويمكن قولها باختصار: Ein Wasser, bitte.']
				},
				examples: [
					ex('Ich möchte einen Kaffee, bitte.', { ru: 'Я бы хотел кофе, пожалуйста.', uk: 'Я б хотів каву, будь ласка.', en: 'I’d like a coffee, please.', pl: 'Poproszę kawę.', es: 'Quisiera un café, por favor.', fr: 'Je voudrais un café, s’il vous plaît.', tr: 'Bir kahve rica ediyorum.', ro: 'Aș dori o cafea, vă rog.', uz: 'Menga bitta qahva, iltimos.', hi: 'मुझे एक कॉफ़ी चाहिए, कृपया।', ar: 'أودّ قهوة من فضلك.' }),
					ex('Ein Wasser, bitte.', { ru: 'Воду, пожалуйста.', uk: 'Воду, будь ласка.', en: 'A water, please.', pl: 'Wodę, proszę.', es: 'Un agua, por favor.', fr: 'Une eau, s’il vous plaît.', tr: 'Bir su, lütfen.', ro: 'O apă, vă rog.', uz: 'Suv, iltimos.', hi: 'एक पानी, कृपया।', ar: 'ماء من فضلك.' })
				]
			},
			{
				t: {
					ru: ['einen или ein', 'После möchte слово мужского рода получает einen: der Kaffee → einen Kaffee. Слово среднего рода остаётся ein: das Wasser → ein Wasser.'],
					uk: ['einen чи ein', 'Після möchte слово чоловічого роду отримує einen: der Kaffee → einen Kaffee. Слово середнього роду лишається ein: das Wasser → ein Wasser.'],
					en: ['einen or ein', 'After möchte a masculine noun takes einen: der Kaffee → einen Kaffee. A neuter noun keeps ein: das Wasser → ein Wasser.'],
					pl: ['einen czy ein', 'Po möchte rzeczownik rodzaju męskiego dostaje einen: der Kaffee → einen Kaffee. Rodzaj nijaki zostaje ein: das Wasser → ein Wasser.'],
					es: ['einen o ein', 'Después de möchte un sustantivo masculino lleva einen: der Kaffee → einen Kaffee. Uno neutro mantiene ein: das Wasser → ein Wasser.'],
					fr: ['einen ou ein', 'Après möchte, un nom masculin prend einen : der Kaffee → einen Kaffee. Un nom neutre garde ein : das Wasser → ein Wasser.'],
					tr: ['einen mi, ein mi', 'möchte’den sonra eril isim einen alır: der Kaffee → einen Kaffee. Nötr isim ein olarak kalır: das Wasser → ein Wasser.'],
					ro: ['einen sau ein', 'După möchte, un substantiv masculin primește einen: der Kaffee → einen Kaffee. Unul neutru rămâne ein: das Wasser → ein Wasser.'],
					uz: ['einen yoki ein', "möchte dan keyin erkak rodidagi so'z einen oladi: der Kaffee → einen Kaffee. O'rta rod ein bo'lib qoladi: das Wasser → ein Wasser."],
					hi: ['einen या ein', 'möchte के बाद पुल्लिंग संज्ञा einen लेती है: der Kaffee → einen Kaffee। नपुंसकलिंग ein ही रहती है: das Wasser → ein Wasser।'],
					ar: ['einen أم ein', 'بعد möchte يأخذ الاسم المذكر einen: der Kaffee → einen Kaffee. أما المحايد فيبقى ein: das Wasser → ein Wasser.']
				},
				examples: [
					ex('der Tee → einen Tee mit Milch', { ru: 'чай с молоком', uk: 'чай з молоком', en: 'tea with milk', pl: 'herbata z mlekiem', es: 'té con leche', fr: 'thé au lait', tr: 'sütlü çay', ro: 'ceai cu lapte', uz: 'sutli choy', hi: 'दूध वाली चाय', ar: 'شاي بالحليب' }),
					ex('das Wasser → ein Wasser', { ru: 'вода', uk: 'вода', en: 'water', pl: 'woda', es: 'agua', fr: 'eau', tr: 'su', ro: 'apă', uz: 'suv', hi: 'पानी', ar: 'ماء' })
				]
			},
			{
				t: {
					ru: ['bitte и danke', 'bitte значит и «пожалуйста», и «не за что» в ответ на danke.'],
					uk: ['bitte і danke', 'bitte означає і «будь ласка», і «нема за що» у відповідь на danke.'],
					en: ['bitte and danke', 'bitte means both "please" and "you’re welcome" as a reply to danke.'],
					pl: ['bitte i danke', 'bitte znaczy i „proszę”, i „nie ma za co” w odpowiedzi na danke.'],
					es: ['bitte y danke', 'bitte significa "por favor" y también "de nada" como respuesta a danke.'],
					fr: ['bitte et danke', 'bitte veut dire « s’il te plaît » et aussi « de rien » en réponse à danke.'],
					tr: ['bitte ve danke', 'bitte hem "lütfen" hem de danke’ye cevap olarak "rica ederim" demektir.'],
					ro: ['bitte și danke', 'bitte înseamnă și „te rog”, și „cu plăcere” ca răspuns la danke.'],
					uz: ['bitte va danke', "bitte ham \"iltimos\", ham danke ga javoban \"arzimaydi\" degani."],
					hi: ['bitte और danke', 'bitte का मतलब "कृपया" भी है और danke के जवाब में "कोई बात नहीं" भी।'],
					ar: ['bitte وdanke', 'bitte تعني "من فضلك" وتعني أيضاً "عفواً" رداً على danke.']
				},
				examples: [
					ex('Danke! Bitte!', { ru: 'Спасибо! Пожалуйста!', uk: 'Дякую! Будь ласка!', en: 'Thanks! You’re welcome!', pl: 'Dziękuję! Proszę!', es: '¡Gracias! ¡De nada!', fr: 'Merci ! De rien !', tr: 'Teşekkürler! Rica ederim!', ro: 'Mulțumesc! Cu plăcere!', uz: 'Rahmat! Arzimaydi!', hi: 'धन्यवाद! कोई बात नहीं!', ar: 'شكراً! عفواً!' }),
					ex('Die Rechnung, bitte!', { ru: 'Счёт, пожалуйста!', uk: 'Рахунок, будь ласка!', en: 'The bill, please!', pl: 'Rachunek, proszę!', es: '¡La cuenta, por favor!', fr: 'L’addition, s’il vous plaît !', tr: 'Hesap, lütfen!', ro: 'Nota, vă rog!', uz: 'Hisob, iltimos!', hi: 'बिल, कृपया!', ar: 'الحساب من فضلك!' })
				]
			}
		]
	},

	eight: {
		title: {
			ru: 'Семья и профессии: mein и meine', uk: 'Сім’я і професії: mein і meine', en: 'Family and jobs: mein and meine',
			pl: 'Rodzina i zawody: mein i meine', es: 'Familia y profesiones: mein y meine', fr: 'Famille et métiers : mein et meine',
			tr: 'Aile ve meslekler: mein ve meine', ro: 'Familia și profesiile: mein și meine', uz: 'Oila va kasblar: mein va meine',
			hi: 'परिवार और पेशे: mein और meine', ar: 'العائلة والمهن: mein وmeine'
		},
		points: [
			{
				t: {
					ru: ['mein или meine', 'Перед словом с der говорят mein: mein Vater, mein Bruder. Перед словом с die: meine: meine Mutter, meine Schwester.'],
					uk: ['mein чи meine', 'Перед словом з der кажуть mein: mein Vater, mein Bruder. Перед словом з die: meine: meine Mutter, meine Schwester.'],
					en: ['mein or meine', 'Before a der word say mein: mein Vater, mein Bruder. Before a die word say meine: meine Mutter, meine Schwester.'],
					pl: ['mein czy meine', 'Przed słowem z der mówimy mein: mein Vater, mein Bruder. Przed słowem z die: meine: meine Mutter, meine Schwester.'],
					es: ['mein o meine', 'Delante de una palabra con der se dice mein: mein Vater, mein Bruder. Delante de una con die, meine: meine Mutter, meine Schwester.'],
					fr: ['mein ou meine', 'Devant un mot en der on dit mein : mein Vater, mein Bruder. Devant un mot en die, meine : meine Mutter, meine Schwester.'],
					tr: ['mein mi, meine mi', 'der’li kelimeden önce mein denir: mein Vater, mein Bruder. die’li kelimeden önce meine: meine Mutter, meine Schwester.'],
					ro: ['mein sau meine', 'Înaintea unui cuvânt cu der spui mein: mein Vater, mein Bruder. Înaintea unuia cu die, meine: meine Mutter, meine Schwester.'],
					uz: ['mein yoki meine', "der li so'zdan oldin mein: mein Vater, mein Bruder. die li so'zdan oldin meine: meine Mutter, meine Schwester."],
					hi: ['mein या meine', 'der वाले शब्द से पहले mein: mein Vater, mein Bruder। die वाले शब्द से पहले meine: meine Mutter, meine Schwester।'],
					ar: ['mein أم meine', 'قبل الكلمة التي تأخذ der نقول mein: mein Vater، mein Bruder. وقبل التي تأخذ die نقول meine: meine Mutter، meine Schwester.']
				},
				examples: [
					ex('Das ist mein Vater.', { ru: 'Это мой папа.', uk: 'Це мій тато.', en: 'This is my father.', pl: 'To mój tata.', es: 'Este es mi padre.', fr: 'C’est mon père.', tr: 'Bu benim babam.', ro: 'Acesta este tatăl meu.', uz: 'Bu mening otam.', hi: 'ये मेरे पिता हैं।', ar: 'هذا أبي.' }),
					ex('Das ist meine Schwester.', { ru: 'Это моя сестра.', uk: 'Це моя сестра.', en: 'This is my sister.', pl: 'To moja siostra.', es: 'Esta es mi hermana.', fr: 'C’est ma sœur.', tr: 'Bu benim kız kardeşim.', ro: 'Aceasta este sora mea.', uz: 'Bu mening opam (singlim).', hi: 'ये मेरी बहन है।', ar: 'هذه أختي.' })
				]
			},
			{
				t: {
					ru: ['Профессия без артикля', 'Перед профессией артикль не нужен: Er ist Arzt. Ich bin Student.'],
					uk: ['Професія без артикля', 'Перед професією артикль не потрібен: Er ist Arzt. Ich bin Student.'],
					en: ['No article before a job', 'You don’t need an article before a job: Er ist Arzt. Ich bin Student.'],
					pl: ['Zawód bez rodzajnika', 'Przed zawodem rodzajnik nie jest potrzebny: Er ist Arzt. Ich bin Student.'],
					es: ['Profesión sin artículo', 'Delante de la profesión no hace falta artículo: Er ist Arzt. Ich bin Student.'],
					fr: ['Pas d’article devant le métier', 'Devant un métier, pas d’article : Er ist Arzt. Ich bin Student.'],
					tr: ['Meslekten önce artikel yok', 'Meslekten önce artikel gerekmez: Er ist Arzt. Ich bin Student.'],
					ro: ['Profesia fără articol', 'Înaintea profesiei nu e nevoie de articol: Er ist Arzt. Ich bin Student.'],
					uz: ['Kasbdan oldin artikl yo‘q', "Kasbdan oldin artikl kerak emas: Er ist Arzt. Ich bin Student."],
					hi: ['पेशे से पहले आर्टिकल नहीं', 'पेशे से पहले आर्टिकल नहीं लगता: Er ist Arzt. Ich bin Student.'],
					ar: ['لا أداة قبل المهنة', 'لا نحتاج أداة قبل المهنة: Er ist Arzt. Ich bin Student.']
				},
				examples: [
					ex('Er ist Arzt.', { ru: 'Он врач.', uk: 'Він лікар.', en: 'He is a doctor.', pl: 'On jest lekarzem.', es: 'Él es médico.', fr: 'Il est médecin.', tr: 'O doktor.', ro: 'El este medic.', uz: 'U shifokor.', hi: 'वह डॉक्टर है।', ar: 'هو طبيب.' }),
					ex('Ich bin Student.', { ru: 'Я студент.', uk: 'Я студент.', en: 'I am a student.', pl: 'Jestem studentem.', es: 'Soy estudiante.', fr: 'Je suis étudiant.', tr: 'Ben öğrenciyim.', ro: 'Sunt student.', uz: 'Men talabaman.', hi: 'मैं छात्र हूँ।', ar: 'أنا طالب.' })
				]
			},
			{
				t: {
					ru: ['Женская форма на -in', 'Женщину называют с -in на конце: Lehrer → Lehrerin, Student → Studentin. Иногда появляется умлаут: Arzt → Ärztin.'],
					uk: ['Жіноча форма на -in', 'Жінку називають з -in наприкінці: Lehrer → Lehrerin, Student → Studentin. Іноді з’являється умлаут: Arzt → Ärztin.'],
					en: ['Female form with -in', 'For a woman add -in: Lehrer → Lehrerin, Student → Studentin. Sometimes an umlaut appears: Arzt → Ärztin.'],
					pl: ['Forma żeńska na -in', 'Dla kobiety dodajemy -in: Lehrer → Lehrerin, Student → Studentin. Czasem pojawia się umlaut: Arzt → Ärztin.'],
					es: ['Forma femenina con -in', 'Para una mujer se añade -in: Lehrer → Lehrerin, Student → Studentin. A veces aparece diéresis: Arzt → Ärztin.'],
					fr: ['Forme féminine en -in', 'Pour une femme on ajoute -in : Lehrer → Lehrerin, Student → Studentin. Parfois un umlaut apparaît : Arzt → Ärztin.'],
					tr: ['-in ile kadın hâli', 'Kadın için -in eklenir: Lehrer → Lehrerin, Student → Studentin. Bazen umlaut gelir: Arzt → Ärztin.'],
					ro: ['Forma feminină cu -in', 'Pentru o femeie se adaugă -in: Lehrer → Lehrerin, Student → Studentin. Uneori apare umlaut: Arzt → Ärztin.'],
					uz: ['-in bilan ayol shakli', "Ayol uchun -in qo'shiladi: Lehrer → Lehrerin, Student → Studentin. Ba'zan umlaut paydo bo'ladi: Arzt → Ärztin."],
					hi: ['-in से स्त्रीलिंग रूप', 'महिला के लिए अंत में -in जोड़ते हैं: Lehrer → Lehrerin, Student → Studentin। कभी-कभी उमलाउट आता है: Arzt → Ärztin।'],
					ar: ['صيغة المؤنث بـ -in', 'للمرأة نضيف -in: Lehrer → Lehrerin، Student → Studentin. وأحياناً يظهر الأوملاوت: Arzt → Ärztin.']
				},
				examples: [
					ex('Lehrer → Lehrerin', { ru: 'учитель → учительница', uk: 'учитель → учителька', en: 'teacher (m) → teacher (f)', pl: 'nauczyciel → nauczycielka', es: 'profesor → profesora', fr: 'professeur → professeure', tr: 'öğretmen (e) → öğretmen (k)', ro: 'profesor → profesoară', uz: "o'qituvchi (e) → o'qituvchi (a)", hi: 'शिक्षक → शिक्षिका', ar: 'معلم → معلمة' }),
					ex('Arzt → Ärztin', { ru: 'врач (м) → врач (ж)', uk: 'лікар → лікарка', en: 'doctor (m) → doctor (f)', pl: 'lekarz → lekarka', es: 'médico → médica', fr: 'médecin (m) → médecin (f)', tr: 'doktor (e) → doktor (k)', ro: 'medic → medică', uz: 'shifokor (e) → shifokor (a)', hi: 'डॉक्टर (पु) → डॉक्टर (स्त्री)', ar: 'طبيب → طبيبة' })
				]
			}
		]
	},

	nine: {
		title: {
			ru: 'Повторение: du или Sie', uk: 'Повторення: du чи Sie', en: 'Review: du or Sie',
			pl: 'Powtórka: du czy Sie', es: 'Repaso: du o Sie', fr: 'Révision : du ou Sie',
			tr: 'Tekrar: du mu, Sie mi', ro: 'Recapitulare: du sau Sie', uz: 'Takrorlash: du yoki Sie',
			hi: 'दोहराव: du या Sie', ar: 'مراجعة: du أم Sie'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Другу и ребёнку говорят du. Взрослому незнакомцу, в кафе, в магазине говорят Sie. Обратиться к незнакомому: Entschuldigung!'],
					uk: ['Нових правил немає', 'Другові й дитині кажуть du. Дорослому незнайомцю, у кафе, у магазині кажуть Sie. Звернутися до незнайомого: Entschuldigung!'],
					en: ['No new rules', 'Use du with a friend or a child. Use Sie with an adult stranger, in a café, in a shop. To get a stranger’s attention: Entschuldigung!'],
					pl: ['Bez nowych reguł', 'Do przyjaciela i dziecka mówimy du. Do dorosłego nieznajomego, w kawiarni, w sklepie: Sie. Zaczepić nieznajomego: Entschuldigung!'],
					es: ['Sin reglas nuevas', 'Con un amigo o un niño, du. Con un adulto desconocido, en un café, en una tienda, Sie. Para llamar a un desconocido: Entschuldigung!'],
					fr: ['Pas de nouvelle règle', 'Avec un ami ou un enfant, du. Avec un adulte inconnu, au café, au magasin, Sie. Pour interpeller un inconnu : Entschuldigung!'],
					tr: ['Yeni kural yok', 'Arkadaşa ve çocuğa du. Tanımadığın yetişkine, kafede, mağazada Sie. Bir yabancıya seslenmek için: Entschuldigung!'],
					ro: ['Fără reguli noi', 'Unui prieten sau unui copil îi spui du. Unui adult necunoscut, la cafenea, în magazin, Sie. Ca să te adresezi unui necunoscut: Entschuldigung!'],
					uz: ["Yangi qoida yo'q", "Do'st va bolaga du. Notanish kattaga, kafeda, do'konda Sie. Notanishga murojaat qilish: Entschuldigung!"],
					hi: ['कोई नया नियम नहीं', 'दोस्त और बच्चे से du। अनजान बड़े व्यक्ति से, कैफ़े में, दुकान में Sie। किसी अनजान को बुलाना: Entschuldigung!'],
					ar: ['لا قواعد جديدة', 'للصديق والطفل نقول du. وللبالغ الغريب وفي المقهى والمتجر نقول Sie. ولننادي شخصاً غريباً: Entschuldigung!']
				},
				examples: [
					ex('Entschuldigung, sind Sie Herr Becker?', { ru: 'Извините, Вы господин Беккер?', uk: 'Перепрошую, Ви пан Беккер?', en: 'Excuse me, are you Mr Becker?', pl: 'Przepraszam, czy pan Becker?', es: 'Perdone, ¿es usted el señor Becker?', fr: 'Excusez-moi, vous êtes Monsieur Becker ?', tr: 'Affedersiniz, Bay Becker siz misiniz?', ro: 'Scuzați-mă, sunteți domnul Becker?', uz: 'Kechirasiz, siz janob Beckermisiz?', hi: 'माफ़ कीजिए, क्या आप श्रीमान बेकर हैं?', ar: 'عذراً، هل أنت السيد بيكر؟' }),
					ex('Tee? Nein, danke.', { ru: 'Чай? Нет, спасибо.', uk: 'Чай? Ні, дякую.', en: 'Tea? No, thanks.', pl: 'Herbata? Nie, dziękuję.', es: '¿Té? No, gracias.', fr: 'Du thé ? Non, merci.', tr: 'Çay? Hayır, teşekkürler.', ro: 'Ceai? Nu, mulțumesc.', uz: "Choy? Yo'q, rahmat.", hi: 'चाय? नहीं, धन्यवाद।', ar: 'شاي؟ لا، شكراً.' })
				]
			}
		]
	},

	ten: {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Приветствие по времени суток', 'Утром Guten Morgen, днём Guten Tag, вечером Guten Abend. Перед сном Gute Nacht, без -n.'],
					uk: ['Привітання за часом доби', 'Зранку Guten Morgen, удень Guten Tag, увечері Guten Abend. Перед сном Gute Nacht, без -n.'],
					en: ['Greeting by the time of day', 'Morning: Guten Morgen, day: Guten Tag, evening: Guten Abend. Before bed: Gute Nacht, without -n.'],
					pl: ['Powitanie według pory dnia', 'Rano Guten Morgen, w dzień Guten Tag, wieczorem Guten Abend. Przed snem Gute Nacht, bez -n.'],
					es: ['Saludo según la hora', 'Por la mañana Guten Morgen, de día Guten Tag, por la tarde Guten Abend. Antes de dormir Gute Nacht, sin -n.'],
					fr: ['Salutation selon le moment', 'Le matin Guten Morgen, la journée Guten Tag, le soir Guten Abend. Avant de dormir Gute Nacht, sans -n.'],
					tr: ['Günün saatine göre selam', 'Sabah Guten Morgen, gündüz Guten Tag, akşam Guten Abend. Yatmadan önce -n olmadan Gute Nacht.'],
					ro: ['Salutul după momentul zilei', 'Dimineața Guten Morgen, ziua Guten Tag, seara Guten Abend. Înainte de culcare Gute Nacht, fără -n.'],
					uz: ['Kun vaqtiga qarab salom', "Ertalab Guten Morgen, kunduzi Guten Tag, kechqurun Guten Abend. Uxlashdan oldin -n siz Gute Nacht."],
					hi: ['समय के अनुसार अभिवादन', 'सुबह Guten Morgen, दिन में Guten Tag, शाम को Guten Abend। सोने से पहले Gute Nacht, बिना -n।'],
					ar: ['التحية حسب الوقت', 'صباحاً Guten Morgen، نهاراً Guten Tag، مساءً Guten Abend. وقبل النوم Gute Nacht بدون -n.']
				},
				examples: [
					ex('Guten Abend! Ich heiße Julia.', { ru: 'Добрый вечер! Меня зовут Юлия.', uk: 'Добрий вечір! Мене звати Юлія.', en: 'Good evening! My name is Julia.', pl: 'Dobry wieczór! Mam na imię Julia.', es: '¡Buenas tardes! Me llamo Julia.', fr: 'Bonsoir ! Je m’appelle Julia.', tr: 'İyi akşamlar! Benim adım Julia.', ro: 'Bună seara! Mă numesc Julia.', uz: 'Xayrli kech! Mening ismim Yuliya.', hi: 'शुभ संध्या! मेरा नाम यूलिया है।', ar: 'مساء الخير! اسمي يوليا.' })
				]
			},
			{
				t: {
					ru: ['du или Sie', 'Другу и ребёнку говорим du. Взрослому незнакомцу говорим Sie.'],
					uk: ['du чи Sie', 'Другові й дитині кажемо du. Дорослому незнайомцю кажемо Sie.'],
					en: ['du or Sie', 'Use du with a friend or a child. Use Sie with an adult stranger.'],
					pl: ['du czy Sie', 'Do przyjaciela i dziecka mówimy du. Do dorosłego nieznajomego mówimy Sie.'],
					es: ['du o Sie', 'Con un amigo o un niño, du. Con un adulto desconocido, Sie.'],
					fr: ['du ou Sie', 'Avec un ami ou un enfant, du. Avec un adulte inconnu, Sie.'],
					tr: ['du mu, Sie mi', 'Arkadaşa ve çocuğa du. Tanımadığın yetişkine Sie.'],
					ro: ['du sau Sie', 'Unui prieten sau copil îi spui du. Unui adult necunoscut îi spui Sie.'],
					uz: ['du yoki Sie', "Do'st va bolaga du. Notanish kattaga Sie."],
					hi: ['du या Sie', 'दोस्त और बच्चे से du। अनजान बड़े व्यक्ति से Sie।'],
					ar: ['du أم Sie', 'للصديق والطفل نقول du. وللبالغ الغريب نقول Sie.']
				},
				examples: [
					ex('Wie geht es Ihnen, Frau Müller?', { ru: 'Как Ваши дела, госпожа Мюллер?', uk: 'Як Ваші справи, пані Мюллер?', en: 'How are you, Ms Müller?', pl: 'Jak się pani miewa, pani Müller?', es: '¿Cómo está, señora Müller?', fr: 'Comment allez-vous, Madame Müller ?', tr: 'Nasılsınız, Bayan Müller?', ro: 'Ce mai faceți, doamnă Müller?', uz: 'Qalaysiz, Müller xonim?', hi: 'आप कैसी हैं, श्रीमती म्यूलर?', ar: 'كيف حالك يا سيدة مولر؟' })
				]
			},
			{
				t: {
					ru: ['Откуда и где', 'aus значит «откуда», in значит «где».'],
					uk: ['Звідки і де', 'aus означає «звідки», in означає «де».'],
					en: ['From where and where', 'aus means "from", in means "in".'],
					pl: ['Skąd i gdzie', 'aus znaczy „skąd”, in znaczy „gdzie”.'],
					es: ['De dónde y dónde', 'aus significa "de dónde", in significa "dónde".'],
					fr: ['D’où et où', 'aus veut dire « d’où », in veut dire « où ».'],
					tr: ['Nereden ve nerede', 'aus "nereden", in "nerede" demektir.'],
					ro: ['De unde și unde', 'aus înseamnă „de unde”, in înseamnă „unde”.'],
					uz: ['Qayerdan va qayerda', 'aus "qayerdan", in "qayerda" degani.'],
					hi: ['कहाँ से और कहाँ', 'aus मतलब "कहाँ से", in मतलब "कहाँ"।'],
					ar: ['من أين وأين', 'aus تعني "من أين"، وin تعني "أين".']
				},
				examples: [
					ex('Ich komme aus der Türkei und wohne in Köln.', { ru: 'Я из Турции и живу в Кёльне.', uk: 'Я з Туреччини і живу в Кельні.', en: 'I’m from Turkey and live in Cologne.', pl: 'Jestem z Turcji i mieszkam w Kolonii.', es: 'Soy de Turquía y vivo en Colonia.', fr: 'Je viens de Turquie et j’habite à Cologne.', tr: 'Türkiyeliyim ve Köln’de yaşıyorum.', ro: 'Sunt din Turcia și locuiesc în Köln.', uz: 'Men Turkiyadanman va Kyolnda yashayman.', hi: 'मैं तुर्की से हूँ और कोलोन में रहता हूँ।', ar: 'أنا من تركيا وأسكن في كولونيا.' })
				]
			},
			{
				t: {
					ru: ['Числа и цены', 'От 21 до 99 сначала единицы, потом десятки: siebenundsechzig значит 67.'],
					uk: ['Числа і ціни', 'Від 21 до 99 спочатку одиниці, потім десятки: siebenundsechzig означає 67.'],
					en: ['Numbers and prices', 'From 21 to 99 the units come first, then the tens: siebenundsechzig means 67.'],
					pl: ['Liczby i ceny', 'Od 21 do 99 najpierw jedności, potem dziesiątki: siebenundsechzig to 67.'],
					es: ['Números y precios', 'Del 21 al 99 primero las unidades, luego las decenas: siebenundsechzig es 67.'],
					fr: ['Nombres et prix', 'De 21 à 99, d’abord les unités, puis les dizaines : siebenundsechzig, c’est 67.'],
					tr: ['Sayılar ve fiyatlar', '21’den 99’a önce birler, sonra onlar: siebenundsechzig 67 demektir.'],
					ro: ['Numere și prețuri', 'De la 21 la 99 întâi unitățile, apoi zecile: siebenundsechzig înseamnă 67.'],
					uz: ['Sonlar va narxlar', "21 dan 99 gacha avval birlik, keyin o'nlik: siebenundsechzig 67 degani."],
					hi: ['संख्याएँ और कीमतें', '21 से 99 तक पहले इकाई, फिर दहाई: siebenundsechzig मतलब 67।'],
					ar: ['الأعداد والأسعار', 'من 21 إلى 99 الآحاد أولاً ثم العشرات: siebenundsechzig تعني 67.']
				},
				examples: [
					ex('Das kostet siebenundsechzig Euro.', { ru: 'Это стоит шестьдесят семь евро.', uk: 'Це коштує шістдесят сім євро.', en: 'It costs sixty-seven euros.', pl: 'To kosztuje sześćdziesiąt siedem euro.', es: 'Cuesta sesenta y siete euros.', fr: 'Ça coûte soixante-sept euros.', tr: 'Altmış yedi euro.', ro: 'Costă șaizeci și șapte de euro.', uz: 'Bu oltmish yetti yevro turadi.', hi: 'यह सड़सठ यूरो का है।', ar: 'سعره سبعة وستون يورو.' })
				]
			},
			{
				t: {
					ru: ['Заказ в кафе', 'Вежливо заказываем через Ich möchte: «я бы хотел».'],
					uk: ['Замовлення в кафе', 'Ввічливо замовляємо через Ich möchte: «я б хотів».'],
					en: ['Ordering at a café', 'Order politely with Ich möchte: "I would like".'],
					pl: ['Zamówienie w kawiarni', 'Grzecznie zamawiamy przez Ich möchte: „chciałbym”.'],
					es: ['Pedir en el café', 'Se pide con cortesía con Ich möchte: "me gustaría".'],
					fr: ['Commander au café', 'On commande poliment avec Ich möchte : « je voudrais ».'],
					tr: ['Kafede sipariş', 'Kibarca Ich möchte ile sipariş verilir: "isterdim".'],
					ro: ['Comanda la cafenea', 'Comandăm politicos cu Ich möchte: „aș dori”.'],
					uz: ['Kafeda buyurtma', 'Hurmat bilan Ich möchte orqali buyurtma beriladi: "istardim".'],
					hi: ['कैफ़े में ऑर्डर', 'विनम्रता से Ich möchte से ऑर्डर करते हैं: "मैं चाहूँगा"।'],
					ar: ['الطلب في المقهى', 'نطلب بأدب بـ Ich möchte: "أودّ".']
				},
				examples: [
					ex('Ich möchte einen Tee mit Milch.', { ru: 'Я бы хотел чай с молоком.', uk: 'Я б хотів чай з молоком.', en: 'I’d like a tea with milk.', pl: 'Poproszę herbatę z mlekiem.', es: 'Quisiera un té con leche.', fr: 'Je voudrais un thé au lait.', tr: 'Sütlü bir çay rica ediyorum.', ro: 'Aș dori un ceai cu lapte.', uz: 'Menga sutli choy, iltimos.', hi: 'मुझे दूध वाली चाय चाहिए।', ar: 'أودّ شاياً بالحليب.' })
				]
			},
			{
				t: {
					ru: ['mein или meine', 'mein перед словом с der, meine перед словом с die.'],
					uk: ['mein чи meine', 'mein перед словом з der, meine перед словом з die.'],
					en: ['mein or meine', 'mein before a der word, meine before a die word.'],
					pl: ['mein czy meine', 'mein przed słowem z der, meine przed słowem z die.'],
					es: ['mein o meine', 'mein delante de una palabra con der, meine delante de una con die.'],
					fr: ['mein ou meine', 'mein devant un mot en der, meine devant un mot en die.'],
					tr: ['mein mi, meine mi', 'der’li kelimeden önce mein, die’li kelimeden önce meine.'],
					ro: ['mein sau meine', 'mein înaintea unui cuvânt cu der, meine înaintea unuia cu die.'],
					uz: ['mein yoki meine', "der li so'zdan oldin mein, die li so'zdan oldin meine."],
					hi: ['mein या meine', 'der वाले शब्द से पहले mein, die वाले शब्द से पहले meine।'],
					ar: ['mein أم meine', 'mein قبل الكلمة مع der، وmeine قبل الكلمة مع die.']
				},
				examples: [
					ex('Mein Bruder ist Kellner.', { ru: 'Мой брат официант.', uk: 'Мій брат офіціант.', en: 'My brother is a waiter.', pl: 'Mój brat jest kelnerem.', es: 'Mi hermano es camarero.', fr: 'Mon frère est serveur.', tr: 'Erkek kardeşim garson.', ro: 'Fratele meu este ospătar.', uz: 'Akam ofitsiant.', hi: 'मेरा भाई वेटर है।', ar: 'أخي نادل.' })
				]
			}
		]
	}
}

module.exports = quests
