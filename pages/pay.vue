<template>
  <div class="comic-wrapper">
    <button @click="backToMain" class="back__btn">
      <img class="btn__icon" src="../assets/images/close.svg" alt="">
    </button>
    <div class="comic__wrapper">
      <div class="comic__header">
        <h2 class="comic-description">Получи максимум от платформы</h2>
        <p class="sub__description">Обучение, награды, задания, прогресс и многое другое!</p>
      </div>
      <div class="subscription-box">
        <div class="compare-header">
          <span class="label">Функции</span>
          <span class="label">Бесплатно</span>
          <span class="label super-label">Подписка</span>
        </div>

        <div class="compare-row" v-for="(feature, index) in features" :key="index">
          <div class="compare__label">
            <img class="compare__icon" :src="feature.icon" alt="">
            <span class="compare__label-text">{{ feature.title }}</span>
          </div>
          <span>{{ feature.free ? '✔️' : '—' }}</span>
          <span>{{ feature.premium ? '✔️' : '—' }}</span>
        </div>

        <button
            v-if="!authStore.isPremium"
            class="pay-btn"
            ref="payButton"
            @click="pay"
        >
          Приобрести подписку  5.99$
        </button>
      </div>
    </div>
    <transition name="slide-up">
      <div v-if="showStickyFooter && !authStore.isPremium" class="sticky-footer">
        <button class="footer-btn" @click="pay">Приобрести подписку 5.99$</button>
      </div>
    </transition>
  </div>
</template>



<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthStore } from '../store/authStore'
import { getStripe } from '@/utils/stripe'
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
const audioRef = ref(null)
const authStore = userAuthStore()
const payButton = ref(null)
const showStickyFooter = ref(false)
const router = useRouter()

const backToMain = () => {
  router.push('/')
}

let observer
const features = [
  { title: 'Учебный материал', free: true, premium: true , icon: Books},
  { title: 'Сохранение прогресса', free: true, premium: true, icon: Save },
  { title: 'Достижения', free: true, premium: true, icon: Ach },
  { title: 'Переводчик', free: true, premium: true, icon: Translate },
  { title: 'Получение наград', free: false, premium: true, icon: Award },
  { title: 'Тесты с проверкой ИИ', free: false, premium: true, icon: Exams },
  { title: 'Ежедневные задания', free: false, premium: true, icon: Quests },
  { title: 'Озвучка', free: false, premium: true, icon: Speaker },
  { title: 'Дуэли и рейтинг', free: false, premium: true, icon: Competitions },
  { title: 'Будущие функции', free: false, premium: true, icon: Future },
]
onMounted(() => {
  observer = new IntersectionObserver(
      ([entry]) => {
        showStickyFooter.value = !entry.isIntersecting
      },
      { threshold: 1.0 }
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
    alert('Сначала войди в аккаунт')
    return
  }

  const priceId = 'price_1RqDZU0mqXJB1TZDSVvs8yyQ'
  const response = await $fetch('/api/stripe/checkout', {
    method: 'POST',
    body: {
      userId: authStore.uid,
      email: authStore.email,
      priceId,
    },
  })

  const stripe = await getStripe()
  await stripe.redirectToCheckout({ sessionId: response.sessionId })
}
</script>



<style scoped>
.comic-wrapper {
  background: linear-gradient(to bottom, #261d12, #22193f);
}

.comic__wrapper {
  padding: 25px;
  font-family: 'Nunito', sans-serif;
  text-align: center;
  color: #fff;
  min-height: 100vh;
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
  max-width:1000px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.compare-header, .compare-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
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
  background: #00e676;
  color: #000;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: background 0.2s ease;
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
  font-size: 1.2rem;
  font-weight: 700;
  padding: 18px 36px;
  border-radius: 14px;
  box-shadow: 0 4px #000;
  border: none;
  transition: all 0.2s ease;
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
    gap: 5px;
    font-size: 0.9rem;
  }
}
</style>
