<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="cyber-panel settings-box">
      <div class="hud-corners">
        <span></span><span></span><span></span><span></span>
      </div>

      <div class="scan-line"></div>

      <h2 class="settings-title">SYSTEM_CALIBRATION</h2>

      <div class="settings-content">
        <div class="setting-item">
          <label><span class="tech-icon">📡</span> AUDIO_OUTPUT</label>
          <div class="range-container">
            <input type="range" v-model="settings.volume" min="0" max="100" class="cyber-slider"/>
            <div class="value-display">{{ settings.volume }}%</div>
          </div>
        </div>

        <div class="setting-item">
          <label><span class="tech-icon">⚠️</span> THREAT_LEVEL</label>
          <div class="difficulty-group">
            <button
                v-for="level in ['EASY', 'NORM', 'HARD']"
                :key="level"
                :class="['diff-btn', level.toLowerCase(), { active: settings.difficulty === level }]"
                @click="settings.difficulty = level"
            >
              <span v-if="level === 'EASY'">RECRUIT</span>
              <span v-if="level === 'NORM'">PILOT</span>
              <span v-if="level === 'HARD'">ACE</span>
            </button>
          </div>
        </div>
      </div>

      <button class="confirm-btn" @click="saveSettings">
        APPLY_CHANGES
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close'])

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
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 11, 20, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  backdrop-filter: blur(10px);
}


.cyber-panel {
  background: rgba(10, 25, 47, 0.95);
  border: 2px solid #00d2ff;
  padding: 40px;
  position: relative;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 0 30px rgba(0, 210, 255, 0.3), inset 0 0 15px rgba(0, 210, 255, 0.1);
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 2px;
  background: rgba(0, 210, 255, 0.5);
  box-shadow: 0 0 10px #00d2ff;
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.settings-title {
  color: #00d2ff;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00d2ff;
}

.setting-item { margin-bottom: 40px; }
.setting-item label {
  display: block;
  color: #00d2ff;
  font-size: 0.9rem;
  margin-bottom: 15px;
  letter-spacing: 2px;
  opacity: 0.8;
}

.tech-icon { margin-right: 8px; }

/* КАСТОМНЫЙ СЛАЙДЕР */
.range-container { display: flex; align-items: center; gap: 20px; }
.cyber-slider {
  -webkit-appearance: none;
  width: 100%; height: 6px;
  background: #0a192f;
  border: 1px solid #00d2ff;
  outline: none;
}
.cyber-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  background: #00d2ff;
  box-shadow: 0 0 10px #00d2ff;
  cursor: pointer;
  border-radius: 2px;
}

.value-display {
  color: #fff;
  font-weight: bold;
  min-width: 45px;
  text-shadow: 0 0 5px #00d2ff;
}

/* КНОПКИ СЛОЖНОСТИ */
.difficulty-group { display: flex; gap: 10px; }
.diff-btn {
  flex: 1; padding: 12px;
  border: 1px solid #00d2ff;
  background: transparent;
  color: #00d2ff;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.8rem;
}
.diff-btn:hover { background: rgba(0, 210, 255, 0.1); }
.diff-btn.active {
  background: #00d2ff;
  color: #000;
  box-shadow: 0 0 15px #00d2ff;
}

/* КНОПКА ГОТОВО */
.confirm-btn {
  width: 100%; padding: 18px;
  background: transparent;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 5px;
  transition: 0.3s;
}
.confirm-btn:hover {
  background: #00d2ff;
  color: #000;
  box-shadow: 0 0 20px #00d2ff;
}

/* УГЛОВЫЕ МАРКЕРЫ HUD */
.hud-corners span {
  position: absolute; width: 15px; height: 15px;
  border: 2px solid #00d2ff;
}
.hud-corners span:nth-child(1) { top: 10px; left: 10px; border-right: none; border-bottom: none; }
.hud-corners span:nth-child(2) { top: 10px; right: 10px; border-left: none; border-bottom: none; }
.hud-corners span:nth-child(3) { bottom: 10px; left: 10px; border-right: none; border-top: none; }
.hud-corners span:nth-child(4) { bottom: 10px; right: 10px; border-left: none; border-top: none; }
</style>