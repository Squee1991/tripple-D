// composables/useAudio.js
const enabled = ref(true)
const unlocked = ref(false)

let inited = false
let audioCtx = null
let correctEl = null
let wrongEl = null

export const useAudio = () => {
    // Инициализация элементов и чтение сохранённого значения
    const initSound = () => {
        if (inited || !import.meta.client) return

        try {
            const saved = localStorage.getItem('sound-enabled')
            if (saved !== null) {
                enabled.value = saved === 'true'
            }
        } catch {}

        correctEl = new Audio('/sounds/correctAnswer.wav')
        wrongEl = new Audio('/sounds/wrongAnswer.wav')
        correctEl.preload = 'auto'
        wrongEl.preload = 'auto'

        inited = true
    }

    // Тот самый фикс для iOS (вызывается на первый клик/тап по экрану)
    const unlockAudioByUserGesture = async () => {
        if (!import.meta.client || unlocked.value) return
        initSound()

        try {
            const AC = window.AudioContext || window.webkitAudioContext
            audioCtx = audioCtx || new AC()
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume()
            }
            const buffer = audioCtx.createBuffer(1, 1, 22050)
            const src = audioCtx.createBufferSource()
            src.buffer = buffer
            src.connect(audioCtx.destination)
            src.start(0)
        } catch {}

        unlocked.value = true
    }

    const setSoundEnabled = (val) => {
        enabled.value = !!val
        if (import.meta.client) {
            try {
                localStorage.setItem('sound-enabled', String(enabled.value))
            } catch {}
        }
    }

    const toggleSound = () => {
        setSoundEnabled(!enabled.value)
    }

    const playCorrect = () => {
        if (!import.meta.client || !unlocked.value || !enabled.value || !correctEl) return
        correctEl.currentTime = 0
        correctEl.play().catch(() => {})
    }

    const playWrong = () => {
        if (!import.meta.client || !unlocked.value || !enabled.value || !wrongEl) return
        wrongEl.currentTime = 0
        wrongEl.play().catch(() => {})
    }

    return {
        playCorrect,
        playWrong,
        toggleSound,
        setSoundEnabled,
        unlockAudioByUserGesture,
        initSound,
        enabled: readonly(enabled),
        unlocked: readonly(unlocked)
    }
}