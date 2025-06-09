<template>
	<div class="coffe-container">
		<img class="coffe" @click="openDonationLink" src="../../assets/images/cupheart.svg" alt="">
	</div>
</template>

<script setup>
	const openDonationLink = () => {
		window.open('https://buymeacoffee.com/diederdas', '_blank')
	}
</script>

<style scoped>

	.coffe {
		width: 65px;
		cursor: pointer;
	}

	.coffe-container {
		bottom: 67px;
		right: 10px;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
	}

</style>
