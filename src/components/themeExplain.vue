<template>
	<div class="explanation-overlay" @click.self="emit('close')">
		<Transition name="bounce" appear>
			<div class="explanation-box">
				<div class="explanation-head-content">
					<div class="explanation__title">Что значат цветные кружки?</div>
					<img @click="emit('close')" class="close__icon" src="../../assets/images/close.svg" alt="">
				</div>
				<div class="explanation__explain">
					<div class="explain-row">
						<span class="circle der"></span>
						<span class="color der-color">красный</span>
						<span class="dash">—</span>
						<span class="article der-article"><code>der</code></span>
						<span class="desc der-desc">карты с атакой и уроном</span>
					</div>
					<div class="explain-row">
						<span class="circle die"></span>
						<span class="color die-color">зелёный</span>
						<span class="dash">—</span>
						<span class="article die-article"><code>die</code></span>
						<span class="desc die-desc">магия, контроль</span>
					</div>
					<div class="explain-row">
						<span class="circle das"></span>
						<span class="color das-color">синий</span>
						<span class="dash">—</span>
						<span class="article das-article">das</span>
						<span class="desc das-desc">защита , уменьшение урона </span>
					</div>
				</div>
				<p class="tip">Выбирая тему, обращайте внимание на соотношение артиклей — оно влияет на стиль игры вашей
					темы!</p>
				<button @click="emit('close')" class="close-btn">Понятно</button>
			</div>
		</Transition>
	</div>
</template>

<script setup>
	const emit = defineEmits(['close'])
</script>

<style scoped>
	.bounce-enter-active {
		animation: bounce-in 0.5s;
	}

	.bounce-leave-active {
		animation: bounce-in 0.5s reverse;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.20);
		}
		100% {
			transform: scale(1);
		}
	}

	.explanation-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.explanation-box {
		background: #fff8e0;
		border: 4px solid #b8914d;
		border-radius: 16px;
		padding: 10px 20px 24px 20px;
		max-width: 600px;
		box-shadow: 0 0 20px #00000099;
		font-family: Georgia, serif;
		color: #3a250e;
		margin: 20px;
	}

	.explanation__explain {
		padding: 40px 0 10px 0;
	}

	.explanation-head-content {
		display: flex;
		justify-content: space-between;
		align-content: center;
	}

	.explanation__title {
		display: flex;
		align-items: center;
		font-family: "Kurale", serif;
		font-weight: bold;
		font-size: 28px;
	}

	.close__icon {
		width: 40px;
		cursor: pointer;
		padding: 5px;
	}

	/* --- Строчка объяснения --- */
	.explain-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 16px;
		font-size: 17px;
	}

	.circle {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		display: inline-block;
		margin-right: 2px;
	}

	.der {
		background: #cc3a3a;
	}

	.die {
		background: #3b8d4e;
	}

	.das {
		background: #2a6dbf;
	}

	.color {
		font-weight: bold;
		font-size: 17px;
		width: 83px;
	}

	.der-color {
		color: #cc3a3a;
	}

	.die-color {
		color: #3b8d4e;
	}

	.das-color {
		color: #2a6dbf;
	}

	.dash {
		color: #b8914d;
		font-weight: bold;
		font-size: 17px;
	}

	.article {
		font-family: 'JetBrains Mono', monospace;
		padding: 2px 7px;
		border-radius: 6px;
		background: #f3e6bf;
		border: 1.5px solid #b8914d;
		font-weight: bold;
		font-size: 15px;
	}

	.der-article {
		color: #cc3a3a;
	}

	.die-article {
		color: #3b8d4e;
	}

	.das-article {
		color: #2a6dbf;
	}

	.desc {
		margin-left: 4px;
		opacity: 0.95;
		font-style: italic;
		font-size: 15px;
	}

	.der-desc {
		color: #cc3a3a;
	}

	.die-desc {
		color: #3b8d4e;
	}

	.das-desc {
		color: #2a6dbf;
	}

	.tip {
		margin-top: 14px;
		font-style: italic;
		font-size: 14px;
		color: #5a3f1f;
		max-width: 90%;
	}

	.close-btn {
		margin-top: 20px;
		padding: 8px 20px;
		border: 4px solid #b8914d;
		background: #e7c56a;
		border-radius: 10px;
		font-weight: bold;
		font-size: 15px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.close-btn:hover {
		background: #f7e193;
	}
</style>
