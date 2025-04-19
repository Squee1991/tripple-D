<template>
	<div>
		<header class="header">
			<div class="header__title">
				<div class="cabinet">
					<NuxtLink class="cabinet__value" to="/archieve"> Кабинет</NuxtLink>
				</div>
				<div class="log__ing-btns">
					<button class="log__in">Log in</button>
					<button class="log__in">Sing out</button>
				</div>
			</div>
			<div class="wrapper__header">
				<div class="header__themen toggler">
					<div class="option" :class="{ selected: selectedCategory === 'nouns' }"
					     @click.stop="selectCategory('nouns')">Существительные
					</div>
					<div class="option" :class="{ selected: selectedCategory === 'verbs' }"
					     @click.stop="selectCategory('verbs')">Глаголы
					</div>
					<div class="option" :class="{ selected: selectedCategory === 'pronouns' }"
					     @click.stop="selectCategory('pronouns')">Местоимения
					</div>
					<div class="option" :class="{ selected: selectedCategory === 'alphabet' }"
					     @click.stop="selectCategory('alphabet')">Алфавит
					</div>
				</div>
				<div :class="['nav', { open: selectedCategory === 'nouns' }]">
					<div class="pagination" v-if="totalPages > 1">
						<button class="page-btn prew" @click="prevPage" :disabled="currentPage === 1">
							<img class="img-btn-prew" src="../../assets/images/arrow-prev-small.svg" alt="">
						</button>
						<button class="page-btn next" @click="nextPage" :disabled="currentPage === totalPages">
							<img class="img-btn-prew" src="../../assets/images/arrow-next.svg" alt="">
						</button>
					</div>
					<div class="list">
						<span
							v-for="(ruTitle, key) in paginatedTitles"
							:key="key"
							class="list__item"
							:class="{ active: isSelected(key) }"
							@click="toggleTopic(key)">
							<span class="label">{{ ruTitle }}</span>
						</span>
					</div>
				</div>
				<div class="words__right">
					<div v-if="selectedCategory === 'verbs'" class="go-btn-wrapper">
						<img src="../../assets/images/developer.svg" alt="">
						<div class="verbs__error">Раздел "Глаголы" в разработке.</div>
					</div>
					<div class="words__choiced" v-if="topicsLoaded">
						<div v-if="selectedCategory === 'alphabet'">
							<Alphabet />
						</div>
						<div v-else-if="selectedCategory === 'pronouns'">
							<Pronouns />
						</div>
						<Topic v-if="selectedTopics.length" :key="selectedTopics.join('-')" :selected-topics="selectedTopics" />
					</div>

				</div>
			</div>
		</header>
	</div>
</template>

