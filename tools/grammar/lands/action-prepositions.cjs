// Грамматика к заданиям земли action-prepositions (предлоги действия и времени)
const { ex, t11, pt, noRules, finalTitle } = require('../lib.cjs')

const akkPoint = pt(['für, ohne, durch, um + Akkusativ', 'für, ohne, durch, um + Akkusativ', 'für, ohne, durch, um + accusative', 'für, ohne, durch, um + Akkusativ', 'für, ohne, durch, um + acusativo', 'für, ohne, durch, um + accusatif', 'für, ohne, durch, um + Akkusativ', 'für, ohne, durch, um + acuzativ', 'für, ohne, durch, um + Akkusativ', 'für, ohne, durch, um + Akkusativ', 'für وohne وdurch وum + المفعول'], [
	'После этих предлогов Akkusativ: мужской род получает den, einen. Остальное без изменений.',
	'Після цих прийменників Akkusativ: чоловічий рід отримує den, einen. Решта без змін.',
	'These prepositions take the accusative: masculine becomes den, einen. The rest stays the same.',
	'Po tych przyimkach Akkusativ: rodzaj męski dostaje den, einen. Reszta bez zmian.',
	'Estas preposiciones van con acusativo: el masculino pasa a den, einen. Lo demás no cambia.',
	'Ces prépositions prennent l’accusatif : le masculin devient den, einen. Le reste ne change pas.',
	'Bu edatlardan sonra Akkusativ: eril den, einen olur. Gerisi değişmez.',
	'După aceste prepoziții, acuzativ: masculinul devine den, einen. Restul rămâne la fel.',
	"Bu ko'makchilardan keyin Akkusativ: erkak rodi den, einen bo'ladi. Qolgani o'zgarmaydi.",
	'इन संबंधसूचकों के बाद Akkusativ: पुल्लिंग den, einen बनता है। बाकी नहीं बदलता।',
	'بعد هذه الحروف حالة المفعول: المذكر يصبح den أو einen. والباقي لا يتغير.'
], [
	ex('Wir gehen durch den Park.', t11('Мы идём через парк.', 'Ми йдемо через парк.', 'We walk through the park.', 'Idziemy przez park.', 'Caminamos por el parque.', 'Nous traversons le parc.', 'Parkın içinden geçiyoruz.', 'Mergem prin parc.', "Biz park orqali o'tamiz.", 'हम पार्क से होकर जाते हैं।', 'نمشي عبر الحديقة.')),
	ex('Er geht ohne Regenschirm.', t11('Он идёт без зонта.', 'Він іде без парасольки.', 'He goes without an umbrella.', 'On idzie bez parasola.', 'Él va sin paraguas.', 'Il part sans parapluie.', 'Şemsiyesiz gidiyor.', 'El pleacă fără umbrelă.', 'U soyabonsiz ketyapti.', 'वह बिना छाते के जा रहा है।', 'هو يذهب بدون مظلة.'))
])

