<template>
  <button
      v-if="!isOpen"
      type="button"
      class="guide-fab"
      :aria-label="t('hedgehogGuide.open')"
      data-track="guide_open"
      @click="open"
  >
    <img class="guide-fab__img" :src="HedgehogIcon" alt="">
  </button>
  <Teleport to="body">
    <transition name="guide-fade">
      <div v-if="isOpen" class="guide" @click.self="close">
        <div
            class="guide__sheet"
            :class="{ 'guide__sheet--rtl': locale === 'ar' }"
            role="dialog"
            aria-modal="true"
        >
            <header class="guide__head">
              <span class="guide__avatar-wrap">
                <img class="guide__avatar" :src="HedgehogIcon" alt="">
                <span class="guide__online" aria-hidden="true"></span>
              </span>
              <h2 class="guide__title">{{ t('hedgehogGuide.title') }}</h2>
              <button type="button" class="guide__close" :aria-label="t('hedgehogGuide.close')"
                      data-track="guide_close" @click="close">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3"
                     stroke-linecap="round">
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                </svg>
              </button>
            </header>

          <div class="guide__messages">
            <div class="guide__row">
              <img class="guide__row-avatar" :src="HedgehogIcon" alt="">
              <div class="guide__bubble guide__bubble--bot">
                {{ t('hedgehogGuide.greeting') }}
              </div>
            </div>

            <template v-for="(node, index) in path" :key="node.id">
              <div class="guide__bubble guide__bubble--user" :style="{ '--accent': node.color }">
                {{ node.icon }} {{ labelOf(node) }}
              </div>
              <div v-if="node.children" class="guide__row">
                <img class="guide__row-avatar" :src="HedgehogIcon" alt="">
                <div class="guide__bubble guide__bubble--bot">{{ t('hedgehogGuide.which') }}</div>
              </div>
              <!-- события: идущие можно открыть, остальные показывают даты -->
              <div v-else-if="node.events" class="guide__answer">
                <div class="guide__row">
                  <img class="guide__row-avatar" :src="HedgehogIcon" alt="">
                  <div class="guide__bubble guide__bubble--bot">{{ t('hedgehogGuide.here') }}</div>
                </div>
                <div class="guide__list">
                  <button
                      v-for="ev in eventLinks"
                      :key="ev.id"
                      type="button"
                      class="guide__item"
                      :class="{ 'guide__item--locked': ev.locked, 'guide__item--shake': shakingId === ev.id }"
                      :data-track="trackName(ev.locked ? 'guide_event_closed_' : 'guide_event_', ev.id)"
                      @click="goTo(ev)"
                  >
                    <span class="guide__item-icon guide__item-icon--event" :class="{ 'guide__item-icon--off': ev.locked }">
                      <img :src="ev.icon" alt="">
                    </span>
                    <span class="guide__item-text">
                      <span class="guide__item-title">{{ ev.label }}</span>
                      <span class="guide__item-hint" :class="{ 'guide__item-hint--live': !ev.locked }">{{ ev.hint }}</span>
                    </span>
                    <VArrowNav v-if="!ev.locked" class="guide__arrow"/>
                  </button>
                </div>
              </div>
              <div v-else class="guide__answer">
                <div class="guide__row">
                  <img class="guide__row-avatar" :src="HedgehogIcon" alt="">
                  <div class="guide__bubble guide__bubble--bot">{{ t('hedgehogGuide.here') }}</div>
                </div>
                <!-- страницы учебника, затем земли: по уровням (A1 / A2 / B1) или, на карте, по разделам -->
                <template v-for="group in groupsOf(node)" :key="group.kind">
                <p v-if="group.heading" class="guide__heading">{{ group.heading }}</p>
                <p v-if="group.caption" class="guide__caption">
                  <span v-if="group.level" class="guide__level-chip" :style="{ background: LEVEL_COLORS[group.level] }">{{ group.level }}</span>
                  {{ group.caption }}
                </p>
                <div class="guide__list">
                  <button
                      v-for="link in group.links"
                      :key="link.id"
                      type="button"
                      class="guide__item"
                      :class="{ 'guide__item--locked': link.locked, 'guide__item--shake': shakingId === link.id }"
                      :data-track="trackName(link.locked ? 'guide_locked_' : 'guide_go_', link.id)"
                      @click="goTo(link)"
                  >
                    <span class="guide__item-icon" :style="{ background: link.locked ? '#9e9e9e' : (link.color || group.color) }">
                      {{ link.locked ? '🔒' : group.icon }}
                    </span>
                    <span class="guide__item-text">
                      <span class="guide__item-title">{{ link.label }}</span>
                      <span v-if="link.locked" class="guide__item-hint guide__item-hint--lock">
                        {{ t('locationsMenu.accessWithLevel') }} {{ link.level }}
                      </span>
                      <span v-else-if="link.hint" class="guide__item-hint">{{ link.hint }}</span>
                    </span>
                    <VArrowNav v-if="!link.locked" class="guide__arrow"/>
                  </button>
                </div>
                </template>
              </div>
            </template>

            <div v-if="options.length" class="guide__tiles">
              <button
                  v-for="option in options"
                  :key="option.id"
                  type="button"
                  class="guide__tile"
                  :style="{ '--accent': option.color }"
                  :data-track="trackName('guide_option_', option.id)"
                  @click="choose(option)"
              >
                <span class="guide__tile-bg" aria-hidden="true">{{ option.icon }}</span>
                <span class="guide__tile-icon" aria-hidden="true">{{ option.icon }}</span>
                <span class="guide__tile-label">{{ labelOf(option) }}</span>
                <svg class="guide__tile-go" viewBox="0 0 24 24" width="14" height="14" fill="none"
                     stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true">
                  <polyline points="9 6 15 12 9 18"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div v-if="path.length" class="guide__nav">
            <button type="button" class="guide__nav-btn" data-track="guide_back" @click="back">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 6 9 12 15 18"></polyline>
              </svg>
              {{ t('hedgehogGuide.back') }}
            </button>
            <button type="button" class="guide__nav-btn guide__nav-btn--accent" data-track="guide_restart" @click="restart">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7"></path>
                <polyline points="3 4 3 9 8 9"></polyline>
              </svg>
              {{ t('hedgehogGuide.restart') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import HedgehogIcon from '~/assets/images/AssistantIcon.png'
import VArrowNav from '~/src/components/V-arrowNav.vue'
import { guideMenu, LEVEL_COLORS } from '~/utils/guideMenu.js'
import { guideCatalog } from '~/utils/guideCatalog.js'
import { regions } from '~/utils/regions.js'
import { isRegionVisible, requiredLandLevel, levelOfCategory } from '~/utils/germanLevel.js'
import { userAuthStore } from '~/store/authStore.js'
import { userChainStore } from '~/store/chainStore.js'
import { landsWithProgress, isPrevLandDone } from '~/utils/landProgress.js'
import { userlangStore } from '~/store/learningStore.js'
import { useEventSessionStore } from '~/store/eventsStore.js'
import { vibrateTap, vibrateError } from '~/utils/haptics.js'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const langStore = userlangStore()
const eventStore = useEventSessionStore()

const isOpen = ref(false)

const path = ref([])
const shakingId = ref('')

const catalogById = Object.fromEntries(guideCatalog.map(item => [item.id, item]))
const regionById = Object.fromEntries(Object.values(regions).flat().map(r => [r.id, r]))

const options = computed(() => {
  const last = path.value[path.value.length - 1]
  const list = last ? (last.children || []) : guideMenu
  // пункт, в котором были только скрытые земли (например «Карта: начальный» у A2), не показываем
  return list.filter(node => node.children || node.links?.length || !node.lands?.length
      || node.lands.some(id => !isLandHidden(id)))
})

// земля с прогрессом открыта всегда, как и на карте
function landLevel(item) {
  if (!item.id.startsWith('land-')) return null
  const region = regionById[item.id.slice(5)]
  if (!region || landsWithProgress(chainStore.questProgress).has(region.id)) return null
  // предыдущая земля пройдена целиком: открыта и без уровня
  if (isPrevLandDone(chainStore.questProgress, region.id)) return null
  return requiredLandLevel(region, authStore.germanLevel)
}

// земли ниже выбранного уровня немецкого скрыты, как и на карте
const chainStore = userChainStore()

function isLandHidden(id) {
  return id.startsWith('land-') && !isRegionVisible(id.slice(5), authStore.germanLevel)
}

function isLocked(level) {
  if (level === null || authStore.isPremium) return false
  return Math.max(langStore.isLeveling, 0) < level
}

const LAND_ICON = '🗺️'
const LAND_COLOR = '#00897b'

const catalogIndex = Object.fromEntries(guideCatalog.map((item, i) => [item.id, i]))

function labelOf(node) {
  if (node.level) return `${node.level} · ${t(`locationsMenu.level${node.level}`)}`
  return t(node.labelKey || `hedgehogGuide.menu.${node.id}`)
}

// уровень земли (A1 / A2 / B1) по её разделу на карте
function levelOfLand(id) {
  const group = catalogById[id]?.group
  return group ? levelOfCategory(group) : null
}

function groupsOf(node) {
  const study = linksOf(node.links)
  const lands = linksOf(node.lands)
  const groups = []
  if (study.length) {
    groups.push({
      kind: 'study', links: study, icon: node.icon, color: node.color,
      caption: lands.length ? t('hedgehogGuide.inStudy') : ''
    })
  }
  if (!lands.length) return groups
  // земли по порядку карты, затем делим: на карте по разделам, в остальных пунктах по уровням
  const sorted = [...lands].sort((a, b) => catalogIndex[a.id] - catalogIndex[b.id])
  const buckets = new Map()
  for (const link of sorted) {
    const key = node.byCategory ? catalogById[link.id].group : (levelOfLand(link.id) || 'other')
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(link)
  }
  let first = true
  for (const [key, links] of buckets) {
    const level = !node.byCategory && LEVEL_COLORS[key] ? key : null
    groups.push({
      kind: 'lands-' + key, links, icon: LAND_ICON, color: LAND_COLOR, level,
      // над первой группой земель «Задания на карте», если выше есть страницы учебника
      heading: first && study.length ? t('hedgehogGuide.onMap') : '',
      caption: node.byCategory ? t(`categories.${key}`) : (level ? t(`locationsMenu.level${level}`) : '')
    })
    first = false
  }
  return groups
}

function linksOf(ids) {
  return (ids || []).filter(id => !isLandHidden(id)).map(id => catalogById[id]).filter(Boolean).map(item => {
    const level = landLevel(item)
    const cefr = levelOfLand(item.id)
    return {
      id: item.id,
      color: cefr ? LEVEL_COLORS[cefr] : '',
      route: item.route,
      label: t(item.labelKey),
      hint: item.hintKey ? t(item.hintKey) : '',
      level,
      locked: isLocked(level)
    }
  })
}

// даты событий в store — «ММ-ДД ЧЧ:мм» без года, событие повторяется каждый год
function eventDate(str, year) {
  const [datePart, timePart] = str.split(' ')
  const [month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = (timePart || '00:00').split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes)
}

// ближайший период события: текущий, если идёт, иначе следующий
function eventPeriod(ev, now) {
  for (const year of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]) {
    const start = eventDate(ev.start, year)
    let end = eventDate(ev.end, year)
    if (end < start) end = eventDate(ev.end, year + 1)
    if (end >= now) return { start, end }
  }
  return null
}

function formatDay(date) {
  return new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long' }).format(date)
}

// идущие события сверху, остальные — по дате открытия
const eventLinks = computed(() => {
  const now = new Date()
  return eventStore.events.map(ev => {
    const period = eventPeriod(ev, now)
    const active = eventStore.isEventActive(ev.id, now)
    const from = formatDay(period.start)
    const to = formatDay(period.end)
    let hint
    if (active) hint = t('hedgehogGuide.eventNow', { date: to })
    else if (from === to) hint = t('hedgehogGuide.eventDay', { date: from })
    else hint = t('hedgehogGuide.eventDates', { from, to })
    return {
      id: ev.id,
      route: ev.url,
      label: t(ev.valueKey),
      icon: ev.icon,
      hint,
      locked: !active,
      sortKey: active ? 0 : period.start.getTime()
    }
  }).sort((a, b) => a.sortKey - b.sortKey)
})

// имя события для data-track (плагин firebase-analytics шлёт его при клике).
// В GA4 в имени только буквы, цифры и «_», не длиннее 40 символов
function trackName(prefix, id) {
  return (prefix + id).replace(/[^A-Za-z0-9_]/g, '_').slice(0, 40)
}

function open() {
  isOpen.value = true
  vibrateTap()
}

function close() {
  isOpen.value = false
}

function choose(option) {
  vibrateTap()
  path.value = [...path.value, option]
}

function back() {
  vibrateTap()
  path.value = path.value.slice(0, -1)
}

function restart() {
  vibrateTap()
  path.value = []
}

function goTo(link) {
  if (link.locked) {
    vibrateError()
    shakingId.value = ''
    nextTick(() => { shakingId.value = link.id })
    return
  }
  vibrateTap()
  close()
  router.push(link.route)
}

</script>

<style scoped>
/* акцент как у вкладок и кнопок приложения */
.guide-fab,
.guide__sheet {
  --guide-accent: #8b7cf6;
  --guide-accent-top: #a79cf8;
  --guide-accent-edge: #6358ac;
}

html.orange .guide-fab,
html.orange .guide__sheet {
  --guide-accent: #ff7a1a;
  --guide-accent-top: #ff9a4a;
  --guide-accent-edge: #b5581a;
}

.guide-fab {
  position: fixed;
  right: 16px;
  bottom: calc(100px + env(safe-area-inset-bottom));
  z-index: 10;
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 50%;
  border: 3px solid var(--guide-accent);
  background: var(--tabBg);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 0 0 color-mix(in srgb, var(--guide-accent) 50%, transparent);
  cursor: pointer;
  animation: guide-fab-pulse 2.8s ease-out infinite;
  -webkit-tap-highlight-color: transparent;
}

.guide-fab__img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.guide-fab:active {
  transform: scale(0.92);
}

.guide {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.6);
}

