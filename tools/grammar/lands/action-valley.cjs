// Грамматика к заданиям земли action-valley (падежи, глаголы с предлогами, darauf/worauf)
const { ex, t11, pt } = require('../lib.cjs')

const pronPoint = pt(['mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir, dir, ihm, ihr', 'mir وdir وihm وihr'], [
	'Кому: mir (мне), dir (тебе), ihm (ему), ihr (ей), uns (нам), euch (вам), ihnen (им), Ihnen (Вам).',
	'Кому: mir (мені), dir (тобі), ihm (йому), ihr (їй), uns (нам), euch (вам), ihnen (їм), Ihnen (Вам).',
	'To whom: mir (me), dir (you), ihm (him), ihr (her), uns (us), euch (you all), ihnen (them), Ihnen (you, polite).',
	'Komu: mir (mi), dir (ci), ihm (mu), ihr (jej), uns (nam), euch (wam), ihnen (im), Ihnen (Panu/Pani).',
	'A quién: mir (me), dir (te), ihm (le, a él), ihr (le, a ella), uns (nos), euch (os), ihnen (les), Ihnen (le, usted).',
	'À qui : mir (me), dir (te), ihm (lui, à lui), ihr (lui, à elle), uns (nous), euch (vous), ihnen (leur), Ihnen (vous, poli).',
	'Kime: mir (bana), dir (sana), ihm (ona, erkek), ihr (ona, kadın), uns (bize), euch (size), ihnen (onlara), Ihnen (size, kibar).',
	'Cui: mir (mie), dir (ție), ihm (lui), ihr (ei), uns (nouă), euch (vouă), ihnen (lor), Ihnen (dumneavoastră).',
	"Kimga: mir (menga), dir (senga), ihm (unga, erkak), ihr (unga, ayol), uns (bizga), euch (sizlarga), ihnen (ularga), Ihnen (Sizga).",
	'किसे: mir (मुझे), dir (तुम्हें), ihm (उसे, पु), ihr (उसे, स्त्री), uns (हमें), euch (तुम सबको), ihnen (उन्हें), Ihnen (आपको)।',
	'لمن: mir (لي)، dir (لك)، ihm (له)، ihr (لها)، uns (لنا)، euch (لكم)، ihnen (لهم)، Ihnen (لحضرتك).'
], [
	ex('Kannst du mir helfen?', t11('Ты можешь мне помочь?', 'Ти можеш мені допомогти?', 'Can you help me?', 'Możesz mi pomóc?', '¿Me puedes ayudar?', 'Tu peux m’aider ?', 'Bana yardım edebilir misin?', 'Mă poți ajuta?', 'Menga yordam bera olasanmi?', 'क्या तुम मेरी मदद कर सकते हो?', 'هل يمكنك مساعدتي؟'))
])

