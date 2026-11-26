// Грамматика к заданиям земли purpose-path (um ... zu, damit, wozu)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const umZuPoint = pt(['um ... zu: чтобы', 'um ... zu: щоб', 'um ... zu: in order to', 'um ... zu: żeby', 'um ... zu: para', 'um ... zu : pour', 'um ... zu: -mek için', 'um ... zu: ca să', 'um ... zu: ... uchun', 'um ... zu: ... के लिए', 'um ... zu: لكي'], [
	'um ... zu, когда цель у того же человека. zu и инфинитив в самом конце.',
	'um ... zu, коли мета в тієї самої людини. zu та інфінітив у самому кінці.',
	'um ... zu when the same person has the goal. zu and the infinitive go at the very end.',
	'um ... zu, gdy cel ma ta sama osoba. zu i bezokolicznik na samym końcu.',
	'um ... zu cuando el objetivo es de la misma persona. zu y el infinitivo van al final.',
	'um ... zu quand le but concerne la même personne. zu et l’infinitif vont tout à la fin.',
	'Amaç aynı kişiye aitse um ... zu. zu ve mastar en sonda.',
	'um ... zu când scopul e al aceleiași persoane. zu și infinitivul la final.',
	"Maqsad o'sha odamniki bo'lsa um ... zu. zu va infinitiv eng oxirida.",
	'जब लक्ष्य उसी व्यक्ति का हो, तब um ... zu। zu और इन्फ़िनिटिव बिल्कुल अंत में।',
	'um ... zu عندما يكون الهدف للشخص نفسه. وzu والمصدر في آخر الجملة.'
], [ex('Ich lerne Deutsch, um in Deutschland zu arbeiten.', t11('Я учу немецкий, чтобы работать в Германии.', 'Я вчу німецьку, щоб працювати в Німеччині.', 'I’m learning German to work in Germany.', 'Uczę się niemieckiego, żeby pracować w Niemczech.', 'Aprendo alemán para trabajar en Alemania.', 'J’apprends l’allemand pour travailler en Allemagne.', 'Almanya’da çalışmak için Almanca öğreniyorum.', 'Învăț germana ca să lucrez în Germania.', "Germaniyada ishlash uchun nemis tilini o'rganyapman.", 'मैं जर्मनी में काम करने के लिए जर्मन सीख रहा हूँ।', 'أتعلم الألمانية لكي أعمل في ألمانيا.'))])

const zuInsidePoint = pt(['zu внутри: einzukaufen', 'zu всередині: einzukaufen', 'zu inside: einzukaufen', 'zu w środku: einzukaufen', 'zu dentro: einzukaufen', 'zu à l’intérieur : einzukaufen', 'zu içeride: einzukaufen', 'zu în interior: einzukaufen', "zu ichida: einzukaufen", 'zu बीच में: einzukaufen', 'zu في الداخل: einzukaufen'], [
	'У отделяемых глаголов zu встаёт между приставкой и основой: einkaufen → einzukaufen, anrufen → anzurufen.',
	'У відокремлюваних дієслів zu стає між префіксом і основою: einkaufen → einzukaufen, anrufen → anzurufen.',
	'With separable verbs zu goes between the prefix and the stem: einkaufen → einzukaufen, anrufen → anzurufen.',
	'W czasownikach rozdzielnych zu stoi między przedrostkiem a tematem: einkaufen → einzukaufen, anrufen → anzurufen.',
	'En los verbos separables zu va entre el prefijo y la raíz: einkaufen → einzukaufen, anrufen → anzurufen.',
	'Avec les verbes séparables, zu se place entre le préfixe et le radical : einkaufen → einzukaufen, anrufen → anzurufen.',
	'Ayrılabilen fiillerde zu ön ek ile kök arasına girer: einkaufen → einzukaufen, anrufen → anzurufen.',
	'La verbele separabile zu stă între prefix și rădăcină: einkaufen → einzukaufen, anrufen → anzurufen.',
	"Ajraladigan fe'llarda zu old qo'shimcha va o'zak orasiga kiradi: einkaufen → einzukaufen, anrufen → anzurufen.",
	'अलग होने वाली क्रियाओं में zu उपसर्ग और मूल के बीच आता है: einkaufen → einzukaufen, anrufen → anzurufen।',
	'في الأفعال المنفصلة تقع zu بين السابقة والجذر: einkaufen → einzukaufen، anrufen → anzurufen.'
], [ex('Ich fahre in die Stadt, um einzukaufen.', t11('Я еду в город, чтобы сделать покупки.', 'Я їду в місто, щоб зробити покупки.', 'I’m going into town to do some shopping.', 'Jadę do miasta, żeby zrobić zakupy.', 'Voy a la ciudad a hacer la compra.', 'Je vais en ville pour faire des courses.', 'Alışveriş yapmak için şehre gidiyorum.', 'Merg în oraș ca să fac cumpărături.', 'Xarid qilish uchun shaharga boraman.', 'मैं खरीदारी करने शहर जा रहा हूँ।', 'أذهب إلى المدينة لكي أتسوق.'))])

