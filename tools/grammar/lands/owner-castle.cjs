// Грамматика к заданиям земли owner-castle (Genitiv, wegen, trotz, während)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const desPoint = pt(['des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s, der', 'des + -s وder'], [
	'Genitiv отвечает на вопрос «чей?» и стоит после слова. Мужской и средний род: des + -s/-es у слова (des Vaters). Женский и множественное: der, без -s (der Frau, der Kinder).',
	'Genitiv відповідає на питання «чий?» і стоїть після слова. Чоловічий і середній рід: des + -s/-es у слова (des Vaters). Жіночий і множина: der, без -s (der Frau, der Kinder).',
	'The genitive answers "whose?" and comes after the noun. Masculine and neuter: des + -s/-es on the noun (des Vaters). Feminine and plural: der, no -s (der Frau, der Kinder).',
	'Genitiv odpowiada na pytanie „czyj?” i stoi po słowie. Rodzaj męski i nijaki: des + -s/-es (des Vaters). Żeński i mnoga: der, bez -s (der Frau, der Kinder).',
	'El genitivo responde a "¿de quién?" y va después del sustantivo. Masculino y neutro: des + -s/-es (des Vaters). Femenino y plural: der, sin -s (der Frau, der Kinder).',
	'Le génitif répond à « à qui ? » et vient après le nom. Masculin et neutre : des + -s/-es (des Vaters). Féminin et pluriel : der, sans -s (der Frau, der Kinder).',
	'Genitiv "kimin?" sorusuna cevap verir ve isimden sonra gelir. Eril ve nötr: des + -s/-es (des Vaters). Dişil ve çoğul: der, -s yok (der Frau, der Kinder).',
	'Genitivul răspunde la „al cui?” și vine după substantiv. Masculin și neutru: des + -s/-es (des Vaters). Feminin și plural: der, fără -s (der Frau, der Kinder).',
	"Genitiv \"kimning?\" savoliga javob beradi va otdan keyin turadi. Erkak va o'rta rod: des + -s/-es (des Vaters). Ayol va ko'plik: der, -s siz (der Frau, der Kinder).",
	'Genitiv "किसका?" का जवाब है और संज्ञा के बाद आता है। पुल्लिंग और नपुंसकलिंग: des + -s/-es (des Vaters)। स्त्रीलिंग और बहुवचन: der, बिना -s (der Frau, der Kinder)।',
	'الإضافة (Genitiv) تجيب عن "لمن؟" وتأتي بعد الاسم. المذكر والمحايد: des + -s/-es (des Vaters). والمؤنث والجمع: der بدون -s (der Frau، der Kinder).'
], [
	ex('Das Auto des Vaters ist neu.', t11('Машина отца новая.', 'Машина батька нова.', 'The father’s car is new.', 'Samochód ojca jest nowy.', 'El coche del padre es nuevo.', 'La voiture du père est neuve.', 'Babanın arabası yeni.', 'Mașina tatălui e nouă.', 'Otaning mashinasi yangi.', 'पिता की गाड़ी नई है।', 'سيارة الأب جديدة.')),
	ex('Die Tasche der Frau liegt auf dem Tisch.', t11('Сумка женщины лежит на столе.', 'Сумка жінки лежить на столі.', 'The woman’s bag is on the table.', 'Torba kobiety leży na stole.', 'El bolso de la mujer está en la mesa.', 'Le sac de la femme est sur la table.', 'Kadının çantası masada.', 'Geanta femeii e pe masă.', 'Ayolning sumkasi stol ustida.', 'महिला का थैला मेज़ पर है।', 'حقيبة المرأة على الطاولة.'))
])

