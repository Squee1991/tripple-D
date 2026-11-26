// Грамматика к заданиям земли meet-meadow (Луг знакомств)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'meet-meadow-one': {
		title: {
			ru: 'Глагол sein: ich bin, du bist, Sie sind', uk: 'Дієслово sein: ich bin, du bist, Sie sind', en: 'The verb sein: ich bin, du bist, Sie sind',
			pl: 'Czasownik sein: ich bin, du bist, Sie sind', es: 'El verbo sein: ich bin, du bist, Sie sind', fr: 'Le verbe sein : ich bin, du bist, Sie sind',
			tr: 'sein fiili: ich bin, du bist, Sie sind', ro: 'Verbul sein: ich bin, du bist, Sie sind', uz: "sein fe'li: ich bin, du bist, Sie sind",
			hi: 'क्रिया sein: ich bin, du bist, Sie sind', ar: 'الفعل sein: ich bin، du bist، Sie sind'
		},
		points: [
			{
				t: {
					ru: ['sein нельзя пропускать', 'По-русски говорят «я Анна», а по-немецки глагол нужен всегда: Ich bin Anna. Формы: ich bin, du bist, Sie sind.'],
					uk: ['sein не можна пропускати', 'Українською кажуть «я Анна», а німецькою дієслово потрібне завжди: Ich bin Anna. Форми: ich bin, du bist, Sie sind.'],
					en: ['Never drop sein', 'In German the verb is always needed: Ich bin Anna. Forms: ich bin, du bist, Sie sind.'],
					pl: ['sein nie można pominąć', 'Po niemiecku czasownik jest zawsze potrzebny: Ich bin Anna. Formy: ich bin, du bist, Sie sind.'],
					es: ['sein nunca se omite', 'En alemán el verbo siempre es necesario: Ich bin Anna. Formas: ich bin, du bist, Sie sind.'],
					fr: ['On ne supprime jamais sein', 'En allemand le verbe est toujours nécessaire : Ich bin Anna. Formes : ich bin, du bist, Sie sind.'],
					tr: ['sein atlanmaz', 'Türkçede "Ben Anna’yım" denir, Almancada fiil her zaman gerekir: Ich bin Anna. Biçimler: ich bin, du bist, Sie sind.'],
					ro: ['sein nu se omite', 'În germană verbul este mereu necesar: Ich bin Anna. Forme: ich bin, du bist, Sie sind.'],
					uz: ["sein tushirib qoldirilmaydi", "O'zbekchada \"Men Anna\" deyiladi, nemischa fe'l doim kerak: Ich bin Anna. Shakllar: ich bin, du bist, Sie sind."],
					hi: ['sein छोड़ा नहीं जाता', 'जर्मन में क्रिया हमेशा चाहिए: Ich bin Anna. रूप: ich bin, du bist, Sie sind।'],
					ar: ['لا يُحذف الفعل sein', 'بالعربية نقول "أنا آنا"، أما بالألمانية فالفعل ضروري دائماً: Ich bin Anna. الصيغ: ich bin، du bist، Sie sind.']
				},
				examples: [
					ex('Ich bin Anna.', { ru: 'Я Анна.', uk: 'Я Анна.', en: 'I am Anna.', pl: 'Jestem Anna.', es: 'Soy Anna.', fr: 'Je suis Anna.', tr: 'Ben Anna’yım.', ro: 'Sunt Anna.', uz: 'Men Annaman.', hi: 'मैं अन्ना हूँ।', ar: 'أنا آنا.' }),
					ex('Du bist nett.', { ru: 'Ты милый.', uk: 'Ти милий.', en: 'You are nice.', pl: 'Jesteś miły.', es: 'Eres simpático.', fr: 'Tu es gentil.', tr: 'Sen naziksin.', ro: 'Ești drăguț.', uz: 'Sen yoqimlisan.', hi: 'तुम अच्छे हो।', ar: 'أنت لطيف.' }),
					ex('Sie sind Herr Weber.', { ru: 'Вы господин Вебер.', uk: 'Ви пан Вебер.', en: 'You are Mr Weber.', pl: 'Pan jest panem Weberem.', es: 'Usted es el señor Weber.', fr: 'Vous êtes Monsieur Weber.', tr: 'Siz Bay Weber’siniz.', ro: 'Sunteți domnul Weber.', uz: 'Siz janob Webersiz.', hi: 'आप श्रीमान वेबर हैं।', ar: 'أنت السيد فيبر.' })
				]
			},
			{
				t: {
					ru: ['Вопрос: глагол первым', 'В вопросе без вопросительного слова глагол ставим на первое место.'],
					uk: ['Питання: дієслово першим', 'У питанні без питального слова дієслово ставимо на перше місце.'],
					en: ['Questions: verb first', 'In a question without a question word, the verb goes first.'],
					pl: ['Pytanie: czasownik pierwszy', 'W pytaniu bez słowa pytającego czasownik stawiamy na pierwszym miejscu.'],
					es: ['Pregunta: el verbo primero', 'En una pregunta sin palabra interrogativa, el verbo va primero.'],
					fr: ['Question : le verbe en premier', 'Dans une question sans mot interrogatif, le verbe se met en première position.'],
					tr: ['Soru: fiil başta', 'Soru kelimesi olmayan soruda fiil en başa gelir.'],
					ro: ['Întrebarea: verbul primul', 'Într-o întrebare fără cuvânt interogativ, verbul vine primul.'],
					uz: ["Savol: fe'l birinchi", "Savol so'zi bo'lmagan savolda fe'l birinchi o'ringa qo'yiladi."],
					hi: ['सवाल: क्रिया पहले', 'बिना प्रश्नवाचक शब्द वाले सवाल में क्रिया सबसे पहले आती है।'],
					ar: ['السؤال: الفعل أولاً', 'في السؤال بدون أداة استفهام يأتي الفعل في أول الجملة.']
				},
				examples: [
					ex('Bist du Max?', { ru: 'Ты Макс?', uk: 'Ти Макс?', en: 'Are you Max?', pl: 'Jesteś Max?', es: '¿Eres Max?', fr: 'Tu es Max ?', tr: 'Sen Max mısın?', ro: 'Tu ești Max?', uz: 'Sen Maxmisan?', hi: 'क्या तुम मैक्स हो?', ar: 'هل أنت ماكس؟' }),
					ex('Sind Sie aus Österreich?', { ru: 'Вы из Австрии?', uk: 'Ви з Австрії?', en: 'Are you from Austria?', pl: 'Czy pan jest z Austrii?', es: '¿Es usted de Austria?', fr: 'Vous venez d’Autriche ?', tr: 'Avusturyalı mısınız?', ro: 'Sunteți din Austria?', uz: 'Siz Avstriyadanmisiz?', hi: 'क्या आप ऑस्ट्रिया से हैं?', ar: 'هل أنت من النمسا؟' })
				]
			}
		]
	},

	'meet-meadow-two': {
		title: {
			ru: 'Он, она, оно: er, sie, es', uk: 'Він, вона, воно: er, sie, es', en: 'He, she, it: er, sie, es',
			pl: 'On, ona, ono: er, sie, es', es: 'Él, ella, ello: er, sie, es', fr: 'Il, elle : er, sie, es',
			tr: 'O: er, sie, es', ro: 'El, ea: er, sie, es', uz: 'U: er, sie, es',
			hi: 'वह: er, sie, es', ar: 'هو، هي: er وsie وes'
		},
		points: [
			{
				t: {
					ru: ['Глагол ist', 'С er, sie, es глагол sein всегда ist.'],
					uk: ['Дієслово ist', 'З er, sie, es дієслово sein завжди ist.'],
					en: ['The verb ist', 'With er, sie, es the verb sein is always ist.'],
					pl: ['Czasownik ist', 'Z er, sie, es czasownik sein to zawsze ist.'],
					es: ['El verbo ist', 'Con er, sie, es el verbo sein siempre es ist.'],
					fr: ['Le verbe ist', 'Avec er, sie, es le verbe sein est toujours ist.'],
					tr: ['ist fiili', 'er, sie, es ile sein fiili her zaman ist olur.'],
					ro: ['Verbul ist', 'Cu er, sie, es verbul sein este mereu ist.'],
					uz: ["ist fe'li", "er, sie, es bilan sein fe'li doim ist bo'ladi."],
					hi: ['क्रिया ist', 'er, sie, es के साथ sein हमेशा ist होता है।'],
					ar: ['الفعل ist', 'مع er وsie وes يكون الفعل sein دائماً ist.']
				},
				examples: [
					ex('Er ist Arzt.', { ru: 'Он врач.', uk: 'Він лікар.', en: 'He is a doctor.', pl: 'On jest lekarzem.', es: 'Él es médico.', fr: 'Il est médecin.', tr: 'O doktor.', ro: 'El este medic.', uz: 'U shifokor.', hi: 'वह डॉक्टर है।', ar: 'هو طبيب.' }),
					ex('Sie ist sehr nett.', { ru: 'Она очень милая.', uk: 'Вона дуже мила.', en: 'She is very nice.', pl: 'Ona jest bardzo miła.', es: 'Ella es muy simpática.', fr: 'Elle est très gentille.', tr: 'O çok nazik.', ro: 'Ea este foarte drăguță.', uz: 'U juda yoqimli.', hi: 'वह बहुत अच्छी है।', ar: 'هي لطيفة جداً.' })
				]
			},
			{
				t: {
					ru: ['Местоимение по роду слова', 'Слово с der заменяем на er, с die на sie, с das на es. Так и с вещами: der Kaffee это er, хотя по-русски «он» тут случайно совпал.'],
					uk: ['Займенник за родом слова', 'Слово з der замінюємо на er, з die на sie, з das на es. Так само з речами: der Kaffee це er.'],
					en: ['The pronoun follows the gender', 'A der word becomes er, a die word becomes sie, a das word becomes es. Things too: der Kaffee is er, not "it".'],
					pl: ['Zaimek według rodzaju', 'Słowo z der zastępujemy er, z die sie, z das es. Tak samo z rzeczami: der Kaffee to er.'],
					es: ['El pronombre sigue el género', 'Una palabra con der se cambia por er, con die por sie, con das por es. También las cosas: der Kaffee es er.'],
					fr: ['Le pronom suit le genre', 'Un mot en der devient er, en die devient sie, en das devient es. Même les objets : der Kaffee, c’est er.'],
					tr: ['Zamir cinsiyete göre', 'der’li kelime er olur, die’li sie, das’lı es. Eşyalar da öyle: der Kaffee için er denir.'],
					ro: ['Pronumele după gen', 'Un cuvânt cu der devine er, cu die devine sie, cu das devine es. La fel la obiecte: der Kaffee este er.'],
					uz: ["Olmosh so'z rodiga qarab", "der li so'z er bo'ladi, die li sie, das li es. Narsalar ham: der Kaffee uchun er deyiladi."],
					hi: ['सर्वनाम लिंग के अनुसार', 'der वाला शब्द er बनता है, die वाला sie, das वाला es। चीज़ें भी: der Kaffee के लिए er।'],
					ar: ['الضمير حسب جنس الكلمة', 'الكلمة مع der تصبح er، ومع die تصبح sie، ومع das تصبح es. وكذلك الأشياء: der Kaffee يقال عنها er.']
				},
				examples: [
					ex('der Kaffee → Er ist heiß.', { ru: 'Кофе горячий.', uk: 'Кава гаряча.', en: 'The coffee is hot.', pl: 'Kawa jest gorąca.', es: 'El café está caliente.', fr: 'Le café est chaud.', tr: 'Kahve sıcak.', ro: 'Cafeaua este fierbinte.', uz: 'Qahva issiq.', hi: 'कॉफ़ी गरम है।', ar: 'القهوة ساخنة.' }),
					ex('das Kind → Es ist nett.', { ru: 'Ребёнок милый.', uk: 'Дитина мила.', en: 'The child is nice.', pl: 'Dziecko jest miłe.', es: 'El niño es simpático.', fr: 'L’enfant est gentil.', tr: 'Çocuk tatlı.', ro: 'Copilul este drăguț.', uz: 'Bola yoqimli.', hi: 'बच्चा प्यारा है।', ar: 'الطفل لطيف.' })
				]
			}
		]
	},

	'meet-meadow-three': {
		title: {
			ru: 'Мы, вы, они: wir sind, ihr seid', uk: 'Ми, ви, вони: wir sind, ihr seid', en: 'We, you, they: wir sind, ihr seid',
			pl: 'My, wy, oni: wir sind, ihr seid', es: 'Nosotros, vosotros, ellos: wir sind, ihr seid', fr: 'Nous, vous, ils : wir sind, ihr seid',
			tr: 'Biz, siz, onlar: wir sind, ihr seid', ro: 'Noi, voi, ei: wir sind, ihr seid', uz: 'Biz, sizlar, ular: wir sind, ihr seid',
			hi: 'हम, तुम सब, वे: wir sind, ihr seid', ar: 'نحن، أنتم، هم: wir sind وihr seid'
		},
		points: [
			{
				t: {
					ru: ['Формы во множественном', 'wir sind (мы), ihr seid (вы, когда «ты» много), sie sind (они).'],
					uk: ['Форми в множині', 'wir sind (ми), ihr seid (ви, коли «ти» багато), sie sind (вони).'],
					en: ['Plural forms', 'wir sind (we), ihr seid (you, several friends), sie sind (they).'],
					pl: ['Formy w liczbie mnogiej', 'wir sind (my), ihr seid (wy, kilka osób na „ty”), sie sind (oni).'],
					es: ['Formas del plural', 'wir sind (nosotros), ihr seid (vosotros, varios amigos), sie sind (ellos).'],
					fr: ['Formes du pluriel', 'wir sind (nous), ihr seid (vous, plusieurs amis), sie sind (ils, elles).'],
					tr: ['Çoğul biçimler', 'wir sind (biz), ihr seid (siz, birkaç arkadaş), sie sind (onlar).'],
					ro: ['Formele de plural', 'wir sind (noi), ihr seid (voi, mai mulți prieteni), sie sind (ei).'],
					uz: ["Ko'plik shakllari", "wir sind (biz), ihr seid (sizlar, bir nechta do'st), sie sind (ular)."],
					hi: ['बहुवचन रूप', 'wir sind (हम), ihr seid (तुम सब, कई दोस्त), sie sind (वे)।'],
					ar: ['صيغ الجمع', 'wir sind (نحن)، ihr seid (أنتم، عدة أصدقاء)، sie sind (هم).']
				},
				examples: [
					ex('Wir sind Freunde.', { ru: 'Мы друзья.', uk: 'Ми друзі.', en: 'We are friends.', pl: 'Jesteśmy przyjaciółmi.', es: 'Somos amigos.', fr: 'Nous sommes amis.', tr: 'Biz arkadaşız.', ro: 'Suntem prieteni.', uz: "Biz do'stmiz.", hi: 'हम दोस्त हैं।', ar: 'نحن أصدقاء.' }),
					ex('Seid ihr müde?', { ru: 'Вы устали?', uk: 'Ви втомилися?', en: 'Are you (all) tired?', pl: 'Jesteście zmęczeni?', es: '¿Estáis cansados?', fr: 'Vous êtes fatigués ?', tr: 'Yorgun musunuz?', ro: 'Sunteți obosiți?', uz: 'Charchadinglarmi?', hi: 'क्या तुम सब थके हो?', ar: 'هل أنتم متعبون؟' }),
					ex('Sie sind aus Wien.', { ru: 'Они из Вены.', uk: 'Вони з Відня.', en: 'They are from Vienna.', pl: 'Oni są z Wiednia.', es: 'Ellos son de Viena.', fr: 'Ils viennent de Vienne.', tr: 'Onlar Viyanalı.', ro: 'Ei sunt din Viena.', uz: 'Ular Venadan.', hi: 'वे वियना से हैं।', ar: 'هم من فيينا.' })
				]
			},
			{
				t: {
					ru: ['sie или Sie', 'sie с маленькой буквы значит «она» или «они»: смотри на глагол, sie ist или sie sind. Sie с большой буквы это вежливое «Вы», и глагол тоже sind.'],
					uk: ['sie чи Sie', 'sie з малої літери означає «вона» або «вони»: дивись на дієслово, sie ist чи sie sind. Sie з великої літери це ввічливе «Ви», і дієслово теж sind.'],
					en: ['sie or Sie', 'Lowercase sie means "she" or "they": look at the verb, sie ist or sie sind. Capital Sie is polite "you", also with sind.'],
					pl: ['sie czy Sie', 'sie małą literą znaczy „ona” albo „oni”: patrz na czasownik, sie ist czy sie sind. Sie wielką literą to grzeczne „Pan/Pani”, też z sind.'],
					es: ['sie o Sie', 'sie en minúscula significa "ella" o "ellos": mira el verbo, sie ist o sie sind. Sie con mayúscula es "usted", también con sind.'],
					fr: ['sie ou Sie', 'sie en minuscule veut dire « elle » ou « ils » : regarde le verbe, sie ist ou sie sind. Sie avec majuscule, c’est le « vous » poli, aussi avec sind.'],
					tr: ['sie mi, Sie mi', 'Küçük harfle sie "o (kadın)" ya da "onlar" demektir: fiile bak, sie ist mi sie sind mi. Büyük harfle Sie kibar "siz"dir, o da sind ile.'],
					ro: ['sie sau Sie', 'sie cu literă mică înseamnă „ea” sau „ei”: uită-te la verb, sie ist sau sie sind. Sie cu majusculă este „dumneavoastră”, tot cu sind.'],
					uz: ['sie yoki Sie', "Kichik harfli sie \"u (ayol)\" yoki \"ular\" degani: fe'lga qara, sie ist yoki sie sind. Bosh harfli Sie hurmatli \"Siz\", u ham sind bilan."],
					hi: ['sie या Sie', 'छोटे अक्षर वाला sie मतलब "वह (स्त्री)" या "वे": क्रिया देखो, sie ist या sie sind। बड़े अक्षर वाला Sie विनम्र "आप" है, वह भी sind के साथ।'],
					ar: ['sie أم Sie', 'sie بحرف صغير تعني "هي" أو "هم": انظر إلى الفعل، sie ist أم sie sind. أما Sie بحرف كبير فهي "حضرتك" المهذبة، ومعها أيضاً sind.']
				},
				examples: [
					ex('Sie ist müde.', { ru: 'Она устала.', uk: 'Вона втомилася.', en: 'She is tired.', pl: 'Ona jest zmęczona.', es: 'Ella está cansada.', fr: 'Elle est fatiguée.', tr: 'O yorgun.', ro: 'Ea este obosită.', uz: 'U charchagan.', hi: 'वह थकी है।', ar: 'هي متعبة.' }),
					ex('Sie sind müde.', { ru: 'Они устали. (или: Вы устали.)', uk: 'Вони втомилися. (або: Ви втомилися.)', en: 'They are tired. (or: You are tired.)', pl: 'Oni są zmęczeni. (albo: Pan jest zmęczony.)', es: 'Ellos están cansados. (o: Usted está cansado.)', fr: 'Ils sont fatigués. (ou : Vous êtes fatigué.)', tr: 'Onlar yorgun. (ya da: Siz yorgunsunuz.)', ro: 'Ei sunt obosiți. (sau: Sunteți obosit.)', uz: 'Ular charchagan. (yoki: Siz charchagansiz.)', hi: 'वे थके हैं। (या: आप थके हैं।)', ar: 'هم متعبون. (أو: حضرتك متعب.)' })
				]
			}
		]
	},

	'meet-meadow-four': {
		title: {
			ru: 'Глагол haben: у меня есть', uk: 'Дієслово haben: у мене є', en: 'The verb haben: I have',
			pl: 'Czasownik haben: mam', es: 'El verbo haben: tengo', fr: 'Le verbe haben : j’ai',
			tr: 'haben fiili: benim var', ro: 'Verbul haben: am', uz: "haben fe'li: menda bor",
			hi: 'क्रिया haben: मेरे पास है', ar: 'الفعل haben: عندي'
		},
		points: [
			{
				t: {
					ru: ['Формы haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. У du и er буква b пропадает.'],
					uk: ['Форми haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. У du і er літера b зникає.'],
					en: ['Forms of haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. With du and er the b disappears.'],
					pl: ['Formy haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Przy du i er znika litera b.'],
					es: ['Formas de haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Con du y er desaparece la b.'],
					fr: ['Formes de haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. Avec du et er, le b disparaît.'],
					tr: ['haben biçimleri', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. du ve er ile b harfi düşer.'],
					ro: ['Formele lui haben', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. La du și er litera b dispare.'],
					uz: ['haben shakllari', "ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben. du va er da b harfi tushib qoladi."],
					hi: ['haben के रूप', 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben। du और er के साथ b हट जाता है।'],
					ar: ['صيغ haben', 'ich habe، du hast، er/sie/es hat، wir haben، ihr habt، sie/Sie haben. مع du وer يختفي حرف b.']
				},
				examples: [
					ex('Ich habe einen Bruder.', { ru: 'У меня есть брат.', uk: 'У мене є брат.', en: 'I have a brother.', pl: 'Mam brata.', es: 'Tengo un hermano.', fr: 'J’ai un frère.', tr: 'Bir erkek kardeşim var.', ro: 'Am un frate.', uz: 'Mening akam (ukam) bor.', hi: 'मेरा एक भाई है।', ar: 'عندي أخ.' }),
					ex('Tim hat einen Hund.', { ru: 'У Тима есть собака.', uk: 'У Тіма є собака.', en: 'Tim has a dog.', pl: 'Tim ma psa.', es: 'Tim tiene un perro.', fr: 'Tim a un chien.', tr: 'Tim’in bir köpeği var.', ro: 'Tim are un câine.', uz: 'Timning iti bor.', hi: 'टिम के पास एक कुत्ता है।', ar: 'عند تيم كلب.' })
				]
			},
			{
				t: {
					ru: ['Голод и жажда через haben', 'По-немецки голод и жажду «имеют»: Ich habe Hunger, а не «я голодный».'],
					uk: ['Голод і спрага через haben', 'Німецькою голод і спрагу «мають»: Ich habe Hunger, а не «я голодний».'],
					en: ['Hunger and thirst with haben', 'In German you "have" hunger and thirst: Ich habe Hunger, not "I am hungry".'],
					pl: ['Głód i pragnienie z haben', 'Po niemiecku głód i pragnienie się „ma”: Ich habe Hunger.'],
					es: ['Hambre y sed con haben', 'En alemán el hambre y la sed se "tienen", como en español: Ich habe Hunger.'],
					fr: ['Faim et soif avec haben', 'En allemand on « a » faim et soif, comme en français : Ich habe Hunger.'],
					tr: ['Açlık ve susuzluk haben ile', 'Almancada açlık ve susuzluk "sahip olunan" şeydir: Ich habe Hunger, yani "açlığım var".'],
					ro: ['Foamea și setea cu haben', 'În germană foamea și setea se „au”: Ich habe Hunger, adică „mi-e foame”.'],
					uz: ['Ochlik va chanqoq haben bilan', "Nemischa ochlik va chanqoq \"bor\" bo'ladi: Ich habe Hunger, ya'ni \"qornim och\"."],
					hi: ['भूख और प्यास haben से', 'जर्मन में भूख और प्यास "होती" है: Ich habe Hunger, यानी "मुझे भूख है"।'],
					ar: ['الجوع والعطش مع haben', 'بالألمانية "نملك" الجوع والعطش: Ich habe Hunger، أي "أنا جائع".']
				},
				examples: [
					ex('Ich habe Hunger.', { ru: 'Я голоден.', uk: 'Я голодний.', en: 'I’m hungry.', pl: 'Jestem głodny.', es: 'Tengo hambre.', fr: 'J’ai faim.', tr: 'Acıktım.', ro: 'Mi-e foame.', uz: 'Qornim och.', hi: 'मुझे भूख लगी है।', ar: 'أنا جائع.' }),
					ex('Hast du Durst?', { ru: 'Хочешь пить?', uk: 'Хочеш пити?', en: 'Are you thirsty?', pl: 'Chce ci się pić?', es: '¿Tienes sed?', fr: 'Tu as soif ?', tr: 'Susadın mı?', ro: 'Ți-e sete?', uz: 'Chanqadingmi?', hi: 'क्या तुम्हें प्यास लगी है?', ar: 'هل أنت عطشان؟' }),
					ex('Wir haben Zeit.', { ru: 'У нас есть время.', uk: 'У нас є час.', en: 'We have time.', pl: 'Mamy czas.', es: 'Tenemos tiempo.', fr: 'Nous avons le temps.', tr: 'Vaktimiz var.', ro: 'Avem timp.', uz: 'Vaqtimiz bor.', hi: 'हमारे पास समय है।', ar: 'عندنا وقت.' })
				]
			}
		]
	},

	'meet-meadow-five': {
		title: {
			ru: 'Окончания глагола: ich -e, du -st, er -t', uk: 'Закінчення дієслова: ich -e, du -st, er -t', en: 'Verb endings: ich -e, du -st, er -t',
			pl: 'Końcówki czasownika: ich -e, du -st, er -t', es: 'Terminaciones del verbo: ich -e, du -st, er -t', fr: 'Terminaisons du verbe : ich -e, du -st, er -t',
			tr: 'Fiil ekleri: ich -e, du -st, er -t', ro: 'Terminațiile verbului: ich -e, du -st, er -t', uz: "Fe'l qo'shimchalari: ich -e, du -st, er -t",
			hi: 'क्रिया के अंत: ich -e, du -st, er -t', ar: 'نهايات الفعل: ich -e وdu -st وer -t'
		},
		points: [
			{
				t: {
					ru: ['Основа и окончание', 'Убираем -en: wohnen → wohn. Добавляем окончание: ich wohne, du wohnst, er/sie/es wohnt. Так же kommen, lernen, trinken.'],
					uk: ['Основа і закінчення', 'Прибираємо -en: wohnen → wohn. Додаємо закінчення: ich wohne, du wohnst, er/sie/es wohnt. Так само kommen, lernen, trinken.'],
					en: ['Stem and ending', 'Drop -en: wohnen → wohn. Add the ending: ich wohne, du wohnst, er/sie/es wohnt. Same with kommen, lernen, trinken.'],
					pl: ['Temat i końcówka', 'Usuwamy -en: wohnen → wohn. Dodajemy końcówkę: ich wohne, du wohnst, er/sie/es wohnt. Tak samo kommen, lernen, trinken.'],
					es: ['Raíz y terminación', 'Quitamos -en: wohnen → wohn. Añadimos la terminación: ich wohne, du wohnst, er/sie/es wohnt. Igual con kommen, lernen, trinken.'],
					fr: ['Radical et terminaison', 'On enlève -en : wohnen → wohn. On ajoute la terminaison : ich wohne, du wohnst, er/sie/es wohnt. Pareil pour kommen, lernen, trinken.'],
					tr: ['Kök ve ek', '-en atılır: wohnen → wohn. Ek eklenir: ich wohne, du wohnst, er/sie/es wohnt. kommen, lernen, trinken de böyle.'],
					ro: ['Rădăcina și terminația', 'Scoatem -en: wohnen → wohn. Adăugăm terminația: ich wohne, du wohnst, er/sie/es wohnt. La fel kommen, lernen, trinken.'],
					uz: ["O'zak va qo'shimcha", "-en olib tashlanadi: wohnen → wohn. Qo'shimcha qo'shiladi: ich wohne, du wohnst, er/sie/es wohnt. kommen, lernen, trinken ham shunday."],
					hi: ['मूल और अंत', '-en हटाओ: wohnen → wohn। अंत जोड़ो: ich wohne, du wohnst, er/sie/es wohnt। kommen, lernen, trinken भी ऐसे ही।'],
					ar: ['الجذر والنهاية', 'نحذف -en: wohnen → wohn. ونضيف النهاية: ich wohne، du wohnst، er/sie/es wohnt. وكذلك kommen وlernen وtrinken.']
				},
				examples: [
					ex('ich wohne, du wohnst, er wohnt', { ru: 'я живу, ты живёшь, он живёт', uk: 'я живу, ти живеш, він живе', en: 'I live, you live, he lives', pl: 'mieszkam, mieszkasz, on mieszka', es: 'vivo, vives, él vive', fr: 'j’habite, tu habites, il habite', tr: 'oturuyorum, oturuyorsun, oturuyor', ro: 'locuiesc, locuiești, el locuiește', uz: 'yashayman, yashaysan, yashaydi', hi: 'मैं रहता हूँ, तुम रहते हो, वह रहता है', ar: 'أسكن، تسكن، يسكن' }),
					ex('Sie lernt Deutsch.', { ru: 'Она учит немецкий.', uk: 'Вона вчить німецьку.', en: 'She is learning German.', pl: 'Ona uczy się niemieckiego.', es: 'Ella aprende alemán.', fr: 'Elle apprend l’allemand.', tr: 'O Almanca öğreniyor.', ro: 'Ea învață germana.', uz: "U nemis tilini o'rganmoqda.", hi: 'वह जर्मन सीख रही है।', ar: 'هي تتعلم الألمانية.' })
				]
			},
			{
				t: {
					ru: ['Глагол на втором месте', 'В обычном предложении и в вопросе с вопросительным словом глагол стоит на втором месте.'],
					uk: ['Дієслово на другому місці', 'У звичайному реченні та в питанні з питальним словом дієслово стоїть на другому місці.'],
					en: ['The verb is in second place', 'In a normal sentence and in a question with a question word, the verb is in second place.'],
					pl: ['Czasownik na drugim miejscu', 'W zwykłym zdaniu i w pytaniu ze słowem pytającym czasownik stoi na drugim miejscu.'],
					es: ['El verbo en segundo lugar', 'En una frase normal y en una pregunta con palabra interrogativa, el verbo va en segundo lugar.'],
					fr: ['Le verbe en deuxième position', 'Dans une phrase normale et dans une question avec mot interrogatif, le verbe est en deuxième position.'],
					tr: ['Fiil ikinci sırada', 'Normal cümlede ve soru kelimeli soruda fiil ikinci sıradadır.'],
					ro: ['Verbul pe locul doi', 'Într-o propoziție obișnuită și într-o întrebare cu cuvânt interogativ, verbul stă pe locul doi.'],
					uz: ["Fe'l ikkinchi o'rinda", "Oddiy gapda va savol so'zli savolda fe'l ikkinchi o'rinda turadi."],
					hi: ['क्रिया दूसरे स्थान पर', 'सामान्य वाक्य में और प्रश्नवाचक शब्द वाले सवाल में क्रिया दूसरे स्थान पर होती है।'],
					ar: ['الفعل في المكان الثاني', 'في الجملة العادية وفي السؤال بأداة استفهام يأتي الفعل في المكان الثاني.']
				},
				examples: [
					ex('Ich lerne Deutsch in Wien.', { ru: 'Я учу немецкий в Вене.', uk: 'Я вчу німецьку у Відні.', en: 'I learn German in Vienna.', pl: 'Uczę się niemieckiego w Wiedniu.', es: 'Aprendo alemán en Viena.', fr: 'J’apprends l’allemand à Vienne.', tr: 'Viyana’da Almanca öğreniyorum.', ro: 'Învăț germana la Viena.', uz: "Men Venada nemis tilini o'rganaman.", hi: 'मैं वियना में जर्मन सीखता हूँ।', ar: 'أتعلم الألمانية في فيينا.' }),
					ex('Was trinkst du?', { ru: 'Что ты пьёшь?', uk: 'Що ти п’єш?', en: 'What are you drinking?', pl: 'Co pijesz?', es: '¿Qué bebes?', fr: 'Qu’est-ce que tu bois ?', tr: 'Ne içiyorsun?', ro: 'Ce bei?', uz: 'Nima ichyapsan?', hi: 'तुम क्या पी रहे हो?', ar: 'ماذا تشرب؟' })
				]
			}
		]
	},

	'meet-meadow-six': {
		title: {
			ru: 'wir -en, ihr -t и особые глаголы', uk: 'wir -en, ihr -t і особливі дієслова', en: 'wir -en, ihr -t and special verbs',
			pl: 'wir -en, ihr -t i czasowniki szczególne', es: 'wir -en, ihr -t y verbos especiales', fr: 'wir -en, ihr -t et verbes particuliers',
			tr: 'wir -en, ihr -t ve özel fiiller', ro: 'wir -en, ihr -t și verbe speciale', uz: "wir -en, ihr -t va alohida fe'llar",
			hi: 'wir -en, ihr -t और खास क्रियाएँ', ar: 'wir -en وihr -t وأفعال خاصة'
		},
		points: [
			{
				t: {
					ru: ['Множественное число', 'wir wohnen, ihr wohnt, sie/Sie wohnen. У wir и sie окончание как в словаре: -en.'],
					uk: ['Множина', 'wir wohnen, ihr wohnt, sie/Sie wohnen. У wir і sie закінчення як у словнику: -en.'],
					en: ['Plural', 'wir wohnen, ihr wohnt, sie/Sie wohnen. wir and sie take the dictionary ending -en.'],
					pl: ['Liczba mnoga', 'wir wohnen, ihr wohnt, sie/Sie wohnen. wir i sie mają końcówkę jak w słowniku: -en.'],
					es: ['Plural', 'wir wohnen, ihr wohnt, sie/Sie wohnen. wir y sie llevan la terminación del diccionario: -en.'],
					fr: ['Pluriel', 'wir wohnen, ihr wohnt, sie/Sie wohnen. wir et sie prennent la terminaison du dictionnaire : -en.'],
					tr: ['Çoğul', 'wir wohnen, ihr wohnt, sie/Sie wohnen. wir ve sie sözlükteki gibi -en alır.'],
					ro: ['Pluralul', 'wir wohnen, ihr wohnt, sie/Sie wohnen. wir și sie au terminația din dicționar: -en.'],
					uz: ["Ko'plik", "wir wohnen, ihr wohnt, sie/Sie wohnen. wir va sie lug'atdagi kabi -en oladi."],
					hi: ['बहुवचन', 'wir wohnen, ihr wohnt, sie/Sie wohnen। wir और sie में शब्दकोश वाला अंत -en।'],
					ar: ['الجمع', 'wir wohnen، ihr wohnt، sie/Sie wohnen. مع wir وsie تكون النهاية كما في القاموس: -en.']
				},
				examples: [
					ex('Die Kinder spielen Fußball.', { ru: 'Дети играют в футбол.', uk: 'Діти грають у футбол.', en: 'The children play football.', pl: 'Dzieci grają w piłkę nożną.', es: 'Los niños juegan al fútbol.', fr: 'Les enfants jouent au foot.', tr: 'Çocuklar futbol oynuyor.', ro: 'Copiii joacă fotbal.', uz: "Bolalar futbol o'ynayapti.", hi: 'बच्चे फ़ुटबॉल खेलते हैं।', ar: 'الأطفال يلعبون كرة القدم.' })
				]
			},
			{
				t: {
					ru: ['Основа на -t: вставляем -e-', 'Чтобы было легче произнести, после t добавляем e: du arbeitest, er arbeitet, ihr arbeitet.'],
					uk: ['Основа на -t: вставляємо -e-', 'Щоб легше вимовити, після t додаємо e: du arbeitest, er arbeitet, ihr arbeitet.'],
					en: ['Stem ending in -t: add -e-', 'To make it easier to say, add e after t: du arbeitest, er arbeitet, ihr arbeitet.'],
					pl: ['Temat na -t: wstawiamy -e-', 'Żeby łatwiej wymówić, po t dodajemy e: du arbeitest, er arbeitet, ihr arbeitet.'],
					es: ['Raíz en -t: se añade -e-', 'Para pronunciar mejor, después de t se añade e: du arbeitest, er arbeitet, ihr arbeitet.'],
					fr: ['Radical en -t : on ajoute -e-', 'Pour mieux prononcer, on ajoute e après t : du arbeitest, er arbeitet, ihr arbeitet.'],
					tr: ['-t ile biten kök: -e- eklenir', 'Söylemesi kolay olsun diye t’den sonra e eklenir: du arbeitest, er arbeitet, ihr arbeitet.'],
					ro: ['Rădăcină în -t: adăugăm -e-', 'Ca să se pronunțe mai ușor, după t adăugăm e: du arbeitest, er arbeitet, ihr arbeitet.'],
					uz: ["-t bilan tugagan o'zak: -e- qo'shiladi", "Aytish oson bo'lishi uchun t dan keyin e qo'shiladi: du arbeitest, er arbeitet, ihr arbeitet."],
					hi: ['-t पर खत्म मूल: -e- जोड़ो', 'बोलना आसान हो, इसलिए t के बाद e जोड़ते हैं: du arbeitest, er arbeitet, ihr arbeitet।'],
					ar: ['جذر ينتهي بـ -t: نضيف -e-', 'لتسهيل النطق نضيف e بعد t: du arbeitest، er arbeitet، ihr arbeitet.']
				},
				examples: [
					ex('Arbeitest du im Café?', { ru: 'Ты работаешь в кафе?', uk: 'Ти працюєш у кафе?', en: 'Do you work at the café?', pl: 'Pracujesz w kawiarni?', es: '¿Trabajas en el café?', fr: 'Tu travailles au café ?', tr: 'Kafede mi çalışıyorsun?', ro: 'Lucrezi la cafenea?', uz: 'Kafeda ishlaysanmi?', hi: 'क्या तुम कैफ़े में काम करते हो?', ar: 'هل تعمل في المقهى؟' }),
					ex('Er arbeitet als Kellner.', { ru: 'Он работает официантом.', uk: 'Він працює офіціантом.', en: 'He works as a waiter.', pl: 'On pracuje jako kelner.', es: 'Él trabaja de camarero.', fr: 'Il travaille comme serveur.', tr: 'Garson olarak çalışıyor.', ro: 'El lucrează ca ospătar.', uz: 'U ofitsiant bo‘lib ishlaydi.', hi: 'वह वेटर का काम करता है।', ar: 'يعمل نادلاً.' })
				]
			},
			{
				t: {
					ru: ['Основа на -s, -ß, -z', 'У du добавляем только -t, без s: du heißt, du tanzt.'],
					uk: ['Основа на -s, -ß, -z', 'У du додаємо лише -t, без s: du heißt, du tanzt.'],
					en: ['Stem ending in -s, -ß, -z', 'With du add only -t, no s: du heißt, du tanzt.'],
					pl: ['Temat na -s, -ß, -z', 'Przy du dodajemy tylko -t, bez s: du heißt, du tanzt.'],
					es: ['Raíz en -s, -ß, -z', 'Con du se añade solo -t, sin s: du heißt, du tanzt.'],
					fr: ['Radical en -s, -ß, -z', 'Avec du on ajoute seulement -t, sans s : du heißt, du tanzt.'],
					tr: ['-s, -ß, -z ile biten kök', 'du ile sadece -t eklenir, s yok: du heißt, du tanzt.'],
					ro: ['Rădăcină în -s, -ß, -z', 'La du adăugăm doar -t, fără s: du heißt, du tanzt.'],
					uz: ["-s, -ß, -z bilan tugagan o'zak", "du da faqat -t qo'shiladi, s siz: du heißt, du tanzt."],
					hi: ['-s, -ß, -z पर खत्म मूल', 'du के साथ सिर्फ़ -t जोड़ते हैं, s नहीं: du heißt, du tanzt।'],
					ar: ['جذر ينتهي بـ -s أو -ß أو -z', 'مع du نضيف -t فقط بدون s: du heißt، du tanzt.']
				},
				examples: [
					ex('Heißt du Lena?', { ru: 'Тебя зовут Лена?', uk: 'Тебе звати Лена?', en: 'Is your name Lena?', pl: 'Masz na imię Lena?', es: '¿Te llamas Lena?', fr: 'Tu t’appelles Lena ?', tr: 'Adın Lena mı?', ro: 'Te cheamă Lena?', uz: 'Isming Lenami?', hi: 'क्या तुम्हारा नाम लेना है?', ar: 'هل اسمك لينا؟' }),
					ex('Du tanzt gut!', { ru: 'Ты хорошо танцуешь!', uk: 'Ти добре танцюєш!', en: 'You dance well!', pl: 'Dobrze tańczysz!', es: '¡Bailas bien!', fr: 'Tu danses bien !', tr: 'İyi dans ediyorsun!', ro: 'Dansezi bine!', uz: 'Sen yaxshi raqs tushasan!', hi: 'तुम अच्छा नाचते हो!', ar: 'أنت ترقص جيداً!' })
				]
			}
		]
	},

	'meet-meadow-seven': {
		title: {
			ru: 'Практика: новый сосед', uk: 'Практика: новий сусід', en: 'Practice: the new neighbour',
			pl: 'Praktyka: nowy sąsiad', es: 'Práctica: el vecino nuevo', fr: 'Pratique : le nouveau voisin',
			tr: 'Pratik: yeni komşu', ro: 'Practică: vecinul nou', uz: "Mashq: yangi qo'shni",
			hi: 'अभ्यास: नया पड़ोसी', ar: 'تدريب: الجار الجديد'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Рассказываешь о себе всем, что уже знаешь. gern значит «с удовольствием» и стоит после глагола, auch значит «тоже».'],
					uk: ['Нових правил немає', 'Розповідаєш про себе всім, що вже знаєш. gern означає «із задоволенням» і стоїть після дієслова, auch означає «теж».'],
					en: ['No new rules', 'Talk about yourself with what you already know. gern means "gladly, like to" and comes after the verb, auch means "too".'],
					pl: ['Bez nowych reguł', 'Opowiadasz o sobie tym, co już znasz. gern znaczy „chętnie” i stoi po czasowniku, auch znaczy „też”.'],
					es: ['Sin reglas nuevas', 'Hablas de ti con lo que ya sabes. gern significa "con gusto" y va después del verbo, auch significa "también".'],
					fr: ['Pas de nouvelle règle', 'Tu parles de toi avec ce que tu sais déjà. gern veut dire « volontiers, aimer faire » et se met après le verbe, auch veut dire « aussi ».'],
					tr: ['Yeni kural yok', 'Bildiklerinle kendinden bahsedersin. gern "severek" demektir ve fiilden sonra gelir, auch "de, da" demektir.'],
					ro: ['Fără reguli noi', 'Vorbești despre tine cu ce știi deja. gern înseamnă „cu plăcere” și vine după verb, auch înseamnă „și, de asemenea”.'],
					uz: ["Yangi qoida yo'q", "Bilganlaring bilan o'zing haqingda gapirasan. gern \"jon deb\" degani va fe'ldan keyin turadi, auch \"ham\" degani."],
					hi: ['कोई नया नियम नहीं', 'जो पहले से जानते हो, उससे अपने बारे में बताओ। gern मतलब "खुशी से, पसंद से" और यह क्रिया के बाद आता है, auch मतलब "भी"।'],
					ar: ['لا قواعد جديدة', 'تتحدث عن نفسك بما تعرفه. gern تعني "بكل سرور، أحب أن" وتأتي بعد الفعل، وauch تعني "أيضاً".']
				},
				examples: [
					ex('Ich spiele gern Fußball.', { ru: 'Я люблю играть в футбол.', uk: 'Я люблю грати у футбол.', en: 'I like playing football.', pl: 'Lubię grać w piłkę nożną.', es: 'Me gusta jugar al fútbol.', fr: 'J’aime jouer au foot.', tr: 'Futbol oynamayı severim.', ro: 'Îmi place să joc fotbal.', uz: "Men futbol o'ynashni yaxshi ko'raman.", hi: 'मुझे फ़ुटबॉल खेलना पसंद है।', ar: 'أحب لعب كرة القدم.' }),
					ex('Wir haben auch einen Hund.', { ru: 'У нас тоже есть собака.', uk: 'У нас теж є собака.', en: 'We have a dog too.', pl: 'My też mamy psa.', es: 'Nosotros también tenemos un perro.', fr: 'Nous avons aussi un chien.', tr: 'Bizim de bir köpeğimiz var.', ro: 'Și noi avem un câine.', uz: 'Bizda ham it bor.', hi: 'हमारे पास भी एक कुत्ता है।', ar: 'عندنا كلب أيضاً.' })
				]
			}
		]
	},

	'meet-meadow-eight': {
		title: {
			ru: 'Практика: сколько тебе лет?', uk: 'Практика: скільки тобі років?', en: 'Practice: how old are you?',
			pl: 'Praktyka: ile masz lat?', es: 'Práctica: ¿cuántos años tienes?', fr: 'Pratique : quel âge as-tu ?',
			tr: 'Pratik: kaç yaşındasın?', ro: 'Practică: câți ani ai?', uz: 'Mashq: necha yoshdasan?',
			hi: 'अभ्यास: तुम्हारी उम्र क्या है?', ar: 'تدريب: كم عمرك؟'
		},
		points: [
			{
				t: {
					ru: ['Возраст через sein', 'Возраст говорят глаголом sein: Ich bin 25 Jahre alt, дословно «я 25 лет старый».'],
					uk: ['Вік через sein', 'Вік кажуть дієсловом sein: Ich bin 25 Jahre alt, дослівно «я 25 років старий».'],
					en: ['Age with sein', 'Age is said with sein, just like in English: Ich bin 25 Jahre alt.'],
					pl: ['Wiek z sein', 'Wiek podajemy z czasownikiem sein: Ich bin 25 Jahre alt, dosłownie „jestem 25 lat stary”.'],
					es: ['La edad con sein', 'La edad se dice con sein, no con "tener": Ich bin 25 Jahre alt, literalmente "soy 25 años viejo".'],
					fr: ['L’âge avec sein', 'L’âge se dit avec sein, pas avec « avoir » : Ich bin 25 Jahre alt, mot à mot « je suis vieux de 25 ans ».'],
					tr: ['Yaş sein ile', 'Yaş sein fiiliyle söylenir: Ich bin 25 Jahre alt, yani "25 yaşındayım".'],
					ro: ['Vârsta cu sein', 'Vârsta se spune cu sein, nu cu „a avea”: Ich bin 25 Jahre alt, cuvânt cu cuvânt „sunt bătrân de 25 de ani”.'],
					uz: ['Yosh sein bilan', "Yosh sein fe'li bilan aytiladi: Ich bin 25 Jahre alt, ya'ni \"men 25 yoshdaman\"."],
					hi: ['उम्र sein से', 'उम्र sein क्रिया से बताते हैं: Ich bin 25 Jahre alt, यानी "मैं 25 साल का हूँ"।'],
					ar: ['العمر مع sein', 'نقول العمر بالفعل sein: Ich bin 25 Jahre alt، أي "عمري 25 سنة".']
				},
				examples: [
					ex('Wie alt bist du?', { ru: 'Сколько тебе лет?', uk: 'Скільки тобі років?', en: 'How old are you?', pl: 'Ile masz lat?', es: '¿Cuántos años tienes?', fr: 'Quel âge as-tu ?', tr: 'Kaç yaşındasın?', ro: 'Câți ani ai?', uz: 'Necha yoshdasan?', hi: 'तुम्हारी उम्र क्या है?', ar: 'كم عمرك؟' }),
					ex('Ich bin zwanzig Jahre alt.', { ru: 'Мне двадцать лет.', uk: 'Мені двадцять років.', en: 'I am twenty years old.', pl: 'Mam dwadzieścia lat.', es: 'Tengo veinte años.', fr: 'J’ai vingt ans.', tr: 'Yirmi yaşındayım.', ro: 'Am douăzeci de ani.', uz: 'Men yigirma yoshdaman.', hi: 'मैं बीस साल का हूँ।', ar: 'عمري عشرون سنة.' })
				]
			}
		]
	},

	'meet-meadow-nine': {
		title: {
			ru: 'Повторение: формы глаголов', uk: 'Повторення: форми дієслів', en: 'Review: verb forms',
			pl: 'Powtórka: formy czasowników', es: 'Repaso: formas de los verbos', fr: 'Révision : formes des verbes',
			tr: 'Tekrar: fiil biçimleri', ro: 'Recapitulare: formele verbelor', uz: "Takrorlash: fe'l shakllari",
			hi: 'दोहराव: क्रिया के रूप', ar: 'مراجعة: صيغ الأفعال'
		},
		points: [
			{
				t: {
					ru: ['sein (быть)', 'Неправильный глагол: формы нужно запомнить.'],
					uk: ['sein (бути)', 'Неправильне дієслово: форми треба запам’ятати.'],
					en: ['sein (to be)', 'An irregular verb: you need to remember the forms.'],
					pl: ['sein (być)', 'Czasownik nieregularny: formy trzeba zapamiętać.'],
					es: ['sein (ser, estar)', 'Verbo irregular: hay que memorizar las formas.'],
					fr: ['sein (être)', 'Verbe irrégulier : il faut retenir les formes.'],
					tr: ['sein (olmak)', 'Düzensiz fiil: biçimleri ezberlemek gerekir.'],
					ro: ['sein (a fi)', 'Verb neregulat: formele trebuie memorate.'],
					uz: ["sein (bo'lmoq)", "Noto'g'ri fe'l: shakllarini yodlash kerak."],
					hi: ['sein (होना)', 'अनियमित क्रिया: रूप याद करने होंगे।'],
					ar: ['sein (يكون)', 'فعل شاذ: يجب حفظ صيغه.']
				},
				examples: [
					ex('ich bin, du bist, er ist', { ru: 'я, ты, он (есть)', uk: 'я, ти, він (є)', en: 'I am, you are, he is', pl: 'jestem, jesteś, on jest', es: 'yo soy, tú eres, él es', fr: 'je suis, tu es, il est', tr: 'ben, sen, o (dır)', ro: 'eu sunt, tu ești, el este', uz: 'men, sen, u (-dir)', hi: 'मैं हूँ, तुम हो, वह है', ar: 'أنا، أنت، هو' }),
					ex('wir sind, ihr seid, sie sind', { ru: 'мы, вы, они (есть)', uk: 'ми, ви, вони (є)', en: 'we are, you are, they are', pl: 'jesteśmy, jesteście, oni są', es: 'somos, sois, son', fr: 'nous sommes, vous êtes, ils sont', tr: 'biz, siz, onlar (dır)', ro: 'suntem, sunteți, ei sunt', uz: 'biz, sizlar, ular (-dir)', hi: 'हम हैं, तुम सब हो, वे हैं', ar: 'نحن، أنتم، هم' })
				]
			},
			{
				t: {
					ru: ['haben (иметь)', 'Тоже неправильный: у du и er пропадает буква b.'],
					uk: ['haben (мати)', 'Теж неправильне: у du і er зникає літера b.'],
					en: ['haben (to have)', 'Also irregular: with du and er the b disappears.'],
					pl: ['haben (mieć)', 'Też nieregularny: przy du i er znika litera b.'],
					es: ['haben (tener)', 'También irregular: con du y er desaparece la b.'],
					fr: ['haben (avoir)', 'Irrégulier aussi : avec du et er, le b disparaît.'],
					tr: ['haben (sahip olmak)', 'Bu da düzensiz: du ve er ile b düşer.'],
					ro: ['haben (a avea)', 'Tot neregulat: la du și er dispare litera b.'],
					uz: ["haben (ega bo'lmoq)", "Bu ham noto'g'ri: du va er da b tushib qoladi."],
					hi: ['haben (रखना, होना)', 'यह भी अनियमित है: du और er के साथ b हट जाता है।'],
					ar: ['haben (يملك)', 'شاذ أيضاً: مع du وer يختفي حرف b.']
				},
				examples: [
					ex('ich habe, du hast, er hat', { ru: 'у меня, у тебя, у него есть', uk: 'у мене, у тебе, у нього є', en: 'I have, you have, he has', pl: 'mam, masz, on ma', es: 'tengo, tienes, él tiene', fr: 'j’ai, tu as, il a', tr: 'benim, senin, onun var', ro: 'am, ai, el are', uz: 'menda, senda, unda bor', hi: 'मेरे, तुम्हारे, उसके पास है', ar: 'عندي، عندك، عنده' }),
					ex('wir haben, ihr habt, sie haben', { ru: 'у нас, у вас, у них есть', uk: 'у нас, у вас, у них є', en: 'we have, you have, they have', pl: 'mamy, macie, oni mają', es: 'tenemos, tenéis, tienen', fr: 'nous avons, vous avez, ils ont', tr: 'bizim, sizin, onların var', ro: 'avem, aveți, ei au', uz: 'bizda, sizlarda, ularda bor', hi: 'हमारे, तुम सबके, उनके पास है', ar: 'عندنا، عندكم، عندهم' })
				]
			},
			{
				t: {
					ru: ['Все остальные глаголы', 'Окончания всегда одни и те же: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					uk: ['Усі інші дієслова', 'Закінчення завжди однакові: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					en: ['All other verbs', 'The endings are always the same: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					pl: ['Wszystkie inne czasowniki', 'Końcówki są zawsze te same: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					es: ['Todos los demás verbos', 'Las terminaciones son siempre las mismas: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					fr: ['Tous les autres verbes', 'Les terminaisons sont toujours les mêmes : ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					tr: ['Diğer bütün fiiller', 'Ekler hep aynıdır: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					ro: ['Toate celelalte verbe', 'Terminațiile sunt mereu aceleași: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.'],
					uz: ["Qolgan barcha fe'llar", "Qo'shimchalar doim bir xil: ich -e, du -st, er -t, wir -en, ihr -t, sie -en."],
					hi: ['बाकी सभी क्रियाएँ', 'अंत हमेशा एक जैसे होते हैं: ich -e, du -st, er -t, wir -en, ihr -t, sie -en।'],
					ar: ['جميع الأفعال الأخرى', 'النهايات دائماً واحدة: ich -e، du -st، er -t، wir -en، ihr -t، sie -en.']
				},
				examples: [
					ex('ich lerne, du lernst, er lernt', { ru: 'я учу, ты учишь, он учит', uk: 'я вчу, ти вчиш, він вчить', en: 'I learn, you learn, he learns', pl: 'uczę się, uczysz się, on się uczy', es: 'aprendo, aprendes, él aprende', fr: 'j’apprends, tu apprends, il apprend', tr: 'öğreniyorum, öğreniyorsun, öğreniyor', ro: 'învăț, înveți, el învață', uz: "o'rganaman, o'rganasan, o'rganadi", hi: 'मैं सीखता हूँ, तुम सीखते हो, वह सीखता है', ar: 'أتعلم، تتعلم، يتعلم' }),
					ex('wir lernen, ihr lernt, sie lernen', { ru: 'мы учим, вы учите, они учат', uk: 'ми вчимо, ви вчите, вони вчать', en: 'we learn, you learn, they learn', pl: 'uczymy się, uczycie się, oni się uczą', es: 'aprendemos, aprendéis, aprenden', fr: 'nous apprenons, vous apprenez, ils apprennent', tr: 'öğreniyoruz, öğreniyorsunuz, öğreniyorlar', ro: 'învățăm, învățați, ei învață', uz: "o'rganamiz, o'rganasizlar, o'rganishadi", hi: 'हम सीखते हैं, तुम सब सीखते हो, वे सीखते हैं', ar: 'نتعلم، تتعلمون، يتعلمون' })
				]
			}
		]
	},

	'meet-meadow-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Местоимение по роду', 'Слово с der заменяем на er, с die на sie, с das на es.'],
					uk: ['Займенник за родом', 'Слово з der замінюємо на er, з die на sie, з das на es.'],
					en: ['Pronoun by gender', 'A der word becomes er, a die word becomes sie, a das word becomes es.'],
					pl: ['Zaimek według rodzaju', 'Słowo z der zastępujemy er, z die sie, z das es.'],
					es: ['Pronombre según el género', 'Una palabra con der se cambia por er, con die por sie, con das por es.'],
					fr: ['Pronom selon le genre', 'Un mot en der devient er, en die devient sie, en das devient es.'],
					tr: ['Cinsiyete göre zamir', 'der’li kelime er, die’li sie, das’lı es olur.'],
					ro: ['Pronumele după gen', 'Un cuvânt cu der devine er, cu die devine sie, cu das devine es.'],
					uz: ['Rodga qarab olmosh', "der li so'z er, die li sie, das li es bo'ladi."],
					hi: ['लिंग के अनुसार सर्वनाम', 'der वाला शब्द er, die वाला sie, das वाला es बनता है।'],
					ar: ['الضمير حسب الجنس', 'الكلمة مع der تصبح er، ومع die تصبح sie، ومع das تصبح es.']
				},
				examples: [
					ex('Die Katze ist alt. Sie ist nett.', { ru: 'Кошка старая. Она милая.', uk: 'Кішка стара. Вона мила.', en: 'The cat is old. It is nice.', pl: 'Kot jest stary. Jest miły.', es: 'La gata es vieja. Es simpática.', fr: 'Le chat est vieux. Il est gentil.', tr: 'Kedi yaşlı. Çok tatlı.', ro: 'Pisica e bătrână. E drăguță.', uz: 'Mushuk qari. U yoqimli.', hi: 'बिल्ली बूढ़ी है। वह प्यारी है।', ar: 'القطة عجوز. إنها لطيفة.' })
				]
			},
			{
				t: {
					ru: ['sein и haben', 'Два главных глагола. Их формы не по правилу, их нужно помнить.'],
					uk: ['sein і haben', 'Два головні дієслова. Їхні форми не за правилом, їх треба пам’ятати.'],
					en: ['sein and haben', 'The two main verbs. Their forms don’t follow the rule, you need to remember them.'],
					pl: ['sein i haben', 'Dwa najważniejsze czasowniki. Ich formy nie są regularne, trzeba je pamiętać.'],
					es: ['sein y haben', 'Los dos verbos principales. Sus formas no siguen la regla, hay que recordarlas.'],
					fr: ['sein et haben', 'Les deux verbes principaux. Leurs formes ne suivent pas la règle, il faut les retenir.'],
					tr: ['sein ve haben', 'İki temel fiil. Biçimleri kurala uymaz, ezberlemek gerekir.'],
					ro: ['sein și haben', 'Cele două verbe principale. Formele lor nu urmează regula, trebuie ținute minte.'],
					uz: ['sein va haben', "Ikki asosiy fe'l. Shakllari qoidaga bo'ysunmaydi, ularni yodlash kerak."],
					hi: ['sein और haben', 'दो मुख्य क्रियाएँ। इनके रूप नियम से नहीं बनते, इन्हें याद रखना होता है।'],
					ar: ['sein وhaben', 'الفعلان الأساسيان. صيغهما لا تتبع القاعدة، ويجب حفظها.']
				},
				examples: [
					ex('Bist du krank?', { ru: 'Ты болен?', uk: 'Ти хворий?', en: 'Are you ill?', pl: 'Jesteś chory?', es: '¿Estás enfermo?', fr: 'Tu es malade ?', tr: 'Hasta mısın?', ro: 'Ești bolnav?', uz: 'Kasalmisan?', hi: 'क्या तुम बीमार हो?', ar: 'هل أنت مريض؟' }),
					ex('Wir haben eine Katze.', { ru: 'У нас есть кошка.', uk: 'У нас є кішка.', en: 'We have a cat.', pl: 'Mamy kota.', es: 'Tenemos una gata.', fr: 'Nous avons un chat.', tr: 'Bir kedimiz var.', ro: 'Avem o pisică.', uz: 'Bizda mushuk bor.', hi: 'हमारे पास एक बिल्ली है।', ar: 'عندنا قطة.' })
				]
			},
			{
				t: {
					ru: ['Особые глаголы', 'Основа на -t получает лишнее e: du arbeitest. Основа на -ß у du без s: du heißt.'],
					uk: ['Особливі дієслова', 'Основа на -t отримує зайве e: du arbeitest. Основа на -ß у du без s: du heißt.'],
					en: ['Special verbs', 'A stem ending in -t gets an extra e: du arbeitest. A stem ending in -ß has no s with du: du heißt.'],
					pl: ['Czasowniki szczególne', 'Temat na -t dostaje dodatkowe e: du arbeitest. Temat na -ß przy du nie ma s: du heißt.'],
					es: ['Verbos especiales', 'Una raíz en -t recibe una e extra: du arbeitest. Una raíz en -ß no lleva s con du: du heißt.'],
					fr: ['Verbes particuliers', 'Un radical en -t prend un e en plus : du arbeitest. Un radical en -ß n’a pas de s avec du : du heißt.'],
					tr: ['Özel fiiller', '-t ile biten köke fazladan e gelir: du arbeitest. -ß ile biten kökte du ile s yok: du heißt.'],
					ro: ['Verbe speciale', 'O rădăcină în -t primește un e în plus: du arbeitest. O rădăcină în -ß nu are s la du: du heißt.'],
					uz: ["Alohida fe'llar", "-t bilan tugagan o'zakka qo'shimcha e keladi: du arbeitest. -ß bilan tugagan o'zakda du da s bo'lmaydi: du heißt."],
					hi: ['खास क्रियाएँ', '-t पर खत्म मूल में एक e और लगता है: du arbeitest। -ß पर खत्म मूल में du के साथ s नहीं: du heißt।'],
					ar: ['أفعال خاصة', 'الجذر المنتهي بـ -t يأخذ e زائدة: du arbeitest. والجذر المنتهي بـ -ß لا يأخذ s مع du: du heißt.']
				},
				examples: [
					ex('Arbeitest du in München?', { ru: 'Ты работаешь в Мюнхене?', uk: 'Ти працюєш у Мюнхені?', en: 'Do you work in Munich?', pl: 'Pracujesz w Monachium?', es: '¿Trabajas en Múnich?', fr: 'Tu travailles à Munich ?', tr: 'Münih’te mi çalışıyorsun?', ro: 'Lucrezi la München?', uz: 'Myunxenda ishlaysanmi?', hi: 'क्या तुम म्यूनिख में काम करते हो?', ar: 'هل تعمل في ميونخ؟' }),
					ex('Wie heißt du?', { ru: 'Как тебя зовут?', uk: 'Як тебе звати?', en: 'What’s your name?', pl: 'Jak masz na imię?', es: '¿Cómo te llamas?', fr: 'Comment tu t’appelles ?', tr: 'Adın ne?', ro: 'Cum te cheamă?', uz: 'Isming nima?', hi: 'तुम्हारा नाम क्या है?', ar: 'ما اسمك؟' })
				]
			}
		]
	}
}

module.exports = quests
