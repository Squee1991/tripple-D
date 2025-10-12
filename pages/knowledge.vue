<script setup lang="ts">
import {ref, computed} from 'vue'

type Topic = { id: string; title: string; price: number; owned: boolean }
type Cat = { id: string; name: string; topics: Topic[] }

const balance = ref(420)
const notice = ref('')

const cats = ref<Cat[]>([
  {
    id: 'verbs', name: 'Глаголы', topics: [
      {id: 'verbs-a1-presens', title: 'Präsens (правильные)', price: 80, owned: false},
      {id: 'verbs-modal', title: 'Модальные (können, dürfen…)', price: 120, owned: false},
      {id: 'verbs-separable', title: 'Отделяемые приставки', price: 90, owned: false},
      {id: 'verbs-inseparable', title: 'Неотделяемые приставки', price: 90, owned: false},
      {id: 'verbs-reflexive', title: 'Возвратные глаголы', price: 110, owned: false},
      {id: 'verbs-perfekt', title: 'Perfekt (haben/sein)', price: 120, owned: false},
      {id: 'verbs-prateritum', title: 'Präteritum (часто используемые)', price: 130, owned: false},
      {id: 'verbs-konj2', title: 'Konjunktiv II (вежливость/желания)', price: 150, owned: false}
    ]
  },
  {
    id: 'nouns', name: 'Существительные', topics: [
      {id: 'nouns-articles', title: 'Артикли der/die/das', price: 140, owned: false},
      {id: 'nouns-plural', title: 'Множественное число', price: 110, owned: false},
      {id: 'nouns-gender-tips', title: 'Подсказки по роду', price: 120, owned: false}
    ]
  },
  {
    id: 'adjectives', name: 'Прилагательные', topics: [
      {id: 'adj-decl', title: 'Склонение прилагательных', price: 160, owned: false},
      {id: 'adj-comparison', title: 'Сравнение (Komparativ/Superlativ)', price: 120, owned: false}
    ]
  },
  {
    id: 'preps', name: 'Предлоги', topics: [
      {id: 'prep-place', title: 'Предлоги места (in, an, auf…)', price: 120, owned: false},
      {id: 'prep-time', title: 'Предлоги времени (um, am, im…)', price: 120, owned: false},
      {id: 'prep-cases', title: 'Предлоги падежей (Akk/Dativ/Gen)', price: 150, owned: false},
      {id: 'prep-modals', title: 'Модальные предлоги (mit, ohne…)', price: 100, owned: false}
    ]
  },
  {
    id: 'cases', name: 'Падежи', topics: [
      {id: 'case-nom', title: 'Nominativ', price: 70, owned: false},
      {id: 'case-akk', title: 'Akkusativ', price: 110, owned: false},
      {id: 'case-dat', title: 'Dativ', price: 110, owned: false},
      {id: 'case-gen', title: 'Genitiv (базово)', price: 90, owned: false}
    ]
  },
  {
    id: 'tenses', name: 'Времена', topics: [
      {id: 'tense-pres', title: 'Präsens', price: 80, owned: false},
      {id: 'tense-perf', title: 'Perfekt', price: 110, owned: false},
      {id: 'tense-prat', title: 'Präteritum', price: 120, owned: false},
      {id: 'tense-futur', title: 'Futur I', price: 100, owned: false}
    ]
  },
  {
    id: 'syntax', name: 'Сложные конструкции', topics: [
      {id: 'syntax-wordorder', title: 'Порядок слов (V2, VF)', price: 130, owned: false},
      {id: 'syntax-nebensatz', title: 'Придаточные (weil, dass…)', price: 140, owned: false},
      {id: 'syntax-relativ', title: 'Относительные предложения', price: 150, owned: false},
      {id: 'syntax-passiv', title: 'Passiv (базово)', price: 150, owned: false}
    ]
  },
  {
    id: 'phrases', name: 'Фразы', topics: [
      {id: 'phr-greetings', title: 'Приветствия и знакомство', price: 70, owned: false},
      {id: 'phr-travel', title: 'Путешествия/транспорт', price: 100, owned: false},
      {id: 'phr-hotel', title: 'Гостиница/бронь', price: 90, owned: false},
      {id: 'phr-restaurant', title: 'Кафе/ресторан', price: 90, owned: false},
      {id: 'phr-doctor', title: 'У врача/аптеке', price: 100, owned: false},
      {id: 'phr-shop', title: 'Покупки/магазин', price: 90, owned: false},
      {id: 'phr-work', title: 'Работа/интервью', price: 120, owned: false}
    ]
  },
  {
    id: 'vocab', name: 'Словарь тем', topics: [
      {id: 'voc-house', title: 'Дом и жильё', price: 100, owned: false},
      {id: 'voc-food', title: 'Еда и напитки', price: 110, owned: false},
      {id: 'voc-body', title: 'Тело и здоровье', price: 100, owned: false},
      {id: 'voc-clothes', title: 'Одежда', price: 90, owned: false},
      {id: 'voc-nature', title: 'Природа и погода', price: 100, owned: false},
      {id: 'voc-travel', title: 'Путешествия', price: 110, owned: false},
      {id: 'voc-school', title: 'Учёба', price: 90, owned: false},
      {id: 'voc-work', title: 'Работа и офис', price: 110, owned: false}
    ]
  },
  {
    id: 'exams', name: 'Экзамены', topics: [
      {id: 'exam-a1', title: 'Банк заданий A1', price: 200, owned: false},
      {id: 'exam-a2', title: 'Банк заданий A2', price: 260, owned: false},
      {id: 'exam-b1', title: 'Банк заданий B1', price: 340, owned: false}
    ]
  }
])

