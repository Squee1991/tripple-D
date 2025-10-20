<script setup>
import { ref, onMounted, watch} from 'vue'
import { userAuthStore } from "~/store/authStore.js"
import Header from '../src/components/header.vue'
import Banner from '../src/components/baner.vue'
import Description from '../src/components/DescriptionBlock.vue'
import About from '../src/components/about.vue'
import FeedBack from '../src/components/feedBack.vue'
import Footer from '../src/components/footer.vue'
import VUid from '../src/components/V-uid.vue'
import VEventAvailableModal from "../src/components/V-eventAvailableModal.vue";
import { useHead, useSeoMeta } from '#imports'
const { public: { siteUrl } } = useRuntimeConfig()
const base = (siteUrl || '').replace(/\/$/, '')
const { t } = useI18n()
const canonical = useCanonical()
const pageTitle = t('metaMainPage.title')
const pageDesc  = t('metaMainPage.description')

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: canonical }],
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'German Corner',
      url: base + '/',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${base}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    })
  }]
})

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'website',
  ogUrl: canonical,
  ogImage: '/images/seo-main.png',
  robots: 'index, follow'
})

const authStore = userAuthStore()
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})
</script>

<template>
  <VEventAvailableModal @close="false" v-if="authStore.initialized"/>
  <div v-if="!hydrated || !authStore.initialized" class="loading"></div>
  <div v-else class="container">
    <Header/>
    <div v-if="authStore.uid" class="stat">
      <VUid/>
    </div>
    <div v-else>
      <Banner/>
      <Description/>
      <About/>
      <FeedBack/>
    </div>
    <Footer/>
  </div>

</template>

<style scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 10px;
}

.stat {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  height: 100%;
  flex-direction: column;
}

@media (max-width: 767px) {
  .stat {
    flex-direction: column;
    justify-content: center;
  }
}

.loading {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 10px;
}
</style>
