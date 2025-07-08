<template>
    <header class="header" :class="{isShow : hideHeader}">
        <Uioverlay :visible="showAuth" @close="closeAuth"/>
        <transition name="slide">
            <SignIn v-if="showAuth" @close-auth-form="closeAuth"/>
        </transition>
        <ModalDev
                :visible="showDevModal"
                @close="closeDevModal"
                :title="t('inDevelopment.title')"
                :img="Dev"
                :text="t('inDevelopment.sub')"
        />
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

                        >
                            <NuxtLink v-if="item.url" :to="item.url" class="header-nav__link" @click="closeMobileMenu">
                                {{ t(item.valueKey) }}
                            </NuxtLink>
                            <span @click="handleMenuItemClick(item)" v-else class="header-nav__link">
                                {{ t(item.valueKey) }}
                                <img v-if="item.children"
                                     :class="['header-nav__arrow', { 'header-nav__arrow--active': clickedMenu === item.id }]"
                                     :src="Arrow"
                                     alt=">"
                                >
                            </span>
                            <ul v-if="item.children && (hoveredMenu === item.id || clickedMenu === item.id)"
                                class="header-nav__submenu">
                                <li v-for="child in item.children" :key="child.id" class="header-nav__submenu-item">
                                    <NuxtLink v-if="child.url" :to="child.url" class="header-nav__submenu-link"
                                              @click="closeMobileMenu">
                                        {{ t(child.valueKey) }}
                                    </NuxtLink>
                                    <span v-else class="header-nav__submenu-link"
                                          @click.stop="handleSubmenuItemClick(child)">
                                        {{ t(child.valueKey) }}
                                    </span>
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
                <BurgerMenu
                        class="burger-button"
                        v-model="isMobileMenuOpen"
                />
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
    import ModalDev from '../components/modal.vue'
    import Arrow from '../../assets/images/arrowNav.svg'
    import Dev from '../../assets/images/dev.svg'
    import User from '../../assets/images/account.svg'
    import Logout from '../../assets/images/logout.svg'

    const {t} = useI18n()
    const learningStore = userlangStore()
    const bp = useBreakPointsStore()
    const router = useRouter()
    const userAuth = userAuthStore()

    const hideHeader = ref(false)
    const showAuth = ref(false)
    const menuOpen = ref(false)
    const isMobileMenuOpen = ref(false)
    const hoveredMenu = ref(null)
    const clickedMenu = ref(null)
    const showDevModal = ref(false)

    const dropdownRef = ref(null)
    const dropdownRefNav = ref(null)

    const isDesktop = computed(() => !bp.isMobile);
    const isMobile = computed(() => bp.isMobile);

    const openDevModal = () => showDevModal.value = true
    const closeDevModal = () => showDevModal.value = false

    const handleMenuItemClick = (item) => {
        if (isMobile.value) {
            if (item.children) {
                toggleSubmenu(item.id);
            }
            else if (item.action) {
                item.action();
                closeMobileMenu();
            }

            else if (item.url) {
                closeMobileMenu();
            }
        }
        else {
            if (item.action) {
                item.action();
            }
        }
    }

    const handleSubmenuItemClick = (childItem) => {
        if (childItem.action) {
            childItem.action();
            closeMobileMenu();
            closeSubmenu();
        }
    }

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
            id: 'learn', valueKey: 'nav.training', children: [
                {id: 'learn-tips', url: 'examples', valueKey: 'sub.prev'},
                {id: 'learn-rules', url: 'rules', valueKey: 'sub.rules'},
                {id: 'learn-selectedTopics', url: 'selectedTopics', valueKey: 'sub.artRules'},
                {id: 'cards', url: 'createCards', valueKey: 'sub.card'},
                {id: 'themen', url: 'choiceTheme', valueKey: 'sub.themen'}
            ]
        },
        {
            id: 'duel', valueKey: 'nav.gameMode', children: [
                {id: 'duel-pvp', valueKey: 'nav.pvp', action: openDevModal},
                {id: 'duel-guess', url: 'guess', valueKey: 'nav.guess'},
                {id: 'prepare', url: 'prepare', valueKey: 'nav.marathon'},
                // {id: 'vocabulary', url: 'vocabulary', valueKey: 'nav.sinonim', action: openDevModal}
            ]
        },
        {id: 'achieve', url: 'achievmentsPage', valueKey: 'nav.achieve'},
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
    watch(showDevModal, (val) => {
        document.body.style.overflow = val ? 'hidden' : ''
    })
</script>

