<script setup>
	import { useRoute, useRouter } from 'vue-router'
	import { getAuth, applyActionCode } from 'firebase/auth'
	import { onMounted, ref } from 'vue'

	const route = useRoute()
	const router = useRouter()
	const message = ref('Подтверждение...')

	onMounted(async () => {
		const mode = route.query.mode
		const oobCode = route.query.oobCode
		if (mode === 'verifyEmail' && oobCode) {
			try {
				const auth = getAuth()
				await applyActionCode(auth, oobCode)
				message.value = 'Почта успешно подтверждена!'
			} catch (e) {
				message.value = 'Ошибка подтверждения: ' + e.message
			}
		} else {
			message.value = 'Некорректная ссылка'
		}
	})
</script>

<template>
	<div class="verify-container">
		<h1>{{ message }}</h1>
	</div>
</template>

<style scoped>
	.verify-container {
		text-align: center;
		margin-top: 100px;
		font-family: 'Uncial Antiqua', cursive;
		color: #6b3ab3;
	}
</style>
