<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {userAuthStore} from '../store/authStore'
import {useBillingStore} from '../store/billingStore'
import {useI18n} from 'vue-i18n'
import {useSeoMeta} from "#imports"

import Books from '../assets/images/pay-images/books.svg'
import Ach from '../assets/images/pay-images/ach.svg'
import Translate from '../assets/images/pay-images/translate.svg'
import Quests from '../assets/images/pay-images/Quests.svg'
import Speaker from '../assets/images/pay-images/speaker.svg'
import Exams from '../assets/images/pay-images/test.svg'
import Galaxy from '../assets/images/Galaxy.svg'
import AudioTasks from '../assets/images/headphones.svg'
import SupportCup from '../assets/images/cupheart.svg'
import Ads from '../assets/images/ADS.svg'
import Future from '../assets/images/FutureFunctions.svg'
import StatsPlus from '../assets/images/StatsPlus.svg'
import Forever from '../assets/images/forever.svg'
import Description from '../assets/images/photo-frame.svg'
import PremiumIcon from '../assets/images/premium.svg'
import VBanner from "~/src/components/V-banner.vue"

const authStore = userAuthStore()
const billingStore = useBillingStore()
const router = useRouter()
const {t} = useI18n()
const BASE_PRICE = 1

const selectedDiscountId = ref(null)
const submitLoading = ref(false)
const restoreLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const payButton = ref(null)
const showStickyFooter = ref(false)
const justBought = ref(false)
const handleBack = () => {
  router.back()
}

const restoreComputed = computed(() => {
  return restoreLoading.value ? t('restoreComputed.restoring') : t('restoreComputed.restore')
})

const submitComputed = computed(() => {
  return submitLoading.value ? t('submitComputed.sync') : t('submitComputed.getPlus')
})


const finalPrice = computed(() => {
  if (billingStore.isMobile && billingStore.offerings.length > 0) {
    return billingStore.offerings[0].product.priceString
  }
  if (!selectedDiscountId.value) return BASE_PRICE.toFixed(2)
  const activeCoupon = myAvailableCoupons.value.find(c => c.id === selectedDiscountId.value)
  const percent = activeCoupon ? activeCoupon.percent : 0
  const discounted = BASE_PRICE - (BASE_PRICE * (percent / 100))
  return discounted.toFixed(2)
})

const myAvailableCoupons = computed(() => {
  const list = []
  const hasAnyDiscount = authStore.premiumDiscount.sale_5 ||
      authStore.premiumDiscount.sale_10 ||
      authStore.premiumDiscount.sale_15
  if (hasAnyDiscount) {
    list.push({id: null, percent: 0, label: 'Без скидки'})
  }
  if (authStore.premiumDiscount.sale_5) list.push({id: 'sale_5', percent: 5, label: 'Скидка 5%'})
  if (authStore.premiumDiscount.sale_10) list.push({id: 'sale_10', percent: 10, label: 'Скидка 10%'})
  if (authStore.premiumDiscount.sale_15) list.push({id: 'sale_15', percent: 15, label: 'Скидка 15%'})
  return list
})

const selectDiscount = async (id) => {
  selectedDiscountId.value = (selectedDiscountId.value === id) ? null : id
  if (billingStore.isMobile) {
    await billingStore.loadOfferings(selectedDiscountId.value)
  }
}

useSeoMeta({
  robots: 'noindex, nofollow'
})

let observer
const features = [
  {title: t('Обучение без границ'), icon: Forever},
  {title: t('Будущие функции'), icon: Future},
  {title: t('Поддержка разработчиков'), icon: SupportCup},
  {title: t('Отсутствие рекламы'), icon: Ads},
]

onMounted(async () => {
  if (billingStore.isMobile) {
    await billingStore.initialize()
  }
  observer = new IntersectionObserver(
      ([entry]) => {
        showStickyFooter.value = !entry.isIntersecting
      },
      {threshold: 1.0}
  )
  if (payButton.value) {
    observer.observe(payButton.value)
  }
})

onUnmounted(() => {
  if (observer && payButton.value) {
    observer.unobserve(payButton.value)
  }
})

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

async function handleRestore() {
  if (!billingStore.isMobile) return
  if (justBought.value) {
    triggerToast('pay.triggerToastIsPlus')
    return
  }
  restoreLoading.value = true
  try {
    const success = await billingStore.restore()
    if (success) {
      triggerToast('pay.triggerToastSuccess')
    } else {
      triggerToast('pay.triggerToastNotFound')
    }
  } catch (err) {
    triggerToast('pay.triggerToastError')
  } finally {
    restoreLoading.value = false
  }
}

