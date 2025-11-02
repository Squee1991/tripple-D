<template>
    <header class="header" :class="{ 'mobile-menu-active': isMobileMenuOpen }">
        <div v-if="isMobileMenuOpen" class="mobile-nav-overlay" @click="isMobileMenuOpen = false"></div>
        <UiOverlay :visible="showAuth" @close="closeAuth"/>
        <transition name="slide">
            <SignIn v-if="showAuth" @close-auth-form="closeAuth"/>
        </transition>
        <ModalDev
                :visible="showDevModal"
                @close="closeDevModal"
                :title="modalConfig.title"
                :img="modalConfig.img"
                :text="modalConfig.text"
                :button="modalConfig.isEvent ? modalConfig.button : null"
                @button="onDevModalButton"
        />
        <div class="header-container">
            <NuxtLink to="/" class="logo" aria-label="German Corner — Home">
                <span class="logo__name">German</span>
                <NuxtImg
                        src="/images/logo/Logo.png"
                        alt="German Corner"
                        class="logo__img"
                        format="webp"
                        loading="eager"
                        fetchpriority="high"
                />
                <span class="logo__name">corner</span>
            </NuxtLink>
            <nav ref="dropdownRefNav" class="header-nav" :class="{ 'is-open': isMobileMenuOpen, 'is-rtl': isAr }"
                 aria-label="Main">
                <ul class="header-nav__list">
                    <li v-for="item in menuItems" :key="item.id" class="header-nav__item">
                        <NuxtLink v-if="item.url" :to="item.url" class="header-nav__link" @click="closeAllMenus">
                            {{ t(item.valueKey) }}
                        </NuxtLink>
                        <button v-else @click="handleMenuItemClick(item)" class="header-nav__link"
                                :class="{'is-active-parent': clickedMenu === item.id}">
                            <span>{{ t(item.valueKey) }}</span>
                            <img
                                    v-if="item.children"
                                    :class="['header-nav__arrow', { 'rotated': clickedMenu === item.id }]"
                                    :src="Arrow"
                                    alt="Arrow__icon"
                            />
                        </button>
                        <ul v-if="item.children && clickedMenu === item.id" class="header-nav__submenu">
                            <li v-for="child in item.children" :key="child.id" class="header-nav__submenu-item">
                                <NuxtLink v-if="child.url" :to="child.url" class="header-nav__submenu-link"
                                          @click="closeAllMenus">
                                    {{ t(child.valueKey) }}
                                </NuxtLink>
                                <button v-else class="header-nav__submenu-link"
                                        @click.stop="handleSubmenuItemClick(child)">
                                    <span>{{ t(child.valueKey) }}</span>
                                    <img
                                            v-if="child.subChildren"
                                            :class="['header-nav__arrow', { 'rotated': clickedSubChild === child.id }]"
                                            :src="Arrow"
                                            alt="Arrow_icon"
                                    />
                                </button>
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
            <div class="header-right">
                <div class="header-nav__tea">
                    <ForTea/>
                </div>
                <div class="header-nav__lang">
                    <LanguageSelector/>
                </div>
                <div v-if="userAuth.name" class="header-user-wrapper">
                    <button
                            ref="userBtnRef"
                            class="header-user"
                            @click="toggleMenu"
                            aria-haspopup="true"
                            :aria-expanded="menuOpen.toString()"
                            aria-controls="user-menu-dropdown"
                    >
                        <img class="header-user__avatar" :src="userAuth.avatarUrl" alt="User avatar"/>
                        <span class="header-user__name">{{ userAuth.email }}</span>
                        <img :class="['header-nav__arrow', { 'rotated': menuOpen }]" :src="Arrow" alt="Arrow"/>
                    </button>
                    <div
                            ref="dropdownRef"
                            v-if="menuOpen"
                            class="header-user__dropdown"
                            id="user-menu-dropdown"
                    >
                        <button
                                v-for="item in menuActions"
                                :key="item.id"
                                class="header-user__dropdown-btn"
                                @click.stop="item.action"
                        >
                            <img class="header-user__dropdown-icon" :src="item.icon" alt="Arrow_dropdown"/>
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
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {userAuthStore} from '../../store/authStore.js'
import {useBreakPointsStore} from '../../store/breakPointsStore.js'

