<template>
	<div class="padeji-table">
		<div v-for="caseItem in cases" :key="caseItem.title" class="padeji-card">
			<h3 class="padeji-title">{{ caseItem.title }}</h3>
			<p class="padeji-desc">{{ caseItem.desc }}</p>
			<div class="padeji-forms">
				<div class="form-card" v-for="form in caseItem.forms" :key="form.label">
					<div class="form-value">{{ form.value }}</div>
					<div class="form-label">{{ form.label }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const cases = [
		{
			title: 'Именительный (Кто? Что?)',
			desc: 'Кто или что совершает действие.',
			forms: [
				{ label: 'Мужской', value: 'der' },
				{ label: 'Женский', value: 'die' },
				{ label: 'Средний', value: 'das' },
				{ label: 'Множественное', value: 'die' }
			]
		},
		{
			title: 'Винительный (Кого? Что?)',
			desc: 'Объект действия.',
			forms: [
				{ label: 'Мужской', value: 'den' },
				{ label: 'Женский', value: 'die' },
				{ label: 'Средний', value: 'das' },
				{ label: 'Множественное', value: 'die' }
			]
		},
		{
			title: 'Дательный (Кому? Где?)',
			desc: 'Направление или местоположение.',
			forms: [
				{ label: 'Мужской', value: 'dem' },
				{ label: 'Женский', value: 'der' },
				{ label: 'Средний', value: 'dem' },
				{ label: 'Множественное', value: 'den' }
			]
		},
		{
			title: 'Родительный (Чей?)',
			desc: 'Принадлежность.',
			forms: [
				{ label: 'Мужской', value: 'des' },
				{ label: 'Женский', value: 'der' },
				{ label: 'Средний', value: 'des' },
				{ label: 'Множественное', value: 'der' }
			]
		}
	]
</script>

<style scoped>
	.padeji-table {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		margin: 40px auto;
		max-width: 900px;
	}

	.padeji-card {
		width: 100%;
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 4px 18px #15235e55, 0 1px 4px #fff8 inset;
		color: #fff;
		padding: 20px 30px;
		text-align: center;
	}

	.padeji-title {
		font-size: 26px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 4px #26358588;
		margin-bottom: 12px;
	}

	.padeji-desc {
		font-size: 18px;
		color: #f3f0ed;
		margin-bottom: 18px;
	}

	.padeji-forms {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	.form-card {
		width: 140px;
		height: 140px;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 4px #fff8 inset;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 12px;
		cursor: default;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.form-card:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3), 0 1px 4px #fff8 inset;
	}

	.form-value {
		font-size: 36px;
		font-weight: 900;
		color: #fff3ec;
		margin-bottom: 8px;
		text-shadow: 0 1px 6px #263585aa;
	}

	.form-label {
		font-size: 18px;
		font-weight: 600;
		color: #f3f0ed;
		text-shadow: 0 1px 4px #26358588;
	}
</style>
