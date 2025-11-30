<script setup>
import {ref} from 'vue'
import { useAchievementStore } from '../../store/achievementStore.js'
const SECRET_CODE = '4815162342'
const achievementStore = useAchievementStore()
const quests = [
  {text: 'CHECK 1: DIE SUMME?', answer: '108'},
  {text: 'CHECK 2: FLUG NUMMER?', answer: '815'},
  {text: 'CHECK 3: JAHR?', answer: '2004'},
  {text: 'CHECK 4: STATION?', answer: '3'},
  {text: 'FINAL: LETZTE ZAHL?', answer: '42'}
]

const isVisible = ref(true)
const displayValue = ref('')
const message = ref('SYSTEM LOCKED')
const stage = ref('LOCKED')
const questIndex = ref(0)
const isError = ref(false)

const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK']

const open = () => {
  isVisible.value = true
  resetGame()
}

const close = () => {
  achievementStore.isVisible = false
}

const resetGame = () => {
  displayValue.value = ''
  stage.value = 'LOCKED'
  questIndex.value = 0
  message.value = 'SYSTEM LOCKED'
  isError.value = false
}

const handleInput = (btn) => {
  if (stage.value === 'WIN') return

  if (btn === 'C') {
    displayValue.value = ''
    return
  }

  if (btn === 'OK') {
    checkAnswer()
    return
  }

  if (displayValue.value.length < 12) {
    displayValue.value += btn
  }
}

const checkAnswer = () => {
  const val = displayValue.value

  if (stage.value === 'LOCKED') {
    if (val === SECRET_CODE) {
      stage.value = 'QUEST'
      questIndex.value = 0
      displayValue.value = ''
      message.value = quests[0].text
    } else {
      triggerError('INVALID CODE')
    }
    return
  }

  if (stage.value === 'QUEST') {
    const currentQ = quests[questIndex.value]

    if (val === currentQ.answer) {
      displayValue.value = ''
      questIndex.value++

      if (questIndex.value < quests.length) {
        message.value = quests[questIndex.value].text
      } else {
        gameWin()
      }
    } else {
      triggerError('ERROR')
    }
  }
}

const triggerError = (msg) => {
  const oldMsg = message.value
  message.value = msg
  displayValue.value = ''
  isError.value = true

  setTimeout(() => {
    isError.value = false
    message.value = oldMsg
  }, 600)
}

const gameWin = () => {
  stage.value = 'WIN'
  message.value = 'SYSTEM RESTORED'
  displayValue.value = 'NAMASTE'

  setTimeout(() => {
    close()
  }, 2500)
}

defineExpose({open})
</script>

<template>
  <div v-if="achievementStore.isVisible"  class="overlay" @click.self="close">
    <div class="toon-calculator">
      <div class="calc-top">
        <div class="lights">
          <span class="dot red" :class="{ active: stage === 'LOCKED' }"></span>
          <span class="dot yellow" :class="{ active: stage === 'QUEST' }"></span>
          <span class="dot green" :class="{ active: stage === 'WIN' }"></span>
        </div>
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="screen-container" :class="{ 'screen-error': isError }">
        <div class="mini-msg">{{ message }}</div>

        <div class="main-display">
          {{ displayValue || '...' }}
        </div>
      </div>
      <div class="keypad">
        <button
            v-for="btn in buttons"
            :key="btn"
            @click="handleInput(btn)"
            :class="['toon-btn', {
            'action-ok': btn === 'OK',
            'action-c': btn === 'C'
          }]"
        >
          {{ btn }}
        </button>
      </div>
      <div class="brand">THE ISLAND 4 8 15 16 23 42</div>
    </div>

  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toon-calculator {
  width: 280px;
  background: #f4e7d3;
  border: 4px solid #000;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 4px 4px 0px #000;
  position: relative;
  transform: rotate(-2deg);
  transition: transform 0.1s;
}

.calc-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.lights {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #000;
  opacity: 0.3;
  transition: 0.3s;
}

.dot.active {
  opacity: 1;
  box-shadow: 0 0 5px currentColor;
}

.red {
  background: #ff5252;
  color: #ff5252;
}

.yellow {
  background: #ffb142;
  color: #ffb142;
}

.green {
  background: #2ccce4;
  color: #2ccce4;
}

.close-btn {
  background: #ff5252;
  border: 2px solid #000;
  color: #fff;
  font-weight: bold;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  box-shadow: 2px 2px 0 #000;
}

.close-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.screen-container {
  background: #91bd9c;
  border: 3px solid #000;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: inset 3px 3px 0 rgba(0, 0, 0, 0.1);
  font-family: 'Courier New', monospace;
  transition: background-color 0.3s ease;
}

.screen-error {
  background: #ff5252 !important;
}

.mini-msg {
  font-size: 10px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-transform: uppercase;
  min-height: 12px;
}

.main-display {
  font-size: 28px;
  font-weight: 900;
  text-align: right;
  color: #000;
  letter-spacing: 2px;
  overflow: hidden;
  white-space: nowrap;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.toon-btn {
  background: #fff;
  border: 3px solid #000;
  border-radius: 10px;
  padding: 9px 0;
  font-size: 18px;
  font-weight: 900;
  color: #000;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: transform 0.1s;
}

.toon-btn:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

.action-c {
  background: #ffb142;
}

.action-ok {
  background: #33d9b2;
}

.brand {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 11px;
  color: #555;
  letter-spacing: 1px;
  border-top: 2px solid #000;
  padding-top: 10px;
}
</style>