.guide__sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100dvh - 100px);
  padding: 18px max(16px, calc((100% - 480px) / 2)) calc(14px + env(safe-area-inset-bottom));
  border-top: 3px solid var(--guide-accent);
  border-radius: 28px 28px 0 0;
  background: var(--bg);
  color: var(--titleColor);
  animation: guide-up 0.3s ease-out;
  -webkit-user-select: none;
  user-select: none;
}

.guide__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(127, 127, 127, 0.18);
}

.guide__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.guide__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px var(--guide-accent);
}

.guide__online {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #34c759;
  border: 2px solid var(--bg);
}

.guide__title {
  flex: 1;
  font-size: 1.15rem;
  font-weight: 800;
}

.guide__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: rgba(127, 127, 127, 0.16);
  color: var(--titleColor);
  cursor: pointer;
}

.guide__close:active {
  transform: scale(0.9);
}

.guide__messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 2px 10px;
  -webkit-overflow-scrolling: touch;
}

.guide__row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.guide__row-avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.guide__bubble {
  max-width: 82%;
  padding: 10px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.guide__bubble--bot {
  border-bottom-left-radius: 6px;
  background: rgba(127, 127, 127, 0.15);
}

.guide__bubble--user {
  align-self: flex-end;
  border-bottom-right-radius: 6px;
  background: var(--accent, #3d68f5);
  color: #fff;
  font-weight: 700;
}

.guide__sheet--rtl .guide__bubble--bot {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 6px;
}

.guide__sheet--rtl .guide__bubble--user {
  align-self: flex-start;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 6px;
}


.guide__tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 4px;
}

.guide__tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 87px;
  padding: 12px;
  gap: 4px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 24px;
  background:
    radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%),
    linear-gradient(160deg, color-mix(in srgb, var(--accent) 16%, transparent), color-mix(in srgb, var(--accent) 4%, transparent));
  color: var(--titleColor);
  text-align: start;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.guide__tile:active {
  transform: scale(0.96);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

/* большая полупрозрачная иконка в углу как фон плитки */
.guide__tile-bg {
  position: absolute;
  right: -12px;
  bottom: -16px;
  z-index: -1;
  font-size: 4.2rem;
  line-height: 1;
  opacity: 0.16;
  transform: rotate(-14deg);
  pointer-events: none;
}

.guide__tile-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  border-radius: 14px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 80%, #fff), var(--accent));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 6px 14px color-mix(in srgb, var(--accent) 50%, transparent);
  font-size: 1.3rem;
}

