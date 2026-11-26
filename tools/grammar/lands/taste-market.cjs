// Грамматика к заданиям земли taste-market (прилагательные без артикля)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const nomPoint = pt(['Без артикля: guter Kaffee', 'Без артикля: guter Kaffee', 'No article: guter Kaffee', 'Bez rodzajnika: guter Kaffee', 'Sin artículo: guter Kaffee', 'Sans article : guter Kaffee', 'Artikelsiz: guter Kaffee', 'Fără articol: guter Kaffee', 'Artiklsiz: guter Kaffee', 'बिना आर्टिकल: guter Kaffee', 'بدون أداة: guter Kaffee'], [
	'Если артикля нет, его окончание берёт прилагательное: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (мн. ч.).',
	'Якщо артикля немає, його закінчення бере прикметник: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (множина).',
	'With no article, the adjective takes the article’s ending: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (plural).',
	'Gdy nie ma rodzajnika, jego końcówkę bierze przymiotnik: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (mnoga).',
	'Sin artículo, el adjetivo toma la terminación del artículo: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (plural).',
	'Sans article, l’adjectif prend la terminaison de l’article : guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (pluriel).',
	'Artikel yoksa onun ekini sıfat alır: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (çoğul).',
	'Fără articol, adjectivul ia terminația articolului: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (plural).',
	"Artikl bo'lmasa, uning qo'shimchasini sifat oladi: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (ko'plik).",
	'आर्टिकल न हो तो उसका अंत विशेषण लेता है: guter Kaffee (der), frische Milch (die), kaltes Wasser (das), frische Brötchen (बहुवचन)।',
	'إذا لم توجد أداة تأخذ الصفة نهايتها: guter Kaffee (der)، frische Milch (die)، kaltes Wasser (das)، frische Brötchen (جمع).'
], [ex('Heißer Kaffee schmeckt gut.', t11('Горячий кофе вкусный.', 'Гаряча кава смачна.', 'Hot coffee tastes good.', 'Gorąca kawa dobrze smakuje.', 'El café caliente está rico.', 'Le café chaud est bon.', 'Sıcak kahve güzel olur.', 'Cafeaua fierbinte e bună.', 'Issiq qahva mazali.', 'गरम कॉफ़ी अच्छी लगती है।', 'القهوة الساخنة لذيذة.'))])

const akkPoint = pt(['Akkusativ: heißen Tee', 'Akkusativ: heißen Tee', 'Accusative: heißen Tee', 'Akkusativ: heißen Tee', 'Acusativo: heißen Tee', 'Accusatif : heißen Tee', 'Akkusativ: heißen Tee', 'Acuzativ: heißen Tee', 'Akkusativ: heißen Tee', 'Akkusativ: heißen Tee', 'المفعول: heißen Tee'], [
	'В Akkusativ меняется только мужской род: -en, как den. Остальные как в Nominativ.',
	'В Akkusativ змінюється лише чоловічий рід: -en, як den. Решта як у Nominativ.',
	'In the accusative only masculine changes: -en, like den. The rest stay as in the nominative.',
	'W Akkusativ zmienia się tylko rodzaj męski: -en, jak den. Reszta jak w Nominativ.',
	'En acusativo solo cambia el masculino: -en, como den. Lo demás, igual que en nominativo.',
	'À l’accusatif, seul le masculin change : -en, comme den. Le reste comme au nominatif.',
	'Akkusativ’de sadece eril değişir: den gibi -en. Diğerleri Nominativ’deki gibi.',
	'La acuzativ se schimbă doar masculinul: -en, ca den. Restul ca la nominativ.',
	"Akkusativda faqat erkak rodi o'zgaradi: den kabi -en. Qolganlari Nominativdagidek.",
	'Akkusativ में सिर्फ़ पुल्लिंग बदलता है: den की तरह -en। बाकी Nominativ जैसे।',
	'في حالة المفعول يتغير المذكر فقط: -en مثل den. والباقي كما في الرفع.'
], [ex('Ich trinke heißen Tee.', t11('Я пью горячий чай.', 'Я п’ю гарячий чай.', 'I drink hot tea.', 'Piję gorącą herbatę.', 'Bebo té caliente.', 'Je bois du thé chaud.', 'Sıcak çay içiyorum.', 'Beau ceai fierbinte.', 'Issiq choy ichaman.', 'मैं गरम चाय पीता हूँ।', 'أشرب شاياً ساخناً.'))])

