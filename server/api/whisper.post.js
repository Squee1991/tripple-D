import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event)
		const rawKey = config.groqApiKey || process.env.GROQ_API_KEY || ''

		if (!rawKey) {
			console.error("❌ WHISPER: Нет API ключа!")
			setResponseStatus(event, 500)
			return { error: 'Server Error: GROQ_API_KEY missing' }
		}

		const body = await readBody(event)
		const { audioContent, lang } = body || {}

		if (!audioContent) {
			setResponseStatus(event, 400)
			return { error: 'No audio content' }
		}

		const base64Str = audioContent.includes('base64,')
			? audioContent.split('base64,')[1]
			: audioContent

		const buffer = Buffer.from(base64Str, 'base64')
		const formData = new FormData()
		const blob = new Blob([buffer], { type: 'audio/webm' })
		formData.append('file', blob, 'voice.webm')
		formData.append('model', 'whisper-large-v3-turbo')
		if (lang) {
			formData.append('language', String(lang).substring(0, 2))
		}
		const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
			method: 'POST',
			headers: { Authorization: `Bearer ${rawKey}` },
			body: formData
		})

		if (!response.ok) {
			const errText = await response.text()
			console.error(`❌ Groq API Error: ${errText}`)
			setResponseStatus(event, response.status)
			return { error: errText }
		}
		const data = await response.json()
		return { text: data.text || '' }

	} catch (e) {
		console.error("❌ SERVER CRASH:", e)
		setResponseStatus(event, 500)
		return { error: e.message }
	}
})