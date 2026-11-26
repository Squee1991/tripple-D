// Грамматика к заданиям земли story-valley (Präteritum, als/wenn)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const weakPoint = pt(['Слабые глаголы: -te', 'Слабкі дієслова: -te', 'Weak verbs: -te', 'Czasowniki słabe: -te', 'Verbos débiles: -te', 'Verbes faibles : -te', 'Zayıf fiiller: -te', 'Verbe slabe: -te', "Kuchsiz fe'llar: -te", 'कमज़ोर क्रियाएँ: -te', 'الأفعال الضعيفة: -te'], [
	'Основа + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. После -t и -d: -ete (arbeitete).',
	'Основа + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. Після -t і -d: -ete (arbeitete).',
	'Stem + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. After -t and -d: -ete (arbeitete).',
	'Temat + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. Po -t i -d: -ete (arbeitete).',
	'Raíz + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. Tras -t y -d: -ete (arbeitete).',
	'Radical + -te : ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. Après -t et -d : -ete (arbeitete).',
	'Kök + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. -t ve -d’den sonra: -ete (arbeitete).',
	'Rădăcină + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. După -t și -d: -ete (arbeitete).',
	"O'zak + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. -t va -d dan keyin: -ete (arbeitete).",
	'मूल + -te: ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten। -t और -d के बाद: -ete (arbeitete)।',
	'الجذر + -te: ich machte، du machtest، er machte، wir machten، ihr machtet، sie machten. وبعد -t و-d: -ete (arbeitete).'
], [ex('Früher wohnten wir in einem Dorf.', t11('Раньше мы жили в деревне.', 'Раніше ми жили в селі.', 'We used to live in a village.', 'Kiedyś mieszkaliśmy na wsi.', 'Antes vivíamos en un pueblo.', 'Avant, nous habitions dans un village.', 'Eskiden bir köyde yaşıyorduk.', 'Pe vremuri locuiam într-un sat.', 'Ilgari biz qishloqda yashardik.', 'पहले हम एक गाँव में रहते थे।', 'كنا نسكن في قرية سابقاً.'))])

const strongPoint = pt(['Сильные глаголы: новый корень', 'Сильні дієслова: новий корінь', 'Strong verbs: a new stem', 'Czasowniki mocne: nowy temat', 'Verbos fuertes: raíz nueva', 'Verbes forts : nouveau radical', 'Güçlü fiiller: yeni kök', 'Verbe tari: rădăcină nouă', "Kuchli fe'llar: yangi o'zak", 'मज़बूत क्रियाएँ: नया मूल', 'الأفعال القوية: جذر جديد'], [
	'Корень меняется, а у ich и er нет окончания: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Во множественном: wir gingen, sie kamen. Эти формы учим.',
	'Корінь змінюється, а в ich та er немає закінчення: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. У множині: wir gingen, sie kamen. Ці форми вчимо.',
	'The stem changes and ich and er have no ending: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Plural: wir gingen, sie kamen. Learn these forms.',
	'Temat się zmienia, a ich i er nie mają końcówki: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. W mnogiej: wir gingen, sie kamen. Tych form się uczymy.',
	'La raíz cambia y ich y er no tienen terminación: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Plural: wir gingen, sie kamen. Hay que aprenderlas.',
	'Le radical change et ich et er n’ont pas de terminaison : gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Pluriel : wir gingen, sie kamen. À apprendre.',
	'Kök değişir, ich ve er ek almaz: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Çoğul: wir gingen, sie kamen. Bunlar ezberlenir.',
	'Rădăcina se schimbă, iar ich și er nu au terminație: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Plural: wir gingen, sie kamen. Se învață.',
	"O'zak o'zgaradi, ich va er da qo'shimcha yo'q: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr. Ko'plik: wir gingen, sie kamen. Ularni yodlaymiz.",
	'मूल बदलता है और ich व er में कोई अंत नहीं: gehen → ging, kommen → kam, sehen → sah, fahren → fuhr। बहुवचन: wir gingen, sie kamen। इन्हें याद करो।',
	'يتغير الجذر ولا نهاية مع ich وer: gehen → ging، kommen → kam، sehen → sah، fahren → fuhr. والجمع: wir gingen، sie kamen. نحفظها.'
], [ex('Plötzlich sah er ein Licht.', t11('Вдруг он увидел свет.', 'Раптом він побачив світло.', 'Suddenly he saw a light.', 'Nagle zobaczył światło.', 'De repente vio una luz.', 'Soudain, il vit une lumière.', 'Birden bir ışık gördü.', 'Deodată a văzut o lumină.', "To'satdan u yorug'lik ko'rdi.", 'अचानक उसे एक रोशनी दिखी।', 'فجأة رأى ضوءاً.'))])

