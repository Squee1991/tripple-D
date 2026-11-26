// Грамматика к заданиям земли question-bridge (глаголы с предлогами, worauf, darauf)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const verbPrepPoint = pt(['Глагол + предлог', 'Дієслово + прийменник', 'Verb + preposition', 'Czasownik + przyimek', 'Verbo + preposición', 'Verbe + préposition', 'Fiil + edat', 'Verb + prepoziție', "Fe'l + ko'makchi", 'क्रिया + संबंधसूचक', 'الفعل + حرف الجر'], [
	'Многие глаголы идут со своим предлогом, учи их вместе: denken an, sich interessieren für, sich kümmern um, sich ärgern über (всё + Akkusativ).',
	'Багато дієслів ідуть зі своїм прийменником, вчи їх разом: denken an, sich interessieren für, sich kümmern um, sich ärgern über (усе + Akkusativ).',
	'Many verbs come with their own preposition, learn them together: denken an, sich interessieren für, sich kümmern um, sich ärgern über (all + accusative).',
	'Wiele czasowników ma swój przyimek, ucz się ich razem: denken an, sich interessieren für, sich kümmern um, sich ärgern über (wszystkie + Akkusativ).',
	'Muchos verbos llevan su propia preposición, apréndelos juntos: denken an, sich interessieren für, sich kümmern um, sich ärgern über (todos + acusativo).',
	'Beaucoup de verbes ont leur préposition, apprends-les ensemble : denken an, sich interessieren für, sich kümmern um, sich ärgern über (tous + accusatif).',
	'Birçok fiil kendi edatıyla gelir, birlikte öğren: denken an, sich interessieren für, sich kümmern um, sich ärgern über (hepsi + Akkusativ).',
	'Multe verbe au prepoziția lor, învață-le împreună: denken an, sich interessieren für, sich kümmern um, sich ärgern über (toate + acuzativ).',
	"Ko'p fe'llar o'z ko'makchisi bilan keladi, birga o'rgan: denken an, sich interessieren für, sich kümmern um, sich ärgern über (hammasi + Akkusativ).",
	'कई क्रियाएँ अपने संबंधसूचक के साथ आती हैं, साथ में सीखो: denken an, sich interessieren für, sich kümmern um, sich ärgern über (सब + Akkusativ)।',
	'أفعال كثيرة تأتي مع حرف جر خاص بها، فاحفظها معاً: denken an، sich interessieren für، sich kümmern um، sich ärgern über (كلها + المفعول).'
], [ex('Ich denke an dich.', t11('Я думаю о тебе.', 'Я думаю про тебе.', 'I’m thinking of you.', 'Myślę o tobie.', 'Pienso en ti.', 'Je pense à toi.', 'Seni düşünüyorum.', 'Mă gândesc la tine.', "Seni o'ylayapman.", 'मैं तुम्हारे बारे में सोच रहा हूँ।', 'أفكر فيك.'))])

