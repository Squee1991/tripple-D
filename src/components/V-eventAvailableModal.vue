<template>
  <div v-if="visible && closeModal" class="modal-overlay" @click.self="closeEventModal">
    <div class="modal-content">
      <VShowFall/>
      <div class="modal-icon">
        <img class="modal__icon-item" :src="Wreath" alt="Wreath icon">
      </div>
      <h2 class="modal-title">Зимний шёпот</h2>
      <p class="modal-text">
        С сегодняшнего дня стартует праздничное событие!
        Успей принять участие и получить награды.
      </p>
      <div class="modal-actions">
        <button type="button" class="btn-start" @click="beginEvent">Начать</button>
        <button type="button" class="btn-start --close" @click="closeEventModal">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {defineProps, defineEmits, watch} from "vue";
import VShowFall from "../components/V-showFall.vue";
import Wreath from "../../assets/images/mery-christmas/christmas-wreath.svg";

const router = useRouter();

defineProps({
  visible: {
    type: Boolean,
    default: true
  }
});

const closeModal = ref(true);
const emit = defineEmits(["close"]);

const beginEvent = () => {
  router.push("/season");
  emit("close");
};

const closeEventModal = () => {
  emit("close", closeModal.value = false);
}

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

watch(closeModal, (value) => {
  document.body.style.overflow = value ? "hidden" : "";
});

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  background: #161616;
  padding: 32px 24px;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25),
  inset 0 0 12px rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.modal-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

.modal__icon-item {
  width: 120px;
}

.modal-title {
  font-family: "Nunito", sans-serif;
  font-size: 25px;
  font-weight: 900;
  margin-bottom: 15px;
  color: wheat;

}

.modal-text {
  font-size: 16px;
  margin-bottom: 24px;
  color: wheat;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 10px;
}

.btn-start {
  width: 80%;
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
  box-shadow: 0 4px 0 #3cb288;
}

.btn-start.--close {
  background: #cb6c6c;
  box-shadow: 0 4px 0 #d98181;
}

@media (min-width: 1024px) {
  .btn-start:hover {
    filter: brightness(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
