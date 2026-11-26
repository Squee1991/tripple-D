// Грамматика к заданиям земли question-gorge (Ущелье вопросов)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'question-gorge-one': {
		title: {
			ru: 'Вопрос «да или нет»', uk: 'Питання «так чи ні»', en: 'Yes or no questions',
			pl: 'Pytanie „tak czy nie”', es: 'Preguntas de sí o no', fr: 'Questions fermées : oui ou non',
			tr: 'Evet hayır soruları', ro: 'Întrebări „da sau nu”', uz: "\"Ha yoki yo'q\" savoli",
			hi: '"हाँ या ना" वाले सवाल', ar: 'أسئلة "نعم أو لا"'
		},
		points: [
			{
				t: {
					ru: ['Глагол на первое место', 'Чтобы из утверждения сделать вопрос, ставим глагол первым.'],
					uk: ['Дієслово на перше місце', 'Щоб зі ствердження зробити питання, ставимо дієслово першим.'],
					en: ['Verb in first place', 'To turn a statement into a question, put the verb first.'],
					pl: ['Czasownik na pierwsze miejsce', 'Żeby ze zdania zrobić pytanie, stawiamy czasownik na początku.'],
					es: ['El verbo en primer lugar', 'Para convertir una afirmación en pregunta, el verbo va primero.'],
					fr: ['Le verbe en premier', 'Pour transformer une phrase en question, on met le verbe en premier.'],
					tr: ['Fiil başa gelir', 'Cümleyi soru yapmak için fiil başa konur.'],
					ro: ['Verbul pe primul loc', 'Ca să faci dintr-o afirmație o întrebare, pui verbul primul.'],
					uz: ["Fe'l birinchi o'ringa", "Darak gapni savolga aylantirish uchun fe'l birinchi qo'yiladi."],
					hi: ['क्रिया पहले स्थान पर', 'वाक्य को सवाल बनाने के लिए क्रिया को सबसे पहले रखो।'],
					ar: ['الفعل في البداية', 'لتحويل الجملة إلى سؤال نضع الفعل أولاً.']
				},
				examples: [
					ex('Du wohnst hier. → Wohnst du hier?', { ru: 'Ты живёшь здесь. → Ты живёшь здесь?', uk: 'Ти живеш тут. → Ти живеш тут?', en: 'You live here. → Do you live here?', pl: 'Mieszkasz tu. → Mieszkasz tu?', es: 'Vives aquí. → ¿Vives aquí?', fr: 'Tu habites ici. → Tu habites ici ?', tr: 'Burada oturuyorsun. → Burada mı oturuyorsun?', ro: 'Locuiești aici. → Locuiești aici?', uz: 'Sen shu yerda yashaysan. → Shu yerda yashaysanmi?', hi: 'तुम यहाँ रहते हो। → क्या तुम यहाँ रहते हो?', ar: 'أنت تسكن هنا. → هل تسكن هنا؟' }),
					ex('Ja, ich wohne hier.', { ru: 'Да, я живу здесь.', uk: 'Так, я живу тут.', en: 'Yes, I live here.', pl: 'Tak, mieszkam tu.', es: 'Sí, vivo aquí.', fr: 'Oui, j’habite ici.', tr: 'Evet, burada oturuyorum.', ro: 'Da, locuiesc aici.', uz: 'Ha, shu yerda yashayman.', hi: 'हाँ, मैं यहाँ रहता हूँ।', ar: 'نعم، أسكن هنا.' })
				]
			},
			{
				t: {
					ru: ['oder: или', 'oder соединяет варианты на выбор.'],
					uk: ['oder: або', 'oder поєднує варіанти на вибір.'],
					en: ['oder: or', 'oder joins options to choose from.'],
					pl: ['oder: czy, albo', 'oder łączy możliwości do wyboru.'],
					es: ['oder: o', 'oder une opciones para elegir.'],
					fr: ['oder : ou', 'oder relie des choix.'],
					tr: ['oder: veya', 'oder seçenekleri bağlar.'],
					ro: ['oder: sau', 'oder leagă variantele de ales.'],
					uz: ['oder: yoki', "oder tanlov variantlarini bog'laydi."],
					hi: ['oder: या', 'oder विकल्पों को जोड़ता है।'],
					ar: ['oder: أو', 'oder تربط بين الخيارات.']
				},
				examples: [
					ex('Tee oder Kaffee?', { ru: 'Чай или кофе?', uk: 'Чай чи кава?', en: 'Tea or coffee?', pl: 'Herbata czy kawa?', es: '¿Té o café?', fr: 'Thé ou café ?', tr: 'Çay mı kahve mi?', ro: 'Ceai sau cafea?', uz: 'Choymi yoki qahva?', hi: 'चाय या कॉफ़ी?', ar: 'شاي أم قهوة؟' })
				]
			}
		]
	},

	'question-gorge-two': {
		title: {
			ru: 'Кто? Что? Где? Вопросительные слова', uk: 'Хто? Що? Де? Питальні слова', en: 'Who? What? Where? Question words',
			pl: 'Kto? Co? Gdzie? Słowa pytające', es: '¿Quién? ¿Qué? ¿Dónde? Palabras interrogativas', fr: 'Qui ? Quoi ? Où ? Les mots interrogatifs',
			tr: 'Kim? Ne? Nerede? Soru kelimeleri', ro: 'Cine? Ce? Unde? Cuvinte interogative', uz: "Kim? Nima? Qayerda? Savol so'zlari",
			hi: 'कौन? क्या? कहाँ? प्रश्नवाचक शब्द', ar: 'من؟ ماذا؟ أين؟ أدوات الاستفهام'
		},
		points: [
			{
				t: {
					ru: ['Слова-вопросы', 'wer (кто), was (что), wo (где), woher (откуда), wie (как).'],
					uk: ['Слова-питання', 'wer (хто), was (що), wo (де), woher (звідки), wie (як).'],
					en: ['Question words', 'wer (who), was (what), wo (where), woher (where from), wie (how).'],
					pl: ['Słowa pytające', 'wer (kto), was (co), wo (gdzie), woher (skąd), wie (jak).'],
					es: ['Palabras interrogativas', 'wer (quién), was (qué), wo (dónde), woher (de dónde), wie (cómo).'],
					fr: ['Les mots interrogatifs', 'wer (qui), was (quoi), wo (où), woher (d’où), wie (comment).'],
					tr: ['Soru kelimeleri', 'wer (kim), was (ne), wo (nerede), woher (nereden), wie (nasıl).'],
					ro: ['Cuvinte interogative', 'wer (cine), was (ce), wo (unde), woher (de unde), wie (cum).'],
					uz: ["Savol so'zlari", 'wer (kim), was (nima), wo (qayerda), woher (qayerdan), wie (qanday).'],
					hi: ['प्रश्नवाचक शब्द', 'wer (कौन), was (क्या), wo (कहाँ), woher (कहाँ से), wie (कैसे)।'],
					ar: ['أدوات الاستفهام', 'wer (من)، was (ماذا)، wo (أين)، woher (من أين)، wie (كيف).']
				},
				examples: [
					ex('Wer ist das?', { ru: 'Кто это?', uk: 'Хто це?', en: 'Who is that?', pl: 'Kto to jest?', es: '¿Quién es?', fr: 'Qui est-ce ?', tr: 'Bu kim?', ro: 'Cine este?', uz: 'Bu kim?', hi: 'यह कौन है?', ar: 'من هذا؟' }),
					ex('Was machst du?', { ru: 'Что ты делаешь?', uk: 'Що ти робиш?', en: 'What are you doing?', pl: 'Co robisz?', es: '¿Qué haces?', fr: 'Qu’est-ce que tu fais ?', tr: 'Ne yapıyorsun?', ro: 'Ce faci?', uz: 'Nima qilyapsan?', hi: 'तुम क्या कर रहे हो?', ar: 'ماذا تفعل؟' })
				]
			},
			{
				t: {
					ru: ['Порядок слов', 'Вопросительное слово первым, глагол вторым. На такой вопрос нельзя ответить ja или nein.'],
					uk: ['Порядок слів', 'Питальне слово першим, дієслово другим. На таке питання не можна відповісти ja чи nein.'],
					en: ['Word order', 'Question word first, verb second. You can’t answer such a question with ja or nein.'],
					pl: ['Szyk wyrazów', 'Słowo pytające pierwsze, czasownik drugi. Na takie pytanie nie odpowiada się ja ani nein.'],
					es: ['Orden de palabras', 'La palabra interrogativa primero, el verbo segundo. A esta pregunta no se responde con ja o nein.'],
					fr: ['Ordre des mots', 'Mot interrogatif en premier, verbe en deuxième. On ne peut pas répondre par ja ou nein.'],
					tr: ['Kelime sırası', 'Önce soru kelimesi, sonra fiil. Bu soruya ja ya da nein ile cevap verilmez.'],
					ro: ['Ordinea cuvintelor', 'Cuvântul interogativ primul, verbul al doilea. La o astfel de întrebare nu se răspunde cu ja sau nein.'],
					uz: ["So'z tartibi", "Avval savol so'zi, keyin fe'l. Bunday savolga ja yoki nein deb javob berilmaydi."],
					hi: ['शब्द क्रम', 'पहले प्रश्नवाचक शब्द, फिर क्रिया। ऐसे सवाल का जवाब ja या nein से नहीं दिया जाता।'],
					ar: ['ترتيب الكلمات', 'أداة الاستفهام أولاً ثم الفعل ثانياً. ولا يُجاب عن هذا السؤال بـ ja أو nein.']
				},
				examples: [
					ex('Wo arbeitest du?', { ru: 'Где ты работаешь?', uk: 'Де ти працюєш?', en: 'Where do you work?', pl: 'Gdzie pracujesz?', es: '¿Dónde trabajas?', fr: 'Où travailles-tu ?', tr: 'Nerede çalışıyorsun?', ro: 'Unde lucrezi?', uz: 'Qayerda ishlaysan?', hi: 'तुम कहाँ काम करते हो?', ar: 'أين تعمل؟' })
				]
			}
		]
	},

	'question-gorge-three': {
		title: {
			ru: 'Was ist das? Wer ist das?', uk: 'Was ist das? Wer ist das?', en: 'Was ist das? Wer ist das?',
			pl: 'Was ist das? Wer ist das?', es: 'Was ist das? Wer ist das?', fr: 'Was ist das ? Wer ist das ?',
			tr: 'Was ist das? Wer ist das?', ro: 'Was ist das? Wer ist das?', uz: 'Was ist das? Wer ist das?',
			hi: 'Was ist das? Wer ist das?', ar: 'Was ist das? Wer ist das?'
		},
		points: [
			{
				t: {
					ru: ['Про вещи и про людей', 'Про вещь спрашиваем Was ist das?, про человека Wer ist das?'],
					uk: ['Про речі і про людей', 'Про річ питаємо Was ist das?, про людину Wer ist das?'],
					en: ['Things and people', 'Ask Was ist das? about a thing and Wer ist das? about a person.'],
					pl: ['O rzeczy i o ludzi', 'O rzecz pytamy Was ist das?, o człowieka Wer ist das?'],
					es: ['Cosas y personas', 'Por una cosa se pregunta Was ist das?, por una persona Wer ist das?'],
					fr: ['Objets et personnes', 'Pour un objet on demande Was ist das ?, pour une personne Wer ist das ?'],
					tr: ['Eşya ve insan', 'Eşya için Was ist das?, insan için Wer ist das? diye sorulur.'],
					ro: ['Lucruri și oameni', 'Despre un lucru întrebi Was ist das?, despre un om Wer ist das?'],
					uz: ['Narsa va odam haqida', "Narsa haqida Was ist das?, odam haqida Wer ist das? deb so'raladi."],
					hi: ['चीज़ें और लोग', 'चीज़ के बारे में Was ist das?, इंसान के बारे में Wer ist das? पूछते हैं।'],
					ar: ['الأشياء والناس', 'عن الشيء نسأل Was ist das؟، وعن الشخص Wer ist das؟']
				},
				examples: [
					ex('Was ist das? Das ist ein Schrank.', { ru: 'Что это? Это шкаф.', uk: 'Що це? Це шафа.', en: 'What is that? It’s a wardrobe.', pl: 'Co to jest? To szafa.', es: '¿Qué es esto? Es un armario.', fr: 'Qu’est-ce que c’est ? C’est une armoire.', tr: 'Bu ne? Bu bir dolap.', ro: 'Ce este asta? Este un dulap.', uz: 'Bu nima? Bu shkaf.', hi: 'यह क्या है? यह अलमारी है।', ar: 'ما هذا؟ هذه خزانة.' }),
					ex('Wer ist das? Das ist Frau Schmidt.', { ru: 'Кто это? Это госпожа Шмидт.', uk: 'Хто це? Це пані Шмідт.', en: 'Who is that? It’s Ms Schmidt.', pl: 'Kto to jest? To pani Schmidt.', es: '¿Quién es? Es la señora Schmidt.', fr: 'Qui est-ce ? C’est Madame Schmidt.', tr: 'Bu kim? Bu Bayan Schmidt.', ro: 'Cine este? Este doamna Schmidt.', uz: 'Bu kim? Bu Shmidt xonim.', hi: 'यह कौन है? यह श्रीमती श्मिट हैं।', ar: 'من هذه؟ هذه السيدة شميت.' })
				]
			},
			{
				t: {
					ru: ['Какая вещь: Wie ist...?', 'Вопрос о том, как выглядит вещь. В ответе местоимение по роду: der Computer → er.'],
					uk: ['Яка річ: Wie ist...?', 'Питання про те, яка річ. У відповіді займенник за родом: der Computer → er.'],
					en: ['What is it like: Wie ist...?', 'Ask what a thing is like. In the answer use the pronoun by gender: der Computer → er.'],
					pl: ['Jaka jest rzecz: Wie ist...?', 'Pytanie o to, jaka jest rzecz. W odpowiedzi zaimek według rodzaju: der Computer → er.'],
					es: ['Cómo es: Wie ist...?', 'Pregunta cómo es una cosa. En la respuesta, pronombre según el género: der Computer → er.'],
					fr: ['Comment est-il : Wie ist... ?', 'On demande comment est un objet. Dans la réponse, pronom selon le genre : der Computer → er.'],
					tr: ['Nasıl: Wie ist...?', 'Eşyanın nasıl olduğunu sorar. Cevapta cinsiyete göre zamir: der Computer → er.'],
					ro: ['Cum este: Wie ist...?', 'Întrebi cum este un lucru. În răspuns, pronumele după gen: der Computer → er.'],
					uz: ['Qanday: Wie ist...?', "Narsa qandayligini so'raydi. Javobda rodga qarab olmosh: der Computer → er."],
					hi: ['कैसा है: Wie ist...?', 'चीज़ कैसी है, यह पूछते हैं। जवाब में लिंग के अनुसार सर्वनाम: der Computer → er।'],
					ar: ['كيف هو: Wie ist...؟', 'نسأل كيف يبدو الشيء. وفي الجواب نستعمل الضمير حسب الجنس: der Computer → er.']
				},
				examples: [
					ex('Wie ist der Computer? Er ist neu.', { ru: 'Какой компьютер? Он новый.', uk: "Який комп'ютер? Він новий.", en: 'What is the computer like? It’s new.', pl: 'Jaki jest komputer? Jest nowy.', es: '¿Cómo es el ordenador? Es nuevo.', fr: 'Comment est l’ordinateur ? Il est neuf.', tr: 'Bilgisayar nasıl? Yeni.', ro: 'Cum este calculatorul? Este nou.', uz: 'Kompyuter qanday? U yangi.', hi: 'कंप्यूटर कैसा है? वह नया है।', ar: 'كيف هو الحاسوب؟ إنه جديد.' })
				]
			}
		]
	},

	'question-gorge-four': {
		title: {
			ru: 'Отрицание nicht: где оно стоит', uk: 'Заперечення nicht: де воно стоїть', en: 'Negation with nicht: where it goes',
			pl: 'Przeczenie nicht: gdzie stoi', es: 'La negación nicht: dónde va', fr: 'La négation nicht : où la placer',
			tr: 'nicht ile olumsuzluk: nereye gelir', ro: 'Negația nicht: unde stă', uz: 'nicht inkori: qayerda turadi',
			hi: 'nicht से नकार: कहाँ आता है', ar: 'النفي بـ nicht: أين يوضع'
		},
		points: [
			{
				t: {
					ru: ['Перед признаком', 'После sein nicht стоит перед прилагательным.'],
					uk: ['Перед ознакою', 'Після sein nicht стоїть перед прикметником.'],
					en: ['Before the adjective', 'After sein, nicht goes before the adjective.'],
					pl: ['Przed cechą', 'Po sein nicht stoi przed przymiotnikiem.'],
					es: ['Delante del adjetivo', 'Después de sein, nicht va delante del adjetivo.'],
					fr: ['Devant l’adjectif', 'Après sein, nicht se place devant l’adjectif.'],
					tr: ['Sıfattan önce', 'sein’dan sonra nicht sıfattan önce gelir.'],
					ro: ['Înaintea adjectivului', 'După sein, nicht stă înaintea adjectivului.'],
					uz: ['Sifatdan oldin', 'sein dan keyin nicht sifatdan oldin turadi.'],
					hi: ['विशेषण से पहले', 'sein के बाद nicht विशेषण से पहले आता है।'],
					ar: ['قبل الصفة', 'بعد sein تأتي nicht قبل الصفة.']
				},
				examples: [
					ex('Ich bin nicht müde.', { ru: 'Я не устал.', uk: 'Я не втомився.', en: 'I’m not tired.', pl: 'Nie jestem zmęczony.', es: 'No estoy cansado.', fr: 'Je ne suis pas fatigué.', tr: 'Yorgun değilim.', ro: 'Nu sunt obosit.', uz: 'Men charchamaganman.', hi: 'मैं थका नहीं हूँ।', ar: 'لست متعباً.' })
				]
			},
			{
				t: {
					ru: ['В конце предложения', 'С обычным глаголом nicht часто уходит в самый конец.'],
					uk: ['У кінці речення', 'Зі звичайним дієсловом nicht часто йде в самий кінець.'],
					en: ['At the end of the sentence', 'With a normal verb, nicht often goes to the very end.'],
					pl: ['Na końcu zdania', 'Przy zwykłym czasowniku nicht często idzie na sam koniec.'],
					es: ['Al final de la frase', 'Con un verbo normal, nicht suele ir al final.'],
					fr: ['À la fin de la phrase', 'Avec un verbe ordinaire, nicht va souvent tout à la fin.'],
					tr: ['Cümlenin sonunda', 'Normal fiille nicht çoğu zaman en sona gider.'],
					ro: ['La sfârșitul propoziției', 'Cu un verb obișnuit, nicht merge des la final.'],
					uz: ['Gap oxirida', "Oddiy fe'l bilan nicht ko'pincha eng oxiriga o'tadi."],
					hi: ['वाक्य के अंत में', 'सामान्य क्रिया के साथ nicht अक्सर बिल्कुल आखिर में जाता है।'],
					ar: ['في آخر الجملة', 'مع الفعل العادي تذهب nicht غالباً إلى آخر الجملة.']
				},
				examples: [
					ex('Ich arbeite heute nicht.', { ru: 'Сегодня я не работаю.', uk: 'Сьогодні я не працюю.', en: 'I’m not working today.', pl: 'Dziś nie pracuję.', es: 'Hoy no trabajo.', fr: 'Aujourd’hui je ne travaille pas.', tr: 'Bugün çalışmıyorum.', ro: 'Azi nu lucrez.', uz: 'Bugun ishlamayman.', hi: 'आज मैं काम नहीं कर रहा।', ar: 'لا أعمل اليوم.' })
				]
			},
			{
				t: {
					ru: ['Перед местом и gern', 'nicht стоит перед местом (in Berlin) и перед gern.'],
					uk: ['Перед місцем і gern', 'nicht стоїть перед місцем (in Berlin) і перед gern.'],
					en: ['Before a place and gern', 'nicht goes before a place (in Berlin) and before gern.'],
					pl: ['Przed miejscem i gern', 'nicht stoi przed miejscem (in Berlin) i przed gern.'],
					es: ['Delante del lugar y de gern', 'nicht va delante del lugar (in Berlin) y delante de gern.'],
					fr: ['Devant un lieu et gern', 'nicht se place devant un lieu (in Berlin) et devant gern.'],
					tr: ['Yerden ve gern’den önce', 'nicht yerden (in Berlin) ve gern’den önce gelir.'],
					ro: ['Înaintea locului și a lui gern', 'nicht stă înaintea locului (in Berlin) și înaintea lui gern.'],
					uz: ['Joy va gern dan oldin', 'nicht joydan (in Berlin) va gern dan oldin turadi.'],
					hi: ['जगह और gern से पहले', 'nicht जगह (in Berlin) और gern से पहले आता है।'],
					ar: ['قبل المكان وقبل gern', 'تأتي nicht قبل المكان (in Berlin) وقبل gern.']
				},
				examples: [
					ex('Ich wohne nicht in Wien.', { ru: 'Я не живу в Вене.', uk: 'Я не живу у Відні.', en: 'I don’t live in Vienna.', pl: 'Nie mieszkam w Wiedniu.', es: 'No vivo en Viena.', fr: 'Je n’habite pas à Vienne.', tr: 'Viyana’da oturmuyorum.', ro: 'Nu locuiesc la Viena.', uz: 'Men Venada yashamayman.', hi: 'मैं वियना में नहीं रहता।', ar: 'لا أسكن في فيينا.' }),
					ex('Ich trinke nicht gern Kaffee.', { ru: 'Я не люблю кофе.', uk: 'Я не люблю каву.', en: 'I don’t like drinking coffee.', pl: 'Nie lubię pić kawy.', es: 'No me gusta tomar café.', fr: 'Je n’aime pas boire de café.', tr: 'Kahve içmeyi sevmem.', ro: 'Nu-mi place să beau cafea.', uz: "Men qahva ichishni yoqtirmayman.", hi: 'मुझे कॉफ़ी पीना पसंद नहीं।', ar: 'لا أحب شرب القهوة.' })
				]
			}
		]
	},

	'question-gorge-five': {
		title: {
			ru: 'kein: нет никакого', uk: 'kein: немає жодного', en: 'kein: no, not any',
			pl: 'kein: żaden', es: 'kein: ningún', fr: 'kein : pas de',
			tr: 'kein: hiç yok', ro: 'kein: niciun', uz: "kein: hech qanday yo'q",
			hi: 'kein: कोई नहीं', ar: 'kein: لا يوجد أي'
		},
		points: [
			{
				t: {
					ru: ['kein вместо ein', 'kein отрицает предмет. Вместо ein говорим kein, вместо eine говорим keine.'],
					uk: ['kein замість ein', 'kein заперечує предмет. Замість ein кажемо kein, замість eine кажемо keine.'],
					en: ['kein instead of ein', 'kein negates a noun. Say kein instead of ein, keine instead of eine.'],
					pl: ['kein zamiast ein', 'kein zaprzecza przedmiotowi. Zamiast ein mówimy kein, zamiast eine keine.'],
					es: ['kein en lugar de ein', 'kein niega un sustantivo. En vez de ein se dice kein, en vez de eine, keine.'],
					fr: ['kein à la place de ein', 'kein nie un nom. On dit kein au lieu de ein, keine au lieu de eine.'],
					tr: ['ein yerine kein', 'kein ismi olumsuz yapar. ein yerine kein, eine yerine keine denir.'],
					ro: ['kein în loc de ein', 'kein neagă un substantiv. În loc de ein spui kein, în loc de eine, keine.'],
					uz: ['ein o‘rniga kein', "kein otni inkor qiladi. ein o'rniga kein, eine o'rniga keine."],
					hi: ['ein की जगह kein', 'kein संज्ञा का नकार है। ein की जगह kein, eine की जगह keine।'],
					ar: ['kein بدل ein', 'kein تنفي الاسم. نقول kein بدل ein، وkeine بدل eine.']
				},
				examples: [
					ex('Das ist kein Tisch.', { ru: 'Это не стол.', uk: 'Це не стіл.', en: 'This is not a table.', pl: 'To nie jest stół.', es: 'Esto no es una mesa.', fr: 'Ce n’est pas une table.', tr: 'Bu masa değil.', ro: 'Aceasta nu este o masă.', uz: 'Bu stol emas.', hi: 'यह मेज़ नहीं है।', ar: 'هذه ليست طاولة.' }),
					ex('Das ist keine Lampe.', { ru: 'Это не лампа.', uk: 'Це не лампа.', en: 'This is not a lamp.', pl: 'To nie jest lampa.', es: 'Esto no es una lámpara.', fr: 'Ce n’est pas une lampe.', tr: 'Bu lamba değil.', ro: 'Aceasta nu este o lampă.', uz: 'Bu chiroq emas.', hi: 'यह लैंप नहीं है।', ar: 'هذا ليس مصباحاً.' })
				]
			},
			{
				t: {
					ru: ['С haben: keinen', 'После haben слово мужского рода меняется: einen Hund → keinen Hund. Средний и женский род не меняются.'],
					uk: ['З haben: keinen', 'Після haben слово чоловічого роду змінюється: einen Hund → keinen Hund. Середній і жіночий рід не змінюються.'],
					en: ['With haben: keinen', 'After haben a masculine noun changes: einen Hund → keinen Hund. Feminine and neuter stay the same.'],
					pl: ['Z haben: keinen', 'Po haben słowo rodzaju męskiego się zmienia: einen Hund → keinen Hund. Żeński i nijaki się nie zmieniają.'],
					es: ['Con haben: keinen', 'Después de haben el masculino cambia: einen Hund → keinen Hund. Femenino y neutro no cambian.'],
					fr: ['Avec haben : keinen', 'Après haben, le masculin change : einen Hund → keinen Hund. Le féminin et le neutre ne changent pas.'],
					tr: ['haben ile: keinen', 'haben’den sonra eril isim değişir: einen Hund → keinen Hund. Dişil ve nötr değişmez.'],
					ro: ['Cu haben: keinen', 'După haben masculinul se schimbă: einen Hund → keinen Hund. Femininul și neutrul rămân la fel.'],
					uz: ['haben bilan: keinen', "haben dan keyin erkak rodi o'zgaradi: einen Hund → keinen Hund. Ayol va o'rta rod o'zgarmaydi."],
					hi: ['haben के साथ: keinen', 'haben के बाद पुल्लिंग बदलता है: einen Hund → keinen Hund। स्त्रीलिंग और नपुंसकलिंग वैसे ही रहते हैं।'],
					ar: ['مع haben: keinen', 'بعد haben يتغير المذكر: einen Hund → keinen Hund. أما المؤنث والمحايد فلا يتغيران.']
				},
				examples: [
					ex('Wir haben keinen Hund.', { ru: 'У нас нет собаки.', uk: 'У нас немає собаки.', en: 'We don’t have a dog.', pl: 'Nie mamy psa.', es: 'No tenemos perro.', fr: 'Nous n’avons pas de chien.', tr: 'Köpeğimiz yok.', ro: 'Nu avem câine.', uz: "Bizda it yo'q.", hi: 'हमारे पास कुत्ता नहीं है।', ar: 'ليس عندنا كلب.' }),
					ex('Ich habe kein Auto.', { ru: 'У меня нет машины.', uk: 'У мене немає машини.', en: 'I don’t have a car.', pl: 'Nie mam samochodu.', es: 'No tengo coche.', fr: 'Je n’ai pas de voiture.', tr: 'Arabam yok.', ro: 'Nu am mașină.', uz: "Mening mashinam yo'q.", hi: 'मेरे पास गाड़ी नहीं है।', ar: 'ليس عندي سيارة.' })
				]
			},
			{
				t: {
					ru: ['Во множественном keine', 'Во множественном числе всегда keine.'],
					uk: ['У множині keine', 'У множині завжди keine.'],
					en: ['Plural: keine', 'In the plural it is always keine.'],
					pl: ['W liczbie mnogiej keine', 'W liczbie mnogiej zawsze keine.'],
					es: ['En plural keine', 'En plural siempre keine.'],
					fr: ['Au pluriel keine', 'Au pluriel, c’est toujours keine.'],
					tr: ['Çoğulda keine', 'Çoğulda her zaman keine.'],
					ro: ['La plural keine', 'La plural mereu keine.'],
					uz: ["Ko'plikda keine", "Ko'plikda doim keine."],
					hi: ['बहुवचन में keine', 'बहुवचन में हमेशा keine।'],
					ar: ['في الجمع keine', 'في الجمع دائماً keine.']
				},
				examples: [
					ex('Sie haben keine Kinder.', { ru: 'У них нет детей.', uk: 'У них немає дітей.', en: 'They have no children.', pl: 'Nie mają dzieci.', es: 'No tienen hijos.', fr: 'Ils n’ont pas d’enfants.', tr: 'Çocukları yok.', ro: 'Nu au copii.', uz: "Ularning farzandlari yo'q.", hi: 'उनके बच्चे नहीं हैं।', ar: 'ليس عندهم أطفال.' })
				]
			}
		]
	},

	'question-gorge-six': {
		title: {
			ru: 'nicht или kein? И Doch!', uk: 'nicht чи kein? І Doch!', en: 'nicht or kein? And Doch!',
			pl: 'nicht czy kein? I Doch!', es: '¿nicht o kein? Y Doch!', fr: 'nicht ou kein ? Et Doch !',
			tr: 'nicht mi, kein mi? Ve Doch!', ro: 'nicht sau kein? Și Doch!', uz: 'nicht yoki kein? Va Doch!',
			hi: 'nicht या kein? और Doch!', ar: 'nicht أم kein؟ وDoch!'
		},
		points: [
			{
				t: {
					ru: ['Как выбрать', 'Существительное с ein или без артикля отрицаем через kein. Всё остальное через nicht: глагол, прилагательное, слово с der или mein.'],
					uk: ['Як обрати', 'Іменник з ein або без артикля заперечуємо через kein. Усе інше через nicht: дієслово, прикметник, слово з der чи mein.'],
					en: ['How to choose', 'A noun with ein or with no article is negated with kein. Everything else with nicht: a verb, an adjective, a noun with der or mein.'],
					pl: ['Jak wybrać', 'Rzeczownik z ein albo bez rodzajnika przeczymy przez kein. Wszystko inne przez nicht: czasownik, przymiotnik, słowo z der albo mein.'],
					es: ['Cómo elegir', 'Un sustantivo con ein o sin artículo se niega con kein. Todo lo demás con nicht: verbo, adjetivo, palabra con der o mein.'],
					fr: ['Comment choisir', 'Un nom avec ein ou sans article se nie avec kein. Tout le reste avec nicht : un verbe, un adjectif, un nom avec der ou mein.'],
					tr: ['Nasıl seçilir', 'ein’li ya da artikelsiz isim kein ile olumsuz olur. Geri kalan her şey nicht ile: fiil, sıfat, der ya da mein’li isim.'],
					ro: ['Cum alegi', 'Un substantiv cu ein sau fără articol se neagă cu kein. Tot restul cu nicht: verbul, adjectivul, cuvântul cu der sau mein.'],
					uz: ['Qanday tanlash kerak', "ein li yoki artiklsiz ot kein bilan inkor qilinadi. Qolgan hammasi nicht bilan: fe'l, sifat, der yoki mein li so'z."],
					hi: ['कैसे चुनें', 'ein वाली या बिना आर्टिकल वाली संज्ञा का नकार kein से। बाकी सब nicht से: क्रिया, विशेषण, der या mein वाला शब्द।'],
					ar: ['كيف تختار', 'الاسم مع ein أو بدون أداة ننفيه بـ kein. وكل ما عدا ذلك بـ nicht: الفعل والصفة والاسم مع der أو mein.']
				},
				examples: [
					ex('Ich habe kein Fahrrad.', { ru: 'У меня нет велосипеда.', uk: 'У мене немає велосипеда.', en: 'I don’t have a bike.', pl: 'Nie mam roweru.', es: 'No tengo bicicleta.', fr: 'Je n’ai pas de vélo.', tr: 'Bisikletim yok.', ro: 'Nu am bicicletă.', uz: "Mening velosipedim yo'q.", hi: 'मेरे पास साइकिल नहीं है।', ar: 'ليس عندي دراجة.' }),
					ex('Das ist nicht mein Fahrrad.', { ru: 'Это не мой велосипед.', uk: 'Це не мій велосипед.', en: 'That’s not my bike.', pl: 'To nie mój rower.', es: 'Esa no es mi bicicleta.', fr: 'Ce n’est pas mon vélo.', tr: 'Bu benim bisikletim değil.', ro: 'Nu este bicicleta mea.', uz: 'Bu mening velosipedim emas.', hi: 'यह मेरी साइकिल नहीं है।', ar: 'هذه ليست دراجتي.' })
				]
			},
			{
				t: {
					ru: ['Doch!', 'Если вопрос с отрицанием, а ответ «да», говорим не ja, а Doch!'],
					uk: ['Doch!', 'Якщо питання із запереченням, а відповідь «так», кажемо не ja, а Doch!'],
					en: ['Doch!', 'If the question is negative and your answer is "yes", say Doch! instead of ja.'],
					pl: ['Doch!', 'Jeśli pytanie jest z przeczeniem, a odpowiedź „tak”, mówimy nie ja, tylko Doch!'],
					es: ['Doch!', 'Si la pregunta es negativa y la respuesta es "sí", se dice Doch! y no ja.'],
					fr: ['Doch !', 'Si la question est négative et que la réponse est « oui », on dit Doch ! et pas ja (comme « si ! » en français).'],
					tr: ['Doch!', 'Soru olumsuzsa ve cevap "evet" ise ja değil Doch! denir.'],
					ro: ['Doch!', 'Dacă întrebarea e negativă și răspunsul e „ba da”, spui Doch!, nu ja.'],
					uz: ['Doch!', "Savol inkor shaklida bo'lsa, javob esa \"ha\" bo'lsa, ja emas, Doch! deyiladi."],
					hi: ['Doch!', 'अगर सवाल नकारात्मक है और जवाब "हाँ" है, तो ja नहीं, Doch! कहते हैं।'],
					ar: ['Doch!', 'إذا كان السؤال منفياً والجواب "بلى" نقول Doch! وليس ja.']
				},
				examples: [
					ex('Hast du keine Zeit? Doch!', { ru: 'У тебя нет времени? Да нет же, есть!', uk: 'У тебе немає часу? Та ні, є!', en: 'Don’t you have time? Yes, I do!', pl: 'Nie masz czasu? Ależ mam!', es: '¿No tienes tiempo? ¡Que sí!', fr: 'Tu n’as pas le temps ? Si !', tr: 'Vaktin yok mu? Var tabii!', ro: 'Nu ai timp? Ba da!', uz: "Vaqting yo'qmi? Bor, albatta!", hi: 'तुम्हारे पास समय नहीं है? है न!', ar: 'أليس عندك وقت؟ بلى!' })
				]
			}
		]
	},

	'question-gorge-seven': {
		title: {
			ru: 'Практика: в гостях', uk: 'Практика: у гостях', en: 'Practice: visiting a friend',
			pl: 'Praktyka: w gościach', es: 'Práctica: de visita', fr: 'Pratique : en visite',
			tr: 'Pratik: misafirlikte', ro: 'Practică: în vizită', uz: 'Mashq: mehmonda',
			hi: 'अभ्यास: मेहमान बनकर', ar: 'تدريب: في زيارة'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Задаём вопросы и отвечаем с nicht или kein, как в прошлых заданиях.'],
					uk: ['Нових правил немає', 'Ставимо питання і відповідаємо з nicht чи kein, як у минулих завданнях.'],
					en: ['No new rules', 'Ask questions and answer with nicht or kein, like in the previous tasks.'],
					pl: ['Bez nowych reguł', 'Zadajemy pytania i odpowiadamy z nicht albo kein, jak w poprzednich zadaniach.'],
					es: ['Sin reglas nuevas', 'Hacemos preguntas y respondemos con nicht o kein, como en las tareas anteriores.'],
					fr: ['Pas de nouvelle règle', 'On pose des questions et on répond avec nicht ou kein, comme dans les tâches précédentes.'],
					tr: ['Yeni kural yok', 'Önceki görevlerdeki gibi soru sorup nicht ya da kein ile cevap veriyoruz.'],
					ro: ['Fără reguli noi', 'Punem întrebări și răspundem cu nicht sau kein, ca în sarcinile anterioare.'],
					uz: ["Yangi qoida yo'q", "Avvalgi topshiriqlardagidek savol beramiz va nicht yoki kein bilan javob beramiz."],
					hi: ['कोई नया नियम नहीं', 'पिछले कार्यों की तरह सवाल पूछते हैं और nicht या kein से जवाब देते हैं।'],
					ar: ['لا قواعد جديدة', 'نطرح الأسئلة ونجيب بـ nicht أو kein كما في المهام السابقة.']
				},
				examples: [
					ex('Ist das deine Wohnung?', { ru: 'Это твоя квартира?', uk: 'Це твоя квартира?', en: 'Is this your flat?', pl: 'To twoje mieszkanie?', es: '¿Es este tu piso?', fr: 'C’est ton appartement ?', tr: 'Bu senin dairen mi?', ro: 'Acesta e apartamentul tău?', uz: 'Bu sening kvartirangmi?', hi: 'क्या यह तुम्हारा फ़्लैट है?', ar: 'هل هذه شقتك؟' }),
					ex('Nein, wir haben keinen Balkon.', { ru: 'Нет, у нас нет балкона.', uk: 'Ні, у нас немає балкона.', en: 'No, we don’t have a balcony.', pl: 'Nie, nie mamy balkonu.', es: 'No, no tenemos balcón.', fr: 'Non, nous n’avons pas de balcon.', tr: 'Hayır, balkonumuz yok.', ro: 'Nu, nu avem balcon.', uz: "Yo'q, bizda balkon yo'q.", hi: 'नहीं, हमारे पास बालकनी नहीं है।', ar: 'لا، ليس عندنا شرفة.' })
				]
			}
		]
	},

	'question-gorge-eight': {
		title: {
			ru: 'Практика: интервью', uk: 'Практика: інтерв’ю', en: 'Practice: an interview',
			pl: 'Praktyka: wywiad', es: 'Práctica: una entrevista', fr: 'Pratique : une interview',
			tr: 'Pratik: röportaj', ro: 'Practică: interviu', uz: 'Mashq: intervyu',
			hi: 'अभ्यास: साक्षात्कार', ar: 'تدريب: مقابلة'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Что любишь делать: глагол + gern. Не любишь: nicht gern.'],
					uk: ['Нових правил немає', 'Що любиш робити: дієслово + gern. Не любиш: nicht gern.'],
					en: ['No new rules', 'What you like doing: verb + gern. What you don’t like: nicht gern.'],
					pl: ['Bez nowych reguł', 'Co lubisz robić: czasownik + gern. Czego nie lubisz: nicht gern.'],
					es: ['Sin reglas nuevas', 'Lo que te gusta hacer: verbo + gern. Lo que no: nicht gern.'],
					fr: ['Pas de nouvelle règle', 'Ce que tu aimes faire : verbe + gern. Ce que tu n’aimes pas : nicht gern.'],
					tr: ['Yeni kural yok', 'Yapmayı sevdiğin şey: fiil + gern. Sevmediğin: nicht gern.'],
					ro: ['Fără reguli noi', 'Ce îți place să faci: verb + gern. Ce nu-ți place: nicht gern.'],
					uz: ["Yangi qoida yo'q", "Nimani yaxshi ko'rasan: fe'l + gern. Yoqtirmasang: nicht gern."],
					hi: ['कोई नया नियम नहीं', 'जो करना पसंद है: क्रिया + gern। जो पसंद नहीं: nicht gern।'],
					ar: ['لا قواعد جديدة', 'ما تحب فعله: الفعل + gern. وما لا تحبه: nicht gern.']
				},
				examples: [
					ex('Was machst du gern?', { ru: 'Что ты любишь делать?', uk: 'Що ти любиш робити?', en: 'What do you like doing?', pl: 'Co lubisz robić?', es: '¿Qué te gusta hacer?', fr: 'Qu’est-ce que tu aimes faire ?', tr: 'Ne yapmayı seversin?', ro: 'Ce îți place să faci?', uz: "Nima qilishni yaxshi ko'rasan?", hi: 'तुम्हें क्या करना पसंद है?', ar: 'ماذا تحب أن تفعل؟' }),
					ex('Nein, ich koche nicht gern.', { ru: 'Нет, я не люблю готовить.', uk: 'Ні, я не люблю готувати.', en: 'No, I don’t like cooking.', pl: 'Nie, nie lubię gotować.', es: 'No, no me gusta cocinar.', fr: 'Non, je n’aime pas cuisiner.', tr: 'Hayır, yemek yapmayı sevmem.', ro: 'Nu, nu-mi place să gătesc.', uz: "Yo'q, ovqat pishirishni yoqtirmayman.", hi: 'नहीं, मुझे खाना बनाना पसंद नहीं।', ar: 'لا، لا أحب الطبخ.' })
				]
			}
		]
	},

	'question-gorge-nine': {
		title: {
			ru: 'Повторение: как часто?', uk: 'Повторення: як часто?', en: 'Review: how often?',
			pl: 'Powtórka: jak często?', es: 'Repaso: ¿con qué frecuencia?', fr: 'Révision : à quelle fréquence ?',
			tr: 'Tekrar: ne sıklıkla?', ro: 'Recapitulare: cât de des?', uz: 'Takrorlash: qanchalik tez-tez?',
			hi: 'दोहराव: कितनी बार?', ar: 'مراجعة: كم مرة؟'
		},
		points: [
			{
				t: {
					ru: ['Слова частоты', 'immer (всегда), oft (часто), manchmal (иногда), nie (никогда). Стоят сразу после глагола.'],
					uk: ['Слова частоти', 'immer (завжди), oft (часто), manchmal (іноді), nie (ніколи). Стоять одразу після дієслова.'],
					en: ['Frequency words', 'immer (always), oft (often), manchmal (sometimes), nie (never). They come right after the verb.'],
					pl: ['Słowa częstotliwości', 'immer (zawsze), oft (często), manchmal (czasem), nie (nigdy). Stoją zaraz po czasowniku.'],
					es: ['Palabras de frecuencia', 'immer (siempre), oft (a menudo), manchmal (a veces), nie (nunca). Van justo después del verbo.'],
					fr: ['Mots de fréquence', 'immer (toujours), oft (souvent), manchmal (parfois), nie (jamais). Ils viennent juste après le verbe.'],
					tr: ['Sıklık kelimeleri', 'immer (her zaman), oft (sık), manchmal (bazen), nie (asla). Fiilden hemen sonra gelir.'],
					ro: ['Cuvinte de frecvență', 'immer (mereu), oft (des), manchmal (uneori), nie (niciodată). Vin imediat după verb.'],
					uz: ["Takror so'zlari", "immer (doim), oft (tez-tez), manchmal (ba'zan), nie (hech qachon). Fe'ldan keyin darhol turadi."],
					hi: ['आवृत्ति के शब्द', 'immer (हमेशा), oft (अक्सर), manchmal (कभी-कभी), nie (कभी नहीं)। ये क्रिया के ठीक बाद आते हैं।'],
					ar: ['كلمات التكرار', 'immer (دائماً)، oft (غالباً)، manchmal (أحياناً)، nie (أبداً). تأتي مباشرة بعد الفعل.']
				},
				examples: [
					ex('Er trinkt immer Tee mit Milch.', { ru: 'Он всегда пьёт чай с молоком.', uk: 'Він завжди п’є чай з молоком.', en: 'He always drinks tea with milk.', pl: 'On zawsze pije herbatę z mlekiem.', es: 'Él siempre toma té con leche.', fr: 'Il boit toujours du thé au lait.', tr: 'O hep sütlü çay içer.', ro: 'El bea mereu ceai cu lapte.', uz: 'U doim sutli choy ichadi.', hi: 'वह हमेशा दूध वाली चाय पीता है।', ar: 'هو يشرب دائماً شاياً بالحليب.' }),
					ex('Ich trinke nie Kaffee.', { ru: 'Я никогда не пью кофе.', uk: 'Я ніколи не п’ю каву.', en: 'I never drink coffee.', pl: 'Nigdy nie piję kawy.', es: 'Nunca tomo café.', fr: 'Je ne bois jamais de café.', tr: 'Hiç kahve içmem.', ro: 'Nu beau niciodată cafea.', uz: 'Men hech qachon qahva ichmayman.', hi: 'मैं कभी कॉफ़ी नहीं पीता।', ar: 'لا أشرب القهوة أبداً.' })
				]
			},
			{
				t: {
					ru: ['nie без второго «не»', 'nie уже значит «никогда не». Второе nicht не нужно.'],
					uk: ['nie без другого «не»', 'nie вже означає «ніколи не». Друге nicht не потрібне.'],
					en: ['nie needs no second "not"', 'nie already means "never". Don’t add nicht.'],
					pl: ['nie bez drugiego „nie”', 'nie już znaczy „nigdy nie”. Drugie nicht nie jest potrzebne.'],
					es: ['nie sin segundo "no"', 'nie ya significa "nunca". No hace falta nicht.'],
					fr: ['nie sans deuxième négation', 'nie veut déjà dire « ne ... jamais ». On n’ajoute pas nicht.'],
					tr: ['nie ile ikinci olumsuzluk yok', 'nie zaten "asla" demektir. Ayrıca nicht gerekmez.'],
					ro: ['nie fără al doilea „nu”', 'nie înseamnă deja „niciodată”. Nu mai adăugăm nicht.'],
					uz: ["nie bilan ikkinchi inkor kerak emas", "nie o'zi \"hech qachon\" degani. nicht qo'shilmaydi."],
					hi: ['nie के साथ दूसरा "नहीं" नहीं', 'nie का मतलब ही "कभी नहीं" है। nicht नहीं जोड़ते।'],
					ar: ['nie بدون نفي ثانٍ', 'nie تعني "أبداً" بنفسها. لا نضيف nicht.']
				},
				examples: []
			}
		]
	},

	'question-gorge-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Порядок слов в вопросе', 'Без вопросительного слова глагол первым. С вопросительным словом глагол вторым.'],
					uk: ['Порядок слів у питанні', 'Без питального слова дієслово першим. З питальним словом дієслово другим.'],
					en: ['Word order in questions', 'Without a question word the verb is first. With a question word the verb is second.'],
					pl: ['Szyk w pytaniu', 'Bez słowa pytającego czasownik pierwszy. Ze słowem pytającym czasownik drugi.'],
					es: ['Orden en la pregunta', 'Sin palabra interrogativa, el verbo primero. Con palabra interrogativa, el verbo segundo.'],
					fr: ['Ordre dans la question', 'Sans mot interrogatif, le verbe en premier. Avec un mot interrogatif, le verbe en deuxième.'],
					tr: ['Soruda kelime sırası', 'Soru kelimesi yoksa fiil başta. Soru kelimesi varsa fiil ikinci.'],
					ro: ['Ordinea în întrebare', 'Fără cuvânt interogativ, verbul primul. Cu cuvânt interogativ, verbul al doilea.'],
					uz: ["Savolda so'z tartibi", "Savol so'zisiz fe'l birinchi. Savol so'zi bilan fe'l ikkinchi."],
					hi: ['सवाल में शब्द क्रम', 'प्रश्नवाचक शब्द के बिना क्रिया पहले। प्रश्नवाचक शब्द के साथ क्रिया दूसरे स्थान पर।'],
					ar: ['ترتيب السؤال', 'بدون أداة استفهام يأتي الفعل أولاً. ومع أداة الاستفهام يأتي الفعل ثانياً.']
				},
				examples: [
					ex('Kommst du? Wo ist das Problem?', { ru: 'Ты придёшь? Где проблема?', uk: 'Ти прийдеш? Де проблема?', en: 'Are you coming? Where is the problem?', pl: 'Przyjdziesz? Gdzie jest problem?', es: '¿Vienes? ¿Dónde está el problema?', fr: 'Tu viens ? Où est le problème ?', tr: 'Geliyor musun? Sorun nerede?', ro: 'Vii? Unde e problema?', uz: 'Kelasanmi? Muammo qayerda?', hi: 'क्या तुम आओगे? समस्या कहाँ है?', ar: 'هل ستأتي؟ أين المشكلة؟' })
				]
			},
			{
				t: {
					ru: ['nicht или kein', 'kein для существительного с ein или без артикля, nicht для всего остального.'],
					uk: ['nicht чи kein', 'kein для іменника з ein або без артикля, nicht для всього іншого.'],
					en: ['nicht or kein', 'kein for a noun with ein or no article, nicht for everything else.'],
					pl: ['nicht czy kein', 'kein dla rzeczownika z ein albo bez rodzajnika, nicht dla wszystkiego innego.'],
					es: ['nicht o kein', 'kein para un sustantivo con ein o sin artículo, nicht para todo lo demás.'],
					fr: ['nicht ou kein', 'kein pour un nom avec ein ou sans article, nicht pour tout le reste.'],
					tr: ['nicht mi, kein mi', 'ein’li ya da artikelsiz isim için kein, geri kalan her şey için nicht.'],
					ro: ['nicht sau kein', 'kein pentru substantiv cu ein sau fără articol, nicht pentru restul.'],
					uz: ['nicht yoki kein', "ein li yoki artiklsiz ot uchun kein, qolgan hammasi uchun nicht."],
					hi: ['nicht या kein', 'ein वाली या बिना आर्टिकल वाली संज्ञा के लिए kein, बाकी सबके लिए nicht।'],
					ar: ['nicht أم kein', 'kein للاسم مع ein أو بدون أداة، وnicht لكل ما عدا ذلك.']
				},
				examples: [
					ex('Das ist kein Problem.', { ru: 'Это не проблема.', uk: 'Це не проблема.', en: 'That’s no problem.', pl: 'To żaden problem.', es: 'No es ningún problema.', fr: 'Ce n’est pas un problème.', tr: 'Sorun değil.', ro: 'Nu e nicio problemă.', uz: 'Bu muammo emas.', hi: 'यह कोई समस्या नहीं है।', ar: 'هذه ليست مشكلة.' }),
					ex('Ich habe leider keine Zeit.', { ru: 'К сожалению, у меня нет времени.', uk: 'На жаль, у мене немає часу.', en: 'Unfortunately I have no time.', pl: 'Niestety nie mam czasu.', es: 'Por desgracia no tengo tiempo.', fr: 'Malheureusement, je n’ai pas le temps.', tr: 'Maalesef vaktim yok.', ro: 'Din păcate nu am timp.', uz: "Afsuski, vaqtim yo'q.", hi: 'माफ़ करना, मेरे पास समय नहीं है।', ar: 'للأسف ليس عندي وقت.' })
				]
			},
			{
				t: {
					ru: ['Doch!', 'На вопрос с отрицанием отвечаем «да» словом Doch!'],
					uk: ['Doch!', 'На питання із запереченням відповідаємо «так» словом Doch!'],
					en: ['Doch!', 'Answer "yes" to a negative question with Doch!'],
					pl: ['Doch!', 'Na pytanie z przeczeniem odpowiadamy „tak” słowem Doch!'],
					es: ['Doch!', 'A una pregunta negativa se responde "sí" con Doch!'],
					fr: ['Doch !', 'À une question négative, on répond « oui » par Doch !'],
					tr: ['Doch!', 'Olumsuz soruya "evet" cevabı Doch! ile verilir.'],
					ro: ['Doch!', 'La o întrebare negativă răspunzi „ba da” cu Doch!'],
					uz: ['Doch!', "Inkor savolga \"ha\" javobi Doch! bilan beriladi."],
					hi: ['Doch!', 'नकारात्मक सवाल का "हाँ" वाला जवाब Doch! से देते हैं।'],
					ar: ['Doch!', 'نجيب بـ "بلى" عن السؤال المنفي بكلمة Doch!']
				},
				examples: [
					ex('Hast du keinen Hunger? Doch, natürlich!', { ru: 'Ты не голоден? Конечно, голоден!', uk: 'Ти не голодний? Звісно, голодний!', en: 'Aren’t you hungry? Of course I am!', pl: 'Nie jesteś głodny? Ależ oczywiście!', es: '¿No tienes hambre? ¡Claro que sí!', fr: 'Tu n’as pas faim ? Si, bien sûr !', tr: 'Aç değil misin? Tabii ki açım!', ro: 'Nu ți-e foame? Ba da, sigur!', uz: 'Qorning och emasmi? Albatta och!', hi: 'तुम्हें भूख नहीं है? बिल्कुल है!', ar: 'ألست جائعاً؟ بلى، طبعاً!' })
				]
			}
		]
	}
}

module.exports = quests
