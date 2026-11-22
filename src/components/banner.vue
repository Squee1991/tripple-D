<template>
  <Overlay :visible="showAuth" @close="closeAuth"/>
  <transition name="slide">
    <SignIn v-if="showAuth" initial-mode="register" @close-auth-form="closeAuth"/>
  </transition>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__text">
        <h1 class="hero__brand">SkillUpGerman</h1>
        <p class="hero__lead">{{ t('banner.title') }}</p>
        <button class="hero__cta" @click="openAuth">{{ t('banner.btn') }}</button>
      </div>
      <div class="hero__art" aria-hidden="true">
        <div class="hero__ring"></div>
        <div class="hero__stage"></div>
        <img class="hero__mascot" :src="BannerMascot" alt="" draggable="false">
        <span class="hero__tag hero__tag--der">der</span>
        <span class="hero__tag hero__tag--die">die</span>
        <span class="hero__tag hero__tag--das">das</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import SignIn from '../components/logIn.vue'
import Overlay from '../components/Uioverlay.vue'
import BannerMascot from '../../assets/images/BannerMascot.svg'
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const showAuth = ref(false)

const openAuth = () => {
  showAuth.value = true
}

const closeAuth = () => {
  showAuth.value = false
}

watch(showAuth, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.hero {
  font-family: Nunito, sans-serif;
  overflow: hidden;
  padding: 56px 24px 40px;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 56px;
  max-width: 1120px;
  margin: 0 auto;
}

.hero__brand {
  font-family: Fredoka, Nunito, sans-serif;
  font-size: 4rem;
  font-weight: 600;
  line-height: 1.05;
  color: var(--titleColor);
}

.hero__lead {
  margin: 18px 0 34px;
  max-width: 32rem;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.55;
  color: var(--titleColor);
  opacity: 0.75;
  text-wrap: pretty;
}

.hero__cta {
  font-family: Nunito, sans-serif;
  padding: 16px 44px;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  background-color: #6368bb;
  color: #fff;
  box-shadow: 0 6px 0 #4a4fa1;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.hero__cta:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #4a4fa1;
}

@media (hover: hover) {
  .hero__cta:hover {
    transform: translateY(2px);
    box-shadow: 0 4px 0 #4a4fa1;
  }
}

.hero__art {
  position: relative;
  justify-self: center;
  width: 400px;
  max-width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Мягкий круг под ежом, чтобы он не висел в пустоте */
.hero__stage {
  position: absolute;
  inset: 10%;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 40%, #7b80d6, #4a4fa1 75%);
  box-shadow: 0 10px 0 #383c86;
}

/* Пунктирное кольцо вокруг круга */
.hero__ring {
  position: absolute;
  inset: 2%;
  border-radius: 50%;
  border: 2px dashed rgba(123, 128, 214, 0.45);
}

.hero__mascot {
  position: relative;
  width: 74%;
  height: auto;
  user-select: none;
  filter: drop-shadow(0 16px 20px rgba(0, 0, 0, 0.28));
}

.hero__tag {
  position: absolute;
  padding: 6px 18px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e1e1e;
  border: 2px solid #1e1e1e;
  border-radius: 14px;
  box-shadow: 3px 3px 0 #1e1e1e;
  user-select: none;
}

.hero__tag--der {
  top: 10%;
  left: 2%;
  background: #60a5fa;
  transform: rotate(-8deg);
}

.hero__tag--die {
  top: 40%;
  right: 0;
  background: #fca5a5;
  transform: rotate(7deg);
}

.hero__tag--das {
  bottom: 8%;
  left: 10%;
  background: #fde68a;
  transform: rotate(-4deg);
}

@media (max-width: 1023px) {
  .hero__inner {
    gap: 32px;
  }

  .hero__brand {
    font-size: 3.2rem;
  }

  .hero__lead {
    font-size: 1.15rem;
  }

  .hero__art {
    width: 340px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 40px 20px 32px;
  }

  .hero__inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero__lead {
    margin-left: auto;
    margin-right: auto;
  }

  /* на узких экранах ежа не показываем */
  .hero__art {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero__brand {
    font-size: 2.5rem;
  }

  .hero__lead {
    font-size: 1.05rem;
  }

  .hero__cta {
    width: 100%;
  }

}
</style>
