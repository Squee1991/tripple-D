let unlocked = false
let enabled = true
let inited = false
let audioCtx = null
let correctEl, wrongEl

function isClient() { return typeof window !== 'undefined' }

export function initSound() {
	if (inited) return
	if (isClient()) {
		try {
			const saved = localStorage.getItem('sound-enabled')
			if (saved !== null) enabled = saved === 'true'
		} catch {}
		correctEl = new Audio('/sounds/correctAnswer.wav')
		wrongEl   = new Audio('/sounds/wrongAnswer.wav')
		correctEl.preload = 'auto'
		wrongEl.preload   = 'auto'
	}
	inited = true
}

export function isSoundEnabled() { return enabled }

export function setSoundEnabled(v) {
	enabled = !!v
	if (isClient()) { try { localStorage.setItem('sound-enabled', String(enabled)) } catch {} }
}

export async function unlockAudioByUserGesture() {
	if (!isClient() || unlocked) return
	initSound()
	try {
		const AC = window.AudioContext || window.webkitAudioContext
		audioCtx = audioCtx || new AC()
		if (audioCtx.state === 'suspended') await audioCtx.resume()
		const buffer = audioCtx.createBuffer(1, 1, 22050)
		const src = audioCtx.createBufferSource()
		src.buffer = buffer
		src.connect(audioCtx.destination)
		src.start(0)
	} catch {}
	unlocked = true
}

export function playCorrect() {
	if (!isClient() || !unlocked || !enabled) return
	correctEl.currentTime = 0
	correctEl.play().catch(() => {})
}

export function playWrong() {
	if (!isClient() || !unlocked || !enabled) return
	wrongEl.currentTime = 0
	wrongEl.play().catch(() => {})
}
