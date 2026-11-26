// Грамматика к заданиям земли time-road (vor, seit, für, in, ab, bis, zuerst/dann)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const vorPoint = pt(['vor: назад', 'vor: тому', 'vor: ago', 'vor: temu', 'vor: hace', 'vor : il y a', 'vor: önce', 'vor: acum (în urmă)', 'vor: oldin', 'vor: पहले', 'vor: قبل'], [
	'vor + Dativ значит «... назад»: vor einem Jahr. Во множественном Dativ + -n: vor zwei Jahren. Обычно с Perfekt.',
	'vor + Dativ означає «... тому»: vor einem Jahr. У множині Dativ + -n: vor zwei Jahren. Зазвичай із Perfekt.',
	'vor + dative means "... ago": vor einem Jahr. In the plural the dative adds -n: vor zwei Jahren. Usually with Perfekt.',
	'vor + Dativ znaczy „... temu”: vor einem Jahr. W liczbie mnogiej Dativ + -n: vor zwei Jahren. Zwykle z Perfekt.',
	'vor + dativo significa "hace ...": vor einem Jahr. En plural el dativo añade -n: vor zwei Jahren. Normalmente con Perfekt.',
	'vor + datif veut dire « il y a ... » : vor einem Jahr. Au pluriel, le datif ajoute -n : vor zwei Jahren. En général avec le Perfekt.',
	'vor + Dativ "... önce" demektir: vor einem Jahr. Çoğulda Dativ -n alır: vor zwei Jahren. Genelde Perfekt ile.',
	'vor + dativ înseamnă „acum ...”: vor einem Jahr. La plural dativul adaugă -n: vor zwei Jahren. De obicei cu Perfekt.',
	"vor + Dativ \"... oldin\" degani: vor einem Jahr. Ko'plikda Dativ -n oladi: vor zwei Jahren. Odatda Perfekt bilan.",
	'vor + Dativ मतलब "... पहले": vor einem Jahr। बहुवचन में Dativ + -n: vor zwei Jahren। आमतौर पर Perfekt के साथ।',
	'vor + الجر تعني "قبل ...": vor einem Jahr. وفي الجمع يضاف -n: vor zwei Jahren. وعادة مع Perfekt.'
], [ex('Ich bin vor zwei Jahren nach Deutschland gekommen.', t11('Я приехал в Германию два года назад.', 'Я приїхав до Німеччини два роки тому.', 'I came to Germany two years ago.', 'Przyjechałem do Niemiec dwa lata temu.', 'Llegué a Alemania hace dos años.', 'Je suis arrivé en Allemagne il y a deux ans.', 'İki yıl önce Almanya’ya geldim.', 'Am venit în Germania acum doi ani.', 'Men Germaniyaga ikki yil oldin kelganman.', 'मैं दो साल पहले जर्मनी आया।', 'جئت إلى ألمانيا قبل سنتين.'))])

const seitPoint = pt(['seit: уже', 'seit: уже', 'seit: for, since', 'seit: od', 'seit: desde hace', 'seit : depuis', 'seit: -den beri', 'seit: de', 'seit: ... dan beri', 'seit: से', 'seit: منذ'], [
	'seit + Dativ значит «уже ..., с ...». Действие ещё идёт, поэтому глагол в настоящем времени: Ich wohne seit drei Jahren hier.',
	'seit + Dativ означає «уже ..., з ...». Дія ще триває, тому дієслово в теперішньому часі: Ich wohne seit drei Jahren hier.',
	'seit + dative means "for ..., since ...". The action is still going on, so German uses the present tense: Ich wohne seit drei Jahren hier.',
	'seit + Dativ znaczy „od ...”. Czynność trwa, więc czasownik w czasie teraźniejszym: Ich wohne seit drei Jahren hier.',
	'seit + dativo significa "desde hace ...". La acción sigue, por eso el verbo va en presente: Ich wohne seit drei Jahren hier.',
	'seit + datif veut dire « depuis ... ». L’action continue, donc le verbe est au présent : Ich wohne seit drei Jahren hier.',
	'seit + Dativ "...dir, -den beri" demektir. Eylem sürüyor, bu yüzden fiil şimdiki zamanda: Ich wohne seit drei Jahren hier.',
	'seit + dativ înseamnă „de ...”. Acțiunea continuă, deci verbul e la prezent: Ich wohne seit drei Jahren hier.',
	"seit + Dativ \"...dan beri\" degani. Harakat hali davom etyapti, shuning uchun fe'l hozirgi zamonda: Ich wohne seit drei Jahren hier.",
	'seit + Dativ मतलब "... से"। काम अभी भी चल रहा है, इसलिए क्रिया वर्तमान में: Ich wohne seit drei Jahren hier।',
	'seit + الجر تعني "منذ ...". والفعل ما زال مستمراً، لذلك يأتي بالمضارع: Ich wohne seit drei Jahren hier.'
], [ex('Wir kennen uns seit zehn Jahren.', t11('Мы знакомы уже десять лет.', 'Ми знайомі вже десять років.', 'We’ve known each other for ten years.', 'Znamy się od dziesięciu lat.', 'Nos conocemos desde hace diez años.', 'Nous nous connaissons depuis dix ans.', 'On yıldır tanışıyoruz.', 'Ne cunoaștem de zece ani.', "Biz o'n yildan beri tanishmiz.", 'हम दस साल से एक-दूसरे को जानते हैं।', 'نعرف بعضنا منذ عشر سنوات.'))])

