<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps(['steps', 'active']);
const emit = defineEmits(['close']);

const isVisible = ref(false);
const currentStep = ref(0);
const rect = ref({ x: 0, y: 0, width: 0, height: 0 });

const currentStepData = computed(() => {
  return props.steps && props.steps[currentStep.value]
      ? props.steps[currentStep.value]
      : { title: '', icon: '', description: '', target: '' };
});

const updateRect = () => {
  if (!isVisible.value) return;
  const el = document.querySelector(currentStepData.value.target);
  if (el) {
    const r = el.getBoundingClientRect();
    rect.value = { x: r.left, y: r.top, width: r.width, height: r.height };
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const cardPosition = computed(() => {
  const gap = 20;
  const isBottom = rect.value.y > window.innerHeight / 2;
  const cardWidth = 340;

  return {
    top: isBottom ? `${rect.value.y - 180 - gap}px` : `${rect.value.y + rect.value.height + gap}px`,
    left: `${Math.max(15, Math.min(window.innerWidth - cardWidth - 15, rect.value.x + (rect.value.width / 2) - (cardWidth / 2)))}px`
  };
});

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++;

    nextTick(() => setTimeout(updateRect, 100));
  } else {
    close();
  }
};

const close = () => {
  isVisible.value = false;
  emit('close');
};

onMounted(() => {
  window.addEventListener('resize', updateRect);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateRect);
});

watch(() => props.active, (val) => {
  if (val) {
    isVisible.value = true;
    currentStep.value = 0;
    nextTick(() => setTimeout(updateRect, 300));
  }
});
</script>

<template>
  <Teleport to="body">
    <transition name="fade-guide">
      <div v-if="isVisible" class="custom-guide-overlay">

        <svg class="guide-svg-overlay">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white"/>
              <rect
                  :x="rect.x - 4"
                  :y="rect.y - 4"
                  :width="rect.width + 8"
                  :height="rect.height + 8"
                  rx="12"
                  fill="black"
                  class="spotlight-transition"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.75)" mask="url(#spotlight-mask)"/>
        </svg>

        <div
            v-if="currentStepData && currentStepData.target"
            class="game-guide-card move-transition"
            :style="cardPosition"
        >

          <transition name="fade-content" mode="out-in">
            <div :key="currentStep" class="card-content-wrapper">

              <div class="game-guide-header">
                <div class="header-main">
                  <img v-if="currentStepData.icon" :src="currentStepData.icon" class="card-mini-icon" alt="" />
                  <h3>{{ currentStepData.title }}</h3>
                </div>
                <button class="close-guide" @click="close">×</button>
              </div>

              <div class="game-guide-body">
                <div class="guide-desc">
                  <ul v-if="Array.isArray(currentStepData.description)" class="guide-list">
                    <li v-for="(item, index) in currentStepData.description" :key="index">
                      <span v-html="item.text"></span>
                    </li>
                  </ul>
                  <p v-else v-html="currentStepData.description"></p>
                </div>

                <div class="game-guide-footer">
                  <div class="progress-text">Шаг {{ currentStep + 1 }} / {{ steps.length }}</div>
                  <button @click="nextStep" class="game-btn-next">
                    {{ currentStep === steps.length - 1 ? 'В бой!' : 'Дальше' }}
                  </button>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>

.fade-guide-enter-active, .fade-guide-leave-active { transition: opacity 0.5s ease; }
.fade-guide-enter-from, .fade-guide-leave-to { opacity: 0; }

.fade-content-enter-active, .fade-content-leave-active { transition: opacity 0.15s ease; }
.fade-content-enter-from, .fade-content-leave-to { opacity: 0; }

.custom-guide-overlay { position: fixed; inset: 0; z-index: 99999; }
.guide-svg-overlay { width: 100%; height: 100%; }

.spotlight-transition, .game-guide-card.move-transition {
  transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.game-guide-card {
  position: absolute;
  width: 340px;
  background: #fffcee;
  border-radius: 20px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  pointer-events: auto;
}

.game-guide-header {
  background: #1889d3;
  border-bottom: 4px solid #1e1e1e;
  border-radius: 16px 16px 0 0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-mini-icon {
  width: 50px;
  height: 50px;
}

.game-guide-header h3 {
  margin: 0;
  color: #FFFFFF;
  font-weight: 900;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-guide {
  background: none;
  border: none;
  font-size: 26px;
  font-weight: bold;
  color: #1e1e1e;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  margin-top: -4px;
}

.game-guide-body { padding: 18px 20px 20px; }

.guide-desc {
  margin-bottom: 20px;
  color: #1e1e1e;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.guide-list { list-style: none; padding: 0; margin: 0; }

.guide-list li {
  position: relative;
  padding-left: 22px;
  margin-bottom: 10px;
}

.guide-list li::before {
  content: "►";
  position: absolute;
  left: 0;
  color: #e39910;
  font-size: 12px;
  top: 3px;
}

.game-guide-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px dashed #ccc;
  padding-top: 15px;
}

.progress-text {
  font-weight: 800;
  color: #888;
  font-size: 14px;
}

.game-btn-next {
  background: #3498db;
  color: #fff;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  padding: 8px 20px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.1s ease;
  text-transform: uppercase;
}

.game-btn-next:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #1e1e1e;
}
</style>