// Грамматика к заданиям земли task-tower (zu + Infinitiv, ohne ... zu, lassen)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const lustPoint = pt(['Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust, Zeit + zu', 'Lust وZeit + zu'], [
	'После Lust, Zeit, Angst, Möglichkeit стоит zu + инфинитив в самом конце. С приставкой zu внутри: aufzuräumen.',
	'Після Lust, Zeit, Angst, Möglichkeit стоїть zu + інфінітив у самому кінці. З префіксом zu всередині: aufzuräumen.',
	'After Lust, Zeit, Angst, Möglichkeit comes zu + infinitive at the very end. With a prefix zu goes inside: aufzuräumen.',
	'Po Lust, Zeit, Angst, Möglichkeit stoi zu + bezokolicznik na samym końcu. Z przedrostkiem zu w środku: aufzuräumen.',
	'Después de Lust, Zeit, Angst, Möglichkeit va zu + infinitivo al final. Con prefijo, zu va dentro: aufzuräumen.',
	'Après Lust, Zeit, Angst, Möglichkeit vient zu + infinitif tout à la fin. Avec un préfixe, zu se met à l’intérieur : aufzuräumen.',
	'Lust, Zeit, Angst, Möglichkeit’ten sonra en sonda zu + mastar gelir. Ön ekli fiilde zu içeride: aufzuräumen.',
	'După Lust, Zeit, Angst, Möglichkeit vine zu + infinitiv la final. Cu prefix, zu stă în interior: aufzuräumen.',
	"Lust, Zeit, Angst, Möglichkeit dan keyin eng oxirida zu + infinitiv. Old qo'shimcha bilan zu ichida: aufzuräumen.",
	'Lust, Zeit, Angst, Möglichkeit के बाद बिल्कुल अंत में zu + इन्फ़िनिटिव। उपसर्ग के साथ zu बीच में: aufzuräumen।',
	'بعد Lust وZeit وAngst وMöglichkeit يأتي zu + المصدر في آخر الجملة. ومع السابقة تكون zu في الداخل: aufzuräumen.'
], [ex('Ich habe keine Lust, heute zu arbeiten.', t11('У меня нет желания сегодня работать.', 'Я не маю бажання сьогодні працювати.', 'I don’t feel like working today.', 'Nie mam ochoty dziś pracować.', 'No tengo ganas de trabajar hoy.', 'Je n’ai pas envie de travailler aujourd’hui.', 'Bugün çalışmaya hiç hevesim yok.', 'N-am chef să lucrez azi.', 'Bugun ishlashga xohishim yo‘q.', 'आज मेरा काम करने का मन नहीं है।', 'ليست لدي رغبة في العمل اليوم.'))])

const esIstPoint = pt(['Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu', 'Es ist ... zu'], [
	'Es ist + прилагательное + zu + инфинитив: так говорят, что трудно, важно, опасно.',
	'Es ist + прикметник + zu + інфінітив: так кажуть, що важко, важливо, небезпечно.',
	'Es ist + adjective + zu + infinitive: to say something is hard, important, dangerous.',
	'Es ist + przymiotnik + zu + bezokolicznik: tak mówimy, że coś jest trudne, ważne, niebezpieczne.',
	'Es ist + adjetivo + zu + infinitivo: para decir que algo es difícil, importante, peligroso.',
	'Es ist + adjectif + zu + infinitif : pour dire que c’est difficile, important, dangereux.',
	'Es ist + sıfat + zu + mastar: bir şeyin zor, önemli, tehlikeli olduğunu söylemek için.',
	'Es ist + adjectiv + zu + infinitiv: ca să spui că e greu, important, periculos.',
	"Es ist + sifat + zu + infinitiv: biror narsa qiyin, muhim, xavfli ekanini aytish uchun.",
	'Es ist + विशेषण + zu + इन्फ़िनिटिव: यह कहने के लिए कि कुछ मुश्किल, ज़रूरी, खतरनाक है।',
	'Es ist + صفة + zu + مصدر: لنقول إن شيئاً صعب أو مهم أو خطر.'
], [ex('Es ist schwer, Deutsch zu lernen.', t11('Учить немецкий трудно.', 'Вчити німецьку важко.', 'It’s hard to learn German.', 'Trudno jest uczyć się niemieckiego.', 'Es difícil aprender alemán.', 'C’est difficile d’apprendre l’allemand.', 'Almanca öğrenmek zor.', 'E greu să înveți germana.', "Nemis tilini o'rganish qiyin.", 'जर्मन सीखना मुश्किल है।', 'تعلم الألمانية صعب.'))])