const timePoint = pt(['Время с Dativ: seit, vor, nach', 'Час із Dativ: seit, vor, nach', 'Time with dative: seit, vor, nach', 'Czas z Dativ: seit, vor, nach', 'Tiempo con dativo: seit, vor, nach', 'Le temps avec le datif : seit, vor, nach', 'Dativ ile zaman: seit, vor, nach', 'Timpul cu dativ: seit, vor, nach', 'Dativ bilan vaqt: seit, vor, nach', 'Dativ के साथ समय: seit, vor, nach', 'الزمن مع الجر: seit وvor وnach'], [
	'seit значит «уже какое-то время и до сих пор», vor значит «назад», nach значит «после». После них Dativ: vor zwei Jahren, seit einer Stunde.',
	'seit означає «уже якийсь час і досі», vor означає «тому», nach означає «після». Після них Dativ: vor zwei Jahren, seit einer Stunde.',
	'seit means "for, since (and still now)", vor means "ago", nach means "after". They take the dative: vor zwei Jahren, seit einer Stunde.',
	'seit znaczy „od (i nadal)”, vor znaczy „temu”, nach znaczy „po”. Po nich Dativ: vor zwei Jahren, seit einer Stunde.',
	'seit significa "desde hace (y sigue)", vor significa "hace", nach significa "después de". Van con dativo: vor zwei Jahren, seit einer Stunde.',
	'seit veut dire « depuis (et encore maintenant) », vor « il y a », nach « après ». Ils prennent le datif : vor zwei Jahren, seit einer Stunde.',
	'seit "-den beri (hâlâ)", vor "önce", nach "sonra" demektir. Ardından Dativ: vor zwei Jahren, seit einer Stunde.',
	'seit înseamnă „de (și încă)”, vor înseamnă „acum ... (în urmă)”, nach înseamnă „după”. Sunt urmate de dativ: vor zwei Jahren, seit einer Stunde.',
	"seit \"...dan beri (hozirgacha)\", vor \"... oldin\", nach \"...dan keyin\" degani. Ulardan keyin Dativ: vor zwei Jahren, seit einer Stunde.",
	'seit मतलब "से (और अब भी)", vor मतलब "पहले", nach मतलब "के बाद"। इनके बाद Dativ: vor zwei Jahren, seit einer Stunde।',
	'seit تعني "منذ (وما زال)"، وvor تعني "قبل ... مضت"، وnach تعني "بعد". وبعدها حالة الجر: vor zwei Jahren، seit einer Stunde.'
], [
	ex('Ich warte seit einer Stunde.', t11('Я жду уже час.', 'Я чекаю вже годину.', 'I’ve been waiting for an hour.', 'Czekam od godziny.', 'Llevo una hora esperando.', 'J’attends depuis une heure.', 'Bir saattir bekliyorum.', 'Aștept de o oră.', 'Bir soatdan beri kutyapman.', 'मैं एक घंटे से इंतज़ार कर रहा हूँ।', 'أنتظر منذ ساعة.')),
	ex('vor zwei Jahren', t11('два года назад', 'два роки тому', 'two years ago', 'dwa lata temu', 'hace dos años', 'il y a deux ans', 'iki yıl önce', 'acum doi ani', 'ikki yil oldin', 'दो साल पहले', 'قبل سنتين'))
])

