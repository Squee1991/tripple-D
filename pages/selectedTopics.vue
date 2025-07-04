<template>
	<div class="theme-board-block">
		<div class="theme-board-wrapper">
			<div class="theme-board-container">
				<div class="theme__title-wrapper">
					<button class="back-btn" @click="goBack">{{t('selectedpage.backBtn')}}</button>
					<h2 class="theme-title">{{t('selectedpage.title')}}</h2>
					<div class="theme__item"></div>
				</div>
				<div class="theme-content">

					<div class="theme__grid-container">
						<div class="theme-grid">
							<div
								v-for="key in paginatedTopics"
								:key="key"
								class="theme-card"
								:class="{ active: selectedTopic === key }"
								@click="selectTopic(key)"
							>
								<div class="card-counter">
									{{ themeProgress[key]?.total || 0 }}
								</div>
								<div class="theme-card-title">{{ t(nameMap[key]) }}</div>
							</div>
						</div>
						<div class="theme-pagination">
							<button @click="prevPage" :disabled="page === 0">←</button>
							<button @click="nextPage" :disabled="page === maxPage">→</button>
						</div>
					</div>
				</div>
				<div class="learning-modes">
					<Transition name="slide-right" appear>
						<div v-if="showModesBlock" class="learning-modes-block">
							<div @click="clearSelectedTopic" class="learning-modes-block-icon-wrapper">
								<img class="learning-modes-block-icon" src="../assets/images/delete.svg" alt="">
							</div>
							<div class="learning__modes-wrapper">
								<div>
									<div class="modes-title">
										{{t('selectedpage.choiceTitle')}}
									</div>
									<div class="topic-hint">
										{{t('selectedpage.topic')}}: {{ t(nameMap[selectedTopic]) }}
									</div>
								</div>
								<div class="modes-list">
									<label v-for="mode in modes" :key="mode.key" class="checkbox-container">
										<input
											type="checkbox"
											v-model="selectedModes"
											:value="mode.key"
										/>
										<span class="checkmark">
													<svg viewBox="0 0 24 24">
														<polyline points="3 12 10 20 21 4"/>
													</svg>
												</span>
										<span class="label-text">{{t(mode.label)}}</span>
									</label>
								</div>
								<button
									class="start-btn"
									:disabled="!selectedModes.length"
									@click="startLearning"
								>
									{{ t('selectedpage.startBtn')}}
								</button>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {ref, computed, onMounted} from 'vue'
	import {useRouter} from 'vue-router'
	import {userlangStore} from '../store/learningStore.js'
	import Lottie from 'lottie-web'

	const {t} = useI18n()
	import NotFound from '../assets/animation/notFound.json'

	const showModesBlock = ref(false)
	const showNoTopicMessage = ref(true)
	const router = useRouter()
	const store = userlangStore()
	const themeList = ref({})
	const selectedTopic = ref(null)
	const selectedModes = ref([])
	const animationContainer = ref(null)
	const localePath = useLocalePath()
	onMounted(() => {
		if (animationContainer.value) {
			Lottie.loadAnimation({
				container: animationContainer.value,
				loop: false,
				animationData: NotFound
			})
		}
	})

	const clearSelectedTopic = () => {
		showModesBlock.value = false
		setTimeout(() => {
			selectedTopic.value = null
			selectedModes.value = []
			showNoTopicMessage.value = false
		}, 600)

	}

	const goBack = () => {
		router.push('/')
	}

	const page = ref(0)
	const itemsPerPage = 9

	const topicKeys = computed(() => Object.keys(nameMap))

	const maxPage = computed(() =>
		Math.ceil(topicKeys.value.length / itemsPerPage) - 1
	)

	const paginatedTopics = computed(() => {
		const start = page.value * itemsPerPage
		return topicKeys.value.slice(start, start + itemsPerPage)
	})

	const nextPage = () => {
		if (page.value < maxPage.value) page.value++
	}
	const prevPage = () => {
		if (page.value > 0) page.value--
	}

	const nameMap = {
		Furniture: 'nameMap.Furniture',
		Animals: 'nameMap.Animals',
		Clothes: 'nameMap.Clothes',
		Food: 'nameMap.Food',
		Body: 'nameMap.Body',
		Professions: 'nameMap.Professions',
		Transport: 'nameMap.Transport',
		Colors: 'nameMap.Colors',
		Nature: 'nameMap.Nature',
		Home: 'nameMap.Home',
		Zeit: 'nameMap.Zeit',
		City: 'nameMap.City',
		School: 'nameMap.School',
		DaysAndMonths: 'nameMap.DaysAndMonths',
		Toys: 'nameMap.Toys',
		CommonItems: 'nameMap.CommonItems',
		BathroomItems: 'nameMap.BathroomItems',
		Kosmetik: 'nameMap.Kosmetik',
		Familie: 'nameMap.Familie',
		Emotions: 'nameMap.Emotions',
		Werkzeuge: 'nameMap.Werkzeuge',
		Kitchen: 'nameMap.Kitchen',
		Health: 'nameMap.Health',
		Sport: 'nameMap.Sport',
		SportEquipment: 'nameMap.SportEquipment',
		Travel: 'nameMap.Travel',
		Musik: 'nameMap.Musik',
		Amount: 'nameMap.Amount',
		Informatik: 'nameMap.Informatik'
	}

	const modes = [
		{key: 'article', label: 'modes.article'},
		{key: 'letters', label: 'modes.letters'},
		{key: 'wordArticle', label: 'modes.articleWord'},
		{key: 'plural', label: 'modes.plural'},
		{key: 'audio', label: 'modes.audio'}
	]

	const themeProgress = computed(() => {
		return Object.fromEntries(
			Object.entries(themeList.value).map(([key, words]) => {
				const total = words.length
				const learned = words.filter(word =>
					store.learnedWords.some(lw => lw.de === word.de && lw.topic === key)
				).length
				return [key, {learned, total}]
			})
		)
	})

	const selectTopic = (key) => {
		selectedTopic.value = key
		selectedModes.value = []
		showModesBlock.value = true
	}

	const startLearning = async () => {
		// Только слова, которые не выучены по выбранным способам
		const topicWords = (themeList.value[selectedTopic.value] || [])
		.filter(word => {
			const globalWord = store.words.find(
				w => w.de === word.de && w.topic === selectedTopic.value
			)
			// Оставляем только если есть хоть один невыученный режим
			return selectedModes.value.some(
				mode => !(globalWord?.progress?.[mode] === true)
			)
		})
		.map(w => ({...w, topic: selectedTopic.value}))

		await store.addWordsToGlobal(topicWords)
		await store.setSelectedWords(topicWords)
		await store.setSelectedTopics([selectedTopic.value])
		await store.saveToFirebase()

		const path = localePath({
			name: 'session',
			query: {
				topic: selectedTopic.value,
				mode: selectedModes.value
			}
		})
		router.push(path)

	}


	onMounted(async () => {
		const res = await fetch('/words.json')
		themeList.value = await res.json()
	})
