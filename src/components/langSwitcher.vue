<template>
	<div ref="dropDownRef" class="language-selector">
		<button class="language-button" @click="toggleDropdown">
			<img :src="languages[selectedLanguage].flag" class="flag"/>
			<span class="language-name">{{ languages[selectedLanguage].label }}</span>
			<img class="arrow__lang"
			     :class="{'scale': dropdownOpen }"
			     src="../../assets/images/arrowNav.svg" alt="">
		</button>
		<div v-if="dropdownOpen" class="dropdown">
			<div
				v-for="(lang, code) in languages"
				:key="code"
				class="dropdown-item"
				:class="{ active: selectedLanguage === code }"
				@click="selectLanguage(code)">
				<img :src="lang.flag" class="flag"/>
				<span>{{ lang.label }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, onMounted, onBeforeUnmount} from 'vue'
	import RussianFlag from '../../assets/images/langIcons/russia.svg'
	import UkraineFlag from '../../assets/images/langIcons/ukraine.svg'
	import UsaFlag from '../../assets/images/langIcons/usa.svg'

	const dropDownRef = ref(null)
	const languages = {
		ru: {label: 'Русский', flag: RussianFlag},
		en: {label: 'English', flag: UsaFlag},
		uk: {label: 'Українська', flag: UkraineFlag}
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
		display: inline-block;
		width: 200px;
	}

	.arrow__lang {
		width: 23px;
		transition: .5s;
	}

	.scale {
		transform: scale(-1);
		transition: .5s;
	}

	.language-name {
		width: 90px;
	}

	.language-button {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: bold;
		font-size: 16px;
		color: #fbe7c6;
		text-shadow: 1px 1px 2px #000;
		gap: 8px;
		padding: 8px 12px;
		width: 200px;
	}

	.flag {
		width: 34px;
		height: 34px;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		background-color: #7f75d1;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
		margin-top: 6px;
		z-index: 1000;
		width: 200px;
		overflow: hidden;
	}

	.dropdown-item {
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
		gap: 8px;
		transition: background 0.2s;
	}

	.dropdown-item:hover {
		background: linear-gradient(to right, #6f92ff, #4b6cff);
	}

	.dropdown-item.active {
		background: linear-gradient(180deg, #82ff7a 10%, #27e500 100%);
	}
</style>
