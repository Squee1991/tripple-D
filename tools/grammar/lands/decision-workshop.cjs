// Грамматика к заданиям земли decision-workshop (устойчивые сочетания)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const entscheidungPoint = pt(['eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen', 'eine Entscheidung treffen'], [
	'«Принять решение» по-немецки eine Entscheidung treffen, глагол treffen: traf, hat getroffen.',
	'«Ухвалити рішення» німецькою eine Entscheidung treffen, дієслово treffen: traf, hat getroffen.',
	'"Make a decision" in German is eine Entscheidung treffen, with the verb treffen: traf, hat getroffen.',
	'„Podjąć decyzję” po niemiecku to eine Entscheidung treffen, czasownik treffen: traf, hat getroffen.',
	'"Tomar una decisión" en alemán es eine Entscheidung treffen, con treffen: traf, hat getroffen.',
	'« Prendre une décision » se dit eine Entscheidung treffen, avec treffen : traf, hat getroffen.',
	'"Karar vermek" Almancada eine Entscheidung treffen, fiil treffen: traf, hat getroffen.',
	'„A lua o decizie” în germană e eine Entscheidung treffen, cu treffen: traf, hat getroffen.',
	"\"Qaror qabul qilish\" nemischa eine Entscheidung treffen, fe'l treffen: traf, hat getroffen.",
	'"फ़ैसला लेना" जर्मन में eine Entscheidung treffen, क्रिया treffen: traf, hat getroffen।',
	'"اتخاذ قرار" بالألمانية eine Entscheidung treffen، والفعل treffen: traf، hat getroffen.'
], [ex('Ich habe endlich eine Entscheidung getroffen.', t11('Я наконец принял решение.', 'Я нарешті ухвалив рішення.', 'I’ve finally made a decision.', 'W końcu podjąłem decyzję.', 'Por fin he tomado una decisión.', 'J’ai enfin pris une décision.', 'Sonunda bir karar verdim.', 'În sfârșit am luat o decizie.', 'Nihoyat qaror qabul qildim.', 'आख़िरकार मैंने फ़ैसला ले लिया।', 'اتخذت قراراً أخيراً.'))])

const frageStellenPoint = pt(['eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen, eine Antwort geben', 'eine Frage stellen وeine Antwort geben'], [
	'Вопрос «ставят»: eine Frage stellen. Кому, в Dativ: Ich stelle dir eine Frage. Ответ «дают»: eine Antwort geben.',
	'Питання «ставлять»: eine Frage stellen. Кому, в Dativ: Ich stelle dir eine Frage. Відповідь «дають»: eine Antwort geben.',
	'You "put" a question: eine Frage stellen. To whom, in the dative: Ich stelle dir eine Frage. You "give" an answer: eine Antwort geben.',
	'Pytanie się „stawia”: eine Frage stellen. Komu, w Dativ: Ich stelle dir eine Frage. Odpowiedź się „daje”: eine Antwort geben.',
	'La pregunta se "pone": eine Frage stellen. A quién, en dativo: Ich stelle dir eine Frage. La respuesta se "da": eine Antwort geben.',
	'On « pose » une question : eine Frage stellen. À qui, au datif : Ich stelle dir eine Frage. On « donne » une réponse : eine Antwort geben.',
	'Soru "konur": eine Frage stellen. Kime, Dativ’de: Ich stelle dir eine Frage. Cevap "verilir": eine Antwort geben.',
	'Întrebarea se „pune”: eine Frage stellen. Cui, la dativ: Ich stelle dir eine Frage. Răspunsul se „dă”: eine Antwort geben.',
	"Savol \"qo'yiladi\": eine Frage stellen. Kimga, Dativda: Ich stelle dir eine Frage. Javob \"beriladi\": eine Antwort geben.",
	'सवाल "रखा" जाता है: eine Frage stellen। किसे, Dativ में: Ich stelle dir eine Frage। जवाब "दिया" जाता है: eine Antwort geben।',
	'السؤال "يُطرح": eine Frage stellen. ولمن بحالة الجر: Ich stelle dir eine Frage. والجواب "يُعطى": eine Antwort geben.'
], [ex('Darf ich Ihnen eine Frage stellen?', t11('Можно задать вам вопрос?', 'Можна поставити вам запитання?', 'May I ask you a question?', 'Czy mogę zadać panu pytanie?', '¿Puedo hacerle una pregunta?', 'Puis-je vous poser une question ?', 'Size bir soru sorabilir miyim?', 'Vă pot pune o întrebare?', "Sizga savol bersam bo'ladimi?", 'क्या मैं आपसे एक सवाल पूछ सकता हूँ?', 'هل يمكنني أن أطرح عليك سؤالاً؟'))])