const versuchenPoint = pt(['versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen, vergessen + zu', 'versuchen وvergessen + zu'], [
	'После versuchen, vergessen, anfangen, aufhören тоже zu + инфинитив. После модальных глаголов zu не нужно.',
	'Після versuchen, vergessen, anfangen, aufhören теж zu + інфінітив. Після модальних дієслів zu не потрібне.',
	'After versuchen, vergessen, anfangen, aufhören also use zu + infinitive. After modal verbs there’s no zu.',
	'Po versuchen, vergessen, anfangen, aufhören też zu + bezokolicznik. Po czasownikach modalnych zu nie ma.',
	'Tras versuchen, vergessen, anfangen, aufhören también zu + infinitivo. Tras los modales no va zu.',
	'Après versuchen, vergessen, anfangen, aufhören aussi zu + infinitif. Après les modaux, pas de zu.',
	'versuchen, vergessen, anfangen, aufhören’dan sonra da zu + mastar. Modal fiillerden sonra zu yok.',
	'După versuchen, vergessen, anfangen, aufhören tot zu + infinitiv. După modale nu e zu.',
	"versuchen, vergessen, anfangen, aufhören dan keyin ham zu + infinitiv. Modal fe'llardan keyin zu yo'q.",
	'versuchen, vergessen, anfangen, aufhören के बाद भी zu + इन्फ़िनिटिव। मोडल क्रियाओं के बाद zu नहीं।',
	'بعد versuchen وvergessen وanfangen وaufhören أيضاً zu + المصدر. وبعد الأفعال المساعدة لا zu.'
], [ex('Ich versuche, weniger Kaffee zu trinken.', t11('Я стараюсь пить меньше кофе.', 'Я намагаюся пити менше кави.', 'I’m trying to drink less coffee.', 'Staram się pić mniej kawy.', 'Intento tomar menos café.', 'J’essaie de boire moins de café.', 'Daha az kahve içmeye çalışıyorum.', 'Încerc să beau mai puțină cafea.', 'Kamroq qahva ichishga harakat qilyapman.', 'मैं कम कॉफ़ी पीने की कोशिश कर रहा हूँ।', 'أحاول أن أشرب قهوة أقل.'))])

const ohnePoint = pt(['ohne ... zu: не сделав', 'ohne ... zu: не зробивши', 'ohne ... zu: without doing', 'ohne ... zu: nie robiąc', 'ohne ... zu: sin hacer', 'ohne ... zu : sans faire', 'ohne ... zu: -meden', 'ohne ... zu: fără să', 'ohne ... zu: ... qilmasdan', 'ohne ... zu: बिना ... किए', 'ohne ... zu: دون أن'], [
	'ohne ... zu значит «не делая чего-то». zu и инфинитив в конце, как в um ... zu.',
	'ohne ... zu означає «не роблячи чогось». zu та інфінітив у кінці, як в um ... zu.',
	'ohne ... zu means "without doing something". zu and the infinitive go at the end, as in um ... zu.',
	'ohne ... zu znaczy „nie robiąc czegoś”. zu i bezokolicznik na końcu, jak w um ... zu.',
	'ohne ... zu significa "sin hacer algo". zu y el infinitivo al final, como en um ... zu.',
	'ohne ... zu veut dire « sans faire quelque chose ». zu et l’infinitif à la fin, comme dans um ... zu.',
	'ohne ... zu "bir şeyi yapmadan" demektir. zu ve mastar sonda, um ... zu gibi.',
	'ohne ... zu înseamnă „fără să faci ceva”. zu și infinitivul la final, ca la um ... zu.',
	"ohne ... zu \"biror narsani qilmasdan\" degani. zu va infinitiv oxirida, um ... zu dagi kabi.",
	'ohne ... zu मतलब "कुछ किए बिना"। zu और इन्फ़िनिटिव अंत में, um ... zu की तरह।',
	'ohne ... zu تعني "دون أن يفعل شيئاً". وzu والمصدر في الآخر كما في um ... zu.'
], [ex('Er ging, ohne sich zu verabschieden.', t11('Он ушёл, не попрощавшись.', 'Він пішов, не попрощавшись.', 'He left without saying goodbye.', 'Wyszedł, nie żegnając się.', 'Se fue sin despedirse.', 'Il est parti sans dire au revoir.', 'Vedalaşmadan gitti.', 'A plecat fără să-și ia rămas bun.', 'U xayrlashmasdan ketdi.', 'वह बिना अलविदा कहे चला गया।', 'ذهب دون أن يودّع.'))])

