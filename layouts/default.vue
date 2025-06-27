<template>
	<div class="layout">
		<slot></slot>
		<vScroll/>
	</div>
</template>

<script setup>
	import vScroll from '../src/components/v-scroll.vue'
	import Coffe from '../src/components/forTea.vue'
</script>

<style scoped>

</style>