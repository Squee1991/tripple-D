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
            :class="{ 'guide__sheet--rtl': locale === 'ar', 'guide__sheet--dragging': dragY > 0 }"
            :style="dragY ? { transform: `translateY(${dragY}px)` } : null"
            role="dialog"
            aria-modal="true"
        >
          <div
              class="guide__top"
              @touchstart.passive="onDragStart"
              @touchmove.passive="onDragMove"
              @touchend="onDragEnd"
          >
            <span class="guide__grabber" aria-hidden="true"></span>
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
          </div>

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
              <div v-if="typing && index === path.length - 1" class="guide__row">
                <img class="guide__row-avatar" :src="HedgehogIcon" alt="">
                <div class="guide__bubble guide__bubble--bot guide__typing" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div v-else-if="node.children" class="guide__row">
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
                <!-- две группы: страницы учебника и задания на карте -->
                <template v-for="group in groupsOf(node)" :key="group.kind">
                <p v-if="group.caption" class="guide__caption">{{ group.caption }}</p>
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
                    <span class="guide__item-icon" :style="{ background: link.locked ? '#9e9e9e' : group.color }">
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

            <div v-if="options.length && !typing" class="guide__tiles">
              <button
                  v-for="(option, i) in options"
                  :key="option.id"
                  type="button"
                  class="guide__tile"
                  :style="{ '--accent': option.color, animationDelay: i * 0.04 + 's' }"
                  :data-track="trackName('guide_option_', option.id)"
                  @click="choose(option)"
              >
                <span class="guide__tile-icon" aria-hidden="true">{{ option.icon }}</span>
                <span class="guide__tile-label">{{ labelOf(option) }}</span>
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
            <button type="button" class="guide__nav-btn" data-track="guide_restart" @click="restart">
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
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import HedgehogIcon from '~/assets/images/AssistantIcon.png'
import VArrowNav from '~/src/components/V-arrowNav.vue'
import { guideMenu } from '~/utils/guideMenu.js'
import { guideCatalog } from '~/utils/guideCatalog.js'
import { regions } from '~/utils/regions.js'
import { userAuthStore } from '~/store/authStore.js'
import { userlangStore } from '~/store/learningStore.js'
import { useEventSessionStore } from '~/store/eventsStore.js'
import { vibrateTap, vibrateError } from '~/utils/haptics.js'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const langStore = userlangStore()
const eventStore = useEventSessionStore()

const TYPING_MS = 550
const DRAG_CLOSE_PX = 110

const isOpen = ref(false)

const path = ref([])
const typing = ref(false)
const shakingId = ref('')
const dragY = ref(0)
let dragStartY = null
let typingTimer = null

const catalogById = Object.fromEntries(guideCatalog.map(item => [item.id, item]))
const regionById = Object.fromEntries(Object.values(regions).flat().map(r => [r.id, r]))

const options = computed(() => {
  const last = path.value[path.value.length - 1]
  if (!last) return guideMenu
  return last.children || []
})

function landLevel(item) {
  if (!item.id.startsWith('land-')) return null
  const region = regionById[item.id.slice(5)]
  return region ? region.level : null
}

function isLocked(level) {
  if (level === null || authStore.isPremium) return false
  return Math.max(langStore.isLeveling, 0) < level
}

const LAND_ICON = '🗺️'
const LAND_COLOR = '#00897b'

function labelOf(node) {
  return t(node.labelKey || `hedgehogGuide.menu.${node.id}`)
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
  if (lands.length) {
    groups.push({ kind: 'lands', links: lands, icon: LAND_ICON, color: LAND_COLOR, caption: t('hedgehogGuide.onMap') })
  }
  return groups
}

