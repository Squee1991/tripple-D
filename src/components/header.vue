<template>
	<header class="magic-header">
		<div v-if="showAuth" class="auth-overlay" @click.self="closeAuth"></div>
		<transition name="slide">
			<SignIn v-if="showAuth"/>
		</transition>
		<div class="header-bar">
			<h1 class="logo">DerDieDas</h1>
			<nav ref="dropdownRefNav" class="nav">
				<ul class="list">
					<li v-for="item in data" :key="item.id" class="list__item" @click="toggleSubmenu(item.id)">
						<a :href="item.url || '#'" class="list__link">{{ item.value }}</a>
						<img v-if="item.icon"
						     :class="{ scale : clickedMenu === item.id }"
						     class="arrow"
						     :src="item.icon" alt=""
						>
						<ul v-if="item.children && clickedMenu === item.id" class="submenu">
							<li v-for="child in item.children" :key="child.id" class="submenu__item">
								<a :href="child.url" class="submenu__link">{{ child.value }}</a>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
			<div class="coffe">
				<ForTea/>
			</div>
			<div class="lang__inner">
				<LanguageSelector/>
			</div>
			<div ref="dropdownRef" v-if="userAuth.name" class="user-info" @click="toggleMenu">
				<img class="avatar" :src="avatar" alt="User avatar"/>
				<span class="user-email">{{ userAuth.email }}</span>
				<img :class="{ scale : menuOpen }" class="arrow" :src="Arrow" alt="">
				<div v-if="menuOpen" class="dropdown">
					<button class="dropdown__row-btn" @click.stop="goTo('cabinet')">
						<img class="drop__icons" src="../../assets/images/user.svg" alt="">
						<span>Кабинет</span>
					</button>
					<button class="dropdown__row-btn" @click.stop="userAuth.logOut">
						<img class="drop__icons" src="../../assets/images/logout.svg" alt="">
						<span>Выход</span>
					</button>
				</div>
			</div>
			<button v-else class="login-btn" @click="openAuth">Войти</button>
		</div>
	</header>
</template>

