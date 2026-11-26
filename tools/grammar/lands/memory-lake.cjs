// Грамматика к заданиям земли memory-lake (Plusquamperfekt, nachdem, bevor, während)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const pqpPoint = pt(['Plusquamperfekt: ещё раньше', 'Plusquamperfekt: ще раніше', 'Plusquamperfekt: even earlier', 'Plusquamperfekt: jeszcze wcześniej', 'Plusquamperfekt: aún antes', 'Plusquamperfekt : encore avant', 'Plusquamperfekt: daha önce', 'Plusquamperfekt: și mai înainte', 'Plusquamperfekt: yanada oldin', 'Plusquamperfekt: उससे भी पहले', 'Plusquamperfekt: قبل ذلك'], [
	'Действие, которое было раньше другого: hatte или war + Partizip II. war для движения и изменения, как в Perfekt.',
	'Дія, що була раніше за іншу: hatte або war + Partizip II. war для руху й зміни, як у Perfekt.',
	'An action that happened before another one: hatte or war + Partizip II. war for movement and change, as in Perfekt.',
	'Czynność wcześniejsza od innej: hatte albo war + Partizip II. war przy ruchu i zmianie, jak w Perfekt.',
	'Una acción anterior a otra: hatte o war + Partizip II. war para el movimiento y el cambio, como en el Perfekt.',
	'Une action antérieure à une autre : hatte ou war + Partizip II. war pour le mouvement et le changement, comme au Perfekt.',
	'Başka bir eylemden önce olan eylem: hatte ya da war + Partizip II. Hareket ve değişim için war, Perfekt’teki gibi.',
	'O acțiune petrecută înaintea alteia: hatte sau war + Partizip II. war pentru mișcare și schimbare, ca la Perfekt.',
	"Boshqasidan oldin bo'lgan harakat: hatte yoki war + Partizip II. Harakat va o'zgarish uchun war, Perfekt dagidek.",
	'जो काम दूसरे से पहले हुआ: hatte या war + Partizip II। गति और बदलाव के लिए war, Perfekt की तरह।',
	'فعل حدث قبل فعل آخر: hatte أو war + Partizip II. وwar للحركة والتغير كما في Perfekt.'
], [
	ex('Als er kam, hatte ich schon gegessen.', t11('Когда он пришёл, я уже поел.', 'Коли він прийшов, я вже поїв.', 'When he came, I had already eaten.', 'Kiedy przyszedł, już zjadłem.', 'Cuando llegó, yo ya había comido.', 'Quand il est arrivé, j’avais déjà mangé.', 'O geldiğinde ben çoktan yemiştim.', 'Când a venit, mâncasem deja.', 'U kelganda men allaqachon ovqatlanib bo‘lgan edim.', 'जब वह आया, मैं खाना खा चुका था।', 'عندما جاء كنت قد أكلت.')),
	ex('Als ich anrief, war er schon gegangen.', t11('Когда я позвонил, он уже ушёл.', 'Коли я зателефонував, він уже пішов.', 'When I called, he had already left.', 'Kiedy zadzwoniłem, on już wyszedł.', 'Cuando llamé, él ya se había ido.', 'Quand j’ai appelé, il était déjà parti.', 'Aradığımda o çoktan gitmişti.', 'Când am sunat, el plecase deja.', "Men qo'ng'iroq qilganimda u allaqachon ketgan edi.", 'जब मैंने फ़ोन किया, वह जा चुका था।', 'عندما اتصلت كان قد ذهب.'))
])

const nachdemPoint = pt(['nachdem: после того как', 'nachdem: після того як', 'nachdem: after', 'nachdem: po tym jak', 'nachdem: después de que', 'nachdem : après que', 'nachdem: -dikten sonra', 'nachdem: după ce', 'nachdem: ...gandan keyin', 'nachdem: के बाद', 'nachdem: بعد أن'], [
	'После nachdem Plusquamperfekt, в главном Präteritum. Глагол в придаточном в конце, главное начинается с глагола.',
	'Після nachdem Plusquamperfekt, у головному Präteritum. Дієслово в підрядному в кінці, головне починається з дієслова.',
	'After nachdem use Plusquamperfekt, in the main clause Präteritum. The verb goes last in the clause, and the main clause starts with the verb.',
	'Po nachdem Plusquamperfekt, w zdaniu głównym Präteritum. Czasownik w podrzędnym na końcu, główne zaczyna się od czasownika.',
	'Tras nachdem, Plusquamperfekt; en la principal, Präteritum. El verbo va al final de la subordinada y la principal empieza por el verbo.',
	'Après nachdem, Plusquamperfekt ; dans la principale, Präteritum. Le verbe va à la fin de la subordonnée, la principale commence par le verbe.',
	'nachdem’den sonra Plusquamperfekt, ana cümlede Präteritum. Yan cümlede fiil sonda, ana cümle fiille başlar.',
	'După nachdem Plusquamperfekt, în principală Präteritum. Verbul la finalul subordonatei, principala începe cu verbul.',
	"nachdem dan keyin Plusquamperfekt, bosh gapda Präteritum. Ergash gapda fe'l oxirida, bosh gap fe'l bilan boshlanadi.",
	'nachdem के बाद Plusquamperfekt, मुख्य वाक्य में Präteritum। उपवाक्य में क्रिया अंत में, मुख्य वाक्य क्रिया से शुरू।',
	'بعد nachdem يأتي Plusquamperfekt، وفي الجملة الرئيسية Präteritum. والفعل في آخر الفرعية، والرئيسية تبدأ بالفعل.'
], [ex('Nachdem ich gegessen hatte, ging ich spazieren.', t11('После того как я поел, я пошёл гулять.', 'Після того як я поїв, я пішов гуляти.', 'After I had eaten, I went for a walk.', 'Po tym jak zjadłem, poszedłem na spacer.', 'Después de comer, fui a pasear.', 'Après avoir mangé, je suis allé me promener.', 'Yemek yedikten sonra yürüyüşe çıktım.', 'După ce am mâncat, am ieșit la plimbare.', 'Ovqatlangandan keyin sayrga chiqdim.', 'खाना खाने के बाद मैं टहलने गया।', 'بعد أن أكلت خرجت للتنزه.'))])

