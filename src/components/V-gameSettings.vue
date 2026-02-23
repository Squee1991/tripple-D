<template>
  <div class="settings-overlay-toon" @click.self="$emit('close')">
    <div class="toon-settings-card">
      <button class="close-toon-btn" @click="$emit('back')">✖</button>

      <h2 class="toon-settings-title">НАСТРОЙКИ</h2>

      <div class="settings-content">
        <div class="setting-item-toon">
          <label>ГРОМКОСТЬ</label>
          <div class="range-wrapper">
            <input
                type="range"
                v-model="settings.volume"
                min="0" max="100"
                class="toon-range"
            />
            <div class="range-val-bubble">{{ settings.volume }}</div>
          </div>
        </div>

        <div class="setting-item-toon">
          <label>УРОВЕНЬ УГРОЗЫ</label>
          <div class="diff-selector">
            <button
                v-for="level in ['EASY', 'NORM', 'HARD']"
                :key="level"
                :class="['toon-diff-btn', level.toLowerCase(), { active: settings.difficulty === level }]"
                @click="settings.difficulty = level"
            >
              <span v-if="level === 'EASY'">РЕКРУТ</span>
              <span v-if="level === 'NORM'">ПИЛОТ</span>
              <span v-if="level === 'HARD'">АС</span>
            </button>
          </div>
        </div>
      </div>

      <button class="toon-save-btn" @click="saveSettings">
        ГОТОВО!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close', 'back'])

const settings = ref({
  volume: 70,
  difficulty: 'NORM'
})

onMounted(() => {
  const saved = localStorage.getItem('gameSettings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
})

const saveSettings = () => {
  localStorage.setItem('gameSettings', JSON.stringify(settings.value))
  emit('close')
}
</script>

<style scoped>
.settings-overlay-toon {
  position: fixed;
  inset: 0;
  background: rgba(18, 18, 43, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6000;
  backdrop-filter: blur(8px);
  font-family: 'Arial Rounded MT Bold', 'Helvetica', sans-serif;
}

.toon-settings-card {
  background: #fff;
  border: 8px solid #000;
  border-radius: 40px;
  padding: 40px;
  position: relative;
  width: 90%;
  max-width: 420px;
  box-shadow: 15px 15px 0px #ffeb3b; /* Сочная желтая тень */
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  0% { transform: scale(0.5) rotate(5deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.close-toon-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 900;
  cursor: pointer;
  color: #000;
}

.toon-settings-title {
  color: #000;
  font-size: 2.2rem;
  margin-top: 0;
  margin-bottom: 30px;
  text-align: center;
  -webkit-text-stroke: 1px #000;
}

.setting-item-toon { margin-bottom: 35px; }
.setting-item-toon label {
  display: block;
  color: #000;
  font-weight: 900;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-transform: uppercase;
}

/* СЛАЙДЕР */
.range-wrapper { display: flex; align-items: center; gap: 15px; }
.toon-range {
  -webkit-appearance: none;
  width: 100%;
  height: 16px;
  background: #000;
  border-radius: 10px;
  outline: none;
}
.toon-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 32px;
  height: 32px;
  background: #ffeb3b;
  border: 4px solid #000;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 0 #000;
}

.range-val-bubble {
  background: #00d2ff;
  border: 3px solid #000;
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: 900;
  color: #000;
}

/* КНОПКИ СЛОЖНОСТИ */
.diff-selector { display: flex; gap: 10px; }
.toon-diff-btn {
  flex: 1;
  padding: 12px 5px;
  border: 4px solid #000;
  border-radius: 15px;
  background: #eee;
  color: #000;
  font-weight: 900;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 0 #000;
}

.toon-diff-btn.easy.active { background: #4caf50; color: #fff; }
.toon-diff-btn.norm.active { background: #ffeb3b; color: #000; }
.toon-diff-btn.hard.active { background: #ff5252; color: #fff; }

.toon-diff-btn.active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #000;
}

/* КНОПКА СОХРАНИТЬ */
.toon-save-btn {
  width: 100%;
  padding: 15px;
  background: #00ff9d;
  border: 4px solid #000;
  border-radius: 20px;
  color: #000;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 8px 0 #000;
  margin-top: 10px;
  transition: 0.1s;
}

.toon-save-btn:active {
  transform: translateY(6px);
  box-shadow: 0 2px 0 #000;
}
</style>