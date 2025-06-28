<script setup>
    import {useTrainerStore} from '../store/themenProgressStore.js'
    import {useRouter} from 'vue-router'
    import {ref, onMounted, computed, watch} from 'vue'
    import HomeImg from '../assets/images/home.svg'
    import Clothes from '../assets/images/clothes.svg'
    import Health from '../assets/images/health.svg'
    import Food from '../assets/images/food.svg'
    import Transport from '../assets/images/Transport.svg'
    import Weather from '../assets/images/weather.svg'
    import Purchase from '../assets/images/buy.svg'
    import Family from '../assets/images/family.svg'
    import School from '../assets/images/school.svg'
    import Travel from '../assets/images/travel.svg'
    import Clock from '../assets/images/clock.svg'

    const router = useRouter()
    const trainer = useTrainerStore()
    const themes = [
        {key: 'house', name: 'chooseThemeList.home', img: HomeImg, position: {top: '5%', left: '10%', rotate: '-5deg'}},
        {key: 'zeit', name: 'chooseThemeList.time', img: Clock, position: {top: '25%', left: '55%', rotate: '4deg'}},
        {key: 'family', name: 'chooseThemeList.family', img: Family, position: {top: '2%', left: '60%', rotate: '8deg'}},
        {key: 'food', name: 'chooseThemeList.food', img: Food, position: {top: '45%', left: '13%', rotate: '-3deg'}},
        {key: 'purchases', name: 'chooseThemeList.purchases', img: Purchase, position: {top: '30%', left: '35%', rotate: '-6deg'}},
        {key: 'health', name: 'chooseThemeList.health', img: Health, position: {top: '20%', left: '2%', rotate: '7deg'}},
        {key: 'weather', name: 'chooseThemeList.weather', img: Weather, position: {top: '70%', left: '55%', rotate: '-5deg'}},
        {key: 'clothes', name: 'chooseThemeList.clothes', img: Clothes, position: {top: '48%', left: '65%', rotate: '-3deg'}},
        {key: 'transport', name: 'chooseThemeList.transport', img: Transport, position: {top: '55%', left: '30%', rotate: '4deg'}},
        {key: 'school', name: 'chooseThemeList.school', img: School, position: {top: '68%', left: '5%', rotate: '-8deg'}},
        {key: 'travel', name: 'chooseThemeList.travel', img: Travel, position: {top: '2%', left: '30%', rotate: '3deg'}}
    ]

    const selectedTopic = ref(themes[0].key)
    const jsonData = ref(null)
    const loading = ref(true)
    const selectedLevel = ref(1)
    const topic = computed(() => selectedTopic.value)
    const chalkMessage = ref('')
    const showChalkMessage = ref(false)
    let messageTimeout = null
    const moduleToStart = ref(null)
    const {t} = useI18n()
    const triggerChalkMessage = (text) => {
        clearTimeout(messageTimeout)
        chalkMessage.value = text
        showChalkMessage.value = true
        messageTimeout = setTimeout(() => {
            showChalkMessage.value = false
        }, 3000)
    }

    const selectedLevelObj = computed(() => {
        if (!jsonData.value || !jsonData.value.levels) return null
        return jsonData.value.levels.find(l => l.level === Number(selectedLevel.value))
    })

    const isModuleUnlocked = (level, moduleId) => {
        if (level > 1) return false
        if (moduleId === 1) return true
        return trainer.completedModules.includes(Number(moduleId - 1))
    }

    const isLevelCompleted = (levelNumber) => {
        const level = jsonData.value?.levels.find(l => l.level === levelNumber)
        if (!level) return false
        return level.modules.every(mod => trainer.completedModules.includes(mod.id))
    }

    const selectLevel = (levelNumber) => {
        if (levelNumber > 1 && !isLevelCompleted(levelNumber - 1)) {
            triggerChalkMessage(`${t('chooseTheme.notAllowedLevel')} ${levelNumber - 1}!`)
        } else {
            selectedLevel.value = levelNumber
            moduleToStart.value = null
        }
    }

    const handleModuleClick = (module) => {
        if (isModuleUnlocked(selectedLevel.value, module.id)) {
            moduleToStart.value = module
        } else {
            triggerChalkMessage(t('chooseTheme.notAllowedModule'))
        }
    }

    const goBack = () => {
        router.back()
    }

    const goToExercise = async (level, module) => {
        await trainer.setThemeAndModule(topic.value, level, module.id)
        router.push('/trainer')
    }

    const startSelectedModule = () => {
        if (moduleToStart.value) {
            goToExercise(selectedLevel.value, moduleToStart.value)
        }
    }

    const loadThemeData = async () => {
        loading.value = true
        trainer.topic = topic.value
        await trainer.loadProgress()
        const res = await fetch(`/${topic.value}.json`)
        jsonData.value = await res.json()
        selectedLevel.value = 1
        moduleToStart.value = null
        loading.value = false
    }

    onMounted(loadThemeData)
    watch(topic, loadThemeData)

