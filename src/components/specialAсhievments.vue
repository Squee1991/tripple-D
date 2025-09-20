<template>
  <div
      v-for="group in achievementGroups"
      :key="group.title"
      class="achievement-group"
  >
    <div class="group-header">
      <h2 class="group-title">{{ t(group.title) }}</h2>
      <span
          :class="[
          'group-stats',
          { 'all-completed': getCompletedCount(group) === group.achievements.length }
        ]"
      >
        {{ getCompletedCount(group) }} / {{ group.achievements.length }}
      </span>
    </div>
    <div class="achievements-list">
      <div
          v-for="achievement in group.achievements"
          :key="achievement.id"
          class="achievement__card"
      >
        <div class="achievement-icon-wrapper special-mode">
          <div class="achievement-icon">
            <span class="icon-emoji">{{ achievement.icon }}</span>
          </div>
        </div>
        <div class="achievement-details">
          <h3 class="achievement-title">{{ t(achievement.name) }}</h3>
          <div class="progress-bar-container">
            <div
                class="progress-bar special-progress"
                :style="{ width: (achievement.currentProgress / achievement.targetProgress * 100) + '%' }"
            ></div>
            <span class="progress-text-overlay">
              {{ achievement.currentProgress }} / {{ achievement.targetProgress }}
            </span>
          </div>
          <p class="achievement-description">{{ t(achievement.description) }}</p>
          <div
              class="achievement-awards"
              v-if="achievement.awards"
          >
            {{ t(achievement.awards) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAchievementStore} from '../../store/achievementStore.js'

const {t} = useI18n()
const achievementStore = useAchievementStore()

const achievementGroups = computed(() =>
    achievementStore.groups.filter(g => g.category === 'special')
)

const getCompletedCount = group =>
    group.achievements.filter(a => a.currentProgress >= a.targetProgress).length
</script>

<style scoped>
.achievement-group {
  margin-bottom: 3rem;
  font-family: "Nunito", sans-serif;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
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
}

.achievements-list {
  display: flex;
  flex-direction: column;
}

.achievement__card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 3px solid #1e1e1e;
  padding: 1rem 1rem 5px 1rem;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 6px 6px 0px #1e1e1e;
  text-align: left;
  transition: all 0.2s ease;
  width: 650px;
  margin-bottom: 20px;
}

.achievement-icon-wrapper.special-mode {
  background: #a855f7;
  width: 70px;
  height: 70px;
  border-radius: 16px;
  border: 3px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-emoji {
  font-size: 40px;
}

.achievement-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.achievement-title {
  font-size: 1.3rem;
  color: #1e1e1e;
  font-weight: 400;
  margin: 0 0 10px 0;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 100px;
  height: 28px;
  margin-bottom: 10px;
  position: relative;
  border: 3px solid #1e1e1e;
  overflow: hidden;
}

.progress-bar.special-progress {
  height: 100%;
  border-radius: 0;
  background: #a855f7;
  transition: width 0.5s ease-in-out;
}

.progress-text-overlay {
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

.achievement-description {
  font-size: 0.95rem;
  color: #555;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
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

@media (max-width: 1280px) {
  .achievement__card {
    width: 100%;
  }
}
</style>
