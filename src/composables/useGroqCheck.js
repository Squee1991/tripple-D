// src/composables/useGroqCheck.js
export const useGroqCheckHomeWork = async ({ task, answer, level = 'A1', locale = 'de' }) => {
	if (!answer || !answer.trim()) {
		return {
			result: 'keine Antwort',
			feedback: 'Antwort fehlt – 0 Punkte.',
			mistakes: [],
			correctedVersion: ''
		}
	}

	const apiKey = import.meta.env.VITE_GROQ_API_KEY;
	const isSpeaking = !!task?.prompt && !!task?.expectedTopics;
	const isLow = ['A1', 'A2'].includes(String(level).toUpperCase());
	const outLangISO = String(locale || 'de');
	const resultScale = 'ausgezeichnet, fast perfekt, gut, kleine Fehler, mittelmäßig, okay, viele Fehler, muss verbessert werden, schlecht, sehr schlecht, keine Antwort';

	const systemPrompt = `
Ты — строгий, но вежливый и поддерживающий AI-экзаменатор по немецкому языку. Оценивай честно и точно, избегай грубости и унижения. Формулируй комментарии уважительно и мотивирующе, с конструктивными подсказками. Твоя задача — оценить ответ студента уровня ${level} и вернуть ТОЛЬКО JSON-объект.

— ТОН И СТИЛЬ —
• Строго, но доброжелательно и поддерживающе.
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
`.trim();

	const userPrompt = isSpeaking
		? `
Проверь устный ответ студента.
- Уровень: ${level}
- Задание: "${task?.prompt ?? ''}"
- Ожидаемые темы: ${task.expectedTopics?.join(', ') ?? 'N/A'}
- Ответ студента (транскрипция): "${answer}"
`.trim()
		: `
Проверь письменный ответ студента.
- Уровень: ${level}
- Задание: "${task?.instruction ?? ''}"
- Ответ студента: "${answer}"
`.trim();

	try {
		const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'llama-3.3-70b-versatile',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userPrompt }
				],
				temperature: 0.1,
				max_tokens: 900,
				response_format: { type: 'json_object' }
			})
		});

		if (!res.ok) {
			const errorText = await res.text();
			return { error: 'API request failed', details: errorText };
		}

		const data = await res.json();
		const content = data.choices?.[0]?.message?.content ?? '{}';

		try {
			return JSON.parse(content);
		} catch (e) {
			return { error: 'Failed to parse JSON response', raw: content };
		}
	} catch (error) {
		return { error: 'Request failed', details: error.message };
	}
}
