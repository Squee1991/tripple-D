<template>
  <div class="vocab-container">
    <header class="vocab-header list-header">
      <button class="btn-icon-back" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h2 class="list-title">{{ t('landWordsSession.words') }}</h2>
    </header>
    <main class="vocab-main word-list-main">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
      </div>
      <div v-else-if="errorMessage" class="error-state">
        {{ errorMessage }}
      </div>
      <template v-else-if="vocabulary.length">
        <div v-for="(item, index) in vocabulary" :key="index" class="word-list-item">
          <SoundBtn :text="item.word" class="list-sound-btn"/>
          <div class="word-details">
            <span class="word-german-list">{{ item.word }}</span>
            <span class="word-translation-list">
              {{ item[`translation-${locale.split('-')[0]}`] || item['translation-en'] }}
            </span>
            <button v-if="item.isVerb" class="btn-verb-forms" @click="goToVerbForms(item.verbKey || item.word)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              {{ t('landWordsSession.verbs') }}
            </button>
          </div>
          <button v-if="getTip(item)" class="btn-tip" @click="openTipModal(getTip(item))">💡</button></div>
      </template>
      <div v-else class="empty-state">{{ t('landWordsSession.error') }}</div>
    </main>
    <footer class="vocab-footer" v-if="vocabulary.length">
      <button class="btn-primary" @click="startQuest">{{ t('landWordsSession.toQuest') }}</button>
    </footer>
    <Transition name="fade">
      <div v-if="isTipModalOpen" class="modal-overlay" @click.self="closeTipModal">
        <div class="tip-modal">
          <div class="tip-modal-header">
            <h3>{{ t('landWordsSession.grammar') }}</h3>
            <button class="close-btn" @click="closeTipModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="tip-modal-body">
            <p>{{ currentTipText }}</p>
          </div>
          <button class="btn-primary modal-ok-btn" @click="closeTipModal">{{ t('landWordsSession.got') }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SoundBtn from '~/src/components/soundBtn.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const regionKey = route.query.region
const questId = route.query.questId

const vocabulary = ref([])
const isLoading = ref(true)
const errorMessage = ref("")

const isTipModalOpen = ref(false)
const currentTipText = ref("")

onMounted(async () => {
  if (!regionKey || !questId) {
    errorMessage.value = ""
    isLoading.value = false
    return
  }
  try {
    const response = await fetch(`/quests/quests-${regionKey}.json`)
    if (!response.ok) {
      throw new Error("Не удалось загрузить данные.")
    }
    const data = await response.json()
    const quests = Array.isArray(data) ? data : (data.quests || [data])

    const currentQuest = quests.find(q => String(q.questId) === String(questId))

    if (currentQuest && currentQuest.vocabulary) {
      vocabulary.value = currentQuest.vocabulary
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
})

function goBack() {
  if (regionKey) {
    router.push(`/location/${regionKey}`)
  } else {
    router.back()
  }
}

function startQuest() {
  router.replace({
    path: `/location/quest-${questId}`,
    query: { region: regionKey }
  })
}

function getTip(item) {
  const currentLang = locale.value.split('-')[0]
  return item[`tip-${currentLang}`] || item['tip-ru'] || item['tip-en'] || null
}

function openTipModal(text) {
  currentTipText.value = text
  isTipModalOpen.value = true
}

function closeTipModal() {
  isTipModalOpen.value = false
  setTimeout(() => {
    currentTipText.value = ""
  }, 200)
}

function goToVerbForms(verbName) {
  router.push({
    path: '/verb-forms',
    query: { verb: verbName }
  })
}
</script>

<style scoped>
.vocab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 768px;
  margin: 0 auto;
  font-family: 'Nunito', sans-serif;
  touch-action: pan-y;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
}

.vocab-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: var(--bg);
  z-index: 10;
}

.list-header {
  justify-content: space-between;
}

.list-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  margin: 0;
  flex: 1;
  text-align: center;
  padding-right: 40px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile, 0 4px 0 rgba(0,0,0,0.05));
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

.vocab-main {
  flex-grow: 1;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.vocab-main::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}

.word-list-main {
  gap: 12px;
  padding: 20px 15px;
}

.word-list-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  padding: 12px 12px 12px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 2px solid #f1f5f9;
  transition: transform 0.1s ease;
}

.word-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-grow: 1;
}

.word-german-list {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.word-translation-list {
  font-size: 15px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 2px;
}

.btn-verb-forms {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.1s ease, transform 0.1s ease;
  margin-top: 4px;
}

.btn-verb-forms:active {
  transform: scale(0.96);
  background: #dbeafe;
}

/* Кнопка подсказки */
.btn-tip {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffedd5;
  border: 2px solid #fdba74;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 3px 0 #fb923c;
  margin-left: auto;
  align-self: center;
}

.btn-tip:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 transparent;
}

.vocab-footer {
  padding: 24px;
  background: var(--bg);
}

.btn-primary {
  width: 100%;
  background: #58cc02;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 46px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 0 #46a302;
  transition: transform 0.1s;
}

.btn-primary:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

/* Стили Модалки */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.tip-modal {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tip-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #475569;
}

.tip-modal-body p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #475569;
  font-weight: 600;
}

.modal-ok-btn {
  margin-top: 8px;
  background: #3b82f6;
  box-shadow: 0 5px 0 #2563eb;
}

.modal-ok-btn:active {
  box-shadow: 0 0 0 transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  font-size: 18px;
  color: var(--title, #555);
  margin-top: 40px;
  font-weight: 600;
}

.error-state {
  color: #d64671;
  background: #FFE7E7;
  padding: 15px;
  border-radius: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #58cc02;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>