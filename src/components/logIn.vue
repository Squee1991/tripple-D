<template>
	<div class="register-panel">
		<div class="register__inner">
			<div class="form-wrapper">
				<div class="form-title">{{ mode === 'login' ? 'Авторизация' : 'Регистрация' }}</div>
				<div class="form__swiper">
					<div class="form__swiper-word" :class="{ active: mode === 'login' }" @click="mode = 'login'">Войти
					</div>
					<div class="form__swiper-word" :class="{ active: mode === 'register' }" @click="mode = 'register'">
						Регистрация
					</div>
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
					<div v-if="error" class="error-message">{{ error }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {ref, computed, watch} from 'vue'
	import {userAuthStore} from '../../store/authStore.js'
	import {useRouter} from 'vue-router'

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
				router.push('/authUser')
			} else {
				await authStore.loginUser({
					email: values.email,
					password: values.password
				})
				router.push('/selectedTopics')
			}
			fields.value.forEach(field => field.value = '')
		} catch (e) {
			if (e.code === 'auth/email-not-verified') {
				error.value = 'Подтвердите ваш email перед входом. Письмо уже отправлено.'
				return
			}
		}
	}

	watch(mode, () => {
		fields.value.forEach(field => {
			field.value = ''
		})
		error.value = ''
	})
</script>

<style>
	.register-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 440px;
		max-width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #4957c6 0%, #7c89e7 100%);
		box-shadow: -12px 0 44px #323fa733, 0 0px 0 #000;
		padding: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		z-index: 1000;
	}

	.register__inner {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.form-wrapper {
		width: 98%;
		margin: 30px auto 0 auto;
		/*background: linear-gradient(120deg, #5e6bdf 70%, #6f7eea 100%);*/
		border-radius: 32px;
		padding: 38px 34px 30px 34px;
		/*box-shadow: 0 6px 36px #25306d48, 0 0px 0 #e7eafc00;*/
		border: none;
		position: relative;
		overflow: visible;
	}

	.form-title {
		font-size: 32px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 900;
		font-style: italic;
		margin-bottom: 20px;
		color: #fff;
		text-align: center;
		letter-spacing: 1px;
		text-shadow: 0 3px 12px #0a195088, 0 2px 2px #fff7, 0 0 2px #ced2ff;
		filter: drop-shadow(0 1px 0 #7c89e7);
	}

	.form__swiper {
		width: 100%;
		display: flex;
		background: #eaf0ff;
		border-radius: 16px;
		position: relative;
		margin-bottom: 22px;
		box-shadow: 0 2px 12px #4e6be655 inset, 0 1px 0 #fff7;
		border: none;
		overflow: hidden;
	}

	.form__swiper-word {
		flex: 1;
		text-align: center;
		padding: 18px 5px 16px 5px;
		cursor: pointer;
		color: #586cba;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 700;
		font-style: italic;
		font-size: 21px;
		letter-spacing: 1px;
		position: relative;
		transition: color 0.23s;
		user-select: none;
		z-index: 1;
	}

	.form__swiper-word.active {
		color: #fff;
		text-shadow: 0 2px 12px #4957c6cc, 0 1px 2px #fff, 0 1px 0 #fff6;
	}

	.form__swiper-toggle {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background: linear-gradient(90deg, #7da0ff 70%, #859bff 100%);
		border-radius: 16px;
		transition: transform 0.4s cubic-bezier(.38,1.32,.39,1);
		z-index: 0;
		box-shadow: 0 0 22px #7fa7ff4d;
		border: none;
	}

	.form__swiper-toggle.register {
		transform: translateX(100%);
	}

	.form__swiper-toggle.login {
		transform: translateX(0%);
	}

	.fields__group {
		width: 100%;
	}

	.form-field {
		width: 100%;
		margin-bottom: 19px;
	}

	.form-label {
		font-size: 15px;
		margin-bottom: 6px;
		color: #eaf0ff;
		text-shadow: 0 2px 4px #35357022, 0 0 2px #fff8;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.form-input {
		width: 100%;
		padding: 18px 20px;
		border: none;
		border-radius: 12px;
		background: #fff;
		font-size: 14px;
		color: #323d4b;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 500;
		box-shadow: 0 2px 12px #6f7eea22 inset, 0 0px 0 #7fa7ff00;
		transition: box-shadow 0.2s;
		outline: none;
	}

	.form-input:focus {
		box-shadow: 0 0 18px #c9deff77, 0 2px 6px #eaf0ffcc inset;
	}

	.form-actions {
		width: 100%;
		margin-top: 8px;
	}

	.submit-button {
		width: 100%;
		background: linear-gradient(90deg, #417fff 0%, #6fa4ff 100%);
		border: none;
		color: #fff;
		font-weight: 900;
		font-size: 24px;
		padding: 17px 0;
		border-radius: 18px;
		cursor: pointer;
		box-shadow: 0 4px 18px #3ab0ff55, 0 1px 4px #fff8 inset;
		text-shadow: 0 2px 8px #0b1956aa, 0 1px 0 #fff6;
		letter-spacing: 1px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-style: italic;
		transition: background 0.22s, box-shadow 0.22s, color 0.13s, transform 0.13s;
	}

	.submit-button:hover {
		background: linear-gradient(90deg, #77b9ff 20%, #417fff 100%);
		color: #fff;
		transform: scale(1.03);
		box-shadow: 0 6px 26px #417fff88, 0 2px 10px #c9deff55 inset;
	}

	.error-message {
		color: #fff;
		background: linear-gradient(90deg, #e35454 60%, #f76f6f 100%);
		border-radius: 9px;
		padding: 12px;
		text-align: center;
		font-size: 16px;
		margin-top: 18px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: bold;
		letter-spacing: 1px;
		text-shadow: 0 1px 6px #0a195088, 0 0px 2px #fff7;
		box-shadow: 0 0 10px #e3545444;
		border: none;
	}

	@media (max-width: 600px) {
		.register-panel {
			width: 100vw;
			padding: 0;
		}
		.form-wrapper {
			padding: 16vw 2vw 8vw 2vw;
			max-width: 100vw;
		}
	}

</style>
