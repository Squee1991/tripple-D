<template>
  <div class="v-banner" :style="{ backgroundColor: bgColor }">
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
defineProps({
  text: {type: String, default: ''},
  icon: {type: String, default: ''},
  bgColor: {type: String, default: '#00c2ff'}
})
</script>

<style scoped>
.v-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 0 rgb(73, 187, 232);
  margin-bottom: 20px;
}

.v-banner__left {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #fff;
  font-family: "Nunito", sans-serif;
}

.v-banner__default-text {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  margin-left: 10px;
}

.v-banner__right {
  display: flex;
  justify-content: center;
  align-items: center;
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