</script>
<template>
    <div class="classroom-layout">
        <div class="blackboard-wrapper">
            <button class="back-card-button" @click="goBack">
                <div class="pin"></div>
                <span>{{ t('chooseTheme.btnBack')}}</span>
            </button>
            <div class="blackboard">
                <transition name="chalk-fade">
                    <div v-if="showChalkMessage" class="chalk-message">
                        {{ chalkMessage }}
                    </div>
                </transition>
                <div v-if="jsonData" class="blackboard-content">
                    <div class="level-selector">
                        <button
                                v-for="level in jsonData.levels"
                                :key="level.level"
                                class="level-btn"
                                :class="{ 'active': selectedLevel === level.level }"
                                @click="selectLevel(level.level)"
                        >
                            {{ t('chooseTheme.level')}} {{ level.level }}
                        </button>
                    </div>
                    <div class="modules-grid" v-if="selectedLevelObj">
                        <button
                                v-for="mod in selectedLevelObj.modules"
                                :key="mod.id"
                                class="module-btn"
                                :class="{
                        'locked': !isModuleUnlocked(selectedLevelObj.level, mod.id),
                        'selected': moduleToStart && mod.id === moduleToStart.id
                     }"
                                @click="handleModuleClick(mod)"
                        >
							{{ t('chooseTheme.module')}} {{ mod.id }}
                        </button>
                    </div>
                    <div class="start-button-container" v-if="moduleToStart">
                        <button class="start-button" @click="startSelectedModule">
							{{ t('chooseTheme.btnStart')}}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="corkboard">
            <h2 class="corkboard-title">{{ t('chooseTheme.choose')}}</h2>
            <div class="corkboard-themes">
                <button
                        v-for="theme in themes"
                        :key="theme.key"
                        class="theme-card"
                        :class="{ active: theme.key === selectedTopic }"
                        :style="{ top: theme.position.top, left: theme.position.left, transform: `rotate(${theme.position.rotate})` }"
                        @click="selectedTopic = theme.key"
                >
                    <div class="pin"></div>
                    <img :src="theme.img" :alt="theme.name"/>
                    <span>{{ t(theme.name) }}</span>
                </button>
            </div>
        </div>
    </div>

</template>

