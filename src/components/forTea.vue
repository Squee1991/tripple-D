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
		width: 70px;
		cursor: pointer;
	}

	.coffe-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

</style>
