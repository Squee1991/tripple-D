export async function useTranslate({ text, source, target }) {
	const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY
	if (!text?.trim()) return ''
	const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			q: text,
			source,
			target,
			format: 'text'
		})
	})

	const data = await res.json()

	if (data?.data?.translations?.[0]?.translatedText) {
		return data.data.translations[0].translatedText
	} else {
		return 'Ошибка перевода. Проверь ключ и выбранные языки.'
	}
}
