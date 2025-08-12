<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'

const {locales, locale, setLocale} = useI18n()

const dropdownOpen = ref(false)
const dropDownRef = ref(null)
const dropdownDirection = ref('down')
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const isMobile = computed(() => windowWidth.value < 768)
const localeValue = computed(() => locale.value)

const currentLang = computed(() => {
  return (locales.value || []).find(l => l.code === locale.value)
})

const updateDropdownDirection = () => {
  if (!dropDownRef.value) return
  const rect = dropDownRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  dropdownDirection.value = spaceBelow < 200 ? 'up' : 'down'
}

const toggleDropdown = () => {
  if (!dropdownOpen.value) updateDropdownDirection()
  dropdownOpen.value = !dropdownOpen.value
}

const selectLanguage = async (code) => {
  await setLocale(code)
  dropdownOpen.value = false
}

const clickOutside = (event) => {
  if (dropdownOpen.value && dropDownRef.value && !dropDownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  document.addEventListener('mousedown', clickOutside)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', clickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="dropDownRef" class="language-selector">
    <button class="language__button" @click="toggleDropdown">
      <span class="language__name">
        {{ isMobile ? (currentLang?.code || '') : (currentLang?.name || currentLang?.code || '') }}
      </span>
      <img src="../../assets/images/arrowDown.svg" alt="" class="arrow" :class="{ open: dropdownOpen }"/>
    </button>

    <div v-if="dropdownOpen" class="dropdown" :class="dropdownDirection">
      <div
          v-for="loc in locales"
          :key="loc.code"
          class="dropdown__item"
          :class="{ active: loc.code === localeValue }"
          @click="selectLanguage(loc.code)"
      >
        {{ isMobile ? loc.code : loc.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
  font-family: "Nunito", sans-serif;
}

.language__button {
  height: 53px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  color: #1e1e1e;
  font-weight: 400;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
  white-space: nowrap;
  min-width: 80px;
}

.language__button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.language__name {
  margin-right: 8px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}

.arrow {
  width: 12px;
  font-size: 16px;
  transition: transform .3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0px #1e1e1e;
  z-index: 10;
  padding: 0.5rem;
}

.dropdown.down {
  top: calc(100% + 10px);
}

.dropdown.up {
  bottom: calc(100% + 10px);
}

.dropdown__item {
  padding: 0.8rem 1rem;
  cursor: pointer;
  color: #1e1e1e;
  transition: all 0.2s;
  border-radius: 12px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.dropdown__item:hover {
  background: #fef8e4;
}

.dropdown__item.active {
  background: #f1c40f;
  font-weight: 400;
}

@media (max-width: 767px) {
  .language__button {
    height: 45px;
    box-shadow: 2px 2px 0 #1e1e1e;
    text-transform: uppercase;
  }
  .dropdown {
    box-shadow: 2px 2px 0 #1e1e1e;
    padding: 2px 0.5rem;
  }
  .dropdown__item {
    padding: 7px 5px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
  }

  .language__name {
    font-weight: 600;
  }

}
</style>
