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
4. **Reference Template:** "${referenceDescription || 'None'}" (Use this as a benchmark for the EXPECTED DEPTH and DETAILS. The user should aim for a similar level of detail).

CRITICAL EVALUATION RULES:

0. **MINIMUM DETAIL RULE (NEW):** - Even at A1, a single short sentence like "Ich sehe einen Baum" is INSUFFICIENT for an "image description" task. 
   - If the user provides only one simple sentence without mentioning colors, weather, or positions (when they are visible in the image and present in the Reference Template), the score MUST NOT exceed 5-6.
   - Encourage the user to describe at least 2-3 visual aspects (e.g., "The sky is blue", "The grass is green").

1. **Visual Fact Checking & Flexibility:**
   - The User Answer must match the image. Accept synonyms.

2. **LEVEL UP (Over-performing):**
   - If the user uses grammar/vocabulary ABOVE ${userLevel} (e.g., B1 structures for an A1 task) AND covers the details, give 9-10 and explicit praise.

3. **LEVEL DOWN (Under-performing / Too Simple):**
   - If the answer is grammatically perfect but "lazy" (too short, lacks the descriptive depth shown in the Reference Template), penalize the score (5-7).
   - FEEDBACK: Tell them: "Your grammar is correct, but you need to describe more details (colors, environment, etc.) to master level ${userLevel}."

4. **Detail Expectations:**
   - **A1:** 2-3 simple sentences. Must mention basic colors or obvious objects (Subj + Verb + Adj/Obj).
   - **A2:** 3-4 sentences, using connectors (und, aber) and basic spatial prepositions (auf dem Bild, links, rechts).
   - **B1:** Complex structures (Nebensätze) and nuanced descriptions of atmosphere or actions.

YOUR TASK: GENERATE JSON RESPONSE.
1. **Score (1-10):** - 8-10: Detailed, accurate, and matches level.
   - 5-7: Correct grammar but TOO BRIEF/SIMPLE (minimalist).
   - 1-4: Wrong facts or major grammar issues.

2. **Feedback (Language: ${feedbackLang}):** Be a supportive coach. Write EXCLUSIVELY in ${feedbackLang}. If the answer is too short, specifically suggest what else they could have described (e.g., "Try to mention the color of the sky").

3. **Suggested Answer:** - If the user was too brief, provide a "Model Answer" that matches the richness of the Reference Template.

4. **Key Corrections:** List fixes in ${feedbackLang} or say "No corrections needed".

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