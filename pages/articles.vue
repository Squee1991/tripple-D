<template>
  <main class="theory-main">
    <section class="theory-hero">
      <div class="theory-hero-content">
        <h1 class="theory-title">
          {{ t('examples.label') }}
          <span class="theory-title-accent der">Der</span>
          <span class="theory-title-accent die">Die</span>
          <span class="theory-title-accent das">Das</span>
        </h1>
        <p class="theory-subtitle">
          {{ t('examples.title') }}
        </p>
      </div>
    </section>
    <section id="start-theory" class="theory-sections">
      <article class="theory-card" id="intro" ref="theoryCards">
        <h2 class="theory-card-title"> {{ t('examplesFirstBlock.title') }}</h2>
        <p class="theory-card-text">
          {{ t('examplesFirstBlock.subtext') }}
        </p>
      </article>
      <article class="theory-card" id="types" ref="theoryCards">
        <h2 class="theory-card-title">{{ t('examplesSecondBlock.title') }}</h2>
        <ul class="theory-list">
          <li v-for="item in data.items" :key="item.id" class="theory-list-item">
            <span class="list-item-title">{{ t(item.itemTitle) }}</span>: <i>{{ item.article }}</i><br>
            <span class="theory-desc">
                     {{ t(item.itemInfo) }}<br>
                     <span class="theory-example">{{ t(item.example) }} <b>{{ t(item.art) }}</b> Katze schläft. <b></b> {{ t(item.partTwo) }}</span>
                  </span>
          </li>
        </ul>
      </article>
      <article class="theory-card" id="indefinite-article" ref="theoryCards">
        <h2 class="theory-card-title">{{ t('exampleThirdBlock.label') }}</h2>
        <p class="theory-card-text">{{ t('exampleThirdBlock.subtext') }}</p>
        <ul class="theory-list">
          <li v-for="item in data.itemSecond" :key="item.id" class="theory-list-item">
            <span class="list-item-title"> {{ t(item.value) }} <b> {{ t(item.article) }}</b></span>
            <span
                class="theory-example"> {{ t(item.example) }} <b> {{ t(item.word) }}</b> {{ t(item.sexExample) }}</span>
          </li>
        </ul>
        <div class="theory-card-text">
          <span class="theory__important"> {{ t('exampleThirdBlock.important') }}</span>
          <div class="example-line">- Ich sehe Bücher</div>
        </div>
      </article>
      <article class="theory-card" id="table" ref="theoryCards">
        <h2 class="theory-card-title">{{ t('exampleTabele.label') }}</h2>
        <div class="table-wrapper">
          <table class="theory-table">
            <thead class="theory-table-head">
            <tr class="theory-table-row">
              <th class="theory-table-cell">{{ t('exampleTabele.family') }}</th>
              <th class="theory-table-cell">{{ t('exampleTabele.definite') }}</th>
              <th class="theory-table-cell">{{ t('exampleTabele.NotDefinite') }}</th>
            </tr>
            </thead>
            <tbody class="theory-table-body">
            <tr v-for="tr in data.tabele" :key="tr.id" class="theory-table-row">
              <td class="theory-table-cell">{{ t(tr.sex) }}</td>
              <td class="theory-table-cell article-cell">{{ t(tr.article) }}</td>
              <td class="theory-table-cell article-cell">{{ t(tr.notDefiniteArticle) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  </main>
</template>
<script setup>
import { useHead, useSeoMeta} from '#imports'
const {t} = useI18n();
const canonical = useCanonical()
const pageTitle = t('metaArticles.title')
const pageDesc  = t('metaArticles.description')
useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: canonical }]
})
useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'article',
  ogUrl: canonical,
  ogImage: '/images/seo-articles.png',
  robots: 'index, follow'
})

