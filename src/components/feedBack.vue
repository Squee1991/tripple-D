<script setup>
	import MessageAnimation from '../../assets/animation/message.json'
	// import {useScrollObserver} from "../utils/useScrollObserver";
	import {ref, onMounted} from 'vue';
	import Lottie from 'lottie-web';
	import emailjs from 'emailjs-com';

	const contactSection = ref(null);
	const msgAnimationWrapper = ref(null);
	const isVisible = ref(false);
	const {t} = useI18n()

	const data = ref({
		label: 'feedBack.label',
		title: 'feedBack.title',
		btn: {
			text: 'feedBack.btn',
		},
		errors: {
			notValidEmail: "",
			enterMessage: "",
			enterName: "",
		},
		placeholder: {
			name: 'feedBack.namePlaceholder',
			message: 'feedBack.messagePlaceholder'
		}
	});

	const errors = ref({
		name: '',
		message: ''
	})
	const userName = ref('');
	const userMessage = ref('');
	onMounted(() => {

		isVisible.value = true;
		if (msgAnimationWrapper.value) {
			Lottie.loadAnimation({
				container: msgAnimationWrapper.value,
				autoplay: true,
				loop: true,
				animationData: MessageAnimation,
			});
		}

	});

	const sendMessage = async () => {
		errors.value = {
			name: '',
			message: ''
		};
		if (!userName.value.trim()) {
			errors.value.name = t('errors.enterName');
		}
		if (!userMessage.value.trim()) {
			errors.value.message = t('errors.enterMsg');
		}
		if (errors.value.name || errors.value.message) {
			return;
		}

		try {
			await emailjs.send(
				"service_9zsuox2",
				"template_s9p24lo",
				{
					from_name: userName.value, // Отправляем имя
					message: userMessage.value,
				},
				"2v5vLDUsbkXWrluyJ"
			);
			resetFields();
		} catch (error) {
			console.error(error);
		}
	};
	const resetFields = () => {
		userName.value = ''; // Сброс имени
		userMessage.value = '';
		errors.value = {
			name: '', // Сброс ошибок имени
			message: ''
		};
	};

</script>

<template>
	<section id="contact" ref="contactSection" class="contact">
		<div class="contact__wrapper">
			<div class="form">
				<div class="form__wrapper">
					<div class="form__animation-wrapper">
						<div ref="msgAnimationWrapper" class="form__animation" :class="{ 'visible': isVisible }"></div>
					</div>
					<div class="form__wrapper-inner" :class="{ 'visible': isVisible }">
						<div class="contact__label label">{{ t(data.label) }}</div>
						<div class="contact__title">{{ t(data.title) }}</div>
						<div class="form__field__inner">
							<label class="label">
								<input class="input" v-model="userName" type="text" name="user_name"
								       :placeholder="t(data.placeholder.name)"/> </label>
							<span class="error__message" v-if="errors.name"> {{ errors.name }}</span></div>
						<div class="form__message__inner">
							<label class="label__area">
                     <textarea v-model="userMessage" class="area" cols="30" rows="10" name="message"
                               :placeholder="t(data.placeholder.message)"></textarea>
							</label>
							<span class="error__message" v-if="errors.message"> {{ errors.message }}</span>
						</div>
						<div @click="sendMessage" class="form__btn">
							<button type="submit" class="contact__btn btn">{{ t(data.btn.text) }}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>


