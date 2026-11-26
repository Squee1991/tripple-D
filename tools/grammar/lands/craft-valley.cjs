// Грамматика к заданиям земли craft-valley (Passiv)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const passivPoint = pt(['Passiv: wird + Partizip II', 'Passiv: wird + Partizip II', 'Passive: wird + Partizip II', 'Passiv: wird + Partizip II', 'Pasiva: wird + Partizip II', 'Passif : wird + Partizip II', 'Edilgen: wird + Partizip II', 'Pasiv: wird + Partizip II', 'Majhul: wird + Partizip II', 'कर्मवाच्य: wird + Partizip II', 'المبني للمجهول: wird + Partizip II'], [
	'В Passiv важно не кто делает, а что происходит. wird на втором месте, Partizip II в конце. Много предметов: werden.',
	'У Passiv важливо не хто робить, а що відбувається. wird на другому місці, Partizip II у кінці. Багато предметів: werden.',
	'In the passive what matters is what happens, not who does it. wird in second place, Partizip II at the end. Several things: werden.',
	'W Passiv ważne jest nie to, kto robi, ale co się dzieje. wird na drugim miejscu, Partizip II na końcu. Wiele rzeczy: werden.',
	'En pasiva importa lo que pasa, no quién lo hace. wird en segundo lugar, Partizip II al final. Varias cosas: werden.',
	'Au passif, ce qui compte, c’est ce qui se passe, pas qui le fait. wird en deuxième position, Partizip II à la fin. Plusieurs choses : werden.',
	'Edilgende önemli olan kimin yaptığı değil, ne olduğudur. wird ikinci sırada, Partizip II sonda. Birden çok şey: werden.',
	'La pasiv contează ce se întâmplă, nu cine face. wird pe locul doi, Partizip II la final. Mai multe lucruri: werden.',
	"Majhul nisbatda kim qilgani emas, nima bo'layotgani muhim. wird ikkinchi o'rinda, Partizip II oxirida. Ko'p narsa: werden.",
	'कर्मवाच्य में यह मायने रखता है कि क्या हो रहा है, कौन कर रहा है यह नहीं। wird दूसरे स्थान पर, Partizip II अंत में। कई चीज़ें: werden।',
	'في المبني للمجهول المهم ما يحدث لا من يفعله. wird في المكان الثاني وPartizip II في الآخر. ولعدة أشياء: werden.'
], [
	ex('Das Auto wird repariert.', t11('Машину ремонтируют.', 'Машину ремонтують.', 'The car is being repaired.', 'Samochód jest naprawiany.', 'El coche se está reparando.', 'La voiture est en réparation.', 'Araba tamir ediliyor.', 'Mașina e reparată.', "Mashina ta'mirlanmoqda.", 'गाड़ी ठीक की जा रही है।', 'السيارة تُصلَح.')),
	ex('Die Fenster werden geputzt.', t11('Окна моют.', 'Вікна миють.', 'The windows are being cleaned.', 'Okna są myte.', 'Se limpian las ventanas.', 'On nettoie les fenêtres.', 'Pencereler temizleniyor.', 'Ferestrele sunt spălate.', 'Derazalar yuvilmoqda.', 'खिड़कियाँ साफ़ की जा रही हैं।', 'النوافذ تُنظَّف.'))
])

const vonPoint = pt(['Кем: von + Dativ', 'Ким: von + Dativ', 'By whom: von + dative', 'Przez kogo: von + Dativ', 'Por quién: von + dativo', 'Par qui : von + datif', 'Kim tarafından: von + Dativ', 'De cine: von + dativ', 'Kim tomonidan: von + Dativ', 'किसके द्वारा: von + Dativ', 'من قِبل: von + الجر'], [
	'Если важно, кто делает, добавляем von + Dativ: von meiner Mutter, vom Chef (von dem).',
	'Якщо важливо, хто робить, додаємо von + Dativ: von meiner Mutter, vom Chef (von dem).',
	'If it matters who does it, add von + dative: von meiner Mutter, vom Chef (von dem).',
	'Jeśli ważne, kto robi, dodajemy von + Dativ: von meiner Mutter, vom Chef (von dem).',
	'Si importa quién lo hace, se añade von + dativo: von meiner Mutter, vom Chef (von dem).',
	'Si on veut dire qui le fait, on ajoute von + datif : von meiner Mutter, vom Chef (von dem).',
	'Kimin yaptığı önemliyse von + Dativ eklenir: von meiner Mutter, vom Chef (von dem).',
	'Dacă e important cine face, adăugăm von + dativ: von meiner Mutter, vom Chef (von dem).',
	"Kim qilgani muhim bo'lsa, von + Dativ qo'shiladi: von meiner Mutter, vom Chef (von dem).",
	'अगर कौन करता है यह ज़रूरी हो, तो von + Dativ जोड़ो: von meiner Mutter, vom Chef (von dem)।',
	'إذا كان الفاعل مهماً نضيف von + الجر: von meiner Mutter، vom Chef (von dem).'
], [ex('Das Abendessen wird von meinem Vater gekocht.', t11('Ужин готовит мой папа.', 'Вечерю готує мій тато.', 'Dinner is cooked by my father.', 'Kolację gotuje mój tata.', 'La cena la prepara mi padre.', 'Le dîner est préparé par mon père.', 'Akşam yemeği babam tarafından pişiriliyor.', 'Cina e gătită de tatăl meu.', 'Kechki ovqatni dadam pishiradi.', 'रात का खाना मेरे पिता बनाते हैं।', 'العشاء يطبخه أبي.'))])

