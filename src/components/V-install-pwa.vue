<script setup>
import { ref, onMounted } from 'vue'
import AppIcon from '~/assets/images/instalAppIcon.svg'
import { pwaInstructions } from '~/utils/pwaInstructions.js'
import { userAuthStore} from "../../store/authStore.js";

const isVisible = ref(false)
const { t } = useI18n()
const authStore = userAuthStore()
const closeModal = () => {
  isVisible.value = false
  localStorage.setItem('pwa_instruction_seen', 'true')
}

onMounted(() => {
  if (!localStorage.getItem('pwa_instruction_seen')) {
    setTimeout(() => {
      isVisible.value = true
    }, 5200)
  }
})

</script>
<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isVisible && authStore.uid" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <button class="close-btn" @click="closeModal">✕</button>
            <div class="modal-header">
              <div class="modal__header-inner">
                <img class="modal-icon" :src="AppIcon" alt="AppIcon">
                <h3>{{ t('pwa.title')}}</h3>
              </div>
              <p>{{ t('pwa.sub')}}</p>
            </div>
            <div class="instructions-list">
              <div
                  v-for="item in pwaInstructions"
                  :key="item.id"
                  class="instruction-item"
              >
                <div class="os-title">
                  <div class="os__icon-wrapper">
                    <img class="os__icon" :src="item.icon" alt="">
                  </div>
                  <div>{{ t(item.title) }}</div>
                </div>
                <ol v-if="item.isList">
                  <li
                      v-for="(step, index) in item.steps"
                      :key="index"
                      v-html="t(step)"
                  ></li>
                </ol>
                <div v-else>
                  <p
                      v-for="(step, index) in item.steps"
                      :key="index"
                      v-html="t(step)"
                  ></p>
                </div>
              </div>
            </div>
            <button class="btn-primary" @click="closeModal">{{ t('pwa.btn')}}</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal__header-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.os__icon {
  width: 24px;
  margin-right: 6px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 20px;
}

.modal-content {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  position: relative;
  color: #fff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.modal-icon {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  margin-right: 5px;
}

.modal-header h3 {
  font-size: 19px;
  font-weight: 800;
}

.modal-header p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.instructions-list {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 15px;
}

.instruction-item {
  margin-bottom: 16px;
}

.instruction-item:last-child {
  margin-bottom: 0;
}

.os-title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 6px;
  color: #60a5fa;
  display: flex;
  align-items: center;
}

.instruction-item ol, .instruction-item p {
  margin: 0;
  padding-left: 27px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

.instruction-item li {
  margin-bottom: 4px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: #3b82f6;
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

@media (min-width: 1024px) {
  .btn-primary:hover {
    background-color: #2563eb;
  }
}
</style>