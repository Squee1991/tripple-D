<template>
  <div class="v-banner" :style="bannerStyle">
    <div class="v-banner__left">
      <slot>
        <span class="v-banner__default-text">{{ text }}</span>
      </slot>
    </div>
    <div v-if="icon" class="v-banner__right">
      <img :src="icon" class="v-banner__icon" alt="Banner Icon"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
  bgColor: { type: String, default: '#00c2ff' }
});

const colorMode = useColorMode();
const isOrange = computed(() => colorMode.value === 'orange');

const bannerStyle = computed(() => {
  if (isOrange.value) {
    return {
      background: 'linear-gradient(145deg, #f59a4a 0%, #e8782c 45%, #c25f1c 100%)',
      backgroundColor: '#e8782c',
      // Переопределяем 3D-тень под оранжевый оттенок
      boxShadow: `
        inset 0 2px 4px rgba(255, 225, 180, 0.4),
        inset 0 -2px 4px rgba(60, 20, 0, 0.2),
        0 6px 0 #7a3a0e,
        0 10px 20px rgba(0, 0, 0, 0.55)
      `
    };
  }

  // Дефолтный голубой вариант
  return {
    background: `linear-gradient(145deg, ${props.bgColor}, #00a8db)`,
    backgroundColor: props.bgColor
  };
});
</script>

<style scoped>
.v-banner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  min-height: 122px;
  padding: 20px 25px;
  border-radius: 24px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3),
  inset 0 -2px 4px rgba(0, 0, 0, 0.1),
  0 6px 0 rgb(0, 160, 220),
  0 8px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  top: 0;
}

.v-banner__left {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #fff;
  font-family: "Nunito", sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.v-banner__default-text {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
}

.v-banner__right {
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.15));
}

.v-banner__icon {
  width: 70px;
  height: auto;
  object-fit: contain;
}

@media (max-width: 380px) {
  .v-banner__right {
    flex: 0 0 100px;
  }
}
</style>