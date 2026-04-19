<template>
  <main class="modal-verbs-page" :class="{ 'content-is-active': isContentVisible }">
    <div v-if="showTips" class="tips__overlay" @click.self="showTips = false">
      <div class="tips__content">
        <button class="tips__close" @click="showTips = false">×</button>
        <!--        <h2 class="tipps__title">{{ t('modalVerbsTipsTitle.tipsTitle') }}</h2>-->
        <ul class="tips__list">
          <li v-for="tip in activeTipps" :key="tip.text" class="tips__item">
            <div class="tips__text" v-html="tip.text"></div>
          </li>
        </ul>
      </div>
    </div>
    <aside class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('modalVerbsPage.title') }}</h2>
      </div>
      <ul class="sidebar__list">
        <li v-for="group in modalGroups" :key="group.level" class="sidebar__item"
            :class="{'sidebar__item--active': selectedGroup && selectedGroup.level === group.level}">
          <button class="sidebar__button" @click="selectGroup(group)">
            <span>{{ group.level }}</span>
          </button>
        </li>
      </ul>
    </aside>
    <section class="content">
      <div v-if="selectedGroup" class="content-block">
        <header class="content__header">
          <button @click="closeContent" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 class="content__title">{{ selectedGroup.level }}</h1>
        </header>
        <div class="content__body">
          <div class="content__main-column">
            <section class="info-section">
              <div class="info__wrapper">
                <h3 class="info-section__title">{{ t('modalVerbsPage.examplesTitle') }}</h3>
                <button
                    :title="t('hoverTitle.tips')"
                    v-if="selectedGroup.tips" class="info__icon-tips" ref="tipRef"
                    @click="openTips(selectedGroup.tips)">
                </button>
              </div>
              <ul class="example-list">
                <li v-for="verb in selectedGroup.verbs" :key="verb.name" class="example">
                  <div class="verb-header">
                    <div class="verb-info">
                      <span class="verb-name">{{ verb.name }}</span>
                      <span class="verb-translation">{{ t(verb.translation) }}</span>
                    </div>
                    <SoundBtn :text="verb.name"/>
                  </div>
                  <div class="example-details">
                    <div class="example__sentence-wrapper">
                      <div class="example__sentence" v-html="verb.example"></div>
                      <div class="example__translation"> {{ t(verb.exampleTranslate) }}</div>
                    </div>
                    <SoundBtn :text="verb.example"/>
                  </div>
                </li>
              </ul>
            </section>
          </div>
          <div class="practice-area">
            <NuxtLink :to="`/modal-verbs/${selectedGroup.id}`" class="practice-area__button">
              {{ t('modalVerbsPage.begin') }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="placeholder">
        <p>👈 {{ t('modalVerbsPage.chooseLevel') }}</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import Lottie from 'lottie-web';
import TipIcon from '../../assets/animation/info.json';
import SoundBtn from '../../src/components/soundBtn.vue';
import VBackBtn from "~/src/components/V-back-btn.vue";
import {useHead, useSeoMeta, useRuntimeConfig} from '#imports'

const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter();
const isMobileLayout = ref(false);
const isContentVisible = ref(false);
const selectedGroup = ref(null);
const showTips = ref(false);
const activeTipps = ref([]);
const tipRef = ref(null);
let lottieInstance = null;

const modalGroups = ref([
  {
    level: 'Modal verbs',
    id: 'modal',
    practice: {
      title: 'modalGroupA.practice',
    },
    tips: [
      {text: t('modalGroupA.tipFirstA')},
      {text: t('modalGroupA.tipSecondA')},
      {text: t('modalGroupA.tipThirdA')},
      {text: t('modalGroupA.tipFourthA')}
    ],
    verbs: [
      {
        name: 'können',
        translation: 'modalGroupA.verbTranslateFirst',
        example: 'Ich <b>kann</b> gut schwimmen.',
        exampleTranslate: 'modalGroupA.exampleTranslateFirst'
      },
      {
        name: 'müssen',
        translation: 'modalGroupA.verbTranslateSecond',
        example: 'Du <b>musst</b> die Hausaufgaben machen.',
        exampleTranslate: 'modalGroupA.exampleTranslateSecond'
      },
      {
        name: 'wollen',
        translation: 'modalGroupA.verbTranslateThird',
        example: 'Wir <b>wollen</b> ins Kino gehen.',
        exampleTranslate: 'modalGroupA.exampleTranslateThird'
      },
      {
        name: 'möchten',
        translation: 'modalGroupA.verbTranslateFourth',
        example: 'Ich <b>möchte</b> einen Kaffee, bitte.',
        exampleTranslate: 'modalGroupA.exampleTranslateFourth'
      }
    ]
  },
  {
    level: 'nebensatze',
    id: 'nebensatze',
    practice: {
      title: 'modalGroupBTips.practice'
    },
    tips: [
      {text: `${t('modalGroupBTips.tipOne')} <b>bin</b>.`},
      {text: `${t('modalGroupBTips.tipTwo')} <b>aufstehen muss</b>.`},
      {text: `${t('modalGroupBTips.tipThree')} <b>lernen sollte</b>.`},
      {text: `${t('modalGroupBTips.tipFour')}<b>willst</b>.`},
      {text: `${t('modalGroupBTips.tipFive')} <b>helfen darf</b>.`},
      {text: `${t('modalGroupBTips.tipSix')} <b>sein kann</b>.`},
      {text: `${t('modalGroupBTips.tipSeven')} <b>mitkommen durfte</b>.`}
    ],
    verbs: [
      {
        name: 'weil',
        translation: t('subordinateСlause.verbTranslateOne'),
        example: 'Ich gehe nach Hause, <b>weil ich müde bin</b>.',
        exampleTranslate: t('subordinateСlause.verbExampleOne')
      },
      {
        name: 'dass',
        translation: t('subordinateСlause.verbTranslateTwo'),
        example: 'Ich denke, <b>dass er heute nicht kommt</b>.',
        exampleTranslate: t('subordinateСlause.verbExampleTwo')
      },
      {
        name: 'wenn',
        translation: t('subordinateСlause.verbTranslateThree'),
        example: '<b>Wenn ich Zeit habe</b>, helfe ich dir.',
        exampleTranslate: t('subordinateСlause.verbExampleThree')
      },
      {
        name: 'obwohl',
        translation: t('subordinateСlause.verbTranslateFour'),
        example: '<b>Obwohl es regnet</b>, gehen wir spazieren.',
        exampleTranslate: t('subordinateСlause.verbExampleFour')
      },
      {
        name: 'damit',
        translation: t('subordinateСlause.verbTranslateFive'),
        example: 'Ich lerne Deutsch, <b>damit ich in Deutschland arbeiten kann</b>.',
        exampleTranslate: t('subordinateСlause.verbExampleFive'),
      }
    ]
  }
]);

const openTips = (tipps) => {
  activeTipps.value = tipps;
  showTips.value = true;
};

const initLottieIcon = async () => {
  await nextTick();
  if (lottieInstance) {
    lottieInstance.destroy();
    lottieInstance = null;
  }
  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: TipIcon,
    });
  }
};

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767;
  if (!isMobileLayout.value) isContentVisible.value = false;
};

