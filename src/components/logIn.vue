<template>
	<div class="auth">
		<div class="auth__inner">
			<div class="auth__form">
				<div class="auth__title">{{ mode === 'login' ? t('auth.auths') : t('auth.regs') }}</div>
				<div class="auth__tabs">
					<div
						v-for="tab in tabs"
						:key="tab.value"
						class="auth__tab"
						:class="{ 'auth__tab--active': mode === tab.value }"
						@click="mode = tab.value"
					>
						{{ t(tab.label) }}
					</div>
					<div class="auth__toggle" :class="`auth__toggle--${mode}`"></div>
				</div>
				<div class="auth__fields">
					<div v-for="field in visibleFields" :key="field.id" class="auth__field">
						<label class="auth__label">{{ field.label }}</label>
						<input
							class="auth__input"
							:type="field.type"
							:placeholder="t(`placeholder.${field.name}`)"
							v-model="field.value"
							:required="field.required"
							:maxlength="field.maxlength || null"
						/>
					</div>
					<div class="auth__actions">
						<button @click="handleSubmit" class="auth__submit">
							{{ mode === 'login' ? t('auth.logIn') : t('auth.regs') }}
						</button>
					</div>
					<div v-if="error" class="auth__error">{{ error }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed, watch} from 'vue'
	import {userAuthStore} from '../../store/authStore.js'
	import {useRouter} from 'vue-router'
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
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


	const tabs = [
		{ value: 'login', label: 'auth.logIn' },
		{ value: 'register', label: 'auth.regs' }
	]

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
	.auth {
		position: fixed;
		top: 0;
		right: 0;
		width: 440px;
		max-width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #4957c6 0%, #7c89e7 100%);
		box-shadow: -12px 0 44px #323fa733;
		display: flex;
		flex-direction: column;
		justify-content: center;
		z-index: 1000;
	}

	.auth__inner {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.auth__form {
		width: 98%;
		margin: 30px auto 0 auto;
		border-radius: 32px;
		padding: 38px 34px 30px 34px;
		position: relative;
		overflow: visible;
		background: transparent;
	}

	.auth__title {
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

	.auth__tabs {
		width: 100%;
		display: flex;
		background: #eaf0ff;
		border-radius: 16px;
		position: relative;
		margin-bottom: 22px;
		box-shadow: 0 2px 12px #4e6be655 inset, 0 1px 0 #fff7;
		overflow: hidden;
	}

	.auth__tab {
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

	.auth__tab--active {
		color: #fff;
		text-shadow: 0 2px 12px #4957c6cc, 0 1px 2px #fff, 0 1px 0 #fff6;
	}

	.auth__toggle {
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

	.auth__toggle--register {
		transform: translateX(100%);
	}

	.auth__toggle--login {
		transform: translateX(0%);
	}

	.auth__fields {
		width: 100%;
	}

	.auth__field {
		width: 100%;
		margin-bottom: 19px;
	}

	.auth__label {
		font-size: 15px;
		margin-bottom: 6px;
		color: #eaf0ff;
		text-shadow: 0 2px 4px #35357022, 0 0 2px #fff8;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.auth__input {
		width: 100%;
		padding: 18px 20px;
		border: none;
		border-radius: 12px;
		background: #fff;
		font-size: 14px;
		color: #323d4b;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 500;
		box-shadow: 0 2px 12px #6f7eea22 inset;
		transition: box-shadow 0.2s;
		outline: none;
	}

	.auth__input:focus {
		box-shadow: 0 0 18px #c9deff77, 0 2px 6px #eaf0ffcc inset;
	}

	.auth__actions {
		width: 100%;
		margin-top: 8px;
	}

	.auth__submit {
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

	.auth__submit:hover {
		background: linear-gradient(90deg, #77b9ff 20%, #417fff 100%);
		color: #fff;
		box-shadow: 0 6px 26px #417fff88, 0 2px 10px #c9deff55 inset;
	}

	.auth__error {
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
	}

	@media (max-width: 600px) {
		.auth {
			width: 100vw;
			padding: 0;
		}
		.auth__form {
			padding: 16vw 2vw 8vw 2vw;
			max-width: 100vw;
		}
	}


</style>
