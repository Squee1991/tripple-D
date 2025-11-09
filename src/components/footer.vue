<template>
  <footer class="footer" role="contentinfo">
    <div class="footer__container">
      <div class="footer__social">
        <div class="social__item" @click="toDiscord" role="button" aria-label="Discord" tabindex="0">
          <div class="icon">
            <svg enable-background="new 0 0 24 24" height="28" viewBox="0 0 24 24" width="28"
                 xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <g fill="white">
                <path
                    d="m3.58 21.196h14.259l-.681-2.205c.101.088 5.842 5.009 5.842 5.009v-21.525c-.068-1.338-1.22-2.475-2.648-2.475l-16.767.003c-1.427 0-2.585 1.139-2.585 2.477v16.24c0 1.411 1.156 2.476 2.58 2.476zm10.548-15.513-.033.012.012-.012zm-7.631 1.269c1.833-1.334 3.532-1.27 3.532-1.27l.137.135c-2.243.535-3.26 1.537-3.26 1.537.104-.022 4.633-2.635 10.121.066 0 0-1.019-.937-3.124-1.537l.186-.183c.291.001 1.831.055 3.479 1.26 0 0 1.844 3.15 1.844 7.02-.061-.074-1.144 1.666-3.931 1.726 0 0-.472-.534-.808-1 1.63-.468 2.24-1.404 2.24-1.404-3.173 1.998-5.954 1.686-9.281.336-.031 0-.045-.014-.061-.03v-.006c-.016-.015-.03-.03-.061-.03h-.06c-.204-.134-.34-.2-.34-.2s.609.936 2.174 1.404c-.411.469-.818 1.002-.818 1.002-2.786-.066-3.802-1.806-3.802-1.806 0-3.876 1.833-7.02 1.833-7.02z"/>
                <path
                    d="m14.308 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.576-1.335-1.29-1.335v.003c-.708 0-1.288.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/>
                <path
                    d="m9.69 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.575-1.335-1.286-1.335l-.004.003c-.711 0-1.29.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/>
              </g>
            </svg>
          </div>
          <span>discord</span>
        </div>
        <a href="https://t.me/+9Iao2uveB0o5NDI0" target="_blank" rel="noopener" class="social__item" aria-label="Telegram">
          <div class="icon">
            <svg height="28" viewBox="0 0 176 176" width="28" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <g data-name="Layer 2">
                <g id="telegram">
                  <path fill="white"
                        d="m123.33 62.35-44.63 36.48-2.1 1.72a2.27 2.27 0 0 0 -.84 1.48l-.47 3.88-1.29 10.9a.5.5 0 0 1 -1 .09l-3.63-10.9-3.75-11.15a2.24 2.24 0 0 1 1.08-2.66l46.44-26.62 8.74-5c1.27-.74 2.57.86 1.45 1.78z"/>
                  <path
                      d="m152 0h-128a24 24 0 0 0 -24 24v128a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24v-128a24 24 0 0 0 -24-24zm-9.11 50.94-17.18 75.91c-.81 3.56-5.33 5.17-8.5 3l-25.94-17.6-13.21 12.49a4.54 4.54 0 0 1 -7.32-1.62l-4.77-14-4.77-14-25.57-7a3.32 3.32 0 0 1 -.29-6.41l98.78-35.59 1.82-.65c3.83-1.34 7.79 1.76 6.95 5.47z"/>
                </g>
              </g>
            </svg>
          </div>
          <span>telegram</span>
        </a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener" class="social__item" aria-label="TikTok">
          <div class="icon">
            <svg height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path fill="currentColor"
                  d="M180.3 72.4c-9.7-5.8-16.7-15.1-19.5-26.1v-3.6h-23.4v110.4c0 12.9-10.5 23.4-23.4 23.4S90.6 166 90.6 153.1s10.5-23.4 23.4-23.4c2.1 0 4.3.3 6.3.8V104c-2.1-.2-4.2-.3-6.3-.3-25.6 0-46.3 20.8-46.3 46.3S88.4 196.3 114 196.3s46.3-20.8 46.3-46.3v-54.9c8.9 6.5 19.5 10.7 30.9 11.8v-23.4c-4.1-.5-8.1-1.7-11.9-3.5z"/>
            </svg>
          </div>
          <span>tiktok</span>
        </a>
      </div>
      <nav class="footer__nav" aria-label="Footer navigation">
        <ul class="nav__list">
          <li v-for="item in navItems" :key="item.id" class="nav__item">
            <NuxtLink :to="item.url" class="nav__link" :class="{ 'is-active': isActive(item.url) }">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {userAuthStore} from '~/store/authStore.js'

const {t} = useI18n()
const authStore = userAuthStore()
const route = useRoute()

const navItems = computed(() => [
  ...(!authStore.uid
      ? [
        {id: 'about', label: t('footer.about'), url: '/info-about'},
        {id: 'contact', label: t('footer.contact'), url: '/support-request'},
        {id: 'privacy', label: t('footer.privacy'), url: '/privacy'},
        {id: 'terms', label: t('footer.terms'), url: '/terms'},
      ]
      : []),
])

const isActive = (url) => route.path === url

const toDiscord = () => {
  window.open('https://discord.gg/vguCtVprzY', '_blank', 'noopener')
}
</script>

<style scoped>
.footer {
  position: relative;
  width: 100%;
  background: #0f7aaf;
  color: #2e1b08;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding: 17px 0 17px 0;
  border-top: 3px solid #d5d1d1;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer__social {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-bottom: 15px;
}

.social__item {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .3px;
  transition: .25s ease;
  cursor: pointer;
}

.social__item:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.social__item:focus-visible {
  outline: 2px dashed #2e1b08;
  outline-offset: 4px;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
}

svg {
  fill: white;
}

.social__item:nth-child(3) .icon svg {
  background: #FFFFFF;
  border-radius: 6px;
  padding: 3px;
  fill: #d7b77e;
}

.footer__nav {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nav__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.nav__link {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  color: whitesmoke;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.nav__link:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(46, 27, 8, 0.15);
}

.nav__link.is-active {
  background: #2e1b08;
  color: #fff;
  box-shadow: 0 6px 14px rgba(46, 27, 8, 0.25) inset, 0 4px 10px rgba(46, 27, 8, 0.2);
}

@media (max-width: 600px) {
  .footer__social {
    gap: 24px;
  }

  .social__item span {
    font-size: 13px;
  }

  .nav__link {
    padding: 7px 10px;
    font-size: 14px;
  }
}
</style>
