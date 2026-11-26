// Грамматика к заданиям земли nobody-village (jemand, nichts, man, einer, meiner)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const jemandPoint = pt(['jemand и niemand', 'jemand і niemand', 'jemand and niemand', 'jemand i niemand', 'jemand y niemand', 'jemand et niemand', 'jemand ve niemand', 'jemand și niemand', 'jemand va niemand', 'jemand और niemand', 'jemand وniemand'], [
	'jemand (кто-то), niemand (никто). Глагол как с er. Отрицание уже внутри слова, второе nicht не нужно: Niemand kommt.',
	'jemand (хтось), niemand (ніхто). Дієслово як з er. Заперечення вже всередині слова, друге nicht не потрібне: Niemand kommt.',
	'jemand (someone), niemand (no one). The verb is like with er. The negation is already inside the word, no extra nicht: Niemand kommt.',
	'jemand (ktoś), niemand (nikt). Czasownik jak przy er. Przeczenie jest już w słowie, drugie nicht niepotrzebne: Niemand kommt.',
	'jemand (alguien), niemand (nadie). El verbo como con er. La negación ya está en la palabra, sin otro nicht: Niemand kommt.',
	'jemand (quelqu’un), niemand (personne). Le verbe comme avec er. La négation est déjà dans le mot, pas de nicht en plus : Niemand kommt.',
	'jemand (biri), niemand (hiç kimse). Fiil er’deki gibi. Olumsuzluk kelimenin içinde, ayrıca nicht gerekmez: Niemand kommt.',
	'jemand (cineva), niemand (nimeni). Verbul ca la er. Negația e deja în cuvânt, fără alt nicht: Niemand kommt.',
	"jemand (kimdir), niemand (hech kim). Fe'l er dagi kabi. Inkor so'zning ichida, yana nicht kerak emas: Niemand kommt.",
	'jemand (कोई), niemand (कोई नहीं)। क्रिया er जैसी। नकार शब्द के अंदर ही है, अलग nicht नहीं: Niemand kommt।',
	'jemand (أحد)، niemand (لا أحد). والفعل كما مع er. والنفي داخل الكلمة، فلا نضيف nicht: Niemand kommt.'
], [
	ex('Jemand klopft an die Tür.', t11('Кто-то стучит в дверь.', 'Хтось стукає у двері.', 'Someone is knocking at the door.', 'Ktoś puka do drzwi.', 'Alguien llama a la puerta.', 'Quelqu’un frappe à la porte.', 'Biri kapıyı çalıyor.', 'Cineva bate la ușă.', 'Kimdir eshikni taqillatyapti.', 'कोई दरवाज़ा खटखटा रहा है।', 'أحدهم يطرق الباب.')),
	ex('Niemand weiß die Antwort.', t11('Никто не знает ответа.', 'Ніхто не знає відповіді.', 'No one knows the answer.', 'Nikt nie zna odpowiedzi.', 'Nadie sabe la respuesta.', 'Personne ne connaît la réponse.', 'Kimse cevabı bilmiyor.', 'Nimeni nu știe răspunsul.', 'Hech kim javobni bilmaydi.', 'किसी को जवाब नहीं पता।', 'لا أحد يعرف الجواب.'))
])

