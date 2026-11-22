<script setup>
import { computed } from 'vue'
import Logo from '~/assets/images/logoReview.webp'
import TikTokIcon from '~/assets/images/tiktok.svg'
import TelegramIcon from '~/assets/images/telegram.svg'
import { PROJECT_NAME, SUPPORT_EMAIL, SOCIAL_LINKS } from '~/constants/legal.constants.js'

const { t } = useI18n()

const ICONS = { tiktok: TikTokIcon, telegram: TelegramIcon }

// Футер гостевой главной: виден без входа, здесь же ссылка на политику для проверки Google
const links = computed(() => [
  { id: 'about', label: t('nav.about'), path: '/info-about' },
  { id: 'contact', label: t('nav.contact'), path: '/support-request' },
  { id: 'faq', label: t('helpCenter.faq'), path: '/faq' },
  { id: 'privacy', label: t('helpCenter.privacy'), path: '/privacy' },
  { id: 'terms', label: t('helpCenter.terms'), path: '/terms' },
  { id: 'attributions', label: t('helpCenter.attributions'), path: '/attributions' }
])

const socials = SOCIAL_LINKS.map(item => ({ ...item, icon: ICONS[item.id] }))

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="site-footer__inner">
      <NuxtLink to="/" class="site-footer__logo" :aria-label="PROJECT_NAME">
        <img class="site-footer__logo-img" :src="Logo" :alt="PROJECT_NAME">
      </NuxtLink>
      <p class="site-footer__about">{{ t('useHeadApp.contentFour') }}</p>

      <div class="site-footer__socials">
        <component
            :is="item.url ? 'a' : 'span'"
            v-for="item in socials"
            :key="item.id"
            :href="item.url || undefined"
            :target="item.url ? '_blank' : undefined"
            :rel="item.url ? 'noopener noreferrer' : undefined"
            class="site-footer__social"
            :aria-label="item.label"
        >
          <img :src="item.icon" :alt="item.label">
        </component>
      </div>

      <nav class="site-footer__nav" :aria-label="PROJECT_NAME">
        <NuxtLink v-for="link in links" :key="link.id" :to="link.path" class="site-footer__link">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="site-footer__bottom">
        <span>© {{ year }} {{ PROJECT_NAME }}. {{ t('footer.copy') }}</span>
        <a class="site-footer__mail" :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* На всю ширину экрана, содержимое по центру, сверху полоска цветов der / die / das */
.site-footer {
  width: 100%;
  margin-top: 64px;
  background: var(--menuItemsBg);
  color: var(--titleColor);
  font-family: 'Nunito', sans-serif;
}

.site-footer::before {
  content: '';
  display: block;
  height: 5px;
  background: linear-gradient(90deg, #60a5fa 0 33.33%, #fca5a5 33.33% 66.66%, #fde68a 66.66% 100%);
}

.site-footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 24px;
  text-align: center;
  box-sizing: border-box;
}

.site-footer__logo-img {
  display: block;
  width: 110px;
  height: auto;
}

.site-footer__about {
  max-width: 26rem;
  margin: 12px 0 20px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  opacity: 0.7;
}

.site-footer__socials {
  display: flex;
  gap: 14px;
}

/* Кнопки соцсетей в стиле сайта: рамка и твёрдая тень */
.site-footer__social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  box-shadow: 3px 3px 0 #1e1e1e;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.site-footer__social img {
  width: 30px;
  height: 30px;
}

a.site-footer__social:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 #1e1e1e;
}

@media (hover: hover) {
  a.site-footer__social:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 28px;
  margin-top: 28px;
}

.site-footer__link {
  color: var(--titleColor);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.15s ease, color 0.15s ease;
}

.site-footer__link:hover {
  opacity: 1;
  color: #8b90e6;
}

.site-footer__bottom {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 24px;
  width: 100%;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 2px solid var(--menuBorder);
  font-size: 13px;
  font-weight: 600;
  opacity: 0.6;
}

.site-footer__mail {
  color: inherit;
  text-decoration: none;
}

.site-footer__mail:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .site-footer__nav {
    gap: 10px 20px;
  }

  .site-footer__bottom {
    flex-direction: column;
    align-items: center;
  }
}
</style>
