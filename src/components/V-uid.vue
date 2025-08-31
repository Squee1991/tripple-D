<template>
  <div class="uid__container">
    <div class="ui__statistics">
      <VStatistics/>
    </div>
    <div class="stats__wrapper">
      <Vdaily/>
      <VAchievements/>
    </div>
    <div>
      <VPoints/>
    </div>
  </div>
</template>

<script setup>
import VPoints from "~/src/components/V-points.vue";
import VStatistics from "~/src/components/V-statistics.vue";
import Vdaily from "~/src/components/Vdaily.vue";
import VAchievements from "~/src/components/V-achievements.vue";
</script>

<style scoped>
.uid__container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
}
.ui__statistics {
  flex-grow: 1;
}
.stats__wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 15px;
}


</style>