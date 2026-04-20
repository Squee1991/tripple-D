<script setup>
import {ref, computed} from 'vue'

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
      <div class="modal-window">

        <div class="modal-header">
          <h3 class="modal-title">Язык интерфейса</h3>
          <button class="close-btn" @click="closeModal">✕</button>
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
          <div
              v-for="loc in filteredLocales"
              :key="loc.code"
              class="modal-item"
              :class="{ active: loc.code === localeCode }"
              @click="selectLanguage(loc.code)"
          >
            <span>{{ loc.name }}</span>
            <div v-if="loc.code === localeCode" class="active-dot"></div>
          </div>

          <div v-if="filteredLocales.length === 0" class="not-found">
            Ничего не найдено
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-window {
  width: 90%;
  max-width: 320px;
  background: #1c222d;
  border: 2px solid #374151;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #000000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Nunito", sans-serif;
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #2a313e;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.search-wrapper {
  padding: 12px 16px;
  background: #2a313e;
  border-bottom: 1px solid #374151;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  background: #131f24;
  border: 1px solid #374151;
  border-radius: 10px;
  color: #ffffff;
  font-size: 15px;
  font-family: "Nunito", sans-serif;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #7d58ff;
}

.modal-list {
  max-height: 250px;
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}

.modal-list::-webkit-scrollbar {
  width: 4px;
}

.modal-list::-webkit-scrollbar-thumb {
  background-color: #374151;
  border-radius: 10px;
}

.modal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  color: #e2e8f0;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  border: 1px solid transparent;
  transition: all .2s;
}

.modal-item:last-child {
  margin-bottom: 0;
}

.modal-item:hover {
  background: #2a313e;
}

.modal-item.active {
  background: #7d58ff;
  color: #ffffff;
  border-color: #5c3ce6;
}

.active-dot {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.not-found {
  padding: 20px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}
</style>