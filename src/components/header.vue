<template>
	<div class="background">
		<div class="main__wrapper">
			<div class="overlay" :class="{ show: showAuth }" @click="closeLogin"></div>
			<Transition name="slide-auth">
				<div v-if="showAuth" class="signin-wrapper">
					<SingIn @success="closeLogin"/>
				</div>
			</Transition>
			<div class="profile-page">
				<div class="top-bar">
					<div class="top-right">
						<div class="user-info">
							<div v-if="userAuth.name" class="auth__inner">
								<img class="user-avatar-icon" src="" alt=""/>
								<div @click="userToggleFoo" class="userAuth__wrapper" :class="{ isToggle: menuToggle }">
									<span class="menu-item">{{ userAuth.email }}</span>
									<div class="menu-dropdown">
										<span class="menu-item" @click.stop="routerPath('cabinet')">Кабинет</span>
										<span class="menu-item" @click.stop="userAuth.logOut">Выход</span>
									</div>
								</div>

							</div>
							<div v-else class="logout-button" @click="logIn">Войти</div>
						</div>
					</div>
				</div>
			</div>
			<div class="baner">
				<div class="sub__title">
					<img src="../../assets/images/wizard.svg" alt="">
				</div>
				<div class="banner__sub">
					<div class="banner__title">
						<span class="bold_1">Der</span> <span class="bold_2">Die</span> <span class="bold_3">Das</span>
						- сайт для изучения артиклей существительных в немецком языке
					</div>
					<div class="banner__btn">
						<button
							v-if="start"
							@click="handleStart"
							class="start-button"
						>
							{{ userAuth.name ? 'Начать' : 'Начать' }}
						</button>
						<button class="start-button" @click="goToSelectedTopics">
							Начать обучение
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup>
	import {ref , watch} from 'vue'
	import {userAuthStore} from '../../store/authStore.js'
	import SingIn from '../components/logIn.vue'
	import Header from '../components/header.vue'
	import {useRouter} from 'vue-router'
	const menuToggle = ref(false)
	const userAuth = userAuthStore()
	const router = useRouter()
	let start = ref(true)
	const isStarted = ref(false)
	const selectedMode = ref(null)
	const showAuth = ref(false)

	const userToggleFoo = () => {
		menuToggle.value = !menuToggle.value
	}

	const goToSelectedTopics = () => {
		if (userAuth.name) {
			router.push('/selectedTopics')
		} else {
			showAuth.value = true
		}
	}

	const logIn = () => {
		showAuth.value = true
	}

	const routerPath = (item) => {
		menuToggle.value = false
		if (item === 'cabinet') {
			router.push('/cabinet')
		} else if (item === 'map') {
			router.push('/MapView')
		}
	}

	const handleStart = () => {
		if (!userAuth.name) {
			showAuth.value = true
		} else {
			router.push('/learnmode')
		}
	}

	const closeLogin = () => {
		showAuth.value = false
		if (userAuth.name) {
			start.value = false
			isStarted.value = true
		}
	}

	watch(showAuth, (val) => {
		if (val) {
			document.documentElement.style.overflow = 'hidden'
			document.body.style.overflow = 'hidden'
		} else {
			document.documentElement.style.overflow = ''
			document.body.style.overflow = ''
		}
	})

</script>

