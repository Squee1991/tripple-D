<template>
  <div class="speak__container">
    <header class="header">
      <VBackBtn/>
      <h1 class="header__title">{{ t('speakIndexPage.title')}}</h1>
      <button class="quiz__btn quiz__btn--info" @click="showDevModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
             stroke="orange" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
    </header>
    <VTransition>
      <div v-if="isMounted" class="speak__content-inner">
        <div class="speak__banner">
          <VBanner
              :text="t('speakIndexPage.bannerText')"
              :icon="SpeakIcon"
          />
        </div>
        <main class="categories-container">
          <div
              v-for="category in categories"
              :key="category.id"
              class="category-group"
          >
            <div class="category-group__header">
              <h2 class="category-group__title">{{ category.title }}</h2>
              <span class="category-group__counter">
                0/{{ category.themes.length }} <span class="check-icon"></span>
              </span>
            </div>
            <div class="themes-slider">
              <div
                  v-for="theme in category.themes"
                  :key="theme.id"
                  class="theme-card"
                  @click="goToSession(theme.id)"
              >
                <div v-if="speakStore.userProgress[theme.id]" class="card__check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="card__content">
                  <span class="card__icon">{{ theme.icon }}</span>
                  <span class="card__title">{{ theme.title }}</span>
                </div>
                <div class="card__action">
                  <div v-if="!speakStore.userProgress[theme.id]" class="card__progress-bar">
                    <div class="card__progress-fill" :style="{ width: '0%' }"></div>
                  </div>
                  <button
                      class="card__btn"
                      :class="{ 'card__btn--completed': speakStore.userProgress[theme.id] }"
                  >
                    {{ speakStore.userProgress[theme.id] ? t('locationQuests.repeat') : t('locationQuests.start') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </VTransition>
    <Modal
        @close="showDevModal = false"
        :visible="showDevModal"
        :title="t('speakIndexPage.modalTitle')"
        :img="SpeakingIcon"
        :text="t('speakIndexPage.modalText')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VBackBtn from "~/src/components/V-back-btn.vue";
import VBanner from "~/src/components/V-banner.vue";
import SpeakIcon from "../../assets/images/speakingIcon.svg";
import VTransition from "~/src/components/V-transition.vue";
import { useSpeakStore } from '../../store/speakStore.js';
import Modal from '../../src/components/modal.vue'
import SpeakingIcon from '../../assets/images/speakingIcon.svg'
const { t } = useI18n();
const router = useRouter();
const speakStore = useSpeakStore();
const isMounted = ref(false);
const showDevModal = ref(false);
const categories = [
  {
    id: 'society_lifestyle',
    title: t('speakTopics.speak'),
    themes: [
      { id: 'firstmeet', icon: '👋', title: t('speakThemes.firstmeet') },
      { id: 'acquaintance', icon: '👥', title: t('speakThemes.acquaintance') },
      { id: 'secondmeet', icon: '🤝', title: t('speakThemes.secondmeet') },
      { id: 'family_talk', icon: '👨‍👩‍👧‍👦', title: t('speakThemes.family_talk') },
      { id: 'weekend_plans', icon: '🗓️', title: t('speakThemes.weekend_plans') },
      { id: 'friend_call', icon: '📞', title: t('speakThemes.friend_call') },
      { id: 'hobby_talk', icon: '🎨', title: t('speakThemes.hobby_talk') },
      { id: 'party_talk', icon: '🥳', title: t('speakThemes.party_talk') },
    ]
  },
  {
    id: 'food_services',
    title: t('speakTopics.food'),
    themes: [
      { id: 'cafe_order', icon: '☕', title: t('speakThemes.cafe_order') },
      { id: 'restaurant_dinner', icon: '🍽️', title: t('speakThemes.restaurant_dinner') },
      { id: 'store_checkout', icon: '🛒', title: t('speakThemes.store_checkout') },
      { id: 'order_eat', icon: '🛵', title: t('speakThemes.order_eat') },
      { id: 'consultation_talk', icon: '💬', title: t('speakThemes.consultation_talk') }
    ]
  },
  {
    id: 'travel_transport',
    title: t('speakTopics.transport'),
    themes: [
      { id: 'train_station', icon: '🚉', title: t('speakThemes.train_station') },
      { id: 'train_ticket', icon: '🎫', title: t('speakThemes.train_ticket') },
      { id: 'taxi_berlin', icon: '🚖', title: t('speakThemes.taxi_berlin') },
      { id: 'bus_talk', icon: '🚖', title: t('speakThemes.bus_talk') },
      { id: 'hotel_checkin', icon: '🏨', title: t('speakThemes.hotel_checkin') },
      { id: 'border_check', icon: '🛂', title: t('speakThemes.border_check') },
      { id: 'airport_talk', icon: '✈️', title: t('speakThemes.airport_talk') },
      { id: 'info_talk', icon: 'ℹ️', title: t('speakThemes.info_talk') }
    ]
  },
  {
    id: 'city_life',
    title: t('speakTopics.city'),
    themes: [
      { id: 'bank_account', icon: '💳', title: t('speakThemes.bank_account') },
      { id: 'apartment_rent', icon: '🏠', title: t('speakThemes.apartment_rent') },
      { id: 'clothes_shopping', icon: '🛍️', title: t('speakThemes.clothes_shopping') },
      { id: 'shopping', icon: '📦', title: t('speakThemes.shopping') },
      { id: 'post_office', icon: '📮', title: t('speakThemes.post_office') },
      { id: 'police_talk', icon: '👮', title: t('speakThemes.police_talk') },
      { id: 'barbershop', icon: '💈', title: t('speakThemes.barbershop') }
    ]
  },
  {
    id: 'health',
    title: t('speakTopics.health'),
    themes: [
      { id: 'doctor_visit', icon: '🩺', title: t('speakThemes.doctor_visit') },
      { id: 'pharmacy_vitamins', icon: '💊', title: t('speakThemes.pharmacy_vitamins') },
      { id: 'insurance', icon: '📄', title: t('speakThemes.insurance') },
      { id: 'at_doctor', icon: '🏥', title: t('speakThemes.at_doctor') },
      { id: 'dentist', icon: '🦷', title: t('speakThemes.dentist') },
      { id: 'veterinary', icon: '🐾', title: t('speakThemes.veterinary') }
    ]
  },
  {
    id: 'work_career',
    title: t('speakTopics.work'),
    themes: [
      { id: 'job_looking', icon: '🔍', title: t('speakThemes.job_looking') },
      { id: 'job_interview', icon: '📋', title: t('speakThemes.job_interview') },
      { id: 'bos_talk', icon: '💼', title: t('speakThemes.bos_talk') },
      { id: 'vacation', icon: '🏖️', title: t('speakThemes.vacation') },
      { id: 'salary_talk', icon: '💰', title: t('speakThemes.salary_talk') },
      { id: 'dismissal_talk', icon: '🚪', title: t('speakThemes.dismissal_talk') },
    ]
  }
];

const goToSession = (themeId) => {
  router.push({ path: '/speak-practice/session', query: { theme: themeId } });
};

onMounted(() => {
  speakStore.loadUserProgress();
  setTimeout(() => {
    isMounted.value = true;
  }, 90);
});

</script>

<style scoped>
.speak__container {
  max-width: 1240px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
}

.header {
  padding: 5px 10px 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quiz__btn {
  background: #fff;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  transition: all 0.1s;
}

.quiz__btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.header__title {
  font-size: 23px;
  margin-left: 15px;
  font-weight: bold;
  color: var(--title);
  text-shadow: 1px 1px var(--title);
}

.speak__banner {
  padding: 0 15px;
  width: 100%;
}

.speak__content-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 100px;
}

.categories-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 20px 0;
}

.category-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.category-group__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 12px;
}

