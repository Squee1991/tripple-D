// Грамматика к заданиям земли reason-bridge (deshalb, denn, weil, trotzdem, obwohl)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const deshalbPoint = pt(['deshalb: глагол сразу', 'deshalb: дієслово одразу', 'deshalb: verb right after', 'deshalb: czasownik od razu', 'deshalb: verbo justo después', 'deshalb : verbe juste après', 'deshalb: fiil hemen ardından', 'deshalb: verbul imediat', "deshalb: fe'l darhol", 'deshalb: क्रिया तुरंत बाद', 'deshalb: الفعل بعدها مباشرة'], [
	'deshalb, deswegen, darum значат «поэтому». Это не придаточное: после них сразу глагол, потом подлежащее.',
	'deshalb, deswegen, darum означають «тому». Це не підрядне: після них одразу дієслово, потім підмет.',
	'deshalb, deswegen, darum mean "that’s why, so". It’s not a subordinate clause: the verb comes straight after, then the subject.',
	'deshalb, deswegen, darum znaczą „dlatego”. To nie zdanie podrzędne: zaraz po nich czasownik, potem podmiot.',
	'deshalb, deswegen, darum significan "por eso". No es subordinada: justo después va el verbo y luego el sujeto.',
	'deshalb, deswegen, darum veulent dire « c’est pourquoi ». Ce n’est pas une subordonnée : le verbe suit tout de suite, puis le sujet.',
	'deshalb, deswegen, darum "bu yüzden" demektir. Yan cümle değil: hemen fiil, sonra özne gelir.',
	'deshalb, deswegen, darum înseamnă „de aceea”. Nu e subordonată: imediat vine verbul, apoi subiectul.',
	"deshalb, deswegen, darum \"shuning uchun\" degani. Bu ergash gap emas: darhol fe'l, keyin ega.",
	'deshalb, deswegen, darum मतलब "इसलिए"। यह उपवाक्य नहीं: तुरंत क्रिया, फिर कर्ता।',
	'deshalb وdeswegen وdarum تعني "لذلك". وليست جملة فرعية: يأتي الفعل مباشرة ثم الفاعل.'
], [ex('Ich bin müde, deshalb gehe ich ins Bett.', t11('Я устал, поэтому иду спать.', 'Я втомився, тому йду спати.', 'I’m tired, so I’m going to bed.', 'Jestem zmęczony, dlatego idę spać.', 'Estoy cansado, por eso me voy a la cama.', 'Je suis fatigué, c’est pourquoi je vais me coucher.', 'Yorgunum, bu yüzden yatmaya gidiyorum.', 'Sunt obosit, de aceea mă culc.', 'Charchadim, shuning uchun uxlagani ketaman.', 'मैं थका हूँ, इसलिए सोने जा रहा हूँ।', 'أنا متعب، لذلك سأذهب للنوم.'))])

const threeWaysPoint = pt(['weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil, denn, deshalb', 'weil وdenn وdeshalb'], [
	'weil: глагол в конце. denn: обычный порядок слов. deshalb: сначала причина, потом следствие, и глагол сразу после deshalb.',
	'weil: дієслово в кінці. denn: звичайний порядок слів. deshalb: спочатку причина, потім наслідок, і дієслово одразу після deshalb.',
	'weil: verb at the end. denn: normal word order. deshalb: first the reason, then the result, with the verb right after deshalb.',
	'weil: czasownik na końcu. denn: zwykły szyk. deshalb: najpierw przyczyna, potem skutek, czasownik zaraz po deshalb.',
	'weil: verbo al final. denn: orden normal. deshalb: primero la causa, luego la consecuencia, con el verbo justo después de deshalb.',
	'weil : verbe à la fin. denn : ordre normal. deshalb : d’abord la cause, puis la conséquence, avec le verbe juste après deshalb.',
	'weil: fiil sonda. denn: normal sıra. deshalb: önce sebep, sonra sonuç; fiil deshalb’dan hemen sonra.',
	'weil: verbul la final. denn: ordine normală. deshalb: întâi cauza, apoi efectul, cu verbul imediat după deshalb.',
	"weil: fe'l oxirida. denn: oddiy tartib. deshalb: avval sabab, keyin natija, fe'l deshalb dan keyin darhol.",
	'weil: क्रिया अंत में। denn: सामान्य क्रम। deshalb: पहले कारण, फिर नतीजा, और deshalb के तुरंत बाद क्रिया।',
	'weil: الفعل في الآخر. denn: ترتيب عادي. deshalb: السبب أولاً ثم النتيجة، والفعل بعد deshalb مباشرة.'
], [
	ex('Ich bleibe zu Hause, weil ich krank bin.', t11('Я остаюсь дома, потому что болен.', 'Я залишаюся вдома, бо хворий.', 'I’m staying at home because I’m ill.', 'Zostaję w domu, bo jestem chory.', 'Me quedo en casa porque estoy enfermo.', 'Je reste à la maison parce que je suis malade.', 'Evde kalıyorum çünkü hastayım.', 'Rămân acasă pentru că sunt bolnav.', 'Uyda qolaman, chunki kasalman.', 'मैं घर पर रहूँगा क्योंकि मैं बीमार हूँ।', 'أبقى في البيت لأنني مريض.')),
	ex('Ich bleibe zu Hause, denn ich bin krank.', t11('Я остаюсь дома: я болен.', 'Я залишаюся вдома, адже я хворий.', 'I’m staying at home, for I’m ill.', 'Zostaję w domu, bo jestem chory.', 'Me quedo en casa, pues estoy enfermo.', 'Je reste à la maison, car je suis malade.', 'Evde kalıyorum, zira hastayım.', 'Rămân acasă, căci sunt bolnav.', 'Uyda qolaman, axir kasalman.', 'मैं घर पर रहूँगा, क्योंकि मैं बीमार हूँ।', 'أبقى في البيت، فأنا مريض.'))
])

