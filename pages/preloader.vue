<template>
  <main class="de-preloader" role="main" aria-busy="true">
    <div class="frame">
      <!-- Герб -->
      <div class="crest" aria-hidden="true">
        <div class="ring"></div>
        <div class="umlaut umlaut-left">•</div>
        <div class="umlaut umlaut-right">•</div>
        <div class="glyph">Ä</div>
      </div>

      <!-- Заголовок -->
      <h1 class="title">Загружаем немецкий язык…</h1>

      <!-- Меняющаяся фраза (у каждой свой цвет) -->
      <p
          class="subtitle"
          :key="phraseIndex"
          :style="{ color: currentPhrase.color }"
      >
        {{ currentPhrase.text }}
      </p>
      <div class="progress" role="progressbar"
           :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="progress">
        <div class="meter" :style="{ width: progress + '%' }"></div>
        <div class="bar">
          <span class="flag flag-black"></span>
          <span class="flag flag-red"></span>
          <span class="flag flag-gold"></span>
        </div>
      </div>
      <div class="percent">{{ progress }}%</div>

      <!-- Случайная шпаргалка (одна на запуск) -->
      <p v-if="tip" class="tip">{{ tip.label }} — {{ tip.text }}</p>
    </div>
  </main>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
const progress = ref(0)
let progressTimer = null
let phraseTimer = null
const tip = ref(null)
const phraseIndex = ref(0)
const phraseSet = [
  {text: 'Artikel werden beschworen…', color: 'black'},
  {text: 'Wörter werden geschmiedet…', color: '#c68a00'},
  {text: 'Der, die, das – fast da!', color: '#dd0000'},
  {text: 'Grammatik-Magie wird geladen…', color: '#c68a00'},
  {text: 'Aussprache wird vorbereitet…', color: '#dd0000'},
  {text: 'Karten werden gemischt…', color: '#c68a00'},
  {text: 'Pluralformen erscheinen…', color: '#dd0000'},
  {text: 'Genauigkeit +10%…', color: 'green'}
]
const currentPhrase = computed(() => phraseSet[phraseIndex.value % phraseSet.length])
const tips = [
  {label: 'Nominativ — RESE', text: 'der / die / das / die (Pl.) — формула RESE'},
  {label: 'Akkusativ — NESE', text: 'den / die / das / die — формула NESE'},
  {label: 'Dativ — MRMN', text: 'dem / der / dem / den (+ -n в Pl.) — MRMN'},
  {label: 'Genitiv — SRSR', text: 'des / der / des / der — формула SRSR'},
  {label: 'Akk.-Pronomen', text: 'mich, dich, ihn, sie, es, uns, euch, sie'},
  {label: 'Dat.-Pronomen', text: 'mir, dir, ihm, ihr, ihm, uns, euch, ihnen'},
  {label: 'Adj. (Nom. с der)', text: 'окончания прилаг.: -e / -e / -e / -en'}
]
function start() {
  progressTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 1)
    if (progress.value >= 100) finish()
  }, 40)

  phraseTimer = setInterval(() => {
    phraseIndex.value = (phraseIndex.value + 1) % phraseSet.length
  }, 1200)
}

function finish() {
  clearAll()
  progress.value = 100
  // тут можно сделать редирект: useRouter().push('/')
}

function clearAll() {
  if (progressTimer) clearInterval(progressTimer)
  if (phraseTimer) clearInterval(phraseTimer)
  progressTimer = null
  phraseTimer = null
}

onMounted(() => {
  phraseIndex.value = Math.floor(Math.random() * phraseSet.length)
  tip.value = tips[Math.floor(Math.random() * tips.length)]
  start()
})

onBeforeUnmount(() => clearAll())
</script>

<style scoped>
.de-preloader {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: var(--bg);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  position: fixed;
  top: 0;
  z-index: 9;
  left: 0;
  width: 100%;
}

.frame {
  width: min(960px, 94vw);
  padding: 28px 24px 18px;
  border-radius: 18px;
  text-align: center;
}

.title {
  margin: 4px auto 8px;
  padding: 8px 18px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 25px;
}

.subtitle {
  opacity: .9;
  min-height: 1.6em;
  margin: 0 0 16px;
  font-size: 17px;
  font-weight: 600;
}

.crest {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: #fff;
}

.glyph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 52px;
}

.umlaut {
  position: absolute;
  top: 18px;
  font-size: 18px;
}

.umlaut-left {
  left: 40%;
}

.umlaut-right {
  right: 40%;
}

.progress {
  position: relative;
  width: 90%;
  height: 30px;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  margin: 0 auto;
}

.bar {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.meter {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: 2;
  width: 0;
  background: #a58554;
  border-radius: inherit;
  transition: width .18s ease;
}

.percent {
  margin: 15px;
}

.tip {
  margin-top: 10px;
  font-size: 14px;
  color: var(--titleColor);
}

@media (max-width: 420px) {
  .frame {
    padding: 20px 16px 14px;
    border-radius: 16px;
  }

  .crest {
    width: 96px;
    height: 96px;
  }

  .glyph {
    font-size: 44px;
  }
}
</style>
