<template>
	<div class="game-page">
		<!-- Game Content -->
		<div v-if="sessionData && sessionData.status !== 'finished'" class="game-container">
			<!-- Header with Round Info and Timer -->
			<div class="game-header">
				<div class="opponent-info">
					<div class="player-avatar">
						<img v-if="opponentData?.avatar" :src="opponentData.avatar" alt="Opponent" />
						<span v-else class="avatar-placeholder">{{ opponentData?.name?.[0] || '?' }}</span>
					</div>
					<div class="player-details">
						<span class="player-name">{{ opponentData?.name || 'Opponent' }}</span>
						<span class="player-status">{{ opponentStatus }}</span>
					</div>
				</div>

				<div class="round-info">
					<span class="round-text">{{ $t('speakingGame.round') }} {{ currentRoundNumber }}/{{ sessionData.totalRounds }}</span>
				</div>

				<div class="timer-container">
					<span class="timer-label">{{ $t('speakingGame.timeRemaining') }}</span>
					<span class="timer-value">{{ timerDisplay }}</span>
				</div>
			</div>

			<!-- Question Card -->
			<div class="question-section">
				<div class="question-card">
					<h2 class="question-text">{{ currentRound?.question || '' }}</h2>
				</div>
			</div>

			<!-- Voice Recorder -->
			<div class="recorder-section">
				<VoiceRecorder
					v-if="!hasSubmitted"
					:key="sessionData?.currentRoundIndex"
					languageCode="de-DE"
					sttEndpoint="/api/whisper"
					@result="handleTranscription"
					@submit="submitAnswer"
				/>
				<div v-else class="submitted-message">
					<span class="check-icon">✓</span>
					<p>{{ $t('speakingGame.submitted') }}</p>
				</div>
			</div>

			<!-- Transcription Display -->
			<div v-if="currentTranscription" class="transcription-section">
				<h3 class="section-title">{{ $t('speakingGame.yourAnswer') }}</h3>
				<div class="transcription-box">
					<p>{{ currentTranscription }}</p>
				</div>
			</div>

			<!-- Leave Button -->
			<div class="action-bar">
				<button @click="confirmLeave" class="leave-button">
					{{ $t('speakingGame.leave') }}
				</button>
			</div>
		</div>

		<!-- Game Summary -->
		<div v-else-if="sessionData && sessionData.status === 'finished'" class="summary-container">
			<h1 class="summary-title">{{ $t('speakingGame.gameComplete') }}</h1>

			<div class="summary-content">
				<h3 class="summary-section-title">{{ $t('speakingGame.allQuestions') }}</h3>

				<div v-for="(round, index) in sessionData.rounds" :key="index" class="summary-round">
					<div class="round-header">
						<span class="round-number">{{ $t('speakingGame.round') }} {{ index + 1 }}</span>
					</div>
					<p class="round-question">{{ round.question }}</p>

					<div class="answers-grid">
						<!-- Your Answer -->
						<div class="answer-box">
							<h4>{{ $t('speakingGame.yourAnswer') }}</h4>
							<p>{{ getMyRecordingForRound(index)?.transcription || '-' }}</p>
						</div>

						<!-- Opponent Answer -->
						<div class="answer-box">
							<h4>{{ $t('speakingGame.opponentAnswer') }}</h4>
							<p>{{ getOpponentRecordingForRound(index)?.transcription || '-' }}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="summary-actions">
				<button @click="playAgain" class="action-button primary">
					{{ $t('speakingGame.practiceAgain') }}
				</button>
				<button @click="backToMenu" class="action-button secondary">
					{{ $t('speakingGame.backToMenu') }}
				</button>
			</div>
		</div>

		<!-- Loading State -->
		<div v-else class="loading-container">
			<p>{{ $t('eventSessionPage.loading') }}</p>
		</div>

		<!-- Opponent Left Modal -->
		<Modal
			:visible="showOpponentLeftModal"
			@close="handleOpponentLeft"
			:title="$t('speakingGame.opponentLeft')"
			:text="$t('speakingGame.gameEnded')"
		/>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpeakingGameStore } from '../../store/speakingGameStore.js'
import { userAuthStore } from '../../store/authStore.js'
import VoiceRecorder from '../../src/components/VoiceRecorder.vue'
import Modal from '../../src/components/modal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = userAuthStore()
const gameStore = useSpeakingGameStore()

// State
const currentTranscription = ref('')
const currentRecordingDuration = ref(0)
const timerSeconds = ref(60)
const showOpponentLeftModal = ref(false)
let timerInterval = null

// Computed
const sessionData = computed(() => gameStore.sessionData)
const currentRound = computed(() => gameStore.currentRound)
const currentRoundNumber = computed(() => (sessionData.value?.currentRoundIndex || 0) + 1)
const opponentData = computed(() => gameStore.opponentData)

