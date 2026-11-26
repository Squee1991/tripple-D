// Грамматика к заданиям земли hero-square (слабые существительные)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const weakPoint = pt(['Слабые существительные: -n', 'Слабкі іменники: -n', 'Weak nouns: -n', 'Rzeczowniki słabe: -n', 'Sustantivos débiles: -n', 'Noms faibles : -n', 'Zayıf isimler: -n', 'Substantive slabe: -n', "Kuchsiz otlar: -n", 'कमज़ोर संज्ञाएँ: -n', 'الأسماء الضعيفة: -n'], [
	'Некоторые слова мужского рода получают -n во всех формах, кроме подлежащего в единственном числе: der Kollege → den, dem, des Kollegen. Часто на -e: der Junge, der Kunde, der Löwe.',
	'Деякі слова чоловічого роду отримують -n в усіх формах, крім підмета в однині: der Kollege → den, dem, des Kollegen. Часто на -e: der Junge, der Kunde, der Löwe.',
	'Some masculine nouns add -n in every form except the singular subject: der Kollege → den, dem, des Kollegen. Often they end in -e: der Junge, der Kunde, der Löwe.',
	'Niektóre słowa rodzaju męskiego dostają -n we wszystkich formach poza podmiotem w liczbie pojedynczej: der Kollege → den, dem, des Kollegen. Często na -e: der Junge, der Kunde, der Löwe.',
	'Algunos sustantivos masculinos añaden -n en todas las formas salvo el sujeto singular: der Kollege → den, dem, des Kollegen. A menudo acaban en -e: der Junge, der Kunde, der Löwe.',
	'Certains noms masculins prennent -n à toutes les formes sauf le sujet au singulier : der Kollege → den, dem, des Kollegen. Souvent en -e : der Junge, der Kunde, der Löwe.',
	'Bazı eril isimler tekil özne dışında her biçimde -n alır: der Kollege → den, dem, des Kollegen. Çoğu -e ile biter: der Junge, der Kunde, der Löwe.',
	'Unele substantive masculine primesc -n în toate formele, în afară de subiectul la singular: der Kollege → den, dem, des Kollegen. Des în -e: der Junge, der Kunde, der Löwe.',
	"Ba'zi erkak rodidagi otlar birlikdagi egadan boshqa barcha shakllarda -n oladi: der Kollege → den, dem, des Kollegen. Ko'pincha -e bilan: der Junge, der Kunde, der Löwe.",
	'कुछ पुल्लिंग संज्ञाएँ एकवचन कर्ता को छोड़कर हर रूप में -n लेती हैं: der Kollege → den, dem, des Kollegen। अक्सर -e पर: der Junge, der Kunde, der Löwe।',
	'بعض الأسماء المذكرة تأخذ -n في كل الحالات ما عدا الفاعل المفرد: der Kollege → den، dem، des Kollegen. وغالباً تنتهي بـ -e: der Junge، der Kunde، der Löwe.'
], [ex('Ich sehe den Jungen.', t11('Я вижу мальчика.', 'Я бачу хлопчика.', 'I see the boy.', 'Widzę chłopca.', 'Veo al chico.', 'Je vois le garçon.', 'Çocuğu görüyorum.', 'Îl văd pe băiat.', "Men bolani ko'ryapman.", 'मुझे लड़का दिख रहा है।', 'أرى الولد.'))])

