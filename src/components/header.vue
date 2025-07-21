<template>
    <header class="header">
        <div v-if="isMobileMenuOpen" class="mobile-nav-overlay" @click="isMobileMenuOpen = false"></div>
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
                    <img class="logo-img" src="../../assets/images/3dLogo.png" alt="Logo"/>
                </NuxtLink>
                <nav ref="dropdownRefNav" class="header-nav" :class="{ 'is-open': isMobileMenuOpen }">
                    <ul class="header-nav__list">
                        <li v-for="item in menuItems" :key="item.id" class="header-nav__item">
                            <NuxtLink v-if="item.url" :to="item.url" class="header-nav__link" @click="closeAllMenus">
                                {{ t(item.valueKey) }}
                            </NuxtLink>
                            <span v-else @click="handleMenuItemClick(item)" class="header-nav__link">
                                <span>{{ t(item.valueKey) }}</span>
                                <img
                                        v-if="item.children"
                                        :class="['header-nav__arrow', { 'rotated': clickedMenu === item.id }]"
                                        :src="Arrow"
                                        alt=">"
                                />
                            </span>
                            <ul v-if="item.children && clickedMenu === item.id" class="header-nav__submenu">
                                <li v-for="child in item.children" :key="child.id" class="header-nav__submenu-item">
                                    <NuxtLink v-if="child.url" :to="child.url" class="header-nav__submenu-link"
                                              @click="closeAllMenus">
                                        {{ t(child.valueKey) }}
                                    </NuxtLink>
                                    <span v-else class="header-nav__submenu-link"
                                          @click.stop="handleSubmenuItemClick(child)">
                                        <span>{{ t(child.valueKey) }}</span>
                                        <img
                                                v-if="child.subChildren"
                                                :class="['header-nav__arrow', { 'rotated': clickedSubChild === child.id }]"
                                                :src="Arrow"
                                                alt=""
                                        />
                                    </span>
                                    <ul v-if="child.subChildren && clickedSubChild === child.id"
                                        class="header-nav__submenu-sub">
                                        <li v-for="sub in child.subChildren" :key="sub.id"
                                            class="header-nav__submenu-sub-item">
                                            <NuxtLink :to="sub.url" class="header-nav__submenu-link"
                                                      @click="closeAllMenus">
                                                {{ t(sub.valueKey) }}
                                            </NuxtLink>
                                        </li>
                                    </ul>
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
                    <img class="articlus" src="../../assets/images/articlus.png" alt=""/>
                    <div class="articlus__counter">{{ learningStore.points }}</div>
                </div>
                <div class="header-nav__lang">
                    <LanguageSelector/>
                </div>
                <div v-if="userAuth.name" class="header-user" @click="toggleMenu">
                    <img class="header-user__avatar" :src="userAuth.avatarUrl" alt="User avatar"/>
                    <span class="header-user__name">{{ userAuth.email }}</span>
                    <img :class="['header-nav__arrow', { 'rotated': menuOpen }]" :src="Arrow" alt="v"/>
                    <div ref="dropdownRef" v-if="menuOpen" class="header-user__dropdown">
                        <button
                                v-for="item in menuActions"
                                :key="item.id"
                                class="header-user__dropdown-btn"
                                @click.stop="item.action"
                        >
                            <img class="header-user__dropdown-icon" :src="item.icon" alt=""/>
                            <span class="header__drop-text">{{ t(item.label) }}</span>
                        </button>
                    </div>
                </div>
                <button v-else class="btn-login" @click="openAuth">
                    {{ t('auth.logIn') }}
                </button>
                <BurgerMenu class="burger-button" v-model="isMobileMenuOpen"/>
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
    const clickedMenu = ref(null)
    const showDevModal = ref(false)
    const clickedSubChild = ref(null)

    const dropdownRef = ref(null)
    const dropdownRefNav = ref(null)
    const isMobile = computed(() => bp.isMobile);

    watch(isMobileMenuOpen, (newVal) => {
        if (newVal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    watch(showAuth, (val) => {
        document.body.style.overflow = val ? 'hidden' : ''
    })
    watch(showDevModal, (val) => {
        document.body.style.overflow = val ? 'hidden' : ''
    })
    watch(isMobile, (isNowMobile) => {
        if (!isNowMobile) {
            closeAllMenus();
        }
    });

    const closeAllMenus = () => {
        isMobileMenuOpen.value = false;
        clickedMenu.value = null;
        clickedSubChild.value = null;
    }

    const handleMenuItemClick = (item) => {
        if (item.children) {
            clickedMenu.value = clickedMenu.value === item.id ? null : item.id;
            clickedSubChild.value = null;
        } else if (item.action) {
            item.action();
            closeAllMenus();
        } else if (item.url) {
            closeAllMenus();
        }
    }

    const handleSubmenuItemClick = (childItem) => {
        if (childItem.subChildren) {
            clickedSubChild.value = clickedSubChild.value === childItem.id ? null : childItem.id;
        } else if (childItem.action) {
            childItem.action();
            closeAllMenus();
        } else if (childItem.url) {
            closeAllMenus();
        }
    }

    const openDevModal = () => showDevModal.value = true
    const closeDevModal = () => showDevModal.value = false

    const closeAuth = () => showAuth.value = false
    const openAuth = () => showAuth.value = true

    const menuItems = [
        {
            id: 'learn', valueKey: 'nav.training', children: [
                {
                    id: 'articles', valueKey: 'sub.articles', subChildren: [
                        {id: 'learn-tips', url: 'examples', valueKey: 'underSub.prev'},
                        {id: 'learn-rules', url: 'rules', valueKey: 'underSub.rules'},
                        {id: 'learn-selectedTopics', url: 'articles', valueKey: 'underSub.artRules'},]
                },
                {
                    id: "verbs", valueKey: 'sub.verbs', subChildren: [
                        {id: 'tenses', url: 'tenses', valueKey: 'underSub.verbFirst'},
                        {id: 'modalVerbs', url: 'modal-verbs', valueKey: 'underSub.verbSecond',},
                    ]
                },
                {
                    id: 'adjectives', valueKey: 'sub.adjectives', subChildren: [
                        {id: 'adjectives-basic' , url: 'adjective-basics' , valueKey: 'underSub.adjectivesBasic'},
                        {id: 'declination' , url: 'adjective-declension' , valueKey: 'underSub.declination'},
                        {id: 'comparison' , url: 'adjective-comparison' , valueKey: 'underSub.comparison'},
                    ]
                },
                {id: 'cards', url: 'createCards', valueKey: 'sub.card'},
                {id: 'themen', url: 'thematic-learning', valueKey: 'sub.themen'}
            ]
        },
        {
            id: 'duel', valueKey: 'nav.gameMode', children: [
                {id: 'duel-pvp', valueKey: 'sub.pvp', action: openDevModal},
                {id: 'wordDuel', url: 'play', valueKey: 'sub.wordDuel'},
                {id: 'wordDuel', url: 'recipes', valueKey: 'sub.quests'},
                {id: 'duel-guess', url: 'guess', valueKey: 'sub.guess'},
                {id: 'prepare', url: 'prepare', valueKey: 'sub.marathon'},
            ]
        },
        {id: 'achieve', url: '/achievements', valueKey: 'nav.achieve'},
        {id: 'stats', url: '/stats', valueKey: 'nav.stats'}
    ]

    const menuActions = ref([
        {id: 'cabinet', label: 'auth.cabinet', icon: User, action: () => goTo('cabinet')},
        {id: 'logout', label: 'auth.logOut', icon: Logout, action: () => userAuth.logOut()}
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
        if (clickedMenu.value && dropdownRefNav.value && !dropdownRefNav.value.contains(event.target)) {
            closeAllMenus();
        }
    }

    onMounted(() => {
        document.addEventListener('mousedown', handleClickOutside)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.body.style.overflow = '';
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
        font-weight: 600;
        padding: 0.5rem 0.75rem;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.2s;
        cursor: pointer;
        user-select: none;
    }

    .header-nav__link:hover {
        background-color: #f1c40f;
        color: #1e1e1e;
    }

    .header-nav__arrow {
        width: 1rem;
        transition: transform 0.3s ease;
    }

    .header-nav__arrow.rotated {
        transform: rotate(90deg);
    }

    .header-nav__submenu {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        z-index: 110;
        background: #FFFFFF;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 4px 4px 0px #1e1e1e;
        padding: 0.5rem;
        min-width: 240px;
    }

    .header-nav__submenu-item {
        position: relative;
    }

    .header-nav__submenu-link {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 1rem;
        color: #1e1e1e;
        font-weight: 600;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.2s;
        user-select: none;
    }

    .header-nav__submenu-link:hover {
        background-color: #fef8e4;
    }

    .header-nav__submenu-sub {
        position: absolute;
        top: -0.5rem;
        left: 100%;
        margin-left: 10px;
        padding: 0.5rem;
        background: #fff;
        border: 3px solid #1e1e1e;
        border-radius: 12px;
        box-shadow: 4px 4px 0px #1e1e1e;
        white-space: nowrap;
        z-index: 120;
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
        font-weight: 600;
    }

    .header-user {
        gap: 0.75rem;
        cursor: pointer;
        position: relative;
        user-select: none;
    }

    .header-user__avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid #1e1e1e;
    }

    .header-user__name {
        color: #1e1e1e;
        font-weight: 600;
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
        font-weight: 600;
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
        font-family: "Nunito", sans-serif;
        font-style: italic;
        font-weight: 600;
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
    }

    .mobile-nav-overlay {
        display: none;
    }

    @media (max-width: 1024px) {
        .header-container {
            padding: 0.5rem 1rem;
        }

        .mobile-nav-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .header.mobile-menu-active .mobile-nav-overlay {
            opacity: 1;
            pointer-events: auto;
        }

        .header-nav {
            display: block;
        }

        .header-nav:not(.is-open) {
            pointer-events: none;
        }

        .articlus__wrapper, .header-user__name, .header__drop-text {
            display: none;
        }

        .logo-img {
            display: none
        }

        .header-nav {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            max-width: 100%;
            padding: 1.5rem;
            background: #fef8e4;
            z-index: 101;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
        }

        .header-nav.is-open {
            transform: translateX(0);
            pointer-events: auto;
        }

        .header-nav .header-nav__list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
            padding-top: 40px;
        }

        .header-nav .header-nav__item {
            border-bottom: 2px solid rgba(30, 30, 30, 0.1);
        }

        .header-nav .header-nav__link {
            font-size: 1.3rem;
            padding: 1rem 0.5rem;
            justify-content: space-between;
        }

        .header-nav .header-nav__submenu {
            position: static;
            box-shadow: none;
            border: none;
            padding: 0.5rem 0 0.5rem 1.5rem;
            animation: none;
            background: none;
            opacity: 1;
            pointer-events: auto;
            min-width: auto;
        }

        .header-nav .header-nav__submenu-link {
            padding: 0.75rem;
            color: #444;
            font-size: 1.1rem;
        }

        .header-nav .header-nav__submenu-sub {
            position: static;
            box-shadow: none;
            border: none;
            padding: 0.5rem 0 0.5rem 1rem;
            background: none;
            white-space: normal;
        }

        .header-nav .header-nav__submenu-sub .header-nav__submenu-link {
            font-size: 1rem;
            color: #777;
            padding: 0.5rem;
        }

        .header-nav .header-nav__arrow {
            transform: rotate(-90deg);
        }

        .header-nav .header-nav__arrow.rotated {
            transform: rotate(0deg);
        }

        .burger-button {
            display: block;
            z-index: 102;
        }
    }
</style>