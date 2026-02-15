import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig(event)
        const key = String(config.groqApiKey || process.env.GROQ_API_KEY || '').trim()
        if (!key) return { error: "Нет API ключа (backend)." }

        const body = await readBody(event)
        const { userLevel, userMessage, userLocale, imageUrl, referenceDescription } = body || {}

        if (!userLevel || !userMessage) {
            return { error: "Отсутствуют обязательные параметры (уровень или ответ)." }
        }
        if (!imageUrl) {
            return { error: "ОШИБКА: Фронтенд не прислал поле 'imageUrl'!" }
        }

        const modelId = 'meta-llama/llama-4-scout-17b-16e-instruct'
        const feedbackLang = String(userLocale || 'ru').split('-')[0].trim()

        const systemPrompt = `You are a strict but supportive German language tutor evaluating an image description exercise.
INPUTS:
1. **The Image:** Look at the visual image carefully.
2. **Target Level:** ${userLevel} (A1, A2, or B1).
3. **User Answer:** "${userMessage}"
4. **Reference Template:** "${referenceDescription || 'None'}" (Use this ONLY to understand the expected context/complexity. The user DOES NOT need to match these exact words).

CRITICAL EVALUATION RULES (STRICTLY FOLLOW THESE):
1. **Visual Fact Checking & Flexibility:** - The User Answer must match what is in the image.
   - DO NOT force the user to guess the Reference Template. Accept ANY valid synonyms and any correct visual details they notice. If they describe it in their own words correctly, it is VALID.

2. **LEVEL UP (Over-performing) - REWARD THEM:**
   - If the target is A1 or A2, but the user writes a significantly MORE advanced sentence (e.g., using B1 grammar, rich vocabulary), give a perfect score (9-10).
   - FEEDBACK: Explicitly praise them and tell them their answer is more advanced than the requested ${userLevel} level.

3. **LEVEL DOWN (Under-performing) - ALWAYS PENALIZE:**
   - If the target is A2 or B1, but the answer is TOO SIMPLE for that level (e.g., simple A1 structures for a B1 task), reduce the score to 5-7. Perfect grammar does NOT mean a perfect score if the level is too low.
   - FEEDBACK: Explicitly state that the sentence is grammatically correct but TOO SIMPLE for level ${userLevel}.

4. **Detail Expectations per Level:**
   - **A1:** Short simple sentences (Subj + Verb + Obj).
   - **A2:** Connectors ("und", "aber", "weil") and adjectives.
   - **B1:** STRICTLY expect complex grammar (Nebensätze, Relativsätze) and rich vocabulary.

YOUR TASK: GENERATE JSON RESPONSE.
1. **Score (1-10):**
   - 1-4: Major errors or factually wrong (hallucinations).
   - 5-7: Grammatically correct but TOO SIMPLE for Target Level ${userLevel} (See Rule 3).
   - 8-10: Perfect grammar AND matches or exceeds the complexity of ${userLevel}.

2. **Feedback (Strictly in language code: ${feedbackLang}):**
   - Write as a **NATIVE SPEAKER** of language "${feedbackLang}".
   - Provide context-aware praise or critique based on the Level Up/Level Down rules.

3. **Suggested Answer (CRITICAL LOGIC):**
   - **IF LEVEL UP (Rule 2 applied):** Set the suggestedAnswer to the user's EXACT advanced sentence (fix any minor grammar/spelling typos if they exist, but KEEP their high-level vocabulary and complex structure). DO NOT downgrade their sentence to a simple ${userLevel} template.
   - **IF NORMAL or LEVEL DOWN:** Provide a natural German sentence matching the exact expected complexity of ${userLevel}.

4. **Key Corrections:**
   - List grammar or vocabulary fixes ONLY. If perfect, say "No corrections needed".

OUTPUT JSON FORMAT:
{
  "score": 0,
  "feedback": "Write here in ${feedbackLang} (Native style)...",
  "suggestedAnswer": "German sentence...",
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