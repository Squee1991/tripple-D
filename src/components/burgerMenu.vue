<template>
	<div class="menu-btn-container">
		<div class="menu-btn">
			<input
				type="checkbox"
				id="menuBurger"
				class="menu-checkbox"
				:checked="props.modelValue"
				@change="onChange"
			/>
			<label for="menuBurger" class="menu-label">
				<div class="menu-bar"></div>
			</label>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		modelValue: Boolean
	})
	const emit = defineEmits(['update:modelValue'])
	const onChange = (event) => {
		emit('update:modelValue', event.target.checked)
	}
</script>

<style scoped>
	.menu-btn-container {
		position: absolute;
		top: 50%;
		left: 10px;
		width: 39px;
		transform: translateY(-50%);
	}

	.menu-btn {
		width: 39px;
		overflow: hidden;
	}

	.menu-checkbox {
		display: none;
	}

	.menu-label {
		position: relative;
		display: block;
		height: 29px;
		cursor: pointer;
	}

	.menu-label:before,
	.menu-label:after,
	.menu-bar {
		position: absolute;
		left: 0;
		width: 100%;
		height: 5px;
		background-color: black;
	}

	.menu-label:before,
	.menu-label:after {
		content: "";
		transition: 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) left;
	}

	.menu-label:before {
		top: 0;
	}

	.menu-label:after {
		top: 12px;
	}

	.menu-bar {
		top: 24px;
	}

	.menu-bar:before {
		content: "MENU";
		position: absolute;
		top: 5px;
		right: 0;
		left: 0;
		color: black;
		font-size: 10px;
		font-weight: bold;
		font-family: "Montserrat", Arial, Helvetica, sans-serif;
		text-align: center;
	}

	.menu-checkbox:checked + .menu-label:before {
		left: -39px;
	}

	.menu-checkbox:checked + .menu-label:after {
		left: 39px;
	}

	.menu-checkbox:checked + .menu-label .menu-bar:before {
		animation: moveUpThenDown 0.8s ease 0.2s forwards,
		shakeWhileMovingUp 0.8s ease 0.2s forwards,
		shakeWhileMovingDown 0.2s ease 0.8s forwards;
	}

	@keyframes moveUpThenDown {
		0% {
			top: 0;
		}
		50% {
			top: -27px;
		}
		100% {
			top: -14px;
		}
	}

	@keyframes shakeWhileMovingUp {
		0% {
			transform: rotateZ(0);
		}
		25% {
			transform: rotateZ(-10deg);
		}
		50% {
			transform: rotateZ(0deg);
		}
		75% {
			transform: rotateZ(10deg);
		}
		100% {
			transform: rotateZ(0);
		}
	}

	@keyframes shakeWhileMovingDown {
		0% {
			transform: rotateZ(0);
		}
		80% {
			transform: rotateZ(3deg);
		}
		90% {
			transform: rotateZ(-3deg);
		}
		100% {
			transform: rotateZ(0);
		}
	}
</style>
