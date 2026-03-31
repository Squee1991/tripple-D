<template>
  <div class="verbs-container">
    <div class="fixed-top">
      <header class="header">
        <div class="header__inner">
          <div class="back__btn">
            <VBackBtn/>
          </div>
<!--          <h1 class="cartoon-title">{{ t('verbFormPage.title') }}</h1>-->
<!--          <div v-if="filteredVerbs.length" class="counter">-->
<!--            {{ t('verbFormPage.found') }} <strong>{{ filteredVerbs.length }}</strong>-->
<!--          </div>-->
        </div>
      </header>
      <div class="filters">
        <div class="search-box">
          <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('verbFormPage.placeHolder')"
              class="cartoon-input"
          />
        </div>
        <div class="select-wrapper">
          <select v-model="selectedType" class="cartoon-select">
            <option value="">{{ t('verbFormPage.typeTitle') }}</option>
            <option v-for="typeKey in verbTypes" :key="typeKey" :value="typeKey">
              {{ t('verbFormPage.' + typeKey) }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="scroll-area" v-if="paginatedVerbs.length > 0">
      <div v-for="verb in paginatedVerbs" :key="verb.id" class="verb-card">
        <div class="card-hero">
          <div class="card__hero-inner">
            <div class="inf-left-side">
              <SoundBtn :text="verb.infinitive" class="large-sound" />
              <h2 class="inf-main">
               <span class="verb__infinitive"> {{ verb.infinitive }}</span> - {{ verb.translations?.[locale] || verb.translations?.['en'] || '...' }}
              </h2>
            </div>
          </div>
          <span :class="['type-tag', verb.type]">{{ getLocalizedType(verb.type) }}</span>
        </div>
        <div class="tenses-layout">
          <div class="tense-box is-pres">
            <div class="tense-header">PRÄSENS</div>
            <div class="forms-list">
              <div v-for="(form, p) in verb.conjugation_pres" :key="p" class="form-row">
                <SoundBtn :text="`${formatPronoun(p)} ${form}`" class="mini-sound"/>
                <span class="p-label">{{ formatPronoun(p) }}</span>
                <span :class="['v-form', { 'is-highlight': p === 'er_sie_es' }]">{{ form }}</span>
              </div>
            </div>
          </div>
          <div class="tense-box is-past">
            <div class="tense-header">PRÄTERITUM</div>
            <div class="forms-list">
              <div v-for="(form, p) in verb.conjugation_past" :key="p" class="form-row">
                <SoundBtn :text="`${formatPronoun(p)} ${form}`" class="mini-sound"/>
                <span class="p-label">{{ formatPronoun(p) }}</span>
                <span class="v-form">{{ form }}</span>
              </div>
            </div>
          </div>
          <div class="tense-box is-perf">
            <div class="tense-header">PERFEKT</div>
            <div class="forms-list">
              <div v-for="(form, p) in verb.conjugation_perf" :key="p" class="form-row">
                <SoundBtn :text="`${formatPronoun(p)} ${form}`" class="mini-sound"/>
                <span class="p-label">{{ formatPronoun(p) }}</span>
                <span class="v-form is-perf-text">{{ form }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-bar">
      <button class="nav-btn" :disabled="currentPage === 1" @click="currentPage--">←</button>
      <span class="page-counter">{{ currentPage }} / {{ totalPages }}</span>
      <button class="nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">→</button>
    </div>
  </div>
</template>

<script setup>
import SoundBtn from "../src/components/soundBtn.vue";
import VBackBtn from "../src/components/V-back-btn.vue";
import { ref, computed, watch } from 'vue'
import { useSeoMeta } from "#imports";
const { locale , t } = useI18n();
const searchQuery = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(1)
const { data: rawData } = await useFetch('/verbs.json')
const verbTypes = ['weak', 'strong', 'mixed', 'modal']

useSeoMeta({
  robots: 'noindex, nofollow'
})

const typeTranslations = {
  ru: { weak: 'Слабый', strong: 'Сильный', mixed: 'Смешанный', modal: 'Модальный' },
  en: { weak: 'Weak', strong: 'Strong', mixed: 'Mixed', modal: 'Modal' },
  uk: { weak: 'Слабкий', strong: 'Сильний', mixed: 'Змішаний', modal: 'Модальний' },
  pl: { weak: 'Słaby', strong: 'Mocny', mixed: 'Mieszany', modal: 'Modalny' },
  tr: { weak: 'Zayıf', strong: 'Güçlü', mixed: 'Karışık', modal: 'Modal' },
  es: { weak: 'Débil', strong: 'Fuerte', mixed: 'Mixto', modal: 'Modal' },
  fr: { weak: 'Faible', strong: 'Fort', mixed: 'Mixte', modal: 'Modal' },
  uz: { weak: 'Kuchsiz', strong: 'Kuchli', mixed: 'Aralash', modal: 'Modal' },
  ro: { weak: 'Slab', strong: 'Tare', mixed: 'Mixt', modal: 'Modal' },
  hi: { weak: 'कमज़ोर', strong: 'मज़बूत', mixed: 'मिश्रित', modal: 'модальный' },
  ar: { weak: 'ضعيف', strong: 'قوي', mixed: 'مختلط', modal: 'ناقص' }
}

const getLocalizedType = (typekey) => {
   return typeTranslations[locale.value]?.[typekey] || typeTranslations['en']?.[typeKey] || typeKey
}

const formatPronoun = (pronoun) => {
  const map = { ich: 'ich', du: 'du', er_sie_es: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie_Sie: 'sie/Sie' }
  return map[pronoun] || pronoun
}

const allVerbs = computed(() => {
  if (!rawData.value) return []
  return Object.entries(rawData.value).flatMap(([type, list]) =>
      list.map(value => ({ ...value, type }))
  )
})

const filteredVerbs = computed(() => {
  if (!allVerbs.value) return []
  const query = searchQuery.value.toLowerCase().trim()
  return allVerbs.value.filter(valueVerb => {
    const matchType = !selectedType.value || valueVerb.type === selectedType.value
    const translation = valueVerb.translations?.[locale.value] || valueVerb.translations?.['en'] || ''
    const matchText = valueVerb.infinitive.toLowerCase().includes(query) ||
        translation.toLowerCase().includes(query)
    return matchType && matchText
  }).sort((a, b) => a.infinitive.toLowerCase() === query ? -1 : 1)
})

const totalPages = computed(() => Math.ceil(filteredVerbs.value.length / itemsPerPage.value) || 1)

const paginatedVerbs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredVerbs.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedType, itemsPerPage], () => currentPage.value = 1)