const hasSubmitted = computed(() => {
	const currentIndex = sessionData.value?.currentRoundIndex
	return gameStore.myRecordings.some(r => r.roundIndex === currentIndex)
})

const opponentStatus = computed(() => {
	if (!sessionData.value) return ''
	const currentIndex = sessionData.value.currentRoundIndex
	const opponentHasSubmitted = gameStore.opponentRecordings.some(r => r.roundIndex === currentIndex)

	if (opponentHasSubmitted) {
		return t('speakingGame.finishedStatus')
	} else {
		return t('speakingGame.recordingStatus')
	}
})

const timerDisplay = computed(() => {
	const minutes = Math.floor(timerSeconds.value / 60)
	const seconds = timerSeconds.value % 60
	return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Methods
function handleTranscription(transcriptionData) {
	currentTranscription.value = transcriptionData.text || transcriptionData
	currentRecordingDuration.value = transcriptionData.duration || 0
}

async function submitAnswer() {
	if (!currentTranscription.value) {
		alert(t('speakingGame.recordingTooShort'))
		return
	}

	const success = await gameStore.submitRecording(
		currentTranscription.value,
		currentRecordingDuration.value
	)

	if (success) {
		console.log('Recording submitted successfully')
	}
}

function getMyRecordingForRound(roundIndex) {
	return gameStore.myRecordings.find(r => r.roundIndex === roundIndex)
}

function getOpponentRecordingForRound(roundIndex) {
	return gameStore.opponentRecordings.find(r => r.roundIndex === roundIndex)
}

function startTimer() {
	if (!currentRound.value?.startTime) return

	const startTime = currentRound.value.startTime.toMillis()
	const roundDuration = sessionData.value.roundDuration

	timerInterval = setInterval(() => {
		const elapsed = Math.floor((Date.now() - startTime) / 1000)
		const remaining = Math.max(0, roundDuration - elapsed)
		timerSeconds.value = remaining

		if (remaining === 0) {
			stopTimer()
			// Host advances round
			if (gameStore.isHost) {
				gameStore.advanceRound()
			}
		}
	}, 1000)
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
	}
}

function resetForNewRound() {
	currentTranscription.value = ''
	currentRecordingDuration.value = 0
	timerSeconds.value = 60
	stopTimer()
	startTimer()
}

function confirmLeave() {
	if (confirm(t('speakingGame.leave') + '?')) {
		gameStore.leaveSession()
		router.push('/speaking-practice')
	}
}

function playAgain() {
	gameStore.leaveSession()
	router.push('/speaking-practice')
}

function backToMenu() {
	gameStore.leaveSession()
	router.push('/')
}

function handleOpponentLeft() {
	showOpponentLeftModal.value = false
	gameStore.leaveSession()
	router.push('/speaking-practice')
}

// Lifecycle
onMounted(() => {
	const sessionId = route.params.id
	if (!sessionId) {
		router.push('/speaking-practice')
		return
	}

	// If not already listening to this session
	if (gameStore.gameId !== sessionId) {
		gameStore.listenToSession(sessionId)
	}

	// Start timer if round already started
	if (currentRound.value?.startTime) {
		startTimer()
	}
})

onUnmounted(() => {
	stopTimer()
})

// Watchers
watch(() => sessionData.value?.status, (newStatus) => {
	if (newStatus === 'finished') {
		stopTimer()
	}
})

watch(() => sessionData.value?.currentRoundIndex, (newIndex, oldIndex) => {
	if (newIndex !== oldIndex && newIndex !== undefined) {
		// Round changed, reset UI
		resetForNewRound()
	}
})

watch(() => sessionData.value, (newData) => {
	if (!newData) {
		// Session deleted (opponent left)
		showOpponentLeftModal.value = true
	}
})

// Check if both players submitted - host advances round
watch(() => gameStore.bothPlayersSubmitted(), (bothSubmitted) => {
	if (bothSubmitted && gameStore.isHost && timerSeconds.value > 0) {
		// Wait a moment for UI update, then advance
		setTimeout(() => {
			gameStore.advanceRound()
		}, 2000)
	}
})
</script>

<style scoped>
.game-page {
	min-height: 100vh;
	padding: 2rem 1rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-container,
.summary-container,
.loading-container {
	max-width: 900px;
	margin: 0 auto;
	background: white;
	border-radius: 20px;
	padding: 2rem;
	box-shadow: 4px 4px 0 #1e1e1e;
}

.game-header {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 1rem;
	align-items: center;
	margin-bottom: 2rem;
	padding-bottom: 1.5rem;
	border-bottom: 3px solid #1e1e1e;
}

.opponent-info {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.player-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 3px solid #1e1e1e;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FFD24B;
}

.player-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.avatar-placeholder {
	font-size: 1.5rem;
	font-weight: 700;
	color: #1e1e1e;
}

.player-details {
	display: flex;
	flex-direction: column;
}

.player-name {
	font-weight: 700;
	font-size: 1.1rem;
	color: #1e1e1e;
}

.player-status {
	font-size: 0.9rem;
	color: #666;
}

.round-info {
	text-align: center;
}

.round-text {
	font-size: 1.5rem;
	font-weight: 700;
	color: #1e1e1e;
}

.timer-container {
	text-align: right;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.timer-label {
	font-size: 0.9rem;
	color: #666;
}

.timer-value {
	font-size: 2rem;
	font-weight: 700;
	color: #e74c3c;
}

.question-section {
	margin-bottom: 2rem;
}

.question-card {
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	padding: 2rem;
	box-shadow: 3px 3px 0 #1e1e1e;
	text-align: center;
}

.question-text {
	font-size: 1.75rem;
	font-weight: 700;
	color: #1e1e1e;
	margin: 0;
	line-height: 1.4;
}

.recorder-section {
	margin-bottom: 2rem;
	display: flex;
	justify-content: center;
}

.submitted-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 2rem;
	background: #4ade80;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	box-shadow: 3px 3px 0 #1e1e1e;
}

.check-icon {
	font-size: 3rem;
	color: #1e1e1e;
}

.submitted-message p {
	font-size: 1.25rem;
	font-weight: 600;
	color: #1e1e1e;
	margin: 0;
}

.transcription-section {
	margin-bottom: 2rem;
}

.section-title {
	font-size: 1.25rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: #1e1e1e;
}

.transcription-box {
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 12px;
	padding: 1.5rem;
	box-shadow: 2px 2px 0 #1e1e1e;
}

.transcription-box p {
	font-size: 1.1rem;
	color: #1e1e1e;
	margin: 0;
	line-height: 1.6;
}

.action-bar {
	display: flex;
	justify-content: center;
	margin-top: 2rem;
}

.leave-button {
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

.leave-button:hover {
	transform: translateY(-2px);
	box-shadow: 5px 5px 0 #1e1e1e;
}

/* Summary Styles */
.summary-title {
	text-align: center;
	font-size: 2.5rem;
	font-weight: 700;
	color: #1e1e1e;
	margin-bottom: 2rem;
}

.summary-content {
	margin-bottom: 2rem;
}

.summary-section-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1.5rem;
	color: #1e1e1e;
}

.summary-round {
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	padding: 1.5rem;
	margin-bottom: 1.5rem;
	box-shadow: 3px 3px 0 #1e1e1e;
}

.round-header {
	margin-bottom: 1rem;
}

.round-number {
	font-size: 1rem;
	font-weight: 600;
	color: #666;
}

.round-question {
	font-size: 1.25rem;
	font-weight: 700;
	color: #1e1e1e;
	margin-bottom: 1.5rem;
}

.answers-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.answer-box {
	background: white;
	border: 2px solid #1e1e1e;
	border-radius: 12px;
	padding: 1rem;
}

.answer-box h4 {
	font-size: 0.9rem;
	font-weight: 600;
	color: #666;
	margin: 0 0 0.5rem 0;
}

.answer-box p {
	font-size: 1rem;
	color: #1e1e1e;
	margin: 0;
}

.summary-actions {
	display: flex;
	gap: 1rem;
	justify-content: center;
	flex-wrap: wrap;
}

.action-button {
	padding: 1.25rem 2.5rem;
	font-size: 1.1rem;
	font-weight: 700;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 4px 4px 0 #1e1e1e;
}

.action-button.primary {
	background: #4ade80;
	color: #1e1e1e;
}

.action-button.secondary {
	background: #FFD24B;
	color: #1e1e1e;
}

.action-button:hover {
	transform: translateY(-4px);
	box-shadow: 6px 6px 0 #1e1e1e;
}

.loading-container {
	text-align: center;
	padding: 4rem 2rem;
	font-size: 1.5rem;
	font-weight: 600;
	color: #1e1e1e;
}

@media (max-width: 768px) {
	.game-page {
		padding: 1rem 0.5rem;
	}

	.game-container,
	.summary-container {
		padding: 1rem;
	}

	.game-header {
		grid-template-columns: 1fr;
		text-align: center;
	}

	.opponent-info {
		justify-content: center;
	}

	.timer-container {
		align-items: center;
	}

	.question-text {
		font-size: 1.25rem;
	}

	.answers-grid {
		grid-template-columns: 1fr;
	}

	.summary-actions {
		flex-direction: column;
	}

	.action-button {
		width: 100%;
	}
}
</style>