const lassenPoint = pt(['lassen: делаю не сам', 'lassen: роблю не сам', 'lassen: having something done', 'lassen: zlecam komuś', 'lassen: hacer que otro lo haga', 'lassen : faire faire', 'lassen: başkasına yaptırmak', 'lassen: a pune pe altul să facă', 'lassen: boshqaga qildirish', 'lassen: किसी और से करवाना', 'lassen: أجعل غيري يفعل'], [
	'lassen + инфинитив без zu: делает кто-то другой. ich lasse, du lässt, er lässt.',
	'lassen + інфінітив без zu: робить хтось інший. ich lasse, du lässt, er lässt.',
	'lassen + infinitive with no zu: someone else does it. ich lasse, du lässt, er lässt.',
	'lassen + bezokolicznik bez zu: robi to ktoś inny. ich lasse, du lässt, er lässt.',
	'lassen + infinitivo sin zu: lo hace otra persona. ich lasse, du lässt, er lässt.',
	'lassen + infinitif sans zu : quelqu’un d’autre le fait. ich lasse, du lässt, er lässt.',
	'lassen + zu’suz mastar: başkası yapar. ich lasse, du lässt, er lässt.',
	'lassen + infinitiv fără zu: face altcineva. ich lasse, du lässt, er lässt.',
	"lassen + zu siz infinitiv: boshqa birov qiladi. ich lasse, du lässt, er lässt.",
	'lassen + बिना zu इन्फ़िनिटिव: कोई और करता है। ich lasse, du lässt, er lässt।',
	'lassen + المصدر بدون zu: يفعله شخص آخر. ich lasse، du lässt، er lässt.'
], [ex('Ich lasse mein Auto reparieren.', t11('Я отдаю машину в ремонт.', 'Я віддаю машину в ремонт.', 'I’m having my car repaired.', 'Oddaję samochód do naprawy.', 'Llevo el coche a reparar.', 'Je fais réparer ma voiture.', 'Arabamı tamir ettiriyorum.', 'Îmi duc mașina la reparat.', "Mashinamni ta'mirlatyapman.", 'मैं अपनी गाड़ी ठीक करवा रहा हूँ।', 'أُصلح سيارتي عند الميكانيكي.'))])

