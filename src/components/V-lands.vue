<template>
  <Transition name="menu-appear" appear>
    <div class="map__wrapper" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
      <h1 id="regions" class="map__title">
        <span class="map__title-ribbon">
          <span class="map__title-text">{{ t('locationsMenu.title') }}</span>
        </span>
      </h1>
      <div class="map-layout">
        <transition name="fade">
          <div
              class="map-overlay"
              v-if="isPanelOpen && windowWidth <= 1024"
              @click="closePanel"
          ></div>
        </transition>
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
                         stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
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
                  <span v-if="activeRegionLevel" class="level-chip level-chip--wide" :class="'level-chip--' + activeRegionLevel.toLowerCase()">
                    {{ activeRegionLevel }} · {{ t(`locationsMenu.level${activeRegionLevel}`) }}
                  </span>
                  <p class="map-left__desc">{{ t(active.desc) }}</p>
                  <p v-if="isUnlocked" class="map-left__level ok">
                    <span>{{ t('locationsMenu.access') }}</span>
                  </p>
                  <!-- закрытая земля: карточка с двумя способами открыть, у каждого видно, сколько уже есть -->
                  <div v-else class="land-lock">
                    <div class="land-lock__head">
                      <div class="land-lock__head-text">
                        <span class="land-lock__title">{{ t('locationsMenu.landLockTitle') }}</span>
                        <span v-if="activePrevRegion" class="land-lock__hint">{{ t('locationsMenu.landLockHint') }}</span>
                      </div>
                    </div>
                    <div class="land-lock__way">
                      <!-- значок уровня: сам номер нужного уровня, как медаль на карте -->
                      <span class="land-lock__icon land-lock__icon--level" aria-hidden="true">
                        <span class="land-lock__lvl-num">{{ needLevel(active) }}</span>
                      </span>
                      <div class="land-lock__way-text">
                        <span class="land-lock__way-title">{{ t('locationsMenu.landLockLevel', { level: needLevel(active) }) }}</span>
                        <span class="land-lock__way-sub">{{ t('locationsMenu.landLockLevelNow', { level: clampedLevel }) }}</span>
                      </div>
                    </div>
                    <template v-if="activePrevRegion">
                      <div class="land-lock__or"><span>{{ t('locationsMenu.landLockOr') }}</span></div>
                      <div class="land-lock__way">
                        <!-- картинка той самой земли, которую надо пройти -->
                        <span class="land-lock__icon land-lock__icon--land" aria-hidden="true">
                          <img :src="activePrevRegion.icon" alt="" decoding="async">
                        </span>
                        <div class="land-lock__way-text">
                          <span class="land-lock__way-title">{{ t('locationsMenu.landLockPrev', { land: t(activePrevRegion.name) }) }}</span>
                          <span class="land-lock__way-sub">{{ t('locationsMenu.landLockPrevNow', activePrevProgress) }}</span>
                          <span class="land-lock__bar" aria-hidden="true">
                            <span class="land-lock__bar-fill" :style="{ width: (activePrevProgress.total ? activePrevProgress.done / activePrevProgress.total * 100 : 0) + '%' }"></span>
                          </span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <button class="map-btn"
                      :disabled="!isUnlocked"
                      @click="go(active)"
                      :data-track="'region_enter_clicked' + (active?.id || 'unknown')"
              >
                {{ t('locationsMenu.choose') }}
              </button>
            </div>
          </div>
        </transition>
        <div class="map-right-container">
          <!-- пагинация разделов пока скрыта, раздел виден по прокрутке карты
          <div class="map-pagination-arrows">
            <button
                class="arrow-btn"
                :disabled="isFirstCategory"
                @click="prevCategory"
            >
              <img class="arrow__btn-icon arrow-back" src="../../assets/images/next.svg" alt="">
            </button>
            <div class="current-category-name">
              <span class="current-category-name__title">{{ t(`categories.${activeCategory}`) }}</span>
            </div>
            <button
                class="arrow-btn"
                :disabled="isLastCategory"
                @click="nextCategory"
            >
              <img class="arrow__btn-icon" src="../../assets/images/next.svg" alt="">
            </button>
          </div>
          -->
          <!-- все разделы одной лентой, прокрутка внутри; раздел и уровень сверху переключаются сами -->
          <div
              ref="mapScroll"
              class="lands-scroll"
              :style="{ height: scrollHeight ? scrollHeight + 'px' : null }"
              @scroll.passive="onMapScroll"
          >
            <section
                v-for="(key, index) in categoryKeys"
                :key="key"
                :ref="el => setSectionRef(key, el)"
                class="lands-scroll__section"
            >
              <VLandsMap
                  v-if="(regions[key] || []).length"
                  :regions="regions[key]"
                  :active-id="active?.id || ''"
                  :theme="(levelOfCategory(key) || 'A1').toLowerCase()"
                  :is-last="index === categoryKeys.length - 1"
                  :level-progress="levelProgress(key)"
                  :test-level="testLevelOf(key, index)"
                  :test-open="isTestOpen(testLevelOf(key, index))"
                  @test="openTest"
                  :prev-theme="index ? (levelOfCategory(categoryKeys[index - 1]) || 'A1').toLowerCase() : ''"
                  :is-locked="isRegionLocked"
                  :need-level="needLevel"
                  :progress-of="progressOf"
                  :current-id="currentRegion?.id || ''"
                  @select="select"
              />
            </section>
            <div v-if="!categoryKeys.length" class="map-empty-placeholder">
              <div class="empty-content">
                <div class="empty-icon">✨</div>
                <h3 class="empty-title">{{ t('regionsModal.title') }}</h3>
                <p class="empty-text">{{ t('regionsModal.text') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <VTestLockedModal v-model="showTestLocked" :level="lockedLevel" :summit="LEVEL_SUMMITS[lockedLevel] || ''"/>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import { useI18n } from 'vue-i18n'
import {regions} from '@/utils/regions.js'
import {userlangStore} from '../../store/learningStore.js'
import {userAuthStore} from "~/store/authStore.js";
import {visibleRegionCategories, requiredLandLevel, levelOfCategory, LEVEL_SUMMITS, isLevelFinished} from "~/utils/germanLevel.js";
import VLandsMap from "~/src/components/V-landsMap.vue";
import VTestLockedModal from "~/src/components/V-testLockedModal.vue";
import {userChainStore} from "~/store/chainStore.js";
import {landsWithProgress, landCompletion, isPrevLandDone, previousRegion} from "~/utils/landProgress.js";

const authStore = userAuthStore()
const {t, locale} = useI18n()
const langStore = userlangStore()
const router = useRouter()
const chainStore = userChainStore()
// разделы ниже выбранного уровня немецкого скрыты (A2 не видит земли A1)
const categoryKeys = computed(() => visibleRegionCategories(authStore.germanLevel))
const activeCategory = ref(categoryKeys.value[0] || 'beginner')
// уровень аккаунта для земли считается от первой видимой земли
const needLevel = (region) => requiredLandLevel(region, authStore.germanLevel)

const currentCategoryIndex = computed(() => categoryKeys.value.indexOf(activeCategory.value))
const isFirstCategory = computed(() => currentCategoryIndex.value === 0)
const isLastCategory = computed(() => currentCategoryIndex.value === categoryKeys.value.length - 1)

// --- прокрутка карты ---
const mapScroll = ref(null)
const scrollHeight = ref(0)
const sectionRefs = {}
// пока карта едет к разделу после нажатия стрелки, не перебиваем раздел из onMapScroll
let scrollingTo = null
let scrollingTimer = null

function setSectionRef(key, el) {
  if (el) sectionRefs[key] = el
  else delete sectionRefs[key]
}

// окно карты занимает экран от своего верха до нижнего меню, на любом телефоне:
// высоту экрана берём из visualViewport (на мобильных учитывает адресную строку), верх нижнего меню меряем по факту
const NAV_GAP = 2
const MIN_SCROLL_HEIGHT = 240
function measureScrollHeight() {
  const el = mapScroll.value
  if (!el || typeof window === 'undefined') return
  const viewport = window.visualViewport?.height || window.innerHeight
  const top = el.getBoundingClientRect().top + window.scrollY
  const footer = document.querySelector('footer.footer')
  const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : viewport
  const bottom = Math.min(viewport, footerTop) - NAV_GAP
  scrollHeight.value = Math.max(Math.round(bottom - top), MIN_SCROLL_HEIGHT)
  // отступы под картой (поля страницы) не должны давать прокрутку всей страницы: прокручивается только карта
  requestAnimationFrame(() => {
    const extra = document.documentElement.scrollHeight - viewport
    if (extra > 0 && scrollHeight.value - extra >= MIN_SCROLL_HEIGHT) scrollHeight.value -= extra
  })
}
// шапка над картой и нижнее меню могут поменять размер после загрузки (шрифты, баннер, повёрнутый экран)
let layoutObserver = null

// текущий раздел: последний, чей верх уже поднялся к верху окна (с запасом на треть экрана)
function onMapScroll() {
  const box = mapScroll.value
  if (!box || scrollingTo) return
  const line = box.scrollTop + box.clientHeight / 3
  let current = categoryKeys.value[0]
  for (const key of categoryKeys.value) {
    const el = sectionRefs[key]
    if (el && el.offsetTop <= line) current = key
  }
  if (current && current !== activeCategory.value) activeCategory.value = current
}

function scrollToCategory(key) {
  const box = mapScroll.value
  const el = sectionRefs[key]
  activeCategory.value = key
  if (!box || !el) return
  scrollingTo = key
  clearTimeout(scrollingTimer)
  scrollingTimer = setTimeout(() => { scrollingTo = null }, 700)
  box.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
}

function nextCategory() {
  if (!isLastCategory.value) scrollToCategory(categoryKeys.value[currentCategoryIndex.value + 1])
}

function prevCategory() {
  if (!isFirstCategory.value) scrollToCategory(categoryKeys.value[currentCategoryIndex.value - 1])
}

// итоговый тест стоит в конце последнего раздела уровня и открывается после экзамена на вершине
const showTestLocked = ref(false)
const lockedLevel = ref('')

function testLevelOf(category, index) {
  const level = levelOfCategory(category)
  const next = categoryKeys.value[index + 1]
  return level && (!next || levelOfCategory(next) !== level) ? level : ''
}

const isTestOpen = (level) => isLevelFinished(chainStore.questProgress, level)

function openTest(level) {
  if (isTestOpen(level)) return router.push(`/locations-test/${level}`)
  lockedLevel.value = level
  showTestLocked.value = true
}

// кольцо на медали уровня: все земли этого уровня (A2 = оба его раздела)
function levelProgress(category) {
  const level = levelOfCategory(category)
  const lands = Object.keys(regions)
    .filter(key => levelOfCategory(key) === level)
    .flatMap(key => regions[key] || [])
  return { open: lands.filter(r => !isRegionLocked(r)).length, total: lands.length }
}
const activeRegionLevel = computed(() => {
  const category = Object.keys(regions).find(key => regions[key].some(r => r.id === active.value?.id))
  return category ? levelOfCategory(category) : null
})

// земля закрыта, пока уровень аккаунта ниже нужного (премиум открывает всё)
// земля закрыта, только если не хватает уровня и в ней ещё нет прогресса
const openedLands = computed(() => landsWithProgress(chainStore.questProgress))
// или если предыдущая земля пройдена целиком: можно открыть уровнем или прохождением
const isRegionLocked = (region) => !authStore.isPremium && !openedLands.value.has(region.id)
    && clampedLevel.value < needLevel(region) && !isPrevLandDone(chainStore.questProgress, region.id)
// подпись закрытой земли: какой уровень нужен и какую землю пройти
const activePrevRegion = computed(() => active.value ? previousRegion(active.value.id) : null)
const activePrevProgress = computed(() => activePrevRegion.value
    ? landCompletion(chainStore.questProgress, activePrevRegion.value.id)
    : {done: 0, total: 0})

// сколько квестов каждой земли пройдено: кольцо вокруг земли на карте
const completion = computed(() => {
  const out = {}
  for (const key of categoryKeys.value) {
    for (const region of regions[key] || []) out[region.id] = landCompletion(chainStore.questProgress, region.id)
  }
  return out
})
const progressOf = (region) => completion.value[region.id] || {done: 0, total: 0}
const isRegionDone = (region) => {
  const p = progressOf(region)
  return p.total > 0 && p.done >= p.total
}

// земля, на которой игрок остановился: самая дальняя с прогрессом;
// если она уже пройдена, то следующая открытая; без прогресса первая земля
const currentRegion = computed(() => {
  const list = categoryKeys.value.flatMap(key => regions[key] || [])
  if (!list.length) return null
  let index = -1
  list.forEach((region, i) => {
    if (openedLands.value.has(region.id)) index = i
  })
  if (index === -1) return list[0]
  const next = list[index + 1]
  if (isRegionDone(list[index]) && next && !isRegionLocked(next)) return next
  return list[index]
})

// при открытии карта сама едет к текущей земле (один раз, когда прогресс загружен)
let scrolledToCurrent = false
function scrollToCurrent() {
  const box = mapScroll.value
  const region = currentRegion.value
  if (scrolledToCurrent || !box || !region || !chainStore.progressLoaded) return
  const el = box.querySelector(`[data-land-id="${region.id}"]`)
  // высота окна карты ещё не выставлена: прокрутить нечего, попробуем после замера
  if (!el || box.scrollHeight <= box.clientHeight) return
  scrolledToCurrent = true
  active.value = region
  const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
  box.scrollTop = Math.max(top - box.clientHeight / 2, 0)
  onMapScroll()
}

// прогресс загрузился или окно карты получило высоту: пробуем доехать до текущей земли
watch([() => chainStore.progressLoaded, scrollHeight], () => {
  nextTick(() => requestAnimationFrame(scrollToCurrent))
})

const filteredRegions = computed(() => {
  return regions[activeCategory.value] || []
})

const firstVisibleRegion = () => regions[categoryKeys.value[0]]?.[0] || null
const active = ref(firstVisibleRegion())

// уровень сменили в настройках или он подгрузился позже: возвращаем карту на первый видимый раздел
watch(categoryKeys, (keys) => {
  if (keys.includes(activeCategory.value)) return
  activeCategory.value = keys[0] || 'beginner'
  active.value = firstVisibleRegion()
  if (mapScroll.value) mapScroll.value.scrollTop = 0
})

const isPanelOpen = ref(false)
const windowWidth = ref(1024)

function handleResize() {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    measureScrollHeight()
  }
}

const clampedLevel = computed(() => Math.max(langStore.isLeveling, 0))

const isUnlocked = computed(() => {
  if (!active.value) return false
  return !isRegionLocked(active.value)
})

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
  if (!isRegionLocked(region)) router.push(`/location/${region.pathTo}`)
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
  // после первой отрисовки высота шапки уже известна
  requestAnimationFrame(measureScrollHeight)
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', measureScrollHeight)
    if (typeof ResizeObserver !== 'undefined') {
      layoutObserver = new ResizeObserver(() => measureScrollHeight())
      // следим только за тем, что выше карты, и за нижним меню: сама карта меняет высоту страницы, за ней не следим
      for (const sel of ['#regions', '.map-pagination-arrows']) {
        const node = document.querySelector(sel)
        if (node) layoutObserver.observe(node)
      }
      const footer = document.querySelector('footer.footer')
      if (footer) layoutObserver.observe(footer)
    }
    window.addEventListener('popstate', handlePopState)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
    window.visualViewport?.removeEventListener('resize', measureScrollHeight)
    window.removeEventListener('popstate', handlePopState)
    layoutObserver?.disconnect()
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

/* заголовок карты: лента в цвет приложения на всю ширину, максимум 768px */
.map__title {
  --map-ribbon-top: #7d70cf;
  --map-ribbon-bottom: #5d50a8;
  --map-ribbon-edge: #483d8f;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2px 22px 0;
}

html.orange .map__title {
  --map-ribbon-top: #ff9a4a;
  --map-ribbon-bottom: #e8782c;
  --map-ribbon-edge: #b5581a;
}

.map__title-ribbon {
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 768px;
  min-height: 42px;
  padding: 6px 18px;
  border: 2px solid var(--map-ribbon-edge);
  border-radius: 12px;
  background: linear-gradient(180deg, var(--map-ribbon-top), var(--map-ribbon-bottom));
  box-shadow: 0 4px 0 var(--map-ribbon-edge), 0 8px 14px rgba(0, 0, 0, 0.3);
  color: #fff;
}

/* хвосты ленты */
.map__title-ribbon::before,
.map__title-ribbon::after {
  content: "";
  position: absolute;
  top: 9px;
  z-index: -1;
  width: 22px;
  height: 32px;
  background: var(--map-ribbon-bottom);
  border: 2px solid var(--map-ribbon-edge);
}

.map__title-ribbon::before {
  left: -17px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 45% 50%);
}