.category-group__title {
  font-size: 18px;
  font-weight: bold;
  color: var(--title);
}

.category-group__counter {
  font-size: 14px;
  font-weight: bold;
  color: var(--title);
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 1px;
}

.check-icon {
  color: #58cc02;
}

.themes-slider {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 5px 20px 15px 20px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.themes-slider::-webkit-scrollbar {
  display: none;
}
.themes-slider {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.theme-card {
  position: relative;
  flex: 0 0 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 6px 0 var(--tabsSlideBorderColor);
}

.theme-card:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 var(--tabsSlideBorderColor);
}
.theme-card:active .card__btn {
  transform: translateY(2px);
  box-shadow: 0 2px 0 transparent;
}

.card__check {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #58cc02;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.card__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.card__icon {
  font-size: 34px;
}

.card__title {
  font-size: 14px;
  font-weight: bold;
  color: var(--title);
  line-height: 1.2;
  text-align: center;
}

.card__action {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card__progress-bar {
  width: 100%;
  height: 6px;
  background: var(--tabsSlideBorderColor);
  border-radius: 10px;
  overflow: hidden;
  opacity: 0.5;
}

.card__progress-fill {
  height: 100%;
  background: #ffc800;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.card__btn {
  width: 100%;
  padding: 8px 0;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  color: #fff;
  background-color: #58cc02;
  box-shadow: 0 4px 0 #58a700;
  transition: all 0.2s ease;
  pointer-events: none;
}

.card__btn--completed {
  background-color: #1cb0f6;
  box-shadow: 0 4px 0 #1899d6;
}
</style>