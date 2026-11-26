// Грамматика к заданиям земли link-harbor (двойные союзы, statt ... zu, seitdem, bis, sobald)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const nichtNurPoint = pt(['nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch', 'nicht nur ..., sondern auch'], [
	'nicht nur ..., sondern auch значит «не только..., но и». nicht ..., sondern значит «не..., а». Перед sondern всегда запятая.',
	'nicht nur ..., sondern auch означає «не тільки..., а й». nicht ..., sondern означає «не..., а». Перед sondern завжди кома.',
	'nicht nur ..., sondern auch means "not only ... but also". nicht ..., sondern means "not ... but". Always a comma before sondern.',
	'nicht nur ..., sondern auch znaczy „nie tylko..., ale i”. nicht ..., sondern znaczy „nie..., lecz”. Przed sondern zawsze przecinek.',
	'nicht nur ..., sondern auch significa "no solo..., sino también". nicht ..., sondern significa "no..., sino". Siempre coma antes de sondern.',
	'nicht nur ..., sondern auch veut dire « non seulement..., mais aussi ». nicht ..., sondern veut dire « pas..., mais ». Toujours une virgule avant sondern.',
	'nicht nur ..., sondern auch "sadece ... değil, aynı zamanda" demektir. nicht ..., sondern "... değil, ...". sondern’dan önce hep virgül.',
	'nicht nur ..., sondern auch înseamnă „nu doar..., ci și”. nicht ..., sondern înseamnă „nu..., ci”. Înainte de sondern mereu virgulă.',
	"nicht nur ..., sondern auch \"nafaqat..., balki\" degani. nicht ..., sondern \"... emas, balki\". sondern oldidan doim vergul.",
	'nicht nur ..., sondern auch मतलब "न सिर्फ़..., बल्कि"। nicht ..., sondern मतलब "... नहीं, बल्कि"। sondern से पहले हमेशा कॉमा।',
	'nicht nur ..., sondern auch تعني "ليس فقط...، بل أيضاً". وnicht ..., sondern تعني "ليس...، بل". وقبل sondern فاصلة دائماً.'
], [ex('Er spricht nicht nur Deutsch, sondern auch Englisch.', t11('Он говорит не только по-немецки, но и по-английски.', 'Він говорить не тільки німецькою, а й англійською.', 'He speaks not only German but also English.', 'Mówi nie tylko po niemiecku, ale i po angielsku.', 'No solo habla alemán, sino también inglés.', 'Il parle non seulement allemand, mais aussi anglais.', 'Sadece Almanca değil, İngilizce de konuşuyor.', 'Vorbește nu doar germana, ci și engleza.', "U nafaqat nemischa, balki inglizcha ham gapiradi.", 'वह न सिर्फ़ जर्मन, बल्कि अंग्रेज़ी भी बोलता है।', 'يتكلم ليس الألمانية فقط بل الإنجليزية أيضاً.'))])

const entwederPoint = pt(['entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder, weder ... noch', 'entweder ... oder وweder ... noch'], [
	'entweder ... oder: одно из двух. weder ... noch: ни то, ни другое, nicht и kein уже не нужны.',
	'entweder ... oder: одне з двох. weder ... noch: ні те, ні інше, nicht і kein уже не потрібні.',
	'entweder ... oder: one of the two. weder ... noch: neither one, no nicht or kein needed.',
	'entweder ... oder: jedno z dwóch. weder ... noch: ani jedno, ani drugie, nicht i kein już niepotrzebne.',
	'entweder ... oder: una de las dos. weder ... noch: ninguna, ya no hace falta nicht ni kein.',
	'entweder ... oder : l’un ou l’autre. weder ... noch : ni l’un ni l’autre, plus besoin de nicht ni kein.',
	'entweder ... oder: ikisinden biri. weder ... noch: hiçbiri, nicht ve kein gerekmez.',
	'entweder ... oder: una din două. weder ... noch: niciuna, nu mai trebuie nicht sau kein.',
	"entweder ... oder: ikkisidan biri. weder ... noch: hech biri, nicht va kein kerak emas.",
	'entweder ... oder: दोनों में से एक। weder ... noch: कोई भी नहीं, nicht और kein की ज़रूरत नहीं।',
	'entweder ... oder: أحد الاثنين. وweder ... noch: لا هذا ولا ذاك، ولا حاجة إلى nicht أو kein.'
], [
	ex('Wir fahren entweder mit dem Zug oder mit dem Auto.', t11('Мы поедем или на поезде, или на машине.', 'Ми поїдемо або потягом, або машиною.', 'We’ll go either by train or by car.', 'Pojedziemy albo pociągiem, albo samochodem.', 'Iremos o en tren o en coche.', 'Nous irons soit en train, soit en voiture.', 'Ya trenle ya da arabayla gideceğiz.', 'Mergem fie cu trenul, fie cu mașina.', 'Yo poyezdda, yo mashinada boramiz.', 'हम या तो ट्रेन से जाएँगे या गाड़ी से।', 'سنسافر إما بالقطار أو بالسيارة.')),
	ex('Ich trinke weder Kaffee noch Tee.', t11('Я не пью ни кофе, ни чай.', 'Я не п’ю ні кави, ні чаю.', 'I drink neither coffee nor tea.', 'Nie piję ani kawy, ani herbaty.', 'No bebo ni café ni té.', 'Je ne bois ni café ni thé.', 'Ne kahve ne çay içerim.', 'Nu beau nici cafea, nici ceai.', 'Na qahva, na choy ichaman.', 'मैं न कॉफ़ी पीता हूँ, न चाय।', 'لا أشرب القهوة ولا الشاي.'))
])

