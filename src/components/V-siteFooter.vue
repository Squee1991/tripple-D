<script setup>
import { computed } from 'vue'
import Logo from '~/assets/images/logoReview.webp'
import { SERVICE_PATHS_CONFIG } from '~/constants/settings.constants.js'
import { PROJECT_NAME, SUPPORT_EMAIL, formatLegalDate } from '~/constants/legal.constants.js'

const { t, locale } = useI18n()

const links = computed(() => [
  { id: 'about', label: t('footer.about'), path: '/info-about' },
  ...SERVICE_PATHS_CONFIG.map(item => ({ id: item.id, label: t(item.labelKey), path: item.path }))
])

const year = new Date().getFullYear()
const legalUpdated = computed(() => formatLegalDate(locale.value))
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="site-footer__top">
      <NuxtLink to="/" class="site-footer__logo" :aria-label="PROJECT_NAME">
        <img class="site-footer__logo-img" :src="Logo" :alt="PROJECT_NAME">
      </NuxtLink>

      <nav class="site-footer__nav">
        <NuxtLink
            v-for="link in links"
            :key="link.id"
            :to="link.path"
            class="site-footer__link"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>

    <div class="site-footer__contact">
      {{ t('footer.contact') }}:
      <a class="site-footer__mail" :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>
    </div>

    <div class="site-footer__bottom">
      <span>© {{ year }} {{ PROJECT_NAME }}. {{ t('footer.copy') }}</span>
      <span class="site-footer__updated">{{ t('footer.updated') }}: {{ legalUpdated }}</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  margin-top: 40px;
  padding: 28px 24px 20px;
  border-top: 3px solid var(--menuBorder);
  border-radius: 24px 24px 0 0;
  background: var(--menuItemsBg);
  color: var(--titleColor);
  font-family: 'Nunito', sans-serif;
  box-sizing: border-box;
}

.site-footer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.site-footer__logo-img {
  display: block;
  height: 44px;
  width: auto;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
}

.site-footer__link {
  color: var(--titleColor);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.15s ease;
}

.site-footer__link:hover,
.site-footer__link.router-link-active {
  opacity: 1;
  text-decoration: underline;
}

.site-footer__contact {
  margin-top: 18px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.85;
}

.site-footer__mail {
  color: inherit;
  font-weight: 800;
  word-break: break-all;
}

.site-footer__bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 20px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--menuBorder);
  font-size: 13px;
  font-weight: 600;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .site-footer {
    padding: 22px 16px 16px;
  }

  .site-footer__top {
    flex-direction: column;
    align-items: flex-start;
  }

  .site-footer__bottom {
    flex-direction: column;
  }
}
</style>
