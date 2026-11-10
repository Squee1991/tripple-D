<template>
  <div class="decks-page">
    <header class="decks-head">
      <VBackBtnNav/>
      <h1 class="decks-head__title">{{ t('flashCards.pageTitle') }}</h1>
    </header>

    <div v-if="!ready" class="decks-loading">
      <span class="decks-loading__dot"></span>
    </div>

    <template v-else>
      <!-- повторение на сегодня по всем колодам -->
      <section v-if="decksStore.cards.length" class="review-hero" :class="{ 'review-hero--done': !decksStore.totalDue }">
        <div class="review-hero__icon" aria-hidden="true">{{ decksStore.totalDue ? '🔁' : '✅' }}</div>
        <div class="review-hero__text">
          <p class="review-hero__title">{{ t('flashCards.reviewTitle') }}</p>
          <p class="review-hero__sub">
            {{ decksStore.totalDue ? t('flashCards.reviewText', {count: decksStore.totalDue}) : t('flashCards.reviewDone') }}
          </p>
        </div>
        <NuxtLink v-if="decksStore.totalDue" class="review-hero__btn" to="/cards/all/session?mode=review">
          {{ t('flashCards.reviewBtn') }}
        </NuxtLink>
      </section>

      <section v-if="!decksStore.decks.length" class="decks-empty">
        <div class="decks-empty__stack" aria-hidden="true">
          <span class="decks-empty__card decks-empty__card--back">das</span>
          <span class="decks-empty__card decks-empty__card--mid">die</span>
          <span class="decks-empty__card decks-empty__card--front">der</span>
        </div>
        <h2 class="decks-empty__title">{{ t('flashCards.emptyTitle') }}</h2>
        <p class="decks-empty__text">{{ t('flashCards.emptyText') }}</p>
      </section>

      <ul v-else class="decks-list">
        <li v-for="deck in decksStore.decks" :key="deck.id">
          <NuxtLink class="deck-tile" :to="`/cards/${deck.id}`" :style="{ '--deck': deck.color }">
            <span class="deck-tile__stack" aria-hidden="true">
              <span class="deck-tile__sheet deck-tile__sheet--back"></span>
              <span class="deck-tile__sheet">{{ deckInitial(deck) }}</span>
            </span>
            <span class="deck-tile__body">
              <span class="deck-tile__top">
                <span class="deck-tile__title">{{ deck.title }}</span>
                <span v-if="deck.level" class="deck-tile__level">{{ deck.level }}</span>
              </span>
              <span class="deck-tile__meta">{{ t('flashCards.deckCards', {count: stats(deck).total}) }}</span>
              <span class="deck-tile__bar">
                <span class="deck-tile__bar-fill" :style="{ width: learnedPercent(deck) + '%' }"></span>
              </span>
            </span>
            <span v-if="stats(deck).due" class="deck-tile__due">{{ stats(deck).due }}</span>
            <VArrowNav/>
          </NuxtLink>
        </li>
      </ul>

      <button type="button" class="decks-new" @click="formOpen = true">
        <span class="decks-new__plus" aria-hidden="true">+</span>
        {{ t('flashCards.newDeck') }}
      </button>
    </template>

    <VDeckForm v-model="formOpen" :saving="saving" @save="createDeck"/>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useSeoMeta} from '#imports'
import VBackBtnNav from '~/src/components/V-backBtnNav.vue'
import VArrowNav from '~/src/components/V-arrowNav.vue'
import VDeckForm from '~/src/components/cards/V-deckForm.vue'
import {userAuthStore} from '~/store/authStore.js'
import {useDecksStore} from '~/store/decksStore.js'

useSeoMeta({robots: 'noindex, nofollow'})

const {t} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const decksStore = useDecksStore()

const formOpen = ref(false)
const saving = ref(false)
const ready = computed(() => decksStore.loaded)

watch(() => [authStore.initialized, authStore.uid], ([initialized, uid]) => {
  if (!initialized) return
  if (!uid) {
    decksStore.reset()
    router.replace('/')
    return
  }
  decksStore.load().catch(err => console.error(err))
}, {immediate: true})

const stats = (deck) => decksStore.deckStats(deck.id)
const learnedPercent = (deck) => {
  const s = stats(deck)
  return s.total ? Math.round(((s.learning + s.mastered) / s.total) * 100) : 0
}
const deckInitial = (deck) => (deck.title || '?').trim().charAt(0).toUpperCase()

