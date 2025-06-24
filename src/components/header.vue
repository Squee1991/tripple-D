<template>
	<header class="header">
		<Uioverlay :visible="showAuth" @close="closeAuth"/>
		<transition name="slide">
			<SignIn v-if="showAuth" @close-auth-form="closeAuth"/>
		</transition>
		<div class="header-nav__bar">
			<div class="header-nav__logo">
				<NuxtLink to="/">
					<img class="logo" src="../../assets/images/3dLogo.png" alt="">
				</NuxtLink>
			</div>
			<button class="burger-button">
				<BurgerMenu :modelValue="isMobileMenuOpen" @update:modelValue="toggleMobileMenu"/>
			</button>
			<nav
				ref="dropdownRefNav"
				class="header-nav__nav"
				:class="{
          'header-nav__nav--open': isMobileMenuOpen,
          'header-nav__nav--animating': animatingMenu
        }"
			>
				<ul class="header-nav__list">
					<li
						v-for="item in menuItems"
						:key="item.id"
						class="header-nav__item"
						@click="toggleSubmenu(item.id)"
					>
						<template v-if="item.children">
							<span class="header-nav__link">{{ t(item.valueKey) }}</span>
						</template>
						<template v-else>
							<NuxtLink :to="item.url" class="header-nav__link">{{ t(item.valueKey) }}</NuxtLink>
						</template>
						<img
							v-if="item.icon"
							:class="['header-nav__arrow', { 'header-nav__arrow--active': clickedMenu === item.id }]"
							:src="item.icon"
							alt=""
						>
						<ul v-if="item.children && clickedMenu === item.id" class="header-nav__submenu">
							<li v-for="child in item.children" :key="child.id" class="header-nav__submenu-item">
								<NuxtLink :to="child.url" class="header-nav__submenu-link">
									{{ t(child.valueKey) }}
								</NuxtLink>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
			<div class="header-nav__tea">
				<ForTea/>
			</div>
			<div class="articlus__wrapper">
				<img class="articlus" src="../../assets/images/articlus.png" alt="">
				<div class="articlus__counter">7</div>
			</div>
			<div class="header-nav__lang">
				<LanguageSelector/>
			</div>
			<div
				ref="dropdownRef"
				v-if="userAuth.name"
				class="header-nav__user"
				@click="toggleMenu"
			>
				<img class="header-nav__avatar" :src="userAuth.avatarUrl" alt="User avatar"/>
				<span class="header-nav__email">{{ userAuth.email }}</span>
				<img
					:class="['header-nav__arrow', { 'header-nav__arrow--active': menuOpen }]"
					:src="Arrow"
					alt=""
				>
				<div v-if="menuOpen" class="header-nav__dropdown">
					<button
						v-for="item in menuActions"
						:key="item.id"
						class="header-nav__dropdown-btn"
						@click.stop="item.action"
					>
						<img class="header-nav__dropdown-icon" :src="item.icon" alt="">
						<span class="header__drop-text">{{ item.label }}</span>
					</button>
				</div>
			</div>
			<button
				v-else
				class="header-nav__login"
				@click="openAuth"
			>
				{{ t('auth.logIn') }}
			</button>
		</div>
	</header>
</template>