const bescheidPoint = pt(['Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen, Bescheid wissen', 'Bescheid sagen وBescheid wissen'], [
	'Bescheid sagen/geben значит «дать знать», Bescheid wissen значит «быть в курсе». Bescheid всегда без артикля.',
	'Bescheid sagen/geben означає «дати знати», Bescheid wissen означає «бути в курсі». Bescheid завжди без артикля.',
	'Bescheid sagen/geben means "let someone know", Bescheid wissen means "to know about it". Bescheid never takes an article.',
	'Bescheid sagen/geben znaczy „dać znać”, Bescheid wissen „wiedzieć, być na bieżąco”. Bescheid zawsze bez rodzajnika.',
	'Bescheid sagen/geben significa "avisar", Bescheid wissen "estar al tanto". Bescheid nunca lleva artículo.',
	'Bescheid sagen/geben veut dire « prévenir », Bescheid wissen « être au courant ». Bescheid n’a jamais d’article.',
	'Bescheid sagen/geben "haber vermek", Bescheid wissen "haberdar olmak" demektir. Bescheid hiç artikel almaz.',
	'Bescheid sagen/geben înseamnă „a anunța”, Bescheid wissen „a fi la curent”. Bescheid nu are niciodată articol.',
	"Bescheid sagen/geben \"xabar berish\", Bescheid wissen \"xabardor bo'lish\" degani. Bescheid doim artiklsiz.",
	'Bescheid sagen/geben मतलब "बता देना", Bescheid wissen मतलब "जानकारी होना"। Bescheid के साथ कभी आर्टिकल नहीं।',
	'Bescheid sagen/geben تعني "يُعلِم"، وBescheid wissen تعني "يكون على علم". وBescheid دائماً بدون أداة.'
], [ex('Sag mir Bescheid, wenn du ankommst.', t11('Дай мне знать, когда приедешь.', 'Дай мені знати, коли приїдеш.', 'Let me know when you arrive.', 'Daj mi znać, kiedy dojedziesz.', 'Avísame cuando llegues.', 'Préviens-moi quand tu arrives.', 'Vardığında bana haber ver.', 'Anunță-mă când ajungi.', 'Yetib kelganingda menga xabar ber.', 'जब पहुँचो तो मुझे बता देना।', 'أعلمني عندما تصل.'))])

