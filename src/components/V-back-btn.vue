<template>
  <button @click="path" class="btn__back"> {{ t('tenses.barBtn') }} </button>
</template>

<script setup>
   import { useRouter } from "vue-router";
   const { t } = useI18n();
   const router = useRouter();
   const path = () => {
     router.push('/')
   }


</script>

<style scoped>

.btn__back {
  border: 3px solid #1e1e1e;
  padding: 15px;
  background: #f1c40f;
  border-radius: 16px;
  cursor: pointer;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

@media  (max-width: 767px) {
  .btn__back {
    box-shadow: 2px 2px 2px #1e1e1e;
  }
}

</style>