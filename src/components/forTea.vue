<template>
	<div class="coffee-container">
		<img class="coffee" @click="openDonationLink" src="../../assets/images/cupheart.svg" alt="">
	</div>
</template>

<script setup>
	const openDonationLink = () => {
		window.open('https://buymeacoffee.com/skillupgerman', '_blank')
	}
</script>

<style scoped>

	.coffee {
		width: 55px;
		cursor: pointer;
	}

	.coffee-container {
		flex-direction: column;
		bottom: 10px;
		right: 5px;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
	}

</style>
