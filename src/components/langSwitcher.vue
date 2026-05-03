<script setup>
import {ref, computed} from 'vue'
const { t } = useI18n()
const emit = defineEmits(['close'])
const {locales, locale, setLocale} = useI18n()
const pendingLocale = ref(null)
const localeCode = computed(() => pendingLocale.value || locale.value)

const searchQuery = ref('')
const filteredLocales = computed(() => {
  if (!searchQuery.value) return locales.value || []
  return locales.value.filter(loc =>
      loc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const closeModal = () => {
  emit('close')
}

const selectLanguage = async (code) => {
  pendingLocale.value = code
  try {
    await setLocale(code)
  } finally {
    pendingLocale.value = null
    closeModal()
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ t('cabinetToggle.language')}}</h3>
          <button class="close-btn" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                 stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="search-wrapper">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск..."
              class="search-input"
          />
        </div>

        <div class="modal-list">
          <label
              v-for="loc in filteredLocales"
              :key="loc.code"
              class="theme-option"
              :class="{ active: loc.code === localeCode }"
              @click="selectLanguage(loc.code)"
          >
            <div class="theme-option-content">
              <div class="theme-preview">
                <span class="lang-code">{{ loc.code }}</span>
              </div>
              <span class="theme-label">{{ loc.name }}</span>
            </div>
            <div class="theme-check" v-if="loc.code === localeCode">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                   stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </label>
          <div v-if="filteredLocales.length === 0" class="not-found">
            {{ t('friendExam.notFound')}}
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>


@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 9999;
  padding: 20px;
}

.modal-card {
  background: var(--tabBg);
  border-radius: 28px;
  width: 100%;
  max-width: 340px;
  border: 3px solid var(--tabsSlideBorderColor);
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: var(--titleColor);
  letter-spacing: 0.5px;
}

.close-btn {
  background: var(--settingsSectionBg);
  border: 3px solid var(--tabsSlideBorderColor);
  color: var(--titleColor);
  width: 36px;
  height: 36px;
  border-radius: 12px;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
}

.close-btn:active {
  transform: scale(0.9);
}

.search-wrapper {
  padding: 0 24px 16px;
}

.search-input {
  width: 100%;
  padding: 14px 16px;
  background: var(--settingsSectionBg);
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
}

.search-input::placeholder {
  color: #94a3b8;
}

.modal-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-list::-webkit-scrollbar {
  display: none;
}

.theme-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--settingsSectionBg);
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.theme-option:active {
  transform: scale(0.97);
}

.theme-option.active {
  background: #eff6ff;
  border-color: #3b82f6;
  box-shadow: inset 0 3px 0 rgba(59, 130, 246, 0.1);
}

.theme-option-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-preview {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #1e293b;
  border: 2px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-option.active .theme-preview {
  background: #3b82f6;
}

.lang-code {
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.theme-label {
  font-size: 17px;
  font-weight: 800;
  color: var(--titleColor);
}

.theme-option.active .theme-label {
  color: #1d4ed8;
}

.theme-check {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.not-found {
  padding: 20px;
  text-align: center;
  color: #64748b;
  font-size: 16px;
  font-weight: 800;
}
</style>