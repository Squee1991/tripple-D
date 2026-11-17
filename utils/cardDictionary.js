// Словарь для автозаполнения карточек: существительные из /words.json (артикль, мн. число, переводы)
// и глаголы из /verbs.json (Präteritum, Perfekt). Искать можно по-немецки и на языке приложения.
import {normalizeAnswer} from '~/utils/wordReview.js'

export const ARTICLES = ['der', 'die', 'das']
export const ARTICLE_COLORS = {der: '#3b82f6', die: '#ef4444', das: '#22c55e'}

let loading = null
let entries = []

// «der Tisch», «ein Tisch» → «tisch»; ae/oe/ue/ss = ä/ö/ü/ß
export function dictionaryKey(text) {
	return normalizeAnswer(String(text || '').replace(/^\s*(der|die|das|ein|eine)\s+/i, ''))
}

function nounEntry(word) {
	return {
		kind: 'noun',
		de: word.de,
		article: ARTICLES.includes(word.article) ? word.article : '',
		plural: word.plural || '',
		translations: word,
		key: dictionaryKey(word.de)
	}
}

function verbEntry(verb) {
	return {
		kind: 'verb',
		de: verb.infinitive,
		article: '',
		plural: '',
		praeteritum: verb.conjugation_past?.er_sie_es || '',
		perfekt: verb.conjugation_perf?.er_sie_es || '',
		translations: verb.translations || {},
		key: dictionaryKey(verb.infinitive)
	}
}

export function loadDictionary() {
	if (!loading) {
		loading = Promise.all([
			fetch('/words.json').then(res => res.json()),
			fetch('/verbs.json').then(res => res.json())
		]).then(([words, verbs]) => {
			const seen = new Set()
			const list = []
			const add = (entry) => {
				const id = entry.kind + ':' + entry.key
				if (!entry.key || seen.has(id)) return
				seen.add(id)
				list.push(entry)
			}
			Object.values(words).flat().forEach(word => word?.de && add(nounEntry(word)))
			Object.values(verbs).flat().forEach(verb => verb?.infinitive && add(verbEntry(verb)))
			entries = list
			return list
		}).catch(err => {
			loading = null
			throw err
		})
	}
	return loading
}

// Перевод на язык приложения; для англ. «to trust» оставляем как есть
export function translationOf(entry, locale) {
	return String(entry?.translations?.[locale] || entry?.translations?.en || '').trim()
}

// Карточка из записи словаря: все поля, которые знаем
export function cardFromEntry(entry, locale) {
	return {
		kind: entry.kind,
		de: entry.de,
		article: entry.article || '',
		plural: entry.plural || '',
		translation: translationOf(entry, locale),
		praeteritum: entry.praeteritum || '',
		perfekt: entry.perfekt || ''
	}
}

// Подсказки при вводе: сначала точное совпадение, потом начало слова; по-немецки и по переводу
export function suggestWords(query, locale, limit = 6) {
	const key = dictionaryKey(query)
	const text = String(query || '').trim().toLowerCase()
	if (!key || key.length < 2) return []
	const scored = []
	for (const entry of entries) {
		let score = -1
		if (entry.key === key) score = 0
		else if (entry.key.startsWith(key)) score = 1
		else {
			const translation = translationOf(entry, locale).toLowerCase()
			if (translation === text) score = 2
			else if (text.length >= 2 && translation.split(/[\s,/]+/).some(part => part.startsWith(text))) score = 3
		}
		if (score >= 0) scored.push({entry, score})
	}
	scored.sort((a, b) => a.score - b.score || a.entry.de.length - b.entry.de.length)
	return scored.slice(0, limit).map(item => item.entry)
}

// Точное совпадение по немецкому слову (с артиклем или без)
export function findExact(text) {
	const key = dictionaryKey(text)
	if (!key) return null
	const article = String(text || '').trim().match(/^(der|die|das)\s/i)?.[1]?.toLowerCase()
	const matches = entries.filter(entry => entry.key === key)
	// «die Leiter» и «der Leiter» разные слова: если артикль указан, нужна запись именно с ним
	if (article) return matches.find(entry => entry.article === article) || null
	return matches[0] || null
}

// Карточка из немецкого текста: словарь знает слово, берём всё оттуда; свой перевод пользователя важнее.
// found = false: слова нет в словаре, заполнит AI или сам пользователь
export function cardFromText(text, translation, locale) {
	const de = String(text || '').trim()
	const entry = findExact(de)
	if (entry) {
		const card = cardFromEntry(entry, locale)
		if (translation) card.translation = translation
		return {...card, found: true}
	}
	// написал на своём языке («стол»): ищем по переводу
	if (!translation) {
		const native = de.toLowerCase()
		const byTranslation = entries.find(item => translationOf(item, locale).toLowerCase() === native)
		if (byTranslation) return {...cardFromEntry(byTranslation, locale), found: true}
	}
	const match = de.match(/^(der|die|das)\s+(.+)$/i)
	return {
		// одно слово с большой буквы скорее существительное, остальное считаем фразой
		kind: match || (!/\s/.test(de) && /^[A-ZÄÖÜ]/.test(de)) ? 'noun' : 'phrase',
		de: match ? match[2] : de,
		article: match ? match[1].toLowerCase() : '',
		plural: '',
		translation: translation || '',
		praeteritum: '',
		perfekt: '',
		found: false
	}
}

// Вставленный список: «слово» или «слово - перевод» по строкам; экспорт Quizlet («слово<Tab>перевод») тоже.
// Одна строка без разделителей перевода делится по запятым
const PAIR_SEPARATOR = /\t| [-–—=] /
export function parseWordList(text) {
	let lines = String(text || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean)
	if (lines.length === 1 && !PAIR_SEPARATOR.test(lines[0])) lines = lines[0].split(/[,;]/).map(item => item.trim()).filter(Boolean)
	return lines.map(line => {
		const [de, ...rest] = line.split(PAIR_SEPARATOR)
		return {de: de.trim(), translation: rest.join(' ').trim()}
	}).filter(item => item.de.length > 0 && item.de.length <= 120)
}

// Слова квеста ({word: 'die Nummer', 'translation-ru': ...}) → карточки; мн. число и вид слова из словаря
export function cardsFromQuestVocabulary(vocabulary, locale) {
	return (vocabulary || []).filter(item => item?.word).map(item => {
		const translation = String(item[`translation-${locale}`] || item['translation-en'] || '').trim()
		const card = cardFromText(item.word, translation, locale)
		// перевод из курса проверен: AI для таких слов не нужен
		return translation ? {...card, found: true} : card
	})
}

// Случайные переводы из словаря: варианты ответа, когда в колоде мало карточек
export function randomTranslations(locale, count, exclude = []) {
	const skip = new Set(exclude.map(item => String(item).toLowerCase()))
	const result = []
	const pool = entries.filter(entry => entry.kind === 'noun')
	for (let tries = 0; result.length < count && tries < count * 20 && pool.length; tries++) {
		const translation = translationOf(pool[Math.floor(Math.random() * pool.length)], locale)
		if (translation && !skip.has(translation.toLowerCase())) {
			skip.add(translation.toLowerCase())
			result.push(translation)
		}
	}
	return result
}