const wenPoint = pt(['Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen? Worauf?', 'Auf wen؟ Worauf؟'], [
	'О человеке: предлог + wen/wem (Auf wen wartest du?). О вещи: wo + предлог (Worauf wartest du?). Перед гласной вставляем -r-: worauf, woran, но wofür.',
	'Про людину: прийменник + wen/wem (Auf wen wartest du?). Про річ: wo + прийменник (Worauf wartest du?). Перед голосною вставляємо -r-: worauf, woran, але wofür.',
	'About a person: preposition + wen/wem (Auf wen wartest du?). About a thing: wo + preposition (Worauf wartest du?). Before a vowel add -r-: worauf, woran, but wofür.',
	'O osobę: przyimek + wen/wem (Auf wen wartest du?). O rzecz: wo + przyimek (Worauf wartest du?). Przed samogłoską wstawiamy -r-: worauf, woran, ale wofür.',
	'Sobre una persona: preposición + wen/wem (Auf wen wartest du?). Sobre una cosa: wo + preposición (Worauf wartest du?). Ante vocal se añade -r-: worauf, woran, pero wofür.',
	'Pour une personne : préposition + wen/wem (Auf wen wartest du ?). Pour une chose : wo + préposition (Worauf wartest du ?). Devant une voyelle on ajoute -r- : worauf, woran, mais wofür.',
	'Kişi için: edat + wen/wem (Auf wen wartest du?). Şey için: wo + edat (Worauf wartest du?). Ünlüden önce -r- eklenir: worauf, woran, ama wofür.',
	'Despre o persoană: prepoziție + wen/wem (Auf wen wartest du?). Despre un lucru: wo + prepoziție (Worauf wartest du?). Înainte de vocală se pune -r-: worauf, woran, dar wofür.',
	"Odam haqida: ko'makchi + wen/wem (Auf wen wartest du?). Narsa haqida: wo + ko'makchi (Worauf wartest du?). Unli oldidan -r- qo'shiladi: worauf, woran, lekin wofür.",
	'व्यक्ति के बारे में: संबंधसूचक + wen/wem (Auf wen wartest du?)। चीज़ के बारे में: wo + संबंधसूचक (Worauf wartest du?)। स्वर से पहले -r-: worauf, woran, पर wofür।',
	'عن شخص: حرف الجر + wen/wem (Auf wen wartest du؟). وعن شيء: wo + حرف الجر (Worauf wartest du؟). وقبل الحرف المتحرك نضيف -r-: worauf، woran، لكن wofür.'
], [ex('Worauf wartest du?', t11('Чего ты ждёшь?', 'На що ти чекаєш?', 'What are you waiting for?', 'Na co czekasz?', '¿Qué esperas?', 'Qu’est-ce que tu attends ?', 'Neyi bekliyorsun?', 'Ce aștepți?', 'Nimani kutyapsan?', 'तुम किसका इंतज़ार कर रहे हो?', 'ماذا تنتظر؟'))])

const daraufPoint = pt(['darauf или auf ihn', 'darauf чи auf ihn', 'darauf or auf ihn', 'darauf czy auf ihn', 'darauf o auf ihn', 'darauf ou auf ihn', 'darauf mı, auf ihn mi', 'darauf sau auf ihn', 'darauf yoki auf ihn', 'darauf या auf ihn', 'darauf أم auf ihn'], [
	'В ответе вещь заменяем на da(r) + предлог: Ich warte darauf. Человека на предлог + местоимение: Ich warte auf ihn.',
	'У відповіді річ замінюємо на da(r) + прийменник: Ich warte darauf. Людину на прийменник + займенник: Ich warte auf ihn.',
	'In the answer, replace a thing with da(r) + preposition: Ich warte darauf. Replace a person with preposition + pronoun: Ich warte auf ihn.',
	'W odpowiedzi rzecz zastępujemy da(r) + przyimek: Ich warte darauf. Osobę przyimkiem + zaimkiem: Ich warte auf ihn.',
	'En la respuesta, una cosa se sustituye por da(r) + preposición: Ich warte darauf. Una persona, por preposición + pronombre: Ich warte auf ihn.',
	'Dans la réponse, une chose devient da(r) + préposition : Ich warte darauf. Une personne devient préposition + pronom : Ich warte auf ihn.',
	'Cevapta şey yerine da(r) + edat: Ich warte darauf. Kişi yerine edat + zamir: Ich warte auf ihn.',
	'În răspuns, lucrul devine da(r) + prepoziție: Ich warte darauf. Persoana devine prepoziție + pronume: Ich warte auf ihn.',
	"Javobda narsa o'rniga da(r) + ko'makchi: Ich warte darauf. Odam o'rniga ko'makchi + olmosh: Ich warte auf ihn.",
	'जवाब में चीज़ की जगह da(r) + संबंधसूचक: Ich warte darauf। व्यक्ति की जगह संबंधसूचक + सर्वनाम: Ich warte auf ihn।',
	'في الجواب نستبدل الشيء بـ da(r) + حرف الجر: Ich warte darauf. والشخص بحرف الجر + الضمير: Ich warte auf ihn.'
], [
	ex('Wartest du auf den Bus? Ja, ich warte darauf.', t11('Ты ждёшь автобус? Да, жду.', 'Ти чекаєш на автобус? Так, чекаю.', 'Are you waiting for the bus? Yes, I’m waiting for it.', 'Czekasz na autobus? Tak, czekam na niego.', '¿Esperas el autobús? Sí, lo espero.', 'Tu attends le bus ? Oui, je l’attends.', 'Otobüsü mü bekliyorsun? Evet, onu bekliyorum.', 'Aștepți autobuzul? Da, îl aștept.', 'Avtobusni kutyapsanmi? Ha, kutyapman.', 'क्या तुम बस का इंतज़ार कर रहे हो? हाँ, उसी का।', 'هل تنتظر الحافلة؟ نعم، أنتظرها.')),
	ex('Denkst du an Anna? Ja, ich denke an sie.', t11('Ты думаешь об Анне? Да, думаю о ней.', 'Ти думаєш про Анну? Так, думаю про неї.', 'Are you thinking of Anna? Yes, I’m thinking of her.', 'Myślisz o Annie? Tak, myślę o niej.', '¿Piensas en Anna? Sí, pienso en ella.', 'Tu penses à Anna ? Oui, je pense à elle.', 'Anna’yı mı düşünüyorsun? Evet, onu düşünüyorum.', 'Te gândești la Anna? Da, mă gândesc la ea.', "Anna haqida o'ylayapsanmi? Ha, u haqida o'ylayapman.", 'क्या तुम अन्ना के बारे में सोच रहे हो? हाँ, उसी के बारे में।', 'هل تفكر في آنا؟ نعم، أفكر فيها.'))
])

