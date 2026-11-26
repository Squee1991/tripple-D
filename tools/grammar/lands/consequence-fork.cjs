// Грамматика к заданиям земли consequence-fork (sodass, so ... dass, falls, solange)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const sodassPoint = pt(['sodass: так что', 'sodass: тож', 'sodass: so that (result)', 'sodass: tak że', 'sodass: de modo que', 'sodass : si bien que', 'sodass: öyle ki', 'sodass: astfel încât', 'sodass: shunday qilib', 'sodass: जिससे', 'sodass: بحيث'], [
	'sodass говорит о результате. Это придаточное: глагол в конце, перед sodass запятая.',
	'sodass говорить про результат. Це підрядне: дієслово в кінці, перед sodass кома.',
	'sodass describes the result. It’s a subordinate clause: verb at the end, comma before sodass.',
	'sodass mówi o skutku. To zdanie podrzędne: czasownik na końcu, przed sodass przecinek.',
	'sodass expresa el resultado. Es subordinada: verbo al final, coma antes de sodass.',
	'sodass exprime le résultat. C’est une subordonnée : verbe à la fin, virgule avant sodass.',
	'sodass sonucu anlatır. Yan cümle: fiil sonda, sodass’tan önce virgül.',
	'sodass arată rezultatul. E subordonată: verbul la final, virgulă înainte de sodass.',
	"sodass natijani bildiradi. Bu ergash gap: fe'l oxirida, sodass dan oldin vergul.",
	'sodass नतीजा बताता है। यह उपवाक्य है: क्रिया अंत में, sodass से पहले कॉमा।',
	'sodass تعبر عن النتيجة. وهي جملة فرعية: الفعل في الآخر وقبلها فاصلة.'
], [ex('Es regnete stark, sodass wir zu Hause blieben.', t11('Шёл сильный дождь, так что мы остались дома.', 'Ішов сильний дощ, тож ми залишилися вдома.', 'It rained heavily, so we stayed at home.', 'Mocno padało, tak że zostaliśmy w domu.', 'Llovía mucho, de modo que nos quedamos en casa.', 'Il pleuvait fort, si bien que nous sommes restés à la maison.', 'Şiddetli yağmur yağdı, öyle ki evde kaldık.', 'A plouat tare, astfel încât am rămas acasă.', "Kuchli yomg'ir yog'di, shuning uchun uyda qoldik.", 'तेज़ बारिश हुई, इसलिए हम घर पर रहे।', 'أمطرت بغزارة، فبقينا في البيت.'))])

const soDassPoint = pt(['so ... dass: настолько, что', 'so ... dass: настільки, що', 'so ... dass: so ... that', 'so ... dass: tak ..., że', 'so ... dass: tan ... que', 'so ... dass : si ... que', 'so ... dass: o kadar ... ki', 'so ... dass: atât de ... încât', 'so ... dass: shunchalik ... ki', 'so ... dass: इतना ... कि', 'so ... dass: لدرجة أن'], [
	'so стоит перед прилагательным в первой части, dass начинает вторую, глагол в конце.',
	'so стоїть перед прикметником у першій частині, dass починає другу, дієслово в кінці.',
	'so goes before the adjective in the first part, dass starts the second, verb at the end.',
	'so stoi przed przymiotnikiem w pierwszej części, dass zaczyna drugą, czasownik na końcu.',
	'so va delante del adjetivo en la primera parte, dass empieza la segunda, verbo al final.',
	'so se place devant l’adjectif dans la première partie, dass commence la seconde, verbe à la fin.',
	'so ilk kısımda sıfattan önce gelir, dass ikinci kısmı başlatır, fiil sonda.',
	'so stă înaintea adjectivului în prima parte, dass începe a doua, verbul la final.',
	"so birinchi qismda sifatdan oldin, dass ikkinchisini boshlaydi, fe'l oxirida.",
	'so पहले हिस्से में विशेषण से पहले, dass दूसरे हिस्से की शुरुआत, क्रिया अंत में।',
	'so قبل الصفة في الجزء الأول، وdass تبدأ الجزء الثاني، والفعل في الآخر.'
], [ex('Ich war so müde, dass ich sofort einschlief.', t11('Я так устал, что сразу уснул.', 'Я так втомився, що одразу заснув.', 'I was so tired that I fell asleep straight away.', 'Byłem tak zmęczony, że od razu zasnąłem.', 'Estaba tan cansado que me dormí enseguida.', 'J’étais si fatigué que je me suis endormi tout de suite.', 'O kadar yorgundum ki hemen uyudum.', 'Eram atât de obosit încât am adormit imediat.', 'Shunchalik charchadimki, darhol uxlab qoldim.', 'मैं इतना थका था कि तुरंत सो गया।', 'كنت متعباً لدرجة أنني نمت فوراً.'))])

