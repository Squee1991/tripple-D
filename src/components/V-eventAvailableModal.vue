<template>
  <div
      v-if="visible && isModalOpen && activeEvent && authStore.uid"
      class="modal-overlay"
      @click.self="handleCloseClick"
  >
    <div class="modal-content" role="dialog" aria-modal="true">
      <img v-if="activeEvent.id === 'winter'" class="snow" :src="Showing" alt="">
      <VShowFall
          v-if="activeEvent && activeEvent.effectImage"
          :image="activeEvent.effectImage"
      />
      <div class="modal-icon">
        <img class="modal__icon-item" :src="activeEvent.icon" :alt="`${activeEvent.title} icon`"/>
      </div>
      <div class="modal__main">
        <h2 class="modal-title">{{ activeEvent.title }}</h2>
        <p class="modal-text">{{ activeEvent.text }}</p>
        <div class="modal-actions">
          <button type="button" class="btn-start" @click="handleBeginClick">{{ t('Собирать тыквы')}}</button>
          <!--        <button type="button" class="btn-start &#45;&#45;close" @click="handleCloseClick">{{ t('shareModal.close')}}</button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { userAuthStore } from '~/store/authStore.js'
import VShowFall from "../components/V-showFall.vue";
import Wreath from "../../assets/images/mery-christmas/santa-claus.svg";
import Pumpkin from "~/assets/images/event-rewards/halloween-event/halloween-assets/HalloweenStart.png";
import Valentine from "../../assets/images/mery-christmas/valentine.svg";
import SnowFall from '../../assets/images/mery-christmas/Snow.svg'
import HeartFall from '../../assets/images/mery-christmas/heartFall.svg'
import PumpkinFall from '../../assets/images/mery-christmas/pumpkinFall.svg'
import FoolIcon from '../../assets/images/mery-christmas/fooldayFall.svg'
import FoolIFall from '../../assets/images/mery-christmas/foolFall.svg'
import Showing from '../../assets/images/shovel.svg'

const { t } = useI18n()
const authStore = userAuthStore();
const router = useRouter();

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  schedule: {
    type: Array,
    default: null
  },
  tickMs: { type: Number, default: 1000 }
});

const emit = defineEmits(["close"]);
const isModalOpen = ref(true);
const currentTime = ref(new Date());
const lastEventKey = ref(null);

const defaultSchedule = computed(() => [
  {
    id: "halloween",
    start: "8-28 00:00",
    end: "10-31 23:59",
    title: t('eventsModal.halloweenLabel'),
    text: t('eventsModal.halloweenText'),
    icon: Pumpkin,
    route: "/event-halloween",
    effectImage: PumpkinFall,
  },
  {
    id: "winter",
    start: "12-18 00:00",
    end: "01-02 23:59",
    title: t('eventsModal.winterLabel'),
    text: t('eventsModal.winterText'),
    icon: Wreath,
    route: "/event-winter",
    effectImage: SnowFall,
  },
  {
    id: "valentine",
    start: '02-12 00:00',
    end: '02-16 23:59',
    title: t('eventsModal.valentineLabel'),
    text: t('eventsModal.valentineText'),
    icon: Valentine,
    route: "/event-valentine",
    effectImage: HeartFall,
  },
  {
    id: "joke",
    start: '04-01 00:00',
    end: '04-01 23:59',
    title: t('eventsModal.jokeLabel'),
    text: t('eventsModal.jokeText'),
    icon: FoolIcon,
    route: "/event-joke",
    effectImage: FoolIFall,
  }
]);

const effectiveSchedule = computed(() => props.schedule || defaultSchedule.value);

function parseAnnualDate(str) {
  const [datePart, timePart] = str.split(" ");
  const [month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = (timePart || "00:00").split(":").map(Number);
  const y = new Date().getFullYear();
  return new Date(y, month - 1, day, hours ?? 0, minutes ?? 0, 0, 0);
}

function makeEventKey(entry) {
  return `${entry.id}|${entry.start}|${entry.end ?? ""}|${entry.startDate.getFullYear()}`;
}

function getDismissed(key) {
  // try {
  //   return localStorage.getItem(`eventModal.dismissed.${key}`) === "1";
  // } catch {
  //   return false;
  // }
}

function setDismissed(key, v = true) {
  // try {
  //   localStorage.setItem(`eventModal.dismissed.${key}`, v ? "1" : "0");
  // } catch {}
}

const annualCandidatesSorted = computed(() => {
  const list = effectiveSchedule.value.map(entry => {
    const startDate = parseAnnualDate(entry.start);
    const endDate = entry.end ? parseAnnualDate(entry.end) :
        new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    return {
      ...entry,
      startDate,
      endDate
    };
  });

  for (const e of list) {
    if (e.endDate <= e.startDate) {
      const d = new Date(e.endDate);
      d.setFullYear(d.getFullYear() + 1);
      e.endDate = d;
    }
  }
  return list.sort((a, b) => a.startDate - b.startDate);
});

const activeEvent = computed(() => {
  const now = currentTime.value;
  const list = annualCandidatesSorted.value;
  const candidates = list.filter(e => e.startDate <= now && now < e.endDate);
  if (!candidates.length) return null;
  return candidates[candidates.length - 1];
});

function dismissCurrentEvent() {
  if (!activeEvent.value) return;
  const key = makeEventKey(activeEvent.value);
  setDismissed(key, true);
  isModalOpen.value = false;
}

function handleBeginClick() {
  const to = activeEvent.value?.route || "/";
  dismissCurrentEvent();
  router.push(to);
  emit("close");
}

function handleCloseClick() {
  dismissCurrentEvent();
  emit("close", false);
}

let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = new Date();
  }, props.tickMs);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  if (intervalId) clearInterval(intervalId);
});

watch(() => activeEvent.value,
    (val) => {
      const key = val ? makeEventKey(val) : null;
      if (!key) {
        isModalOpen.value = false;
        return;
      }
      if (key !== lastEventKey.value) {
        lastEventKey.value = key;
        isModalOpen.value = !getDismissed(key);
      }
    }, {
      immediate: true
    }
);

watch(() => [props.visible, isModalOpen.value, activeEvent.value, authStore.uid],
    ([isVisible, open, evt, uid]) => {
      document.body.style.overflow = (isVisible && open && !!evt && !!uid) ? "hidden" : "";
    },
    { immediate: true }
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
  z-index: 999999;
  backdrop-filter: blur(3px);
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

.snow {
  position: absolute;
  top: -74%;
  left: -6px;
  width: 372px;
  z-index: 0;
  max-width: none;
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

@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-6px) }
}
</style>