async function createDeck(data) {
  saving.value = true
  try {
    const deck = await decksStore.createDeck(data)
    formOpen.value = false
    if (deck) router.push(`/cards/${deck.id}`)
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.decks-page {
  width: 100%;
  max-width: 640px;
  min-height: 100%;
  margin: 0 auto;
  padding: 12px 16px 40px;
  box-sizing: border-box;
}

.decks-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.decks-head__title {
  color: var(--title);
  font-size: 24px;
  font-weight: 900;
}

.decks-loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.decks-loading__dot {
  width: 34px;
  height: 34px;
  border: 4px solid var(--tabsSlideBorderColor);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: decks-spin 0.8s linear infinite;
}

@keyframes decks-spin {
  to {
    rotate: 360deg;
  }
}

/* повторение на сегодня */
.review-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px;
  border: 2px solid #c4b5fd;
  border-radius: 20px;
  background: linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%);
  box-shadow: 0 5px 0 #5b21b6, 0 8px 14px rgba(0, 0, 0, 0.2);
  color: #fff;
}

.review-hero--done {
  border-color: #86efac;
  background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
  box-shadow: 0 5px 0 #15803d, 0 8px 14px rgba(0, 0, 0, 0.2);
}

.review-hero__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  font-size: 24px;
}

.review-hero__text {
  flex: 1;
  min-width: 0;
}

.review-hero__title {
  font-size: 17px;
  font-weight: 900;
}

.review-hero__sub {
  font-size: 14px;
  font-weight: 700;
  opacity: 0.92;
}

.review-hero__btn {
  flex-shrink: 0;
  padding: 10px 16px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.18);
  color: #6d28d9;
  font-size: 15px;
  font-weight: 900;
  text-decoration: none;
}

.review-hero__btn:active {
  transform: translateY(4px);
  box-shadow: none;
}

/* пусто */
.decks-empty {
  padding: 26px 10px 10px;
  text-align: center;
}

.decks-empty__stack {
  position: relative;
  width: 150px;
  height: 110px;
  margin: 0 auto 18px;
}

.decks-empty__card {
  position: absolute;
  top: 10px;
  left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 18px;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.decks-empty__card--back {
  background: #22c55e;
  rotate: -14deg;
  translate: -26px 4px;
}

.decks-empty__card--mid {
  background: #ef4444;
  rotate: 12deg;
  translate: 26px 4px;
}

.decks-empty__card--front {
  background: #3b82f6;
}

.decks-empty__title {
  margin-bottom: 6px;
  color: var(--title);
  font-size: 20px;
  font-weight: 900;
}

.decks-empty__text {
  max-width: 380px;
  margin: 0 auto;
  color: var(--title);
  font-size: 15px;
  font-weight: 700;
  opacity: 0.8;
}

/* колоды */
.decks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.deck-tile {
  --deck: #8b5cf6;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 12px 12px 14px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  background: var(--tabsSlideBg);
  box-shadow: var(--boxShadowMobile);
  color: var(--titleColor);
  text-decoration: none;
  transition: transform 0.1s;
}

.deck-tile:active {
  transform: translateY(3px);
}

.deck-tile__stack {
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
}

.deck-tile__sheet {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--deck);
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 22px;
  font-weight: 900;
}

.deck-tile__sheet--back {
  background: color-mix(in srgb, var(--deck) 45%, #fff);
  rotate: 10deg;
  translate: 5px -3px;
}

.deck-tile__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.deck-tile__top {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.deck-tile__title {
  overflow: hidden;
  color: var(--title);
  font-size: 17px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deck-tile__level {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--deck);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
}

.deck-tile__meta {
  color: var(--title);
  font-size: 13px;
  font-weight: 700;
  opacity: 0.75;
}

.deck-tile__bar {
  height: 7px;
  overflow: hidden;
  border-radius: 4px;
  background: color-mix(in srgb, var(--title) 15%, transparent);
}

.deck-tile__bar-fill {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: var(--deck);
  transition: width 0.4s ease;
}

.deck-tile__due {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 7px;
  box-sizing: border-box;
  border-radius: 14px;
  background: #f97316;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
}

.decks-new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 18px;
  padding: 15px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%);
  box-shadow: 0 5px 0 #6d28d9;
  color: #fff;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
}

.decks-new:active {
  transform: translateY(5px);
  box-shadow: none;
}

.decks-new__plus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  color: #8b5cf6;
  font-size: 22px;
  line-height: 1;
}

@media (prefers-reduced-motion: reduce) {
  .decks-loading__dot {
    animation-duration: 2s;
  }
}
</style>
