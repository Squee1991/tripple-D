// Грамматика к заданиям земли word-forge (словообразование)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const ungPoint = pt(['Глагол + -ung', 'Дієслово + -ung', 'Verb + -ung', 'Czasownik + -ung', 'Verbo + -ung', 'Verbe + -ung', 'Fiil + -ung', 'Verb + -ung', "Fe'l + -ung", 'क्रिया + -ung', 'الفعل + -ung'], [
	'Основа глагола + -ung даёт существительное: einladen → die Einladung. Слова на -ung всегда die, во множественном -en.',
	'Основа дієслова + -ung дає іменник: einladen → die Einladung. Слова на -ung завжди die, у множині -en.',
	'Verb stem + -ung makes a noun: einladen → die Einladung. Words in -ung are always die, plural -en.',
	'Temat czasownika + -ung daje rzeczownik: einladen → die Einladung. Słowa na -ung zawsze die, w mnogiej -en.',
	'Raíz del verbo + -ung forma un sustantivo: einladen → die Einladung. Las palabras en -ung son siempre die, plural -en.',
	'Radical du verbe + -ung donne un nom : einladen → die Einladung. Les mots en -ung sont toujours die, pluriel -en.',
	'Fiil kökü + -ung isim yapar: einladen → die Einladung. -ung’lu kelimeler hep die, çoğulu -en.',
	'Rădăcina verbului + -ung dă un substantiv: einladen → die Einladung. Cuvintele în -ung sunt mereu die, plural -en.',
	"Fe'l o'zagi + -ung ot yasaydi: einladen → die Einladung. -ung bilan tugaganlar doim die, ko'plikda -en.",
	'क्रिया का मूल + -ung से संज्ञा बनती है: einladen → die Einladung। -ung वाले शब्द हमेशा die, बहुवचन -en।',
	'جذر الفعل + -ung يصنع اسماً: einladen → die Einladung. والكلمات المنتهية بـ -ung دائماً die، وجمعها -en.'
], [ex('Danke für die Einladung!', t11('Спасибо за приглашение!', 'Дякую за запрошення!', 'Thanks for the invitation!', 'Dziękuję za zaproszenie!', '¡Gracias por la invitación!', 'Merci pour l’invitation !', 'Davet için teşekkürler!', 'Mulțumesc pentru invitație!', 'Taklif uchun rahmat!', 'निमंत्रण के लिए धन्यवाद!', 'شكراً على الدعوة!'))])

const heitPoint = pt(['-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit, -keit', '-heit و-keit'], [
	'Прилагательное + -heit/-keit даёт существительное (всегда die): gesund → die Gesundheit. После -lich, -ig, -bar ставим -keit: möglich → die Möglichkeit.',
	'Прикметник + -heit/-keit дає іменник (завжди die): gesund → die Gesundheit. Після -lich, -ig, -bar ставимо -keit: möglich → die Möglichkeit.',
	'Adjective + -heit/-keit makes a noun (always die): gesund → die Gesundheit. After -lich, -ig, -bar use -keit: möglich → die Möglichkeit.',
	'Przymiotnik + -heit/-keit daje rzeczownik (zawsze die): gesund → die Gesundheit. Po -lich, -ig, -bar stawiamy -keit: möglich → die Möglichkeit.',
	'Adjetivo + -heit/-keit forma un sustantivo (siempre die): gesund → die Gesundheit. Tras -lich, -ig, -bar va -keit: möglich → die Möglichkeit.',
	'Adjectif + -heit/-keit donne un nom (toujours die) : gesund → die Gesundheit. Après -lich, -ig, -bar on met -keit : möglich → die Möglichkeit.',
	'Sıfat + -heit/-keit isim yapar (hep die): gesund → die Gesundheit. -lich, -ig, -bar’dan sonra -keit: möglich → die Möglichkeit.',
	'Adjectiv + -heit/-keit dă un substantiv (mereu die): gesund → die Gesundheit. După -lich, -ig, -bar punem -keit: möglich → die Möglichkeit.',
	"Sifat + -heit/-keit ot yasaydi (doim die): gesund → die Gesundheit. -lich, -ig, -bar dan keyin -keit: möglich → die Möglichkeit.",
	'विशेषण + -heit/-keit से संज्ञा (हमेशा die): gesund → die Gesundheit। -lich, -ig, -bar के बाद -keit: möglich → die Möglichkeit।',
	'الصفة + -heit/-keit تصنع اسماً (دائماً die): gesund → die Gesundheit. وبعد -lich و-ig و-bar نضع -keit: möglich → die Möglichkeit.'
], [ex('Die Gesundheit ist wichtiger als Geld.', t11('Здоровье важнее денег.', 'Здоров’я важливіше за гроші.', 'Health is more important than money.', 'Zdrowie jest ważniejsze niż pieniądze.', 'La salud es más importante que el dinero.', 'La santé est plus importante que l’argent.', 'Sağlık paradan daha önemli.', 'Sănătatea e mai importantă decât banii.', "Sog'liq puldan muhimroq.", 'सेहत पैसे से ज़्यादा ज़रूरी है।', 'الصحة أهم من المال.'))])