const jeDestoPoint = pt(['je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...', 'je ..., desto ...'], [
	'je + сравнительная степень..., desto + сравнительная степень значит «чем..., тем». После je глагол в конце, после desto сразу глагол.',
	'je + вищий ступінь..., desto + вищий ступінь означає «чим..., тим». Після je дієслово в кінці, після desto одразу дієслово.',
	'je + comparative..., desto + comparative means "the more ..., the more". After je the verb goes last, after desto the verb comes right away.',
	'je + stopień wyższy..., desto + stopień wyższy znaczy „im..., tym”. Po je czasownik na końcu, po desto od razu czasownik.',
	'je + comparativo..., desto + comparativo significa "cuanto más..., más". Tras je, verbo al final; tras desto, verbo enseguida.',
	'je + comparatif..., desto + comparatif veut dire « plus..., plus ». Après je, verbe à la fin ; après desto, verbe tout de suite.',
	'je + üstünlük..., desto + üstünlük "ne kadar ..., o kadar". je’den sonra fiil sonda, desto’dan sonra fiil hemen.',
	'je + comparativ..., desto + comparativ înseamnă „cu cât..., cu atât”. După je verbul la final, după desto verbul imediat.',
	"je + qiyosiy daraja..., desto + qiyosiy daraja \"qancha..., shuncha\". je dan keyin fe'l oxirida, desto dan keyin fe'l darhol.",
	'je + तुलनात्मक..., desto + तुलनात्मक मतलब "जितना..., उतना"। je के बाद क्रिया अंत में, desto के बाद क्रिया तुरंत।',
	'je + صيغة المقارنة...، desto + صيغة المقارنة تعني "كلما...، كلما". بعد je الفعل في الآخر، وبعد desto الفعل فوراً.'
], [ex('Je mehr ich lerne, desto besser spreche ich.', t11('Чем больше я учусь, тем лучше говорю.', 'Чим більше я вчуся, тим краще говорю.', 'The more I study, the better I speak.', 'Im więcej się uczę, tym lepiej mówię.', 'Cuanto más estudio, mejor hablo.', 'Plus j’apprends, mieux je parle.', 'Ne kadar çok çalışırsam o kadar iyi konuşurum.', 'Cu cât învăț mai mult, cu atât vorbesc mai bine.', "Qancha ko'p o'qisam, shuncha yaxshi gapiraman.", 'जितना ज़्यादा सीखता हूँ, उतना बेहतर बोलता हूँ।', 'كلما تعلمت أكثر تكلمت أفضل.'))])

