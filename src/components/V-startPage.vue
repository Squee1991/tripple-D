<template>
  <div class="welcome-container">
    <div class="ui-layout">

      <div class="hero-wrap">
        <div class="hero-clay">
          <img src="../../public/images/logo/logo2.png" alt="Logo" class="hero-img">

          <div class="skill-tag tag-purple">Sprechen</div>
          <div class="skill-tag tag-cyan">Hören</div>
          <div class="skill-tag tag-pink">Lesen</div>
        </div>
      </div>

      <h1 class="game-title">
        Добро пожаловать в <br>
        <span class="brand-neon">Skillupgerman</span>
      </h1>

      <p class="game-info">
        Твой интерактивный путь к свободному немецкому. <br>
        Учи грамматику, пополняй словарный запас и <br>
        начни говорить уже сегодня.
      </p>

      <div class="cta-block">
        <button @click="emit('openLogin')" class="btn-emerald-3d">
          Начать обучение
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['openLogin'])
</script>

<style scoped>
/* НИКАКИХ БЭКГРАУНДОВ И АНИМАЦИЙ ПОЯВЛЕНИЯ */
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}

.ui-layout {
  max-width: 550px;
  width: 100%;
  text-align: center;
}

/* ГЕРОЙ (ЛОГО) */
.hero-wrap {
  margin-bottom: 3rem;
  position: relative;
}

.hero-clay {
  width: 130px;
  height: 130px;
  background: #ffffff;
  border-radius: 45px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Мягкий объем пластика */
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.05),
      inset 0 -8px 0 rgba(0, 0, 0, 0.05);
  position: relative;
}

.hero-img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

/* ТЭГИ (Баблы навыков) */
.skill-tag {
  position: absolute;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.tag-purple { background: #8B5CF6; top: -10px; left: -40px; transform: rotate(-10deg); }
.tag-cyan { background: #06B6D4; top: 10px; right: -50px; transform: rotate(10deg); }
.tag-pink { background: #EC4899; bottom: -5px; right: -30px; transform: rotate(-5deg); }

/* ЗАГОЛОВОК */
.game-title {
  font-size: 2.6rem;
  font-weight: 900;
  color: #1F2937;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.brand-neon {
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 6px rgba(139, 92, 246, 0.2));
}

/* ТЕКСТ */
.game-info {
  font-size: 1.2rem;
  color: #4B5563;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 3.5rem;
}

/* КНОПКА (Emerald 3D) */
.btn-emerald-3d {
  width: 100%;
  max-width: 320px;
  padding: 1.3rem;
  background: #10B981; /* Изумрудный */
  color: white;
  font-size: 1.4rem;
  font-weight: 900;
  border: none;
  border-radius: 24px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
      0 10px 0 #059669,
      0 20px 30px rgba(16, 185, 129, 0.3);
  transition: all 0.1s ease;
  outline: none;
}

.btn-emerald-3d:hover {
  background: #34D399;
  transform: translateY(-2px);
  box-shadow:
      0 12px 0 #059669,
      0 25px 35px rgba(16, 185, 129, 0.4);
}

.btn-emerald-3d:active {
  transform: translateY(8px);
  box-shadow:
      0 2px 0 #059669,
      0 10px 15px rgba(16, 185, 129, 0.2);
}

@media (max-width: 480px) {
  .game-title { font-size: 2rem; }
  .brand-neon { font-size: 2.3rem; }
  .game-info { font-size: 1rem; }
  .btn-emerald-3d { font-size: 1.2rem; }
}
</style>