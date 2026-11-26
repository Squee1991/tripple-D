// Грамматика к заданиям земли choice-crossing (welcher, dieser, jeder, was für ein)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const likeDerPoint = pt(['Окончания как у der, die, das', 'Закінчення як у der, die, das', 'Endings like der, die, das', 'Końcówki jak der, die, das', 'Terminaciones como der, die, das', 'Terminaisons comme der, die, das', 'der, die, das gibi ekler', 'Terminații ca la der, die, das', "der, die, das kabi qo'shimchalar", 'der, die, das जैसे अंत', 'نهايات مثل der وdie وdas'], [
	'welcher, dieser, jeder берут окончание артикля: der → welcher Rock, die → welche Jacke, das → welches Kleid, мн. ч. welche Schuhe.',
	'welcher, dieser, jeder беруть закінчення артикля: der → welcher Rock, die → welche Jacke, das → welches Kleid, мн. welche Schuhe.',
	'welcher, dieser, jeder take the article’s ending: der → welcher Rock, die → welche Jacke, das → welches Kleid, plural welche Schuhe.',
	'welcher, dieser, jeder biorą końcówkę rodzajnika: der → welcher Rock, die → welche Jacke, das → welches Kleid, l. mn. welche Schuhe.',
	'welcher, dieser, jeder toman la terminación del artículo: der → welcher Rock, die → welche Jacke, das → welches Kleid, plural welche Schuhe.',
	'welcher, dieser, jeder prennent la terminaison de l’article : der → welcher Rock, die → welche Jacke, das → welches Kleid, pluriel welche Schuhe.',
	'welcher, dieser, jeder artikelin ekini alır: der → welcher Rock, die → welche Jacke, das → welches Kleid, çoğul welche Schuhe.',
	'welcher, dieser, jeder iau terminația articolului: der → welcher Rock, die → welche Jacke, das → welches Kleid, plural welche Schuhe.',
	"welcher, dieser, jeder artikl qo'shimchasini oladi: der → welcher Rock, die → welche Jacke, das → welches Kleid, ko'plik welche Schuhe.",
	'welcher, dieser, jeder आर्टिकल का अंत लेते हैं: der → welcher Rock, die → welche Jacke, das → welches Kleid, बहुवचन welche Schuhe।',
	'welcher وdieser وjeder تأخذ نهاية الأداة: der → welcher Rock، die → welche Jacke، das → welches Kleid، والجمع welche Schuhe.'
], [ex('Welche Jacke gefällt dir?', t11('Какая куртка тебе нравится?', 'Яка куртка тобі подобається?', 'Which jacket do you like?', 'Która kurtka ci się podoba?', '¿Qué chaqueta te gusta?', 'Quelle veste te plaît ?', 'Hangi ceketi beğendin?', 'Ce geacă îți place?', 'Qaysi kurtka senga yoqadi?', 'तुम्हें कौन-सी जैकेट पसंद है?', 'أي سترة تعجبك؟'))])

