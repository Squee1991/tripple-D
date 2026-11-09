// A1, beginner, земля 2 (после east-plain). Луг знакомств: личные местоимения, sein, haben, глаголы в настоящем времени.
// Основа всей грамматики A1: без неё дальше нельзя строить фразы. Слова только из «Восточной равнины» и новые из словаря квеста.
// learnCount 0: повторение вписано в задания 12-15 каждого квеста (прошлые квесты земли и «Восточная равнина»).
// порядок переводов: ru en uk pl es fr tr ro uz hi ar
module.exports = {
	id: 'meet-meadow',
	ns: 'meetMeadow',
	descKey: 'descriptionMeetMeadow',
	name: ['Луг знакомств', 'Meeting Meadow', 'Луг знайомств', 'Łąka Poznania', 'Prado de los Encuentros', 'Pré des Rencontres', 'Tanışma Çayırı', 'Pajiștea Cunoștințelor', 'Tanishuv o‘tloqi', 'मुलाक़ात का मैदान', 'مرج التعارف'],
	desc: [
		'Здесь ты учишься говорить о себе и других: ich, du, er, wir, глаголы sein и haben и как меняется глагол: ich wohne, du wohnst.',
		'Here you learn to talk about yourself and others: ich, du, er, wir, the verbs sein and haben, and how a verb changes: ich wohne, du wohnst.',
		'Тут ти вчишся говорити про себе й інших: ich, du, er, wir, дієслова sein і haben і як змінюється дієслово: ich wohne, du wohnst.',
		'Tutaj uczysz się mówić o sobie i innych: ich, du, er, wir, czasowniki sein i haben oraz jak zmienia się czasownik: ich wohne, du wohnst.',
		'Aquí aprendes a hablar de ti y de otros: ich, du, er, wir, los verbos sein y haben y cómo cambia el verbo: ich wohne, du wohnst.',
		'Ici, tu apprends à parler de toi et des autres : ich, du, er, wir, les verbes sein et haben et comment le verbe change : ich wohne, du wohnst.',
		'Burada kendinden ve başkalarından bahsetmeyi öğreniyorsun: ich, du, er, wir, sein ve haben fiilleri ve fiilin nasıl değiştiği: ich wohne, du wohnst.',
		'Aici înveți să vorbești despre tine și despre alții: ich, du, er, wir, verbele sein și haben și cum se schimbă verbul: ich wohne, du wohnst.',
		'Bu yerda o‘zing va boshqalar haqida gapirishni o‘rganasan: ich, du, er, wir, sein va haben fe’llari hamda fe’l qanday o‘zgarishi: ich wohne, du wohnst.',
		'यहाँ तुम अपने और दूसरों के बारे में बोलना सीखते हो: ich, du, er, wir, sein और haben क्रियाएँ और क्रिया कैसे बदलती है: ich wohne, du wohnst.',
		'هنا تتعلم أن تتكلم عن نفسك وعن الآخرين: ich و du و er و wir، والفعلين sein و haben، وكيف يتغير الفعل: ich wohne و du wohnst.'
	],
	intro: {
		p1: ['Кто? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Who? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Хто? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Kto? ich, du, er, sie, es, wir, ihr, sie, Sie', '¿Quién? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Qui ? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Kim? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Cine? ich, du, er, sie, es, wir, ihr, sie, Sie', 'Kim? ich, du, er, sie, es, wir, ihr, sie, Sie', 'कौन? ich, du, er, sie, es, wir, ihr, sie, Sie', 'من؟ ich و du و er و sie و es و wir و ihr و sie و Sie'],
		p2: ['Быть и иметь: ich bin, du bist, ich habe, du hast', 'To be and to have: ich bin, du bist, ich habe, du hast', 'Бути й мати: ich bin, du bist, ich habe, du hast', 'Być i mieć: ich bin, du bist, ich habe, du hast', 'Ser y tener: ich bin, du bist, ich habe, du hast', 'Être et avoir : ich bin, du bist, ich habe, du hast', 'Olmak ve sahip olmak: ich bin, du bist, ich habe, du hast', 'A fi și a avea: ich bin, du bist, ich habe, du hast', 'Bo‘lmoq va ega bo‘lmoq: ich bin, du bist, ich habe, du hast', 'होना और रखना: ich bin, du bist, ich habe, du hast', 'الكون والملك: ich bin و du bist و ich habe و du hast'],
		p3: ['Глагол меняет окончание: ich wohne, du wohnst, er wohnt', 'The verb changes its ending: ich wohne, du wohnst, er wohnt', 'Дієслово змінює закінчення: ich wohne, du wohnst, er wohnt', 'Czasownik zmienia końcówkę: ich wohne, du wohnst, er wohnt', 'El verbo cambia la terminación: ich wohne, du wohnst, er wohnt', 'Le verbe change de terminaison : ich wohne, du wohnst, er wohnt', 'Fiilin eki değişir: ich wohne, du wohnst, er wohnt', 'Verbul își schimbă terminația: ich wohne, du wohnst, er wohnt', 'Fe’lning qo‘shimchasi o‘zgaradi: ich wohne, du wohnst, er wohnt', 'क्रिया का अंत बदलता है: ich wohne, du wohnst, er wohnt', 'تتغير نهاية الفعل: ich wohne و du wohnst و er wohnt']
	},
	quests: [
		// 1. ich, du, Sie + sein
		{
			title: ['Я, ты и Вы', 'I, you and you (formal)', 'Я, ти і Ви', 'Ja, ty i Pan/Pani', 'Yo, tú y usted', 'Je, tu et vous', 'Ben, sen ve siz', 'Eu, tu și dumneavoastră', 'Men, sen va Siz', 'मैं, तुम और आप', 'أنا وأنت وحضرتك'],
			desc: [
				'Глагол sein (быть) в немецком нельзя пропускать: ich bin (я есть), du bist (ты есть), Sie sind (Вы есть). du говорят друзьям и детям, Sie (всегда с большой буквы) взрослым незнакомым людям. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'The verb sein (to be) is never left out in German: ich bin (I am), du bist (you are), Sie sind (you are, formal). Use du with friends and children, Sie (always capitalised) with adults you don’t know. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'Дієслово sein (бути) у німецькій не можна пропускати: ich bin (я є), du bist (ти є), Sie sind (Ви є). du кажуть друзям і дітям, Sie (завжди з великої літери) дорослим незнайомим людям. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'Czasownika sein (być) nie wolno pominąć: ich bin (jestem), du bist (jesteś), Sie sind (Pan/Pani jest). du mówimy do przyjaciół i dzieci, Sie (zawsze wielką literą) do obcych dorosłych. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'El verbo sein (ser, estar) nunca se omite en alemán: ich bin (soy), du bist (eres), Sie sind (usted es). du se usa con amigos y niños, Sie (siempre con mayúscula) con adultos desconocidos. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'Le verbe sein (être) ne disparaît jamais en allemand : ich bin (je suis), du bist (tu es), Sie sind (vous êtes). On dit du aux amis et aux enfants, Sie (toujours avec une majuscule) aux adultes inconnus. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'Almancada sein (olmak) fiili atlanmaz: ich bin (ben ...im), du bist (sen ...sin), Sie sind (siz ...siniz). du arkadaşlara ve çocuklara, Sie (her zaman büyük harfle) tanımadığın yetişkinlere söylenir. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'Verbul sein (a fi) nu se omite în germană: ich bin (eu sunt), du bist (tu ești), Sie sind (dumneavoastră sunteți). du se spune prietenilor și copiilor, Sie (mereu cu majusculă) adulților necunoscuți. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'Nemis tilida sein (bo‘lmoq) fe’li tushirib qoldirilmaydi: ich bin (men ...man), du bist (sen ...san), Sie sind (Siz ...siz). du do‘stlar va bolalarga, Sie (doim bosh harf bilan) notanish kattalarga aytiladi. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'जर्मन में sein (होना) क्रिया छोड़ी नहीं जाती: ich bin (मैं हूँ), du bist (तुम हो), Sie sind (आप हैं)। du दोस्तों और बच्चों से, Sie (हमेशा बड़े अक्षर से) अनजान बड़ों से कहते हैं। Ich bin Anna. Bist du Max? Sind Sie Herr Weber?',
				'لا يُحذف الفعل sein (يكون) في الألمانية أبدًا: ich bin (أنا) و du bist (أنت) و Sie sind (حضرتك). نقول du للأصدقاء والأطفال، و Sie (دائمًا بحرف كبير) للكبار الذين لا نعرفهم. Ich bin Anna. Bist du Max? Sind Sie Herr Weber?'
			],
			vocab: [
				['ich', 'я', 'I', 'я', 'ja', 'yo', 'je', 'ben', 'eu', 'men', 'मैं', 'أنا'],
				['du', 'ты', 'you', 'ти', 'ty', 'tú', 'tu', 'sen', 'tu', 'sen', 'तुम', 'أنت'],
				['Sie', 'Вы (вежливо)', 'you (formal)', 'Ви (ввічливо)', 'Pan/Pani', 'usted', 'vous (poli)', 'siz (resmî)', 'dumneavoastră', 'Siz (hurmat bilan)', 'आप', 'حضرتك'],
				['sein', 'быть', 'to be', 'бути', 'być', 'ser, estar', 'être', 'olmak', 'a fi', 'bo‘lmoq', 'होना', 'يكون'],
				['der Herr', 'господин', 'Mr, gentleman', 'пан', 'pan', 'el señor', 'monsieur', 'bay', 'domnul', 'janob', 'श्रीमान', 'السيد']
			],
			tasks: [
				['tr', ['Я Анна.', 'I am Anna.', 'Я Анна.', 'Jestem Anna.', 'Soy Anna.', 'Je suis Anna.', 'Ben Anna’yım.', 'Eu sunt Anna.', 'Men Annaman.', 'मैं अन्ना हूँ।', 'أنا آنا.'],
					['Ich bin Anna.', 'Ich ist Anna.', 'Ich bist Anna.'], 'Ich bin Anna.'],
				['gv', ['Ты Макс?', 'Are you Max?', 'Ти Макс?', 'Jesteś Max?', '¿Eres Max?', 'Tu es Max ?', 'Sen Max mısın?', 'Tu ești Max?', 'Sen Maxmisan?', 'क्या तुम मैक्स हो?', 'هل أنت ماكس؟'],
					'___ du Max?', 'Bist'],
				['gv', ['Вы господин Вебер?', 'Are you Mr Weber?', 'Ви пан Вебер?', 'Czy Pan jest panem Weberem?', '¿Es usted el señor Weber?', 'Vous êtes monsieur Weber ?', 'Siz Bay Weber misiniz?', 'Dumneavoastră sunteți domnul Weber?', 'Siz janob Webermisiz?', 'क्या आप श्रीमान वेबर हैं?', 'هل حضرتك السيد فيبر؟'],
					'___ Sie Herr Weber?', 'Sind'],
				['ok', ['Я учительница.', 'I am a teacher (f).', 'Я вчителька.', 'Jestem nauczycielką.', 'Soy profesora.', 'Je suis professeure.', 'Ben öğretmenim (kadın).', 'Eu sunt profesoară.', 'Men o‘qituvchiman (ayol).', 'मैं शिक्षिका हूँ।', 'أنا معلمة.'],
					['Ich bin Lehrerin.', 'Ich Lehrerin.', 'Ich bist Lehrerin.'], 'Ich bin Lehrerin.'],
				['ro', ['Ты студентка?', 'Are you a student?', 'Ти студентка?', 'Jesteś studentką?', '¿Eres estudiante?', 'Tu es étudiante ?', 'Sen öğrenci misin?', 'Ești studentă?', 'Sen talabamisan?', 'क्या तुम छात्रा हो?', 'هل أنتِ طالبة؟'],
					'Bist du Studentin', ['bin', 'ist']],
				['gv', ['Я из Германии', 'I am from Germany', 'Я з Німеччини', 'Jestem z Niemiec', 'Soy de Alemania', 'Je viens d’Allemagne', 'Ben Almanya’lıyım', 'Sunt din Germania', 'Men Germaniyadanman', 'मैं जर्मनी से हूँ', 'أنا من ألمانيا'],
					'Ich ___ aus Deutschland.', 'bin'],
				['tr', ['Вы из Австрии?', 'Are you from Austria?', 'Ви з Австрії?', 'Czy Pan jest z Austrii?', '¿Es usted de Austria?', 'Vous venez d’Autriche ?', 'Siz Avusturya’dan mısınız?', 'Sunteți din Austria?', 'Siz Avstriyadanmisiz?', 'क्या आप ऑस्ट्रिया से हैं?', 'هل حضرتك من النمسا؟'],
					['Sind Sie aus Österreich?', 'Bist Sie aus Österreich?', 'Seid Sie aus Österreich?'], 'Sind Sie aus Österreich?'],
				['gw', ['Привет! Я Тим. А ты?', 'Hi! I am Tim. And you?', 'Привіт! Я Тім. А ти?', 'Cześć! Jestem Tim. A ty?', '¡Hola! Soy Tim. ¿Y tú?', 'Salut ! Je suis Tim. Et toi ?', 'Merhaba! Ben Tim. Ya sen?', 'Salut! Eu sunt Tim. Și tu?', 'Salom! Men Timman. Sen-chi?', 'हाय! मैं टिम हूँ। और तुम?', 'مرحبًا! أنا تيم. وأنت؟'],
					'Hallo! Ich bin Tim. Und ___?', 'du'],
				['rd', ['Кем работает господин Шмидт?', 'What is Mr Schmidt’s job?', 'Ким працює пан Шмідт?', 'Kim jest z zawodu pan Schmidt?', '¿En qué trabaja el señor Schmidt?', 'Quel est le métier de monsieur Schmidt ?', 'Bay Schmidt ne iş yapıyor?', 'Ce meserie are domnul Schmidt?', 'Janob Shmidt kim bo‘lib ishlaydi?', 'श्रीमान श्मिट क्या काम करते हैं?', 'ما مهنة السيد شميت؟'],
					'Guten Tag! Ich bin Herr Schmidt. Ich bin Arzt. Und Sie? Sind Sie auch Arzt? Nein, ich bin Koch.', ['Arzt', 'Koch', 'Lehrer'], 'Arzt'],
				['ok', ['Ты очень милый.', 'You are very nice.', 'Ти дуже милий.', 'Jesteś bardzo miły.', 'Eres muy amable.', 'Tu es très gentil.', 'Çok naziksin.', 'Ești foarte drăguț.', 'Sen juda yoqimlisan.', 'तुम बहुत अच्छे हो।', 'أنت لطيف جدًا.'],
					['Du bist sehr nett.', 'Du bin sehr nett.', 'Du sind sehr nett.'], 'Du bist sehr nett.'],
				['ro', ['Меня зовут Пауль, я официант', 'My name is Paul, I am a waiter', 'Мене звати Пауль, я офіціант', 'Nazywam się Paul, jestem kelnerem', 'Me llamo Paul y soy camarero', 'Je m’appelle Paul, je suis serveur', 'Adım Paul, garsonum', 'Mă numesc Paul, sunt chelner', 'Mening ismim Paul, men ofitsiantman', 'मेरा नाम पॉल है, मैं वेटर हूँ', 'اسمي باول وأنا نادل'],
					'Ich heiße Paul und bin Kellner', ['bist', 'heißt']],
				// повторение: «Восточная равнина»
				['tr', ['Добрый вечер, господин Мюллер!', 'Good evening, Mr Müller!', 'Добрий вечір, пане Мюллер!', 'Dobry wieczór, panie Müller!', '¡Buenas noches, señor Müller!', 'Bonsoir, monsieur Müller !', 'İyi akşamlar, Bay Müller!', 'Bună seara, domnule Müller!', 'Xayrli kech, janob Myuller!', 'शुभ संध्या, श्रीमान म्यूलर!', 'مساء الخير يا سيد مولر!'],
					['Guten Abend, Herr Müller!', 'Gute Nacht, Herr Müller!', 'Guten Morgen, Herr Müller!'], 'Guten Abend, Herr Müller!'],
				['gw', ['Откуда ты?', 'Where are you from?', 'Звідки ти?', 'Skąd jesteś?', '¿De dónde eres?', 'D’où viens-tu ?', 'Nerelisin?', 'De unde ești?', 'Qayerdansan?', 'तुम कहाँ से हो?', 'من أين أنت؟'],
					'___ kommst du?', 'Woher'],
				['ok', ['До свидания, госпожа Беккер!', 'Goodbye, Mrs Becker!', 'До побачення, пані Беккер!', 'Do widzenia, pani Becker!', '¡Adiós, señora Becker!', 'Au revoir, madame Becker !', 'Hoşça kalın, Bayan Becker!', 'La revedere, doamna Becker!', 'Xayr, Bekker xonim!', 'अलविदा, श्रीमती बेकर!', 'إلى اللقاء يا سيدة بيكر!'],
					['Auf Wiedersehen, Frau Becker!', 'Auf Wiedersehen, Herr Becker!', 'Bis Wiedersehen, Frau Becker!'], 'Auf Wiedersehen, Frau Becker!'],
				['ro', ['Воду и кофе, пожалуйста', 'Water and a coffee, please', 'Воду й каву, будь ласка', 'Wodę i kawę poproszę', 'Agua y un café, por favor', 'De l’eau et un café, s’il vous plaît', 'Su ve bir kahve, lütfen', 'Apă și o cafea, vă rog', 'Suv va qahva, iltimos', 'पानी और एक कॉफ़ी, कृपया', 'ماء وقهوة من فضلك'],
					'Ein Wasser und einen Kaffee bitte', ['danke', 'kostet']]
			]
		},
		// 2. er, sie, es + ist
		{
			title: ['Он, она, оно', 'He, she, it', 'Він, вона, воно', 'On, ona, ono', 'Él, ella, ello', 'Il, elle', 'O (erkek, kadın, nesne)', 'El, ea', 'U (erkak, ayol, narsa)', 'वह (पुरुष, स्त्री, वस्तु)', 'هو، هي'],
			desc: [
				'Про третье лицо говорим er (он), sie (она), es (оно) и глагол ist: er ist, sie ist, es ist. Местоимение берёт род слова: der Vater → er, die Mutter → sie, das Kind → es. Поэтому и вещи бывают er или sie: Der Kaffee ist heiß, er ist gut.',
				'For a third person we say er (he), sie (she), es (it) and the verb ist: er ist, sie ist, es ist. The pronoun follows the gender of the noun: der Vater → er, die Mutter → sie, das Kind → es. So things can be er or sie too: Der Kaffee ist heiß, er ist gut.',
				'Про третю особу кажемо er (він), sie (вона), es (воно) і дієслово ist: er ist, sie ist, es ist. Займенник бере рід слова: der Vater → er, die Mutter → sie, das Kind → es. Тому й речі бувають er або sie: Der Kaffee ist heiß, er ist gut.',
				'O trzeciej osobie mówimy er (on), sie (ona), es (ono) i czasownik ist: er ist, sie ist, es ist. Zaimek bierze rodzaj rzeczownika: der Vater → er, die Mutter → sie, das Kind → es. Dlatego rzeczy też mogą być er albo sie: Der Kaffee ist heiß, er ist gut.',
				'Para la tercera persona decimos er (él), sie (ella), es (neutro) y el verbo ist: er ist, sie ist, es ist. El pronombre sigue el género del sustantivo: der Vater → er, die Mutter → sie, das Kind → es. Por eso las cosas también son er o sie: Der Kaffee ist heiß, er ist gut.',
				'Pour la troisième personne on dit er (il), sie (elle), es (neutre) et le verbe ist : er ist, sie ist, es ist. Le pronom suit le genre du nom : der Vater → er, die Mutter → sie, das Kind → es. Les objets aussi sont donc er ou sie : Der Kaffee ist heiß, er ist gut.',
				'Üçüncü kişi için er (o, eril), sie (o, dişil), es (o, nötr) ve ist fiili kullanılır: er ist, sie ist, es ist. Zamir ismin cinsine göre seçilir: der Vater → er, die Mutter → sie, das Kind → es. Bu yüzden eşyalar da er ya da sie olabilir: Der Kaffee ist heiß, er ist gut.',
				'Pentru persoana a treia spunem er (el), sie (ea), es (neutru) și verbul ist: er ist, sie ist, es ist. Pronumele urmează genul substantivului: der Vater → er, die Mutter → sie, das Kind → es. De aceea și lucrurile pot fi er sau sie: Der Kaffee ist heiß, er ist gut.',
				'Uchinchi shaxs uchun er (u, erkak), sie (u, ayol), es (u, o‘rta jins) va ist fe’li ishlatiladi: er ist, sie ist, es ist. Olmosh otning jinsiga qarab tanlanadi: der Vater → er, die Mutter → sie, das Kind → es. Shuning uchun narsalar ham er yoki sie bo‘ladi: Der Kaffee ist heiß, er ist gut.',
				'तीसरे व्यक्ति के लिए er (वह पुरुष), sie (वह स्त्री), es (नपुंसक) और क्रिया ist: er ist, sie ist, es ist। सर्वनाम संज्ञा के लिंग से चुना जाता है: der Vater → er, die Mutter → sie, das Kind → es। इसलिए चीज़ें भी er या sie होती हैं: Der Kaffee ist heiß, er ist gut.',
				'للغائب نقول er (هو) و sie (هي) و es (للمحايد) والفعل ist: er ist و sie ist و es ist. الضمير يتبع جنس الاسم: der Vater → er و die Mutter → sie و das Kind → es. لذلك الأشياء أيضًا تكون er أو sie: Der Kaffee ist heiß, er ist gut.'
			],
			vocab: [
				['er', 'он', 'he', 'він', 'on', 'él', 'il', 'o (eril)', 'el', 'u (erkak)', 'वह (पुरुष)', 'هو'],
				['sie', 'она', 'she', 'вона', 'ona', 'ella', 'elle', 'o (dişil)', 'ea', 'u (ayol)', 'वह (स्त्री)', 'هي'],
				['das Kind', 'ребёнок', 'child', 'дитина', 'dziecko', 'el niño', 'l’enfant', 'çocuk', 'copilul', 'bola', 'बच्चा', 'الطفل'],
				['heiß', 'горячий', 'hot', 'гарячий', 'gorący', 'caliente', 'chaud', 'sıcak', 'fierbinte', 'issiq', 'गरम', 'ساخن'],
				['nett', 'милый, приятный', 'nice', 'милий', 'miły', 'amable', 'gentil', 'nazik', 'drăguț', 'yoqimli', 'अच्छा, प्यारा', 'لطيف']
			],
			tasks: [
				['tr', ['Он врач.', 'He is a doctor.', 'Він лікар.', 'On jest lekarzem.', 'Él es médico.', 'Il est médecin.', 'O doktor.', 'El este medic.', 'U shifokor.', 'वह डॉक्टर है।', 'هو طبيب.'],
					['Er ist Arzt.', 'Er bist Arzt.', 'Er sind Arzt.'], 'Er ist Arzt.'],
				['gw', ['Это моя мама. Она очень милая', 'This is my mum. She is very nice', 'Це моя мама. Вона дуже мила', 'To moja mama. Jest bardzo miła', 'Es mi madre. Es muy amable', 'C’est ma mère. Elle est très gentille', 'Bu benim annem. Çok nazik', 'E mama mea. Este foarte drăguță', 'Bu mening onam. U juda yoqimli', 'यह मेरी माँ है। वह बहुत प्यारी है', 'هذه أمي. هي لطيفة جدًا'],
					'Das ist meine Mutter. ___ ist sehr nett.', 'Sie'],
				['gw', ['Ребёнку пять лет. Он (оно) очень милый', 'The child is five. It is very sweet', 'Дитині п’ять років. Вона дуже мила', 'Dziecko ma pięć lat. Jest bardzo miłe', 'El niño tiene cinco años. Es muy amable', 'L’enfant a cinq ans. Il est très gentil', 'Çocuk beş yaşında. Çok tatlı', 'Copilul are cinci ani. E foarte drăguț', 'Bola besh yoshda. U juda yoqimli', 'बच्चा पाँच साल का है। वह बहुत प्यारा है', 'الطفل عمره خمس سنوات. هو لطيف جدًا'],
					'Das Kind ist fünf. ___ ist sehr nett.', 'Es'],
				['gv', ['Мой брат учитель', 'My brother is a teacher', 'Мій брат учитель', 'Mój brat jest nauczycielem', 'Mi hermano es profesor', 'Mon frère est professeur', 'Erkek kardeşim öğretmen', 'Fratele meu e profesor', 'Akam o‘qituvchi', 'मेरा भाई शिक्षक है', 'أخي معلم'],
					'Mein Bruder ___ Lehrer.', 'ist'],
				['ok', ['Кофе горячий. Он хороший.', 'The coffee is hot. It is good.', 'Кава гаряча. Вона добра.', 'Kawa jest gorąca. Jest dobra.', 'El café está caliente. Está bueno.', 'Le café est chaud. Il est bon.', 'Kahve sıcak. Güzel.', 'Cafeaua e fierbinte. E bună.', 'Qahva issiq. U yaxshi.', 'कॉफ़ी गरम है। वह अच्छी है।', 'القهوة ساخنة. هي جيدة.'],
					['Der Kaffee ist heiß. Er ist gut.', 'Der Kaffee ist heiß. Sie ist gut.', 'Der Kaffee ist heiß. Er sind gut.'], 'Der Kaffee ist heiß. Er ist gut.'],
				['ro', ['Это Нина, она студентка', 'This is Nina, she is a student', 'Це Ніна, вона студентка', 'To Nina, jest studentką', 'Es Nina, es estudiante', 'C’est Nina, elle est étudiante', 'Bu Nina, o öğrenci', 'Ea e Nina, este studentă', 'Bu Nina, u talaba', 'यह नीना है, वह छात्रा है', 'هذه نينا وهي طالبة'],
					'Das ist Nina und sie ist Studentin', ['er', 'bist']],
				['tr', ['Чай горячий.', 'The tea is hot.', 'Чай гарячий.', 'Herbata jest gorąca.', 'El té está caliente.', 'Le thé est chaud.', 'Çay sıcak.', 'Ceaiul e fierbinte.', 'Choy issiq.', 'चाय गरम है।', 'الشاي ساخن.'],
					['Der Tee ist heiß.', 'Der Tee bist heiß.', 'Der Tee sind heiß.'], 'Der Tee ist heiß.'],
				['gw', ['Это кафе. Оно очень милое', 'This is the café. It is very nice', 'Це кафе. Воно дуже миле', 'To kawiarnia. Jest bardzo miła', 'Esta es la cafetería. Es muy agradable', 'C’est le café. Il est très sympa', 'Bu kafe. Çok hoş', 'Aceasta e cafeneaua. E foarte drăguță', 'Bu kafe. U juda yoqimli', 'यह कैफ़े है। यह बहुत अच्छा है', 'هذا هو المقهى. هو لطيف جدًا'],
					'Das ist das Café. ___ ist sehr nett.', 'Es'],
				['rd', ['Кто Лукас?', 'Who is Lukas?', 'Хто Лукас?', 'Kim jest Lukas?', '¿Quién es Lukas?', 'Qui est Lukas ?', 'Lukas kim?', 'Cine este Lukas?', 'Lukas kim?', 'लुकास कौन है?', 'من هو لوكاس؟'],
					'Das ist meine Familie. Das ist mein Vater, er ist Koch. Das ist Lukas, er ist mein Bruder. Er ist Student.', ['sein Bruder', 'sein Vater', 'ein Koch'], 'sein Bruder'],
				['ok', ['Вода горячая. Она не хорошая.', 'The water is hot. It is not good.', 'Вода гаряча. Вона не добра.', 'Woda jest gorąca. Nie jest dobra.', 'El agua está caliente. No está buena.', 'L’eau est chaude. Elle n’est pas bonne.', 'Su sıcak. İyi değil.', 'Apa e fierbinte. Nu e bună.', 'Suv issiq. U yaxshi emas.', 'पानी गरम है। वह अच्छा नहीं है।', 'الماء ساخن. ليس جيدًا.'],
					['Das Wasser ist heiß. Es ist nicht gut.', 'Das Wasser ist heiß. Er ist nicht gut.', 'Das Wasser ist heiß. Sie ist nicht gut.'], 'Das Wasser ist heiß. Es ist nicht gut.'],
				['gv', ['Моя сестра официантка', 'My sister is a waitress', 'Моя сестра офіціантка', 'Moja siostra jest kelnerką', 'Mi hermana es camarera', 'Ma sœur est serveuse', 'Kız kardeşim garson', 'Sora mea e chelneriță', 'Singlim ofitsiant', 'मेरी बहन वेट्रेस है', 'أختي نادلة'],
					'Meine Schwester ___ Kellnerin.', 'ist'],
				// повторение: квест 1
				['gv', ['Я из Берлина', 'I am from Berlin', 'Я з Берліна', 'Jestem z Berlina', 'Soy de Berlín', 'Je viens de Berlin', 'Ben Berlinliyim', 'Sunt din Berlin', 'Men Berlindanman', 'मैं बर्लिन से हूँ', 'أنا من برلين'],
					'Ich ___ aus Berlin.', 'bin'],
				['tr', ['Вы господин Кох?', 'Are you Mr Koch?', 'Ви пан Кох?', 'Czy Pan jest panem Kochem?', '¿Es usted el señor Koch?', 'Vous êtes monsieur Koch ?', 'Siz Bay Koch musunuz?', 'Sunteți domnul Koch?', 'Siz janob Koxmisiz?', 'क्या आप श्रीमान कोख हैं?', 'هل حضرتك السيد كوخ؟'],
					['Sind Sie Herr Koch?', 'Bist Sie Herr Koch?', 'Ist Sie Herr Koch?'], 'Sind Sie Herr Koch?'],
				// повторение: «Восточная равнина»
				['ro', ['Я хотел бы чай, пожалуйста', 'I would like a tea, please', 'Я хотів би чай, будь ласка', 'Poproszę herbatę', 'Quisiera un té, por favor', 'Je voudrais un thé, s’il vous plaît', 'Bir çay istiyorum, lütfen', 'Aș vrea un ceai, vă rog', 'Bir choy istardim, iltimos', 'मुझे एक चाय चाहिए, कृपया', 'أريد شايًا من فضلك'],
					'Ich möchte einen Tee bitte', ['kostet', 'ist']],
				['gw', ['Сколько стоит чай?', 'How much is the tea?', 'Скільки коштує чай?', 'Ile kosztuje herbata?', '¿Cuánto cuesta el té?', 'Combien coûte le thé ?', 'Çay ne kadar?', 'Cât costă ceaiul?', 'Choy qancha turadi?', 'चाय कितने की है?', 'بكم الشاي؟'],
					'Was ___ der Tee?', 'kostet']
			]
		},
		// 3. wir, ihr, sie (они) + sind / seid
		{
			title: ['Мы, вы, они', 'We, you (plural), they', 'Ми, ви, вони', 'My, wy, oni', 'Nosotros, vosotros, ellos', 'Nous, vous, ils', 'Biz, siz, onlar', 'Noi, voi, ei', 'Biz, sizlar, ular', 'हम, तुम सब, वे', 'نحن، أنتم، هم'],
			desc: [
				'Во множественном числе: wir sind (мы), ihr seid (вы, когда «ты» много), sie sind (они). sie (они) с маленькой буквы, Sie (Вы) с большой, но глагол у них один: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'In the plural: wir sind (we), ihr seid (you, several people you call du), sie sind (they). sie (they) is lower case, Sie (formal you) is capitalised, but they share the verb sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'У множині: wir sind (ми), ihr seid (ви, коли «ти» багато), sie sind (вони). sie (вони) з малої літери, Sie (Ви) з великої, але дієслово в них одне: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'W liczbie mnogiej: wir sind (my), ihr seid (wy, do kilku osób na „ty”), sie sind (oni). sie (oni) małą literą, Sie (Pan/Pani) wielką, ale czasownik mają ten sam: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'En plural: wir sind (nosotros), ihr seid (vosotros, varias personas de tú), sie sind (ellos). sie (ellos) va en minúscula, Sie (usted) en mayúscula, pero comparten el verbo sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'Au pluriel : wir sind (nous), ihr seid (vous, plusieurs personnes que l’on tutoie), sie sind (ils, elles). sie (ils) prend une minuscule, Sie (vous poli) une majuscule, mais le verbe est le même : sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'Çoğulda: wir sind (biz), ihr seid (siz, du dediğin birkaç kişi), sie sind (onlar). sie (onlar) küçük harfle, Sie (siz, resmî) büyük harfle yazılır ama fiilleri aynıdır: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'La plural: wir sind (noi), ihr seid (voi, mai multe persoane cu care vorbești la per tu), sie sind (ei). sie (ei) se scrie cu literă mică, Sie (dumneavoastră) cu majusculă, dar verbul e același: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'Ko‘plikda: wir sind (biz), ihr seid (sizlar, du deb murojaat qilinadigan bir necha kishi), sie sind (ular). sie (ular) kichik harf bilan, Sie (Siz) bosh harf bilan, lekin fe’li bir xil: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'बहुवचन में: wir sind (हम), ihr seid (तुम सब, जिन्हें du कहते हो), sie sind (वे)। sie (वे) छोटे अक्षर से, Sie (आप) बड़े अक्षर से, पर क्रिया एक ही है: sind। Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.',
				'في الجمع: wir sind (نحن) و ihr seid (أنتم، لعدة أشخاص نخاطبهم بـ du) و sie sind (هم). sie (هم) بحرف صغير و Sie (حضرتك) بحرف كبير، لكن الفعل واحد: sind. Wir sind Freunde. Seid ihr müde? Sie sind aus Wien.'
			],
			vocab: [
				['wir', 'мы', 'we', 'ми', 'my', 'nosotros', 'nous', 'biz', 'noi', 'biz', 'हम', 'نحن'],
				['ihr', 'вы (вы все)', 'you (plural)', 'ви (усі)', 'wy', 'vosotros', 'vous (pluriel)', 'siz (çoğul)', 'voi', 'sizlar', 'तुम सब', 'أنتم'],
				['die Freunde', 'друзья', 'friends', 'друзі', 'przyjaciele', 'los amigos', 'les amis', 'arkadaşlar', 'prietenii', 'do‘stlar', 'दोस्त', 'الأصدقاء'],
				['die Eltern', 'родители', 'parents', 'батьки', 'rodzice', 'los padres', 'les parents', 'anne baba', 'părinții', 'ota-ona', 'माता-पिता', 'الوالدان'],
				['müde', 'усталый', 'tired', 'втомлений', 'zmęczony', 'cansado', 'fatigué', 'yorgun', 'obosit', 'charchagan', 'थका हुआ', 'متعب']
			],
			tasks: [
				['tr', ['Мы друзья.', 'We are friends.', 'Ми друзі.', 'Jesteśmy przyjaciółmi.', 'Somos amigos.', 'Nous sommes amis.', 'Biz arkadaşız.', 'Suntem prieteni.', 'Biz do‘stmiz.', 'हम दोस्त हैं।', 'نحن أصدقاء.'],
					['Wir sind Freunde.', 'Wir seid Freunde.', 'Wir ist Freunde.'], 'Wir sind Freunde.'],
				['gv', ['Вы устали?', 'Are you (all) tired?', 'Ви втомилися?', 'Jesteście zmęczeni?', '¿Estáis cansados?', 'Vous êtes fatigués ?', 'Yorgun musunuz?', 'Sunteți obosiți?', 'Sizlar charchadingizmi?', 'क्या तुम सब थके हुए हो?', 'هل أنتم متعبون؟'],
					'___ ihr müde?', 'Seid'],
				['gv', ['Мои родители из Вены', 'My parents are from Vienna', 'Мої батьки з Відня', 'Moi rodzice są z Wiednia', 'Mis padres son de Viena', 'Mes parents viennent de Vienne', 'Annemle babam Viyanalı', 'Părinții mei sunt din Viena', 'Ota-onam Venadan', 'मेरे माता-पिता वियना से हैं', 'والداي من فيينا'],
					'Meine Eltern ___ aus Wien.', 'sind'],
				['ok', ['Они не в Берлине.', 'They are not in Berlin.', 'Вони не в Берліні.', 'Nie ma ich w Berlinie.', 'No están en Berlín.', 'Ils ne sont pas à Berlin.', 'Onlar Berlin’de değil.', 'Ei nu sunt în Berlin.', 'Ular Berlinda emas.', 'वे बर्लिन में नहीं हैं।', 'هم ليسوا في برلين.'],
					['Sie sind nicht in Berlin.', 'Sie seid nicht in Berlin.', 'Sie ist nicht in Berlin.'], 'Sie sind nicht in Berlin.'],
				['ro', ['Мы очень устали', 'We are very tired', 'Ми дуже втомилися', 'Jesteśmy bardzo zmęczeni', 'Estamos muy cansados', 'Nous sommes très fatigués', 'Çok yorgunuz', 'Suntem foarte obosiți', 'Biz juda charchadik', 'हम बहुत थके हुए हैं', 'نحن متعبون جدًا'],
					'Wir sind sehr müde', ['seid', 'bin']],
				['gw', ['Вы из Польши?', 'Are you (all) from Poland?', 'Ви з Польщі?', 'Jesteście z Polski?', '¿Sois de Polonia?', 'Vous venez de Pologne ?', 'Polonyalı mısınız?', 'Sunteți din Polonia?', 'Sizlar Polshadanmisizlar?', 'क्या तुम सब पोलैंड से हो?', 'هل أنتم من بولندا؟'],
					'Seid ___ aus Polen?', 'ihr'],
				['tr', ['Анна и Тим из Кёльна.', 'Anna and Tim are from Cologne.', 'Анна і Тім з Кельна.', 'Anna i Tim są z Kolonii.', 'Anna y Tim son de Colonia.', 'Anna et Tim viennent de Cologne.', 'Anna ve Tim Kölnlü.', 'Anna și Tim sunt din Köln.', 'Anna va Tim Kyolndan.', 'अन्ना और टिम कोलोन से हैं।', 'آنا وتيم من كولونيا.'],
					['Anna und Tim sind aus Köln.', 'Anna und Tim ist aus Köln.', 'Anna und Tim seid aus Köln.'], 'Anna und Tim sind aus Köln.'],
				['gv', ['Мы учителя', 'We are teachers', 'Ми вчителі', 'Jesteśmy nauczycielami', 'Somos profesores', 'Nous sommes professeurs', 'Biz öğretmeniz', 'Suntem profesori', 'Biz o‘qituvchimiz', 'हम शिक्षक हैं', 'نحن معلمون'],
					'Wir ___ Lehrer.', 'sind'],
				['rd', ['Откуда друзья Марии?', 'Where are Maria’s friends from?', 'Звідки друзі Марії?', 'Skąd są przyjaciele Marii?', '¿De dónde son los amigos de Maria?', 'D’où viennent les amis de Maria ?', 'Maria’nın arkadaşları nereli?', 'De unde sunt prietenii Mariei?', 'Mariyaning do‘stlari qayerdan?', 'मारिया के दोस्त कहाँ से हैं?', 'من أين أصدقاء ماريا؟'],
					'Ich bin Maria. Ich bin aus Spanien. Meine Freunde Paul und Lea sind aus Österreich. Wir sind jetzt in Berlin.', ['aus Österreich', 'aus Spanien', 'aus Berlin'], 'aus Österreich'],
				['ok', ['Вы мои друзья!', 'You are my friends!', 'Ви мої друзі!', 'Jesteście moimi przyjaciółmi!', '¡Sois mis amigos!', 'Vous êtes mes amis !', 'Siz benim arkadaşlarımsınız!', 'Voi sunteți prietenii mei!', 'Sizlar mening do‘stlarimsizlar!', 'तुम सब मेरे दोस्त हो!', 'أنتم أصدقائي!'],
					['Ihr seid meine Freunde!', 'Ihr sind meine Freunde!', 'Ihr bist meine Freunde!'], 'Ihr seid meine Freunde!'],
				['ro', ['Мои родители учителя', 'My parents are teachers', 'Мої батьки вчителі', 'Moi rodzice są nauczycielami', 'Mis padres son profesores', 'Mes parents sont professeurs', 'Annemle babam öğretmen', 'Părinții mei sunt profesori', 'Ota-onam o‘qituvchi', 'मेरे माता-पिता शिक्षक हैं', 'والداي معلمان'],
					'Meine Eltern sind Lehrer', ['ist', 'seid']],
				// повторение: квесты 1 и 2
				['gw', ['Он очень милый', 'He is very nice', 'Він дуже милий', 'On jest bardzo miły', 'Él es muy amable', 'Il est très gentil', 'O çok nazik', 'El e foarte drăguț', 'U juda yoqimli', 'वह बहुत अच्छा है', 'هو لطيف جدًا'],
					'___ ist sehr nett.', 'Er'],
				['gv', ['Ты повар?', 'Are you a cook?', 'Ти кухар?', 'Jesteś kucharzem?', '¿Eres cocinero?', 'Tu es cuisinier ?', 'Sen aşçı mısın?', 'Ești bucătar?', 'Sen oshpazmisan?', 'क्या तुम रसोइया हो?', 'هل أنت طباخ؟'],
					'___ du Koch?', 'Bist'],
				// повторение: «Восточная равнина»
				['tr', ['Это стоит тридцать евро.', 'That costs thirty euros.', 'Це коштує тридцять євро.', 'To kosztuje trzydzieści euro.', 'Cuesta treinta euros.', 'Ça coûte trente euros.', 'Bu otuz euro.', 'Costă treizeci de euro.', 'Bu o‘ttiz yevro turadi.', 'यह तीस यूरो का है।', 'هذا بثلاثين يورو.'],
					['Das kostet dreißig Euro.', 'Das kosten dreißig Euro.', 'Das kostet dreizehn Euro.'], 'Das kostet dreißig Euro.'],
				['ro', ['Пока, спокойной ночи', 'Bye, good night', 'Бувай, добраніч', 'Cześć, dobranoc', 'Adiós, buenas noches', 'Salut, bonne nuit', 'Hoşça kal, iyi geceler', 'Pa, noapte bună', 'Xayr, xayrli tun', 'बाय, शुभ रात्रि', 'إلى اللقاء، تصبح على خير'],
					'Tschüss gute Nacht', ['Guten', 'seid']]
			]
		},
		// 4. haben
		{
			title: ['У меня есть: haben', 'I have: haben', 'У мене є: haben', 'Mam: haben', 'Tengo: haben', 'J’ai : haben', 'Bende var: haben', 'Am: haben', 'Menda bor: haben', 'मेरे पास है: haben', 'عندي: haben'],
			desc: [
				'haben (иметь): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. В немецком так говорят и про чувства: Ich habe Hunger (я голоден), Hast du Durst? (хочешь пить?), Wir haben Zeit (у нас есть время).',
				'haben (to have): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. German also uses it for feelings: Ich habe Hunger (I am hungry), Hast du Durst? (are you thirsty?), Wir haben Zeit (we have time).',
				'haben (мати): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. У німецькій так кажуть і про відчуття: Ich habe Hunger (я голодний), Hast du Durst? (хочеш пити?), Wir haben Zeit (у нас є час).',
				'haben (mieć): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Po niemiecku tak mówi się też o odczuciach: Ich habe Hunger (jestem głodny), Hast du Durst? (chce ci się pić?), Wir haben Zeit (mamy czas).',
				'haben (tener): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. También se usa para sensaciones: Ich habe Hunger (tengo hambre), Hast du Durst? (¿tienes sed?), Wir haben Zeit (tenemos tiempo).',
				'haben (avoir) : ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. On l’utilise aussi pour les sensations : Ich habe Hunger (j’ai faim), Hast du Durst? (tu as soif ?), Wir haben Zeit (nous avons le temps).',
				'haben (sahip olmak): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Almancada duygular için de kullanılır: Ich habe Hunger (acıktım), Hast du Durst? (susadın mı?), Wir haben Zeit (vaktimiz var).',
				'haben (a avea): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Se folosește și pentru senzații: Ich habe Hunger (mi-e foame), Hast du Durst? (ți-e sete?), Wir haben Zeit (avem timp).',
				'haben (ega bo‘lmoq): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Nemis tilida his-tuyg‘ular uchun ham ishlatiladi: Ich habe Hunger (qornim och), Hast du Durst? (chanqadingmi?), Wir haben Zeit (vaqtimiz bor).',
				'haben (रखना, होना): ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben। जर्मन में भावनाओं के लिए भी: Ich habe Hunger (मुझे भूख है), Hast du Durst? (क्या तुम्हें प्यास है?), Wir haben Zeit (हमारे पास समय है)।',
				'haben (يملك): ich habe و du hast و er/sie/es hat و wir haben و ihr habt و sie/Sie haben. ويُستخدم أيضًا للإحساس: Ich habe Hunger (أنا جائع) و Hast du Durst? (هل أنت عطشان؟) و Wir haben Zeit (لدينا وقت).'
			],
			vocab: [
				['haben', 'иметь', 'to have', 'мати', 'mieć', 'tener', 'avoir', 'sahip olmak', 'a avea', 'ega bo‘lmoq', 'रखना, होना', 'يملك'],
				['der Hunger', 'голод', 'hunger', 'голод', 'głód', 'el hambre', 'la faim', 'açlık', 'foamea', 'ochlik', 'भूख', 'الجوع'],
				['der Durst', 'жажда', 'thirst', 'спрага', 'pragnienie', 'la sed', 'la soif', 'susuzluk', 'setea', 'chanqoq', 'प्यास', 'العطش'],
				['die Zeit', 'время', 'time', 'час', 'czas', 'el tiempo', 'le temps', 'zaman', 'timpul', 'vaqt', 'समय', 'الوقت'],
				['der Hund', 'собака', 'dog', 'собака', 'pies', 'el perro', 'le chien', 'köpek', 'câinele', 'it', 'कुत्ता', 'الكلب']
			],
			tasks: [
				['tr', ['Я голоден.', 'I am hungry.', 'Я голодний.', 'Jestem głodny.', 'Tengo hambre.', 'J’ai faim.', 'Acıktım.', 'Mi-e foame.', 'Qornim och.', 'मुझे भूख लगी है।', 'أنا جائع.'],
					['Ich habe Hunger.', 'Ich bin Hunger.', 'Ich hat Hunger.'], 'Ich habe Hunger.'],
				['gv', ['Ты хочешь пить?', 'Are you thirsty?', 'Ти хочеш пити?', 'Chce ci się pić?', '¿Tienes sed?', 'Tu as soif ?', 'Susadın mı?', 'Ți-e sete?', 'Chanqadingmi?', 'क्या तुम्हें प्यास लगी है?', 'هل أنت عطشان؟'],
					'___ du Durst?', 'Hast'],
				['gv', ['У Тима есть собака', 'Tim has a dog', 'У Тіма є собака', 'Tim ma psa', 'Tim tiene un perro', 'Tim a un chien', 'Tim’in bir köpeği var', 'Tim are un câine', 'Timning iti bor', 'टिम के पास एक कुत्ता है', 'لدى تيم كلب'],
					'Tim ___ einen Hund.', 'hat'],
				['ok', ['Сегодня у нас есть время.', 'Today we have time.', 'Сьогодні в нас є час.', 'Dzisiaj mamy czas.', 'Hoy tenemos tiempo.', 'Aujourd’hui, nous avons le temps.', 'Bugün vaktimiz var.', 'Azi avem timp.', 'Bugun vaqtimiz bor.', 'आज हमारे पास समय है।', 'اليوم لدينا وقت.'],
					['Heute haben wir Zeit.', 'Heute hat wir Zeit.', 'Heute habt wir Zeit.'], 'Heute haben wir Zeit.'],
				['ro', ['У вас есть время?', 'Do you (all) have time?', 'У вас є час?', 'Macie czas?', '¿Tenéis tiempo?', 'Vous avez le temps ?', 'Vaktiniz var mı?', 'Aveți timp?', 'Sizlarda vaqt bormi?', 'क्या तुम सबके पास समय है?', 'هل لديكم وقت؟'],
					'Habt ihr Zeit', ['hat', 'seid']],
				['gv', ['У меня есть брат и сестра', 'I have a brother and a sister', 'У мене є брат і сестра', 'Mam brata i siostrę', 'Tengo un hermano y una hermana', 'J’ai un frère et une sœur', 'Bir erkek ve bir kız kardeşim var', 'Am un frate și o soră', 'Mening akam va singlim bor', 'मेरे एक भाई और एक बहन है', 'عندي أخ وأخت'],
					'Ich ___ einen Bruder und eine Schwester.', 'habe'],
				['tr', ['Она хочет пить.', 'She is thirsty.', 'Вона хоче пити.', 'Chce jej się pić.', 'Ella tiene sed.', 'Elle a soif.', 'O susadı.', 'Îi e sete.', 'Uning chanqog‘i bor.', 'उसे प्यास लगी है।', 'هي عطشانة.'],
					['Sie hat Durst.', 'Sie ist Durst.', 'Sie habt Durst.'], 'Sie hat Durst.'],
				['gw', ['Ребёнок голоден', 'The child is hungry', 'Дитина голодна', 'Dziecko jest głodne', 'El niño tiene hambre', 'L’enfant a faim', 'Çocuk aç', 'Copilului îi e foame', 'Bolaning qorni och', 'बच्चे को भूख लगी है', 'الطفل جائع'],
					'Das Kind hat ___.', 'Hunger'],
				['rd', ['Что хочет Пауль?', 'What does Paul want?', 'Чого хоче Пауль?', 'Czego chce Paul?', '¿Qué quiere Paul?', 'Que veut Paul ?', 'Paul ne istiyor?', 'Ce vrea Paul?', 'Paul nima istaydi?', 'पॉल को क्या चाहिए?', 'ماذا يريد باول؟'],
					'Lea hat Hunger. Sie möchte einen Kaffee mit Milch. Paul hat Durst. Er möchte ein Wasser.', ['Wasser', 'Kaffee', 'Tee'], 'Wasser'],
				['ok', ['У Вас есть собака?', 'Do you have a dog?', 'У Вас є собака?', 'Czy ma Pan psa?', '¿Tiene usted un perro?', 'Vous avez un chien ?', 'Köpeğiniz var mı?', 'Aveți un câine?', 'Sizning itingiz bormi?', 'क्या आपके पास कुत्ता है?', 'هل عند حضرتك كلب؟'],
					['Haben Sie einen Hund?', 'Hat Sie einen Hund?', 'Hast Sie einen Hund?'], 'Haben Sie einen Hund?'],
				['ro', ['У моих родителей есть собака', 'My parents have a dog', 'У моїх батьків є собака', 'Moi rodzice mają psa', 'Mis padres tienen un perro', 'Mes parents ont un chien', 'Annemlerin bir köpeği var', 'Părinții mei au un câine', 'Ota-onamning iti bor', 'मेरे माता-पिता के पास एक कुत्ता है', 'لدى والديّ كلب'],
					'Meine Eltern haben einen Hund', ['hat', 'sind']],
				// повторение: квесты 2 и 3
				['gv', ['Мы друзья', 'We are friends', 'Ми друзі', 'Jesteśmy przyjaciółmi', 'Somos amigos', 'Nous sommes amis', 'Biz arkadaşız', 'Suntem prieteni', 'Biz do‘stmiz', 'हम दोस्त हैं', 'نحن أصدقاء'],
					'Wir ___ gute Freunde.', 'sind'],
				['gw', ['Где мама? Она в кафе', 'Where is mum? She is in the café', 'Де мама? Вона в кафе', 'Gdzie jest mama? Jest w kawiarni', '¿Dónde está mamá? Está en la cafetería', 'Où est maman ? Elle est au café', 'Annem nerede? Kafede', 'Unde e mama? E la cafenea', 'Onam qayerda? U kafeda', 'माँ कहाँ है? वह कैफ़े में है', 'أين أمي؟ هي في المقهى'],
					'Wo ist Mama? ___ ist im Café.', 'Sie'],
				// повторение: «Восточная равнина»
				['tr', ['Чай и воду, пожалуйста.', 'Tea and water, please.', 'Чай і воду, будь ласка.', 'Herbatę i wodę poproszę.', 'Té y agua, por favor.', 'Du thé et de l’eau, s’il vous plaît.', 'Çay ve su, lütfen.', 'Ceai și apă, vă rog.', 'Choy va suv, iltimos.', 'चाय और पानी, कृपया।', 'شاي وماء من فضلك.'],
					['Einen Tee und ein Wasser, bitte.', 'Ein Tee und einen Wasser, bitte.', 'Einen Tee und ein Wasser, danke bitte.'], 'Einen Tee und ein Wasser, bitte.'],
				['gw', ['Сколько стоит кофе?', 'How much is the coffee?', 'Скільки коштує кава?', 'Ile kosztuje kawa?', '¿Cuánto cuesta el café?', 'Combien coûte le café ?', 'Kahve ne kadar?', 'Cât costă cafeaua?', 'Qahva qancha turadi?', 'कॉफ़ी कितने की है?', 'بكم القهوة؟'],
					'___ kostet der Kaffee?', 'Was']
			]
		},
		// 5. глаголы: ich wohne, du wohnst, er wohnt
		{
			title: ['Я живу, ты живёшь', 'I live, you live', 'Я живу, ти живеш', 'Mieszkam, mieszkasz', 'Vivo, vives', 'J’habite, tu habites', 'Yaşıyorum, yaşıyorsun', 'Locuiesc, locuiești', 'Yashayman, yashaysan', 'मैं रहता हूँ, तुम रहते हो', 'أسكن، تسكن'],
			desc: [
				'У глагола есть основа и окончание: wohn-en. В настоящем времени: ich wohn-e, du wohn-st, er/sie/es wohn-t. Так же kommen, lernen, trinken: ich komme, du kommst, sie kommt. Глагол стоит на втором месте: Ich lerne Deutsch. Woher kommst du?',
				'A verb has a stem and an ending: wohn-en. In the present: ich wohn-e, du wohn-st, er/sie/es wohn-t. The same with kommen, lernen, trinken: ich komme, du kommst, sie kommt. The verb is in second place: Ich lerne Deutsch. Woher kommst du?',
				'Дієслово має основу й закінчення: wohn-en. У теперішньому часі: ich wohn-e, du wohn-st, er/sie/es wohn-t. Так само kommen, lernen, trinken: ich komme, du kommst, sie kommt. Дієслово стоїть на другому місці: Ich lerne Deutsch. Woher kommst du?',
				'Czasownik ma temat i końcówkę: wohn-en. W czasie teraźniejszym: ich wohn-e, du wohn-st, er/sie/es wohn-t. Tak samo kommen, lernen, trinken: ich komme, du kommst, sie kommt. Czasownik stoi na drugim miejscu: Ich lerne Deutsch. Woher kommst du?',
				'El verbo tiene raíz y terminación: wohn-en. En presente: ich wohn-e, du wohn-st, er/sie/es wohn-t. Igual kommen, lernen, trinken: ich komme, du kommst, sie kommt. El verbo va en segunda posición: Ich lerne Deutsch. Woher kommst du?',
				'Le verbe a un radical et une terminaison : wohn-en. Au présent : ich wohn-e, du wohn-st, er/sie/es wohn-t. Pareil pour kommen, lernen, trinken : ich komme, du kommst, sie kommt. Le verbe est en deuxième position : Ich lerne Deutsch. Woher kommst du?',
				'Fiilin bir kökü ve bir eki vardır: wohn-en. Şimdiki zamanda: ich wohn-e, du wohn-st, er/sie/es wohn-t. kommen, lernen, trinken de aynı: ich komme, du kommst, sie kommt. Fiil ikinci sıradadır: Ich lerne Deutsch. Woher kommst du?',
				'Verbul are o rădăcină și o terminație: wohn-en. La prezent: ich wohn-e, du wohn-st, er/sie/es wohn-t. La fel kommen, lernen, trinken: ich komme, du kommst, sie kommt. Verbul stă pe locul doi: Ich lerne Deutsch. Woher kommst du?',
				'Fe’lning o‘zagi va qo‘shimchasi bor: wohn-en. Hozirgi zamonda: ich wohn-e, du wohn-st, er/sie/es wohn-t. kommen, lernen, trinken ham shunday: ich komme, du kommst, sie kommt. Fe’l ikkinchi o‘rinda turadi: Ich lerne Deutsch. Woher kommst du?',
				'क्रिया में मूल और अंत होता है: wohn-en। वर्तमान काल में: ich wohn-e, du wohn-st, er/sie/es wohn-t। kommen, lernen, trinken भी ऐसे ही: ich komme, du kommst, sie kommt। क्रिया दूसरे स्थान पर आती है: Ich lerne Deutsch. Woher kommst du?',
				'للفعل جذر ونهاية: wohn-en. في المضارع: ich wohn-e و du wohn-st و er/sie/es wohn-t. وكذلك kommen و lernen و trinken: ich komme و du kommst و sie kommt. يأتي الفعل في المكان الثاني: Ich lerne Deutsch. Woher kommst du?'
			],
			vocab: [
				['wohnen', 'жить (где-то)', 'to live (somewhere)', 'жити (десь)', 'mieszkać', 'vivir (en un lugar)', 'habiter', 'oturmak, yaşamak', 'a locui', 'yashamoq', 'रहना', 'يسكن'],
				['kommen', 'приходить, быть родом', 'to come', 'приходити, бути родом', 'przychodzić, pochodzić', 'venir', 'venir', 'gelmek', 'a veni', 'kelmoq', 'आना', 'يأتي'],
				['lernen', 'учить', 'to learn', 'вчити', 'uczyć się', 'aprender', 'apprendre', 'öğrenmek', 'a învăța', 'o‘rganmoq', 'सीखना', 'يتعلم'],
				['Deutsch', 'немецкий язык', 'German', 'німецька мова', 'niemiecki', 'el alemán', 'l’allemand', 'Almanca', 'germana', 'nemis tili', 'जर्मन भाषा', 'الألمانية'],
				['die Stadt', 'город', 'city, town', 'місто', 'miasto', 'la ciudad', 'la ville', 'şehir', 'orașul', 'shahar', 'शहर', 'المدينة']
			],
			tasks: [
				['tr', ['Я живу в Дрездене.', 'I live in Dresden.', 'Я живу в Дрездені.', 'Mieszkam w Dreźnie.', 'Vivo en Dresde.', 'J’habite à Dresde.', 'Dresden’de yaşıyorum.', 'Locuiesc în Dresda.', 'Men Drezdenda yashayman.', 'मैं ड्रेसडेन में रहता हूँ।', 'أسكن في دريسدن.'],
					['Ich wohne in Dresden.', 'Ich wohnst in Dresden.', 'Ich wohnt in Dresden.'], 'Ich wohne in Dresden.'],
				['gv', ['Где ты живёшь?', 'Where do you live?', 'Де ти живеш?', 'Gdzie mieszkasz?', '¿Dónde vives?', 'Où habites-tu ?', 'Nerede yaşıyorsun?', 'Unde locuiești?', 'Qayerda yashaysan?', 'तुम कहाँ रहते हो?', 'أين تسكن؟'],
					'Wo ___ du?', 'wohnst'],
				['gv', ['Она учит немецкий', 'She is learning German', 'Вона вчить німецьку', 'Ona uczy się niemieckiego', 'Ella aprende alemán', 'Elle apprend l’allemand', 'O Almanca öğreniyor', 'Ea învață germana', 'U nemis tilini o‘rganyapti', 'वह जर्मन सीख रही है', 'هي تتعلم الألمانية'],
					'Sie ___ Deutsch.', 'lernt'],
				['ok', ['Он из Испании.', 'He comes from Spain.', 'Він з Іспанії.', 'On pochodzi z Hiszpanii.', 'Él viene de España.', 'Il vient d’Espagne.', 'O İspanya’dan geliyor.', 'El vine din Spania.', 'U Ispaniyadan.', 'वह स्पेन से आता है।', 'هو من إسبانيا.'],
					['Er kommt aus Spanien.', 'Er kommst aus Spanien.', 'Er komme aus Spanien.'], 'Er kommt aus Spanien.'],
				['ro', ['Я учу немецкий в Вене', 'I am learning German in Vienna', 'Я вчу німецьку у Відні', 'Uczę się niemieckiego w Wiedniu', 'Aprendo alemán en Viena', 'J’apprends l’allemand à Vienne', 'Viyana’da Almanca öğreniyorum', 'Învăț germana la Viena', 'Men Venada nemis tilini o‘rganaman', 'मैं वियना में जर्मन सीखता हूँ', 'أتعلم الألمانية في فيينا'],
					'Ich lerne Deutsch in Wien', ['lernst', 'bin']],
				['gv', ['Что ты пьёшь?', 'What are you drinking?', 'Що ти п’єш?', 'Co pijesz?', '¿Qué bebes?', 'Qu’est-ce que tu bois ?', 'Ne içiyorsun?', 'Ce bei?', 'Nima ichyapsan?', 'तुम क्या पी रहे हो?', 'ماذا تشرب؟'],
					'Was ___ du?', 'trinkst'],
				['tr', ['Мой папа живёт в Гамбурге.', 'My father lives in Hamburg.', 'Мій тато живе в Гамбурзі.', 'Mój tata mieszka w Hamburgu.', 'Mi padre vive en Hamburgo.', 'Mon père habite à Hambourg.', 'Babam Hamburg’da oturuyor.', 'Tatăl meu locuiește în Hamburg.', 'Otam Gamburgda yashaydi.', 'मेरे पिता हैम्बर्ग में रहते हैं।', 'يسكن أبي في هامبورغ.'],
					['Mein Vater wohnt in Hamburg.', 'Mein Vater wohne in Hamburg.', 'Mein Vater wohnst in Hamburg.'], 'Mein Vater wohnt in Hamburg.'],
				['gw', ['Откуда Вы родом?', 'Where are you from?', 'Звідки Ви родом?', 'Skąd Pan pochodzi?', '¿De dónde es usted?', 'D’où venez-vous ?', 'Nerelisiniz?', 'De unde veniți?', 'Siz qayerdansiz?', 'आप कहाँ से हैं?', 'من أين حضرتك؟'],
					'Woher ___ Sie?', 'kommen'],
				['rd', ['Что делает Ана в Мюнхене?', 'What is Ana doing in Munich?', 'Що робить Ана в Мюнхені?', 'Co robi Ana w Monachium?', '¿Qué hace Ana en Múnich?', 'Que fait Ana à Munich ?', 'Ana Münih’te ne yapıyor?', 'Ce face Ana la München?', 'Ana Myunxenda nima qilyapti?', 'अना म्यूनिख में क्या करती है?', 'ماذا تفعل آنا في ميونخ؟'],
					'Ana kommt aus Spanien. Sie wohnt jetzt in München. Sie lernt Deutsch und trinkt Kaffee.', ['Sie lernt Deutsch.', 'Sie wohnt in Spanien.', 'Sie arbeitet als Koch.'], 'Sie lernt Deutsch.'],
				['ok', ['Ты тоже учишь немецкий?', 'Are you learning German too?', 'Ти теж учиш німецьку?', 'Ty też uczysz się niemieckiego?', '¿Tú también aprendes alemán?', 'Tu apprends l’allemand aussi ?', 'Sen de Almanca öğreniyor musun?', 'Și tu înveți germana?', 'Sen ham nemis tilini o‘rganyapsanmi?', 'क्या तुम भी जर्मन सीख रहे हो?', 'هل تتعلم الألمانية أيضًا؟'],
					['Lernst du auch Deutsch?', 'Lernt du auch Deutsch?', 'Lerne du auch Deutsch?'], 'Lernst du auch Deutsch?'],
				['ro', ['Моя сестра пьёт чай', 'My sister drinks tea', 'Моя сестра п’є чай', 'Moja siostra pije herbatę', 'Mi hermana bebe té', 'Ma sœur boit du thé', 'Kız kardeşim çay içiyor', 'Sora mea bea ceai', 'Singlim choy ichadi', 'मेरी बहन चाय पीती है', 'أختي تشرب الشاي'],
					'Meine Schwester trinkt Tee', ['trinke', 'ist']],
				// повторение: квесты 3 и 4
				['gv', ['У тебя есть время?', 'Do you have time?', 'У тебе є час?', 'Masz czas?', '¿Tienes tiempo?', 'Tu as le temps ?', 'Vaktin var mı?', 'Ai timp?', 'Vaqting bormi?', 'क्या तुम्हारे पास समय है?', 'هل لديك وقت؟'],
					'___ du heute Zeit?', 'Hast'],
				['tr', ['Вы из Кёльна?', 'Are you (all) from Cologne?', 'Ви з Кельна?', 'Jesteście z Kolonii?', '¿Sois de Colonia?', 'Vous êtes de Cologne ?', 'Kölnlü müsünüz?', 'Sunteți din Köln?', 'Sizlar Kyolndanmisizlar?', 'क्या तुम सब कोलोन से हो?', 'هل أنتم من كولونيا؟'],
					['Seid ihr aus Köln?', 'Sind ihr aus Köln?', 'Bist ihr aus Köln?'], 'Seid ihr aus Köln?'],
				// повторение: «Восточная равнина»
				['ro', ['Молоко стоит один евро', 'The milk costs one euro', 'Молоко коштує один євро', 'Mleko kosztuje jedno euro', 'La leche cuesta un euro', 'Le lait coûte un euro', 'Süt bir euro', 'Laptele costă un euro', 'Sut bir yevro turadi', 'दूध एक यूरो का है', 'الحليب بيورو واحد'],
					'Die Milch kostet einen Euro', ['kostest', 'ist']],
				['gw', ['Я бы хотел кофе, пожалуйста', 'I would like a coffee, please', 'Я б хотів каву, будь ласка', 'Poproszę kawę', 'Quisiera un café, por favor', 'Je voudrais un café, s’il vous plaît', 'Bir kahve istiyorum, lütfen', 'Aș vrea o cafea, vă rog', 'Bir qahva istardim, iltimos', 'मुझे एक कॉफ़ी चाहिए, कृपया', 'أريد قهوة من فضلك'],
					'Ich möchte einen ___, bitte.', 'Kaffee']
			]
		},
		// 6. wir wohnen, ihr wohnt + arbeiten, heißen
		{
			title: ['Мы живём, вы живёте', 'We live, you live', 'Ми живемо, ви живете', 'Mieszkamy, mieszkacie', 'Vivimos, vivís', 'Nous habitons, vous habitez', 'Yaşıyoruz, yaşıyorsunuz', 'Locuim, locuiți', 'Yashaymiz, yashaysizlar', 'हम रहते हैं, तुम सब रहते हो', 'نسكن، تسكنون'],
			desc: [
				'Множественное число: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Если основа кончается на -t, добавляем -e-: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. Если на -s, -ß, -z, у du только -t: du heißt, du tanzt.',
				'Plural: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. If the stem ends in -t, add -e-: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. If it ends in -s, -ß, -z, du only adds -t: du heißt, du tanzt.',
				'Множина: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Якщо основа закінчується на -t, додаємо -e-: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. Якщо на -s, -ß, -z, у du тільки -t: du heißt, du tanzt.',
				'Liczba mnoga: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Gdy temat kończy się na -t, dodajemy -e-: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. Gdy na -s, -ß, -z, przy du tylko -t: du heißt, du tanzt.',
				'Plural: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Si la raíz termina en -t, se añade -e-: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. Si termina en -s, -ß, -z, du solo lleva -t: du heißt, du tanzt.',
				'Pluriel : wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Si le radical finit par -t, on ajoute -e- : du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. S’il finit par -s, -ß, -z, du prend seulement -t : du heißt, du tanzt.',
				'Çoğul: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Kök -t ile bitiyorsa -e- eklenir: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. -s, -ß, -z ile bitiyorsa du sadece -t alır: du heißt, du tanzt.',
				'Plural: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. Dacă rădăcina se termină în -t, adăugăm -e-: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. Dacă se termină în -s, -ß, -z, la du doar -t: du heißt, du tanzt.',
				'Ko‘plik: wir wohn-en, ihr wohn-t, sie/Sie wohn-en. O‘zak -t bilan tugasa, -e- qo‘shiladi: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t. -s, -ß, -z bilan tugasa, du faqat -t oladi: du heißt, du tanzt.',
				'बहुवचन: wir wohn-en, ihr wohn-t, sie/Sie wohn-en। अगर मूल -t पर ख़त्म हो तो -e- जोड़ते हैं: du arbeit-e-st, er arbeit-e-t, ihr arbeit-e-t। अगर -s, -ß, -z पर ख़त्म हो तो du के साथ सिर्फ़ -t: du heißt, du tanzt।',
				'الجمع: wir wohn-en و ihr wohn-t و sie/Sie wohn-en. إذا انتهى الجذر بـ -t نضيف -e-: du arbeit-e-st و er arbeit-e-t و ihr arbeit-e-t. وإذا انتهى بـ -s أو -ß أو -z فمع du نضيف -t فقط: du heißt و du tanzt.'
			],
			vocab: [
				['arbeiten', 'работать', 'to work', 'працювати', 'pracować', 'trabajar', 'travailler', 'çalışmak', 'a lucra', 'ishlamoq', 'काम करना', 'يعمل'],
				['spielen', 'играть', 'to play', 'грати', 'grać', 'jugar', 'jouer', 'oynamak', 'a juca', 'o‘ynamoq', 'खेलना', 'يلعب'],
				['tanzen', 'танцевать', 'to dance', 'танцювати', 'tańczyć', 'bailar', 'danser', 'dans etmek', 'a dansa', 'raqsga tushmoq', 'नाचना', 'يرقص'],
				['der Fußball', 'футбол', 'football', 'футбол', 'piłka nożna', 'el fútbol', 'le football', 'futbol', 'fotbalul', 'futbol', 'फ़ुटबॉल', 'كرة القدم'],
				['heute', 'сегодня', 'today', 'сьогодні', 'dzisiaj', 'hoy', 'aujourd’hui', 'bugün', 'azi', 'bugun', 'आज', 'اليوم']
			],
			tasks: [
				['tr', ['Мы живём в Гамбурге.', 'We live in Hamburg.', 'Ми живемо в Гамбурзі.', 'Mieszkamy w Hamburgu.', 'Vivimos en Hamburgo.', 'Nous habitons à Hambourg.', 'Hamburg’da yaşıyoruz.', 'Locuim în Hamburg.', 'Biz Gamburgda yashaymiz.', 'हम हैम्बर्ग में रहते हैं।', 'نسكن في هامبورغ.'],
					['Wir wohnen in Hamburg.', 'Wir wohnt in Hamburg.', 'Wir wohnst in Hamburg.'], 'Wir wohnen in Hamburg.'],
				['gv', ['Вы сегодня работаете?', 'Are you (all) working today?', 'Ви сьогодні працюєте?', 'Pracujecie dzisiaj?', '¿Trabajáis hoy?', 'Vous travaillez aujourd’hui ?', 'Bugün çalışıyor musunuz?', 'Lucrați azi?', 'Sizlar bugun ishlaysizlarmi?', 'क्या तुम सब आज काम कर रहे हो?', 'هل تعملون اليوم؟'],
					'___ ihr heute?', 'Arbeitet'],
				['gv', ['Ты работаешь в кафе?', 'Do you work in a café?', 'Ти працюєш у кафе?', 'Pracujesz w kawiarni?', '¿Trabajas en una cafetería?', 'Tu travailles au café ?', 'Kafede mi çalışıyorsun?', 'Lucrezi la cafenea?', 'Sen kafeda ishlaysanmi?', 'क्या तुम कैफ़े में काम करते हो?', 'هل تعمل في المقهى؟'],
					'___ du im Café?', 'Arbeitest'],
				['ok', ['Тебя зовут Лена?', 'Is your name Lena?', 'Тебе звати Лена?', 'Masz na imię Lena?', '¿Te llamas Lena?', 'Tu t’appelles Lena ?', 'Adın Lena mı?', 'Te cheamă Lena?', 'Isming Lenami?', 'क्या तुम्हारा नाम लेना है?', 'هل اسمك لينا؟'],
					['Heißt du Lena?', 'Heißst du Lena?', 'Heißen du Lena?'], 'Heißt du Lena?'],
				['ro', ['Дети играют в футбол', 'The children play football', 'Діти грають у футбол', 'Dzieci grają w piłkę', 'Los niños juegan al fútbol', 'Les enfants jouent au football', 'Çocuklar futbol oynuyor', 'Copiii joacă fotbal', 'Bolalar futbol o‘ynaydi', 'बच्चे फ़ुटबॉल खेलते हैं', 'الأطفال يلعبون كرة القدم'],
					'Die Kinder spielen Fußball', ['spielt', 'sind']],
				['gv', ['Он работает официантом', 'He works as a waiter', 'Він працює офіціантом', 'On pracuje jako kelner', 'Él trabaja de camarero', 'Il travaille comme serveur', 'O garson olarak çalışıyor', 'El lucrează ca chelner', 'U ofitsiant bo‘lib ishlaydi', 'वह वेटर का काम करता है', 'هو يعمل نادلًا'],
					'Er ___ als Kellner.', 'arbeitet'],
				['tr', ['Ты хорошо танцуешь!', 'You dance well!', 'Ти добре танцюєш!', 'Dobrze tańczysz!', '¡Bailas bien!', 'Tu danses bien !', 'İyi dans ediyorsun!', 'Dansezi bine!', 'Sen yaxshi raqsga tushasan!', 'तुम अच्छा नाचते हो!', 'أنت ترقص جيدًا!'],
					['Du tanzt gut!', 'Du tanzst gut!', 'Du tanzen gut!'], 'Du tanzt gut!'],
				['gw', ['Сегодня мы играем в футбол', 'Today we are playing football', 'Сьогодні ми граємо у футбол', 'Dzisiaj gramy w piłkę', 'Hoy jugamos al fútbol', 'Aujourd’hui, nous jouons au football', 'Bugün futbol oynuyoruz', 'Azi jucăm fotbal', 'Bugun biz futbol o‘ynaymiz', 'आज हम फ़ुटबॉल खेल रहे हैं', 'اليوم نلعب كرة القدم'],
					'Heute ___ wir Fußball.', 'spielen'],
				['rd', ['Где работают Лиза и Бен?', 'Where do Lisa and Ben work?', 'Де працюють Ліза і Бен?', 'Gdzie pracują Lisa i Ben?', '¿Dónde trabajan Lisa y Ben?', 'Où travaillent Lisa et Ben ?', 'Lisa ve Ben nerede çalışıyor?', 'Unde lucrează Lisa și Ben?', 'Liza va Ben qayerda ishlaydi?', 'लीसा और बेन कहाँ काम करते हैं?', 'أين تعمل ليزا وبن؟'],
					'Das sind Lisa und Ben. Sie wohnen in Köln. Sie arbeiten im Café. Heute spielen sie Fußball.', ['im Café', 'in Köln', 'in Berlin'], 'im Café'],
				['ok', ['Вы танцуете?', 'Do you dance?', 'Ви танцюєте?', 'Czy Pan tańczy?', '¿Usted baila?', 'Vous dansez ?', 'Dans ediyor musunuz?', 'Dansați?', 'Siz raqsga tushasizmi?', 'क्या आप नाचते हैं?', 'هل ترقص حضرتك؟'],
					['Tanzen Sie?', 'Tanzt Sie?', 'Tanzest Sie?'], 'Tanzen Sie?'],
				['ro', ['Вы работаете в Берлине', 'You (all) work in Berlin', 'Ви працюєте в Берліні', 'Pracujecie w Berlinie', 'Trabajáis en Berlín', 'Vous travaillez à Berlin', 'Berlin’de çalışıyorsunuz', 'Lucrați în Berlin', 'Sizlar Berlinda ishlaysizlar', 'तुम सब बर्लिन में काम करते हो', 'أنتم تعملون في برلين'],
					'Ihr arbeitet in Berlin', ['arbeitest', 'seid']],
				// повторение: квесты 4 и 5
				['gv', ['Мой брат живёт в Вене', 'My brother lives in Vienna', 'Мій брат живе у Відні', 'Mój brat mieszka w Wiedniu', 'Mi hermano vive en Viena', 'Mon frère habite à Vienne', 'Erkek kardeşim Viyana’da yaşıyor', 'Fratele meu locuiește la Viena', 'Akam Venada yashaydi', 'मेरा भाई वियना में रहता है', 'يسكن أخي في فيينا'],
					'Mein Bruder ___ in Wien.', 'wohnt'],
				['tr', ['У ребёнка есть собака.', 'The child has a dog.', 'У дитини є собака.', 'Dziecko ma psa.', 'El niño tiene un perro.', 'L’enfant a un chien.', 'Çocuğun bir köpeği var.', 'Copilul are un câine.', 'Bolaning iti bor.', 'बच्चे के पास एक कुत्ता है।', 'لدى الطفل كلب.'],
					['Das Kind hat einen Hund.', 'Das Kind habt einen Hund.', 'Das Kind ist einen Hund.'], 'Das Kind hat einen Hund.'],
				// повторение: «Восточная равнина»
				['ro', ['Мой папа пьёт чай', 'My dad drinks tea', 'Мій тато п’є чай', 'Mój tata pije herbatę', 'Mi padre bebe té', 'Mon père boit du thé', 'Babam çay içiyor', 'Tata bea ceai', 'Dadam choy ichadi', 'मेरे पापा चाय पीते हैं', 'أبي يشرب الشاي'],
					'Mein Vater trinkt Tee', ['trinke', 'Milch']],
				['gv', ['Мы пьём кофе с молоком', 'We drink coffee with milk', 'Ми п’ємо каву з молоком', 'Pijemy kawę z mlekiem', 'Tomamos café con leche', 'Nous buvons du café au lait', 'Sütlü kahve içiyoruz', 'Bem cafea cu lapte', 'Biz sutli qahva ichamiz', 'हम दूध वाली कॉफ़ी पीते हैं', 'نشرب القهوة بالحليب'],
					'Wir ___ Kaffee mit Milch.', 'trinken']
			]
		},
		// 7. практика: новый сосед
		{
			title: ['Практика: новый сосед', 'Practice: the new neighbour', 'Практика: новий сусід', 'Praktyka: nowy sąsiad', 'Práctica: el vecino nuevo', 'Pratique : le nouveau voisin', 'Pratik: yeni komşu', 'Practică: vecinul nou', 'Amaliyot: yangi qo‘shni', 'अभ्यास: नया पड़ोसी', 'تدريب: الجار الجديد'],
			desc: [
				'Без новой грамматики: знакомишься с соседом и используешь всё из этой земли. Кто ты: Ich bin… Откуда: Ich komme aus… Где живёшь и что делаешь: Ich wohne hier, ich arbeite als… Что у тебя есть: Ich habe einen Hund.',
				'No new grammar: you meet a neighbour and use everything from this land. Who you are: Ich bin… Where from: Ich komme aus… Where you live and what you do: Ich wohne hier, ich arbeite als… What you have: Ich habe einen Hund.',
				'Без нової граматики: знайомишся із сусідом і використовуєш усе з цієї землі. Хто ти: Ich bin… Звідки: Ich komme aus… Де живеш і що робиш: Ich wohne hier, ich arbeite als… Що в тебе є: Ich habe einen Hund.',
				'Bez nowej gramatyki: poznajesz sąsiada i używasz wszystkiego z tej krainy. Kim jesteś: Ich bin… Skąd: Ich komme aus… Gdzie mieszkasz i co robisz: Ich wohne hier, ich arbeite als… Co masz: Ich habe einen Hund.',
				'Sin gramática nueva: conoces a un vecino y usas todo lo de esta tierra. Quién eres: Ich bin… De dónde: Ich komme aus… Dónde vives y qué haces: Ich wohne hier, ich arbeite als… Qué tienes: Ich habe einen Hund.',
				'Sans nouvelle grammaire : tu rencontres un voisin et tu utilises tout ce que tu as appris ici. Qui tu es : Ich bin… D’où : Ich komme aus… Où tu habites et ce que tu fais : Ich wohne hier, ich arbeite als… Ce que tu as : Ich habe einen Hund.',
				'Yeni dil bilgisi yok: bir komşuyla tanışıyor ve bu topraktaki her şeyi kullanıyorsun. Kimsin: Ich bin… Nerelisin: Ich komme aus… Nerede oturuyor ve ne yapıyorsun: Ich wohne hier, ich arbeite als… Neyin var: Ich habe einen Hund.',
				'Fără gramatică nouă: cunoști un vecin și folosești tot ce ai învățat aici. Cine ești: Ich bin… De unde: Ich komme aus… Unde locuiești și ce faci: Ich wohne hier, ich arbeite als… Ce ai: Ich habe einen Hund.',
				'Yangi grammatika yo‘q: qo‘shni bilan tanishasan va shu yerdagi hamma narsani ishlatasan. Kimsan: Ich bin… Qayerdan: Ich komme aus… Qayerda yashaysan va nima qilasan: Ich wohne hier, ich arbeite als… Nimang bor: Ich habe einen Hund.',
				'नया व्याकरण नहीं: तुम पड़ोसी से मिलते हो और इस ज़मीन का सब कुछ इस्तेमाल करते हो। तुम कौन हो: Ich bin… कहाँ से: Ich komme aus… कहाँ रहते हो और क्या करते हो: Ich wohne hier, ich arbeite als… तुम्हारे पास क्या है: Ich habe einen Hund.',
				'بلا قواعد جديدة: تتعرف على جار وتستخدم كل ما تعلمته هنا. من أنت: Ich bin… من أين: Ich komme aus… أين تسكن وماذا تعمل: Ich wohne hier, ich arbeite als… ماذا تملك: Ich habe einen Hund.'
			],
			vocab: [
				['der Nachbar', 'сосед', 'neighbour', 'сусід', 'sąsiad', 'el vecino', 'le voisin', 'komşu', 'vecinul', 'qo‘shni', 'पड़ोसी', 'الجار'],
				['neu', 'новый', 'new', 'новий', 'nowy', 'nuevo', 'nouveau', 'yeni', 'nou', 'yangi', 'नया', 'جديد'],
				['hier', 'здесь', 'here', 'тут', 'tutaj', 'aquí', 'ici', 'burada', 'aici', 'bu yerda', 'यहाँ', 'هنا'],
				['auch', 'тоже', 'also, too', 'теж', 'też', 'también', 'aussi', 'de, da', 'și, de asemenea', 'ham', 'भी', 'أيضًا'],
				['gern', 'охотно, с удовольствием', 'gladly, like to', 'охоче', 'chętnie', 'con gusto', 'volontiers', 'severek', 'cu plăcere', 'jon deb', 'ख़ुशी से', 'بكل سرور']
			],
			tasks: [
				['tr', ['Привет! Я новый сосед.', 'Hi! I am the new neighbour.', 'Привіт! Я новий сусід.', 'Cześć! Jestem nowym sąsiadem.', '¡Hola! Soy el vecino nuevo.', 'Salut ! Je suis le nouveau voisin.', 'Merhaba! Ben yeni komşuyum.', 'Salut! Sunt vecinul cel nou.', 'Salom! Men yangi qo‘shniman.', 'हाय! मैं नया पड़ोसी हूँ।', 'مرحبًا! أنا الجار الجديد.'],
					['Hallo! Ich bin der neue Nachbar.', 'Hallo! Ich bist der neue Nachbar.', 'Hallo! Ich ist der neue Nachbar.'], 'Hallo! Ich bin der neue Nachbar.'],
				['gv', ['Ты тоже живёшь здесь?', 'Do you live here too?', 'Ти теж живеш тут?', 'Ty też tu mieszkasz?', '¿Tú también vives aquí?', 'Tu habites ici aussi ?', 'Sen de burada mı oturuyorsun?', 'Și tu locuiești aici?', 'Sen ham shu yerda yashaysanmi?', 'क्या तुम भी यहाँ रहते हो?', 'هل تسكن هنا أيضًا؟'],
					'___ du auch hier?', 'Wohnst'],
				['gw', ['Я охотно играю в футбол', 'I like playing football', 'Я охоче граю у футбол', 'Chętnie gram w piłkę', 'Me gusta jugar al fútbol', 'J’aime jouer au football', 'Futbol oynamayı severim', 'Joc fotbal cu plăcere', 'Men futbol o‘ynashni yaxshi ko‘raman', 'मुझे फ़ुटबॉल खेलना पसंद है', 'أحب لعب كرة القدم'],
					'Ich spiele ___ Fußball.', 'gern'],
				['ok', ['Мой сосед из Польши.', 'My neighbour is from Poland.', 'Мій сусід з Польщі.', 'Mój sąsiad jest z Polski.', 'Mi vecino es de Polonia.', 'Mon voisin vient de Pologne.', 'Komşum Polonyalı.', 'Vecinul meu e din Polonia.', 'Qo‘shnim Polshadan.', 'मेरा पड़ोसी पोलैंड से है।', 'جاري من بولندا.'],
					['Mein Nachbar kommt aus Polen.', 'Mein Nachbar kommst aus Polen.', 'Mein Nachbar kommen aus Polen.'], 'Mein Nachbar kommt aus Polen.'],
				['ro', ['У нас тоже есть собака', 'We have a dog too', 'У нас теж є собака', 'My też mamy psa', 'Nosotros también tenemos un perro', 'Nous avons aussi un chien', 'Bizim de bir köpeğimiz var', 'Și noi avem un câine', 'Bizning ham itimiz bor', 'हमारे पास भी एक कुत्ता है', 'لدينا كلب أيضًا'],
					'Wir haben auch einen Hund', ['habt', 'sind']],
				['gv', ['Чем ты занимаешься? Я работаю учителем', 'What do you do? I work as a teacher', 'Чим ти займаєшся? Я працюю вчителем', 'Czym się zajmujesz? Pracuję jako nauczyciel', '¿A qué te dedicas? Trabajo de profesor', 'Tu fais quoi ? Je travaille comme professeur', 'Ne iş yapıyorsun? Öğretmen olarak çalışıyorum', 'Ce faci? Lucrez ca profesor', 'Nima ish qilasan? O‘qituvchi bo‘lib ishlayman', 'तुम क्या करते हो? मैं शिक्षक का काम करता हूँ', 'ماذا تعمل؟ أعمل معلمًا'],
					'Was machst du? Ich ___ als Lehrer.', 'arbeite'],
				['tr', ['Вы здесь новенькие?', 'Are you (all) new here?', 'Ви тут нові?', 'Jesteście tu nowi?', '¿Sois nuevos aquí?', 'Vous êtes nouveaux ici ?', 'Burada yeni misiniz?', 'Sunteți noi aici?', 'Sizlar bu yerda yangimisizlar?', 'क्या तुम सब यहाँ नए हो?', 'هل أنتم جدد هنا؟'],
					['Seid ihr neu hier?', 'Sind ihr neu hier?', 'Seid ihr neue hier?'], 'Seid ihr neu hier?'],
				['gw', ['Моя жена тоже учит немецкий', 'My wife is learning German too', 'Моя дружина теж учить німецьку', 'Moja żona też uczy się niemieckiego', 'Mi mujer también aprende alemán', 'Ma femme apprend aussi l’allemand', 'Karım da Almanca öğreniyor', 'Și soția mea învață germana', 'Xotinim ham nemis tilini o‘rganyapti', 'मेरी पत्नी भी जर्मन सीख रही है', 'زوجتي تتعلم الألمانية أيضًا'],
					'Meine Frau lernt ___ Deutsch.', 'auch'],
				['rd', ['Кем работает Юлия?', 'What is Julia’s job?', 'Ким працює Юлія?', 'Kim jest z zawodu Julia?', '¿En qué trabaja Julia?', 'Quel est le métier de Julia ?', 'Julia ne iş yapıyor?', 'Ce meserie are Julia?', 'Yuliya kim bo‘lib ishlaydi?', 'जूलिया क्या काम करती है?', 'ما مهنة يوليا؟'],
					'Hallo, ich bin Julia, die neue Nachbarin. Ich komme aus Wien. Ich bin Ärztin. Mein Mann ist Koch. Wir haben zwei Kinder.', ['Ärztin', 'Köchin', 'Lehrerin'], 'Ärztin'],
				['ok', ['Ты охотно танцуешь?', 'Do you like dancing?', 'Ти охоче танцюєш?', 'Lubisz tańczyć?', '¿Te gusta bailar?', 'Tu aimes danser ?', 'Dans etmeyi sever misin?', 'Îți place să dansezi?', 'Raqsga tushishni yaxshi ko‘rasanmi?', 'क्या तुम्हें नाचना पसंद है?', 'هل تحب الرقص؟'],
					['Tanzt du gern?', 'Tanzt du gernt?', 'Tanzen du gern?'], 'Tanzt du gern?'],
				['ro', ['Здесь живут мои родители', 'My parents live here', 'Тут живуть мої батьки', 'Tu mieszkają moi rodzice', 'Aquí viven mis padres', 'Mes parents habitent ici', 'Annemle babam burada oturuyor', 'Aici locuiesc părinții mei', 'Bu yerda ota-onam yashaydi', 'यहाँ मेरे माता-पिता रहते हैं', 'هنا يسكن والداي'],
					'Hier wohnen meine Eltern', ['wohnt', 'sind']],
				// повторение: квесты 5 и 6
				['gv', ['Как зовут учительницу?', 'What is the teacher’s name?', 'Як звати вчительку?', 'Jak ma na imię nauczycielka?', '¿Cómo se llama la profesora?', 'Comment s’appelle la professeure ?', 'Öğretmenin adı ne?', 'Cum o cheamă pe profesoară?', 'O‘qituvchining ismi nima?', 'शिक्षिका का नाम क्या है?', 'ما اسم المعلمة؟'],
					'Wie ___ die Lehrerin?', 'heißt'],
				['tr', ['Мы учим немецкий.', 'We are learning German.', 'Ми вчимо німецьку.', 'Uczymy się niemieckiego.', 'Aprendemos alemán.', 'Nous apprenons l’allemand.', 'Almanca öğreniyoruz.', 'Învățăm germana.', 'Biz nemis tilini o‘rganamiz.', 'हम जर्मन सीख रहे हैं।', 'نتعلم الألمانية.'],
					['Wir lernen Deutsch.', 'Wir lernt Deutsch.', 'Wir lerne Deutsch.'], 'Wir lernen Deutsch.'],
				// повторение: «Восточная равнина»
				['ro', ['Я пью воду и чай', 'I drink water and tea', 'Я п’ю воду й чай', 'Piję wodę i herbatę', 'Bebo agua y té', 'Je bois de l’eau et du thé', 'Su ve çay içiyorum', 'Beau apă și ceai', 'Men suv va choy ichaman', 'मैं पानी और चाय पीता हूँ', 'أشرب الماء والشاي'],
					'Ich trinke Wasser und Tee', ['trinkst', 'kostet']],
				['gw', ['До свидания, госпожа Кляйн!', 'Goodbye, Mrs Klein!', 'До побачення, пані Кляйн!', 'Do widzenia, pani Klein!', '¡Adiós, señora Klein!', 'Au revoir, madame Klein !', 'Hoşça kalın, Bayan Klein!', 'La revedere, doamna Klein!', 'Xayr, Klyayn xonim!', 'अलविदा, श्रीमती क्लाइन!', 'مع السلامة يا سيدة كلاين!'],
					'Auf ___, Frau Klein!', 'Wiedersehen']
			]
		},
		// 8. практика: языковые курсы
		{
			title: ['Практика: на курсах немецкого', 'Practice: at the German course', 'Практика: на курсах німецької', 'Praktyka: na kursie niemieckiego', 'Práctica: en el curso de alemán', 'Pratique : au cours d’allemand', 'Pratik: Almanca kursunda', 'Practică: la cursul de germană', 'Amaliyot: nemis tili kursida', 'अभ्यास: जर्मन कोर्स में', 'تدريب: في دورة الألمانية'],
			desc: [
				'Без новой грамматики: первый день на курсе. Все представляются и рассказывают о себе: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Сколько тебе лет: Wie alt bist du? Ich bin 25 Jahre alt.',
				'No new grammar: the first day of the course. Everyone introduces themselves: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… How old are you: Wie alt bist du? Ich bin 25 Jahre alt.',
				'Без нової граматики: перший день на курсі. Усі представляються й розповідають про себе: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Скільки тобі років: Wie alt bist du? Ich bin 25 Jahre alt.',
				'Bez nowej gramatyki: pierwszy dzień kursu. Wszyscy się przedstawiają: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Ile masz lat: Wie alt bist du? Ich bin 25 Jahre alt.',
				'Sin gramática nueva: primer día del curso. Todos se presentan: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Cuántos años tienes: Wie alt bist du? Ich bin 25 Jahre alt.',
				'Sans nouvelle grammaire : premier jour du cours. Chacun se présente : Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Quel âge as-tu : Wie alt bist du? Ich bin 25 Jahre alt.',
				'Yeni dil bilgisi yok: kursun ilk günü. Herkes kendini tanıtıyor: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Kaç yaşındasın: Wie alt bist du? Ich bin 25 Jahre alt.',
				'Fără gramatică nouă: prima zi la curs. Toți se prezintă: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Câți ani ai: Wie alt bist du? Ich bin 25 Jahre alt.',
				'Yangi grammatika yo‘q: kursning birinchi kuni. Hamma o‘zini tanishtiradi: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… Necha yoshdasan: Wie alt bist du? Ich bin 25 Jahre alt.',
				'नया व्याकरण नहीं: कोर्स का पहला दिन। सब अपना परिचय देते हैं: Ich heiße…, Ich bin … Jahre alt, Ich komme aus…, Ich wohne in…, Ich habe… तुम्हारी उम्र क्या है: Wie alt bist du? Ich bin 25 Jahre alt.',
				'بلا قواعد جديدة: اليوم الأول في الدورة. الجميع يعرّفون بأنفسهم: Ich heiße… و Ich bin … Jahre alt و Ich komme aus… و Ich wohne in… و Ich habe… كم عمرك: Wie alt bist du? Ich bin 25 Jahre alt.'
			],
			vocab: [
				['der Kurs', 'курс', 'course', 'курс', 'kurs', 'el curso', 'le cours', 'kurs', 'cursul', 'kurs', 'कोर्स', 'الدورة'],
				['alt', 'старый; … лет', 'old', 'старий; … років', 'stary; … lat', 'viejo; … años', 'vieux; … ans', 'yaşlı; … yaşında', 'bătrân; … ani', 'qari; … yosh', 'पुराना; … साल का', 'كبير؛ عمره …'],
				['das Jahr', 'год', 'year', 'рік', 'rok', 'el año', 'l’an, l’année', 'yıl', 'anul', 'yil', 'साल', 'السنة'],
				['die Sprache', 'язык', 'language', 'мова', 'język', 'el idioma', 'la langue', 'dil', 'limba', 'til', 'भाषा', 'اللغة'],
				['Englisch', 'английский язык', 'English', 'англійська мова', 'angielski', 'el inglés', 'l’anglais', 'İngilizce', 'engleza', 'ingliz tili', 'अंग्रेज़ी', 'الإنجليزية']
			],
			tasks: [
				['tr', ['Сколько тебе лет?', 'How old are you?', 'Скільки тобі років?', 'Ile masz lat?', '¿Cuántos años tienes?', 'Quel âge as-tu ?', 'Kaç yaşındasın?', 'Câți ani ai?', 'Necha yoshdasan?', 'तुम्हारी उम्र क्या है?', 'كم عمرك؟'],
					['Wie alt bist du?', 'Wie alt hast du?', 'Wie alt ist du?'], 'Wie alt bist du?'],
				['gv', ['Мне двадцать лет', 'I am twenty years old', 'Мені двадцять років', 'Mam dwadzieścia lat', 'Tengo veinte años', 'J’ai vingt ans', 'Yirmi yaşındayım', 'Am douăzeci de ani', 'Men yigirma yoshdaman', 'मैं बीस साल का हूँ', 'عمري عشرون سنة'],
					'Ich ___ zwanzig Jahre alt.', 'bin'],
				['gw', ['Курс очень хороший', 'The course is very good', 'Курс дуже добрий', 'Kurs jest bardzo dobry', 'El curso es muy bueno', 'Le cours est très bien', 'Kurs çok iyi', 'Cursul e foarte bun', 'Kurs juda yaxshi', 'कोर्स बहुत अच्छा है', 'الدورة جيدة جدًا'],
					'Der ___ ist sehr gut.', 'Kurs'],
				['ok', ['Курс хороший?', 'Is the course good?', 'Курс добрий?', 'Czy kurs jest dobry?', '¿El curso es bueno?', 'Le cours est bien ?', 'Kurs iyi mi?', 'Cursul e bun?', 'Kurs yaxshimi?', 'क्या कोर्स अच्छा है?', 'هل الدورة جيدة؟'],
					['Ist der Kurs gut?', 'Bist der Kurs gut?', 'Sind der Kurs gut?'], 'Ist der Kurs gut?'],
				['ro', ['Я учу английский и немецкий', 'I am learning English and German', 'Я вчу англійську і німецьку', 'Uczę się angielskiego i niemieckiego', 'Aprendo inglés y alemán', 'J’apprends l’anglais et l’allemand', 'İngilizce ve Almanca öğreniyorum', 'Învăț engleza și germana', 'Men ingliz va nemis tilini o‘rganaman', 'मैं अंग्रेज़ी और जर्मन सीखता हूँ', 'أتعلم الإنجليزية والألمانية'],
					'Ich lerne Englisch und Deutsch', ['lernst', 'Sprache']],
				['gv', ['Сколько лет ребёнку?', 'How old is the child?', 'Скільки років дитині?', 'Ile lat ma dziecko?', '¿Cuántos años tiene el niño?', 'Quel âge a l’enfant ?', 'Çocuk kaç yaşında?', 'Câți ani are copilul?', 'Bola necha yoshda?', 'बच्चा कितने साल का है?', 'كم عمر الطفل؟'],
					'Wie alt ___ das Kind?', 'ist'],
				['tr', ['Мы на курсе уже год.', 'We have been on the course for a year.', 'Ми на курсі вже рік.', 'Jesteśmy na kursie już rok.', 'Llevamos un año en el curso.', 'Nous sommes au cours depuis un an.', 'Bir yıldır kurstayız.', 'Suntem la curs de un an.', 'Biz kursda allaqachon bir yildan beri.', 'हम एक साल से कोर्स में हैं।', 'نحن في الدورة منذ سنة.'],
					['Wir sind ein Jahr im Kurs.', 'Wir seid ein Jahr im Kurs.', 'Wir haben ein Jahr im Kurs.'], 'Wir sind ein Jahr im Kurs.'],
				['gw', ['Мы учим английский', 'We are learning English', 'Ми вчимо англійську', 'Uczymy się angielskiego', 'Aprendemos inglés', 'Nous apprenons l’anglais', 'İngilizce öğreniyoruz', 'Învățăm engleza', 'Biz ingliz tilini o‘rganamiz', 'हम अंग्रेज़ी सीख रहे हैं', 'نتعلم الإنجليزية'],
					'Wir lernen ___.', 'Englisch'],
				['rd', ['Сколько лет Карлосу?', 'How old is Carlos?', 'Скільки років Карлосу?', 'Ile lat ma Carlos?', '¿Cuántos años tiene Carlos?', 'Quel âge a Carlos ?', 'Carlos kaç yaşında?', 'Câți ani are Carlos?', 'Karlos necha yoshda?', 'कार्लोस कितने साल का है?', 'كم عمر كارلوس؟'],
					'Hallo, ich heiße Carlos. Ich komme aus Spanien und bin dreißig Jahre alt. Ich wohne in Hamburg und arbeite als Koch. Ich lerne jetzt Deutsch im Kurs.', ['dreißig', 'dreizehn', 'zwanzig'], 'dreißig'],
				['ok', ['Дети тоже учат немецкий?', 'Are the children learning German too?', 'Діти теж учать німецьку?', 'Czy dzieci też uczą się niemieckiego?', '¿Los niños también aprenden alemán?', 'Les enfants apprennent aussi l’allemand ?', 'Çocuklar da Almanca öğreniyor mu?', 'Și copiii învață germana?', 'Bolalar ham nemis tilini o‘rganyaptimi?', 'क्या बच्चे भी जर्मन सीख रहे हैं?', 'هل يتعلم الأطفال الألمانية أيضًا؟'],
					['Lernen die Kinder auch Deutsch?', 'Lernt die Kinder auch Deutsch?', 'Lernst die Kinder auch Deutsch?'], 'Lernen die Kinder auch Deutsch?'],
				['ro', ['Моему брату шестнадцать лет', 'My brother is sixteen', 'Моєму братові шістнадцять років', 'Mój brat ma szesnaście lat', 'Mi hermano tiene dieciséis años', 'Mon frère a seize ans', 'Erkek kardeşim on altı yaşında', 'Fratele meu are șaisprezece ani', 'Akam o‘n olti yoshda', 'मेरा भाई सोलह साल का है', 'أخي عمره ست عشرة سنة'],
					'Mein Bruder ist sechzehn Jahre alt', ['hat', 'bist']],
				// повторение: квесты 6 и 7
				['gv', ['Ты сегодня работаешь?', 'Are you working today?', 'Ти сьогодні працюєш?', 'Pracujesz dzisiaj?', '¿Trabajas hoy?', 'Tu travailles aujourd’hui ?', 'Bugün çalışıyor musun?', 'Lucrezi azi?', 'Bugun ishlaysanmi?', 'क्या तुम आज काम कर रहे हो?', 'هل تعمل اليوم؟'],
					'___ du heute?', 'Arbeitest'],
				['tr', ['Сосед тоже новенький.', 'The neighbour is new too.', 'Сусід теж новий.', 'Sąsiad też jest nowy.', 'El vecino también es nuevo.', 'Le voisin est nouveau aussi.', 'Komşu da yeni.', 'Și vecinul e nou.', 'Qo‘shni ham yangi.', 'पड़ोसी भी नया है।', 'الجار جديد أيضًا.'],
					['Der Nachbar ist auch neu.', 'Der Nachbar sind auch neu.', 'Der Nachbar bist auch neu.'], 'Der Nachbar ist auch neu.'],
				// повторение: «Восточная равнина»
				['ro', ['Моя мама врач', 'My mum is a doctor', 'Моя мама лікарка', 'Moja mama jest lekarką', 'Mi madre es médica', 'Ma mère est médecin', 'Annem doktor', 'Mama mea e medic', 'Onam shifokor', 'मेरी माँ डॉक्टर है', 'أمي طبيبة'],
					'Meine Mutter ist Ärztin', ['bist', 'Arzt']],
				['gw', ['Чай, пожалуйста!', 'Tea, please!', 'Чай, будь ласка!', 'Herbatę poproszę!', '¡Té, por favor!', 'Du thé, s’il vous plaît !', 'Çay, lütfen!', 'Ceai, vă rog!', 'Choy, iltimos!', 'चाय, कृपया!', 'شاي من فضلك!'],
					'Tee, ___!', 'bitte']
			]
		},
		// 9. повторение
		{
			title: ['Повторение: я и другие', 'Review: me and others', 'Повторення: я та інші', 'Powtórka: ja i inni', 'Repaso: yo y los demás', 'Révision : moi et les autres', 'Tekrar: ben ve diğerleri', 'Recapitulare: eu și ceilalți', 'Takrorlash: men va boshqalar', 'दोहराव: मैं और दूसरे', 'مراجعة: أنا والآخرون'],
			desc: [
				'Повторяем всю землю: местоимения (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) и окончания глаголов: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'We review the whole land: pronouns (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) and verb endings: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'Повторюємо всю землю: займенники (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) і закінчення дієслів: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'Powtarzamy całą krainę: zaimki (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) i końcówki czasowników: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'Repasamos toda la tierra: pronombres (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) y las terminaciones: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'On révise toute la terre : pronoms (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) et les terminaisons : ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'Tüm toprağı tekrar ediyoruz: zamirler (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) ve fiil ekleri: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'Recapitulăm tot ținutul: pronumele (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) și terminațiile: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'Butun yerni takrorlaymiz: olmoshlar (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) va fe’l qo‘shimchalari: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.',
				'पूरी ज़मीन दोहराते हैं: सर्वनाम (ich, du, er, sie, es, wir, ihr, sie, Sie), sein (bin, bist, ist, sind, seid), haben (habe, hast, hat, haben, habt) और क्रिया के अंत: ich -e, du -st, er -t, wir -en, ihr -t, sie -en।',
				'نراجع الأرض كلها: الضمائر (ich و du و er و sie و es و wir و ihr و sie و Sie) و sein (bin و bist و ist و sind و seid) و haben (habe و hast و hat و haben و habt) ونهايات الأفعال: ich -e و du -st و er -t و wir -en و ihr -t و sie -en.'
			],
			vocab: [
				['die Frau', 'женщина; жена; госпожа', 'woman; wife; Mrs', 'жінка; дружина; пані', 'kobieta; żona; pani', 'la mujer; la señora', 'la femme; madame', 'kadın; eş; bayan', 'femeia; soția; doamna', 'ayol; xotin; xonim', 'महिला; पत्नी; श्रीमती', 'المرأة؛ الزوجة؛ السيدة'],
				['der Mann', 'мужчина; муж', 'man; husband', 'чоловік', 'mężczyzna; mąż', 'el hombre; el marido', 'l’homme; le mari', 'adam; koca', 'bărbatul; soțul', 'erkak; er', 'आदमी; पति', 'الرجل؛ الزوج'],
				['jetzt', 'сейчас', 'now', 'зараз', 'teraz', 'ahora', 'maintenant', 'şimdi', 'acum', 'hozir', 'अब', 'الآن'],
				['zusammen', 'вместе', 'together', 'разом', 'razem', 'juntos', 'ensemble', 'birlikte', 'împreună', 'birga', 'साथ में', 'معًا'],
				['viel', 'много', 'a lot, much', 'багато', 'dużo', 'mucho', 'beaucoup', 'çok', 'mult', 'ko‘p', 'बहुत', 'كثيرًا']
			],
			tasks: [
				['tr', ['Мы теперь живём вместе.', 'We live together now.', 'Ми тепер живемо разом.', 'Teraz mieszkamy razem.', 'Ahora vivimos juntos.', 'Maintenant, nous habitons ensemble.', 'Artık birlikte yaşıyoruz.', 'Acum locuim împreună.', 'Endi biz birga yashaymiz.', 'अब हम साथ रहते हैं।', 'نسكن الآن معًا.'],
					['Wir wohnen jetzt zusammen.', 'Wir wohnt jetzt zusammen.', 'Wir wohnst jetzt zusammen.'], 'Wir wohnen jetzt zusammen.'],
				['gv', ['Мой муж много работает', 'My husband works a lot', 'Мій чоловік багато працює', 'Mój mąż dużo pracuje', 'Mi marido trabaja mucho', 'Mon mari travaille beaucoup', 'Kocam çok çalışıyor', 'Soțul meu lucrează mult', 'Erim ko‘p ishlaydi', 'मेरे पति बहुत काम करते हैं', 'زوجي يعمل كثيرًا'],
					'Mein Mann ___ viel.', 'arbeitet'],
				['gv', ['Вы сейчас в Берлине?', 'Are you (all) in Berlin now?', 'Ви зараз у Берліні?', 'Jesteście teraz w Berlinie?', '¿Estáis ahora en Berlín?', 'Vous êtes à Berlin maintenant ?', 'Şimdi Berlin’de misiniz?', 'Sunteți acum în Berlin?', 'Sizlar hozir Berlindamisizlar?', 'क्या तुम सब अभी बर्लिन में हो?', 'هل أنتم الآن في برلين؟'],
					'___ ihr jetzt in Berlin?', 'Seid'],
				['ok', ['Госпожа Ланг, у Вас есть время?', 'Mrs Lang, do you have time?', 'Пані Ланг, у Вас є час?', 'Pani Lang, ma Pani czas?', 'Señora Lang, ¿tiene usted tiempo?', 'Madame Lang, vous avez le temps ?', 'Bayan Lang, vaktiniz var mı?', 'Doamna Lang, aveți timp?', 'Lang xonim, vaqtingiz bormi?', 'श्रीमती लांग, क्या आपके पास समय है?', 'سيدة لانغ، هل لدى حضرتك وقت؟'],
					['Frau Lang, haben Sie Zeit?', 'Frau Lang, hat Sie Zeit?', 'Frau Lang, hast Sie Zeit?'], 'Frau Lang, haben Sie Zeit?'],
				['ro', ['Мы вместе учим немецкий', 'We learn German together', 'Ми разом учимо німецьку', 'Razem uczymy się niemieckiego', 'Aprendemos alemán juntos', 'Nous apprenons l’allemand ensemble', 'Birlikte Almanca öğreniyoruz', 'Învățăm germana împreună', 'Biz birga nemis tilini o‘rganamiz', 'हम साथ में जर्मन सीखते हैं', 'نتعلم الألمانية معًا'],
					'Wir lernen zusammen Deutsch', ['lernt', 'sind']],
				['gw', ['Женщина пьёт много кофе', 'The woman drinks a lot of coffee', 'Жінка п’є багато кави', 'Kobieta pije dużo kawy', 'La mujer bebe mucho café', 'La femme boit beaucoup de café', 'Kadın çok kahve içiyor', 'Femeia bea multă cafea', 'Ayol ko‘p qahva ichadi', 'महिला बहुत कॉफ़ी पीती है', 'المرأة تشرب الكثير من القهوة'],
					'Die Frau trinkt ___ Kaffee.', 'viel'],
				['tr', ['Ты сейчас голоден?', 'Are you hungry now?', 'Ти зараз голодний?', 'Jesteś teraz głodny?', '¿Tienes hambre ahora?', 'Tu as faim maintenant ?', 'Şimdi aç mısın?', 'Ți-e foame acum?', 'Hozir qorning ochmi?', 'क्या तुम्हें अभी भूख लगी है?', 'هل أنت جائع الآن؟'],
					['Hast du jetzt Hunger?', 'Bist du jetzt Hunger?', 'Hat du jetzt Hunger?'], 'Hast du jetzt Hunger?'],
				['gv', ['Мужчина и женщина танцуют', 'The man and the woman are dancing', 'Чоловік і жінка танцюють', 'Mężczyzna i kobieta tańczą', 'El hombre y la mujer bailan', 'L’homme et la femme dansent', 'Adam ve kadın dans ediyor', 'Bărbatul și femeia dansează', 'Erkak va ayol raqsga tushyapti', 'आदमी और औरत नाच रहे हैं', 'الرجل والمرأة يرقصان'],
					'Der Mann und die Frau ___.', 'tanzen'],
				['rd', ['Где сейчас живёт семья Новак?', 'Where does the Nowak family live now?', 'Де зараз живе родина Новак?', 'Gdzie teraz mieszka rodzina Nowak?', '¿Dónde vive ahora la familia Nowak?', 'Où habite la famille Nowak maintenant ?', 'Nowak ailesi şimdi nerede yaşıyor?', 'Unde locuiește acum familia Nowak?', 'Novak oilasi hozir qayerda yashaydi?', 'नोवाक परिवार अब कहाँ रहता है?', 'أين تسكن عائلة نوفاك الآن؟'],
					'Das ist Familie Nowak. Herr und Frau Nowak kommen aus Polen. Jetzt wohnen sie zusammen in Leipzig. Er ist Arzt, sie ist Lehrerin.', ['in Leipzig', 'in Polen', 'in Wien'], 'in Leipzig'],
				['ok', ['Он из Турции и живёт сейчас здесь.', 'He is from Turkey and lives here now.', 'Він з Туреччини й зараз живе тут.', 'Jest z Turcji i teraz mieszka tutaj.', 'Es de Turquía y ahora vive aquí.', 'Il vient de Turquie et habite ici maintenant.', 'Türkiye’den geliyor ve şimdi burada yaşıyor.', 'E din Turcia și acum locuiește aici.', 'U Turkiyadan va hozir shu yerda yashaydi.', 'वह तुर्की से है और अब यहाँ रहता है।', 'هو من تركيا ويسكن هنا الآن.'],
					['Er kommt aus der Türkei und wohnt jetzt hier.', 'Er kommst aus der Türkei und wohnt jetzt hier.', 'Er kommt aus der Türkei und wohnen jetzt hier.'], 'Er kommt aus der Türkei und wohnt jetzt hier.'],
				['ro', ['Вы очень много работаете', 'You work very much', 'Ви дуже багато працюєте', 'Pracuje Pan bardzo dużo', 'Usted trabaja muchísimo', 'Vous travaillez beaucoup', 'Çok fazla çalışıyorsunuz', 'Lucrați foarte mult', 'Siz juda ko‘p ishlaysiz', 'आप बहुत ज़्यादा काम करते हैं', 'حضرتك تعمل كثيرًا جدًا'],
					'Sie arbeiten sehr viel', ['arbeitet', 'sind']],
				// повторение: квесты 7 и 8
				['gv', ['Сколько лет твоей сестре?', 'How old is your sister?', 'Скільки років твоїй сестрі?', 'Ile lat ma twoja siostra?', '¿Cuántos años tiene tu hermana?', 'Quel âge a ta sœur ?', 'Kız kardeşin kaç yaşında?', 'Câți ani are sora ta?', 'Singling necha yoshda?', 'तुम्हारी बहन कितने साल की है?', 'كم عمر أختك؟'],
					'Wie alt ___ deine Schwester?', 'ist'],
				['tr', ['Я охотно учу языки.', 'I like learning languages.', 'Я охоче вчу мови.', 'Chętnie uczę się języków.', 'Me gusta aprender idiomas.', 'J’aime apprendre des langues.', 'Dil öğrenmeyi severim.', 'Învăț limbi cu plăcere.', 'Men tillarni o‘rganishni yaxshi ko‘raman.', 'मुझे भाषाएँ सीखना पसंद है।', 'أحب تعلم اللغات.'],
					['Ich lerne gern Sprachen.', 'Ich lernst gern Sprachen.', 'Ich lerne gernt Sprachen.'], 'Ich lerne gern Sprachen.'],
				// повторение: «Восточная равнина»
				['ro', ['Мой отец работает поваром', 'My father works as a cook', 'Мій батько працює кухарем', 'Mój tata pracuje jako kucharz', 'Mi padre trabaja de cocinero', 'Mon père travaille comme cuisinier', 'Babam aşçı olarak çalışıyor', 'Tatăl meu lucrează ca bucătar', 'Otam oshpaz bo‘lib ishlaydi', 'मेरे पिता रसोइए का काम करते हैं', 'أبي يعمل طباخًا'],
					'Mein Vater arbeitet als Koch', ['arbeitest', 'ist']],
				['gw', ['Сколько стоит хлеб?', 'How much is the bread?', 'Скільки коштує хліб?', 'Ile kosztuje chleb?', '¿Cuánto cuesta el pan?', 'Combien coûte le pain ?', 'Ekmek ne kadar?', 'Cât costă pâinea?', 'Non qancha turadi?', 'ब्रेड कितने की है?', 'بكم الخبز؟'],
					'Wie viel ___ das Brot?', 'kostet']
			]
		},
		// 10. контрольный
		{
			title: ['Контрольный: Луг знакомств', 'Final test: Meeting Meadow', 'Контрольний: Луг знайомств', 'Sprawdzian: Łąka Poznania', 'Prueba final: Prado de los Encuentros', 'Contrôle : Pré des Rencontres', 'Sınav: Tanışma Çayırı', 'Test final: Pajiștea Cunoștințelor', 'Nazorat: Tanishuv o‘tloqi', 'अंतिम परीक्षा: मुलाक़ात का मैदान', 'الاختبار: مرج التعارف'],
			desc: [
				'Проверь себя: кто есть кто (ich, du, er, sie, wir, ihr, Sie), формы sein и haben, окончания глаголов (-e, -st, -t, -en) и особые случаи: du arbeitest, du heißt. Здесь всё вперемешку, как в настоящем разговоре.',
				'Test yourself: who is who (ich, du, er, sie, wir, ihr, Sie), the forms of sein and haben, verb endings (-e, -st, -t, -en) and special cases: du arbeitest, du heißt. Everything is mixed, like in a real conversation.',
				'Перевір себе: хто є хто (ich, du, er, sie, wir, ihr, Sie), форми sein і haben, закінчення дієслів (-e, -st, -t, -en) і особливі випадки: du arbeitest, du heißt. Тут усе впереміш, як у справжній розмові.',
				'Sprawdź się: kto jest kim (ich, du, er, sie, wir, ihr, Sie), formy sein i haben, końcówki czasowników (-e, -st, -t, -en) i wyjątki: du arbeitest, du heißt. Wszystko jest wymieszane jak w prawdziwej rozmowie.',
				'Ponte a prueba: quién es quién (ich, du, er, sie, wir, ihr, Sie), las formas de sein y haben, las terminaciones (-e, -st, -t, -en) y casos especiales: du arbeitest, du heißt. Todo mezclado, como en una conversación real.',
				'Teste-toi : qui est qui (ich, du, er, sie, wir, ihr, Sie), les formes de sein et haben, les terminaisons (-e, -st, -t, -en) et les cas particuliers : du arbeitest, du heißt. Tout est mélangé, comme dans une vraie conversation.',
				'Kendini dene: kim kimdir (ich, du, er, sie, wir, ihr, Sie), sein ve haben biçimleri, fiil ekleri (-e, -st, -t, -en) ve özel durumlar: du arbeitest, du heißt. Her şey gerçek bir sohbetteki gibi karışık.',
				'Verifică-te: cine e cine (ich, du, er, sie, wir, ihr, Sie), formele lui sein și haben, terminațiile (-e, -st, -t, -en) și cazurile speciale: du arbeitest, du heißt. Totul e amestecat, ca într-o conversație reală.',
				'O‘zingni sinab ko‘r: kim kim (ich, du, er, sie, wir, ihr, Sie), sein va haben shakllari, fe’l qo‘shimchalari (-e, -st, -t, -en) va alohida holatlar: du arbeitest, du heißt. Hammasi haqiqiy suhbatdagidek aralash.',
				'ख़ुद को परखो: कौन क्या है (ich, du, er, sie, wir, ihr, Sie), sein और haben के रूप, क्रिया के अंत (-e, -st, -t, -en) और ख़ास मामले: du arbeitest, du heißt। सब कुछ असली बातचीत की तरह मिला-जुला है।',
				'اختبر نفسك: من هو من (ich و du و er و sie و wir و ihr و Sie)، وصيغ sein و haben، ونهايات الأفعال (-e و -st و -t و -en) والحالات الخاصة: du arbeitest و du heißt. كل شيء مختلط كما في محادثة حقيقية.'
			],
			vocab: [
				['das Foto', 'фото', 'photo', 'фото', 'zdjęcie', 'la foto', 'la photo', 'fotoğraf', 'fotografia', 'surat', 'फ़ोटो', 'الصورة'],
				['wer', 'кто', 'who', 'хто', 'kto', 'quién', 'qui', 'kim', 'cine', 'kim', 'कौन', 'من'],
				['krank', 'больной', 'ill, sick', 'хворий', 'chory', 'enfermo', 'malade', 'hasta', 'bolnav', 'kasal', 'बीमार', 'مريض'],
				['glücklich', 'счастливый', 'happy', 'щасливий', 'szczęśliwy', 'feliz', 'heureux', 'mutlu', 'fericit', 'baxtli', 'ख़ुश', 'سعيد'],
				['die Katze', 'кошка', 'cat', 'кішка', 'kot', 'el gato', 'le chat', 'kedi', 'pisica', 'mushuk', 'बिल्ली', 'القطة']
			],
			tasks: [
				['tr', ['Кто это на фото?', 'Who is that in the photo?', 'Хто це на фото?', 'Kto to jest na zdjęciu?', '¿Quién es ese de la foto?', 'Qui est-ce sur la photo ?', 'Fotoğraftaki kim?', 'Cine e în fotografie?', 'Suratdagi kim?', 'फ़ोटो में यह कौन है?', 'من هذا في الصورة؟'],
					['Wer ist das auf dem Foto?', 'Wer sind das auf dem Foto?', 'Wer bist das auf dem Foto?'], 'Wer ist das auf dem Foto?'],
				['gv', ['Ты болен?', 'Are you ill?', 'Ти хворий?', 'Jesteś chory?', '¿Estás enfermo?', 'Tu es malade ?', 'Hasta mısın?', 'Ești bolnav?', 'Kasalmisan?', 'क्या तुम बीमार हो?', 'هل أنت مريض؟'],
					'___ du krank?', 'Bist'],
				['gv', ['У нас есть кошка', 'We have a cat', 'У нас є кішка', 'Mamy kota', 'Tenemos un gato', 'Nous avons un chat', 'Bir kedimiz var', 'Avem o pisică', 'Bizda mushuk bor', 'हमारे पास एक बिल्ली है', 'لدينا قطة'],
					'Wir ___ eine Katze.', 'haben'],
				['ok', ['Ты работаешь в Мюнхене?', 'Do you work in Munich?', 'Ти працюєш у Мюнхені?', 'Pracujesz w Monachium?', '¿Trabajas en Múnich?', 'Tu travailles à Munich ?', 'Münih’te mi çalışıyorsun?', 'Lucrezi la München?', 'Myunxenda ishlaysanmi?', 'क्या तुम म्यूनिख में काम करते हो?', 'هل تعمل في ميونخ؟'],
					['Arbeitest du in München?', 'Arbeitst du in München?', 'Arbeitet du in München?'], 'Arbeitest du in München?'],
				['ro', ['Мои родители очень счастливы', 'My parents are very happy', 'Мої батьки дуже щасливі', 'Moi rodzice są bardzo szczęśliwi', 'Mis padres son muy felices', 'Mes parents sont très heureux', 'Annemle babam çok mutlu', 'Părinții mei sunt foarte fericiți', 'Ota-onam juda baxtli', 'मेरे माता-पिता बहुत ख़ुश हैं', 'والداي سعيدان جدًا'],
					'Meine Eltern sind sehr glücklich', ['ist', 'haben']],
				['gw', ['Кошка очень милая. Она уже старая', 'The cat is very sweet. It is already old', 'Кішка дуже мила. Вона вже стара', 'Kot jest bardzo miły. Jest już stary', 'El gato es muy bonito. Ya es mayor', 'La chatte est très gentille. Elle est déjà vieille', 'Kedi çok tatlı. Artık yaşlı', 'Pisica e foarte drăguță. E deja bătrână', 'Mushuk juda yoqimli. U allaqachon qari', 'बिल्ली बहुत प्यारी है। वह अब बूढ़ी है', 'القطة لطيفة جدًا. هي كبيرة في السن'],
					'Die Katze ist sehr nett. ___ ist alt.', 'Sie'],
				['tr', ['Как вас зовут? Нас зовут Ян и Ева.', 'What are your names? We are Jan and Eva.', 'Як вас звати? Нас звати Ян і Єва.', 'Jak się nazywacie? Jesteśmy Jan i Ewa.', '¿Cómo os llamáis? Somos Jan y Eva.', 'Comment vous appelez-vous ? Nous sommes Jan et Eva.', 'Adınız ne? Biz Jan ve Eva’yız.', 'Cum vă numiți? Suntem Jan și Eva.', 'Ismlaringiz nima? Biz Yan va Yevamiz.', 'तुम सबके नाम क्या हैं? हम यान और एवा हैं।', 'ما اسماكما؟ نحن يان وإيفا.'],
					['Wie heißt ihr? Wir sind Jan und Eva.', 'Wie heißen ihr? Wir sind Jan und Eva.', 'Wie heißt ihr? Wir seid Jan und Eva.'], 'Wie heißt ihr? Wir sind Jan und Eva.'],
				['gv', ['Она сегодня больна и не работает', 'She is ill today and is not working', 'Вона сьогодні хвора й не працює', 'Ona jest dziś chora i nie pracuje', 'Hoy está enferma y no trabaja', 'Elle est malade aujourd’hui et ne travaille pas', 'Bugün hasta ve çalışmıyor', 'Azi e bolnavă și nu lucrează', 'U bugun kasal va ishlamayapti', 'वह आज बीमार है और काम नहीं कर रही', 'هي مريضة اليوم ولا تعمل'],
					'Sie ist heute krank und ___ nicht.', 'arbeitet'],
				['rd', ['Почему Макс счастлив?', 'Why is Max happy?', 'Чому Макс щасливий?', 'Dlaczego Max jest szczęśliwy?', '¿Por qué está feliz Max?', 'Pourquoi Max est-il heureux ?', 'Max neden mutlu?', 'De ce este Max fericit?', 'Maks nega baxtli?', 'मैक्स ख़ुश क्यों है?', 'لماذا ماكس سعيد؟'],
					'Max ist zwölf Jahre alt. Er wohnt in Bremen. Heute ist er sehr glücklich: Er hat jetzt eine Katze! Sie heißt Mimi.', ['Er hat jetzt eine Katze.', 'Er ist heute krank.', 'Er wohnt jetzt in Bremen.'], 'Er hat jetzt eine Katze.'],
				['ok', ['Вы из Испании? Нет, мы из Италии.', 'Are you (all) from Spain? No, we are from Italy.', 'Ви з Іспанії? Ні, ми з Італії.', 'Jesteście z Hiszpanii? Nie, jesteśmy z Włoch.', '¿Sois de España? No, somos de Italia.', 'Vous venez d’Espagne ? Non, nous venons d’Italie.', 'İspanyalı mısınız? Hayır, İtalyalıyız.', 'Sunteți din Spania? Nu, suntem din Italia.', 'Sizlar Ispaniyadanmisizlar? Yo‘q, biz Italiyadanmiz.', 'क्या तुम सब स्पेन से हो? नहीं, हम इटली से हैं।', 'هل أنتم من إسبانيا؟ لا، نحن من إيطاليا.'],
					['Seid ihr aus Spanien? Nein, wir sind aus Italien.', 'Sind ihr aus Spanien? Nein, wir sind aus Italien.', 'Seid ihr aus Spanien? Nein, wir seid aus Italien.'], 'Seid ihr aus Spanien? Nein, wir sind aus Italien.'],
				['ro', ['Кто живёт здесь?', 'Who lives here?', 'Хто живе тут?', 'Kto tu mieszka?', '¿Quién vive aquí?', 'Qui habite ici ?', 'Burada kim oturuyor?', 'Cine locuiește aici?', 'Bu yerda kim yashaydi?', 'यहाँ कौन रहता है?', 'من يسكن هنا؟'],
					'Wer wohnt hier', ['wohnst', 'ist']],
				// повторение: вся земля
				['gv', ['Вы хотите пить, господин Шульц?', 'Are you thirsty, Mr Schulz?', 'Ви хочете пити, пане Шульц?', 'Chce się Panu pić, panie Schulz?', '¿Tiene sed, señor Schulz?', 'Vous avez soif, monsieur Schulz ?', 'Susadınız mı, Bay Schulz?', 'Vă e sete, domnule Schulz?', 'Chanqadingizmi, janob Shuls?', 'क्या आपको प्यास लगी है, श्रीमान शुल्ज़?', 'هل حضرتك عطشان يا سيد شولتس؟'],
					'___ Sie Durst, Herr Schulz?', 'Haben'],
				['tr', ['Мы с удовольствием танцуем вместе.', 'We like dancing together.', 'Ми охоче танцюємо разом.', 'Chętnie razem tańczymy.', 'Nos gusta bailar juntos.', 'Nous aimons danser ensemble.', 'Birlikte dans etmeyi severiz.', 'Dansăm împreună cu plăcere.', 'Biz birga raqsga tushishni yaxshi ko‘ramiz.', 'हमें साथ में नाचना पसंद है।', 'نحب الرقص معًا.'],
					['Wir tanzen gern zusammen.', 'Wir tanzt gern zusammen.', 'Wir tanzst gern zusammen.'], 'Wir tanzen gern zusammen.'],
				// повторение: «Восточная равнина»
				['ro', ['Моя сестра сейчас живёт в Вене', 'My sister lives in Vienna now', 'Моя сестра зараз живе у Відні', 'Moja siostra mieszka teraz w Wiedniu', 'Mi hermana vive ahora en Viena', 'Ma sœur habite maintenant à Vienne', 'Kız kardeşim şimdi Viyana’da oturuyor', 'Sora mea locuiește acum la Viena', 'Singlim hozir Venada yashaydi', 'मेरी बहन अब वियना में रहती है', 'أختي تسكن الآن في فيينا'],
					'Meine Schwester wohnt jetzt in Wien', ['wohnst', 'aus']],
				['gw', ['Добрый день! Как дела?', 'Good afternoon! How are you?', 'Добрий день! Як справи?', 'Dzień dobry! Jak się masz?', '¡Buenas tardes! ¿Qué tal?', 'Bonjour ! Ça va ?', 'İyi günler! Nasılsın?', 'Bună ziua! Ce faci?', 'Xayrli kun! Ishlar qalay?', 'नमस्ते! कैसे हो?', 'نهارك سعيد! كيف الحال؟'],
					'Guten ___! Wie geht’s?', 'Tag']
			]
		}
	]
}
