<template>
  <div class="account-cleanup">
    <div class="account-cleanup__container">
      <header class="account-cleanup__header">
        <div class="account-cleanup__header-content">
          <button @click="router.back()" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 class="account-cleanup__title">Удаление профиля</h1>
        </div>
      </header>
      <div class="account-cleanup__scroll-area">
        <div class="account-cleanup__body">
          <div>
            <img class="cleanup__icon" src="../assets/images/hedgehog-sadly.svg" alt="">
            <p class="account-cleanup__subtitle">
              Нам жаль, что вы решили нас покинуть. Пожалуйста, проверьте важную информацию перед удалением.
            </p>
          </div>
          <section class="account-cleanup__section">
            <div class="account-cleanup__list">
              <div
                  v-for="item in accountChanges"
                  :key="item.id"
                  class="account-cleanup__item"
              >
                <div class="account-cleanup__icon-box">!</div>
                <p class="account-cleanup__text">{{ item.text }}</p>
              </div>
            </div>
          </section>
          <section class="account-cleanup__section">
            <h2 class="account-cleanup__heading">Управление подпиской</h2>
            <p class="account-cleanup__info-text">
              Удаление аккаунта <b>не отменяет</b> подписку автоматически. Проверьте статус платежей.
            </p>
            <div class="account-cleanup__grid">
              <div
                  v-for="platform in platformsInformation"
                  :key="platform.id"
                  class="account-cleanup__card"
              >
                <h3 class="account-cleanup__card-title">{{ platform.name }}</h3>
                <p class="account-cleanup__card-desc">{{ platform.description }}</p>
                <div class="account-cleanup__card-hint">{{ platform.instruction }}</div>
              </div>
            </div>
          </section>
        </div>
        <footer class="account-cleanup__footer">
          <button
              v-for="btn in footerActions"
              :key="btn.type"
              :class="['account-cleanup__btn', `account-cleanup__btn--${btn.type}`]"
              @click="btn.handler"
              type="button"
          >
            {{ btn.label }}
          </button>
        </footer>
        <transition name="slide-up">
          <div
              v-if="isCleanupModalVisible"
              class="account-cleanup__overlay"
              @click.self="hideConfirmation"
          >
            <div class="account-cleanup__modal">
              <h3 class="account-cleanup__modal-title">Вы уверены?</h3>
              <div class="account-cleanup__auth-zone">
                <div v-if="isGoogleUser" class="account-cleanup__google-status">
                  Вход через <strong>Google</strong>. <br>
                  Для подтверждения откроется окно авторизации.
                </div>
                <div v-else class="account-cleanup__password-zone">
                  <label class="account-cleanup__field-label">Введите пароль для подтверждения:</label>
                  <input
                      v-model="passwordField.value"
                      type="password"
                      :class="['account-cleanup__field-input', { 'account-cleanup__field-input--error': passwordField.error }]"
                      placeholder="введите ваш пароль"
                  />
                  <transition name="fade">
                    <p v-if="passwordField.error" class="account-cleanup__field-error">
                      {{ t(passwordField.error) }}
                    </p>
                  </transition>
                </div>
              </div>
              <div class="account-cleanup__modal-actions">
                <button
                    v-for="mBtn in modalActions"
                    :key="mBtn.type"
                    :class="['account-cleanup__modal-btn', `account-cleanup__modal-btn--${mBtn.type}`]"
                    :disabled="mBtn.needsAuth && !isGoogleUser && !passwordField.value"
                    @click="mBtn.handler"
                >
                  {{ mBtn.label }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
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
  {id: 1, text: 'Данные профиля будут удалены навсегда.'},
  {id: 2, text: 'Прогресс обучения и история тестов обнулятся.'},
  {id: 3, text: 'Все награды, звания и достижения исчезнут.'},
  {id: 4, text: 'Валюта, уровень и ваши шляпы будут списаны.'}
]

const platformsInformation = [
  {
    id: 'web',
    name: 'На сайте',
    description: 'Оплата картой на сайте.',
    instruction: 'Отключите автопродление в Личном кабинете.'
  },
  {
    id: 'store',
    name: 'В приложении',
    description: 'Google Play или App Store.',
    instruction: 'Отмените подписку в настройках смартфона.'
  }
]

const footerActions = [
  {label: 'Оставить аккаунт', type: 'back', handler: () => router.back()},
  {
    label: 'Удалить профиль', type: 'cleanup', handler: () => {
      isCleanupModalVisible.value = true
    }
  }
]

