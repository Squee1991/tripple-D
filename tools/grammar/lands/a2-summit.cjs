// Грамматика к заданиям земли a2-summit (повторение всего A2)
// Пункты берём из уже написанных земель A2, чтобы правило звучало так же, как при знакомстве
const { ex, t11, pt } = require('../lib.cjs')
const pick = (land, questId, index) => {
	const quest = require(`./${land}.cjs`)[questId]
	if (!quest || !quest.points[index]) throw new Error(`a2-summit: нет пункта ${land}/${questId}/${index}`)
	return quest.points[index]
}

const werdenBecome = pt(['werden = становиться', 'werden = ставати', 'werden = to become', 'werden = stawać się', 'werden = volverse, hacerse', 'werden = devenir', 'werden = olmak', 'werden = a deveni', "werden = bo'lmoq", 'werden = बनना', 'werden = يصبح'], [
	'Без второго глагола werden значит «становиться»: Er wird Arzt. Es wird kalt. О будущем часто говорят просто в настоящем: Morgen fahre ich nach Hamburg.',
	'Без другого дієслова werden означає «ставати»: Er wird Arzt. Es wird kalt. Про майбутнє часто кажуть просто в теперішньому: Morgen fahre ich nach Hamburg.',
	'Without a second verb, werden means "to become": Er wird Arzt. Es wird kalt. The future is often just the present: Morgen fahre ich nach Hamburg.',
	'Bez drugiego czasownika werden znaczy „stawać się”: Er wird Arzt. Es wird kalt. O przyszłości często mówi się w teraźniejszym: Morgen fahre ich nach Hamburg.',
	'Sin otro verbo, werden significa "volverse, hacerse": Er wird Arzt. Es wird kalt. Para el futuro se usa a menudo el presente: Morgen fahre ich nach Hamburg.',
	'Sans autre verbe, werden veut dire « devenir » : Er wird Arzt. Es wird kalt. Pour le futur, on utilise souvent le présent : Morgen fahre ich nach Hamburg.',
	'İkinci fiil yoksa werden "olmak" demektir: Er wird Arzt. Es wird kalt. Gelecek için çoğu zaman şimdiki zaman kullanılır: Morgen fahre ich nach Hamburg.',
	'Fără alt verb, werden înseamnă „a deveni”: Er wird Arzt. Es wird kalt. Despre viitor se vorbește des la prezent: Morgen fahre ich nach Hamburg.',
	"Ikkinchi fe'lsiz werden \"bo'lmoq\" degani: Er wird Arzt. Es wird kalt. Kelajak haqida ko'pincha hozirgi zamonda aytiladi: Morgen fahre ich nach Hamburg.",
	'दूसरी क्रिया के बिना werden का मतलब "बनना": Er wird Arzt। Es wird kalt। भविष्य के लिए अक्सर वर्तमान ही: Morgen fahre ich nach Hamburg।',
	'بدون فعل ثانٍ تعني werden "يصبح": Er wird Arzt. Es wird kalt. وعن المستقبل يُستعمل المضارع غالباً: Morgen fahre ich nach Hamburg.'
], [ex('Er wird Arzt.', t11('Он станет врачом.', 'Він стане лікарем.', 'He’s going to be a doctor.', 'On zostanie lekarzem.', 'Va a ser médico.', 'Il va devenir médecin.', 'O doktor olacak.', 'El va deveni medic.', "U shifokor bo'ladi.", 'वह डॉक्टर बनेगा।', 'سيصبح طبيباً.'))])

