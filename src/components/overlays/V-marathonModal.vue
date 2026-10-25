<template>
  <div v-if="isOpen" class="overlay" @click.self="closeModal">
    <div class="marathon__container">
      <img class="image" src="~/assets/images/MarathoModalImage.png" alt="MarathonImage">
      <div class="marathon__text">
        {{ t('marathonModal.text')}}
      </div>
      <button @click="pathRouter" class="custom-button">
        {{ t('locationQuests.start')}}
        <span class="button-flare"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();
const isOpen = defineModel({
  type: Boolean,
  default: false
});

const closeModal = () => {
  isOpen.value = false;
};

const pathRouter = () => {
  closeModal();
  router.push('/article-marathon');
};

</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 0.84);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.marathon__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  position: relative;
}

.image {
  width: 100%;
  max-width: 400px;
  height: auto;
  display: block;
  object-fit: contain;
}


.marathon__text {
  position: absolute;
  bottom: 68px;
  left: 36px;
  right: 36px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
  pointer-events: none;
  z-index: 2;
}

.custom-button {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 50px;
  cursor: pointer;
  border: 4px solid transparent;
  padding: 12px 22px;
  font-size: 16px;
  width: 230px;
  max-width: 240px;
  bottom: 0;
  font-weight: 700;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  background: linear-gradient(180deg, #7fe229 0%, #68c71e 60%, #48a614 100%) padding-box,
  linear-gradient(180deg, #d8ffb6 0%, #7fe229 30%, #36ad11 70%, #035100 100%) border-box;
}

.custom-button::before {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 4px;
  border-radius: 50%;
  background: #ffffff;
  transform: rotate(-29deg);
  pointer-events: none;
}

.custom-button::after {
  content: "";
  position: absolute;
  top: 12px;
  left: 1px;
  width: 3px;
  height: 7px;
  border-radius: 50%;
  background: #ffffff;
  transform: rotate(24deg);
  pointer-events: none;
  box-shadow: calc(100% - 30px) calc(100% - 25px) 0 2px transparent;
}

.custom-button .button-flare {
  position: absolute;
  right: 6px;
  bottom: 4px;
  width: 14px;
  height: 5px;
  border-radius: 50%;
  background: #3FCA1A;
  transform: rotate(-32deg);
  pointer-events: none;
}

.custom-button:active {
  border: 0px solid transparent;
}
</style>