const etwasPoint = pt(['etwas и nichts', 'etwas і nichts', 'etwas and nichts', 'etwas i nichts', 'etwas y nichts', 'etwas et nichts', 'etwas ve nichts', 'etwas și nichts', 'etwas va nichts', 'etwas और nichts', 'etwas وnichts'], [
	'etwas (что-то), nichts (ничего). nichts уже отрицание: Ich sehe nichts, без второго nicht.',
	'etwas (щось), nichts (нічого). nichts уже заперечення: Ich sehe nichts, без другого nicht.',
	'etwas (something), nichts (nothing). nichts is already negative: Ich sehe nichts, no extra nicht.',
	'etwas (coś), nichts (nic). nichts to już przeczenie: Ich sehe nichts, bez drugiego nicht.',
	'etwas (algo), nichts (nada). nichts ya es negación: Ich sehe nichts, sin otro nicht.',
	'etwas (quelque chose), nichts (rien). nichts est déjà négatif : Ich sehe nichts, sans nicht.',
	'etwas (bir şey), nichts (hiçbir şey). nichts zaten olumsuz: Ich sehe nichts, ayrıca nicht yok.',
	'etwas (ceva), nichts (nimic). nichts e deja negație: Ich sehe nichts, fără alt nicht.',
	"etwas (nimadir), nichts (hech narsa). nichts o'zi inkor: Ich sehe nichts, yana nicht yo'q.",
	'etwas (कुछ), nichts (कुछ नहीं)। nichts पहले से नकार है: Ich sehe nichts, अलग nicht नहीं।',
	'etwas (شيء ما)، nichts (لا شيء). وnichts نفي بنفسها: Ich sehe nichts بدون nicht.'
], [ex('Wir haben nichts gekauft.', t11('Мы ничего не купили.', 'Ми нічого не купили.', 'We didn’t buy anything.', 'Nic nie kupiliśmy.', 'No compramos nada.', 'Nous n’avons rien acheté.', 'Hiçbir şey almadık.', 'N-am cumpărat nimic.', 'Biz hech narsa sotib olmadik.', 'हमने कुछ नहीं खरीदा।', 'لم نشترِ شيئاً.'))])

const allesPoint = pt(['alles и alle', 'alles і alle', 'alles and alle', 'alles i alle', 'alles y alle', 'alles et alle', 'alles ve alle', 'alles și alle', 'alles va alle', 'alles और alle', 'alles وalle'], [
	'alles значит «всё» (вещи), alle значит «все» (люди или много предметов). viel (много), wenig (мало).',
	'alles означає «усе» (речі), alle означає «усі» (люди або багато предметів). viel (багато), wenig (мало).',
	'alles means "everything", alle means "everyone, all" (people or many things). viel (a lot), wenig (little).',
	'alles znaczy „wszystko”, alle znaczy „wszyscy” (ludzie albo wiele rzeczy). viel (dużo), wenig (mało).',
	'alles significa "todo", alle significa "todos" (personas o muchas cosas). viel (mucho), wenig (poco).',
	'alles veut dire « tout », alle « tous » (des gens ou beaucoup de choses). viel (beaucoup), wenig (peu).',
	'alles "her şey", alle "herkes, hepsi" (insanlar ya da çok şey) demektir. viel (çok), wenig (az).',
	'alles înseamnă „totul”, alle înseamnă „toți” (oameni sau multe lucruri). viel (mult), wenig (puțin).',
	"alles \"hamma narsa\", alle \"hamma, barcha\" (odamlar yoki ko'p narsa) degani. viel (ko'p), wenig (kam).",
	'alles मतलब "सब कुछ", alle मतलब "सभी" (लोग या कई चीज़ें)। viel (बहुत), wenig (कम)।',
	'alles تعني "كل شيء"، وalle تعني "الجميع" (أشخاص أو أشياء كثيرة). وviel (كثير)، وwenig (قليل).'
], [
	ex('Ich habe alles verstanden.', t11('Я всё понял.', 'Я все зрозумів.', 'I understood everything.', 'Wszystko zrozumiałem.', 'Lo entendí todo.', 'J’ai tout compris.', 'Her şeyi anladım.', 'Am înțeles tot.', 'Hammasini tushundim.', 'मैंने सब समझ लिया।', 'فهمت كل شيء.')),
	ex('Alle sind schon da.', t11('Все уже здесь.', 'Усі вже тут.', 'Everyone is already here.', 'Wszyscy już są.', 'Ya están todos.', 'Tout le monde est déjà là.', 'Herkes zaten burada.', 'Toți sunt deja aici.', 'Hamma allaqachon shu yerda.', 'सब पहले से यहाँ हैं।', 'الجميع هنا بالفعل.'))
])

