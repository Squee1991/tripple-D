<template>
  <div class="faq__section">
    <div class="btns__wrapper">
      <div v-for="btn in data" :key="btn.id" class="btn__container">
        <button @click="pathFunction(btn.path)" class="back__btn">
          {{ btn.text }}
        </button>
      </div>
    </div>
    <ClientOnly>
      <FeedBack/>
    </ClientOnly>
  </div>
</template>

<script setup>
import FeedBack from "~/src/components/feedBack.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useI18n } from "vue-i18n"



const router = useRouter();
const { t } = useI18n();

const data = ref([
  { id: 1, text: t('faq.btnBack'), path: '/' },
  { id: 2, text: t('cabinetAccordion.faq'), path: '/faq' },
])

const pathFunction = (pathValue) => {
  if (pathValue) {
    router.push(pathValue);
  }
}
</script>

<style scoped>
.faq__section {
  padding: 20px 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.btns__wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 25px;
}

.btn__container {
  width: 100%;
}

.back__btn {
  width: 100%;
  padding: 14px 20px;
  border-radius: 18px;
  font-family: "Nunito", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  box-shadow: 0 6px 0 #0d67c7;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back__btn:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #222532;
}

@media (min-width: 768px) {
  .faq__section {
    padding: 30px;
  }

  .btns__wrapper {
    flex-direction: row;
    justify-content: flex-start;
    gap: 20px;
  }

  .btn__container {
    width: auto;
  }

  .back__btn {
    min-width: 200px;
  }

  .back__btn:hover {
    background-color: #3e4358;
  }
}
</style>