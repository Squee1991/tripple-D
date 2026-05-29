<template>
  <div class="welcome-container">
    <div class="ui-layout">
      <div class="hero-wrap">
        <div class="hero-clay">
          <img src="../../assets/images/AuthIcon.svg" alt="Logo" class="hero-img">
          <div class="skill-tag tag-purple">Sprechen</div>
          <div class="skill-tag tag-cyan">Hören</div>
          <div class="skill-tag tag-pink">Lesen</div>
          <div class="skill-tag tag-amber">Schreiben</div>
        </div>
      </div>
      <div class="text-content">
        <div class="game-title">
          <img src="../../assets/images/logoReview.webp" alt="logo">
        </div>
<!--        <p class="game-info">-->
<!--          Твой интерактивный путь к свободному немецкому.-->
<!--          Учи грамматику, пополняй словарный запас и-->
<!--          начни говорить уже сегодня.-->
<!--        </p>-->
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Nunito', sans-serif;
}

.ui-layout {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  flex-grow: 1;
  padding: 10px;
}

.hero-wrap {
  position: relative;
}

.hero-clay {
  width: 140px;
  height: 140px;
  background: #2e9fff;
  border-radius: 40px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08),
  inset 0 -6px 0 rgba(0, 0, 0, 0.05);
  position: relative;
}

.hero-img {
  width: 82%;
  height: 82%;
  object-fit: contain;
}

.skill-tag {
  position: absolute;
  padding: 8px 16px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.tag-purple {
  background: #8B5CF6;
  top: -15px;
  left: -35px;
  transform: rotate(-12deg);
}

.tag-cyan {
  background: #06B6D4;
  top: -5px;
  right: -35px;
  transform: rotate(10deg);
}

.tag-pink {
  background: #EC4899;
  bottom: -8px;
  left: -30px;
  transform: rotate(10deg);
}

.tag-amber {
  background: #F59E0B;
  bottom: -10px;
  right: -40px;
  transform: rotate(-18deg);
}

.text-content {
  margin-bottom: 3rem;
}

.game-title {
  font-size: 26px;
  font-weight: 900;
  color: var(--titleColor);
  line-height: 1.1;
  margin-bottom: 24px;
  text-align: center;
}

.brand-neon {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 36px;
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
  padding: 15px;
}

.btn-emerald-3d {
  width: 100%;
  padding: 15px;
  background: #10B981;
  color: white;
  font-size: 18px;
  font-weight: 900;
  border: none;
  border-radius: 38px;
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
  .hero-wrap {
    margin-bottom: 2.5rem;
  }

  .game-title {
    font-size: 1.8rem;
  }

  .hero-clay {
    width: 110px;
    height: 110px;
  }

  .skill-tag {
    font-size: 0.7rem;
    padding: 6px 12px;
  }
}
</style>