const T = (...v) => t11(...v)
const quests = {
	'task-tower-one': { title: T('Нет желания: Lust zu', 'Немає бажання: Lust zu', 'Don’t feel like: Lust zu', 'Brak ochoty: Lust zu', 'Sin ganas: Lust zu', 'Pas envie : Lust zu', 'Hevesim yok: Lust zu', 'N-am chef: Lust zu', "Xohish yo'q: Lust zu", 'मन नहीं: Lust zu', 'لا رغبة: Lust zu'), points: [lustPoint] },
	'task-tower-two': { title: T('Трудно, важно: Es ist ... zu', 'Важко, важливо: Es ist ... zu', 'Hard, important: Es ist ... zu', 'Trudno, ważne: Es ist ... zu', 'Difícil, importante: Es ist ... zu', 'Difficile, important : Es ist ... zu', 'Zor, önemli: Es ist ... zu', 'Greu, important: Es ist ... zu', 'Qiyin, muhim: Es ist ... zu', 'मुश्किल, ज़रूरी: Es ist ... zu', 'صعب، مهم: Es ist ... zu'), points: [esIstPoint] },
	'task-tower-three': { title: T('Пытаться, забыть, начать', 'Намагатися, забути, почати', 'Try, forget, start', 'Próbować, zapomnieć, zacząć', 'Intentar, olvidar, empezar', 'Essayer, oublier, commencer', 'Denemek, unutmak, başlamak', 'A încerca, a uita, a începe', 'Harakat qilish, unutish, boshlash', 'कोशिश, भूलना, शुरू करना', 'يحاول، ينسى، يبدأ'), points: [versuchenPoint] },
	'task-tower-four': { title: T('Не сделав: ohne ... zu', 'Не зробивши: ohne ... zu', 'Without doing: ohne ... zu', 'Nie robiąc: ohne ... zu', 'Sin hacer: ohne ... zu', 'Sans faire : ohne ... zu', 'Yapmadan: ohne ... zu', 'Fără să: ohne ... zu', 'Qilmasdan: ohne ... zu', 'बिना किए: ohne ... zu', 'دون أن: ohne ... zu'), points: [ohnePoint] },
	'task-tower-five': { title: T('Делаю не сам: lassen', 'Роблю не сам: lassen', 'Having it done: lassen', 'Zlecam: lassen', 'Que otro lo haga: lassen', 'Faire faire : lassen', 'Yaptırmak: lassen', 'Pun pe altul: lassen', 'Qildirish: lassen', 'करवाना: lassen', 'أجعل غيري يفعل: lassen'), points: [lassenPoint] },
	'task-tower-six': { title: T('Дела на выходные', 'Справи на вихідні', 'Weekend tasks', 'Sprawy na weekend', 'Tareas del fin de semana', 'Les tâches du week-end', 'Hafta sonu işleri', 'Treburi de weekend', 'Dam olish kunidagi ishlar', 'सप्ताहांत के काम', 'مهام عطلة نهاية الأسبوع'), points: [lustPoint, lassenPoint] },
	'task-tower-seven': { title: T('Практика: первый день на работе', 'Практика: перший день на роботі', 'Practice: first day at work', 'Praktyka: pierwszy dzień w pracy', 'Práctica: primer día de trabajo', 'Pratique : premier jour au travail', 'Pratik: işte ilk gün', 'Practică: prima zi la muncă', 'Mashq: ishdagi birinchi kun', 'अभ्यास: काम पर पहला दिन', 'تدريب: أول يوم في العمل'), points: [esIstPoint, versuchenPoint] },
	'task-tower-eight': { title: T('Практика: сервис и ремонт', 'Практика: сервіс і ремонт', 'Practice: service and repair', 'Praktyka: serwis i naprawa', 'Práctica: servicio y reparación', 'Pratique : service et réparation', 'Pratik: servis ve tamir', 'Practică: service și reparații', "Mashq: servis va ta'mir", 'अभ्यास: सर्विस और मरम्मत', 'تدريب: الخدمة والإصلاح'), points: [lassenPoint, ohnePoint] },
	'task-tower-nine': { title: T('Повторение: zu и lassen', 'Повторення: zu і lassen', 'Review: zu and lassen', 'Powtórka: zu i lassen', 'Repaso: zu y lassen', 'Révision : zu et lassen', 'Tekrar: zu ve lassen', 'Recapitulare: zu și lassen', 'Takrorlash: zu va lassen', 'दोहराव: zu और lassen', 'مراجعة: zu وlassen'), points: [lustPoint, ohnePoint, lassenPoint] },
	'task-tower-ten': { title: finalTitle, points: [versuchenPoint, lassenPoint] }
}

module.exports = quests
