const HF_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	if (!body.message || !body.topic) {
		return 'Некорректный запрос'
	}

	const config = useRuntimeConfig()
	const token = config.HUGGINGFACE_API_KEY

	const res = await fetch(HF_API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			inputs: `Ты помощник по изучению языка. Тема: ${body.topic}. Вопрос пользователя: ${body.message}`
		})
	})

	const data = await res.json()

	if (Array.isArray(data) && data[0]?.generated_text) {
		return data[0].generated_text
	}

	if (data?.error) {
		return `⚠️ Ошибка: ${data.error}`
	}

	return '❗ Что-то пошло не так'
})