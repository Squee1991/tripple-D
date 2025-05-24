<template>
	<div class="theme-board-block">
		<div class="theme-board-wrapper">
			<div class="theme-board-container">
				<h2 class="theme-title">Выберите тему для изучения</h2>
				<div class="theme-content">

					<div class="theme-grid">
						<div
							v-for="(label, key) in nameMap"
							:key="key"
							class="theme-card"
							:class="{ active: selectedTopic === key }"
							@click="selectTopic(key)"
						>
							<div class="card-counter">
								<!--						{{ themeProgress[key]?.learned || 0 }}/-->
								{{ themeProgress[key]?.total || 0 }}
							</div>
							<div class="theme-card-title">{{ label }}</div>
						</div>
					</div>
					<div class="learning-modes">
						<div class="learning-modes">
							<div class="no_learning-modes" v-if="!selectedTopic">Нет выбранных тем</div>
							<div class="learning-modes-block" v-if="selectedTopic">
								<h3 class="modes-title">Способы обучения<br><span class="topic-hint">Тема: {{ nameMap[selectedTopic] }}</span></h3>
								<div class="modes-list">
									<label
										v-for="mode in modes"
										:key="mode.key"
										class="mode-checkbox"
									>
										<input
											type="checkbox"
											v-model="selectedModes"
											:value="mode.key"
										/>
										<span>{{ mode.label }}</span>
									</label>
								</div>
								<button
									class="start-btn"
									:disabled="!selectedModes.length"
									@click="startLearning"
								>
									Начать обучение
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { useRouter } from 'vue-router'
	import { userlangStore } from '../store/learningStore.js'
	const router = useRouter()
	const store = userlangStore()
	const themeList = ref({})
	const selectedTopic = ref(null)
	const selectedModes = ref([])

	const nameMap = {
		Furniture: 'Мебель',
		Animals: 'Животные',
		Clothes: 'Одежда',
		Food: 'Еда',
		Body: 'Части тела',
		Professions: 'Профессии',
		Transport: 'Транспорт',
		Colors: 'Цвета',
		Nature: 'Природа',
		Home: 'Дом',
		Zeit: 'Время',
		City: 'Город',
		School: 'Школа',
		DaysAndMonths: 'Дни и месяцы',
		Toys: 'Игрушки',
		CommonItems: 'Общие',
		BathroomItems: 'Вещи для ванной',
		Kosmetik: 'Косметика',
		Familie: 'Семья',
		Emotions: 'Эмоции',
		Werkzeuge: 'Инструменты',
		Kitchen: 'Кухня',
		Health: 'Здоровье',
		Sport: 'Спорт',
		SportEquipment: 'Фитнес-инвентарь'
	}

	const modes = [
		{ key: 'article', label: 'Вписать артикль' },
		{ key: 'letters', label: 'Собрать слово по буквам' },
		{ key: 'wordArticle', label: 'Вписать слово и артикль' },
		{ key: 'plural', label: 'Форма множественного числа' },
		{ key: 'audio', label: 'Аудирование' }
	]

	const themeProgress = computed(() => {
		return Object.fromEntries(
			Object.entries(themeList.value).map(([key, words]) => {
				const total = words.length
				const learned = words.filter(word =>
					store.learnedWords.some(lw => lw.de === word.de && lw.topic === key)
				).length
				return [key, { learned, total }]
			})
		)
	})

	const selectTopic = (key) => {
		selectedTopic.value = key
		selectedModes.value = []
	}

	const startLearning = async () => {
		await store.setSelectedTopics([selectedTopic.value])
		const topicWords = (themeList.value[selectedTopic.value] || []).map(w => ({ ...w, topic: selectedTopic.value }))
		await store.setSelectedWords(topicWords)
		await store.saveToFirebase()
		router.push({
			name: 'session',
			query: {
				topic: selectedTopic.value,
				mode: selectedModes.value
			}
		})
	}

	onMounted(async () => {
		const res = await fetch('/words.json')
		themeList.value = await res.json()
	})
</script>

