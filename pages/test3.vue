<template>
    <div v-if="!isThemeSelected" class="card__wrapper">
        <div @click="selectTheme(item)" class="card" v-for="(item, key) in themeStore.themes" :key="key">
            <div>{{ item.name }}</div>
        </div>
    </div>

    <Deck v-else />
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useThemeCardStore } from '../store/themeStore.js'
    import { userBattleStore } from '../store/BattleStore.js' // 1. Импортируем стор для битвы
    import Deck from '../src/components/deck.vue'

    const themeStore = useThemeCardStore()
    const userBattle = userBattleStore() // 2. Создаем экземпляр стора

    const isThemeSelected = ref(false)

    // 3. Функция теперь принимает объект темы
    const selectTheme = async (theme) => {
        // 4. Сохраняем выбранную тему и генерируем колоду в сторе
        // Мы предполагаем, что у вас есть `selectedTheme` и `generateuserDeck` в BattleStore
        userBattle.selectedTheme = theme.name // или другой идентификатор, например `key`
        await userBattle.generateuserDeck()

        // 5. Показываем компонент Deck
        isThemeSelected.value = true
    }

    onMounted(() => {
        themeStore.loadthemes()
    })
</script>

<style scoped>
      .card__wrapper {
          display: flex;
          flex-wrap: wrap;
      }

      .card {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 120px;
          margin: 10px;
          height:220px;
          background: #e9e0e0;
          border-radius: 10px;
      }
</style>
