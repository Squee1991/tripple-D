import { ref } from 'vue'

export function useVoiceRecorder({ onResult, lang = 'de-DE' } = {}) {
	const isRecording = ref(false)
	const transcription = ref('')
	let mediaRecorder = null
	let audioChunks = []

	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		mediaRecorder = new MediaRecorder(stream)
		audioChunks = []

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				audioChunks.push(e.data)
			}
		}

		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
			const base64 = await blobToBase64(audioBlob)

			const res = await fetch('/api/google-stt/recognize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ audioContent: base64, languageCode: lang })
			})

			const data = await res.json()
			transcription.value = data.transcription || ''

			if (onResult) {
				onResult(transcription.value)
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

	const blobToBase64 = (blob) => {
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result)
			reader.readAsDataURL(blob)
		})
	}

	return {
		isRecording,
		transcription,
		startRecording,
		stopRecording
	}
}
