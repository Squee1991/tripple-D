// Грамматика к заданиям земли order-valley (придаточные, es gibt, возвратные глаголы)
const { ex, t11, pt } = require('../lib.cjs')

const nebenPoint = pt(['weil, dass, wenn, ob: глагол в конец', 'weil, dass, wenn, ob: дієслово в кінець', 'weil, dass, wenn, ob: verb to the end', 'weil, dass, wenn, ob: czasownik na koniec', 'weil, dass, wenn, ob: verbo al final', 'weil, dass, wenn, ob : verbe à la fin', 'weil, dass, wenn, ob: fiil sona', 'weil, dass, wenn, ob: verbul la final', "weil, dass, wenn, ob: fe'l oxiriga", 'weil, dass, wenn, ob: क्रिया अंत में', 'weil وdass وwenn وob: الفعل في الآخر'], [
	'После weil (потому что), dass (что), wenn (если, когда), ob (ли) глагол уходит в самый конец. Перед ними ставим запятую.',
	'Після weil (бо), dass (що), wenn (якщо, коли), ob (чи) дієслово йде в самий кінець. Перед ними ставимо кому.',
	'After weil (because), dass (that), wenn (if, when), ob (whether) the verb goes to the very end. Put a comma before them.',
	'Po weil (bo), dass (że), wenn (jeśli, kiedy), ob (czy) czasownik idzie na sam koniec. Przed nimi stawiamy przecinek.',
	'Después de weil (porque), dass (que), wenn (si, cuando), ob (si) el verbo va al final. Antes va una coma.',
	'Après weil (parce que), dass (que), wenn (si, quand), ob (si) le verbe va tout à la fin. On met une virgule avant.',
	'weil (çünkü), dass (ki), wenn (eğer, -dığında), ob (-ip -mediği) sonrası fiil en sona gider. Öncesine virgül konur.',
	'După weil (pentru că), dass (că), wenn (dacă, când), ob (dacă) verbul merge la final. Înaintea lor se pune virgulă.',
	"weil (chunki), dass (ki), wenn (agar, qachonki), ob (-mi yo'qmi) dan keyin fe'l eng oxiriga o'tadi. Ulardan oldin vergul qo'yiladi.",
	'weil (क्योंकि), dass (कि), wenn (अगर, जब), ob (कि ... या नहीं) के बाद क्रिया बिल्कुल अंत में जाती है। इनसे पहले कॉमा।',
	'بعد weil (لأن) وdass (أنّ) وwenn (إذا، عندما) وob (هل) يذهب الفعل إلى آخر الجملة. ونضع قبلها فاصلة.'
], [
	ex('Ich lerne, weil es wichtig ist.', t11('Я учу, потому что это важно.', 'Я вчу, бо це важливо.', 'I study because it’s important.', 'Uczę się, bo to ważne.', 'Estudio porque es importante.', 'J’apprends parce que c’est important.', 'Öğreniyorum çünkü önemli.', 'Învăț pentru că e important.', "O'qiyman, chunki bu muhim.", 'मैं सीखता हूँ क्योंकि यह ज़रूरी है।', 'أتعلم لأن ذلك مهم.')),
	ex('Er sagt, dass er kommt.', t11('Он говорит, что придёт.', 'Він каже, що прийде.', 'He says that he’s coming.', 'Mówi, że przyjdzie.', 'Dice que viene.', 'Il dit qu’il vient.', 'Geleceğini söylüyor.', 'Spune că vine.', 'U kelishini aytyapti.', 'वह कहता है कि वह आएगा।', 'يقول إنه سيأتي.'))
])

const modalEndPoint = pt(['Модальный в самом конце', 'Модальне в самому кінці', 'The modal goes last', 'Modalny na samym końcu', 'El modal al final del todo', 'Le modal tout à la fin', 'Modal en sonda', 'Modalul la final', 'Modal eng oxirida', 'मोडल बिल्कुल अंत में', 'المساعد في آخر الجملة'], [
	'Если в придаточном два глагола, модальный встаёт после второго: weil ich arbeiten muss.',
	'Якщо в підрядному два дієслова, модальне стає після другого: weil ich arbeiten muss.',
	'With two verbs in the clause, the modal comes after the other one: weil ich arbeiten muss.',
	'Gdy w zdaniu podrzędnym są dwa czasowniki, modalny stoi po drugim: weil ich arbeiten muss.',
	'Si hay dos verbos en la subordinada, el modal va detrás: weil ich arbeiten muss.',
	'S’il y a deux verbes dans la subordonnée, le modal vient après l’autre : weil ich arbeiten muss.',
	'Yan cümlede iki fiil varsa modal ötekinden sonra gelir: weil ich arbeiten muss.',
	'Dacă în subordonată sunt două verbe, modalul vine după celălalt: weil ich arbeiten muss.',
	"Ergash gapda ikki fe'l bo'lsa, modal ikkinchisidan keyin turadi: weil ich arbeiten muss.",
	'अगर उपवाक्य में दो क्रियाएँ हों, तो मोडल दूसरी के बाद: weil ich arbeiten muss।',
	'إذا كان في الجملة الفرعية فعلان يأتي المساعد بعد الآخر: weil ich arbeiten muss.'
], [
	ex('Ich kann nicht kommen, weil ich arbeiten muss.', t11('Я не могу прийти, потому что мне надо работать.', 'Я не можу прийти, бо мені треба працювати.', 'I can’t come because I have to work.', 'Nie mogę przyjść, bo muszę pracować.', 'No puedo venir porque tengo que trabajar.', 'Je ne peux pas venir parce que je dois travailler.', 'Gelemem çünkü çalışmam gerekiyor.', 'Nu pot veni pentru că trebuie să lucrez.', 'Kela olmayman, chunki ishlashim kerak.', 'मैं नहीं आ सकता क्योंकि मुझे काम करना है।', 'لا أستطيع المجيء لأن عليّ أن أعمل.'))
])

