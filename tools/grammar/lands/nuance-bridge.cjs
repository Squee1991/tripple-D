// Грамматика к заданиям земли nuance-bridge (zwar ... aber, sowohl ... als auch, indem, bis, Passiv Perfekt, причастия, brauchen zu, irgend-)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const zwarPoint = pt(['zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber', 'zwar ..., aber'], [
	'zwar ..., aber значит «хоть и..., но». zwar в середине первой части, aber начинает вторую, порядок слов обычный.',
	'zwar ..., aber означає «хоч і..., але». zwar у середині першої частини, aber починає другу, порядок слів звичайний.',
	'zwar ..., aber means "admittedly ..., but". zwar sits in the middle of the first part, aber starts the second, normal word order.',
	'zwar ..., aber znaczy „wprawdzie..., ale”. zwar w środku pierwszej części, aber zaczyna drugą, szyk zwykły.',
	'zwar ..., aber significa "si bien..., pero". zwar va en medio de la primera parte, aber empieza la segunda, orden normal.',
	'zwar ..., aber veut dire « certes..., mais ». zwar au milieu de la première partie, aber commence la seconde, ordre normal.',
	'zwar ..., aber "gerçi ..., ama" demektir. zwar ilk kısmın ortasında, aber ikinciyi başlatır, normal sıra.',
	'zwar ..., aber înseamnă „ce-i drept..., dar”. zwar la mijlocul primei părți, aber începe a doua, ordine normală.',
	"zwar ..., aber \"garchi..., lekin\" degani. zwar birinchi qism o'rtasida, aber ikkinchisini boshlaydi, tartib oddiy.",
	'zwar ..., aber मतलब "हालाँकि..., लेकिन"। zwar पहले हिस्से के बीच में, aber दूसरे की शुरुआत, सामान्य क्रम।',
	'zwar ..., aber تعني "صحيح أن...، لكن". zwar في وسط الجزء الأول، وaber تبدأ الثاني، والترتيب عادي.'
], [ex('Das Auto ist zwar alt, aber es fährt gut.', t11('Машина хоть и старая, но ездит хорошо.', 'Машина хоч і стара, але їздить добре.', 'The car is old, but it runs well.', 'Samochód wprawdzie jest stary, ale dobrze jeździ.', 'El coche es viejo, pero funciona bien.', 'La voiture est certes vieille, mais elle roule bien.', 'Araba gerçi eski ama iyi gidiyor.', 'Mașina e veche, ce-i drept, dar merge bine.', "Mashina eski bo'lsa ham, yaxshi yuradi.", 'गाड़ी पुरानी तो है, लेकिन अच्छी चलती है।', 'السيارة قديمة لكنها تسير جيداً.'))])

const sowohlPoint = pt(['sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch', 'sowohl ... als auch'], [
	'sowohl ... als auch значит «как..., так и»: верны обе части. Запятая перед als auch не нужна.',
	'sowohl ... als auch означає «як..., так і»: правдиві обидві частини. Кома перед als auch не потрібна.',
	'sowohl ... als auch means "both ... and": both parts are true. No comma before als auch.',
	'sowohl ... als auch znaczy „zarówno..., jak i”: prawdziwe obie części. Przecinek przed als auch niepotrzebny.',
	'sowohl ... als auch significa "tanto... como": las dos partes son ciertas. Sin coma antes de als auch.',
	'sowohl ... als auch veut dire « aussi bien... que » : les deux sont vrais. Pas de virgule avant als auch.',
	'sowohl ... als auch "hem ... hem de": iki kısım da doğru. als auch’tan önce virgül yok.',
	'sowohl ... als auch înseamnă „atât..., cât și”: ambele sunt adevărate. Fără virgulă înainte de als auch.',
	"sowohl ... als auch \"ham..., ham\": ikkala qism ham to'g'ri. als auch oldidan vergul kerak emas.",
	'sowohl ... als auch मतलब "... भी और ... भी": दोनों सही। als auch से पहले कॉमा नहीं।',
	'sowohl ... als auch تعني "كلٌّ من... و": الجزءان صحيحان. ولا فاصلة قبل als auch.'
], [ex('Ich spreche sowohl Deutsch als auch Englisch.', t11('Я говорю как по-немецки, так и по-английски.', 'Я говорю як німецькою, так і англійською.', 'I speak both German and English.', 'Mówię zarówno po niemiecku, jak i po angielsku.', 'Hablo tanto alemán como inglés.', 'Je parle aussi bien allemand qu’anglais.', 'Hem Almanca hem de İngilizce konuşuyorum.', 'Vorbesc atât germana, cât și engleza.', 'Men ham nemischa, ham inglizcha gapiraman.', 'मैं जर्मन भी बोलता हूँ और अंग्रेज़ी भी।', 'أتكلم الألمانية والإنجليزية كلتيهما.'))])

