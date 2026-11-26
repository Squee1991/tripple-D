// Грамматика к заданиям земли comparison-hills (сравнение прилагательных)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const erPoint = pt(['-er: быстрее', '-er: швидше', '-er: faster', '-er: szybszy', '-er: más rápido', '-er : plus rapide', '-er: daha hızlı', '-er: mai rapid', '-er: tezroq', '-er: ज़्यादा तेज़', '-er: أسرع'], [
	'Сравнительная степень: + -er. schnell → schneller. Короткие слова часто с умлаутом: alt → älter, groß → größer.',
	'Вищий ступінь: + -er. schnell → schneller. Короткі слова часто з умлаутом: alt → älter, groß → größer.',
	'Comparative: add -er. schnell → schneller. Short words often get an umlaut: alt → älter, groß → größer.',
	'Stopień wyższy: + -er. schnell → schneller. Krótkie słowa często z umlautem: alt → älter, groß → größer.',
	'Comparativo: + -er. schnell → schneller. Las palabras cortas suelen llevar diéresis: alt → älter, groß → größer.',
	'Comparatif : + -er. schnell → schneller. Les mots courts prennent souvent un umlaut : alt → älter, groß → größer.',
	'Karşılaştırma: + -er. schnell → schneller. Kısa kelimeler çoğu zaman umlaut alır: alt → älter, groß → größer.',
	'Comparativul: + -er. schnell → schneller. Cuvintele scurte primesc des umlaut: alt → älter, groß → größer.',
	"Qiyosiy daraja: + -er. schnell → schneller. Qisqa so'zlar ko'pincha umlaut oladi: alt → älter, groß → größer.",
	'तुलनात्मक: + -er। schnell → schneller। छोटे शब्दों में अक्सर उमलाउट: alt → älter, groß → größer।',
	'صيغة المقارنة: + -er. schnell → schneller. والكلمات القصيرة تأخذ غالباً أوملاوت: alt → älter، groß → größer.'
], [ex('Mein Bruder ist älter.', t11('Мой брат старше.', 'Мій брат старший.', 'My brother is older.', 'Mój brat jest starszy.', 'Mi hermano es mayor.', 'Mon frère est plus âgé.', 'Erkek kardeşim daha büyük.', 'Fratele meu e mai mare.', 'Akam kattaroq.', 'मेरा भाई बड़ा है।', 'أخي أكبر.'))])

const alsPoint = pt(['als и особые формы', 'als і особливі форми', 'als and irregular forms', 'als i formy szczególne', 'als y formas especiales', 'als et formes irrégulières', 'als ve özel biçimler', 'als și forme speciale', 'als va alohida shakllar', 'als और खास रूप', 'als والصيغ الخاصة'], [
	'С чем сравниваем, ставим после als: älter als ich. Особые: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'З чим порівнюємо, ставимо після als: älter als ich. Особливі: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'What you compare with goes after als: älter als ich. Irregular: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'To, z czym porównujemy, stoi po als: älter als ich. Szczególne: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'Lo comparado va tras als: älter als ich. Especiales: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'Ce à quoi on compare vient après als : älter als ich. Irréguliers : gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'Karşılaştırılan als’tan sonra gelir: älter als ich. Özel: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	'Cu ce comparăm vine după als: älter als ich. Speciale: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.',
	"Nima bilan solishtirsak, als dan keyin: älter als ich. Alohida: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer.",
	'जिससे तुलना हो, वह als के बाद: älter als ich। खास: gut → besser, viel → mehr, gern → lieber, hoch → höher, teuer → teurer।',
	'ما نقارن به يأتي بعد als: älter als ich. والخاصة: gut → besser، viel → mehr، gern → lieber، hoch → höher، teuer → teurer.'
], [ex('Tee ist besser als Kaffee.', t11('Чай лучше, чем кофе.', 'Чай кращий за каву.', 'Tea is better than coffee.', 'Herbata jest lepsza niż kawa.', 'El té es mejor que el café.', 'Le thé est meilleur que le café.', 'Çay kahveden daha iyi.', 'Ceaiul e mai bun decât cafeaua.', 'Choy qahvadan yaxshiroq.', 'चाय कॉफ़ी से बेहतर है।', 'الشاي أفضل من القهوة.'))])