const wurdePoint = pt(['В прошлом: wurde', 'У минулому: wurde', 'In the past: wurde', 'W przeszłości: wurde', 'En pasado: wurde', 'Au passé : wurde', 'Geçmişte: wurde', 'La trecut: wurde', "O'tgan zamonda: wurde", 'भूतकाल में: wurde', 'في الماضي: wurde'], [
	'Прошедшее время Passiv: wurde (один предмет), wurden (много) + Partizip II в конце.',
	'Минулий час Passiv: wurde (один предмет), wurden (багато) + Partizip II у кінці.',
	'Past passive: wurde (one thing), wurden (several) + Partizip II at the end.',
	'Passiv w przeszłości: wurde (jedna rzecz), wurden (wiele) + Partizip II na końcu.',
	'Pasiva en pasado: wurde (una cosa), wurden (varias) + Partizip II al final.',
	'Passif au passé : wurde (une chose), wurden (plusieurs) + Partizip II à la fin.',
	'Geçmiş edilgen: wurde (tek şey), wurden (birden çok) + Partizip II sonda.',
	'Pasiv la trecut: wurde (un lucru), wurden (mai multe) + Partizip II la final.',
	"O'tgan zamon majhul: wurde (bitta narsa), wurden (ko'p) + Partizip II oxirida.",
	'भूतकाल कर्मवाच्य: wurde (एक चीज़), wurden (कई) + Partizip II अंत में।',
	'المجهول في الماضي: wurde (لشيء واحد)، wurden (لعدة أشياء) + Partizip II في الآخر.'
], [ex('Das Haus wurde 1900 gebaut.', t11('Дом был построен в 1900 году.', 'Будинок збудували 1900 року.', 'The house was built in 1900.', 'Dom zbudowano w 1900 roku.', 'La casa se construyó en 1900.', 'La maison a été construite en 1900.', 'Ev 1900’de inşa edildi.', 'Casa a fost construită în 1900.', 'Uy 1900-yilda qurilgan.', 'घर 1900 में बना था।', 'بُني البيت عام 1900.'))])

const modalPassivPoint = pt(['muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden', 'muss ... werden'], [
	'С модальным: модальный на втором месте, в конце Partizip II и werden.',
	'З модальним: модальне на другому місці, у кінці Partizip II і werden.',
	'With a modal: the modal in second place, Partizip II and werden at the end.',
	'Z modalnym: modalny na drugim miejscu, na końcu Partizip II i werden.',
	'Con un modal: el modal en segundo lugar, Partizip II y werden al final.',
	'Avec un modal : le modal en deuxième position, Partizip II et werden à la fin.',
	'Modal fiille: modal ikinci sırada, sonda Partizip II ve werden.',
	'Cu un modal: modalul pe locul doi, la final Partizip II și werden.',
	"Modal bilan: modal ikkinchi o'rinda, oxirida Partizip II va werden.",
	'मोडल के साथ: मोडल दूसरे स्थान पर, अंत में Partizip II और werden।',
	'مع فعل مساعد: المساعد في المكان الثاني، وفي الآخر Partizip II وwerden.'
], [ex('Das Auto muss repariert werden.', t11('Машину нужно отремонтировать.', 'Машину треба відремонтувати.', 'The car needs to be repaired.', 'Samochód trzeba naprawić.', 'Hay que reparar el coche.', 'La voiture doit être réparée.', 'Arabanın tamir edilmesi gerekiyor.', 'Mașina trebuie reparată.', "Mashinani ta'mirlash kerak.", 'गाड़ी ठीक करवानी होगी।', 'يجب إصلاح السيارة.'))])

