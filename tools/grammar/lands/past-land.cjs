// Грамматика к заданиям земли past-land (Perfekt)
const { ex, t11, pt, noRules } = require('../lib.cjs')

const formPoint = pt(['Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt : haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t', 'Perfekt: haben + ge...t'], [
	'Прошедшее в разговоре: haben на втором месте, а глагол в форме ge...t уходит в конец: spielen → gespielt.',
	'Минуле в розмові: haben на другому місці, а дієслово у формі ge...t іде в кінець: spielen → gespielt.',
	'Spoken past: haben in second place, and the verb in its ge...t form at the end: spielen → gespielt.',
	'Przeszłość w mowie: haben na drugim miejscu, a czasownik w formie ge...t na końcu: spielen → gespielt.',
	'El pasado hablado: haben en segundo lugar y el verbo en forma ge...t al final: spielen → gespielt.',
	'Le passé à l’oral : haben en deuxième position, et le verbe en ge...t à la fin : spielen → gespielt.',
	'Konuşmada geçmiş: haben ikinci sırada, fiil ge...t biçiminde sonda: spielen → gespielt.',
	'Trecutul vorbit: haben pe locul doi, iar verbul în forma ge...t la final: spielen → gespielt.',
	"Og'zaki o'tgan zamon: haben ikkinchi o'rinda, fe'l ge...t shaklida oxirida: spielen → gespielt.",
	'बोलचाल का भूतकाल: haben दूसरे स्थान पर, और क्रिया ge...t रूप में अंत में: spielen → gespielt।',
	'الماضي في الكلام: haben في المكان الثاني، والفعل بصيغة ge...t في الآخر: spielen → gespielt.'
], [
	ex('Ich habe Fußball gespielt.', t11('Я играл в футбол.', 'Я грав у футбол.', 'I played football.', 'Grałem w piłkę nożną.', 'Jugué al fútbol.', 'J’ai joué au foot.', 'Futbol oynadım.', 'Am jucat fotbal.', "Men futbol o'ynadim.", 'मैंने फ़ुटबॉल खेला।', 'لعبت كرة القدم.')),
	ex('Wir haben Deutsch gelernt.', t11('Мы учили немецкий.', 'Ми вчили німецьку.', 'We learned German.', 'Uczyliśmy się niemieckiego.', 'Aprendimos alemán.', 'Nous avons appris l’allemand.', 'Almanca öğrendik.', 'Am învățat germana.', "Biz nemis tilini o'rgandik.", 'हमने जर्मन सीखी।', 'تعلمنا الألمانية.'))
])

const irregularPoint = pt(['Неправильные: ge...en', 'Неправильні: ge...en', 'Irregular: ge...en', 'Nieregularne: ge...en', 'Irregulares: ge...en', 'Irréguliers : ge...en', 'Düzensiz: ge...en', 'Neregulate: ge...en', "Noto'g'ri: ge...en", 'अनियमित: ge...en', 'الشاذة: ge...en'], [
	'У многих частых глаголов форма на -en, часто с другой гласной: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Их учим.',
	'У багатьох частих дієслів форма на -en, часто з іншою голосною: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Їх вчимо.',
	'Many common verbs end in -en, often with a different vowel: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Learn them.',
	'Wiele częstych czasowników kończy się na -en, często z inną samogłoską: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Trzeba je znać.',
	'Muchos verbos frecuentes terminan en -en, a menudo con otra vocal: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Hay que aprenderlos.',
	'Beaucoup de verbes courants finissent en -en, souvent avec une autre voyelle : trinken → getrunken, lesen → gelesen, schreiben → geschrieben. À apprendre.',
	'Sık kullanılan birçok fiil -en ile biter, çoğu zaman ünlüsü de değişir: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Ezberlenir.',
	'Multe verbe frecvente se termină în -en, des cu altă vocală: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Se învață.',
	"Ko'p ishlatiladigan fe'llar -en bilan tugaydi, ko'pincha unlisi ham o'zgaradi: trinken → getrunken, lesen → gelesen, schreiben → geschrieben. Ularni yodlaymiz.",
	'कई आम क्रियाएँ -en पर खत्म होती हैं, अक्सर स्वर भी बदलता है: trinken → getrunken, lesen → gelesen, schreiben → geschrieben। इन्हें याद करो।',
	'كثير من الأفعال الشائعة تنتهي بـ -en، وغالباً يتغير حرفها: trinken → getrunken، lesen → gelesen، schreiben → geschrieben. نحفظها.'
], [
	ex('Ich habe einen Kaffee getrunken.', t11('Я выпил кофе.', 'Я випив каву.', 'I drank a coffee.', 'Wypiłem kawę.', 'Me tomé un café.', 'J’ai bu un café.', 'Bir kahve içtim.', 'Am băut o cafea.', 'Men qahva ichdim.', 'मैंने एक कॉफ़ी पी।', 'شربت قهوة.')),
	ex('Ich habe das Buch gelesen.', t11('Я прочитал книгу.', 'Я прочитав книжку.', 'I read the book.', 'Przeczytałem książkę.', 'Leí el libro.', 'J’ai lu le livre.', 'Kitabı okudum.', 'Am citit cartea.', "Men kitobni o'qidim.", 'मैंने किताब पढ़ी।', 'قرأت الكتاب.'))
])