const examTip = pt(['Как решать экзамен', 'Як розв’язувати іспит', 'How to approach the exam', 'Jak rozwiązywać egzamin', 'Cómo hacer el examen', 'Comment aborder l’examen', 'Sınav nasıl çözülür', 'Cum rezolvi examenul', 'Imtihonni qanday yechish', 'परीक्षा कैसे हल करें', 'كيف تحل الامتحان'], [
	'1. Найди время: Perfekt, Präteritum или Futur. 2. Посмотри на порядок: после weil, dass, ob глагол в конце. 3. Проверь падеж и окончание: где или куда, der или ein.',
	'1. Знайди час: Perfekt, Präteritum чи Futur. 2. Подивися на порядок: після weil, dass, ob дієслово в кінці. 3. Перевір відмінок і закінчення: де чи куди, der чи ein.',
	'1. Find the tense: Perfekt, Präteritum or Futur. 2. Check the word order: after weil, dass, ob the verb goes last. 3. Check the case and ending: where or where to, der or ein.',
	'1. Znajdź czas: Perfekt, Präteritum czy Futur. 2. Sprawdź szyk: po weil, dass, ob czasownik na końcu. 3. Sprawdź przypadek i końcówkę: gdzie czy dokąd, der czy ein.',
	'1. Busca el tiempo: Perfekt, Präteritum o Futur. 2. Mira el orden: tras weil, dass, ob el verbo va al final. 3. Revisa caso y terminación: dónde o adónde, der o ein.',
	'1. Trouve le temps : Perfekt, Präteritum ou Futur. 2. Regarde l’ordre : après weil, dass, ob, le verbe va à la fin. 3. Vérifie le cas et la terminaison : où ou vers où, der ou ein.',
	'1. Zamanı bul: Perfekt, Präteritum ya da Futur. 2. Sıraya bak: weil, dass, ob’dan sonra fiil sonda. 3. Hâl ve eki kontrol et: nerede mi nereye mi, der mi ein mi.',
	'1. Găsește timpul: Perfekt, Präteritum sau Futur. 2. Uită-te la ordine: după weil, dass, ob verbul e la final. 3. Verifică cazul și terminația: unde sau încotro, der sau ein.',
	"1. Zamonni top: Perfekt, Präteritum yoki Futur. 2. Tartibga qara: weil, dass, ob dan keyin fe'l oxirida. 3. Kelishik va qo'shimchani tekshir: qayerda yoki qayerga, der yoki ein.",
	'1. काल ढूँढो: Perfekt, Präteritum या Futur। 2. क्रम देखो: weil, dass, ob के बाद क्रिया अंत में। 3. कारक और अंत जाँचो: कहाँ या किधर, der या ein।',
	'1. حدد الزمن: Perfekt أو Präteritum أو Futur. 2. انظر إلى الترتيب: بعد weil وdass وob يكون الفعل في الآخر. 3. تحقق من الحالة والنهاية: أين أم إلى أين، der أم ein.'
], [
	ex('Ich weiß nicht, ob er ein Auto hat.', t11('Я не знаю, есть ли у него машина.', 'Я не знаю, чи є в нього машина.', 'I don’t know if he has a car.', 'Nie wiem, czy on ma samochód.', 'No sé si tiene coche.', 'Je ne sais pas s’il a une voiture.', 'Arabası olup olmadığını bilmiyorum.', 'Nu știu dacă are mașină.', "Uning mashinasi bor-yo'qligini bilmayman.", 'मुझे नहीं पता कि उसके पास गाड़ी है या नहीं।', 'لا أعرف إن كانت عنده سيارة.')),
	ex('Ich würde gern am Meer wohnen.', t11('Я бы с удовольствием жил у моря.', 'Я б залюбки жив біля моря.', 'I’d love to live by the sea.', 'Chętnie mieszkałbym nad morzem.', 'Me gustaría vivir junto al mar.', 'J’aimerais vivre au bord de la mer.', 'Deniz kenarında yaşamak isterdim.', 'Mi-ar plăcea să locuiesc la mare.', "Dengiz bo'yida yashashni istardim.", 'मैं समुद्र किनारे रहना चाहूँगा।', 'أودّ أن أعيش على البحر.'))
])

const T = (...v) => t11(...v)
const q = (title, points) => ({ title, points })

