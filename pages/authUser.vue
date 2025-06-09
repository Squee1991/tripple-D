<template>
	<div class="preloader">
		<div class="magic-logo">
			<span class="der">Der</span>
			<span class="die">Die</span>
			<span class="das">Das</span>
		</div>
		<div class="loading-bar">
			<div class="bar"></div>
		</div>
		<p class="message">Loading magical cards...</p>
	</div>
</template>

<script setup>
	import { onMounted } from 'vue'
	import { useRouter } from 'vue-router'

	const router = useRouter()

	onMounted(() => {
		setTimeout(() => {
			router.push('/')
		}, 1700)
	})
</script>

<style scoped>
	.preloader {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #4c50c2 0%, #5746a1 80%);
		font-family: 'Montserrat', 'Cinzel', sans-serif;
		overflow: hidden;
	}

	.magic-logo {
		display: flex;
		gap: 16px;
		margin-bottom: 36px;
		filter: drop-shadow(0 4px 18px #19195899);
	}

	.magic-logo span {
		display: inline-block;
		font-size: 2.8rem;
		font-weight: 800;
		padding: 0.4em 1.1em;
		border-radius: 22px;
		box-shadow: 0 4px 24px #fff4;
		letter-spacing: 0.04em;
		text-shadow: 0 2px 10px #fff6, 0 0px 1px #444abbbb;
		border: 2.5px solid #fff;
		position: relative;
	}

	.magic-logo .der {
		background: linear-gradient(120deg, #17181e 60%, #28293e 100%);
		color: #fff;
		box-shadow: 0 4px 16px #0007, 0 0 14px #fff8;
		border-color: #ffe066;
	}
	.magic-logo .die {
		background: linear-gradient(120deg, #e84141 70%, #f67c63 100%);
		color: #fff;
		box-shadow: 0 4px 14px #c13737a0, 0 0 10px #fff6;
		border-color: #ffd0bb;
	}
	.magic-logo .das {
		background: linear-gradient(120deg, #ffe066 60%, #fffbe2 100%);
		color: #333;
		box-shadow: 0 4px 18px #ffe06690, 0 0 10px #fff8;
		border-color: #d1a700;
	}

	.loading-bar {
		width: 280px;
		height: 18px;
		background: #ffffff22;
		border-radius: 10px;
		margin-bottom: 30px;
		overflow: hidden;
		box-shadow: 0 4px 24px #2c2a6a30;
		position: relative;
		border: 2px solid #fff;
	}

	.bar {
		width: 0%;
		height: 100%;
		background: linear-gradient(90deg, #f7d83e 0%, #ff7981 70%, #736df6 100%);
		border-radius: 10px;
		box-shadow: 0 0 16px #ffe06699, 0 2px 9px #cf7bff99;
		animation: loading 1.2s cubic-bezier(0.5,0.2,0.1,1) forwards;
	}
	@keyframes loading {
		0% { width: 0%; }
		70% { width: 85%; }
		100% { width: 100%; }
	}

	.message {
		font-size: 1.25rem;
		margin-top: 0.2em;
		letter-spacing: 1.5px;
		text-align: center;
		color: #fff;
		text-shadow: 0 2px 10px #ffe066, 0 1px 3px #443abbaa;
		font-weight: 700;
		animation: fadeIn 1s 0.6s ease forwards;
		opacity: 0;
	}

	@keyframes fadeIn {
		to { opacity: 1; }
	}
</style>
