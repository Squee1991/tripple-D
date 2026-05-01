<template>
  <div class="location-page">
    <div class="location__wrapper">
      <header class="location-header" :class="{ 'rtl-locale': locale === 'ar' }">
        <VBackBtn/>
        <h1 class="region__title-name">{{ t(currentRegion?.name) }}</h1>
      </header>
      <div class="lives-bar__content">
        <VHearts
            :lives="chainStore.lives"
            :max-lives="chainStore.maxLives"
            :last-life-at-ms="chainStore.lastLifeAtMs"
            :regen-interval-ms="chainStore.REGEN_INTERVAL_MS"
            show-timer
        />
      </div>
      <VTransition>
        <div v-if="isLoading || !isMounted"
             key="loading"
             class="loading">{{ t('locationQuests.loading') }}
        </div>
        <div v-if="isMounted" class="quests">
          <div v-if="errorMessage" class="error">{{ t('locationQuests.error') }}</div>
          <ul v-else-if="processedQuests.length" class="quest-list">
            <li
                v-for="quest in processedQuests"
                :key="quest.questId"
                class="quest-card"
                :class="{ completed: quest.isSuccess }"
            >
              <div v-if="quest.isPerfect" class="stamp">{{ t('locationQuests.done') }}</div>
              <div v-else-if="quest.hasMistakes" class="stamp stamp--mistakes">{{ t('locationQuests.mistakes') }}</div>
              <div class="stamp__icon-wrapper">
                <img class="stamp__icon" src="../../assets/images/questList.svg" alt="questList">
              </div>
              <p class="quest__description">{{ t(quest.description) }}</p>
              <div class="quest-meta">
              <span v-if="!quest.isSuccess" class="rewards-container">
                <span>{{ t('locationQuests.awards') }}</span>
                <span class="reward-item">
                  <span>{{ quest.rewards.points }}</span>
                  <img src="assets/images/article.svg" alt="Articlus" class="icon-articlus">
                </span>
                <span class="reward-item">{{ quest.rewards.xp }}<span class="xp-badge-3d">XP</span></span>
              </span>
                <span class="rewards-container" v-else>{{ t('locationQuests.gotAward') }} <span
                    style="font-size:18px;">✅</span></span>
              </div>
              <button
                  class="btn"
                  :style="quest.btnStyle"
                  @click="handleStartQuest(quest)"
              >
                <template v-if="quest.hasMistakes">
                  {{ t('locationQuests.repeatMistakes') }}
                </template>
                <template v-else-if="quest.isPerfect">
                  {{ t('locationQuests.repeat') }}
                </template>
                <template v-else>
                  {{ t('locationQuests.start') }}
                </template>
              </button>
            </li>
          </ul>
          <div v-else class="empty">{{ t('locationQuests.notFound') }}</div>
        </div>
      </VTransition>

    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {regions} from "~/utils/regions.js";
import {userChainStore} from "~/store/chainStore.js";
import {useSeoMeta} from '#imports';
import VHearts from '../../src/components/V-hearts.vue';
import VBackBtn from "~/src/components/V-back-btn.vue";
import {showInterstitial} from '~/utils/admob.js';
import VTransition from "~/src/components/V-transition.vue";

const route = useRoute();
const router = useRouter();
const {t, locale} = useI18n();
const chainStore = userChainStore();
const questList = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const isMounted = ref(false);
useSeoMeta({
  robots: 'noindex, nofollow'
});

const currentRegionKey = computed(() => String(route.query.region || route.params.id || ""));
const currentRegion = computed(() => {
  const allRegionsList = Object.values(regions).flat();
  return allRegionsList.find((r) => r.pathTo === currentRegionKey.value);
});

const questsUrl = computed(() => {
  return `/quests/quests-${currentRegionKey.value}.json`;
});

async function fetchQuests() {
  isLoading.value = true;
  errorMessage.value = "";
  questList.value = [];
  try {
    const response = await fetch(questsUrl.value);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    questList.value = Array.isArray(data) ? data : (data.quests || [data]);
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

const processedQuests = computed(() => {
  return questList.value.map((quest) => {
    let userProgress = chainStore.questProgress?.[quest.questId];
    if (!userProgress && Array.isArray(quest.aliases)) {
      const foundAliasId = quest.aliases.find((aliasId) => chainStore.questProgress?.[aliasId]);
      if (foundAliasId) {
        userProgress = chainStore.questProgress[foundAliasId];
      }
    }
    const safeProgress = userProgress || {};
    const hasMistakes = !!(safeProgress.wrongIndices && safeProgress.wrongIndices.length > 0);
    const isSuccess = !!safeProgress.success;
    const isPerfect = isSuccess && !hasMistakes;

    let btnStyle = {};
    if (hasMistakes) {
      btnStyle = {
        background: 'linear-gradient(180deg, #ff82a9 0%, #e6517d 100%)',
        color: '#fff'
      };
    } else if (isPerfect) {
      btnStyle = {
        background: 'linear-gradient(180deg, #6a74a5 0%, #5d7fc1 100%)',
        color: '#fff'
      };
    }
    return {
      ...quest,
      isSuccess,
      isCompleted: !!safeProgress.completed,
      hasMistakes,
      isPerfect,
      btnStyle
    };
  });
});

function handleStartQuest(quest) {
  if (!quest?.questId) return;
  showInterstitial(() => {
    router.push({
      path: `/location/quest-${quest.questId}`,
      query: {region: currentRegionKey.value}
    });
  });
}

watch(currentRegionKey, fetchQuests, {immediate: true});

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 200)
})

