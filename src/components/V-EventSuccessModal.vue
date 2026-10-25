<template>
  <transition name="modal-fade">
    <div v-if="finished" class="modal-overlay-fullscreen">
      <div class="success-fullscreen">
        <div class="salute-container" v-if="animStep >= 1 && isQuestFullyCompleted">
          <div v-for="p in confettiParticles" :key="p.id" class="confetti-piece"
               :style="{ left: p.left + '%', backgroundColor: p.color, animationDelay: p.delay + 's', animationDuration: p.duration + 's', width: p.width + 'px', height: p.height + 'px' }">
          </div>
        </div>
        <div class="success-content-wrapper">
          <template v-if="isQuestFullyCompleted">
            <h2 class="success-title slide-down" v-if="animStep >= 1">
              {{ t('questModals.succesCompleted') || t('eventSessionPage.perfect') }}</h2>
            <p class="success-subtitle slide-down" v-if="animStep >= 1 && !previouslyCleared">
              {{ t('questModals.rewardGot') }}
            </p>
            <p class="success-subtitle slide-down" v-else-if="animStep >= 1 && previouslyCleared">
              {{ t('questModals.questCompletedAgain') }}
            </p>
          </template>
          <template v-else>
            <h2 class="success-title slide-down" v-if="animStep >= 1">{{ t('questModals.areErrors') }}</h2>
            <p class="success-subtitle slide-down" v-if="animStep >= 1">
              {{ t('questModals.mistakes') || t('eventSessionPage.noMistake') }}</p>
          </template>

          <div class="success-mascot" :class="{'success-mascot--glow': isQuestFullyCompleted}" v-if="animStep >= 1">
            <div class="mascot-lottie-wrapper" v-if="!lottieError">
              <DotLottieVue
                  :data="JSON.stringify(lottieData)"
                  :autoplay="true"
                  :loop="true"
                  class="success-lottie"
                  @error="handleLottieError"
                  @loadError="handleLottieError"
              />
            </div>
            <img v-else :src="mascotSrc" class="success-hedgehog" alt="Result"/>
          </div>
          <div class="success-rewards" v-if="isQuestFullyCompleted && !previouslyCleared">
            <div class="reward-row --xp" :class="{ 'visible': animStep >= 2 }">
              <span class="xp-badge-3d reward-icon-xp">XP</span>
              <span class="reward-val text-xp">+{{ displayXp }}</span>
            </div>
            <div class="reward-row --coins" :class="{ 'visible': animStep >= 3 }">
              <span class="xp-badge-3d">🎃</span>
              <span class="reward-val text-coins">+{{ displayCoins }}</span>
            </div>
          </div>
          <div class="success-actions"
               :class="{ 'visible': animStep >= (isQuestFullyCompleted && !previouslyCleared ? 4 : 2) }">
            <template v-if="isQuestFullyCompleted">
              <button class="success-btn success-btn-primary" @click="$emit('themes')">
                {{ t('questModals.back') || t('eventSessionPage.leave') }}
              </button>
            </template>
            <template v-else>
              <button class="success-btn success-btn-primary" style="background: #ffb100; box-shadow: 0 6px 0 #e69c00;"
                      @click="$emit('retryMistakes')">
                {{ t('questModals.repeat') || t('eventSessionPage.again') }}
              </button>
              <button class="success-btn success-btn-secondary" @click="$emit('themes')">
                {{ t('questModals.back') || t('eventSessionPage.leave') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {ref} from 'vue'
import {useI18n} from '#i18n'
import {DotLottieVue} from '@lottiefiles/dotlottie-vue'

const {t} = useI18n()
const lottieError = ref(false)

defineProps({
  finished: Boolean,
  isQuestFullyCompleted: Boolean,
  previouslyCleared: Boolean,
  animStep: Number,
  displayXp: Number,
  displayCoins: Number,
  confettiParticles: Array,
  mascotSrc: String,
  lottieData: Object
})

defineEmits(['themes', 'retryMistakes'])

const handleLottieError = () => {
  lottieError.value = true
}
</script>

<style scoped>
.modal-overlay-fullscreen {
  position: fixed;
  inset: 0;
  background: rgb(25 29 43);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 99999;
  padding: 0;
}

.success-fullscreen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.salute-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.confetti-piece {
  position: absolute;
  top: -30px;
  opacity: 0;
  border-radius: 3px;
  animation: confettiFall linear forwards;
  will-change: transform, opacity;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg) scale(0.6);
    opacity: 0;
  }
}

.success-content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.success-title {
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 8px;
  color: #fff;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.success-subtitle {
  font-size: 18px;
  color: #c9cdd4;
  margin-bottom: 40px;
  font-weight: 600;
}

.success-mascot {
  position: relative;
  margin-bottom: 30px;
  z-index: 2;
}

.mascot-lottie-wrapper {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px;
  margin: 36px 0;
}

.success-lottie {
  width: 340px;
}

.success-hedgehog {
  width: 160px;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.5));
}

.success-rewards {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  justify-content: center;
}

.reward-row {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 900;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.reward-row.visible {
  opacity: 1;
  transform: translateY(0);
}

.reward-row.--coins {
  background: #9f874a;
  padding: 10px 16px;
  border-radius: 20px;
}

.reward-row.--xp {
  background: #2b5891;
  padding: 14px;
  border-radius: 20px;
}

.text-coins {
  color: #ffb100;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  width: 69px;
}

.text-xp {
  width: 69px;
  color: #c982ff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.reward-icon-xp {
  font-size: 18px;
  padding: 8px 14px;
  border-radius: 12px;
  margin-right: 4px;
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #3b82f6 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 9999999999;
  width: 100%;
  max-width: 314px;
  opacity: 0;
  transform: translateY(20px) translateZ(0);
  transition: all 0.4s ease;
  will-change: transform, opacity;
}

.success-actions.visible {
  opacity: 1;
  transform: translateY(0);
}

.success-btn {
  width: 100%;
  padding: 16px;
  border-radius: 50px;
  border: none;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  text-transform: uppercase;
}

.success-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent !important;
}

.success-btn-primary {
  background: #5e7cf0;
  color: white;
  box-shadow: 0 6px 0 #3a52af;
}

.success-btn-secondary {
  background: none;
  color: #fff;
  box-shadow: none;
}

.pop-in {
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.slide-down {
  animation: slideDown 0.5s ease-out forwards;
}

@keyframes popIn {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  80% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideDown {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>