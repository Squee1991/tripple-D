// Грамматика к заданиям земли neighbor-street (относительные придаточные)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const nomPoint = pt(['der, die, das: который', 'der, die, das: який', 'der, die, das: who, which', 'der, die, das: który', 'der, die, das: que', 'der, die, das : qui', 'der, die, das: ki o', 'der, die, das: care', 'der, die, das: qaysiki', 'der, die, das: जो', 'der وdie وdas: الذي'], [
	'«Который» берём по роду слова: der, die, das, во множественном die. Глагол в придаточном в конце, вокруг запятые.',
	'«Який» беремо за родом слова: der, die, das, у множині die. Дієслово в підрядному в кінці, навколо коми.',
	'"Who, which" follows the noun’s gender: der, die, das, plural die. The verb goes last, with commas around the clause.',
	'„Który” bierzemy według rodzaju słowa: der, die, das, w mnogiej die. Czasownik na końcu, wokół przecinki.',
	'El relativo sigue el género: der, die, das, en plural die. El verbo va al final y hay comas alrededor.',
	'Le relatif suit le genre du nom : der, die, das, au pluriel die. Le verbe va à la fin, avec des virgules autour.',
	'"ki o" ismin cinsiyetine göre seçilir: der, die, das, çoğulda die. Fiil sonda, etrafında virgüller.',
	'„Care” după genul cuvântului: der, die, das, la plural die. Verbul la final, cu virgule în jur.',
	"\"Qaysiki\" so'zning rodiga qarab: der, die, das, ko'plikda die. Fe'l oxirida, atrofida vergullar.",
	'"जो" संज्ञा के लिंग के अनुसार: der, die, das, बहुवचन में die। क्रिया अंत में, चारों ओर कॉमा।',
	'"الذي" حسب جنس الاسم: der وdie وdas، وفي الجمع die. والفعل في الآخر وحولها فواصل.'
], [ex('Der Mann, der dort steht, ist mein Nachbar.', t11('Мужчина, который там стоит, мой сосед.', 'Чоловік, який там стоїть, мій сусід.', 'The man who is standing there is my neighbour.', 'Mężczyzna, który tam stoi, to mój sąsiad.', 'El hombre que está allí es mi vecino.', 'L’homme qui est là-bas est mon voisin.', 'Orada duran adam benim komşum.', 'Bărbatul care stă acolo e vecinul meu.', "U yerda turgan erkak mening qo'shnim.", 'वहाँ खड़ा आदमी मेरा पड़ोसी है।', 'الرجل الذي يقف هناك جاري.'))])

const akkPoint = pt(['den: которого', 'den: якого', 'den: whom (masculine)', 'den: którego', 'den: al que', 'den : que (masculin)', 'den: -dığı (eril)', 'den: pe care', 'den: kimni', 'den: जिसे (पु)', 'den: الذي (مفعول مذكر)'], [
	'Если в придаточном «который» отвечает на вопрос кого? что?, это Akkusativ. Меняется только мужской род: der → den.',
	'Якщо в підрядному «який» відповідає на питання кого? що?, це Akkusativ. Змінюється лише чоловічий рід: der → den.',
	'If the relative pronoun is the object (whom? what?), it’s accusative. Only masculine changes: der → den.',
	'Jeśli w zdaniu podrzędnym „który” odpowiada na pytanie kogo? co?, to Akkusativ. Zmienia się tylko rodzaj męski: der → den.',
	'Si el relativo es el objeto (¿a quién? ¿qué?), va en acusativo. Solo cambia el masculino: der → den.',
	'Si le relatif est complément (qui ? quoi ?), c’est l’accusatif. Seul le masculin change : der → den.',
	'Zamir nesne ise (kimi? neyi?) Akkusativ’dir. Sadece eril değişir: der → den.',
	'Dacă relativul e complement (pe cine? ce?), e acuzativ. Doar masculinul se schimbă: der → den.',
	"Agar nisbiy olmosh to'ldiruvchi bo'lsa (kimni? nimani?), bu Akkusativ. Faqat erkak rodi o'zgaradi: der → den.",
	'अगर "जो" कर्म है (किसे? क्या?), तो Akkusativ। सिर्फ़ पुल्लिंग बदलता है: der → den।',
	'إذا كان الضمير مفعولاً به (من؟ ماذا؟) فهو في حالة المفعول. ويتغير المذكر فقط: der → den.'
], [ex('Der Film, den ich gestern gesehen habe, war toll.', t11('Фильм, который я вчера посмотрел, был отличный.', 'Фільм, який я вчора подивився, був чудовий.', 'The film I saw yesterday was great.', 'Film, który wczoraj obejrzałem, był świetny.', 'La película que vi ayer era genial.', 'Le film que j’ai vu hier était génial.', 'Dün izlediğim film harikaydı.', 'Filmul pe care l-am văzut ieri a fost grozav.', "Kecha ko'rgan filmim ajoyib edi.", 'कल जो फ़िल्म मैंने देखी, वह शानदार थी।', 'الفيلم الذي شاهدته أمس كان رائعاً.'))])

