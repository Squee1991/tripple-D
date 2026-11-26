// Грамматика к заданиям земли routine-mill (Мельница будней: отделяемые приставки)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'routine-mill-one': {
		title: {
			ru: 'Отделяемая приставка: aufstehen', uk: 'Відокремлюваний префікс: aufstehen', en: 'Separable prefix: aufstehen',
			pl: 'Przedrostek rozdzielny: aufstehen', es: 'Prefijo separable: aufstehen', fr: 'Préfixe séparable : aufstehen',
			tr: 'Ayrılabilen ön ek: aufstehen', ro: 'Prefix separabil: aufstehen', uz: 'Ajraladigan old qo‘shimcha: aufstehen',
			hi: 'अलग होने वाला उपसर्ग: aufstehen', ar: 'السابقة المنفصلة: aufstehen'
		},
		points: [
			{
				t: {
					ru: ['Приставка уходит в конец', 'У таких глаголов приставка в предложении уходит в самый конец: aufstehen → Ich stehe ... auf.'],
					uk: ['Префікс іде в кінець', 'У таких дієсловах префікс у реченні йде в самий кінець: aufstehen → Ich stehe ... auf.'],
					en: ['The prefix goes to the end', 'With these verbs the prefix goes to the very end of the sentence: aufstehen → Ich stehe ... auf.'],
					pl: ['Przedrostek idzie na koniec', 'W takich czasownikach przedrostek idzie na sam koniec zdania: aufstehen → Ich stehe ... auf.'],
					es: ['El prefijo va al final', 'En estos verbos el prefijo va al final de la frase: aufstehen → Ich stehe ... auf.'],
					fr: ['Le préfixe va à la fin', 'Avec ces verbes, le préfixe va tout à la fin de la phrase : aufstehen → Ich stehe ... auf.'],
					tr: ['Ön ek sona gider', 'Bu fiillerde ön ek cümlenin en sonuna gider: aufstehen → Ich stehe ... auf.'],
					ro: ['Prefixul merge la final', 'La aceste verbe prefixul merge la sfârșitul propoziției: aufstehen → Ich stehe ... auf.'],
					uz: ["Old qo'shimcha oxiriga o'tadi", "Bunday fe'llarda old qo'shimcha gapning eng oxiriga o'tadi: aufstehen → Ich stehe ... auf."],
					hi: ['उपसर्ग अंत में जाता है', 'ऐसी क्रियाओं में उपसर्ग वाक्य के बिल्कुल अंत में जाता है: aufstehen → Ich stehe ... auf।'],
					ar: ['السابقة تذهب إلى الآخر', 'في هذه الأفعال تذهب السابقة إلى آخر الجملة: aufstehen → Ich stehe ... auf.']
				},
				examples: [
					ex('Ich stehe um sieben Uhr auf.', { ru: 'Я встаю в семь часов.', uk: 'Я встаю о сьомій.', en: 'I get up at seven.', pl: 'Wstaję o siódmej.', es: 'Me levanto a las siete.', fr: 'Je me lève à sept heures.', tr: 'Saat yedide kalkarım.', ro: 'Mă trezesc la șapte.', uz: 'Men soat yettida turaman.', hi: 'मैं सात बजे उठता हूँ।', ar: 'أستيقظ في السابعة.' }),
					ex('Er wacht früh auf.', { ru: 'Он просыпается рано.', uk: 'Він прокидається рано.', en: 'He wakes up early.', pl: 'On budzi się wcześnie.', es: 'Él se despierta temprano.', fr: 'Il se réveille tôt.', tr: 'O erken uyanır.', ro: 'El se trezește devreme.', uz: 'U erta uyg‘onadi.', hi: 'वह जल्दी जागता है।', ar: 'هو يستيقظ مبكراً.' })
				]
			},
			{
				t: {
					ru: ['Глагол меняется как обычно', 'Основная часть стоит на втором месте и меняется как обычно: ich stehe, du stehst. Приставка всегда одна и та же.'],
					uk: ['Дієслово змінюється як зазвичай', 'Основна частина стоїть на другому місці й змінюється як зазвичай: ich stehe, du stehst. Префікс завжди той самий.'],
					en: ['The verb changes as usual', 'The main part is in second place and changes as usual: ich stehe, du stehst. The prefix never changes.'],
					pl: ['Czasownik odmienia się normalnie', 'Główna część stoi na drugim miejscu i odmienia się normalnie: ich stehe, du stehst. Przedrostek się nie zmienia.'],
					es: ['El verbo cambia como siempre', 'La parte principal va en segundo lugar y cambia como siempre: ich stehe, du stehst. El prefijo no cambia.'],
					fr: ['Le verbe change normalement', 'La partie principale est en deuxième position et change normalement : ich stehe, du stehst. Le préfixe ne change jamais.'],
					tr: ['Fiil normal değişir', 'Ana kısım ikinci sıradadır ve normal değişir: ich stehe, du stehst. Ön ek hiç değişmez.'],
					ro: ['Verbul se schimbă normal', 'Partea principală stă pe locul doi și se schimbă normal: ich stehe, du stehst. Prefixul nu se schimbă.'],
					uz: ["Fe'l odatdagidek o'zgaradi", "Asosiy qism ikkinchi o'rinda turadi va odatdagidek o'zgaradi: ich stehe, du stehst. Old qo'shimcha o'zgarmaydi."],
					hi: ['क्रिया सामान्य रूप से बदलती है', 'मुख्य हिस्सा दूसरे स्थान पर रहता है और सामान्य रूप से बदलता है: ich stehe, du stehst। उपसर्ग नहीं बदलता।'],
					ar: ['الفعل يتغير كالعادة', 'الجزء الأساسي في المكان الثاني ويتغير كالعادة: ich stehe، du stehst. والسابقة لا تتغير.']
				},
				examples: [
					ex('Wann stehst du auf?', { ru: 'Во сколько ты встаёшь?', uk: 'О котрій ти встаєш?', en: 'When do you get up?', pl: 'O której wstajesz?', es: '¿A qué hora te levantas?', fr: 'À quelle heure te lèves-tu ?', tr: 'Ne zaman kalkarsın?', ro: 'Când te trezești?', uz: 'Soat nechada turasan?', hi: 'तुम कब उठते हो?', ar: 'متى تستيقظ؟' })
				]
			}
		]
	},

	'routine-mill-two': {
		title: {
			ru: 'einkaufen, aufräumen', uk: 'einkaufen, aufräumen', en: 'einkaufen, aufräumen',
			pl: 'einkaufen, aufräumen', es: 'einkaufen, aufräumen', fr: 'einkaufen, aufräumen',
			tr: 'einkaufen, aufräumen', ro: 'einkaufen, aufräumen', uz: 'einkaufen, aufräumen',
			hi: 'einkaufen, aufräumen', ar: 'einkaufen وaufräumen'
		},
		points: [
			{
				t: {
					ru: ['Предмет посередине', 'Если есть предмет, он стоит между глаголом и приставкой. Приставка всё равно в конце.'],
					uk: ['Предмет посередині', 'Якщо є предмет, він стоїть між дієсловом і префіксом. Префікс однаково в кінці.'],
					en: ['The object goes in the middle', 'If there is an object, it sits between the verb and the prefix. The prefix is still at the end.'],
					pl: ['Przedmiot w środku', 'Jeśli jest dopełnienie, stoi między czasownikiem a przedrostkiem. Przedrostek i tak na końcu.'],
					es: ['El objeto en medio', 'Si hay un objeto, va entre el verbo y el prefijo. El prefijo sigue al final.'],
					fr: ['Le complément au milieu', 'S’il y a un complément, il se place entre le verbe et le préfixe. Le préfixe reste à la fin.'],
					tr: ['Nesne ortada', 'Nesne varsa fiil ile ön ek arasına girer. Ön ek yine sondadır.'],
					ro: ['Obiectul la mijloc', 'Dacă există un obiect, stă între verb și prefix. Prefixul rămâne la final.'],
					uz: ["Narsa o'rtada", "Narsa bo'lsa, u fe'l va old qo'shimcha orasida turadi. Old qo'shimcha baribir oxirida."],
					hi: ['कर्म बीच में', 'अगर कर्म है, तो वह क्रिया और उपसर्ग के बीच आता है। उपसर्ग फिर भी अंत में।'],
					ar: ['المفعول في الوسط', 'إذا وُجد مفعول يقع بين الفعل والسابقة، وتبقى السابقة في الآخر.']
				},
				examples: [
					ex('Er räumt sein Zimmer auf.', { ru: 'Он убирает свою комнату.', uk: 'Він прибирає свою кімнату.', en: 'He tidies his room.', pl: 'On sprząta swój pokój.', es: 'Él ordena su habitación.', fr: 'Il range sa chambre.', tr: 'O odasını topluyor.', ro: 'El își face ordine în cameră.', uz: 'U xonasini yig‘ishtiradi.', hi: 'वह अपना कमरा साफ़ करता है।', ar: 'هو يرتب غرفته.' })
				]
			},
			{
				t: {
					ru: ['kaufen или einkaufen', 'kaufen значит купить что-то конкретное. einkaufen значит ходить за покупками.'],
					uk: ['kaufen чи einkaufen', 'kaufen означає купити щось конкретне. einkaufen означає ходити по покупки.'],
					en: ['kaufen or einkaufen', 'kaufen means to buy something specific. einkaufen means to go shopping.'],
					pl: ['kaufen czy einkaufen', 'kaufen to kupić coś konkretnego. einkaufen to robić zakupy.'],
					es: ['kaufen o einkaufen', 'kaufen es comprar algo concreto. einkaufen es hacer la compra.'],
					fr: ['kaufen ou einkaufen', 'kaufen, c’est acheter quelque chose de précis. einkaufen, c’est faire les courses.'],
					tr: ['kaufen mi, einkaufen mi', 'kaufen belli bir şey satın almaktır. einkaufen alışverişe gitmektir.'],
					ro: ['kaufen sau einkaufen', 'kaufen înseamnă a cumpăra ceva anume. einkaufen înseamnă a merge la cumpărături.'],
					uz: ['kaufen yoki einkaufen', "kaufen aniq bir narsani sotib olish. einkaufen xarid qilishga borish."],
					hi: ['kaufen या einkaufen', 'kaufen मतलब कोई खास चीज़ खरीदना। einkaufen मतलब खरीदारी करने जाना।'],
					ar: ['kaufen أم einkaufen', 'kaufen تعني شراء شيء محدد. وeinkaufen تعني التسوق.']
				},
				examples: [
					ex('Am Samstag kaufe ich ein.', { ru: 'В субботу я хожу за покупками.', uk: 'У суботу я ходжу по покупки.', en: 'On Saturday I go shopping.', pl: 'W sobotę robię zakupy.', es: 'El sábado hago la compra.', fr: 'Samedi, je fais les courses.', tr: 'Cumartesi alışveriş yaparım.', ro: 'Sâmbătă fac cumpărături.', uz: 'Shanba kuni xarid qilaman.', hi: 'शनिवार को मैं खरीदारी करता हूँ।', ar: 'يوم السبت أتسوق.' })
				]
			}
		]
	},

	'routine-mill-three': {
		title: {
			ru: 'anrufen, fernsehen', uk: 'anrufen, fernsehen', en: 'anrufen, fernsehen',
			pl: 'anrufen, fernsehen', es: 'anrufen, fernsehen', fr: 'anrufen, fernsehen',
			tr: 'anrufen, fernsehen', ro: 'anrufen, fernsehen', uz: 'anrufen, fernsehen',
			hi: 'anrufen, fernsehen', ar: 'anrufen وfernsehen'
		},
		points: [
			{
				t: {
					ru: ['anrufen + кого', 'После anrufen человек в Akkusativ: Ich rufe meinen Vater an. По-русски «кому», по-немецки «кого».'],
					uk: ['anrufen + кого', 'Після anrufen людина в Akkusativ: Ich rufe meinen Vater an. Українською «кому», німецькою «кого».'],
					en: ['anrufen + whom', 'After anrufen the person is in the accusative: Ich rufe meinen Vater an.'],
					pl: ['anrufen + kogo', 'Po anrufen osoba jest w Akkusativ: Ich rufe meinen Vater an. Po polsku „do kogo”, po niemiecku „kogo”.'],
					es: ['anrufen + a quién', 'Después de anrufen la persona va en acusativo: Ich rufe meinen Vater an.'],
					fr: ['anrufen + qui', 'Après anrufen, la personne est à l’accusatif : Ich rufe meinen Vater an. En français « à qui », en allemand « qui ».'],
					tr: ['anrufen + kimi', 'anrufen’den sonra kişi Akkusativ’dedir: Ich rufe meinen Vater an.'],
					ro: ['anrufen + pe cine', 'După anrufen persoana e la acuzativ: Ich rufe meinen Vater an.'],
					uz: ['anrufen + kimni', "anrufen dan keyin odam Akkusativda: Ich rufe meinen Vater an. O'zbekchada \"kimga\", nemischada \"kimni\"."],
					hi: ['anrufen + किसे', 'anrufen के बाद व्यक्ति Akkusativ में: Ich rufe meinen Vater an।'],
					ar: ['anrufen + من', 'بعد anrufen يكون الشخص في حالة المفعول: Ich rufe meinen Vater an.']
				},
				examples: [
					ex('Ich rufe meine Mutter an.', { ru: 'Я звоню своей маме.', uk: 'Я телефоную своїй мамі.', en: 'I call my mother.', pl: 'Dzwonię do mojej mamy.', es: 'Llamo a mi madre.', fr: 'J’appelle ma mère.', tr: 'Annemi arıyorum.', ro: 'O sun pe mama.', uz: "Onamga qo'ng'iroq qilaman.", hi: 'मैं अपनी माँ को फ़ोन करता हूँ।', ar: 'أتصل بأمي.' })
				]
			},
			{
				t: {
					ru: ['В вопросе тоже в конце', 'В вопросе глагол первым, а приставка всё равно в конце. fernsehen меняет гласную: er sieht fern.'],
					uk: ['У питанні теж у кінці', 'У питанні дієслово першим, а префікс однаково в кінці. fernsehen змінює голосну: er sieht fern.'],
					en: ['At the end in questions too', 'In a question the verb comes first, the prefix is still at the end. fernsehen changes its vowel: er sieht fern.'],
					pl: ['W pytaniu też na końcu', 'W pytaniu czasownik pierwszy, a przedrostek i tak na końcu. fernsehen zmienia samogłoskę: er sieht fern.'],
					es: ['También al final en preguntas', 'En la pregunta el verbo va primero y el prefijo sigue al final. fernsehen cambia la vocal: er sieht fern.'],
					fr: ['À la fin aussi dans les questions', 'Dans une question, le verbe est en premier, le préfixe reste à la fin. fernsehen change de voyelle : er sieht fern.'],
					tr: ['Soruda da sonda', 'Soruda fiil başta, ön ek yine sonda. fernsehen ünlüyü değiştirir: er sieht fern.'],
					ro: ['Și în întrebare la final', 'În întrebare verbul e primul, iar prefixul tot la final. fernsehen își schimbă vocala: er sieht fern.'],
					uz: ['Savolda ham oxirida', "Savolda fe'l birinchi, old qo'shimcha baribir oxirida. fernsehen unlini o'zgartiradi: er sieht fern."],
					hi: ['सवाल में भी अंत में', 'सवाल में क्रिया पहले, उपसर्ग फिर भी अंत में। fernsehen का स्वर बदलता है: er sieht fern।'],
					ar: ['في السؤال أيضاً في الآخر', 'في السؤال يأتي الفعل أولاً وتبقى السابقة في الآخر. وfernsehen يتغير حرفه: er sieht fern.']
				},
				examples: [
					ex('Rufst du Anna an?', { ru: 'Ты звонишь Анне?', uk: 'Ти телефонуєш Анні?', en: 'Are you calling Anna?', pl: 'Dzwonisz do Anny?', es: '¿Llamas a Anna?', fr: 'Tu appelles Anna ?', tr: 'Anna’yı arıyor musun?', ro: 'O suni pe Anna?', uz: "Annaga qo'ng'iroq qilyapsanmi?", hi: 'क्या तुम अन्ना को फ़ोन कर रहे हो?', ar: 'هل تتصل بآنا؟' }),
					ex('Er sieht oft fern.', { ru: 'Он часто смотрит телевизор.', uk: 'Він часто дивиться телевізор.', en: 'He often watches TV.', pl: 'On często ogląda telewizję.', es: 'Él ve mucho la tele.', fr: 'Il regarde souvent la télé.', tr: 'O sık sık televizyon izler.', ro: 'El se uită des la televizor.', uz: "U tez-tez televizor ko'radi.", hi: 'वह अक्सर टीवी देखता है।', ar: 'هو يشاهد التلفاز كثيراً.' })
				]
			}
		]
	},

	'routine-mill-four': {
		title: {
			ru: 'abfahren, ankommen, mitkommen', uk: 'abfahren, ankommen, mitkommen', en: 'abfahren, ankommen, mitkommen',
			pl: 'abfahren, ankommen, mitkommen', es: 'abfahren, ankommen, mitkommen', fr: 'abfahren, ankommen, mitkommen',
			tr: 'abfahren, ankommen, mitkommen', ro: 'abfahren, ankommen, mitkommen', uz: 'abfahren, ankommen, mitkommen',
			hi: 'abfahren, ankommen, mitkommen', ar: 'abfahren وankommen وmitkommen'
		},
		points: [
			{
				t: {
					ru: ['Гласная меняется, как без приставки', 'abfahren меняется как fahren: der Zug fährt ab. Приставка не мешает.'],
					uk: ['Голосна змінюється, як без префікса', 'abfahren змінюється як fahren: der Zug fährt ab. Префікс не заважає.'],
					en: ['The vowel changes as without the prefix', 'abfahren changes like fahren: der Zug fährt ab. The prefix doesn’t matter.'],
					pl: ['Samogłoska zmienia się jak bez przedrostka', 'abfahren odmienia się jak fahren: der Zug fährt ab. Przedrostek nie przeszkadza.'],
					es: ['La vocal cambia como sin prefijo', 'abfahren cambia como fahren: der Zug fährt ab. El prefijo no influye.'],
					fr: ['La voyelle change comme sans préfixe', 'abfahren change comme fahren : der Zug fährt ab. Le préfixe ne change rien.'],
					tr: ['Ünlü ön eksiz hâldeki gibi değişir', 'abfahren, fahren gibi değişir: der Zug fährt ab. Ön ek bir şey değiştirmez.'],
					ro: ['Vocala se schimbă ca fără prefix', 'abfahren se schimbă ca fahren: der Zug fährt ab. Prefixul nu contează.'],
					uz: ["Unli old qo'shimchasizdagidek o'zgaradi", "abfahren fahren kabi o'zgaradi: der Zug fährt ab. Old qo'shimcha xalal bermaydi."],
					hi: ['स्वर बिना उपसर्ग की तरह बदलता है', 'abfahren, fahren की तरह बदलता है: der Zug fährt ab। उपसर्ग से फ़र्क नहीं पड़ता।'],
					ar: ['يتغير الحرف كما بدون سابقة', 'يتغير abfahren مثل fahren: der Zug fährt ab. والسابقة لا تؤثر.']
				},
				examples: [
					ex('Der Zug fährt um acht Uhr ab.', { ru: 'Поезд отправляется в восемь.', uk: 'Потяг вирушає о восьмій.', en: 'The train leaves at eight.', pl: 'Pociąg odjeżdża o ósmej.', es: 'El tren sale a las ocho.', fr: 'Le train part à huit heures.', tr: 'Tren saat sekizde kalkıyor.', ro: 'Trenul pleacă la opt.', uz: 'Poyezd soat sakkizda jo‘naydi.', hi: 'ट्रेन आठ बजे चलती है।', ar: 'ينطلق القطار في الثامنة.' }),
					ex('Kommst du mit? Ja, ich komme mit!', { ru: 'Ты идёшь с нами? Да, иду!', uk: 'Ти йдеш з нами? Так, іду!', en: 'Are you coming along? Yes, I’m coming!', pl: 'Idziesz z nami? Tak, idę!', es: '¿Vienes con nosotros? ¡Sí, voy!', fr: 'Tu viens avec nous ? Oui, je viens !', tr: 'Bizimle geliyor musun? Evet, geliyorum!', ro: 'Vii cu noi? Da, vin!', uz: 'Biz bilan borasanmi? Ha, boraman!', hi: 'क्या तुम साथ चलोगे? हाँ, चलूँगा!', ar: 'هل ستأتي معنا؟ نعم، سآتي!' })
				]
			}
		]
	},

	'routine-mill-five': {
		title: {
			ru: 'anfangen, aufmachen, zumachen', uk: 'anfangen, aufmachen, zumachen', en: 'anfangen, aufmachen, zumachen',
			pl: 'anfangen, aufmachen, zumachen', es: 'anfangen, aufmachen, zumachen', fr: 'anfangen, aufmachen, zumachen',
			tr: 'anfangen, aufmachen, zumachen', ro: 'anfangen, aufmachen, zumachen', uz: 'anfangen, aufmachen, zumachen',
			hi: 'anfangen, aufmachen, zumachen', ar: 'anfangen وaufmachen وzumachen'
		},
		points: [
			{
				t: {
					ru: ['anfangen меняет гласную', 'anfangen: du fängst an, er fängt an.'],
					uk: ['anfangen змінює голосну', 'anfangen: du fängst an, er fängt an.'],
					en: ['anfangen changes its vowel', 'anfangen: du fängst an, er fängt an.'],
					pl: ['anfangen zmienia samogłoskę', 'anfangen: du fängst an, er fängt an.'],
					es: ['anfangen cambia la vocal', 'anfangen: du fängst an, er fängt an.'],
					fr: ['anfangen change de voyelle', 'anfangen : du fängst an, er fängt an.'],
					tr: ['anfangen ünlüyü değiştirir', 'anfangen: du fängst an, er fängt an.'],
					ro: ['anfangen își schimbă vocala', 'anfangen: du fängst an, er fängt an.'],
					uz: ["anfangen unlini o'zgartiradi", 'anfangen: du fängst an, er fängt an.'],
					hi: ['anfangen का स्वर बदलता है', 'anfangen: du fängst an, er fängt an।'],
					ar: ['anfangen يتغير حرفه', 'anfangen: du fängst an، er fängt an.']
				},
				examples: [
					ex('Der Film fängt um acht Uhr an.', { ru: 'Фильм начинается в восемь.', uk: 'Фільм починається о восьмій.', en: 'The film starts at eight.', pl: 'Film zaczyna się o ósmej.', es: 'La película empieza a las ocho.', fr: 'Le film commence à huit heures.', tr: 'Film saat sekizde başlıyor.', ro: 'Filmul începe la opt.', uz: 'Film soat sakkizda boshlanadi.', hi: 'फ़िल्म आठ बजे शुरू होती है।', ar: 'يبدأ الفيلم في الثامنة.' })
				]
			},
			{
				t: {
					ru: ['auf и zu', 'aufmachen значит открывать, zumachen закрывать. Приставка показывает направление.'],
					uk: ['auf і zu', 'aufmachen означає відчиняти, zumachen зачиняти. Префікс показує напрямок.'],
					en: ['auf and zu', 'aufmachen means to open, zumachen means to close. The prefix shows the direction.'],
					pl: ['auf i zu', 'aufmachen znaczy otwierać, zumachen zamykać. Przedrostek pokazuje kierunek.'],
					es: ['auf y zu', 'aufmachen es abrir, zumachen es cerrar. El prefijo indica la dirección.'],
					fr: ['auf et zu', 'aufmachen veut dire ouvrir, zumachen fermer. Le préfixe indique le sens.'],
					tr: ['auf ve zu', 'aufmachen açmak, zumachen kapatmak demektir. Ön ek yönü gösterir.'],
					ro: ['auf și zu', 'aufmachen înseamnă a deschide, zumachen a închide. Prefixul arată direcția.'],
					uz: ['auf va zu', "aufmachen ochish, zumachen yopish. Old qo'shimcha yo'nalishni ko'rsatadi."],
					hi: ['auf और zu', 'aufmachen मतलब खोलना, zumachen मतलब बंद करना। उपसर्ग दिशा बताता है।'],
					ar: ['auf وzu', 'aufmachen تعني يفتح، وzumachen تعني يغلق. والسابقة تدل على الاتجاه.']
				},
				examples: [
					ex('Machst du das Fenster auf?', { ru: 'Ты откроешь окно?', uk: 'Ти відчиниш вікно?', en: 'Will you open the window?', pl: 'Otworzysz okno?', es: '¿Abres la ventana?', fr: 'Tu ouvres la fenêtre ?', tr: 'Pencereyi açar mısın?', ro: 'Deschizi fereastra?', uz: 'Derazani ochasanmi?', hi: 'क्या तुम खिड़की खोलोगे?', ar: 'هل تفتح النافذة؟' }),
					ex('Der Laden macht um zehn Uhr zu.', { ru: 'Магазин закрывается в десять.', uk: 'Магазин зачиняється о десятій.', en: 'The shop closes at ten.', pl: 'Sklep zamyka się o dziesiątej.', es: 'La tienda cierra a las diez.', fr: 'Le magasin ferme à dix heures.', tr: 'Dükkân saat onda kapanıyor.', ro: 'Magazinul se închide la zece.', uz: "Do'kon soat o'nda yopiladi.", hi: 'दुकान दस बजे बंद होती है।', ar: 'يغلق المتجر في العاشرة.' })
				]
			}
		]
	},

	'routine-mill-six': {
		title: {
			ru: 'Вопросы и nicht с приставкой', uk: 'Питання і nicht з префіксом', en: 'Questions and nicht with a prefix',
			pl: 'Pytania i nicht z przedrostkiem', es: 'Preguntas y nicht con prefijo', fr: 'Questions et nicht avec préfixe',
			tr: 'Ön ekli fiille soru ve nicht', ro: 'Întrebări și nicht cu prefix', uz: "Old qo'shimchali savol va nicht",
			hi: 'उपसर्ग के साथ सवाल और nicht', ar: 'الأسئلة وnicht مع السابقة'
		},
		points: [
			{
				t: {
					ru: ['nicht перед приставкой', 'Приставка всегда в самом конце, а nicht стоит прямо перед ней.'],
					uk: ['nicht перед префіксом', 'Префікс завжди в самому кінці, а nicht стоїть просто перед ним.'],
					en: ['nicht before the prefix', 'The prefix is always at the very end, and nicht goes right before it.'],
					pl: ['nicht przed przedrostkiem', 'Przedrostek jest zawsze na samym końcu, a nicht stoi tuż przed nim.'],
					es: ['nicht antes del prefijo', 'El prefijo siempre va al final y nicht va justo delante.'],
					fr: ['nicht avant le préfixe', 'Le préfixe est toujours tout à la fin, et nicht se met juste avant.'],
					tr: ['nicht ön ekten önce', 'Ön ek hep en sondadır, nicht hemen önüne gelir.'],
					ro: ['nicht înaintea prefixului', 'Prefixul e mereu la final, iar nicht stă chiar înaintea lui.'],
					uz: ["nicht old qo'shimchadan oldin", "Old qo'shimcha doim eng oxirida, nicht esa uning oldida turadi."],
					hi: ['nicht उपसर्ग से पहले', 'उपसर्ग हमेशा बिल्कुल अंत में होता है, और nicht उसके ठीक पहले।'],
					ar: ['nicht قبل السابقة', 'السابقة دائماً في آخر الجملة، وnicht قبلها مباشرة.']
				},
				examples: [
					ex('Ich kaufe heute nicht ein.', { ru: 'Сегодня я не хожу за покупками.', uk: 'Сьогодні я не ходжу по покупки.', en: 'I’m not going shopping today.', pl: 'Dziś nie robię zakupów.', es: 'Hoy no hago la compra.', fr: 'Aujourd’hui, je ne fais pas les courses.', tr: 'Bugün alışveriş yapmıyorum.', ro: 'Azi nu fac cumpărături.', uz: 'Bugun xarid qilmayman.', hi: 'आज मैं खरीदारी नहीं कर रहा।', ar: 'لا أتسوق اليوم.' }),
					ex('Wann kommt der Bus an?', { ru: 'Когда прибывает автобус?', uk: 'Коли прибуває автобус?', en: 'When does the bus arrive?', pl: 'Kiedy przyjeżdża autobus?', es: '¿Cuándo llega el autobús?', fr: 'Quand le bus arrive-t-il ?', tr: 'Otobüs ne zaman geliyor?', ro: 'Când sosește autobuzul?', uz: 'Avtobus qachon keladi?', hi: 'बस कब पहुँचती है?', ar: 'متى تصل الحافلة؟' })
				]
			},
			{
				t: {
					ru: ['Doch! и здесь', 'На вопрос с отрицанием «да» говорим Doch!'],
					uk: ['Doch! і тут', 'На питання із запереченням «так» кажемо Doch!'],
					en: ['Doch! here too', 'Answer "yes" to a negative question with Doch!'],
					pl: ['Doch! też tutaj', 'Na pytanie z przeczeniem „tak” mówimy Doch!'],
					es: ['Doch! también aquí', 'A una pregunta negativa se responde "sí" con Doch!'],
					fr: ['Doch ! ici aussi', 'À une question négative, on répond « si » avec Doch !'],
					tr: ['Burada da Doch!', 'Olumsuz soruya "evet" cevabı Doch! ile verilir.'],
					ro: ['Doch! și aici', 'La o întrebare negativă răspunzi „ba da” cu Doch!'],
					uz: ['Bu yerda ham Doch!', "Inkor savolga \"ha\" javobi Doch! bilan."],
					hi: ['यहाँ भी Doch!', 'नकारात्मक सवाल का "हाँ" वाला जवाब Doch!।'],
					ar: ['Doch! هنا أيضاً', 'نجيب بـ "بلى" عن السؤال المنفي بكلمة Doch!']
				},
				examples: [
					ex('Kommst du nicht mit? Doch, ich komme mit!', { ru: 'Ты не идёшь с нами? Да нет, иду!', uk: 'Ти не йдеш з нами? Та ні, іду!', en: 'Aren’t you coming? Yes, I am!', pl: 'Nie idziesz z nami? Ależ idę!', es: '¿No vienes? ¡Que sí, voy!', fr: 'Tu ne viens pas ? Si, je viens !', tr: 'Gelmiyor musun? Geliyorum tabii!', ro: 'Nu vii cu noi? Ba da, vin!', uz: "Biz bilan bormaysanmi? Boraman, albatta!", hi: 'तुम साथ नहीं चल रहे? चल रहा हूँ न!', ar: 'ألن تأتي معنا؟ بلى، سآتي!' })
				]
			}
		]
	},

	'routine-mill-seven': {
		title: {
			ru: 'Практика: мой обычный день', uk: 'Практика: мій звичайний день', en: 'Practice: my usual day',
			pl: 'Praktyka: mój zwykły dzień', es: 'Práctica: mi día normal', fr: 'Pratique : ma journée habituelle',
			tr: 'Pratik: sıradan bir günüm', ro: 'Practică: ziua mea obișnuită', uz: 'Mashq: oddiy kunim',
			hi: 'अभ्यास: मेरा सामान्य दिन', ar: 'تدريب: يومي العادي'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Время первым, глагол вторым, приставка в конце.'],
					uk: ['Нових правил немає', 'Час першим, дієслово другим, префікс у кінці.'],
					en: ['No new rules', 'Time first, verb second, prefix at the end.'],
					pl: ['Bez nowych reguł', 'Czas pierwszy, czasownik drugi, przedrostek na końcu.'],
					es: ['Sin reglas nuevas', 'Tiempo primero, verbo segundo, prefijo al final.'],
					fr: ['Pas de nouvelle règle', 'Le temps d’abord, le verbe en deuxième, le préfixe à la fin.'],
					tr: ['Yeni kural yok', 'Önce zaman, fiil ikinci, ön ek sonda.'],
					ro: ['Fără reguli noi', 'Timpul primul, verbul al doilea, prefixul la final.'],
					uz: ["Yangi qoida yo'q", "Avval vaqt, fe'l ikkinchi, old qo'shimcha oxirida."],
					hi: ['कोई नया नियम नहीं', 'पहले समय, फिर क्रिया, उपसर्ग अंत में।'],
					ar: ['لا قواعد جديدة', 'الزمن أولاً، الفعل ثانياً، السابقة في الآخر.']
				},
				examples: [
					ex('Um elf Uhr schlafe ich ein.', { ru: 'В одиннадцать я засыпаю.', uk: 'Об одинадцятій я засинаю.', en: 'At eleven I fall asleep.', pl: 'O jedenastej zasypiam.', es: 'A las once me duermo.', fr: 'À onze heures, je m’endors.', tr: 'Saat on birde uykuya dalarım.', ro: 'La unsprezece adorm.', uz: "Soat o'n birda uxlab qolaman.", hi: 'ग्यारह बजे मैं सो जाता हूँ।', ar: 'في الحادية عشرة أنام.' })
				]
			}
		]
	},

	'routine-mill-eight': {
		title: {
			ru: 'Практика: vorhaben, einladen, abholen', uk: 'Практика: vorhaben, einladen, abholen', en: 'Practice: vorhaben, einladen, abholen',
			pl: 'Praktyka: vorhaben, einladen, abholen', es: 'Práctica: vorhaben, einladen, abholen', fr: 'Pratique : vorhaben, einladen, abholen',
			tr: 'Pratik: vorhaben, einladen, abholen', ro: 'Practică: vorhaben, einladen, abholen', uz: 'Mashq: vorhaben, einladen, abholen',
			hi: 'अभ्यास: vorhaben, einladen, abholen', ar: 'تدريب: vorhaben وeinladen وabholen'
		},
		points: [
			{
				t: {
					ru: ['Ещё три глагола для планов', 'vorhaben (планировать), einladen (приглашать, меняет гласную: er lädt ein), abholen (забирать). Приставка в конце.'],
					uk: ['Ще три дієслова для планів', 'vorhaben (планувати), einladen (запрошувати, змінює голосну: er lädt ein), abholen (забирати). Префікс у кінці.'],
					en: ['Three more verbs for plans', 'vorhaben (to plan), einladen (to invite, vowel changes: er lädt ein), abholen (to pick up). Prefix at the end.'],
					pl: ['Jeszcze trzy czasowniki do planów', 'vorhaben (planować), einladen (zapraszać, zmienia samogłoskę: er lädt ein), abholen (odbierać). Przedrostek na końcu.'],
					es: ['Tres verbos más para planes', 'vorhaben (planear), einladen (invitar, cambia la vocal: er lädt ein), abholen (recoger). Prefijo al final.'],
					fr: ['Trois verbes de plus pour les projets', 'vorhaben (prévoir), einladen (inviter, la voyelle change : er lädt ein), abholen (aller chercher). Préfixe à la fin.'],
					tr: ['Planlar için üç fiil daha', 'vorhaben (planlamak), einladen (davet etmek, ünlü değişir: er lädt ein), abholen (alıp getirmek). Ön ek sonda.'],
					ro: ['Încă trei verbe pentru planuri', 'vorhaben (a plănui), einladen (a invita, vocala se schimbă: er lädt ein), abholen (a lua pe cineva). Prefixul la final.'],
					uz: ["Rejalar uchun yana uch fe'l", "vorhaben (rejalashtirmoq), einladen (taklif qilmoq, unli o'zgaradi: er lädt ein), abholen (olib ketmoq). Old qo'shimcha oxirida."],
					hi: ['योजनाओं के लिए तीन और क्रियाएँ', 'vorhaben (योजना बनाना), einladen (बुलाना, स्वर बदलता है: er lädt ein), abholen (लेने जाना)। उपसर्ग अंत में।'],
					ar: ['ثلاثة أفعال أخرى للخطط', 'vorhaben (يخطط)، einladen (يدعو، ويتغير حرفه: er lädt ein)، abholen (يصطحب). والسابقة في الآخر.']
				},
				examples: [
					ex('Was hast du am Samstag vor?', { ru: 'Что ты планируешь в субботу?', uk: 'Що ти плануєш у суботу?', en: 'What are you doing on Saturday?', pl: 'Co planujesz w sobotę?', es: '¿Qué planes tienes el sábado?', fr: 'Qu’est-ce que tu fais samedi ?', tr: 'Cumartesi ne yapmayı planlıyorsun?', ro: 'Ce ai de gând sâmbătă?', uz: 'Shanba kuni nima rejang bor?', hi: 'शनिवार को तुम्हारा क्या प्लान है?', ar: 'ماذا تخطط يوم السبت؟' }),
					ex('Ich hole meinen Sohn um vier Uhr ab.', { ru: 'Я забираю сына в четыре.', uk: 'Я забираю сина о четвертій.', en: 'I pick up my son at four.', pl: 'Odbieram syna o czwartej.', es: 'Recojo a mi hijo a las cuatro.', fr: 'Je vais chercher mon fils à quatre heures.', tr: 'Oğlumu saat dörtte alıyorum.', ro: 'Îl iau pe fiul meu la patru.', uz: "O'g'limni soat to'rtda olib ketaman.", hi: 'मैं चार बजे अपने बेटे को लेने जाता हूँ।', ar: 'أصطحب ابني في الرابعة.' })
				]
			}
		]
	},

	'routine-mill-nine': {
		title: {
			ru: 'Повторение: где стоит приставка', uk: 'Повторення: де стоїть префікс', en: 'Review: where the prefix goes',
			pl: 'Powtórka: gdzie stoi przedrostek', es: 'Repaso: dónde va el prefijo', fr: 'Révision : où va le préfixe',
			tr: 'Tekrar: ön ek nereye gelir', ro: 'Recapitulare: unde stă prefixul', uz: "Takrorlash: old qo'shimcha qayerda",
			hi: 'दोहराव: उपसर्ग कहाँ आता है', ar: 'مراجعة: أين تقع السابقة'
		},
		points: [
			{
				t: {
					ru: ['В утверждении', 'Глагол на втором месте, приставка в конце.'],
					uk: ['У ствердженні', 'Дієслово на другому місці, префікс у кінці.'],
					en: ['In a statement', 'Verb in second place, prefix at the end.'],
					pl: ['W zdaniu oznajmującym', 'Czasownik na drugim miejscu, przedrostek na końcu.'],
					es: ['En una afirmación', 'Verbo en segundo lugar, prefijo al final.'],
					fr: ['Dans une affirmation', 'Verbe en deuxième position, préfixe à la fin.'],
					tr: ['Olumlu cümlede', 'Fiil ikinci sırada, ön ek sonda.'],
					ro: ['În afirmație', 'Verbul pe locul doi, prefixul la final.'],
					uz: ['Darak gapda', "Fe'l ikkinchi o'rinda, old qo'shimcha oxirida."],
					hi: ['सामान्य वाक्य में', 'क्रिया दूसरे स्थान पर, उपसर्ग अंत में।'],
					ar: ['في الجملة الخبرية', 'الفعل في المكان الثاني، والسابقة في الآخر.']
				},
				examples: [
					ex('Jetzt räume ich die Küche auf.', { ru: 'Сейчас я убираю кухню.', uk: 'Зараз я прибираю кухню.', en: 'Now I’m tidying the kitchen.', pl: 'Teraz sprzątam kuchnię.', es: 'Ahora ordeno la cocina.', fr: 'Maintenant, je range la cuisine.', tr: 'Şimdi mutfağı topluyorum.', ro: 'Acum fac ordine în bucătărie.', uz: 'Hozir oshxonani yig‘ishtiryapman.', hi: 'अभी मैं रसोई साफ़ कर रहा हूँ।', ar: 'الآن أرتب المطبخ.' })
				]
			},
			{
				t: {
					ru: ['В вопросе', 'Глагол первым или после вопросительного слова, приставка в конце.'],
					uk: ['У питанні', 'Дієслово першим або після питального слова, префікс у кінці.'],
					en: ['In a question', 'Verb first or after the question word, prefix at the end.'],
					pl: ['W pytaniu', 'Czasownik pierwszy albo po słowie pytającym, przedrostek na końcu.'],
					es: ['En una pregunta', 'Verbo primero o tras la palabra interrogativa, prefijo al final.'],
					fr: ['Dans une question', 'Verbe en premier ou après le mot interrogatif, préfixe à la fin.'],
					tr: ['Soruda', 'Fiil başta ya da soru kelimesinden sonra, ön ek sonda.'],
					ro: ['În întrebare', 'Verbul primul sau după cuvântul interogativ, prefixul la final.'],
					uz: ['Savolda', "Fe'l birinchi yoki savol so'zidan keyin, old qo'shimcha oxirida."],
					hi: ['सवाल में', 'क्रिया पहले या प्रश्नवाचक शब्द के बाद, उपसर्ग अंत में।'],
					ar: ['في السؤال', 'الفعل أولاً أو بعد أداة الاستفهام، والسابقة في الآخر.']
				},
				examples: [
					ex('Wann fängt das Konzert an?', { ru: 'Когда начинается концерт?', uk: 'Коли починається концерт?', en: 'When does the concert start?', pl: 'Kiedy zaczyna się koncert?', es: '¿Cuándo empieza el concierto?', fr: 'Quand commence le concert ?', tr: 'Konser ne zaman başlıyor?', ro: 'Când începe concertul?', uz: 'Konsert qachon boshlanadi?', hi: 'कॉन्सर्ट कब शुरू होता है?', ar: 'متى تبدأ الحفلة؟' })
				]
			},
			{
				t: {
					ru: ['С nicht', 'nicht прямо перед приставкой.'],
					uk: ['З nicht', 'nicht просто перед префіксом.'],
					en: ['With nicht', 'nicht right before the prefix.'],
					pl: ['Z nicht', 'nicht tuż przed przedrostkiem.'],
					es: ['Con nicht', 'nicht justo antes del prefijo.'],
					fr: ['Avec nicht', 'nicht juste avant le préfixe.'],
					tr: ['nicht ile', 'nicht ön ekten hemen önce.'],
					ro: ['Cu nicht', 'nicht chiar înaintea prefixului.'],
					uz: ['nicht bilan', "nicht old qo'shimchaning oldida."],
					hi: ['nicht के साथ', 'nicht उपसर्ग के ठीक पहले।'],
					ar: ['مع nicht', 'nicht قبل السابقة مباشرة.']
				},
				examples: [
					ex('Er ruft nicht an.', { ru: 'Он не звонит.', uk: 'Він не телефонує.', en: 'He doesn’t call.', pl: 'On nie dzwoni.', es: 'Él no llama.', fr: 'Il n’appelle pas.', tr: 'O aramıyor.', ro: 'El nu sună.', uz: "U qo'ng'iroq qilmayapti.", hi: 'वह फ़ोन नहीं करता।', ar: 'هو لا يتصل.' })
				]
			}
		]
	},

	'routine-mill-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Приставка всегда в конце', 'В утверждении, в вопросе и с nicht.'],
					uk: ['Префікс завжди в кінці', 'У ствердженні, у питанні та з nicht.'],
					en: ['The prefix is always at the end', 'In statements, questions and with nicht.'],
					pl: ['Przedrostek zawsze na końcu', 'W zdaniu oznajmującym, w pytaniu i z nicht.'],
					es: ['El prefijo siempre al final', 'En afirmaciones, preguntas y con nicht.'],
					fr: ['Le préfixe toujours à la fin', 'Dans les affirmations, les questions et avec nicht.'],
					tr: ['Ön ek hep sonda', 'Olumlu cümlede, soruda ve nicht ile.'],
					ro: ['Prefixul mereu la final', 'În afirmații, întrebări și cu nicht.'],
					uz: ["Old qo'shimcha doim oxirida", 'Darak gapda, savolda va nicht bilan.'],
					hi: ['उपसर्ग हमेशा अंत में', 'सामान्य वाक्य, सवाल और nicht के साथ।'],
					ar: ['السابقة دائماً في الآخر', 'في الجملة الخبرية والسؤال ومع nicht.']
				},
				examples: [
					ex('Am Samstag stehe ich spät auf.', { ru: 'В субботу я встаю поздно.', uk: 'У суботу я встаю пізно.', en: 'On Saturday I get up late.', pl: 'W sobotę wstaję późno.', es: 'El sábado me levanto tarde.', fr: 'Samedi, je me lève tard.', tr: 'Cumartesi geç kalkarım.', ro: 'Sâmbătă mă trezesc târziu.', uz: 'Shanba kuni kech turaman.', hi: 'शनिवार को मैं देर से उठता हूँ।', ar: 'يوم السبت أستيقظ متأخراً.' }),
					ex('Kaufst du früh ein?', { ru: 'Ты рано ходишь за покупками?', uk: 'Ти рано ходиш по покупки?', en: 'Do you go shopping early?', pl: 'Robisz zakupy wcześnie?', es: '¿Haces la compra temprano?', fr: 'Tu fais les courses tôt ?', tr: 'Erken mi alışveriş yaparsın?', ro: 'Faci cumpărături devreme?', uz: 'Erta xarid qilasanmi?', hi: 'क्या तुम जल्दी खरीदारी करते हो?', ar: 'هل تتسوق مبكراً؟' })
				]
			},
			{
				t: {
					ru: ['Akkusativ после глагола', 'anrufen, einladen, abholen + кого: meinen Vater, seine Freunde.'],
					uk: ['Akkusativ після дієслова', 'anrufen, einladen, abholen + кого: meinen Vater, seine Freunde.'],
					en: ['Accusative after the verb', 'anrufen, einladen, abholen + whom: meinen Vater, seine Freunde.'],
					pl: ['Akkusativ po czasowniku', 'anrufen, einladen, abholen + kogo: meinen Vater, seine Freunde.'],
					es: ['Acusativo tras el verbo', 'anrufen, einladen, abholen + a quién: meinen Vater, seine Freunde.'],
					fr: ['Accusatif après le verbe', 'anrufen, einladen, abholen + qui : meinen Vater, seine Freunde.'],
					tr: ['Fiilden sonra Akkusativ', 'anrufen, einladen, abholen + kimi: meinen Vater, seine Freunde.'],
					ro: ['Acuzativ după verb', 'anrufen, einladen, abholen + pe cine: meinen Vater, seine Freunde.'],
					uz: ["Fe'ldan keyin Akkusativ", 'anrufen, einladen, abholen + kimni: meinen Vater, seine Freunde.'],
					hi: ['क्रिया के बाद Akkusativ', 'anrufen, einladen, abholen + किसे: meinen Vater, seine Freunde।'],
					ar: ['حالة المفعول بعد الفعل', 'anrufen وeinladen وabholen + من: meinen Vater، seine Freunde.']
				},
				examples: [
					ex('Er lädt seine Freunde ein.', { ru: 'Он приглашает своих друзей.', uk: 'Він запрошує своїх друзів.', en: 'He invites his friends.', pl: 'On zaprasza swoich przyjaciół.', es: 'Él invita a sus amigos.', fr: 'Il invite ses amis.', tr: 'O arkadaşlarını davet ediyor.', ro: 'El își invită prietenii.', uz: "U do'stlarini taklif qiladi.", hi: 'वह अपने दोस्तों को बुलाता है।', ar: 'هو يدعو أصدقاءه.' })
				]
			}
		]
	}
}

module.exports = quests