<style scoped>

	@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');

	.contact {
		overflow-x: hidden;
		background: linear-gradient(135deg, #f5f7ff, #eef1ff);
		padding: 60px 0;
	}

	.contact__wrapper {
		padding: 50px 20px;
		border-radius: 20px;
		max-width: 1400px;
		margin: 0 auto;
		/*background: white;*/
		/*box-shadow: 0 15px 50px rgba(92, 58, 255, 0.08);*/
		position: relative;
		overflow: hidden;
	}

	.form__wrapper {
		display: flex;
		justify-content: center;
		gap: 40px;
		padding: 0 40px;
		border-radius: 20px;
		flex-wrap: wrap;
	}

	.form__animation-wrapper {
		display: flex;
		width: 45%;
		min-width: 300px;
		align-items: center;
		justify-content: center;
	}

	.form__animation {
		width: 100%;
		opacity: 0;
		transform: translateX(-100%);
	}

	.form__animation.visible {
		animation: slideInLeft 1s ease-out forwards;
	}

	.form__wrapper-inner {
		width: 50%;
		min-width: 320px;
		padding: 30px;
		opacity: 0;
		animation: slideInRight 1s ease-out forwards;
	}

	.form__wrapper-inner.visible {
		opacity: 1;
	}

	.contact__label {
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

	.contact__label:after {
		content: '';
		width: 60px;
		height: 4px;
		background: #5c3aff;
		display: block;
		margin: 10px auto 0;
		border-radius: 2px;
		box-shadow: 0 2px 8px rgba(92, 58, 255, 0.5);
	}

	.contact__title {
		font-size: 17px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 900;
		font-style: italic;
		margin-bottom: 20px;
		/*color: #ffffff;*/
		text-align: center;
		letter-spacing: 1px;
		/*text-shadow: 0 2px 2px #0a195088, 0 2px 2px #fff7, 0 0 2px #ced2ff;*/
		filter: drop-shadow(0 1px 0 #7c89e7);
	}

	.form__field__inner,
	.form__message__inner {
		margin-bottom: 20px;
		position: relative;
	}

	.input,
	.area {
		width: 100%;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 600;
		color: #1a236e;
		border: none;
		outline: none;
		background: linear-gradient(135deg, #f8faff 60%, #e0eaff 100%);
		box-shadow: 0 2px 10px #1a237e12,
		0 2px 4px 0 #fff6 inset,
		0 0.5px 0 #5c3aff50 inset;
		border-radius: 14px 30px 14px 30px / 10px 1px 10px 4px;
		font-size: 18px;
		letter-spacing: 0.01em;
		padding: 15px 18px;
		transition: background 0.18s, box-shadow 0.16s, color 0.14s;
		text-shadow: 0 1px 4px #fff6, 0 0px 1px #7f56d988;
	}

	.input:focus,
	.area:focus {
		background: linear-gradient(135deg, #fff 70%, #f0f7ff 100%);
		box-shadow: 0 4px 18px #3a56e124,
		0 2px 12px #a193e81a,
		0 1px 8px #fff8 inset,
		0 0.5px 0 #5c3aff90 inset;
		color: #22005e;
		outline: none;
	}

	.area {
		min-height: 140px;
		max-height: 220px;
		resize: vertical;
		font-size: 18px;
	}

	.error__message {
		color: #e25454;
		font-size: 14px;
		margin-top: 5px;
		font-family: system-ui, sans-serif;
	}

	.contact__btn.btn {
		width: 100%;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 800;
		font-size: 22px;
		color: #fff;
		background: linear-gradient(180deg, #8fa5fd 0%, #547fff 80%);
		border-radius: 20px;
		border: none;
		box-shadow: 0 6px 24px #849bff44,
		0 2px 12px #fff7 inset;
		letter-spacing: 0.04em;
		text-shadow: 0 3px 12px #5572cbaa, 0 1px 0 #fff9, 0 0px 1px #fff8;
		transition: background 0.18s, box-shadow 0.13s, transform 0.12s;
		margin-top: 16px;
		padding: 18px 0;
		cursor: pointer;
		transform: none;
	}

	.contact__btn.btn:hover {
		background: linear-gradient(180deg, #adc6ff 10%, #3154cf 100%);
		/*box-shadow:*/
		/* 0 12px 16px #7a99ff69,*/
		/* 0 5px 18px #fff7 inset;*/
		/*color: #f7f7ff;*/
	}

	@keyframes slideInLeft {
		from {
			transform: translateX(-100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes slideInRight {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* Mobile and tablet responsive */
	@media (max-width: 1024px) {
		.form__wrapper {
			padding: 10px;
		}

		.form__animation-wrapper {
			display: none;
		}

		.form__wrapper-inner {
			width: 100%;
			padding: 20px;
		}
	}

	@media (max-width: 640px) {
		.contact__label {
			font-size: 26px;
		}

		.contact__title {
			font-size: 13px;
			font-weight: 500;
		}

	}

	@media (max-width: 768px) {
		.contact__btn.btn {
			font-size: 16px;
			padding: 14px;
			margin: 0;
		}

		.contact__wrapper {
			padding: 10px;
		}

		.contact {
			padding: 0;
		}

		.input,
		.area{
			font-size: 13px;
		}
	}
</style>