const fuerInPoint = pt(['für: на срок, in: через', 'für: на строк, in: через', 'für: for (a period), in: in (time)', 'für: na (okres), in: za', 'für: por (un periodo), in: dentro de', 'für : pour (une durée), in : dans', 'für: süreliğine, in: sonra', 'für: pentru (o perioadă), in: peste', 'für: muddatga, in: ...dan keyin', 'für: अवधि के लिए, in: बाद', 'für: لمدة، in: بعد'], [
	'für + Akkusativ значит «на какой срок»: für zwei Wochen. in + Dativ значит «через»: in zwei Tagen, in einer Stunde.',
	'für + Akkusativ означає «на який строк»: für zwei Wochen. in + Dativ означає «через»: in zwei Tagen, in einer Stunde.',
	'für + accusative means "for (how long)": für zwei Wochen. in + dative means "in (from now)": in zwei Tagen, in einer Stunde.',
	'für + Akkusativ znaczy „na jak długo”: für zwei Wochen. in + Dativ znaczy „za”: in zwei Tagen, in einer Stunde.',
	'für + acusativo significa "por cuánto tiempo": für zwei Wochen. in + dativo significa "dentro de": in zwei Tagen, in einer Stunde.',
	'für + accusatif veut dire « pour (une durée) » : für zwei Wochen. in + datif veut dire « dans » : in zwei Tagen, in einer Stunde.',
	'für + Akkusativ "ne kadar süreliğine" demektir: für zwei Wochen. in + Dativ "sonra" demektir: in zwei Tagen, in einer Stunde.',
	'für + acuzativ înseamnă „pentru cât timp”: für zwei Wochen. in + dativ înseamnă „peste”: in zwei Tagen, in einer Stunde.',
	"für + Akkusativ \"qancha muddatga\" degani: für zwei Wochen. in + Dativ \"...dan keyin\" degani: in zwei Tagen, in einer Stunde.",
	'für + Akkusativ मतलब "कितने समय के लिए": für zwei Wochen। in + Dativ मतलब "बाद": in zwei Tagen, in einer Stunde।',
	'für + المفعول تعني "لمدة": für zwei Wochen. وin + الجر تعني "بعد": in zwei Tagen، in einer Stunde.'
], [
	ex('Wir fahren für zwei Wochen nach Italien.', t11('Мы едем в Италию на две недели.', 'Ми їдемо до Італії на два тижні.', 'We’re going to Italy for two weeks.', 'Jedziemy do Włoch na dwa tygodnie.', 'Nos vamos a Italia dos semanas.', 'Nous partons en Italie pour deux semaines.', 'İki haftalığına İtalya’ya gidiyoruz.', 'Mergem în Italia pentru două săptămâni.', 'Biz Italiyaga ikki haftaga boramiz.', 'हम दो हफ़्ते के लिए इटली जा रहे हैं।', 'نسافر إلى إيطاليا لمدة أسبوعين.')),
	ex('Ich komme in einer Stunde zurück.', t11('Я вернусь через час.', 'Я повернуся за годину.', 'I’ll be back in an hour.', 'Wrócę za godzinę.', 'Vuelvo dentro de una hora.', 'Je reviens dans une heure.', 'Bir saat sonra dönerim.', 'Mă întorc peste o oră.', 'Bir soatdan keyin qaytaman.', 'मैं एक घंटे में वापस आऊँगा।', 'سأعود بعد ساعة.'))
])

