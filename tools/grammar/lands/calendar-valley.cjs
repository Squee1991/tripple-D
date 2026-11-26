// Грамматика к заданиям земли calendar-valley (порядковые числа, даты, время)
const { ex, t11, pt, noRules, finalTitle } = require('../lib.cjs')

const ordinalPoint = pt(['До 19: -te, с 20: -ste', 'До 19: -te, з 20: -ste', 'Up to 19: -te, from 20: -ste', 'Do 19: -te, od 20: -ste', 'Hasta 19: -te, desde 20: -ste', 'Jusqu’à 19 : -te, à partir de 20 : -ste', '19’a kadar -te, 20’den itibaren -ste', 'Până la 19: -te, de la 20: -ste', '19 gacha -te, 20 dan -ste', '19 तक -te, 20 से -ste', 'حتى 19: -te، ومن 20: -ste'], [
	'Порядковые: vier → vierte, zwanzig → zwanzigste. Особые: erste, dritte, siebte, achte. Окончание как у прилагательного: der erste Tag, im dritten Stock.',
	'Порядкові: vier → vierte, zwanzig → zwanzigste. Особливі: erste, dritte, siebte, achte. Закінчення як у прикметника: der erste Tag, im dritten Stock.',
	'Ordinals: vier → vierte, zwanzig → zwanzigste. Special: erste, dritte, siebte, achte. Endings like an adjective: der erste Tag, im dritten Stock.',
	'Liczebniki porządkowe: vier → vierte, zwanzig → zwanzigste. Szczególne: erste, dritte, siebte, achte. Końcówka jak w przymiotniku: der erste Tag, im dritten Stock.',
	'Ordinales: vier → vierte, zwanzig → zwanzigste. Especiales: erste, dritte, siebte, achte. Terminación como un adjetivo: der erste Tag, im dritten Stock.',
	'Ordinaux : vier → vierte, zwanzig → zwanzigste. Particuliers : erste, dritte, siebte, achte. Terminaison comme un adjectif : der erste Tag, im dritten Stock.',
	'Sıra sayıları: vier → vierte, zwanzig → zwanzigste. Özel: erste, dritte, siebte, achte. Sıfat gibi ek alır: der erste Tag, im dritten Stock.',
	'Ordinale: vier → vierte, zwanzig → zwanzigste. Speciale: erste, dritte, siebte, achte. Terminația ca la adjectiv: der erste Tag, im dritten Stock.',
	"Tartib sonlar: vier → vierte, zwanzig → zwanzigste. Alohida: erste, dritte, siebte, achte. Sifat kabi qo'shimcha oladi: der erste Tag, im dritten Stock.",
	'क्रमसूचक: vier → vierte, zwanzig → zwanzigste। खास: erste, dritte, siebte, achte। अंत विशेषण जैसा: der erste Tag, im dritten Stock।',
	'الأعداد الترتيبية: vier → vierte، zwanzig → zwanzigste. وخاصة: erste، dritte، siebte، achte. ونهايتها كالصفة: der erste Tag، im dritten Stock.'
], [
	ex('Wir wohnen im dritten Stock.', t11('Мы живём на третьем этаже.', 'Ми живемо на третьому поверсі.', 'We live on the third floor.', 'Mieszkamy na trzecim piętrze.', 'Vivimos en el tercer piso.', 'Nous habitons au troisième étage.', 'Üçüncü katta oturuyoruz.', 'Locuim la etajul trei.', 'Biz uchinchi qavatda yashaymiz.', 'हम तीसरी मंज़िल पर रहते हैं।', 'نسكن في الطابق الثالث.')),
	ex('Das ist sein zwanzigster Geburtstag.', t11('Это его двадцатый день рождения.', 'Це його двадцятий день народження.', 'It’s his twentieth birthday.', 'To jego dwudzieste urodziny.', 'Es su vigésimo cumpleaños.', 'C’est son vingtième anniversaire.', 'Bu onun yirminci doğum günü.', 'E a douăzecea lui aniversare.', "Bu uning yigirmanchi tug'ilgan kuni.", 'यह उसका बीसवाँ जन्मदिन है।', 'هذا عيد ميلاده العشرون.'))
])

