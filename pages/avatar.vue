<template>
  <div class="avatar-creator">
    <h2>Создай аватара 🧑‍🎨</h2>

    <div class="controls-mobile">
      <div class="control-card">
        <label>Пол:</label>
        <div class="radio-group">
          <label><input type="radio" value="male" v-model="gender" /> ♂️ Мужской</label>
          <label><input type="radio" value="female" v-model="gender" /> ♀️ Женский</label>
        </div>
      </div>

      <div class="control-card">
        <label for="hairColor">Цвет волос:</label>
        <input id="hairColor" type="color" v-model="hairColor" />
      </div>

      <div class="control-card">
        <label for="clothesColor">Цвет одежды:</label>
        <input id="clothesColor" type="color" v-model="clothesColor" />
      </div>

      <div class="control-card toggle">
        <label for="glasses">Очки</label>
        <input id="glasses" type="checkbox" v-model="hasGlasses" />
      </div>

      <div class="control-card toggle" v-if="gender === 'male'">
        <label for="tie">Галстук</label>
        <input id="tie" type="checkbox" v-model="hasTie" />
      </div>
    </div>

    <div class="avatar-preview" :style="cssVars">
      <div class="person">

        <div class="ears">
          <div class="ear left"></div>
          <div class="ear right"></div>
        </div>

        <div class="hair-back" v-if="gender === 'female'"></div>

        <div class="head">
          <div class="hair-front" :class="gender"></div>

          <div class="eyes">
            <div class="eye">
              <div class="lashes" v-if="gender === 'female'"></div>
            </div>
            <div class="eye">
              <div class="lashes" v-if="gender === 'female'"></div>
            </div>
          </div>

          <div v-if="hasGlasses" class="glasses">
            <div class="glass"></div>
            <div class="bridge"></div>
            <div class="glass"></div>
          </div>

          <div class="mouth" :class="{ 'female-mouth': gender === 'female' }"></div>
        </div>

        <div class="body">
          <div class="collar"></div>
          <div v-if="hasTie && gender === 'male'" class="tie">
            <div class="tie-knot"></div>
            <div class="tie-bottom"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const gender = ref('male')
const hairColor = ref('#2c3e50')
const clothesColor = ref('#42b883')
const hasGlasses = ref(false)
const hasTie = ref(false)

const cssVars = computed(() => ({
  '--hair-color': hairColor.value,
  '--clothes-color': clothesColor.value
}))
</script>

<style scoped>
.avatar-creator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.controls-mobile {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.control-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f4f5;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
}

.control-card input[type="color"] {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
}

.control-card input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.control-card input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
}

.toggle input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: #42b883;
}

.avatar-preview {
  width: 280px;
  height: 280px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  margin-top: 10px;
  flex-shrink: 0;
}

.person {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 90%;
}

.ears {
  position: absolute;
  top: 60px;
  width: 130px;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}

.ear {
  width: 25px;
  height: 35px;
  background-color: #eac086;
  border-radius: 50%;
}

.head {
  position: relative;
  width: 110px;
  height: 130px;
  background-color: #ffdbac;
  border-radius: 55px 55px 45px 45px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}

.hair-front {
  position: absolute;
  top: -10px;
  background-color: var(--hair-color);
  z-index: 3;
  transition: all 0.3s ease;
}

.hair-front.male {
  width: 120px;
  height: 40px;
  border-radius: 60px 60px 15px 15px;
}

.hair-front.female {
  width: 125px;
  height: 45px;
  border-radius: 65px 65px 10px 10px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 80%, 50% 100%, 30% 80%, 0 100%);
}

.hair-back {
  position: absolute;
  top: 30px;
  width: 140px;
  height: 160px;
  background-color: var(--hair-color);
  border-radius: 70px 70px 20px 20px;
  z-index: 0;
  transition: background-color 0.3s ease;
}

.eyes {
  display: flex;
  gap: 24px;
  margin-bottom: 18px;
  z-index: 4;
}

.eye {
  position: relative;
  width: 12px;
  height: 12px;
  background-color: #333;
  border-radius: 50%;
}

.lashes {
  position: absolute;
  top: -4px;
  right: -5px;
  width: 8px;
  height: 8px;
  border-top: 3px solid #333;
  border-right: 3px solid #333;
  border-radius: 0 50% 0 0;
}

.mouth {
  width: 30px;
  height: 12px;
  border-bottom: 3px solid #cc9976;
  border-radius: 0 0 20px 20px;
  transition: all 0.3s ease;
  z-index: 4;
}

.female-mouth {
  width: 20px;
  height: 10px;
  background-color: #e67e80;
  border: none;
  border-radius: 10px 10px 20px 20px;
}

.glasses {
  position: absolute;
  top: 42px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 5;
}

.glass {
  width: 38px;
  height: 38px;
  border: 4px solid #333;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.bridge {
  width: 10px;
  height: 4px;
  background-color: #333;
}

.body {
  position: relative;
  width: 170px;
  height: 110px;
  background-color: var(--clothes-color);
  border-radius: 85px 85px 0 0;
  margin-top: -10px;
  z-index: 1;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.collar {
  width: 60px;
  height: 15px;
  background-color: #fff;
  border-radius: 0 0 30px 30px;
  z-index: 2;
}

.tie {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -5px;
  z-index: 3;
}

.tie-knot {
  width: 14px;
  height: 14px;
  background-color: #e74c3c;
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
}

.tie-bottom {
  width: 24px;
  height: 50px;
  background-color: #e74c3c;
  clip-path: polygon(25% 0, 75% 0, 100% 80%, 50% 100%, 0 80%);
  margin-top: -2px;
}
</style>