const stattPoint = pt(['statt ... zu: вместо того чтобы', 'statt ... zu: замість того щоб', 'statt ... zu: instead of', 'statt ... zu: zamiast', 'statt ... zu: en lugar de', 'statt ... zu : au lieu de', 'statt ... zu: -mek yerine', 'statt ... zu: în loc să', "statt ... zu: ... o'rniga", 'statt ... zu: के बजाय', 'statt ... zu: بدلاً من'], [
	'statt ... zu + инфинитив значит «вместо того чтобы». Устроено как ohne ... zu: zu и глагол в конце.',
	'statt ... zu + інфінітив означає «замість того щоб». Побудовано як ohne ... zu: zu і дієслово в кінці.',
	'statt ... zu + infinitive means "instead of doing". It works like ohne ... zu: zu and the verb at the end.',
	'statt ... zu + bezokolicznik znaczy „zamiast”. Działa jak ohne ... zu: zu i czasownik na końcu.',
	'statt ... zu + infinitivo significa "en lugar de". Funciona como ohne ... zu: zu y el verbo al final.',
	'statt ... zu + infinitif veut dire « au lieu de ». Ça marche comme ohne ... zu : zu et le verbe à la fin.',
	'statt ... zu + mastar "-mek yerine" demektir. ohne ... zu gibi kurulur: zu ve fiil sonda.',
	'statt ... zu + infinitiv înseamnă „în loc să”. Funcționează ca ohne ... zu: zu și verbul la final.',
	"statt ... zu + infinitiv \"... qilish o'rniga\" degani. ohne ... zu kabi tuziladi: zu va fe'l oxirida.",
	'statt ... zu + इन्फ़िनिटिव मतलब "करने के बजाय"। ohne ... zu की तरह: zu और क्रिया अंत में।',
	'statt ... zu + المصدر تعني "بدلاً من". وتُبنى مثل ohne ... zu: zu والفعل في الآخر.'
], [ex('Er spielt, statt zu lernen.', t11('Он играет вместо того, чтобы учиться.', 'Він грає замість того, щоб учитися.', 'He plays instead of studying.', 'Bawi się zamiast się uczyć.', 'Juega en lugar de estudiar.', 'Il joue au lieu d’étudier.', 'Ders çalışmak yerine oynuyor.', 'Se joacă în loc să învețe.', "U o'qish o'rniga o'ynayapti.", 'वह पढ़ने के बजाय खेल रहा है।', 'يلعب بدلاً من أن يدرس.'))])

const timePoint = pt(['seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem, bis, sobald', 'seitdem وbis وsobald'], [
	'seitdem: с тех пор как. bis: пока не. sobald: как только. Глагол в конце, как после wenn.',
	'seitdem: відтоді як. bis: доки не. sobald: щойно. Дієслово в кінці, як після wenn.',
	'seitdem: since. bis: until. sobald: as soon as. The verb goes last, as after wenn.',
	'seitdem: odkąd. bis: dopóki nie. sobald: gdy tylko. Czasownik na końcu, jak po wenn.',
	'seitdem: desde que. bis: hasta que. sobald: en cuanto. Verbo al final, como tras wenn.',
	'seitdem : depuis que. bis : jusqu’à ce que. sobald : dès que. Verbe à la fin, comme après wenn.',
	'seitdem: -dığından beri. bis: -ene kadar. sobald: -ir -mez. Fiil sonda, wenn’den sonraki gibi.',
	'seitdem: de când. bis: până când. sobald: imediat ce. Verbul la final, ca după wenn.',
	"seitdem: ...dan beri. bis: ...guncha. sobald: ...ishi bilan. Fe'l oxirida, wenn dan keyingidek.",
	'seitdem: जब से। bis: जब तक नहीं। sobald: जैसे ही। क्रिया अंत में, wenn की तरह।',
	'seitdem: منذ أن. وbis: حتى. وsobald: بمجرد أن. والفعل في الآخر كما بعد wenn.'
], [ex('Seitdem ich in Berlin wohne, spreche ich viel Deutsch.', t11('С тех пор как я живу в Берлине, я много говорю по-немецки.', 'Відтоді як я живу в Берліні, я багато говорю німецькою.', 'Since I’ve been living in Berlin, I speak a lot of German.', 'Odkąd mieszkam w Berlinie, dużo mówię po niemiecku.', 'Desde que vivo en Berlín, hablo mucho alemán.', 'Depuis que j’habite à Berlin, je parle beaucoup allemand.', 'Berlin’de yaşadığımdan beri çok Almanca konuşuyorum.', 'De când locuiesc în Berlin, vorbesc mult germana.', "Berlinda yashaganimdan beri ko'p nemischa gapiraman.", 'जब से मैं बर्लिन में रहता हूँ, बहुत जर्मन बोलता हूँ।', 'منذ أن أسكن في برلين أتكلم الألمانية كثيراً.'))])

