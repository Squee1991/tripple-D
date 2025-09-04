<template>
  <div class="translator-sticker">
    <button class="close-btn" @click="$emit('close')">✖</button>
    <textarea v-model="text" placeholder="Введите текст для перевода..."></textarea>
    <div class="lang-select">
      <div class="custom-select" @click="toggleSource">
        <span>{{ getLangLabel(sourceLang) || 'С языка' }}</span>
        <ul v-if="showSourceDropdown" class="custom-dropdown">
          <li
              v-for="lang in languages"
              :key="lang.code"
              @click.stop="selectSourceLang(lang.code)"
          >
            {{ lang.label }}
          </li>
        </ul>
      </div>
      <button class="swap-button"
              @click="swapLanguages">
        <img :class="{swap : swapRotate}" src="../../assets/images/swap.svg" alt="">
      </button>
      <div class="custom-select" @click="toggleTarget">
        <span>{{ getLangLabel(targetLang) || 'На язык' }}</span>
        <ul v-if="showTargetDropdown" class="custom-dropdown">
          <li
              v-for="lang in languages"
              :key="lang.code"
              @click.stop="selectTargetLang(lang.code)"
          >
            {{ lang.label }}
          </li>
        </ul>
      </div>
    </div>
    <button class="translate-button" @click="translateText">Перевести</button>
    <div v-if="translatedText" class="result-box">
      <h4>Перевод:</h4>
      <p>{{ translatedText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTranslate } from '../composables/useTranslate.js'

const { locale } = useI18n()
const swapRotate = ref(false)
const text = ref('')
const translatedText = ref('')

const sourceLang = ref('')
const targetLang = ref('de')

watch(locale, (newLocale) => {
  if (!sourceLang.value) {
    sourceLang.value = newLocale
  }
}, { immediate: true })

const languages = [
  { code: 'en', label: 'Английский' },
  { code: 'de', label: 'Немецкий' },
  { code: 'fr', label: 'Французский' },
  { code: 'ru', label: 'Русский' },
  { code: 'tr', label: 'Турецкий' },
  { code: 'uk', label: 'Украинский' }
]

const showSourceDropdown = ref(false)
const showTargetDropdown = ref(false)

const toggleSource = () => {
  showSourceDropdown.value = !showSourceDropdown.value
  showTargetDropdown.value = false
}
const toggleTarget = () => {
  showTargetDropdown.value = !showTargetDropdown.value
  showSourceDropdown.value = false
}

const selectSourceLang = (code) => {
  sourceLang.value = code
  showSourceDropdown.value = false
}
const selectTargetLang = (code) => {
  targetLang.value = code
  showTargetDropdown.value = false
}

const getLangLabel = (code) => {
  const lang = languages.find(lang => lang.code === code)
  return lang?.label || ''
}

const swapLanguages = () => {
  const temp = sourceLang.value
  sourceLang.value = targetLang.value
  targetLang.value = temp
  swapRotate.value = !swapRotate.value

}



async function translateText() {
  if (!text.value.trim()) return
  translatedText.value = await useTranslate({
    text: text.value,
    source: sourceLang.value,
    target: targetLang.value,
  })
}

</script>

<style scoped>
.translator-sticker {
  width: 95%;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(145deg, #fff8f1, #f0e8d9);
  border: 4px solid #d9b68e;
  border-radius: 20px;
  padding: 35px 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 21px;
  cursor: pointer;
  color: #a36f2d;
  z-index: 10;
}
.close-btn:hover {
  color: #d93a3a;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #c8a97e;
  font-size: 16px;
  resize: none;
  background-color: #fffdf9;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.lang-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  gap: 10px;
}

.custom-select {
  position: relative;
  padding: 10px 14px;
  border: 2px solid #c8a97e;
  border-radius: 10px;
  background-color: #fffdf9;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  flex: 1;
}
.custom-select::after {
  content: "▼";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a67c52;
  font-size: 10px;
}
.custom-dropdown {
  position: absolute;
  z-index: 100;
  top: 100%;
  left: 0;
  right: 0;
  background: #fffdf9;
  border: 2px solid #c8a97e;
  border-radius: 10px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.custom-dropdown li {
  padding: 10px;
  cursor: pointer;
}
.custom-dropdown li:hover {
  background-color: #ffe2b3;
}

.swap-button  {
  padding: 10px 14px;
 width: 50px;
  border-radius: 50%;
  border: none;
  background: #ffe2b3;
  cursor: pointer;
  transform: rotate(0deg);
}

.swap-button img {
  transition: transform 0.4s ease;
}

.swap-button img.swap {
  transform: rotate(180deg);
}

.translate-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #f29e5c;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}
.translate-button:hover {
  background: #f2863d;
}

.result-box {
  margin-top: 20px;
  background: #fff9e6;
  border: 2px solid #e5cda5;
  border-radius: 12px;
  padding: 15px;
}
.result-box h4 {
  margin: 0 0 8px;
  color: #a36f2d;
}
.result-box p {
  margin: 0;
  font-size: 16px;
  color: #4a3a1c;
}
</style>