const manPoint = pt(['man: люди вообще', 'man: люди загалом', 'man: people in general', 'man: ludzie w ogóle', 'man: la gente en general', 'man : on', 'man: genel olarak insanlar', 'man: oamenii în general', "man: umuman odamlar", 'man: आम तौर पर लोग', 'man: الناس عموماً'], [
	'man значит «люди вообще», когда неважно, кто именно. Глагол как с er: man sagt, man kann. По-русски часто без подлежащего: «здесь нельзя курить».',
	'man означає «люди загалом», коли неважливо, хто саме. Дієслово як з er: man sagt, man kann. Українською часто без підмета: «тут не можна курити».',
	'man means "people in general", when it doesn’t matter who. The verb is like with er: man sagt, man kann. English often uses "you" or the passive.',
	'man znaczy „ludzie w ogóle”, gdy nieważne kto. Czasownik jak przy er: man sagt, man kann. Po polsku często bez podmiotu: „tu nie wolno palić”.',
	'man significa "la gente en general", cuando no importa quién. El verbo como con er: man sagt, man kann. En español suele ser "se": "aquí no se fuma".',
	'man, c’est comme « on » en français : man sagt, man kann. Le verbe se conjugue comme avec er.',
	'man "genel olarak insanlar" demektir, kim olduğu önemli değilse. Fiil er’deki gibi: man sagt, man kann.',
	'man înseamnă „oamenii în general”, când nu contează cine. Verbul ca la er: man sagt, man kann. În română de obicei cu „se”: „aici nu se fumează”.',
	"man \"umuman odamlar\" degani, kim ekani muhim bo'lmasa. Fe'l er dagi kabi: man sagt, man kann.",
	'man मतलब "आम तौर पर लोग", जब यह मायने नहीं रखता कि कौन। क्रिया er जैसी: man sagt, man kann।',
	'man تعني "الناس عموماً" حين لا يهم من بالتحديد. والفعل كما مع er: man sagt، man kann.'
], [ex('Hier darf man nicht rauchen.', t11('Здесь нельзя курить.', 'Тут не можна курити.', 'You can’t smoke here.', 'Tu nie wolno palić.', 'Aquí no se puede fumar.', 'Ici, on n’a pas le droit de fumer.', 'Burada sigara içilmez.', 'Aici nu se fumează.', 'Bu yerda chekish mumkin emas.', 'यहाँ धूम्रपान मना है।', 'ممنوع التدخين هنا.'))])

const einerPoint = pt(['einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer, eine, eins', 'einer وeine وeins'], [
	'Вместо существительного: einer (der), eine (die), eins (das), мн. ч. welche. В Akkusativ мужской род einen. Нет: keiner, keine, keins.',
	'Замість іменника: einer (der), eine (die), eins (das), мн. welche. В Akkusativ чоловічий рід einen. Немає: keiner, keine, keins.',
	'Instead of a noun: einer (der), eine (die), eins (das), plural welche. Accusative masculine einen. None: keiner, keine, keins.',
	'Zamiast rzeczownika: einer (der), eine (die), eins (das), l. mn. welche. W Akkusativ rodzaj męski einen. Brak: keiner, keine, keins.',
	'En lugar del sustantivo: einer (der), eine (die), eins (das), plural welche. Acusativo masculino einen. Ninguno: keiner, keine, keins.',
	'À la place du nom : einer (der), eine (die), eins (das), pluriel welche. Accusatif masculin einen. Aucun : keiner, keine, keins.',
	'İsim yerine: einer (der), eine (die), eins (das), çoğul welche. Akkusativ’de eril einen. Hiç: keiner, keine, keins.',
	'În locul substantivului: einer (der), eine (die), eins (das), plural welche. Acuzativ masculin einen. Niciunul: keiner, keine, keins.',
	"Ot o'rniga: einer (der), eine (die), eins (das), ko'plik welche. Akkusativda erkak rodi einen. Yo'q: keiner, keine, keins.",
	'संज्ञा की जगह: einer (der), eine (die), eins (das), बहुवचन welche। Akkusativ में पुल्लिंग einen। कोई नहीं: keiner, keine, keins।',
	'بدل الاسم: einer (der)، eine (die)، eins (das)، والجمع welche. وفي المفعول المذكر einen. والنفي: keiner، keine، keins.'
], [
	ex('Hast du einen Stift? Ja, ich habe einen.', t11('У тебя есть ручка? Да, есть.', 'У тебе є ручка? Так, є.', 'Do you have a pen? Yes, I have one.', 'Masz długopis? Tak, mam.', '¿Tienes un bolígrafo? Sí, tengo uno.', 'Tu as un stylo ? Oui, j’en ai un.', 'Kalemin var mı? Evet, var.', 'Ai un pix? Da, am unul.', 'Ruchkang bormi? Ha, bor.', 'क्या तुम्हारे पास पेन है? हाँ, है।', 'هل عندك قلم؟ نعم، عندي واحد.')),
	ex('Ich habe keins dabei.', t11('У меня с собой нет.', 'У мене із собою немає.', 'I don’t have one with me.', 'Nie mam przy sobie.', 'No llevo ninguno.', 'Je n’en ai pas sur moi.', 'Yanımda yok.', 'Nu am la mine.', "Yonimda yo'q.", 'मेरे पास अभी नहीं है।', 'ليس معي واحد.'))
])

