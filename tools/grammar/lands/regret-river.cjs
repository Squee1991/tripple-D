// Грамматика к заданиям земли regret-river (Konjunktiv II в прошлом)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const pastPoint = pt(['hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II', 'hätte/wäre + Partizip II'], [
	'Я бы сделал, но не сделал: hätte + Partizip II в конце. С движением и sein, как в Perfekt: wäre + Partizip II.',
	'Я б зробив, але не зробив: hätte + Partizip II у кінці. З рухом і sein, як у Perfekt: wäre + Partizip II.',
	'I would have done it, but didn’t: hätte + Partizip II at the end. With movement and sein, as in Perfekt: wäre + Partizip II.',
	'Zrobiłbym, ale nie zrobiłem: hätte + Partizip II na końcu. Z ruchem i sein, jak w Perfekt: wäre + Partizip II.',
	'Lo habría hecho, pero no: hätte + Partizip II al final. Con movimiento y sein, como en Perfekt: wäre + Partizip II.',
	'Je l’aurais fait, mais non : hätte + Partizip II à la fin. Avec le mouvement et sein, comme au Perfekt : wäre + Partizip II.',
	'Yapardım ama yapmadım: hätte + Partizip II sonda. Hareket ve sein ile, Perfekt’teki gibi: wäre + Partizip II.',
	'Aș fi făcut, dar n-am făcut: hätte + Partizip II la final. Cu mișcare și sein, ca la Perfekt: wäre + Partizip II.',
	"Qilardim, lekin qilmadim: hätte + Partizip II oxirida. Harakat va sein bilan, Perfekt dagidek: wäre + Partizip II.",
	'मैं करता, पर नहीं किया: hätte + Partizip II अंत में। गति और sein के साथ, Perfekt की तरह: wäre + Partizip II।',
	'كنت سأفعل لكنني لم أفعل: hätte + Partizip II في الآخر. ومع الحركة وsein كما في Perfekt: wäre + Partizip II.'
], [
	ex('Ich hätte dich angerufen.', t11('Я бы тебе позвонил.', 'Я б тобі зателефонував.', 'I would have called you.', 'Zadzwoniłbym do ciebie.', 'Te habría llamado.', 'Je t’aurais appelé.', 'Seni arardım.', 'Te-aș fi sunat.', "Senga qo'ng'iroq qilgan bo'lardim.", 'मैं तुम्हें फ़ोन कर देता।', 'كنت سأتصل بك.')),
	ex('Ich wäre gekommen.', t11('Я бы пришёл.', 'Я б прийшов.', 'I would have come.', 'Przyszedłbym.', 'Habría venido.', 'Je serais venu.', 'Gelirdim.', 'Aș fi venit.', "Kelgan bo'lardim.", 'मैं आ जाता।', 'كنت سآتي.'))
])

const fullPoint = pt(['Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...', 'Wenn ich das gewusst hätte, ...'], [
	'В части с wenn hätte/wäre в самом конце. Во второй части hätte/wäre сразу, Partizip II в конце.',
	'У частині з wenn hätte/wäre в самому кінці. У другій частині hätte/wäre одразу, Partizip II у кінці.',
	'In the wenn part hätte/wäre goes at the very end. In the other part hätte/wäre comes first, Partizip II at the end.',
	'W części z wenn hätte/wäre na samym końcu. W drugiej części hätte/wäre od razu, Partizip II na końcu.',
	'En la parte con wenn, hätte/wäre al final. En la otra, hätte/wäre primero y Partizip II al final.',
	'Dans la partie avec wenn, hätte/wäre tout à la fin. Dans l’autre, hätte/wäre d’abord, Partizip II à la fin.',
	'wenn kısmında hätte/wäre en sonda. Diğer kısımda hätte/wäre başta, Partizip II sonda.',
	'În partea cu wenn, hätte/wäre la final. În cealaltă, hätte/wäre imediat, Partizip II la final.',
	"wenn qismida hätte/wäre eng oxirida. Ikkinchi qismda hätte/wäre darhol, Partizip II oxirida.",
	'wenn वाले हिस्से में hätte/wäre बिल्कुल अंत में। दूसरे हिस्से में hätte/wäre तुरंत, Partizip II अंत में।',
	'في جزء wenn تأتي hätte/wäre في الآخر تماماً. وفي الجزء الآخر hätte/wäre أولاً وPartizip II في الآخر.'
], [ex('Wenn ich das gewusst hätte, wäre ich gekommen.', t11('Если бы я это знал, я бы пришёл.', 'Якби я це знав, я б прийшов.', 'If I had known that, I would have come.', 'Gdybym to wiedział, przyszedłbym.', 'Si lo hubiera sabido, habría venido.', 'Si j’avais su, je serais venu.', 'Bunu bilseydim gelirdim.', 'Dacă aș fi știut, aș fi venit.', "Buni bilganimda kelgan bo'lardim.", 'अगर मुझे यह पता होता, तो मैं आ जाता।', 'لو كنت أعرف ذلك لجئت.'))])