const datePoint = pt(['der dritte Mai, но am dritten Mai', 'der dritte Mai, але am dritten Mai', 'der dritte Mai, but am dritten Mai', 'der dritte Mai, ale am dritten Mai', 'der dritte Mai, pero am dritten Mai', 'der dritte Mai, mais am dritten Mai', 'der dritte Mai, ama am dritten Mai', 'der dritte Mai, dar am dritten Mai', 'der dritte Mai, lekin am dritten Mai', 'der dritte Mai, लेकिन am dritten Mai', 'der dritte Mai لكن am dritten Mai'], [
	'Какое число: Heute ist der dritte Mai (-te). Когда: am dritten Mai (-ten). На письме: der 3. Mai.',
	'Яке число: Heute ist der dritte Mai (-te). Коли: am dritten Mai (-ten). На письмі: der 3. Mai.',
	'What date: Heute ist der dritte Mai (-te). When: am dritten Mai (-ten). Written: der 3. Mai.',
	'Jaka data: Heute ist der dritte Mai (-te). Kiedy: am dritten Mai (-ten). Na piśmie: der 3. Mai.',
	'Qué fecha: Heute ist der dritte Mai (-te). Cuándo: am dritten Mai (-ten). Por escrito: der 3. Mai.',
	'Quelle date : Heute ist der dritte Mai (-te). Quand : am dritten Mai (-ten). À l’écrit : der 3. Mai.',
	'Hangi tarih: Heute ist der dritte Mai (-te). Ne zaman: am dritten Mai (-ten). Yazıda: der 3. Mai.',
	'Ce dată: Heute ist der dritte Mai (-te). Când: am dritten Mai (-ten). În scris: der 3. Mai.',
	"Qaysi sana: Heute ist der dritte Mai (-te). Qachon: am dritten Mai (-ten). Yozuvda: der 3. Mai.",
	'कौन-सी तारीख: Heute ist der dritte Mai (-te)। कब: am dritten Mai (-ten)। लिखने में: der 3. Mai।',
	'أي تاريخ: Heute ist der dritte Mai (-te). ومتى: am dritten Mai (-ten). وكتابةً: der 3. Mai.'
], [
	ex('Ich habe am vierten April Geburtstag.', t11('У меня день рождения четвёртого апреля.', 'У мене день народження четвертого квітня.', 'My birthday is on the fourth of April.', 'Mam urodziny czwartego kwietnia.', 'Mi cumpleaños es el cuatro de abril.', 'Mon anniversaire est le quatre avril.', 'Doğum günüm 4 Nisan’da.', 'Ziua mea e pe patru aprilie.', "Tug'ilgan kunim 4-aprelda.", 'मेरा जन्मदिन चार अप्रैल को है।', 'عيد ميلادي في الرابع من أبريل.'))
])