const meinesPoint = pt(['meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines, meiner', 'meines وmeiner'], [
	'С mein, ein так же: meines/eines + -s для мужского и среднего, meiner/einer для женского, meiner для множественного.',
	'З mein, ein так само: meines/eines + -s для чоловічого й середнього, meiner/einer для жіночого, meiner для множини.',
	'Same with mein, ein: meines/eines + -s for masculine and neuter, meiner/einer for feminine, meiner for plural.',
	'Z mein, ein tak samo: meines/eines + -s dla męskiego i nijakiego, meiner/einer dla żeńskiego, meiner dla mnogiej.',
	'Igual con mein, ein: meines/eines + -s para masculino y neutro, meiner/einer para femenino, meiner para plural.',
	'Pareil avec mein, ein : meines/eines + -s pour le masculin et le neutre, meiner/einer pour le féminin, meiner pour le pluriel.',
	'mein, ein ile de aynı: eril ve nötr için meines/eines + -s, dişil için meiner/einer, çoğul için meiner.',
	'La fel cu mein, ein: meines/eines + -s pentru masculin și neutru, meiner/einer pentru feminin, meiner pentru plural.',
	"mein, ein bilan ham shunday: erkak va o'rta rod uchun meines/eines + -s, ayol uchun meiner/einer, ko'plik uchun meiner.",
	'mein, ein के साथ भी: पुल्लिंग और नपुंसकलिंग के लिए meines/eines + -s, स्त्रीलिंग के लिए meiner/einer, बहुवचन के लिए meiner।',
	'وكذلك مع mein وein: meines/eines + -s للمذكر والمحايد، وmeiner/einer للمؤنث، وmeiner للجمع.'
], [ex('Das ist das Auto meines Bruders.', t11('Это машина моего брата.', 'Це машина мого брата.', 'This is my brother’s car.', 'To samochód mojego brata.', 'Este es el coche de mi hermano.', 'C’est la voiture de mon frère.', 'Bu erkek kardeşimin arabası.', 'Aceasta e mașina fratelui meu.', 'Bu akamning mashinasi.', 'यह मेरे भाई की गाड़ी है।', 'هذه سيارة أخي.'))])

const vonPoint = pt(['Annas Auto и von + Dativ', 'Annas Auto і von + Dativ', 'Annas Auto and von + dative', 'Annas Auto i von + Dativ', 'Annas Auto y von + dativo', 'Annas Auto et von + datif', 'Annas Auto ve von + Dativ', 'Annas Auto și von + dativ', 'Annas Auto va von + Dativ', 'Annas Auto और von + Dativ', 'Annas Auto وvon + الجر'], [
	'С именами -s без апострофа: Annas Auto. В разговоре вместо Genitiv часто von + Dativ: das Auto von meinem Vater.',
	'З іменами -s без апострофа: Annas Auto. У розмові замість Genitiv часто von + Dativ: das Auto von meinem Vater.',
	'With names, -s without an apostrophe: Annas Auto. In speech von + dative often replaces the genitive: das Auto von meinem Vater.',
	'Z imionami -s bez apostrofu: Annas Auto. W mowie zamiast Genitiv często von + Dativ: das Auto von meinem Vater.',
	'Con nombres, -s sin apóstrofo: Annas Auto. Al hablar se usa a menudo von + dativo: das Auto von meinem Vater.',
	'Avec les prénoms, -s sans apostrophe : Annas Auto. À l’oral, on dit souvent von + datif : das Auto von meinem Vater.',
	'İsimlerle kesme işaretsiz -s: Annas Auto. Konuşmada Genitiv yerine çoğu zaman von + Dativ: das Auto von meinem Vater.',
	'Cu nume, -s fără apostrof: Annas Auto. În vorbire se folosește des von + dativ: das Auto von meinem Vater.',
	"Ismlar bilan apostrofsiz -s: Annas Auto. Suhbatda Genitiv o'rniga ko'pincha von + Dativ: das Auto von meinem Vater.",
	'नामों के साथ बिना अपॉस्ट्रॉफ़ी -s: Annas Auto। बोलचाल में Genitiv की जगह अक्सर von + Dativ: das Auto von meinem Vater।',
	'مع الأسماء -s بدون فاصلة علوية: Annas Auto. وفي الكلام يُستعمل غالباً von + الجر: das Auto von meinem Vater.'
], [ex('Annas Auto ist rot.', t11('Машина Анны красная.', 'Машина Анни червона.', 'Anna’s car is red.', 'Samochód Anny jest czerwony.', 'El coche de Anna es rojo.', 'La voiture d’Anna est rouge.', 'Anna’nın arabası kırmızı.', 'Mașina Annei e roșie.', 'Annaning mashinasi qizil.', 'अन्ना की गाड़ी लाल है।', 'سيارة آنا حمراء.'))])

