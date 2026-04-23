<template>
  <div class="account-cleanup">
    <div class="account-cleanup__container">
      <header class="account-cleanup__header">
        <button @click="router.push('/cabinet')" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="account-cleanup__title">Удаление профиля</h1>
        <div class="header-spacer"></div>
      </header>
      <div class="account-cleanup__scroll-area">
        <div class="account-cleanup__body">
          <div class="account-cleanup__mascot">
            <div class="mascot-bubble">
              <p>Нам жаль, что ты уходишь! Пожалуйста, проверь важную информацию перед удалением.</p>
            </div>
          </div>
          <section class="account-cleanup__section account-cleanup__section--danger">
            <div class="account-cleanup__list">
              <div v-for="item in accountChanges" :key="item.id" class="account-cleanup__item">
                <div class="account-cleanup__icon-box">!</div>
                <p class="account-cleanup__text">{{ item.text }}</p>
              </div>
            </div>
          </section>
          <section class="account-cleanup__section">
            <h2 class="account-cleanup__heading">Управление подпиской</h2>
            <p class="account-cleanup__info-text">
              Удаление аккаунта <b>не отменяет</b> подписку! Проверь статус платежей.
            </p>
            <div class="account-cleanup__grid">
              <div v-for="platform in platformsInformation" :key="platform.id" class="account-cleanup__card">
                <div class="account-cleanup__card-header">
                  <div class="account-cleanup__icon-box">{{ platform.icon }}</div>
                  <h3 class="account-cleanup__card-title">{{ platform.name }}</h3>
                </div>
                <div class="account-cleanup__card-content">
                  <p class="account-cleanup__card-desc">{{ platform.description }}</p>
                  <div class="account-cleanup__card-hint">{{ platform.instruction }}</div>
                </div>
              </div>
            </div>
            <div class="account-cleanup__footer-scroll">
              <button class="account-cleanup__btn-main" @click="isCleanupModalVisible = true" type="button">Удалить аккаунт</button>
            </div>
          </section>
        </div>
      </div>
      <transition name="fade">
        <div v-if="isCleanupModalVisible" class="account-cleanup__overlay" @click.self="hideConfirmation">
          <transition name="slide-up" appear>
            <div class="account-cleanup__modal">
              <div class="modal-drag-pill"></div>
              <h3 class="account-cleanup__modal-title">Точно удаляем?</h3>
              <img class="cleanup__icon-modal" src="../assets/images/hedgehog-sadly.svg" alt="Грустный ежик">
              <div class="account-cleanup__auth-zone">
                <div v-if="isGoogleUser" class="account-cleanup__google-status">
                  Вход через <strong>Google</strong>. <br>
                  Для подтверждения откроется окно авторизации.
                </div>
                <div v-else class="account-cleanup__password-zone">
                  <label class="account-cleanup__field-label">Введи пароль для подтверждения:</label>
                  <input
                      v-model="passwordField.value"
                      type="password"
                      :class="['account-cleanup__field-input', { 'account-cleanup__field-input--error': passwordField.error }]"
                      placeholder="Твой пароль..."
                  />
                  <transition name="fade">
                    <p v-if="passwordField.error" class="account-cleanup__field-error">{{ t(passwordField.error) }}</p>
                  </transition>
                </div>
              </div>
              <div class="account-cleanup__modal-actions">
                <button
                    v-for="mBtn in modalActions"
                    :key="mBtn.type"
                    :class="['modal-btn', `modal-btn--${mBtn.type}`]"
                    :disabled="mBtn.needsAuth && !isGoogleUser && !passwordField.value"
                    @click="mBtn.handler"
                >
                  {{ mBtn.label }}
                </button>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {userAuthStore} from '../store/authStore.js'
import {mapErrors} from '../utils/errorsHandler.js'

const {t} = useI18n()
const router = useRouter()
const authStore = userAuthStore()

const isCleanupModalVisible = ref(false)
const passwordField = ref({name: 'password', value: '', error: ''})
const isGoogleUser = computed(() => authStore.isGoogleUser)

const accountChanges = [
  {id: 1, text: 'Данные профиля исчезнут навсегда.'},
  {id: 2, text: 'Прогресс и история тестов обнулятся.'},
  {id: 3, text: 'Все награды, звания и достижения пропадут.'},
  {id: 4, text: 'Валюта, уровень и шляпы будут списаны.'}
]

