<template>
  <div class="articles-box">
    <div class="articles__wrapper">
<!--      <VBanner-->
<!--          :text="t('newsTitleBanner.title')"-->
<!--          :icon="News"-->
<!--      />-->
      <div class="welcome-character-block">
        <div class="character-avatar">
          <span class="avatar-emoji">
            <img class="avatar-emoji__icon" src="../../assets/images/AuthIcon.svg" alt="">
          </span>
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="speech-bubble">
          <p class="bubble-text">
            {{ t('news.welcomeMessage', 'Привет! Каждый день Skillupgerman публикует здесь  интересные новости о немецком языке. Учись с удовольствием!') }}
          </p>
        </div>
      </div>
      <div v-for="article in articles" :key="article.id" class="article-card">
        <div class="article-header">
          <span class="badge">{{ t(article.badge) }}</span>
        </div>
        <h3 :class="['article-title', article.colorClass]">
          {{ t(article.title) }}
        </h3>
        <div class="article-body">
          <p v-for="(paragraph, index) in article.paragraphs" :key="index">
            {{ t(paragraph) }}
          </p>
          <p class="cta">{{ t(article.cta) }}</p>
        </div>
        <div class="article-footer">
          <div class="reactions-wrapper">
            <div class="added-reactions-list">
              <div class="emoji-picker-container">
                <button
                    @click="togglePicker(article.id)"
                    :class="['plus-btn', { 'is-open': activePicker === article.id }]"
                >
                  <span class="icon">➕</span>
                </button>
                <div v-if="activePicker === article.id" class="emoji-picker">
                  <button
                      v-for="emoji in emojiList"
                      :key="emoji"
                      @click="handleReaction(article.id, emoji)"
                      class="emoji-item"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>
              <template v-for="(count, emoji) in getArticleReactions(article.id)" :key="emoji">
                <button
                    v-if="count > 0"
                    @click="handleReaction(article.id, emoji)"
                    :class="['like-btn is-active-reaction', { 'user-liked': hasUserLiked(article.id, emoji) }]"
                >
                  <span class="icon">{{ emoji }}</span>
                  <span class="count">{{ count }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { articlesData } from '../../utils/articlesData.js'
import { useReactionsStore } from '~/store/reactionsStore.js'
import { userAuthStore } from '~/store/authStore.js'
import VBanner from "~/src/components/V-banner.vue"
import News from "../../assets/images/news.svg"

const { t } = useI18n()
const colorClasses = ['theme-blue', 'theme-pink', 'theme-green', 'theme-orange', 'theme-red']

const articles = ref(articlesData.map(article => ({
  ...article,
  colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)]
})))

const reactionsStore = useReactionsStore()
const authStore = userAuthStore()
const emojiList = ['🔥', '🥳', '💯', '👍']
const activePicker = ref(null)

const togglePicker = (articleId) => {
  activePicker.value = activePicker.value === articleId ? null : articleId
}

const handleReaction = (articleId, emoji) => {
  reactionsStore.addReaction(articleId, emoji)
  activePicker.value = null
}

const getArticleReactions = (articleId) => {
  if (!reactionsStore.articlesReactions?.stats) return {}
  return reactionsStore.articlesReactions.stats[articleId] || {}
}

const hasUserLiked = (articleId, emoji) => {
  const userId = authStore.uid
  if (!userId || !reactionsStore.articlesReactions?.users) return false
  const userLikes = reactionsStore.articlesReactions.users[userId]?.[articleId] || []
  return userLikes.includes(emoji)
}

onMounted(() => {
  reactionsStore.loadAllReactions()
})
</script>

<style scoped>


.theme-blue   { --title-bg: #4d61e3; --title-shadow: #4a5bc0; }
.theme-pink   { --title-bg: #e34db1; --title-shadow: #a12a7b; }
.theme-green  { --title-bg: #00bfa5; --title-shadow: #007b6b; }
.theme-orange { --title-bg: #ff9100; --title-shadow: #b26500; }
.theme-red    { --title-bg: #f50057; --title-shadow: #ab003c; }

.articles__wrapper {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 144px;
}

.welcome-character-block {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin: 20px 8px 24px 8px;
  font-family: 'Nunito', sans-serif;
  animation: fadeIn 0.4s ease-out;
}

.character-avatar {
  position: relative;
  width: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.speech-bubble {
  position: relative;
  background: linear-gradient(145deg, rgb(0, 194, 255), rgb(0, 168, 219)) rgb(0, 194, 255);
  color: white;
  border-radius: 18px;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 6px 0 rgb(0, 160, 220);
  border: none;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: 36px;
  left: -111px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  z-index: 2;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 35px;
  left: -10px;
  width: 0;
  height: 0;
  border-top: 11px solid transparent;
  border-right: 11px solid #0fb2f1;
  border-bottom: 11px solid transparent;
  z-index: 1;
}

.bubble-text {
  margin: 0;
}

.article-card {
  background-color: var(--menuItemsBg);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 18px;
  color: #ffffff;
  font-family: Nunito, sans-serif;
  box-shadow: 0 6px 1px var(--tabsSlideBorderColor);
  animation: fadeIn 0.3s ease-out;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.badge {
  background: rgba(77, 97, 227, 0.15);
  color: #5c6fff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.article-title {
  background-color: var(--title-bg, #4d61e3);
  color: #ffffff;
  width: 100%;
  font-size: 18px;
  font-weight: 800;
  padding: 12px 16px;
  margin: 0 0 16px 0;
  border-radius: 14px;
  min-height: 58px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 0 var(--title-shadow, #2a3aa1),
  0 6px 10px rgba(0, 0, 0, 0.15);
}

.article-body {
  color: var(--title);
  font-size: 15px;
  line-height: 1.6;
  font-weight: 600;
}

.article-body p {
  margin: 0 0 12px 0;
}

.cta {
  margin-top: 16px !important;
  font-weight: 800;
  color: #5c6fff;
  font-size: 16px;
}

/* =========================================
   РЕАКЦИИ И КНОПКИ
========================================= */
.article-footer {
  margin-top: 20px;
  border-top: 2px dashed rgba(255, 255, 255, 0.05);
  padding-top: 16px;
}

.reactions-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.added-reactions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.like-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 14px;
  padding: 6px 14px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 40px;
}

.like-btn:active, .plus-btn:active {
  transform: scale(0.92) translateY(2px);
}

.user-liked {
  border: 2px solid #5c6fff;
  background: rgba(92, 111, 255, 0.15);
}

.like-btn.is-active-reaction {
  background: rgba(92, 111, 255, 0.1);
  color: #5c6fff;
}

.plus-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.plus-btn.is-open {
  background: #5c6fff;
  transform: rotate(45deg);
  box-shadow: 0 4px 12px rgba(92, 111, 255, 0.4);
}

/* =========================================
   МЕНЮ ВЫБОРА ЭМОДЗИ
========================================= */
.emoji-picker-container {
  position: relative;
  display: block;
}

.icon {
  font-size: 18px;
}

.emoji-picker {
  position: absolute;
  bottom: 50px;
  left: 0;
  background: var(--menuItemsBg, #252b3e);
  border: 2px solid var(--tabsSlideBorderColor, #3b4257);
  border-radius: 18px;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  width: max-content;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
  animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.emoji-item {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.emoji-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.8) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>