<template>
  <div class="hedgehog-helper-wrapper">
    <button v-if="!isOpen" class="hh-fab" @click="openSheet">
      <div class="hh-fab-icon">
        <img class="hh-avatar-fab" :src="HedgehogIcon" alt="HedgehogIcon">
      </div>
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="hh-overlay" @click="closeSheet"></div>
    </transition>
    <transition name="slide-up">
      <div v-if="isOpen" class="hh-bottom-sheet">
        <div class="hh-sheet-header">
          <div class="hh-drag-line"></div>
          <button class="hh-close-btn" @click="closeSheet">✕</button>
        </div>
        <div class="hh-chat-area">
          <div class="hh-msg hh-bot">
            <img class="hh-avatar" :src="HedgehogIcon" alt="Hedgehog">
            <div class="hh-bubble">
              <template v-if="isLimitReached && !hintData">
                <p class="hh-limit-text">
                  🔒 <strong>{{ t('hedgehogImageHelper.limit_text') }}</strong><br>
                  {{ t('hedgehogImageHelper.limit_return_text') }}
                </p>
              </template>
              <template v-else-if="!hintData && !isLoading">
                <span v-if="!isAnswered">{{
                    t('hedgehogImageHelper.hintAnsweredTitle')
                  }}</span>
                <span v-else>{{
                    t('hedgehogImageHelper.hintAnsweredMistakesTitle')
                  }}</span>
              </template>
              <template v-else-if="isLoading">
                <div class="hh-loading"><span>{{ t('hedgehogImageHelper.loading') }}</span></div>
              </template>
              <template v-else>
                <div class="hh-hint-content">
                  <p class="hh-main-hint">
                    📌<strong>
                    {{ isAnswered ? t('hedgehogImageHelper.mainHint') : t('hedgehogImageHelper.mainHint2') }}
                  </strong>
                    {{ hintData.hintText }}
                  </p>
                  <div v-if="hintData.vocabulary?.length" class="hh-vocab-box">
                    <span class="hh-section-title">🗣 {{
                        isAnswered ? t('hedgehogImageHelper.betterToSay') : t('hedgehogImageHelper.usefulWords')
                      }}</span>
                    <div class="hh-chips">
                      <span v-for="(word, idx) in hintData.vocabulary" :key="idx" class="hh-chip">
                        <b>{{ word.de }}</b> — {{ word.tr }}
                      </span>
                    </div>
                  </div>
                  <p v-if="hintData.grammarTip" class="hh-grammar-tip">
                    💡 <strong>{{ t('hedgehogImageHelper.grammarHint') }}</strong> {{
                      hintData.grammarTip
                    }}
                  </p>
                </div>
              </template>
            </div>
          </div>
          <div class="hh-user-actions">
            <button v-if="!hintData && !isLoading && !isLimitReached" class="hh-action-btn primary"
                    @click="requestHint">
              {{
                isAnswered ? t('hedgehogImageHelper.getHint') : t('hedgehogImageHelper.getHint')
              }}
            </button>
            <button v-if="isLimitReached && !hintData" class="hh-action-btn premium-btn" @click="goToPremium">
              {{ t('hedgehogImageHelper.getPlus') }}
            </button>
            <button v-if="hintData" class="hh-action-btn primary" @click="closeSheet">
              {{ t('hedgehogImageHelper.thanks') }}
            </button>
            <button class="hh-action-btn secondary" @click="closeSheet">{{
                t('hedgehogImageHelper.close')
              }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {getFunctions, httpsCallable} from 'firebase/functions'
import {useRouter} from 'vue-router'
import HedgehogIcon from '~/assets/images/AssistantIcon.png'

const router = useRouter()
const {t, locale} = useI18n()

const props = defineProps({
  imageUrl: {type: String, default: ''},
  referenceDescription: {type: String, default: ''},
  userLevel: {type: String, default: 'A1'},
  isAnswered: {type: Boolean, default: false},
  userAnswer: {type: String, default: ''}
})

const isOpen = ref(false)
const isLoading = ref(false)
const hintData = ref(null)
const isLimitReached = ref(false)

watch([() => props.imageUrl, () => props.isAnswered], () => {
  hintData.value = null
  isLoading.value = false
  isLimitReached.value = false
})

const openSheet = () => {
  isOpen.value = true
}
const closeSheet = () => {
  isOpen.value = false
}

const goToPremium = () => {
  closeSheet()
  router.push('/pay')
}

const requestHint = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const functions = getFunctions(undefined, 'us-central1')
    const getHint = httpsCallable(functions, 'hedgehogAssistant')
    const res = await getHint({
      action: 'imageHint',
      referenceDescription: props.referenceDescription,
      userLevel: props.userLevel,
      userLocale: locale.value || 'ru',
      userAnswer: props.isAnswered ? props.userAnswer : null
    })

    if (res.data?.error === 'LIMIT_REACHED') {
      isLimitReached.value = true
      return
    }

    if (res.data?.error) {
      throw new Error(res.data.error)
    }

    if (res.data?.data) {
      hintData.value = res.data.data
    } else {
      throw new Error("Empty data")
    }
  } catch (err) {
    console.error("Ошибка при получении подсказки:", err)
    hintData.value = {
      hintText: t('hedgehogImageHelper.errorText'),
      vocabulary: [],
      grammarTip: t('hedgehogImageHelper.errorTip')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили остаются без изменений */
.hedgehog-helper-wrapper {
  position: relative;
  z-index: 1000;
}

.hh-fab {
  position: fixed;
  bottom: 45px;
  right: 14px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid #ffffff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  z-index: 99;
  transition: transform 0.2s;
}

.hh-fab:active {
  transform: scale(0.92);
}

.hh-avatar-fab {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.hh-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
}

.hh-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--bg);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  padding: 16px 20px 24px;
  color: #2b2b2b;
  border-top: 3px solid whitesmoke;
  max-height: 80vh;
  overflow-y: auto;
}

