<template>
	<div class="register-panel">
		<div class="register__inner">
			<div class="form-wrapper">
				<div class="form-title">{{ mode === 'login' ? 'Авторизация' : 'Регистрация' }}</div>

				<div class="form__swiper">
					<div class="form__swiper-word" :class="{ active: mode === 'login' }" @click="mode = 'login'">Войти</div>
					<div class="form__swiper-word" :class="{ active: mode === 'register' }" @click="mode = 'register'">Регистрация</div>
					<div class="form__swiper-toggle" :class="mode"></div>
				</div>
				<div v-if="mode === 'register'" class="form-field">
					<label class="form-label">Имя</label>
					<input class="form-input" type="text" v-model="nameValue"/>
				</div>
				<div class="form-field">
					<label class="form-label">Email</label>
					<input class="form-input" type="email" v-model="email"/>
				</div>
				<div class="form-field">
					<label class="form-label">Пароль</label>
					<input class="form-input" type="password" v-model="password"/>
				</div>
				<div v-if="mode === 'register'" class="form-field">
					<label class="form-label">Подтверждение пароля</label>
					<input class="form-input" type="password" v-model="confirmPassword"/>
				</div>
				<div class="form-actions">
					<div class="submit-button">
						{{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
	import { ref } from 'vue'
	const mode = ref('register')
	const email = ref('')
	const password = ref('')
	const confirmPassword = ref('')
	const nameValue = ref('')
</script>


<style>

	.register__inner{
		padding-top: 100px;
	}

	.form__swiper {
		width: 100%;
		background: #1e263c;
		display: flex;
		position: relative;
		margin-bottom: 15px;
		border-radius: 15px;
		overflow: hidden;
	}

	.form__swiper-word {
		font-size: 18px;
		font-weight: 600;
		padding: 10px;
		width: 50%;
		text-align: center;
		color: #ccc;
		cursor: pointer;
		z-index: 1;
		transition: color 0.3s;
	}

	.form__swiper-word.active {
		color: #00ffff;
	}

	.form__swiper-toggle {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background: #00ffff22;
		border-radius: 15px;
		transition: transform 0.3s ease;
		z-index: 0;
	}

	.form__swiper-toggle.register {
		transform: translateX(100%);
		transition: .5s;
	}

	.form__swiper-toggle.login {
		transform: translateX(0%);
		transition: .5s;
	}

	.register-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 360px;
		height: 100vh;
		background: #11182c;
		box-shadow: -5px 0 20px #00ffff44;
		padding: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: transform 0.4s ease;
		z-index: 1000;
	}

	.form-wrapper {
		align-items: center;
		display: flex;
		flex-direction: column;
		padding: 30px;
		color: white;
		height: 100vh;
	}

	.form-title {
		font-size: 24px;
		font-weight: bold;
		text-align: start;
		width: 100%;
		color: #00ffff;
		margin-bottom: 10px;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 10px;
	}

	.form-label {
		font-size: 14px;
		color: #cccccc;
	}

	.form-input {
		padding: 10px;
		border: none;
		border-radius: 6px;
		background: #1e263c;
		color: white;
		font-size: 14px;
	}

	.form-actions {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.submit-button {
		background: #00ffff44;
		padding: 12px 24px;
		border-radius: 8px;
		color: white;
		font-weight: bold;
		cursor: pointer;
		border: 1px solid #00ffffaa;
		transition: background 0.3s;
		width: 100%;
	}

	.submit-button:hover {
		background: #00ffff88;
	}

</style>
