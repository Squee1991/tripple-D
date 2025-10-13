<template>
  <div v-if="visible && isModalOpen && activeEvent" class="modal-overlay" @click.self="handleCloseClick">
    <div class="modal-content" role="dialog" aria-modal="true">
      <VShowFall v-if="activeEvent.snow"/>
      <div class="modal-icon">
        <img class="modal__icon-item" :src="activeEvent.icon" :alt="`${activeEvent.title} icon`"/>
      </div>
      <h2 class="modal-title">{{ activeEvent.title }}</h2>
      <p class="modal-text">{{ activeEvent.text }}</p>
      <div class="modal-actions">
        <button type="button" class="btn-start" @click="handleBeginClick">Начать</button>
        <button type="button" class="btn-start --close" @click="handleCloseClick">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {ref, watch, computed, onMounted, onUnmounted} from "vue";
import VShowFall from "../components/V-showFall.vue";
import Wreath from "../../assets/images/mery-christmas/christmas-wreath.svg";
import Pumpkin from "../../assets/images/mery-christmas/pumkin.svg";

const router = useRouter();

const props = defineProps({
  visible: {type: Boolean, default: true},
  schedule: {
    type: Array,
    default: () => [
      {
        start: "10-31 00:00",
        title: "Хэллоуин",
        text: "Собирай конфеты и не бойся испытаний — новые награды уже ждут!",
        icon: Pumpkin,
        route: "/event-halloween",
        snow: false,
      },
      {
        start: "12-01 00:00",
        title: "Зимний покров",
        text: "Зимний сезон открыт! Успей принять участие и получить награды.",
        icon: Wreath,
        route: "/event-winter",
        snow: true,
      }
    ]
  },
  tickMs: {type: Number, default: 1000}
});

const emit = defineEmits(["close"]);

const isModalOpen = ref(true);
const currentTime = ref(new Date());
let intervalId = null;

function parseAnnualStart(startString) {
  const [datePart, timePart] = startString.split(" ");
  const [month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, month - 1, day, hours, minutes, 0, 0);
}

const annualCandidatesSorted = computed(() => {
  const list = (props.schedule || []).map(entry => ({
    ...entry,
    startDate: parseAnnualStart(entry.start)
  }));
  return list.sort((a, b) => a.startDate - b.startDate);
});

const activeEvent = computed(() => {
  const now = currentTime.value;
  const list = annualCandidatesSorted.value;
  const past = list.filter(item => item.startDate <= now);
  return past.length ? past[past.length - 1] : null;
});

function handleBeginClick() {
  router.push(activeEvent.value.route || "/");
  emit("close");
}

function handleCloseClick() {
  isModalOpen.value = false;
  emit("close", false);
}

onMounted(() => {
  if (props.visible && isModalOpen.value) document.body.style.overflow = "hidden";
  intervalId = setInterval(() => {
    currentTime.value = new Date();
  }, props.tickMs);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  if (intervalId) clearInterval(intervalId);
});

watch(
    () => [props.visible, isModalOpen.value],
    ([isVisible, open]) => {
      document.body.style.overflow = isVisible && open ? "hidden" : "";
    },
    {immediate: true}
);
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), inset 0 0 12px rgba(255, 255, 255, 0.6);
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
    transform: translateY(0)
  }
  50% {
    transform: translateY(-6px)
  }
}
</style>