const indemPoint = pt(['indem: тем, что', 'indem: тим, що', 'indem: by doing', 'indem: przez to, że', 'indem: haciendo', 'indem : en faisant', 'indem: -erek', 'indem: prin faptul că', 'indem: ... orqali', 'indem: ... करके', 'indem: عن طريق'], [
	'indem отвечает на вопрос Wie? (каким способом?). Глагол в конце, как после weil.',
	'indem відповідає на питання Wie? (яким способом?). Дієслово в кінці, як після weil.',
	'indem answers Wie? (in what way?). The verb goes last, as after weil.',
	'indem odpowiada na pytanie Wie? (w jaki sposób?). Czasownik na końcu, jak po weil.',
	'indem responde a Wie? (¿de qué manera?). Verbo al final, como tras weil.',
	'indem répond à Wie ? (de quelle manière ?). Verbe à la fin, comme après weil.',
	'indem Wie? (nasıl?) sorusuna cevap verir. Fiil sonda, weil’den sonraki gibi.',
	'indem răspunde la Wie? (în ce fel?). Verbul la final, ca după weil.',
	"indem Wie? (qanday yo'l bilan?) savoliga javob. Fe'l oxirida, weil dan keyingidek.",
	'indem Wie? (किस तरीके से?) का जवाब देता है। क्रिया अंत में, weil की तरह।',
	'indem تجيب عن Wie؟ (بأي طريقة؟). والفعل في الآخر كما بعد weil.'
], [ex('Ich lerne Wörter, indem ich viel lese.', t11('Я учу слова тем, что много читаю.', 'Я вчу слова тим, що багато читаю.', 'I learn words by reading a lot.', 'Uczę się słówek przez to, że dużo czytam.', 'Aprendo palabras leyendo mucho.', 'J’apprends des mots en lisant beaucoup.', 'Çok okuyarak kelime öğreniyorum.', 'Învăț cuvinte citind mult.', "Ko'p o'qish orqali so'z o'rganaman.", 'मैं बहुत पढ़कर शब्द सीखता हूँ।', 'أتعلم الكلمات عن طريق القراءة الكثيرة.'))])

const bisPoint = pt(['bis: пока не', 'bis: доки не', 'bis: until', 'bis: dopóki nie', 'bis: hasta que', 'bis : jusqu’à ce que', 'bis: -ene kadar', 'bis: până când', "bis: ...guncha", 'bis: जब तक', 'bis: حتى'], [
	'bis: действие идёт, пока не наступит второе событие. Глагол в конце. Не путай с bevor (перед тем как).',
	'bis: дія триває, доки не настане друга подія. Дієслово в кінці. Не плутай з bevor (перед тим як).',
	'bis: the action goes on until the second event happens. Verb at the end. Don’t confuse with bevor (before).',
	'bis: czynność trwa, aż nastąpi drugie zdarzenie. Czasownik na końcu. Nie myl z bevor (zanim).',
	'bis: la acción dura hasta que ocurre lo segundo. Verbo al final. No confundir con bevor (antes de que).',
	'bis : l’action dure jusqu’au second événement. Verbe à la fin. Ne confonds pas avec bevor (avant que).',
	'bis: eylem ikinci olay olana kadar sürer. Fiil sonda. bevor (-meden önce) ile karıştırma.',
	'bis: acțiunea durează până la al doilea eveniment. Verbul la final. Nu confunda cu bevor (înainte să).',
	"bis: harakat ikkinchi voqea bo'lguncha davom etadi. Fe'l oxirida. bevor (...dan oldin) bilan adashtirma.",
	'bis: काम तब तक चलता है जब तक दूसरी घटना न हो। क्रिया अंत में। bevor (पहले) से मत मिलाओ।',
	'bis: يستمر الفعل حتى يقع الحدث الثاني. والفعل في الآخر. لا تخلط مع bevor (قبل أن).'
], [ex('Wir warten, bis der Bus kommt.', t11('Мы ждём, пока не придёт автобус.', 'Ми чекаємо, доки не приїде автобус.', 'We wait until the bus comes.', 'Czekamy, aż przyjedzie autobus.', 'Esperamos hasta que venga el autobús.', 'Nous attendons jusqu’à ce que le bus arrive.', 'Otobüs gelene kadar bekliyoruz.', 'Așteptăm până vine autobuzul.', 'Avtobus kelguncha kutamiz.', 'हम बस आने तक इंतज़ार करते हैं।', 'ننتظر حتى تأتي الحافلة.'))])

