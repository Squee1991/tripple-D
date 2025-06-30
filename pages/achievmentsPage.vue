<template>
	<div class="achievements-page-container">
		<div class="sidebar">
			<button class="btn__back" @click="backToMainPage">На главную</button>
			<nav class="nav__sidebar" data-simplebar>
				<h3 class="sidebar-title">{{ t('categoryAchievments.categoryLabel')}}</h3>
				<ul class="achievement-categories">
					<template v-for="category in achievementCategories" :key="category.id">
						<li
							:class="{
                        'active': selectedId === category.id || (category.submenu && category.submenu.some(sub => sub.id === selectedId)),
                        'has-submenu': category.submenu
                        }"
							@click="handleCategoryClick(category)"
							class="category-item"
						>
							<span class="category-icon">{{ category.icon }}</span>
							<span>{{ t(category.name) }}</span>
							<img v-if="category.submenu"
							     class="submenu-arrow"
							     :class="{ 'rotated': openSubmenus[category.id] }"
							     src="../assets/images/arrowNav.svg" alt="Стрелка">
							<span class="sub__item-length">{{ category.length}}</span>
						</li>
						<ul v-if="category.submenu && openSubmenus[category.id]" class="submenu">
							<li
								v-for="subItem in category.submenu"
								:key="subItem.id"
								:class="{ 'active': selectedId === subItem.id }"
								@click.stop="handleContentClick(subItem.id)"
								class="submenu-item"
							>
								<span v-if="subItem.icon" class="submenu-icon">{{ subItem.icon }}</span>
								<span class="sub__item">{{ t(subItem.name) }}</span>
								<span class="sub__item-length"> {{ subItem.length}}</span>
							</li>
						</ul>
					</template>
				</ul>
			</nav>
		</div>
		<main class="content-area">
			<header class="content-header">
				<h1>{{ t('categoryAchievments.achievmentAreaLabel')}}</h1>
			</header>
			<div class="category-content">
				<ClientOnly>
					<div :class="wrapperClass">
						<component v-if="currentContent" :is="currentContent"/>
					</div>
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
	import WriteArticle from '../src/components/writeArticleAchievment.vue'
	import WordsFromLetters from '../src/components/wordFromLetters.vue'
	import WordsPlusArticle from '../src/components/wordPlusArticle.vue'
	import Plural from '../src/components/pluralAcvievements.vue'
	import Listen from '../src/components/listenAchievements.vue'
	import {overAchievment} from '../src/achieveGroup/overAllAchieve/overallAchievements.js'
	import {guessAchievment} from '../src/achieveGroup/guessAchieve/guessAchievments.js'
	import {cpecialGroupAchievment} from '../src/achieveGroup/specialAchieve/specialAchievment.js'
	import {groupedEasyModeAchievements} from '../src/achieveGroup/marathon/easyModeAchievment.js'
	import {groupedNormalModeAchievements} from '../src/achieveGroup/marathon/normalModeAchievement.js'
	import {groupedHardModeAchievements} from '../src/achieveGroup/marathon/hardModeAchievments.js'
	import {listenAchieveGroup} from '../src/achieveGroup/article/listen'
	import {pluraGroupAchievment} from '../src/achieveGroup/article/plural.js'
	import {wordPlusArticleAchievment} from '../src/achieveGroup/article/wordPlusArticle.js'
	import {assembleWordGroupAchievement} from '../src/achieveGroup/article/wordsFromLetters.js'
	import {writeArticleGroupAchievment} from '../src/achieveGroup/article/writeArticle.js'
	import {useRouter} from 'vue-router'

	const router = useRouter()
	const {t} = useI18n();
	const selectedId = ref('overall');
	const contentId = ref('overall');
	const backToMainPage = () => {
		router.push('/')
	}
	const openSubmenus = ref({
		marathon: false,
		articles: false
	});
	const contentMap = {
		overall: OverallAchievments,
		guessWord: GuessAchievementDisplay,
		special: SpecialAchievments,
		article: WriteArticle,
		buildWord: WordsFromLetters,
		writeWord: WordsPlusArticle,
		pluralForm: Plural,
		listening: Listen,
		easy: EasyModeAchieve,
		normal: NormalModeAchieve,
		hard: HardModeAchieve
	};
	const currentContent = computed(() => contentMap[contentId.value]);
	const wrapperClass = computed(() => {
		const listCategories = ['easy', 'normal', 'hard'];
		return listCategories.includes(contentId.value)
			? 'achievements-list'
			: 'category-description';
	});
	const allAchievementsData = {
		overall: overAchievment,
		guessWord: guessAchievment,
		easy: groupedEasyModeAchievements,
		normal: groupedNormalModeAchievements,
		hard: groupedHardModeAchievements,
		article: writeArticleGroupAchievment,
		buildWord: assembleWordGroupAchievement,
		writeWord: wordPlusArticleAchievment,
		pluralForm: pluraGroupAchievment,
		listening: listenAchieveGroup,
		special: cpecialGroupAchievment,
	};
	const countNestedAchievements = (dataArray) => {
		let count = 0;
		if (dataArray) {
			dataArray.forEach(group => {
				if (group.achievements) {
					count += group.achievements.length;
				}
			});
		}
		return count;
	};
	const modeComputed = computed(() => {
		let easyCount = 0
		if (allAchievementsData.easy) {
			easyCount = countNestedAchievements(allAchievementsData.easy);
		}
		let normalCount = 0
		if (allAchievementsData.normal) {
			normalCount = countNestedAchievements(allAchievementsData.normal);
		}
		let hardCount = 0
		if (allAchievementsData.hard) {
			hardCount = countNestedAchievements(allAchievementsData.hard);
		}
		let special = 0
		if (allAchievementsData.special) {
			special = countNestedAchievements(allAchievementsData.special)
		}
		let overall = 0
		if (allAchievementsData.overall) {
			overall = countNestedAchievements(allAchievementsData.overall)
		}
		let guesss = 0
		if (allAchievementsData.guessWord) {
			guesss = countNestedAchievements(allAchievementsData.guessWord)
		}
		return {
			easy: easyCount,
			normal: normalCount,
			hard: hardCount,
			special: special,
			overall: overall,
			guessWord: guesss,
			total: easyCount + normalCount + hardCount
		}
	});
	const articleComputed = computed(() => {
		const articleCount = countNestedAchievements(allAchievementsData.article);
		const buildWordCount = countNestedAchievements(allAchievementsData.buildWord);
		const writeWordCount = countNestedAchievements(allAchievementsData.writeWord);
		const pluralFormCount = countNestedAchievements(allAchievementsData.pluralForm);
		const listeningCount = countNestedAchievements(allAchievementsData.listening);
		return {
			article: articleCount,
			buildWord: buildWordCount,
			writeWord: writeWordCount,
			pluralForm: pluralFormCount,
			listening: listeningCount,
			total: articleCount + buildWordCount + writeWordCount + pluralFormCount + listeningCount
		};
	});
	const achievementCategories = computed(() => [
		{
			id: 'overall',
			name: 'categoryAchievments.general',
			icon: '🏆',
			length: modeComputed.value.overall,
		},
		{
			id: 'guessWord',
			name: 'categoryAchievments.guess',
			icon: '🧠',
			length: modeComputed.value.guessWord,
		},
		{
			id: 'marathon',
			name: 'categoryAchievments.marathon',
			icon: '🏃',
			length: modeComputed.value.total,
			submenu: [
				{
					id: 'easy',
					name: 'categoryAchievments.easy',
					icon: '🟢',
					length: modeComputed.value.easy
				},
				{
					id: 'normal',
					name: 'categoryAchievments.normal',
					icon: '🟡',
					length: modeComputed.value.normal,
				},
				{
					id: 'hard',
					name: 'categoryAchievments.hard',
					icon: '🔴',
					length: modeComputed.value.hard,
				},
			]
		},
		{
			id: 'articles',
			name: 'categoryAchievments.practice',
			icon: '📚',
			length: articleComputed.value.total,
			submenu: [
				{
					id: 'article',
					name: 'categoryAchievments.writeArticle',
					icon: '📝',
					length: articleComputed.value.article,
				},
				{
					id: 'buildWord',
					name: 'categoryAchievments.wordFromLetters',
					icon: '🧩',
					length: articleComputed.value.buildWord,
				},
				{
					id: 'writeWord',
					name: 'categoryAchievments.wordPlusArticle',
					icon: '✍️',
					length: articleComputed.value.writeWord,
				},
				{
					id: 'pluralForm',
					name: 'categoryAchievments.plural',
					icon: '🔢',
					length: articleComputed.value.pluralForm,
				},
				{
					id: 'listening',
					name: 'categoryAchievments.audio',
					icon: '👂',
					length: articleComputed.value.listening,
				},
			]
		},
		{
			id: "special",
			name: "categoryAchievments.special",
			icon: "🌟",
			length: modeComputed.value.special,
		}
	]);
	const handleContentClick = (id) => {
		contentId.value = id;
		selectedId.value = id;
	};
	const handleCategoryClick = (category) => {
		selectedId.value = category.id;
		if (category.submenu) {
			openSubmenus.value[category.id] = !openSubmenus.value[category.id];
		} else {
			contentId.value = category.id;
		}
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

	.nav__sidebar {
		position: relative;
		overflow: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.nav__sidebar::-webkit-scrollbar {
		display: none;
	}

	.sub__item-length {
		margin-left: auto;
		width: 25px;
		height: 25px;
		display: flex;
		color: black;
		font-weight: bold;
		justify-content: center;
		align-items: center;
		background: #ffd700;;
		border-radius: 50%;
		font-size: 12px;
	}

	.btn__back {
		margin: 0px 30px 20px 30px;
		padding: 10px;
		border-radius: 15px;
		border: 3px solid #007bff;
		cursor: pointer;
		font-size: 20px;
		font-weight: bold;
		transition: .3s;
	}

	.btn__back:hover {
		background: #007bff;
		color: white;
		transition: .3s;
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
		background-color: #133f71;
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

	.category-description {
		font-size: 1.1em;
		color: #666;
		margin-bottom: 25px;
		flex: 1;
	}

</style>