function linksOf(ids) {
  return (ids || []).map(id => catalogById[id]).filter(Boolean).map(item => {
    const level = landLevel(item)
    return {
      id: item.id,
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
  dragY.value = 0
}

function choose(option) {
  vibrateTap()
  path.value = [...path.value, option]
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  clearTimeout(typingTimer)
  // прокрутку не трогаем: листает сам пользователь
  typing.value = !reduceMotion
  typingTimer = setTimeout(() => {
    typing.value = false
  }, reduceMotion ? 0 : TYPING_MS)
}

function back() {
  vibrateTap()
  clearTimeout(typingTimer)
  typing.value = false
  path.value = path.value.slice(0, -1)
}

function restart() {
  vibrateTap()
  clearTimeout(typingTimer)
  typing.value = false
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

function onDragStart(e) {
  dragStartY = e.touches[0].clientY
}

function onDragMove(e) {
  if (dragStartY === null) return
  dragY.value = Math.max(0, e.touches[0].clientY - dragStartY)
}

function onDragEnd() {
  if (dragY.value > DRAG_CLOSE_PX) close()
  dragY.value = 0
  dragStartY = null
}

onBeforeUnmount(() => clearTimeout(typingTimer))
</script>

<style scoped>
.guide-fab {
  position: fixed;
  right: 16px;
  bottom: calc(90px + env(safe-area-inset-bottom));
  z-index: 10;
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 50%;
  border: 3px solid #ffb100;
  background: #3b2d54;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 0 0 rgba(255, 177, 0, 0.5);
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
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
}

.guide__sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100dvh - 100px);
  padding: 0 max(16px, calc((100% - 480px) / 2)) calc(14px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  background: var(--bg);
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.35);
  color: var(--titleColor);
  animation: guide-up 0.42s cubic-bezier(0.22, 1, 0.36, 1);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-user-select: none;
  user-select: none;
}

.guide__sheet--dragging {
  transition: none;
}

.guide__sheet::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 3px 0 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffcf4d, #ff8fb1, #8fb4ff, #7ef0d0, #ffcf4d);
  background-size: 300% 100%;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  animation: guide-border 6s linear infinite;
}

.guide__top {
  padding-top: 10px;
  touch-action: none;
}

.guide__grabber {
  display: block;
  width: 40px;
  height: 5px;
  margin: 0 auto 10px;
  border-radius: 3px;
  background: rgba(127, 127, 127, 0.45);
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
  box-shadow: 0 0 0 2px #ffb100;
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
  animation: guide-msg 0.3s ease-out both;
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
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
  animation: guide-msg 0.25s ease-out both;
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


.guide__typing {
  display: inline-flex;
  gap: 5px;
  padding: 14px 16px;
}

.guide__typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
  animation: guide-dot 1s ease-in-out infinite;
}

.guide__typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.guide__typing span:nth-child(3) {
  animation-delay: 0.3s;
}

.guide__tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 4px;
}

.guide__tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 14px;
  border: none;
  border-radius: 20px;
  background: rgba(127, 127, 127, 0.12);
  color: var(--titleColor);
  text-align: start;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.15s ease;
  animation: guide-tile 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  -webkit-tap-highlight-color: transparent;
}

.guide__tile:active {
  transform: scale(0.95);
  background: rgba(127, 127, 127, 0.2);
}

.guide__tile-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 34px;
  border-radius: 14px;
  background: var(--accent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--accent) 45%, transparent);
  font-size: 1.35rem;
}

.guide__tile-label {
  font-size: 12px;
  font-weight: 800;
  line-height: 1.25;
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

.guide__sheet--rtl .guide__caption {
  margin: 4px 6px -4px 0;
}

.guide__list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(127, 127, 127, 0.12);
  animation: guide-msg 0.3s ease-out both;
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
  padding: 13px;
  border: none;
  border-radius: 50px;
  background: rgba(127, 127, 127, 0.15);
  color: var(--titleColor);
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.guide__nav-btn:active {
  transform: scale(0.96);
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

@keyframes guide-msg {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@keyframes guide-tile {
  from {
    transform: translateY(10px) scale(0.96);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@keyframes guide-dot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  30% {
    transform: translateY(-4px);
    opacity: 0.9;
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

@keyframes guide-border {
  to {
    background-position: 300% 0;
  }
}

@keyframes guide-fab-pulse {
  0% {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 0 0 rgba(255, 177, 0, 0.5);
  }
  70%, 100% {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 0 14px rgba(255, 177, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .guide-fab,
  .guide__sheet,
  .guide__sheet::before,
  .guide__row,
  .guide__bubble--user,
  .guide__tile,
  .guide__list,
  .guide__typing span,
  .guide__item--shake {
    animation: none;
  }
}
</style>