const datPoint = pt(['Dativ: mit heißem Wasser', 'Dativ: mit heißem Wasser', 'Dative: mit heißem Wasser', 'Dativ: mit heißem Wasser', 'Dativo: mit heißem Wasser', 'Datif : mit heißem Wasser', 'Dativ: mit heißem Wasser', 'Dativ: mit heißem Wasser', 'Dativ: mit heißem Wasser', 'Dativ: mit heißem Wasser', 'الجر: mit heißem Wasser'], [
	'В Dativ: -em (мужской и средний), -er (женский), -en (множественное), как dem, der, den.',
	'У Dativ: -em (чоловічий і середній), -er (жіночий), -en (множина), як dem, der, den.',
	'In the dative: -em (masculine and neuter), -er (feminine), -en (plural), like dem, der, den.',
	'W Dativ: -em (męski i nijaki), -er (żeński), -en (mnoga), jak dem, der, den.',
	'En dativo: -em (masculino y neutro), -er (femenino), -en (plural), como dem, der, den.',
	'Au datif : -em (masculin et neutre), -er (féminin), -en (pluriel), comme dem, der, den.',
	'Dativ’de: -em (eril ve nötr), -er (dişil), -en (çoğul), dem, der, den gibi.',
	'La dativ: -em (masculin și neutru), -er (feminin), -en (plural), ca dem, der, den.',
	"Dativda: -em (erkak va o'rta), -er (ayol), -en (ko'plik), dem, der, den kabi.",
	'Dativ में: -em (पुल्लिंग और नपुंसकलिंग), -er (स्त्रीलिंग), -en (बहुवचन), dem, der, den की तरह।',
	'في الجر: -em (المذكر والمحايد)، -er (المؤنث)، -en (الجمع)، مثل dem وder وden.'
], [ex('Ich trinke Kaffee mit heißer Milch.', t11('Я пью кофе с горячим молоком.', 'Я п’ю каву з гарячим молоком.', 'I drink coffee with hot milk.', 'Piję kawę z gorącym mlekiem.', 'Tomo café con leche caliente.', 'Je bois du café avec du lait chaud.', 'Kahveyi sıcak sütle içerim.', 'Beau cafea cu lapte fierbinte.', "Qahvani issiq sut bilan ichaman.", 'मैं गरम दूध के साथ कॉफ़ी पीता हूँ।', 'أشرب القهوة بالحليب الساخن.'))])

const vielePoint = pt(['viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele, zwei + -e', 'viele وzwei + -e'], [
	'После чисел, viele, einige, wenige артикля нет, окончание даёт прилагательное: viele junge Leute. В Dativ -en: mit vielen jungen Gästen.',
	'Після чисел, viele, einige, wenige артикля немає, закінчення дає прикметник: viele junge Leute. У Dativ -en: mit vielen jungen Gästen.',
	'After numbers, viele, einige, wenige there’s no article, so the adjective shows the ending: viele junge Leute. Dative -en: mit vielen jungen Gästen.',
	'Po liczebnikach, viele, einige, wenige nie ma rodzajnika, końcówkę daje przymiotnik: viele junge Leute. W Dativ -en: mit vielen jungen Gästen.',
	'Tras números, viele, einige, wenige no hay artículo y la terminación la da el adjetivo: viele junge Leute. En dativo -en: mit vielen jungen Gästen.',
	'Après les nombres, viele, einige, wenige, pas d’article : l’adjectif porte la terminaison : viele junge Leute. Au datif -en : mit vielen jungen Gästen.',
	'Sayılar, viele, einige, wenige’den sonra artikel yok, eki sıfat taşır: viele junge Leute. Dativ’de -en: mit vielen jungen Gästen.',
	'După numerale, viele, einige, wenige nu e articol, terminația o dă adjectivul: viele junge Leute. La dativ -en: mit vielen jungen Gästen.',
	"Sonlar, viele, einige, wenige dan keyin artikl yo'q, qo'shimchani sifat beradi: viele junge Leute. Dativda -en: mit vielen jungen Gästen.",
	'संख्याओं, viele, einige, wenige के बाद आर्टिकल नहीं, अंत विशेषण देता है: viele junge Leute। Dativ में -en: mit vielen jungen Gästen।',
	'بعد الأعداد وviele وeinige وwenige لا توجد أداة فتأخذ الصفة النهاية: viele junge Leute. وفي الجر -en: mit vielen jungen Gästen.'
], [ex('In der Stadt gibt es viele junge Leute.', t11('В городе много молодых людей.', 'У місті багато молодих людей.', 'There are many young people in the city.', 'W mieście jest wielu młodych ludzi.', 'En la ciudad hay mucha gente joven.', 'En ville, il y a beaucoup de jeunes.', 'Şehirde çok genç insan var.', 'În oraș sunt mulți tineri.', "Shaharda yoshlar ko'p.", 'शहर में बहुत युवा लोग हैं।', 'في المدينة شباب كثيرون.'))])