const damitSodassPoint = pt(['Цель или результат', 'Мета чи результат', 'Goal or result', 'Cel czy skutek', 'Objetivo o resultado', 'But ou résultat', 'Amaç mı, sonuç mu', 'Scop sau rezultat', 'Maqsad yoki natija', 'लक्ष्य या नतीजा', 'هدف أم نتيجة'], [
	'damit: цель, то, чего хотят добиться. sodass: результат, то, что получилось.',
	'damit: мета, те, чого хочуть досягти. sodass: результат, те, що вийшло.',
	'damit: the goal, what you want to achieve. sodass: the result, what actually happened.',
	'damit: cel, to, co chcemy osiągnąć. sodass: skutek, to, co wyszło.',
	'damit: el objetivo, lo que se quiere lograr. sodass: el resultado, lo que salió.',
	'damit : le but, ce qu’on veut obtenir. sodass : le résultat, ce qui s’est passé.',
	'damit: amaç, ulaşılmak istenen. sodass: sonuç, olan şey.',
	'damit: scopul, ce vrei să obții. sodass: rezultatul, ce a ieșit.',
	"damit: maqsad, erishmoqchi bo'lgan narsa. sodass: natija, nima bo'lgani.",
	'damit: लक्ष्य, जो पाना चाहते हैं। sodass: नतीजा, जो हुआ।',
	'damit: الهدف، ما نريد تحقيقه. وsodass: النتيجة، ما حدث فعلاً.'
], [ex('Wir kamen früh, sodass wir gute Plätze bekamen.', t11('Мы пришли рано, так что нам достались хорошие места.', 'Ми прийшли рано, тож нам дісталися гарні місця.', 'We arrived early, so we got good seats.', 'Przyszliśmy wcześnie, tak że dostaliśmy dobre miejsca.', 'Llegamos pronto, así que conseguimos buenos sitios.', 'Nous sommes arrivés tôt, si bien que nous avons eu de bonnes places.', 'Erken geldik, öyle ki iyi yerler bulduk.', 'Am venit devreme, astfel încât am prins locuri bune.', "Erta keldik, shuning uchun yaxshi joylar oldik.", 'हम जल्दी आए, इसलिए हमें अच्छी जगह मिली।', 'وصلنا مبكراً فحصلنا على مقاعد جيدة.'))])

