<template>
  <div class="gp-wrapper">
    <div class="gp-container">
      <h1 class="gp-title">Закончи мысль</h1>

      <!-- Настройки уровня и темы -->
      <div v-if="phase === 'setup'" class="gp-card">
        <div class="form-group">
          <label>Уровень</label>
          <div class="select-wrapper">
            <select v-model="level" class="gp-input">
              <option value="A1">A1 - Начинающий</option>
              <option value="A2">A2 - Базовый</option>
              <option value="B1">B1 - Средний</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Тема</label>
          <div class="select-wrapper">
            <select v-model="topic" class="gp-input">
              <option value="Im Restaurant">В ресторане</option>
              <option value="Auf der Arbeit">На работе</option>
              <option value="Freizeit und Hobbys">Свободное время</option>
              <option value="Reisen">Путешествия</option>
            </select>
          </div>
        </div>

        <button
            @click="generateStarter"
            :disabled="loading"
            class="gp-btn btn-purple btn-large mt-4"
        >
          {{ loading ? 'Готовим задание...' : 'Начать тренировку' }}
        </button>
      </div>

      <!-- Основной процесс -->
      <div v-if="phase === 'playing' || phase === 'result'" class="gp-workflow">

        <!-- Карточка с началом фразы -->
        <div class="gp-card prompt-bubble">
          <div class="avatar">🦔</div>
          <div class="prompt-content">
            <p class="prompt-de">{{ currentTask.sentenceStart }}</p>
            <p class="prompt-ru">{{ currentTask.translation }}</p>
          </div>
        </div>

        <!-- Ввод пользователя -->
        <div v-if="phase === 'playing'" class="gp-card interaction-area">
          <textarea
              v-model="userEnding"
              placeholder="...продолжите мысль на немецком"
              class="gp-input gp-textarea"
              rows="3"
          ></textarea>

          <div class="action-buttons">
            <button
                @click="getHints"
                :disabled="loading"
                class="gp-btn btn-dark"
            >
              {{ loading && !userEnding ? 'Загрузка...' : '💡 Помощь' }}
            </button>

            <button
                @click="submitAnswer"
                :disabled="loading || !userEnding.trim()"
                class="gp-btn btn-green flex-grow"
            >
              {{ loading && userEnding ? 'Проверяем...' : 'Проверить' }}
            </button>
          </div>

          <!-- Подсказки -->
          <div v-if="hints.length > 0" class="hints-section">
            <p class="hints-label">Примеры (нажмите, чтобы использовать)</p>
            <button
                v-for="(hint, index) in hints"
                :key="index"
                @click="userEnding = hint.de"
                class="hint-item"
            >
              <div class="hint-number">{{ index + 1 }}</div>
              <div class="hint-text">
                <p class="hint-de">{{ hint.de }}</p>
                <p class="hint-ru">{{ hint.tr }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Результат проверки -->
        <div v-if="phase === 'result'" class="gp-card result-card" :class="evaluation.isCorrect ? 'result-success' : 'result-warning'">
          <div class="result-header">
            <div class="result-icon">
              {{ evaluation.isCorrect ? '🎉' : '💡' }}
            </div>
            <h3 class="result-title">
              {{ evaluation.isCorrect ? 'Отлично!' : 'Можно лучше' }}
            </h3>
          </div>

          <p class="result-feedback">{{ evaluation.feedback }}</p>

          <div class="better-version">
            <p class="better-label">Как сказал бы носитель:</p>
            <p class="better-text">{{ evaluation.betterVersion }}</p>
          </div>

          <button
              @click="reset"
              class="gp-btn btn-purple btn-large mt-4"
          >
            Следующая фраза
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const hedgehogAssistant = httpsCallable(functions, 'hedgehogAssistant');

const phase = ref('setup');
const loading = ref(false);
const level = ref('A2');
const topic = ref('Im Restaurant');

const currentTask = ref({ sentenceStart: '', translation: '' });
const userEnding = ref('');
const hints = ref([]);
const evaluation = ref({ isCorrect: false, feedback: '', betterVersion: '' });

const generateStarter = async () => {
  loading.value = true;
  hints.value = [];
  userEnding.value = '';

  try {
    const response = await hedgehogAssistant({
      action: 'guidedProduction',
      subAction: 'generate',
      topic: topic.value,
      level: level.value,
      userLocale: 'ru',
      randomSeed: Date.now()
    });

    if (response.data.data) {
      currentTask.value = response.data.data;
      phase.value = 'playing';
    }
  } catch (error) {
    console.error('Ошибка генерации:', error);
    alert('Не удалось загрузить задание');
  } finally {
    loading.value = false;
  }
};

const getHints = async () => {
  loading.value = true;
  try {
    const response = await hedgehogAssistant({
      action: 'guidedProduction',
      subAction: 'hint',
      sentenceStart: currentTask.value.sentenceStart,
      level: level.value,
      userLocale: 'ru'
    });

    if (response.data.data && response.data.data.hints) {
      hints.value = response.data.data.hints;
    }
  } catch (error) {
    console.error('Ошибка подсказок:', error);
  } finally {
    loading.value = false;
  }
};

const submitAnswer = async () => {
  if (!userEnding.value.trim()) return;

  loading.value = true;
  try {
    const response = await hedgehogAssistant({
      action: 'guidedProduction',
      subAction: 'evaluate',
      sentenceStart: currentTask.value.sentenceStart,
      userEnding: userEnding.value.trim(),
      userLocale: 'ru'
    });

    if (response.data.data) {
      evaluation.value = response.data.data;
      phase.value = 'result';
    }
  } catch (error) {
    console.error('Ошибка проверки:', error);
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  generateStarter();
};
</script>

<style scoped>
/* Глобальная обертка под темный фон приложения */
.gp-wrapper {
  background-color: #121420; /* Темный фон как на скриншоте */
  min-height: 100vh;
  padding: 24px 16px;
  font-family: 'Nunito', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #ffffff;
  box-sizing: border-box;
}

.gp-container {
  max-width: 600px;
  margin: 0 auto;
}

*, *::before, *::after {
  box-sizing: inherit;
}

/* Заголовок */
.gp-title {
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  color: #8b5cf6; /* Фиолетовый акцент */
  margin-bottom: 24px;
  margin-top: 0;
}

.mt-4 {
  margin-top: 16px;
}

/* Карточки */
.gp-card {
  background-color: #1e2235; /* Цвет карточек земель */
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.gp-workflow {
  display: flex;
  flex-direction: column;
}

/* Формы */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #a1a1aa;
  margin-bottom: 8px;
  padding-left: 4px;
}

.gp-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #2d334a;
  border-radius: 16px;
  background-color: #121420; /* Темный фон внутри инпута */
  font-size: 16px;
  color: #ffffff;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
  font-weight: 600;
  appearance: none;
}

.gp-input:focus {
  border-color: #8b5cf6;
  background-color: #16192b;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "▼";
  font-size: 12px;
  color: #a1a1aa;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.gp-textarea {
  resize: none;
  min-height: 120px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.gp-textarea::placeholder {
  color: #525b7a;
}

/* Кнопки */
.gp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 16px; /* Округлые кнопки */
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s ease, filter 0.2s ease, opacity 0.2s ease;
  font-size: 16px;
  padding: 16px 20px;
  font-family: inherit;
}

.gp-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.gp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-large {
  width: 100%;
  font-size: 18px;
}

.btn-purple {
  background-color: #8b5cf6; /* Яркий фиолетовый как на кнопке "Карта" */
  color: #ffffff;
  box-shadow: 0 4px 0 #6d28d9;
}
.btn-purple:hover:not(:disabled) {
  filter: brightness(1.1);
}
.btn-purple:active:not(:disabled) {
  box-shadow: 0 0 0 #6d28d9;
  transform: translateY(4px);
}

.btn-dark {
  background-color: #2d334a;
  color: #ffffff;
  box-shadow: 0 4px 0 #1e2235;
}
.btn-dark:hover:not(:disabled) {
  background-color: #383f5a;
}
.btn-dark:active:not(:disabled) {
  box-shadow: 0 0 0 #1e2235;
  transform: translateY(4px);
}

.btn-green {
  background-color: #10b981;
  color: #ffffff;
  box-shadow: 0 4px 0 #059669;
}
.btn-green:hover:not(:disabled) {
  filter: brightness(1.1);
}
.btn-green:active:not(:disabled) {
  box-shadow: 0 0 0 #059669;
  transform: translateY(4px);
}

.flex-grow {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
  }
  .action-buttons .gp-btn {
    width: 100%;
  }
}

