<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({ redirect: '/' })
}

const errorData = computed(() => {
  const code = props.error?.statusCode || 404

  if (code >= 400 && code < 500) {
    return {
      code: '404',
      caseName: 'ИСЧЕЗНОВЕНИЕ ОБЪЕКТА',
      question: 'Wo bist du? (Где ты?)',
      description: 'Агент Ёжик прибыл на место, но страница бесследно исчезла. Похоже, она застряла в текстурах Датива.',
      rule: 'Для вопроса «Wo?» (Где?) мы используем Dativ. Артикль меняется!',
      example: 'auf der Seite (die -> der)',
      btnText: 'Вернуться на карту'
    }
  } else {
    return {
      code: '500',
      caseName: 'ДИВЕРСИЯ В СЕРВЕРНОЙ',
      question: 'Was ist passiert? (Что случилось?)',
      description: 'Критический сбой! Мы ищем виновного (Akkusativ) и чиним оборудование.',
      rule: 'Для вопроса «Was?» (Что?) мы используем Akkusativ. Мужской род меняется!',
      example: 'den Server (der -> den)',
      btnText: 'Попробовать снова'
    }
  }
})
</script>

<template>
  <div class="case-file-page">
    <div class="texture-overlay"></div>
    <div class="content-wrapper">
      <div class="error-hero">
        <span class="hero-number">{{ errorData.code }}</span>
      </div>
      <div class="main-folder">
        <header class="folder-header">
          <div class="top-row">
            <span class="agency-name">SKILLUP DETECTIVE AGENCY</span>
          </div>
          <h1 class="case-title">{{ errorData.caseName }}</h1>
        </header>
        <div class="folder-body">
          <div class="detective-profile">
            <div class="avatar-circle">🦔</div>
            <div class="speech-bubble">
              <strong>{{ errorData.question }}</strong>
              <p>{{ errorData.description }}</p>
            </div>
          </div>
          <div class="evidence-box">
            <h3 class="evidence-title">УЛИКА: Грамматика</h3>
            <p class="evidence-text">{{ errorData.rule }}</p>
            <div class="evidence-example">
              <span class="de-flag">DE</span> {{ errorData.example }}
            </div>
          </div>
        </div>
        <footer class="folder-footer">
          <button class="prime-btn" @click="handleError">
            {{ errorData.btnText }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>

.case-file-page {
  min-height: 100vh;
  background-color: #2d3748;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
  position: relative;
  overflow-x: hidden;
  font-family: 'Nunito', sans-serif;
}

.texture-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  pointer-events: none;
}

.content-wrapper {
  width: 100%;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

/* Огромные цифры сверху */
.error-hero {
  position: relative;
  margin-bottom: -40px; /* Наплыв на папку */
  z-index: 2;
  text-align: center;
}

.hero-number {
  font-size: 10rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  line-height: 0.8;
  letter-spacing: -5px;
  display: block;
}

.case-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-5deg);
  background: #e53e3e;
  color: white;
  padding: 10px 30px;
  font-family: "Nunito", sans-serif;
  font-size: 1.5rem;
  border: 4px solid #fff;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

/* Основная папка */
.main-folder {
  background: #fcf6e3;
  width: 100%;
  border: 4px solid #1a202c;
  border-radius: 4px; /* Более строгие углы для эффекта бумаги */
  box-shadow: 20px 20px 0 rgba(0,0,0,0.2);
  padding: 60px 40px 40px;
  position: relative;
}

.folder-header {
  border-bottom: 2px solid #1a202c;
  margin-bottom: 30px;
  padding-bottom: 20px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 900;
  color: #718096;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.case-title {
  font-size: 2rem;
  color: #1a202c;
  font-weight: 900;
  text-transform: uppercase;
}

/* Тело папки */
.detective-profile {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 40px;
}

.avatar-circle {
  font-size: 3rem;
  background: #fff;
  border: 3px solid #1a202c;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 4px 4px 0 #1a202c;
}

.speech-bubble {
  background: #fff;
  border: 3px solid #1a202c;
  padding: 15px 20px;
  border-radius: 0 20px 20px 20px;
  position: relative;
  font-size: 1.1rem;
}

.speech-bubble strong {
  display: block;
  color: #5b8edc;
  margin-bottom: 5px;
  font-size: 1.2rem;
}

/* Карточка улики */
.evidence-box {
  background: #fff;
  border: 2px dashed #1a202c;
  padding: 25px;
  position: relative;
  margin-top: 20px;
}

.tape {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: rgba(246, 173, 85, 0.4);
  backdrop-filter: blur(2px);
}

.evidence-title {
  font-family: "Nunito", sans-serif;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #2d3748;
}

.evidence-text {
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 15px;
}

.evidence-example {
  background: #1a202c;
  color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 900;
  display: inline-block;
}

.de-flag {
  color: #f6ad55;
  margin-right: 8px;
}

/* Кнопка */
.prime-btn {
  width: 100%;
  background: #5b8edc;
  color: #fff;
  border: 3px solid #1a202c;
  padding: 20px;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 8px 0 #1a202c;
  transition: all 0.1s;
  margin-top: 20px;
}

.prime-btn:active {
  box-shadow: 0 0 0 #1a202c;
  transform: translateY(8px);
}

/* АДАПТИВНОСТЬ */
@media (max-width: 600px) {
  .case-file-page { padding: 40px 15px; }

  .hero-number { font-size: 6rem; }

  .case-badge {
    padding: 8px 20px;
    font-size: 1.1rem;
  }

  .main-folder {
    padding: 40px 20px 30px;
  }

  .case-title { font-size: 1.4rem; }

  .detective-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .speech-bubble {
    border-radius: 20px;
  }
}
</style>