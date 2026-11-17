// AI для своих карточек: облачная функция buildDeckCards (Gemini).
// fill: заполнить слова, которых нет в словаре; example: примеры предложений
import {getFunctions, httpsCallable} from 'firebase/functions'

export class DeckAiError extends Error {
	constructor(code, left = null) {
		super(code)
		this.code = code
		// сколько AI-слов осталось на сегодня: {words}
		this.left = left
	}
}

async function call(payload) {
	const fn = httpsCallable(getFunctions(undefined, 'us-central1'), 'buildDeckCards', {timeout: 70000})
	let result
	try {
		result = await fn(payload)
	} catch (err) {
		throw new DeckAiError('NETWORK')
	}
	const data = result?.data || {}
	if (data.error) throw new DeckAiError(data.error === 'LIMIT_REACHED' ? 'LIMIT' : 'FAILED', data.left || null)
	return data
}

// items: [{de, translation?}] → карточки в том же порядке (null, если модель не справилась со словом)
export async function aiFillCards(items, locale) {
	const data = await call({action: 'fill', items: items.map(({de, translation}) => ({de, translation: translation || ''})), locale})
	return {cards: data.data?.cards || [], left: data.left}
}

// cards: [{de, article, translation}] → предложения в том же порядке
export async function aiExamples(cards, level, locale) {
	const items = cards.map(({de, article, translation}) => ({de, article: article || '', translation}))
	const data = await call({action: 'example', items, level, locale})
	return {examples: data.data?.examples || [], left: data.left}
}