const nehmenPoint = pt(['Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen, Rücksicht nehmen', 'Platz nehmen وRücksicht nehmen'], [
	'Platz nehmen значит «садиться» (вежливо, без артикля). Rücksicht nehmen auf + Akkusativ значит «считаться с кем-то».',
	'Platz nehmen означає «сідати» (ввічливо, без артикля). Rücksicht nehmen auf + Akkusativ означає «зважати на когось».',
	'Platz nehmen means "take a seat" (polite, no article). Rücksicht nehmen auf + accusative means "be considerate of".',
	'Platz nehmen znaczy „usiąść” (grzecznie, bez rodzajnika). Rücksicht nehmen auf + Akkusativ znaczy „liczyć się z kimś”.',
	'Platz nehmen significa "tomar asiento" (cortés, sin artículo). Rücksicht nehmen auf + acusativo significa "tener consideración con".',
	'Platz nehmen veut dire « s’asseoir » (poli, sans article). Rücksicht nehmen auf + accusatif veut dire « tenir compte de ».',
	'Platz nehmen "oturmak" (kibar, artikelsiz). Rücksicht nehmen auf + Akkusativ "birini düşünmek, saygı göstermek".',
	'Platz nehmen înseamnă „a lua loc” (politicos, fără articol). Rücksicht nehmen auf + acuzativ înseamnă „a ține cont de cineva”.',
	"Platz nehmen \"o'tirmoq\" (muloyim, artiklsiz). Rücksicht nehmen auf + Akkusativ \"birovni hisobga olish\".",
	'Platz nehmen मतलब "बैठना" (विनम्र, बिना आर्टिकल)। Rücksicht nehmen auf + Akkusativ मतलब "किसी का ख़्याल रखना"।',
	'Platz nehmen تعني "يجلس" (بأدب، بدون أداة). وRücksicht nehmen auf + المفعول تعني "يراعي الآخرين".'
], [ex('Nehmen Sie bitte Platz.', t11('Садитесь, пожалуйста.', 'Сідайте, будь ласка.', 'Please take a seat.', 'Proszę usiąść.', 'Tome asiento, por favor.', 'Asseyez-vous, je vous prie.', 'Lütfen oturun.', 'Luați loc, vă rog.', "Marhamat, o'tiring.", 'कृपया बैठिए।', 'تفضل بالجلوس.'))])

const vorschlagPoint = pt(['einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen, ein Gespräch führen', 'einen Vorschlag machen وein Gespräch führen'], [
	'Предложить: einen Vorschlag machen (часто с zu + инфинитив). Серьёзно поговорить: ein Gespräch führen.',
	'Запропонувати: einen Vorschlag machen (часто з zu + інфінітив). Серйозно поговорити: ein Gespräch führen.',
	'To suggest: einen Vorschlag machen (often with zu + infinitive). To have a serious talk: ein Gespräch führen.',
	'Zaproponować: einen Vorschlag machen (często z zu + bezokolicznik). Poważnie porozmawiać: ein Gespräch führen.',
	'Proponer: einen Vorschlag machen (a menudo con zu + infinitivo). Tener una conversación seria: ein Gespräch führen.',
	'Proposer : einen Vorschlag machen (souvent avec zu + infinitif). Avoir une vraie discussion : ein Gespräch führen.',
	'Öneri yapmak: einen Vorschlag machen (çoğu zaman zu + mastar ile). Ciddi konuşma yapmak: ein Gespräch führen.',
	'A propune: einen Vorschlag machen (des cu zu + infinitiv). A purta o discuție serioasă: ein Gespräch führen.',
	"Taklif qilish: einen Vorschlag machen (ko'pincha zu + infinitiv bilan). Jiddiy suhbat: ein Gespräch führen.",
	'सुझाव देना: einen Vorschlag machen (अक्सर zu + इन्फ़िनिटिव के साथ)। गंभीर बातचीत: ein Gespräch führen।',
	'تقديم اقتراح: einen Vorschlag machen (غالباً مع zu + المصدر). وإجراء حديث جاد: ein Gespräch führen.'
], [ex('Darf ich einen Vorschlag machen?', t11('Можно мне кое-что предложить?', 'Можна мені дещо запропонувати?', 'May I make a suggestion?', 'Czy mogę coś zaproponować?', '¿Puedo hacer una propuesta?', 'Je peux faire une proposition ?', 'Bir öneride bulunabilir miyim?', 'Pot să fac o propunere?', "Taklif bersam bo'ladimi?", 'क्या मैं एक सुझाव दे सकता हूँ?', 'هل يمكنني تقديم اقتراح؟'))])

