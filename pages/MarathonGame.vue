<template>
	<div class="game-page-layout">
		<div v-if="!gameStore.gameReady" class="not-ready-container">
			<h1>Пожалуйста, подождите</h1>
			<p>Перенаправляем вас на страницу подготовки...</p>
		</div>
		<template v-else>
			<header class="game-header">
				<div class="stats-bar">
					<div class="stat-item">
						Стрик: <strong>{{ gameStore.sessionStreak }}</strong>
						(Рекорд: {{ currentDifficultyRecord }})
					</div>
					<div class="stat-item">
						Жизни: <span>❤️ × {{ gameStore.lives }}</span>
					</div>
					<div class="stat-item" v-if="gameStore.levelSettings.timer">
						Таймер: <strong>{{ gameStore.timer }}</strong>
					</div>
				</div>
			</header>

			<main class="game-content">
				<div v-if="gameStore.gameActive && gameStore.currentWord" class="game-area">
					<div class="word-display" :class="feedbackClass">
						<h1>{{ gameStore.currentWord.de }}</h1>
						<p v-if="feedback" class="feedback-word">{{ gameStore.currentWord.de }}</p>
						<p v-else class="task">Какой артикль у этого слова?</p>
					</div>
					<div class="actions" :class="{ 'disabled': isChecking }">
						<button @click="handleArticleChoice('der')" class="article-btn der">der</button>
						<button @click="handleArticleChoice('die')" class="article-btn die">die</button>
						<button @click="handleArticleChoice('das')" class="article-btn das">das</button>
					</div>
				</div>
				<div v-else class="game-over">
					<h1 class="game-over__title">Игра окончена!</h1>
					<p class="game-over__streak-info">Ваш итоговый стрик: {{ gameStore.sessionStreak }}</p>

					<p v-if="gameStore.sessionStreak > 0 && gameStore.sessionStreak >= currentDifficultyRecord"
					   class="game-over__new-record">
						🎉 Новый рекорд!
					</p>
					<p v-else class="game-over__best-score">
						Ваш лучший результат: {{ currentDifficultyRecord }}
					</p>

					<button @click="router.push('/prepare-marathon')" class="game-over__retry-btn">Попробовать снова
					</button>
				</div>
			</main>
		</template>
	</div>
</template>

<script setup>
	import {ref, computed, onMounted, onUnmounted} from 'vue';
	import {useRouter} from 'vue-router';
	import {useGameStore} from '../store/marafonStore.js';

	const gameStore = useGameStore();
	const router = useRouter();
	const feedback = ref(null);
	const isChecking = ref(false)
	const currentDifficultyRecord = computed(() => {
		if (gameStore.personalBests && gameStore.difficulty) {
			return gameStore.personalBests[gameStore.difficulty] || 0;
		}
		return 0;
	});

	const feedbackClass = computed(() => {
		if (feedback.value === 'correct') return 'feedback-correct';
		if (feedback.value === 'incorrect') return 'feedback-incorrect';
		return '';
	});

	function handleArticleChoice(chosenArticle) {
		if (isChecking.value) return;
		isChecking.value = true;
		const isCorrect = chosenArticle === gameStore.currentWord.article;
		feedback.value = isCorrect ? 'correct' : 'incorrect';
		setTimeout(() => {
			gameStore.submitAnswer(isCorrect);
			feedback.value = null;
			isChecking.value = false;
		}, 800);
	}

	watch(() => gameStore.gameReady, (isReady) => {
		if (!isReady) {
			setTimeout(() => {
				router.push('/prepare');
			}, 1500);
		}
	}, {immediate: true});

	onMounted(() => {
		if (gameStore.gameReady && !gameStore.gameActive) {
			gameStore.startNewRound();
		}
	});

	onUnmounted(() => {
		gameStore.stopTimer();
	});
</script>

<style scoped>
	.game-page-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
		background-color: #f4f7f6;
	}

	.game-header {
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.game-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}

	.game-area {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stats-bar {
		display: flex;
		justify-content: space-around;
		align-items: center;
		max-width: 800px;
		margin: 0 auto;
		padding: 15px 20px;
		width: 100%;
		gap: 15px;
	}

	.stat-item {
		font-size: 1.2em;
		color: #555;
		font-weight: 500;
		text-align: center;
	}

	.stat-item strong {
		color: #007bff;
		font-weight: 700;
	}

	.stat-item span {
		font-weight: bold;
	}

	.word-display {
		padding: 20px;
		margin-bottom: 40px;
		transition: transform 0.3s ease;
		text-align: center;
	}

	.word-display h1 {
		font-size: 6em;
		font-weight: 700;
		color: #333;
		margin: 0;
		transition: color 0.3s;
	}

	.word-display .task {
		font-size: 1.3em;
		color: #888;
		margin-top: 10px;
	}

	.word-display .feedback-word {
		font-size: 2em;
		font-weight: bold;
	}

	.feedback-correct h1 {
		color: #2e7d32;
		transform: scale(1.05);
	}

	.feedback-incorrect h1 {
		color: #c62828;
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 20px;
		width: 100%;
		max-width: 500px;
	}

	.actions.disabled {
		pointer-events: none;
		opacity: 0.7;
	}

	.article-btn {
		padding: 25px 20px;
		font-size: 2em;
		font-weight: bold;
		cursor: pointer;
		border: none;
		border-radius: 12px;
		transition: transform 0.1s ease, box-shadow 0.2s ease;
		color: #fff;
	}

	.article-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	}

	.article-btn.der {
		background-color: #007bff;
	}

	.article-btn.die {
		background-color: #dc3545;
	}

	.article-btn.das {
		background-color: #28a745;
	}

	.game-over, .not-ready-container {
		text-align: center;
		padding: 40px;
		background-color: #fff;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		max-width: 500px;
	}

	.game-over__title, .not-ready-container h1 {
		font-size: 2.5em;
		color: #333;
	}

	.game-over__streak-info, .game-over__best-score, .not-ready-container p {
		font-size: 1.2em;
		color: #666;
		margin-top: 10px;
	}

	.game-over__new-record {
		font-size: 1.2em;
		margin-top: 10px;
		color: #28a745;
		font-weight: bold;
	}

	.game-over__retry-btn {
		margin-top: 20px;
		padding: 15px 30px;
		font-size: 1.2em;
		font-weight: bold;
		cursor: pointer;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 12px;
	}
</style>