const nowThenPoint = pt(['Сейчас или тогда', 'Зараз чи тоді', 'Now or then', 'Teraz czy wtedy', 'Ahora o entonces', 'Maintenant ou autrefois', 'Şimdi mi, o zaman mı', 'Acum sau atunci', 'Hozir yoki o‘shanda', 'अभी या तब', 'الآن أم آنذاك'], [
	'Сейчас: Wenn ich Zeit hätte, würde ich kommen. Тогда: Wenn ich Zeit gehabt hätte, wäre ich gekommen. В прошлом würde не нужен.',
	'Зараз: Wenn ich Zeit hätte, würde ich kommen. Тоді: Wenn ich Zeit gehabt hätte, wäre ich gekommen. У минулому würde не потрібен.',
	'Now: Wenn ich Zeit hätte, würde ich kommen. Then: Wenn ich Zeit gehabt hätte, wäre ich gekommen. No würde for the past.',
	'Teraz: Wenn ich Zeit hätte, würde ich kommen. Wtedy: Wenn ich Zeit gehabt hätte, wäre ich gekommen. W przeszłości bez würde.',
	'Ahora: Wenn ich Zeit hätte, würde ich kommen. Entonces: Wenn ich Zeit gehabt hätte, wäre ich gekommen. En pasado no va würde.',
	'Maintenant : Wenn ich Zeit hätte, würde ich kommen. Autrefois : Wenn ich Zeit gehabt hätte, wäre ich gekommen. Pas de würde au passé.',
	'Şimdi: Wenn ich Zeit hätte, würde ich kommen. O zaman: Wenn ich Zeit gehabt hätte, wäre ich gekommen. Geçmişte würde yok.',
	'Acum: Wenn ich Zeit hätte, würde ich kommen. Atunci: Wenn ich Zeit gehabt hätte, wäre ich gekommen. La trecut nu e würde.',
	"Hozir: Wenn ich Zeit hätte, würde ich kommen. O'shanda: Wenn ich Zeit gehabt hätte, wäre ich gekommen. O'tgan zamonda würde yo'q.",
	'अभी: Wenn ich Zeit hätte, würde ich kommen। तब: Wenn ich Zeit gehabt hätte, wäre ich gekommen। भूतकाल में würde नहीं।',
	'الآن: Wenn ich Zeit hätte, würde ich kommen. آنذاك: Wenn ich Zeit gehabt hätte, wäre ich gekommen. ولا würde في الماضي.'
], [ex('Wenn ich mehr geübt hätte, hätte ich die Prüfung bestanden.', t11('Если бы я больше тренировался, я бы сдал экзамен.', 'Якби я більше тренувався, я б склав іспит.', 'If I had practised more, I would have passed the exam.', 'Gdybym więcej ćwiczył, zdałbym egzamin.', 'Si hubiera practicado más, habría aprobado.', 'Si je m’étais plus entraîné, j’aurais réussi l’examen.', 'Daha çok çalışsaydım sınavı geçerdim.', 'Dacă aș fi exersat mai mult, aș fi trecut examenul.', "Ko'proq mashq qilganimda imtihondan o'tgan bo'lardim.", 'अगर मैंने ज़्यादा अभ्यास किया होता, तो परीक्षा पास कर लेता।', 'لو تدربت أكثر لنجحت في الامتحان.'))])

const wishPastPoint = pt(['Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...', 'Ich wünschte, ich hätte ...'], [
	'Жаль, что тогда не...: Ich wünschte + hätte/wäre + Partizip II в конце. Das wäre schön gewesen значит «было бы здорово».',
	'Шкода, що тоді не...: Ich wünschte + hätte/wäre + Partizip II у кінці. Das wäre schön gewesen означає «було б чудово».',
	'I wish I had...: Ich wünschte + hätte/wäre + Partizip II at the end. Das wäre schön gewesen means "that would have been nice".',
	'Szkoda, że wtedy nie...: Ich wünschte + hätte/wäre + Partizip II na końcu. Das wäre schön gewesen znaczy „byłoby fajnie”.',
	'Ojalá hubiera...: Ich wünschte + hätte/wäre + Partizip II al final. Das wäre schön gewesen significa "habría estado bien".',
	'J’aurais aimé... : Ich wünschte + hätte/wäre + Partizip II à la fin. Das wäre schön gewesen veut dire « ça aurait été bien ».',
	'Keşke o zaman...: Ich wünschte + hätte/wäre + Partizip II sonda. Das wäre schön gewesen "güzel olurdu" demektir.',
	'Păcat că atunci n-am...: Ich wünschte + hätte/wäre + Partizip II la final. Das wäre schön gewesen înseamnă „ar fi fost frumos”.',
	"Qaniydi o'shanda...: Ich wünschte + hätte/wäre + Partizip II oxirida. Das wäre schön gewesen \"zo'r bo'lardi\" degani.",
	'काश तब...: Ich wünschte + hätte/wäre + Partizip II अंत में। Das wäre schön gewesen मतलब "अच्छा होता"।',
	'ليتني آنذاك...: Ich wünschte + hätte/wäre + Partizip II في الآخر. وDas wäre schön gewesen تعني "كان ذلك سيكون جميلاً".'
], [ex('Ich wünschte, ich hätte mehr gelernt.', t11('Жаль, что я мало учился.', 'Шкода, що я мало вчився.', 'I wish I had studied more.', 'Szkoda, że mało się uczyłem.', 'Ojalá hubiera estudiado más.', 'J’aurais aimé avoir plus étudié.', 'Keşke daha çok çalışsaydım.', 'Păcat că n-am învățat mai mult.', "Qaniydi ko'proq o'qigan bo'lsam.", 'काश मैंने ज़्यादा पढ़ाई की होती।', 'ليتني درست أكثر.'))])

