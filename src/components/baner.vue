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
						<span class="banner__orbit-word banner__orbit-word--der" @click="triggerGlow('der')">Der</span>
						<span class="banner__orbit-word banner__orbit-word--die" @click="triggerGlow('die')">Die</span>
						<span class="banner__orbit-word banner__orbit-word--das" @click="triggerGlow('das')">Das</span>
					</div>
					<p class="banner__subtitle">
						{{ t('banner.title')}}
					</p>
					<button class="banner__button" @click="startLearning">{{ t('banner.btn')}}</button>
				</div>
				<div class="banner__mage">
					<img :src="Student" alt="">
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import SignIn from '../components/logIn.vue'
	import Overlay from '../components/Uioverlay.vue'
	import Student from '../../assets/images/student.svg'
	import {useRouter} from 'vue-router'
	import {userAuthStore} from '../../store/authStore'
	import {ref, watch} from "vue";
	import { useI18n } from 'vue-i18n'
	const { t , locale , locales , messages} = useI18n()
	const showAuth = ref(false)
	const userAuth = userAuthStore()
	const router = useRouter()
	const glowType = ref(null)
	const fadingGlow = ref(null)

	const openAuth = () => {
		showAuth.value = true
	}

	const triggerGlow = (type) => {
		glowType.value = type
		fadingGlow.value = null
		setTimeout(() => {
			fadingGlow.value = type
			glowType.value = null
			setTimeout(() => {
				fadingGlow.value = null
			}, 3333)
		}, 1111)
	}

	const closeAuth = () => {
		showAuth.value = false
	}

	const startLearning = () => {
		userAuth.name ? router.push('/examples') : openAuth()
	}

	watch(showAuth, (val) => {
		document.body.style.overflow = val ? 'hidden' : ''
	})

</script>