const daraufDassPoint = pt(['darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...'], [
	'Если дальше целое предложение, сначала da(r) + предлог, потом запятая и dass или zu + инфинитив.',
	'Якщо далі ціле речення, спершу da(r) + прийменник, потім кома і dass або zu + інфінітив.',
	'If a whole clause follows, put da(r) + preposition first, then a comma and dass or zu + infinitive.',
	'Jeśli dalej jest całe zdanie, najpierw da(r) + przyimek, potem przecinek i dass albo zu + bezokolicznik.',
	'Si sigue una oración entera, primero da(r) + preposición, luego coma y dass o zu + infinitivo.',
	'Si une phrase entière suit, on met d’abord da(r) + préposition, puis une virgule et dass ou zu + infinitif.',
	'Ardından tam bir cümle geliyorsa önce da(r) + edat, sonra virgül ve dass ya da zu + mastar.',
	'Dacă urmează o propoziție întreagă, întâi da(r) + prepoziție, apoi virgulă și dass sau zu + infinitiv.',
	"Keyin butun gap kelsa, avval da(r) + ko'makchi, keyin vergul va dass yoki zu + infinitiv.",
	'अगर आगे पूरा वाक्य हो, तो पहले da(r) + संबंधसूचक, फिर कॉमा और dass या zu + इन्फ़िनिटिव।',
	'إذا تلتها جملة كاملة نضع أولاً da(r) + حرف الجر، ثم فاصلة وdass أو zu + المصدر.'
], [ex('Ich freue mich darauf, dass du kommst.', t11('Я рад, что ты приедешь.', 'Я радію, що ти приїдеш.', 'I’m looking forward to you coming.', 'Cieszę się, że przyjedziesz.', 'Me hace ilusión que vengas.', 'Je me réjouis que tu viennes.', 'Gelmeni dört gözle bekliyorum.', 'Abia aștept să vii.', 'Kelishingni intiqlik bilan kutyapman.', 'मुझे खुशी है कि तुम आ रहे हो।', 'أنا متشوق لقدومك.'))])