const T = (...v) => t11(...v)
const quests = {
	'decision-workshop-one': { title: T('Решение принято', 'Рішення ухвалено', 'Decision made', 'Decyzja podjęta', 'Decisión tomada', 'Décision prise', 'Karar verildi', 'Decizie luată', 'Qaror qabul qilindi', 'फ़ैसला हो गया', 'اتُّخذ القرار'), points: [entscheidungPoint] },
	'decision-workshop-two': { title: T('Вопрос и ответ', 'Питання і відповідь', 'Question and answer', 'Pytanie i odpowiedź', 'Pregunta y respuesta', 'Question et réponse', 'Soru ve cevap', 'Întrebare și răspuns', 'Savol va javob', 'सवाल और जवाब', 'السؤال والجواب'), points: [frageStellenPoint] },
	'decision-workshop-three': { title: T('Дай знать!', 'Дай знати!', 'Let me know!', 'Daj znać!', '¡Avísame!', 'Préviens-moi !', 'Haber ver!', 'Anunță-mă!', 'Xabar ber!', 'बता देना!', 'أعلمني!'), points: [bescheidPoint] },
	'decision-workshop-four': { title: T('Думай о других', 'Думай про інших', 'Think of others', 'Myśl o innych', 'Piensa en los demás', 'Pense aux autres', 'Başkalarını düşün', 'Gândește-te la alții', "Boshqalarni o'yla", 'दूसरों का ख़्याल रखो', 'فكّر في الآخرين'), points: [nehmenPoint] },
	'decision-workshop-five': { title: T('Предложение и разговор', 'Пропозиція і розмова', 'Suggestion and conversation', 'Propozycja i rozmowa', 'Propuesta y conversación', 'Proposition et discussion', 'Öneri ve konuşma', 'Propunere și discuție', 'Taklif va suhbat', 'सुझाव और बातचीत', 'الاقتراح والحديث'), points: [vorschlagPoint] },
	'decision-workshop-six': { title: T('Совещание в команде', 'Нарада в команді', 'Team meeting', 'Spotkanie zespołu', 'Reunión de equipo', 'Réunion d’équipe', 'Ekip toplantısı', 'Ședința echipei', 'Jamoa yig‘ilishi', 'टीम मीटिंग', 'اجتماع الفريق'), points: [entscheidungPoint, vorschlagPoint] },
	'decision-workshop-seven': { title: T('Практика: родительское собрание', 'Практика: батьківські збори', 'Practice: a parents’ meeting', 'Praktyka: zebranie rodziców', 'Práctica: reunión de padres', 'Pratique : réunion de parents', 'Pratik: veli toplantısı', 'Practică: ședința cu părinții', "Mashq: ota-onalar yig'ilishi", 'अभ्यास: अभिभावक बैठक', 'تدريب: اجتماع أولياء الأمور'), points: [frageStellenPoint, bescheidPoint] },
	'decision-workshop-eight': { title: T('Практика: в гостях', 'Практика: у гостях', 'Practice: visiting', 'Praktyka: w gościach', 'Práctica: de visita', 'Pratique : en visite', 'Pratik: misafirlikte', 'Practică: în vizită', 'Mashq: mehmonda', 'अभ्यास: मेहमान बनकर', 'تدريب: في زيارة'), points: [nehmenPoint, vorschlagPoint] },
	'decision-workshop-nine': { title: T('Повторение: устойчивые сочетания', 'Повторення: сталі сполучення', 'Review: fixed expressions', 'Powtórka: stałe wyrażenia', 'Repaso: expresiones fijas', 'Révision : expressions figées', 'Tekrar: kalıp ifadeler', 'Recapitulare: expresii fixe', "Takrorlash: turg'un birikmalar", 'दोहराव: तय वाक्यांश', 'مراجعة: التعابير الثابتة'), points: [entscheidungPoint, frageStellenPoint, bescheidPoint] },
	'decision-workshop-ten': { title: finalTitle, points: [entscheidungPoint, nehmenPoint, vorschlagPoint] }
}

module.exports = quests
