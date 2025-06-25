<template>
	<div class="achievements-page-container">
		<aside class="sidebar">
			<nav>
				<h3 class="sidebar-title">{{ t('categoryAchievments.categoryLabel')}}</h3>
				<ul class="achievement-categories">
					<template v-for="category in achievementCategories" :key="category.id">
						<li
							:class="{ 'active': selectedCategory === category.id, 'has-submenu': category.submenu }"
							@click="category.submenu ? toggleSubmenu(category.id) : selectCategory(category.id)"
							class="category-item"
						>
							<span class="category-icon">{{ category.icon }}</span>
							<span>{{ t(category.name) }}</span>
							<img v-if="category.submenu"
							     class="submenu-arrow"
							     :class="{ 'rotated': openSubmenus[category.id] }"
							     src="../assets/images/arrowNav.svg" alt="11">
						</li>
						<ul v-if="category.submenu && openSubmenus[category.id]" class="submenu">
							<li
								v-for="subItem in category.submenu"
								:key="subItem.id"
								:class="{ 'active': selectedCategory === subItem.id }"
								@click="selectCategory(subItem.id)"
								class="submenu-item"
							>
								<span v-if="subItem.icon" class="submenu-icon">{{ subItem.icon }}</span>
								<span>{{ t(subItem.name) }}</span>
							</li>
						</ul>
					</template>
				</ul>
			</nav>
		</aside>
		<main class="content-area">
			<header class="content-header">
				<h1> {{ t('categoryAchievments.achievmentAreaLabel')}}</h1>
			</header>
			<div class="category-content">
				<ClientOnly>
					<p v-if="selectedCategory === 'overall'" class="category-description">
						<OverallAchievments/>
					</p>
					<p v-else-if="selectedCategory === 'guessWord'" class="category-description">
						<GuessAchievementDisplay/>
					</p>
					<p v-else-if="selectedCategory === 'special'" class="category-description">
						<SpecialAchievments/>
					</p>
					<p v-else-if="selectedCategory === 'marathon'" class="category-description">
						Здесь общие достижения для Марафона.
					</p>
					<p v-else-if="selectedCategory === 'articles'" class="category-description">
						Осваивайте артикли и открывайте новые вехи в изучении! (Общая по артиклям)
					</p>
					<p v-else-if="selectedCategory === 'article'" class="category-description">
						Достижения для метода "Вписать артикль".
					</p>
					<p v-else-if="selectedCategory === 'buildWord'" class="category-description">
						Показывает ваш прогресс в составлении слов из букв.
					</p>
					<p v-else-if="selectedCategory === 'writeWord'" class="category-description">
						Здесь достижения за правильное вписывание слов и артиклей.
					</p>
					<p v-else-if="selectedCategory === 'pluralForm'" class="category-description">
						Достижения, связанные с освоением форм множественного числа.
					</p>
					<p v-else-if="selectedCategory === 'listening'" class="category-description">
						Ваши успехи в развитии навыков аудирования.
					</p>
					<div v-if="selectedCategory === 'guessWord'" class="achievements-list"></div>
					<div v-if="selectedCategory === 'marathon'" class="achievements-list">Марафон</div>
					<div v-if="selectedCategory === 'easy'" class="achievements-list">
						<EasyModeAchieve/>
					</div>
					<div v-if="selectedCategory === 'normal'" class="achievements-list">
						<NormalModeAchieve/>
					</div>
					<div v-if="selectedCategory === 'hard'" class="achievements-list">
						<HardModeAchieve/>
					</div>
					<div v-if="selectedCategory === 'article'" class="achievements-list"></div>
				</ClientOnly>
			</div>
		</main>
	</div>
</template>