<style>

	.banner__sub {
		display: flex;
		flex-direction: column;
	}

	.sub__title {
		margin: 0 auto;
		width: 400px;
		font-size: 20px;
		display: flex;
		justify-content: center;
		align-items: start;
	}

	.bold_1 {
		color: black;
		font-weight: 600;
		font-size: 47px;
	}

	.bold_2 {
		color: red;
		font-weight: 600;
		font-size: 47px;
	}

	.bold_3 {
		color: #fcd000;
		font-weight: 600;
		font-size: 47px;
	}

	.banner__title {
		max-width: 600px;
		margin: 0 auto;
		font-family: "Kurale", serif;
	}

	.baner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 40px;
	}

	.banner__btn {
		display: flex;
		justify-content: center;
		margin-top: 50px;
	}

	.auth__inner {
		display: flex;
		align-items: center;
		position: relative;
		gap: 10px;
	}

	.userAuth__wrapper {
		position: relative;
		background: #2e2e3e;
		color: white;
		cursor: pointer;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		width: 170px;
	}

	.menu-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: #2e2e3e;
		overflow: hidden;
		height: 0;
		transition: height 0.3s ease;
		display: flex;
		flex-direction: column;
		z-index: 10;
	}

	.userAuth__wrapper.isToggle .menu-dropdown {
		height: 63px;
	}

	.menu-item {
		font-size: 18px;
		padding: 4px 10px;
		background: #2e2e3e;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		display: block;
	}

	.menu-item:hover {
		background: #00ffff33;
	}

	html, body {
		overflow-x: hidden;
	}

	a {
		text-decoration: none;
	}

	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.signin-wrapper {
		width: 380px    ;
		position: absolute;
		top: 0;
		right: 0;
		height: 100vh;
		background: #11182c;
		z-index: 1000;
	}

	.app-title {
		border-radius: 50%;
	}

	.app-title-icon {
		width: 80px;
		height: 60px;
	}

	.profile-page {
		width: 100%;
		color: white;
		position: relative;
		font-family: 'Segoe UI', sans-serif;
	}

	.top-bar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 30px;
		margin-bottom: 50px;
		background: #f5efef;
	}

	.app-title {
		font-size: 20px;
		font-weight: bold;
		color: #00ffff;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.user-avatar {
		cursor: pointer;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: 0 0 6px rgba(0, 255, 255, 0.67);
	}

	.logout-button {
		display: flex;
		justify-content: center;
		font-size: 18px;
		min-width: 120px;
		padding: 8px 16px;
		border: 1px solid grey;
		border-radius: 8px;
		cursor: pointer;
		background: transparent;
		color: black;
		transition: background 0.3s;
	}

	.logout-button:hover {
		background: black;
		color: white;
	}

	.img-bg {
		width: 100%;
	}

	.background {
		width: 100%;
		position: relative;
	}

	.start-button-wrapper {
		position: absolute;
		left: 50%;
		opacity: 1;
		transform: translateX(-50%);
		z-index: 10;
	}

	.is-started {
		opacity: 1;
	}

	.start-button {
		background: rgba(255, 255, 255, 0.1);
		border: 3px solid #55a1bf;
		font-size: 20px;
		padding: 12px 40px;
		border-radius: 20px;
		letter-spacing: 2px;
		cursor: pointer;
		color: black;
		text-transform: uppercase;
		transition: all 0.3s ease;
		box-shadow: 0 0 12px #00ffff44;
		animation: pulseGlow 2s infinite ease-in-out;
		width: 300px;
		font-family: "Kurale", serif;
		font-weight: 600;
	}

	.start-button:hover {
		background: #55a1bf;
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
	}

	@keyframes pulseGlow {
		25% {
			box-shadow: 0 0 20px #00ffffaa;
			transition: 1s;
		}

		50% {
			box-shadow: 0 0 20px #00ffffaa;
			transition: 1s;
		}
		100% {
			box-shadow: 0 0 12px #00ffff44;
			transition: 1s;
		}
		50% {
			box-shadow: 0 0 20px #00ffffaa;
			transition: 1s;
		}
		25% {
			box-shadow: 0 0 20px #00ffffaa;
			transition: 1s;
		}
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
		z-index: 999;
	}

	.overlay.show {
		opacity: 1;
		pointer-events: auto;
	}

	.slide-auth-enter-from {
		transform: translateX(100%);
	}

	.slide-auth-enter-active,
	.slide-auth-leave-active {
		transition: transform 0.5s ease;
	}

	.slide-auth-enter-to {
		transform: translateX(0%);
	}

	.slide-auth-leave-to {
		transform: translateX(100%);
	}

	.signin-wrapper.show {
		transform: translateX(0%);
	}


</style>