const soWiePoint = pt('so ... wie', [
	'Одинаково: so groß wie. Не одинаково: nicht so groß wie. После -er идёт als, после so идёт wie.',
	'Однаково: so groß wie. Не однаково: nicht so groß wie. Після -er іде als, після so іде wie.',
	'Equal: so groß wie. Not equal: nicht so groß wie. After -er use als, after so use wie.',
	'Tak samo: so groß wie. Nie tak samo: nicht so groß wie. Po -er idzie als, po so idzie wie.',
	'Igual: so groß wie. No igual: nicht so groß wie. Tras -er va als, tras so va wie.',
	'Égalité : so groß wie. Pas autant : nicht so groß wie. Après -er on met als, après so on met wie.',
	'Eşit: so groß wie. Eşit değil: nicht so groß wie. -er’den sonra als, so’dan sonra wie.',
	'La fel: so groß wie. Nu la fel: nicht so groß wie. După -er vine als, după so vine wie.',
	"Bir xil: so groß wie. Bir xil emas: nicht so groß wie. -er dan keyin als, so dan keyin wie.",
	'बराबर: so groß wie। बराबर नहीं: nicht so groß wie। -er के बाद als, so के बाद wie।',
	'التساوي: so groß wie. وعدم التساوي: nicht so groß wie. بعد -er نستعمل als، وبعد so نستعمل wie.'
], [ex('Ich bin so groß wie mein Vater.', t11('Я такого же роста, как папа.', 'Я такого ж зросту, як тато.', 'I’m as tall as my father.', 'Jestem tak wysoki jak tata.', 'Soy tan alto como mi padre.', 'Je suis aussi grand que mon père.', 'Babam kadar uzunum.', 'Sunt la fel de înalt ca tata.', "Men otamdek bo'yliman.", 'मैं अपने पिता जितना लंबा हूँ।', 'أنا بطول أبي.'))])

const amStenPoint = pt(['am ...sten: лучше всех', 'am ...sten: найкраще', 'am ...sten: the most', 'am ...sten: najbardziej', 'am ...sten: lo más', 'am ...sten : le plus', 'am ...sten: en çok', 'am ...sten: cel mai', 'am ...sten: eng', 'am ...sten: सबसे', 'am ...sten: الأكثر'], [
	'Превосходная степень после глагола: am schnellsten, am ältesten. Особые: am besten, am meisten, am liebsten.',
	'Найвищий ступінь після дієслова: am schnellsten, am ältesten. Особливі: am besten, am meisten, am liebsten.',
	'Superlative after the verb: am schnellsten, am ältesten. Irregular: am besten, am meisten, am liebsten.',
	'Stopień najwyższy po czasowniku: am schnellsten, am ältesten. Szczególne: am besten, am meisten, am liebsten.',
	'Superlativo tras el verbo: am schnellsten, am ältesten. Especiales: am besten, am meisten, am liebsten.',
	'Superlatif après le verbe : am schnellsten, am ältesten. Irréguliers : am besten, am meisten, am liebsten.',
	'Fiilden sonra en üstünlük: am schnellsten, am ältesten. Özel: am besten, am meisten, am liebsten.',
	'Superlativul după verb: am schnellsten, am ältesten. Speciale: am besten, am meisten, am liebsten.',
	"Fe'ldan keyin orttirma daraja: am schnellsten, am ältesten. Alohida: am besten, am meisten, am liebsten.",
	'क्रिया के बाद सर्वोत्तम रूप: am schnellsten, am ältesten। खास: am besten, am meisten, am liebsten।',
	'صيغة التفضيل بعد الفعل: am schnellsten، am ältesten. والخاصة: am besten، am meisten، am liebsten.'
], [ex('Anna singt am besten.', t11('Анна поёт лучше всех.', 'Анна співає найкраще.', 'Anna sings best.', 'Anna śpiewa najlepiej.', 'Anna canta mejor que nadie.', 'C’est Anna qui chante le mieux.', 'En iyi Anna şarkı söylüyor.', 'Anna cântă cel mai bine.', 'Anna hammadan yaxshi kuylaydi.', 'अन्ना सबसे अच्छा गाती है।', 'آنا تغني أفضل من الجميع.'))])

const steNounPoint = pt(['der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug', 'der schnellste Zug'], [
	'Перед существительным: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'Перед іменником: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'Before a noun: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'Przed rzeczownikiem: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'Delante del sustantivo: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'Devant un nom : der/die/das + -ste : der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'İsimden önce: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	'Înaintea substantivului: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.',
	"Otdan oldin: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant.",
	'संज्ञा से पहले: der/die/das + -ste: der schnellste Zug, die größte Stadt, das beste Restaurant।',
	'قبل الاسم: der/die/das + -ste: der schnellste Zug، die größte Stadt، das beste Restaurant.'
], [ex('Das ist die schönste Straße.', t11('Это самая красивая улица.', 'Це найгарніша вулиця.', 'This is the most beautiful street.', 'To najpiękniejsza ulica.', 'Es la calle más bonita.', 'C’est la plus belle rue.', 'Bu en güzel cadde.', 'E cea mai frumoasă stradă.', "Bu eng chiroyli ko'cha.", 'यह सबसे सुंदर सड़क है।', 'هذا أجمل شارع.'))])

