import { ref } from 'vue'

export function useVoiceRecorder({ onResult, lang = 'de' } = {}) {
	const isRecording = ref(false)
	const transcription = ref('')
	let mediaRecorder = null
	let audioChunks = []
	let stream = null

	const startRecording = async () => {
		stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
		audioChunks = []

		mediaRecorder.ondataavailable = (e) => {
			if (e.data && e.data.size > 0) audioChunks.push(e.data)
		}

		mediaRecorder.onstop = async () => {
			try {
				const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
				const base64 = await blobToBase64(audioBlob)
				const res = await fetch('/api/whisper', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ audioContent: base64, lang })
				})

				const data = await res.json()
				transcription.value = data.text || ''

				onResult?.(transcription.value)
			} catch (e) {
				console.error('Whisper error:', e)
				transcription.value = ''
			} finally {
				// освободим микрофон
				stream?.getTracks()?.forEach(t => t.stop())
				stream = null
			}
		}

		mediaRecorder.start()
		isRecording.value = true
	}

	const stopRecording = () => {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop()
			isRecording.value = false
		}
	}

	const blobToBase64 = (blob) =>
		new Promise((resolve) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result)
			reader.readAsDataURL(blob)
		})

	return {
		isRecording,
		transcription,
		startRecording,
		stopRecording
	}
}
