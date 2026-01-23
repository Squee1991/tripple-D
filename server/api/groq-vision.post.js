import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig(event)
        const key = String(config.groqApiKey || '').trim()
        if (!key) return { error: "Нет API ключа." }
        const body = await readBody(event)
        const { referenceDescription, userLevel, userMessage, userLocale } = body || {}

        if (!referenceDescription || !userLevel || !userMessage) {
            return { error: "Отсутствуют необходимые параметры." }
        }

        const modelId = 'llama-3.3-70b-versatile'
        const feedbackLang = String(userLocale || 'ru').trim()
        const systemPrompt = `You are a German teacher assistant that evaluates picture descriptions.

You receive:
- A reference description of the picture (level-appropriate)
- The user's German level (A1–B1)
- The user's answer

Your task:
1) Score the user's answer from 1 to 10 based on:
   - Alignment with the picture content (use the reference description as ground truth)
   - Grammatical correctness
   - Vocabulary appropriate for the given level
   - Sentence structure and clarity of expression

2) Provide constructive feedback in the user's language (locale: ${feedbackLang}). Respond ONLY in that language in the feedback (except for German examples).

3) Suggest an improved version of the user's answer, tailored to the user's level. The suggested version MUST be in German.

4) List 2–3 specific points for improvement.

IMPORTANT: Never mention or quote the reference description explicitly.

ALWAYS respond strictly in JSON with the following shape:
{
  "score": <1-10>,
  "feedback": "<Feedback in the user's language>",
  "suggestedAnswer": "<Improved German sentence>",  
  "keyCorrections": ["<Point 1>", "<Point 2>", "<Point 3>"]
}`

        const payload = {
            model: modelId,
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: `Niveau des Benutzers: ${userLevel}

Referenzbeschreibung des Bildes:
${referenceDescription}

Antwort des Benutzers:
${userMessage}`
                }
            ],
            temperature: 0,
            max_tokens: 600,
            response_format: { type: "json_object" }
        }
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const rawText = await response.text()
        try {
            const json = JSON.parse(rawText)
            if (json.error) return { error: `GROQ ERROR: ${json.error.message}` }
            const contentString = json.choices?.[0]?.message?.content
            if (contentString) {
                try {
                    const parsedData = JSON.parse(contentString);
                    return { data: parsedData }
                } catch (e) {
                    return { text: contentString }
                }
            }
            return { error: "Пустой ответ", debug: json }
        } catch (e) {
            return { error: `Ошибка ответа API: ${rawText}` }
        }
    } catch (err) {
        return { error: `CRASH: ${err.message}` }
    }
})