const quests = {
	'comparison-hills-one': { title: t11('Быстрее и медленнее', 'Швидше й повільніше', 'Faster and slower', 'Szybciej i wolniej', 'Más rápido y más lento', 'Plus vite et plus lentement', 'Daha hızlı ve daha yavaş', 'Mai repede și mai încet', 'Tezroq va sekinroq', 'तेज़ और धीमा', 'أسرع وأبطأ'), points: [erPoint] },
	'comparison-hills-two': { title: t11('Старше и моложе: умлаут', 'Старший і молодший: умлаут', 'Older and younger: umlaut', 'Starszy i młodszy: umlaut', 'Mayor y menor: diéresis', 'Plus âgé et plus jeune : umlaut', 'Daha büyük ve daha küçük: umlaut', 'Mai mare și mai mic: umlaut', 'Kattaroq va kichikroq: umlaut', 'बड़ा और छोटा: उमलाउट', 'أكبر وأصغر: الأوملاوت'), points: [erPoint] },
	'comparison-hills-three': { title: t11('Лучше, чем: als', 'Краще, ніж: als', 'Better than: als', 'Lepszy niż: als', 'Mejor que: als', 'Meilleur que : als', '... -den daha iyi: als', 'Mai bun decât: als', "...dan yaxshiroq: als", 'से बेहतर: als', 'أفضل من: als'), points: [alsPoint] },
	'comparison-hills-four': { title: t11('Такой же, как: so ... wie', 'Такий самий, як: so ... wie', 'As ... as: so ... wie', 'Taki sam jak: so ... wie', 'Tan ... como: so ... wie', 'Aussi ... que : so ... wie', '... kadar: so ... wie', 'La fel de ... ca: so ... wie', '... dek: so ... wie', '... जितना: so ... wie', 'بقدر: so ... wie'), points: [soWiePoint] },
	'comparison-hills-five': { title: t11('Лучше всех: am ...sten', 'Найкраще: am ...sten', 'The best: am ...sten', 'Najlepiej: am ...sten', 'Lo mejor: am ...sten', 'Le mieux : am ...sten', 'En iyi: am ...sten', 'Cel mai bine: am ...sten', 'Eng yaxshi: am ...sten', 'सबसे अच्छा: am ...sten', 'الأفضل: am ...sten'), points: [amStenPoint] },
	'comparison-hills-six': { title: t11('Самый высокий в мире', 'Найвищий у світі', 'The tallest in the world', 'Najwyższy na świecie', 'El más alto del mundo', 'Le plus haut du monde', 'Dünyanın en yükseği', 'Cel mai înalt din lume', 'Dunyodagi eng baland', 'दुनिया में सबसे ऊँचा', 'الأعلى في العالم'), points: [steNounPoint] },
	'comparison-hills-seven': { title: t11('Практика: в магазине одежды', 'Практика: у магазині одягу', 'Practice: in a clothes shop', 'Praktyka: w sklepie z ubraniami', 'Práctica: en una tienda de ropa', 'Pratique : dans un magasin de vêtements', 'Pratik: giyim mağazasında', 'Practică: în magazinul de haine', "Mashq: kiyim do'konida", 'अभ्यास: कपड़ों की दुकान में', 'تدريب: في متجر الملابس'), points: [alsPoint, soWiePoint] },
	'comparison-hills-eight': { title: t11('Практика: лучший город', 'Практика: найкраще місто', 'Practice: the best city', 'Praktyka: najlepsze miasto', 'Práctica: la mejor ciudad', 'Pratique : la meilleure ville', 'Pratik: en iyi şehir', 'Practică: cel mai bun oraș', 'Mashq: eng yaxshi shahar', 'अभ्यास: सबसे अच्छा शहर', 'تدريب: أفضل مدينة'), points: [amStenPoint, steNounPoint] },
	'comparison-hills-nine': { title: t11('Повторение: сравнение', 'Повторення: порівняння', 'Review: comparison', 'Powtórka: porównanie', 'Repaso: comparación', 'Révision : la comparaison', 'Tekrar: karşılaştırma', 'Recapitulare: comparația', 'Takrorlash: qiyoslash', 'दोहराव: तुलना', 'مراجعة: المقارنة'), points: [alsPoint, soWiePoint, amStenPoint] },
	'comparison-hills-ten': { title: finalTitle, points: [erPoint, alsPoint, amStenPoint] }
}

module.exports = quests
