<template>
    <div class="background">
        <div class="main__wrapper">
            <!-- Overlay для модалки авторизации -->
            <div class="overlay" :class="{ show: showAuth }" @click="closeLogin"></div>
            <Transition name="slide-auth">
                <div v-if="showAuth" class="signin-wrapper">
                    <SingIn @success="closeLogin"/>
                </div>
            </Transition>

            <!-- Шапка приложения -->
            <div class="profile-page">
                <div class="top-bar">
                    <div class="app-title">
                        <img class="logoD" :src="logoD" alt="logo"/>
                    </div>
                    <div v-if="userAuth.name" class="user-dropdown" @click="userToggleFoo">
                        <div class="user-info">
                            <img class="user-avatar" :src="avatar" alt="User avatar"/>
                            <span class="user-email">{{ userAuth.email }}</span>
                            <svg class="dropdown-icon" viewBox="0 0 20 20">
                                <path fill="currentColor" d="M5 7l5 5 5-5z"/>
                            </svg>
                        </div>
                        <transition name="fade-slide">
                            <div v-if="menuToggle" class="dropdown-menu" @click.stop>
                                <span class="menu-item" @click.stop="routerPath('cabinet')">🧙 Кабинет</span>
                                <span class="menu-item" @click.stop="userAuth.logOut">🚪 Выход</span>
                            </div>
                        </transition>
                    </div>
                    <div v-else class="logout-button" @click="logIn">Войти</div>
                </div>
            </div>

            <div class="banner-scroll magic-quests">
                <div class="scroll-frame">
                    <div class="banner-decor-top"></div>
                    <div class="banner-content">
                        <div class="sub__title">

                        </div>
                        <div class="banner__sub">

                            <h2 class="magic-quests__title">🗺 Путешествие по волшебным королевствам</h2>
                            <div class="magic-quests__grid">
                                <a class="quest-card" @click="goToSelectedTopics">
                                    <svg class="icon" viewBox="0 0 64 64"><!-- свиток --></svg>
                                    <h3>Выучить новые слова</h3>
                                </a>
                                <a class="quest-card" @click="routerPath('battle')">
                                    <svg class="icon" viewBox="0 0 64 64"><!-- меч --></svg>
                                    <h3>Сразиться с другом</h3>
                                </a>
                                <a class="quest-card" @click="routerPath('shop')">
                                    <svg class="icon" viewBox="0 0 64 64"><!-- мешок монет --></svg>
                                    <h3>Посетить магазин</h3>
                                </a>
                                <a class="quest-card" @click="routerPath('spells')">
                                    <svg class="icon" viewBox="0 0 64 64"><!-- книга заклинаний --></svg>
                                    <h3>Изучить заклинания</h3>
                                </a>
                            </div>
                            <div class="banner__btn">
                                <button v-if="start" @click="handleStart" class="start-button">Начать</button>
                                <button class="start-button" @click="goToSelectedTopics">Начать обучение</button>
                            </div>
                        </div>
                    </div>
                    <div class="banner-decor-bottom"></div>
                </div>
            </div>
            <section class="magic-quests">

            </section>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {userAuthStore} from '../../store/authStore.js'
import SingIn from '../components/logIn.vue'
import {useRouter} from 'vue-router'
import avatar from '../../assets/images/avatar.svg'
import logoD from '../../assets/images/logo DDD.png'

const menuToggle = ref(false)
const userAuth = userAuthStore()
const router = useRouter()
const start = ref(true)
const showAuth = ref(false)

const userToggleFoo = () => {
    menuToggle.value = !menuToggle.value
}

const goToSelectedTopics = () => {
    if (userAuth.name) router.push('/selectedTopics')
    else showAuth.value = true
}

const logIn = () => {
    showAuth.value = true
}

const routerPath = (item) => {
    menuToggle.value = false
    if (item === 'cabinet') router.push('/cabinet')
    else if (item === 'map') router.push('/MapView')
}

const handleStart = () => {
    if (!userAuth.name) showAuth.value = true
    else router.push('/learnmode')
}

const closeLogin = () => {
    showAuth.value = false
    if (userAuth.name) start.value = false
}