<style scoped>
	.theme-board-container {
		max-width: 1240px;
		padding: 10px;

	}

	.theme-board-wrapper {
		background: linear-gradient(135deg, #23043a 0%, #6c4326 100%);
		box-shadow: 0 8px 32px 0 #30054a33, 0 1.5px 8px #1d042933;
		height: 100%;
	}

	.learning-modes {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.theme-title {
		font-size: 38px;
		font-family: 'Uncial Antiqua', cursive;
		text-align: center;
		margin-bottom: 32px;
		color: #ffd48a;
		letter-spacing: 0.07em;
		text-shadow: 0 2px 14px #21092680, 0 0 2px #e3a41f90;
	}

	.theme-content {
		display: flex;
		gap: 42px;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.theme-grid {
		height: 80vh;
		overflow-y: auto;
		flex: 1 1 60%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
		gap: 28px;
		justify-items: center;
		padding: 20px;
	}

	.theme-card {
		background: linear-gradient(120deg, #512f0a 55%, #ad8e51 130%);
		border: 4px solid #ffebc2;
		box-shadow: 0 0 20px #2b100b55, 0 2px 10px #d6b15f44 inset;
		border-radius: 18px;
		padding: 24px 12px 28px 12px;
		min-height: 110px;
		width: 100%;
		max-width: 230px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		cursor: pointer;
		transition: transform 0.17s, box-shadow 0.17s, border 0.15s;
		outline: none;
		user-select: none;
	}

	.theme-card.active,
	.theme-card:active,
	.theme-card:hover {
		transform: scale(1.045) rotate(-1deg);
		border-color: #ffe079;
		box-shadow: 0 0 32px #e1ae36bb, 0 2px 16px #d8c89944 inset;
		background: linear-gradient(110deg, #6d471b 65%, #ffe08a 160%);
	}

	.theme-card-title {
		font-family: 'Uncial Antiqua', cursive;
		font-size: 20px;
		color: #ffefc2;
		text-shadow: 0 1.5px 6px #42260c99;
		text-align: center;
		margin-top: 18px;
		font-weight: 600;
	}

	.card-counter {
		position: absolute;
		top: -15px;
		right: -15px;
		background: linear-gradient(90deg, #ffe099 40%, #a87709 90%);
		color: #4d2901;
		font-weight: bold;
		font-size: 15px;
		padding: 12px 16px;
		border-radius: 50%;
		border: 2.5px solid #fff0c7;
		box-shadow: 0 0 6px #e3af2585, 0 2px 6px #57350744;
		text-shadow: 1px 1px 0 #fffbe8;
		z-index: 2;
		min-width: 40px;
		min-height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.learning-modes-block {
		flex: 1 1 340px;
		max-width: 370px;
		background: linear-gradient(135deg, #2a1843 80%, #b09262 180%);
		border: 4px solid #e9d28c;
		border-radius: 16px;
		box-shadow: 0 2px 14px #42260c33;
		padding: 15px 15px 15px 15px;
		color: #ffe8b8;
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-width: 280px;
		animation: fadeIn 0.7s;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateX(30px);}
		to { opacity: 1; transform: none;}
	}

	.modes-title {
		font-family: 'Uncial Antiqua', cursive;
		font-size: 22px;
		text-align: center;
		color: #ffe8b8;
		letter-spacing: 0.04em;
		text-shadow: 0 1px 8px #a3771e80;
	}
	.topic-hint {
		font-size: 15px;
		color: #ffd775;
		font-family: 'Georgia', serif;
		display: block;
		margin-top: 5px;
		font-style: italic;
	}

	.modes-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 10px;
	}

	.mode-checkbox {
		font-size: 17px;
		display: flex;
		align-items: center;
		gap: 11px;
		background: #35205788;
		border-radius: 8px;
		padding: 11px 13px;
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
		padding: 14px 22px;
		font-size: 19px;
		background: linear-gradient(90deg,#ffe08a,#ad9747);
		color: #502b00;
		border: 2px solid #f8e1b7;
		border-radius: 10px;
		font-family: inherit;
		cursor: pointer;
		font-weight: bold;
		transition: background 0.2s, color 0.2s, box-shadow 0.17s;
		box-shadow: 0 2px 8px #a3781e29;
	}
	.start-btn:disabled {
		background: #fff8e147;
		color: #b3a270;
		opacity: 0.67;
		cursor: not-allowed;
	}
	.start-btn:hover:enabled {
		background: linear-gradient(100deg, #ffefae, #f5c752 140%);
		color: #9b6509;
	}

	@media (max-width: 900px) {
		.theme-content { flex-direction: column; gap: 18px; }
		.learning-modes-block { margin-top: 18px; }
		.theme-board-container { padding: 16px 2px 16px 2px;}
	}
	@media (max-width: 700px) {
		.theme-title { font-size: 21px; }
		.learning-modes-block { padding: 14px 8px 20px 8px; }
	}

	.no_learning-modes {
		background: linear-gradient(105deg, #2a1843 80%, #68400e 140%);
		border: 3px solid #ffe8b8cc;
		border-radius: 14px;
		box-shadow: 0 0 18px #e1ae3680, 0 2px 16px #6743122c inset;
		padding: 36px 18px 36px 18px;
		color: #ffe8b8;
		text-align: center;
		font-size: 20px;
		font-family: 'Uncial Antiqua', cursive;
		letter-spacing: 0.04em;
		text-shadow: 0 1.5px 12px #a3771e80, 0 0 2px #fff0dc;
		opacity: 0.93;
		transition: box-shadow 0.19s, border 0.15s, background 0.18s;
		animation: fadeInNoTopic 0.5s;
		margin-top: 36px;
	}

	@keyframes fadeInNoTopic {
		from { opacity: 0; transform: scale(0.98) translateY(14px);}
		to { opacity: 0.93; transform: scale(1) translateY(0);}
	}

</style>