const bevorPoint = pt(['bevor: прежде чем', 'bevor: перш ніж', 'bevor: before', 'bevor: zanim', 'bevor: antes de que', 'bevor : avant que', 'bevor: -meden önce', 'bevor: înainte să', 'bevor: ...dan oldin', 'bevor: से पहले', 'bevor: قبل أن'], [
	'bevor значит «прежде чем». Обычно в обеих частях одно время. Глагол в придаточном в конце.',
	'bevor означає «перш ніж». Зазвичай в обох частинах один час. Дієслово в підрядному в кінці.',
	'bevor means "before". Usually both parts are in the same tense. The verb goes to the end of the clause.',
	'bevor znaczy „zanim”. Zwykle w obu częściach ten sam czas. Czasownik w podrzędnym na końcu.',
	'bevor significa "antes de que". Normalmente ambas partes van en el mismo tiempo. El verbo al final de la subordinada.',
	'bevor veut dire « avant que ». En général, les deux parties sont au même temps. Le verbe à la fin de la subordonnée.',
	'bevor "-meden önce" demektir. Genelde iki kısım aynı zamanda. Yan cümlede fiil sonda.',
	'bevor înseamnă „înainte să”. De obicei ambele părți au același timp. Verbul la finalul subordonatei.',
	"bevor \"...dan oldin\" degani. Odatda ikki qismda bir zamon. Ergash gapda fe'l oxirida.",
	'bevor मतलब "से पहले"। आमतौर पर दोनों हिस्सों में एक ही काल। उपवाक्य में क्रिया अंत में।',
	'bevor تعني "قبل أن". وعادة يكون الجزآن بالزمن نفسه. والفعل في آخر الفرعية.'
], [ex('Bevor ich ging, machte ich das Licht aus.', t11('Прежде чем уйти, я выключил свет.', 'Перш ніж піти, я вимкнув світло.', 'Before I left, I turned off the light.', 'Zanim wyszedłem, zgasiłem światło.', 'Antes de irme, apagué la luz.', 'Avant de partir, j’ai éteint la lumière.', 'Çıkmadan önce ışığı kapattım.', 'Înainte să plec, am stins lumina.', "Ketishdan oldin chiroqni o'chirdim.", 'जाने से पहले मैंने बत्ती बुझाई।', 'قبل أن أخرج أطفأت الضوء.'))])

const waehrendPoint = pt(['während: пока', 'während: поки', 'während: while', 'während: podczas gdy', 'während: mientras', 'während : pendant que', 'während: -iken', 'während: în timp ce', 'während: ...ayotganda', 'während: जबकि, तब तक', 'während: بينما'], [
	'während значит «пока, в то время как»: два действия одновременно. Глагол в придаточном в конце.',
	'während означає «поки, у той час як»: дві дії одночасно. Дієслово в підрядному в кінці.',
	'während means "while": two actions at the same time. The verb goes to the end of the clause.',
	'während znaczy „podczas gdy”: dwie czynności naraz. Czasownik w podrzędnym na końcu.',
	'während significa "mientras": dos acciones a la vez. El verbo al final de la subordinada.',
	'während veut dire « pendant que » : deux actions en même temps. Le verbe à la fin de la subordonnée.',
	'während "-iken, -dığı sırada" demektir: iki eylem aynı anda. Yan cümlede fiil sonda.',
	'während înseamnă „în timp ce”: două acțiuni simultane. Verbul la finalul subordonatei.',
	"während \"...ayotganda\" degani: ikki harakat bir vaqtda. Ergash gapda fe'l oxirida.",
	'während मतलब "जबकि, उसी समय": दो काम एक साथ। उपवाक्य में क्रिया अंत में।',
	'während تعني "بينما": فعلان في الوقت نفسه. والفعل في آخر الفرعية.'
], [ex('Während ich kochte, sah er fern.', t11('Пока я готовил, он смотрел телевизор.', 'Поки я готував, він дивився телевізор.', 'While I was cooking, he watched TV.', 'Kiedy gotowałem, on oglądał telewizję.', 'Mientras yo cocinaba, él veía la tele.', 'Pendant que je cuisinais, il regardait la télé.', 'Ben yemek yaparken o televizyon izledi.', 'În timp ce găteam, el se uita la televizor.', "Men ovqat pishirayotganimda u televizor ko'rdi.", 'जब मैं खाना बना रहा था, वह टीवी देख रहा था।', 'بينما كنت أطبخ كان يشاهد التلفاز.'))])