const lichPoint = pt(['-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich, -ig', '-lich و-ig'], [
	'Существительное + -lich/-ig даёт прилагательное. -lich часто с умлаутом: der Tag → täglich. -ig: die Sonne → sonnig.',
	'Іменник + -lich/-ig дає прикметник. -lich часто з умлаутом: der Tag → täglich. -ig: die Sonne → sonnig.',
	'Noun + -lich/-ig makes an adjective. -lich often adds an umlaut: der Tag → täglich. -ig: die Sonne → sonnig.',
	'Rzeczownik + -lich/-ig daje przymiotnik. -lich często z umlautem: der Tag → täglich. -ig: die Sonne → sonnig.',
	'Sustantivo + -lich/-ig forma un adjetivo. -lich suele llevar diéresis: der Tag → täglich. -ig: die Sonne → sonnig.',
	'Nom + -lich/-ig donne un adjectif. -lich prend souvent un umlaut : der Tag → täglich. -ig : die Sonne → sonnig.',
	'İsim + -lich/-ig sıfat yapar. -lich çoğu zaman umlautlu: der Tag → täglich. -ig: die Sonne → sonnig.',
	'Substantiv + -lich/-ig dă un adjectiv. -lich are des umlaut: der Tag → täglich. -ig: die Sonne → sonnig.',
	"Ot + -lich/-ig sifat yasaydi. -lich ko'pincha umlaut bilan: der Tag → täglich. -ig: die Sonne → sonnig.",
	'संज्ञा + -lich/-ig से विशेषण। -lich में अक्सर उमलाउट: der Tag → täglich। -ig: die Sonne → sonnig।',
	'الاسم + -lich/-ig يصنع صفة. و-lich غالباً مع أوملاوت: der Tag → täglich. و-ig: die Sonne → sonnig.'
], [ex('Ich jogge täglich eine halbe Stunde.', t11('Я каждый день бегаю полчаса.', 'Я щодня бігаю пів години.', 'I jog for half an hour every day.', 'Codziennie biegam pół godziny.', 'Corro media hora a diario.', 'Je cours une demi-heure tous les jours.', 'Her gün yarım saat koşuyorum.', 'Alerg zilnic o jumătate de oră.', 'Har kuni yarim soat yuguraman.', 'मैं रोज़ आधा घंटा जॉगिंग करता हूँ।', 'أركض نصف ساعة يومياً.'))])