const verbCasePoint = pt(['Глаголы с Dativ', 'Дієслова з Dativ', 'Verbs with the dative', 'Czasowniki z Dativ', 'Verbos con dativo', 'Verbes avec le datif', 'Dativ alan fiiller', 'Verbe cu dativ', "Dativ talab qiladigan fe'llar", 'Dativ वाली क्रियाएँ', 'أفعال مع حالة الجر'], [
	'helfen, danken, gratulieren, glauben, gefallen требуют Dativ. А sehen, besuchen, anrufen требуют Akkusativ, хотя по-русски может звучать иначе.',
	'helfen, danken, gratulieren, glauben, gefallen вимагають Dativ. А sehen, besuchen, anrufen вимагають Akkusativ, хоч українською може звучати інакше.',
	'helfen, danken, gratulieren, glauben, gefallen take the dative. sehen, besuchen, anrufen take the accusative.',
	'helfen, danken, gratulieren, glauben, gefallen wymagają Dativ. A sehen, besuchen, anrufen wymagają Akkusativ, choć po polsku bywa inaczej.',
	'helfen, danken, gratulieren, glauben, gefallen van con dativo. sehen, besuchen, anrufen van con acusativo.',
	'helfen, danken, gratulieren, glauben, gefallen demandent le datif. sehen, besuchen, anrufen demandent l’accusatif.',
	'helfen, danken, gratulieren, glauben, gefallen Dativ ister. sehen, besuchen, anrufen ise Akkusativ ister.',
	'helfen, danken, gratulieren, glauben, gefallen cer dativ. sehen, besuchen, anrufen cer acuzativ.',
	"helfen, danken, gratulieren, glauben, gefallen Dativ talab qiladi. sehen, besuchen, anrufen esa Akkusativ.",
	'helfen, danken, gratulieren, glauben, gefallen के साथ Dativ। sehen, besuchen, anrufen के साथ Akkusativ।',
	'helfen وdanken وgratulieren وglauben وgefallen تأخذ حالة الجر. أما sehen وbesuchen وanrufen فتأخذ المفعول.'
], [
	ex('Er hilft oft seinem Vater.', t11('Он часто помогает отцу.', 'Він часто допомагає батькові.', 'He often helps his father.', 'On często pomaga ojcu.', 'Él ayuda a menudo a su padre.', 'Il aide souvent son père.', 'O sık sık babasına yardım eder.', 'El își ajută des tatăl.', 'U otasiga tez-tez yordam beradi.', 'वह अक्सर अपने पिता की मदद करता है।', 'هو يساعد أباه كثيراً.')),
	ex('Ich rufe den Vater an.', t11('Я звоню отцу.', 'Я телефоную батькові.', 'I call my father.', 'Dzwonię do ojca.', 'Llamo a mi padre.', 'J’appelle mon père.', 'Babamı arıyorum.', 'Îl sun pe tata.', "Otamga qo'ng'iroq qilaman.", 'मैं पिता को फ़ोन करता हूँ।', 'أتصل بأبي.'))
])

const wechselPoint = pt(['Wohin? или Wo?', 'Wohin? чи Wo?', 'Wohin? or Wo?', 'Wohin? czy Wo?', '¿Wohin? o Wo?', 'Wohin ? ou Wo ?', 'Wohin? mi, Wo? mu', 'Wohin? sau Wo?', 'Wohin? yoki Wo?', 'Wohin? या Wo?', 'Wohin؟ أم Wo؟'], [
	'in, an, auf, hinter, neben и другие: если движение «куда?», то Akkusativ (auf den Tisch). Если место «где?», то Dativ (auf dem Tisch).',
	'in, an, auf, hinter, neben та інші: якщо рух «куди?», то Akkusativ (auf den Tisch). Якщо місце «де?», то Dativ (auf dem Tisch).',
	'in, an, auf, hinter, neben and others: movement "where to?" takes the accusative (auf den Tisch). Location "where?" takes the dative (auf dem Tisch).',
	'in, an, auf, hinter, neben i inne: ruch „dokąd?” to Akkusativ (auf den Tisch). Miejsce „gdzie?” to Dativ (auf dem Tisch).',
	'in, an, auf, hinter, neben y otras: movimiento "¿adónde?" lleva acusativo (auf den Tisch). Lugar "¿dónde?" lleva dativo (auf dem Tisch).',
	'in, an, auf, hinter, neben et d’autres : un mouvement « vers où ? » prend l’accusatif (auf den Tisch). Un lieu « où ? » prend le datif (auf dem Tisch).',
	'in, an, auf, hinter, neben ve diğerleri: "nereye?" hareketi Akkusativ (auf den Tisch), "nerede?" yeri Dativ (auf dem Tisch).',
	'in, an, auf, hinter, neben și altele: mișcarea „încotro?” cere acuzativ (auf den Tisch). Locul „unde?” cere dativ (auf dem Tisch).',
	"in, an, auf, hinter, neben va boshqalar: \"qayerga?\" harakat Akkusativ (auf den Tisch), \"qayerda?\" joy Dativ (auf dem Tisch).",
	'in, an, auf, hinter, neben आदि: "किधर?" गति हो तो Akkusativ (auf den Tisch), "कहाँ?" जगह हो तो Dativ (auf dem Tisch)।',
	'in وan وauf وhinter وneben وغيرها: الحركة "إلى أين؟" تأخذ المفعول (auf den Tisch)، والمكان "أين؟" يأخذ الجر (auf dem Tisch).'
], [
	ex('Ich stelle die Vase auf den Tisch.', t11('Я ставлю вазу на стол.', 'Я ставлю вазу на стіл.', 'I put the vase on the table.', 'Stawiam wazon na stół.', 'Pongo el jarrón en la mesa.', 'Je pose le vase sur la table.', 'Vazoyu masaya koyuyorum.', 'Pun vaza pe masă.', "Vazani stolga qo'yaman.", 'मैं फूलदान मेज़ पर रखता हूँ।', 'أضع المزهرية على الطاولة.')),
	ex('Die Vase steht auf dem Tisch.', t11('Ваза стоит на столе.', 'Ваза стоїть на столі.', 'The vase is on the table.', 'Wazon stoi na stole.', 'El jarrón está en la mesa.', 'Le vase est sur la table.', 'Vazo masada duruyor.', 'Vaza stă pe masă.', 'Vaza stol ustida turibdi.', 'फूलदान मेज़ पर रखा है।', 'المزهرية على الطاولة.'))
])