const selectedCatId = ref(cats.value[0].id)
const visible = computed(() => cats.value.find(c => c.id === selectedCatId.value)?.topics ?? [])

function selectCat(id: string) {
  selectedCatId.value = id
  notice.value = ''
}

function buyTopic(tid: string) {
  const cat = cats.value.find(c => c.id === selectedCatId.value)
  if (!cat) return
  const t = cat.topics.find(x => x.id === tid)
  if (!t || t.owned) return
  if (balance.value < t.price) {
    notice.value = 'Недостаточно монет.';
    return
  }
  balance.value -= t.price
  t.owned = true
  notice.value = `Куплено: «${t.title}». Теперь ассистент будет знать эту тему.`
}
</script>

<template>
  <div class="store">
    <aside class="store__sidebar">
      <div class="store__balance">Баланс: <strong>{{ balance }}</strong> 🔸</div>
      <ul class="store__cats">
        <li v-for="c in cats" :key="c.id"
            :class="['store__cat', { 'store__cat--active': c.id === selectedCatId }]"
            @click="selectCat(c.id)">
          {{ c.name }}
        </li>
      </ul>
    </aside>

    <main class="store__content">
      <header class="store__head">
        <h1>Магазин знаний</h1>
        <p v-if="notice" class="store__notice">{{ notice }}</p>
      </header>

      <div class="store__grid">
        <div v-for="t in visible" :key="t.id" class="topic">
          <div class="topic__title">{{ t.title }}</div>
          <div class="topic__foot">
            <span class="topic__price">{{ t.price }} 🔸</span>
            <button class="topic__btn"
                    :disabled="t.owned || balance < t.price"
                    @click="buyTopic(t.id)">
              <template v-if="t.owned">Куплено</template>
              <template v-else-if="balance < t.price">Не хватает</template>
              <template v-else>Купить</template>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.store {
  display: grid;
  grid-template-columns:260px 1fr;
  gap: 16px;
  padding: 16px;
}

.store__sidebar {
  background: #f6f2e8;
  border: 1px solid #e1d9c7;
  border-radius: 12px;
  padding: 12px;
}

.store__balance {
  background: #fff;
  border: 1px dashed #d6cbb2;
  padding: 8px 10px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.store__cats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.store__cat {
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e6e0cf;
  cursor: pointer;
  user-select: none;
}

.store__cat--active {
  background: #fdecc8;
  border-color: #f4c97b;
  font-weight: 600;
}

.store__content {
  padding: 4px;
}

.store__head h1 {
  margin: 0 0 8px;
  font-size: 20px;
}

.store__notice {
  margin: 0 0 12px;
  color: #156016;
  background: #e9f7ea;
  border: 1px solid #cfe9d1;
  padding: 6px 10px;
  border-radius: 8px;
}

.store__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.topic {
  background: #fff;
  border: 1px solid #e6e0cf;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topic__title {
  font-weight: 600;
}

.topic__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topic__price {
  font-weight: 700;
}

.topic__btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e6e0cf;
  background: #f6f2e8;
  cursor: pointer;
}

.topic__btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .store {
    grid-template-columns:1fr;
  }
}
</style>