const modalActions = computed(() => [
  {label: 'Подтверждаю удаление', type: 'cleanup', needsAuth: true, handler: processAccountCleanup},
  {label: 'Я передумал', type: 'stay', needsAuth: false, handler: hideConfirmation}
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
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
  display: flex;
  justify-content: center;
}

.account-cleanup__container {
  max-width: 800px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.account-cleanup__header-content {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #36ca69;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.account-cleanup__title {
  font-size: 1.5rem;
  font-weight: 900;
  flex: 1;
  text-align: center;
  color: white;
}

.account-cleanup__info-text {
  margin-bottom: 10px;
}

.cleanup__icon {
  width: 160px;
  margin: 0 auto;
}

.account-cleanup__scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 25px;
}

.account-cleanup__subtitle {
  text-align: center;
  margin-bottom: 14px;
  font-weight: 600;
  font-size: 14px;
  color: var(--titleColor);
}

.account-cleanup__section {
  background: #fff;
  border: 2px solid #000;
  border-radius: 15px;
  padding: 17px;
  box-shadow: 3px 3px 0 #000;
  margin-bottom: 15px;
  color: #000;
}

.account-cleanup__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-cleanup__item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.05);
}

.account-cleanup__icon-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #de6b6b;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 900;
  flex-shrink: 0;
}

.account-cleanup__text {
  font-size: 15px;
  font-weight: 700;
}

.account-cleanup__heading {
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: 10px;
  color: #3498db;
}

.account-cleanup__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 15px;
}

.account-cleanup__card {
  padding: 13px;
  border-radius: 18px;
  background: #f9f9f9;
  border: 2px solid #000;
}

.account-cleanup__card-title {
  color: #3498db;
  font-weight: 900;
  margin-bottom: 5px;
}

.account-cleanup__card-desc {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.account-cleanup__card-hint {
  padding: 8px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
}

.account-cleanup__footer {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 0 0 20px 0;
}

.account-cleanup__btn {
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: 0.1s;
}

.account-cleanup__btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #000;
}

.account-cleanup__btn--back {
  background: #ffd54f;
  color: #000;
}

.account-cleanup__btn--cleanup {
  background: #de6b6b;
  color: #fff;
}

.account-cleanup__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
}

.account-cleanup__modal {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border: 4px solid #000;
  border-bottom: none;
  border-radius: 32px 32px 0 0;
  padding: 30px 20px 40px;
  text-align: center;
  color: #000;
}

.account-cleanup__modal-title {
  font-size: 1.7rem;
  font-weight: 900;
}

.account-cleanup__modal-text {
  font-weight: 700;
  opacity: 0.7;
  margin-top: 10px;
}

.account-cleanup__auth-zone {
  padding: 10px 0;
}

.account-cleanup__field-label {
  display: block;
  text-align: left;
  font-weight: 800;
  margin-bottom: 5px;
  font-size: 13px;
}

.account-cleanup__password-zone{
  height: 100px;
}

.account-cleanup__field-input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #000;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
}

.account-cleanup__field-input--error {
  border-color: #de6b6b;
  background: #fff5f5;
}

.account-cleanup__field-error {
  color: #de6b6b;
  font-size: 0.9rem;
  font-weight: 800;
  text-align: left;
}

.account-cleanup__modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-cleanup__modal-btn {
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: 0.1s;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

.account-cleanup__scroll-area::-webkit-scrollbar {
  width: 5px;
}

.account-cleanup__scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.account-cleanup__scroll-area::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 20px;
  transition: background 0.3s ease;
}

.account-cleanup__scroll-area:hover::-webkit-scrollbar-thumb {
  background: #36ca69;
}

.account-cleanup__scroll-area {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.account-cleanup__scroll-area:hover {
  scrollbar-color: #36ca69 transparent;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.account-cleanup__modal-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #000;
}

.account-cleanup__modal-btn--cleanup {
  background: #de6b6b;
  color: #fff;
}

.account-cleanup__modal-btn--stay {
  background: #f0f0f0;
  color: #000;
}

.account-cleanup__modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: 0.3s ease-out;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: 0.2s opacity;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .account-cleanup__footer {
    flex-direction: column-reverse;
  }

  .account-cleanup__btn {
    width: 100%;
  }
}
</style>