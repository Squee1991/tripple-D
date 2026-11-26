// Общие помощники для файлов tools/grammar/lands/*.cjs
const L = ['ru', 'uk', 'en', 'pl', 'es', 'fr', 'tr', 'ro', 'uz', 'hi', 'ar']

// пример: немецкая фраза + перевод (объект по языкам или одна строка для всех)
const ex = (de, tr) => ({ de, tr })

// объект по 11 языкам в порядке L
const t11 = (...values) => {
	if (values.length !== L.length) throw new Error(`t11: нужно ${L.length} значений, пришло ${values.length}: ${values[0]}`)
	return Object.fromEntries(L.map((k, i) => [k, values[i]]))
}

// пункт: заголовок (строка для всех языков или массив из 11), тексты (массив из 11), примеры
const pt = (titles, texts, examples = []) => {
	if (texts.length !== L.length) throw new Error(`pt: нужно ${L.length} текстов, пришло ${texts.length}: ${texts[0]}`)
	if (Array.isArray(titles) && titles.length !== L.length) throw new Error(`pt: нужно ${L.length} заголовков: ${titles[0]}`)
	return { t: Object.fromEntries(L.map((k, i) => [k, [Array.isArray(titles) ? titles[i] : titles, texts[i]]])), examples }
}

const noRules = ['Новых правил нет', 'Нових правил немає', 'No new rules', 'Bez nowych reguł', 'Sin reglas nuevas', 'Pas de nouvelle règle', 'Yeni kural yok', 'Fără reguli noi', "Yangi qoida yo'q", 'कोई नया नियम नहीं', 'لا قواعد جديدة']

const finalTitle = t11('Контрольный: что повторить', 'Контрольне: що повторити', 'Final test: what to review', 'Sprawdzian: co powtórzyć', 'Prueba final: qué repasar', 'Contrôle : quoi réviser', 'Sınav: neleri tekrar etmeli', 'Test: ce să recapitulezi', 'Nazorat: nimani takrorlash kerak', 'टेस्ट: क्या दोहराएँ', 'الاختبار: ماذا تراجع')

module.exports = { L, ex, t11, pt, noRules, finalTitle }
