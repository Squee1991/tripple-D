<template>
  <div class="map__wrapper">
    <div class="map__title-wrapper">
      <h1 class="map__title">Карта изучения немецкого языка</h1>
    </div>
    <div class="map-layout">
      <aside
          class="map-left"
          :class="{ 'is-open': isPanelOpen || windowWidth > 767 }"
          v-if="active"
      >
        <button
            v-if="windowWidth <= 767"
            class="map-left__close"
            @click="isPanelOpen = false"
        >×</button>
        <div class="map-left__color" :style="{ backgroundColor: active?.color }">
          <img :src="active?.icon" alt="">
        </div>
        <h2 class="map-left__title">{{ active.name }}</h2>
        <p class="map-left__desc">{{ active.desc }}</p>
        <p class="map-left__level" :class="isUnlocked ? 'ok' : 'locked'">
          <span v-if="isUnlocked">Доступ открыт</span>
          <span v-else>Доступ с уровня {{ active.level }}</span>
        </p>
        <button class="map-btn" :disabled="!isUnlocked" @click="go(active)">
          Выбрать
        </button>
      </aside>
      <div class="map-right">
        <div
            v-for="r in regions"
            :key="r.id"
            class="region-card"
            :class="{ active: active?.id === r.id }"
            :style="{ backgroundColor: r.color }"
            @click="select(r)"
        >
          <img :src="r.icon" alt="">
          <div class="region-card__title">{{ r.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { regions } from "@/utils/regions.js";

const props = defineProps({ currentLevel: { type: Number, default: 1 } });

const router = useRouter();
const active = ref(regions[0]);
const isPanelOpen = ref(false);
const windowWidth = ref(window.innerWidth);

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const clampedLevel = computed(() =>
    Math.min(Math.max(props.currentLevel, 1), 20)
);

const isUnlocked = computed(() =>
    active.value ? clampedLevel.value >= active.value.level : false
);

function select(region) {
  active.value = region;
  if (windowWidth.value <= 767) {
    isPanelOpen.value = true; // только на мобилке открываем
  }
}

function go(region) {
  if (clampedLevel.value >= region.level) {
    router.push(`/location/${region.pathTo}`);
  }
}
</script>


<style>

* {
  font-family: "Nunito", sans-serif;
}

.map__wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: center;
  border: 3px solid black;
  border-radius: 20px;
  margin-top: 20px;
  box-shadow: 6px 6px 0 black;
  background: #fff;
  margin-bottom: 30px;
}

.map__title-wrapper {
  width: 100%;
  border: 3px solid black;
  border-radius: 12px;
  box-shadow: 4px 4px 0 black;
  padding: 10px;
  background: #4ade80;;
  text-align: center;
}

.map__title {
  font-size: 2.3rem;
  color: #222;
  font-weight: 700;
}

.map__sub {
  font-size: 1rem;
}

.map-layout {
  display: flex;
  gap: 10px;
  width: 100%;
}


.map-left {
  flex: 1;
  background: #fff;
  border: 3px solid black;
  border-radius: 12px;
  padding: 10px;
  color: #222;
  overflow-y: auto;
  box-shadow: 4px 4px 0 black;
}

.map-left__color {
  width: 100%;
  height: 190px;
  max-height: 190px;
  border: 3px solid black;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 3px 3px 0 black;
  overflow: hidden;
}

.map-left__title {
  font-size: 1.5rem;
  margin: 0 0 10px;
  font-weight: 900;
  font-style: italic;
}

.map-left__desc {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.map-left__level {
  font-weight: bold;
  margin-bottom: 20px;
}

.map-left__level.ok {
  color: #00aa55;
}

.map-left__level.locked {
  color: #d33;
}

.map-btn {
  padding: 10px 18px;
  font-weight: bold;
  background: #ffe066;
  color: #222;
  border: 3px solid black;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 4px 4px 0 black;
  transition: all .1s ease-in-out;
  width: 100%;
}

.map-btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.map-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.map-right {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  overflow-y: auto;
  padding: 10px;
  border: 3px solid black;
  border-radius: 12px;
  background: #fff;
  box-shadow: 4px 4px 0 black;
}

.region-card {
  border: 3px solid black;
  border-radius: 12px;
  cursor: pointer;
  transition: all .1s ease-in-out;
  color: #222;
  font-weight: bold;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  box-shadow: 4px 4px 0 black;
  height: 190px;
  max-height: 250px;
  overflow: hidden;
  position: relative;
}

.region-card__title {
  font-size: 1.1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #e3d7d7;
  padding: 5px;
}

.region-card__level {
  font-size: 0.9rem;
  opacity: 0.8;
}

.region-card:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

@media (max-width: 767px) {
  .map-layout {
    position: relative;
    display: block;
    max-height: 75vh;
    overflow-y: auto;
  }

  .map-left {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 0;
    border: none;
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    transition: transform .25s ease, opacity .25s ease;
    z-index: 1000;
  }
  .map-left.is-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }

  .map__title {
    font-size: 1.1rem;
  }

  .map-btn {
    width: 100%;
  }

  .map-left__close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    border: 3px solid #000;
    border-radius: 8px;
    background: #ffe066;
    box-shadow: 2px 2px 0 #000;
    font-size: 20px;
    cursor: pointer;
  }

  .map-right {
    grid-template-columns: 1fr;
    box-shadow: none;
  }
}


</style>