const damitPoint = pt(['damit: чтобы ты...', 'damit: щоб ти...', 'damit: so that you...', 'damit: żebyś...', 'damit: para que tú...', 'damit : pour que tu...', 'damit: senin ... için', 'damit: ca tu să...', 'damit: sen ... uchun', 'damit: ताकि तुम...', 'damit: لكي تـ...'], [
	'damit, когда действуют разные люди. Это придаточное: глагол в конце. Тот же человек: um ... zu. Другой человек: damit.',
	'damit, коли діють різні люди. Це підрядне: дієслово в кінці. Та сама людина: um ... zu. Інша людина: damit.',
	'damit when different people act. It’s a subordinate clause: verb at the end. Same person: um ... zu. Another person: damit.',
	'damit, gdy działają różne osoby. To zdanie podrzędne: czasownik na końcu. Ta sama osoba: um ... zu. Inna osoba: damit.',
	'damit cuando actúan personas distintas. Es subordinada: verbo al final. Misma persona: um ... zu. Otra persona: damit.',
	'damit quand ce sont des personnes différentes. C’est une subordonnée : verbe à la fin. Même personne : um ... zu. Autre personne : damit.',
	'Farklı kişiler eylem yapıyorsa damit. Yan cümle: fiil sonda. Aynı kişi: um ... zu. Başka kişi: damit.',
	'damit când acționează persoane diferite. E subordonată: verbul la final. Aceeași persoană: um ... zu. Altă persoană: damit.',
	"Har xil odamlar harakat qilsa damit. Bu ergash gap: fe'l oxirida. O'sha odam: um ... zu. Boshqa odam: damit.",
	'जब अलग-अलग लोग काम करें, तब damit। यह उपवाक्य है: क्रिया अंत में। वही व्यक्ति: um ... zu। दूसरा व्यक्ति: damit।',
	'damit عندما يقوم أشخاص مختلفون بالفعل. وهي جملة فرعية والفعل في الآخر. الشخص نفسه: um ... zu. وشخص آخر: damit.'
], [ex('Ich spreche langsam, damit du mich verstehst.', t11('Я говорю медленно, чтобы ты меня понял.', 'Я говорю повільно, щоб ти мене зрозумів.', 'I speak slowly so that you understand me.', 'Mówię powoli, żebyś mnie zrozumiał.', 'Hablo despacio para que me entiendas.', 'Je parle lentement pour que tu me comprennes.', 'Beni anlaman için yavaş konuşuyorum.', 'Vorbesc rar ca să mă înțelegi.', 'Meni tushunishing uchun sekin gapiraman.', 'मैं धीरे बोलता हूँ ताकि तुम मुझे समझो।', 'أتكلم ببطء لكي تفهمني.'))])

const wozuPoint = pt(['Wozu? или Warum?', 'Wozu? чи Warum?', 'Wozu? or Warum?', 'Wozu? czy Warum?', '¿Wozu? o Warum?', 'Wozu ? ou Warum ?', 'Wozu? mu, Warum? mu', 'Wozu? sau Warum?', 'Wozu? yoki Warum?', 'Wozu? या Warum?', 'Wozu؟ أم Warum؟'], [
	'Wozu? (зачем?) спрашивает о цели, отвечаем um ... zu или damit. Warum? (почему?) спрашивает о причине, отвечаем weil.',
	'Wozu? (навіщо?) питає про мету, відповідаємо um ... zu або damit. Warum? (чому?) питає про причину, відповідаємо weil.',
	'Wozu? (what for?) asks about a goal, answer with um ... zu or damit. Warum? (why?) asks about a reason, answer with weil.',
	'Wozu? (po co?) pyta o cel, odpowiadamy um ... zu albo damit. Warum? (dlaczego?) pyta o przyczynę, odpowiadamy weil.',
	'Wozu? (¿para qué?) pregunta por el objetivo: um ... zu o damit. Warum? (¿por qué?) por la causa: weil.',
	'Wozu ? (dans quel but ?) demande le but : um ... zu ou damit. Warum ? (pourquoi ?) demande la cause : weil.',
	'Wozu? (ne için?) amacı sorar: um ... zu ya da damit. Warum? (neden?) sebebi sorar: weil.',
	'Wozu? (pentru ce?) întreabă de scop: um ... zu sau damit. Warum? (de ce?) întreabă de cauză: weil.',
	"Wozu? (nima uchun, qaysi maqsadda?) maqsadni so'raydi: um ... zu yoki damit. Warum? (nega?) sababni so'raydi: weil.",
	'Wozu? (किसलिए?) लक्ष्य पूछता है: um ... zu या damit। Warum? (क्यों?) कारण पूछता है: weil।',
	'Wozu؟ (لأي غرض؟) تسأل عن الهدف ونجيب بـ um ... zu أو damit. وWarum؟ (لماذا؟) تسأل عن السبب ونجيب بـ weil.'
], [ex('Wozu lernst du Deutsch? Um in Deutschland zu studieren.', t11('Зачем ты учишь немецкий? Чтобы учиться в Германии.', 'Навіщо ти вчиш німецьку? Щоб навчатися в Німеччині.', 'What are you learning German for? To study in Germany.', 'Po co uczysz się niemieckiego? Żeby studiować w Niemczech.', '¿Para qué aprendes alemán? Para estudiar en Alemania.', 'Pourquoi apprends-tu l’allemand ? Pour étudier en Allemagne.', 'Almancayı ne için öğreniyorsun? Almanya’da okumak için.', 'Pentru ce înveți germana? Ca să studiez în Germania.', "Nemis tilini nima uchun o'rganyapsan? Germaniyada o'qish uchun.", 'तुम जर्मन किसलिए सीख रहे हो? जर्मनी में पढ़ने के लिए।', 'لماذا تتعلم الألمانية؟ لكي أدرس في ألمانيا.'))])

