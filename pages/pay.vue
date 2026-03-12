<template>
  <div class="comic-wrapper">
    <button @click="backToMain" class="back__btn">
      <img class="btn__icon" src="../assets/images/close.svg" alt="">
    </button>
    <div class="comic__wrapper">
      <div class="comic__header">
        <h1 class="comic-description">{{ t('payPage.title') }}</h1>
        <p class="sub__description">{{ t('payPage.description') }}</p>
      </div>
      <div class="subscription-box">
        <div class="compare-header">
          <span class="label">{{ t('payPage.compareLabelOne') }}</span>
          <span class="label">{{ t('payPage.compareLabelTwo') }}</span>
          <span class="label super-label">{{ t('payPage.compareLabelThree') }}</span>
        </div>
        <div class="compare-row" v-for="(feature, index) in features" :key="index">
          <div class="compare__label">
            <img class="compare__icon" :src="feature.icon" alt="">
            <span class="compare__label-text">{{ feature.title }}</span>
          </div>
          <span>{{ feature.free ? '✔️' : '—' }}</span>
          <span>{{ feature.premium ? '✔️' : '—' }}</span>
        </div>
        <div v-if="myAvailableCoupons.length > 0" class="discounts-container">
          <p class="discounts-title">Твои скидочные купоны</p>
          <div class="coupons-list">
            <button
                v-for="coupon in myAvailableCoupons"
                :key="coupon.id"
                class="coupon-selector-btn"
                :class="{ 'is-active': selectedDiscountId === coupon.id }"
                @click="selectDiscount(coupon.id)"
            >
              {{ coupon.label }}
            </button>
          </div>
        </div>
        <button
            v-if="!authStore.isPremium"
            class="pay-btn"
            ref="payButton"
            @click="pay"
        >
          <span class="btn-title">{{ t('payPage.getPremiumBtn') }}</span>
          <span class="btn-price-wrapper">
             <span v-if="selectedDiscountId" class="old-price-inline">{{ BASE_PRICE }} €</span>
             <span class="new-price">{{ finalPrice }} € {{ t('payPage.month') }}</span>
           </span>
        </button>
      </div>
    </div>
    <transition name="slide-up">
      <div v-if="showStickyFooter && !authStore.isPremium" class="sticky-footer">
        <button class="footer-btn" @click="pay">
          <span class="btn-title">{{ t('payPage.getPremiumBtn') }}</span>
          <span class="btn-price-wrapper">
             <span v-if="selectedDiscountId" class="old-price-inline">{{ BASE_PRICE }} €</span>
             <span class="new-price">{{ finalPrice }} € {{ t('payPage.month') }}</span>
           </span>
        </button>
      </div>
    </transition>
  </div>
</template>

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

const authStore = userAuthStore()
const payButton = ref(null)
const showStickyFooter = ref(false)
const router = useRouter()
const {t} = useI18n()
const backToMain = () => {
  router.push('/')
}
const BASE_PRICE = 1

const finalPrice = computed(() => {
  if (!selectedDiscountId.value) return BASE_PRICE.toFixed(2)
  const activeCoupon = myAvailableCoupons.value.find(c => c.id === selectedDiscountId.value)
  const percent = activeCoupon ? activeCoupon.percent : 0
  const discounted = BASE_PRICE - (BASE_PRICE * (percent / 100))
  return discounted.toFixed(2)
})

const selectedDiscountId = ref(null)

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

const selectDiscount = (id) => {
  selectedDiscountId.value = (selectedDiscountId.value === id) ? null : id
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
onMounted(() => {
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
      // Это самый надежный способ. Мы просто идем по ссылке, которую дал сервер.
      window.location.href = response.url
    } else if (response.error) {
      console.error('Ошибка сервера:', response.error)
      alert('Ошибка: ' + response.error)
    }
  } catch (err) {
    console.error('Ошибка сети:', err)
    alert('Произошла ошибка соединения. Проверьте логи сервера.')
  }
}
</script>

<style scoped>
.comic-wrapper {
  background: linear-gradient(to bottom, #261d12, #22193f);
}

.comic__wrapper {
  padding: 14px;
  font-family: 'Nunito', sans-serif;
  text-align: center;
  color: #fff;
  min-height: 100vh;
}

.old-price-inline {
  position: relative;
  display: inline-block;
  opacity: 0.7;
  margin-right: 5px;
  font-size: 1.1rem;
  font-weight: bold;
}

.old-price-inline::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -5%;
  width: 110%;
  height: 3px;
  background-color: #ff3333;
  transform: translateY(-50%) rotate(-15deg);
  border-radius: 2px;
  box-shadow: 0 0 5px rgba(255, 51, 51, 0.5);
  pointer-events: none;
}

.back__btn {
  border: none;
  background: none;
  padding: 20px;
  cursor: pointer;
}

.btn__icon {
  width: 40px;
}

.discounts-container {
  margin: 20px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.coupon-selector-btn {
  background: #333;
  color: #fff;
  border: 2px solid transparent;
  padding: 8px 15px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
}

.coupon-selector-btn.is-active {
  border-color: #00e676;
  background: rgba(0, 230, 118, 0.2);
}

.compare__label {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  gap: 20px;
}

.compare__label-text {
  width: 200px;
  display: flex;
  justify-content: start;
}

.comic-description {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.compare__icon {
  width: 40px;
}

.comic__header {
  margin-bottom: 10px;
}

.subscription-box {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #fff;
  border-radius: 20px;
  padding: 30px 20px;
  max-width: 1000px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.compare-header, .compare-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
}

.compare-header {
  font-weight: bold;
  border-bottom: 2px solid #fff;
}

.sub__description {
  font-size: 0.8rem;
}

.super-label {
  color: #fff;
  background: linear-gradient(to right, #b04727, #ff9900);
  border-radius: 25px;
  font-weight: bold;
}

.label {
  padding: 10px;
}

.pay-btn {
  margin-top: 30px;
  background: #3889a6;
  color: white;
  font-size: 17px;
  font-weight: bold;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  gap: 5px;
}

.btn-price-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pay-btn:hover {
  background: #00c853;
}

.sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(90deg, #222 0%, #3b2f63 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
  border-top: 2px solid #fff2;
}

.footer-btn {
  background: #ffffff;
  color: #111;
  font-size: 17px;
  font-weight: 700;
  padding: 18px 36px;
  border-radius: 14px;
  box-shadow: 0 4px #000;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-btn:hover {
  background: linear-gradient(to right, #b04727, #ff9900);
  transform: translateY(-2px);
  color: white;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 539px) {
  .compare__label-text {
    width: 130px;
    text-align: start;
    font-size: 0.9rem;
  }

  .compare__label {
    margin-left: 1px;
  }

  .subscription-box {
    padding: 15px;
  }

  .compare-header {
    font-size: 0.9rem;
  }
}
</style>
