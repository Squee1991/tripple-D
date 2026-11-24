<template>
  <div
      v-if="visible && isModalOpen && activeEvent && authStore.uid"
      class="modal-overlay"
      @click.self="handleCloseClick"
  >
    <div class="modal-content" :class="`--${activeEvent.id}`" role="dialog" aria-modal="true">
      <VShowFall
          v-if="activeEvent && activeEvent.effectImage"
          :image="activeEvent.effectImage"
      />
      <div class="modal-icon">
        <img class="modal__icon-item" :src="activeEvent.modalIcon" :alt="`${activeEvent.title} icon`"/>
      </div>
      <div class="modal__main">
        <h2 class="modal-title">{{ activeEvent.title }}</h2>
        <p class="modal-text">{{ activeEvent.text }}</p>
        <div class="modal-actions">
          <button type="button" class="btn-start" @click="handleBeginClick">
            {{ activeEvent.btnText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { userAuthStore } from '~/store/authStore.js';
import { useEventSessionStore, WINTER_FORCE_OPEN } from '~/store/eventsStore.js';

import VShowFall from "../components/V-showFall.vue";
import Pumpkin from "~/assets/images/event-rewards/halloween-event/halloween-assets/HalloweenStart.png";
import Valentine from "../../assets/images/mery-christmas/valentine.svg";
import SnowFall from '../../assets/images/mery-christmas/Snow.svg'
import HeartFall from '../../assets/images/mery-christmas/heartFall.svg'
import PumpkinFall from '../../assets/images/mery-christmas/pumpkinFall.svg'
import FoolIcon from '../../assets/images/mery-christmas/fooldayFall.svg'
import FoolIFall from '../../assets/images/mery-christmas/foolFall.svg'
import ChristmasBannerPic from '../../assets/images/mery-christmas/ChristmasBannerPic.png'

const { t } = useI18n();
const authStore = userAuthStore();
const eventStore = useEventSessionStore();
const router = useRouter();

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  tickMs: { type: Number, default: 1000 }
});

const emit = defineEmits(["close"]);

const isModalOpen = ref(true);
const currentTime = ref(new Date());
const lastEventKey = ref(null);

const modalVisuals = computed(() => ({
  'winter': {
    title: t('eventsModal.winterLabel'),
    text: t('eventsModal.winterText'),
    btnText: t('eventsModalButtons.winter'),
    modalIcon: ChristmasBannerPic,
    effectImage: SnowFall,
  },
  'valentine': {
    title: t('eventsModal.valentineLabel'),
    text: t('eventsModal.valentineText'),
    btnText: t('eventsModalButtons.valentine'),
    modalIcon: Valentine,
    effectImage: HeartFall,
  },
  'april': {
    title: t('eventsModal.jokeLabel'),
    text: t('eventsModal.jokeText'),
    btnText: t('eventsModalButtons.april'),
    modalIcon: FoolIcon,
    effectImage: FoolIFall,
  },
  'pumpkin': {
    title: t('eventsModal.halloweenLabel'),
    text: t('eventsModal.halloweenText'),
    btnText: t('eventsModalButtons.pumpkin'),
    modalIcon: Pumpkin,
    effectImage: PumpkinFall,
  }
}));

