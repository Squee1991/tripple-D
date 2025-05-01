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
				<div class="fields__group">
					<div v-for="field in visibleFields" :key="field.id" class="form-field">
						<label class="form-label">{{ field.label }}</label>
						<input
							class="form-input"
							:type="field.type"
							:placeholder="field.placeholder"
							v-model="field.value"
							:required="field.required"
							:maxlength="field.maxlength || null"
						/>
					</div>
					<div class="form-actions">
						<button @click="handleSubmit" class="submit-button">
							{{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {ref , computed} from 'vue'
	import {userAuthStore} from '../../store/authStore.js'
	const authStore = userAuthStore()
	const mode = ref('login')
	const error = ref('')
	const fields = ref([
		{
			id: 1,
			name: "name",
			type: "text",
			placeholder: "введите имя или никнейм",
			value: "",
			error: false,
			required: true,
			maxlength: 15,
		},
		{
			id: 2,
			name: "email",
			type: "email",
			placeholder: "введите ваш Email",
			value: "",
			error: false,
			required: true
		},
		{
			id: 3,
			name: "password",
			type: "password",
			placeholder: "введите ваш пароль",
			value: "",
			error: false,
			required: true
		},
		{
			id: 4,
			name: "confirm",
			type: "password",
			placeholder: "повторите ваш пароль",
			value: "",
			error: false,
			required: true
		},
	]);

	const visibleFields = computed(() => {
		return mode.value === 'login' ? fields.value.filter(field => field.name === 'email' || field.name === 'password') : fields.value
	})

	const handleSubmit = async () => {
		try {
			const values = Object.fromEntries(fields.value.map(field => [field.name, field.value]))
			if (!values.email || !values.password) {
				error.value = 'Заполните все поля'
				return
			}
			if (values.password.length < 6) {
				error.value = 'Пароль должен быть не менее 6 символов'
				return
			}
			if (mode.value === 'register') {
				if (!values.name) {
					error.value = 'Введите имя'
					return
				}
				if (values.password !== values.confirm) {
					error.value = 'Пароли не совпадают'
					return
				}
				await authStore.registerUser({
					name: values.name,
					email: values.email,
					password: values.password
				})
			} else {
				await authStore.loginUser({
					email: values.email,
					password: values.password
				})
			}
			fields.value.forEach(field => field.value = '')
		} catch (e) {
			switch (e.code) {
				case 'auth/email-already-in-use':
					error.value = 'Этот email уже используется'
					break
				case 'auth/invalid-email':
					error.value = 'Некорректный email'
					break
				case 'auth/operation-not-allowed':
					error.value = 'Операция не разрешена'
					break
				case 'auth/weak-password':
					error.value = 'Слишком слабый пароль'
					break
				case 'auth/user-not-found':
					error.value = 'Пользователь не найден'
					break
				case 'auth/wrong-password':
					error.value = 'Неверный пароль'
					break
				case 'auth/invalid-credential':
					error.value = 'Неверный email или пароль'
					break
				default:
					error.value = `Ошибка: ${e.message}`
			}
		}
	}

</script>

<style>

	.fields__group{
		width: 100%;
	}

	.register__inner {
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
		color: white;
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
		background: linear-gradient(145deg, #f5f0e6, #e8e1d1);

		box-shadow: -10px 0 40px #00000022;
		color: #333;
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
		color: black;
		margin-bottom: 10px;
	}

	.form-label {
		font-size: 14px;
		color: #cccccc;
	}

	.form-input {
		padding: 10px;
		border: 1px solid #2c3e50;
		border-radius: 6px;
		background: #1e263c;
		color: white;
		font-size: 14px;
		margin-top: 5px;
	}

	.form-input:focus {
		border-color: #00ffff;
		outline: none;
	}

	.form-actions {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 10px;
	}

	.submit-button {
		background: #00ffff44;
		padding: 12px 24px;
		border-radius: 8px;
		color: white;
		font-weight: bold;
		cursor: pointer;
		border: 1px solid black;
		transition: background 0.3s;
		width: 100%;
		text-align: center;
	}

	.submit-button:hover {
		background: #00ffff88;
	}

	.error-message {
		color: #ff5252;
		margin-top: 15px;
		text-align: center;
		font-size: 12px;
		padding: 10px;
	}

</style>