const meinerPoint = pt(['meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner, meine, meins', 'meiner وmeine وmeins'], [
	'Чей? Ответ без существительного: meiner (der), meine (die), meins (das). Так же deiner, seiner, ihrer.',
	'Чий? Відповідь без іменника: meiner (der), meine (die), meins (das). Так само deiner, seiner, ihrer.',
	'Whose? An answer without the noun: meiner (der), meine (die), meins (das). Same with deiner, seiner, ihrer.',
	'Czyj? Odpowiedź bez rzeczownika: meiner (der), meine (die), meins (das). Tak samo deiner, seiner, ihrer.',
	'¿De quién? Respuesta sin sustantivo: meiner (der), meine (die), meins (das). Igual deiner, seiner, ihrer.',
	'À qui ? Réponse sans le nom : meiner (der), meine (die), meins (das). Pareil pour deiner, seiner, ihrer.',
	'Kimin? İsimsiz cevap: meiner (der), meine (die), meins (das). deiner, seiner, ihrer de böyle.',
	'Al cui? Răspuns fără substantiv: meiner (der), meine (die), meins (das). La fel deiner, seiner, ihrer.',
	"Kimniki? Otsiz javob: meiner (der), meine (die), meins (das). deiner, seiner, ihrer ham shunday.",
	'किसका? बिना संज्ञा के जवाब: meiner (der), meine (die), meins (das)। deiner, seiner, ihrer भी ऐसे ही।',
	'لمن؟ جواب بدون اسم: meiner (der)، meine (die)، meins (das). وكذلك deiner وseiner وihrer.'
], [ex('Ist das dein Schlüssel? Ja, das ist meiner.', t11('Это твой ключ? Да, мой.', 'Це твій ключ? Так, мій.', 'Is that your key? Yes, it’s mine.', 'Czy to twój klucz? Tak, mój.', '¿Es tu llave? Sí, es mía.', 'C’est ta clé ? Oui, c’est la mienne.', 'Bu senin anahtarın mı? Evet, benim.', 'E cheia ta? Da, e a mea.', 'Bu sening kalitingmi? Ha, meniki.', 'क्या यह तुम्हारी चाबी है? हाँ, मेरी है।', 'هل هذا مفتاحك؟ نعم، إنه لي.'))])

