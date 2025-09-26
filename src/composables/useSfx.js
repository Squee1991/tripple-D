import { ref } from 'vue'
const registry = new Map()
const muted = ref(false)

export function useSfx() {
	function load(name, src, volume = 1) {
		registry.set(name, { src, volume })
		const a = new Audio(src)
		a.preload = 'auto'
	}
	async function play(name, opts) {
		if (muted.value) return
		const meta = registry.get(name)
		if (!meta) return
		const a = new Audio(meta.src)
		a.volume = (opts && opts.volume) ?? meta.volume
		if (opts && opts.rate) a.playbackRate = opts.rate
		a.currentTime = 0
		return a.play()
	}
	function setMuted(v) { muted.value = v }
	return { load, play, setMuted, muted }
}
