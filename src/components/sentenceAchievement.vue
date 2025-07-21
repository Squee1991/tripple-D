<template>
    <div v-for="group in achievementGroups" :key="group.title" class="achievement-group">
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
    import { ref, onUnmounted, watch } from 'vue';
    import { sentenceAchievement as staticAchievements } from '../achieveGroup/sentenceDuel/sentenceAchievementsА1.js';
    import { userAuthStore } from '../../store/authStore.js';
    import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

    const { t } = useI18n();
    const authStore = userAuthStore();
    const db = getFirestore();

    const achievementGroups = ref([]);
    let unsubscribeFromAchievements = null;

    const updateAchievements = (userStats) => {
        const updatedGroups = staticAchievements.map(group => {
            const levelMatch = group.title.match(/(A1|A2|B1|B2)/);
            if (!levelMatch) {
                return { ...group, achievements: group.achievements.map(a => ({...a, currentProgress: 0}))};
            }
            const level = levelMatch[0];

            const updatedAchievements = group.achievements.map(ach => {
                const newAch = { ...ach };
                const statType = newAch.id.split('_')[1];
                let currentProgress = 0;

                if (userStats && userStats[level] && userStats[level][statType]) {
                    currentProgress = userStats[level][statType];
                }

                newAch.currentProgress = Math.min(currentProgress, newAch.targetProgress);
                return newAch;
            });
            return { ...group, achievements: updatedAchievements };
        });
        achievementGroups.value = updatedGroups;
    };

    watch(() => authStore.uid, (newUid) => {
        if (unsubscribeFromAchievements) {
            unsubscribeFromAchievements();
            unsubscribeFromAchievements = null;
        }
        if (newUid) {
            const userDocRef = doc(db, 'users', newUid);
            unsubscribeFromAchievements = onSnapshot(userDocRef, (docSnap) => {
                console.log("Компонент получил обновление через watch!");
                if (docSnap.exists() && docSnap.data().achievements) {
                    updateAchievements(docSnap.data().achievements);
                } else {
                    updateAchievements(null);
                }
            });
        } else {
            updateAchievements(null);
        }
    }, { immediate: true });

    onUnmounted(() => {
        if (unsubscribeFromAchievements) {
            unsubscribeFromAchievements();
        }
    });

    const getCompletedCount = (group) => {
        if (!group.achievements) return 0;
        return group.achievements.filter(ach => ach.currentProgress >= ach.targetProgress).length;
    };

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
        font-size: 2rem;
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
        padding: 1rem;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 6px 6px 0px #1e1e1e;
        text-align: left;
        transition: all 0.2s ease;
        width: 650px;
        margin-bottom: 20px;
    }
    .achievement-icon-wrapper {
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
        margin: 0;
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
        font-size: 0.9rem;
        font-weight: 400;
        text-shadow: none;
        white-space: nowrap;
    }
    .achievement-description {
        font-size: 0.95rem;
        color: #555;
        font-family: "Nunito", sans-serif;
        font-weight: 500;
        margin: 0;
        line-height: 1.4;
    }
    @media (max-width: 1280px ) {
        .achievement__card {
            width: 100%;
        }
    }
</style>