const twoObjectsPoint = pt(['Сначала кому, потом что', 'Спочатку кому, потім що', 'First to whom, then what', 'Najpierw komu, potem co', 'Primero a quién, luego qué', 'D’abord à qui, puis quoi', 'Önce kime, sonra neyi', 'Întâi cui, apoi ce', 'Avval kimga, keyin nimani', 'पहले किसे, फिर क्या', 'أولاً لمن ثم ماذا'], [
	'Если есть и человек, и вещь: сначала человек в Dativ, потом вещь в Akkusativ.',
	'Якщо є і людина, і річ: спочатку людина в Dativ, потім річ в Akkusativ.',
	'With both a person and a thing: first the person in the dative, then the thing in the accusative.',
	'Gdy jest i osoba, i rzecz: najpierw osoba w Dativ, potem rzecz w Akkusativ.',
	'Si hay persona y cosa: primero la persona en dativo, luego la cosa en acusativo.',
	'Avec une personne et une chose : d’abord la personne au datif, puis la chose à l’accusatif.',
	'Hem kişi hem eşya varsa: önce kişi Dativ’de, sonra eşya Akkusativ’de.',
	'Când există și o persoană, și un lucru: întâi persoana la dativ, apoi lucrul la acuzativ.',
	"Ham odam, ham narsa bo'lsa: avval odam Dativda, keyin narsa Akkusativda.",
	'अगर व्यक्ति और चीज़ दोनों हों: पहले व्यक्ति Dativ में, फिर चीज़ Akkusativ में।',
	'إذا وُجد شخص وشيء: أولاً الشخص في حالة الجر ثم الشيء في حالة المفعول.'
], [
	ex('Ich schenke meiner Mutter Blumen.', t11('Я дарю маме цветы.', 'Я дарую мамі квіти.', 'I give my mother flowers.', 'Daruję mamie kwiaty.', 'Le regalo flores a mi madre.', 'J’offre des fleurs à ma mère.', 'Anneme çiçek hediye ediyorum.', 'Îi dăruiesc mamei flori.', "Onamga gul sovg'a qilaman.", 'मैं अपनी माँ को फूल देता हूँ।', 'أهدي أمي زهوراً.')),
	ex('Er gibt dem Kind den Apfel.', t11('Он даёт ребёнку яблоко.', 'Він дає дитині яблуко.', 'He gives the child the apple.', 'On daje dziecku jabłko.', 'Él le da la manzana al niño.', 'Il donne la pomme à l’enfant.', 'Çocuğa elmayı veriyor.', 'El îi dă copilului mărul.', 'U bolaga olmani beradi.', 'वह बच्चे को सेब देता है।', 'هو يعطي الطفل التفاحة.'))
])