const herrPoint = pt(['der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch, der Nachbar, der Herr', 'der Mensch وder Nachbar وder Herr'], [
	'Слабыми бывают и слова без -e: den Menschen, den Nachbarn. der Herr в единственном числе получает -n: Ich kenne Herrn Braun.',
	'Слабкими бувають і слова без -e: den Menschen, den Nachbarn. der Herr в однині отримує -n: Ich kenne Herrn Braun.',
	'Some weak nouns don’t end in -e: den Menschen, den Nachbarn. der Herr in the singular takes -n: Ich kenne Herrn Braun.',
	'Słabe bywają też słowa bez -e: den Menschen, den Nachbarn. der Herr w liczbie pojedynczej dostaje -n: Ich kenne Herrn Braun.',
	'También hay débiles sin -e: den Menschen, den Nachbarn. der Herr en singular lleva -n: Ich kenne Herrn Braun.',
	'Il y a aussi des noms faibles sans -e : den Menschen, den Nachbarn. der Herr au singulier prend -n : Ich kenne Herrn Braun.',
	'-e ile bitmeyen zayıf isimler de var: den Menschen, den Nachbarn. der Herr tekilde -n alır: Ich kenne Herrn Braun.',
	'Există și substantive slabe fără -e: den Menschen, den Nachbarn. der Herr la singular primește -n: Ich kenne Herrn Braun.',
	"-e siz kuchsiz otlar ham bor: den Menschen, den Nachbarn. der Herr birlikda -n oladi: Ich kenne Herrn Braun.",
	'बिना -e वाली कमज़ोर संज्ञाएँ भी हैं: den Menschen, den Nachbarn। der Herr एकवचन में -n लेता है: Ich kenne Herrn Braun।',
	'توجد أسماء ضعيفة بدون -e أيضاً: den Menschen، den Nachbarn. وder Herr في المفرد يأخذ -n: Ich kenne Herrn Braun.'
], [ex('Ich kenne Herrn Braun.', t11('Я знаю господина Брауна.', 'Я знаю пана Брауна.', 'I know Mr Braun.', 'Znam pana Brauna.', 'Conozco al señor Braun.', 'Je connais Monsieur Braun.', 'Bay Braun’u tanıyorum.', 'Îl cunosc pe domnul Braun.', 'Men janob Braunni taniyman.', 'मैं श्रीमान ब्राउन को जानता हूँ।', 'أعرف السيد براون.'))])

const entPoint = pt(['-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist : -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent, -ant, -ist: -en', '-ent و-ant و-ist: -en'], [
	'Слова мужского рода на -ent, -ant, -ist получают -en: den Studenten, dem Polizisten, die Touristen.',
	'Слова чоловічого роду на -ent, -ant, -ist отримують -en: den Studenten, dem Polizisten, die Touristen.',
	'Masculine nouns in -ent, -ant, -ist take -en: den Studenten, dem Polizisten, die Touristen.',
	'Słowa rodzaju męskiego na -ent, -ant, -ist dostają -en: den Studenten, dem Polizisten, die Touristen.',
	'Los masculinos en -ent, -ant, -ist llevan -en: den Studenten, dem Polizisten, die Touristen.',
	'Les noms masculins en -ent, -ant, -ist prennent -en : den Studenten, dem Polizisten, die Touristen.',
	'-ent, -ant, -ist ile biten eril isimler -en alır: den Studenten, dem Polizisten, die Touristen.',
	'Substantivele masculine în -ent, -ant, -ist primesc -en: den Studenten, dem Polizisten, die Touristen.',
	"-ent, -ant, -ist bilan tugagan erkak rodidagi otlar -en oladi: den Studenten, dem Polizisten, die Touristen.",
	'-ent, -ant, -ist पर खत्म पुल्लिंग संज्ञाएँ -en लेती हैं: den Studenten, dem Polizisten, die Touristen।',
	'الأسماء المذكرة المنتهية بـ -ent و-ant و-ist تأخذ -en: den Studenten، dem Polizisten، die Touristen.'
], [ex('Ich habe den Polizisten gefragt.', t11('Я спросил полицейского.', 'Я запитав поліцейського.', 'I asked the police officer.', 'Zapytałem policjanta.', 'Le pregunté al policía.', 'J’ai demandé au policier.', 'Polise sordum.', 'L-am întrebat pe polițist.', "Men politsiyachidan so'radim.", 'मैंने पुलिसवाले से पूछा।', 'سألت الشرطي.'))])