const datPoint = pt(['dem, der, denen: которому', 'dem, der, denen: якому', 'dem, der, denen: to whom', 'dem, der, denen: któremu', 'dem, der, denen: a quien', 'dem, der, denen : à qui', 'dem, der, denen: kime', 'dem, der, denen: căruia', 'dem, der, denen: kimga', 'dem, der, denen: जिसे (Dativ)', 'dem وder وdenen: لمن'], [
	'С глаголами на Dativ (helfen, danken, gehören): dem для мужского и среднего, der для женского, denen во множественном.',
	'З дієсловами на Dativ (helfen, danken, gehören): dem для чоловічого й середнього, der для жіночого, denen у множині.',
	'With dative verbs (helfen, danken, gehören): dem for masculine and neuter, der for feminine, denen in the plural.',
	'Z czasownikami z Dativ (helfen, danken, gehören): dem dla męskiego i nijakiego, der dla żeńskiego, denen w mnogiej.',
	'Con verbos de dativo (helfen, danken, gehören): dem para masculino y neutro, der para femenino, denen en plural.',
	'Avec les verbes au datif (helfen, danken, gehören) : dem pour le masculin et le neutre, der pour le féminin, denen au pluriel.',
	'Dativ alan fiillerle (helfen, danken, gehören): eril ve nötr için dem, dişil için der, çoğulda denen.',
	'Cu verbe la dativ (helfen, danken, gehören): dem pentru masculin și neutru, der pentru feminin, denen la plural.',
	"Dativ talab qiluvchi fe'llar bilan (helfen, danken, gehören): erkak va o'rta rod uchun dem, ayol uchun der, ko'plikda denen.",
	'Dativ वाली क्रियाओं के साथ (helfen, danken, gehören): पुल्लिंग और नपुंसकलिंग के लिए dem, स्त्रीलिंग के लिए der, बहुवचन में denen।',
	'مع أفعال الجر (helfen، danken، gehören): dem للمذكر والمحايد، وder للمؤنث، وdenen في الجمع.'
], [ex('Die Frau, der ich helfe, ist meine Nachbarin.', t11('Женщина, которой я помогаю, моя соседка.', 'Жінка, якій я допомагаю, моя сусідка.', 'The woman I’m helping is my neighbour.', 'Kobieta, której pomagam, to moja sąsiadka.', 'La mujer a la que ayudo es mi vecina.', 'La femme que j’aide est ma voisine.', 'Yardım ettiğim kadın komşum.', 'Femeia pe care o ajut e vecina mea.', "Men yordam beradigan ayol mening qo'shnim.", 'जिस महिला की मैं मदद करता हूँ, वह मेरी पड़ोसन है।', 'المرأة التي أساعدها جارتي.'))])

