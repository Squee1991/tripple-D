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
        :title="t('inDevelopment.title')"
        :img="Dev"
        :text="t('inDevelopment.sub')"
    />
    <div class="header-container">
      <NuxtLink to="/">
        <span class="logo__name">LEXINGO</span>
      </NuxtLink>
      <nav ref="dropdownRefNav" class="header-nav" :class="{ 'is-open': isMobileMenuOpen }">
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
                  alt=">"
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
                      alt=""
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
        <VTips
            :title="articleData.title"
            :tips="articleData.tips"
            v-model="isArticleOpen"
        />
        <button v-if="userAuth.uid" @click="openArticleModal" class="articlus__wrapper">
          <img class="articlus" src="../../assets/images/articlus.png" alt="Articlus"/>
          <span class="articlus__counter">{{ learningStore.points }}</span>
        </button>
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
            <img :class="['header-nav__arrow', { 'rotated': menuOpen }]" :src="Arrow" alt="v"/>
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
import UiOverlay from '../components/Uioverlay.vue'
import ModalDev from '../components/modal.vue'
import Arrow from '../../assets/images/arrowNav.svg'
import Dev from '../../assets/images/dev.svg'
import User from '../../assets/images/account.svg'
import Logout from '../../assets/images/logout.svg'
import VTips from "~/src/components/V-tips.vue";

const {t} = useI18n()
const learningStore = userlangStore()
const bp = useBreakPointsStore()
const router = useRouter()
const userAuth = userAuthStore()
const showAuth = ref(false)
const menuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const clickedMenu = ref(null)
const showDevModal = ref(false)
const clickedSubChild = ref(null)
const userBtnRef = ref(null);
const dropdownRef = ref(null)
const dropdownRefNav = ref(null)
const isArticleOpen = ref(false)
const isMobile = computed(() => bp.isMobile);

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
const menuItems = computed(() => [
  ...(userAuth.uid ?
          [
            {
              id: 'learn',
              valueKey: 'nav.training',
              children: [
                {
                  id: 'articles',
                  valueKey: 'sub.articles',
                  subChildren: [
                    {id: 'learn-tips', url: 'examples', valueKey: 'underSub.prev'},
                    {id: 'learn-rules', url: 'rules', valueKey: 'underSub.rules'},
                    {id: 'learn-selectedTopics', url: 'articles', valueKey: 'underSub.artRules'},
                  ]
                },
                {
                  id: 'verbs',
                  valueKey: 'sub.verbs',
                  subChildren: [
                    {id: 'verb-theory', url: 'verbs-theory', valueKey: 'underSub.verbsTheory'},
                    {id: 'tenses', url: 'tenses', valueKey: 'underSub.verbFirst'},
                    {id: 'modalVerbs', url: 'modal-verbs', valueKey: 'underSub.verbSecond'},
                    {id: 'verb-types', url: 'verb-types', valueKey: 'underSub.verbTypes'},
                  ]
                },
                {
                  id: 'adjectives',
                  valueKey: 'sub.adjectives',
                  subChildren: [
                    {id: 'adjectives-theory', url: 'adjectives-theory', valueKey: 'underSub.adjectiveTheory'},
                    {id: 'adjectives-basic', url: 'adjective-basics', valueKey: 'underSub.adjectivesBasic'},
                    {id: 'declination', url: 'adjective-declension', valueKey: 'underSub.declination'},
                    {id: 'comparison', url: 'adjective-comparison', valueKey: 'underSub.comparison'},
                  ]
                },
                {id: 'themen', url: 'thematic-learning', valueKey: 'sub.themen'},
                {id: 'prepositions', url: 'prepositions', valueKey: 'sub.prepositions'},
                {id: 'cards', url: 'createCards', valueKey: 'sub.card'},
                {id: 'idioms', url: 'idioms', valueKey: 'sub.idioms'}
              ],
            },
            {
              id: 'duel',
              valueKey: 'nav.gameMode',
              children: [
                {id: 'duel-pvp', valueKey: 'sub.pvp', action: openDevModal},
                {id: 'wordDuel', url: '/play', valueKey: 'sub.wordDuel'},
                {id: 'wordDuel', url: '/recipes', valueKey: 'sub.quests'},
                {id: 'duel-guess', url: '/guess', valueKey: 'sub.guess'},
                {id: 'articlemarathon', url: '/article-marathon', valueKey: 'sub.marathon'},
              ]
            },
          ] :
          [
            {
              id: 'about', valueKey: 'О приложении', url: '/info-about',
            },
            {
              id: 'contact', valueKey: 'Контакт', url: '/support-request',
            },
            {
              id: 'faq', valueKey: 'Вопрос/ответ', url: '/faq',
            },

          ]
  ),

  ...(userAuth.isPremium
      ? [{id: 'test', url: '/exams', valueKey: 'nav.tests'}]
      : []),
  ...(userAuth.uid
      ? [{id: 'achieve', url: '/achievements', valueKey: 'nav.achieve'},
        {id: 'stats', url: '/stats', valueKey: 'nav.stats'}
      ] : [])
])

