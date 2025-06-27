<template>
	<div class="auth">
		<div class="auth__inner">
			<div class="auth__form">
				<div class="auth__title">
					<img
						@click="mode = 'login'"
						v-if="mode === 'reset'" class="auth__arrow" src="../../assets/images/arrowNav.svg" alt="">
					<div class="login__title">
						{{ mode === 'login' ? t('auth.auths') : mode === 'register' ? t('auth.regs') :
						t('auth.resetTitle') }}
					</div>
				</div>

				<div v-if="mode === 'login' || mode === 'register'" class="auth__tabs">
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
				<form class="auth-form">
					<div class="auth__fields">
						<div v-for="field in visibleFields" :key="field.id" class="auth__field">
							<label class="auth__label">
								<div class="auth__label-text">{{t(field.label)}}</div>
								<input
									class="auth__input"
									:type="field.type"
									:placeholder="t(field.placeholder)"
									v-model="field.value"
									:required="field.required"
									:autocomplete="field.autocomplete"
									:maxlength="field.maxlength || null"
								/>
							</label>
							<div v-if="field.error" class="auth__error">{{t(field.error) }}</div>
							<div v-if="resetSent" class="auth__success">{{ t('errors.resetSent') }}</div>
						</div>
						<div class="auth__actions">
							<button @click.prevent="handleSubmit" class="auth__submit">
								{{ mode === 'login' ? t('auth.logIn') : mode === 'register' ? t('auth.regs') :
								t('auth.resetBtn') }}
							</button>
						</div>
						<div v-if="mode === 'login'" class="auth__forgot" @click="mode = 'reset'">{{ t('auth.forgot')
							}}
						</div>
					</div>
				</form>
				<div v-if="mode === 'login'" class="google__auth-wrapper" @click="handleGoogleLogin">
					<div class="google__auth">{{t('auth.google')}}</div>
					<img class="google__icon" src="../../assets/images/search.svg" alt="">
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed, watch} from 'vue'
	import {userAuthStore} from '../../store/authStore.js'
	import {useRouter} from 'vue-router'
	import {useI18n} from 'vue-i18n'
	import {mapErrors} from '../../utils/errorsHandler.js'

	const {t} = useI18n()
	const router = useRouter()
	const emits = defineEmits(['close-auth-form'])
	const authStore = userAuthStore()
	const mode = ref('login')
	const resetSent = ref(false)
	const error = ref('')
	const fields = ref([
		{
			id: 1,
			name: "name",
			type: "text",
			placeholder: "placeholder.name",
			label: "formLabel.name",
			error: false,
			value: '',
			required: true,
			maxlength: 18,
			autocomplete: "username",
		},
		{
			id: 2,
			name: "email",
			type: "email",
			placeholder: "placeholder.email",
			label: "formLabel.email",
			error: false,
			value: '',
			required: true,
			autocomplete: "email",
		},
		{
			id: 3,
			name: "password",
			type: "password",
			placeholder: "placeholder.password",
			label: "formLabel.password",
			error: false,
			value: '',
			required: true,
			autocomplete: "current-password",
		},
		{
			id: 4,
			name: "confirm",
			type: "password",
			placeholder: "placeholder.confirm",
			label: "formLabel.confirm",
			error: false,
			value: '',
			required: true,
			autocomplete: "new-password",
		},
	])
	const tabs = [
		{value: 'login', label: 'auth.logIn'},
		{value: 'register', label: 'auth.regs'}
	]
	const visibleFields = computed(() => {
		if (mode.value === 'login') {
			return fields.value.filter(f => f.name === 'email' || f.name === 'password')
		}
		if (mode.value === 'register') {
			return fields.value
		}
		if (mode.value === 'reset') {
			return fields.value.filter(f => f.name === 'email')
		}
	})

	const handleGoogleLogin = async () => {
		try {
			await authStore.loginWithGoogle()
			emits('close-auth-form')
			router.push('/')
		} catch (e) {
		}
	}


	function validateFields(values) {
		fields.value.forEach(field => field.error = '')

		if (mode.value === 'login' || mode.value === 'register') {
			if (!values.email) fields.value.find(f => f.name === 'email').error = 'errors.errorEmail'
			if (!values.password) fields.value.find(f => f.name === 'password').error = 'errors.errorPassword'
			if (mode.value === 'register') {
				if (!values.name) fields.value.find(f => f.name === 'name').error = 'errors.errorName'
				if (values.password !== values.confirm) {
					fields.value.find(f => f.name === 'confirm').error = 'errors.errorConfirm'
				}
			}
		}

		if (mode.value === 'reset') {
			if (!values.email) fields.value.find(f => f.name === 'email').error = 'errors.errorEmail'
		}

		return fields.value.every(f => !f.error)
	}


	const handleSubmit = async () => {
		const values = Object.fromEntries(fields.value.map(field => [field.name, field.value]))
		if (!validateFields(values)) return
		try {
			if (mode.value === 'reset') {
				await authStore.resetPassword(values.email)
				resetSent.value = true
				setTimeout(() => {
					mode.value = 'login'
					resetSent.value = false
				}, 2500)
				return
			}
			if (mode.value === 'register') {
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

			fields.value.forEach(f => f.value = '')
		} catch (e) {
			console.log(e)
			fields.value.forEach(f => f.error = '')
			mapErrors(fields.value, e.code)
		}
	}

	watch(mode, () => {
		fields.value.forEach(field => {
			field.value = ''
			field.error = '';
		})
	})

	onUnmounted(() => {
		document.body.style.overflow = ''
	})
</script>

<style>

	.login__title {
		text-align: start;
		font-size: 23px;
	}

	.google__auth-wrapper {
		margin-top: 30px;
		background: linear-gradient(90deg, #417fff 0%, #6fa4ff 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20px;
		cursor: pointer;
		padding: 9px;
	}

	.google__icon {
		width: 37px;
		padding: 6px;
		background: white;
		border-radius: 50%;
	}

	.google__auth {
		font-weight: 600;
		font-size: 17px;
		margin-right: 5px;
		color: white;
	}

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

	.auth__label-text {
		padding: 5px 0;
		font-size: 13px;
	}

	.auth__arrow {
		transform: rotate(90deg);
		width: 40px;
		cursor: pointer;
	}

	.auth__forgot {
		text-align: center;
		cursor: pointer;
		padding-top: 20px;
		color: white;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 600;
		font-style: italic;
	}

	.auth__inner {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.auth__form {
		width: 100%;
		border-radius: 32px;
		padding: 15px 34px 30px 34px;
		position: relative;
		overflow: visible;
		background: transparent;
	}

	.auth__title {
		display: flex;
		align-items: center;
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
		margin-bottom: 10px;
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
		transition: transform 0.4s cubic-bezier(.38, 1.32, .39, 1);
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
		height: 92px;
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
		margin-top: 15px;
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

	.auth__error,
	.auth__success {
		color: #ee0505;
		text-align: start;
		border-radius: 9px;
		font-size: 13px;
		letter-spacing: 1px;
		/*text-shadow: 0 1px 6px #0a195088, 0 0px 2px #fff7;*/
		/*box-shadow: 0 0 10px #e3545444;*/
	}

	@media (max-width: 600px) {
		.auth {
			width: 100vw;
			padding: 0;
		}

		.auth__form {
			padding: 20px;
			max-width: 100vw;
		}

		.auth__title {
			font-size: 29px;
		}

		.auth__submit {
			font-size: 19px;
			padding: 15px;
		}

		.auth__forgot {
			font-size: 14px;
		}

		.auth__tab {
			font-size: 19px;
			padding: 10px 4px 10px 5px;
		}

		.auth__label-text {
			font-size: 11px;
		}

		.auth__input {
			padding: 16px;
		}

		.auth__field {
			height: 81px;
		}
	}


</style>
