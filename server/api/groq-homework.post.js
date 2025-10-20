import { readBody, createError, sendError } from 'h3'
export default defineEventHandler(async (event) => {
	try {
		const { task, answer, level = 'A1', locale = 'de' } = (await readBody(event)) || {}

		const plainAnswer = (answer ?? '').toString().trim()
		if (!plainAnswer) {
			return {
				result: 'keine Antwort',
				feedback: 'Antwort fehlt – 0 Punkte.',
				mistakes: [],
				correctedVersion: ''
			}
		}
		const isSpeaking = !!(task && task.prompt) && !!(task && task.expectedTopics)
		const isLow = ['A1', 'A2'].includes(String(level).toUpperCase())
		const outLangISO = String(locale || 'de')
		const resultScale = 'ausgezeichnet, fast perfekt, gut, kleine Fehler, mittelmäßig, okay, viele Fehler, muss verbessert werden, schlecht, sehr schlecht, keine Antwort'
		const systemPrompt = `
Ты — строгий, но вежливый и поддерживающий AI-экзаменатор по немецкому языку. Оценивай честно и точно, избегай грубости и унижения. Формулируй комментарии уважительно и мотивирующе, с конструктивными подсказками. Твоя задача — оценить ответ студента уровня ${level} и вернуть ТОЛЬКО JSON-объект.

— ТОН И СТИЛЬ —
• доброжелательно и поддерживающе.
• Без грубости, сарказма и уничижительных формулировок.
• В "feedback" давай короткое, тактичное и конструктивное замечание (2-3 предложения), по делу, без восклицательных знаков.

— ПРАВИЛА ЯЗЫКА ДЛЯ ПОЛЕЙ JSON —
1) "result": ВСЕГДА на НЕМЕЦКОМ. Одно из значений: ${resultScale}.
2) "feedback": ${isLow ? `ОБЯЗАТЕЛЬНО на языке с ISO-кодом "${outLangISO}".` : 'ОБЯЗАТЕЛЬНО на НЕМЕЦКОМ.'}
3) "mistakes": ВСЕГДА на НЕМЕЦКОМ (лаконичные ключевые слова).
4) "correctedVersion": ВСЕГДА полный исправленный вариант ответа на НЕМЕЦКОМ.

— ФОРМАТ ОТВЕТА —
Только валидный JSON-объект без дополнительного текста до или после:
{
  "result": "...",
  "feedback": "...",
  "mistakes": ["...", "..."],
  "correctedVersion": "..."
}
`.trim()
		const userPrompt = isSpeaking
			? `
Проверь устный ответ студента.
- Уровень: ${level}
- Задание: "${task?.prompt ?? ''}"
- Ожидаемые темы: ${Array.isArray(task?.expectedTopics) ? task.expectedTopics.join(', ') : 'N/A'}
- Ответ студента (транскрипция): "${plainAnswer}"
`.trim()
			: `
Проверь письменный ответ студента.
- Уровень: ${level}
- Задание: "${task?.instruction ?? ''}"
- Ответ студента: "${plainAnswer}"
`.trim()
		const { groqApiKey } = useRuntimeConfig(event)
		const key = String(groqApiKey || process.env.GROQ_API_KEY || '').trim()
		if (!key) return sendError(event, createError({ statusCode: 500, statusMessage: 'GROQ_API_KEY is missing' }))
		if (!key.startsWith('gsk_')) {
			return sendError(event, createError({ statusCode: 500, statusMessage: `GROQ_API_KEY looks wrong (prefix=${key.slice(0,4)})` }))
		}
		const payload = {
			model: 'llama-3.3-70b-versatile',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt }
			],
			temperature: 0.1,
			max_tokens: 900,
			response_format: { type: 'json_object' }
		}
		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), 30000)
		const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${key}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload),
			signal: controller.signal
		}).catch((e) => {
			throw createError({ statusCode: 504, statusMessage: 'groq_fetch_timeout_or_network', data: String(e) })
		})
		clearTimeout(timeout)
		const txt = await r.text().catch(() => '')
		if (!r.ok) {
			return sendError(event, createError({ statusCode: r.status, statusMessage: 'groq_failed', data: txt }))
		}
		let data
		try { data = JSON.parse(txt) } catch {
			return sendError(event, createError({ statusCode: 502, statusMessage: 'bad_json_from_groq', data: txt?.slice?.(0, 400) }))
		}
		const content = data?.choices?.[0]?.message?.content ?? '{}'
		try {
			const json = JSON.parse(content)
			if (typeof json.result !== 'string' || typeof json.feedback !== 'string' || !Array.isArray(json.mistakes) || typeof json.correctedVersion !== 'string') {
				return sendError(event, createError({ statusCode: 502, statusMessage: 'invalid_model_json_shape', data: content?.slice?.(0, 400) }))
			}
			return json
		} catch {
			return sendError(event, createError({ statusCode: 502, statusMessage: 'bad_model_json', data: content?.slice?.(0, 400) }))
		}
	} catch (err) {
		return sendError(event, createError({ statusCode: 500, statusMessage: 'route_crashed', data: String(err) }))
	}
})
