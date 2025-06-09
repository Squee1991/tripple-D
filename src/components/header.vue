<template>
	<header class="header">
		<Uioverlay :visible="showAuth" @close="closeAuth"/>
		<transition name="slide">
			<SignIn v-if="showAuth"/>
		</transition>
		<div class="header-nav__bar">
			<div class="header-nav__logo">
				<NuxtLink to="/">
					<img class="logo" src="../../assets/images/3dLogo.png" alt="">
				</NuxtLink>
			</div>
			<nav ref="dropdownRefNav" class="header-nav__nav">
				<ul class="header-nav__list">
					<li
						v-for="item in menuItems"
						:key="item.id"
						class="header-nav__item"
						@click="toggleSubmenu(item.id)"
					>
						<NuxtLink :to="item.url"  class="header-nav__link">{{ t(item.valueKey) }}</NuxtLink>
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
			<div class="header-nav__lang">
				<LanguageSelector/>
			</div>
			<div
				ref="dropdownRef"
				v-if="userAuth.name"
				class="header-nav__user"
				@click="toggleMenu"
			>
				<img class="header-nav__avatar" :src="avatar" alt="User avatar"/>
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
						<span>{{ item.label }}</span>
					</button>
				</div>
			</div>
			<button
				v-else
				class="header-nav__login"
				@click="openAuth"
			> {{ t('auth.logIn')}}
			</button>
		</div>
	</header>
</template>

<script setup>
	import {ref, watch, onMounted, onBeforeUnmount } from 'vue'
	import {useRouter} from 'vue-router'
	import { useI18n } from 'vue-i18n'
	const { t , locale , locales , messages} = useI18n()
	import {userAuthStore} from '../../store/authStore'
	import SignIn from '../components/logIn.vue'
	import LanguageSelector from '../components/langSwitcher.vue'
	import Uioverlay from '../components/Uioverlay.vue'
	import Arrow from '../../assets/images/arrowNav.svg'
	import ForTea from '../components/forTea.vue'
	import avatar from '../../assets/images/avatar.svg'
	import Logout from '../../assets/images/logout.svg'
	import User from '../../assets/images/user.svg'
	console.log(locale.value)
	const clickedMenu = ref(null)
	const showAuth = ref(false)
	const router = useRouter()
	const userAuth = userAuthStore()
	const menuOpen = ref(false)
	const dropdownRef = ref(null)
	const dropdownRefNav = ref(null)

	const menuItems = [
		{
			id: 'learn',
			url: '',
			valueKey: 'nav.training',
			icon: Arrow,
			children: [
				{ id: 'tips', url: 'examples', valueKey: 'sub.prev' },
				{ id: 'rules', url: 'rules', valueKey: 'sub.rules' },
				{ id: 'selectedTopics', url: 'selectedTopics', valueKey: 'sub.artRules' }
			]
		},
		{
			id: 'duel',
			url: 'duel',
			valueKey: 'nav.gameMode'
		},
		{
			id: 'about',
			url: 'about',
			valueKey: 'nav.about'
		},
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
		router.push({ path: `/${page}` })
	}

	const openAuth = () => showAuth.value = true
	const closeAuth = () => showAuth.value = false

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
	})

	watch(showAuth, (val) => {
		document.body.style.overflow = val ? 'hidden' : ''
	})

</script>

<style scoped>
	/*@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');*/

	.header {
		font-family: 'Inter', sans-serif;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.logo {
		width: 80px;
		cursor: pointer;
	}

	.header-nav__bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0px 30px;
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
		justify-content: center;
		display: flex;
		min-width: 186px;
		align-items: center;
		/*background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);*/
		background: #fbd912;
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
		background: #e8bd0e;
		box-shadow: 0 4px 16px 0 #15235e77;
	}

	.header-nav__link {
		color: #fff;
		padding: 12px 20px;
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
		overflow: hidden;
		margin-top: 10px;
		position: absolute;
		top: 100%;
		left: 0;
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		background: #fbd912;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		min-width: 160px;
		z-index: 50;
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
		background: rgba(160, 48, 48, 0.15);
		color: #fff3ec;
	}



	.header-nav__lang {
		margin-left: auto;
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
		min-width: 160px;
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
</style>
