<template>
	<div>
		<Header></Header>
		<slot></slot>
		<Footer/>
		<vScroll/>
	</div>
</template>

<script setup>
	import Header from '../src/components/header.vue'
	import Footer from '../src/components/footer.vue'
	import vScroll from '../src/components/v-scroll.vue'

</script>

<style>

</style>