onMounted(async () => {

  await chainStore.loadProgressFromFirebase();
});

</script>

<style scoped>

.quests {
  padding: 0 15px;
}

.location-page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  color: #1b1b1b;
  font-family: "Nunito", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.location-page::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}

.stamp__icon {
  width: 60px;
}

.stamp__icon-wrapper {
  border: 2px solid #747aff;
  border-radius: 50%;
  margin: 5px auto;
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00c2ff;
}

.region__title-name {
  font-size: 23px;
  color: var(--title);
  margin-left: 15px;
  text-shadow: 0px 1px var(--title);
}

.location-header {
  display: flex;
  align-items: center;
  position: relative;
  padding: 5px 10px 15px 10px;
  border-radius: 22px;
  margin-bottom: 18px;
  overflow: visible;
}

.loading, .error, .empty {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 16px;
  color: var(--title);
  font-weight: 600;
  font-size: 20px;
  text-align: center;
}

.error {
  background: #FFE7E7;
}

.empty {
  opacity: .96;
}

.quest-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
  align-items: stretch;
  margin-top: 12px;
}

.quest-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 380px;
  background: linear-gradient(90deg, #8ddcff 0%, #bfa7ff 100%) 0 0/100% 12px no-repeat, #FFFDF3;
  color: #111;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 20px;
  padding: 18px 16px 16px;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.quest-card:nth-child(6n+2) {
  background: linear-gradient(90deg, #ffb4b4 0%, #ffd19a 100%) 0 0/100% 12px no-repeat, #FFFDF3;
}

.quest-card:nth-child(6n+3) {
  background: linear-gradient(90deg, #b0f2b6 0%, #8be39a 100%) 0 0/100% 12px no-repeat, #FFFDF3;
}

.quest-card:nth-child(6n+4) {
  background: linear-gradient(90deg, #ffd88c 0%, #ffc26a 100%) 0 0/100% 12px no-repeat, #FFFDF3;
}

.quest-card:nth-child(6n+5) {
  background: linear-gradient(90deg, #a7f3eb 0%, #74d8e8 100%) 0 0/100% 12px no-repeat, #FFFDF3;
}

.quest-card:nth-child(6n) {
  background: linear-gradient(90deg, #f9a8ff 0%, #d8b4fe 100%) 0 0/100% 12px no-repeat, #FFFDF3;
}

.quest-card::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 16px;
  outline: 10px solid #fff;
  pointer-events: none;
}

.quest-card.completed {
  opacity: .98;
}

.quest-card.completed .quest__title {
  text-decoration: none;
}

.stamp {
  position: absolute;
  top: -4px;
  right: -10px;
  transform: rotate(4deg);
  font-size: 12px;
  background: linear-gradient(180deg, #6a74a5 0%, #5d7fc1 100%);
  color: white;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  letter-spacing: .04em;
  box-shadow: var(--boxShadowMobile);
  z-index: 3;
}

.stamp--mistakes {
  background: linear-gradient(180deg, #ff82a9 0%, #e6517d 100%);
}

.quest__description {
  margin: 5px 0;
  color: #2b2b2b;
}

.quest-details p {
  margin: 6px 0;
}

.quest-meta {
  margin-top: auto;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.quest-meta .rewards-container {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  height: 44px;
  font-weight: 600;
  padding: 6px 12px;
  font-size: 14px;
  background: white;
  border-radius: 15px;
  border: 3px solid #e0dcdc;
  box-shadow: var(--boxShadowMobile);
}

.reward-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
}

.icon-articlus {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

.btn {
  position: relative;
  padding: 15px 22px;
  margin-top: 12px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: .02em;
  border: 3px solid #e8e7e7;
  background: linear-gradient(180deg, #6bba5e 0%, #47a14f 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 0 #d9d4d4;
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.btn:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 transparent;
}

@keyframes bob {
  0%, 100% {
    transform: translateY(0) rotate(8deg);
  }
  50% {
    transform: translateY(-8px) rotate(8deg);
  }
}

@keyframes wiggleSmooth {
  0%, 100% {
    transform: rotate(-6deg) scale(1);
  }
  50% {
    transform: rotate(2deg) scale(1.05);
  }
}

@keyframes popSmooth {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.xp-badge-3d {
  color: white;
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 6px;
  margin-bottom: 2px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #3b82f6 100%);
  background-size: 200% 200%;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.2),
  inset 0 1px 1px rgba(255, 255, 255, 0.5),
  0 2px 4px rgba(0, 0, 0, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8),
  0 0 1px rgba(0, 0, 0, 0.3);
}

@media (max-width: 767px) {
  .quest-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 766px) {
  .quest-list {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 8px;
  }

  .quest-card {
    min-height: auto;
    padding: 14px;
    gap: 8px;
    border-radius: 16px;
  }

  .quest-card::before {
    inset: 6px;
    outline: 8px solid #fff;
  }

  .quest__description {
    font-size: 14px;
  }

  .quest-meta .rewards-container {
    font-size: 14px;
    padding: 4px 8px;
  }
}

@media (min-width: 768px) {
  .location-header.rtl-locale::after {
    right: auto;
    left: 0;
    transform: rotate(-8deg);
  }
}

.lives-bar__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 0 14px 17px 14px;
  border-radius: 15px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  background: white;
}
</style>