const seinPoint = pt(['sein для движения', 'sein для руху', 'sein for movement', 'sein przy ruchu', 'sein para el movimiento', 'sein pour le mouvement', 'Hareket için sein', 'sein pentru mișcare', 'Harakat uchun sein', 'गति के लिए sein', 'sein للحركة'], [
	'Если человек перемещается (gehen, fahren, kommen) или меняет состояние (aufwachen), вместо haben ставим sein.',
	'Якщо людина переміщується (gehen, fahren, kommen) або змінює стан (aufwachen), замість haben ставимо sein.',
	'If you move from place to place (gehen, fahren, kommen) or change state (aufwachen), use sein instead of haben.',
	'Jeśli ktoś się przemieszcza (gehen, fahren, kommen) albo zmienia stan (aufwachen), zamiast haben stawiamy sein.',
	'Si alguien se desplaza (gehen, fahren, kommen) o cambia de estado (aufwachen), se usa sein en lugar de haben.',
	'Si on se déplace (gehen, fahren, kommen) ou si on change d’état (aufwachen), on met sein au lieu de haben.',
	'Biri yer değiştiriyorsa (gehen, fahren, kommen) ya da durum değiştiriyorsa (aufwachen), haben yerine sein kullanılır.',
	'Dacă cineva se deplasează (gehen, fahren, kommen) sau își schimbă starea (aufwachen), în loc de haben punem sein.',
	"Odam bir joydan boshqasiga o'tsa (gehen, fahren, kommen) yoki holatini o'zgartirsa (aufwachen), haben o'rniga sein qo'yiladi.",
	'अगर कोई जगह बदलता है (gehen, fahren, kommen) या उसकी हालत बदलती है (aufwachen), तो haben की जगह sein।',
	'إذا تنقل الشخص من مكان إلى آخر (gehen، fahren، kommen) أو تغيرت حالته (aufwachen) نستعمل sein بدل haben.'
], [
	ex('Ich bin ins Kino gegangen.', t11('Я ходил в кино.', 'Я ходив у кіно.', 'I went to the cinema.', 'Poszedłem do kina.', 'Fui al cine.', 'Je suis allé au cinéma.', 'Sinemaya gittim.', 'Am mers la cinema.', 'Men kinoga bordim.', 'मैं सिनेमा गया।', 'ذهبت إلى السينما.')),
	ex('Wir sind zum Flughafen gefahren.', t11('Мы поехали в аэропорт.', 'Ми поїхали в аеропорт.', 'We drove to the airport.', 'Pojechaliśmy na lotnisko.', 'Fuimos al aeropuerto.', 'Nous sommes allés à l’aéroport.', 'Havalimanına gittik.', 'Am mers la aeroport.', 'Biz aeroportga bordik.', 'हम हवाई अड्डे गए।', 'ذهبنا إلى المطار.'))
])

