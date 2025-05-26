<template>
	<div class="preloader">
		<div class="magic-circle">
			<div class="sparkle"></div>
			<div class="sparkle delay1"></div>
			<div class="sparkle delay2"></div>
		</div>
		<p class="message">Добро пожаловать в Академию Артиклей...</p>
	</div>
</template>

<script setup>
	import {onMounted} from 'vue'
	import {useRouter} from 'vue-router'

	const router = useRouter()

	onMounted(() => {
		setTimeout(() => {
			router.push('/')
		}, 4000)
	})

</script>

<style scoped>
	.preloader {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: radial-gradient(ellipse at center, #1a0e24 0%, #0b0612 100%);
		color: #fbeec1;
		font-family: 'Cinzel', serif;
		text-shadow: 0 0 10px #ffcc88;
		overflow: hidden;
	}

	.magic-circle {
		width: 60px;
		height: 60px;
		border: 4px dashed #ffd369;
		border-radius: 50%;
		position: relative;
		animation: rotate 3s linear infinite;
		margin-bottom: 2rem;
	}

	.sparkle {
		width: 12px;
		height: 12px;
		background: #ffd369;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 50%;
		transform: translateX(-50%);
		animation: sparkle 1.5s infinite ease-in-out;
	}

	.sparkle.delay1 {
		animation-delay: 0.5s;
	}

	.sparkle.delay2 {
		animation-delay: 1s;
	}

	.message {
		font-size: 1.3rem;
		letter-spacing: 1px;
		text-align: center;
		animation: fadeIn 2s ease forwards;
		opacity: 0;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes sparkle {
		0%, 100% {
			transform: translateX(-50%) scale(1);
			opacity: 0.6;
		}
		50% {
			transform: translateX(-50%) scale(1.5);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
</style>