const trotzdemPoint = pt(['trotzdem и obwohl', 'trotzdem і obwohl', 'trotzdem and obwohl', 'trotzdem i obwohl', 'trotzdem y obwohl', 'trotzdem et obwohl', 'trotzdem ve obwohl', 'trotzdem și obwohl', 'trotzdem va obwohl', 'trotzdem और obwohl', 'trotzdem وobwohl'], [
	'trotzdem (всё равно): глагол сразу после. obwohl (хотя): это придаточное, глагол в конце. Смысл один: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (все одно): дієслово одразу після. obwohl (хоча): це підрядне, дієслово в кінці. Зміст один: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (anyway, still): the verb right after. obwohl (although): a subordinate clause, verb at the end. Same meaning: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (mimo to): czasownik zaraz po. obwohl (chociaż): zdanie podrzędne, czasownik na końcu. Znaczenie to samo: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (aun así): el verbo justo después. obwohl (aunque): subordinada, verbo al final. Mismo sentido: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (quand même) : verbe juste après. obwohl (bien que) : subordonnée, verbe à la fin. Même sens : Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (yine de): fiil hemen ardından. obwohl (-e rağmen): yan cümle, fiil sonda. Anlam aynı: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	'trotzdem (totuși): verbul imediat după. obwohl (deși): subordonată, verbul la final. Același sens: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.',
	"trotzdem (baribir): fe'l darhol keyin. obwohl (garchi): ergash gap, fe'l oxirida. Ma'no bir: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.",
	'trotzdem (फिर भी): क्रिया तुरंत बाद। obwohl (हालाँकि): उपवाक्य, क्रिया अंत में। मतलब एक: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir।',
	'trotzdem (مع ذلك): الفعل بعدها مباشرة. obwohl (رغم أن): جملة فرعية والفعل في الآخر. والمعنى واحد: Obwohl es regnet, gehen wir = Es regnet, trotzdem gehen wir.'
], [
	ex('Obwohl es regnete, gingen wir spazieren.', t11('Хотя шёл дождь, мы пошли гулять.', 'Хоча йшов дощ, ми пішли гуляти.', 'Although it was raining, we went for a walk.', 'Chociaż padało, poszliśmy na spacer.', 'Aunque llovía, fuimos a pasear.', 'Bien qu’il pleuve, nous sommes allés nous promener.', 'Yağmur yağmasına rağmen yürüyüşe çıktık.', 'Deși ploua, am ieșit la plimbare.', "Yomg'ir yog'ayotgan bo'lsa ham, sayrga chiqdik.", 'बारिश हो रही थी, फिर भी हम टहलने गए।', 'رغم أنها كانت تمطر خرجنا للتنزه.')),
	ex('Es regnete, trotzdem gingen wir spazieren.', t11('Шёл дождь, но мы всё равно пошли гулять.', 'Йшов дощ, але ми все одно пішли гуляти.', 'It was raining, but we still went for a walk.', 'Padało, mimo to poszliśmy na spacer.', 'Llovía, aun así fuimos a pasear.', 'Il pleuvait, nous sommes quand même allés nous promener.', 'Yağmur yağıyordu, yine de yürüyüşe çıktık.', 'Ploua, totuși am ieșit la plimbare.', "Yomg'ir yog'ardi, baribir sayrga chiqdik.", 'बारिश हो रही थी, फिर भी हम टहलने गए।', 'كانت تمطر، ومع ذلك خرجنا للتنزه.'))
])

