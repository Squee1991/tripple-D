<template>
  <footer v-if="authStore.uid" class="footer" role="contentinfo">
    <div class="footer__container">
      <nav class="nav">
        <div class="sliding-bg" :style="{ transform: `translateX(${getTransformX(activeIndex)}%)`, opacity: activeIndex === -1 ? 0 : 1 }">
        </div>
        <NuxtLink
            v-for="(item, index) in footerNav"
            :key="item.id"
            :to="item.path"
            class="nav__item"
            :class="{ 'is-active': activeIndex === index }"
        >
          <img class="nav__icon" :src="item.icon" :alt="item.alt">
          <span class="nav__label">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>
  </footer>
  <footer v-else class="footer-public" role="contentinfo">
    <div class="footer-public__container">
      <div class="footer-public__brand">
        <img src="../../assets/images/logoReview.webp" alt="Skillupgerman" class="footer-public__logo">
      </div>
      <div class="footer-public__links">
        <NuxtLink
            v-for="link in servicePaths"
            :key="link.id"
            :to="link.path"
            class="footer-public__link"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
      <div class="footer-public__copyright">
        © {{ new Date().getFullYear() }} {{ t('public__copyright.text')}}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { userAuthStore } from "../../store/authStore.js";
import { useI18n } from 'vue-i18n';

import Home from '../../assets/images/app-nav-icons/home.svg'
import Events from '../../assets/images/app-nav-icons/events.svg'
import Game from '../../assets/images/app-nav-icons/game.svg'
import Cabinet from '../../assets/images/app-nav-icons/cabinet.svg'
import Study from '../../assets/images/app-nav-icons/study.svg'

const { t, locale } = useI18n();
const authStore = userAuthStore()
const route = useRoute()

const servicePaths = computed(() => [
  {id: 'attributions', label: t('helpCenter.attributions'), path: '/attributions'},
  {id: 'FAQ', label: t('helpCenter.faq'), path: '/faq'},
  {id: 'Privacy', label: t('helpCenter.privacy'), path: '/privacy'},
  {id: 'terms', label: t('helpCenter.terms'), path: '/terms'}
])

const footerNav = [
  { id: 'study', path: '/study', label: t('footerNavLabel.learn'), icon: Study, alt: 'Study' },
  { id: 'game', path: '/play', label: t('footerNavLabel.games'), icon: Game, alt: 'Game' },
  { id: 'home', path: '/', label: t('footerNavLabel.home'), icon: Home, alt: 'Home' },
  { id: 'events', path: '/events', label: t('footerNavLabel.events'), icon: Events, alt: 'Events' },
  { id: 'exams', path: '/cabinet', label: t('footerNavLabel.cabinet'), icon: Cabinet, alt: 'Exams' },
]

const getTransformX = (index) => {
  if (index === -1) return 0;
  if (locale.value === 'ar') {
    return (footerNav.length - 1 - index) * 100;
  }
  return index * 100;
};

const activeIndex = computed(() => {
  return footerNav.findIndex(item => {
    if (item.path === '/') return route.path === '/'
    return route.path.startsWith(item.path)
  })
})
</script>

<style scoped>

.footer {
  position: fixed;
  max-width: 1240px;
  margin: 0 auto;
  bottom: 27px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 20px);
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
}

.footer__container {
  background: var(--tabBg);
  border-radius: 40px;
  padding: 6px;
  box-shadow: var(--boxShadowMobile);
  border: 3px solid var(--tabsSlideBorderColor);
}

.footer:after {
  content: "";
  position:fixed;
  bottom: -28px;
  left: 0;
  height: 55px;
  width: 100%;
  z-index: 0;
  background: var(--overlayAfter);
}

.nav {
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
}

.sliding-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 20%;
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow);
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1), opacity 0.3s ease;
  z-index: 1;
  will-change: transform;
}

.nav__item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;
  position: relative;
  z-index: 2;
  text-decoration: none;
  cursor: pointer;
}

.nav__icon {
  width: 35px;
  height: 35px;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.nav__label{
  display: none;
}

@media (min-width: 1024px) {
  .nav__label {
    display: block;
    color: var(--title);
    font-weight: 600;
    margin-left: 8px;
    font-size: 15px;
  }
}

.footer-public {
  width: 100%;
  padding: 30px 20px;
  margin-top: auto;
  font-family: "Nunito", sans-serif;
  background-color: var(--navBg, transparent);
  border-top: 4px solid var(--tabsSlideBorderColor, #1e1e1e);
}

.footer-public__container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-public__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.footer-public__logo {
  height: 160px;
  object-fit: contain;
  filter: drop-shadow(3px 3px 0px rgba(0,0,0,0.3));
}

.footer-public__slogan {
  font-size: 1.1rem;
  font-weight: 700;
  color: #a0aec0;
  max-width: 400px;
}

.footer-public__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
}

.footer-public__link {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--titleColor, #ffffff);
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
  padding: 5px 0;
}

.footer-public__link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 0;
  background-color: var(--titleColor, #ffffff);
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.footer-public__link:hover::after {
  width: 100%;
}

.footer-public__link:hover {
  opacity: 0.8;
}

.footer-public__copyright {
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  text-align: center;
  letter-spacing: 0.5px;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .footer-public__links {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }

  .footer-public__link {
    font-size: 1.1rem;
  }
}
</style>