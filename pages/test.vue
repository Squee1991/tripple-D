<template>
    <div class="page">
        <h1 class="page-title">Трек изучения тем</h1>

        <div class="track-container">
            <div class="track-wrapper">
                <div class="theme-line">
                    <div
                            class="progress-line"
                            :style="{ width: `${(progress / themes.length) * 100}%` }"
                    ></div>

                    <!-- Кнопка СТАРТ -->
                    <div class="theme-point">
                        <div class="circle start-circle">▶</div>
                        <div class="label">Start</div>
                    </div>

                    <!-- Темы -->
                    <div
                            v-for="(item, index) in themes"
                            :key="item.key"
                            class="theme-point"
                    >
                        <div class="circle" :class="{ active: index < progress }">
                            <span class="emoji">{{ item.icon }}</span>
                        </div>
                        <img class="chest" :src="Chest" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { nameMap } from '../utils/nameMap.js'
    import Chest from '../assets/images/chest.svg'
    const progress = ref(2)

    const iconMap = {
        Furniture: '🪑',
        Animals: '🐶',
        Clothes: '👕',
        Food: '🍔',
        Body: '🦵',
        Professions: '👨‍⚕️',
        Transport: '🚗',
        Colors: '🎨',
        Nature: '🌳',
        Home: '🏠',
        Zeit: '⏰',
        City: '🏙️',
        School: '🏫',
        DaysAndMonths: '📅',
        Toys: '🧸',
        CommonItems: '📦',
        BathroomItems: '🛁',
        Kosmetik: '💄',
        Familie: '👨‍👩‍👧‍👦',
        Emotions: '😊',
        Werkzeuge: '🛠️',
        Kitchen: '🍽️',
        Health: '💊',
        Sport: '🏃‍♂️',
        SportEquipment: '🎾',
        Travel: '✈️',
        Musik: '🎵',
        Amount: '🔢',
        Informatik: '💻'
    }

    const themes = Object.entries(nameMap).map(([key, value]) => ({
        key,
        value,
        icon: iconMap[key] || '❓'
    }))
</script>

<style scoped>

    .chest {

        width: 70px;
    }
    .page {
        background: radial-gradient(circle at center, #fffbe6 0%, #fde68a 100%);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 20px;
        box-sizing: border-box;
        font-family: 'Comic Sans MS', 'Segoe UI', cursive;
    }

    .page-title {
        font-size: 36px;
        font-weight: 900;
        color: #92400e;
        margin-bottom: 30px;
        text-shadow: 2px 2px 0px #fcd34d;
    }

    .track-container {
        background: #fff8dc;
        border: 6px double #facc15;
        border-radius: 30px;
        padding: 30px;
        max-width: 100%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        overflow-x: auto;
    }

    .track-wrapper {
        display: flex;
        align-items: center;
        padding-left: 50px;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .theme-line {
        position: relative;
        display: flex;
        align-items: center;
        gap: 80px;
        min-width: max-content;
        padding: 0 20px;
    }

    .theme-line::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 8px;
        background: #d4d4d8;
        border-radius: 4px;
        transform: translateY(-50%);
        z-index: 0;
    }

    .progress-line {
        position: absolute;
        top: 50%;
        left: 0;
        height: 8px;
        background: linear-gradient(90deg, #4ade80, #16a34a);
        border-radius: 4px;
        transform: translateY(-50%);
        z-index: 1;
        transition: width 0.3s ease;
    }

    .theme-point {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .circle {
        width: 130px;
        height: 130px;
        background: #fef08a;
        border: 4px solid #facc15;
        border-radius: 50%;
        color: #333;
        font-weight: bold;
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3), inset -3px -3px 8px #fff;
        transition: all 0.3s ease;
        overflow: hidden;
        padding: 10px;
    }

    .circle.active {
        background: #86efac;
        border-color: #22c55e;
        box-shadow: 0 0 12px #4ade80, inset -2px -2px 8px #fff;
    }

    .start-circle {
        width: 130px;
        height: 130px;
        background: #bae6fd;
        border: 4px solid #0ea5e9;
        border-radius: 30% 60% 50% 40% / 50% 30% 70% 60%;
        font-size: 38px;
        color: #0369a1;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 14px #38bdf8, inset -2px -2px 8px #fff;
        transition: all 0.3s ease;
    }

    .emoji {
        font-size: 48px;
        line-height: 1;
    }

    .label {
        margin-top: 10px;
        font-size: 15px;
        color: #444;
        text-align: center;
        white-space: nowrap;
        line-height: 1;
    }
</style>