<script setup>
	import LogIn from '../../assets/images/log-in.svg'
	import {ref, watch, onMounted, onBeforeUnmount} from 'vue'
	import {useRouter} from 'vue-router'
	import {useI18n} from 'vue-i18n'

	const {t} = useI18n()
	import {userAuthStore} from '../../store/authStore'
	import {useBreakPointsStore} from '../../store/breakPointsStore.js'

	const bp = useBreakPointsStore()
	import SignIn from '../components/logIn.vue'
	import LanguageSelector from '../components/langSwitcher.vue'
	import ForTea from '../components/forTea.vue'
	import BurgerMenu from '../components/burgerMenu.vue'
	import Uioverlay from '../components/Uioverlay.vue'
	import Arrow from '../../assets/images/arrowNav.svg'
	import avatar from '../../assets/images/avatar.svg'
	import Logout from '../../assets/images/logout.svg'
	import User from '../../assets/images/user.svg'

	const clickedMenu = ref(null)
	const showAuth = ref(false)
	const router = useRouter()
	const userAuth = userAuthStore()
	const menuOpen = ref(false)
	const dropdownRef = ref(null)
	const dropdownRefNav = ref(null)

	const isMobileMenuOpen = ref(false)
	const animatingMenu = ref(false)
	let openTimeout = null
	let closeTimeout = null

	const openMobileMenu = () => {
		animatingMenu.value = true
		clearTimeout(openTimeout)
		openTimeout = setTimeout(() => {
			isMobileMenuOpen.value = true
		}, 120)
	}

	const closeAuth = () => {
		showAuth.value = false
	}

	const closeMobileMenu = () => {
		isMobileMenuOpen.value = false
		clearTimeout(closeTimeout)
		closeTimeout = setTimeout(() => {
			animatingMenu.value = false
		}, 400)
	}
	const toggleMobileMenu = () => {
		if (!isMobileMenuOpen.value && !animatingMenu.value) openMobileMenu()
		else if (isMobileMenuOpen.value) closeMobileMenu()
	}

	const menuItems = [
		{
			id: 'learn',
			valueKey: 'nav.training',
			icon: Arrow,
			children: [
				{id: 'learn-tips', url: 'examples', valueKey: 'sub.prev'},
				{id: 'learn-rules', url: 'rules', valueKey: 'sub.rules'},
				{id: 'learn-selectedTopics', url: 'selectedTopics', valueKey: 'sub.artRules'},
				{id: 'cards', url: 'createCards', valueKey: 'sub.card'},
				{id: 'themen', url: 'choiceTheme', valueKey: 'sub.themen'}
			]
		},
		{
			id: 'duel',
			valueKey: 'nav.gameMode',
			icon: Arrow,
			children: [
				{id: 'duel-pvp', url: 'duel', valueKey: 'nav.pvp'},
				{id: 'duel-guess', url: 'guess', valueKey: 'nav.guess'},
				{id: 'prepare', url: 'prepare', valueKey: 'nav.marathon'},
				{id: 'vocabulary', url: 'vocabulary', valueKey: 'nav.sinonim'}
			]
		},
		// {
		// 	id: 'quests',
		// 	url: 'quests',
		// 	valueKey: 'nav.achieve'
		// },
		{
			id: 'about',
			url: 'about',
			valueKey: 'nav.about'
		},
		{
			id: 'stats',
			url: 'stats',
			valueKey: 'nav.stats'
		}
	]

	const menuActions = ref([
		{
			id: 'cabinet',
			label: 'Кабинет',
			icon: User,
			action: () => goTo('cabinet')
		},
		{
			id: 'logout',
			label: 'Выход',
			icon: Logout,
			action: () => userAuth.logOut()
		}
	])

	const toggleMenu = () => {
		menuOpen.value = !menuOpen.value
	}
	const toggleSubmenu = (id) => {
		clickedMenu.value = clickedMenu.value === id ? null : id
	}
	const goTo = (page) => {
		menuOpen.value = false
		router.push({path: `/${page}`})
	}
	const openAuth = () => showAuth.value = true
	const startLearning = () => {
		userAuth.name ? router.push('/selectedTopics') : openAuth()
	}
	const handleClickOutside = (event) => {
		if (menuOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
			menuOpen.value = false
		}
	}
	const handleClickOutsideNav = (event) => {
		if (clickedMenu.value && dropdownRefNav.value && !dropdownRefNav.value.contains(event.target)) {
			clickedMenu.value = null
		}
	}
	onMounted(() => {
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('mousedown', handleClickOutsideNav)
	})
	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', handleClickOutside)
		document.removeEventListener('mousedown', handleClickOutsideNav)
		clearTimeout(openTimeout)
		clearTimeout(closeTimeout)
	})
	watch(showAuth, (val) => {
		document.body.style.overflow = val ? 'hidden' : ''
	})
</script>