const mixedPoint = pt(['Смешанные и с приставкой', 'Змішані й з префіксом', 'Mixed verbs and prefixes', 'Mieszane i z przedrostkiem', 'Mixtos y con prefijo', 'Verbes mixtes et à préfixe', 'Karma ve ön ekli fiiller', 'Mixte și cu prefix', "Aralash va old qo'shimchali", 'मिश्रित और उपसर्ग वाली', 'المختلطة وذات السابقة'], [
	'Смешанные меняют корень и получают -te: bringen → brachte, denken → dachte, wissen → wusste. Приставка уходит в конец: stand auf, kam an.',
	'Змішані змінюють корінь і отримують -te: bringen → brachte, denken → dachte, wissen → wusste. Префікс іде в кінець: stand auf, kam an.',
	'Mixed verbs change the stem and add -te: bringen → brachte, denken → dachte, wissen → wusste. The prefix goes to the end: stand auf, kam an.',
	'Mieszane zmieniają temat i dostają -te: bringen → brachte, denken → dachte, wissen → wusste. Przedrostek idzie na koniec: stand auf, kam an.',
	'Los mixtos cambian la raíz y llevan -te: bringen → brachte, denken → dachte, wissen → wusste. El prefijo va al final: stand auf, kam an.',
	'Les mixtes changent de radical et prennent -te : bringen → brachte, denken → dachte, wissen → wusste. Le préfixe va à la fin : stand auf, kam an.',
	'Karma fiiller kök değiştirir ve -te alır: bringen → brachte, denken → dachte, wissen → wusste. Ön ek sona gider: stand auf, kam an.',
	'Mixtele își schimbă rădăcina și primesc -te: bringen → brachte, denken → dachte, wissen → wusste. Prefixul merge la final: stand auf, kam an.',
	"Aralashlar o'zakni o'zgartiradi va -te oladi: bringen → brachte, denken → dachte, wissen → wusste. Old qo'shimcha oxiriga: stand auf, kam an.",
	'मिश्रित क्रियाएँ मूल बदलती हैं और -te लेती हैं: bringen → brachte, denken → dachte, wissen → wusste। उपसर्ग अंत में: stand auf, kam an।',
	'المختلطة تغير جذرها وتأخذ -te: bringen → brachte، denken → dachte، wissen → wusste. والسابقة في الآخر: stand auf، kam an.'
], [ex('Ich stand um sechs Uhr auf.', t11('Я встал в шесть часов.', 'Я встав о шостій.', 'I got up at six.', 'Wstałem o szóstej.', 'Me levanté a las seis.', 'Je me suis levé à six heures.', 'Saat altıda kalktım.', 'M-am trezit la șase.', 'Men soat oltida turdim.', 'मैं छह बजे उठा।', 'استيقظت في السادسة.'))])

const alsWennPoint = pt(['als или wenn', 'als чи wenn', 'als or wenn', 'als czy wenn', 'als o wenn', 'als ou wenn', 'als mı, wenn mi', 'als sau wenn', 'als yoki wenn', 'als या wenn', 'als أم wenn'], [
	'als: одно событие или один период в прошлом. wenn: то, что повторялось (immer wenn). Глагол в придаточном в конце.',
	'als: одна подія або один період у минулому. wenn: те, що повторювалося (immer wenn). Дієслово в підрядному в кінці.',
	'als: one event or one period in the past. wenn: something that happened repeatedly (immer wenn). The verb goes to the end.',
	'als: jedno zdarzenie albo jeden okres w przeszłości. wenn: coś, co się powtarzało (immer wenn). Czasownik na końcu.',
	'als: un hecho o un periodo en el pasado. wenn: algo que se repetía (immer wenn). El verbo va al final.',
	'als : un seul événement ou une période du passé. wenn : ce qui se répétait (immer wenn). Le verbe va à la fin.',
	'als: geçmişte tek olay ya da dönem. wenn: tekrarlanan şey (immer wenn). Fiil sonda.',
	'als: un eveniment sau o perioadă în trecut. wenn: ceva ce se repeta (immer wenn). Verbul la final.',
	"als: o'tmishdagi bitta voqea yoki davr. wenn: takrorlangan narsa (immer wenn). Fe'l oxirida.",
	'als: भूतकाल की एक घटना या एक दौर। wenn: बार-बार होने वाली बात (immer wenn)। क्रिया अंत में।',
	'als: حدث واحد أو فترة واحدة في الماضي. wenn: ما كان يتكرر (immer wenn). والفعل في الآخر.'
], [ex('Als ich ein Kind war, wohnte ich in Hamburg.', t11('Когда я был ребёнком, я жил в Гамбурге.', 'Коли я був дитиною, я жив у Гамбурзі.', 'When I was a child, I lived in Hamburg.', 'Kiedy byłem dzieckiem, mieszkałem w Hamburgu.', 'Cuando era niño, vivía en Hamburgo.', 'Quand j’étais enfant, j’habitais à Hambourg.', 'Çocukken Hamburg’da yaşıyordum.', 'Când eram copil, locuiam în Hamburg.', 'Bolaligimda Gamburgda yashardim.', 'जब मैं बच्चा था, मैं हैम्बर्ग में रहता था।', 'عندما كنت طفلاً كنت أسكن في هامبورغ.'))])

