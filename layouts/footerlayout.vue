<template>
	<div class="layout">
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
.layout {
  max-width: 1440px;
  margin: 0 auto;
}
</style>