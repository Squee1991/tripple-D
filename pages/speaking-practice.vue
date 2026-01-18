<template>
	<div class="lobby">
		<Modal
			:visible="showInfoModal"
			@close="closeInfoModal"
			:title="$t('speakingGame.title')"
			:text="$t('speakingGame.subtitle')"
		/>
		<div class="lobby-container">
			<div v-if="!isWaitingForOpponent && !isOpponentFound">
				<!-- Header -->
				<div class="duel__header">
					<button @click="goBack" class="back-button-global" aria-label="Back">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
						</svg>
						<span>{{ $t('wordDuel.btnBack') }}</span>
					</button>
					<div class="tiips__info-wrapper">
						<button class="btn__tips" @click="openInfoModal">
							<img class="duel__question-img" src="../assets/images/question.svg" alt="Info Icon">
						</button>
					</div>
				</div>

				<!-- Mode Toggle -->
				<div class="mode-toggle-wrapper">
					<div
						class="mode-toggle-option"
						:class="{ 'mode-toggle-option--inactive': mode !== 'online' }"
						@click="mode = 'online'"
					>
						🌐 {{ $t('speakingGame.online') }}
					</div>
					<div
						class="mode-toggle-option"
						:class="{ 'mode-toggle-option--inactive': mode !== 'solo' }"
						@click="mode = 'solo'"
					>
						👤 {{ $t('speakingGame.solo') }}
					</div>
					<div class="mode-toggle-slider" :style="{ transform: sliderTransform }"></div>
				</div>

				<!-- Main Content -->
				<div class="main-content-wrapper">
					<!-- Level Selection -->
					<div class="level-grid">
						<button
							v-for="level in levels"
							:key="level"
							@click="selectLevel(level)"
							class="level-card"
							:class="{ 'level-card--selected': selectedLevel === level }"
						>
							<h2 class="card-level-title">{{ level }}</h2>
							<p class="card-level-desc">{{ $t(`speakingGame.level${level}`) }}</p>
						</button>
					</div>

					<!-- Topic Selection -->
					<div class="topic-section">
						<h3 class="section-title">{{ $t('speakingGame.selectTopic') }}</h3>
						<div class="topic-grid">
							<button
								v-for="topic in topics"
								:key="topic.id"
								@click="selectTopic(topic.id)"
								class="topic-card"
								:class="{ 'topic-card--selected': selectedTopic === topic.id }"
							>
								<span class="topic-icon">{{ topic.icon }}</span>
								<span class="topic-name">{{ $t(`speakingGame.topic${topic.id}`) }}</span>
							</button>
						</div>
					</div>

					<!-- Start Button -->
					<div class="action-section">
						<button
							@click="startGame"
							class="start-game-button"
							:disabled="!selectedLevel || !selectedTopic || gameStore.isSearching"
						>
							{{ $t('speakingGame.startGame') }}
						</button>
					</div>
				</div>
			</div>

			<!-- Matchmaking Status -->
			<div v-else class="status-overlay">
				<div v-if="isWaitingForOpponent">
					<p class="status-text">{{ $t('speakingGame.searching') }}<span class="dots">...</span></p>
					<button @click="cancelSearch" class="cancel-button">{{ $t('wordDuel.cancel') }}</button>
				</div>
				<div v-if="isOpponentFound">
					<p class="status-text">{{ $t('speakingGame.opponentFound') }}</p>
					<button @click="startMultiplayerGame" class="start-game-button">
						{{ $t('speakingGame.ready') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSpeakingGameStore } from '../store/speakingGameStore.js'
import { userAuthStore } from '../store/authStore.js'
import Modal from '../src/components/modal.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const gameStore = useSpeakingGameStore()

// State
const mode = ref('online')
const selectedLevel = ref('A1')
const selectedTopic = ref('Family')
const showInfoModal = ref(false)

// Data
const levels = ['A1', 'A2', 'B1', 'B2']
const topics = [
	{ id: 'Family', icon: '👨‍👩‍👧‍👦' },
	{ id: 'Travel', icon: '✈️' },
	{ id: 'Food', icon: '🍔' },
	{ id: 'Hobbies', icon: '🎨' },
	{ id: 'Work', icon: '💼' }
]

// Computed
const sliderTransform = computed(() => {
	const isAr = locale.value === 'ar'
	if (isAr) {
		return mode.value === 'online' ? 'translateX(100%)' : 'translateX(0%)'
	} else {
		return mode.value === 'online' ? 'translateX(0%)' : 'translateX(100%)'
	}
})

const isWaitingForOpponent = computed(() => {
	return mode.value === 'online' && !!gameStore.gameId && gameStore.sessionData?.status === 'waiting'
})

const isOpponentFound = computed(() => {
	return mode.value === 'online' && gameStore.sessionData?.status === 'starting'
})

// Methods
function selectLevel(level) {
	selectedLevel.value = level
}

function selectTopic(topicId) {
	selectedTopic.value = topicId
}

function openInfoModal() {
	showInfoModal.value = true
}

function closeInfoModal() {
	showInfoModal.value = false
}

async function startGame() {
	if (!authStore.uid) {
		// Show auth modal or redirect to login
		alert('Please login first')
		return
	}

	if (!selectedLevel.value || !selectedTopic.value) {
		return
	}

	if (mode.value === 'online') {
		// Start matchmaking
		await gameStore.findGame(selectedLevel.value, selectedTopic.value.toLowerCase())
	} else {
		// Navigate to solo practice page
		router.push({
			path: '/speaking-solo',
			query: {
				level: selectedLevel.value,
				topic: selectedTopic.value.toLowerCase()
			}
		})
	}
}

async function startMultiplayerGame() {
	if (gameStore.isHost) {
		await gameStore.startGame()
	}
	// Navigate to game page
	router.push(`/speaking-game/${gameStore.gameId}`)
}

function cancelSearch() {
	gameStore.cancelSearch()
}

function goBack() {
	gameStore.cancelSearch()
	router.push('/')
}

// Watch for session status changes
watch(
	() => gameStore.sessionData?.status,
	(newStatus) => {
		if (newStatus === 'in_progress' && mode.value === 'online') {
			// Both players ready, navigate to game
			router.push(`/speaking-game/${gameStore.gameId}`)
		}
	}
)
</script>

<style scoped>
.lobby {
	min-height: 100vh;
	padding: 2rem 1rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.lobby-container {
	max-width: 900px;
	margin: 0 auto;
	background: white;
	border-radius: 20px;
	padding: 2rem;
	box-shadow: 4px 4px 0 #1e1e1e;
}

.duel__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.back-button-global {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 12px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 2px 2px 0 #1e1e1e;
}

.back-button-global:hover {
	transform: translateY(-2px);
	box-shadow: 4px 4px 0 #1e1e1e;
}

.back-button-global svg {
	width: 20px;
	height: 20px;
	fill: #1e1e1e;
}

.tiips__info-wrapper {
	display: flex;
	gap: 0.5rem;
}

.btn__tips {
	width: 44px;
	height: 44px;
	background: #FFD24B;
	border: 3px solid #1e1e1e;
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 2px 2px 0 #1e1e1e;
	transition: all 0.2s;
}

.btn__tips:hover {
	transform: translateY(-2px);
	box-shadow: 4px 4px 0 #1e1e1e;
}

.btn__tips img {
	width: 24px;
	height: 24px;
}

.mode-toggle-wrapper {
	position: relative;
	display: flex;
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	padding: 0.5rem;
	margin-bottom: 2rem;
	overflow: hidden;
}

.mode-toggle-option {
	flex: 1;
	padding: 1rem;
	text-align: center;
	font-weight: 600;
	font-size: 1.1rem;
	cursor: pointer;
	z-index: 2;
	transition: color 0.3s;
}

.mode-toggle-option--inactive {
	color: #999;
}

.mode-toggle-slider {
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	width: calc(50% - 0.5rem);
	height: calc(100% - 1rem);
	background: #FFD24B;
	border: 3px solid #1e1e1e;
	border-radius: 12px;
	transition: transform 0.3s ease;
	z-index: 1;
	box-shadow: 2px 2px 0 #1e1e1e;
}

.main-content-wrapper {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.level-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 1rem;
}

.level-card {
	padding: 1.5rem;
	background: white;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 3px 3px 0 #1e1e1e;
	text-align: center;
}

.level-card:hover {
	transform: translateY(-4px);
	box-shadow: 5px 5px 0 #1e1e1e;
}

.level-card--selected {
	background: #FFD24B;
	transform: translateY(-4px);
	box-shadow: 5px 5px 0 #1e1e1e;
}

.card-level-title {
	font-size: 2rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
	color: #1e1e1e;
}

.card-level-desc {
	font-size: 0.9rem;
	color: #666;
	margin: 0;
}

.topic-section {
	margin-top: 1rem;
}

.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: #1e1e1e;
}

.topic-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.topic-card {
	padding: 1.5rem;
	background: white;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 3px 3px 0 #1e1e1e;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.topic-card:hover {
	transform: translateY(-4px);
	box-shadow: 5px 5px 0 #1e1e1e;
}

.topic-card--selected {
	background: #4ade80;
	transform: translateY(-4px);
	box-shadow: 5px 5px 0 #1e1e1e;
}

.topic-icon {
	font-size: 3rem;
}

.topic-name {
	font-size: 1.1rem;
	font-weight: 600;
	color: #1e1e1e;
}

.action-section {
	display: flex;
	justify-content: center;
	margin-top: 2rem;
}

.start-game-button {
	padding: 1.25rem 3rem;
	font-size: 1.25rem;
	font-weight: 700;
	background: #4ade80;
	color: #1e1e1e;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 4px 4px 0 #1e1e1e;
}

.start-game-button:hover:not(:disabled) {
	transform: translateY(-4px);
	box-shadow: 6px 6px 0 #1e1e1e;
}

.start-game-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.status-overlay {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	text-align: center;
}

.status-text {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 2rem;
	color: #1e1e1e;
}

.dots::after {
	content: '...';
	animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
	0%, 20% { content: '.'; }
	40% { content: '..'; }
	60%, 100% { content: '...'; }
}

.cancel-button {
	padding: 1rem 2rem;
	font-size: 1rem;
	font-weight: 600;
	background: #E89C9C;
	color: #1e1e1e;
	border: 3px solid #1e1e1e;
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 3px 3px 0 #1e1e1e;
}

.cancel-button:hover {
	transform: translateY(-2px);
	box-shadow: 5px 5px 0 #1e1e1e;
}

@media (max-width: 768px) {
	.lobby {
		padding: 1rem 0.5rem;
	}

	.lobby-container {
		padding: 1rem;
	}

	.level-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.topic-grid {
		grid-template-columns: 1fr;
	}

	.start-game-button {
		width: 100%;
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}
}
</style>
