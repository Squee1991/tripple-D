// Грамматика к заданиям земли wisdom-summit (повторение второй половины B1)
const { t11 } = require('../lib.cjs')
const pick = (land, questId, index) => {
	const quest = require(`./${land}.cjs`)[questId]
	if (!quest || !quest.points[index]) throw new Error(`wisdom-summit: нет пункта ${land}/${questId}/${index}`)
	return quest.points[index]
}

const T = (...v) => t11(...v)
const q = (title, points) => ({ title, points })
const quests = {
	'wisdom-summit-one': q(T('Повторение: если бы', 'Повторення: якби', 'Review: if', 'Powtórka: gdyby', 'Repaso: si', 'Révision : si', 'Tekrar: -saydı', 'Recapitulare: dacă', 'Takrorlash: agar', 'दोहराव: अगर', 'مراجعة: لو'), [pick('wish-island', 'wish-island-one', 0), pick('regret-river', 'regret-river-one', 0), pick('wish-island', 'wish-island-eight', 0)]),
	'wisdom-summit-two': q(T('Повторение: Genitiv', 'Повторення: Genitiv', 'Review: genitive', 'Powtórka: Genitiv', 'Repaso: genitivo', 'Révision : génitif', 'Tekrar: Genitiv', 'Recapitulare: genitiv', 'Takrorlash: Genitiv', 'दोहराव: Genitiv', 'مراجعة: الإضافة'), [pick('owner-castle', 'owner-castle-one', 0), pick('owner-castle', 'owner-castle-five', 0)]),
	'wisdom-summit-three': q(T('Повторение: слабые существительные', 'Повторення: слабкі іменники', 'Review: weak nouns', 'Powtórka: rzeczowniki słabe', 'Repaso: sustantivos débiles', 'Révision : noms faibles', 'Tekrar: zayıf isimler', 'Recapitulare: substantive slabe', 'Takrorlash: kuchsiz otlar', 'दोहराव: कमज़ोर संज्ञाएँ', 'مراجعة: الأسماء الضعيفة'), [pick('hero-square', 'hero-square-five', 0), pick('hero-square', 'hero-square-four', 0)]),
	'wisdom-summit-four': q(T('Повторение: окончания без артикля', 'Повторення: закінчення без артикля', 'Review: endings without article', 'Powtórka: końcówki bez rodzajnika', 'Repaso: terminaciones sin artículo', 'Révision : terminaisons sans article', 'Tekrar: artikelsiz ekler', 'Recapitulare: terminații fără articol', "Takrorlash: artiklsiz qo'shimchalar", 'दोहराव: बिना आर्टिकल अंत', 'مراجعة: النهايات بدون أداة'), [pick('taste-market', 'taste-market-one', 0), pick('taste-market', 'taste-market-three', 0)]),
	'wisdom-summit-five': q(T('Повторение: предлоги', 'Повторення: прийменники', 'Review: prepositions', 'Powtórka: przyimki', 'Repaso: preposiciones', 'Révision : prépositions', 'Tekrar: edatlar', 'Recapitulare: prepoziții', "Takrorlash: ko'makchilar", 'दोहराव: संबंधसूचक', 'مراجعة: حروف الجر'), [pick('question-bridge', 'question-bridge-two', 0), pick('question-bridge', 'question-bridge-four', 0)]),
	'wisdom-summit-six': q(T('Повторение: связки', 'Повторення: сполучники', 'Review: connectors', 'Powtórka: spójniki', 'Repaso: conectores', 'Révision : connecteurs', 'Tekrar: bağlaçlar', 'Recapitulare: conectori', "Takrorlash: bog'lovchilar", 'दोहराव: योजक', 'مراجعة: أدوات الربط'), [pick('link-harbor', 'link-harbor-one', 0), pick('link-harbor', 'link-harbor-four', 0), pick('nuance-bridge', 'nuance-bridge-three', 0)]),
	'wisdom-summit-seven': q(T('Повторение: как делают слова', 'Повторення: як роблять слова', 'Review: word building', 'Powtórka: słowotwórstwo', 'Repaso: formación de palabras', 'Révision : formation des mots', 'Tekrar: kelime türetme', 'Recapitulare: formarea cuvintelor', "Takrorlash: so'z yasalishi", 'दोहराव: शब्द निर्माण', 'مراجعة: بناء الكلمات'), [pick('word-forge', 'word-forge-one', 0), pick('word-forge', 'word-forge-two', 0), pick('word-forge', 'word-forge-five', 0)]),
	'wisdom-summit-eight': q(T('Повторение: мнение', 'Повторення: думка', 'Review: opinions', 'Powtórka: opinie', 'Repaso: opiniones', 'Révision : opinions', 'Tekrar: görüşler', 'Recapitulare: păreri', 'Takrorlash: fikrlar', 'दोहराव: राय', 'مراجعة: الآراء'), [pick('opinion-tower', 'opinion-tower-one', 0), pick('opinion-tower', 'opinion-tower-four', 0)]),
	'wisdom-summit-nine': q(T('Большое повторение', 'Велике повторення', 'Big review', 'Wielka powtórka', 'Gran repaso', 'Grande révision', 'Büyük tekrar', 'Marea recapitulare', 'Katta takrorlash', 'बड़ा दोहराव', 'المراجعة الكبرى'), [pick('regret-river', 'regret-river-three', 0), pick('craft-valley', 'craft-valley-one', 0), pick('purpose-path', 'purpose-path-one', 0)]),
	'wisdom-summit-ten': q(T('Экзамен B1: как решать', 'Іспит B1: як розв’язувати', 'B1 exam: how to approach it', 'Egzamin B1: jak rozwiązywać', 'Examen B1: cómo resolverlo', 'Examen B1 : comment s’y prendre', 'B1 sınavı: nasıl çözülür', 'Examen B1: cum rezolvi', 'B1 imtihoni: qanday yechish', 'B1 परीक्षा: कैसे हल करें', 'امتحان B1: كيف تحل'), [pick('experience-summit', 'experience-summit-ten', 0), pick('neighbor-street', 'neighbor-street-one', 0), pick('wish-island', 'wish-island-one', 0)])
}

module.exports = quests