</script>

<style scoped>

	.learning-modes-block-icon-wrapper {
		position: absolute;
		background: #b8c4f0;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		right: 10px;
		top: 10px;
		/*border: 3px solid #c09c5d;*/
		border: 3px solid #6a6eea;
		cursor: pointer;

	}

	.learning-modes-block-icon {
		width: 100%;
		padding: 8px;
	}

	.back-btn {
		padding: 10px 22px;
		font-size: 18px;
		font-weight: bold;
		color: #4b2a00;
		/*border: 2px solid #f8e1b7;*/
		border: 2px solid #6a6eea;
		border-radius: 12px;
		cursor: pointer;
		transition: background 0.3s ease, transform 0.2s ease;
		text-shadow: 0 1px 2px #fff2c1;
		font-family: 'Montserrat', Arial, sans-serif;
	}

	.theme__title-wrapper {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 30px;
	}

	.back-btn {
		justify-self: start;
	}

	.theme-title {
		grid-column: 2;
		justify-self: center;

	}

	.back-btn:hover {
		/*background: linear-gradient(90deg, #fff0ba, #e0b86c);*/
		background: #6a6eea;
		color: white;
	}

	.theme-pagination {
		display: flex;
		justify-content: center;
		gap: 18px;
		margin-top: 10px;
	}

	.theme-pagination button {
		background: linear-gradient(90deg, #8eaaff 60%, #6a6eea 100%);
		color: #fff;
		border: none;
		border-radius: 16px;
		padding: 10px 22px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		box-shadow: 0 2px 12px #7f8cec55;
		transition: background 0.13s, color 0.11s, transform 0.13s;
	}

	.theme-pagination button:disabled {
		background: #e7eafc;
		color: #b3b3db;
		opacity: 0.6;
		cursor: not-allowed;
	}

	.theme-board-container {
		width: 100%;
		padding: 10px;
		margin: 0 auto;
		height: 100vh;
		/*background-repeat: no-repeat;*/
		/*background: url("../assets/images/bg3.png") no-repeat center 0px fixed;*/
		/*background-size: cover;*/
		/*background: #af9570;*/
	}

	.theme-board-wrapper {
		box-shadow: 0 8px 32px 0 #30054a33, 0 1.5px 8px #1d042933;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.learning-modes {
		width: 405px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 30px;
	}

	.theme-title {
		font-size: 38px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-style: italic;
        font-weight: bold;
		text-align: center;
		color: #4b2a00;
		letter-spacing: 0.07em;
	}

	.theme-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		justify-items: center;
		align-items: center;
		flex-wrap: wrap;
		margin: 0 auto;
		perspective: 420px;
	}

	.not__learning {
		min-width: 402px;
	}

	.theme-card {
		margin: 16px;
		width: 225px;
		min-height: 130px;
		background: white;
		border: none;
		border-radius: 22px;
		box-shadow: 0 8px 28px 0 #8d8ee088,
		0 3px 0 #fff8 inset,
		0 0px 1.5px #7f56d988;
		padding: 22px 10px 26px 10px;
		max-width: 220px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		cursor: pointer;
		outline: none;
		user-select: none;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		transition: transform 0.28s, box-shadow 0.28s;
	}

	/*.theme-card::before {*/
	/*	content: '';*/
	/*	position: absolute;*/
	/*	top: 0;*/
	/*	left: 0;*/
	/*	width: 100%;*/
	/*	height: 100%;*/
	/*	background: inherit;*/
	/*	filter: brightness(0.9);*/
	/*	transform: translateZ(-1px);*/
	/*	z-index: -1;*/
	/*	transition: .5s;*/
	/*}*/

	.theme-card.active,
	.theme-card:active,
	.theme-card:hover {
		transform: translateY(-7px) scale(1.045);
		box-shadow: 0 16px 40px #afacfa77, 0 8px 30px #5f57bd33, 0 3px 0 #fff8 inset;
	}

	.theme-card-title {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 21px;
		color: #44318d;
		text-shadow: 0 2px 12px #f3edff90, 0 0 4px #4837ae70;
		text-align: center;
		margin-top: 18px;
		font-weight: 800;
		letter-spacing: 0.04em;
	}

	.card-counter {
		position: absolute;
		top: -10px;
		right: -15px;
		background: #347baa;
		color: white;
		font-weight: bold;
		font-family: "Kurale", serif;
		font-size: 19px;
		border-radius: 50%;
		border: 2.5px solid #195c86;
		text-shadow: 1px 1px 0 #fffbe8;
		z-index: 2;
		width: 52px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.learning-modes-block {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		padding: 21px 5px;
		/*background: #347baa;*/
		background: white;
		/*border-left: 5px solid #c9a96b;*/
		border-left: 5px solid #6a6eea;
		border-right: none;
		border-top-left-radius: 16px;
		border-bottom-left-radius: 16px;
		box-shadow: 0 16px 30px rgba(0, 0, 0, 0.4),
		inset 0 2px 6px rgba(255, 255, 255, 0.3);
		font-family: 'Georgia', serif;
		font-size: 17px;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		display: flex;
		flex-direction: column;
	}

	.modes-list {
		font-family: "Kurale", serif;
		font-weight: 600;
		font-size: 18px;
	}

	.learning__modes-wrapper {
		/*border: 4px solid #e9d28c;*/
		padding: 45px 15px 0 15px;
		border-radius: 16px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.modes-title {
		font-family: 'Uncial Antiqua', cursive;
		font-size: 26px;
		text-align: center;
		font-weight: bold;
		color: #444040;
		letter-spacing: 0.04em;
		text-shadow: 0 1px 8px #a3771e80;
		margin-bottom: 10px;
	}

	.modes-title:after {
		content: '';
		display: block;
	}

	.topic-hint {
		font-weight: 400;
		font-size: 15px;
		color: #78756f;
		font-family: 'Uncial Antiqua', cursive;
		text-align: center;
		margin-bottom: 10px;
		font-style: italic;
	}

	.modes-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 25px;
	}

	.mode-checkbox {
		font-size: 17px;
		display: flex;
		align-items: center;
		gap: 11px;
		border-radius: 8px;
		padding: 6px 13px;
		transition: background 0.2s;
		cursor: pointer;
		user-select: none;
	}

	.mode-checkbox:hover {
		background: #5c421577;
	}

	input[type="checkbox"] {
		width: 19px;
		height: 19px;
		accent-color: #f9d86b;
	}

	.start-btn {
		width: 100%;
		padding: 14px 22px;
		font-size: 19px;
		/*background: linear-gradient(90deg, #ffe08a, #ad9747);*/
		background: linear-gradient(90deg, #8eaaff 60%, #6a6eea 100%);
		color: #502b00;
		border: 2px solid #b7cdf8;
		border-radius: 30px;
		font-family: inherit;
		cursor: pointer;
		font-weight: bold;
		box-shadow: 0 2px 8px #a3781e29;
		margin-top: 10px;
		transition: .5s;
	}

	.start-btn:disabled {
		background: #fff8e147;
		color: #b3a270;
		opacity: 0.67;
		cursor: not-allowed;
	}

	.start-btn:hover:enabled {
		/*background: linear-gradient(100deg, #ffefae, #f5c752 140%);*/
		background: linear-gradient(90deg, #6a7db6 60%, #6a6eea 100%);
		color: white;
	}

	@media (max-width: 900px) {
		.theme-content {
			flex-direction: column;
			gap: 18px;
		}

		.learning-modes-block {
			margin-top: 18px;
		}

		.theme-board-container {
			padding: 16px 2px 16px 2px;
		}
	}

	@media (max-width: 700px) {
		.theme-title {
			font-size: 21px;
		}

		.learning-modes-block {
			padding: 14px 8px 20px 8px;
		}
	}

	.no_learning-modes {
		color: #eaddc0;
		font-size: 30px;
		font-weight: 600;
		font-family: 'Uncial Antiqua', cursive;
		letter-spacing: 0.04em;
		text-shadow: 0 1.5px 12px #a3771e80, 0 0 2px #fff0dc;
		opacity: 0.93;
		transition: box-shadow 0.19s, border 0.15s, background 0.18s;
		animation: fadeInNoTopic 0.5s;
	}

	@keyframes fadeInNoTopic {
		from {
			opacity: 0;
			transform: scale(0.98) translateY(14px);
		}
		to {
			opacity: 0.93;
			transform: scale(1) translateY(0);
		}
	}

	.theme-content::-webkit-scrollbar {
		width: 13px;
		background: #2a1843;
		border-radius: 8px;
	}

	.theme-content::-webkit-scrollbar-thumb {
		background: linear-gradient(135deg, #ad8e51 0%, #ffe08a 100%);
		border-radius: 8px;
		border: 3px solid #2a1843;
		box-shadow: 0 0 7px #ffd48a80;
	}

	.theme-content::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(135deg, #ffe08a 0%, #ad8e51 100%);
	}

	.theme-content {
		padding: 30px 0;
		scrollbar-width: auto;
		scrollbar-color: #ad8e51 #2a1843;
		display: flex;
		justify-content: center;
	}

	.slide-right-enter-active,
	.slide-right-leave-active {
		transition: transform 0.45s ease, opacity 0.4s ease;
	}

	.slide-right-enter-from {
		transform: translateX(100%);
		opacity: 0;
	}

	.slide-right-enter-to {
		transform: translateX(0);
		opacity: 1;
	}

	.slide-right-leave-from {
		transform: translateX(0);
		opacity: 1;
	}

	.slide-right-leave-to {
		transform: translateX(100%);
		opacity: 0;
	}

	.checkbox-container {
		display: flex;
		align-items: center;
		gap: 14px;
		cursor: pointer;
		user-select: none;
		position: relative;
		padding-left: 2px;
		font-family: 'Uncial Antiqua', cursive;
		color: #3a270c;
		font-size: 18px;
	}

	.checkbox-container input {
		display: none;
	}

	.checkmark {
		width: 33px;
		height: 33px;
		border-radius: 50%;
		/*border: 3px solid #d9b56b;*/
		border: 3px solid #6a6eea;
		/*background: #80a1d4;*/
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 8px #a77b3a88;
		position: relative;
		overflow: visible;
	}

	.checkmark svg {
		position: absolute;
		top: -11px;
		left: -1px;
		width: 38px;
		height: 38px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.checkmark polyline {
		stroke: #5e3f39;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
		stroke-dasharray: 28;
		stroke-dashoffset: 28;
		transition: stroke-dashoffset 0.4s ease;
	}

	.checkbox-container input:checked + .checkmark polyline {
		stroke-dashoffset: 0;
	}

	.checkbox-container input:checked + .checkmark svg {
		opacity: 1;
	}

	.label-text {
		color: black;
		font-size: 16px;
		text-shadow: 0 1px 3px #00000055;
		font-family: 'Montserrat', Arial, sans-serif;
	}

	@media (max-width: 900px) {
		.theme-content {
			flex-direction: column;
			gap: 18px;
			padding: 10px 0;
		}
		.theme-board-container {
			padding: 8px 2px 12px 2px;
			overflow-y: auto;
		}
	}

	@media (max-width: 768px) {
		.theme-title {
			font-size: 18px;
			padding: 0 6px;
		}
		.theme__title-wrapper {
			padding: 14px 2px 12px 2px;
			grid-template-columns: 1fr auto 1fr;
		}
		.theme-grid {
			grid-template-columns: 1fr;
			grid-template-rows: none;
			gap: 8px;

		}
		.theme-card {
			margin: 8px 0;
			width: 98vw;
			max-width: 390px;
			min-height: 90px;
			padding: 13px 6px 18px 6px;
		}
		.card-counter {
			font-size: 15px;
			width: 36px;
			height: 28px;
			top: -5px;
			right: -7px;
		}
		.theme-pagination button {
			padding: 6px 10px;
			font-size: 14px;
			border-radius: 8px;
		}
		.learning-modes {
			width: 100vw;
			margin: 0;
			justify-content: stretch;
			align-items: stretch;
			overflow-y: auto;
		}
		.learning-modes-block {
			position: fixed;
			left: 0; top: 0; right: 0; bottom: 0;
			width: 100vw;
			height: 100vh;
			max-width: 100vw;
			max-height: 100vh;
			border-radius: 0;
			border-left: none;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			box-shadow: none;
			z-index: 9999;
			background: #fff;
			overflow-y: auto;
			padding: 20px 8px 18px 8px;
			animation: fadeIn .2s;
		}
		.learning__modes-wrapper {
			padding: 15px 4px 0 4px;
		}
		.modes-title {
			font-size: 20px;
			margin-bottom: 7px;
		}
		.topic-hint {
			font-size: 12px;
			margin-bottom: 6px;
		}
		.checkbox-container {
			font-size: 14px;
			gap: 8px;
		}
		.checkmark {
			width: 23px;
			height: 23px;
			border-width: 2px;
		}
		.checkmark svg {
			width: 24px;
			height: 24px;
			top: -5px;
			left: -2px;
		}
		.label-text {
			font-size: 12px;
		}
		.start-btn {
			font-size: 15px;
			padding: 10px 12px;
			border-radius: 17px;
			margin-top: 8px;
		}
		.learning-modes-block-icon-wrapper {
			width: 33px;
			height: 33px;
			right: 10px;
			top: 10px;
			border-width: 2px;
		}
		.learning-modes-block-icon {
			padding: 5px;
		}
	}


</style>
