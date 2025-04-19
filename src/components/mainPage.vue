<template>
	<div class="background">
		<div class="overlay" :class="{ show: !isHide }" @click="closeLogin"></div>
		<div class="signin-wrapper" :class="{ show: !isHide }">
			<SingIn />
		</div>
		<div class="profile-page">
			<div class="top-bar">
				<div class="top-left">
					<div class="app-title">
						<img class="app-title-icon" src="../../assets/images/logo.png" alt="" />
					</div>
				</div>
				<div class="top-right">
					<div class="user-info">
						<NuxtLink class="user-avatar" to="/cabinet">
							<img class="user-avatar-icon" src="" alt="" />
						</NuxtLink>
						<div @click="logIn" class="logout-button">Войти</div>
					</div>
				</div>
			</div>
		</div>
		<div class="img__background">
			<img class="img-bg" src="../../assets/images/bg.png" alt="" />
		</div>
		<div
			@click="startlearning"
			class="start-button-wrapper"
			:class="{ 'is-started': !start }"
		>
			<button class="start-button">Начать</button>
		</div>
		<Transition name="bounce">
			<Cards v-if="!start" />
		</Transition>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import SingIn from '../components/logIn.vue'
	import Cards from '../components/cards.vue'

	const isHide = ref(true)
	const start = ref(true)

	const startlearning = () => {
		start.value = false
	}

	const logIn = () => {
		isHide.value = false
	}

	const closeLogin = () => {
		isHide.value = true
	}
</script>

<style scoped>

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
		width: 360px;
		position: absolute;
		top: 0;
		right: 0;
		height: 100vh;
		background: #11182c;
		transform: translateX(100%);
		transition: transform 0.5s ease;
		z-index: 1000;
	}
	.signin-wrapper.show {
		transform: translateX(0%);
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
		background: linear-gradient(135deg, #0b0f1e, #1b1e38);
		color: white;
		position: relative;
		font-family: 'Segoe UI', sans-serif;
	}

	.user-avatar-icon{
		width: 100%;
	}

	.top-bar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 30px;
		background: rgba(0, 0, 0, 0.6);
		box-shadow: 0 2px 10px #00000066;
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
		border: 1px solid #00ffffaa;
		border-radius: 8px;
		cursor: pointer;
		background: transparent;
		color: #00ffff;
		transition: background 0.3s;
	}

	.logout-button:hover {
		background: #00ffff33;
	}

	.img-bg {
		width: 100%;
	}

	.background {
		background-color: black;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.img__background {
		max-width: 1020px;
		margin: 0 auto;
	}

	.start-button-wrapper {
		position: absolute;
		bottom: 20%;
		left: 50%;
		opacity: 1;
		transform: translateX(-50%);
		z-index: 10;
	}

	.is-started {
		opacity: 0;
	}

	.start-button {
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: #fff;
		font-size: 24px;
		padding: 16px 40px;
		border-radius: 12px;
		letter-spacing: 2px;
		cursor: pointer;
		text-transform: uppercase;
		transition: all 0.3s ease;
		box-shadow: 0 0 12px #00ffff44;
		animation: pulseGlow 2s infinite ease-in-out;
	}

	.start-button:hover {
		background: rgba(0, 0, 0, 0.6);
		box-shadow: 0 0 20px #00ffffcc;
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
		height: 100%;
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




</style>