const T = (...v) => t11(...v)
const quests = {
	'memory-lake-one': { title: T('Уже успел: hatte + Partizip', 'Уже встиг: hatte + Partizip', 'Had already: hatte + Partizip', 'Już zdążyłem: hatte + Partizip', 'Ya había: hatte + Partizip', 'J’avais déjà : hatte + Partizip', 'Çoktan: hatte + Partizip', 'Deja: hatte + Partizip', 'Allaqachon: hatte + Partizip', 'पहले ही: hatte + Partizip', 'كان قد: hatte + Partizip'), points: [pqpPoint] },
	'memory-lake-two': { title: T('Уже ушёл: war + Partizip', 'Уже пішов: war + Partizip', 'Had already left: war + Partizip', 'Już wyszedł: war + Partizip', 'Ya se había ido: war + Partizip', 'Il était déjà parti : war + Partizip', 'Çoktan gitmişti: war + Partizip', 'Plecase deja: war + Partizip', 'Allaqachon ketgan: war + Partizip', 'जा चुका था: war + Partizip', 'كان قد ذهب: war + Partizip'), points: [pqpPoint] },
	'memory-lake-three': { title: T('После того как: nachdem', 'Після того як: nachdem', 'After: nachdem', 'Po tym jak: nachdem', 'Después de: nachdem', 'Après : nachdem', 'Sonra: nachdem', 'După ce: nachdem', 'Keyin: nachdem', 'के बाद: nachdem', 'بعد أن: nachdem'), points: [nachdemPoint] },
	'memory-lake-four': { title: T('Прежде чем: bevor', 'Перш ніж: bevor', 'Before: bevor', 'Zanim: bevor', 'Antes de: bevor', 'Avant : bevor', 'Önce: bevor', 'Înainte: bevor', 'Oldin: bevor', 'से पहले: bevor', 'قبل أن: bevor'), points: [bevorPoint] },
	'memory-lake-five': { title: T('Пока: während', 'Поки: während', 'While: während', 'Podczas gdy: während', 'Mientras: während', 'Pendant que : während', 'İken: während', 'În timp ce: während', 'Ayni paytda: während', 'जबकि: während', 'بينما: während'), points: [waehrendPoint] },
	'memory-lake-six': { title: T('Воспоминания', 'Спогади', 'Memories', 'Wspomnienia', 'Recuerdos', 'Souvenirs', 'Anılar', 'Amintiri', 'Xotiralar', 'यादें', 'الذكريات'), points: [pqpPoint, nachdemPoint] },
	'memory-lake-seven': { title: T('Практика: в аэропорту', 'Практика: в аеропорту', 'Practice: at the airport', 'Praktyka: na lotnisku', 'Práctica: en el aeropuerto', 'Pratique : à l’aéroport', 'Pratik: havalimanında', 'Practică: la aeroport', 'Mashq: aeroportda', 'अभ्यास: हवाई अड्डे पर', 'تدريب: في المطار'), points: [nachdemPoint, bevorPoint] },
	'memory-lake-eight': { title: T('Практика: неудачный день', 'Практика: невдалий день', 'Practice: a bad day', 'Praktyka: pechowy dzień', 'Práctica: un mal día', 'Pratique : une mauvaise journée', 'Pratik: kötü bir gün', 'Practică: o zi proastă', 'Mashq: omadsiz kun', 'अभ्यास: बुरा दिन', 'تدريب: يوم سيئ'), points: [pqpPoint, waehrendPoint] },
	'memory-lake-nine': { title: T('Повторение: воспоминания', 'Повторення: спогади', 'Review: memories', 'Powtórka: wspomnienia', 'Repaso: recuerdos', 'Révision : souvenirs', 'Tekrar: anılar', 'Recapitulare: amintiri', 'Takrorlash: xotiralar', 'दोहराव: यादें', 'مراجعة: الذكريات'), points: [pqpPoint, nachdemPoint, waehrendPoint] },
	'memory-lake-ten': { title: finalTitle, points: [nachdemPoint, bevorPoint, waehrendPoint] }
}

module.exports = quests