const menuActions = ref([
  {id: 'cabinet', label: 'auth.cabinet', icon: User, action: () => goTo('cabinet')},
  {id: 'logout', label: 'auth.logOut', icon: Logout, action: () => userAuth.logOut()}
])
const toggleMenu = () => menuOpen.value = !menuOpen.value
const goTo = (page) => {
  menuOpen.value = false
  router.push({path: `/${page}`})
}

const articleData = ref({
  title: t('articleOverlay.title'),
  tips: [
    {id: 1, text: t('articleOverlay.first')},
    {id: 2, text: t('articleOverlay.second')},
    {id: 3, text: t('articleOverlay.third')},
  ]
})

const openArticleModal = () => isArticleOpen.value = true

const handleClickOutside = (event) => {
  if (menuOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target) && userBtnRef.value && !userBtnRef.value.contains(event.target)) {
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
watch(showAuth, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
watch(showDevModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
watch(isMobile, (isNowMobile) => {
  if (!isNowMobile) closeAllMenus();
});

watch(isMobileMenuOpen, (newVal) => {
  if (newVal) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
});


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

.logo-img {
  position: absolute;
  top: 0;
  left: 0;
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
}

.header-nav__item {
  position: relative;
  display: flex;
}

.header-nav__link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 16px;
  color: var(--titleColor);
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;
  border: none;
  background: none;
}

.header-nav__link:hover {
  background-color: #f1c40f;
  color: #1e1e1e;
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
  cursor: pointer;
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
  font-size: 16px;
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
  font-family: 'Nunito', sans-serif;
  transition: all 0.2s;
}

.header-user__dropdown-btn:hover {
  background-color: #fef8e4;
}

.header-user__dropdown-icon {
  width: 36px;
  height: 36px;
}

.btn-login {
  font-family: "Nunito", sans-serif;
  font-style: italic;
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

@media (max-width: 1023px) {
  .header-container {
    padding: 0.5rem 10px;
  }

  .header.mobile-menu-active .mobile-nav-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .logo__name {
    display: none;
  }

  .header-nav__link {
    color: black;
  }

  .header__drop-text, .logo-img {
    display: none;
  }

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
    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }

  .header-nav.is-open {
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
    font-size: 1.5rem;
    padding: 1rem;
    justify-content: space-between;
    border: 2px solid #1e1e1e;
    background-color: #fff;
    box-shadow: 3px 3px 0 #1e1e1e;
    margin-bottom: 0.5rem;
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

  .header-nav .header-nav__submenu-link {
    font-size: 1.2rem;
    padding: 0.8rem 1rem;
    color: #1e1e1e;
    background-color: #fff;
    border: 2px solid #1e1e1e;
    box-shadow: 2px 2px 0 #1e1e1e;
    border-radius: 12px;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
  }

  .header-nav .header-nav__submenu-link:hover {
    background-color: #fde68a;
  }

  .header-nav .header-nav__submenu-sub {
    position: static;
    box-shadow: none;
    border: none;
    padding: 0.5rem 0 0.5rem 1rem;
    background: none;
    white-space: normal;
    border-left: 3px solid #cccccc;
    margin-left: 0.5rem;
    margin-bottom: 6px;
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

    .articlus__wrapper {
      height: 45px;
      box-shadow: 2px 2px 0 #1e1e1e;
    }

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
  font-size: 1.5rem;
  font-style: italic;
  letter-spacing: 5px;
  text-shadow: 2px 4px 0px white;
  -webkit-text-stroke: 4px #e39910;
  transition: .5s;
}

.logo__name:hover {
  text-shadow: 2px 4px 2px white;
  transition: .5s;
}

</style>