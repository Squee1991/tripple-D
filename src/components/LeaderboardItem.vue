<script setup>
	import { computed , defineProps } from 'vue';
	import { userAuthStore } from '../../store/authStore.js';

	const props = defineProps({
		player: {
			type: Object,
			required: true,
		},
		rank: {
			type: Number,
			required: true,
		},
		isCurrentUser: {
			type: Boolean,
			required: true,
		},
		scoreField: {
			type: String,
			default: 'guessed',
		},
		scoreUnit: {
			type: String,
		},
	});

	const authStore = userAuthStore();
	const playerScore = computed(() => {
		return props.player[props.scoreField] || 0;
	});

</script>

<template>
	<li class="leaderboard-item" :class="{ 'leaderboard-item--current': isCurrentUser }">
		<div class="leaderboard-player-info">
			<span class="leaderboard-player-rank">#{{ rank }}</span>
			<img
				class="leaderboard-player-avatar"
				:src="isCurrentUser ? authStore.avatarUrl : authStore.getAvatarUrl(player.avatar)"
				alt="avatar"
			/>
			<span class="leaderboard-player-name">{{ player.name }}</span>
		</div>
		<div class="leaderboard-score-wrapper">
      <span class="leaderboard-player-score">
        {{ playerScore }} {{ scoreUnit }}
      </span>
		</div>
	</li>
</template>

<style scoped>

	.leaderboard-item {
		font-family: "Nunito", sans-serif;
		border-bottom: 1px solid #3a3f5e;
		border-radius: 8px;
		padding: 10px 20px;
		transition: all 0.2s ease-in-out;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;

	}

	.leaderboard-item--current {
		border: 1px solid #a484ff;
		box-shadow: 0 0 10px rgba(164, 132, 255, 0.3);
	}

	.leaderboard-player-info {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.leaderboard-player-avatar {
		width: 65px;
		height: 65px;
		border-radius: 50%;
		border: 2px solid #4a4e8f;
		object-fit: cover;
	}

	.leaderboard-item--current .leaderboard-player-avatar {
		border-color: #a484ff;
	}

	.leaderboard-player-rank {
		font-weight: 700;
		color: black;
		font-size: 1.1em;
		min-width: 30px;
		text-align: center;
	}

	.leaderboard-player-name {
		color: black;
		font-size: 20px;
		font-weight: 600;
		font-family: 'Fredoka One', cursive;;
	}

	.leaderboard-score-wrapper {
		background: #fde68a;;
		padding: 5px 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30px;
		min-width: 80px;
		text-align: center;
	}

	.leaderboard-player-score {
		color: black;
		font-weight: 700;
		font-size: 1.2em;
	}
</style>