const quests = {
	'prep-action-1': {
		title: t11('für и ohne', 'für і ohne', 'für and ohne', 'für i ohne', 'für y ohne', 'für et ohne', 'für ve ohne', 'für și ohne', 'für va ohne', 'für और ohne', 'für وohne'),
		points: [pt('für, ohne', [
			'für значит «для», ohne значит «без». С местоимением: für dich, für mich.',
			'für означає «для», ohne означає «без». З займенником: für dich, für mich.',
			'für means "for", ohne means "without". With pronouns: für dich, für mich.',
			'für znaczy „dla”, ohne znaczy „bez”. Z zaimkiem: für dich, für mich.',
			'für significa "para", ohne significa "sin". Con pronombre: für dich, für mich.',
			'für veut dire « pour », ohne « sans ». Avec un pronom : für dich, für mich.',
			'für "için", ohne "-sız" demektir. Zamirle: für dich, für mich.',
			'für înseamnă „pentru”, ohne „fără”. Cu pronume: für dich, für mich.',
			"für \"uchun\", ohne \"-siz\" degani. Olmosh bilan: für dich, für mich.",
			'für मतलब "के लिए", ohne मतलब "के बिना"। सर्वनाम के साथ: für dich, für mich।',
			'für تعني "لـ"، وohne تعني "بدون". مع الضمير: für dich، für mich.'
		], [ex('Das ist ein Geschenk für Mama.', t11('Это подарок для мамы.', 'Це подарунок для мами.', 'This is a present for Mum.', 'To prezent dla mamy.', 'Es un regalo para mamá.', 'C’est un cadeau pour maman.', 'Bu annem için bir hediye.', 'E un cadou pentru mama.', "Bu oyim uchun sovg'a.", 'यह माँ के लिए तोहफ़ा है।', 'هذه هدية لأمي.'))]), akkPoint]
	},
	'prep-action-2': {
		title: t11('durch и um', 'durch і um', 'durch and um', 'durch i um', 'durch y um', 'durch et um', 'durch ve um', 'durch și um', 'durch va um', 'durch और um', 'durch وum'),
		points: [pt('durch, um', [
			'durch значит «через, сквозь», um значит «вокруг», um die Ecke значит «за углом».',
			'durch означає «через, крізь», um означає «навколо», um die Ecke означає «за рогом».',
			'durch means "through", um means "around", um die Ecke means "round the corner".',
			'durch znaczy „przez”, um znaczy „wokół”, um die Ecke znaczy „za rogiem”.',
			'durch significa "a través de", um "alrededor de", um die Ecke "a la vuelta de la esquina".',
			'durch veut dire « à travers », um « autour », um die Ecke « au coin de la rue ».',
			'durch "içinden", um "etrafında", um die Ecke "köşeyi dönünce" demektir.',
			'durch înseamnă „prin”, um „în jurul”, um die Ecke „după colț”.',
			"durch \"orqali\", um \"atrofida\", um die Ecke \"muyulishda\" degani.",
			'durch मतलब "से होकर", um मतलब "चारों ओर", um die Ecke मतलब "कोने के पास"।',
			'durch تعني "عبر"، وum "حول"، وum die Ecke "عند الزاوية".'
		], [ex('Die Apotheke ist um die Ecke.', t11('Аптека за углом.', 'Аптека за рогом.', 'The pharmacy is round the corner.', 'Apteka jest za rogiem.', 'La farmacia está a la vuelta de la esquina.', 'La pharmacie est au coin de la rue.', 'Eczane köşede.', 'Farmacia e după colț.', 'Dorixona muyulishda.', 'दवाखाना कोने के पास है।', 'الصيدلية عند الزاوية.'))]), akkPoint]
	},
	'prep-action-3': {
		title: t11('gegenüber и vorbei', 'gegenüber і vorbei', 'gegenüber and vorbei', 'gegenüber i vorbei', 'gegenüber y vorbei', 'gegenüber et vorbei', 'gegenüber ve vorbei', 'gegenüber și vorbei', 'gegenüber va vorbei', 'gegenüber और vorbei', 'gegenüber وvorbei'),
		points: [pt('gegenüber von, an ... vorbei', [
			'gegenüber von значит «напротив», an ... vorbei значит «мимо». После них Dativ: gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von означає «навпроти», an ... vorbei означає «повз». Після них Dativ: gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von means "opposite", an ... vorbei means "past". They take the dative: gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von znaczy „naprzeciwko”, an ... vorbei „obok, mimo”. Po nich Dativ: gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von significa "enfrente de", an ... vorbei "por delante de". Van con dativo: gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von veut dire « en face de », an ... vorbei « devant (en passant) ». Ils prennent le datif : gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von "karşısında", an ... vorbei "önünden geçerek" demektir. Ardından Dativ: gegenüber vom Bahnhof, am Park vorbei.',
			'gegenüber von înseamnă „vizavi de”, an ... vorbei „pe lângă”. Sunt urmate de dativ: gegenüber vom Bahnhof, am Park vorbei.',
			"gegenüber von \"qarshisida\", an ... vorbei \"yonidan o'tib\" degani. Ulardan keyin Dativ: gegenüber vom Bahnhof, am Park vorbei.",
			'gegenüber von मतलब "सामने", an ... vorbei मतलब "के पास से होकर"। इनके बाद Dativ: gegenüber vom Bahnhof, am Park vorbei।',
			'gegenüber von تعني "مقابل"، وan ... vorbei تعني "مروراً بـ". وبعدهما حالة الجر: gegenüber vom Bahnhof، am Park vorbei.'
		], [ex('Die Bank ist gegenüber von der Post.', t11('Банк напротив почты.', 'Банк навпроти пошти.', 'The bank is opposite the post office.', 'Bank jest naprzeciwko poczty.', 'El banco está enfrente de correos.', 'La banque est en face de la poste.', 'Banka postanenin karşısında.', 'Banca e vizavi de poștă.', 'Bank pochta qarshisida.', 'बैंक डाकघर के सामने है।', 'البنك مقابل البريد.'))])]
	},
	'prep-action-4': {
		title: t11('Время: am, um, im', 'Час: am, um, im', 'Time: am, um, im', 'Czas: am, um, im', 'Tiempo: am, um, im', 'Le temps : am, um, im', 'Zaman: am, um, im', 'Timpul: am, um, im', 'Vaqt: am, um, im', 'समय: am, um, im', 'الزمن: am وum وim'),
		points: [pt('am, um, im', [
			'am + день и часть дня, um + время на часах, im + месяц и время года.',
			'am + день і частина дня, um + час на годиннику, im + місяць і пора року.',
			'am + day and part of the day, um + clock time, im + month and season.',
			'am + dzień i pora dnia, um + godzina, im + miesiąc i pora roku.',
			'am + día y parte del día, um + hora, im + mes y estación.',
			'am + jour et moment de la journée, um + heure, im + mois et saison.',
			'am + gün ve günün bölümü, um + saat, im + ay ve mevsim.',
			'am + zi și parte a zilei, um + oră, im + lună și anotimp.',
			'am + kun va kun qismi, um + soat, im + oy va fasl.',
			'am + दिन और दिन का हिस्सा, um + घड़ी का समय, im + महीना और मौसम।',
			'am + اليوم وجزء اليوم، um + الساعة، im + الشهر والفصل.'
		], [ex('Im Sommer fahren wir ans Meer.', t11('Летом мы едем на море.', 'Улітку ми їдемо на море.', 'In summer we go to the seaside.', 'Latem jedziemy nad morze.', 'En verano vamos al mar.', 'En été, nous allons à la mer.', 'Yazın denize gideriz.', 'Vara mergem la mare.', 'Yozda dengizga boramiz.', 'गर्मियों में हम समुद्र किनारे जाते हैं।', 'في الصيف نذهب إلى البحر.'))])]
	},
	'prep-action-5': {
		title: t11('von ... bis и ab', 'von ... bis і ab', 'von ... bis and ab', 'von ... bis i ab', 'von ... bis y ab', 'von ... bis et ab', 'von ... bis ve ab', 'von ... bis și ab', 'von ... bis va ab', 'von ... bis और ab', 'von ... bis وab'),
		points: [pt('von ... bis, bis, ab', [
			'von ... bis значит «с ... до», bis значит «до», ab значит «начиная с».',
			'von ... bis означає «з ... до», bis означає «до», ab означає «починаючи з».',
			'von ... bis means "from ... to", bis means "until", ab means "from (onwards)".',
			'von ... bis znaczy „od ... do”, bis „do”, ab „od (począwszy)”.',
			'von ... bis significa "de ... a", bis "hasta", ab "a partir de".',
			'von ... bis veut dire « de ... à », bis « jusqu’à », ab « à partir de ».',
			'von ... bis "-den ... -e kadar", bis "-e kadar", ab "-den itibaren" demektir.',
			'von ... bis înseamnă „de la ... până la”, bis „până la”, ab „începând cu”.',
			"von ... bis \"...dan ...gacha\", bis \"...gacha\", ab \"...dan boshlab\" degani.",
			'von ... bis मतलब "से ... तक", bis मतलब "तक", ab मतलब "से शुरू"।',
			'von ... bis تعني "من ... إلى"، وbis "حتى"، وab "ابتداءً من".'
		], [ex('Ich arbeite von neun bis fünf.', t11('Я работаю с девяти до пяти.', 'Я працюю з дев’ятої до п’ятої.', 'I work from nine to five.', 'Pracuję od dziewiątej do piątej.', 'Trabajo de nueve a cinco.', 'Je travaille de neuf heures à dix-sept heures.', 'Dokuzdan beşe kadar çalışıyorum.', 'Lucrez de la nouă la cinci.', "To'qqizdan beshgacha ishlayman.", 'मैं नौ से पाँच बजे तक काम करता हूँ।', 'أعمل من التاسعة حتى الخامسة.'))])]
	},
	'prep-action-6': {
		title: t11('seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit, vor, nach', 'seit وvor وnach'),
		points: [timePoint]
	},
	'prep-action-9': {
		title: t11('Практика: прогулка с собакой', 'Практика: прогулянка з собакою', 'Practice: walking the dog', 'Praktyka: spacer z psem', 'Práctica: paseo con el perro', 'Pratique : promenade avec le chien', 'Pratik: köpek gezdirmek', 'Practică: plimbare cu câinele', 'Mashq: it bilan sayr', 'अभ्यास: कुत्ते के साथ सैर', 'تدريب: نزهة مع الكلب'),
		points: [akkPoint]
	},
	'prep-action-10': {
		title: t11('Практика: моё расписание', 'Практика: мій розклад', 'Practice: my schedule', 'Praktyka: mój plan', 'Práctica: mi horario', 'Pratique : mon emploi du temps', 'Pratik: programım', 'Practică: programul meu', 'Mashq: mening jadvalim', 'अभ्यास: मेरा कार्यक्रम', 'تدريب: جدولي'),
		points: [timePoint]
	},
	'prep-action-7': {
		title: t11('Повторение: действие и время', 'Повторення: дія і час', 'Review: action and time', 'Powtórka: czynność i czas', 'Repaso: acción y tiempo', 'Révision : action et temps', 'Tekrar: eylem ve zaman', 'Recapitulare: acțiune și timp', 'Takrorlash: harakat va vaqt', 'दोहराव: क्रिया और समय', 'مراجعة: الفعل والزمن'),
		points: [akkPoint, timePoint]
	},
	'prep-action-8': {
		title: finalTitle,
		points: [akkPoint, timePoint, pt(noRules, [
			'Короткая шпаргалка: für, ohne, durch, um с Akkusativ; mit, zu, bei, seit, vor, nach с Dativ.',
			'Коротка шпаргалка: für, ohne, durch, um з Akkusativ; mit, zu, bei, seit, vor, nach з Dativ.',
			'Cheat sheet: für, ohne, durch, um with accusative; mit, zu, bei, seit, vor, nach with dative.',
			'Ściąga: für, ohne, durch, um z Akkusativ; mit, zu, bei, seit, vor, nach z Dativ.',
			'Chuleta: für, ohne, durch, um con acusativo; mit, zu, bei, seit, vor, nach con dativo.',
			'Aide-mémoire : für, ohne, durch, um avec l’accusatif ; mit, zu, bei, seit, vor, nach avec le datif.',
			'Kısa not: für, ohne, durch, um Akkusativ ile; mit, zu, bei, seit, vor, nach Dativ ile.',
			'Fițuică: für, ohne, durch, um cu acuzativ; mit, zu, bei, seit, vor, nach cu dativ.',
			"Qisqa eslatma: für, ohne, durch, um Akkusativ bilan; mit, zu, bei, seit, vor, nach Dativ bilan.",
			'छोटा नोट: für, ohne, durch, um Akkusativ के साथ; mit, zu, bei, seit, vor, nach Dativ के साथ।',
			'ملخص: für وohne وdurch وum مع المفعول؛ وmit وzu وbei وseit وvor وnach مع الجر.'
		], [ex('Ich wohne seit 2020 hier.', t11('Я живу здесь с 2020 года.', 'Я живу тут з 2020 року.', 'I’ve lived here since 2020.', 'Mieszkam tu od 2020 roku.', 'Vivo aquí desde 2020.', 'J’habite ici depuis 2020.', '2020’den beri burada yaşıyorum.', 'Locuiesc aici din 2020.', '2020-yildan beri shu yerda yashayman.', 'मैं 2020 से यहाँ रहता हूँ।', 'أسكن هنا منذ 2020.'))])]
	}
}

module.exports = quests