const fallsPoint = pt(['falls: если вдруг', 'falls: якщо раптом', 'falls: in case', 'falls: gdyby', 'falls: por si', 'falls : au cas où', 'falls: olur da', 'falls: în caz că', "falls: agar birdan", 'falls: अगर कहीं', 'falls: في حال'], [
	'falls значит «если вдруг, на случай если». Глагол в конце. Если falls первым, главное начинается с глагола.',
	'falls означає «якщо раптом, на випадок якщо». Дієслово в кінці. Якщо falls першим, головне починається з дієслова.',
	'falls means "in case, if by any chance". Verb at the end. If falls comes first, the main clause starts with the verb.',
	'falls znaczy „gdyby, na wypadek gdyby”. Czasownik na końcu. Jeśli falls jest pierwsze, główne zaczyna się od czasownika.',
	'falls significa "por si, en caso de que". Verbo al final. Si falls va primero, la principal empieza por el verbo.',
	'falls veut dire « au cas où ». Verbe à la fin. Si falls est en premier, la principale commence par le verbe.',
	'falls "olur da, şayet" demektir. Fiil sonda. falls başta olursa ana cümle fiille başlar.',
	'falls înseamnă „în caz că”. Verbul la final. Dacă falls e primul, principala începe cu verbul.',
	"falls \"agar birdan, mabodo\" degani. Fe'l oxirida. falls birinchi tursa, bosh gap fe'l bilan boshlanadi.",
	'falls मतलब "अगर कहीं"। क्रिया अंत में। अगर falls पहले आए, तो मुख्य वाक्य क्रिया से शुरू।',
	'falls تعني "في حال". والفعل في الآخر. وإذا جاءت falls أولاً تبدأ الرئيسية بالفعل.'
], [ex('Falls es regnet, bleiben wir zu Hause.', t11('Если вдруг пойдёт дождь, мы останемся дома.', 'Якщо раптом піде дощ, ми залишимося вдома.', 'In case it rains, we’ll stay at home.', 'Gdyby padało, zostaniemy w domu.', 'Por si llueve, nos quedamos en casa.', 'Au cas où il pleuvrait, nous resterons à la maison.', 'Olur da yağmur yağarsa evde kalırız.', 'În caz că plouă, rămânem acasă.', "Mabodo yomg'ir yog'sa, uyda qolamiz.", 'अगर कहीं बारिश हुई, तो हम घर पर रहेंगे।', 'في حال أمطرت سنبقى في البيت.'))])

const solangePoint = pt(['solange: пока', 'solange: поки', 'solange: as long as', 'solange: dopóki', 'solange: mientras', 'solange : tant que', 'solange: -dığı sürece', 'solange: atâta timp cât', 'solange: ...ar ekan', 'solange: जब तक', 'solange: طالما'], [
	'solange значит «всё то время, пока»: одно длится столько же, сколько другое. Не путай с während (два действия одновременно).',
	'solange означає «увесь той час, поки»: одне триває стільки ж, скільки інше. Не плутай з während (дві дії одночасно).',
	'solange means "as long as": one thing lasts as long as the other. Don’t confuse with während (two actions at once).',
	'solange znaczy „dopóki, przez cały czas”: jedno trwa tyle co drugie. Nie myl z während (dwie czynności naraz).',
	'solange significa "mientras (todo el tiempo que)": una cosa dura lo mismo que la otra. No confundir con während.',
	'solange veut dire « tant que » : une chose dure autant que l’autre. Ne confonds pas avec während (deux actions en même temps).',
	'solange "-dığı sürece": biri diğeri kadar sürer. während ile karıştırma (iki eylem aynı anda).',
	'solange înseamnă „atâta timp cât”: una durează cât cealaltă. Nu confunda cu während (două acțiuni simultane).',
	"solange \"...ar ekan, shu vaqt davomida\": biri ikkinchisi qancha davom etsa, shuncha. während bilan adashtirma.",
	'solange मतलब "जब तक": एक बात तब तक चलती है जब तक दूसरी। während से मत मिलाओ (दो काम एक साथ)।',
	'solange تعني "طالما": يستمر الأمر ما دام الآخر مستمراً. لا تخلط مع während (فعلان في الوقت نفسه).'
], [ex('Solange es regnet, bleiben wir drinnen.', t11('Пока идёт дождь, мы сидим дома.', 'Поки йде дощ, ми сидимо вдома.', 'As long as it’s raining, we’ll stay inside.', 'Dopóki pada, zostajemy w środku.', 'Mientras llueva, nos quedamos dentro.', 'Tant qu’il pleut, nous restons à l’intérieur.', 'Yağmur yağdığı sürece içeride kalıyoruz.', 'Atâta timp cât plouă, stăm înăuntru.', "Yomg'ir yog'ar ekan, ichkarida qolamiz.", 'जब तक बारिश हो रही है, हम अंदर रहेंगे।', 'طالما تمطر سنبقى في الداخل.'))])

