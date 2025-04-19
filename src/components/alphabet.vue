<template>
	<div class="alphabet" v-if="alphabet">
		<div
			v-for="(item, key) in alphabet"
			:key="key"
			class="letter"
			:class="{ active: activeLetter === item.upper }"
			@click="speak(item.upper)"
		>
			<span class="upper">{{ item.upper }}</span>
			<span class="lower">{{ item.lower }}</span>
			<span class="icon" aria-hidden="true">
				<svg class="speaker-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M5 9v6h4l5 5V4l-5 5H5zm11.5 3a3.5 3.5 0 0 0-2.45-3.35v6.7A3.5 3.5 0 0 0 16.5 12zm0-6.5v2.03A6.005 6.005 0 0 1 19 12a6.005 6.005 0 0 1-2.5 4.47v2.03A8.003 8.003 0 0 0 21 12a8.003 8.003 0 0 0-3.5-6.5z"
					/>
				</svg>
			</span>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'

	const alphabet = ref(null)
	const germanVoice = ref(null)
	const activeLetter = ref(null)

	onMounted(async () => {
		const res = await fetch('/alphabet.json')
		alphabet.value = await res.json()

		await new Promise(resolve => {
			const voices = speechSynthesis.getVoices()
			if (voices.length) resolve()
			else speechSynthesis.onvoiceschanged = resolve
		})

		const voices = speechSynthesis.getVoices()
		germanVoice.value = voices.find(v => v.lang.startsWith('de'))
	})

	function speak(letter) {
		if (!germanVoice.value) return

		activeLetter.value = letter

		const utterance = new SpeechSynthesisUtterance(letter)
		utterance.voice = germanVoice.value
		utterance.lang = 'de-DE'
		utterance.onend = () => {
			activeLetter.value = null
		}

		speechSynthesis.cancel()
		speechSynthesis.speak(utterance)
	}
</script>

<style scoped>
	.alphabet {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
		gap: 12px;
		padding: 20px;
	}

	.letter {
		text-align: center;
		font-size: 1.5rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 8px;
		background-color: #f9f9f9;
		cursor: pointer;
		transition: background 0.2s ease, transform 0.2s ease;
		user-select: none;
	}

	.letter:hover {
		background-color: #e0f2f1;
	}

	.letter.active {
		background-color: #c8e6c9;
		border-color: #66bb6a;
		transform: scale(1.05);
	}

	.upper {
		display: block;
		font-weight: bold;
	}

	.lower {
		font-size: 1rem;
		color: #666;
	}

	.icon {
		margin-top: 6px;
		display: flex;
		justify-content: center;
	}

	.speaker-icon {
		width: 20px;
		height: 20px;
		fill: #666;
		transition: transform 0.2s ease, fill 0.2s ease;
	}

	.letter.active .speaker-icon {
		transform: scale(1.2);
		fill: #388e3c;
	}
</style>
