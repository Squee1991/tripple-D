<template>
    <header class="header">
        <Uioverlay :visible="showAuth" @close="closeAuth"/>
        <transition name="slide">
            <SignIn v-if="showAuth" @close-auth-form="closeAuth"/>
        </transition>
        <div class="header-container">
            <div class="header-left">
                <NuxtLink to="/" class="header-logo">
                    <img class="logo-img" src="../../assets/images/3dLogo.png" alt="Logo">
                </NuxtLink>
                <nav
                        ref="dropdownRefNav"
                        class="header-nav"
                        :class="{ 'header-nav--open': isMobileMenuOpen }"
                >
                    <ul class="header-nav__list">
                        <li
                                v-for="item in menuItems"
                                :key="item.id"
                                class="header-nav__item"
                                @mouseover="isDesktop ? openSubmenu(item.id) : null"
                                @mouseleave="isDesktop ? closeSubmenu() : null"
                                @click="isMobile ? toggleSubmenu(item.id) : null"
                        >
                            <NuxtLink v-if="!item.children" :to="item.url" class="header-nav__link"
                                      @click="closeMobileMenu">{{ t(item.valueKey) }}
                            </NuxtLink>
                            <span v-else class="header-nav__link">
                        {{ t(item.valueKey) }}
                        <img
                                :class="['header-nav__arrow', { 'header-nav__arrow--active': clickedMenu === item.id }]"
                                :src="Arrow"
                                alt=">"
                        >
                     </span>
                            <ul v-if="item.children && (hoveredMenu === item.id || clickedMenu === item.id)"
                                class="header-nav__submenu">
                                <li v-for="child in item.children" :key="child.id" class="header-nav__submenu-item">
                                    <NuxtLink :to="child.url" class="header-nav__submenu-link" @click="closeMobileMenu">
                                        {{ t(child.valueKey) }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>

            <div class="header-right">
                <div class="header-nav__tea">
                    <ForTea/>
                </div>
                <div class="articlus__wrapper">
                    <img class="articlus" src="../../assets/images/articlus.png" alt="">
                    <div class="articlus__counter">{{ learningStore.points }}</div>
                </div>
                <div class="header-nav__lang">
                    <LanguageSelector/>
                </div>
                <div
                        ref="dropdownRef"
                        v-if="userAuth.name"
                        class="header-user"
                        @click="toggleMenu"
                >
                    <img class="header-user__avatar" :src="userAuth.avatarUrl" alt="User avatar"/>
                    <span class="header-user__name">{{ userAuth.email }}</span>
                    <img
                            :class="['header-nav__arrow', { 'header-nav__arrow--active': menuOpen }]"
                            :src="Arrow"
                            alt="v"
                    >
                    <div v-if="menuOpen" class="header-user__dropdown">
                        <button
                                v-for="item in menuActions"
                                :key="item.id"
                                class="header-user__dropdown-btn"
                                @click.stop="item.action"
                        >
                            <img class="header-user__dropdown-icon" :src="item.icon" alt="">
                            <span class="header__drop-text">{{ item.label }}</span>
                        </button>
                    </div>
                </div>
                <button
                        v-else
                        class="btn-login"
                        @click="openAuth"
                >
                    {{ t('auth.logIn') }}
                </button>
                <button class="burger-button" @click="toggleMobileMenu">
                    <BurgerMenu :modelValue="isMobileMenuOpen"/>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
    import {ref, watch, onMounted, onBeforeUnmount, computed} from 'vue'
    import {useRouter} from 'vue-router'
    import {useI18n} from 'vue-i18n'
    import {userAuthStore} from '../../store/authStore.js'
    import {userlangStore} from '../../store/learningStore.js'
    import {useBreakPointsStore} from '../../store/breakPointsStore.js'
    import SignIn from '../components/logIn.vue'
    import LanguageSelector from '../components/langSwitcher.vue'
    import ForTea from '../components/forTea.vue'
    import BurgerMenu from '../components/burgerMenu.vue'
    import Uioverlay from '../components/Uioverlay.vue'
    import Arrow from '../../assets/images/arrowNav.svg'
    import User from '../../assets/images/user.svg'
    import Logout from '../../assets/images/logout.svg'

    const {t} = useI18n()
    const learningStore = userlangStore()
    const bp = useBreakPointsStore()
    const router = useRouter()
    const userAuth = userAuthStore()

    const showAuth = ref(false)
    const menuOpen = ref(false)
    const isMobileMenuOpen = ref(false)
    const hoveredMenu = ref(null)
    const clickedMenu = ref(null)

    const dropdownRef = ref(null)
    const dropdownRefNav = ref(null)

    const isDesktop = computed(() => !bp.isMobile);
    const isMobile = computed(() => bp.isMobile);

    const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
        if (!isMobileMenuOpen.value) {
            clickedMenu.value = null;
        }
    }

    const closeMobileMenu = () => {
        if (isMobile.value) {
            isMobileMenuOpen.value = false;
            clickedMenu.value = null;
        }
    }

    const openSubmenu = (id) => {
        if (isDesktop.value) {
            hoveredMenu.value = id;
        }
    }
    const closeSubmenu = () => {
        if (isDesktop.value) {
            hoveredMenu.value = null;
        }
    }

    const toggleSubmenu = (id) => {
        if (isMobile.value) {
            clickedMenu.value = clickedMenu.value === id ? null : id
        }
    }

    const closeAuth = () => showAuth.value = false
    const openAuth = () => showAuth.value = true

    const menuItems = [
        {
            id: 'learn', valueKey: 'nav.training', icon: Arrow, children: [
                {id: 'learn-tips', url: 'examples', valueKey: 'sub.prev'},
                {id: 'learn-rules', url: 'rules', valueKey: 'sub.rules'},
                {id: 'learn-selectedTopics', url: 'selectedTopics', valueKey: 'sub.artRules'},
                {id: 'cards', url: 'createCards', valueKey: 'sub.card'},
                {id: 'themen', url: 'choiceTheme', valueKey: 'sub.themen'}
            ]
        },
        {
            id: 'duel', valueKey: 'nav.gameMode', icon: Arrow, children: [
                {id: 'duel-pvp', url: 'duel', valueKey: 'nav.pvp'},
                {id: 'duel-guess', url: 'guess', valueKey: 'nav.guess'},
                {id: 'prepare', url: 'prepare', valueKey: 'nav.marathon'},
                {id: 'vocabulary', url: 'vocabulary', valueKey: 'nav.sinonim'}
            ]
        },
        {id: 'achieve', url: 'achievmentsPage', valueKey: 'nav.achieve'},
        {id: 'about', url: 'about', valueKey: 'nav.about'},
        {id: 'stats', url: 'stats', valueKey: 'nav.stats'}
    ]
    const menuActions = ref([
        {id: 'cabinet', label: 'Кабинет', icon: User, action: () => goTo('cabinet')},
        {id: 'logout', label: 'Выход', icon: Logout, action: () => userAuth.logOut()}
    ])

    const toggleMenu = () => menuOpen.value = !menuOpen.value
    const goTo = (page) => {
        menuOpen.value = false
        router.push({path: `/${page}`})
    }

    const handleClickOutside = (event) => {
        if (menuOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
            menuOpen.value = false
        }
        if (isDesktop.value && hoveredMenu.value && dropdownRefNav.value && !dropdownRefNav.value.contains(event.target)) {
            hoveredMenu.value = null
        }
    }

    onMounted(() => {
        document.addEventListener('mousedown', handleClickOutside)
    })
    onBeforeUnmount(() => {
        document.removeEventListener('mousedown', handleClickOutside)
    })
    watch(showAuth, (val) => {
        document.body.style.overflow = val ? 'hidden' : ''
    })