const prepVerbPoint = pt(['Глагол + предлог', 'Дієслово + прийменник', 'Verb + preposition', 'Czasownik + przyimek', 'Verbo + preposición', 'Verbe + préposition', 'Fiil + edat', 'Verb + prepoziție', "Fe'l + ko'makchi", 'क्रिया + संबंधसूचक', 'فعل + حرف جر'], [
	'Некоторые глаголы идут со своим предлогом, его учим вместе: warten auf, denken an, sprechen über. После них Akkusativ.',
	'Деякі дієслова йдуть зі своїм прийменником, його вчимо разом: warten auf, denken an, sprechen über. Після них Akkusativ.',
	'Some verbs come with their own preposition, learn them together: warten auf, denken an, sprechen über. They take the accusative.',
	'Niektóre czasowniki mają swój przyimek, uczymy się ich razem: warten auf, denken an, sprechen über. Po nich Akkusativ.',
	'Algunos verbos llevan su preposición, se aprenden juntos: warten auf, denken an, sprechen über. Van con acusativo.',
	'Certains verbes ont leur préposition, on les apprend ensemble : warten auf, denken an, sprechen über. Suivis de l’accusatif.',
	'Bazı fiillerin kendi edatı var, birlikte öğrenilir: warten auf, denken an, sprechen über. Ardından Akkusativ.',
	'Unele verbe au prepoziția lor, se învață împreună: warten auf, denken an, sprechen über. Sunt urmate de acuzativ.',
	"Ba'zi fe'llarning o'z ko'makchisi bor, birga o'rganiladi: warten auf, denken an, sprechen über. Ulardan keyin Akkusativ.",
	'कुछ क्रियाओं का अपना संबंधसूचक होता है, साथ में सीखो: warten auf, denken an, sprechen über। इनके बाद Akkusativ।',
	'بعض الأفعال لها حرف جر خاص يُحفظ معها: warten auf، denken an، sprechen über. وبعدها حالة المفعول.'
], [
	ex('Ich warte auf dich.', t11('Я жду тебя.', 'Я чекаю на тебе.', 'I’m waiting for you.', 'Czekam na ciebie.', 'Te espero.', 'Je t’attends.', 'Seni bekliyorum.', 'Te aștept.', 'Seni kutyapman.', 'मैं तुम्हारा इंतज़ार कर रहा हूँ।', 'أنتظرك.')),
	ex('Wir sprechen über den Film.', t11('Мы говорим о фильме.', 'Ми говоримо про фільм.', 'We’re talking about the film.', 'Rozmawiamy o filmie.', 'Hablamos de la película.', 'Nous parlons du film.', 'Film hakkında konuşuyoruz.', 'Vorbim despre film.', 'Biz film haqida gaplashyapmiz.', 'हम फ़िल्म के बारे में बात कर रहे हैं।', 'نتحدث عن الفيلم.'))
])

