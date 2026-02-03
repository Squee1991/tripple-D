import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig(event)
        const key = String(config.groqApiKey || process.env.GROQ_API_KEY || '').trim()
        if (!key) return { error: "Нет API ключа (backend)." }
        const body = await readBody(event)
        const { userLevel, userMessage, userLocale, imageUrl } = body || {}
        if (!userLevel || !userMessage) {
            return { error: "Отсутствуют обязательные параметры (уровень или ответ)." }
        }
        if (!imageUrl) {
            return { error: "ОШИБКА: Фронтенд не прислал поле 'imageUrl'!" }
        }
        const modelId = 'meta-llama/llama-4-scout-17b-16e-instruct'
        const feedbackLang = String(userLocale || 'ru').split('-')[0].trim()
        const systemPrompt = `You are a supportive German language tutor evaluating an image description exercise.
INPUTS:
1. **The Image:** You have access to the visual image. Look at it carefully.
2. **Target Level:** ${userLevel} (A1, A2, or B1).
3. **User Answer:** "${userMessage}"
CRITICAL EVALUATION RULES (STRICTLY FOLLOW THESE):
1. **Visual Fact Checking:** Look at the image directly.
   - The User Answer must be visually correct based on what YOU see in the image.
   - **Synonyms:** Accept valid synonyms (e.g., "Computer" = "Laptop", "Junge" = "Mann").
   - **Details:** If the user notices a small detail (color, background object) that is visible -> IT IS CORRECT.
2. **Flexibility:** The user DOES NOT need to guess specific words. If the sentence makes sense and describes the image correctly, it is VALID.
3. **Level Up Rule:** If a user writes a sentence that is MORE complex than the Target Level (e.g., B1 grammar for an A1 task), DO NOT PENALIZE. Give a perfect score (10). Only penalize if the grammar is broken.
4. **Detail Expectations:**
   - **Level A1:** Be lenient. Accept simple Subject + Verb + Object. Missing background details are OKAY.
   - **Level A2:** Expect slightly more detail (adjectives, simple connectors like "und", "aber").
   - **Level B1:** Be strict about details and complexity (Nebensätze).
5. **No Philosophy:** Be direct. Focus on Grammar, Vocabulary, and Visual Facts.
YOUR TASK: GENERATE JSON RESPONSE.
1. **Score (1-10):**
   - 1-4: Major grammatical errors or factually wrong (describing something NOT in the image).
   - 5-7: Grammatically correct but too simple for the requested level.
   - 8-10: Grammatically correct AND matches the image. (Perfect grammar + Correct Fact = 10).

2. **Feedback (Strictly in language code: ${feedbackLang}):**
   - **IMPORTANT:** Write as a **NATIVE SPEAKER** of language "${feedbackLang}". Use natural, flowing language. Avoid awkward literal translations.
   - Confirm if the sentence is grammatically correct.
   - Praise the user if they noticed good visual details.
   - Be concise.
3. **Suggested Answer:**
   - Create a NATURAL German sentence based on the IMAGE, adapted to ${userLevel}.
   - **A1:** Short, simple (Subj + Verb + Obj).
   - **A2:** Connected with "und", "aber". Use adjectives.
   - **B1:** Use complex structure (relative clauses, "weil", "während").
4. **Key Corrections:**
   - List ONLY grammar fixes. If the user's sentence was correct, leave this empty or say "No corrections needed".

OUTPUT JSON FORMAT:
{
  "score": 0,
  "feedback": "Write here in ${feedbackLang} (Native style)...",
  "suggestedAnswer": "German sentence matching level ${userLevel}...",
  "keyCorrections": ["correction 1"]
}`
        const payload = {
            model: modelId,
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: [
                        {
                            type: "text",
                            text: `Evaluate this German answer for level ${userLevel}: "${userMessage}"`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }
            ],
            temperature: 0.2,
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
                    const cleanJson = contentString.replace(/```json|```/g, '').trim();
                    const parsedData = JSON.parse(cleanJson);
                    return { data: parsedData }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    return { text: contentString, isStructured: false }
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