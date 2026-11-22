<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { userAuthStore } from "~/store/authStore.js"
import Header from '../src/components/header.vue'
import Banner from '../src/components/banner.vue'
import Description from '../src/components/DescriptionBlock.vue'
import About from '../src/components/about.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import VUid from '../src/components/V-uid.vue'
import VEventAvailableModal from "../src/components/V-eventAvailableModal.vue";
import VShowFall from "../src/components/V-showFall.vue";
import Snow from "../assets/images/mery-christmas/Snow.svg";
import HeartFall from "assets/images/mery-christmas/heartFall.svg";
import VHalloweenEffects from "../src/components/V-halloweenEffects.vue";
import VWinterEffects from "../src/components/V-winterEffects.vue";
import LeafOrange from "../assets/images/halloween-effects/leafOrange.svg";
import LeafGold from "../assets/images/halloween-effects/leafGold.svg";
import { useEventSessionStore } from '../store/eventsStore.js'
import VStartPage from "~/src/components/V-startPage.vue";
import VAppBanner from "~/src/components/V-appBanner.vue";
import VHedgehogGuide from "~/src/components/V-hedgehogGuide.vue";
import { useUiSettingsStore } from '~/store/uiSettingsStore.js'
import VLevelPicker from "~/src/components/V-levelPicker.vue";
import VSiteFooter from "~/src/components/V-siteFooter.vue";


const showLogin = ref(false)
const eventStore = useEventSessionStore()
const authStore = userAuthStore()
const uiSettings = useUiSettingsStore()
const hydrated = ref(false)
const isLocallyLogged = ref(false)
const colorMode = useColorMode()
// Вошёл ли пользователь, с учётом гидрации: до монтирования страница такая же, как с сервера (гостевая)
const isAuthed = computed(() => hydrated.value && !!authStore.uid)

// Эффекты Хэллоуина — только на главной после входа:
// пока идёт его событие (в любой теме) или включена купленная тема
// Уровень спрашиваем один раз у каждого вошедшего, у кого его ещё нет (и у старых пользователей).
// Пока не выбрал, модалку ивента не показываем, а за ней ждёт и модалка марафона (app.vue)
const needsLevel = computed(() => hydrated.value && authStore.initialized && !!authStore.uid && !authStore.germanLevel)
const showLevelPicker = ref(false)
watch(needsLevel, (need) => {
  if (need) showLevelPicker.value = true
}, { immediate: true })

const isHalloweenFx = computed(() =>
    !!authStore.uid && (colorMode.value === 'orange' || eventStore.isEventActive('pumpkin'))
)

// html.halloween-fx делает фон body прозрачным, чтобы было видно эффекты под контентом
watch(isHalloweenFx, (on) => {
  if (process.client) document.documentElement.classList.toggle('halloween-fx', on)
}, { immediate: true })

// Зимнее оформление главной: только после входа и пока идёт зимний ивент
const isWinterFx = computed(() => !!authStore.uid && !isHalloweenFx.value && eventStore.isEventActive('winter'))

watch(isWinterFx, (on) => {
  if (process.client) document.documentElement.classList.toggle('winter-fx', on)
}, { immediate: true })

onBeforeUnmount(() => {
  document.documentElement.classList.remove('halloween-fx', 'winter-fx')
})

definePageMeta({
  layout: 'footerlayout'
})

onMounted(() => {
  hydrated.value = true
  isLocallyLogged.value = localStorage.getItem('app_user_logged') === 'true'
  // вышли на другой странице и пришли сюда: класс из head больше не нужен
  if (authStore.initialized && !authStore.uid) document.documentElement.classList.remove('is-logged')
})

// До отрисовки прячем серверный лендинг у тех, кто уже входил, чтобы он не мелькал до загрузки аккаунта
useHead({
  script: [{
    key: 'landing-logged-flag',
    tagPosition: 'head',
    innerHTML: "try{if(localStorage.getItem('app_user_logged')==='true')document.documentElement.classList.add('is-logged')}catch(e){}"
  }]
})

watch(() => authStore.uid, (newUid) => {
  if (newUid) {
    localStorage.setItem('app_user_logged', 'true')
    isLocallyLogged.value = true
  } else if (authStore.initialized && !newUid) {
    localStorage.removeItem('app_user_logged')
    isLocallyLogged.value = false
    // вход не подтвердился: показываем лендинг
    if (process.client) document.documentElement.classList.remove('is-logged')
  }
})
</script>

<template>
  <VLevelPicker v-model="showLevelPicker" mode="onboarding"/>
  <VEventAvailableModal @close="false" v-if="hydrated && authStore.initialized && !needsLevel"/>
  <VShowFall v-if="hydrated && eventStore.isSnowEnabled" :image="Snow"/>
  <ClientOnly>
    <template v-if="isHalloweenFx">
      <div class="halloween-layer halloween-layer--back" aria-hidden="true">
        <VHalloweenEffects layer="back"/>
        <VShowFall :image="LeafOrange" :count="3"/>
        <VShowFall :image="LeafGold" :count="2"/>
      </div>
      <div class="halloween-layer" aria-hidden="true">
        <VHalloweenEffects/>
      </div>
    </template>
    <template v-if="isWinterFx">
      <div class="halloween-layer halloween-layer--back" aria-hidden="true">
        <VWinterEffects/>
      </div>
    </template>
  </ClientOnly>
  <div class="container">
    <ClientOnly>
      <template v-if="authStore.uid">
        <div class="stat">
          <Header/>
          <VUid/>
          <Footer/>
        </div>
        <VHedgehogGuide v-if="uiSettings.hedgehogGuideEnabled"/>
      </template>
    </ClientOnly>
    <!-- Лендинг рендерится и на сервере (SSR для '/'), чтобы боты и проверка Google видели описание сайта.
         Вошедшим он не мелькает: скрипт в head прячет его по флагу app_user_logged -->
    <div v-if="!isAuthed" class="landing">
      <Header/>
      <Banner/>
      <Description/>
      <About/>
      <!--      <VAppBanner/>-->
      <FeedBack/>
    </div>
  </div>
  <!-- Футер на всю ширину, поэтому вне .container -->
  <VSiteFooter v-if="!isAuthed" class="landing"/>
</template>

<style scoped>
/* Эффекты поверх контента главной (клики проходят насквозь), но ниже меню и модалок */
:global(html.is-logged .landing) {
  display: none;
}

.halloween-layer {
  position: fixed;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

/* листья, звёзды и нижняя паутина — за элементами главной */
.halloween-layer--back {
  z-index: -1;
}

.container {
  max-width: 1240px;
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 0 10px;

}

.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}

.stat::after{
  content: "";
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  background: var(--overlayAfter);
}

@media (max-width: 767px) {
  .stat {
    flex-direction: column;
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 0;
  }
}
</style>