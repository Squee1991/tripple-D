<template>
  <div class="auth__inner" style="margin-top: 50px;">
    <div class="auth__form">
      <h1 class="login__title-text">{{ t('updatePassword.title') }}</h1>

      <form class="auth-form" @submit.prevent="saveNewPassword" novalidate>
        <div class="auth__fields">

          <div class="auth__field">
            <label class="auth__label">
              <div class="auth__label-text">{{ t('updatePassword.newPasswordLabel') }}</div>
              <div class="auth__input-container">
                <input
                    v-model="newPassword"
                    type="password"
                    class="auth__input auth__input--password"
                    :placeholder="t('updatePassword.newPasswordPlaceholder')"
                    required
                    @input="clearError"
                />
              </div>
            </label>
          </div>

          <div class="auth__field">
            <label class="auth__label">
              <div class="auth__label-text">{{ t('updatePassword.confirmPasswordLabel') }}</div>
              <div class="auth__input-container">
                <input
                    v-model="confirmPassword"
                    type="password"
                    class="auth__input auth__input--password"
                    :placeholder="t('updatePassword.confirmPasswordPlaceholder')"
                    required
                    @input="clearError"
                />
              </div>
            </label>
          </div>

          <div class="auth__actions">
            <button type="submit" class="auth__submit" :disabled="loading">
              {{ loading ? t('updatePassword.savingBtn') : t('updatePassword.saveBtn') }}
            </button>
          </div>
        </div>
      </form>

      <p v-if="errorMsg" class="auth__error" style="margin-top: 15px;">{{ errorMsg }}</p>
      <p v-if="successMsg" class="auth__success" style="margin-top: 15px;">{{ successMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, confirmPasswordReset } from 'firebase/auth'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const oobCode = route.query.oobCode

onMounted(() => {
  if (!oobCode) {
    errorMsg.value = t('updatePassword.invalidLinkLoad')
  }
})

const clearError = () => {
  errorMsg.value = ''
}

const saveNewPassword = async () => {
  if (!oobCode) {
    errorMsg.value = t('updatePassword.invalidLinkSubmit')
    return
  }
  if (newPassword.value.length < 6) {
    errorMsg.value = t('updatePassword.minLength')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = t('updatePassword.mismatch')
    return
  }
  loading.value = true
  errorMsg.value = ''

  const auth = getAuth()
  try {
    await confirmPasswordReset(auth, oobCode, newPassword.value)
    successMsg.value = t('updatePassword.success')
    newPassword.value = ''
    setTimeout(() => {
      window.location.href = '/#/sign-in'
    }, 2000)
  } catch (error) {
    console.error('Firebase Auth Error:', error.code)
    switch (error.code) {
      case 'auth/invalid-action-code':
      case 'auth/expired-action-code':
        errorMsg.value = t('updatePassword.expiredCode')
        break
      case 'auth/network-request-failed':
        errorMsg.value = t('updatePassword.networkError')
        break
      default:
        errorMsg.value = t('updatePassword.defaultError')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.auth__inner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth__form {
  padding: 40px 20px;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
}

.login__title-text {
  font-size: 26px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 30px;
  color: var(--titleColor, #ffffff);
  font-family: "Nunito", sans-serif;
  letter-spacing: 0.5px;
}

.auth__fields {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.auth__label-text {
  font-size: 14px;
  font-weight: 700;
  color: #a0a0b8;
  margin-bottom: 8px;
  margin-left: 4px;
  font-family: "Nunito", sans-serif;
}

.auth__input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1e1e1e;
  background-color: #ffffff;
  border: 3px solid #605f5b;
  border-radius: 16px;
  outline: none;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.auth__input:focus {
  border-color: #4ebe36;
}

.auth__input::placeholder {
  color: #a1a1aa;
  font-weight: 500;
}

.auth__actions {
  margin-top: 10px;
}

.auth__submit {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  background-color: #5c55d9;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  box-shadow: 0 5px 0 #413aab;
  font-family: "Nunito", sans-serif;
  letter-spacing: 0.5px;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

.auth__submit:active:not(:disabled) {
  transform: translateY(5px);
  box-shadow: 0 0px 0 #413aab;
}

.auth__submit:disabled {
  background-color: #8380c9;
  box-shadow: 0 5px 0 #605d9e;
  cursor: not-allowed;
  opacity: 0.8;
}

.auth__error {
  color: #ff6b6b;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
}

.auth__success {
  color: #51cf66;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  padding: 10px;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 12px;
}
</style>