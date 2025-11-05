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
  display: block;
  width: 100%;
  border: 3px solid #1e1e1e;
  margin-bottom: 2rem;
  padding: 0.8rem;
  background: #f1c40f;
  border-radius: 12px;
  cursor: pointer;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  box-shadow: 3px 3px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

@media  (max-width: 767px) {
  .btn__back {
    box-shadow: 2px 2px 2px #1e1e1e;
  }
}

@media (min-width: 1024px) {
  .btn__back:hover {
    transform: translate(2px , 2px);
    box-shadow: 1px 1px 0px #1e1e1e;
  }
}

</style>