const barPoint = pt(['-bar: можно сделать', '-bar: можна зробити', '-bar: can be done', '-bar: da się zrobić', '-bar: se puede hacer', '-bar : faisable', '-bar: yapılabilir', '-bar: se poate face', '-bar: qilsa bo‘ladi', '-bar: किया जा सकता है', '-bar: يمكن فعله'], [
	'Основа глагола + -bar значит «это можно сделать»: essen → essbar, erreichen → erreichbar.',
	'Основа дієслова + -bar означає «це можна зробити»: essen → essbar, erreichen → erreichbar.',
	'Verb stem + -bar means "can be done": essen → essbar, erreichen → erreichbar.',
	'Temat czasownika + -bar znaczy „da się to zrobić”: essen → essbar, erreichen → erreichbar.',
	'Raíz del verbo + -bar significa "se puede hacer": essen → essbar, erreichen → erreichbar.',
	'Radical du verbe + -bar veut dire « on peut le faire » : essen → essbar, erreichen → erreichbar.',
	'Fiil kökü + -bar "yapılabilir" demektir: essen → essbar, erreichen → erreichbar.',
	'Rădăcina verbului + -bar înseamnă „se poate face”: essen → essbar, erreichen → erreichbar.',
	"Fe'l o'zagi + -bar \"qilish mumkin\" degani: essen → essbar, erreichen → erreichbar.",
	'क्रिया का मूल + -bar मतलब "किया जा सकता है": essen → essbar, erreichen → erreichbar।',
	'جذر الفعل + -bar يعني "يمكن فعله": essen → essbar، erreichen → erreichbar.'
], [ex('Diese Pilze sind essbar.', t11('Эти грибы съедобные.', 'Ці гриби їстівні.', 'These mushrooms are edible.', 'Te grzyby są jadalne.', 'Estas setas son comestibles.', 'Ces champignons sont comestibles.', 'Bu mantarlar yenebilir.', 'Ciupercile acestea sunt comestibile.', "Bu qo'ziqorinlar yeyiladi.", 'ये मशरूम खाने लायक हैं।', 'هذا الفطر صالح للأكل.'))])

const unPoint = pt(['un-: наоборот', 'un-: навпаки', 'un-: the opposite', 'un-: odwrotnie', 'un-: lo contrario', 'un- : le contraire', 'un-: tersi', 'un-: opusul', 'un-: teskarisi', 'un-: उल्टा', 'un-: العكس'], [
	'un- + прилагательное даёт противоположное значение, пишется слитно: möglich → unmöglich, gesund → ungesund.',
	'un- + прикметник дає протилежне значення, пишеться разом: möglich → unmöglich, gesund → ungesund.',
	'un- + adjective gives the opposite meaning, written as one word: möglich → unmöglich, gesund → ungesund.',
	'un- + przymiotnik daje przeciwne znaczenie, pisze się łącznie: möglich → unmöglich, gesund → ungesund.',
	'un- + adjetivo da el significado contrario, se escribe junto: möglich → unmöglich, gesund → ungesund.',
	'un- + adjectif donne le sens contraire, en un seul mot : möglich → unmöglich, gesund → ungesund.',
	'un- + sıfat zıt anlam verir, bitişik yazılır: möglich → unmöglich, gesund → ungesund.',
	'un- + adjectiv dă sensul opus, se scrie legat: möglich → unmöglich, gesund → ungesund.',
	"un- + sifat teskari ma'no beradi, qo'shib yoziladi: möglich → unmöglich, gesund → ungesund.",
	'un- + विशेषण उल्टा अर्थ देता है, जोड़कर लिखते हैं: möglich → unmöglich, gesund → ungesund।',
	'un- + الصفة تعطي المعنى المعاكس وتُكتب متصلة: möglich → unmöglich، gesund → ungesund.'
], [ex('Das ist unmöglich!', t11('Это невозможно!', 'Це неможливо!', 'That’s impossible!', 'To niemożliwe!', '¡Es imposible!', 'C’est impossible !', 'Bu imkânsız!', 'E imposibil!', "Bu mumkin emas!", 'यह नामुमकिन है!', 'هذا مستحيل!'))])

