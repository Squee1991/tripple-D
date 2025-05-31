<template>
    <header class="magic-header">
        <div class="header-bar">
            <img class="logo" :src="logoD" alt="Logo"/>
            <div v-if="userAuth.name" class="user-info" @click="toggleMenu">
                <img class="avatar" :src="avatar" alt="User avatar"/>
                <span class="user-email">{{ userAuth.email }}</span>
                <svg class="icon" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M5 7l5 5 5-5z"/>
                </svg>
                <transition name="fade">
                    <div v-if="menuOpen" class="dropdown">
                        <span @click.stop="goTo('cabinet')">🧙 Кабинет</span>
                        <span @click.stop="userAuth.logOut">🚪 Выход</span>
                    </div>
                </transition>
            </div>
            <button v-else class="login-btn" @click="openAuth">Войти</button>
        </div>

        <div class="hero">
            <h1 class="hero-title">Путешествие по миру артиклей Der Die Das</h1>
            <button class="start-btn" @click="startLearning">Начать обучение</button>
        </div>

        <Transition name="slide">
            <div v-if="showAuth" class="auth-overlay" @click.self="closeAuth">
                <SingIn @success="closeAuth"/>
            </div>
        </Transition>
    </header>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {userAuthStore} from '../../store/authStore'
import SingIn from '../components/logIn.vue'
import logoD from '../../assets/images/logo DDD.png'
import avatar from '../../assets/images/avatar.svg'

const router = useRouter()
const userAuth = userAuthStore()
const showAuth = ref(false)
const menuOpen = ref(false)

const toggleMenu = () => menuOpen.value = !menuOpen.value
const goTo = (page) => {
    menuOpen.value = false
    router.push(`/${page}`)
}
const openAuth = () => showAuth.value = true
const closeAuth = () => showAuth.value = false
const startLearning = () => {
    userAuth.name ? router.push('/selectedTopics') : openAuth()
}

watch(showAuth, (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kurale&family=Cinzel+Decorative&family=Uncial+Antiqua&display=swap');

.magic-header {
    background: url('../../assets/images/header-bg.png') center/cover no-repeat;
    padding-bottom: 60px;
}

.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(30, 18, 5, 0.8);
    border-bottom: 2px solid #b08d57;
    box-shadow: 0 4px 10px #0006;
}

.logo {
    max-height: 60px;
    filter: drop-shadow(0 0 6px #fcd000aa);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #2e2e3e;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 0 12px #fcd00066;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #fcd000;
    background: #fff;
}

.user-email {
    color: #fff8d2;
    font-size: 14px;
}

.icon {
    width: 16px;
    height: 16px;
    fill: #fcd000;
    transition: transform 0.3s;
}

.user-info:hover .icon {
    transform: rotate(180deg);
}

.dropdown {
    position: absolute;
    top: 100%;
    right: 2rem;
    background: #1a1a2e;
    border: 2px solid #fcd00055;
    border-radius: 10px;
    margin-top: 0.5rem;
    box-shadow: 0 0 20px #fcd00044;
    display: flex;
    flex-direction: column;
    min-width: 160px;
    z-index: 10;
}

.dropdown span {
    padding: 0.75rem 1rem;
    color: #fff8d2;
    cursor: pointer;
}

.dropdown span:hover {
    background: #fcd00033;
}

.login-btn {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background: #2e2e3e;
    border: 1px solid #fcd00066;
    color: white;
    border-radius: 10px;
    cursor: pointer;
}

.hero {
    text-align: center;
    padding: 4rem 2rem;
}

.hero-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #3e2723;
}

.start-btn {
    background: linear-gradient(90deg, #55a1bf, #004466);
    padding: 1rem 2.5rem;
    color: wheat;
    border-radius: 20px;
    font-family: 'Kurale', serif;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.start-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

.auth-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

/* Анимации */
.fade-enter-active, .fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

.slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