const quests = {
	'a2-summit-one': q(T('Повторение: прошлое', 'Повторення: минуле', 'Review: the past', 'Powtórka: przeszłość', 'Repaso: el pasado', 'Révision : le passé', 'Tekrar: geçmiş', 'Recapitulare: trecutul', "Takrorlash: o'tgan zamon", 'दोहराव: भूतकाल', 'مراجعة: الماضي'), [pick('past-land', 'past-one', 0), pick('past-land', 'past-two', 0), pick('past-simple', 'past-simple-1', 0), pick('past-simple', 'past-simple-4', 0)]),
	'a2-summit-two': q(T('Повторение: падежи', 'Повторення: відмінки', 'Review: cases', 'Powtórka: przypadki', 'Repaso: casos', 'Révision : les cas', 'Tekrar: hâller', 'Recapitulare: cazurile', 'Takrorlash: kelishiklar', 'दोहराव: कारक', 'مراجعة: الحالات'), [pick('action-valley', 'action-four', 0), pick('action-valley', 'action-three', 0), pick('action-valley', 'action-eight', 0)]),
	'a2-summit-three': q(T('Повторение: предложения', 'Повторення: речення', 'Review: sentences', 'Powtórka: zdania', 'Repaso: oraciones', 'Révision : les phrases', 'Tekrar: cümleler', 'Recapitulare: propoziții', 'Takrorlash: gaplar', 'दोहराव: वाक्य', 'مراجعة: الجمل'), [pick('order-valley', 'order-one', 0), pick('order-valley', 'order-four', 0), pick('order-valley', 'order-six', 0)]),
	'a2-summit-four': q(T('Повторение: окончания', 'Повторення: закінчення', 'Review: endings', 'Powtórka: końcówki', 'Repaso: terminaciones', 'Révision : les terminaisons', 'Tekrar: ekler', 'Recapitulare: terminații', "Takrorlash: qo'shimchalar", 'दोहराव: अंत', 'مراجعة: النهايات'), [pick('edge-images', 'adjective-one', 0), pick('edge-images', 'adjective-one', 1), pick('secret-lands', 'secret-one', 0), pick('secret-lands', 'secret-eight', 0)]),
	'a2-summit-five': q(T('Повторение: будущее', 'Повторення: майбутнє', 'Review: the future', 'Powtórka: przyszłość', 'Repaso: el futuro', 'Révision : le futur', 'Tekrar: gelecek', 'Recapitulare: viitorul', 'Takrorlash: kelasi zamon', 'दोहराव: भविष्य', 'مراجعة: المستقبل'), [pick('future-land', 'future-one', 0), werdenBecome]),
	'a2-summit-six': q(T('Повторение: вежливость', 'Повторення: ввічливість', 'Review: politeness', 'Powtórka: grzeczność', 'Repaso: cortesía', 'Révision : la politesse', 'Tekrar: nezaket', 'Recapitulare: politețea', 'Takrorlash: muloyimlik', 'दोहराव: विनम्रता', 'مراجعة: الأدب'), [pick('requests-land', 'requests-5', 0), pick('advice-garden', 'advice-garden-one', 0), pick('comparison-hills', 'comparison-hills-three', 0)]),
	'a2-summit-seven': q(T('Повторение: сравнение', 'Повторення: порівняння', 'Review: comparison', 'Powtórka: porównanie', 'Repaso: comparación', 'Révision : la comparaison', 'Tekrar: karşılaştırma', 'Recapitulare: comparația', 'Takrorlash: qiyoslash', 'दोहराव: तुलना', 'مراجعة: المقارنة'), [pick('comparison-hills', 'comparison-hills-three', 0), pick('comparison-hills', 'comparison-hills-four', 0), pick('comparison-hills', 'comparison-hills-five', 0), pick('comparison-hills', 'comparison-hills-six', 0)]),
	'a2-summit-eight': q(T('Повторение: советы и желания', 'Повторення: поради й бажання', 'Review: advice and wishes', 'Powtórka: rady i życzenia', 'Repaso: consejos y deseos', 'Révision : conseils et souhaits', 'Tekrar: tavsiyeler ve istekler', 'Recapitulare: sfaturi și dorințe', 'Takrorlash: maslahatlar va istaklar', 'दोहराव: सलाह और इच्छाएँ', 'مراجعة: النصائح والرغبات'), [pick('advice-garden', 'advice-garden-one', 0), pick('advice-garden', 'advice-garden-three', 0), pick('advice-garden', 'advice-garden-four', 0)]),
	'a2-summit-nine': q(T('Большое повторение A2', 'Велике повторення A2', 'Big A2 review', 'Wielka powtórka A2', 'Gran repaso A2', 'Grande révision A2', 'Büyük A2 tekrarı', 'Marea recapitulare A2', 'Katta A2 takrorlash', 'A2 का बड़ा दोहराव', 'المراجعة الكبرى لـ A2'), [pick('past-land', 'past-one', 0), pick('order-valley', 'order-one', 0), pick('edge-images', 'adjective-one', 1)]),
	'a2-summit-ten': q(T('Экзамен A2: как решать', 'Іспит A2: як розв’язувати', 'A2 exam: how to approach it', 'Egzamin A2: jak rozwiązywać', 'Examen A2: cómo resolverlo', 'Examen A2 : comment s’y prendre', 'A2 sınavı: nasıl çözülür', 'Examenul A2: cum rezolvi', 'A2 imtihoni: qanday yechish', 'A2 परीक्षा: कैसे हल करें', 'امتحان A2: كيف تحل'), [examTip])
}

module.exports = quests