const data = {
  items: [
    {
      id: 1,
      itemTitle: "examplesSecondBlock.first",
      itemInfo: "examplesSecondBlock.exampleTitle",
      example: "examplesSecondBlock.example",
      partTwo: "examplesSecondBlock.exampleSecondhalf",
      article: "der , die, das",
      art: 'die'
    },
    {
      id: 2,
      itemTitle: "examplesSecondBlock.second",
      itemInfo: "examplesSecondBlock.exampleSecondTitle",
      example: "examplesSecondBlock.example",
      partTwo: "examplesSecondBlock.exampleNotDefinite",
      article: "ein , eine, ein",
      art: 'eine'

    },
  ],
  itemSecond: [
    {
      id: 1,
      value: "exampleThirdBlock.man",
      example: "exampleThirdBlock.mExample",
      sexExample: "exampleThirdBlock.mExample",
      article: "ein",
      word: "Hund"
    },
    {
      id: 2,
      value: "exampleThirdBlock.woman",
      example: "examplesSecondBlock.example",
      sexExample: "exampleThirdBlock.wExample",
      article: "eine",
      word: "Lampe"

    },
    {
      id: 3,
      value: "exampleThirdBlock.is",
      example: "examplesSecondBlock.example",
      sexExample: "exampleThirdBlock.isExample",
      article: "ein",
      word: "Buch"
    },
  ],
  tabele: [
    {id: 1, sex: "exampleTabele.m", article: "der", notDefiniteArticle: "ein"},
    {id: 2, sex: "exampleTabele.w", article: "die", notDefiniteArticle: "eine"},
    {id: 3, sex: "exampleTabele.is", article: "das", notDefiniteArticle: "ein"},
  ]
};

definePageMeta({
  layout: 'footerlayout',
});
</script>
<style scoped>

.theory-main {
  min-height: 100vh;
  padding-bottom: 64px;
  font-family: 'Inter', sans-serif;
}

.theory-hero {
  padding: 70px 1.5rem 40px 1.5rem;
  text-align: center;
}

.theory-hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.theory-title {
  font-family: "Nunito", sans-serif;
  font-size: 2.8rem;
  font-weight: 600;
  color: white;
  background: #f97028;
  padding: 1rem 2rem;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  transform: rotate(1deg);
  box-shadow: 8px 8px 0px #1e1e1e;
}

.theory-title-accent {
  font-weight: 900;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.theory-title-accent.der {
  color: #60a5fa;
}

.theory-title-accent.die {
  color: #f87171;
}

.theory-title-accent.das {
  color: #facc15;
}

.theory-subtitle {
  font-size: 1.25rem;
  color: var(--titleColor);
  max-width: 600px;
  line-height: 1.6;
  margin: 20px;
}

.theory-sections {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem 0 1.5rem;
}

.theory-card {
  background: #fff;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0px #1e1e1e;
  padding: 2rem;
  transition: all 0.2s ease-in-out;
}


.theory-card-title {
  font-family: "Nunito", sans-serif;
  font-size: 1.8rem;
  color: #1e1e1e;
  margin-bottom: 1rem;
}

.theory-card-text {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.theory-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.theory-list:nth-last-child(2) {
  margin-bottom: 20px;
}

.theory-list-item {
  font-size: 1.1rem;
  line-height: 1.6;
  border-left: 4px solid #fca13a;
  padding-left: 1rem;
}

.list-item-title {
  font-weight: 700;
  color: #1e1e1e;
}

.theory-desc, .theory-example {
  font-size: 1rem;
  color: #555;
  margin-top: 0.25rem;
}

.theory-example {
  opacity: 0.8;
  font-style: italic;
}

.theory__important {
  font-weight: 700;
  font-size: 1.2rem;
  color: #fca13a;
  margin-top: 10px;
}

.example-line {
  margin-top: 1rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  padding: 0.75rem;
  border-radius: 12px;
  font-family: monospace;
}

.table-wrapper {
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.theory-table {
  width: 100%;
  border-collapse: collapse;
}

.theory-table-cell {
  border: 2px solid #1e1e1e;
  padding: 0.75rem 1rem;
  font-size: 1.05rem;
  text-align: center;
  background-color: #fff;
}

.theory-table-cell.article-cell {
  font-family: "Nunito", sans-serif;
  font-size: 1.2rem;
}

.theory-table-head .theory-table-cell {
  background: #60a5fa;
  color: #ffffff;
  font-family: "Nunito", sans-serif;
  font-size: 1.2rem;
}

@media (max-width: 767px) {
  .theory-title {
    transform: rotate(0deg);
    box-shadow: 3px 3px 0 #1e1e1e;
    padding: 10px;
    font-size: 1.5rem;
    width: 100%;
  }

  .theory-subtitle {
    font-size: 1.1rem;
  }

  .theory-card {
    box-shadow: 3px 3px 0 #1e1e1e;
    padding: 15px;
  }

  .theory-hero {
    padding: 15px;
  }

  .theory-card-title {
    font-size: 1.5rem;
  }
  .theory-table-cell {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .theory-card-text {
    font-size: 1rem ;
  }
}


</style>