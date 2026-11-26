// Грамматика к заданиям земли healer-hut (Хижина лекаря: тело и здоровье)
const ex = (de, tr) => ({ de, tr })
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })
const L = ['ru', 'uk', 'en', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']
const pt = (titles, texts, examples) => ({ t: Object.fromEntries(L.map((k, i) => [k, [typeof titles === 'string' ? titles : titles[i], texts[i]]])), examples })

const illnessPoint = pt(['Болезнь с haben, без артикля', 'Хвороба з haben, без артикля', 'Illness with haben, no article', 'Choroba z haben, bez rodzajnika', 'Enfermedad con haben, sin artículo', 'Maladie avec haben, sans article', 'Hastalık haben ile, artikelsiz', 'Boala cu haben, fără articol', 'Kasallik haben bilan, artiklsiz', 'बीमारी haben के साथ, बिना आर्टिकल', 'المرض مع haben بدون أداة'], [
	'Болезни «имеют»: Ich habe Fieber, Er hat Husten. Боль: Kopf + Schmerzen = Kopfschmerzen.',
	'Хвороби «мають»: Ich habe Fieber, Er hat Husten. Біль: Kopf + Schmerzen = Kopfschmerzen.',
	'You "have" an illness: Ich habe Fieber, Er hat Husten. Pain: Kopf + Schmerzen = Kopfschmerzen.',
	'Chorobę się „ma”: Ich habe Fieber, Er hat Husten. Ból: Kopf + Schmerzen = Kopfschmerzen.',
	'La enfermedad se "tiene": Ich habe Fieber, Er hat Husten. Dolor: Kopf + Schmerzen = Kopfschmerzen.',
	'On « a » une maladie : Ich habe Fieber, Er hat Husten. La douleur : Kopf + Schmerzen = Kopfschmerzen.',
	'Hastalık "sahip olunan" bir şeydir: Ich habe Fieber, Er hat Husten. Ağrı: Kopf + Schmerzen = Kopfschmerzen.',
	'Boala „o ai”: Ich habe Fieber, Er hat Husten. Durerea: Kopf + Schmerzen = Kopfschmerzen.',
	"Kasallik \"bor\" bo'ladi: Ich habe Fieber, Er hat Husten. Og'riq: Kopf + Schmerzen = Kopfschmerzen.",
	'बीमारी "होती" है: Ich habe Fieber, Er hat Husten। दर्द: Kopf + Schmerzen = Kopfschmerzen।',
	'المرض "نملكه": Ich habe Fieber، Er hat Husten. والألم: Kopf + Schmerzen = Kopfschmerzen.'
], [
	ex('Ich habe Fieber.', t11('У меня температура.', 'У мене температура.', 'I have a fever.', 'Mam gorączkę.', 'Tengo fiebre.', 'J’ai de la fièvre.', 'Ateşim var.', 'Am febră.', 'Isitmam bor.', 'मुझे बुख़ार है।', 'عندي حمى.')),
	ex('Ich habe Kopfschmerzen.', t11('У меня болит голова.', 'У мене болить голова.', 'I have a headache.', 'Boli mnie głowa.', 'Me duele la cabeza.', 'J’ai mal à la tête.', 'Başım ağrıyor.', 'Mă doare capul.', "Boshim og'riyapti.", 'मेरे सिर में दर्द है।', 'عندي صداع.'))
])

const wehPoint = pt('tut weh, tun weh', [
	'tut weh значит «болит». Одна часть тела: tut weh, несколько: tun weh.',
	'tut weh означає «болить». Одна частина тіла: tut weh, кілька: tun weh.',
	'tut weh means "hurts". One body part: tut weh, several: tun weh.',
	'tut weh znaczy „boli”. Jedna część ciała: tut weh, kilka: tun weh.',
	'tut weh significa "duele". Una parte del cuerpo: tut weh, varias: tun weh.',
	'tut weh veut dire « fait mal ». Une partie du corps : tut weh, plusieurs : tun weh.',
	'tut weh "ağrıyor" demektir. Tek uzuv: tut weh, birkaç uzuv: tun weh.',
	'tut weh înseamnă „doare”. O parte a corpului: tut weh, mai multe: tun weh.',
	"tut weh \"og'riyapti\" degani. Bitta a'zo: tut weh, bir nechta: tun weh.",
	'tut weh मतलब "दर्द हो रहा है"। एक अंग: tut weh, कई अंग: tun weh।',
	'tut weh تعني "يؤلم". عضو واحد: tut weh، وعدة أعضاء: tun weh.'
], [
	ex('Mein Hals tut weh.', t11('У меня болит горло.', 'У мене болить горло.', 'My throat hurts.', 'Boli mnie gardło.', 'Me duele la garganta.', 'J’ai mal à la gorge.', 'Boğazım ağrıyor.', 'Mă doare gâtul.', "Tomog'im og'riyapti.", 'मेरे गले में दर्द है।', 'حلقي يؤلمني.')),
	ex('Meine Füße tun weh.', t11('У меня болят ноги (стопы).', 'У мене болять ноги (стопи).', 'My feet hurt.', 'Bolą mnie stopy.', 'Me duelen los pies.', 'J’ai mal aux pieds.', 'Ayaklarım ağrıyor.', 'Mă dor picioarele.', "Oyoqlarim og'riyapti.", 'मेरे पैरों में दर्द है।', 'قدماي تؤلمانني.'))
])

const quests = {
	'healer-hut-one': {
		title: t11('Тело: der Kopf, das Bein', 'Тіло: der Kopf, das Bein', 'The body: der Kopf, das Bein', 'Ciało: der Kopf, das Bein', 'El cuerpo: der Kopf, das Bein', 'Le corps : der Kopf, das Bein', 'Vücut: der Kopf, das Bein', 'Corpul: der Kopf, das Bein', 'Tana: der Kopf, das Bein', 'शरीर: der Kopf, das Bein', 'الجسم: der Kopf وdas Bein'),
		points: [pt(['Двух частей: множественное', 'Двох частин: множина', 'Two of them: plural', 'Dwie części: liczba mnoga', 'Dos: plural', 'Deux : pluriel', 'İki tane: çoğul', 'Două: plural', 'Ikkita: ko‘plik', 'दो: बहुवचन', 'اثنان: الجمع'], [
			'Учим тело с артиклем. Рук и ног две, значит множественное: zwei Arme, zwei Beine.',
			'Вчимо тіло з артиклем. Рук і ніг дві, отже множина: zwei Arme, zwei Beine.',
			'Learn body parts with the article. Two arms and legs, so plural: zwei Arme, zwei Beine.',
			'Uczymy się ciała z rodzajnikiem. Ręce i nogi są dwie, więc liczba mnoga: zwei Arme, zwei Beine.',
			'Aprende el cuerpo con artículo. Brazos y piernas son dos, así que plural: zwei Arme, zwei Beine.',
			'On apprend le corps avec l’article. Deux bras et deux jambes, donc pluriel : zwei Arme, zwei Beine.',
			'Uzuvları artikeliyle öğren. Kol ve bacak iki tane, o yüzden çoğul: zwei Arme, zwei Beine.',
			'Învățăm corpul cu articol. Brațe și picioare sunt două, deci plural: zwei Arme, zwei Beine.',
			"Tana a'zolarini artikl bilan o'rganamiz. Qo'l va oyoq ikkita, demak ko'plik: zwei Arme, zwei Beine.",
			'शरीर के अंग आर्टिकल के साथ सीखो। हाथ और पैर दो हैं, इसलिए बहुवचन: zwei Arme, zwei Beine।',
			'نتعلم أعضاء الجسم مع الأداة. الذراعان والساقان اثنتان، إذن الجمع: zwei Arme، zwei Beine.'
		], [ex('Ich habe zwei Arme und zwei Beine.', t11('У меня две руки и две ноги.', 'У мене дві руки і дві ноги.', 'I have two arms and two legs.', 'Mam dwie ręce i dwie nogi.', 'Tengo dos brazos y dos piernas.', 'J’ai deux bras et deux jambes.', 'İki kolum ve iki bacağım var.', 'Am două brațe și două picioare.', "Mening ikkita qo'lim va ikkita oyog'im bor.", 'मेरे दो हाथ और दो पैर हैं।', 'لي ذراعان وساقان.'))])]
	},
	'healer-hut-two': {
		title: t11('Лицо: das Auge, die Nase', 'Обличчя: das Auge, die Nase', 'The face: das Auge, die Nase', 'Twarz: das Auge, die Nase', 'La cara: das Auge, die Nase', 'Le visage : das Auge, die Nase', 'Yüz: das Auge, die Nase', 'Fața: das Auge, die Nase', 'Yuz: das Auge, die Nase', 'चेहरा: das Auge, die Nase', 'الوجه: das Auge وdie Nase'),
		points: [pt(['Множественное', 'Множина', 'Plural', 'Liczba mnoga', 'Plural', 'Pluriel', 'Çoğul', 'Plural', "Ko'plik", 'बहुवचन', 'الجمع'], [
			'zwei Augen, zwei Ohren. У Zahn умлаут: viele Zähne.',
			'zwei Augen, zwei Ohren. У Zahn умлаут: viele Zähne.',
			'zwei Augen, zwei Ohren. Zahn gets an umlaut: viele Zähne.',
			'zwei Augen, zwei Ohren. Zahn dostaje umlaut: viele Zähne.',
			'zwei Augen, zwei Ohren. Zahn lleva diéresis: viele Zähne.',
			'zwei Augen, zwei Ohren. Zahn prend un umlaut : viele Zähne.',
			'zwei Augen, zwei Ohren. Zahn umlaut alır: viele Zähne.',
			'zwei Augen, zwei Ohren. Zahn primește umlaut: viele Zähne.',
			"zwei Augen, zwei Ohren. Zahn umlaut oladi: viele Zähne.",
			'zwei Augen, zwei Ohren। Zahn में उमलाउट: viele Zähne।',
			'zwei Augen، zwei Ohren. وZahn يأخذ أوملاوت: viele Zähne.'
		], [ex('Das Kind hat viele Zähne.', t11('У ребёнка много зубов.', 'У дитини багато зубів.', 'The child has a lot of teeth.', 'Dziecko ma dużo zębów.', 'El niño tiene muchos dientes.', 'L’enfant a beaucoup de dents.', 'Çocuğun çok dişi var.', 'Copilul are mulți dinți.', "Bolaning tishlari ko'p.", 'बच्चे के बहुत दाँत हैं।', 'للطفل أسنان كثيرة.'))])]
	},
	'healer-hut-three': {
		title: t11('Симптомы: Ich habe Fieber', 'Симптоми: Ich habe Fieber', 'Symptoms: Ich habe Fieber', 'Objawy: Ich habe Fieber', 'Síntomas: Ich habe Fieber', 'Symptômes : Ich habe Fieber', 'Belirtiler: Ich habe Fieber', 'Simptome: Ich habe Fieber', 'Belgilar: Ich habe Fieber', 'लक्षण: Ich habe Fieber', 'الأعراض: Ich habe Fieber'),
		points: [illnessPoint]
	},
	'healer-hut-four': {
		title: t11('Как ты себя чувствуешь?', 'Як ти почуваєшся?', 'How are you feeling?', 'Jak się czujesz?', '¿Cómo te encuentras?', 'Comment tu te sens ?', 'Nasıl hissediyorsun?', 'Cum te simți?', "O'zingni qanday his qilyapsan?", 'तुम कैसा महसूस कर रहे हो?', 'كيف تشعر؟'),
		points: [pt(['Готовые фразы', 'Готові фрази', 'Set phrases', 'Gotowe zwroty', 'Frases hechas', 'Expressions toutes faites', 'Kalıp ifadeler', 'Expresii fixe', 'Tayyor iboralar', 'तैयार वाक्यांश', 'عبارات جاهزة'], [
			'Es geht mir gut значит «мне хорошо». Пожелать выздоровления: Gute Besserung!',
			'Es geht mir gut означає «мені добре». Побажати одужання: Gute Besserung!',
			'Es geht mir gut means "I’m fine". To wish someone well: Gute Besserung!',
			'Es geht mir gut znaczy „czuję się dobrze”. Życzyć zdrowia: Gute Besserung!',
			'Es geht mir gut significa "estoy bien". Para desear que se mejore: Gute Besserung!',
			'Es geht mir gut veut dire « je vais bien ». Pour souhaiter un bon rétablissement : Gute Besserung !',
			'Es geht mir gut "iyiyim" demektir. Geçmiş olsun demek için: Gute Besserung!',
			'Es geht mir gut înseamnă „mă simt bine”. Ca să urezi însănătoșire: Gute Besserung!',
			"Es geht mir gut \"o'zimni yaxshi his qilyapman\" degani. Tuzalib ketishni tilash: Gute Besserung!",
			'Es geht mir gut मतलब "मैं ठीक हूँ"। जल्दी ठीक होने की शुभकामना: Gute Besserung!',
			'Es geht mir gut تعني "أنا بخير". ولتتمنى الشفاء: Gute Besserung!'
		], [ex('Wie geht es Ihnen, Frau Schulz?', t11('Как вы себя чувствуете, госпожа Шульц?', 'Як ви почуваєтеся, пані Шульц?', 'How are you, Ms Schulz?', 'Jak się pani czuje, pani Schulz?', '¿Cómo se encuentra, señora Schulz?', 'Comment allez-vous, Madame Schulz ?', 'Nasılsınız, Bayan Schulz?', 'Cum vă simțiți, doamnă Schulz?', "O'zingizni qanday his qilyapsiz, Shulz xonim?", 'आप कैसी हैं, श्रीमती शुल्ज़?', 'كيف حالك يا سيدة شولتس؟')), ex('Gute Besserung, Lena!', t11('Выздоравливай, Лена!', 'Одужуй, Лено!', 'Get well soon, Lena!', 'Zdrowiej, Lena!', '¡Que te mejores, Lena!', 'Bon rétablissement, Lena !', 'Geçmiş olsun, Lena!', 'Însănătoșire grabnică, Lena!', 'Tezroq tuzal, Lena!', 'जल्दी ठीक हो जाओ, लेना!', 'شفاك الله يا لينا!'))])]
	},
	'healer-hut-five': {
		title: t11('Запись к врачу', 'Запис до лікаря', 'Making an appointment', 'Zapis do lekarza', 'Pedir cita', 'Prendre rendez-vous', 'Doktordan randevu', 'Programarea la medic', 'Shifokorga yozilish', 'डॉक्टर से अपॉइंटमेंट', 'حجز موعد عند الطبيب'),
		points: [pt('einen Termin', [
			'der Termin после möchte становится einen Termin. Подходит: Ja, das geht.',
			'der Termin після möchte стає einen Termin. Підходить: Ja, das geht.',
			'der Termin after möchte becomes einen Termin. It suits me: Ja, das geht.',
			'der Termin po möchte zmienia się w einen Termin. Pasuje: Ja, das geht.',
			'der Termin después de möchte pasa a einen Termin. Me va bien: Ja, das geht.',
			'der Termin après möchte devient einen Termin. Ça me va : Ja, das geht.',
			'möchte’den sonra der Termin einen Termin olur. Uygun: Ja, das geht.',
			'der Termin după möchte devine einen Termin. Îmi convine: Ja, das geht.',
			"möchte dan keyin der Termin einen Termin bo'ladi. Mos: Ja, das geht.",
			'möchte के बाद der Termin बनता है einen Termin। ठीक है: Ja, das geht।',
			'بعد möchte تصبح der Termin ‏einen Termin. ومناسب: Ja, das geht.'
		], [ex('Ich möchte einen Termin.', t11('Я хотел бы записаться на приём.', 'Я хотів би записатися на прийом.', 'I’d like an appointment.', 'Chciałbym umówić wizytę.', 'Quisiera una cita.', 'Je voudrais un rendez-vous.', 'Bir randevu istiyorum.', 'Aș dori o programare.', 'Qabulga yozilmoqchiman.', 'मुझे एक अपॉइंटमेंट चाहिए।', 'أودّ حجز موعد.'))])]
	},
	'healer-hut-six': {
		title: t11('У врача: es tut weh', 'У лікаря: es tut weh', 'At the doctor’s: es tut weh', 'U lekarza: es tut weh', 'En el médico: es tut weh', 'Chez le médecin : es tut weh', 'Doktorda: es tut weh', 'La medic: es tut weh', 'Shifokorda: es tut weh', 'डॉक्टर के पास: es tut weh', 'عند الطبيب: es tut weh'),
		points: [wehPoint, pt(['Совет врача через müssen', 'Порада лікаря через müssen', 'Doctor’s advice with müssen', 'Rada lekarza przez müssen', 'Consejo del médico con müssen', 'Conseil du médecin avec müssen', 'Doktor tavsiyesi müssen ile', 'Sfatul medicului cu müssen', "Shifokor maslahati müssen bilan", 'डॉक्टर की सलाह müssen से', 'نصيحة الطبيب مع müssen'], [
			'Врач говорит, что делать: Sie müssen im Bett bleiben. Второй глагол в конце.',
			'Лікар каже, що робити: Sie müssen im Bett bleiben. Друге дієслово в кінці.',
			'The doctor tells you what to do: Sie müssen im Bett bleiben. The second verb goes to the end.',
			'Lekarz mówi, co robić: Sie müssen im Bett bleiben. Drugi czasownik na końcu.',
			'El médico dice qué hacer: Sie müssen im Bett bleiben. El segundo verbo va al final.',
			'Le médecin dit quoi faire : Sie müssen im Bett bleiben. Le deuxième verbe va à la fin.',
			'Doktor ne yapacağını söyler: Sie müssen im Bett bleiben. İkinci fiil sonda.',
			'Medicul spune ce să faci: Sie müssen im Bett bleiben. Al doilea verb la final.',
			"Shifokor nima qilishni aytadi: Sie müssen im Bett bleiben. Ikkinchi fe'l oxirida.",
			'डॉक्टर बताते हैं क्या करना है: Sie müssen im Bett bleiben। दूसरी क्रिया अंत में।',
			'يقول الطبيب ماذا تفعل: Sie müssen im Bett bleiben. والفعل الثاني في الآخر.'
		], [ex('Sie müssen im Bett bleiben.', t11('Вам нужно лежать в постели.', 'Вам треба лежати в ліжку.', 'You have to stay in bed.', 'Musi pan zostać w łóżku.', 'Tiene que quedarse en la cama.', 'Vous devez rester au lit.', 'Yatakta kalmalısınız.', 'Trebuie să stați în pat.', "Siz to'shakda yotishingiz kerak.", 'आपको बिस्तर पर रहना होगा।', 'يجب أن تبقى في السرير.'))])]
	},
	'healer-hut-seven': {
		title: t11('В аптеке', 'В аптеці', 'At the pharmacy', 'W aptece', 'En la farmacia', 'À la pharmacie', 'Eczanede', 'La farmacie', 'Dorixonada', 'दवाखाने में', 'في الصيدلية'),
		points: [pt(['Как принимать', 'Як приймати', 'How to take it', 'Jak przyjmować', 'Cómo tomarlo', 'Comment le prendre', 'Nasıl alınır', 'Cum se ia', 'Qanday ichish kerak', 'कैसे लेना है', 'كيف تأخذه'], [
			'dreimal am Tag значит «три раза в день». Лекарство «берут»: eine Tablette nehmen.',
			'dreimal am Tag означає «тричі на день». Ліки «беруть»: eine Tablette nehmen.',
			'dreimal am Tag means "three times a day". Medicine is "taken": eine Tablette nehmen.',
			'dreimal am Tag znaczy „trzy razy dziennie”. Lek się „bierze”: eine Tablette nehmen.',
			'dreimal am Tag significa "tres veces al día". La medicina se "toma": eine Tablette nehmen.',
			'dreimal am Tag veut dire « trois fois par jour ». On « prend » un médicament : eine Tablette nehmen.',
			'dreimal am Tag "günde üç kez" demektir. İlaç "alınır": eine Tablette nehmen.',
			'dreimal am Tag înseamnă „de trei ori pe zi”. Medicamentul „se ia”: eine Tablette nehmen.',
			"dreimal am Tag \"kuniga uch marta\" degani. Dori \"olinadi\": eine Tablette nehmen.",
			'dreimal am Tag मतलब "दिन में तीन बार"। दवा "ली" जाती है: eine Tablette nehmen।',
			'dreimal am Tag تعني "ثلاث مرات في اليوم". والدواء "يُؤخذ": eine Tablette nehmen.'
		], [ex('Ich brauche ein Medikament.', t11('Мне нужно лекарство.', 'Мені потрібні ліки.', 'I need some medicine.', 'Potrzebuję leku.', 'Necesito un medicamento.', 'J’ai besoin d’un médicament.', 'Bir ilaca ihtiyacım var.', 'Am nevoie de un medicament.', 'Menga dori kerak.', 'मुझे एक दवा चाहिए।', 'أحتاج دواءً.'))])]
	},
	'healer-hut-eight': {
		title: t11('Практика: я заболел', 'Практика: я захворів', 'Practice: I’m ill', 'Praktyka: zachorowałem', 'Práctica: estoy enfermo', 'Pratique : je suis malade', 'Pratik: hastalandım', 'Practică: m-am îmbolnăvit', "Mashq: men kasal bo'ldim", 'अभ्यास: मैं बीमार हूँ', 'تدريب: أنا مريض'),
		points: [pt(['Новых правил нет', 'Нових правил немає', 'No new rules', 'Bez nowych reguł', 'Sin reglas nuevas', 'Pas de nouvelle règle', 'Yeni kural yok', 'Fără reguli noi', "Yangi qoida yo'q", 'कोई नया नियम नहीं', 'لا قواعد جديدة'], [
			'Не можешь работать: Ich kann heute nicht arbeiten. nicht перед глаголом в конце.',
			'Не можеш працювати: Ich kann heute nicht arbeiten. nicht перед дієсловом у кінці.',
			'You can’t work: Ich kann heute nicht arbeiten. nicht goes before the verb at the end.',
			'Nie możesz pracować: Ich kann heute nicht arbeiten. nicht przed czasownikiem na końcu.',
			'No puedes trabajar: Ich kann heute nicht arbeiten. nicht va delante del verbo final.',
			'Tu ne peux pas travailler : Ich kann heute nicht arbeiten. nicht devant le verbe final.',
			'Çalışamıyorsun: Ich kann heute nicht arbeiten. nicht sondaki fiilden önce.',
			'Nu poți lucra: Ich kann heute nicht arbeiten. nicht înaintea verbului de la final.',
			"Ishlay olmaysan: Ich kann heute nicht arbeiten. nicht oxirdagi fe'ldan oldin.",
			'काम नहीं कर सकते: Ich kann heute nicht arbeiten। nicht अंत वाली क्रिया से पहले।',
			'لا تستطيع العمل: Ich kann heute nicht arbeiten. وnicht قبل الفعل الأخير.'
		], [ex('Heute kann ich nicht arbeiten, ich bin krank.', t11('Сегодня я не могу работать, я болен.', 'Сьогодні я не можу працювати, я хворий.', 'I can’t work today, I’m ill.', 'Dziś nie mogę pracować, jestem chory.', 'Hoy no puedo trabajar, estoy enfermo.', 'Aujourd’hui je ne peux pas travailler, je suis malade.', 'Bugün çalışamam, hastayım.', 'Azi nu pot lucra, sunt bolnav.', 'Bugun ishlay olmayman, kasalman.', 'आज मैं काम नहीं कर सकता, मैं बीमार हूँ।', 'لا أستطيع العمل اليوم، أنا مريض.'))])]
	},
	'healer-hut-nine': {
		title: t11('Повторение: тело и здоровье', 'Повторення: тіло і здоров’я', 'Review: body and health', 'Powtórka: ciało i zdrowie', 'Repaso: cuerpo y salud', 'Révision : corps et santé', 'Tekrar: vücut ve sağlık', 'Recapitulare: corp și sănătate', "Takrorlash: tana va sog'liq", 'दोहराव: शरीर और स्वास्थ्य', 'مراجعة: الجسم والصحة'),
		points: [illnessPoint, wehPoint]
	},
	'healer-hut-ten': {
		title: t11('Контрольный: что повторить', 'Контрольне: що повторити', 'Final test: what to review', 'Sprawdzian: co powtórzyć', 'Prueba final: qué repasar', 'Contrôle : quoi réviser', 'Sınav: neleri tekrar etmeli', 'Test: ce să recapitulezi', 'Nazorat: nimani takrorlash kerak', 'टेस्ट: क्या दोहराएँ', 'الاختبار: ماذا تراجع'),
		points: [wehPoint, illnessPoint]
	}
}

module.exports = quests
