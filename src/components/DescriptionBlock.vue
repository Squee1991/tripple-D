<template>
	<section class="features">
		<div class="features__inner">
			<h2 :class="{'s-title': bp.lg}" class="features__title">{{t('features.title')}}</h2>
			<div class="features__grid">
				<div class="features__card" v-for="(item, index) in items" :key="index">
					<div class="features__card-bg"></div>
					<div class="features__card-content">
						<img :src="item.src" :alt="item.alt" class="features__icon"/>
						<h3 class="features__card-title">{{ t(item.title) }}</h3>
						<p class="features__card-desc">{{ t(item.description) }}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import MagikBook from '../../assets/images/magicBook.svg'
	import Brain from '../../assets/images/brain.svg'
	import Controller from '../../assets/images/controller.svg'
	import Cup from '../../assets/images/cubok.svg'
	import {useBreakPointsStore} from '../../store/breakPointsStore.js'
	const { t } = useI18n()
	const bp = useBreakPointsStore()
	const items = [
		{
			src: MagikBook,
			alt: 'Book',
			title: 'cardWords.title',
			description: 'cardWords.sub',
		},
		{
			src: Brain,
			alt: 'Brain',
			title: 'cardMethod.title',
			description: 'cardMethod.sub',
		},
		{
			src: Controller,
			alt: 'Controller',
			title: 'gameCard.title',
			description: 'gameCard.sub',
		},
		{
			src: Cup,
			alt: 'Cup',
			title: 'achievCard.title',
			description: 'achievCard.sub',
		},

	]
</script>


<style scoped>

	.features {
		background: #fdfaf3;
		padding: 80px 20px;
		display: flex;
		justify-content: center;
	}

	.features__inner {
		width: 100%;
		max-width: 1320px;
		margin: 0 auto;
	}

	.features__title {
		text-align: center;
		margin-bottom: 55px;
		font-size: 42px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: bold;
		color: #5a5340;
		letter-spacing: 0.03em;

	}

	.s-title {
		font-size: 20px;
	}

	.features__grid {
		padding: 40px 10px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 45px;
	}

	.features__card {
		width: 260px;
		height: 380px;
		perspective: 1400px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: filter 0.18s;
	}

	.features__card-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #fffef9; /* простой светлый фон карточки */
		border-radius: 16px; /* можно 16-20-24px, как хочешь */ /* светлая рамка, в твоём стиле */
		box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* простая тень */
		z-index: 0;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.features__card:hover .features__card-bg {
		transform: perspective(900px) translateY(-6%) rotateX(19deg) scale(1.04);
		box-shadow: 0 8px 18px rgba(0,0,0,0.15);
	}

	.features__card-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: 28px 16px 20px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		transition: transform 0.55s cubic-bezier(.35, 1.7, .44, .96),
		filter 0.4s cubic-bezier(.44, 1.7, .44, .96);
	}

	.features__card:hover .features__card-content {
		transform: translate3d(0, -44px, 110px) scale(1.08);
		filter: brightness(1.1) drop-shadow(0 6px 22px #c0a5ff60);
	}

	.features__icon {
		width: 86px;
		height: 86px;
		margin-bottom: 14px;
		filter: drop-shadow(0 0 10px #deceffad) drop-shadow(0 0 22px #fffde6bb);
		transition: transform 0.5s, filter 0.5s;
	}

	.features__card:hover .features__icon {
		transform: scale(1.09) rotate(-6deg);
		filter: drop-shadow(0 0 18px #d6b7ffbb) drop-shadow(0 0 40px #fff9c766);
	}

	.features__card-title {
		font-family: "Cinzel", serif;
		font-size: 21px;
		font-weight: 700;
		height: 57px;
		color: #7c3aed;
		margin-bottom: 8px;
		text-shadow: 0 2px 8px #dfcaff40,
		0 1px 0 #fff8;
		min-height: 24px;
		letter-spacing: 0.02em;
	}

	.features__card-desc {
		font-family: 'Kurale', serif;
		font-size: 16px;
		color: #715921;
		border-radius: 12px;
		/*box-shadow: 0 2px 18px #fff5 inset;*/
		line-height: 1.6;
		min-height: 150px;
		padding: 14px 10px 8px 10px;
		text-shadow: 0 1px 0 #fff9;
		margin-bottom: 0;
	}

	@media (max-width: 1050px) {
		.features__grid {
			gap: 28px;
		}

		.features__card {
			width: 210px;
			height: 320px;
		}

		.features__card-title {
			font-size: 17px;
		}

		.features__card-desc {
			font-size: 13px;
			min-height: 68px;
		}

		.features__icon {
			width: 62px;
			height: 62px;
		}
	}

	@media (max-width: 700px) {

		.features__grid {
			flex-direction: column;
			gap: 18px;
		}

		.features__card {
			width: 100%;
			min-width: 0;
			margin: 0 auto;
		}

		.features__title {
			font-size: 22px;
			margin-bottom: 20px;
		}

	}

</style>