const esGibtPoint = pt(['es gibt + Akkusativ', 'es gibt + Akkusativ', 'es gibt + accusative', 'es gibt + Akkusativ', 'es gibt + acusativo', 'es gibt + accusatif', 'es gibt + Akkusativ', 'es gibt + acuzativ', 'es gibt + Akkusativ', 'es gibt + Akkusativ', 'es gibt + المفعول'], [
	'es gibt значит «есть, имеется». Сама фраза не меняется, а то, что после неё, в Akkusativ: einen Park, keinen Eingang.',
	'es gibt означає «є, існує». Сама фраза не змінюється, а те, що після неї, в Akkusativ: einen Park, keinen Eingang.',
	'es gibt means "there is / there are". The phrase never changes, and what follows is in the accusative: einen Park, keinen Eingang.',
	'es gibt znaczy „jest, istnieje”. Samo wyrażenie się nie zmienia, a to, co po nim, jest w Akkusativ: einen Park, keinen Eingang.',
	'es gibt significa "hay". La expresión no cambia y lo que sigue va en acusativo: einen Park, keinen Eingang.',
	'es gibt veut dire « il y a ». L’expression ne change pas, et ce qui suit est à l’accusatif : einen Park, keinen Eingang.',
	'es gibt "var" demektir. İfade değişmez, ardından gelen Akkusativ’dedir: einen Park, keinen Eingang.',
	'es gibt înseamnă „există”. Expresia nu se schimbă, iar ce urmează e la acuzativ: einen Park, keinen Eingang.',
	"es gibt \"bor\" degani. Iboraning o'zi o'zgarmaydi, undan keyingisi Akkusativda: einen Park, keinen Eingang.",
	'es gibt मतलब "है, मौजूद है"। वाक्यांश नहीं बदलता, इसके बाद वाला Akkusativ में: einen Park, keinen Eingang।',
	'es gibt تعني "يوجد". العبارة لا تتغير، وما بعدها في حالة المفعول: einen Park، keinen Eingang.'
], [
	ex('Es gibt hier einen Park.', t11('Здесь есть парк.', 'Тут є парк.', 'There’s a park here.', 'Tu jest park.', 'Aquí hay un parque.', 'Il y a un parc ici.', 'Burada bir park var.', 'Aici e un parc.', 'Bu yerda park bor.', 'यहाँ एक पार्क है।', 'يوجد هنا حديقة.')),
	ex('Gibt es hier Internet?', t11('Здесь есть интернет?', 'Тут є інтернет?', 'Is there internet here?', 'Czy jest tu internet?', '¿Hay internet aquí?', 'Il y a internet ici ?', 'Burada internet var mı?', 'Aici e internet?', 'Bu yerda internet bormi?', 'क्या यहाँ इंटरनेट है?', 'هل يوجد إنترنت هنا؟'))
])