const abBisPoint = pt('ab, bis, von ... bis', [
	'ab значит «начиная с», bis значит «до», von ... bis значит «с ... до». Bis morgen! значит «до завтра».',
	'ab означає «починаючи з», bis означає «до», von ... bis означає «з ... до». Bis morgen! означає «до завтра».',
	'ab means "from (onwards)", bis means "until", von ... bis means "from ... to". Bis morgen! means "see you tomorrow".',
	'ab znaczy „od (począwszy)”, bis „do”, von ... bis „od ... do”. Bis morgen! znaczy „do jutra”.',
	'ab significa "a partir de", bis "hasta", von ... bis "de ... a". Bis morgen! significa "hasta mañana".',
	'ab veut dire « à partir de », bis « jusqu’à », von ... bis « de ... à ». Bis morgen ! veut dire « à demain ».',
	'ab "-den itibaren", bis "-e kadar", von ... bis "-den -e kadar" demektir. Bis morgen! "yarın görüşürüz" demektir.',
	'ab înseamnă „începând cu”, bis „până la”, von ... bis „de la ... până la”. Bis morgen! înseamnă „pe mâine”.',
	"ab \"...dan boshlab\", bis \"...gacha\", von ... bis \"...dan ...gacha\" degani. Bis morgen! \"ertagacha\" degani.",
	'ab मतलब "से शुरू", bis मतलब "तक", von ... bis मतलब "से ... तक"। Bis morgen! मतलब "कल मिलते हैं"।',
	'ab تعني "ابتداءً من"، وbis "حتى"، وvon ... bis "من ... إلى". وBis morgen! تعني "إلى الغد".'
], [ex('Ab Montag arbeite ich in einem neuen Büro.', t11('С понедельника я работаю в новом офисе.', 'З понеділка я працюю в новому офісі.', 'From Monday I’m working in a new office.', 'Od poniedziałku pracuję w nowym biurze.', 'A partir del lunes trabajo en una oficina nueva.', 'À partir de lundi, je travaille dans un nouveau bureau.', 'Pazartesiden itibaren yeni bir ofiste çalışıyorum.', 'De luni lucrez într-un birou nou.', 'Dushanbadan boshlab yangi ofisda ishlayman.', 'सोमवार से मैं नए दफ़्तर में काम करूँगा।', 'ابتداءً من الاثنين أعمل في مكتب جديد.'))])