const wegenPoint = pt(['wegen, trotz, während + Genitiv', 'wegen, trotz, während + Genitiv', 'wegen, trotz, während + genitive', 'wegen, trotz, während + Genitiv', 'wegen, trotz, während + genitivo', 'wegen, trotz, während + génitif', 'wegen, trotz, während + Genitiv', 'wegen, trotz, während + genitiv', 'wegen, trotz, während + Genitiv', 'wegen, trotz, während + Genitiv', 'wegen وtrotz وwährend + الإضافة'], [
	'wegen (из-за), trotz (несмотря на), während (во время) + Genitiv. wegen des Regens короче, чем weil es regnet.',
	'wegen (через), trotz (незважаючи на), während (під час) + Genitiv. wegen des Regens коротше, ніж weil es regnet.',
	'wegen (because of), trotz (despite), während (during) + genitive. wegen des Regens is shorter than weil es regnet.',
	'wegen (z powodu), trotz (mimo), während (podczas) + Genitiv. wegen des Regens jest krótsze niż weil es regnet.',
	'wegen (por), trotz (a pesar de), während (durante) + genitivo. wegen des Regens es más corto que weil es regnet.',
	'wegen (à cause de), trotz (malgré), während (pendant) + génitif. wegen des Regens est plus court que weil es regnet.',
	'wegen (yüzünden), trotz (rağmen), während (sırasında) + Genitiv. wegen des Regens, weil es regnet’ten daha kısadır.',
	'wegen (din cauza), trotz (în ciuda), während (în timpul) + genitiv. wegen des Regens e mai scurt decât weil es regnet.',
	"wegen (sababli), trotz (qaramay), während (davomida) + Genitiv. wegen des Regens weil es regnet dan qisqaroq.",
	'wegen (की वजह से), trotz (के बावजूद), während (के दौरान) + Genitiv। wegen des Regens, weil es regnet से छोटा है।',
	'wegen (بسبب)، trotz (رغم)، während (أثناء) + الإضافة. وwegen des Regens أقصر من weil es regnet.'
], [
	ex('Wegen des Regens sind wir zu Hause geblieben.', t11('Из-за дождя мы остались дома.', 'Через дощ ми залишилися вдома.', 'Because of the rain we stayed at home.', 'Z powodu deszczu zostaliśmy w domu.', 'Por la lluvia nos quedamos en casa.', 'À cause de la pluie, nous sommes restés à la maison.', 'Yağmur yüzünden evde kaldık.', 'Din cauza ploii am rămas acasă.', "Yomg'ir sababli uyda qoldik.", 'बारिश की वजह से हम घर पर रहे।', 'بسبب المطر بقينا في البيت.')),
	ex('Trotz des Regens sind wir spazieren gegangen.', t11('Несмотря на дождь, мы пошли гулять.', 'Незважаючи на дощ, ми пішли гуляти.', 'Despite the rain we went for a walk.', 'Mimo deszczu poszliśmy na spacer.', 'A pesar de la lluvia, fuimos a pasear.', 'Malgré la pluie, nous sommes allés nous promener.', 'Yağmura rağmen yürüyüşe çıktık.', 'În ciuda ploii am ieșit la plimbare.', "Yomg'irga qaramay sayrga chiqdik.", 'बारिश के बावजूद हम टहलने गए।', 'رغم المطر خرجنا للتنزه.'))
])

