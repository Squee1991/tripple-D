<template>
  <div class="auth" :class="{ 'auth--rtl': locale === 'ar' }">
    <VLoginPreloader v-if="submitLoading"/>
    <div class="auth__inner">
      <div class="auth__form">
        <div v-if="submitLoading" class="loading-overlay">
          <div class="loader-box"></div>
        </div>
        <div class="auth__title" :class="{ 'left': mode === 'reset' }">
          <img
              @click="mode = 'login'"
              v-if="mode === 'reset'" class="auth__arrow" src="../assets/images/arrowNav.svg"
              alt="arrow_nav">
          <h1 class="login__title">{{mode === 'login' ? t('auth.auths') : mode === 'register' ? t('auth.regs') : t('auth.resetTitle')}}</h1>
        </div>
        <div v-if="mode === 'login' || mode === 'register'" class="auth__tabs">
          <div
              v-for="tab in tabs"
              :key="tab.value"
              class="auth__tab"
              :class="{ 'auth__tab--active': mode === tab.value }"
              @click="mode = tab.value"
          >
            {{ t(tab.label) }}
          </div>
          <div class="auth__toggle" :style="{ transform: toggleTransform }"></div>
        </div>
        <form class="auth-form">
          <div class="auth__fields">
            <div v-for="field in visibleFields" :key="field.id" class="auth__field">
              <label class="auth__label">
                <div class="auth__label-text">{{ t(field.label) }}</div>
                <div class="auth__input-container">
                  <input
                      :class="{ 'auth__input--password': field.name === 'password' || field.name === 'confirm' }"
                      class="auth__input"
                      :type="field.type"
                      :placeholder="t(field.placeholder)"
                      v-model="field.value"
                      :required="field.required"
                      :autocomplete="field.autocomplete"
                      :maxlength="field.maxlength || null"
                  />
                  <div
                      v-if="field.name === 'password' || field.name === 'confirm'"
                      class="auth__eye"
                      @click="toggleVisibility(field)"
                  >
                    <img v-if="field.type === 'password'" :src="View" alt="View">
                    <img  v-else :src="Hide" alt="Hide">
                  </div>
                </div>
              </label>
              <div v-if="field.error" class="auth__error">{{ t(field.error) }}</div>
              <div v-if="resetSent" class="auth__success">{{ t('errors.resetSent') }}</div>
            </div>
            <div class="auth__actions">
              <button @click.prevent="handleSubmit" class="auth__submit" :disabled="submitLoading">
                {{
                  mode === 'login' ? t('auth.logIn') : mode === 'register' ? t('auth.regs') :
                      t('auth.resetBtn')
                }}
              </button>
            </div>
            <div v-if="mode === 'login'" class="auth__forgot" @click="mode = 'reset'">{{
                t('auth.forgot')
              }}
            </div>
          </div>
        </form>
        <div v-if="mode === 'login'" class="social-auth-container">
          <button class="google__auth-wrapper" @click="handleSocialLogin('google')" :disabled="submitLoading">
            <img class="google__icon" src="../assets/images/google.svg" alt="google_icon">
            <span class="auth__text-method">GOOGLE</span>
          </button>
          <button v-if="Capacitor.isNativePlatform() === 'ios'" class="apple__auth-wrapper" @click="handleSocialLogin('apple')" :disabled="submitLoading">
            <img class="apple__icon" src="../assets/images/apple.svg" alt="apple_icon">
            <span class="auth__text-method">APPLE</span>
          </button>
<!--          <button class="facebook__auth-wrapper" @click="handleSocialLogin('facebook')" :disabled="submitLoading">-->
<!--            <img class="facebook__icon" src="../assets/images/facebook.svg" alt="facebook_icon">-->
<!--          </button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import {userAuthStore} from '../store/authStore.js'
import {useRouter} from 'vue-router'
import {mapErrors} from '../utils/errorsHandler.js'
import View from '../../assets/images/loginEyes/view.svg'
import Hide from '../../assets/images/loginEyes/hide.svg'
import VLoginPreloader from "~/src/components/V-loginPreloader.vue";
import { Capacitor } from '@capacitor/core'
const forgot = ref(false);
const {t, locale} = useI18n()
const router = useRouter()
const emits = defineEmits(['close-auth-form'])
const authStore = userAuthStore()
const mode = ref('login')
const resetSent = ref(false)
const submitLoading = ref(false)
const isAuthed = computed(() => !!authStore.uid)

const toggleTransform = computed(() => {
  if (locale.value === 'ar') {
    return mode.value === 'login' ? 'translateX(100%)' : 'translateX(0%)'
  } else {
    return mode.value === 'login' ? 'translateX(0%)' : 'translateX(100%)'
  }
})

