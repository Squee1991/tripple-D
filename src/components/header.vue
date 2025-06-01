<template>
    <header class="magic-header">
        <div class="header-bar">
            <img class="logo" :src="logoD" alt="Logo" />

            <div v-if="userAuth.name" class="user-info" @click="toggleMenu">
                <img class="avatar" :src="avatar" alt="User avatar" />
                <span class="user-email">{{ userAuth.email }}</span>
                <svg class="icon" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M5 7l5 5 5-5z" />
                </svg>
                <transition name="fade">
                    <div v-if="menuOpen" class="dropdown">
                        <button @click.stop="goTo('cabinet')">Кабинет</button>
                        <button @click.stop="userAuth.logOut">Выход</button>
                    </div>
                </transition>
            </div>

            <button v-else class="login-btn" @click="openAuth">Войти</button>
        </div>

        <div class="hero">
            <h1 class="hero-title">
                Учите <span class="highlight">Der</span> <span class="highlight">Die</span> <span class="highlight">Das</span>
                с волшебством
            </h1>
            <p class="hero-subtitle">Освой артикли через магию, заклинания и ежедневную практику</p>
            <button class="start-btn" @click="startLearning">Начать путь</button>
        </div>

        <transition name="slide">
            <div v-if="showAuth" class="auth-overlay" @click.self="closeAuth">
                <SignIn @success="closeAuth" />
            </div>
        </transition>
    </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthStore } from '../../store/authStore'
import SignIn from '../components/logIn.vue'
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

.magic-header {
    background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
    font-family: 'Inter', sans-serif;
    border-bottom: 1px solid #dbeafe;
}

.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    position: relative;
    z-index: 10;
}

.logo {
    height: 48px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    position: relative;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #d1d5db;
    background: #fff;
}

.user-email {
    color: #111827;
    font-size: 14px;
}

.icon {
    width: 16px;
    height: 16px;
    fill: #6b7280;
    transition: transform 0.3s;
}

.user-info:hover .icon {
    transform: rotate(180deg);
}

.dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    margin-top: 0.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-width: 160px;
}

.dropdown button {
    padding: 0.75rem 1rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
}

.dropdown button:hover {
    background-color: #f3f4f6;
}

.login-btn {
    background: none;
    border: 1px solid #6366f1;
    color: #6366f1;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.login-btn:hover {
    background-color: #6366f1;
    color: white;
}

.hero {
    text-align: center;
    padding: 4rem 2rem;
}

.hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
}

.highlight {
    color: #6366f1;
    font-weight: 800;
}

.hero-subtitle {
    font-size: 1.1rem;
    color: #475569;
    margin-bottom: 2rem;
}

.start-btn {
    background-color: #6366f1;
    color: white;
    padding: 0.85rem 2.2rem;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    cursor: pointer;
    transition: background 0.3s ease, box-shadow 0.3s ease;
}

.start-btn:hover {
    background-color: #4f46e5;
    box-shadow: 0 0 28px rgba(99, 102, 241, 0.5);
}

.auth-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

/* Animations */
.fade-enter-active, .fade-leave-active,
.slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to,
.slide-enter-from, .slide-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
