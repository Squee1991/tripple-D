<template>
  <div class="faq__section">
    <div class="btns__wrapper">
      <div v-for="btn in data" :key="btn.id">
        <button @click="pathFunction(btn.path)" class="back__btn"> {{ btn.text }}</button>
      </div>
    </div>
    <FeedBack/>
  </div>
</template>

<script setup>

import FeedBack from "~/src/components/feedBack.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { t } = useI18n();
const data = ref([
  {id: 1, text: t('faq.btnBack') , path: '/'},
  {id: 2, text: t('cabinetAccordion.faq') , path: '/faq'},
])

const pathFunction = (pathValue) => {
   if (pathValue) {
     router.push(pathValue);
   }
}

</script>

<style scoped>
.back__btn {
  padding: 10px 15px;
  border-radius: 15px;
  font-family: "Nunito", sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  background: #007bff;
  color: white;
  border: 2px solid black;
  box-shadow: 3px 3px 3px #000;
  cursor: pointer;
  transition: .3s;
}

.btns__wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.faq__section {
  padding: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1023px) {
  .back__btn:hover {
    background: #1960ad;
    transition: .3s;
  }
}

@media (max-width: 480px){
  .btns__wrapper {
    flex-direction: column;
    justify-content: space-between;
  }
  .back__btn {
    width: 100%;
  }
}
</style>