const separablePoint = pt(['ge в середине', 'ge всередині', 'ge in the middle', 'ge w środku', 'ge en medio', 'ge au milieu', 'ge ortada', 'ge la mijloc', "ge o'rtada", 'ge बीच में', 'ge في الوسط'], [
	'У отделяемых глаголов ge встаёт между приставкой и основой: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'У відокремлюваних дієслів ge стає між префіксом і основою: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'With separable verbs ge goes between the prefix and the stem: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'W czasownikach rozdzielnych ge stoi między przedrostkiem a tematem: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'En los verbos separables ge va entre el prefijo y la raíz: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'Avec les verbes séparables, ge se place entre le préfixe et le radical : aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'Ayrılabilen fiillerde ge ön ek ile kök arasına girer: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	'La verbele separabile ge stă între prefix și rădăcină: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.',
	"Ajraladigan fe'llarda ge old qo'shimcha va o'zak orasiga kiradi: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen.",
	'अलग होने वाली क्रियाओं में ge उपसर्ग और मूल के बीच आता है: aufwachen → aufgewacht, anrufen → angerufen, einladen → eingeladen।',
	'في الأفعال المنفصلة تقع ge بين السابقة والجذر: aufwachen → aufgewacht، anrufen → angerufen، einladen → eingeladen.'
], [
	ex('Er hat den Chef angerufen.', t11('Он позвонил начальнику.', 'Він зателефонував начальнику.', 'He called the boss.', 'Zadzwonił do szefa.', 'Llamó al jefe.', 'Il a appelé le chef.', 'Şefi aradı.', 'L-a sunat pe șef.', "U boshliqqa qo'ng'iroq qildi.", 'उसने बॉस को फ़ोन किया।', 'اتصل بالمدير.')),
	ex('Wir haben Bier mitgebracht.', t11('Мы принесли пиво.', 'Ми принесли пиво.', 'We brought beer.', 'Przynieśliśmy piwo.', 'Trajimos cerveza.', 'Nous avons apporté de la bière.', 'Bira getirdik.', 'Am adus bere.', 'Biz pivo olib keldik.', 'हम बियर लाए।', 'أحضرنا البيرة.'))
])

const insepPoint = pt(['Без ge: be-, ver-, er-', 'Без ge: be-, ver-, er-', 'No ge: be-, ver-, er-', 'Bez ge: be-, ver-, er-', 'Sin ge: be-, ver-, er-', 'Sans ge : be-, ver-, er-', 'ge yok: be-, ver-, er-', 'Fără ge: be-, ver-, er-', 'ge siz: be-, ver-, er-', 'बिना ge: be-, ver-, er-', 'بدون ge: be- وver- وer-'], [
	'Если приставка не отделяется (be-, ver-, er-, ent-), ge не добавляем: besuchen → besucht, verstehen → verstanden. Никакого ge-ge.',
	'Якщо префікс не відокремлюється (be-, ver-, er-, ent-), ge не додаємо: besuchen → besucht, verstehen → verstanden. Ніякого ge-ge.',
	'If the prefix doesn’t separate (be-, ver-, er-, ent-), don’t add ge: besuchen → besucht, verstehen → verstanden.',
	'Jeśli przedrostek się nie odrywa (be-, ver-, er-, ent-), nie dodajemy ge: besuchen → besucht, verstehen → verstanden.',
	'Si el prefijo no se separa (be-, ver-, er-, ent-), no se añade ge: besuchen → besucht, verstehen → verstanden.',
	'Si le préfixe ne se sépare pas (be-, ver-, er-, ent-), on n’ajoute pas ge : besuchen → besucht, verstehen → verstanden.',
	'Ön ek ayrılmıyorsa (be-, ver-, er-, ent-) ge eklenmez: besuchen → besucht, verstehen → verstanden.',
	'Dacă prefixul nu se desparte (be-, ver-, er-, ent-), nu adăugăm ge: besuchen → besucht, verstehen → verstanden.',
	"Old qo'shimcha ajralmasa (be-, ver-, er-, ent-), ge qo'shilmaydi: besuchen → besucht, verstehen → verstanden.",
	'अगर उपसर्ग अलग नहीं होता (be-, ver-, er-, ent-), तो ge नहीं जोड़ते: besuchen → besucht, verstehen → verstanden।',
	'إذا كانت السابقة لا تنفصل (be- وver- وer- وent-) لا نضيف ge: besuchen → besucht، verstehen → verstanden.'
], [
	ex('Ich habe meine Oma besucht.', t11('Я навестил бабушку.', 'Я відвідав бабусю.', 'I visited my grandma.', 'Odwiedziłem babcię.', 'Visité a mi abuela.', 'J’ai rendu visite à ma grand-mère.', 'Büyükannemi ziyaret ettim.', 'Am vizitat-o pe bunica.', "Buvimni ko'rgani bordim.", 'मैं अपनी दादी से मिलने गया।', 'زرت جدتي.')),
	ex('Hast du alles verstanden?', t11('Ты всё понял?', 'Ти все зрозумів?', 'Did you understand everything?', 'Zrozumiałeś wszystko?', '¿Lo has entendido todo?', 'Tu as tout compris ?', 'Her şeyi anladın mı?', 'Ai înțeles tot?', 'Hammasini tushundingmi?', 'क्या तुमने सब समझ लिया?', 'هل فهمت كل شيء؟'))
])