async function pay() {
  if (!authStore.uid || !authStore.email) return
  if (billingStore.isMobile) {
    if (billingStore.offerings.length > 0) {
      const pkg = billingStore.offerings[0]
      const success = await billingStore.buy(pkg)
      if (success) {
        justBought.value = true
      }
    }
    return
  }
  const priceId = 'price_1SvdnE24sKuPwF6cZoD2ZJn3'
  submitLoading.value = true
  try {
    const response = await $fetch('/api/stripe/checkout', {
      method: 'POST',
      body: {
        userId: authStore.uid,
        email: authStore.email,
        priceId,
        couponId: selectedDiscountId.value
      },
    })
    if (response.url) {
      window.location.href = response.url
    } else if (response.error) {
      console.log(response.error)
    }
  } catch (err) {
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <div class="pro-vault">
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        {{ t(toastMessage) }}
      </div>
    </transition>
    <div class="vault-nav">
      <button @click="handleBack" class="btn-icon-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
    </div>
    <div class="main-flow">
      <div class="flow-step">
        <VBanner
            :text="t('pay.banner')"
            :icon="PremiumIcon"
        />
        <div class="hero-zone">
          <h1 class="hero-title">SKILLUP <span class="neon-text">PLUS</span></h1>
        </div>
        <div class="perks-grid">
          <div v-for="(feat, i) in features" :key="i" class="perk-card">
            <div class="perk-icon">
              <img :src="feat.icon" alt="" class="icon-svg">
            </div>
            <div class="perk-meta">
              <span class="perk-name">{{ feat.title }}</span>
            </div>
          </div>
        </div>
        <div class="bonus-section" v-if="myAvailableCoupons.length > 1">
          <div class="hero-zone bonus-hero">
<!--            <h2 class="hero-title">ТВОИ <span class="neon-text">БОНУСЫ</span></h2>-->
            <p class="hero-desc">{{ t('pay.sales')}}</p>
          </div>
          <div class="inventory-section">
            <div class="inventory-list">
              <div
                  v-for="coupon in myAvailableCoupons"
                  :key="coupon.id"
                  class="loot-card"
                  :class="{ 'loot-card--active': selectedDiscountId === coupon.id }"
                  @click="selectDiscount(coupon.id)"
              >
                <div class="loot-glow"></div>
                <div class="loot-content">
                  <div class="loot-info">
                    <span class="loot-title">{{ coupon.label }}</span>
                    <span class="loot-sub">За твою активность</span>
                  </div>
                  <div class="loot-val" v-if="coupon.percent > 0">
                    {{ coupon.percent }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="billing-summary">
          <div class="bill-line">
            <span class="bill-text">Месяц обучения</span>
            <span class="bill-price">{{ BASE_PRICE }}€</span>
          </div>
          <div class="bill-line discount" v-if="selectedDiscountId">
            <span class="bill-text">Твоя скидка</span>
            <span class="bill-price-neg">-{{myAvailableCoupons.find(c => c.id === selectedDiscountId).percent}}%</span>
          </div>
          <div class="bill-total">
            <span class="total-text">ИТОГО:</span>
            <span class="total-price">{{ finalPrice }}€</span>
          </div>
        </div>
        <div class="footer-action" ref="payButton">
          <button @click="pay" class="btn-buy-neon" :disabled="submitLoading || restoreLoading">{{ submitComputed }}</button>
          <button
              v-if="billingStore.isMobile"
              @click="handleRestore"
              class="btn-restore"
              :disabled="restoreLoading || submitLoading"
          >
            {{ restoreComputed }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-notification {
  position: absolute;
  width: 100%;
  top: calc(env(safe-area-inset-top));
  left: 0;
  background: #10b981;
  color: #fff;
  padding: 14px 24px;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  z-index: 1000;
  text-align: center;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.toast-notification:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 60px;
  left: 0;
  bottom: 100%;
  background: #10b981;
  z-index: 1;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%)
}

.btn-restore {
  display: block;
  width: 100%;
  margin-top: 16px;
  background: transparent;
  border: none;
  color: #8e8e93;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: underline;
  text-decoration-color: transparent;
}

.btn-restore:active {
  color: #d1d1d6;
  text-decoration-color: #d1d1d6;
}

.btn-restore:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.pro-vault {
  height: 100%;
  background: var(--bg);
  color: var(--title);
  font-family: 'Nunito', sans-serif;
  display: flex;
  overflow: hidden;
  padding: 0 10px;
  flex-direction: column;
}

.vault-nav {
  padding: 5px 0 15px 0;
  display: flex;
  align-items: center;
}

.main-flow {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
}

.hero-zone {
  margin-bottom: 15px;
  text-align: center;
}

.bonus-hero {
  margin-top: 30px;
}

.hero-title {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--title);
  text-shadow: 2px 2px var(--title);
}

.hero-title h2 {
  font-size: 26px;
}

.neon-text {
  font-size: 34px;
  color: #6366f1;
  text-shadow: 2px 2px #6366f1;
}

.bonus-hero .neon-text {
  font-size: 28px;
}

.hero-desc {
  color: var(--title);
  font-size: 15px;
  margin-top: 6px;
  font-weight: 600;
  padding: 10px;
}

.perks-grid {
  display: grid;
  gap: 12px;
}

.perk-card {
  border-bottom: 1px solid rgba(103, 101, 101, 0.24);
  border-radius: 5px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.perk-icon {
  width: 46px;
  height: 46px;
}

.perk-meta {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.perk-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--title);
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loot-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
  cursor: pointer;
}

.loot-card--active {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

.loot-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.loot-info {
  text-align: left;
}

.loot-title {
  font-size: 17px;
  font-weight: 900;
  display: block;
}

.loot-sub {
  font-size: 12px;
  color: #8e8e93;
  font-weight: 700;
}

.loot-val {
  font-size: 22px;
  font-weight: 900;
  color: #10b981;
}

.flow-step {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
}

.loot-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #6366f1;
  filter: blur(50px);
  top: -50px;
  right: -50px;
  opacity: 0;
  transition: 0.3s;
}

.loot-card--active .loot-glow {
  opacity: 0.2;
}

.billing-summary {
  margin-top: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
}

.bill-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 15px;
  color: #8e8e93;
}

.bill-price-neg {
  color: #facc15;
}

.bill-total {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.total-text {
  font-weight: 900;
  font-size: 18px;
}

.total-price {
  font-weight: 900;
  font-size: 24px;
  color: #10b981;
}

.footer-action {
  margin-top: 20px;
  padding: 20px 0;
  position: relative;
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

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.btn-buy-neon {
  width: 100%;
  padding: 16px 20px;
  border-radius: 22px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 6px 0 #228b5f;
  cursor: pointer;
  transition: transform 0.1s;
}

.btn-buy-neon:active {
  transform: scale(0.98);
}

.btn-buy-neon:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>