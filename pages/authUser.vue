<template>
	<div class="preloader">
		<div class="spinner"></div>
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
		font-size: 1.3rem;
		font-weight: 600;
		letter-spacing: 1.2px;
		text-shadow: 0 2px 10px #6ccaf8cc, 0 1px 3px #736df6cc;
		opacity: 0;
		animation: fadeIn 0.9s 0.6s forwards;
		text-align: center;
	}

	@keyframes fadeIn {
		to { opacity: 1; }
	}
</style>
