<template>
  <div class="quest-board-page">
    <header class="page-header">
      <VBackBtn/>
      <div class="header-titles">
        <h1>{{ t('questThemeChoose.title') }}</h1>
      </div>
    </header>
    <Modal
        @close="closeModal"
        :visible="showModal"
        :title="t(data.title)"
        :img="DoneImg"
        :text="t(data.text)"
    />
    <VTransition>
      <div v-if="isMounted" class="quest__page-wrapper">
        <VBanner
            :text="t('questThemeChoose.subTitle')"
            :icon="Diary"
        />
        <main class="themes-list">
          <template v-for="theme in questStore.themes" :key="theme.id">
            <div
                v-if="theme.isActive && theme.availableIds.length"
                class="theme-item"
                @click="selectTheme(theme)"
            >
              <div class="theme-icon">{{ theme.icon }}</div>
              <div class="theme-info">
                <h2>{{ t(theme.title) }}</h2>
                <p v-if="theme.description">{{ t(theme.description) }}</p>
              </div>
              <div class="theme-action">
                <VArrowNav/>
              </div>
            </div>
            <div v-else class="theme-item disabled">
              <div class="theme-icon grayscale">{{ theme.icon }}</div>
              <div class="theme-info">
                <h2>{{ t(theme.title) }}</h2>
                <p class="lock-text">{{ t('questThemeChoose.block') }}</p>
              </div>
              <div class="theme-action">
                <div class="lock-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round" class="lock-icon">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>

          </template>
        </main>
      </div>
    </VTransition>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useQuestStore} from '../../store/questStore.js'
import Modal from '../../src/components/modal.vue'
import {useRouter} from 'vue-router'
import DoneImg from '../../assets/images/done.svg'
import {useSeoMeta} from "#imports";
import VBackBtn from "~/src/components/V-back-btn.vue";
import VBanner from "~/src/components/V-banner.vue";
import Diary from '../../assets/images/Diary.svg'
import VArrowNav from "~/src/components/V-arrowNav.vue";
import VTransition from "~/src/components/V-transition.vue";
const showModal = ref(false)
const cooldownSeconds = ref(0)
const router = useRouter()
const {t} = useI18n()
const questStore = useQuestStore()
const isMounted = ref(false)

useSeoMeta({
  robots: 'noindex, nofollow'
})

const data = ref({
  title: "modal.achieveTitle",
  text: "modal.achieveText"
})

const closeModal = () => {
  showModal.value = false
}

async function selectTheme(theme) {
  if (questStore.dailyQuestCount > 0) {
    cooldownSeconds.value = await questStore.getTodaysQuestCooldown();
    showModal.value = true;
    return;
  }
  const nextId = await questStore.getFirstAvailableRecipeId(theme.id);
  if (!nextId) {
    cooldownSeconds.value = await questStore.getRemainingCooldown(theme.availableIds.at(-1));
    showModal.value = true;
    return;
  }
  router.push(`/recipes/${nextId}`);
}

onMounted(async () => {
  setTimeout(()=> {
    isMounted.value = true
  }, 100)
  await Promise.all([
    questStore.loadThemesAndRecipes(),
    questStore.loadDailyProgress()
  ]);
})
</script>

<style scoped>
.quest-board-page {

  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  max-width: 1240px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
}

.quest__page-wrapper {
  padding: 10px 15px;
  flex: 1;
  overflow-y: auto;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
}

.back-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #111827;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  flex-shrink: 0;
}

.back-button:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--tabsSlideBorderColor);
}

.back-icon {
  width: 24px;
  height: 24px;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.header-titles h1 {
  font-size: 23px;
  font-weight: 700;
  margin-left: 15px;
  color: var(--title);
  text-shadow: 0 1px var(--title);
}

.header-titles p {
  font-size: 0.9rem;
  color: var(--titleColor, #cccccc);
  margin: 0;
  opacity: 0.8;
}

.themes-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 3rem;
}

.theme-item {
  display: flex;
  align-items: center;
  background: var(--menuItemsBg);
  border-radius: 16px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  user-select: none;
}

.theme-item:active:not(.disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--tabsSlideBorderColor);
}

.theme-icon {
  font-size: 2.5rem;
  margin-right: 1.25rem;
  line-height: 1;
}

.theme-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.theme-info h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.theme-info p {
  font-size: 0.85rem;
  margin: 0.2rem 0 0 0;
  opacity: 0.7;
  line-height: 1.2;
}

.lock-text {
  color: #ff6b6b;
  font-weight: 600;
  opacity: 1 !important;
}


.theme-action {
  margin-left: 1rem;
  flex-shrink: 0;
}

.play-circle {
  width: 36px;
  height: 36px;
  background-color: #5B71FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.play-icon {
  width: 20px;
  height: 20px;
  margin-left: 2px;
}

.lock-circle {
  width: 36px;
  height: 36px;
  background-color: #4b4e63;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
}

.lock-icon {
  width: 18px;
  height: 18px;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.8;
  background: #2a2c3a;
}

.grayscale {
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>