const T = (...v) => t11(...v)
const quests = {
	'regret-river-one': { title: T('Я бы сделал: hätte', 'Я б зробив: hätte', 'I would have done: hätte', 'Zrobiłbym: hätte', 'Lo habría hecho: hätte', 'Je l’aurais fait : hätte', 'Yapardım: hätte', 'Aș fi făcut: hätte', "Qilgan bo'lardim: hätte", 'मैं करता: hätte', 'كنت سأفعل: hätte'), points: [pastPoint] },
	'regret-river-two': { title: T('Я бы пришёл: wäre', 'Я б прийшов: wäre', 'I would have come: wäre', 'Przyszedłbym: wäre', 'Habría venido: wäre', 'Je serais venu : wäre', 'Gelirdim: wäre', 'Aș fi venit: wäre', "Kelgan bo'lardim: wäre", 'मैं आता: wäre', 'كنت سآتي: wäre'), points: [pastPoint] },
	'regret-river-three': { title: T('Если бы я тогда знал', 'Якби я тоді знав', 'If I had known then', 'Gdybym wtedy wiedział', 'Si lo hubiera sabido', 'Si j’avais su', 'O zaman bilseydim', 'Dacă aș fi știut atunci', "O'shanda bilganimda", 'अगर तब पता होता', 'لو كنت أعرف آنذاك'), points: [fullPoint] },
	'regret-river-four': { title: T('Жаль, что тогда...', 'Шкода, що тоді...', 'I wish I had...', 'Szkoda, że wtedy...', 'Ojalá hubiera...', 'J’aurais aimé...', 'Keşke o zaman...', 'Păcat că atunci...', "Qaniydi o'shanda...", 'काश तब...', 'ليتني آنذاك...'), points: [wishPastPoint] },
	'regret-river-five': { title: T('Сейчас или тогда?', 'Зараз чи тоді?', 'Now or then?', 'Teraz czy wtedy?', '¿Ahora o entonces?', 'Maintenant ou autrefois ?', 'Şimdi mi, o zaman mı?', 'Acum sau atunci?', "Hozirmi yoki o'shanda?", 'अभी या तब?', 'الآن أم آنذاك؟'), points: [nowThenPoint] },
	'regret-river-six': { title: T('Упущенный шанс', 'Втрачений шанс', 'A missed chance', 'Stracona szansa', 'Una oportunidad perdida', 'Une chance manquée', 'Kaçırılmış fırsat', 'O șansă ratată', "Qo'ldan boy berilgan imkoniyat", 'छूटा हुआ मौका', 'فرصة ضائعة'), points: [wishPastPoint, pastPoint] },
	'regret-river-seven': { title: T('Практика: пропущенная вечеринка', 'Практика: пропущена вечірка', 'Practice: the missed party', 'Praktyka: przegapiona impreza', 'Práctica: la fiesta perdida', 'Pratique : la fête ratée', 'Pratik: kaçırılan parti', 'Practică: petrecerea ratată', "Mashq: o'tkazib yuborilgan bazm", 'अभ्यास: छूटी हुई पार्टी', 'تدريب: الحفلة الفائتة'), points: [fullPoint] },
	'regret-river-eight': { title: T('Практика: после экзамена', 'Практика: після іспиту', 'Practice: after the exam', 'Praktyka: po egzaminie', 'Práctica: después del examen', 'Pratique : après l’examen', 'Pratik: sınavdan sonra', 'Practică: după examen', 'Mashq: imtihondan keyin', 'अभ्यास: परीक्षा के बाद', 'تدريب: بعد الامتحان'), points: [nowThenPoint, wishPastPoint] },
	'regret-river-nine': { title: T('Повторение: если бы тогда', 'Повторення: якби тоді', 'Review: if ... had', 'Powtórka: gdyby wtedy', 'Repaso: si hubiera', 'Révision : si ... avait', 'Tekrar: -seydi', 'Recapitulare: dacă ar fi', "Takrorlash: agar o'shanda", 'दोहराव: अगर तब', 'مراجعة: لو آنذاك'), points: [pastPoint, fullPoint, nowThenPoint] },
	'regret-river-ten': { title: finalTitle, points: [fullPoint, nowThenPoint] }
}

module.exports = quests