const prepPoint = pt(['Предлог перед который', 'Прийменник перед який', 'Preposition before the relative', 'Przyimek przed który', 'Preposición antes del relativo', 'La préposition avant le relatif', 'Edat zamirden önce', 'Prepoziția înaintea relativului', "Ko'makchi olmoshdan oldin", 'संबंधसूचक "जो" से पहले', 'حرف الجر قبل الضمير'], [
	'Предлог стоит перед der/den/dem, а падеж задаёт предлог: in dem, mit dem (Dativ), für den (Akkusativ).',
	'Прийменник стоїть перед der/den/dem, а відмінок задає прийменник: in dem, mit dem (Dativ), für den (Akkusativ).',
	'The preposition comes before der/den/dem, and it decides the case: in dem, mit dem (dative), für den (accusative).',
	'Przyimek stoi przed der/den/dem, a przypadek wyznacza przyimek: in dem, mit dem (Dativ), für den (Akkusativ).',
	'La preposición va delante de der/den/dem y ella decide el caso: in dem, mit dem (dativo), für den (acusativo).',
	'La préposition se place avant der/den/dem et décide du cas : in dem, mit dem (datif), für den (accusatif).',
	'Edat der/den/dem’den önce gelir ve hâli belirler: in dem, mit dem (Dativ), für den (Akkusativ).',
	'Prepoziția stă înaintea lui der/den/dem și ea decide cazul: in dem, mit dem (dativ), für den (acuzativ).',
	"Ko'makchi der/den/dem dan oldin turadi va kelishikni belgilaydi: in dem, mit dem (Dativ), für den (Akkusativ).",
	'संबंधसूचक der/den/dem से पहले आता है और वही कारक तय करता है: in dem, mit dem (Dativ), für den (Akkusativ)।',
	'يأتي حرف الجر قبل der/den/dem وهو الذي يحدد الحالة: in dem، mit dem (جر)، für den (مفعول).'
], [ex('Das Haus, in dem ich wohne, ist alt.', t11('Дом, в котором я живу, старый.', 'Будинок, у якому я живу, старий.', 'The house I live in is old.', 'Dom, w którym mieszkam, jest stary.', 'La casa en la que vivo es vieja.', 'La maison dans laquelle j’habite est vieille.', 'Oturduğum ev eski.', 'Casa în care locuiesc e veche.', 'Men yashayotgan uy eski.', 'जिस घर में मैं रहता हूँ, वह पुराना है।', 'البيت الذي أسكن فيه قديم.'))])

const wasPoint = pt(['alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was', 'alles, was'], [
	'После alles, nichts, etwas, vieles и das вместо der/die/das ставим was.',
	'Після alles, nichts, etwas, vieles і das замість der/die/das ставимо was.',
	'After alles, nichts, etwas, vieles and das, use was instead of der/die/das.',
	'Po alles, nichts, etwas, vieles i das zamiast der/die/das stawiamy was.',
	'Después de alles, nichts, etwas, vieles y das, se usa was en vez de der/die/das.',
	'Après alles, nichts, etwas, vieles et das, on met was au lieu de der/die/das.',
	'alles, nichts, etwas, vieles ve das’tan sonra der/die/das yerine was kullanılır.',
	'După alles, nichts, etwas, vieles și das, în loc de der/die/das punem was.',
	"alles, nichts, etwas, vieles va das dan keyin der/die/das o'rniga was qo'yiladi.",
	'alles, nichts, etwas, vieles और das के बाद der/die/das की जगह was।',
	'بعد alles وnichts وetwas وvieles وdas نستعمل was بدل der/die/das.'
], [ex('Das ist alles, was ich weiß.', t11('Это всё, что я знаю.', 'Це все, що я знаю.', 'That’s all I know.', 'To wszystko, co wiem.', 'Es todo lo que sé.', 'C’est tout ce que je sais.', 'Bildiğim her şey bu.', 'Asta e tot ce știu.', 'Bilganlarim shu.', 'मैं बस इतना ही जानता हूँ।', 'هذا كل ما أعرفه.'))])