function isEventActive(startStr, endStr, now) {
  const currentYear = now.getFullYear();

  const parse = (str, y) => {
    const [datePart, timePart] = str.split(" ");
    const [month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = (timePart || "00:00").split(":").map(Number);
    return new Date(y, month - 1, day, hours ?? 0, minutes ?? 0, 0, 0);
  };

  let startDate = parse(startStr, currentYear);
  let endDate = parse(endStr, currentYear);

  if (startDate > endDate) {
    if (now.getMonth() < startDate.getMonth()) {
      startDate.setFullYear(currentYear - 1);
    } else {
      endDate.setFullYear(currentYear + 1);
    }
  }
  return now >= startDate && now <= endDate;
}


const activeEvent = computed(() => {
  const now = currentTime.value;
  const currentEvent = eventStore.events.find(e => isEventActive(e.start, e.end, now) || (WINTER_FORCE_OPEN && e.id === 'winter'));
  if (!currentEvent) return null;
  const visuals = modalVisuals.value[currentEvent.id] || {};
  // Год старта, а не текущий: зимний ивент идёт через Новый год, и в январе ключ «уже видел» должен остаться прежним
  const startMonth = Number(currentEvent.start.split('-')[0]) - 1;
  const startYear = now.getMonth() < startMonth ? now.getFullYear() - 1 : now.getFullYear();
  return {
    ...currentEvent,
    ...visuals,
    startYear
  };
});

function makeEventKey(entry) {
  return `${entry.id}|${entry.start}|${entry.end}|${entry.startYear}`;
}

function getDismissed(key) {
  try { return localStorage.getItem(`eventModal.dismissed.${key}`) === "1"; }
  catch { return false; }
}

function setDismissed(key, v = true) {
  try { localStorage.setItem(`eventModal.dismissed.${key}`, v ? "1" : "0"); }
  catch {}
}

function dismissCurrentEvent() {
  if (!activeEvent.value) return;
  const key = makeEventKey(activeEvent.value);
  setDismissed(key, true);
  isModalOpen.value = false;
}

function handleBeginClick() {
  const to = activeEvent.value?.url || "/"; // url берется из стора
  dismissCurrentEvent();
  router.push(to);
  emit("close");
}

function handleCloseClick() {
  dismissCurrentEvent();
  emit("close", false);
}

// Один раз за запуск сообщаем app.vue, показали ли модалку ивента:
// если да — модалка марафона ждёт следующего запуска
const eventModalState = useState('eventModalState', () => 'pending');

let intervalId;
onMounted(() => {
  intervalId = setInterval(() => { currentTime.value = new Date(); }, props.tickMs);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  if (intervalId) clearInterval(intervalId);
});

watch(() => activeEvent.value, (val) => {
  const key = val ? makeEventKey(val) : null;
  if (!key) {
    isModalOpen.value = false;
    return;
  }
  if (key !== lastEventKey.value) {
    lastEventKey.value = key;
    isModalOpen.value = !getDismissed(key);
  }
}, { immediate: true });

watch(() => [props.visible, isModalOpen.value, activeEvent.value, authStore.uid],
    ([isVisible, open, evt, uid]) => {
      document.body.style.overflow = (isVisible && open && !!evt && !!uid) ? "hidden" : "";
    }, { immediate: true }
);

// Решаем только когда пользователь вошёл: до входа модалка скрыта, а после входа может появиться.
// Стоит после watch(activeEvent), чтобы isModalOpen уже учитывал «уже видел»
watch(() => authStore.uid, (uid) => {
  if (!uid || eventModalState.value !== 'pending') return;
  const isShown = props.visible && isModalOpen.value && !!activeEvent.value;
  eventModalState.value = isShown ? 'shown' : 'none';
}, { immediate: true });

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  /* Без размытия: на мобильном blur двоит светящиеся иконки под модалкой, поэтому фон сильно затемняем */
  background: rgba(3, 8, 22, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}

.modal__main {
  background: #121212;
  padding: 20px;
}

.modal-content {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 4px solid #253059;
  background: #121212;
  max-width: 360px;
  width: 90%;
  text-align: center;
  z-index: 1111111;
}


.modal-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.modal-title {
  font-family: "Rubik Wet Paint", system-ui;
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 24px;
  color: wheat;
  text-align: center;
  -webkit-text-stroke: 0.5px #000000;
  -webkit-font-smoothing: antialiased;
  text-shadow: 0 2px 0 orange;
  -moz-osx-font-smoothing: grayscale;
}

.modal-text {
  font-family: "Rubik Wet Paint", system-ui;
  font-size: 14px;
  margin-bottom: 18px;
  color: wheat;
  -webkit-text-stroke: 0.5px #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 10px;
  -webkit-text-stroke: 0.5px #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.btn-start {
  width: 100%;
  background: linear-gradient(135deg, #d39334, #ff9900);
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
  box-shadow: 0 6px 0 #d39334;
  font-family: "Rubik Wet Paint", system-ui;
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

/* Зимний ивент: расположение как у хэллоуина (картинка сверху, ниже текст), цвета и шрифты зимние */
.modal-content.--winter,
.--winter .modal__main {
  background: #0b2350;
}

/* картинка вертикальная (9:16): режем квадрат, как у хэллоуина, кадр ниже центра, чтобы попал ёж с подарками */
.--winter .modal__icon-item {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  object-position: center 70%;
}

.--winter .modal-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
  -webkit-text-stroke: 0;
  text-shadow: 0 0 14px rgb(159 211 255 / 0.7), 0 2px 0 #0a1f45;
}

/* снежинки по бокам заголовка */
.--winter .modal-title::before,
.--winter .modal-title::after {
  content: "";
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  opacity: 0.85;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23cfe8ff' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M12 2l-2.5 2.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5'/%3E%3C/svg%3E") no-repeat center / contain;
}

.--winter .modal-text {
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 16px;
  color: #d8ecff;
  -webkit-text-stroke: 0;
}

.--winter .modal-actions {
  -webkit-text-stroke: 0;
}

.--winter .btn-start {
  font-family: "Fredoka", "Nunito", sans-serif;
  font-weight: 600;
  font-size: 19px;
  color: #0f2c5c;
  background: linear-gradient(180deg, #ffffff, #cfe8ff);
  box-shadow: 0 5px 0 #6fa8dc, 0 10px 20px rgb(0 0 0 / 0.3);
}

.--winter .btn-start:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #6fa8dc;
}

@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-6px) }
}
</style>