const T = (...v) => t11(...v)
const quests = {
	'word-forge-one': { title: T('Из глагола: -ung', 'З дієслова: -ung', 'From a verb: -ung', 'Z czasownika: -ung', 'Del verbo: -ung', 'À partir d’un verbe : -ung', 'Fiilden: -ung', 'Din verb: -ung', "Fe'ldan: -ung", 'क्रिया से: -ung', 'من الفعل: -ung'), points: [ungPoint] },
	'word-forge-two': { title: T('Из прилагательного: -heit, -keit', 'З прикметника: -heit, -keit', 'From an adjective: -heit, -keit', 'Z przymiotnika: -heit, -keit', 'Del adjetivo: -heit, -keit', 'À partir d’un adjectif : -heit, -keit', 'Sıfattan: -heit, -keit', 'Din adjectiv: -heit, -keit', 'Sifatdan: -heit, -keit', 'विशेषण से: -heit, -keit', 'من الصفة: -heit و-keit'), points: [heitPoint] },
	'word-forge-three': { title: T('Из существительного: -lich, -ig', 'З іменника: -lich, -ig', 'From a noun: -lich, -ig', 'Z rzeczownika: -lich, -ig', 'Del sustantivo: -lich, -ig', 'À partir d’un nom : -lich, -ig', 'İsimden: -lich, -ig', 'Din substantiv: -lich, -ig', 'Otdan: -lich, -ig', 'संज्ञा से: -lich, -ig', 'من الاسم: -lich و-ig'), points: [lichPoint] },
	'word-forge-four': { title: T('Можно сделать: -bar', 'Можна зробити: -bar', 'Can be done: -bar', 'Da się zrobić: -bar', 'Se puede hacer: -bar', 'Faisable : -bar', 'Yapılabilir: -bar', 'Se poate face: -bar', "Qilsa bo'ladi: -bar", 'किया जा सकता है: -bar', 'يمكن فعله: -bar'), points: [barPoint] },
	'word-forge-five': { title: T('Наоборот: un-', 'Навпаки: un-', 'The opposite: un-', 'Odwrotnie: un-', 'Lo contrario: un-', 'Le contraire : un-', 'Tersi: un-', 'Opusul: un-', 'Teskarisi: un-', 'उल्टा: un-', 'العكس: un-'), points: [unPoint] },
	'word-forge-six': { title: T('Объявление о квартире', 'Оголошення про квартиру', 'A flat advert', 'Ogłoszenie o mieszkaniu', 'Anuncio de piso', 'Annonce d’appartement', 'Daire ilanı', 'Anunț de apartament', "Kvartira e'loni", 'फ़्लैट का विज्ञापन', 'إعلان عن شقة'), points: [ungPoint, lichPoint, barPoint] },
	'word-forge-seven': { title: T('Практика: онлайн-магазин', 'Практика: онлайн-магазин', 'Practice: an online shop', 'Praktyka: sklep internetowy', 'Práctica: tienda online', 'Pratique : boutique en ligne', 'Pratik: online mağaza', 'Practică: magazin online', "Mashq: onlayn do'kon", 'अभ्यास: ऑनलाइन दुकान', 'تدريب: متجر إلكتروني'), points: [ungPoint, unPoint] },
	'word-forge-eight': { title: T('Практика: здоровая жизнь', 'Практика: здорове життя', 'Practice: healthy living', 'Praktyka: zdrowe życie', 'Práctica: vida sana', 'Pratique : vie saine', 'Pratik: sağlıklı yaşam', 'Practică: viață sănătoasă', "Mashq: sog'lom hayot", 'अभ्यास: स्वस्थ जीवन', 'تدريب: حياة صحية'), points: [heitPoint, lichPoint] },
	'word-forge-nine': { title: T('Повторение: как делают слова', 'Повторення: як роблять слова', 'Review: word building', 'Powtórka: słowotwórstwo', 'Repaso: formación de palabras', 'Révision : formation des mots', 'Tekrar: kelime türetme', 'Recapitulare: formarea cuvintelor', "Takrorlash: so'z yasalishi", 'दोहराव: शब्द निर्माण', 'مراجعة: بناء الكلمات'), points: [ungPoint, heitPoint, unPoint] },
	'word-forge-ten': { title: finalTitle, points: [ungPoint, heitPoint, barPoint] }
}

module.exports = quests
