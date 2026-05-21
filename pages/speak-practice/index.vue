<template>
  <div class="speak__container">
    <header class="header">
      <VBackBtn/>
      <h1 class="header__title">Разговорная практика</h1>
    </header>
    <VTransition>
      <div v-if="isMounted" class="speak__content-inner">
        <div class="speak__banner">
          <VBanner
              text="Отрабатывай навыки развития речи на реальных примерах"
              :icon="SpeakIcon"
          />
        </div>
        <main class="themes-list">
          <div
              v-for="theme in themes"
              :key="theme.id"
              class="theme-card"
              @click="goToSession(theme.id)"
          >
            <div class="card__content">
              <span class="card__icon"> {{ theme.icon}}</span>
              <span class="card__title">{{ theme.title }}</span>
            </div>
            <VArrowNav/>
          </div>
        </main>
      </div>
    </VTransition>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import VBackBtn from "~/src/components/V-back-btn.vue";
import VArrowNav from "~/src/components/V-arrowNav.vue";
import VBanner from "~/src/components/V-banner.vue";
import SpeakIcon from "../../assets/images/speakingIcon.svg";
import VTransition from "~/src/components/V-transition.vue";

const router = useRouter();
const isMounted = ref(false)
const themes = [
  { id: 'firstmeet', icon: '👋', title: 'Знакомство', description: '' },
  { id: 'secondmeet', icon: '🤝', title: 'Вторая встреча', description: '' },
  { id: 'cafe_order', icon: '☕', title: 'Заказ кофе', description: '' },
  { id: 'family_talk', icon: '👨‍👩‍👧‍👦', title: 'Беседа семья', description: '' },
  { id: 'train_station', icon: '🚉', title: 'На вокзале', description: '' },
  { id: 'train_ticket', icon: '🎫', title: 'Проверка билета', description: '' },
  { id: 'taxi_berlin', icon: '🚖', title: 'Такси', description: '' },
  { id: 'hotel_checkin', icon: '🏨', title: 'Отель', description: '' },
  { id: 'restaurant_dinner', icon: '🍽️', title: 'Ресторан', description: '' },
  { id: 'apartment_rent', icon: '🏠', title: 'Аренда квартиры', description: '' },
  { id: 'doctor_visit', icon: '🩺', title: 'Запись к врачу', description: '' },
  { id: 'library_visit', icon: '📚', title: 'В библиотеке', description: '' },
  { id: 'job_looking', icon: '🔍', title: 'Поиск работы', description: '' },
  { id: 'job_interview', icon: '📋', title: 'Интервью на работу', description: '' },
  { id: 'weekend_plans', icon: '🗓️', title: 'Планы на выходные', description: '' },
  { id: 'bos_talk', icon: '👔', title: 'Разговор с начальником', description: '' },
  { id: 'clothes_shopping', icon: '🛍️', title: 'Покупки', description: '' },
  { id: 'pharmacy_vitamins', icon: '⚕️', title: 'Аптека', description: '' },
  { id: 'post_office', icon: '📮', title: 'Почта', description: '' },
  { id: 'bank_account', icon: '💳', title: 'Банковский счет', description: '' }
];

const goToSession = (themeId) => {
  router.push({ path: '/speak-practice/session', query: { theme: themeId } });
};

onMounted(()=>{
  setTimeout(()=>{
    isMounted.value = true;
  }, 120)
})
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
}

.speak__banner {
  padding: 0 15px;
}

.header__title {
  font-size: 23px;
  margin-left: 15px;
  font-weight: bold;
  color: var(--title);
  text-shadow: 1px 1px var(--title);
}

.themes-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 15px;
}

.speak__content-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 100px;
}

.theme-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
}

.card__content {
  display: flex;
  align-items: center;
}

.card__icon {
  font-size: 28px;
}

.card__title {
  font-size: 15px;
  font-weight: bold;
  margin-left: 15px;
  color: var(--title);
}

</style>