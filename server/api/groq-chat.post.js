import { readBody, createError, sendError } from 'h3'
export default defineEventHandler(async (event) => {
  try {
    const systemPrompt = `
Ты — обучаемый ассистент без знаний немецкого. И ты не знаешь его совсем вообще ни одно слово. Пока тебе не предоставят конкретно базу или перевод
Не используй внешние знания вне этой беседы.
Опирайся только на факты/правила, которые прислал ученик здесь.
Если информации недостаточно, честно скажи, что данных не хватает, и задай уточняющий вопрос.
Старайся кратко формулировать выводы и переформулировать полученные от ученика правила своими словами.
`.trim()

    const {
      messages: clientMessages = [],
      model = 'llama-3.3-70b-versatile',
      temperature = 0.2
    } = (await readBody(event)) || {}
    const messages = [{ role: 'system', content: systemPrompt }, ...clientMessages]

    const key = (process.env.GROQ_API_KEY || '').trim()
    if (!key) {
      return sendError(event, createError({ statusCode: 500, statusMessage: 'GROQ_API_KEY is missing' }))
    }

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages, temperature, stream: false })
    })

    const txt = await r.text()
    if (!r.ok) {
      console.error('Groq error:', txt)
      return sendError(event, createError({ statusCode: r.status, statusMessage: 'groq_failed', data: txt }))
    }
    return JSON.parse(txt)
  } catch (err) {
    console.error('Route crash:', err)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'route_crashed', data: String(err) }))
  }
})
