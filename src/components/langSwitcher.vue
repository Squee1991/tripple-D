<template>
	<div ref="dropDownRef" class="language-selector">
		<button class="language__button" @click="toggleDropdown">
			<span class="language__name">{{ languages[selectedLanguage].label }}</span>
			<img class="arrow__lang"
			     :class="{'scale': dropdownOpen }"
			     src="../../assets/images/arrowNav.svg" alt="">
		</button>
		<div v-if="dropdownOpen" class="dropdown">
			<div
				v-for="(lang, code) in languages"
				:key="code"
				class="dropdown__item"
				:class="{ active: selectedLanguage === code }"
				@click="selectLanguage(code)">
				<span>{{ lang.label }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, onMounted, onBeforeUnmount} from 'vue'
	const dropDownRef = ref(null)
	const languages = {
		ru: {label: 'Русский'},
		en: {label: 'English'},
		uk: {label: 'Українська'}
	}

	const selectedLanguage = ref('ru')
	const dropdownOpen = ref(false)

	const toggleDropdown = () => {
		dropdownOpen.value = !dropdownOpen.value
	}


	const clickOutside = (event) => {
		if (dropdownOpen.value && dropDownRef.value && !dropDownRef.value.contains(event.target)) {
			dropdownOpen.value = false
		}
	}

	const selectLanguage = (code) => {
		selectedLanguage.value = code
		localStorage.setItem('language', code)
		dropdownOpen.value = false
	}

	onMounted(() => {
		document.addEventListener('mousedown', clickOutside)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', clickOutside)
	})

	onMounted(() => {
		const savedLanguage = localStorage.getItem('language')
		if (savedLanguage && languages[savedLanguage]) {
			selectedLanguage.value = savedLanguage
		} else {
			selectedLanguage.value = 'ru'
			localStorage.setItem('language', 'ru')
		}
	})
</script>


<style scoped>
	.language-selector {
		position: relative;
	}

	.language__name {
		padding: 6px 12px;
	}

	.arrow__lang {
		width: 23px;
		transition: .5s;
	}

	.scale {
		transform: scale(-1);
		transition: .5s;
	}

	.language__button {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: bold;
		font-size: 16px;
		color: #fbe7c6;
		text-shadow: 1px 1px 2px #000;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		background-color: #7f75d1;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
		margin-top: 6px;
		z-index: 1000;
		overflow: hidden;
	}

	.dropdown__item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 8px 12px;
		background: linear-gradient(to right, #5f82f5, #3b5cd1);
		border: none;
		cursor: pointer;
		font-weight: bold;
		color: white;
		text-shadow: 1px 1px 2px black;
		transition: background 0.2s;
	}

	.dropdown__item:hover {
		background: linear-gradient(to right, #6f92ff, #4b6cff);
	}

	.dropdown__item.active {
		background: linear-gradient(180deg, #82ff7a 10%, #27e500 100%);
	}
</style>
