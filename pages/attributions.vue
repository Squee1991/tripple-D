<template>
  <div class="credits_wrapper">
    <div class="credits">
      <div class="credits_header">
        <button @click="router.back()" class="btn-icon-back" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="credits__title">{{ 'Credits' }}</div>
      </div>
      <div class="credits__content">
        <h1>Credits & Attributions</h1>
        <p class="intro-text">
          Below is the list of credits for the resources, technologies, and custom work used in {{ PROJECT }}.
        </p>
        <section class="section">
          <h2 class="section__title">🎨 Illustrations & Mascot</h2>
          <p class="section__paragraph">
            The application logo, mascot character, rank badges, and various custom illustrations were created by the
            designer.
          </p>
          <div class="designer-links">
            <a :href="designPortfolio" target="_blank" rel="noopener" class="credit-link">
              <span class="link-emoji">📂</span> View Portfolio
            </a>
            <a :href="designLinkLinkedIn" target="_blank" rel="noopener" class="credit-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"
                   class="link-icon">
                <path
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </section>
        <section class="section">
          <h2 class="section__title">🎙️ Audio & Voice Synthesis</h2>
          <p class="section__paragraph">
            German language audio and pronunciation are generated using the ElevenLabs text-to-speech API under a
            commercial license.
          </p>
        </section>
        <section class="section">
          <h2 class="section__title">✨ Interface Assets & AI Graphics</h2>
          <p class="section__paragraph">
            Interface icons and secondary graphic elements are sourced from Flaticon under a Premium License. Specific
            background images and supplementary assets were generated using AI tools.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue"
import {useRouter} from "vue-router"

const router = useRouter()
const {t} = useI18n()

const PROJECT = "SkillUpGerman"

const designLinkLinkedIn = ref('https://www.linkedin.com/in/verayorsh/?locale=en')
const designPortfolio = ref('https://yorshportfolio.tilda.ws/')
</script>

<style scoped>
.credits_wrapper {
  height: 100%;
  overflow: hidden;
}

.credits_header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
}

.credits {
  max-width: 1100px;
  margin: 0 auto;
  height: 100%;
  line-height: 1.75;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
}

.credits__content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 70px);
  padding: 0 15px 40px 15px;
  overflow-y: auto;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.credits__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  margin-bottom: 15px;
}

h1 {
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 8px;
}

.credits__title {
  color: var(--title);
  font-size: 23px;
  font-weight: 600;
  margin-left: 15px;
  text-shadow: 1px 1px var(--title);
}

.intro-text {
  font-size: 15px;
  opacity: 0.85;
  margin-bottom: 25px;
}

.section {
  margin-bottom: 25px;
}

.section__title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 10px;
}

.section__paragraph {
  font-size: 15px;
  margin-bottom: 10px;
}

.designer-links {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.credit-link {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #448dff;
  text-decoration: none;
  opacity: 0.9;
  padding: 2px;
  transition: opacity 0.2s;
  border-bottom: 1px solid #448dff;
}

.credit-link:hover {
  opacity: 1;
}

.link-emoji {
  margin-right: 6px;
  font-size: 20px;
  line-height: 1;
}

.link-icon {
  margin-right: 6px;
  flex-shrink: 0;
}
</style>