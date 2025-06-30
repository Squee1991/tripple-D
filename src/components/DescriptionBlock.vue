<template>
	<section class="features">
		<div class="features__inner">
			<h2 class="features__title">{{t('features.title')}}</h2>
			<div class="features__grid">
				<div class="features__card" v-for="(item, index) in items" :key="index">
					<div class="features__card-bg"></div>
					<div class="features__card-content">
						<div class="features__icon-wrapper">
							<img :src="item.src" :alt="item.alt" class="features__icon"/>
						</div>
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
		background: #F7FAFC; /* Светлый фон */
		padding: 6rem 1.5rem;
		font-family: 'Nunito', sans-serif;
	}

	.features__inner {
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
	}

	.features__title {
		text-align: center;
		margin-bottom: 3.5rem;
		font-size: 2.5rem;
		font-weight: 800;
		color: #2D3748;
	}

	.features__grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 2.5rem;
	}

	.features__card {
		width: 280px; /* Немного увеличил для баланса */
		height: 380px;
		perspective: 1400px; /* Сохраняем перспективу для 3D */
		position: relative;
		cursor: pointer;
	}

	.features__card-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #FFFFFF; /* Чистый белый фон */
		border-radius: 16px;
		border: 1px solid #E2E8F0; /* Легкая рамка */
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05); /* Мягкая тень */
		z-index: 0;
		/* Анимация осталась прежней */
		transition: transform 0.4s ease, box-shadow 0.4s ease;
	}

	.features__card:hover .features__card-bg {
		transform: perspective(900px) translateY(-5%) rotateX(15deg) scale(1.05);
		box-shadow: 0 20px 30px -5px rgba(0,0,0,0.15);
	}

	.features__card-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: transform 0.5s cubic-bezier(.23,1,.32,1);
	}

	/* Анимация осталась прежней */
	.features__card:hover .features__card-content {
		transform: translate3d(0, -3rem, 100px);
	}

	.features__icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: #EBF4FF; /* Светло-голубой фон */
		margin-bottom: 1.5rem;
		transition: all 0.4s cubic-bezier(.23,1,.32,1);
	}

	.features__icon {
		width: 48px;
		height: 48px;
		transition: all 0.4s cubic-bezier(.23,1,.32,1);
	}


	.features__card-title {
		font-family: 'Nunito', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: #2D3748;
		margin-bottom: 0.75rem;
	}

	.features__card-desc {
		font-family: 'Nunito', sans-serif;
		font-size: 1rem;
		color: #718096;
		line-height: 1.6;
	}

	@media (max-width: 1050px) {
		.features__card {
			width: 260px;
		}
	}

	@media (max-width: 768px) {
		.features {
			padding: 4rem 1rem;
		}
		.features__title {
			font-size: 2rem;
			margin-bottom: 2.5rem;
		}
		.features__grid {
			flex-direction: column;
			align-items: center;
			gap: 1.5rem;
		}
		.features__card {
			width: 100%;
			max-width: 350px;
		}
	}
</style>