const T = (...v) => t11(...v)
const quests = {
	'reason-bridge-one': { title: T('Поэтому: deshalb', 'Тому: deshalb', 'So: deshalb', 'Dlatego: deshalb', 'Por eso: deshalb', 'C’est pourquoi : deshalb', 'Bu yüzden: deshalb', 'De aceea: deshalb', 'Shuning uchun: deshalb', 'इसलिए: deshalb', 'لذلك: deshalb'), points: [deshalbPoint] },
	'reason-bridge-two': { title: T('Потому что: weil или denn', 'Бо: weil чи denn', 'Because: weil or denn', 'Bo: weil czy denn', 'Porque: weil o denn', 'Parce que : weil ou denn', 'Çünkü: weil mi, denn mi', 'Pentru că: weil sau denn', 'Chunki: weil yoki denn', 'क्योंकि: weil या denn', 'لأن: weil أم denn'), points: [threeWaysPoint] },
	'reason-bridge-three': { title: T('Всё равно: trotzdem', 'Все одно: trotzdem', 'Still: trotzdem', 'Mimo to: trotzdem', 'Aun así: trotzdem', 'Quand même : trotzdem', 'Yine de: trotzdem', 'Totuși: trotzdem', 'Baribir: trotzdem', 'फिर भी: trotzdem', 'مع ذلك: trotzdem'), points: [trotzdemPoint] },
	'reason-bridge-four': { title: T('Хотя: obwohl', 'Хоча: obwohl', 'Although: obwohl', 'Chociaż: obwohl', 'Aunque: obwohl', 'Bien que : obwohl', 'Rağmen: obwohl', 'Deși: obwohl', 'Garchi: obwohl', 'हालाँकि: obwohl', 'رغم أن: obwohl'), points: [trotzdemPoint] },
	'reason-bridge-five': { title: T('Хотя или всё равно?', 'Хоча чи все одно?', 'Although or still?', 'Chociaż czy mimo to?', '¿Aunque o aun así?', 'Bien que ou quand même ?', 'Rağmen mi, yine de mi?', 'Deși sau totuși?', 'Garchi yoki baribir?', 'हालाँकि या फिर भी?', 'رغم أن أم مع ذلك؟'), points: [trotzdemPoint] },
	'reason-bridge-six': { title: T('Трудное решение', 'Важке рішення', 'A hard decision', 'Trudna decyzja', 'Una decisión difícil', 'Une décision difficile', 'Zor bir karar', 'O decizie grea', "Qiyin qaror", 'मुश्किल फ़ैसला', 'قرار صعب'), points: [threeWaysPoint, trotzdemPoint] },
	'reason-bridge-seven': { title: T('Практика: отпуск у моря', 'Практика: відпустка біля моря', 'Practice: seaside holiday', 'Praktyka: urlop nad morzem', 'Práctica: vacaciones en el mar', 'Pratique : vacances à la mer', 'Pratik: deniz tatili', 'Practică: concediu la mare', "Mashq: dengiz bo'yida ta'til", 'अभ्यास: समुद्र किनारे छुट्टी', 'تدريب: إجازة على البحر'), points: [threeWaysPoint] },
	'reason-bridge-eight': { title: T('Практика: спорт и здоровье', 'Практика: спорт і здоров’я', 'Practice: sport and health', 'Praktyka: sport i zdrowie', 'Práctica: deporte y salud', 'Pratique : sport et santé', 'Pratik: spor ve sağlık', 'Practică: sport și sănătate', "Mashq: sport va sog'liq", 'अभ्यास: खेल और स्वास्थ्य', 'تدريب: الرياضة والصحة'), points: [trotzdemPoint] },
	'reason-bridge-nine': { title: T('Повторение: причины', 'Повторення: причини', 'Review: reasons', 'Powtórka: przyczyny', 'Repaso: causas', 'Révision : causes', 'Tekrar: sebepler', 'Recapitulare: cauze', 'Takrorlash: sabablar', 'दोहराव: कारण', 'مراجعة: الأسباب'), points: [deshalbPoint, threeWaysPoint, trotzdemPoint] },
	'reason-bridge-ten': { title: finalTitle, points: [threeWaysPoint, trotzdemPoint] }
}

module.exports = quests
