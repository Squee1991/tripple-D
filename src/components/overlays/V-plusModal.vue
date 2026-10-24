<template>
  <transition name="fade">
    <div v-if="isOpen && !isCooldownActive" class="overlay" @click.self="closeModal">
      <button class="close-btn" @click="closeModal" aria-label="Закрыть">×</button>
      <transition name="scale" mode="out-in">
        <div v-if="step === 1" key="intro" class="intro-container">
          <div class="intro-character-wrapper">
            <div class="character-aura"></div>
            <img
                src="~/assets/images/PlusIconPreview.svg"
                alt="Hedgehog Legend"
                class="intro-character floating-anim"
            >
          </div>
          <div class="intro-content">
            <h2 class="intro-title">
              {{ t('plusPreviewOverlay.title')}} <br>
              <span class="highlight">{{ t('plusPreviewOverlay.title2')}}</span> <br>
              {{ t('plusPreviewOverlay.title3')}}
            </h2>
            <p class="intro-subtitle">
              {{ t('plusPreviewOverlay.title4')}}
            </p>
          </div>
          <button @click="step = 2" class="custom-button intro-btn pulse-anim">
            {{ t('plusPreviewOverlay.button')}}
            <span class="button-flare"></span>
          </button>
        </div>
        <div v-else key="paywall" class="marathon__container">
          <img class="image" src="~/assets/images/SkillupPlusBG.png" alt="SkillupPlusBG">
          <div class="features-pill">
            <div
                v-for="img in images"
                :key="img.id"
                :class="['feature-item', img.class]"
            >
              <img :src="img.icon" :alt="img.alt">
              <div v-if="img.id === 'ads'" class="forbidden-sign"></div>
            </div>
          </div>
          <button @click="pathRouter" class="custom-button">
            {{ buttonText }}
            <span class="button-flare"></span>
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useBillingStore } from '~/store/billingStore';
import Article from '~/assets/images/article.svg';
import Forever from '~/assets/images/forever.svg';
import Ads from '~/assets/images/ADS.svg';

const { t } = useI18n();
const router = useRouter();
const billingStore = useBillingStore();

const isOpen = defineModel({
  type: Boolean,
  default: false
});

const STORAGE_DISMISS_COUNT = 'plus_modal_dismiss_count';
const STORAGE_COOLDOWN_UNTIL = 'plus_modal_cooldown_until';

function getCooldownState() {
  if (typeof window === 'undefined') return true;
  const until = Number(localStorage.getItem(STORAGE_COOLDOWN_UNTIL) || 0);
  return Date.now() < until;
}

const isCooldownActive = ref(getCooldownState());

const step = ref(1);
const displayPrice = ref('');
const displayCurrency = ref('');

const images = [
  { id: 'article', class: 'side-icon', icon: Article, alt: 'Article' },
  { id: 'lives', class: 'lives-icon', icon: Forever, alt: 'Lives' },
  { id: 'ads', class: 'side-icon', icon: Ads, alt: 'Ads' }
];

const selectedPackage = computed(() => {
  if (!billingStore.offerings || billingStore.offerings.length === 0) return null;
  return billingStore.offerings[0];
});

const trialInfo = computed(() => {
  if (!billingStore.isMobile) return null;
  if (selectedPackage.value) {
    const product = selectedPackage.value.product;
    if (product?.introPrice && product.introPrice.price === 0) {
      return { days: 3 };
    }
  }
  return null;
});

const actualPrice = computed(() => {
  if (billingStore.isMobile) {
    return selectedPackage.value?.product?.priceString || '';
  }
  if (displayPrice.value) {
    return `${displayPrice.value} ${displayCurrency.value}`.trim();
  }
  return '';
});

const buttonText = computed(() => {
  if (trialInfo.value) {
    return t('submitComputed.tryFree');
  }
  if (actualPrice.value) {
    return `${t('submitComputed.try')} ${actualPrice.value}`;
  }
  return t('submitComputed.try');
});

const closeModal = () => {
  const currentCount = Number(localStorage.getItem(STORAGE_DISMISS_COUNT) || 0) + 1;
  localStorage.setItem(STORAGE_DISMISS_COUNT, String(currentCount));
  let days = 3;
  if (currentCount === 2) {
    days = 7;
  } else if (currentCount >= 3) {
    days = 21;
  }
  const cooldownUntil = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_COOLDOWN_UNTIL, String(cooldownUntil));
  isCooldownActive.value = true;

  isOpen.value = false;
};

const pathRouter = () => {
  closeModal();
  router.push('/pay');
};

