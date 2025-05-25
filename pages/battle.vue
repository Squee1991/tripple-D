<template>
	<div>
		<h1>⚔️ Бой начался!</h1>
		<p>Session ID: {{ sessionId }}</p>

	</div>
</template>

<script setup>
	import { useRoute } from 'vue-router'
	const route = useRoute()
	const sessionId = route.query.id
</script>