.map__title-ribbon::after {
  right: -17px;
  clip-path: polygon(0 0, 100% 0, 55% 50%, 100% 100%, 0 100%);
}

.map__title-text {
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: .2px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.arrow__btn-icon {
  width: 16px;
}

.arrow__btn-icon.arrow-back {
  transform: rotate(-180deg);
}

.map-layout {
  display: flex;
  gap: 12px;
  width: 100%;
  height: calc(100vh - 250px);
}

.map-left {
  width: 100%;
  min-width: 300px;
  max-width: 100%;
  flex: 1;
  border: 3px solid var(--borderMobile);
  padding: 0 10px;
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
  height: 150px;
  border: 4px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
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
  font-size: 23px;
  font-weight: 900;
  color: var(--title);
  margin-left: 15px;
  text-shadow: 0px 1px var(--title);
}

.map-left__desc {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--titleColor);
  padding: 4px;
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

/* карточка закрытой земли: в стиле карты, без браузерных рамок */
.land-lock {
  --lock-line: color-mix(in srgb, var(--titleColor) 14%, transparent);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
  padding: 12px;
  border: 2px solid var(--lock-line);
  border-radius: 18px;
  background: color-mix(in srgb, var(--titleColor) 5%, transparent);
  box-shadow: 0 4px 0 var(--lock-line);
  color: var(--titleColor);
}

.land-lock__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.land-lock__head-text,
.land-lock__way-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.land-lock__title {
  font-size: 16px;
  font-weight: 900;
  line-height: 1.2;
}

.land-lock__hint,
.land-lock__way-sub {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  opacity: 0.7;
}

/* способ открыть: строка с круглой иконкой */
.land-lock__way {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--titleColor) 6%, transparent);
}

