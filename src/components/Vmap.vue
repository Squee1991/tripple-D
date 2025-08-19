<template>
  <div class="map__wrapper">
    <div class="map__title-wrapper">
      <h1 class="map__title">Карта изучения немецкого языка</h1>
      <p class="map__sub">
        Пройди все квесты во всех локациях, чтобы стать мастером немецкого!
      </p>
    </div>
    <div class="map-layout">
      <div class="map-left" v-if="active">
        <div class="map-left__color" :style="{ backgroundColor: active?.color }">
          <img :src="active?.icon" alt="">
        </div>
        <h2 class="map-left__title">{{ active.name }}</h2>
        <p class="map-left__desc">{{ active.desc }}</p>
        <p class="map-left__level" :class="isUnlocked ? 'ok' : 'locked'">
          <span v-if="isUnlocked">Доступ открыт</span>
          <span v-else>Доступ с уровня {{ active.level }}</span>
        </p>
        <button
            class="map-btn"
            :disabled="!isUnlocked"
            @click="go(active)"
        >
          Выбрать
        </button>
      </div>

      <div class="map-right">
        <div
            v-for="r in regions"
            :key="r.id"
            class="region-card"
            :class="{ active: active?.id === r.id }"
            :style="{ backgroundColor: r.color }"
            @click="select(r)"
        >
          <img class="" :src="r.icon" alt="">
          <div class="region-card__title">{{ r.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { regions } from "@/utils/regions.js";
const props = defineProps({
  currentLevel: { type: Number, default: 1 }
});

const router = useRouter();
const active = ref(regions[0]);

const clampedLevel = computed(() =>
    Math.min(Math.max(props.currentLevel, 1), 20)
);

const isUnlocked = computed(() =>
    active.value ? clampedLevel.value >= active.value.level : false
);

function select(region) {
  active.value = region;
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
  padding: 30px;
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
  gap: 30px;
  width: 100%;
}


.map-left {
  flex: 1;
  background: #fff;
  border: 3px solid black;
  border-radius: 12px;
  padding: 20px;
  color: #222;
  overflow-y: auto;
  box-shadow: 4px 4px 0 black;
}

.map-left__color {
  width: 100%;
  height: 220px;
  max-height: 220px;
  border: 3px solid black;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 3px 3px 0 black;
  overflow: hidden;
}

.map-left__title {
  font-size: 1.4rem;
  margin: 0 0 10px;
  font-weight: 700;
}

.map-left__desc {
  font-size: 1rem;
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
  box-shadow: 3px 3px 0 black;
  transition: transform 0.15s;
}

.map-btn:hover:not(:disabled) {
  transform: scale(1.05);
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
  height: 250px;
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

</style>
