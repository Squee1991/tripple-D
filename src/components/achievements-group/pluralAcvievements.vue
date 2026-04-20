<template>
	<div
			v-for="group in pluralGroups"
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
					v-for="ach in group.achievements"
					:key="ach.id"
					class="achievement__card"
			>
				<div class="achievement-icon-wrapper">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ ach.icon }}</span>
					</div>
				</div>
				<div class="achievement-details">
					<h3 class="achievement-title">{{ t(ach.name) }}</h3>
					<div class="progress-bar-container">
						<div
								class="progress-bar"
								:style="{ width: (ach.currentProgress / ach.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overlay">
              {{ ach.currentProgress }} / {{ ach.targetProgress }}
            </span>
					</div>
					<p class="achievement-description">{{ t(ach.description) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAchievementStore } from '../../../store/achievementStore.js'
import { pluraGroupAchievment } from '../../achieveGroup/article/plural.js'

const { t } = useI18n()
const achievementStore = useAchievementStore()

const targetTitles = pluraGroupAchievment.map(g => g.title)

const pluralGroups = computed(() =>
		achievementStore.groups.filter(g =>
				targetTitles.includes(g.title)
		)
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
  display: flex;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 3px dashed rgba(27, 27, 27, 0.5);
}

.group-title {
  font-size: 20px;
  color: var(--titleColor);
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
  border: 3px solid #1e1e1e;
  box-shadow: 2px 2px 0px #1e1e1e;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.group-stats.all-completed {
  background: #60a5fa;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.achievements-list {
  display: flex;
  flex-direction: column;
}

.achievement__card {
  display: flex;
  align-items: flex-start;
  border: 2px solid #1e1e1e;
  padding: 1rem;
  gap: 8px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 3px 3px 0px #1e1e1e;
  text-align: left;
  width: 650px;
  transition: all 0.2s ease;
  margin-bottom: 10px;
  overflow: hidden;
}

.achievement-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: #60a5fa;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
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
  color: #1e1e1e;
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
  background: #60a5fa;
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
  color: #555;
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
