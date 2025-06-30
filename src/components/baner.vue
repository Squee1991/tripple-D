<template>
	<Overlay :visible="showAuth" @close="closeAuth" />
	<transition name="slide">
		<SignIn v-if="showAuth" @success="closeAuth" />
	</transition>
	<div class="banner">
		<section class="banner__section">
			<div class="banner__wrapper">
				<div class="banner__content">
					<div class="banner__orbit">
                  <span
						  class="banner__orbit-word banner__orbit-word--der"
						  :class="{ 'glow-black': glowType === 'der', 'fade-glow': fadingGlow === 'der' }"
						  @click="triggerGlow('der')"
				  >Der</span>
						<span
								class="banner__orbit-word banner__orbit-word--die"
								:class="{ 'glow-red': glowType === 'die', 'fade-glow': fadingGlow === 'die' }"
								@click="triggerGlow('die')"
						>Die</span>
						<span
								class="banner__orbit-word banner__orbit-word--das"
								:class="{ 'glow-gold': glowType === 'das', 'fade-glow': fadingGlow === 'das' }"
								@click="triggerGlow('das')"
						>Das</span>
					</div>
					<h1 class="banner__title">
						{{ t('banner.title')}}
					</h1>
					<button class="banner__button" @click="startLearning">{{ t('banner.btn')}}</button>
				</div>
				<div class="banner__mage-container">
					<div class="banner__mage"></div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import SignIn from '../components/logIn.vue'
	import Overlay from '../components/Uioverlay.vue'
	import {useRouter} from 'vue-router'
	import {userAuthStore} from '../../store/authStore'
	import {ref, watch} from "vue";
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n()
	const showAuth = ref(false)
	const userAuth = userAuthStore()
	const router = useRouter()
	const glowType = ref(null)
	const fadingGlow = ref(null)

	const openAuth = () => { showAuth.value = true }

	const triggerGlow = (type) => {
		if (glowType.value || fadingGlow.value) return;
		glowType.value = type;
		setTimeout(() => {
			fadingGlow.value = type;
			glowType.value = null;
			setTimeout(() => {
				fadingGlow.value = null;
			}, 1000);
		}, 500);
	}

	const closeAuth = () => { showAuth.value = false }

	const startLearning = () => {
		userAuth.name ? router.push('/choiceTheme') : openAuth()
	}

	watch(showAuth, (val) => {
		document.body.style.overflow = val ? 'hidden' : ''
	})
</script>

<style scoped>

	.banner {
		font-family: 'Nunito', sans-serif;
	}

	.banner__section {
		background-color: #F7FAFC;
		padding: 4rem 2rem;
	}

	.banner__wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1280px;
		margin: 0 auto;
		gap: 2rem;
	}

	.banner__content {
		flex: 1;
		max-width: 650px;
	}

	.banner__orbit {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.banner__orbit-word {
		padding: 0.5rem 1.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		border-radius: 999px;
		color: #FFFFFF;
		cursor: pointer;
		user-select: none;
		transition: all 0.2s ease-in-out;
	}
	.banner__orbit-word:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.banner__orbit-word--der { background-color: #2D3748; }
	.banner__orbit-word--die { background-color: #E53E3E; }
	.banner__orbit-word--das { background-color: #D69E2E; }

	.banner__title {
		font-size: 3rem; /* Вернул более крупный размер для заголовка */
		font-weight: 800;
		color: #2D3748;
		line-height: 1.2;
		margin-bottom: 2.5rem; /* Увеличил отступ */
	}

	.banner__button {
		font-family: 'Nunito', sans-serif;
		padding: 0.8rem 2rem;
		font-size: 1.1rem;
		font-weight: 700;
		border-radius: 8px;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
		background-color: #5A67D8;
		color: #FFFFFF;
	}
	.banner__button:hover {
		background-color: #4C51BF;
		transform: translateY(-2px);
		box-shadow: 0 7px 14px rgb(0 0 0 / 0.1), 0 3px 6px rgb(0 0 0 / 0.08);
	}

	.banner__mage-container {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 500px;
	}
	.banner__mage {
		width: 100%;
		aspect-ratio: 1 / 1;
		position: relative;
		background: radial-gradient(circle, #E2E8F0 50%, transparent 70%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.banner__mage::before, .banner__mage::after {
		content: '';
		position: absolute;
		border-radius: 50%;
	}
	.banner__mage::before {
		width: 70%;
		height: 70%;
		background: radial-gradient(circle, #CBD5E0, #E2E8F0);
		z-index: 1;
	}
	.banner__mage::after {
		width: 40%;
		height: 40%;
		background: #5A67D8;
		z-index: 2;
		box-shadow: 0 0 50px 20px #5a67d880;
	}

	/* ===== ВАША ОРИГИНАЛЬНАЯ АНИМАЦИЯ ВЫЕЗДА МЕНЮ ВОССТАНОВЛЕНА ===== */
	.slide-enter-active, .slide-leave-active {
		transition: all 0.3s ease;
	}
	.slide-enter-from, .slide-leave-to {
		opacity: 0;
		transform: translateX(100%);
	}
	/* =============================================================== */

	/* Анимация свечения */
	.glow-black { animation: glow-black-anim 0.5s ease-out; }
	.glow-red { animation: glow-red-anim 0.5s ease-out; }
	.glow-gold { animation: glow-gold-anim 0.5s ease-out; }

	.fade-glow { transition: filter 1s ease-in-out; }
	.fade-glow.glow-black { filter: drop-shadow(0 0 15px #2D3748); }
	.fade-glow.glow-red { filter: drop-shadow(0 0 15px #E53E3E); }
	.fade-glow.glow-gold { filter: drop-shadow(0 0 15px #D69E2E); }


	@keyframes glow-black-anim {
		50% { box-shadow: 0 0 30px 5px #2D3748; }
	}
	@keyframes glow-red-anim {
		50% { box-shadow: 0 0 30px 5px #E53E3E; }
	}
	@keyframes glow-gold-anim {
		50% { box-shadow: 0 0 30px 5px #D69E2E; }
	}

	@media (max-width: 900px) {
		.banner__wrapper {
			flex-direction: column;
			text-align: center;
		}
		.banner__orbit {
			justify-content: center;
		}
		.banner__content {
			max-width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.banner__mage-container {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.banner__section {
			padding: 3rem 1.5rem;
		}
		.banner__title {
			font-size: 2.25rem;
		}
		.banner__orbit-word {
			font-size: 1.2rem;
			padding: 0.4rem 1.2rem;
		}
		.banner__button {
			width: 100%;
			max-width: 300px;
		}
	}
</style>