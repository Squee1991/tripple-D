<template>
  <div class="exam">
    <button @click="routeToMain">На главную</button>
    <h1 class="exam__title">🎓 Подготовка к экзаменам</h1>
    <p class="exam__subtitle">
      Выбери уровень и начни практику всех модулей:
      <span class="exam__highlight">Lesen</span>,
      <span class="exam__highlight">Hören</span>,
      <span class="exam__highlight">Schreiben</span>,
      <span class="exam__highlight">Sprechen</span>
    </p>

    <div class="exam__levels">
      <div
          v-for="level in examLevels"
          :key="level.id"
          :class="['exam-card', `exam-card--${level.id}`]"
      >
        <h2 class="exam-card__title">{{ level.icon }} {{ level.title }}</h2>
        <ul class="exam-card__list">
          <li
              v-for="item in level.modules"
              :key="item"
              class="exam-card__item"
          >
            {{ item.text }}
          </li>
        </ul>
        <NuxtLink :to="`/exams/level/${level.id}`" class="exam-card__button">
          Перейти к {{ level.id.toUpperCase() }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {userExamStore} from '~/store/examStore.js'
import {useRouter} from 'vue-router'

const router = useRouter()
const examStore = userExamStore()
const examLevels = [
  {
    id: 'a1',
    icon: '📘',
    title: 'A1 — Начальный уровень',
    modules: [
      {text: '📖 Lesen — короткие тексты',},
      {text: '🎧 Hören — простые аудио',},
      {text: '✍️ Schreiben — письма и формы',},
      {text: '🗣️ Sprechen — себя и диалоги'}
    ]
  },
  {
    id: 'a2',
    icon: '📗',
    title: 'A2 — Базовый уровень',
    modules: [
      {text: '📖 Более сложные тексты'},
      {text: '🎧 Диалоги из повседневности'},
      {text: '✍️ Написание e-mail и заметок'},
      {text: '🗣️ Ответы на личные вопросы'},
    ]
  },
  {
    id: 'b1',
    icon: '📙',
    title: 'B1 — Средний уровень',
    modules: [
      {text: '📖 Новости, статьи, инструкции'},
      {text: '🎧 Длинные диалоги и мнения'},
      {text: '✍️ Формальные письма'},
      {text: '🗣️ Дискуссии и аргументы'}
    ]
  },
  {
    id: 'b2',
    icon: '📕',
    title: 'B2 — Продвинутый уровень',
    modules: [
      {text: '📖 Тексты на абстрактные темы',},
      {text: '🎧 Новости и выступления'},
      {text: '✍️ Эссе, отчёты и инструкции'},
      {text: '🗣️ Аргументированная речь'}
    ]
  }
]
const routeToMain = () => {
  router.push('/')
}
onMounted(() => {
  examStore.loadTopics('/exams/exam-A1.json')
})
</script>

<style scoped>
.exam {
  padding: 2rem;
  background-color: #fdf6e3;
  font-family: 'Comic Sans MS', cursive;
  min-height: 100vh;
  text-align: center;
}

.exam__title {
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
}

.exam__subtitle {
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 2rem;
}

.exam__highlight {
  font-weight: bold;
  color: #5c3a00;
}

.exam__levels {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.exam-card {
  background-color: #fffbe6;
  border: 3px dashed #aaa;
  border-radius: 15px;
  width: 280px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.exam-card:hover {
  transform: scale(1.05);
}

.exam-card__title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.exam-card__list {
  padding-left: 1.2rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  text-align: left;
}

.exam-card__item {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.exam-card__footer {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.exam-card__button {
  background-color: #ffe58f;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  max-width: 200px;
}

.exam-card__button:hover {
  background-color: #fcd34d;
}

.exam-card--a1 {
  border-color: #60a5fa;
}

.exam-card--a2 {
  border-color: #34d399;
}

.exam-card--b1 {
  border-color: #f59e0b;
}

.exam-card--b2 {
  border-color: #ef4444;
}
</style>