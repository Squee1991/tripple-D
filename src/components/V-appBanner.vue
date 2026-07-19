<template>
  <section class="app-promo">
    <div class="app-promo__container">
      <div class="app-promo__header">
        <h2 class="app-promo__title">
          <span class="app-promo__highlight">{{ t('appBanner.promo')}}</span>
        </h2>
        <p class="app-promo__subtitle">{{ t('appBanner.promo_sub')}}</p>
      </div>
      <div class="app-promo__content">
        <div class="app-promo__actions">
          <a
              v-for="store in stores"
              :key="store.mainText"
              :href="store.url"
              class="store-btn"
              :class="store.class"
              :aria-label="store.aria"
          >
            <svg class="store-btn__icon" :viewBox="store.viewBox" fill="currentColor" v-html="store.svgPath"></svg>
            <div class="store-btn__info">
              <span class="store-btn__sub">{{ store.subText }}</span>
              <span class="store-btn__main">{{ store.mainText }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n()
const stores = [
  {
    subText: t('appBanner.subTextApple'),
    mainText: 'App Store',
    url: '#',
    aria: t('appBanner.subTextAriaApple'),
    class: '',
    viewBox: '0 0 384 512',
    svgPath: '<path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>'
  },
  {
    subText: t('appBanner.subTextGoogle'),
    mainText: 'Google Play',
    url: '#',
    aria: t('appBanner.subTextAriaGoogle  '),
    class: 'store-btn--yellow',
    viewBox: '0 0 512 512',
    svgPath: '<path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>'
  }
]
</script>

<style scoped>
.app-promo {
  font-family: "Nunito", sans-serif;
  padding: 10px 20px;
  width: 100%;
  margin-bottom: 40px;
}

.app-promo__container {
  max-width: 1100px;
  margin: 0 auto;
}

.app-promo__header {
  text-align: center;
  margin-bottom: 4rem;
}

.app-promo__title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 38px;
  letter-spacing: -0.02em;
}

.app-promo__highlight {
  color: white;
  position: relative;
  display: inline-block;
  background: #32b7d5;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 5px 5px 0 #269db7;
  transform: rotate(-2deg);
}

.app-promo__subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #a0aec0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.app-promo__content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
}

.app-promo__actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex: 1;
  width: 100%;
}

.store-btn {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #ffffff;
  color: #1e1e1e;
  padding: 16px 30px;
  border-radius: 25px;
  border: none;
  box-shadow: 0 6px 0px #1e1e1e;
  text-decoration: none;
  transition: all 0.15s ease-in-out;
}

.store-btn--yellow {
  background-color: #fde68a;
}

.store-btn:hover {
  transform: translate(1px, 1px);
}

.store-btn:active {
  transform: translate(6px, 6px);
  box-shadow: 0px 0px 0px #1e1e1e;
}

.store-btn__icon {
  width: 45px;
  height: 45px;
}

.store-btn__info {
  display: flex;
  flex-direction: column;
}

.store-btn__sub {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.store-btn__main {
  font-size: 1.6rem;
  font-weight: 900;
  line-height: 1;
}

@media (max-width: 1024px) {
  .app-promo__content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .store-btn {
    width: 100%;
    max-width: 350px;
    justify-content: center;
  }
}

@media (max-width: 767px) {

  .app-promo__actions {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .app-promo__title {
    font-size: 2.2rem;
  }

  .app-promo__subtitle {
    font-size: 1.1rem;
  }
  .store-btn {
    padding: 12px 20px;
  }

  .store-btn__icon {
    width: 35px;
    height: 35px;
  }

  .store-btn__main {
    font-size: 1.3rem;
  }
  .app-promo__highlight {
    font-size: 28px;
  }
}
</style>