<style>

	.banner__wrapper {
		display: flex;
		justify-content: center;
		width: 100%;
		padding: 40px 0;
	}

	.banner__section {
		/*background: linear-gradient(135deg, #294cad, #3c57b4);*/
		/*background: #1e1e1e;*/
		padding: 30px 70px;
	}

	.banner__mage {
		width: 412px;
		height: 416px;
		padding: 10px;
		overflow: visible;
	}

	.banner__subtitle {
		max-width: 800px;
		font-size: 24px;
		/*font-family: 'Kurale', serif;*/
		font-weight: 600;
		color: #322f2f;
		/*text-shadow: 0 2px 8px #4b2e09a1, 0 1px 0 #fff8, 0 0px 2px #e6d9aa, 1px 2px 0 #a6752b99;*/
		letter-spacing: 0.04em;
		margin-bottom: 44px;
		padding: 0;
		font-style: italic;
		background: none;
		line-height: 1.35;
		/*filter: drop-shadow(0 2px 1px #473c0099);*/
	}

	.banner__content-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 40px;
	}

	.banner__button {
		width: 60%;
		padding: 14px 40px;
		/*background: linear-gradient(180deg, #366cff 60%, #4c88ff 100%);*/
		background: rgba(41, 52, 48, 0.95);
		border-radius: 16px;
		box-shadow: 0 4px 18px #0a4c12bb, 0 1px 4px #fff8 inset;
		color: #fff;
		font-weight: 900;
		font-size: 28px;
		font-style: italic;
		font-family: 'Montserrat', Arial, sans-serif;
		text-shadow: 0 2px 8px #034107aa, 0 1px 0 #fff6;
		letter-spacing: 1px;
		border: none;
		cursor: pointer;
		transform: skew(-8deg);
		transition: background 0.15s, transform 0.1s;
	}

	.banner__button:hover {
		background: linear-gradient(180deg, #82ff7a 10%, #27e500 100%);
		transform: skew(-8deg) scale(1.03);
		box-shadow: 0 8px 24px #136b21ee, 0 2px 6px #fff8 inset;
	}

	.fade-enter-active, .fade-leave-active,
	.slide-enter-active, .slide-leave-active {
		transition: all 0.3s ease;
	}

	.fade-enter-from, .fade-leave-to,
	.slide-enter-from, .slide-leave-to {
		opacity: 0;
		transform: translateX(+100%);
	}

	.banner__orbit {
		display: flex;
		gap: 15px;
		margin-bottom: 30px;
	}

	.banner__orbit-word {
		display: inline-block;
		padding: 10px 36px;
		font-size: 44px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 900;
		font-style: italic;
		letter-spacing: 1px;
		border-radius: 20px;
		box-shadow: 0 8px 30px 0 #1a237e33, 0 2px 10px 0 #fff9 inset;
		text-shadow: 0 2px 18px #fff8, 0 1px 2px #0005;
		transform: skew(-8deg);
		position: relative;
		transition: transform 0.12s, box-shadow 0.14s;
		cursor: pointer;
		user-select: none;
	}

	.banner__orbit-word:active {
		transform: skew(-8deg) scale(0.97);
	}

	.banner__orbit-word--der {
		background: linear-gradient(180deg, #000000 0%, #031126 100%);
		color: #fff;
		box-shadow: 0 4px 0 black, 0 8px 30px #23489966, 0 1px 4px #fff8 inset;
		text-shadow: 0 2px 10px #a8d8ffcc, 0 1px 2px #16305a80;
	}

	.banner__orbit-word--die {
		background: linear-gradient(180deg, #ff6161 0%, #d00000 100%);
		color: #fff;
		box-shadow: 0 5px 0 #830101, 0 8px 30px #9d313155, 0 1px 4px #fff8 inset;
		text-shadow: 0 2px 10px #ffc7c7cc, 0 1px 2px #80000090;
	}

	.banner__orbit-word--das {
		background: linear-gradient(180deg, gold 0%, gold 100%);
		color: #fff9dc;
		box-shadow: 0 5px 0 #c6a502, 0 8px 30px #e6cb5185, 0 1px 4px #fff8 inset;
		text-shadow: 0 2px 10px #fffbe2cc, 0 1px 2px #a0851099;
	}


	.fade-glow.glow-red {
		filter: drop-shadow(0 0 10px #ff1a1a) drop-shadow(0 0 0px #ff6666);
		transition: filter 1s;
	}

	.fade-glow.glow-black {
		filter: drop-shadow(0 0 10px #111) drop-shadow(0 0 0px);
		transition: filter 1s;
	}

	.fade-glow.glow-gold {
		filter: drop-shadow(0 0 10px gold) drop-shadow(0 0 0px gold);
		transition: filter 1s;
	}

	/* Анимации те же */
	@keyframes glow-red {
		from {
			filter: drop-shadow(0 0 10px #ff1a1a) drop-shadow(0 0 0px #ff6666);
		}
		to {
			filter: drop-shadow(0 0 0px #ff0000) drop-shadow(0 0 0px #fff);
			transition: filter 1s;
		}
	}

	@keyframes glow-black {
		from {
			filter: drop-shadow(0 0 10px #111) drop-shadow(0 0 00px);
		}
		to {
			filter: drop-shadow(0 0 0px #000) drop-shadow(0 0 0px);
		}
	}

	@keyframes glow-gold {
		from {
			filter: drop-shadow(0 0 10px gold) drop-shadow(0 0 0px gold);
		}
		to {
			filter: drop-shadow(0 0 0px gold) drop-shadow(0 0 0px gold);
		}
	}

	to {
		filter: drop-shadow(0 0 0px gold) drop-shadow(0 0 0px gold);
	}


	@media (max-width: 768px) {
		.banner__orbit,
		.banner__mage{
			display: none;
		}
		.banner__button {
			font-size: 16px;
			padding: 10px;
			width: 100%;
		}

		.banner__subtitle {
			text-align: center;
			font-size: 17px;
		}

		.banner__wrapper {
			padding: 10px;
		}
	}

</style>