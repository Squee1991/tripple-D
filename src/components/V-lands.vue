<template>
  <div class="map__wrapper" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="map__title-wrapper">
      <h1 class="map__title">{{ t('locationsMenu.title') }}</h1>
    </div>
    <div class="map-layout">
      <div
          class="map-left"
          :class="[ { 'is-open': isPanelOpen || windowWidth > 1024 },  'theme--' + themeOf(active), { rtl: locale === 'ar' } ]"
          v-if="active"
      >
        <button
            v-if="windowWidth <= 1024"
            class="map-left__close"
            @click="isPanelOpen = false"
        >×
        </button>
        <div class="map-left__art">
          <img :src="active?.icon" alt="Choose avatar location">
        </div>
        <h2 class="map-left__title">{{ t(active.name) }}</h2>
        <p class="map-left__desc">{{ t(active.desc) }}</p>
        <p class="map-left__level" :class="isUnlocked ? 'ok' : 'locked'">
          <span v-if="isUnlocked">{{ t('locationsMenu.access') }}</span>
          <span v-else>{{ t('locationsMenu.accessWithLevel') }} {{ active.level }}</span>
        </p>
        <button class="map-btn" :disabled="!isUnlocked" @click="go(active)">
          {{ t('locationsMenu.choose') }}
        </button>
      </div>

      <div class="map-right-container">
        <div class="map-pagination-arrows">
          <button
              class="arrow-btn"
              :disabled="isFirstCategory"
              @click="prevCategory"
          >‹</button>
          <div class="current-category-name">
            {{ t(`categories.${activeCategory}`) }}
          </div>
          <button
              class="arrow-btn"
              :disabled="isLastCategory"
              @click="nextCategory"
          >›</button>
        </div>

        <div class="map-right">
          <template v-if="filteredRegions.length > 0">
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
                <img :src="region.icon" :alt="region.id">
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
          </template>
          <div v-else class="map-empty-placeholder">
            <div class="empty-content">
              <div class="empty-icon">✨</div>
              <h3 class="empty-title">{{ t('regionsModal.title')}}</h3>
              <p class="empty-text">{{ t('regionsModal.text')}}</p>
            </div>
          </div>
        </div>
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
    isPanelOpen.value = true
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
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
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

.back__to-main {
  border: none;
  background: none;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.back__icon {
  width: 100%;
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
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 2px solid var(--border);
  box-shadow: 2px 2px 0 var(--border);
  border-radius: 15px;
  padding: 10px 10px;
  background: #3c99d3;
  position: relative;
  overflow: hidden;
}

.map__title {
  font-size: 2.3rem;
  color: #f6f2f2;
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
  padding: 12px;
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

.map-left__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.map-left__title {
  font-size: 1.6rem;
  margin: 0 0 8px;
  font-weight: 900;
  color: var(--titleColor);
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

.map-btn {
  padding: 12px 18px;
  background: #f1c40f;
  color: black;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 18px;
  border: 1px solid white;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 3px 0 #f1c40f;
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
  height: auto;
  border: 3px solid var(--border);
  border-radius: 15px;
  box-shadow: 0 0 0 var(--border);
  cursor: pointer;
  overflow: hidden;
  min-height: 160px;
  max-height: 175px;
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  background: var(--bg);
}

.region-card__art img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.region-card.active {
  outline: 3px solid #fff;
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
  left: 8px;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  border: 2px solid var(--border);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .75), rgba(255, 255, 255, .55));
  backdrop-filter: blur(2px);
  box-shadow: 2px 2px 0 var(--border);
}

.region-card__title {
  font-size: 1.05rem;
  font-weight: 900;
  color: #1d1d1d;
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
  grid-template-columns: repeat(1, 1fr);
}

@media (max-width: 1090px) {
  .region-card {
    height: 175px;
  }

  .map-right {
    grid-template-columns: repeat(1, 2fr);
  }
}

@media (max-width: 1024px) {
  .map-layout {
    position: relative;
    display: block;
    overflow-y: auto;
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
    left: 0;
    height: 100%;
    border: none;
    width: 60%;
    border-right: 3px solid;
    border-top-right-radius: 12px;
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    transition: transform .25s ease, opacity .25s ease;
    z-index: 111000;
  }

  .map-left.rtl {
    left: auto;
    right: 0;
    transform: translateX(100%);
  }

  .map-left.rtl.is-open {
    transform: translateX(0);
  }

  .map-left.rtl .map-left__close {
    left: 8px;
    right: auto;
  }

  .map-left.is-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    background: var(--bg);
    padding: 55px 15px 20px 15px;
  }

  .map__title {
    font-size: 1.4rem;
  }

  .map-left__close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-radius: 10px;
    background: linear-gradient(180deg, #ffe98d, #ffd255);
    font-size: 22px;
    cursor: pointer;
    z-index: 10;
  }

  .region-card__title {
    font-size: 0.9rem;
  }
}

@media (max-width: 920px) {
  .map-right {
    grid-template-columns: repeat(2, 2fr);
  }
}

@media (max-width: 800px) {
  .region-card {
    height: 170px;
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
}

.map-pagination-arrows {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
}

.arrow-btn {
  width: 45px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 24px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--border);
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
  font-size: 1.2rem;
  font-weight: 900;
  color: #333;
  text-transform: uppercase;
  text-align: center;
}

.map-empty-placeholder {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 15px;
  margin-top: 10px;
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
  color: #333;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.empty-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  line-height: 1.4;
}
</style>