const quests = {
	'nobody-village-one': { title: t11('Кто-то и никто', 'Хтось і ніхто', 'Someone and no one', 'Ktoś i nikt', 'Alguien y nadie', 'Quelqu’un et personne', 'Biri ve hiç kimse', 'Cineva și nimeni', 'Kimdir va hech kim', 'कोई और कोई नहीं', 'أحد ولا أحد'), points: [jemandPoint] },
	'nobody-village-two': { title: t11('Что-то и ничего', 'Щось і нічого', 'Something and nothing', 'Coś i nic', 'Algo y nada', 'Quelque chose et rien', 'Bir şey ve hiçbir şey', 'Ceva și nimic', 'Nimadir va hech narsa', 'कुछ और कुछ नहीं', 'شيء ولا شيء'), points: [etwasPoint] },
	'nobody-village-three': { title: t11('Всё, много, мало', 'Усе, багато, мало', 'Everything, a lot, a little', 'Wszystko, dużo, mało', 'Todo, mucho, poco', 'Tout, beaucoup, peu', 'Her şey, çok, az', 'Tot, mult, puțin', "Hamma narsa, ko'p, kam", 'सब, बहुत, कम', 'كل شيء، كثير، قليل'), points: [allesPoint] },
	'nobody-village-four': { title: t11('Здесь так делают: man', 'Тут так роблять: man', 'That’s how it’s done: man', 'Tak się tu robi: man', 'Así se hace aquí: man', 'Ici, on fait comme ça : man', 'Burada böyle yapılır: man', 'Așa se face aici: man', 'Bu yerda shunday qilinadi: man', 'यहाँ ऐसे करते हैं: man', 'هكذا يفعلون هنا: man'), points: [manPoint] },
	'nobody-village-five': { title: t11('У меня есть один', 'У мене є один', 'I have one', 'Mam jeden', 'Tengo uno', 'J’en ai un', 'Bende bir tane var', 'Am unul', 'Menda bitta bor', 'मेरे पास एक है', 'عندي واحد'), points: [einerPoint] },
	'nobody-village-six': { title: t11('Это мой!', 'Це мій!', 'It’s mine!', 'To mój!', '¡Es mío!', 'C’est le mien !', 'Bu benim!', 'E al meu!', 'Bu meniki!', 'यह मेरा है!', 'إنه لي!'), points: [meinerPoint] },
	'nobody-village-seven': { title: t11('Практика: бюро находок', 'Практика: бюро знахідок', 'Practice: lost and found', 'Praktyka: biuro rzeczy znalezionych', 'Práctica: objetos perdidos', 'Pratique : objets trouvés', 'Pratik: kayıp eşya bürosu', 'Practică: obiecte pierdute', 'Mashq: topilmalar byurosi', 'अभ्यास: खोया-पाया दफ़्तर', 'تدريب: مكتب المفقودات'), points: [einerPoint, meinerPoint] },
	'nobody-village-eight': { title: t11('Практика: вечеринка у соседей', 'Практика: вечірка в сусідів', 'Practice: a party at the neighbours’', 'Praktyka: impreza u sąsiadów', 'Práctica: fiesta en casa de los vecinos', 'Pratique : fête chez les voisins', 'Pratik: komşularda parti', 'Practică: petrecere la vecini', "Mashq: qo'shnilardagi bazm", 'अभ्यास: पड़ोसियों की पार्टी', 'تدريب: حفلة عند الجيران'), points: [jemandPoint, allesPoint, manPoint] },
	'nobody-village-nine': { title: t11('Повторение: кто-то, ничего, мой', 'Повторення: хтось, нічого, мій', 'Review: someone, nothing, mine', 'Powtórka: ktoś, nic, mój', 'Repaso: alguien, nada, mío', 'Révision : quelqu’un, rien, le mien', 'Tekrar: biri, hiçbir şey, benimki', 'Recapitulare: cineva, nimic, al meu', 'Takrorlash: kimdir, hech narsa, meniki', 'दोहराव: कोई, कुछ नहीं, मेरा', 'مراجعة: أحد، لا شيء، لي'), points: [jemandPoint, etwasPoint, einerPoint] },
	'nobody-village-ten': { title: finalTitle, points: [jemandPoint, allesPoint, meinerPoint] }
}

module.exports = quests