const akkDatPoint = pt(['diesen и diesem', 'diesen і diesem', 'diesen and diesem', 'diesen i diesem', 'diesen y diesem', 'diesen et diesem', 'diesen ve diesem', 'diesen și diesem', 'diesen va diesem', 'diesen और diesem', 'diesen وdiesem'], [
	'Akkusativ: мужской род получает -en: diesen Rock, jeden Tag. Dativ: -em для der и das, -er для die: in diesem Haus, in welcher Straße.',
	'Akkusativ: чоловічий рід отримує -en: diesen Rock, jeden Tag. Dativ: -em для der і das, -er для die: in diesem Haus, in welcher Straße.',
	'Accusative: masculine takes -en: diesen Rock, jeden Tag. Dative: -em for der and das, -er for die: in diesem Haus, in welcher Straße.',
	'Akkusativ: rodzaj męski dostaje -en: diesen Rock, jeden Tag. Dativ: -em dla der i das, -er dla die: in diesem Haus, in welcher Straße.',
	'Acusativo: el masculino lleva -en: diesen Rock, jeden Tag. Dativo: -em para der y das, -er para die: in diesem Haus, in welcher Straße.',
	'Accusatif : le masculin prend -en : diesen Rock, jeden Tag. Datif : -em pour der et das, -er pour die : in diesem Haus, in welcher Straße.',
	'Akkusativ: eril -en alır: diesen Rock, jeden Tag. Dativ: der ve das için -em, die için -er: in diesem Haus, in welcher Straße.',
	'Acuzativ: masculinul primește -en: diesen Rock, jeden Tag. Dativ: -em pentru der și das, -er pentru die: in diesem Haus, in welcher Straße.',
	"Akkusativ: erkak rodi -en oladi: diesen Rock, jeden Tag. Dativ: der va das uchun -em, die uchun -er: in diesem Haus, in welcher Straße.",
	'Akkusativ: पुल्लिंग -en लेता है: diesen Rock, jeden Tag। Dativ: der और das के लिए -em, die के लिए -er: in diesem Haus, in welcher Straße।',
	'المفعول: المذكر يأخذ -en: diesen Rock، jeden Tag. والجر: -em مع der وdas، و-er مع die: in diesem Haus، in welcher Straße.'
], [
	ex('Ich nehme diesen Pullover.', t11('Я беру этот свитер.', 'Я беру цей светр.', 'I’ll take this jumper.', 'Biorę ten sweter.', 'Me llevo este jersey.', 'Je prends ce pull.', 'Bu kazağı alıyorum.', 'Iau puloverul acesta.', 'Men bu sviterni olaman.', 'मैं यह स्वेटर लेता हूँ।', 'آخذ هذه الكنزة.')),
	ex('Aus welchem Land kommst du?', t11('Из какой ты страны?', 'З якої ти країни?', 'Which country are you from?', 'Z jakiego kraju jesteś?', '¿De qué país eres?', 'De quel pays viens-tu ?', 'Hangi ülkedensin?', 'Din ce țară ești?', 'Qaysi davlatdansan?', 'तुम किस देश से हो?', 'من أي بلد أنت؟'))
])

const jederAllePoint = pt(['jeder и alle', 'jeder і alle', 'jeder and alle', 'jeder i alle', 'jeder y alle', 'jeder et alle', 'jeder ve alle', 'jeder și alle', 'jeder va alle', 'jeder और alle', 'jeder وalle'], [
	'jeder (каждый) только в единственном числе. Во множественном говорим alle: alle Kinder. О времени Akkusativ: jeden Tag, jede Woche, jedes Jahr.',
	'jeder (кожен) лише в однині. У множині кажемо alle: alle Kinder. Про час Akkusativ: jeden Tag, jede Woche, jedes Jahr.',
	'jeder (every) is only singular. In the plural say alle: alle Kinder. For time use the accusative: jeden Tag, jede Woche, jedes Jahr.',
	'jeder (każdy) tylko w liczbie pojedynczej. W mnogiej mówimy alle: alle Kinder. O czasie Akkusativ: jeden Tag, jede Woche, jedes Jahr.',
	'jeder (cada) solo en singular. En plural se dice alle: alle Kinder. Para el tiempo, acusativo: jeden Tag, jede Woche, jedes Jahr.',
	'jeder (chaque) seulement au singulier. Au pluriel, on dit alle : alle Kinder. Pour le temps, accusatif : jeden Tag, jede Woche, jedes Jahr.',
	'jeder (her) sadece tekil. Çoğulda alle denir: alle Kinder. Zaman için Akkusativ: jeden Tag, jede Woche, jedes Jahr.',
	'jeder (fiecare) doar la singular. La plural spunem alle: alle Kinder. Pentru timp, acuzativ: jeden Tag, jede Woche, jedes Jahr.',
	"jeder (har bir) faqat birlikda. Ko'plikda alle deyiladi: alle Kinder. Vaqt uchun Akkusativ: jeden Tag, jede Woche, jedes Jahr.",
	'jeder (हर) सिर्फ़ एकवचन में। बहुवचन में alle: alle Kinder। समय के लिए Akkusativ: jeden Tag, jede Woche, jedes Jahr।',
	'jeder (كل) بالمفرد فقط. وفي الجمع نقول alle: alle Kinder. وللزمن المفعول: jeden Tag، jede Woche، jedes Jahr.'
], [ex('Ich lese jeden Morgen die Zeitung.', t11('Я читаю газету каждое утро.', 'Я читаю газету щоранку.', 'I read the newspaper every morning.', 'Czytam gazetę każdego ranka.', 'Leo el periódico cada mañana.', 'Je lis le journal tous les matins.', 'Her sabah gazete okurum.', 'Citesc ziarul în fiecare dimineață.', "Har kuni ertalab gazeta o'qiyman.", 'मैं हर सुबह अख़बार पढ़ता हूँ।', 'أقرأ الجريدة كل صباح.'))])