const genAdsPoint = pt(['Genitiv и объявления', 'Genitiv і оголошення', 'Genitive and ads', 'Genitiv i ogłoszenia', 'Genitivo y anuncios', 'Génitif et annonces', 'Genitiv ve ilanlar', 'Genitiv și anunțuri', "Genitiv va e'lonlar", 'Genitiv और विज्ञापन', 'الإضافة والإعلانات'], [
	'Genitiv без артикля: -en у прилагательного и -s у слова: wegen schlechten Wetters. В объявлениях и меню артикль опускают: Verkaufe altes Fahrrad.',
	'Genitiv без артикля: -en у прикметника і -s у слова: wegen schlechten Wetters. В оголошеннях і меню артикль опускають: Verkaufe altes Fahrrad.',
	'Genitive with no article: -en on the adjective and -s on the noun: wegen schlechten Wetters. Ads and menus drop the article: Verkaufe altes Fahrrad.',
	'Genitiv bez rodzajnika: -en w przymiotniku i -s w słowie: wegen schlechten Wetters. W ogłoszeniach i menu rodzajnik się pomija: Verkaufe altes Fahrrad.',
	'Genitivo sin artículo: -en en el adjetivo y -s en el sustantivo: wegen schlechten Wetters. En anuncios y menús se omite el artículo: Verkaufe altes Fahrrad.',
	'Génitif sans article : -en sur l’adjectif et -s sur le nom : wegen schlechten Wetters. Dans les annonces et menus, on omet l’article : Verkaufe altes Fahrrad.',
	'Artikelsiz Genitiv: sıfatta -en, isimde -s: wegen schlechten Wetters. İlan ve menülerde artikel atılır: Verkaufe altes Fahrrad.',
	'Genitiv fără articol: -en la adjectiv și -s la substantiv: wegen schlechten Wetters. În anunțuri și meniuri articolul lipsește: Verkaufe altes Fahrrad.',
	"Artiklsiz Genitiv: sifatda -en, otda -s: wegen schlechten Wetters. E'lon va menyularda artikl tushib qoladi: Verkaufe altes Fahrrad.",
	'बिना आर्टिकल Genitiv: विशेषण में -en और संज्ञा में -s: wegen schlechten Wetters। विज्ञापनों और मेन्यू में आर्टिकल हटाते हैं: Verkaufe altes Fahrrad।',
	'الإضافة بدون أداة: -en على الصفة و-s على الاسم: wegen schlechten Wetters. وفي الإعلانات والقوائم تُحذف الأداة: Verkaufe altes Fahrrad.'
], [ex('Wegen schlechten Wetters kam der Zug zu spät.', t11('Из-за плохой погоды поезд опоздал.', 'Через погану погоду потяг запізнився.', 'Because of bad weather the train was late.', 'Z powodu złej pogody pociąg się spóźnił.', 'Por el mal tiempo el tren llegó tarde.', 'À cause du mauvais temps, le train était en retard.', 'Kötü hava yüzünden tren geç kaldı.', 'Din cauza vremii proaste trenul a întârziat.', "Yomon ob-havo sababli poyezd kechikdi.", 'खराब मौसम की वजह से ट्रेन देर से आई।', 'بسبب الطقس السيئ تأخر القطار.'))])