const clockPoint = pt(['halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30', 'halb vier = 3:30'], [
	'В разговоре: Viertel nach drei = 3:15, halb vier = 3:30 (половина четвёртого), Viertel vor vier = 3:45. Официально: 14:20 = vierzehn Uhr zwanzig.',
	'У розмові: Viertel nach drei = 3:15, halb vier = 3:30 (пів на четверту), Viertel vor vier = 3:45. Офіційно: 14:20 = vierzehn Uhr zwanzig.',
	'Spoken: Viertel nach drei = 3:15, halb vier = 3:30 (literally "half to four"), Viertel vor vier = 3:45. Official: 14:20 = vierzehn Uhr zwanzig.',
	'W mowie: Viertel nach drei = 3:15, halb vier = 3:30 (wpół do czwartej), Viertel vor vier = 3:45. Oficjalnie: 14:20 = vierzehn Uhr zwanzig.',
	'Hablado: Viertel nach drei = 3:15, halb vier = 3:30 (literalmente "media hacia las cuatro"), Viertel vor vier = 3:45. Oficial: 14:20 = vierzehn Uhr zwanzig.',
	'À l’oral : Viertel nach drei = 3 h 15, halb vier = 3 h 30 (la demie avant quatre), Viertel vor vier = 3 h 45. Officiel : 14 h 20 = vierzehn Uhr zwanzig.',
	'Konuşmada: Viertel nach drei = 3:15, halb vier = 3:30 (dörde yarım var), Viertel vor vier = 3:45. Resmî: 14:20 = vierzehn Uhr zwanzig.',
	'Vorbit: Viertel nach drei = 3:15, halb vier = 3:30 (jumătate spre patru), Viertel vor vier = 3:45. Oficial: 14:20 = vierzehn Uhr zwanzig.',
	"Og'zaki: Viertel nach drei = 3:15, halb vier = 3:30 (to'rtga yarim), Viertel vor vier = 3:45. Rasmiy: 14:20 = vierzehn Uhr zwanzig.",
	'बोलचाल में: Viertel nach drei = 3:15, halb vier = 3:30 (साढ़े तीन), Viertel vor vier = 3:45। औपचारिक: 14:20 = vierzehn Uhr zwanzig।',
	'في الكلام: Viertel nach drei = 3:15، halb vier = 3:30 (النصف قبل الرابعة)، Viertel vor vier = 3:45. ورسمياً: 14:20 = vierzehn Uhr zwanzig.'
], [
	ex('Der Wecker klingelt um halb sieben.', t11('Будильник звонит в половине седьмого.', 'Будильник дзвонить о пів на сьому.', 'The alarm goes off at half past six.', 'Budzik dzwoni o wpół do siódmej.', 'El despertador suena a las seis y media.', 'Le réveil sonne à six heures et demie.', 'Çalar saat altı buçukta çalıyor.', 'Ceasul sună la șase și jumătate.', 'Budilnik olti yarimda jiringlaydi.', 'अलार्म साढ़े छह बजे बजता है।', 'يرن المنبه في السادسة والنصف.'))
])