const wordenPoint = pt(['ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden', 'ist ... worden'], [
	'Passiv Perfekt: sein + Partizip II + worden. Именно worden, а не geworden.',
	'Passiv Perfekt: sein + Partizip II + worden. Саме worden, а не geworden.',
	'Passive Perfekt: sein + Partizip II + worden. It’s worden, not geworden.',
	'Passiv Perfekt: sein + Partizip II + worden. Właśnie worden, a nie geworden.',
	'Pasiva en Perfekt: sein + Partizip II + worden. Es worden, no geworden.',
	'Passif au Perfekt : sein + Partizip II + worden. C’est worden, pas geworden.',
	'Edilgen Perfekt: sein + Partizip II + worden. geworden değil, worden.',
	'Pasiv la Perfekt: sein + Partizip II + worden. Este worden, nu geworden.',
	"Majhul Perfekt: sein + Partizip II + worden. geworden emas, aynan worden.",
	'कर्मवाच्य Perfekt: sein + Partizip II + worden। geworden नहीं, worden।',
	'المجهول في Perfekt: sein + Partizip II + worden. والصيغة worden وليست geworden.'
], [ex('Das Auto ist repariert worden.', t11('Машину отремонтировали.', 'Машину відремонтували.', 'The car has been repaired.', 'Samochód został naprawiony.', 'El coche ha sido reparado.', 'La voiture a été réparée.', 'Araba tamir edildi.', 'Mașina a fost reparată.', "Mashina ta'mirlandi.", 'गाड़ी ठीक कर दी गई है।', 'تم إصلاح السيارة.'))])

const partizipPoint = pt(['die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür', 'die geöffnete Tür'], [
	'Partizip II перед существительным работает как прилагательное и получает обычные окончания: das gekochte Ei (варёное яйцо).',
	'Partizip II перед іменником працює як прикметник і отримує звичайні закінчення: das gekochte Ei (варене яйце).',
	'Partizip II before a noun works like an adjective and takes normal endings: das gekochte Ei (the boiled egg).',
	'Partizip II przed rzeczownikiem działa jak przymiotnik i ma zwykłe końcówki: das gekochte Ei (ugotowane jajko).',
	'El Partizip II delante del sustantivo funciona como adjetivo y lleva las terminaciones normales: das gekochte Ei (el huevo cocido).',
	'Le Partizip II devant un nom fonctionne comme un adjectif avec les terminaisons habituelles : das gekochte Ei (l’œuf cuit).',
	'İsimden önce Partizip II sıfat gibi davranır ve normal ekleri alır: das gekochte Ei (haşlanmış yumurta).',
	'Partizip II înaintea substantivului e ca un adjectiv și ia terminațiile obișnuite: das gekochte Ei (oul fiert).',
	"Otdan oldin Partizip II sifat kabi ishlaydi va oddiy qo'shimchalarni oladi: das gekochte Ei (qaynatilgan tuxum).",
	'संज्ञा से पहले Partizip II विशेषण की तरह काम करता है और सामान्य अंत लेता है: das gekochte Ei (उबला अंडा)।',
	'Partizip II قبل الاسم يعمل كصفة ويأخذ النهايات العادية: das gekochte Ei (البيضة المسلوقة).'
], [ex('Ich kaufe ein gebrauchtes Auto.', t11('Я покупаю подержанную машину.', 'Я купую вживану машину.', 'I’m buying a used car.', 'Kupuję używany samochód.', 'Compro un coche usado.', 'J’achète une voiture d’occasion.', 'İkinci el bir araba alıyorum.', 'Cumpăr o mașină second-hand.', 'Ishlatilgan mashina sotib olyapman.', 'मैं पुरानी गाड़ी खरीद रहा हूँ।', 'أشتري سيارة مستعملة.'))])