const T = (...v) => t11(...v)
const quests = {
	'question-bridge-one': { title: T('Глагол + предлог', 'Дієслово + прийменник', 'Verb + preposition', 'Czasownik + przyimek', 'Verbo + preposición', 'Verbe + préposition', 'Fiil + edat', 'Verb + prepoziție', "Fe'l + ko'makchi", 'क्रिया + संबंधसूचक', 'الفعل + حرف الجر'), points: [verbPrepPoint] },
	'question-bridge-two': { title: T('Auf wen? О людях', 'Auf wen? Про людей', 'Auf wen? About people', 'Auf wen? O ludziach', 'Auf wen? Sobre personas', 'Auf wen ? Les personnes', 'Auf wen? Kişiler', 'Auf wen? Despre oameni', 'Auf wen? Odamlar haqida', 'Auf wen? लोगों के बारे में', 'Auf wen؟ عن الأشخاص'), points: [wenPoint] },
	'question-bridge-three': { title: T('Worauf? О вещах', 'Worauf? Про речі', 'Worauf? About things', 'Worauf? O rzeczach', 'Worauf? Sobre cosas', 'Worauf ? Les choses', 'Worauf? Şeyler', 'Worauf? Despre lucruri', 'Worauf? Narsalar haqida', 'Worauf? चीज़ों के बारे में', 'Worauf؟ عن الأشياء'), points: [wenPoint] },
	'question-bridge-four': { title: T('darauf, dafür в ответе', 'darauf, dafür у відповіді', 'darauf, dafür in answers', 'darauf, dafür w odpowiedzi', 'darauf, dafür en la respuesta', 'darauf, dafür dans la réponse', 'Cevapta darauf, dafür', 'darauf, dafür în răspuns', 'Javobda darauf, dafür', 'जवाब में darauf, dafür', 'darauf وdafür في الجواب'), points: [daraufPoint] },
	'question-bridge-five': { title: T('auf ihn или darauf?', 'auf ihn чи darauf?', 'auf ihn or darauf?', 'auf ihn czy darauf?', '¿auf ihn o darauf?', 'auf ihn ou darauf ?', 'auf ihn mı, darauf mu?', 'auf ihn sau darauf?', 'auf ihn yoki darauf?', 'auf ihn या darauf?', 'auf ihn أم darauf؟'), points: [daraufPoint] },
	'question-bridge-six': { title: T('darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...', 'darauf, dass ...'), points: [daraufDassPoint] },
	'question-bridge-seven': { title: T('Практика: хобби и интересы', 'Практика: хобі та інтереси', 'Practice: hobbies and interests', 'Praktyka: hobby i zainteresowania', 'Práctica: aficiones e intereses', 'Pratique : loisirs et intérêts', 'Pratik: hobiler ve ilgi alanları', 'Practică: hobby-uri și interese', 'Mashq: qiziqishlar', 'अभ्यास: शौक और रुचियाँ', 'تدريب: الهوايات والاهتمامات'), points: [verbPrepPoint, wenPoint] },
	'question-bridge-eight': { title: T('Практика: письмо подруге', 'Практика: лист подрузі', 'Practice: a letter to a friend', 'Praktyka: list do przyjaciółki', 'Práctica: carta a una amiga', 'Pratique : lettre à une amie', 'Pratik: arkadaşa mektup', 'Practică: scrisoare către o prietenă', "Mashq: dugonaga xat", 'अभ्यास: सहेली को पत्र', 'تدريب: رسالة إلى صديقة'), points: [daraufPoint, daraufDassPoint] },
	'question-bridge-nine': { title: T('Повторение: вопросы с предлогами', 'Повторення: питання з прийменниками', 'Review: questions with prepositions', 'Powtórka: pytania z przyimkami', 'Repaso: preguntas con preposición', 'Révision : questions avec préposition', 'Tekrar: edatlı sorular', 'Recapitulare: întrebări cu prepoziții', "Takrorlash: ko'makchili savollar", 'दोहराव: संबंधसूचक वाले सवाल', 'مراجعة: الأسئلة مع حروف الجر'), points: [verbPrepPoint, wenPoint, daraufPoint] },
	'question-bridge-ten': { title: finalTitle, points: [wenPoint, daraufPoint] }
}

module.exports = quests
