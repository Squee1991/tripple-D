<template>
	<section id="contact" ref="contactSection" class="contact">
		<div class="contact__wrapper">
			<div class="contact-form">
				<div class="form__animation-wrapper">
					<div ref="msgAnimationWrapper" class="form__animation"></div>
				</div>
				<div class="form__content">
					<div class="form__header">
						<p class="form__label">{{ t(data.label) }}</p>
						<h2 class="form__title">{{ t(data.title) }}</h2>
					</div>
					<div class="form__field">
						<label class="form__field-label" for="user_name">{{ t(data.placeholder.name) }}</label>
						<input id="user_name" class="input" v-model="userName" type="text" name="user_name"
							   :placeholder="t(data.placeholder.name)"/>
						<span class="error__message" v-if="errors.name">{{ errors.name }}</span>
					</div>
					<div class="form__field">
						<label class="form__field-label" for="user_message">{{ t(data.placeholder.message) }}</label>
						<textarea id="user_message" v-model="userMessage" class="area" cols="30" rows="5" name="message"
								  :placeholder="t(data.placeholder.message)"></textarea>
						<span class="error__message" v-if="errors.message">{{ errors.message }}</span>
					</div>
					<button type="submit" class="btn--submit" @click="sendMessage">{{ t(data.btn.text) }}</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import MessageAnimation from '../../assets/animation/sendMessage.json'
	import {ref, onMounted} from 'vue';
	import Lottie from 'lottie-web';
	import emailjs from 'emailjs-com';
	const contactSection = ref(null);
	const msgAnimationWrapper = ref(null);
	const {t} = useI18n()

	const data = ref({
		label: 'feedBack.label',
		title: 'feedBack.title',
		btn: {
			text: 'feedBack.btn',
		},
		placeholder: {
			name: 'feedBack.namePlaceholder',
			message: 'feedBack.messagePlaceholder'
		}
	});

	const errors = ref({ name: '', message: '' })
	const userName = ref('');
	const userMessage = ref('');

	onMounted(() => {
		if (msgAnimationWrapper.value) {
			Lottie.loadAnimation({
				container: msgAnimationWrapper.value,
				autoplay: false,
				loop: false,
				animationData: MessageAnimation,
				name: 'feedbackAnimation'
			});
		}
	});

	const sendMessage = async () => {
		errors.value = { name: '', message: '' };
		if (!userName.value.trim()) { errors.value.name = t('errors.enterName'); }
		if (!userMessage.value.trim()) { errors.value.message = t('errors.enterMsg'); }
		if (errors.value.name || errors.value.message) { return; }

		try {
			await emailjs.send( "service_9zsuox2", "template_s9p24lo", { from_name: userName.value, message: userMessage.value }, "2v5vLDUsbkXWrluyJ" );
			Lottie.play('feedbackAnimation');
			resetFields();
		} catch (error) {
			console.error(error);
		}
	};
	const resetFields = () => {
		userName.value = '';
		userMessage.value = '';
		errors.value = { name: '', message: '' };
	};

</script>

<style scoped>
	.contact {
		background-color: #F7FAFC; /* Светлый фон */
		padding: 6rem 1.5rem;
		font-family: 'Nunito', sans-serif;
	}

	.contact__wrapper {
		max-width: 1100px;
		margin: 0 auto;
		border-radius: 16px;
		overflow: hidden;
	}

	.contact-form {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.form__animation-wrapper {
		flex-basis: 45%;
		min-width: 300px;
		align-self: stretch;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.form__animation {
		width: 90%;
		max-width: 400px;
		animation: slideInLeft 0.8s ease-out;
	}

	.form__content {
		flex-basis: 55%;
		padding: 3rem;
		animation: slideInRight 0.8s ease-out;
	}

	.form__header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.form__label {
		font-size: 1rem;
		font-weight: 700;
		color: #5A67D8; /* Акцентный синий */
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form__title {
		font-size: 22px;
		font-weight: 800;
		color: #2D3748;
		margin-top: 0.5rem;
	}

	.form__field {
		margin-bottom: 1.5rem;
	}

	/* Скрываем стандартный label, используя его в placeholder */
	.form__field-label {
		display: none;
	}

	.input,
	.area {
		width: 100%;
		font-family: 'Nunito', sans-serif;
		font-weight: 600;
		color: #2D3748;
		border: 1px solid #E2E8F0;
		outline: none;
		background: #F7FAFC;
		border-radius: 8px;
		font-size: 1rem;
		padding: 0.8rem 1rem;
		transition: all 0.2s ease-in-out;
	}

	.input::placeholder,
	.area::placeholder {
		color: #A0AEC0;
	}

	.input:focus,
	.area:focus {
		background: #FFFFFF;
		border-color: #5A67D8;
		box-shadow: 0 0 0 3px rgba(90, 103, 216, 0.2);
	}

	.area {
		min-height: 120px;
		resize: vertical;
	}

	.error__message {
		color: #E53E3E;
		font-size: 0.875rem;
		display: block;
		margin-top: 0.5rem;
	}

	.btn--submit {
		width: 100%;
		font-family: 'Nunito', sans-serif;
		padding: 0.8rem 1.5rem;
		font-size: 1.1rem;
		font-weight: 700;
		border-radius: 8px;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
		background-color: #5A67D8;
		color: #FFFFFF;
	}
	.btn--submit:hover {
		background-color: #4C51BF;
		transform: translateY(-2px);
		box-shadow: 0 7px 14px rgb(0 0 0 / 0.1), 0 3px 6px rgb(0 0 0 / 0.08);
	}

	/* Анимации появления */
	@keyframes slideInLeft {
		from { transform: translateX(-50px); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	@keyframes slideInRight {
		from { transform: translateX(50px); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}

	/* Адаптивность */
	@media (max-width: 900px) {
		.contact-form {
			flex-direction: column;
		}
		.form__animation-wrapper {
			display: none; /* Скрываем анимацию на небольших экранах для экономии места */
		}
		.form__content {
			width: 100%;
			flex-basis: auto;
			padding: 2.5rem;
		}
	}

	@media (max-width: 640px) {
		.contact {
			padding: 4rem 1rem;
		}
		.form__content {
			padding: 2rem 1.5rem;
		}
		.form__title {
			font-size: 1.8rem;
		}
	}
</style>