const quests = {
	'calendar-valley-one': { title: t11('Первый, второй, третий', 'Перший, другий, третій', 'First, second, third', 'Pierwszy, drugi, trzeci', 'Primero, segundo, tercero', 'Premier, deuxième, troisième', 'Birinci, ikinci, üçüncü', 'Primul, al doilea, al treilea', 'Birinchi, ikkinchi, uchinchi', 'पहला, दूसरा, तीसरा', 'الأول والثاني والثالث'), points: [ordinalPoint] },
	'calendar-valley-two': { title: t11('Двадцатый и дальше', 'Двадцятий і далі', 'Twentieth and beyond', 'Dwudziesty i dalej', 'Vigésimo y más', 'Vingtième et au-delà', 'Yirminci ve sonrası', 'Al douăzecilea și mai departe', 'Yigirmanchi va undan keyin', 'बीसवाँ और आगे', 'العشرون وما بعده'), points: [ordinalPoint] },
	'calendar-valley-three': { title: t11('Какое сегодня число?', 'Яке сьогодні число?', 'What’s the date today?', 'Którego dziś mamy?', '¿Qué fecha es hoy?', 'Quelle est la date aujourd’hui ?', 'Bugün ayın kaçı?', 'Ce dată e azi?', 'Bugun nechanchi sana?', 'आज कौन-सी तारीख है?', 'ما تاريخ اليوم؟'), points: [datePoint] },
	'calendar-valley-four': { title: t11('Когда? am ersten Mai', 'Коли? am ersten Mai', 'When? am ersten Mai', 'Kiedy? am ersten Mai', '¿Cuándo? am ersten Mai', 'Quand ? am ersten Mai', 'Ne zaman? am ersten Mai', 'Când? am ersten Mai', 'Qachon? am ersten Mai', 'कब? am ersten Mai', 'متى؟ am ersten Mai'), points: [datePoint, pt('vom ... bis zum', [
		'Срок: vom ersten bis zum fünften Mai (с первого по пятое мая).',
		'Строк: vom ersten bis zum fünften Mai (з першого по п’яте травня).',
		'A period: vom ersten bis zum fünften Mai (from the 1st to the 5th of May).',
		'Okres: vom ersten bis zum fünften Mai (od pierwszego do piątego maja).',
		'Un periodo: vom ersten bis zum fünften Mai (del uno al cinco de mayo).',
		'Une période : vom ersten bis zum fünften Mai (du premier au cinq mai).',
		'Süre: vom ersten bis zum fünften Mai (1 Mayıs’tan 5 Mayıs’a kadar).',
		'Un interval: vom ersten bis zum fünften Mai (de la întâi până pe cinci mai).',
		"Muddat: vom ersten bis zum fünften Mai (1-maydan 5-maygacha).",
		'अवधि: vom ersten bis zum fünften Mai (पहली से पाँच मई तक)।',
		'المدة: vom ersten bis zum fünften Mai (من الأول حتى الخامس من مايو).'
	], [ex('Der Urlaub ist vom ersten bis zum fünfzehnten August.', t11('Отпуск с первого по пятнадцатое августа.', 'Відпустка з першого по п’ятнадцяте серпня.', 'The holiday is from the 1st to the 15th of August.', 'Urlop jest od pierwszego do piętnastego sierpnia.', 'Las vacaciones son del uno al quince de agosto.', 'Les vacances vont du premier au quinze août.', 'Tatil 1 ile 15 Ağustos arasında.', 'Concediul e de la întâi până pe cincisprezece august.', "Ta'til 1-avgustdan 15-avgustgacha.", 'छुट्टी पहली से पंद्रह अगस्त तक है।', 'الإجازة من الأول حتى الخامس عشر من أغسطس.'))])] },
	'calendar-valley-five': { title: t11('Который час: официально', 'Котра година: офіційно', 'Telling the time: official', 'Która godzina: oficjalnie', 'La hora: oficial', 'L’heure : officielle', 'Saat: resmî', 'Ora: oficial', 'Soat: rasmiy', 'समय: औपचारिक', 'الوقت: رسمياً'), points: [pt(['um + время, без um для длительности', 'um + час, без um для тривалості', 'um + time, no um for duration', 'um + godzina, bez um przy czasie trwania', 'um + hora, sin um para la duración', 'um + heure, sans um pour la durée', 'Saat için um, süre için um yok', 'um + oră, fără um pentru durată', "um + vaqt, davomiylik uchun um yo'q", 'um + समय, अवधि के लिए um नहीं', 'um + الساعة، وبدون um للمدة'], [
		'Когда: um acht Uhr. Сколько длится, без um: zwei Stunden, fünf Minuten.',
		'Коли: um acht Uhr. Скільки триває, без um: zwei Stunden, fünf Minuten.',
		'When: um acht Uhr. How long, no um: zwei Stunden, fünf Minuten.',
		'Kiedy: um acht Uhr. Jak długo, bez um: zwei Stunden, fünf Minuten.',
		'Cuándo: um acht Uhr. Cuánto dura, sin um: zwei Stunden, fünf Minuten.',
		'Quand : um acht Uhr. Combien de temps, sans um : zwei Stunden, fünf Minuten.',
		'Ne zaman: um acht Uhr. Ne kadar sürer, um yok: zwei Stunden, fünf Minuten.',
		'Când: um acht Uhr. Cât durează, fără um: zwei Stunden, fünf Minuten.',
		"Qachon: um acht Uhr. Qancha davom etadi, um siz: zwei Stunden, fünf Minuten.",
		'कब: um acht Uhr। कितनी देर, बिना um: zwei Stunden, fünf Minuten।',
		'متى: um acht Uhr. وكم يستغرق بدون um: zwei Stunden، fünf Minuten.'
	], [ex('Der Zug fährt um vierzehn Uhr zwanzig ab.', t11('Поезд отправляется в 14:20.', 'Потяг вирушає о 14:20.', 'The train leaves at 14:20.', 'Pociąg odjeżdża o 14:20.', 'El tren sale a las 14:20.', 'Le train part à 14 h 20.', 'Tren 14.20’de kalkıyor.', 'Trenul pleacă la 14:20.', "Poyezd 14:20 da jo'naydi.", 'ट्रेन 14:20 पर चलती है।', 'ينطلق القطار في 14:20.'))])] },
	'calendar-valley-six': { title: t11('Половина четвёртого: halb vier', 'Пів на четверту: halb vier', 'Half past three: halb vier', 'Wpół do czwartej: halb vier', 'Las tres y media: halb vier', 'Trois heures et demie : halb vier', 'Üç buçuk: halb vier', 'Trei și jumătate: halb vier', 'Uch yarim: halb vier', 'साढ़े तीन: halb vier', 'الثالثة والنصف: halb vier'), points: [clockPoint] },
	'calendar-valley-seven': { title: t11('Практика: запись к врачу', 'Практика: запис до лікаря', 'Practice: a doctor’s appointment', 'Praktyka: wizyta u lekarza', 'Práctica: cita médica', 'Pratique : rendez-vous chez le médecin', 'Pratik: doktor randevusu', 'Practică: programare la medic', 'Mashq: shifokorga yozilish', 'अभ्यास: डॉक्टर की अपॉइंटमेंट', 'تدريب: موعد عند الطبيب'), points: [pt(noRules, [
		'Сначала когда, потом что: Am Mittwoch um zehn habe ich einen Termin. Глагол сразу после времени.',
		'Спочатку коли, потім що: Am Mittwoch um zehn habe ich einen Termin. Дієслово одразу після часу.',
		'First when, then what: Am Mittwoch um zehn habe ich einen Termin. The verb comes right after the time.',
		'Najpierw kiedy, potem co: Am Mittwoch um zehn habe ich einen Termin. Czasownik zaraz po czasie.',
		'Primero cuándo, luego qué: Am Mittwoch um zehn habe ich einen Termin. El verbo justo después del tiempo.',
		'D’abord quand, puis quoi : Am Mittwoch um zehn habe ich einen Termin. Le verbe juste après le temps.',
		'Önce ne zaman, sonra ne: Am Mittwoch um zehn habe ich einen Termin. Fiil zamandan hemen sonra.',
		'Întâi când, apoi ce: Am Mittwoch um zehn habe ich einen Termin. Verbul imediat după timp.',
		"Avval qachon, keyin nima: Am Mittwoch um zehn habe ich einen Termin. Fe'l vaqtdan keyin darhol.",
		'पहले कब, फिर क्या: Am Mittwoch um zehn habe ich einen Termin। क्रिया समय के ठीक बाद।',
		'أولاً متى ثم ماذا: Am Mittwoch um zehn habe ich einen Termin. والفعل بعد الزمن مباشرة.'
	], [ex('Haben Sie am Mittwoch um halb zehn Zeit?', t11('У вас есть время в среду в половине десятого?', 'У вас є час у середу о пів на десяту?', 'Are you free on Wednesday at half past nine?', 'Czy ma pan czas w środę o wpół do dziesiątej?', '¿Tiene tiempo el miércoles a las nueve y media?', 'Vous êtes libre mercredi à neuf heures et demie ?', 'Çarşamba dokuz buçukta vaktiniz var mı?', 'Aveți timp miercuri la nouă și jumătate?', "Chorshanba kuni to'qqiz yarimda vaqtingiz bormi?", 'क्या आपके पास बुधवार साढ़े नौ बजे समय है?', 'هل عندك وقت يوم الأربعاء في التاسعة والنصف؟'))])] },
	'calendar-valley-eight': { title: t11('Практика: расписание поездов', 'Практика: розклад потягів', 'Practice: train timetable', 'Praktyka: rozkład pociągów', 'Práctica: horario de trenes', 'Pratique : horaires des trains', 'Pratik: tren tarifesi', 'Practică: mersul trenurilor', 'Mashq: poyezdlar jadvali', 'अभ्यास: ट्रेन समय-सारणी', 'تدريب: جدول القطارات'), points: [clockPoint] },
	'calendar-valley-nine': { title: t11('Повторение: даты и время', 'Повторення: дати й час', 'Review: dates and time', 'Powtórka: daty i godziny', 'Repaso: fechas y horas', 'Révision : dates et heures', 'Tekrar: tarih ve saat', 'Recapitulare: date și ore', 'Takrorlash: sana va vaqt', 'दोहराव: तारीख और समय', 'مراجعة: التواريخ والوقت'), points: [ordinalPoint, datePoint, clockPoint] },
	'calendar-valley-ten': { title: finalTitle, points: [datePoint, clockPoint] }
}

module.exports = quests