const wasFuerPoint = pt(['was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein', 'was für ein'], [
	'Что за, какого вида: was für ein + существительное. ein меняется как обычно: Was für einen Hund? Во множественном без ein: Was für Filme?',
	'Що за, якого виду: was für ein + іменник. ein змінюється як зазвичай: Was für einen Hund? У множині без ein: Was für Filme?',
	'What kind of: was für ein + noun. ein changes as usual: Was für einen Hund? In the plural no ein: Was für Filme?',
	'Jaki, jakiego rodzaju: was für ein + rzeczownik. ein odmienia się normalnie: Was für einen Hund? W mnogiej bez ein: Was für Filme?',
	'Qué tipo de: was für ein + sustantivo. ein cambia como siempre: Was für einen Hund? En plural sin ein: Was für Filme?',
	'Quel genre de : was für ein + nom. ein change normalement : Was für einen Hund ? Au pluriel, sans ein : Was für Filme ?',
	'Ne tür: was für ein + isim. ein normal değişir: Was für einen Hund? Çoğulda ein yok: Was für Filme?',
	'Ce fel de: was für ein + substantiv. ein se schimbă ca de obicei: Was für einen Hund? La plural fără ein: Was für Filme?',
	"Qanday, qaysi turdagi: was für ein + ot. ein odatdagidek o'zgaradi: Was für einen Hund? Ko'plikda ein siz: Was für Filme?",
	'किस तरह का: was für ein + संज्ञा। ein सामान्य रूप से बदलता है: Was für einen Hund? बहुवचन में बिना ein: Was für Filme?',
	'ما نوع: was für ein + اسم. وتتغير ein كالعادة: Was für einen Hund؟ وفي الجمع بدون ein: Was für Filme؟'
], [ex('Was für ein Auto hast du?', t11('Какая у тебя машина?', 'Яка в тебе машина?', 'What kind of car do you have?', 'Jaki masz samochód?', '¿Qué coche tienes?', 'Quel genre de voiture as-tu ?', 'Nasıl bir araban var?', 'Ce fel de mașină ai?', 'Qanday mashinang bor?', 'तुम्हारे पास कैसी गाड़ी है?', 'ما نوع سيارتك؟'))])

const derHierPoint = pt(['Der hier! Den da!', 'Der hier! Den da!', 'Der hier! Den da!', 'Der hier! Den da!', 'Der hier! Den da!', 'Der hier ! Den da !', 'Der hier! Den da!', 'Der hier! Den da!', 'Der hier! Den da!', 'Der hier! Den da!', 'Der hier! Den da!'], [
	'В ответе существительное можно не повторять: der, die, das с ударением. В Akkusativ мужской род den: Welchen Schal? Den da.',
	'У відповіді іменник можна не повторювати: der, die, das з наголосом. В Akkusativ чоловічий рід den: Welchen Schal? Den da.',
	'You can skip the noun in the answer: stressed der, die, das. In the accusative masculine is den: Welchen Schal? Den da.',
	'W odpowiedzi rzeczownika można nie powtarzać: der, die, das z akcentem. W Akkusativ rodzaj męski den: Welchen Schal? Den da.',
	'En la respuesta se puede omitir el sustantivo: der, die, das con acento. En acusativo, masculino den: Welchen Schal? Den da.',
	'Dans la réponse, on peut ne pas répéter le nom : der, die, das accentués. À l’accusatif, masculin den : Welchen Schal ? Den da.',
	'Cevapta ismi tekrarlamaya gerek yok: vurgulu der, die, das. Akkusativ’de eril den: Welchen Schal? Den da.',
	'În răspuns poți să nu repeți substantivul: der, die, das accentuate. La acuzativ, masculin den: Welchen Schal? Den da.',
	"Javobda otni takrorlamasa ham bo'ladi: urg'uli der, die, das. Akkusativda erkak rodi den: Welchen Schal? Den da.",
	'जवाब में संज्ञा दोहराने की ज़रूरत नहीं: ज़ोर देकर der, die, das। Akkusativ में पुल्लिंग den: Welchen Schal? Den da।',
	'يمكن عدم تكرار الاسم في الجواب: der وdie وdas مع النبر. وفي المفعول المذكر den: Welchen Schal؟ Den da.'
], [ex('Welcher Schal? Der hier.', t11('Какой шарф? Вот этот.', 'Який шарф? Ось цей.', 'Which scarf? This one.', 'Który szalik? Ten tutaj.', '¿Qué bufanda? Esta.', 'Quelle écharpe ? Celle-ci.', 'Hangi atkı? Bu.', 'Care fular? Acesta.', 'Qaysi sharf? Mana bu.', 'कौन-सा मफ़लर? यह वाला।', 'أي وشاح؟ هذا.'))])