<style scoped>

    .header {
        font-family: "Nunito", sans-serif;
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: #fef8e4;
        border-bottom: 4px solid #1e1e1e;

    }

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1280px;
        margin: 0 auto;
        padding: 13px;
    }

    .header-left, .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .logo-img {
        width: 55px;
        height: auto;
        display: block;
        transition: transform 0.2s ease;
    }

    .logo-img:hover {
        transform: rotate(-8deg);
    }

    .header-nav__list {
        display: flex;
        gap: 1rem;
    }

    .header-nav__item {
        position: relative;
    }

    .header-nav__link {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: #1e1e1e;
        font-weight: 400;
        padding: 0.5rem 0.75rem;
        text-decoration: none;
        border-radius: 12px;
        border-bottom: none;
        transition: all 0.2s;
        cursor: pointer;
    }

    .header-nav__link:hover {
        background-color: #f1c40f;
        color: #1e1e1e;
        border-bottom-color: transparent;
    }

    .header-nav__arrow {
        width: 1rem;
        transition: transform 0.2s ease;
    }

    .header-nav__arrow--active {
        transform: rotate(180deg);
    }

    .header-nav__submenu {
        position: absolute;
        top: 100%;
        left: 100%;
        z-index: 110;
        background: #FFFFFF;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 4px 4px 0px #1e1e1e;
        padding: 0.5rem;
        min-width: 240px;
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
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    .header-nav__submenu-link {
        display: block;
        padding: 0.8rem 1rem;
        color: #1e1e1e;
        font-weight: 400;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.2s;
    }

    .header-nav__submenu-link:hover {
        background-color: #fef8e4;
    }

    .articlus__wrapper, .header-user {
        height: 53px;
        display: flex;
        align-items: center;
        background: #fff;
        padding: 0.5rem 1rem;
        border-radius: 12px;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0px #1e1e1e;
    }

    .articlus {
        width: 28px;

    }

    .articlus__counter {
        color: #1e1e1e;
        font-size: 1.2rem;
        font-weight: 400;
    }

    .header-user {
        gap: 0.75rem;
        cursor: pointer;
        position: relative;
        user-select: none;
        height: 53px;
    }

    .header-user__avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid #1e1e1e;
    }

    .header-user__name {
        color: #1e1e1e;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    .header-user__dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        z-index: 110;
        min-width: 100%;
        background: #FFFFFF;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 4px 4px 0px #1e1e1e;
        /*padding: 0.5rem;*/
        overflow: hidden;
    }

    .header-user__dropdown-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.8rem 1rem;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-size: 1rem;
        color: #1e1e1e;
        font-weight: 400;
        font-family: 'Fredoka One', cursive;
        transition: all 0.2s;
        border-radius: 12px;
    }

    .header-user__dropdown-btn:hover {
        background-color: #fef8e4;
    }

    .header-user__dropdown-icon {
        width: 38px;
    }

    .btn-login {
        font-family: 'Fredoka One', cursive;
        padding: 0.8rem 1.5rem;
        font-size: 1.1rem;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        background-color: #f1c40f;
        color: #1e1e1e;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0px #1e1e1e;
    }

    .btn-login:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    .burger-button {
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
    }


    @media (max-width: 1024px) {
        .header-nav {
            display: flex;
            position: fixed;
            top: 84px;
            left: 0;
            width: 100%;
            height: 100%;
            padding-top: 1rem;
            background: #fef8e4;
            flex-direction: column;
            z-index: 1;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
        }

        .header-nav--open {
            transform: translateX(0);
        }

        .header-nav__list {
            flex-direction: column;
            width: 100%;
            padding: 1rem;
        }

        .header-nav__item {
            border-bottom: 3px solid #1e1e1e;
        }

        .header-nav__link {
            font-size: 1.5rem;
            padding: 1rem;
            justify-content: space-between;
        }

        .header-nav__submenu {
            position: static;
            box-shadow: none;
            border: none;
            padding-left: 1.5rem;
            transform: none;
            animation: none;
            background: none;
            opacity: 1;
            pointer-events: auto;
            display: block !important;
        }

        .header-nav__submenu-link {
            padding: 0.8rem 1rem;
            color: #555;
            font-size: 1.2rem;
        }

        .header-nav__arrow {
            transform: rotate(-90deg);
        }

        .header-nav__arrow--active {
            transform: rotate(0deg);
        }

        .articlus__wrapper, .logo-img, .header-user__name, .header__drop-text {
            display: none;
        }

        .burger-button {
            display: block;
            z-index: 102;
        }
    }
</style>