const orderPoint = pt(['zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst, dann, am Ende', 'zuerst وdann وam Ende'], [
	'Рассказываем по порядку: zuerst, dann, danach, später, am Ende. После них глагол сразу, на втором месте.',
	'Розповідаємо по черзі: zuerst, dann, danach, später, am Ende. Після них дієслово одразу, на другому місці.',
	'Telling events in order: zuerst, dann, danach, später, am Ende. The verb comes right after, in second place.',
	'Opowiadamy po kolei: zuerst, dann, danach, später, am Ende. Po nich od razu czasownik, na drugim miejscu.',
	'Contamos en orden: zuerst, dann, danach, später, am Ende. Justo después va el verbo, en segundo lugar.',
	'On raconte dans l’ordre : zuerst, dann, danach, später, am Ende. Le verbe suit tout de suite, en deuxième position.',
	'Sırayla anlatırız: zuerst, dann, danach, später, am Ende. Ardından hemen fiil gelir, ikinci sırada.',
	'Povestim în ordine: zuerst, dann, danach, später, am Ende. Imediat după vine verbul, pe locul doi.',
	"Tartib bilan aytamiz: zuerst, dann, danach, später, am Ende. Ulardan keyin darhol fe'l, ikkinchi o'rinda.",
	'क्रम से बताते हैं: zuerst, dann, danach, später, am Ende। इनके तुरंत बाद क्रिया, दूसरे स्थान पर।',
	'نروي بالترتيب: zuerst، dann، danach، später، am Ende. ويأتي الفعل بعدها مباشرة في المكان الثاني.'
], [ex('Später fuhren wir nach Hause.', t11('Позже мы поехали домой.', 'Пізніше ми поїхали додому.', 'Later we drove home.', 'Później pojechaliśmy do domu.', 'Más tarde volvimos a casa.', 'Plus tard, nous sommes rentrés.', 'Daha sonra eve döndük.', 'Mai târziu am mers acasă.', 'Keyinroq uyga ketdik.', 'बाद में हम घर गए।', 'لاحقاً عدنا إلى البيت.'))])

const whenPoint = pt(['Präteritum или Perfekt', 'Präteritum чи Perfekt', 'Präteritum or Perfekt', 'Präteritum czy Perfekt', '¿Präteritum o Perfekt?', 'Präteritum ou Perfekt', 'Präteritum mı, Perfekt mi', 'Präteritum sau Perfekt', 'Präteritum yoki Perfekt', 'Präteritum या Perfekt', 'Präteritum أم Perfekt'], [
	'В книге и сказке Präteritum, в разговоре Perfekt. Но war, hatte и модальные (konnte, musste) и в разговоре обычно в Präteritum.',
	'У книжці й казці Präteritum, у розмові Perfekt. Але war, hatte і модальні (konnte, musste) і в розмові зазвичай у Präteritum.',
	'In books and fairy tales use Präteritum, in conversation Perfekt. But war, hatte and modals (konnte, musste) are usually Präteritum even when speaking.',
	'W książce i baśni Präteritum, w rozmowie Perfekt. Ale war, hatte i modalne (konnte, musste) także w rozmowie zwykle w Präteritum.',
	'En libros y cuentos, Präteritum; al hablar, Perfekt. Pero war, hatte y los modales (konnte, musste) suelen ir en Präteritum también al hablar.',
	'Dans les livres et les contes, Präteritum ; à l’oral, Perfekt. Mais war, hatte et les modaux (konnte, musste) restent en général au Präteritum à l’oral.',
	'Kitapta ve masalda Präteritum, konuşmada Perfekt. Ama war, hatte ve modal fiiller (konnte, musste) konuşmada da genelde Präteritum.',
	'În cărți și basme Präteritum, în conversație Perfekt. Dar war, hatte și modalele (konnte, musste) de obicei la Präteritum și în vorbire.',
	"Kitob va ertakda Präteritum, suhbatda Perfekt. Lekin war, hatte va modallar (konnte, musste) suhbatda ham odatda Präteritum da.",
	'किताब और कहानी में Präteritum, बातचीत में Perfekt। लेकिन war, hatte और मोडल (konnte, musste) बातचीत में भी आमतौर पर Präteritum में।',
	'في الكتب والحكايات Präteritum، وفي الكلام Perfekt. لكن war وhatte والأفعال المساعدة (konnte، musste) تأتي عادة بـ Präteritum حتى في الكلام.'
], [ex('Ich konnte dich nicht anrufen.', t11('Я не смог тебе позвонить.', 'Я не зміг тобі зателефонувати.', 'I couldn’t call you.', 'Nie mogłem do ciebie zadzwonić.', 'No pude llamarte.', 'Je n’ai pas pu t’appeler.', 'Seni arayamadım.', 'Nu te-am putut suna.', "Senga qo'ng'iroq qila olmadim.", 'मैं तुम्हें फ़ोन नहीं कर सका।', 'لم أستطع الاتصال بك.'))])

