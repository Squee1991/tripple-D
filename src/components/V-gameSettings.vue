<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="toon-panel settings-box">
      <div class="corner-dots">
        <span></span><span></span><span></span><span></span>
      </div>

      <h2 class="settings-title">НАСТРОЙКИ</h2>

      <div class="settings-content">
        <div class="setting-item">
          <label>ГРОМКОСТЬ</label>
          <div class="range-container">
            <input type="range" v-model="settings.volume" min="0" max="100" class="toon-slider"/>
            <div class="value-bubble">{{ settings.volume }}</div>
          </div>
        </div>

        <div class="setting-item">
          <label>СЛОЖНОСТЬ</label>
          <div class="difficulty-group">
            <button
                v-for="level in ['EASY', 'NORM', 'HARD']"
                :key="level"
                :class="['diff-btn', level.toLowerCase(), { active: settings.difficulty === level }]"
                @click="settings.difficulty = level"
            >
              {{ level }}
            </button>
          </div>
        </div>
      </div>

      <button class="confirm-btn" @click="saveSettings">
        ГОТОВО!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close'])

// Реактивный объект настроек
const settings = ref({
  volume: 70,
  difficulty: 'NORM'
})

// Загружаем настройки из памяти при открытии
onMounted(() => {
  const saved = localStorage.getItem('gameSettings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
})

// Сохраняем и закрываем
const saveSettings = () => {
  localStorage.setItem('gameSettings', JSON.stringify(settings.value))
  // Можно тут же добавить логику изменения громкости во всей игре
  emit('close')
}
</script>

<style scoped>
/* Твой стиль остается без изменений, он крутой */
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 62, 80, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.settings-box {
  background: #f1c40f;
  border: 8px solid #d35400;
  padding: 40px;
  border-radius: 30px;
  position: relative;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 0 #a04000, 0 30px 50px rgba(0, 0, 0, 0.4);
  transform: rotate(-1deg);
}

.settings-title {
  color: #ffffff;
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 30px;
  text-shadow: 4px 4px 0 #d35400;
  -webkit-text-stroke: 1px #d35400;
  text-align: center;
}

.setting-item { margin-bottom: 35px; }
.setting-item label {
  display: block;
  color: #e67e22;
  font-weight: 900;
  font-size: 1.2rem;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.range-container { display: flex; align-items: center; gap: 20px; }
.toon-slider {
  -webkit-appearance: none;
  width: 100%; height: 15px;
  background: #d35400;
  border-radius: 10px;
  outline: none;
  border: 3px solid #f39c12;
}
.toon-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 30px; height: 30px;
  background: #fff;
  border: 5px solid #2ecc71;
  border-radius: 50%;
  box-shadow: 0 4px 0 #27ae60;
  cursor: pointer;
}

.value-bubble {
  background: #fff;
  color: #d35400;
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: 900;
  border: 3px solid #d35400;
}

.difficulty-group { display: flex; gap: 10px; }
.diff-btn {
  flex: 1; padding: 12px;
  border: 4px solid #d35400;
  background: #fff;
  border-radius: 15px;
  font-weight: 900;
  color: #d35400;
  cursor: pointer;
  box-shadow: 0 5px 0 #d35400;
}
.diff-btn.active {
  background: #2ecc71;
  color: white;
  border-color: #27ae60;
  box-shadow: 0 5px 0 #1e8449;
  transform: translateY(2px);
}

.confirm-btn {
  width: 100%; padding: 15px;
  background: #2ecc71;
  border: 5px solid #27ae60;
  border-radius: 20px;
  color: white;
  font-size: 1.8rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 0 #1e8449;
}
.confirm-btn:active { transform: translateY(8px); box-shadow: 0 2px 0 #1e8449; }

.corner-dots span {
  position: absolute; width: 20px; height: 20px;
  background: #fff; border: 4px solid #d35400; border-radius: 50%;
}
.corner-dots span:nth-child(1) { top: 15px; left: 15px; }
.corner-dots span:nth-child(2) { top: 15px; right: 15px; }
.corner-dots span:nth-child(3) { bottom: 15px; left: 15px; }
.corner-dots span:nth-child(4) { bottom: 15px; right: 15px; }
</style>