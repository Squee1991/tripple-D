

<script setup>
	import Arrow from '../../assets/images/arrowNav.svg'
	import { ref, onMounted, onUnmounted } from 'vue';
	const showScrollButton = ref(false);
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const handleScroll = () => {
		window.scrollY > 700 ? showScrollButton.value = true : showScrollButton.value = false;
	};

	onMounted(() => {
		window.addEventListener('scroll', handleScroll);
	});

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll);
	});

</script>

<template>
	<button class="scroll-to-top" @click="scrollToTop" v-if="showScrollButton">
		<img class="scroll__img" :src="Arrow" alt="">
	</button>
</template>

<style scoped>
	.scroll-to-top {
		width: 55px;
		height: 55px;
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: #3e65fa;
		color: white;
		border: none;
		border-radius: 50%;
		padding: 10px;
		cursor: pointer;
		transition: .4s ease-in-out;
	}

	.scroll-to-top:hover {
		background: #d9c5cb;
		transition: .4s ease-in-out;

	}

	.scroll__img {
		transition: 1s;
		transform: scale(-1);
	}

</style>
