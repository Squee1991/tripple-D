<script setup>
import {ref, onMounted, onBeforeUnmount, computed, watch} from 'vue'
import {useRoute, useRouter, onBeforeRouteLeave} from 'vue-router'
import {useGalaxyStore} from '../../store/galaxyStore.js'
import Meteor from '../../assets/images/meteor.svg'
import MeteorInFire from '../../assets/images/meteorinFire.svg'
import {useLaneGame} from '../../composables/useLaneGame.js'
import VLoginPreloader from "~/src/components/V-loginPreloader.vue";
import {showInterstitial} from '../../utils/admob.js'
import {vibrateSuccess, vibrateImpact, vibrateError} from '../../utils/haptics.js'

const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const store = useGalaxyStore()
const errorMessage = ref('')
const isNewRecord = ref(false)
const earnedArtiks = ref(0)
const isLoadingAd = ref(false)
const hasAdShown = ref(false)
const currentQuestions = computed(() => {
  return (store.currentGalaxy && store.currentGalaxy.questions) ? store.currentGalaxy.questions : []
})

// Подсказка «+🛡️» / «+🐢», когда за серию правильных ответов дали заряд способности
const earnedAbility = ref(null)
let earnedAbilityTimer = 0

function showEarnedAbility(ability) {
  earnedAbility.value = ability
  clearTimeout(earnedAbilityTimer)
  earnedAbilityTimer = setTimeout(() => {
    earnedAbility.value = null
  }, 1300)
}

// Ошибка или удар босса тратит одно деление батареи корабля; щит принимает удар на себя
function onShipHit({shieldUsed}) {
  if (shieldUsed) {
    vibrateImpact()
    return
  }
  vibrateError()
  store.consumeBattery()
}

const {
  LANE_COUNT,
  score, energy, bestCombo, comboMultiplier, correctCount, mistakes,
  shieldCharges, slowdownCharges, isShieldActive, isSlowdownActive, slowdownRoundsLeft,
  boss, bossEvent, bossesDefeated,
  shipLane, currentRound, fallProgress, shot, phase, lastResult, isGameOver, isPaused,
  startGame, stopGame, pauseGame, resumeGame, finishGame, moveShip, shoot, activateShield, activateSlowdown
} = useLaneGame(currentQuestions, {
  onCorrectAnswer: vibrateSuccess,
  onMistake: onShipHit,
  onAbilityEarned: showEarnedAbility,
  onBossAppeared: vibrateImpact,
  onBossHit: vibrateImpact,
  onBossDefeated: vibrateSuccess,
  onBossCrashed: onShipHit
})

const isFirstRound = computed(() => correctCount.value === 0 && mistakes.value.length === 0)
const laneWidthPercent = 100 / LANE_COUNT

function laneCenter(lane) {
  return `${lane * laneWidthPercent + laneWidthPercent / 2}%`
}

// Метеорит и босс опускаются сверху к кораблю: позицию задаём через CSS-переменные
const meteorStyle = computed(() => ({
  left: laneCenter(currentRound.value?.meteorLane ?? 1),
  '--fall-progress': fallProgress.value
}))
const shipStyle = computed(() => ({left: laneCenter(shipLane.value)}))
const shotStyle = computed(() => ({left: laneCenter(shot.value?.lane ?? shipLane.value)}))
const bossStyle = computed(() => ({'--boss-progress': boss.value ? boss.value.progress : 0}))
const isBossJustHit = computed(() => !!boss.value && phase.value === 'result' && !!lastResult.value?.isCorrect)
const isMeteorExploded = computed(() => phase.value === 'result' && !!lastResult.value?.isCorrect)
const isMeteorBurning = computed(() => phase.value === 'result' && !!lastResult.value && !lastResult.value.isCorrect)
const canShoot = computed(() => phase.value === 'falling' && !shot.value && !isPaused.value)

