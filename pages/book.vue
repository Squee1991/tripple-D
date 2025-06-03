<template>
	<div class="gate-wrapper">
		<transition name="bounce">
			<div v-if="isLoggedIn" class="side-menu side-left">
				<div @click="routerPath('Начать обучение')" class="side-button">Темы для изучения</div>
				<div class="side-button">Заклинания</div>
				<div class="side-button">Магазин</div>
			</div>
		</transition>

		<transition name="bounce">
			<div v-if="isLoggedIn" class="side-menu side-right">
				<div class="side-button">Начать обучение</div>
				<div class="side-button">Начать игру</div>
				<div class="side-button">Ещё что то</div>
			</div>
		</transition>

		<div class="gate gate-left">
			<div class="gate-overlay left"></div>
		</div>
		<div class="gate gate-right">
			<div class="gate-overlay right"></div>
		</div>

		<div v-if="!isLoggedIn" class="auth-prompt">
			<button class="auth-button">Регистрация</button>
			<button class="auth-button" @click="login">Войти</button>
		</div>
	</div>
</template>

<script setup>
	import {ref} from 'vue'
	import {useRouter} from 'vue-router'

	const router = useRouter()
	const isLoggedIn = ref(false)

	const routerPath = (item) => {
		if (item === "Начать обучение") {
			router.push('/selectedTopics')
		}
	}

	function login() {
		isLoggedIn.value = true
	}
</script>

<style scoped>

	.gate-wrapper {
		width: 100vw;
		height: 100vh;
		background: radial-gradient(circle, #1b0f2b, #000);
		overflow: hidden;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.side-menu {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 5;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.side-left {
		left: -50px;
	}

	.side-right {
		right: -50px;
	}

	.side-button {
		width: 300px;
		background: grey;
		color: #fff8dc;
		font-size: 19px;
		display: flex;
		padding: 10px;
		border: 10px solid #a59d95;
		border-radius: 12px;
		box-shadow: inset 0 0 5px #000, 0 0 10px #000;
		align-items: center;
		justify-content: center;
		font-family: 'Georgia', serif;
		cursor: pointer;
		transition: 0.2s ease;
		white-space: nowrap;
	}

	.side-left .side-button:hover {
		transform: translateX(40px);
		box-shadow: 0 0 15px #cba36a;
	}

	.side-right .side-button:hover {
		transform: translateX(-40px);
		box-shadow: 0 0 2px #cba36a;
	}

	.gate {
		position: absolute;
		top: 0;
		width: 50%;
		height: 100%;
		background: linear-gradient(to bottom, #4a2e1a, #2e1b10);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 0 60px #000, 0 0 30px #8d6e3e;
	}

	.gate-left {
		left: 0;
		border-right: 3px solid #aa8953;
	}

	.gate-right {
		right: 0;
		border-left: 3px solid #aa8953;
	}

	.gate-overlay {
		width: 90%;
		height: 90%;
		border: 4px solid #c2a873;
		box-shadow: inset 0 0 15px #000, 0 0 10px #dab27f;
		background: repeating-linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0px,
			rgba(255, 255, 255, 0.05) 2px,
			transparent 2px,
			transparent 6px
		);
		border-radius: 12px;
		backdrop-filter: blur(1px);
	}

	.auth-prompt {
		height: 300px;
		width: 300px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 20px;
		border: 4px solid #cba36a;
		border-radius: 50%;
		background: black;
	}

	.auth-button {
		background: #ffda8b;
		color: #3b230b;
		font-size: 1.2rem;
		font-family: 'Georgia', serif;
		padding: 1rem 2.5rem;
		border: 2px solid #b88032;
		border-radius: 16px;
		box-shadow: 0 0 12px #ffefc2, inset 0 0 8px #fff3d4;
		cursor: pointer;
		transition: 0.3s ease;
	}

	.auth-button:hover {
		background: #fff4c2;
		box-shadow: 0 0 20px #ffe9a8;
	}

	.bounce-enter-active {
		animation: bounce-in 0.5s ease;
	}

	@keyframes bounce-in {
		0% {
			transform: translateY(-50%) scale(0);
			opacity: 0;
		}
		50% {
			transform: translateY(-50%) scale(1.25);
			opacity: 1;
		}
		100% {
			transform: translateY(-50%) scale(1);
			opacity: 1;
		}
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}
</style>