<template>
	<div class="layout">
		<slot></slot>
		<vScroll/>
		<VSideBar/>
	</div>
</template>

<script setup>
	import vScroll from '../src/components/v-scroll.vue'
	import VSideBar from '../src/components/VToolsSideBar.vue'
	import Coffe from '../src/components/forTea.vue'
</script>

<style scoped>

</style>