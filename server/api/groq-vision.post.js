import { readBody } from 'h3'

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
Твоя роль: Внимательный учитель немецкого языка.
ТВОЯ ЗАДАЧА: Оценить описание картинки учеником. 

ТЫ ДОЛЖЕН ОТВЕТИТЬ ТОЛЬКО В ФОРМАТЕ JSON. 
Структура JSON:
{
  "status": "correct" | "warning" | "incorrect",
  "icon": "✅" | "⚠️" | "❌" | "⛔",
  "feedback": "Комментарий на русском",
  "german_sentence": "Идеальное предложение на немецком"
}

АЛГОРИТМ ПРОВЕРКИ (Иди строго по шагам!):

1. ПРОВЕРКА НА МУСОР / ЧУЖОЙ ЯЗЫК / Цифры / Различные иероглифы / Просто цифры
   Если ввод: "1", "123", "!@#$%^&*()_+|\?.<,", "...", "фыва", "Привет" (русский), "Hello".
   -> Icon: "⛔"
   -> Feedback: "Пожалуйста, опиши картинку словами."
   -> German_sentence: "[Полное предложение]"

2. ПРОВЕРКА НА КРАТКОСТЬ (1-2 слова)
   Если ввод типа "Mann", "Hund", "Schnee" (верно, но мало).
   -> Icon: "⚠️"
   -> Feedback: "Верно, это [объект]. Но давай составим полное предложение: Кто + Что делает или если кто на чем сидит"
   -> German_sentence: "[Полное предложение]"

3. ПРОВЕРКА СЮЖЕТА (ГЛАВНЫЙ СМЫСЛ)
   Если предложение полное, но не про то (на фото лыжник, пишут про пловца).
   -> Icon: "❌"
   -> Feedback: "Неверно. На фото [кто на самом деле], а не [кто в ответе]."

4. ПРОВЕРКА ДЕТАЛЕЙ (ЕСЛИ УЧЕНИК ИХ УКАЗАЛ)
   Если ученик описывает цвета, одежду, фон, эмоции (например: "красная шапка", "грустный кот"):
   - Сравни это с картинкой.
   - Если деталь ВЕРНАЯ: Обязательно похвали! (Feedback: "Отлично! Ты верно подметил красную шапку/синее небо.")
   - Если деталь НЕВЕРНАЯ (пишет "зеленая куртка", а она синяя): 
     -> Icon: "⚠️"
     -> Feedback: "Сюжет верный, но ошибка в деталях: куртка на самом деле синяя, а не зеленая."

5. ПРОВЕРКА ГРАММАТИКИ
   - Ошибки (артикли, окончания, порядок слов) -> Icon: "⚠️" -> Feedback: "Смысл верный, но поправь грамматику: [ошибка]."
   - Идеально -> Icon: "✅" -> Feedback: "Отличная работа! Всё написано верно."

ПРИМЕРЫ:

[Ввод: "Ein Mann."] -> {"status":"warning", "icon":"⚠️", "feedback":"Это мужчина, верно. Но что он делает?", "german_sentence":"Ein Mann liest ein Buch."}
[Ввод: "Der Mann in der roten Jacke fährt Ski." (На фото куртка СИНЯЯ)] -> 
{"status":"warning", "icon":"⚠️", "feedback":"Ты правильно понял сюжет, но куртка у него синяя (blaue Jacke), а не красная.", "german_sentence":"Der Mann in der blauen Jacke fährt Ski."}
[Ввод: "Ein Mann mit schwarzem Hut liest." (На фото есть черная шляпа)] -> 
{"status":"correct", "icon":"✅", "feedback":"Супер! Ты даже заметил черную шляпу. Всё верно.", "german_sentence":"Ein Mann mit schwarzem Hut liest."}
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
            temperature: 0,
            max_tokens: 450,
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
            return { error: `Ошибка парсинга ответа API: ${rawText}` }
        }
    } catch (err) {
        return { error: `CRASH: ${err.message}` }
    }
})