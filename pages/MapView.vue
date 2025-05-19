<template>
	<div class="map-view">
		<div
			v-for="(point, index) in points"
			:key="index"
			class="map-point"
			:class="{ active: index === currentLevel }"
			@click="handlePointClick(index)"
			:style="{ top: point.top, left: point.left }"
		>
			{{ index + 1 }}
		</div>
		<LevelModal
			:visible="showModal"
			:levelNumber="currentLevel + 1"
			:requiredCorrect="requiredCorrect"
			:totalQuestions="totalQuestions"
			:topicName="topicName"
			@start="handleStartBattle"
			@close="handleCloseModal"
		/>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import LevelModal from '../src/components/LevelModal.vue'
	import { useRouter } from 'vue-router'
	const currentLevel = ref(0)
	const showModal = ref(false)
	const requiredCorrect = ref(0)
	const totalQuestions = ref(0)
	const router = useRouter()
	const topicName = ref('')
	const levelData = [
		{ requiredCorrect: 8, totalQuestions: 10, topicName: 'Животные' },
		{ requiredCorrect: 9, totalQuestions: 12, topicName: 'Еда' },
		{ requiredCorrect: 7, totalQuestions: 9, topicName: 'Одежда' },
		{ requiredCorrect: 10, totalQuestions: 15, topicName: 'Транспорт' },
		{ requiredCorrect: 12, totalQuestions: 18, topicName: 'Дом' }
	]
	const handlePointClick = (index) => {
		if (index === currentLevel.value) {
			requiredCorrect.value = levelData[index].requiredCorrect
			totalQuestions.value = levelData[index].totalQuestions
			topicName.value = levelData[index].topicName
			showModal.value = true
		}
	}

	const points = [
		{ top: '10%', left: '20%' },
		{ top: '30%', left: '40%' },
		{ top: '50%', left: '60%' },
		{ top: '70%', left: '40%' },
		{ top: '90%', left: '20%' },
	]

	const handleStartBattle = () => {
		showModal.value = false
		router.push('/battlefield')
	}

	const handleCloseModal = () => {
		showModal.value = false
	}
</script>

<style scoped>
	.map-view {
		position: relative;
		width: 100%;
		height: 100vh;
		background: #d0eaff;
		overflow: hidden;
	}

	.map-point {
		position: absolute;
		width: 50px;
		height: 50px;
		background: gray;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: white;
		cursor: pointer;
		transition: transform 0.3s;
	}

	.map-point.active {
		background: green;
		transform: scale(1.2);
	}
</style>