import SignIn from '../components/logIn.vue'
import LanguageSelector from '../components/langSwitcher.vue'
import ForTea from '../components/forTea.vue'
import BurgerMenu from '../components/burgerMenu.vue'
import UiOverlay from '../components/Uioverlay.vue'
import ModalDev from '../components/modal.vue'

import Arrow from '../../assets/images/arrowNav.svg'
import Dev from '../../assets/images/dev.svg'
import User from '../../assets/images/account.svg'
import Logout from '../../assets/images/logout.svg'
import PadLock from '../../assets/images/padlock.svg'


const router = useRouter()
const {t, locale} = useI18n()
const bp = useBreakPointsStore()
const userAuth = userAuthStore()

const showAuth = ref(false)
const menuOpen = ref(false)
const isMobileMenuOpen = ref(false)

const clickedMenu = ref(null)
const clickedSubChild = ref(null)

const showDevModal = ref(false)
const modalType = ref(null)

const userBtnRef = ref(null)
const dropdownRef = ref(null)
const dropdownRefNav = ref(null)
const isAr = computed(() => locale.value === 'ar')
const isMobile = computed(() => bp.isMobile)

const modalConfig = computed(() => {
    switch (modalType.value) {
        case 'dev':
            return {
                isEvent: false,
                title: t('inDevelopment.title'),
                text: t('inDevelopment.sub'),
                button: null,
                img: Dev,
            }
        case 'eventLocked':
            return {
                isEvent: true,
                title: t('eventLocked.title'),
                text: t('eventLocked.text'),
                button: {label: t('eventLocked.btn'), to: '/calendar'},
                img: PadLock,
            }
        default:
            return {isEvent: false, title: '', text: '', button: null, img: Dev}
    }
})