const T = (...v) => t11(...v)
const quests = {
	'link-harbor-one': { title: T('Не только..., но и...', 'Не тільки..., а й...', 'Not only ... but also', 'Nie tylko..., ale i...', 'No solo..., sino también', 'Non seulement..., mais aussi', 'Sadece değil, aynı zamanda', 'Nu doar..., ci și', 'Nafaqat..., balki', 'न सिर्फ़..., बल्कि', 'ليس فقط...، بل'), points: [nichtNurPoint] },
	'link-harbor-two': { title: T('Или..., или...', 'Або..., або...', 'Either ... or', 'Albo..., albo...', 'O..., o...', 'Soit..., soit...', 'Ya ... ya da', 'Fie..., fie...', 'Yo..., yo...', 'या तो..., या', 'إما...، أو'), points: [entwederPoint] },
	'link-harbor-three': { title: T('Ни..., ни...', 'Ні..., ні...', 'Neither ... nor', 'Ani..., ani...', 'Ni..., ni...', 'Ni..., ni...', 'Ne ... ne', 'Nici..., nici...', 'Na..., na...', 'न..., न', 'لا...، ولا'), points: [entwederPoint] },
	'link-harbor-four': { title: T('Чем..., тем...', 'Чим..., тим...', 'The more ..., the more', 'Im..., tym...', 'Cuanto más..., más', 'Plus..., plus', 'Ne kadar ..., o kadar', 'Cu cât..., cu atât', 'Qancha..., shuncha', 'जितना..., उतना', 'كلما...، كلما'), points: [jeDestoPoint] },
	'link-harbor-five': { title: T('Вместо того чтобы', 'Замість того щоб', 'Instead of', 'Zamiast', 'En lugar de', 'Au lieu de', 'Yerine', 'În loc să', "O'rniga", 'के बजाय', 'بدلاً من'), points: [stattPoint] },
	'link-harbor-six': { title: T('С тех пор как, пока не, как только', 'Відтоді як, доки не, щойно', 'Since, until, as soon as', 'Odkąd, dopóki nie, gdy tylko', 'Desde que, hasta que, en cuanto', 'Depuis que, jusqu’à ce que, dès que', 'Beri, kadar, -ir -mez', 'De când, până când, imediat ce', 'Beri, guncha, bilan', 'जब से, जब तक, जैसे ही', 'منذ أن، حتى، بمجرد أن'), points: [timePoint] },
	'link-harbor-seven': { title: T('Практика: выбор профессии', 'Практика: вибір професії', 'Practice: choosing a career', 'Praktyka: wybór zawodu', 'Práctica: elegir profesión', 'Pratique : choisir un métier', 'Pratik: meslek seçimi', 'Practică: alegerea profesiei', 'Mashq: kasb tanlash', 'अभ्यास: पेशा चुनना', 'تدريب: اختيار المهنة'), points: [entwederPoint, jeDestoPoint] },
	'link-harbor-eight': { title: T('Практика: жизнь в новом городе', 'Практика: життя в новому місті', 'Practice: life in a new city', 'Praktyka: życie w nowym mieście', 'Práctica: vida en una ciudad nueva', 'Pratique : la vie dans une nouvelle ville', 'Pratik: yeni şehirde hayat', 'Practică: viața într-un oraș nou', 'Mashq: yangi shahardagi hayot', 'अभ्यास: नए शहर में ज़िंदगी', 'تدريب: الحياة في مدينة جديدة'), points: [stattPoint, timePoint] },
	'link-harbor-nine': { title: T('Повторение: связки', 'Повторення: сполучники', 'Review: connectors', 'Powtórka: spójniki', 'Repaso: conectores', 'Révision : connecteurs', 'Tekrar: bağlaçlar', 'Recapitulare: conectori', "Takrorlash: bog'lovchilar", 'दोहराव: योजक', 'مراجعة: أدوات الربط'), points: [nichtNurPoint, entwederPoint, jeDestoPoint] },
	'link-harbor-ten': { title: finalTitle, points: [nichtNurPoint, stattPoint, timePoint] }
}

module.exports = quests
