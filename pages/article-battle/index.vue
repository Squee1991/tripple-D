<template>
  <div class="main-menu-container">
    <div class="menu-card">
      <div class="logo-area">
        <h1 class="title">DEUTSCH</h1>
        <h2 class="subtitle">MAGIE MASTER</h2>
      </div>

      <div class="button-list">
        <button class="menu-btn play" @click="handleAction('play')">
          <span class="btn-icon">🎮</span>
          <span class="btn-text">ИГРАТЬ</span>
          <div class="btn-shine"></div>
        </button>

        <button class="menu-btn settings" @click="handleAction('settings')">
          <span class="btn-icon">⚙️</span>
          <span class="btn-text">НАСТРОЙКИ</span>
        </button>

        <button class="menu-btn shop" @click="handleAction('shop')">
          <span class="btn-icon">💰</span>
          <span class="btn-text">МАГАЗИН</span>
        </button>

        <button class="menu-btn exit" @click="handleAction('exit')">
          <span class="btn-icon">🚪</span>
          <span class="btn-text">ВЫХОД</span>
        </button>
      </div>
    </div>

    <div class="menu-footer">
      v1.0.4 | Сделано с душой для будущих немцев
    </div>
  </div>
</template>

<script setup>
const handleAction = (action) => {
  console.log(`Действие: ${action}`)
  // Здесь будет логика перехода:
  // if(action === 'play') router.push('/game')
}
</script>

<style scoped>
/* Основной контейнер с сочным градиентом */
.main-menu-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, #6c5ce7 0%, #a29bfe 100%);
  font-family: 'Arial Rounded MT Bold', 'Helvetica', sans-serif;
  overflow: hidden;
  position: relative;
}

/* Карточка меню */
.menu-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  padding: 50px 40px;
  border-radius: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 320px;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Логотип */
.logo-area { margin-bottom: 40px; }
.title {
  font-size: 3rem;
  color: #fff;
  margin: 0;
  line-height: 1;
  text-shadow: 0 5px 0 #4834d4;
  letter-spacing: 2px;
}
.subtitle {
  font-size: 1.2rem;
  color: #fab1a0;
  margin: 5px 0 0;
  font-weight: bold;
}

/* Список кнопок */
.button-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Общий стиль кнопок */
.menu-btn {
  height: 65px;
  border: none;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-icon { font-size: 1.8rem; margin-right: 15px; }
.btn-text { font-size: 1.2rem; font-weight: 900; color: white; letter-spacing: 1px; }

/* Эффект наведения */
.menu-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Эффект нажатия (3D просадка) */
.menu-btn:active {
  transform: scale(0.95);
  box-shadow: none !important;
}

/* Цвета кнопок с тенями */
.play {
  background: #00b894;
  box-shadow: 0 8px 0 #009475;
}
.settings {
  background: #0984e3;
  box-shadow: 0 8px 0 #076ad4;
}
.shop {
  background: #fdcb6e;
  box-shadow: 0 8px 0 #e1a32b;
}
.exit {
  background: #ff7675;
  box-shadow: 0 8px 0 #d63031;
}

/* Блик на кнопке Играть */
.btn-shine {
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
}

.menu-footer {
  position: absolute;
  bottom: 20px;
  color: rgba(255,255,255,0.5);
  font-size: 0.8rem;
}
</style>