const T = (...v) => t11(...v)
const quests = {
	'consequence-fork-one': { title: T('Так что: sodass', 'Тож: sodass', 'So: sodass', 'Tak że: sodass', 'De modo que: sodass', 'Si bien que : sodass', 'Öyle ki: sodass', 'Astfel încât: sodass', 'Shunday qilib: sodass', 'जिससे: sodass', 'بحيث: sodass'), points: [sodassPoint] },
	'consequence-fork-two': { title: T('Настолько, что: so ... dass', 'Настільки, що: so ... dass', 'So ... that: so ... dass', 'Tak ..., że: so ... dass', 'Tan ... que: so ... dass', 'Si ... que : so ... dass', 'O kadar ... ki: so ... dass', 'Atât de ... încât: so ... dass', 'Shunchalik ... ki: so ... dass', 'इतना ... कि: so ... dass', 'لدرجة أن: so ... dass'), points: [soDassPoint] },
	'consequence-fork-three': { title: T('Цель или результат?', 'Мета чи результат?', 'Goal or result?', 'Cel czy skutek?', '¿Objetivo o resultado?', 'But ou résultat ?', 'Amaç mı, sonuç mu?', 'Scop sau rezultat?', 'Maqsadmi yoki natija?', 'लक्ष्य या नतीजा?', 'هدف أم نتيجة؟'), points: [damitSodassPoint] },
	'consequence-fork-four': { title: T('Если вдруг: falls', 'Якщо раптом: falls', 'In case: falls', 'Gdyby: falls', 'Por si: falls', 'Au cas où : falls', 'Olur da: falls', 'În caz că: falls', 'Mabodo: falls', 'अगर कहीं: falls', 'في حال: falls'), points: [fallsPoint] },
	'consequence-fork-five': { title: T('Пока: solange', 'Поки: solange', 'As long as: solange', 'Dopóki: solange', 'Mientras: solange', 'Tant que : solange', 'Sürece: solange', 'Atâta timp cât: solange', 'Ekan: solange', 'जब तक: solange', 'طالما: solange'), points: [solangePoint] },
	'consequence-fork-six': { title: T('Большой переезд', 'Великий переїзд', 'The big move', 'Wielka przeprowadzka', 'La gran mudanza', 'Le grand déménagement', 'Büyük taşınma', 'Marea mutare', "Katta ko'chish", 'बड़ा घर-बदलाव', 'الانتقال الكبير'), points: [fallsPoint, soDassPoint] },
	'consequence-fork-seven': { title: T('Практика: в дороге', 'Практика: у дорозі', 'Practice: on the road', 'Praktyka: w drodze', 'Práctica: de viaje', 'Pratique : sur la route', 'Pratik: yolda', 'Practică: pe drum', "Mashq: yo'lda", 'अभ्यास: रास्ते में', 'تدريب: في الطريق'), points: [sodassPoint, soDassPoint] },
	'consequence-fork-eight': { title: T('Практика: планы на выходные', 'Практика: плани на вихідні', 'Practice: weekend plans', 'Praktyka: plany na weekend', 'Práctica: planes del fin de semana', 'Pratique : projets du week-end', 'Pratik: hafta sonu planları', 'Practică: planuri de weekend', 'Mashq: dam olish rejalari', 'अभ्यास: सप्ताहांत की योजनाएँ', 'تدريب: خطط عطلة نهاية الأسبوع'), points: [fallsPoint, solangePoint] },
	'consequence-fork-nine': { title: T('Повторение: следствия и условия', 'Повторення: наслідки й умови', 'Review: results and conditions', 'Powtórka: skutki i warunki', 'Repaso: consecuencias y condiciones', 'Révision : conséquences et conditions', 'Tekrar: sonuçlar ve koşullar', 'Recapitulare: consecințe și condiții', 'Takrorlash: natijalar va shartlar', 'दोहराव: नतीजे और शर्तें', 'مراجعة: النتائج والشروط'), points: [sodassPoint, damitSodassPoint, fallsPoint] },
	'consequence-fork-ten': { title: finalTitle, points: [sodassPoint, fallsPoint, solangePoint] }
}

module.exports = quests
