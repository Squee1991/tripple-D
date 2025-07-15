<template>
    <div class="achievements-page-container">
        <div class="sidebar">
            <button class="btn__back" @click="backToMainPage">{{ t('chooseTheme.btnBack')}}</button>
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
        <main class="content-area" >
            <header class="content-header">
                <h1>{{ t('categoryAchievments.achievmentAreaLabel')}}</h1>
            </header>
            <div class="category-content" data-simplebar>
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
        height: 100vh;
        padding: 2rem;
        gap: 2rem;
        background-color: #fef8e4;
        font-family: "Nunito", sans-serif;
        box-sizing: border-box;
    }

    .sidebar {
        min-width: 400px;
        max-width: 400px;
        background-color: #ffffff;
        color: #1e1e1e;
        padding: 1.5rem;
        border-radius: 24px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0px #1e1e1e;
        display: flex;
        flex-direction: column;
    }

    .btn__back {
        width: 100%;
        border: 3px solid #1e1e1e;
        padding: 15px;
        background: #f1c40f;
        border-radius: 16px;
        cursor: pointer;
        color: #1e1e1e;
        font-size: 1.2rem;
        font-family: "Nunito", sans-serif;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
        margin-bottom: 1.5rem;
    }

    .btn__back:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    .sidebar-title {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #1e1e1e;
        font-size: 2rem;
    }

    .nav__sidebar {
        flex: 1;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .nav__sidebar::-webkit-scrollbar {
        display: none;
    }

    .nav__sidebar::-webkit-scrollbar-thumb {
        background: #1e1e1e;
        border-radius: 6px;
        border: 3px solid #fef8e4;
    }

    .achievement-categories {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .category-item, .submenu-item {
        padding: 1rem 1.25rem;
        margin-bottom: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 1.1rem;
        border-radius: 16px;
        transition: background-color 0.2s ease;
    }

    .category-item:hover, .submenu-item:hover {
        background-color: #fef8e4;
    }

    .category-item.active, .submenu-item.active {
        background-color: #4ade80;
        font-weight: 400;
    }

    .submenu-arrow {
        transition: transform .2s ease;
        width: 20px;
        margin-left: auto;
    }

    .submenu-arrow.rotated {
        transform: rotate(90deg);
    }

    .submenu {
        padding-left: 20px;
        margin-top: 10px;
    }

    .sub__item-length {
        margin-left: auto;
        min-width: 30px;
        height: 30px;
        padding: 0 5px;
        display: flex;
        color: #1e1e1e;
        font-weight: 400;
        justify-content: center;
        align-items: center;
        background: #e0e0e0;
        border: 2px solid #1e1e1e;
        border-radius: 100px;
        font-size: 0.9rem;
    }

    .active .sub__item-length {
        background-color: #fff;
    }

    .content-area {
        flex-grow: 1;
        padding: 2rem;
        background-color: #60a5fa;
        border-radius: 24px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0px #1e1e1e;
        display: flex;
        flex-direction: column;
        overflow: hidden;

    }

    .content-header {
        padding: 0 0 1.5rem 0;
        margin-bottom: 1.5rem;
        border-bottom: 3px solid rgba(27, 27, 27, 0.5);
        text-align: center;
    }

    .content-header h1 {
        font-size: 2.5em;
        color: #1e1e1e;
        margin: 0;
    }

    .category-content {
        flex: 1;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 18px;
        padding: 1.5rem;
        min-height: 0;
    }

    .category-description {
        font-size: 1.2em;
        color: #1e1e1e;
    }

</style>