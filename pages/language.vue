<script setup>
import { ref, computed } from 'vue'
const router = useRouter()
const { locales, locale, setLocale , t } = useI18n()
const pendingLocale = ref(null)
const currentActiveCode = computed(() => pendingLocale.value || locale.value)

const searchQuery = ref('')

const filteredLocales = computed(() => {
  if (!searchQuery.value) return locales.value
  return locales.value.filter(loc =>
      loc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectLanguage = async (code) => {
  if (code === locale.value) return

  pendingLocale.value = code

  try {
    await setLocale(code)
  } finally {
    pendingLocale.value = null
  }
}



const goToSignIn = () => {
  router.push('/sign-in')
}
</script>

<template>
  <div class="lang-container">
    <img class="start__bg" src="~/assets/images/startBg.png" alt="startBg">
    <div class="lang-header">
      <h2 class="title">{{ t('languagePage.title')}}</h2>
      <div class="search-wrapper">
        <input
            :key="locale.value"
            v-model="searchQuery"
            type="text"
            :placeholder="t('languagePage.placeholder')"
            class="search-input"
        />
      </div>
    </div>
    <div class="scroll-area">
      <div class="lang-list">
        <button
            v-for="loc in filteredLocales"
            :key="loc.code"
            class="lang-item"
            :class="{ 'is-active': loc.code === currentActiveCode }"
            @click="selectLanguage(loc.code)"
        >
          <span class="lang-item__name">{{ loc.name }}</span>
          <div class="lang-item__indicator"></div>
        </button>
        <div v-if="filteredLocales.length === 0" class="not-found">
          {{ t('languagePage.notfound')}}
        </div>
      </div>
    </div>

    <div class="lang-footer">
      <button class="next-button" @click="goToSignIn">
        {{ t('languagePage.further')}}
      </button>
    </div>
  </div>
</template>

<style scoped>
.lang-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: "Nunito", sans-serif;
  color: #fff;
  padding: 10px;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}


.start__bg {
  position: fixed;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  left: 0;
  top: 0;
  right: 0;
}

.lang-header,
.scroll-area,
.lang-footer {
  position: relative;
  z-index: 1;
}

.lang-header {
  padding: 15px 10px;
}

.title {
  height: 34px;
  font-size: 23px;
  font-weight: 800;
  margin-bottom: 15px;
  text-align: center;
  color: var(--titleColor);
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 3px solid #15bec3;
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  color: #262525;
  font-size: 16px;
  outline: none;
  font-weight: 600;
}

.search-input:focus {
  border-color: #0ca0a5;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
  scrollbar-width: thin;
  scrollbar-color: #0ca0a5 transparent;
}

.scroll-area::-webkit-scrollbar {
  width: 4px;
}
.scroll-area::-webkit-scrollbar-thumb {
  background: #0ca0a5;
  border-radius: 20px;
}

.lang-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;
}

.lang-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 20px;
  background: rgb(255 255 255 / 0.65);
  border: 3px solid white;

  border-radius: 22px;
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.lang-item:active {
  transform: translateY(1px);
  color: white;
}

.lang-item.is-active {
  border-color: #0ca0a5;
}

.lang-item__name {
  font-weight: 700;
  font-size: 16px;
  color: #474545;
}

.lang-item__code {
  color: #64748b;
  font-size: 12px;
  margin-left: auto;
  margin-right: 12px;
  text-transform: uppercase;
}

.lang-item__indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid #6abecd;
}

.is-active .lang-item__indicator {
  background: #6abecd;
}

.lang-footer {
  padding: 15px;
}

.next-button {
  width: 100%;
  padding: 15px;
  background: #15bec3;
  border: none;
  border-radius: 38px;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 8px 0 #0ca0a5;
  transition: all 0.1s;
}

.next-button:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 #065f46;
}

.not-found {
  text-align: center;
  color: #64748b;
  padding: 20px;
}
</style>