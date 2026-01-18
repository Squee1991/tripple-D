<template>
	<div class="solo-page">
		<div v-if="!isCompleted" class="solo-container">
			<!-- Header -->
			<div class="solo-header">
				<button @click="confirmExit" class="back-button-global">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
					</svg>
					<span>{{ $t('wordDuel.btnBack') }}</span>
				</button>

				<div class="progress-indicator">
					<span class="progress-text">{{ $t('speakingGame.question') }} {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
					<div class="progress-bar">
						<div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
					</div>
				</div>
			</div>

			<!-- Question Card -->
			<div class="question-section">
				<div class="question-card">
					<h2 class="question-text">{{ currentQuestion?.question || '' }}</h2>
				</div>
			</div>

			<!-- Voice Recorder -->
			<div class="recorder-section">
				<VoiceRecorder
					v-if="!currentTranscription"
					:key="currentQuestionIndex"
					languageCode="de-DE"
					sttEndpoint="/api/whisper"
					@result="handleTranscription"
					@submit="handleSubmit"
					@audio="handleAudioRecording"
				/>
				<div v-else class="recorded-message">
					<span class="check-icon">✓</span>
					<p>{{ $t('speakingGame.transcription') }}</p>
				</div>
			</div>

			<!-- Transcription Display -->
			<div v-if="currentTranscription" class="transcription-section">
				<h3 class="section-title">{{ $t('speakingGame.yourAnswer') }}</h3>
				<div class="transcription-box">
					<p>{{ currentTranscription }}</p>
				</div>

				<!-- Next Button -->
				<div class="action-buttons">
					<button @click="nextQuestion" class="next-button">
						{{ currentQuestionIndex < questions.length - 1 ? $t('speakingGame.nextQuestion') : $t('speakingGame.practiceComplete') }}
					</button>
				</div>
			</div>
		</div>

		<!-- Completion Summary -->
		<div v-else class="completion-container">
			<h1 class="completion-title">{{ $t('speakingGame.practiceComplete') }}</h1>

			<div class="completion-content">
				<div class="completion-stats">
					<div class="stat-card">
						<span class="stat-number">{{ questions.length }}</span>
						<span class="stat-label">{{ $t('speakingGame.allQuestions') }}</span>
					</div>
					<div class="stat-card">
						<span class="stat-number">{{ answeredQuestions.length }}</span>
						<span class="stat-label">{{ $t('speakingGame.yourAnswers') }}</span>
					</div>
				</div>

				<h3 class="summary-section-title">{{ $t('speakingGame.summary') }}</h3>

				<div v-for="(item, index) in answeredQuestions" :key="index" class="summary-item">
					<div class="summary-header">
						<span class="question-number">{{ index + 1 }}.</span>
						<p class="question-text-small">{{ item.question }}</p>
					</div>

					<!-- Audio Player -->
					<div v-if="getAudioForQuestion(item.questionIndex)" class="audio-player">
						<audio controls :src="getAudioForQuestion(item.questionIndex).objectURL">
							Your browser does not support audio playback.
						</audio>
						<span class="audio-duration">{{ formatDuration(getAudioForQuestion(item.questionIndex).duration) }}</span>
					</div>

					<div class="answer-display">
						<p>{{ item.answer }}</p>
					</div>
				</div>
			</div>

			<div class="completion-actions">
				<button @click="restartPractice" class="action-button primary">
					{{ $t('speakingGame.practiceAgain') }}
				</button>
				<button @click="backToMenu" class="action-button secondary">
					{{ $t('speakingGame.backToMenu') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VoiceRecorder from '../src/components/VoiceRecorder.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// State
const questions = ref([])
const currentQuestionIndex = ref(0)
const currentTranscription = ref('')
const answeredQuestions = ref([])
const isCompleted = ref(false)
const level = ref('')
const topic = ref('')
const audioBlobs = ref([])

// Computed
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const progressPercentage = computed(() => {
	if (questions.value.length === 0) return 0
	return ((currentQuestionIndex.value + 1) / questions.value.length) * 100
})

// Methods
async function loadQuestions() {
	try {
		level.value = route.query.level || 'A1'
		topic.value = route.query.topic || 'family'

		const response = await fetch(`/speaking-questions/${topic.value}.json`)
		if (!response.ok) {
			throw new Error('Failed to load questions')
		}

		const data = await response.json()
		const levelQuestions = data.levels[level.value] || []

		// Select random 5 questions for practice
		const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5)
		questions.value = shuffled.slice(0, 5)

		if (questions.value.length === 0) {
			alert('No questions available')
			router.push('/speaking-practice')
		}
	} catch (error) {
		console.error('Error loading questions:', error)
		alert('Failed to load questions')
		router.push('/speaking-practice')
	}
}

function handleTranscription(transcriptionData) {
	const text = transcriptionData.text || transcriptionData
	currentTranscription.value = text

	// Save the answer
	answeredQuestions.value.push({
		questionIndex: currentQuestionIndex.value,
		question: currentQuestion.value.question,
		answer: text
	})
}

function handleAudioRecording(audioData) {
	const { blob, durationSec } = audioData

	// Create Object URL for playback
	const objectURL = URL.createObjectURL(blob)

	// Store blob with current question index
	audioBlobs.value.push({
		questionIndex: currentQuestionIndex.value,
		blob: blob,
		objectURL: objectURL,
		duration: durationSec
	})
}

function handleSubmit() {
	// Automatically move to next question after submit
	nextQuestion()
}

function nextQuestion() {
	if (currentQuestionIndex.value < questions.value.length - 1) {
		// Move to next question
		currentQuestionIndex.value++
		currentTranscription.value = ''
	} else {
		// Practice completed
		isCompleted.value = true
	}
}

function confirmExit() {
	if (confirm(t('speakingGame.leave') + '?')) {
		router.push('/speaking-practice')
	}
}

function restartPractice() {
	// Cleanup audio blobs
	audioBlobs.value.forEach(audio => {
		if (audio.objectURL) {
			URL.revokeObjectURL(audio.objectURL)
		}
	})
	audioBlobs.value = []

	// Reset other state
	currentQuestionIndex.value = 0
	currentTranscription.value = ''
	answeredQuestions.value = []
	isCompleted.value = false
	loadQuestions() // Load new random questions
}

function backToMenu() {
	router.push('/speaking-practice')
}

// Helper functions
function getAudioForQuestion(questionIndex) {
	return audioBlobs.value.find(audio => audio.questionIndex === questionIndex)
}

function formatDuration(seconds) {
	if (!seconds) return '0:00'
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(() => {
	loadQuestions()
})

onUnmounted(() => {
	// Revoke all object URLs to free memory
	audioBlobs.value.forEach(audio => {
		if (audio.objectURL) {
			URL.revokeObjectURL(audio.objectURL)
		}
	})
	audioBlobs.value = []
})
</script>

<style scoped>
.solo-page {
	min-height: 100vh;
	padding: 2rem 1rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.solo-container,
.completion-container {
	max-width: 800px;
	margin: 0 auto;
	background: white;
	border-radius: 20px;
	padding: 2rem;
	box-shadow: 4px 4px 0 #1e1e1e;
}

.solo-header {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-bottom: 2rem;
	padding-bottom: 1.5rem;
	border-bottom: 3px solid #1e1e1e;
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
	align-self: flex-start;
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

.progress-indicator {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.progress-text {
	font-size: 1.1rem;
	font-weight: 600;
	color: #1e1e1e;
	text-align: center;
}

.progress-bar {
	width: 100%;
	height: 12px;
	background: #f0f0f0;
	border: 2px solid #1e1e1e;
	border-radius: 8px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
	transition: width 0.3s ease;
}

.question-section {
	margin-bottom: 2rem;
}

.question-card {
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	padding: 2.5rem;
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

.recorded-message {
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

.recorded-message p {
	font-size: 1.25rem;
	font-weight: 600;
	color: #1e1e1e;
	margin: 0;
}

.transcription-section {
	margin-top: 2rem;
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
	margin-bottom: 1.5rem;
}

.transcription-box p {
	font-size: 1.1rem;
	color: #1e1e1e;
	margin: 0;
	line-height: 1.6;
}

.action-buttons {
	display: flex;
	justify-content: center;
}

.next-button {
	padding: 1.25rem 3rem;
	font-size: 1.25rem;
	font-weight: 700;
	background: #FFD24B;
	color: #1e1e1e;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 4px 4px 0 #1e1e1e;
}

.next-button:hover {
	transform: translateY(-4px);
	box-shadow: 6px 6px 0 #1e1e1e;
}

/* Completion Styles */
.completion-title {
	text-align: center;
	font-size: 2.5rem;
	font-weight: 700;
	color: #1e1e1e;
	margin-bottom: 2rem;
}

.completion-content {
	margin-bottom: 2rem;
}

.completion-stats {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	margin-bottom: 2rem;
}

.stat-card {
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	padding: 1.5rem;
	text-align: center;
	box-shadow: 3px 3px 0 #1e1e1e;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.stat-number {
	font-size: 3rem;
	font-weight: 700;
	color: #4ade80;
}

.stat-label {
	font-size: 1rem;
	font-weight: 600;
	color: #666;
}

.summary-section-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1.5rem;
	color: #1e1e1e;
}

.summary-item {
	background: #f8f8f8;
	border: 3px solid #1e1e1e;
	border-radius: 16px;
	padding: 1.5rem;
	margin-bottom: 1rem;
	box-shadow: 3px 3px 0 #1e1e1e;
}

.summary-header {
	display: flex;
	gap: 0.75rem;
	margin-bottom: 1rem;
}

.question-number {
	font-size: 1.25rem;
	font-weight: 700;
	color: #666;
	flex-shrink: 0;
}

.question-text-small {
	font-size: 1.1rem;
	font-weight: 600;
	color: #1e1e1e;
	margin: 0;
	line-height: 1.4;
}

.answer-display {
	background: white;
	border: 2px solid #1e1e1e;
	border-radius: 12px;
	padding: 1rem;
}

.answer-display p {
	font-size: 1rem;
	color: #1e1e1e;
	margin: 0;
	line-height: 1.6;
}

.audio-player {
	margin: 1rem 0;
	padding: 1rem;
	background: #f0f0f0;
	border: 2px solid #1e1e1e;
	border-radius: 12px;
	display: flex;
	align-items: center;
	gap: 1rem;
}

.audio-player audio {
	flex: 1;
	height: 40px;
	border-radius: 8px;
}

.audio-duration {
	font-size: 0.9rem;
	font-weight: 600;
	color: #666;
	min-width: 50px;
}

.completion-actions {
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

@media (max-width: 768px) {
	.solo-page {
		padding: 1rem 0.5rem;
	}

	.solo-container,
	.completion-container {
		padding: 1rem;
	}

	.question-text {
		font-size: 1.25rem;
	}

	.completion-stats {
		grid-template-columns: 1fr;
	}

	.completion-actions {
		flex-direction: column;
	}

	.action-button {
		width: 100%;
	}

	.audio-player {
		flex-direction: column;
		align-items: stretch;
	}

	.audio-duration {
		text-align: center;
	}
}
</style>