<style scoped>
	.header {
		font-family: 'Inter', sans-serif;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.articlus {
		width: 50px;
		height: 42px;
	}

	.articlus__wrapper {
		display: flex;
		align-items: center;
		justify-content: end;
		margin-left: auto;
		padding: 20px;
	}

	.logo {
		width: 80px;
		cursor: pointer;
	}

	.login-icon {
		width: 30px;
	}

	.header-nav__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 20px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
		background-color: #efeff3;
		/*background: #402404b;*/
		position: relative;
		z-index: 10;
	}

	.header-nav__logo {
		padding: 10px;
		margin-right: 40px;
	}

	.header-nav__nav {
		display: flex;
		align-items: center;
	}

	.header-nav__list {
		display: flex;
		align-items: center;
		position: relative;
	}

	.header-nav__item {
		position: relative;
		justify-content: space-between;
		display: flex;
		min-width: 146px;
		align-items: center;
		/*background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);*/
		background: #a2a6bf;
		/*background: linear-gradient(90deg, #36b9ff 60%, #67c7d8 100%);*/
		color: #fff;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 2px 8px 0 #15235e44;
		cursor: pointer;
		font-weight: 700;
		font-size: 17px;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 2px #26358580;
		transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
		margin-bottom: 0;
		margin-right: 15px;
	}

	.header-nav__item:hover {
		/*background: linear-gradient(90deg, #4c88ff 60%, #366cff 100%);*/
		background: #7d85b8;
		box-shadow: 0 4px 16px 0 #15235e77;
	}

	.header-nav__link {
		color: #fff;
		padding: 12px;
		text-decoration: none;
		font-style: italic;
	}

	.header-nav__arrow {
		width: 30px;
		transition: .4s;
		padding: 5px;
		transform: scale(1);
	}

	.header-nav__arrow--active {
		transform: scale(-1);
	}

	.header-nav__submenu {
		width: 100%;
		overflow: hidden;
		margin-top: 10px;
		position: absolute;
		top: 100%;
		left: 0;
		font-size: 15px;
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		background: #a2a6bf;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		min-width: 190px;
		z-index: 50;
	}

	.articlus__counter {
		color: black;
		font-size: 26px;
		font-family: "Montserrat", Arial, Helvetica, sans-serif;
		font-weight: 600;
	}

	.header-nav__submenu-item {
		padding: 8px 16px;
		color: white;
	}

	.header-nav__submenu-link {
		display: block;
		padding: 8px 0;
		color: #fff;
		font-weight: 700;
		text-decoration: none;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 2px #26358580;
		transition: background 0.15s, color 0.15s;
	}

	.header-nav__submenu-item:hover {
		background: rgba(48, 67, 160, 0.15);
		color: #fff3ec;
	}


	.header-nav__lang {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.header-nav__user {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		cursor: pointer;
		position: relative;
		max-width: 250px;
		width: 250px;
		padding: 8px 20px 8px 12px;
		border-radius: 22px 30px 18px 30px / 30px 18px 30px 18px;
		box-shadow: 0 2px 18px #7e60dd24, 0 1px 6px #fff8 inset;
		margin-left: 22px;
		user-select: none;
	}

	.header-nav__avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 2px solid #c7bfff;
		background: #f4f8ff;
		box-shadow: 0 2px 12px #c2bcff55;
	}

	.header-nav__email {
		color: #472b81;
		font-size: 15px;
		font-weight: 600;
		text-shadow: 0 1px 4px #fff8, 0 0px 1px #6337c288;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: 'Montserrat', Arial, sans-serif;
		letter-spacing: 0.01em;
	}

	.header-nav__dropdown {
		width: 100%;
		position: absolute;
		top: 100%;
		right: 0;
		background: linear-gradient(120deg, #fafaff 60%, #e4e2ff 100%);
		border-radius: 18px 26px 22px 28px / 30px 18px 30px 18px;
		margin-top: 0.5rem;
		box-shadow: 0 6px 32px #a193e833, 0 1px 8px #fff8 inset;
		display: flex;
		flex-direction: column;
		min-width: 160px;
		overflow: hidden;
		animation: menu-pop 0.32s cubic-bezier(.5, 1.8, .5, 1) both;
		z-index: 100;
	}

	.header-nav__dropdown-btn {
		display: flex;
		align-items: center;
		padding: 12px;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		color: #6847c4;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 700;
		letter-spacing: 0.01em;
		border-bottom: 1px solid #ede6ff88;
		text-shadow: 0 1px 2px #fff6, 0 1px 1px #cabdff44;
		transition: background 0.15s, color 0.14s, transform 0.09s;
	}

	.header-nav__dropdown-btn:last-child {
		border-bottom: none;
	}

	.header-nav__dropdown-btn:hover {
		background: linear-gradient(90deg, #ecebff 60%, #d2d8fa 100%);
		color: #c14bff;
		text-shadow: 0 1px 8px #dfcaff80, 0 1px 2px #fff8;
	}

	.header-nav__dropdown-icon {
		width: 30px;
		margin-right: 15px;
	}

	.header-nav__login {
		/*min-width: 160px;*/
		/*background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);*/
		background: #c25f5f;
		color: white;
		font-weight: 800;
		font-size: 17px;
		padding: 12px 20px;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 4px 18px #15235e35, 0 1px 4px #fff8 inset;
		cursor: pointer;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 4px #26358588, 0 0px 1px #fff8;
		/*border: 2px solid #6c76ff;*/
		border: 3px solid #c64f4f;
		transition: background 0.15s, color 0.15s, box-shadow 0.18s, transform 0.1s;
		transform: skew(-8deg);
		margin-left: 20px;
	}

	.header-nav__login:hover {
		/*background: linear-gradient(90deg, #6cbcff 60%, #2462ff 100%);*/
		background: #933838;
		color: #fff3ec;
		/*box-shadow: 0 8px 24px rgba(83, 28, 82, 0.67), 0 2px 6px #fff8 inset;*/
	}

	.burger-button {
		display: none;
		flex-direction: column;
		justify-content: space-between;
		width: 30px;
		height: 22px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		margin-left: 15px;
	}

	.burger-line {
		height: 4px;
		background-color: #472b81;
		border-radius: 2px;
	}

	@media (max-width: 768px) {
		.burger-button {
			display: flex;
		}

		.header-nav__email,
		.header__drop-text {
			display: none;
		}

		.header-nav__user {
			width: 120px;
		}

		.header-nav__dropdown {
			min-width: 100%;
			width: 100%;
		}

		.header-nav__nav {
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 0px;
			left: 0;
			width: 100vw;
			padding: 24px 0 0 0;
			background: #efeff3;
			z-index: -1;
			pointer-events: none;
			opacity: 0;
			transform: translateY(-100%);
			transition: transform 0.4s cubic-bezier(.77, 0, .18, 1), opacity 0.3s;
		}

		.header-nav__nav--animating {
			pointer-events: auto;
		}

		.header-nav__nav--open {
			opacity: 1;
			transform: translateY(0);
			pointer-events: auto;
			border-bottom-right-radius: 30px;
			border-bottom-left-radius: 30px;
			border-bottom: 2px solid #acacea;
		}

		.header-nav__list {
			flex-direction: column;
			width: 100%;
			align-items: start;
			margin-top: 45px;
			justify-content: start;
			padding: 10px 10px 30px 10px;
		}

		.header-nav__item {
			margin-right: 0;
			margin-bottom: 10px;
		}

		.header-nav__submenu-item {
			text-align: center;
			padding: 5px 0;
		}

		.header-nav__submenu {
			top: 0;
			left: 100%;
			margin: 0;
			min-width: 140px;
		}

		.header-nav__arrow {
			transform: rotate(-90deg);
		}

		.header-nav__arrow--active {
			transform: rotate(0deg);
		}
	}

	@media (max-width: 1280px) {
		.header-nav__logo {
			display: none;
		}

		.header-nav__login {
			background: none;
			border: none;
			box-shadow: none;
			margin: 0;
			padding: 5px;
		}
	}

</style>