const genPoint = pt(['Genitiv: des Kollegen, des Namens', 'Genitiv: des Kollegen, des Namens', 'Genitive: des Kollegen, des Namens', 'Genitiv: des Kollegen, des Namens', 'Genitivo: des Kollegen, des Namens', 'Génitif : des Kollegen, des Namens', 'Genitiv: des Kollegen, des Namens', 'Genitiv: des Kollegen, des Namens', 'Genitiv: des Kollegen, des Namens', 'Genitiv: des Kollegen, des Namens', 'الإضافة: des Kollegen وdes Namens'], [
	'В Genitiv слабые получают -n/-en, но без -s: des Kollegen, des Studenten. Особое слово der Name: des Namens.',
	'У Genitiv слабкі отримують -n/-en, але без -s: des Kollegen, des Studenten. Особливе слово der Name: des Namens.',
	'In the genitive weak nouns take -n/-en, but no -s: des Kollegen, des Studenten. Special: der Name → des Namens.',
	'W Genitiv słabe dostają -n/-en, ale bez -s: des Kollegen, des Studenten. Słowo szczególne der Name: des Namens.',
	'En genitivo los débiles llevan -n/-en, pero sin -s: des Kollegen, des Studenten. Especial: der Name → des Namens.',
	'Au génitif, les noms faibles prennent -n/-en, mais pas de -s : des Kollegen, des Studenten. Particulier : der Name → des Namens.',
	'Genitiv’de zayıf isimler -n/-en alır ama -s almaz: des Kollegen, des Studenten. Özel: der Name → des Namens.',
	'La genitiv substantivele slabe primesc -n/-en, dar fără -s: des Kollegen, des Studenten. Special: der Name → des Namens.',
	"Genitivda kuchsizlar -n/-en oladi, lekin -s siz: des Kollegen, des Studenten. Alohida: der Name → des Namens.",
	'Genitiv में कमज़ोर संज्ञाएँ -n/-en लेती हैं, पर -s नहीं: des Kollegen, des Studenten। खास: der Name → des Namens।',
	'في الإضافة تأخذ الأسماء الضعيفة -n/-en بدون -s: des Kollegen، des Studenten. والخاصة: der Name → des Namens.'
], [ex('Das ist das Auto des Kollegen.', t11('Это машина коллеги.', 'Це машина колеги.', 'That’s the colleague’s car.', 'To samochód kolegi z pracy.', 'Es el coche del compañero.', 'C’est la voiture du collègue.', 'Bu iş arkadaşının arabası.', 'Aceasta e mașina colegului.', 'Bu hamkasbning mashinasi.', 'यह सहकर्मी की गाड़ी है।', 'هذه سيارة الزميل.'))])

const nomOnlyPoint = pt(['Без -n только подлежащее', 'Без -n лише підмет', 'No -n only for the subject', 'Bez -n tylko podmiot', 'Sin -n solo el sujeto', 'Sans -n seulement pour le sujet', '-n almayan sadece özne', 'Fără -n doar subiectul', "-n siz faqat ega", 'बिना -n सिर्फ़ कर्ता', 'بدون -n الفاعل فقط'], [
	'Без -n слабое существительное только как подлежащее в единственном числе: Der Junge spielt. Во всех других формах и во множественном -n или -en.',
	'Без -n слабкий іменник лише як підмет в однині: Der Junge spielt. В усіх інших формах і в множині -n або -en.',
	'A weak noun has no -n only as a singular subject: Der Junge spielt. In all other forms and in the plural it takes -n or -en.',
	'Bez -n rzeczownik słaby tylko jako podmiot w liczbie pojedynczej: Der Junge spielt. We wszystkich innych formach i w mnogiej -n albo -en.',
	'Sin -n el sustantivo débil solo como sujeto singular: Der Junge spielt. En las demás formas y en plural, -n o -en.',
	'Sans -n, le nom faible seulement comme sujet au singulier : Der Junge spielt. Dans toutes les autres formes et au pluriel, -n ou -en.',
	'Zayıf isim sadece tekil özne olarak -n almaz: Der Junge spielt. Diğer bütün biçimlerde ve çoğulda -n ya da -en.',
	'Fără -n, substantivul slab doar ca subiect la singular: Der Junge spielt. În toate celelalte forme și la plural, -n sau -en.',
	"Kuchsiz ot faqat birlikdagi ega sifatida -n siz: Der Junge spielt. Qolgan barcha shakllarda va ko'plikda -n yoki -en.",
	'कमज़ोर संज्ञा सिर्फ़ एकवचन कर्ता के रूप में बिना -n: Der Junge spielt। बाकी सभी रूपों और बहुवचन में -n या -en।',
	'الاسم الضعيف بدون -n فقط حين يكون فاعلاً مفرداً: Der Junge spielt. وفي كل الحالات الأخرى والجمع -n أو -en.'
], [ex('Der neue Kollege half sofort dem Kunden.', t11('Новый коллега сразу помог клиенту.', 'Новий колега одразу допоміг клієнтові.', 'The new colleague helped the customer straight away.', 'Nowy kolega od razu pomógł klientowi.', 'El compañero nuevo ayudó enseguida al cliente.', 'Le nouveau collègue a tout de suite aidé le client.', 'Yeni iş arkadaşı müşteriye hemen yardım etti.', 'Noul coleg l-a ajutat imediat pe client.', 'Yangi hamkasb darhol mijozga yordam berdi.', 'नए सहकर्मी ने तुरंत ग्राहक की मदद की।', 'ساعد الزميل الجديد الزبون فوراً.'))])

