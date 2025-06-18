<template>
	<div class="tasks__list">
		<div
			v-for="task in weeklyTasks"
			:key="task.id"
			class="task__item"
			:class="{ done: task.completed, rewarded: task.rewarded }"
		>
			<div class="task__icon">
				<img src="" alt="" />
			</div>
			<div class="task__info">
				<div class="task__title">{{ task.title }}</div>
				<div class="task__desc">{{ task.description }}</div>
				<div class="task__progress-row">
					<progress :value="task.progress" :max="task.max"></progress>
					<span>{{ task.progress }}/{{ task.max }}</span>
				</div>
			</div>
			<button
				v-if="task.completed && !task.rewarded"
				class="task__reward"
				@click="rewardTask(task.id)"
			>Забрать награду</button>
			<div v-if="task.rewarded" class="task__rewarded">✔ Получено!</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	// Массив еженедельных заданий (пример)
	const weeklyTasks = ref([
		{
			id: 101,

			title: 'Учись 5 дней подряд',
			description: 'Не пропускай занятия всю неделю',
			progress: 4,
			max: 5,
			completed: false,
			rewarded: false,
		},
		{
			id: 102,

			title: 'Выполни 15 заданий за неделю',
			description: 'Любые ежедневные задания',
			progress: 15,
			max: 15,
			completed: true,
			rewarded: false,
		},
		{
			id: 103,
			title: 'Открой 3 новых темы',
			description: 'На этой неделе',
			progress: 2,
			max: 3,
			completed: false,
			rewarded: false,
		},
	])

	function rewardTask(id) {
		const task = weeklyTasks.value.find(t => t.id === id)
		if (task && task.completed && !task.rewarded) {
			task.rewarded = true
			alert('Награда за задание недели получена!')
		}
	}
</script>

<style scoped>
	.tasks__list {

		max-width:450px;
		display: flex;
		flex-direction: column;
		gap: 19px;
	}
	.task__item {
		background: #f7faff;
		border-radius: 19px;
		box-shadow: 0 4px 20px #b8caff26;
		padding: 16px 20px;
		display: flex;
		align-items: center;
		position: relative;
		gap: 19px;
		border: 2px solid #e1e7ff;
		transition: box-shadow 0.16s, border-color 0.16s, opacity 0.16s;
		opacity: 1;
	}
	.task__item.done {
		border-color: #79d07d;
		box-shadow: 0 4px 20px #89eb9b44;
	}
	.task__item.rewarded {
		border-color: #d8b151;
		background: #fcf8e7;
		opacity: 0.8;
	}
	.task__icon img {
		width: 44px;
		height: 44px;
		filter: drop-shadow(0 1px 5px #a4bbff88);
	}
	.task__info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.task__title {
		font-size: 1.09em;
		font-weight: 700;
		color: #56609d;
		margin-bottom: 2px;
	}
	.task__desc {
		font-size: 0.98em;
		color: #999ac2;
		margin-bottom: 8px;
	}
	.task__progress-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 2px;
	}
	progress {
		width: 115px;
		height: 11px;
		accent-color: #94aaff;
		background: #e5ecff;
		border-radius: 8px;
	}
	.task__reward {
		margin-left: 18px;
		background: linear-gradient(90deg, #ffe187 60%, #ffd053 100%);
		color: #846f25;
		border: none;
		border-radius: 12px;
		font-weight: 600;
		font-size: 1em;
		padding: 7px 16px;
		cursor: pointer;
		box-shadow: 0 1px 6px #ffe3a366;
		transition: background 0.2s;
	}
	.task__reward:hover {
		background: linear-gradient(90deg, #ffeac1 60%, #ffe187 100%);
	}
	.task__rewarded {
		margin-left: 20px;
		color: #90ba6c;
		font-weight: 700;
		font-size: 1.04em;
	}
</style>
