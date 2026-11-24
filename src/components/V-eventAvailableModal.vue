<template>
  <div
      v-if="visible && isModalOpen && activeEvent && authStore.uid"
      class="modal-overlay"
      @click.self="handleCloseClick"
  >
    <div class="modal-content" :class="`--${activeEvent.id}`" role="dialog" aria-modal="true">
      <VShowFall
          v-if="activeEvent && activeEvent.effectImage && activeEvent.id !== 'winter'"
          :image="activeEvent.effectImage"
      />
      <div v-if="activeEvent.id === 'winter'" class="winter-decor" aria-hidden="true">
        <div class="winter-decor__moon"></div>
        <span v-for="star in WINTER_STARS" :key="star.id" class="winter-decor__star"
              :style="{ left: star.x + '%', top: star.y + '%', animationDelay: star.delay + 's', '--s': star.size + 'px' }"></span>
        <svg class="winter-decor__balls winter-decor__balls--left" viewBox="0 0 90 72">
          <g class="swing" style="transform-origin: 30px 0">
            <line x1="30" y1="0" x2="30" y2="36" stroke="#cfe3ff" stroke-opacity="0.6" stroke-width="1.2"/>
            <rect x="26" y="34" width="8" height="5" rx="1.5" fill="#f3c74f"/>
            <circle cx="30" cy="49" r="11" fill="#e8424f"/>
            <circle cx="26" cy="45" r="3.2" fill="#fff" fill-opacity="0.55"/>
          </g>
          <g class="swing swing--slow" style="transform-origin: 64px 0">
            <line x1="64" y1="0" x2="64" y2="18" stroke="#cfe3ff" stroke-opacity="0.6" stroke-width="1.2"/>
            <rect x="61" y="17" width="6" height="4" rx="1.2" fill="#f3c74f"/>
            <circle cx="64" cy="28" r="8" fill="#f3c74f"/>
            <circle cx="61.5" cy="25.5" r="2.3" fill="#fff" fill-opacity="0.6"/>
          </g>
        </svg>
        <svg class="winter-decor__balls winter-decor__balls--right" viewBox="0 0 90 72">
          <g class="swing swing--slow" style="transform-origin: 26px 0">
            <line x1="26" y1="0" x2="26" y2="22" stroke="#cfe3ff" stroke-opacity="0.6" stroke-width="1.2"/>
            <rect x="23" y="21" width="6" height="4" rx="1.2" fill="#f3c74f"/>
            <circle cx="26" cy="32" r="8" fill="#4dd97a"/>
            <circle cx="23.5" cy="29.5" r="2.3" fill="#fff" fill-opacity="0.55"/>
          </g>
          <g class="swing" style="transform-origin: 60px 0">
            <line x1="60" y1="0" x2="60" y2="32" stroke="#cfe3ff" stroke-opacity="0.6" stroke-width="1.2"/>
            <rect x="56" y="30" width="8" height="5" rx="1.5" fill="#f3c74f"/>
            <circle cx="60" cy="45" r="11" fill="#5ab8ff"/>
            <circle cx="56" cy="41" r="3.2" fill="#fff" fill-opacity="0.55"/>
          </g>
        </svg>
        <svg class="winter-decor__hills" viewBox="0 0 320 110" preserveAspectRatio="none">
          <path d="M0 62 C50 40 95 46 140 60 C190 76 240 44 320 54 V110 H0Z" fill="#ffffff" fill-opacity="0.07"/>
          <path d="M0 84 C60 66 110 72 170 82 C230 92 270 70 320 76 V110 H0Z" fill="#ffffff" fill-opacity="0.12"/>
          <g fill="#0a1d42" fill-opacity="0.75">
            <path d="M28 76 L38 52 L48 76Z"/><path d="M31 64 L38 46 L45 64Z"/>
            <path d="M268 72 L276 54 L284 72Z"/><path d="M270 63 L276 49 L282 63Z"/>
            <path d="M290 76 L296 62 L302 76Z"/>
          </g>
        </svg>
      </div>
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
import { useEventSessionStore } from '~/store/eventsStore.js';