watch(showAuth, (val) => {
    document.documentElement.style.overflow = val ? 'hidden' : ''
    document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Kurale&family=Uncial+Antiqua&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,
html {
    overflow-x: hidden;
    font-family: 'Kurale', serif;
}

/* Фон и силует замка */
.background {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: url('../../assets/images/parchment_texture.png') center/cover no-repeat;
    overflow: hidden;
}

.background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('../../assets/images/castle_silhouette.png') bottom center/cover no-repeat;
    opacity: 0.3;
    pointer-events: none;
}

/* Обёртка для всего контента */
.main__wrapper {
    position: relative;
    z-index: 1;
}

/* Заголовок приложения */
.app-title {
    position: relative;
    font-family: 'Uncial Antiqua', serif;
    font-size: 36px;
    color: gold;
    text-shadow: 0 0 12px #fcd000, 0 0 20px #fcd000aa;
}

.app-title::before,
.app-title::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 6px;
    background: linear-gradient(90deg, #f8d67e, #b08d57);
    top: 50%;
    transform: translateY(-50%);
}

.app-title::before {
    left: -25px;
}

.app-title::after {
    right: -25px;
}

/* Логотип */
.logoD {
    max-width: 100px;
}

/* Топ-бар */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 30px;
    background: rgba(30, 18, 5, 0.75);
    border-bottom: 2px solid #b08d57;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    z-index: 10;
}

/* Дропдаун пользователя */
.user-dropdown {
    position: relative;
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #2e2e3e;
    border-radius: 12px;
    box-shadow: 0 0 12px #fcd00066;
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fcd000;
    background: #fff;
}

.user-email {
    font-size: 14px;
    color: #fff8d2;
}

.dropdown-icon {
    width: 16px;
    height: 16px;
    fill: #fcd000;
    transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-icon {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: #1a1a2e;
    border: 2px solid #fcd00055;
    border-radius: 10px;
    margin-top: 4px;
    box-shadow: 0 0 20px #fcd00044;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    z-index: 20;
}

.menu-item {
    padding: 10px 20px;
    color: #fff8d2;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.menu-item:hover {
    background: #fcd00033;
}

/* Кнопка Войти */
.logout-button {
    font-size: 16px;
    padding: 8px 16px;
    background: #2e2e3e;
    color: white;
    border: 1px solid #fcd00066;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s;
}

.logout-button:hover {
    background: #444;
}

/* Баннер */
.banner-scroll {
    width: 100%;
}

.scroll-frame {
    width: 100%;
    padding: 40px;
    background: rgba(255, 250, 240, 0.85);
    border: 4px solid #b08d57;
    border-radius: 16px;
    box-shadow: 0 0 20px #e6cfa1aa;
    min-height: 100vh;
    font-family: 'Cinzel Decorative', serif;
    position: relative;
    color: black;
}

/* Декоративные орнаменты баннера */
.banner-decor-top,
.banner-decor-bottom {
    position: absolute;
    left: 50%;
    width: 120px;
    height: 40px;
    background: url('../../assets/images/ornament.svg') center/contain no-repeat;
    transform: translateX(-50%);
}

.banner-decor-top {
    top: -30px;
}

.banner-decor-bottom {
    bottom: -30px;
    transform: translateX(-50%) rotate(180deg);
}

.banner__btn {
    padding-top: 50px;
    display: flex;
    justify-content: center;
}

/* Кнопки на баннере */
.start-button {
    background: url('../../assets/images/parchment_button.png') center/cover;
    border: none;
    color: #3e2723;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 12px rgba(255, 235, 59, 0.5);
    font-size: 20px;
    padding: 12px 40px;
    border-radius: 20px;
    cursor: pointer;
    text-transform: uppercase;
    font-family: 'Kurale', serif;
    font-weight: 600;
    animation: float 3s ease-in-out infinite, pulseGlow 2s infinite ease-in-out;
    width: 300px;
}

.start-button:hover {
    background: radial-gradient(circle, #55a1bf, #004466);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

/* Анимации для кнопки */
@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

@keyframes pulseGlow {
    0%, 100% {
        box-shadow: 0 0 12px #00ffff44;
    }
    50% {
        box-shadow: 0 0 20px #00ffffaa;
    }
}

.magic-quests {
    padding: 60px 20px;
    background: rgba(255, 250, 240, 0.85);
}

.magic-quests__title {
    font-family: 'Cinzel Decorative', serif;
    text-align: center;
    font-size: 2rem;
    color: #3e2723;
    margin-bottom: 40px;
}

.magic-quests__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 24px;
}

.quest-card {
    background: url('../../assets/images/parchment_texture.png') center/cover no-repeat;
    padding: 24px 16px;
    border-radius: 12px;
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
    text-align: center;
    color: #3e2723;
    text-decoration: none;
    transition: transform .2s, box-shadow .2s;
}

.quest-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.quest-card .icon {
    width: 32px;
    height: 32px;
    fill: #fcd000;
    margin-bottom: 12px;
}

.quest-card h3 {
    font-family: 'Kurale', serif;
    font-size: 1.1rem;
    margin: 0;
}

/* Плавные переходы дропдауна */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>