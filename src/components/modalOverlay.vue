<template>
	<div class="modal-backdrop">
		<div class="modal-container">
			<div class="modal-inner-content">
				<button @click="closeModal" class="modal-close-btn">
					<img :src="props.icon" alt="Закрыть">
				</button>
				<p class="modal-text"> {{ props.text }}</p>
				<button @click="handleAction" class="modal-action-button"> {{ props.overlayBtn }}</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {defineProps, defineEmits} from 'vue'
	import {useRouter} from 'vue-router'

	const router = useRouter()
	const emit = defineEmits(['close'])

	const props = defineProps({
		icon: {
			type: String,
			required: true
		},
		text: {
			type: String,

		},
		overlayBtn: {
			type: String,
		}
	})

	const closeModal = () => {
		emit('close', false)
	}

	const handleAction = () => {
		router.push('/guess')
		closeModal()
	}
</script>

<style scoped>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		max-width: 90%;
		max-height: 90%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-inner-content {
		background-color: #ffffff;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
		width: 100%;
		max-width: 450px;
		text-align: center;
		position: relative;
		transform: translateY(-20px) scale(0.95);
		animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-50px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-close-btn {
		position: absolute;
		top: -11px;
		right: -11px;
		background: #dde7dd;
		border: none;
		border-radius: 50%;
		width: 35px;
		height: 35px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease-in-out;
		z-index: 10;
	}

	.modal-close-btn img {
		width: 18px;
		height: 18px;
		display: block;
	}

	.modal-text {
		font-size: 18px;
		font-weight: 600;
		color: #555;
		line-height: 1.6;
		margin-bottom: 0;
		text-align: center;
	}

	.modal-action-button {
		padding: 14px 30px;
		background-color: #4CAF50;
		color: #fff;
		border: none;
		border-radius: 25px;
		font-size: 1.1em;
		cursor: pointer;
		transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
		font-weight: 600;
		letter-spacing: 0.5px;
		box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
		display: block;
		margin-top: 10px;
	}

	.modal-action-button:hover {
		background-color: #45a049;
		transform: translateY(-1px);
		box-shadow: 0 7px 20px rgba(76, 175, 80, 0.4);
	}

	.modal-action-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
	}
</style>