<script setup>
	import {ref, onMounted, computed} from 'vue'
	import Topic from '../../pages/topic.vue'
	import Alphabet from './alphabet.vue'
	import Pronouns from "./pronouns";
	const currentPage = ref(1)
	const pageSize = 10
	const topicsLoaded = ref(false)
	const words = ref([])
	const topicTitles = ref({})
	const selectedTopics = ref([])
	const fullData = ref({})
	const isOpen = ref(false)
	const selectedCategory = ref('nouns')

	const currentTopicName = computed(() => {
		if (selectedCategory.value === 'pronouns') {
			return 'pronouns'
		}
		if (selectedCategory.value === 'alphabet') {
			return 'alphabet'
		}
		if (selectedCategory.value === 'verbs') {
			return 'verbs'
		}
		if (selectedCategory.value === 'rules') {
			return 'rules'
		}
		if (selectedCategory.value === 'nouns') {
			if (selectedTopics.value.length) {
				return selectedTopics.value[selectedTopics.value.length - 1]
			}
			return 'nouns'
		}
		return 'unknown'
	})
	const totalPages = computed(() =>
		Math.ceil(Object.keys(topicTitles.value).length / pageSize)
	)

	const paginatedTitles = computed(() => {
		const keys = Object.keys(topicTitles.value)
		const start = (currentPage.value - 1) * pageSize
		const end = start + pageSize
		return keys.slice(start, end).reduce((acc, key) => {
			acc[key] = topicTitles.value[key]
			return acc
		}, {})
	})

	function nextPage() {
		if (currentPage.value < totalPages.value) currentPage.value++
	}

	function prevPage() {
		if (currentPage.value > 1) currentPage.value--
	}

	async function loadTopics() {
		const res = await fetch('/words.json')
		const data = await res.json()


		topicTitles.value = Object.keys(data).reduce((acc, key) => {
			acc[key] = nameMap[key] || key
			return acc
		}, {})

		fullData.value = data
	}

	function selectCategory(category) {
		selectedCategory.value = category
		localStorage.setItem('selectedCategory', category)
	}

	function isSelected(key) {
		return selectedTopics.value.includes(key)
	}

	function toggleTopic(key) {
		if (isSelected(key)) {
			selectedTopics.value = selectedTopics.value.filter(k => k !== key)
		} else {
			selectedTopics.value.push(key)
		}
		localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics.value))
		topicsLoaded.value = true
	}

	onMounted(async () => {
		await loadTopics()
		const saved = localStorage.getItem('selectedTopics')
		if (saved) {
			try {
				selectedTopics.value = JSON.parse(saved)
			} catch (e) {
				console.error('Ошибка при чтении selectedTopics из localStorage', e)
			}
		}
		const savedCategory = localStorage.getItem('selectedCategory')
		if (savedCategory) {
			selectedCategory.value = savedCategory
		}
		topicsLoaded.value = true
	})
</script>


<style scoped>

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.log__in {
		color: white;
		background: none;
		margin-right: 10px;
		border: 1px solid green;
		padding: 10px 20px;
		border-radius: 5px;
		transition: .4s;
		min-width: 100px;
	}

	.verbs__error {
		color: white;
	}

	.log__in:hover {
		background: green;
		transition: .4s;
	}

	.log__ing-btns {
		padding: 10px;
	}

	.no__themen {
		color: white;
		font-size: 20px;
	}

	.header {
		text-align: center;
		max-width: 100%;
		margin: 0 auto;
		padding: 20px;
		background-color: #f0f4f7;
		border-bottom: 2px solid #cce0d0;
	}

	.no__themen-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.wrapper__header {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.header__title {
		background: #1b1b1b;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.cabinet {
		background: #2e7d32;
		color: white;
		padding: 10px 20px;
		border-radius: 10px;
		font-weight: bold;
		transition: background 0.3s ease;
	}

	.cabinet:hover {
		background: #1b5e20;
	}

	.cabinet__value {
		color: white;
		text-decoration: none;
	}

	.header__themen {
		display: flex;
		flex-direction: column;
		background-color: #263238;
		padding: 10px;
		border-radius: 12px;
		min-width: 170px;
	}

	.option {
		padding: 10px 15px;
		font-weight: 600;
		border-radius: 8px;
		margin-bottom: 8px;
		cursor: pointer;
		background: white;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.option:hover {
		background: #aed581;
	}

	.option.selected {
		background: #81c784;
		color: white;
	}

	.nav {
		background-color: #263238;
		border-radius: 12px;
		padding: 10px;
		color: white;
		width: 180px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.list__item {
		background: white;
		color: #1b1b1b;
		border-radius: 10px;
		padding: 8px 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.list__item:hover {
		background: #f1f8e9;
	}

	.list__item.active {
		background: #a5d6a7;
		color: #1b5e20;
	}

	.label {
		font-size: 16px;
	}

	.words__right {
		position: relative;
		flex: 1;
		background-color: #263238;
		border-radius: 15px;
		padding: 0 10px;
		min-height: 666px;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 5px;
		gap: 10px;
	}

	.page-btn {
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.page-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.img-btn-prew {
		width: 24px;
		height: 24px;
	}

	.go-btn-wrapper {
		text-align: center;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 18px;
		color: #444;
	}

	@media (max-width: 768px) {
		.wrapper__header {
			flex-direction: column;
		}

		.header__themen,
		.nav {
			width: 100%;
		}
	}


</style>
