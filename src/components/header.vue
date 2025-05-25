<template>
    <div class="background">
        <div class="main__wrapper">
            <div class="overlay" :class="{ show: showAuth }" @click="closeLogin"></div>
            <Transition name="slide-auth">
                <div v-if="showAuth" class="signin-wrapper">
                    <SingIn @success="closeLogin"/>
                </div>
            </Transition>
            <div class="profile-page">
                <div class="top-bar">
                    <div class="app-title">Der Die Das</div>
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

            <div class="banner-scroll">
                <div class="scroll-frame">
                    <div class="sub__title">
                        <img src="../../assets/images/ddd.png" alt="Логотип"/>
                    </div>
                    <div class="banner__sub">
                        <div class="banner__title">
                            <span class="bold_1">Der</span> <span class="bold_2">Die</span> <span
                                class="bold_3">Das</span>
                            - сайт для изучения артиклей существительных в немецком языке
                        </div>
                        <div class="banner__btn">
                            <button v-if="start" @click="handleStart" class="start-button">
                                {{ userAuth.name ? 'Начать' : 'Начать' }}
                            </button>
                            <button class="start-button" @click="goToSelectedTopics">Начать обучение</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {userAuthStore} from '../../store/authStore.js'
import SingIn from '../components/logIn.vue'
import {useRouter} from 'vue-router'
import avatar from '../../assets/images/avatar.svg'

const menuToggle = ref(false)
const userAuth = userAuthStore()
const router = useRouter()
let start = ref(true)
const isStarted = ref(false)
const showAuth = ref(false)

const userToggleFoo = () => {
    menuToggle.value = !menuToggle.value
}

const goToSelectedTopics = () => {
    if (userAuth.name) {
        router.push('/selectedTopics')
    } else {
        showAuth.value = true
    }
}

const logIn = () => {
    showAuth.value = true
}

const routerPath = (item) => {
    menuToggle.value = false
    if (item === 'cabinet') {
        router.push('/cabinet')
    } else if (item === 'map') {
        router.push('/MapView')
    }
}

const handleStart = () => {
    if (!userAuth.name) {
        showAuth.value = true
    } else {
        router.push('/learnmode')
    }
}

const closeLogin = () => {
    showAuth.value = false
    if (userAuth.name) {
        start.value = false
        isStarted.value = true
    }
}

watch(showAuth, (val) => {
    if (val) {
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
    } else {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
    }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Kurale&family=Uncial+Antiqua&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body, html {
    overflow-x: hidden;
    font-family: 'Kurale', serif;
}

/*.background {*/
/*    width: 100%;*/
/*    background: url('@/assets/images/magic_background.jpg') center/cover no-repeat;*/
/*    padding: 20px;*/
/*    color: white;*/
/*}*/

.app-title {
    font-family: 'Uncial Antiqua', serif;
    font-size: 36px;
    color: gold;
    text-shadow: 0 0 12px #fcd000, 0 0 20px #fcd000aa;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 30px;
    background: transparent;
    position: relative;
    z-index: 10;
}

.user-dropdown {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
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
    padding: 0;
    display: flex;
    flex-direction: column;
    z-index: 20;
    width: 100%;
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

.banner-scroll {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.scroll-frame {
    background: #f5deb380;
    border: 8px solid #d2b48c;
    border-radius: 24px;
    box-shadow: 0 0 20px #e6cfa1aa;
    padding: 40px;
    max-width: 1100px;
    width: 100%;
    font-family: 'Cinzel Decorative', serif;
    color: black;
}

.sub__title img {
    display: block;
    margin: 0 auto 20px;
    max-width: 300px;
    box-shadow: 0 0 20px #fcd00055;
    border-radius: 12px;
}

.banner__title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px #00000077;
}

.bold_1 {
    color: black;
    font-weight: 600;
    font-size: 40px;
}

.bold_2 {
    color: red;
    font-weight: 600;
    font-size: 40px;
}

.bold_3 {
    color: #fcd000;
    font-weight: 600;
    font-size: 40px;
}

.banner__btn {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.start-button {
    background: rgba(255, 255, 255, 0.1);
    border: 3px solid #55a1bf;
    font-size: 20px;
    padding: 12px 40px;
    border-radius: 20px;
    cursor: pointer;
    color: black;
    text-transform: uppercase;
    font-family: 'Kurale', serif;
    font-weight: 600;
    box-shadow: 0 0 12px #00ffff44;
    animation: float 3s ease-in-out infinite, pulseGlow 2s infinite ease-in-out;
    position: relative;
    width: 300px;
}

.start-button:hover {
    background: radial-gradient(circle, #55a1bf, #004466);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

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
