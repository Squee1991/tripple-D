// Грамматика к заданиям земли a1-summit (Вершина A1: повторение всего уровня)
// Пункты берём из уже написанных земель, чтобы правило везде звучало одинаково
const t11 = (ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar) => ({ ru, uk, en, pl, es, fr, tr, ro, uz, hi, ar })
const pick = (land, questId, index) => {
	const quest = require(`./${land}.cjs`)[questId]
	if (!quest || !quest.points[index]) throw new Error(`a1-summit: нет пункта ${land}/${questId}/${index}`)
	return quest.points[index]
}
const all = (land, questId) => require(`./${land}.cjs`)[questId].points

const quests = {
	'a1-summit-one': {
		title: t11('Повторение: sein, haben, окончания', 'Повторення: sein, haben, закінчення', 'Review: sein, haben, endings', 'Powtórka: sein, haben, końcówki', 'Repaso: sein, haben, terminaciones', 'Révision : sein, haben, terminaisons', 'Tekrar: sein, haben, ekler', 'Recapitulare: sein, haben, terminații', "Takrorlash: sein, haben, qo'shimchalar", 'दोहराव: sein, haben, अंत', 'مراجعة: sein وhaben والنهايات'),
		points: all('meet-meadow', 'meet-meadow-nine')
	},
	'a1-summit-two': {
		title: t11('Повторение: вопросы и отрицание', 'Повторення: питання і заперечення', 'Review: questions and negation', 'Powtórka: pytania i przeczenie', 'Repaso: preguntas y negación', 'Révision : questions et négation', 'Tekrar: sorular ve olumsuzluk', 'Recapitulare: întrebări și negație', "Takrorlash: savollar va inkor", 'दोहराव: सवाल और नकार', 'مراجعة: الأسئلة والنفي'),
		points: all('question-gorge', 'question-gorge-ten')
	},
	'a1-summit-three': {
		title: t11('Повторение: Akkusativ', 'Повторення: Akkusativ', 'Review: the accusative', 'Powtórka: Akkusativ', 'Repaso: el acusativo', 'Révision : l’accusatif', 'Tekrar: Akkusativ', 'Recapitulare: acuzativul', 'Takrorlash: Akkusativ', 'दोहराव: Akkusativ', 'مراجعة: حالة المفعول'),
		points: [pick('market-square', 'market-square-nine', 0), pick('market-square', 'market-square-nine', 1), pick('dress-bazaar', 'dress-bazaar-six', 0)]
	},
	'a1-summit-four': {
		title: t11('Повторение: глаголы с меняющейся гласной', 'Повторення: дієслова зі змінною голосною', 'Review: verbs with a vowel change', 'Powtórka: czasowniki ze zmianą samogłoski', 'Repaso: verbos con cambio vocálico', 'Révision : verbes à changement de voyelle', 'Tekrar: ünlüsü değişen fiiller', 'Recapitulare: verbe cu schimbare de vocală', "Takrorlash: unlisi o'zgaradigan fe'llar", 'दोहराव: स्वर बदलने वाली क्रियाएँ', 'مراجعة: الأفعال التي يتغير حرفها'),
		points: [pick('change-river', 'change-river-five', 0), ...all('change-river', 'change-river-nine'), pick('change-river', 'change-river-four', 1)]
	},
	'a1-summit-five': {
		title: t11('Повторение: чьё и когда', 'Повторення: чиє і коли', 'Review: whose and when', 'Powtórka: czyje i kiedy', 'Repaso: de quién y cuándo', 'Révision : à qui et quand', 'Tekrar: kimin ve ne zaman', 'Recapitulare: al cui și când', 'Takrorlash: kimniki va qachon', 'दोहराव: किसका और कब', 'مراجعة: لمن ومتى'),
		points: [pick('family-tree', 'family-tree-six', 0), pick('clock-tower', 'clock-tower-six', 1), pick('clock-tower', 'clock-tower-two', 1)]
	},
	'a1-summit-six': {
		title: t11('Повторение: модальные глаголы', 'Повторення: модальні дієслова', 'Review: modal verbs', 'Powtórka: czasowniki modalne', 'Repaso: verbos modales', 'Révision : verbes de modalité', 'Tekrar: modal fiiller', 'Recapitulare: verbe modale', "Takrorlash: modal fe'llar", 'दोहराव: मोडल क्रियाएँ', 'مراجعة: الأفعال المساعدة'),
		points: [pick('power-pass', 'power-pass-seven', 0), pick('power-pass', 'power-pass-six', 0), pick('power-pass', 'power-pass-nine', 2)]
	},
	'a1-summit-seven': {
		title: t11('Повторение: покупки, еда, одежда', 'Повторення: покупки, їжа, одяг', 'Review: shopping, food, clothes', 'Powtórka: zakupy, jedzenie, ubrania', 'Repaso: compras, comida, ropa', 'Révision : courses, nourriture, vêtements', 'Tekrar: alışveriş, yiyecek, kıyafet', 'Recapitulare: cumpărături, mâncare, haine', "Takrorlash: xarid, taom, kiyim", 'दोहराव: खरीदारी, खाना, कपड़े', 'مراجعة: التسوق والطعام والملابس'),
		points: [pick('hearty-inn', 'hearty-inn-ten', 0), pick('hearty-inn', 'hearty-inn-five', 0), pick('dress-bazaar', 'dress-bazaar-three', 0)]
	},
	'a1-summit-eight': {
		title: t11('Повторение: город, погода, здоровье', 'Повторення: місто, погода, здоров’я', 'Review: city, weather, health', 'Powtórka: miasto, pogoda, zdrowie', 'Repaso: ciudad, tiempo, salud', 'Révision : ville, météo, santé', 'Tekrar: şehir, hava, sağlık', 'Recapitulare: oraș, vreme, sănătate', "Takrorlash: shahar, ob-havo, sog'liq", 'दोहराव: शहर, मौसम, स्वास्थ्य', 'مراجعة: المدينة والطقس والصحة'),
		points: [pick('wind-valley', 'city-7', 0), pick('lake-ruins', 'lake-ruins-one', 0), pick('healer-hut', 'healer-hut-six', 0)]
	},
	'a1-summit-nine': {
		title: t11('Большое повторение A1', 'Велике повторення A1', 'Big A1 review', 'Wielka powtórka A1', 'Gran repaso A1', 'Grande révision A1', 'Büyük A1 tekrarı', 'Marea recapitulare A1', 'Katta A1 takrorlash', 'A1 का बड़ा दोहराव', 'المراجعة الكبرى لـ A1'),
		points: [pick('clock-tower', 'clock-tower-two', 1), pick('market-square', 'market-square-nine', 0), pick('power-pass', 'power-pass-nine', 1)]
	},
	'a1-summit-ten': {
		title: t11('Экзамен A1: как решать', 'Іспит A1: як розв’язувати', 'A1 exam: how to approach it', 'Egzamin A1: jak rozwiązywać', 'Examen A1: cómo resolverlo', 'Examen A1 : comment s’y prendre', 'A1 sınavı: nasıl çözülür', 'Examenul A1: cum rezolvi', 'A1 imtihoni: qanday yechish', 'A1 परीक्षा: कैसे हल करें', 'امتحان A1: كيف تحل'),
		points: [
			{
				t: {
					ru: ['Три шага', '1. Найди глагол и поставь его на второе место (в вопросе на первое). 2. Посмотри на род: нужен ли den, einen, meinen. 3. Второй глагол или приставку отправь в конец.'],
					uk: ['Три кроки', '1. Знайди дієслово й постав його на друге місце (у питанні на перше). 2. Подивися на рід: чи потрібен den, einen, meinen. 3. Друге дієслово чи префікс відправ у кінець.'],
					en: ['Three steps', '1. Find the verb and put it in second place (first in a question). 2. Check the gender: do you need den, einen, meinen? 3. Send the second verb or the prefix to the end.'],
					pl: ['Trzy kroki', '1. Znajdź czasownik i postaw go na drugim miejscu (w pytaniu na pierwszym). 2. Sprawdź rodzaj: czy potrzeba den, einen, meinen. 3. Drugi czasownik albo przedrostek wyślij na koniec.'],
					es: ['Tres pasos', '1. Busca el verbo y ponlo en segundo lugar (en la pregunta, primero). 2. Mira el género: ¿hace falta den, einen, meinen? 3. Manda el segundo verbo o el prefijo al final.'],
					fr: ['Trois étapes', '1. Trouve le verbe et mets-le en deuxième position (en premier dans une question). 2. Regarde le genre : faut-il den, einen, meinen ? 3. Envoie le deuxième verbe ou le préfixe à la fin.'],
					tr: ['Üç adım', '1. Fiili bul ve ikinci sıraya koy (soruda başa). 2. Cinsiyete bak: den, einen, meinen gerekiyor mu? 3. İkinci fiili ya da ön eki sona gönder.'],
					ro: ['Trei pași', '1. Găsește verbul și pune-l pe locul doi (în întrebare primul). 2. Uită-te la gen: e nevoie de den, einen, meinen? 3. Trimite al doilea verb sau prefixul la final.'],
					uz: ['Uch qadam', "1. Fe'lni top va ikkinchi o'ringa qo'y (savolda birinchiga). 2. Rodga qara: den, einen, meinen kerakmi. 3. Ikkinchi fe'l yoki old qo'shimchani oxiriga yubor."],
					hi: ['तीन कदम', '1. क्रिया ढूँढो और उसे दूसरे स्थान पर रखो (सवाल में पहले)। 2. लिंग देखो: क्या den, einen, meinen चाहिए। 3. दूसरी क्रिया या उपसर्ग को अंत में भेजो।'],
					ar: ['ثلاث خطوات', '1. ابحث عن الفعل وضعه في المكان الثاني (وفي السؤال في الأول). 2. انظر إلى الجنس: هل تحتاج den أو einen أو meinen؟ 3. أرسل الفعل الثاني أو السابقة إلى الآخر.']
				},
				examples: [
					{ de: 'Am Mittwoch habe ich keine Zeit.', tr: t11('В среду у меня нет времени.', 'У середу в мене немає часу.', 'On Wednesday I have no time.', 'W środę nie mam czasu.', 'El miércoles no tengo tiempo.', 'Mercredi, je n’ai pas le temps.', 'Çarşamba vaktim yok.', 'Miercuri nu am timp.', "Chorshanba kuni vaqtim yo'q.", 'बुधवार को मेरे पास समय नहीं है।', 'يوم الأربعاء ليس عندي وقت.') },
					{ de: 'Können Sie bitte langsam sprechen?', tr: t11('Вы можете говорить медленнее, пожалуйста?', 'Ви можете говорити повільніше, будь ласка?', 'Could you speak slowly, please?', 'Czy może pan mówić wolniej?', '¿Puede hablar despacio, por favor?', 'Vous pouvez parler lentement, s’il vous plaît ?', 'Lütfen yavaş konuşur musunuz?', 'Puteți vorbi mai rar, vă rog?', 'Iltimos, sekinroq gapira olasizmi?', 'क्या आप कृपया धीरे बोल सकते हैं?', 'هل يمكنك التكلم ببطء من فضلك؟') }
				]
			}
		]
	}
}

module.exports = quests