const menuItems = computed(() => {
    const items = [
        ...(userAuth.uid
            ? [
                {
                    id: 'learn',
                    valueKey: 'nav.training',
                    children: [
                        {
                            id: 'articles',
                            valueKey: 'sub.articles',
                            subChildren: [
                                {id: 'learn-tips', url: '/article-basic', valueKey: 'underSub.prev'},
                                {id: 'learn-rules', url: '/article-theory', valueKey: 'underSub.rules'},
                                {id: 'learn-selectedTopics', url: '/articles', valueKey: 'underSub.artRules'},
                            ],
                        },
                        {
                            id: 'verbs',
                            valueKey: 'sub.verbs',
                            subChildren: [
                                {id: 'verb-theory', url: '/verbs-theory', valueKey: 'underSub.verbsTheory'},
                                {id: 'tenses', url: '/tenses', valueKey: 'underSub.verbFirst'},
                                {id: 'modalVerbs', url: '/modal-verbs', valueKey: 'underSub.verbSecond'},
                                {id: 'verb-types', url: '/verb-types', valueKey: 'underSub.verbTypes'},
                            ],
                        },
                        {
                            id: 'prepositions',
                            valueKey: 'sub.prepositions',
                            subChildren: [
                                {id: 'prepositions-theory', url: '/prepositions-theory', valueKey: 'underSub.rules'},
                                {id: 'prepositions-practice', url: '/prepositions', valueKey: 'underSub.prepositions'},
                            ],
                        },
                        {
                            id: 'adjectives',
                            valueKey: 'sub.adjectives',
                            subChildren: [
                                {
                                    id: 'adjectives-theory',
                                    url: '/adjectives-theory',
                                    valueKey: 'underSub.adjectiveTheory'
                                },
                                {
                                    id: 'adjectives-basic',
                                    url: '/adjective-basics',
                                    valueKey: 'underSub.adjectivesBasic'
                                },
                                {id: 'declination', url: '/adjective-declension', valueKey: 'underSub.declination'},
                                {id: 'comparison', url: '/adjective-comparison', valueKey: 'underSub.comparison'},
                            ],
                        },
                        {id: 'themen', url: '/thematic-learning', valueKey: 'sub.themen'},
                        {id: 'cards', url: '/create-cards', valueKey: 'sub.card'},
                        {id: 'idioms', url: '/idioms', valueKey: 'sub.idioms'},
                    ],
                },
                {
                    id: 'duel',
                    valueKey: 'nav.gameMode',
                    children: [
                        {id: 'duel-pvp', valueKey: 'sub.pvp', action: openDevModal},
                        {id: 'wordDuel', url: '/sentence-duel', valueKey: 'sub.wordDuel'},
                        {id: 'quests', url: '/recipes', valueKey: 'sub.quests'},
                        {id: 'duel-guess', url: '/guess-word', valueKey: 'sub.guess'},
                        {id: 'articlemarathon', url: '/article-marathon', valueKey: 'sub.marathon'},
                    ],
                },
            ]
            : [
                {id: 'about', valueKey: 'nav.about', url: '/info-about'},
                {id: 'contact', valueKey: 'nav.contact', url: '/support-request'},
                {id: 'faq', valueKey: 'nav.quest', url: '/faq'},
            ]),
        ...(userAuth.uid ? [{id: 'test', url: '/exams', valueKey: 'nav.tests'}] : []),
    ]

  if (userAuth.uid) {
    const allEvents = [
      { id: 'winter-event', valueKey: 'eventsNavNames.winter', url: '/event-winter', isEvent: true, eventKey: 'winter', startDate: '24.12', endDate: '01.02' },
      { id: 'valentine', valueKey: 'eventsNavNames.valentine', url: '/event-valentine', isEvent: true, eventKey: 'valentine', startDate: '14.02', endDate: '16.02' },
      { id: 'april', valueKey: 'eventsNavNames.firstApril', url: '/event-joke', isEvent: true, eventKey: 'fools', startDate: '01.04', endDate: '01.04' },
      { id: 'halloween', valueKey: 'eventsNavNames.halloween', url: '/event-halloween', isEvent: true, eventKey: 'pumpkin', startDate: '29.10', endDate: '31.10' },
    ]
    const processedEvents = allEvents.map(event => ({
      ...event,
      url: isEventActive(event.startDate, event.endDate) ? event.url : null,
    }))
    items.push(
        { id: 'events', valueKey: 'nav.events', children: processedEvents }
    )}
  return items
})

const menuActions = ref([
  { id: 'cabinet', label: 'auth.cabinet', icon: User, action: () => goTo('cabinet') },
  { id: 'logout', label: 'auth.logOut', icon: Logout, action: () => userAuth.logOut() },
])

const closeAllMenus = () => {
  isMobileMenuOpen.value = false
  clickedMenu.value = null
  clickedSubChild.value = null
}

const openDevModal = () => openModal('dev')
const openModal = (type) => {
  modalType.value = type
  showDevModal.value = true
}

const openEventLockedModal = () => openModal('eventLocked')

const onDevModalButton = () => {
  const btn = modalConfig.value.button
  if (!modalConfig.value.isEvent || !btn?.to) return
  showDevModal.value = false
  router.push(btn.to)
}

const closeDevModal = () => {
  showDevModal.value = false
  modalType.value = null
}

const closeAuth = () => (showAuth.value = false)
const openAuth = () => (showAuth.value = true)

const toggleMenu = () => (menuOpen.value = !menuOpen.value)

const goTo = (page) => {
  menuOpen.value = false
  router.push({ path: `/${page}` })
}

const handleMenuItemClick = (item) => {
  if (item.children) {
    clickedMenu.value = clickedMenu.value === item.id ? null : item.id
    clickedSubChild.value = null
  } else if (item.action) {
    item.action()
    closeAllMenus()
  } else if (item.url) {
    closeAllMenus()
  }
}

