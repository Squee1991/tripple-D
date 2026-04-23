<template>
  <div class="map__wrapper" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div id="regions" class="map__title-wrapper">
      <h1 class="map__title">{{ t('locationsMenu.title') }}</h1>
    </div>
    <div class="map-layout">
      <transition name="slide">
        <div
            class="map-left"
            v-show="isPanelOpen || windowWidth > 1024"
            :class="[ 'theme--' + themeOf(active), { rtl: locale === 'ar' } ]"
            v-if="active"
        >
          <div class="mal__left-content">
            <div>
              <div class="mal__left-content-wrapper">
                <button v-if="windowWidth <= 1024" @click="closePanel" class="btn-icon-back">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                       stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <h2 class="map-left__title">{{ t(active.name) }}</h2>
              </div>
              <div class="map__left-content-bottom">
                <div class="map-left__art">
                  <img :src="active?.icon" alt="Choose avatar location" decoding="async">
                </div>
                <p class="map-left__desc">{{ t(active.desc) }}</p>
                <p class="map-left__level" :class="isUnlocked ? 'ok' : 'locked'">
                  <span v-if="isUnlocked">{{ t('locationsMenu.access') }}</span>
                  <span v-else>{{ t('locationsMenu.accessWithLevel') }} {{ active.level }}</span>
                </p>
              </div>
            </div>
            <button class="map-btn" :disabled="!isUnlocked" @click="go(active)">
              {{ t('locationsMenu.choose') }}
            </button>
          </div>
        </div>
      </transition>

      <div class="map-right-container">
        <div class="map-pagination-arrows">
          <button
              class="arrow-btn"
              :disabled="isFirstCategory"
              @click="prevCategory"
          >‹
          </button>
          <div class="current-category-name">
            {{ t(`categories.${activeCategory}`) }}
          </div>
          <button
              class="arrow-btn"
              :disabled="isLastCategory"
              @click="nextCategory"
          >›
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <div class="map-right" v-if="filteredRegions.length > 0" :key="activeCategory">
            <div
                v-for="region in filteredRegions"
                :key="region.id"
                class="region-card"
                :class="[
                  'theme--' + themeOf(region),
                  { active: active?.id === region.id }
                ]"
                @click="select(region)"
            >
              <div class="region-card__art">
                <img :src="region.icon" :alt="region.id" decoding="async">
              </div>
              <div class="region-card__footer">
                <span class="region-card__title">{{ t(region.name) }}</span>
                <div class="region-card-badge-wrapper">
                  <span v-if="clampedLevel < region.level" class="region-card__badge">
                    {{ region.level }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="map-empty-placeholder" key="empty">
            <div class="empty-content">
              <div class="empty-icon">✨</div>
              <h3 class="empty-title">{{ t('regionsModal.title') }}</h3>
              <p class="empty-text">{{ t('regionsModal.text') }}</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {useRouter} from 'vue-router'
import {regions} from '@/utils/regions.js'
import {userlangStore} from '../../store/learningStore.js'

const {t, locale} = useI18n()
const langStore = userlangStore()
const router = useRouter()
const categoryKeys = computed(() => Object.keys(regions))
const activeCategory = ref(categoryKeys.value[0] || 'beginner')

const currentCategoryIndex = computed(() => categoryKeys.value.indexOf(activeCategory.value))
const isFirstCategory = computed(() => currentCategoryIndex.value === 0)
const isLastCategory = computed(() => currentCategoryIndex.value === categoryKeys.value.length - 1)

function nextCategory() {
  if (!isLastCategory.value) {
    activeCategory.value = categoryKeys.value[currentCategoryIndex.value + 1]
  }
}

function prevCategory() {
  if (!isFirstCategory.value) {
    activeCategory.value = categoryKeys.value[currentCategoryIndex.value - 1]
  }
}

const filteredRegions = computed(() => {
  return regions[activeCategory.value] || []
})

const flatList = Object.values(regions).flat()
const defaultRegion = flatList.find(r => r.pathTo === 'east-plain') || flatList[0] || null
const active = ref(defaultRegion)

const isPanelOpen = ref(false)
const windowWidth = ref(1024)

function handleResize() {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

const clampedLevel = computed(() => Math.min(Math.max(langStore.isLeveling, 0), 20))
const isUnlocked = computed(() => active.value ? clampedLevel.value >= active.value.level : false)

function themeOf(obj) {
  return (obj && (obj.theme || obj.pathTo)) ? (obj.theme || obj.pathTo) : 'default'
}

function select(region) {
  active.value = region
  if (windowWidth.value <= 1024) {
    window.history.pushState({isMapPanelOpen: true}, '')
    isPanelOpen.value = true
  }
}

function closePanel() {
  if (isPanelOpen.value) {
    window.history.back()
  }
}

const handlePopState = () => {
  if (isPanelOpen.value) {
    isPanelOpen.value = false
  }
}

function go(region) {
  if (clampedLevel.value >= region.level) {
    router.push(`/location/${region.pathTo}`)
  }
}

watch([isPanelOpen, windowWidth], ([newIsOpen, newWidth]) => {
  if (typeof document === 'undefined') return
  if (newIsOpen && newWidth <= 767) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  handleResize()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
    window.addEventListener('popstate', handlePopState)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('popstate', handlePopState)
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style>
* {
  font-family: "Nunito", sans-serif;
}

.map__wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.map__title-wrapper {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 25px;
  padding: 10px 10px;
  background: var(--bgTitle);
  box-shadow: 0 5px 0 var(--boxShadowBottom);
  position: relative;
  overflow: hidden;
}

.map__title {
  font-size: 20px;
  color: var(--regionBtnColor);
  font-weight: 600;
  letter-spacing: .2px;
  font-family: "Nunito", sans-serif;
}

.map-layout {
  display: flex;
  gap: 12px;
  width: 100%;
  height: calc(100vh - 110px);
}

.map-left {
  width: 100%;
  min-width: 300px;
  max-width: 100%;
  flex: 1;
  border: 3px solid var(--border);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #222;
  overflow-y: auto;
  box-shadow: var(--border);
  position: relative;
}

.map-left__art {
  width: 100%;
  height: 190px;
  border: 3px solid var(--border);
  border-radius: 10px;
  margin-bottom: 14px;
  overflow: hidden;
  background: var(--bg);
}

.mal__left-content-wrapper {
  display: flex;
  align-items: center;
  padding: 5px 0 15px 0;
}

.map-left__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.map-left__title {
  font-size: 24px;
  font-weight: 900;
  color: var(--titleColor);
  margin-left: 15px;
}

.map-left__desc {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
  color: var(--titleColor);
}

.map-left__level {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  margin-bottom: 18px;
  padding: 6px 10px;
  border: 2px dashed var(--border);
  border-radius: 999px;
  background: #fff;
  box-shadow: 2px 2px 0 var(--border);
}

.map-left__level.ok {
  color: #137a4a;
}

.map-left__level.locked {
  color: #b21f24;
}

.mal__left-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 0 0 10px 0;
}

.map-btn {
  display: block;
  width: 100%;
  text-decoration: none;
  background: #3b82f6;
  color: #ffffff;
  padding: 12px;
  border-radius: 24px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
  transition: transform 0.1s;
}

.map-b {
  padding: 12px 18px;
  background: var(--regionBtnBg);
  color: var(--regionBtnColor);
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 18px;
  border: 1px solid white;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 3px 0 var(--regionBtnBg);
  transition: transform .12s ease, box-shadow .12s ease;
  width: 100%;
}

.map-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.map-right {
  display: grid;
  gap: 16px;
  overflow-y: auto;
  min-width: 0;
  grid-template-columns: repeat(2, 2fr);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.map-right::-webkit-scrollbar {
  display: none;
}

.region-card {
  position: relative;
  border: 3px solid var(--borderRegion);
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  height: 140px;
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  background: var(--bg);
}

.region-card__art img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

@media (min-width: 1024px) {
  .region-card:hover {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0 var(--border);
  }
}

.region-card__art {
  position: relative;
  width: 100%;
  height: 100%;
}

.region-card__footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  padding: 8px 10px;
  background: linear-gradient(180deg, rgb(41 38 38 / 75%), rgb(31 29 29 / 60%));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1);;
  backdrop-filter: blur(2px);
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

.region-card__title {
  font-size: 1.05rem;
  font-weight: 900;
  color: white;
}

.region-card__badge {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: .82rem;
  font-weight: 900;
  color: #1d1d1d;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff, #eaeaea);
  padding: 0;
}

.region-card-badge-wrapper {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme--default {
  --c1: #e8eef6;
  --c2: #d7e2f0;
}

.theme--winds {
  --c1: #dff4ff;
  --c2: #bfe7ff;
}

.theme--plain {
  --c1: #fff2a8;
  --c2: #f6d96c;
}

.theme--stone {
  --c1: #e7f0fa;
  --c2: #c9def1;
}

.theme--ruins {
  --c1: #eaf6d9;
  --c2: #cbe8ae;
}

.theme--north {
  --c1: #e9f5ff;
  --c2: #cfe9ff;
}

.theme--storm {
  --c1: #dce8f2;
  --c2: #b5c7d6;
}

@media (max-width: 1244px) {
  .region-card__title {
    font-size: 1rem;
  }
}

@media (max-width: 1159px) {
  .map-right {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (max-width: 1090px) {
  .map-right {
    grid-template-columns: repeat(1, 2fr);
  }
}

@media (max-width: 1024px) {
  .map-layout {
    position: relative;
    display: block;
    overflow-y: auto;
    height: auto;
  }

  .map-right {
    grid-template-columns: repeat(2, 2fr);
    overflow-y: visible;
  }

  .region-card__art img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .map-left {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    width: 60%;
    height: 100%;
    border: none;
    border-right: 3px solid;
    border-top-right-radius: 12px;
    z-index: 111000;
    background: var(--bg);
    padding: calc(env(safe-area-inset-top, 30px) + 5px) 14px 10px 14px;
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }

  .map-left__close {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-radius: 10px;
    background: linear-gradient(180deg, #ffe98d, #ffd255);
    font-size: 22px;
    cursor: pointer;
    z-index: 10;
  }

  .map-left.rtl {
    left: auto;
    right: 0;
  }

  .map-left.rtl .map-left__close {
    left: 8px;
    right: auto;
  }

  .region-card__title {
    font-size: 0.9rem;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .map-left.rtl.slide-enter-from,
  .map-left.rtl.slide-leave-to {
    transform: translateX(100%);
  }
}

@media (max-width: 920px) {
  .map-right {
    grid-template-columns: repeat(2, 2fr);
  }
}

@media (max-width: 800px) {
  .region-card {
    height: 140px;
  }
}

@media (max-width: 766px) {
  .map-right {
    grid-template-columns: repeat(2, 2fr);
    overflow-y: visible;
  }
}

@media (max-width: 700px) {
  .map-left {
    width: 60%;
  }
}

@media (max-width: 636px) {
  .map-left {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }

  .map-left__art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

@media (max-width: 500px) {
  .region-card-badge-wrapper {
    display: none;
  }

  .region-card__title {
    font-size: 0.83rem;
  }
}

@media (max-width: 478px) {
  .map-right {
    grid-template-columns: repeat(2, 2fr);
    overflow-y: visible;
  }
}

.map-right-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 6px;
}

.map-pagination-arrows {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 5px;
}

.arrow-btn {
  width: 45px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 900;
  cursor: pointer;
  color: white;
  box-shadow: 2px 2px 0 var(--boxShadowMobile);
  border: 2px solid var(--tabsSlideBorderColor);
  background: var(--tabBg);
  transition: all 0.1s;
}

.arrow-btn:active:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0 var(--border);
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.current-category-name {
  font-size: 16px;
  font-weight: 900;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 0 var(--boxShadowMobile);
  border: 2px solid var(--tabsSlideBorderColor);
  background: var(--tabBg);
  border-radius: 15px;
  flex: 1;
  height: 36px;
}

.map-empty-placeholder {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 10px;
  color: var(--titleColor);
}

.empty-content {
  max-width: 400px;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--titleColor);
  margin-bottom: 10px;
  text-transform: uppercase;
}

.empty-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>