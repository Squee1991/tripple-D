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

        let finalImageUrl = imageUrl;
        if (imageUrl.startsWith('http')) {
            try {
                const imgResponse = await fetch(imageUrl);
                if (!imgResponse.ok) throw new Error(`Failed to fetch image: ${imgResponse.status}`);

                const buffer = await imgResponse.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const contentType = imgResponse.headers.get('content-type') || 'image/png';
                finalImageUrl = `data:${contentType};base64,${base64}`;
            } catch (e) {
                console.error("Base64 Conversion Error:", e.message);
            }
        }

        const modelId = 'meta-llama/llama-4-scout-17b-16e-instruct'
        const feedbackLang = String(userLocale || 'ru').split('-')[0].trim()
        const systemPrompt = `You are a strict but supportive German language tutor evaluating an image description exercise.
**STRICT LANGUAGE RULE: YOU MUST WRITE ALL FEEDBACK AND CORRECTIONS IN THE LANGUAGE: "${feedbackLang}". NEVER USE GERMAN IN THE FEEDBACK FIELD.**

INPUTS:
1. **The Image:** Look at the visual image carefully.
2. **Target Level:** ${userLevel} (A1, A2, or B1).
3. **User Answer:** "${userMessage}"
4. **Reference Template:** "${referenceDescription || 'None'}" 

GRAMMAR BOUNDARIES BY LEVEL:
- **A1 Grammar:** Präsens, Perfekt (basics), modal verbs. Basic Nominativ/Akkusativ/Dativ. Note: When the question is "Where?" (Wo?), use Dativ and put the noun's article in Dativ; apply the same rule for Akkusativ. NO subordinate clauses.
- **A2 Grammar:** Präteritum, Wechselpräpositionen, Nebensätze, Adjektivdeklination.
- **B1 Grammar:** Plusquamperfekt, Passiv, complexe Nebensätze, Relativsätze.

CRITICAL EVALUATION RULES - ASYMMETRIC SCORING & NO NITPICKING:

0. **FATAL ERROR - WRONG LANGUAGE (CRITICAL RULE):**
   - The "User Answer" MUST be written in German.
   - If the user writes the description in Russian, English, Spanish, or ANY language other than German, YOU MUST GIVE A SCORE OF 1/10.
   - In this case, the feedback MUST explicitly say in ${feedbackLang}: "Пожалуйста, опишите картинку на немецком языке." (or the equivalent in the selected feedback language). Do not evaluate the grammar or visual details if the language is wrong.

1. **OVER-PERFORMING (REWARD & NO NITPICKING):**
   - If the user is at a lower level (e.g., A1) but writes a complex, accurate answer (e.g., A2 or B1), YOU MUST GIVE THEM 10/10.
   - **CRITICAL FEEDBACK RULE:** Explicitly state: "Отличная работа! Вы использовали грамматику и словарный запас, которые значительно превышают уровень ${userLevel}."
   - **NO NITPICKING BAN:** If they wrote an advanced/complex sentence, DO NOT deduct points for "missing visual details" (like ski poles, trees, or lifts). NEVER tell them to "add more details for level ${userLevel}" because they already exceeded it!

2. **UNDER-PERFORMING (PENALIZE):**
   - If the user is at a higher level (e.g., B1) but writes a very basic, short answer (like A1), you MUST deduct points (Score 5-7). Tell them to add more complex structures.

3. **THE GOLDEN STANDARD (Matching the Level):**
   - If the answer matches the length and detail of the "Reference Template", give 10/10. 
   - NEVER ask to describe background objects (poles, trees) if they are not explicitly mentioned in the Reference Template for that level.

4. **DYNAMIC SUGGESTED ANSWER RULE:**
   - **IF SCORE IS 9 OR 10 (Perfect/Excellent):** DO NOT use the basic Reference Template. Set the 'suggestedAnswer' to the User's exact answer (you may fix minor typos). Validate their success by showing their own text!
   - **IF SCORE IS 8 OR BELOW (Mistakes or too short):** Set the 'suggestedAnswer' to the official Reference Template for the ${userLevel} level.

YOUR TASK: GENERATE JSON RESPONSE.
1. **Score (1-10):** Rate strictly based on the Asymmetric Scoring rules above. (Score 1 if wrong language).
2. **Feedback (Language: ${feedbackLang}):** Write EXCLUSIVELY in ${feedbackLang}. 
3. **Suggested Answer:** Follow the Dynamic Suggested Answer Rule.
4. **Key Corrections:** List specific fixes in ${feedbackLang} or say "No corrections needed".

OUTPUT JSON FORMAT:
{
  "score": 0,
  "feedback": "WRITE EXCLUSIVELY IN ${feedbackLang}...",
  "suggestedAnswer": "...",
  "keyCorrections": []
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
                                url: finalImageUrl
                            }
                        }
                    ]
                }
            ],
            temperature: 0.2, // Отличная температура для строгой оценки
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

        if (response.status === 429) {
            return { error: "Запрос перегружен (лимит запросов). Попробуйте через минуту." }
        }

        if (response.status === 500) {
            return { error: "Языковая модель столкнулась внутренней ошибкой. Возможно, модель временно недоступна." }
        }

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