const T = (...v) => t11(...v)
const quests = {
	'taste-market-one': { title: T('Свежий хлеб', 'Свіжий хліб', 'Fresh bread', 'Świeży chleb', 'Pan fresco', 'Pain frais', 'Taze ekmek', 'Pâine proaspătă', 'Yangi non', 'ताज़ी रोटी', 'خبز طازج'), points: [nomPoint] },
	'taste-market-two': { title: T('Пью горячий чай', 'П’ю гарячий чай', 'I drink hot tea', 'Piję gorącą herbatę', 'Bebo té caliente', 'Je bois du thé chaud', 'Sıcak çay içiyorum', 'Beau ceai fierbinte', 'Issiq choy ichaman', 'गरम चाय पीता हूँ', 'أشرب شاياً ساخناً'), points: [akkPoint] },
	'taste-market-three': { title: T('С горячим молоком', 'З гарячим молоком', 'With hot milk', 'Z gorącym mlekiem', 'Con leche caliente', 'Avec du lait chaud', 'Sıcak sütle', 'Cu lapte fierbinte', 'Issiq sut bilan', 'गरम दूध के साथ', 'بالحليب الساخن'), points: [datPoint] },
	'taste-market-four': { title: T('Много молодых людей', 'Багато молодих людей', 'Many young people', 'Wielu młodych ludzi', 'Mucha gente joven', 'Beaucoup de jeunes', 'Çok genç insan', 'Mulți tineri', "Ko'p yoshlar", 'बहुत युवा लोग', 'شباب كثيرون'), points: [vielePoint] },
	'taste-market-five': { title: T('Из-за плохой погоды', 'Через погану погоду', 'Because of bad weather', 'Z powodu złej pogody', 'Por el mal tiempo', 'À cause du mauvais temps', 'Kötü hava yüzünden', 'Din cauza vremii proaste', 'Yomon ob-havo sababli', 'खराब मौसम की वजह से', 'بسبب الطقس السيئ'), points: [genAdsPoint] },
	'taste-market-six': { title: T('Объявления и меню', 'Оголошення і меню', 'Ads and menus', 'Ogłoszenia i menu', 'Anuncios y menús', 'Annonces et menus', 'İlanlar ve menüler', 'Anunțuri și meniuri', "E'lonlar va menyular", 'विज्ञापन और मेन्यू', 'الإعلانات والقوائم'), points: [genAdsPoint, nomPoint] },
	'taste-market-seven': { title: T('Практика: рецепт', 'Практика: рецепт', 'Practice: a recipe', 'Praktyka: przepis', 'Práctica: una receta', 'Pratique : une recette', 'Pratik: tarif', 'Practică: o rețetă', 'Mashq: retsept', 'अभ्यास: रेसिपी', 'تدريب: وصفة'), points: [nomPoint, datPoint] },
	'taste-market-eight': { title: T('Практика: отзывы о кафе', 'Практика: відгуки про кафе', 'Practice: café reviews', 'Praktyka: opinie o kawiarni', 'Práctica: reseñas del café', 'Pratique : avis sur un café', 'Pratik: kafe yorumları', 'Practică: recenzii la cafenea', 'Mashq: kafe haqida fikrlar', 'अभ्यास: कैफ़े की समीक्षाएँ', 'تدريب: آراء عن المقهى'), points: [vielePoint, genAdsPoint] },
	'taste-market-nine': { title: T('Повторение: без артикля', 'Повторення: без артикля', 'Review: no article', 'Powtórka: bez rodzajnika', 'Repaso: sin artículo', 'Révision : sans article', 'Tekrar: artikelsiz', 'Recapitulare: fără articol', 'Takrorlash: artiklsiz', 'दोहराव: बिना आर्टिकल', 'مراجعة: بدون أداة'), points: [nomPoint, akkPoint, datPoint] },
	'taste-market-ten': { title: finalTitle, points: [nomPoint, datPoint, vielePoint] }
}

module.exports = quests
