<template>
	<div class="achieve">
		<div class="achieve__wrapper">
			<div class="achieve__content">
				<div class="achieve__title">Ваши задания</div>
				<div class="tasks__tabs">
					<div
						v-for="tab in tabs"
						:key="tab.value"
						class="tasks__tab"
						:class="{ 'tasks__tab--active': activeTab === tab.value }"
						@click="activeTab = tab.value"
					>
						{{ tab.label }}
					</div>
					<div class="tasks__toggle" :class="`tasks__toggle--${activeTab}`"></div>
				</div>
			</div>
			<div class="statistics__block">
				<component :is="currentComponent"/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed} from 'vue'
	import Daily from './daily.vue'
	import Weekly from './weekly.vue'
	import Special from './special.vue'

	const activeTab = ref('daily')
	const tabs = [
		{value: 'daily', label: 'Ежедневные', component: Daily},
		{value: 'weekly', label: 'Еженедельные', component: Weekly},
		{value: 'special', label: 'Особые', component: Special}
	]

	const currentComponent = computed(() => {
		const found = tabs.find(t => t.value === activeTab.value)
		return found ? found.component : 'Daily'
	})

</script>

<style scoped>
	.achieve__wrapper {
		width: 100%;
		padding: 20px;
	}

	.tasks__tabs {
		width: 100%;
		display: flex;
		background: #eaf0ff;
		border-radius: 16px;
		position: relative;
		margin-bottom: 14px;
		box-shadow: 0 2px 12px #4e6be655 inset, 0 1px 0 #fff7;
		overflow: hidden;
		max-width: 450px;
	}

	.achieve__title {
		color: #586cba;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 30px;
		font-style: italic;
		font-weight: bold;
		margin-bottom: 15px;
	}

	.tasks__tab {
		width: 33%;
		text-align: center;
		padding: 18px 10px 16px 10px;
		cursor: pointer;
		color: #586cba;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 700;
		font-style: italic;
		font-size: 16px;
		letter-spacing: 1px;
		position: relative;
		transition: color 0.23s;
		user-select: none;
		z-index: 1;
	}

	.tasks__tab--active {
		color: #fff;
		text-shadow: 0 2px 12px #4957c6cc, 0 1px 2px #fff, 0 1px 0 #fff6;
	}

	.tasks__toggle {
		position: absolute;
		top: 0;
		left: 0;
		width: 33.33%;
		height: 100%;
		background: linear-gradient(90deg, #7da0ff 70%, #859bff 100%);
		border-radius: 16px;
		transition: transform 0.4s cubic-bezier(.38, 1.32, .39, 1);
		z-index: 0;
		box-shadow: 0 0 22px #7fa7ff4d;
		border: none;
	}

	.tasks__toggle--daily {
		transform: translateX(0%);
	}

	.tasks__toggle--weekly {
		transform: translateX(100%);
	}

	.tasks__toggle--special {
		transform: translateX(200%);
	}

</style>