const quests = {
	'past-one': {
		title: t11('Основы Perfekt', 'Основи Perfekt', 'Perfekt basics', 'Podstawy Perfekt', 'Bases del Perfekt', 'Les bases du Perfekt', 'Perfekt temelleri', 'Bazele Perfekt', 'Perfekt asoslari', 'Perfekt की बुनियाद', 'أساسيات Perfekt'),
		points: [formPoint]
	},
	'past-two': {
		title: t11('Perfekt с sein', 'Perfekt із sein', 'Perfekt with sein', 'Perfekt z sein', 'Perfekt con sein', 'Le Perfekt avec sein', 'sein ile Perfekt', 'Perfekt cu sein', 'sein bilan Perfekt', 'sein के साथ Perfekt', 'Perfekt مع sein'),
		points: [seinPoint]
	},
	'past-three': {
		title: t11('Мой день в Perfekt', 'Мій день у Perfekt', 'My day in Perfekt', 'Mój dzień w Perfekt', 'Mi día en Perfekt', 'Ma journée au Perfekt', 'Günüm Perfekt ile', 'Ziua mea în Perfekt', 'Kunim Perfekt da', 'Perfekt में मेरा दिन', 'يومي في Perfekt'),
		points: [separablePoint, irregularPoint]
	},
	'past-four': {
		title: t11('Неотделяемые приставки', 'Невідокремлювані префікси', 'Inseparable prefixes', 'Przedrostki nierozdzielne', 'Prefijos inseparables', 'Préfixes inséparables', 'Ayrılmayan ön ekler', 'Prefixe neseparabile', "Ajralmaydigan old qo'shimchalar", 'अलग न होने वाले उपसर्ग', 'السوابق غير المنفصلة'),
		points: [insepPoint]
	},
	'past-five': {
		title: t11('Ресторан в Perfekt', 'Ресторан у Perfekt', 'At the restaurant in Perfekt', 'Restauracja w Perfekt', 'El restaurante en Perfekt', 'Au restaurant au Perfekt', 'Perfekt ile restoran', 'Restaurantul în Perfekt', 'Perfekt da restoran', 'Perfekt में रेस्टोरेंट', 'المطعم في Perfekt'),
		points: [insepPoint, irregularPoint]
	},
	'past-six': {
		title: t11('Путешествие в Perfekt', 'Подорож у Perfekt', 'Travel in Perfekt', 'Podróż w Perfekt', 'El viaje en Perfekt', 'Le voyage au Perfekt', 'Perfekt ile seyahat', 'Călătoria în Perfekt', 'Perfekt da sayohat', 'Perfekt में यात्रा', 'السفر في Perfekt'),
		points: [formPoint, seinPoint]
	},
	'past-seven': {
		title: t11('Офис в Perfekt', 'Офіс у Perfekt', 'The office in Perfekt', 'Biuro w Perfekt', 'La oficina en Perfekt', 'Le bureau au Perfekt', 'Perfekt ile ofis', 'Biroul în Perfekt', 'Perfekt da ofis', 'Perfekt में दफ़्तर', 'المكتب في Perfekt'),
		points: [irregularPoint, separablePoint]
	},
	'past-eight': {
		title: t11('Учёба в Perfekt', 'Навчання у Perfekt', 'Studying in Perfekt', 'Nauka w Perfekt', 'Los estudios en Perfekt', 'Les études au Perfekt', 'Perfekt ile ders', 'Studiul în Perfekt', "Perfekt da o'qish", 'Perfekt में पढ़ाई', 'الدراسة في Perfekt'),
		points: [insepPoint, irregularPoint]
	},
	'past-nine': {
		title: t11('Вечеринка в Perfekt', 'Вечірка у Perfekt', 'The party in Perfekt', 'Impreza w Perfekt', 'La fiesta en Perfekt', 'La fête au Perfekt', 'Perfekt ile parti', 'Petrecerea în Perfekt', 'Perfekt da bazm', 'Perfekt में पार्टी', 'الحفلة في Perfekt'),
		points: [separablePoint]
	},
	'past-ten': {
		title: t11('Город в Perfekt', 'Місто у Perfekt', 'The city in Perfekt', 'Miasto w Perfekt', 'La ciudad en Perfekt', 'La ville au Perfekt', 'Perfekt ile şehir', 'Orașul în Perfekt', 'Perfekt da shahar', 'Perfekt में शहर', 'المدينة في Perfekt'),
		points: [seinPoint, insepPoint]
	},
	'past-eleven': {
		title: t11('Семья в Perfekt', 'Сім’я у Perfekt', 'Family in Perfekt', 'Rodzina w Perfekt', 'La familia en Perfekt', 'La famille au Perfekt', 'Perfekt ile aile', 'Familia în Perfekt', 'Perfekt da oila', 'Perfekt में परिवार', 'العائلة في Perfekt'),
		points: [pt(noRules, [
			'Повторяем все три случая: besucht (без ge), gesehen (ge...en), mitgebracht (ge в середине).',
			'Повторюємо всі три випадки: besucht (без ge), gesehen (ge...en), mitgebracht (ge всередині).',
			'Review all three cases: besucht (no ge), gesehen (ge...en), mitgebracht (ge in the middle).',
			'Powtarzamy wszystkie trzy przypadki: besucht (bez ge), gesehen (ge...en), mitgebracht (ge w środku).',
			'Repasamos los tres casos: besucht (sin ge), gesehen (ge...en), mitgebracht (ge en medio).',
			'On révise les trois cas : besucht (sans ge), gesehen (ge...en), mitgebracht (ge au milieu).',
			'Üç durumu tekrar ediyoruz: besucht (ge yok), gesehen (ge...en), mitgebracht (ge ortada).',
			'Recapitulăm cele trei cazuri: besucht (fără ge), gesehen (ge...en), mitgebracht (ge la mijloc).',
			"Uchala holatni takrorlaymiz: besucht (ge siz), gesehen (ge...en), mitgebracht (ge o'rtada).",
			'तीनों हालात दोहराते हैं: besucht (बिना ge), gesehen (ge...en), mitgebracht (ge बीच में)।',
			'نراجع الحالات الثلاث: besucht (بدون ge)، gesehen (ge...en)، mitgebracht (ge في الوسط).'
		], [ex('Wir haben alte Fotos gesehen.', t11('Мы смотрели старые фотографии.', 'Ми дивилися старі фотографії.', 'We looked at old photos.', 'Oglądaliśmy stare zdjęcia.', 'Vimos fotos antiguas.', 'Nous avons regardé de vieilles photos.', 'Eski fotoğraflara baktık.', 'Ne-am uitat la poze vechi.', "Biz eski suratlarni ko'rdik.", 'हमने पुरानी तस्वीरें देखीं।', 'شاهدنا صوراً قديمة.'))])]
	},
	'past-twelve': {
		title: t11('Выходные: повторение Perfekt', 'Вихідні: повторення Perfekt', 'The weekend: Perfekt review', 'Weekend: powtórka Perfekt', 'El fin de semana: repaso del Perfekt', 'Le week-end : révision du Perfekt', 'Hafta sonu: Perfekt tekrarı', 'Weekendul: recapitulare Perfekt', 'Dam olish: Perfekt takrori', 'सप्ताहांत: Perfekt का दोहराव', 'عطلة نهاية الأسبوع: مراجعة Perfekt'),
		points: [formPoint, seinPoint, irregularPoint]
	}
}

module.exports = quests
