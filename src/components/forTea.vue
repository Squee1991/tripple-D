<template>
	<div class="donate-container">
		<button class="donate-button" @click="openDonationLink">
			Оставить магическую монету
		</button>
	</div>
</template>

<script setup>
	const openDonationLink = () => {
		window.open('https://www.buymeacoffee.com/igor', '_blank')
	}
</script>

<style scoped>
	.donate-container {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	.donate-button {
		padding: 12px 20px;
		font-size: 18px;
		background-color: #ffdd57;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	.donate-button:hover {
		background-color: #ffc107;
	}
</style>
