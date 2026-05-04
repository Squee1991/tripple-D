<template>
  <footer v-if="authStore.uid" class="footer" role="contentinfo">
    <div class="footer__container">
      <nav class="nav">
        <div class="sliding-bg"
             :style="{ transform: `translateX(${activeIndex * 100}%)`,  opacity: activeIndex === -1 ? 0 : 1 }">
        </div>
        <NuxtLink
            v-for="(item, index) in footerNav"
            :key="item.id"
            :to="item.path"
            class="nav__item"
            :class="{ 'is-active': activeIndex === index }"
        >
          <img class="nav__icon" :src="item.icon" :alt="item.alt">
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { userAuthStore } from "../../store/authStore.js";

import Home from '../../assets/images/app-nav-icons/home.svg'
import Events from '../../assets/images/app-nav-icons/events.svg'
import Game from '../../assets/images/app-nav-icons/game.svg'
import Cabinet from '../../assets/images/app-nav-icons/cabinet.svg'
import Study from '../../assets/images/app-nav-icons/study.svg'

const authStore = userAuthStore()
const route = useRoute()
const footerNav = [
  { id: 'study', path: '/study', icon: Study, alt: 'Study' },
  { id: 'game', path: '/play', icon: Game, alt: 'Game' },
  { id: 'home', path: '/', icon: Home, alt: 'Home' },
  { id: 'events', path: '/events', icon: Events, alt: 'Events' },
  { id: 'exams', path: '/cabinet', icon: Cabinet, alt: 'Exams' },
]
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
  bottom: 21px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 20px);
  z-index: 100;
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
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1), opacity 0.3s ease;
  z-index: 1;
  box-shadow: var(--tabSlideBoxShadow);
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

.nav__item.is-active .nav__icon {
  transform: translateY(-1px) scale(1.02);
}

</style>