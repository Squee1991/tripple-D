import { readBody } from 'h3'
import { SpeechClient } from '@google-cloud/speech'
import path from 'path'
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	if (!body?.audioContent) {
		return { error: 'Нет аудио данных' }
	}
	const keyFilePath = path.join(process.cwd(), 'service-account.json')
	const client = new SpeechClient({
		keyFilename: keyFilePath
	})
	const audioBytes = body.audioContent.replace(/^data:audio\/\w+;base64,/, '')
	const audio = {
		content: audioBytes
	}
	const config = {
		encoding: 'WEBM_OPUS',
		sampleRateHertz: 48000,
		languageCode: 'de-DE'
	}

	const request = { audio, config }

	const [response] = await client.recognize(request)

	const transcription = response.results
		?.map(result => result.alternatives?.[0]?.transcript)
		.filter(Boolean)
		.join('\n')

	return { transcription }
})
