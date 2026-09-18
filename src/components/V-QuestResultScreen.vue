<template>
  <transition name="modal-fade">
    <div v-if="finished" class="modal-overlay">
      <div class="success-fullscreen">
        <div class="salute-container" v-if="animStep >= 1 && !hasMistakes">
          <div v-for="p in confettiParticles" :key="p.id" class="confetti-piece"
               :style="{
                 left: p.left + '%',
                 backgroundColor: p.color,
                 animationDelay: p.delay + 's',
                 animationDuration: p.duration + 's',
                 width: p.width + 'px',
                 height: p.height + 'px'
               }">
          </div>
        </div>
        <div class="success-content-wrapper">
          <template v-if="!hasMistakes">
            <h2 class="success-title slide-down" v-if="animStep >= 1">{{ t('questModals.succesCompleted') }}</h2>
            <p class="success-subtitle slide-down" v-if="animStep >= 1 && !previouslyCleared">
              {{ t('questModals.rewardGot') }}
            </p>
            <p class="success-subtitle slide-down" v-else-if="animStep >= 1 && previouslyCleared">
              {{ t('questModals.questCompletedAgain') }}
            </p>
          </template>
          <template v-else>
            <h2 class="success-title slide-down" v-if="animStep >= 1">{{ t('questModals.areErrors') }}</h2>
            <p class="success-subtitle slide-down" v-if="animStep >= 1">{{ t('questModals.mistakes') }}</p>
          </template>

          <div class="success-mascot" :class="{'success-mascot--glow': !hasMistakes}" v-if="animStep >= 1">
            <img v-if="!hasMistakes" :src="Great" class="success-hedgehog pop-in" alt="Great"/>
            <img v-else :src="Support" class="success-hedgehog pop-in" alt="Support"/>
          </div>

          <div class="success-rewards" v-if="!hasMistakes && !previouslyCleared">
            <div class="reward-row --xp" :class="{ 'visible': animStep >= 2 }">
              <span class="xp-badge-3d reward-icon-xp">XP</span>
              <span class="reward-val text-xp">+{{ displayXp }}</span>
            </div>
            <div class="reward-row --coins" :class="{ 'visible': animStep >= 3 }">
              <img src="../../assets/images/article.svg" alt="coins" class="reward-icon">
              <span class="reward-val text-coins">+{{ displayCoins }}</span>
            </div>
          </div>
          <div class="success-actions" :class="{ 'visible': animStep >= (!hasMistakes && !previouslyCleared ? 4 : 2) }">
            <template v-if="!hasMistakes">
              <button v-if="hasNextQuest" class="success-btn success-btn-primary" @click="$emit('next')">
                {{ t('questModals.next') }}
              </button>
              <button class="success-btn" :class="hasNextQuest ? 'success-btn-secondary' : 'success-btn-primary'"
                      @click="$emit('themes')">
                {{ t('questModals.back') }}
              </button>
            </template>
            <template v-else>
              <button class="success-btn success-btn-primary" style="background: #ffb100; box-shadow: 0 6px 0 #e69c00;"
                      @click="$emit('retryMistakes')">
                {{ t('questModals.repeat') }}
              </button>
              <button v-if="hasNextQuest" class="success-btn success-btn-secondary" @click="$emit('next')">
                {{ t('questModals.next') }}
              </button>
              <button v-else class="success-btn success-btn-secondary" @click="$emit('themes')">
                {{ t('questModals.back') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Support from 'assets/images/Support.svg'
import Great from 'assets/images/Greatcon.svg'

const {t} = useI18n()

defineProps({
  finished: Boolean,
  hasMistakes: Boolean,
  previouslyCleared: Boolean,
  animStep: Number,
  displayXp: Number,
  displayCoins: Number,
  confettiParticles: Array,
  hasNextQuest: Boolean
})

defineEmits(['next', 'themes', 'retryMistakes'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 34, 0.94);
  backdrop-filter: blur(5px);
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
  padding: 56px 10px 10px 10px;
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

.success-mascot--glow::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: pulseGlow 2s infinite alternate;
  z-index: -1;
}

@keyframes pulseGlow {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
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
  width: 140px;
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
  padding: 10px;
  border-radius: 20px;
}

.reward-row.--xp {
  background: #2b5891;
  padding: 10px;
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

.reward-icon {
  width: 56px;
  height: 44px;
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
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  box-shadow: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
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

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>