import VShowFall from "../components/V-showFall.vue";
import Wreath from "../../assets/images/mery-christmas/santa-claus.svg";
import Pumpkin from "~/assets/images/event-rewards/halloween-event/halloween-assets/HalloweenStart.png";
import Valentine from "../../assets/images/mery-christmas/valentine.svg";
import SnowFall from '../../assets/images/mery-christmas/Snow.svg'
import HeartFall from '../../assets/images/mery-christmas/heartFall.svg'
import PumpkinFall from '../../assets/images/mery-christmas/pumpkinFall.svg'
import FoolIcon from '../../assets/images/mery-christmas/fooldayFall.svg'
import FoolIFall from '../../assets/images/mery-christmas/foolFall.svg'

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

// Звёздочки на фоне зимней модалки: позиции фиксированные, чтобы не прыгали при перерисовке
const WINTER_STARS = [
  { id: 1, x: 12, y: 30, size: 6, delay: 0 },
  { id: 2, x: 85, y: 26, size: 5, delay: 0.7 },
  { id: 3, x: 20, y: 52, size: 4, delay: 1.3 },
  { id: 4, x: 80, y: 50, size: 6, delay: 0.4 },
  { id: 5, x: 50, y: 6, size: 4, delay: 1.8 },
  { id: 6, x: 8, y: 70, size: 4, delay: 1 },
  { id: 7, x: 92, y: 68, size: 5, delay: 2.2 }
];
const isModalOpen = ref(true);
const currentTime = ref(new Date());
const lastEventKey = ref(null);

const modalVisuals = computed(() => ({
  'winter': {
    title: t('eventsModal.winterLabel'),
    text: t('eventsModal.winterText'),
    btnText: t('eventsModalButtons.winter'),
    modalIcon: Wreath,
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
  const currentEvent = eventStore.events.find(e => isEventActive(e.start, e.end, now));
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

/* Зимний ивент: своя карточка с декором внутри (шары, луна, звёзды, холмы с ёлками).
   Свой снег модалке не нужен: на главной во время зимнего ивента снег уже идёт */
.modal-content.--winter {
  max-width: 330px;
  border: 2px solid rgb(190 225 255 / 0.35);
  border-radius: 30px;
  background: linear-gradient(180deg, #1f5aa6 0%, #12387a 50%, #0b2350 100%);
  box-shadow: 0 0 0 6px rgb(120 180 255 / 0.12), 0 24px 60px rgba(0, 0, 0, 0.6);
}

.winter-decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

.winter-decor__moon {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 190px;
  height: 190px;
  margin-left: -95px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(190 225 255 / 0.45) 0%, rgb(190 225 255 / 0.12) 50%, transparent 70%);
}

.winter-decor__star {
  position: absolute;
  width: var(--s);
  height: var(--s);
  background: #fff;
  clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
  animation: winter-twinkle 2.6s ease-in-out infinite;
}

.winter-decor__balls {
  position: absolute;
  top: 0;
  width: 90px;
  height: 72px;
}

.winter-decor__balls--left {
  left: 6px;
}

.winter-decor__balls--right {
  right: 6px;
}

.winter-decor .swing {
  animation: winter-swing 3.2s ease-in-out infinite alternate;
}

.winter-decor .swing--slow {
  animation-duration: 4.4s;
  animation-direction: alternate-reverse;
}

.winter-decor__hills {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 110px;
}

.--winter .modal-icon,
.--winter .modal__main {
  position: relative;
  z-index: 1;
}

.--winter .modal-icon {
  padding-top: 26px;
}

.--winter .modal__icon-item {
  height: 150px;
  width: auto;
  filter: drop-shadow(0 6px 10px rgb(0 0 0 / 0.35));
}

.--winter .modal__main {
  background: transparent;
  padding: 2px 22px 24px;
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
  border: none;
}

.--winter .btn-start:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #6fa8dc;
}

@keyframes winter-twinkle {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(0.6); }
}

@keyframes winter-swing {
  from { transform: rotate(-5deg); }
  to { transform: rotate(5deg); }
}

@media (prefers-reduced-motion: reduce) {
  .winter-decor__star,
  .winter-decor .swing {
    animation: none;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-6px) }
}
</style>