</script>

<style scoped>

*{
  color: var(--titleColor);
}



.verbs-container {
  height: 100vh;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: hidden;
}

.fixed-top {
  flex-shrink: 0;
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 10px;
  border: 3px solid #e2e8f0;
}

.cartoon-title {
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 1.8rem;
  text-align: center;
}

.counter {
  text-align: center;
  font-size: 0.8rem;
  padding: 2px 10px;
  border-radius: 10px;
}

.page-counter{
  width: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
}

.cartoon-input, .cartoon-select {
  padding: 12px;
  border: 2px solid #cbd5e0;
  border-radius: 10px;
  font-weight: 600;
  outline: none;
  transition: 0.2s;
  color: #2c2b2b;
  height: 46px;
}

.cartoon-input:focus {
  border-color: #4299e1;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 2px;
}

.scroll-area::-webkit-scrollbar {
  width: 5px;
}

.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(160, 174, 192, 0.4);
  border-radius: 20px;
}

.scroll-area::-webkit-scrollbar-thumb:hover {
  background-color: #4299e1;
}

.verb__infinitive {
  color: #4299e1;
}

.verb-card {
  border-radius: 25px;
  border: 4px solid #e2e8f0;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 8px 0 #e2e8f0;
}

.card-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-bottom: 2px dashed #e2e8f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.card__hero-inner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inf-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.inf-main {
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0;
}

.large-sound {
  transform: scale(1.4);
}

.ru-main {
  font-size: 1.2rem;
  font-weight: 700;
  color: #718096;
}

.type-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff;
  margin-top: 5px;
}

.type-tag.weak {
  background: #48bb78;
}

.type-tag.strong {
  background: #f56565;
}

.type-tag.mixed {
  background: #805ad5;
}

.type-tag.modal {
  background: #ed8936;
}

.tenses-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.tense-box {
  border-radius: 18px;
  padding: 15px;
  border: 2px solid #edf2f7;
}

.tense-header {
  font-size: 1rem;
  font-weight: 900;
  color: #a0aec0;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}

.p-label {
  font-weight: 800;
  color: #a0aec0;
  text-align: right;
}

.v-form {
  font-size: 0.95rem;
  font-weight: 700;
}

.mini-sound {
  transform: scale(0.8);
}

.card-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 2px dashed #e2e8f0;
  padding-bottom: 15px;
  margin-bottom: 10px;
}

.inf-left-side {
  display: flex;
  gap: 8px;
}

.type-tag {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.translation-section {
  text-align: left;
  margin-bottom: 20px;
}

.ru-main {
  font-size: 1.1rem;
  font-weight: 700;
  color: #718096;
}


.pagination-bar {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 15px;
  border-radius: 20px;
  border-top: 3px solid #e2e8f0;
}

.back__btn {
  max-width: 240px;
  margin: 0 auto;

}

.nav-btn {
  background: #4299e1;
  color: #fff;
  border: none;
  padding: 10px 25px;
  border-radius: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #2b6cb0;
}

.nav-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #2b6cb0;
}

.nav-btn:disabled {
  background: #cbd5e0;
  box-shadow: 0 4px 0 #a0aec0;
  cursor: not-allowed;
}

@media (max-width: 1023px) {
  .tenses-layout {
    grid-template-columns: 1fr;
  }

  .verb-card {
    border-width: 3px;
    box-shadow: 0 6px 0 #e2e8f0;
  }
}

@media (max-width: 767px) {
  .inf-main {
    font-size: 1.2rem;
  }

  .large-sound {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav-btn {
    text-align: center;
  }
}
</style>