const daWoPoint = pt(['darauf и worauf', 'darauf і worauf', 'darauf and worauf', 'darauf i worauf', 'darauf y worauf', 'darauf et worauf', 'darauf ve worauf', 'darauf și worauf', 'darauf va worauf', 'darauf और worauf', 'darauf وworauf'], [
	'Про вещь спрашиваем wo + предлог: Worauf wartest du? Заменяем вещь da + предлог: Ich warte darauf. Перед гласной добавляется r: wo-r-über, da-r-an.',
	'Про річ питаємо wo + прийменник: Worauf wartest du? Замінюємо річ da + прийменник: Ich warte darauf. Перед голосною додається r: wo-r-über, da-r-an.',
	'Ask about a thing with wo + preposition: Worauf wartest du? Replace the thing with da + preposition: Ich warte darauf. Before a vowel add r: wo-r-über, da-r-an.',
	'O rzecz pytamy wo + przyimek: Worauf wartest du? Rzecz zastępujemy da + przyimek: Ich warte darauf. Przed samogłoską dochodzi r: wo-r-über, da-r-an.',
	'Para preguntar por una cosa: wo + preposición: Worauf wartest du? Para sustituirla: da + preposición: Ich warte darauf. Ante vocal se añade r: wo-r-über, da-r-an.',
	'Pour une chose on demande wo + préposition : Worauf wartest du ? On la remplace par da + préposition : Ich warte darauf. Devant une voyelle, on ajoute r : wo-r-über, da-r-an.',
	'Bir şeyi sormak için wo + edat: Worauf wartest du? Yerine koymak için da + edat: Ich warte darauf. Ünlüden önce r eklenir: wo-r-über, da-r-an.',
	'Despre un lucru întrebi cu wo + prepoziție: Worauf wartest du? Îl înlocuiești cu da + prepoziție: Ich warte darauf. Înaintea unei vocale apare r: wo-r-über, da-r-an.',
	"Narsa haqida wo + ko'makchi bilan so'raladi: Worauf wartest du? Narsani da + ko'makchi bilan almashtiramiz: Ich warte darauf. Unlidan oldin r qo'shiladi: wo-r-über, da-r-an.",
	'चीज़ के बारे में wo + संबंधसूचक से पूछते हैं: Worauf wartest du? चीज़ की जगह da + संबंधसूचक: Ich warte darauf। स्वर से पहले r जुड़ता है: wo-r-über, da-r-an।',
	'نسأل عن الشيء بـ wo + حرف الجر: Worauf wartest du؟ ونستبدل الشيء بـ da + حرف الجر: Ich warte darauf. وقبل الحرف الصوتي تضاف r: wo-r-über، da-r-an.'
], [
	ex('Worüber sprecht ihr?', t11('О чём вы говорите?', 'Про що ви говорите?', 'What are you talking about?', 'O czym rozmawiacie?', '¿De qué habláis?', 'De quoi parlez-vous ?', 'Ne hakkında konuşuyorsunuz?', 'Despre ce vorbiți?', 'Nima haqida gaplashyapsizlar?', 'तुम सब किस बारे में बात कर रहे हो?', 'عمّ تتحدثون؟')),
	ex('Ich ärgere mich darüber.', t11('Меня это злит.', 'Мене це злить.', 'That annoys me.', 'Złości mnie to.', 'Eso me molesta.', 'Ça m’énerve.', 'Buna sinirleniyorum.', 'Mă enervează asta.', 'Bu meni jahlimni chiqaradi.', 'मुझे इस पर गुस्सा आता है।', 'هذا يزعجني.'))
])

const akkPrepPoint = pt(['für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für, ohne, durch, gegen, um', 'für وohne وdurch وgegen وum'], [
	'После этих предлогов всегда Akkusativ: für dich, ohne den Hund, durch den Park. gegen значит «против».',
	'Після цих прийменників завжди Akkusativ: für dich, ohne den Hund, durch den Park. gegen означає «проти».',
	'These prepositions always take the accusative: für dich, ohne den Hund, durch den Park. gegen means "against".',
	'Po tych przyimkach zawsze Akkusativ: für dich, ohne den Hund, durch den Park. gegen znaczy „przeciw”.',
	'Estas preposiciones siempre van con acusativo: für dich, ohne den Hund, durch den Park. gegen significa "contra".',
	'Ces prépositions prennent toujours l’accusatif : für dich, ohne den Hund, durch den Park. gegen veut dire « contre ».',
	'Bu edatlardan sonra her zaman Akkusativ: für dich, ohne den Hund, durch den Park. gegen "karşı" demektir.',
	'Aceste prepoziții cer mereu acuzativ: für dich, ohne den Hund, durch den Park. gegen înseamnă „împotriva”.',
	"Bu ko'makchilardan keyin doim Akkusativ: für dich, ohne den Hund, durch den Park. gegen \"qarshi\" degani.",
	'इन संबंधसूचकों के बाद हमेशा Akkusativ: für dich, ohne den Hund, durch den Park। gegen मतलब "के विरुद्ध"।',
	'بعد هذه الحروف دائماً حالة المفعول: für dich، ohne den Hund، durch den Park. وgegen تعني "ضد".'
], [ex('Ich komme ohne den Hund.', t11('Я приду без собаки.', 'Я прийду без собаки.', 'I’ll come without the dog.', 'Przyjdę bez psa.', 'Vengo sin el perro.', 'Je viens sans le chien.', 'Köpeksiz geliyorum.', 'Vin fără câine.', 'Itsiz kelaman.', 'मैं कुत्ते के बिना आऊँगा।', 'سآتي بدون الكلب.'))])

