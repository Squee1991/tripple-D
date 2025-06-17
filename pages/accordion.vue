<template>
	<div class="accordion-wrapper">
		<div
			v-for="(item, index) in items"
			:key="index"
			:class="{ box: item.open }"
			class="accordion-box"
		>
			<div :class="{ toggle: item.open }" class="icon-wrapper">
				<div class="background"></div>
				<img :class="{ filter: item.open }" src="../assets/images/Limon.svg" class="icon" />
			</div>

			<div class="text-content">
				<div :class="{ hidetitle: item.open }" class="accordion-title">{{ item.title }}</div>
				<div class="accordion-text">{{ item.text }}</div>
			</div>

			<div class="arrow"@click="toggle(index)">
			<span>
				<img
					class="arrow-item"
					:class="{ rotated: isOpen[index] }"
					src="../assets/images/arrowNav.svg"
					alt=""
				/>
			</span>
			</div>
		</div>
	</div>
</template>

<script setup="">
import {ref} from "vue";

const items = ref([
	{
		open: false,
		title: 'Учи в игровом режиме',
		text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit'
	},
	{
		open: false,
		title: 'Зарабатывай артиклюсы',
		text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit '
	},
	{
		open: false,
		title: 'Угадывай слова',
		text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit consectetur adipisicing elit'
	}
])

const isOpen = ref(false)

const toggle = (index) => {
	items.value[index].open = !items.value[index].open
}
</script>

<style scoped>
	.accordion-wrapper {
		padding: 100px;

	}

	.icon-wrapper {
		position: absolute;
		top: -17px;
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
		top: -18px;
		left: 50%;
		transform: translateX(-50%);
		transition: .3s;
		filter: grayscale(40%);
	}

	.accordion-box {
		position: relative;
		background: #f8f4ff;;
		width: 400px;
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
		font-size: 18px;
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
</style>