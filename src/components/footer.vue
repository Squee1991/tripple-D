<template>
  <footer class="footer">
    <div class="footer__container" :class="{ 'absolut' : authStore.uid }">
      <!--      <div class="footer-brand">-->
      <!--        <NuxtLink to="/">-->
      <!--          <span class="logo__name">LEXINGO</span>-->
      <!--        </NuxtLink>-->
      <!--      </div>-->
      <nav class="footer-links">
        <ul class="footer__links-nav">
          <li v-for="item in data" :key="item.id" class="footer__links-item">
            <NuxtLink class="footer__link" :to="item.url">
              {{ item.valueKey }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="footer__social-media">
        <div @click="toDiscord" class="social__media-icon">
          <svg enable-background="new 0 0 24 24" height="45" viewBox="0 0 24 24" width="45"
               xmlns="http://www.w3.org/2000/svg">
            <g fill="currentColor">
              <path
                  d="m3.58 21.196h14.259l-.681-2.205c.101.088 5.842 5.009 5.842 5.009v-21.525c-.068-1.338-1.22-2.475-2.648-2.475l-16.767.003c-1.427 0-2.585 1.139-2.585 2.477v16.24c0 1.411 1.156 2.476 2.58 2.476zm10.548-15.513-.033.012.012-.012zm-7.631 1.269c1.833-1.334 3.532-1.27 3.532-1.27l.137.135c-2.243.535-3.26 1.537-3.26 1.537.104-.022 4.633-2.635 10.121.066 0 0-1.019-.937-3.124-1.537l.186-.183c.291.001 1.831.055 3.479 1.26 0 0 1.844 3.15 1.844 7.02-.061-.074-1.144 1.666-3.931 1.726 0 0-.472-.534-.808-1 1.63-.468 2.24-1.404 2.24-1.404-3.173 1.998-5.954 1.686-9.281.336-.031 0-.045-.014-.061-.03v-.006c-.016-.015-.03-.03-.061-.03h-.06c-.204-.134-.34-.2-.34-.2s.609.936 2.174 1.404c-.411.469-.818 1.002-.818 1.002-2.786-.066-3.802-1.806-3.802-1.806 0-3.876 1.833-7.02 1.833-7.02z"/>
              <path
                  d="m14.308 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.576-1.335-1.29-1.335v.003c-.708 0-1.288.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/>
              <path
                  d="m9.69 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.575-1.335-1.286-1.335l-.004.003c-.711 0-1.29.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/>
            </g>
          </svg>
        </div>
        <div class="social__media-icon">
          <svg height="45" viewBox="0 0 176 176" width="45" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <g id="Layer_2" data-name="Layer 2">
              <g id="telegram">
                <path fill="currentColor"
                      d="m123.33 62.35-44.63 36.48-2.1 1.72a2.27 2.27 0 0 0 -.84 1.48l-.47 3.88-1.29 10.9a.5.5 0 0 1 -1 .09l-3.63-10.9-3.75-11.15a2.24 2.24 0 0 1 1.08-2.66l46.44-26.62 8.74-5c1.27-.74 2.57.86 1.45 1.78z"/>
                <path
                    d="m152 0h-128a24 24 0 0 0 -24 24v128a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24v-128a24 24 0 0 0 -24-24zm-9.11 50.94-17.18 75.91c-.81 3.56-5.33 5.17-8.5 3l-25.94-17.6-13.21 12.49a4.54 4.54 0 0 1 -7.32-1.62l-4.77-14-4.77-14-25.57-7a3.32 3.32 0 0 1 -.29-6.41l98.78-35.59 1.82-.65c3.83-1.34 7.79 1.76 6.95 5.47z"/>
              </g>
            </g>
          </svg>
        </div>
        <div class="social__media-icon">
          <svg height="45" viewBox="0 0 176 176" width="45" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_2" data-name="Layer 2">
              <g id="_14.tiktok" data-name="14.tiktok">
                <path id="background"
                      d="m144.52 173a532.59 532.59 0 0 1 -113 0 32.07 32.07 0 0 1 -28.52-28.48 532.59 532.59 0 0 1 0-113 32.07 32.07 0 0 1 28.48-28.52 532.59 532.59 0 0 1 113 0 32.07 32.07 0 0 1 28.52 28.48 532.59 532.59 0 0 1 0 113 32.07 32.07 0 0 1 -28.48 28.52z"
                      fill="currentColor"/>
                <path id="icon"
                      d="m74.73 143a35.1 35.1 0 0 1 0-70.2h8.57v17.13h-8.57a18 18 0 1 0 18 18v-74.93h17.13v8.56a18 18 0 0 0 18 18h8.57v17.1h-8.63a34.72 34.72 0 0 1 -18-5v36.24a35.13 35.13 0 0 1 -35.07 35.1z"
                      fill="#fff"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {ref} from 'vue'
import {userAuthStore} from "~/store/authStore.js";

const authStore = userAuthStore()

const data = computed(() => [
  ...(!authStore.uid
          ? [
            { id: 'about',   valueKey: 'О приложении',  url: '/info-about' },
            { id: 'contact', valueKey: 'Контакт',       url: '/support-request' },
          ]
          : []
  ),
  { id: 'privacy', valueKey: 'Конфиденциальность', url: '/privacy' },
  { id: 'terms',   valueKey: 'Условия',            url: '/terms'   },
])

const toDiscord = () => {
  window.open('https://discord.gg/dJGRN4Yz')
}
</script>

<style scoped>

.footer__container {
  border: 3px solid black;
  padding: 40px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 4px 4px 0 black;
  background: #4ade80;
  width: 100%;
}

.footer__links-nav {
  display: flex;
  gap: 12px;
  justify-items: center;
}

.footer__link {
  font-size: 16px;
  color: black;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.footer__links-item {
  padding: 4px 10px;
  border-radius: 15px;
  box-shadow: 4px 4px 0 black;
  border: 2px solid #1e1e1e;
  width: 100%;
  background-color: white;
  text-align: center;
  transition: .3s;
}

@media (min-width: 1024px) {
  .footer__links-item:hover {
    background: #f1c40f;
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 black;
    transition: .3s;
  }
}

.footer__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.3rem;
}

.footer__social-media {
  display: flex;
  gap: 14px;
}

.logo__name {
  color: #e39910;
  font-family: "Nunito", sans-serif;
  font-weight: bold;
  font-size: 2.3rem;
  font-style: italic;
  letter-spacing: 5px;
  text-shadow: 5px 4px 0px white;
  -webkit-text-stroke: 5px #e39910;
  transition: .5s;
}

.logo__name:hover {
  text-shadow: 5px 4px 3px white;
  transition: .5s;
}

.footer-brand {
  display: flex;
  align-items: center;
}

.footer-links {
  flex: 1;
  display: flex;
  justify-content: center;
}

.social__media-icon {
  color: black;
  cursor: pointer;
  border: 2px solid black;
  padding: 7px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 4px 4px 0 black;
  transition: .3s;
}

.social__media-icon:hover {
  color: #0e4cc0;
  transform: scale(1.05);
  transition: .3s;
}

svg {
  color: currentColor;
}

@media (max-width: 767px) {
  .absolut {
    gap: 13px;
    padding: 10px 15px;
    position: sticky;
    left: 0;
    bottom: 0;
  }

  .social__media-icon {
    padding: 3px;
    box-shadow: 2px 2px 0 black;
    border: 2px solid black;
  }

  svg {
    width: 30px;
    height: 30px;
  }

  .footer__link {
    font-size: 14px;
  }
}

@media (max-width: 440px) {
.footer__links-nav {
  flex-direction: column;
}

}
</style>