const T = (...v) => t11(...v)
const quests = {
	'story-valley-one': { title: T('Однажды давно: -te', 'Колись давно: -te', 'Long ago: -te', 'Dawno temu: -te', 'Hace mucho: -te', 'Il y a longtemps : -te', 'Bir zamanlar: -te', 'Demult: -te', 'Bir paytlar: -te', 'बहुत पहले: -te', 'منذ زمن: -te'), points: [weakPoint] },
	'story-valley-two': { title: T('Вдруг: сильные глаголы', 'Раптом: сильні дієслова', 'Suddenly: strong verbs', 'Nagle: czasowniki mocne', 'De repente: verbos fuertes', 'Soudain : verbes forts', 'Birden: güçlü fiiller', 'Deodată: verbe tari', "To'satdan: kuchli fe'llar", 'अचानक: मज़बूत क्रियाएँ', 'فجأة: الأفعال القوية'), points: [strongPoint] },
	'story-valley-three': { title: T('Долгое путешествие', 'Довга подорож', 'A long journey', 'Długa podróż', 'Un largo viaje', 'Un long voyage', 'Uzun bir yolculuk', 'O călătorie lungă', 'Uzoq safar', 'लंबी यात्रा', 'رحلة طويلة'), points: [strongPoint] },
	'story-valley-four': { title: T('Наконец приехали', 'Нарешті приїхали', 'Finally arrived', 'Wreszcie dotarliśmy', 'Por fin llegamos', 'Enfin arrivés', 'Sonunda vardık', 'În sfârșit am ajuns', 'Nihoyat yetib keldik', 'आख़िरकार पहुँच गए', 'وصلنا أخيراً'), points: [mixedPoint] },
	'story-valley-five': { title: T('als и wenn', 'als і wenn', 'als and wenn', 'als i wenn', 'als y wenn', 'als et wenn', 'als ve wenn', 'als și wenn', 'als va wenn', 'als और wenn', 'als وwenn'), points: [alsWennPoint] },
	'story-valley-six': { title: T('Расскажи историю', 'Розкажи історію', 'Tell a story', 'Opowiedz historię', 'Cuenta una historia', 'Raconte une histoire', 'Bir hikâye anlat', 'Spune o poveste', 'Hikoya aytib ber', 'कहानी सुनाओ', 'احكِ قصة'), points: [orderPoint] },
	'story-valley-seven': { title: T('Встреча в парке', 'Зустріч у парку', 'Meeting in the park', 'Spotkanie w parku', 'Encuentro en el parque', 'Rencontre au parc', 'Parkta buluşma', 'Întâlnire în parc', 'Parkdagi uchrashuv', 'पार्क में मुलाक़ात', 'لقاء في الحديقة'), points: [strongPoint] },
	'story-valley-eight': { title: T('Сказка или разговор', 'Казка чи розмова', 'Fairy tale or conversation', 'Baśń czy rozmowa', 'Cuento o conversación', 'Conte ou conversation', 'Masal mı, sohbet mi', 'Basm sau conversație', 'Ertak yoki suhbat', 'कहानी या बातचीत', 'حكاية أم حديث'), points: [whenPoint] },
	'story-valley-nine': { title: T('Повторение: истории', 'Повторення: історії', 'Review: stories', 'Powtórka: historie', 'Repaso: historias', 'Révision : les histoires', 'Tekrar: hikâyeler', 'Recapitulare: povești', 'Takrorlash: hikoyalar', 'दोहराव: कहानियाँ', 'مراجعة: القصص'), points: [weakPoint, strongPoint, alsWennPoint] },
	'story-valley-ten': { title: finalTitle, points: [strongPoint, alsWennPoint, whenPoint] }
}

module.exports = quests