const datPrepPoint = pt(['mit, zu, von, bei + Dativ', 'mit, zu, von, bei + Dativ', 'mit, zu, von, bei + dative', 'mit, zu, von, bei + Dativ', 'mit, zu, von, bei + dativo', 'mit, zu, von, bei + datif', 'mit, zu, von, bei + Dativ', 'mit, zu, von, bei + dativ', 'mit, zu, von, bei + Dativ', 'mit, zu, von, bei + Dativ', 'mit وzu وvon وbei + الجر'], [
	'После mit, zu, von, bei, aus, nach всегда Dativ: mit dem Freund, zum Arzt, von der Arbeit.',
	'Після mit, zu, von, bei, aus, nach завжди Dativ: mit dem Freund, zum Arzt, von der Arbeit.',
	'After mit, zu, von, bei, aus, nach always the dative: mit dem Freund, zum Arzt, von der Arbeit.',
	'Po mit, zu, von, bei, aus, nach zawsze Dativ: mit dem Freund, zum Arzt, von der Arbeit.',
	'Después de mit, zu, von, bei, aus, nach siempre dativo: mit dem Freund, zum Arzt, von der Arbeit.',
	'Après mit, zu, von, bei, aus, nach, toujours le datif : mit dem Freund, zum Arzt, von der Arbeit.',
	'mit, zu, von, bei, aus, nach’tan sonra her zaman Dativ: mit dem Freund, zum Arzt, von der Arbeit.',
	'După mit, zu, von, bei, aus, nach mereu dativ: mit dem Freund, zum Arzt, von der Arbeit.',
	"mit, zu, von, bei, aus, nach dan keyin doim Dativ: mit dem Freund, zum Arzt, von der Arbeit.",
	'mit, zu, von, bei, aus, nach के बाद हमेशा Dativ: mit dem Freund, zum Arzt, von der Arbeit।',
	'بعد mit وzu وvon وbei وaus وnach دائماً حالة الجر: mit dem Freund، zum Arzt، von der Arbeit.'
], [ex('Ich gehe mit meinem Freund.', t11('Я иду со своим другом.', 'Я йду зі своїм другом.', 'I’m going with my friend.', 'Idę z moim przyjacielem.', 'Voy con mi amigo.', 'J’y vais avec mon ami.', 'Arkadaşımla gidiyorum.', 'Merg cu prietenul meu.', "Do'stim bilan boryapman.", 'मैं अपने दोस्त के साथ जा रहा हूँ।', 'أذهب مع صديقي.'))])