const T = (...v) => t11(...v)
const quests = {
	'purpose-path-one': { title: T('Чтобы: um ... zu', 'Щоб: um ... zu', 'In order to: um ... zu', 'Żeby: um ... zu', 'Para: um ... zu', 'Pour : um ... zu', 'İçin: um ... zu', 'Ca să: um ... zu', 'Uchun: um ... zu', 'के लिए: um ... zu', 'لكي: um ... zu'), points: [umZuPoint] },
	'purpose-path-two': { title: T('Чтобы + приставка', 'Щоб + префікс', 'In order to + prefix', 'Żeby + przedrostek', 'Para + prefijo', 'Pour + préfixe', 'İçin + ön ek', 'Ca să + prefix', "Uchun + old qo'shimcha", 'के लिए + उपसर्ग', 'لكي + السابقة'), points: [zuInsidePoint] },
	'purpose-path-three': { title: T('Чтобы ты: damit', 'Щоб ти: damit', 'So that you: damit', 'Żebyś: damit', 'Para que tú: damit', 'Pour que tu : damit', 'Senin için: damit', 'Ca tu să: damit', 'Sen uchun: damit', 'ताकि तुम: damit', 'لكي تـ: damit'), points: [damitPoint] },
	'purpose-path-four': { title: T('um ... zu или damit?', 'um ... zu чи damit?', 'um ... zu or damit?', 'um ... zu czy damit?', '¿um ... zu o damit?', 'um ... zu ou damit ?', 'um ... zu mu, damit mi?', 'um ... zu sau damit?', 'um ... zu yoki damit?', 'um ... zu या damit?', 'um ... zu أم damit؟'), points: [damitPoint, umZuPoint] },
	'purpose-path-five': { title: T('Зачем? Wozu?', 'Навіщо? Wozu?', 'What for? Wozu?', 'Po co? Wozu?', '¿Para qué? Wozu?', 'Dans quel but ? Wozu ?', 'Ne için? Wozu?', 'Pentru ce? Wozu?', 'Nima uchun? Wozu?', 'किसलिए? Wozu?', 'لأي غرض؟ Wozu؟'), points: [wozuPoint] },
	'purpose-path-six': { title: T('Планы и цели', 'Плани й цілі', 'Plans and goals', 'Plany i cele', 'Planes y metas', 'Projets et objectifs', 'Planlar ve hedefler', 'Planuri și obiective', 'Rejalar va maqsadlar', 'योजनाएँ और लक्ष्य', 'الخطط والأهداف'), points: [umZuPoint, damitPoint] },
	'purpose-path-seven': { title: T('Практика: новая жизнь в Германии', 'Практика: нове життя в Німеччині', 'Practice: a new life in Germany', 'Praktyka: nowe życie w Niemczech', 'Práctica: una vida nueva en Alemania', 'Pratique : une nouvelle vie en Allemagne', 'Pratik: Almanya’da yeni hayat', 'Practică: o viață nouă în Germania', 'Mashq: Germaniyadagi yangi hayot', 'अभ्यास: जर्मनी में नई ज़िंदगी', 'تدريب: حياة جديدة في ألمانيا'), points: [umZuPoint, damitPoint] },
	'purpose-path-eight': { title: T('Практика: готовим праздник', 'Практика: готуємо свято', 'Practice: preparing a party', 'Praktyka: szykujemy przyjęcie', 'Práctica: preparamos la fiesta', 'Pratique : on prépare la fête', 'Pratik: parti hazırlığı', 'Practică: pregătim petrecerea', 'Mashq: bayramga tayyorgarlik', 'अभ्यास: पार्टी की तैयारी', 'تدريب: نحضّر الحفلة'), points: [zuInsidePoint, damitPoint] },
	'purpose-path-nine': { title: T('Повторение: цели', 'Повторення: цілі', 'Review: goals', 'Powtórka: cele', 'Repaso: metas', 'Révision : les buts', 'Tekrar: amaçlar', 'Recapitulare: scopuri', 'Takrorlash: maqsadlar', 'दोहराव: लक्ष्य', 'مراجعة: الأهداف'), points: [umZuPoint, zuInsidePoint, damitPoint] },
	'purpose-path-ten': { title: finalTitle, points: [umZuPoint, damitPoint, wozuPoint] }
}

module.exports = quests
