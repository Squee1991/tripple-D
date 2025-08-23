<template>
	<section class="why">
		<div class="why__container">
			<div class="why__title-inner">
				<h1 class="why__title">{{ t(data.title) }}</h1>
				<img class="why__lazy-img" src="../assets/images/lazyLearn.svg" alt="">
			</div>
			<p class="why__lead">
				{{ t(data.lead) }}
			</p>
			<div class="accordion-wrapper">
				<div
					v-for="(item, index) in data.items"
					:key="item.id"
					:class="{ box: isOpen.includes(index) }"
					class="accordion-box"
				>
					<div :class="{ toggle: isOpen.includes(index) }" class="icon-wrapper">
						<div class="background"></div>
						<img :class="{ filter: isOpen.includes(index) }" src="../assets/images/Limon.svg" class="icon" />
					</div>
					<div class="text-content">
						<div :class="{ hidetitle: isOpen.includes(index) }" class="accordion-title">{{ t(item.valueKey) }}</div>
						<div class="accordion-text">{{ t(item.explainkey) }}</div>
					</div>
					<div class="arrow" @click="toggle(index)">
            <span>
              <img
	              class="arrow-item"
	              :class="{ rotated: isOpen.includes(index) }"
	              src="../assets/images/arrowNav.svg"
	              alt=""
              />
            </span>
					</div>
				</div>
			</div>

			<div class="why__footer-text">
				<img class="why__happy-img" src="../assets/images/happystudent.svg" alt="">
				<p class="why__footer">
					{{ t(data.subtext) }}
				</p>
			</div>
		</div>
	</section>
	<FeedBack/>
</template>
<script setup>
	import FeedBack from '../src/components/feedBack.vue'
	const { t } = useI18n()
	const isOpen = ref([])

	function toggle(index) {
		if (isOpen.value.includes(index)) {
			isOpen.value = isOpen.value.filter(i => i !== index)
		} else {
			isOpen.value.push(index)
		}
	}

	const data = {
		title: "about.title",
		lead: "about.lead",
		items: [
			{ valueKey: "about.whyfirst", explainkey: "aboutList.one", id: 1 },
			{ valueKey: "about.whySecond", explainkey: "aboutList.two", id: 2 },
			{ valueKey: "about.whyThird", explainkey: "aboutList.three", id: 3 },
			{ valueKey: "about.whyfourth", explainkey: "aboutList.four", id: 4 },
			{ valueKey: "about.whyfifth", explainkey: "aboutList.five", id: 5 },
			{ valueKey: "about.whySixth", explainkey: "aboutList.six", id: 6 },
			{ valueKey: "about.whySeventh", explainkey: "aboutList.seven", id: 7 },
			{ valueKey: "about.whyEight", explainkey: "aboutList.eight", id: 8 },
		],
		subtext: "about.whyfooter",
	}

	definePageMeta({
		layout: 'footerlayout'
	})
</script>


<style scoped>

	.why {
		padding: 60px 0;
	}

	.why__icon-arrow {
		width: 15px;
		cursor: pointer;
		transition: .4s;
		transform: rotate(-90deg);
	}

	.why__icon-arrow--open {
		transform: rotate(0deg);
		transition: .4s;
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
		height: 160px;
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

	.accordion-wrapper {
		padding: 40px;

	}

	.icon-wrapper {
		position: absolute;
		top: -16px;
		left: -13px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #f8f4ff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		transition: .3s;
	}

	.icon {
		width: 35px;
		height: 35px;
		filter: grayscale(100%);
		z-index: 2;
	}

	.filter {
		filter: grayscale(0%);
		transition: .3s;
	}

	.toggle {
		top: -17px;
		left: 50%;
		transform: translateX(-50%);
		transition: .3s;
		filter: grayscale(40%);
	}

	.accordion-box {
		position: relative;
		background: #f8f4ff;;
		border-radius: 22px;
		padding: 10px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 45px;
		color: #333;
		transition: 0.3s;
		text-align: center;
		margin-bottom: 25px;
	}

	.box {
		height: 130px;
		transition: 0.3s;
	}

	.accordion-title {
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 600;
		font-size: 17px;
		font-style: italic;
		margin-bottom: 8px;
		transition: 0.2s;
		opacity: 1;
	}

	.hidetitle {
		opacity: 0;
	}

	.accordion-text {
		padding: 10px;
		font-size: 14px;
		color: #555;
		opacity: 0;
		max-height: 0;
		overflow: hidden;
		transition: opacity 0.3s, max-height 0.3s;
	}

	.box .accordion-text {
		opacity: 1;
		max-height: 200px;
	}

	.arrow {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #d9cde8;
		width: 22px;
		height: 22px;
		padding: 5px;
		border-radius: 50%;
	}

	.arrow-item {
		transform: scale(1);
		transition: .5s;
	}

	.rotated {
		transition: .5s;
		transform: scale(-1);
	}

  @media (max-width: 768px ) {
    .why__item-text {
      font-size: 15px;
    }
  }

  @media (max-width: 1023px) {
    .why {
      padding: 10px 0;
    }
  }

</style>