const quests = {
	'action-one': { title: t11('Мне, тебе, ему: Dativ', 'Мені, тобі, йому: Dativ', 'Me, you, him: dative', 'Mi, ci, mu: Dativ', 'Me, te, le: dativo', 'Me, te, lui : datif', 'Bana, sana, ona: Dativ', 'Mie, ție, lui: dativ', 'Menga, senga, unga: Dativ', 'मुझे, तुम्हें, उसे: Dativ', 'لي، لك، له: الجر'), points: [pronPoint] },
	'action-two': { title: t11('С кем и куда', 'З ким і куди', 'With whom and where to', 'Z kim i dokąd', 'Con quién y adónde', 'Avec qui et où', 'Kiminle ve nereye', 'Cu cine și încotro', 'Kim bilan va qayerga', 'किसके साथ और कहाँ', 'مع من وإلى أين'), points: [datPrepPoint] },
	'action-three': { title: t11('für, ohne, durch: Akkusativ', 'für, ohne, durch: Akkusativ', 'für, ohne, durch: accusative', 'für, ohne, durch: Akkusativ', 'für, ohne, durch: acusativo', 'für, ohne, durch : accusatif', 'für, ohne, durch: Akkusativ', 'für, ohne, durch: acuzativ', 'für, ohne, durch: Akkusativ', 'für, ohne, durch: Akkusativ', 'für وohne وdurch: المفعول'), points: [akkPrepPoint] },
	'action-four': { title: t11('Куда или где?', 'Куди чи де?', 'Where to or where?', 'Dokąd czy gdzie?', '¿Adónde o dónde?', 'Où (vers) ou où ?', 'Nereye mi, nerede mi?', 'Încotro sau unde?', 'Qayerga yoki qayerda?', 'किधर या कहाँ?', 'إلى أين أم أين؟'), points: [wechselPoint] },
	'action-five': { title: t11('Кому и что', 'Кому і що', 'To whom and what', 'Komu i co', 'A quién y qué', 'À qui et quoi', 'Kime ve neyi', 'Cui și ce', 'Kimga va nimani', 'किसे और क्या', 'لمن وماذا'), points: [twoObjectsPoint] },
	'action-six': { title: t11('Какой падеж у глагола', 'Який відмінок у дієслова', 'Which case a verb takes', 'Jaki przypadek ma czasownik', 'Qué caso pide el verbo', 'Quel cas demande le verbe', 'Fiil hangi hâli ister', 'Ce caz cere verbul', "Fe'l qaysi kelishikni talab qiladi", 'क्रिया कौन-सा कारक लेती है', 'أي حالة يطلب الفعل'), points: [verbCasePoint] },
	'action-seven': { title: t11('Глаголы-ловушки', 'Дієслова-пастки', 'Tricky verbs', 'Czasowniki-pułapki', 'Verbos trampa', 'Verbes pièges', 'Tuzak fiiller', 'Verbe-capcană', "Tuzoq fe'llar", 'मुश्किल क्रियाएँ', 'أفعال خادعة'), points: [verbCasePoint] },
	'action-eight': { title: t11('Глаголы с предлогами', 'Дієслова з прийменниками', 'Verbs with prepositions', 'Czasowniki z przyimkami', 'Verbos con preposición', 'Verbes à préposition', 'Edatlı fiiller', 'Verbe cu prepoziție', "Ko'makchili fe'llar", 'संबंधसूचक वाली क्रियाएँ', 'أفعال مع حروف جر'), points: [prepVerbPoint] },
	'action-nine': { title: t11('darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber, wonach', 'darüber وwonach'), points: [daWoPoint] },
	'action-ten': { title: t11('darauf, wovon: закрепляем', 'darauf, wovon: закріплюємо', 'darauf, wovon: practice', 'darauf, wovon: utrwalamy', 'darauf, wovon: práctica', 'darauf, wovon : entraînement', 'darauf, wovon: pekiştirme', 'darauf, wovon: exersăm', 'darauf, wovon: mustahkamlash', 'darauf, wovon: अभ्यास', 'darauf وwovon: تثبيت'), points: [daWoPoint, prepVerbPoint] },
	'action-eleven': { title: t11('Финальный микс', 'Фінальний мікс', 'Final mix', 'Finałowy miks', 'Mezcla final', 'Mélange final', 'Final karışım', 'Mix final', 'Yakuniy aralash', 'अंतिम मिश्रण', 'المزيج النهائي'), points: [pronPoint, wechselPoint, daWoPoint] }
}

module.exports = quests