const T = (...v) => t11(...v)
const quests = {
	'hero-square-one': { title: T('Мальчик, коллега, клиент', 'Хлопчик, колега, клієнт', 'Boy, colleague, customer', 'Chłopiec, kolega, klient', 'Chico, compañero, cliente', 'Garçon, collègue, client', 'Çocuk, iş arkadaşı, müşteri', 'Băiat, coleg, client', 'Bola, hamkasb, mijoz', 'लड़का, सहकर्मी, ग्राहक', 'الولد، الزميل، الزبون'), points: [weakPoint] },
	'hero-square-two': { title: T('Человек, сосед, господин', 'Людина, сусід, пан', 'Person, neighbour, Mr', 'Człowiek, sąsiad, pan', 'Persona, vecino, señor', 'Personne, voisin, monsieur', 'İnsan, komşu, bay', 'Om, vecin, domn', "Inson, qo'shni, janob", 'इंसान, पड़ोसी, श्रीमान', 'الإنسان، الجار، السيد'), points: [herrPoint] },
	'hero-square-three': { title: T('Студент, турист, полицейский', 'Студент, турист, поліцейський', 'Student, tourist, police officer', 'Student, turysta, policjant', 'Estudiante, turista, policía', 'Étudiant, touriste, policier', 'Öğrenci, turist, polis', 'Student, turist, polițist', 'Talaba, turist, politsiyachi', 'छात्र, पर्यटक, पुलिसवाला', 'الطالب، السائح، الشرطي'), points: [entPoint] },
	'hero-square-four': { title: T('Чьё это? Genitiv', 'Чиє це? Genitiv', 'Whose? Genitive', 'Czyje to? Genitiv', '¿De quién? Genitivo', 'À qui ? Génitif', 'Kimin? Genitiv', 'Al cui? Genitiv', 'Kimniki? Genitiv', 'किसका? Genitiv', 'لمن؟ الإضافة'), points: [genPoint] },
	'hero-square-five': { title: T('С -n или без?', 'З -n чи без?', 'With -n or without?', 'Z -n czy bez?', '¿Con -n o sin?', 'Avec -n ou sans ?', '-n ile mi, -n’siz mi?', 'Cu -n sau fără?', '-n bilan yoki -n siz?', '-n के साथ या बिना?', 'مع -n أم بدونها؟'), points: [nomOnlyPoint] },
	'hero-square-six': { title: T('Новый практикант', 'Новий практикант', 'The new intern', 'Nowy praktykant', 'El nuevo becario', 'Le nouveau stagiaire', 'Yeni stajyer', 'Noul practicant', 'Yangi amaliyotchi', 'नया इंटर्न', 'المتدرب الجديد'), points: [nomOnlyPoint, entPoint] },
	'hero-square-seven': { title: T('Практика: в больнице', 'Практика: у лікарні', 'Practice: at the hospital', 'Praktyka: w szpitalu', 'Práctica: en el hospital', 'Pratique : à l’hôpital', 'Pratik: hastanede', 'Practică: la spital', 'Mashq: kasalxonada', 'अभ्यास: अस्पताल में', 'تدريب: في المستشفى'), points: [entPoint, nomOnlyPoint] },
	'hero-square-eight': { title: T('Практика: в зоопарке', 'Практика: у зоопарку', 'Practice: at the zoo', 'Praktyka: w zoo', 'Práctica: en el zoo', 'Pratique : au zoo', 'Pratik: hayvanat bahçesinde', 'Practică: la grădina zoologică', "Mashq: hayvonot bog'ida", 'अभ्यास: चिड़ियाघर में', 'تدريب: في حديقة الحيوان'), points: [weakPoint] },
	'hero-square-nine': { title: T('Повторение: слабые существительные', 'Повторення: слабкі іменники', 'Review: weak nouns', 'Powtórka: rzeczowniki słabe', 'Repaso: sustantivos débiles', 'Révision : noms faibles', 'Tekrar: zayıf isimler', 'Recapitulare: substantive slabe', 'Takrorlash: kuchsiz otlar', 'दोहराव: कमज़ोर संज्ञाएँ', 'مراجعة: الأسماء الضعيفة'), points: [weakPoint, herrPoint, entPoint] },
	'hero-square-ten': { title: finalTitle, points: [nomOnlyPoint, genPoint] }
}

module.exports = quests
