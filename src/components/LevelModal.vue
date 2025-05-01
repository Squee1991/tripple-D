<template>
	<div v-if="visible" class="modal-overlay">
		<div class="modal-content">
			<h2 class="modal-title">Уровень {{ levelNumber }}: Пещера Знаний</h2>
			<div class="modal-body">
				<div class="modal-text">
					<p>📜 <strong>Условие:</strong><br>Ответить правильно минимум на <span class="highlight">{{ requiredCorrect }}</span> из <span class="highlight">{{ totalQuestions }}</span> слов</p>
					<p>📘 <strong>Тема:</strong> <span class="highlight">{{ topicName }}</span></p>
					<p>😈 <strong>Противник:</strong> <span class="highlight">Лорд Артиклюс</span></p>
				</div>
				<div class="enemy-image">
					<img src="../../assets/images/bossApp.png" alt="Враг" />
				</div>
			</div>
			<div class="modal-actions">
				<button class="start-button" @click="$emit('start')">🔮 Начать Битву</button>
				<button class="back-button" @click="$emit('close')">↩️ Назад</button>
			</div>
		</div>
	</div>
</template>

<script setup>

	defineProps({
		visible: Boolean,
		levelNumber: Number,
		requiredCorrect: Number,
		totalQuestions: Number,
		topicName: String
	})

</script>

<style scoped>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
		backdrop-filter: blur(3px);
	}

	.modal-content {
		background: radial-gradient(ellipse at center, #202020 0%, #000000 100%);
		padding: 50px;
		border-radius: 28px;
		width: 90%;
		max-width: 750px;
		border: 2px solid #00ffffaa;
		box-shadow: 0 0 30px #00ffffaa;
		animation: appear 0.4s ease;
		color: #fff;
	}

	.modal-title {
		font-size: 32px;
		color: #00ffff;
		text-align: center;
		text-shadow: 0 0 12px #00ffff;
		margin-bottom: 30px;
		font-family: 'Cinzel', serif;
		letter-spacing: 1px;
	}

	.modal-body {
		display: flex;
		gap: 40px;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.modal-text {
		flex: 1;
		font-size: 18px;
		line-height: 1.8;
		color: #ffffffcc;
	}

	.modal-text p {
		margin-bottom: 16px;
	}

	.highlight {
		color: #00ffff;
		font-weight: bold;
		text-shadow: 0 0 4px #00ffff99;
	}

	.enemy-image {
		width: 180px;
		height: 240px;
		flex-shrink: 0;
		background: #111;
		border-radius: 18px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 15px #00ffff55;
		border: 1px solid #00ffff55;
	}

	.enemy-image img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	.modal-actions {
		margin-top: 40px;
		display: flex;
		justify-content: center;
		gap: 30px;
	}

	.start-button, .back-button {
		padding: 14px 34px;
		font-size: 20px;
		border-radius: 14px;
		border: none;
		cursor: pointer;
		font-weight: bold;
		transition: 0.3s;
		font-family: 'Trebuchet MS', sans-serif;
	}

	.start-button {
		background: linear-gradient(135deg, #00cccc, #009999);
		color: white;
		box-shadow: 0 0 16px #00ffff99;
	}

	.start-button:hover {
		background: linear-gradient(135deg, #00aaaa, #007777);
		box-shadow: 0 0 20px #00ffff;
	}

	.back-button {
		background: #333;
		color: #ccc;
		box-shadow: 0 0 10px #444;
	}

	.back-button:hover {
		background: #222;
		color: #eee;
	}

	@keyframes appear {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
</style>