const closeContent = () => {
  isContentVisible.value = false;
};

const selectGroup = async (group) => {
  selectedGroup.value = group;
  if (isMobileLayout.value) {
    await nextTick();
    isContentVisible.value = true;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  if (!isMobileLayout.value) {
    selectedGroup.value = modalGroups.value[0];
  }
  initLottieIcon();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
  if (lottieInstance) lottieInstance.destroy();
});

watch(selectedGroup, initLottieIcon);
</script>

<style scoped>
/* =========================================
   ОСНОВНОЙ КОНТЕЙНЕР (Без 100vh)
   ========================================= */
.modal-verbs-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%; /* Строго 100% от родителя */
  overflow: hidden;
  font-family: "Nunito", sans-serif;
  background: #f7f9fc; /* Мягкий фон, приятный для глаз */
  box-sizing: border-box;
}

/* Скрываем скроллбары для красоты в iOS */
::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent; /* Убираем синее мерцание при тапе в iOS */
}

.sidebar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow-y: auto;
  padding-bottom: 20px;
}

.sidebar__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.sidebar__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--titleColor);
  margin-left: 16px;
  margin-top: 0;
  margin-bottom: 0;
}

.sidebar__list {
  list-style: none;
  padding: 0 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar__button {
  width: 100%;
  text-align: center;
  padding: 15px 20px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-bottom: 6px solid #e5e7eb;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 800;
  font-size: 1.2rem;
  color: #4b5563;
  transition: all 0.1s ease-out;
}

.sidebar__button:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

.sidebar__item--active .sidebar__button {
  background: #4ade80;
  border-color: #22c55e;
  border-bottom-color: #16a34a;
  color: #ffffff;
}

.content {
  position: absolute;
  inset: 0;
  background: var(--bg);
  z-index: 50;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.modal-verbs-page.content-is-active .content {
  transform: translateX(0);
}

.content-block {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.content__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
  border-bottom: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.content__title {
  color: var(--titleColor);
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 0 16px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

.content__body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg);
}

.content__main-column {
  flex-grow: 1;
  padding-bottom: 20px;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-section__title {
  font-size: 20px;
  font-weight: 800;
  color: var(--titleColor);
  margin: 0;
}

.info__icon-tips {
  width: 50px;
  height: 50px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 0 #e5e7eb;
}

.info__icon-tips:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #e5e7eb;
}

.example-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}

.example::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
}
.example:nth-child(4n+1)::before { background: #ffcc33; }
.example:nth-child(4n+2)::before { background: #4ade80; }
.example:nth-child(4n+3)::before { background: #60a5fa; }
.example:nth-child(4n+4)::before { background: #f472b6; }

.verb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 8px;
}

.verb-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1f2937;
}

.verb-translation {
  color: #9ca3af;
  font-size: 1rem;
  margin-left: 8px;
}

.example-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 8px;
  margin-top: 12px;
}

.example__sentence {
  font-size: 1.1rem;
  color: #374151;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.example__translation {
  color: #6b7280;
  font-size: 0.95rem;
}

.practice-area {
  flex-shrink: 0;
}

.practice-area__button {
  display: block;
  width: 100%;
  text-decoration: none;
  background: #3b82f6;
  color: #ffffff;
  padding: 18px;
  border-radius: 24px;
  font-size: 1.3rem;
  font-weight: 800;
  text-align: center;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
  transition: transform 0.1s;
}

.practice-area__button:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}


.tips__overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.tips__content {
  position: relative;
  background: #ffffff;
  padding: 24px 15px;
  border-radius: 28px;
  width: 100%;
  max-width: 400px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.tips__close {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #ef4444;
  color: #fff;
  border: 3px solid #ffffff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  max-height: 60vh;
  overflow-y: auto;
}

.tips__text {
  font-size: 1.05rem;
  padding: 14px;
  background: #f0fdf4;
  color: #166534;
  border-radius: 16px;
  margin-bottom: 12px;
  line-height: 1.4;
  border: 2px solid #bbf7d0;
}


@media (min-width: 768px) {
  .modal-verbs-page {
    flex-direction: row;
  }
  .sidebar {
    width: 350px;
    border-right: 2px solid #e5e7eb;
  }
  .content {
    position: relative;
    transform: none !important;
  }
  .btn-icon-back {
    display: none;
  }
  .content__body {
    flex-direction: row;
    padding: 30px;
  }
  .content__main-column {
    width: 60%;
    padding-right: 30px;
    border-right: 2px dashed #e5e7eb;
  }
  .practice-area {
    width: 40%;
    padding-left: 30px;
    margin-top: 0;
    justify-content: center;
  }
}
</style>