watch(isOpen, (newVal) => {
  isCooldownActive.value = getCooldownState();
  if (!newVal) {
    setTimeout(() => {
      step.value = 1;
    }, 300);
  }
});

onMounted(async () => {
  isCooldownActive.value = getCooldownState();

  if (billingStore.isMobile) {
    if (!billingStore.offerings || billingStore.offerings.length === 0) {
      await billingStore.initialize();
    }
  } else {
    try {
      const data = await $fetch('/api/stripe/get-price');
      if (data) {
        displayPrice.value = data.amount;
        displayCurrency.value = data.currency;
      }
    } catch (err) {
      console.error(err);
    }
  }
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(5, 7, 15, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

.close-btn {
  position: absolute;
  top: 74px;
  right: 24px;
  width: 34px;
  height: 34px;
  padding: 5px;
  text-shadow: 1px 1px 1px white;
  background: rgb(255 255 255 / 0.15);
  border: 2px solid rgb(255 255 255 / 0.12);
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10001;
  transition: all 0.2s ease;
}

.close-btn:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.22);
}

.intro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 20px;
  max-width: 380px;
  width: 90%;
  gap: 16px;
  position: relative;
}

.intro-character-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 210px;
}

.character-aura {
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(179, 68, 255, 0.45) 0%, rgba(255, 215, 0, 0.15) 50%, transparent 75%);
  filter: blur(16px);
  z-index: 1;
}

.intro-character {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.5));
}

.floating-anim {
  animation: floatCharacter 3.2s ease-in-out infinite;
}

@keyframes floatCharacter {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.intro-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.intro-title {
  color: #ffffff;
  font-size: 23px;
  font-weight: 900;
  line-height: 1.25;
  margin: 0;
  font-family: "Nunito", sans-serif;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
}

.highlight {
  background: linear-gradient(90deg, #ffe259 0%, #ffa751 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-size: 25px;
  letter-spacing: 0.6px;
  padding: 2px 0;
  filter: drop-shadow(0 2px 8px rgba(255, 167, 81, 0.4));
}

.intro-subtitle {
  color: #c9d1d9;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  margin: 0;
  font-family: "Nunito", sans-serif;
}

.intro-btn {
  position: relative !important;
  bottom: auto !important;
  font-size: 17px !important;
  padding: 15px 24px !important;
  width: 100% !important;
  max-width: 280px !important;
  margin-top: 6px;
}

.pulse-anim {
  animation: pulseBtn 2s infinite ease-in-out;
}

@keyframes pulseBtn {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 18px rgba(126, 226, 41, 0.35);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 6px 26px rgba(126, 226, 41, 0.6);
  }
}

/* --- Оригинальная модалка оплаты --- */
.marathon__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  position: relative;
}

.image {
  width: 100%;
  max-width: 400px;
  height: auto;
  display: block;
  object-fit: contain;
}

.features-pill {
  position: absolute;
  bottom: 68px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 5px 28px;
  background: rgba(14, 28, 54, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  pointer-events: none;
  z-index: 2;
}

.feature-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.lives-icon img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
}

.forbidden-sign {
  position: absolute;
  width: 34px;
  height: 34px;
  border: 3px solid #ff3b3b;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.forbidden-sign::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -2px;
  right: -2px;
  height: 3px;
  background-color: #ff3b3b;
  transform: translateY(-50%) rotate(-45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-button {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 50px;
  cursor: pointer;
  border: 4px solid transparent;
  padding: 12px 10px;
  font-size: 15px;
  min-width: 256px;
  max-width: 270px;
  bottom: 8px;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  background: linear-gradient(180deg, #7fe229 0%, #68c71e 60%, #48a614 100%) padding-box,
  linear-gradient(180deg, #d8ffb6 0%, #7fe229 30%, #36ad11 70%, #035100 100%) border-box;
  z-index: 3;
}

.custom-button::before {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 4px;
  border-radius: 50%;
  background: #ffffff;
  transform: rotate(-29deg);
  pointer-events: none;
}

.custom-button::after {
  content: "";
  position: absolute;
  top: 12px;
  left: 1px;
  width: 3px;
  height: 7px;
  border-radius: 50%;
  background: #ffffff;
  transform: rotate(24deg);
  pointer-events: none;
  box-shadow: calc(100% - 30px) calc(100% - 25px) 0 2px transparent;
}

.custom-button .button-flare {
  position: absolute;
  right: 6px;
  bottom: 4px;
  width: 14px;
  height: 5px;
  border-radius: 50%;
  background: #3FCA1A;
  transform: rotate(-32deg);
  pointer-events: none;
}

.custom-button:active {
  transform: translateY(2px);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.92);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.06);
}
</style>