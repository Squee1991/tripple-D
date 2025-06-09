<template>
	<section class="why">
		<div class="why__container">
			<div class="why__title-inner">
				<h1 class="why__title">{{ t(data.title)}}</h1>
				<img class="why__lazy-img" src="../assets/images/lazyLearn.svg" alt="">
			</div>
			<p class="why__lead">
				{{ t(data.lead)}}
			</p>
			<ul class="why__list" aria-label="Преимущества платформы">
				<li
					:class="{open: isViseble.includes(item.id)}"
					v-for="item in data.items"
					:key="item.id"
					class="why__item"
				>
					<div class="why__item__title">
						<div class="why__item-text">{{ t(item.valueKey) }}</div>
						<img @click="accrdion(item.id)" class="why__icon-arrow" :src="Arrow" alt="" />
					</div>
					<div>
						<div class="why__explanin"> {{ t(item.explainkey) }}</div>
					</div>
				</li>
			</ul>
			<div class="why__footer-text">
				<img class="why__happy-img" src="../assets/images/happystudent.svg" alt="">
				<p class="why__footer">
					{{ t(data.subtext)}}
				</p>
			</div>
		</div>
	</section>
	<FeedBack/>
</template>

<script setup>
	import FeedBack from '../src/components/feedBack.vue'
	import Arrow from '../assets/images/arrowNav.svg'
    const { t} = useI18n()
	const isViseble = ref([])

	const accrdion = (id) => {
		if (isViseble.value.includes(id)) {
			isViseble.value = isViseble.value.filter(openId => openId !== id)
		} else {
			isViseble.value.push(id)
		}
	}

	const data = {
		title: "about.title",
		lead: "about.lead",
		items: [
			{
				valueKey: "about.whyfirst",
				explainkey: "aboutList.one",
				id: 1
			},
			{
				valueKey: "about.whySecond",
				explainkey: "aboutList.two",
				id: 2
			},
			{
				valueKey: "about.whyThird",
				explainkey: "aboutList.three",
				id: 3
			},
			{
				valueKey: "about.whyfourth",
				explainkey: "aboutList.four",
				id: 4
			},
			{
				valueKey: "about.whyfifth",
				explainkey: "aboutList.five",
				id: 5
			},
			{
				valueKey: "about.whySixth",
				explainkey: "aboutList.six",
				id: 6
			},
			{
				valueKey: "about.whySeventh",
				explainkey: "aboutList.seven",
				id: 7
			},
			{
				valueKey: "about.whyEight",
				explainkey: "aboutList.eight",
				id: 8
			},
		],
		subtext: "about.whyfooter",
	}


	definePageMeta({
		layout: 'footerlayout'
	})

</script>

<style scoped>
	.why {
		background: #fdfaf3;
		padding: 60px 0;
	}

	.why__icon-arrow {
		width: 30px;
		cursor: pointer;
	}

	.why__footer-text {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.why__item-text {
		font-size: 20px;
		margin-left: 10px;
		font-weight: bold;
	}

	.why__lazy-img {
		width: 250px;
		padding-bottom: 30px;
		border-bottom: 2px solid #7c3aed;
	}

	.why__happy-img {
		width: 200px;
		margin-bottom: 20px;
	}

	.why__title-inner {
		flex-direction: column;
		display: flex;
		align-items: center;
	}

	.why__explanin {
		padding: 10px;
	}

	.why__item__title {
		display: flex;
		justify-content: space-between;
	}

	.why__container {
		max-width: 700px;
		margin: 0 auto;
		background: #fff;
		border-radius: 20px;
		box-shadow: 0 6px 28px #dab67c24;
		padding: 40px 26px;
		font-family: 'Kurale', serif;
	}

	.why__title {
		font-size: 32px;
		margin-bottom: 18px;
		color: #7c3aed;

		text-align: center;
		font-weight: 700;
	}

	.why__lead {
		font-size: 18px;
		color: #573a10;
		margin-bottom: 24px;
		text-align: center;
		padding: 30px;
		font-weight: 600;
	}

	.why__accent {
		color: #b9933a;
		font-weight: bold;
	}

	.why__list {
		margin-bottom: 30px;
	}

	.why__item {
		margin-bottom: 10px;
		font-size: 17px;
		color: #634c21;
		height: 50px;
		overflow: hidden;
		background: #f6f3f3;
		border-radius: 25px;
		padding: 10px;
		transition: .4s;
	}

	.open {
		height: 150px;
		transition: .4s;
	}

	.why__footer {
		font-size: 20px;
		color: #443202;
		font-style: italic;
		margin-bottom: 18px;
		text-align: center;
		font-weight: bold;
	}

</style>