/* Пузырь с текстом */
.prompt-bubble {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px;
}

.avatar {
  background: #2d334a;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  border: 2px solid #8b5cf6;
}

.prompt-de {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.prompt-ru {
  font-size: 14px;
  font-weight: 600;
  color: #a1a1aa;
  margin: 0;
}

/* Подсказки */
.hints-section {
  margin-top: 24px;
  background-color: #171928;
  padding: 16px;
  border-radius: 16px;
}

.hints-label {
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 800;
  color: #525b7a;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.hint-item {
  width: 100%;
  text-align: left;
  background: #1e2235;
  border: 2px solid #2d334a;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ffffff;
}

.hint-item:hover {
  border-color: #8b5cf6;
  background-color: #262a40;
}

.hint-number {
  background: #2d334a;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.hint-text {
  flex: 1;
}

.hint-de {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.hint-ru {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* Результат проверки */
.result-card {
  border: 2px solid transparent;
}

.result-success {
  background-color: #064e3b; /* Темно-зеленый */
  border-color: #10b981;
}
.result-success .result-icon { background: #10b981; color: #ffffff; }
.result-success .result-title { color: #34d399; }

.result-warning {
  background-color: #451a03; /* Темно-оранжевый */
  border-color: #f59e0b;
}
.result-warning .result-icon { background: #f59e0b; color: #ffffff; }
.result-warning .result-title { color: #fbbf24; }

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.result-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}

.result-feedback {
  font-size: 16px;
  line-height: 1.6;
  color: #e2e8f0;
  margin: 0 0 24px 0;
  font-weight: 600;
}

.better-version {
  background: #121420;
  border: 2px solid #2d334a;
  padding: 20px;
  border-radius: 16px;
}

.better-label {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 800;
  color: #8b5cf6;
  margin: 0 0 8px 0;
}

.better-text {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.4;
}
</style>