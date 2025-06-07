<template>
	<div>
		<Header></Header>
		<slot></slot>
		<Footer/>
	</div>
</template>

<script setup>
	import Header from '../src/components/header.vue'
	import Footer from '../src/components/footer.vue'

</script>

<style>

</style>