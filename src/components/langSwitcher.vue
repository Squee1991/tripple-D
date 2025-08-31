<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
const {locales, locale, setLocale} = useI18n()
const dropdownOpen = ref(false)
const dropDownRef = ref(null)
const openUpwards = ref(false)
const currentLang = computed(() => (locales.value || []).find(local => local.code === locale.value))
const localeCode = computed(() => locale.value)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
const selectLanguage = async (code) => {
  await setLocale(code)
  dropdownOpen.value = false
}
const clickOutside = (e) => {
  if (dropdownOpen.value && dropDownRef.value && !dropDownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', clickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', clickOutside))

</script>

<template>
  <div ref="dropDownRef" class="language-selector">
    <button class="language__button" @click="toggleDropdown">
      <span
          class="language__label"
          :data-code="currentLang?.code || ''"
      >
        {{ currentLang?.name || currentLang?.code || '' }}
      </span>
      <img src="../../assets/images/arrowDown.svg" alt="" class="arrow" :class="{ open: dropdownOpen }"/>
    </button>

    <div v-if="dropdownOpen"
         class="dropdown"
         :class="{ upwards: openUpwards }"
    >
      <div
          v-for="loc in locales"
          :key="loc.code"
          class="dropdown__item"
          :class="{ active: loc.code === localeCode }"
          :data-code="loc.code"
          @click="selectLanguage(loc.code)"
      >
        {{ loc.name }}
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
  position: relative;
  height: 45px;
  display: flex;
  align-items: center;
  gap: .5rem;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1e1e1e;
  transition: all .1s ease-in-out;
  white-space: nowrap;
  width: 147px;
}

.language__button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.arrow {
  width: 12px;
  transition: transform .3s ease;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.arrow.open {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown {
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: calc(100% + 10px);
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  z-index: 10;
  padding: .5rem;
}

.dropdown.upwards {
  bottom: calc(100% + 10px);
  top: auto;
}

.dropdown__item {
  display: block;
  padding: .8rem 1rem;
  cursor: pointer;
  color: #1e1e1e;
  transition: background .2s;
  border-radius: 12px;
  font-weight: 600;
  position: relative;
}

.dropdown__item:hover {
  background: #fef8e4;
}

.dropdown__item.active {
  background: #f1c40f;
  font-weight: 400;
}

.language__label {
  display: inline;
}

@media (max-width: 767px) {
  .language__button {
    height: 45px;
    box-shadow: 2px 2px 0 #1e1e1e;
    text-transform: uppercase;
    width: 80px;
    max-width: 80px;
    gap: 0;
    padding: 0 28px 0 8px;
  }

  .language__label {
    position: relative;
    font-size: 0;
  }

  .language__label::before {
    content: attr(data-code);
    font-size: 14px;
    line-height: 1;
    color: #1e1e1e;
  }

  .dropdown {
    box-shadow: 2px 2px 0 #1e1e1e;
    padding: 2px .5rem;
  }

  .dropdown__item {
    padding: 7px 5px;
    text-align: center;
    text-transform: uppercase;
    font-size: 0;
  }

  .dropdown__item::before {
    content: attr(data-code);
    display: block;
    font-size: 14px;
    line-height: 1.2;
    color: #1e1e1e;
  }
}
</style>
