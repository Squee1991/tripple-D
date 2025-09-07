import { readBody } from 'h3'

export default async function (event) {
	const body = await readBody(event)
	const { audioContent, languageCode, lang } = body || {}

	const rawKey = (process.env.GROQ_API_KEY || '').trim()
	if (!rawKey) {
		event.node.res.statusCode = 500
		return { error: 'GROQ_API_KEY is missing on server' }
	}
	if (!rawKey.startsWith('gsk_')) {
		event.node.res.statusCode = 500
		return { error: `GROQ_API_KEY looks wrong (prefix=${rawKey.slice(0,4)})` }
	}

	if (!audioContent) {
		event.node.res.statusCode = 400
		return { error: 'Нет аудио данных' }
	}

	const langRaw = lang || languageCode || 'de'
	const langNorm = String(langRaw).split('-')[0].toLowerCase()

	const base64 = audioContent.includes(',') ? audioContent.split(',')[1] : audioContent
	const buffer = Buffer.from(base64, 'base64')

	const form = new FormData()
	form.append('file', new Blob([buffer], { type: 'audio/webm' }), 'audio.webm')
	form.append('model', 'whisper-large-v3-turbo')
	form.append('language', langNorm)

	const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
		method: 'POST',
		headers: { Authorization: `Bearer ${rawKey}` },
		body: form
	})

	if (!response.ok) {
		const errText = await response.text()
		event.node.res.statusCode = response.status
		return { error: `Whisper error: ${errText}` }
	}

	const data = await response.json()
	const text = data?.text || ''
	return { text, transcription: text }
}