const brauchenPoint = pt(['brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu', 'brauchen nicht zu'], [
	'brauchen + nicht/kein + zu + инфинитив значит «не нужно». Это то же, что nicht müssen, но zu обязательно.',
	'brauchen + nicht/kein + zu + інфінітив означає «не треба». Це те саме, що nicht müssen, але zu обов’язкове.',
	'brauchen + nicht/kein + zu + infinitive means "don’t need to". Same as nicht müssen, but zu is required.',
	'brauchen + nicht/kein + zu + bezokolicznik znaczy „nie trzeba”. To samo co nicht müssen, ale zu obowiązkowe.',
	'brauchen + nicht/kein + zu + infinitivo significa "no hace falta". Igual que nicht müssen, pero zu es obligatorio.',
	'brauchen + nicht/kein + zu + infinitif veut dire « pas besoin de ». Comme nicht müssen, mais zu est obligatoire.',
	'brauchen + nicht/kein + zu + mastar "gerek yok" demektir. nicht müssen ile aynı, ama zu şart.',
	'brauchen + nicht/kein + zu + infinitiv înseamnă „nu e nevoie”. La fel ca nicht müssen, dar zu e obligatoriu.',
	"brauchen + nicht/kein + zu + infinitiv \"kerak emas\" degani. nicht müssen bilan bir xil, lekin zu majburiy.",
	'brauchen + nicht/kein + zu + इन्फ़िनिटिव मतलब "ज़रूरत नहीं"। nicht müssen जैसा, पर zu ज़रूरी।',
	'brauchen + nicht/kein + zu + المصدر تعني "لا داعي". مثل nicht müssen لكن zu إلزامية.'
], [ex('Du brauchst keine Angst zu haben.', t11('Тебе не нужно бояться.', 'Тобі не треба боятися.', 'You don’t need to be afraid.', 'Nie musisz się bać.', 'No tienes por qué tener miedo.', 'Tu n’as pas besoin d’avoir peur.', 'Korkmana gerek yok.', 'Nu trebuie să-ți fie frică.', "Qo'rqishing shart emas.", 'तुम्हें डरने की ज़रूरत नहीं।', 'لا داعي لأن تخاف.'))])

const irgendPoint = pt(['irgend- и sollen', 'irgend- і sollen', 'irgend- and sollen', 'irgend- i sollen', 'irgend- y sollen', 'irgend- et sollen', 'irgend- ve sollen', 'irgend- și sollen', 'irgend- va sollen', 'irgend- और sollen', 'irgend- وsollen'], [
	'irgend- значит «неизвестно точно»: irgendwo (где-то), irgendwann (когда-нибудь), irgendetwas (что-нибудь). Er soll krank sein значит «говорят, он болен».',
	'irgend- означає «невідомо точно»: irgendwo (десь), irgendwann (колись), irgendetwas (щось). Er soll krank sein означає «кажуть, він хворий».',
	'irgend- means "some ... or other": irgendwo (somewhere), irgendwann (sometime), irgendetwas (something). Er soll krank sein means "he’s said to be ill".',
	'irgend- znaczy „nie wiadomo dokładnie”: irgendwo (gdzieś), irgendwann (kiedyś), irgendetwas (coś). Er soll krank sein znaczy „podobno jest chory”.',
	'irgend- significa "no se sabe exactamente": irgendwo (en algún sitio), irgendwann (algún día), irgendetwas (algo). Er soll krank sein significa "dicen que está enfermo".',
	'irgend- veut dire « on ne sait pas exactement » : irgendwo (quelque part), irgendwann (un jour), irgendetwas (quelque chose). Er soll krank sein veut dire « il serait malade ».',
	'irgend- "tam bilinmeyen": irgendwo (bir yerde), irgendwann (bir gün), irgendetwas (bir şey). Er soll krank sein "hasta olduğu söyleniyor".',
	'irgend- înseamnă „nu se știe exact”: irgendwo (undeva), irgendwann (cândva), irgendetwas (ceva). Er soll krank sein înseamnă „se zice că e bolnav”.',
	"irgend- \"aniq noma'lum\" degani: irgendwo (qayerdadir), irgendwann (qachondir), irgendetwas (nimadir). Er soll krank sein \"aytishlaricha, u kasal\".",
	'irgend- मतलब "पक्का नहीं पता": irgendwo (कहीं), irgendwann (कभी), irgendetwas (कुछ)। Er soll krank sein मतलब "कहते हैं वह बीमार है"।',
	'irgend- تعني "غير معروف بالضبط": irgendwo (في مكان ما)، irgendwann (يوماً ما)، irgendetwas (شيء ما). وEr soll krank sein تعني "يُقال إنه مريض".'
], [ex('Ich habe das Wort irgendwo gesehen.', t11('Я где-то видел это слово.', 'Я десь бачив це слово.', 'I’ve seen the word somewhere.', 'Gdzieś widziałem to słowo.', 'He visto la palabra en algún sitio.', 'J’ai vu ce mot quelque part.', 'Bu kelimeyi bir yerde gördüm.', 'Am văzut cuvântul undeva.', "Bu so'zni qayerdadir ko'rganman.", 'मैंने यह शब्द कहीं देखा है।', 'رأيت هذه الكلمة في مكان ما.'))])