const sequencePoint = pt(['zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst, dann, danach', 'zuerst وdann وdanach'], [
	'zuerst (сначала), dann (потом), danach (после этого), zum Schluss (в конце). Если такое слово первым, глагол сразу за ним, а подлежащее после глагола.',
	'zuerst (спочатку), dann (потім), danach (після цього), zum Schluss (наприкінці). Якщо таке слово першим, дієслово одразу за ним, а підмет після дієслова.',
	'zuerst (first), dann (then), danach (after that), zum Schluss (finally). If such a word comes first, the verb follows it and the subject comes after the verb.',
	'zuerst (najpierw), dann (potem), danach (następnie), zum Schluss (na koniec). Jeśli takie słowo jest pierwsze, czasownik idzie zaraz po nim, a podmiot po czasowniku.',
	'zuerst (primero), dann (luego), danach (después), zum Schluss (al final). Si una de estas palabras va primero, el verbo va justo después y el sujeto detrás del verbo.',
	'zuerst (d’abord), dann (ensuite), danach (après), zum Schluss (à la fin). Si un de ces mots est en premier, le verbe suit, puis le sujet.',
	'zuerst (önce), dann (sonra), danach (ondan sonra), zum Schluss (en sonunda). Bu kelime başta olursa fiil hemen ardından, özne fiilden sonra gelir.',
	'zuerst (întâi), dann (apoi), danach (după aceea), zum Schluss (la final). Dacă un asemenea cuvânt e primul, verbul vine imediat, iar subiectul după verb.',
	"zuerst (avval), dann (keyin), danach (undan so'ng), zum Schluss (oxirida). Bunday so'z birinchi tursa, fe'l darhol keyin, ega esa fe'ldan keyin keladi.",
	'zuerst (पहले), dann (फिर), danach (उसके बाद), zum Schluss (आखिर में)। अगर ऐसा शब्द पहले आए, तो क्रिया तुरंत बाद और कर्ता क्रिया के बाद।',
	'zuerst (أولاً)، dann (ثم)، danach (بعد ذلك)، zum Schluss (في النهاية). وإذا جاءت إحداها أولاً يليها الفعل ثم الفاعل.'
], [ex('Zuerst frühstücke ich, dann gehe ich zur Arbeit.', t11('Сначала я завтракаю, потом иду на работу.', 'Спочатку я снідаю, потім іду на роботу.', 'First I have breakfast, then I go to work.', 'Najpierw jem śniadanie, potem idę do pracy.', 'Primero desayuno, luego voy al trabajo.', 'D’abord je prends le petit déjeuner, ensuite je vais au travail.', 'Önce kahvaltı yaparım, sonra işe giderim.', 'Întâi iau micul dejun, apoi merg la muncă.', 'Avval nonushta qilaman, keyin ishga boraman.', 'पहले मैं नाश्ता करता हूँ, फिर काम पर जाता हूँ।', 'أولاً أفطر ثم أذهب إلى العمل.'))])

