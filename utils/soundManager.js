
let unlocked = false
let soundEnabled = true

const saved = localStorage.getItem('sound-enabled')
if (saved !== null) {
	soundEnabled = saved === 'true'
}

export function unlockAudioByUserGesture() {
	if (unlocked) return
	const correct = new Audio('/sounds/correctAnswer.wav')
	const wrong   = new Audio('/sounds/wrongAnswer.wav')
	const tryPlayPause = (el) =>
		el.play().then(() => { el.pause(); el.currentTime = 0 }).catch(() => {})
	Promise.all([tryPlayPause(correct), tryPlayPause(wrong)]).finally(() => {
		unlocked = true
	})
}

export function setSoundEnabled(value) {
	soundEnabled = value
	localStorage.setItem('sound-enabled', value)
}

export function isSoundEnabled() {
	return soundEnabled
}

export const playCorrect = () => {
	if (!unlocked || !soundEnabled) return
	const audio = new Audio('/sounds/correctAnswer.wav')
	audio.play().catch(() => {})
}

export const playWrong = () => {
	if (!unlocked || !soundEnabled) return
	const audio = new Audio('/sounds/wrongAnswer.wav')
	audio.play().catch(() => {})
}