const T = (...v) => t11(...v)
const quests = {
	'neighbor-street-one': { title: T('Человек, который...', 'Людина, яка...', 'The person who...', 'Człowiek, który...', 'La persona que...', 'La personne qui...', '... olan kişi', 'Omul care...', "... qiladigan odam", 'वह व्यक्ति जो...', 'الشخص الذي...'), points: [nomPoint] },
	'neighbor-street-two': { title: T('Которого я знаю: den', 'Якого я знаю: den', 'Whom I know: den', 'Którego znam: den', 'Al que conozco: den', 'Que je connais : den', 'Tanıdığım: den', 'Pe care îl cunosc: den', 'Men taniydigan: den', 'जिसे मैं जानता हूँ: den', 'الذي أعرفه: den'), points: [akkPoint] },
	'neighbor-street-three': { title: T('Которому я помогаю: dem', 'Якому я допомагаю: dem', 'Whom I help: dem', 'Któremu pomagam: dem', 'Al que ayudo: dem', 'Que j’aide : dem', 'Yardım ettiğim: dem', 'Pe care îl ajut: dem', 'Men yordam beradigan: dem', 'जिसकी मैं मदद करता हूँ: dem', 'الذي أساعده: dem'), points: [datPoint] },
	'neighbor-street-four': { title: T('Дом, в котором...', 'Будинок, у якому...', 'The house in which...', 'Dom, w którym...', 'La casa en la que...', 'La maison dans laquelle...', '... olduğu ev', 'Casa în care...', "... uy", 'वह घर जिसमें...', 'البيت الذي فيه...'), points: [prepPoint] },
	'neighbor-street-five': { title: T('Всё, что...', 'Усе, що...', 'Everything that...', 'Wszystko, co...', 'Todo lo que...', 'Tout ce que...', '... her şey', 'Tot ce...', "... hamma narsa", 'सब कुछ जो...', 'كل ما...'), points: [wasPoint] },
	'neighbor-street-six': { title: T('Ищем квартиру', 'Шукаємо квартиру', 'Looking for a flat', 'Szukamy mieszkania', 'Buscamos piso', 'On cherche un appartement', 'Daire arıyoruz', 'Căutăm un apartament', 'Kvartira qidiramiz', 'फ़्लैट ढूँढ रहे हैं', 'نبحث عن شقة'), points: [nomPoint, prepPoint, wasPoint] },
	'neighbor-street-seven': { title: T('Практика: прогулка по городу', 'Практика: прогулянка містом', 'Practice: a walk through town', 'Praktyka: spacer po mieście', 'Práctica: paseo por la ciudad', 'Pratique : promenade en ville', 'Pratik: şehir gezisi', 'Practică: plimbare prin oraș', "Mashq: shahar bo'ylab sayr", 'अभ्यास: शहर की सैर', 'تدريب: جولة في المدينة'), points: [nomPoint, prepPoint] },
	'neighbor-street-eight': { title: T('Практика: люди на работе', 'Практика: люди на роботі', 'Practice: people at work', 'Praktyka: ludzie w pracy', 'Práctica: gente en el trabajo', 'Pratique : les gens au travail', 'Pratik: iş yerindeki insanlar', 'Practică: oameni la muncă', 'Mashq: ishdagi odamlar', 'अभ्यास: काम पर लोग', 'تدريب: الناس في العمل'), points: [akkPoint, datPoint] },
	'neighbor-street-nine': { title: T('Повторение: который', 'Повторення: який', 'Review: relative clauses', 'Powtórka: który', 'Repaso: relativas', 'Révision : les relatives', 'Tekrar: ilgi cümleleri', 'Recapitulare: relative', 'Takrorlash: nisbiy gaplar', 'दोहराव: संबंधवाचक', 'مراجعة: جمل الصلة'), points: [nomPoint, akkPoint, datPoint] },
	'neighbor-street-ten': { title: finalTitle, points: [akkPoint, prepPoint, wasPoint] }
}

module.exports = quests
