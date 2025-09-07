export const useGroqCheckHomeWork = async ({ task, answer, level = 'A1', locale = 'de' }) => {
	const res = await fetch('/api/groq-homework', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ task, answer, level, locale })
	})
	return await res.json()
}
