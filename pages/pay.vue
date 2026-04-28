<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {userAuthStore} from '../store/authStore'
import {getStripe} from '@/utils/stripe'
import Books from '../assets/images/pay-images/books.svg'
import Save from '../assets/images/pay-images/save.svg'
import Ach from '../assets/images/pay-images/ach.svg'
import Translate from '../assets/images/pay-images/translate.svg'
import Award from '../assets/images/pay-images/award.svg'
import Quests from '../assets/images/pay-images/Quests.svg'
import Speaker from '../assets/images/pay-images/speaker.svg'
import Exams from '../assets/images/pay-images/test.svg'
import Competitions from '../assets/images/pay-images/competition.svg'
import Future from '../assets/images/pay-images/future.svg'
import {useSeoMeta} from "#imports";
import {useBillingStore} from '../store/billingStore'

const authStore = userAuthStore()
const billingStore = useBillingStore()
const payButton = ref(null)
const showStickyFooter = ref(false)
const router = useRouter()
const {t} = useI18n()
const BASE_PRICE = 1
const backToMain = () => {
  router.push('/')
}

const adsUsual = [
  'Артикли', 'Угадай слово', 'Игра косм.', 'Аудио задания', 'Описание картинок'
]

const step = ref(1)
const selectedDiscountId = ref(null)
const submitLoading = ref(false)

const handleBack = () => {
  if (step.value === 2) step.value = 1
  else router.push('/')
}

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
  {title: t('payPage.featureOne'), free: true, premium: true, icon: Books},
  {title: t('payPage.featureTwo'), free: true, premium: true, icon: Save},
  {title: t('payPage.featureThree'), free: true, premium: true, icon: Ach},
  {title: t('payPage.featureFour'), free: true, premium: true, icon: Quests},
  {title: t('payPage.featureFive'), free: false, premium: true, icon: Translate},
  {title: t('payPage.featureSix'), free: false, premium: true, icon: Award},
  {title: t('payPage.featureSeven'), free: false, premium: true, icon: Exams},
  {title: t('payPage.featureEight'), free: false, premium: true, icon: Speaker},
  {title: t('payPage.featureNine'), free: false, premium: true, icon: Competitions},
  {title: t('payPage.featureTen'), free: false, premium: true, icon: Future},
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

async function pay() {
  if (!authStore.uid || !authStore.email) {
    alert('Пожалуйста, войдите в аккаунт')
    return
  }
  if (billingStore.isMobile) {
    if (billingStore.offerings.length > 0) {
      const pkg = billingStore.offerings[0]
      await billingStore.buy(pkg)
    } else {
      alert('Ошибка: Товары для приложения не загружены')
    }
    return
  }
  const priceId = 'price_1SvdnE24sKuPwF6cZoD2ZJn3'
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
      alert('Ошибка: ' + response.error)
    }
  } catch (err) {
    alert('Произошла ошибка соединения.')
  }
}
</script>

<template>
  <div class="pro-vault">
    <div class="vault-nav">
      <button @click="handleBack" class="circle-btn">
        <span v-if="step === 1">✕</span>
        <span v-else>←</span>
      </button>
      <div class="step-dots">
        <div class="dot" :class="{ active: step === 1 }"></div>
        <div class="dot" :class="{ active: step === 2 }"></div>
      </div>
    </div>
    <div class="main-flow">
      <transition name="view-slide" mode="out-in">
        <div v-if="step === 1" key="promo" class="flow-step">
          <div class="hero-zone">
            <h1 class="hero-title">SKILLUP <span class="neon-text">PLUS</span></h1>
            <p class="hero-desc">Разблокируй максимум своего обучения</p>
          </div>
          <div class="perks-grid">
            <div v-for="(feat, i) in features.filter(f => !f.free)" :key="i" class="perk-card">
              <div class="perk-icon">
                <img :src="feat.icon" class="icon-svg">
              </div>
              <div class="perk-meta">
                <span class="perk-name">{{ feat.title }}</span>
                <span class="perk-label">Premium Only</span>
              </div>
            </div>
          </div>
          <div class="footer-action">
            <button @click="step = 2" class="btn-main-action">
              ПЕРЕЙТИ К ОПЛАТЕ
            </button>
          </div>
        </div>
        <div v-else key="checkout" class="flow-step">
          <div class="hero-zone">
            <h1 class="hero-title">ТВОИ <span class="neon-text">БОНУСЫ</span></h1>
            <p class="hero-desc">Примени заработанные за активность скидки</p>
          </div>
          <div class="inventory-section">
            <div class="inventory-header">Доступно в твоем хранилище:</div>
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
          <div class="billing-summary">
            <div class="bill-line">
              <span class="bill-text">Месяц обучения</span>
              <span class="bill-price">{{ BASE_PRICE }}€</span>
            </div>
            <div class="bill-line discount" v-if="selectedDiscountId">
              <span class="bill-text">Твоя скидка</span>
              <span class="bill-price-neg">-{{
                  myAvailableCoupons.find(c => c.id === selectedDiscountId).percent
                }}%</span>
            </div>
            <div class="bill-total">
              <span class="total-text">ИТОГО:</span>
              <span class="total-price">{{ finalPrice }}€</span>
            </div>
          </div>
          <div class="footer-action">
            <button @click="pay" class="btn-buy-neon" :disabled="submitLoading">
              {{ submitLoading ? 'СИНХРОНИЗАЦИЯ...' : 'АКТИВИРОВАТЬ PRO' }}
            </button>
            <p class="secure-tag">Secure Payment via Stripe</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.pro-vault {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  display: flex;
  padding: 0 10px;
  flex-direction: column;
}

.vault-nav {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.circle-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 18px;
  font-weight: 800;
}

.step-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: 0.3s;
}

.dot.active {
  background: #6366f1;
  width: 24px;
  border-radius: 10px;
}

.hero-zone {
  margin: 25px 0;
  text-align: center;
}

.hero-title {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -1px;
}

.neon-text {
  color: #6366f1;
  text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
}

.hero-desc {
  color: #8e8e93;
  font-size: 15px;
  margin-top: 6px;
  font-weight: 600;
}


.perks-grid {
  display: grid;
  gap: 12px;
}

.perk-card {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.perk-icon {
  width: 46px;
  height: 46px;
  background: #2a2a3d;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.icon-svg {
  width: 24px;
}

.perk-meta {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.perk-name {
  font-size: 16px;
  font-weight: 800;
}

.perk-label {
  font-size: 11px;
  color: #6366f1;
  font-weight: 900;
  text-transform: uppercase;
  margin-top: 2px;
}

.inventory-header {
  text-align: left;
  font-size: 14px;
  font-weight: 800;
  color: #6366f1;
  margin: 10px 0 15px 4px;
  text-transform: uppercase;
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
  margin-top: 25px;
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
  margin-top: auto;
  padding: 20px 0;
}

.btn-main-action {
  width: 100%;
  padding: 20px;
  border-radius: 22px;
  border: none;
  background: #6366f1;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-buy-neon {
  width: 100%;
  padding: 20px;
  border-radius: 22px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.btn-buy-neon:active {
  transform: scale(0.98);
}

.secure-tag {
  margin-top: 14px;
  font-size: 12px;
  color: #444;
  font-weight: 800;
  text-align: center;
}

.view-slide-enter-active, .view-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.view-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
