<template>
	<div v-for="group in easyGroups" :key="group.title" class="achievement-group">
		<div class="group-header">
			<h2 class="group-title">{{ t(group.title) }}</h2>
			<span :class="['group-stats', { 'all-completed': getCompletedCount(group) === group.achievements.length }]">
        {{ getCompletedCount(group) }} / {{ group.achievements.length }}
      </span>
		</div>
		<div class="achievements-list">
			<div v-for="achievement in group.achievements" :key="achievement.id" class="achievement__card">
				<div class="achievement-icon-wrapper">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ achievement.icon }}</span>
					</div>
				</div>
				<div class="achievement-details">
					<h3 class="achievement-title">{{ t(achievement.name) }}</h3>
					<div class="progress-bar-container">
						<div
								class="progress-bar"
								:style="{ width: (achievement.currentProgress / achievement.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overlay">
              {{ achievement.currentProgress }} / {{ achievement.targetProgress }}
            </span>
					</div>
					<p class="achievement-description">{{ t(achievement.description) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAchievementStore } from '../../../store/achievementStore.js'
import { groupedEasyModeAchievements } from '../../achieveGroup/marathon/easyModeAchievment.js'

const { t } = useI18n()
const achievementStore = useAchievementStore()

onMounted(() => {
	achievementStore.initializeProgressTracking()
})

const easyTitles = groupedEasyModeAchievements.map(g => g.title)
const easyGroups = computed(() =>
		achievementStore.groups.filter(g => easyTitles.includes(g.title))
)

const getCompletedCount = group =>
		group.achievements.filter(a => a.currentProgress >= a.targetProgress).length
</script>

<style scoped>
.achievement-group {
  font-family: "Nunito", sans-serif;
  width: 100%;
  margin-bottom: 20px;
}

.group-header {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1),
  0 4px 0 rgb(0, 150, 200);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3),
  inset 0 -2px 4px rgba(0, 0, 0, 0.1),
  0 6px 0 rgb(0, 160, 220);
  background: #00c2ff;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 25px 20px;
  margin-bottom: 20px;
  border-radius: 20px;
}

.group-title {
  font-size: 20px;
  color: white;
  margin-right: 10px;
}

.group-stats {
  display: inline-block;
  padding: 4px 16px;
  font-size: 14px;
  color: #1e1e1e;
  background: #ffffff;
  border-radius: 100px;
  font-weight: 600;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  white-space: nowrap;
  transition: all 0.2s ease;
}

.group-stats.all-completed {
  background: #f1c40f;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  padding: 1px;
}

.achievement__card {
  display: flex;
  align-items: flex-start;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  padding: 1rem;
  gap: 8px;
  border-radius: 20px;
  background-color: var(--menuItemsBg);
  text-align: left;
  width: 650px;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.achievement-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: #fef8e4;
  border-radius: 16px;
  border: 2px solid var(--tabsSlideBorderColor);
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
  font-size: 20px;
  color: var(--titleColor);
  font-weight: 400;
  margin: 0 0 5px 0;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 100px;
  height: 23px;
  margin-bottom: 5px;
  position: relative;
  border: 1px solid #1e1e1e;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #4ade80;
  border-radius: 0;
  transition: width 0.5s ease-in-out;
}

.progress-text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1e1e1e;
  font-size: 0.7rem;
  font-weight: 600;
  text-shadow: none;
  white-space: nowrap;
}

.achievement-description {
  font-size: 13px;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 1280px) {
  .achievement__card {
    width: 100%;
  }
}
</style>