.guide__tile-label {
  font-size: 13px;
  font-weight: 800;
  line-height: 1.25;
}

.guide__tile-go {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 24px;
  height: 24px;
  padding: 5px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 30%, transparent);
  color: var(--titleColor);
}

.guide__sheet--rtl .guide__tile-go {
  right: auto;
  left: 14px;
  transform: scaleX(-1);
}

.guide__sheet--rtl .guide__tile-bg {
  right: auto;
  left: -12px;
  transform: rotate(14deg);
}

.guide__answer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guide__caption {
  margin: 4px 0 -4px 6px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.6;
}

.guide__heading {
  margin: 8px 0 -2px 6px;
  font-size: 0.95rem;
  font-weight: 900;
}

.guide__sheet--rtl .guide__heading {
  margin: 8px 6px -2px 0;
}

.guide__caption {
  display: flex;
  align-items: center;
  gap: 6px;
}

.guide__level-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 20px;
  padding: 0 6px;
  border-radius: 7px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0;
}

.guide__sheet--rtl .guide__caption {
  margin: 4px 6px -4px 0;
}

.guide__list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(127, 127, 127, 0.12);
}

.guide__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: var(--titleColor);
  text-align: start;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.guide__item + .guide__item {
  border-top: 1px solid rgba(127, 127, 127, 0.16);
}

