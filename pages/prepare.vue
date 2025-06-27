<script setup>
	import { ref, onMounted, computed } from 'vue';
	import { useRouter } from 'vue-router';
	import { useGameStore } from '../store/marafonStore.js';
	import { userAuthStore } from '../store/authStore.js';

	const gameStore = useGameStore();
	const authStore = userAuthStore();
	const router = useRouter();
	const selectedDifficulty = ref(1);
	const currentRecord = computed(() => {
		if (gameStore.personalBests) {
			return gameStore.personalBests[selectedDifficulty.value] || 0;
		}
		return 0;
	});

	onMounted(async () => {
		await gameStore.loadWords();
		await gameStore.fetchRecord();
	});

	function startGame() {
		if (!authStore.uid) return;
		gameStore.selectGameSettings(selectedDifficulty.value);
		router.push('/MarathonGame');
	}
</script>

<template>
	<div class="page-wrapper">
		<div class="deco-shape shape-1"></div>
		<div class="deco-shape shape-2"></div>
		<div class="deco-shape shape-3"></div>

		<div class="prepare-container">
			<div class="header">
				<h1>Марафон по всем словам</h1>
				<p class="subtitle">Проверьте, насколько хорошо вы знаете слова и артикли</p>
			</div>
			<div v-if="authStore.uid" class="user-greeting">
				<p>Привет, <strong>{{ authStore.name }}</strong>!</p>
				<p class="record">Твой лучший стрик на этом уровне сложности: <span>{{ currentRecord }}</span></p>
			</div>
			<div v-else class="guest-greeting">
				<p>Войдите в аккаунт, чтобы сохранять свой прогресс и соревноваться.</p>
			</div>

			<div v-if="gameStore.isLoaded" class="settings-block">
				<h2>Выберите сложность</h2>
				<div class="difficulty-options">
					<button @click="selectedDifficulty = 1" :class="{ active: selectedDifficulty === 1 }">
						<div class="button-content">
							<span>Легко</span>
							<small>5 жизней, без таймера</small>
						</div>
						<span class="icon">🕊️</span>
					</button>
					<button @click="selectedDifficulty = 2" :class="{ active: selectedDifficulty === 2 }">
						<div class="button-content">
							<span>Средне</span>
							<small>5 жизней, 10 сек/слово</small>
						</div>
						<span class="icon">⏱️</span>
					</button>
					<button @click="selectedDifficulty = 3" :class="{ active: selectedDifficulty === 3 }">
						<div class="button-content">
							<span>Сложно</span>
							<small>1 жизнь, 5 сек/слово</small>
						</div>
						<span class="icon">🔥</span>
					</button>
				</div>
			</div>
			<div v-else class="loading">
				<p>Загрузка слов...</p>
			</div>

			<button
				class="start-button"
				@click="startGame"
				:disabled="!authStore.uid || !gameStore.isLoaded"
			>
				{{ authStore.uid ? 'Начать!' : 'Войдите, чтобы играть' }}
			</button>

		</div>
	</div>
</template>

<style scoped>
	/* Ваши стили остаются без изменений */
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes float {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-15px); }
		100% { transform: translateY(0px); }
	}
	.page-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 20px;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
	}
	.deco-shape {
		position: absolute;
		border-radius: 50%;
		animation: float 6s ease-in-out infinite;
		z-index: 0;
	}
	.shape-1 {
		width: 200px;
		height: 200px;
		background: rgba(255, 255, 255, 0.15);
		top: -50px;
		left: -50px;
	}
	.shape-2 {
		width: 150px;
		height: 150px;
		background: rgba(255, 255, 255, 0.1);
		bottom: 10%;
		right: 15%;
		animation-delay: 2s;
	}
	.shape-3 {
		width: 50px;
		height: 50px;
		background: rgba(255, 255, 255, 0.2);
		bottom: 20%;
		left: 10%;
		animation-delay: 4s;
	}
	.prepare-container {
		width: 100%;
		max-width: 500px;
		padding: 30px 40px;
		text-align: center;
		z-index: 1;
		background: rgba(255, 255, 255, 0.35);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
		animation: fadeIn 0.6s ease-out forwards;
	}
	.header h1 {
		font-size: 2.5em;
		font-weight: 700;
		color: #2c3e50;
		margin-bottom: 5px;
	}
	.header .subtitle {
		font-size: 1.1em;
		color: #34495e;
		margin-bottom: 30px;
	}
	.user-greeting, .guest-greeting {
		margin-bottom: 30px;
		font-size: 1.1em;
		color: #2c3e50;
	}
	.user-greeting .record {
		margin-top: 10px; /* Добавил отступ */
		font-size: 1.2em;
		color: #27ae60;
	}
	.user-greeting .record span {
		font-weight: bold;
	}
	.settings-block h2 {
		font-size: 1.5em;
		color: #34495e;
		margin-bottom: 20px;
	}
	.difficulty-options {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
	.difficulty-options button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		border: 2px solid rgba(255, 255, 255, 0.5);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		text-align: left;
	}
	.difficulty-options button:hover {
		border-color: #ffffff;
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.4);
	}
	.difficulty-options button.active {
		border-color: #ffffff;
		background-color: rgba(255, 255, 255, 0.6);
		box-shadow: 0 0 15px rgba(255,255,255,0.5);
	}
	.button-content {
		display: flex;
		flex-direction: column;
	}
	.button-content span {
		font-size: 1.2em;
		font-weight: 600;
		color: #2c3e50;
	}
	.button-content small {
		font-size: 0.9em;
		color: #34495e;
	}
	.icon {
		font-size: 1.8em;
	}
	.start-button {
		margin-top: 20px;
		width: 100%;
		padding: 18px;
		font-size: 1.4em;
		font-weight: bold;
		cursor: pointer;
		background: linear-gradient(45deg, #27ae60, #2ecc71);
		color: white;
		border: none;
		border-radius: 12px;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(0,0,0,0.1);
	}
	.start-button:hover:not(:disabled) {
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(0,0,0,0.2);
	}
	.start-button:disabled {
		background: #bdc3c7;
		cursor: not-allowed;
	}
</style>