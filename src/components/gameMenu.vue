<template>
	<div class="menu">
		<div
			v-for="item in items"
			:key="item.label"
			class="menu-item"
		>
			<div class="icon">
				{{ item.icon }}
			</div>
			<div class="cost">
				<div class="cost__item">
					{{ item.cost }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const items = [
		{label: 'level', icon: "1", cost: 10},
		{label: 'shield', icon: '🛡️', cost: 15},
		{label: 'idea', icon: '💡', cost: 8},
		{label: 'heal', icon: "hp", cost: 10}
	]
</script>

<style scoped>
	.menu {
		display: flex;
		justify-content: center;
		gap: 14px;
		border-radius: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.icon {
		width: 40px;
		height: 40px;
		font-size: 26px;
		color: #facc15;
		background: linear-gradient(to bottom, #334155, #1e293b);
		border: 2px solid #facc15;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.1);

	}

	.cost__item {
		transform: rotate(-45deg);
	}

	.cost {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
		width: 25px;
		border-radius: 10px;
		height: 25px;
		transform: rotate(45deg);
		background: #6d28d9;
		border: 2px solid #a78bfa;
		color: #fef9c3;
		font-weight: bold;
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2);
	}
</style>
