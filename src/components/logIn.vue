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
	import {ref , computed , watch} from 'vue'
	import {userAuthStore} from '../../store/authStore.js'
	import { useRouter} from 'vue-router'
	const router = useRouter()
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
				router.push('/learnmode')
			} else {
				await authStore.loginUser({
					email: values.email,
					password: values.password
				})
				router.push('/learnmode')
			}
			fields.value.forEach(field => field.value = '')
		} catch (e) {
			if (e.code === 'auth/email-not-verified') {
				error.value = 'Подтвердите ваш email перед входом. Письмо уже отправлено.'
				return
			}
		}
	}

	watch(mode , () => {
		fields.value.forEach(field => {
			field.value = ''
		})
		error.value = ''
	} )
</script>

<style>
	.register-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 380px;
		height: 100vh;
		background: linear-gradient(135deg, #fefaf3, #ece3d9);
		box-shadow: -10px 0 40px #00000033;
		padding: 40px 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-left: 3px solid #87ceebaa;
		font-family: 'Kurale', serif;
		z-index: 1000;
	}

	.form-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #2b2b2b;
	}

	.form-title {
		font-size: 26px;
		font-weight: bold;
		margin-bottom: 20px;
		color: #3b2e1f;
		text-align: center;
	}

	.form__swiper {
		width: 100%;
		display: flex;
		background: #ede7dc;
		border-radius: 10px;
		position: relative;
		margin-bottom: 20px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.1);
	}

	.form__swiper-word {
		flex: 1;
		text-align: center;
		padding: 12px;
		cursor: pointer;
		color: #7a6f60;
		font-weight: bold;
		z-index: 1;
		transition: color 0.3s ease;
	}

	.form__swiper-word.active {
		color: #000;
	}

	.form__swiper-toggle {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background: #add8e6aa;
		border-radius: 10px;
		transition: transform 0.4s ease;
		z-index: 0;
	}

	.form__swiper-toggle.register {
		transform: translateX(100%);
	}

	.form__swiper-toggle.login {
		transform: translateX(0%);
	}

	.form-field {
		width: 100%;
		margin-bottom: 16px;
	}

	.form-label {
		font-size: 14px;
		margin-bottom: 6px;
		color: #5a5247;
	}

	.fields__group {
		width: 100%;
	}

	.form-input {
		width: 100%;
		padding: 12px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: #fffdf9;
		font-size: 15px;
		color: #333;
		box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
		transition: border 0.3s ease;
	}

	.form-input:focus {
		border-color: #00bfff;
		outline: none;
		box-shadow: 0 0 6px #00bfff66;
	}

	.submit-button {
		width: 100%;
		background: linear-gradient(to right, #b3ecff, #87cefa);
		border: 2px solid #00bfff88;
		color: #2b2b2b;
		font-weight: bold;
		font-size: 16px;
		padding: 12px;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 0 12px #00ffff22;
	}

	.submit-button:hover {
		background: linear-gradient(to right, #87cefa, #00bfff);
		color: white;
		box-shadow: 0 0 16px #00bfffaa;
	}

	.error-message {
		color: #c62828;
		background: #ffebee;
		border-radius: 6px;
		padding: 10px;
		text-align: center;
		font-size: 13px;
		margin-top: 15px;
	}

    .register__inner{
	    height: 100%;
    }
</style>