const T = (...v) => t11(...v)
const quests = {
	'craft-valley-one': { title: T('Что-то делается: Passiv', 'Щось робиться: Passiv', 'Something is done: passive', 'Coś się robi: Passiv', 'Algo se hace: pasiva', 'Quelque chose se fait : passif', 'Bir şey yapılıyor: edilgen', 'Ceva se face: pasiv', 'Nimadir qilinmoqda: majhul', 'कुछ किया जा रहा है: कर्मवाच्य', 'شيء يُفعل: المجهول'), points: [passivPoint] },
	'craft-valley-two': { title: T('Много предметов: werden', 'Багато предметів: werden', 'Several things: werden', 'Wiele rzeczy: werden', 'Varias cosas: werden', 'Plusieurs choses : werden', 'Birden çok şey: werden', 'Mai multe lucruri: werden', "Ko'p narsa: werden", 'कई चीज़ें: werden', 'عدة أشياء: werden'), points: [passivPoint] },
	'craft-valley-three': { title: T('Кем? von', 'Ким? von', 'By whom? von', 'Przez kogo? von', '¿Por quién? von', 'Par qui ? von', 'Kim tarafından? von', 'De cine? von', 'Kim tomonidan? von', 'किसके द्वारा? von', 'من قِبل؟ von'), points: [vonPoint] },
	'craft-valley-four': { title: T('Это было сделано: wurde', 'Це було зроблено: wurde', 'It was done: wurde', 'To zostało zrobione: wurde', 'Se hizo: wurde', 'Ça a été fait : wurde', 'Yapıldı: wurde', 'A fost făcut: wurde', 'Qilingan edi: wurde', 'यह किया गया था: wurde', 'تم فعله: wurde'), points: [wurdePoint] },
	'craft-valley-five': { title: T('Нужно сделать: muss ... werden', 'Треба зробити: muss ... werden', 'Must be done: muss ... werden', 'Trzeba zrobić: muss ... werden', 'Hay que hacerlo: muss ... werden', 'Doit être fait : muss ... werden', 'Yapılmalı: muss ... werden', 'Trebuie făcut: muss ... werden', 'Qilinishi kerak: muss ... werden', 'करना होगा: muss ... werden', 'يجب فعله: muss ... werden'), points: [modalPassivPoint] },
	'craft-valley-six': { title: T('В мастерской и на почте', 'У майстерні й на пошті', 'At the workshop and the post office', 'W warsztacie i na poczcie', 'En el taller y en correos', 'À l’atelier et à la poste', 'Atölyede ve postanede', 'La atelier și la poștă', 'Ustaxonada va pochtada', 'वर्कशॉप और डाकघर में', 'في الورشة ومكتب البريد'), points: [passivPoint, vonPoint] },
	'craft-valley-seven': { title: T('Практика: как пекут хлеб', 'Практика: як печуть хліб', 'Practice: how bread is baked', 'Praktyka: jak piecze się chleb', 'Práctica: cómo se hace el pan', 'Pratique : comment on fait le pain', 'Pratik: ekmek nasıl pişirilir', 'Practică: cum se coace pâinea', 'Mashq: non qanday pishiriladi', 'अभ्यास: रोटी कैसे बनती है', 'تدريب: كيف يُخبز الخبز'), points: [passivPoint, vonPoint] },
	'craft-valley-eight': { title: T('Практика: новости города', 'Практика: новини міста', 'Practice: town news', 'Praktyka: wiadomości z miasta', 'Práctica: noticias de la ciudad', 'Pratique : les nouvelles de la ville', 'Pratik: şehir haberleri', 'Practică: știrile orașului', 'Mashq: shahar yangiliklari', 'अभ्यास: शहर की ख़बरें', 'تدريب: أخبار المدينة'), points: [wurdePoint, modalPassivPoint] },
	'craft-valley-nine': { title: T('Повторение: Passiv', 'Повторення: Passiv', 'Review: passive', 'Powtórka: Passiv', 'Repaso: pasiva', 'Révision : le passif', 'Tekrar: edilgen', 'Recapitulare: pasivul', 'Takrorlash: majhul', 'दोहराव: कर्मवाच्य', 'مراجعة: المجهول'), points: [passivPoint, wurdePoint, modalPassivPoint] },
	'craft-valley-ten': { title: finalTitle, points: [passivPoint, vonPoint, wurdePoint] }
}

module.exports = quests