// Осколки взрыва: разлетаются в разные стороны под разными углами
const EXPLOSION_PIECES = Array.from({length: 8}, (_, index) => ({
  '--piece-angle': `${index * 45 + 20}deg`,
  '--piece-distance': `${46 + (index % 3) * 14}px`
}))

// Свернули приложение — ставим на паузу, чтобы метеорит не упал без игрока
function onVisibilityChange() {
  if (document.visibilityState === 'hidden') pauseGame()
}

watch(isGameOver, async (ended) => {
  if (ended) {
    store.recordFlight({meteorsDestroyed: correctCount.value, bossesDefeated: bossesDefeated.value})
    isNewRecord.value = await store.updateHighScore(store.activeGalaxyId, score.value)
    earnedArtiks.value = score.value * 1
    if (earnedArtiks.value > 0) {
      await store.addArtiks(earnedArtiks.value)
    }
  }
})

watch(score, (newVal) => {
  store.score = newVal
})

// --- Управление: кнопки, свайп по полю, стрелки и цифры 1-3 на клавиатуре ---
const SWIPE_MIN_DISTANCE = 40
let swipeStartX = null

function onTouchStart(event) {
  swipeStartX = event.touches[0].clientX
}

function onTouchEnd(event) {
  if (swipeStartX === null) return
  const swipeDistance = event.changedTouches[0].clientX - swipeStartX
  swipeStartX = null
  if (Math.abs(swipeDistance) >= SWIPE_MIN_DISTANCE) moveShip(swipeDistance > 0 ? 1 : -1)
}

function onKeyDown(event) {
  if (event.key === 'ArrowLeft') moveShip(-1)
  if (event.key === 'ArrowRight') moveShip(1)
  const answerIndex = Number(event.key) - 1
  const answer = currentRound.value?.answerButtons[answerIndex]
  if (answer) shoot(answer)
}

const initGame = () => {
  try {
    const sectorId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    if (!sectorId) {
      errorMessage.value = t('galaxySession.errorID');
      return;
    }

    store.checkBatteryRegen();
    if (store.currentBattery <= 0) {
      errorMessage.value = t('galaxySession.errorEnergy');
      return;
    }

    store.setMission(sectorId);
    isNewRecord.value = false;
    earnedArtiks.value = 0;

    if (!hasAdShown.value) {
      hasAdShown.value = true;
      isLoadingAd.value = true;
      showInterstitial(() => {
        isLoadingAd.value = false;
        setTimeout(() => {
          startGame(store.currentBattery);
        }, 50);
      });
    } else {
      startGame(store.currentBattery);
    }

  } catch (error) {
    errorMessage.value = "Ошибка: " + error.message;
    isLoadingAd.value = false;
  }
}

const goHome = () => {
  router.push('/german-universe')
}