const handleSubmenuItemClick = (childItem) => {
  if (childItem.isEvent && !childItem.url) {
    openEventLockedModal()
    return
  }
  if (childItem.subChildren) {
    clickedSubChild.value = clickedSubChild.value === childItem.id ? null : childItem.id
  } else if (childItem.action) {
    childItem.action()
    closeAllMenus()
  } else if (childItem.url) {
    closeAllMenus()
  }
}

const isEventActive = (startDateStr, endDateStr) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  today.setHours(0, 0, 0, 0)

  const [startDay, startMonth] = startDateStr.split('.').map(Number)
  const [endDay, endMonth] = endDateStr.split('.').map(Number)

  let startDate = new Date(currentYear, startMonth - 1, startDay)
  let endDate = new Date(currentYear, endMonth - 1, endDay)

  if (startDate > endDate) {
    if (today.getMonth() < startDate.getMonth()) {
      startDate.setFullYear(currentYear - 1)
    } else {
      endDate.setFullYear(currentYear + 1)
    }
  }
  return today >= startDate && today <= endDate
}

const handleClickOutside = (event) => {
  if (
      menuOpen.value &&
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target) &&
      userBtnRef.value &&
      !userBtnRef.value.contains(event.target)
  ) {
    menuOpen.value = false
  }
  if (clickedMenu.value && dropdownRefNav.value && !dropdownRefNav.value.contains(event.target)) {
    closeAllMenus()
  }
}

