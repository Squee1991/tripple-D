<script setup>
	import { ref, watch, computed } from 'vue'
	import { userAuthStore } from '../store/authStore.js'
	import { useGuessWordStore } from '../store/guesStore.js'

	const authStore = userAuthStore()
	const guessStore = useGuessWordStore()
	const rating = ref([])
	const isLoading = ref(true)

	const isInLeaderboard = computed(() =>
		rating.value.some(r => r.name === authStore.name)
	)

	async function loadAndSyncStatistics() {
		isLoading.value = true

		await guessStore.loadGuessProgress()
		rating.value = await guessStore.loadLeaderboard()
		isLoading.value = false
	}

	async function addToLeaderboard() {
		if (!Array.isArray(guessStore.guessedWords) || guessStore.guessedWords.length === 0) {
			alert('Чтобы попасть в таблицу рейтинга, надо отгадать хотя бы 1 слово!')
			return
		}
		await guessStore.saveToLeaderboard(authStore.name, guessStore.guessedWords.length)
		rating.value = await guessStore.loadLeaderboard()
	}

	watch(() => authStore.name, (newName) => {
		if (newName) {
			loadAndSyncStatistics()
		}
	}, { immediate: true })


	watch(() => guessStore.guessedWords.length,
		async (newLen, oldLen) => {
			if (newLen !== oldLen) {
				rating.value = await guessStore.loadLeaderboard()
			}
		}
	)

</script>


<template>
	<div> Тут будет таблица лидеров по угадываю слов это будет имя можно ещё аватар и ещё можно  что то ещё</div>
	<div>
		<button v-if="!isInLeaderboard" @click="addToLeaderboard">
			Попасть в таблицу рейтинга
		</button>
		<div v-if="rating.length">
			<h2>Таблица рейтинга угаданных слов</h2>
			<ul>
				<li
					v-for="r in rating"
					:key="r.name"
					:style="{ fontWeight: r.name === authStore.name ? 'bold' : 'normal' }"
				>
					{{ r.name }} — {{ r.guessed }} слов
				</li>
			</ul>
		</div>
	</div>
</template>
