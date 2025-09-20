<template>
  <div class="achievements">
    <div
        v-for="group in overGroups"
        :key="group.id"
        class="achievement-group-container"
    >
      <div class="group-header">
        <h2 class="group-title">{{ t(group.title) }}</h2>
        <span :class="[ 'group-stats', { 'all-completed': completedCount(group) === group.achievements.length }]"
        >
          {{ completedCount(group) }} / {{ group.achievements.length }}
        </span>
      </div>
      <div class="achievements-card-container">
        <div
            v-for="item in group.achievements"
            :key="item.id"
            class="achievement__card"
        >
          <div class="achievement-icon-wrapper-overall">
            <span class="icon-img-overall">{{ item.icon }}</span>
          </div>
          <div class="achievement-details-overall">
            <h3 class="achievement-title-overall">{{ t(item.name) }}</h3>
            <div class="progress-bar-overall-container">
              <div
                  class="progress-bar-overall"
                  :style="{ width: (item.currentProgress / item.targetProgress * 100) + '%' }"
              ></div>
              <span class="progress-text-overall">
                {{ item.currentProgress }} / {{ item.targetProgress }}
              </span>
            </div>
            <p class="achievement-description-overall">
              {{ t(item.description) }}
            </p>
            <div class="achievement-awards" v-if="item.awards"> {{ t(item.awards) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAchievementStore } from '../../store/achievementStore.js'
const { t } = useI18n()
const achievementStore = useAchievementStore()
const overGroups = computed(() => achievementStore.groups.filter(g => g.category === 'nominativ'))
const completedCount = group => group.achievements.filter(a => a.currentProgress >= a.targetProgress).length

onMounted(() => {
  achievementStore.initializeProgressTracking()
})

</script>


<style scoped>

.achievements {
  font-family: "Nunito", sans-serif;
  width: 100%;
}

.achievement-group-container {
  margin-bottom: 2.5rem;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px dashed rgba(27, 27, 27, 0.5);
}

.group-title {
  font-size: 1.8rem;
  color: #1e1e1e;
  margin: 0;
}

.group-stats {
  display: inline-block;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 400;
  color: #1e1e1e;
  background: #ffffff;
  border-radius: 100px;
  border: 3px solid #1e1e1e;
  box-shadow: 2px 2px 0px #1e1e1e;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.group-stats.all-completed {
  background: #f1c40f;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.achievements-card-container {
  display: flex;
  flex-direction: column;
}

.achievement__card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 3px solid #1e1e1e;
  padding: 1rem;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 6px 6px 0px #1e1e1e;
  text-align: left;
  width: 650px;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}

.achievement-icon-wrapper-overall {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  background: #fef8e4;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-img-overall {
  font-size: 40px;
}

.achievement-details-overall {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.achievement-title-overall {
  font-size: 1.3rem;
  color: #1e1e1e;
  font-weight: 400;
  margin: 0 0 10px 0;
}

.progress-bar-overall-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 100px;
  height: 28px;
  margin-bottom: 10px;
  position: relative;
  border: 3px solid #1e1e1e;
  overflow: hidden;
}

.progress-bar-overall {
  height: 100%;
  background: #4ade80;
  border-radius: 0;
  transition: width 0.5s ease-in-out;
}

.progress-text-overall {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1e1e1e;
  font-size: 0.9rem;
  font-weight: 400;
  text-shadow: none;
  white-space: nowrap;
}

.achievement-description-overall {
  font-size: 0.95rem;
  color: #555;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}
.achievement-awards {
  text-align: center;
  font-size: 13px;
  color: white;
  margin-top: 10px;
  background: black;
  padding: 5px;
  border-radius: 10px;
}

@media (max-width: 1280px ) {
  .achievement__card {
    width: 100%;
  }
}

</style>