const platformsInformation = [
  {
    id: 'web',
    name: 'На сайте',
    icon: '🌐',
    description: 'Оплата картой на сайте.',
    instruction: 'Отключи автопродление в Личном кабинете.'
  },
  {
    id: 'store',
    name: 'В приложении',
    icon: '📱',
    description: 'Google Play или App Store.',
    instruction: 'Отмени подписку в настройках телефона.'
  }
]


const modalActions = computed(() => [
  {label: 'Я передумал', type: 'stay', needsAuth: false, handler: hideConfirmation},
  {label: 'Подтверждаю удаление', type: 'danger', needsAuth: true, handler: processAccountCleanup}
])

function hideConfirmation() {
  isCleanupModalVisible.value = false
  passwordField.value.value = ''
  passwordField.value.error = ''
}


async function processAccountCleanup() {
  passwordField.value.error = ''
  try {
    await authStore.deleteAccount(passwordField.value.value)
    isCleanupModalVisible.value = false
    router.push('/')
  } catch (error) {
    mapErrors([passwordField.value], error?.code || 'default')
  }
}
</script>

<style scoped>

.account-cleanup {
  height: 100%;
  width: 100%;
  background: var(--bg);
  display: flex;
  justify-content: center;
  font-family: "Nunito", sans-serif;
}

.account-cleanup__container {
  max-width: 600px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.account-cleanup__google-status {
  text-align: center;
}

.account-cleanup__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
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

.account-cleanup__title {
  font-size: 24px;
  font-weight: 900;
  margin-left: 15px;
  color: var(--titleColor);
}

.header-spacer {
  width: 48px;
}

.account-cleanup__scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}

.mascot-bubble {
  background: #FFF;
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 15px;
  font-weight: 800;
  text-align: center;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.account-cleanup__section {
  background: #FFFFFF;
  border-radius: 28px;
  padding: 24px;
  margin-bottom: 10px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.account-cleanup__section--danger {
  background: #ffffff;
}

.account-cleanup__icon-box {
  width: 40px;
  height: 40px;
  background: #FF4B4B;
  border-radius: 12px;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 18px;
  flex-shrink: 0;
}

.account-cleanup__item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.account-cleanup__text {
  font-weight: 800;
  margin: 0;
  font-size: 15px;
  line-height: 1.4;
}

.account-cleanup__heading {
  font-size: 1.4rem;
  font-weight: 900;
  margin-bottom: 12px;
  color: #000;
}

.account-cleanup__info-text {
  font-weight: 700;
  color: #666;
  margin-bottom: 24px;
}

.account-cleanup__grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.account-cleanup__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #F9FBFF;
  border: 2px solid #EEE;
  border-radius: 20px;
}

.account-cleanup__card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-cleanup__card-title {
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0;
}

.account-cleanup__card-desc {
  font-weight: 700;
  font-size: 14px;
  color: #444;
  margin: 0 0 8px 0;
}

.account-cleanup__card-hint {
  background: #FFF;
  border: 2px solid #e1dfdf;
  border-radius: 12px;
  padding: 12px;
  font-size: 13px;
  font-weight: 800;
}

.account-cleanup__footer-scroll {
  margin-top: 15px;
}

.account-cleanup__btn-main {
  width: 100%;
  background: #FFF;
  color: #9f9696;
  border-radius: 24px;
  padding: 10px;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.1s;
  border: none;
}
.account-cleanup__btn-main:active {
  transform: translateY(4px);
}

.account-cleanup__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.account-cleanup__modal {
  width: 100%;
  max-width: 600px;
  background: #FFF;
  border-top: 3px solid #000;
  border-bottom: none;
  border-radius: 32px 32px 0 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.modal-drag-pill {
  width: 40px;
  height: 5px;
  background: #DDD;
  border-radius: 10px;
  margin-bottom: 20px;
}

.cleanup__icon-modal {
  width: 180px;
  height: 180px;
}

.account-cleanup__modal-title {
  font-size: 24px;
  font-weight: 900;
}

.account-cleanup__auth-zone {
  width: 100%;
  margin-bottom: 24px;
}

.account-cleanup__field-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #000;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  box-sizing: border-box;
}

.modal-btn {
  width: 100%;
  padding: 15px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 10px;
}

.modal-btn:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #000;
}

.modal-btn--danger {
  background: none;
  border: none;
  color: #818181;
}

.modal-btn--stay {
  background: #3b82f6;
  color: white;
  border: #2964c4;
  border-bottom: 5px solid #2964c4;
}

.account-cleanup__field-error {
  color: #FF4B4B;
  font-weight: 800;
  font-size: 14px;
  margin-top: 5px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>