</script>

<style scoped>
    .header {
        font-family: 'Nunito', sans-serif;
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: #FFFFFF;
        border-bottom: 1px solid #E2E8F0;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
    }

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1280px;
        margin: 0 auto;
        padding: 0.75rem 1.5rem;
    }

    .header-left, .header-right {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .header-logo {
        flex-shrink: 0;
    }
    .logo-img {
        width: 60px;
        height: auto;
        display: block;
    }

    .header-nav__list {
        display: flex;
        gap: 1.5rem;
    }

    .header-nav__item {
        position: relative;
        padding-bottom: 0.75rem;
        margin-bottom: -0.75rem;
    }

    .header-nav__link {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: #4A5568;
        font-weight: 600;
        padding: 0.5rem 0.25rem;
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: color 0.2s, border-color 0.2s;
        cursor: pointer;
    }
    .header-nav__link:hover {
        color: #2D3748;
        border-bottom-color: #5A67D8;
    }

    .header-nav__arrow {
        width: 1rem;
        transition: transform 0.2s ease;
        opacity: 0.6;
    }
    .header-nav__arrow--active {
        transform: rotate(180deg);
    }

    .header-nav__submenu {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
        padding: 0.5rem;
        min-width: 220px;
        z-index: 110;
        opacity: 0;
        pointer-events: none;
        animation: menu-pop 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-play-state: paused;
    }

    .header-nav__item:hover .header-nav__submenu {
        pointer-events: auto;
        animation-play-state: running;
    }

    @keyframes menu-pop {
        from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .header-nav__submenu-link {
        display: block;
        padding: 0.6rem 1rem;
        color: #4A5568;
        font-weight: 600;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.2s;
    }
    .header-nav__submenu-link:hover {
        background-color: #F7FAFC;
        color: #5A67D8;
    }

    .articlus__wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .articlus { width: 32px; }
    .articlus__counter { color: #5A67D8; font-size: 1.1rem; font-weight: 700; }

    .header-user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        position: relative;
        user-select: none;
    }
    .header-user__avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #E2E8F0;
    }
    .header-user__name {
        color: #2D3748;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    .header-user__dropdown {
        position: absolute;
		width: 100%;
        top: calc(100% + 0.75rem);
        right: 0;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
        min-width: 200px;
        z-index: 110;
        overflow: hidden;
    }
    .header-user__dropdown-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.8rem 1rem;
        background: none;
        border: none;
        border-bottom: 1px solid #F7FAFC;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-size: 1rem;
        color: #4A5568;
        font-weight: 600;
        transition: all 0.2s;
    }
    .header-user__dropdown-btn:last-child { border-bottom: none; }
    .header-user__dropdown-btn:hover { background-color: #F7FAFC; color: #5A67D8; }
    .header-user__dropdown-icon { width: 20px; }

    .btn-login { /* Переименовал для ясности */
        font-family: 'Nunito', sans-serif;
        padding: 0.6rem 1.25rem;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        background-color: #5A67D8;
        color: #FFFFFF;
    }
    .btn-login:hover {
        background-color: #4C51BF;
    }

    .burger-button {
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        z-index: 101;
    }

    @media (max-width: 1024px) {
        .header-container { gap: 1rem; }
        .header-nav {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding-top: 6rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(5px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            z-index: 100;
            overflow-y: auto;
        }
        .header-nav--open { display: flex; }
        .header-nav__list { flex-direction: column; width: 100%; padding: 2rem; gap: 0.5rem; }
        .header-nav__item { width: 100%; border-bottom: 1px solid #E2E8F0; padding-bottom: 0; margin-bottom: 0; }
        .header-nav__link { width: 100%; justify-content: space-between; padding: 1rem; font-size: 1.2rem; }
        .header-nav__link:hover { background-color: #F7FAFC; border-bottom-color: transparent; }
        .header-nav__arrow { transform: rotate(-90deg); }
        .header-nav__arrow--active { transform: rotate(0deg); }
        .header-nav__submenu {
            position: static;
            box-shadow: none;
            border: none;
            padding-left: 1.5rem;
            margin-top: 0;
            transform: none;
            animation: none;
            background: none;
            opacity: 1;
            pointer-events: auto;
            display: block !important;
        }
        .header-nav__submenu-link { padding: 0.75rem 1rem; color: #718096; }

        .header-nav__lang, .header-user__name { display: none; }
        .burger-button { display: block; }
        .header-right { gap: 1rem; }
    }
    @media (max-width: 768px) {
        .header-nav__tea, .articlus__wrapper {
            display: none;
        }
    }
</style>