.guide__item:active {
  background: rgba(127, 127, 127, 0.14);
}

.guide__item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  font-size: 1.1rem;
}

.guide__item-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.guide__item-title {
  font-size: 0.95rem;
  font-weight: 800;
}

.guide__item-hint {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  opacity: 0.7;
}

/* иконки событий — картинки из меню событий */
.guide__item-icon--event {
  background: rgba(255, 112, 67, 0.18);
}

.guide__item-icon--event img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.guide__item-icon--off img {
  filter: grayscale(1);
  opacity: 0.6;
}

.guide__item-hint--live {
  color: #34c759;
  opacity: 1;
}

.guide__item-hint--lock {
  color: #e53935;
  opacity: 1;
}

.guide__item--locked .guide__item-title {
  opacity: 0.6;
}

.guide__item--shake {
  animation: guide-shake 0.4s ease;
}

.guide__arrow {
  margin-left: 0;
}

.guide__sheet--rtl .guide__arrow {
  transform: scaleX(-1);
}

.guide__nav {
  display: flex;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(127, 127, 127, 0.18);
}

.guide__nav-btn {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: 2px solid var(--guide-accent);
  border-radius: 50px;
  background: transparent;
  color: var(--guide-accent);
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  -webkit-tap-highlight-color: transparent;
}

.guide__nav-btn--accent {
  border-color: transparent;
  background: linear-gradient(180deg, var(--guide-accent-top), var(--guide-accent));
  color: #fff;
  box-shadow: 0 4px 0 var(--guide-accent-edge);
}

.guide__nav-btn:active {
  transform: scale(0.96);
}

.guide__nav-btn--accent:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 var(--guide-accent-edge);
}

.guide__sheet--rtl .guide__nav-btn svg {
  transform: scaleX(-1);
}

.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.25s ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}

@keyframes guide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: none;
  }
}

@keyframes guide-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  50% {
    transform: translateX(6px);
  }
  75% {
    transform: translateX(-4px);
  }
}

@keyframes guide-fab-pulse {
  0% {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 0 0 color-mix(in srgb, var(--guide-accent) 50%, transparent);
  }
  70%, 100% {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 0 14px color-mix(in srgb, var(--guide-accent) 0%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .guide-fab,
  .guide__sheet,
  .guide__item--shake {
    animation: none;
  }
}
</style>
