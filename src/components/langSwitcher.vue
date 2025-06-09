<script setup>
	import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
	const { t, locales, locale, setLocale } = useI18n()

	const dropdownOpen = ref(false)
	const dropDownRef = ref(null)
	const localeValue = computed(() => locale.value)

	const currentLang = computed(() => {
		return (locales.value || []).find(l => l.code === locale.value)
	})

	const toggleDropdown = () => {
		dropdownOpen.value = !dropdownOpen.value
	}

	const selectLanguage = async (code) => {
		await setLocale(code)
		dropdownOpen.value = false
	}

	const clickOutside = (event) => {
		if (
			dropdownOpen.value &&
			dropDownRef.value &&
			!dropDownRef.value.contains(event.target)
		) {
			dropdownOpen.value = false
		}
	}

	onMounted(() => {
		document.addEventListener('mousedown', clickOutside)
	})
	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', clickOutside)
	})
</script>


<template>
	<div ref="dropDownRef" class="language-selector">
		<button class="language__button" @click="toggleDropdown">
      <span class="language__name">
        {{ currentLang?.name || currentLang?.code || '' }}
      </span>
			<img src="../../assets/images/arrowNav.svg" alt="" class="arrow" :class="{ open: dropdownOpen }"/>
		</button>
		<div v-if="dropdownOpen" class="dropdown">
			<div
				v-for="loc in locales"
				:key="loc.code"
				class="dropdown__item"
				:class="{ active: loc.code === localeValue }"
				@click="selectLanguage(loc.code)">
				{{ loc.name }}
			</div>
		</div>
	</div>
</template>

<style scoped>

	.language-selector {
		position: relative;
	}

	.language__button {
		display: flex;
		align-items: center;
		/*background: #b2b2b2;*/
		border: none;
		border-radius: 8px;
		color: #fff;
		font-weight: bold;
		font-size: 16px;
		padding: 8px 16px;
		cursor: pointer;
	}

	.language__name {
		margin-right: 8px;
	}

	.arrow {
		width: 25px;
		font-size: 16px;
		transition: transform .5s;
	}

	.arrow.open {
		transform: scale(-1);
	}

	.dropdown {
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: 110%;
		left: 0;
		background: #7f75d1;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		z-index: 10;
		min-width: 140px;
	}

	.dropdown__item {
		padding: 8px 16px;
		cursor: pointer;
		color: #fff;
		transition: background 0.2s;
	}

	.dropdown__item.active {
		background: #5f82f5;
	}

	.language-selector {
		position: relative;
	}

	.language__button {
		display: flex;
		align-items: center;
		/*background: #b2b2b2;*/
		border: none;
		min-width: 140px;
		border-radius: 8px;
		color: black;
		font-weight: bold;
		font-size: 16px;
		padding: 8px 16px;
		cursor: pointer;
	}

	.language__name {
		margin-right: 8px;
	}

	.arrow {
		width: 25px;
		font-size: 16px;
		transition: transform .5s;
	}

	.arrow.open {
		transform: scale(-1);
	}

	.dropdown {
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: 110%;
		left: 0;
		background: #b2b2b2;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		z-index: 10;
		min-width: 140px;
	}

	.dropdown__item {
		padding: 8px 16px;
		cursor: pointer;
		color: #fff;
		transition: background 0.2s;
	}

	.dropdown__item.active {
		background: #5f82f5;
	}

	.dropdown__item:hover {
		background: #edeef1;
		color: black;
	}
</style>