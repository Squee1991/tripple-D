<template>
  <div class="auth">
    <div class="auth__inner">
      <div class="auth__form">
        <div class="auth__title">
          <img
              @click="mode = 'login'"
              v-if="mode === 'reset'" class="auth__arrow" src="../../assets/images/arrowNav.svg" alt="arrow_nav">
          <h1 class="login__title">
            {{
              mode === 'login' ? t('auth.auths') : mode === 'register' ? t('auth.regs') :
                  t('auth.resetTitle')
            }}
          </h1>
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
                <input
                    class="auth__input"
                    :type="field.type"
                    :placeholder="t(field.placeholder)"
                    v-model="field.value"
                    :required="field.required"
                    :autocomplete="field.autocomplete"
                    :maxlength="field.maxlength || null"
                />
              </label>
              <div v-if="field.error" class="auth__error">{{ t(field.error) }}</div>
              <div v-if="resetSent" class="auth__success">{{ t('errors.resetSent') }}</div>
            </div>
            <div class="auth__actions">
              <button @click.prevent="handleSubmit" class="auth__submit">
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
        <div v-if="mode === 'login'" class="google__auth-wrapper" @click="handleGoogleLogin">
          <img class="google__icon" src="../../assets/images/search.svg" alt="google_icon">
          <div class="google__auth">{{ t('auth.google') }}</div>
        </div>
      </div>
      <div class="close__btn-modal-wrapper">
        <button class="close__modal" @click="emits('close-auth-form')">
          <div class="close__mob-auth-text">{{ t('hideAuthMobileBtn.text')}}</div>
          <img class="close__auth-icon" src="../../assets/images/arrowNav.svg" alt="hide_auth_icon">
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, watch} from 'vue'
import {userAuthStore} from '../../store/authStore.js'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {mapErrors} from '../../utils/errorsHandler.js'
const {t , locale} = useI18n()
const router = useRouter()
const emits = defineEmits(['close-auth-form'])
const authStore = userAuthStore()
const mode = ref('login')
const resetSent = ref(false)
const toggleTransform = computed(() => {
  if (locale.value === 'ar') {
    return mode.value === 'login' ? 'translateX(100%)' : 'translateX(0%)'
  } else {
    return mode.value === 'login' ? 'translateX(0%)' : 'translateX(100%)'
  }
})

const fields = ref([
  {
    id: 1,
    name: "name",
    type: "text",
    placeholder: "placeholder.name",
    label: "formLabel.name",
    error: false,
    value: '',
    required: true,
    maxlength: 18,
    autocomplete: "username",
  },
  {
    id: 2,
    name: "email",
    type: "email",
    placeholder: "placeholder.email",
    label: "formLabel.email",
    error: false,
    value: '',
    required: true,
    autocomplete: "email",
  },
  {
    id: 3,
    name: "password",
    type: "password",
    placeholder: "placeholder.password",
    label: "formLabel.password",
    error: false,
    value: '',
    required: true,
    autocomplete: "current-password",
  },
  {
    id: 4,
    name: "confirm",
    type: "password",
    placeholder: "placeholder.confirm",
    label: "formLabel.confirm",
    error: false,
    value: '',
    required: true,
    autocomplete: "new-password",
  },
])
const tabs = [
  {value: 'login', label: 'auth.logIn'},
  {value: 'register', label: 'auth.regs'}
]
const visibleFields = computed(() => {
  if (mode.value === 'login') {
    return fields.value.filter(f => f.name === 'email' || f.name === 'password')
  }
  if (mode.value === 'register') {
    return fields.value
  }
  if (mode.value === 'reset') {
    return fields.value.filter(f => f.name === 'email')
  }
})
const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
    emits('close-auth-form')
    router.push('/')
  } catch (e) {
  }
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
  const values = Object.fromEntries(fields.value.map(field => [field.name, field.value]))
  if (!validateFields(values)) return
  try {
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
      await authStore.registerUser({
        name: values.name,
        email: values.email,
        password: values.password
      })
      // router.push('/authUser')
    } else {
      await authStore.loginUser({
        email: values.email,
        password: values.password
      })
      emits('close-auth-form')
      router.push('/')
    }

    fields.value.forEach(f => f.value = '')
  } catch (e) {
    console.log(e)
    fields.value.forEach(f => f.error = '')
    mapErrors(fields.value, e.code)
  }
}
watch(mode, () => {
  fields.value.forEach(field => {
    field.value = ''
    field.error = '';
  })
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style>

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

.close__btn-modal-wrapper{
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
  width: 100%;
  font-size: 32px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.google__auth-wrapper {
  margin-top: 1.5rem;
  background: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  padding: 12px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

.google__auth-wrapper:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.google__auth-wrapper:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #1e1e1e;
}

.google__icon {
  width: 32px;
  height: 32px;
  padding: 4px;
  background: white;
  border-radius: 50%;
}

.google__auth {
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  margin-left: 10px;
  color: #1e1e1e;
}

.auth {
  position: fixed;
  top: 0;
  right: 0;
  width: 440px;
  max-width: 100vw;
  height: 100vh;
  background: #fef8e4;
  border-left: 4px solid #1e1e1e;
  box-shadow: -12px 0 44px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
}

.auth__label-text {
  font-size: 1rem;
  font-family: "Nunito", sans-serif;
  color: #1e1e1e;
  display: block;
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
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  text-decoration: underline;
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
  overflow: visible;
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

.auth__tabs {
  width: 100%;
  display: flex;
  background: #fff;
  border-radius: 16px;
  position: relative;
  margin-bottom: 1.5rem;
  box-shadow: 4px 4px 0px #1e1e1e;
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
  font-weight: 400;
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
  background: #1e1e1e;
  border-radius: 12px;
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
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  background: #fff;
  font-size: 1rem;
  color: #1e1e1e;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  box-shadow: 2px 2px 0px #1e1e1e inset;
  transition: all 0.2s;
  outline: none;
}

.auth__input:focus {
  box-shadow: 0 0 0px 3px #f1c40f, 2px 2px 0px #1e1e1e inset;
}

.auth__actions {
  width: 100%;
  margin-top: 10px;
}

.auth__submit {
  width: 100%;
  background: #f1c40f;
  border: 3px solid #1e1e1e;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1.5rem;
  padding: 12px 0;
  border-radius: 18px;
  cursor: pointer;
  box-shadow: 4px 4px 0px #1e1e1e;
  text-shadow: none;
  letter-spacing: 0;
  font-family: "Nunito", sans-serif;
  transition: all 0.1s ease-in-out;
}

.auth__submit:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.auth__error,
.auth__success {
  color: #d32f2f;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
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
    padding: 20px;
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
</style>
