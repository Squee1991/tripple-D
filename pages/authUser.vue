<template>
	<div class="preloader">
		<div class="wrapper">
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="shadow"></div>
			<div class="shadow"></div>
			<div class="shadow"></div>
		</div>
		<p class="message">{{ t('preloader.value')}}</p>
	</div>
</template>

<script setup>
	import { onMounted } from 'vue'
	import { useRouter } from 'vue-router'
	const { t} = useI18n()

	const router = useRouter()

	onMounted(() => {
		setTimeout(() => {
			router.push('/')
		}, 3300)
	})
</script>

<style scoped>
	.preloader {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: linear-gradient(120deg, #736df6 0%, #6ccaf8 100%);
		font-family: 'Montserrat', Arial, sans-serif;
	}

	.spinner {
		width: 70px;
		height: 70px;
		border: 7px solid #fff;
		border-top: 7px solid #736df6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 30px;
		box-shadow: 0 2px 20px #736df680;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.message {
		color: #fff;
		font-size: 25px;
		font-weight: 600;

		text-shadow: 0 2px 10px #6ccaf8cc, 0 1px 3px #736df6cc;
		opacity: 0;
		animation: fadeIn 0.9s 0.6s forwards;
		text-align: center;
		margin-top: 40px;
	}

	@keyframes fadeIn {
		to { opacity: 1; }
	}

	.wrapper {
		width: 200px;
		height: 60px;
		position: relative;
		z-index: 1;
	}

	.circle {
		width: 20px;
		height: 20px;
		position: absolute;
		border-radius: 50%;
		background-color: #fff;
		left: 15%;
		transform-origin: 50%;
		animation: circle7124 .5s alternate infinite ease;
	}

	@keyframes circle7124 {
		0% {
			top: 60px;
			height: 5px;
			border-radius: 50px 50px 25px 25px;
			transform: scaleX(1.7);
		}

		40% {
			height: 20px;
			border-radius: 50%;
			transform: scaleX(1);
		}

		100% {
			top: 0%;
		}
	}

	.circle:nth-child(2) {
		left: 45%;
		animation-delay: .2s;
	}

	.circle:nth-child(3) {
		left: auto;
		right: 15%;
		animation-delay: .3s;
	}

	.shadow {
		width: 20px;
		height: 4px;
		border-radius: 50%;
		background-color: rgba(0,0,0,0.9);
		position: absolute;
		top: 62px;
		transform-origin: 50%;
		z-index: -1;
		left: 15%;
		filter: blur(1px);
		animation: shadow046 .5s alternate infinite ease;
	}

	@keyframes shadow046 {
		0% {
			transform: scaleX(1.5);
		}

		40% {
			transform: scaleX(1);
			opacity: .7;
		}

		100% {
			transform: scaleX(.2);
			opacity: .4;
		}
	}

	.shadow:nth-child(4) {
		left: 45%;
		animation-delay: .2s
	}

	.shadow:nth-child(5) {
		left: auto;
		right: 15%;
		animation-delay: .3s;
	}

</style>
