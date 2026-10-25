let unlocked = false
let enabled = true
let inited = false
let audioCtx = null
let correctEl = null
let wrongEl = null
let levelCompletedEl = null

function isClient() { return typeof window !== 'undefined' }

export function initSound() {
	if (inited || !isClient()) return
	try {
		const saved = localStorage.getItem('sound-enabled')
		if (saved !== null) enabled = saved === 'true'
	} catch {}
	correctEl        = new Audio('/sounds/correct.wav')
	wrongEl          = new Audio('/sounds/mistake.wav')
	levelCompletedEl = new Audio('/sounds/level_completed.wav')
	correctEl.preload        = 'auto'
	wrongEl.preload          = 'auto'
	levelCompletedEl.preload = 'auto'
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
			[correctEl, wrongEl, levelCompletedEl].forEach(el => {
			if (el) {
				const p = el.play()
				if (p && typeof p.then === 'function') {
					p.then(() => {
						el.pause()
						el.currentTime = 0
					}).catch(() => {})
				}
			}
		})
	} catch {}
	unlocked = true
}

// Высота звука: 1 — обычная, больше — выше (звук играется быстрее)
function setCorrectPitch(rate) {
	correctEl.preservesPitch = false
	correctEl.mozPreservesPitch = false
	correctEl.webkitPreservesPitch = false
	correctEl.playbackRate = rate
}

export function playCorrect() {
	if (!isClient() || !enabled) return
	initSound()
	if (!correctEl) return
	setCorrectPitch(1)
	correctEl.currentTime = 0
	correctEl.play().catch(() => {})
}

// Правильный ответ в серии: каждый следующий звучит чуть выше (до 12-го шага)
const RISING_PITCH_STEP = 0.05
const RISING_PITCH_MAX_STEPS = 12

export function playCorrectRising(streak) {
	if (!isClient() || !enabled) return
	initSound()
	if (!correctEl) return
	const step = Math.min(Math.max(streak, 0), RISING_PITCH_MAX_STEPS)
	setCorrectPitch(1 + step * RISING_PITCH_STEP)
	correctEl.currentTime = 0
	correctEl.play().catch(() => {})
}

export function playWrong() {
	if (!isClient() || !enabled) return
	initSound()
	if (!wrongEl) return
	wrongEl.currentTime = 0
	wrongEl.play().catch(() => {})
}

export function playLevelCompleted() {
	if (!isClient() || !enabled) return
	initSound()
	if (!levelCompletedEl) return
	levelCompletedEl.currentTime = 0
	levelCompletedEl.play().catch((err) => {
		console.error('Ошибка воспроизведения level_completed:', err)
	})
}