const quests = {
	'choice-crossing-one': { title: t11('Какой из них: welcher', 'Який із них: welcher', 'Which one: welcher', 'Który: welcher', 'Cuál: welcher', 'Lequel : welcher', 'Hangisi: welcher', 'Care: welcher', 'Qaysi biri: welcher', 'कौन-सा: welcher', 'أيّ: welcher'), points: [likeDerPoint] },
	'choice-crossing-two': { title: t11('Этот: dieser', 'Цей: dieser', 'This: dieser', 'Ten: dieser', 'Este: dieser', 'Ce : dieser', 'Bu: dieser', 'Acesta: dieser', 'Bu: dieser', 'यह: dieser', 'هذا: dieser'), points: [likeDerPoint, akkDatPoint] },
	'choice-crossing-three': { title: t11('В каком? С этим', 'У якому? З цим', 'In which? With this', 'W którym? Z tym', '¿En cuál? Con este', 'Dans lequel ? Avec celui-ci', 'Hangisinde? Bununla', 'În care? Cu acesta', 'Qaysi birida? Bu bilan', 'किसमें? इसके साथ', 'في أيّ؟ مع هذا'), points: [akkDatPoint] },
	'choice-crossing-four': { title: t11('Каждый день, все дети', 'Щодня, усі діти', 'Every day, all children', 'Każdego dnia, wszystkie dzieci', 'Cada día, todos los niños', 'Chaque jour, tous les enfants', 'Her gün, bütün çocuklar', 'În fiecare zi, toți copiii', 'Har kuni, barcha bolalar', 'हर दिन, सभी बच्चे', 'كل يوم، كل الأطفال'), points: [jederAllePoint] },
	'choice-crossing-five': { title: t11('Что за машина?', 'Що за машина?', 'What kind of car?', 'Jaki samochód?', '¿Qué tipo de coche?', 'Quel genre de voiture ?', 'Nasıl bir araba?', 'Ce fel de mașină?', 'Qanday mashina?', 'कैसी गाड़ी?', 'أي نوع من السيارات؟'), points: [wasFuerPoint] },
	'choice-crossing-six': { title: t11('Вот этот! Вон тот!', 'Ось цей! Он той!', 'This one! That one!', 'Ten tutaj! Tamten!', '¡Este! ¡Aquel!', 'Celui-ci ! Celui-là !', 'Bu! Şu!', 'Acesta! Acela!', 'Mana bu! Ana u!', 'यह वाला! वह वाला!', 'هذا! ذاك!'), points: [derHierPoint] },
	'choice-crossing-seven': { title: t11('Практика: на блошином рынке', 'Практика: на блошиному ринку', 'Practice: at the flea market', 'Praktyka: na pchlim targu', 'Práctica: en el rastro', 'Pratique : au marché aux puces', 'Pratik: bit pazarında', 'Practică: la talcioc', 'Mashq: eski buyumlar bozorida', 'अभ्यास: कबाड़ बाज़ार में', 'تدريب: في سوق المستعمل'), points: [likeDerPoint, derHierPoint] },
	'choice-crossing-eight': { title: t11('Практика: выбираем квартиру', 'Практика: обираємо квартиру', 'Practice: choosing a flat', 'Praktyka: wybieramy mieszkanie', 'Práctica: elegir piso', 'Pratique : choisir un appartement', 'Pratik: daire seçmek', 'Practică: alegem un apartament', 'Mashq: kvartira tanlaymiz', 'अभ्यास: फ़्लैट चुनना', 'تدريب: اختيار شقة'), points: [akkDatPoint, jederAllePoint, wasFuerPoint] },
	'choice-crossing-nine': { title: t11('Повторение: выбор', 'Повторення: вибір', 'Review: choosing', 'Powtórka: wybór', 'Repaso: elegir', 'Révision : le choix', 'Tekrar: seçim', 'Recapitulare: alegerea', 'Takrorlash: tanlov', 'दोहराव: चुनाव', 'مراجعة: الاختيار'), points: [likeDerPoint, akkDatPoint, wasFuerPoint] },
	'choice-crossing-ten': { title: finalTitle, points: [akkDatPoint, jederAllePoint, derHierPoint] }
}

module.exports = quests