watch(showAuth, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(showDevModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(isMobile, (isNowMobile) => {
  if (!isNowMobile) closeAllMenus()
})

watch(isMobileMenuOpen, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.body.style.overflow = ''
})
</script>
<style scoped>
.header-user-wrapper {
  position: relative;
}

.header {
  font-family: "Nunito", sans-serif;
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: var(--bg);
  border-bottom: 4px solid var(--borderBottom);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: 6px 0 0 var(--bg);
}

.logo {
  display: flex;
  align-items: center;
}

.logo__img {
  width: 62px;
  height: 62px;
  object-fit: contain;
  display: block;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 13px;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-nav__list {
  display: flex;
  gap: 10px;
}

.header-nav__item {
  position: relative;
  display: flex;
}

.header-nav__link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 15px;
  color: black;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;
  border: 2px solid black;
  box-shadow: 4px 4px 0 black;
  background: white;
}

.header-nav__arrow {
  width: 1rem;
  transition: transform 0.3s ease;
  transform: rotate(-90deg);
}

.header-nav__arrow.rotated {
  transform: rotate(0deg);
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
  width: 100%;
  border: none;
  background: none;
  font-size: 16px;
  font-family: "Nunito", sans-serif;
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

.is-rtl .header-nav__submenu-sub {
  left: auto;
  right: 100%;
  margin-left: 0;
  margin-right: 10px;
  box-shadow: 0 4px 4px #1e1e1e;
}

.header-user {
  height: 45px;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0.5rem 0.7rem;
  border-radius: 12px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  cursor: pointer;
}

.header-user {
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  user-select: none;
  font-size: 16px;
}

.header-user__avatar {
  width: 32px;
  height: 32px;
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
  font-family: 'Nunito', sans-serif;
  transition: all 0.2s;
}

.header-user__dropdown-icon {
  width: 36px;
  height: 36px;
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  background-color: #f1c40f;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.burger-button {
  display: none;
}

.mobile-nav-overlay {
  display: none;
}

@media (max-width: 1023px) {
  .header-container {
    padding: 0.5rem 10px;
  }

  .mobile-nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease;
    z-index: 100;
    display: block;
  }

  .header.mobile-menu-active .mobile-nav-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .logo__name { display: none; }
  .logo { opacity: 0; }

  .header-nav__link { color: black; }
  .header__drop-text, .logo-img { display: none; }

  .header-nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    padding: 1.5rem;
    background: var(--bg);
    z-index: 101;
    transform: translateX(-100%);
    transition: transform .2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 5px 0 20px rgba(0,0,0,.2);
    overflow-y: auto;
  }

  .header-nav.is-open {
    transform: translateX(0);
  }

  .header-nav.is-rtl {
    left: auto;
    right: 0;
    transform: translateX(100%);
  }

  .header-nav.is-rtl.is-open {
    transform: translateX(0);
  }

  .header-nav .header-nav__list {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding-top: 48px;
  }

  .header-nav .header-nav__item {
    flex-direction: column;
  }

  .header-nav .header-nav__link {
    font-size: 1rem;
    justify-content: space-between;
    border: 2px solid #1e1e1e;
    background-color: #fff;
    box-shadow: 3px 3px 0 #1e1e1e;
    margin-bottom: 0.5rem;
    padding: 12px;
  }

  .header-nav .header-nav__link.is-active-parent {
    background-color: #f1c40f;
    transform: translate(3px, 3px);
    box-shadow: none;
  }

  .header-nav .header-nav__submenu {
    position: static;
    box-shadow: none;
    border: none;
    padding: 0.5rem 0 0.5rem 1.2rem;
    background: none;
    min-width: auto;
    border-left: 3px solid var(--titleColor);
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .header-nav.is-rtl .header-nav__submenu {
    padding: 0.5rem 1.2rem 0.5rem 0;
    border-left: none;
    border-right: 3px solid var(--titleColor);
    margin-left: 0;
    margin-right: 0.5rem;
  }

  .header-nav .header-nav__submenu-link {
    font-size: 1rem;
    padding: 8px;
    color: #1e1e1e;
    background-color: #fff;
    border: 2px solid #1e1e1e;
    box-shadow: 2px 2px 0 #1e1e1e;
    border-radius: 12px;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
  }

  .header-nav .header-nav__submenu-sub {
    position: static;
    box-shadow: none;
    border: none;
    padding: 5px;
    background: none;
    white-space: normal;
    border-left: 3px solid #cccccc;
    margin-left: 0.5rem;
    margin-bottom: 6px;
  }

  .header-nav.is-rtl .header-nav__submenu-sub {
    border-left: none;
    border-right: 3px solid #cccccc;
    margin-left: 0;
    margin-right: 0.5rem;
  }

  .header-nav .header-nav__submenu-sub .header-nav__submenu-link {
    font-size: 1rem;
    background-color: #f5f5f5;
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

  @media (max-width: 767px) {
    .header-user {
      height: 45px;
      box-shadow: 2px 2px 0 #1e1e1e;
    }

    .header-user__dropdown-icon {
      width: 30px;
      height: 30px;
    }

    .btn-login {
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 2px 2px 0 #1e1e1e;
    }

    .header-right {
      gap: 7px;
    }

    .header-user__avatar {
      width: 30px;
      height: 30px;
      border: 2px solid black;
    }

    .header-nav__link {
      color: #1e1e1e;
    }
  }
}
@media (max-width: 768px){
    .header-nav {
        max-width: 47%;
    }
}
@media (max-width: 500px){
    .header-nav {
        max-width: 100%;
    }
}

@media (max-width: 1200px) {
  .header-user__name,
  .header__drop-text {
    display: none;
  }
}

.logo__name {
  color: #e39910;
  font-family: "Nunito", sans-serif;
  font-weight: bold;
  font-size: 1.1rem;
  font-style: italic;
  letter-spacing: 3px;
  text-shadow: 2px 4px 0px white;
  -webkit-text-stroke: 3px #e39910;
  transition: .5s;
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .header-nav__submenu-link:hover {
    background-color: #fef8e4;
  }
  .header-nav__link:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 black;
    background-color: #f1c40f;
    color: #1e1e1e;
  }
  .header-user__dropdown-btn:hover {
    background-color: #fef8e4;
  }
  .header-nav .header-nav__submenu-link:hover {
    background-color: #fde68a;
  }
  .btn-login:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #1e1e1e;
  }
  .logo__name:hover {
    text-shadow: 2px 4px 2px white;
    transition: .5s;
  }

    .btn-login:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }
}

</style>