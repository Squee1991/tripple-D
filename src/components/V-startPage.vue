<template>
  <div class="welcome-container">
    <div class="ui-layout">

      <div class="hero-wrap">
        <div class="hero-clay">
          <img src="../../public/images/logo/logo2.png" alt="Logo" class="hero-img">

          <div class="skill-tag tag-purple">Sprechen</div>
          <div class="skill-tag tag-cyan">Hören</div>
          <div class="skill-tag tag-pink">Lesen</div>
          <div class="skill-tag tag-amber">Schreiben</div>
        </div>
      </div>

      <div class="text-content">
        <h1 class="game-title">
         Добро пожаловать на <br>
          <span class="brand-neon">Skillupgerman</span>
        </h1>
        <p class="game-info">
          Твой интерактивный путь к свободному немецкому.
          Учи грамматику, пополняй словарный запас и
          начни говорить уже сегодня.
        </p>
      </div>

      <div class="cta-block">
        <button @click="router.push('/language')" class="btn-emerald-3d">
          Начать обучение
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const router = useRouter()
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: env(safe-area-inset-top) 1.5rem env(safe-area-inset-bottom) 1.5rem;

  font-family: 'Nunito', sans-serif;
}

.ui-layout {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.hero-wrap {
  margin-top: 2rem;
  margin-bottom: 4rem;
  position: relative;
}

.hero-clay {
  width: 140px;
  height: 140px;
  background: #ffffff;
  border-radius: 40px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.08),
      inset 0 -6px 0 rgba(0, 0, 0, 0.05);
  position: relative;
}

.hero-img {
  width: 75%;
  height: 75%;
  object-fit: contain;
}

.skill-tag {
  position: absolute;
  padding: 8px 16px;
  border-radius: 18px;
  font-size: 0.85rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.tag-purple {
  background: #8B5CF6;
  top: -15px;
  left: -50px;
  transform: rotate(-12deg);
}

.tag-cyan {
  background: #06B6D4;
  top: -5px;
  right: -55px;
  transform: rotate(10deg);
}

.tag-pink {
  background: #EC4899;
  bottom: 15px;
  left: -45px;
  transform: rotate(8deg);
}

.tag-amber {
  background: #F59E0B;
  bottom: -10px;
  right: -40px;
  transform: rotate(-8deg);
}

.text-content {
  margin-bottom: 3rem;
}

.game-title {
  font-size: 26px;
  font-weight: 900;
  color: var(--titleColor);
  line-height: 1.1;
  margin-bottom: 1rem;
  text-align: center;
}

.brand-neon {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.game-info {
  font-size: 15px;
  color: #6B7280;
  font-weight: 600;
  line-height: 1.4;
  padding: 0 10px;
  text-align: center;
}

.cta-block {
  width: 100%;
  padding-bottom: 2rem;
}

.btn-emerald-3d {
  width: 100%;
  padding: 1.2rem;
  background: #10B981;
  color: white;
  font-size: 1.3rem;
  font-weight: 900;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  box-shadow: 0 8px 0 #065f46;
  transition: all 0.1s active;
  -webkit-tap-highlight-color: transparent;
}

.btn-emerald-3d:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 #065f46;
}

@media (max-height: 700px) {
  .hero-wrap { margin-bottom: 2.5rem; }
  .game-title { font-size: 1.8rem; }
  .hero-clay { width: 110px; height: 110px; }
  .skill-tag { font-size: 0.7rem; padding: 6px 12px; }
}
</style>