const forgotTitleComputed = computed(() => {
  return forgot.value ? t('auth.resetTitle') : t('auth.loginTitle')
})

const fields = ref([
  { id: 1, name: "name", type: "text", placeholder: "placeholder.name", label: "formLabel.name", error: false, value: '', required: true, maxlength: 18, autocomplete: "username" },
  { id: 2, name: "email", type: "email", placeholder: "placeholder.email", label: "formLabel.email", error: false, value: '', required: true, autocomplete: "email" },
  { id: 3, name: "password", type: "password", placeholder: "placeholder.password", label: "formLabel.password", error: false, value: '', required: true, autocomplete: "current-password" },
  { id: 4, name: "confirm", type: "password", placeholder: "placeholder.confirm", label: "formLabel.confirm", error: false, value: '', required: true, autocomplete: "new-password" }
])

const toggleVisibility = (field) => {
  field.type = field.type === 'password' ? 'text' : 'password'
}

const tabs = [
  {value: 'login', label: 'auth.logIn'},
  {value: 'register', label: 'auth.regs'}
]

const visibleFields = computed(() => {
  if (mode.value === 'login') return fields.value.filter(f => f.name === 'email' || f.name === 'password')
  if (mode.value === 'register') return fields.value
  if (mode.value === 'reset') return fields.value.filter(f => f.name === 'email')
})

const withMinLoading = async (actionFn) => {
  if (submitLoading.value) return;
  submitLoading.value = true;
  const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
  try {
    await Promise.all([actionFn(), minDelay]);
  } finally {
    submitLoading.value = false;
  }
}

