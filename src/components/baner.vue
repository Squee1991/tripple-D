<template>
  <Overlay :visible="showAuth" @close="closeAuth"/>
  <transition name="slide">
    <SignIn v-if="showAuth" @success="closeAuth"/>
  </transition>
  <div class="banner">
    <section ref="bannerRef" class="banner__section">
      <div class="banner__wrapper">
        <div class="banner__content">
          <div class="banner__orbit">
                <span v-for="(word, index) in orbitWords"
                      :key="index"
                      class="banner__orbit-word"
                      :class="[ word.class,  {
                    'glow-black': glowType === word.type && word.type === 'der',
                    'glow-red': glowType === word.type && word.type === 'die',
                    'glow-gold': glowType === word.type && word.type === 'das',
                    'fade-glow': fadingGlow === word.type}]"
                >{{ word.text }}
                </span>
               <div>1111</div>
          </div>
          <h1 class="banner__title" v-once>{{ t('banner.title') }}</h1>
          <button class="banner__button" @click="startLearning" v-once>{{ t('banner.btn') }}</button>
        </div>
        <div ref="orbit" class="banner__mage-container" aria-hidden="true">
          <div class="banner__mage"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import SignIn from '../components/logIn.vue'
import Overlay from '../components/Uioverlay.vue'
import {gsap} from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger";
import SoundBtn from "../components/soundBtn.vue"

const orbitWords = [
  {text: 'Der', type: 'der', class: 'banner__orbit-word--der'},
  {text: 'Die', type: 'die', class: 'banner__orbit-word--die'},
  {text: 'Das', type: 'das', class: 'banner__orbit-word--das'}
]

gsap.registerPlugin(ScrollTrigger);
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {userAuthStore} from '../../store/authStore.js'
import {ref, watch} from "vue";

const {t} = useI18n()
const orbit = ref(null)
const showAuth = ref(false)
const userAuth = userAuthStore()
const router = useRouter()
const glowType = ref(null)
const fadingGlow = ref(null)
const bannerRef = ref(null);
const openAuth = () => {
  showAuth.value = true
}

const triggerGlow = (type) => {
  if (glowType.value || fadingGlow.value) return;
  glowType.value = type;
  setTimeout(() => {
    fadingGlow.value = type;
    glowType.value = null;
    setTimeout(() => {
      fadingGlow.value = null;
    }, 1000);
  }, 500);
}

const closeAuth = () => {
  showAuth.value = false
}

const startLearning = () => {
  userAuth.name ? router.push('/articles') : openAuth()
}

watch(showAuth, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
onMounted(() => {
  if (!bannerRef.value || !orbit.value) {
    return;
  }
  gsap.to(orbit.value, {
    rotation: 360,
    x: "100vw",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom top",
      scrub: true,
    }
  });
});
</script>


<style scoped>

.banner {
  font-family: "Nunito", sans-serif;
  overflow: hidden;
  font-weight: bold;
}

.banner__section {
  padding: 5rem 1rem 5rem 1rem;
}

.banner__wrapper {
  display: flex;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  justify-content: center;
  gap: 30px;
}

.banner__content {
  flex: 1;
  max-width: 650px;
}

.banner__orbit {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.banner__orbit-word {
  padding: 0.8rem 2rem;
  font-size: 1.8rem;
  font-weight: 400;
  border-radius: 16px;
  color: #1e1e1e;
  cursor: pointer;
  user-select: none;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

.banner__orbit-word:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.banner__orbit-word:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #1e1e1e;
}

.banner__orbit-word--der {
  background-color: #60a5fa;
}

.banner__orbit-word--die {
  background-color: #fca5a5;
}

.banner__orbit-word--das {
  background-color: #fde68a;
}

.banner__title {
  font-size: 3.2rem;
  font-weight: 400;
  color: var(--titleColor);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 2.5rem;
  text-wrap: balance;
}

.banner__button {
  font-family: "Nunito", sans-serif;
  padding: 1rem 2.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  border: 3px solid #1e1e1e;
  transition: all 0.1s ease-in-out;
  background-color: #4ade80;
  color: #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.banner__button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.banner__button:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #1e1e1e;
}

.banner__mage-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 450px;
  padding: 30px;
}

.banner__mage {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  background: none;
  padding: 20px;
  transform: rotate(-20deg);
}

.banner__mage::before, .banner__mage::after {
  content: '';
  position: absolute;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0px #1e1e1e;
  transition: all 0.3s ease;
}

.banner__mage::before {
  background: #f1c40f;
  width: 70%;
  height: 70%;
  border-radius: 24px;
  z-index: 1;
  top: 0;
  left: 0;
}

.banner__mage::after {
  width: 55%;
  height: 55%;
  background: #a855f7;
  border-radius: 24px;
  z-index: 2;
  bottom: 0;
  right: 0;
}

@media (max-width: 1023px) {
  .banner__title{
    font-size: 2rem;
  }
  .banner__mage-container {
    max-width: 350px;
  }
}

@media (max-width: 900px) {
  .banner__wrapper {
    flex-direction: column;
    text-align: center;
  }

  .banner__orbit {
    justify-content: center;
  }

  .banner__content {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .banner__mage-container {
    display: none;
  }
}

@media (max-width: 767px) {
  .banner__section {
    padding: 3rem 1.5rem;
  }

  .banner__title {
    font-size: 2rem;
  }

  .banner__orbit-word {
    font-size: 1.5rem;
    padding: 0.6rem 1.5rem;
    box-shadow: 2px 2px 0 #1e1e1e;
  }

  .banner__button {
    width: 80%;
    border-radius: 20px;
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}

@media (max-width: 500px) {
  .banner__button {
    width: 90%;
    padding: 10px;
  }
}
</style>