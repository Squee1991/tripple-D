<template>
	<div class="theme-board-container">
		<div class="theme-board">
			<h2 class="title">Выбери тему</h2>
			<div class="theme-grid">
				<div v-for="(label, key) in nameMap"
				     :key="key"
				     class="theme-card"
				     @click="goToLearning(key)"
				>
					<div class="card-counter">
						{{ themeProgress[key]?.learned || 0 }}/{{ themeProgress[key]?.total || 0 }}
					</div>
					<div class="theme-card-header">
						<span class="theme-title">{{ label }}</span>
					</div>
					<div class="card-art"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { userlangStore } from '../store/learningStore.js'
	import { useRouter } from 'vue-router'
	import {onMounted, ref} from 'vue'
	const themeList = ref({})
	const learnedWords = ref([])
	const langStore = userlangStore()
	const router = useRouter()

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

	const themeProgress = computed(() => {
		return Object.fromEntries(
			Object.entries(themeList.value).map(([key, words]) => {
				const learned = words.filter(w => learnedWords.value.includes(w.de)).length
				const total = words.length
				return [key, { learned, total }]
			})
		)
	})

	const modes = [
		{ key: 'article', label: 'Вписать артикль' },
		{ key: 'letters', label: 'Собрать слово по буквам' },
		{ key: 'wordArticle', label: 'Вписать слово и артикль' },
		{ key: 'plural', label: 'Форма множественного числа' },
		{ key: 'audio', label: 'Аудирование' }
	]

	const goToLearning = async (topicKey) => {
		try {
			const response = await fetch('/words.json')
			const data = await response.json()

			const incomingWords = (data[topicKey] || []).map(word => ({
				...word,
				topic: topicKey,
				progress: {}
			}))

			for (const word of incomingWords) {
				const exists = langStore.words.find(w => w.de === word.de && w.topic === word.topic)
				if (!exists) langStore.words.push(word)
			}

			await langStore.setSelectedTopics([topicKey])
			await langStore.saveToFirebase()

			router.push({
				name: 'howtolearn',
				query: {
					topic: topicKey,
					mode: 'article'
				}
			})
		} catch (e) {

		}
	}


	onMounted(async () => {
		const res = await fetch('/words.json')
		const data = await res.json()
		themeList.value = data
	})

</script>




<style scoped>
	.theme-board {
		max-width: 1300px;
		margin: 0 auto;
		background: #4a331e;
		border: 8px solid #a0713d;
		padding: 20px;
		border-radius: 16px;
		box-shadow: 0 0 14px #1e0f06;
		color: #fff4d8;
		font-family: 'Georgia', serif;
	}

	.theme-board-container {
		background: linear-gradient(#6c4326, #3a2414);
		padding: 30px;
	}

	.title {
		font-size: 40px;
		margin-bottom: 35px;
		text-align: center;
		color: #ffe4a3;
	}

	.theme-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 20px;
	}

	.theme-card {
		background: linear-gradient(#7a5234, #3f2715);
		border: 4px solid #a0723e;
		border-radius: 12px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 120px;
		position: relative;
		box-shadow: 0 0 14px rgba(0, 0, 0, 0.7);
		cursor: pointer;
		transition: transform 0.2s;
	}

	.theme-card:hover {
		transform: scale(1.03);
	}

	.theme-card-header {
		display: flex;
		justify-content: center;
		font-size: 16px;
		font-weight: bold;
		color: #f5d29b;
	}

	.card-art {
		flex-grow: 1;
		background-size: cover;
		border-radius: 6px;
		margin-top: 8px;
	}

	.card-counter {
		position: absolute;
		top: -10px;
		left: -10px;
		background: linear-gradient(#e5a758, #a7681b);
		border: 2px solid #fff0c5;
		color: #2e1a00;
		font-weight: bold;
		font-size: 14px;
		padding: 10px 10px;
		border-radius: 50%;
		box-shadow: 0 0 4px #000;
		text-shadow: 1px 1px 0 #f5f5f5;
		z-index: 2;
	}

</style>
