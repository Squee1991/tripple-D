<template>
  <div class="achievements-page-container">
    <Modal
        :visible="achInfo"
        @close="hideInfo"
        :title="infoAch.title"
        :img="infoAch.icon"
        :text="infoAch.text"
    />
    <div class="sidebar">
      <button class="btn__back" @click="backToMainPage">{{ t('chooseTheme.btnBack') }}</button>
      <nav class="nav__sidebar" ref="scrollRef">
        <h3 class="sidebar-title">{{ t('categoryAchievments.categoryLabel') }}</h3>
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
              <span class="sub__item-length">{{ category.length }}</span>
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
                <span class="sub__item-length"> {{ subItem.length }}</span>
              </li>
            </ul>
          </template>
        </ul>
      </nav>
    </div>
    <main class="content-area">
      <header class="content-header">
        <h1>{{ t('categoryAchievments.achievmentAreaLabel') }}</h1>
        <button :title="t('hoverTitle.ach')" @click="showInfo" class="header__icon-info">
          <img :src=Quest alt="">
        </button>
      </header>
      <div class="category-content" ref="scrollRef">
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
import {ref, computed, inject, nextTick, onMounted} from 'vue';
import GuessAchievementDisplay from '../src/components/guessAchievment.vue';
import OverallAchievments from '../src/components/overallAchiements.vue';
import EasyModeAchieve from '../src/components/easyModeAchieve.vue'
import NormalModeAchieve from '../src/components/normalModeAchieve.vue'
import HardModeAchieve from '../src/components/hardModeAchieve.vue'
import SpecialAchievments from '../src/components/specialAсhievments.vue'
import WriteArticle from '../src/components/writeArticleAchievment.vue'
import WordsFromLetters from '../src/components/wordFromLetters.vue'
import WordsPlusArticle from '../src/components/wordPlusArticle.vue'
import SentenceAchievement from '../src/components/sentenceAchievement.vue'
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
import {sentenceAchievement} from '../src/achieveGroup/sentenceDuel/sentenceAchievementsА1.js'
import Modal from '../src/components/modal.vue'
import AchIcon from '../assets/images/target.svg'
import Quest from '../assets/images/question.svg'
import {useRouter} from 'vue-router'

const scrollRef = ref(null)
const {$SimpleBar} = useNuxtApp()
const router = useRouter()
const {t} = useI18n();
const selectedId = ref('overall');
const contentId = ref('overall');
const achInfo = ref(false)
const backToMainPage = () => {
  router.push('/')
}

const showInfo = () => {
  achInfo.value = true
}
const num = 1
const hideInfo = () => {
  achInfo.value = false
}

const infoAch = ref({
  title: t('achModal.title'),
  icon: AchIcon,
  text: t('achModal.text')
})

onMounted(() => {
  nextTick(() => {
    if (scrollRef.value && $SimpleBar) {
      new $SimpleBar(scrollRef.value, {
        autoHide: false
      })
    }
  })
})

const openSubmenus = ref({
  marathon: false,
  articles: false
});

const contentMap = {
  sentence: SentenceAchievement,
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
  hard: HardModeAchieve,
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
  sentence: sentenceAchievement
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
  let senten = 0
  if (allAchievementsData.sentence) {
    senten = countNestedAchievements(allAchievementsData.sentence)
  }
  return {
    easy: easyCount,
    normal: normalCount,
    hard: hardCount,
    special: special,
    overall: overall,
    guessWord: guesss,
    sentence: senten,
    total: easyCount + normalCount + hardCount
  }
});
const articleComputed = computed(() => {
  const articleCount = countNestedAchievements(allAchievementsData.article);
  const buildWordCount = countNestedAchievements(allAchievementsData.buildWord);
  const writeWordCount = countNestedAchievements(allAchievementsData.writeWord);
  const pluralFormCount = countNestedAchievements(allAchievementsData.pluralForm);
  const listeningCount = countNestedAchievements(allAchievementsData.listening);
  const sentenceCount = countNestedAchievements(allAchievementsData.sentence)
  return {
    article: articleCount,
    buildWord: buildWordCount,
    writeWord: writeWordCount,
    pluralForm: pluralFormCount,
    listening: listeningCount,
    sentence: sentenceCount,
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
    id: 'sentence',
    name: 'categoryAchievments.duel',
    icon: '⚔️',
    length: modeComputed.value.sentence,
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


.header__icon-info {
  width: 60px;
  cursor: pointer;
  background: none;
  border: none;
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
  transition: all 0.3s ease;
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
  flex-shrink: 0;
}

.btn__back:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.sidebar-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-size: 2rem;
  flex-shrink: 0;
}

.nav__sidebar {
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
}

.nav__sidebar::-webkit-scrollbar {
  display: none;
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
  transition: background-color 0.2s ease, transform 0.2s ease;
  border: 2px solid transparent;
  font-weight: 600;
}

.category-item:hover, .submenu-item:hover {
  background-color: #fef8e4;
  border-color: #1e1e1e;
}

.category-item.active {
  background-color: #4ade80;
  color: #1e1e1e;
  border-color: #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.submenu-item.active {
  background-color: #60a5fa;
  color: #fff;
  border-color: #1e1e1e;
}

.submenu-arrow {
  transition: transform .2s ease;
  width: 18px;
  margin-left: auto;
}

.submenu-arrow.rotated {
  transform: rotate(90deg);
}

.submenu {
  padding-left: 10px;
  margin-left: 15px;
  list-style: none;
  margin-top: 5px;
  border-left: 2px dashed rgba(30, 30, 30, 0.2);
}

.submenu-item {
  font-size: 1rem;
  padding: 0.8rem 1rem;
  gap: 10px;
}

.sub__item-length {
  margin-left: auto;
  min-width: 30px;
  height: 30px;
  padding: 0 5px;
  display: flex;
  color: #1e1e1e;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  background: #e0e0e0;
  border: 2px solid #1e1e1e;
  border-radius: 100px;
  font-size: 0.9rem;
}

.active .sub__item-length {
  background-color: #ffffff;
  color: #1e1e1e;
}

.category-icon, .submenu-icon {
  font-size: 1.5rem;
}

.achievement-categories {
  padding: 4px;
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
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 4px solid #1e1e1e;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
}

.content-header h1 {
  font-size: 2.5em;
  color: #1e1e1e;
  margin: 0;
  font-family: "Nunito", sans-serif;
}

.category-content {
  flex-grow: 1;
  min-height: 0;
}

.category-description {
  font-size: 1.2em;
  color: #1e1e1e;
}

.achievements-list {
  gap: 1.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.simplebar-scrollbar:before {
  background-color: #1e1e1e;
  border-radius: 4px;
  left: 2px;
  right: 2px;
}

.simplebar-track.simplebar-vertical {
  background-color: rgba(30, 30, 30, 0.1);
  width: 11px;
  border-radius: 6px;
}

@media (max-width: 1024px) {
  .achievements-page-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    height: auto;
    min-height: 100vh;
  }

  .sidebar {
    min-width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 55vh;
  }

  .content-area {
    padding: 1.5rem;
  }

  .content-header h1 {
    font-size: 2em;
  }

  .achievements-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .achievements-page-container {
    padding: 0;
  }

  .sidebar, .content-area {
    border-radius: 0;
    border-left: none;
    border-right: none;
    box-shadow: none;
  }

  .sidebar {
    border-top: none;
  }

  .content-area {
    border-bottom: none;
  }

  .achievements-list {
    grid-template-columns: 1fr;
  }

}

</style>