const reflexPoint = pt(['mich или mir', 'mich чи mir', 'mich or mir', 'mich czy mir', 'mich o mir', 'mich ou mir', 'mich mi, mir mi', 'mich sau mir', 'mich yoki mir', 'mich या mir', 'mich أم mir'], [
	'Возвратные: ich wasche mich, du wäschst dich, er wäscht sich. Если есть ещё предмет (руки, волосы), то mir, dir: Ich wasche mir die Hände.',
	'Зворотні: ich wasche mich, du wäschst dich, er wäscht sich. Якщо є ще предмет (руки, волосся), то mir, dir: Ich wasche mir die Hände.',
	'Reflexive: ich wasche mich, du wäschst dich, er wäscht sich. If there’s another object (hands, hair), use mir, dir: Ich wasche mir die Hände.',
	'Zwrotne: ich wasche mich, du wäschst dich, er wäscht sich. Jeśli jest jeszcze przedmiot (ręce, włosy), to mir, dir: Ich wasche mir die Hände.',
	'Reflexivos: ich wasche mich, du wäschst dich, er wäscht sich. Si hay otro objeto (manos, pelo), mir, dir: Ich wasche mir die Hände.',
	'Pronominaux : ich wasche mich, du wäschst dich, er wäscht sich. S’il y a un autre objet (mains, cheveux), mir, dir : Ich wasche mir die Hände.',
	'Dönüşlü: ich wasche mich, du wäschst dich, er wäscht sich. Başka nesne varsa (eller, saçlar) mir, dir: Ich wasche mir die Hände.',
	'Reflexive: ich wasche mich, du wäschst dich, er wäscht sich. Dacă mai e un obiect (mâini, păr), mir, dir: Ich wasche mir die Hände.',
	"O'zlik: ich wasche mich, du wäschst dich, er wäscht sich. Yana narsa bo'lsa (qo'l, soch), mir, dir: Ich wasche mir die Hände.",
	'निजवाचक: ich wasche mich, du wäschst dich, er wäscht sich। अगर कोई और चीज़ हो (हाथ, बाल), तो mir, dir: Ich wasche mir die Hände।',
	'الأفعال الانعكاسية: ich wasche mich، du wäschst dich، er wäscht sich. وإذا وُجد مفعول آخر (اليدان، الشعر) فـ mir وdir: Ich wasche mir die Hände.'
], [
	ex('Er rasiert sich.', t11('Он бреется.', 'Він голиться.', 'He’s shaving.', 'On się goli.', 'Él se afeita.', 'Il se rase.', 'O tıraş oluyor.', 'El se bărbierește.', 'U soqol olyapti.', 'वह दाढ़ी बना रहा है।', 'هو يحلق.')),
	ex('Du kämmst dir die Haare.', t11('Ты расчёсываешь волосы.', 'Ти розчісуєш волосся.', 'You’re combing your hair.', 'Czeszesz włosy.', 'Te peinas el pelo.', 'Tu te coiffes les cheveux.', 'Saçlarını tarıyorsun.', 'Îți piepteni părul.', 'Sen sochingni tarayapsan.', 'तुम बाल सँवार रहे हो।', 'أنت تمشط شعرك.'))
])

const sepEndPoint = pt(['Приставка в придаточном', 'Префікс у підрядному', 'Prefix in a subordinate clause', 'Przedrostek w zdaniu podrzędnym', 'Prefijo en la subordinada', 'Préfixe dans la subordonnée', 'Yan cümlede ön ek', 'Prefixul în subordonată', "Ergash gapda old qo'shimcha", 'उपवाक्य में उपसर्ग', 'السابقة في الجملة الفرعية'], [
	'В придаточном отделяемый глагол в конце снова целый: Er stellt sich vor → dass er sich vorstellt.',
	'У підрядному відокремлюване дієслово в кінці знову ціле: Er stellt sich vor → dass er sich vorstellt.',
	'In a subordinate clause the separable verb is whole again at the end: Er stellt sich vor → dass er sich vorstellt.',
	'W zdaniu podrzędnym czasownik rozdzielny na końcu znów jest cały: Er stellt sich vor → dass er sich vorstellt.',
	'En la subordinada el verbo separable vuelve a ir entero al final: Er stellt sich vor → dass er sich vorstellt.',
	'Dans la subordonnée, le verbe séparable est de nouveau entier à la fin : Er stellt sich vor → dass er sich vorstellt.',
	'Yan cümlede ayrılabilen fiil sonda yine bütündür: Er stellt sich vor → dass er sich vorstellt.',
	'În subordonată verbul separabil e iar întreg la final: Er stellt sich vor → dass er sich vorstellt.',
	"Ergash gapda ajraladigan fe'l oxirida yana butun: Er stellt sich vor → dass er sich vorstellt.",
	'उपवाक्य में अलग होने वाली क्रिया अंत में फिर पूरी हो जाती है: Er stellt sich vor → dass er sich vorstellt।',
	'في الجملة الفرعية يعود الفعل المنفصل كاملاً في الآخر: Er stellt sich vor → dass er sich vorstellt.'
], [
	ex('Er sagt, dass er sich jetzt ausruht.', t11('Он говорит, что сейчас отдыхает.', 'Він каже, що зараз відпочиває.', 'He says he’s resting now.', 'Mówi, że teraz odpoczywa.', 'Dice que ahora descansa.', 'Il dit qu’il se repose maintenant.', 'Şimdi dinlendiğini söylüyor.', 'Spune că acum se odihnește.', 'U hozir dam olayotganini aytyapti.', 'वह कहता है कि वह अभी आराम कर रहा है।', 'يقول إنه يرتاح الآن.'))
])