<style>
    :root {
        --classroom-bg: #f0ebe5;
        --blackboard-bg: #2c3e50;
        --corkboard-bg: #d2b48c;
        --chalk-color: #ecf0f1;
        --chalk-yellow: #f1c40f;
    }

    .blackboard-wrapper {
        flex: 2;
        background: #5D4037;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        position: relative;
    }

    .blackboard {
        flex: 1;
        background: var(--blackboard-bg);
        border: 10px solid #34495e;
        border-radius: 5px;
        padding: 2rem;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
        position: relative;
    }

    .back-card-button {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 20;
        background: #fff8e1;
        border: 1px solid #ccc;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        padding: 10px 20px;
        transform: rotate(-4deg);
        transition: transform 0.2s ease-in-out;
    }

    .back-card-button:hover {
        transform: rotate(0deg) scale(1.05);
    }

    .back-card-button .pin {
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 16px;
        background: #e53935;
        border-radius: 50%;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
        border: 2px solid #fff;
    }

    .back-card-button span {
        font-size: 1.1rem;
        color: #333;
        font-weight: 600;
    }

    .classroom-layout {
        display: flex;
        height: 100vh;
        padding: 2rem;
        gap: 2rem;
        overflow: hidden;
    }

    .blackboard-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-top: 30px;
    }

    .level-selector {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .level-btn {
        color: var(--chalk-color);
        background: transparent;
        border: 2px solid transparent;
        padding: 0.5rem 1rem;
        font-size: 1.2rem;
        border-radius: 5px;
        cursor: pointer;
    }

    .level-btn.active {
        border-color: var(--chalk-yellow);
        color: var(--chalk-yellow);
    }

    .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 1.5rem;
    }

    .module-btn {
        color: var(--chalk-color);
        background: transparent;
        border: 2px dashed #7f8c8d;
        padding: 1.5rem 0.5rem;
        font-size: 1.1rem;
        border-radius: 8px;
        cursor: pointer;
    }

    .module-btn:hover:not(.locked) {
        border-style: solid;
        border-color: var(--chalk-color);
    }

    .module-btn.locked {
        color: #7f8c8d;
        cursor: pointer;
        opacity: 0.6;
    }

    .chalk-message {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%) rotate(-4deg);
        color: var(--chalk-yellow);
        font-family: 'Caveat', cursive;
        font-size: 1.8rem;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 100;
        text-align: center;
        pointer-events: none;
    }

    .chalk-fade-enter-active,
    .chalk-fade-leave-active {
        transition: opacity 0.4s ease;
    }

    .chalk-fade-enter-from,
    .chalk-fade-leave-to {
        opacity: 0;
    }

    .corkboard {
        flex: 1;
        background: var(--corkboard-bg);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        position: relative;
    }

    .corkboard-title {
        font-family: 'Caveat', cursive;
        font-size: 2.5rem;
        text-align: center;
        color: #4a3c2a;
        margin-bottom: 1rem;
    }

    .corkboard-themes {
        position: relative;
        height: calc(100% - 60px);
    }

    .theme-card {
        position: absolute;
        width: 120px;
        height: 120px;
        background: #fff8e1;
        border: 1px solid #ccc;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        transition: all 0.2s ease-in-out;
    }

    .theme-card:hover {
        transform: scale(1.1) !important;
        z-index: 10;
    }

    .theme-card.active {
        box-shadow: 0 0 15px 5px #fdd835;
        border: 2px solid #fdd835;
        z-index: 5;
    }

    .theme-card .pin {
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 16px;
        background: #e53935;
        border-radius: 50%;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
        border: 2px solid #fff;
    }

    .theme-card img {
        width: 50px;
        height: 50px;
    }

    .theme-card span {
        font-size: 1rem;
        color: #333;
        font-weight: 600;
    }

    .module-btn.selected {
        border-style: solid;
        border-color: var(--chalk-yellow);
        background-color: rgba(241, 196, 15, 0.1);
    }

    .start-button-container {
        margin-top: auto;
        padding-top: 2rem;
        text-align: center;
    }

    .start-button {
        background: none;
        border: 3px solid var(--chalk-yellow);
        color: var(--chalk-yellow);
        padding: 0.8rem 2.5rem;
        font-size: 1.8rem;
        font-family: 'Caveat', cursive;
        border-radius: 8px;
        cursor: pointer;
        text-transform: uppercase;
        transform: rotate(-3deg);
        transition: all 0.2s ease-in-out;
    }

    .start-button:hover {
        background: var(--chalk-yellow);
        color: #2c3e50;
        transform: rotate(0deg) scale(1.05);
    }
</style>