const goToPay = () => {
  router.push('/pay')
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  document.addEventListener('visibilitychange', onVisibilityChange)
  if (store.galaxies && store.galaxies.length > 0) {
    initGame()
  } else {
    store.fetchGalaxies().then(() => {
      initGame()
    }).catch(err => {
      errorMessage.value = t('galaxySession.errorData')
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  clearTimeout(earnedAbilityTimer)
  stopGame()
})

onBeforeRouteLeave((to, from, next) => {
  if (to.path.includes('undefined') || to.matched.length === 0) {
    next('/german-universe')
  } else {
    next()
  }
})
</script>

<template>
  <div class="game-universe">
    <VLoginPreloader v-if="isLoadingAd"/>
    <div v-if="errorMessage" class="error-screen">
      <h1>⚠️ {{ t('galaxyMenu.errorTitle') }}</h1>
      <p>{{ errorMessage }}</p>
      <div class="error-actions">
        <button v-if="errorMessage.includes('PLUS')" class="btn-plus" @click="goToPay">
          {{ t('galaxySelector.getPlusBtn') }}
        </button>
        <button class="btn-go" @click="goHome">{{ t('galaxyMenu.errorBtn') }}</button>
      </div>
    </div>
    <div v-else-if="!isLoadingAd" class="sky">
      <div class="star-layer"></div>

      <!-- Игровая колонка: на широких экранах не растягивается, стоит по центру -->
      <div class="game-column">
        <!-- Верхняя панель: очки и батарея корабля (3 деления — 3 жизни) -->
        <div class="top-panel">
          <button class="pause-btn" :disabled="isGameOver" @click="pauseGame" aria-label="pause">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>
          </button>
          <div class="score-board">
            <span class="score-label">{{ t('galaxyMenu.points') }}</span>
            <span class="score-value">{{ score }}</span>
          </div>
          <span v-if="comboMultiplier > 1" class="combo-badge">🔥 ×{{ comboMultiplier }}</span>
          <div class="battery-ui" :class="{ 'is-hit': isMeteorBurning && !lastResult.shieldUsed }">
            <div class="battery-segment segment-red" :class="{ active: energy >= 1 }"></div>
            <div class="battery-segment segment-yellow" :class="{ active: energy >= 2 }"></div>
            <div class="battery-segment segment-green" :class="{ active: energy >= 3 }"></div>
          </div>
        </div>
        <div v-if="isFirstRound" class="move-hint">{{ t('galaxySession.moveHint') }}</div>

        <!-- Поле из трёх полос -->
        <div class="lanes" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div v-for="lane in LANE_COUNT" :key="'lane' + lane" class="lane"></div>

          <!-- Босс: огромный метеорит со здоровьем, медленно опускается к кораблю -->
          <div v-if="boss" class="boss" :class="{ 'is-hit': isBossJustHit }" :style="bossStyle">
            <div class="boss__health">
              <span v-for="segment in boss.maxHealth" :key="segment" class="boss__health-segment"
                    :class="{ 'is-full': segment <= boss.health }"></span>
            </div>
            <img :src="MeteorInFire" class="boss__image" alt="">
          </div>

          <!-- Метеорит со словом -->
          <div v-if="currentRound" class="meteor" :style="meteorStyle">
            <template v-if="!isMeteorExploded">
              <span class="meteor__word">{{ currentRound.word }}</span>
              <img :src="isMeteorBurning ? MeteorInFire : Meteor" class="meteor__image" alt="">
            </template>
            <div v-else class="explosion">
              <span class="explosion__flash"></span>
              <span class="explosion__ring"></span>
              <span v-for="(pieceStyle, index) in EXPLOSION_PIECES" :key="index" class="explosion__piece" :style="pieceStyle"></span>
              <span class="explosion__emoji">💥</span>
            </div>
          </div>

          <!-- Лазер -->
          <div v-if="shot" class="laser" :class="{ 'is-miss': !shot.isHit }" :style="shotStyle"></div>

          <Transition name="boss-banner">
            <div v-if="bossEvent === 'intro'" key="intro" class="boss-banner">⚠️ {{ t('galaxySession.bossIncoming') }}</div>
            <div v-else-if="bossEvent === 'defeated'" key="defeated" class="boss-banner is-victory">💥 {{ t('galaxySession.bossDefeated') }}</div>
            <div v-else-if="bossEvent === 'crashed'" key="crashed" class="boss-banner is-crash">💥</div>
          </Transition>

          <div v-if="isSlowdownActive" class="slowdown-badge">🐢 {{ slowdownRoundsLeft }}</div>
          <Transition name="points-pop">
            <div v-if="earnedAbility" class="ability-earned">+{{ earnedAbility === 'shield' ? '🛡️' : '🐢' }}</div>
          </Transition>

          <!-- Корабль -->
          <div class="ship" :style="shipStyle">
            <div v-if="isShieldActive" class="ship__shield"></div>
            <img class="ship__image" :src="store.activeShip.img" alt="Ship">
            <Transition name="points-pop">
              <span v-if="isMeteorExploded" class="ship__points">+{{ lastResult.pointsForRound }}</span>
            </Transition>
          </div>

          <!-- После ошибки показываем правильный ответ -->
          <Transition name="correction">
            <div v-if="isMeteorBurning" class="correction" :class="{ 'is-shielded': lastResult.shieldUsed }">
              <span v-if="lastResult.shieldUsed" class="correction__shield">🛡️</span>
              <span class="correction__word">{{ currentRound.word }}</span>
              <span class="correction__arrow">→</span>
              <span class="correction__answer">{{ currentRound.correctAnswer }}</span>
            </div>
          </Transition>
        </div>

        <!-- Кнопки: ответы (выстрел), движение и способности -->
        <div class="controls">
          <div v-if="currentRound" class="answers">
            <button v-for="answer in currentRound.answerButtons" :key="answer" class="answer-btn"
                    :disabled="!canShoot" @click="shoot(answer)">
              {{ answer }}
            </button>
          </div>
          <div class="controls__row">
            <button class="control-btn" :disabled="shipLane === 0" @click="moveShip(-1)" aria-label="left">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
            </button>
            <div class="abilities">
              <button class="ability-btn" :class="{ 'is-active': isShieldActive }"
                      :disabled="isShieldActive || shieldCharges === 0" @click="activateShield" aria-label="shield">
                <span class="ability-btn__icon">🛡️</span>
                <span class="ability-btn__count">{{ shieldCharges }}</span>
              </button>
              <button class="ability-btn" :class="{ 'is-active': isSlowdownActive }"
                      :disabled="isSlowdownActive || slowdownCharges === 0" @click="activateSlowdown" aria-label="slowdown">
                <span class="ability-btn__icon">🐢</span>
                <span class="ability-btn__count">{{ slowdownCharges }}</span>
              </button>
            </div>
            <button class="control-btn" :disabled="shipLane === LANE_COUNT - 1" @click="moveShip(1)" aria-label="right">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Пауза: продолжить или завершить полёт (очки сохраняются) -->
      <Transition name="modal-slide">
        <div v-if="isPaused && !isGameOver" class="game-over-overlay">
          <div class="toon-main-card pause-card">
            <h2 class="pause-card__title">⏸ {{ t('galaxySession.pauseTitle') }}</h2>
            <p class="pause-card__note">{{ t('galaxySession.finishNote') }}</p>
            <div class="modal-actions">
              <button class="action-btn toon-btn-blue" @click="resumeGame">{{ t('galaxySession.resume') }}</button>
              <button class="action-btn toon-btn-red" @click="finishGame">{{ t('galaxySession.finishFlight') }}</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal-slide">
        <div v-if="isGameOver" class="game-over-overlay">
          <div class="game-over-card toon-main-card">
            <h2 class="death-title" v-if="isNewRecord">{{ t('galaxySession.newRecord') }}</h2>

            <div class="score-display">
              <img class="astronaut" src="../../assets/images/galaxy-images/astronautFail.svg" alt="astronautFail">
              <div class="score__wrapper">
                <span class="score-text">{{ t('galaxySession.check') }}</span>
                <div class="score__inner">
                  <img class="score-coin" src="../../assets/images/galaxy-images/Artics.svg" alt="">
                  <span class="fs-val">{{ score }}</span>
                </div>
                <span class="best-combo">🔥 {{ t('galaxySession.bestCombo') }}: {{ bestCombo }}</span>
                <span v-if="bossesDefeated" class="best-combo">👾 {{ t('galaxySession.bossesDefeated') }}: {{ bossesDefeated }}</span>
              </div>
            </div>

            <div class="mistakes">
              <div v-if="!mistakes.length" class="mistakes__title">{{ t('galaxySession.noMistakes') }}</div>
              <template v-else>
                <div class="mistakes__item mistakes__item--head">
                  <span></span>
                  <span>{{ t('galaxySession.yourAnswer') }}</span>
                  <span>{{ t('galaxySession.correctAnswer') }}</span>
                </div>
                <ul class="mistakes__list">
                  <li v-for="(mistake, index) in mistakes" :key="index" class="mistakes__item">
                    <span class="mistakes__word">{{ mistake.word }}</span>
                    <span class="mistakes__chosen">{{ mistake.chosenAnswer || '—' }}</span>
                    <span class="mistakes__correct">{{ mistake.correctAnswer }}</span>
                  </li>
                </ul>
              </template>
            </div>

            <div class="modal-actions">
              <button class="action-btn restart-btn toon-btn-blue" @click="initGame">{{
                  t('galaxySession.again')
                }}
              </button>
              <button class="action-btn home-btn toon-btn-red" @click="goHome">{{
                  t('galaxySession.constellations')
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.game-universe {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #020111 0%, #0d0a2b 50%, #1a0b2e 100%);
  overflow: hidden;
  font-family: Nunito, sans-serif;
  user-select: none;
  -webkit-user-select: none;
}

.sky {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.star-layer {
  position: absolute;
  width: 100%;
  height: 200%;
  top: -100%;
  background-image: radial-gradient(1px 1px at 20px 30px, #ffffff, transparent),
  radial-gradient(2px 2px at 50px 80px, #e2f0ff, transparent),
  radial-gradient(2px 2px at 150px 180px, #eeddff, transparent);
  background-size: 250px 250px;
  animation: starsScroll 6s linear infinite;
  opacity: 0.85;
  pointer-events: none;
}

@keyframes starsScroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(50%);
  }
}

/* Игровая колонка: на широких экранах не растягивается */
.game-column {
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.move-hint {
  position: relative;
  z-index: 100;
  margin: 8px 16px 0;
  color: #a0aec0;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

/* Верхняя панель */
.top-panel {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: calc(8px + env(safe-area-inset-top, 0px)) 16px 0;
}

.pause-btn {
  flex: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(20, 38, 92, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #d6e9ff;
  cursor: pointer;
}

.pause-btn:active:not(:disabled) {
  transform: scale(0.94);
}

.score-board {
  margin-right: auto;
  color: #00d2ff;
}

.score-label {
  font-size: 18px;
}

.score-value {
  font-size: 26px;
  font-family: Lilita One, sans-serif;
  font-weight: 400;
  margin-left: 10px;
  color: #fff;
}

.battery-ui {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid #555;
  border-radius: 6px;
}

.battery-ui.is-hit {
  animation: batteryHit 0.4s ease-in-out 2;
  border-color: #ff5252;
}

@keyframes batteryHit {
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.battery-segment {
  width: 14px;
  height: 24px;
  background: #222;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.segment-red.active {
  background: #ff4b2b;
  box-shadow: 0 0 8px #ff4b2b;
}

.segment-yellow.active {
  background: #ffeb3b;
  box-shadow: 0 0 8px #ffeb3b;
}

.segment-green.active {
  background: #00e676;
  box-shadow: 0 0 8px #00e676;
}

.combo-badge {
  color: #ffcc33;
  font-size: 16px;
  font-weight: 900;
  animation: comboPulse 0.8s ease-in-out infinite;
}

@keyframes comboPulse {
  50% {
    transform: scale(1.12);
  }
}

/* Полосы */
.lanes {
  position: relative;
  flex: 1;
  display: flex;
  margin: 12px 8px 0;
  min-height: 0;
}

.lane {
  flex: 1;
}

/* Метеориты долетают до верха корабля: 100% высоты полос минус метеорит и корабль */
/* Босс опускается от верха полос до корабля */
.boss {
  position: absolute;
  left: 50%;
  top: calc(var(--boss-progress) * (100% - 260px));
  transform: translateX(-50%);
  width: 70%;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 40;
  pointer-events: none;
  transition: top 0.4s ease-out;
}

.boss__image {
  width: 150px;
  transform: rotate(-45deg);
  filter: drop-shadow(0 0 22px #ff5a1f);
  opacity: 0.9;
}

.boss.is-hit .boss__image {
  animation: bossHit 0.35s ease-in-out;
}

@keyframes bossHit {
  30% {
    transform: rotate(-45deg) translateX(-8px) scale(0.92);
    filter: drop-shadow(0 0 30px #ffffff) brightness(1.8);
  }
  70% {
    transform: rotate(-45deg) translateX(8px) scale(0.96);
  }
}

.boss__health {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid #ff5a1f;
}

.boss__health-segment {
  width: 34px;
  height: 10px;
  border-radius: 3px;
  background: #33243a;
  transition: background 0.3s;
}

.boss__health-segment.is-full {
  background: #ff5a1f;
  box-shadow: 0 0 8px #ff5a1f;
}

.boss-banner {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translateX(-50%);
  z-index: 250;
  padding: 12px 26px;
  border-radius: 20px;
  background: rgba(120, 10, 10, 0.92);
  border: 3px solid #ff5a1f;
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  white-space: nowrap;
  text-transform: uppercase;
  box-shadow: 0 0 40px rgba(255, 90, 31, 0.6);
  pointer-events: none;
}

.boss-banner.is-victory {
  background: rgba(20, 110, 60, 0.92);
  border-color: #3ee07f;
  box-shadow: 0 0 40px rgba(62, 224, 127, 0.6);
}

.boss-banner.is-crash {
  background: none;
  border: none;
  box-shadow: none;
  font-size: 110px;
}

.boss-banner-enter-active {
  transition: opacity 0.25s, transform 0.25s cubic-bezier(.2, 1.6, .4, 1);
}

.boss-banner-leave-active {
  transition: opacity 0.2s;
}

.boss-banner-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.5);
}

.boss-banner-leave-to {
  opacity: 0;
}

.meteor {
  position: absolute;
  top: calc(var(--fall-progress) * (100% - 230px));
  width: 33%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 50;
  pointer-events: none;
  transition: left 0.2s ease-out;
}

.meteor__word {
  max-width: 100%;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(10, 14, 40, 0.85);
  border: 2px solid #5f8dc0;
  color: #fff;
  font-size: 17px;
  font-weight: 900;
  text-align: center;
  overflow-wrap: anywhere;
}

.meteor__image {
  width: 64px;
  transform: rotate(-45deg);
  filter: drop-shadow(0 0 12px #00d2ff);
}

.explosion {
  position: relative;
  width: 90px;
  height: 90px;
  margin-top: 20px;
}

.explosion__flash {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff 0%, #ffe066 30%, #ff7a1f 60%, transparent 72%);
  animation: explosionFlash 0.55s ease-out forwards;
}

.explosion__ring {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 3px solid #00f2fe;
  box-shadow: 0 0 20px #00f2fe;
  animation: explosionRing 0.6s ease-out forwards;
}

.explosion__piece {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin: -4px 0 0 -4px;
  border-radius: 2px;
  background: #b9a68f;
  box-shadow: 0 0 6px #ff9a3c;
  animation: explosionPiece 0.65s ease-out forwards;
}

.explosion__emoji {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 54px;
  animation: explosionEmoji 0.6s ease-out forwards;
}

@keyframes explosionFlash {
  from {
    transform: scale(0.2);
    opacity: 1;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
}

@keyframes explosionRing {
  from {
    transform: scale(0.2);
    opacity: 1;
  }
  to {
    transform: scale(2.2);
    opacity: 0;
  }
}

@keyframes explosionPiece {
  from {
    transform: rotate(var(--piece-angle)) translateX(0) rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(var(--piece-angle)) translateX(var(--piece-distance)) rotate(220deg);
    opacity: 0;
  }
}

@keyframes explosionEmoji {
  0% {
    transform: scale(0.3);
  }
  40% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Лазер летит от корабля вверх по своей полосе */
.laser {
  position: absolute;
  bottom: 100px;
  top: 0;
  width: 4px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: #00f2fe;
  box-shadow: 0 0 25px #00f2fe, 0 0 10px #fff;
  transform-origin: bottom;
  animation: laserShot 0.16s linear;
  z-index: 55;
  pointer-events: none;
}

.laser.is-miss {
  opacity: 0.5;
}

@keyframes laserShot {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* Корабль */
.ship {
  position: absolute;
  bottom: 10px;
  width: 90px;
  transform: translateX(-50%);
  transition: left 0.16s ease-out;
  z-index: 60;
  pointer-events: none;
}

.ship__image {
  width: 100%;
  display: block;
}

.ship__shield {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 3px solid rgba(80, 200, 255, 0.9);
  background: radial-gradient(circle, rgba(80, 200, 255, 0.05) 55%, rgba(80, 200, 255, 0.35) 100%);
  box-shadow: 0 0 18px rgba(80, 200, 255, 0.7);
  animation: shieldPulse 1.2s ease-in-out infinite;
}

@keyframes shieldPulse {
  50% {
    transform: scale(1.06);
    opacity: 0.8;
  }
}

.slowdown-badge {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 120;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(80, 160, 255, 0.25);
  border: 2px solid rgba(80, 160, 255, 0.7);
  color: #fff;
  font-weight: 900;
}

.ability-earned {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
  z-index: 150;
  font-size: 40px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 3px 0 #000;
  pointer-events: none;
}

.ship__points {
  position: absolute;
  left: 50%;
  top: -18px;
  transform: translateX(-50%);
  color: #3ee07f;
  font-size: 26px;
  font-weight: 900;
  text-shadow: 0 2px 0 #000;
}

.points-pop-enter-active {
  transition: opacity 0.35s, transform 0.35s ease-out;
}

.points-pop-enter-from {
  opacity: 0;
  transform: translate(-50%, 12px);
}

.points-pop-leave-active {
  transition: opacity 0.15s;
}

.points-pop-leave-to {
  opacity: 0;
}

/* Правильный ответ после ошибки */
.correction {
  position: absolute;
  left: 50%;
  top: 38%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 20px;
  background: rgba(20, 22, 36, 0.95);
  border: 3px solid #ff5252;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  max-width: calc(100% - 16px);
}

.correction.is-shielded {
  border-color: #50c8ff;
}

.correction__shield {
  font-size: 22px;
}

.correction__word {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}

.correction__arrow {
  color: #a0aec0;
  font-size: 20px;
}

.correction__answer {
  color: #3ee07f;
  font-size: 22px;
  font-weight: 900;
}

.correction-enter-active, .correction-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.correction-enter-from, .correction-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.8);
}

/* Кнопки управления */
.controls {
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 12px calc(12px + env(safe-area-inset-bottom, 0px));
}

.controls__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.answers {
  display: flex;
  gap: 8px;
}

.answer-btn {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 6px;
  border: none;
  /* Скошенные углы, как у панелей в космических играх */
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  background: linear-gradient(180deg, rgba(52, 92, 170, 0.62) 0%, rgba(20, 38, 92, 0.62) 100%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #d6e9ff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.08s, background 0.15s, opacity 0.15s;
}

.answer-btn:active:not(:disabled) {
  transform: scale(0.96);
  background: linear-gradient(180deg, rgba(80, 140, 240, 0.8) 0%, rgba(36, 70, 160, 0.8) 100%);
}

.answer-btn:disabled {
  opacity: 0.5;
}

.control-btn {
  flex: none;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(90, 150, 255, 0.55) 0%, rgba(24, 52, 130, 0.55) 70%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  color: #e3f0ff;
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.08s, opacity 0.15s;
}

.control-btn:active:not(:disabled) {
  transform: scale(0.92);
  background: radial-gradient(circle at 35% 30%, rgba(120, 175, 255, 0.8) 0%, rgba(40, 80, 180, 0.8) 70%);
}

.control-btn:disabled {
  opacity: 0.3;
}

.abilities {
  display: flex;
  gap: 14px;
}

.ability-btn {
  position: relative;
  width: 46px;
  height: 46px;
  flex: none;
  border: none;
  border-radius: 50%;
  background: rgba(20, 38, 92, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.08s, opacity 0.15s, background 0.15s, box-shadow 0.15s;
}

.ability-btn__icon {
  font-size: 21px;
}

.ability-btn__count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background: #ffcc33;
  color: #1a1c24;
  font-size: 11px;
  font-weight: 900;
  line-height: 18px;
}

.ability-btn.is-active {
  background: rgba(40, 120, 230, 0.75);
  box-shadow: 0 0 16px rgba(80, 170, 255, 0.7);
}

.ability-btn:active:not(:disabled) {
  transform: scale(0.94);
}

.ability-btn:disabled:not(.is-active) {
  opacity: 0.35;
}

/* Итоги игры */
.score__inner {
  display: flex;
  align-items: center;
}

.score__wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  margin-left: 20px;
}

.best-combo {
  color: #ffcc33;
  font-size: 15px;
  font-weight: 800;
}

.death-title {
  color: #ff5252;
  font-size: 23px;
  font-weight: 900;
  margin-bottom: 20px;
  text-transform: uppercase;
  -webkit-text-stroke: 1px #000;
}

.score-display {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 5px;
}

.fs-val {
  margin-left: 5px;
  font-size: 36px;
  font-family: Lilita One, sans-serif;
  color: #3498db;
  font-weight: 400;
  line-height: 1;
  text-shadow: 1px 1px 0px #3498db;
}

.mistakes {
  margin-bottom: 22px;
  text-align: left;
}

.mistakes__title {
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  margin-bottom: 8px;
  text-align: center;
}

.mistakes__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mistakes__item {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.mistakes__word {
  color: #fff;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.mistakes__correct {
  color: #3ee07f;
  font-weight: 900;
}

.mistakes__chosen {
  color: #ff6b6b;
  font-weight: 800;
}

.mistakes__item--head {
  margin-bottom: 6px;
  padding-top: 0;
  padding-bottom: 0;
  background: none;
  color: #a0aec0;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-btn {
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: 900;
  border: 3px solid #000;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.1s;
}

.score-coin {
  width: 45px;
}

.toon-btn-blue {
  background: #3498db;
  color: #fff;
  box-shadow: 0 5px 0 #31719d;
  border: none;
}

.toon-btn-red {
  background: #ff5252;
  color: #fff;
  box-shadow: 0 5px 0 #c93c3c;
  border: none;
}

.action-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}

.astronaut {
  width: 120px;
}

.error-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(15, 5, 20, 0.95);
  color: #ff4b2b;
  z-index: 9999;
  text-align: center;
  padding: 20px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 25px;
  width: 100%;
  max-width: 300px;
}

.btn-go {
  background: #ffeb3b;
  color: #000;
  border: 3px solid #000;
  border-radius: 10px;
  font-weight: 900;
  padding: 15px 30px;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-plus {
  background: linear-gradient(135deg, #ff007a 0%, #7a00ff 100%);
  color: white;
  border: 2px solid #ff007a;
  border-radius: 10px;
  font-weight: 900;
  padding: 15px 30px;
  box-shadow: 2px 2px 0 #4a0099;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-go:active, .btn-plus:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 #000;
}

.game-over-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 5, 15, 0.85);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 5000;
  backdrop-filter: blur(8px);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.toon-main-card {
  background: #1a1c24;
  border-top: 3px solid #303443;
  border-radius: 40px 40px 0 0;
  padding: 30px 30px 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  clip-path: none;
}

.pause-card__title {
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 10px;
}

.pause-card__note {
  color: #a0aec0;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 24px;
}

.score-text {
  color: #a0aec0;
  font-size: 24px;
  font-weight: 900;
}

.modal-slide-enter-active, .modal-slide-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-slide-enter-active .toon-main-card, .modal-slide-leave-active .toon-main-card {
  transition: transform 0.2s ease-out;
}

.modal-slide-enter-from, .modal-slide-leave-to {
  opacity: 0;
}

.modal-slide-enter-from .toon-main-card, .modal-slide-leave-to .toon-main-card {
  transform: translateY(100%);
}
</style>