<script setup>
	import {ref, computed} from 'vue';
	import GuessAchievementDisplay from '../src/components/guessAchievment.vue';
	import OverallAchievments from '../src/components/overallAchiements.vue';
	import EasyModeAchieve from '../src/components/easyModeAchieve.vue'
	import NormalModeAchieve from '../src/components/normalModeAchieve.vue'
	import HardModeAchieve from '../src/components/hardModeAchieve.vue'
	import SpecialAchievments from '../src/components/specialAсhievments.vue'
	import { useI18n } from 'vue-i18n';
	const {t} = useI18n()

	const selectedCategory = ref('overall');

	const openSubmenus = ref({
		marathon: false,
		articles: false
	});

	const achievementCategories = [
		{
			id: 'overall',
			name: 'categoryAchievments.general',
			icon: '🏆'
		},
		{
			id: 'guessWord',
			name: 'categoryAchievments.guess',
			icon: '🧠',
		},
		{
			id: 'marathon',
			name: 'categoryAchievments.marathon',
			icon: '🏃',
			submenu: [
				{id: 'easy', name: 'categoryAchievments.easy', icon: '🟢'},
				{id: 'normal', name: 'categoryAchievments.normal', icon: '🟡'},
				{id: 'hard', name: 'categoryAchievments.hard', icon: '🔴'},
			]
		},
		{
			id: 'articles',
			name: 'categoryAchievments.practice',
			icon: '📚',
			submenu: [
				{id: 'article', name: 'categoryAchievments.writeArticle', icon: '📝'},
				{id: 'buildWord', name: 'categoryAchievments.wordFromLetters', icon: '🧩'},
				{id: 'writeWord', name: 'categoryAchievments.wordPlusArticle', icon: '✍️'},
				{id: 'pluralForm', name: 'categoryAchievments.plural', icon: '🔢'},
				{id: 'listening', name: 'categoryAchievments.audio', icon: '👂'},
			]
		},
		{
			"id": "special",
			"name": "categoryAchievments.special",
			"icon": "🌟"
		}
	]

	const selectCategory = (categoryId) => {
		selectedCategory.value = categoryId;
		const parentCategory = achievementCategories.find(cat =>
			cat.submenu && cat.submenu.some(sub => sub.id === categoryId)
		);
		if (parentCategory && !openSubmenus.value[parentCategory.id]) {
			openSubmenus.value[parentCategory.id] = true;
		}
	};

	const toggleSubmenu = (categoryId) => {
		openSubmenus.value[categoryId] = !openSubmenus.value[categoryId];
		selectedCategory.value = categoryId;
	};

</script>

<style scoped>
	.achievements-page-container {
		display: flex;
		background-color: #f0f2f5;
		font-family: Arial, sans-serif;
		color: #333;
		height: 100vh;
	}

	.sidebar {
		min-width: 320px;
		background-color: #333;
		color: #fff;
		padding: 20px 0;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
	}

	.sidebar-title {
		text-align: center;
		margin-bottom: 25px;
		color: #ffd700;
		font-size: 1.4em;
		font-weight: bold;
		text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
	}

	.achievement-categories {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.category-item {
		padding: 12px 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.1em;
		border-left: 5px solid transparent;
		transition: background-color 0.2s ease, border-left-color 0.2s ease;
		position: relative;
	}

	.category-item:hover {
		background-color: #555;
	}

	.category-item.active {
		background-color: #007bff;
		border-left-color: #ffd700;
		font-weight: bold;
	}

	.category-icon, .submenu-icon {
		font-size: 1.2em;
	}

	.submenu-arrow {
		transition: .2s;
		width: 20px;
		transform: scale(1);
	}

	.submenu-arrow.rotated {
		transform: scale(-1);
		transition: .2s;
	}

	.submenu {
		background-color: #444;
	}

	.submenu-item {
		padding: 10px 20px 10px 40px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 1em;
		border-left: 5px solid transparent;
		transition: background-color 0.2s ease, border-left-color 0.2s ease;
	}

	.submenu-item:hover {
		background-color: #666;
	}

	.submenu-item.active {
		background-color: #007bff;
		border-left-color: #ffd700;
		font-weight: bold;
	}

	.content-area {
		flex-grow: 1;
		padding: 30px;
		background-color: #fff;
		border-radius: 8px;
		margin: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 2px solid #eee;
	}

	.content-header h1 {
		font-size: 2em;
		color: #2c3e50;
		margin: 0;
	}

	.achievement-points {
		font-size: 1.3em;
		font-weight: bold;
		color: #ffd700;
		background-color: #444;
		padding: 8px 15px;
		border-radius: 20px;
		display: flex;
		align-items: center;
		gap: 8px;
		box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
	}

	.points-icon {
		font-size: 1.5em;
	}

	.category-content {
		flex-grow: 1;
	}

	.category-description {
		font-size: 1.1em;
		color: #666;
		margin-bottom: 25px;
	}

</style>