const T = (...v) => t11(...v)
const quests = {
	'owner-castle-one': { title: T('Чей? des', 'Чий? des', 'Whose? des', 'Czyj? des', '¿De quién? des', 'À qui ? des', 'Kimin? des', 'Al cui? des', 'Kimning? des', 'किसका? des', 'لمن؟ des'), points: [desPoint] },
	'owner-castle-two': { title: T('Чей? der', 'Чий? der', 'Whose? der', 'Czyj? der', '¿De quién? der', 'À qui ? der', 'Kimin? der', 'Al cui? der', 'Kimning? der', 'किसका? der', 'لمن؟ der'), points: [desPoint] },
	'owner-castle-three': { title: T('Моего, моей: meines, meiner', 'Мого, моєї: meines, meiner', 'My: meines, meiner', 'Mojego, mojej: meines, meiner', 'De mi: meines, meiner', 'De mon, de ma : meines, meiner', 'Benim: meines, meiner', 'Al meu: meines, meiner', 'Mening: meines, meiner', 'मेरा: meines, meiner', 'لي: meines وmeiner'), points: [meinesPoint] },
	'owner-castle-four': { title: T('Annas Auto и von', 'Annas Auto і von', 'Annas Auto and von', 'Annas Auto i von', 'Annas Auto y von', 'Annas Auto et von', 'Annas Auto ve von', 'Annas Auto și von', 'Annas Auto va von', 'Annas Auto और von', 'Annas Auto وvon'), points: [vonPoint] },
	'owner-castle-five': { title: T('Из-за: wegen', 'Через: wegen', 'Because of: wegen', 'Z powodu: wegen', 'Por: wegen', 'À cause de : wegen', 'Yüzünden: wegen', 'Din cauza: wegen', 'Sababli: wegen', 'की वजह से: wegen', 'بسبب: wegen'), points: [wegenPoint] },
	'owner-castle-six': { title: T('Несмотря на, во время', 'Незважаючи на, під час', 'Despite, during', 'Mimo, podczas', 'A pesar de, durante', 'Malgré, pendant', 'Rağmen, sırasında', 'În ciuda, în timpul', 'Qaramay, davomida', 'के बावजूद, के दौरान', 'رغم، أثناء'), points: [wegenPoint] },
	'owner-castle-seven': { title: T('Практика: в музее', 'Практика: у музеї', 'Practice: at the museum', 'Praktyka: w muzeum', 'Práctica: en el museo', 'Pratique : au musée', 'Pratik: müzede', 'Practică: la muzeu', 'Mashq: muzeyda', 'अभ्यास: संग्रहालय में', 'تدريب: في المتحف'), points: [desPoint, vonPoint] },
	'owner-castle-eight': { title: T('Практика: поездка в замок', 'Практика: поїздка до замку', 'Practice: a trip to the castle', 'Praktyka: wycieczka do zamku', 'Práctica: excursión al castillo', 'Pratique : visite du château', 'Pratik: kale gezisi', 'Practică: excursie la castel', "Mashq: qal'aga sayohat", 'अभ्यास: किले की सैर', 'تدريب: رحلة إلى القلعة'), points: [wegenPoint] },
	'owner-castle-nine': { title: T('Повторение: Genitiv', 'Повторення: Genitiv', 'Review: genitive', 'Powtórka: Genitiv', 'Repaso: genitivo', 'Révision : génitif', 'Tekrar: Genitiv', 'Recapitulare: genitiv', 'Takrorlash: Genitiv', 'दोहराव: Genitiv', 'مراجعة: الإضافة'), points: [desPoint, meinesPoint, wegenPoint] },
	'owner-castle-ten': { title: finalTitle, points: [desPoint, meinesPoint, wegenPoint] }
}

module.exports = quests