const T = (...v) => t11(...v)
const quests = {
	'nuance-bridge-one': { title: T('Хоть и..., но...', 'Хоч і..., але...', 'Admittedly ..., but', 'Wprawdzie..., ale...', 'Si bien..., pero', 'Certes..., mais', 'Gerçi ..., ama', 'Ce-i drept..., dar', 'Garchi..., lekin', 'हालाँकि..., लेकिन', 'صحيح أن...، لكن'), points: [zwarPoint] },
	'nuance-bridge-two': { title: T('Как..., так и...', 'Як..., так і...', 'Both ... and', 'Zarówno..., jak i...', 'Tanto... como', 'Aussi bien... que', 'Hem ... hem de', 'Atât..., cât și', 'Ham..., ham', '... भी, ... भी', 'كلٌّ من... و'), points: [sowohlPoint] },
	'nuance-bridge-three': { title: T('Тем, что: indem', 'Тим, що: indem', 'By doing: indem', 'Przez to, że: indem', 'Haciendo: indem', 'En faisant : indem', 'Yaparak: indem', 'Prin faptul că: indem', 'Orqali: indem', 'करके: indem', 'عن طريق: indem'), points: [indemPoint] },
	'nuance-bridge-four': { title: T('Пока не: bis', 'Доки не: bis', 'Until: bis', 'Dopóki nie: bis', 'Hasta que: bis', 'Jusqu’à ce que : bis', 'Kadar: bis', 'Până când: bis', 'Guncha: bis', 'जब तक: bis', 'حتى: bis'), points: [bisPoint] },
	'nuance-bridge-five': { title: T('Уже сделано: ist ... worden', 'Уже зроблено: ist ... worden', 'Already done: ist ... worden', 'Już zrobione: ist ... worden', 'Ya hecho: ist ... worden', 'Déjà fait : ist ... worden', 'Yapıldı: ist ... worden', 'Deja făcut: ist ... worden', 'Bajarildi: ist ... worden', 'हो चुका: ist ... worden', 'تمّ: ist ... worden'), points: [wordenPoint] },
	'nuance-bridge-six': { title: T('Открытая дверь', 'Відчинені двері', 'The opened door', 'Otwarte drzwi', 'La puerta abierta', 'La porte ouverte', 'Açılmış kapı', 'Ușa deschisă', 'Ochilgan eshik', 'खुला दरवाज़ा', 'الباب المفتوح'), points: [partizipPoint] },
	'nuance-bridge-seven': { title: T('Не нужно: brauchen nicht zu', 'Не треба: brauchen nicht zu', 'No need: brauchen nicht zu', 'Nie trzeba: brauchen nicht zu', 'No hace falta: brauchen nicht zu', 'Pas besoin : brauchen nicht zu', 'Gerek yok: brauchen nicht zu', 'Nu e nevoie: brauchen nicht zu', 'Kerak emas: brauchen nicht zu', 'ज़रूरत नहीं: brauchen nicht zu', 'لا داعي: brauchen nicht zu'), points: [brauchenPoint] },
	'nuance-bridge-eight': { title: T('Где-то, кто-то, говорят', 'Десь, хтось, кажуть', 'Somewhere, someone, they say', 'Gdzieś, ktoś, podobno', 'En algún sitio, alguien, dicen', 'Quelque part, quelqu’un, on dit', 'Bir yerde, biri, diyorlar', 'Undeva, cineva, se zice', 'Qayerdadir, kimdir, aytishadi', 'कहीं, कोई, कहते हैं', 'في مكان ما، أحدهم، يُقال'), points: [irgendPoint] },
	'nuance-bridge-nine': { title: T('Повторение: оттенки', 'Повторення: відтінки', 'Review: nuances', 'Powtórka: niuanse', 'Repaso: matices', 'Révision : nuances', 'Tekrar: incelikler', 'Recapitulare: nuanțe', 'Takrorlash: nozikliklar', 'दोहराव: बारीकियाँ', 'مراجعة: الفروق الدقيقة'), points: [zwarPoint, indemPoint, wordenPoint] },
	'nuance-bridge-ten': { title: finalTitle, points: [zwarPoint, sowohlPoint, brauchenPoint] }
}

module.exports = quests
