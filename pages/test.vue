<template>
	<div class="page-wrapper">
		<label class="checkbox-container">
			<input type="checkbox" v-model="checked" />
			<span class="checkmark">
        <svg viewBox="0 0 24 24">
          <polyline points="3 12 10 20 21 4" />
        </svg>
      </span>
			<span class="label-text">Выбрать заклинание</span>
		</label>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	const checked = ref(false)
</script>

<style scoped>
	.page-wrapper {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #2d1b0f;
		font-family: 'Uncial Antiqua', cursive;
		color: #ffe8b0;
	}

	.checkbox-container {
		display: flex;
		align-items: center;
		gap: 14px;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-container input {
		display: none;
	}

	.checkmark {
		width: 32px;
		height: 32px;
		border: 3px solid #d9b56b;
		border-radius: 8px;
		background: #4b2f14;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 8px #a77b3a88;
		position: relative;
		overflow: visible; /* ✨ важно */
	}

	.checkmark svg {
		position: absolute;
		top: -14px;
		left: -4px;
		width: 40px;
		height: 40px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.checkmark polyline {
		stroke: #ffe08a;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
		stroke-dasharray: 28;
		stroke-dashoffset: 28;
		transition: stroke-dashoffset 0.4s ease;
	}

	input:checked + .checkmark polyline {
		stroke-dashoffset: 0;
	}
	input:checked + .checkmark svg {
		opacity: 1;
	}

	.label-text {
		font-size: 18px;
		text-shadow: 0 1px 3px #00000055;
	}
</style>