<script setup>
	import {ref, watch, onMounted, onBeforeUnmount} from 'vue'
	import {useRouter} from 'vue-router'
	import {userAuthStore} from '../../store/authStore'
	import SignIn from '../components/logIn.vue'
	import LanguageSelector from '../components/langSwitcher.vue'
	import Arrow from '../../assets/images/arrowNav.svg'
	import ForTea from '../components/forTea'
	import avatar from '../../assets/images/avatar.svg'

	const clickedMenu = ref(null)
	const showAuth = ref(false)
	const router = useRouter()
	const userAuth = userAuthStore()
	const menuOpen = ref(false)
	const dropdownRef = ref(null)
	const dropdownRefNav = ref(null)
	const data = ref([
		{id: 'learn', value: 'Обучение', icon: Arrow, children: [
				{id: 'tips', url: 'examples', value: 'Введение'},
				{id: 'examples', url: 'examples', value: 'Правила'},
				{id: 'selectedTopics', url: 'selectedTopics', value: 'Практика артиклей'}
			]
		},
		{id: 'duel', url: 'duel', value: 'Игровой режим'},
	])

	const toggleMenu = () => {
		menuOpen.value = !menuOpen.value
	}

	const toggleSubmenu = (id) => {
		clickedMenu.value = clickedMenu.value === id ? null : id
	}

	const goTo = (page) => {
		menuOpen.value = false
		router.push(`/${page}`)
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
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	.magic-header {
		background: linear-gradient(135deg, #1d3168, #e0e7ff);
		font-family: 'Inter', sans-serif;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.submenu {
		overflow: hidden;
		margin-top: 10px;
		position: absolute;
		top: 100%;
		left: 0;
		background: #fff;
		border-radius: 8px;
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		min-width: 160px;
		z-index: 50;
	}

	.submenu__item {
		padding: 8px 16px;
		color: white;
	}

	.submenu__link {
		display: block;
		padding: 8px 0;
		color: #fff;
		font-weight: 700;
		text-decoration: none;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 2px #26358580;
		transition: background 0.15s, color 0.15s;
	}

	.submenu__item:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #fff3ec;
	}

	.lang {
		width: 40px;
		margin-left: auto;
		cursor: pointer;
	}

	.dropdown__row-btn {
		display: flex;
		align-items: center;
	}

	.drop__icons {
		width: 30px;
		margin-right: 15px;
	}

	.arrow {
		width: 30px;
		transform: scale(1);
		transition: .4s;
		padding: 5px;
	}

	.scale {
		transform: scale(-1);
		transition: .4s;
	}

	.lang__value {
		padding: 10px;
		font-size: 18px;
		font-family: 'Kurale', serif;
		font-weight: 600;
		color: #f3f0ed;
		text-shadow: 0 2px 8px #4b2e09a1, 0 1px 0 #fff8, 0 0px 2px #e6d9aa, 1px 2px 0 #a6752b99;
		letter-spacing: 0.04em;
		background: none;
		line-height: 1.35;
		filter: drop-shadow(0 2px 1px #473c0099);
	}

	.lang__inner {
		margin-left: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.coffe {
		margin-left: auto;
	}

	.list {
		display: flex;
		align-items: center;
		position: relative;
	}

	.list__item {
		display: flex;
		align-items: center;
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		color: #fff;
		border: none;
		font-weight: 700;
		font-size: 17px;
		/*padding: 14px 26px;*/
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 2px 8px 0 #15235e44;
		cursor: pointer;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 2px #26358580;
		transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
		margin-bottom: 0;
		margin-right: 15px;
	}

	.list__link {
		/*background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);*/
		color: #fff;
		/*border: none;*/
		/*font-weight: 700;*/
		/*font-size: 17px;*/
		padding: 12px 20px;
		/*border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;*/
		/*box-shadow: 0 2px 8px 0 #15235e44;*/
		/*cursor: pointer;*/
		/*letter-spacing: 0.06em;*/
		/*text-shadow: 0 1px 2px #26358580;*/
		/*transition: transform 0.12s, box-shadow 0.12s, background 0.12s;*/
		/*margin-bottom: 0;*/
	}

	.list__item:hover {
		background: linear-gradient(90deg, #4c88ff 60%, #366cff 100%);
		/*transform: translateY(-1px) scale(1.01);*/
		box-shadow: 0 4px 16px 0 #15235e77;
	}

	.nav {
		display: flex;
		align-items: center;

	}

	.header-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 30px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
		background-color: #797bd4;
		position: relative;
		z-index: 10;
	}

	.logo {
		padding: 10px;
		margin-right: 40px;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		cursor: pointer;
		position: relative;
		max-width: 250px;
		width: 250px;
		padding: 8px 20px 8px 12px;
		border-radius: 22px 30px 18px 30px / 30px 18px 30px 18px;
		background: linear-gradient(90deg, #a1d2ff 0%, #bda6ff 100%);
		box-shadow: 0 2px 18px #7e60dd24,
		0 1px 6px #fff8 inset;
		transition: box-shadow 0.18s, background 0.15s, transform 0.15s;
		border: 2px solid #a48ae7;
		margin-left: 22px;
		user-select: none;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 2px solid #c7bfff;
		background: #f4f8ff;
		box-shadow: 0 2px 12px #c2bcff55;
	}

	.user-email {
		color: #472b81;
		font-size: 15px;
		font-weight: 600;
		text-shadow: 0 1px 4px #fff8,
		0 0px 1px #6337c288;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: 'Montserrat', Arial, sans-serif;
		letter-spacing: 0.01em;
	}

	.icon {
		width: 16px;
		height: 16px;
		fill: #6b7280;
		transition: transform 0.3s;
	}


	.dropdown {
		width: 100%;
		position: absolute;
		top: 100%;
		right: 0;
		background: linear-gradient(120deg, #fafaff 60%, #e4e2ff 100%);
		border: 2px solid #a48ae7;
		border-radius: 18px 26px 22px 28px / 30px 18px 30px 18px;
		margin-top: 0.5rem;
		box-shadow: 0 6px 32px #a193e833,
		0 1px 8px #fff8 inset;
		display: flex;
		flex-direction: column;
		min-width: 160px;
		overflow: hidden;
		animation: menu-pop 0.32s cubic-bezier(.5, 1.8, .5, 1) both;
		z-index: 100;
	}

	.dropdown button {
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
		transition: background 0.15s, color 0.14s, transform 0.09s;
		border-bottom: 1px solid #ede6ff88;
		text-shadow: 0 1px 2px #fff6, 0 1px 1px #cabdff44;
	}

	.dropdown button:last-child {
		border-bottom: none;
	}

	.dropdown button:hover {
		background: linear-gradient(90deg, #ecebff 60%, #d2d8fa 100%);
		color: #c14bff;
		text-shadow: 0 1px 8px #dfcaff80, 0 1px 2px #fff8;
	}

	.login-btn {
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		color: #fff;
		font-weight: 800;
		font-size: 18px;
		padding: 11px 34px;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 4px 18px #15235e35, 0 1px 4px #fff8 inset;
		cursor: pointer;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 4px #26358588, 0 0px 1px #fff8;
		border: 2px solid #6c76ff;
		transition: background 0.15s, color 0.15s, box-shadow 0.18s, transform 0.1s;
		transform: skew(-8deg);
		margin-left: 20px;
	}

	.login-btn:hover {
		background: linear-gradient(90deg, #6cbcff 60%, #2462ff 100%);
		color: #fff3ec;
		box-shadow: 0 8px 24px #2737b1aa, 0 2px 6px #fff8 inset;
		transform: skew(-8deg) scale(1.04);
	}

</style>