const quests = {
	'order-one': { title: t11('Глагол в конце!', 'Дієслово в кінці!', 'Verb at the end!', 'Czasownik na końcu!', '¡El verbo al final!', 'Le verbe à la fin !', 'Fiil sonda!', 'Verbul la final!', "Fe'l oxirida!", 'क्रिया अंत में!', 'الفعل في الآخر!'), points: [nebenPoint] },
	'order-two': { title: t11('Короткие придаточные', 'Короткі підрядні', 'Short subordinate clauses', 'Krótkie zdania podrzędne', 'Subordinadas cortas', 'Subordonnées courtes', 'Kısa yan cümleler', 'Subordonate scurte', 'Qisqa ergash gaplar', 'छोटे उपवाक्य', 'جمل فرعية قصيرة'), points: [nebenPoint] },
	'order-three': { title: t11('Придаточные: длиннее', 'Підрядні: довші', 'Subordinate clauses: longer', 'Zdania podrzędne: dłuższe', 'Subordinadas: más largas', 'Subordonnées : plus longues', 'Yan cümleler: daha uzun', 'Subordonate: mai lungi', 'Ergash gaplar: uzunroq', 'उपवाक्य: लंबे', 'جمل فرعية أطول'), points: [modalEndPoint] },
	'order-four': { title: t11('es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt', 'es gibt'), points: [esGibtPoint] },
	'order-five': { title: t11('es gibt: продолжение', 'es gibt: продовження', 'es gibt: continued', 'es gibt: ciąg dalszy', 'es gibt: continuación', 'es gibt : suite', 'es gibt: devam', 'es gibt: continuare', 'es gibt: davomi', 'es gibt: आगे', 'es gibt: تابع'), points: [esGibtPoint] },
	'order-six': { title: t11('Возвратные: mich и mir', 'Зворотні: mich і mir', 'Reflexive: mich and mir', 'Zwrotne: mich i mir', 'Reflexivos: mich y mir', 'Pronominaux : mich et mir', 'Dönüşlü: mich ve mir', 'Reflexive: mich și mir', "O'zlik: mich va mir", 'निजवाचक: mich और mir', 'الانعكاسية: mich وmir'), points: [reflexPoint] },
	'order-seven': { title: t11('Всё сразу', 'Усе одразу', 'Everything at once', 'Wszystko naraz', 'Todo a la vez', 'Tout à la fois', 'Hepsi bir arada', 'Totul deodată', 'Hammasi birga', 'सब एक साथ', 'كل شيء معاً'), points: [nebenPoint, esGibtPoint, reflexPoint] },
	'order-eight': { title: t11('Путешествия', 'Подорожі', 'Travel', 'Podróże', 'Viajes', 'Voyages', 'Seyahat', 'Călătorii', 'Sayohatlar', 'यात्राएँ', 'السفر'), points: [nebenPoint, sepEndPoint] },
	'order-nine': { title: t11('Работа', 'Робота', 'Work', 'Praca', 'Trabajo', 'Travail', 'İş', 'Munca', 'Ish', 'काम', 'العمل'), points: [sepEndPoint, esGibtPoint] },
	'order-ten': { title: t11('Работа: просто и понятно', 'Робота: просто й зрозуміло', 'Work: simple and clear', 'Praca: prosto i jasno', 'Trabajo: simple y claro', 'Travail : simple et clair', 'İş: basit ve anlaşılır', 'Munca: simplu și clar', 'Ish: oddiy va tushunarli', 'काम: आसान और साफ़', 'العمل: ببساطة ووضوح'), points: [nebenPoint, reflexPoint] },
	'order-eleven': { title: t11('Еда, отдых, покупки', 'Їжа, відпочинок, покупки', 'Food, leisure, shopping', 'Jedzenie, odpoczynek, zakupy', 'Comida, ocio, compras', 'Nourriture, loisirs, courses', 'Yemek, eğlence, alışveriş', 'Mâncare, odihnă, cumpărături', 'Taom, dam olish, xarid', 'खाना, आराम, खरीदारी', 'الطعام والراحة والتسوق'), points: [nebenPoint, esGibtPoint] },
	'order-twelve': { title: t11('Дом и отдых: повторение', 'Дім і відпочинок: повторення', 'Home and leisure: review', 'Dom i odpoczynek: powtórka', 'Casa y ocio: repaso', 'Maison et loisirs : révision', 'Ev ve eğlence: tekrar', 'Casă și odihnă: recapitulare', 'Uy va dam olish: takrorlash', 'घर और आराम: दोहराव', 'البيت والراحة: مراجعة'), points: [nebenPoint, reflexPoint, esGibtPoint] }
}

module.exports = quests