const quests = {
	'time-road-one': { title: t11('Два года назад: vor', 'Два роки тому: vor', 'Two years ago: vor', 'Dwa lata temu: vor', 'Hace dos años: vor', 'Il y a deux ans : vor', 'İki yıl önce: vor', 'Acum doi ani: vor', 'Ikki yil oldin: vor', 'दो साल पहले: vor', 'قبل سنتين: vor'), points: [vorPoint] },
	'time-road-two': { title: t11('Уже три года: seit', 'Уже три роки: seit', 'For three years: seit', 'Od trzech lat: seit', 'Desde hace tres años: seit', 'Depuis trois ans : seit', 'Üç yıldır: seit', 'De trei ani: seit', 'Uch yildan beri: seit', 'तीन साल से: seit', 'منذ ثلاث سنوات: seit'), points: [seitPoint] },
	'time-road-three': { title: t11('На две недели: für', 'На два тижні: für', 'For two weeks: für', 'Na dwa tygodnie: für', 'Durante dos semanas: für', 'Pour deux semaines : für', 'İki haftalığına: für', 'Pentru două săptămâni: für', 'Ikki haftaga: für', 'दो हफ़्ते के लिए: für', 'لمدة أسبوعين: für'), points: [fuerInPoint] },
	'time-road-four': { title: t11('Через час, после работы', 'За годину, після роботи', 'In an hour, after work', 'Za godzinę, po pracy', 'Dentro de una hora, después del trabajo', 'Dans une heure, après le travail', 'Bir saat sonra, işten sonra', 'Peste o oră, după muncă', 'Bir soatdan keyin, ishdan keyin', 'एक घंटे में, काम के बाद', 'بعد ساعة، بعد العمل'), points: [fuerInPoint, pt(['nach и vor + Dativ', 'nach і vor + Dativ', 'nach and vor + dative', 'nach i vor + Dativ', 'nach y vor + dativo', 'nach et vor + datif', 'nach ve vor + Dativ', 'nach și vor + dativ', 'nach va vor + Dativ', 'nach और vor + Dativ', 'nach وvor + الجر'], [
		'nach dem Essen значит «после еды», vor dem Essen значит «перед едой». Не путай с vor einer Woche (неделю назад).',
		'nach dem Essen означає «після їжі», vor dem Essen означає «перед їжею». Не плутай з vor einer Woche (тиждень тому).',
		'nach dem Essen means "after the meal", vor dem Essen means "before the meal". Don’t confuse with vor einer Woche (a week ago).',
		'nach dem Essen znaczy „po jedzeniu”, vor dem Essen „przed jedzeniem”. Nie myl z vor einer Woche (tydzień temu).',
		'nach dem Essen significa "después de comer", vor dem Essen "antes de comer". No confundas con vor einer Woche (hace una semana).',
		'nach dem Essen veut dire « après le repas », vor dem Essen « avant le repas ». Ne confonds pas avec vor einer Woche (il y a une semaine).',
		'nach dem Essen "yemekten sonra", vor dem Essen "yemekten önce" demektir. vor einer Woche (bir hafta önce) ile karıştırma.',
		'nach dem Essen înseamnă „după masă”, vor dem Essen „înainte de masă”. Nu confunda cu vor einer Woche (acum o săptămână).',
		"nach dem Essen \"ovqatdan keyin\", vor dem Essen \"ovqatdan oldin\" degani. vor einer Woche (bir hafta oldin) bilan adashtirma.",
		'nach dem Essen मतलब "खाने के बाद", vor dem Essen मतलब "खाने से पहले"। vor einer Woche (एक हफ़्ता पहले) से मत मिलाओ।',
		'nach dem Essen تعني "بعد الأكل"، وvor dem Essen "قبل الأكل". لا تخلط مع vor einer Woche (قبل أسبوع).'
	], [ex('Nach dem Unterricht trinken wir Kaffee.', t11('После урока мы пьём кофе.', 'Після уроку ми п’ємо каву.', 'After class we drink coffee.', 'Po lekcji pijemy kawę.', 'Después de clase tomamos café.', 'Après le cours, nous buvons un café.', 'Dersten sonra kahve içeriz.', 'După oră bem cafea.', 'Darsdan keyin qahva ichamiz.', 'कक्षा के बाद हम कॉफ़ी पीते हैं।', 'بعد الدرس نشرب القهوة.'))])] },
	'time-road-five': { title: t11('С понедельника до пятницы', 'З понеділка до п’ятниці', 'From Monday to Friday', 'Od poniedziałku do piątku', 'De lunes a viernes', 'Du lundi au vendredi', 'Pazartesiden cumaya', 'De luni până vineri', 'Dushanbadan jumagacha', 'सोमवार से शुक्रवार तक', 'من الاثنين إلى الجمعة'), points: [abBisPoint] },
	'time-road-six': { title: t11('Сначала, потом, в конце', 'Спочатку, потім, наприкінці', 'First, then, finally', 'Najpierw, potem, na koniec', 'Primero, luego, al final', 'D’abord, ensuite, à la fin', 'Önce, sonra, en sonunda', 'Întâi, apoi, la final', 'Avval, keyin, oxirida', 'पहले, फिर, आखिर में', 'أولاً، ثم، في النهاية'), points: [sequencePoint] },
	'time-road-seven': { title: t11('Практика: новая работа', 'Практика: нова робота', 'Practice: a new job', 'Praktyka: nowa praca', 'Práctica: un trabajo nuevo', 'Pratique : un nouveau travail', 'Pratik: yeni iş', 'Practică: un loc de muncă nou', 'Mashq: yangi ish', 'अभ्यास: नई नौकरी', 'تدريب: عمل جديد'), points: [seitPoint, abBisPoint] },
	'time-road-eight': { title: t11('Практика: каникулы у моря', 'Практика: канікули біля моря', 'Practice: holiday by the sea', 'Praktyka: wakacje nad morzem', 'Práctica: vacaciones en el mar', 'Pratique : vacances à la mer', 'Pratik: deniz tatili', 'Practică: vacanță la mare', "Mashq: dengiz bo'yida ta'til", 'अभ्यास: समुद्र किनारे छुट्टी', 'تدريب: عطلة على البحر'), points: [fuerInPoint, vorPoint] },
	'time-road-nine': { title: t11('Повторение: когда и как долго', 'Повторення: коли і як довго', 'Review: when and how long', 'Powtórka: kiedy i jak długo', 'Repaso: cuándo y cuánto tiempo', 'Révision : quand et combien de temps', 'Tekrar: ne zaman ve ne kadar', 'Recapitulare: când și cât timp', 'Takrorlash: qachon va qancha', 'दोहराव: कब और कितनी देर', 'مراجعة: متى وكم من الوقت'), points: [vorPoint, seitPoint, fuerInPoint] },
	'time-road-ten': { title: finalTitle, points: [vorPoint, seitPoint, fuerInPoint] }
}

module.exports = quests