.land-lock__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 17px;
}

/* значок уровня: синий жетон с номером нужного уровня */
.land-lock__icon--level {
  border: 2px solid #fff;
  background: radial-gradient(circle at 35% 30%, #7cc0ff, #2563eb);
  box-shadow: 0 3px 0 #1a3f9e;
  color: #fff;
  line-height: 1;
}

.land-lock__lvl-num {
  font-size: 16px;
  font-weight: 900;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
}

/* картинка земли в круглой рамке */
.land-lock__icon--land {
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
}

.land-lock__icon--land img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.land-lock__way-title {
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
}

/* полоска: сколько квестов предыдущей земли уже пройдено */
.land-lock__bar {
  display: block;
  height: 6px;
  margin-top: 3px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--titleColor) 14%, transparent);
  overflow: hidden;
}

.land-lock__bar-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #4ade80, #16a34a);
  transition: width 0.4s ease;
}

/* разделитель «или» с линиями по бокам */
.land-lock__or {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  opacity: 0.6;
}

.land-lock__or::before,
.land-lock__or::after {
  content: "";
  flex: 1;
  height: 2px;
  border-radius: 1px;
  background: var(--lock-line);
}

.mal__left-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 10px 0;
}

.map-btn {
  display: block;
  width: 100%;
  text-decoration: none;
  box-shadow: 0 6px 0 #1d4ed8;
  background: #3b82f6;
  border: none;
  color: #ffffff;
  padding: 10px;
  border-radius: 40px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
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
  gap: 10px;
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
  /* всё содержимое карточки — в её собственном слое, чтобы ничего не вылезало поверх нижнего меню */
  isolation: isolate;
  border: 3px solid var(--tabsSlideBorderColor);
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
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.region-card__title {
  font-size: 1.05rem;
  font-weight: 900;
  color: white;
}


.region-card__badge {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 5px 11px 6px 12px;
  border-bottom-left-radius: 14px;
  background: linear-gradient(135deg, #8b7cf6 0%, #5d4ad8 100%);
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  font-size: .85rem;
  font-weight: 900;
  line-height: 1;
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

@media (max-width: 1023px) {
  .map-layout {
    position: relative;
    display: block;
    overflow-y: auto;
    height: auto;
  }

  .mal__left-content {
    justify-content: start;
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
    width: 50%;
    height: 100%;
    border: none;
    border-right: 3px solid;
    border-top-right-radius: 12px;
    z-index: 111000;
    background: var(--bg);
    padding: calc(env(safe-area-inset-top, 30px) + 0px) 10px 10px 10px;
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }

  .map-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: 110999;
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
    height: 136px;
  }
}

@media (width: 768px) {
  .map-right {
    grid-template-columns: repeat(1, 1fr);
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

@media (min-width: 768px) {
  region-card {
    height: 166px;
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
  .region-card__title {
    font-size: 12px;
  }
}

@media (max-width: 478px) {
  .map-right {
    grid-template-columns: repeat(2, 2fr);
    overflow-y: visible;
  }
}

/* окно карты: прокрутка внутри, разделы идут друг за другом */
.lands-scroll {
  position: relative;
  /* карта плавно исчезает сверху (под стрелками разделов) и снизу (над нижним меню) */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 28px, #000 calc(100% - 14px), transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, #000 28px, #000 calc(100% - 14px), transparent 100%);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  /* разделы вплотную: одна сплошная карта без рамки */
  display: flex;
  flex-direction: column;
  gap: 0;
}

.lands-scroll::-webkit-scrollbar {
  display: none;
}

.lands-scroll__section {
  flex-shrink: 0;
  position: relative;
}

/* соседние разделы заходят друг на друга на 2px, чтобы на стыке не было шва от округления пикселей */
.lands-scroll__section + .lands-scroll__section {
  margin-top: -2px;
}

.map-right-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 6px;
}

/* переключатель разделов: та же капсула, что у нижнего меню и вкладок */
.map-pagination-arrows {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 4px;
  border-radius: 40px;
  border: 3px solid var(--tabsSlideBorderColor);
  background: var(--tabBg);
  box-shadow: var(--boxShadowMobile);
}

/* стрелки как активная вкладка */
.arrow-btn {
  flex: 0 0 auto;
  width: 44px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow);
}

/* в светлой теме кнопка белая, белая стрелка на ней не видна */
html.light .arrow__btn-icon {
  filter: brightness(0) opacity(0.6);
}

.arrow-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.arrow-btn:disabled {
  background: none;
  box-shadow: none;
  opacity: 0.4;
  cursor: not-allowed;
}

.current-category-name {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
  color: var(--title);
  font-size: 16px;
  font-weight: 900;
}

.current-category-name__title {
  max-width: 100%;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Метка уровня: у каждого уровня свой цвет */
.level-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 26px;
  padding: 0 7px;
  border-radius: 9px;
  border-bottom: 3px solid rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  font-family: "Nunito", sans-serif;
}

.level-chip--wide {
  align-self: flex-start;
  margin: 4px 0 6px;
  font-size: 13px;
}

.level-chip--a1 {
  background: #22c55e;
}

.level-chip--a2 {
  background: #3b82f6;
}

.level-chip--b1 {
  background: #8b5cf6;
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

.menu-appear-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

</style>