const handleSocialLogin = (provider) => {
  withMinLoading(async () => {
    try {
      if (provider === 'google') await authStore.loginWithGoogle()
      if (provider === 'apple') await authStore.loginWithApple()
      emits('close-auth-form')
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  })
}

function validateFields(values) {
  fields.value.forEach(field => field.error = '')
  if (mode.value === 'login' || mode.value === 'register') {
    if (!values.email) fields.value.find(f => f.name === 'email').error = 'errors.errorEmail'
    if (!values.password) fields.value.find(f => f.name === 'password').error = 'errors.errorPassword'
    if (mode.value === 'register') {
      if (!values.name) fields.value.find(f => f.name === 'name').error = 'errors.errorName'
      if (values.password !== values.confirm) {
        fields.value.find(f => f.name === 'confirm').error = 'errors.errorConfirm'
      }
    }
  }
  if (mode.value === 'reset') {
    if (!values.email) fields.value.find(f => f.name === 'email').error = 'errors.errorEmail'
  }
  return fields.value.every(f => !f.error)
}

const handleSubmit = async () => {
  if (submitLoading.value) return

  try {
    const values = Object.fromEntries(fields.value.map(field => [field.name, field.value]))
    if (!validateFields(values)) return

    submitLoading.value = true

    if (mode.value === 'reset') {
      await authStore.resetPassword(values.email)
      resetSent.value = true
      setTimeout(() => {
        mode.value = 'login'
        resetSent.value = false
      }, 2500)
      return
    }

    if (mode.value === 'register') {
      await authStore.registerUser({ name: values.name, email: values.email, password: values.password })
      emits('close-auth-form')
      fields.value.forEach(f => f.value = '')
      return
    }

    await authStore.loginUser({ email: values.email, password: values.password })
    emits('close-auth-form')
    router.push('/')
    fields.value.forEach(f => f.value = '')
  } catch (e) {
    fields.value.forEach(f => f.error = '')
    mapErrors(fields.value, e.code)
  } finally {
    submitLoading.value = false
  }
}

watch(mode, () => {
  fields.value.forEach(field => {
    field.value = ''
    field.error = '';
  })
})

watch(isAuthed, (v) => {
  if (v) {
    router.push('/')
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style>


.auth__title.left {
  justify-content: start;
}

.close__auth-icon {
  width: 22px;
  height: 22px;
  transform: rotate(-90deg);
}

.close__mob-auth-text {
  color: black;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
}

.close__btn-modal-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  opacity: 0;
}

.close__modal {
  justify-content: center;
  display: flex;
  align-items: center;
  border: none;
  background: none;
  padding: 10px;
  cursor: pointer;
}

.login__title {
  text-align: start;
  font-size: 28px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
}

.social-auth-container {
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  margin-top: 1.5rem;
}

.auth__text-method {
  color: white;
  font-weight: 600;
  margin-left: 10px;
  letter-spacing: .6px;
}

.google__auth-wrapper,
.apple__auth-wrapper,
.facebook__auth-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  padding: 8px;
  border: none;
  transition: all 0.1s ease-in-out;
}

.google__auth-wrapper,
.apple__auth-wrapper,
.facebook__auth-wrapper {
  background: #424141;
  box-shadow: 0 5px 0 #282727;
}

.google__icon,
.apple__icon,
.facebook__icon {
  width: 36px;
  height: 36px;
}

.auth__label-text {
  font-size: 14px;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  display: block;
  font-weight: 700;
  margin-left: 9px;
}

.auth__arrow {
  transform: rotate(90deg);
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 5px;
}

.auth__forgot {
  text-align: center;
  cursor: pointer;
  padding-top: 1rem;
  color: #37a1ff;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
}

.auth__inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
}

.auth__form {
  width: 100%;
  border-radius: 0;
  padding: 15px 34px 30px 34px;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.auth__title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 400;
  margin-bottom: 1.3rem;
  color: #1e1e1e;
  text-align: center;
  letter-spacing: 0;
  text-shadow: none;
  filter: none;
  position: relative;
}

.auth__title.left {
  justify-content: flex-start;
  text-align: left;
}

.auth__tabs {
  width: 100%;
  display: flex;
  background: #fff;
  border-radius: 45px;
  position: relative;
  margin-bottom: 1.5rem;
  border: 3px solid #1e1e1e;
  overflow: hidden;
  padding: 4px;
}

.auth__tab {
  flex: 1;
  text-align: center;
  padding: 14px 5px;
  cursor: pointer;
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  position: relative;
  transition: color 0.23s;
  user-select: none;
  z-index: 1;
}

.auth__tab--active {
  color: #fff;
}

.auth__toggle {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #575555;
  border-radius: 45px;
  transition: transform 0.4s cubic-bezier(.38, 1.32, .39, 1);
  z-index: 0;
  box-shadow: none;
  border: none;
}

.auth__toggle--register {
  transform: translateX(100%);
}

.auth__toggle--login {
  transform: translateX(0%);
}

.auth__fields {
  width: 100%;
}

.auth__field {
  width: 100%;
  height: 100px;
}

.auth__label {
  font-size: 1rem;
  color: #1e1e1e;
  text-shadow: none;
  font-family: "Nunito", sans-serif;
  font-weight: 400;
  letter-spacing: 0;
}

.auth__input {
  width: 100%;
  padding: 16px 20px;
  border-radius: 16px;
  background: #fff;
  font-size: 1rem;
  color: #1e1e1e;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  transition: all 0.2s;
  outline: none;
}

.auth__input:focus {
  border: 3px solid #f1c40f;
  box-shadow: none;
}

.auth__actions {
  width: 100%;
  margin-top: 10px;
}

.auth__submit {
  width: 100%;
  background: #3b82f6;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  padding: 12px 0;
  font-weight: 600;
  border-radius: 18px;
  cursor: pointer;
  box-shadow: 0 5px 0 #1e57d5;
  text-shadow: 1px 1px #4d4c4c;
  letter-spacing: 1px;
  font-family: "Nunito", sans-serif;
  transition: all 0.1s ease-in-out;
}

.auth__submit:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e;
}

.auth__submit:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.auth__error,
.auth__success {
  color: #d32f2f;
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 13px;
  padding-top: 2px;
}

.auth__success {
  color: #4ade80
}

@media (max-width: 767px) {
  .close__btn-modal-wrapper {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .auth {
    width: 100vw;
    border-left: none;
  }

  .auth__form {
    padding:35px 25px 10px 25px;
  }

  .auth__title {
    font-size: 1.8rem;
  }

  .auth__submit {
    font-size: 1.3rem;
  }

  .auth__tab {
    font-size: 1.1rem;
  }
}

.auth--rtl {
  right: auto;
  left: 0;
  border-left: none;
  border-right: 4px solid #1e1e1e;
  box-shadow: 12px 0 44px rgba(0, 0, 0, 0.1);
}

.auth__input-container {
  position: relative;
  width: 100%;
}

.auth__input--password {
  padding-right: 50px !important;
}

.auth__eye {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  z-index: 5;
}

.auth__eye:hover {
  opacity: 0.7;
}

.auth--rtl .auth__eye {
  right: auto;
  left: 15px;
}

.auth--rtl .auth__input--password {
  padding-right: 20px !important;
  padding-left: 50px !important;
}

.auth__eye img {
  width: 20px;
  height: 20px;
  display: block;
}

@media (max-width: 600px) {
  .auth--rtl {
    border-right: none;
  }
}
</style>