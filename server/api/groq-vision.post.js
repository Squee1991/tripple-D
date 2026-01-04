    import { readBody, createError } from 'h3'

    export default defineEventHandler(async (event) => {
        try {
            const config = useRuntimeConfig(event)
            const key = String(config.groqApiKey || '').trim()
            if (!key) return { error: "Нет API ключа." }
            const body = await readBody(event)
            const { message, image } = body || {}
            if (!image) return { error: "Картинка не пришла." }
            const modelId = 'meta-llama/llama-4-scout-17b-16e-instruct'
            const systemPrompt = `
Твоя роль: Учитель немецкого языка.

ПРИНЦИП ОЦЕНКИ (БАЛАНС ДЕТАЛЕЙ):
1. Оценивай СЮЖЕТ, а не мелкие детали.
   - Если на фото "Человек с котом за ноутбуком", а ученик пишет просто "Человек" -> Статус "⚠️ Упомянуты не все главные объекты." (Это слишком обще).
   - Если ученик пишет "Человек сидит с котом" (но забыл цвет футболки) -> Это ОТЛИЧНО по смыслу.
2. Игнорируй ошибки в цветах, брендах и фоне, если они не влияют на смысл.
3. Бред ("123") -> "❌ Неверно."

ГЕНЕРАЦИЯ ПРАВИЛЬНОГО ОТВЕТА:
В строке "🇩🇪 Правильно" напиши ОДНО естественное предложение, которое описывает ВСЮ сцену целиком, но без фанатизма.
- Плохо: "Мужчина в синей майке сидит на деревянном стуле и держит серую кошку." (Перегружено).
- Хорошо: "Ein Mann sitzt mit seiner Katze am Laptop." (Идеально: названы главные герои и действие).

ФОРМАТ ОТВЕТА (Только 2 строки, без жирного шрифта):
СТРОКА 1: [Статус: "❌ Неверно", "⚠️ Суть верна, но...", "⚠️ Упущены важные объекты" или "✅ Отлично"]
СТРОКА 2: 🇩🇪 Правильно: [Твоя идеальная версия предложения]
`.trim()
            const payload = {
                model: modelId,
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: message || 'Was ist das?' },
                            { type: 'image_url', image_url: { url: image } }
                        ]
                    }
                ],
                temperature: 0.1,
                max_tokens: 450
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
                const content = json.choices?.[0]?.message?.content
                if (content) return { text: content }
                return { error: "Пустой ответ", debug: json }
            } catch (e) {
                return { error: `Ошибка парсинга: ${rawText}` }
            }

        } catch (err) {
            return { error: `CRASH: ${err.message}` }
        }
    })