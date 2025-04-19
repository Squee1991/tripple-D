<template>
	<table>
		<thead>
		<tr>
			<th v-for="col in columns" :key="col">{{ headers[col] }}</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="(item, idx) in items" :key="idx">
			<td v-for="col in columns" :key="col">{{ item[col] }}</td>
		</tr>
		</tbody>
	</table>
</template>
<script setup>
	defineProps({
		items: Array,
		columns: Array
	})

	const headers = {
		person: 'Лицо',
		de: 'Deutsch',
		ru: 'Русский'
	}
</script>

<style scoped>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;
	}

	th, td {
		border: 1px solid #ccc;
		padding: 8px 12px;
		text-align: left;
		color: white;
	}

	th {
		background-color: #525858;
		font-weight: bold;
	}

</style>