.hh-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hh-drag-line {
  width: 40px;
  height: 4px;
  background: #cbd5e1;
  border-radius: 4px;
  margin: 0 auto;
}

.hh-close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 14px;
  top: 6px;
}

.hh-chat-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hh-msg {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hh-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eff6ff;
  border: 2px solid #3b82f6;
  flex-shrink: 0;
}

.hh-bubble {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  padding: 12px;
  border-radius: 4px 18px 18px 18px;
  font-size: 15px;
  line-height: 1.5;
  width: 100%;
}

.hh-limit-text {
  margin: 0;
  color: #991b1b;
  font-size: 14px;
  line-height: 1.4;
}

.hh-hint-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hh-main-hint {
  margin: 0;
  color: #1e293b;
  font-size: 14px;
}

.hh-vocab-box {
  background: #ffffff;
  padding: 10px;
  border-radius: 12px;
  border: 1px dashed #3b82f6;
}

.hh-section-title {
  font-weight: bold;
  font-size: 13px;
  color: #1d4ed8;
  display: block;
  margin-bottom: 6px;
}

.hh-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.hh-chip {
  background: #eff6ff;
  color: #1e40af;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  border: 1px solid #bfdbfe;
}

.hh-grammar-tip {
  margin: 0;
  font-size: 13px;
  background: #fef3c7;
  color: #92400e;
  padding: 8px 12px;
  border-radius: 10px;
}

.hh-user-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hh-action-btn {
  padding: 12px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.hh-action-btn.primary {
  background: #3b82f6;
  box-shadow: 0 6px 0 #1d4ed8;
  color: white;
}

.hh-action-btn.premium-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 6px 0 #b45309;
  color: white;
}

.hh-action-btn.secondary {
  background: none;
  color: #64748b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.25s ease-out;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>