<template>
  <div class="tab-content">
    <div class="header__inner">
      <button @click="router.back()" class="btn-icon-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="section-title">{{ t('cabinetToggle.profileData')}}</div>
    </div>
    <div class="profile__inner">
      <VTransition>
        <div v-if="isMounted" class="settings-section__wrapper">
          <div class="section-card">
            <div class="section-row">
              <div class="row-label">{{ t('cabinetInfoRows.name')}}</div>
              <div class="row-value">{{ authStore.name || '—' }}</div>
            </div>
            <div class="section-row">
              <div class="row-label">{{ t('cabinetInfoRows.email')}}</div>
              <div class="row-value">{{ authStore.email || '—' }}</div>
            </div>
            <div class="section-row">
              <div class="row-label">{{ t('cabinetInfoRows.registerDate')}}</div>
              <div class="row-value">{{ registrationDateText }}</div>
            </div>
          </div>
          <AccountManagement/>
          <div class="section-card mt-20" v-if="authStore.isPremium && !authStore.subscriptionCancelled && !isMobileApp">
            <div class="section-row">
              <div class="row-label">{{ t('cabinet.active')}}</div>
              <button class="btn-cancel-sub" @click="router.push('/cancel?action=unsubscribe')">
                {{ t('cabinet.cancelBtn')}}
              </button>
            </div>
          </div>
        </div>
      </VTransition>
      <div v-if="isMounted" class="settings-section account-actions">
        <div class="account-buttons">
          <button class="btn btn-logout w-full btn-m" @click="handleLogout">
            {{ t('auth.logOut') }}
          </button>
          <button class="btn btn-danger w-full btn-m" @click="openDeleteModal">
            {{ t('cabinet.deleteAcc') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { userAuthStore } from '~/store/authStore.js'
import VTransition from "~/src/components/V-transition.vue"
import AccountManagement from "../src/components/AccountManagement.vue";
import {useSeoMeta} from "#imports";

const router = useRouter()
const { locale, t } = useI18n()
const authStore = userAuthStore()
const isMounted = ref(false)
const isMobileApp = ref(false)


useSeoMeta({
  robots: 'noindex, nofollow'
})

const registrationDateText = computed(() => {
  const registeredAt = authStore.registeredAt
  if (!registeredAt) return '—'
  let date
  if (typeof registeredAt.toDate === 'function') date = registeredAt.toDate()
  else date = new Date(registeredAt)
  if (isNaN(date.getTime())) return '—'
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  let formatted = date.toLocaleDateString(locale.value || 'ru', options)
  formatted = formatted.replace(/\s*г\.$/, '')

  const parts = formatted.split(' ')
  if (parts.length === 3) {
    parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    return parts.join(' ')
  }
  return formatted
})

const handleLogout = async () => {
  await authStore.logOut()
  router.push('/')
}

const openDeleteModal = () => {
  router.push('/delete')
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.Capacitor) {
    isMobileApp.value = window.Capacitor.isNativePlatform()
  }
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})

</script>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1024px;
  margin: 0 auto;
  overflow: hidden;
  background: transparent;
  font-family: "Nunito", sans-serif;
}

.header__inner {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
}

.section-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  text-shadow: 1px 1px var(--title);
  margin-left: 15px;
}

.profile__inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 20px;
}

.settings-section__wrapper {
  padding: 0 16px;
}

.section-card {
  background: var(--settingsSectionBg);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}

.section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(122, 121, 121, 0.08);
}

.section-row:last-child {
  border-bottom: none;
}

.row-label {
  font-weight: 800;
  font-size: 15px;
  color: var(--titleColor);
}

.row-value {
  font-weight: 700;
  font-size: 15px;
  color: #808ea2;
  text-align: right;
  word-break: break-all;
  padding-left: 15px;
}

.account-actions {
  margin-top: auto;
  padding: 0 12px;
  flex-shrink: 0;
}

.account-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  border-radius: 16px;
  margin-top: 20px;
}

.w-full {
  width: 100%;
}

.btn-m {
  max-width: 320px;
}

.btn-logout {
  min-width: 100%;
  max-width: 480px;
  background: var(--settingsSectionBg);
  color: var(--title);
  border: none;
  border-radius: 30px;
  padding: 14px 24px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
}

.btn-logout:active {
  transform: translateY(2px);
}

.btn-danger {
  background: none;
  color: gray;
  border: none;
  border-radius: 10px;
  padding: 14px 24px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
}

.btn-danger:hover {
  color: #f44336;
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

.mt-20 {
  margin-top: 20px;
}

.btn-cancel-sub {
  background: #e55656;
  color: #ffffff;
  border: 2px solid #fca5a5;
  border-radius: 50px;
  padding: 8px 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.2s ease;
}

.btn-cancel-sub:hover {
  background: #ef4444;
  color: white;
}

.btn-cancel-sub:active {
  transform: translateY(2px);
}
</style>