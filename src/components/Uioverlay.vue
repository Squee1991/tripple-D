<template>
	<div v-if="visible" class="auth-overlay" @click.self="onClick">
		<slot></slot>
	</div>
</template>
<script setup>
	import { defineEmits , defineProps } from 'vue'

	const emit = defineEmits(['close']);

	const props = defineProps({
		visible: Boolean,
		closeOnClick:
			{
				type: Boolean,
				default: true
			}
	});

	function onClick() {
		if (props.closeOnClick) emit('close');
	}

</script>

<style scoped>
	.auth-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}
</style>
